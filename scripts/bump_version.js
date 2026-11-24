const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

/**
 * Generates a SemVer-compatible date & time version string: `YYYY.MM.DD-HHMM`
 * (e.g. `2026.11.24-2337`) in Europe/Berlin time so local builds and GitHub Actions
 * CI runners always share the exact same monotonic clock.
 */
function formatDateTimeVersion(date = new Date()) {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== 'literal') parts[p.type] = p.value;
  }
  const hh = parts.hour === '24' ? '00' : parts.hour;
  return `${parts.year}.${parts.month}.${parts.day}-${hh}${parts.minute}`;
}

function stampProjectVersion(explicitVersion = process.env.OMNIGRID_BUILD_VERSION) {
  const version = String(explicitVersion || '').trim().replace(/^v/i, '') || formatDateTimeVersion();

  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

  const lockPath = path.join(rootDir, 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    try {
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      lock.name = pkg.name;
      lock.version = version;
      if (lock.packages && lock.packages['']) {
        lock.packages[''].name = pkg.name;
        lock.packages[''].version = version;
      }
      fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
    } catch (e) {}
  }

  return version;
}

if (require.main === module) {
  const v = stampProjectVersion();
  console.log(`🕒 Version aktualisiert auf: v${v}`);
}

module.exports = {
  formatDateTimeVersion,
  stampProjectVersion
};
