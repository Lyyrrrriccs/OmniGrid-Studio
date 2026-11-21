const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const appName = 'OmniStreamChat.app';
const targetApp = path.join(distDir, appName);
const electronApp = path.join(rootDir, 'node_modules', 'electron', 'dist', 'Electron.app');

console.log('⚡ Building OmniStreamChat.app for macOS...');

fs.rmSync(targetApp, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

execSync(`cp -R "${electronApp}" "${targetApp}"`);

const resourcesAppDir = path.join(targetApp, 'Contents', 'Resources', 'app');
fs.mkdirSync(resourcesAppDir, { recursive: true });

fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(resourcesAppDir, 'package.json'));
for (const docFile of ['ANLEITUNG.md', 'GUIDE.md', 'README.de.md', 'README.md']) {
  const srcDoc = path.join(rootDir, docFile);
  if (fs.existsSync(srcDoc)) {
    fs.copyFileSync(srcDoc, path.join(resourcesAppDir, docFile));
  }
}
execSync(`cp -R "${path.join(rootDir, 'src')}" "${path.join(resourcesAppDir, 'src')}"`);
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  execSync(`cp -R "${path.join(rootDir, 'assets')}" "${path.join(resourcesAppDir, 'assets')}"`);
}
const icnsSrc = path.join(rootDir, 'assets', 'icon.icns');
if (fs.existsSync(icnsSrc)) {
  fs.copyFileSync(icnsSrc, path.join(targetApp, 'Contents', 'Resources', 'OmniStreamChat.icns'));
}

// Copy production node_modules (ws, tiktok-live-connector) into bundle
const nmDest = path.join(resourcesAppDir, 'node_modules');
fs.mkdirSync(nmDest, { recursive: true });
for (const entry of fs.readdirSync(path.join(rootDir, 'node_modules'))) {
  if (entry === 'electron' || entry === '.bin' || entry === '.cache') continue;
  execSync(`cp -R "${path.join(rootDir, 'node_modules', entry)}" "${path.join(nmDest, entry)}"`);
}

const plistPath = path.join(targetApp, 'Contents', 'Info.plist');
const macosBinDir = path.join(targetApp, 'Contents', 'MacOS');
try {
  if (fs.existsSync(path.join(macosBinDir, 'Electron'))) {
    fs.renameSync(path.join(macosBinDir, 'Electron'), path.join(macosBinDir, 'OmniStreamChat'));
  }
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleExecutable OmniStreamChat" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleName OmniStreamChat" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName OmniStreamChat" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier com.tobias.omnistreamchat" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 1.0.0" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleIconFile OmniStreamChat.icns" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Delete :NSAppleEventsUsageDescription" "${plistPath}" 2>/dev/null || true`);
  execSync(`/usr/libexec/PlistBuddy -c "Add :NSAppleEventsUsageDescription string 'OmniStreamChat liest den aktuellen Spotify-Track fuer das OBS-Widget und !song.'" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Delete :NSLocalNetworkUsageDescription" "${plistPath}" 2>/dev/null || true`);
  execSync(`/usr/libexec/PlistBuddy -c "Add :NSLocalNetworkUsageDescription string 'OmniStreamChat stellt den Tablet Companion und OBS-Overlays im lokalen Netzwerk bereit.'" "${plistPath}"`);
} catch (err) {
  console.warn('Plist notice:', err.message);
}

try {
  execSync(`codesign --force --deep --sign - "${targetApp}"`);
} catch (err) {
  console.warn('Codesign notice:', err.message);
}

// Create a direct symlink in the project root AND on the user's Desktop for 1-click launching without terminal
try {
  const rootShortcut = path.join(rootDir, 'OmniStreamChat.app');
  fs.rmSync(rootShortcut, { recursive: true, force: true });
  fs.symlinkSync(targetApp, rootShortcut);
} catch (e) {}

console.log(`✅ macOS App built (double-click without terminal): ${targetApp}`);
