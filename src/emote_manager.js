const https = require('https');

const ALLOWED_EMOTE_API_HOSTS = ['7tv.io', 'api.betterttv.net', 'api.frankerfacez.com'];
const ALLOWED_EMOTE_API_PATH_RE =
  /^\/(?:v3\/emote-sets\/global|v3\/users\/twitch\/\d{1,18}|3\/cached\/emotes\/global|3\/cached\/users\/twitch\/\d{1,18}|3\/cached\/frankerfacez\/users\/twitch\/\d{1,18}|v1\/set\/global)$/;

/**
 * Full-Featured Multi-Provider Emote Engine for OmniGrid Studio
 * Supports:
 * - 7TV Global & Channel Emotes (v3 API, preserving animated WebP/GIF formats!)
 * - BetterTTV (BTTV) Global & Channel Emotes (preserving animated GIF/WebP!)
 * - FrankerFaceZ (FFZ) Global & Channel Emotes (including animated FFZ emotes!)
 * - Native Twitch Emotes (via IRC emotes tag + animated v2 CDN URLs)
 * - Native YouTube Live Custom Member Emotes & Emojis (via runs[].emoji.image.thumbnails)
 * - Native TikTok Live Sub Emotes (via data.emotes[].emoteImageUrl)
 * - Individual Provider Enable/Disable Toggles (7tv, bttv, ffz, twitch, youtube, tiktok, animations)
 */
class EmoteManager {
  constructor() {
    // Separate maps per provider so individual providers can be toggled on/off dynamically at any time!
    this.providers = {
      '7tv': new Map(),
      bttv: new Map(),
      ffz: new Map()
    };

    this.settings = {
      enable7tv: true,
      enableBttv: true,
      enableFfz: true,
      enableTwitchNative: true,
      enableYoutubeNative: true,
      enableTiktokNative: true,
      animateEmotes: true
    };

    this.loadedRoomIds = new Set();
    this.statusCounts = {
      '7tv': 0,
      bttv: 0,
      ffz: 0
    };

    this._seedGuaranteed7tvEmotes();
    this.loadGlobalEmotes();
  }

  updateSettings(partial = {}) {
    this.settings = {
      ...this.settings,
      ...partial
    };
  }

  getSettings() {
    return {
      ...this.settings,
      counts: {
        '7tv': this.providers['7tv'].size,
        bttv: this.providers.bttv.size,
        ffz: this.providers.ffz.size
      }
    };
  }

  /**
   * Seeds guaranteed high-priority animated 7TV emotes immediately so they work 100% offline/instantly
   * before async API calls even finish.
   */
  _seedGuaranteed7tvEmotes() {
    const core7tv = [
      { name: 'catJAM', id: '01F6MZGCNG000255K4X1K7NTHR', animated: true },
      { name: 'GIGACHAD', id: '01M5Q8ZX1HPGMPQ8XD4BM09E04', animated: true },
      { name: 'OMEGALUL', id: '01M7ETTYPN1TYCAZJCH88Q7HY1', animated: false },
      { name: 'Clueless', id: '01M56A5T59RXJ8FDH69KE6EK9H', animated: false },
      { name: 'Aware', id: '01M715DGB17H5RYMR5WY5PSC8V', animated: true },
      { name: 'PepeLaugh', id: '01M5GM149SRQD1M3MZJ92R65K4', animated: true },
      { name: 'Sadge', id: '603cac391cd55c0014d989be', animated: false },
      { name: 'EZ', id: '01GB4CK01800090V9B3D8CGEEX', animated: false },
      { name: 'Clap', id: '01GAM8EFQ00004MXFXAJYKA859', animated: true },
      { name: 'PogU', id: '01M4BQCSNT4E6VAEEEHP3RJ21Z', animated: false },
      { name: 'KEKW', id: '01M6NQD56PB04HB832TJC590BY', animated: false },
      { name: 'monkaW', id: '60ae3d91259ac5a73e56a418', animated: false },
      { name: 'LULW', id: '60ae417f259ac5a73e56a477', animated: false },
      { name: 'peepoHey', id: '01M4V6W7EAA4T6JE0P1DT591QG', animated: true },
      { name: 'peepoLove', id: '01KN4C1AGRRG7QSWH4RSWFMY5G', animated: true },
      { name: 'Bedge', id: '01M7GWBECXY64EDE79NVTDJQFC', animated: false },
      { name: 'Susge', id: '01M57NN1PMVCHP97ZT8104GVAR', animated: false },
      { name: 'ratJAM', id: '01M4H92SQVF73ZVQBT1N2WGN2S', animated: true },
      { name: 'xdd', id: '01M67F7WD2RETB42XWG55PVWK6', animated: false },
      { name: 'o7', id: '01M79DHY3FWH0WPZC2G4N8YZ9D', animated: false }
    ];

    for (const item of core7tv) {
      this.providers['7tv'].set(item.name, {
        name: item.name,
        url: `https://cdn.7tv.app/emote/${item.id}/2x.webp`,
        staticUrl: `https://cdn.7tv.app/emote/${item.id}/1x.webp`,
        provider: '7TV',
        animated: item.animated
      });
    }
  }

