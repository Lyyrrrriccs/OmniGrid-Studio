const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { EventEmitter } = require('events');

function sanitizeRelayUrl(raw) {
  const s = String(raw || '').trim().replace(/\/+$/, '');
  if (!s) return '';
  try {
    const u = new URL(s);
    const okProto = u.protocol === 'https:' || (u.protocol === 'http:' && (u.hostname === '127.0.0.1' || u.hostname === 'localhost'));
    return okProto ? u.origin + u.pathname.replace(/\/+$/, '') : '';
  } catch (e) {
    return '';
  }
}

function normalizeVoiceConfig(raw = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    enabled: Boolean(src.enabled),
    relayUrl: sanitizeRelayUrl(src.relayUrl),
    channelId: String(src.channelId || '').trim(),
    deviceSecret: String(src.deviceSecret || '').trim(),
    assistants: Array.isArray(src.assistants) ? [...new Set(src.assistants.map(String).filter(Boolean))] : []
  };
}

function generateSixDigitCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function formatPairingCode(code) {
  const clean = String(code || '').replace(/[^A-Z0-9]/gi, '');
  return clean.length === 6 ? `${clean.slice(0, 3)}-${clean.slice(3)}` : clean;
}

class VoiceControlBridge extends EventEmitter {
  constructor({ onCommand } = {}) {
    super();
    this.onCommand = typeof onCommand === 'function' ? onCommand : async () => ({ ok: false, error: 'No handler' });
    this.config = normalizeVoiceConfig({});
    this.running = false;
    this.pollAbort = null;
    this.reconnectTimer = null;
    this.backoffMs = 2000;
    this.state = {
      connected: false,
      status: 'disconnected',
      relayUrl: '',
      channelId: '',
      pairingCode: '',
      pairingCodeFormatted: '',
      pairingExpiresAt: 0,
      assistants: [],
      lastCommand: null,
      error: ''
    };
  }

  getState() {
    return {
      ...this.state,
      assistants: [...this.state.assistants]
    };
  }

  _emitState(patch = {}) {
    this.state = { ...this.state, ...patch };
    const snap = this.getState();
    this.emit('state', snap);
    return snap;
  }

  setConfig(rawCfg = {}) {
    this.config = normalizeVoiceConfig(rawCfg);
    this._emitState({
      relayUrl: this.config.relayUrl,
      channelId: this.config.channelId,
      assistants: this.config.assistants
    });
    return this.config;
  }

  _signHeaders(method, pathname, deviceSecret) {
    const ts = String(Date.now());
    const sig = crypto
      .createHmac('sha256', deviceSecret)
      .update(`${ts}:${method}:${pathname}`)
      .digest('hex');
    return {
      Authorization: `Bearer ${deviceSecret}`,
      'X-OmniGrid-Timestamp': ts,
      'X-OmniGrid-Signature': sig
    };
  }

  _requestJson(targetUrl, { method = 'GET', headers = {}, body = null, timeoutMs = 18000 } = {}) {
    return new Promise((resolve, reject) => {
      const parsed = new URL(targetUrl);
      const transport = parsed.protocol === 'https:' ? https : http;
      const payload = body !== null ? Buffer.from(JSON.stringify(body), 'utf8') : null;
      const reqHeaders = {
        Accept: 'application/json',
        ...headers,
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': payload.length } : {})
      };

      const req = transport.request(
        {
          hostname: parsed.hostname,
          port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
          path: parsed.pathname + parsed.search,
          method,
          timeout: timeoutMs,
          headers: reqHeaders
        },
        (res) => {
          let raw = '';
          res.on('data', (chunk) => {
            raw += chunk;
            if (raw.length > 262144) raw = raw.slice(0, 262144);
          });
          res.on('end', () => {
            let json = null;
            try {
              json = raw ? JSON.parse(raw) : {};
            } catch (e) {}
            resolve({ statusCode: res.statusCode || 0, json, raw });
          });
        }
      );

      req.on('error', reject);
      req.on('timeout', () => req.destroy(new Error('Relay Timeout')));
      if (payload) req.write(payload);
      req.end();
    });
  }

  async generatePairingCode({ relayUrl = '', ttlSec = 600 } = {}) {
    const nextRelay = relayUrl ? sanitizeRelayUrl(relayUrl) : this.config.relayUrl;
    const channelId = this.config.channelId || `ch_${crypto.randomBytes(12).toString('hex')}`;
    const deviceSecret = this.config.deviceSecret || `ds_${crypto.randomBytes(24).toString('hex')}`;
    const pairingCode = generateSixDigitCode();
    const pairingCodeFormatted = formatPairingCode(pairingCode);
    const pairingExpiresAt = Date.now() + ttlSec * 1000;

    this.config = normalizeVoiceConfig({
      ...this.config,
      enabled: true,
      relayUrl: nextRelay,
      channelId,
      deviceSecret
    });

    let registeredWithRelay = false;
    let relayError = '';
    if (nextRelay) {
      try {
        const regUrl = `${nextRelay}/pair/register`;
        const resp = await this._requestJson(regUrl, {
          method: 'POST',
          timeoutMs: 8000,
          body: { pairingCode, channelId, deviceSecret, ttlSec }
        });
        registeredWithRelay = resp.statusCode >= 200 && resp.statusCode < 300 && Boolean(resp.json?.ok);
        relayError = registeredWithRelay ? '' : (resp.json?.error || `HTTP ${resp.statusCode}`);
      } catch (err) {
        relayError = err.message;
      }
    }

    this._emitState({
      relayUrl: nextRelay,
      channelId,
      pairingCode,
      pairingCodeFormatted,
      pairingExpiresAt,
      status: nextRelay ? (registeredWithRelay ? 'connected' : 'error') : 'local-only',
      connected: registeredWithRelay,
      error: relayError
    });

    if (nextRelay && registeredWithRelay) {
      this.start();
    }

    return {
      ok: true,
      pairingCode,
      pairingCodeFormatted,
      pairingExpiresAt,
      registeredWithRelay,
      error: relayError,
      config: this.config,
      state: this.getState()
    };
  }

