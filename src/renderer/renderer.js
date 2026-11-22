const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const btnPopoutChat = document.getElementById('btnPopoutChat');
const btnSlimDock = document.getElementById('btnSlimDock');
const btnCompactMode = document.getElementById('btnCompactMode');
const btnSoundToggle = document.getElementById('btnSoundToggle');
const btnDemo = document.getElementById('btnDemo');
const btnPinWindow = document.getElementById('btnPinWindow');
const btnClearChat = document.getElementById('btnClearChat');

const inputStreamerName = document.getElementById('inputStreamerName');
const inputKeywordAlerts = document.getElementById('inputKeywordAlerts');
const chkKeywordSound = document.getElementById('chkKeywordSound');
const clrKeywordHighlight = document.getElementById('clrKeywordHighlight');
const chkAutoConnect = document.getElementById('chkAutoConnect');

const chkEnableTwitch = document.getElementById('chkEnableTwitch');
const chkEnableYoutube = document.getElementById('chkEnableYoutube');
const chkEnableTiktok = document.getElementById('chkEnableTiktok');

// Section 4: Compact Chat Design & Appearance UI Controls
const selLayoutMode = document.getElementById('selLayoutMode');
const rngNameSize = document.getElementById('rngNameSize');
const valNameSize = document.getElementById('valNameSize');
const rngMsgSize = document.getElementById('rngMsgSize');
const valMsgSize = document.getElementById('valMsgSize');
const rngMaxNameLen = document.getElementById('rngMaxNameLen');
const valMaxNameLen = document.getElementById('valMaxNameLen');
const rngMsgPadding = document.getElementById('rngMsgPadding');
const valMsgPadding = document.getElementById('valMsgPadding');
const chkShowPlatIcons = document.getElementById('chkShowPlatIcons');
const chkShowTimestamps = document.getElementById('chkShowTimestamps');
const selPlatStyle = document.getElementById('selPlatStyle');
const selUserColorMode = document.getElementById('selUserColorMode');

const chkShowSeparator = document.getElementById('chkShowSeparator');
const clrSeparator = document.getElementById('clrSeparator');
const rngSepOpacity = document.getElementById('rngSepOpacity');
const valSepOpacity = document.getElementById('valSepOpacity');
const rngSepSpacing = document.getElementById('rngSepSpacing');
const valSepSpacing = document.getElementById('valSepSpacing');

const clrChatBg = document.getElementById('clrChatBg');
const rngBgOpacity = document.getElementById('rngBgOpacity');
const valBgOpacity = document.getElementById('valBgOpacity');
const rngObsBgOpacity = document.getElementById('rngObsBgOpacity');
const valObsBgOpacity = document.getElementById('valObsBgOpacity');

// Section 6: Follow, Sub & Event Highlighting Controls
const selEventStyle = document.getElementById('selEventStyle');
const rngEventIntensity = document.getElementById('rngEventIntensity');
const valEventIntensity = document.getElementById('valEventIntensity');
const EVENT_TYPES = ['follow', 'sub', 'resub', 'subgift', 'bits', 'raid', 'highlighted_msg'];
const evCheckboxes = {};
const evColors = {};
for (const t of EVENT_TYPES) {
  evCheckboxes[t] = document.getElementById(`chkEv_${t}`);
  evColors[t] = document.getElementById(`clrEv_${t}`);
}

// Section 3: Emote Provider Toggles
const chkEmote7tv = document.getElementById('chkEmote7tv');
const chkEmoteBttv = document.getElementById('chkEmoteBttv');
const chkEmoteFfz = document.getElementById('chkEmoteFfz');
const chkEmoteTwitch = document.getElementById('chkEmoteTwitch');
const chkEmoteYoutube = document.getElementById('chkEmoteYoutube');
const chkEmoteTiktok = document.getElementById('chkEmoteTiktok');
const chkAnimateEmotes = document.getElementById('chkAnimateEmotes');

const inputTwitchChannel = document.getElementById('inputTwitchChannel');
const inputTwitchUser = document.getElementById('inputTwitchUser');
const inputTwitchToken = document.getElementById('inputTwitchToken');
const inputYoutubeChannel = document.getElementById('inputYoutubeChannel');
const selectYoutubeStream = document.getElementById('selectYoutubeStream');
const btnScanYoutube = document.getElementById('btnScanYoutube');
const inputYoutubeVideoId = document.getElementById('inputYoutubeVideoId');
const inputTiktokChannel = document.getElementById('inputTiktokChannel');
const inputTiktokRoomId = document.getElementById('inputTiktokRoomId');

const btnConnectTwitch = document.getElementById('btnConnectTwitch');
const btnReconnectTwitch = document.getElementById('btnReconnectTwitch');
const btnConnectYoutube = document.getElementById('btnConnectYoutube');
const btnReconnectYoutube = document.getElementById('btnReconnectYoutube');
const btnConnectTiktok = document.getElementById('btnConnectTiktok');
const btnReconnectTiktok = document.getElementById('btnReconnectTiktok');
const btnConnectAll = document.getElementById('btnConnectAll');

const inputObsUrl = document.getElementById('inputObsUrl');
const btnCopyObs = document.getElementById('btnCopyObs');

const eventTickerRow = document.getElementById('eventTickerRow');
const chatFeed = document.getElementById('chatFeed');
const btnResumeScroll = document.getElementById('btnResumeScroll');
const emptyState = document.getElementById('emptyState');
const inputSearch = document.getElementById('inputSearch');
const pinnedBanner = document.getElementById('pinnedBanner');
const pinnedBody = document.getElementById('pinnedBody');
const btnUnpin = document.getElementById('btnUnpin');

const inputReply = document.getElementById('inputReply');
const btnSendReply = document.getElementById('btnSendReply');

// Section 7: Quick-Action Context Menu Elements
const quickMenu = document.getElementById('quickMenu');
const qmAvatar = document.getElementById('qmAvatar');
const qmAvatarFallback = document.getElementById('qmAvatarFallback');
const qmPlat = document.getElementById('qmPlat');
const qmUser = document.getElementById('qmUser');
const qmRolesRow = document.getElementById('qmRolesRow');
const qmAccountAge = document.getElementById('qmAccountAge');

const qmReply = document.getElementById('qmReply');
const qmCopyMsg = document.getElementById('qmCopyMsg');
const qmCopyUser = document.getElementById('qmCopyUser');
const qmPin = document.getElementById('qmPin');
const qmOpenProfile = document.getElementById('qmOpenProfile');

const qmDeleteLocal = document.getElementById('qmDeleteLocal');
const qmMuteLocal = document.getElementById('qmMuteLocal');

const qmPermBadge = document.getElementById('qmPermBadge');
const qmPermHint = document.getElementById('qmPermHint');
const qmServerDelete = document.getElementById('qmServerDelete');
const qmTimeoutBox = document.getElementById('qmTimeoutBox');
const qmBanUser = document.getElementById('qmBanUser');
const qmUnbanUser = document.getElementById('qmUnbanUser');

// Section 8: Stability, Performance & Backup Controls
const perfRamVal = document.getElementById('perfRamVal');
const perfDomVal = document.getElementById('perfDomVal');
const perfEmoteVal = document.getElementById('perfEmoteVal');
const perfRateVal = document.getElementById('perfRateVal');
const rngMaxDomMsgs = document.getElementById('rngMaxDomMsgs');
const valMaxDomMsgs = document.getElementById('valMaxDomMsgs');
const btnExportConfig = document.getElementById('btnExportConfig');
const btnImportConfig = document.getElementById('btnImportConfig');
const btnResetDefaults = document.getElementById('btnResetDefaults');

// Section 9: Extensions, Role/Bot/Spam Filters, Multi-Target Send & Collapsible Stats/Logs Tab
const btnToggleStatsTab = document.getElementById('btnToggleStatsTab');
const btnCloseStatsTab = document.getElementById('btnCloseStatsTab');
const statsDiagDrawer = document.getElementById('statsDiagDrawer');
const selRoleFilter = document.getElementById('selRoleFilter');
const btnHideBots = document.getElementById('btnHideBots');
const btnCollapseSpam = document.getElementById('btnCollapseSpam');
const chkSendTwitch = document.getElementById('chkSendTwitch');
const chkSendYoutube = document.getElementById('chkSendYoutube');
const chkSendTiktok = document.getElementById('chkSendTiktok');

const statTotalMsgs = document.getElementById('statTotalMsgs');
const statMsgsPerMin = document.getElementById('statMsgsPerMin');
const statBarTw = document.getElementById('statBarTw');
const statBarYt = document.getElementById('statBarYt');
const statBarTt = document.getElementById('statBarTt');
const statSplitText = document.getElementById('statSplitText');
const statTopChatters = document.getElementById('statTopChatters');
const statTopEmotes = document.getElementById('statTopEmotes');
const diagLogCount = document.getElementById('diagLogCount');
const diagLogList = document.getElementById('diagLogList');
const btnClearDiagLogs = document.getElementById('btnClearDiagLogs');

const KNOWN_BOTS = new Set([
  'nightbot',
  'streamelements',
  'streamlabs',
  'moobot',
  'fossabot',
  'wizebot',
  'sery_bot',
  'soundalerts',
  'pokemoncommunitygame',
  'kofistreambot',
  'own3d',
  'botrix'
]);

let messages = [];
let seenMessageIds = new Set();
let streamerEvents = [];
let activeFilter = 'all';
let activeRoleFilter = 'all';
let hideBotsEnabled = false;
let collapseSpamEnabled = true;
let searchQuery = '';
let soundAlertsEnabled = true;
let compactChatEnabled = false;
let slimDockActive = false;
let isAutoScrollPaused = false;
let unreadWhilePaused = 0;
let audioCtx = null;
let selectedMenuMsg = null;
let activeReplyParentId = null;
let banConfirmArmed = false;

// Section 9 Live Session Statistics & Diagnostics State
const sessionStats = {
  startTime: Date.now(),
  totalMessages: 0,
  byPlatform: { twitch: 0, youtube: 0, tiktok: 0 },
  chatterCounts: new Map(),
  emoteCounts: new Map()
};
let diagLogs = [];

// High-frequency 60fps RAF batching & O(1) incremental counters
let pendingRenderQueue = [];
let rafRenderScheduled = false;
let recentMsgTimestamps = [];
const fastCounters = {
  all: 0,
  mentions: 0,
  highlights: 0,
  twitch: 0,
  youtube: 0,
  tiktok: 0
};

const PLATFORM_ICONS = {
  twitch: '🟣',
  youtube: '🔴',
  tiktok: '🎵'
};

