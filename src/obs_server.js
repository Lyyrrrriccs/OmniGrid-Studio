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

class ObsServer {
  constructor(port = 4588) {
    this.port = port;
    this.server = null;
    this.wss = null;
    this.recentMessages = [];
    this.pinnedMessage = null;
    this.currentAppearance = null;
    this.currentStatus = null;
    this.onClientAction = null;
    this.onStreamDeckApi = null;
  }

  start() {
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
        this.server.listen(this.port, '127.0.0.1', () => resolve(this.port));
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        resolve(this.port);
      });
    });
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

  stop() {
    if (this.wss) this.wss.close();
    if (this.server) this.server.close();
  }
}

module.exports = { ObsServer };
