const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { app, shell } = require('electron');

const GITHUB_OWNER = 'Lyyrrrriccs';
const GITHUB_REPO = 'OmniGrid-Studio';

function extractVersionToken(raw) {
  const m = String(raw || '').match(/\bv?(\d{4}\.\d{1,2}\.\d{1,2}[-.]\d{3,4}|\d+\.\d+\.\d+(?:[-.][0-9A-Za-z.]+)?)\b/i);
  return m ? m[1] : '';
}

function parseVersionParts(ver) {
  const clean = String(ver || '').trim().replace(/^v/i, '');
  if (!clean) return [];
  return clean.split(/[.\-_:\s]+/).map((n) => parseInt(n, 10) || 0);
}

function isNewerVersion(remote, current) {
  const r = parseVersionParts(remote);
  const c = parseVersionParts(current);
  const len = Math.max(r.length, c.length, 3);
  for (let i = 0; i < len; i++) {
    const rv = r[i] || 0;
    const cv = c[i] || 0;
    if (rv > cv) return true;
    if (rv < cv) return false;
  }
  return false;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'OmniGrid-Studio-Updater',
          Accept: 'application/vnd.github+json'
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchJson(res.headers.location));
        }
        let body = '';
        res.on('data', (c) => { body += c; });
        res.on('end', () => {
          if (res.statusCode === 404) {
            return resolve({ notFound: true });
          }
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`GitHub API HTTP ${res.statusCode}`));
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(12000, () => req.destroy(new Error('GitHub Update-Check Timeout')));
  });
}

function downloadFile(url, destPath, onProgress, hops = 0) {
  if (hops > 8) return Promise.reject(new Error('Zu viele Weiterleitungen beim Download'));
  const partPath = `${destPath}.part`;
  return new Promise((resolve, reject) => {
    const reqHeaders = hops === 0
      ? { 'User-Agent': 'OmniGrid-Studio-Updater', Accept: 'application/octet-stream' }
      : { 'User-Agent': 'OmniGrid-Studio-Updater' };
    const req = https.get(url, { headers: reqHeaders }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(downloadFile(res.headers.location, destPath, onProgress, hops + 1));
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        return reject(new Error(`Download fehlgeschlagen (HTTP ${res.statusCode})`));
      }
      const totalBytes = parseInt(res.headers['content-length'] || '0', 10) || 0;
      let downloadedBytes = 0;
      let lastEmit = 0;
      const out = fs.createWriteStream(partPath);
      res.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const now = Date.now();
        if (onProgress && (now - lastEmit >= 250 || downloadedBytes === totalBytes)) {
          lastEmit = now;
          const percent = totalBytes > 0 ? Math.min(100, Math.round((downloadedBytes / totalBytes) * 100)) : 0;
          onProgress({ downloadedBytes, totalBytes, percent });
        }
      });
      res.pipe(out);
      out.on('finish', () => {
        out.close(() => {
          try {
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            fs.renameSync(partPath, destPath);
            resolve(destPath);
          } catch (e) {
            reject(e);
          }
        });
      });
      out.on('error', (err) => {
        try { fs.unlinkSync(partPath); } catch (e) {}
        reject(err);
      });
    });
    req.on('error', (err) => {
      try { fs.unlinkSync(partPath); } catch (e) {}
      reject(err);
    });
    req.setTimeout(120000, () => req.destroy(new Error('Download-Timeout (keine Daten seit 120s)')));
  });
}

function pickPlatformAsset(assets) {
  const list = Array.isArray(assets) ? assets : [];
  if (!list.length) return null;
  if (process.platform === 'darwin') {
    return (
      list.find((a) => /mac|darwin|osx/i.test(a.name) && /\.zip$/i.test(a.name)) ||
      list.find((a) => /mac|darwin|osx/i.test(a.name) && /\.dmg$/i.test(a.name)) ||
      list.find((a) => /\.zip$/i.test(a.name)) ||
      list.find((a) => /\.dmg$/i.test(a.name)) ||
      null
    );
  }
  if (process.platform === 'win32') {
    return (
      list.find((a) => /win/i.test(a.name) && /\.exe$/i.test(a.name)) ||
      list.find((a) => /win/i.test(a.name) && /\.zip$/i.test(a.name)) ||
      list.find((a) => /\.exe$/i.test(a.name)) ||
      list.find((a) => /\.zip$/i.test(a.name)) ||
      null
    );
  }
  return list[0] || null;
}

