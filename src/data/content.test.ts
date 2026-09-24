import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ui } from '../i18n/ui';
import { getContent } from './content';
import { fr } from './fr';
import { experiences, projects } from './profile';

describe('French content', () => {
  it('translates every experience and project', () => {
    for (const e of experiences) expect(fr.experiences[e.id], e.id).toBeDefined();
    for (const p of projects) expect(fr.projects[p.id], p.id).toBeDefined();
  });

  it('serves the resume in the page language, and both files exist', () => {
    expect(getContent('fr').links.cv).toBe('./Robin-Canovas-CV.pdf');
    expect(getContent('en').links.cv).toBe('./Robin-Canovas-CV-EN.pdf');
    for (const lang of ['fr', 'en'] as const) {
      expect(existsSync(`public/${getContent(lang).links.cv.slice(2)}`), lang).toBe(true);
    }
  });

  it('keeps build step icons and translates their text', () => {
    const p = getContent('fr').findProject('ac-motors')!;
    expect(p.title).toBe('Base de données AC-Motors');
    expect(p.build.every((s) => s.icon)).toBe(true);
    expect(p.build).toHaveLength(projects.find((x) => x.id === 'ac-motors')!.build.length);
  });

  it('keeps English as the untouched base', () => {
    expect(getContent('en').findExperience('acelys')!.role).toBe('Development Analyst');
    expect(getContent('fr').findExperience('acelys')!.role).toBe('Analyste du développement');
    expect(getContent('fr').contract('Fixed-term')).toBe('CDD');
  });

  it('has the same interface keys in both languages', () => {
    expect(Object.keys(ui.fr).sort()).toEqual(Object.keys(ui.en).sort());
  });

  it('stays humble about scouting and lists Spanish as B1', () => {
    const en = getContent('en');
    expect(JSON.stringify(en.volunteering)).not.toMatch(/lead|14/i);
    expect(en.languages.find((l) => l.code === 'ES')?.level).toBe('B1');
  });
});
