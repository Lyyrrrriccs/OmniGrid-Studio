const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, spawnSync, execFileSync } = require('child_process');

const VIDEO_EXTS = new Set(['.mp4', '.mkv', '.mov', '.ts', '.flv', '.webm', '.gif']);

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

function requireFfmpeg() {
  const bin = findFfmpegBinary();
  if (!bin) {
    throw new Error(
      process.platform === 'darwin'
        ? 'ffmpeg nicht gefunden. Bitte im Terminal installieren: brew install ffmpeg'
        : 'ffmpeg.exe nicht gefunden. Bitte installieren: winget install Gyan.FFmpeg'
    );
  }
  return bin;
}

function findSystemFont() {
  const candidates = process.platform === 'darwin'
    ? ['/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/System/Library/Fonts/Helvetica.ttc']
    : process.platform === 'win32'
      ? ['C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/segoeui.ttf']
      : ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'];
  for (const f of candidates) {
    if (fs.existsSync(f)) return f;
  }
  return '';
}

function escapeDrawtext(text) {
  return String(text || '')
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/%/g, '\\%')
    .replace(/\r?\n/g, ' ');
}

function escapeFilterPath(p) {
  return String(p || '')
    .replace(/\\/g, '/')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'");
}

function buildAtempoChain(speed) {
  const sp = Math.max(0.25, Math.min(2.0, Number(speed) || 1));
  if (Math.abs(sp - 1) < 0.01) return '';
  if (sp < 0.5) return `atempo=0.5,atempo=${(sp / 0.5).toFixed(3)}`;
  return `atempo=${sp.toFixed(3)}`;
}

function runFfmpeg(ffmpegBin, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegBin, args, { windowsHide: true });
    let errLog = '';
    proc.stderr.on('data', (chunk) => {
      errLog += chunk.toString();
      if (errLog.length > 4000) errLog = errLog.slice(-4000);
    });
    proc.on('error', (err) => reject(err));
    proc.on('close', (code) => {
      if (code === 0) resolve({ ok: true });
      else reject(new Error(`ffmpeg beendet (Code ${code}): ${errLog.split('\n').slice(-4).join(' ')}`));
    });
  });
}

function listReplays(dirPath) {
  const targetDir = dirPath && fs.existsSync(dirPath) ? dirPath : getDefaultReplayDir();
  const scanDirs = [
    { dir: targetDir, badge: '' },
    { dir: path.join(targetDir, 'shorts'), badge: '9:16' },
    { dir: path.join(targetDir, 'trimmed'), badge: 'Cut' },
    { dir: path.join(targetDir, 'montages'), badge: 'Mix' }
  ];
  const files = [];
  for (const item of scanDirs) {
    if (!fs.existsSync(item.dir)) continue;
    const entries = fs.readdirSync(item.dir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (!VIDEO_EXTS.has(ext)) continue;
      const fullPath = path.join(item.dir, ent.name);
      try {
        const st = fs.statSync(fullPath);
        files.push({
          name: ent.name,
          badge: ext === '.gif' ? 'GIF' : item.badge,
          path: fullPath,
          sizeMb: Number((st.size / (1024 * 1024)).toFixed(1)),
          mtime: st.mtimeMs
        });
      } catch (e) {}
    }
  }
  files.sort((a, b) => b.mtime - a.mtime);
  return { ok: true, dir: targetDir, files: files.slice(0, 60) };
}

let cachedCaps = null;
function getFfmpegCapabilities(ffmpegBin) {
  if (cachedCaps && cachedCaps.bin === ffmpegBin) return cachedCaps;
  try {
    const res = spawnSync(ffmpegBin, ['-hide_banner', '-filters'], { encoding: 'utf8', timeout: 4000 });
    const out = `${res.stdout || ''}\n${res.stderr || ''}`;
    cachedCaps = {
      bin: ffmpegBin,
      hasDrawtext: /\bdrawtext\b/.test(out),
      hasSubtitles: /\bsubtitles\b/.test(out)
    };
  } catch (e) {
    cachedCaps = { bin: ffmpegBin, hasDrawtext: false, hasSubtitles: false };
  }
  return cachedCaps;
}

function writeTempOverlayPng(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  const m = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!m) return '';
  const tmpPath = path.join(os.tmpdir(), `omnigrid_clip_ov_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.png`);
  fs.writeFileSync(tmpPath, Buffer.from(m[1], 'base64'));
  return tmpPath;
}

