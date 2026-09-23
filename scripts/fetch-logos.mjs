// Downloads official company logos into public/logos/ so the site no longer hotlinks them.
// Usage: npm run logos
import { mkdir, writeFile } from 'node:fs/promises';

const LOGOS = {
  'ellipses.jpg': 'https://www.editions-ellipses.fr/img/ellipses-logo-1564132122.jpg',
  'acelys.webp': 'https://www.acelys.fr/wp-content/uploads/2026/03/logo-acelys-entete-wp.webp',
  'dauphine.png': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Dauphine_logo_2019_-_Bleu.png',
  'centralesupelec.svg': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Ecole_Centrale_Supelec_logo.svg',
  'telecom-sudparis.svg': 'https://upload.wikimedia.org/wikipedia/fr/1/1d/Logo_T%C3%A9l%C3%A9com_SudParis.svg',
  'academie-occitanie.svg': 'https://francoise-combes.mon-ent-occitanie.fr/images/logos_portails/region_academique_occitanie.svg',
  'lycee-francoise-combes.webp': 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1459.jpg.webp',
  'lycee-francoise-combes-2.webp': 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1600-bleue.jpg.webp',
  'lycee-francoise-combes-3.webp': 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1446%202.jpg.webp',
  'imt-atlantique.svg': 'https://upload.wikimedia.org/wikipedia/commons/0/06/IMT_Atlantique.svg',
  'education.svg': 'https://www.education.gouv.fr/libraries/dsfr/dist/favicon/favicon.svg',
  'solstice.png': 'https://www.solutions-solstice.com/img/2018-logo-solution-solstice.png',
  'aeroboat.png': 'https://aeroboat-france.com/wp-content/uploads/2025/09/logoabf-without-bg-1.png',
  'eedf.png': 'https://icons.duckduckgo.com/ip3/eedf.fr.ico',
  'domofinance.png': 'https://www.domofinance.com/build/website/domofinance-trans.f48e1653.png',
  'boulanger.svg': 'https://cdn.simpleicons.org/boulanger',
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
