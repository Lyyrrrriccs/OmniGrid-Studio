# 📖 OmniStream Chat — Ausführliche Benutzeranleitung (Deutsch)

🌐 [Zurück zur Übersicht (README.de.md)](./README.de.md) | [English Guide (GUIDE.md)](./GUIDE.md)

---

## 1. Programm starten (ohne Terminal)

- **macOS:** Doppelklicke auf `dist/OmniStreamChat.app` (oder die Verknüpfung `OmniStreamChat.app`).
- **Windows:** Kopiere den Ordner `dist/OmniStreamChat-win32-x64` auf deinen Streaming-PC und doppelklicke auf `OmniStreamChat.exe`.

> **Tipp:** Alle Einstellungen, Kanäle und Fensterpositionen werden automatisch gespeichert und beim nächsten Start wiederhergestellt.

---

## 2. Plattformen verbinden

### 🟣 Twitch (+ 7TV, BTTV, FFZ)
1. Gib unter **„Dein Twitch-Kanalname“** deinen Kanalnamen (z. B. `lyrrrrics`) oder deine Twitch-URL ein.
2. **Nur Chat & Events lesen:** Klicke auf **„Verbinden“** — das funktioniert sofort ohne Token!
3. **Selbst in den Chat schreiben & moderieren:**
   - Klappe **„🔑 Chat-Antwort & Mod Token“** auf.
   - Klicke auf **„🔗 Token holen“** (öffnet `twitchtokengenerator.com`).
   - Klicke dort auf **„Bot Chat Token“** *(damit `chat:read` und `chat:edit` automatisch aktiv sind)*.
   - Kopiere den **Access token** *(erste Zeile, **nicht** dein `live_...` OBS-Stream-Key!)* in das Feld **„Chat OAuth-Token“** und klicke auf **„Verbinden“**.

### 🔴 YouTube Live
1. Gib dein **YouTube-@Handle** (z. B. `@DeinKanal`) oder eine **Kanal-/Stream-URL** ein.
2. Wähle im Dropdown **„✨ Aktiven Livestream automatisch erkennen“** (empfohlen) oder klicke auf **🔍**, um geplante/laufende Streams manuell auszuwählen.
3. Klicke auf **„Start / Standby“**. Sobald dein Stream live geht, verbindet sich der Chat automatisch.
   > *Hinweis: Zum **Lesen** von YouTube-Chat, SuperChats, Members & Custom-Emotes ist **kein API-Key** nötig.*
