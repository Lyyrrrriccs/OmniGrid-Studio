const DEFAULT_GAME_ADDONS_CONFIG = {
  selectedMode: 'auto', // 'auto' | 'cs2' | 'lol' | 'minecraft' | 'souls' | 'valorant' | 'universal'
  currentGameName: '',
  autoSwitchByGame: true,
  lolPollingEnabled: false,
  autoTriggerEvents: true,
  perAddonStats: {
    universal: { kills: 0, deaths: 0, wins: 0, rank: 'Live' },
    cs2: { kills: 0, deaths: 0, assists: 0, mvps: 0, map: 'Mirage', score: '0 : 0' },
    lol: { champion: 'Ahri', skinId: 0, skinName: '', championIconUrl: '', skinSplashUrl: '', kills: 0, deaths: 0, assists: 0, cs: 0, level: 1 },
    minecraft: { deaths: 0, diamonds: 0, days: 1, mode: 'Survival' },
    souls: { deaths: 0, bosses: 0, run: 'Any%', bossName: 'Aktueller Boss' },
    valorant: { kills: 0, deaths: 0, wins: 0, rank: 'Diamond', agent: 'Jett' }
  }
};

const GAME_ADDONS = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2 (GSI)',
    icon: '🎯',
    accent: '#f59e0b',
    gameMatches: ['counter-strike', 'cs2', 'cs:go', 'counter strike'],
    fields: [
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'assists', label: 'Assists', type: 'number' },
      { key: 'mvps', label: 'MVPs', type: 'number' },
      { key: 'map', label: 'Map', type: 'text' },
      { key: 'score', label: 'Score', type: 'text' }
    ],
    chatCommands: ['!kd', '!stats', '!map'],
    eventHint: 'CS2 GSI (POST /api/game/cs2-gsi): Live K/D/A, Map, Score & Auto-Aktion bei 3K/Ace.'
  },
  {
    id: 'lol',
    name: 'League of Legends (Live API)',
    icon: '⚔️',
    accent: '#38bdf8',
    gameMatches: ['league of legends', 'lol', 'teamfight tactics'],
    fields: [
      { key: 'champion', label: 'Champion', type: 'text' },
      { key: 'skinId', label: 'Skin-ID', type: 'number' },
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'assists', label: 'Assists', type: 'number' },
      { key: 'cs', label: 'CS', type: 'number' },
      { key: 'level', label: 'Level', type: 'number' }
    ],
    chatCommands: ['!stats', '!kd', '!champ'],
    eventHint: 'LoL Live Client API (127.0.0.1:2999): Live Champion, K/D/A, CS & Level.'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    icon: '⛏️',
    accent: '#22c55e',
    gameMatches: ['minecraft'],
    fields: [
      { key: 'deaths', label: 'Tode', type: 'number' },
      { key: 'diamonds', label: 'Diamanten', type: 'number' },
      { key: 'days', label: 'Tage', type: 'number' },
      { key: 'mode', label: 'Modus', type: 'text' }
    ],
    chatCommands: ['!deaths', '!death+', '!stats'],
    eventHint: 'Chat-Commands (!deaths, !death+) & Webhook (POST /api/game/event).'
  },
  {
    id: 'souls',
    name: 'Elden Ring / Soulsborne',
    icon: '💀',
    accent: '#ef4444',
    gameMatches: ['elden ring', 'dark souls', 'sekiro', 'bloodborne', 'lies of p', 'black myth'],
    fields: [
      { key: 'deaths', label: 'Tode', type: 'number' },
      { key: 'bosses', label: 'Bosskills', type: 'number' },
      { key: 'bossName', label: 'Aktueller Boss', type: 'text' },
      { key: 'run', label: 'Run', type: 'text' }
    ],
    chatCommands: ['!deaths', '!death+', '!boss', '!stats'],
    eventHint: 'Perfekt für Death-Counter per Stream Deck (/api/streamdeck/game-stat?key=deaths&delta=1) oder Chat.'
  },
  {
    id: 'valorant',
    name: 'Valorant / Tactical FPS',
    icon: '🔫',
    accent: '#f43f5e',
    gameMatches: ['valorant', 'apex legends', 'fortnite', 'overwatch', 'call of duty', 'warzone'],
    fields: [
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'wins', label: 'Wins', type: 'number' },
      { key: 'rank', label: 'Rank', type: 'text' },
      { key: 'agent', label: 'Agent / Char', type: 'text' }
    ],
    chatCommands: ['!stats', '!kd', '!rank', '!wins', '!win+'],
    eventHint: 'Chat-Commands (!stats, !rank, !wins) & Stream Deck Counter.'
  },
  {
    id: 'universal',
    name: 'Universal Game Counter',
    icon: '🏆',
    accent: '#a855f7',
    gameMatches: [],
    fields: [
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Tode', type: 'number' },
      { key: 'wins', label: 'Wins', type: 'number' },
      { key: 'rank', label: 'Status / Rank', type: 'text' }
    ],
    chatCommands: ['!stats', '!deaths', '!death+', '!wins', '!win+'],
    eventHint: 'Funktioniert mit jedem Spiel als Fallback für Auto-Switch.'
  }
];

