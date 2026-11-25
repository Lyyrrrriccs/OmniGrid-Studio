const fs = require('fs');
const path = require('path');

const ALLOWED_DOMAINS = [
  { domain: '127.0.0.1', purpose: 'Lokaler PC (OBS Overlays, OBS WebSocket, lokales RTMP-Relay, LoL LCU)' },
  { domain: 'localhost', purpose: 'Lokaler PC (Loopback)' },
  { domain: '239.255.255.250', purpose: 'Lokale LAN-Multicast-Suche für Philips Hue & Nanoleaf im eigenen WLAN (kein Internet)' },
  { domain: 'twitch.tv', purpose: 'Offizielle Twitch Plattform (IRC Chat, Helix API, OAuth, Clips, GQL)' },
  { domain: 'twitchtokengenerator.com', purpose: 'Externer Info-Link zur Twitch OAuth-Token-Erstellung' },
  { domain: 'fra02.contribute.live-video.net', purpose: 'Offizieller Twitch RTMP Ingest-Server' },
  { domain: 'global-contribute.live-video.net', purpose: 'Offizieller RTMP Ingest-Server' },
  { domain: 'www.youtube.com', purpose: 'Offizieller YouTube Live-Chat & Kanal-Abruf' },
  { domain: 'youtube.com', purpose: 'Offizieller YouTube Dienst' },
  { domain: 'youtu.be', purpose: 'Offizieller YouTube Kurzlink' },
  { domain: 'accounts.google.com', purpose: 'Offizieller Google / YouTube OAuth2 Login' },
  { domain: 'console.cloud.google.com', purpose: 'Offizielle Google Cloud Console (Info-Link zur Erstellung der eigenen YouTube OAuth2 Client-ID)' },
  { domain: 'oauth2.googleapis.com', purpose: 'Offizieller Google OAuth2 Token-Endpunkt' },
  { domain: 'www.googleapis.com', purpose: 'Offizielle YouTube Data API v3 (Chat senden / Shorts Upload)' },
  { domain: 'a.rtmp.youtube.com', purpose: 'Offizieller YouTube Live RTMP Ingest-Server' },
  { domain: 'www.tiktok.com', purpose: 'Offizieller TikTok Live-Stream & Upload' },
  { domain: 'tiktok.com', purpose: 'Offizieller TikTok Dienst' },
  { domain: '7tv.io', purpose: '7TV Emote-API & CDN' },
  { domain: 'cdn.7tv.app', purpose: '7TV Emote-CDN' },
  { domain: 'api.betterttv.net', purpose: 'BetterTTV Emote-API' },
  { domain: 'cdn.betterttv.net', purpose: 'BetterTTV Emote-CDN' },
  { domain: 'api.frankerfacez.com', purpose: 'FrankerFaceZ Emote-API' },
  { domain: 'cdn.frankerfacez.com', purpose: 'FrankerFaceZ Emote-CDN' },
  { domain: 'static-cdn.jtvnw.net', purpose: 'Offizielles Twitch Emote- & Badge-CDN' },
  { domain: 'ddragon.leagueoflegends.com', purpose: 'Offizielles Riot Games DataDragon CDN (LoL Icons/Skins/Items)' },
  { domain: 'www.op.gg', purpose: 'Öffentlicher OP.GG Profil-Link für Chat-Command !opgg (kein Hintergrund-Request)' },
  { domain: 'u.gg', purpose: 'Öffentlicher U.GG Profil-Link für Chat-Command !ugg (kein Hintergrund-Request)' },
  { domain: 'itunes.apple.com', purpose: 'Offizielle Apple iTunes Search API (Album-Cover für Musik-Widget)' },
  { domain: 'openapi.api.govee.com', purpose: 'Offizielle Govee OpenAPI v1.0 (Smart-Light Szenen mit eigenem Key)' },
  { domain: 'developer.govee.com', purpose: 'Offizielles Govee Developer-Portal (Info-Link)' },
  { domain: 'discord.com', purpose: 'Offizieller Discord Webhook (vom Nutzer selbst eingetragen)' },
  { domain: 'discordapp.com', purpose: 'Offizieller Discord Webhook' },
  { domain: 'bsky.social', purpose: 'Offizielle Bluesky ATProto API (Go-Live Post)' },
  { domain: 'mastodon.social', purpose: 'Standard Mastodon-Instanz (Social Go-Live Post)' },
  { domain: 'api.twitter.com', purpose: 'Offizielle X / Twitter API v2 (Go-Live Post)' },
  { domain: 'api.x.com', purpose: 'Offizielle X API v2' },
  { domain: 'twitter.com', purpose: 'Offizieller X / Twitter Web-Intent' },
  { domain: 'x.com', purpose: 'Offizieller X Web-Intent' },
  { domain: 'www.threads.net', purpose: 'Offizieller Meta Threads Web-Intent' },
  { domain: 'www.instagram.com', purpose: 'Offizielle Instagram Webseite' },
  { domain: 'graph.facebook.com', purpose: 'Offizielle Meta Instagram Graph API' },
  { domain: 'api.imgbb.com', purpose: 'Optionaler ImgBB Bild-Host (nur mit eigenem Key für IG Graph API)' },
  { domain: 'api.github.com', purpose: 'Offizielle GitHub API (Release Auto-Updater & Feedback Discussions)' },
  { domain: 'github.com', purpose: 'Offizielles GitHub Repository (Lyyrrrriccs/OmniGrid-Studio)' },
  { domain: 'tailscale.com', purpose: 'Offizielle Tailscale Download-Seite (Info-Link)' },
  { domain: 'www.w3.org', purpose: 'Standard XML/SVG Namespace (kein Netzwerk-Aufruf)' }
];

function isAllowedHost(host) {
  const clean = String(host || '').toLowerCase().trim().replace(/:\d+$/, '');
  if (!clean) return null;
  for (const entry of ALLOWED_DOMAINS) {
    if (clean === entry.domain || clean.endsWith('.' + entry.domain)) {
      return entry;
    }
  }
  return null;
}

function collectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, out);
    else if (/\.(js|html)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function runPrivacyAudit(srcRoot = __dirname) {
  const files = collectFiles(srcRoot);
  const findings = [];
  const unknown = [];

  const urlRegex = /\b(?:https?|wss?|rtmps?):\/\/([a-zA-Z0-9.-]+(?::\d+)?)/g;
  const hostPropRegex = /\bhost\s*:\s*['"]([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})['"]/g;

  for (const file of files) {
    const relFile = path.relative(path.join(srcRoot, '..'), file);
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      const matches = [];
      let m;
      while ((m = urlRegex.exec(line)) !== null) matches.push(m[1]);
      while ((m = hostPropRegex.exec(line)) !== null) matches.push(m[1]);

      for (const rawHost of matches) {
        const cleanHost = rawHost.replace(/:\d+$/, '');
        if (/^(100|192|10)\b/.test(cleanHost) || cleanHost.includes('...')) continue;
        const allowed = isAllowedHost(cleanHost);
        const item = {
          file: relFile,
          line: idx + 1,
          host: cleanHost,
          allowed: Boolean(allowed),
          purpose: allowed ? allowed.purpose : 'UNBEKANNTE DOMAIN'
        };
        findings.push(item);
        if (!allowed) unknown.push(item);
      }
    });
  }

  return {
    ok: unknown.length === 0,
    scannedFiles: files.length,
    totalEndpoints: findings.length,
    unknownEndpoints: unknown,
    findings
  };
}

module.exports = { runPrivacyAudit, ALLOWED_DOMAINS };