let currentStates = {
  twitch: { status: 'disconnected', viewers: 0, enabled: true },
  youtube: { status: 'disconnected', viewers: 0, enabled: true, availableStreams: [] },
  tiktok: { status: 'disconnected', viewers: 0, likes: 0, enabled: true }
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatTime(ts) {
  const d = new Date(ts || Date.now());
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function hexToRgba(hex, alphaPercent) {
  const clean = (hex || '#ffffff').replace('#', '');
  const num = parseInt(clean, 16) || 0xffffff;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${(alphaPercent / 100).toFixed(2)})`;
}

function truncateUsername(name) {
  const raw = String(name || 'User');
  const maxLen = parseInt(rngMaxNameLen?.value || '16', 10);
  if (maxLen > 0 && raw.length > maxLen) {
    return raw.slice(0, maxLen) + '…';
  }
  return raw;
}

function resolveAuthorColor(msg) {
  const mode = selUserColorMode?.value || 'user';
  if (mode === 'mono') return '#e2e8f0';
  if (mode === 'platform') {
    if (msg.platform === 'twitch') return '#a970ff';
    if (msg.platform === 'youtube') return '#ff4e45';
    return '#00f2fe';
  }
  return msg.color || '#38bdf8';
}

function isEmoteProviderEnabled(provider) {
  const p = (provider || '').toUpperCase();
  if (p === '7TV') return !chkEmote7tv || chkEmote7tv.checked;
  if (p === 'BTTV') return !chkEmoteBttv || chkEmoteBttv.checked;
  if (p === 'FFZ') return !chkEmoteFfz || chkEmoteFfz.checked;
  if (p === 'TWITCH') return !chkEmoteTwitch || chkEmoteTwitch.checked;
  if (p === 'YOUTUBE') return !chkEmoteYoutube || chkEmoteYoutube.checked;
  if (p === 'TIKTOK') return !chkEmoteTiktok || chkEmoteTiktok.checked;
  return true;
}

function renderMessageContentHtml(msg) {
  if (Array.isArray(msg.tokens) && msg.tokens.length > 0) {
    return msg.tokens
      .map((t) => {
        if (t.type === 'emote' && isEmoteProviderEnabled(t.provider)) {
          return `<span class="emote-wrap"><img class="chat-emote" src="${t.url}" alt="${escapeHtml(t.name)}" title="${escapeHtml(t.name)} (${t.provider})" decoding="async" loading="eager" onerror="this.outerHTML=this.alt" /></span>`;
        }
        return escapeHtml(t.text || t.name || '');
      })
      .join('');
  }
  return escapeHtml(msg.text);
}

function renderPlatformIndicatorHtml(platform) {
  if (chkShowPlatIcons && !chkShowPlatIcons.checked) {
    return '';
  }
  const style = selPlatStyle?.value || 'icon_only';
  const icon = PLATFORM_ICONS[platform] || '💬';
  if (style === 'subtle_border') {
    return `<span class="msg-plat-dot ${platform}" title="${platform.toUpperCase()}"></span>`;
  }
  if (style === 'icon_only') {
    return `<span class="msg-plat-icon" title="${platform.toUpperCase()}">${icon}</span>`;
  }
  const shortLabel = platform === 'twitch' ? 'TW' : platform === 'youtube' ? 'YT' : 'TT';
  return `<span class="msg-plat ${platform}" title="${platform.toUpperCase()}">${icon} ${shortLabel}</span>`;
}

function getEventHighlightSettings() {
  const types = {};
  for (const t of EVENT_TYPES) {
    types[t] = {
      enabled: evCheckboxes[t] ? evCheckboxes[t].checked : true,
      color: evColors[t]?.value || '#f59e0b'
    };
  }
  return {
    style: selEventStyle?.value || 'bar',
    intensity: parseInt(rngEventIntensity?.value || '18', 10),
    types
  };
}

function getMaxDomMessagesLimit() {
  return Math.max(50, Math.min(300, parseInt(rngMaxDomMsgs?.value || '150', 10) || 150));
}

function applyAppearanceToDOM(save = true) {
  const layoutMode = selLayoutMode?.value || 'inline';
  const nameSize = parseFloat(rngNameSize?.value || '13');
  const msgSize = parseFloat(rngMsgSize?.value || '13.5');
  const maxNameLen = parseInt(rngMaxNameLen?.value || '16', 10);
  const msgPadding = parseInt(rngMsgPadding?.value || '5', 10);
  const maxDomMsgs = getMaxDomMessagesLimit();
  const showPlatIcons = chkShowPlatIcons ? chkShowPlatIcons.checked : true;
  const showTimestamps = chkShowTimestamps ? chkShowTimestamps.checked : true;
  const showSep = chkShowSeparator ? chkShowSeparator.checked : true;
  const sepColor = clrSeparator?.value || '#ffffff';
  const sepOpacity = parseInt(rngSepOpacity?.value || '8', 10);
  const sepSpacing = parseInt(rngSepSpacing?.value || '0', 10);
  const bgColor = clrChatBg?.value || '#0b0f19';
  const bgOpacity = parseInt(rngBgOpacity?.value || '100', 10);
  const obsBgOpacity = parseInt(rngObsBgOpacity?.value || '60', 10);
  const evIntensity = parseInt(rngEventIntensity?.value || '18', 10);

  if (valNameSize) valNameSize.textContent = `${nameSize} px`;
  if (valMsgSize) valMsgSize.textContent = `${msgSize} px`;
  if (valMaxNameLen) valMaxNameLen.textContent = `${maxNameLen} Zeichen`;
  if (valMsgPadding) valMsgPadding.textContent = `${msgPadding} px`;
  if (valMaxDomMsgs) valMaxDomMsgs.textContent = `${maxDomMsgs}`;
  if (valSepOpacity) valSepOpacity.textContent = `${sepOpacity}%`;
  if (valSepSpacing) valSepSpacing.textContent = `${sepSpacing} px`;
  if (valBgOpacity) valBgOpacity.textContent = `${bgOpacity}%`;
  if (valObsBgOpacity) valObsBgOpacity.textContent = `${obsBgOpacity}%`;
  if (valEventIntensity) valEventIntensity.textContent = `${evIntensity}%`;

  const root = document.documentElement;
  root.style.setProperty('--chat-name-size', `${nameSize}px`);
  root.style.setProperty('--chat-msg-size', `${msgSize}px`);
  root.style.setProperty('--chat-pad-v', `${msgPadding}px`);
  root.style.setProperty('--chat-sep-width', showSep ? '1px' : '0px');
  root.style.setProperty('--chat-sep-color', hexToRgba(sepColor, sepOpacity));
  root.style.setProperty('--chat-sep-spacing', `${sepSpacing}px`);
  root.style.setProperty('--chat-bg-custom', hexToRgba(bgColor, bgOpacity));

  document.body.classList.toggle('layout-bubbles', layoutMode === 'bubbles');
  document.body.classList.toggle('layout-inline', layoutMode !== 'bubbles');
  document.body.classList.toggle('hide-timestamps', !showTimestamps);
  document.body.classList.toggle('hide-platicons', !showPlatIcons);

  renderFeed();

  if (save) {
    window.omnichat.saveProfile(getFormConfig());
  }
}

function playAlertTone(kind = 'mention') {
  if (!soundAlertsEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (kind === 'event') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {}
}

const OBS_ALERT_TYPES = ['follow', 'sub', 'resub', 'subgift', 'bits', 'raid'];

let savedAlertCustomMedia = {};

function getObsAlertSettings() {
  const types = {};
  for (const t of OBS_ALERT_TYPES) {
    const el = document.getElementById(`chkAlert_${t}`);
    types[t] = el ? el.checked : true;
  }
  return {
    enabled: document.getElementById('chkObsAlertsEnabled')?.checked !== false,
    durationSec: parseInt(document.getElementById('rngObsAlertDuration')?.value || '5', 10),
    soundEnabled: document.getElementById('chkObsAlertSound')?.checked !== false,
    animation: document.getElementById('selObsAlertAnim')?.value || 'pop',
    types,
    customMedia: savedAlertCustomMedia
  };
}

function getObsGoalSettings() {
  return {
    enabled: document.getElementById('chkObsGoalEnabled')?.checked !== false,
    title: document.getElementById('inputGoalTitle')?.value.trim() || 'Sub-Goal',
    current: Math.max(0, parseInt(document.getElementById('inputGoalCurrent')?.value || '0', 10) || 0),
    target: Math.max(1, parseInt(document.getElementById('inputGoalTarget')?.value || '50', 10) || 50),
    autoFollow: Boolean(document.getElementById('chkGoalAutoFollow')?.checked),
    autoSub: document.getElementById('chkGoalAutoSub')?.checked !== false,
    barColor: document.getElementById('clrGoalBar')?.value || '#9146ff'
  };
}

function getTtsSettings() {
  return {
    enabled: Boolean(document.getElementById('chkTtsEnabled')?.checked),
    readAlerts: document.getElementById('chkTtsAlerts')?.checked !== false,
    readChatCommand: document.getElementById('chkTtsChatCmd')?.checked !== false,
    commandPrefix: '!tts',
    maxLength: 180,
    rate: parseFloat(document.getElementById('rngTtsRate')?.value || '1.0'),
    volume: parseFloat(document.getElementById('rngTtsVol')?.value || '0.9'),
    voiceURI: document.getElementById('selTtsVoice')?.value || ''
  };
}

let savedYoutubeOAuth = {
  clientId: '',
  clientSecret: '',
  accessToken: '',
  refreshToken: '',
  expiresAt: 0,
  accountName: ''
};

function updateYoutubeOAuthUI(oauth = savedYoutubeOAuth) {
  savedYoutubeOAuth = { ...savedYoutubeOAuth, ...(oauth || {}) };
  const statusEl = document.getElementById('ytOAuthStatus');
  const btnLogout = document.getElementById('btnYtOAuthLogout');
  const btnLogin = document.getElementById('btnYtOAuthLogin');
  const hasWrite = Boolean(savedYoutubeOAuth.accessToken || (savedYoutubeOAuth.refreshToken && savedYoutubeOAuth.clientId));
  if (statusEl) {
    statusEl.textContent = hasWrite
      ? `✅ Schreibrecht (${savedYoutubeOAuth.accountName || 'Aktiv'})`
      : 'Nur-Lesen';
    statusEl.style.color = hasWrite ? '#4ade80' : '#94a3b8';
  }
  if (btnLogout) btnLogout.classList.toggle('hidden', !hasWrite);
  if (btnLogin) btnLogin.textContent = hasWrite ? '🔄 Neu anmelden' : '🔐 Mit Google anmelden';
}

function getChatTimerSettings() {
  const raw = document.getElementById('txtTimerMessages')?.value || '';
  return {
    enabled: Boolean(document.getElementById('chkTimerEnabled')?.checked),
    intervalMin: Math.max(1, parseInt(document.getElementById('numTimerInterval')?.value || '15', 10) || 15),
    messages: raw.split('\n').map((s) => s.trim()).filter(Boolean)
  };
}

function getAutoModSettings() {
  return {
    enabled: Boolean(document.getElementById('chkAutoModEnabled')?.checked),
    blockLinks: document.getElementById('chkAutoModLinks')?.checked !== false,
    blockCaps: Boolean(document.getElementById('chkAutoModCaps')?.checked),
    capsPercent: 75,
    blockSymbols: Boolean(document.getElementById('chkAutoModSymbols')?.checked),
    exemptMods: document.getElementById('chkAutoModExemptMods')?.checked !== false,
    blacklist: document.getElementById('inputAutoModBlacklist')?.value.trim() || '',
    timeoutSec: parseInt(document.getElementById('selAutoModTimeout')?.value || '60', 10) || 0
  };
}

function getCustomCommandsSettings() {
  const raw = document.getElementById('txtCustomCmdRules')?.value || '';
  return {
    enabled: Boolean(document.getElementById('chkCustomCmdsEnabled')?.checked),
    cooldownSec: Math.max(2, parseInt(document.getElementById('numCustomCmdCooldown')?.value || '10', 10) || 10),
    rules: raw.split('\n').map((s) => s.trim()).filter(Boolean)
  };
}

function getFormConfig() {
  return {
    streamerName: inputStreamerName.value.trim(),
    keywordAlerts: inputKeywordAlerts ? inputKeywordAlerts.value.trim() : '',
    keywordSound: chkKeywordSound ? chkKeywordSound.checked : true,
    keywordColor: clrKeywordHighlight?.value || '#f97316',
    autoConnectOnStart: chkAutoConnect.checked,
    soundAlerts: soundAlertsEnabled,
    compactChat: compactChatEnabled,
    spotifyAutoCommand: document.getElementById('chkSpotifyAutoCmd')?.checked !== false,
    obsAlerts: getObsAlertSettings(),
    obsGoals: getObsGoalSettings(),
    tts: getTtsSettings(),
    chatTimers: getChatTimerSettings(),
    autoMod: getAutoModSettings(),
    customCommands: getCustomCommandsSettings(),
    hideBots: hideBotsEnabled,
    collapseSpam: collapseSpamEnabled,
    platformIndicatorStyle: selPlatStyle?.value || 'icon_only',
    appearance: {
      layoutMode: selLayoutMode?.value || 'inline',
      nameFontSize: parseFloat(rngNameSize?.value || '13'),
      msgFontSize: parseFloat(rngMsgSize?.value || '13.5'),
      maxNameLength: parseInt(rngMaxNameLen?.value || '16', 10),
      showPlatformIcons: chkShowPlatIcons ? chkShowPlatIcons.checked : true,
      showTimestamps: chkShowTimestamps ? chkShowTimestamps.checked : true,
      msgPadding: parseInt(rngMsgPadding?.value || '5', 10),
      maxDomMessages: getMaxDomMessagesLimit(),
      showSeparator: chkShowSeparator ? chkShowSeparator.checked : true,
      sepColor: clrSeparator?.value || '#ffffff',
      sepOpacity: parseInt(rngSepOpacity?.value || '8', 10),
      sepSpacing: parseInt(rngSepSpacing?.value || '0', 10),
      bgColor: clrChatBg?.value || '#0b0f19',
      bgOpacity: parseInt(rngBgOpacity?.value || '100', 10),
      obsBgOpacity: parseInt(rngObsBgOpacity?.value || '60', 10),
      usernameColorMode: selUserColorMode?.value || 'user',
      eventHighlights: getEventHighlightSettings()
    },
    emoteSettings: {
      enable7tv: chkEmote7tv ? chkEmote7tv.checked : true,
      enableBttv: chkEmoteBttv ? chkEmoteBttv.checked : true,
      enableFfz: chkEmoteFfz ? chkEmoteFfz.checked : true,
      enableTwitchNative: chkEmoteTwitch ? chkEmoteTwitch.checked : true,
      enableYoutubeNative: chkEmoteYoutube ? chkEmoteYoutube.checked : true,
      enableTiktokNative: chkEmoteTiktok ? chkEmoteTiktok.checked : true,
      animateEmotes: chkAnimateEmotes ? chkAnimateEmotes.checked : true
    },
    twitchEnabled: chkEnableTwitch.checked,
    twitchChannel: inputTwitchChannel.value.trim(),
    twitchUsername: inputTwitchUser.value.trim(),
    twitchToken: inputTwitchToken.value.trim(),
    youtubeEnabled: chkEnableYoutube.checked,
    youtubeChannel: inputYoutubeChannel.value.trim(),
    youtubeVideoId: inputYoutubeVideoId.value.trim() || selectYoutubeStream.value,
    youtubeOAuth: {
      ...savedYoutubeOAuth,
      clientId: document.getElementById('inputYtClientId')?.value.trim() || '',
      clientSecret: document.getElementById('inputYtClientSecret')?.value.trim() || ''
    },
    tiktokEnabled: chkEnableTiktok.checked,
    tiktokChannel: inputTiktokChannel.value.trim(),
    tiktokRoomId: inputTiktokRoomId.value.trim()
  };
}

// Bind all Section 4, Section 6 & Section 8 Design, Event & Limit Controls
[
  selLayoutMode,
  rngNameSize,
  rngMsgSize,
  rngMaxNameLen,
  rngMsgPadding,
  rngMaxDomMsgs,
  chkShowPlatIcons,
  chkShowTimestamps,
  selPlatStyle,
  selUserColorMode,
  chkShowSeparator,
  clrSeparator,
  rngSepOpacity,
  rngSepSpacing,
  clrChatBg,
  rngBgOpacity,
  rngObsBgOpacity,
  selEventStyle,
  rngEventIntensity,
  ...Object.values(evCheckboxes),
  ...Object.values(evColors)
].forEach((el) => {
  el?.addEventListener('input', () => applyAppearanceToDOM(true));
  el?.addEventListener('change', () => applyAppearanceToDOM(true));
});

// Bind Section 3 Emote Provider Toggles
[chkEmote7tv, chkEmoteBttv, chkEmoteFfz, chkEmoteTwitch, chkEmoteYoutube, chkEmoteTiktok, chkAnimateEmotes].forEach(
  (chk) => {
    chk?.addEventListener('change', () => {
      window.omnichat.saveProfile(getFormConfig());
      renderFeed();
    });
  }
);

function applyCompactMode(enabled) {
  compactChatEnabled = Boolean(enabled);
  document.body.classList.toggle('compact-mode', compactChatEnabled);
  btnCompactMode.classList.toggle('active', compactChatEnabled);
  if (compactChatEnabled && rngMsgPadding) {
    rngMsgPadding.value = '2';
    if (chkShowTimestamps) chkShowTimestamps.checked = false;
    if (selPlatStyle) selPlatStyle.value = 'icon_only';
    applyAppearanceToDOM(false);
  }
}

// Toggle Sidebar
btnToggleSidebar.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

// Toggle Tall, Slim OBS-Dock Window Mode (340px left of OBS)
btnSlimDock?.addEventListener('click', async () => {
  slimDockActive = !slimDockActive;
  btnSlimDock.classList.toggle('active', slimDockActive);
  if (slimDockActive) {
    sidebar.classList.add('hidden');
    applyCompactMode(true);
  } else {
    sidebar.classList.remove('hidden');
  }
  await window.omnichat.toggleSlimDock(slimDockActive);
});

// Toggle Compact Mode
btnCompactMode.addEventListener('click', () => {
  applyCompactMode(!compactChatEnabled);
  window.omnichat.saveProfile(getFormConfig());
});

// Toggle Sound Alerts
btnSoundToggle.addEventListener('click', () => {
  soundAlertsEnabled = !soundAlertsEnabled;
  btnSoundToggle.classList.toggle('active', soundAlertsEnabled);
  window.omnichat.saveProfile(getFormConfig());
  if (soundAlertsEnabled) playAlertTone('mention');
});

chkAutoConnect.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});
inputStreamerName.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});
[inputKeywordAlerts, chkKeywordSound, clrKeywordHighlight].forEach((el) => {
  el?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
    renderFeed();
  });
});

// Per-Platform Enable / Disable Checkboxes
[
  ['twitch', chkEnableTwitch],
  ['youtube', chkEnableYoutube],
  ['tiktok', chkEnableTiktok]
].forEach(([plat, chk]) => {
  chk.addEventListener('change', () => {
    document.getElementById(`card_${plat}`)?.classList.toggle('disabled-card', !chk.checked);
    window.omnichat.togglePlatformEnabled(plat, chk.checked, getFormConfig());
    renderFeed();
  });
});

// 1-Click Twitch Chat OAuth Token Generator
document.getElementById('btnGetTwitchToken')?.addEventListener('click', () => {
  window.omnichat.openUserProfile({ platform: 'twitch-token-generator', author: '' });
});

// YouTube Stream Selector & Scanner
btnScanYoutube.addEventListener('click', async () => {
  btnScanYoutube.textContent = '⏳';
  await window.omnichat.discoverYoutubeStreams(inputYoutubeChannel.value.trim());
  btnScanYoutube.textContent = '🔍';
});

selectYoutubeStream.addEventListener('change', () => {
  inputYoutubeVideoId.value = selectYoutubeStream.value;
  if (selectYoutubeStream.value) {
    window.omnichat.connectPlatform('youtube', getFormConfig());
  }
});

document.getElementById('btnYtOAuthLogin')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnYtOAuthLogin');
  const clientId = document.getElementById('inputYtClientId')?.value.trim() || '';
  const clientSecret = document.getElementById('inputYtClientSecret')?.value.trim() || '';
  if (!clientId) {
    alert('Bitte zuerst eine Google OAuth2 Client-ID (Desktop-App) eintragen.');
    return;
  }
  await window.omnichat.saveProfile(getFormConfig());
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Browser geöffnet...';
  }
  const res = await window.omnichat.youtubeOAuthLogin({ clientId, clientSecret });
  if (btn) btn.disabled = false;
  if (res?.ok && res.oauth) {
    updateYoutubeOAuthUI(res.oauth);
  } else {
    updateYoutubeOAuthUI(savedYoutubeOAuth);
    if (res?.error) alert(res.error);
  }
});

document.getElementById('btnYtOAuthLogout')?.addEventListener('click', async () => {
  const res = await window.omnichat.youtubeOAuthLogout();
  if (res?.ok) {
    updateYoutubeOAuthUI(res.oauth || {});
  }
});

['inputYtClientId', 'inputYtClientSecret'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

// Toggle Always-on-Top
btnPinWindow.addEventListener('click', async () => {
  const onTop = await window.omnichat.toggleAlwaysOnTop();
  btnPinWindow.classList.toggle('active', onTop);
});

// Toggle Demo Mode
btnDemo.addEventListener('click', async () => {
  await window.omnichat.toggleDemo();
});

// Clear Chat
btnClearChat.addEventListener('click', () => {
  messages = [];
  seenMessageIds.clear();
  streamerEvents = [];
  pinnedBanner.classList.add('hidden');
  window.omnichat.clearChat();
  renderEventTicker();
  renderFeed();
});

// Smart Auto-Scroll Detection: pause auto-scroll when user scrolls up to inspect older messages
chatFeed.addEventListener('scroll', () => {
  const distanceFromBottom = chatFeed.scrollHeight - chatFeed.scrollTop - chatFeed.clientHeight;
  if (distanceFromBottom > 48) {
    isAutoScrollPaused = true;
    btnResumeScroll?.classList.remove('hidden');
  } else {
    isAutoScrollPaused = false;
    unreadWhilePaused = 0;
    btnResumeScroll?.classList.add('hidden');
  }
});

btnResumeScroll?.addEventListener('click', () => {
  isAutoScrollPaused = false;
  unreadWhilePaused = 0;
  btnResumeScroll.classList.add('hidden');
  chatFeed.scrollTop = chatFeed.scrollHeight;
});

// Connect / Disconnect / Reconnect individual platforms
btnConnectTwitch.addEventListener('click', () => {
  const st = currentStates.twitch?.status;
  if (st === 'connected' || st === 'connecting' || st === 'reconnecting' || st === 'standby') {
    window.omnichat.disconnectPlatform('twitch');
  } else {
    chkEnableTwitch.checked = true;
    document.getElementById('card_twitch')?.classList.remove('disabled-card');
    window.omnichat.connectPlatform('twitch', getFormConfig());
  }
});

btnReconnectTwitch.addEventListener('click', () => {
  chkEnableTwitch.checked = true;
  document.getElementById('card_twitch')?.classList.remove('disabled-card');
  window.omnichat.reconnectPlatform('twitch', getFormConfig());
});

btnConnectYoutube.addEventListener('click', () => {
  document.getElementById('err_youtube').textContent = '';
  const st = currentStates.youtube?.status;
  if (st === 'connected' || st === 'connecting' || st === 'reconnecting' || st === 'standby') {
    window.omnichat.disconnectPlatform('youtube');
  } else {
    chkEnableYoutube.checked = true;
    document.getElementById('card_youtube')?.classList.remove('disabled-card');
    window.omnichat.connectPlatform('youtube', getFormConfig());
  }
});

btnReconnectYoutube.addEventListener('click', () => {
  document.getElementById('err_youtube').textContent = '';
  chkEnableYoutube.checked = true;
  document.getElementById('card_youtube')?.classList.remove('disabled-card');
  window.omnichat.reconnectPlatform('youtube', getFormConfig());
});

btnConnectTiktok.addEventListener('click', () => {
  document.getElementById('err_tiktok').textContent = '';
  const st = currentStates.tiktok?.status;
  if (st === 'connected' || st === 'connecting' || st === 'reconnecting' || st === 'standby') {
    window.omnichat.disconnectPlatform('tiktok');
  } else {
    chkEnableTiktok.checked = true;
    document.getElementById('card_tiktok')?.classList.remove('disabled-card');
    window.omnichat.connectPlatform('tiktok', getFormConfig());
  }
});

btnReconnectTiktok.addEventListener('click', () => {
  document.getElementById('err_tiktok').textContent = '';
  chkEnableTiktok.checked = true;
  document.getElementById('card_tiktok')?.classList.remove('disabled-card');
  window.omnichat.reconnectPlatform('tiktok', getFormConfig());
});

btnConnectAll.addEventListener('click', () => {
  document.getElementById('err_youtube').textContent = '';
  document.getElementById('err_tiktok').textContent = '';
  window.omnichat.connectAll(getFormConfig());
  btnConnectAll.textContent = '✓ Gespeichert & Verbunden!';
  setTimeout(() => {
    btnConnectAll.textContent = '💾 Profil speichern & Alle aktiven Kanäle verbinden';
  }, 1800);
});

const inputObsDockUrl = document.getElementById('inputObsDockUrl');
const btnCopyObsDock = document.getElementById('btnCopyObsDock');
const btnOpenStandaloneFull = document.getElementById('btnOpenStandaloneFull');

// Open Standalone Full-Height Chat Window Left of OBS
btnPopoutChat?.addEventListener('click', () => {
  window.omnichat.openStandaloneChat(true);
});

btnOpenStandaloneFull?.addEventListener('click', () => {
  window.omnichat.openStandaloneChat(true);
});

// Copy OBS Custom Browser Dock URL
btnCopyObsDock?.addEventListener('click', () => {
  if (!inputObsDockUrl) return;
  navigator.clipboard.writeText(inputObsDockUrl.value);
  btnCopyObsDock.textContent = 'Dock-Link kopiert ✓';
  setTimeout(() => {
    btnCopyObsDock.textContent = 'Dock-Link kopieren';
  }, 1500);
});

// Copy OBS Overlay URL
btnCopyObs.addEventListener('click', () => {
  navigator.clipboard.writeText(inputObsUrl.value);
  btnCopyObs.textContent = 'Kopiert ✓';
  setTimeout(() => {
    btnCopyObs.textContent = 'Overlay-URL kopieren';
  }, 1500);
});

// Filter Tabs
document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    renderFeed();
  });
});

inputSearch.addEventListener('input', () => {
  searchQuery = inputSearch.value.trim().toLowerCase();
  renderFeed();
});

// Unpin Message
btnUnpin.addEventListener('click', () => {
  pinnedBanner.classList.add('hidden');
  window.omnichat.pinMessage(null);
});

function pinMessageToObs(msg) {
  pinnedBody.innerHTML = `
    ${renderPlatformIndicatorHtml(msg.platform)}
    <strong style="color: ${resolveAuthorColor(msg)}">${escapeHtml(truncateUsername(msg.author))}:</strong>
    <span>${renderMessageContentHtml(msg)}</span>
  `;
  pinnedBanner.classList.remove('hidden');
  window.omnichat.pinMessage(msg);
}

function formatAccountAge(isoDateStr) {
  if (!isoDateStr) return null;
  const created = new Date(isoDateStr);
  if (isNaN(created.getTime())) return null;
  const dateFormatted = created.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const diffYears = ((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
  return `Account seit ${dateFormatted} (${diffYears} J.)`;
}

// Section 7: Full User & Message Quick-Action Context Menu
async function openQuickMenu(msg, anchorRect) {
  selectedMenuMsg = msg;
  banConfirmArmed = false;

  // 7.1 User Overview Header
  qmPlat.textContent = msg.platform.toUpperCase();
  qmPlat.className = `qm-plat ${msg.platform}`;
  qmUser.textContent = msg.author;
  qmReply.textContent = `💬 @${truncateUsername(msg.author)} antworten`;

  // Avatar (initial or fallback)
  if (msg.avatar) {
    qmAvatar.src = msg.avatar;
    qmAvatar.classList.remove('hidden');
    qmAvatarFallback.classList.add('hidden');
  } else {
    qmAvatar.src = '';
    qmAvatar.classList.add('hidden');
    qmAvatarFallback.classList.remove('hidden');
  }

  // Moderator, VIP, Subscriber / Member Role Status Pills
  const badges = Array.isArray(msg.badges) ? msg.badges : [];
  const rolePills = [];
  if (badges.some((b) => b.includes('STREAMER') || b.includes('OWNER'))) {
    rolePills.push('<span class="qm-role streamer">👑 Streamer</span>');
  }
  if (badges.some((b) => b.includes('MOD'))) {
    rolePills.push('<span class="qm-role mod">⚔️ Moderator</span>');
  }
  if (badges.some((b) => b.includes('VIP'))) {
    rolePills.push('<span class="qm-role vip">💎 VIP</span>');
  }
  if (badges.some((b) => b.includes('SUB') || b.includes('MEMBER'))) {
    rolePills.push('<span class="qm-role sub">⭐ Subscriber</span>');
  }
  if (rolePills.length === 0) {
    rolePills.push('<span class="qm-role viewer">👤 Zuschauer</span>');
  }
  if (qmRolesRow) qmRolesRow.innerHTML = rolePills.join('');

  if (qmAccountAge) {
    qmAccountAge.textContent =
      msg.platform === 'twitch'
        ? 'Lade Twitch-Profil & Account-Alter...'
        : `Plattform: ${msg.platform.toUpperCase()} (Account-Alter API-seitig nicht öffentlich)`;
  }

  // 7.3 Permissions & Platform Safety Check
  const isTwitch = msg.platform === 'twitch';
  const hasTwitchToken = Boolean(inputTwitchToken?.value.trim());
  const canServerMod = isTwitch && hasTwitchToken;

  if (canServerMod) {
    qmPermBadge.textContent = '✓ Berechtigt (Twitch OAuth)';
    qmPermBadge.className = 'qm-perm-badge ok';
    qmPermHint.textContent = `Aktionen werden direkt auf ${msg.platform.toUpperCase()} ausgeführt.`;
    qmServerDelete.disabled = false;
    qmServerDelete.textContent = '🗑️ Nachricht auf Twitch löschen (/delete)';
    qmBanUser.disabled = false;
    qmBanUser.textContent = '🚫 Dauerhaft bannen';
    qmUnbanUser.disabled = false;
    qmUnbanUser.textContent = '🔓 Ban/Timeout aufheben';
    qmTimeoutBox?.classList.remove('disabled-box');
    qmTimeoutBox?.querySelectorAll('.qm-to-btn').forEach((b) => (b.disabled = false));
  } else {
    qmPermBadge.textContent = '🔒 Eingeschränkt';
    qmPermBadge.className = 'qm-perm-badge locked';
    qmPermHint.textContent = isTwitch
      ? 'Kein Twitch OAuth-Token hinterlegt – Server-Moderation deaktiviert (nutze Lokal löschen/stumm oben).'
      : `${msg.platform.toUpperCase()} unterstützt keine Server-Moderation ohne OAuth-Mod-API (nutze Lokal löschen/stumm).`;
    qmServerDelete.disabled = true;
    qmServerDelete.textContent = '🔒 Plattform-Löschen nicht verfügbar';
    qmBanUser.disabled = true;
    qmBanUser.textContent = '🔒 Bannen nicht verfügbar';
    qmUnbanUser.disabled = false; // Still allows unmuting locally!
    qmUnbanUser.textContent = '🔓 Lokal-Stumm aufheben';
    qmTimeoutBox?.classList.add('disabled-box');
    qmTimeoutBox?.querySelectorAll('.qm-to-btn').forEach((b) => (b.disabled = true));
  }

  quickMenu.classList.remove('hidden');

  const menuWidth = 268;
  const menuHeight = 355;
  let left = Math.min(window.innerWidth - menuWidth - 8, Math.max(8, anchorRect.left));
  let top = anchorRect.bottom + 4;
  if (top + menuHeight > window.innerHeight - 8) {
    top = Math.max(8, anchorRect.top - menuHeight - 4);
  }

  quickMenu.style.left = `${left}px`;
  quickMenu.style.top = `${top}px`;

  // Async fetch of Twitch Avatar & Account-Alter via GQL
  if (isTwitch) {
    const details = await window.omnichat.getUserDetails({
      platform: msg.platform,
      author: msg.author,
      avatar: msg.avatar || ''
    });
    if (selectedMenuMsg && selectedMenuMsg.id === msg.id && details?.ok) {
      if (details.avatar) {
        msg.avatar = details.avatar;
        qmAvatar.src = details.avatar;
        qmAvatar.classList.remove('hidden');
        qmAvatarFallback.classList.add('hidden');
      }
      const ageStr = formatAccountAge(details.createdAt);
      if (qmAccountAge) {
        qmAccountAge.textContent = ageStr || 'Twitch-Account (Erstelldatum privat)';
      }
    }
  }
}

function closeQuickMenu() {
  quickMenu.classList.add('hidden');
  selectedMenuMsg = null;
  banConfirmArmed = false;
}

document.addEventListener('click', (e) => {
  if (!quickMenu.classList.contains('hidden') && !quickMenu.contains(e.target)) {
    closeQuickMenu();
  }
});

// 7.2 Quick Actions Handlers
qmReply.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  activeReplyParentId = selectedMenuMsg.platform === 'twitch' ? selectedMenuMsg.id : null;
  inputReply.value = `@${selectedMenuMsg.author} `;
  inputReply.focus();
  closeQuickMenu();
});

qmCopyMsg?.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  navigator.clipboard.writeText(selectedMenuMsg.text || '');
  closeQuickMenu();
});

qmCopyUser?.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  navigator.clipboard.writeText(selectedMenuMsg.author || '');
  closeQuickMenu();
});

qmPin.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  pinMessageToObs(selectedMenuMsg);
  closeQuickMenu();
});

qmOpenProfile?.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  window.omnichat.openUserProfile({
    platform: selectedMenuMsg.platform,
    author: selectedMenuMsg.author
  });
  closeQuickMenu();
});

qmDeleteLocal?.addEventListener('click', async () => {
  if (!selectedMenuMsg) return;
  await window.omnichat.moderateAction('delete-msg', selectedMenuMsg);
  closeQuickMenu();
});

qmMuteLocal?.addEventListener('click', async () => {
  if (!selectedMenuMsg) return;
  await window.omnichat.moderateAction('mute-user', selectedMenuMsg);
  closeQuickMenu();
});

qmServerDelete?.addEventListener('click', async () => {
  if (!selectedMenuMsg || qmServerDelete.disabled) return;
  await window.omnichat.moderateAction('delete-msg', selectedMenuMsg);
  closeQuickMenu();
});

// Selectable Timeout Durations (10s, 1m, 10m, 1h)
qmTimeoutBox?.querySelectorAll('.qm-to-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    if (!selectedMenuMsg || btn.disabled) return;
    const sec = parseInt(btn.dataset.sec || '600', 10);
    const res = await window.omnichat.moderateAction('timeout', selectedMenuMsg, sec);
    if (!res.ok && res.error) {
      alert(res.error);
    }
    closeQuickMenu();
  });
});

// 7.3 Two-step confirmation for permanent Ban
qmBanUser.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (!selectedMenuMsg || qmBanUser.disabled) return;
  if (!banConfirmArmed) {
    banConfirmArmed = true;
    qmBanUser.textContent = '⚠️ Sicher? Klick = Ban!';
    return;
  }
  const res = await window.omnichat.moderateAction('ban-user', selectedMenuMsg);
  if (!res.ok && res.error) {
    alert(res.error);
  }
  closeQuickMenu();
});

qmUnbanUser?.addEventListener('click', async () => {
  if (!selectedMenuMsg) return;
  await window.omnichat.moderateAction('unban-user', selectedMenuMsg);
  closeQuickMenu();
});

// Section 9: Send Message directly to selected target platforms (Twitch / YouTube)
[chkSendTwitch, chkSendYoutube].forEach((chk) => {
  chk?.addEventListener('change', () => {
    chk.closest('.send-target-pill')?.classList.toggle('active', chk.checked);
  });
});

async function sendReply() {
  const text = inputReply.value.trim();
  if (!text) return;
  const targets = [];
  if (!chkSendTwitch || chkSendTwitch.checked) targets.push('twitch');
  if (chkSendYoutube && chkSendYoutube.checked) targets.push('youtube');
  if (chkSendTiktok && chkSendTiktok.checked) targets.push('tiktok');

  if (targets.length === 0) {
    alert('Bitte wähle mindestens eine Zielplattform (z.B. 🟣 TW) zum Senden aus.');
    return;
  }

  const res = await window.omnichat.sendChatMessage({
    text,
    replyParentId: activeReplyParentId,
    targets
  });
  if (res.ok) {
    inputReply.value = '';
    activeReplyParentId = null;
    if (Array.isArray(res.warnings) && res.warnings.length > 0) {
      console.warn(res.warnings.join(' | '));
    }
  } else {
    alert(res.error || 'Senden fehlgeschlagen.');
  }
}

btnSendReply.addEventListener('click', sendReply);
inputReply.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendReply();
});

// Section 9: Collapsible Statistics & Diagnostics Tab Controls
btnToggleStatsTab?.addEventListener('click', () => {
  const isHidden = statsDiagDrawer?.classList.toggle('hidden');
  btnToggleStatsTab.classList.toggle('active', !isHidden);
  if (!isHidden) {
    renderSessionStatistics();
    renderDiagnosticLogs();
  }
});

btnCloseStatsTab?.addEventListener('click', () => {
  statsDiagDrawer?.classList.add('hidden');
  btnToggleStatsTab?.classList.remove('active');
});

statsDiagDrawer?.querySelectorAll('.sdd-tab').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    statsDiagDrawer.querySelectorAll('.sdd-tab').forEach((b) => b.classList.remove('active'));
    tabBtn.classList.add('active');
    const target = tabBtn.dataset.sddTab;
    document.getElementById('sddTab_stats')?.classList.toggle('hidden', target !== 'stats');
    document.getElementById('sddTab_logs')?.classList.toggle('hidden', target !== 'logs');
  });
});

btnClearDiagLogs?.addEventListener('click', () => {
  diagLogs = [];
  renderDiagnosticLogs();
});

// Section 9: Role Filter, Bot Filter & Spam Collapsing Controls
selRoleFilter?.addEventListener('change', () => {
  activeRoleFilter = selRoleFilter.value || 'all';
  renderFeed();
});

btnHideBots?.addEventListener('click', () => {
  hideBotsEnabled = !hideBotsEnabled;
  btnHideBots.classList.toggle('active', hideBotsEnabled);
  window.omnichat.saveProfile(getFormConfig());
  renderFeed();
});

btnCollapseSpam?.addEventListener('click', () => {
  collapseSpamEnabled = !collapseSpamEnabled;
  btnCollapseSpam.classList.toggle('active', collapseSpamEnabled);
  window.omnichat.saveProfile(getFormConfig());
  renderFeed();
});

function isBotOrSystemMessage(msg) {
  if (!msg) return false;
  const authorLow = String(msg.author || '').trim().toLowerCase();
  if (KNOWN_BOTS.has(authorLow) || authorLow.endsWith('bot')) return true;
  const badges = (msg.badges || []).map((b) => String(b).toUpperCase());
  if (badges.includes('BOT') || badges.includes('SYSTEM')) return true;
  return false;
}

function hasRoleMatch(msg, roleFilter) {
  if (!roleFilter || roleFilter === 'all') return true;
  const badges = (msg.badges || []).map((b) => String(b).toUpperCase());
  if (roleFilter === 'mod_vip') {
    return badges.some(
      (b) => b.includes('MOD') || b.includes('VIP') || b.includes('BROADCASTER') || b.includes('OWNER')
    );
  }
  if (roleFilter === 'sub') {
    return (
      badges.some((b) => b.includes('SUB') || b.includes('MEMBER') || b.includes('FOUNDER')) ||
      msg.eventType === 'sub' ||
      msg.eventType === 'resub'
    );
  }
  return true;
}

function getNormalizedEventType(msg) {
  if (!msg || !msg.eventType) return null;
  const raw = String(msg.eventType).toLowerCase();
  if (raw === 'follow') return 'follow';
  if (raw === 'sub' || raw === 'member') return 'sub';
  if (raw === 'resub') return 'resub';
  if (raw === 'subgift') return 'subgift';
  if (raw === 'bits' || raw === 'gift' || raw === 'superchat') return 'bits';
  if (raw === 'raid') return 'raid';
  if (raw === 'highlighted_msg') return 'highlighted_msg';
  return null;
}

function isHighlightMsg(msg) {
  const evType = getNormalizedEventType(msg);
  if (!evType) return false;
  const chk = evCheckboxes[evType];
  return chk ? chk.checked : true;
}

function updateCounters() {
  document.getElementById('count_all').textContent = messages.length;
  document.getElementById('count_mentions').textContent = messages.filter((m) => m.isMention).length;
  document.getElementById('count_highlights').textContent = messages.filter((m) => isHighlightMsg(m)).length;
  document.getElementById('count_twitch').textContent = messages.filter((m) => m.platform === 'twitch').length;
  document.getElementById('count_youtube').textContent = messages.filter((m) => m.platform === 'youtube').length;
  document.getElementById('count_tiktok').textContent = messages.filter((m) => m.platform === 'tiktok').length;
}

function matchesFilter(msg) {
  if (!chkEnableTwitch.checked && msg.platform === 'twitch') return false;
  if (!chkEnableYoutube.checked && msg.platform === 'youtube') return false;
  if (!chkEnableTiktok.checked && msg.platform === 'tiktok') return false;

  if (hideBotsEnabled && isBotOrSystemMessage(msg)) return false;
  if (!hasRoleMatch(msg, activeRoleFilter)) return false;

  if (activeFilter === 'mentions' && !msg.isMention) return false;
  if (activeFilter === 'highlights' && !isHighlightMsg(msg)) return false;
  if (activeFilter === 'twitch' && msg.platform !== 'twitch') return false;
  if (activeFilter === 'youtube' && msg.platform !== 'youtube') return false;
  if (activeFilter === 'tiktok' && msg.platform !== 'tiktok') return false;

  if (searchQuery) {
    const hay = `${msg.author} ${msg.text}`.toLowerCase();
    if (!hay.includes(searchQuery)) return false;
  }
  return true;
}

function recordMessageInSessionStats(msg) {
  sessionStats.totalMessages += 1;
  if (sessionStats.byPlatform[msg.platform] !== undefined) {
    sessionStats.byPlatform[msg.platform] += 1;
  }
  if (msg.author) {
    const key = `${msg.platform}:${msg.author}`;
    sessionStats.chatterCounts.set(key, (sessionStats.chatterCounts.get(key) || 0) + 1);
  }
  if (Array.isArray(msg.tokens)) {
    for (const t of msg.tokens) {
      if (t.type === 'emote' && t.name) {
        const cur = sessionStats.emoteCounts.get(t.name) || { count: 0, url: t.url, provider: t.provider };
        cur.count += 1;
        sessionStats.emoteCounts.set(t.name, cur);
      }
    }
  }
  if (statsDiagDrawer && !statsDiagDrawer.classList.contains('hidden')) {
    renderSessionStatistics();
  }
}

function renderSessionStatistics() {
  if (!statTotalMsgs) return;
  const total = sessionStats.totalMessages;
  statTotalMsgs.textContent = total.toLocaleString('de-DE');

  const elapsedMin = Math.max(0.25, (Date.now() - sessionStats.startTime) / 60000);
  const perMin = (total / elapsedMin).toFixed(1);
  if (statMsgsPerMin) statMsgsPerMin.textContent = `${perMin} / Min`;

  const tw = sessionStats.byPlatform.twitch || 0;
  const yt = sessionStats.byPlatform.youtube || 0;
  const tt = sessionStats.byPlatform.tiktok || 0;
  const pTw = total > 0 ? Math.round((tw / total) * 100) : 0;
  const pYt = total > 0 ? Math.round((yt / total) * 100) : 0;
  const pTt = total > 0 ? Math.max(0, 100 - pTw - pYt) : 0;

  if (statBarTw) statBarTw.style.width = `${total > 0 ? pTw : 34}%`;
  if (statBarYt) statBarYt.style.width = `${total > 0 ? pYt : 33}%`;
  if (statBarTt) statBarTt.style.width = `${total > 0 ? pTt : 33}%`;
  if (statSplitText) {
    statSplitText.textContent = `TW ${pTw}% (${tw}) • YT ${pYt}% (${yt}) • TT ${pTt}% (${tt})`;
  }

  if (statTopChatters) {
    const sortedChatters = Array.from(sessionStats.chatterCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    if (sortedChatters.length === 0) {
      statTopChatters.innerHTML = `<span class="kpi-empty">Noch keine Daten</span>`;
    } else {
      statTopChatters.innerHTML = sortedChatters
        .map(([k, count]) => {
          const [plat, name] = k.split(':');
          const ic = PLATFORM_ICONS[plat] || '';
          return `<span class="kpi-pill">${ic} ${escapeHtml(truncateUsername(name))} <strong>×${count}</strong></span>`;
        })
        .join('');
    }
  }

  if (statTopEmotes) {
    const sortedEmotes = Array.from(sessionStats.emoteCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
    if (sortedEmotes.length === 0) {
      statTopEmotes.innerHTML = `<span class="kpi-empty">Noch keine Emotes</span>`;
    } else {
      statTopEmotes.innerHTML = sortedEmotes
        .map(
          ([name, info]) =>
            `<span class="kpi-pill"><img src="${info.url}" class="kpi-emote-img" alt="${escapeHtml(name)}" /> ${escapeHtml(name)} <strong>×${info.count}</strong></span>`
        )
        .join('');
    }
  }
}

function renderDiagnosticLogs() {
  if (diagLogCount) diagLogCount.textContent = String(diagLogs.length);
  if (!diagLogList) return;
  if (diagLogs.length === 0) {
    diagLogList.innerHTML = `<div class="diag-empty">Keine Protokolleinträge vorhanden.</div>`;
    return;
  }
  diagLogList.innerHTML = diagLogs
    .slice(-80)
    .reverse()
    .map((entry) => {
      const t = new Date(entry.timestamp || Date.now()).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const plat = String(entry.platform || 'system').toUpperCase();
      return `<div class="diag-row ${entry.level || 'info'}"><span class="diag-time">${t}</span><span class="diag-plat ${entry.platform}">${plat}</span><span class="diag-msg">${escapeHtml(entry.message)}</span></div>`;
    })
    .join('');
}

let eventsExpanded = false;
const eventTickerBar = document.getElementById('eventTickerBar');
const btnToggleEvents = document.getElementById('btnToggleEvents');
const btnToggleEventsTitle = document.getElementById('btnToggleEventsTitle');

function toggleEventsDrawer() {
  eventsExpanded = !eventsExpanded;
  eventTickerBar?.classList.toggle('expanded', eventsExpanded);
  renderEventTicker();
}

btnToggleEvents?.addEventListener('click', toggleEventsDrawer);
btnToggleEventsTitle?.addEventListener('click', toggleEventsDrawer);

function renderEventTicker() {
  if (!eventTickerRow) return;
  if (streamerEvents.length === 0) {
    eventTickerRow.innerHTML = `<span class="ticker-empty">Subs, TikTok Gifts, Follows & SuperChats erscheinen hier</span>`;
    btnToggleEvents?.classList.add('hidden');
    return;
  }

  if (btnToggleEvents) {
    if (streamerEvents.length > 3) {
      btnToggleEvents.classList.remove('hidden');
      btnToggleEvents.textContent = eventsExpanded ? '▴ Einklappen' : `▾ Alle (${streamerEvents.length})`;
    } else {
      btnToggleEvents.classList.add('hidden');
    }
  }

  const icons = {
    sub: '⭐',
    resub: '🌟',
    subgift: '🎁',
    follow: '❤️',
    bits: '💎',
    raid: '🚨',
    highlighted_msg: '✨'
  };

  const visibleCount = eventsExpanded ? 25 : 3;
  eventTickerRow.innerHTML = streamerEvents
    .slice(-visibleCount)
    .reverse()
    .map((ev) => {
      const t = String(ev.type || '').toLowerCase();
      const icon = icons[t] || '✨';
      return `
        <div class="event-pill ${ev.platform} ${t}">
          <span class="ev-icon">${icon}</span>
          <strong class="ev-author">${escapeHtml(truncateUsername(ev.author))}</strong>
          <span class="ev-summary">${escapeHtml(ev.summary)}</span>
        </div>
      `;
    })
    .join('');
}

function createMessageElement(msg) {
  const div = document.createElement('div');
  const evType = getNormalizedEventType(msg);
  const highlightActive = isHighlightMsg(msg);
  const classes = ['chat-item', msg.platform];
  if (highlightActive && evType) {
    classes.push('event-item', `event-${evType}`);
  }
  if (msg.isMention) {
    classes.push('mention');
  } else if (msg.isKeywordAlert) {
    classes.push('keyword-alert');
  }
  div.className = classes.join(' ');
  div.dataset.id = msg.id;
  div.dataset.ts = String(msg.timestamp || 0);

  if (highlightActive && evType) {
    const hexColor = evColors[evType]?.value || '#f59e0b';
    const intensity = parseInt(rngEventIntensity?.value || '18', 10);
    const styleMode = selEventStyle?.value || 'bar';

    if (styleMode === 'banner') {
      div.style.background = `linear-gradient(90deg, ${hexToRgba(hexColor, Math.min(75, intensity + 18))}, ${hexToRgba(hexColor, Math.max(8, intensity - 4))})`;
      div.style.borderLeft = `4px solid ${hexColor}`;
      div.style.borderTop = `1px solid ${hexToRgba(hexColor, 45)}`;
      div.style.borderBottom = `1px solid ${hexToRgba(hexColor, 45)}`;
    } else if (styleMode === 'outline') {
      div.style.background = hexToRgba(hexColor, Math.max(4, Math.floor(intensity / 2)));
      div.style.border = `1px solid ${hexToRgba(hexColor, Math.min(85, intensity + 30))}`;
      div.style.borderLeft = `3px solid ${hexColor}`;
    } else {
      div.style.background = hexToRgba(hexColor, intensity);
      div.style.borderLeft = `3.5px solid ${hexColor}`;
    }
  } else if (msg.isKeywordAlert && !msg.isMention) {
    const kwColor = clrKeywordHighlight?.value || '#f97316';
    div.style.background = hexToRgba(kwColor, 14);
    div.style.borderLeft = `3px solid ${kwColor}`;
  }

  const badgesHtml = (msg.badges || [])
    .map((b) => `<span class="msg-badge">${escapeHtml(b)}</span>`)
    .join('');

  const mentionTag = msg.isMention ? `<span class="mention-pill">@MICH</span>` : '';
  const kwColorVal = clrKeywordHighlight?.value || '#f97316';
  const keywordTag =
    msg.isKeywordAlert && msg.matchedKeyword
      ? `<span class="keyword-pill" style="background:${kwColorVal};" title="Keyword-Alarm: ${escapeHtml(msg.matchedKeyword)}">🔍 ${escapeHtml(msg.matchedKeyword.toUpperCase())}</span>`
      : '';
  const displayAuthor = truncateUsername(msg.author);
  const authorColor = resolveAuthorColor(msg);
  const repeatCount = Number(msg.repeatCount || 1);
  const repeatBadgeHtml =
    repeatCount > 1
      ? `<span class="msg-repeat-badge" title="Identische Nachricht ${repeatCount}× zusammengefasst">×${repeatCount}</span>`
      : '';

  div.innerHTML = `<div class="msg-inline-flow"><span class="msg-time">${formatTime(msg.timestamp)}</span>${renderPlatformIndicatorHtml(msg.platform)}${mentionTag}${keywordTag}${badgesHtml}<span class="msg-author clickable-user" style="color: ${authorColor}" title="${escapeHtml(msg.author)} — Klick oder Rechtsklick für Schnellmenü">${escapeHtml(displayAuthor)}:</span><span class="msg-text">${renderMessageContentHtml(msg)}</span>${repeatBadgeHtml}</div><div class="msg-actions"><button class="btn-pin-msg" title="In OBS einblenden">📌</button><button class="btn-quick-menu" title="Nutzer- & Nachrichten-Schnellmenü">⋮</button></div>`;

  div.querySelector('.btn-pin-msg').addEventListener('click', (e) => {
    e.stopPropagation();
    pinMessageToObs(msg);
  });

  const openMenuAtEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = {
      left: e.clientX || e.currentTarget.getBoundingClientRect().left,
      top: e.clientY || e.currentTarget.getBoundingClientRect().top,
      bottom: (e.clientY || e.currentTarget.getBoundingClientRect().bottom) + 2
    };
    openQuickMenu(msg, rect);
  };

  // Section 7 Requirement: Click OR Right-Click on a message opens the quick context menu!
  div.addEventListener('click', openMenuAtEvent);
  div.addEventListener('contextmenu', openMenuAtEvent);
  div.querySelector('.clickable-user').addEventListener('click', openMenuAtEvent);
  div.querySelector('.btn-quick-menu').addEventListener('click', openMenuAtEvent);

  return div;
}

function renderFeed() {
  pendingRenderQueue = [];
  updateCounters();
  messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  const filtered = messages.filter(matchesFilter);
  const maxDom = getMaxDomMessagesLimit();

  if (messages.length === 0) {
    emptyState.classList.remove('hidden');
    chatFeed.innerHTML = '';
    chatFeed.appendChild(emptyState);
    if (perfDomVal) perfDomVal.textContent = `0 / ${maxDom}`;
    return;
  }

  emptyState.classList.add('hidden');
  chatFeed.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (const msg of filtered.slice(-maxDom)) {
    frag.appendChild(createMessageElement(msg));
  }
  chatFeed.appendChild(frag);
  if (perfDomVal) perfDomVal.textContent = `${chatFeed.children.length} / ${maxDom}`;
  if (!isAutoScrollPaused) {
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }
}

function updateYoutubeStreamDropdown(streams = [], activeVideoId = '') {
  if (!selectYoutubeStream) return;
  const currentVal = activeVideoId || selectYoutubeStream.value || '';
  const options = [`<option value="">✨ Aktiven Livestream automatisch erkennen</option>`];
  for (const s of streams) {
    const badge = s.isLive ? '🔴 LIVE' : '📅 Stream';
    const sel = s.videoId === currentVal ? 'selected' : '';
    options.push(
      `<option value="${escapeHtml(s.videoId)}" ${sel}>${badge}: ${escapeHtml(s.title)} (${escapeHtml(s.videoId)})</option>`
    );
  }
  selectYoutubeStream.innerHTML = options.join('');
}

function updatePlatformStatusUI(states) {
  currentStates = states;
  const mapBtn = {
    twitch: btnConnectTwitch,
    youtube: btnConnectYoutube,
    tiktok: btnConnectTiktok
  };

  let totalViewers = 0;

  for (const plat of ['twitch', 'youtube', 'tiktok']) {
    const st = states[plat] || { status: 'disconnected', viewers: 0 };
    const pill = document.getElementById(`statusPill_${plat}`);
    const txt = document.getElementById(`statusText_${plat}`);
    const viewerEl = document.getElementById(`viewers_${plat}`);
    const errEl = document.getElementById(`err_${plat}`);
    const btn = mapBtn[plat];

    const vCount = Number(st.viewers || 0);
    if (st.status === 'connected') {
      totalViewers += vCount;
    }

    if (plat === 'youtube' && Array.isArray(st.availableStreams) && st.availableStreams.length > 0) {
      updateYoutubeStreamDropdown(st.availableStreams, st.videoId);
    }

    pill.className = `plat-pill ${plat} ${st.status}`;
    if (st.enabled === false) {
      txt.textContent = 'Aus';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = 'Aktivieren';
      btn.classList.remove('disconnect');
      if (errEl) errEl.textContent = '';
    } else if (st.status === 'connected') {
      txt.textContent = st.channel || 'LIVE';
      let extra = `👁️${vCount}`;
      if (plat === 'tiktok' && st.likes > 0) {
        extra += ` ❤️${(st.likes / 1000).toFixed(1)}k`;
      }
      if (viewerEl) viewerEl.textContent = extra;
      btn.textContent = 'Trennen';
      btn.classList.add('disconnect');
      if (errEl) {
        if (st.error) {
          errEl.textContent = st.error;
        } else if (plat === 'youtube' && st.streamTitle) {
          errEl.textContent = st.canWrite
            ? `✅ Verbunden (${st.streamTitle}) — Chat lesen & schreiben aktiv`
            : `✅ Verbunden (${st.streamTitle}) — Nur-Lesen (OAuth2 für Schreiben optional)`;
        } else if (plat === 'tiktok' && st.roomId) {
          errEl.textContent = `Room-ID: ${st.roomId}`;
        } else if (plat === 'twitch') {
          errEl.textContent = st.canWrite
            ? `✅ Verbunden (#${st.channel}) — Chat lesen & schreiben aktiv`
            : `✅ Verbunden (#${st.channel}) — Chat lesen aktiv (Nur-Lesen ohne Chat-Token)`;
        } else {
          errEl.textContent = '';
        }
      }
    } else if (st.status === 'reconnecting') {
      txt.textContent = 'Reconnect...';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = 'Stopp';
      btn.classList.add('disconnect');
      if (errEl && st.error) errEl.textContent = st.error;
    } else if (st.status === 'standby') {
      txt.textContent = 'Standby';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = 'Stopp';
      btn.classList.add('disconnect');
      if (errEl && st.error) errEl.textContent = st.error;
    } else if (st.status === 'connecting') {
      txt.textContent = '...';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = '...';
      btn.classList.remove('disconnect');
    } else if (st.status === 'error') {
      txt.textContent = 'Fehler';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = 'Verbinden';
      btn.classList.remove('disconnect');
      if (errEl && st.error) errEl.textContent = st.error;
    } else {
      txt.textContent = 'Aus';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = plat === 'twitch' ? 'Verbinden' : 'Start / Standby';
      btn.classList.remove('disconnect');
    }
  }

  const totalEl = document.getElementById('totalViewersCount');
  if (totalEl) {
    totalEl.textContent = totalViewers.toLocaleString('de-DE');
  }
}

