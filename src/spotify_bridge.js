const { exec } = require('child_process');
const { EventEmitter } = require('events');

/**
 * Zero-Config Local Spotify Desktop Bridge (macOS & Windows)
 * Reads the currently playing track directly from the local Spotify desktop app
 * without requiring any Spotify Developer API keys or OAuth setup.
 */
class SpotifyBridge extends EventEmitter {
  constructor() {
    super();
    this.enabled = true;
    this.pollTimer = null;
    this.currentTrack = {
      running: false,
      playing: false,
      artist: '',
      title: '',
      artworkUrl: ''
    };
    this._lastKey = '';
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

  pollNow() {
    if (!this.enabled) return;
    if (process.platform === 'darwin') {
      const script = [
        'tell application "System Events" to set isRunning to (name of processes) contains "Spotify"',
        'if not isRunning then return "OFF||"',
        'tell application "Spotify"',
        '  try',
        '    set pState to (player state as text)',
        '    set tName to (name of current track)',
        '    set tArtist to (artist of current track)',
        '    set tArtwork to (artwork url of current track)',
        '    return pState & "||" & tArtist & "||" & tName & "||" & tArtwork',
        '  on error',
        '    return "paused||||||"',
        '  end try',
        'end tell'
      ].join('\n');
      exec(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { timeout: 2500 }, (err, stdout) => {
        if (err || !stdout) return;
        const parts = stdout.trim().split('||');
        if (parts[0] === 'OFF') {
          this._updateTrack({ running: false, playing: false, artist: '', title: '', artworkUrl: '' });
          return;
        }
        const playing = parts[0] === 'playing';
        this._updateTrack({
          running: true,
          playing,
          artist: parts[1] || '',
          title: parts[2] || '',
          artworkUrl: parts[3] || ''
        });
      });
    } else if (process.platform === 'win32') {
      exec(
        'powershell -NoProfile -Command "$p = Get-Process Spotify -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | Select-Object -First 1; if ($p) { $p.MainWindowTitle } else { \'OFF\' }"',
        { timeout: 2500 },
        (err, stdout) => {
          if (err || !stdout) return;
          const raw = stdout.trim();
          if (raw === 'OFF') {
            this._updateTrack({ running: false, playing: false, artist: '', title: '', artworkUrl: '' });
            return;
          }
          if (raw === 'Spotify' || raw === 'Spotify Free' || raw === 'Spotify Premium') {
            this._updateTrack({ ...this.currentTrack, running: true, playing: false });
            return;
          }
          const sepIdx = raw.indexOf(' - ');
          const artist = sepIdx !== -1 ? raw.slice(0, sepIdx).trim() : '';
          const title = sepIdx !== -1 ? raw.slice(sepIdx + 3).trim() : raw;
          this._updateTrack({
            running: true,
            playing: true,
            artist,
            title,
            artworkUrl: ''
          });
        }
      );
    }
  }

  _updateTrack(next) {
    const key = `${next.running}|${next.playing}|${next.artist}|${next.title}|${next.artworkUrl}`;
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
        exec(`osascript -e 'tell application "Spotify" to ${appleCmd}'`, { timeout: 2500 }, (err) => {
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
