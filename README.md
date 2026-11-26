<div align="center">

# ⚡ OmniGrid Studio

**Cross-Platform Multistream Chat Aggregator for Twitch, YouTube Live & TikTok Live**  
*Built for Windows & macOS — with 7TV/BTTV/FFZ Animated Emotes, OBS Custom Browser Dock, Event Highlighting, Quick Moderation & Elgato Stream Deck Integration.*

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-blue?style=flat-square)](#installation--quick-start)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local--First%20%7C%20Zero%20Telemetry-10b981?style=flat-square)](./PRIVACY.md)
[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=flat-square&logo=electron)](#build-standalone-apps)
[![OBS](https://img.shields.io/badge/OBS-Custom%20Dock%20%26%20Overlay-302E31?style=flat-square&logo=obsstudio)](#obs-integration)
[![Stream Deck](https://img.shields.io/badge/Elgato-Stream%20Deck%20API-000000?style=flat-square)](#stream-deck-integration)

🌐 **Language:** **English** | [Deutsch (README.de.md)](./README.de.md)  
📖 **Step-by-Step User Guides:** [English Guide (GUIDE.md)](./GUIDE.md) | [Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md) | [🔒 Privacy & Zero-Telemetry Proof (PRIVACY.md)](./PRIVACY.md)

</div>

---

## 💡 Why OmniGrid Studio? (Comparison & All-in-One Scope)

Normally, multistreamers have to stitch together **4–6 separate tools and paid cloud subscriptions**:
- **Restream / Streamlabs / StreamElements** for chat & alerts (cloud-locked, monthly paywalls, no local 9:16 FFmpeg editor, no WebHID 2nd-keyboard control, no LAN tablet cockpit).
- **Streamer.bot / Mix It Up** for OBS automation & soundboards (Windows-only, steep setup, no built-in Twitch+YouTube+TikTok chat feed with 7TV/BTTV/FFZ emotes or video editing).
- **Eklipse.gg / OpusClip / CapCut** for vertical 9:16 Shorts (cloud uploads, watermarks/limits, disconnected from OBS Replay Buffer & live chat).
- **Pingcord / MEE6 / Buffer** for Go-Live announcements & stream schedules (separate bots/services, no built-in 1080×1350 graphic generator or multi-platform sync).

**OmniGrid Studio brings all of this together in one 100% local desktop suite (macOS & Windows, zero subscriptions):**
- **Unified Live Cockpit (🇩🇪 DE / 🇬🇧 EN):** Twitch, YouTube Live & TikTok Live chat + moderation + 7TV/BTTV/FFZ emotes + **live JSON language switcher (`🇩🇪 DE` / `🇬🇧 EN`)** + **Chat-Hype Detector** (keyword-hit & spike detection, auto Twitch clips posted to chat, stream markers & OBS replays).
- **Broadcast, Game Addons & Overlay Engine:** OBS WebSocket v5 control + **13 built-in local overlays** (`/`, `/dock`, `/alerts`, `/goals`, `/poll`, `/spotify`, `/schedule`, `/giveaway`, `/soundboard`, `/game-stats`, `/lol-build`, `/lol-map`, `/jc-lowerthird`, `/jc-qna`) + **Complete League of Legends & Just Chatting Addon Suites** + **Integrated Soundboard** + **Live Giveaway Wheel** + **Tablet Companion** + **Stream Deck API**.
- **Post-Production & Growth in One Place:** Built-in **FFmpeg Clip & 9:16 Shorts Studio** (with visual scrubber & direct YouTube/TikTok upload) + **Discord Live-Announcer & Schedule Studio** (live-updating Discord embeds with stream-end summary, X API v2, Instagram Graph API + PNG generator, Bluesky, Mastodon, Twitch Schedule, `.ics` calendar).

---

## ✨ Features

| Category | Highlights |
|---|---|
| **Local Multi-Platform Streaming Relay (`📡 Multi-Stream`)** | **OBS renders & encodes only once (`1×`)** to `rtmp://127.0.0.1:1935/live/omnigrid` (with 1-click **OBS Auto-Config** via WebSocket v5) while OmniGrid Studio's built-in **FFmpeg Tee-Muxer (`-c copy`, 0% extra GPU/CPU encoding load)** distributes your stream simultaneously to **Twitch**, **YouTube Live**, **TikTok Live**, and **Kick / Custom RTMP** (`onfail=ignore` fault isolation + live bitrate/FPS telemetry). |
| **Multi-Platform Chat** | Simultaneous **Twitch** (IRC WebSocket + Helix Clip/Marker), **YouTube Live** (no API key for reading, auto stream discovery, plus optional Google OAuth2 PKCE for sending chat), and **TikTok Live** (Webcast) feeds merged chronologically with per-platform enable/disable, auto-reconnect, error isolation, and 3-layer deduplication. |
| **Animated Emotes** | **7TV** (global & channel), **BTTV**, and **FFZ** (global & channel) plus native **Twitch**, **YouTube**, and **TikTok** emotes — animated WebP/GIF support, individual provider toggles, and zero line-height inflation. |
| **Clean Cockpit, Stream-Manager & Help** | Slim live-control sidebar (Spotify, Live-Poll, TTS, Twitch Clip & Marker, OBS WebSocket v5, **Stream-Manager** for updating Twitch & YouTube Title, Game/Category & Tags simultaneously) paired with a tabbed **Central Config (`⚙️ Config`)** and an integrated **Help Window (`📖 Anleitung`)**. |
| **Clip & Replay Studio (`🎬 Clips`)** | Built-in **FFmpeg** video workflow for **OBS Replay Buffer** & recordings: visual **Dual-Range Timeline Scrubber** directly on the video player, lossless **16:9 Trim**, vertical **9:16 Shorts/TikTok/Reels** export (blur background or center crop), rename/trash management, **direct YouTube Upload** (OAuth2), and **TikTok Quick-Upload**. |
| **Discord Live-Announcer, Social & Schedule Studio (`📅 Schedule & Go-Live`)** | **Discord Live-Announcer** (posts once per stream via OBS start **or** Twitch Live detection, **live-updates every 5 min** with title/game/viewers/preview without re-pinging, and switches to *"Stream ended"* with duration & peak viewers on stop), **X (Twitter) API v2**, **Instagram Graph API** + **1080×1350 PNG Generator**, **Bluesky**, **Mastodon**, **Twitch Schedule Sync**, **OBS `/schedule` Overlay**, **`.ics` Calendar Feed**, and `!schedule` chat command. |
| **Game Addons: League of Legends & Just Chatting Suites (`🎮 Game-Addons`)** | Write-protected presets with auto-switch by game & OBS overlay on/off toggle: **⚔️ League of Legends Complete Suite** (auto-reads live **Rank, exact LP & Riot-ID** from local League Client **LCU** + live Champion, Skin, KDA, CS/m, Gold, Runes & Items from `127.0.0.1:2999`, 3 Hextech overlays `/game-stats`, `/lol-build`, `/lol-map`, `!elo`/`!opgg`/`!build`/`!mh` commands & auto-Pentakill Hype Clip), **💬 Just Chatting & Talk Suite** (`/jc-lowerthird` TV banner, `/jc-qna` Viewer Q&A Spotlight, `/game-stats` chapter agenda, live `!ask` queue, `!setthema` & `!nextq`), plus **CS2 GSI**, **Valorant**, **Soulsborne**, **Minecraft** & **Universal**. |
| **Giveaway, Soundboard & Hype Detector** | **Live-Giveaway (`🎁 Giveaway`)** with `!join` chat entry, Sub/VIP multipliers & animated OBS wheel (`/giveaway`), **Soundboard (`🔊 Sounds`)** routed into OBS (`/alerts` & `/soundboard`) + Stream Deck API, and **Chat-Hype Detector (`🔥 Hype`)** with live Hype-Meter, keyword-hit trigger, manual trigger, **automatic Twitch Clip creation + auto-post to chat**, stream markers & OBS replays. |
| **OBS, Scene Editor & Smart Lighting (Elgato, Philips Hue, Nanoleaf & Govee)** | Interactive **OBS Scene & Source Editor (`🎛️ Scene Editor`, 1080p HD)** with **1-click built-in App Overlays & Complete LoL / Just Chatting Bundles (no URL copying)**, **Foreground / Background layer ordering & Drag-and-Drop**, **OBS Custom Dock** (`/dock`), **100% local LAN studio lighting** for **Elgato Key Light**, **Philips Hue Bridge** & **Nanoleaf (Shapes/Lines/Canvas, Port 16021 — zero cloud!)**, plus **Govee Smart-Light** — all coupled to Stream Start/Stop, Follows, Subs, Resubs, Sub-Gifts, Bits/Gifts, Raids & Hype spikes. |
| **Multi-Language JSON UI (`🇩🇪 DE` / `🇬🇧 EN`), Auto-Updater & Feedback** | Instant **live language switcher (`🇩🇪 DE` / `🇬🇧 EN`)** in the main window topbar & app menu backed by extensible JSON files (`src/locales/*.json`), **GitHub Releases Auto-Updater** with 1-click install, and **💬 Feedback** modal for creating **GitHub Discussions** & Issues directly from the app. |
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
| **OBS Spotify / Music Widget** | `http://127.0.0.1:4588/spotify` | Transparent Now-Playing card (Spotify, Apple Music, Amazon Music) with album cover |
| **OBS Game-Stats / Talk-Agenda** | `http://127.0.0.1:4588/game-stats` | Dynamic Game Stats card (LoL Hextech HUD with Rank & LP bar, Just Chatting Agenda, CS2, Valorant, Souls…) |
| **OBS LoL Live Build & Elo Bar** | `http://127.0.0.1:4588/lol-build` | Horizontal Hextech bar showing live 6 items + trinket, Rank/LP, Keystone, Gold & Game Time |
| **OBS LoL Minimap Cover** | `http://127.0.0.1:4588/lol-map` | Anti-ghosting Hextech minimap cover (`280×280`) with live Champion splash |
| **OBS LoL Client Animated Frame** | `http://127.0.0.1:4588/lol-bg` | `1920×1080` themed Lobby/Client scene frame (16:9 Client, Webcam, Chat + 155 px bottom space) with animated Champion Pack splash & particles (`?layout=clean` for background only) |
| **OBS Just Chatting Lower Third** | `http://127.0.0.1:4588/jc-lowerthird` | Broadcast lower-third banner (`920×145`) with live topic, vibe chip, clock & social ticker |
| **OBS Viewer Q&A Spotlight** | `http://127.0.0.1:4588/jc-qna` | Animated spotlight card displaying the active `!ask` viewer question on stream |
| **OBS Giveaway / Schedule / Soundboard** | `.../giveaway` • `.../schedule` • `.../soundboard` | Live Giveaway prize wheel, upcoming stream schedule & OBS audio player *(all insertable with 1 click in Scene Editor without URLs!)* |
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
| Game Addons: Switch / Stat +1 / Toggle Overlay / LoL Map | `.../game-addon?id=lol` • `.../game-stat?key=deaths&delta=1` • `.../game-overlay?state=toggle` • `.../lol-map-cover` |

---

## 📚 Documentation

- **[Changelog (CHANGELOG.md)](./CHANGELOG.md)** — Full version history and release notes.
- **[English User Guide (GUIDE.md)](./GUIDE.md)** — Complete setup walkthrough (Twitch OAuth token, YouTube, TikTok, OBS, Clip & Replay Studio, Stream-Manager, Custom Commands, Stream Deck).
- **[Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)** — Ausführliche Schritt-für-Schritt-Anleitung auf Deutsch.
- **[Deutsches README (README.de.md)](./README.de.md)** — Projektübersicht auf Deutsch.
