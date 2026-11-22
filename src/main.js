const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { TwitchConnector } = require('./connectors/twitch');
const { YouTubeConnector } = require('./connectors/youtube');
const { TikTokConnector } = require('./connectors/tiktok');
const { ObsServer } = require('./obs_server');
const { EmoteManager } = require('./emote_manager');
const { SpotifyBridge } = require('./spotify_bridge');
const { ObsWsClient } = require('./obs_ws_client');
const clipStudio = require('./clip_studio');

let mainWindow = null;
let isAlwaysOnTop = false;
let demoInterval = null;
let demoActive = process.env.DEMO_MODE === 'true';

const twitch = new TwitchConnector();
const youtube = new YouTubeConnector();
const tiktok = new TikTokConnector();
const obsServer = new ObsServer(4588);
const obsWs = new ObsWsClient();
const emoteManager = new EmoteManager();
const spotify = new SpotifyBridge();
let lastSongReplyAt = 0;

// Global deduplication ring buffer across all connectors & reconnects
const globalSeenMsgKeys = new Set();

function isDuplicateMessage(msg) {
  if (!msg) return true;
  const idKey = `${msg.platform}:${msg.id}`;
  // Secondary fingerprint (same platform + author + text within 4-second bucket)
  const timeBucket = Math.floor((msg.timestamp || Date.now()) / 4000);
  const contentKey = `${msg.platform}:${(msg.author || '').toLowerCase()}:${msg.text}:${timeBucket}`;

  if (globalSeenMsgKeys.has(idKey) || (!msg.isSelf && globalSeenMsgKeys.has(contentKey))) {
    return true;
  }

  globalSeenMsgKeys.add(idKey);
  globalSeenMsgKeys.add(contentKey);

  if (globalSeenMsgKeys.size > 3000) {
    const iter = globalSeenMsgKeys.values();
    for (let i = 0; i < 500; i++) {
      globalSeenMsgKeys.delete(iter.next().value);
    }
  }
  return false;
}

const platformStatus = {
  twitch: { status: 'disconnected', channel: '', viewers: 0, enabled: true },
  youtube: { status: 'disconnected', channel: '', viewers: 0, enabled: true, availableStreams: [] },
  tiktok: { status: 'disconnected', channel: '', viewers: 0, likes: 0, enabled: true }
};

let chatDockWindow = null;
let boundsSaveTimer = null;

function broadcastToWindows(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
  if (chatDockWindow && !chatDockWindow.isDestroyed()) {
    chatDockWindow.webContents.send(channel, payload);
  }
}

function getConfigPath() {
  return path.join(app.getPath('userData'), 'omnichat-config.json');
}

let cachedConfig = null;
const diagnosticLogs = [];

function appendDiagLog(platform, level, message) {
  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    platform: platform || 'system',
    level: level || 'info',
    message: String(message || '')
  };
  diagnosticLogs.push(entry);
  if (diagnosticLogs.length > 200) {
    diagnosticLogs.shift();
  }
  broadcastToWindows('diag-log', entry);
}

function getDefaultConfig() {
  return {
    streamerName: '',
    keywordAlerts: '',
    keywordSound: true,
    keywordColor: '#f97316',
    autoConnectOnStart: true,
    soundAlerts: true,
    compactChat: false,
    spotifyEnabled: true,
    spotifyAutoCommand: true,
    obsAlerts: {
      enabled: true,
      durationSec: 5,
      soundEnabled: true,
      animation: 'pop',
      types: {
        follow: true,
        sub: true,
        resub: true,
        subgift: true,
        bits: true,
        raid: true
      },
      customMedia: {}
    },
    obsGoals: {
      enabled: true,
      title: 'Sub-Goal',
      current: 0,
      target: 50,
      autoFollow: false,
      autoSub: true,
      barColor: '#9146ff'
    },
    tts: {
      enabled: false,
      readAlerts: true,
      readChatCommand: true,
      commandPrefix: '!tts',
      maxLength: 180,
      rate: 1.0,
      volume: 0.9,
      voiceURI: ''
    },
    obsWs: {
      enabled: false,
      host: '127.0.0.1',
      port: 4455,
      password: '',
      micName: ''
    },
    chatTimers: {
      enabled: false,
      intervalMin: 15,
      messages: ['Schaut gerne auf unserem Discord vorbei!']
    },
    autoMod: {
      enabled: false,
      blockLinks: true,
      blockCaps: false,
      capsPercent: 75,
      blockSymbols: false,
      blacklist: '',
      timeoutSec: 60,
      exemptMods: true
    },
    customCommands: {
      enabled: false,
      cooldownSec: 10,
      rules: [
        '!discord | Komm gerne auf unseren Discord!',
        '!lurk | Danke für den Lurk, @{user}!'
      ]
    },
    hideBots: false,
    collapseSpam: true,
    platformIndicatorStyle: 'icon_badge',
    mainWindowBounds: null,
    chatDockBounds: null,
    chatDockOpen: false,
    chatDockAlwaysOnTop: true,
    appearance: {
      layoutMode: 'inline',
      nameFontSize: 13,
      msgFontSize: 13.5,
      maxNameLength: 16,
      showPlatformIcons: true,
      showTimestamps: true,
      msgPadding: 5,
      maxDomMessages: 150,
      showSeparator: true,
      sepColor: '#ffffff',
      sepOpacity: 8,
      sepSpacing: 0,
      bgColor: '#0b0f19',
      bgOpacity: 100,
      obsBgOpacity: 60,
      usernameColorMode: 'user',
      eventHighlights: {
        style: 'bar', // 'bar' (Kompakt-Balken + Hintergrund) | 'banner' (Voll-Banner) | 'outline' (Dezenter Rahmen)
        intensity: 18, // 5..60% background tint opacity
        types: {
          follow: { enabled: true, color: '#10b981' },
          sub: { enabled: true, color: '#f59e0b' },
          resub: { enabled: true, color: '#a855f7' },
          subgift: { enabled: true, color: '#ec4899' },
          bits: { enabled: true, color: '#06b6d4' },
          raid: { enabled: true, color: '#ef4444' },
          highlighted_msg: { enabled: true, color: '#3b82f6' }
        }
      }
    },
    emoteSettings: {
      enable7tv: true,
      enableBttv: true,
      enableFfz: true,
      enableTwitchNative: true,
      enableYoutubeNative: true,
      enableTiktokNative: true,
      animateEmotes: true
    },
    mutedUsers: [],
    peripherals: {
      keyboardId: '',
      keyboardName: '',
      mouseId: '',
      mouseName: '',
      keyboardMode: 'chat_and_macros',
      mouseScrollChat: true,
      globalHotkeysEnabled: true,
      hotkeys: {
        pinLast: 'CommandOrControl+Alt+P',
        unpin: 'CommandOrControl+Alt+U',
        clearChat: 'CommandOrControl+Alt+C',
        toggleCompact: 'CommandOrControl+Alt+K'
      }
    },
    twitchEnabled: true,
    twitchChannel: '',
    twitchUsername: '',
    twitchToken: '',
    youtubeEnabled: true,
    youtubeChannel: '',
    youtubeVideoId: '',
    youtubeOAuth: {
      clientId: '',
      clientSecret: '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0,
      accountName: ''
    },
    tiktokEnabled: true,
    tiktokChannel: '',
    tiktokRoomId: ''
  };
}

function loadConfig(forceReload = false) {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }
  const defaults = getDefaultConfig();
  try {
    const p = getConfigPath();
    if (fs.existsSync(p)) {
      const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
      const mergedAppearance = { ...defaults.appearance, ...(parsed.appearance || {}) };
      if (parsed.appearance?.eventHighlights) {
        mergedAppearance.eventHighlights = {
          ...defaults.appearance.eventHighlights,
          ...parsed.appearance.eventHighlights,
          types: {
            ...defaults.appearance.eventHighlights.types,
            ...(parsed.appearance.eventHighlights.types || {})
          }
        };
      }
      cachedConfig = {
        ...defaults,
        ...parsed,
        appearance: mergedAppearance,
        emoteSettings: { ...defaults.emoteSettings, ...(parsed.emoteSettings || {}) }
      };
      return cachedConfig;
    }
  } catch (e) {}
  cachedConfig = defaults;
  return cachedConfig;
}

function saveConfig(cfg) {
  cachedConfig = cfg;
  try {
    fs.writeFileSync(getConfigPath(), JSON.stringify(cfg, null, 2), 'utf8');
  } catch (e) {}
}

function persistWindowBounds(key, win) {
  if (!win || win.isDestroyed()) return;
  clearTimeout(boundsSaveTimer);
  boundsSaveTimer = setTimeout(() => {
    if (!win || win.isDestroyed()) return;
    const cfg = loadConfig();
    cfg[key] = win.getBounds();
    saveConfig(cfg);
  }, 400);
}

function getAppIconPath() {
  const file = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  const p = path.join(__dirname, '..', 'assets', file);
  return fs.existsSync(p) ? p : undefined;
}

