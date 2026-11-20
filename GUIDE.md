# 📖 OmniStream Chat — Complete User Guide (English)

🌐 [Back to Overview (README.md)](./README.md) | [Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)

---

## 1. Launching the App (No Terminal Required)

- **macOS:** Double-click `dist/OmniStreamChat.app` (or drag it to `/Applications`).
- **Windows:** Copy the `dist/OmniStreamChat-win32-x64` folder to your streaming PC and double-click `OmniStreamChat.exe`.

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
3. Enter a dock name (e.g., `OmniStream Chat`), paste the URL, and click **Apply**.
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
3. In OmniStream Chat under **"🎛️ Stream Deck Integration"**, click **📋 URL** next to your desired action (e.g., `Pin latest message to OBS` or your custom quick-chat generator).
4. Paste the URL into Stream Deck and **enable "GET request in background"**.
5. Use **▶ Test** inside OmniStream Chat to verify any action immediately.

---

## 8. Peripheral Selection (2nd Keyboard, 2nd Mouse & Global Hotkeys)

Under **"⌨️ Peripherie-Auswahl (Zweitgeräte)"**, you can bind a dedicated secondary USB keyboard, numpad/macro pad, or mouse exclusively to OmniStream Chat:
1. Click **"🔍 Scannen"** to list all connected USB keyboards and mice.
2. **2nd Keyboard (`🔌 Verbinden`):**
   - **Mode `Chat tippen + F1–F4 Makros`:** Type a chat message directly on your secondary keyboard and press `Enter` to send without alt-tabbing out of your game. `F1`–`F4` trigger Pin, Unpin, Clear Chat, and Compact Mode.
   - **Mode `Nur Makros`:** Keys `1`–`4` / `F1`–`F4` trigger the 4 quick actions immediately.
3. **2nd Mouse (`🖱️ Verbinden`):** Scroll wheel scrolls the chat feed, left-click pins the latest message to OBS, right-click unpins it.
4. **🌐 Global Hotkeys:** If your OS restricts direct WebHID access to your primary keyboard, the configurable system-wide hotkeys (`Ctrl/Cmd+Alt+P/U/C/K`) work in every game and application.

---

## 9. Spotify Live & `!song` Chat Bot

Under **"🎵 Spotify Live & !song Bot"**, OmniStream Chat reads the current track directly from your local Spotify desktop app (zero API key setup!):
- **Live Controls:** **⏮ / ⏯ / ⏭** and **📢 Announce current track in Twitch chat**.
- **Automatic `!song` / `!music` Bot:** When a viewer types `!song` or `!music` in Twitch chat, the app automatically replies with the current artist & track *(with a 15s anti-spam cooldown)*.
- **OBS Spotify Widget:** Add `http://127.0.0.1:4588/spotify` as an OBS Browser Source (e.g., `420 × 80`) to display a transparent Now-Playing card with album art on stream.

---

## 10. Tablet & iPad Companion (`/tablet`)

Under **"📱 Tablet & iPad Companion"**, you will find a QR code and local Wi-Fi URL (`http://<LAN-IP>:4588/tablet`):
- Scan the QR code with your **iPad** or **Android tablet** on the same Wi-Fi network (no app install needed).
- Gives you a touch-friendly dashboard with live chat, quick-reply input, and Stream Deck buttons (pin, unpin, demo, Spotify controls).

