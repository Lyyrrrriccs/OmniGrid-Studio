const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { EventEmitter } = require('events');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Connects to YouTube Live Chat without requiring an API key or login!
 * Features:
 * - Auto-discovers active and upcoming livestreams on a channel (`discoverStreams`)
 * - Allows automatic selection OR manual stream selection by videoId
 * - Auto-reconnects on session drops / network hiccups without losing deduplication state (`seenIds`)
 * - Parses exact YouTube server timestamps (`timestampUsec`) for chronological sorting
 * - Optional YouTube Data API v3 OAuth2 PKCE flow for sending chat messages (`sendMessage`)
 */
class YouTubeConnector extends EventEmitter {
  constructor() {
    super();
    this.target = null;
    this.preferredVideoId = null;
    this.videoId = null;
    this.streamTitle = '';
    this.availableStreams = [];
    this.apiKey = null;
    this.continuation = null;
    this.connected = false;
    this.shouldWatch = false;
    this.pollErrors = 0;
    this.pollTimer = null;
    this.retryTimer = null;
    this.statsTimer = null;
    this.seenIds = new Set();
    this.viewers = 0;
    this.oauth = {
      clientId: '',
      clientSecret: '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0,
      accountName: ''
    };
    this.canWrite = false;
    this.liveChatId = null;
    this.liveChatIdForVideo = null;
    this._oauthServer = null;
  }

  async connect({ channelOrUrl, preferredVideoId = '' }) {
    this.disconnect(false);
    if (!channelOrUrl && !preferredVideoId) return;

    this.target = (channelOrUrl || preferredVideoId).trim();
    this.preferredVideoId = preferredVideoId ? preferredVideoId.trim() : '';
    this.shouldWatch = true;
    this.pollErrors = 0;
    await this._attemptConnect();
  }

  async reconnect() {
    if (!this.target && !this.preferredVideoId) return;
    await this.connect({
      channelOrUrl: this.target,
      preferredVideoId: this.preferredVideoId
    });
  }

  /**
   * Scans the channel's /streams and /live pages to discover all active/upcoming livestreams
   * so the user can either auto-connect or manually pick a specific stream!
   */
  async discoverStreams(channelOrUrl) {
    const input = (channelOrUrl || this.target || '').trim();
    if (!input) return [];

    const streams = [];
    const seenVids = new Set();

    try {
      const liveUrl = this._resolveInitialUrl(input);
      const html = await this._fetchText(liveUrl);

      // 1. Check primary videoDetails if directly on a watch/live page
      const primaryIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      const primaryTitleMatch = html.match(/"title":"([^"]{3,120})"/);
      const isLiveNow = html.includes('"isLive":true') || html.includes('"isLiveNow":true');
      if (primaryIdMatch) {
        const vid = primaryIdMatch[1];
        seenVids.add(vid);
        streams.push({
          videoId: vid,
          title: primaryTitleMatch ? primaryTitleMatch[1] : `Stream (${vid})`,
          isLive: isLiveNow
        });
      }

      // 2. Also scan channel /streams tab if input is a @handle or youtube.com/@handle URL
      const handleMatch = input.match(/youtube\.com\/(@[a-zA-Z0-9_.-]+)/i) || (!input.startsWith('http') && !/^[a-zA-Z0-9_-]{11}$/.test(input) ? [null, input.startsWith('@') ? input : `@${input}`] : null);
      if (handleMatch && handleMatch[1]) {
        const handle = handleMatch[1];
        const streamsHtml = await this._fetchText(`https://www.youtube.com/${handle}/streams`).catch(() => '');
        const regex = /"videoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})".*?"title":\{"runs":\[\{"text":"([^"]+)"\}/g;
        let match;
        while ((match = regex.exec(streamsHtml)) !== null && streams.length < 8) {
          const [, vid, title] = match;
          if (!seenVids.has(vid)) {
            seenVids.add(vid);
            streams.push({
              videoId: vid,
              title,
              isLive: streamsHtml.includes(`"videoId":"${vid}"`) && streamsHtml.includes('"style":"LIVE"')
            });
          }
        }
      }
    } catch (e) {}

    this.availableStreams = streams;
    return streams;
  }

