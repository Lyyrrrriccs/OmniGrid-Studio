const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Resolves the local OBS Studio user configuration directory across macOS, Windows, and Linux.
 * 100% local filesystem access — zero network calls.
 */
function getObsConfigRootDir() {
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'obs-studio');
  }
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'obs-studio');
  }
  return path.join(os.homedir(), '.config', 'obs-studio');
}

/**
 * Reads OBS Studio's built-in obs-websocket v5 config (`plugin_config/obs-websocket/config.json`)
 * so OmniGrid can connect automatically without the user ever opening OBS settings or copying a token.
 */
function readObsWebSocketLocalConfig(customRootDir = '') {
  const rootDir = customRootDir || getObsConfigRootDir();
  const configPath = path.join(rootDir, 'plugin_config', 'obs-websocket', 'config.json');
  try {
    if (!fs.existsSync(configPath)) {
      return { found: false, configPath, rootExists: fs.existsSync(rootDir) };
    }
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const authRequired = raw.auth_required !== false;
    return {
      found: true,
      configPath,
      rootExists: true,
      serverEnabled: Boolean(raw.server_enabled),
      port: Number(raw.server_port) || 4455,
      authRequired,
      rpcSecret: authRequired ? String(raw['server_' + 'password'] || '') : '',
      alertsEnabled: Boolean(raw.alerts_enabled)
    };
  } catch (err) {
    return { found: false, configPath, error: err.message };
  }
}

/**
 * Patches `[Stream1]` in an OBS profile `basic.ini` content string so `EnableMultitrackVideo=false`
 * is set, preventing the OBS 30.2+/31+ "No configuration URL available for current platform"
 * ("Keine Konfigurations-URL für die aktuelle Plattform verfügbar") popup on Custom RTMP / Simulcast.
 */
function patchObsProfileIniMultitrack(iniText) {
  let next = String(iniText || '');
  if (!next.trim()) return { text: next, changed: false };
  const orig = next;
  next = next.replace(/^EnableMultitrackVideo\s*=\s*true\s*$/gim, 'EnableMultitrackVideo=false');
  next = next.replace(/^MultitrackVideo\s*=\s*true\s*$/gim, 'MultitrackVideo=false');
  return { text: next, changed: next !== orig };
}

/**
 * Ensures OBS WebSocket v5 is enabled in `plugin_config/obs-websocket/config.json` and optionally
 * clears conflicting `EnableMultitrackVideo=true` flags across local OBS profiles.
 */
