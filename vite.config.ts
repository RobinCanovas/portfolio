import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';
import { buildRobots, buildSitemap, DEFAULT_SITE, transformHtml } from './scripts/seo';

// One place to change when the site moves to its own domain: SITE_URL=https://example.fr npm run build
const SITE = process.env.SITE_URL ?? DEFAULT_SITE;

const seo = (): Plugin => ({
  name: 'portfolio-seo',
  transformIndexHtml: (html) => transformHtml(html, SITE),
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(SITE) });
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(SITE) });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  // Relative base so the build works on GitHub Pages (/portfolio/) and any sub-folder.
  base: './',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
