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
1. Enter your **Twitch channel name** (e.g., `lyrrrrics`) or full Twitch URL.
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
- Under **"🚨 OBS Alert-Box Overlay"** in the sidebar, toggle which event types appear on stream (`Follow`, `Sub / Member`, `Resub`, `Sub-Gift`, `Bits / SuperChat`, `Raid`), choose animation (`Pop-In`, `Slide-Up`, `Neon-Glow`), duration (`2s`–`12s`), audio chime, and click **▶ Test-Alert**.

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

## 17. Discord, Go-Live & Schedule Studio (`📅 Schedule & Go-Live`)

Notify your community automatically when you go live and share your stream schedule across platforms:
1. **Discord Webhook Add-on:** In the **`🔗 Discord & Plattformen`** tab, paste your Discord Webhook URL (plus an optional separate Schedule Webhook) and role ping (`everyone`, `here`, or Role ID). Enable **Auto-post when OBS stream starts** to publish a rich embed with title, game & platform links automatically.
2. **X (Twitter), Bluesky, Mastodon & Instagram:**
   - **X (Twitter) API v2:** Enter your 4 OAuth 1.0a keys for direct auto-posting — or use the 1-click browser composer (`𝕏 Auf X (Browser)`).
   - **Bluesky & Mastodon:** Direct posting via App Password or Access Token.
   - **Instagram:** Use **`📸 Instagram Grafik + Quick-Post`** to generate a `1080×1350` PNG graphic for Go-Live or Schedule, copy caption + hashtags, and open Instagram — or connect the **Instagram Graph API** (Business/Creator account + optional ImgBB API key for automatic graphic upload).
3. **Schedule Ecosystem:**
   - **Twitch Schedule Sync:** Push upcoming slots directly to your Twitch channel schedule.
   - **OBS `/schedule` & `.ics` Calendar:** Use `http://127.0.0.1:4588/schedule` as an OBS Browser Source or export/share `/schedule.ics`.
   - **Chat Command:** Viewers can type `!schedule` or `!plan` in Twitch/YouTube chat anytime.

---

## 18. Live Giveaway, Soundboard & Chat-Hype Detector

- **🎁 Live Giveaway (`🎁 Giveaway`):** Set a title, chat keyword (e.g. `!join`), and Sub/VIP/Mod weight multiplier (`1×`–`3×`). Draw a weighted winner with the animated OBS overlay at `http://127.0.0.1:4588/giveaway`.
- **🔊 Integrated Soundboard (`🔊 Sounds`):** Trigger the 4 built-in sounds or add your own `.mp3`/`.wav`/`.ogg` files. Audio routes directly into OBS (`/alerts` and `/soundboard`) and can be triggered via Stream Deck API (`/api/streamdeck/sound?name=...`).
- **🔥 Chat-Hype Detector (`🔥 Hype`):** Monitors chat velocity (hype keywords count double) and automatically creates a **Twitch Stream Marker**, saves the **OBS Replay Buffer**, or creates a **Twitch Clip** during hype spikes.

## 19. OBS Scene & Source Editor (`🎛️ Szenen-Editor`)

- **Connect Directly:** The editor header includes a live status badge and **🔌 Mit OBS verbinden** button so you can connect or reconnect OBS WebSocket v5 directly inside the editor.
- **Crisp 1080p HD Snapshot Preview:** Loads a sharp `1920 × 1080` snapshot of your scene (no continuous live preview / VirtualCam overhead) and refreshes automatically whenever you change scenes/sources or click **🔄 Vorschau aktualisieren**. Audio-only sources are excluded from the 16:9 canvas overlay while remaining controllable in the right-hand source list and audio mixer.
- **Canvas Drag & Resize:** Drag any video source on the 16:9 preview to move it or drag corners to resize. Use **🎯 Zentrieren** / **⛶ Vollbild** for instant alignment.
- **Add & Configure Sources:** Create new sources (Browser, Image, Media, Text, Screen/Window Capture, Camera, Audio) and dynamically pick **Capture Mode**, **Display**, **Window**, **Application**, **Device**, or **Browser URL** under **🎯 Quelle konfigurieren** (enumerated locally on macOS for 100% crash-free OBS operation).

## 20. Automatic Updates (GitHub Releases)

- OmniGrid Studio checks `github.com/Lyyrrrriccs/omni-stream-chat/releases` on startup (and manually via **⚙️ Config → ⌨️ Peripherie & System → 🔄 Nach Updates suchen**).
- When a newer version is available, the matching macOS/Windows asset is downloaded automatically and a top banner offers **🚀 Jetzt installieren & neu starten**.
- Releases are built automatically via GitHub Actions (`.github/workflows/release.yml`) whenever a `v*` tag (e.g. `v1.2.0`) is pushed.

## 21. Smart Lighting: Elgato Key Light & Govee Event Scenes (`⚙️ Config → 🎥 OBS, Licht & Alerts`)

### 💡 Elgato Key Light & Stream Lighting
- **LAN Auto-Discovery (`Port 9123`):** Click **🔍 Suchen** to automatically discover Elgato Key Light / Key Light Air / Ring Light / Light Strip devices on your Wi-Fi (or enter multiple IPs comma-separated).
- **Live Controls & OBS Auto-Sync:** Adjust brightness (`3–100%`) and color temperature (`2900K–7000K`) live. With **🟢 Automatisch einschalten wenn Stream LIVE geht (OBS)** enabled, your studio lights turn on automatically when your OBS stream starts (and optionally turn off when the stream ends).

### 🌈 Govee Smart-Light & Event Scenes
- **Personal Govee API Key:** For licensing and rate-limit reasons, each streamer requests their own free Govee API key (*Govee Home App → Profile → Settings ⚙️ → Apply for API Key* or via **🌐 Govee API-Key beantragen / Developer-Portal öffnen**). The entire integration can be toggled on/off at any time.
- **Single or Multi-Lamp Selection:** After clicking **🔄 Geräte & Szenen laden**, check **a single lamp** (**Nur 1 Lampe**) or multiple lamps (**Alle**) in the lamp checklist.
- **Event Coupling & Per-Event Single-Lamp Override:** Assign any dynamic Govee scene, DIY scene, or RGB color preset to **🏠 Default Scene**, **🟢 Stream Start**, **💙 Follow**, **💜 Sub**, **🔮 Resub**, **🎁 Sub-Gift**, **🪙 Bits/Gift**, **🚀 Raid**, **🔥 Chat-Hype**, and **⏹️ Stream Stop** — either across your checked lamps (`🎯 Gewählte Lampe(n)`) or targeted to **a specific single lamp (`💡 Nur: <Lamp>`)** per event! Automatically reverts to your default scene after X seconds.