function applyConfigToForm(cfg) {
  if (!cfg) return;
  inputStreamerName.value = cfg.streamerName || '';
  if (inputKeywordAlerts) inputKeywordAlerts.value = cfg.keywordAlerts || '';
  if (chkKeywordSound) chkKeywordSound.checked = cfg.keywordSound !== false;
  if (clrKeywordHighlight && cfg.keywordColor) clrKeywordHighlight.value = cfg.keywordColor;

  const pCfg = cfg.peripherals || {};
  const selKbMode = document.getElementById('selPerifKeyboardMode');
  if (selKbMode && pCfg.keyboardMode) selKbMode.value = pCfg.keyboardMode;
  if (pCfg.hotkeys) {
    const hkP = document.getElementById('hkPinLast');
    const hkU = document.getElementById('hkUnpin');
    const hkC = document.getElementById('hkClearChat');
    const hkK = document.getElementById('hkToggleCompact');
    if (hkP && pCfg.hotkeys.pinLast) hkP.value = pCfg.hotkeys.pinLast;
    if (hkU && pCfg.hotkeys.unpin) hkU.value = pCfg.hotkeys.unpin;
    if (hkC && pCfg.hotkeys.clearChat) hkC.value = pCfg.hotkeys.clearChat;
    if (hkK && pCfg.hotkeys.toggleCompact) hkK.value = pCfg.hotkeys.toggleCompact;
  }

  chkAutoConnect.checked = cfg.autoConnectOnStart !== false;
  soundAlertsEnabled = cfg.soundAlerts !== false;
  btnSoundToggle.classList.toggle('active', soundAlertsEnabled);
  const chkSpAuto = document.getElementById('chkSpotifyAutoCmd');
  if (chkSpAuto) chkSpAuto.checked = cfg.spotifyAutoCommand !== false;

  const oa = cfg.obsAlerts || {};
  const chkOaEnabled = document.getElementById('chkObsAlertsEnabled');
  if (chkOaEnabled) chkOaEnabled.checked = oa.enabled !== false;
  const selOaAnim = document.getElementById('selObsAlertAnim');
  if (selOaAnim) selOaAnim.value = oa.animation || 'pop';
  const rngOaDur = document.getElementById('rngObsAlertDuration');
  const valOaDur = document.getElementById('valObsAlertDuration');
  if (rngOaDur) {
    const dur = oa.durationSec ?? 5;
    rngOaDur.value = dur;
    if (valOaDur) valOaDur.textContent = `${dur}s`;
  }
  const chkOaSound = document.getElementById('chkObsAlertSound');
  if (chkOaSound) chkOaSound.checked = oa.soundEnabled !== false;
  for (const t of OBS_ALERT_TYPES) {
    const el = document.getElementById(`chkAlert_${t}`);
    if (el) el.checked = oa.types ? oa.types[t] !== false : true;
  }
  savedAlertCustomMedia = oa.customMedia || {};
  const selAmt = document.getElementById('selAlertMediaType');
  const curMedia = savedAlertCustomMedia[selAmt?.value || 'follow'] || {};
  const elAmi = document.getElementById('inputAlertMediaImage');
  const elAma = document.getElementById('inputAlertMediaAudio');
  if (elAmi) elAmi.value = curMedia.imageUrl || '';
  if (elAma) elAma.value = curMedia.audioUrl || '';

  const og = cfg.obsGoals || {};
  const elOgEn = document.getElementById('chkObsGoalEnabled');
  if (elOgEn) elOgEn.checked = og.enabled !== false;
  const elOgT = document.getElementById('inputGoalTitle');
  if (elOgT) elOgT.value = og.title || 'Sub-Goal';
  const elOgC = document.getElementById('inputGoalCurrent');
  if (elOgC) elOgC.value = og.current ?? 0;
  const elOgG = document.getElementById('inputGoalTarget');
  if (elOgG) elOgG.value = og.target ?? 50;
  const elOgB = document.getElementById('clrGoalBar');
  if (elOgB && og.barColor) elOgB.value = og.barColor;
  const elOgAf = document.getElementById('chkGoalAutoFollow');
  if (elOgAf) elOgAf.checked = Boolean(og.autoFollow);
  const elOgAs = document.getElementById('chkGoalAutoSub');
  if (elOgAs) elOgAs.checked = og.autoSub !== false;

  const tts = cfg.tts || {};
  const elTtsEn = document.getElementById('chkTtsEnabled');
  if (elTtsEn) elTtsEn.checked = Boolean(tts.enabled);
  const elTtsAl = document.getElementById('chkTtsAlerts');
  if (elTtsAl) elTtsAl.checked = tts.readAlerts !== false;
  const elTtsCh = document.getElementById('chkTtsChatCmd');
  if (elTtsCh) elTtsCh.checked = tts.readChatCommand !== false;
  const elTtsV = document.getElementById('selTtsVoice');
  if (elTtsV && tts.voiceURI) elTtsV.value = tts.voiceURI;
  const elTtsR = document.getElementById('rngTtsRate');
  const elTtsRv = document.getElementById('valTtsRate');
  if (elTtsR) {
    const r = tts.rate ?? 1.0;
    elTtsR.value = r;
    if (elTtsRv) elTtsRv.textContent = `${Number(r).toFixed(1)}x`;
  }
  const elTtsVol = document.getElementById('rngTtsVol');
  const elTtsVolV = document.getElementById('valTtsVol');
  if (elTtsVol) {
    const v = tts.volume ?? 0.9;
    elTtsVol.value = v;
    if (elTtsVolV) elTtsVolV.textContent = `${Math.round(Number(v) * 100)}%`;
  }

  const ow = cfg.obsWs || {};
  const elOwHost = document.getElementById('inputObsWsHost');
  const elOwPort = document.getElementById('inputObsWsPort');
  const elOwPass = document.getElementById('inputObsWsPass');
  const elOwMic = document.getElementById('inputObsWsMic');
  if (elOwHost) elOwHost.value = ow.host || '127.0.0.1';
  if (elOwPort) elOwPort.value = ow.port || 4455;
  if (elOwPass) elOwPass.value = ow.password || '';
  if (elOwMic) elOwMic.value = ow.micName || '';

  const ct = cfg.chatTimers || {};
  const elCtEn = document.getElementById('chkTimerEnabled');
  const elCtInt = document.getElementById('numTimerInterval');
  const elCtMsg = document.getElementById('txtTimerMessages');
  if (elCtEn) elCtEn.checked = Boolean(ct.enabled);
  if (elCtInt) elCtInt.value = ct.intervalMin ?? 15;
  if (elCtMsg) elCtMsg.value = Array.isArray(ct.messages) ? ct.messages.join('\n') : '';

  const am = cfg.autoMod || {};
  const elAmEn = document.getElementById('chkAutoModEnabled');
  const elAmL = document.getElementById('chkAutoModLinks');
  const elAmC = document.getElementById('chkAutoModCaps');
  const elAmS = document.getElementById('chkAutoModSymbols');
  const elAmE = document.getElementById('chkAutoModExemptMods');
  const elAmB = document.getElementById('inputAutoModBlacklist');
  const elAmT = document.getElementById('selAutoModTimeout');
  if (elAmEn) elAmEn.checked = Boolean(am.enabled);
  if (elAmL) elAmL.checked = am.blockLinks !== false;
  if (elAmC) elAmC.checked = Boolean(am.blockCaps);
  if (elAmS) elAmS.checked = Boolean(am.blockSymbols);
  if (elAmE) elAmE.checked = am.exemptMods !== false;
  if (elAmB) elAmB.value = am.blacklist || '';
  if (elAmT) elAmT.value = String(am.timeoutSec ?? 60);

  const cc = cfg.customCommands || {};
  const elCcEn = document.getElementById('chkCustomCmdsEnabled');
  const elCcCd = document.getElementById('numCustomCmdCooldown');
  const elCcRules = document.getElementById('txtCustomCmdRules');
  if (elCcEn) elCcEn.checked = Boolean(cc.enabled);
  if (elCcCd) elCcCd.value = cc.cooldownSec ?? 10;
  if (elCcRules) elCcRules.value = Array.isArray(cc.rules) ? cc.rules.join('\n') : '';

  hideBotsEnabled = Boolean(cfg.hideBots);
  collapseSpamEnabled = cfg.collapseSpam !== false;
  btnHideBots?.classList.toggle('active', hideBotsEnabled);
  btnCollapseSpam?.classList.toggle('active', collapseSpamEnabled);

  const appCfg = cfg.appearance || {};
  if (selLayoutMode) selLayoutMode.value = appCfg.layoutMode || 'inline';
  if (rngNameSize) rngNameSize.value = appCfg.nameFontSize ?? 13;
  if (rngMsgSize) rngMsgSize.value = appCfg.msgFontSize ?? 13.5;
  if (rngMaxNameLen) rngMaxNameLen.value = appCfg.maxNameLength ?? 16;
  if (rngMsgPadding) rngMsgPadding.value = appCfg.msgPadding ?? 5;
  if (rngMaxDomMsgs) rngMaxDomMsgs.value = appCfg.maxDomMessages ?? 150;
  if (chkShowPlatIcons) chkShowPlatIcons.checked = appCfg.showPlatformIcons !== false;
  if (chkShowTimestamps) chkShowTimestamps.checked = appCfg.showTimestamps !== false;
  if (selPlatStyle) selPlatStyle.value = cfg.platformIndicatorStyle || 'icon_only';
  if (selUserColorMode) selUserColorMode.value = appCfg.usernameColorMode || 'user';
  if (chkShowSeparator) chkShowSeparator.checked = appCfg.showSeparator !== false;
  if (clrSeparator) clrSeparator.value = appCfg.sepColor || '#ffffff';
  if (rngSepOpacity) rngSepOpacity.value = appCfg.sepOpacity ?? 8;
  if (rngSepSpacing) rngSepSpacing.value = appCfg.sepSpacing ?? 0;
  if (clrChatBg) clrChatBg.value = appCfg.bgColor || '#0b0f19';
  if (rngBgOpacity) rngBgOpacity.value = appCfg.bgOpacity ?? 100;
  if (rngObsBgOpacity) rngObsBgOpacity.value = appCfg.obsBgOpacity ?? 60;

  // Restore Section 6 Event Highlight Settings
  const evH = appCfg.eventHighlights || {};
  if (selEventStyle && evH.style) selEventStyle.value = evH.style;
  if (rngEventIntensity && typeof evH.intensity === 'number') rngEventIntensity.value = evH.intensity;
  if (evH.types) {
    for (const t of EVENT_TYPES) {
      if (evH.types[t]) {
        if (evCheckboxes[t]) evCheckboxes[t].checked = evH.types[t].enabled !== false;
        if (evColors[t] && evH.types[t].color) evColors[t].value = evH.types[t].color;
      }
    }
  }

  const emCfg = cfg.emoteSettings || {};
  if (chkEmote7tv) chkEmote7tv.checked = emCfg.enable7tv !== false;
  if (chkEmoteBttv) chkEmoteBttv.checked = emCfg.enableBttv !== false;
  if (chkEmoteFfz) chkEmoteFfz.checked = emCfg.enableFfz !== false;
  if (chkEmoteTwitch) chkEmoteTwitch.checked = emCfg.enableTwitchNative !== false;
  if (chkEmoteYoutube) chkEmoteYoutube.checked = emCfg.enableYoutubeNative !== false;
  if (chkEmoteTiktok) chkEmoteTiktok.checked = emCfg.enableTiktokNative !== false;
  if (chkAnimateEmotes) chkAnimateEmotes.checked = emCfg.animateEmotes !== false;

  chkEnableTwitch.checked = cfg.twitchEnabled !== false;
  chkEnableYoutube.checked = cfg.youtubeEnabled !== false;
  chkEnableTiktok.checked = cfg.tiktokEnabled !== false;

  document.getElementById('card_twitch')?.classList.toggle('disabled-card', !chkEnableTwitch.checked);
  document.getElementById('card_youtube')?.classList.toggle('disabled-card', !chkEnableYoutube.checked);
  document.getElementById('card_tiktok')?.classList.toggle('disabled-card', !chkEnableTiktok.checked);

  inputTwitchChannel.value = cfg.twitchChannel || '';
  inputTwitchUser.value = cfg.twitchUsername || '';
  inputTwitchToken.value = cfg.twitchToken || '';
  inputYoutubeChannel.value = cfg.youtubeChannel || '';
  inputYoutubeVideoId.value = cfg.youtubeVideoId || '';
  const ytOAuth = cfg.youtubeOAuth || {};
  const elYtCid = document.getElementById('inputYtClientId');
  const elYtCsec = document.getElementById('inputYtClientSecret');
  if (elYtCid) elYtCid.value = ytOAuth.clientId || '';
  if (elYtCsec) elYtCsec.value = ytOAuth.clientSecret || '';
  updateYoutubeOAuthUI(ytOAuth);
  inputTiktokChannel.value = cfg.tiktokChannel || '';
  inputTiktokRoomId.value = cfg.tiktokRoomId || '';

  applyCompactMode(Boolean(cfg.compactChat));
  applyAppearanceToDOM(false);
}

