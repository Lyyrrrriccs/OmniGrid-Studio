const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const OBS_OVERLAY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid OBS Stream-Overlay</title>
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
    body.chat-theme-lol #chatList { gap: 5px; }
    body.chat-theme-lol .msg-row {
      position: relative;
      background: linear-gradient(145deg, rgba(9, 20, 40, 0.92) 0%, rgba(1, 10, 19, 0.94) 100%) !important;
      border: 1px solid rgba(200, 170, 110, 0.52);
      border-left: 3px solid #0ac8b9;
      border-radius: 3px;
      padding: 6px 10px;
      color: #f0e6d2;
      box-shadow: inset 0 0 0 1px rgba(200, 170, 110, 0.16), 0 4px 14px rgba(0, 0, 0, 0.45);
    }
    body.chat-theme-lol .msg-row::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 7px;
      height: 7px;
      border-top: 1.5px solid #c8aa6e;
      border-right: 1.5px solid #c8aa6e;
      pointer-events: none;
    }
    body.chat-theme-lol .author {
      font-family: Georgia, "Times New Roman", serif;
      letter-spacing: 0.03em;
      text-shadow: 0 0 8px rgba(10, 200, 185, 0.35);
    }
    body.chat-theme-lol .badge {
      background: rgba(200, 170, 110, 0.18);
      border: 1px solid rgba(200, 170, 110, 0.5);
      color: #f0e6d2;
    }
    body.chat-theme-lol #pinnedBox {
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.96), rgba(1, 10, 19, 0.98));
      border: 2px solid #c8aa6e;
      border-radius: 4px;
    }
    body.chat-theme-lol .pin-label { color: #0ac8b9; }

    body.chat-theme-valorant #chatList { gap: 5px; }
    body.chat-theme-valorant .msg-row {
      background: linear-gradient(135deg, rgba(15, 25, 35, 0.93) 0%, rgba(19, 28, 39, 0.94) 80%, rgba(45, 16, 22, 0.92) 100%) !important;
      border: 1px solid rgba(236, 232, 225, 0.16);
      border-left: 3.5px solid #ff4655;
      border-radius: 0;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
      padding: 6px 12px 6px 10px;
      color: #ece8e1;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
    }
    body.chat-theme-valorant .author {
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 900;
    }
    body.chat-theme-valorant .badge {
      background: rgba(255, 70, 85, 0.22);
      border: 1px solid #ff4655;
      color: #ff8b94;
      border-radius: 1px;
    }
    body.chat-theme-valorant #pinnedBox {
      background: linear-gradient(135deg, rgba(15, 25, 35, 0.97), rgba(45, 16, 22, 0.96));
      border: 2px solid #ff4655;
      border-radius: 0;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    body.chat-theme-valorant .pin-label { color: #ff4655; }

    body.chat-theme-tron #chatList { gap: 5px; }
    body.chat-theme-tron .msg-row {
      background: linear-gradient(145deg, rgba(2, 10, 22, 0.92), rgba(4, 20, 36, 0.94)) !important;
      border: 1px solid rgba(0, 240, 255, 0.45);
      border-left: 3px solid #00f0ff;
      border-radius: 2px;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
      padding: 6px 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: #e0fbff;
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.14);
    }
    body.chat-theme-tron .badge {
      background: rgba(255, 106, 0, 0.2);
      border: 1px solid #ff6a00;
      color: #ff9f4d;
    }
    body.chat-theme-tron #pinnedBox {
      background: rgba(2, 12, 24, 0.96);
      border: 1.5px solid #00f0ff;
      border-radius: 2px;
    }
    body.chat-theme-tron .pin-label { color: #00f0ff; }
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
      obsChatTheme: 'auto',
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
    let activeAddonId = '';
    let cachedMessages = [];

    function syncChatThemeClass() {
      const mode = String(appearance.obsChatTheme || 'auto');
      const resolved = mode === 'auto'
        ? (activeAddonId === 'lol' ? 'lol' : activeAddonId === 'valorant' ? 'valorant' : activeAddonId === 'techtalk' ? 'tron' : 'default')
        : mode;
      document.body.classList.toggle('chat-theme-lol', resolved === 'lol');
      document.body.classList.toggle('chat-theme-valorant', resolved === 'valorant');
      document.body.classList.toggle('chat-theme-tron', resolved === 'tron');
    }

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
      syncChatThemeClass();
      rerenderAll();
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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
      const safePlat = plat === 'twitch' ? 'twitch' : plat === 'youtube' ? 'youtube' : plat === 'tiktok' ? 'tiktok' : 'chat';
      const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
      const ic = icons[safePlat] || '💬';
      if (appearance.platformIndicatorStyle === 'icon_only') {
        return '<span class="plat-icon">' + ic + '</span>';
      }
      return '<span class="plat-icon"><span class="plat-tag ' + safePlat + '">' + ic + ' ' + safePlat + '</span></span>';
    }

    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens
          .map((t) =>
            t.type === 'emote'
              ? '<span class="emote-wrap"><img class="emote-img" src="' + escapeHtml(t.url) + '" alt="' + escapeHtml(t.name) + '" /></span>'
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
        '<span class="time">' + escapeHtml(tStr) + '</span>' +
        renderPlatBadge(m.platform) +
        badges +
        '<span class="author" style="color:' + escapeHtml(resolveAuthorColor(m)) + '">' + escapeHtml(truncateName(m.author)) + ':</span>' +
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
          } else if (payload.type === 'game-stats') {
            activeAddonId = String(payload.data?.addonId || '');
            syncChatThemeClass();
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
  <title>OmniGrid Studio — OBS Custom Dock</title>
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
    <div class="dock-title">⚡ OmniGrid Dock <span id="totalViewers" style="color:#34d399;"></span></div>
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
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
        return m.tokens.map(t => t.type === 'emote' ? '<span class="emote-wrap"><img class="emote-img" src="' + escapeHtml(t.url) + '" alt="' + escapeHtml(t.name) + '" /></span>' : escapeHtml(t.text)).join('');
      }
      return escapeHtml(m.text);
    }
    function renderInner(m) {
      const d = new Date(m.timestamp || Date.now());
      const tStr = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
      const badges = (m.badges || []).map(b => '<span class="badge">' + escapeHtml(b) + '</span>').join('');
      return '<span class="time">' + escapeHtml(tStr) + '</span><span class="plat-icon">' + (icons[m.platform] || '💬') + '</span>' + badges +
        '<span class="author" style="color:' + escapeHtml(m.color || '#38bdf8') + '">' + escapeHtml(truncateName(m.author)) + ':</span>' +
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
  <title>OmniGrid Spotify Overlay</title>
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
      const srcLabel = (t.source || 'SPOTIFY').toUpperCase();
      tag.textContent = t.playing ? srcLabel + ' • NOW PLAYING' : srcLabel + ' • PAUSIERT';
      tag.style.color = t.source === 'Amazon Music' ? '#00a8e1' : t.source === 'Apple Music' ? '#fb7185' : '#1ed760';
      title.textContent = t.title;
      artist.textContent = t.artist || t.source || 'Music';
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
  <title>OmniGrid Tablet Companion</title>
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
    <div class="tb-brand">⚡ OmniGrid Tablet</div>
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
      <button class="deck-btn" onclick="sdApi('/clip')"><span class="ic">🎬</span>Clip</button>
      <button class="deck-btn" onclick="sdApi('/marker')"><span class="ic">🚩</span>Marker</button>
      <button class="deck-btn" onclick="sdApi('/obs-replay')"><span class="ic">💾</span>OBS Replay</button>
      <button class="deck-btn" onclick="sdApi('/obs-mic')"><span class="ic">🎙️</span>Mic Mute</button>
      <button class="deck-btn" onclick="sdApi('/obs-record')"><span class="ic">🔴</span>OBS Rec</button>
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
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    async function sdApi(path) {
      try { await fetch('/api/streamdeck' + path); } catch (e) {}
    }

    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens.map(t => t.type === 'emote'
          ? '<img class="emote" src="' + esc(t.url) + '" alt="' + esc(t.name) + '" />'
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
      div.innerHTML = ic + ' <span class="tb-author" style="color:' + esc(m.color || '#38bdf8') + '">' + esc(m.author) + ':</span>' + renderTokens(m);
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
  <title>OmniGrid OBS Alert Overlay</title>
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
          } else if (p.type === 'soundboard' && p.data) {
            try {
              const s = p.data;
              const vol = Math.max(0, Math.min(1, Number(s.volume ?? 0.8)));
              if (s.url) {
                const a = new Audio(s.url);
                a.volume = vol;
                a.play().catch(() => {});
              } else if (s.builtin) {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                const g = actx.createGain();
                g.gain.value = vol * 0.35;
                g.connect(actx.destination);
                const o = actx.createOscillator();
                o.type = s.builtin === 'airhorn' ? 'sawtooth' : s.builtin === 'alarm' ? 'square' : 'sine';
                o.frequency.setValueAtTime(s.builtin === 'airhorn' ? 440 : s.builtin === 'ding' ? 880 : s.builtin === 'rimshot' ? 220 : 660, actx.currentTime);
                o.connect(g);
                o.start();
                o.stop(actx.currentTime + (s.builtin === 'airhorn' ? 0.55 : 0.25));
              }
            } catch (e) {}
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
  <title>OmniGrid Studio — OBS Goal-Bar</title>
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
  <title>OmniGrid Studio — OBS Multistream Poll</title>
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
        const escPoll = (v) => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        row.innerHTML =
          '<div class="poll-bar" style="width:' + pct + '%"></div>' +
          '<span class="poll-lbl">' + (idx + 1) + '. ' + escPoll(opt.label) + '</span>' +
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

const OBS_SCHEDULE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Schedule Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .sched-card { width: 420px; background: rgba(15, 23, 42, 0.90); border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 14px; padding: 14px 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.45); }
    .sched-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .sched-title { font-size: 15px; font-weight: 800; color: #f8fafc; }
    .sched-next { font-size: 11px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.14); padding: 3px 8px; border-radius: 999px; }
    .sched-list { display: flex; flex-direction: column; gap: 8px; }
    .sched-row { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(148, 163, 184, 0.16); border-radius: 10px; padding: 8px 11px; }
    .sched-top { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 600; }
    .sched-name { font-size: 13px; font-weight: 700; color: #f1f5f9; margin-top: 2px; }
    .sched-meta { font-size: 11px; color: #cbd5e1; margin-top: 2px; display: flex; justify-content: space-between; }
    .sched-empty { font-size: 12px; color: #94a3b8; padding: 10px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="sched-card" id="schedCard">
    <div class="sched-head">
      <span class="sched-title" id="schedTitle">📅 Stream-Sendeplan</span>
      <span class="sched-next" id="schedNext">—</span>
    </div>
    <div class="sched-list" id="schedList">
      <div class="sched-empty">Lade Sendeplan...</div>
    </div>
  </div>
  <script>
    const titleEl = document.getElementById('schedTitle');
    const nextEl = document.getElementById('schedNext');
    const listEl = document.getElementById('schedList');
    let latestData = null;

    function formatCountdown(ms) {
      const diff = ms - Date.now();
      if (diff <= 0) return '🔴 JETZT / BALD';
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);
      if (days > 0) return 'in ' + days + 'd ' + (hrs % 24) + 'h';
      if (hrs > 0) return 'in ' + hrs + 'h ' + (mins % 60) + 'm';
      return 'in ' + mins + 'm';
    }

    function renderSchedule(data) {
      latestData = data;
      if (!data) return;
      titleEl.textContent = '📅 ' + (data.channel || 'Stream') + ' Sendeplan';
      const items = Array.isArray(data.entries) ? data.entries : [];
      if (!items.length) {
        nextEl.textContent = 'Keine Termine';
        listEl.innerHTML = '<div class="sched-empty">Aktuell keine Termine geplant.</div>';
        return;
      }
      nextEl.textContent = formatCountdown(items[0].startMs);
      listEl.innerHTML = '';
      items.slice(0, 5).forEach((e) => {
        const dt = new Date(e.startMs);
        const dateStr = dt.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: '2-digit' });
        const timeStr = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const plats = (e.platforms || []).map((p) => p.toUpperCase()).join(' • ');
        const row = document.createElement('div');
        row.className = 'sched-row';
        const escSched = (v) => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        row.innerHTML =
          '<div class="sched-top"><span>' + escSched(dateStr) + ' • ' + escSched(timeStr) + '</span><span>' + escSched(plats) + '</span></div>' +
          '<div class="sched-name">' + escSched(e.title) + '</div>' +
          (e.game ? '<div class="sched-meta"><span>🎮 ' + escSched(e.game) + '</span><span>' + Number(e.durationMin || 0) + ' Min.</span></div>' : '');
        listEl.appendChild(row);
      });
    }

    setInterval(() => { if (latestData) renderSchedule(latestData); }, 30000);

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'schedule') renderSchedule(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_GIVEAWAY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Giveaway Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .gw-card { width: 420px; background: rgba(15, 23, 42, 0.92); border: 1px solid rgba(168, 85, 247, 0.45); border-radius: 16px; padding: 16px 18px; box-shadow: 0 14px 36px rgba(0,0,0,0.55); transition: opacity 0.25s, transform 0.25s; }
    .gw-card.hidden { opacity: 0; transform: translateY(10px); pointer-events: none; }
    .gw-head { display: flex; justify-content: space-between; align-items: center; }
    .gw-title { font-size: 16px; font-weight: 800; color: #f8fafc; }
    .gw-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: rgba(168,85,247,0.22); color: #e9d5ff; }
    .gw-sub { font-size: 12px; color: #cbd5e1; margin-top: 4px; }
    .gw-slot { margin-top: 12px; background: rgba(2, 6, 23, 0.78); border: 1px solid rgba(148,163,184,0.25); border-radius: 12px; padding: 14px; text-align: center; min-height: 62px; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .gw-winner { font-size: 22px; font-weight: 900; color: #fde047; text-shadow: 0 0 18px rgba(250,204,21,0.45); }
    .gw-plat { font-size: 11px; color: #94a3b8; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
  </style>
</head>
<body>
  <div class="gw-card hidden" id="gwCard">
    <div class="gw-head">
      <span class="gw-title" id="gwTitle">🎁 Giveaway</span>
      <span class="gw-badge" id="gwCount">0 Teilnehmer</span>
    </div>
    <div class="gw-sub" id="gwSub">Schreibe !join in den Chat</div>
    <div class="gw-slot">
      <div class="gw-winner" id="gwWinner">—</div>
      <div class="gw-plat" id="gwPlat"></div>
    </div>
  </div>
  <script>
    const card = document.getElementById('gwCard');
    const titleEl = document.getElementById('gwTitle');
    const countEl = document.getElementById('gwCount');
    const subEl = document.getElementById('gwSub');
    const winnerEl = document.getElementById('gwWinner');
    const platEl = document.getElementById('gwPlat');
    let spinTimer = null;

    function renderGiveaway(gw) {
      if (!gw || !gw.visible) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      titleEl.textContent = '🎁 ' + (gw.title || 'Giveaway');
      const list = Array.isArray(gw.participants) ? gw.participants : [];
      countEl.textContent = list.length + ' Teilnehmer';
      subEl.textContent = gw.active
        ? 'Teilnahme offen: Schreibe ' + (gw.keyword || '!join') + ' in den Chat!'
        : (gw.winner ? '🎉 Gewinner gezogen!' : 'Teilnahme geschlossen');

      clearInterval(spinTimer);
      if (gw.spinning && list.length > 0) {
        platEl.textContent = 'Ziehung läuft...';
        spinTimer = setInterval(() => {
          const pick = list[Math.floor(Math.random() * list.length)];
          winnerEl.textContent = pick.name;
        }, 70);
      } else if (gw.winner) {
        winnerEl.textContent = '🏆 ' + gw.winner.name;
        platEl.textContent = gw.winner.platform || '';
      } else {
        winnerEl.textContent = list.length ? 'Bereit zur Ziehung...' : 'Warte auf Teilnehmer...';
        platEl.textContent = '';
      }
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'giveaway') renderGiveaway(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_SOUNDBOARD_HTML = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8" /><title>OmniGrid Soundboard</title></head>
<body style="background:transparent;">
  <script>
    function playSoundPayload(s) {
      if (!s) return;
      const vol = Math.max(0, Math.min(1, Number(s.volume ?? 0.8)));
      if (s.url) {
        const a = new Audio(s.url);
        a.volume = vol;
        a.play().catch(() => {});
      } else if (s.builtin) {
        try {
          const actx = new (window.AudioContext || window.webkitAudioContext)();
          const g = actx.createGain();
          g.gain.value = vol * 0.35;
          g.connect(actx.destination);
          const o = actx.createOscillator();
          o.type = s.builtin === 'airhorn' ? 'sawtooth' : s.builtin === 'alarm' ? 'square' : 'sine';
          o.frequency.setValueAtTime(s.builtin === 'airhorn' ? 440 : s.builtin === 'ding' ? 880 : s.builtin === 'rimshot' ? 220 : 660, actx.currentTime);
          o.connect(g);
          o.start();
          o.stop(actx.currentTime + (s.builtin === 'airhorn' ? 0.55 : 0.25));
        } catch (e) {}
      }
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'soundboard') playSoundPayload(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_GAME_STATS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Game Stats Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .gs-card { position: relative; width: 390px; background: rgba(10, 15, 28, 0.90); border: 1.5px solid var(--accent, #38bdf8); border-radius: 14px; padding: 12px 14px; box-shadow: 0 0 24px rgba(56,189,248,0.18), 0 12px 28px rgba(0,0,0,0.5); transition: all 0.3s ease; }
    .gs-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .gs-title { font-size: 14px; font-weight: 800; letter-spacing: 0.02em; color: #f8fafc; display: flex; align-items: center; gap: 6px; }
    .gs-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; background: rgba(56,189,248,0.16); color: var(--accent, #38bdf8); }
    .gs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
    .gs-cell { background: rgba(30, 41, 59, 0.78); border: 1px solid rgba(148,163,184,0.18); border-radius: 9px; padding: 7px 8px; text-align: center; }
    .gs-lbl { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .gs-val { font-size: 16px; font-weight: 800; color: #f8fafc; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* League of Legends Hextech Theme */
    .gs-card.theme-lol {
      width: 410px;
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.96) 0%, rgba(1, 10, 19, 0.97) 100%);
      border: 2px solid #c8aa6e;
      border-radius: 4px;
      padding: 13px 15px;
      box-shadow: inset 0 0 0 1px rgba(200, 170, 110, 0.32), 0 0 26px rgba(10, 200, 185, 0.20), 0 12px 32px rgba(0,0,0,0.65);
    }
    .gs-card.theme-lol::before,
    .gs-card.theme-lol::after {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      border: 2px solid #0ac8b9;
      pointer-events: none;
    }
    .gs-card.theme-lol::before { top: -3px; left: -3px; border-right: none; border-bottom: none; }
    .gs-card.theme-lol::after { bottom: -3px; right: -3px; border-left: none; border-top: none; }
    .gs-card.theme-lol .gs-head {
      border-bottom: 1px solid rgba(200, 170, 110, 0.42);
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .gs-card.theme-lol .gs-title {
      color: #f0e6d2;
      font-family: Georgia, "Times New Roman", serif;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-size: 13.5px;
    }
    .gs-card.theme-lol .gs-badge {
      background: rgba(10, 200, 185, 0.14);
      border: 1px solid rgba(10, 200, 185, 0.55);
      color: #0ac8b9;
      border-radius: 3px;
      letter-spacing: 0.06em;
    }
    .gs-card.theme-lol .gs-grid { grid-template-columns: 1.55fr 1fr 0.85fr 0.75fr; gap: 6px; }
    .gs-card.theme-lol .gs-cell {
      background: linear-gradient(180deg, rgba(16, 32, 58, 0.88) 0%, rgba(7, 16, 32, 0.92) 100%);
      border: 1px solid rgba(200, 170, 110, 0.35);
      border-radius: 3px;
      padding: 5px 6px;
    }
    .gs-card.theme-lol .gs-lbl { color: #c8aa6e; font-size: 9px; font-weight: 700; letter-spacing: 0.06em; }
    .gs-card.theme-lol .gs-val { color: #f0e6d2; font-size: 14px; }
    .gs-card.theme-lol .gs-cell.is-highlight .gs-val { color: #0ac8b9; text-shadow: 0 0 10px rgba(10,200,185,0.4); }
    .gs-matches-wrap { display: none; margin-top: 9px; padding-top: 8px; border-top: 1px solid rgba(200, 170, 110, 0.3); }
    .gs-card.theme-lol .gs-matches-wrap { display: block; }
    @keyframes tronScan { 0% { transform: translateY(-100%); opacity: 0; } 30% { opacity: 0.45; } 100% { transform: translateY(380%); opacity: 0; } }
    .gs-card.theme-tron {
      width: 420px;
      background:
        linear-gradient(rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        radial-gradient(circle at 15% 0%, rgba(0, 240, 255, 0.16), transparent 55%),
        linear-gradient(160deg, rgba(2, 9, 20, 0.96) 0%, rgba(4, 15, 29, 0.97) 100%);
      background-size: 20px 20px, 20px 20px, 100% 100%, 100% 100%;
      border: 1.5px solid #00f0ff;
      border-radius: 2px;
      clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
      box-shadow: 0 0 28px rgba(0, 240, 255, 0.28), inset 0 0 18px rgba(0, 240, 255, 0.12);
      overflow: hidden;
    }
    .gs-card.theme-tron::before {
      content: "";
      position: absolute;
      inset: 0;
      height: 28%;
      background: linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.14), transparent);
      animation: tronScan 4.5s linear infinite;
      pointer-events: none;
    }
    .gs-card.theme-tron .gs-head { border-bottom: 1px solid rgba(0, 240, 255, 0.35); padding-bottom: 7px; }
    .gs-card.theme-tron .gs-title { color: #e0fbff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.1em; font-size: 13px; text-shadow: 0 0 10px rgba(0, 240, 255, 0.65); }
    .gs-card.theme-tron .gs-badge { background: rgba(255, 106, 0, 0.16); border: 1px solid #ff6a00; color: #ff9a44; border-radius: 2px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.08em; text-shadow: 0 0 8px rgba(255, 106, 0, 0.6); }
    .gs-card.theme-tron .gs-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .gs-card.theme-tron .gs-cell { background: rgba(2, 22, 38, 0.85); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 2px; text-align: left; padding: 6px 9px; }
    .gs-card.theme-tron .gs-lbl { color: #00f0ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 9px; letter-spacing: 0.12em; }
    .gs-card.theme-tron .gs-val { color: #f0fdff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13.5px; text-shadow: 0 0 8px rgba(0, 240, 255, 0.45); }
    .gs-card.theme-tron .gs-jc-agenda { display: flex; border-top-color: rgba(0, 240, 255, 0.3); }
    .gs-card.theme-tron .gs-jc-topic { color: #00f0ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; letter-spacing: 0.04em; text-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
    .gs-card.theme-tron .gs-jc-step { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; border-radius: 2px; background: rgba(0, 240, 255, 0.05); border-left: 2px solid rgba(0, 240, 255, 0.25); color: #7dd3fc; }
    .gs-card.theme-tron .gs-jc-step.active { background: rgba(0, 240, 255, 0.18); border-left: 3px solid #ff6a00; color: #ffffff; text-shadow: 0 0 8px rgba(0, 240, 255, 0.65); }
    .gs-card.theme-tron .gs-jc-step.done { opacity: 0.48; text-decoration: line-through; }
    .gs-card.theme-val {
      width: 410px;
      background: linear-gradient(155deg, rgba(15, 25, 35, 0.96) 0%, rgba(10, 16, 24, 0.97) 100%);
      border: 1.5px solid #ff4655;
      border-radius: 2px;
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
      box-shadow: 0 0 26px rgba(255, 70, 85, 0.25), 0 12px 28px rgba(0, 0, 0, 0.6);
    }
    .gs-card.theme-val .gs-head { border-bottom: 1px solid rgba(255, 70, 85, 0.4); padding-bottom: 7px; }
    .gs-card.theme-val .gs-title { color: #ece8e1; text-transform: uppercase; letter-spacing: 0.08em; font-size: 13.5px; }
    .gs-card.theme-val .gs-badge { background: rgba(255, 70, 85, 0.18); border: 1px solid #ff4655; color: #ff6b78; border-radius: 2px; letter-spacing: 0.08em; }
    .gs-card.theme-val .gs-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .gs-card.theme-val .gs-cell { background: rgba(24, 36, 48, 0.88); border: 1px solid rgba(236, 232, 225, 0.16); border-left: 3px solid #ff4655; border-radius: 2px; text-align: left; padding: 6px 9px; }
    .gs-card.theme-val .gs-lbl { color: #ff6b78; font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; }
    .gs-card.theme-val .gs-val { color: #ece8e1; font-size: 14.5px; }
    .gs-matches-lbl { font-size: 9.5px; color: #c8aa6e; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
    .gs-matches-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
    .gs-match-slot { position: relative; height: 46px; border-radius: 4px; background: rgba(7, 16, 32, 0.82); border: 1px solid rgba(148, 163, 184, 0.25); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .gs-match-slot.win { border-color: #0ac8b9; box-shadow: 0 0 10px rgba(10, 200, 185, 0.28); }
    .gs-match-slot.loss { border-color: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.22); }
    .gs-match-slot img { width: 100%; height: 100%; object-fit: cover; opacity: 0.92; }
    .gs-match-badge { position: absolute; bottom: 2px; right: 2px; font-size: 9px; font-weight: 900; padding: 1px 4px; border-radius: 3px; line-height: 1.1; }
    .gs-match-slot.win .gs-match-badge { background: #0ac8b9; color: #010a13; }
    .gs-match-slot.loss .gs-match-badge { background: #ef4444; color: #ffffff; }
    .gs-match-empty { font-size: 11px; color: rgba(200,170,110,0.35); }
    .gs-splash { position: absolute; inset: 0; background-size: cover; background-position: center 20%; opacity: 0.45; pointer-events: none; z-index: 0; border-radius: inherit; filter: saturate(1.2); }
    .gs-splash::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,20,40,0.45) 0%, rgba(1,10,19,0.88) 100%); }
    .gs-content { position: relative; z-index: 1; }
    .gs-lol-hero { display: none; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
    .gs-card.theme-lol .gs-lol-hero.visible { display: flex; }
    .gs-lol-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
    .gs-champ-icon { width: 56px; height: 56px; border-radius: 4px; border: 2px solid #c8aa6e; box-shadow: 0 0 14px rgba(10,200,185,0.42); object-fit: cover; object-position: center 15%; background: #091428; flex-shrink: 0; }
    .gs-champ-meta { min-width: 0; flex: 1; }
    .gs-champ-name { font-size: 16px; font-weight: 800; color: #f0e6d2; font-family: Georgia, "Times New Roman", serif; text-shadow: 0 2px 6px rgba(0,0,0,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gs-skin-name { font-size: 11px; color: #0ac8b9; font-weight: 700; margin-top: 2px; text-shadow: 0 1px 4px rgba(0,0,0,0.9); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gs-elo-sub { font-size: 10px; color: #c8aa6e; font-weight: 700; margin-top: 2px; letter-spacing: 0.03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gs-rank-box {
      flex-shrink: 0;
      min-width: 148px;
      padding: 6px 9px;
      border-radius: 4px;
      background: linear-gradient(160deg, rgba(14, 30, 56, 0.94) 0%, rgba(5, 13, 26, 0.97) 100%);
      border: 1.5px solid var(--tier-color, #c8aa6e);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.55), 0 0 14px rgba(10,200,185,0.18);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .gs-rank-emblem { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px var(--tier-color, #38bdf8)); }
    .gs-rank-emblem svg { width: 36px; height: 36px; display: block; }
    .gs-rank-info { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; text-align: right; flex: 1; min-width: 0; }
    .gs-rank-tier { font-family: Georgia, "Times New Roman", serif; font-size: 12px; font-weight: 900; color: #f0e6d2; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
    .gs-rank-lp { font-size: 13px; font-weight: 900; color: var(--tier-color, #0ac8b9); margin-top: 1px; line-height: 1.1; text-shadow: 0 1px 6px rgba(0,0,0,0.85); }
    .gs-lp-track { width: 100%; height: 4px; border-radius: 999px; background: rgba(148, 163, 184, 0.22); margin-top: 4px; overflow: hidden; }
    .gs-lp-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #c8aa6e, var(--tier-color, #0ac8b9)); transition: width 0.35s ease; }

    /* Just Chatting / Talk-Show Agenda Theme */
    .gs-card.theme-jc {
      width: 410px;
      background: linear-gradient(145deg, rgba(17, 24, 39, 0.94) 0%, rgba(30, 18, 46, 0.95) 100%);
      border: 1.5px solid rgba(236, 72, 153, 0.5);
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.55), 0 0 24px rgba(236, 72, 153, 0.16);
    }
    .gs-jc-agenda { display: none; margin-top: 10px; padding-top: 9px; border-top: 1px solid rgba(236,72,153,0.25); flex-direction: column; gap: 5px; }
    .gs-card.theme-jc .gs-jc-agenda { display: flex; }
    .gs-jc-topic { font-size: 13px; font-weight: 800; color: #fdf2f8; margin-bottom: 3px; line-height: 1.3; }
    .gs-jc-step { display: flex; align-items: center; gap: 8px; font-size: 11.5px; padding: 4px 8px; border-radius: 7px; color: #cbd5e1; background: rgba(15, 23, 42, 0.5); }
    .gs-jc-step.done { opacity: 0.55; text-decoration: line-through; }
    .gs-jc-step.active { background: rgba(236, 72, 153, 0.22); border: 1px solid rgba(236, 72, 153, 0.55); color: #fff; font-weight: 700; }
  </style>
</head>
<body>
  <div class="gs-card" id="gsCard">
    <div class="gs-splash" id="gsSplash"></div>
    <div class="gs-content">
      <div class="gs-head">
        <div class="gs-title" id="gsTitle">🎮 Game Stats</div>
        <div class="gs-badge" id="gsBadge">OmniGrid</div>
      </div>
      <div class="gs-lol-hero" id="gsLolHero">
        <div class="gs-lol-left">
          <img class="gs-champ-icon" id="gsChampIcon" alt="" />
          <div class="gs-champ-meta">
            <div class="gs-champ-name" id="gsChampName"></div>
            <div class="gs-skin-name" id="gsSkinName"></div>
            <div class="gs-elo-sub" id="gsEloSub"></div>
          </div>
        </div>
        <div class="gs-rank-box" id="gsRankBox">
          <div class="gs-rank-emblem" id="gsRankEmblem"></div>
          <div class="gs-rank-info">
            <span class="gs-rank-tier" id="gsRankTier">DIAMOND IV</span>
            <div class="gs-rank-lp" id="gsRankLp">50 LP</div>
            <div class="gs-lp-track"><div class="gs-lp-fill" id="gsLpFill" style="width: 50%;"></div></div>
          </div>
        </div>
      </div>
      <div class="gs-grid" id="gsGrid"></div>
      <div class="gs-jc-agenda" id="gsJcAgenda"></div>
      <div class="gs-matches-wrap" id="gsMatchesWrap">
        <div class="gs-matches-lbl" id="gsMatchesLbl">Letzte 6 Matches</div>
        <div class="gs-matches-row" id="gsMatchesRow"></div>
      </div>
    </div>
  </div>
  <script>
    const card = document.getElementById('gsCard');
    const splashEl = document.getElementById('gsSplash');
    const titleEl = document.getElementById('gsTitle');
    const badgeEl = document.getElementById('gsBadge');
    const lolHeroEl = document.getElementById('gsLolHero');
    const champIconEl = document.getElementById('gsChampIcon');
    const champNameEl = document.getElementById('gsChampName');
    const skinNameEl = document.getElementById('gsSkinName');
    const eloSubEl = document.getElementById('gsEloSub');
    const rankBoxEl = document.getElementById('gsRankBox');
    const rankEmblemEl = document.getElementById('gsRankEmblem');
    const rankTierEl = document.getElementById('gsRankTier');
    const rankLpEl = document.getElementById('gsRankLp');
    const lpFillEl = document.getElementById('gsLpFill');
    const gridEl = document.getElementById('gsGrid');
    const jcAgendaEl = document.getElementById('gsJcAgenda');
    const matchesLblEl = document.getElementById('gsMatchesLbl');
    const matchesRowEl = document.getElementById('gsMatchesRow');

    function resolveTierMeta(rankStr) {
      const r = String(rankStr || '').toLowerCase();
      if (r.includes('challenger')) return { color: '#facc15', accent: '#38bdf8', crown: true, tag: 'C' };
      if (r.includes('grandmaster') || r.includes('großmeister')) return { color: '#f43f5e', accent: '#fbbf24', crown: true, tag: 'GM' };
      if (r.includes('master') || r.includes('meister')) return { color: '#c084fc', accent: '#f0abfc', crown: true, tag: 'M' };
      if (r.includes('diamond') || r.includes('diamant')) return { color: '#38bdf8', accent: '#bae6fd', crown: false, tag: 'D' };
      if (r.includes('emerald') || r.includes('smaragd')) return { color: '#10b981', accent: '#6ee7b7', crown: false, tag: 'E' };
      if (r.includes('platin')) return { color: '#2dd4bf', accent: '#99f6e4', crown: false, tag: 'P' };
      if (r.includes('gold')) return { color: '#f59e0b', accent: '#fde68a', crown: false, tag: 'G' };
      if (r.includes('silver') || r.includes('silber')) return { color: '#cbd5e1', accent: '#f1f5f9', crown: false, tag: 'S' };
      if (r.includes('bronze')) return { color: '#d97706', accent: '#fcd34d', crown: false, tag: 'B' };
      if (r.includes('iron') || r.includes('eisen')) return { color: '#94a3b8', accent: '#cbd5e1', crown: false, tag: 'I' };
      return { color: '#c8aa6e', accent: '#0ac8b9', crown: false, tag: 'U' };
    }

    function buildRankEmblemSvg(rankStr) {
      const m = resolveTierMeta(rankStr);
      const crownPath = m.crown
        ? '<path d="M11 8L15 3L20 7L25 3L29 8L27 11H13L11 8Z" fill="' + m.accent + '" stroke="#091428" stroke-width="1"/>'
        : '<path d="M20 4L24 9H16L20 4Z" fill="' + m.accent + '"/>';
      return '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M4 13L11 10L10 21L5 18L4 13Z" fill="' + m.color + '" opacity="0.72"/>'
        + '<path d="M36 13L29 10L30 21L35 18L36 13Z" fill="' + m.color + '" opacity="0.72"/>'
        + crownPath
        + '<path d="M20 8L31 13V24.5L20 36L9 24.5V13L20 8Z" fill="#091428" stroke="' + m.color + '" stroke-width="2.4"/>'
        + '<path d="M20 12.5L27 16V23.2L20 31L13 23.2V16L20 12.5Z" fill="' + m.color + '" fill-opacity="0.28" stroke="' + m.accent + '" stroke-width="1.3"/>'
        + '<text x="20" y="24.5" text-anchor="middle" font-family="Georgia,serif" font-size="10.5" font-weight="900" fill="#f8fafc">' + m.tag + '</text>'
        + '</svg>';
    }

    function fallbackChampIcon(champName) {
      const raw = String(champName || '').trim();
      if (!raw || raw === '—') return '';
      const alias = { wukong: 'MonkeyKing', 'nunu & willump': 'Nunu', 'renata glasc': 'Renata' };
      const id = alias[raw.toLowerCase()] || raw.replace(/[^a-zA-Z0-9]/g, '');
      return id ? 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/' + id + '.png' : '';
    }

    const forceLolMode = new URLSearchParams(location.search).get('addon') === 'lol';

    function renderStats(data) {
      if (!data) return;
      card.style.display = data.overlayEnabled === false ? 'none' : '';
      if (data.overlayEnabled === false) return;
      const isLol = forceLolMode || data.addonId === 'lol';
      const isJc = !isLol && data.addonId === 'justchatting';
      const isTron = !isLol && data.addonId === 'techtalk';
      const isVal = !isLol && data.addonId === 'valorant';
      card.classList.toggle('theme-lol', isLol);
      card.classList.toggle('theme-jc', isJc);
      card.classList.toggle('theme-tron', isTron);
      card.classList.toggle('theme-val', isVal);
      card.style.setProperty('--accent', data.accent || '#38bdf8');
      const cleanTitle = isLol
        ? 'League of Legends'
        : String(data.addonName || 'Game Stats').replace(/\s*\([^)]*\)/g, '').replace(/—.*/, '').trim();
      titleEl.textContent = (isLol ? '⚔️' : (data.icon || '🎮')) + ' ' + cleanTitle;
      if (isLol) {
        badgeEl.textContent = data.riotId || (data.lolRole ? data.lolRole.toUpperCase() : 'RANKED');
      } else if (isJc) {
        badgeEl.textContent = data.jcMood || 'LIVE TALK';
      } else if (isTron) {
        badgeEl.textContent = data.tronPhase || 'LIVE CODING';
      } else if (isVal) {
        badgeEl.textContent = (data.valAgent || 'AGENT') + ' • ' + (data.valRank || 'RANKED') + ' (' + Number(data.valRr || 0) + ' RR)';
      } else {
        badgeEl.textContent = data.currentGameName || (data.selectedMode === 'auto' ? 'Auto' : data.addonId);
      }

      const fallbackIcon = fallbackChampIcon(data.champion);
      const iconUrl = data.skinIconUrl || data.championIconUrl || fallbackIcon;
      if (isLol) {
        lolHeroEl.classList.add('visible');
        if (iconUrl) {
          champIconEl.style.display = 'block';
          champIconEl.onerror = () => {
            const nextFallback = data.championIconUrl || fallbackIcon;
            if (nextFallback && champIconEl.src !== nextFallback) {
              champIconEl.src = nextFallback;
            }
          };
          champIconEl.src = iconUrl;
        } else {
          champIconEl.style.display = 'none';
        }
        champNameEl.textContent = (data.champion || 'Champion') + (data.lolRole ? ' • ' + data.lolRole : '');
        skinNameEl.textContent = data.skinName ? '✨ ' + data.skinName : 'Classic';
        const extras = [];
        if (data.keystone) extras.push('⚡ ' + data.keystone);
        if (data.currentGold > 0) extras.push('🪙 ' + data.currentGold + 'g');
        eloSubEl.textContent = extras.join('  •  ');
        splashEl.style.backgroundImage = data.skinSplashUrl ? 'url("' + data.skinSplashUrl + '")' : 'none';

        const rankText = String(data.lolRank || 'Unranked').trim();
        const lpVal = Number(data.lolLp || 0);
        const tierCol = resolveTierMeta(rankText).color;
        if (rankBoxEl) {
          rankBoxEl.style.setProperty('--tier-color', tierCol);
          rankBoxEl.style.color = tierCol;
        }
        if (rankEmblemEl) rankEmblemEl.innerHTML = buildRankEmblemSvg(rankText);
        if (rankTierEl) rankTierEl.textContent = rankText;
        if (rankLpEl) rankLpEl.textContent = lpVal + ' LP';
        if (lpFillEl) lpFillEl.style.width = Math.max(4, Math.min(100, lpVal % 100 === 0 && lpVal > 0 ? 100 : lpVal % 100)) + '%';
      } else {
        lolHeroEl.classList.remove('visible');
        splashEl.style.backgroundImage = 'none';
      }

      gridEl.innerHTML = '';
      (data.stats || []).forEach((s) => {
        const cell = document.createElement('div');
        const highlight = isLol && (s.key === 'champion' || s.key === 'kd');
        cell.className = 'gs-cell' + (highlight ? ' is-highlight' : '');
        cell.innerHTML = '<div class="gs-lbl"></div><div class="gs-val"></div>';
        cell.querySelector('.gs-lbl').textContent = s.label;
        cell.querySelector('.gs-val').textContent = String(s.value);
        gridEl.appendChild(cell);
      });

      if ((isJc || isTron) && jcAgendaEl) {
        jcAgendaEl.innerHTML = '';
        const topicDiv = document.createElement('div');
        topicDiv.className = 'gs-jc-topic';
        topicDiv.textContent = isTron
          ? '💠 ' + (data.tronTopic || 'Tech Talk') + (data.tronStack ? ' // ' + data.tronStack : '')
          : '🎙️ ' + (data.jcTopic || 'Chill Talk');
        jcAgendaEl.appendChild(topicDiv);
        const steps = Array.isArray(isTron ? data.tronAgendaItems : data.jcAgendaItems)
          ? (isTron ? data.tronAgendaItems : data.jcAgendaItems)
          : [];
        const cur = Number((isTron ? data.tronActiveAgendaIdx : data.jcActiveAgendaIdx) || 0);
        steps.forEach((st, idx) => {
          const row = document.createElement('div');
          row.className = 'gs-jc-step' + (idx < cur ? ' done' : idx === cur ? ' active' : '');
          const icon = idx < cur ? '✓' : idx === cur ? '▶' : String(idx + 1).padStart(2, '0');
          row.textContent = icon + ' ' + st;
          jcAgendaEl.appendChild(row);
        });
      }

      if (isLol && matchesRowEl) {
        const list = Array.isArray(data.recentMatches) ? data.recentMatches.slice(0, 6) : [];
        const w = Number(data.lolWins || 0);
        const l = Number(data.lolLosses || 0);
        if (matchesLblEl) {
          matchesLblEl.textContent = w + l > 0 ? 'Session: ' + w + 'W - ' + l + 'L • Letzte 6 Matches' : 'Letzte 6 Matches';
        }
        matchesRowEl.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const m = list[i];
          const slot = document.createElement('div');
          if (m) {
            slot.className = 'gs-match-slot ' + (m.win ? 'win' : 'loss');
            const rawUrl = m.championIconUrl || fallbackChampIcon(m.champion);
            const safeUrl = String(rawUrl || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const img = safeUrl ? '<img src="' + safeUrl + '" alt="" />' : '';
            slot.innerHTML = img + '<span class="gs-match-badge">' + (m.win ? 'W' : 'L') + '</span>';
          } else {
            slot.className = 'gs-match-slot';
            slot.innerHTML = '<span class="gs-match-empty">—</span>';
          }
          matchesRowEl.appendChild(slot);
        }
      }
    }

    function fetchLatest() {
      fetch('/api/game-stats')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d && d.addonId) renderStats(d); })
        .catch(() => {});
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderStats(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_LOL_BG_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Client Animated Background</title>
  <style>
    :root {
      --c1: #c8aa6e;
      --c2: #0ac8b9;
      --c3: #38bdf8;
      --bg-a: #061022;
      --bg-b: #020814;
      --txt: #f0e6d2;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: var(--bg-b); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--txt); }
    .bg-root {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at 18% 22%, rgba(255,255,255,0.03), transparent 45%),
        linear-gradient(145deg, var(--bg-a) 0%, var(--bg-b) 100%);
      transition: background 0.8s ease;
    }
    @keyframes kenBurns {
      0% { transform: scale(1.04) translate3d(0%, 0%, 0); }
      50% { transform: scale(1.12) translate3d(-1.6%, -1.0%, 0); }
      100% { transform: scale(1.04) translate3d(0%, 0%, 0); }
    }
    @keyframes fxGlitchSplash {
      0%, 91%, 100% { transform: scale(1.07) translate3d(0, 0, 0); filter: blur(1.5px) saturate(1.25) brightness(0.72); }
      93% { transform: scale(1.08) translate3d(4px, -2px, 0); filter: blur(0.5px) saturate(1.8) hue-rotate(16deg) brightness(0.86); }
      95% { transform: scale(1.07) translate3d(-4px, 2px, 0); filter: blur(1px) saturate(1.6) hue-rotate(-14deg) brightness(0.8); }
    }
    @keyframes fxCosmicSpin {
      0% { transform: scale(1.10) rotate(-1.4deg); }
      50% { transform: scale(1.16) rotate(1.4deg); }
      100% { transform: scale(1.10) rotate(-1.4deg); }
    }
    @keyframes fxBreatheZoom {
      0%, 100% { transform: scale(1.04); filter: blur(1.5px) saturate(1.18) brightness(0.68); }
      50% { transform: scale(1.11); filter: blur(1px) saturate(1.32) brightness(0.78); }
    }
    @keyframes fxPanDrift {
      0% { transform: scale(1.08) translate3d(-2.2%, 0.6%, 0); }
      50% { transform: scale(1.11) translate3d(2.2%, -0.8%, 0); }
      100% { transform: scale(1.08) translate3d(-2.2%, 0.6%, 0); }
    }
    @keyframes fxElementalHue {
      0%, 100% { transform: scale(1.06); filter: blur(1.5px) saturate(1.28) hue-rotate(0deg) brightness(0.74); }
      50% { transform: scale(1.12); filter: blur(1px) saturate(1.42) hue-rotate(24deg) brightness(0.82); }
    }
    @keyframes fxCyberScan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    .bg-splash {
      position: fixed;
      inset: -4%;
      background-size: cover;
      background-position: center 22%;
      opacity: 0;
      filter: blur(1.5px) saturate(1.18) brightness(0.70);
      animation: kenBurns 28s ease-in-out infinite;
      transition: opacity 0.9s ease, background-image 0.6s ease;
      pointer-events: none;
    }
    .bg-splash.visible { opacity: 0.46; }
    body.fx-jinx-glitch .bg-splash,
    body.fx-soul-fighter .bg-splash { animation: fxGlitchSplash 4.8s infinite; }
    body.fx-dark-cosmic .bg-splash,
    body.fx-prestige-cosmic .bg-splash { animation: fxCosmicSpin 26s ease-in-out infinite; }
    body.fx-elementalist .bg-splash,
    body.fx-kda-all-out .bg-splash { animation: fxElementalHue 14s ease-in-out infinite; }
    body.fx-high-noon .bg-splash,
    body.fx-god-king .bg-splash,
    body.fx-nightbringer .bg-splash,
    body.fx-risen-legend .bg-splash,
    body.fx-kda-firestarter .bg-splash { animation: fxBreatheZoom 12s ease-in-out infinite; }
    body.fx-inkshadow .bg-splash,
    body.fx-black-rose .bg-splash,
    body.fx-ravenborn .bg-splash,
    body.fx-spirit-blossom .bg-splash,
    body.fx-blossom-springs .bg-splash,
    body.fx-radiant-cloud .bg-splash,
    body.fx-ruined-mist .bg-splash { animation: fxPanDrift 24s ease-in-out infinite; }
    .bg-scanline {
      position: fixed;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(180deg, transparent, var(--c2), transparent);
      opacity: 0;
      pointer-events: none;
    }
    body.fx-project-cyber .bg-scanline,
    body.fx-jinx-glitch .bg-scanline,
    body.fx-kda-firestarter .bg-scanline { opacity: 0.14; animation: fxCyberScan 5.5s linear infinite; }
    .bg-vignette {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at center, rgba(2, 6, 16, 0.25) 0%, rgba(2, 6, 16, 0.82) 100%),
        linear-gradient(180deg, rgba(2, 6, 16, 0.45) 0%, transparent 25%, transparent 75%, rgba(2, 6, 16, 0.72) 100%);
      pointer-events: none;
    }
    @keyframes orbFloatA {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(6vw, 4vh, 0) scale(1.14); }
    }
    @keyframes orbFloatB {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(-6vw, -5vh, 0) scale(1.18); }
    }
    .bg-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(110px);
      opacity: 0.28;
      pointer-events: none;
      transition: background 0.8s ease;
    }
    .bg-orb-1 { width: 46vw; height: 46vw; top: -16vw; left: -12vw; background: var(--c1); animation: orbFloatA 16s ease-in-out infinite; }
    .bg-orb-2 { width: 42vw; height: 42vw; bottom: -16vw; right: -10vw; background: var(--c2); animation: orbFloatB 19s ease-in-out infinite; }
    .bg-grid {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 64px 64px;
      opacity: 0.55;
      pointer-events: none;
    }
    #bgParticles { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .bg-frame {
      position: fixed;
      inset: 14px;
      border: 1.5px solid var(--c1);
      opacity: 0.36;
      pointer-events: none;
      transition: border-color 0.6s ease;
    }
    .bg-corner { position: fixed; width: 34px; height: 34px; pointer-events: none; transition: border-color 0.6s ease; }
    .bg-c-tl { top: 12px; left: 12px; border-top: 3px solid var(--c2); border-left: 3px solid var(--c2); }
    .bg-c-tr { top: 12px; right: 12px; border-top: 3px solid var(--c1); border-right: 3px solid var(--c1); }
    .bg-c-bl { bottom: 12px; left: 12px; border-bottom: 3px solid var(--c1); border-left: 3px solid var(--c1); }
    .bg-c-br { bottom: 12px; right: 12px; border-bottom: 3px solid var(--c2); border-right: 3px solid var(--c2); }
    .bg-watermark {
      position: fixed;
      bottom: 18px;
      left: 36px;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 6px 14px;
      border-radius: 4px;
      background: rgba(5, 10, 22, 0.82);
      border: 1px solid var(--c1);
      border-left: 4px solid var(--c2);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--txt);
      text-shadow: 0 0 10px var(--c1);
      backdrop-filter: blur(8px);
      transition: all 0.5s ease;
      z-index: 4;
    }
    .bg-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c2); box-shadow: 0 0 10px var(--c2); }

    .frame-layout {
      position: fixed;
      inset: 28px 36px 155px 36px;
      display: grid;
      grid-template-columns: 1fr 440px;
      gap: 26px;
      z-index: 3;
      pointer-events: none;
    }
    body.layout-clean .frame-layout { display: none; }
    .frame-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-width: 0;
    }
    .frame-right {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 0;
    }
    .slot-box {
      position: relative;
      border: 2.5px solid var(--c1);
      background: rgba(3, 8, 18, 0.58);
      box-shadow: 0 0 32px rgba(0, 0, 0, 0.72), inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 22px var(--c1);
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.5s ease, box-shadow 0.5s ease;
    }
    .slot-box::before,
    .slot-box::after {
      content: "";
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid var(--c2);
      pointer-events: none;
      z-index: 3;
      transition: border-color 0.5s ease;
    }
    .slot-box::before { top: 0; left: 0; border-right: none; border-bottom: none; }
    .slot-box::after { bottom: 0; right: 0; border-left: none; border-top: none; }
    .client-slot {
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cam-slot {
      width: 100%;
      height: 248px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .chat-slot {
      width: 100%;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .slot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: linear-gradient(90deg, rgba(4, 10, 22, 0.90), rgba(4, 10, 22, 0.55));
      border-bottom: 1px solid var(--c1);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--txt);
      text-shadow: 0 0 8px var(--c1);
    }
    .slot-pill {
      font-size: 9.5px;
      padding: 2px 8px;
      border-radius: 3px;
      border: 1px solid var(--c2);
      color: var(--c2);
      background: rgba(0, 0, 0, 0.45);
    }
    .slot-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      opacity: 0.28;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--txt);
      text-align: center;
    }
    .slot-placeholder small { font-size: 10px; letter-spacing: 0.1em; color: var(--c2); }
    .bg-status-right {
      position: fixed;
      bottom: 18px;
      right: 36px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--c2);
      background: rgba(5, 10, 22, 0.78);
      border: 1px solid var(--c2);
      padding: 6px 14px;
      border-radius: 4px;
      z-index: 4;
    }
    @keyframes charFloatBg {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .bg-char-art {
      position: fixed;
      right: 30px;
      bottom: 8px;
      height: 295px;
      width: auto;
      display: none;
      z-index: 12;
      pointer-events: none;
      filter: drop-shadow(0 0 18px var(--c1)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.85));
      animation: charFloatBg 4.6s ease-in-out infinite;
    }
    .bg-char-art.visible { display: block; }
  </style>
</head>
<body>
  <div class="bg-root"></div>
  <div class="bg-splash" id="bgSplash"></div>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  <div class="bg-grid"></div>
  <div class="bg-scanline"></div>
  <canvas id="bgParticles"></canvas>
  <div class="bg-vignette"></div>
  <div class="bg-frame"></div>
  <div class="bg-corner bg-c-tl"></div>
  <div class="bg-corner bg-c-tr"></div>
  <div class="bg-corner bg-c-bl"></div>
  <div class="bg-corner bg-c-br"></div>

  <div class="frame-layout">
    <div class="frame-left">
      <div class="slot-box client-slot"></div>
    </div>
    <div class="frame-right">
      <div class="slot-box cam-slot"></div>
      <div class="slot-box chat-slot"></div>
    </div>
  </div>
  <img id="bgCharArt" class="bg-char-art" alt="" />
  <script>
    (function initLolAnimatedBg() {
      const root = document.documentElement;
      const splashEl = document.getElementById('bgSplash');
      const charArtEl = document.getElementById('bgCharArt');
      const canvas = document.getElementById('bgParticles');
      const ctx = canvas.getContext('2d');

      let palette = ['#c8aa6e', '#0ac8b9', '#38bdf8'];
      let packSplashUrl = '';
      let activeMode = 'motes';
      let ddVerPromise = null;
      const skinCache = {};

      const MODE_BY_EFFECT = {
        'jinx-glitch': 'sparks',
        'soul-fighter': 'sparks',
        'kda-firestarter': 'embers',
        'high-noon': 'embers',
        'nightbringer': 'embers',
        'god-king': 'embers',
        'risen-legend': 'streaks',
        'kda-all-out': 'stars',
        'dark-cosmic': 'orbit',
        'prestige-cosmic': 'orbit',
        'black-rose': 'petals',
        'spirit-blossom': 'petals',
        'blossom-springs': 'bubbles',
        'ravenborn': 'feathers',
        'inkshadow': 'ink',
        'elementalist': 'orbs',
        'radiant-cloud': 'orbs',
        'arcane-prestige': 'diamonds',
        'project-cyber': 'cyber',
        'ruined-mist': 'mist'
      };

      function resize() {
        canvas.width = window.innerWidth || 1920;
        canvas.height = window.innerHeight || 1080;
      }
      resize();
      window.addEventListener('resize', resize);

      const particles = Array.from({ length: 64 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.6 + Math.random() * 3.8,
        speed: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        orbitR: 120 + Math.random() * (Math.max(canvas.width, canvas.height) * 0.48),
        ci: Math.floor(Math.random() * 3),
        alpha: 0.28 + Math.random() * 0.65
      }));

      function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const cy = h * 0.5;

        for (const p of particles) {
          const col = palette[p.ci % palette.length];
          p.phase += 0.02;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 14;
          ctx.shadowColor = col;
          ctx.fillStyle = col;
          ctx.strokeStyle = col;

          if (activeMode === 'orbit') {
            p.angle += 0.0018 * p.speed;
            const ox = cx + Math.cos(p.angle) * p.orbitR;
            const oy = cy + Math.sin(p.angle) * (p.orbitR * 0.58);
            ctx.beginPath();
            ctx.arc(ox, oy, p.r, 0, Math.PI * 2);
            ctx.fill();
          } else if (activeMode === 'petals' || activeMode === 'feathers') {
            p.y += p.speed * 0.85;
            p.x += Math.sin(p.phase) * 0.9 + 0.35;
            if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
            if (p.x > w + 20) p.x = -20;
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.sin(p.phase) * 0.8);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.r * (activeMode === 'feathers' ? 2.6 : 1.7), p.r * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (activeMode === 'sparks' || activeMode === 'streaks') {
            p.y -= p.speed * 2.2;
            p.x += (activeMode === 'sparks' ? p.vx * 3.2 : p.speed * 0.8);
            if (p.y < -30 || p.x < -30 || p.x > w + 30) { p.y = h + 20; p.x = Math.random() * w; }
            ctx.lineWidth = Math.max(1.5, p.r * 0.55);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - (activeMode === 'sparks' ? p.vx * 14 : 10), p.y + 18);
            ctx.stroke();
          } else if (activeMode === 'cyber') {
            p.y += p.speed * 2.6;
            if (p.y > h + 40) { p.y = -40; p.x = Math.floor(Math.random() * (w / 32)) * 32; }
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y - 24 * p.speed);
            ctx.stroke();
          } else if (activeMode === 'stars' || activeMode === 'diamonds') {
            p.y -= p.speed * 0.4;
            if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
            const tw = 0.45 + 0.55 * Math.abs(Math.sin(p.phase * 1.4));
            ctx.globalAlpha = p.alpha * tw;
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.PI / 4);
            const sz = p.r * 1.6;
            ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          } else if (activeMode === 'bubbles') {
            p.y -= p.speed * 0.65;
            p.x += Math.sin(p.phase) * 0.5;
            if (p.y < -25) { p.y = h + 25; p.x = Math.random() * w; }
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
            ctx.stroke();
          } else if (activeMode === 'ink' || activeMode === 'mist' || activeMode === 'orbs') {
            p.x += activeMode === 'ink' ? p.speed * 1.1 : Math.sin(p.phase) * 0.55;
            p.y += activeMode === 'mist' ? -p.speed * 0.25 : -p.speed * 0.55;
            if (p.y < -40 || p.x > w + 40) { p.y = activeMode === 'mist' ? h - Math.random() * 260 : h + 30; p.x = activeMode === 'ink' ? -30 : Math.random() * w; }
            ctx.globalAlpha = p.alpha * (activeMode === 'mist' ? 0.25 : 0.45);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * (activeMode === 'mist' ? 5.5 : 3.2), 0, Math.PI * 2);
            ctx.fill();
          } else {
            p.y -= p.speed * (activeMode === 'embers' ? 1.45 : 0.65);
            p.x += p.vx + Math.sin(p.phase) * (activeMode === 'embers' ? 0.75 : 0.35);
            if (p.y < -15) { p.y = h + 15; p.x = Math.random() * w; }
            if (p.x < -15) p.x = w + 15;
            if (p.x > w + 15) p.x = -15;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      function updateSplash() {
        if (packSplashUrl) {
          splashEl.style.backgroundImage = 'url("' + packSplashUrl + '")';
          splashEl.classList.add('visible');
        } else {
          splashEl.style.backgroundImage = 'none';
          splashEl.classList.remove('visible');
        }
      }

      function getDdVer() {
        if (!ddVerPromise) {
          ddVerPromise = fetch('https://ddragon.leagueoflegends.com/api/versions.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((a) => (Array.isArray(a) && a[0] ? a[0] : '15.22.1'))
            .catch(() => '15.22.1');
        }
        return ddVerPromise;
      }

      async function resolveSkinSplash(art) {
        if (!art) return '';
        if (art.localAsset && /^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(String(art.localAsset))) {
          return '/api/theme-asset/' + encodeURIComponent(String(art.localAsset));
        }
        if (!art.championId) return '';
        const cid = String(art.championId).replace(/[^A-Za-z0-9]/g, '');
        if (!cid) return '';
        const q = String(art.skinQuery || '').trim().toLowerCase();
        const key = cid + ':' + q;
        if (skinCache[key]) return skinCache[key];
        let num = 0;
        if (q && q !== 'default') {
          try {
            const ver = await getDdVer();
            const r = await fetch('https://ddragon.leagueoflegends.com/cdn/' + ver + '/data/en_US/champion/' + cid + '.json');
            if (r.ok) {
              const j = await r.json();
              const skins = j && j.data && j.data[cid] && Array.isArray(j.data[cid].skins) ? j.data[cid].skins : [];
              const words = q.split(/\s+/).filter(Boolean);
              const hit = skins.find((s) => String(s.name || '').toLowerCase().includes(q))
                || skins.find((s) => words.every((w) => String(s.name || '').toLowerCase().includes(w)))
                || skins.find((s) => words.some((w) => w.length > 3 && String(s.name || '').toLowerCase().includes(w)));
              if (hit && Number.isFinite(Number(hit.num))) num = Number(hit.num);
            }
          } catch (e) {}
        }
        const url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + cid + '_' + num + '.jpg';
        skinCache[key] = url;
        return url;
      }

      const isCleanLayout = new URLSearchParams(location.search).get('layout') === 'clean';
      function clearFxClasses() {
        document.body.className = isCleanLayout ? 'layout-clean' : '';
      }

      function applyPack(pack) {
        clearFxClasses();
        if (!pack || !pack.id) {
          palette = ['#c8aa6e', '#0ac8b9', '#38bdf8'];
          activeMode = 'motes';
          root.style.setProperty('--c1', '#c8aa6e');
          root.style.setProperty('--c2', '#0ac8b9');
          root.style.setProperty('--c3', '#38bdf8');
          root.style.setProperty('--bg-a', '#061022');
          root.style.setProperty('--bg-b', '#020814');
          root.style.setProperty('--txt', '#f0e6d2');
          packSplashUrl = '';
          charArtEl.classList.remove('visible');
          charArtEl.removeAttribute('src');
          updateSplash();
          return;
        }
        const eff = String(pack.effect || 'none');
        if (eff && eff !== 'none') document.body.classList.add('fx-' + eff);
        activeMode = MODE_BY_EFFECT[eff] || 'motes';
        const c = pack.colors || {};
        const c1 = c.primary || '#ff2a85';
        const c2 = c.secondary || '#39ff14';
        const c3 = c.tertiary || '#00f5d4';
        palette = [c1, c2, c3];
        root.style.setProperty('--c1', c1);
        root.style.setProperty('--c2', c2);
        root.style.setProperty('--c3', c3);
        root.style.setProperty('--bg-a', c.bgStart || '#12061a');
        root.style.setProperty('--bg-b', c.bgEnd || '#061216');
        root.style.setProperty('--txt', c.text || '#f8fafc');
        if (pack.characterArt && /^[a-z0-9_-]+\.(png|webp|jpg|jpeg)$/i.test(String(pack.characterArt))) {
          charArtEl.src = '/api/theme-asset/' + encodeURIComponent(String(pack.characterArt));
          charArtEl.classList.add('visible');
        } else {
          charArtEl.classList.remove('visible');
          charArtEl.removeAttribute('src');
        }
        if (pack.skinArt && pack.skinArt.championId) {
          resolveSkinSplash(pack.skinArt).then((u) => { packSplashUrl = u; updateSplash(); }).catch(() => {});
        } else {
          packSplashUrl = '';
          updateSplash();
        }
      }

      function fetchTheme() {
        fetch('/api/champion-theme', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => applyPack(d && d.pack ? d.pack : null))
          .catch(() => {});
      }

      function connectWs() {
        try {
          const ws = new WebSocket('ws://' + location.host);
          ws.onmessage = (ev) => {
            try {
              const p = JSON.parse(ev.data);
              if (p.type === 'champion-theme') applyPack(p.data);
            } catch (e) {}
          };
          ws.onclose = () => setTimeout(connectWs, 2500);
        } catch (e) {}
      }

      fetchTheme();
      connectWs();
      setInterval(fetchTheme, 4000);
    })();
  </script>
</body>
</html>`;

const OBS_LOL_MAP_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Map Streamer-Modus</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f0e6d2; overflow: hidden; }
    .map-cover {
      position: relative;
      width: 100%;
      height: 100%;
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.98) 0%, rgba(1, 10, 19, 0.99) 100%);
      border: 2.5px solid #c8aa6e;
      box-shadow: inset 0 0 0 1px rgba(200,170,110,0.35), inset 0 0 28px rgba(10,200,185,0.22);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 16px;
      transition: opacity 0.25s ease;
    }
    .map-cover.hidden { opacity: 0; pointer-events: none; }
    .map-cover::before, .map-cover::after { content: ""; position: absolute; width: 14px; height: 14px; border: 2.5px solid #0ac8b9; pointer-events: none; z-index: 2; }
    .map-cover::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
    .map-cover::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }
    .map-splash { position: absolute; inset: 0; background-size: cover; background-position: center 20%; opacity: 0.34; filter: saturate(1.15) blur(1px); z-index: 0; }
    .map-splash::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle, rgba(9,20,40,0.45) 0%, rgba(1,10,19,0.92) 100%); }
    .map-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .map-icon { width: 64px; height: 64px; border-radius: 6px; border: 2px solid #c8aa6e; box-shadow: 0 0 18px rgba(10,200,185,0.45); object-fit: cover; object-position: center 15%; background: #091428; }
    .map-badge { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #0ac8b9; background: rgba(10,200,185,0.14); border: 1px solid rgba(10,200,185,0.5); padding: 3px 10px; border-radius: 3px; }
    .map-title { font-family: Georgia, "Times New Roman", serif; font-size: 16px; font-weight: 800; color: #f0e6d2; letter-spacing: 0.04em; text-shadow: 0 2px 8px rgba(0,0,0,0.9); }
    .map-sub { font-size: 11.5px; color: #c8aa6e; font-weight: 600; max-width: 90%; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="map-cover hidden" id="mapCover">
    <div class="map-splash" id="mapSplash"></div>
    <div class="map-inner">
      <img class="map-icon" id="mapIcon" alt="" style="display:none;" />
      <div class="map-badge">🛡️ Streamer-Modus</div>
      <div class="map-title" id="mapTitle">MINIMAP VERDECKT</div>
      <div class="map-sub" id="mapSub">Minimap verdeckt • Kein Ghosting</div>
    </div>
  </div>
  <script>
    const coverEl = document.getElementById('mapCover');
    const splashEl = document.getElementById('mapSplash');
    const iconEl = document.getElementById('mapIcon');
    const titleEl = document.getElementById('mapTitle');
    const subEl = document.getElementById('mapSub');

    function renderMapCover(data) {
      if (!data) return;
      const show = Boolean(data.mapCoverEnabled) && data.overlayEnabled !== false;
      coverEl.classList.toggle('hidden', !show);
      subEl.textContent = data.mapCoverText || 'Minimap verdeckt • Kein Ghosting';
      const iconUrl = data.skinIconUrl || data.championIconUrl;
      if (iconUrl) {
        iconEl.style.display = 'block';
        iconEl.src = iconUrl;
      } else {
        iconEl.style.display = 'none';
      }
      splashEl.style.backgroundImage = data.skinSplashUrl ? 'url("' + data.skinSplashUrl + '")' : 'none';
      titleEl.textContent = data.champion ? data.champion.toUpperCase() : 'MINIMAP VERDECKT';
    }

    function fetchLatest() {
      fetch('/api/game-stats')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d && d.addonId) renderMapCover(d); })
        .catch(() => {});
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderMapCover(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_LOL_BUILD_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Live Item-Build & Elo Bar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f0e6d2; overflow: hidden; }
    .lb-bar {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 10px 16px;
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.96) 0%, rgba(1, 10, 19, 0.98) 100%);
      border: 2px solid #c8aa6e;
      border-radius: 5px;
      box-shadow: inset 0 0 0 1px rgba(200,170,110,0.3), 0 8px 24px rgba(0,0,0,0.65);
      position: relative;
    }
    .lb-elo { display: flex; flex-direction: column; gap: 3px; padding-right: 12px; border-right: 1px solid rgba(200,170,110,0.35); min-width: 145px; }
    .lb-rank { font-family: Georgia, "Times New Roman", serif; font-size: 14px; font-weight: 800; color: #f0e6d2; letter-spacing: 0.04em; text-transform: uppercase; }
    .lb-lp { font-size: 11.5px; font-weight: 800; color: #0ac8b9; }
    .lb-meta { font-size: 10px; color: #c8aa6e; white-space: nowrap; }
    .lb-items { display: flex; align-items: center; gap: 5px; }
    .lb-slot {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      background: rgba(7, 16, 32, 0.9);
      border: 1.5px solid rgba(200, 170, 110, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .lb-slot.trinket { border-radius: 50%; border-color: #0ac8b9; margin-left: 3px; width: 36px; height: 36px; }
    .lb-slot img { width: 100%; height: 100%; object-fit: cover; }
    .lb-slot-empty { font-size: 10px; color: rgba(200,170,110,0.28); }
    .lb-cnt { position: absolute; bottom: 1px; right: 2px; font-size: 9px; font-weight: 900; background: rgba(1,10,19,0.9); color: #f0e6d2; padding: 0 3px; border-radius: 2px; }
  </style>
</head>
<body>
  <div class="lb-bar" id="lbBar">
    <div class="lb-elo">
      <div class="lb-rank" id="lbRank">DIAMOND IV</div>
      <div class="lb-lp" id="lbLp">50 LP • 0W - 0L</div>
      <div class="lb-meta" id="lbMeta">⚔️ Live Build</div>
    </div>
    <div class="lb-items" id="lbItems"></div>
  </div>
  <script>
    const barEl = document.getElementById('lbBar');
    const rankEl = document.getElementById('lbRank');
    const lpEl = document.getElementById('lbLp');
    const metaEl = document.getElementById('lbMeta');
    const itemsEl = document.getElementById('lbItems');

    function fmtTime(sec) {
      const s = Math.max(0, Math.floor(Number(sec || 0)));
      const m = Math.floor(s / 60);
      const r = String(s % 60).padStart(2, '0');
      return m + ':' + r;
    }

    function renderBuild(d) {
      if (!d) return;
      barEl.style.display = d.overlayEnabled === false ? 'none' : 'inline-flex';
      if (d.overlayEnabled === false) return;
      rankEl.textContent = (d.lolRank || 'UNRANKED') + (d.lolRole ? ' • ' + d.lolRole : '');
      const wl = Number(d.lolWins || 0) + Number(d.lolLosses || 0) > 0
        ? ' • ' + Number(d.lolWins || 0) + 'W-' + Number(d.lolLosses || 0) + 'L'
        : '';
      lpEl.textContent = Number(d.lolLp || 0) + ' LP' + wl;

      const metaParts = [];
      if (d.keystone) metaParts.push('⚡ ' + d.keystone);
      if (d.currentGold > 0) metaParts.push('🪙 ' + d.currentGold + 'g');
      if (d.gameTimeSec > 0) metaParts.push('⏱️ ' + fmtTime(d.gameTimeSec));
      metaEl.textContent = metaParts.join(' • ') || ('⚔️ ' + (d.champion || 'League of Legends'));

      const bySlot = {};
      (Array.isArray(d.items) ? d.items : []).forEach((it, i) => {
        const s = typeof it.slot === 'number' ? it.slot : i;
        bySlot[s] = it;
      });
      itemsEl.innerHTML = '';
      for (let slot = 0; slot < 7; slot++) {
        const box = document.createElement('div');
        box.className = 'lb-slot' + (slot === 6 ? ' trinket' : '');
        const it = bySlot[slot];
        if (it && it.iconUrl) {
          const safeIconUrl = String(it.iconUrl).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const cnt = Number(it.count || 1) > 1 ? '<span class="lb-cnt">' + Number(it.count) + '</span>' : '';
          box.innerHTML = '<img src="' + safeIconUrl + '" alt="" />' + cnt;
        } else {
          box.innerHTML = '<span class="lb-slot-empty">' + (slot === 6 ? '👁️' : '•') + '</span>';
        }
        itemsEl.appendChild(box);
      }
    }

    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderBuild(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderBuild(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_JC_LOWERTHIRD_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Just Chatting Bauchbinde</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .lt-wrap {
      display: flex;
      flex-direction: column;
      max-width: 900px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 18, 46, 0.95) 100%);
      border: 1.5px solid rgba(236, 72, 153, 0.55);
      border-left: 6px solid #ec4899;
      border-radius: 12px;
      padding: 12px 18px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), 0 0 24px rgba(236, 72, 153, 0.18);
      backdrop-filter: blur(12px);
    }
    .lt-top { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .lt-live { background: #ef4444; color: #fff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 999px; letter-spacing: 0.08em; text-transform: uppercase; }
    .lt-mood { background: rgba(236, 72, 153, 0.2); border: 1px solid rgba(236, 72, 153, 0.5); color: #fbcfe8; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px; }
    .lt-clock { margin-left: auto; font-size: 12px; font-weight: 700; color: #cbd5e1; font-variant-numeric: tabular-nums; }
    .lt-topic { font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.01em; line-height: 1.2; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
    .lt-bottom { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 5px; font-size: 12.5px; color: #cbd5e1; }
    .lt-sub { font-weight: 600; color: #f9a8d4; }
    .lt-ticker { font-size: 11.5px; color: #94a3b8; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="lt-wrap" id="ltWrap">
    <div class="lt-top">
      <span class="lt-live">● LIVE TALK</span>
      <span class="lt-mood" id="ltMood">☕ Cozy Talk</span>
      <span class="lt-clock" id="ltClock">--:--</span>
    </div>
    <div class="lt-topic" id="ltTopic">Chill Talk &amp; Community Q&amp;A</div>
    <div class="lt-bottom">
      <span class="lt-sub" id="ltSub">Fragen mit !ask stellen</span>
      <span class="lt-ticker" id="ltTicker">!discord • !socials</span>
    </div>
  </div>
  <script>
    const wrapEl = document.getElementById('ltWrap');
    const moodEl = document.getElementById('ltMood');
    const clockEl = document.getElementById('ltClock');
    const topicEl = document.getElementById('ltTopic');
    const subEl = document.getElementById('ltSub');
    const tickerEl = document.getElementById('ltTicker');

    function tickClock() {
      clockEl.textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    }
    tickClock();
    setInterval(tickClock, 10000);

    function renderLt(d) {
      if (!d) return;
      wrapEl.style.display = d.overlayEnabled === false ? 'none' : 'flex';
      if (d.overlayEnabled === false) return;
      moodEl.textContent = d.jcMood || '☕ Cozy Talk';
      topicEl.textContent = d.jcTopic || 'Chill Talk & Community Q&A';
      subEl.textContent = d.jcSubtopic || '';
      tickerEl.textContent = d.jcSocialTicker || '';
    }

    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderLt(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderLt(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_JC_QNA_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Viewer Q&A Spotlight</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .qna-card {
      max-width: 620px;
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(46, 16, 101, 0.95) 100%);
      border: 2px solid rgba(236, 72, 153, 0.7);
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 16px 38px rgba(0,0,0,0.65), 0 0 28px rgba(236, 72, 153, 0.25);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .qna-card.hidden { opacity: 0; transform: translateY(14px); pointer-events: none; }
    .qna-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .qna-pill { background: #ec4899; color: #fff; font-size: 10.5px; font-weight: 900; padding: 3px 9px; border-radius: 999px; letter-spacing: 0.06em; text-transform: uppercase; }
    .qna-author { font-size: 14px; font-weight: 800; color: #fbcfe8; }
    .qna-plat { margin-left: auto; font-size: 10.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; opacity: 0.85; }
    .qna-text { font-size: 19px; font-weight: 700; color: #ffffff; line-height: 1.38; word-break: break-word; }
  </style>
</head>
<body>
  <div class="qna-card hidden" id="qnaCard">
    <div class="qna-head">
      <span class="qna-pill">❓ Zuschauer-Frage</span>
      <span class="qna-author" id="qnaAuthor">@Viewer fragt:</span>
      <span class="qna-plat" id="qnaPlat">CHAT</span>
    </div>
    <div class="qna-text" id="qnaText"></div>
  </div>
  <script>
    const cardEl = document.getElementById('qnaCard');
    const authorEl = document.getElementById('qnaAuthor');
    const platEl = document.getElementById('qnaPlat');
    const textEl = document.getElementById('qnaText');

    function renderQna(d) {
      if (!d || d.overlayEnabled === false || !d.jcActiveQuestion || !d.jcActiveQuestion.text) {
        cardEl.classList.add('hidden');
        return;
      }
      const q = d.jcActiveQuestion;
      authorEl.textContent = '@' + (q.author || 'Zuschauer') + ' fragt:';
      platEl.textContent = String(q.platform || 'chat').toUpperCase();
      textEl.textContent = '„' + q.text + '“';
      cardEl.classList.remove('hidden');
    }

    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => renderQna(d)).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderQna(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_TRON_TALK_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid TRON Tech Talk &amp; GameDev Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Segoe UI", monospace; color: #e0fbff; overflow: hidden; }
    @keyframes discSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes lightTrace { 0% { left: -30%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
    .tron-bar {
      position: relative;
      width: 960px;
      padding: 14px 20px 12px;
      background:
        linear-gradient(rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        linear-gradient(125deg, rgba(2, 10, 22, 0.95) 0%, rgba(5, 22, 40, 0.94) 60%, rgba(18, 12, 6, 0.94) 100%);
      background-size: 22px 22px, 22px 22px, 100% 100%;
      border: 1.5px solid #00f0ff;
      clip-path: polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px));
      box-shadow: 0 0 34px rgba(0, 240, 255, 0.30), inset 0 0 24px rgba(0, 240, 255, 0.14);
      display: grid;
      grid-template-columns: 74px 1fr auto;
      gap: 16px;
      align-items: center;
      overflow: hidden;
    }
    .tron-bar::before {
      content: "";
      position: absolute;
      top: 0;
      height: 2px;
      width: 28%;
      background: linear-gradient(90deg, transparent, #00f0ff, #ffffff, #00f0ff, transparent);
      animation: lightTrace 4.2s linear infinite;
    }
    .tron-bar::after {
      content: "";
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 24%;
      background: linear-gradient(90deg, transparent, #ff6a00, #ffd199, #ff6a00, transparent);
      animation: lightTrace 5.6s linear infinite reverse;
    }
    .tron-disc {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2.5px solid #00f0ff;
      box-shadow: 0 0 18px rgba(0, 240, 255, 0.65), inset 0 0 14px rgba(0, 240, 255, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.18), rgba(2, 10, 22, 0.9));
    }
    .tron-disc::before {
      content: "";
      position: absolute;
      inset: 6px;
      border-radius: 50%;
      border: 2px dashed rgba(255, 106, 0, 0.85);
      animation: discSpin 9s linear infinite;
    }
    .tron-disc-core { font-size: 22px; text-shadow: 0 0 12px #00f0ff; }
    .tron-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
    .tron-phase {
      padding: 2px 9px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ff9f4d;
      background: rgba(255, 106, 0, 0.16);
      border: 1px solid #ff6a00;
      box-shadow: 0 0 10px rgba(255, 106, 0, 0.35);
    }
    .tron-project { font-size: 12px; color: #7dd3fc; letter-spacing: 0.08em; text-transform: uppercase; }
    .tron-topic {
      font-size: 23px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.03em;
      text-shadow: 0 0 14px rgba(0, 240, 255, 0.55);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tron-stack-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .tron-chip {
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 8px;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.42);
      letter-spacing: 0.06em;
    }
    .tron-ticker {
      grid-column: 1 / -1;
      margin-top: 2px;
      padding-top: 6px;
      border-top: 1px solid rgba(0, 240, 255, 0.25);
      font-size: 11px;
      color: #67e8f9;
      letter-spacing: 0.1em;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .tron-metrics { display: flex; gap: 8px; }
    .tron-metric {
      min-width: 82px;
      padding: 8px 10px;
      background: rgba(0, 24, 42, 0.85);
      border: 1px solid rgba(0, 240, 255, 0.45);
      text-align: center;
    }
    .tron-metric.orange { border-color: rgba(255, 106, 0, 0.65); }
    .tron-m-lbl { font-size: 9px; letter-spacing: 0.14em; color: #7dd3fc; }
    .tron-metric.orange .tron-m-lbl { color: #ff9f4d; }
    .tron-m-val { font-size: 22px; font-weight: 900; color: #ffffff; text-shadow: 0 0 10px rgba(0, 240, 255, 0.65); }
    .tron-metric.orange .tron-m-val { text-shadow: 0 0 10px rgba(255, 106, 0, 0.65); }
  </style>
</head>
<body>
  <div class="tron-bar" id="tronBar">
    <div class="tron-disc"><span class="tron-disc-core">💠</span></div>
    <div style="min-width: 0;">
      <div class="tron-meta">
        <span class="tron-phase" id="tronPhase">LIVE CODING</span>
        <span class="tron-project" id="tronProject">GAMEDEV GRID</span>
      </div>
      <div class="tron-topic" id="tronTopic">Game Engine Architektur &amp; Live Coding</div>
      <div class="tron-stack-row" id="tronStackRow"></div>
    </div>
    <div class="tron-metrics">
      <div class="tron-metric orange">
        <div class="tron-m-lbl">BUGS</div>
        <div class="tron-m-val" id="tronBugs">0</div>
      </div>
      <div class="tron-metric">
        <div class="tron-m-lbl">COMMITS</div>
        <div class="tron-m-val" id="tronCommits">0</div>
      </div>
    </div>
    <div class="tron-ticker">
      <span id="tronTickerText">GRID ONLINE // !stack • !repo • !agenda</span>
      <span id="tronSectorBadge" style="color: #ff9f4d; font-weight: 800;">SECTOR 01</span>
    </div>
  </div>
  <script>
    const bar = document.getElementById('tronBar');
    const phaseEl = document.getElementById('tronPhase');
    const projEl = document.getElementById('tronProject');
    const topicEl = document.getElementById('tronTopic');
    const stackRow = document.getElementById('tronStackRow');
    const bugsEl = document.getElementById('tronBugs');
    const commitsEl = document.getElementById('tronCommits');
    const tickerEl = document.getElementById('tronTickerText');
    const sectorEl = document.getElementById('tronSectorBadge');

    function renderTron(d) {
      if (!d) return;
      bar.style.display = d.overlayEnabled === false ? 'none' : '';
      phaseEl.textContent = d.tronPhase || 'LIVE CODING';
      projEl.textContent = d.tronProject || 'GAMEDEV GRID';
      topicEl.textContent = d.tronTopic || 'Tech Talk & GameDev';
      bugsEl.textContent = String(Number(d.tronBugsFixed || 0));
      commitsEl.textContent = String(Number(d.tronCommits || 0));
      tickerEl.textContent = d.tronTickerText || 'GRID ONLINE // !stack • !repo • !agenda';
      const items = Array.isArray(d.tronAgendaItems) ? d.tronAgendaItems : [];
      const idx = Number(d.tronActiveAgendaIdx || 0);
      sectorEl.textContent = items.length ? 'SECTOR ' + String(idx + 1).padStart(2, '0') + '/' + String(items.length).padStart(2, '0') + ' :: ' + items[idx] : 'GRID ACTIVE';
      stackRow.innerHTML = '';
      String(d.tronStack || '').split(/[•,|/]+/).map((s) => s.trim()).filter(Boolean).slice(0, 6).forEach((tag) => {
        const chip = document.createElement('span');
        chip.className = 'tron-chip';
        chip.textContent = tag;
        stackRow.appendChild(chip);
      });
    }
    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderTron(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderTron(p.data); } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_VAL_BAR_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Valorant Rank &amp; Match Bar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #ece8e1; overflow: hidden; }
    .val-bar {
      width: 550px;
      padding: 12px 16px;
      background: linear-gradient(135deg, rgba(15, 25, 35, 0.96) 0%, rgba(19, 28, 39, 0.95) 65%, rgba(45, 16, 22, 0.94) 100%);
      border: 1.5px solid #ff4655;
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
      box-shadow: 0 0 28px rgba(255, 70, 85, 0.28);
      display: grid;
      grid-template-columns: 1.35fr 1fr 1fr;
      gap: 12px;
      align-items: center;
    }
    .val-rank-lbl { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: #ff6b78; text-transform: uppercase; }
    .val-rank-name { font-size: 18px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase; color: #ece8e1; }
    .val-rr-track { height: 6px; background: rgba(236, 232, 225, 0.14); margin-top: 5px; overflow: hidden; }
    .val-rr-fill { height: 100%; background: linear-gradient(90deg, #ff4655, #ff8b94); transition: width 0.3s ease; }
    .val-box { padding: 7px 10px; background: rgba(255, 255, 255, 0.04); border-left: 2.5px solid #ff4655; }
    .val-box-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; color: #94a3b8; text-transform: uppercase; }
    .val-box-val { font-size: 16px; font-weight: 900; color: #ece8e1; margin-top: 2px; }
    .val-sub { font-size: 11px; color: #cbd5e1; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="val-bar" id="valBar">
    <div>
      <div class="val-rank-lbl" id="valAgentMap">JETT • ASCENT</div>
      <div class="val-rank-name"><span id="valRank">DIAMOND II</span> <span id="valRrText" style="font-size: 13px; color: #ff6b78;">62 RR</span></div>
      <div class="val-rr-track"><div class="val-rr-fill" id="valRrFill" style="width: 62%;"></div></div>
    </div>
    <div class="val-box">
      <div class="val-box-lbl">SCORE / KDA</div>
      <div class="val-box-val" id="valScore">7 : 5</div>
      <div class="val-sub" id="valKda">0/0/0 • HS 28%</div>
    </div>
    <div class="val-box">
      <div class="val-box-lbl">SESSION</div>
      <div class="val-box-val" id="valSession">0W - 0L</div>
      <div class="val-sub" id="valRiotId">VALORANT LIVE</div>
    </div>
  </div>
  <script>
    const bar = document.getElementById('valBar');
    function renderVal(d) {
      if (!d) return;
      bar.style.display = d.overlayEnabled === false ? 'none' : '';
      document.getElementById('valAgentMap').textContent = (d.valAgent || 'JETT') + ' • ' + (d.valMap || 'ASCENT');
      document.getElementById('valRank').textContent = d.valRank || 'UNRANKED';
      const rr = Math.max(0, Math.min(100, Number(d.valRr || 0)));
      document.getElementById('valRrText').textContent = rr + ' RR';
      document.getElementById('valRrFill').style.width = rr + '%';
      document.getElementById('valScore').textContent = d.valScore || '0 : 0';
      document.getElementById('valKda').textContent = Number(d.valKills || 0) + '/' + Number(d.valDeaths || 0) + '/' + Number(d.valAssists || 0) + ' • HS ' + Number(d.valHsPercent || 0) + '%';
      document.getElementById('valSession').textContent = Number(d.valWins || 0) + 'W - ' + Number(d.valLosses || 0) + 'L';
      document.getElementById('valRiotId').textContent = d.valRiotId || 'VALORANT LIVE';
    }
    function fetchLatest() { fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderVal(d); }).catch(() => {}); }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => { try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderVal(p.data); } catch (e) {} };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest(); connectWs(); setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_VAL_MAP_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Valorant Anti-Snipe Radar Cover</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; overflow: hidden; }
    .cover {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px;
      text-align: center;
      background:
        repeating-linear-gradient(45deg, rgba(255, 70, 85, 0.08) 0 10px, transparent 10px 20px),
        linear-gradient(155deg, rgba(15, 25, 35, 0.98), rgba(9, 14, 22, 0.98));
      border: 2px solid #ff4655;
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
      color: #ece8e1;
    }
    .cover.hidden { display: none; }
    .cover-icon { font-size: 32px; }
    .cover-title { font-size: 13px; font-weight: 900; letter-spacing: 0.14em; color: #ff4655; text-transform: uppercase; }
    .cover-sub { font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="cover hidden" id="valMapCover">
    <div class="cover-icon">🛡️</div>
    <div class="cover-title" id="valMapText">RADAR VERDECKT // ANTI-SNIPE</div>
    <div class="cover-sub" id="valMapAgent">VALORANT TACTICAL SHIELD</div>
  </div>
  <script>
    const el = document.getElementById('valMapCover');
    function renderCover(d) {
      if (!d) return;
      const show = d.overlayEnabled !== false && Boolean(d.valMapCoverEnabled);
      el.classList.toggle('hidden', !show);
      document.getElementById('valMapText').textContent = d.valMapCoverText || 'RADAR VERDECKT // ANTI-SNIPE';
      document.getElementById('valMapAgent').textContent = (d.valAgent || 'AGENT') + ' • ' + (d.valMap || 'MAP');
    }
    function fetchLatest() { fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderCover(d); }).catch(() => {}); }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => { try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderCover(p.data); } catch (e) {} };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest(); connectWs(); setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_SPONSORS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Werbepartner Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .sp-wrap { width: 450px; padding: 6px; }
    .sp-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px 15px;
      background: linear-gradient(145deg, rgba(10, 15, 28, 0.95), rgba(15, 23, 42, 0.94));
      border: 1.5px solid var(--sp-accent, #38bdf8);
      border-radius: 14px;
      box-shadow: 0 0 26px rgba(56, 189, 248, 0.22), 0 12px 28px rgba(0, 0, 0, 0.55);
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .sp-card.is-hidden { opacity: 0; transform: translateY(10px); pointer-events: none; }
    .sp-card.is-clickable { cursor: pointer; }
    .sp-logo {
      width: 72px;
      height: 72px;
      border-radius: 10px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      flex-shrink: 0;
      padding: 4px;
    }
    .sp-logo.empty { display: none; }
    .sp-body { flex: 1; min-width: 0; }
    .sp-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
    .sp-badge {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.18);
      border: 1px solid var(--sp-accent, #38bdf8);
      color: var(--sp-accent, #38bdf8);
    }
    .sp-next-hint { font-size: 9.5px; color: #94a3b8; margin-left: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-title { font-size: 17px; font-weight: 900; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-sub { font-size: 12.5px; color: #cbd5e1; margin-top: 2px; line-height: 1.3; }
    .sp-url { font-size: 10.5px; color: var(--sp-accent, #38bdf8); margin-top: 5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-qr-box {
      width: 74px;
      height: 74px;
      border-radius: 8px;
      background: #ffffff;
      padding: 4px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sp-qr-box.hidden { display: none; }
    .sp-qr-box img { width: 100%; height: 100%; display: block; }
    .sp-prog-track {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3.5px;
      background: rgba(255, 255, 255, 0.1);
    }
    .sp-prog-track.hidden { display: none; }
    .sp-prog-fill {
      height: 100%;
      width: 0%;
      background: var(--sp-accent, #38bdf8);
    }
  </style>
</head>
<body>
  <div class="sp-wrap">
    <a class="sp-card is-hidden" id="spCard" target="_blank" rel="noopener noreferrer">
      <img class="sp-logo empty" id="spLogo" alt="" />
      <div class="sp-body">
        <div class="sp-top">
          <span class="sp-badge" id="spBadge">WERBUNG</span>
          <span class="sp-next-hint" id="spCounter"></span>
        </div>
        <div class="sp-title" id="spTitle"></div>
        <div class="sp-sub" id="spSub"></div>
        <div class="sp-url" id="spUrl"></div>
      </div>
      <div class="sp-qr-box hidden" id="spQrBox"><img id="spQrImg" alt="QR" /></div>
      <div class="sp-prog-track" id="spProgTrack"><div class="sp-prog-fill" id="spProgFill"></div></div>
    </a>
  </div>
  <script>
    const card = document.getElementById('spCard');
    const logo = document.getElementById('spLogo');
    const badge = document.getElementById('spBadge');
    const counter = document.getElementById('spCounter');
    const titleEl = document.getElementById('spTitle');
    const subEl = document.getElementById('spSub');
    const urlEl = document.getElementById('spUrl');
    const qrBox = document.getElementById('spQrBox');
    const qrImg = document.getElementById('spQrImg');
    const progTrack = document.getElementById('spProgTrack');
    const progFill = document.getElementById('spProgFill');

    let state = { enabled: true, pauseBetweenSec: 0, showQrCode: true, showProgressBar: true, activeIndex: 0, items: [] };
    let idx = 0;
    let rotTimer = null;
    let pauseTimer = null;
    let lastRevision = '';

    function clearTimers() {
      if (rotTimer) { clearTimeout(rotTimer); rotTimer = null; }
      if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
    }

    function cleanDisplayUrl(raw) {
      return String(raw || '').replace(/^https?:\\/\\//i, '').replace(/\\/$/, '');
    }

    function showSlide(nextIdx) {
      clearTimers();
      const activeItems = (state.items || []).filter((it) => it && it.enabled !== false && (it.name || it.resolvedImageUrl));
      if (!state.enabled || !activeItems.length) {
        card.classList.add('is-hidden');
        return;
      }
      idx = ((nextIdx % activeItems.length) + activeItems.length) % activeItems.length;
      const item = activeItems[idx];
      const durationMs = Math.max(3, Math.min(600, Number(item.durationSec || 15))) * 1000;
      const pauseMs = Math.max(0, Math.min(300, Number(state.pauseBetweenSec || 0))) * 1000;

      card.style.setProperty('--sp-accent', item.accentColor || '#38bdf8');
      badge.textContent = item.badge || 'WERBUNG';
      titleEl.textContent = item.name || 'Partner';
      subEl.textContent = item.subtitle || '';
      subEl.style.display = item.subtitle ? '' : 'none';
      counter.textContent = activeItems.length > 1 ? (idx + 1) + ' / ' + activeItems.length : '';

      const safeHref = /^https?:\\/\\//i.test(item.url || '') ? item.url : '';
      if (safeHref) {
        card.setAttribute('href', safeHref);
        card.classList.add('is-clickable');
        urlEl.textContent = '🔗 ' + cleanDisplayUrl(safeHref);
        urlEl.style.display = '';
      } else {
        card.removeAttribute('href');
        card.classList.remove('is-clickable');
        urlEl.textContent = '';
        urlEl.style.display = 'none';
      }

      if (item.resolvedImageUrl) {
        logo.src = item.resolvedImageUrl;
        logo.classList.remove('empty');
      } else {
        logo.removeAttribute('src');
        logo.classList.add('empty');
      }

      if (state.showQrCode !== false && item.qrDataUrl && safeHref) {
        qrImg.src = item.qrDataUrl;
        qrBox.classList.remove('hidden');
      } else {
        qrBox.classList.add('hidden');
      }

      progTrack.classList.toggle('hidden', state.showProgressBar === false || activeItems.length <= 1);
      progFill.style.transition = 'none';
      progFill.style.width = '0%';
      card.classList.remove('is-hidden');
      void progFill.offsetWidth;
      progFill.style.transition = 'width ' + durationMs + 'ms linear';
      progFill.style.width = '100%';

      if (activeItems.length > 1 || pauseMs > 0) {
        rotTimer = setTimeout(() => {
          if (pauseMs > 0) {
            card.classList.add('is-hidden');
            pauseTimer = setTimeout(() => showSlide(idx + 1), pauseMs);
          } else {
            showSlide(idx + 1);
          }
        }, durationMs);
      }
    }

    function applyState(next) {
      if (!next) return;
      const rev = String(next.revision || '');
      if (rev && rev === lastRevision) return;
      lastRevision = rev;
      state = next;
      showSlide(Number(next.activeIndex || 0));
    }

    function fetchLatest() {
      fetch('/api/sponsors').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) applyState(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try { const p = JSON.parse(ev.data); if (p.type === 'sponsors') applyState(p.data); } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
  </script>
</body>
</html>`;

const ALL_OVERLAY_CARDS_SEL = [
  '.gs-card', '.lb-bar', '.map-cover', '.sp-card', '.goal-wrap', '.poll-card',
  '.gw-card', '.sched-card', '.alert-card', '.lt-wrap', '.qna-card',
  '.tron-bar', '.val-bar', '.cover'
];

const CHAMPION_THEME_INJECT_SNIPPET = `<style id="omniChampThemeStyle">
@keyframes jinxGlitchBorder {
  0%, 92%, 100% { box-shadow: 0 0 22px rgba(255, 42, 133, 0.45), inset 0 0 14px rgba(57, 255, 20, 0.14); border-color: var(--ct-primary, #ff2a85); }
  94% { box-shadow: -3px 0 26px rgba(57, 255, 20, 0.7), 3px 0 26px rgba(255, 42, 133, 0.7); border-color: var(--ct-secondary, #39ff14); transform: translateX(1px); }
  96% { box-shadow: 3px 0 24px rgba(0, 245, 212, 0.65), -2px 0 24px rgba(255, 42, 133, 0.7); border-color: var(--ct-tertiary, #00f5d4); transform: translateX(-1px); }
}
@keyframes kdaFirePulse {
  0%, 100% { box-shadow: 0 0 24px rgba(255, 59, 92, 0.56), inset 0 0 18px rgba(255, 122, 0, 0.22); border-color: var(--ct-primary, #ff3b5c); }
  50% { box-shadow: 0 0 32px rgba(255, 122, 0, 0.64), 0 0 18px rgba(0, 245, 255, 0.45), inset 0 0 20px rgba(255, 59, 92, 0.24); border-color: var(--ct-secondary, #ff7a00); }
}
@keyframes risenLegendGlow {
  0%, 100% { box-shadow: 0 0 24px rgba(245, 197, 66, 0.48), inset 0 0 16px rgba(255, 46, 85, 0.18); border-color: var(--ct-primary, #f5c542); }
  50% { box-shadow: 0 0 30px rgba(255, 46, 85, 0.55), 0 0 18px rgba(245, 197, 66, 0.55), inset 0 0 18px rgba(245, 197, 66, 0.2); border-color: #ffe07d; }
}
@keyframes inkshadowPulse {
  0%, 100% { box-shadow: 0 0 22px rgba(20, 241, 198, 0.42), inset 0 0 18px rgba(255, 59, 78, 0.14); border-color: var(--ct-primary, #14f1c6); }
  50% { box-shadow: 0 0 28px rgba(255, 59, 78, 0.48), 0 0 14px rgba(20, 241, 198, 0.45), inset 0 0 20px rgba(20, 241, 198, 0.18); border-color: var(--ct-secondary, #ff3b4e); }
}
@keyframes kdaAllOutShimmer {
  0%, 100% { box-shadow: 0 0 24px rgba(103, 232, 249, 0.48), inset 0 0 18px rgba(244, 114, 182, 0.18); border-color: var(--ct-primary, #67e8f9); }
  50% { box-shadow: 0 0 30px rgba(244, 114, 182, 0.55), 0 0 18px rgba(196, 181, 253, 0.5), inset 0 0 20px rgba(103, 232, 249, 0.22); border-color: var(--ct-secondary, #f472b6); }
}
@keyframes darkCosmicPulse {
  0%, 100% { box-shadow: 0 0 26px rgba(168, 85, 247, 0.52), inset 0 0 20px rgba(255, 123, 41, 0.16); border-color: var(--ct-primary, #a855f7); }
  50% { box-shadow: 0 0 32px rgba(255, 123, 41, 0.52), 0 0 20px rgba(236, 72, 153, 0.48), inset 0 0 22px rgba(168, 85, 247, 0.24); border-color: var(--ct-secondary, #ff7b29); }
}
@keyframes blackRosePulse {
  0%, 100% { box-shadow: 0 0 24px rgba(225, 29, 72, 0.48), inset 0 0 18px rgba(212, 175, 55, 0.16); border-color: var(--ct-primary, #e11d48); }
  50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 16px rgba(225, 29, 72, 0.5), inset 0 0 20px rgba(225, 29, 72, 0.2); border-color: var(--ct-secondary, #d4af37); }
}
@keyframes ravenbornPulse {
  0%, 100% { box-shadow: 0 0 24px rgba(45, 212, 191, 0.45), inset 0 0 18px rgba(139, 92, 246, 0.18); border-color: var(--ct-primary, #2dd4bf); }
  50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.52), 0 0 16px rgba(45, 212, 191, 0.45), inset 0 0 20px rgba(45, 212, 191, 0.2); border-color: var(--ct-secondary, #8b5cf6); }
}
@keyframes elementalistCycle {
  0%, 100% { box-shadow: 0 0 26px rgba(253, 224, 71, 0.48), inset 0 0 18px rgba(56, 189, 248, 0.18); border-color: #fde047; }
  33% { box-shadow: 0 0 28px rgba(56, 189, 248, 0.52), inset 0 0 18px rgba(232, 121, 249, 0.2); border-color: #38bdf8; }
  66% { box-shadow: 0 0 28px rgba(232, 121, 249, 0.52), inset 0 0 18px rgba(253, 224, 71, 0.2); border-color: #e879f9; }
}
@keyframes highNoonEmber {
  0%, 100% { box-shadow: 0 0 24px rgba(255, 90, 31, 0.52), inset 0 0 18px rgba(245, 158, 11, 0.18); border-color: var(--ct-primary, #ff5a1f); }
  50% { box-shadow: 0 0 32px rgba(220, 38, 38, 0.55), 0 0 18px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(255, 90, 31, 0.24); border-color: var(--ct-secondary, #f59e0b); }
}
@keyframes arcanePrestigeGlow {
  0%, 100% { box-shadow: 0 0 24px rgba(243, 207, 122, 0.48), inset 0 0 18px rgba(56, 189, 248, 0.16); border-color: var(--ct-primary, #f3cf7a); }
  50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.52), 0 0 18px rgba(243, 207, 122, 0.45), inset 0 0 20px rgba(243, 207, 122, 0.2); border-color: #fef08a; }
}
@keyframes prestigeCosmicGlow {
  0%, 100% { box-shadow: 0 0 26px rgba(250, 204, 21, 0.48), inset 0 0 18px rgba(192, 132, 252, 0.18); border-color: var(--ct-primary, #facc15); }
  50% { box-shadow: 0 0 32px rgba(192, 132, 252, 0.55), 0 0 18px rgba(250, 204, 21, 0.5), inset 0 0 20px rgba(224, 231, 255, 0.2); border-color: var(--ct-secondary, #c084fc); }
}
@keyframes godKingAura {
  0%, 100% { box-shadow: 0 0 26px rgba(239, 68, 68, 0.54), inset 0 0 18px rgba(251, 191, 36, 0.20); border-color: var(--ct-primary, #ef4444); }
  50% { box-shadow: 0 0 34px rgba(251, 191, 36, 0.54), 0 0 18px rgba(239, 68, 68, 0.54), inset 0 0 22px rgba(239, 68, 68, 0.24); border-color: var(--ct-secondary, #fbbf24); }
}
@keyframes radiantCloudGlow {
  0%, 100% { box-shadow: 0 0 26px rgba(251, 191, 36, 0.50), inset 0 0 18px rgba(52, 211, 153, 0.18); border-color: var(--ct-primary, #fbbf24); }
  50% { box-shadow: 0 0 32px rgba(52, 211, 153, 0.52), 0 0 18px rgba(244, 63, 94, 0.42), inset 0 0 20px rgba(251, 191, 36, 0.22); border-color: var(--ct-secondary, #34d399); }
}
@keyframes soulFighterPulse {
  0%, 100% { box-shadow: 4px 4px 0 rgba(255, 31, 113, 0.85), 0 0 24px rgba(34, 211, 238, 0.50); border-color: var(--ct-primary, #22d3ee); }
  50% { box-shadow: 4px 4px 0 rgba(34, 211, 238, 0.90), 0 0 28px rgba(255, 31, 113, 0.55); border-color: var(--ct-secondary, #ff1f71); }
}
@keyframes blossomSpringsGlow {
  0%, 100% { box-shadow: 0 0 24px rgba(94, 234, 212, 0.45), inset 0 0 20px rgba(251, 113, 133, 0.16); border-color: var(--ct-primary, #5eead4); }
  50% { box-shadow: 0 0 30px rgba(251, 113, 133, 0.48), 0 0 18px rgba(253, 230, 138, 0.40), inset 0 0 22px rgba(94, 234, 212, 0.20); border-color: var(--ct-secondary, #fb7185); }
}
body.champ-fx-jinx-glitch .msg-row {
  background:
    repeating-linear-gradient(-45deg, rgba(255, 42, 133, 0.08) 0 8px, rgba(57, 255, 20, 0.05) 8px 16px, transparent 16px 32px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 6, 26, 0.94)), var(--ct-bg-end, rgba(6, 18, 22, 0.95))) !important;
  border: 1.5px solid var(--ct-primary, #ff2a85) !important;
  border-left: 4px solid var(--ct-secondary, #39ff14) !important;
  border-radius: 2px !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  color: var(--ct-text, #fff0f7) !important;
  margin-bottom: 5px;
  box-shadow: 0 0 16px rgba(255, 42, 133, 0.28), -2px 0 0 rgba(57, 255, 20, 0.35);
}
body.champ-fx-jinx-glitch .author { text-shadow: 0 0 9px rgba(255, 42, 133, 0.65), 1px 0 0 rgba(57, 255, 20, 0.45); letter-spacing: 0.04em; }
body.champ-fx-jinx-glitch .badge { background: rgba(255, 42, 133, 0.24) !important; border: 1px solid var(--ct-secondary, #39ff14) !important; color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch #pinnedBox {
  background: linear-gradient(135deg, rgba(24, 6, 32, 0.97), rgba(8, 22, 24, 0.97)) !important;
  border: 2px solid var(--ct-primary, #ff2a85) !important;
  animation: jinxGlitchBorder 4.5s infinite;
}
body.champ-fx-jinx-glitch .pin-label { color: var(--ct-secondary, #39ff14) !important; }
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-jinx-glitch ${s}`).join(',\n')} {
  background:
    repeating-linear-gradient(-45deg, rgba(255, 42, 133, 0.09) 0 10px, rgba(57, 255, 20, 0.06) 10px 20px, transparent 20px 40px),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 6, 26, 0.96)), var(--ct-bg-end, rgba(6, 18, 22, 0.96))) !important;
  border: 2px solid var(--ct-primary, #ff2a85) !important;
  border-radius: 3px !important;
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  animation: jinxGlitchBorder 4.5s infinite;
}
body.champ-fx-jinx-glitch .gs-card::before,
body.champ-fx-jinx-glitch .map-cover::before { border-color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-card::after,
body.champ-fx-jinx-glitch .map-cover::after { border-color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .gs-head,
body.champ-fx-jinx-glitch .gs-matches-wrap,
body.champ-fx-jinx-glitch .lb-elo,
body.champ-fx-jinx-glitch .sched-head { border-color: rgba(255, 42, 133, 0.45) !important; }
body.champ-fx-jinx-glitch .gs-title,
body.champ-fx-jinx-glitch .gs-champ-name,
body.champ-fx-jinx-glitch .lb-rank,
body.champ-fx-jinx-glitch .map-title,
body.champ-fx-jinx-glitch .sp-title,
body.champ-fx-jinx-glitch .goal-title,
body.champ-fx-jinx-glitch .poll-q,
body.champ-fx-jinx-glitch .gw-title,
body.champ-fx-jinx-glitch .sched-title,
body.champ-fx-jinx-glitch .al-author,
body.champ-fx-jinx-glitch .lt-topic,
body.champ-fx-jinx-glitch .qna-author,
body.champ-fx-jinx-glitch .tron-topic,
body.champ-fx-jinx-glitch .val-rank-name,
body.champ-fx-jinx-glitch .cover-title { color: #ffffff !important; text-shadow: 0 0 12px rgba(255, 42, 133, 0.8), 2px 0 0 rgba(57, 255, 20, 0.55) !important; }
body.champ-fx-jinx-glitch .gs-badge,
body.champ-fx-jinx-glitch .map-badge,
body.champ-fx-jinx-glitch .sp-badge,
body.champ-fx-jinx-glitch .sp-tag,
body.champ-fx-jinx-glitch .gw-badge,
body.champ-fx-jinx-glitch .lt-live,
body.champ-fx-jinx-glitch .lt-mood,
body.champ-fx-jinx-glitch .qna-pill,
body.champ-fx-jinx-glitch .tron-phase { background: rgba(57, 255, 20, 0.16) !important; border-color: var(--ct-secondary, #39ff14) !important; color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-skin-name,
body.champ-fx-jinx-glitch .lb-lp,
body.champ-fx-jinx-glitch .gs-rank-lp,
body.champ-fx-jinx-glitch .goal-pct,
body.champ-fx-jinx-glitch .gw-winner,
body.champ-fx-jinx-glitch .sched-next,
body.champ-fx-jinx-glitch .sp-url,
body.champ-fx-jinx-glitch .lt-ticker,
body.champ-fx-jinx-glitch .tron-ticker { color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-elo-sub,
body.champ-fx-jinx-glitch .gs-matches-lbl,
body.champ-fx-jinx-glitch .lb-meta,
body.champ-fx-jinx-glitch .map-sub,
body.champ-fx-jinx-glitch .sp-artist,
body.champ-fx-jinx-glitch .goal-nums,
body.champ-fx-jinx-glitch .lt-sub,
body.champ-fx-jinx-glitch .val-rank-lbl,
body.champ-fx-jinx-glitch .val-box-lbl,
body.champ-fx-jinx-glitch .tron-m-lbl,
body.champ-fx-jinx-glitch .cover-sub { color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .gs-champ-icon,
body.champ-fx-jinx-glitch .map-icon,
body.champ-fx-jinx-glitch .gs-rank-box,
body.champ-fx-jinx-glitch .lb-slot,
body.champ-fx-jinx-glitch .sp-cover,
body.champ-fx-jinx-glitch .gw-slot,
body.champ-fx-jinx-glitch .val-box,
body.champ-fx-jinx-glitch .tron-metric { border-color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .lb-slot.trinket,
body.champ-fx-jinx-glitch .gs-match-slot.win { border-color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-match-slot.win .gs-match-badge { background: var(--ct-secondary, #39ff14) !important; color: #05080f !important; }
body.champ-fx-jinx-glitch .gs-cell { border-color: rgba(255, 42, 133, 0.48) !important; border-left: 3px solid var(--ct-secondary, #39ff14) !important; background: rgba(16, 8, 24, 0.9) !important; }
body.champ-fx-jinx-glitch .gs-lbl { color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .gs-val,
body.champ-fx-jinx-glitch .val-box-val,
body.champ-fx-jinx-glitch .tron-m-val { color: #ffffff !important; text-shadow: 0 0 8px rgba(0, 245, 212, 0.55); }
body.champ-fx-jinx-glitch .gs-lp-fill,
body.champ-fx-jinx-glitch .lb-lp-fill,
body.champ-fx-jinx-glitch .goal-fill,
body.champ-fx-jinx-glitch .sp-prog-fill,
body.champ-fx-jinx-glitch .val-rr-fill { background: linear-gradient(90deg, var(--ct-primary, #ff2a85), var(--ct-secondary, #39ff14)) !important; }

body.champ-pack-active:not(.champ-fx-jinx-glitch) .msg-row {
  background: linear-gradient(135deg, var(--ct-bg-start, rgba(16, 16, 28, 0.94)), var(--ct-bg-end, rgba(10, 14, 24, 0.95))) !important;
  border: 1.5px solid var(--ct-primary, #38bdf8) !important;
  border-left: 4px solid var(--ct-secondary, #a855f7) !important;
  color: var(--ct-text, #f8fafc) !important;
  margin-bottom: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;
}
body.champ-pack-active:not(.champ-fx-jinx-glitch) #pinnedBox {
  background: linear-gradient(135deg, var(--ct-bg-start, rgba(16, 16, 28, 0.96)), var(--ct-bg-end, rgba(10, 14, 24, 0.96))) !important;
  border: 2px solid var(--ct-primary, #38bdf8) !important;
}
body.champ-pack-active:not(.champ-fx-jinx-glitch) .pin-label { color: var(--ct-secondary, #a855f7) !important; }
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-pack-active:not(.champ-fx-jinx-glitch) ${s}`).join(',\n')} {
  background: linear-gradient(145deg, var(--ct-bg-start, rgba(16, 16, 28, 0.96)), var(--ct-bg-end, rgba(10, 14, 24, 0.96))) !important;
  border: 2px solid var(--ct-primary, #38bdf8) !important;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6), inset 0 0 18px rgba(255, 255, 255, 0.06) !important;
}
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-card::before,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-cover::before { border-color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-card::after,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-cover::after { border-color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-head,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-matches-wrap,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-elo,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sched-head { border-color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-champ-name,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-rank,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .poll-q,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sched-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .al-author,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-topic,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .qna-author,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-topic,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-rank-name,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .cover-title { color: var(--ct-text, #f8fafc) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-matches-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-elo-sub,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-meta,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-sub,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-artist,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-nums,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-sub,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-rank-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-box-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-m-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .cover-sub { color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-tag,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-live,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-mood,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .qna-pill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-phase { border-color: var(--ct-secondary, #a855f7) !important; color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-skin-name,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-lp,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-rank-lp,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-pct,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-winner,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sched-next,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-url,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-ticker,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-ticker { color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-champ-icon,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-icon,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-rank-box,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-slot,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-cover,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-slot,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-box,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-metric { border-color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-cell { border-color: var(--ct-primary, #38bdf8) !important; border-left: 3px solid var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-slot.trinket,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-match-slot.win { border-color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-lp-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-lp-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-prog-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-rr-fill { background: linear-gradient(90deg, var(--ct-primary, #38bdf8), var(--ct-secondary, #a855f7)) !important; }

${['.msg-row', ...ALL_OVERLAY_CARDS_SEL].map((s) => `body.champ-fx-spirit-blossom ${s}`).join(',\n')} { border-radius: 14px !important; }
${['.msg-row', ...ALL_OVERLAY_CARDS_SEL].map((s) => `body.champ-fx-nightbringer ${s},\nbody.champ-fx-project-cyber ${s}`).join(',\n')} { clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); border-radius: 0 !important; }

body.champ-fx-kda-firestarter .msg-row {
  background:
    linear-gradient(125deg, rgba(255, 59, 92, 0.18), rgba(255, 122, 0, 0.14) 55%, rgba(0, 245, 255, 0.08)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(22, 6, 20, 0.96)), var(--ct-bg-end, rgba(10, 8, 26, 0.97))) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(255, 59, 92, 0.34), -2px 0 0 rgba(255, 122, 0, 0.65) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-kda-firestarter ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(255, 122, 0, 0.26), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(255, 59, 92, 0.22), transparent 50%),
    radial-gradient(circle at 50% 10%, rgba(0, 245, 255, 0.12), transparent 48%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(22, 6, 20, 0.96)), var(--ct-bg-end, rgba(10, 8, 26, 0.97))) !important;
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  border-radius: 0 !important;
  animation: kdaFirePulse 3.2s ease-in-out infinite;
}
body.champ-fx-kda-firestarter .gs-title,
body.champ-fx-kda-firestarter .gs-champ-name,
body.champ-fx-kda-firestarter .lb-rank,
body.champ-fx-kda-firestarter .sp-title,
body.champ-fx-kda-firestarter .goal-title,
body.champ-fx-kda-firestarter .poll-q,
body.champ-fx-kda-firestarter .gw-title,
body.champ-fx-kda-firestarter .sched-title,
body.champ-fx-kda-firestarter .al-author,
body.champ-fx-kda-firestarter .lt-topic,
body.champ-fx-kda-firestarter .qna-author,
body.champ-fx-kda-firestarter .tron-topic,
body.champ-fx-kda-firestarter .val-rank-name { text-shadow: 0 0 12px rgba(255, 59, 92, 0.88), 0 0 8px rgba(255, 122, 0, 0.65) !important; }
body.champ-fx-kda-firestarter .gs-lp-fill,
body.champ-fx-kda-firestarter .lb-lp-fill,
body.champ-fx-kda-firestarter .goal-fill,
body.champ-fx-kda-firestarter .sp-prog-fill,
body.champ-fx-kda-firestarter .val-rr-fill { background: linear-gradient(90deg, #ff3b5c, #ff7a00, #00f5ff) !important; }

body.champ-fx-risen-legend .msg-row {
  background:
    linear-gradient(125deg, rgba(245, 197, 66, 0.14), rgba(255, 46, 85, 0.10) 60%, rgba(192, 132, 252, 0.08)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 7, 14, 0.96)), var(--ct-bg-end, rgba(9, 8, 18, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #f5c542) !important;
  border-left: 4px solid var(--ct-secondary, #ff2e55) !important;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(245, 197, 66, 0.28), -2px 0 0 rgba(255, 46, 85, 0.5) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-risen-legend ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 88% 12%, rgba(245, 197, 66, 0.22), transparent 46%),
    radial-gradient(circle at 12% 88%, rgba(255, 46, 85, 0.18), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 7, 14, 0.96)), var(--ct-bg-end, rgba(9, 8, 18, 0.97))) !important;
  border: 2px solid var(--ct-primary, #f5c542) !important;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  border-radius: 0 !important;
  animation: risenLegendGlow 3.8s ease-in-out infinite;
}
body.champ-fx-risen-legend .gs-title,
body.champ-fx-risen-legend .gs-champ-name,
body.champ-fx-risen-legend .lb-rank,
body.champ-fx-risen-legend .sp-title,
body.champ-fx-risen-legend .goal-title,
body.champ-fx-risen-legend .poll-q,
body.champ-fx-risen-legend .gw-title,
body.champ-fx-risen-legend .sched-title,
body.champ-fx-risen-legend .al-author,
body.champ-fx-risen-legend .lt-topic,
body.champ-fx-risen-legend .qna-author,
body.champ-fx-risen-legend .tron-topic,
body.champ-fx-risen-legend .val-rank-name { color: #fff8e7 !important; text-shadow: 0 0 12px rgba(245, 197, 66, 0.8), 0 0 6px rgba(255, 46, 85, 0.45) !important; }
body.champ-fx-risen-legend .gs-lp-fill,
body.champ-fx-risen-legend .lb-lp-fill,
body.champ-fx-risen-legend .goal-fill,
body.champ-fx-risen-legend .sp-prog-fill,
body.champ-fx-risen-legend .val-rr-fill { background: linear-gradient(90deg, #ff2e55, #f5c542, #ffe07d) !important; }

body.champ-fx-inkshadow .msg-row {
  background:
    repeating-linear-gradient(-35deg, rgba(20, 241, 198, 0.06) 0 6px, rgba(255, 59, 78, 0.04) 6px 12px, transparent 12px 28px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 9, 14, 0.97)), var(--ct-bg-end, rgba(14, 12, 22, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #14f1c6) !important;
  border-left: 4px solid var(--ct-secondary, #ff3b4e) !important;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 8px, 100% 100%, 12px 100%, 0 calc(100% - 8px));
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(20, 241, 198, 0.24), -2px 0 0 rgba(255, 59, 78, 0.5) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-inkshadow ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 12% 18%, rgba(20, 241, 198, 0.16), transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(255, 59, 78, 0.16), transparent 48%),
    repeating-linear-gradient(-40deg, rgba(248, 250, 252, 0.03) 0 4px, transparent 4px 22px),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 9, 14, 0.97)), var(--ct-bg-end, rgba(14, 12, 22, 0.98))) !important;
  border: 2px solid var(--ct-primary, #14f1c6) !important;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 12px, 100% 100%, 16px 100%, 0 calc(100% - 12px));
  border-radius: 0 !important;
  animation: inkshadowPulse 4s ease-in-out infinite;
}
body.champ-fx-inkshadow .gs-title,
body.champ-fx-inkshadow .gs-champ-name,
body.champ-fx-inkshadow .lb-rank,
body.champ-fx-inkshadow .sp-title,
body.champ-fx-inkshadow .goal-title,
body.champ-fx-inkshadow .poll-q,
body.champ-fx-inkshadow .gw-title,
body.champ-fx-inkshadow .sched-title,
body.champ-fx-inkshadow .al-author,
body.champ-fx-inkshadow .lt-topic,
body.champ-fx-inkshadow .qna-author,
body.champ-fx-inkshadow .tron-topic,
body.champ-fx-inkshadow .val-rank-name { color: #f8fafc !important; text-shadow: 0 0 12px rgba(20, 241, 198, 0.72), 1px 0 0 rgba(255, 59, 78, 0.55) !important; }
body.champ-fx-inkshadow .gs-lp-fill,
body.champ-fx-inkshadow .lb-lp-fill,
body.champ-fx-inkshadow .goal-fill,
body.champ-fx-inkshadow .sp-prog-fill,
body.champ-fx-inkshadow .val-rr-fill { background: linear-gradient(90deg, #14f1c6, #f8fafc, #ff3b4e) !important; }

body.champ-fx-kda-all-out .msg-row {
  background:
    linear-gradient(125deg, rgba(103, 232, 249, 0.14), rgba(196, 181, 253, 0.12) 50%, rgba(244, 114, 182, 0.14)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(14, 10, 32, 0.95)), var(--ct-bg-end, rgba(10, 18, 38, 0.96))) !important;
  border: 1.5px solid var(--ct-primary, #67e8f9) !important;
  border-left: 4px solid var(--ct-secondary, #f472b6) !important;
  border-radius: 12px !important;
  box-shadow: 0 0 18px rgba(103, 232, 249, 0.25), inset 0 0 10px rgba(244, 114, 182, 0.12) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-kda-all-out ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 18% 12%, rgba(103, 232, 249, 0.22), transparent 46%),
    radial-gradient(circle at 86% 85%, rgba(244, 114, 182, 0.22), transparent 48%),
    radial-gradient(circle at 55% 45%, rgba(196, 181, 253, 0.10), transparent 60%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(14, 10, 32, 0.95)), var(--ct-bg-end, rgba(10, 18, 38, 0.96))) !important;
  border: 2px solid var(--ct-primary, #67e8f9) !important;
  border-radius: 14px !important;
  animation: kdaAllOutShimmer 3.8s ease-in-out infinite;
}
body.champ-fx-kda-all-out .gs-title,
body.champ-fx-kda-all-out .gs-champ-name,
body.champ-fx-kda-all-out .lb-rank,
body.champ-fx-kda-all-out .sp-title,
body.champ-fx-kda-all-out .goal-title,
body.champ-fx-kda-all-out .poll-q,
body.champ-fx-kda-all-out .gw-title,
body.champ-fx-kda-all-out .sched-title,
body.champ-fx-kda-all-out .al-author,
body.champ-fx-kda-all-out .lt-topic,
body.champ-fx-kda-all-out .qna-author,
body.champ-fx-kda-all-out .tron-topic,
body.champ-fx-kda-all-out .val-rank-name { color: #f8fbff !important; text-shadow: 0 0 12px rgba(103, 232, 249, 0.8), 0 0 8px rgba(244, 114, 182, 0.55) !important; }
body.champ-fx-kda-all-out .gs-lp-fill,
body.champ-fx-kda-all-out .lb-lp-fill,
body.champ-fx-kda-all-out .goal-fill,
body.champ-fx-kda-all-out .sp-prog-fill,
body.champ-fx-kda-all-out .val-rr-fill { background: linear-gradient(90deg, #67e8f9, #c4b5fd, #f472b6) !important; }

body.champ-fx-dark-cosmic .msg-row {
  background:
    radial-gradient(circle at 92% 50%, rgba(255, 123, 41, 0.18), transparent 48%),
    linear-gradient(125deg, rgba(168, 85, 247, 0.16), rgba(236, 72, 153, 0.10) 55%, rgba(8, 4, 20, 0.96)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 4, 20, 0.97)), var(--ct-bg-end, rgba(15, 5, 26, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #a855f7) !important;
  border-left: 4px solid var(--ct-secondary, #ff7b29) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.3), -2px 0 0 rgba(255, 123, 41, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-dark-cosmic ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 84% 18%, rgba(255, 123, 41, 0.24), transparent 42%),
    radial-gradient(circle at 18% 82%, rgba(236, 72, 153, 0.22), transparent 48%),
    radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.14), transparent 62%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 4, 20, 0.97)), var(--ct-bg-end, rgba(15, 5, 26, 0.98))) !important;
  border: 2px solid var(--ct-primary, #a855f7) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: darkCosmicPulse 4s ease-in-out infinite;
}
body.champ-fx-dark-cosmic .gs-title,
body.champ-fx-dark-cosmic .gs-champ-name,
body.champ-fx-dark-cosmic .lb-rank,
body.champ-fx-dark-cosmic .sp-title,
body.champ-fx-dark-cosmic .goal-title,
body.champ-fx-dark-cosmic .poll-q,
body.champ-fx-dark-cosmic .gw-title,
body.champ-fx-dark-cosmic .sched-title,
body.champ-fx-dark-cosmic .al-author,
body.champ-fx-dark-cosmic .lt-topic,
body.champ-fx-dark-cosmic .qna-author,
body.champ-fx-dark-cosmic .tron-topic,
body.champ-fx-dark-cosmic .val-rank-name { color: #faf5ff !important; text-shadow: 0 0 12px rgba(168, 85, 247, 0.85), 0 0 8px rgba(255, 123, 41, 0.55) !important; }
body.champ-fx-dark-cosmic .gs-lp-fill,
body.champ-fx-dark-cosmic .lb-lp-fill,
body.champ-fx-dark-cosmic .goal-fill,
body.champ-fx-dark-cosmic .sp-prog-fill,
body.champ-fx-dark-cosmic .val-rr-fill { background: linear-gradient(90deg, #9333ea, #ec4899, #ff7b29) !important; }

body.champ-fx-black-rose .msg-row {
  background:
    linear-gradient(125deg, rgba(225, 29, 72, 0.16), rgba(212, 175, 55, 0.08) 55%, rgba(147, 51, 234, 0.10)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(16, 4, 10, 0.97)), var(--ct-bg-end, rgba(10, 4, 14, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #e11d48) !important;
  border-left: 4px solid var(--ct-secondary, #d4af37) !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(225, 29, 72, 0.28), -2px 0 0 rgba(212, 175, 55, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-black-rose ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(212, 175, 55, 0.18), transparent 44%),
    radial-gradient(circle at 14% 86%, rgba(225, 29, 72, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(16, 4, 10, 0.97)), var(--ct-bg-end, rgba(10, 4, 14, 0.98))) !important;
  border: 2px solid var(--ct-primary, #e11d48) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: blackRosePulse 4s ease-in-out infinite;
}
body.champ-fx-black-rose .gs-title,
body.champ-fx-black-rose .gs-champ-name,
body.champ-fx-black-rose .lb-rank,
body.champ-fx-black-rose .sp-title,
body.champ-fx-black-rose .goal-title,
body.champ-fx-black-rose .poll-q,
body.champ-fx-black-rose .gw-title,
body.champ-fx-black-rose .sched-title,
body.champ-fx-black-rose .al-author,
body.champ-fx-black-rose .lt-topic,
body.champ-fx-black-rose .qna-author,
body.champ-fx-black-rose .tron-topic,
body.champ-fx-black-rose .val-rank-name { color: #fff1f2 !important; text-shadow: 0 0 12px rgba(225, 29, 72, 0.8), 0 0 6px rgba(212, 175, 55, 0.55) !important; }
body.champ-fx-black-rose .gs-lp-fill,
body.champ-fx-black-rose .lb-lp-fill,
body.champ-fx-black-rose .goal-fill,
body.champ-fx-black-rose .sp-prog-fill,
body.champ-fx-black-rose .val-rr-fill { background: linear-gradient(90deg, #9f1239, #e11d48, #d4af37) !important; }

body.champ-fx-ravenborn .msg-row {
  background:
    linear-gradient(125deg, rgba(45, 212, 191, 0.14), rgba(139, 92, 246, 0.14) 60%, rgba(7, 10, 20, 0.96)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(7, 10, 20, 0.97)), var(--ct-bg-end, rgba(12, 7, 24, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #2dd4bf) !important;
  border-left: 4px solid var(--ct-secondary, #8b5cf6) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(45, 212, 191, 0.24), -2px 0 0 rgba(139, 92, 246, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-ravenborn ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 16%, rgba(45, 212, 191, 0.20), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(139, 92, 246, 0.22), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(7, 10, 20, 0.97)), var(--ct-bg-end, rgba(12, 7, 24, 0.98))) !important;
  border: 2px solid var(--ct-primary, #2dd4bf) !important;
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  border-radius: 0 !important;
  animation: ravenbornPulse 4s ease-in-out infinite;
}
body.champ-fx-ravenborn .gs-title,
body.champ-fx-ravenborn .gs-champ-name,
body.champ-fx-ravenborn .lb-rank,
body.champ-fx-ravenborn .sp-title,
body.champ-fx-ravenborn .goal-title,
body.champ-fx-ravenborn .poll-q,
body.champ-fx-ravenborn .gw-title,
body.champ-fx-ravenborn .sched-title,
body.champ-fx-ravenborn .al-author,
body.champ-fx-ravenborn .lt-topic,
body.champ-fx-ravenborn .qna-author,
body.champ-fx-ravenborn .tron-topic,
body.champ-fx-ravenborn .val-rank-name { color: #f0fdfa !important; text-shadow: 0 0 12px rgba(45, 212, 191, 0.8), 0 0 8px rgba(139, 92, 246, 0.6) !important; }
body.champ-fx-ravenborn .gs-lp-fill,
body.champ-fx-ravenborn .lb-lp-fill,
body.champ-fx-ravenborn .goal-fill,
body.champ-fx-ravenborn .sp-prog-fill,
body.champ-fx-ravenborn .val-rr-fill { background: linear-gradient(90deg, #2dd4bf, #8b5cf6, #e2e8f0) !important; }

body.champ-fx-elementalist .msg-row {
  background:
    linear-gradient(125deg, rgba(253, 224, 71, 0.14), rgba(56, 189, 248, 0.12) 50%, rgba(232, 121, 249, 0.14)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(10, 14, 34, 0.95)), var(--ct-bg-end, rgba(18, 12, 36, 0.96))) !important;
  border: 1.5px solid var(--ct-primary, #fde047) !important;
  border-left: 4px solid var(--ct-secondary, #38bdf8) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 16px rgba(253, 224, 71, 0.24), inset 0 0 10px rgba(56, 189, 248, 0.14) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-elementalist ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 14%, rgba(253, 224, 71, 0.22), transparent 44%),
    radial-gradient(circle at 86% 20%, rgba(56, 189, 248, 0.20), transparent 46%),
    radial-gradient(circle at 50% 88%, rgba(232, 121, 249, 0.20), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(10, 14, 34, 0.95)), var(--ct-bg-end, rgba(18, 12, 36, 0.96))) !important;
  border: 2px solid #fde047 !important;
  border-radius: 12px !important;
  animation: elementalistCycle 6s ease-in-out infinite;
}
body.champ-fx-elementalist .gs-title,
body.champ-fx-elementalist .gs-champ-name,
body.champ-fx-elementalist .lb-rank,
body.champ-fx-elementalist .sp-title,
body.champ-fx-elementalist .goal-title,
body.champ-fx-elementalist .poll-q,
body.champ-fx-elementalist .gw-title,
body.champ-fx-elementalist .sched-title,
body.champ-fx-elementalist .al-author,
body.champ-fx-elementalist .lt-topic,
body.champ-fx-elementalist .qna-author,
body.champ-fx-elementalist .tron-topic,
body.champ-fx-elementalist .val-rank-name { color: #fefce8 !important; text-shadow: 0 0 12px rgba(253, 224, 71, 0.78), 0 0 8px rgba(56, 189, 248, 0.55) !important; }
body.champ-fx-elementalist .gs-lp-fill,
body.champ-fx-elementalist .lb-lp-fill,
body.champ-fx-elementalist .goal-fill,
body.champ-fx-elementalist .sp-prog-fill,
body.champ-fx-elementalist .val-rr-fill { background: linear-gradient(90deg, #fde047, #38bdf8, #e879f9, #fb7185) !important; }

body.champ-fx-high-noon .msg-row {
  background:
    linear-gradient(125deg, rgba(255, 90, 31, 0.16), rgba(245, 158, 11, 0.10) 55%, rgba(220, 38, 38, 0.14)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(20, 8, 5, 0.97)), var(--ct-bg-end, rgba(12, 6, 5, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ff5a1f) !important;
  border-left: 4px solid var(--ct-secondary, #f59e0b) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 8px, 100% 100%, 10px 100%, 0 calc(100% - 8px));
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(255, 90, 31, 0.28), -2px 0 0 rgba(245, 158, 11, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-high-noon ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 16%, rgba(245, 158, 11, 0.22), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(220, 38, 38, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(20, 8, 5, 0.97)), var(--ct-bg-end, rgba(12, 6, 5, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ff5a1f) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  animation: highNoonEmber 3.4s ease-in-out infinite;
}
body.champ-fx-high-noon .gs-title,
body.champ-fx-high-noon .gs-champ-name,
body.champ-fx-high-noon .lb-rank,
body.champ-fx-high-noon .sp-title,
body.champ-fx-high-noon .goal-title,
body.champ-fx-high-noon .poll-q,
body.champ-fx-high-noon .gw-title,
body.champ-fx-high-noon .sched-title,
body.champ-fx-high-noon .al-author,
body.champ-fx-high-noon .lt-topic,
body.champ-fx-high-noon .qna-author,
body.champ-fx-high-noon .tron-topic,
body.champ-fx-high-noon .val-rank-name { color: #fff7ed !important; text-shadow: 0 0 12px rgba(255, 90, 31, 0.85), 0 0 6px rgba(245, 158, 11, 0.6) !important; }
body.champ-fx-high-noon .gs-lp-fill,
body.champ-fx-high-noon .lb-lp-fill,
body.champ-fx-high-noon .goal-fill,
body.champ-fx-high-noon .sp-prog-fill,
body.champ-fx-high-noon .val-rr-fill { background: linear-gradient(90deg, #dc2626, #ff5a1f, #f59e0b) !important; }

body.champ-fx-arcane-prestige .msg-row {
  background:
    linear-gradient(125deg, rgba(243, 207, 122, 0.14), rgba(56, 189, 248, 0.12) 60%, rgba(9, 14, 30, 0.96)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(9, 14, 30, 0.96)), var(--ct-bg-end, rgba(15, 20, 38, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #f3cf7a) !important;
  border-left: 4px solid var(--ct-secondary, #38bdf8) !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(243, 207, 122, 0.24), -2px 0 0 rgba(56, 189, 248, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-arcane-prestige ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 14%, rgba(243, 207, 122, 0.22), transparent 46%),
    radial-gradient(circle at 86% 86%, rgba(56, 189, 248, 0.20), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(9, 14, 30, 0.96)), var(--ct-bg-end, rgba(15, 20, 38, 0.97))) !important;
  border: 2px solid var(--ct-primary, #f3cf7a) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: arcanePrestigeGlow 4s ease-in-out infinite;
}
body.champ-fx-arcane-prestige .gs-title,
body.champ-fx-arcane-prestige .gs-champ-name,
body.champ-fx-arcane-prestige .lb-rank,
body.champ-fx-arcane-prestige .sp-title,
body.champ-fx-arcane-prestige .goal-title,
body.champ-fx-arcane-prestige .poll-q,
body.champ-fx-arcane-prestige .gw-title,
body.champ-fx-arcane-prestige .sched-title,
body.champ-fx-arcane-prestige .al-author,
body.champ-fx-arcane-prestige .lt-topic,
body.champ-fx-arcane-prestige .qna-author,
body.champ-fx-arcane-prestige .tron-topic,
body.champ-fx-arcane-prestige .val-rank-name { color: #fefce8 !important; text-shadow: 0 0 12px rgba(243, 207, 122, 0.8), 0 0 8px rgba(56, 189, 248, 0.55) !important; }
body.champ-fx-arcane-prestige .gs-lp-fill,
body.champ-fx-arcane-prestige .lb-lp-fill,
body.champ-fx-arcane-prestige .goal-fill,
body.champ-fx-arcane-prestige .sp-prog-fill,
body.champ-fx-arcane-prestige .val-rr-fill { background: linear-gradient(90deg, #38bdf8, #f3cf7a, #fef9c3) !important; }

body.champ-fx-prestige-cosmic .msg-row {
  background:
    linear-gradient(125deg, rgba(250, 204, 21, 0.14), rgba(192, 132, 252, 0.14) 55%, rgba(224, 231, 255, 0.08)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(10, 7, 24, 0.97)), var(--ct-bg-end, rgba(16, 10, 32, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #facc15) !important;
  border-left: 4px solid var(--ct-secondary, #c084fc) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(250, 204, 21, 0.26), -2px 0 0 rgba(192, 132, 252, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-prestige-cosmic ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(250, 204, 21, 0.24), transparent 44%),
    radial-gradient(circle at 14% 86%, rgba(192, 132, 252, 0.24), transparent 48%),
    radial-gradient(circle at 50% 50%, rgba(224, 231, 255, 0.08), transparent 60%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(10, 7, 24, 0.97)), var(--ct-bg-end, rgba(16, 10, 32, 0.98))) !important;
  border: 2px solid var(--ct-primary, #facc15) !important;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  border-radius: 0 !important;
  animation: prestigeCosmicGlow 3.8s ease-in-out infinite;
}
body.champ-fx-prestige-cosmic .gs-title,
body.champ-fx-prestige-cosmic .gs-champ-name,
body.champ-fx-prestige-cosmic .lb-rank,
body.champ-fx-prestige-cosmic .sp-title,
body.champ-fx-prestige-cosmic .goal-title,
body.champ-fx-prestige-cosmic .poll-q,
body.champ-fx-prestige-cosmic .gw-title,
body.champ-fx-prestige-cosmic .sched-title,
body.champ-fx-prestige-cosmic .al-author,
body.champ-fx-prestige-cosmic .lt-topic,
body.champ-fx-prestige-cosmic .qna-author,
body.champ-fx-prestige-cosmic .tron-topic,
body.champ-fx-prestige-cosmic .val-rank-name { color: #faf5ff !important; text-shadow: 0 0 12px rgba(250, 204, 21, 0.8), 0 0 8px rgba(192, 132, 252, 0.65) !important; }
body.champ-fx-prestige-cosmic .gs-lp-fill,
body.champ-fx-prestige-cosmic .lb-lp-fill,
body.champ-fx-prestige-cosmic .goal-fill,
body.champ-fx-prestige-cosmic .sp-prog-fill,
body.champ-fx-prestige-cosmic .val-rr-fill { background: linear-gradient(90deg, #c084fc, #facc15, #e0e7ff) !important; }

body.champ-fx-god-king .msg-row {
  background:
    linear-gradient(125deg, rgba(239, 68, 68, 0.18), rgba(251, 191, 36, 0.12) 60%, rgba(18, 6, 8, 0.97)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 6, 8, 0.97)), var(--ct-bg-end, rgba(12, 8, 12, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ef4444) !important;
  border-left: 4px solid var(--ct-secondary, #fbbf24) !important;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 10px, 100% 100%, 12px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(239, 68, 68, 0.30), -2px 0 0 rgba(251, 191, 36, 0.6) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-god-king ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(251, 191, 36, 0.24), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(239, 68, 68, 0.26), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 6, 8, 0.97)), var(--ct-bg-end, rgba(12, 8, 12, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ef4444) !important;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 14px, 100% 100%, 16px 100%, 0 calc(100% - 14px));
  border-radius: 0 !important;
  animation: godKingAura 3.4s ease-in-out infinite;
}
body.champ-fx-god-king .gs-title,
body.champ-fx-god-king .gs-champ-name,
body.champ-fx-god-king .lb-rank,
body.champ-fx-god-king .sp-title,
body.champ-fx-god-king .goal-title,
body.champ-fx-god-king .poll-q,
body.champ-fx-god-king .gw-title,
body.champ-fx-god-king .sched-title,
body.champ-fx-god-king .al-author,
body.champ-fx-god-king .lt-topic,
body.champ-fx-god-king .qna-author,
body.champ-fx-god-king .tron-topic,
body.champ-fx-god-king .val-rank-name { color: #fef3c7 !important; text-shadow: 0 0 12px rgba(239, 68, 68, 0.85), 0 0 8px rgba(251, 191, 36, 0.65) !important; }
body.champ-fx-god-king .gs-lp-fill,
body.champ-fx-god-king .lb-lp-fill,
body.champ-fx-god-king .goal-fill,
body.champ-fx-god-king .sp-prog-fill,
body.champ-fx-god-king .val-rr-fill { background: linear-gradient(90deg, #b91c1c, #ef4444, #fbbf24, #fef3c7) !important; }

body.champ-fx-radiant-cloud .msg-row {
  background:
    linear-gradient(125deg, rgba(251, 191, 36, 0.14), rgba(52, 211, 153, 0.12) 55%, rgba(244, 63, 94, 0.10)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 18, 16, 0.96)), var(--ct-bg-end, rgba(20, 13, 8, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #fbbf24) !important;
  border-left: 4px solid var(--ct-secondary, #34d399) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.26), inset 0 0 10px rgba(52, 211, 153, 0.14) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-radiant-cloud ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 14%, rgba(251, 191, 36, 0.24), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(52, 211, 153, 0.20), transparent 48%),
    radial-gradient(circle at 84% 18%, rgba(244, 63, 94, 0.14), transparent 42%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 18, 16, 0.96)), var(--ct-bg-end, rgba(20, 13, 8, 0.97))) !important;
  border: 2px solid var(--ct-primary, #fbbf24) !important;
  border-radius: 10px !important;
  animation: radiantCloudGlow 3.8s ease-in-out infinite;
}
body.champ-fx-radiant-cloud .gs-title,
body.champ-fx-radiant-cloud .gs-champ-name,
body.champ-fx-radiant-cloud .lb-rank,
body.champ-fx-radiant-cloud .sp-title,
body.champ-fx-radiant-cloud .goal-title,
body.champ-fx-radiant-cloud .poll-q,
body.champ-fx-radiant-cloud .gw-title,
body.champ-fx-radiant-cloud .sched-title,
body.champ-fx-radiant-cloud .al-author,
body.champ-fx-radiant-cloud .lt-topic,
body.champ-fx-radiant-cloud .qna-author,
body.champ-fx-radiant-cloud .tron-topic,
body.champ-fx-radiant-cloud .val-rank-name { color: #fefce8 !important; text-shadow: 0 0 12px rgba(251, 191, 36, 0.85), 0 0 8px rgba(52, 211, 153, 0.55) !important; }
body.champ-fx-radiant-cloud .gs-lp-fill,
body.champ-fx-radiant-cloud .lb-lp-fill,
body.champ-fx-radiant-cloud .goal-fill,
body.champ-fx-radiant-cloud .sp-prog-fill,
body.champ-fx-radiant-cloud .val-rr-fill { background: linear-gradient(90deg, #10b981, #fbbf24, #f43f5e) !important; }

body.champ-fx-soul-fighter .msg-row {
  background:
    repeating-linear-gradient(-45deg, rgba(34, 211, 238, 0.08) 0 6px, rgba(255, 31, 113, 0.06) 6px 12px, transparent 12px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(11, 8, 22, 0.97)), var(--ct-bg-end, rgba(20, 6, 22, 0.98))) !important;
  border: 2px solid var(--ct-primary, #22d3ee) !important;
  border-left: 5px solid var(--ct-secondary, #ff1f71) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 3px 3px 0 rgba(255, 31, 113, 0.78) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-soul-fighter ${s}`).join(',\n')} {
  background:
    repeating-linear-gradient(-45deg, rgba(34, 211, 238, 0.06) 0 8px, rgba(255, 31, 113, 0.05) 8px 16px, transparent 16px 32px),
    radial-gradient(circle at 86% 14%, rgba(255, 31, 113, 0.22), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(34, 211, 238, 0.20), transparent 48%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(11, 8, 22, 0.97)), var(--ct-bg-end, rgba(20, 6, 22, 0.98))) !important;
  border: 2.5px solid var(--ct-primary, #22d3ee) !important;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  border-radius: 0 !important;
  animation: soulFighterPulse 3.2s ease-in-out infinite;
}
body.champ-fx-soul-fighter .gs-title,
body.champ-fx-soul-fighter .gs-champ-name,
body.champ-fx-soul-fighter .lb-rank,
body.champ-fx-soul-fighter .sp-title,
body.champ-fx-soul-fighter .goal-title,
body.champ-fx-soul-fighter .poll-q,
body.champ-fx-soul-fighter .gw-title,
body.champ-fx-soul-fighter .sched-title,
body.champ-fx-soul-fighter .al-author,
body.champ-fx-soul-fighter .lt-topic,
body.champ-fx-soul-fighter .qna-author,
body.champ-fx-soul-fighter .tron-topic,
body.champ-fx-soul-fighter .val-rank-name { color: #ffffff !important; text-shadow: 2px 2px 0 rgba(255, 31, 113, 0.9), 0 0 10px rgba(34, 211, 238, 0.75) !important; }
body.champ-fx-soul-fighter .gs-lp-fill,
body.champ-fx-soul-fighter .lb-lp-fill,
body.champ-fx-soul-fighter .goal-fill,
body.champ-fx-soul-fighter .sp-prog-fill,
body.champ-fx-soul-fighter .val-rr-fill { background: linear-gradient(90deg, #22d3ee, #ff1f71, #facc15) !important; }

body.champ-fx-blossom-springs .msg-row {
  background:
    linear-gradient(125deg, rgba(94, 234, 212, 0.14), rgba(251, 113, 133, 0.12) 55%, rgba(253, 230, 138, 0.10)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(10, 18, 28, 0.94)), var(--ct-bg-end, rgba(22, 12, 26, 0.95))) !important;
  border: 1.5px solid var(--ct-primary, #5eead4) !important;
  border-left: 4px solid var(--ct-secondary, #fb7185) !important;
  border-radius: 14px !important;
  box-shadow: 0 0 18px rgba(94, 234, 212, 0.24), inset 0 0 12px rgba(251, 113, 133, 0.12) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-blossom-springs ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 16% 16%, rgba(94, 234, 212, 0.22), transparent 48%),
    radial-gradient(circle at 86% 84%, rgba(251, 113, 133, 0.22), transparent 50%),
    radial-gradient(circle at 82% 16%, rgba(253, 230, 138, 0.16), transparent 44%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(10, 18, 28, 0.94)), var(--ct-bg-end, rgba(22, 12, 26, 0.95))) !important;
  border: 2px solid var(--ct-primary, #5eead4) !important;
  border-radius: 16px !important;
  animation: blossomSpringsGlow 4.4s ease-in-out infinite;
}
body.champ-fx-blossom-springs .gs-title,
body.champ-fx-blossom-springs .gs-champ-name,
body.champ-fx-blossom-springs .lb-rank,
body.champ-fx-blossom-springs .sp-title,
body.champ-fx-blossom-springs .goal-title,
body.champ-fx-blossom-springs .poll-q,
body.champ-fx-blossom-springs .gw-title,
body.champ-fx-blossom-springs .sched-title,
body.champ-fx-blossom-springs .al-author,
body.champ-fx-blossom-springs .lt-topic,
body.champ-fx-blossom-springs .qna-author,
body.champ-fx-blossom-springs .tron-topic,
body.champ-fx-blossom-springs .val-rank-name { color: #fff1f2 !important; text-shadow: 0 0 12px rgba(94, 234, 212, 0.78), 0 0 8px rgba(251, 113, 133, 0.55) !important; }
body.champ-fx-blossom-springs .gs-lp-fill,
body.champ-fx-blossom-springs .lb-lp-fill,
body.champ-fx-blossom-springs .goal-fill,
body.champ-fx-blossom-springs .sp-prog-fill,
body.champ-fx-blossom-springs .val-rr-fill { background: linear-gradient(90deg, #5eead4, #fb7185, #fde68a) !important; }
body.champ-has-skin-art .gs-splash,
body.champ-has-skin-art .map-splash { background-image: var(--ct-skin-splash) !important; opacity: 0.42 !important; }
@keyframes omniCharFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
#omniCharArt {
  position: fixed;
  right: 4px;
  bottom: 2px;
  height: 92px;
  width: auto;
  display: none;
  pointer-events: none;
  z-index: 9;
  filter: drop-shadow(0 0 10px var(--ct-primary, #ff3b5c)) drop-shadow(0 4px 10px rgba(0,0,0,0.85));
  animation: omniCharFloat 4.2s ease-in-out infinite;
}
#omniCharArt.visible { display: block; }
${ALL_OVERLAY_CARDS_SEL.filter((s) => s !== '.gs-card' && s !== '.map-cover').map((s) => `body.champ-has-skin-art ${s}`).join(',\n')} {
  background-image: linear-gradient(145deg, var(--ct-bg-start, rgba(12, 12, 24, 0.86)), var(--ct-bg-end, rgba(8, 10, 20, 0.90))), var(--ct-skin-splash) !important;
  background-size: cover !important;
  background-position: center 22% !important;
  background-blend-mode: multiply !important;
}
</style>
<script>
(function initChampionThemeClient(){
  let ddVerPromise = null;
  const skinUrlCache = {};
  function getDdVer(){
    if (!ddVerPromise) {
      ddVerPromise = fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        .then((r) => (r.ok ? r.json() : null))
        .then((arr) => (Array.isArray(arr) && arr[0] ? arr[0] : '15.22.1'))
        .catch(() => '15.22.1');
    }
    return ddVerPromise;
  }
  async function resolvePackSkinSplash(art){
    if (!art) return '';
    if (art.localAsset && /^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(String(art.localAsset))) {
      return '/api/theme-asset/' + encodeURIComponent(String(art.localAsset));
    }
    if (!art.championId) return '';
    const cid = String(art.championId).replace(/[^A-Za-z0-9]/g, '');
    if (!cid) return '';
    const q = String(art.skinQuery || '').trim().toLowerCase();
    const key = cid + ':' + q;
    if (skinUrlCache[key]) return skinUrlCache[key];
    let num = 0;
    if (q && q !== 'default') {
      try {
        const ver = await getDdVer();
        const res = await fetch('https://ddragon.leagueoflegends.com/cdn/' + ver + '/data/en_US/champion/' + cid + '.json');
        if (res.ok) {
          const j = await res.json();
          const skins = j && j.data && j.data[cid] && Array.isArray(j.data[cid].skins) ? j.data[cid].skins : [];
          const words = q.split(/\s+/).filter(Boolean);
          const hit = skins.find((s) => String(s.name || '').toLowerCase().includes(q))
            || skins.find((s) => words.every((w) => String(s.name || '').toLowerCase().includes(w)))
            || skins.find((s) => words.some((w) => w.length > 3 && String(s.name || '').toLowerCase().includes(w)));
          if (hit && Number.isFinite(Number(hit.num))) num = Number(hit.num);
        }
      } catch (e) {}
    }
    const url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + cid + '_' + num + '.jpg';
    skinUrlCache[key] = url;
    return url;
  }
  function applyChampPack(pack){
    const r = document.documentElement;
    document.body.classList.remove('champ-pack-active', 'champ-has-skin-art', 'champ-fx-jinx-glitch', 'champ-fx-kda-firestarter', 'champ-fx-kda-all-out', 'champ-fx-risen-legend', 'champ-fx-inkshadow', 'champ-fx-dark-cosmic', 'champ-fx-black-rose', 'champ-fx-ravenborn', 'champ-fx-elementalist', 'champ-fx-high-noon', 'champ-fx-arcane-prestige', 'champ-fx-prestige-cosmic', 'champ-fx-god-king', 'champ-fx-radiant-cloud', 'champ-fx-soul-fighter', 'champ-fx-blossom-springs', 'champ-fx-spirit-blossom', 'champ-fx-nightbringer', 'champ-fx-project-cyber', 'champ-fx-ruined-mist', 'champ-fx-neon-pulse', 'champ-fx-hextech');
    r.style.removeProperty('--ct-skin-splash');
    if (!pack || !pack.id) return;
    document.body.classList.add('champ-pack-active');
    if (pack.effect && pack.effect !== 'none') document.body.classList.add('champ-fx-' + pack.effect);
    const c = pack.colors || {};
    if (c.primary) r.style.setProperty('--ct-primary', c.primary);
    if (c.secondary) r.style.setProperty('--ct-secondary', c.secondary);
    if (c.tertiary) r.style.setProperty('--ct-tertiary', c.tertiary);
    if (c.bgStart) r.style.setProperty('--ct-bg-start', c.bgStart);
    if (c.bgEnd) r.style.setProperty('--ct-bg-end', c.bgEnd);
    if (c.text) r.style.setProperty('--ct-text', c.text);
    if (pack.skinArt && pack.skinArt.championId) {
      resolvePackSkinSplash(pack.skinArt).then((url) => {
        if (!url) return;
        r.style.setProperty('--ct-skin-splash', 'url("' + url + '")');
        document.body.classList.add('champ-has-skin-art');
      }).catch(() => {});
    }
    let charEl = document.getElementById('omniCharArt');
    if (pack.characterArt && /^[a-z0-9_-]+\.(png|webp|jpg|jpeg)$/i.test(String(pack.characterArt))) {
      if (!charEl) {
        charEl = document.createElement('img');
        charEl.id = 'omniCharArt';
        charEl.alt = '';
        document.body.appendChild(charEl);
      }
      charEl.src = '/api/theme-asset/' + encodeURIComponent(String(pack.characterArt));
      charEl.classList.add('visible');
    } else if (charEl) {
      charEl.classList.remove('visible');
    }
  }
  function fetchTheme(){
    fetch('/api/champion-theme', { cache: 'no-store' }).then((res) => (res.ok ? res.json() : null)).then((d) => applyChampPack(d && d.pack ? d.pack : null)).catch(() => {});
  }
  function connectThemeWs(){
    try {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try { const p = JSON.parse(ev.data); if (p.type === 'champion-theme') applyChampPack(p.data); } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectThemeWs, 2500);
    } catch (e) {}
  }
  fetchTheme();
  connectThemeWs();
  setInterval(fetchTheme, 3500);
})();
</script>`;

function withChampionTheme(html) {
  return String(html || '').replace('</body>', `${CHAMPION_THEME_INJECT_SNIPPET}</body>`);
}

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
    this.currentSchedule = null;
    this.currentGiveaway = null;
    this.currentGameStats = null;
    this.currentChampionTheme = null;
    this.currentSponsors = null;
    this.currentIcsProvider = null;
    this.soundFileResolver = null;
    this.alertMediaResolver = null;
    this.sponsorMediaResolver = null;
    this.onClientAction = null;
    this.onStreamDeckApi = null;
    this.onVoiceTestApi = null;
    this.onGameWebhook = null;
  }

  start(listenHost = '0.0.0.0') {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        const parsedUrl = new URL(req.url || '/', `http://127.0.0.1:${this.port}`);
        const urlPath = parsedUrl.pathname;

        if (urlPath === '/api/game-stats') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(JSON.stringify(this.currentGameStats || {}));
          return;
        }

        if (urlPath === '/api/sponsors') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(JSON.stringify(this.currentSponsors || { enabled: false, items: [] }));
          return;
        }

        if (urlPath === '/api/champion-theme') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(JSON.stringify({ pack: this.currentChampionTheme || null }));
          return;
        }

        if (urlPath.startsWith('/api/theme-asset/')) {
          const safeFile = decodeURIComponent(urlPath.replace('/api/theme-asset/', '')).trim();
          if (!/^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(safeFile)) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Invalid theme asset');
            return;
          }
          const assetPath = path.join(__dirname, 'assets', 'themes', safeFile);
          if (!fs.existsSync(assetPath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Theme asset not found');
            return;
          }
          const ext = path.extname(assetPath).toLowerCase();
          const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
          res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
          fs.createReadStream(assetPath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/sponsor-media/')) {
          const safeId = decodeURIComponent(urlPath.replace('/api/sponsor-media/', '')).replace(/[^a-zA-Z0-9_-]/g, '');
          const filePath = safeId && this.sponsorMediaResolver ? this.sponsorMediaResolver(safeId) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Sponsor media not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mimeMap = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.apng': 'image/apng'
          };
          res.writeHead(200, {
            'Content-Type': mimeMap[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
          });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/game/')) {
          const kind = urlPath.replace('/api/game/', '').replace(/\/+$/, '');
          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
            if (rawBody.length > 262144) rawBody = rawBody.slice(0, 262144);
          });
          req.on('end', async () => {
            let body = {};
            if (rawBody) {
              try { body = JSON.parse(rawBody); } catch (e) {}
            }
            try {
              if (this.onGameWebhook) await this.onGameWebhook(kind, body);
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.writeHead(400, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        if (urlPath.startsWith('/api/alert-media/')) {
          const parts = urlPath.replace('/api/alert-media/', '').split('/');
          const allowedEvTypes = ['follow', 'sub', 'resub', 'subgift', 'bits', 'raid'];
          const allowedKinds = ['image', 'audio'];
          const safeEvType = allowedEvTypes.find((t) => t === parts[0]);
          const safeKind = allowedKinds.find((k) => k === parts[1]);
          const filePath = safeEvType && safeKind && this.alertMediaResolver ? this.alertMediaResolver(safeEvType, safeKind) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Alert media not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mimeMap = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.apng': 'image/apng',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.ogg': 'audio/ogg',
            '.m4a': 'audio/mp4',
            '.aac': 'audio/aac',
            '.flac': 'audio/flac'
          };
          const mime = mimeMap[ext] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/sound/')) {
          const soundId = decodeURIComponent(urlPath.replace('/api/sound/', '').trim());
          if (!/^[a-zA-Z0-9_-]{1,64}$/.test(soundId)) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Invalid sound id');
            return;
          }
          const filePath = this.soundFileResolver ? this.soundFileResolver(soundId) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Sound not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mime = ext === '.wav' ? 'audio/wav' : ext === '.ogg' ? 'audio/ogg' : 'audio/mpeg';
          res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath === '/api/voice/test' && req.method === 'POST') {
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
              const result = this.onVoiceTestApi
                ? await this.onVoiceTestApi(body.action || '', body.payload || {})
                : { ok: false, error: 'Voice test handler not registered.' };
              res.writeHead(result?.ok === false ? 400 : 200, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
              });
              res.end(JSON.stringify(result || { ok: true }));
            } catch (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

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

        if (urlPath === '/schedule.ics') {
          const ics = this.currentIcsProvider ? this.currentIcsProvider() : 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR';
          res.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'inline; filename="stream-schedule.ics"',
            'Cache-Control': 'no-cache'
          });
          res.end(ics);
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        if (urlPath === '/dock') {
          res.end(OBS_CUSTOM_DOCK_HTML);
        } else if (urlPath === '/spotify') {
          res.end(withChampionTheme(OBS_SPOTIFY_HTML));
        } else if (urlPath === '/tablet') {
          res.end(OBS_TABLET_HTML);
        } else if (urlPath === '/alerts') {
          res.end(withChampionTheme(OBS_ALERTS_HTML));
        } else if (urlPath === '/goals') {
          res.end(withChampionTheme(OBS_GOALS_HTML));
        } else if (urlPath === '/poll') {
          res.end(withChampionTheme(OBS_POLL_HTML));
        } else if (urlPath === '/schedule') {
          res.end(withChampionTheme(OBS_SCHEDULE_HTML));
        } else if (urlPath === '/giveaway') {
          res.end(withChampionTheme(OBS_GIVEAWAY_HTML));
        } else if (urlPath === '/soundboard') {
          res.end(OBS_SOUNDBOARD_HTML);
        } else if (urlPath === '/game-stats') {
          res.end(withChampionTheme(OBS_GAME_STATS_HTML));
        } else if (urlPath === '/lol-map') {
          res.end(withChampionTheme(OBS_LOL_MAP_HTML));
        } else if (urlPath === '/lol-bg') {
          res.end(OBS_LOL_BG_HTML);
        } else if (urlPath === '/lol-build') {
          res.end(withChampionTheme(OBS_LOL_BUILD_HTML));
        } else if (urlPath === '/jc-lowerthird') {
          res.end(withChampionTheme(OBS_JC_LOWERTHIRD_HTML));
        } else if (urlPath === '/jc-qna') {
          res.end(withChampionTheme(OBS_JC_QNA_HTML));
        } else if (urlPath === '/tron-talk') {
          res.end(withChampionTheme(OBS_TRON_TALK_HTML));
        } else if (urlPath === '/val-bar') {
          res.end(withChampionTheme(OBS_VAL_BAR_HTML));
        } else if (urlPath === '/val-map') {
          res.end(withChampionTheme(OBS_VAL_MAP_HTML));
        } else if (urlPath === '/sponsors') {
          res.end(withChampionTheme(OBS_SPONSORS_HTML));
        } else {
          res.end(withChampionTheme(OBS_OVERLAY_HTML));
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
        if (this.currentSchedule) {
          ws.send(JSON.stringify({ type: 'schedule', data: this.currentSchedule }));
        }
        if (this.currentGiveaway) {
          ws.send(JSON.stringify({ type: 'giveaway', data: this.currentGiveaway }));
        }
        if (this.currentGameStats) {
          ws.send(JSON.stringify({ type: 'game-stats', data: this.currentGameStats }));
        }
        if (this.currentSponsors) {
          ws.send(JSON.stringify({ type: 'sponsors', data: this.currentSponsors }));
        }
        if (this.currentChampionTheme !== undefined) {
          ws.send(JSON.stringify({ type: 'champion-theme', data: this.currentChampionTheme }));
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

  broadcastObsWsState(st) {
    this.currentObsWsState = st;
    this._broadcast({ type: 'obs-ws', data: st });
  }

  broadcastSchedule(schedulePayload) {
    this.currentSchedule = schedulePayload;
    this._broadcast({ type: 'schedule', data: schedulePayload });
  }

  setIcsProvider(fn) {
    this.currentIcsProvider = typeof fn === 'function' ? fn : null;
  }

  broadcastGiveaway(giveawayPayload) {
    this.currentGiveaway = giveawayPayload;
    this._broadcast({ type: 'giveaway', data: giveawayPayload });
  }

  broadcastSound(soundPayload) {
    this._broadcast({ type: 'soundboard', data: soundPayload });
  }

  setSoundFileResolver(fn) {
    this.soundFileResolver = typeof fn === 'function' ? fn : null;
  }

  setAlertMediaResolver(fn) {
    this.alertMediaResolver = typeof fn === 'function' ? fn : null;
  }

  setSponsorMediaResolver(fn) {
    this.sponsorMediaResolver = typeof fn === 'function' ? fn : null;
  }

  broadcastSponsors(payload) {
    this.currentSponsors = payload;
    this._broadcast({ type: 'sponsors', data: payload });
  }

  broadcastChampionTheme(pack) {
    this.currentChampionTheme = pack || null;
    this._broadcast({ type: 'champion-theme', data: this.currentChampionTheme });
  }

  setVoiceTestHandler(fn) {
    this.onVoiceTestApi = typeof fn === 'function' ? fn : null;
  }

  broadcastGameStats(statsPayload) {
    this.currentGameStats = statsPayload;
    this._broadcast({ type: 'game-stats', data: statsPayload });
  }

  stop() {
    if (this.wss) this.wss.close();
    if (this.server) this.server.close();
  }
}

module.exports = { ObsServer };