function normalizeGameAddonsConfig(raw = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const mergedStats = {};
  for (const addon of GAME_ADDONS) {
    mergedStats[addon.id] = {
      ...(DEFAULT_GAME_ADDONS_CONFIG.perAddonStats[addon.id] || {}),
      ...((src.perAddonStats && src.perAddonStats[addon.id]) || {})
    };
  }
  return {
    selectedMode: String(src.selectedMode || 'auto'),
    currentGameName: String(src.currentGameName || ''),
    autoSwitchByGame: src.autoSwitchByGame !== false,
    lolPollingEnabled: Boolean(src.lolPollingEnabled),
    autoTriggerEvents: src.autoTriggerEvents !== false,
    perAddonStats: mergedStats
  };
}

function getAddonById(id) {
  return GAME_ADDONS.find((a) => a.id === id) || GAME_ADDONS.find((a) => a.id === 'universal');
}

function matchAddonByGameName(gameName = '') {
  const lower = String(gameName || '').trim().toLowerCase();
  if (!lower) return 'universal';
  for (const addon of GAME_ADDONS) {
    if (addon.gameMatches.some((m) => lower.includes(m))) {
      return addon.id;
    }
  }
  return 'universal';
}

function resolveActiveAddon(cfg = {}) {
  const ga = normalizeGameAddonsConfig(cfg.gameAddons);
  const effectiveId = ga.selectedMode === 'auto'
    ? matchAddonByGameName(ga.currentGameName)
    : ga.selectedMode;
  const addon = getAddonById(effectiveId);
  const stats = ga.perAddonStats[addon.id] || {};
  return { addon, stats, ga };
}

function buildObsGameStatsPayload(cfg = {}) {
  const { addon, stats, ga } = resolveActiveAddon(cfg);
  const skipKeys = addon.id === 'lol' ? new Set(['champion', 'skinId']) : new Set();
  const displayStats = addon.fields
    .filter((f) => !skipKeys.has(f.key))
    .map((f) => ({
      key: f.key,
      label: f.label,
      value: stats[f.key] !== undefined && stats[f.key] !== '' ? stats[f.key] : '—'
    }));
  // Add K/D ratio automatically when kills & deaths exist
  if (typeof stats.kills === 'number' && typeof stats.deaths === 'number') {
    const kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : String(stats.kills.toFixed(2));
    displayStats.push({ key: 'kd', label: 'K/D', value: kd });
  }
  return {
    addonId: addon.id,
    addonName: addon.name,
    icon: addon.icon,
    accent: addon.accent,
    selectedMode: ga.selectedMode,
    currentGameName: ga.currentGameName,
    champion: stats.champion || '',
    skinId: Number(stats.skinId || 0),
    skinName: stats.skinName || '',
    championIconUrl: stats.championIconUrl || '',
    skinIconUrl: stats.skinIconUrl || '',
    skinSplashUrl: stats.skinSplashUrl || '',
    stats: displayStats,
    chatCommands: addon.chatCommands
  };
}

