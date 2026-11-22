const crypto = require('crypto');

const DEFAULT_SOCIAL_SCHEDULE = {
  discord: {
    enabled: false,
    webhookUrl: '',
    scheduleWebhookUrl: '',
    mentionRole: '', // '', 'everyone', 'here', or numeric Role ID
    autoPostOnObsLive: false,
    goLiveMessage: '🔴 **{channel} ist jetzt LIVE!** Komm vorbei!',
    embedColor: '#9146ff'
  },
  bluesky: {
    enabled: false,
    handle: '',
    appPassword: '',
    autoPostOnLive: false
  },
  mastodon: {
    enabled: false,
    instanceUrl: 'https://mastodon.social',
    accessToken: '',
    autoPostOnLive: false
  },
  links: {
    twitchUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    kickUrl: '',
    discordInvite: ''
  },
  schedule: []
};

function normalizeSocialScheduleConfig(raw = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    discord: { ...DEFAULT_SOCIAL_SCHEDULE.discord, ...(src.discord || {}) },
    bluesky: { ...DEFAULT_SOCIAL_SCHEDULE.bluesky, ...(src.bluesky || {}) },
    mastodon: { ...DEFAULT_SOCIAL_SCHEDULE.mastodon, ...(src.mastodon || {}) },
    links: { ...DEFAULT_SOCIAL_SCHEDULE.links, ...(src.links || {}) },
    schedule: Array.isArray(src.schedule) ? src.schedule : []
  };
}

function buildPlatformLinks(cfg = {}) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const links = { ...ss.links };

  if (!links.twitchUrl && cfg.twitchChannel) {
    const ch = String(cfg.twitchChannel)
      .trim()
      .replace(/^https?:\/\/(www\.)?twitch\.tv\//i, '')
      .replace(/\/.*$/, '');
    if (ch) links.twitchUrl = `https://twitch.tv/${ch}`;
  }
  if (!links.youtubeUrl && cfg.youtubeChannel) {
    const yt = String(cfg.youtubeChannel).trim();
    if (/^https?:\/\//i.test(yt)) {
      links.youtubeUrl = yt;
    } else if (yt.startsWith('@')) {
      links.youtubeUrl = `https://youtube.com/${yt}`;
    } else if (yt) {
      links.youtubeUrl = `https://youtube.com/@${yt}`;
    }
  }
  if (!links.tiktokUrl && cfg.tiktokUsername) {
    const tt = String(cfg.tiktokUsername).trim().replace(/^@/, '');
    if (tt) links.tiktokUrl = `https://www.tiktok.com/@${tt}`;
  }
  return links;
}

function parseEntryDateMs(entry) {
  const d = String(entry?.date || '').trim();
  const t = String(entry?.time || '18:00').trim() || '18:00';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const [y, m, day] = d.split('-').map(Number);
  const [hh, mm] = t.split(':').map((n) => parseInt(n, 10) || 0);
  const dt = new Date(y, m - 1, day, hh, mm, 0, 0);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.getTime();
}

function getUpcomingEntries(schedule = [], limit = 10) {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const resolved = [];

  for (const item of Array.isArray(schedule) ? schedule : []) {
    if (!item || !item.title) continue;
    let startMs = parseEntryDateMs(item);
    if (!startMs) continue;

    const durMin = Math.max(15, parseInt(item.durationMin, 10) || 120);
    const endMs = startMs + durMin * 60 * 1000;

    if (item.recurringWeekly && endMs < now) {
      const weeksPassed = Math.floor((now - endMs) / weekMs) + 1;
      startMs += weeksPassed * weekMs;
    }

    // Keep streams from up to 2h ago (if currently live) or in the future
    if (startMs + durMin * 60 * 1000 < now - 30 * 60 * 1000) continue;

    const dt = new Date(startMs);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    const hh = String(dt.getHours()).padStart(2, '0');
    const min = String(dt.getMinutes()).padStart(2, '0');

    resolved.push({
      id: item.id || crypto.randomUUID(),
      title: String(item.title).trim(),
      game: String(item.game || '').trim(),
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      durationMin: durMin,
      platforms: Array.isArray(item.platforms) && item.platforms.length ? item.platforms : ['twitch'],
      notes: String(item.notes || '').trim(),
      recurringWeekly: Boolean(item.recurringWeekly),
      startMs,
      unixSec: Math.floor(startMs / 1000)
    });
  }

  resolved.sort((a, b) => a.startMs - b.startMs);
  return resolved.slice(0, limit);
}

