import { useState } from 'react';
import { Brain, Code2, Search, Users } from 'lucide-react';
import type { Tech } from '../types';

const TECH_SLUGS: Partial<Record<Tech, string>> = {
  Symfony: 'symfony',
  PHP: 'php',
  React: 'react',
  TypeScript: 'typescript',
  Java: 'openjdk',
  Python: 'python',
  MySQL: 'mysql',
  'HTML/CSS': 'html5',
  Linux: 'linux',
};

const TECH_FALLBACK: Partial<Record<Tech, typeof Code2>> = {
  AI: Brain,
  SEO: Search,
  Agile: Users,
};

/** Brands whose official colour is black and would vanish on the dark theme. */
const DARK_BRANDS = new Set(['symfony']);

/**
 * Brand icon from the Simple Icons CDN: monochrome by default, brand colour when the
 * closest `.group` ancestor is hovered. Falls back to a Lucide glyph when offline.
 */
export function SimpleIcon({ slug, className = 'size-5' }: { slug?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!slug || failed) {
    return <Code2 className={`${className} text-zinc-400`} aria-hidden="true" />;
  }
  return (
    <span className={`relative inline-block shrink-0 ${className}`} aria-hidden="true">
      <img
        src={`https://cdn.simpleicons.org/${slug}/d4d4d8`}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="absolute inset-0 size-full transition-opacity duration-300 group-hover:opacity-0"
      />
      <img
        src={`https://cdn.simpleicons.org/${slug}${DARK_BRANDS.has(slug) ? '/white' : ''}`}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </span>
  );
}

export function TechIcon({ tech, className = 'size-4' }: { tech: Tech | 'All'; className?: string }) {
  if (tech === 'All') return <Code2 className={`${className} text-zinc-300`} aria-hidden="true" />;
  const Fallback = TECH_FALLBACK[tech];
  if (Fallback) return <Fallback className={`${className} text-fuchsia-300`} aria-hidden="true" />;
  return <SimpleIcon slug={TECH_SLUGS[tech]} className={className} />;
}
