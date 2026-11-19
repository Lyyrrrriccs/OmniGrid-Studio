const https = require('https');
const { EventEmitter } = require('events');

/**
 * Connects to YouTube Live Chat without requiring an API key or login!
 * Features:
 * - Auto-discovers active and upcoming livestreams on a channel (`discoverStreams`)
 * - Allows automatic selection OR manual stream selection by videoId
 * - Auto-reconnects on session drops / network hiccups without losing deduplication state (`seenIds`)
 * - Parses exact YouTube server timestamps (`timestampUsec`) for chronological sorting
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
        viewers: this.viewers
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
        viewers: 0
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
      // If user pasted a channel root URL like https://www.youtube.com/@thori0n264, append /live so YouTube redirects to the active stream
      if (/youtube\.com\/@[a-zA-Z0-9_.-]+$/i.test(clean) || /youtube\.com\/channel\/[a-zA-Z0-9_-]+$/i.test(clean)) {
        return `${clean}/live`;
      }
      return clean;
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return `https://www.youtube.com/watch?v=${clean}`;
    }
    const handle = clean.startsWith('@') ? clean : `@${clean}`;
    return `https://www.youtube.com/${handle}/live`;
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
      const req = https.get(
        url,
        {
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
            const nextUrl = res.headers.location.startsWith('http')
              ? res.headers.location
              : `https://www.youtube.com${res.headers.location}`;
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

  disconnect(clearDedupe = false) {
    this.shouldWatch = false;
    this.connected = false;
    this.viewers = 0;
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
        viewers: 0
      });
    }
  }
}

module.exports = { YouTubeConnector };
