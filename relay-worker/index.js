const encoder = new TextEncoder();
const PAIRING_TTL_SEC = 600;
const COMMAND_TTL_SEC = 60;
const ACK_TTL_SEC = 60;
const RATE_WINDOW_SEC = 600;
const RATE_MAX_ATTEMPTS = 8;

const memStore = new Map();

function createStore(env) {
  const kv = env && env.OMNIGRID_RELAY ? env.OMNIGRID_RELAY : null;
  const nowSec = () => Math.floor(Date.now() / 1000);

  return {
    async getJson(key) {
      if (kv) {
        const val = await kv.get(key, 'json');
        return val || null;
      }
      const entry = memStore.get(key);
      if (!entry) return null;
      if (entry.exp && entry.exp < nowSec()) {
        memStore.delete(key);
        return null;
      }
      return entry.value;
    },
    async putJson(key, value, ttlSec = 0) {
      if (kv) {
        await kv.put(key, JSON.stringify(value), ttlSec > 0 ? { expirationTtl: Math.max(60, ttlSec) } : undefined);
        return;
      }
      memStore.set(key, { value, exp: ttlSec > 0 ? nowSec() + ttlSec : 0 });
    },
    async del(key) {
      if (kv) {
        await kv.delete(key);
        return;
      }
      memStore.delete(key);
    }
  };
}

function toHex(buf) {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function randomHex(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr);
}

async function sha256Hex(input) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(input || '')));
  return toHex(digest);
}

async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(String(secret || '')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(String(message || '')));
  return toHex(sig);
}

function timingSafeEqualStr(a, b) {
  const sa = String(a || '');
  const sb = String(b || '');
  if (sa.length !== sb.length || sa.length === 0) return false;
  let diff = 0;
  for (let i = 0; i < sa.length; i++) {
    diff |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
  }
  return diff === 0;
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-OmniGrid-Timestamp, X-OmniGrid-Signature',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      ...extraHeaders
    }
  });
}

