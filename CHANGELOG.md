# Changelog

Alle wichtigen Änderungen und neuen Features von **OmniGrid Studio** im Überblick.

---

## [1.2.0] — 2026-11-24

### ✨ Neue Features & Erweiterungen
- **Philips Hue & Nanoleaf Smart-Light (100 % Lokal im WLAN — komplett ohne Cloud!):**
  - **💡 Philips Hue Bridge LAN-Steuerung (`src/hue_lights.js`):** Lokale Bridge-Suche im Heimnetz (SSDP + Subnetz-Scan ohne Cloud), 1-Klick-Kopplung über den physischen Bridge-Knopf, Einzel-/Mehrfach-Lampenauswahl, Laden aller gespeicherten **Hue-Szenen**, Helligkeits-/Farbsteuerung, Alert-Flash sowie Kopplung an OBS-Start/Ende und alle Stream-Events (*Follow, Sub, Resub, Sub-Gift, Bits, Raid, Chat-Hype*) inkl. Auto-Revert.
  - **🔺 Nanoleaf Shapes / Lines / Canvas LAN-Steuerung (`src/nanoleaf_lights.js`, Port `16021`):** Lokale Suche & Kopplung (5–7s Power-Taste am Controller, kein Account/keine Cloud), automatisches Auslesen aller gespeicherten **Nanoleaf-Effekte**, Live-Steuerung sowie Kopplung an alle Stream-Events & OBS-Start/Ende.
- **Mehrsprachiges JSON-Übersetzungssystem (`🇩🇪 DE` / `🇬🇧 EN`):**
  - Vollständige JSON-Sprachdateien (`src/locales/de.json` & `src/locales/en.json`, jeweils 850+ Schlüssel) für sämtliche Menüs, Topbar-Buttons, Seitenleisten, Config-Tabs, Modals, Platzhalter, Tooltips und dynamischen Statusanzeigen.
  - Direkte **Live-Sprachauswahl im Hauptfenster** (Topbar) sowie in der nativen macOS-/Windows-Menüleiste (`🌐 Sprache / Language`) ohne App-Neustart; automatisch erweiterbar über zusätzliche `<lang>.json`-Dateien.
- **Game-Addons: League of Legends & Just Chatting Komplett-Suites (`🎮 Game-Addons`):**
  - **Schreibgeschützte Vorlagen & OBS-Overlay-Schalter:** Vorgefertigte Addon-Vorlagen sind schreibgeschützt (`↺ Werte zurücksetzen`); alle Game-Addon-Overlays lassen sich per Checkbox **👁️ OBS Game-Stats-Overlay anzeigen** oder Stream Deck (`/api/streamdeck/game-overlay?state=toggle`) sofort ein-/ausblenden.
  - **⚔️ League of Legends Komplett-Suite:**
    - **Lokales LCU-Auslesen (`127.0.0.1`, ohne Riot-API-Key):** Liest echten **Solo/Duo- bzw. Flex-Rank**, **exakte aktuelle LP** sowie **Riot-ID (`Name#TAG`) + Region** live aus dem geöffneten League-Client (`🔄 Rank & LP aus LoL-Client lesen` + Auto-Poll).
    - **Live Ingame API (`127.0.0.1:2999`) & Auto-Highlights:** Liest Champion, Skin, Lane/Rolle, KDA, CS/m, Level, Gold, Keystone-Rune, Summoner Spells & alle **6 Inventar-Items + Trinket** live aus; setzt automatisch Twitch-Stream-Marker bei Triple/Quadra/Baron und löst bei **Pentakill** automatisch den **Hype-Clip inkl. Chat-Post** aus.
    - **3 Hextech-Overlays:** `/game-stats` (mit Hextech **Rank- & LP-Box inkl. Fortschrittsbalken** direkt rechts neben dem Champion-Icon), `/lol-build` (Live Item-Build & Elo-Bar) und `/lol-map` (Anti-Ghosting Minimap-Cover).
    - **Chat-Commands:** `!elo`, `!lp`, `!rank`, `!opgg`, `!ugg`, `!champ`, `!skin`, `!build`, `!items`, `!runes`, `!mh`.
  - **💬 Just Chatting & Talk Suite:**
    - **3 Talk-/Podcast-Overlays:** `/jc-lowerthird` (TV-Bauchbinde mit Live-Thema, Vibe-Badge, Uhrzeit & Social-Ticker), `/jc-qna` (Viewer Q&A Spotlight) und `/game-stats` (Kapitel-Agenda).
    - **Live Viewer-Q&A & Moderation:** Zuschauer reichen Fragen per `!ask <Frage>` / `!frage <Frage>` ein; Steuerung im UI oder direkt per Chat (`!setthema`, `!nextq`, `!thema`, `!agenda`, `!video`).
