const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const fs = require('fs');

function resolveFfmpegBinary() {
  const candidates = [
    '/opt/homebrew/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
    '/usr/bin/ffmpeg',
    'C:\\ffmpeg\\bin\\ffmpeg.exe'
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c;
    } catch (e) {}
  }
  return 'ffmpeg';
}

function normalizeRelayConfig(raw = {}) {
  const t = raw.targets || {};
  return {
    port: Math.max(1024, Math.min(65535, parseInt(raw.port || '1935', 10) || 1935)),
    streamKey: String(raw.streamKey || 'omnigrid').trim() || 'omnigrid',
    autoConfigureObs: raw.autoConfigureObs !== false,
    autoStartObsStream: raw.autoStartObsStream !== false,
    targets: {
      twitch: {
        enabled: Boolean(t.twitch?.enabled ?? true),
        serverUrl: String(t.twitch?.serverUrl || 'rtmp://fra02.contribute.live-video.net/app').trim(),
        streamKey: String(t.twitch?.streamKey || '').trim()
      },
      youtube: {
        enabled: Boolean(t.youtube?.enabled ?? false),
        serverUrl: String(t.youtube?.serverUrl || 'rtmp://a.rtmp.youtube.com/live2').trim(),
        streamKey: String(t.youtube?.streamKey || '').trim(),
        privacyStatus: ['public', 'unlisted', 'private'].includes(t.youtube?.privacyStatus)
          ? t.youtube.privacyStatus
          : 'public'
      },
      tiktok: {
        enabled: Boolean(t.tiktok?.enabled ?? false),
        serverUrl: String(t.tiktok?.serverUrl || '').trim(),
        streamKey: String(t.tiktok?.streamKey || '').trim()
      },
      custom: {
        enabled: Boolean(t.custom?.enabled ?? false),
        name: String(t.custom?.name || 'Kick / Custom').trim(),
        serverUrl: String(t.custom?.serverUrl || '').trim(),
        streamKey: String(t.custom?.streamKey || '').trim()
      }
    }
  };
}

function inspectRelayDestinations(cfg) {
  const norm = normalizeRelayConfig(cfg);
  const defs = [
    { id: 'twitch', label: 'Twitch', ...norm.targets.twitch },
    { id: 'youtube', label: 'YouTube', ...norm.targets.youtube },
    { id: 'tiktok', label: 'TikTok', ...norm.targets.tiktok },
    { id: 'custom', label: norm.targets.custom.name || 'Custom', ...norm.targets.custom }
  ];
  const active = [];
  const skipped = [];
  for (const d of defs) {
    if (!d.enabled) continue;
    const base = String(d.serverUrl || '').trim().replace(/\/+$/, '');
    const key = String(d.streamKey || '').trim().replace(/^\/+/, '');
    if (!base || !key) {
      skipped.push({
        id: d.id,
        label: d.label,
        reason: !key ? `${d.label}: Stream-Schlüssel fehlt` : `${d.label}: Server-URL fehlt`
      });
      continue;
    }
    active.push({
      id: d.id,
      label: d.label,
      url: `${base}/${key}`
    });
  }
  return { active, skipped };
}

function buildActiveDestinations(cfg) {
  return inspectRelayDestinations(cfg).active;
}

function escapeTeeUrl(url) {
  return String(url || '').replace(/([:\\[\]|])/g, '\\$1');
}

class MultiStreamRelay extends EventEmitter {
  constructor() {
    super();
    this.proc = null;
    this.shouldRun = false;
    this.restartTimer = null;
    this.currentConfig = normalizeRelayConfig({});
    this.state = {
      active: false,
      status: 'stopped', // 'stopped' | 'waiting' | 'streaming' | 'error'
      ingestServer: 'rtmp://127.0.0.1:1935/live',
      ingestKey: 'omnigrid',
      activeTargets: [],
      skippedTargets: [],
      warnings: [],
      youtubeWatchUrl: '',
      fps: 0,
      bitrateKbps: 0,
      uptime: '00:00:00',
      error: ''
    };
  }

  getState() {
    return { ...this.state };
  }

  _emitState(patch = {}) {
    this.state = { ...this.state, ...patch };
    this.emit('state', this.getState());
    return this.getState();
  }

  start(rawCfg = {}, extraMeta = {}) {
    this.currentConfig = normalizeRelayConfig(rawCfg);
    const { active: dests, skipped } = inspectRelayDestinations(this.currentConfig);
    const ingestServer = `rtmp://127.0.0.1:${this.currentConfig.port}/live`;
    const ingestKey = this.currentConfig.streamKey;
    const initWarnings = [
      ...skipped.map((s) => `⚠️ ${s.reason} (wurde übersprungen)`),
      ...(Array.isArray(extraMeta.warnings) ? extraMeta.warnings : [])
    ];

    if (!dests.length) {
      return {
        ok: false,
        error: skipped.length
          ? `Ziel-Konfiguration unvollständig: ${skipped.map((s) => s.reason).join(' • ')}`
          : 'Bitte mindestens eine Ziel-Plattform (Twitch, YouTube, TikTok oder Custom) aktivieren und deren Stream-Key eintragen.',
        state: this._emitState({
          active: false,
          status: 'error',
          ingestServer,
          ingestKey,
          activeTargets: [],
          skippedTargets: skipped.map((s) => s.label),
          warnings: initWarnings,
          youtubeWatchUrl: '',
          error: 'Keine Ziel-Plattform mit Stream-Key bereit.'
        })
      };
    }

    this.stop(false);
    this.shouldRun = true;
    this._spawnFfmpeg(dests, ingestServer, ingestKey, {
      skippedTargets: skipped.map((s) => s.label),
      warnings: initWarnings,
      youtubeWatchUrl: String(extraMeta.youtubeWatchUrl || '')
    });
    return { ok: true, state: this.getState() };
  }

