import { describe, expect, it } from 'vitest';
import { education, experiences, links, projectFilters, projects, skillGroups } from './profile';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('profile data', () => {
  it('uses unique ids', () => {
    expect(unique(experiences.map((e) => e.id))).toBe(true);
    expect(unique(projects.map((p) => p.id))).toBe(true);
    expect(unique(education.map((e) => e.id))).toBe(true);
  });

  it('lists exactly one current position, at Éditions Ellipses', () => {
    const current = experiences.filter((e) => e.current);
    expect(current).toHaveLength(1);
    expect(current[0].company.name).toBe('Éditions Ellipses');
  });

  it('gives every company a logo source and achievements', () => {
    for (const exp of experiences) {
      expect(exp.company.logos.length, exp.company.name).toBeGreaterThan(0);
      expect(exp.achievements.length, exp.company.name).toBeGreaterThan(0);
    }
  });

  it('never offers a project filter that returns nothing', () => {
    for (const tech of projectFilters) {
      expect(
        projects.some((p) => p.stack.includes(tech)),
        tech,
      ).toBe(true);
    }
  });

  it('points demo links to https or to public/projects', () => {
    for (const p of projects.filter((x) => x.demoUrl)) {
      expect(p.demoUrl).toMatch(/^(https:\/\/|\.\/projects\/)/);
    }
    expect(links.cv).toBe('./Robin-Canovas-CV.pdf');
  });

  it('has non-empty skill groups', () => {
    for (const g of skillGroups) expect(g.skills.length, g.id).toBeGreaterThan(0);
  });
});