4. **Optional — In den YouTube-Chat schreiben (Google OAuth2):**
   - Öffne in der YouTube-Karte **„🔑 YouTube Schreiben (OAuth2)“**.
   - Aktiviere einmalig in deiner [Google Cloud Console](https://console.cloud.google.com/) die **YouTube Data API v3** und erstelle unter *Anmeldedaten* eine **OAuth-Client-ID** vom Typ **Desktop-App** *(warum individuell? Google verlangt für zentrale Apps mit `youtube.force-ssl`-Schreibrechten ein strenges App-Audit, und mit einer eigenen Client-ID nutzt jeder Streamer sein eigenes kostenloses 10.000-Units/Tag-Quota)*.
   - Trage die **Client-ID** (und optional das **Client-Secret**) ein und klicke auf **„🔐 Mit Google anmelden“**. Danach kannst du direkt aus OmniStream Chat und per `!song`-Bot in den YouTube-Livechat schreiben.

### 🎵 TikTok Live
1. Gib deinen **TikTok-@Benutzernamen** ein.
2. Optional kannst du unter **„🎯 Stream-Auswahl“** eine manuelle Room-ID eintragen (sonst automatische Erkennung).
3. Klicke auf **„Start / Standby“**. Sobald du live bist, erscheinen Chat, Sub-Emotes, Gifts 🎁, Follows ❤️ und Likes.
   > *Hinweis: TikTok erlaubt technisch kein Senden von Nachrichten über Drittanbieter-APIs (Nur-Lesen).*

---

## 3. Kompaktes Chatdesign & Darstellung anpassen

Links unter **„🎨 Kompaktes Chatdesign & Darstellung“** stellst du alles **ohne CSS-Kenntnisse** live ein:
- **Darstellungs-Modus:** *Inline / Kompakt* (Standard, maximale Textbreite) oder *Nachrichtenblasen*.
- **Schriftgrößen & Namenskürzung:** Getrennte Regler für Nutzernamen, Nachrichtentext, max. Namenslänge und Zeilenabstand.
- **Trennlinien & Hintergrund:** Farbe, Deckkraft und Abstand der Trennlinien sowie Hintergrundfarbe/-deckkraft für App und OBS-Overlay.
- **Emote-Anbieter:** Unter **„🎭 Emote-Anbieter & Animationen“** kannst du **7TV**, **BTTV**, **FFZ**, **Twitch**, **YouTube**, **TikTok** und **Animationen** einzeln an-/ausschalten.

---

## 4. OBS-Integration & Separates Chatfenster

### Option A — OBS Custom Browser Dock (im OBS-Fenster)
1. Kopiere in der App unter **„🎥 5. OBS-Integration“** den **Dock-Link** (`http://127.0.0.1:4588/dock`).
2. Öffne in OBS Studio: **Ansicht → Docks → Benutzerdefinierte Browser-Docks**.
3. Vergib einen Namen (z. B. `OmniStream Chat`), füge die URL ein und klicke **Anwenden**.
   *Der Chat läuft unabhängig von deiner gewählten OBS-Szene!*

### Option B — Eigenständiges Vollhöhen-Fenster links neben OBS
- Klicke oben in der Leiste auf **„🪟 Separates Chatfenster“** (oder **„📐 Links neben OBS“**).
- Das Fenster platziert sich schmal über die volle Bildschirmhöhe links neben OBS (`📌 Pin` hält es immer im Vordergrund). Position & Größe bleiben dauerhaft gespeichert.

### Option C — OBS Stream-Overlay (für Zuschauer)
- Füge in OBS eine **Browser-Quelle** mit `http://127.0.0.1:4588` hinzu.
- Klickst du im Chat auf das **📌 Pin-Symbol** einer Nachricht, wird diese sofort live im Stream-Overlay eingeblendet.

### Option D — OBS Alert-Box Overlay (Follows, Subs, Bits & Raids)
- Füge in OBS eine **Browser-Quelle** mit `http://127.0.0.1:4588/alerts` hinzu (z. B. `600 × 220`).
- In der Sidebar unter **„🚨 OBS Alert-Box Overlay“** legst du per Checkbox fest, welche Events im Stream angezeigt werden (`Follow`, `Sub / Member`, `Resub`, `Sub-Gift`, `Bits / SuperChat`, `Raid`), plus Animation (`Pop-In`, `Slide-Up`, `Neon-Glow`), Dauer (`2s`–`12s`), Sound-Chime und **▶ Test-Alert**.

---

## 5. Events, Keyword-Alarme & Filter

- **Event-Hervorhebung:** Unter **„🌟 6. Event-Hervorhebung“** lassen sich *Follow, Sub, Resub, Gifted Subs, Bits/Gifts, Raid* und *Hervorgehobene Nachrichten* einzeln aktivieren und farblich anpassen. Normale Nachrichten von Abonnenten werden dabei **nicht** fälschlich markiert.
- **Keyword-Alarme:** Trage unter **„👑 Mein Streamer-Profil → 🔍 Eigene Keyword-Alarme“** kommagetrennte Begriffe ein (z. B. `frage, lobby, mikrofon`). Treffer erhalten ein farbiges Badge und optional einen Sound-Ping.
- **Toolbar-Filter:** Filtere nach Plattform (`TW`, `YT`, `TT`), `@Mich`, `⭐ Events`, **Rollen** (`Mods & VIPs`, `Subs`), blende **🤖 Bots aus** oder fasse **🔁 Spam ×N** zusammen.
- **📊 Statistik & Logs:** Über den Button **„📊 Statistik & Logs“** oben links klappst du jederzeit Live-Statistiken (Nachrichten/Min, Plattform-Split, Top-Chatter, Top-Emotes) und das Verbindungs-Protokoll aus.

---

## 6. Nutzer- & Nachrichten-Schnellmenü

Ein **Links- oder Rechtsklick** auf eine beliebige Nachricht öffnet das kompakte Schnellmenü:
- **Nutzerübersicht:** Profilbild, Plattform, Rollen-Badges und Twitch-Account-Alter.
- **Schnellaktionen:** Text kopieren, Namen kopieren, Antworten (auf Twitch als Thread-Reply), In OBS pinnen, Profil im Browser öffnen.
- **Moderation:** Lokal löschen/stumm schalten (immer möglich) sowie auf Twitch mit gültigem OAuth-Token direkt löschen, Timeout (`10s`, `1m`, `10m`, `1h`), 2-Stufen-Ban und Unban. Nicht unterstützte Plattform-Aktionen werden transparent als `🔒 GESPERRT` markiert.

---

## 7. Elgato Stream Deck einrichten

1. Öffne die **Elgato Stream Deck App**.
2. Ziehe die Aktion **System → Website** auf eine freie Taste.
3. Kopiere in OmniStream Chat unter **„🎛️ Stream Deck Integration“** die gewünschte URL (z. B. `📌 Letzte Nachricht in OBS pinnen` oder deinen eigenen Quick-Chat-Text wie `!discord`).
4. Füge die URL in der Stream Deck App ein und **aktiviere den Haken „Anfrage im Hintergrund senden“**.
5. Mit **„▶ Test“** in OmniStream Chat kannst du jede Aktion sofort vorab prüfen.

---

## 8. Peripherie-Auswahl (Zweittastatur, Zweitmaus & Globale Hotkeys)

Unter **„⌨️ Peripherie-Auswahl (Zweitgeräte)“** kannst du eine separate USB-Tastatur, ein Numpad/Makro-Pad oder eine Zweitmaus exklusiv für OmniStream Chat nutzen:
1. Klicke auf **„🔍 Scannen“**, um alle angeschlossenen USB-Geräte einzulesen.
2. **Zweittastatur (`🔌 Verbinden`):**
   - **Modus `Chat tippen + F1–F4 Makros`:** Tippe direkt eine Chat-Nachricht auf der Zweittastatur und sende sie mit `Enter`, ohne dein Spiel zu verlassen. `F1`–`F4` steuern Pin, Unpin, Chat leeren und Kompakt-Modus.
   - **Modus `Nur Makros`:** Tasten `1`–`4` / `F1`–`F4` lösen direkt die 4 Aktionen aus.
3. **Zweitmaus (`🖱️ Verbinden`):** Scrollrad scrollt durch den Chatfeed, Linksklick pinnt die letzte Nachricht, Rechtsklick hebt den Pin auf.
4. **🌐 Globale Hotkeys:** Falls dein Betriebssystem den direkten WebHID-Zugriff auf die primäre Tastatur blockiert, funktionieren die globalen Tastenkürzel (`Ctrl/Cmd+Alt+P/U/C/K`) systemweit auch während Vollbildspielen.

---

## 9. Spotify Live & `!song`-Chat-Bot

Unter **„🎵 Spotify Live & !song Bot“** liest die App den aktuellen Song direkt aus deiner lokalen Spotify-Desktop-App aus (ohne API-Key!):
- **Live-Steuerung:** **⏮ / ⏯ / ⏭** und **📢 Song in den Twitch-Chat posten**.
- **Automatischer `!song` / `!music` Bot:** Schreibt ein Zuschauer auf Twitch `!song` oder `!music`, antwortet OmniStream Chat automatisch mit dem aktuellen Track *(15s Anti-Spam-Cooldown)*.
- **OBS Spotify-Widget:** Füge `http://127.0.0.1:4588/spotify` als Browser-Quelle (z. B. `420 × 80`) in OBS ein, um den aktuellen Song samt Cover transparent im Stream anzuzeigen.

---

## 10. Tablet & iPad Companion (`/tablet`)

Unter **„📱 Tablet & iPad Companion“** findest du einen QR-Code und eine lokale WLAN-URL (`http://<LAN-IP>:4588/tablet`):
- Scanne den QR-Code mit deinem **iPad**, **Android-Tablet** oder **Handy** im selben WLAN (keine App-Installation nötig).
- Du erhältst ein Touch-Dashboard mit Live-Chat, Quick-Reply-Eingabe und Stream-Deck-Tasten (Pinnen, Unpin, Demo, Spotify-Steuerung).

### 🔒 Wenn „Seite nicht erreichbar“ kommt — Die 5-Minuten-Lösung mit Tailscale (für Einsteiger)
Manche WLANs (z. B. Gäste-WLAN, Wohnheim, Hotel, Router mit „Geräte dürfen nicht miteinander kommunizieren“) blockieren die normale WLAN-Verbindung. Oder du willst dein Handy über **5G/LTE** nutzen. Dafür hilft das kostenlose Tool **Tailscale** — ganz ohne Router-Einstellungen oder Portfreigaben:

1. **Auf dem PC oder Mac installieren:**
   - Lade **Tailscale** kostenlos unter [tailscale.com/download](https://tailscale.com/download) herunter und installiere es.
   - Öffne Tailscale, melde dich einmalig an (z. B. mit Google, Apple oder GitHub) und schalte es ein (**Verbunden / Connected**).
2. **Auf dem Handy oder Tablet installieren:**
   - Lade die App **Tailscale** aus dem Apple App Store oder Google Play Store herunter.
   - Melde dich dort mit **genau demselben Konto** an und schalte den VPN-Schalter in der Tailscale-App auf **Ein / Verbunden**.
3. **OmniStream Chat kurz neu starten:**
   - Beende OmniStream Chat auf dem PC/Mac und öffne es neu, damit es deine neue Tailscale-Adresse erkennt.
4. **In der App auf Tailscale umschalten:**
   - Scrolle in OmniStream Chat links zu **„📱 Tablet & iPad Companion“**.
   - Klicke über dem Link auf das kleine Auswahlfeld und wähle **„Tailscale / VPN (100.x.x.x)“** aus.
   - Der QR-Code und der Link aktualisieren sich sofort.
5. **QR-Code scannen & loslegen:**
   - Scanne den neuen QR-Code mit deiner Handy-/Tablet-Kamera (oder tippe die `http://100....:4588/tablet`-Adresse im Browser ab).

**Falls es dann immer noch nicht lädt (Schnell-Check):**
- ✅ Achte darauf, dass im Handy-Browser **`http://`** am Anfang steht (manche Browser machen automatisch `https://` daraus — das funktioniert nicht, es muss **`http://`** sein!).
- ✅ **macOS:** Öffne *Systemeinstellungen → Datenschutz & Sicherheit → Lokales Netzwerk* und prüfe, ob **OmniStreamChat** eingeschaltet ist.
- ✅ **Windows:** Falls beim Start ein Windows-Firewall-Fenster aufgeht, klicke auf **Zugriff zulassen**.
- ✅ Prüfe in der Tailscale-App auf beiden Geräten, ob **beide** als *Connected / Verbunden* angezeigt werden.

---

## 11. Zentrale Konfigurationsseite (`⚙️ Config`)

Alle Einstellungen, die du nicht ständig während des Streams brauchst, liegen aufgeräumt unter **⚙️ Config** (oben in der Leiste oder unten links):
- **📡 Plattformen:** Twitch, YouTube (+ OAuth2-Login) & TikTok einrichten.
- **👤 Profil & Events:** Streamer-Name, Keyword-Alarme & Event-Hervorhebungen.
- **🎨 Design & Emotes:** Schriftgrößen, Trennlinien, Deckkraft & Emote-Anbieter.
- **🎥 OBS & Alerts:** OBS-URLs, OBS WebSocket v5 & Alert-Box (`/alerts` inkl. eigener GIF-/Audio-URLs).
- **🤖 Bot & Auto-Mod:** Chat-Timer & Auto-Mod-Regeln.
- **📱 Tablet & Stream Deck:** QR-Code (WLAN/Tailscale) & alle Stream-Deck-Endpunkte.
- **⌨️ Peripherie & System:** Zweitmaus, Zweittastatur, Hotkeys, RAM-Limit & Backup.

---

## 12. OBS Goal-Bar (`/goals`), Live-Poll (`/poll`) & TTS

- **OBS Goal-Bar:** Füge `http://127.0.0.1:4588/goals` als Browser-Quelle in OBS ein. Titel, Zielwert, Farbe und automatisches Hochzählen bei Follows/Subs stellst du in der Live-Sidebar ein.
- **Multistream-Poll:** Füge `http://127.0.0.1:4588/poll` in OBS ein. Zuschauer auf Twitch, YouTube und TikTok stimmen mit `!vote 1`, `!vote 2` usw. ab. Mit **👁️ Ausblenden / Einblenden** (oder `/api/streamdeck/toggle-poll`) lässt sich das Overlay jederzeit verstecken, ohne Stimmen zu verlieren.
- **Text-to-Speech (TTS):** Liest optional Events/Alerts und `!tts <Text>`-Nachrichten vor (mit Stimmenauswahl, Tempo, Lautstärke, **⏭ Skip** & **🗑 Leeren**).

---

## 13. Twitch Clip, Stream-Marker & OBS WebSocket v5

- **🎬 Twitch Clip & 🚩 Marker:** Direkt in der linken Sidebar, auf `/tablet` oder per Stream Deck (`/clip`, `/marker?description=Highlight`, `/clip-and-marker?description=Highlight`). *(Benötigt die Scopes `clips:edit` bzw. `channel:manage:broadcast` im Twitch-Token.)*
- **🎛️ OBS WebSocket v5:** Aktiviere in OBS Studio *Werkzeuge → WebSocket-Servereinstellungen* (Port `4455`), trage Host/Passwort unter **⚙️ Config → 🎥 OBS & Alerts** ein und steuere danach Szenen, **💾 Replay**, **🎙️ Mic**, **🔴 Rec** und **📡 Stream** direkt aus OmniStream Chat, `/tablet` oder Stream Deck.

---

## 14. Custom Commands, Chat-Timer & Auto-Mod (`🤖 Bot & Auto-Mod`)

- **⚡ Custom Chat-Commands:** Erstelle eigene Befehle wie `!dc`, `!specs` oder `!socials` mit festem Cooldown (in Sekunden) und Platzhaltern wie `{user}`, `{channel}` und `{uptime}`. Antworten werden automatisch in den jeweiligen Chat (Twitch & YouTube) gesendet.
- **⏱️ Chat-Timer:** Sendet alle X Minuten abwechselnd deine hinterlegten Info-Zeilen (z. B. Discord/Socials) in aktive Schreib-Chats.
- **🛡️ Auto-Mod-Regeln:** Blockiert Links, Caps-Spam (`≥75%`), Symbol-Spam und eigene Blacklist-Wörter automatisch (auf Twitch optional inkl. `/delete` oder `/timeout`). Mods, VIPs & Streamer bleiben auf Wunsch ausgenommen.
- **🔍 Chat-Suche & Export (`⌘/Ctrl+F` / `💾 Export`):** Durchsuche den laufenden Chat live nach Text, Plattform oder Autor und exportiere den Chat-Verlauf jederzeit als `.txt` oder `.json`.

---

## 15. Stream-Manager (`🎛️ Stream-Manager`)

Aktualisiere Titel, Spiel/Kategorie und Tags für **Twitch** und **YouTube** gleichzeitig direkt aus der Sidebar:
1. Klicke in der Sidebar auf **🎛️ Stream-Manager** (oder im Cockpit-Menü).
2. Gib den neuen **Stream-Titel**, das **Spiel / die Kategorie** (mit Live-Suche über Twitch) sowie bis zu 10 **Tags** ein.
3. Klicke auf **Auf Twitch & YouTube anwenden** — OmniStream Chat aktualisiert deinen Twitch-Kanal (Helix API) und deinen aktiven YouTube-Livestream (YouTube Data API v3 über OAuth2).

---

## 16. Clip- & Replay-Studio (`🎬 Clips` — 9:16 Shorts, Schneiden & Upload)

Verwandle deine **OBS Replay-Buffer**-Aufnahmen oder Stream-Videos ohne externes Schnittprogramm in fertige **16:9-Clips** oder **9:16-Shorts / TikToks / Reels**:
1. **Ordner & FFmpeg:** Wähle im Clip-Studio deinen **OBS-Aufnahme- / Replay-Ordner** (und falls nötig den FFmpeg-Pfad; auf macOS/Homebrew wird `ffmpeg` meist automatisch erkannt).
2. **Video-Auswahl & Verwaltung:** Alle Videos (`.mp4`, `.mkv`, `.mov`, `.webm`) erscheinen in der Liste. Über die kleinen Buttons kannst du Clips **umbenennen (`✏️`)** oder in den Papierkorb **löschen (`🗑️`)**.
3. **Visueller Dual-Range-Scrubber (Start & Ende):** Direkt unter dem Videoplayer befinden sich zwei verknüpfte Schieberegler für **Start (`In`)** und **Ende (`Out`)** mit Live-Vorschau, exakter Zeitdauer-Anzeige und Play-Loop-Prüfung.
4. **Export-Modi:**
   - **✂️ 16:9 Trim:** Schneidet den gewählten Bereich verlustfrei/schnell im Querformat zu.
   - **📱 9:16 Short (Blur / Crop):** Erstellt ein vertikales `1080×1920`-Video für YouTube Shorts, TikTok & Reels — wahlweise mit weichgezeichnetem Hintergrund (**Blur-BG**) oder zentriertem Ausschnitt (**Center-Crop**).
5. **Direkter Upload (`▶️ YT` / `🎵 TT`):**
   - **YouTube Shorts / Video:** Mit einem Klick auf **`▶️ YT`** direkt neben dem Clip öffnet sich der Upload-Dialog (Titel, Beschreibung, Sichtbarkeit `Public`/`Unlisted`/`Private`) und lädt das Video per **Google OAuth2** direkt hoch.
   - **TikTok Quick-Upload:** Mit **`🎵 TT`** öffnest du das TikTok-Upload-Center direkt im Browser und markierst/öffnest die Datei im Finder/Explorer zum sofortigen Drag-&-Drop.

