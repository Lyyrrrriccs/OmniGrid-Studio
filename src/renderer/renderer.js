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

function getElgatoLightsSettings() {
  return {
    ips: document.getElementById('inputElgatoIps')?.value.trim() || '',
    autoOnLive: document.getElementById('chkElgatoAutoOnLive')?.checked !== false,
    autoOffStop: Boolean(document.getElementById('chkElgatoAutoOffStop')?.checked),
    brightness: parseInt(document.getElementById('rngElgatoBrightness')?.value || '60', 10) || 60,
    temperatureK: parseInt(document.getElementById('rngElgatoTemp')?.value || '4500', 10) || 4500
  };
}

const GOVEE_EVENT_KEYS = ['defaultScene', 'streamStart', 'follow', 'sub', 'resub', 'subgift', 'bits', 'raid', 'hype', 'streamStop'];
let goveeCachedDevices = [];
let goveeCachedScenes = [];

function getGoveeLightsSettings() {
  const selDev = document.getElementById('selGoveeDevice');
  const [sku, device] = String(selDev?.value || '').split('||');
  const checkedBoxes = Array.from(document.querySelectorAll('.govee-dev-chk:checked'));
  const selectedDevices = checkedBoxes.map((cb) => cb.value).filter(Boolean);
  if (!selectedDevices.length && sku && device) {
    selectedDevices.push(`${sku}||${device}`);
  }
  const eventScenes = {};
  const eventDevices = {};
  GOVEE_EVENT_KEYS.forEach((k) => {
    eventScenes[k] = document.getElementById(`selGovee_${k}`)?.value || '';
    eventDevices[k] = document.getElementById(`selGoveeDev_${k}`)?.value || '';
  });
  return {
    enabled: Boolean(document.getElementById('chkGoveeEnabled')?.checked),
    apiKey: document.getElementById('inputGoveeApiKey')?.value.trim() || '',
    sku: sku || '',
    device: device || '',
    deviceName: selDev?.selectedOptions?.[0]?.textContent || '',
    selectedDevices,
    revertAfterSec: Math.max(0, parseInt(document.getElementById('numGoveeRevertSec')?.value || '8', 10) || 0),
    cachedDevices: goveeCachedDevices,
    cachedScenes: goveeCachedScenes,
    eventScenes,
    eventDevices
  };
}