- **OBS Szenen- & Quellen-Editor Upgrades (`🎛️ Szenen-Editor`):**
  - **1-Klick App-Overlays & Komplett-Sets (ohne URL-Kopieren):** Alle **13 integrierten OmniGrid-Overlays** lassen sich direkt per Dropdown einfügen — inklusive 1-Klick-Szenenpaketen **`⚔️ Komplettes LoL-Set`** und **`💬 Just-Chatting-Set`**.
  - **Vordergrund & Hintergrund (Ebenen-Steuerung):** Quellen per Toolbar (`⏫ Vordergrund`, `🔼 Vor`, `🔽 Hinter`, `⏬ Hintergrund`), Zeilen-Buttons (`🔼`/`🔽`) oder **Drag & Drop (`⠿`)** frei sortieren.
- **Discord Live-Announcer (`📅 Schedule & Go-Live`):**
  - Einmaliger Post pro Stream (bei OBS-Start und/oder Twitch-Live-Erkennung ohne Doppel-Post), **automatisches Live-Update alle 5 Minuten** (Titel, Spiel, Zuschauer, „Live seit“-Timer & Twitch-Vorschaubild ohne erneuten Rollen-Ping) und automatisches Umstellen auf **„⚫ Stream beendet“** inkl. Dauer & Zuschauer-Peak bei Stream-Ende.
- **Chat-Hype-Detektor Verbesserungen (`🔥 Hype`):**
  - Zuverlässige Wortanfangs-Keyword-Erkennung, einstellbare **Keyword-Treffer-Schwelle** (Standard: `3×`), **Live-Hype-Meter**, manueller **`🔥 Hype jetzt auslösen`**-Button sowie **automatische Twitch-Clip-Erstellung mit direktem Posten des Clip-Links in den Twitch-/YouTube-Chat**.

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
- **Lokales Multi-Plattform-Streaming Relay (`📡 Multi-Plattform-Stream`):**
  - OBS rendert und enkodiert nur noch `1×` lokal an `rtmp://127.0.0.1:1935/live/omnigrid` (inkl. 1-Klick-Auto-Konfiguration in OBS via `SetStreamServiceSettings`), während OmniGrid Studio den Stream per FFmpeg Tee-Muxer (`-c copy`, 0 % zusätzliche GPU-/CPU-Enkodierlast, `onfail=ignore`) gleichzeitig an **Twitch**, **YouTube Live**, **TikTok Live** und **Kick / Custom RTMP** verteilt — mit Live-Bitrate/FPS-Anzeige und Auto-Start/Stopp von OBS.
- **OBS Szenen- & Quellen-Editor (`🎛️ Szenen-Editor`):**
  - Interaktive 16:9-Leinwand mit Maus-Drag & Resize, scharfer **1080p HD-Standbild-Vorschau** (aktualisiert bei Änderungen, ohne Audio-Geräte-Boxen im Vorschaubild), **OBS WebSocket Connect-Button direkt im Editor**, Quellen-Erstellung, Audio-Mixer sowie crash-sicherer Auswahl für **Aufnahme-Modus**, **Bildschirm**, **Fenster**, **Anwendung**, **Gerät** und **Browser-URL**.
- **GitHub Releases Auto-Updater, Feedback-Dialog (`💬 Feedback`) & CI-Workflow:**
  - Automatische Update-Prüfung beim Start + manueller Button (**🔄 Nach Updates suchen**), automatischer Download des Plattform-Releases, Update-Banner mit 1-Klick-Installation & Neustart sowie `.github/workflows/release.yml` für automatische macOS/Windows-Releases bei `v*`-Tags.
  - Integrierter **💬 Feedback**-Button in der Topbar zum Anlegen von **GitHub Discussions** (direkt per GitHub GraphQL API `createDiscussion` oder als vorausgefülltes Browser-Formular) und GitHub Issues inkl. automatischer Versions- & System-Info.
