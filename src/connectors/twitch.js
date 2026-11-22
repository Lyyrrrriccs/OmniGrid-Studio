const WebSocket = require('ws');
const https = require('https');
const { EventEmitter } = require('events');

/**
 * Connects to Twitch Chat via official IRC WebSocket (wss://irc-ws.chat.twitch.tv:443).
 * Parses all 7 required event types distinctly:
 * - sub (Neues Sub)
 * - resub (Resub mit Monats-Laufzeit)
 * - subgift (Gifted Subs mit Anzahl & Schenkendem + MysteryGift-Deduplizierung)
 * - bits (Bits / Cheers mit Bit-Anzahl)
 * - raid (Raid mit Kanalname & Zuschauerzahl)
 * - highlighted_msg (Durch Kanalpunkte hervorgehobene Chatnachricht)
 */
class TwitchConnector extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.channel = null;
    this.oauthToken = null;
    this.clientId = '';
    this.userId = '';
    this.roomId = '';
    this.scopes = [];
    this.authWarning = '';
    this.canWrite = false;
    this.username = null;
    this.connected = false;
    this.reconnectTimer = null;
    this.shouldReconnect = false;
    this.reconnectAttempts = 0;
    this.pingInterval = null;
    this.statsInterval = null;
    this.viewers = 0;
    this.seenIds = new Set();
    // Tracks recent mass subgift senders (giver -> timestamp) to prevent duplicate single subgift lines
    this.recentMassGiftSenders = new Map();
  }

  static normalizeChannelName(input) {
    let raw = String(input || '').trim();
    if (!raw) return '';
    // Extract username if user pasted a full URL like https://www.twitch.tv/lyrrrrics or twitch.tv/lyrrrrics/chat
    const urlMatch = raw.match(/twitch\.tv\/(?:popout\/)?([a-zA-Z0-9_]+)/i);
    if (urlMatch && urlMatch[1]) {
      raw = urlMatch[1];
    }
    return raw.replace(/^#/, '').replace(/^@/, '').split(/[/?&#\s]/)[0].toLowerCase();
  }

  async connect({ channel, oauthToken = '', username = '' }) {
    this.disconnect(false);
    const cleanChannel = TwitchConnector.normalizeChannelName(channel);
    if (!cleanChannel) return;

    this.channel = cleanChannel;
    const rawToken = oauthToken ? oauthToken.trim() : '';
    const cleanUser = TwitchConnector.normalizeChannelName(username) || cleanChannel;
    this.username = cleanUser;
    this.authWarning = '';
    this.shouldReconnect = true;
    this.reconnectAttempts = 0;

    // Check if the user accidentally entered an OBS Stream Key ("live_12345_xxxx") instead of a Chat OAuth Token
    if (/^live_\d+_/i.test(rawToken)) {
      this.oauthToken = '';
      this.canWrite = false;
      this.authWarning =
        'Hinweis: Du hast deinen OBS-Stream-Key ("live_...") statt eines Chat-OAuth-Tokens eingegeben! Chat-Empfang läuft jetzt aktiv im Lese-Modus.';
    } else if (rawToken) {
      const check = await this._validateToken(rawToken);
      if (!this.shouldReconnect) return;
      if (!check.ok) {
        this.oauthToken = '';
        this.canWrite = false;
        this.authWarning = check.reason;
      } else {
        this.oauthToken = rawToken;
        if (check.login) {
          this.username = check.login.toLowerCase();
        }
        this.canWrite = true;
      }
    } else {
      this.oauthToken = '';
      this.canWrite = false;
    }

    this._openSocket();
  }

  _validateToken(rawToken) {
    return new Promise((resolve) => {
      const cleanTok = rawToken.replace(/^oauth:/i, '').trim();
      if (!cleanTok) return resolve({ ok: false, reason: 'Leerer Token.' });

      const req = https.get(
        'https://id.twitch.tv/oauth2/validate',
        {
          headers: { Authorization: `OAuth ${cleanTok}` },
          timeout: 4500
        },
        (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => {
            if (res.statusCode === 401) {
              return resolve({
                ok: false,
                reason:
                  'Twitch Chat-Token ist abgelaufen oder ungültig! Lese-Modus aktiv — bitte neuen Token mit "chat:read" & "chat:edit" holen.'
              });
            }
            try {
              const info = JSON.parse(body);
              const scopes = Array.isArray(info.scopes) ? info.scopes : [];
              this.clientId = info.client_id || this.clientId || '';
              this.userId = info.user_id || this.userId || '';
              this.scopes = scopes;
              const hasRead = scopes.includes('chat:read');
              const hasEdit = scopes.includes('chat:edit');
              if (!hasRead || !hasEdit) {
                return resolve({
                  ok: false,
                  reason:
                    'Dein Twitch-Token hat keine Chat-Rechte (scopes: chat:read / chat:edit fehlen)! Chat läuft im Lese-Modus — bitte auf twitchtokengenerator.com "Bot Chat Token" wählen.'
                });
              }
              return resolve({ ok: true, login: info.login || '', clientId: this.clientId, userId: this.userId });
            } catch (e) {
              return resolve({ ok: true, login: '' });
            }
          });
        }
      );
      req.on('error', () => resolve({ ok: true, login: '' }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: true, login: '' });
      });
    });
  }

  reconnect() {
    if (!this.channel) return;
    this.connect({
      channel: this.channel,
      oauthToken: this.oauthToken,
      username: this.username
    });
  }

  _rememberId(id) {
    if (!id) return false;
    if (this.seenIds.has(id)) return true;
    this.seenIds.add(id);
    if (this.seenIds.size > 1200) {
      const oldest = this.seenIds.values().next().value;
      this.seenIds.delete(oldest);
    }
    return false;
  }

  _openSocket() {
    clearTimeout(this.reconnectTimer);
    this.emit('status', {
      platform: 'twitch',
      status: this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting',
      channel: this.channel,
      viewers: this.viewers,
      error: this.authWarning || '',
      attempt: this.reconnectAttempts
    });

    try {
      this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    } catch (err) {
      this._scheduleReconnect(err.message);
      return;
    }

    this.ws.on('open', () => {
      this.reconnectAttempts = 0;
      this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');

      if (this.oauthToken) {
        const cleanTok = this.oauthToken.replace(/^oauth:/i, '').trim();
        const pass = `oauth:${cleanTok}`;
        const nick = this.username || this.channel || 'streamer';
        this.ws.send(`PASS ${pass}`);
        this.ws.send(`NICK ${nick}`);
      } else {
        const anonNick = `justinfan${Math.floor(10000 + Math.random() * 89999)}`;
        this.ws.send('PASS SCHMOOPIIE');
        this.ws.send(`NICK ${anonNick}`);
      }

      this.ws.send(`JOIN #${this.channel}`);
    });

    this.ws.on('message', (data) => {
      const raw = data.toString();
      const lines = raw.split('\r\n');
      for (const line of lines) {
        if (!line) continue;
        if (line.startsWith('PING')) {
          this.ws.send('PONG :tmi.twitch.tv');
          continue;
        }
        // Detect ANY Twitch IRC auth rejection and immediately fall back to anonymous read-only mode!
        if (
          line.includes('Login authentication failed') ||
          line.includes('Login unsuccessful') ||
          line.includes('Improperly formatted auth')
        ) {
          this.oauthToken = '';
          this.canWrite = false;
          this.authWarning =
            'Twitch OAuth-Token wurde abgelehnt (Rechte/Ablauf) — Automatisch im Lese-Modus verbunden (Chat lesen aktiv; zum Schreiben "Bot Chat Token" neu generieren).';
          try {
            this.ws.removeAllListeners();
            this.ws.close();
          } catch (e) {}
          this._openSocket();
          return;
        }

        // Confirm real IRC login on 001 Welcome before marking connected
        if (!this.connected && line.includes(' 001 ')) {
          this.connected = true;
          this.canWrite = Boolean(this.oauthToken);
          this.emit('status', {
            platform: 'twitch',
            status: 'connected',
            channel: this.channel,
            canWrite: this.canWrite,
            error: this.authWarning || '',
            viewers: this.viewers
          });

          this._pollViewerCount();
          clearInterval(this.statsInterval);
          this.statsInterval = setInterval(() => this._pollViewerCount(), 30000);

          clearInterval(this.pingInterval);
          this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send('PING :tmi.twitch.tv');
            }
          }, 45000);
          continue;
        }

        try {
          this._parseIrcLine(line);
        } catch (e) {}
      }
    });

    this.ws.on('close', () => {
      this.connected = false;
      clearInterval(this.pingInterval);
      clearInterval(this.statsInterval);

      if (this.shouldReconnect) {
        this._scheduleReconnect('Verbindung getrennt – verbinde automatisch neu...');
      } else {
        this.emit('status', {
          platform: 'twitch',
          status: 'disconnected',
          channel: this.channel,
          viewers: 0
        });
      }
    });

    this.ws.on('error', (err) => {
      this.emit('status', {
        platform: 'twitch',
        status: this.shouldReconnect ? 'reconnecting' : 'error',
        channel: this.channel,
        error: err.message,
        viewers: this.viewers
      });
    });
  }

  _scheduleReconnect(reason = '') {
    if (!this.shouldReconnect) return;
    this.reconnectAttempts += 1;
    const delayMs = Math.min(15000, 2000 * Math.pow(1.4, Math.min(5, this.reconnectAttempts - 1)));

    this.emit('status', {
      platform: 'twitch',
      status: 'reconnecting',
      channel: this.channel,
      error: `${reason} (Versuch #${this.reconnectAttempts})`,
      viewers: this.viewers
    });

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) this._openSocket();
    }, delayMs);
  }

  _pollViewerCount() {
    if (!this.channel || !this.connected) return;
    const body = JSON.stringify({
      query: `query { user(login: "${this.channel}") { stream { viewersCount } } }`
    });

    const req = https.request(
      'https://gql.twitch.tv/gql',
      {
        method: 'POST',
        headers: {
          'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        timeout: 4500
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            const stream = j?.data?.user?.stream;
            this.viewers = stream ? Number(stream.viewersCount || 0) : 0;
            this.emit('stats', {
              platform: 'twitch',
              viewers: this.viewers,
              isLive: Boolean(stream)
            });
          } catch (e) {}
        });
      }
    );
    req.on('error', () => {});
    req.write(body);
    req.end();
  }

  _parseTags(line) {
    let tags = {};
    let rest = line;
    if (line.startsWith('@')) {
      const spaceIdx = line.indexOf(' ');
      const tagStr = line.slice(1, spaceIdx);
      rest = line.slice(spaceIdx + 1);
      for (const pair of tagStr.split(';')) {
        const eqIdx = pair.indexOf('=');
        if (eqIdx !== -1) {
          const k = pair.slice(0, eqIdx);
          const v = pair.slice(eqIdx + 1).replace(/\\s/g, ' ');
          tags[k] = v;
        }
      }
    }
    return { tags, rest };
  }

  _parseIrcLine(line) {
    if (line.includes('ROOMSTATE')) {
      const { tags } = this._parseTags(line);
      if (tags['room-id']) {
        this.emit('room-id', tags['room-id']);
      }
      return;
    }

    if (line.includes('CLEARMSG')) {
      const { tags } = this._parseTags(line);
      if (tags['target-msg-id']) {
        this.emit('delete-message', tags['target-msg-id']);
      }
      return;
    }

    // Handle USERNOTICE: sub, resub, subgift, submysterygift, raid
    if (line.includes('USERNOTICE')) {
      const { tags, rest } = this._parseTags(line);
      const msgId = tags['msg-id'] || '';
      const serverTs = tags['tmi-sent-ts'] ? parseInt(tags['tmi-sent-ts'], 10) : Date.now();
      const uniqueId = tags.id || `tw_un_${serverTs}_${tags.login || ''}_${msgId}`;
      if (this._rememberId(uniqueId)) return;

      const login = tags['display-name'] || tags.login || 'TwitchUser';
      let userText = '';
      const colonIdx = rest.indexOf(' :');
      if (colonIdx !== -1) {
        userText = rest.slice(colonIdx + 2);
      }

      // 1. Neues Sub
      if (msgId === 'sub') {
        const plan = tags['msg-param-sub-plan'] === 'Prime' ? 'Prime' : 'Tier 1';
        const summary = `Neues Abo (${plan})!`;
        this._emitUnifiedEventAndChat({
          id: uniqueId,
          eventType: 'sub',
          badgeLabel: `⭐ NEUES SUB (${plan})`,
          author: login,
          summary,
          text: userText ? `${summary} — "${userText}"` : summary,
          twitchEmotes: tags.emotes || '',
          timestamp: serverTs
        });
        return;
      }

      // 2. Resub (mit Monats-Laufzeit!)
      if (msgId === 'resub') {
        const months = tags['msg-param-cumulative-months'] || tags['msg-param-months'] || '1';
        const plan = tags['msg-param-sub-plan'] === 'Prime' ? 'Prime' : 'Sub';
        const summary = `Resub im ${months}. Monat (${plan})!`;
        this._emitUnifiedEventAndChat({
          id: uniqueId,
          eventType: 'resub',
          badgeLabel: `🌟 RESUB (${months} MONATE)`,
          author: login,
          summary,
          text: userText ? `${summary} — "${userText}"` : summary,
          twitchEmotes: tags.emotes || '',
          timestamp: serverTs
        });
        return;
      }

      // 3. Gifted Subs (Mass Subgift Bomb OR Single Subgift, deduplicated!)
      if (msgId === 'submysterygift') {
        const massCount = parseInt(tags['msg-param-mass-gift-count'] || '1', 10);
        this.recentMassGiftSenders.set(login.toLowerCase(), Date.now());
        const summary = `verschenkt ${massCount}x Subs an die Community!`;
        this._emitUnifiedEventAndChat({
          id: uniqueId,
          eventType: 'subgift',
          badgeLabel: `🎁 ${massCount}x GIFTED SUBS`,
          author: login,
          summary,
          text: summary,
          twitchEmotes: '',
          timestamp: serverTs
        });
        return;
      }

      if (msgId === 'subgift') {
        const lastMass = this.recentMassGiftSenders.get(login.toLowerCase()) || 0;
        // If part of a submysterygift bomb within the last 4 seconds, skip individual spam lines!
        if (Date.now() - lastMass < 4000) return;

        const recipient = tags['msg-param-recipient-display-name'] || tags['msg-param-recipient-user-name'] || 'Zuschauer';
        const summary = `hat 1 Sub an ${recipient} verschenkt!`;
        this._emitUnifiedEventAndChat({
          id: uniqueId,
          eventType: 'subgift',
          badgeLabel: `🎁 GIFTED SUB`,
          author: login,
          summary,
          text: summary,
          twitchEmotes: '',
          timestamp: serverTs
        });
        return;
      }

      // 4. Raid (mit raidendem Kanal und Zuschauerzahl!)
      if (msgId === 'raid') {
        const raider = tags['msg-param-displayName'] || login;
        const viewerCount = tags['msg-param-viewerCount'] || '1';
        const summary = `raidet den Kanal mit ${viewerCount} Zuschauern!`;
        this._emitUnifiedEventAndChat({
          id: uniqueId,
          eventType: 'raid',
          badgeLabel: `🚨 RAID (${viewerCount} ZUSCHAUER)`,
          author: raider,
          summary,
          text: summary,
          twitchEmotes: '',
          timestamp: serverTs
        });
        return;
      }
      return;
    }

    if (!line.includes('PRIVMSG')) return;

    const { tags, rest } = this._parseTags(line);
    if (tags['room-id']) {
      this.roomId = tags['room-id'];
      this.emit('room-id', tags['room-id']);
    }

    const privIdx = rest.indexOf('PRIVMSG');
    if (privIdx === -1) return;

    const afterPriv = rest.slice(privIdx + 8);
    const colonIdx = afterPriv.indexOf(' :');
    if (colonIdx === -1) return;

    const text = afterPriv.slice(colonIdx + 2);
    const prefixMatch = rest.match(/^:([^!]+)!/);
    const fallbackUser = prefixMatch ? prefixMatch[1] : 'TwitchUser';
    const author = tags['display-name'] || fallbackUser;
    const serverTs = tags['tmi-sent-ts'] ? parseInt(tags['tmi-sent-ts'], 10) : Date.now();
    const msgId = tags.id || `tw_${serverTs}_${author}_${text.slice(0, 16)}`;

    if (this._rememberId(msgId)) return;

    const badges = [];
    if (tags.badges) {
      if (tags.badges.includes('broadcaster')) badges.push('STREAMER');
      if (tags.badges.includes('moderator')) badges.push('MOD');
      if (tags.badges.includes('vip')) badges.push('VIP');
      if (tags.badges.includes('subscriber')) badges.push('SUB');
    }

    // Determine if this PRIVMSG is an actual Bits Cheer OR a Highlighted Message event.
    // Normal messages from subscribers/followers are NEVER automatically highlighted!
    let eventType = null;
    if (tags.bits) {
      eventType = 'bits';
      badges.unshift(`💎 ${tags.bits} BITS`);
      this.emit('event', {
        id: `ev_${msgId}`,
        platform: 'twitch',
        type: 'bits',
        author,
        summary: `hat ${tags.bits} Bits gecheert!`,
        timestamp: serverTs
      });
    } else if (tags['msg-id'] === 'highlighted-message' || tags['custom-reward-id']) {
      eventType = 'highlighted_msg';
      badges.unshift('✨ HERVORGEHOBEN');
    }

    this.emit('chat', {
      id: msgId,
      platform: 'twitch',
      channel: this.channel,
      author,
      color: tags.color || '#a970ff',
      badges,
      text,
      twitchEmotes: tags.emotes || '',
      timestamp: serverTs,
      eventType,
      isHighlight: Boolean(eventType)
    });
  }

  _emitUnifiedEventAndChat({ id, eventType, badgeLabel, author, summary, text, twitchEmotes, timestamp }) {
    this.emit('event', {
      id: `ev_${id}`,
      platform: 'twitch',
      type: eventType,
      author,
      summary,
      timestamp
    });

    this.emit('chat', {
      id,
      platform: 'twitch',
      channel: this.channel,
      author,
      color: '#f8fafc',
      badges: [badgeLabel],
      text,
      twitchEmotes: twitchEmotes || '',
      timestamp,
      eventType,
      isHighlight: true
    });
  }

  /**
   * Fetches Twitch user profile avatar, account creation date (Account-Alter), and bio via public Twitch GQL
   */
  getUserInfo(loginName) {
    return new Promise((resolve) => {
      if (!loginName) return resolve(null);
      const clean = loginName.trim().toLowerCase();
      const body = JSON.stringify({
        query: `query { user(login: "${clean}") { id login displayName profileImageURL(width: 70) createdAt description } }`
      });

      const req = https.request(
        'https://gql.twitch.tv/gql',
        {
          method: 'POST',
          headers: {
            'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          },
          timeout: 4000
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try {
              const j = JSON.parse(data);
              const u = j?.data?.user;
              if (!u) return resolve(null);
              resolve({
                id: u.id,
                login: u.login,
                displayName: u.displayName,
                avatar: u.profileImageURL || '',
                createdAt: u.createdAt || null,
                description: u.description || ''
              });
            } catch (e) {
              resolve(null);
            }
          });
        }
      );
      req.on('error', () => resolve(null));
      req.write(body);
      req.end();
    });
  }

  sendMessage(text, replyParentId = null) {
    if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Twitch nicht verbunden.');
    }
    if (!this.oauthToken || !this.canWrite) {
      throw new Error(
        this.authWarning ||
          'Kein gültiger Twitch Chat-OAuth-Token hinterlegt. Klicke links unter Twitch auf "Chat-Token holen / Mit Twitch einloggen".'
      );
    }
    if (replyParentId && !String(replyParentId).startsWith('demo_') && !String(replyParentId).startsWith('tw_')) {
      this.ws.send(`@reply-parent-msg-id=${replyParentId} PRIVMSG #${this.channel} :${text}`);
    } else {
      this.ws.send(`PRIVMSG #${this.channel} :${text}`);
    }

    this.emit('chat', {
      id: `tw_self_${Date.now()}`,
      platform: 'twitch',
      channel: this.channel,
      author: this.username || this.channel || 'Du (Streamer)',
      color: '#34d399',
      badges: ['STREAMER'],
      text,
      timestamp: Date.now(),
      isSelf: true
    });
  }

  async _helixRequest(method, pathAndQuery, bodyObj = null) {
    const cleanTok = String(this.oauthToken || '').replace(/^oauth:/i, '').trim();
    if (!cleanTok) {
      throw new Error('Kein Twitch OAuth-Token hinterlegt.');
    }
    if (!this.clientId || !this.userId) {
      await this._validateToken(cleanTok);
    }
    if (!this.clientId) {
      throw new Error('Twitch Client-ID konnte nicht aus dem OAuth-Token ermittelt werden.');
    }

    const payload = bodyObj ? JSON.stringify(bodyObj) : null;
    const headers = {
      Authorization: `Bearer ${cleanTok}`,
      'Client-Id': this.clientId
    };
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    return new Promise((resolve, reject) => {
      const req = https.request(
        `https://api.twitch.tv${pathAndQuery}`,
        { method, headers, timeout: 8000 },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            let json = null;
            try {
              json = JSON.parse(data);
            } catch (e) {}
            resolve({ statusCode: res.statusCode, json, data });
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Twitch Helix API Timeout'));
      });
      if (payload) req.write(payload);
      req.end();
    });
  }

  async _resolveBroadcasterId() {
    if (this.roomId) return this.roomId;
    if (this.channel) {
      const resp = await this._helixRequest('GET', `/helix/users?login=${encodeURIComponent(this.channel)}`);
      const id = resp.json?.data?.[0]?.id;
      if (id) {
        this.roomId = id;
        return id;
      }
    }
    if (this.userId) return this.userId;
    throw new Error('Twitch Broadcaster-ID nicht bekannt — bitte zuerst Twitch-Kanal verbinden.');
  }

  async createClip() {
    const broadcasterId = await this._resolveBroadcasterId();
    const resp = await this._helixRequest('POST', `/helix/clips?broadcaster_id=${encodeURIComponent(broadcasterId)}`);
    if (resp.statusCode === 401 || resp.statusCode === 403) {
      throw new Error('Fehlende Berechtigung (Scope "clips:edit") — bitte auf twitchtokengenerator.com mit Scope "clips:edit" neu generieren.');
    }
    if (resp.statusCode >= 400) {
      const msg = resp.json?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`Twitch Clip fehlgeschlagen: ${msg}`);
    }
    const item = resp.json?.data?.[0];
    if (!item?.id) {
      throw new Error('Twitch hat keine Clip-ID zurückgegeben (ist der Stream live?).');
    }
    return {
      ok: true,
      id: item.id,
      editUrl: item.edit_url || `https://clips.twitch.tv/${item.id}/edit`,
      url: `https://clips.twitch.tv/${item.id}`
    };
  }

  async createStreamMarker(description = 'OmniStream Highlight') {
    const broadcasterId = await this._resolveBroadcasterId();
    const cleanDesc = String(description || 'OmniStream Highlight').trim().slice(0, 140);
    const resp = await this._helixRequest('POST', '/helix/streams/markers', {
      user_id: broadcasterId,
      description: cleanDesc
    });
    if (resp.statusCode === 401 || resp.statusCode === 403) {
      throw new Error('Fehlende Berechtigung (Scope "channel:manage:broadcast" / "user:edit:broadcast") — bitte Token mit Marker-Rechten neu generieren.');
    }
    if (resp.statusCode >= 400) {
      const msg = resp.json?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`Twitch Stream-Marker fehlgeschlagen: ${msg}`);
    }
    const item = resp.json?.data?.[0] || {};
    return {
      ok: true,
      id: item.id || null,
      createdAt: item.created_at || null,
      positionSeconds: item.position_seconds ?? null,
      description: item.description || cleanDesc
    };
  }

  async getChannelInfo() {
    const broadcasterId = await this._resolveBroadcasterId();
    const resp = await this._helixRequest('GET', `/helix/channels?broadcaster_id=${encodeURIComponent(broadcasterId)}`);
    if (resp.statusCode >= 400) {
      const msg = resp.json?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`Kanal-Info Abruf fehlgeschlagen: ${msg}`);
    }
    const ch = resp.json?.data?.[0];
    if (!ch) throw new Error('Keine Kanaldaten von Twitch erhalten.');
    return {
      ok: true,
      title: ch.title || '',
      gameId: ch.game_id || '',
      gameName: ch.game_name || '',
      tags: Array.isArray(ch.tags) ? ch.tags : []
    };
  }

  async searchCategories(query) {
    const q = String(query || '').trim();
    if (!q) return { ok: true, categories: [] };
    const resp = await this._helixRequest('GET', `/helix/search/categories?query=${encodeURIComponent(q)}&first=10`);
    if (resp.statusCode >= 400) {
      return { ok: false, categories: [] };
    }
    const categories = (resp.json?.data || []).map((c) => ({ id: c.id, name: c.name }));
    return { ok: true, categories };
  }

  async updateChannelInfo({ title, gameId, gameName, tags }) {
    const broadcasterId = await this._resolveBroadcasterId();
    const body = {};
    if (typeof title === 'string' && title.trim()) {
      body.title = title.trim().slice(0, 140);
    }

    let resolvedGameId = String(gameId || '').trim();
    if (!resolvedGameId && typeof gameName === 'string' && gameName.trim()) {
      const gResp = await this._helixRequest('GET', `/helix/games?name=${encodeURIComponent(gameName.trim())}`);
      resolvedGameId = gResp.json?.data?.[0]?.id || '';
      if (!resolvedGameId) {
        const sResp = await this._helixRequest('GET', `/helix/search/categories?query=${encodeURIComponent(gameName.trim())}&first=1`);
        resolvedGameId = sResp.json?.data?.[0]?.id || '';
      }
    }
    if (resolvedGameId) {
      body.game_id = resolvedGameId;
    }

    if (Array.isArray(tags)) {
      body.tags = tags
        .map((t) => String(t || '').replace(/\s+/g, '').slice(0, 25))
        .filter(Boolean)
        .slice(0, 10);
    }

    if (Object.keys(body).length === 0) {
      throw new Error('Keine gültigen Änderungen (Titel, Spiel oder Tags) angegeben.');
    }

    const resp = await this._helixRequest('PATCH', `/helix/channels?broadcaster_id=${encodeURIComponent(broadcasterId)}`, body);
    if (resp.statusCode === 401 || resp.statusCode === 403) {
      throw new Error('Fehlende Berechtigung (Scope "channel:manage:broadcast") — bitte Token mit "channel:manage:broadcast" neu generieren.');
    }
    if (resp.statusCode >= 400) {
      const msg = resp.json?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`Twitch Kanal-Update fehlgeschlagen: ${msg}`);
    }
    return { ok: true, updated: body };
  }

  async createScheduleSegment({ startTimeIso, durationMin = 120, title = '', gameName = '', isRecurring = false }) {
    const broadcasterId = await this._resolveBroadcasterId();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';
    const body = {
      start_time: startTimeIso,
      timezone: tz,
      duration: String(Math.max(30, Math.min(1380, parseInt(durationMin, 10) || 120))),
      is_recurring: Boolean(isRecurring)
    };
    if (title) {
      body.title = String(title).trim().slice(0, 140);
    }
    if (gameName) {
      const gResp = await this._helixRequest('GET', `/helix/games?name=${encodeURIComponent(String(gameName).trim())}`);
      let categoryId = gResp.json?.data?.[0]?.id || '';
      if (!categoryId) {
        const sResp = await this._helixRequest('GET', `/helix/search/categories?query=${encodeURIComponent(String(gameName).trim())}&first=1`);
        categoryId = sResp.json?.data?.[0]?.id || '';
      }
      if (categoryId) body.category_id = categoryId;
    }

    const resp = await this._helixRequest('POST', `/helix/schedule/segment?broadcaster_id=${encodeURIComponent(broadcasterId)}`, body);
    if (resp.statusCode === 401 || resp.statusCode === 403) {
      throw new Error('Fehlende Berechtigung (Scope "channel:manage:schedule") — bitte Twitch OAuth-Token mit "channel:manage:schedule" generieren.');
    }
    if (resp.statusCode >= 400) {
      const msg = resp.json?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`Twitch Schedule Fehler: ${msg}`);
    }
    return { ok: true, segment: resp.json?.data?.segments?.[0] || null };
  }

  disconnect(clearDedupe = false) {
    this.shouldReconnect = false;
    clearTimeout(this.reconnectTimer);
    clearInterval(this.pingInterval);
    clearInterval(this.statsInterval);
    if (clearDedupe) {
      this.seenIds.clear();
      this.recentMassGiftSenders.clear();
    }
    if (this.ws) {
      try {
        this.ws.removeAllListeners();
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.connected = false;
    this.viewers = 0;
    if (this.channel) {
      this.emit('status', { platform: 'twitch', status: 'disconnected', channel: this.channel, viewers: 0 });
    }
  }
}

module.exports = { TwitchConnector };