// Section 8 Backup, Restore & Reset Buttons
btnExportConfig?.addEventListener('click', async () => {
  await window.omnichat.saveProfile(getFormConfig());
  const res = await window.omnichat.exportConfig();
  if (res.ok) {
    btnExportConfig.textContent = '✅ Gesichert!';
    setTimeout(() => {
      btnExportConfig.textContent = '📤 Exportieren';
    }, 1800);
  }
});

btnImportConfig?.addEventListener('click', async () => {
  const res = await window.omnichat.importConfig();
  if (res.ok && res.config) {
    applyConfigToForm(res.config);
    btnImportConfig.textContent = '✅ Geladen!';
    setTimeout(() => {
      btnImportConfig.textContent = '📥 Importieren';
    }, 1800);
  }
});

btnResetDefaults?.addEventListener('click', async () => {
  const res = await window.omnichat.resetDefaults();
  if (res.ok && res.config) {
    applyConfigToForm(res.config);
    btnResetDefaults.textContent = '✅ Standard!';
    setTimeout(() => {
      btnResetDefaults.textContent = '↺ Standard';
    }, 1800);
  }
});

// Section 8 Live Performance & Memory Monitor (runs every 2 seconds with minimal overhead)
async function pollPerformanceStats() {
  try {
    const now = Date.now();
    recentMsgTimestamps = recentMsgTimestamps.filter((t) => now - t < 5000);
    const ratePerSec = (recentMsgTimestamps.length / 5).toFixed(1);
    const maxDom = getMaxDomMessagesLimit();

    if (perfRateVal) perfRateVal.textContent = `${ratePerSec} /s`;
    if (perfDomVal) {
      const domCount = emptyState.parentElement === chatFeed ? 0 : chatFeed.children.length;
      perfDomVal.textContent = `${domCount} / ${maxDom}`;
    }

    if (window.omnichat.getPerfStats) {
      const st = await window.omnichat.getPerfStats();
      if (st?.ok) {
        if (perfRamVal) perfRamVal.textContent = `${st.ramMb} MB`;
        if (perfEmoteVal) perfEmoteVal.textContent = `${st.cachedEmotes}`;
      }
    }
  } catch (e) {}
}
setInterval(pollPerformanceStats, 2000);
setTimeout(pollPerformanceStats, 600);

