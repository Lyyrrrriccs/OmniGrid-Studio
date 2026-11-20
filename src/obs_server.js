const http = require('http');
const WebSocket = require('ws');

const OBS_OVERLAY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniChat OBS Stream-Overlay</title>
  <style>
    :root {
      --name-size: 14px;
      --msg-size: 14px;
      --msg-pad-v: 4px;
      --msg-pad-h: 8px;
      --msg-gap: 0px;
      --sep-display: 1px;
      --sep-color: rgba(255, 255, 255, 0.10);
      --chat-bg: rgba(11, 15, 25, 0.0);
      --item-bg: rgba(13, 17, 26, 0.65);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--chat-bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 8px;
    }
    #pinnedBox {
      position: fixed;
      top: 8px;
      left: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.94);
      border: 2px solid #f59e0b;
      border-radius: 10px;
      padding: 8px 12px;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
      display: none;
      z-index: 50;
    }
    #pinnedBox.active { display: block; }
    .pin-label {
      font-size: 9.5px;
      font-weight: 800;
      color: #fbbf24;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    #chatList {
      display: flex;
      flex-direction: column;
      gap: var(--msg-gap);
      max-height: 94vh;
      overflow: hidden;
      justify-content: flex-end;
    }
    .msg-row {
      padding: var(--msg-pad-v) var(--msg-pad-h);
      font-size: var(--msg-size);
      line-height: 1.38;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      border-bottom: var(--sep-display) solid var(--sep-color);
      background: var(--item-bg);
    }
    body.style-bubbles .msg-row {
      border-radius: 8px;
      border-left: 3px solid #9146ff;
      border-bottom: none;
      margin-bottom: 4px;
    }
    body.style-bubbles .msg-row.twitch { border-left-color: #9146ff; }
    body.style-bubbles .msg-row.youtube { border-left-color: #ff0033; }
    body.style-bubbles .msg-row.tiktok { border-left-color: #00f2fe; }
    .msg-row.highlight {
      background: rgba(245, 158, 11, 0.24) !important;
      border-left: 3px solid #fbbf24;
    }
    .time {
      font-size: 0.8em;
      color: #94a3b8;
      margin-right: 5px;
    }
    body.hide-timestamps .time { display: none; }
    .plat-icon {
      display: inline-block;
      font-size: 0.85em;
      font-weight: 800;
      margin-right: 5px;
      vertical-align: baseline;
    }
    body.hide-platicons .plat-icon { display: none; }
    .plat-tag {
      display: inline-block;
      font-size: 0.72em;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .plat-tag.twitch { background: #9146ff; color: #fff; }
    .plat-tag.youtube { background: #ff0033; color: #fff; }
    .plat-tag.tiktok { background: #00f2fe; color: #000; }
    .author {
      font-size: var(--name-size);
      font-weight: 800;
      margin-right: 5px;
    }
    .badge {
      font-size: 0.72em;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.16);
      padding: 1px 4px;
      border-radius: 3px;
      margin-right: 4px;
    }
    .emote-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      height: 1.2em;
      line-height: 1;
      margin: 0 2px;
    }
    .emote-img {
      max-height: 1.45em;
      height: 1.45em;
      width: auto;
      vertical-align: middle;
      margin: -0.2em 0;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div id="pinnedBox">
    <div class="pin-label">📌 GEPINNTE NACHRICHT</div>
    <div id="pinnedContent"></div>
  </div>
  <div id="chatList"></div>

  <script>
    const chatList = document.getElementById('chatList');
    const pinnedBox = document.getElementById('pinnedBox');
    const pinnedContent = document.getElementById('pinnedContent');
    let appearance = {
      layoutMode: 'inline',
      nameFontSize: 13,
      msgFontSize: 13,
      maxNameLength: 16,
      showPlatformIcons: true,
      platformIndicatorStyle: 'icon_only',
      showTimestamps: false,
      msgPadding: 4,
      showSeparator: true,
      sepColor: '#ffffff',
      sepOpacity: 10,
      usernameColorMode: 'user'
    };
    let cachedMessages = [];

    function hexToRgba(hex, alphaPercent) {
      const clean = (hex || '#ffffff').replace('#', '');
      const num = parseInt(clean, 16) || 0xffffff;
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return 'rgba(' + r + ',' + g + ',' + b + ',' + (alphaPercent / 100).toFixed(2) + ')';
    }

    function applyAppearance(cfg) {
      if (!cfg) return;
      appearance = { ...appearance, ...cfg };
      const root = document.documentElement;
      root.style.setProperty('--name-size', (appearance.nameFontSize || 13) + 'px');
      root.style.setProperty('--msg-size', (appearance.msgFontSize || 13) + 'px');
      root.style.setProperty('--msg-pad-v', (appearance.msgPadding ?? 4) + 'px');
      root.style.setProperty('--msg-gap', appearance.layoutMode === 'bubbles' ? (appearance.msgPadding ?? 4) + 'px' : '0px');
      root.style.setProperty('--sep-display', appearance.showSeparator !== false ? '1px' : '0px');
      root.style.setProperty('--sep-color', hexToRgba(appearance.sepColor || '#ffffff', appearance.sepOpacity ?? 10));
      root.style.setProperty('--item-bg', hexToRgba(appearance.bgColor || '#0b0f19', appearance.obsBgOpacity ?? 65));

      document.body.classList.toggle('style-bubbles', appearance.layoutMode === 'bubbles');
      document.body.classList.toggle('hide-timestamps', !appearance.showTimestamps);
      document.body.classList.toggle('hide-platicons', appearance.showPlatformIcons === false);
      rerenderAll();
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function truncateName(name) {
      const s = String(name || 'User');
      const max = Number(appearance.maxNameLength || 18);
      if (max > 0 && s.length > max) {
        return s.slice(0, max) + '…';
      }
      return s;
    }

    function resolveAuthorColor(m) {
      if (appearance.usernameColorMode === 'mono') return '#e2e8f0';
      if (appearance.usernameColorMode === 'platform') {
        return m.platform === 'twitch' ? '#a970ff' : m.platform === 'youtube' ? '#ff4e45' : '#00f2fe';
      }
      return m.color || '#a970ff';
    }

    function renderPlatBadge(plat) {
      const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
      const ic = icons[plat] || '💬';
      if (appearance.platformIndicatorStyle === 'icon_only') {
        return '<span class="plat-icon">' + ic + '</span>';
      }
      return '<span class="plat-icon"><span class="plat-tag ' + plat + '">' + ic + ' ' + plat + '</span></span>';
    }

    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens
          .map((t) =>
            t.type === 'emote'
              ? '<span class="emote-wrap"><img class="emote-img" src="' + t.url + '" alt="' + escapeHtml(t.name) + '" /></span>'
              : escapeHtml(t.text)
          )
          .join('');
      }
      return escapeHtml(m.text);
    }

    function renderMessageInner(m) {
      const d = new Date(m.timestamp || Date.now());
      const tStr = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const badges = (m.badges || [])
        .map(b => '<span class="badge">' + escapeHtml(b) + '</span>')
        .join('');
      return (
        '<span class="time">' + tStr + '</span>' +
        renderPlatBadge(m.platform) +
        badges +
        '<span class="author" style="color:' + resolveAuthorColor(m) + '">' + escapeHtml(truncateName(m.author)) + ':</span>' +
        '<span class="text">' + renderTokens(m) + '</span>'
      );
    }

    function rerenderAll() {
      chatList.innerHTML = '';
      for (const m of cachedMessages.slice(-40)) {
        const div = document.createElement('div');
        div.className = 'msg-row ' + m.platform + (m.isHighlight ? ' highlight' : '');
        div.dataset.id = m.id;
        div.dataset.author = (m.author || '').toLowerCase();
        div.innerHTML = renderMessageInner(m);
        chatList.appendChild(div);
      }
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload.type === 'appearance') {
            applyAppearance(payload.data);
          } else if (payload.type === 'chat') {
            const m = payload.data;
            cachedMessages.push(m);
            if (cachedMessages.length > 60) cachedMessages.shift();
            const div = document.createElement('div');
            div.className = 'msg-row ' + m.platform + (m.isHighlight ? ' highlight' : '');
            div.dataset.id = m.id;
            div.dataset.author = (m.author || '').toLowerCase();
            div.innerHTML = renderMessageInner(m);
            chatList.appendChild(div);
            while (chatList.children.length > 40) {
              chatList.removeChild(chatList.firstChild);
            }
          } else if (payload.type === 'delete-msg') {
            cachedMessages = cachedMessages.filter(x => x.id !== payload.id);
            rerenderAll();
          } else if (payload.type === 'delete-user') {
            const low = (payload.author || '').toLowerCase();
            cachedMessages = cachedMessages.filter(x => (x.author || '').toLowerCase() !== low);
            rerenderAll();
          } else if (payload.type === 'pin') {
            const m = payload.data;
            if (m) {
              pinnedContent.innerHTML = renderMessageInner(m);
              pinnedBox.classList.add('active');
            } else {
              pinnedBox.classList.remove('active');
            }
          } else if (payload.type === 'clear') {
            cachedMessages = [];
            chatList.innerHTML = '';
            pinnedBox.classList.remove('active');
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

/**
 * Interactive OBS Custom Browser Dock HTML (/dock)
 * Works completely independently of OBS scenes inside OBS -> View -> Docks -> Custom Browser Docks!
 * Supports live status, filters, auto-scroll pause, user quick-menu, pinning, and replying via WebSocket!
 */
const OBS_CUSTOM_DOCK_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OmniStream Chat — OBS Custom Dock</title>
  <style>
    :root {
      --name-size: 13px;
      --msg-size: 13.5px;
      --msg-pad-v: 5px;
      --sep-display: 1px;
      --sep-color: rgba(255, 255, 255, 0.08);
      --chat-bg: #0b0f19;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--chat-bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .dock-header {
      background: #111827;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 5px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      flex-wrap: wrap;
    }
    .dock-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .status-dots {
      display: flex;
      gap: 6px;
      font-size: 10px;
      color: #94a3b8;
    }
    .s-pill { display: flex; align-items: center; gap: 3px; }
    .s-dot { width: 6px; height: 6px; border-radius: 50%; background: #64748b; }
    .s-pill.connected .s-dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .s-pill.standby .s-dot, .s-pill.reconnecting .s-dot { background: #f59e0b; }

    .dock-filters {
      display: flex;
      gap: 3px;
      padding: 4px 6px;
      background: rgba(17, 24, 39, 0.75);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      overflow-x: auto;
    }
    .f-btn {
      background: rgba(255,255,255,0.05);
      color: #94a3b8;
      border: 1px solid rgba(255,255,255,0.08);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .f-btn.active {
      background: rgba(56, 189, 248, 0.2);
      color: #fff;
      border-color: #38bdf8;
    }
    #pinnedBox {
      background: rgba(245, 158, 11, 0.16);
      border-bottom: 2px solid #f59e0b;
      padding: 5px 8px;
      font-size: 12px;
      display: none;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
    }
    #pinnedBox.active { display: flex; }
    .unpin-btn {
      background: rgba(0,0,0,0.4);
      color: #fde68a;
      border: 1px solid rgba(251,191,36,0.4);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 10px;
      cursor: pointer;
    }
    .feed-wrap {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #chatList {
      flex: 1;
      overflow-y: auto;
      padding: 2px 0;
      display: flex;
      flex-direction: column;
    }
    .resume-btn {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 10.5px;
      font-weight: 800;
      cursor: pointer;
      display: none;
      box-shadow: 0 6px 18px rgba(0,0,0,0.6);
    }
    .resume-btn.show { display: block; }
    .msg-row {
      position: relative;
      padding: var(--msg-pad-v) 8px;
      font-size: var(--msg-size);
      line-height: 1.36;
      border-bottom: var(--sep-display) solid var(--sep-color);
      border-left: 3px solid transparent;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }
    .msg-row.twitch { border-left-color: rgba(145, 70, 255, 0.7); }
    .msg-row.youtube { border-left-color: rgba(255, 0, 51, 0.7); }
    .msg-row.tiktok { border-left-color: rgba(0, 242, 254, 0.7); }
    .msg-row.highlight { background: rgba(245, 158, 11, 0.16); border-left-color: #f59e0b; }
    .msg-row.mention { background: rgba(16, 185, 129, 0.15); border-left-color: #10b981; }
    .time { font-size: 0.78em; color: #64748b; margin-right: 4px; }
    body.hide-timestamps .time { display: none; }
    .plat-icon { margin-right: 4px; font-size: 0.88em; }
    body.hide-platicons .plat-icon { display: none; }
    .author { font-size: var(--name-size); font-weight: 800; margin-right: 4px; cursor: pointer; }
    .author:hover { text-decoration: underline; }
    .badge {
      font-size: 0.72em;
      font-weight: 700;
      background: rgba(255,255,255,0.12);
      padding: 0 4px;
      border-radius: 3px;
      margin-right: 4px;
    }
    .emote-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      height: 1.2em;
      line-height: 1;
      margin: 0 2px;
    }
    .emote-img {
      max-height: 1.45em;
      height: 1.45em;
      width: auto;
      vertical-align: middle;
      margin: -0.2em 0;
    }
    .row-actions {
      position: absolute;
      top: 50%;
      right: 4px;
      transform: translateY(-50%);
      display: none;
      gap: 2px;
      background: rgba(15, 23, 42, 0.92);
      padding: 1px 4px;
      border-radius: 5px;
      border: 1px solid rgba(255,255,255,0.14);
    }
    .msg-row:hover .row-actions { display: flex; }
    .act-btn {
      background: transparent;
      border: none;
      color: #fbbf24;
      font-size: 10.5px;
      padding: 1px 4px;
      cursor: pointer;
    }
    .reply-bar {
      display: flex;
      gap: 4px;
      padding: 6px;
      background: #111827;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .reply-bar input {
      flex: 1;
      min-width: 0;
      background: #0b0f19;
      border: 1px solid rgba(255,255,255,0.14);
      color: #fff;
      padding: 5px 8px;
      border-radius: 5px;
      font-size: 11.5px;
      outline: none;
    }
    .reply-bar button {
      background: #9146ff;
      color: #fff;
      border: none;
      padding: 0 10px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="dock-header">
    <div class="dock-title">⚡ OmniChat Dock <span id="totalViewers" style="color:#34d399;"></span></div>
    <div class="status-dots">
      <span class="s-pill" id="sp_twitch"><span class="s-dot"></span>TW</span>
      <span class="s-pill" id="sp_youtube"><span class="s-dot"></span>YT</span>
      <span class="s-pill" id="sp_tiktok"><span class="s-dot"></span>TT</span>
    </div>
  </div>
  <div class="dock-filters">
    <button class="f-btn active" data-f="all">Alle</button>
    <button class="f-btn" data-f="mentions">🔔 @Mich</button>
    <button class="f-btn" data-f="highlights">⭐ Events</button>
    <button class="f-btn" data-f="twitch">TW</button>
    <button class="f-btn" data-f="youtube">YT</button>
    <button class="f-btn" data-f="tiktok">TT</button>
  </div>
  <div id="pinnedBox">
    <div id="pinnedContent"></div>
    <button class="unpin-btn" id="btnUnpin">✕</button>
  </div>
  <div class="feed-wrap">
    <div id="chatList"></div>
    <button class="resume-btn" id="btnResume">⬇️ Neue Nachrichten</button>
  </div>
  <div class="reply-bar">
    <input type="text" id="inputReply" placeholder="In Chat schreiben (Enter)..." />
    <button id="btnSend">↵</button>
  </div>

  <script>
    const chatList = document.getElementById('chatList');
    const btnResume = document.getElementById('btnResume');
    const pinnedBox = document.getElementById('pinnedBox');
    const pinnedContent = document.getElementById('pinnedContent');
    const inputReply = document.getElementById('inputReply');
    let ws = null;
    let cachedMessages = [];
    let activeFilter = 'all';
    let pausedScroll = false;
    let appearance = { nameFontSize: 13, msgFontSize: 13.5, maxNameLength: 16, msgPadding: 5, showSeparator: true, sepColor: '#ffffff', sepOpacity: 8, usernameColorMode: 'user' };

    function escapeHtml(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function hexToRgba(hex, alphaPercent) {
      const clean = (hex || '#ffffff').replace('#', '');
      const num = parseInt(clean, 16) || 0xffffff;
      return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + (alphaPercent / 100).toFixed(2) + ')';
    }
    function applyAppearance(cfg) {
      if (!cfg) return;
      appearance = { ...appearance, ...cfg };
      const r = document.documentElement;
      r.style.setProperty('--name-size', (appearance.nameFontSize || 13) + 'px');
      r.style.setProperty('--msg-size', (appearance.msgFontSize || 13.5) + 'px');
      r.style.setProperty('--msg-pad-v', (appearance.msgPadding ?? 5) + 'px');
      r.style.setProperty('--sep-display', appearance.showSeparator !== false ? '1px' : '0px');
      r.style.setProperty('--sep-color', hexToRgba(appearance.sepColor || '#ffffff', appearance.sepOpacity ?? 8));
      document.body.classList.toggle('hide-timestamps', !appearance.showTimestamps);
      document.body.classList.toggle('hide-platicons', appearance.showPlatformIcons === false);
      rerender();
    }
    function truncateName(n) {
      const s = String(n || 'User');
      const m = Number(appearance.maxNameLength || 16);
      return m > 0 && s.length > m ? s.slice(0, m) + '…' : s;
    }
    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens.map(t => t.type === 'emote' ? '<span class="emote-wrap"><img class="emote-img" src="' + t.url + '" alt="' + escapeHtml(t.name) + '" /></span>' : escapeHtml(t.text)).join('');
      }
      return escapeHtml(m.text);
    }
    function renderInner(m) {
      const d = new Date(m.timestamp || Date.now());
      const tStr = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
      const badges = (m.badges || []).map(b => '<span class="badge">' + escapeHtml(b) + '</span>').join('');
      return '<span class="time">' + tStr + '</span><span class="plat-icon">' + (icons[m.platform] || '💬') + '</span>' + badges +
        '<span class="author" style="color:' + (m.color || '#38bdf8') + '">' + escapeHtml(truncateName(m.author)) + ':</span>' +
        '<span class="text">' + renderTokens(m) + '</span>';
    }
    function matches(m) {
      if (activeFilter === 'mentions') return Boolean(m.isMention);
      if (activeFilter === 'highlights') return Boolean(m.isHighlight);
      if (activeFilter !== 'all' && m.platform !== activeFilter) return false;
      return true;
    }
    function createRow(m) {
      const div = document.createElement('div');
      div.className = 'msg-row ' + m.platform + (m.isHighlight ? ' highlight' : '') + (m.isMention ? ' mention' : '');
      div.innerHTML = renderInner(m) + '<div class="row-actions"><button class="act-btn pin-b" title="In OBS pinnen">📌</button><button class="act-btn del-b" title="Löschen">🗑️</button></div>';
      div.querySelector('.author').onclick = () => { inputReply.value = '@' + m.author + ' '; inputReply.focus(); };
      div.querySelector('.pin-b').onclick = () => ws?.send(JSON.stringify({ action: 'pin', data: m }));
      div.querySelector('.del-b').onclick = () => ws?.send(JSON.stringify({ action: 'delete-msg', id: m.id }));
      return div;
    }
    function rerender() {
      chatList.innerHTML = '';
      cachedMessages.filter(matches).slice(-120).forEach(m => chatList.appendChild(createRow(m)));
      if (!pausedScroll) chatList.scrollTop = chatList.scrollHeight;
    }
    chatList.addEventListener('scroll', () => {
      const dist = chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight;
      pausedScroll = dist > 45;
      btnResume.classList.toggle('show', pausedScroll);
    });
    btnResume.onclick = () => { pausedScroll = false; btnResume.classList.remove('show'); chatList.scrollTop = chatList.scrollHeight; };
    document.querySelectorAll('.f-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.f;
        rerender();
      };
    });
    document.getElementById('btnUnpin').onclick = () => ws?.send(JSON.stringify({ action: 'pin', data: null }));
    function sendChat() {
      const txt = inputReply.value.trim();
      if (!txt || !ws) return;
      ws.send(JSON.stringify({ action: 'send-chat', text: txt }));
      inputReply.value = '';
    }
    document.getElementById('btnSend').onclick = sendChat;
    inputReply.onkeydown = (e) => { if (e.key === 'Enter') sendChat(); };

    function connectWs() {
      ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'appearance') applyAppearance(p.data);
          else if (p.type === 'status') {
            let tot = 0;
            ['twitch', 'youtube', 'tiktok'].forEach(k => {
              const s = p.data?.[k] || {};
              const el = document.getElementById('sp_' + k);
              if (el) el.className = 's-pill ' + (s.status || '');
              if (s.status === 'connected') tot += Number(s.viewers || 0);
            });
            document.getElementById('totalViewers').textContent = tot > 0 ? '👁️ ' + tot : '';
          } else if (p.type === 'chat') {
            cachedMessages.push(p.data);
            if (cachedMessages.length > 200) cachedMessages.shift();
            if (matches(p.data)) {
              chatList.appendChild(createRow(p.data));
              if (!pausedScroll) chatList.scrollTop = chatList.scrollHeight;
            }
          } else if (p.type === 'delete-msg') {
            cachedMessages = cachedMessages.filter(x => x.id !== p.id);
            rerender();
          } else if (p.type === 'delete-user') {
            const low = (p.author || '').toLowerCase();
            cachedMessages = cachedMessages.filter(x => (x.author || '').toLowerCase() !== low);
            rerender();
          } else if (p.type === 'pin') {
            if (p.data) { pinnedContent.innerHTML = renderInner(p.data); pinnedBox.classList.add('active'); }
            else pinnedBox.classList.remove('active');
          } else if (p.type === 'clear') {
            cachedMessages = []; chatList.innerHTML = ''; pinnedBox.classList.remove('active');
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_SPOTIFY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniStream Spotify Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      padding: 8px;
      overflow: hidden;
    }
    .sp-card {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(29, 185, 84, 0.5);
      border-left: 4px solid #1db954;
      border-radius: 10px;
      padding: 8px 14px 8px 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      max-width: 420px;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .sp-card.paused { opacity: 0.45; }
    .sp-card.hidden { opacity: 0; transform: translateY(8px); pointer-events: none; }
    .sp-cover {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      object-fit: cover;
      background: #1db954;
      flex-shrink: 0;
    }
    .sp-cover-fallback {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      background: rgba(29, 185, 84, 0.2);
      border: 1px solid rgba(29, 185, 84, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .sp-meta { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .sp-tag { font-size: 9.5px; font-weight: 800; color: #1db954; text-transform: uppercase; letter-spacing: 0.5px; }
    .sp-title { font-size: 14px; font-weight: 800; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-artist { font-size: 12px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <div class="sp-card hidden" id="spCard">
    <img class="sp-cover" id="spCover" style="display:none;" alt="" />
    <div class="sp-cover-fallback" id="spFallback">🎵</div>
    <div class="sp-meta">
      <span class="sp-tag" id="spTag">SPOTIFY • LIVE</span>
      <strong class="sp-title" id="spTitle">-</strong>
      <span class="sp-artist" id="spArtist">-</span>
    </div>
  </div>
  <script>
    const card = document.getElementById('spCard');
    const cover = document.getElementById('spCover');
    const fallback = document.getElementById('spFallback');
    const tag = document.getElementById('spTag');
    const title = document.getElementById('spTitle');
    const artist = document.getElementById('spArtist');

    function renderTrack(t) {
      if (!t || !t.running || !t.title) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      card.classList.toggle('paused', !t.playing);
      tag.textContent = t.playing ? 'SPOTIFY • NOW PLAYING' : 'SPOTIFY • PAUSIERT';
      title.textContent = t.title;
      artist.textContent = t.artist || 'Spotify';
      if (t.artworkUrl) {
        cover.src = t.artworkUrl;
        cover.style.display = 'block';
        fallback.style.display = 'none';
      } else {
        cover.style.display = 'none';
        fallback.style.display = 'flex';
      }
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'spotify') renderTrack(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_TABLET_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <title>OmniStream Tablet Companion</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background: #0b0f19;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .tb-header {
      background: #111827;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tb-brand { font-size: 14px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
    .tb-pills { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .tb-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 700; padding: 4px 8px;
      border-radius: 99px; background: rgba(255,255,255,0.06); color: #cbd5e1;
    }
    .tb-dot { width: 7px; height: 7px; border-radius: 50%; background: #64748b; }
    .tb-pill.connected .tb-dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .tb-sp-pill {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(29, 185, 84, 0.16); border: 1px solid rgba(29, 185, 84, 0.45);
      color: #86efac; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 700;
      max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tb-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: row;
    }
    @media (max-width: 760px) {
      .tb-main { flex-direction: column; }
      .tb-deck { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1); max-height: 210px; overflow-y: auto; }
    }
    .tb-deck {
      width: 270px;
      flex-shrink: 0;
      background: #0f172a;
      border-right: 1px solid rgba(255,255,255,0.1);
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      align-content: start;
      overflow-y: auto;
    }
    .deck-btn {
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      color: #f8fafc;
      padding: 12px 8px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      text-align: center;
      min-height: 62px;
      transition: transform 0.08s ease, background 0.12s ease;
    }
    .deck-btn:active { transform: scale(0.95); background: rgba(56, 189, 248, 0.25); }
    .deck-btn.sp { border-color: rgba(29, 185, 84, 0.45); background: rgba(29, 185, 84, 0.14); }
    .deck-btn.warn { border-color: rgba(245, 158, 11, 0.45); color: #fde68a; }
    .deck-btn .ic { font-size: 19px; }

    .tb-chat-wrap {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .tb-pinned {
      background: rgba(245, 158, 11, 0.16);
      border-bottom: 1px solid rgba(245, 158, 11, 0.4);
      padding: 8px 12px;
      font-size: 13px;
      display: none;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .tb-pinned.active { display: flex; }
    .tb-feed {
      flex: 1;
      overflow-y: auto;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tb-msg {
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      border-left: 3.5px solid #9146ff;
      font-size: 15px;
      line-height: 1.4;
      word-break: break-word;
    }
    .tb-msg.youtube { border-left-color: #ff0033; }
    .tb-msg.tiktok { border-left-color: #00f2fe; }
    .tb-msg.highlight { background: rgba(245, 158, 11, 0.16); border-left-color: #f59e0b; }
    .tb-msg img.emote { height: 1.45em; vertical-align: middle; margin: 0 2px; }
    .tb-author { font-weight: 800; margin-right: 6px; }
    .tb-reply-bar {
      display: flex;
      gap: 8px;
      padding: 8px 10px;
      background: #111827;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .tb-reply-bar input {
      flex: 1;
      min-width: 0;
      background: #0b0f19;
      border: 1px solid rgba(255,255,255,0.16);
      color: #fff;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .tb-send {
      background: #9146ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }
    .tb-sheet {
      position: fixed;
      bottom: 66px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.98);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      padding: 10px;
      display: none;
      gap: 8px;
      box-shadow: 0 14px 36px rgba(0,0,0,0.8);
      z-index: 99;
      flex-wrap: wrap;
      max-width: 92vw;
    }
    .tb-sheet.open { display: flex; }
    .sheet-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .sheet-btn.warn { background: rgba(239, 68, 68, 0.28); color: #fecaca; }
  </style>
</head>
<body>
  <header class="tb-header">
    <div class="tb-brand">⚡ OmniStream Tablet</div>
    <div class="tb-pills">
      <span class="tb-sp-pill" id="tbSpotify">🎵 Spotify: Warte...</span>
      <span class="tb-pill" id="tbTw"><span class="tb-dot"></span>TW <strong id="tbTwV">0</strong></span>
      <span class="tb-pill" id="tbYt"><span class="tb-dot"></span>YT <strong id="tbYtV">0</strong></span>
      <span class="tb-pill" id="tbTt"><span class="tb-dot"></span>TT <strong id="tbTtV">0</strong></span>
    </div>
  </header>

  <div class="tb-main">
    <aside class="tb-deck">
      <button class="deck-btn" onclick="sdApi('/pin-last')"><span class="ic">📌</span>Letzte pinnen</button>
      <button class="deck-btn warn" onclick="sdApi('/unpin')"><span class="ic">❌</span>OBS-Pin aus</button>
      <button class="deck-btn warn" onclick="sdApi('/clear-chat')"><span class="ic">🗑️</span>Chat leeren</button>
      <button class="deck-btn" onclick="sdApi('/toggle-compact')"><span class="ic">↕️</span>Kompakt</button>
      <button class="deck-btn sp" onclick="sdApi('/spotify-playpause')"><span class="ic">⏯</span>Play / Pause</button>
      <button class="deck-btn sp" onclick="sdApi('/spotify-next')"><span class="ic">⏭</span>Nächster Song</button>
      <button class="deck-btn sp" onclick="sdApi('/spotify-announce')"><span class="ic">📢</span>Song in Chat</button>
      <button class="deck-btn" onclick="sdApi('/send?text=GG!')"><span class="ic">💬</span>Sende GG!</button>
      <button class="deck-btn" onclick="sdApi('/send?text=!discord')"><span class="ic">🎮</span>!discord</button>
      <button class="deck-btn" onclick="sdApi('/toggle-poll')"><span class="ic">🗳️</span>Poll Ein/Aus</button>
      <button class="deck-btn" onclick="sdApi('/reconnect?platform=all')"><span class="ic">↻</span>Reconnect</button>
    </aside>

    <main class="tb-chat-wrap">
      <div class="tb-pinned" id="tbPinned">
        <span id="tbPinnedText"></span>
        <button class="sheet-btn" onclick="sdApi('/unpin')">✕</button>
      </div>
      <div class="tb-feed" id="tbFeed"></div>
      <footer class="tb-reply-bar">
        <input type="text" id="tbInput" placeholder="Als Streamer schreiben..." />
        <button class="tb-send" id="tbSend">Senden</button>
      </footer>
    </main>
  </div>

  <div class="tb-sheet" id="tbSheet">
    <button class="sheet-btn" id="shPin">📌 In OBS pinnen</button>
    <button class="sheet-btn" id="shReply">💬 Antworten</button>
    <button class="sheet-btn warn" id="shDel">🗑️ Lokal löschen</button>
    <button class="sheet-btn" onclick="closeSheet()">✕</button>
  </div>

  <script>
    const feed = document.getElementById('tbFeed');
    const tbInput = document.getElementById('tbInput');
    const tbPinned = document.getElementById('tbPinned');
    const tbPinnedText = document.getElementById('tbPinnedText');
    const tbSheet = document.getElementById('tbSheet');
    const tbSpotify = document.getElementById('tbSpotify');
    let selectedMsg = null;
    let ws = null;

    function esc(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    async function sdApi(path) {
      try { await fetch('/api/streamdeck' + path); } catch (e) {}
    }

    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens.map(t => t.type === 'emote'
          ? '<img class="emote" src="' + t.url + '" alt="' + esc(t.name) + '" />'
          : esc(t.text)
        ).join('');
      }
      return esc(m.text);
    }

    function addMsg(m) {
      const div = document.createElement('div');
      div.className = 'tb-msg ' + m.platform + (m.isHighlight ? ' highlight' : '');
      div.dataset.id = m.id;
      const ic = m.platform === 'twitch' ? '🟣' : m.platform === 'youtube' ? '🔴' : '🎵';
      div.innerHTML = ic + ' <span class="tb-author" style="color:' + (m.color || '#38bdf8') + '">' + esc(m.author) + ':</span>' + renderTokens(m);
      div.onclick = () => {
        selectedMsg = m;
        tbSheet.classList.add('open');
      };
      feed.appendChild(div);
      while (feed.children.length > 100) feed.removeChild(feed.firstChild);
      feed.scrollTop = feed.scrollHeight;
    }

    function closeSheet() {
      tbSheet.classList.remove('open');
      selectedMsg = null;
    }

    document.getElementById('shPin').onclick = () => {
      if (selectedMsg && ws) ws.send(JSON.stringify({ action: 'pin', data: selectedMsg }));
      closeSheet();
    };
    document.getElementById('shReply').onclick = () => {
      if (selectedMsg) {
        tbInput.value = '@' + selectedMsg.author + ' ';
        tbInput.focus();
      }
      closeSheet();
    };
    document.getElementById('shDel').onclick = () => {
      if (selectedMsg && ws) ws.send(JSON.stringify({ action: 'delete-msg', id: selectedMsg.id }));
      closeSheet();
    };

    function sendChat() {
      const txt = tbInput.value.trim();
      if (!txt) return;
      sdApi('/send?text=' + encodeURIComponent(txt));
      tbInput.value = '';
    }
    document.getElementById('tbSend').onclick = sendChat;
    tbInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

    function updateStatus(st) {
      if (!st) return;
      const map = [['twitch','tbTw','tbTwV'],['youtube','tbYt','tbYtV'],['tiktok','tbTt','tbTtV']];
      map.forEach(([k, pId, vId]) => {
        const s = st[k] || {};
        document.getElementById(pId).classList.toggle('connected', s.status === 'connected');
        document.getElementById(vId).textContent = s.viewers || 0;
      });
    }

    function updateSpotify(t) {
      if (!t || !t.running || !t.title) {
        tbSpotify.textContent = '🎵 Spotify: Pausiert/Aus';
        return;
      }
      tbSpotify.textContent = (t.playing ? '▶️ ' : '⏸️ ') + t.title + (t.artist ? ' – ' + t.artist : '');
    }

    function connect() {
      ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'chat') addMsg(p.data);
          else if (p.type === 'status') updateStatus(p.data);
          else if (p.type === 'spotify') updateSpotify(p.data);
          else if (p.type === 'pin') {
            if (p.data) {
              tbPinnedText.innerHTML = '📌 <strong>' + esc(p.data.author) + ':</strong> ' + renderTokens(p.data);
              tbPinned.classList.add('active');
            } else {
              tbPinned.classList.remove('active');
            }
          } else if (p.type === 'delete-msg') {
            const el = feed.querySelector('[data-id="' + p.id + '"]');
            if (el) el.remove();
          } else if (p.type === 'clear') {
            feed.innerHTML = '';
            tbPinned.classList.remove('active');
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connect, 2000);
    }
    connect();
  </script>
</body>
</html>`;

const OBS_ALERTS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniStream OBS Alert Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 16px;
    }
    .alert-card {
      width: 440px;
      max-width: 94vw;
      background: rgba(15, 23, 42, 0.94);
      border: 2px solid #f59e0b;
      border-radius: 16px;
      padding: 18px 22px;
      text-align: center;
      box-shadow: 0 18px 46px rgba(0,0,0,0.65), 0 0 28px rgba(245, 158, 11, 0.35);
      opacity: 0;
      transform: scale(0.82) translateY(16px);
      pointer-events: none;
      transition: opacity 0.32s ease, transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .alert-card.anim-slide {
      transform: translateY(-48px);
    }
    .alert-card.visible {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    .alert-card.anim-glow.visible {
      animation: alertPulse 1.4s ease-in-out infinite alternate;
    }
    @keyframes alertPulse {
      from { box-shadow: 0 18px 46px rgba(0,0,0,0.65), 0 0 18px var(--ac-glow, rgba(245,158,11,0.4)); }
      to { box-shadow: 0 18px 46px rgba(0,0,0,0.65), 0 0 42px var(--ac-glow, rgba(245,158,11,0.85)); }
    }
    .al-top {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      background: rgba(255,255,255,0.1);
      margin-bottom: 10px;
    }
    .al-author {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(0,0,0,0.55);
      margin-bottom: 6px;
      word-break: break-word;
    }
    .al-summary {
      font-size: 15px;
      font-weight: 600;
      color: #e2e8f0;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="alert-card" id="alertCard">
    <img id="alMedia" style="display:none;max-width:160px;max-height:110px;border-radius:10px;margin:0 auto 10px;object-fit:contain;" alt="" />
    <div class="al-top" id="alTop">⭐ NEUES EVENT</div>
    <div class="al-author" id="alAuthor">Streamer</div>
    <div class="al-summary" id="alSummary">Vielen Dank!</div>
  </div>
  <script>
    const card = document.getElementById('alertCard');
    const alMedia = document.getElementById('alMedia');
    const alTop = document.getElementById('alTop');
    const alAuthor = document.getElementById('alAuthor');
    const alSummary = document.getElementById('alSummary');

    let alertConfig = {
      enabled: true,
      durationSec: 5,
      soundEnabled: true,
      animation: 'pop',
      types: { follow: true, sub: true, resub: true, subgift: true, bits: true, raid: true },
      customMedia: {}
    };
    const queue = [];
    let isShowing = false;
    let audioCtx = null;

    const LABELS = {
      follow: ['❤️', 'Neuer Follow'],
      sub: ['⭐', 'Neues Sub / Member'],
      resub: ['🌟', 'Resub'],
      subgift: ['🎁', 'Gifted Subs'],
      bits: ['💎', 'Bits / Gift / SuperChat'],
      raid: ['🚨', 'Raid']
    };
    const PLAT_ICONS = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };

    function playChime() {
      if (!alertConfig.soundEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      } catch (e) {}
    }

    function playAlertAudio(customAudioUrl) {
      if (!alertConfig.soundEnabled) return;
      if (customAudioUrl) {
        try {
          const audio = new Audio(customAudioUrl);
          audio.volume = 0.85;
          audio.play().catch(() => playChime());
          return;
        } catch (e) {}
      }
      playChime();
    }

    function processQueue() {
      if (isShowing || queue.length === 0) return;
      isShowing = true;
      const ev = queue.shift();
      const t = ev.normType || ev.type || 'sub';
      const [evIcon, evLabel] = LABELS[t] || ['✨', 'Stream Event'];
      const pIcon = PLAT_ICONS[ev.platform] || '⚡';
      const color = ev.color || '#f59e0b';
      const media = (alertConfig.customMedia && alertConfig.customMedia[t]) || {};

      if (media.imageUrl) {
        alMedia.src = media.imageUrl;
        alMedia.style.display = 'block';
      } else {
        alMedia.style.display = 'none';
        alMedia.removeAttribute('src');
      }

      card.style.borderColor = color;
      card.style.setProperty('--ac-glow', color);
      alTop.style.background = color;
      alTop.style.color = '#0b0f19';
      alTop.textContent = pIcon + ' ' + evIcon + ' ' + evLabel;
      alAuthor.textContent = ev.author || 'Zuschauer';
      alSummary.textContent = ev.summary || '';

      card.className = 'alert-card anim-' + (alertConfig.animation || 'pop');
      void card.offsetWidth;
      card.classList.add('visible');
      playAlertAudio(media.audioUrl || '');

      const ms = Math.max(2000, Math.min(15000, Number(alertConfig.durationSec || 5) * 1000));
      setTimeout(() => {
        card.classList.remove('visible');
        setTimeout(() => {
          isShowing = false;
          processQueue();
        }, 420);
      }, ms);
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'alert-config' && p.data) {
            alertConfig = { ...alertConfig, ...p.data };
          } else if (p.type === 'obs-alert' && p.data) {
            queue.push(p.data);
            processQueue();
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_GOALS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniStream Chat — OBS Goal-Bar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; overflow: hidden; }
    .goal-wrap {
      width: 100%;
      max-width: 520px;
      padding: 12px 16px;
      border-radius: 14px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow: 0 10px 28px rgba(0,0,0,0.45);
      color: #f8fafc;
    }
    .goal-wrap.hidden { display: none; }
    .goal-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      gap: 10px;
    }
    .goal-title { font-size: 14px; font-weight: 800; letter-spacing: 0.2px; }
    .goal-nums { font-size: 13px; font-weight: 800; color: #e2e8f0; }
    .goal-track {
      position: relative;
      height: 18px;
      border-radius: 99px;
      background: rgba(255,255,255,0.1);
      overflow: hidden;
    }
    .goal-fill {
      height: 100%;
      width: 0%;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--bar-color, #9146ff), #38bdf8);
      transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .goal-pct {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      text-shadow: 0 1px 4px rgba(0,0,0,0.8);
    }
  </style>
</head>
<body>
  <div class="goal-wrap" id="goalWrap">
    <div class="goal-head">
      <div class="goal-title" id="goalTitle">Sub-Goal</div>
      <div class="goal-nums" id="goalNums">0 / 50</div>
    </div>
    <div class="goal-track">
      <div class="goal-fill" id="goalFill"></div>
      <div class="goal-pct" id="goalPct">0%</div>
    </div>
  </div>
  <script>
    const wrap = document.getElementById('goalWrap');
    const titleEl = document.getElementById('goalTitle');
    const numsEl = document.getElementById('goalNums');
    const fillEl = document.getElementById('goalFill');
    const pctEl = document.getElementById('goalPct');

    function renderGoal(g) {
      if (!g || g.enabled === false) {
        wrap.classList.add('hidden');
        return;
      }
      wrap.classList.remove('hidden');
      const cur = Math.max(0, Number(g.current || 0));
      const tgt = Math.max(1, Number(g.target || 50));
      const pct = Math.min(100, Math.round((cur / tgt) * 100));
      titleEl.textContent = g.title || 'Stream-Goal';
      numsEl.textContent = cur + ' / ' + tgt;
      fillEl.style.width = pct + '%';
      fillEl.style.setProperty('--bar-color', g.barColor || '#9146ff');
      pctEl.textContent = pct + '%';
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'goals') renderGoal(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_POLL_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniStream Chat — OBS Multistream Poll</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; overflow: hidden; }
    .poll-card {
      width: 100%;
      max-width: 460px;
      padding: 14px 16px;
      border-radius: 14px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.35);
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      color: #f8fafc;
    }
    .poll-card.hidden { display: none; }
    .poll-q { font-size: 15px; font-weight: 800; margin-bottom: 10px; line-height: 1.3; }
    .poll-opts { display: flex; flex-direction: column; gap: 7px; }
    .poll-opt {
      position: relative;
      border-radius: 9px;
      background: rgba(255,255,255,0.07);
      overflow: hidden;
      padding: 7px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
    }
    .poll-bar {
      position: absolute;
      inset: 0 auto 0 0;
      background: linear-gradient(90deg, rgba(145, 70, 255, 0.55), rgba(56, 189, 248, 0.55));
      transition: width 0.3s ease;
      z-index: 0;
    }
    .poll-lbl, .poll-val { position: relative; z-index: 1; }
    .poll-foot { margin-top: 9px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="poll-card hidden" id="pollCard">
    <div class="poll-q" id="pollQ"></div>
    <div class="poll-opts" id="pollOpts"></div>
    <div class="poll-foot">
      <span id="pollHint">Abstimmen im Chat: !vote 1</span>
      <span id="pollTotal">0 Stimmen</span>
    </div>
  </div>
  <script>
    const card = document.getElementById('pollCard');
    const qEl = document.getElementById('pollQ');
    const optsEl = document.getElementById('pollOpts');
    const totalEl = document.getElementById('pollTotal');
    const hintEl = document.getElementById('pollHint');

    function renderPoll(poll) {
      if (!poll || poll.visible === false || (!poll.active && !poll.visibleWhenStopped)) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      qEl.textContent = poll.question || 'Umfrage';
      const total = Math.max(0, Number(poll.totalVotes || 0));
      totalEl.textContent = total + (total === 1 ? ' Stimme' : ' Stimmen');
      hintEl.textContent = poll.active ? 'Abstimmen im Chat: !vote 1..' + (poll.options || []).length : 'Abstimmung beendet';
      optsEl.innerHTML = '';
      (poll.options || []).forEach((opt, idx) => {
        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
        const row = document.createElement('div');
        row.className = 'poll-opt';
        row.innerHTML =
          '<div class="poll-bar" style="width:' + pct + '%"></div>' +
          '<span class="poll-lbl">' + (idx + 1) + '. ' + String(opt.label || '').replace(/</g, '&lt;') + '</span>' +
          '<span class="poll-val">' + pct + '% (' + (opt.votes || 0) + ')</span>';
        optsEl.appendChild(row);
      });
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'poll') renderPoll(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

class ObsServer {
  constructor(port = 4588) {
    this.port = port;

    this.server = null;
    this.wss = null;
    this.recentMessages = [];
    this.pinnedMessage = null;
    this.currentAppearance = null;
    this.currentStatus = null;
    this.currentSpotify = null;
    this.currentAlertConfig = null;
    this.currentGoals = null;
    this.currentPoll = null;
    this.onClientAction = null;
    this.onStreamDeckApi = null;
  }

  start(listenHost = '0.0.0.0') {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        const parsedUrl = new URL(req.url || '/', `http://127.0.0.1:${this.port}`);
        const urlPath = parsedUrl.pathname;

        if (urlPath.startsWith('/api/streamdeck')) {
          const action = urlPath.replace(/^\/api\/streamdeck\/?/, '').replace(/\/+$/, '') || 'status';
          const params = Object.fromEntries(parsedUrl.searchParams.entries());
          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
            if (rawBody.length > 65536) rawBody = rawBody.slice(0, 65536);
          });
          req.on('end', async () => {
            let body = {};
            if (rawBody) {
              try {
                body = JSON.parse(rawBody);
              } catch (e) {}
            }
            try {
              const result = this.onStreamDeckApi
                ? await this.onStreamDeckApi(action, params, body)
                : { ok: false, error: 'Stream Deck API handler not registered.' };
              res.writeHead(result?.ok === false ? 400 : 200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
              });
              res.end(JSON.stringify(result || { ok: true }));
            } catch (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        if (urlPath === '/dock') {
          res.end(OBS_CUSTOM_DOCK_HTML);
        } else if (urlPath === '/spotify') {
          res.end(OBS_SPOTIFY_HTML);
        } else if (urlPath === '/tablet') {
          res.end(OBS_TABLET_HTML);
        } else if (urlPath === '/alerts') {
          res.end(OBS_ALERTS_HTML);
        } else if (urlPath === '/goals') {
          res.end(OBS_GOALS_HTML);
        } else if (urlPath === '/poll') {
          res.end(OBS_POLL_HTML);
        } else {
          res.end(OBS_OVERLAY_HTML);
        }
      });

      this.wss = new WebSocket.Server({ server: this.server });

      this.wss.on('connection', (ws) => {
        if (this.currentAppearance) {
          ws.send(JSON.stringify({ type: 'appearance', data: this.currentAppearance }));
        }
        if (this.currentStatus) {
          ws.send(JSON.stringify({ type: 'status', data: this.currentStatus }));
        }
        if (this.currentSpotify) {
          ws.send(JSON.stringify({ type: 'spotify', data: this.currentSpotify }));
        }
        if (this.currentAlertConfig) {
          ws.send(JSON.stringify({ type: 'alert-config', data: this.currentAlertConfig }));
        }
        if (this.currentGoals) {
          ws.send(JSON.stringify({ type: 'goals', data: this.currentGoals }));
        }
        if (this.currentPoll) {
          ws.send(JSON.stringify({ type: 'poll', data: this.currentPoll }));
        }
        for (const msg of this.recentMessages.slice(-40)) {
          ws.send(JSON.stringify({ type: 'chat', data: msg }));
        }
        if (this.pinnedMessage) {
          ws.send(JSON.stringify({ type: 'pin', data: this.pinnedMessage }));
        }

        ws.on('message', (raw) => {
          try {
            const data = JSON.parse(raw.toString());
            if (this.onClientAction) {
              this.onClientAction(data);
            }
          } catch (e) {}
        });
      });

      this.server.on('error', () => {
        this.port += 1;
        this.server.listen(this.port, listenHost, () => resolve(this.port));
      });

      this.server.listen(this.port, listenHost, () => {
        resolve(this.port);
      });
    });
  }

  broadcastAlertConfig(cfg) {
    this.currentAlertConfig = cfg;
    this._broadcast({ type: 'alert-config', data: cfg });
  }

  broadcastAlert(alertPayload) {
    this._broadcast({ type: 'obs-alert', data: alertPayload });
  }

  broadcastSpotify(track) {
    this.currentSpotify = track;
    this._broadcast({ type: 'spotify', data: track });
  }

  broadcastAppearance(appearance) {
    this.currentAppearance = appearance;
    this._broadcast({ type: 'appearance', data: appearance });
  }

  broadcastStatus(status) {
    this.currentStatus = status;
    this._broadcast({ type: 'status', data: status });
  }

  broadcastChat(msg) {
    this.recentMessages.push(msg);
    if (this.recentMessages.length > 150) {
      this.recentMessages.shift();
    }
    this._broadcast({ type: 'chat', data: msg });
  }

  deleteMessage(id) {
    this.recentMessages = this.recentMessages.filter((m) => m.id !== id);
    if (this.pinnedMessage && this.pinnedMessage.id === id) {
      this.pinnedMessage = null;
      this._broadcast({ type: 'pin', data: null });
    }
    this._broadcast({ type: 'delete-msg', id });
  }

  deleteUserMessages(author) {
    const low = (author || '').toLowerCase();
    this.recentMessages = this.recentMessages.filter((m) => (m.author || '').toLowerCase() !== low);
    if (this.pinnedMessage && (this.pinnedMessage.author || '').toLowerCase() === low) {
      this.pinnedMessage = null;
      this._broadcast({ type: 'pin', data: null });
    }
    this._broadcast({ type: 'delete-user', author: low });
  }

  broadcastPin(msgOrNull) {
    this.pinnedMessage = msgOrNull;
    this._broadcast({ type: 'pin', data: msgOrNull });
  }

  clearChat() {
    this.recentMessages = [];
    this.pinnedMessage = null;
    this._broadcast({ type: 'clear' });
  }

  _broadcast(payload) {
    if (!this.wss) return;
    const raw = JSON.stringify(payload);
    for (const client of this.wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    }
  }

  broadcastGoals(goals) {
    this.currentGoals = goals;
    this._broadcast({ type: 'goals', data: goals });
  }

  broadcastPoll(poll) {
    this.currentPoll = poll;
    this._broadcast({ type: 'poll', data: poll });
  }

  stop() {
    if (this.wss) this.wss.close();
    if (this.server) this.server.close();
  }
}

module.exports = { ObsServer };