- **Datenschutz- & Zero-Telemetry-Nachweis (`🔒 Datenschutz` & `PRIVACY.md`):**
  - Interaktiver **🔒 Datenschutz**-Dialog in der Topbar mit Live-Quellcode-Domain-Scanner (`scripts/audit_privacy.js`), Direktzugriff auf die lokale `config.json` und den unverschlüsselten `src/`-Ordner, 10-Sekunden-OS-Netzwerk-Selbsttest sowie automatischem CI-Domain-Audit + SHA-256 Checksummen bei jedem GitHub-Release.
- **Apple Music & Amazon Music Support (macOS & Windows):**
  - Die lokale Musik-Bridge unterstützt neben **Spotify** jetzt auch **Amazon Music** (über macOS `MediaRemote` & Windows) und **Apple Music** (`Music.app` / `iTunes`) ohne API-Key — inklusive Play/Pause/Skip-Steuerung, `!song`-Chat-Bot, automatischem Album-Cover-Lookup und dynamischem `AMAZON MUSIC` (`#00a8e1`) / `APPLE MUSIC` (`#fb7185`) / `SPOTIFY` (`#1ed760`) Badge im OBS-Widget (`/spotify`).
- **Elgato Key Light & Stream-Licht (`💡 Elgato Key Light`):**
  - Lokale WLAN-Steuerung (Port `9123`) in der Zentralen Config (`🎥 OBS, Licht & Alerts`) für Elgato Key Light / Key Light Air / Ring Light / Light Strip inkl. 1-Klick-WLAN-Suche (`🔍 Suchen`), Live-Slidern für Helligkeit (`3–100%`) & Farbtemperatur (`2900–7000K`) sowie **automatischem Einschalten bei OBS-Stream-Start** (und optionalem Ausschalten bei Stream-Ende).
- **Govee Smart-Light & Event-Szenen (`🌈 Govee Smart-Light`):**
  - Integration der Govee OpenAPI v1.0 (mit eigenem Govee API-Key des Streamers + Direktlink zum Developer-Portal). Lädt alle Govee-Lampen (einzeln oder mehrere per Checkliste sowie optional **einzelne Lampe pro Event** auswählbar), dynamischen Lichtszenen, DIY-Szenen & Farben und koppelt sie frei wählbar (und jederzeit abschaltbar) an **Stream-Start**, **Stream-Ende**, **Follow**, **Sub**, **Resub**, **Sub-Gift**, **Bits/SuperChat/Gift**, **Raid** und **Chat-Hype-Spike** — inklusive automatischer Rückkehr zur Standard-Szene nach X Sekunden.
- **UI-Verbesserungen:**
  - Großzügiges Fenster für die **Zentrale Konfiguration (`⚙️ Config`, `96vw × 92vh`)**.
  - Kommagetrennte Tag-/Keyword-Listen (Keyword-Alarme, Poll-Optionen, Stream-Tags, Auto-Mod-Blacklist, Hype-Keywords) nutzen jetzt mehrzeilige, vertikal vergrößerbare `<textarea>`-Felder.
- **Tablet Companion (`/tablet`) & App-Icons:**
  - WLAN/Tailscale-Netzwerk-Umschalter mit QR-Code + `NSLocalNetworkUsageDescription` für macOS.
  - Eigenes **OmniGrid Studio** App-Icon für macOS Dock (`.icns`) und Windows (`.ico`).

---

## [1.0.0] — Initial Release
- Multistream Chat Aggregator für **Twitch**, **YouTube Live** und **TikTok Live** mit 7TV/BTTV/FFZ-Emotes, kompaktem Streamer-Layout, OBS Custom Browser Dock (`/dock`), OBS Stream-Overlay (`/`), Spotify-Bridge (`/spotify` + `!song`), WebHID-Zweittastatur/Zweitmaus & Elgato Stream Deck REST-API.