function createMainWindow() {
  if (process.platform === 'darwin' && app.dock) {
    const dockIcon = path.join(__dirname, '..', 'assets', 'icon.png');
    if (fs.existsSync(dockIcon)) {
      try { app.dock.setIcon(dockIcon); } catch (e) {}
    }
  }
  const saved = loadConfig();
  const b = saved.mainWindowBounds;

  mainWindow = new BrowserWindow({
    x: b?.x,
    y: b?.y,
    width: b?.width || 1180,
    height: b?.height || 820,
    minWidth: 220,
    minHeight: 360,
    backgroundColor: '#0b0f19',
    icon: getAppIconPath(),
    title: 'OmniStream Chat — Dein Streamer Cockpit (Twitch • YouTube • TikTok)',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('resize', () => persistWindowBounds('mainWindowBounds', mainWindow));
  mainWindow.on('move', () => persistWindowBounds('mainWindowBounds', mainWindow));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Opens or focuses the standalone, freely movable & resizable Chat-Dock Window
 * Ideal for placing full-height on the left side of OBS while keeping normal OBS docks intact!
 */
function openStandaloneChatWindow(snapLeftFullHeight = false) {
  const { screen } = require('electron');
  const workArea = screen.getPrimaryDisplay().workArea;
  const saved = loadConfig();

  const defaultBounds = {
    x: workArea.x,
    y: workArea.y,
    width: 320,
    height: workArea.height
  };
  const b = snapLeftFullHeight ? defaultBounds : saved.chatDockBounds || defaultBounds;

  if (chatDockWindow && !chatDockWindow.isDestroyed()) {
    if (snapLeftFullHeight) {
      chatDockWindow.setBounds(defaultBounds);
      persistWindowBounds('chatDockBounds', chatDockWindow);
    }
    chatDockWindow.focus();
    return;
  }

  chatDockWindow = new BrowserWindow({
    x: b.x,
    y: b.y,
    width: Math.max(220, b.width || 320),
    height: Math.max(360, b.height || workArea.height),
    minWidth: 220,
    minHeight: 320,
    backgroundColor: '#0b0f19',
    icon: getAppIconPath(),
    title: 'OmniStream Chat — Standalone Chat-Fenster (Links neben OBS)',
    alwaysOnTop: saved.chatDockAlwaysOnTop !== false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (saved.chatDockAlwaysOnTop !== false) {
    chatDockWindow.setAlwaysOnTop(true, 'floating');
  }

  chatDockWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'), {
    query: { standalone: '1' }
  });

  chatDockWindow.webContents.on('did-finish-load', () => {
    const cfg = loadConfig();
    chatDockWindow.webContents.send('init-state', {
      config: cfg,
      obsUrl: `http://127.0.0.1:${obsServer.port}`,
      obsDockUrl: `http://127.0.0.1:${obsServer.port}/dock`,
      platformStatus,
      isAlwaysOnTop: cfg.chatDockAlwaysOnTop !== false,
      demoActive,
      isStandaloneWindow: true
    });
  });

  chatDockWindow.on('resize', () => persistWindowBounds('chatDockBounds', chatDockWindow));
  chatDockWindow.on('move', () => persistWindowBounds('chatDockBounds', chatDockWindow));

  chatDockWindow.on('closed', () => {
    chatDockWindow = null;
    const cfg = loadConfig();
    cfg.chatDockOpen = false;
    saveConfig(cfg);
  });

  saved.chatDockOpen = true;
  if (snapLeftFullHeight) {
    saved.chatDockBounds = defaultBounds;
  }
  saveConfig(saved);
}

function isMentionForStreamer(text, cfg) {
  if (!text) return false;
  const lower = text.toLowerCase();
  const candidates = [
    cfg.streamerName,
    cfg.twitchChannel,
    cfg.youtubeChannel?.replace(/^@/, ''),
    cfg.tiktokChannel?.replace(/^@/, '')
  ]
    .filter(Boolean)
    .map((s) => s.trim().toLowerCase());

  for (const name of candidates) {
    if (name.length >= 2 && (lower.includes(`@${name}`) || lower.includes(name))) {
      return true;
    }
  }
  return false;
}

function matchKeywordAlert(text, cfg) {
  if (!text || !cfg?.keywordAlerts) return null;
  const lower = text.toLowerCase();
  const terms = String(cfg.keywordAlerts)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length >= 2);

  for (const kw of terms) {
    if (lower.includes(kw)) {
      return kw;
    }
  }
  return null;
}

const PRIVILEGED_BADGES = new Set(['STREAMER', 'BROADCASTER', 'OWNER', 'MODERATOR', 'VIP']);

function checkAutoMod(msg, cfg) {
  const am = cfg.autoMod;
  if (!am || !am.enabled || msg.isSelf || msg.eventType) return false;
  if (am.exemptMods !== false && Array.isArray(msg.badges)) {
    if (msg.badges.some((b) => PRIVILEGED_BADGES.has(String(b).toUpperCase()))) return false;
  }
  const text = String(msg.text || '');
  let reason = '';

  if (am.blockLinks && /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9-]+\.(?:com|de|net|org|tv|gg|io|me|xyz|ly)\b)/i.test(text)) {
    reason = 'Link blockiert';
  }
  if (!reason && am.blockCaps) {
    const letters = text.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
    if (letters.length >= 8) {
      const upper = letters.replace(/[^A-ZÄÖÜ]/g, '').length;
      if ((upper / letters.length) * 100 >= (Number(am.capsPercent) || 75)) {
        reason = 'Caps-Spam';
      }
    }
  }
  if (!reason && am.blockSymbols) {
    const symbols = text.replace(/[a-zA-Z0-9äöüÄÖÜß\s.,!?'"():-]/g, '');
    if (symbols.length >= 10 && symbols.length / Math.max(1, text.length) > 0.45) {
      reason = 'Symbol-Spam';
    }
  }
  if (!reason && am.blacklist) {
    const words = String(am.blacklist)
      .split(',')
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length >= 2);
    const low = text.toLowerCase();
    const hit = words.find((w) => low.includes(w));
    if (hit) reason = `Blacklist ("${hit}")`;
  }

  if (!reason) return false;

  appendDiagLog(msg.platform, 'warn', `🛡️ Auto-Mod (${reason}): ${msg.author} — "${text}"`);
  if (msg.platform === 'twitch' && twitch.connected && twitch.canWrite) {
    const tSec = Math.max(0, parseInt(am.timeoutSec ?? 60, 10) || 0);
    try {
      if (tSec > 0) twitch.sendMessage(`/timeout ${msg.author} ${tSec} Auto-Mod: ${reason}`);
      else if (msg.id) twitch.sendMessage(`/delete ${msg.id}`);
    } catch (e) {}
  }
  return true;
}

let chatTimerHandle = null;
let chatTimerIndex = 0;

async function runChatTimerTick(force = false) {
  const cfg = loadConfig();
  const ct = cfg.chatTimers;
  if (!force && (!ct || !ct.enabled)) return { ok: false, error: 'Chat-Timer ist deaktiviert.' };
  const lines = Array.isArray(ct?.messages)
    ? ct.messages.map((s) => String(s || '').trim()).filter(Boolean)
    : [];
  if (lines.length === 0) return { ok: false, error: 'Keine Timer-Nachrichten eingetragen.' };

  const text = lines[chatTimerIndex % lines.length];
  chatTimerIndex += 1;
  const sentTo = [];

  if (demoActive) {
    forwardChatMessage({
      id: `timer_demo_${Date.now()}`,
      platform: 'twitch',
      channel: cfg.twitchChannel || 'demo-live',
      author: cfg.streamerName || 'Chat-Timer',
      color: '#38bdf8',
      badges: ['BROADCASTER'],
      text,
      isSelf: true,
      timestamp: Date.now()
    });
    sentTo.push('demo');
  } else {
    if (twitch.connected && twitch.canWrite) {
      try {
        twitch.sendMessage(text);
        sentTo.push('twitch');
      } catch (e) {}
    }
    if (youtube.connected && youtube.canWrite) {
      try {
        await youtube.sendMessage(text);
        sentTo.push('youtube');
      } catch (e) {}
    }
  }

  appendDiagLog('system', 'info', `⏱️ Chat-Timer (${sentTo.join(', ') || 'keine aktive Schreib-Plattform'}): "${text}"`);
  return { ok: true, text, sentTo };
}

function syncChatTimer(cfg) {
  if (chatTimerHandle) {
    clearInterval(chatTimerHandle);
    chatTimerHandle = null;
  }
  const ct = cfg?.chatTimers;
  if (!ct || !ct.enabled) return;
  const lines = Array.isArray(ct.messages)
    ? ct.messages.map((s) => String(s || '').trim()).filter(Boolean)
    : [];
  if (lines.length === 0) return;
  const ms = Math.max(1, Math.min(180, Number(ct.intervalMin || 15))) * 60000;
  chatTimerHandle = setInterval(() => {
    runChatTimerTick(false);
  }, ms);
}

const customCommandCooldowns = new Map();

function handleCustomChatCommand(msg, cfg) {
  const cc = cfg.customCommands;
  if (!cc || !cc.enabled || msg.isSelf || msg.eventType) return;
  const txt = String(msg.text || '').trim();
  if (!txt.startsWith('!')) return;

  const trigger = txt.split(/\s+/)[0].toLowerCase();
  if (/^!(song|music|musik|tts|vote|poll)$/.test(trigger)) return;

  const parsed = [];
  for (const line of Array.isArray(cc.rules) ? cc.rules : []) {
    const sepIdx = String(line || '').indexOf('|');
    if (sepIdx === -1) continue;
    const cmd = line.slice(0, sepIdx).trim().toLowerCase();
    const reply = line.slice(sepIdx + 1).trim();
    if (cmd && reply) parsed.push({ cmd: cmd.startsWith('!') ? cmd : `!${cmd}`, reply });
  }

  let matched = parsed.find((r) => r.cmd === trigger);
  if (!matched && trigger === '!commands' && parsed.length > 0) {
    matched = { cmd: '!commands', reply: `Befehle: ${parsed.map((r) => r.cmd).join(', ')}` };
  }
  if (!matched) return;

  const cooldownMs = Math.max(2, Number(cc.cooldownSec || 10)) * 1000;
  const lastAt = customCommandCooldowns.get(matched.cmd) || 0;
  if (Date.now() - lastAt < cooldownMs) return;
  customCommandCooldowns.set(matched.cmd, Date.now());

  const replyText = matched.reply
    .replace(/\{user\}/gi, msg.author || 'Zuschauer')
    .replace(/\{platform\}/gi, (msg.platform || '').toUpperCase());

  if (demoActive) {
    setTimeout(() => {
      forwardChatMessage({
        id: `cmd_demo_${Date.now()}`,
        platform: msg.platform,
        channel: msg.channel || 'demo-live',
        author: cfg.streamerName || 'Bot',
        color: '#38bdf8',
        badges: ['BROADCASTER'],
        text: replyText,
        isSelf: true,
        timestamp: Date.now()
      });
    }, 180);
  } else if (msg.platform === 'twitch' && twitch.connected && twitch.canWrite) {
    try {
      twitch.sendMessage(replyText, msg.id || null);
    } catch (e) {}
  } else if (msg.platform === 'youtube' && youtube.connected && youtube.canWrite) {
    youtube.sendMessage(replyText).catch(() => {});
  }
  appendDiagLog(msg.platform, 'info', `🤖 Command ${matched.cmd} → "${replyText}"`);
}

function forwardChatMessage(msg) {
  try {
    const cfg = loadConfig();

    if (!demoActive) {
      if (msg.platform === 'twitch' && cfg.twitchEnabled === false) return;
      if (msg.platform === 'youtube' && cfg.youtubeEnabled === false) return;
      if (msg.platform === 'tiktok' && cfg.tiktokEnabled === false) return;
    }

    if (isDuplicateMessage(msg)) return;

    const authorLow = (msg.author || '').toLowerCase();
    if (Array.isArray(cfg.mutedUsers) && cfg.mutedUsers.includes(authorLow)) {
      return;
    }

    if (checkAutoMod(msg, cfg)) {
      return;
    }

    const tokens = emoteManager.tokenizeMessage(msg.text, {
      twitchEmotesTag: msg.twitchEmotes || '',
      youtubeRuns: msg.youtubeRuns || null,
      tiktokEmotes: msg.tiktokEmotes || null
    });

    const matchedKeyword = matchKeywordAlert(msg.text, cfg);

    const enriched = {
      ...msg,
      timestamp: Number(msg.timestamp || Date.now()),
      tokens,
      isMention: Boolean(msg.isMention || isMentionForStreamer(msg.text, cfg)),
      isKeywordAlert: Boolean(matchedKeyword),
      matchedKeyword: matchedKeyword || ''
    };

    obsServer.broadcastChat(enriched);
    broadcastToWindows('chat-message', enriched);
    handlePollVote(enriched);
    handleCustomChatCommand(enriched, cfg);

    // Auto-reply to !song / !music in Twitch chat (5s anti-spam cooldown)
    const cleanCmdText = String(msg.text || '').trim();
    if (
      cfg.spotifyEnabled !== false &&
      cfg.spotifyAutoCommand !== false &&
      !cleanCmdText.startsWith('🎵') &&
      /^!(song|music|musik)\b/i.test(cleanCmdText)
    ) {
      const now = Date.now();
      if (now - lastSongReplyAt > 5000) {
        if (!spotify.currentTrack?.running || !spotify.currentTrack?.title) {
          spotify.pollNow();
        }
        if (spotify.currentTrack?.running && spotify.currentTrack?.title) {
          lastSongReplyAt = now;
          const songText = spotify.currentTrack.artist
            ? `🎵 Aktueller Song: ${spotify.currentTrack.artist} – ${spotify.currentTrack.title}`
            : `🎵 Aktueller Song: ${spotify.currentTrack.title}`;
          appendDiagLog('system', 'info', `!song erkannt (${msg.author}) → ${songText}`);
          try {
            if (demoActive) {
              setTimeout(() => {
                forwardChatMessage({
                  id: `sp_bot_${Date.now()}`,
                  platform: msg.platform || 'twitch',
                  channel: msg.channel || 'demo-live',
                  author: cfg.streamerName || cfg.twitchUsername || 'OmniStream Bot',
                  color: '#1db954',
                  badges: ['BOT'],
                  text: songText,
                  isSelf: true,
                  timestamp: Date.now()
                });
              }, 200);
            } else if (msg.platform === 'twitch' && twitch.connected && twitch.canWrite) {
              twitch.sendMessage(songText, msg.isSelf ? null : msg.id);
            } else if (msg.platform === 'youtube' && youtube.connected && youtube.canWrite) {
              youtube.sendMessage(songText).catch((err) => {
                appendDiagLog('youtube', 'error', `!song Antwort fehlgeschlagen: ${err.message}`);
              });
            }
          } catch (e) {
            appendDiagLog('twitch', 'error', `!song Antwort fehlgeschlagen: ${e.message}`);
          }
        } else {
          appendDiagLog('system', 'warn', '!song erkannt, aber Spotify spielt aktuell keinen Track.');
        }
      }
    }
  } catch (e) {}
}

const OBS_ALERT_TYPE_MAP = {
  follow: 'follow',
  sub: 'sub',
  member: 'sub',
  resub: 'resub',
  subgift: 'subgift',
  bits: 'bits',
  gift: 'bits',
  superchat: 'bits',
  raid: 'raid'
};

const OBS_ALERT_COLOR_MAP = {
  follow: '#3b82f6',
  sub: '#9146ff',
  resub: '#a855f7',
  subgift: '#ec4899',
  bits: '#f59e0b',
  raid: '#10b981'
};

function normalizeObsAlertType(rawType) {
  const key = String(rawType || '').toLowerCase().trim();
  return OBS_ALERT_TYPE_MAP[key] || 'follow';
}

function broadcastEventToObsAlert(ev, bypassFilter = false) {
  const cfg = loadConfig();
  const alertCfg = cfg.obsAlerts || getDefaultConfig().obsAlerts;
  const normType = normalizeObsAlertType(ev.type);
  if (!bypassFilter) {
    if (alertCfg.enabled === false) return;
    if (alertCfg.types && alertCfg.types[normType] === false) return;
  }
  obsServer.broadcastAlert({
    ...ev,
    normType,
    color: OBS_ALERT_COLOR_MAP[normType] || '#9146ff'
  });
}

let activePoll = {
  active: false,
  visible: true,
  visibleWhenStopped: false,
  question: '',
  options: [],
  voters: {},
  totalVotes: 0
};

function getSanitizedPoll() {
  return {
    active: activePoll.active,
    visible: activePoll.visible !== false,
    visibleWhenStopped: activePoll.visibleWhenStopped,
    question: activePoll.question,
    options: activePoll.options.map((o) => ({ label: o.label, votes: o.votes })),
    totalVotes: activePoll.totalVotes
  };
}

function handlePollVote(msg) {
  if (!activePoll.active || !activePoll.options.length) return;
  const txt = String(msg.text || '').trim();
  const match = txt.match(/^!(?:vote|poll)\s+(\d+)/i);
  if (!match) return;
  const idx = parseInt(match[1], 10) - 1;
  if (idx < 0 || idx >= activePoll.options.length) return;

  const voterKey = `${msg.platform || 'chat'}:${String(msg.author || '').toLowerCase()}`;
  const prevIdx = activePoll.voters[voterKey];
  if (prevIdx === idx) return;
  if (typeof prevIdx === 'number' && activePoll.options[prevIdx]) {
    activePoll.options[prevIdx].votes = Math.max(0, activePoll.options[prevIdx].votes - 1);
    activePoll.totalVotes = Math.max(0, activePoll.totalVotes - 1);
  }
  activePoll.voters[voterKey] = idx;
  activePoll.options[idx].votes += 1;
  activePoll.totalVotes += 1;

  const snap = getSanitizedPoll();
  obsServer.broadcastPoll(snap);
  broadcastToWindows('poll-updated', snap);
}

function incrementGoalForEvent(ev) {
  const cfg = loadConfig();
  const goals = cfg.obsGoals || getDefaultConfig().obsGoals;
  if (!goals || goals.enabled === false) return;
  const normType = normalizeObsAlertType(ev.type);
  const shouldInc =
    (goals.autoFollow && normType === 'follow') ||
    (goals.autoSub && ['sub', 'resub', 'subgift'].includes(normType));
  if (!shouldInc) return;

  const nextGoals = { ...goals, current: Math.max(0, Number(goals.current || 0) + 1) };
  cfg.obsGoals = nextGoals;
  saveConfig(cfg);
  obsServer.broadcastGoals(nextGoals);
  broadcastToWindows('goals-updated', nextGoals);
}

function forwardStreamerEvent(ev) {
  appendDiagLog(ev.platform, 'event', `${(ev.type || 'EVENT').toUpperCase()}: ${ev.author} — ${ev.summary}`);
  broadcastToWindows('streamer-event', ev);
  broadcastEventToObsAlert(ev, false);
  incrementGoalForEvent(ev);
}

function forwardStatus(update) {
  const cfg = loadConfig();
  const prev = platformStatus[update.platform] || {};
  const enabledKey = `${update.platform}Enabled`;
  platformStatus[update.platform] = {
    ...prev,
    ...update,
    enabled: cfg[enabledKey] !== false,
    viewers: typeof update.viewers === 'number' ? update.viewers : prev.viewers || 0
  };
  const level = update.status === 'error' ? 'error' : update.status === 'reconnecting' ? 'warn' : 'info';
  const detail = update.error || update.streamTitle || update.channel || update.status;
  appendDiagLog(update.platform, level, `Status → ${String(update.status || '').toUpperCase()} (${detail || ''})`);
  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);
}

