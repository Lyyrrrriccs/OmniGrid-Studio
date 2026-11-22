# Changelog

Alle wichtigen Änderungen und neuen Features von **OmniGrid Studio** im Überblick.

---

## [1.1.0] — 2026-11-22

### ✨ Neue Features
- **Chat-Hype-Detektor (`🔥 Hype`), Live-Giveaway (`🎁 Giveaway`) & Soundboard (`🔊 Sounds`):**
  - **Chat-Hype-Detektor:** Erkennt Chat-Spikes im konfigurierbaren Zeitfenster (Hype-Keywords zählen doppelt) und setzt automatisch **Twitch Stream-Marker**, speichert den **OBS Replay-Buffer** und/oder erstellt einen **Twitch Clip**.
  - **Live-Giveaway & Verlosungs-Rad (`/giveaway`):** Zuschauer treten per Chat-Keyword (`!join`) auf Twitch, YouTube & TikTok bei (mit Sub/VIP/Mod-Multiplikator `1×`–`3×`); gewichtete Ziehung mit animiertem OBS-Overlay.
  - **Integriertes Soundboard (`/soundboard` & `/alerts`):** 4 eingebaute Standard-Sounds + eigene `.mp3`/`.wav`/`.ogg`-Dateien (gestreamt via `/api/sound/:id`), OBS-Routing und Stream Deck Endpunkt (`/api/streamdeck/sound?name=...`).
- **Discord, Go-Live & Sendeplan-Studio (`📅 Schedule & Go-Live`):**
  - **Discord Webhook Add-on:** Rich-Embeds für Stream-Start (Go-Live) und Sendeplan (mit automatischen Discord-Zeitzonen-Timestamps `<t:UNIX:F>`) inkl. optionalem Rollen-Ping und **Auto-Post bei OBS-Stream-Start**.
  - **Social Auto-Posting:** Direkte Integration für **X (Twitter) API v2 (OAuth 1.0a)**, **Bluesky (ATProto)**, **Mastodon** und **Instagram Graph API (Business/Creator)** (inkl. optionalem ImgBB-Upload für generierte Grafiken).
  - **Instagram Grafik-Generator & Quick-Post:** Erstellt auf Knopfdruck `1080×1350`-PNG-Grafiken für Go-Live und Sendeplan, kopiert Caption + Hashtags und öffnet Instagram.
  - **1-Klick-Share & Sendeplan-Ökosystem:** Browser-Share für X, Threads & YouTube Community, **Twitch Schedule Sync** (`Helix`), **OBS/Web-Sendeplan (`/schedule`)**, **iCalendar-Feed (`/schedule.ics` & `.ics`-Export)**, Chat-Befehl **`!schedule` / `!plan`** sowie Stream Deck Endpunkte (`/api/streamdeck/go-live`, `/api/streamdeck/post-schedule`).
- **Clip- & Replay-Studio (`🎞️ Clip-Studio`):**
  - Replay-/Aufnahme-Browser (inkl. `shorts/` und `trimmed/` Unterordnern) mit HTML5-Videovorschau.
  - Visueller **Dual-Range-Timeline-Schieberegler** (Start- & End-Marker mit Live-Frame-Scrubbing) sowie **▶ Auswahl testen**.
  - **✂️ 16:9 schneiden** & **📱 Als 9:16 Short** Export via `ffmpeg` (Blur-Hintergrund oder Center-Crop).
  - Clips direkt **✏️ Umbenennen**, in den Papierkorb **🗑️ Löschen**, sowie **▶️ YT** (Direkt-Upload als Privat-Entwurf via YouTube Data API v3) und **🎵 TT** (TikTok Upload-Seite + Datei markieren) direkt neben jedem Video.
- **Stream-Manager (`📝 Stream-Manager`):**
  - Stream-Titel, Spiel/Kategorie (mit Live-Suche) und Tags für **Twitch** direkt aus der Sidebar laden und aktualisieren — inkl. optionalem Titel-Sync zu **YouTube**.
- **Zentrale Konfigurationsseite (`⚙️ Config`) & Anleitungs-Fenster (`📖 Anleitung`):**
  - Alle Setup-Einstellungen (Plattformen, Profil/Events, Design/Emotes, OBS/Alerts/TTS, Bot/Auto-Mod, Tablet/Stream Deck, Peripherie/System) übersichtlich in Tabs gebündelt.
  - Eigenes Markdown-Hilfefenster (`📖 Anleitung`) mit Suche und Sprachumschaltung (`ANLEITUNG.md`, `GUIDE.md`, `README.de.md`, `README.md`).
- **Bot, Auto-Mod & Chat-Tools:**
  - **Custom Chat-Commands** (`!befehl | Antworttext`, Cooldown, `{user}`/`{platform}`, `!commands`) für Twitch & YouTube.
  - **Chat-Timer** für rotierende Info-Nachrichten alle X Minuten.
  - **Auto-Mod-Regeln** (Link-, Caps- & Symbol-Filter, Wort-Blacklist, automatisches Löschen/Timeout auf Twitch).
  - **Chat-Suche (`⌘/Ctrl+F`)** und **💾 Export** (`.txt` / `.json`).
- **OBS-Widgets, WebSocket v5 & Twitch Actions:**
  - **OBS Alert-Box Overlay (`/alerts`)** mit Event-Filter, Animationen, Sound-Chime & eigenen GIF-/Audio-URLs.
  - **OBS Goal-Bar (`/goals`)** mit Auto-Increment bei Follows/Subs.
  - **OBS Multistream-Poll (`/poll`)** mit `!vote 1..N` und **👁️ Ein-/Ausblenden** (App, Tablet & `/api/streamdeck/toggle-poll`).
  - **Text-to-Speech (TTS)** für Events/Alerts und `!tts`-Nachrichten.
  - **OBS WebSocket v5** Steuerung (Szenenwechsel, Replay-Buffer, Mic-Mute, Aufnahme, Stream) in App, Tablet & Stream Deck.
  - **Twitch Clip & Stream-Marker** auf Knopfdruck (`/clip`, `/marker`, `/clip-and-marker`).
- **YouTube Chat-Schreiben (OAuth2 PKCE):**
  - Optionaler Google-OAuth2-Login in der YouTube-Karte zum Senden von Chat-Nachrichten, `!song`-Antworten und Video-Uploads.
- **Tablet Companion (`/tablet`) & App-Icons:**
  - WLAN/Tailscale-Netzwerk-Umschalter mit QR-Code + `NSLocalNetworkUsageDescription` für macOS.
  - Eigenes **OmniGrid Studio** App-Icon für macOS Dock (`.icns`) und Windows (`.ico`).

---

## [1.0.0] — Initial Release
- Multistream Chat Aggregator für **Twitch**, **YouTube Live** und **TikTok Live** mit 7TV/BTTV/FFZ-Emotes, kompaktem Streamer-Layout, OBS Custom Browser Dock (`/dock`), OBS Stream-Overlay (`/`), Spotify-Bridge (`/spotify` + `!song`), WebHID-Zweittastatur/Zweitmaus & Elgato Stream Deck REST-API.