function formatGoLiveText(cfg = {}, meta = {}) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const links = buildPlatformLinks(cfg);
  const channel = meta.channel || cfg.streamerName || cfg.twitchChannel || 'Stream';
  const title = String(meta.title || '').trim() || 'Live-Stream';
  const game = String(meta.game || '').trim();
  const customMsg = String(meta.message || ss.discord.goLiveMessage || '')
    .replace(/\{channel\}/gi, channel)
    .replace(/\{title\}/gi, title)
    .replace(/\{game\}/gi, game || 'Just Chatting')
    .replace(/\*\*/g, '')
    .trim();

  const lines = [customMsg || `🔴 ${channel} ist jetzt LIVE!`];
  lines.push(`📺 ${title}${game ? ` — 🎮 ${game}` : ''}`);

  const urlList = [];
  if (links.twitchUrl) urlList.push(`Twitch: ${links.twitchUrl}`);
  if (links.youtubeUrl) urlList.push(`YouTube: ${links.youtubeUrl}`);
  if (links.tiktokUrl) urlList.push(`TikTok: ${links.tiktokUrl}`);
  if (links.kickUrl) urlList.push(`Kick: ${links.kickUrl}`);
  if (urlList.length) lines.push(urlList.join(' | '));

  return lines.join('\n');
}

function formatScheduleText(cfg = {}, limit = 6) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const entries = getUpcomingEntries(ss.schedule, limit);
  const links = buildPlatformLinks(cfg);
  const channel = cfg.streamerName || cfg.twitchChannel || 'Stream';

  if (!entries.length) {
    return `📅 ${channel} Sendeplan: Aktuell sind noch keine festen Termine eingetragen.`;
  }

  const lines = [`📅 ${channel} — Kommende Streams:`];
  for (const e of entries) {
    const dt = new Date(e.startMs);
    const dayStr = dt.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
    const plats = e.platforms.map((p) => p.toUpperCase()).join('/');
    lines.push(`• ${dayStr} ${e.time} — ${e.title}${e.game ? ` (${e.game})` : ''} [${plats}]`);
  }
  const primaryUrl = links.twitchUrl || links.youtubeUrl || links.tiktokUrl || '';
  if (primaryUrl) lines.push(`👉 ${primaryUrl}`);
  return lines.join('\n');
}

function formatScheduleChatReply(cfg = {}) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const entries = getUpcomingEntries(ss.schedule, 3);
  if (!entries.length) {
    return '📅 Aktuell ist noch kein fester Stream-Plan eingetragen.';
  }
  const parts = entries.map((e) => {
    const dt = new Date(e.startMs);
    const dayStr = dt.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
    return `${dayStr} ${e.time}: ${e.title}${e.game ? ` (${e.game})` : ''}`;
  });
  return `📅 Nächste Streams: ${parts.join(' | ')}`;
}

function hexToIntColor(hex) {
  const cleaned = String(hex || '#9146ff').replace('#', '');
  const parsed = parseInt(cleaned, 16);
  return Number.isNaN(parsed) ? 0x9146ff : parsed;
}

function buildDiscordMention(mentionRole) {
  const r = String(mentionRole || '').trim();
  if (!r) return '';
  if (r === 'everyone') return '@everyone ';
  if (r === 'here') return '@here ';
  if (/^\d{15,22}$/.test(r)) return `<@&${r}> `;
  return '';
}

async function postDiscordWebhook(webhookUrl, payload) {
  const url = String(webhookUrl || '').trim();
  if (!/^https:\/\/(discord\.com|discordapp\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\//i.test(url)) {
    throw new Error('Ungültige Discord Webhook-URL.');
  }
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`Discord HTTP ${resp.status}: ${txt.slice(0, 180)}`);
  }
  return true;
}