function forwardStats(stats) {
  const prev = platformStatus[stats.platform] || {};
  platformStatus[stats.platform] = {
    ...prev,
    viewers: typeof stats.viewers === 'number' ? stats.viewers : prev.viewers || 0,
    likes: typeof stats.likes === 'number' ? stats.likes : prev.likes || 0
  };
  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);
}

twitch.on('room-id', (roomId) => {
  appendDiagLog('twitch', 'info', `Twitch Room-ID erkannt (${roomId}) — Lade 7TV/BTTV/FFZ Kanal-Emotes...`);
  emoteManager.loadTwitchChannelEmotes(roomId);
});

twitch.on('delete-message', (msgId) => {
  obsServer.deleteMessage(msgId);
  broadcastToWindows('message-deleted', { id: msgId });
});

[twitch, youtube, tiktok].forEach((conn) => {
  conn.on('chat', (msg) => forwardChatMessage(msg));
  conn.on('event', (ev) => forwardStreamerEvent(ev));
  conn.on('status', (st) => forwardStatus(st));
  conn.on('stats', (st) => forwardStats(st));
});

obsWs.on('state', (st) => {
  broadcastToWindows('obs-ws-state', st);
  obsServer.broadcastObsWsState(st);
});

youtube.on('oauth-updated', (oauth) => {
  const cfg = loadConfig();
  cfg.youtubeOAuth = { ...(cfg.youtubeOAuth || {}), ...oauth };
  saveConfig(cfg);
  platformStatus.youtube.canWrite = youtube.canWrite;
  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);
});

function connectSinglePlatform(platform, cfg) {
  if (platform === 'twitch') {
    if (cfg.twitchEnabled === false) {
      twitch.disconnect();
      return;
    }
    if (cfg.twitchChannel) {
      // Pre-fetch 7TV/BTTV/FFZ channel emotes immediately by channel login
      emoteManager.loadTwitchChannelEmotesByLogin(cfg.twitchChannel);
      twitch.connect({
        channel: cfg.twitchChannel,
        username: cfg.twitchUsername || cfg.twitchChannel,
        oauthToken: cfg.twitchToken
      });
    }
  } else if (platform === 'youtube') {
    youtube.setOAuthConfig(cfg.youtubeOAuth || {});
    if (cfg.youtubeEnabled === false) {
      youtube.disconnect();
      return;
    }
    if (cfg.youtubeChannel || cfg.youtubeVideoId) {
      youtube.connect({
        channelOrUrl: cfg.youtubeChannel,
        preferredVideoId: cfg.youtubeVideoId
      });
    }
  } else if (platform === 'tiktok') {
    if (cfg.tiktokEnabled === false) {
      tiktok.disconnect();
      return;
    }
    if (cfg.tiktokChannel || cfg.tiktokRoomId) {
      tiktok.connect({
        uniqueId: cfg.tiktokChannel,
        roomId: cfg.tiktokRoomId
      });
    }
  }
}

function connectAllSavedChannels(cfg) {
  connectSinglePlatform('twitch', cfg);
  connectSinglePlatform('youtube', cfg);
  connectSinglePlatform('tiktok', cfg);
}

const DEMO_SAMPLES = [
  {
    platform: 'twitch',
    author: 'CarryPotter99',
    color: '#9146ff',
    badges: ['SUB', 'VIP'],
    text: '@Streamer Normale Nachricht eines Abonnenten (nicht als Event hervorgehoben) catJAM GIGACHAD',
    isMention: true,
    eventType: null,
    isHighlight: false
  },
  {
    platform: 'tiktok',
    author: 'lena.clips',
    color: '#10b981',
    badges: ['❤️ NEUER FOLLOW'],
    text: 'folgt jetzt dem Kanal!',
    eventType: 'follow',
    isHighlight: true,
    event: { type: 'follow', summary: 'Neuer Follow auf TikTok!' }
  },
  {
    platform: 'twitch',
    author: 'PixelQueen',
    color: '#f59e0b',
    badges: ['⭐ NEUES SUB (Prime)'],
    text: 'Neues Abo (Prime)! — "Endlich dabei peepoLove"',
    eventType: 'sub',
    isHighlight: true,
    event: { type: 'sub', summary: 'Neues Abo (Prime)!' }
  },
  {
    platform: 'twitch',
    author: 'ShadowWalker',
    color: '#a855f7',
    badges: ['🌟 RESUB (14 MONATE)'],
    text: 'Resub im 14. Monat (Tier 1)! — "Bester Streamer auf Twitch PogU"',
    eventType: 'resub',
    isHighlight: true,
    event: { type: 'resub', summary: 'Resub im 14. Monat!' }
  },
  {
    platform: 'twitch',
    author: 'GigaGifter_DE',
    color: '#ec4899',
    badges: ['🎁 5x GIFTED SUBS'],
    text: 'verschenkt 5x Subs an die Community! Clap',
    eventType: 'subgift',
    isHighlight: true,
    event: { type: 'subgift', summary: '5x Gifted Subs!' }
  },
  {
    platform: 'twitch',
    author: 'CheerMaster',
    color: '#06b6d4',
    badges: ['💎 500 BITS'],
    text: 'Cheer500 Für das starke Comeback gerade! KEKW',
    eventType: 'bits',
    isHighlight: true,
    event: { type: 'bits', summary: '500 Bits gecheert!' }
  },
  {
    platform: 'twitch',
    author: 'xX_RaiderBoss_Xx',
    color: '#ef4444',
    badges: ['🚨 RAID (184 ZUSCHAUER)'],
    text: 'raidet den Kanal mit 184 Zuschauern! ratJAM',
    eventType: 'raid',
    isHighlight: true,
    event: { type: 'raid', summary: 'Raid mit 184 Zuschauern!' }
  },
  {
    platform: 'twitch',
    author: 'CuriousViewer',
    color: '#3b82f6',
    badges: ['✨ HERVORGEHOBEN'],
    text: 'Welches Mikrofon und Audio-Interface nutzt du eigentlich für deinen Stream? Clueless',
    eventType: 'highlighted_msg',
    isHighlight: true
  },
  {
    platform: 'youtube',
    author: 'TechNick_DE',
    color: '#ff4e45',
    badges: ['MEMBER'],
    text: 'Normale Nachricht eines YouTube-Kanalmitglieds in 1440p EZ',
    eventType: null,
    isHighlight: false
  }
];

