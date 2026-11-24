const http = require('http');
const dgram = require('dgram');
const os = require('os');

/**
 * 100% Local Nanoleaf OpenAPI LAN Controller (Port 16021 — Zero Cloud, Zero Internet)
 * Supports Nanoleaf Shapes, Lines, Canvas, Elements & Light Panels locally over Wi-Fi.
 */

const NANOLEAF_PORT = 16021;

const NANOLEAF_PRESET_ACTIONS = [
  { id: 'color:#9146ff', name: '🎨 Vollfarbe: Twitch Lila (#9146ff)' },
  { id: 'color:#38bdf8', name: '🎨 Vollfarbe: Cyber Cyan (#38bdf8)' },
  { id: 'color:#ef4444', name: '🎨 Vollfarbe: Raid / Alarm Rot (#ef4444)' },
  { id: 'color:#10b981', name: '🎨 Vollfarbe: Emerald Grün (#10b981)' },
  { id: 'color:#f59e0b', name: '🎨 Vollfarbe: Gold / Bits Amber (#f59e0b)' },
  { id: 'color:#ec4899', name: '🎨 Vollfarbe: SubGift Neon Pink (#ec4899)' },
  { id: 'color:#a855f7', name: '🎨 Vollfarbe: Resub Violett (#a855f7)' },
  { id: 'color:#ffffff', name: '🎨 Vollfarbe: Studio Weiß (#ffffff)' },
  { id: 'power:on', name: '💡 Nanoleaf Einschalten' },
  { id: 'power:off', name: '🌑 Nanoleaf Ausschalten' }
];

const DEFAULT_NANOLEAF_CONFIG = {
  enabled: false,
  ip: '',
  authToken: '', // Local token from POST /api/v1/new while Nanoleaf controller is in pairing mode
  brightness: 75,
  autoOnLive: false,
  autoOffStop: false,
  revertAfterSec: 8,
  eventScenes: {
    defaultScene: '',
    streamStart: '',
    follow: '',
    sub: '',
    resub: '',
    subgift: '',
    bits: '',
    raid: '',
    hype: '',
    streamStop: ''
  }
};

function normalizeNanoleafConfig(raw = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    ...DEFAULT_NANOLEAF_CONFIG,
    ...src,
    eventScenes: { ...DEFAULT_NANOLEAF_CONFIG.eventScenes, ...(src.eventScenes || {}) }
  };
}

function parseHostPort(raw) {
  const s = String(raw || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  const [host, portStr] = s.split(':');
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(host || '')) return null;
  return { host, port: parseInt(portStr || String(NANOLEAF_PORT), 10) || NANOLEAF_PORT };
}

function nanoleafRequest(ipOrHostPort, urlPath, method = 'GET', bodyObj = null, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const hp = parseHostPort(ipOrHostPort);
    if (!hp) return reject(new Error('Ungültige lokale Nanoleaf IP-Adresse.'));
    const payload = bodyObj ? Buffer.from(JSON.stringify(bodyObj), 'utf8') : null;
    const req = http.request(
      {
        host: hp.host,
        port: hp.port,
        path: urlPath,
        method,
        timeout: timeoutMs,
        headers: payload
          ? { 'Content-Type': 'application/json', 'Content-Length': payload.length }
          : { Accept: 'application/json' }
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          if (res.statusCode === 204) return resolve({});
          if (res.statusCode < 200 || res.statusCode >= 300) {
            const err = new Error(`Nanoleaf HTTP ${res.statusCode}`);
            err.statusCode = res.statusCode;
            return reject(err);
          }
          if (!data.trim()) return resolve({});
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({});
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Nanoleaf Timeout')));
    if (payload) req.write(payload);
    req.end();
  });
}

function ssdpDiscoverNanoleaf(timeoutMs = 1100) {
  return new Promise((resolve) => {
    const found = new Map();
    let sock = null;
    try {
      sock = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      sock.on('message', (msg, rinfo) => {
        const txt = msg.toString('utf8');
        if (/nanoleaf|nl-deviceid|:16021/i.test(txt) && rinfo?.address) {
          const nameMatch = txt.match(/nl-devicename:\s*([^\r\n]+)/i);
          found.set(rinfo.address, {
            ip: rinfo.address,
            name: nameMatch ? nameMatch[1].trim() : `Nanoleaf (${rinfo.address})`
          });
        }
      });
      sock.on('error', () => {});
      sock.bind(() => {
        for (const st of ['nanoleaf_aurora:light', 'nanoleaf:nl29', 'nanoleaf:nl42', 'nanoleaf:nl52', 'ssdp:all']) {
          const pkt = Buffer.from(
            `M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: "ssdp:discover"\r\nMX: 1\r\nST: ${st}\r\n\r\n`,
            'utf8'
          );
          sock.send(pkt, 0, pkt.length, 1900, '239.255.255.250', () => {});
        }
      });
    } catch (e) {}
    setTimeout(() => {
      try { sock?.close(); } catch (e) {}
      resolve([...found.values()]);
    }, timeoutMs);
  });
}