function normalizePairingCode(raw) {
  return String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

function extractBearer(req) {
  const auth = req.headers.get('Authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

async function verifyDesktopAuth(req, channel, pathname) {
  if (!channel || !channel.deviceSecretHash) return false;
  const bearer = extractBearer(req);
  if (bearer) {
    const hash = await sha256Hex(bearer);
    return timingSafeEqualStr(hash, channel.deviceSecretHash);
  }
  const ts = req.headers.get('X-OmniGrid-Timestamp') || '';
  const sig = req.headers.get('X-OmniGrid-Signature') || '';
  if (!ts || !sig || !channel.deviceSecret) return false;
  const drift = Math.abs(Date.now() - Number(ts));
  if (!Number.isFinite(drift) || drift > 300000) return false;
  const expected = await hmacSha256Hex(channel.deviceSecret, `${ts}:${req.method}:${pathname}`);
  return timingSafeEqualStr(sig, expected);
}

async function verifyAssistantAuth(req, channel) {
  if (!channel || !Array.isArray(channel.writeTokenHashes)) return false;
  const token = extractBearer(req);
  if (!token) return false;
  const hash = await sha256Hex(token);
  return channel.writeTokenHashes.some((h) => timingSafeEqualStr(h, hash));
}

async function checkClaimRateLimit(store, ip) {
  const key = `rl:claim:${ip || 'unknown'}`;
  const now = Date.now();
  const windowMs = RATE_WINDOW_SEC * 1000;
  const rec = (await store.getJson(key)) || { hits: [] };
  const recent = Array.isArray(rec.hits) ? rec.hits.filter((t) => now - t < windowMs) : [];
  if (recent.length >= RATE_MAX_ATTEMPTS) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000));
    return { allowed: false, retryAfter };
  }
  recent.push(now);
  await store.putJson(key, { hits: recent }, RATE_WINDOW_SEC);
  return { allowed: true, retryAfter: 0 };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enqueueAndAwaitAck(store, channelId, { action, payload = {}, assistant = 'voice', waitAckMs = 2500 }) {
  const commandId = `cmd_${randomHex(10)}`;
  const queueKey = `queue:${channelId}`;
  const existing = (await store.getJson(queueKey)) || [];
  const cmd = {
    id: commandId,
    action: String(action || '').trim(),
    payload: payload && typeof payload === 'object' ? payload : {},
    assistant,
    timestamp: Date.now()
  };
  const nextQueue = [...existing.slice(-24), cmd];
  await store.putJson(queueKey, nextQueue, COMMAND_TTL_SEC);

  const clampedWait = Math.max(0, Math.min(3500, Number(waitAckMs) || 0));
  const deadline = Date.now() + clampedWait;
  while (Date.now() < deadline) {
    const ack = await store.getJson(`ack:${commandId}`);
    if (ack) {
      await store.del(`ack:${commandId}`);
      return { ok: true, commandId, delivered: true, ack };
    }
    await sleep(140);
  }
  return { ok: true, commandId, delivered: false, ack: null };
}

async function resolveGoogleChannel(store, req, body) {
  const bearer = extractBearer(req);
  if (bearer) {
    const tokenHash = await sha256Hex(bearer);
    const link = await store.getJson(`gtok:${tokenHash}`);
    if (link && link.channelId) return link;
  }
  const cid = String(body?.channelId || '').trim();
  if (cid && bearer) {
    const ch = await store.getJson(`ch:${cid}`);
    const ok = await verifyAssistantAuth(req, ch);
    if (ok) return { channelId: cid, userId: 'google-webhook' };
  }
  return null;
}

const GOOGLE_SCENE_DEVICES = [
  {
    id: 'omnigrid-clip',
    type: 'action.devices.types.SCENE',
    traits: ['action.devices.traits.Scene'],
    name: {
      defaultNames: ['OmniGrid Clip'],
      name: 'OmniGrid Clip',
      nicknames: ['OmniGrid Clip', 'Stream Clip', 'Clip speichern']
    },
    willReportState: false,
    attributes: { sceneReversible: false }
  },
  {
    id: 'omnigrid-hype',
    type: 'action.devices.types.SCENE',
    traits: ['action.devices.traits.Scene'],
    name: {
      defaultNames: ['OmniGrid Hype'],
      name: 'OmniGrid Hype',
      nicknames: ['OmniGrid Hype', 'Hype Detektor', 'Hype auslösen']
    },
    willReportState: false,
    attributes: { sceneReversible: false }
  },
  {
    id: 'omnigrid-multistream',
    type: 'action.devices.types.SCENE',
    traits: ['action.devices.traits.Scene'],
    name: {
      defaultNames: ['OmniGrid Multi-Stream'],
      name: 'OmniGrid Multi-Stream',
      nicknames: ['OmniGrid Multi-Stream', 'Multi Stream', 'Livestream']
    },
    willReportState: false,
    attributes: { sceneReversible: true }
  },
  {
    id: 'omnigrid-mute',
    type: 'action.devices.types.SCENE',
    traits: ['action.devices.traits.Scene'],
    name: {
      defaultNames: ['OmniGrid Mikrofon'],
      name: 'OmniGrid Mikrofon',
      nicknames: ['OmniGrid Mikrofon', 'Mikrofon umschalten', 'Stream Mute']
    },
    willReportState: false,
    attributes: { sceneReversible: true }
  }
];

function mapGoogleSceneToAction(deviceId, deactivate) {
  if (deviceId === 'omnigrid-clip') return 'clip';
  if (deviceId === 'omnigrid-hype') return 'hype';
  if (deviceId === 'omnigrid-multistream') return deactivate ? 'multistream_stop' : 'multistream_start';
  if (deviceId === 'omnigrid-mute') return 'mute_toggle';
  return '';
}

async function handleGoogleHome(req, store) {
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  if (Array.isArray(body.inputs) && body.inputs.length > 0) {
    const requestId = String(body.requestId || randomHex(8));
    const input = body.inputs[0];
    const intent = input.intent;
    const link = await resolveGoogleChannel(store, req, body);
    if (!link) {
      return jsonResponse({ requestId, payload: { errorCode: 'authFailure' } }, 401);
    }

    if (intent === 'action.devices.SYNC') {
      return jsonResponse({
        requestId,
        payload: {
          agentUserId: link.userId || link.channelId,
          devices: GOOGLE_SCENE_DEVICES
        }
      });
    }

    if (intent === 'action.devices.QUERY') {
      const devices = {};
      for (const dev of input.payload?.devices || []) {
        devices[dev.id] = { online: true, status: 'SUCCESS' };
      }
      return jsonResponse({ requestId, payload: { devices } });
    }

    if (intent === 'action.devices.DISCONNECT') {
      const ch = await store.getJson(`ch:${link.channelId}`);
      if (ch) {
        ch.assistants = (ch.assistants || []).filter((a) => a !== 'google_home');
        await store.putJson(`ch:${link.channelId}`, ch);
      }
      return jsonResponse({});
    }

    if (intent === 'action.devices.EXECUTE') {
      const commandsOut = [];
      for (const cmdGroup of input.payload?.commands || []) {
        const ids = (cmdGroup.devices || []).map((d) => d.id);
        const exec = (cmdGroup.execution || [])[0] || {};
        const deactivate = Boolean(exec.params?.deactivate);
        for (const devId of ids) {
          const action = mapGoogleSceneToAction(devId, deactivate);
          if (!action) {
            commandsOut.push({ ids: [devId], status: 'ERROR', errorCode: 'functionNotSupported' });
            continue;
          }
          const res = await enqueueAndAwaitAck(store, link.channelId, {
            action,
            payload: { source: 'google_home', deactivate },
            assistant: 'google_home',
            waitAckMs: 2500
          });
          commandsOut.push(
            res.delivered && res.ack?.ok === false
              ? { ids: [devId], status: 'ERROR', errorCode: 'deviceTurnedOff' }
              : { ids: [devId], status: 'SUCCESS', states: { online: true } }
          );
        }
      }
      return jsonResponse({ requestId, payload: { commands: commandsOut } });
    }

    return jsonResponse({ requestId, payload: { errorCode: 'notSupported' } }, 400);
  }

  const link = await resolveGoogleChannel(store, req, body);
  if (!link) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  const action = String(body.action || '').trim();
  if (!action) return jsonResponse({ ok: false, error: 'Missing action' }, 400);
  const res = await enqueueAndAwaitAck(store, link.channelId, {
    action,
    payload: body.payload || {},
    assistant: 'google_home',
    waitAckMs: body.waitAckMs ?? 2500
  });
  return jsonResponse(res);
}

async function handleRequest(req, env = {}) {
  if (req.method === 'OPTIONS') return jsonResponse({ ok: true }, 204);

  const url = new URL(req.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const store = createStore(env);

  if (req.method === 'GET' && pathname === '/health') {
    return jsonResponse({ ok: true, service: 'omnigrid-voice-relay', timestamp: Date.now() });
  }

  if (req.method === 'POST' && pathname === '/api/google-home') {
    return handleGoogleHome(req, store);
  }

  if (req.method === 'POST' && pathname === '/pair/register') {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
    }
    const pairingCode = normalizePairingCode(body.pairingCode);
    const channelId = String(body.channelId || '').trim();
    const deviceSecret = String(body.deviceSecret || '').trim();
    if (pairingCode.length < 6 || !channelId || deviceSecret.length < 16) {
      return jsonResponse({ ok: false, error: 'Invalid pairing registration payload' }, 400);
    }
    const ttlSec = Math.max(60, Math.min(900, Number(body.ttlSec) || PAIRING_TTL_SEC));
    const deviceSecretHash = await sha256Hex(deviceSecret);
    const existingCh = await store.getJson(`ch:${channelId}`);
    if (existingCh && !timingSafeEqualStr(existingCh.deviceSecretHash, deviceSecretHash)) {
      return jsonResponse({ ok: false, error: 'Channel secret mismatch' }, 403);
    }

    const nextChannel = {
      channelId,
      deviceSecretHash,
      deviceSecret,
      writeTokenHashes: existingCh?.writeTokenHashes || [],
      assistants: existingCh?.assistants || [],
      updatedAt: Date.now()
    };
    await store.putJson(`ch:${channelId}`, nextChannel);
    await store.putJson(`pair:${pairingCode}`, { channelId, expiresAt: Date.now() + ttlSec * 1000 }, ttlSec);

    return jsonResponse({ ok: true, pairingCode, channelId, expiresInSec: ttlSec });
  }

  if (req.method === 'POST' && pathname === '/pair/claim') {
    const clientIp = req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For') || 'local';
    const rl = await checkClaimRateLimit(store, clientIp);
    if (!rl.allowed) {
      return jsonResponse(
        { ok: false, error: 'Too many pairing attempts. Please try again later.' },
        429,
        { 'Retry-After': String(rl.retryAfter) }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
    }
    const pairingCode = normalizePairingCode(body.pairingCode);
    const assistant = body.assistant === 'google_home' ? 'google_home' : 'alexa';
    const userId = String(body.userId || '').trim().slice(0, 128);
    if (pairingCode.length < 6) {
      return jsonResponse({ ok: false, error: 'Invalid pairing code format' }, 400);
    }

    const pairRec = await store.getJson(`pair:${pairingCode}`);
    if (!pairRec || !pairRec.channelId || (pairRec.expiresAt && pairRec.expiresAt < Date.now())) {
      return jsonResponse({ ok: false, error: 'Pairing code invalid or expired' }, 404);
    }

    await store.del(`pair:${pairingCode}`);

    const ch = await store.getJson(`ch:${pairRec.channelId}`);
    if (!ch) return jsonResponse({ ok: false, error: 'Target channel not found' }, 404);

    const writeToken = `wt_${randomHex(24)}`;
    const writeTokenHash = await sha256Hex(writeToken);
    ch.writeTokenHashes = [...new Set([...(ch.writeTokenHashes || []).slice(-7), writeTokenHash])];
    ch.assistants = [...new Set([...(ch.assistants || []), assistant])];
    ch.updatedAt = Date.now();
    await store.putJson(`ch:${pairRec.channelId}`, ch);

    if (assistant === 'google_home') {
      await store.putJson(`gtok:${writeTokenHash}`, { channelId: pairRec.channelId, userId: userId || 'google-user' });
    }

    return jsonResponse({
      ok: true,
      channelId: pairRec.channelId,
      writeToken,
      assistant
    });
  }

  if (req.method === 'POST' && pathname === '/pair/revoke') {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
    }
    const channelId = String(body.channelId || '').trim();
    const ch = channelId ? await store.getJson(`ch:${channelId}`) : null;
    if (!ch) return jsonResponse({ ok: true, revoked: false });
    const authed = await verifyDesktopAuth(req, ch, pathname);
    if (!authed) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);

    await store.del(`ch:${channelId}`);
    await store.del(`queue:${channelId}`);
    return jsonResponse({ ok: true, revoked: true });
  }

  const cmdMatch = pathname.match(/^\/command\/([A-Za-z0-9_-]{8,96})$/);
  if (req.method === 'POST' && cmdMatch) {
    const channelId = cmdMatch[1];
    const ch = await store.getJson(`ch:${channelId}`);
    if (!ch) return jsonResponse({ ok: false, error: 'Channel not found' }, 404);
    const authed = await verifyAssistantAuth(req, ch);
    if (!authed) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
    }
    const action = String(body.action || '').trim();
    if (!action) return jsonResponse({ ok: false, error: 'Missing action' }, 400);

    const res = await enqueueAndAwaitAck(store, channelId, {
      action,
      payload: body.payload || {},
      assistant: body.assistant || 'alexa',
      waitAckMs: body.waitAckMs !== undefined ? body.waitAckMs : 2500
    });
    return jsonResponse(res);
  }

  const pollMatch = pathname.match(/^\/poll\/([A-Za-z0-9_-]{8,96})$/);
  if (req.method === 'GET' && pollMatch) {
    const channelId = pollMatch[1];
    const ch = await store.getJson(`ch:${channelId}`);
    if (!ch) return jsonResponse({ ok: false, error: 'Channel not found' }, 404);
    const authed = await verifyDesktopAuth(req, ch, pathname);
    if (!authed) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);

    const waitMs = Math.max(0, Math.min(15000, Number(url.searchParams.get('waitMs') || '0')));
    const deadline = Date.now() + waitMs;
    const queueKey = `queue:${channelId}`;

    let commands = (await store.getJson(queueKey)) || [];
    while (commands.length === 0 && Date.now() < deadline) {
      await sleep(300);
      commands = (await store.getJson(queueKey)) || [];
    }
    if (commands.length > 0) {
      await store.del(queueKey);
    }

    const latestCh = (await store.getJson(`ch:${channelId}`)) || ch;
    return jsonResponse({
      ok: true,
      commands,
      assistants: latestCh.assistants || [],
      serverTime: Date.now()
    });
  }

  const ackMatch = pathname.match(/^\/ack\/([A-Za-z0-9_-]{6,96})$/);
  if (req.method === 'POST' && ackMatch) {
    const commandId = ackMatch[1];
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
    }
    const channelId = String(body.channelId || '').trim();
    const ch = channelId ? await store.getJson(`ch:${channelId}`) : null;
    if (!ch) return jsonResponse({ ok: false, error: 'Channel not found' }, 404);
    const authed = await verifyDesktopAuth(req, ch, pathname);
    if (!authed) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);

    await store.putJson(
      `ack:${commandId}`,
      {
        ok: body.ok !== false,
        message: String(body.message || ''),
        result: body.result || null,
        timestamp: Date.now()
      },
      ACK_TTL_SEC
    );
    return jsonResponse({ ok: true, commandId });
  }

  return jsonResponse({ ok: false, error: 'Not found' }, 404);
}

export default {
  fetch: handleRequest
};

export { handleRequest, createStore, normalizePairingCode };