let streamDeckBaseUrl = 'http://127.0.0.1:4588/api/streamdeck';
const sdActionsList = document.getElementById('sdActionsList');
const inputSdCustomText = document.getElementById('inputSdCustomText');
const inputSdCustomUrl = document.getElementById('inputSdCustomUrl');
const btnCopySdCustom = document.getElementById('btnCopySdCustom');

function updateSdCustomUrl() {
  if (!inputSdCustomUrl) return;
  const txt = (inputSdCustomText?.value || '').trim() || 'GG!';
  inputSdCustomUrl.value = `${streamDeckBaseUrl}/send?text=${encodeURIComponent(txt)}`;
}

inputSdCustomText?.addEventListener('input', updateSdCustomUrl);
btnCopySdCustom?.addEventListener('click', () => {
  if (!inputSdCustomUrl) return;
  navigator.clipboard.writeText(inputSdCustomUrl.value);
  btnCopySdCustom.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopySdCustom.textContent = 'Kopieren';
  }, 1500);
});

sdActionsList?.querySelectorAll('.sd-row').forEach((row) => {
  const pathPart = row.dataset.sdPath || '';
  const copyBtn = row.querySelector('.sd-copy');
  const testBtn = row.querySelector('.sd-test');

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(`${streamDeckBaseUrl}${pathPart}`);
    copyBtn.textContent = '✅';
    setTimeout(() => {
      copyBtn.textContent = '📋 URL';
    }, 1400);
  });

  testBtn?.addEventListener('click', async () => {
    try {
      const res = await fetch(`${streamDeckBaseUrl}${pathPart}`);
      const json = await res.json();
      testBtn.textContent = json.ok ? '✅' : '⚠️';
    } catch (e) {
      testBtn.textContent = '❌';
    }
    setTimeout(() => {
      testBtn.textContent = '▶ Test';
    }, 1400);
  });
});

// --- PERIPHERAL SELECTION (SEPARATE 2ND KEYBOARD, MOUSE & GLOBAL HOTKEYS) ---
const btnScanPeripherals = document.getElementById('btnScanPeripherals');
const selPerifKeyboard = document.getElementById('selPerifKeyboard');
const selPerifKeyboardMode = document.getElementById('selPerifKeyboardMode');
const btnConnectHidKeyboard = document.getElementById('btnConnectHidKeyboard');
const selPerifMouse = document.getElementById('selPerifMouse');
const btnConnectHidMouse = document.getElementById('btnConnectHidMouse');
const perifLiveStatus = document.getElementById('perifLiveStatus');
const btnSaveHotkeys = document.getElementById('btnSaveHotkeys');

let activeHidKeyboard = null;
let activeHidMouse = null;
let hidTypingBuffer = '';
let prevHidKeys = new Set();
let prevMouseButtons = 0;

// Standard USB HID Keyboard Usage IDs (0x04..0x2C + F1..F4 + Numpad)
const HID_KEY_CHARS = {
  0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e', 0x09: 'f', 0x0a: 'g',
  0x0b: 'h', 0x0c: 'i', 0x0d: 'j', 0x0e: 'k', 0x0f: 'l', 0x10: 'm', 0x11: 'n',
  0x12: 'o', 0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't', 0x18: 'u',
  0x19: 'v', 0x1a: 'w', 0x1b: 'x', 0x1c: 'y', 0x1d: 'z',
  0x1e: '1', 0x1f: '2', 0x20: '3', 0x21: '4', 0x22: '5', 0x23: '6', 0x24: '7',
  0x25: '8', 0x26: '9', 0x27: '0', 0x2c: ' ', 0x2d: '-', 0x36: ',', 0x37: '.',
  0x59: '1', 0x5a: '2', 0x5b: '3', 0x5c: '4', 0x5d: '5', 0x5e: '6', 0x5f: '7',
  0x60: '8', 0x61: '9', 0x62: '0'
};

function setPerifStatus(msg) {
  if (perifLiveStatus) perifLiveStatus.textContent = msg;
}

async function scanPeripherals() {
  if (!window.omnichat.listPeripherals) return;
  if (btnScanPeripherals) btnScanPeripherals.textContent = '⏳';
  const res = await window.omnichat.listPeripherals();
  if (btnScanPeripherals) btnScanPeripherals.textContent = '🔍 Scannen';
  if (!res?.ok || !Array.isArray(res.devices)) return;

  const kbOpts = [`<option value="">-- Tastatur auswählen (${res.devices.length} Geräte) --</option>`];
  const msOpts = [`<option value="">-- Maus auswählen (${res.devices.length} Geräte) --</option>`];

  for (const d of res.devices) {
    const val = JSON.stringify({ name: d.name, vendorId: d.vendorId, productId: d.productId });
    const label = `${d.name}${d.vendorId ? ` (VID:${d.vendorId.toString(16).toUpperCase()})` : ''}`;
    if (d.kind === 'mouse') {
      msOpts.push(`<option value='${escapeHtml(val)}'>🖱️ ${escapeHtml(label)}</option>`);
    } else {
      kbOpts.push(`<option value='${escapeHtml(val)}'>⌨️ ${escapeHtml(label)}</option>`);
    }
  }

  // Also allow picking any listed USB device in either dropdown
  for (const d of res.devices) {
    const val = JSON.stringify({ name: d.name, vendorId: d.vendorId, productId: d.productId });
    const label = `${d.name}${d.vendorId ? ` (VID:${d.vendorId.toString(16).toUpperCase()})` : ''}`;
    if (d.kind !== 'mouse') {
      msOpts.push(`<option value='${escapeHtml(val)}'>🔌 ${escapeHtml(label)}</option>`);
    } else {
      kbOpts.push(`<option value='${escapeHtml(val)}'>🔌 ${escapeHtml(label)}</option>`);
    }
  }

  if (selPerifKeyboard) selPerifKeyboard.innerHTML = kbOpts.join('');
  if (selPerifMouse) selPerifMouse.innerHTML = msOpts.join('');
}

btnScanPeripherals?.addEventListener('click', scanPeripherals);
setTimeout(scanPeripherals, 900);

