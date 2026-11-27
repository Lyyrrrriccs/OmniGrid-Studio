const fs = require('fs');
const path = require('path');
const https = require('https');

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
  const allowedEffects = ['none', 'jinx-glitch', 'kda-firestarter', 'kda-all-out', 'risen-legend', 'inkshadow', 'dark-cosmic', 'black-rose', 'ravenborn', 'elementalist', 'high-noon', 'arcane-prestige', 'prestige-cosmic', 'god-king', 'radiant-cloud', 'soul-fighter', 'blossom-springs', 'zaun-lab', 'crime-city', 'prestige-rose', 'dj-sona', 'arcane-fractured', 'eve-firestarter', 'ahri-firestarter', 'unbound-thresh', 'spirit-blossom', 'nightbringer', 'project-cyber', 'ruined-mist', 'neon-pulse', 'hextech'];
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
          ...(Number.isFinite(Number(rawSkin.skinNum)) ? { skinNum: Number(rawSkin.skinNum) } : {}),
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

function packFingerprint(pack) {
  if (!pack) return '';
  return JSON.stringify({
    name: pack.name,
    icon: pack.icon,
    version: pack.version,
    effect: pack.effect,
    description: pack.description,
    colors: pack.colors,
    mapCoverBadge: pack.mapCoverBadge,
    characterArt: pack.characterArt,
    skinArt: pack.skinArt,
    championMatch: pack.championMatch
  });
}

function isOfficialUpdatablePack(pack) {
  if (!pack) return false;
  const author = String(pack.author || '').trim().toLowerCase();
  return !author || author === 'omnigrid studio' || author === 'community';
}

function syncInstalledPacksLocal(userDataDir, bundledPacksDir) {
  const dir = getThemesDir(userDataDir);
  const updated = [];
  let checked = 0;
  if (!bundledPacksDir || !fs.existsSync(bundledPacksDir)) return { updated, checked };
  try {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const localPath = path.join(dir, f);
      let localClean = null;
      try {
        localClean = sanitizePack(JSON.parse(fs.readFileSync(localPath, 'utf8')));
      } catch (e) {}
      if (!localClean || !isOfficialUpdatablePack(localClean)) continue;
      const bundledPath = path.join(bundledPacksDir, `${localClean.id}.json`);
      if (!fs.existsSync(bundledPath)) continue;
      checked++;
      try {
        const bundledClean = sanitizePack(JSON.parse(fs.readFileSync(bundledPath, 'utf8')));
        if (!bundledClean) continue;
        if (packFingerprint(localClean) !== packFingerprint(bundledClean)) {
          fs.writeFileSync(localPath, JSON.stringify(bundledClean, null, 2) + '\n', 'utf8');
          updated.push({ id: bundledClean.id, name: bundledClean.name, source: 'local' });
        }
      } catch (e) {}
    }
  } catch (e) {}
  return { updated, checked };
}

function fetchGitHubPackJson(packId, timeoutMs = 5500) {
  return new Promise((resolve) => {
    const safeId = String(packId || '').replace(/[^a-z0-9_-]/gi, '');
    if (!safeId) return resolve(null);
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/Lyyrrrriccs/OmniGrid-Studio/contents/docs/packs/${safeId}.json`,
      method: 'GET',
      headers: {
        'User-Agent': 'OmniGrid-Studio',
        Accept: 'application/vnd.github.raw+json'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return resolve(null);
      }
      let body = '';
      res.on('data', (c) => {
        body += c;
        if (body.length > 65536) req.destroy();
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.setTimeout(timeoutMs, () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function checkAndUpdatePacks(userDataDir, { bundledPacksDir = '', online = true } = {}) {
  const localRes = syncInstalledPacksLocal(userDataDir, bundledPacksDir);
  const updatedMap = new Map(localRes.updated.map((u) => [u.id, u]));
  const dir = getThemesDir(userDataDir);
  let checked = localRes.checked;
  let onlineChecked = 0;

  if (online) {
    const installed = listInstalledPacks(userDataDir).filter((p) => isOfficialUpdatablePack(p));
    checked = Math.max(checked, installed.length);
    await Promise.all(installed.map(async (localClean) => {
      const remoteRaw = await fetchGitHubPackJson(localClean.id);
      if (!remoteRaw) return;
      onlineChecked++;
      const remoteClean = sanitizePack(remoteRaw);
      if (!remoteClean) return;
      if (packFingerprint(localClean) !== packFingerprint(remoteClean)) {
        const dest = path.join(dir, `${remoteClean.id}.json`);
        fs.writeFileSync(dest, JSON.stringify(remoteClean, null, 2) + '\n', 'utf8');
        updatedMap.set(remoteClean.id, { id: remoteClean.id, name: remoteClean.name, source: 'github' });
      }
    }));
  }

  return {
    ok: true,
    updated: [...updatedMap.values()],
    checked,
    onlineChecked
  };
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
  syncInstalledPacksLocal,
  checkAndUpdatePacks,
  resolveActiveChampionTheme
};
