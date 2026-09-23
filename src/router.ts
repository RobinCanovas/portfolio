import { useEffect, useState } from 'react';

/**
 * Minimal hash router — works on GitHub Pages without server rewrites.
 *   #/experience/:id  → company / experience page
 *   #/projects/:id    → project page
 *   #section or ''    → home page (optionally scrolled to a section)
 */
export type Route = { name: 'home'; anchor?: string } | { name: 'experience'; id: string } | { name: 'project'; id: string } | { name: 'education'; id: string };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, '');
  const exp = clean.match(/^\/experience\/([\w-]+)$/);
  if (exp) return { name: 'experience', id: exp[1] };
  const proj = clean.match(/^\/projects\/([\w-]+)$/);
  if (proj) return { name: 'project', id: proj[1] };
  const edu = clean.match(/^\/education\/([\w-]+)$/);
  if (edu) return { name: 'education', id: edu[1] };
  return { name: 'home', anchor: clean && !clean.startsWith('/') ? clean : undefined };
}

export const href = {
  experience: (id: string) => `#/experience/${id}`,
  project: (id: string) => `#/projects/${id}`,
  education: (id: string) => `#/education/${id}`,
  section: (id: string) => `#${id}`,
};

export function navigate(to: string) {
  if (window.location.hash === to) {
    // Same hash: still honour the intent (e.g. scroll back to the section).
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = to;
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