function handleGameChatCommand(cfg = {}, msg = {}) {
  const text = String(msg.text || '').trim();
  if (!text.startsWith('!')) return null;
  const cmd = text.split(/\s+/)[0].toLowerCase();
  const { addon, stats, ga } = resolveActiveAddon(cfg);
  const roles = Array.isArray(msg.roles) ? msg.roles.map((r) => String(r).toLowerCase()) : [];
  const isModOrBroadcaster = roles.some((r) => ['broadcaster', 'moderator', 'mod'].includes(r));

  // Mutating commands (Mod / Broadcaster only)
  if ((cmd === '!death+' || cmd === '!win+') && isModOrBroadcaster) {
    const field = cmd === '!death+' ? 'deaths' : 'wins';
    if (typeof stats[field] === 'number' || stats[field] === undefined) {
      stats[field] = (Number(stats[field]) || 0) + 1;
      return {
        mutated: true,
        nextGameAddons: {
          ...ga,
          perAddonStats: { ...ga.perAddonStats, [addon.id]: stats }
        },
        reply: `${addon.icon} ${addon.name}: ${field === 'deaths' ? 'Tode' : 'Wins'} jetzt bei ${stats[field]}!`
      };
    }
  }

  if (cmd === '!stats' || cmd === '!kd') {
    if (!addon.chatCommands.includes(cmd) && cmd === '!kd') return null;
    const parts = addon.fields.map((f) => `${f.label}: ${stats[f.key] ?? 0}`);
    if (typeof stats.kills === 'number' && typeof stats.deaths === 'number') {
      const kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : String(stats.kills);
      parts.push(`K/D: ${kd}`);
    }
    return { mutated: false, reply: `${addon.icon} ${addon.name} — ${parts.join(' | ')}` };
  }

  if (cmd === '!deaths' && stats.deaths !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktuelle Tode (${addon.name}): ${stats.deaths}` };
  }
  if (cmd === '!wins' && stats.wins !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktuelle Wins (${addon.name}): ${stats.wins}` };
  }
  if (cmd === '!rank' && stats.rank !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktueller Rank (${addon.name}): ${stats.rank}` };
  }
  if (cmd === '!map' && stats.map !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktuelle Map: ${stats.map} (${stats.score || '0 : 0'})` };
  }
  if (cmd === '!champ' && stats.champion !== undefined) {
    return { mutated: false, reply: `${addon.icon} Champion: ${stats.champion} (${stats.kills}/${stats.deaths}/${stats.assists}, ${stats.cs} CS)` };
  }
  if (cmd === '!boss' && stats.bossName !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktueller Boss: ${stats.bossName} (Tode bisher: ${stats.deaths ?? 0})` };
  }
  return null;
}

function buildCs2GsiConfig(port = 4588) {
  return `"OmniGrid Studio CS2 GSI"
{
  "uri" "http://127.0.0.1:${port}/api/game/cs2-gsi"
  "timeout" "5.0"
  "buffer" "0.1"
  "throttle" "0.5"
  "heartbeat" "30.0"
  "data"
  {
    "provider" "1"
    "map" "1"
    "round" "1"
    "player_id" "1"
    "player_state" "1"
    "player_match_stats" "1"
  }
}
`;
}

let cachedDdragon = { version: '', champions: null, skinsById: {} };

async function ensureDdragonLoaded() {
  if (cachedDdragon.version && cachedDdragon.champions) return cachedDdragon;
  try {
    const vResp = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await vResp.json();
    const ver = Array.isArray(versions) && versions[0] ? versions[0] : '14.23.1';
    const cResp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/de_DE/champion.json`);
    const cJson = await cResp.json();
    const map = {};
    for (const champ of Object.values(cJson?.data || {})) {
      map[String(champ.name || '').toLowerCase()] = champ.id;
      map[String(champ.id || '').toLowerCase()] = champ.id;
    }
    cachedDdragon = { version: ver, champions: map, skinsById: {} };
  } catch (e) {}
  return cachedDdragon;
}

async function resolveLolDdragonAssets(championName = '', skinId = 0, explicitSkinName = '') {
  const cleanName = String(championName || '').trim();
  if (!cleanName || cleanName === '—') {
    return { championIconUrl: '', skinSplashUrl: '', skinName: explicitSkinName || '' };
  }

  const dd = await ensureDdragonLoaded();
  const ver = dd.version || '14.23.1';
  const lower = cleanName.toLowerCase();
  let champId = dd.champions?.[lower] || '';
  if (!champId) {
    const alias = { wukong: 'MonkeyKing', 'nunu & willump': 'Nunu', 'renata glasc': 'Renata' };
    champId = alias[lower] || cleanName.replace(/[^a-zA-Z0-9]/g, '');
  }

  const num = Math.max(0, parseInt(skinId, 10) || 0);
  let resolvedSkinName = String(explicitSkinName || '').trim();
  if (!resolvedSkinName && num > 0 && champId) {
    try {
      if (!dd.skinsById[champId]) {
        const sResp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/de_DE/champion/${encodeURIComponent(champId)}.json`);
        const sJson = await sResp.json();
        const cData = sJson?.data?.[champId];
        if (cData?.skins) dd.skinsById[champId] = cData.skins;
      }
      const match = (dd.skinsById[champId] || []).find((s) => Number(s.num) === num);
      if (match?.name && match.name !== 'default') resolvedSkinName = match.name;
    } catch (e) {}
  }

  const champIcon = `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${champId}.png`;
  return {
    championIconUrl: champIcon,
    skinIconUrl: num > 0 ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champId}_${num}.jpg` : champIcon,
    skinSplashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_${num}.jpg`,
    skinName: resolvedSkinName || (num === 0 ? 'Classic' : `Skin #${num}`)
  };
}

module.exports = {
  DEFAULT_GAME_ADDONS_CONFIG,
  GAME_ADDONS,
  normalizeGameAddonsConfig,
  getAddonById,
  matchAddonByGameName,
  resolveActiveAddon,
  buildObsGameStatsPayload,
  handleGameChatCommand,
  buildCs2GsiConfig,
  resolveLolDdragonAssets
};
