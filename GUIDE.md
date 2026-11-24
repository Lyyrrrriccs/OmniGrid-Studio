# 📖 OmniGrid Studio — Complete User Guide (English)

🌐 [Back to Overview (README.md)](./README.md) | [Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)

---

## 1. Launching the App (No Terminal Required)

- **macOS:** Double-click `dist/OmniGridStudio.app` (or drag it to `/Applications`).
- **Windows:** Copy the `dist/OmniGridStudio-win32-x64` folder to your streaming PC and double-click `OmniGridStudio.exe`.

> **Tip:** All settings, channels, and window positions are automatically persisted and restored on restart.

---

## 2. Connecting Platforms

### 🟣 Twitch (+ 7TV, BTTV, FFZ)
1. Enter your **Twitch channel name** (e.g., `yourchannel`) or full Twitch URL.
2. **Read-only mode:** Click **"Verbinden" (Connect)** — works immediately without any token!
3. **Sending messages & moderating on Twitch:**
   - Expand **"🔑 Chat-Antwort & Mod Token"**.
   - Click **"🔗 Token holen"** (opens `twitchtokengenerator.com`).
   - On the webpage, click **"Bot Chat Token"** *(this automatically grants `chat:read` and `chat:edit`)*.
   - Copy the **Access token** *(first row — do **not** use your `live_...` OBS Stream Key!)* into the **Chat OAuth-Token** field and click **Connect**.

### 🔴 YouTube Live
1. Enter your **YouTube @handle** (e.g., `@YourChannel`) or a channel/stream URL.
2. Keep **"Auto-detect active livestream"** selected (recommended) or click **🔍** to scan and pick a specific stream manually.
3. Click **"Start / Standby"**. As soon as your stream goes live, chat connects automatically.
   > *Note: **Reading** live chat, SuperChats, Members, and custom YouTube emotes requires **no API key**.*
