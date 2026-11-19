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
   > *Hinweis: YouTube-Chat, SuperChats, Members & Custom-Emotes funktionieren ohne API-Key. Das Senden aus Dritt-Tools ist durch YouTube auf die YouTube Data API v3 (OAuth2) beschränkt.*

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
