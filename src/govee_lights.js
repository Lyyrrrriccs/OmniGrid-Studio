const https = require('https');
const crypto = require('crypto');

const GOVEE_BASE_HOST = 'openapi.api.govee.com';

const PRESET_COLOR_OPTIONS = [
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

function hexToGoveeRgbInt(hex) {
  const clean = String(hex || '').replace(/^#/, '').trim();
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return 0xffffff;
  return num & 0xffffff;
}

function goveeRequest(apiKey, urlPath, method = 'GET', bodyObj = null, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    const key = String(apiKey || '').trim();
    if (!key) return reject(new Error('Kein Govee API-Key angegeben.'));
    const payload = bodyObj ? Buffer.from(JSON.stringify(bodyObj), 'utf8') : null;
    const headers = {
      'Govee-API-Key': key,
      Accept: 'application/json'
    };
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = payload.length;
    }

    const req = https.request(
      {
        host: GOVEE_BASE_HOST,
        port: 443,
        path: urlPath,
        method,
        timeout: timeoutMs,
        headers
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          let parsed = null;
          try { parsed = JSON.parse(raw); } catch (e) {}
          if (res.statusCode === 401 || res.statusCode === 403) {
            return reject(new Error('Govee API-Key ungültig oder abgelehnt (401/403).'));
          }
          if (res.statusCode === 429) {
            return reject(new Error('Govee API Rate-Limit erreicht (429).'));
          }
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(parsed?.message || parsed?.msg || `Govee HTTP ${res.statusCode}`));
          }
          if (parsed && parsed.code && parsed.code !== 200) {
            return reject(new Error(parsed.message || parsed.msg || `Govee Fehlercode ${parsed.code}`));
          }
          resolve(parsed || {});
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Govee API Timeout')));
    if (payload) req.write(payload);
    req.end();
  });
}

async function listGoveeDevices(apiKey) {
  const res = await goveeRequest(apiKey, '/router/api/v1/user/devices', 'GET');
  const list = Array.isArray(res.data) ? res.data : [];
  return list.map((d) => ({
    sku: d.sku || '',
    device: d.device || '',
    deviceName: d.deviceName || `${d.sku || 'Govee'} (${d.device || ''})`,
    type: d.type || ''
  }));
}

async function listGoveeScenes(apiKey, { sku, device }) {
  if (!sku || !device) {
    return { ok: true, scenes: [...PRESET_COLOR_OPTIONS] };
  }
  const dynamicOptions = [];
  const diyOptions = [];

  try {
    const dynRes = await goveeRequest(apiKey, '/router/api/v1/device/scenes', 'POST', {
      requestId: crypto.randomUUID(),
      payload: { sku, device }
    });
    const caps = dynRes?.payload?.capabilities || [];
    for (const cap of caps) {
      const opts = cap?.parameters?.options || [];
      for (const opt of opts) {
        if (opt && opt.name !== undefined && opt.value !== undefined) {
          dynamicOptions.push({
            id: `scene:${JSON.stringify(opt.value)}`,
            name: `✨ Szene: ${opt.name}`
          });
        }
      }
    }
  } catch (e) {}

  try {
    const diyRes = await goveeRequest(apiKey, '/router/api/v1/device/diy-scenes', 'POST', {
      requestId: crypto.randomUUID(),
      payload: { sku, device }
    });
    const caps = diyRes?.payload?.capabilities || [];
    for (const cap of caps) {
      const opts = cap?.parameters?.options || [];
      for (const opt of opts) {
        if (opt && opt.name !== undefined && opt.value !== undefined) {
          diyOptions.push({
            id: `diy:${JSON.stringify(opt.value)}`,
            name: `🛠️ DIY-Szene: ${opt.name}`
          });
        }
      }
    }
  } catch (e) {}

  return {
    ok: true,
    scenes: [...dynamicOptions, ...diyOptions, ...PRESET_COLOR_OPTIONS]
  };
}

function parseDeviceSpec(spec) {
  if (!spec) return null;
  if (typeof spec === 'object' && spec.sku && spec.device) {
    return { sku: String(spec.sku).trim(), device: String(spec.device).trim() };
  }
  const [sku, device] = String(spec).split('||').map((s) => s.trim());
  if (sku && device) return { sku, device };
  return null;
}

