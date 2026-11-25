const { exec, execFile } = require('child_process');
const { EventEmitter } = require('events');
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');

const MAC_MR_HELPER_SRC = `#import <Foundation/Foundation.h>
#import <dlfcn.h>

typedef void (*MRGetNowPlayingInfoFn)(dispatch_queue_t, void (^)(NSDictionary *));
typedef void (*MRGetNowPlayingClientFn)(dispatch_queue_t, void (^)(id));
typedef NSString *(*MRClientGetBundleIdFn)(id);
typedef NSString *(*MRClientGetDisplayNameFn)(id);
typedef Boolean (*MRSendCommandFn)(int, id);

int main(int argc, char **argv) {
  @autoreleasepool {
    void *h = dlopen("/System/Library/PrivateFrameworks/MediaRemote.framework/MediaRemote", RTLD_LAZY);
    if (!h) return 1;
    if (argc > 1) {
      MRGetNowPlayingClientFn getClient = (MRGetNowPlayingClientFn)dlsym(h, "MRMediaRemoteGetNowPlayingClient");
      MRClientGetBundleIdFn getBid = (MRClientGetBundleIdFn)dlsym(h, "MRNowPlayingClientGetBundleIdentifier");
      MRClientGetDisplayNameFn getName = (MRClientGetDisplayNameFn)dlsym(h, "MRNowPlayingClientGetDisplayName");
      MRSendCommandFn sendCmd = (MRSendCommandFn)dlsym(h, "MRMediaRemoteSendCommand");
      if (!sendCmd || !getClient) return 1;
      NSString *arg = [NSString stringWithUTF8String:argv[1]];
      int cmd = -1;
      if ([arg isEqualToString:@"playpause"]) cmd = 2;
      else if ([arg isEqualToString:@"next"]) cmd = 4;
      else if ([arg isEqualToString:@"previous"]) cmd = 5;
      if (cmd < 0) return 1;
      getClient(dispatch_get_main_queue(), ^(id client) {
        NSString *bid = (client && getBid) ? [(getBid(client) ?: @"") lowercaseString] : @"";
        NSString *dname = (client && getName) ? [(getName(client) ?: @"") lowercaseString] : @"";
        BOOL isMusicApp = ([bid containsString:@"spotify"] || [bid containsString:@"amazon"] || [bid containsString:@"com.apple.music"] || [bid containsString:@"com.apple.itunes"] || [dname isEqualToString:@"music"] || [dname containsString:@"spotify"] || [dname containsString:@"amazon music"]);
        if (!isMusicApp) {
          exit(2);
        }
        sendCmd(cmd, nil);
        usleep(120000);
        exit(0);
      });
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 1500 * NSEC_PER_MSEC), dispatch_get_main_queue(), ^{ exit(2); });
      dispatch_main();
    }

    MRGetNowPlayingInfoFn getInfo = (MRGetNowPlayingInfoFn)dlsym(h, "MRMediaRemoteGetNowPlayingInfo");
    MRGetNowPlayingClientFn getClient = (MRGetNowPlayingClientFn)dlsym(h, "MRMediaRemoteGetNowPlayingClient");
    MRClientGetBundleIdFn getBid = (MRClientGetBundleIdFn)dlsym(h, "MRNowPlayingClientGetBundleIdentifier");
    MRClientGetDisplayNameFn getName = (MRClientGetDisplayNameFn)dlsym(h, "MRNowPlayingClientGetDisplayName");
    if (!getInfo || !getClient) return 1;

    getClient(dispatch_get_main_queue(), ^(id client) {
      NSString *bid = (client && getBid) ? (getBid(client) ?: @"") : @"";
      NSString *dname = (client && getName) ? (getName(client) ?: @"") : @"";
      getInfo(dispatch_get_main_queue(), ^(NSDictionary *info) {
        NSString *title = info[@"kMRMediaRemoteNowPlayingInfoTitle"] ?: @"";
        NSString *artist = info[@"kMRMediaRemoteNowPlayingInfoArtist"] ?: @"";
        NSNumber *rate = info[@"kMRMediaRemoteNowPlayingInfoPlaybackRate"];
        BOOL playing = rate ? ([rate doubleValue] > 0.0) : NO;
        NSDictionary *out = @{
          @"bundleId": bid,
          @"appName": dname,
          @"title": title,
          @"artist": artist,
          @"playing": @(playing)
        };
        NSData *json = [NSJSONSerialization dataWithJSONObject:out options:0 error:nil];
        if (json) {
          printf("%s\\n", [[[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding] UTF8String]);
        }
        exit(0);
      });
    });
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 1800 * NSEC_PER_MSEC), dispatch_get_main_queue(), ^{ exit(0); });
    dispatch_main();
  }
}
`;

function mapMusicSourceFromClient(bundleId, appName) {
  const combined = `${bundleId || ''} ${appName || ''}`.toLowerCase();
  if (combined.includes('amazon')) return 'Amazon Music';
  if (combined.includes('spotify')) return 'Spotify';
  if (combined.includes('com.apple.music') || combined.includes('com.apple.itunes') || appName === 'Music') {
    return 'Apple Music';
  }
  return '';
}