function buildOverlayVideoSuffix({ ffmpegBin, isVertical, speed = 1, hookText = '', watermarkText = '', subtitlePath = '', hasOverlayPng = false }) {
  const parts = [];
  const sp = Math.max(0.25, Math.min(2.0, Number(speed) || 1));
  if (Math.abs(sp - 1) > 0.01) parts.push(`setpts=${(1 / sp).toFixed(4)}*PTS`);
  const caps = ffmpegBin ? getFfmpegCapabilities(ffmpegBin) : { hasDrawtext: false, hasSubtitles: false };
  if (!hasOverlayPng && caps.hasDrawtext) {
    const font = findSystemFont();
    const fontArg = font ? `fontfile='${escapeFilterPath(font)}':` : '';
    const cleanHook = String(hookText || '').trim().slice(0, 80);
    if (cleanHook) {
      const fsSize = isVertical ? 54 : 44;
      const yPos = isVertical ? '110' : '42';
      parts.push(`drawtext=${fontArg}text='${escapeDrawtext(cleanHook)}':fontsize=${fsSize}:fontcolor=white:borderw=4:bordercolor=black:box=1:boxcolor=black@0.48:boxborderw=14:x=(w-text_w)/2:y=${yPos}`);
    }
    const cleanWm = String(watermarkText || '').trim().slice(0, 48);
    if (cleanWm) {
      const wmSize = isVertical ? 30 : 24;
      parts.push(`drawtext=${fontArg}text='${escapeDrawtext(cleanWm)}':fontsize=${wmSize}:fontcolor=white@0.78:borderw=2:bordercolor=black@0.75:x=w-text_w-26:y=h-text_h-26`);
    }
  }
  if (subtitlePath && fs.existsSync(subtitlePath) && caps.hasSubtitles) {
    parts.push(`subtitles='${escapeFilterPath(subtitlePath)}'`);
  }
  return parts;
}

function buildAudioFilters({ speed = 1, normalizeAudio = false, audioGainDb = 0, fadeAudioSec = 0, outDur = 10 }) {
  const af = [];
  const atempo = buildAtempoChain(speed);
  if (atempo) af.push(atempo);
  const gain = Number(audioGainDb) || 0;
  if (Math.abs(gain) >= 0.5) af.push(`volume=${gain.toFixed(1)}dB`);
  if (normalizeAudio) af.push('loudnorm=I=-14:TP=-1.5:LRA=11');
  const fade = Math.max(0, Math.min(3, Number(fadeAudioSec) || 0));
  if (fade > 0.05 && outDur > fade * 2.2) {
    af.push(`afade=t=in:st=0:d=${fade.toFixed(2)}`);
    af.push(`afade=t=out:st=${Math.max(0, outDur - fade).toFixed(2)}:d=${fade.toFixed(2)}`);
  }
  return af;
}

