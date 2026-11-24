const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'locales');
let cachedLocales = null;

function loadAllLocales() {
  if (cachedLocales) return cachedLocales;
  const map = {};
  try {
    const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const code = path.basename(file, '.json').toLowerCase();
      const raw = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'));
      map[code] = raw;
    }
  } catch (e) {}
  cachedLocales = map;
  return map;
}

function getAvailableLocales() {
  const all = loadAllLocales();
  const order = ['de', 'en'];
  return Object.keys(all)
    .sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia >= 0 && ib >= 0) return ia - ib;
      if (ia >= 0) return -1;
      if (ib >= 0) return 1;
      return a.localeCompare(b);
    })
    .map((code) => ({
      code,
      name: all[code]?.meta?.name || code.toUpperCase(),
      flag: all[code]?.meta?.flag || '🌐',
      shortLabel: all[code]?.meta?.shortLabel || code.toUpperCase()
    }));
}

function normalizeLang(code) {
  const all = loadAllLocales();
  const clean = String(code || 'de').trim().toLowerCase();
  return all[clean] ? clean : 'de';
}

function getI18nBundle(lang = 'de') {
  const all = loadAllLocales();
  const resolved = normalizeLang(lang);
  return {
    ok: true,
    lang: resolved,
    availableLocales: getAvailableLocales(),
    base: all.de || {},
    active: all[resolved] || all.de || {}
  };
}

function applyLocalizedAppMenu(Menu, lang = 'de', callbacks = {}) {
  const all = loadAllLocales();
  const resolved = normalizeLang(lang);
  const m = all[resolved]?.menu || all.de?.menu || {};
  const available = getAvailableLocales();
  const isMac = process.platform === 'darwin';

  const langSubmenu = available.map((loc) => ({
    label: `${loc.flag} ${loc.name}`,
    type: 'radio',
    checked: loc.code === resolved,
    click: () => {
      if (callbacks.onSelectLanguage) callbacks.onSelectLanguage(loc.code);
    }
  }));

  const template = [
    ...(isMac
      ? [
          {
            label: m.app || 'OmniGrid Studio',
            submenu: [
              { role: 'about', label: m.about || 'About OmniGrid Studio' },
              { type: 'separator' },
              { label: m.language || '🌐 Language', submenu: langSubmenu },
              { type: 'separator' },
              { role: 'quit', label: m.quit || 'Quit OmniGrid Studio' }
            ]
          }
        ]
      : []),
    {
      label: m.edit || 'Edit',
      submenu: [
        { role: 'undo', label: m.undo },
        { role: 'redo', label: m.redo },
        { type: 'separator' },
        { role: 'cut', label: m.cut },
        { role: 'copy', label: m.copy },
        { role: 'paste', label: m.paste },
        { role: 'selectAll', label: m.selectAll }
      ]
    },
    {
      label: m.view || 'View',
      submenu: [
        { role: 'reload', label: m.reload },
        { role: 'toggleDevTools', label: m.toggleDevTools },
        { type: 'separator' },
        { role: 'resetZoom', label: m.resetZoom },
        { role: 'zoomIn', label: m.zoomIn },
        { role: 'zoomOut', label: m.zoomOut },
        { type: 'separator' },
        { role: 'togglefullscreen', label: m.togglefullscreen },
        { type: 'separator' },
        { label: m.language || '🌐 Language', submenu: langSubmenu }
      ]
    },
    {
      label: m.window || 'Window',
      submenu: [
        { role: 'minimize', label: m.minimize },
        { role: 'close', label: m.close }
      ]
    },
    {
      label: m.help || 'Help',
      submenu: [
        {
          label: m.openGuide || '📖 Guide',
          click: () => callbacks.onOpenGuide && callbacks.onOpenGuide()
        },
        {
          label: m.openPrivacy || '🔒 Privacy Proof',
          click: () => callbacks.onMenuCommand && callbacks.onMenuCommand('open-privacy')
        },
        {
          label: m.openFeedback || '💬 Feedback',
          click: () => callbacks.onMenuCommand && callbacks.onMenuCommand('open-feedback')
        }
      ]
    }
  ];

  const built = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(built);
}

module.exports = {
  loadAllLocales,
  getAvailableLocales,
  normalizeLang,
  getI18nBundle,
  applyLocalizedAppMenu
};