async function postDiscordGoLive(cfg = {}, meta = {}) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const webhookUrl = ss.discord.webhookUrl;
  const links = buildPlatformLinks(cfg);
  const channel = meta.channel || cfg.streamerName || cfg.twitchChannel || 'Stream';
  const title = String(meta.title || '').trim() || 'Live-Stream gestartet!';
  const game = String(meta.game || '').trim() || 'Just Chatting';
  const tags = Array.isArray(meta.tags) ? meta.tags.filter(Boolean) : [];

  const mentionPrefix = buildDiscordMention(ss.discord.mentionRole);
  const msgTemplate = String(meta.message || ss.discord.goLiveMessage || '🔴 **{channel} ist jetzt LIVE!**')
    .replace(/\{channel\}/gi, channel)
    .replace(/\{title\}/gi, title)
    .replace(/\{game\}/gi, game);

  const linkLines = [];
  if (links.twitchUrl) linkLines.push(`🟣 **Twitch:** ${links.twitchUrl}`);
  if (links.youtubeUrl) linkLines.push(`🔴 **YouTube:** ${links.youtubeUrl}`);
  if (links.tiktokUrl) linkLines.push(`🎵 **TikTok:** ${links.tiktokUrl}`);
  if (links.kickUrl) linkLines.push(`🟢 **Kick:** ${links.kickUrl}`);

  const fields = [
    { name: '🎮 Kategorie / Spiel', value: game, inline: true }
  ];
  if (tags.length) {
    fields.push({ name: '🏷️ Tags', value: tags.slice(0, 8).join(', '), inline: true });
  }
  if (linkLines.length) {
    fields.push({ name: '📺 Jetzt zuschauen', value: linkLines.join('\n'), inline: false });
  }

  const primaryUrl = links.twitchUrl || links.youtubeUrl || links.tiktokUrl || undefined;

  const payload = {
    username: `${channel} • OmniStream`,
    content: `${mentionPrefix}${msgTemplate}`.trim(),
    allowed_mentions: { parse: ['everyone', 'roles'] },
    embeds: [
      {
        title: `🔴 ${title}`,
        url: primaryUrl,
        color: hexToIntColor(ss.discord.embedColor),
        fields,
        footer: { text: 'OmniStream Chat • Go-Live Benachrichtigung' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  await postDiscordWebhook(webhookUrl, payload);
  return { ok: true };
}

async function postDiscordSchedule(cfg = {}) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const webhookUrl = ss.discord.scheduleWebhookUrl || ss.discord.webhookUrl;
  const entries = getUpcomingEntries(ss.schedule, 10);
  if (!entries.length) {
    throw new Error('Keine zukünftigen Stream-Termine im Sendeplan vorhanden.');
  }

  const links = buildPlatformLinks(cfg);
  const channel = cfg.streamerName || cfg.twitchChannel || 'Stream';
  const mentionPrefix = buildDiscordMention(ss.discord.mentionRole);

  const fields = entries.map((e) => {
    const platBadges = e.platforms
      .map((p) => (p === 'twitch' ? '🟣 Twitch' : p === 'youtube' ? '🔴 YouTube' : p === 'tiktok' ? '🎵 TikTok' : p))
      .join(' • ');
    const lines = [
      `🕒 <t:${e.unixSec}:F> (<t:${e.unixSec}:R>)`,
      e.game ? `🎮 **${e.game}** • ${platBadges}` : platBadges
    ];
    if (e.notes) lines.push(`💬 ${e.notes}`);
    return {
      name: `📌 ${e.title}${e.recurringWeekly ? ' (Wöchentlich)' : ''}`,
      value: lines.join('\n'),
      inline: false
    };
  });

  const linkParts = [];
  if (links.twitchUrl) linkParts.push(`[Twitch](${links.twitchUrl})`);
  if (links.youtubeUrl) linkParts.push(`[YouTube](${links.youtubeUrl})`);
  if (links.tiktokUrl) linkParts.push(`[TikTok](${links.tiktokUrl})`);

  const payload = {
    username: `${channel} • Sendeplan`,
    content: `${mentionPrefix}📅 **Aktueller Stream-Sendeplan für ${channel}**`.trim(),
    allowed_mentions: { parse: ['everyone', 'roles'] },
    embeds: [
      {
        title: `🗓️ Kommende Streams — ${channel}`,
        description: linkParts.length ? `Schau live vorbei auf: ${linkParts.join(' • ')}` : undefined,
        color: hexToIntColor(ss.discord.embedColor),
        fields,
        footer: { text: 'Alle Zeiten werden von Discord automatisch in deine lokale Zeitzone umgerechnet.' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  await postDiscordWebhook(webhookUrl, payload);
  return { ok: true, count: entries.length };
}

function buildBlueskyFacets(text) {
  const facets = [];
  const encoder = new TextEncoder();
  const urlRegex = /https?:\/\/[^\s)]+/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const before = text.slice(0, match.index);
    const byteStart = encoder.encode(before).length;
    const byteEnd = byteStart + encoder.encode(url).length;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }]
    });
  }
  return facets;
}