async function runClipExport({
  inputPath,
  isVertical = true,
  startSec = 0,
  endSec = null,
  durationSec = 30,
  layoutMode = 'blur_bg',
  facecamBox = null,
  speed = 1,
  hookText = '',
  watermarkText = '',
  overlayPngDataUrl = '',
  subtitlePath = '',
  muteAudio = false,
  normalizeAudio = false,
  audioGainDb = 0,
  fadeAudioSec = 0,
  musicPath = '',
  musicVolume = 0.25,
  preset = 'standard'
}) {
  if (!inputPath || !fs.existsSync(inputPath)) throw new Error('Eingabe-Video nicht gefunden.');
  const ffmpegBin = requireFfmpeg();
  const caps = getFfmpegCapabilities(ffmpegBin);

  const baseName = path.basename(inputPath, path.extname(inputPath));
  const subFolder = isVertical ? 'shorts' : 'trimmed';
  const outDir = path.join(path.dirname(inputPath), subFolder);
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
  const isGif = preset === 'gif';
  const ext = isGif ? '.gif' : '.mp4';
  const suffix = isGif ? 'gif' : (isVertical ? '9x16' : 'cut');
  const outPath = path.join(outDir, `${baseName}_${suffix}_${stamp}${ext}`);

  const s = Math.max(0, Number(startSec) || 0);
  const computedDur = endSec !== null && endSec !== undefined && Number(endSec) > s
    ? Number(endSec) - s
    : Number(durationSec) || 30;
  const d = Math.max(0.5, Math.min(600, computedDur));
  const sp = Math.max(0.25, Math.min(2.0, Number(speed) || 1));
  const outDur = d / sp;

  const tempPng = writeTempOverlayPng(overlayPngDataUrl);
  const hasMusic = !isGif && !muteAudio && musicPath && fs.existsSync(musicPath);
  const hasSoftSub = !isGif && !caps.hasSubtitles && subtitlePath && fs.existsSync(subtitlePath);

  try {
    const args = ['-y'];
    if (s > 0) args.push('-ss', String(s));
    args.push('-i', inputPath, '-t', String(d));
    let nextIdx = 1;
    let musicIdx = -1;
    let pngIdx = -1;
    let subIdx = -1;
    if (hasMusic) {
      musicIdx = nextIdx++;
      args.push('-stream_loop', '-1', '-i', musicPath);
    }
    if (tempPng) {
      pngIdx = nextIdx++;
      args.push('-i', tempPng);
    }
    if (hasSoftSub) {
      subIdx = nextIdx++;
      args.push('-i', subtitlePath);
    }

    const postV = buildOverlayVideoSuffix({
      ffmpegBin,
      isVertical,
      speed: sp,
      hookText,
      watermarkText,
      subtitlePath,
      hasOverlayPng: Boolean(tempPng)
    });
    const postVStr = postV.length ? `,${postV.join(',')}` : '';
    const filterParts = [];

    if (isVertical) {
      if (layoutMode === 'split_cam' && facecamBox && Number(facecamBox.w) > 0.04 && Number(facecamBox.h) > 0.04) {
        const fx = Math.max(0, Math.min(0.95, Number(facecamBox.x) || 0)).toFixed(4);
        const fy = Math.max(0, Math.min(0.95, Number(facecamBox.y) || 0)).toFixed(4);
        const fw = Math.max(0.05, Math.min(1, Number(facecamBox.w) || 0.25)).toFixed(4);
        const fh = Math.max(0.05, Math.min(1, Number(facecamBox.h) || 0.25)).toFixed(4);
        filterParts.push(
          `[0:v]crop=iw*${fw}:ih*${fh}:iw*${fx}:ih*${fy},scale=1080:640:force_original_aspect_ratio=increase,crop=1080:640,setsar=1[cam]`,
          `[0:v]scale=1080:1280:force_original_aspect_ratio=increase,crop=1080:1280,setsar=1[game]`,
          `[cam][game]vstack=inputs=2${postVStr}[vbase]`
        );
      } else if (layoutMode === 'center_crop') {
        filterParts.push(`[0:v]crop=ih*9/16:ih,scale=1080:1920:flags=lanczos,setsar=1${postVStr}[vbase]`);
      } else {
        filterParts.push(
          `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg]`,
          `[0:v]scale=1080:-2[fg]`,
          `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1${postVStr}[vbase]`
        );
      }
    } else {
      filterParts.push(`[0:v]scale=trunc(iw/2)*2:trunc(ih/2)*2${postVStr}[vbase]`);
    }

    let videoTag = '[vbase]';
    if (pngIdx >= 0) {
      filterParts.push(`[${pngIdx}:v][vbase]scale2ref[ovpng][vref]`, `[vref][ovpng]overlay=0:0[vpre]`);
      videoTag = '[vpre]';
    }

    if (isGif) {
      const gifW = isVertical ? 360 : 480;
      filterParts.push(`${videoTag}fps=15,scale=${gifW}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse[vout]`);
      args.push('-filter_complex', filterParts.join(';'), '-map', '[vout]', '-t', String(outDur.toFixed(2)), outPath);
      await runFfmpeg(ffmpegBin, args);
      return { ok: true, outPath, fileName: path.basename(outPath) };
    }

    let audioMap = '0:a?';
    if (!muteAudio) {
      const af = buildAudioFilters({ speed: sp, normalizeAudio, audioGainDb, fadeAudioSec, outDur });
      if (hasMusic) {
        const mVol = Math.max(0.02, Math.min(1.0, Number(musicVolume) || 0.25)).toFixed(2);
        const mainChain = af.length ? `[0:a]${af.join(',')}[a0]` : '[0:a]anull[a0]';
        filterParts.push(
          mainChain,
          `[${musicIdx}:a]volume=${mVol},atrim=0:${outDur.toFixed(2)},asetpts=PTS-STARTPTS[a1]`,
          `[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]`
        );
        audioMap = '[aout]';
      } else if (af.length) {
        filterParts.push(`[0:a]${af.join(',')}[aout]`);
        audioMap = '[aout]';
      }
    }

    args.push('-filter_complex', filterParts.join(';'), '-map', videoTag);
    if (muteAudio) args.push('-an');
    else args.push('-map', audioMap);
    if (subIdx >= 0) args.push('-map', `${subIdx}:s:0`, '-c:s', 'mov_text');

    args.push('-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p');
    if (preset === 'shorts_60fps') {
      args.push('-r', '60', '-crf', '19');
    } else if (preset === 'discord_10mb') {
      const targetTotalKbps = Math.max(350, Math.floor((9.2 * 8192) / Math.max(1, outDur)));
      const aKbps = muteAudio ? 0 : 96;
      const vKbps = Math.max(250, targetTotalKbps - aKbps);
      args.push('-b:v', `${vKbps}k`, '-maxrate', `${Math.round(vKbps * 1.25)}k`, '-bufsize', `${vKbps * 2}k`);
    } else {
      args.push('-crf', isVertical ? '21' : '20');
    }

    if (!muteAudio) {
      args.push('-c:a', 'aac', '-b:a', preset === 'discord_10mb' ? '96k' : '160k');
    }
    args.push('-t', String(outDur.toFixed(2)), '-movflags', '+faststart', outPath);

    await runFfmpeg(ffmpegBin, args);
    return { ok: true, outPath, fileName: path.basename(outPath) };
  } finally {
    if (tempPng) {
      try { fs.unlinkSync(tempPng); } catch (e) {}
    }
  }
}