btnConnectHidKeyboard?.addEventListener('click', async () => {
  if (activeHidKeyboard) {
    try {
      await activeHidKeyboard.close();
    } catch (e) {}
    activeHidKeyboard = null;
    btnConnectHidKeyboard.textContent = '🔌 Verbinden';
    btnConnectHidKeyboard.classList.remove('disconnect');
    setPerifStatus('ℹ️ Zweittastatur getrennt.');
    return;
  }

  if (!navigator.hid) {
    setPerifStatus('❌ WebHID wird in dieser Umgebung nicht unterstützt.');
    return;
  }

  let target = null;
  try {
    if (selPerifKeyboard?.value) target = JSON.parse(selPerifKeyboard.value);
  } catch (e) {}
  await window.omnichat.setHidTarget(target);

  try {
    const filters = target?.vendorId
      ? [{ vendorId: target.vendorId, ...(target.productId ? { productId: target.productId } : {}) }]
      : [{ usagePage: 0x01, usage: 0x06 }];
    const devices = await navigator.hid.requestDevice({ filters });
    if (!devices || devices.length === 0) {
      setPerifStatus('⚠️ Keine Zweittastatur ausgewählt.');
      return;
    }
    const dev = devices[0];
    await dev.open();
    activeHidKeyboard = dev;
    prevHidKeys.clear();
    hidTypingBuffer = '';
    btnConnectHidKeyboard.textContent = '⏹ Trennen';
    btnConnectHidKeyboard.classList.add('disconnect');
    setPerifStatus(`✅ Zweittastatur aktiv: ${dev.productName || 'USB HID Keyboard'}`);

    dev.addEventListener('inputreport', async (event) => {
      const bytes = new Uint8Array(event.data.buffer);
      const modifier = bytes[0] || 0;
      const shift = (modifier & 0x22) !== 0;
      const currentKeys = new Set();
      for (let i = 2; i < Math.min(bytes.length, 8); i++) {
        if (bytes[i] > 0) currentKeys.add(bytes[i]);
      }

      const mode = selPerifKeyboardMode?.value || 'chat_and_macros';

      for (const code of currentKeys) {
        if (prevHidKeys.has(code)) continue;
        // F1..F4 or 1..4 in macros_only mode
        if (code === 0x3a || (mode === 'macros_only' && code === 0x1e)) {
          await window.omnichat.triggerPeripheralAction({ action: 'pin-last' });
          setPerifStatus('📌 Zweittastatur: Letzte Nachricht in OBS gepinnt!');
        } else if (code === 0x3b || (mode === 'macros_only' && code === 0x1f)) {
          await window.omnichat.triggerPeripheralAction({ action: 'unpin' });
          setPerifStatus('❌ Zweittastatur: OBS-Pin ausgeblendet.');
        } else if (code === 0x3c || (mode === 'macros_only' && code === 0x20)) {
          await window.omnichat.triggerPeripheralAction({ action: 'clear-chat' });
          setPerifStatus('🗑️ Zweittastatur: Chat geleert.');
        } else if (code === 0x3d || (mode === 'macros_only' && code === 0x21)) {
          await window.omnichat.triggerPeripheralAction({ action: 'toggle-compact' });
          setPerifStatus('↕️ Zweittastatur: Kompakt-Modus umgeschaltet.');
        } else if (mode === 'chat_and_macros') {
          if (code === 0x28 || code === 0x58) {
            // Enter -> send buffered chat message!
            const toSend = hidTypingBuffer.trim();
            hidTypingBuffer = '';
            if (toSend) {
              await window.omnichat.triggerPeripheralAction({ action: 'send', text: toSend });
              setPerifStatus(`✅ Von Zweittastatur gesendet: "${toSend}"`);
            }
          } else if (code === 0x2a) {
            hidTypingBuffer = hidTypingBuffer.slice(0, -1);
            setPerifStatus(`⌨️ Zweittastatur-Entwurf: "${hidTypingBuffer}"`);
          } else if (HID_KEY_CHARS[code]) {
            const ch = shift ? HID_KEY_CHARS[code].toUpperCase() : HID_KEY_CHARS[code];
            hidTypingBuffer += ch;
            setPerifStatus(`⌨️ Zweittastatur-Entwurf: "${hidTypingBuffer}" (Enter = Senden)`);
          }
        }
      }
      prevHidKeys = currentKeys;
    });
  } catch (err) {
    setPerifStatus(`⚠️ OS-Schutz für direkte Tastatur (${err.message}). Tipp: Nutze ein USB-Numpad oder die Globalen Hotkeys darunter.`);
  }
});

btnConnectHidMouse?.addEventListener('click', async () => {
  if (activeHidMouse) {
    try {
      await activeHidMouse.close();
    } catch (e) {}
    activeHidMouse = null;
    btnConnectHidMouse.textContent = '🖱️ Verbinden';
    btnConnectHidMouse.classList.remove('disconnect');
    setPerifStatus('ℹ️ Zweitmaus getrennt.');
    return;
  }

  if (!navigator.hid) {
    setPerifStatus('❌ WebHID wird in dieser Umgebung nicht unterstützt.');
    return;
  }

  let target = null;
  try {
    if (selPerifMouse?.value) target = JSON.parse(selPerifMouse.value);
  } catch (e) {}
  await window.omnichat.setHidTarget(target);

  try {
    const filters = target?.vendorId
      ? [{ vendorId: target.vendorId, ...(target.productId ? { productId: target.productId } : {}) }]
      : [{ usagePage: 0x01, usage: 0x02 }];
    const devices = await navigator.hid.requestDevice({ filters });
    if (!devices || devices.length === 0) {
      setPerifStatus('⚠️ Keine Zweitmaus ausgewählt.');
      return;
    }
    const dev = devices[0];
    await dev.open();
    activeHidMouse = dev;
    prevMouseButtons = 0;
    btnConnectHidMouse.textContent = '⏹ Trennen';
    btnConnectHidMouse.classList.add('disconnect');
    setPerifStatus(`✅ Zweitmaus aktiv: ${dev.productName || 'USB HID Mouse'} (Scroll = Chat, Links = Pin, Rechts = Unpin)`);

    dev.addEventListener('inputreport', async (event) => {
      const view = new DataView(event.data.buffer);
      const buttons = view.byteLength > 0 ? view.getUint8(0) : 0;
      const wheel = view.byteLength >= 4 ? view.getInt8(3) : 0;

      if (wheel !== 0 && chatFeed) {
        chatFeed.scrollTop -= wheel * 42;
      }
      if ((buttons & 1) && !(prevMouseButtons & 1)) {
        await window.omnichat.triggerPeripheralAction({ action: 'pin-last' });
        setPerifStatus('📌 Zweitmaus-Klick: Letzte Nachricht in OBS gepinnt!');
      } else if ((buttons & 2) && !(prevMouseButtons & 2)) {
        await window.omnichat.triggerPeripheralAction({ action: 'unpin' });
        setPerifStatus('❌ Zweitmaus-Rechtsklick: OBS-Pin ausgeblendet.');
      }
      prevMouseButtons = buttons;
    });
  } catch (err) {
    setPerifStatus(`⚠️ Zweitmaus-Zugriff blockiert (${err.message}).`);
  }
});

btnSaveHotkeys?.addEventListener('click', async () => {
  const payload = {
    keyboardMode: selPerifKeyboardMode?.value || 'chat_and_macros',
    globalHotkeysEnabled: true,
    hotkeys: {
      pinLast: document.getElementById('hkPinLast')?.value.trim() || 'CommandOrControl+Alt+P',
      unpin: document.getElementById('hkUnpin')?.value.trim() || 'CommandOrControl+Alt+U',
      clearChat: document.getElementById('hkClearChat')?.value.trim() || 'CommandOrControl+Alt+C',
      toggleCompact: document.getElementById('hkToggleCompact')?.value.trim() || 'CommandOrControl+Alt+K'
    }
  };
  await window.omnichat.updateGlobalHotkeys(payload);
  btnSaveHotkeys.textContent = '✅ Globale Hotkeys aktiv!';
  setPerifStatus('✅ Globale Hotkeys registriert (funktionieren auch während Vollbildspielen).');
  setTimeout(() => {
    btnSaveHotkeys.textContent = '💾 Globale Hotkeys aktivieren';
  }, 1800);
});

// --- SPOTIFY LIVE & !SONG BOT HANDLERS ---
const spSidebarTitle = document.getElementById('spSidebarTitle');
const spSidebarArtist = document.getElementById('spSidebarArtist');
const inputSpotifyObsUrl = document.getElementById('inputSpotifyObsUrl');
const btnCopySpotifyObs = document.getElementById('btnCopySpotifyObs');
const chkSpotifyAutoCmd = document.getElementById('chkSpotifyAutoCmd');

function updateSpotifyUI(track) {
  if (!spSidebarTitle || !spSidebarArtist) return;
  if (!track || !track.running || !track.title) {
    spSidebarTitle.textContent = 'Spotify nicht aktiv';
    spSidebarArtist.textContent = 'Starte Spotify auf deinem PC/Mac';
    return;
  }
  const icon = track.playing ? '▶️' : '⏸️';
  spSidebarTitle.textContent = `${icon} ${track.title}`;
  spSidebarArtist.textContent = track.artist || 'Spotify';
}

document.getElementById('btnSpPrev')?.addEventListener('click', () => window.omnichat.spotifyControl('previous'));
document.getElementById('btnSpPlayPause')?.addEventListener('click', () => window.omnichat.spotifyControl('playpause'));
document.getElementById('btnSpNext')?.addEventListener('click', () => window.omnichat.spotifyControl('next'));
document.getElementById('btnSpAnnounce')?.addEventListener('click', async () => {
  const res = await window.omnichat.spotifyControl('announce');
  if (!res?.ok && res?.error) alert(res.error);
});

chkSpotifyAutoCmd?.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});

btnCopySpotifyObs?.addEventListener('click', () => {
  if (!inputSpotifyObsUrl) return;
  navigator.clipboard.writeText(inputSpotifyObsUrl.value);
  btnCopySpotifyObs.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopySpotifyObs.textContent = 'Widget-URL kopieren';
  }, 1500);
});

const imgTabletQr = document.getElementById('imgTabletQr');
const inputTabletUrl = document.getElementById('inputTabletUrl');
const btnCopyTabletUrl = document.getElementById('btnCopyTabletUrl');

btnCopyTabletUrl?.addEventListener('click', () => {
  if (!inputTabletUrl) return;
  navigator.clipboard.writeText(inputTabletUrl.value);
  btnCopyTabletUrl.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopyTabletUrl.textContent = '📋 Tablet-Link kopieren';
  }, 1500);
});

// --- OBS ALERT-BOX OVERLAY HANDLERS ---
const inputObsAlertsUrl = document.getElementById('inputObsAlertsUrl');
const btnCopyObsAlerts = document.getElementById('btnCopyObsAlerts');
const btnTestObsAlert = document.getElementById('btnTestObsAlert');

btnCopyObsAlerts?.addEventListener('click', () => {
  if (!inputObsAlertsUrl) return;
  navigator.clipboard.writeText(inputObsAlertsUrl.value);
  btnCopyObsAlerts.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopyObsAlerts.textContent = 'Alert-URL kopieren';
  }, 1500);
});

btnTestObsAlert?.addEventListener('click', async () => {
  const activeType = OBS_ALERT_TYPES.find((t) => document.getElementById(`chkAlert_${t}`)?.checked) || 'sub';
  await window.omnichat.testObsAlert(activeType);
  btnTestObsAlert.textContent = '✅ Gesendet!';
  setTimeout(() => {
    btnTestObsAlert.textContent = '▶ Test-Alert';
  }, 1400);
});

const rngObsAlertDuration = document.getElementById('rngObsAlertDuration');
const valObsAlertDuration = document.getElementById('valObsAlertDuration');
rngObsAlertDuration?.addEventListener('input', () => {
  if (valObsAlertDuration) valObsAlertDuration.textContent = `${rngObsAlertDuration.value}s`;
});
rngObsAlertDuration?.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});

[
  'chkObsAlertsEnabled',
  'selObsAlertAnim',
  'chkObsAlertSound',
  ...OBS_ALERT_TYPES.map((t) => `chkAlert_${t}`)
].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

// --- CUSTOM ALERT MEDIA HANDLERS ---
const selAlertMediaType = document.getElementById('selAlertMediaType');
const inputAlertMediaImage = document.getElementById('inputAlertMediaImage');
const inputAlertMediaAudio = document.getElementById('inputAlertMediaAudio');

selAlertMediaType?.addEventListener('change', () => {
  const m = savedAlertCustomMedia[selAlertMediaType.value] || {};
  if (inputAlertMediaImage) inputAlertMediaImage.value = m.imageUrl || '';
  if (inputAlertMediaAudio) inputAlertMediaAudio.value = m.audioUrl || '';
});

[inputAlertMediaImage, inputAlertMediaAudio].forEach((el) => {
  el?.addEventListener('change', () => {
    const t = selAlertMediaType?.value || 'follow';
    savedAlertCustomMedia[t] = {
      imageUrl: inputAlertMediaImage?.value.trim() || '',
      audioUrl: inputAlertMediaAudio?.value.trim() || ''
    };
    window.omnichat.saveProfile(getFormConfig());
  });
});

// --- OBS GOAL-BAR & MULTISTREAM POLL HANDLERS ---
const inputObsGoalsUrl = document.getElementById('inputObsGoalsUrl');
const btnCopyObsGoals = document.getElementById('btnCopyObsGoals');
const inputObsPollUrl = document.getElementById('inputObsPollUrl');
const btnCopyObsPoll = document.getElementById('btnCopyObsPoll');
const pollPreviewStatus = document.getElementById('pollPreviewStatus');

function bindCopyBtn(btn, inputEl, defaultLabel) {
  btn?.addEventListener('click', () => {
    if (!inputEl) return;
    navigator.clipboard.writeText(inputEl.value);
    btn.textContent = '✅';
    setTimeout(() => {
      btn.textContent = defaultLabel;
    }, 1400);
  });
}
bindCopyBtn(btnCopyObsGoals, inputObsGoalsUrl, 'Goal-URL');
bindCopyBtn(btnCopyObsPoll, inputObsPollUrl, 'Poll-URL');

[
  'chkObsGoalEnabled',
  'inputGoalTitle',
  'clrGoalBar',
  'inputGoalCurrent',
  'inputGoalTarget',
  'chkGoalAutoFollow',
  'chkGoalAutoSub'
].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

function updatePollPreviewUI(poll) {
  const btnVis = document.getElementById('btnPollToggleVis');
  if (btnVis) {
    btnVis.textContent = poll && poll.visible === false ? '👁️ Einblenden' : '👁️ Ausblenden';
  }
  if (!pollPreviewStatus) return;
  if (!poll || (!poll.active && !poll.visibleWhenStopped)) {
    pollPreviewStatus.textContent = 'Keine aktive Umfrage';
    return;
  }
  const visNote = poll.visible === false ? ' • 🙈 Ausgeblendet' : '';
  const summary = (poll.options || []).map((o, i) => `${i + 1}. ${o.label}: ${o.votes}`).join(' • ');
  pollPreviewStatus.textContent = `${poll.active ? '🟢 Aktiv' : '⏹ Beendet'}${visNote} (${poll.totalVotes} Stimmen) — ${summary}`;
}

document.getElementById('btnPollStart')?.addEventListener('click', async () => {
  const question = document.getElementById('inputPollQuestion')?.value.trim() || 'Was sollen wir spielen?';
  const options = document.getElementById('inputPollOptions')?.value.trim() || 'Option A, Option B';
  const res = await window.omnichat.pollAction({ action: 'start', question, options });
  if (!res?.ok && res?.error) alert(res.error);
});

document.getElementById('btnPollStop')?.addEventListener('click', () => {
  window.omnichat.pollAction({ action: 'stop' });
});

document.getElementById('btnPollToggleVis')?.addEventListener('click', () => {
  window.omnichat.pollAction({ action: 'toggle-visibility' });
});

document.getElementById('btnPollReset')?.addEventListener('click', () => {
  window.omnichat.pollAction({ action: 'reset' });
});

// --- TEXT-TO-SPEECH (TTS) ENGINE ---
const ttsQueue = [];
let ttsSpeaking = false;