let demoIdx = 0;
function startDemoSimulation() {
  stopDemoSimulation();
  demoActive = true;

  platformStatus.twitch = { status: 'connected', channel: 'DeinKanal', viewers: 142, enabled: true };
  platformStatus.youtube = {
    status: 'connected',
    channel: '@DeinKanal',
    videoId: 'dQw4w9WgXcQ',
    streamTitle: 'LIVE: Ranked Grind & Viewer Games!',
    availableStreams: [
      { videoId: 'dQw4w9WgXcQ', title: '🔴 LIVE: Ranked Grind & Viewer Games!', isLive: true },
      { videoId: 'jfKfPfyJRdk', title: '📅 Geplant: Community Turnier Sonntag 18 Uhr', isLive: false }
    ],
    viewers: 86,
    enabled: true
  };
  platformStatus.tiktok = { status: 'connected', channel: 'dein_tiktok', roomId: '739182739182', viewers: 318, likes: 14200, enabled: true };

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('demo-state', true);
    mainWindow.webContents.send('platform-status', platformStatus);
  }

  for (let i = 0; i < 4; i++) {
    emitNextDemoStep();
  }

  demoInterval = setInterval(() => {
    emitNextDemoStep();
  }, 2600);
}

function emitNextDemoStep() {
  const sample = DEMO_SAMPLES[demoIdx % DEMO_SAMPLES.length];
  demoIdx++;

  platformStatus.twitch.viewers = Math.max(10, (platformStatus.twitch.viewers || 140) + Math.floor(Math.random() * 7) - 3);
  platformStatus.youtube.viewers = Math.max(10, (platformStatus.youtube.viewers || 85) + Math.floor(Math.random() * 5) - 2);
  platformStatus.tiktok.viewers = Math.max(20, (platformStatus.tiktok.viewers || 310) + Math.floor(Math.random() * 13) - 5);
  platformStatus.tiktok.likes = (platformStatus.tiktok.likes || 14200) + Math.floor(Math.random() * 45);

  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);

  if (sample.event) {
    forwardStreamerEvent({
      id: `demo_ev_${Date.now()}_${demoIdx}`,
      platform: sample.platform,
      type: sample.event.type,
      author: sample.author,
      summary: sample.event.summary,
      timestamp: Date.now()
    });
  }

  forwardChatMessage({
    ...sample,
    id: `demo_${Date.now()}_${demoIdx}`,
    channel: 'demo-live',
    timestamp: Date.now()
  });
}

function stopDemoSimulation() {
  demoActive = false;
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }
  broadcastToWindows('demo-state', false);
}