async function postBluesky(cfg = {}, text = '') {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const identifier = String(ss.bluesky.handle || '').trim().replace(/^@/, '');
  const password = String(ss.bluesky.appPassword || '').trim();
  if (!identifier || !password) {
    throw new Error('Bluesky Handle oder App-Passwort fehlt.');
  }

  const sessionResp = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const sessionData = await sessionResp.json().catch(() => ({}));
  if (!sessionResp.ok || !sessionData.accessJwt) {
    throw new Error(`Bluesky Login fehlgeschlagen: ${sessionData.message || sessionResp.status}`);
  }

  const trimmedText = String(text || '').slice(0, 300);
  const facets = buildBlueskyFacets(trimmedText);
  const record = {
    $type: 'app.bsky.feed.post',
    text: trimmedText,
    createdAt: new Date().toISOString(),
    ...(facets.length ? { facets } : {})
  };

  const postResp = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.accessJwt}`
    },
    body: JSON.stringify({
      repo: sessionData.did,
      collection: 'app.bsky.feed.post',
      record
    })
  });
  const postData = await postResp.json().catch(() => ({}));
  if (!postResp.ok) {
    throw new Error(`Bluesky Post fehlgeschlagen: ${postData.message || postResp.status}`);
  }
  return { ok: true, uri: postData.uri };
}

async function postMastodon(cfg = {}, text = '') {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const instanceUrl = String(ss.mastodon.instanceUrl || '').trim().replace(/\/+$/, '');
  const token = String(ss.mastodon.accessToken || '').trim();
  if (!/^https?:\/\//i.test(instanceUrl) || !token) {
    throw new Error('Mastodon Instanz-URL oder Access-Token fehlt.');
  }

  const resp = await fetch(`${instanceUrl}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      status: String(text || '').slice(0, 500),
      visibility: 'public'
    })
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(`Mastodon Post fehlgeschlagen: ${data.error || resp.status}`);
  }
  return { ok: true, url: data.url };
}

function formatIcsUtc(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeIcsText(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function buildIcsFeed(cfg = {}) {
  const ss = normalizeSocialScheduleConfig(cfg.socialSchedule);
  const entries = getUpcomingEntries(ss.schedule, 30);
  const links = buildPlatformLinks(cfg);
  const channel = cfg.streamerName || cfg.twitchChannel || 'OmniStream';
  const primaryUrl = links.twitchUrl || links.youtubeUrl || links.tiktokUrl || '';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OmniStream Chat//Stream Schedule//DE',
    `X-WR-CALNAME:${escapeIcsText(channel)} Stream-Plan`
  ];

  for (const e of entries) {
    const startUtc = formatIcsUtc(e.startMs);
    const endUtc = formatIcsUtc(e.startMs + e.durationMin * 60 * 1000);
    const descParts = [];
    if (e.game) descParts.push(`Spiel/Kategorie: ${e.game}`);
    descParts.push(`Plattformen: ${e.platforms.join(', ')}`);
    if (e.notes) descParts.push(e.notes);
    if (primaryUrl) descParts.push(`Live unter: ${primaryUrl}`);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${e.id}@omnistream.local`);
    lines.push(`DTSTAMP:${formatIcsUtc(Date.now())}`);
    lines.push(`DTSTART:${startUtc}`);
    lines.push(`DTEND:${endUtc}`);
    lines.push(`SUMMARY:${escapeIcsText(e.title)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(descParts.join('\n'))}`);
    if (primaryUrl) lines.push(`URL:${primaryUrl}`);
    if (e.recurringWeekly) lines.push('RRULE:FREQ=WEEKLY');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

module.exports = {
  DEFAULT_SOCIAL_SCHEDULE,
  normalizeSocialScheduleConfig,
  buildPlatformLinks,
  getUpcomingEntries,
  formatGoLiveText,
  formatScheduleText,
  formatScheduleChatReply,
  postDiscordGoLive,
  postDiscordSchedule,
  postBluesky,
  postMastodon,
  buildIcsFeed
};
