<div align="center">

# ⚡ OmniGrid Studio

**Plattformübergreifender Multistream-Chat-Aggregator für Twitch, YouTube Live & TikTok Live**  
*Für Windows & macOS — mit animierten 7TV/BTTV/FFZ-Emotes, OBS Custom Browser Dock, Event-Hervorhebung, Schnellmoderation & Elgato Stream Deck Integration.*

[![Plattform](https://img.shields.io/badge/Plattform-Windows%20%7C%20macOS-blue?style=flat-square)](#installation--schnellstart)
[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=flat-square&logo=electron)](#standalone-apps-bauen)
[![OBS](https://img.shields.io/badge/OBS-Custom%20Dock%20%26%20Overlay-302E31?style=flat-square&logo=obsstudio)](#obs-integration)
[![Stream Deck](https://img.shields.io/badge/Elgato-Stream%20Deck%20API-000000?style=flat-square)](#stream-deck-integration)

🌐 **Sprache:** **Deutsch** | [English (README.md)](./README.md)  
📖 **Schritt-für-Schritt-Anleitungen:** [Deutsche Anleitung (ANLEITUNG.md)](./ANLEITUNG.md) | [English Guide (GUIDE.md)](./GUIDE.md)

</div>

---

## 💡 Warum OmniGrid Studio? (Abgrenzung & Gesamt-Suite)

Normalerweise müssen Multistreamer **4 bis 6 verschiedene Programme und kostenpflichtige Cloud-Dienste** kombinieren:
- **Restream / Streamlabs / StreamElements** für Chat & Alerts (Cloud-Zwang, Monatsabos, kein lokales 9:16-FFmpeg-Schnittstudio, keine WebHID-Zweittastatur-Steuerung, kein LAN-Tablet-Cockpit).
- **Streamer.bot / Mix It Up** für OBS-Automationen & Soundboards (nur Windows, komplexe Einrichtung, kein eigener Twitch+YouTube+TikTok-Chat mit 7TV/BTTV/FFZ-Emotes oder Videoschnitt).
- **Eklipse.gg / OpusClip / CapCut** für vertikale 9:16-Shorts (Cloud-Uploads, Wasserzeichen/Limits, komplett getrennt vom OBS Replay-Buffer & Live-Chat).
- **Pingcord / MEE6 / Buffer** für Go-Live-Posts & Sendepläne (separate Bots/Dienste, kein eingebauter 1080×1350-Grafik-Generator oder Multi-Plattform-Sync).

**OmniGrid Studio führt all das in einer 100 % lokalen Desktop-Suite zusammen (macOS & Windows, ohne Abo):**
- **Einheitliches Live-Cockpit:** Twitch, YouTube Live & TikTok Live Chat + Moderation + 7TV/BTTV/FFZ-Emotes + **Chat-Hype-Detektor** (automatische Twitch-Marker & OBS-Replays).
- **Broadcast- & Overlay-Zentrale:** OBS WebSocket v5 Steuerung + lokale Overlays (`/`, `/dock`, `/alerts`, `/goals`, `/poll`, `/spotify`, `/schedule`, `/giveaway`, `/soundboard`) + **Integriertes Soundboard** + **Live-Giveaway-Rad** + **Tablet Companion** + **Stream Deck API**.
- **Clips & Community-Wachstum:** Eingebautes **FFmpeg Clip- & 9:16-Shorts-Studio** (visueller Scrubber + Direkt-Upload zu YouTube/TikTok) + **Discord, Go-Live & Sendeplan-Studio** (Discord-Embeds, X API v2, Instagram Graph API + PNG-Generator, Bluesky, Mastodon, Twitch Schedule, `.ics`-Kalender).

---

## ✨ Funktionen im Überblick

| Bereich | Highlights |
|---|---|
| **Multi-Plattform-Chat** | Gleichzeitige Verbindung zu **Twitch** (IRC WebSocket + Helix Clip/Marker), **YouTube Live** (Lesen ohne API-Key, automatische & manuelle Stream-Erkennung + optionales Google OAuth2 PKCE zum Schreiben) und **TikTok Live** (Webcast). Chronologische Zusammenführung, einzelne Plattform-Toggles, Auto-Reconnect, Fehlerisolation & 3-Stufen-Duplikatschutz. |
| **Animierte Emotes** | **7TV** (Global & Kanal), **BTTV** und **FFZ** (Global & Kanal) sowie native **Twitch-**, **YouTube-** und **TikTok-Emotes** — animierte WebP/GIF-Wiedergabe, einzelne Anbieter-Toggles und kompakte Skalierung ohne Zeilenhöhen-Aufblähung. |
| **Cockpit, Stream-Manager & Hilfe** | Schlanke Live-Sidebar (Spotify, Live-Poll, TTS, Twitch Clip & Marker, OBS WebSocket v5, **Stream-Manager** für gleichzeitiges Update von Twitch- & YouTube-Titel, Spiel/Kategorie & Tags) kombiniert mit einer getabbten **Zentralen Config (`⚙️ Config`)** und integriertem **Anleitungs-Fenster (`📖 Anleitung`)**. |
| **Clip- & Replay-Studio (`🎬 Clips`)** | Eingebauter **FFmpeg**-Video-Workflow für **OBS Replay-Buffer** & Aufnahmen: visueller **Dual-Range Timeline-Scrubber** direkt am Videoplayer, verlustfreier **16:9-Zuschnitt**, vertikaler **9:16 Shorts/TikTok/Reels**-Export (Blur-Hintergrund oder Center-Crop), Umbenennen/Löschen, **direkter YouTube-Upload** (OAuth2) & **TikTok Quick-Upload**. |
| **Discord, Social & Sendeplan-Studio (`📅 Schedule & Go-Live`)** | **Discord Webhook** Go-Live & Sendeplan-Embeds (mit dynamischen Zeitzonen & OBS Auto-Post), **X (Twitter) API v2**, **Instagram Graph API** + **1080×1350 PNG-Grafik-Generator**, **Bluesky**, **Mastodon**, **Twitch Schedule Sync**, **OBS `/schedule`-Overlay**, **`.ics`-Kalender-Feed** & `!schedule` Chat-Befehl. |
| **Giveaway, Soundboard & Hype-Detektor** | **Live-Giveaway (`🎁 Giveaway`)** per `!join`-Chat-Befehl, Sub/VIP-Multiplikator & animiertem OBS-Overlay (`/giveaway`), **Soundboard (`🔊 Sounds`)** mit OBS-Routing (`/alerts` & `/soundboard`) + Stream Deck API sowie **Chat-Hype-Detektor (`🔥 Hype`)** für automatische Twitch-Marker, OBS-Replays & Clips bei Chat-Spikes. |
| **OBS-Integration, Szenen-Editor & WebSocket v5** | Szenenunabhängiges **OBS Custom Browser Dock** (`/dock`), **OBS Stream-Overlay** (`/`), **OBS Alert-Box Overlay** (`/alerts` mit eigenen GIFs/Audio-URLs), **OBS Goal-Bar** (`/goals`), **OBS Multistream-Poll** (`/poll`), **OBS Spotify-Widget** (`/spotify`), direkte **OBS WebSocket v5**-Steuerung sowie ein interaktiver **OBS Szenen- & Quellen-Editor (`🎛️ Szenen-Editor`)** mit flüssiger VirtualCam-Livevorschau, Drag & Resize per Maus, Quellen-Erstellung, dynamischer Fenster-/Anwendungs-/Geräte-/URL-Auswahl, Audio-Mixer & direktem OBS-Connect-Button. |
| **GitHub Auto-Updater** | Eingebauter **GitHub Releases Auto-Updater** prüft beim Start (oder per **🔄 Nach Updates suchen**) auf neue Versionen, lädt das passende macOS-/Windows-Release automatisch herunter und bietet eine 1-Klick-Installation inkl. Neustart. |
| **Custom Commands, Timer, Auto-Mod & TTS** | **Eigene Chat-Commands** (`!dc`, `!specs` usw. mit `{user}`/`{channel}`/`{uptime}`-Variablen & Cooldown), rotierender **Chat-Timer**, **Auto-Mod-Regeln** (Links blockieren, Caps-/Symbol-Spam, Wort-Blacklist mit Twitch-Timeout/Löschen) und **Text-to-Speech (TTS)** für Alerts & `!tts`. |
| **Event-Hervorhebung & Keyword-Alarme** | Eigene Farben, Stile (`Balken`, `Banner`, `Rahmen`) & Intensität für **Follows**, **Subs**, **Resubs**, **Gifted Subs**, **Bits/SuperChats/Gifts**, **Raids** und **Hervorgehobene Nachrichten** + eigene **Keyword-Alarme** mit Sound-Ping. |
| **Nutzer- & Nachrichten-Schnellmenü** | Linksklick oder Rechtsklick auf jede Nachricht: Nutzerübersicht (Avatar, Rollen, Twitch-Account-Alter), Text/Name kopieren, Antworten, Profil öffnen, Löschen, Timeout (`10s`, `1m`, `10m`, `1h`), 2-Stufen-Ban & Unban mit Berechtigungsprüfung. |
| **Stream Deck & Tablet Companion** | Eingebaute lokale REST-API (`http://127.0.0.1:4588/api/streamdeck/*`) + **Tablet & iPad Companion** (`http://<LAN-IP>:4588/tablet` oder Tailscale VPN per QR-Code) für Touch-Chat, Clips, Marker, OBS-Steuerung & Polls ohne App-Installation. |
| **Peripherie & Globale Hotkeys** | Unterstützung für eine **separate Zweittastatur / ein Makro-Pad & eine Zweitmaus** per **WebHID** (Chat tippen/scrollen ohne aus dem Spiel zu tabben) + systemweite **Globale Hotkeys**. |
| **Spotify, Apple & Amazon Music + `!song` Bot** | Lokale **Spotify-, Apple-Music- & Amazon-Music**-Desktop-Anbindung ohne API-Key (inkl. automatischem Album-Cover-Lookup): Live Now-Playing-Steuerung, automatische Twitch-/YouTube-Antwort auf `!song` / `!music` und transparentes **OBS Musik-Widget** (`http://127.0.0.1:4588/spotify`). |
| **Chat-Suche, Export & Diagnose** | Live **Chat-Suche (`⌘/Ctrl+F`)** mit Plattform- & Autor-Filter, **Chat-Log-Export (`💾 Export`)** als `.txt` oder `.json`, 60fps `requestAnimationFrame` Batch-Rendering, DOM-/RAM-Limit, JSON-Config-Backup, **Statistik- & Diagnose-Log**, Bot-Filter & Spam-Zusammenfassung (`×N`). |

---

## 🚀 Installation & Schnellstart

### Option 1: Fertige Desktop-App (ohne Terminal starten)
- **macOS:** Doppelklick auf `dist/OmniGridStudio.app` (oder in den Ordner `Programme` ziehen).
- **Windows:** Den Ordner `dist/OmniGridStudio-win32-x64` kopieren und direkt auf `OmniGridStudio.exe` doppelklicken.

### Option 2: Aus dem Quellcode starten
```bash
git clone <DEINE_REPO_URL>
cd omni-stream-chat
npm install
npm start       # Desktop-App starten
npm run demo    # Mit simuliertem Multistream-Demo-Chat starten
```

---

## 🛠️ Standalone-Apps bauen

```bash
npm run build:mac   # Erstellt dist/OmniGridStudio.app
npm run build:win   # Erstellt dist/OmniGridStudio-win32-x64/OmniGridStudio.exe
```

---

## 🎥 OBS- & Companion-Integration

| Ziel | URL | Zweck |
|---|---|---|
| **OBS Custom Browser Dock** | `http://127.0.0.1:4588/dock` | Interaktives, szenenunabhängiges Chat-Dock direkt in OBS (*Ansicht → Docks → Benutzerdefinierte Browser-Docks*) |
| **OBS Stream-Overlay** | `http://127.0.0.1:4588` | Transparente Browser-Quelle für deine Zuschauer (inkl. live angepinnter Nachrichten) |
| **OBS Alert-Box Overlay** | `http://127.0.0.1:4588/alerts` | Transparente Alert-Queue (Follow, Sub, Resub, Sub-Gift, Bits/SuperChat, Raid) mit eigenen GIFs/Audio & Sound |
| **OBS Goal-Bar** | `http://127.0.0.1:4588/goals` | Transparenter Follower-/Sub-Zielbalken mit automatischem Hochzählen bei Live-Events |
| **OBS Multistream-Poll** | `http://127.0.0.1:4588/poll` | Plattformübergreifende Chat-Umfrage (`!vote 1..N`) mit Ein-/Ausblenden |
| **OBS Spotify-Widget** | `http://127.0.0.1:4588/spotify` | Transparente Now-Playing-Karte mit Album-Cover & Live-Track-Updates |
| **Tablet & iPad Companion** | `http://<LAN-IP>:4588/tablet` | Touch-optimiertes Chat-, Clip-, OBS- & Stream-Deck-Dashboard (WLAN + Tailscale QR-Umschalter) |

---

## 🎛️ Stream Deck Integration

In der **Elgato Stream Deck App** die Aktion **System → Website** auf eine Taste ziehen, eine URL einfügen (unter **⚙️ Config → 📱 Tablet & Stream Deck** per 1-Klick kopierbar) und **„Anfrage im Hintergrund senden“** aktivieren:

| Aktion | Endpunkt |
|---|---|
| Letzte Nachricht in OBS pinnen | `http://127.0.0.1:4588/api/streamdeck/pin-last` |
| Angepinnte Nachricht ausblenden | `http://127.0.0.1:4588/api/streamdeck/unpin` |
| Poll ein-/ausblenden | `http://127.0.0.1:4588/api/streamdeck/toggle-poll` |
| Twitch Clip / Marker / Kombi | `.../clip` • `.../marker?description=Highlight` • `.../clip-and-marker?description=Highlight` |
| OBS Replay / Mic Mute / Rec / Stream / Szene | `.../obs-replay` • `.../obs-mic` • `.../obs-record` • `.../obs-stream` • `.../obs-scene?name=Szene` |
| Chat-Verlauf leeren | `http://127.0.0.1:4588/api/streamdeck/clear-chat` |
| OBS Test-Alert auslösen | `http://127.0.0.1:4588/api/streamdeck/test-alert?type=sub` |
| Quick-Chat-Nachricht senden | `http://127.0.0.1:4588/api/streamdeck/send?text=GG!` |
| Kompakt / Sound / Always-on-Top | `.../toggle-compact` • `.../toggle-sound` • `.../toggle-always-on-top` |
| Alle Plattformen neu verbinden | `http://127.0.0.1:4588/api/streamdeck/reconnect?platform=all` |
| Spotify: Nächster / Vorheriger / Play-Pause / Posten | `.../spotify-next` • `.../spotify-prev` • `.../spotify-playpause` • `.../spotify-announce` |

---

## 📚 Ausführliche Anleitungen

- **[Changelog (CHANGELOG.md)](./CHANGELOG.md)** — Versionshistorie und alle Neuerungen im Überblick.
- **[Deutsche Schritt-für-Schritt-Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)** — Einrichtung von Twitch-Token, YouTube, TikTok, OBS-Docks, Clip- & Replay-Studio, Stream-Manager, Custom Commands & Stream Deck.
- **[English User Guide (GUIDE.md)](./GUIDE.md)** — Complete setup guide in English.
