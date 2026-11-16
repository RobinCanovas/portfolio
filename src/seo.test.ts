import { describe, expect, it } from 'vitest';
import { buildFallbackHtml, buildJsonLd, buildRobots, buildSitemap, transformHtml } from '../scripts/seo';
import { getContent } from './data/content';
import indexHtml from '../index.html?raw';

const SITE = 'https://example.org/portfolio/';

describe('SEO', () => {
  it('describes the person in valid structured data', () => {
    const data = JSON.parse(buildJsonLd(SITE));
    const person = data['@graph'].find((n: { '@type': string }) => n['@type'] === 'Person');
    expect(person.name).toBe('Robin Canovas');
    expect(person.url).toBe(SITE);
    expect(person.sameAs.every((u: string) => u.startsWith('https://'))).toBe(true);
  });

  it('puts the whole page content in plain HTML for crawlers that run no script', () => {
    const html = buildFallbackHtml();
    const c = getContent('fr');
    expect(html).toContain('<h1>');
    for (const e of c.experiences) expect(html, e.id).toContain(e.company.name.replace(/&/g, '&amp;'));
    for (const p of c.projects) expect(html, p.id).toContain(p.title.replace(/&/g, '&amp;'));
  });

  it('lists the site in the sitemap and robots.txt, on whatever URL it is given', () => {
    expect(buildSitemap(SITE)).toContain(`<loc>${SITE}</loc>`);
    expect(buildRobots('https://example.org/portfolio')).toContain('Sitemap: https://example.org/portfolio/sitemap.xml');
  });

  it('fills every placeholder of index.html', () => {
    const out = transformHtml(indexHtml, SITE);
    expect(out).not.toContain('%SITE%');
    expect(out).toContain(`<link rel="canonical" href="${SITE}" />`);
    expect(out).toContain('application/ld+json');
    expect(out).toContain('id="seo-content"');
  });

  it('keeps the meta description at a length search engines show in full', () => {
    const description = /<meta name="description" content="([^"]+)"/.exec(indexHtml)![1];
    expect(description.length).toBeLessThanOrEqual(160);
  });
});
