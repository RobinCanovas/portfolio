import { getContent } from '../src/data/content';

/**
 * Everything a crawler should find without running any JavaScript: the head metadata,
 * structured data, a plain-HTML copy of the page's content and the sitemap.
 * It is built from the same data as the site, so it can never drift from it.
 * The build injects it (see vite.config.ts); React replaces the plain copy when it mounts.
 */
export const DEFAULT_SITE = 'https://robincanovas.github.io/portfolio/';
export const GITHUB = 'https://github.com/RobinCanovas';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const withSlash = (site: string) => (site.endsWith('/') ? site : `${site}/`);

export function buildJsonLd(site: string): string {
  const c = getContent('fr');
  const url = withSlash(site);
  const person = {
    '@type': 'Person',
    '@id': `${url}#robin-canovas`,
    name: c.profile.name,
    url,
    image: `${url}robin-canovas.jpg`,
    jobTitle: 'Développeur web en alternance, étudiant en BUT Informatique',
    description: c.profile.pitch,
    worksFor: { '@type': 'Organization', name: 'Éditions Ellipses', url: 'https://www.editions-ellipses.fr' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'IUT d’Orsay, Université Paris-Saclay' },
    homeLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' } },
    knowsAbout: ['Data science', 'Intelligence artificielle', 'Finance', 'Mathématiques', 'Développement web', 'Bases de données', 'Cybersécurité', 'Symfony', 'Python'],
    knowsLanguage: ['fr', 'en', 'es'],
    sameAs: [c.links.linkedin, GITHUB],
  };
  const website = { '@type': 'WebSite', '@id': `${url}#website`, url, name: `${c.profile.name}, portfolio`, inLanguage: ['fr', 'en'], author: { '@id': person['@id'] } };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, website] });
}

/** A plain, semantic copy of the page. Visually hidden: visitors get the real app, crawlers that do not run scripts get the text. */
export function buildFallbackHtml(): string {
  const c = getContent('fr');
  const li = (s: string) => `<li>${s}</li>`;
  const experiences = c.experiences.map((e) => li(`<strong>${esc(e.role)}</strong>, ${esc(e.company.name)} (${esc(e.period)}, ${esc(e.location)}). ${esc(e.summary)}`)).join('');
  const projects = c.projects.map((p) => li(`<strong>${esc(p.title)}</strong>. ${esc(p.description)}`)).join('');
  const education = c.education.map((e) => li(`<strong>${esc(e.degree)}</strong>, ${esc(e.school)} (${esc(e.period)}). ${e.details.map(esc).join(' ')}`)).join('');
  const skills = c.skillGroups.map((g) => li(`<strong>${esc(g.title)}</strong> : ${g.skills.map((s) => esc(s.name)).join(', ')}`)).join('');
  return [
    '<div id="seo-content" style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">',
    `<h1>${esc(c.profile.name)}, ${esc(c.profile.title)}</h1>`,
    `<p>${esc(c.profile.pitch)}</p>`,
    `<p>${esc(c.profile.ambition)}</p>`,
    `<h2>Expériences</h2><ul>${experiences}</ul>`,
    `<h2>Projets</h2><ul>${projects}</ul>`,
    `<h2>Formation</h2><ul>${education}</ul>`,
    `<h2>Compétences</h2><ul>${skills}</ul>`,
    `<h2>Contact</h2><p><a href="${esc(c.links.linkedin)}">LinkedIn</a> · <a href="${GITHUB}">GitHub</a></p>`,
    '</div>',
  ].join('');
}

export function buildSitemap(site: string, date = new Date()): string {
  const url = withSlash(site);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${date.toISOString().slice(0, 10)}</lastmod>\n  </url>\n</urlset>\n`;
}

export const buildRobots = (site: string) => `User-agent: *\nAllow: /\n\nSitemap: ${withSlash(site)}sitemap.xml\n`;

/** Replaces the %SITE% placeholder and fills the head and the root element of index.html. */
export function transformHtml(html: string, site: string): string {
  const url = withSlash(site);
  return html
    .replaceAll('%SITE%', url)
    .replace('</head>', `    <script type="application/ld+json">${buildJsonLd(url).replace(/</g, '\\u003c')}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${buildFallbackHtml()}</div>`);
}