function resolveTargets(targetsInput) {
  const rawList = Array.isArray(targetsInput) ? targetsInput : [targetsInput];
  const out = [];
  const seen = new Set();
  for (const item of rawList) {
    const parsed = parseDeviceSpec(item);
    if (parsed) {
      const key = `${parsed.sku}||${parsed.device}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(parsed);
      }
    }
  }
  return out;
}

async function applyGoveeAction(apiKey, targetsInput, actionId) {
  const act = String(actionId || '').trim();
  if (!act) return { ok: false, error: 'Keine Szene oder Aktion ausgewählt.' };
  const targets = resolveTargets(targetsInput);
  if (!targets.length) return { ok: false, error: 'Bitte zuerst mindestens eine Govee-Lampe auswählen.' };

  let capability = null;
  if (act.startsWith('scene:')) {
    const val = JSON.parse(act.slice(6));
    capability = {
      type: 'devices.capabilities.dynamic_scene',
      instance: 'lightScene',
      value: val
    };
  } else if (act.startsWith('diy:')) {
    const val = JSON.parse(act.slice(4));
    capability = {
      type: 'devices.capabilities.diy_scene',
      instance: 'diyScene',
      value: val
    };
  } else if (act.startsWith('color:')) {
    const hex = act.slice(6);
    capability = {
      type: 'devices.capabilities.color_setting',
      instance: 'colorRgb',
      value: hexToGoveeRgbInt(hex)
    };
  } else if (act === 'power:on' || act === 'power:off') {
    capability = {
      type: 'devices.capabilities.on_off',
      instance: 'powerSwitch',
      value: act === 'power:on' ? 1 : 0
    };
  } else {
    return { ok: false, error: `Unbekannte Govee-Aktion: ${act}` };
  }

  const errors = [];
  let successCount = 0;
  await Promise.all(
    targets.map(async ({ sku, device }) => {
      try {
        await goveeRequest(apiKey, '/router/api/v1/device/control', 'POST', {
          requestId: crypto.randomUUID(),
          payload: { sku, device, capability }
        });
        successCount++;
      } catch (err) {
        errors.push(`${sku}: ${err.message}`);
      }
    })
  );

  return {
    ok: successCount > 0,
    updatedCount: successCount,
    error: successCount === 0 ? errors.join(' | ') : ''
  };
}

let revertTimer = null;

function getTargetsForEvent(goveeCfg, eventType) {
  const perEventSpec = goveeCfg?.eventDevices?.[eventType];
  if (perEventSpec) {
    const single = resolveTargets(perEventSpec);
    if (single.length) return single;
  }
  if (Array.isArray(goveeCfg?.selectedDevices) && goveeCfg.selectedDevices.length) {
    const list = resolveTargets(goveeCfg.selectedDevices);
    if (list.length) return list;
  }
  if (goveeCfg?.sku && goveeCfg?.device) {
    return [{ sku: String(goveeCfg.sku).trim(), device: String(goveeCfg.device).trim() }];
  }
  return [];
}

async function triggerGoveeForEvent(goveeCfg, eventType) {
  if (!goveeCfg || !goveeCfg.enabled) return { ok: false, skipped: true };
  const apiKey = String(goveeCfg.apiKey || '').trim();
  const targets = getTargetsForEvent(goveeCfg, eventType);
  if (!apiKey || !targets.length) return { ok: false, skipped: true };

  const map = goveeCfg.eventScenes || {};
  const actionId = String(map[eventType] || '').trim();
  if (!actionId) return { ok: false, skipped: true };

  if (revertTimer) {
    clearTimeout(revertTimer);
    revertTimer = null;
  }

  const res = await applyGoveeAction(apiKey, targets, actionId);

  const revertSec = Math.max(0, Number(goveeCfg.revertAfterSec ?? 8));
  const fallbackScene = String(map.defaultScene || map.streamStart || '').trim();
  if (
    res.ok &&
    revertSec > 0 &&
    fallbackScene &&
    eventType !== 'streamStart' &&
    eventType !== 'streamStop' &&
    eventType !== 'defaultScene' &&
    fallbackScene !== actionId
  ) {
    const fallbackTargets = getTargetsForEvent(goveeCfg, 'defaultScene');
    const revertTargets = fallbackTargets.length ? fallbackTargets : targets;
    revertTimer = setTimeout(() => {
      applyGoveeAction(apiKey, revertTargets, fallbackScene).catch(() => {});
    }, revertSec * 1000);
  }

  return res;
}

module.exports = {
  PRESET_COLOR_OPTIONS,
  listGoveeDevices,
  listGoveeScenes,
  applyGoveeAction,
  triggerGoveeForEvent
};
