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
   > *Note: Reading live chat, SuperChats, Members, and custom YouTube emotes works without an API key. Sending messages to YouTube requires official YouTube Data API v3 OAuth2.*

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
