const { EventEmitter } = require('events');

let WebcastPushConnection = null;
try {
  ({ WebcastPushConnection } = require('tiktok-live-connector'));
} catch (e) {}

/**
 * Connects to TikTok Live Stream Chat by @uniqueId (or manual Room ID override).
 * Features:
 * - Automatic Stream Detection + optional manual Room-ID selection
 * - Automatic Reconnect on socket drops (`disconnected` event) while stream is still live
 * - Deduplication (`seenMsgIds`) so buffered messages on reconnect are never duplicated
 * - Server timestamp extraction (`createTime`) for chronological sorting
 */
class TikTokConnector extends EventEmitter {
  constructor() {
    super();
    this.connection = null;
    this.uniqueId = null;
    this.manualRoomId = '';
    this.roomId = null;
    this.connected = false;
    this.shouldWatch = false;
    this.reconnectAttempts = 0;
    this.retryTimer = null;
    this.viewers = 0;
    this.likes = 0;
    this.seenFollowers = new Set();
    this.seenMsgIds = new Set();
  }

  async connect({ uniqueId, roomId = '' }) {
    this.disconnect(false);
    if (!uniqueId && !roomId) return;

    let raw = String(uniqueId || roomId).trim();
    const urlMatch = raw.match(/tiktok\.com\/@?([a-zA-Z0-9_.-]+)/i);
    if (urlMatch && urlMatch[1]) {
      raw = urlMatch[1];
    }
    this.uniqueId = raw.replace(/^@/, '').split(/[/?&#\s]/)[0];
    this.manualRoomId = roomId ? String(roomId).trim() : '';
    this.shouldWatch = true;
    this.reconnectAttempts = 0;
    await this._attemptConnect();
  }

  async reconnect() {
    if (!this.uniqueId && !this.manualRoomId) return;
    await this.connect({
      uniqueId: this.uniqueId,
      roomId: this.manualRoomId
    });
  }

  _rememberId(id) {
    if (!id) return false;
    if (this.seenMsgIds.has(id)) return true;
    this.seenMsgIds.add(id);
    if (this.seenMsgIds.size > 1000) {
      const oldest = this.seenMsgIds.values().next().value;
      this.seenMsgIds.delete(oldest);
    }
    return false;
  }

  async _attemptConnect() {
    if (!this.shouldWatch || !this.uniqueId) return;
    clearTimeout(this.retryTimer);

    this.emit('status', {
      platform: 'tiktok',
      status: this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting',
      channel: this.uniqueId,
      roomId: this.manualRoomId || this.roomId,
      viewers: this.viewers
    });

    if (!WebcastPushConnection) {
      this.emit('status', {
        platform: 'tiktok',
        status: 'error',
        channel: this.uniqueId,
        error: 'tiktok-live-connector Modul nicht geladen.'
      });
      return;
    }

    try {
      const options = {
        processInitialData: true,
        enableExtendedGiftInfo: true,
        enableWebsocketUpgrade: true,
        requestPollingIntervalMs: 2000
      };
      if (this.manualRoomId) {
        options.roomId = this.manualRoomId;
      }

      this.connection = new WebcastPushConnection(this.uniqueId, options);

      this.connection.on('roomUser', (data) => {
        if (typeof data.viewerCount === 'number') {
          this.viewers = data.viewerCount;
          this.emit('stats', {
            platform: 'tiktok',
            viewers: this.viewers,
            likes: this.likes,
            isLive: true
          });
        }
      });

      this.connection.on('like', (data) => {
        if (typeof data.totalLikeCount === 'number') {
          this.likes = data.totalLikeCount;
          this.emit('stats', {
            platform: 'tiktok',
            viewers: this.viewers,
            likes: this.likes,
            isLive: true
          });
        }
      });

      this.connection.on('follow', (data) => {
        const uid = data.uniqueId || data.nickname || 'User';
        if (this.seenFollowers.has(uid)) return;
        this.seenFollowers.add(uid);

        const author = data.nickname || uid;
        const folId = `tt_fol_${Date.now()}_${uid}`;
        this.emit('event', {
          id: `ev_${folId}`,
          platform: 'tiktok',
          type: 'follow',
          author,
          summary: 'Neuer Follow auf TikTok!',
          timestamp: Date.now()
        });

        this.emit('chat', {
          id: folId,
          platform: 'tiktok',
          channel: this.uniqueId,
          author,
          color: '#10b981',
          badges: ['❤️ NEUER FOLLOW'],
          text: 'folgt jetzt dem Kanal!',
          timestamp: Date.now(),
          eventType: 'follow',
          isHighlight: true
        });
      });

      this.connection.on('subscribe', (data) => {
        const name = data.nickname || data.uniqueId || 'TikTok Sub';
        const subId = data.msgId || `tt_sub_${name}_${Math.floor(Date.now() / 10000)}`;
        if (this._rememberId(subId)) return;

        this.emit('event', {
          id: `ev_${subId}`,
          platform: 'tiktok',
          type: 'sub',
          author: name,
          summary: 'Neues TikTok-Abo!',
          timestamp: Date.now()
        });

        this.emit('chat', {
          id: subId,
          platform: 'tiktok',
          channel: this.uniqueId,
          author: name,
          color: '#f59e0b',
          badges: ['⭐ NEUES SUB'],
          text: 'hat den Kanal auf TikTok abonniert!',
          timestamp: Date.now(),
          eventType: 'sub',
          isHighlight: true
        });
      });

      this.connection.on('chat', (data) => {
        const author = data.nickname || data.uniqueId || 'TikTok User';
        const comment = data.comment || '';
        const serverTs = data.createTime
          ? Number(data.createTime) > 1e12
            ? Number(data.createTime)
            : Number(data.createTime) * 1000
          : Date.now();
        const msgId = data.msgId || `tt_${author}_${comment}_${Math.floor(serverTs / 5000)}`;

        if (this._rememberId(msgId)) return;

        const badges = [];
        if (data.isModerator) badges.push('MOD');
        if (data.isSubscriber) badges.push('SUB');
        if (data.topGifterRank && data.topGifterRank <= 3) {
          badges.push(`TOP #${data.topGifterRank}`);
        }

        // Normal chat messages from subscribers/followers are NEVER highlighted automatically!
        this.emit('chat', {
          id: msgId,
          platform: 'tiktok',
          channel: this.uniqueId,
          author,
          avatar: data.profilePictureUrl || '',
          color: '#00f2fe',
          badges,
          text: comment,
          tiktokEmotes: Array.isArray(data.emotes) ? data.emotes : [],
          timestamp: serverTs,
          eventType: null,
          isHighlight: false
        });
      });

      this.connection.on('gift', (data) => {
        if (data.giftType === 1 && !data.repeatEnd) return;
        const count = data.repeatCount || 1;
        const giftName = data.giftName || 'Gift';
        const diamonds = (data.diamondCount || 1) * count;
        const author = data.nickname || data.uniqueId || 'TikTok Gifter';
        const giftId = data.msgId || `tt_gift_${author}_${giftName}_${count}_${Math.floor(Date.now() / 5000)}`;

        if (this._rememberId(giftId)) return;

        this.emit('event', {
          id: `ev_${giftId}`,
          platform: 'tiktok',
          type: 'bits',
          author,
          summary: `${count}x ${giftName} (${diamonds} 💎)`,
          timestamp: Date.now()
        });

        this.emit('chat', {
          id: giftId,
          platform: 'tiktok',
          channel: this.uniqueId,
          author,
          color: '#ff0050',
          badges: [`💎 ${diamonds} DIAMONDS`],
          text: `hat ${count}x ${giftName} gesendet!`,
          timestamp: Date.now(),
          eventType: 'bits',
          isHighlight: true
        });
      });

      // Handle unexpected WebSocket drop while stream is still active -> Auto-Reconnect!
      this.connection.on('disconnected', () => {
        this.connected = false;
        if (this.shouldWatch) {
          this.reconnectAttempts += 1;
          const delay = Math.min(12000, 2500 * this.reconnectAttempts);
          this.emit('status', {
            platform: 'tiktok',
            status: 'reconnecting',
            channel: this.uniqueId,
            roomId: this.roomId,
            error: `Verbindung unterbrochen – Reconnect #${this.reconnectAttempts}...`,
            viewers: this.viewers
          });
          clearTimeout(this.retryTimer);
          this.retryTimer = setTimeout(() => this._attemptConnect(), delay);
        }
      });

      this.connection.on('streamEnd', () => {
        this.connected = false;
        this.viewers = 0;
        this.emit('status', {
          platform: 'tiktok',
          status: 'standby',
          channel: this.uniqueId,
          error: 'Stream beendet — Warte auf nächsten Start...',
          viewers: 0
        });
        if (this.shouldWatch) {
          clearTimeout(this.retryTimer);
          this.retryTimer = setTimeout(() => this._attemptConnect(), 15000);
        }
      });

      this.connection.on('error', () => {});

      const state = await this.connection.connect();
      this.connected = true;
      this.reconnectAttempts = 0;
      this.roomId = state?.roomId || this.manualRoomId || null;
      this.viewers = state?.viewerCount || 0;

      this.emit('status', {
        platform: 'tiktok',
        status: 'connected',
        channel: this.uniqueId,
        roomId: this.roomId,
        viewers: this.viewers
      });
    } catch (err) {
      this.connected = false;
      this.viewers = 0;
      this.emit('status', {
        platform: 'tiktok',
        status: 'standby',
        channel: this.uniqueId,
        roomId: this.manualRoomId || null,
        error: 'Warte bis dein TikTok-Stream LIVE geht (Auto-Retry alle 15s)...',
        viewers: 0
      });

      if (this.shouldWatch) {
        clearTimeout(this.retryTimer);
        this.retryTimer = setTimeout(() => this._attemptConnect(), 15000);
      }
    }
  }

  disconnect(clearDedupe = false) {
    this.shouldWatch = false;
    clearTimeout(this.retryTimer);
    if (clearDedupe) {
      this.seenMsgIds.clear();
      this.seenFollowers.clear();
    }
    if (this.connection) {
      try {
        this.connection.removeAllListeners();
        this.connection.disconnect();
      } catch (e) {}
      this.connection = null;
    }
    this.connected = false;
    this.viewers = 0;
    this.likes = 0;
    if (this.uniqueId) {
      this.emit('status', {
        platform: 'tiktok',
        status: 'disconnected',
        channel: this.uniqueId,
        roomId: null,
        viewers: 0
      });
    }
  }
}

module.exports = { TikTokConnector };