function getMultiStreamSettings() {
  return {
    port: Math.max(1024, Math.min(65535, parseInt(document.getElementById('numMsPort')?.value || '1935', 10) || 1935)),
    streamKey: document.getElementById('inputMsLocalKey')?.value.trim() || 'omnigrid',
    autoConfigureObs: document.getElementById('chkMsAutoConfigObs')?.checked !== false,
    autoStartObsStream: document.getElementById('chkMsAutoStartObs')?.checked !== false,
    targets: {
      twitch: {
        enabled: Boolean(document.getElementById('chkMsTwitch')?.checked),
        serverUrl: document.getElementById('inputMsTwitchUrl')?.value.trim() || 'rtmp://fra02.contribute.live-video.net/app',
        streamKey: document.getElementById('inputMsTwitchKey')?.value.trim() || ''
      },
      youtube: {
        enabled: Boolean(document.getElementById('chkMsYoutube')?.checked),
        serverUrl: document.getElementById('inputMsYoutubeUrl')?.value.trim() || 'rtmp://a.rtmp.youtube.com/live2',
        streamKey: document.getElementById('inputMsYoutubeKey')?.value.trim() || ''
      },
      tiktok: {
        enabled: Boolean(document.getElementById('chkMsTiktok')?.checked),
        serverUrl: document.getElementById('inputMsTiktokUrl')?.value.trim() || '',
        streamKey: document.getElementById('inputMsTiktokKey')?.value.trim() || ''
      },
      custom: {
        enabled: Boolean(document.getElementById('chkMsCustom')?.checked),
        name: document.getElementById('inputMsCustomName')?.value.trim() || 'Kick / Custom',
        serverUrl: document.getElementById('inputMsCustomUrl')?.value.trim() || '',
        streamKey: document.getElementById('inputMsCustomKey')?.value.trim() || ''
      }
    }
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
    elgatoLights: getElgatoLightsSettings(),
    goveeLights: getGoveeLightsSettings(),
    multiStream: getMultiStreamSettings(),
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

  const elg = cfg.elgatoLights || {};
  const inpElgIps = document.getElementById('inputElgatoIps');
  const chkElgOn = document.getElementById('chkElgatoAutoOnLive');
  const chkElgOff = document.getElementById('chkElgatoAutoOffStop');
  const rngElgBr = document.getElementById('rngElgatoBrightness');
  const valElgBr = document.getElementById('valElgatoBrightness');
  const rngElgTp = document.getElementById('rngElgatoTemp');
  const valElgTp = document.getElementById('valElgatoTemp');
  if (inpElgIps) inpElgIps.value = elg.ips || '';
  if (chkElgOn) chkElgOn.checked = elg.autoOnLive !== false;
  if (chkElgOff) chkElgOff.checked = Boolean(elg.autoOffStop);
  if (rngElgBr) rngElgBr.value = String(elg.brightness ?? 60);
  if (valElgBr) valElgBr.textContent = `${elg.brightness ?? 60}%`;
  if (rngElgTp) rngElgTp.value = String(elg.temperatureK ?? 4500);
  if (valElgTp) valElgTp.textContent = `${elg.temperatureK ?? 4500}K`;

  const gov = cfg.goveeLights || {};
  const chkGovEn = document.getElementById('chkGoveeEnabled');
  const inpGovKey = document.getElementById('inputGoveeApiKey');
  const numGovRev = document.getElementById('numGoveeRevertSec');
  if (chkGovEn) chkGovEn.checked = Boolean(gov.enabled);
  if (inpGovKey) inpGovKey.value = gov.apiKey || '';
  if (numGovRev) numGovRev.value = String(gov.revertAfterSec ?? 8);
  if (Array.isArray(gov.cachedDevices)) goveeCachedDevices = gov.cachedDevices;
  if (Array.isArray(gov.cachedScenes)) goveeCachedScenes = gov.cachedScenes;
  if (typeof window.__populateGoveeUI === 'function') {
    window.__populateGoveeUI(gov);
  }

  const ms = cfg.multiStream || {};
  const msT = ms.targets || {};
  const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = String(v); };
  const setChk = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.checked = Boolean(v); };
  setVal('numMsPort', ms.port ?? 1935);
  setVal('inputMsLocalKey', ms.streamKey || 'omnigrid');
  setVal('inputMsIngestPreview', `rtmp://127.0.0.1:${ms.port ?? 1935}/live`);
  setChk('chkMsAutoConfigObs', ms.autoConfigureObs !== false);
  setChk('chkMsAutoStartObs', ms.autoStartObsStream !== false);
  if (msT.twitch) {
    setChk('chkMsTwitch', msT.twitch.enabled ?? true);
    setVal('inputMsTwitchUrl', msT.twitch.serverUrl || 'rtmp://fra02.contribute.live-video.net/app');
    setVal('inputMsTwitchKey', msT.twitch.streamKey || '');
  }
  if (msT.youtube) {
    setChk('chkMsYoutube', msT.youtube.enabled);
    setVal('inputMsYoutubeUrl', msT.youtube.serverUrl || 'rtmp://a.rtmp.youtube.com/live2');
    setVal('inputMsYoutubeKey', msT.youtube.streamKey || '');
  }
  if (msT.tiktok) {
    setChk('chkMsTiktok', msT.tiktok.enabled);
    setVal('inputMsTiktokUrl', msT.tiktok.serverUrl || '');
    setVal('inputMsTiktokKey', msT.tiktok.streamKey || '');
  }
  if (msT.custom) {
    setChk('chkMsCustom', msT.custom.enabled);
    setVal('inputMsCustomName', msT.custom.name || 'Kick / Custom');
    setVal('inputMsCustomUrl', msT.custom.serverUrl || '');
    setVal('inputMsCustomKey', msT.custom.streamKey || '');
  }

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
    spSidebarTitle.textContent = 'Musik nicht aktiv';
    spSidebarArtist.textContent = 'Starte Amazon Music, Spotify oder Apple Music';
    return;
  }
  const icon = track.playing ? '▶️' : '⏸️';
  const src = track.source || 'Spotify';
  spSidebarTitle.textContent = `${icon} ${track.title}`;
  spSidebarArtist.textContent = track.artist ? `${track.artist} • ${src}` : src;
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
    ['.multistream-relay-box', 'cfgTab_platforms'],
    ['.event-settings-box', 'cfgTab_profile'],
    ['.design-settings-box', 'cfgTab_design'],
    ['.emote-settings-box', 'cfgTab_design'],
    ['.obs-box', 'cfgTab_obs'],
    ['.obs-ws-config-box', 'cfgTab_obs'],
    ['.elgato-lights-box', 'cfgTab_obs'],
    ['.govee-lights-box', 'cfgTab_obs'],
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
  const desc = inputMarkerDesc?.value.trim() || 'OmniGrid Highlight';
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

  const seBadge = document.getElementById('seObsWsBadge');
  const seConn = document.getElementById('btnSeObsWsConnect');
  const seDisc = document.getElementById('btnSeObsWsDisconnect');
  if (seBadge) {
    seBadge.textContent = isConn ? '● OBS: Verbunden' : st.connecting ? '● OBS: Verbinde...' : '● OBS: Aus';
    seBadge.style.color = isConn ? '#4ade80' : st.error ? '#f87171' : '#94a3b8';
  }
  if (seConn) seConn.textContent = isConn ? '🔄 Neu verbinden' : '🔌 Mit OBS verbinden';
  if (seDisc) seDisc.classList.toggle('hidden', !isConn);

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
  const rngClipStart = document.getElementById('rngClipStart');
  const rngClipEnd = document.getElementById('rngClipEnd');
  const clipTimelineSel = document.getElementById('clipTimelineSel');
  const clipTimelinePlayhead = document.getElementById('clipTimelinePlayhead');
  const clipRangeDur = document.getElementById('clipRangeDuration');
  const btnReveal = document.getElementById('btnClipRevealOut');
  const inputTitle = document.getElementById('inputClipTitle');
  const btnRename = document.getElementById('btnClipRename');
  const btnDelete = document.getElementById('btnClipDelete');
  const statusEl = document.getElementById('clipStudioStatus');
  let selectedPath = '';
  let lastOutPath = '';
  let rangePlayStopAt = null;
  let videoDurationSec = 30;

  function updateRangeDurationLabel() {
    const s = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const e = Math.max(s + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    if (clipRangeDur) clipRangeDur.textContent = `Dauer: ${(e - s).toFixed(1)}s`;
    if (rngClipStart) rngClipStart.value = String(s);
    if (rngClipEnd) rngClipEnd.value = String(e);
    if (clipTimelineSel) {
      const total = Math.max(0.5, videoDurationSec || e);
      const leftPct = Math.max(0, Math.min(100, (s / total) * 100));
      const rightPct = Math.max(leftPct, Math.min(100, (e / total) * 100));
      clipTimelineSel.style.left = `${leftPct}%`;
      clipTimelineSel.style.width = `${Math.max(0.5, rightPct - leftPct)}%`;
    }
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
    [btnExport, btnTrimOrig, btnMarkStart, btnMarkEnd, btnPlayRange, btnRename, btnDelete, rngClipStart, rngClipEnd].forEach((b) => {
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
    const dur = Number.isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 30;
    videoDurationSec = dur;
    if (rngClipStart) { rngClipStart.max = dur.toFixed(1); rngClipStart.value = '0'; }
    if (rngClipEnd) { rngClipEnd.max = dur.toFixed(1); rngClipEnd.value = dur.toFixed(1); }
    if (numClipStart) numClipStart.value = '0';
    if (numClipEnd) numClipEnd.value = dur.toFixed(1);
    updateRangeDurationLabel();
  });

  videoEl?.addEventListener('timeupdate', () => {
    if (clipTimelinePlayhead && videoDurationSec > 0) {
      clipTimelinePlayhead.style.left = `${Math.min(100, (videoEl.currentTime / videoDurationSec) * 100)}%`;
    }
    if (rangePlayStopAt !== null && videoEl.currentTime >= rangePlayStopAt) {
      videoEl.pause();
      rangePlayStopAt = null;
    }
  });

  [numClipStart, numClipEnd].forEach((el) => {
    el?.addEventListener('input', updateRangeDurationLabel);
  });

  rngClipStart?.addEventListener('input', () => {
    const eVal = parseFloat(numClipEnd?.value || String(videoDurationSec)) || videoDurationSec;
    const sVal = Math.min(parseFloat(rngClipStart.value) || 0, Math.max(0, eVal - 0.5));
    if (numClipStart) numClipStart.value = sVal.toFixed(1);
    if (videoEl) videoEl.currentTime = sVal;
    updateRangeDurationLabel();
  });

  rngClipEnd?.addEventListener('input', () => {
    const sVal = parseFloat(numClipStart?.value || '0') || 0;
    const eVal = Math.max(parseFloat(rngClipEnd.value) || 0.5, sVal + 0.5);
    if (numClipEnd) numClipEnd.value = eVal.toFixed(1);
    if (videoEl) videoEl.currentTime = eVal;
    updateRangeDurationLabel();
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

// ======================================================
// DISCORD, GO-LIVE & SENDEPLAN STUDIO
// ======================================================
(function initSocialScheduleStudio() {
  const modal = document.getElementById('socialScheduleModal');
  if (!modal) return;

  const btnOpenTop = document.getElementById('btnOpenSocialSchedule');
  const btnOpenSide = document.getElementById('btnSidebarSocialSchedule');
  const btnClose = document.getElementById('btnCloseSocialSchedule');
  const statusEl = document.getElementById('socialScheduleStatus');

  const tabBtns = modal.querySelectorAll('[data-ss-tab]');
  const panes = {
    golive: document.getElementById('ssPane_golive'),
    schedule: document.getElementById('ssPane_schedule'),
    connections: document.getElementById('ssPane_connections')
  };

  let ssState = null;
  let ssLinks = {};

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  function switchTab(tab) {
    tabBtns.forEach((b) => b.classList.toggle('active', b.dataset.ssTab === tab));
    Object.entries(panes).forEach(([k, el]) => {
      if (el) el.classList.toggle('hidden', k !== tab);
    });
  }

  tabBtns.forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.ssTab)));

  function renderScheduleList() {
    const listEl = document.getElementById('ssScheduleList');
    if (!listEl || !ssState) return;
    const items = Array.isArray(ssState.schedule) ? ssState.schedule : [];
    if (!items.length) {
      listEl.innerHTML = '<div style="font-size:12px; color:#94a3b8; padding:8px;">Noch keine Termine eingetragen.</div>';
      return;
    }
    const sorted = [...items].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    listEl.innerHTML = '';
    sorted.forEach((item) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; gap:8px; padding:7px 10px; border-radius:8px; background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.16); font-size:12px;';
      const plats = (item.platforms || []).map((p) => p.toUpperCase()).join('/');
      row.innerHTML = `
        <div style="min-width:0;">
          <div style="font-weight:700; color:#f1f5f9;">${escapeHtml(item.title)} ${item.recurringWeekly ? '🔁' : ''}</div>
          <div style="font-size:11px; color:#94a3b8;">📅 ${escapeHtml(item.date)} • 🕒 ${escapeHtml(item.time)} (${item.durationMin || 120} Min.) • ${escapeHtml(item.game || '—')} • [${escapeHtml(plats)}]</div>
        </div>
        <button class="btn-sm warn" data-del-id="${escapeHtml(item.id)}" title="Termin löschen" style="padding:3px 8px;">🗑️</button>
      `;
      row.querySelector('[data-del-id]')?.addEventListener('click', async () => {
        ssState.schedule = ssState.schedule.filter((x) => x.id !== item.id);
        const saved = await window.omnichat.socialScheduleSave(ssState);
        if (saved?.ok) {
          ssState = saved.socialSchedule;
          renderScheduleList();
          setStatus('🗑️ Termin entfernt.', '#94a3b8');
        }
      });
      listEl.appendChild(row);
    });
  }

  function fillFormFromState() {
    if (!ssState) return;
    const d = ssState.discord || {};
    const b = ssState.bluesky || {};
    const m = ssState.mastodon || {};
    const x = ssState.x || {};
    const ig = ssState.instagram || {};
    const l = ssState.links || {};

    document.getElementById('ssGoLiveMessage').value = d.goLiveMessage || '🔴 **{channel} ist jetzt LIVE!** Komm vorbei!';
    document.getElementById('chkGoLiveDiscord').checked = Boolean(d.enabled && d.webhookUrl);
    document.getElementById('chkGoLiveBluesky').checked = Boolean(b.enabled && b.handle);
    document.getElementById('chkGoLiveMastodon').checked = Boolean(m.enabled && m.accessToken);
    const chkX = document.getElementById('chkGoLiveX');
    const chkIg = document.getElementById('chkGoLiveInstagram');
    if (chkX) chkX.checked = Boolean(x.enabled && x.apiKey && x.accessToken);
    if (chkIg) chkIg.checked = Boolean(ig.enabled && ig.igUserId && ig.accessToken);

    document.getElementById('ssDiscordEnabled').checked = Boolean(d.enabled);
    document.getElementById('ssDiscordWebhook').value = d.webhookUrl || '';
    document.getElementById('ssDiscordScheduleWebhook').value = d.scheduleWebhookUrl || '';
    document.getElementById('ssDiscordRole').value = d.mentionRole || '';
    document.getElementById('ssDiscordColor').value = d.embedColor || '#9146ff';
    document.getElementById('ssDiscordAutoObs').checked = Boolean(d.autoPostOnObsLive);

    document.getElementById('ssBskyEnabled').checked = Boolean(b.enabled);
    document.getElementById('ssBskyHandle').value = b.handle || '';
    document.getElementById('ssBskyAppPass').value = b.appPassword || '';
    document.getElementById('ssBskyAutoLive').checked = Boolean(b.autoPostOnLive);

    document.getElementById('ssMastoEnabled').checked = Boolean(m.enabled);
    document.getElementById('ssMastoInstance').value = m.instanceUrl || 'https://mastodon.social';
    document.getElementById('ssMastoToken').value = m.accessToken || '';
    document.getElementById('ssMastoAutoLive').checked = Boolean(m.autoPostOnLive);

    document.getElementById('ssXEnabled').checked = Boolean(x.enabled);
    document.getElementById('ssXApiKey').value = x.apiKey || '';
    document.getElementById('ssXApiSecret').value = x.apiSecret || '';
    document.getElementById('ssXAccessToken').value = x.accessToken || '';
    document.getElementById('ssXAccessSecret').value = x.accessTokenSecret || '';
    document.getElementById('ssXAutoLive').checked = Boolean(x.autoPostOnLive);

    document.getElementById('ssIgEnabled').checked = Boolean(ig.enabled);
    document.getElementById('ssIgUserId').value = ig.igUserId || '';
    document.getElementById('ssIgAccessToken').value = ig.accessToken || '';
    document.getElementById('ssIgDefaultImgUrl').value = ig.defaultImageUrl || '';
    document.getElementById('ssIgImgbbKey').value = ig.imgbbApiKey || '';
    document.getElementById('ssIgAutoLive').checked = Boolean(ig.autoPostOnLive);

    document.getElementById('ssLinkTwitch').value = l.twitchUrl || '';
    document.getElementById('ssLinkYoutube').value = l.youtubeUrl || '';
    document.getElementById('ssLinkTiktok').value = l.tiktokUrl || '';
    document.getElementById('ssLinkKick').value = l.kickUrl || '';

    const titleInput = document.getElementById('ssGoLiveTitle');
    const gameInput = document.getElementById('ssGoLiveGame');
    if (titleInput && !titleInput.value) {
      titleInput.value = document.getElementById('inputStreamTitle')?.value || '';
    }
    if (gameInput && !gameInput.value) {
      gameInput.value = document.getElementById('inputStreamGame')?.value || '';
    }
    const dateInput = document.getElementById('ssAddDate');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }
    renderScheduleList();
  }

  function readConnectionsIntoState() {
    if (!ssState) return;
    ssState.discord = {
      ...(ssState.discord || {}),
      enabled: document.getElementById('ssDiscordEnabled').checked,
      webhookUrl: document.getElementById('ssDiscordWebhook').value.trim(),
      scheduleWebhookUrl: document.getElementById('ssDiscordScheduleWebhook').value.trim(),
      mentionRole: document.getElementById('ssDiscordRole').value.trim(),
      embedColor: document.getElementById('ssDiscordColor').value || '#9146ff',
      autoPostOnObsLive: document.getElementById('ssDiscordAutoObs').checked,
      goLiveMessage: document.getElementById('ssGoLiveMessage').value.trim() || '🔴 **{channel} ist jetzt LIVE!** Komm vorbei!'
    };
    ssState.bluesky = {
      enabled: document.getElementById('ssBskyEnabled').checked,
      handle: document.getElementById('ssBskyHandle').value.trim(),
      appPassword: document.getElementById('ssBskyAppPass').value.trim(),
      autoPostOnLive: document.getElementById('ssBskyAutoLive').checked
    };
    ssState.mastodon = {
      enabled: document.getElementById('ssMastoEnabled').checked,
      instanceUrl: document.getElementById('ssMastoInstance').value.trim() || 'https://mastodon.social',
      accessToken: document.getElementById('ssMastoToken').value.trim(),
      autoPostOnLive: document.getElementById('ssMastoAutoLive').checked
    };
    ssState.x = {
      enabled: document.getElementById('ssXEnabled').checked,
      apiKey: document.getElementById('ssXApiKey').value.trim(),
      apiSecret: document.getElementById('ssXApiSecret').value.trim(),
      accessToken: document.getElementById('ssXAccessToken').value.trim(),
      accessTokenSecret: document.getElementById('ssXAccessSecret').value.trim(),
      autoPostOnLive: document.getElementById('ssXAutoLive').checked
    };
    ssState.instagram = {
      enabled: document.getElementById('ssIgEnabled').checked,
      igUserId: document.getElementById('ssIgUserId').value.trim(),
      accessToken: document.getElementById('ssIgAccessToken').value.trim(),
      defaultImageUrl: document.getElementById('ssIgDefaultImgUrl').value.trim(),
      imgbbApiKey: document.getElementById('ssIgImgbbKey').value.trim(),
      autoPostOnLive: document.getElementById('ssIgAutoLive').checked
    };
    ssState.links = {
      twitchUrl: document.getElementById('ssLinkTwitch').value.trim(),
      youtubeUrl: document.getElementById('ssLinkYoutube').value.trim(),
      tiktokUrl: document.getElementById('ssLinkTiktok').value.trim(),
      kickUrl: document.getElementById('ssLinkKick').value.trim()
    };
  }

  async function openModal() {
    modal.classList.remove('hidden');
    setStatus('Lade Einstellungen...');
    const res = await window.omnichat.socialScheduleGet();
    if (res?.ok) {
      ssState = res.socialSchedule;
      ssLinks = res.links || {};
      fillFormFromState();
      setStatus('');
    }
  }

  btnOpenTop?.addEventListener('click', openModal);
  btnOpenSide?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  document.getElementById('btnSaveSocialConfig')?.addEventListener('click', async () => {
    readConnectionsIntoState();
    const res = await window.omnichat.socialScheduleSave(ssState);
    if (res?.ok) {
      ssState = res.socialSchedule;
      ssLinks = res.links || {};
      fillFormFromState();
      setStatus('✅ Discord & Plattform-Einstellungen gespeichert!', '#4ade80');
    } else {
      setStatus('❌ Speichern fehlgeschlagen.', '#f87171');
    }
  });

  document.getElementById('btnSsAddEntry')?.addEventListener('click', async () => {
    const title = document.getElementById('ssAddTitle').value.trim();
    const game = document.getElementById('ssAddGame').value.trim();
    const date = document.getElementById('ssAddDate').value;
    const time = document.getElementById('ssAddTime').value || '19:00';
    const durationMin = parseInt(document.getElementById('ssAddDuration').value || '180', 10) || 180;
    if (!title || !date) {
      setStatus('⚠️ Bitte Titel und Datum angeben.', '#fbbf24');
      return;
    }
    const platforms = [];
    if (document.getElementById('ssAddPlatTwitch').checked) platforms.push('twitch');
    if (document.getElementById('ssAddPlatYoutube').checked) platforms.push('youtube');
    if (document.getElementById('ssAddPlatTiktok').checked) platforms.push('tiktok');
    if (!platforms.length) platforms.push('twitch');

    ssState.schedule = ssState.schedule || [];
    ssState.schedule.push({
      id: `sch_${Date.now()}`,
      title,
      game,
      date,
      time,
      durationMin,
      platforms,
      recurringWeekly: document.getElementById('ssAddRecurring').checked
    });

    const res = await window.omnichat.socialScheduleSave(ssState);
    if (res?.ok) {
      ssState = res.socialSchedule;
      document.getElementById('ssAddTitle').value = '';
      renderScheduleList();
      setStatus('✅ Termin zum Sendeplan hinzugefügt!', '#4ade80');
    }
  });

  function buildSharePreviewText() {
    const title = document.getElementById('ssGoLiveTitle').value.trim() || 'Live-Stream';
    const game = document.getElementById('ssGoLiveGame').value.trim();
    const msg = (document.getElementById('ssGoLiveMessage').value.trim() || '🔴 Jetzt LIVE!')
      .replace(/\{channel\}/gi, document.getElementById('inputStreamerName')?.value || 'Stream')
      .replace(/\{title\}/gi, title)
      .replace(/\{game\}/gi, game || 'Just Chatting')
      .replace(/\*\*/g, '');
    const urls = [ssLinks.twitchUrl, ssLinks.youtubeUrl, ssLinks.tiktokUrl, ssLinks.kickUrl].filter(Boolean);
    return `${msg}\n📺 ${title}${game ? ` — 🎮 ${game}` : ''}${urls.length ? `\n${urls.join(' | ')}` : ''}`;
  }

  function generateSocialGraphicPng(mode = 'golive') {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.55, '#1e1b4b');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Subtle accent glow circles
    ctx.fillStyle = mode === 'golive' ? 'rgba(239, 68, 68, 0.16)' : 'rgba(56, 189, 248, 0.16)';
    ctx.beginPath();
    ctx.arc(880, 200, 320, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(145, 70, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(180, 1140, 360, 0, Math.PI * 2);
    ctx.fill();

    const channel = document.getElementById('inputStreamerName')?.value.trim() || 'OmniGrid';
    const title = document.getElementById('ssGoLiveTitle')?.value.trim() || document.getElementById('inputStreamTitle')?.value.trim() || 'Live-Stream';
    const game = document.getElementById('ssGoLiveGame')?.value.trim() || document.getElementById('inputStreamGame')?.value.trim() || 'Just Chatting';

    // Top badge
    ctx.fillStyle = mode === 'golive' ? '#ef4444' : '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(80, 88, mode === 'golive' ? 270 : 350, 58, 29);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(mode === 'golive' ? '● JETZT LIVE' : '📅 SENDEPLAN', 112, 127);

    // Channel name
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(channel.toUpperCase(), 80, 225);

    if (mode === 'golive') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 68px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const words = title.split(/\s+/);
      let line = '';
      let y = 350;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > 910) {
          ctx.fillText(line, 80, y);
          line = w;
          y += 84;
          if (y > 760) break;
        } else {
          line = test;
        }
      }
      if (line && y <= 760) ctx.fillText(line, 80, y);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(80, 860, 920, 120, 24);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(`🎮  ${game}`, 120, 932);
    } else {
      const items = (ssState?.schedule || [])
        .slice()
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .slice(0, 5);
      let y = 310;
      if (!items.length) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('Noch keine Termine eingetragen.', 80, 380);
      } else {
        for (const item of items) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.80)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(80, y, 920, 145, 22);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.fillText(`${item.date}  •  ${item.time} Uhr`, 115, y + 52);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.fillText(String(item.title || '').slice(0, 38), 115, y + 102);
          y += 168;
        }
      }
    }

    // Footer links
    const urls = [ssLinks.twitchUrl, ssLinks.youtubeUrl, ssLinks.tiktokUrl].filter(Boolean);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(urls.length ? urls.join('   •   ').slice(0, 68) : 'OmniGrid Studio', 80, 1260);

    return canvas.toDataURL('image/png');
  }

  document.getElementById('btnPostGoLiveNow')?.addEventListener('click', async () => {
    setStatus('⏳ Sende Go-Live Ankündigung...', '#38bdf8');
    const tagsRaw = document.getElementById('inputStreamTags')?.value || '';
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
    const useIg = Boolean(document.getElementById('chkGoLiveInstagram')?.checked);
    const imageBase64 = useIg ? generateSocialGraphicPng('golive') : '';

    const res = await window.omnichat.socialPostGoLive({
      title: document.getElementById('ssGoLiveTitle').value.trim(),
      game: document.getElementById('ssGoLiveGame').value.trim(),
      tags,
      message: document.getElementById('ssGoLiveMessage').value.trim(),
      imageBase64,
      targets: {
        discord: document.getElementById('chkGoLiveDiscord').checked,
        bluesky: document.getElementById('chkGoLiveBluesky').checked,
        mastodon: document.getElementById('chkGoLiveMastodon').checked,
        x: Boolean(document.getElementById('chkGoLiveX')?.checked),
        instagram: useIg
      }
    });
    if (res?.posted?.length && !res?.errors?.length) {
      setStatus(`✅ Go-Live gepostet an: ${res.posted.join(', ')}`, '#4ade80');
    } else if (res?.posted?.length) {
      setStatus(`⚠️ Gepostet (${res.posted.join(', ')}), Hinweise: ${res.errors.join(' | ')}`, '#fbbf24');
    } else {
      setStatus(`❌ ${(res?.errors || ['Keine Ziel-Plattform aktiviert oder konfiguriert.']).join(' | ')}`, '#f87171');
    }
  });

  document.getElementById('btnPostScheduleNow')?.addEventListener('click', async () => {
    setStatus('⏳ Poste Sendeplan...', '#38bdf8');
    const useIg = Boolean(ssState?.instagram?.enabled);
    const imageBase64 = useIg ? generateSocialGraphicPng('schedule') : '';
    const res = await window.omnichat.socialPostSchedule({
      imageBase64,
      targets: {
        discord: Boolean(ssState?.discord?.webhookUrl),
        bluesky: Boolean(ssState?.bluesky?.enabled),
        mastodon: Boolean(ssState?.mastodon?.enabled),
        x: Boolean(ssState?.x?.enabled),
        instagram: useIg
      }
    });
    if (res?.posted?.length && !res?.errors?.length) {
      setStatus(`✅ Sendeplan gepostet an: ${res.posted.join(', ')}`, '#4ade80');
    } else if (res?.posted?.length) {
      setStatus(`⚠️ Gepostet (${res.posted.join(', ')}), Hinweise: ${res.errors.join(' | ')}`, '#fbbf24');
    } else {
      setStatus(`❌ ${(res?.errors || ['Bitte zuerst Discord Webhook oder Social-Account konfigurieren.']).join(' | ')}`, '#f87171');
    }
  });

  async function runInstagramQuickPost(mode) {
    const pngDataUrl = generateSocialGraphicPng(mode);
    const fileName = mode === 'schedule' ? `sendeplan-${Date.now()}.png` : `golive-${Date.now()}.png`;
    const saveRes = await window.omnichat.socialSaveGraphicPng({ base64Png: pngDataUrl, fileName });
    const caption = mode === 'schedule'
      ? `📅 Stream-Sendeplan!\n\n#livestream #twitch #youtube #gaming #sendeplan`
      : `${buildSharePreviewText()}\n\n#livestream #twitch #youtube #gaming #live`;
    await navigator.clipboard.writeText(caption);
    window.omnichat.openExternalUrl('https://www.instagram.com/');
    if (saveRes?.ok) {
      setStatus(`📸 Grafik gespeichert (${saveRes.filePath}), Caption kopiert & Instagram geöffnet!`, '#4ade80');
    }
  }

  document.getElementById('btnIgQuickPostGoLive')?.addEventListener('click', () => runInstagramQuickPost('golive'));
  document.getElementById('btnIgQuickPostSchedule')?.addEventListener('click', () => runInstagramQuickPost('schedule'));

  document.getElementById('btnSyncTwitchSchedule')?.addEventListener('click', async () => {
    setStatus('⏳ Synchronisiere Termine mit Twitch Schedule...', '#38bdf8');
    const res = await window.omnichat.socialSyncTwitchSchedule();
    if (res?.ok) {
      setStatus(`✅ ${res.created.length} Termin(e) auf Twitch Schedule übertragen!`, '#4ade80');
    } else {
      setStatus(`❌ ${res?.error || (res?.errors || []).join(' | ') || 'Twitch Sync fehlgeschlagen.'}`, '#f87171');
    }
  });

  document.getElementById('btnExportIcs')?.addEventListener('click', async () => {
    const res = await window.omnichat.socialExportIcs();
    if (res?.ok) {
      setStatus(`✅ .ics Kalender gespeichert: ${res.filePath}`, '#4ade80');
    }
  });

  document.getElementById('btnCopyObsScheduleUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/schedule');
    setStatus('🔗 OBS Browser-Quelle kopiert: http://127.0.0.1:4588/schedule (auch .ics unter /schedule.ics)', '#4ade80');
  });

  document.getElementById('btnShareX')?.addEventListener('click', () => {
    const text = buildSharePreviewText();
    window.omnichat.openExternalUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  });

  document.getElementById('btnShareThreads')?.addEventListener('click', () => {
    const text = buildSharePreviewText();
    window.omnichat.openExternalUrl(`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`);
  });

  document.getElementById('btnShareYtCommunity')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(buildSharePreviewText());
    window.omnichat.openExternalUrl('https://studio.youtube.com');
    setStatus('📋 Go-Live Text kopiert & YouTube Studio geöffnet!', '#4ade80');
  });

  document.getElementById('btnCopyGoLiveText')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(buildSharePreviewText());
    setStatus('📋 Go-Live Text in die Zwischenablage kopiert!', '#4ade80');
  });
})();