function populateTtsVoices() {
  const sel = document.getElementById('selTtsVoice');
  if (!sel || typeof speechSynthesis === 'undefined') return;
  const currentVal = sel.value;
  const voices = speechSynthesis.getVoices() || [];
  sel.innerHTML = '<option value="">System-Standardstimme</option>';
  voices.forEach((v) => {
    const opt = document.createElement('option');
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} (${v.lang})`;
    sel.appendChild(opt);
  });
  if (currentVal) sel.value = currentVal;
}

if (typeof speechSynthesis !== 'undefined') {
  populateTtsVoices();
  speechSynthesis.onvoiceschanged = populateTtsVoices;
}

function processTtsQueue() {
  if (ttsSpeaking || ttsQueue.length === 0 || typeof speechSynthesis === 'undefined') return;
  const cfg = getTtsSettings();
  if (!cfg.enabled && !ttsQueue[0]._forceTest) {
    ttsQueue.length = 0;
    return;
  }
  const item = ttsQueue.shift();
  ttsSpeaking = true;
  const utter = new SpeechSynthesisUtterance(String(item.text || '').slice(0, cfg.maxLength || 180));
  utter.rate = cfg.rate || 1.0;
  utter.volume = cfg.volume ?? 0.9;
  if (cfg.voiceURI) {
    const match = (speechSynthesis.getVoices() || []).find((v) => v.voiceURI === cfg.voiceURI);
    if (match) utter.voice = match;
  }
  const done = () => {
    ttsSpeaking = false;
    processTtsQueue();
  };
  utter.onend = done;
  utter.onerror = done;
  speechSynthesis.speak(utter);
}

function enqueueTts(text, forceTest = false) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean || typeof speechSynthesis === 'undefined') return;
  if (ttsQueue.length > 20) ttsQueue.shift();
  ttsQueue.push({ text: clean, _forceTest: forceTest });
  processTtsQueue();
}

function skipTts() {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  ttsSpeaking = false;
  processTtsQueue();
}

function clearTtsQueue() {
  ttsQueue.length = 0;
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  ttsSpeaking = false;
}

const rngTtsRate = document.getElementById('rngTtsRate');
const valTtsRate = document.getElementById('valTtsRate');
const rngTtsVol = document.getElementById('rngTtsVol');
const valTtsVol = document.getElementById('valTtsVol');

rngTtsRate?.addEventListener('input', () => {
  if (valTtsRate) valTtsRate.textContent = `${Number(rngTtsRate.value).toFixed(1)}x`;
});
rngTtsVol?.addEventListener('input', () => {
  if (valTtsVol) valTtsVol.textContent = `${Math.round(Number(rngTtsVol.value) * 100)}%`;
});

['chkTtsEnabled', 'chkTtsAlerts', 'chkTtsChatCmd', 'selTtsVoice', 'rngTtsRate', 'rngTtsVol'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

document.getElementById('btnTtsTest')?.addEventListener('click', () => {
  enqueueTts('Hallo Stream! Text-to-Speech ist aktiv und funktioniert.', true);
});
document.getElementById('btnTtsSkip')?.addEventListener('click', skipTts);
document.getElementById('btnTtsClear')?.addEventListener('click', clearTtsQueue);

// IPC Listeners
window.omnichat.onPollUpdated?.((poll) => updatePollPreviewUI(poll));
window.omnichat.onGoalsUpdated?.((goals) => {
  const elOgC = document.getElementById('inputGoalCurrent');
  if (elOgC && goals) elOgC.value = goals.current ?? 0;
});

window.omnichat.onInitState((data) => {
  if (data.streamDeckUrl) {
    streamDeckBaseUrl = data.streamDeckUrl;
    updateSdCustomUrl();
  }
  if (Array.isArray(data.tabletTargets) && data.tabletTargets.length > 0) {
    const selNet = document.getElementById('selTabletNet');
    if (selNet) {
      selNet.innerHTML = '';
      data.tabletTargets.forEach((t, idx) => {
        const opt = document.createElement('option');
        opt.value = String(idx);
        opt.textContent = t.label;
        selNet.appendChild(opt);
      });
      selNet.classList.toggle('hidden', data.tabletTargets.length <= 1);
      selNet.onchange = () => {
        const chosen = data.tabletTargets[parseInt(selNet.value, 10)] || data.tabletTargets[0];
        if (chosen) {
          if (inputTabletUrl) inputTabletUrl.value = chosen.url;
          if (imgTabletQr && chosen.qrDataUrl) {
            imgTabletQr.src = chosen.qrDataUrl;
            imgTabletQr.classList.remove('hidden');
          }
        }
      };
    }
  }
  if (data.tabletUrl && inputTabletUrl) {
    inputTabletUrl.value = data.tabletUrl;
  }
  if (data.tabletQrDataUrl && imgTabletQr) {
    imgTabletQr.src = data.tabletQrDataUrl;
    imgTabletQr.classList.remove('hidden');
  }
  if (data.obsAlertsUrl && inputObsAlertsUrl) {
    inputObsAlertsUrl.value = data.obsAlertsUrl;
  }
  if (data.obsGoalsUrl && inputObsGoalsUrl) {
    inputObsGoalsUrl.value = data.obsGoalsUrl;
  }
  if (data.obsPollUrl && inputObsPollUrl) {
    inputObsPollUrl.value = data.obsPollUrl;
  }
  if (data.activePoll) {
    updatePollPreviewUI(data.activePoll);
  }
  if (data.obsWsState) {
    updateObsWsUI(data.obsWsState);
  }
  if (data.spotifyObsUrl && inputSpotifyObsUrl) {
    inputSpotifyObsUrl.value = data.spotifyObsUrl;
  }
  if (data.spotifyTrack) {
    updateSpotifyUI(data.spotifyTrack);
  }
  if (data.config) {
    applyConfigToForm(data.config);
  }
  if (Array.isArray(data.diagnosticLogs)) {
    diagLogs = data.diagnosticLogs;
    renderDiagnosticLogs();
  }
  if (data.obsUrl) {
    inputObsUrl.value = data.obsUrl;
  }
  if (data.obsDockUrl && inputObsDockUrl) {
    inputObsDockUrl.value = data.obsDockUrl;
  }
  if (data.isStandaloneWindow || location.search.includes('standalone=1')) {
    sidebar.classList.add('hidden');
    btnPopoutChat?.classList.add('hidden');
    btnPinWindow.classList.toggle('active', Boolean(data.isAlwaysOnTop));
  }
  if (data.platformStatus) {
    updatePlatformStatusUI(data.platformStatus);
  }
  btnDemo.classList.toggle('active', Boolean(data.demoActive));
  btnDemo.textContent = data.demoActive ? '⏹ Stop' : '▶ Demo';
});

window.omnichat.onSpotifyTrack?.((track) => {
  updateSpotifyUI(track);
});

window.omnichat.onStreamDeckCommand?.((payload) => {
  if (!payload) return;
  if (payload.command === 'pin' && payload.msg) {
    pinnedBody.innerHTML = `<strong>${escapeHtml(payload.msg.author)}:</strong> ${renderMessageContentHtml(payload.msg)}`;
    pinnedBanner.classList.remove('hidden');
  } else if (payload.command === 'unpin') {
    pinnedBanner.classList.add('hidden');
  } else if (payload.command === 'clear-chat') {
    messages = [];
    seenMessageIds.clear();
    streamerEvents = [];
    pinnedBanner.classList.add('hidden');
    renderEventTicker();
    renderFeed();
  } else if (payload.command === 'set-compact') {
    applyCompactMode(Boolean(payload.value));
  } else if (payload.command === 'set-sound') {
    soundAlertsEnabled = Boolean(payload.value);
    btnSoundToggle.classList.toggle('active', soundAlertsEnabled);
  } else if (payload.command === 'set-always-on-top') {
    btnPinWindow.classList.toggle('active', Boolean(payload.value));
  } else if (payload.command === 'sync-config' && payload.config) {
    applyConfigToForm(payload.config);
    renderFeed();
  }
});

window.omnichat.onDiagLog?.((entry) => {
  if (!entry) return;
  diagLogs.push(entry);
  if (diagLogs.length > 200) diagLogs.shift();
  renderDiagnosticLogs();
});

window.omnichat.onPlatformStatus((states) => {
  updatePlatformStatusUI(states);
});

window.omnichat.onDemoState((active) => {
  btnDemo.classList.toggle('active', active);
  btnDemo.textContent = active ? '⏹ Stop' : '▶ Demo';
});

window.omnichat.onStreamerEvent((ev) => {
  streamerEvents.push(ev);
  if (streamerEvents.length > 50) streamerEvents.shift();
  renderEventTicker();
  playAlertTone('event');
  const ttsCfg = getTtsSettings();
  if (ttsCfg.enabled && ttsCfg.readAlerts) {
    enqueueTts(`${ev.author || 'Jemand'}: ${ev.summary || ev.type || 'Neues Event'}`);
  }
});

window.omnichat.onMessageDeleted(({ id }) => {
  messages = messages.filter((m) => m.id !== id);
  pendingRenderQueue = pendingRenderQueue.filter((m) => m.id !== id);
  const existingNode = chatFeed.querySelector(`.chat-item[data-id="${CSS.escape(String(id))}"]`);
  if (existingNode) {
    existingNode.remove();
    updateCounters();
  } else {
    renderFeed();
  }
});

window.omnichat.onUserMuted(({ author }) => {
  if (author) {
    const low = author.toLowerCase();
    messages = messages.filter((m) => (m.author || '').toLowerCase() !== low);
    pendingRenderQueue = pendingRenderQueue.filter((m) => (m.author || '').toLowerCase() !== low);
    renderFeed();
  }
});

// 60fps RequestAnimationFrame Batch Renderer for high-frequency chats & emote raids
function flushPendingMessages() {
  rafRenderScheduled = false;
  if (pendingRenderQueue.length === 0) return;

  const batch = pendingRenderQueue.splice(0, pendingRenderQueue.length);
  const maxDom = getMaxDomMessagesLimit();

  if (emptyState.parentElement === chatFeed) {
    emptyState.remove();
  }

  let addedCount = 0;
  const lastChildTs = Number(chatFeed.lastElementChild?.dataset?.ts || 0);

  // Fast path: if all new messages are newer than the last DOM node, batch insert via DocumentFragment
  const allInOrder = batch.every((m, i) => {
    const ts = m.timestamp || 0;
    const prevTs = i === 0 ? lastChildTs : batch[i - 1].timestamp || 0;
    return ts >= prevTs;
  });

  if (allInOrder) {
    const frag = document.createDocumentFragment();
    for (const msg of batch) {
      if (matchesFilter(msg)) {
        frag.appendChild(createMessageElement(msg));
        addedCount++;
      }
    }
    if (addedCount > 0) {
      chatFeed.appendChild(frag);
    }
  } else {
    for (const msg of batch) {
      if (!matchesFilter(msg)) continue;
      addedCount++;
      const msgTs = msg.timestamp || 0;
      const newEl = createMessageElement(msg);
      const children = Array.from(chatFeed.children);
      const afterEl = children.find((el) => Number(el.dataset?.ts || 0) > msgTs);
      if (afterEl) {
        chatFeed.insertBefore(newEl, afterEl);
      } else {
        chatFeed.appendChild(newEl);
      }
    }
  }

  while (chatFeed.children.length > maxDom) {
    chatFeed.removeChild(chatFeed.firstChild);
  }

  updateCounters();
  if (perfDomVal) {
    perfDomVal.textContent = `${chatFeed.children.length} / ${maxDom}`;
  }

  if (addedCount > 0) {
    if (!isAutoScrollPaused) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    } else {
      unreadWhilePaused += addedCount;
      if (btnResumeScroll) {
        btnResumeScroll.textContent = `⬇️ Auto-Scroll pausiert (${unreadWhilePaused} neue) — Nach unten springen`;
        btnResumeScroll.classList.remove('hidden');
      }
    }
  }
}

window.omnichat.onChatMessage((msg) => {
  const uniqueKey = `${msg.platform}:${msg.id}`;
  if (seenMessageIds.has(uniqueKey)) return;
  seenMessageIds.add(uniqueKey);
  if (seenMessageIds.size > 2500) {
    const it = seenMessageIds.values();
    for (let i = 0; i < 500; i++) seenMessageIds.delete(it.next().value);
  }

  const msgTs = msg.timestamp || Date.now();
  recentMsgTimestamps.push(Date.now());
  recordMessageInSessionStats(msg);

  const ttsCfg = getTtsSettings();
  if (ttsCfg.enabled && ttsCfg.readChatCommand) {
    const ttsMatch = String(msg.text || '').trim().match(/^!tts\s+(.+)/i);
    if (ttsMatch && ttsMatch[1]) {
      enqueueTts(`${msg.author || 'Zuschauer'} sagt: ${ttsMatch[1]}`);
    }
  }

  // Section 9: Optional collapsing of repeated/identical messages (Spam ×2, ×3...)
  if (collapseSpamEnabled && !msg.eventType && messages.length > 0) {
    const cleanIncoming = String(msg.text || '').trim().toLowerCase();
    if (cleanIncoming.length >= 2) {
      const recentSlice = messages.slice(-6);
      const dupTarget = recentSlice
        .reverse()
        .find(
          (m) =>
            !m.eventType &&
            m.platform === msg.platform &&
            String(m.text || '').trim().toLowerCase() === cleanIncoming &&
            Math.abs(msgTs - (m.timestamp || 0)) < 25000
        );
      if (dupTarget) {
        dupTarget.repeatCount = (dupTarget.repeatCount || 1) + 1;
        const existingNode = chatFeed.querySelector(`.chat-item[data-id="${CSS.escape(String(dupTarget.id))}"]`);
        if (existingNode) {
          let badge = existingNode.querySelector('.msg-repeat-badge');
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'msg-repeat-badge';
            existingNode.querySelector('.msg-inline-flow')?.appendChild(badge);
          }
          badge.textContent = `×${dupTarget.repeatCount}`;
          badge.title = `Identische Nachricht ${dupTarget.repeatCount}× zusammengefasst`;
        }
        return;
      }
    }
  }

  // Insert in chronological order by timestamp
  if (messages.length === 0 || msgTs >= (messages[messages.length - 1].timestamp || 0)) {
    messages.push(msg);
  } else {
    const idx = messages.findIndex((m) => (m.timestamp || 0) > msgTs);
    if (idx === -1) messages.push(msg);
    else messages.splice(idx, 0, msg);
  }

  const maxBuffer = Math.max(300, getMaxDomMessagesLimit() * 2);
  while (messages.length > maxBuffer) {
    messages.shift();
  }

  if (msg.isMention && !msg.isHighlight) {
    playAlertTone('mention');
  } else if (msg.isKeywordAlert && (!chkKeywordSound || chkKeywordSound.checked) && !msg.isHighlight) {
    playAlertTone('mention');
  }

  pendingRenderQueue.push(msg);
  if (!rafRenderScheduled) {
    rafRenderScheduled = true;
    requestAnimationFrame(flushPendingMessages);
  }
});

// --- CENTRAL CONFIG PAGE ---
(function initCentralConfigPage() {
  const modal = document.getElementById('configPageModal');
  if (!modal) return;

  const profileBox = document.querySelector('.profile-meta-box');
  const tabProfile = document.getElementById('cfgTab_profile');
  if (profileBox && tabProfile) {
    const sec = document.createElement('div');
    sec.className = 'sidebar-section';
    const h3 = document.createElement('h3');
    h3.textContent = '👑 Streamer-Profil & Keyword-Alarme';
    sec.appendChild(h3);
    sec.appendChild(profileBox);
    tabProfile.appendChild(sec);
  }

  const platformSection = document.getElementById('card_twitch')?.closest('.sidebar-section');
  const tabPlatforms = document.getElementById('cfgTab_platforms');
  if (platformSection && tabPlatforms) {
    platformSection.style.gridColumn = '1 / -1';
    tabPlatforms.appendChild(platformSection);
  }

  const moveMap = [
    ['.event-settings-box', 'cfgTab_profile'],
    ['.design-settings-box', 'cfgTab_design'],
    ['.emote-settings-box', 'cfgTab_design'],
    ['.obs-box', 'cfgTab_obs'],
    ['.obs-ws-config-box', 'cfgTab_obs'],
    ['.obs-alerts-box', 'cfgTab_obs'],
    ['.tts-box', 'cfgTab_obs'],
    ['.tablet-box', 'cfgTab_companion'],
    ['.streamdeck-box', 'cfgTab_companion'],
    ['.peripherals-box', 'cfgTab_system'],
    ['.perf-settings-box', 'cfgTab_system']
  ];

  for (const [selector, targetId] of moveMap) {
    const el = document.querySelector(selector);
    const target = document.getElementById(targetId);
    if (el && target) target.appendChild(el);
  }

  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  document.getElementById('btnOpenConfig')?.addEventListener('click', openModal);
  document.getElementById('btnOpenConfigSidebar')?.addEventListener('click', openModal);
  document.getElementById('btnCloseConfig')?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  const tabBtns = Array.from(document.querySelectorAll('.config-tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.config-tab-panel'));
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.cfgTab;
      tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
      tabPanels.forEach((p) => p.classList.toggle('active', p.id === `cfgTab_${targetTab}`));
    });
  });
})();

// --- TWITCH CLIP & STREAM-MARKER HANDLERS ---
const btnCreateClip = document.getElementById('btnCreateClip');
const btnCreateMarker = document.getElementById('btnCreateMarker');
const inputMarkerDesc = document.getElementById('inputMarkerDesc');
const clipMarkerResult = document.getElementById('clipMarkerResult');

btnCreateClip?.addEventListener('click', async () => {
  btnCreateClip.disabled = true;
  btnCreateClip.textContent = '⏳ Clip...';
  const res = await window.omnichat.createTwitchClip();
  btnCreateClip.disabled = false;
  btnCreateClip.textContent = '🎬 Clip erstellen';
  if (clipMarkerResult) {
    if (res?.ok && res.url) {
      clipMarkerResult.style.color = '#4ade80';
      clipMarkerResult.textContent = `✅ Clip: ${res.url} (in Zwischenablage kopiert)`;
      try { navigator.clipboard.writeText(res.url); } catch (e) {}
    } else {
      clipMarkerResult.style.color = '#f87171';
      clipMarkerResult.textContent = `❌ ${res?.error || 'Clip fehlgeschlagen.'}`;
    }
  }
});

btnCreateMarker?.addEventListener('click', async () => {
  btnCreateMarker.disabled = true;
  btnCreateMarker.textContent = '⏳ Marker...';
  const desc = inputMarkerDesc?.value.trim() || 'OmniStream Highlight';
  const res = await window.omnichat.createTwitchMarker(desc);
  btnCreateMarker.disabled = false;
  btnCreateMarker.textContent = '🚩 Marker setzen';
  if (clipMarkerResult) {
    if (res?.ok) {
      clipMarkerResult.style.color = '#4ade80';
      const pos = typeof res.positionSeconds === 'number' ? ` @ ${res.positionSeconds}s` : '';
      clipMarkerResult.textContent = `✅ Marker gesetzt${pos}: "${res.description || desc}"`;
      if (inputMarkerDesc) inputMarkerDesc.value = '';
    } else {
      clipMarkerResult.style.color = '#f87171';
      clipMarkerResult.textContent = `❌ ${res?.error || 'Marker fehlgeschlagen.'}`;
    }
  }
});

// --- OBS WEBSOCKET V5 CONTROLS ---
function updateObsWsUI(st) {
  if (!st) return;
  const badge = document.getElementById('obsWsLiveBadge');
  const cfgStatus = document.getElementById('obsWsConfigStatus');
  const btnConn = document.getElementById('btnObsWsConnect');
  const btnDisc = document.getElementById('btnObsWsDisconnect');
  const selScene = document.getElementById('selObsScene');
  const btnReplay = document.getElementById('btnObsReplay');
  const btnMic = document.getElementById('btnObsMic');
  const btnRec = document.getElementById('btnObsRec');
  const btnStream = document.getElementById('btnObsStream');

  const isConn = Boolean(st.connected);
  if (badge) {
    badge.textContent = isConn ? '(Verbunden)' : st.connecting ? '(...)' : '(Aus)';
    badge.style.color = isConn ? '#4ade80' : '#94a3b8';
  }
  if (cfgStatus) {
    if (isConn) {
      cfgStatus.style.color = '#4ade80';
      cfgStatus.textContent = `✅ Verbunden — Szene: ${st.currentScene || 'Unbekannt'}`;
    } else if (st.error) {
      cfgStatus.style.color = '#f87171';
      cfgStatus.textContent = `❌ ${st.error}`;
    } else {
      cfgStatus.style.color = '#94a3b8';
      cfgStatus.textContent = st.connecting ? '⏳ Verbinde...' : 'Nicht verbunden';
    }
  }
  if (btnConn) btnConn.textContent = isConn ? '🔄 Neu verbinden' : '🔌 Mit OBS verbinden';
  if (btnDisc) btnDisc.classList.toggle('hidden', !isConn);

  [selScene, btnReplay, btnMic, btnRec, btnStream].forEach((el) => {
    if (el) el.disabled = !isConn;
  });

  if (selScene) {
    if (!isConn) {
      selScene.innerHTML = '<option value="">— OBS in Config verbinden —</option>';
    } else {
      selScene.innerHTML = '';
      (st.scenes || []).forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        if (s === st.currentScene) opt.selected = true;
        selScene.appendChild(opt);
      });
    }
  }

  if (btnMic) {
    btnMic.textContent = st.micMuted ? '🔇 Mic (Aus)' : '🎙️ Mic (An)';
    btnMic.classList.toggle('warn', Boolean(st.micMuted));
  }
  if (btnRec) {
    btnRec.textContent = st.recordActive ? '⏹️ Rec läuft' : '🔴 Rec';
    btnRec.classList.toggle('active', Boolean(st.recordActive));
  }
  if (btnStream) {
    btnStream.textContent = st.streamActive ? '⏹️ Live' : '📡 Stream';
    btnStream.classList.toggle('active', Boolean(st.streamActive));
  }
}

window.omnichat.onObsWsState?.((st) => updateObsWsUI(st));

document.getElementById('btnObsWsConnect')?.addEventListener('click', async () => {
  const host = document.getElementById('inputObsWsHost')?.value.trim() || '127.0.0.1';
  const port = parseInt(document.getElementById('inputObsWsPort')?.value || '4455', 10) || 4455;
  const password = document.getElementById('inputObsWsPass')?.value || '';
  const micName = document.getElementById('inputObsWsMic')?.value.trim() || '';
  const res = await window.omnichat.obsWsConnect({ host, port, password, micName });
  if (res?.state) updateObsWsUI(res.state);
});

document.getElementById('btnObsWsDisconnect')?.addEventListener('click', () => {
  window.omnichat.obsWsDisconnect();
});

document.getElementById('selObsScene')?.addEventListener('change', (e) => {
  if (e.target.value) {
    window.omnichat.obsWsAction({ action: 'scene', sceneName: e.target.value });
  }
});

document.getElementById('btnObsReplay')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnObsReplay');
  const res = await window.omnichat.obsWsAction({ action: 'save-replay' });
  if (btn) {
    btn.textContent = res?.ok ? '✅ Gespeichert!' : '❌ Replay aus?';
    setTimeout(() => { btn.textContent = '💾 Replay'; }, 1500);
  }
});

document.getElementById('btnObsMic')?.addEventListener('click', () => {
  window.omnichat.obsWsAction({ action: 'toggle-mic' });
});

document.getElementById('btnObsRec')?.addEventListener('click', () => {
  window.omnichat.obsWsAction({ action: 'toggle-record' });
});

document.getElementById('btnObsStream')?.addEventListener('click', () => {
  window.omnichat.obsWsAction({ action: 'toggle-stream' });
});

// --- CHAT-TIMER & AUTO-MOD HANDLERS ---
[
  'chkTimerEnabled',
  'numTimerInterval',
  'txtTimerMessages',
  'chkAutoModEnabled',
  'chkAutoModLinks',
  'chkAutoModCaps',
  'chkAutoModSymbols',
  'chkAutoModExemptMods',
  'inputAutoModBlacklist',
  'selAutoModTimeout'
].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

document.getElementById('btnTimerSendNow')?.addEventListener('click', async () => {
  await window.omnichat.saveProfile(getFormConfig());
  const statusEl = document.getElementById('timerSendStatus');
  const res = await window.omnichat.runChatTimerNow();
  if (statusEl) {
    if (res?.ok) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = `✅ Gesendet (${res.sentTo?.join(', ') || 'log'})`;
    } else {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Fehler'}`;
    }
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
  }
});

