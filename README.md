<div align="center">

# ⚡ OmniGrid Studio

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

## 💡 Why OmniGrid Studio? (Comparison & All-in-One Scope)

Normally, multistreamers have to stitch together **4–6 separate tools and paid cloud subscriptions**:
- **Restream / Streamlabs / StreamElements** for chat & alerts (cloud-locked, monthly paywalls, no local 9:16 FFmpeg editor, no WebHID 2nd-keyboard control, no LAN tablet cockpit).
- **Streamer.bot / Mix It Up** for OBS automation & soundboards (Windows-only, steep setup, no built-in Twitch+YouTube+TikTok chat feed with 7TV/BTTV/FFZ emotes or video editing).
- **Eklipse.gg / OpusClip / CapCut** for vertical 9:16 Shorts (cloud uploads, watermarks/limits, disconnected from OBS Replay Buffer & live chat).
- **Pingcord / MEE6 / Buffer** for Go-Live announcements & stream schedules (separate bots/services, no built-in 1080×1350 graphic generator or multi-platform sync).

**OmniGrid Studio brings all of this together in one 100% local desktop suite (macOS & Windows, zero subscriptions):**
- **Unified Live Cockpit:** Twitch, YouTube Live & TikTok Live chat + moderation + 7TV/BTTV/FFZ emotes + **Chat-Hype Detector** (auto Twitch markers & OBS replays).
- **Broadcast & Overlay Engine:** OBS WebSocket v5 control + local overlays (`/`, `/dock`, `/alerts`, `/goals`, `/poll`, `/spotify`, `/schedule`, `/giveaway`, `/soundboard`) + **Integrated Soundboard** + **Live Giveaway Wheel** + **Tablet Companion** + **Stream Deck API**.
- **Post-Production & Growth in One Place:** Built-in **FFmpeg Clip & 9:16 Shorts Studio** (with visual scrubber & direct YouTube/TikTok upload) + **Discord, Go-Live & Schedule Studio** (Discord embeds, X API v2, Instagram Graph API + PNG generator, Bluesky, Mastodon, Twitch Schedule, `.ics` calendar).

---

## ✨ Features

