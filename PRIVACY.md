# 🔒 Datenschutz-, Sicherheits- & Zero-Telemetry-Nachweis (Privacy & Trust)

**OmniGrid Studio** arbeitet nach dem **100 % Local-First / Zero-Backend-Prinzip**.
Es existiert **kein** zentraler OmniGrid-Server, **keine** Cloud-Datenbank, **kein** Account-Zwang und **keinerlei** Telemetrie- oder Tracking-Software.

---

## 1. Wo werden meine Zugangsdaten, Tokens & Stream-Keys gespeichert?

Alle Einstellungen, OAuth-Tokens, Stream-Schlüssel und API-Keys werden **ausschließlich lokal auf deiner eigenen Festplatte** in einer einzigen JSON-Datei gespeichert:

- **macOS:** `~/Library/Application Support/omnigrid-studio/config.json`
- **Windows:** `%APPDATA%\omnigrid-studio\config.json`

Du kannst diese Datei jederzeit direkt über den Button **🔒 Datenschutz → 📂 Lokale Config-Datei zeigen** in der App öffnen, einsehen oder löschen.

---

## 2. Wohin verbindet sich OmniGrid Studio? (Vollständige Endpunkt-Liste)

OmniGrid Studio baut **nur dann** eine Verbindung auf, wenn du die jeweilige Funktion selbst aktivierst — und zwar **immer direkt von deinem PC/Mac an die offizielle Schnittstelle des jeweiligen Dienstes**:

| Dienst / Funktion | Ziel-Domain | Wann wird verbunden? |
|---|---|---|
| **OBS, Overlays, RTMP-Relay & LoL Client (LCU / Live API)** | `127.0.0.1` / `localhost` | Nur lokal auf deinem eigenen Computer (verlässt deinen PC nie) |
| **Elgato Key Light** | `192.168.x.x:9123` (Lokales LAN) | Nur lokal in deinem eigenen Heimnetzwerk |
| **Twitch Chat, API & Ingest** | `irc-ws.chat.twitch.tv`, `api.twitch.tv`, `id.twitch.tv`, `*.live-video.net` | Nur wenn Twitch aktiviert ist |
| **YouTube Live & OAuth2** | `www.youtube.com`, `www.googleapis.com`, `oauth2.googleapis.com`, `a.rtmp.youtube.com` | Nur wenn YouTube aktiviert ist |
| **TikTok Live** | `www.tiktok.com` | Nur wenn TikTok aktiviert ist |
| **Emote-Anbieter** | `7tv.io`, `api.betterttv.net`, `api.frankerfacez.com` | Beim Laden der Chat-Emotes |
| **Govee Smart-Light** | `openapi.api.govee.com` | Nur wenn Govee aktiviert & dein eigener Govee API-Key hinterlegt ist |
| **Discord / Social Auto-Post** | `discord.com`, `bsky.social`, `api.x.com`, `graph.facebook.com`, `api.imgbb.com` | Nur wenn du Go-Live / Sendeplan postest |
| **Musik Album-Cover & LoL Icons/Items** | `itunes.apple.com`, `ddragon.leagueoflegends.com` | Öffentliche Cover-/Icon-Suche ohne persönliche Daten (für `!opgg`/`!ugg` wird lediglich ein Text-Link generiert, kein Hintergrund-Request) |
| **GitHub Auto-Updater & Feedback** | `api.github.com`, `github.com/Lyyrrrriccs/omni-stream-chat` | Versions-Check für Updates & Feedback-Button |

---

## 3. Wie kann jeder Nutzer das selbst überprüfen? (4 unabhängige Nachweise)

1. **Live Quellcode-Scanner direkt in der App (`🔒 Datenschutz → 🔍 Quellcode jetzt live scannen`):**
   Scannt in Echtzeit alle Dateien im `src/`-Ordner deiner laufenden App-Installation nach sämtlichen Netzwerk-URLs und zeigt jede gefundene Domain samt Datei und Zeilennummer an.
2. **Klartext-Quellcode in der heruntergeladenen App (Kein Verstecken / Keine Obfuskierung):**
   Der Code in `OmniGridStudio.app` (`Contents/Resources/app/src/`) bzw. `OmniGridStudio-win32-x64/resources/app/src/` liegt unverschlüsselt im Klartext vor und entspricht 1:1 dem GitHub-Repository.
3. **Automatischer CI-Audit & SHA-256 Checksummen bei jedem GitHub-Release:**
   Jedes Release auf GitHub wird öffentlich durch GitHub Actions (`.github/workflows/release.yml`) gebaut. Vor dem Verpacken läuft automatisch `node scripts/audit_privacy.js` (bricht den Build sofort ab, falls jemals eine unbekannte Domain im Code wäre) und erzeugt `SHA256SUMS`-Prüfsummen.
4. **10-Sekunden-Netzwerktest im eigenen Betriebssystem:**
   Während OmniGrid Studio läuft, kannst du im Terminal / in PowerShell alle offenen Netzwerk-Verbindungen der App direkt vom Betriebssystem abfragen:
   - **macOS Terminal:** `lsof -i -n -P | grep -iE "Electron|OmniGrid"`
   - **Windows PowerShell:** `Get-NetTCPConnection -OwningProcess (Get-Process OmniGridStudio -ErrorAction SilentlyContinue).Id`
