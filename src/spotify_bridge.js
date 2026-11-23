const { exec } = require('child_process');
const { EventEmitter } = require('events');
const https = require('https');

/**
 * Zero-Config Local Spotify & Apple Music Desktop Bridge (macOS & Windows)
 * Reads the currently playing track directly from Spotify or Apple Music (Music.app / iTunes)
 * without requiring any Developer API keys or OAuth setup.
 */
class SpotifyBridge extends EventEmitter {
  constructor() {
    super();
    this.enabled = true;
    this.pollTimer = null;
    this.currentTrack = {
      running: false,
      playing: false,
      source: '',
      artist: '',
      title: '',
      artworkUrl: ''
    };
    this._lastKey = '';
    this._artworkCache = new Map();
  }

  start(enabled = true) {
    this.enabled = Boolean(enabled);
    this.stop();
    if (!this.enabled) return;
    this.pollNow();
    this.pollTimer = setInterval(() => this.pollNow(), 3000);
  }

  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  _lookupArtwork(artist, title) {
    const queryKey = `${artist}|${title}`.toLowerCase();
    if (!title) return Promise.resolve('');
    if (this._artworkCache.has(queryKey)) {
      return Promise.resolve(this._artworkCache.get(queryKey));
    }
    const term = encodeURIComponent(`${artist ? artist + ' ' : ''}${title}`.trim());
    const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`;
    return new Promise((resolve) => {
      const req = https.get(url, { timeout: 2500 }, (res) => {
        let body = '';
        res.on('data', (c) => { body += c; });
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            const rawUrl = json?.results?.[0]?.artworkUrl100 || '';
            const art = rawUrl ? rawUrl.replace('100x100bb', '300x300bb') : '';
            this._artworkCache.set(queryKey, art);
            resolve(art);
          } catch (e) {
            resolve('');
          }
        });
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => {
        req.destroy();
        resolve('');
      });
    });
  }

  pollNow() {
    if (!this.enabled) return;
    if (process.platform === 'darwin') {
      const script = [
        'tell application "System Events"',
        '  set procNames to (name of processes)',
        '  set spRun to procNames contains "Spotify"',
        '  set amRun to procNames contains "Music"',
        'end tell',
        'if not spRun and not amRun then return "OFF||||||"',
        'set spData to ""',
        'if spRun then',
        '  tell application "Spotify"',
        '    try',
        '      set pState to (player state as text)',
        '      set tName to (name of current track)',
        '      set tArtist to (artist of current track)',
        '      set tArt to (artwork url of current track)',
        '      set spData to pState & "||Spotify||" & tArtist & "||" & tName & "||" & tArt',
        '    end try',
        '  end tell',
        'end if',
        'if spData starts with "playing||" then return spData',
        'set amData to ""',
        'if amRun then',
        '  tell application "Music"',
        '    try',
        '      set pState to (player state as text)',
        '      set tName to (name of current track)',
        '      set tArtist to (artist of current track)',
        '      set amData to pState & "||Apple Music||" & tArtist & "||" & tName & "||"',
        '    end try',
        '  end tell',
        'end if',
        'if amData starts with "playing||" then return amData',
        'if spData is not "" then return spData',
        'if amData is not "" then return amData',
        'return "paused||||||"'
      ].join('\n');

      exec(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { timeout: 2500 }, async (err, stdout) => {
        if (err || !stdout) return;
        const parts = stdout.trim().split('||');
        if (parts[0] === 'OFF') {
          this._updateTrack({ running: false, playing: false, source: '', artist: '', title: '', artworkUrl: '' });
          return;
        }
        const playing = parts[0] === 'playing';
        const source = parts[1] || 'Spotify';
        const artist = parts[2] || '';
        const title = parts[3] || '';
        let artworkUrl = parts[4] || '';
        if (!artworkUrl && title) {
          artworkUrl = await this._lookupArtwork(artist, title);
        }
        this._updateTrack({
          running: true,
          playing,
          source,
          artist,
          title,
          artworkUrl
        });
      });
    } else if (process.platform === 'win32') {
      const psCmd = [
        '$sp = Get-Process Spotify -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | Select-Object -First 1;',
        '$am = Get-Process AppleMusic, iTunes -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | Select-Object -First 1;',
        'if ($sp -and $sp.MainWindowTitle -notmatch "^Spotify( Free| Premium)?$") { "Spotify||" + $sp.MainWindowTitle }',
        'elseif ($am -and $am.MainWindowTitle -notmatch "^(Apple Music|iTunes)$") { "Apple Music||" + $am.MainWindowTitle }',
        'elseif ($sp) { "Spotify||PAUSED" }',
        'elseif ($am) { "Apple Music||PAUSED" }',
        'else { "OFF||" }'
      ].join(' ');
      exec(
        `powershell -NoProfile -Command "${psCmd}"`,
        { timeout: 2500 },
        async (err, stdout) => {
          if (err || !stdout) return;
          const [source, rawTitle] = stdout.trim().split('||');
          if (source === 'OFF' || !source) {
            this._updateTrack({ running: false, playing: false, source: '', artist: '', title: '', artworkUrl: '' });
            return;
          }
          if (rawTitle === 'PAUSED' || !rawTitle) {
            this._updateTrack({ ...this.currentTrack, running: true, playing: false, source });
            return;
          }
          const sepIdx = rawTitle.indexOf(' - ');
          const artist = sepIdx !== -1 ? rawTitle.slice(0, sepIdx).trim() : '';
          const title = sepIdx !== -1 ? rawTitle.slice(sepIdx + 3).trim() : rawTitle;
          const artworkUrl = title ? await this._lookupArtwork(artist, title) : '';
          this._updateTrack({
            running: true,
            playing: true,
            source,
            artist,
            title,
            artworkUrl
          });
        }
      );
    }
  }

  _updateTrack(next) {
    const key = `${next.running}|${next.playing}|${next.source}|${next.artist}|${next.title}|${next.artworkUrl}`;
    this.currentTrack = next;
    if (key !== this._lastKey) {
      this._lastKey = key;
      this.emit('track', next);
    }
  }

  control(action) {
    return new Promise((resolve) => {
      if (process.platform === 'darwin') {
        const cmdMap = {
          playpause: 'playpause',
          next: 'next track',
          previous: 'previous track'
        };
        const appleCmd = cmdMap[action];
        if (!appleCmd) return resolve({ ok: false });
        const targetApp = this.currentTrack?.source === 'Apple Music' ? 'Music' : 'Spotify';
        const script = [
          `tell application "System Events" to set tRun to (name of processes) contains "${targetApp}"`,
          `if tRun then`,
          `  tell application "${targetApp}" to ${appleCmd}`,
          `else`,
          `  tell application "System Events" to set mRun to (name of processes) contains "Music"`,
          `  if mRun then tell application "Music" to ${appleCmd}`,
          `end if`
        ].join('\n');
        exec(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { timeout: 2500 }, (err) => {
          setTimeout(() => this.pollNow(), 350);
          resolve({ ok: !err });
        });
      } else if (process.platform === 'win32') {
        const vkMap = {
          playpause: 0xB3, // VK_MEDIA_PLAY_PAUSE
          next: 0xB0,      // VK_MEDIA_NEXT_TRACK
          previous: 0xB1   // VK_MEDIA_PREV_TRACK
        };
        const vk = vkMap[action];
        if (!vk) return resolve({ ok: false });
        const ps = `$sig='[DllImport("user32.dll")]public static extern void keybd_event(byte bVk,byte bScan,uint dwFlags,UIntPtr dwExtraInfo);';$t=Add-Type -MemberDefinition $sig -Name K -Namespace W -PassThru;$t::keybd_event(${vk},0,0,[UIntPtr]::Zero);$t::keybd_event(${vk},0,2,[UIntPtr]::Zero);`;
        exec(`powershell -NoProfile -Command "${ps}"`, { timeout: 2500 }, (err) => {
          setTimeout(() => this.pollNow(), 350);
          resolve({ ok: !err });
        });
      } else {
        resolve({ ok: false });
      }
    });
  }
}

module.exports = { SpotifyBridge };