document.getElementById('btnOpenHelp')?.addEventListener('click', () => {
  window.omnichat.openHelpWindow();
});

['chkCustomCmdsEnabled', 'numCustomCmdCooldown', 'txtCustomCmdRules'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

document.getElementById('btnExportChatLog')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnExportChatLog');
  const exportData = messages.map((m) => ({
    timestamp: m.timestamp,
    platform: m.platform,
    author: m.author,
    text: m.text
  }));
  const res = await window.omnichat.exportChatLog(exportData);
  if (res?.ok && btn) {
    btn.textContent = '✅ Gespeichert';
    setTimeout(() => { btn.textContent = '💾 Export'; }, 1600);
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
    const searchInput = document.getElementById('inputSearch');
    if (searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  }
});

// --- STREAM-MANAGER (TITEL, SPIEL/KATEGORIE & TAGS) ---
const inputStreamTitle = document.getElementById('inputStreamTitle');
const inputStreamGame = document.getElementById('inputStreamGame');
const dlStreamGames = document.getElementById('dlStreamGames');
const inputStreamTags = document.getElementById('inputStreamTags');
const chkSyncYtTitle = document.getElementById('chkSyncYtTitle');
const streamInfoStatus = document.getElementById('streamInfoStatus');
let streamGameIdMap = new Map();
let gameSearchTimer = null;

async function loadStreamManagerInfo() {
  if (streamInfoStatus) {
    streamInfoStatus.style.color = '#94a3b8';
    streamInfoStatus.textContent = '⏳ Lade Kanal-Info...';
  }
  const res = await window.omnichat.streamManagerLoad();
  if (res?.ok && res.twitch) {
    if (inputStreamTitle) inputStreamTitle.value = res.twitch.title || '';
    if (inputStreamGame) inputStreamGame.value = res.twitch.gameName || '';
    if (res.twitch.gameName && res.twitch.gameId) {
      streamGameIdMap.set(res.twitch.gameName.toLowerCase(), res.twitch.gameId);
    }
    if (inputStreamTags) inputStreamTags.value = (res.twitch.tags || []).join(', ');
    if (streamInfoStatus) {
      streamInfoStatus.style.color = '#4ade80';
      streamInfoStatus.textContent = '✅ Aktuelle Twitch-Daten geladen';
    }
  } else if (streamInfoStatus) {
    streamInfoStatus.style.color = '#f87171';
    streamInfoStatus.textContent = `❌ ${res?.error || 'Laden fehlgeschlagen'}`;
  }
}

document.getElementById('btnLoadStreamInfo')?.addEventListener('click', loadStreamManagerInfo);

inputStreamGame?.addEventListener('input', () => {
  clearTimeout(gameSearchTimer);
  const q = inputStreamGame.value.trim();
  if (q.length < 2) return;
  gameSearchTimer = setTimeout(async () => {
    const res = await window.omnichat.streamManagerSearchGames(q);
    if (res?.ok && dlStreamGames) {
      dlStreamGames.innerHTML = '';
      (res.categories || []).forEach((c) => {
        streamGameIdMap.set(c.name.toLowerCase(), c.id);
        const opt = document.createElement('option');
        opt.value = c.name;
        dlStreamGames.appendChild(opt);
      });
    }
  }, 280);
});

document.getElementById('btnSaveStreamInfo')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnSaveStreamInfo');
  const title = inputStreamTitle?.value.trim() || '';
  const gameName = inputStreamGame?.value.trim() || '';
  const gameId = streamGameIdMap.get(gameName.toLowerCase()) || '';
  const tags = inputStreamTags?.value || '';
  const syncYoutube = Boolean(chkSyncYtTitle?.checked);

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Speichere...';
  }
  const res = await window.omnichat.streamManagerSave({ title, gameId, gameName, tags, syncYoutube });
  if (btn) {
    btn.disabled = false;
    btn.textContent = '💾 Übernehmen';
  }
  if (streamInfoStatus) {
    if (res?.ok) {
      streamInfoStatus.style.color = '#4ade80';
      const warn = res.warnings?.length ? ` (${res.warnings.join('; ')})` : '';
      streamInfoStatus.textContent = `✅ Aktualisiert: ${(res.updated || []).join(', ')}${warn}`;
    } else {
      streamInfoStatus.style.color = '#f87171';
      streamInfoStatus.textContent = `❌ ${res?.error || 'Update fehlgeschlagen'}`;
    }
  }
});

// --- CLIP- & REPLAY-STUDIO (9:16 SHORTS PIPELINE) ---
(function initClipStudio() {
  const modal = document.getElementById('clipStudioModal');
  if (!modal) return;

  const listEl = document.getElementById('clipStudioList');
  const dirLabel = document.getElementById('clipStudioDirLabel');
  const videoEl = document.getElementById('clipStudioVideo');
  const btnExport = document.getElementById('btnClipExportShort');
  const btnTrimOrig = document.getElementById('btnClipTrimOriginal');
  const btnMarkStart = document.getElementById('btnMarkStart');
  const btnMarkEnd = document.getElementById('btnMarkEnd');
  const btnPlayRange = document.getElementById('btnClipPlayRange');
  const numClipStart = document.getElementById('numClipStart');
  const numClipEnd = document.getElementById('numClipEnd');
  const clipRangeDur = document.getElementById('clipRangeDuration');
  const btnReveal = document.getElementById('btnClipRevealOut');
  const inputTitle = document.getElementById('inputClipTitle');
  const btnRename = document.getElementById('btnClipRename');
  const btnDelete = document.getElementById('btnClipDelete');
  const statusEl = document.getElementById('clipStudioStatus');
  let selectedPath = '';
  let lastOutPath = '';
  let rangePlayStopAt = null;

  function updateRangeDurationLabel() {
    const s = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const e = Math.max(s + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    if (clipRangeDur) clipRangeDur.textContent = `Dauer: ${(e - s).toFixed(1)}s`;
  }

  function setSelectedClip(filePath, fileName) {
    selectedPath = filePath || '';
    const hasSel = Boolean(selectedPath);
    rangePlayStopAt = null;
    if (videoEl) {
      if (hasSel) videoEl.src = encodeURI(`file://${selectedPath}`);
      else {
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
      }
    }
    if (inputTitle) {
      inputTitle.disabled = !hasSel;
      inputTitle.value = hasSel ? String(fileName || '').replace(/\.[^.]+$/, '') : '';
    }
    [btnExport, btnTrimOrig, btnMarkStart, btnMarkEnd, btnPlayRange, btnRename, btnDelete].forEach((b) => {
      if (b) b.disabled = !hasSel;
    });
  }

  function renderReplays(res) {
    if (!res) return;
    if (dirLabel) {
      const ff = res.hasFfmpeg ? 'ffmpeg bereit' : '⚠️ ffmpeg fehlt';
      dirLabel.textContent = `Ordner: ${res.dir || '—'} (${ff})`;
    }
    if (!listEl) return;
    listEl.innerHTML = '';
    const files = res.files || [];
    if (files.length === 0) {
      listEl.innerHTML = '<span style="color:#94a3b8;">Keine Videos (.mp4/.mkv/.mov) gefunden. Wähle oben deinen OBS-Aufnahmeordner.</span>';
      return;
    }
    files.forEach((f) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '4px';
      row.style.alignItems = 'center';

      const btn = document.createElement('button');
      btn.className = 'btn-sm';
      btn.style.textAlign = 'left';
      btn.style.flex = '1';
      btn.style.minWidth = '0';
      btn.style.overflow = 'hidden';
      btn.style.textOverflow = 'ellipsis';
      btn.style.whiteSpace = 'nowrap';
      btn.style.padding = '6px 7px';
      const prefix = f.badge ? `[${f.badge}] ` : '';
      btn.textContent = `🎬 ${prefix}${f.name} (${f.sizeMb} MB)`;
      btn.title = f.name;
      if (f.path === selectedPath) btn.style.borderColor = '#9146ff';
      btn.onclick = () => {
        setSelectedClip(f.path, f.name);
        if (statusEl) {
          statusEl.style.color = '#94a3b8';
          statusEl.textContent = `Ausgewählt: ${f.name}`;
        }
        renderReplays(res);
      };

      const btnYt = document.createElement('button');
      btnYt.className = 'btn-sm';
      btnYt.style.padding = '6px 6px';
      btnYt.style.fontSize = '11px';
      btnYt.title = 'Direkt auf YouTube hochladen (Privat-Entwurf, benötigt YouTube OAuth2)';
      btnYt.textContent = '▶️ YT';
      btnYt.onclick = async (e) => {
        e.stopPropagation();
        btnYt.disabled = true;
        btnYt.textContent = '⏳';
        if (statusEl) {
          statusEl.style.color = '#38bdf8';
          statusEl.textContent = `⏳ Lade "${f.name}" auf YouTube hoch...`;
        }
        const title = f.name.replace(/\.[^.]+$/, '');
        const upRes = await window.omnichat.clipStudioUploadYoutube({
          filePath: f.path,
          title,
          privacyStatus: 'private'
        });
        btnYt.disabled = false;
        btnYt.textContent = '▶️ YT';
        if (upRes?.ok) {
          try { navigator.clipboard.writeText(upRes.url); } catch (err) {}
          if (statusEl) {
            statusEl.style.color = '#4ade80';
            statusEl.textContent = `✅ YouTube Upload fertig (Privat): ${upRes.url} (kopiert)`;
          }
        } else if (statusEl) {
          statusEl.style.color = '#f87171';
          statusEl.textContent = `❌ ${upRes?.error || 'YouTube Upload fehlgeschlagen.'}`;
        }
      };

      const btnTt = document.createElement('button');
      btnTt.className = 'btn-sm';
      btnTt.style.padding = '6px 6px';
      btnTt.style.fontSize = '11px';
      btnTt.title = 'TikTok Upload-Seite öffnen & Datei im Ordner markieren';
      btnTt.textContent = '🎵 TT';
      btnTt.onclick = async (e) => {
        e.stopPropagation();
        await window.omnichat.clipStudioUploadTiktok(f.path);
        if (statusEl) {
          statusEl.style.color = '#38bdf8';
          statusEl.textContent = `🎵 TikTok Upload geöffnet — ziehe "${f.name}" einfach ins Browserfenster.`;
        }
      };

      row.appendChild(btn);
      row.appendChild(btnYt);
      row.appendChild(btnTt);
      listEl.appendChild(row);
    });
  }

  async function refreshList() {
    const res = await window.omnichat.clipStudioList();
    renderReplays(res);
  }

  document.getElementById('btnOpenClipStudio')?.addEventListener('click', () => {
    modal.classList.remove('hidden');
    refreshList();
  });
  document.getElementById('btnCloseClipStudio')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (videoEl) videoEl.pause();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      if (videoEl) videoEl.pause();
    }
  });

  document.getElementById('btnClipRefresh')?.addEventListener('click', refreshList);
  document.getElementById('btnClipPickDir')?.addEventListener('click', async () => {
    const res = await window.omnichat.clipStudioPickDir();
    if (!res?.canceled) {
      setSelectedClip('', '');
      renderReplays(res);
    }
  });

  btnRename?.addEventListener('click', async () => {
    if (!selectedPath || !inputTitle) return;
    const newTitle = inputTitle.value.trim();
    if (!newTitle) return;
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.load();
    }
    const res = await window.omnichat.clipStudioRename(selectedPath, newTitle);
    if (res?.ok) {
      setSelectedClip(res.newPath, res.name);
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ Umbenannt zu: ${res.name}`;
      }
      refreshList();
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Umbenennen fehlgeschlagen.'}`;
    }
  });

  btnDelete?.addEventListener('click', async () => {
    if (!selectedPath) return;
    const ok = confirm('Diesen Clip wirklich in den Papierkorb verschieben?');
    if (!ok) return;
    const pathToTrash = selectedPath;
    setSelectedClip('', '');
    const res = await window.omnichat.clipStudioDelete(pathToTrash);
    if (res?.ok) {
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = '🗑️ Clip in den Papierkorb verschoben.';
      }
      refreshList();
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Löschen fehlgeschlagen.'}`;
    }
  });

  videoEl?.addEventListener('loadedmetadata', () => {
    if (numClipStart) numClipStart.value = '0';
    if (numClipEnd && Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
      numClipEnd.value = videoEl.duration.toFixed(1);
    }
    updateRangeDurationLabel();
  });

  videoEl?.addEventListener('timeupdate', () => {
    if (rangePlayStopAt !== null && videoEl.currentTime >= rangePlayStopAt) {
      videoEl.pause();
      rangePlayStopAt = null;
    }
  });

  [numClipStart, numClipEnd].forEach((el) => {
    el?.addEventListener('input', updateRangeDurationLabel);
  });

  btnMarkStart?.addEventListener('click', () => {
    if (!videoEl || !numClipStart) return;
    numClipStart.value = videoEl.currentTime.toFixed(1);
    if (numClipEnd && parseFloat(numClipEnd.value) <= parseFloat(numClipStart.value)) {
      const fallbackEnd = Number.isFinite(videoEl.duration) ? videoEl.duration : parseFloat(numClipStart.value) + 10;
      numClipEnd.value = fallbackEnd.toFixed(1);
    }
    updateRangeDurationLabel();
  });

  btnMarkEnd?.addEventListener('click', () => {
    if (!videoEl || !numClipEnd) return;
    const t = Math.max(0.5, videoEl.currentTime);
    numClipEnd.value = t.toFixed(1);
    if (numClipStart && parseFloat(numClipStart.value) >= t) {
      numClipStart.value = Math.max(0, t - 5).toFixed(1);
    }
    updateRangeDurationLabel();
  });

  btnPlayRange?.addEventListener('click', () => {
    if (!videoEl || !selectedPath) return;
    const s = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const e = Math.max(s + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    rangePlayStopAt = e;
    videoEl.currentTime = s;
    videoEl.play().catch(() => {});
  });

  async function runClipExport(mode) {
    if (!selectedPath) return;
    const isShort = mode === 'short';
    const activeBtn = isShort ? btnExport : btnTrimOrig;
    const defaultLabel = isShort ? '📱 Als 9:16 Short' : '✂️ 16:9 schneiden';
    if (btnExport) btnExport.disabled = true;
    if (btnTrimOrig) btnTrimOrig.disabled = true;
    if (activeBtn) activeBtn.textContent = isShort ? '⏳ Rendere 9:16...' : '⏳ Schneide 16:9...';
    if (btnReveal) btnReveal.classList.add('hidden');
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = isShort
        ? '⏳ ffmpeg rendert 1080×1920 Short... (bitte kurz warten)'
        : '⏳ ffmpeg schneidet 16:9 Clip... (bitte kurz warten)';
    }

    const startSec = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const endSec = Math.max(startSec + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    const layoutMode = document.getElementById('selClipLayout')?.value || 'blur_bg';

    const res = isShort
      ? await window.omnichat.clipStudioExportShort({ inputPath: selectedPath, startSec, endSec, layoutMode })
      : await window.omnichat.clipStudioTrimOriginal({ inputPath: selectedPath, startSec, endSec });

    if (btnExport) btnExport.disabled = false;
    if (btnTrimOrig) btnTrimOrig.disabled = false;
    if (activeBtn) activeBtn.textContent = defaultLabel;
    if (res?.ok) {
      lastOutPath = res.outPath;
      if (btnReveal) btnReveal.classList.remove('hidden');
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ Fertig: ${res.outPath}`;
      }
      refreshList();
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Export fehlgeschlagen.'}`;
    }
  }

  btnExport?.addEventListener('click', () => runClipExport('short'));
  btnTrimOrig?.addEventListener('click', () => runClipExport('trim'));

  btnReveal?.addEventListener('click', () => {
    if (lastOutPath) window.omnichat.clipStudioReveal(lastOutPath);
  });
})();
