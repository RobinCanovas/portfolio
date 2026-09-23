import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router';

describe('parseHash', () => {
  it('parses detail pages', () => {
    expect(parseHash(href.experience('acelys'))).toEqual({ name: 'experience', id: 'acelys' });
    expect(parseHash(href.project('ac-motors'))).toEqual({ name: 'project', id: 'ac-motors' });
  });

  it('treats plain anchors and empty hashes as the home page', () => {
    expect(parseHash('#projects')).toEqual({ name: 'home', anchor: 'projects' });
    expect(parseHash('')).toEqual({ name: 'home', anchor: undefined });
  });

  it('falls back to home for unknown routes', () => {
    expect(parseHash('#/nope/x/y')).toEqual({ name: 'home', anchor: undefined });
  });
});