// ======================================================
// LIVE-GIVEAWAY / VERLOSUNGS-RAD
// ======================================================
(function initGiveawayModal() {
  const modal = document.getElementById('giveawayModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenGiveaway');
  const btnClose = document.getElementById('btnCloseGiveaway');
  const box = document.getElementById('gwWinnerBox');
  const countEl = document.getElementById('gwPartCount');
  const listEl = document.getElementById('gwPartList');

  function renderGw(gw) {
    if (!gw) return;
    const parts = Array.isArray(gw.participants) ? gw.participants : [];
    if (countEl) countEl.textContent = String(parts.length);
    if (box) {
      if (gw.spinning) {
        box.innerHTML = '🎲 <strong>Ziehung läuft auf OBS-Overlay...</strong>';
      } else if (gw.winner) {
        box.innerHTML = `🏆 Gewinner: <strong style="color:#fde047;">${escapeHtml(gw.winner.name)}</strong> (${escapeHtml(gw.winner.platform)})`;
      } else if (gw.active) {
        box.innerHTML = `🟢 <strong>Teilnahme offen</strong> — Keyword: <code>${escapeHtml(gw.keyword)}</code> (${gw.subMultiplier}× für Subs/VIPs/Mods)`;
      } else {
        box.innerHTML = `⏸ <strong>Pausiert / Bereit</strong> — OBS Overlay: ${gw.visible ? 'Sichtbar' : 'Ausgeblendet'}`;
      }
    }
    if (listEl) {
      listEl.innerHTML = '';
      parts.forEach((p) => {
        const pill = document.createElement('span');
        pill.style.cssText = 'font-size:11px; padding:3px 8px; border-radius:999px; background:rgba(30,41,59,0.9); border:1px solid rgba(148,163,184,0.25); color:#f1f5f9;';
        pill.textContent = `${p.name}${p.weight > 1 ? ` (${p.weight}×)` : ''}`;
        listEl.appendChild(pill);
      });
    }
  }

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.giveawayAction({ action: 'get' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

  document.getElementById('btnGwStart')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({
      action: 'start',
      title: document.getElementById('gwInputTitle')?.value || 'Stream-Verlosung',
      keyword: document.getElementById('gwInputKeyword')?.value || '!join',
      subMultiplier: document.getElementById('gwSelectMult')?.value || 2
    });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwStop')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'stop' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwDraw')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'draw' });
    if (res?.giveaway) renderGw(res.giveaway);
    if (res?.error && box) box.innerHTML = `⚠️ ${escapeHtml(res.error)}`;
  });
  document.getElementById('btnGwReset')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'reset' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwToggleObs')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'toggle-visible' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/giveaway');
    if (box) box.innerHTML = '🔗 <strong>http://127.0.0.1:4588/giveaway</strong> kopiert!';
  });

  window.omnichat.onGiveawayUpdated((gw) => renderGw(gw));
})();

// ======================================================
// INTEGRIERTES SOUNDBOARD (INKL. OBS-ROUTING)
// ======================================================
(function initSoundboardModal() {
  const modal = document.getElementById('soundboardModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenSoundboard');
  const btnClose = document.getElementById('btnCloseSoundboard');
  const grid = document.getElementById('sbGrid');
  const statusEl = document.getElementById('sbStatus');
  const volInput = document.getElementById('sbVolume');
  const chkLocal = document.getElementById('sbPlayLocal');
  const chkObs = document.getElementById('sbRouteObs');
  let sbState = { volume: 0.8, playLocally: true, routeToObs: true, sounds: [] };

  function playSoundLocally(s) {
    if (!s) return;
    const vol = Math.max(0, Math.min(1, Number(s.volume ?? 0.8)));
    if (s.url) {
      const a = new Audio(s.url);
      a.volume = vol;
      a.play().catch(() => {});
    } else if (s.builtin) {
      try {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const g = actx.createGain();
        g.gain.value = vol * 0.35;
        g.connect(actx.destination);
        const o = actx.createOscillator();
        o.type = s.builtin === 'airhorn' ? 'sawtooth' : s.builtin === 'alarm' ? 'square' : 'sine';
        o.frequency.setValueAtTime(s.builtin === 'airhorn' ? 440 : s.builtin === 'ding' ? 880 : s.builtin === 'rimshot' ? 220 : 660, actx.currentTime);
        o.connect(g);
        o.start();
        o.stop(actx.currentTime + (s.builtin === 'airhorn' ? 0.55 : 0.25));
      } catch (e) {}
    }
  }

  window.omnichat.onSoundboardPlay((payload) => playSoundLocally(payload));

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = '';
    (sbState.sounds || []).forEach((s) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex; align-items:center; gap:4px; background:rgba(30,41,59,0.85); border:1px solid rgba(148,163,184,0.22); border-radius:10px; padding:6px;';
      const playBtn = document.createElement('button');
      playBtn.className = 'btn-sm';
      playBtn.style.cssText = 'flex:1; text-align:left; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      playBtn.textContent = `${s.emoji || '🔊'} ${s.name}`;
      playBtn.addEventListener('click', () => window.omnichat.soundboardPlay(s.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-sm warn';
      delBtn.style.padding = '3px 6px';
      delBtn.textContent = '✕';
      delBtn.title = 'Sound entfernen';
      delBtn.addEventListener('click', async () => {
        sbState.sounds = sbState.sounds.filter((x) => x.id !== s.id);
        await window.omnichat.soundboardSave(sbState);
        renderGrid();
      });

      wrap.appendChild(playBtn);
      wrap.appendChild(delBtn);
      grid.appendChild(wrap);
    });
  }

  async function saveSettings() {
    sbState.volume = parseFloat(volInput?.value || '0.8') || 0.8;
    sbState.playLocally = Boolean(chkLocal?.checked);
    sbState.routeToObs = Boolean(chkObs?.checked);
    await window.omnichat.soundboardSave(sbState);
  }

  volInput?.addEventListener('change', saveSettings);
  chkLocal?.addEventListener('change', saveSettings);
  chkObs?.addEventListener('change', saveSettings);

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.soundboardGet();
    if (res?.ok && res.soundboard) {
      sbState = res.soundboard;
      if (volInput) volInput.value = String(sbState.volume ?? 0.8);
      if (chkLocal) chkLocal.checked = sbState.playLocally !== false;
      if (chkObs) chkObs.checked = sbState.routeToObs !== false;
      renderGrid();
    }
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

  document.getElementById('btnSbAddFile')?.addEventListener('click', async () => {
    const pick = await window.omnichat.soundboardPickFile();
    if (!pick?.ok) return;
    sbState.sounds = sbState.sounds || [];
    sbState.sounds.push({
      id: `sb_${Date.now()}`,
      name: pick.name || 'Sound',
      emoji: '🎵',
      builtin: '',
      filePath: pick.filePath
    });
    await window.omnichat.soundboardSave(sbState);
    renderGrid();
    if (statusEl) statusEl.textContent = `✅ Sound hinzugefügt: ${pick.name}`;
  });

  document.getElementById('btnSbCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/soundboard');
    if (statusEl) statusEl.textContent = '🔗 http://127.0.0.1:4588/soundboard kopiert! (Hinweis: /alerts spielt Sounds ebenfalls direkt mit ab.)';
  });
})();

// ======================================================
// CHAT-HYPE-DETEKTOR
// ======================================================
(function initHypeModal() {
  const modal = document.getElementById('hypeModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenHype');
  const btnClose = document.getElementById('btnCloseHype');
  const statusEl = document.getElementById('hdStatus');

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.hypeGet();
    if (res?.ok && res.hypeDetector) {
      const hd = res.hypeDetector;
      document.getElementById('hdEnabled').checked = Boolean(hd.enabled);
      const meterInit = document.getElementById('hdMeter');
      if (meterInit && !hd.enabled) {
        meterInit.style.color = '#fbbf24';
        meterInit.textContent = '⚠️ Detektor ist deaktiviert — oben „Chat-Hype-Detektor aktivieren“ anhaken, sonst reagieren Keywords nicht.';
      }
      document.getElementById('hdWindowSec').value = hd.windowSec || 10;
      document.getElementById('hdMinMsgs').value = hd.minMessages || 12;
      document.getElementById('hdCooldownSec').value = hd.cooldownSec || 90;
      const elKwHits = document.getElementById('hdKeywordHits');
      if (elKwHits) elKwHits.value = hd.keywordHits || 3;
      document.getElementById('hdKeywords').value = hd.keywords || '';
      document.getElementById('hdAutoMarker').checked = hd.autoMarker !== false;
      document.getElementById('hdAutoObsReplay').checked = Boolean(hd.autoObsReplay);
      document.getElementById('hdAutoClip').checked = hd.autoClip !== false;
      const elPostChat = document.getElementById('hdPostClipToChat');
      if (elPostChat) elPostChat.checked = hd.postClipToChat !== false;
    }
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

  function readHypeForm() {
    return {
      enabled: Boolean(document.getElementById('hdEnabled')?.checked),
      windowSec: parseInt(document.getElementById('hdWindowSec')?.value || '10', 10) || 10,
      minMessages: parseInt(document.getElementById('hdMinMsgs')?.value || '12', 10) || 12,
      cooldownSec: parseInt(document.getElementById('hdCooldownSec')?.value || '90', 10) || 90,
      keywordHits: parseInt(document.getElementById('hdKeywordHits')?.value || '3', 10) || 3,
      keywords: document.getElementById('hdKeywords')?.value.trim() || '',
      autoMarker: Boolean(document.getElementById('hdAutoMarker')?.checked),
      autoObsReplay: Boolean(document.getElementById('hdAutoObsReplay')?.checked),
      autoClip: Boolean(document.getElementById('hdAutoClip')?.checked),
      postClipToChat: document.getElementById('hdPostClipToChat')?.checked !== false
    };
  }

  ['hdEnabled', 'hdWindowSec', 'hdMinMsgs', 'hdKeywordHits', 'hdCooldownSec', 'hdKeywords', 'hdAutoMarker', 'hdAutoObsReplay', 'hdAutoClip', 'hdPostClipToChat'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', async () => {
      const res = await window.omnichat.hypeSave(readHypeForm());
      if (res?.ok && statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = '✅ Hype-Einstellungen automatisch gespeichert!';
      }
    });
  });

  document.getElementById('btnSaveHype')?.addEventListener('click', async () => {
    const res = await window.omnichat.hypeSave(readHypeForm());
    if (res?.ok && statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = '✅ Hype-Detektor gespeichert!';
    }
  });

  function renderHypeResult(ev) {
    if (!statusEl || !ev) return;
    const acts = Array.isArray(ev.actions) && ev.actions.length ? `✅ ${ev.actions.join(' • ')}` : '';
    const errs = Array.isArray(ev.errors) && ev.errors.length ? `⚠️ ${ev.errors.join(' | ')}` : '';
    const clipPart = ev.clipUrl ? ` 🎬 Clip: ${ev.clipUrl}` : '';
    statusEl.style.color = errs && !acts ? '#f87171' : errs ? '#fbbf24' : '#4ade80';
    statusEl.textContent = [acts || `🔥 ${ev.desc || 'Hype ausgelöst'}`, clipPart, errs].filter(Boolean).join(' — ');
  }

  document.getElementById('btnTriggerHypeNow')?.addEventListener('click', async () => {
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = '⏳ Löse Hype aus (erstelle Clip / Marker / Replay)...';
    }
    const res = await window.omnichat.hypeTriggerNow?.(readHypeForm());
    renderHypeResult(res);
  });

  window.omnichat.onHypeTriggered((ev) => {
    if (btnOpen) {
      btnOpen.style.boxShadow = '0 0 12px #f97316';
      setTimeout(() => { btnOpen.style.boxShadow = ''; }, 5000);
    }
    renderHypeResult(ev);
  });

  window.omnichat.onHypeMeter?.((m) => {
    const meterEl = document.getElementById('hdMeter');
    if (!meterEl || !m) return;
    const kwPart = m.matchedKw ? ` • zuletzt erkannt: „${m.matchedKw}“` : '';
    const cdPart = m.cooldownLeft > 0 ? ` • ⏳ Cooldown noch ${m.cooldownLeft}s` : '';
    meterEl.style.color = m.matchedKw ? '#fb923c' : '#94a3b8';
    meterEl.textContent = `📊 Hype-Meter: ${m.score}/${m.minMsgs} Punkte • Keywords ${m.kwCount}/${m.kwNeeded}${kwPart}${cdPart}`;
  });
})();