4. **Optional — Writing to YouTube Chat (Google OAuth2):**
   - Expand **"🔑 YouTube Schreiben (OAuth2)"** inside the YouTube card.
   - In your [Google Cloud Console](https://console.cloud.google.com/), enable **YouTube Data API v3** and create a **Desktop app** OAuth2 Client ID *(each streamer creates their own Client ID so they get their own free 10,000 units/day quota and avoid Google's restricted-scope app verification audit for `youtube.force-ssl`)*.
   - Paste your **Client ID** (and optional **Client Secret**) and click **"🔐 Mit Google anmelden"**. You can then send messages and `!song` replies directly to YouTube Live Chat.

### 🎵 TikTok Live
1. Enter your **TikTok @username**.
2. Optionally provide a manual **Room ID** under **"🎯 Stream-Auswahl"** (otherwise auto-detected).
3. Click **"Start / Standby"**. Once live, chat messages, sub emotes, Gifts 🎁, Follows ❤️, and Likes appear in real time.
   > *Note: TikTok's Webcast interface is read-only and does not permit sending messages from third-party tools.*

---

## 3. Compact Chat Design & Emote Settings

In the **"🎨 Kompaktes Chatdesign"** sidebar section, customize everything **without CSS**:
- **Layout Mode:** *Inline / Compact* (default, maximum text width) or *Message Bubbles*.
- **Fonts & Truncation:** Independent sliders for username font size, message font size, max username length, and vertical padding.
- **Divider Lines & Background:** Toggle thin dividers and customize color, opacity, spacing, plus app & OBS background opacity.
- **Emote Providers:** Toggle **7TV**, **BTTV**, **FFZ**, **Twitch**, **YouTube**, **TikTok**, and **Animations** individually under **"🎭 Emote-Anbieter & Animationen"**.

---

## 4. OBS Integration & Standalone Window

### Option A — OBS Custom Browser Dock (Inside OBS)
1. Copy the **Dock URL** (`http://127.0.0.1:4588/dock`) from **"🎥 5. OBS-Integration"**.
2. In OBS Studio, open **View → Docks → Custom Browser Docks**.
3. Enter a dock name (e.g., `OmniGrid Studio`), paste the URL, and click **Apply**.
   *Works across all OBS scenes!*

### Option B — Standalone Full-Height Window Left of OBS
- Click **"🪟 Separates Chatfenster"** (or **"📐 Links neben OBS"**) in the top bar.
- Snaps cleanly to full screen height on the left of OBS (`📌 Pin` keeps it Always-on-Top). Position and size are saved automatically.

### Option C — OBS Stream Overlay (For Viewers)
- Add a **Browser Source** in OBS pointing to `http://127.0.0.1:4588`.
- Clicking the **📌 Pin** icon on any message displays it live in the stream overlay.

### Option D — OBS Alert-Box Overlay (Follows, Subs, Bits & Raids)
- Add a **Browser Source** in OBS pointing to `http://127.0.0.1:4588/alerts` (e.g., `600 × 220`).
- Under **"🚨 OBS Alert-Box Overlay"**, toggle which event types appear on stream (`Follow`, `Sub / Member`, `Resub`, `Sub-Gift`, `Bits / SuperChat`, `Raid`), choose animation (`Pop-In`, `Slide-Up`, `Neon-Glow`), duration (`2s`–`12s`), audio chime, and click **▶ Test-Alert**. Under **"🖼️ Custom Alert Media"**, select custom images/GIFs and sounds directly via the native **Finder / Explorer file dialog** (no manual path typing required).

---

## 5. Events, Keyword Alerts & Filters

- **Event Highlighting:** Configure *Follow, Sub, Resub, Gifted Subs, Bits/Gifts, Raid*, and *Highlighted Messages* individually under **"🌟 6. Event-Hervorhebung"**. Regular subscriber/follower messages are never falsely highlighted.
- **Keyword Alerts:** Add comma-separated keywords (e.g., `question, lobby, mic`) under **"👑 Mein Streamer-Profil → 🔍 Eigene Keyword-Alarme"**. Matches get a colored badge and optional sound ping.
- **Toolbar Filters:** Filter by platform (`TW`, `YT`, `TT`), `@Mich`, `⭐ Events`, **User Role** (`Mods & VIPs`, `Subs`), hide **🤖 Bots**, or collapse **🔁 Repeated Spam ×N**.
- **📊 Stats & Logs Drawer:** Click **"📊 Statistik & Logs"** in the top bar to toggle live session statistics (messages/min, platform split, top chatters, top emotes) and real-time connection diagnostic logs.

---

## 6. User & Message Quick Menu

**Left-click or right-click** any message to open the compact quick menu:
- **User Overview:** Avatar, platform, role badges, and Twitch account age.
- **Quick Actions:** Copy message text, copy username, reply (with Twitch thread support), pin to OBS, open profile in browser.
- **Moderation:** Local delete/mute (always available) plus direct Twitch server actions (delete, timeout `10s` / `1m` / `10m` / `1h`, 2-step ban, unban) when a valid Twitch OAuth token is present. Unsupported platform actions are clearly marked as locked (`🔒 GESPERRT`).

---

## 7. Elgato Stream Deck Setup

1. Open the **Elgato Stream Deck** app.
2. Drag **System → Website** onto any key.
3. In OmniGrid Studio under **"🎛️ Stream Deck Integration"**, click **📋 URL** next to your desired action (e.g., `Pin latest message to OBS` or your custom quick-chat generator).
4. Paste the URL into Stream Deck and **enable "GET request in background"**.
5. Use **▶ Test** inside OmniGrid Studio to verify any action immediately.

---

## 8. Peripheral Selection (2nd Keyboard, 2nd Mouse & Global Hotkeys)

Under **"⌨️ Peripherie-Auswahl (Zweitgeräte)"**, you can bind a dedicated secondary USB keyboard, numpad/macro pad, or mouse exclusively to OmniGrid Studio:
1. Click **"🔍 Scannen"** to list all connected USB keyboards and mice.
2. **2nd Keyboard (`🔌 Verbinden`):**
   - **Mode `Chat tippen + F1–F4 Makros`:** Type a chat message directly on your secondary keyboard and press `Enter` to send without alt-tabbing out of your game. `F1`–`F4` trigger Pin, Unpin, Clear Chat, and Compact Mode.
   - **Mode `Nur Makros`:** Keys `1`–`4` / `F1`–`F4` trigger the 4 quick actions immediately.
3. **2nd Mouse (`🖱️ Verbinden`):** Scroll wheel scrolls the chat feed, left-click pins the latest message to OBS, right-click unpins it.
4. **🌐 Global Hotkeys:** If your OS restricts direct WebHID access to your primary keyboard, the configurable system-wide hotkeys (`Ctrl/Cmd+Alt+P/U/C/K`) work in every game and application.

---

## 9. Spotify, Apple Music & Amazon Music Live + `!song` Chat Bot

Under **"🎵 Spotify / Apple / Amazon Music & !song"**, OmniGrid Studio reads the current track directly from your local **Spotify**, **Apple Music**, or **Amazon Music** desktop app (zero API key setup, with automatic 300×300 album artwork lookup!):
- **Live Controls:** **⏮ / ⏯ / ⏭** and **📢 Announce current track in Twitch chat**.
- **Automatic `!song` / `!music` Bot:** When a viewer types `!song` or `!music` in Twitch or YouTube chat, the app automatically replies with the current artist & track *(with a 15s anti-spam cooldown)*.
- **OBS Music Widget:** Add `http://127.0.0.1:4588/spotify` as an OBS Browser Source (e.g., `420 × 80`) to display a transparent Now-Playing card with album art and a dynamic player badge (`SPOTIFY`, `APPLE MUSIC`, or `AMAZON MUSIC`) on stream.

---

## 10. Tablet & iPad Companion (`/tablet`)

Under **"📱 Tablet & iPad Companion"**, you will find a QR code and local Wi-Fi URL (`http://<LAN-IP>:4588/tablet`):
- Scan the QR code with your **iPad**, **Android tablet**, or **phone** on the same Wi-Fi network (no app install needed).
- Gives you a touch-friendly dashboard with live chat, quick-reply input, and Stream Deck buttons (pin, unpin, demo, Spotify controls).

### 🔒 If you see "Site cannot be reached" — 5-Minute Fix with Tailscale (Beginner Guide)
Some Wi-Fi networks (guest Wi-Fi, dorms, hotels, or routers with "AP/Client Isolation") block devices from talking to each other directly, or you may want to use your phone over **5G/LTE**. The free app **Tailscale** creates a private direct tunnel between your computer and your phone/tablet — no router settings required:

1. **Install on your PC or Mac:**
   - Download **Tailscale** for free at [tailscale.com/download](https://tailscale.com/download) and install it.
   - Open Tailscale, sign in once (e.g. with Google, Apple, or GitHub), and make sure it says **Connected**.
2. **Install on your Phone or Tablet:**
   - Download the **Tailscale** app from the Apple App Store or Google Play Store.
   - Sign in with the **exact same account** and turn the toggle **On / Connected**.
3. **Restart OmniGrid Studio:**
   - Quit and reopen OmniGrid Studio on your PC/Mac so it detects your new Tailscale address.
4. **Switch to Tailscale in OmniGrid Studio:**
   - Scroll to **"📱 Tablet & iPad Companion"** in the left sidebar.
   - Use the small dropdown above the link and select **"Tailscale / VPN (100.x.x.x)"**.
   - The QR code and URL update automatically.
5. **Scan & Connect:**
   - Scan the new QR code with your phone/tablet camera (or type `http://100....:4588/tablet` in your browser).

**Quick Checklist if it still won't load:**
- ✅ Make sure the address bar starts with **`http://`** (not `https://`!).
- ✅ **macOS:** Go to *System Settings → Privacy & Security → Local Network* and make sure **OmniGridStudio** is enabled.
- ✅ **Windows:** Allow **OmniGridStudio** through Windows Defender Firewall when prompted.
- ✅ Verify in the Tailscale app that **both** devices show as *Connected* under the same account.

---

## 11. Central Config Page (`⚙️ Config`)

All setup options you don't need to touch mid-stream live cleanly inside the full-size **⚙️ Config** modal (`96vw × 92vh`):
- **📡 Plattformen:** Twitch, YouTube (+ OAuth2 login) & TikTok settings.
- **👤 Profil & Events:** Streamer name, multi-line keyword alerts & event highlight styles.
- **🎨 Design & Emotes:** Fonts, dividers, opacity & emote providers.
- **🎥 OBS, Licht & Alerts:** OBS URLs, OBS WebSocket v5, **💡 Elgato Key Light**, **🌈 Govee Smart-Light & Event Scenes**, Alert-Box (`/alerts`) & TTS.
- **🤖 Bot & Auto-Mod:** Chat-Timer, Auto-Mod rules (with multi-line word blacklist) & Custom Commands.
- **📱 Tablet & Stream Deck:** QR code (Wi-Fi/Tailscale) & all Stream Deck endpoints.
- **⌨️ Peripherie & System:** 2nd mouse, 2nd keyboard, global hotkeys, RAM limits, JSON backup & **GitHub Auto-Updater**.

---

## 12. OBS Goal-Bar (`/goals`), Live-Poll (`/poll`) & TTS

- **OBS Goal-Bar:** Add `http://127.0.0.1:4588/goals` as an OBS Browser Source. Configure title, target, color, and auto-increment on Follows/Subs in the live sidebar.
- **Multistream Poll:** Add `http://127.0.0.1:4588/poll` in OBS. Viewers across Twitch, YouTube, and TikTok vote with `!vote 1`, `!vote 2`, etc. Use **👁️ Ausblenden / Einblenden** (or `/api/streamdeck/toggle-poll`) to hide/show the overlay without losing votes.
- **Text-to-Speech (TTS):** Reads alerts/events and `!tts <text>` chat messages aloud with voice selection, rate, volume, **⏭ Skip**, and **🗑 Clear**.

---

## 13. Twitch Clip, Stream-Marker & OBS WebSocket v5

- **🎬 Twitch Clip & 🚩 Marker:** Triggered from the left sidebar, `/tablet`, or Stream Deck (`/clip`, `/marker?description=Highlight`, `/clip-and-marker?description=Highlight`). *(Requires `clips:edit` and `channel:manage:broadcast` scopes in your Twitch token.)*
- **🎛️ OBS WebSocket v5:** Enable *Tools → WebSocket Server Settings* in OBS Studio (port `4455`), enter host/password under **⚙️ Config → 🎥 OBS & Alerts**, and control scenes, **💾 Replay**, **🎙️ Mic**, **🔴 Rec**, and **📡 Stream** from OmniGrid Studio, `/tablet`, or Stream Deck.

---

## 14. Custom Commands, Chat-Timer & Auto-Mod (`🤖 Bot & Auto-Mod`)

- **⚡ Custom Chat-Commands:** Define your own `!dc`, `!specs`, or `!socials` commands with per-command cooldowns (in seconds) and variables like `{user}`, `{channel}`, and `{uptime}`. Replies are posted automatically to active chats (Twitch & YouTube).
- **⏱️ Chat-Timer:** Rotates through your info messages every X minutes and posts them to active write-enabled chats (Twitch & YouTube).
- **🛡️ Auto-Mod Rules:** Filters links, caps spam (`≥75%`), symbol spam, and custom blacklist words (with optional Twitch `/delete` or `/timeout`). Mods, VIPs & Broadcaster can be exempted.
- **🔍 Chat Search & Export (`⌘/Ctrl+F` / `💾 Export`):** Search live messages by text, platform, or author and export the current chat log as `.txt` or `.json`.

---

## 15. Stream-Manager (`🎛️ Stream-Manager`)

Update your **Twitch** and **YouTube** stream metadata at once right from the sidebar:
1. Click **🎛️ Stream-Manager** in the sidebar.
2. Enter your new **Stream Title**, **Game / Category** (with live Twitch category search), and up to 10 **Tags**.
3. Click **Apply to Twitch & YouTube** — OmniGrid Studio updates both your Twitch channel (Helix API) and your active YouTube Live broadcast (YouTube Data API v3 via OAuth2).

---

## 16. Clip & Replay Studio (`🎬 Clips` — 9:16 Shorts, Trimming & Upload)

Turn your **OBS Replay Buffer** saves or recordings into polished **16:9 clips** or vertical **9:16 Shorts / TikToks / Reels** without leaving the app:
1. **Folder & FFmpeg:** Select your **OBS Recording / Replay folder** inside the Clip Studio (FFmpeg is auto-detected on macOS/Homebrew or can be configured manually).
2. **Clip Management:** Browse all `.mp4`, `.mkv`, `.mov`, and `.webm` files, **rename (`✏️`)** them inline, or move them to the trash **(`🗑️`)**.
3. **Visual Dual-Range Timeline Scrubber:** Directly on the video player, drag the **Start (`In`)** and **End (`Out`)** handles to mark your exact segment with live time readout and preview.
4. **Export Modes:**
   - **✂️ 16:9 Trim:** Trims the selected range cleanly in landscape format.
   - **📱 9:16 Short (Blur / Crop):** Renders a vertical `1080×1920` video for YouTube Shorts, TikTok & Reels — choose between a blurred background (**Blur-BG**) or centered crop (**Center-Crop**).
5. **Direct Upload (`▶️ YT` / `🎵 TT`):**
   - **YouTube Upload:** Click **`▶️ YT`** next to any clip to set Title, Description & Privacy (`Public`/`Unlisted`/`Private`) and upload directly via **Google OAuth2**.
   - **TikTok Quick-Upload:** Click **`🎵 TT`** to open the TikTok upload page and reveal the file in Finder/Explorer for instant drag-and-drop.

---

## 17. Discord Live-Announcer, Go-Live & Schedule Studio (`📅 Schedule & Go-Live`)

Keep your community updated automatically before, during, and after every stream:
1. **Discord Live-Announcer (`🔗 Discord & Platforms`):**
   - Paste your Discord Webhook URL (plus an optional separate Schedule Webhook) and role mention (`everyone`, `here`, or numeric Role ID).
   - **Dual Auto-Triggers (Zero Duplicate Posts):** Enable **🚀 Auto-post when OBS stream starts** and/or **🟣 Also post when Twitch reports "live"** (works without OBS WebSocket, e.g. console/Streamlabs setups). OmniGrid guarantees **only one message per stream** even if both are active.
   - **🔄 Live Updates Every 5 Minutes:** Automatically edits the existing Discord message (without re-pinging roles!) with your current **title, game/category, live viewer count, `<t:UNIX:R>` uptime, and a fresh Twitch stream preview image**.
   - **⚫ Clean Stream-End Summary:** When your stream ends, the embed automatically switches to **"Stream ended"** showing total **stream duration** and **peak viewers** (manual update/end buttons included).
2. **X (Twitter), Bluesky, Mastodon & Instagram:**
   - **X (Twitter) API v2:** Enter your 4 OAuth 1.0a keys for direct auto-posting — or use the 1-click browser composer (`𝕏 Share on X (Browser)`).
   - **Bluesky & Mastodon:** Direct posting via App Password or Access Token.
   - **Instagram:** Use **`📸 Instagram Graphic + Quick-Post`** to generate a `1080×1350` PNG graphic for Go-Live or Schedule, copy caption + hashtags, and open Instagram — or connect the **Instagram Graph API** (Business/Creator account + optional ImgBB API key for automatic graphic upload).
3. **Schedule Ecosystem:**
   - **Twitch Schedule Sync:** Push upcoming slots directly to your Twitch channel schedule.
   - **OBS `/schedule` & `.ics` Calendar:** Use `http://127.0.0.1:4588/schedule` as an OBS Browser Source or export/share `/schedule.ics`.
   - **Chat Command:** Viewers can type `!schedule` or `!plan` in Twitch/YouTube chat anytime.

---

## 18. Live Giveaway, Soundboard & Chat-Hype Detector

- **🎁 Live Giveaway (`🎁 Giveaway`):** Set a title, chat keyword (e.g. `!join`), and Sub/VIP/Mod weight multiplier (`1×`–`3×`). Draw a weighted winner with the animated OBS overlay at `http://127.0.0.1:4588/giveaway`.
- **🔊 Integrated Soundboard (`🔊 Sounds`):** Trigger the 4 built-in sounds or add your own `.mp3`/`.wav`/`.ogg` files. Audio routes directly into OBS (`/alerts` and `/soundboard`) and can be triggered via Stream Deck API (`/api/streamdeck/sound?name=...`).
- **🔥 Chat-Hype Detector (`🔥 Hype`):**
  - Triggers automatically when incoming chat reaches either **Min. Hype Points** or **Keyword Hits** (default: `3×` keyword messages like `pog`, `clip`, `lul`, `gg` within the window — each keyword message counts 3 points).
  - **Live Hype Meter & Manual Trigger:** Watch live points, matched keywords, and cooldown inside the `🔥 Hype` modal, or click **`🔥 Trigger Hype Now`** anytime (also generates a preview clip in `▶ Demo` mode when testing offline).
  - **Automated Actions:** Creates a **Twitch Clip**, **automatically posts the clip link into Twitch/YouTube chat** (and into your local chat feed), sets a **Twitch Stream Marker**, optionally saves the **OBS Replay Buffer**, and triggers your **Govee Hype light scene**. *(Note: Twitch's official Helix API only permits creating real clips and stream markers while your channel is actively live.)*

## 19. OBS Scene & Source Editor (`🎛️ Scene Editor`)

- **Connect Directly:** Use **🔌 Connect to OBS** right in the editor header to connect or reconnect OBS WebSocket v5.
- **⚡ 1-Click Built-in App Overlays & Scene Bundles (No URL Copying Needed):**
  - At the top right under **⚡ Insert Built-in App Overlay (no URL needed)**, pick any of the **13 built-in OmniGrid overlays** (Chat, Alerts, Music, Game-Stats/Agenda, LoL Build, LoL Minimap, Just Chatting Lower Third, Viewer Q&A, Goals, Poll, Giveaway, Schedule, Soundboard) and click **➕ Insert** — port, optimal resolution, initial position, and audio routing are configured automatically (reusing global OBS inputs cleanly across scenes).
  - Click **`⚔️ Complete LoL Set`** or **`💬 Just Chatting Set`** to insert the entire coordinated overlay layout into your scene in a single click!
- **⏫ Foreground & ⏬ Background Layer Ordering:**
  - Move any selected source forward or backward using the toolbar buttons (**`⏫ Bring to Front`**, **`🔼 Forward`**, **`🔽 Backward`**, **`⏬ Send to Back`**), the **`🔼` / `🔽` row buttons** (*`⇧ Shift` + Click jumps straight to top/bottom*), or **Drag & Drop (`⠿`)** in the source list (*top = foreground, bottom = background*).
- **Crisp 1080p HD Preview, Canvas Controls & Native File Picker:** Drag sources directly on the `1920 × 1080` preview to move them or drag corners to resize (**🎯 Center** / **⛶ Fullscreen**). When adding or editing **Image, Video/Media, or Text File sources**, a native **Finder / Explorer file dialog** opens directly — no manual file paths ever need to be typed.

## 20. Automatic Updates (GitHub Releases)

- OmniGrid Studio checks `github.com/Lyyrrrriccs/omni-stream-chat/releases` on startup (and manually via **⚙️ Config → ⌨️ Peripherie & System → 🔄 Nach Updates suchen**).
- When a newer version is available, the matching macOS/Windows asset is downloaded automatically and a top banner offers **🚀 Jetzt installieren & neu starten**.
- Releases are built automatically via GitHub Actions (`.github/workflows/release.yml`) whenever a `v*` tag (e.g. `v1.2.0`) is pushed.

## 21. Smart Lighting: Elgato, Philips Hue, Nanoleaf & Govee (`⚙️ Config → 🎥 OBS, Lights & Alerts`)

### 💡 Elgato Key Light & Stream Lighting (100% Local LAN)
- **LAN Auto-Discovery (`Port 9123`):** Click **🔍 Discover** to automatically find Elgato Key Light / Key Light Air / Ring Light / Light Strip devices on your Wi-Fi (or enter multiple IPs comma-separated).
- **Live Controls & OBS Auto-Sync:** Adjust brightness (`3–100%`) and color temperature (`2900K–7000K`) live, with automatic power-on when your OBS stream goes live.

### 💡 Philips Hue Bridge (100% Local LAN — Zero Cloud!)
- **Offline LAN Discovery & 1-Click Pairing:** Click **🔍 Find Bridge** (discovers your Hue Bridge locally via SSDP/subnet scan without touching any cloud). Press the physical **round link button on your Hue Bridge**, then click **🔗 Pair (Bridge Button)** — your local Hue key is stored exclusively in your local `config.json`.
- **Lights, Saved Hue Scenes & Stream Events:** Check individual Hue bulbs/Play Bars/strips, control brightness & color live, and map any **saved Hue Scene**, solid color, or **Alert Flash** to *Follow, Sub, Resub, Sub-Gift, Bits, Raid, Chat-Hype, and Stream Start/End* (with automatic revert after X seconds).

### 🔺 Nanoleaf Shapes / Lines / Canvas (100% Local LAN — Port `16021`, Zero Cloud!)
- **Offline LAN Discovery & Pairing:** Click **🔍 Find Nanoleaf** (port `16021`). Hold the **Power button on your Nanoleaf controller for 5–7 seconds** (until the LEDs flash), then click **🔗 Pair (Hold Power 5–7s)**.
- **Saved Effects & Stream Events:** Automatically loads all dynamic/rhythm effects stored on your Nanoleaf and triggers them on any stream event or OBS stream start/stop.

### 🌈 Govee Smart-Light & Event Scenes
- **Personal Govee API Key:** For licensing and rate-limit reasons, each streamer requests their own free Govee API key (*Govee Home App → Profile → Settings ⚙️ → Apply for API Key* or via **🌐 Govee API-Key beantragen / Developer-Portal öffnen**). The entire integration can be toggled on/off at any time.
- **Single or Multi-Lamp Selection:** After clicking **🔄 Geräte & Szenen laden**, check **a single lamp** (**Nur 1 Lampe**) or multiple lamps (**Alle**) in the lamp checklist.
- **Event Coupling & Per-Event Single-Lamp Override:** Assign any dynamic Govee scene, DIY scene, or RGB color preset to **🏠 Default Scene**, **🟢 Stream Start**, **💙 Follow**, **💜 Sub**, **🔮 Resub**, **🎁 Sub-Gift**, **🪙 Bits/Gift**, **🚀 Raid**, **🔥 Chat-Hype**, and **⏹️ Stream Stop** — either across your checked lamps (`🎯 Gewählte Lampe(n)`) or targeted to **a specific single lamp (`💡 Nur: <Lamp>`)** per event! Automatically reverts to your default scene after X seconds.

## 22. Local Multi-Platform Streaming Relay (`📡 Multi-Stream`)

OBS only handles **rendering & encoding once (`1×`)**, while OmniGrid Studio distributes the stream locally with **0% extra GPU/CPU encoding load (`-c copy`)** simultaneously to **Twitch**, **YouTube Live**, **TikTok Live**, and **Kick / Custom RTMP**:
1. **Configure Targets & Stream Keys:** Open **⚙️ Config → 📡 Plattformen** (or click **⚙️ Ziele** in the *Multi-Plattform-Stream* sidebar card). Enable your target platforms and enter your stream keys.
2. **1-Click OBS Auto-Config:** Click **⚡ OBS automatisch auf OmniGrid-Relay einstellen** to automatically configure OBS (`rtmp://127.0.0.1:1935/live`, key `omnigrid`) via OBS WebSocket v5.
3. **1-Click Multi-Stream Start:** Click **📡 Multi-Stream Start** in the sidebar — OmniGrid Studio launches the local RTMP relay and automatically starts your OBS stream, showing live bitrate (`kbps`), `FPS`, and active targets.

## 23. Feedback, Feature Requests & GitHub Discussions (`💬 Feedback`)

- Click **💬 Feedback** in the top cockpit bar to submit feature ideas, questions, or bug reports directly from the app.
- **Category, Title & Description:** Automatically appends your OmniGrid Studio version (`v1.1.0`) and OS/architecture.
- **Direct GraphQL API or Pre-Filled Browser Flow:** With an optional personal GitHub token, OmniGrid Studio creates the GitHub Discussion directly via the GitHub GraphQL API (`createDiscussion`); without a token, it opens the pre-filled **GitHub Discussion** or **GitHub Issue** page in your browser.

## 24. Privacy, Security & Zero-Telemetry Proof (`🔒 Datenschutz`)

- **100% Local-First / No OmniGrid Server:** All credentials, OAuth tokens, stream keys, and API keys are stored exclusively in your local `config.json` on your disk and are never transmitted to any developer server.
- **Built-In Live Source Scanner (`🔒 Datenschutz`):** Click **🔒 Datenschutz** in the top cockpit bar to:
  1. Reveal your local `config.json` directly in Finder / Explorer.
  2. Open the unobfuscated plaintext source code (`src/`) of the running app.
  3. Run a **Live Source Code Domain Audit** listing every outbound endpoint in the codebase with file name and line number.
  4. Copy the OS socket inspection command (`lsof` / `Get-NetTCPConnection`) to verify active connections directly in your terminal.

---

## 25. Game Addons: League of Legends & Just Chatting Complete Suites (`🎮 Game Addons`)

Open **🎮 Game Addons** in the top cockpit bar to pick a game addon manually or leave **`🤖 Auto`** enabled so it switches automatically with your Twitch / Stream Manager category:
- **🔒 Write-Protected Presets & 👁️ Overlay Toggle:** Built-in preset definitions are immutable (click **↺ Reset Values** anytime to restore default stat values). Toggle **👁️ Show OBS Game Stats Overlay** (or call `/api/streamdeck/game-overlay?state=toggle`) to hide or show all Game Addon overlays in OBS instantly.

### ⚔️ League of Legends — Complete Suite
- **Zero-Key Local Auto-Reading (`127.0.0.1`):**
  1. **League Client (LCU):** Whenever your League of Legends Client is open and signed in, OmniGrid automatically reads your live **Solo/Duo (or Flex) Rank**, **exact current LP**, and **Riot ID (`Name#TAG`) + Region** locally every ~12s (or immediately on click via **`🔄 Read Rank & LP from LoL Client`**).
  2. **Live In-Game API (`127.0.0.1:2999`):** During a match, **Champion + Skin splash, Role/Lane, K/D/A, CS & CS/m, Level, Gold, Keystone Rune, Summoner Spells, and all 6 Items + Trinket** update live. Scoring a Triple/Quadra/Baron automatically sets a Twitch Stream Marker — scoring a **PENTAKILL** automatically triggers a **Hype Clip + Chat Link**!
- **3 Hextech OBS Overlays:**
  - `http://127.0.0.1:4588/game-stats` — Hextech HUD with Champion icon, **Rank & LP Box with progress bar to the right**, K/D/A, CS/m, session W-L & last 6 matches.
  - `http://127.0.0.1:4588/lol-build` — Compact horizontal Live Item Build & Elo Bar (`550×125`).
  - `http://127.0.0.1:4588/lol-map` — Anti-Ghosting Minimap Cover (`280×280`).
- **Chat Commands:** `!elo`, `!lp`, `!rank`, `!opgg`, `!ugg`, `!champ`, `!skin`, `!build`, `!items`, `!runes`, `!mh`.

### 💬 Just Chatting & Talk Suite
- **3 Broadcast / Podcast OBS Overlays:**
  - `http://127.0.0.1:4588/jc-lowerthird` — Animated TV/Podcast Lower-Third Banner (`920×145`) with live topic, subtitle, vibe chip, clock & social ticker.
  - `http://127.0.0.1:4588/jc-qna` — **Viewer Q&A Spotlight** (`640×220`) displaying the selected viewer question (`@User asks: ...`) and fading out cleanly when cleared.
  - `http://127.0.0.1:4588/game-stats` — Talk-Agenda card showing completed (`✓`), active (`▶`), and upcoming chapters.
- **Chat Commands & Live Moderation:**
  - Viewers: `!ask <question>` / `!frage <question>` (adds to your live Q&A queue), `!topic` / `!thema`, `!agenda`, `!video` / `!react`.
  - Streamer & Mods in chat: `!settopic <new topic>` / `!setthema <new topic>` (updates the lower-third live) and `!nextq` (displays the next queued viewer question on stream).
- **Additional Built-In Game Addons:** **🎯 Counter-Strike 2 (GSI)** (with `.cfg` export), **🔫 Valorant / Tactical FPS**, **💀 Elden Ring / Soulsborne**, **⛏️ Minecraft**, and **🏆 Universal Game Counter**.

---

## 26. Multi-Language Support & JSON Locale Files (`🇩🇪 DE` / `🇬🇧 EN`)

- **Instant Main-Window Switcher:** Use the **`🇩🇪 DE` / `🇬🇧 EN`** dropdown on the left side of the top cockpit bar (next to **⚙️ Config**) or the native application menu (**🌐 Language**) to switch the entire UI between German and English live without reloading.
- **Extensible JSON Files (`src/locales/`):** All menus, buttons, modals, tooltips, placeholders, and dynamic labels are stored in structured JSON files (`src/locales/de.json` and `src/locales/en.json`). Adding another `<lang>.json` file into `src/locales/` automatically adds that language to the selector on startup.





