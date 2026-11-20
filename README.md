<div align="center">

# ⚡ OmniStream Chat

**Cross-Platform Multistream Chat Aggregator for Twitch, YouTube Live & TikTok Live**  
*Built for Windows & macOS — with 7TV/BTTV/FFZ Animated Emotes, OBS Custom Browser Dock, Event Highlighting, Quick Moderation & Elgato Stream Deck Integration.*

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-blue?style=flat-square)](#installation--quick-start)
[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=flat-square&logo=electron)](#build-standalone-apps)
[![OBS](https://img.shields.io/badge/OBS-Custom%20Dock%20%26%20Overlay-302E31?style=flat-square&logo=obsstudio)](#obs-integration)
[![Stream Deck](https://img.shields.io/badge/Elgato-Stream%20Deck%20API-000000?style=flat-square)](#stream-deck-integration)

🌐 **Language:** **English** | [Deutsch (README.de.md)](./README.de.md)  
📖 **Step-by-Step User Guides:** [English Guide (GUIDE.md)](./GUIDE.md) | [Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)

</div>

---

## ✨ Features

| Category | Highlights |
|---|---|
| **Multi-Platform Chat** | Simultaneous **Twitch** (IRC WebSocket), **YouTube Live** (no API key for reading, auto stream discovery, plus optional Google OAuth2 PKCE for sending chat), and **TikTok Live** (Webcast) feeds merged chronologically with per-platform enable/disable, auto-reconnect, error isolation, and 3-layer deduplication. |
| **Animated Emotes** | **7TV** (global & channel), **BTTV**, and **FFZ** (global & channel) plus native **Twitch**, **YouTube**, and **TikTok** emotes — animated WebP/GIF support, individual provider toggles, and zero line-height inflation. |
| **Compact Streamer Layout** | True inline flow optimized for a tall, slim window (`minWidth: 220px`) next to OBS, customizable font sizes, username truncation, toggleable platform icons/timestamps, divider lines, and live color/opacity sync to OBS. |
| **OBS Integration & Alert-Box** | Scene-independent **OBS Custom Browser Dock** (`/dock`), **OBS Stream Overlay** (`/`), configurable **OBS Alert-Box Overlay** (`/alerts` with per-event toggles, animations & sound), **OBS Spotify Widget** (`/spotify`), and a movable full-height **Standalone Chat Window**. |
| **Event Highlighting & Keyword Alerts** | Distinct styling (`bar`, `banner`, `outline`, color & intensity) for **Follows**, **Subs**, **Resubs**, **Gifted Subs**, **Bits/SuperChats/Gifts**, **Raids**, and **Highlighted Messages**, plus custom **Keyword Alerts** with sound ping. |
| **Quick User & Message Menu** | Click or right-click any message for user overview (avatar, roles, Twitch account age), copy text/username, reply, open profile, delete, timeout (`10s`, `1m`, `10m`, `1h`), 2-step ban, and unban with strict platform permission checks. |
| **Stream Deck & Tablet Companion** | Built-in local REST API (`http://127.0.0.1:4588/api/streamdeck/*`) + **Tablet & iPad Companion** (`http://<LAN-IP>:4588/tablet` via QR code) for touch chat, quick-reply, and stream controls without installing an app. |
| **Peripherals & Global Hotkeys** | Dedicated **2nd Keyboard / Macro Pad & 2nd Mouse** support via **WebHID** (type/send chat or scroll feed without alt-tabbing out of games) + system-wide **Global Hotkeys**. |
| **Spotify Live & `!song` Bot** | Zero-config local Spotify Desktop bridge (no API key needed): live Now Playing controls, automatic Twitch/YouTube `!song` / `!music` replies, and transparent **OBS Spotify Widget** (`http://127.0.0.1:4588/spotify`). |
| **Performance & Diagnostics** | 60fps `requestAnimationFrame` batch rendering, configurable DOM/RAM limits, JSON backup export/import, collapsible **Live Statistics & Connection Logs** drawer, bot filter, and spam repeat collapsing (`×N`). |

---

## 🚀 Installation & Quick Start

### Option 1: Standalone Desktop App (No Terminal Needed)
- **macOS:** Double-click `dist/OmniStreamChat.app` (or drag it into `/Applications`).
- **Windows:** Copy `dist/OmniStreamChat-win32-x64` to your PC and double-click `OmniStreamChat.exe`.

### Option 2: Run from Source
```bash
git clone <YOUR_REPO_URL>
cd omni-stream-chat
npm install
npm start       # Launch the desktop app
npm run demo    # Launch with simulated multistream chat (Twitch + YouTube + TikTok + 7TV)
```

---

## 🛠️ Build Standalone Apps

```bash
npm run build:mac   # Creates dist/OmniStreamChat.app
npm run build:win   # Creates dist/OmniStreamChat-win32-x64/OmniStreamChat.exe
```

---

## 🎥 OBS & Companion Integration

| Target | URL | Purpose |
|---|---|---|
| **OBS Custom Browser Dock** | `http://127.0.0.1:4588/dock` | Interactive, scene-independent chat dock inside OBS (`View → Docks → Custom Browser Docks`) |
| **OBS Stream Overlay** | `http://127.0.0.1:4588` | Transparent Browser Source for your stream viewers (with live pinned messages) |
| **OBS Alert-Box Overlay** | `http://127.0.0.1:4588/alerts` | Transparent queued alert box (Follow, Sub, Resub, Sub-Gift, Bits/SuperChat, Raid) with per-event toggles & audio chime |
| **OBS Spotify Widget** | `http://127.0.0.1:4588/spotify` | Transparent Now-Playing card with album cover & live track updates |
| **Tablet & iPad Companion** | `http://<LAN-IP>:4588/tablet` | Touch-optimized chat, quick-reply & stream control dashboard on any tablet (QR code in app) |

---

## 🎛️ Stream Deck Integration

In the **Elgato Stream Deck** app, add **System → Website**, paste one of the local URLs below (available as 1-click copy buttons inside the app), and enable **"GET request in background"**:

| Action | Endpoint |
|---|---|
| Pin latest message to OBS | `http://127.0.0.1:4588/api/streamdeck/pin-last` |
| Unpin message from OBS | `http://127.0.0.1:4588/api/streamdeck/unpin` |
| Clear chat feed & OBS | `http://127.0.0.1:4588/api/streamdeck/clear-chat` |
| Trigger OBS test alert | `http://127.0.0.1:4588/api/streamdeck/test-alert?type=sub` |
| Send quick chat message | `http://127.0.0.1:4588/api/streamdeck/send?text=GG!` |
| Toggle compact mode | `http://127.0.0.1:4588/api/streamdeck/toggle-compact` |
| Toggle sound alerts | `http://127.0.0.1:4588/api/streamdeck/toggle-sound` |
| Toggle Always-on-Top | `http://127.0.0.1:4588/api/streamdeck/toggle-always-on-top` |
| Reconnect all platforms | `http://127.0.0.1:4588/api/streamdeck/reconnect?platform=all` |
| Spotify: Next / Prev / Play-Pause | `.../spotify-next` • `.../spotify-prev` • `.../spotify-playpause` |
| Spotify: Announce track in chat | `http://127.0.0.1:4588/api/streamdeck/spotify-announce` |

---

## 📚 Documentation

- **[English User Guide (GUIDE.md)](./GUIDE.md)** — Complete setup walkthrough (Twitch OAuth token, YouTube, TikTok, OBS, Stream Deck, Keyword Alerts, Moderation).
- **[Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)** — Ausführliche Schritt-für-Schritt-Anleitung auf Deutsch.
- **[Deutsches README (README.de.md)](./README.de.md)** — Projektübersicht auf Deutsch.