// ======================================================
// GAME-ADDONS & OBS GAME-STATS OVERLAY (/game-stats)
// ======================================================
(function initGameAddonsModal() {
  const modal = document.getElementById('gameAddonsModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenGameAddons');
  const btnClose = document.getElementById('btnCloseGameAddons');
  const selAddon = document.getElementById('gaSelectAddon');
  const gameInput = document.getElementById('gaCurrentGameInput');
  const banner = document.getElementById('gaActiveBanner');
  const fieldsEl = document.getElementById('gaStatsFields');
  const chkLol = document.getElementById('gaLolPolling');
  const chkTrigger = document.getElementById('gaAutoTrigger');
  const statusEl = document.getElementById('gaStatus');

  let gaState = null;
  let allAddons = [];

  function resolveAddonInRenderer() {
    const mode = selAddon?.value || gaState?.selectedMode || 'auto';
    if (mode !== 'auto') {
      return allAddons.find((a) => a.id === mode) || allAddons[allAddons.length - 1];
    }
    const g = (gameInput?.value || gaState?.currentGameName || '').toLowerCase();
    for (const a of allAddons) {
      if ((a.gameMatches || []).some((m) => g.includes(m))) return a;
    }
    return allAddons.find((a) => a.id === 'universal') || allAddons[0];
  }

  function renderFields() {
    if (!gaState || !allAddons.length) return;
    const addon = resolveAddonInRenderer();
    if (!addon) return;
    const stats = (gaState.perAddonStats && gaState.perAddonStats[addon.id]) || {};
    if (banner) {
      const previewIcon = stats.skinIconUrl || stats.championIconUrl;
      const lolPreview = addon.id === 'lol' && previewIcon
        ? `<div style="display:flex; align-items:center; gap:8px; margin-top:6px;"><img src="${escapeHtml(previewIcon)}" style="width:36px; height:36px; object-fit:cover; object-position:center 15%; border-radius:4px; border:1.5px solid #c8aa6e;" /><div><strong style="color:#f0e6d2;">${escapeHtml(stats.champion || '')}</strong><div style="font-size:11px; color:#0ac8b9;">✨ ${escapeHtml(stats.skinName || 'Classic')}</div></div></div>`
        : '';
      banner.innerHTML = `${addon.icon} Aktives Addon: <strong>${escapeHtml(addon.name)}</strong> • Chat-Commands: <code>${(addon.chatCommands || []).join('</code>, <code>')}</code><div style="font-size:11px; color:#94a3b8; margin-top:3px;">${escapeHtml(addon.eventHint || '')}</div>${lolPreview}`;
    }
    const lolMatchBox = document.getElementById('gaLolMatchControls');
    if (lolMatchBox) lolMatchBox.classList.toggle('hidden', addon.id !== 'lol');
    const chkMapCover = document.getElementById('gaLolMapCover');
    const txtMapCover = document.getElementById('gaLolMapCoverText');
    if (chkMapCover) chkMapCover.checked = Boolean(gaState.perAddonStats?.lol?.mapCoverEnabled);
    if (txtMapCover) txtMapCover.value = gaState.perAddonStats?.lol?.mapCoverText || 'Minimap verdeckt • Kein Ghosting';

    if (!fieldsEl) return;
    fieldsEl.innerHTML = '';
    (addon.fields || []).forEach((f) => {
      const box = document.createElement('div');
      box.style.cssText = 'background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.2); border-radius:8px; padding:8px;';
      const lbl = document.createElement('label');
      lbl.style.cssText = 'font-size:11px; color:#94a3b8; display:block;';
      lbl.textContent = f.label;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:4px; margin-top:4px; align-items:center;';
      const inp = document.createElement('input');
      inp.type = f.type === 'number' ? 'number' : 'text';
      inp.value = stats[f.key] !== undefined ? String(stats[f.key]) : '';
      inp.style.flex = '1';
      inp.dataset.gaKey = f.key;
      inp.dataset.gaType = f.type;
      row.appendChild(inp);

      if (f.type === 'number') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'btn-sm';
        plusBtn.textContent = '+1';
        plusBtn.addEventListener('click', () => {
          inp.value = String((parseInt(inp.value || '0', 10) || 0) + 1);
          saveFromForm();
        });
        row.appendChild(plusBtn);
      }
      box.appendChild(lbl);
      box.appendChild(row);
      fieldsEl.appendChild(box);
    });
  }

  async function saveFromForm() {
    if (!gaState) return;
    const addon = resolveAddonInRenderer();
    gaState.selectedMode = selAddon?.value || 'auto';
    gaState.currentGameName = gameInput?.value.trim() || '';
    gaState.lolPollingEnabled = Boolean(chkLol?.checked);
    gaState.autoTriggerEvents = Boolean(chkTrigger?.checked);
    gaState.overlayEnabled = document.getElementById('gaOverlayEnabled')?.checked !== false;

    if (addon && fieldsEl) {
      const nextAddonStats = { ...(gaState.perAddonStats?.[addon.id] || {}) };
      fieldsEl.querySelectorAll('input[data-ga-key]').forEach((inp) => {
        const k = inp.dataset.gaKey;
        nextAddonStats[k] = inp.dataset.gaType === 'number' ? (parseInt(inp.value || '0', 10) || 0) : inp.value;
      });
      if (addon.id === 'lol') {
        nextAddonStats.mapCoverEnabled = Boolean(document.getElementById('gaLolMapCover')?.checked);
        nextAddonStats.mapCoverText = document.getElementById('gaLolMapCoverText')?.value.trim() || 'Minimap verdeckt • Kein Ghosting';
      }
      gaState.perAddonStats = { ...(gaState.perAddonStats || {}), [addon.id]: nextAddonStats };
    }
    const res = await window.omnichat.gameAddonsSave(gaState);
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ OBS /game-stats & Chat-Events auf "${addon?.name || gaState.selectedMode}" aktualisiert!`;
      }
    }
  }

  selAddon?.addEventListener('change', () => {
    renderFields();
    saveFromForm();
  });
  gameInput?.addEventListener('change', () => {
    renderFields();
    saveFromForm();
  });

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.gameAddonsGet();
    if (res?.ok) {
      gaState = res.gameAddons;
      allAddons = res.addons || [];
      if (selAddon) selAddon.value = gaState.selectedMode || 'auto';
      if (gameInput) gameInput.value = gaState.currentGameName || document.getElementById('inputStreamGame')?.value || '';
      if (chkLol) chkLol.checked = Boolean(gaState.lolPollingEnabled);
      if (chkTrigger) chkTrigger.checked = gaState.autoTriggerEvents !== false;
      const chkOverlay = document.getElementById('gaOverlayEnabled');
      if (chkOverlay) chkOverlay.checked = gaState.overlayEnabled !== false;
      renderFields();
    }
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

  document.getElementById('btnGaSave')?.addEventListener('click', saveFromForm);
  document.getElementById('gaOverlayEnabled')?.addEventListener('change', async (e) => {
    await saveFromForm();
    if (statusEl) {
      statusEl.style.color = e.target.checked ? '#4ade80' : '#fbbf24';
      statusEl.textContent = e.target.checked ? '👁️ Game-Stats-Overlay in OBS wieder eingeblendet.' : '🙈 Game-Stats-Overlay in OBS ausgeblendet.';
    }
  });
  document.getElementById('btnGaReset')?.addEventListener('click', async () => {
    const addon = resolveAddonInRenderer();
    if (!addon) return;
    if (!confirm(`Werte von "${addon.name}" auf Standard zurücksetzen?`)) return;
    const res = await window.omnichat.gameAddonsReset?.(addon.id);
    if (res?.ok) {
      gaState = res.gameAddons;
      renderFields();
      if (statusEl) { statusEl.style.color = '#94a3b8'; statusEl.textContent = `↺ ${addon.name}: Standardwerte wiederhergestellt.`; }
    }
  });
  document.getElementById('gaLolMapCover')?.addEventListener('change', saveFromForm);
  document.getElementById('btnGaCopyMapUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/lol-map');
    if (statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = '🔗 http://127.0.0.1:4588/lol-map kopiert! (In OBS über die Minimap legen, z. B. 280×280)';
    }
  });
  document.getElementById('btnGaExportCs2')?.addEventListener('click', async () => {
    const res = await window.omnichat.gameAddonsExportCs2Gsi();
    if (res?.ok && statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = `📄 CS2 GSI Config gespeichert: ${res.filePath} (in CS2 Ordner game/csgo/cfg/ kopieren)`;
    }
  });
  document.getElementById('btnGaCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/game-stats');
    if (statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = '🔗 http://127.0.0.1:4588/game-stats kopiert!';
    }
  });

  document.getElementById('btnGaLolWin')?.addEventListener('click', async () => {
    const champ = fieldsEl?.querySelector('input[data-ga-key="champion"]')?.value || '';
    const res = await window.omnichat.gameAddonsLolRecordMatch({ win: true, champion: champ });
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🏆 Sieg zu den letzten 6 Matches hinzugefügt!'; }
    }
  });
  document.getElementById('btnGaLolLoss')?.addEventListener('click', async () => {
    const champ = fieldsEl?.querySelector('input[data-ga-key="champion"]')?.value || '';
    const res = await window.omnichat.gameAddonsLolRecordMatch({ win: false, champion: champ });
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) { statusEl.style.color = '#fbbf24'; statusEl.textContent = '💀 Niederlage zu den letzten 6 Matches hinzugefügt!'; }
    }
  });
  document.getElementById('btnGaLolClearMatches')?.addEventListener('click', async () => {
    const res = await window.omnichat.gameAddonsLolRecordMatch({ clear: true });
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) { statusEl.style.color = '#94a3b8'; statusEl.textContent = '🗑️ Match-Historie geleert.'; }
    }
  });

  window.omnichat.onGameAddonsUpdated((payload) => {
    if (!payload?.gameAddons) return;
    gaState = payload.gameAddons;
    allAddons = payload.addons || allAddons;
    if (!modal.classList.contains('hidden')) {
      if (selAddon) selAddon.value = gaState.selectedMode || 'auto';
      if (gameInput) gameInput.value = gaState.currentGameName || '';
      renderFields();
    }
  });
})();

// ======================================================
// OPTIONALER OBS SZENEN- & QUELLEN-EDITOR (WebSocket v5)
// ======================================================
(function initObsSceneEditorModal() {
  const modal = document.getElementById('obsSceneEditorModal');
  const btnOpen = document.getElementById('btnOpenSceneEditor');
  if (!modal) return;

  const btnClose = document.getElementById('btnCloseSceneEditor');
  const selScene = document.getElementById('seSelectScene');
  const newSceneInput = document.getElementById('seNewSceneName');
  const btnCreateScene = document.getElementById('btnSeCreateScene');
  const btnRefresh = document.getElementById('btnSeRefresh');
  const chkAutoPreview = document.getElementById('seAutoPreview');
  const vcamVideo = document.getElementById('seVirtualCamVideo');
  const previewImg = document.getElementById('sePreviewImg');
  const previewPlaceholder = document.getElementById('sePreviewPlaceholder');
  const canvasOverlay = document.getElementById('seCanvasOverlay');
  const sourcesList = document.getElementById('seSourcesList');
  const audioList = document.getElementById('seAudioList');
  const statusEl = document.getElementById('seStatus');

  const lblSelSource = document.getElementById('seSelectedSourceName');
  const inpPosX = document.getElementById('sePosX');
  const inpPosY = document.getElementById('sePosY');
  const inpScalePct = document.getElementById('seScalePct');
  const btnApplyTransform = document.getElementById('btnSeApplyTransform');
  const btnCenter = document.getElementById('btnSeCenter');
  const btnFullscreen = document.getElementById('btnSeFullscreen');

  let currentSceneName = '';
  let baseWidth = 1920;
  let baseHeight = 1080;
  let sceneItems = [];
  let selectedItem = null;
  let previewTimer = null;
  let dragState = null;
  let vcamStream = null;
  let vcamStartedByEditor = false;

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  const sourceConfigBox = document.getElementById('seSourceConfigBox');
  const sourceConfigFields = document.getElementById('seSourceConfigFields');
  const btnRefreshSourceConfig = document.getElementById('btnSeRefreshSourceConfig');
  let configLoadSeq = 0;

  btnRefreshSourceConfig?.addEventListener('click', () => {
    if (selectedItem) loadInputConfig(selectedItem);
  });

  const PROP_LABELS = {
    type: '🎛️ Aufnahme-Modus',
    window: '🪟 Fenster',
    application: '📱 Anwendung',
    display_uuid: '🖥️ Bildschirm',
    display: '🖥️ Bildschirm',
    device: '📷 / 🎙️ Gerät',
    device_id: '📷 / 🎙️ Gerät'
  };

  async function loadInputConfig(item) {
    const seq = ++configLoadSeq;
    if (!sourceConfigBox || !sourceConfigFields) return;
    if (!item) {
      sourceConfigBox.style.display = 'none';
      sourceConfigFields.innerHTML = '';
      return;
    }
    const res = await window.omnichat.obsWsAction({
      action: 'inspect-input',
      inputName: item.sourceName
    });
    if (seq !== configLoadSeq) return;
    if (!res?.ok) {
      sourceConfigBox.style.display = 'none';
      sourceConfigFields.innerHTML = '';
      return;
    }

    const props = res.properties || {};
    const settings = res.inputSettings || {};
    const propKeys = ['type', 'display_uuid', 'display', 'window', 'application', 'device', 'device_id']
      .filter((k) => Array.isArray(props[k]));
    const hasUrl = typeof settings.url === 'string';

    sourceConfigFields.innerHTML = '';
    if (!propKeys.length && !hasUrl) {
      sourceConfigBox.style.display = 'none';
      return;
    }
    sourceConfigBox.style.display = 'block';

    propKeys.forEach((prop) => {
      const items = props[prop];
      if (res.inputKind === 'screen_capture') {
        const t = Number(settings.type || 0);
        if (prop === 'window' && t !== 1) return;
        if (prop === 'application' && t !== 2) return;
        if (prop === 'display' && t === 1) return;
      } else if (items.length === 0) {
        return;
      }

      const wrap = document.createElement('div');
      const lbl = document.createElement('label');
      lbl.style.fontSize = '10px';
      lbl.textContent = PROP_LABELS[prop] || prop;
      const sel = document.createElement('select');
      const valMap = new Map();
      let matched = false;
      items.forEach((p, idx) => {
        const key = String(idx);
        valMap.set(key, p.itemValue);
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = p.itemName || String(p.itemValue);
        if (p.itemEnabled === false) opt.disabled = true;
        if (settings[prop] !== undefined && settings[prop] !== null && (p.itemValue === settings[prop] || String(p.itemValue) === String(settings[prop]))) {
          opt.selected = true;
          matched = true;
        }
        sel.appendChild(opt);
      });
      if (!matched) {
        const ph = document.createElement('option');
        ph.value = '';
        ph.textContent = items.length ? '— Bitte wählen —' : '— Keine Einträge gefunden —';
        ph.selected = true;
        ph.disabled = true;
        sel.insertBefore(ph, sel.firstChild);
      }
      sel.addEventListener('change', async () => {
        if (!sel.value) return;
        const chosenVal = valMap.get(sel.value);
        const upd = await window.omnichat.obsWsAction({
          action: 'set-input-settings',
          inputName: item.sourceName,
          inputSettings: { [prop]: chosenVal }
        });
        if (upd?.ok) {
          setStatus(`✅ ${PROP_LABELS[prop] || prop} aktualisiert`, '#4ade80');
          if (prop === 'type') {
            await new Promise((r) => setTimeout(r, 300));
            await loadInputConfig(item);
          } else {
            await new Promise((r) => setTimeout(r, 250));
          }
          refreshPreview();
        } else {
          setStatus(`❌ ${upd?.error || 'Einstellung konnte nicht gespeichert werden.'}`, '#f87171');
        }
      });
      wrap.appendChild(lbl);
      wrap.appendChild(sel);
      sourceConfigFields.appendChild(wrap);
    });

    if (hasUrl) {
      const wrap = document.createElement('div');
      const lbl = document.createElement('label');
      lbl.style.fontSize = '10px';
      lbl.textContent = '🌐 Browser-URL';
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 6px;';
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = settings.url || '';
      const btn = document.createElement('button');
      btn.className = 'btn-sm';
      btn.textContent = '💾';
      btn.title = 'URL übernehmen';
      const applyUrl = async () => {
        const upd = await window.omnichat.obsWsAction({
          action: 'set-input-settings',
          inputName: item.sourceName,
          inputSettings: { url: inp.value.trim() }
        });
        if (upd?.ok) {
          setStatus('✅ URL aktualisiert', '#4ade80');
          refreshPreview();
        }
      };
      btn.addEventListener('click', applyUrl);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyUrl(); });
      row.appendChild(inp);
      row.appendChild(btn);
      wrap.appendChild(lbl);
      wrap.appendChild(row);
      sourceConfigFields.appendChild(wrap);
    }
  }

  function isAudioOnlyItem(it) {
    if (!it) return false;
    const k = String(it.inputKind || '').toLowerCase();
    if (k.includes('audio') || k === 'sck_audio_capture') return true;
    const tr = it.transform || {};
    const hasNoVideoSize =
      Number(tr.sourceWidth || 0) === 0 &&
      Number(tr.sourceHeight || 0) === 0 &&
      Number(tr.width || 0) === 0 &&
      Number(tr.height || 0) === 0;
    if (hasNoVideoSize && !/screen|window|display|browser|image|ffmpeg|color|text|avcapture|av_capture|dshow|game/i.test(k)) {
      return true;
    }
    return false;
  }

  function selectSourceItem(item) {
    selectedItem = item;
    const disabled = !item || isAudioOnlyItem(item);
    [inpPosX, inpPosY, inpScalePct, btnApplyTransform, btnCenter, btnFullscreen].forEach((el) => {
      if (el) el.disabled = disabled;
    });
    if (!item) {
      if (lblSelSource) lblSelSource.textContent = '— Quelle anklicken —';
      loadInputConfig(null);
      return;
    }
    if (lblSelSource) lblSelSource.textContent = item.sourceName;
    const tr = item.transform || {};
    if (inpPosX) inpPosX.value = String(Math.round(tr.positionX || 0));
    if (inpPosY) inpPosY.value = String(Math.round(tr.positionY || 0));
    if (inpScalePct) inpScalePct.value = String(Math.round((tr.scaleX || 1) * 100));
    loadInputConfig(item);
  }

  function getItemBoxPx(it) {
    const tr = it.transform || {};
    const x = Number(tr.positionX || 0);
    const y = Number(tr.positionY || 0);
    const w = Math.max(40, Number(tr.width || (tr.sourceWidth || 400) * (tr.scaleX || 1)));
    const h = Math.max(30, Number(tr.height || (tr.sourceHeight || 225) * (tr.scaleY || 1)));
    return { x, y, w, h };
  }

  function renderCanvasOverlay() {
    if (!canvasOverlay) return;
    canvasOverlay.innerHTML = '';
    // Render bottom-to-top (reverse of top-to-bottom list) so top OBS layer sits on top
    const drawOrder = sceneItems.slice().reverse();
    drawOrder.forEach((it) => {
      if (!it.sceneItemEnabled || isAudioOnlyItem(it)) return;
      const { x, y, w, h } = getItemBoxPx(it);
      const isSel = selectedItem?.sceneItemId === it.sceneItemId;

      const box = document.createElement('div');
      box.style.cssText = `
        position: absolute;
        left: ${(x / baseWidth) * 100}%;
        top: ${(y / baseHeight) * 100}%;
        width: ${(w / baseWidth) * 100}%;
        height: ${(h / baseHeight) * 100}%;
        border: ${isSel ? '2px solid #38bdf8' : '1px dashed rgba(255,255,255,0.32)'};
        background: ${isSel ? 'rgba(56,189,248,0.12)' : 'transparent'};
        box-sizing: border-box;
        cursor: move;
      `;

      const tag = document.createElement('div');
      tag.style.cssText = `position:absolute; top:2px; left:2px; font-size:10px; font-weight:700; padding:1px 5px; border-radius:4px; background:${isSel ? '#0284c7' : 'rgba(15,23,42,0.78)'}; color:#f8fafc; pointer-events:none; white-space:nowrap; max-width:95%; overflow:hidden; text-overflow:ellipsis;`;
      tag.textContent = it.sourceName;
      box.appendChild(tag);

      box.addEventListener('mousedown', (e) => {
        if (e.target.dataset.handle) return;
        e.preventDefault();
        e.stopPropagation();
        selectSourceItem(it);
        renderSourcesList();
        renderCanvasOverlay();
        const rect = canvasOverlay.getBoundingClientRect();
        dragState = {
          mode: 'move',
          item: it,
          startMouseX: e.clientX,
          startMouseY: e.clientY,
          rect,
          origX: x,
          origY: y,
          origW: w,
          origH: h
        };
      });

      if (isSel) {
        const corners = [
          { id: 'nw', css: 'top:-5px; left:-5px; cursor:nwse-resize;' },
          { id: 'ne', css: 'top:-5px; right:-5px; cursor:nesw-resize;' },
          { id: 'sw', css: 'bottom:-5px; left:-5px; cursor:nesw-resize;' },
          { id: 'se', css: 'bottom:-5px; right:-5px; cursor:nwse-resize;' }
        ];
        corners.forEach((c) => {
          const hnd = document.createElement('div');
          hnd.dataset.handle = c.id;
          hnd.style.cssText = `position:absolute; width:10px; height:10px; border-radius:2px; background:#38bdf8; border:1px solid #020617; ${c.css}`;
          hnd.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = canvasOverlay.getBoundingClientRect();
            dragState = {
              mode: 'resize',
              corner: c.id,
              item: it,
              startMouseX: e.clientX,
              startMouseY: e.clientY,
              rect,
              origX: x,
              origY: y,
              origW: w,
              origH: h
            };
          });
          box.appendChild(hnd);
        });
      }

      canvasOverlay.appendChild(box);
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (!dragState) return;
    const dxCanvas = ((e.clientX - dragState.startMouseX) / dragState.rect.width) * baseWidth;
    const dyCanvas = ((e.clientY - dragState.startMouseY) / dragState.rect.height) * baseHeight;
    const it = dragState.item;
    const tr = it.transform || {};

    if (dragState.mode === 'move') {
      tr.positionX = Math.round(dragState.origX + dxCanvas);
      tr.positionY = Math.round(dragState.origY + dyCanvas);
      if (inpPosX) inpPosX.value = String(tr.positionX);
      if (inpPosY) inpPosY.value = String(tr.positionY);
    } else if (dragState.mode === 'resize') {
      const c = dragState.corner;
      let newX = dragState.origX;
      let newY = dragState.origY;
      let newW = dragState.origW;
      let newH = dragState.origH;

      if (c.includes('e')) newW = Math.max(40, dragState.origW + dxCanvas);
      if (c.includes('s')) newH = Math.max(30, dragState.origH + dyCanvas);
      if (c.includes('w')) {
        newW = Math.max(40, dragState.origW - dxCanvas);
        newX = dragState.origX + (dragState.origW - newW);
      }
      if (c.includes('n')) {
        newH = Math.max(30, dragState.origH - dyCanvas);
        newY = dragState.origY + (dragState.origH - newH);
      }

      // Preserve aspect ratio by default
      const ratio = dragState.origW / Math.max(1, dragState.origH);
      newH = Math.max(30, newW / ratio);
      if (c.includes('n')) newY = dragState.origY + (dragState.origH - newH);

      tr.positionX = Math.round(newX);
      tr.positionY = Math.round(newY);
      tr.width = Math.round(newW);
      tr.height = Math.round(newH);

      const srcW = Number(tr.sourceWidth || dragState.origW / Math.max(0.05, tr.scaleX || 1));
      const srcH = Number(tr.sourceHeight || dragState.origH / Math.max(0.05, tr.scaleY || 1));
      tr.scaleX = Math.max(0.05, newW / Math.max(1, srcW));
      tr.scaleY = Math.max(0.05, newH / Math.max(1, srcH));
      if (inpPosX) inpPosX.value = String(tr.positionX);
      if (inpPosY) inpPosY.value = String(tr.positionY);
      if (inpScalePct) inpScalePct.value = String(Math.round(tr.scaleX * 100));
    }
    it.transform = tr;
    renderCanvasOverlay();
  });

  window.addEventListener('mouseup', async () => {
    if (!dragState) return;
    const finished = dragState;
    dragState = null;
    const tr = finished.item.transform || {};
    const payloadTransform = {
      positionX: Number(tr.positionX || 0),
      positionY: Number(tr.positionY || 0)
    };
    if (finished.mode === 'resize') {
      if (tr.boundsType && tr.boundsType !== 'OBS_BOUNDS_NONE') {
        payloadTransform.boundsWidth = Math.max(20, Number(tr.width || 100));
        payloadTransform.boundsHeight = Math.max(20, Number(tr.height || 100));
      } else {
        payloadTransform.scaleX = Math.max(0.05, Number(tr.scaleX || 1));
        payloadTransform.scaleY = Math.max(0.05, Number(tr.scaleY || 1));
      }
    }
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: finished.item.sceneItemId,
      transform: payloadTransform
    });
    if (res?.ok) {
      setStatus(`✅ "${finished.item.sourceName}" in OBS aktualisiert.`, '#4ade80');
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'OBS Update fehlgeschlagen'}`, '#f87171');
    }
  });

  let isFetchingPreview = false;
  async function refreshPreview() {
    if (modal.classList.contains('hidden') || isFetchingPreview || !currentSceneName) return;
    isFetchingPreview = true;
    try {
      const res = await window.omnichat.obsWsAction({ action: 'get-screenshot', sceneName: currentSceneName });
      if (res?.ok && res.imageData && previewImg) {
        previewImg.src = res.imageData;
        previewImg.style.display = 'block';
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      }
    } finally {
      isFetchingPreview = false;
    }
  }

  function renderSourcesList() {
    if (!sourcesList) return;
    sourcesList.innerHTML = '';
    sceneItems.forEach((it) => {
      const row = document.createElement('div');
      row.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:6px; padding:5px 8px; border-radius:7px; background:rgba(30,41,59,0.8); border:1px solid ${selectedItem?.sceneItemId === it.sceneItemId ? '#38bdf8' : 'rgba(148,163,184,0.18)'}; font-size:12px; cursor:pointer;`;
      const nameSpan = document.createElement('span');
      nameSpan.style.cssText = 'flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      nameSpan.textContent = it.sourceName;
      nameSpan.addEventListener('click', () => {
        selectSourceItem(it);
        renderSourcesList();
        renderCanvasOverlay();
      });

      const eyeBtn = document.createElement('button');
      eyeBtn.className = 'btn-sm';
      eyeBtn.style.padding = '2px 7px';
      eyeBtn.textContent = it.sceneItemEnabled ? '👁️' : '🚫';
      eyeBtn.title = it.sceneItemEnabled ? 'Quelle ausblenden' : 'Quelle einblenden';
      eyeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.omnichat.obsWsAction({
          action: 'set-scene-item-enabled',
          sceneName: currentSceneName,
          sceneItemId: it.sceneItemId,
          enabled: !it.sceneItemEnabled
        });
        await loadSceneItems(currentSceneName);
        refreshPreview();
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-sm warn';
      delBtn.style.padding = '2px 6px';
      delBtn.textContent = '🗑️';
      delBtn.title = 'Quelle aus Szene entfernen';
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.omnichat.obsWsAction({
          action: 'remove-scene-item',
          sceneName: currentSceneName,
          sceneItemId: it.sceneItemId
        });
        if (selectedItem?.sceneItemId === it.sceneItemId) selectSourceItem(null);
        await loadSceneItems(currentSceneName);
        refreshPreview();
      });

      row.appendChild(nameSpan);
      row.appendChild(eyeBtn);
      row.appendChild(delBtn);
      sourcesList.appendChild(row);
    });
  }

  async function loadSceneItems(sceneName) {
    if (!sourcesList) return;
    const res = await window.omnichat.obsWsAction({ action: 'get-scene-items', sceneName });
    if (!res?.ok) {
      setStatus(`⚠️ ${res?.error || 'OBS nicht verbunden.'}`, '#fbbf24');
      sourcesList.innerHTML = '';
      if (canvasOverlay) canvasOverlay.innerHTML = '';
      return;
    }
    currentSceneName = res.sceneName;
    baseWidth = Number(res.baseWidth || 1920);
    baseHeight = Number(res.baseHeight || 1080);
    sceneItems = Array.isArray(res.items) ? res.items : [];
    if (selectedItem) {
      const updated = sceneItems.find((x) => x.sceneItemId === selectedItem.sceneItemId) || null;
      selectSourceItem(updated);
    }
    renderSourcesList();
    renderCanvasOverlay();
  }

  async function loadAudioInputs() {
    if (!audioList) return;
    const res = await window.omnichat.obsWsAction({ action: 'get-audio-inputs' });
    if (!res?.ok) { audioList.innerHTML = ''; return; }
    audioList.innerHTML = '';
    (res.inputs || []).forEach((inp) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:7px; background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.16); font-size:11px;';
      const lbl = document.createElement('span');
      lbl.style.cssText = 'flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      lbl.textContent = inp.inputName;

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '1';
      slider.step = '0.02';
      slider.value = String(Math.min(1, Math.max(0, inp.volumeMul ?? 1)));
      slider.style.width = '85px';
      slider.addEventListener('change', async () => {
        await window.omnichat.obsWsAction({ action: 'set-input-volume', inputName: inp.inputName, volumeMul: parseFloat(slider.value) });
      });

      const muteBtn = document.createElement('button');
      muteBtn.className = 'btn-sm';
      muteBtn.style.padding = '2px 6px';
      muteBtn.textContent = inp.muted ? '🔇' : '🔊';
      muteBtn.addEventListener('click', async () => {
        await window.omnichat.obsWsAction({ action: 'toggle-mic', inputName: inp.inputName });
        loadAudioInputs();
      });

      row.appendChild(lbl);
      row.appendChild(slider);
      row.appendChild(muteBtn);
      audioList.appendChild(row);
    });
  }

  async function refreshAll() {
    const sidebarSel = document.getElementById('selObsScene');
    if (selScene && sidebarSel) {
      selScene.innerHTML = sidebarSel.innerHTML;
      selScene.value = sidebarSel.value;
      currentSceneName = selScene.value || '';
    }
    if (!currentSceneName) {
      setStatus('⚠️ Bitte zuerst in Config → OBS WebSocket v5 verbinden.', '#fbbf24');
      return;
    }
    setStatus('');
    await Promise.all([loadSceneItems(currentSceneName), loadAudioInputs(), refreshPreview()]);
  }

  async function startVirtualCamPreview() {
    if (!chkAutoPreview?.checked || modal.classList.contains('hidden')) return false;
    try {
      const startRes = await window.omnichat.obsWsAction({ action: 'start-virtual-cam' });
      if (startRes?.ok && startRes.startedByEditor) vcamStartedByEditor = true;

      // Give OBS Virtual Camera a brief moment to initialize if freshly started
      if (startRes?.startedByEditor) await new Promise((r) => setTimeout(r, 450));

      let devices = await navigator.mediaDevices.enumerateDevices();
      let vcamDev = devices.find((d) => d.kind === 'videoinput' && /obs.*virtual/i.test(d.label || ''));
      if (!vcamDev) {
        // Request permission once so device labels become visible
        try {
          const tmp = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          tmp.getTracks().forEach((t) => t.stop());
          devices = await navigator.mediaDevices.enumerateDevices();
          vcamDev = devices.find((d) => d.kind === 'videoinput' && /obs.*virtual/i.test(d.label || ''));
        } catch (e) {}
      }
      if (!vcamDev || !vcamVideo) return false;

      vcamStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: vcamDev.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: false
      });
      vcamVideo.srcObject = vcamStream;
      vcamVideo.style.display = 'block';
      if (previewImg) previewImg.style.display = 'none';
      if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      clearInterval(previewTimer);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function stopVirtualCamPreview() {
    if (vcamStream) {
      vcamStream.getTracks().forEach((t) => t.stop());
      vcamStream = null;
    }
    if (vcamVideo) {
      vcamVideo.srcObject = null;
      vcamVideo.style.display = 'none';
    }
    if (vcamStartedByEditor) {
      vcamStartedByEditor = false;
      window.omnichat.obsWsAction({ action: 'stop-virtual-cam' }).catch(() => {});
    }
  }

  function startPreviewLoop() {
    clearInterval(previewTimer);
    stopVirtualCamPreview();
    refreshPreview();
  }

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    selectSourceItem(null);
    await refreshAll();
    startPreviewLoop();
  });

  function closeModal() {
    modal.classList.add('hidden');
    clearInterval(previewTimer);
    stopVirtualCamPreview();
  }
  btnClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('beforeunload', () => {
    if (vcamStartedByEditor) stopVirtualCamPreview();
  });

  chkAutoPreview?.addEventListener('change', startPreviewLoop);
  btnRefresh?.addEventListener('click', refreshAll);

  document.getElementById('btnSeObsWsConnect')?.addEventListener('click', async () => {
    const host = document.getElementById('inputObsWsHost')?.value.trim() || '127.0.0.1';
    const port = parseInt(document.getElementById('inputObsWsPort')?.value || '4455', 10) || 4455;
    const password = document.getElementById('inputObsWsPass')?.value || '';
    const micName = document.getElementById('inputObsWsMic')?.value.trim() || '';
    setStatus('⏳ Verbinde mit OBS WebSocket...', '#38bdf8');
    const res = await window.omnichat.obsWsConnect({ host, port, password, micName });
    if (res?.state) updateObsWsUI(res.state);
    if (res?.state?.connected) {
      setStatus('✅ Mit OBS verbunden!', '#4ade80');
      await refreshAll();
      await loadInputKinds();
      startPreviewLoop();
    } else {
      setStatus(`❌ ${res?.state?.error || res?.error || 'Verbindung zu OBS fehlgeschlagen.'}`, '#f87171');
    }
  });

  document.getElementById('btnSeObsWsDisconnect')?.addEventListener('click', () => {
    window.omnichat.obsWsDisconnect();
    clearInterval(previewTimer);
    stopVirtualCamPreview();
    setStatus('🔌 OBS-Verbindung getrennt.', '#94a3b8');
  });

  selScene?.addEventListener('change', async () => {
    const target = selScene.value;
    if (!target) return;
    await window.omnichat.obsWsAction({ action: 'scene', sceneName: target });
    currentSceneName = target;
    selectSourceItem(null);
    await loadSceneItems(target);
    refreshPreview();
  });

  btnCreateScene?.addEventListener('click', async () => {
    const name = newSceneInput?.value.trim() || '';
    if (!name) return;
    const res = await window.omnichat.obsWsAction({ action: 'create-scene', sceneName: name });
    if (res?.ok) {
      if (newSceneInput) newSceneInput.value = '';
      setStatus(`✅ Szene "${name}" erstellt!`, '#4ade80');
      setTimeout(refreshAll, 300);
    } else {
      setStatus(`❌ ${res?.error || 'Fehler beim Erstellen'}`, '#f87171');
    }
  });

  btnApplyTransform?.addEventListener('click', async () => {
    if (!selectedItem || !currentSceneName) return;
    const scale = Math.max(0.05, Math.min(4, (parseFloat(inpScalePct?.value || '100') || 100) / 100));
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: selectedItem.sceneItemId,
      transform: {
        positionX: parseFloat(inpPosX?.value || '0') || 0,
        positionY: parseFloat(inpPosY?.value || '0') || 0,
        scaleX: scale,
        scaleY: scale
      }
    });
    if (res?.ok) {
      setStatus(`✅ Transform für "${selectedItem.sourceName}" gesetzt.`, '#4ade80');
      await loadSceneItems(currentSceneName);
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'Transform fehlgeschlagen'}`, '#f87171');
    }
  });

  btnCenter?.addEventListener('click', async () => {
    if (!selectedItem || !currentSceneName) return;
    const { w, h } = getItemBoxPx(selectedItem);
    const posX = Math.round((baseWidth - w) / 2);
    const posY = Math.round((baseHeight - h) / 2);
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: selectedItem.sceneItemId,
      transform: { positionX: posX, positionY: posY }
    });
    if (res?.ok) {
      await loadSceneItems(currentSceneName);
      refreshPreview();
    }
  });

  btnFullscreen?.addEventListener('click', async () => {
    if (!selectedItem || !currentSceneName) return;
    const tr = selectedItem.transform || {};
    const srcW = Math.max(1, Number(tr.sourceWidth || baseWidth));
    const srcH = Math.max(1, Number(tr.sourceHeight || baseHeight));
    const scaleX = baseWidth / srcW;
    const scaleY = baseHeight / srcH;
    const transform = tr.boundsType && tr.boundsType !== 'OBS_BOUNDS_NONE'
      ? { positionX: 0, positionY: 0, boundsWidth: baseWidth, boundsHeight: baseHeight }
      : { positionX: 0, positionY: 0, scaleX, scaleY };
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: selectedItem.sceneItemId,
      transform
    });
    if (res?.ok) {
      await loadSceneItems(currentSceneName);
      refreshPreview();
    }
  });

  const selNewKind = document.getElementById('seNewSourceKind');
  const inpNewName = document.getElementById('seNewSourceName');
  const inpNewVal = document.getElementById('seNewSourceValue');
  const btnAddSource = document.getElementById('btnSeAddSource');

  const FRIENDLY_KINDS = {
    browser_source: '🌐 Browser-Quelle (URL)',
    image_source: '🖼️ Bild (PNG/JPG/GIF)',
    ffmpeg_source: '🎬 Video / Medienquelle',
    color_source_v3: '🎨 Farbfläche',
    text_ft2_source_v2: '📝 Text (FreeType 2)',
    text_gdiplus_v3: '📝 Text (GDI+)',
    screen_capture: '🖥️ Bildschirmaufnahme (macOS)',
    macos_avcapture: '📷 Kamera / Videoaufnahmegerät',
    av_capture_input_v2: '📷 Kamera (macOS)',
    coreaudio_input_capture: '🎙️ Mikrofon / Audio-Eingang',
    coreaudio_output_capture: '🔊 Audio-Ausgabe',
    monitor_capture: '🖥️ Bildschirmaufnahme',
    window_capture: '🪟 Fensteraufnahme',
    game_capture: '🎮 Spielaufnahme',
    dshow_input: '📷 Kamera / Capture-Card'
  };

  async function loadInputKinds() {
    if (!selNewKind || selNewKind.options.length > 0) return;
    const res = await window.omnichat.obsWsAction({ action: 'get-input-kinds' });
    const kinds = res?.ok && Array.isArray(res.kinds) && res.kinds.length
      ? res.kinds
      : ['browser_source', 'image_source', 'ffmpeg_source', 'color_source_v3', 'text_ft2_source_v2'];
    selNewKind.innerHTML = '';
    const sorted = [...kinds].sort((a, b) => (FRIENDLY_KINDS[a] ? 0 : 1) - (FRIENDLY_KINDS[b] ? 0 : 1));
    sorted.forEach((k) => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = FRIENDLY_KINDS[k] || k;
      selNewKind.appendChild(opt);
    });
  }

  btnOpen?.addEventListener('click', loadInputKinds);

  btnAddSource?.addEventListener('click', async () => {
    if (!currentSceneName) return;
    const kind = selNewKind?.value || 'browser_source';
    const name = inpNewName?.value.trim() || '';
    const val = inpNewVal?.value.trim() || '';
    if (!name) {
      setStatus('⚠️ Bitte einen Quellennamen eingeben.', '#fbbf24');
      return;
    }
    const settings = {};
    if (val) {
      if (kind.includes('browser')) {
        settings.url = val;
        settings.width = 480;
        settings.height = 360;
      } else if (kind.includes('text')) {
        settings.text = val;
      } else if (kind.includes('image')) {
        settings.file = val;
      } else if (kind.includes('ffmpeg')) {
        settings.local_file = val;
      }
    }
    const res = await window.omnichat.obsWsAction({
      action: 'create-input',
      sceneName: currentSceneName,
      inputName: name,
      inputKind: kind,
      inputSettings: settings
    });
    if (res?.ok) {
      if (inpNewName) inpNewName.value = '';
      if (inpNewVal) inpNewVal.value = '';
      setStatus(`✅ Quelle "${name}" hinzugefügt!`, '#4ade80');
      await loadSceneItems(currentSceneName);
      const created = sceneItems.find((x) => x.sourceName === name);
      if (created) {
        selectSourceItem(created);
        renderSourcesList();
        renderCanvasOverlay();
      }
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'Quelle konnte nicht erstellt werden.'}`, '#f87171');
    }
  });
})();

