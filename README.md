# OmniStream Chat

Cross-platform (Windows & macOS) Multistream Chat Aggregator for **Twitch**, **YouTube Live**, and **TikTok Live** with **7TV / BTTV / FFZ animated emotes**, **OBS Custom Browser Dock & Overlay**, **event highlighting**, and **quick user moderation**.

## Features

- **Multi-Platform Chat**: Simultaneous Twitch (IRC), YouTube Live (no API key required), and TikTok Live (Webcast) connectors with per-platform enable/disable, auto-reconnect, error isolation, and 3-layer deduplication.
- **Animated Emotes**: 7TV (global & channel), BTTV, FFZ, plus native Twitch, YouTube, and TikTok emotes with individual provider toggles and zero line-height inflation.
- **Compact Chat Design**: True inline layout optimized for a tall, slim window next to OBS, customizable font sizes, username truncation, divider lines, dark mode/background opacity, and live sync to OBS.
- **OBS Integration & Standalone Window**:
  - Scene-independent OBS Custom Browser Dock (`http://127.0.0.1:4588/dock`)
  - OBS Stream Overlay (`http://127.0.0.1:4588`)
  - Standalone, movable, full-height chat window (`minWidth: 220px`) with persistent window bounds
- **Event Highlighting**: Separate toggles, colors, styles (`bar`, `banner`, `outline`), and intensity for Follows, Subs, Resubs, Gifted Subs, Bits/SuperChats/Gifts, Raids, and Highlighted Messages.
- **User & Message Quick Menu**: Click or right-click any message for user overview (avatar, roles, account age), copy text/username, reply, open profile, delete, timeout (`10s`, `1m`, `10m`, `1h`), 2-step ban, and unban with strict platform permission checks.
- **Performance & Diagnostics**: 60fps `requestAnimationFrame` batch rendering, RAM/DOM limits, JSON config export/import, live session statistics, and connection diagnostic logs.

## Development & Building

```bash
npm install
npm start          # Launch app in development
npm run demo       # Launch with simulated multistream demo chat
npm run build:mac  # Build standalone macOS .app (dist/OmniStreamChat.app)
npm run build:win  # Build standalone Windows .exe (dist/OmniStreamChat-win32-x64/OmniStreamChat.exe)
```