function probeNanoleafPort(ip, timeoutMs = 450) {
  return new Promise((resolve) => {
    const req = http.request(
      { host: ip, port: NANOLEAF_PORT, path: '/api/v1/', method: 'GET', timeout: timeoutMs },
      (res) => {
        res.resume();
        // Unpaired Nanoleaf controllers respond with 401/403/404 on port 16021!
        if ([200, 401, 403, 404].includes(res.statusCode)) {
          resolve({ ip, name: `Nanoleaf (${ip})` });
        } else {
          resolve(null);
        }
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}

async function discoverNanoleafDevices() {
  const ssdp = await ssdpDiscoverNanoleaf(1000);
  if (ssdp.length > 0) return ssdp;

  // Fallback: Fast local subnet scan on dedicated Nanoleaf port 16021 (100% offline LAN)
  const nets = os.networkInterfaces();
  const prefixes = new Set();
  for (const list of Object.values(nets)) {
    for (const iface of list || []) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address) {
        const p = iface.address.split('.');
        if (p.length === 4) prefixes.add(`${p[0]}.${p[1]}.${p[2]}`);
      }
    }
  }
  const candidates = [];
  for (const pref of prefixes) {
    for (let i = 1; i <= 254; i++) candidates.push(`${pref}.${i}`);
  }
  const found = [];
  const batchSize = 64;
  for (let i = 0; i < candidates.length; i += batchSize) {
    const res = await Promise.all(candidates.slice(i, i + batchSize).map((ip) => probeNanoleafPort(ip, 450)));
    for (const d of res) {
      if (d) found.push(d);
    }
  }
  return found;
}

async function pairNanoleaf(ip) {
  const hp = parseHostPort(ip);
  if (!hp) return { ok: false, error: 'Bitte zuerst die lokale IP-Adresse deines Nanoleaf eingeben oder suchen.' };
  try {
    const res = await nanoleafRequest(hp.host, '/api/v1/new', 'POST', null, 3000);
    const token = res?.auth_token;
    if (!token) return { ok: false, error: 'Kein Auth-Token vom Nanoleaf erhalten.' };
    return { ok: true, ip: hp.host, authToken: token };
  } catch (err) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      return {
        ok: false,
        needsPairingMode: true,
        error: 'Nanoleaf ist nicht im Kopplungs-Modus: Halte die Power-Taste am Nanoleaf-Controller 5–7 Sek. gedrückt (bis die LEDs blinken) und klicke dann sofort erneut auf „Koppeln“!'
      };
    }
    return { ok: false, error: `Nanoleaf nicht erreichbar (${err.message}).` };
  }
}

function hexToNanoleafHsb(hex) {
  const clean = String(hex || '#ffffff').replace(/^#/, '').trim();
  const num = parseInt(clean, 16);
  const r = ((Number.isNaN(num) ? 0xffffff : num) >> 16) & 255;
  const g = ((Number.isNaN(num) ? 0xffffff : num) >> 8) & 255;
  const b = (Number.isNaN(num) ? 0xffffff : num) & 255;

  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rf) h = ((gf - bf) / d) % 6;
    else if (max === gf) h = (bf - rf) / d + 2;
    else h = (rf - gf) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.max(5, Math.round(max * 100));
  return { hue: h, sat: s, brightness: v };
}

async function getNanoleafInfo(ip, authToken) {
  const hp = parseHostPort(ip);
  const tok = String(authToken || '').trim();
  if (!hp || !tok) throw new Error('Nanoleaf IP und lokales Auth-Token erforderlich.');

  const info = await nanoleafRequest(hp.host, `/api/v1/${encodeURIComponent(tok)}/`, 'GET', null, 2500);
  const effectsList = Array.isArray(info?.effects?.effectsList) ? info.effects.effectsList : [];
  const effectActions = effectsList.map((eff) => ({
    id: `effect:${eff}`,
    name: `🔺 Effekt: ${eff}`
  }));

  return {
    ok: true,
    name: info?.name || `Nanoleaf (${hp.host})`,
    model: info?.model || '',
    on: Boolean(info?.state?.on?.value),
    brightness: Number(info?.state?.brightness?.value ?? 75),
    selectedEffect: info?.effects?.select || '',
    effects: effectsList,
    actions: [...effectActions, ...NANOLEAF_PRESET_ACTIONS]
  };
}

