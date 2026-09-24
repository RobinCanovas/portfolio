import { describe, expect, it } from 'vitest';
import { education, experiences, findExperience, findProject, links, projectFilters, projects, skillGroups } from './profile';

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

  it('gives every company a logo, an about text and missions', () => {
    for (const exp of experiences) {
      expect(exp.company.logos.length, exp.company.name).toBeGreaterThan(0);
      expect(exp.company.about.length, exp.company.name).toBeGreaterThan(20);
      expect(exp.missions.flatMap((m) => m.items).length, exp.company.name).toBeGreaterThan(0);
    }
  });

  it('shows the Domofinance mission as a confidential BNP Paribas group client, without AI', () => {
    const acelys = findExperience('acelys')!;
    expect(acelys.client?.name).toBe('Domofinance');
    expect(acelys.client?.parent?.name).toMatch(/BNP Paribas/);
    expect(acelys.confidential).toBeTruthy();
    const project = findProject('domofinance-mfa')!;
    expect(project.confidential).toBeTruthy();
    expect(project.snippet).toBeUndefined();
    expect(project.stack).not.toContain('AI');
  });

  it('links projects and experiences both ways', () => {
    for (const exp of experiences) {
      for (const id of exp.projectIds ?? []) expect(findProject(id)?.experienceId, id).toBe(exp.id);
    }
    for (const p of projects.filter((x) => x.experienceId)) expect(findExperience(p.experienceId!), p.id).toBeDefined();
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
    expect(links.cv).toBe('./Robin-Canovas-CV-EN.pdf');
  });

  it('has non-empty skill groups', () => {
    for (const g of skillGroups) expect(g.skills.length, g.id).toBeGreaterThan(0);
  });
});