  _rememberId(id) {
    if (!id) return false;
    if (this.seenIds.has(id)) return true;
    this.seenIds.add(id);
    if (this.seenIds.size > 1000) {
      const first = this.seenIds.values().next().value;
      this.seenIds.delete(first);
    }
    return false;
  }

  async _attemptConnect() {
    if (!this.shouldWatch || !this.target) return;
    clearTimeout(this.retryTimer);

    this.emit('status', {
      platform: 'youtube',
      status: 'connecting',
      channel: this.target,
      viewers: this.viewers,
      availableStreams: this.availableStreams
    });

    try {
      // Extract 11-char videoId if user pasted a full watch/live URL into preferredVideoId
      let cleanPrefVid = this.preferredVideoId || '';
      const vidUrlMatch = cleanPrefVid.match(/(?:v=|\/live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (vidUrlMatch) cleanPrefVid = vidUrlMatch[1];

      if (cleanPrefVid && /^[a-zA-Z0-9_-]{11}$/.test(cleanPrefVid)) {
        this.videoId = cleanPrefVid;
      } else {
        const discovered = await this.discoverStreams(this.target);
        const pageUrl = this._resolveInitialUrl(this.target);
        const html = await this._fetchText(pageUrl);

        const isLiveNow = html.includes('"isLive":true') || html.includes('"isLiveNow":true');
        const videoIdMatch =
          html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/) ||
          pageUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);

        const liveDiscovered = discovered.find((s) => s.isLive) || discovered[0];
        if (!videoIdMatch && !liveDiscovered) {
          throw new Error('Warte auf aktiven YouTube-Livestream (Auto-Standby)...');
        }
        this.videoId = videoIdMatch ? videoIdMatch[1] : liveDiscovered?.videoId;
        const titleMatch = html.match(/"title":"([^"]{3,100})"/);
        this.streamTitle = titleMatch ? titleMatch[1] : liveDiscovered?.title || '';

        const vcMatch = html.match(/"viewCount":"(\d+)"/);
        if (vcMatch) {
          this.viewers = parseInt(vcMatch[1], 10) || 0;
        }
      }

      let chatUrl = `https://www.youtube.com/live_chat?v=${this.videoId}&is_popout=1`;
      let chatHtml = await this._fetchText(chatUrl);

      let apiKeyMatch = chatHtml.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
      let contMatch = chatHtml.match(/"continuation":"([^"]+)"/);

