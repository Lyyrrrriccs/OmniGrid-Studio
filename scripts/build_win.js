const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

/**
 * Cross-Platform Windows Portable Builder (`npm run build:win`)
 * Builds a complete, standalone Windows 64-bit application folder (`dist/OmniGridStudio-win32-x64/OmniGridStudio.exe`)
 * directly on macOS OR Windows — ready to double-click on any Windows PC without Node.js or a terminal!
 */
const rootDir = path.resolve(__dirname, '..');
const distRoot = path.join(rootDir, 'dist');
const winOutDir = path.join(distRoot, 'OmniGridStudio-win32-x64');
const cacheDir = path.join(rootDir, '.electron-cache');
const electronVersion = '33.4.11';
const winZipName = `electron-v${electronVersion}-win32-x64.zip`;
const winZipPath = path.join(cacheDir, winZipName);
const winZipUrl = `https://github.com/electron/electron/releases/download/v${electronVersion}/${winZipName}`;

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (currentUrl) => {
      https
        .get(currentUrl, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return request(res.headers.location);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} when downloading ${currentUrl}`));
          }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => file.close(resolve));
          file.on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
          });
        })
        .on('error', reject);
    };
    request(url);
  });
}

function copyRecursiveSync(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function buildWindowsPortable() {
  console.log('⚡ Building standalone Windows Application (OmniGridStudio.exe)...');
  fs.rmSync(winOutDir, { recursive: true, force: true });
  fs.mkdirSync(winOutDir, { recursive: true });

  const localElectronDist = path.join(rootDir, 'node_modules', 'electron', 'dist');
  if (process.platform === 'win32' && fs.existsSync(path.join(localElectronDist, 'electron.exe'))) {
    copyRecursiveSync(localElectronDist, winOutDir);
  } else {
    fs.mkdirSync(cacheDir, { recursive: true });
    if (!fs.existsSync(winZipPath) || fs.statSync(winZipPath).size < 10_000_000) {
      console.log(`⬇️  Downloading official Electron Windows x64 runtime (${winZipName})...`);
      await downloadFile(winZipUrl, winZipPath);
    }
    console.log('📦 Extracting Windows runtime...');
    execSync(`unzip -q -o "${winZipPath}" -d "${winOutDir}"`);
  }

  // Copy application code & production dependencies into resources/app
  const resourcesAppDir = path.join(winOutDir, 'resources', 'app');
  fs.mkdirSync(resourcesAppDir, { recursive: true });

  fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(resourcesAppDir, 'package.json'));
  for (const docFile of ['ANLEITUNG.md', 'GUIDE.md', 'README.de.md', 'README.md', 'CHANGELOG.md', 'PRIVACY.md']) {
    const srcDoc = path.join(rootDir, docFile);
    if (fs.existsSync(srcDoc)) {
      fs.copyFileSync(srcDoc, path.join(resourcesAppDir, docFile));
    }
  }
  copyRecursiveSync(path.join(rootDir, 'src'), path.join(resourcesAppDir, 'src'));
  if (fs.existsSync(path.join(rootDir, 'assets'))) {
    copyRecursiveSync(path.join(rootDir, 'assets'), path.join(resourcesAppDir, 'assets'));
  }
  const winIcoSrc = path.join(rootDir, 'assets', 'icon.ico');
  if (fs.existsSync(winIcoSrc)) {
    fs.copyFileSync(winIcoSrc, path.join(winOutDir, 'OmniGridStudio.ico'));
  }

  const nmDest = path.join(resourcesAppDir, 'node_modules');
  fs.mkdirSync(nmDest, { recursive: true });
  for (const entry of fs.readdirSync(path.join(rootDir, 'node_modules'))) {
    if (entry === 'electron' || entry === '.bin' || entry === '.cache') continue;
    copyRecursiveSync(path.join(rootDir, 'node_modules', entry), path.join(nmDest, entry));
  }

  // Rename electron.exe -> OmniGridStudio.exe so the user can double-click it directly!
  const rawExe = path.join(winOutDir, 'electron.exe');
  const finalExe = path.join(winOutDir, 'OmniGridStudio.exe');
  if (fs.existsSync(rawExe)) {
    fs.renameSync(rawExe, finalExe);
  }

  // Also create a zero-console Windows double-click shortcut (.vbs) in the project root
  const vbsLauncher = `Set WshShell = CreateObject("WScript.Shell")\r\nSet fso = CreateObject("Scripting.FileSystemObject")\r\ndir = fso.GetParentFolderName(WScript.ScriptFullName)\r\nexePath = dir & "\\dist\\OmniGridStudio-win32-x64\\OmniGridStudio.exe"\r\nIf fso.FileExists(exePath) Then\r\n  WshShell.Run """" & exePath & """", 1, False\r\nElse\r\n  WshShell.Run "cmd /c cd /d """ & dir & """ && npx electron .", 0, False\r\nEnd If\r\n`;
  fs.writeFileSync(path.join(rootDir, 'OmniGridStudio-Starten (Windows).vbs'), vbsLauncher, 'utf8');

  console.log(`✅ Standalone Windows App ready: ${finalExe}`);
}

buildWindowsPortable().catch((err) => {
  console.error('❌ Windows build failed:', err.message);
  process.exit(1);
});