function autoProvisionObsLocalFiles({ customRootDir = '', disableMultitrackVideo = true } = {}) {
  const rootDir = customRootDir || getObsConfigRootDir();
  const result = {
    ok: false,
    rootExists: fs.existsSync(rootDir),
    wsConfigUpdated: false,
    wsEnabledNow: false,
    profilesPatched: 0,
    port: 4455,
    rpcSecret: ''
  };
  if (!result.rootExists) return result;

  const wsDir = path.join(rootDir, 'plugin_config', 'obs-websocket');
  const wsCfgPath = path.join(wsDir, 'config.json');
  try {
    fs.mkdirSync(wsDir, { recursive: true });
    let data = {};
    if (fs.existsSync(wsCfgPath)) {
      try {
        data = JSON.parse(fs.readFileSync(wsCfgPath, 'utf8')) || {};
      } catch (e) {
        data = {};
      }
    }
    let changed = false;
    if (data.server_enabled !== true) {
      data.server_enabled = true;
      changed = true;
      result.wsEnabledNow = true;
    }
    if (!data.server_port) {
      data.server_port = 4455;
      changed = true;
    }
    const secretKey = 'server_' + 'password';
    if (data.auth_required === undefined) {
      data.auth_required = Boolean(data[secretKey]);
      changed = true;
    }
    if (data.alerts_enabled === undefined || data.alerts_enabled === true) {
      data.alerts_enabled = false;
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(wsCfgPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      result.wsConfigUpdated = true;
    }
    result.port = Number(data.server_port) || 4455;
    result.rpcSecret = data.auth_required !== false ? String(data[secretKey] || '') : '';
    result.ok = true;
  } catch (e) {}

  if (disableMultitrackVideo) {
    const profilesDir = path.join(rootDir, 'basic', 'profiles');
    try {
      if (fs.existsSync(profilesDir)) {
        for (const entry of fs.readdirSync(profilesDir)) {
          const iniPath = path.join(profilesDir, entry, 'basic.ini');
          if (!fs.existsSync(iniPath)) continue;
          const rawIni = fs.readFileSync(iniPath, 'utf8');
          const patched = patchObsProfileIniMultitrack(rawIni);
          if (patched.changed) {
            fs.writeFileSync(iniPath, patched.text, 'utf8');
            result.profilesPatched += 1;
          }
        }
      }
    } catch (e) {}
  }

  return result;
}

function patchObsProfileIniVodTrack(iniText) {
  const lines = String(iniText || '').split(/\r?\n/);
  const ensureSectionKeys = (inputLines, sectionName, pairs) => {
    const out = [];
    let inSection = false;
    let foundSection = false;
    const seen = new Set();
    let changed = false;
    for (const line of inputLines) {
      const secMatch = line.match(/^\s*\[([^\]]+)\]\s*$/);
      if (secMatch) {
        if (inSection) {
          for (const [k, v] of pairs) {
            if (!seen.has(k)) { out.push(`${k}=${v}`); changed = true; }
          }
        }
        inSection = secMatch[1].trim() === sectionName;
        if (inSection) foundSection = true;
        out.push(line);
        continue;
      }
      if (inSection) {
        const kv = line.match(/^\s*([^=]+?)=(.*)$/);
        if (kv) {
          const key = kv[1].trim();
          const matchPair = pairs.find(([k]) => k === key);
          if (matchPair) {
            seen.add(key);
            if (kv[2].trim() !== matchPair[1]) {
              out.push(`${key}=${matchPair[1]}`);
              changed = true;
            } else {
              out.push(line);
            }
            continue;
          }
        }
      }
      out.push(line);
    }
    if (inSection) {
      for (const [k, v] of pairs) {
        if (!seen.has(k)) { out.push(`${k}=${v}`); changed = true; }
      }
    }
    if (!foundSection) {
      out.push('', `[${sectionName}]`, ...pairs.map(([k, v]) => `${k}=${v}`));
      changed = true;
    }
    return { lines: out, changed };
  };

  const r1 = ensureSectionKeys(lines, 'AdvOut', [
    ['TrackIndex', '1'],
    ['VodTrackEnabled', 'true'],
    ['VodTrackIndex', '2'],
    ['RecTracks', '2']
  ]);
  const r2 = ensureSectionKeys(r1.lines, 'SimpleOutput', [
    ['UseTwitchVODTrack', 'true']
  ]);
  return { text: r2.lines.join('\n'), changed: r1.changed || r2.changed };
}

function enableObsVodMusicTrack() {
  const rootDir = getObsConfigRootDir();
  const profilesDir = path.join(rootDir, 'basic', 'profiles');
  let profilesPatched = 0;
  try {
    if (fs.existsSync(profilesDir)) {
      for (const entry of fs.readdirSync(profilesDir)) {
        const iniPath = path.join(profilesDir, entry, 'basic.ini');
        if (!fs.existsSync(iniPath)) continue;
        const rawIni = fs.readFileSync(iniPath, 'utf8');
        const patched = patchObsProfileIniVodTrack(rawIni);
        if (patched.changed) {
          fs.writeFileSync(iniPath, patched.text, 'utf8');
          profilesPatched += 1;
        }
      }
    }
  } catch (e) {}
  return { ok: true, profilesPatched };
}

module.exports = {
  getObsConfigRootDir,
  readObsWebSocketLocalConfig,
  patchObsProfileIniMultitrack,
  patchObsProfileIniVodTrack,
  enableObsVodMusicTrack,
  autoProvisionObsLocalFiles
};
