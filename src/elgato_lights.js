const http = require('http');
const os = require('os');

function kelvinToMired(kelvin) {
  const k = Math.max(2900, Math.min(7000, Number(kelvin) || 4500));
  return Math.max(143, Math.min(344, Math.round(1000000 / k)));
}

function miredToKelvin(mired) {
  const m = Math.max(143, Math.min(344, Number(mired) || 222));
  return Math.round(1000000 / m / 50) * 50;
}

function parseIpList(raw) {
  return String(raw || '')
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function httpJsonRequest(ip, urlPath, method = 'GET', bodyObj = null, timeoutMs = 1500) {
  return new Promise((resolve, reject) => {
    const cleanHost = String(ip || '').replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    const [host, portPart] = cleanHost.split(':');
    const port = parseInt(portPart || '9123', 10) || 9123;
    const payload = bodyObj ? Buffer.from(JSON.stringify(bodyObj), 'utf8') : null;

    const req = http.request(
      {
        host,
        port,
        path: urlPath,
        method,
        timeout: timeoutMs,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': payload.length
            }
          : {}
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('Timeout'));
    });
    if (payload) req.write(payload);
    req.end();
  });
}

async function getLightInfo(ip, timeoutMs = 900) {
  const info = await httpJsonRequest(ip, '/elgato/accessory-info', 'GET', null, timeoutMs);
  const state = await httpJsonRequest(ip, '/elgato/lights', 'GET', null, timeoutMs).catch(() => null);
  const l0 = state?.lights?.[0] || {};
  return {
    ip,
    name: info?.displayName || info?.productName || `Elgato Light (${ip})`,
    productName: info?.productName || 'Elgato Light',
    on: Boolean(l0.on),
    brightness: Number(l0.brightness ?? 50),
    temperatureK: l0.temperature ? miredToKelvin(l0.temperature) : 4500
  };
}

async function discoverElgatoLights() {
  const nets = os.networkInterfaces();
  const prefixes = new Set();
  for (const list of Object.values(nets)) {
    for (const iface of list || []) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address) {
        const parts = iface.address.split('.');
        if (parts.length === 4) {
          prefixes.add(`${parts[0]}.${parts[1]}.${parts[2]}`);
        }
      }
    }
  }

  const candidates = [];
  for (const prefix of prefixes) {
    for (let i = 1; i <= 254; i++) {
      candidates.push(`${prefix}.${i}`);
    }
  }

  const found = [];
  const batchSize = 64;
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((ip) => getLightInfo(ip, 650).catch(() => null))
    );
    for (const r of results) {
      if (r) found.push(r);
    }
  }
  return found;
}

async function setElgatoLights({ ips, on, brightness, temperatureK }) {
  const list = Array.isArray(ips) ? ips : parseIpList(ips);
  if (!list.length) {
    return { ok: false, error: 'Keine Elgato IP-Adresse angegeben.' };
  }
  const lightPatch = {};
  if (on !== undefined) lightPatch.on = on ? 1 : 0;
  if (brightness !== undefined) {
    lightPatch.brightness = Math.max(3, Math.min(100, Math.round(Number(brightness) || 50)));
  }
  if (temperatureK !== undefined) {
    lightPatch.temperature = kelvinToMired(temperatureK);
  }

  const results = [];
  const errors = [];
  await Promise.all(
    list.map(async (ip) => {
      try {
        const res = await httpJsonRequest(
          ip,
          '/elgato/lights',
          'PUT',
          { numberOfLights: 1, lights: [lightPatch] },
          1800
        );
        const l0 = res?.lights?.[0] || lightPatch;
        results.push({
          ip,
          on: Boolean(l0.on),
          brightness: l0.brightness,
          temperatureK: l0.temperature ? miredToKelvin(l0.temperature) : temperatureK
        });
      } catch (err) {
        errors.push(`${ip}: ${err.message}`);
      }
    })
  );

  return {
    ok: results.length > 0,
    updated: results,
    errors,
    error: results.length === 0 ? errors.join(' | ') : ''
  };
}

async function toggleElgatoLights({ ips, brightness = 60, temperatureK = 4500 }) {
  const list = Array.isArray(ips) ? ips : parseIpList(ips);
  if (!list.length) return { ok: false, error: 'Keine Elgato IP-Adresse angegeben.' };
  let currentlyOn = false;
  try {
    const st = await httpJsonRequest(list[0], '/elgato/lights', 'GET', null, 1200);
    currentlyOn = Boolean(st?.lights?.[0]?.on);
  } catch (e) {}
  return setElgatoLights({
    ips: list,
    on: !currentlyOn,
    brightness: !currentlyOn ? brightness : undefined,
    temperatureK: !currentlyOn ? temperatureK : undefined
  });
}

module.exports = {
  parseIpList,
  discoverElgatoLights,
  getLightInfo,
  setElgatoLights,
  toggleElgatoLights
};
