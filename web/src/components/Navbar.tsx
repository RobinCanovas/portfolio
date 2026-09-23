import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { projectFilters } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import type { Tech } from '../types';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;
const SECTION_IDS = NAV.map((n) => n.id);

interface Props {
  onFilter: (tech: Tech | 'All') => void;
  onContact: () => void;
}

export function Navbar({ onFilter, onContact }: Props) {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!dropdown) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !dropdownRef.current?.contains(e.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [dropdown]);

  const pickFilter = (tech: Tech | 'All') => {
    onFilter(tech);
    setDropdown(false);
    setDrawer(false);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const linkClass = (id: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      active === id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? 'glass border-x-0 border-t-0 bg-ink/70' : 'border-b border-transparent'}`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="font-mono text-sm font-semibold text-white">
          <span className="text-violet-400">~/</span>robin<span className="text-cyan-300">.dev</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) =>
            item.id === 'projects' ? (
              <li key={item.id} ref={dropdownRef} className="relative">
                <button
                  type="button"
                  aria-expanded={dropdown}
                  aria-haspopup="true"
                  onClick={() => setDropdown((d) => !d)}
                  className={`${linkClass(item.id)} inline-flex items-center gap-1`}
                >
                  {item.label}
                  <ChevronDown className={`size-4 transition ${dropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdown && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="glass absolute top-full right-0 mt-2 w-48 rounded-xl bg-zinc-950/95 p-1.5 shadow-xl"
                    >
                      {(['All', ...projectFilters] as const).map((tech) => (
                        <li key={tech}>
                          <button
                            type="button"
                            onClick={() => pickFilter(tech)}
                            className="w-full rounded-lg px-3 py-2 text-left font-mono text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                          >
                            {tech === 'All' ? 'All projects' : tech}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined} className={linkClass(item.id)}>
                  {item.label}
                </a>
              </li>
            ),
          )}
          <li className="ml-2">
            <button
              type="button"
              onClick={onContact}
              className="rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
            >
              Let’s talk
            </button>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label="Open menu"
          aria-expanded={drawer}
          className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 md:hidden"
        >
          <Menu className="size-6" />
        </button>
      </nav>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              aria-label="Mobile menu"
              className="glass fixed inset-y-0 right-0 z-50 flex w-72 flex-col gap-2 bg-zinc-950/95 p-5 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="self-end rounded-lg p-2 text-zinc-300 hover:bg-white/10"
              >
                <X className="size-6" />
              </button>
              {NAV.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setDrawer(false)} className={`${linkClass(item.id)} text-base`}>
                  {item.label}
                </a>
              ))}
              <p className="mt-4 px-3 font-mono text-xs text-zinc-500 uppercase">Filter projects</p>
              <div className="flex flex-wrap gap-2 px-3">
                {(['All', ...projectFilters] as const).map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => pickFilter(tech)}
                    className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-zinc-300 hover:border-violet-400"
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  onContact();
                }}
                className="mt-auto rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 font-semibold text-white"
              >
                Let’s talk
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
