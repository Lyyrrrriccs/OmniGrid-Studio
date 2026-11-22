const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { app, shell } = require('electron');

const GITHUB_OWNER = 'Lyyrrrriccs';
const GITHUB_REPO = 'omni-stream-chat';

function parseSemver(ver) {
  const clean = String(ver || '').trim().replace(/^v/i, '').split('-')[0];
  return clean.split('.').map((n) => parseInt(n, 10) || 0);
}

function isNewerVersion(remote, current) {
  const r = parseSemver(remote);
  const c = parseSemver(current);
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
  if (hops > 6) return Promise.reject(new Error('Zu viele Weiterleitungen beim Download'));
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'OmniGrid-Studio-Updater',
          Accept: 'application/octet-stream'
        }
      },
      (res) => {
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
        const out = fs.createWriteStream(destPath);
        res.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          if (onProgress) {
            const percent = totalBytes > 0 ? Math.min(100, Math.round((downloadedBytes / totalBytes) * 100)) : 0;
            onProgress({ downloadedBytes, totalBytes, percent });
          }
        });
        res.pipe(out);
        out.on('finish', () => out.close(() => resolve(destPath)));
        out.on('error', (err) => {
          try { fs.unlinkSync(destPath); } catch (e) {}
          reject(err);
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('Download-Timeout')));
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

  async checkForUpdates({ autoDownload = true } = {}) {
    if (this._checking) return this.getState();
    this._checking = true;
    const currentVersion = app.getVersion();
    this.emit({ status: 'checking', currentVersion, error: '', percent: 0 });

    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
      const rel = await fetchJson(apiUrl);
      if (rel?.notFound) {
        return this.emit({ status: 'up-to-date', latestVersion: currentVersion, error: '' });
      }
      const latestVersion = String(rel.tag_name || rel.name || '').replace(/^v/i, '');
      const releaseUrl = rel.html_url || this.state.releaseUrl;
      const releaseNotes = String(rel.body || '').slice(0, 600);

      if (!latestVersion || !isNewerVersion(latestVersion, currentVersion)) {
        return this.emit({ status: 'up-to-date', latestVersion: latestVersion || currentVersion, releaseUrl, error: '' });
      }

      const asset = pickPlatformAsset(rel.assets);
      if (!asset || !autoDownload) {
        return this.emit({
          status: 'available',
          latestVersion,
          releaseUrl,
          releaseNotes,
          assetName: asset ? asset.name : '',
          error: ''
        });
      }

      const updatesDir = path.join(app.getPath('userData'), 'updates');
      fs.mkdirSync(updatesDir, { recursive: true });
      const destPath = path.join(updatesDir, asset.name);

      this.emit({
        status: 'downloading',
        latestVersion,
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
        latestVersion,
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

    // macOS: if running inside a packaged .app and asset is a .zip, replace bundle & relaunch
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
      const script = [
        'sleep 1',
        `rm -rf "${appBundlePath.replace(/"/g, '\\"')}"`,
        `mv "${newAppPath.replace(/"/g, '\\"')}" "${appBundlePath.replace(/"/g, '\\"')}"`,
        `open "${appBundlePath.replace(/"/g, '\\"')}"`
      ].join(' && ');

      const child = spawn('/bin/sh', ['-c', script], { detached: true, stdio: 'ignore' });
      child.unref();
      app.quit();
      return { ok: true, mode: 'relaunch' };
    }

    // Fallback (dev mode, DMG, or Windows installer/zip)
    await shell.openPath(filePath);
    return { ok: true, mode: 'opened' };
  }
}

module.exports = { GitHubAutoUpdater };