// ======================================================
// GITHUB RELEASES AUTO-UPDATER UI
// ======================================================
(function initGitHubAutoUpdaterUI() {
  const banner = document.getElementById('updateBanner');
  const bannerText = document.getElementById('updateBannerText');
  const btnInstall = document.getElementById('btnUpdateInstall');
  const btnReleaseUrl = document.getElementById('btnUpdateReleaseUrl');
  const btnDismiss = document.getElementById('btnUpdateDismiss');
  const btnCheck = document.getElementById('btnCheckUpdates');
  const statusText = document.getElementById('updaterStatusText');

  let currentReleaseUrl = '';
  let dismissed = false;

  function renderUpdaterState(st) {
    if (!st) return;
    currentReleaseUrl = st.releaseUrl || '';
    if (statusText) {
      if (st.status === 'checking') {
        statusText.style.color = '#38bdf8';
        statusText.textContent = '⏳ Prüfe GitHub...';
      } else if (st.status === 'downloading') {
        statusText.style.color = '#38bdf8';
        statusText.textContent = `⬇️ Lade v${st.latestVersion} (${st.percent || 0}%)`;
      } else if (st.status === 'downloaded') {
        statusText.style.color = '#4ade80';
        statusText.textContent = `✅ v${st.latestVersion} bereit`;
      } else if (st.status === 'available') {
        statusText.style.color = '#fbbf24';
        statusText.textContent = `🆕 v${st.latestVersion} verfügbar`;
      } else if (st.status === 'up-to-date') {
        statusText.style.color = '#4ade80';
        statusText.textContent = `✅ Aktuell (v${st.currentVersion})`;
      } else if (st.status === 'error') {
        statusText.style.color = '#f87171';
        statusText.textContent = `❌ ${st.error || 'Fehler'}`;
      } else {
        statusText.style.color = '#94a3b8';
        statusText.textContent = `v${st.currentVersion || '1.1.0'}`;
      }
    }

    if (!banner || dismissed) return;
    const showBanner = st.status === 'downloading' || st.status === 'downloaded' || st.status === 'available';
    banner.style.display = showBanner ? 'flex' : 'none';
    if (!showBanner) return;

    if (st.status === 'downloading') {
      if (bannerText) bannerText.textContent = `⬇️ Update v${st.latestVersion} wird heruntergeladen (${st.percent || 0}%)...`;
      btnInstall?.classList.add('hidden');
      btnReleaseUrl?.classList.add('hidden');
    } else if (st.status === 'downloaded') {
      if (bannerText) bannerText.textContent = `🚀 Update v${st.latestVersion} heruntergeladen (${st.assetName || 'Paket'}) — bereit zur Installation!`;
      btnInstall?.classList.remove('hidden');
      btnReleaseUrl?.classList.toggle('hidden', !currentReleaseUrl);
    } else if (st.status === 'available') {
      if (bannerText) bannerText.textContent = `🆕 Neue Version v${st.latestVersion} auf GitHub verfügbar!`;
      btnInstall?.classList.add('hidden');
      btnReleaseUrl?.classList.toggle('hidden', !currentReleaseUrl);
    }
  }

  window.omnichat.onUpdaterState?.(renderUpdaterState);
  window.omnichat.updaterGetState?.().then(renderUpdaterState).catch(() => {});

  btnCheck?.addEventListener('click', async () => {
    dismissed = false;
    const st = await window.omnichat.updaterCheck?.({ autoDownload: true });
    renderUpdaterState(st);
  });

  btnInstall?.addEventListener('click', async () => {
    if (btnInstall) btnInstall.disabled = true;
    await window.omnichat.updaterInstall?.();
    if (btnInstall) btnInstall.disabled = false;
  });

  btnReleaseUrl?.addEventListener('click', () => {
    if (currentReleaseUrl) window.omnichat.openExternalUrl?.(currentReleaseUrl);
  });

  btnDismiss?.addEventListener('click', () => {
    dismissed = true;
    if (banner) banner.style.display = 'none';
  });
})();