class GitHubAutoUpdater {
  constructor(onState) {
    this.onState = typeof onState === 'function' ? onState : () => {};
    this.state = {
      status: 'idle',
      currentVersion: app.getVersion(),
      latestVersion: '',
      releaseUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
      releaseNotes: '',
      assetName: '',
      filePath: '',
      percent: 0,
      error: ''
    };
    this._checking = false;
  }

  emit(patch = {}) {
    this.state = { ...this.state, ...patch };
    this.onState({ ...this.state });
    return { ...this.state };
  }

  getState() {
    return { ...this.state };
  }

  getLocalBuildTimestamp() {
    try {
      const markerPath = path.join(app.getPath('userData'), 'updates', 'last_installed.json');
      if (fs.existsSync(markerPath)) {
        const data = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
        if (data?.assetUpdatedAt) {
          const ts = Date.parse(data.assetUpdatedAt);
          if (!Number.isNaN(ts)) return ts;
        }
      }
    } catch (e) {}
    try {
      const pkgPath = path.join(__dirname, '..', 'package.json');
      const st = fs.statSync(pkgPath);
      return st.mtimeMs || 0;
    } catch (e) {
      return 0;
    }
  }

  async checkForUpdates({ autoDownload = true, forceDownload = false } = {}) {
    if (this._checking) return this.getState();
    this._checking = true;
    const currentVersion = app.getVersion();
    this.emit({ status: 'checking', currentVersion, error: '', percent: 0 });

    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
      let rel = await fetchJson(apiUrl);
      if (rel?.notFound) {
        const list = await fetchJson(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases?per_page=1`);
        rel = Array.isArray(list) && list[0] ? list[0] : { notFound: true };
      }
      if (rel?.notFound) {
        return this.emit({ status: 'up-to-date', latestVersion: currentVersion, error: '' });
      }
      const rawTag = String(rel.tag_name || '');
      const rawName = String(rel.name || '');
      const detectedVer = extractVersionToken(rawTag) || extractVersionToken(rawName);
      const releaseUrl = rel.html_url || this.state.releaseUrl;
      const releaseNotes = String(rel.body || '').slice(0, 600);
      const asset = pickPlatformAsset(rel.assets);

      let hasUpdate = Boolean(forceDownload);
      let latestVersionLabel = detectedVer || currentVersion;

      if (!hasUpdate && detectedVer) {
        hasUpdate = isNewerVersion(detectedVer, currentVersion);
      } else if (!hasUpdate && asset && (asset.updated_at || rel.published_at)) {
        const remoteTs = Date.parse(asset.updated_at || rel.published_at);
        const localTs = this.getLocalBuildTimestamp();
        if (!Number.isNaN(remoteTs) && remoteTs > localTs + 120 * 1000) {
          hasUpdate = true;
          const dtf = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          const p = {};
          for (const part of dtf.formatToParts(new Date(remoteTs))) {
            if (part.type !== 'literal') p[part.type] = part.value;
          }
          latestVersionLabel = `${p.year}.${p.month}.${p.day}-${p.hour === '24' ? '00' : p.hour}${p.minute}`;
        }
      }

      if (!hasUpdate) {
        return this.emit({ status: 'up-to-date', latestVersion: latestVersionLabel, releaseUrl, error: '' });
      }

      if (!asset || !autoDownload) {
        return this.emit({
          status: 'available',
          latestVersion: latestVersionLabel,
          releaseUrl,
          releaseNotes,
          assetName: asset ? asset.name : '',
          error: ''
        });
      }

      const updatesDir = path.join(app.getPath('userData'), 'updates');
      fs.mkdirSync(updatesDir, { recursive: true });
      const destPath = path.join(updatesDir, asset.name);
      this._latestAssetUpdatedAt = asset.updated_at || rel.published_at || new Date().toISOString();

      this.emit({
        status: 'downloading',
        latestVersion: latestVersionLabel,
        releaseUrl,
        releaseNotes,
        assetName: asset.name,
        percent: 0,
        error: ''
      });

      await downloadFile(asset.browser_download_url, destPath, (prog) => {
        this.emit({ status: 'downloading', percent: prog.percent });
      });

      return this.emit({
        status: 'downloaded',
        latestVersion: latestVersionLabel,
        releaseUrl,
        releaseNotes,
        assetName: asset.name,
        filePath: destPath,
        percent: 100,
        error: ''
      });
    } catch (err) {
      return this.emit({ status: 'error', error: err.message });
    } finally {
      this._checking = false;
    }
  }

  async installDownloadedUpdate() {
    const filePath = this.state.filePath;
    if (!filePath || !fs.existsSync(filePath)) {
      if (this.state.releaseUrl) await shell.openExternal(this.state.releaseUrl);
      return { ok: false, error: 'Keine heruntergeladene Update-Datei gefunden.' };
    }

    try {
      const markerPath = path.join(app.getPath('userData'), 'updates', 'last_installed.json');
      fs.writeFileSync(
        markerPath,
        JSON.stringify({ assetUpdatedAt: this._latestAssetUpdatedAt || new Date().toISOString() }),
        'utf8'
      );
    } catch (e) {}

    const execMarker = '.app/Contents/MacOS/';
    if (process.platform === 'darwin' && /\.zip$/i.test(filePath) && process.execPath.includes(execMarker)) {
      const appBundlePath = process.execPath.slice(0, process.execPath.indexOf(execMarker) + 4);
      const extractDir = path.join(path.dirname(filePath), `extract-${Date.now()}`);
      fs.mkdirSync(extractDir, { recursive: true });

      await new Promise((resolve, reject) => {
        const p = spawn('ditto', ['-xk', filePath, extractDir]);
        p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Entpacken fehlgeschlagen (Code ${code})`))));
        p.on('error', reject);
      });

      const entries = fs.readdirSync(extractDir);
      const appName = entries.find((e) => e.endsWith('.app'));
      if (!appName) {
        shell.showItemInFolder(filePath);
        return { ok: true, mode: 'finder' };
      }

      const newAppPath = path.join(extractDir, appName);
      const swapScript = [
        'PID="$3"',
        'i=0',
        'while kill -0 "$PID" 2>/dev/null && [ $i -lt 50 ]; do sleep 0.2; i=$((i+1)); done',
        'xattr -dr com.apple.quarantine "$2" 2>/dev/null || true',
        'rm -rf -- "$1"',
        'mv -- "$2" "$1" || ditto -- "$2" "$1"',
        'xattr -dr com.apple.quarantine "$1" 2>/dev/null || true',
        'open -n "$1"'
      ].join('; ');
      const child = spawn(
        '/bin/sh',
        ['-c', swapScript, 'sh', appBundlePath, newAppPath, String(process.pid)],
        { detached: true, stdio: 'ignore' }
      );
      child.unref();
      app.quit();
      return { ok: true, mode: 'relaunch' };
    }

    if (process.platform === 'win32' && /\.zip$/i.test(filePath) && !/electron\.exe$/i.test(process.execPath)) {
      const appDir = path.dirname(process.execPath);
      const exePath = process.execPath;
      const extractDir = path.join(path.dirname(filePath), `extract-${Date.now()}`);
      const psScript = path.join(path.dirname(filePath), `apply-update-${Date.now()}.ps1`);
      const psBody = [
        `Wait-Process -Id ${process.pid} -ErrorAction SilentlyContinue`,
        'Start-Sleep -Milliseconds 600',
        `Expand-Archive -Path '${filePath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`,
        `Copy-Item -Path '${extractDir.replace(/'/g, "''")}\\*' -Destination '${appDir.replace(/'/g, "''")}' -Recurse -Force`,
        `Start-Process -FilePath '${exePath.replace(/'/g, "''")}'`
      ].join('\r\n');
      fs.writeFileSync(psScript, psBody, 'utf8');
      const child = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', psScript], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      app.quit();
      return { ok: true, mode: 'relaunch' };
    }

    await shell.openPath(filePath);
    return { ok: true, mode: 'opened' };
  }
}

module.exports = { GitHubAutoUpdater };