  _spawnFfmpeg(dests, ingestServer, ingestKey, meta = {}) {
    if (!this.shouldRun) return;
    const ffmpegBin = resolveFfmpegBinary();
    const listenUrl = `${ingestServer}/${ingestKey}`;

    const args = [
      '-hide_banner',
      '-loglevel',
      'info',
      '-listen',
      '1',
      '-i',
      listenUrl
    ];

    if (dests.length === 1) {
      args.push(
        '-map', '0:v',
        '-map', '0:a?',
        '-c', 'copy',
        '-flags', '+global_header',
        '-flvflags', 'no_duration_filesize',
        '-f', 'flv',
        dests[0].url
      );
    } else {
      const teeSpec = dests
        .map((d) => `[f=flv:flvflags=no_duration_filesize:onfail=ignore]${escapeTeeUrl(d.url)}`)
        .join('|');
      args.push('-map', '0:v', '-map', '0:a?', '-c', 'copy', '-flags', '+global_header', '-f', 'tee', teeSpec);
    }

    const runtimeWarnings = [...(meta.warnings || [])];
    this._emitState({
      active: true,
      status: 'waiting',
      ingestServer,
      ingestKey,
      activeTargets: dests.map((d) => d.label),
      skippedTargets: meta.skippedTargets || [],
      warnings: runtimeWarnings,
      youtubeWatchUrl: meta.youtubeWatchUrl || '',
      fps: 0,
      bitrateKbps: 0,
      uptime: '00:00:00',
      error: ''
    });

    try {
      const proc = spawn(ffmpegBin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      this.proc = proc;

      let lastErrLine = '';
      proc.stderr.on('data', (chunk) => {
        const text = String(chunk || '');
        const lines = text.split(/[\r\n]+/).filter(Boolean);
        for (const line of lines) {
          if (/frame=\s*\d+/i.test(line)) {
            const fpsMatch = line.match(/fps=\s*([\d.]+)/i);
            const brMatch = line.match(/bitrate=\s*([\d.]+)kbits\/s/i);
            const timeMatch = line.match(/time=(\d{2}:\d{2}:\d{2})/i);
            this._emitState({
              status: 'streaming',
              fps: fpsMatch ? Math.round(parseFloat(fpsMatch[1])) : this.state.fps,
              bitrateKbps: brMatch ? Math.round(parseFloat(brMatch[1])) : this.state.bitrateKbps,
              uptime: timeMatch ? timeMatch[1] : this.state.uptime,
              error: ''
            });
          } else if (/Input #0,\s*flv/i.test(line)) {
            this._emitState({ status: 'streaming', error: '' });
          } else if (/Slave\s+.*error/i.test(line)) {
            const matchedDest = dests.find((d) => {
              const hostPart = String(d.url || '').split('/')[2] || '';
              return hostPart && line.includes(hostPart);
            });
            const warnMsg = matchedDest
              ? `⚠️ ${matchedDest.label}: RTMP-Verbindung fehlgeschlagen (Stream-Key oder Server prüfen!)`
              : `⚠️ Ziel-Fehler: ${line.slice(0, 120)}`;
            if (!runtimeWarnings.includes(warnMsg)) {
              runtimeWarnings.push(warnMsg);
              this._emitState({ warnings: [...runtimeWarnings] });
            }
          } else if (/error|failed|Address already in use|Connection refused/i.test(line)) {
            lastErrLine = line.slice(0, 180);
          }
        }
      });

      proc.on('error', (err) => {
        this._emitState({
          active: false,
          status: 'error',
          error: `FFmpeg konnte nicht gestartet werden: ${err.message}`
        });
        this.shouldRun = false;
      });

      proc.on('close', (code) => {
        if (this.proc === proc) this.proc = null;
        if (!this.shouldRun) {
          this._emitState({
            active: false,
            status: 'stopped',
            fps: 0,
            bitrateKbps: 0,
            uptime: '00:00:00'
          });
          return;
        }
        // If port is already in use, stop and report error
        if (/Address already in use/i.test(lastErrLine)) {
          this.shouldRun = false;
          this._emitState({
            active: false,
            status: 'error',
            error: `RTMP-Port ${this.currentConfig.port} ist bereits belegt.`
          });
          return;
        }
        // Otherwise OBS disconnected or stream ended — re-arm listener for next OBS connection
        this._emitState({
          status: 'waiting',
          fps: 0,
          bitrateKbps: 0,
          uptime: '00:00:00',
          error: code && lastErrLine ? lastErrLine : ''
        });
        this.restartTimer = setTimeout(() => {
          this._spawnFfmpeg(dests, ingestServer, ingestKey, meta);
        }, 1000);
      });
    } catch (err) {
      this.shouldRun = false;
      this._emitState({
        active: false,
        status: 'error',
        error: err.message
      });
    }
  }

  stop(emit = true) {
    this.shouldRun = false;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.proc) {
      const p = this.proc;
      this.proc = null;
      try {
        p.kill('SIGTERM');
        setTimeout(() => {
          try { p.kill('SIGKILL'); } catch (e) {}
        }, 1200);
      } catch (e) {}
    }
    if (emit) {
      this._emitState({
        active: false,
        status: 'stopped',
        fps: 0,
        bitrateKbps: 0,
        uptime: '00:00:00',
        error: ''
      });
    }
    return { ok: true, state: this.getState() };
  }
}

module.exports = {
  MultiStreamRelay,
  normalizeRelayConfig,
  buildActiveDestinations,
  inspectRelayDestinations
};
