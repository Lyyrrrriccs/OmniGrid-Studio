const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execFileSync } = require('child_process');

const VIDEO_EXTS = new Set(['.mp4', '.mkv', '.mov', '.ts', '.flv', '.webm']);

function getDefaultReplayDir() {
  const folder = process.platform === 'win32' ? 'Videos' : 'Movies';
  const candidate = path.join(os.homedir(), folder);
  if (fs.existsSync(candidate)) return candidate;
  return os.homedir();
}

function findFfmpegBinary() {
  const candidates = process.platform === 'win32'
    ? ['ffmpeg.exe', 'C:\\ffmpeg\\bin\\ffmpeg.exe']
    : ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg', 'ffmpeg'];

  for (const bin of candidates) {
    try {
      if (bin.includes(path.sep) && !fs.existsSync(bin)) continue;
      execFileSync(bin, ['-version'], { stdio: 'ignore', timeout: 2500 });
      return bin;
    } catch (e) {}
  }
  return null;
}

function listReplays(dirPath) {
  const targetDir = dirPath && fs.existsSync(dirPath) ? dirPath : getDefaultReplayDir();
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!VIDEO_EXTS.has(ext)) continue;
    const fullPath = path.join(targetDir, ent.name);
    try {
      const st = fs.statSync(fullPath);
      files.push({
        name: ent.name,
        path: fullPath,
        sizeMb: Number((st.size / (1024 * 1024)).toFixed(1)),
        mtime: st.mtimeMs
      });
    } catch (e) {}
  }
  files.sort((a, b) => b.mtime - a.mtime);
  return { ok: true, dir: targetDir, files: files.slice(0, 40) };
}

function exportVerticalShort({ inputPath, startSec = 0, durationSec = 30, layoutMode = 'blur_bg' }) {
  return new Promise((resolve, reject) => {
    if (!inputPath || !fs.existsSync(inputPath)) {
      return reject(new Error('Eingabe-Video nicht gefunden.'));
    }
    const ffmpegBin = findFfmpegBinary();
    if (!ffmpegBin) {
      return reject(
        new Error(
          process.platform === 'darwin'
            ? 'ffmpeg nicht gefunden. Bitte im Terminal installieren: brew install ffmpeg'
            : 'ffmpeg.exe nicht gefunden. Bitte installieren: winget install Gyan.FFmpeg'
        )
      );
    }

    const baseName = path.basename(inputPath, path.extname(inputPath));
    const shortsDir = path.join(path.dirname(inputPath), 'shorts');
    fs.mkdirSync(shortsDir, { recursive: true });
    const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
    const outPath = path.join(shortsDir, `${baseName}_9x16_${stamp}.mp4`);

    const args = ['-y'];
    const s = Math.max(0, Number(startSec) || 0);
    const d = Math.max(1, Math.min(180, Number(durationSec) || 30));
    if (s > 0) args.push('-ss', String(s));
    args.push('-i', inputPath, '-t', String(d));

    if (layoutMode === 'center_crop') {
      args.push('-vf', 'crop=ih*9/16:ih,scale=1080:1920:flags=lanczos,setsar=1');
    } else {
      args.push(
        '-filter_complex',
        '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1'
      );
    }

    args.push(
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '22',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '160k',
      '-movflags', '+faststart',
      outPath
    );

    const proc = spawn(ffmpegBin, args, { windowsHide: true });
    let errLog = '';
    proc.stderr.on('data', (chunk) => {
      errLog += chunk.toString();
      if (errLog.length > 4000) errLog = errLog.slice(-4000);
    });
    proc.on('error', (err) => reject(err));
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outPath)) {
        resolve({ ok: true, outPath, fileName: path.basename(outPath) });
      } else {
        reject(new Error(`ffmpeg beendet (Code ${code}): ${errLog.split('\n').slice(-4).join(' ')}`));
      }
    });
  });
}

function renameReplay(filePath, newTitle) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Datei nicht gefunden.');
  }
  const cleanBase = String(newTitle || '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim();
  if (!cleanBase) {
    throw new Error('Bitte einen gültigen Clip-Titel eingeben.');
  }
  const ext = path.extname(filePath);
  const nextPath = path.join(path.dirname(filePath), `${cleanBase}${ext}`);
  if (nextPath === filePath) {
    return { ok: true, oldPath: filePath, newPath: nextPath, name: path.basename(nextPath) };
  }
  if (fs.existsSync(nextPath)) {
    throw new Error('Eine Datei mit diesem Namen existiert bereits.');
  }
  fs.renameSync(filePath, nextPath);
  return { ok: true, oldPath: filePath, newPath: nextPath, name: path.basename(nextPath) };
}

module.exports = {
  getDefaultReplayDir,
  findFfmpegBinary,
  listReplays,
  exportVerticalShort,
  renameReplay
};