  async loadGlobalEmotes() {
    // 1. 7TV Global Emotes (v3 API)
    try {
      const global7tv = await this._fetchJson('https://7tv.io/v3/emote-sets/global');
      this._register7tvEmoteList(global7tv?.emotes || []);
    } catch (e) {}

    // 2. BetterTTV (BTTV) Global Emotes
    try {
      const globalBttv = await this._fetchJson('https://api.betterttv.net/3/cached/emotes/global');
      this._registerBttvEmoteList(globalBttv || []);
    } catch (e) {}

    // 3. FrankerFaceZ (FFZ) Global Emotes
    try {
      const globalFfz = await this._fetchJson('https://api.frankerfacez.com/v1/set/global');
      const defaultSets = globalFfz?.default_sets || [];
      const sets = globalFfz?.sets || {};
      for (const setId of defaultSets) {
        const emoticons = sets[String(setId)]?.emoticons || [];
        this._registerFfzStandardList(emoticons);
      }
    } catch (e) {}
  }

  /**
   * Resolves Twitch numeric user ID by login name via Twitch GQL so 7TV/BTTV/FFZ channel emotes
   * load immediately upon connecting to a channel name (even before a message is sent).
   */
  async loadTwitchChannelEmotesByLogin(channelLogin) {
    if (!channelLogin) return;
    let raw = String(channelLogin || '').trim();
    const urlMatch = raw.match(/(?:^|\/\/)(?:www\.)?twitch\.tv\/(?:popout\/)?([a-zA-Z0-9_]+)/i);
    if (urlMatch && urlMatch[1]) {
      raw = urlMatch[1];
    }
    const clean = raw.replace(/^#/, '').replace(/^@/, '').split(/[/?&#\s]/)[0].toLowerCase();
    if (!/^[a-z0-9_]{1,30}$/.test(clean)) return;
    try {
      const body = JSON.stringify({
        query: 'query($login: String!) { user(login: $login) { id } }',
        variables: { login: clean }
      });
      const res = await this._postTwitchGql(body);
      const userId = res?.data?.user?.id;
      if (userId) {
        await this.loadTwitchChannelEmotes(userId);
      }
    } catch (e) {}
  }

  /**
   * Loads channel-specific 7TV, BTTV, and FFZ emotes using Twitch numeric room-id
   */
  async loadTwitchChannelEmotes(roomId) {
    const rawId = String(roomId || '').trim();
    if (!/^\d{1,18}$/.test(rawId)) return;
    const numericRoomId = Number.parseInt(rawId, 10);
    if (!Number.isSafeInteger(numericRoomId) || numericRoomId <= 0) return;
    const safeRoomKey = String(numericRoomId);
    if (this.loadedRoomIds.has(safeRoomKey)) return;
    this.loadedRoomIds.add(safeRoomKey);

    // 1. 7TV Channel Emote Set
    try {
      const user7tv = await this._fetchJson(`https://7tv.io/v3/users/twitch/${numericRoomId}`);
      const emotes = user7tv?.emote_set?.emotes || [];
      this._register7tvEmoteList(emotes);
    } catch (e) {}

    // 2. BTTV Channel & Shared Emotes
    try {
      const userBttv = await this._fetchJson(`https://api.betterttv.net/3/cached/users/twitch/${numericRoomId}`);
      const allBttv = [...(userBttv?.channelEmotes || []), ...(userBttv?.sharedEmotes || [])];
      this._registerBttvEmoteList(allBttv);
    } catch (e) {}

    // 3. FFZ Channel Emotes (via BTTV proxy & direct FFZ API)
    try {
      const userFfz = await this._fetchJson(
        `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${numericRoomId}`
      );
      if (Array.isArray(userFfz)) {
        for (const em of userFfz) {
          const animUrl = em.animated?.['2x'] || em.animated?.['1x'];
          const staticUrl = em.images?.['2x'] || em.images?.['1x'] || em.images?.['4x'];
          const url = animUrl || staticUrl;
          if (em.code && url) {
            this.providers.ffz.set(em.code, {
              name: em.code,
              url: url.startsWith('//') ? `https:${url}` : url,
              staticUrl: staticUrl ? (staticUrl.startsWith('//') ? `https:${staticUrl}` : staticUrl) : url,
              provider: 'FFZ',
              animated: Boolean(animUrl)
            });
          }
        }
      }
    } catch (e) {}
  }

  _register7tvEmoteList(emotes) {
    if (!Array.isArray(emotes)) return;
    for (const em of emotes) {
      const name = em.name;
      const data = em.data || em;
      const host = data?.host;
      if (!name || !host?.url) continue;

      const baseUrl = host.url.startsWith('//') ? `https:${host.url}` : host.url;
      const isAnimated = Boolean(data.animated);
      const files = Array.isArray(host.files) ? host.files : [];

      // Pick best animated 2x.webp or 2x.gif file if available
      const has2xWebp = files.some((f) => f.name === '2x.webp');
      const has2xGif = files.some((f) => f.name === '2x.gif');
      const animFile = has2xWebp ? '2x.webp' : has2xGif ? '2x.gif' : '2x.webp';
      const staticFile = files.some((f) => f.name === '2x_static.webp') ? '2x_static.webp' : '1x.webp';

      this.providers['7tv'].set(name, {
        name,
        url: `${baseUrl}/${animFile}`,
        staticUrl: `${baseUrl}/${staticFile}`,
        provider: '7TV',
        animated: isAnimated,
        zeroWidth: Boolean(em.flags === 1 || data.flags === 256)
      });
    }
  }

  _registerBttvEmoteList(emotes) {
    if (!Array.isArray(emotes)) return;
    for (const em of emotes) {
      if (!em.code || !em.id) continue;
      const isAnimated = Boolean(em.animated || em.imageType === 'gif');
      // BTTV v3 CDN serves animated WebP/GIF at /2x.webp or /2x
      this.providers.bttv.set(em.code, {
        name: em.code,
        url: `https://cdn.betterttv.net/emote/${em.id}/2x.webp`,
        staticUrl: `https://cdn.betterttv.net/emote/${em.id}/1x`,
        provider: 'BTTV',
        animated: isAnimated
      });
    }
  }

  _registerFfzStandardList(emoticons) {
    if (!Array.isArray(emoticons)) return;
    for (const em of emoticons) {
      if (!em.name) continue;
      const anim = em.animated?.['2'] || em.animated?.['1'];
      const stat = em.urls?.['2'] || em.urls?.['1'];
      const chosen = anim || stat;
      if (!chosen) continue;
      const fixUrl = (u) => (u.startsWith('//') ? `https:${u}` : u);
      this.providers.ffz.set(em.name, {
        name: em.name,
        url: fixUrl(chosen),
        staticUrl: stat ? fixUrl(stat) : fixUrl(chosen),
        provider: 'FFZ',
        animated: Boolean(anim)
      });
    }
  }

  _lookupThirdPartyEmote(word) {
    // Priority: 7TV -> BTTV -> FFZ (respecting user's individual provider toggles!)
    if (this.settings.enable7tv && this.providers['7tv'].has(word)) {
      const hit = this.providers['7tv'].get(word);
      return {
        ...hit,
        url: this.settings.animateEmotes ? hit.url : hit.staticUrl || hit.url
      };
    }
    if (this.settings.enableBttv && this.providers.bttv.has(word)) {
      const hit = this.providers.bttv.get(word);
      return {
        ...hit,
        url: this.settings.animateEmotes ? hit.url : hit.staticUrl || hit.url
      };
    }
    if (this.settings.enableFfz && this.providers.ffz.has(word)) {
      const hit = this.providers.ffz.get(word);
      return {
        ...hit,
        url: this.settings.animateEmotes ? hit.url : hit.staticUrl || hit.url
      };
    }
    return null;
  }

  /**
   * Tokenizes a chat message into an array of { type: 'text' | 'emote', name, url, provider, animated, zeroWidth }
   * Supports:
   * - Pre-parsed native YouTube runs (`nativeTokens`)
   * - Native Twitch IRC `emotes` tag ranges (using `/default/dark/2.0` so animated Twitch emotes play!)
   * - Native TikTok `tiktokEmotes` array
   * - 7TV, BTTV, FFZ word replacement across all platforms
   */
  tokenizeMessage(text = '', options = {}) {
    const {
      twitchEmotesTag = '',
      youtubeRuns = null,
      tiktokEmotes = null
    } = typeof options === 'string' ? { twitchEmotesTag: options } : options;

    // Case A: YouTube message with structured `runs` (containing native YouTube custom channel emotes!)
    if (Array.isArray(youtubeRuns) && youtubeRuns.length > 0) {
      const rawSegments = [];
      for (const run of youtubeRuns) {
        if (run.emoji) {
          const thumbs = run.emoji.image?.thumbnails || [];
          const bestThumb = thumbs[thumbs.length - 1]?.url;
          const shortcut = run.emoji.shortcuts?.[0] || run.emoji.emojiId || 'emote';
          if (bestThumb && this.settings.enableYoutubeNative) {
            rawSegments.push({
              type: 'emote',
              name: shortcut,
              url: bestThumb,
              provider: 'YouTube',
              animated: true
            });
          } else {
            rawSegments.push({ type: 'text', text: shortcut });
          }
        } else if (run.text) {
          rawSegments.push({ type: 'text', text: run.text });
        }
      }
      // Also pass text segments through 7TV/BTTV/FFZ word matcher!
      const finalTokens = [];
      for (const seg of rawSegments) {
        if (seg.type === 'emote') {
          finalTokens.push(seg);
        } else {
          this._tokenizeTextWords(seg.text, new Map(), finalTokens);
        }
      }
      return finalTokens;
    }

    if (!text) return [];

    // Case B: Build Native Twitch & TikTok Emote Lookup Maps for this message
    const nativeWordMap = new Map();

    if (twitchEmotesTag && this.settings.enableTwitchNative) {
      // Twitch v2 emoticon format: /default/dark/2.0 serves animated GIF if animated, or static PNG if static!
      // If animations are disabled by user, /static/dark/2.0 forces static frame.
      const formatMode = this.settings.animateEmotes ? 'default' : 'static';
      const entries = twitchEmotesTag.split('/');
      for (const entry of entries) {
        const [emoteId, rangesStr] = entry.split(':');
        if (!emoteId || !rangesStr) continue;
        const firstRange = rangesStr.split(',')[0];
        const [startStr, endStr] = firstRange.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const word = Array.from(text).slice(start, end + 1).join('');
          if (word) {
            nativeWordMap.set(word, {
              name: word,
              url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/${formatMode}/dark/2.0`,
              provider: 'Twitch',
              animated: this.settings.animateEmotes
            });
          }
        }
      }
    }

    const finalTokens = [];
    this._tokenizeTextWords(text, nativeWordMap, finalTokens);

    // Append native TikTok subscriber emotes/stickers if included in message payload
    if (Array.isArray(tiktokEmotes) && tiktokEmotes.length > 0 && this.settings.enableTiktokNative) {
      for (const ttEm of tiktokEmotes) {
        const imgUrl = ttEm?.emoteImageUrl || ttEm?.image?.imageUrl;
        if (imgUrl) {
          finalTokens.push({
            type: 'emote',
            name: ttEm.emoteId ? `TikTokEmote_${ttEm.emoteId}` : 'TikTok Emote',
            url: imgUrl,
            provider: 'TikTok',
            animated: true
          });
        }
      }
    }

    return finalTokens;
  }

  _tokenizeTextWords(text, nativeWordMap, outTokens) {
    const appendText = (str) => {
      if (!str) return;
      if (outTokens.length > 0 && outTokens[outTokens.length - 1].type === 'text') {
        outTokens[outTokens.length - 1].text += str;
      } else {
        outTokens.push({ type: 'text', text: str });
      }
    };

    const parts = text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      // Check exact match first (native Twitch emote, then 7TV / BTTV / FFZ)
      const directHit = nativeWordMap.get(part) || this._lookupThirdPartyEmote(part);
      if (directHit) {
        outTokens.push({
          type: 'emote',
          name: part,
          url: directHit.url,
          provider: directHit.provider,
          animated: Boolean(directHit.animated),
          zeroWidth: Boolean(directHit.zeroWidth)
        });
        continue;
      }

      // Check if word is wrapped in quotes or trailing punctuation (e.g. peepoLove", PogU!, (KEKW))
      const punctMatch = part.match(/^([("'\[„«]*)([^\s"'()\[\]„“”«».,!?:;]+)([)"'\]“”».,!?:;]*)$/);
      if (punctMatch && (punctMatch[1] || punctMatch[3])) {
        const [, lead, core, trail] = punctMatch;
        const coreHit = nativeWordMap.get(core) || this._lookupThirdPartyEmote(core);
        if (coreHit) {
          appendText(lead);
          outTokens.push({
            type: 'emote',
            name: core,
            url: coreHit.url,
            provider: coreHit.provider,
            animated: Boolean(coreHit.animated),
            zeroWidth: Boolean(coreHit.zeroWidth)
          });
          appendText(trail);
          continue;
        }
      }

      appendText(part);
    }
  }

  _postTwitchGql(bodyStr) {
    return new Promise((resolve, reject) => {
      const req = https.request(
        'https://gql.twitch.tv/gql',
        {
          method: 'POST',
          headers: {
            'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyStr)
          },
          timeout: 4500
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
      req.write(bodyStr);
      req.end();
    });
  }

  _fetchJson(rawUrl) {
    return new Promise((resolve, reject) => {
      let parsed;
      try {
        parsed = new URL(String(rawUrl || ''));
      } catch (err) {
        return reject(new Error('Ungültige Emote-API-URL.'));
      }
      if (
        parsed.protocol !== 'https:' ||
        parsed.username ||
        parsed.password ||
        parsed.port ||
        parsed.search ||
        parsed.hash
      ) {
        return reject(new Error('Nicht erlaubte Emote-API-URL.'));
      }
      const safeHost = ALLOWED_EMOTE_API_HOSTS.find((h) => h === parsed.hostname);
      if (!safeHost || !ALLOWED_EMOTE_API_PATH_RE.test(parsed.pathname)) {
        return reject(new Error('Nicht erlaubter Emote-API-Endpunkt.'));
      }

      const req = https.get(
        {
          protocol: 'https:',
          hostname: safeHost,
          port: 443,
          path: parsed.pathname,
          timeout: 5000
        },
        (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            res.resume();
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }
}

module.exports = { EmoteManager };
