// Downloads official company logos into public/logos/ so the site no longer hotlinks them.
// Usage: npm run logos
import { mkdir, writeFile } from 'node:fs/promises';

const LOGOS = {
  'ellipses.jpg': 'https://www.editions-ellipses.fr/img/ellipses-logo-1564132122.jpg',
  'acelys.png': 'https://www.acelys.fr/wp-content/uploads/2021/12/Logo-Acelys.png',
  'education.svg': 'https://www.education.gouv.fr/libraries/dsfr/dist/favicon/favicon.svg',
  'solstice.png': 'https://www.solutions-solstice.com/img/2018-logo-solution-solstice.png',
  'aeroboat.png': 'https://aeroboat-france.com/wp-content/uploads/2025/09/logoabf-without-bg-1.png',
  'eedf.png': 'https://icons.duckduckgo.com/ip3/eedf.fr.ico',
};

const dir = new URL('../public/logos/', import.meta.url);
await mkdir(dir, { recursive: true });

let failed = 0;
for (const [file, url] of Object.entries(LOGOS)) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 portfolio-logo-fetch' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(new URL(file, dir), Buffer.from(await res.arrayBuffer()));
    console.log(`✔ ${file}`);
  } catch (err) {
    failed++;
    console.warn(`✘ ${file} — ${err.message} (the site will fall back to the remote logo or a monogram)`);
  }
}
process.exitCode = failed ? 1 : 0;
