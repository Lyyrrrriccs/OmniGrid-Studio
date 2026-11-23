const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const appName = 'OmniGridStudio.app';
const targetApp = path.join(distDir, appName);
const electronApp = path.join(rootDir, 'node_modules', 'electron', 'dist', 'Electron.app');

console.log('⚡ Building OmniGridStudio.app for macOS...');

fs.rmSync(targetApp, { recursive: true, force: true });
fs.rmSync(path.join(distDir, 'OmniStreamChat.app'), { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

execSync(`cp -R "${electronApp}" "${targetApp}"`);

const resourcesAppDir = path.join(targetApp, 'Contents', 'Resources', 'app');
fs.mkdirSync(resourcesAppDir, { recursive: true });

fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(resourcesAppDir, 'package.json'));
for (const docFile of ['ANLEITUNG.md', 'GUIDE.md', 'README.de.md', 'README.md', 'CHANGELOG.md', 'PRIVACY.md']) {
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
  fs.copyFileSync(icnsSrc, path.join(targetApp, 'Contents', 'Resources', 'OmniGridStudio.icns'));
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
    fs.renameSync(path.join(macosBinDir, 'Electron'), path.join(macosBinDir, 'OmniGridStudio'));
  }
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleExecutable OmniGridStudio" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleName OmniGridStudio" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName OmniGrid Studio" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier com.tobias.omnigridstudio" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 1.1.0" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleIconFile OmniGridStudio.icns" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Delete :NSAppleEventsUsageDescription" "${plistPath}" 2>/dev/null || true`);
  execSync(`/usr/libexec/PlistBuddy -c "Add :NSAppleEventsUsageDescription string 'OmniGrid Studio liest den aktuellen Spotify-Track fuer das OBS-Widget und !song.'" "${plistPath}"`);
  execSync(`/usr/libexec/PlistBuddy -c "Delete :NSLocalNetworkUsageDescription" "${plistPath}" 2>/dev/null || true`);
  execSync(`/usr/libexec/PlistBuddy -c "Add :NSLocalNetworkUsageDescription string 'OmniGrid Studio stellt den Tablet Companion und OBS-Overlays im lokalen Netzwerk bereit.'" "${plistPath}"`);
} catch (err) {
  console.warn('Plist notice:', err.message);
}

try {
  execSync(`codesign --force --deep --sign - "${targetApp}"`);
} catch (err) {
  console.warn('Codesign notice:', err.message);
}

// Create a direct symlink in the project root AND remove legacy shortcut
try {
  fs.rmSync(path.join(rootDir, 'OmniStreamChat.app'), { recursive: true, force: true });
  const rootShortcut = path.join(rootDir, 'OmniGridStudio.app');
  fs.rmSync(rootShortcut, { recursive: true, force: true });
  fs.symlinkSync(targetApp, rootShortcut);
} catch (e) {}

console.log(`✅ macOS App built (double-click without terminal): ${targetApp}`);
