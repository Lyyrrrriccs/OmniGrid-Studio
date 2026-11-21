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
| **Multi-Platform Chat** | Simultaneous **Twitch** (IRC WebSocket + Helix Clip/Marker), **YouTube Live** (no API key for reading, auto stream discovery, plus optional Google OAuth2 PKCE for sending chat), and **TikTok Live** (Webcast) feeds merged chronologically with per-platform enable/disable, auto-reconnect, error isolation, and 3-layer deduplication. |
| **Animated Emotes** | **7TV** (global & channel), **BTTV**, and **FFZ** (global & channel) plus native **Twitch**, **YouTube**, and **TikTok** emotes — animated WebP/GIF support, individual provider toggles, and zero line-height inflation. |
| **Clean Cockpit & Central Config** | Slim live-control sidebar (Spotify, Live-Poll, TTS, Twitch Clip & Marker, OBS WebSocket v5) paired with a tabbed **Central Config Page (`⚙️ Config`)** for Platforms, Profile/Events, Design/Emotes, OBS/Alerts, Bot/Auto-Mod, Tablet/Stream Deck & System. |
| **OBS Integration, Widgets & WebSocket v5** | Scene-independent **OBS Custom Browser Dock** (`/dock`), **OBS Stream Overlay** (`/`), **OBS Alert-Box Overlay** (`/alerts` with custom GIF/audio media), **OBS Goal-Bar** (`/goals`), **OBS Multistream Poll** (`/poll` with show/hide toggle), **OBS Spotify Widget** (`/spotify`), and direct **OBS WebSocket v5** control (scenes, replay buffer, mic mute, record, stream). |
| **Chat-Timer, Auto-Mod & TTS** | Rotating **Chat-Timer** info messages, **Auto-Mod** rules (block links, caps/symbol spam, word blacklist with Twitch auto-delete/timeout), and **Text-to-Speech (TTS)** queue for alerts and `!tts` commands. |
| **Event Highlighting & Keyword Alerts** | Distinct styling (`bar`, `banner`, `outline`, color & intensity) for **Follows**, **Subs**, **Resubs**, **Gifted Subs**, **Bits/SuperChats/Gifts**, **Raids**, and **Highlighted Messages**, plus custom **Keyword Alerts** with sound ping. |
| **Quick User & Message Menu** | Click or right-click any message for user overview (avatar, roles, Twitch account age), copy text/username, reply, open profile, delete, timeout (`10s`, `1m`, `10m`, `1h`), 2-step ban, and unban with strict platform permission checks. |
| **Stream Deck & Tablet Companion** | Built-in local REST API (`http://127.0.0.1:4588/api/streamdeck/*`) + **Tablet & iPad Companion** (`http://<LAN-IP>:4588/tablet` or Tailscale VPN via QR code) for touch chat, quick-reply, clips, markers, OBS controls & polls without installing an app. |
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
| **OBS Alert-Box Overlay** | `http://127.0.0.1:4588/alerts` | Transparent queued alert box (Follow, Sub, Resub, Sub-Gift, Bits/SuperChat, Raid) with custom GIF/audio & chime |
| **OBS Goal-Bar** | `http://127.0.0.1:4588/goals` | Transparent Follower/Sub progress bar with auto-increment on live events |
| **OBS Multistream Poll** | `http://127.0.0.1:4588/poll` | Live cross-platform chat voting (`!vote 1..N`) with show/hide toggle |
| **OBS Spotify Widget** | `http://127.0.0.1:4588/spotify` | Transparent Now-Playing card with album cover & live track updates |
| **Tablet & iPad Companion** | `http://<LAN-IP>:4588/tablet` | Touch-optimized chat, quick-reply, clips, OBS & stream control dashboard (WLAN + Tailscale QR switcher) |

---

## 🎛️ Stream Deck Integration

In the **Elgato Stream Deck** app, add **System → Website**, paste one of the local URLs below (available as 1-click copy buttons inside **⚙️ Config → 📱 Tablet & Stream Deck**), and enable **"GET request in background"**:

| Action | Endpoint |
|---|---|
| Pin latest message to OBS | `http://127.0.0.1:4588/api/streamdeck/pin-last` |
| Unpin message from OBS | `http://127.0.0.1:4588/api/streamdeck/unpin` |
| Toggle Poll visibility | `http://127.0.0.1:4588/api/streamdeck/toggle-poll` |
| Create Twitch Clip / Marker / Combo | `.../clip` • `.../marker?description=Highlight` • `.../clip-and-marker?description=Highlight` |
| OBS Replay / Mic Mute / Record / Stream / Scene | `.../obs-replay` • `.../obs-mic` • `.../obs-record` • `.../obs-stream` • `.../obs-scene?name=Scene` |
| Clear chat feed & OBS | `http://127.0.0.1:4588/api/streamdeck/clear-chat` |
| Trigger OBS test alert | `http://127.0.0.1:4588/api/streamdeck/test-alert?type=sub` |
| Send quick chat message | `http://127.0.0.1:4588/api/streamdeck/send?text=GG!` |
| Toggle compact mode / sound / Always-on-Top | `.../toggle-compact` • `.../toggle-sound` • `.../toggle-always-on-top` |
| Reconnect all platforms | `http://127.0.0.1:4588/api/streamdeck/reconnect?platform=all` |
| Spotify: Next / Prev / Play-Pause / Announce | `.../spotify-next` • `.../spotify-prev` • `.../spotify-playpause` • `.../spotify-announce` |

---

## 📚 Documentation

- **[English User Guide (GUIDE.md)](./GUIDE.md)** — Complete setup walkthrough (Twitch OAuth token, YouTube, TikTok, OBS, Stream Deck, Keyword Alerts, Moderation).
- **[Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)** — Ausführliche Schritt-für-Schritt-Anleitung auf Deutsch.
- **[Deutsches README (README.de.md)](./README.de.md)** — Projektübersicht auf Deutsch.