// ======================================================
// ELGATO KEY LIGHT & STREAM LIGHTING UI
// ======================================================
(function initElgatoLightsUI() {
  const inpIps = document.getElementById('inputElgatoIps');
  const btnDiscover = document.getElementById('btnElgatoDiscover');
  const btnOn = document.getElementById('btnElgatoOn');
  const btnOff = document.getElementById('btnElgatoOff');
  const btnToggle = document.getElementById('btnElgatoToggle');
  const rngBr = document.getElementById('rngElgatoBrightness');
  const valBr = document.getElementById('valElgatoBrightness');
  const rngTp = document.getElementById('rngElgatoTemp');
  const valTp = document.getElementById('valElgatoTemp');
  const chkOn = document.getElementById('chkElgatoAutoOnLive');
  const chkOff = document.getElementById('chkElgatoAutoOffStop');
  const statusEl = document.getElementById('elgatoLightsStatus');

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  function saveElgatoConfig() {
    window.omnichat.saveProfile(getFormConfig());
  }

  [inpIps, chkOn, chkOff].forEach((el) => {
    el?.addEventListener('change', saveElgatoConfig);
  });

  let sliderDebounce = null;
  function scheduleLiveApply() {
    saveElgatoConfig();
    if (!inpIps?.value.trim()) return;
    clearTimeout(sliderDebounce);
    sliderDebounce = setTimeout(async () => {
      const res = await window.omnichat.elgatoLightsSet?.({
        ips: inpIps.value.trim(),
        brightness: parseInt(rngBr?.value || '60', 10) || 60,
        temperatureK: parseInt(rngTp?.value || '4500', 10) || 4500
      });
      if (res?.ok) setStatus(`✅ ${res.updated.length} Licht(er) aktualisiert`, '#4ade80');
    }, 180);
  }

  rngBr?.addEventListener('input', () => {
    if (valBr) valBr.textContent = `${rngBr.value}%`;
    scheduleLiveApply();
  });

  rngTp?.addEventListener('input', () => {
    if (valTp) valTp.textContent = `${rngTp.value}K`;
    scheduleLiveApply();
  });

  btnDiscover?.addEventListener('click', async () => {
    btnDiscover.disabled = true;
    setStatus('🔍 Suche Elgato Lichter im lokalen WLAN (Port 9123)...', '#38bdf8');
    try {
      const res = await window.omnichat.elgatoLightsDiscover?.();
      const found = res?.lights || [];
      if (!found.length) {
        setStatus('⚠️ Keine Elgato Lichter gefunden. Bitte IP manuell eintragen.', '#fbbf24');
      } else {
        const ips = found.map((l) => l.ip).join(', ');
        if (inpIps) inpIps.value = ips;
        saveElgatoConfig();
        const names = found.map((l) => `${l.name} (${l.ip})`).join(', ');
        setStatus(`✅ Gefunden: ${names}`, '#4ade80');
      }
    } catch (e) {
      setStatus(`❌ Suche fehlgeschlagen: ${e.message}`, '#f87171');
    } finally {
      btnDiscover.disabled = false;
    }
  });

  btnOn?.addEventListener('click', async () => {
    saveElgatoConfig();
    setStatus('⏳ Schalte Elgato Licht(er) ein...', '#38bdf8');
    const res = await window.omnichat.elgatoLightsSet?.({
      ips: inpIps?.value.trim() || '',
      on: true,
      brightness: parseInt(rngBr?.value || '60', 10) || 60,
      temperatureK: parseInt(rngTp?.value || '4500', 10) || 4500
    });
    if (res?.ok) {
      setStatus(`💡 Eingeschaltet (${res.updated.length} Gerät(e))`, '#4ade80');
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Licht nicht erreichen.'}`, '#f87171');
    }
  });

  btnOff?.addEventListener('click', async () => {
    saveElgatoConfig();
    setStatus('⏳ Schalte Elgato Licht(er) aus...', '#38bdf8');
    const res = await window.omnichat.elgatoLightsSet?.({
      ips: inpIps?.value.trim() || '',
      on: false
    });
    if (res?.ok) {
      setStatus(`🌑 Ausgeschaltet (${res.updated.length} Gerät(e))`, '#94a3b8');
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Licht nicht erreichen.'}`, '#f87171');
    }
  });

  btnToggle?.addEventListener('click', async () => {
    saveElgatoConfig();
    const res = await window.omnichat.elgatoLightsToggle?.({
      ips: inpIps?.value.trim() || '',
      brightness: parseInt(rngBr?.value || '60', 10) || 60,
      temperatureK: parseInt(rngTp?.value || '4500', 10) || 4500
    });
    if (res?.ok) {
      const isOn = res.updated?.[0]?.on;
      setStatus(isOn ? '💡 Eingeschaltet' : '🌑 Ausgeschaltet', isOn ? '#4ade80' : '#94a3b8');
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Licht nicht erreichen.'}`, '#f87171');
    }
  });
})();