/**
 * Zero-Config Local Music Desktop Bridge (Spotify, Apple Music & Amazon Music on macOS & Windows)
 * Reads the currently playing track directly from the local desktop music player
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
    this._mrHelperPath = path.join(os.tmpdir(), 'omnigrid_mr_helper_v2');
    this._mrCompiling = null;
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

  _ensureMacMrHelper() {
    if (process.platform !== 'darwin') return Promise.resolve(null);
    if (fs.existsSync(this._mrHelperPath)) return Promise.resolve(this._mrHelperPath);
    if (this._mrCompiling) return this._mrCompiling;

    this._mrCompiling = new Promise((resolve) => {
      const srcPath = `${this._mrHelperPath}.m`;
      try {
        fs.writeFileSync(srcPath, MAC_MR_HELPER_SRC, 'utf8');
      } catch (e) {
        this._mrCompiling = null;
        return resolve(null);
      }
      exec(
        `/usr/bin/clang -O2 -framework Foundation "${srcPath}" -o "${this._mrHelperPath}" && /usr/bin/codesign -f -s - -i com.apple.mediaremote.reader "${this._mrHelperPath}"`,
        { timeout: 8000 },
        (err) => {
          try { fs.unlinkSync(srcPath); } catch (e) {}
          this._mrCompiling = null;
          resolve(!err && fs.existsSync(this._mrHelperPath) ? this._mrHelperPath : null);
        }
      );
    });
    return this._mrCompiling;
  }

  _queryMacMediaRemote() {
    return new Promise(async (resolve) => {
      const bin = await this._ensureMacMrHelper();
      if (!bin) return resolve(null);
      execFile(bin, [], { timeout: 2200 }, (err, stdout) => {
        if (err || !stdout) return resolve(null);
        try {
          const data = JSON.parse(stdout.trim());
          const source = mapMusicSourceFromClient(data.bundleId, data.appName);
          if (!source || !data.title) return resolve(null);
          resolve({
            running: true,
            playing: Boolean(data.playing),
            source,
            artist: data.artist || '',
            title: data.title || '',
            artworkUrl: ''
          });
        } catch (e) {
          resolve(null);
        }
      });
    });
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

  async pollNow() {
    if (!this.enabled) return;
    if (process.platform === 'darwin') {
      // 1) Check macOS MediaRemote first (supports Amazon Music, Spotify & Apple Music natively)
      const mrTrack = await this._queryMacMediaRemote();
      if (mrTrack && mrTrack.playing) {
        if (!mrTrack.artworkUrl && mrTrack.title) {
          mrTrack.artworkUrl = await this._lookupArtwork(mrTrack.artist, mrTrack.title);
        }
        this._updateTrack(mrTrack);
        return;
      }

      // 2) AppleScript fallback for Spotify & Apple Music (or paused MediaRemote track)
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

      execFile('osascript', ['-e', script], { timeout: 2500 }, async (err, stdout) => {
        if (!err && stdout) {
          const parts = stdout.trim().split('||');
          if (parts[0] !== 'OFF' && parts[3]) {
            const playing = parts[0] === 'playing';
            const source = parts[1] || 'Spotify';
            const artist = parts[2] || '';
            const title = parts[3] || '';
            let artworkUrl = parts[4] || '';
            if (!artworkUrl && title) {
              artworkUrl = await this._lookupArtwork(artist, title);
            }
            this._updateTrack({ running: true, playing, source, artist, title, artworkUrl });
            return;
          }
        }
        // If AppleScript returned OFF/error, use paused MediaRemote track if available
        if (mrTrack && mrTrack.title) {
          if (!mrTrack.artworkUrl) {
            mrTrack.artworkUrl = await this._lookupArtwork(mrTrack.artist, mrTrack.title);
          }
          this._updateTrack(mrTrack);
          return;
        }
        this._updateTrack({ running: false, playing: false, source: '', artist: '', title: '', artworkUrl: '' });
      });
    } else if (process.platform === 'win32') {
      const psCmd = [
        '$sp = Get-Process Spotify -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | Select-Object -First 1;',
        '$az = Get-Process "Amazon Music" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | Select-Object -First 1;',
        '$am = Get-Process AppleMusic, iTunes -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | Select-Object -First 1;',
        'if ($az -and $az.MainWindowTitle -notmatch "^Amazon Music$") { "Amazon Music||" + $az.MainWindowTitle }',
        'elseif ($sp -and $sp.MainWindowTitle -notmatch "^Spotify( Free| Premium)?$") { "Spotify||" + $sp.MainWindowTitle }',
        'elseif ($am -and $am.MainWindowTitle -notmatch "^(Apple Music|iTunes)$") { "Apple Music||" + $am.MainWindowTitle }',
        'elseif ($az) { "Amazon Music||PAUSED" }',
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
    return new Promise(async (resolve) => {
      const validActions = ['playpause', 'next', 'previous'];
      if (!validActions.includes(action)) return resolve({ ok: false });

      if (process.platform === 'darwin') {
        const cmdMap = { playpause: 'playpause', next: 'next track', previous: 'previous track' };
        const appleCmd = cmdMap[action];
        const source = this.currentTrack?.source || '';

        if (source === 'Spotify' || source === 'Apple Music') {
          const targetApp = source === 'Apple Music' ? 'Music' : 'Spotify';
          execFile('osascript', ['-e', `tell application "${targetApp}" to ${appleCmd}`], { timeout: 2500 }, (err) => {
            setTimeout(() => this.pollNow(), 350);
            resolve({ ok: !err });
          });
          return;
        }

        if (source === 'Amazon Music') {
          const bin = await this._ensureMacMrHelper();
          if (bin) {
            const mrOk = await new Promise((res) => {
              execFile(bin, [action], { timeout: 2500 }, (err) => res(!err));
            });
            if (mrOk) {
              setTimeout(() => this.pollNow(), 350);
              return resolve({ ok: true });
            }
          }
          const menuTargets = {
            playpause: ['Play', 'Pause', 'Wiedergabe', 'Anhalten'],
            next: ['Next', 'Next Track', 'Nächster Titel', 'Weiter'],
            previous: ['Previous', 'Previous Track', 'Vorheriger Titel', 'Zurück']
          }[action];
          const azScript = [
            'tell application "System Events"',
            '  if not (exists process "Amazon Music") then return "OFF"',
            '  tell process "Amazon Music"',
            '    repeat with m in menu bar items of menu bar 1',
            '      try',
            '        repeat with mi in menu items of menu 1 of m',
            '          set n to name of mi',
            `          if {${menuTargets.map((t) => `"${t}"`).join(', ')}} contains n then`,
            '            click mi',
            '            return "OK"',
            '          end if',
            '        end repeat',
            '      end try',
            '    end repeat',
            '  end tell',
            'end tell',
            'return "MISS"'
          ].join('\n');
          execFile('osascript', ['-e', azScript], { timeout: 2500 }, (err, stdout) => {
            setTimeout(() => this.pollNow(), 350);
            resolve({ ok: !err && String(stdout || '').trim() === 'OK' });
          });
          return;
        }

        const directScript = [
          'tell application "System Events"',
          '  set procNames to (name of processes)',
          '  set spRun to procNames contains "Spotify"',
          '  set amRun to procNames contains "Music"',
          'end tell',
          `if spRun then`,
          `  tell application "Spotify" to ${appleCmd}`,
          '  return "Spotify"',
          `else if amRun then`,
          `  tell application "Music" to ${appleCmd}`,
          '  return "Music"',
          'end if',
          'return "NONE"'
        ].join('\n');
        execFile('osascript', ['-e', directScript], { timeout: 2500 }, async (err, stdout) => {
          const out = String(stdout || '').trim();
          if (!err && (out === 'Spotify' || out === 'Music')) {
            setTimeout(() => this.pollNow(), 350);
            return resolve({ ok: true });
          }
          const bin = await this._ensureMacMrHelper();
          if (!bin) return resolve({ ok: false });
          execFile(bin, [action], { timeout: 2500 }, (mrErr) => {
            setTimeout(() => this.pollNow(), 350);
            resolve({ ok: !mrErr });
          });
        });
      } else if (process.platform === 'win32') {
        const appCmdMap = { playpause: 14 << 16, next: 11 << 16, previous: 12 << 16 };
        const lParam = appCmdMap[action];
        const source = this.currentTrack?.source || '';
        const procOrder = source === 'Amazon Music'
          ? '"Amazon Music","Spotify","AppleMusic","iTunes"'
          : source === 'Apple Music'
            ? '"AppleMusic","iTunes","Spotify","Amazon Music"'
            : '"Spotify","Amazon Music","AppleMusic","iTunes"';
        const ps = `$sig='[DllImport("user32.dll")]public static extern IntPtr SendMessageW(IntPtr hWnd,int Msg,IntPtr wParam,IntPtr lParam);';$t=Add-Type -MemberDefinition $sig -Name M -Namespace W -PassThru;$p=$null;foreach($n in @(${procOrder})){$p=Get-Process -Name $n -ErrorAction SilentlyContinue|Where-Object{$_.MainWindowHandle -ne 0}|Select-Object -First 1;if($p){break}};if($p){$t::SendMessageW($p.MainWindowHandle,0x0319,[IntPtr]::Zero,[IntPtr]${lParam})|Out-Null;'OK'}else{'NONE'}`;
        exec(`powershell -NoProfile -Command "${ps}"`, { timeout: 2500 }, (err, stdout) => {
          setTimeout(() => this.pollNow(), 350);
          resolve({ ok: !err && String(stdout || '').trim() === 'OK' });
        });
      } else {
        resolve({ ok: false });
      }
    });
  }
}

module.exports = { SpotifyBridge };
