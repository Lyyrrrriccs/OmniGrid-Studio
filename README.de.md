<div align="center">

# ⚡ OmniStream Chat

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

## ✨ Funktionen im Überblick

| Bereich | Highlights |
|---|---|
| **Multi-Plattform-Chat** | Gleichzeitige Verbindung zu **Twitch** (IRC WebSocket), **YouTube Live** (Lesen ohne API-Key, automatische & manuelle Stream-Erkennung + optionales Google OAuth2 PKCE zum Schreiben) und **TikTok Live** (Webcast). Chronologische Zusammenführung, einzelne Plattform-Toggles, Auto-Reconnect, Fehlerisolation & 3-Stufen-Duplikatschutz. |
| **Animierte Emotes** | **7TV** (Global & Kanal), **BTTV** und **FFZ** (Global & Kanal) sowie native **Twitch-**, **YouTube-** und **TikTok-Emotes** — animierte WebP/GIF-Wiedergabe, einzelne Anbieter-Toggles und kompakte Skalierung ohne Zeilenhöhen-Aufblähung. |
| **Kompaktes Streamer-Design** | Echtes Inline-Layout für ein schmales, hohes Fenster (`minWidth: 220px`) links neben OBS, anpassbare Schriftgrößen, Namenskürzung, ein-/ausblendbare Icons & Zeitstempel, konfigurierbare Trennlinien und Live-Sync zu OBS. |
| **OBS-Integration & Alert-Box** | Szenenunabhängiges **OBS Custom Browser Dock** (`/dock`), **OBS Stream-Overlay** (`/`), konfigurierbares **OBS Alert-Box Overlay** (`/alerts` mit Event-Filter, Animation & Sound), **OBS Spotify-Widget** (`/spotify`) und ein **separates Vollhöhen-Chatfenster**. |
| **Event-Hervorhebung & Keyword-Alarme** | Eigene Farben, Stile (`Balken`, `Banner`, `Rahmen`) & Intensität für **Follows**, **Subs**, **Resubs**, **Gifted Subs**, **Bits/SuperChats/Gifts**, **Raids** und **Hervorgehobene Nachrichten** + eigene **Keyword-Alarme** mit Sound-Ping. |
| **Nutzer- & Nachrichten-Schnellmenü** | Linksklick oder Rechtsklick auf jede Nachricht: Nutzerübersicht (Avatar, Rollen, Twitch-Account-Alter), Text/Name kopieren, Antworten, Profil öffnen, Löschen, Timeout (`10s`, `1m`, `10m`, `1h`), 2-Stufen-Ban & Unban mit Berechtigungsprüfung. |
| **Stream Deck & Tablet Companion** | Eingebaute lokale REST-API (`http://127.0.0.1:4588/api/streamdeck/*`) + **Tablet & iPad Companion** (`http://<LAN-IP>:4588/tablet` per QR-Code) für Touch-Chat, Quick-Reply & Stream-Steuerung ohne App-Installation. |
| **Peripherie & Globale Hotkeys** | Unterstützung für eine **separate Zweittastatur / ein Makro-Pad & eine Zweitmaus** per **WebHID** (Chat tippen/scrollen ohne aus dem Spiel zu tabben) + systemweite **Globale Hotkeys**. |
| **Spotify Live & `!song` Bot** | Lokale Spotify-Desktop-Anbindung ohne API-Key: Live Now-Playing-Steuerung, automatische Twitch-/YouTube-Antwort auf `!song` / `!music` und transparentes **OBS Spotify-Widget** (`http://127.0.0.1:4588/spotify`). |
| **Performance & Diagnose** | 60fps `requestAnimationFrame` Batch-Rendering, einstellbares DOM-/RAM-Limit, JSON-Export/Import, ausklappbarer **Statistik- & Diagnose-Log-Tab**, Bot-Filter & Spam-Zusammenfassung (`×N`). |

---

## 🚀 Installation & Schnellstart

### Option 1: Fertige Desktop-App (ohne Terminal starten)
- **macOS:** Doppelklick auf `dist/OmniStreamChat.app` (oder in den Ordner `Programme` ziehen).
- **Windows:** Den Ordner `dist/OmniStreamChat-win32-x64` kopieren und direkt auf `OmniStreamChat.exe` doppelklicken.

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
npm run build:mac   # Erstellt dist/OmniStreamChat.app
npm run build:win   # Erstellt dist/OmniStreamChat-win32-x64/OmniStreamChat.exe
```

---

## 🎥 OBS- & Companion-Integration

| Ziel | URL | Zweck |
|---|---|---|
| **OBS Custom Browser Dock** | `http://127.0.0.1:4588/dock` | Interaktives, szenenunabhängiges Chat-Dock direkt in OBS (*Ansicht → Docks → Benutzerdefinierte Browser-Docks*) |
| **OBS Stream-Overlay** | `http://127.0.0.1:4588` | Transparente Browser-Quelle für deine Zuschauer (inkl. live angepinnter Nachrichten) |
| **OBS Alert-Box Overlay** | `http://127.0.0.1:4588/alerts` | Transparente Alert-Queue (Follow, Sub, Resub, Sub-Gift, Bits/SuperChat, Raid) mit Event-Filter & Sound |
| **OBS Spotify-Widget** | `http://127.0.0.1:4588/spotify` | Transparente Now-Playing-Karte mit Album-Cover & Live-Track-Updates |
| **Tablet & iPad Companion** | `http://<LAN-IP>:4588/tablet` | Touch-optimiertes Chat-, Quick-Reply- & Stream-Deck-Dashboard für jedes Tablet (QR-Code in der App) |

---

## 🎛️ Stream Deck Integration

In der **Elgato Stream Deck App** die Aktion **System → Website** auf eine Taste ziehen, eine URL einfügen (in der App per 1-Klick kopierbar) und **„Anfrage im Hintergrund senden“** aktivieren:

| Aktion | Endpunkt |
|---|---|
| Letzte Nachricht in OBS pinnen | `http://127.0.0.1:4588/api/streamdeck/pin-last` |
| Angepinnte Nachricht ausblenden | `http://127.0.0.1:4588/api/streamdeck/unpin` |
| Chat-Verlauf leeren | `http://127.0.0.1:4588/api/streamdeck/clear-chat` |
| OBS Test-Alert auslösen | `http://127.0.0.1:4588/api/streamdeck/test-alert?type=sub` |
| Quick-Chat-Nachricht senden | `http://127.0.0.1:4588/api/streamdeck/send?text=GG!` |
| Kompakt-Modus umschalten | `http://127.0.0.1:4588/api/streamdeck/toggle-compact` |
| Sound-Alerts stumm/an | `http://127.0.0.1:4588/api/streamdeck/toggle-sound` |
| Always-on-Top umschalten | `http://127.0.0.1:4588/api/streamdeck/toggle-always-on-top` |
| Alle Plattformen neu verbinden | `http://127.0.0.1:4588/api/streamdeck/reconnect?platform=all` |
| Spotify: Nächster / Vorheriger / Play-Pause | `.../spotify-next` • `.../spotify-prev` • `.../spotify-playpause` |
| Spotify: Song im Chat posten | `http://127.0.0.1:4588/api/streamdeck/spotify-announce` |

---

## 📚 Ausführliche Anleitungen

- **[Deutsche Schritt-für-Schritt-Anleitung (ANLEITUNG.md)](./ANLEITUNG.md)** — Einrichtung von Twitch-Token, YouTube, TikTok, OBS-Docks, Stream Deck, Keyword-Alarmen & Moderation.
- **[English User Guide (GUIDE.md)](./GUIDE.md)** — Complete setup guide in English.