// ======================================================
// GOVEE SMART-LIGHT & EVENT SCENES UI
// ======================================================
(function initGoveeLightsUI() {
  const chkEnabled = document.getElementById('chkGoveeEnabled');
  const btnOpenUrl = document.getElementById('btnGoveeOpenKeyUrl');
  const inpApiKey = document.getElementById('inputGoveeApiKey');
  const btnLoad = document.getElementById('btnGoveeLoadDevices');
  const selDevice = document.getElementById('selGoveeDevice');
  const numRevert = document.getElementById('numGoveeRevertSec');
  const statusEl = document.getElementById('goveeLightsStatus');

  const DEFAULT_COLOR_SCENES = [
    { id: 'color:#9146ff', name: '🎨 Farbe: Twitch Lila (#9146ff)' },
    { id: 'color:#38bdf8', name: '🎨 Farbe: Cyber Cyan (#38bdf8)' },
    { id: 'color:#ef4444', name: '🎨 Farbe: Raid / Alarm Rot (#ef4444)' },
    { id: 'color:#10b981', name: '🎨 Farbe: Emerald Grün (#10b981)' },
    { id: 'color:#f59e0b', name: '🎨 Farbe: Gold / Bits Amber (#f59e0b)' },
    { id: 'color:#ec4899', name: '🎨 Farbe: SubGift Neon Pink (#ec4899)' },
    { id: 'color:#a855f7', name: '🎨 Farbe: Resub Violett (#a855f7)' },
    { id: 'color:#ffffff', name: '🎨 Farbe: Studio Tageslicht Weiß (#ffffff)' },
    { id: 'power:on', name: '💡 Gerät Einschalten' },
    { id: 'power:off', name: '🌑 Gerät Ausschalten' }
  ];

  const checklistEl = document.getElementById('goveeDevicesChecklist');
  const btnOnlyFirst = document.getElementById('btnGoveeSelectOnlyFirst');
  const btnSelectAll = document.getElementById('btnGoveeSelectAll');

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  function saveGoveeConfig() {
    window.omnichat.saveProfile(getFormConfig());
  }

  function renderDevicesChecklist(selectedDevices = []) {
    if (!checklistEl) return;
    if (!goveeCachedDevices.length) {
      checklistEl.textContent = 'Zuerst API-Key eingeben & auf „🔄 Geräte & Szenen laden“ klicken.';
      return;
    }
    const selSet = new Set(Array.isArray(selectedDevices) && selectedDevices.length ? selectedDevices : [`${goveeCachedDevices[0].sku}||${goveeCachedDevices[0].device}`]);
    checklistEl.innerHTML = '';
    goveeCachedDevices.forEach((d) => {
      const key = `${d.sku}||${d.device}`;
      const row = document.createElement('label');
      row.className = 'checkbox-row';
      row.style.marginTop = '2px';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'govee-dev-chk';
      cb.value = key;
      cb.checked = selSet.has(key);
      cb.addEventListener('change', saveGoveeConfig);
      const sp = document.createElement('span');
      sp.textContent = `💡 ${d.deviceName} (${d.sku})`;
      row.appendChild(cb);
      row.appendChild(sp);
      checklistEl.appendChild(row);
    });
  }

  function renderEventDeviceDropdowns(eventDevices = {}) {
    GOVEE_EVENT_KEYS.forEach((evKey) => {
      const sel = document.getElementById(`selGoveeDev_${evKey}`);
      if (!sel) return;
      const curVal = eventDevices[evKey] !== undefined ? eventDevices[evKey] : sel.value;
      sel.innerHTML = '';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = '🎯 Gewählte Lampe(n)';
      sel.appendChild(defOpt);
      goveeCachedDevices.forEach((d) => {
        const key = `${d.sku}||${d.device}`;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `💡 Nur: ${d.deviceName}`;
        if (key === curVal) opt.selected = true;
        sel.appendChild(opt);
      });
    });
  }

  function renderDeviceDropdown(selectedSku, selectedDevice) {
    if (!selDevice) return;
    selDevice.innerHTML = '';
    if (!goveeCachedDevices.length) {
      const ph = document.createElement('option');
      ph.value = selectedSku && selectedDevice ? `${selectedSku}||${selectedDevice}` : '';
      ph.textContent = selectedSku && selectedDevice ? `${selectedSku} (${selectedDevice})` : '— Zuerst API-Key eingeben & Geräte laden —';
      selDevice.appendChild(ph);
      return;
    }
    goveeCachedDevices.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = `${d.sku}||${d.device}`;
      opt.textContent = `${d.deviceName} [${d.sku}]`;
      if (d.sku === selectedSku && d.device === selectedDevice) opt.selected = true;
      selDevice.appendChild(opt);
    });
  }

  function renderEventSceneDropdowns(eventScenes = {}) {
    const scenes = goveeCachedScenes.length ? goveeCachedScenes : DEFAULT_COLOR_SCENES;
    GOVEE_EVENT_KEYS.forEach((evKey) => {
      const sel = document.getElementById(`selGovee_${evKey}`);
      if (!sel) return;
      const curVal = eventScenes[evKey] !== undefined ? eventScenes[evKey] : sel.value;
      sel.innerHTML = '';
      const noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = '— Keine Aktion / Aus —';
      sel.appendChild(noneOpt);
      scenes.forEach((sc) => {
        const opt = document.createElement('option');
        opt.value = sc.id;
        opt.textContent = sc.name;
        if (sc.id === curVal) opt.selected = true;
        sel.appendChild(opt);
      });
    });
  }

  window.__populateGoveeUI = (gov = {}) => {
    renderDeviceDropdown(gov.sku, gov.device);
    renderDevicesChecklist(gov.selectedDevices || (gov.sku && gov.device ? [`${gov.sku}||${gov.device}`] : []));
    renderEventDeviceDropdowns(gov.eventDevices || {});
    renderEventSceneDropdowns(gov.eventScenes || {});
  };

  renderEventDeviceDropdowns({});
  renderEventSceneDropdowns({});

  btnOnlyFirst?.addEventListener('click', () => {
    const cbs = Array.from(document.querySelectorAll('.govee-dev-chk'));
    const catalogVal = selDevice?.value || '';
    let matched = false;
    cbs.forEach((cb) => {
      if (!matched && (cb.value === catalogVal || !catalogVal)) {
        cb.checked = true;
        matched = true;
      } else {
        cb.checked = false;
      }
    });
    if (!matched && cbs[0]) cbs[0].checked = true;
    saveGoveeConfig();
  });

  btnSelectAll?.addEventListener('click', () => {
    document.querySelectorAll('.govee-dev-chk').forEach((cb) => { cb.checked = true; });
    saveGoveeConfig();
  });

  btnOpenUrl?.addEventListener('click', () => {
    window.omnichat.openExternalUrl?.('https://developer.govee.com/');
  });

  [chkEnabled, inpApiKey, numRevert].forEach((el) => {
    el?.addEventListener('change', saveGoveeConfig);
  });

  GOVEE_EVENT_KEYS.forEach((evKey) => {
    document.getElementById(`selGovee_${evKey}`)?.addEventListener('change', saveGoveeConfig);
    document.getElementById(`selGoveeDev_${evKey}`)?.addEventListener('change', saveGoveeConfig);
  });

  async function loadScenesForCurrentDevice() {
    const [sku, device] = String(selDevice?.value || '').split('||');
    const apiKey = inpApiKey?.value.trim() || '';
    if (!apiKey || !sku || !device) return;
    setStatus(`⏳ Lade Govee-Szenen für ${sku}...`, '#38bdf8');
    const currentSelections = {};
    GOVEE_EVENT_KEYS.forEach((k) => {
      currentSelections[k] = document.getElementById(`selGovee_${k}`)?.value || '';
    });
    const scRes = await window.omnichat.goveeListScenes?.({ apiKey, sku, device });
    if (scRes?.scenes) {
      goveeCachedScenes = scRes.scenes;
      renderEventSceneDropdowns(currentSelections);
      saveGoveeConfig();
      setStatus(`✅ ${goveeCachedScenes.length} Szenen & Licht-Aktionen für ${sku} geladen!`, '#4ade80');
    } else {
      setStatus(`⚠️ ${scRes?.error || 'Szenen konnten nicht geladen werden.'}`, '#fbbf24');
    }
  }

  selDevice?.addEventListener('change', async () => {
    saveGoveeConfig();
    await loadScenesForCurrentDevice();
  });

  btnLoad?.addEventListener('click', async () => {
    const apiKey = inpApiKey?.value.trim() || '';
    if (!apiKey) {
      setStatus('⚠️ Bitte zuerst deinen Govee API-Key eintragen.', '#fbbf24');
      return;
    }
    btnLoad.disabled = true;
    setStatus('⏳ Lade Govee-Geräte von Govee OpenAPI...', '#38bdf8');
    try {
      const res = await window.omnichat.goveeListDevices?.({ apiKey });
      if (!res?.ok) {
        setStatus(`❌ ${res?.error || 'Fehler beim Abrufen der Govee-Geräte.'}`, '#f87171');
        return;
      }
      goveeCachedDevices = res.devices || [];
      if (!goveeCachedDevices.length) {
        setStatus('⚠️ Keine Govee-Geräte auf diesem API-Key gefunden.', '#fbbf24');
        return;
      }
      const first = goveeCachedDevices[0];
      renderDeviceDropdown(first.sku, first.device);
      renderDevicesChecklist([`${first.sku}||${first.device}`]);
      const curDevMap = {};
      GOVEE_EVENT_KEYS.forEach((k) => {
        curDevMap[k] = document.getElementById(`selGoveeDev_${k}`)?.value || '';
      });
      renderEventDeviceDropdowns(curDevMap);
      saveGoveeConfig();
      await loadScenesForCurrentDevice();
    } finally {
      btnLoad.disabled = false;
    }
  });

  document.querySelectorAll('.govee-test-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const evKey = btn.getAttribute('data-govee-test');
      const actionId = document.getElementById(`selGovee_${evKey}`)?.value || '';
      const perEventDev = document.getElementById(`selGoveeDev_${evKey}`)?.value || '';
      const checkedDevs = Array.from(document.querySelectorAll('.govee-dev-chk:checked')).map((cb) => cb.value).filter(Boolean);
      const fallbackDev = selDevice?.value || '';
      const targets = perEventDev ? [perEventDev] : (checkedDevs.length ? checkedDevs : (fallbackDev ? [fallbackDev] : []));
      const apiKey = inpApiKey?.value.trim() || '';
      if (!apiKey || !targets.length) {
        setStatus('⚠️ Bitte zuerst API-Key eingeben und mindestens eine Govee-Lampe auswählen.', '#fbbf24');
        return;
      }
      if (!actionId) {
        setStatus('⚠️ Bitte zuerst eine Szene oder Farbe für dieses Event auswählen.', '#fbbf24');
        return;
      }
      setStatus(`⏳ Teste Govee-Szene für "${evKey}" (${targets.length} Lampe(n))...`, '#38bdf8');
      const res = await window.omnichat.goveeApplyAction?.({ apiKey, targets, actionId });
      if (res?.ok) {
        setStatus(`✅ Govee-Szene für "${evKey}" an ${res.updatedCount || targets.length} Lampe(n) gesendet!`, '#4ade80');
      } else {
        setStatus(`❌ ${res?.error || 'Govee-Steuerung fehlgeschlagen.'}`, '#f87171');
      }
    });
  });
})();

