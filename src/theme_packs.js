const fs = require('fs');
const path = require('path');

const BUILTIN_CHAMPION_PACKS = [
  {
    id: 'jinx-arcane-zaun',
    name: 'Jinx — Arcane / Zaun',
    icon: '💥',
    championMatch: ['jinx'],
    version: '1.0.0',
    author: 'OmniGrid Studio',
    effect: 'jinx-glitch',
    description: 'Neon-Pink & Zaun-Giftgrün, Graffiti-Splatter, Glitch-Rahmen & Shimmer-Glow für Chat, HUD, Build-Bar & Minimap.',
    colors: {
      primary: '#ff2a85',
      secondary: '#39ff14',
      tertiary: '#00f5d4',
      bgStart: 'rgba(18, 6, 26, 0.95)',
      bgEnd: 'rgba(6, 18, 22, 0.96)',
      text: '#fff0f7',
      muted: '#f9a8d4'
    },
    mapCoverBadge: 'POW-POW // DON\'T PEEK! 💥',
    skinArt: { championId: 'Jinx', skinQuery: 'Arcane' }
  }
];

function sanitizeHexOrRgba(val, fallback) {
  const s = String(val || '').trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return s;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(s)) return s;
  return fallback;
}

const KNOWN_PACK_ASSETS = {
  'akali-kda-firestarter-ignition': {
    characterArt: 'akali-ignition-art.png',
    skinArt: { championId: 'Akali', skinQuery: 'Firestarter Ignition', localAsset: 'akali-kda-firestarter-ignition.jpg' }
  }
};

function sanitizePack(raw = {}) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 48);
  const name = String(raw.name || '').trim().slice(0, 80);
  if (!id || !name) return null;
  const known = KNOWN_PACK_ASSETS[id] || null;
  const c = raw.colors && typeof raw.colors === 'object' ? raw.colors : {};
  const allowedEffects = ['none', 'jinx-glitch', 'kda-firestarter', 'kda-all-out', 'risen-legend', 'inkshadow', 'dark-cosmic', 'black-rose', 'ravenborn', 'elementalist', 'high-noon', 'arcane-prestige', 'prestige-cosmic', 'god-king', 'radiant-cloud', 'soul-fighter', 'blossom-springs', 'zaun-lab', 'crime-city', 'prestige-rose', 'spirit-blossom', 'nightbringer', 'project-cyber', 'ruined-mist', 'neon-pulse', 'hextech'];
  const eff = allowedEffects.includes(String(raw.effect || '')) ? String(raw.effect) : 'none';
  const rawCharArt = String(raw.characterArt || known?.characterArt || '');
  const rawSkin = raw.skinArt && typeof raw.skinArt === 'object' ? raw.skinArt : (known?.skinArt || null);
  const resolvedLocal = String(rawSkin?.localAsset || known?.skinArt?.localAsset || '');
  return {
    id,
    name,
    icon: String(raw.icon || '🎨').slice(0, 8),
    championMatch: Array.isArray(raw.championMatch)
      ? raw.championMatch.map((x) => String(x || '').trim().toLowerCase()).filter(Boolean).slice(0, 12)
      : [],
    version: String(raw.version || '1.0.0').slice(0, 20),
    author: String(raw.author || 'Community').slice(0, 48),
    effect: eff,
    description: String(raw.description || '').slice(0, 220),
    colors: {
      primary: sanitizeHexOrRgba(c.primary, '#ff2a85'),
      secondary: sanitizeHexOrRgba(c.secondary, '#39ff14'),
      tertiary: sanitizeHexOrRgba(c.tertiary, '#00f5d4'),
      bgStart: sanitizeHexOrRgba(c.bgStart, 'rgba(18, 6, 26, 0.95)'),
      bgEnd: sanitizeHexOrRgba(c.bgEnd, 'rgba(6, 18, 22, 0.96)'),
      text: sanitizeHexOrRgba(c.text, '#f8fafc'),
      muted: sanitizeHexOrRgba(c.muted, '#cbd5e1')
    },
    mapCoverBadge: String(raw.mapCoverBadge || '').slice(0, 64),
    characterArt: /^[a-z0-9_-]+\.(png|webp|jpg|jpeg)$/i.test(rawCharArt) ? rawCharArt.slice(0, 80) : '',
    skinArt: rawSkin && /^[A-Za-z0-9]{1,32}$/.test(String(rawSkin.championId || ''))
      ? {
          championId: String(rawSkin.championId).slice(0, 32),
          skinQuery: String(rawSkin.skinQuery || '').slice(0, 64),
          ...(/^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(resolvedLocal)
            ? { localAsset: resolvedLocal.slice(0, 80) }
            : {})
        }
      : null,
    builtin: Boolean(raw.builtin)
  };
}

function getThemesDir(userDataDir) {
  const dir = path.join(userDataDir, 'themes');
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}
  return dir;
}

function ensureStarterPacks(userDataDir) {
  const dir = getThemesDir(userDataDir);
  for (const pack of BUILTIN_CHAMPION_PACKS) {
    const file = path.join(dir, `${pack.id}.json`);
    if (!fs.existsSync(file)) {
      try {
        fs.writeFileSync(file, JSON.stringify({ ...pack, builtin: true }, null, 2) + '\n', 'utf8');
      } catch (e) {}
    }
  }
  return dir;
}

function listInstalledPacks(userDataDir) {
  const dir = ensureStarterPacks(userDataDir);
  const map = new Map();
  for (const bp of BUILTIN_CHAMPION_PACKS) {
    const clean = sanitizePack({ ...bp, builtin: true });
    if (clean) map.set(clean.id, clean);
  }
  try {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      try {
        const parsed = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        const clean = sanitizePack(parsed);
        if (clean) map.set(clean.id, { ...clean, builtin: BUILTIN_CHAMPION_PACKS.some((b) => b.id === clean.id) });
      } catch (e) {}
    }
  } catch (e) {}
  return [...map.values()];
}

function installPackFromJson(userDataDir, rawJson) {
  const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  const clean = sanitizePack(parsed);
  if (!clean) {
    return { ok: false, error: 'Ungültiges Champion-Pack (benötigt mindestens "id" und "name").' };
  }
  const dir = getThemesDir(userDataDir);
  const dest = path.join(dir, `${clean.id}.json`);
  fs.writeFileSync(dest, JSON.stringify(clean, null, 2) + '\n', 'utf8');
  return { ok: true, pack: clean, filePath: dest };
}

function deletePack(userDataDir, packId) {
  const safeId = String(packId || '').replace(/[^a-z0-9_-]/gi, '');
  if (!safeId || BUILTIN_CHAMPION_PACKS.some((b) => b.id === safeId)) {
    return { ok: false, error: 'Eingebaute Starter-Packs können nicht gelöscht werden.' };
  }
  const file = path.join(getThemesDir(userDataDir), `${safeId}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  return { ok: true };
}

function resolveActiveChampionTheme(cfg = {}, packs = []) {
  const mode = String(cfg.championThemeMode || 'none').trim();
  if (!mode || mode === 'none' || mode === 'default' || mode === 'auto') return null;
  return packs.find((p) => p.id === mode) || null;
}

module.exports = {
  BUILTIN_CHAMPION_PACKS,
  getThemesDir,
  listInstalledPacks,
  installPackFromJson,
  deletePack,
  resolveActiveChampionTheme
};