function exportVerticalShort(opts = {}) {
  return runClipExport({ ...opts, isVertical: true });
}

function trimOriginalVideo(opts = {}) {
  return runClipExport({ ...opts, isVertical: false });
}

function extractWaveform(inputPath, bars = 120) {
  return new Promise((resolve, reject) => {
    if (!inputPath || !fs.existsSync(inputPath)) return reject(new Error('Video nicht gefunden.'));
    const ffmpegBin = findFfmpegBinary();
    if (!ffmpegBin) return resolve({ ok: false, peaks: [] });

    const proc = spawn(ffmpegBin, [
      '-v', 'error',
      '-i', inputPath,
      '-ac', '1',
      '-ar', '4000',
      '-f', 's16le',
      'pipe:1'
    ], { windowsHide: true });

    const chunks = [];
    let totalBytes = 0;
    proc.stdout.on('data', (c) => {
      if (totalBytes < 12 * 1024 * 1024) {
        chunks.push(c);
        totalBytes += c.length;
      }
    });
    proc.on('error', () => resolve({ ok: false, peaks: [] }));
    proc.on('close', () => {
      if (!chunks.length) return resolve({ ok: true, peaks: [] });
      const buf = Buffer.concat(chunks);
      const samples = Math.floor(buf.length / 2);
      const count = Math.max(24, Math.min(240, Number(bars) || 120));
      const step = Math.max(1, Math.floor(samples / count));
      const rawPeaks = [];
      let maxVal = 1;
      for (let b = 0; b < count; b++) {
        const start = b * step;
        const end = Math.min(samples, start + step);
        let peak = 0;
        for (let i = start; i < end; i += 2) {
          const v = Math.abs(buf.readInt16LE(i * 2));
          if (v > peak) peak = v;
        }
        if (peak > maxVal) maxVal = peak;
        rawPeaks.push(peak);
      }
      const peaks = rawPeaks.map((v) => Number((v / maxVal).toFixed(3)));
      resolve({ ok: true, peaks });
    });
  });
}

async function exportThumbnail({ inputPath, timeSec = 0 }) {
  if (!inputPath || !fs.existsSync(inputPath)) throw new Error('Eingabe-Video nicht gefunden.');
  const ffmpegBin = requireFfmpeg();
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const thumbDir = path.join(path.dirname(inputPath), 'thumbnails');
  fs.mkdirSync(thumbDir, { recursive: true });
  const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
  const outPath = path.join(thumbDir, `${baseName}_thumb_${stamp}.png`);
  const t = Math.max(0, Number(timeSec) || 0);
  await runFfmpeg(ffmpegBin, ['-y', '-ss', String(t.toFixed(2)), '-i', inputPath, '-frames:v', '1', '-q:v', '2', outPath]);
  return { ok: true, outPath, fileName: path.basename(outPath) };
}