      // If a previously saved preferredVideoId has ended (no continuation), auto-discover if channel has a newer live stream!
      if ((!apiKeyMatch || !contMatch) && cleanPrefVid && this.target && !/^[a-zA-Z0-9_-]{11}$/.test(this.target)) {
        const discovered = await this.discoverStreams(this.target);
        const liveDiscovered = discovered.find((s) => s.isLive && s.videoId !== this.videoId) || discovered.find((s) => s.videoId !== this.videoId);
        if (liveDiscovered) {
          this.videoId = liveDiscovered.videoId;
          this.streamTitle = liveDiscovered.title || '';
          chatUrl = `https://www.youtube.com/live_chat?v=${this.videoId}&is_popout=1`;
          chatHtml = await this._fetchText(chatUrl);
          apiKeyMatch = chatHtml.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
          contMatch = chatHtml.match(/"continuation":"([^"]+)"/);
        }
      }

      if (!apiKeyMatch || !contMatch) {
        throw new Error('Live-Chat für dieses Video noch nicht aktiv (Auto-Retry alle 12s)...');
      }

      this.apiKey = apiKeyMatch[1];
      this.continuation = contMatch[1];
      this.connected = true;
      this.pollErrors = 0;

      this.emit('status', {
        platform: 'youtube',
        status: 'connected',
        channel: this.target,
        videoId: this.videoId,
        streamTitle: this.streamTitle,
        availableStreams: this.availableStreams,
        viewers: this.viewers,
        canWrite: this.canWrite
      });

      this.emit('stats', {
        platform: 'youtube',
        viewers: this.viewers,
        isLive: true
      });

      this._pollChat();
      clearInterval(this.statsTimer);
      this.statsTimer = setInterval(() => this._pollViewerStats(), 30000);
    } catch (err) {
      this.connected = false;
      this.emit('status', {
        platform: 'youtube',
        status: 'standby',
        channel: this.target,
        videoId: this.videoId,
        availableStreams: this.availableStreams,
        error: err.message,
        viewers: 0,
        canWrite: this.canWrite
      });

      if (this.shouldWatch) {
        clearTimeout(this.retryTimer);
        this.retryTimer = setTimeout(() => this._attemptConnect(), 12000);
      }
    }
  }

  async _pollViewerStats() {
    if (!this.connected || !this.videoId) return;
    try {
      const html = await this._fetchText(`https://www.youtube.com/watch?v=${this.videoId}`);
      const vcMatch = html.match(/"concurrentViewers":"(\d+)"/) || html.match(/"viewCount":"(\d+)"/);
      if (vcMatch) {
        this.viewers = parseInt(vcMatch[1], 10) || 0;
        this.emit('stats', {
          platform: 'youtube',
          viewers: this.viewers,
          isLive: true
        });
      }
    } catch (e) {}
  }

  _resolveInitialUrl(input) {
    const clean = String(input || '').trim().replace(/\/+$/, '');
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      try {
        const parsed = new URL(clean);
        const allowedHosts = ['www.youtube.com', 'youtube.com', 'm.youtube.com', 'youtu.be'];
        const safeHost = allowedHosts.find((h) => h === parsed.hostname.toLowerCase());
        if (!safeHost) {
          throw new Error('Nur offizielle YouTube-URLs sind erlaubt.');
        }
        if (safeHost === 'youtu.be') {
          const vid = parsed.pathname.replace(/^\/+/, '').split('/')[0];
          if (/^[a-zA-Z0-9_-]{11}$/.test(vid)) {
            return `https://www.youtube.com/watch?v=${vid}`;
          }
        }
        if (/^\/@[a-zA-Z0-9_.-]+$/i.test(parsed.pathname) || /^\/channel\/[a-zA-Z0-9_-]+$/i.test(parsed.pathname)) {
          return `https://www.youtube.com${parsed.pathname}/live`;
        }
        return `https://${safeHost}${parsed.pathname}${parsed.search}`;
      } catch (e) {
        throw new Error('Ungültige YouTube-URL.');
      }
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return `https://www.youtube.com/watch?v=${clean}`;
    }
    const rawHandle = clean.startsWith('@') ? clean.slice(1) : clean;
    const safeHandle = rawHandle.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 64);
    return `https://www.youtube.com/@${safeHandle}/live`;
  }

  async _pollChat() {
    if (!this.connected || !this.apiKey || !this.continuation) return;

    try {
      const endpoint = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${this.apiKey}`;
      const payload = JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20241101.01.00',
            hl: 'de',
            gl: 'DE'
          }
        },
        continuation: this.continuation
      });

      const resJson = await this._postJson(endpoint, payload);
      const chatCont = resJson?.continuationContents?.liveChatContinuation;

      const nextContObj =
        chatCont?.continuations?.[0]?.invalidationContinuationData ||
        chatCont?.continuations?.[0]?.timedContinuationData ||
        chatCont?.continuations?.[0]?.reloadContinuationData;

      if (nextContObj?.continuation) {
        this.continuation = nextContObj.continuation;
        this.pollErrors = 0;
      } else {
        // Continuation ended or token expired -> trigger seamless auto-reconnect
        this.pollErrors += 1;
        if (this.pollErrors >= 3 && this.shouldWatch) {
          this.connected = false;
          this.emit('status', {
            platform: 'youtube',
            status: 'reconnecting',
            channel: this.target,
            error: 'Erneuere YouTube Chat-Session...',
            viewers: this.viewers
          });
          setTimeout(() => this._attemptConnect(), 2500);
          return;
        }
      }

      const actions = chatCont?.actions || [];
      for (const action of actions) {
        const item = action?.addChatItemAction?.item;
        const renderer =
          item?.liveChatTextMessageRenderer ||
          item?.liveChatPaidMessageRenderer ||
          item?.liveChatMembershipItemRenderer ||
          item?.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer;
        if (!renderer) continue;

        const msgId = renderer.id;
        if (this._rememberId(msgId)) continue;

        // Handle YouTube Gifted Memberships Announcement
        if (item?.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer) {
          const header = renderer.header?.liveChatSponsorshipsHeaderRenderer;
          const author = header?.authorName?.simpleText || 'YouTube Gifter';
          const primaryRuns = header?.primaryText?.runs || [];
          const text = primaryRuns.map((r) => r.text || '').join('') || 'hat Kanalmitgliedschaften verschenkt!';
          const serverTs = renderer.timestampUsec
            ? Math.floor(parseInt(renderer.timestampUsec, 10) / 1000)
            : Date.now();

          this.emit('event', {
            id: `ev_${msgId}`,
            platform: 'youtube',
            type: 'subgift',
            author,
            summary: text,
            timestamp: serverTs
          });

          this.emit('chat', {
            id: msgId,
            platform: 'youtube',
            channel: this.target,
            author,
            color: '#ec4899',
            badges: ['🎁 GIFTED MEMBERS'],
            text,
            timestamp: serverTs,
            eventType: 'subgift',
            isHighlight: true
          });
          continue;
        }

        const author = renderer.authorName?.simpleText || 'YouTube User';
        const runs = renderer.message?.runs || renderer.headerSubtext?.runs || [];
        const text = runs.map((r) => r.text || r.emoji?.shortcuts?.[0] || '').join('');
        if (!text && !item?.liveChatMembershipItemRenderer) continue;

        const serverTs = renderer.timestampUsec
          ? Math.floor(parseInt(renderer.timestampUsec, 10) / 1000)
          : Date.now();

        const badges = [];
        const authorBadges = renderer.authorBadges || [];
        for (const b of authorBadges) {
          const tooltip = (b?.liveChatAuthorBadgeRenderer?.tooltip || '').toUpperCase();
          if (tooltip.includes('OWNER')) badges.push('STREAMER');
          else if (tooltip.includes('MODERATOR')) badges.push('MOD');
          else if (tooltip.includes('MEMBER')) badges.push('MEMBER');
        }

        // Normal messages from members are NEVER automatically highlighted!
        let isHighlight = false;
        let eventType = null;

        if (item?.liveChatPaidMessageRenderer) {
          const amt = renderer.purchaseAmountText?.simpleText || 'SuperChat';
          badges.unshift(`💎 SUPERCHAT ${amt}`);
          isHighlight = true;
          eventType = 'bits';
          this.emit('event', {
            id: `yt_sc_${msgId}`,
            platform: 'youtube',
            type: 'bits',
            author,
            summary: `SuperChat (${amt}): ${text}`,
            timestamp: serverTs
          });
        } else if (item?.liveChatMembershipItemRenderer) {
          const headerPrimary = (renderer.headerPrimaryText?.runs || []).map((r) => r.text || '').join('');
          const isResub = /\d+/.test(headerPrimary);
          eventType = isResub ? 'resub' : 'sub';
          badges.unshift(isResub ? `🌟 RESUB (${headerPrimary})` : '⭐ NEUES MITGLIED');
          isHighlight = true;
          this.emit('event', {
            id: `yt_mem_${msgId}`,
            platform: 'youtube',
            type: eventType,
            author,
            summary: headerPrimary || 'ist Kanalmitglied geworden!',
            timestamp: serverTs
          });
        }

        const avatarThumbs = renderer.authorPhoto?.thumbnails || [];
        const avatar = avatarThumbs[avatarThumbs.length - 1]?.url || '';

        this.emit('chat', {
          id: msgId || `yt_${serverTs}_${author}`,
          platform: 'youtube',
          channel: this.target,
          author,
          avatar,
          color: '#ff4e45',
          badges,
          text: text || 'ist Kanalmitglied geworden! 🎉',
          youtubeRuns: runs,
          timestamp: serverTs,
          isHighlight,
          eventType
        });
      }
    } catch (err) {
      this.pollErrors += 1;
      if (this.pollErrors >= 4 && this.shouldWatch) {
        this.connected = false;
        this.emit('status', {
          platform: 'youtube',
          status: 'reconnecting',
          channel: this.target,
          error: 'Verbindungsabbruch – verbinde automatisch neu...',
          viewers: this.viewers
        });
        setTimeout(() => this._attemptConnect(), 3000);
        return;
      }
    }

    if (this.connected) {
      this.pollTimer = setTimeout(() => this._pollChat(), 2200);
    }
  }

  _fetchText(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
      if (redirectCount > 4) return reject(new Error('Too many redirects'));
      let parsed;
      try {
        parsed = new URL(String(url || ''));
      } catch (e) {
        return reject(new Error('Ungültige YouTube-URL.'));
      }
      const allowedHosts = ['www.youtube.com', 'youtube.com', 'm.youtube.com', 'consent.youtube.com', 'youtu.be'];
      const safeHost = allowedHosts.find((h) => h === parsed.hostname.toLowerCase());
      if (parsed.protocol !== 'https:' || !safeHost || parsed.username || parsed.password || parsed.port) {
        return reject(new Error('Nicht erlaubter YouTube-Host.'));
      }
      const req = https.get(
        {
          protocol: 'https:',
          hostname: safeHost,
          port: 443,
          path: `${parsed.pathname}${parsed.search}`,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
            Cookie: 'CONSENT=YES+cb.20230531-07-p0.de+FX+999'
          },
          timeout: 6000
        },
        (res) => {
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            res.resume();
            let nextUrl;
            try {
              nextUrl = new URL(res.headers.location, `https://${safeHost}`).toString();
            } catch (e) {
              return reject(new Error('Ungültige Weiterleitung.'));
            }
            return resolve(this._fetchText(nextUrl, redirectCount + 1));
          }
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => resolve(body));
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('YouTube Verbindungs-Timeout'));
      });
    });
  }

  _postJson(url, bodyStr) {
    return new Promise((resolve, reject) => {
      const req = https.request(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyStr),
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
          },
          timeout: 5000
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
      req.write(bodyStr);
      req.end();
    });
  }

  setOAuthConfig(oauthCfg = {}) {
    this.oauth = {
      clientId: String(oauthCfg.clientId || '').trim(),
      clientSecret: String(oauthCfg.clientSecret || '').trim(),
      accessToken: String(oauthCfg.accessToken || '').trim(),
      refreshToken: String(oauthCfg.refreshToken || '').trim(),
      expiresAt: Number(oauthCfg.expiresAt || 0),
      accountName: String(oauthCfg.accountName || '').trim()
    };
    this.canWrite = Boolean(
      this.oauth.accessToken || (this.oauth.refreshToken && this.oauth.clientId)
    );
    if (this.connected && this.target) {
      this.emit('status', {
        platform: 'youtube',
        status: 'connected',
        channel: this.target,
        videoId: this.videoId,
        streamTitle: this.streamTitle,
        availableStreams: this.availableStreams,
        viewers: this.viewers,
        canWrite: this.canWrite
      });
    }
  }

  _httpsRequest(url, { method = 'GET', headers = {}, body = null } = {}) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, { method, headers, timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch (e) {}
          resolve({ statusCode: res.statusCode, data, json: parsed });
        });
      });
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('YouTube API Zeitüberschreitung'));
      });
      if (body) req.write(body);
      req.end();
    });
  }

  async startOAuthLogin({ clientId, clientSecret = '', openUrl }) {
    const cleanClientId = String(clientId || this.oauth.clientId || '').trim();
    const cleanSecret = String(clientSecret || this.oauth.clientSecret || '').trim();
    if (!cleanClientId) {
      throw new Error('Bitte zuerst eine Google OAuth2 Client-ID eingeben.');
    }
    if (typeof openUrl !== 'function') {
      throw new Error('Kein Browser-Opener für OAuth2 verfügbar.');
    }

    if (this._oauthServer) {
      try {
        this._oauthServer.close();
      } catch (e) {}
      this._oauthServer = null;
    }

    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    const state = crypto.randomBytes(16).toString('hex');

    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (err, result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutTimer);
        if (this._oauthServer) {
          try {
            this._oauthServer.close();
          } catch (e) {}
          this._oauthServer = null;
        }
        if (err) reject(err);
        else resolve(result);
      };

      const server = http.createServer(async (req, res) => {
        try {
          const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
          if (reqUrl.pathname !== '/oauth2callback') {
            res.writeHead(404);
            res.end('Not found');
            return;
          }

          const errParam = reqUrl.searchParams.get('error');
          const code = reqUrl.searchParams.get('code');
          const returnedState = reqUrl.searchParams.get('state');

          if (errParam) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<html><body style="font-family:sans-serif;background:#111;color:#fff;padding:30px;"><h2>❌ Anmeldung abgebrochen</h2><p>${escapeHtml(errParam)}</p></body></html>`);
            return finish(new Error(`Google OAuth Fehler: ${errParam}`));
          }
          if (!code || returnedState !== state) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<html><body style="font-family:sans-serif;background:#111;color:#fff;padding:30px;"><h2>❌ Ungültige OAuth-Antwort</h2></body></html>');
            return finish(new Error('Ungültige OAuth2-Antwort (State/Code fehlt).'));
          }

          const addr = server.address();
          const redirectUri = `http://127.0.0.1:${addr.port}/oauth2callback`;
          const tokenParams = new URLSearchParams({
            code,
            client_id: cleanClientId,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            code_verifier: codeVerifier
          });
          if (cleanSecret) {
            tokenParams.set('client_secret', cleanSecret);
          }

          const tokenResp = await this._httpsRequest('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString()
          });

          if (tokenResp.statusCode >= 400 || !tokenResp.json?.access_token) {
            const msg = tokenResp.json?.error_description || tokenResp.json?.error || `HTTP ${tokenResp.statusCode}`;
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<html><body style="font-family:sans-serif;background:#111;color:#fff;padding:30px;"><h2>❌ Token-Austausch fehlgeschlagen</h2><p>${escapeHtml(msg)}</p></body></html>`);
            return finish(new Error(`Token-Austausch fehlgeschlagen: ${msg}`));
          }

          const tok = tokenResp.json;
          let accountName = '';
          try {
            const chResp = await this._httpsRequest(
              'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
              { headers: { Authorization: `Bearer ${tok.access_token}` } }
            );
            accountName = chResp.json?.items?.[0]?.snippet?.title || '';
          } catch (e) {}

          const nextOAuth = {
            clientId: cleanClientId,
            clientSecret: cleanSecret,
            accessToken: tok.access_token,
            refreshToken: tok.refresh_token || this.oauth.refreshToken || '',
            expiresAt: Date.now() + (Number(tok.expires_in || 3600) * 1000),
            accountName
          };
          this.setOAuthConfig(nextOAuth);
          this.emit('oauth-updated', nextOAuth);

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(
            `<html><body style="font-family:sans-serif;background:#0f172a;color:#fff;padding:36px;text-align:center;">` +
            `<h2>✅ YouTube-Konto verbunden!</h2>` +
            `<p>${accountName ? `Angemeldet als <strong>${escapeHtml(accountName)}</strong>.` : 'Schreibrechte für YouTube Live Chat sind aktiv.'} Du kannst dieses Tab jetzt schließen.</p>` +
            `</body></html>`
          );
          finish(null, { ok: true, oauth: nextOAuth });
        } catch (err) {
          finish(err);
        }
      });

      this._oauthServer = server;
      const timeoutTimer = setTimeout(() => {
        finish(new Error('YouTube OAuth2 Anmeldung abgelaufen (Timeout nach 3 Minuten).'));
      }, 180000);

      server.on('error', (err) => finish(err));
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        const redirectUri = `http://127.0.0.1:${addr.port}/oauth2callback`;
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', cleanClientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.upload');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'consent');
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');
        authUrl.searchParams.set('state', state);
        openUrl(authUrl.toString());
      });
    });
  }

  async refreshAccessToken() {
    if (!this.oauth.refreshToken || !this.oauth.clientId) {
      throw new Error('Kein YouTube Refresh-Token vorhanden — bitte erneut mit Google anmelden.');
    }
    const params = new URLSearchParams({
      client_id: this.oauth.clientId,
      refresh_token: this.oauth.refreshToken,
      grant_type: 'refresh_token'
    });
    if (this.oauth.clientSecret) {
      params.set('client_secret', this.oauth.clientSecret);
    }

    const resp = await this._httpsRequest('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    if (resp.statusCode >= 400 || !resp.json?.access_token) {
      const msg = resp.json?.error_description || resp.json?.error || `HTTP ${resp.statusCode}`;
      throw new Error(`YouTube Token-Refresh fehlgeschlagen: ${msg}`);
    }

    const nextOAuth = {
      ...this.oauth,
      accessToken: resp.json.access_token,
      expiresAt: Date.now() + (Number(resp.json.expires_in || 3600) * 1000)
    };
    this.setOAuthConfig(nextOAuth);
    this.emit('oauth-updated', nextOAuth);
    return nextOAuth.accessToken;
  }

  async _ensureValidAccessToken() {
    if (!this.oauth.accessToken && !this.oauth.refreshToken) {
      throw new Error('YouTube OAuth2 nicht angemeldet.');
    }
    const needsRefresh = !this.oauth.accessToken || (this.oauth.expiresAt && Date.now() >= this.oauth.expiresAt - 60000);
    if (needsRefresh && this.oauth.refreshToken && this.oauth.clientId) {
      return await this.refreshAccessToken();
    }
    return this.oauth.accessToken;
  }

  async _resolveActiveLiveChatId(accessToken) {
    if (!this.videoId) {
      throw new Error('Kein aktiver YouTube-Livestream verbunden.');
    }
    if (this.liveChatId && this.liveChatIdForVideo === this.videoId) {
      return this.liveChatId;
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${encodeURIComponent(this.videoId)}`;
    const resp = await this._httpsRequest(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (resp.statusCode === 401) {
      const err = new Error('UNAUTHORIZED');
      err.statusCode = 401;
      throw err;
    }
    if (resp.statusCode >= 400) {
      const msg = resp.json?.error?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`YouTube liveChatId Abruf fehlgeschlagen: ${msg}`);
    }

    const chatId = resp.json?.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
    if (!chatId) {
      throw new Error('Für diesen YouTube-Stream ist kein aktiver Live-Chat über die API verfügbar.');
    }
    this.liveChatId = chatId;
    this.liveChatIdForVideo = this.videoId;
    return chatId;
  }

  async sendMessage(text) {
    const cleanText = String(text || '').trim().slice(0, 200);
    if (!cleanText) {
      throw new Error('Leere Nachricht kann nicht gesendet werden.');
    }
    if (!this.connected || !this.videoId) {
      throw new Error('YouTube ist aktuell nicht mit einem aktiven Livestream verbunden.');
    }
    if (!this.canWrite) {
      throw new Error('YouTube ist im Nur-Lesen-Modus. Bitte zuerst unter YouTube mit Google OAuth2 anmelden.');
    }

    const attemptSend = async (accessToken) => {
      const liveChatId = await this._resolveActiveLiveChatId(accessToken);
      const payload = JSON.stringify({
        snippet: {
          liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: { messageText: cleanText }
        }
      });
      return await this._httpsRequest(
        'https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          body: payload
        }
      );
    };

    let token = await this._ensureValidAccessToken();
    let resp;
    try {
      resp = await attemptSend(token);
      if (resp.statusCode === 401 && this.oauth.refreshToken && this.oauth.clientId) {
        token = await this.refreshAccessToken();
        resp = await attemptSend(token);
      }
    } catch (err) {
      if (err.statusCode === 401 && this.oauth.refreshToken && this.oauth.clientId) {
        token = await this.refreshAccessToken();
        resp = await attemptSend(token);
      } else {
        throw err;
      }
    }

    if (resp.statusCode >= 400) {
      const msg = resp.json?.error?.message || `HTTP ${resp.statusCode}`;
      throw new Error(`YouTube Senden fehlgeschlagen: ${msg}`);
    }
    return { ok: true, id: resp.json?.id || null };
  }

  async updateVideoTitle(newTitle) {
    const cleanTitle = String(newTitle || '').trim().slice(0, 100);
    if (!cleanTitle) throw new Error('Leerer YouTube-Titel.');
    if (!this.connected || !this.videoId) {
      throw new Error('Kein aktiver YouTube-Livestream verbunden.');
    }
    if (!this.canWrite) {
      throw new Error('YouTube OAuth2 nicht angemeldet.');
    }

    const token = await this._ensureValidAccessToken();
    const getResp = await this._httpsRequest(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(this.videoId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const snippet = getResp.json?.items?.[0]?.snippet;
    if (!snippet) {
      throw new Error('YouTube Video-Metadaten konnten nicht geladen werden.');
    }

    const payload = JSON.stringify({
      id: this.videoId,
      snippet: {
        title: cleanTitle,
        description: snippet.description || '',
        categoryId: snippet.categoryId || '20'
      }
    });

    const putResp = await this._httpsRequest(
      'https://www.googleapis.com/youtube/v3/videos?part=snippet',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        body: payload
      }
    );
    if (putResp.statusCode >= 400) {
      const msg = putResp.json?.error?.message || `HTTP ${putResp.statusCode}`;
      throw new Error(`YouTube Titel-Update fehlgeschlagen: ${msg}`);
    }
    this.streamTitle = cleanTitle;
    return { ok: true, title: cleanTitle };
  }

  async uploadVideo({ filePath, title = '', description = '#Shorts', privacyStatus = 'private' }) {
    const fs = require('fs');
    const path = require('path');
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error('Video-Datei nicht gefunden.');
    }
    if (!this.canWrite) {
      throw new Error('YouTube OAuth2 nicht angemeldet (unter ⚙️ Config → Plattformen → YouTube anmelden).');
    }

    const token = await this._ensureValidAccessToken();
    const stat = fs.statSync(filePath);
    const cleanTitle = String(title || path.basename(filePath, path.extname(filePath))).trim().slice(0, 100);
    const metaStr = JSON.stringify({
      snippet: {
        title: cleanTitle,
        description: String(description || '#Shorts'),
        categoryId: '20'
      },
      status: {
        privacyStatus: ['private', 'unlisted', 'public'].includes(privacyStatus) ? privacyStatus : 'private',
        selfDeclaredMadeForKids: false
      }
    });

    // Step 1: Initiate resumable upload session
    const initResp = await new Promise((resolve, reject) => {
      const req = https.request(
        'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(metaStr),
            'X-Upload-Content-Length': stat.size,
            'X-Upload-Content-Type': 'video/mp4'
          },
          timeout: 15000
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
        }
      );
      req.on('error', reject);
      req.write(metaStr);
      req.end();
    });

    if (initResp.statusCode === 401 || initResp.statusCode === 403) {
      throw new Error('Fehlende YouTube-Upload-Berechtigung — bitte unter ⚙️ Config → Plattformen → YouTube einmal kurz neu mit Google anmelden.');
    }
    const uploadUrl = initResp.headers?.location;
    if (initResp.statusCode >= 400 || !uploadUrl) {
      let msg = `HTTP ${initResp.statusCode}`;
      try {
        msg = JSON.parse(initResp.data)?.error?.message || msg;
      } catch (e) {}
      throw new Error(`YouTube Upload-Start fehlgeschlagen: ${msg}`);
    }

    // Step 2: Stream video bytes to resumable upload URL
    const putResp = await new Promise((resolve, reject) => {
      const req = https.request(
        uploadUrl,
        {
          method: 'PUT',
          headers: {
            'Content-Length': stat.size,
            'Content-Type': 'video/mp4'
          },
          timeout: 180000
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            let json = null;
            try { json = JSON.parse(data); } catch (e) {}
            resolve({ statusCode: res.statusCode, json, data });
          });
        }
      );
      req.on('error', reject);
      fs.createReadStream(filePath).pipe(req);
    });

    if (putResp.statusCode >= 400 || !putResp.json?.id) {
      const msg = putResp.json?.error?.message || `HTTP ${putResp.statusCode}`;
      throw new Error(`YouTube Video-Upload fehlgeschlagen: ${msg}`);
    }

    return {
      ok: true,
      id: putResp.json.id,
      url: `https://youtu.be/${putResp.json.id}`
    };
  }

  disconnect(clearDedupe = false) {
    this.shouldWatch = false;
    this.connected = false;
    this.viewers = 0;
    this.liveChatId = null;
    this.liveChatIdForVideo = null;
    clearTimeout(this.pollTimer);
    clearTimeout(this.retryTimer);
    clearInterval(this.statsTimer);
    if (clearDedupe) {
      this.seenIds.clear();
    }
    if (this.target) {
      this.emit('status', {
        platform: 'youtube',
        status: 'disconnected',
        channel: this.target,
        availableStreams: this.availableStreams,
        viewers: 0,
        canWrite: this.canWrite
      });
    }
  }
}

module.exports = { YouTubeConnector };
