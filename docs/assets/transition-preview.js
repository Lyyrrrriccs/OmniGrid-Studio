(function initOmniTransitionPreview() {
  let modalEl = null;
  let animId = 0;
  let endTimer = null;
  let switchTimer = null;
  let activePack = null;
  const akaliSkateImg = new Image();
  akaliSkateImg.src = './assets/akali-ignition-art.png';

  function ensureModal() {
    if (modalEl) return modalEl;
    const style = document.createElement('style');
    style.textContent = `
      .otp-backdrop { position:fixed; inset:0; z-index:9999; background:rgba(2,6,23,0.86); backdrop-filter:blur(8px); display:none; align-items:center; justify-content:center; padding:16px; }
      .otp-backdrop.open { display:flex; }
      .otp-box { width:min(960px, 96vw); background:#0b1224; border:1.5px solid rgba(148,163,184,0.3); border-radius:16px; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.75); }
      .otp-head { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 16px; border-bottom:1px solid rgba(148,163,184,0.18); background:rgba(15,23,42,0.9); }
      .otp-title { font-size:14px; font-weight:800; color:#f8fafc; display:flex; align-items:center; gap:8px; }
      .otp-actions { display:flex; align-items:center; gap:8px; }
      .otp-btn { padding:6px 12px; border-radius:8px; font-size:12px; font-weight:700; border:1px solid rgba(148,163,184,0.3); background:#1e293b; color:#f8fafc; cursor:pointer; }
      .otp-btn:hover { background:#334155; }
      .otp-btn-primary { background:#7c3aed; border-color:#a855f7; }
      .otp-btn-primary:hover { background:#6d28d9; }
      .otp-stage { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; background:#020617; }
      .otp-scene { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; transition:opacity 0.25s; }
      .otp-scene-a { background:radial-gradient(circle at 25% 25%, rgba(56,189,248,0.22), transparent 55%), linear-gradient(135deg, #0b1428, #050a16); }
      .otp-scene-b { background:radial-gradient(circle at 75% 30%, rgba(168,85,247,0.26), transparent 55%), linear-gradient(135deg, #120922, #070b18); }
      .otp-scene-pill { font-size:11px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; padding:5px 12px; border-radius:999px; border:1px solid rgba(255,255,255,0.2); background:rgba(2,6,23,0.65); color:#e2e8f0; }
      .otp-scene-label { font-size:22px; font-weight:900; color:#f8fafc; opacity:0.85; }
      .otp-curtain { position:absolute; top:0; bottom:0; width:56%; background:linear-gradient(135deg, var(--tbg-a, #061022), var(--tbg-b, #020814)); border:3px solid var(--t1, #c8aa6e); box-shadow:0 0 42px var(--t1, #c8aa6e); z-index:2; }
      .otp-left { left:-62%; transform:skewX(-12deg); }
      .otp-right { right:-62%; transform:skewX(-12deg); }
      @keyframes otpLeftSweep { 0% { left:-62%; } 42%, 58% { left:-4%; } 100% { left:-62%; } }
      @keyframes otpRightSweep { 0% { right:-62%; } 42%, 58% { right:-4%; } 100% { right:-62%; } }
      @keyframes otpRingBlast { 0%, 34% { opacity:0; transform:translate(-50%,-50%) scale(0.2); } 44% { opacity:0.95; } 78%, 100% { opacity:0; transform:translate(-50%,-50%) scale(2.8); } }
      @keyframes otpEmblemPop { 0%, 26% { opacity:0; transform:translate(-50%,-50%) scale(0.55) rotate(-14deg); } 44%, 58% { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(0deg); } 82%, 100% { opacity:0; transform:translate(-50%,-50%) scale(1.25) rotate(8deg); } }
      .otp-stage.playing .otp-left { animation:otpLeftSweep 1.75s cubic-bezier(0.76,0,0.24,1) forwards; }
      .otp-stage.playing .otp-right { animation:otpRightSweep 1.75s cubic-bezier(0.76,0,0.24,1) forwards; }
      .otp-ring { position:absolute; top:50%; left:50%; width:220px; height:220px; border-radius:50%; border:4px solid var(--t1, #c8aa6e); box-shadow:0 0 36px var(--t1, #c8aa6e), inset 0 0 28px var(--t2, #0ac8b9); opacity:0; z-index:3; pointer-events:none; }
      .otp-stage.playing .otp-ring { animation:otpRingBlast 1.75s ease-out forwards; }
      .otp-emblem { position:absolute; top:50%; left:50%; width:96px; height:96px; border-radius:50%; background:radial-gradient(circle, var(--t2, #0ac8b9) 0%, var(--tbg-b, #020814) 72%); border:3px solid var(--t1, #c8aa6e); box-shadow:0 0 38px var(--t1, #c8aa6e), inset 0 0 20px var(--t2, #0ac8b9); display:flex; align-items:center; justify-content:center; font-size:44px; opacity:0; z-index:5; pointer-events:none; }
      .otp-stage.playing .otp-emblem { animation:otpEmblemPop 1.75s cubic-bezier(0.22,1,0.36,1) forwards; }
      .otp-canvas { position:absolute; inset:0; width:100%; height:100%; z-index:4; pointer-events:none; }
    `;
    document.head.appendChild(style);

    modalEl = document.createElement('div');
    modalEl.className = 'otp-backdrop';
    modalEl.innerHTML = `
      <div class="otp-box">
        <div class="otp-head">
          <div class="otp-title"><span id="otpIcon">✨</span><span id="otpName">Transition Preview</span></div>
          <div class="otp-actions">
            <button type="button" class="otp-btn otp-btn-primary" id="otpReplay">🔁 Replay</button>
            <button type="button" class="otp-btn" id="otpClose">✕ Close</button>
          </div>
        </div>
        <div class="otp-stage" id="otpStage">
          <div class="otp-scene otp-scene-a" id="otpSceneA">
            <span class="otp-scene-pill">OBS Scene A</span>
            <div class="otp-scene-label">🖼️ LoL Client / Lobby</div>
          </div>
          <div class="otp-scene otp-scene-b" id="otpSceneB" style="opacity:0;">
            <span class="otp-scene-pill">OBS Scene B</span>
            <div class="otp-scene-label">⚔️ In-Game Live</div>
          </div>
          <div class="otp-curtain otp-left"></div>
          <div class="otp-curtain otp-right"></div>
          <div class="otp-ring"></div>
          <canvas class="otp-canvas" id="otpCanvas"></canvas>
          <div class="otp-emblem" id="otpEmblem">⚡</div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal();
    });
    modalEl.querySelector('#otpClose').addEventListener('click', closeModal);
    modalEl.querySelector('#otpReplay').addEventListener('click', () => {
      if (activePack) runAnimation(activePack);
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl.classList.contains('open')) closeModal();
    });
    return modalEl;
  }

  function stopAnim() {
    if (animId) cancelAnimationFrame(animId);
    animId = 0;
    if (endTimer) clearTimeout(endTimer);
    if (switchTimer) clearTimeout(switchTimer);
  }

  function closeModal() {
    stopAnim();
    if (modalEl) modalEl.classList.remove('open');
  }

  function drawCoffinShape(ctx, cx, cy, w, h) {
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.28, cy - h * 0.5);
    ctx.lineTo(cx + w * 0.28, cy - h * 0.5);
    ctx.lineTo(cx + w * 0.5, cy - h * 0.18);
    ctx.lineTo(cx + w * 0.34, cy + h * 0.5);
    ctx.lineTo(cx - w * 0.34, cy + h * 0.5);
    ctx.lineTo(cx - w * 0.5, cy - h * 0.18);
    ctx.closePath();
  }

  function runAnimation(pack) {
    stopAnim();
    const m = ensureModal();
    const stage = m.querySelector('#otpStage');
    const canvas = m.querySelector('#otpCanvas');
    const ctx = canvas.getContext('2d');
    const sceneA = m.querySelector('#otpSceneA');
    const sceneB = m.querySelector('#otpSceneB');
    const emblem = m.querySelector('#otpEmblem');

    const c = pack.colors || {};
    const c1 = c.primary || '#c8aa6e';
    const c2 = c.secondary || '#0ac8b9';
    stage.style.setProperty('--t1', c1);
    stage.style.setProperty('--t2', c2);
    stage.style.setProperty('--tbg-a', c.bgStart || '#061022');
    stage.style.setProperty('--tbg-b', c.bgEnd || '#020814');
    emblem.textContent = pack.icon || '⚡';

    const showBNext = sceneA.style.opacity !== '0';
    sceneA.style.opacity = showBNext ? '1' : '0';
    sceneB.style.opacity = showBNext ? '0' : '1';
    switchTimer = setTimeout(() => {
      sceneA.style.opacity = showBNext ? '0' : '1';
      sceneB.style.opacity = showBNext ? '1' : '0';
    }, 820);

    canvas.width = 1280;
    canvas.height = 720;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W * 0.5;
    const cy = H * 0.5;
    const fx = String(pack.effect || '');
    const start = performance.now();

    stage.classList.remove('playing');
    void stage.offsetWidth;
    stage.classList.add('playing');

    let items = [];
    if (fx === 'crime-city') {
      const cols = ['#facc15', '#ef4444', '#38bdf8', '#e11d48', '#a855f7'];
      const suits = ['♠', '♥', '♦', '♣'];
      items = Array.from({ length: 40 }, (_, i) => {
        const left = i % 2 === 0;
        const sp = 18 + Math.random() * 18;
        const a = (Math.random() - 0.5) * 0.7;
        return {
          x: left ? -120 - Math.random() * 340 : W + 120 + Math.random() * 340,
          y: H * (0.15 + Math.random() * 0.7),
          vx: (left ? 1 : -1) * Math.cos(a) * sp,
          vy: Math.sin(a) * sp * 0.75 - 1.5,
          rot: Math.random() * Math.PI * 2,
          vrot: (left ? 1 : -1) * (0.14 + Math.random() * 0.16),
          w: 44 + Math.random() * 30,
          col: cols[i % cols.length],
          suit: suits[i % 4]
        };
      });
    } else if (fx === 'prestige-rose') {
      const cols = ['#f5d061', '#e11d48', '#f8fafc', '#fbbf24'];
      for (let wave = 0; wave < 3; wave++) {
        for (let i = 0; i < 24; i++) {
          items.push({
            isDagger: true,
            delay: 140 + wave * 240,
            angle: (i / 24) * Math.PI * 2 + wave * 0.42,
            spin: (wave % 2 === 0 ? 1 : -1) * 0.045,
            radius: 18,
            speed: 17 + (i % 4) * 4 + wave * 2,
            size: 32 + (i % 3) * 10,
            col: i % 2 === 0 ? '#f5d061' : '#f8fafc',
            trailCol: i % 2 === 0 ? '#e11d48' : '#f5d061'
          });
        }
      }
      for (let p = 0; p < 48; p++) {
        items.push({
          isDagger: false,
          delay: 80 + Math.random() * 640,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() > 0.5 ? 1 : -1) * 0.03,
          radius: 20 + Math.random() * 90,
          speed: 6 + Math.random() * 10,
          size: 8 + Math.random() * 10,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.16,
          col: cols[p % cols.length]
        });
      }
    } else if (fx === 'arcane-fractured') {
      const cols = ['#ff2e97', '#00f0ff', '#ffe14d', '#f8fafc'];
      items = Array.from({ length: 54 }, (_, i) => ({
        delay: 180 + Math.random() * 240,
        angle: (i / 54) * Math.PI * 2 + (Math.random() - 0.5) * 0.25,
        radius: 10 + Math.random() * 45,
        speed: 12 + Math.random() * 20,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.26,
        size: 16 + Math.random() * 30,
        col: cols[i % cols.length]
      }));
    } else if (fx === 'kda-firestarter') {
      const cols = ['#ff3b5c', '#ff7a00', '#00f5ff', '#fde047'];
      items = Array.from({ length: 64 }, (_, i) => ({
        x: -160,
        y: H * 0.68,
        vx: -(5 + Math.random() * 12),
        vy: -(2 + Math.random() * 8),
        r: 2 + Math.random() * 5,
        col: cols[i % cols.length],
        life: 0,
        maxLife: 300 + Math.random() * 440
      }));
    } else if (fx === 'eve-firestarter') {
      const cols = ['#ff1e6b', '#ff7a00', '#a855f7', '#fde047'];
      items = Array.from({ length: 58 }, (_, i) => ({
        x: cx + (Math.random() - 0.5) * 300,
        y: cy + (Math.random() - 0.5) * 240,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -(3 + Math.random() * 8),
        r: 2 + Math.random() * 5,
        col: cols[i % cols.length]
      }));
    } else {
      items = Array.from({ length: 60 }, () => ({
        x: Math.random() * W,
        y: H + Math.random() * 180,
        r: 3 + Math.random() * 10,
        vy: 3 + Math.random() * 7,
        vx: (Math.random() - 0.5) * 1.8,
        col: Math.random() > 0.45 ? c1 : c2,
        alpha: 0.35 + Math.random() * 0.55
      }));
    }

    const akaliTrail = [];
    const akaliStars = Array.from({ length: 30 }, (_, i) => ({
      angle: (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.25,
      speed: 10 + Math.random() * 18,
      radius: 12 + Math.random() * 60,
      size: 12 + Math.random() * 28,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.08,
      col: i % 3 === 0 ? '#fde047' : (i % 3 === 1 ? '#ff2e97' : '#ff5a1f'),
      delay: 520 + Math.random() * 380
    }));

    function drawFourPointStar(x, y, r, rot, col, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 18;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? r : r * 0.22;
        const a = (i * Math.PI) / 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function frame(now) {
      const elapsed = Math.max(0, now - start);
      ctx.clearRect(0, 0, W, H);

      if (fx === 'crime-city') {
        for (const it of items) {
          it.x += it.vx; it.y += it.vy; it.rot += it.vrot;
          const h = it.w * 1.44;
          ctx.save();
          ctx.translate(it.x, it.y); ctx.rotate(it.rot);
          ctx.shadowBlur = 22; ctx.shadowColor = it.col;
          ctx.fillStyle = 'rgba(11,6,16,0.94)'; ctx.strokeStyle = it.col; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.roundRect(-it.w / 2, -h / 2, it.w, h, 6); ctx.fill(); ctx.stroke();
          ctx.fillStyle = it.col; ctx.font = '900 ' + Math.round(it.w * 0.52) + 'px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it.suit, 0, 2);
          ctx.restore();
        }
      } else if (fx === 'prestige-rose') {
        const vFade = elapsed < 220 ? elapsed / 220 : elapsed > 1280 ? Math.max(0, 1 - (elapsed - 1280) / 520) : 1;
        if (vFade > 0.01) {
          const spin = elapsed * 0.013;
          const rings = [
            { r: 110 + elapsed * 0.16, dir: 1, col: '#f5d061', w: 4, arcs: 4 },
            { r: 190 + elapsed * 0.24, dir: -1, col: '#e11d48', w: 5, arcs: 5 },
            { r: 280 + elapsed * 0.3, dir: 1, col: '#f8fafc', w: 3, arcs: 3 }
          ];
          for (const rg of rings) {
            for (let a = 0; a < rg.arcs; a++) {
              const sA = spin * rg.dir + (a * Math.PI * 2) / rg.arcs;
              ctx.save(); ctx.globalAlpha = vFade * 0.82; ctx.strokeStyle = rg.col; ctx.shadowColor = rg.col; ctx.shadowBlur = 20; ctx.lineWidth = rg.w; ctx.lineCap = 'round';
              ctx.beginPath(); ctx.arc(cx, cy, rg.r, sA, sA + 0.88); ctx.stroke(); ctx.restore();
            }
          }
        }
        for (const it of items) {
          if (elapsed < it.delay) continue;
          it.radius += it.speed; it.angle += it.spin;
          const x = cx + Math.cos(it.angle) * it.radius;
          const y = cy + Math.sin(it.angle) * it.radius;
          const fade = Math.max(0, 1 - Math.max(0, elapsed - 1320) / 480);
          if (fade <= 0.01) continue;
          ctx.save(); ctx.globalAlpha = 0.92 * fade;
          if (it.isDagger) {
            const pR = Math.max(0, it.radius - it.speed * 3);
            ctx.strokeStyle = it.trailCol; ctx.shadowColor = it.trailCol; ctx.shadowBlur = 14; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(cx + Math.cos(it.angle - it.spin * 3) * pR, cy + Math.sin(it.angle - it.spin * 3) * pR); ctx.lineTo(x, y); ctx.stroke();
            ctx.translate(x, y); ctx.rotate(it.angle + Math.atan2(it.spin * it.radius, it.speed));
            const s = it.size; ctx.fillStyle = it.col; ctx.shadowColor = it.col; ctx.shadowBlur = 18;
            ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.3, -s * 0.17); ctx.lineTo(-s * 0.58, 0); ctx.lineTo(-s * 0.3, s * 0.17); ctx.closePath(); ctx.fill();
          } else {
            it.rot += it.vrot; ctx.translate(x, y); ctx.rotate(it.rot); ctx.fillStyle = it.col; ctx.shadowColor = it.col; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.ellipse(0, 0, it.size * 1.35, it.size * 0.65, 0, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
      } else if (fx === 'dj-sona') {
        const env = elapsed < 240 ? elapsed / 240 : elapsed > 1320 ? Math.max(0, 1 - (elapsed - 1320) / 500) : 1;
        const cols = ['#00e5ff', '#ff2a6d', '#c084fc'];
        const bars = 32; const bw = W / bars;
        for (let i = 0; i < bars; i++) {
          const wave = Math.abs(Math.sin(elapsed * 0.012 + i * 0.42)) * 0.65 + Math.abs(Math.cos(elapsed * 0.008 - i * 0.25)) * 0.35;
          const barH = (H * 0.14 + wave * H * 0.34) * env;
          const col = cols[(i + Math.floor(elapsed / 260)) % 3];
          ctx.save(); ctx.globalAlpha = 0.85 * env; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 18;
          ctx.fillRect(i * bw + 3, H - barH, Math.max(5, bw - 6), barH);
          ctx.fillRect(i * bw + 3, 0, Math.max(5, bw - 6), barH * 0.72);
          ctx.restore();
        }
        for (let r = 0; r < 4; r++) {
          const t = elapsed - r * 220; if (t < 0) continue;
          ctx.save(); ctx.globalAlpha = Math.max(0, 1 - t / 1150) * env; ctx.strokeStyle = cols[r % 3]; ctx.shadowColor = cols[r % 3]; ctx.shadowBlur = 22; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(cx, cy, 30 + t * 0.65, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
      } else if (fx === 'arcane-fractured') {
        const cEnv = elapsed < 160 ? elapsed / 160 : elapsed > 960 ? Math.max(0, 1 - (elapsed - 960) / 420) : 1;
        const cCols = ['#ff2e97', '#00f0ff', '#ffe14d'];
        const maxLen = Math.min(W, H) * 0.9 * Math.min(1, elapsed / 320);
        for (let i = 0; i < 10; i++) {
          const bA = (i / 10) * Math.PI * 2 + 0.18;
          ctx.save(); ctx.globalAlpha = cEnv * 0.88; ctx.strokeStyle = cCols[i % 3]; ctx.shadowColor = cCols[i % 3]; ctx.shadowBlur = 18; ctx.lineWidth = i % 2 === 0 ? 3.5 : 2;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          for (let seg = 1; seg <= 4; seg++) {
            const r = (maxLen * seg) / 4; const j = (seg % 2 === 0 ? 0.09 : -0.09) * (i % 2 === 0 ? 1 : -1);
            ctx.lineTo(cx + Math.cos(bA + j) * r, cy + Math.sin(bA + j) * r);
          }
          ctx.stroke(); ctx.restore();
        }
        for (const s of items) {
          if (elapsed < s.delay) continue;
          s.radius += s.speed; s.rot += s.vrot;
          const fade = Math.max(0, 1 - Math.max(0, elapsed - 1280) / 500);
          if (fade <= 0.01) continue;
          ctx.save(); ctx.globalAlpha = 0.9 * fade; ctx.translate(cx + Math.cos(s.angle) * s.radius, cy + Math.sin(s.angle) * s.radius); ctx.rotate(s.rot);
          ctx.fillStyle = 'rgba(14,6,26,0.88)'; ctx.strokeStyle = s.col; ctx.shadowColor = s.col; ctx.shadowBlur = 18; ctx.lineWidth = 2.2;
          const sz = s.size; ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.76, sz * 0.18); ctx.lineTo(-sz * 0.58, sz * 0.82); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
        }
      } else if (fx === 'kda-firestarter') {
        const prog = Math.min(1, elapsed / 1780);
        const env = elapsed < 140 ? elapsed / 140 : elapsed > 1420 ? Math.max(0, 1 - (elapsed - 1420) / 400) : 1;
        const vpY = H * 0.54;
        const bgG = ctx.createRadialGradient(cx, vpY, 20, cx, vpY, W * 0.7);
        bgG.addColorStop(0, 'rgba(255,30,86,' + (0.28 * env).toFixed(3) + ')');
        bgG.addColorStop(0.5, 'rgba(28,6,20,' + (0.72 * env).toFixed(3) + ')');
        bgG.addColorStop(1, 'rgba(6,2,10,' + (0.88 * env).toFixed(3) + ')');
        ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);
        for (let a = 0; a < 7; a++) {
          const z = ((elapsed * 0.0014 + a / 7) % 1);
          ctx.save(); ctx.globalAlpha = Math.sin(z * Math.PI) * 0.85 * env;
          ctx.strokeStyle = a % 2 === 0 ? '#ff1e56' : '#ff2e97'; ctx.shadowColor = '#ff1e56'; ctx.shadowBlur = 22; ctx.lineWidth = 2 + z * 6;
          ctx.beginPath(); ctx.arc(cx, vpY + 40, 60 + Math.pow(z, 2.2) * (W * 0.85), Math.PI * 1.04, Math.PI * 1.96); ctx.stroke(); ctx.restore();
        }
        for (let l = 0; l < 12; l++) {
          const lA = (l / 12) * Math.PI * 2 + 0.12; const lP = ((elapsed * 0.0032 + l * 0.17) % 1);
          const r1 = 55 + lP * (W * 0.45); const r2 = r1 + 95 + lP * 150;
          ctx.save(); ctx.globalAlpha = (1 - lP) * 0.72 * env; ctx.strokeStyle = l % 2 === 0 ? '#ff2a55' : '#ff7a00'; ctx.shadowColor = '#ff2a55'; ctx.shadowBlur = 14; ctx.lineWidth = 2 + lP * 3;
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(lA) * r1, vpY + Math.sin(lA) * r1 * 0.65); ctx.lineTo(cx + Math.cos(lA) * r2, vpY + Math.sin(lA) * r2 * 0.65); ctx.stroke(); ctx.restore();
        }
        const carveX = cx + Math.sin(prog * Math.PI * 1.45 - 0.5) * (W * 0.24) + (prog - 0.5) * (W * 0.18);
        const zoomP = Math.sin(Math.min(1, prog * 1.15) * Math.PI);
        const depthSc = 0.52 + zoomP * 0.72;
        const skateY = H * 0.76 - Math.abs(Math.sin(elapsed * 0.017)) * 16 * depthSc + (zoomP - 0.5) * 28;
        const carveTilt = Math.cos(prog * Math.PI * 1.45 - 0.5) * 0.22 + Math.sin(elapsed * 0.015) * 0.08;
        akaliTrail.push({ x: carveX, y: skateY + 24 * depthSc });
        if (akaliTrail.length > 24) akaliTrail.shift();
        for (let i = 1; i < akaliTrail.length; i++) {
          const r = i / akaliTrail.length;
          ctx.save(); ctx.globalAlpha = r * 0.85 * env; ctx.strokeStyle = i % 2 === 0 ? '#ff2e97' : '#d946ef'; ctx.shadowColor = '#ff2e97'; ctx.shadowBlur = 22;
          ctx.lineWidth = (6 + r * 20) * depthSc; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(akaliTrail[i - 1].x, akaliTrail[i - 1].y); ctx.lineTo(akaliTrail[i].x, akaliTrail[i].y); ctx.stroke(); ctx.restore();
        }
        for (const sp of items) {
          if (sp.life <= 0 && Math.random() < 0.34) {
            sp.x = carveX + (Math.random() - 0.5) * 75 * depthSc; sp.y = skateY + 24 * depthSc;
            sp.vx = (Math.random() - 0.5) * 20 - carveTilt * 28; sp.vy = -(3 + Math.random() * 10); sp.life = sp.maxLife;
          }
          if (sp.life > 0) {
            sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.3; sp.life -= 16;
            ctx.save(); ctx.globalAlpha = Math.max(0, sp.life / sp.maxLife) * env; ctx.fillStyle = sp.col; ctx.shadowColor = sp.col; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          }
        }
        ctx.save(); ctx.globalAlpha = env; ctx.translate(carveX, skateY); ctx.scale(depthSc, depthSc); ctx.rotate(carveTilt);
        const dW = 190;
        ctx.fillStyle = '#0c0714'; ctx.strokeStyle = '#ff1e56'; ctx.shadowColor = '#ff2e97'; ctx.shadowBlur = 24; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(-dW / 2, 10, dW, 18, 9); ctx.fill(); ctx.stroke();
        const wSpin = elapsed * 0.032;
        for (const wx of [-56, 56]) {
          ctx.save(); ctx.translate(wx, 34); ctx.rotate(wSpin);
          ctx.fillStyle = '#120518'; ctx.strokeStyle = '#ff2e97'; ctx.shadowColor = '#ff2e97'; ctx.shadowBlur = 16; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
        }
        ctx.save(); ctx.translate(Math.sin(elapsed * 0.022) * 10, 12); ctx.scale(1, 1 + Math.sin(elapsed * 0.032) * 0.05);
        ctx.shadowColor = '#ff2e97'; ctx.shadowBlur = 28;
        if (akaliSkateImg.complete && akaliSkateImg.naturalWidth > 0) {
          const drawH = 300; const drawW = drawH * (akaliSkateImg.naturalWidth / akaliSkateImg.naturalHeight);
          ctx.drawImage(akaliSkateImg, -drawW / 2, -drawH + 14, drawW, drawH);
        }
        ctx.restore(); ctx.restore();
        for (const st of akaliStars) {
          if (elapsed < st.delay) continue;
          st.radius += st.speed; st.rot += st.vrot;
          const sFade = Math.max(0, 1 - Math.max(0, elapsed - 1340) / 440) * env;
          if (sFade > 0.02) drawFourPointStar(cx + Math.cos(st.angle) * st.radius, vpY + Math.sin(st.angle) * st.radius * 0.72, st.size, st.rot, st.col, sFade);
        }
      } else if (fx === 'eve-firestarter') {
        const env = elapsed < 200 ? elapsed / 200 : elapsed > 1340 ? Math.max(0, 1 - (elapsed - 1340) / 480) : 1;
        const openP = Math.max(0, Math.min(1, (elapsed - 260) / 480));
        const riseP = Math.max(0, Math.min(1, (elapsed - 460) / 620));
        const cw = 300; const ch = 520;
        ctx.save(); ctx.globalAlpha = env;
        drawCoffinShape(ctx, cx, cy, cw, ch);
        const iG = ctx.createLinearGradient(cx, cy - ch * 0.5, cx, cy + ch * 0.5);
        iG.addColorStop(0, openP > 0.1 ? 'rgba(255,30,107,0.78)' : 'rgba(18,5,16,0.96)');
        iG.addColorStop(0.5, openP > 0.1 ? 'rgba(255,122,0,0.58)' : 'rgba(10,4,14,0.98)');
        iG.addColorStop(1, 'rgba(12,3,14,0.98)');
        ctx.fillStyle = iG; ctx.fill(); ctx.strokeStyle = '#ff1e6b'; ctx.shadowColor = '#ff1e6b'; ctx.shadowBlur = 24; ctx.lineWidth = 3.5; ctx.stroke(); ctx.restore();
        if (riseP > 0.02) {
          ctx.save(); ctx.globalAlpha = Math.min(1, riseP * 1.4) * env;
          ctx.translate(cx, cy - 12 + (1 - riseP) * 120); ctx.scale(0.65 + riseP * 0.22, 0.65 + riseP * 0.22);
          for (const side of [-1, 1]) {
            ctx.strokeStyle = '#ff1e6b'; ctx.shadowColor = '#ff1e6b'; ctx.shadowBlur = 22; ctx.lineWidth = 7; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(side * 20, 60); ctx.bezierCurveTo(side * (100 + riseP * 100), 15, side * (140 + riseP * 130), -110, side * (200 + riseP * 90), -180); ctx.stroke();
          }
          ctx.fillStyle = 'rgba(12,3,14,0.94)'; ctx.strokeStyle = '#ff7a00'; ctx.lineWidth = 2.4;
          ctx.beginPath(); ctx.arc(0, -115, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-42, -74); ctx.quadraticCurveTo(0, -90, 42, -74); ctx.lineTo(54, 110); ctx.lineTo(-54, 110); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.ellipse(-11, -116, 7, 2.8, 0.18, 0, Math.PI * 2); ctx.ellipse(11, -116, 7, 2.8, -0.18, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.save(); ctx.globalAlpha = env * Math.max(0.12, 1 - openP * 0.85);
        ctx.translate(cx + openP * cw * 0.92, cy - openP * 32); ctx.rotate(openP * 0.18);
        drawCoffinShape(ctx, 0, 0, cw, ch); ctx.fillStyle = 'rgba(14,5,18,0.94)'; ctx.fill(); ctx.strokeStyle = '#a855f7'; ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 20; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        for (const e of items) {
          if (elapsed > 240) { e.x += e.vx; e.y += e.vy; }
          ctx.save(); ctx.globalAlpha = 0.85 * env; ctx.fillStyle = e.col; ctx.shadowColor = e.col; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      } else {
        for (const b of items) {
          b.y -= b.vy; b.x += b.vx;
          ctx.save(); ctx.globalAlpha = b.alpha; ctx.strokeStyle = b.col; ctx.fillStyle = b.col; ctx.shadowBlur = 12; ctx.shadowColor = b.col; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = b.alpha * 0.25; ctx.fill(); ctx.restore();
        }
      }
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);
    endTimer = setTimeout(() => {
      stage.classList.remove('playing');
      stopAnim();
      ctx.clearRect(0, 0, W, H);
    }, 1850);
  }

  window.openOmniTransitionPreview = function openOmniTransitionPreview(pack) {
    activePack = pack || { id: 'none', name: 'Standard Transition', icon: '⚡', effect: 'none', colors: {} };
    const m = ensureModal();
    m.querySelector('#otpIcon').textContent = activePack.icon || '✨';
    m.querySelector('#otpName').textContent = (activePack.name || 'Scene Transition') + ' — Transition Preview';
    m.classList.add('open');
    runAnimation(activePack);
  };
})();