async function exportHighlightMontage({
  inputPath,
  segments = [],
  isVertical = false,
  layoutMode = 'blur_bg',
  facecamBox = null,
  crossfadeSec = 0.4,
  normalizeAudio = false,
  watermarkText = '',
  overlayPngDataUrl = ''
}) {
  if (!inputPath || !fs.existsSync(inputPath)) throw new Error('Eingabe-Video nicht gefunden.');
  const validSegs = (Array.isArray(segments) ? segments : [])
    .map((seg) => ({
      start: Math.max(0, Number(seg.startSec ?? seg.start) || 0),
      end: Math.max(0.5, Number(seg.endSec ?? seg.end) || 0)
    }))
    .filter((seg) => seg.end > seg.start + 0.4);
  if (validSegs.length < 2) throw new Error('Mindestens 2 Segmente für eine Highlight-Montage erforderlich.');

  const ffmpegBin = requireFfmpeg();
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outDir = path.join(path.dirname(inputPath), 'montages');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
  const outPath = path.join(outDir, `${baseName}_montage_${isVertical ? '9x16' : '16x9'}_${stamp}.mp4`);
  const tempPng = writeTempOverlayPng(overlayPngDataUrl);

  try {
    const args = ['-y'];
    for (const seg of validSegs) {
      args.push('-ss', String(seg.start), '-t', String((seg.end - seg.start).toFixed(2)), '-i', inputPath);
    }
    const pngIdx = tempPng ? validSegs.length : -1;
    if (tempPng) args.push('-i', tempPng);

    const cf = Math.max(0, Math.min(1.0, Number(crossfadeSec) || 0.4));
    const filterParts = [];
    const scaleExpr = isVertical
      ? 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30'
      : 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30';

    validSegs.forEach((_, i) => {
      filterParts.push(`[${i}:v]${scaleExpr},setpts=PTS-STARTPTS[v${i}]`);
      filterParts.push(`[${i}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asetpts=PTS-STARTPTS[a${i}]`);
    });

    let curV = 'v0';
    let curA = 'a0';
    let accDur = validSegs[0].end - validSegs[0].start;
    for (let i = 1; i < validSegs.length; i++) {
      const segDur = validSegs[i].end - validSegs[i].start;
      const useCf = Math.min(cf, Math.max(0.1, Math.min(accDur, segDur) * 0.35));
      const offset = Math.max(0, accDur - useCf);
      const nextV = `xv${i}`;
      const nextA = `xa${i}`;
      filterParts.push(`[${curV}][v${i}]xfade=transition=fade:duration=${useCf.toFixed(2)}:offset=${offset.toFixed(2)}[${nextV}]`);
      filterParts.push(`[${curA}][a${i}]acrossfade=d=${useCf.toFixed(2)}[${nextA}]`);
      curV = nextV;
      curA = nextA;
      accDur = offset + segDur;
    }

    if (pngIdx >= 0) {
      filterParts.push(`[${pngIdx}:v][${curV}]scale2ref[ovpng][vref]`, `[vref][ovpng]overlay=0:0[vfinal]`);
      curV = 'vfinal';
    } else {
      const wmParts = buildOverlayVideoSuffix({ ffmpegBin, isVertical, watermarkText });
      if (wmParts.length) {
        filterParts.push(`[${curV}]${wmParts.join(',')}[vfinal]`);
        curV = 'vfinal';
      }
    }
    if (normalizeAudio) {
      filterParts.push(`[${curA}]loudnorm=I=-14:TP=-1.5:LRA=11[afinal]`);
      curA = 'afinal';
    }

    args.push(
      '-filter_complex', filterParts.join(';'),
      '-map', `[${curV}]`,
      '-map', `[${curA}]`,
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '160k',
      '-movflags', '+faststart',
      outPath
    );

    await runFfmpeg(ffmpegBin, args);
    return { ok: true, outPath, fileName: path.basename(outPath), segmentCount: validSegs.length };
  } finally {
    if (tempPng) {
      try { fs.unlinkSync(tempPng); } catch (e) {}
    }
  }
}

function renameReplay(filePath, newTitle) {
  if (!filePath || !fs.existsSync(filePath)) throw new Error('Datei nicht gefunden.');
  const cleanBase = String(newTitle || '').replace(/[\\/:*?"<>|]/g, '_').trim();
  if (!cleanBase) throw new Error('Bitte einen gültigen Clip-Titel eingeben.');
  const ext = path.extname(filePath);
  const nextPath = path.join(path.dirname(filePath), `${cleanBase}${ext}`);
  if (nextPath === filePath) return { ok: true, oldPath: filePath, newPath: nextPath, name: path.basename(nextPath) };
  if (fs.existsSync(nextPath)) throw new Error('Eine Datei mit diesem Namen existiert bereits.');
  fs.renameSync(filePath, nextPath);
  return { ok: true, oldPath: filePath, newPath: nextPath, name: path.basename(nextPath) };
}

module.exports = {
  getDefaultReplayDir,
  findFfmpegBinary,
  listReplays,
  exportVerticalShort,
  trimOriginalVideo,
  extractWaveform,
  exportThumbnail,
  exportHighlightMontage,
  renameReplay
};