| Category | Highlights |
|---|---|
| **Local Multi-Platform Streaming Relay (`📡 Multi-Stream`)** | **OBS renders & encodes only once (`1×`)** to `rtmp://127.0.0.1:1935/live/omnigrid` (with 1-click **OBS Auto-Config** via WebSocket v5) while OmniGrid Studio's built-in **FFmpeg Tee-Muxer (`-c copy`, 0% extra GPU/CPU encoding load)** distributes your stream simultaneously to **Twitch**, **YouTube Live**, **TikTok Live**, and **Kick / Custom RTMP** (`onfail=ignore` fault isolation + live bitrate/FPS telemetry). |
| **Multi-Platform Chat** | Simultaneous **Twitch** (IRC WebSocket + Helix Clip/Marker), **YouTube Live** (no API key for reading, auto stream discovery, plus optional Google OAuth2 PKCE for sending chat), and **TikTok Live** (Webcast) feeds merged chronologically with per-platform enable/disable, auto-reconnect, error isolation, and 3-layer deduplication. |
| **Animated Emotes** | **7TV** (global & channel), **BTTV**, and **FFZ** (global & channel) plus native **Twitch**, **YouTube**, and **TikTok** emotes — animated WebP/GIF support, individual provider toggles, and zero line-height inflation. |
| **Clean Cockpit, Stream-Manager & Help** | Slim live-control sidebar (Spotify, Live-Poll, TTS, Twitch Clip & Marker, OBS WebSocket v5, **Stream-Manager** for updating Twitch & YouTube Title, Game/Category & Tags simultaneously) paired with a tabbed **Central Config (`⚙️ Config`)** and an integrated **Help Window (`📖 Anleitung`)**. |
| **Clip & Replay Studio (`🎬 Clips`)** | Built-in **FFmpeg** video workflow for **OBS Replay Buffer** & recordings: visual **Dual-Range Timeline Scrubber** directly on the video player, lossless **16:9 Trim**, vertical **9:16 Shorts/TikTok/Reels** export (blur background or center crop), rename/trash management, **direct YouTube Upload** (OAuth2), and **TikTok Quick-Upload**. |
| **Discord, Social & Schedule Studio (`📅 Schedule & Go-Live`)** | **Discord Webhook** Go-Live & Schedule Embeds (with dynamic local timestamps & OBS auto-post), **X (Twitter) API v2**, **Instagram Graph API** + **1080×1350 PNG Graphic Generator**, **Bluesky**, **Mastodon**, **Twitch Schedule Sync**, **OBS `/schedule` Overlay**, **`.ics` Calendar Feed**, and `!schedule` chat command. |
| **Giveaway, Soundboard & Hype Detector** | **Live-Giveaway (`🎁 Giveaway`)** with `!join` chat entry, Sub/VIP multipliers & animated OBS wheel (`/giveaway`), **Soundboard (`🔊 Sounds`)** routed into OBS (`/alerts` & `/soundboard`) + Stream Deck API, and **Chat-Hype Detector (`🔥 Hype`)** for automatic Twitch Markers, OBS Replays & Clips on chat spikes. |
| **OBS, Scene Editor & Smart Lighting (Elgato + Govee)** | Scene-independent **OBS Custom Browser Dock** (`/dock`), **OBS Stream Overlay** (`/`), **OBS Alert-Box Overlay** (`/alerts`), **OBS Goal-Bar** (`/goals`), **OBS Multistream Poll** (`/poll`), **OBS Spotify Widget** (`/spotify`), direct **OBS WebSocket v5** control, interactive **OBS Scene & Source Editor (`🎛️ Szenen-Editor`, 1080p HD)**, **Elgato Key Light** LAN auto-on, and **Govee Smart-Light & Event Scenes (`🌈 Govee`)** coupled to Stream Start/Stop, Follows, Subs, Resubs, Sub-Gifts, Bits/Gifts, Raids & Hype spikes (using your own Govee API key). |
| **GitHub Auto-Updater** | Built-in **GitHub Releases Auto-Updater** checks for new versions on startup (or manually via **🔄 Nach Updates suchen**), downloads the matching macOS/Windows release asset automatically, and offers one-click installation & relaunch. |
| **Custom Commands, Timer, Auto-Mod & TTS** | **Custom Chat-Commands** (`!dc`, `!specs`, etc. with `{user}`/`{channel}`/`{uptime}` variables & cooldown), rotating **Chat-Timer** info messages, **Auto-Mod** rules (block links, caps/symbol spam, word blacklist with Twitch auto-delete/timeout), and **Text-to-Speech (TTS)** queue for alerts and `!tts`. |
| **Event Highlighting & Keyword Alerts** | Distinct styling (`bar`, `banner`, `outline`, color & intensity) for **Follows**, **Subs**, **Resubs**, **Gifted Subs**, **Bits/SuperChats/Gifts**, **Raids**, and **Highlighted Messages**, plus custom **Keyword Alerts** with sound ping. |
| **Quick User & Message Menu** | Click or right-click any message for user overview (avatar, roles, Twitch account age), copy text/username, reply, open profile, delete, timeout (`10s`, `1m`, `10m`, `1h`), 2-step ban, and unban with strict platform permission checks. |
| **Stream Deck & Tablet Companion** | Built-in local REST API (`http://127.0.0.1:4588/api/streamdeck/*`) + **Tablet & iPad Companion** (`http://<LAN-IP>:4588/tablet` or Tailscale VPN via QR code) for touch chat, quick-reply, clips, markers, OBS controls & polls without installing an app. |
| **Peripherals & Global Hotkeys** | Dedicated **2nd Keyboard / Macro Pad & 2nd Mouse** support via **WebHID** (type/send chat or scroll feed without alt-tabbing out of games) + system-wide **Global Hotkeys**. |
| **Spotify, Apple & Amazon Music + `!song` Bot** | Zero-config local **Spotify**, **Apple Music**, & **Amazon Music** desktop bridge (no API key needed, with automatic album artwork lookup): live Now Playing controls, automatic Twitch/YouTube `!song` / `!music` replies, and transparent **OBS Music Widget** (`http://127.0.0.1:4588/spotify`). |
| **Chat Search, Export & Diagnostics** | Live **Chat Search (`⌘/Ctrl+F`)** with platform & author filter, **Chat-Log Export (`💾 Export`)** as `.txt` or `.json`, 60fps `requestAnimationFrame` batch rendering, configurable DOM/RAM limits, JSON config backup, **Live Statistics & Logs**, bot filter, and spam collapsing (`×N`). |

---

## 🚀 Installation & Quick Start

### Option 1: Standalone Desktop App (No Terminal Needed)
- **macOS:** Double-click `dist/OmniGridStudio.app` (or drag it into `/Applications`).
- **Windows:** Copy `dist/OmniGridStudio-win32-x64` to your PC and double-click `OmniGridStudio.exe`.

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
npm run build:mac   # Creates dist/OmniGridStudio.app
npm run build:win   # Creates dist/OmniGridStudio-win32-x64/OmniGridStudio.exe
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

- **[Changelog (CHANGELOG.md)](./CHANGELOG.md)** — Full version history and release notes.
- **[English User Guide (GUIDE.md)](./GUIDE.md)** — Complete setup walkthrough (Twitch OAuth token, YouTube, TikTok, OBS, Clip & Replay Studio, Stream-Manager, Custom Commands, Stream Deck).
- **[Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)** — Ausführliche Schritt-für-Schritt-Anleitung auf Deutsch.
- **[Deutsches README (README.de.md)](./README.de.md)** — Projektübersicht auf Deutsch.