// ======================================================
// MULTI-PLATFORM RTMP RESTREAMING RELAY UI
// ======================================================
(function initMultiStreamRelayUI() {
  const badgeLive = document.getElementById('msLiveBadge');
  const telemetryLive = document.getElementById('msLiveTelemetry');
  const btnLiveStart = document.getElementById('btnMsLiveStart');
  const btnLiveStop = document.getElementById('btnMsLiveStop');
  const btnOpenCfg = document.getElementById('btnMsOpenCfg');

  const numPort = document.getElementById('numMsPort');
  const inpLocalKey = document.getElementById('inputMsLocalKey');
  const inpIngestPreview = document.getElementById('inputMsIngestPreview');
  const btnConfigObs = document.getElementById('btnMsConfigureObs');
  const btnCfgStart = document.getElementById('btnMsCfgStart');
  const btnCfgStop = document.getElementById('btnMsCfgStop');
  const statusCfg = document.getElementById('msCfgStatus');

  const inputIds = [
    'numMsPort', 'inputMsLocalKey', 'chkMsAutoConfigObs', 'chkMsAutoStartObs',
    'chkMsTwitch', 'inputMsTwitchUrl', 'inputMsTwitchKey',
    'chkMsYoutube', 'inputMsYoutubeUrl', 'inputMsYoutubeKey',
    'chkMsTiktok', 'inputMsTiktokUrl', 'inputMsTiktokKey',
    'chkMsCustom', 'inputMsCustomName', 'inputMsCustomUrl', 'inputMsCustomKey'
  ];

  function saveMsConfig() {
    if (inpIngestPreview && numPort) {
      inpIngestPreview.value = `rtmp://127.0.0.1:${numPort.value || 1935}/live`;
    }
    window.omnichat.saveProfile(getFormConfig());
  }

  inputIds.forEach((id) => {
    document.getElementById(id)?.addEventListener('change', saveMsConfig);
  });

  function renderRelayState(st) {
    if (!st) return;
    const isRunning = Boolean(st.active);
    btnLiveStart?.classList.toggle('hidden', isRunning);
    btnLiveStop?.classList.toggle('hidden', !isRunning);
    btnCfgStart?.classList.toggle('hidden', isRunning);
    btnCfgStop?.classList.toggle('hidden', !isRunning);

    const targetsStr = (st.activeTargets || []).join(' + ') || 'Keine Ziele';
    if (st.status === 'streaming') {
      if (badgeLive) {
        badgeLive.textContent = '(🔴 LIVE)';
        badgeLive.style.color = '#4ade80';
      }
      const statLine = `🔴 LIVE → ${targetsStr} • ${st.bitrateKbps || 0} kbps • ${st.fps || 0} FPS (${st.uptime || '00:00:00'})`;
      if (telemetryLive) {
        telemetryLive.style.color = '#4ade80';
        telemetryLive.textContent = statLine;
      }
      if (statusCfg) {
        statusCfg.style.color = '#4ade80';
        statusCfg.textContent = statLine;
      }
    } else if (st.status === 'waiting') {
      if (badgeLive) {
        badgeLive.textContent = '(⏳ Wartet auf OBS)';
        badgeLive.style.color = '#38bdf8';
      }
      const waitLine = `⏳ Relay bereit (${st.ingestServer}/${st.ingestKey}) → Wartet auf OBS-Stream (${targetsStr})...`;
      if (telemetryLive) {
        telemetryLive.style.color = '#38bdf8';
        telemetryLive.textContent = waitLine;
      }
      if (statusCfg) {
        statusCfg.style.color = '#38bdf8';
        statusCfg.textContent = waitLine;
      }
    } else if (st.status === 'error') {
      if (badgeLive) {
        badgeLive.textContent = '(❌ Fehler)';
        badgeLive.style.color = '#f87171';
      }
      if (telemetryLive) {
        telemetryLive.style.color = '#f87171';
        telemetryLive.textContent = `❌ ${st.error || 'Relay-Fehler'}`;
      }
      if (statusCfg) {
        statusCfg.style.color = '#f87171';
        statusCfg.textContent = `❌ ${st.error || 'Relay-Fehler'}`;
      }
    } else {
      if (badgeLive) {
        badgeLive.textContent = '(Aus)';
        badgeLive.style.color = '#94a3b8';
      }
      if (telemetryLive) {
        telemetryLive.style.color = '#94a3b8';
        telemetryLive.textContent = 'OBS rendert 1× → OmniGrid verteilt';
      }
      if (statusCfg) {
        statusCfg.style.color = '#94a3b8';
        statusCfg.textContent = 'Bereit';
      }
    }
  }

  window.omnichat.onMultiStreamState?.(renderRelayState);
  window.omnichat.multiStreamGetState?.().then(renderRelayState).catch(() => {});

  async function handleStart() {
    saveMsConfig();
    const multiStream = getMultiStreamSettings();
    const res = await window.omnichat.multiStreamStart?.({ multiStream });
    if (res?.state) renderRelayState(res.state);
    if (!res?.ok && res?.error) {
      if (statusCfg) {
        statusCfg.style.color = '#f87171';
        statusCfg.textContent = `❌ ${res.error}`;
      }
      if (telemetryLive) {
        telemetryLive.style.color = '#f87171';
        telemetryLive.textContent = `❌ ${res.error}`;
      }
    }
  }

  async function handleStop() {
    const res = await window.omnichat.multiStreamStop?.();
    if (res?.state) renderRelayState(res.state);
  }

  btnLiveStart?.addEventListener('click', handleStart);
  btnCfgStart?.addEventListener('click', handleStart);
  btnLiveStop?.addEventListener('click', handleStop);
  btnCfgStop?.addEventListener('click', handleStop);

  btnConfigObs?.addEventListener('click', async () => {
    saveMsConfig();
    const multiStream = getMultiStreamSettings();
    const res = await window.omnichat.multiStreamConfigureObs?.({ multiStream });
    if (res?.ok) {
      if (statusCfg) {
        statusCfg.style.color = '#4ade80';
        statusCfg.textContent = `✅ OBS Stream-Server automatisch auf ${res.server} (Key: ${res.key}) gesetzt!`;
      }
    } else if (statusCfg) {
      statusCfg.style.color = '#f87171';
      statusCfg.textContent = `❌ ${res?.error || 'Bitte zuerst OBS WebSocket v5 verbinden.'}`;
    }
  });

  btnOpenCfg?.addEventListener('click', () => {
    document.getElementById('configPageModal')?.classList.remove('hidden');
    const tabBtn = document.querySelector('.config-tab-btn[data-cfg-tab="platforms"]');
    tabBtn?.click();
  });
})();

// ======================================================
// GITHUB DISCUSSIONS & FEEDBACK MODAL UI
// ======================================================
(function initFeedbackModalUI() {
  const modal = document.getElementById('feedbackModal');
  const btnOpen = document.getElementById('btnOpenFeedback');
  const btnClose = document.getElementById('btnCloseFeedback');
  const selCategory = document.getElementById('selFeedbackCategory');
  const inpTitle = document.getElementById('inputFeedbackTitle');
  const txtBody = document.getElementById('txtFeedbackBody');
  const inpToken = document.getElementById('inputFeedbackGhToken');
  const btnDiscussion = document.getElementById('btnSubmitFeedbackDiscussion');
  const btnIssue = document.getElementById('btnSubmitFeedbackIssue');
  const statusEl = document.getElementById('feedbackStatus');

  if (!modal) return;

  try {
    const savedTok = localStorage.getItem('omnigrid_gh_feedback_token') || '';
    if (inpToken && savedTok) inpToken.value = savedTok;
  } catch (e) {}

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  btnOpen?.addEventListener('click', () => {
    setStatus('');
    modal.classList.remove('hidden');
    inpTitle?.focus();
  });

  function closeModal() {
    modal.classList.add('hidden');
  }

  btnClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  async function submitFeedback(targetType) {
    const title = inpTitle?.value.trim() || '';
    const body = txtBody?.value.trim() || '';
    const category = selCategory?.value || 'ideas';
    const githubToken = inpToken?.value.trim() || '';

    if (!title) {
      setStatus('⚠️ Bitte gib einen kurzen Titel ein.', '#fbbf24');
      inpTitle?.focus();
      return;
    }

    try {
      if (githubToken) localStorage.setItem('omnigrid_gh_feedback_token', githubToken);
      else localStorage.removeItem('omnigrid_gh_feedback_token');
    } catch (e) {}

    setStatus('⏳ Übermittle Feedback zu GitHub...', '#38bdf8');
    const res = await window.omnichat.submitGithubFeedback?.({
      category,
      title,
      body,
      targetType,
      githubToken
    });

    if (res?.ok) {
      if (inpTitle) inpTitle.value = '';
      if (txtBody) txtBody.value = '';
      if (res.mode === 'api') {
        setStatus('✅ GitHub Discussion direkt per API angelegt & im Browser geöffnet!', '#4ade80');
      } else {
        setStatus('✅ Vorausgefüllte GitHub Discussion im Browser geöffnet!', '#4ade80');
      }
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Feedback nicht öffnen.'}`, '#f87171');
    }
  }

  btnDiscussion?.addEventListener('click', () => submitFeedback('discussion'));
  btnIssue?.addEventListener('click', () => submitFeedback('issue'));
})();

// ======================================================
// PRIVACY & ZERO-TELEMETRY PROOF MODAL UI
// ======================================================
(function initPrivacyAuditModalUI() {
  const modal = document.getElementById('privacyAuditModal');
  const btnOpen = document.getElementById('btnOpenPrivacyAudit');
  const btnClose = document.getElementById('btnClosePrivacyAudit');
  const banner = document.getElementById('privacyAuditBanner');
  const inpConfigPath = document.getElementById('inputPrivacyConfigPath');
  const inpSrcPath = document.getElementById('inputPrivacySrcPath');
  const inpOsCmd = document.getElementById('inputPrivacyOsCmd');
  const btnRevealConfig = document.getElementById('btnPrivacyRevealConfig');
  const btnOpenSrc = document.getElementById('btnPrivacyOpenSrc');
  const btnCopyOsCmd = document.getElementById('btnPrivacyCopyOsCmd');
  const btnRescan = document.getElementById('btnPrivacyRescan');
  const domainsList = document.getElementById('privacyDomainsList');

  if (!modal) return;

  async function runAudit() {
    if (banner) {
      banner.style.color = '#38bdf8';
      banner.textContent = '⏳ Scanne laufenden App-Quellcode (src/) auf Netzwerk-Domains...';
    }
    const res = await window.omnichat.privacyAuditRun?.();
    if (!res) return;
    if (inpConfigPath) inpConfigPath.value = res.configPath || '';
    if (inpSrcPath) inpSrcPath.value = res.srcPath || '';
    if (inpOsCmd) inpOsCmd.value = res.osNetCmd || '';

    if (banner) {
      if (res.ok) {
        banner.style.color = '#4ade80';
        banner.style.borderColor = 'rgba(16,185,129,0.45)';
        banner.textContent = `✅ ZERO-TELEMETRY AUDIT BESTANDEN: ${res.scannedFiles} Quellcode-Dateien (${res.totalEndpoints} Endpunkte) live geprüft — 0 fremde Server, 0 Tracker, 100 % direkte offizielle APIs.`;
      } else {
        banner.style.color = '#f87171';
        banner.textContent = `⚠️ Unbekannte Domains gefunden (${res.unknownEndpoints?.length || 0})`;
      }
    }

    if (domainsList) {
      domainsList.innerHTML = '';
      (res.domains || []).forEach((d) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: grid; grid-template-columns: 210px 1fr auto; gap: 8px; align-items: center; padding: 5px 8px; border-radius: 6px; background: rgba(15,23,42,0.75); border: 1px solid rgba(148,163,184,0.14);';
        const hostSpan = document.createElement('strong');
        hostSpan.style.color = d.allowed ? '#4ade80' : '#f87171';
        hostSpan.textContent = `${d.allowed ? '✅' : '❌'} ${d.host}`;
        const purposeSpan = document.createElement('span');
        purposeSpan.style.color = '#cbd5e1';
        purposeSpan.textContent = d.purpose;
        const countSpan = document.createElement('span');
        countSpan.style.cssText = 'color: #64748b; font-size: 10px; white-space: nowrap;';
        countSpan.textContent = `${d.count}× (${(d.examples || [])[0] || ''})`;
        row.appendChild(hostSpan);
        row.appendChild(purposeSpan);
        row.appendChild(countSpan);
        domainsList.appendChild(row);
      });
    }
  }

  btnOpen?.addEventListener('click', () => {
    modal.classList.remove('hidden');
    runAudit();
  });

  function closeModal() {
    modal.classList.add('hidden');
  }

  btnClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  btnRescan?.addEventListener('click', runAudit);
  btnRevealConfig?.addEventListener('click', () => window.omnichat.privacyOpenPath?.('config'));
  btnOpenSrc?.addEventListener('click', () => window.omnichat.privacyOpenPath?.('src'));

  btnCopyOsCmd?.addEventListener('click', () => {
    if (!inpOsCmd?.value) return;
    navigator.clipboard.writeText(inpOsCmd.value);
    btnCopyOsCmd.textContent = '✅ Kopiert!';
    setTimeout(() => {
      btnCopyOsCmd.textContent = '📋 Befehl kopieren';
    }, 1500);
  });
})();