app.whenReady().then(async () => {
  const obsPort = await obsServer.start();

  // Handle interactive actions sent from inside the OBS Custom Browser Dock (/dock)
  obsServer.onClientAction = (payload) => {
    if (!payload) return;
    if (payload.action === 'pin') {
      obsServer.broadcastPin(payload.data || null);
    } else if (payload.action === 'delete-msg' && payload.id) {
      obsServer.deleteMessage(payload.id);
      broadcastToWindows('message-deleted', { id: payload.id });
    } else if (payload.action === 'send-chat' && payload.text) {
      try {
        twitch.sendMessage(payload.text);
      } catch (e) {}
    }
  };

  // Handle Elgato Stream Deck & Bitfocus Companion REST API requests (/api/streamdeck/*)
  obsServer.onStreamDeckApi = async (action, params = {}, body = {}) => {
    const act = String(action || 'status').toLowerCase();
    appendDiagLog('system', 'info', `Stream Deck Aktion ausgeführt: /${act}`);

    if (act === 'status') {
      const cfg = loadConfig();
      return {
        ok: true,
        platforms: platformStatus,
        demoActive,
        isAlwaysOnTop,
        compactChat: Boolean(cfg.compactChat),
        soundAlerts: cfg.soundAlerts !== false,
        pinnedMessage: obsServer.pinnedMessage || null
      };
    }

    if (act === 'pin-last') {
      const lastMsg = obsServer.recentMessages[obsServer.recentMessages.length - 1] || null;
      if (!lastMsg) {
        return { ok: false, error: 'Keine aktuelle Chatnachricht zum Anpinnen vorhanden.' };
      }
      obsServer.broadcastPin(lastMsg);
      broadcastToWindows('streamdeck-command', { command: 'pin', msg: lastMsg });
      return { ok: true, pinned: lastMsg.author };
    }

    if (act === 'unpin') {
      obsServer.broadcastPin(null);
      broadcastToWindows('streamdeck-command', { command: 'unpin' });
      return { ok: true };
    }

    if (act === 'toggle-poll') {
      if (params.visible === 'true' || params.visible === '1' || body.visible === true) {
        activePoll.visible = true;
      } else if (params.visible === 'false' || params.visible === '0' || body.visible === false) {
        activePoll.visible = false;
      } else {
        activePoll.visible = !activePoll.visible;
      }
      const snap = getSanitizedPoll();
      obsServer.broadcastPoll(snap);
      broadcastToWindows('poll-updated', snap);
      return { ok: true, visible: snap.visible, poll: snap };
    }

    if (act === 'clip') {
      if (demoActive) {
        const demoUrl = 'https://clips.twitch.tv/DemoHighlightClip';
        appendDiagLog('twitch', 'info', `🎬 Demo-Clip erstellt: ${demoUrl}`);
        return { ok: true, demo: true, id: 'DemoHighlightClip', url: demoUrl, editUrl: `${demoUrl}/edit` };
      }
      try {
        const res = await twitch.createClip();
        appendDiagLog('twitch', 'info', `🎬 Twitch Clip erstellt: ${res.url}`);
        return res;
      } catch (err) {
        appendDiagLog('twitch', 'error', `Clip fehlgeschlagen: ${err.message}`);
        return { ok: false, error: err.message };
      }
    }

    if (act === 'marker') {
      const desc = String(params.description || body.description || 'OmniStream Highlight').trim();
      if (demoActive) {
        appendDiagLog('twitch', 'info', `🚩 Demo-Marker gesetzt: "${desc}"`);
        return { ok: true, demo: true, description: desc, positionSeconds: 42 };
      }
      try {
        const res = await twitch.createStreamMarker(desc);
        appendDiagLog('twitch', 'info', `🚩 Stream-Marker gesetzt: "${res.description}"`);
        return res;
      } catch (err) {
        appendDiagLog('twitch', 'error', `Marker fehlgeschlagen: ${err.message}`);
        return { ok: false, error: err.message };
      }
    }

    if (act === 'clip-and-marker') {
      const desc = String(params.description || body.description || 'OmniStream Highlight').trim();
      if (demoActive) {
        const demoUrl = 'https://clips.twitch.tv/DemoHighlightClip';
        appendDiagLog('twitch', 'info', `🎬🚩 Demo Clip + Marker: ${demoUrl} ("${desc}")`);
        return { ok: true, demo: true, clip: { ok: true, url: demoUrl }, marker: { ok: true, description: desc } };
      }
      const [clipRes, markerRes] = await Promise.allSettled([
        twitch.createClip(),
        twitch.createStreamMarker(desc)
      ]);
      const clip = clipRes.status === 'fulfilled' ? clipRes.value : { ok: false, error: clipRes.reason?.message };
      const marker = markerRes.status === 'fulfilled' ? markerRes.value : { ok: false, error: markerRes.reason?.message };
      if (!clip.ok && !marker.ok) {
        return { ok: false, error: `Clip: ${clip.error} | Marker: ${marker.error}`, clip, marker };
      }
      return { ok: true, clip, marker };
    }

    if (act === 'obs-scene') {
      const name = String(params.name || params.scene || body.sceneName || '').trim();
      if (!name) return { ok: false, error: 'Parameter "name" (Szenenname) fehlt.' };
      return await obsWs.setScene(name);
    }

    if (act === 'obs-replay') {
      return await obsWs.saveReplayBuffer();
    }

    if (act === 'obs-stream') {
      return await obsWs.toggleStream();
    }

    if (act === 'obs-record') {
      return await obsWs.toggleRecord();
    }

    if (act === 'obs-mic') {
      return await obsWs.toggleMicMute(params.input || body.inputName || '');
    }

    if (act === 'clear-chat') {
      globalSeenMsgKeys.clear();
      obsServer.clearChat();
      broadcastToWindows('streamdeck-command', { command: 'clear-chat' });
      return { ok: true };
    }

    if (act === 'toggle-compact') {
      const cfg = loadConfig();
      cfg.compactChat = !cfg.compactChat;
      saveConfig(cfg);
      broadcastToWindows('streamdeck-command', { command: 'set-compact', value: cfg.compactChat });
      return { ok: true, compactChat: cfg.compactChat };
    }

    if (act === 'toggle-sound') {
      const cfg = loadConfig();
      cfg.soundAlerts = cfg.soundAlerts === false ? true : false;
      saveConfig(cfg);
      broadcastToWindows('streamdeck-command', { command: 'set-sound', value: cfg.soundAlerts });
      return { ok: true, soundAlerts: cfg.soundAlerts };
    }

    if (act === 'toggle-always-on-top') {
      const targetWin = chatDockWindow && !chatDockWindow.isDestroyed() ? chatDockWindow : mainWindow;
      if (targetWin && !targetWin.isDestroyed()) {
        const nextState = !targetWin.isAlwaysOnTop();
        targetWin.setAlwaysOnTop(nextState, 'floating');
        if (targetWin === mainWindow) isAlwaysOnTop = nextState;
        broadcastToWindows('streamdeck-command', { command: 'set-always-on-top', value: nextState });
        return { ok: true, isAlwaysOnTop: nextState };
      }
      return { ok: false, error: 'Kein aktives Fenster gefunden.' };
    }

    if (act === 'toggle-demo') {
      if (demoActive) stopDemoSimulation();
      else startDemoSimulation();
      return { ok: true, demoActive };
    }

    if (act === 'test-alert') {
      const alertType = normalizeObsAlertType(params.type || body.type || 'sub');
      const sampleMap = {
        follow: { author: 'NeuerFollower', summary: 'Folgt jetzt dem Kanal!' },
        sub: { author: 'StreamFan99', summary: 'Neues Tier-1 Abo!' },
        resub: { author: 'TreuerZuschauer', summary: '6 Monate Resub! Danke!' },
        subgift: { author: 'GrosszuegigerMod', summary: 'Hat 5 Subs verschenkt!' },
        bits: { author: 'CheerKing', summary: '500 Bits gecheert!' },
        raid: { author: 'PartnerStreamer', summary: 'Raid mit 42 Zuschauern!' }
      };
      const sample = sampleMap[alertType] || sampleMap.sub;
      broadcastEventToObsAlert({
        id: `test_alert_${Date.now()}`,
        platform: String(params.platform || body.platform || 'twitch'),
        type: alertType,
        author: String(params.author || body.author || sample.author),
        summary: String(params.summary || body.summary || sample.summary),
        timestamp: Date.now()
      }, true);
      return { ok: true, type: alertType };
    }

    if (act === 'reconnect') {
      const plat = String(params.platform || body.platform || 'all').toLowerCase();
      stopDemoSimulation();
      if (plat === 'twitch' || plat === 'all') twitch.reconnect();
      if (plat === 'youtube' || plat === 'all') await youtube.reconnect();
      if (plat === 'tiktok' || plat === 'all') await tiktok.reconnect();
      return { ok: true, reconnected: plat };
    }

    if (act === 'toggle-platform') {
      const plat = String(params.platform || body.platform || '').toLowerCase();
      if (!['twitch', 'youtube', 'tiktok'].includes(plat)) {
        return { ok: false, error: 'Ungültige Plattform (erwartet: twitch, youtube oder tiktok).' };
      }
      const cfg = loadConfig();
      const next = cfg[`${plat}Enabled`] === false;
      cfg[`${plat}Enabled`] = next;
      saveConfig(cfg);
      platformStatus[plat].enabled = next;
      if (!next) {
        if (plat === 'twitch') twitch.disconnect();
        else if (plat === 'youtube') youtube.disconnect();
        else if (plat === 'tiktok') tiktok.disconnect();
      } else if (!demoActive) {
        connectSinglePlatform(plat, cfg);
      }
      obsServer.broadcastStatus(platformStatus);
      broadcastToWindows('platform-status', platformStatus);
      broadcastToWindows('streamdeck-command', { command: 'sync-config', config: cfg });
      return { ok: true, platform: plat, enabled: next };
    }

    if (act === 'send') {
      const text = String(params.text || body.text || '').trim();
      if (!text) return { ok: false, error: 'Parameter "text" fehlt.' };
      const cfg = loadConfig();
      if (demoActive) {
        forwardChatMessage({
          id: `sd_demo_${Date.now()}`,
          platform: 'twitch',
          channel: cfg.twitchChannel || 'demo-live',
          author: cfg.streamerName || cfg.twitchUsername || 'Streamer (Du)',
          color: '#34d399',
          badges: ['STREAMER'],
          text,
          isSelf: true,
          timestamp: Date.now()
        });
        return { ok: true, sent: text, demo: true };
      }
      twitch.sendMessage(text, null);
      return { ok: true, sent: text };
    }

    if (act === 'spotify-next') {
      return await spotify.control('next');
    }
    if (act === 'spotify-prev') {
      return await spotify.control('previous');
    }
    if (act === 'spotify-playpause') {
      return await spotify.control('playpause');
    }
    if (act === 'spotify-announce') {
      if (!spotify.currentTrack?.running || !spotify.currentTrack?.title) {
        return { ok: false, error: 'Aktuell läuft kein Spotify-Track.' };
      }
      const songText = spotify.currentTrack.artist
        ? `🎵 Aktueller Song: ${spotify.currentTrack.artist} – ${spotify.currentTrack.title}`
        : `🎵 Aktueller Song: ${spotify.currentTrack.title}`;
      twitch.sendMessage(songText, null);
      return { ok: true, sent: songText };
    }

    return { ok: false, error: `Unbekannte Stream-Deck-Aktion: ${act}` };
  };

  spotify.on('track', (track) => {
    obsServer.broadcastSpotify(track);
    broadcastToWindows('spotify-track', track);
  });

  ipcMain.handle('spotify-control', async (_ev, action) => {
    if (action === 'announce') {
      if (!spotify.currentTrack?.running || !spotify.currentTrack?.title) {
        return { ok: false, error: 'Aktuell läuft kein Spotify-Track.' };
      }
      const songText = spotify.currentTrack.artist
        ? `🎵 Aktueller Song: ${spotify.currentTrack.artist} – ${spotify.currentTrack.title}`
        : `🎵 Aktueller Song: ${spotify.currentTrack.title}`;
      try {
        twitch.sendMessage(songText, null);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }
    return await spotify.control(action);
  });

  createMainWindow();

  mainWindow.webContents.on('did-finish-load', async () => {
    const os = require('os');
    const QRCode = require('qrcode');
    const getTabletTargets = async () => {
      const nets = os.networkInterfaces();
      const raw = [];
      for (const name of Object.keys(nets)) {
        if (/^(docker|veth|vmnet|vbox|bridge|lo)/i.test(name)) continue;
        for (const net of nets[name] || []) {
          if (net.family === 'IPv4' && !net.internal) {
            const isCgnat = /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(net.address);
            const isVpnIf = /^(utun|tun|tap|tailscale|wg)/i.test(name) || isCgnat;
            const score = !isVpnIf && net.address.startsWith('192.168.')
              ? 4
              : !isVpnIf && net.address.startsWith('10.')
                ? 3
                : !isVpnIf
                  ? 2
                  : 1;
            const label = isVpnIf
              ? `Tailscale / VPN (${net.address})`
              : `WLAN / LAN (${net.address})`;
            const url = `http://${net.address}:${obsPort}/tablet`;
            let qrDataUrl = '';
            try {
              qrDataUrl = await QRCode.toDataURL(url, { width: 140, margin: 1 });
            } catch (e) {}
            raw.push({ label, url, qrDataUrl, score });
          }
        }
      }
      raw.sort((a, b) => b.score - a.score);
      if (raw.length === 0) {
        const url = `http://127.0.0.1:${obsPort}/tablet`;
        let qrDataUrl = '';
        try {
          qrDataUrl = await QRCode.toDataURL(url, { width: 140, margin: 1 });
        } catch (e) {}
        raw.push({ label: 'Lokal (127.0.0.1)', url, qrDataUrl, score: 0 });
      }
      return raw;
    };

    const tabletTargets = await getTabletTargets();
    const tabletUrl = tabletTargets[0].url;
    const tabletQrDataUrl = tabletTargets[0].qrDataUrl;

    const saved = loadConfig();
    spotify.start(saved.spotifyEnabled !== false);
    if (saved.emoteSettings) {
      emoteManager.updateSettings(saved.emoteSettings);
    }
    if (saved.appearance) {
      obsServer.broadcastAppearance({
        ...saved.appearance,
        platformIndicatorStyle: saved.platformIndicatorStyle || 'icon_badge'
      });
    }
    obsServer.broadcastAlertConfig(saved.obsAlerts || getDefaultConfig().obsAlerts);
    obsServer.broadcastGoals(saved.obsGoals || getDefaultConfig().obsGoals);
    obsServer.broadcastPoll(getSanitizedPoll());
    youtube.setOAuthConfig(saved.youtubeOAuth || {});
    platformStatus.twitch.enabled = saved.twitchEnabled !== false;
    platformStatus.youtube.enabled = saved.youtubeEnabled !== false;
    platformStatus.youtube.canWrite = youtube.canWrite;
    platformStatus.tiktok.enabled = saved.tiktokEnabled !== false;

    appendDiagLog('system', 'info', `OmniStream Chat gestartet — Tablet Companion unter ${tabletUrl}`);

    mainWindow.webContents.send('init-state', {
      config: saved,
      obsUrl: `http://127.0.0.1:${obsPort}`,
      obsDockUrl: `http://127.0.0.1:${obsPort}/dock`,
      obsAlertsUrl: `http://127.0.0.1:${obsPort}/alerts`,
      obsGoalsUrl: `http://127.0.0.1:${obsPort}/goals`,
      obsPollUrl: `http://127.0.0.1:${obsPort}/poll`,
      spotifyObsUrl: `http://127.0.0.1:${obsPort}/spotify`,
      tabletUrl,
      tabletQrDataUrl,
      tabletTargets,
      spotifyTrack: spotify.currentTrack,
      activePoll: getSanitizedPoll(),
      obsWsState: obsWs.getState(),
      streamDeckUrl: `http://127.0.0.1:${obsPort}/api/streamdeck`,
      platformStatus,
      isAlwaysOnTop,
      demoActive,
      diagnosticLogs
    });

    if (saved.obsWs?.enabled) {
      obsWs.connect(saved.obsWs).catch((err) => {
        appendDiagLog('system', 'warn', `OBS WebSocket Auto-Connect fehlgeschlagen: ${err.message}`);
      });
    }
    syncChatTimer(saved);

    if (saved.chatDockOpen) {
      openStandaloneChatWindow(false);
    }

    if (demoActive) {
      startDemoSimulation();
    } else if (saved.autoConnectOnStart && (saved.twitchChannel || saved.youtubeChannel || saved.tiktokChannel)) {
      connectAllSavedChannels(saved);
    }
  });

  ipcMain.handle('save-profile', (_ev, config) => {
    const currentCfg = { ...loadConfig(), ...config };
    if (currentCfg.emoteSettings) {
      emoteManager.updateSettings(currentCfg.emoteSettings);
    }
    if (currentCfg.appearance) {
      obsServer.broadcastAppearance({
        ...currentCfg.appearance,
        platformIndicatorStyle: currentCfg.platformIndicatorStyle || 'icon_badge'
      });
    }
    if (currentCfg.obsAlerts) {
      obsServer.broadcastAlertConfig(currentCfg.obsAlerts);
    }
    if (currentCfg.obsGoals) {
      obsServer.broadcastGoals(currentCfg.obsGoals);
    }
    syncChatTimer(currentCfg);
    saveConfig(currentCfg);
    return { ok: true, config: currentCfg };
  });

  ipcMain.handle('run-chat-timer-now', () => runChatTimerTick(true));

  let helpWindow = null;
  function openHelpWindow() {
    if (helpWindow && !helpWindow.isDestroyed()) {
      helpWindow.focus();
      return;
    }
    helpWindow = new BrowserWindow({
      width: 900,
      height: 760,
      minWidth: 520,
      minHeight: 420,
      backgroundColor: '#0b0f19',
      icon: getAppIconPath(),
      title: 'OmniStream Chat — Anleitung & Hilfe',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    helpWindow.setMenuBarVisibility(false);
    helpWindow.webContents.setWindowOpenHandler(({ url }) => {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    });
    helpWindow.loadFile(path.join(__dirname, 'renderer', 'help.html'));
    helpWindow.on('closed', () => {
      helpWindow = null;
    });
  }

  ipcMain.handle('open-help-window', () => {
    openHelpWindow();
    return { ok: true };
  });

  ipcMain.handle('get-help-doc', (_ev, docName) => {
    const allowed = new Set(['ANLEITUNG.md', 'GUIDE.md', 'README.de.md', 'README.md']);
    const safeName = allowed.has(docName) ? docName : 'ANLEITUNG.md';
    try {
      const filePath = path.join(__dirname, '..', safeName);
      const content = fs.readFileSync(filePath, 'utf8');
      return { ok: true, content, docName: safeName };
    } catch (err) {
      return { ok: false, error: `Datei ${safeName} nicht gefunden: ${err.message}` };
    }
  });

  ipcMain.handle('export-chat-log', async (_ev, messagesList) => {
    const { dialog } = require('electron');
    const items = Array.isArray(messagesList) ? messagesList : [];
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const res = await dialog.showSaveDialog(mainWindow, {
      title: 'Chat-Verlauf exportieren',
      defaultPath: `omnichat-log-${stamp}.txt`,
      filters: [
        { name: 'Text-Log (*.txt)', extensions: ['txt'] },
        { name: 'JSON (*.json)', extensions: ['json'] }
      ]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    try {
      if (res.filePath.toLowerCase().endsWith('.json')) {
        fs.writeFileSync(res.filePath, JSON.stringify(items, null, 2), 'utf8');
      } else {
        const lines = items.map((m) => {
          const t = new Date(m.timestamp || Date.now()).toLocaleTimeString('de-DE');
          const p = String(m.platform || 'chat').toUpperCase();
          return `[${t}] [${p}] ${m.author || 'Unbekannt'}: ${m.text || ''}`;
        });
        fs.writeFileSync(res.filePath, lines.join('\n'), 'utf8');
      }
      return { ok: true, filePath: res.filePath, count: items.length };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('stream-manager-load', async () => {
    try {
      const tw = await twitch.getChannelInfo();
      return { ok: true, twitch: tw, youtubeTitle: youtube.streamTitle || '' };
    } catch (err) {
      return { ok: false, error: err.message, youtubeTitle: youtube.streamTitle || '' };
    }
  });

  ipcMain.handle('stream-manager-search-games', async (_ev, query) => {
    try {
      return await twitch.searchCategories(query);
    } catch (err) {
      return { ok: false, categories: [] };
    }
  });

  ipcMain.handle('stream-manager-save', async (_ev, payload) => {
    const title = String(payload?.title || '').trim();
    const gameId = String(payload?.gameId || '').trim();
    const gameName = String(payload?.gameName || '').trim();
    const tags = Array.isArray(payload?.tags)
      ? payload.tags
      : String(payload?.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
    const syncYoutube = Boolean(payload?.syncYoutube);

    const results = [];
    const errors = [];

    try {
      await twitch.updateChannelInfo({ title, gameId, gameName, tags });
      results.push('Twitch');
      appendDiagLog('twitch', 'info', `📝 Stream-Info aktualisiert: "${title}" (${gameName || gameId || 'unverändert'})`);
    } catch (err) {
      errors.push(`Twitch: ${err.message}`);
      appendDiagLog('twitch', 'error', `Stream-Info Fehler: ${err.message}`);
    }

    if (syncYoutube && title && youtube.connected && youtube.canWrite) {
      try {
        await youtube.updateVideoTitle(title);
        results.push('YouTube');
        appendDiagLog('youtube', 'info', `📝 YouTube-Titel aktualisiert: "${title}"`);
      } catch (err) {
        errors.push(`YouTube: ${err.message}`);
        appendDiagLog('youtube', 'error', `YouTube Titel-Fehler: ${err.message}`);
      }
    }

    if (results.length > 0) {
      return { ok: true, updated: results, warnings: errors };
    }
    return { ok: false, error: errors.join(' | ') || 'Keine Plattform aktualisiert.' };
  });

  ipcMain.handle('clip-studio-list', () => {
    const cfg = loadConfig();
    const res = clipStudio.listReplays(cfg.replayDir || '');
    return { ...res, hasFfmpeg: Boolean(clipStudio.findFfmpegBinary()) };
  });

  ipcMain.handle('clip-studio-pick-dir', async () => {
    const { dialog } = require('electron');
    const res = await dialog.showOpenDialog(mainWindow, {
      title: 'OBS Replay- / Aufnahme-Ordner wählen',
      properties: ['openDirectory']
    });
    if (res.canceled || !res.filePaths?.[0]) return { ok: false, canceled: true };
    const cfg = loadConfig();
    cfg.replayDir = res.filePaths[0];
    saveConfig(cfg);
    return { ...clipStudio.listReplays(cfg.replayDir), hasFfmpeg: Boolean(clipStudio.findFfmpegBinary()) };
  });

  ipcMain.handle('clip-studio-export-short', async (_ev, payload) => {
    try {
      const res = await clipStudio.exportVerticalShort(payload || {});
      appendDiagLog('system', 'info', `🎞️ 9:16 Short exportiert: ${res.outPath}`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `9:16 Short Export fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-trim-original', async (_ev, payload) => {
    try {
      const res = await clipStudio.trimOriginalVideo(payload || {});
      appendDiagLog('system', 'info', `✂️ 16:9 Clip geschnitten: ${res.outPath}`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `16:9 Schnitt fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-reveal', (_ev, filePath) => {
    if (filePath) {
      require('electron').shell.showItemInFolder(filePath);
    }
    return { ok: true };
  });

  ipcMain.handle('clip-studio-rename', (_ev, { filePath, newTitle }) => {
    try {
      const res = clipStudio.renameReplay(filePath, newTitle);
      appendDiagLog('system', 'info', `✏️ Clip umbenannt: ${res.name}`);
      return res;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-delete', async (_ev, filePath) => {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        return { ok: false, error: 'Datei nicht gefunden.' };
      }
      await require('electron').shell.trashItem(filePath);
      appendDiagLog('system', 'info', `🗑️ Clip in Papierkorb verschoben: ${path.basename(filePath)}`);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-upload-youtube', async (_ev, { filePath, title, privacyStatus }) => {
    try {
      const res = await youtube.uploadVideo({
        filePath,
        title,
        description: '#Shorts',
        privacyStatus: privacyStatus || 'private'
      });
      appendDiagLog('youtube', 'info', `▶️ YouTube Short hochgeladen: ${res.url}`);
      return res;
    } catch (err) {
      appendDiagLog('youtube', 'error', `YouTube Upload fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-upload-tiktok', (_ev, filePath) => {
    const { shell } = require('electron');
    if (filePath && fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath);
    }
    shell.openExternal('https://www.tiktok.com/creator-center/upload');
    appendDiagLog('tiktok', 'info', '🎵 TikTok Upload-Seite geöffnet & Video-Datei markiert.');
    return { ok: true };
  });

  ipcMain.handle('poll-action', (_ev, payload) => {
    const act = payload?.action || 'start';
    if (act === 'start') {
      const question = String(payload?.question || 'Was sollen wir spielen?').trim();
      const rawOpts = Array.isArray(payload?.options)
        ? payload.options
        : String(payload?.options || 'Option A, Option B')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
      const options = rawOpts.slice(0, 6).map((label) => ({ label, votes: 0 }));
      if (options.length < 2) {
        return { ok: false, error: 'Mindestens 2 Optionen erforderlich (kommagetrennt).' };
      }
      activePoll = {
        active: true,
        visible: true,
        visibleWhenStopped: true,
        question,
        options,
        voters: {},
        totalVotes: 0
      };
    } else if (act === 'stop') {
      activePoll.active = false;
      activePoll.visibleWhenStopped = true;
    } else if (act === 'toggle-visibility') {
      activePoll.visible = !activePoll.visible;
    } else if (act === 'reset') {
      activePoll = {
        active: false,
        visible: false,
        visibleWhenStopped: false,
        question: '',
        options: [],
        voters: {},
        totalVotes: 0
      };
    }
    const snap = getSanitizedPoll();
    obsServer.broadcastPoll(snap);
    broadcastToWindows('poll-updated', snap);
    return { ok: true, poll: snap };
  });

  ipcMain.handle('twitch-create-clip', async () => {
    if (demoActive) {
      const demoUrl = 'https://clips.twitch.tv/DemoHighlightClip';
      appendDiagLog('twitch', 'info', `🎬 Demo-Clip erstellt: ${demoUrl}`);
      return { ok: true, demo: true, id: 'DemoHighlightClip', url: demoUrl, editUrl: `${demoUrl}/edit` };
    }
    try {
      const res = await twitch.createClip();
      appendDiagLog('twitch', 'info', `🎬 Twitch Clip erstellt: ${res.url}`);
      return res;
    } catch (err) {
      appendDiagLog('twitch', 'error', `Clip fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('twitch-create-marker', async (_ev, description) => {
    const desc = String(description || 'OmniStream Highlight').trim();
    if (demoActive) {
      appendDiagLog('twitch', 'info', `🚩 Demo-Marker gesetzt: "${desc}"`);
      return { ok: true, demo: true, description: desc, positionSeconds: 42 };
    }
    try {
      const res = await twitch.createStreamMarker(desc);
      appendDiagLog('twitch', 'info', `🚩 Stream-Marker gesetzt: "${res.description}"`);
      return res;
    } catch (err) {
      appendDiagLog('twitch', 'error', `Marker fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('obs-ws-connect', async (_ev, opts) => {
    const cfg = loadConfig();
    const nextObsWs = {
      enabled: true,
      host: String(opts?.host || cfg.obsWs?.host || '127.0.0.1').trim(),
      port: parseInt(opts?.port || cfg.obsWs?.port || '4455', 10) || 4455,
      password: opts?.password !== undefined ? String(opts.password) : (cfg.obsWs?.password || ''),
      micName: opts?.micName !== undefined ? String(opts.micName).trim() : (cfg.obsWs?.micName || '')
    };
    cfg.obsWs = nextObsWs;
    saveConfig(cfg);
    try {
      const res = await obsWs.connect(nextObsWs);
      appendDiagLog('system', 'info', `OBS WebSocket v5 verbunden (${nextObsWs.host}:${nextObsWs.port}).`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `OBS WebSocket Fehler: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('obs-ws-disconnect', () => {
    const cfg = loadConfig();
    if (cfg.obsWs) {
      cfg.obsWs.enabled = false;
      saveConfig(cfg);
    }
    obsWs.disconnect(true);
    appendDiagLog('system', 'info', 'OBS WebSocket v5 getrennt.');
    return { ok: true };
  });

  ipcMain.handle('obs-ws-action', async (_ev, payload) => {
    try {
      const act = payload?.action;
      if (act === 'scene') return await obsWs.setScene(payload.sceneName);
      if (act === 'toggle-stream') return await obsWs.toggleStream();
      if (act === 'toggle-record') return await obsWs.toggleRecord();
      if (act === 'save-replay') return await obsWs.saveReplayBuffer();
      if (act === 'toggle-mic') return await obsWs.toggleMicMute(payload.inputName || '');
      return { ok: false, error: 'Unbekannte OBS-Aktion.' };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('test-obs-alert', (_ev, type) => {
    const alertType = normalizeObsAlertType(type || 'sub');
    const sampleMap = {
      follow: { author: 'NeuerFollower', summary: 'Folgt jetzt dem Kanal!' },
      sub: { author: 'StreamFan99', summary: 'Neues Tier-1 Abo!' },
      resub: { author: 'TreuerZuschauer', summary: '6 Monate Resub! Danke!' },
      subgift: { author: 'GrosszuegigerMod', summary: 'Hat 5 Subs verschenkt!' },
      bits: { author: 'CheerKing', summary: '500 Bits gecheert!' },
      raid: { author: 'PartnerStreamer', summary: 'Raid mit 42 Zuschauern!' }
    };
    const sample = sampleMap[alertType] || sampleMap.sub;
    broadcastEventToObsAlert({
      id: `test_alert_${Date.now()}`,
      platform: 'twitch',
      type: alertType,
      author: sample.author,
      summary: sample.summary,
      timestamp: Date.now()
    }, true);
    return { ok: true, type: alertType };
  });

  ipcMain.handle('open-standalone-chat', (_ev, snapLeftFullHeight) => {
    openStandaloneChatWindow(Boolean(snapLeftFullHeight));
    return { ok: true };
  });

  ipcMain.handle('toggle-slim-dock', (_ev, makeSlim) => {
    const targetWin = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    if (!targetWin) return false;
    const { screen } = require('electron');
    const workArea = screen.getPrimaryDisplay().workArea;
    if (makeSlim) {
      targetWin.setBounds({
        x: workArea.x,
        y: workArea.y,
        width: 320,
        height: workArea.height
      });
    } else {
      targetWin.setSize(1180, 820);
      targetWin.center();
    }
    return makeSlim;
  });

  ipcMain.handle('connect-platform', async (_ev, { platform, config }) => {
    stopDemoSimulation();
    const currentCfg = { ...loadConfig(), ...config };
    saveConfig(currentCfg);
    appendDiagLog(platform, 'info', `Verbinde ${platform.toUpperCase()}...`);
    connectSinglePlatform(platform, currentCfg);
    return { ok: true };
  });

  ipcMain.handle('reconnect-platform', async (_ev, { platform, config }) => {
    stopDemoSimulation();
    const currentCfg = { ...loadConfig(), ...config };
    saveConfig(currentCfg);
    appendDiagLog(platform, 'warn', `Manueller Reconnect für ${platform.toUpperCase()} ausgelöst...`);
    if (platform === 'twitch') twitch.reconnect();
    else if (platform === 'youtube') await youtube.reconnect();
    else if (platform === 'tiktok') await tiktok.reconnect();
    return { ok: true };
  });

  ipcMain.handle('toggle-platform-enabled', async (_ev, { platform, enabled, config }) => {
    const currentCfg = { ...loadConfig(), ...config };
    currentCfg[`${platform}Enabled`] = Boolean(enabled);
    saveConfig(currentCfg);
    platformStatus[platform].enabled = Boolean(enabled);
    appendDiagLog(platform, 'info', `Plattform ${platform.toUpperCase()} ${enabled ? 'aktiviert' : 'deaktiviert'}`);

    if (!enabled) {
      if (platform === 'twitch') twitch.disconnect();
      else if (platform === 'youtube') youtube.disconnect();
      else if (platform === 'tiktok') tiktok.disconnect();
    } else if (!demoActive) {
      connectSinglePlatform(platform, currentCfg);
    }

    obsServer.broadcastStatus(platformStatus);
    broadcastToWindows('platform-status', platformStatus);
    return { ok: true };
  });

  ipcMain.handle('discover-youtube-streams', async (_ev, channelOrUrl) => {
    appendDiagLog('youtube', 'info', `Scanne YouTube-Kanal (${channelOrUrl}) nach aktiven Livestreams...`);
    const streams = await youtube.discoverStreams(channelOrUrl);
    appendDiagLog('youtube', 'info', `${streams.length} YouTube-Stream(s) gefunden.`);
    platformStatus.youtube.availableStreams = streams;
    broadcastToWindows('platform-status', platformStatus);
    return { ok: true, streams };
  });

  ipcMain.handle('youtube-oauth-login', async (_ev, creds) => {
    try {
      const { shell } = require('electron');
      const res = await youtube.startOAuthLogin({
        clientId: creds?.clientId,
        clientSecret: creds?.clientSecret,
        openUrl: (url) => shell.openExternal(url)
      });
      const cfg = loadConfig();
      cfg.youtubeOAuth = res.oauth;
      saveConfig(cfg);
      platformStatus.youtube.canWrite = youtube.canWrite;
      obsServer.broadcastStatus(platformStatus);
      broadcastToWindows('platform-status', platformStatus);
      appendDiagLog('youtube', 'info', `YouTube OAuth2 verbunden (${res.oauth.accountName || 'Schreibrechte aktiv'}).`);
      return { ok: true, oauth: res.oauth };
    } catch (err) {
      appendDiagLog('youtube', 'error', `YouTube OAuth2 fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('youtube-oauth-logout', () => {
    const cfg = loadConfig();
    const nextOAuth = {
      clientId: cfg.youtubeOAuth?.clientId || '',
      clientSecret: cfg.youtubeOAuth?.clientSecret || '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0,
      accountName: ''
    };
    cfg.youtubeOAuth = nextOAuth;
    saveConfig(cfg);
    youtube.setOAuthConfig(nextOAuth);
    platformStatus.youtube.canWrite = false;
    obsServer.broadcastStatus(platformStatus);
    broadcastToWindows('platform-status', platformStatus);
    appendDiagLog('youtube', 'info', 'YouTube OAuth2 abgemeldet (Nur-Lesen-Modus).');
    return { ok: true, oauth: nextOAuth };
  });

  ipcMain.handle('disconnect-platform', (_ev, platform) => {
    appendDiagLog(platform, 'info', `Verbindung zu ${platform.toUpperCase()} getrennt.`);
    if (platform === 'twitch') twitch.disconnect();
    else if (platform === 'youtube') youtube.disconnect();
    else if (platform === 'tiktok') tiktok.disconnect();
    return { ok: true };
  });

  ipcMain.handle('connect-all', async (_ev, config) => {
    stopDemoSimulation();
    const currentCfg = { ...loadConfig(), ...config };
    saveConfig(currentCfg);
    appendDiagLog('system', 'info', 'Verbinde alle aktiven Plattformen...');
    connectAllSavedChannels(currentCfg);
    return { ok: true };
  });

  ipcMain.handle('send-chat-message', async (_ev, payload) => {
    const text = typeof payload === 'string' ? payload : payload?.text || '';
    const replyParentId = typeof payload === 'object' ? payload?.replyParentId || null : null;
    const targets = typeof payload === 'object' && Array.isArray(payload?.targets) ? payload.targets : ['twitch'];
    const cfg = loadConfig();

    const results = [];
    const errors = [];

    if (targets.includes('twitch')) {
      if (demoActive) {
        forwardChatMessage({
          id: `self_tw_${Date.now()}`,
          platform: 'twitch',
          channel: cfg.twitchChannel || 'demo-live',
          author: cfg.streamerName || cfg.twitchUsername || 'Streamer (Du)',
          color: '#10b981',
          badges: ['BROADCASTER'],
          text,
          isSelf: true,
          timestamp: Date.now()
        });
        results.push('twitch');
        appendDiagLog('twitch', 'info', `Nachricht gesendet (Demo): "${text}"`);
      } else {
        try {
          twitch.sendMessage(text, replyParentId);
          results.push('twitch');
          appendDiagLog('twitch', 'info', `Nachricht an Twitch IRC gesendet: "${text}"`);
        } catch (err) {
          errors.push(`Twitch: ${err.message}`);
          appendDiagLog('twitch', 'error', `Senden fehlgeschlagen: ${err.message}`);
        }
      }
    }

    if (targets.includes('youtube')) {
      if (demoActive) {
        forwardChatMessage({
          id: `self_yt_${Date.now()}`,
          platform: 'youtube',
          channel: cfg.youtubeChannel || '@DeinKanal',
          author: cfg.streamerName || 'Streamer (Du)',
          color: '#ff4e45',
          badges: ['OWNER'],
          text,
          isSelf: true,
          timestamp: Date.now()
        });
        results.push('youtube');
      } else {
        try {
          await youtube.sendMessage(text);
          results.push('youtube');
          appendDiagLog('youtube', 'info', `Nachricht an YouTube Live Chat gesendet: "${text}"`);
        } catch (err) {
          errors.push(`YouTube: ${err.message}`);
          appendDiagLog('youtube', 'error', `Senden fehlgeschlagen: ${err.message}`);
        }
      }
    }

    if (targets.includes('tiktok')) {
      errors.push('TikTok: Offizielle Webcast-Schnittstelle unterstützt kein Senden über Drittanbieter-Tools.');
    }

    if (results.length > 0) {
      return { ok: true, sentTo: results, warnings: errors };
    }
    return { ok: false, error: errors.join('\n') || 'Keine unterstützte Zielplattform ausgewählt.' };
  });

  ipcMain.handle('get-user-details', async (_ev, { platform, author, avatar }) => {
    if (platform === 'twitch') {
      const info = await twitch.getUserInfo(author);
      if (info) {
        return {
          ok: true,
          avatar: info.avatar || avatar || '',
          createdAt: info.createdAt || null,
          description: info.description || ''
        };
      }
    }
    return {
      ok: true,
      avatar: avatar || '',
      createdAt: null
    };
  });

  ipcMain.handle('open-user-profile', (_ev, { platform, author }) => {
    const { shell } = require('electron');
    if (platform === 'twitch-token-generator') {
      const url = 'https://twitchtokengenerator.com/';
      shell.openExternal(url);
      return { ok: true, url };
    }
    const clean = String(author || '').trim().replace(/^@/, '');
    if (!clean) return { ok: false };
    let url = `https://www.twitch.tv/${encodeURIComponent(clean.toLowerCase())}`;
    if (platform === 'youtube') {
      url = `https://www.youtube.com/@${encodeURIComponent(clean)}`;
    } else if (platform === 'tiktok') {
      url = `https://www.tiktok.com/@${encodeURIComponent(clean)}`;
    }
    shell.openExternal(url);
    return { ok: true, url };
  });

  ipcMain.handle('moderate-action', (_ev, { action, msg, durationSec }) => {
    if (!msg) return { ok: false };
    const cfg = loadConfig();
    const authorLow = (msg.author || '').toLowerCase();
    const canServerModTwitch = msg.platform === 'twitch' && twitch.connected && Boolean(twitch.oauthToken);

    if (action === 'delete-msg') {
      obsServer.deleteMessage(msg.id);
      broadcastToWindows('message-deleted', { id: msg.id });
      if (canServerModTwitch) {
        try {
          twitch.sendMessage(`/delete ${msg.id}`);
        } catch (e) {}
      }
      return { ok: true, serverExecuted: canServerModTwitch };
    }

    if (action === 'mute-user') {
      const muted = new Set(cfg.mutedUsers || []);
      muted.add(authorLow);
      cfg.mutedUsers = Array.from(muted);
      saveConfig(cfg);
      obsServer.deleteUserMessages(authorLow);
      broadcastToWindows('user-muted', { author: authorLow, mutedUsers: cfg.mutedUsers });
      return { ok: true };
    }

    if (action === 'unmute-user') {
      cfg.mutedUsers = (cfg.mutedUsers || []).filter((u) => u !== authorLow);
      saveConfig(cfg);
      broadcastToWindows('user-muted', { author: null, mutedUsers: cfg.mutedUsers });
      return { ok: true };
    }

    // Platform-specific server moderation (only executed if supported & authenticated!)
    if (action === 'timeout') {
      if (!canServerModTwitch) {
        return {
          ok: false,
          error:
            msg.platform === 'twitch'
              ? 'Nicht ausgeführt: Kein Twitch OAuth-Token mit Mod-Rechten hinterlegt.'
              : `Nicht unterstützt: ${msg.platform.toUpperCase()} erlaubt kein Server-Timeout ohne OAuth-Mod-API.`
        };
      }
      const sec = Number(durationSec) || 600;
      obsServer.deleteUserMessages(authorLow);
      broadcastToWindows('user-muted', { author: authorLow, mutedUsers: cfg.mutedUsers || [] });
      try {
        twitch.sendMessage(`/timeout ${msg.author} ${sec}`);
      } catch (e) {}
      return { ok: true, serverExecuted: true };
    }

    if (action === 'ban-user') {
      if (!canServerModTwitch) {
        return {
          ok: false,
          error:
            msg.platform === 'twitch'
              ? 'Nicht ausgeführt: Kein Twitch OAuth-Token mit Mod-Rechten hinterlegt.'
              : `Nicht unterstützt: ${msg.platform.toUpperCase()} erlaubt keinen Server-Ban über diese Verbindung.`
        };
      }
      obsServer.deleteUserMessages(authorLow);
      broadcastToWindows('user-muted', { author: authorLow, mutedUsers: cfg.mutedUsers || [] });
      try {
        twitch.sendMessage(`/ban ${msg.author}`);
      } catch (e) {}
      return { ok: true, serverExecuted: true };
    }

    if (action === 'unban-user') {
      // Also remove from local mutedUsers list if present
      cfg.mutedUsers = (cfg.mutedUsers || []).filter((u) => u !== authorLow);
      saveConfig(cfg);
      broadcastToWindows('user-muted', { author: null, mutedUsers: cfg.mutedUsers });

      if (!canServerModTwitch) {
        return {
          ok: true,
          serverExecuted: false,
          note: 'Lokale Stummschaltung aufgehoben (Server-Unban erfordert Twitch OAuth-Token).'
        };
      }
      try {
        twitch.sendMessage(`/unban ${msg.author}`);
      } catch (e) {}
      return { ok: true, serverExecuted: true };
    }

    return { ok: false };
  });

  ipcMain.on('pin-message', (_ev, msgOrNull) => {
    obsServer.broadcastPin(msgOrNull);
  });

  ipcMain.on('clear-chat', () => {
    globalSeenMsgKeys.clear();
    obsServer.clearChat();
  });

  ipcMain.handle('toggle-always-on-top', (_ev) => {
    const targetWin = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    if (!targetWin) return false;
    const nextState = !targetWin.isAlwaysOnTop();
    targetWin.setAlwaysOnTop(nextState, 'floating');
    if (targetWin === chatDockWindow) {
      const cfg = loadConfig();
      cfg.chatDockAlwaysOnTop = nextState;
      saveConfig(cfg);
    } else {
      isAlwaysOnTop = nextState;
    }
    return nextState;
  });

  ipcMain.handle('toggle-demo', () => {
    if (demoActive) {
      stopDemoSimulation();
    } else {
      startDemoSimulation();
    }
    return demoActive;
  });

  ipcMain.handle('get-perf-stats', () => {
    const mem = process.memoryUsage();
    const ramMb = Math.round((mem.rss || 0) / (1024 * 1024));
    const emoteStats = emoteManager.getStats ? emoteManager.getStats() : { total: emoteManager.emoteMap?.size || 0 };
    return {
      ok: true,
      ramMb,
      heapMb: Math.round((mem.heapUsed || 0) / (1024 * 1024)),
      cachedEmotes: emoteStats.total || 0
    };
  });

  ipcMain.handle('reset-defaults', () => {
    const current = loadConfig();
    const fresh = getDefaultConfig();
    // Preserve account credentials & window positions while resetting design/emote/event settings
    fresh.streamerName = current.streamerName;
    fresh.twitchChannel = current.twitchChannel;
    fresh.twitchUsername = current.twitchUsername;
    fresh.twitchToken = current.twitchToken;
    fresh.youtubeChannel = current.youtubeChannel;
    fresh.youtubeVideoId = current.youtubeVideoId;
    fresh.tiktokChannel = current.tiktokChannel;
    fresh.tiktokRoomId = current.tiktokRoomId;
    fresh.mainWindowBounds = current.mainWindowBounds;
    fresh.chatDockBounds = current.chatDockBounds;

    saveConfig(fresh);
    emoteManager.updateSettings(fresh.emoteSettings);
    obsServer.broadcastAppearance({
      ...fresh.appearance,
      platformIndicatorStyle: fresh.platformIndicatorStyle
    });
    return { ok: true, config: fresh };
  });

  ipcMain.handle('export-config', async (_ev) => {
    const { dialog } = require('electron');
    const win = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const res = await dialog.showSaveDialog(win, {
      title: 'OmniStream Chat Einstellungen exportieren',
      defaultPath: 'omnichat-backup.json',
      filters: [{ name: 'JSON Konfiguration', extensions: ['json'] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    const cfg = { ...loadConfig() };
    fs.writeFileSync(res.filePath, JSON.stringify(cfg, null, 2), 'utf8');
    return { ok: true, filePath: res.filePath };
  });

  ipcMain.handle('import-config', async (_ev) => {
    const { dialog } = require('electron');
    const win = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const res = await dialog.showOpenDialog(win, {
      title: 'OmniStream Chat Einstellungen importieren',
      properties: ['openFile'],
      filters: [{ name: 'JSON Konfiguration', extensions: ['json'] }]
    });
    if (res.canceled || !res.filePaths?.[0]) return { ok: false, canceled: true };
    try {
      const raw = fs.readFileSync(res.filePaths[0], 'utf8');
      const parsed = JSON.parse(raw);
      const defaults = getDefaultConfig();
      const merged = {
        ...defaults,
        ...parsed,
        appearance: { ...defaults.appearance, ...(parsed.appearance || {}) },
        emoteSettings: { ...defaults.emoteSettings, ...(parsed.emoteSettings || {}) }
      };
      saveConfig(merged);
      emoteManager.updateSettings(merged.emoteSettings);
      obsServer.broadcastAppearance({
        ...merged.appearance,
        platformIndicatorStyle: merged.platformIndicatorStyle
      });
      return { ok: true, config: merged };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  // --- PERIPHERALS: WebHID Permissions, Device Discovery & Global Hotkeys ---
  const { session, globalShortcut } = require('electron');
  const { exec } = require('child_process');
  let pendingHidTarget = null;

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'hid') return true;
    return false;
  });

  session.defaultSession.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid') return true;
    return false;
  });

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    const list = details.deviceList || [];
    if (list.length === 0) {
      callback('');
      return;
    }
    let chosen = null;
    if (pendingHidTarget) {
      chosen = list.find(
        (d) =>
          (pendingHidTarget.vendorId && d.vendorId === Number(pendingHidTarget.vendorId)) &&
          (pendingHidTarget.productId && d.productId === Number(pendingHidTarget.productId))
      ) || list.find((d) => pendingHidTarget.name && d.name && d.name.toLowerCase().includes(pendingHidTarget.name.toLowerCase()));
      pendingHidTarget = null;
    }
    callback((chosen || list[0]).deviceId);
  });

  function registerGlobalHotkeys(cfg) {
    globalShortcut.unregisterAll();
    const pCfg = cfg?.peripherals;
    if (!pCfg || pCfg.globalHotkeysEnabled === false || !pCfg.hotkeys) return;

    const mapActions = {
      [pCfg.hotkeys.pinLast]: 'pin-last',
      [pCfg.hotkeys.unpin]: 'unpin',
      [pCfg.hotkeys.clearChat]: 'clear-chat',
      [pCfg.hotkeys.toggleCompact]: 'toggle-compact'
    };

    for (const [accel, action] of Object.entries(mapActions)) {
      if (!accel || !accel.trim()) continue;
      try {
        globalShortcut.register(accel.trim(), () => {
          if (obsServer.onStreamDeckApi) {
            obsServer.onStreamDeckApi(action, {}, {});
          }
        });
      } catch (e) {}
    }
  }

  registerGlobalHotkeys(loadConfig());

  ipcMain.handle('set-hid-target', (_ev, target) => {
    pendingHidTarget = target || null;
    return { ok: true };
  });

  ipcMain.handle('update-global-hotkeys', (_ev, peripheralsCfg) => {
    const cfg = loadConfig();
    cfg.peripherals = { ...(cfg.peripherals || {}), ...(peripheralsCfg || {}) };
    saveConfig(cfg);
    registerGlobalHotkeys(cfg);
    return { ok: true };
  });

  ipcMain.handle('trigger-peripheral-action', async (_ev, { action, text }) => {
    if (obsServer.onStreamDeckApi) {
      return await obsServer.onStreamDeckApi(action, { text }, { text });
    }
    return { ok: false };
  });

  ipcMain.handle('list-peripherals', () => {
    return new Promise((resolve) => {
      if (process.platform === 'darwin') {
        exec('system_profiler SPUSBDataType -json', { timeout: 5000 }, (err, stdout) => {
          const devices = [];
          if (!err && stdout) {
            try {
              const parsed = JSON.parse(stdout);
              const walk = (items) => {
                if (!Array.isArray(items)) return;
                for (const it of items) {
                  if (it._name) {
                    const nameLow = String(it._name).toLowerCase();
                    const isInput =
                      nameLow.includes('keyboard') ||
                      nameLow.includes('tastatur') ||
                      nameLow.includes('mouse') ||
                      nameLow.includes('maus') ||
                      nameLow.includes('hid') ||
                      nameLow.includes('key') ||
                      nameLow.includes('pad') ||
                      nameLow.includes('logitech') ||
                      nameLow.includes('razer') ||
                      nameLow.includes('corsair') ||
                      nameLow.includes('steelseries') ||
                      nameLow.includes('wooting') ||
                      nameLow.includes('elgato') ||
                      nameLow.includes('cherry') ||
                      nameLow.includes('keychron');
                    if (isInput || it.vendor_id) {
                      devices.push({
                        name: it._name,
                        manufacturer: it.manufacturer || '',
                        vendorId: it.vendor_id ? parseInt(String(it.vendor_id).split(' ')[0], 16) : null,
                        productId: it.product_id ? parseInt(String(it.product_id).split(' ')[0], 16) : null,
                        kind: nameLow.includes('mouse') || nameLow.includes('maus') ? 'mouse' : 'keyboard'
                      });
                    }
                  }
                  if (it._items) walk(it._items);
                }
              };
              walk(parsed.SPUSBDataType);
            } catch (e) {}
          }
          resolve({ ok: true, devices });
        });
      } else if (process.platform === 'win32') {
        exec(
          'powershell -NoProfile -Command "Get-PnpDevice -Class Keyboard,Mouse -Status OK | Select-Object FriendlyName,InstanceId,Class | ConvertTo-Json"',
          { timeout: 5000 },
          (err, stdout) => {
            const devices = [];
            if (!err && stdout) {
              try {
                const raw = JSON.parse(stdout);
                const arr = Array.isArray(raw) ? raw : [raw];
                for (const d of arr) {
                  if (!d?.FriendlyName) continue;
                  const vidMatch = String(d.InstanceId || '').match(/VID_([0-9A-F]{4})/i);
                  const pidMatch = String(d.InstanceId || '').match(/PID_([0-9A-F]{4})/i);
                  devices.push({
                    name: d.FriendlyName,
                    manufacturer: '',
                    vendorId: vidMatch ? parseInt(vidMatch[1], 16) : null,
                    productId: pidMatch ? parseInt(pidMatch[1], 16) : null,
                    kind: String(d.Class || '').toLowerCase() === 'mouse' ? 'mouse' : 'keyboard'
                  });
                }
              } catch (e) {}
            }
            resolve({ ok: true, devices });
          }
        );
      } else {
        resolve({ ok: true, devices: [] });
      }
    });
  });
});

app.on('will-quit', () => {
  try {
    require('electron').globalShortcut.unregisterAll();
  } catch (e) {}
});

app.on('window-all-closed', () => {
  obsServer.stop();
  app.quit();
});
