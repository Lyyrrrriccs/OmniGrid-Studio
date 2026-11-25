# 📖 OmniGrid Studio — Ausführliche Benutzeranleitung (Deutsch)

🌐 [Zurück zur Übersicht (README.de.md)](./README.de.md) | [English Guide (GUIDE.md)](./GUIDE.md)

---

## 1. Programm starten (ohne Terminal)

- **macOS:** Doppelklicke auf `dist/OmniGridStudio.app` (oder die Verknüpfung `OmniGridStudio.app`).
- **Windows:** Kopiere den Ordner `dist/OmniGridStudio-win32-x64` auf deinen Streaming-PC und doppelklicke auf `OmniGridStudio.exe`.

> **Tipp:** Alle Einstellungen, Kanäle und Fensterpositionen werden automatisch gespeichert und beim nächsten Start wiederhergestellt.

---

## 2. Plattformen verbinden

### 🟣 Twitch (+ 7TV, BTTV, FFZ)
1. Gib unter **„Dein Twitch-Kanalname“** deinen Kanalnamen (z. B. `deinkanal`) oder deine Twitch-URL ein.
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
4. **Optional — In den YouTube-Chat schreiben & Vollautomatisches Multi-Streaming (Google OAuth2):**
   - Öffne in der YouTube-Karte **„🔑 YouTube Schreiben & Auto-Livestream (OAuth2)“**.
   - Damit kannst du nicht nur direkt aus OmniGrid in den YouTube-Livechat schreiben, sondern beim **Multi-Plattform-Streaming** auch deinen **YouTube-Stream-Schlüssel automatisch abrufen** und **YouTube-Livestreams vollautomatisch starten**, ohne jemals YouTube Studio öffnen zu müssen!
   - 👉 **Die komplette Klick-für-Klick-Einrichtung (inkl. Testnutzer gegen Fehler 403 & Desktop-App Client-ID)** findest du unten in **[Kapitel 22 → Schritt-für-Schritt: Google / YouTube OAuth2 einrichten](#sec-22)** (oder per Klick auf **📖 OAuth2-Anleitung** direkt im OAuth-Bereich).

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
3. Vergib einen Namen (z. B. `OmniGrid Studio`), füge die URL ein und klicke **Anwenden**.
   *Der Chat läuft unabhängig von deiner gewählten OBS-Szene!*

### Option B — Eigenständiges Vollhöhen-Fenster links neben OBS
- Klicke oben in der Leiste auf **„🪟 Separates Chatfenster“** (oder **„📐 Links neben OBS“**).
- Das Fenster platziert sich schmal über die volle Bildschirmhöhe links neben OBS (`📌 Pin` hält es immer im Vordergrund). Position & Größe bleiben dauerhaft gespeichert.

### Option C — OBS Stream-Overlay (für Zuschauer)
- Füge in OBS eine **Browser-Quelle** mit `http://127.0.0.1:4588` hinzu.
- Klickst du im Chat auf das **📌 Pin-Symbol** einer Nachricht, wird diese sofort live im Stream-Overlay eingeblendet.

### Option D — OBS Alert-Box Overlay (Follows, Subs, Bits & Raids)
- Füge in OBS eine **Browser-Quelle** mit `http://127.0.0.1:4588/alerts` hinzu (z. B. `600 × 220`).
- In der Konfiguration unter **„🚨 OBS Alert-Box Overlay“** legst du per Checkbox fest, welche Events im Stream angezeigt werden (`Follow`, `Sub / Member`, `Resub`, `Sub-Gift`, `Bits / SuperChat`, `Raid`), plus Animation (`Pop-In`, `Slide-Up`, `Neon-Glow`), Dauer (`2s`–`12s`), Sound-Chime und **▶ Test-Alert**. Unter **„🖼️ Eigene Alert-Medien“** wählst du eigene Bilder/GIFs und Sounds direkt per **Finder / Explorer-Dialog** aus (kein Eintippen von Pfaden oder URLs nötig).

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
3. Kopiere in OmniGrid Studio unter **„🎛️ Stream Deck Integration“** die gewünschte URL (z. B. `📌 Letzte Nachricht in OBS pinnen` oder deinen eigenen Quick-Chat-Text wie `!discord`).
4. Füge die URL in der Stream Deck App ein und **aktiviere den Haken „Anfrage im Hintergrund senden“**.
5. Mit **„▶ Test“** in OmniGrid Studio kannst du jede Aktion sofort vorab prüfen.

---

## 8. Peripherie-Auswahl (Zweittastatur, Zweitmaus & Globale Hotkeys)

Unter **„⌨️ Peripherie-Auswahl (Zweitgeräte)“** kannst du eine separate USB-Tastatur, ein Numpad/Makro-Pad oder eine Zweitmaus exklusiv für OmniGrid Studio nutzen:
1. Klicke auf **„🔍 Scannen“**, um alle angeschlossenen USB-Geräte einzulesen.
2. **Zweittastatur (`🔌 Verbinden`):**
   - **Modus `Chat tippen + F1–F4 Makros`:** Tippe direkt eine Chat-Nachricht auf der Zweittastatur und sende sie mit `Enter`, ohne dein Spiel zu verlassen. `F1`–`F4` steuern Pin, Unpin, Chat leeren und Kompakt-Modus.
   - **Modus `Nur Makros`:** Tasten `1`–`4` / `F1`–`F4` lösen direkt die 4 Aktionen aus.
3. **Zweitmaus (`🖱️ Verbinden`):** Scrollrad scrollt durch den Chatfeed, Linksklick pinnt die letzte Nachricht, Rechtsklick hebt den Pin auf.
4. **🌐 Globale Hotkeys:** Falls dein Betriebssystem den direkten WebHID-Zugriff auf die primäre Tastatur blockiert, funktionieren die globalen Tastenkürzel (`Ctrl/Cmd+Alt+P/U/C/K`) systemweit auch während Vollbildspielen.

---

## 9. Spotify, Apple Music & Amazon Music Live + `!song`-Chat-Bot

Unter **„🎵 Spotify / Apple / Amazon Music & !song“** liest die App den aktuellen Song direkt aus deiner lokalen **Spotify-**, **Apple-Music-** oder **Amazon-Music-**App aus (komplett ohne API-Key! Inklusive automatischem 300×300 Album-Cover-Lookup):
- **Live-Steuerung:** **⏮ / ⏯ / ⏭** und **📢 Song in den Twitch-Chat posten**.
- **Automatischer `!song` / `!music` Bot:** Schreibt ein Zuschauer auf Twitch oder YouTube `!song` oder `!music`, antwortet OmniGrid Studio automatisch mit dem aktuellen Track *(15s Anti-Spam-Cooldown)*.
- **OBS Musik-Widget:** Füge `http://127.0.0.1:4588/spotify` als Browser-Quelle (z. B. `420 × 80`) in OBS ein, um den aktuellen Song samt Cover und dynamischem Player-Badge (`SPOTIFY`, `APPLE MUSIC` oder `AMAZON MUSIC`) transparent im Stream anzuzeigen.

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
3. **OmniGrid Studio kurz neu starten:**
   - Beende OmniGrid Studio auf dem PC/Mac und öffne es neu, damit es deine neue Tailscale-Adresse erkennt.
4. **In der App auf Tailscale umschalten:**
   - Scrolle in OmniGrid Studio links zu **„📱 Tablet & iPad Companion“**.
   - Klicke über dem Link auf das kleine Auswahlfeld und wähle **„Tailscale / VPN (100.x.x.x)“** aus.
   - Der QR-Code und der Link aktualisieren sich sofort.
5. **QR-Code scannen & loslegen:**
   - Scanne den neuen QR-Code mit deiner Handy-/Tablet-Kamera (oder tippe die `http://100....:4588/tablet`-Adresse im Browser ab).

**Falls es dann immer noch nicht lädt (Schnell-Check):**
- ✅ Achte darauf, dass im Handy-Browser **`http://`** am Anfang steht (manche Browser machen automatisch `https://` daraus — das funktioniert nicht, es muss **`http://`** sein!).
- ✅ **macOS:** Öffne *Systemeinstellungen → Datenschutz & Sicherheit → Lokales Netzwerk* und prüfe, ob **OmniGridStudio** eingeschaltet ist.
- ✅ **Windows:** Falls beim Start ein Windows-Firewall-Fenster aufgeht, klicke auf **Zugriff zulassen**.
- ✅ Prüfe in der Tailscale-App auf beiden Geräten, ob **beide** als *Connected / Verbunden* angezeigt werden.

---

## 11. Zentrale Konfigurationsseite (`⚙️ Config`)

Alle Einstellungen, die du nicht ständig während des Streams brauchst, liegen aufgeräumt im großzügigen **⚙️ Config**-Fenster (`96vw × 92vh`):
- **📡 Plattformen:** Twitch, YouTube (+ OAuth2-Login) & TikTok einrichten.
- **👤 Profil & Events:** Streamer-Name, mehrzeilige Keyword-Alarme & Event-Hervorhebungen.
- **🎨 Design & Emotes:** Schriftgrößen, Trennlinien, Deckkraft & Emote-Anbieter.
- **🎥 OBS, Licht & Alerts:** OBS-URLs, OBS WebSocket v5, **💡 Elgato Key Light**, **🌈 Govee Smart-Light & Event-Szenen**, Alert-Box (`/alerts`) & TTS.
- **🤖 Bot & Auto-Mod:** Chat-Timer, Auto-Mod-Regeln (inkl. mehrzeiliger Wort-Blacklist) & Custom Commands.
- **📱 Tablet & Stream Deck:** QR-Code (WLAN/Tailscale) & alle Stream-Deck-Endpunkte.
- **⌨️ Peripherie & System:** Zweitmaus, Zweittastatur, Hotkeys, RAM-Limit, Backup & **GitHub Auto-Updater**.

---

## 12. OBS Goal-Bar (`/goals`), Live-Poll (`/poll`) & TTS

- **OBS Goal-Bar:** Füge `http://127.0.0.1:4588/goals` als Browser-Quelle in OBS ein. Titel, Zielwert, Farbe und automatisches Hochzählen bei Follows/Subs stellst du in der Live-Sidebar ein.
- **Multistream-Poll:** Füge `http://127.0.0.1:4588/poll` in OBS ein. Zuschauer auf Twitch, YouTube und TikTok stimmen mit `!vote 1`, `!vote 2` usw. ab. Mit **👁️ Ausblenden / Einblenden** (oder `/api/streamdeck/toggle-poll`) lässt sich das Overlay jederzeit verstecken, ohne Stimmen zu verlieren.
- **Text-to-Speech (TTS):** Liest optional Events/Alerts und `!tts <Text>`-Nachrichten vor (mit Stimmenauswahl, Tempo, Lautstärke, **⏭ Skip** & **🗑 Leeren**).

---

## 13. Twitch Clip, Stream-Marker & OBS WebSocket v5

- **🎬 Twitch Clip & 🚩 Marker:** Direkt in der linken Sidebar, auf `/tablet` oder per Stream Deck (`/clip`, `/marker?description=Highlight`, `/clip-and-marker?description=Highlight`). *(Benötigt die Scopes `clips:edit` bzw. `channel:manage:broadcast` im Twitch-Token.)*
- **🎛️ OBS WebSocket v5:** Aktiviere in OBS Studio *Werkzeuge → WebSocket-Servereinstellungen* (Port `4455`), trage Host/Passwort unter **⚙️ Config → 🎥 OBS & Alerts** ein und steuere danach Szenen, **💾 Replay**, **🎙️ Mic**, **🔴 Rec** und **📡 Stream** direkt aus OmniGrid Studio, `/tablet` oder Stream Deck.

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
3. Klicke auf **Auf Twitch & YouTube anwenden** — OmniGrid Studio aktualisiert deinen Twitch-Kanal (Helix API) und deinen aktiven YouTube-Livestream (YouTube Data API v3 über OAuth2).

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

---

## 17. Discord Live-Announcer, Go-Live & Sendeplan-Studio (`📅 Schedule & Go-Live`)

Informiere deine Community vollautomatisch über Stream-Starts, Live-Status und kommende Streams:
1. **Discord Live-Announcer (`🔗 Discord & Plattformen`):**
   - Hinterlege deine Discord Webhook-URL (optional auch einen zweiten Webhook für den Sendeplan) sowie einen Rollen-Ping (`everyone`, `here` oder numerische Role-ID).
   - **Zwei Auto-Trigger (ohne Doppel-Post):** Aktiviere **🚀 Automatisch posten, wenn OBS-Stream startet** und/oder **🟣 Auch posten, wenn Twitch „live“ meldet** (ideal für Streamer ohne OBS WebSocket). Pro Stream wird garantiert **nur eine einzige Nachricht** gesendet.
   - **🔄 Live-Update alle 5 Minuten:** Aktualisiert dieselbe Discord-Nachricht automatisch (ohne erneuten Rollen-Ping!) mit aktuellem **Titel, Spiel/Kategorie, Zuschauerzahl, „Live seit“-Timer und frischem Twitch-Vorschaubild**.
   - **⚫ Sauberer Abschluss bei Stream-Ende:** Stellt das Embed nach Stream-Ende automatisch auf **„Stream beendet“** inklusive **Stream-Dauer** und **Zuschauer-Peak** um (auch manuell per Button steuerbar).
2. **X (Twitter), Bluesky, Mastodon & Instagram:**
   - **X (Twitter) API v2:** Mit deinen 4 OAuth-1.0a-Keys postet OmniGrid Studio Go-Live & Sendeplan direkt auf X — alternativ jederzeit per Browser-Share (`𝕏 Auf X (Browser)`).
   - **Bluesky & Mastodon:** Direktes Posten per App-Passwort bzw. Access-Token.
   - **Instagram:** Nutze **`📸 Instagram Grafik + Quick-Post`** (erzeugt automatisch eine `1080×1350`-PNG-Grafik für Go-Live oder Sendeplan, kopiert Caption + Hashtags und öffnet Instagram) — oder verbinde die **Instagram Graph API** (Business-Account + optionaler ImgBB API-Key für automatischen Grafik-Upload).
3. **Sendeplan & Zuschauer-Integration:**
   - **Twitch Schedule Sync:** Übertrage deine Termine per Klick direkt in deinen Twitch-Zeitplan.
   - **OBS `/schedule` & `.ics` Kalender:** Binde `http://127.0.0.1:4588/schedule` als OBS-Overlay ein oder exportiere/teile den Kalender unter `/schedule.ics`.
   - **Chat-Befehl:** Zuschauer können im Twitch/YouTube-Chat jederzeit `!schedule` oder `!plan` schreiben.

---

## 18. Live-Giveaway, Soundboard & Chat-Hype-Detektor

- **🎁 Live-Giveaway (`🎁 Giveaway`):** Definiere Titel, Keyword (z. B. `!join`) und Sub/VIP/Mod-Multiplikator (`1×`–`3×`). Starte das Giveaway, ziehe einen gewichteten Gewinner und zeige das animierte Verlosungs-Overlay in OBS unter `http://127.0.0.1:4588/giveaway`.
- **🔊 Integriertes Soundboard (`🔊 Sounds`):** Nutze die 4 Standard-Sounds oder füge eigene `.mp3`/`.wav`/`.ogg`-Dateien hinzu. Sounds können lokal abgespielt und direkt an OBS (`/alerts` und `/soundboard`) sowie über die Stream Deck API (`/api/streamdeck/sound?name=...`) getriggert werden.
- **🔥 Chat-Hype-Detektor (`🔥 Hype`):**
  - Überwacht das Chat-Tempo im eingestellten Zeitfenster: Erreicht der Chat entweder die **Min. Hype-Punkte** oder die Anzahl an **Keyword-Treffern** (Standard: `3×` Wörter wie `pog`, `clip`, `lul`, `gg` — jede Keyword-Nachricht zählt 3 Punkte), löst der Hype sofort aus.
  - **Live-Hype-Meter & Manueller Auslöser:** Im `🔥 Hype`-Fenster siehst du live den aktuellen Punktestand, erkannte Keywords und Cooldown — und kannst per **`🔥 Hype jetzt auslösen`** jederzeit selbst einen Hype triggern (im `▶ Demo`-Modus auch offline testbar!).
  - **Automatische Aktionen:** Erstellt automatisch einen **Twitch-Clip**, **postet den fertigen Clip-Link direkt in den Twitch-/YouTube-Chat** (und als Highlight-Karte in deinen Feed), setzt einen **Twitch Stream-Marker**, speichert optional den **OBS Replay-Buffer** und triggert deine **Govee Hype-Lichtszene**. *(Hinweis: Echte Twitch-Clips & Marker erlaubt die Twitch-API nur während dein Kanal tatsächlich live ist.)*

## 19. OBS Szenen- & Quellen-Editor (`🎛️ Szenen-Editor`)

- **Direkt verbinden:** Oben rechts im Editor findest du den Status und den Button **🔌 Mit OBS verbinden** — du kannst OBS also direkt im Editor verbinden oder neu verbinden.
- **⚡ App-Overlays & Komplett-Sets mit 1 Klick einfügen (ohne URL-Kopieren):**
  - Rechts oben unter **⚡ App-Overlay direkt einfügen (ohne URL)** wählst du jedes der **13 integrierten OmniGrid-Overlays** (Chat, Alerts, Musik, Game-Stats/Agenda, LoL-Build, LoL-Minimap, Just-Chatting-Bauchbinde, Viewer-Q&A, Goals, Poll, Giveaway, Sendeplan, Soundboard) direkt im Dropdown aus und klickst auf **➕ Einfügen** — Port, optimale Auflösung, Startposition und Audio-Routing werden vollautomatisch gesetzt (existiert das Overlay schon in einer anderen Szene, wird es konflikt-frei wiederverwendet).
  - Über **`⚔️ Komplettes LoL-Set`** bzw. **`💬 Just-Chatting-Set`** fügst du das gesamte abgestimmte Overlay-Paket mit einem einzigen Klick fertig positioniert in deine Szene ein!
- **⏫ Vordergrund & ⏬ Hintergrund (Ebenen-Steuerung):**
  - Verschiebe die ausgewählte Quelle über die Toolbar unter der Vorschau (**`⏫ Vordergrund`**, **`🔼 Vor`**, **`🔽 Hinter`**, **`⏬ Hintergrund`**), über die **`🔼` / `🔽` Buttons** direkt in der Quellenliste (*Tipp: `⇧ Shift` + Klick springt ganz nach vorn/hinten*) oder per **Drag & Drop (`⠿`)** mit der Maus (*oben = Vordergrund, unten = Hintergrund*).
- **✏️ Quellen direkt umbenennen:**
  - Benenne jede OBS-Quelle (sowie eingebettete Szenen) direkt im Szenen-Editor um — entweder per **Doppelklick auf den Quellennamen**, über den **`✏️`-Button** in der Quellenliste oder über **`✏️ Umbenennen`** neben der ausgewählten Quelle unter der Vorschau (`Enter` speichert, `Esc` bricht ab).
- **💧 Transparenz pro Element (`0–100 %`):**
  - Stelle die **Transparenz jedes einzelnen visuellen Szene-Elements** direkt per kompaktem Schieberegler in der **Quellenliste** oder unterhalb der Vorschau per **💧 Transparenz-Slider**, Prozent-Eingabe und Schnell-Presets (`0%`, `25%`, `50%`, `75%`) live in OBS ein (über einen dedizierten, zerstörungsfreien OBS-Farbkorrektur-Filter `OmniGrid Transparenz`, der bei `0%` automatisch wieder sauber entfernt wird).
- **Scharfe 1080p HD-Vorschau, Maus-Steuerung & Finder/Explorer-Dateiauswahl:** Ziehe Quellen direkt auf der `1920 × 1080`-Vorschau zum Verschieben oder an den Ecken zum Skalieren (**🎯 Zentrieren** / **⛶ Vollbild**). Beim Hinzufügen oder Bearbeiten von **Bild-, Video-/Medien- oder Textdatei-Quellen** öffnet sich direkt der native **Finder- / Explorer-Dateidialog** — Dateipfade müssen nirgendwo per Text eingetippt werden.

## 20. Automatische Updates (GitHub Releases)

- OmniGrid Studio prüft beim Start (und jederzeit manuell unter **⚙️ Config → ⌨️ Peripherie & System → 🔄 Nach Updates suchen**) auf neue Releases unter `github.com/Lyyrrrriccs/omni-stream-chat/releases`.
- Wird eine neue Version gefunden, lädt die App das passende Paket automatisch herunter und zeigt oben ein Update-Banner (**🚀 Jetzt installieren & neu starten**).
- Neue Releases werden über GitHub Actions (`.github/workflows/release.yml`) automatisch gebaut, sobald ein Versions-Tag (`v*`, z. B. `v1.2.0`) gepusht wird.

## 21. Smart-Light: Elgato, Philips Hue, Nanoleaf & Govee (`⚙️ Config → 🎥 OBS, Licht & Alerts`)

### 💡 Elgato Key Light & Stream-Licht (100% Lokal im WLAN)
- **WLAN-Suche (`Port 9123`):** Klicke auf **🔍 Suchen**, um alle Elgato Key Lights / Key Light Air / Ring Lights / Light Strips im lokalen Netzwerk automatisch zu finden (oder trage mehrere IPs kommagetrennt ein).
- **Live-Steuerung & OBS Auto-Sync:** Regle Helligkeit (`3–100%`) und Farbtemperatur (`2900K–7000K`) live. Mit **🟢 Automatisch einschalten wenn Stream LIVE geht (OBS)** schaltet sich deine Beleuchtung beim OBS-Stream-Start von selbst ein (und auf Wunsch bei Stream-Ende wieder aus).

### 💡 Philips Hue Bridge (100% Lokal im WLAN — komplett ohne Cloud!)
- **Lokale Suche & 1-Klick-Kopplung:** Klicke auf **🔍 Bridge suchen** (findet deine Hue Bridge per lokaler SSDP-/Subnetz-Suche ohne Internet). Drücke danach einmalig den **runden Knopf auf deiner Hue Bridge** und klicke auf **🔗 Koppeln (Bridge-Knopf)** — der lokale App-Key wird ausschließlich in deiner `config.json` gespeichert.
- **Lampen, Hue-Szenen & Events:** Wähle einzelne Hue-Lampen/Play-Bars/Strips aus, steuere Farbe & Helligkeit live und weise jedem Stream-Event (*Follow, Sub, Resub, Sub-Gift, Bits, Raid, Chat-Hype, Stream-Start/Ende*) deine **gespeicherten Hue-Szenen**, Farben oder einen kurzen **Alert-Flash** zu (mit automatischer Rückkehr nach X Sekunden).

### 🔺 Nanoleaf Shapes / Lines / Canvas (100% Lokal im WLAN — Port `16021`, ohne Cloud!)
- **Lokale Suche & Kopplung:** Klicke auf **🔍 Nanoleaf suchen** (Port `16021`). Halte danach am Nanoleaf-Controller die **Power-Taste für 5–7 Sekunden gedrückt** (bis die Status-LEDs blinken) und klicke auf **🔗 Koppeln (5–7s Power)**.
- **Gespeicherte Effekte & Events:** OmniGrid lädt automatisch alle auf deinem Nanoleaf gespeicherten **Rhythm- & Farb-Effekte** und koppelt sie frei wählbar an deine Stream-Events & OBS-Start/Ende.

### 🌈 Govee Smart-Light & Event-Szenen
- **Eigener Govee API-Key:** Aus Lizenz- & Rate-Limit-Gründen beantragt jeder Streamer kostenlos seinen eigenen API-Key (*Govee Home App → Profil → Einstellungen ⚙️ → API-Schlüssel anfordern* oder über den Button **🌐 Govee API-Key beantragen / Developer-Portal öffnen**). Die Govee-Steuerung lässt sich über den Master-Schalter jederzeit komplett an- oder abschalten.
- **Einzelne oder mehrere Lampen auswählen:** Nach Klick auf **🔄 Geräte & Szenen laden** kannst du in der Checkliste **nur eine einzelne Lampe** (**Nur 1 Lampe**) oder mehrere Lampen (**Alle**) anhaken.
- **Event-Kopplung & Einzel-Lampe pro Event:** Weise jedem Event (**🏠 Standard-Szene**, **🟢 Stream-Start**, **💙 Follow**, **💜 Sub**, **🔮 Resub**, **🎁 Sub-Gift**, **🪙 Bits/Gift**, **🚀 Raid**, **🔥 Chat-Hype**, **⏹️ Stream-Ende**) eine eigene dynamische Govee-Szene, DIY-Szene oder Farbe zu — wahlweise für alle gewählten Lampen (`🎯 Gewählte Lampe(n)`) oder gezielt für **eine einzelne Lampe (`💡 Nur: <Lampe>`)**! Nach X Sekunden schaltet das Licht automatisch wieder auf deine Standard-Szene zurück.

## 22. Lokales Multi-Plattform-Streaming Relay (`📡 Multi-Stream`)

OBS übernimmt nur noch das **einmalige Rendern & Enkodieren (`1×`)**, während OmniGrid Studio den Stream lokal mit **0 % zusätzlicher GPU-/CPU-Enkodierlast (`-c copy`)** gleichzeitig an **Twitch**, **YouTube Live**, **TikTok Live** und **Kick / Custom RTMP** verteilt:
1. **Ziele & Stream-Keys eintragen (inkl. vollautomatischem YouTube-Live-Start):** Öffne **⚙️ Config → 📡 Plattformen** (oder klicke in der Live-Sidebar bei *Multi-Plattform-Stream* auf **⚙️ Ziele**). Aktiviere die gewünschten Plattformen (Twitch, YouTube, TikTok, Kick/Custom).
   - **YouTube Live Besonderheit gelöst:** Anders als Twitch zeigt YouTube bei reinem RTMP-Push keinen öffentlichen Stream an, solange in YouTube Studio kein aktiver Broadcast mit *Auto-Start* existiert. Ist dein YouTube-Konto per **Google OAuth2** verbunden, holt OmniGrid beim Start (oder per Klick auf **⚡ Stream-Key & Live-Broadcast automatisch per YouTube-OAuth vorbereiten**) vollautomatisch deinen YouTube-RTMP-Schlüssel, legt bei Bedarf einen neuen YouTube-Livestream (`🌍 Öffentlich` / `🔗 Nicht gelistet` / `🔒 Privat`) mit **Auto-Start** an und schaltet ihn auf **🔴 LIVE**, ohne dass du YouTube Studio im Browser öffnen musst!
2. **100 % Vollautomatik ohne OBS-Einstellungen:** OmniGrid liest Port & Passwort von OBS WebSocket automatisch aus deiner lokalen OBS-Installation aus, setzt in OBS automatisch `rtmp://127.0.0.1:1935/live` (`omnigrid`) und **deaktiviert vollautomatisch den OBS-Konflikt „Erweitertes Broadcasting“ (`EnableMultitrackVideo`)**, sodass die OBS-Fehlermeldung *„Keine Konfigurations-URL für die aktuelle Plattform verfügbar“* gar nicht erst auftreten kann.
3. **1-Klick Multi-Stream Start:** Klicke in der Live-Sidebar auf **📡 Multi-Stream Start** — OmniGrid Studio verbindet sich bei Bedarf selbstständig mit OBS, konfiguriert den Stream-Dienst, startet den lokalen RTMP-Verteiler und startet automatisch den OBS-Stream mit. Bitrate (`kbps`), `FPS` und aktive Ziele siehst du live im Cockpit.

### 🔑 Schritt-für-Schritt: Google / YouTube OAuth2 für Multi-Plattform-Streaming einrichten

Warum eigene Google-OAuth2-Daten? Google verlangt für zentrale Drittanbieter-Apps mit YouTube-Steuerungsrechten (`youtube.force-ssl`) ein kostenpflichtiges Sicherheits-Audit und teilt ein einziges Tages-Limit unter allen Nutzern auf. Mit deiner eigenen kostenlosen **Desktop-App Client-ID** (dauert einmalig ca. 3 Minuten, **keine Kreditkarte nötig**) hast du volle **10.000 API-Einheiten pro Tag** exklusiv für deinen eigenen Kanal — und alle Zugangsdaten bleiben zu 100 % lokal auf deinem Rechner.

#### ✅ Vorab-Check (einmalig auf YouTube prüfen)
- Öffne einmal im Browser `https://studio.youtube.com` → klicke oben rechts auf **Erstellen → Livestream starten**.
- **Wichtig:** Wenn du auf diesem YouTube-Kanal noch **nie** gestreamt hast, verlangt YouTube einmalig eine Telefon-Bestätigung und startet einen **24-Stunden-Countdown** zur Freischaltung von Livestreams. Erst wenn dein Kanal für Livestreams freigeschaltet ist, darf die YouTube-API Streams starten.

#### Schritt 1 — Kostenloses Google-Cloud-Projekt anlegen
1. Öffne [https://console.cloud.google.com/](https://console.cloud.google.com/) (oder klicke in OmniGrid im YouTube-OAuth-Bereich auf **🌐 Google Cloud Console öffnen**) und melde dich mit deinem Google-Konto an.
2. Klicke oben links neben dem *Google Cloud*-Logo auf die **Projektauswahl** → **Neues Projekt** (*New Project*).
3. Vergib einen beliebigen Projektnamen (z. B. `OmniGrid YouTube`) und klicke auf **Erstellen** (*Create*).
4. Achte darauf, dass dieses neue Projekt oben links in der Projektauswahl aktiv ausgewählt ist.

#### Schritt 2 — „YouTube Data API v3“ aktivieren
1. Öffne im linken Seitenmenü **APIs & Dienste → Bibliothek** (*APIs & Services → Library*).
2. Tippe in das Suchfeld **`YouTube Data API v3`** ein und klicke auf den Treffer.
3. Klicke auf den blauen Button **Aktivieren** (*Enable*).

#### Schritt 3 — OAuth-Zustimmungsbildschirm & Testnutzer eintragen (WICHTIG!)
1. Öffne im linken Menü **APIs & Dienste → OAuth-Zustimmungsbildschirm** *(in der neueren Google-Ansicht heißt der Punkt **Google Auth Platform → Übersicht / Branding**)*.
2. Falls du ihn zum ersten Mal einrichtest, klicke auf **Erste Schritte** (*Get Started* / *Konfigurieren*):
   - **App-Name:** `OmniGrid Studio`
   - **Nutzer-Support-E-Mail:** wähle deine eigene Google-E-Mail-Adresse aus dem Dropdown
   - **Zielgruppe (*Audience*):** wähle **Extern** (*External*)
   - **Kontaktdaten des Entwicklers:** trage deine eigene E-Mail-Adresse ein → klicke auf **Speichern / Erstellen**.
3. **Eigenen Account als Testnutzer freischalten (verhindert Fehler 403!):**
   - Öffne links **Zielgruppe** (*Audience*) bzw. scrolle zum Abschnitt **Testnutzer** (*Test users*).
   - Lass den Veröffentlichungsstatus einfach auf **„Test“** (*Testing*) stehen — du musst die App **nicht** verifizieren oder veröffentlichen!
   - Klicke unter **Testnutzer** auf **`+ Add users` / `+ Nutzer hinzufügen`**, trage **exakt die Google-E-Mail-Adresse deines YouTube-Kanals** ein und klicke auf **Speichern**.

#### Schritt 4 — OAuth-Client-ID vom Typ „Desktop-App“ erstellen
1. Öffne links **APIs & Dienste → Anmeldedaten** (*Credentials*) — bzw. unter *Google Auth Platform* den Punkt **Clients**.
2. Klicke oben auf **`+ Anmeldedaten erstellen` → `OAuth-Client-ID`** *(bzw. `+ Client erstellen`)*.
3. Wähle bei **Anwendungstyp (*Application type*)** unbedingt **`Desktop-App`** (*Desktop app*) aus! *(Wähle **nicht** „Webanwendung“, sonst entsteht ein Redirect-Fehler.)*
4. Gib als Namen z. B. `OmniGrid Desktop` ein und klicke auf **Erstellen** (*Create*).
5. Klicke im Google-Dialog unten links einfach auf **`⬇️ Download JSON`** (speichert `client_secret_....json` in deinem `Downloads`-Ordner).

#### Schritt 5 — In OmniGrid Studio per 1-Klick JSON-Import verbinden (kein Abtippen!)
1. Öffne in OmniGrid Studio **⚙️ Config → 🌐 Plattformen** → Karte **🔴 YOUTUBE LIVE** und trage oben dein YouTube-@Handle ein (z. B. `@DeinKanal`).
2. Klappe **„🔑 YouTube Schreiben & Auto-Livestream (OAuth2)“** auf.
3. Klicke auf den grünen Button **„📂 Google ‚Download JSON‘-Datei importieren & anmelden…“** und wähle im Finder / Explorer deine heruntergeladene `client_secret_....json` aus *(oder ziehe die JSON-Datei per Drag & Drop direkt auf die YouTube-Karte)*!
   - OmniGrid liest `Client-ID` und `GOCSPX-... Client-Secret` vollautomatisch und fehlerfrei aus und öffnet sofort das Google-Login im Browser:
   - Wähle dein Google-Konto aus. **Falls sich ein zweites Auswahlfenster mit deinem persönlichen Konto und deinem YouTube-Brand-Kanal öffnet, klicke unbedingt auf deinen YouTube-Kanal!**
   - Beim Hinweis *„Google hat diese App nicht überprüft“* (normal, da es dein eigenes privates Test-Projekt ist) klicke unten links auf **„Weiter“ (*Continue*)** *(bzw. „Erweitert → Weiter zu OmniGrid Studio“)*.
   - Aktiviere die Berechtigungs-Haken (YouTube-Konto verwalten & Videos hochladen) und klicke auf **Weiter / Zulassen**.
   - Der Browser meldet **„✅ YouTube-Konto verbunden!“** und in OmniGrid steht neben OAuth2 nun dein Kanalname in Grün.

#### Schritt 6 — Multi-Plattform-Stream auf YouTube + Twitch starten
1. Scrolle im selben Reiter (**⚙️ Config → 🌐 Plattformen**) nach unten zu **📡 Multi-Plattform-Streaming Relay**.
2. Setze den Haken bei **🔴 YouTube Live Simulcast** und wähle rechts daneben die gewünschte Sichtbarkeit (**🌍 Öffentlich**, **🔗 Nicht gelistet** oder **🔒 Privat**).
3. *(Optionaler Vorab-Test)* Klicke auf **⚡ Stream-Key & Live-Broadcast automatisch per YouTube-OAuth vorbereiten** — OmniGrid lädt sofort deinen echten YouTube-Stream-Schlüssel und legt einen startbereiten Broadcast an.
4. Ab jetzt genügt vor jedem Stream ein einziger Klick in der Sidebar auf **📡 Multi-Stream Start**: OmniGrid bereitet den YouTube-Broadcast automatisch vor, startet OBS + das lokale Relay und schaltet deinen YouTube-Livestream automatisch auf **🔴 LIVE** (inkl. automatischer Live-Chat-Verbindung)!

#### 🛠️ Häufige Stolpersteine & Sofort-Hilfe
| Meldung / Symptom | Ursache & Lösung |
| :--- | :--- |
| **`Fehler 403: access_denied`** im Browser | Deine Google-E-Mail wurde in **Schritt 3.3** noch nicht unter **Zielgruppe → Testnutzer (`+ Add users`)** eingetragen. |
| **`Error 400: redirect_uri_mismatch`** | In **Schritt 4.3** wurde versehentlich *Webanwendung* statt **Desktop-App** gewählt → einfach eine neue Client-ID vom Typ **Desktop-App** anlegen. |
| **`The user is not enabled for live streaming`** | Auf diesem Kanal wurde noch nie gestreamt (24h-Freischaltung unter `studio.youtube.com` → *Livestream starten* abwarten) **oder** beim Google-Login wurde das Haupt-Gmail-Profil statt des YouTube-Brand-Kanals angeklickt (einmal auf *Abmelden* → neu anmelden → richtigen Kanal wählen). |
| **Stream bleibt ohne OAuth2 unsichtbar** | Wenn du **kein** OAuth2 nutzt und nur manuell den Stream-Key einträgst, muss in `studio.youtube.com` einmalig ein Stream mit aktiviertem Schalter **„Automatischer Start“** angelegt sein. Mit OAuth2 übernimmt OmniGrid das komplett für dich. |

## 23. Feedback, Feature-Wünsche & GitHub Discussions (`💬 Feedback`)

- Über den Button **💬 Feedback** oben in der Cockpit-Leiste können Nutzer direkt aus der App heraus Ideen, Fragen oder Bug-Reports einreichen.
- **Kategorie, Titel & Beschreibung:** App-Version (`v1.1.0`) und Betriebssystem (`macOS` / `Windows`) werden automatisch angehängt.
- **Direkt-API oder Browser:** Mit optionalem persönlichem GitHub-Token legt OmniGrid Studio die Diskussion sofort per GitHub GraphQL API (`createDiscussion`) an; ohne Token öffnet sich das fertig vorausgefüllte **GitHub Discussion**- bzw. **GitHub Issue**-Formular im Browser.

## 24. Datenschutz-, Sicherheits- & Zero-Telemetry-Nachweis (`🔒 Datenschutz`)

- **100 % Local-First / Kein OmniGrid-Server:** Alle Zugangsdaten, Tokens, Stream-Keys und API-Keys werden ausschließlich lokal in deiner `config.json` auf deiner Festplatte gespeichert und verlassen deinen Computer niemals in Richtung eines Entwickler-Servers.
- **Live Quellcode-Scanner in der App (`🔒 Datenschutz`):** Klicke oben in der Cockpit-Leiste auf **🔒 Datenschutz**, um:
  1. Deine lokale `config.json` direkt im Finder/Explorer zu öffnen.
  2. Den unverschlüsselten Klartext-Quellcode (`src/`) der laufenden App direkt einzusehen.
  3. Einen **Live-Quellcode-Scan** über alle Dateien auszuführen, der jede im Code existierende Ziel-Domain samt Datei & Zeilennummer auflistet.
  4. Den System-Befehl (`lsof` / `Get-NetTCPConnection`) zu kopieren, um direkt im Betriebssystem alle offenen Netzwerkverbindungen zu kontrollieren.

---

## 25. Game-Addons: League of Legends & Just Chatting Komplett-Suites (`🎮 Game-Addons`)

Über **🎮 Game-Addons** oben in der Cockpit-Leiste wechselst du das aktive Spiel-Addon manuell oder lässt es im Modus **`🤖 Auto`** automatisch mit deiner Twitch-/Stream-Manager-Kategorie umschalten:
- **🔒 Schreibgeschützte Vorlagen & 👁️ Overlay-Schalter:** Alle mitgelieferten Addon-Vorlagen sind schreibgeschützt (Name, Struktur & Commands können nicht überschrieben werden; die Live-Werte lassen sich per **↺ Werte zurücksetzen** jederzeit zurücksetzen). Über **👁️ OBS Game-Stats-Overlay anzeigen** (oder Stream Deck `/api/streamdeck/game-overlay?state=toggle`) blendest du alle Game-Addon-Overlays jederzeit mit einem Klick in OBS ein oder aus.

### ⚔️ League of Legends — Komplett-Suite
- **Automatisches Auslesen ohne Riot-API-Key (`127.0.0.1`):**
  1. **League Client (LCU):** Sobald dein LoL-Client geöffnet und eingeloggt ist, liest OmniGrid Studio alle ~12 Sekunden (oder sofort per **`🔄 Rank & LP aus LoL-Client lesen`**) deinen echten **Solo/Duo- bzw. Flex-Rank**, deine **exakten aktuellen LP** sowie deine **Riot-ID (`Name#TAG`) + Region** lokal aus!
  2. **Live Ingame API (`127.0.0.1:2999`):** Sobald ein Match läuft, werden **Champion + Skin-Splash, Lane/Rolle, K/D/A, CS & CS/m, Level, Gold, Keystone-Rune, Summoner Spells & alle 6 Items + Trinket** live aktualisiert. Bei eigenem Triple/Quadra/Baron wird automatisch ein Twitch-Marker gesetzt — bei einem **PENTAKILL** löst automatisch der **Hype-Clip inkl. Chat-Post** aus!
- **3 Hextech OBS-Overlays:**
  - `http://127.0.0.1:4588/game-stats` — Hextech HUD mit Champion-Icon, **Rank- & LP-Box inkl. Fortschrittsbalken rechts daneben**, K/D/A, CS/m, Session-Bilanz & letzten 6 Matches.
  - `http://127.0.0.1:4588/lol-build` — Kompakte Live Item-Build & Elo-Leiste (`550×125`).
  - `http://127.0.0.1:4588/lol-map` — Anti-Ghosting Minimap-Cover (`280×280`).
- **Chat-Commands:** `!elo`, `!lp`, `!rank`, `!opgg`, `!ugg`, `!champ`, `!skin`, `!build`, `!items`, `!runes`, `!mh`.

### 💬 Just Chatting & Talk Suite
- **3 Talk-/Podcast OBS-Overlays:**
  - `http://127.0.0.1:4588/jc-lowerthird` — Animierte TV-Bauchbinde (`920×145`) mit Gesprächsthema, Untertitel, Vibe-Badge, Live-Uhrzeit & Social-Ticker.
  - `http://127.0.0.1:4588/jc-qna` — **Viewer Q&A Spotlight** (`640×220`), das die aktuell ausgewählte Zuschauer-Frage (`@User fragt: ...`) groß im Stream einblendet (und automatisch ausblendet, wenn keine Frage aktiv ist).
  - `http://127.0.0.1:4588/game-stats` — Talk-Agenda-Karte mit erledigten (`✓`), aktivem (`▶`) und kommenden Kapiteln.
- **Chat-Commands & Live-Moderation:**
  - Zuschauer: `!ask <Frage>` / `!frage <Frage>` (reiht Fragen live in deine Q&A-Warteschlange ein), `!thema`, `!agenda`, `!video` / `!react`.
  - Streamer & Mods direkt aus dem Chat: `!setthema <Neues Thema>` (aktualisiert sofort die Bauchbinde) und `!nextq` (blendet die nächste Zuschauer-Frage im Stream ein).
- **Weitere enthaltene Game-Addons:** **🎯 Counter-Strike 2 (GSI)** (inkl. `.cfg`-Export), **🔫 Valorant / Tactical FPS**, **💀 Elden Ring / Soulsborne**, **⛏️ Minecraft** und **🏆 Universal Game Counter**.

---

## 26. Mehrsprachigkeit & JSON-Sprachdateien (`🇩🇪 DE` / `🇬🇧 EN`)

- **Direkte Sprachauswahl im Hauptfenster:** Ganz links in der oberen Button-Leiste (neben **⚙️ Config**) sowie in der Anwendungs-Menüleiste unter **🌐 Sprache / Language** kannst du jederzeit live und ohne Neustart zwischen **🇩🇪 Deutsch (`DE`)** und **🇬🇧 Englisch (`EN`)** umschalten.
- **Offene JSON-Struktur (`src/locales/`):** Alle Übersetzungen für Menüs, Buttons, Einstellungen, Modals, Platzhalter und Tooltips liegen sauber gegliedert in `src/locales/de.json` und `src/locales/en.json`. Weitere Sprachen lassen sich jederzeit durch Ablegen einer neuen `<code.json>`-Datei in `src/locales/` ergänzen und erscheinen automatisch im Auswahlmenü.