  start() {
    if (!this.config.relayUrl || !this.config.channelId || !this.config.deviceSecret) {
      this._emitState({ connected: false, status: this.config.relayUrl ? 'disconnected' : 'local-only' });
      return false;
    }
    if (this.running) return true;
    this.running = true;
    this.backoffMs = 2000;
    this._schedulePoll(50);
    return true;
  }

  stop() {
    this.running = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this._emitState({ connected: false, status: 'disconnected' });
  }

  async disconnectAndReset() {
    const prevRelay = this.config.relayUrl;
    const prevChannel = this.config.channelId;
    const prevSecret = this.config.deviceSecret;
    this.stop();

    if (prevRelay && prevChannel && prevSecret) {
      try {
        const pathname = '/pair/revoke';
        await this._requestJson(`${prevRelay}${pathname}`, {
          method: 'POST',
          timeoutMs: 4000,
          headers: this._signHeaders('POST', pathname, prevSecret),
          body: { channelId: prevChannel }
        });
      } catch (e) {}
    }

    this.config = normalizeVoiceConfig({
      enabled: false,
      relayUrl: prevRelay,
      channelId: '',
      deviceSecret: '',
      assistants: []
    });

    this._emitState({
      connected: false,
      status: 'disconnected',
      channelId: '',
      pairingCode: '',
      pairingCodeFormatted: '',
      pairingExpiresAt: 0,
      assistants: [],
      error: ''
    });

    return { ok: true, config: this.config, state: this.getState() };
  }

  _schedulePoll(delayMs) {
    if (!this.running) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this._pollOnce(), delayMs);
  }

  async _pollOnce() {
    if (!this.running || !this.config.relayUrl || !this.config.channelId || !this.config.deviceSecret) return;
    const pathname = `/poll/${encodeURIComponent(this.config.channelId)}`;
    const pollUrl = `${this.config.relayUrl}${pathname}?waitMs=12000`;

    try {
      const resp = await this._requestJson(pollUrl, {
        method: 'GET',
        timeoutMs: 18000,
        headers: this._signHeaders('GET', pathname, this.config.deviceSecret)
      });

      if (resp.statusCode >= 200 && resp.statusCode < 300 && resp.json?.ok) {
        this.backoffMs = 2000;
        const assistants = Array.isArray(resp.json.assistants) ? resp.json.assistants : this.state.assistants;
        const assistantsChanged = JSON.stringify(assistants) !== JSON.stringify(this.config.assistants);
        if (assistantsChanged) {
          this.config.assistants = assistants;
          this.emit('config-updated', this.config);
        }
        const pairingExpired = this.state.pairingExpiresAt && Date.now() > this.state.pairingExpiresAt;
        this._emitState({
          connected: true,
          status: 'connected',
          assistants,
          error: '',
          ...(pairingExpired ? { pairingCode: '', pairingCodeFormatted: '', pairingExpiresAt: 0 } : {})
        });

        const commands = Array.isArray(resp.json.commands) ? resp.json.commands : [];
        for (const cmd of commands) {
          await this._handleIncomingCommand(cmd);
        }
        this._schedulePoll(120);
        return;
      }

      const errMsg = resp.json?.error || `Relay HTTP ${resp.statusCode}`;
      this._emitState({ connected: false, status: 'error', error: errMsg });
    } catch (err) {
      this._emitState({ connected: false, status: 'reconnecting', error: err.message });
    }

    this.backoffMs = Math.min(15000, Math.round(this.backoffMs * 1.6));
    this._schedulePoll(this.backoffMs);
  }

  async _handleIncomingCommand(cmd) {
    const action = String(cmd?.action || '').trim();
    const commandId = String(cmd?.id || '').trim();
    if (!action) return;

    const result = await this.executeLocalCommand(action, cmd.payload || {}, cmd.assistant || 'relay');
    if (commandId && this.config.relayUrl && this.config.channelId && this.config.deviceSecret) {
      const ackPath = `/ack/${encodeURIComponent(commandId)}`;
      await this._requestJson(`${this.config.relayUrl}${ackPath}`, {
        method: 'POST',
        timeoutMs: 4000,
        headers: this._signHeaders('POST', ackPath, this.config.deviceSecret),
        body: {
          channelId: this.config.channelId,
          ok: Boolean(result?.ok),
          message: String(result?.speech || result?.message || result?.error || ''),
          result
        }
      }).catch(() => {});
    }
  }

  async executeLocalCommand(action, payload = {}, source = 'local_test') {
    const cleanAction = String(action || '').trim().toLowerCase();
    try {
      const res = await this.onCommand(cleanAction, payload || {}, { source });
      const entry = {
        action: cleanAction,
        source,
        ok: Boolean(res?.ok),
        message: String(res?.speech || res?.message || res?.error || ''),
        timestamp: Date.now()
      };
      this._emitState({ lastCommand: entry });
      return res;
    } catch (err) {
      const entry = {
        action: cleanAction,
        source,
        ok: false,
        message: err.message,
        timestamp: Date.now()
      };
      this._emitState({ lastCommand: entry });
      return { ok: false, error: err.message };
    }
  }
}

module.exports = {
  VoiceControlBridge,
  normalizeVoiceConfig,
  generateSixDigitCode,
  formatPairingCode,
  sanitizeRelayUrl
};