async function setNanoleafState({ ip, authToken, on, brightness, hexColor, effect }) {
  const hp = parseHostPort(ip);
  const tok = String(authToken || '').trim();
  if (!hp || !tok) return { ok: false, error: 'Nanoleaf ist noch nicht gekoppelt.' };

  if (effect) {
    await nanoleafRequest(hp.host, `/api/v1/${encodeURIComponent(tok)}/effects`, 'PUT', { select: String(effect) });
    if (typeof brightness === 'number') {
      await nanoleafRequest(hp.host, `/api/v1/${encodeURIComponent(tok)}/state`, 'PUT', {
        on: { value: true },
        brightness: { value: Math.max(1, Math.min(100, Math.round(brightness))) }
      }).catch(() => {});
    }
    return { ok: true };
  }

  const stateBody = {};
  if (typeof on === 'boolean') stateBody.on = { value: on };
  if (hexColor && stateBody.on?.value !== false) {
    const hsb = hexToNanoleafHsb(hexColor);
    stateBody.on = { value: true };
    stateBody.hue = { value: hsb.hue };
    stateBody.sat = { value: hsb.sat };
  }
  if (typeof brightness === 'number' && stateBody.on?.value !== false) {
    stateBody.brightness = { value: Math.max(1, Math.min(100, Math.round(brightness))) };
  }

  await nanoleafRequest(hp.host, `/api/v1/${encodeURIComponent(tok)}/state`, 'PUT', stateBody);
  return { ok: true };
}

async function applyNanoleafAction(nlCfg, actionId) {
  const act = String(actionId || '').trim();
  if (!nlCfg?.ip || !nlCfg?.authToken || !act) return { ok: false, error: 'Nanoleaf oder Aktion fehlt.' };

  if (act.startsWith('effect:')) {
    return await setNanoleafState({
      ip: nlCfg.ip,
      authToken: nlCfg.authToken,
      effect: act.slice(7),
      brightness: Number(nlCfg.brightness ?? 75)
    });
  }
  if (act.startsWith('color:')) {
    return await setNanoleafState({
      ip: nlCfg.ip,
      authToken: nlCfg.authToken,
      on: true,
      hexColor: act.slice(6),
      brightness: Number(nlCfg.brightness ?? 80)
    });
  }
  if (act === 'power:on' || act === 'power:off') {
    return await setNanoleafState({
      ip: nlCfg.ip,
      authToken: nlCfg.authToken,
      on: act === 'power:on',
      brightness: act === 'power:on' ? Number(nlCfg.brightness ?? 75) : undefined
    });
  }
  return { ok: false, error: `Unbekannte Nanoleaf-Aktion: ${act}` };
}

let nlRevertTimer = null;

async function triggerNanoleafForEvent(rawCfg, eventType) {
  const cfg = normalizeNanoleafConfig(rawCfg);
  if (!cfg.enabled || !cfg.ip || !cfg.authToken) return { ok: false, skipped: true };
  const actionId = String(cfg.eventScenes?.[eventType] || '').trim();
  if (!actionId) return { ok: false, skipped: true };

  if (nlRevertTimer) {
    clearTimeout(nlRevertTimer);
    nlRevertTimer = null;
  }

  const res = await applyNanoleafAction(cfg, actionId);
  const revertSec = Math.max(0, Number(cfg.revertAfterSec ?? 8));
  const fallback = String(cfg.eventScenes?.defaultScene || cfg.eventScenes?.streamStart || '').trim();
  if (
    res.ok &&
    revertSec > 0 &&
    fallback &&
    !['streamStart', 'streamStop', 'defaultScene'].includes(eventType) &&
    fallback !== actionId
  ) {
    nlRevertTimer = setTimeout(() => {
      applyNanoleafAction(cfg, fallback).catch(() => {});
    }, revertSec * 1000);
  }
  return res;
}

module.exports = {
  NANOLEAF_PORT,
  NANOLEAF_PRESET_ACTIONS,
  DEFAULT_NANOLEAF_CONFIG,
  normalizeNanoleafConfig,
  discoverNanoleafDevices,
  pairNanoleaf,
  getNanoleafInfo,
  setNanoleafState,
  applyNanoleafAction,
  triggerNanoleafForEvent
};
