import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Command, GraduationCap, Menu, Sparkles, Tent, X } from 'lucide-react';
import { education, experiences, projectFilters, projects, volunteering } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import type { Tech } from '../types';
import { TechIcon } from './TechIcon';
import { CompanyLogo, LogoTile } from './ui';

type MenuId = 'experience' | 'projects';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience', menu: 'experience' as const },
  { id: 'projects', label: 'Projects', menu: 'projects' as const },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
];
const SECTION_IDS = [...LINKS.map((l) => l.id), 'contact'];

export interface NavActions {
  onFilter: (tech: Tech | 'All') => void;
  onOpenExperience: (id: string) => void;
  onFocusProject: (id: string) => void;
  onContact: () => void;
  onPalette: () => void;
}

const countFor = (tech: Tech | 'All') => (tech === 'All' ? projects.length : projects.filter((p) => p.stack.includes(tech)).length);

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ------------------------------------------------------------------ */
/* Mega-menu panels                                                    */
/* ------------------------------------------------------------------ */

function ExperiencePanel({ onPick, close }: { onPick: NavActions['onOpenExperience']; close: () => void }) {
  const iut = education[0];
  return (
    <div className="grid w-[min(92vw,720px)] grid-cols-[1.4fr_1fr] gap-2 p-2">
      <div>
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Career</p>
        <ul>
          {experiences.map((exp, i) => (
            <motion.li key={exp.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.035 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onPick(exp.id);
                }}
                className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
              >
                <CompanyLogo company={exp.company} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-white">{exp.company.name}</span>
                    {exp.current && <span className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />}
                  </span>
                  <span className="block truncate text-xs text-zinc-400">
                    {exp.role} · <span className="font-mono">{exp.period}</span>
                  </span>
                </span>
                <ArrowRight className="size-4 -translate-x-1 text-zinc-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 p-2">
        <p className="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Background</p>
        <button
          type="button"
          data-menu-item
          onClick={() => {
            close();
            scrollTo('education');
          }}
          className="group flex items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/[0.06]"
        >
          <LogoTile sources={iut.logos} name={iut.school} size={40} fallback={<GraduationCap className="size-10 p-2 text-violet-300" />} />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-white">{iut.degree}</span>
            <span className="block text-xs text-zinc-400">IUT d’Orsay · {iut.period}</span>
          </span>
        </button>
        <button
          type="button"
          data-menu-item
          onClick={() => {
            close();
            scrollTo('education');
          }}
          className="group flex items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/[0.06]"
        >
          <LogoTile
            sources={volunteering.logos}
            name="EEDF"
            size={40}
            fallback={
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20">
                <Tent className="size-5 text-emerald-300" />
              </span>
            }
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-white">Scout leader · {volunteering.years}+ yrs</span>
            <span className="block text-xs text-zinc-400">EEDF — leadership & autonomy</span>
          </span>
        </button>
        <a
          href="#experience"
          data-menu-item
          onClick={close}
          className="mt-auto inline-flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
        >
          Full timeline <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ProjectsPanel({ onFilter, onFocusProject, close }: { onFilter: NavActions['onFilter']; onFocusProject: NavActions['onFocusProject']; close: () => void }) {
  const featured = projects.filter((p) => p.featured);
  return (
    <div className="grid w-[min(92vw,680px)] grid-cols-[1fr_1.1fr] gap-2 p-2">
      <div>
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Filter by tech</p>
        <ul className="grid grid-cols-2 gap-0.5">
          {(['All', ...projectFilters] as const).map((tech, i) => (
            <motion.li key={tech} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onFilter(tech);
                  scrollTo('projects');
                }}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                <TechIcon tech={tech} />
                <span className="flex-1 truncate">{tech === 'All' ? 'All projects' : tech}</span>
                <span className="font-mono text-[10px] text-zinc-500">{countFor(tech)}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10 p-2">
        <p className="flex items-center gap-1.5 px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          <Sparkles className="size-3" aria-hidden="true" /> Featured
        </p>
        <ul className="space-y-1">
          {featured.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onFocusProject(p.id);
                }}
                className="group w-full rounded-xl p-2.5 text-left transition hover:bg-white/[0.06]"
              >
                <span className="block font-mono text-[10px] text-cyan-300/80">{p.context}</span>
                <span className="mt-0.5 block text-sm font-semibold text-white group-hover:text-violet-200">{p.title}</span>
                <span className="mt-1 line-clamp-2 block text-xs text-zinc-400">{p.description}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile accordion                                                    */
/* ------------------------------------------------------------------ */

function Accordion({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="border-b border-white/5">
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center justify-between px-3 py-3 text-base font-medium text-zinc-200">
        {title}
        <ChevronDown className={`size-5 text-zinc-500 transition-transform duration-300 ${open ? 'rotate-180 text-violet-300' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

export function Navbar({ onFilter, onOpenExperience, onFocusProject, onContact, onPalette }: NavActions) {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [section, setSection] = useState<MenuId | null>('experience');
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMenu(null);
  }, []);

  // Close on outside click / Escape (returning focus to the trigger).
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      triggerRefs.current[menu]?.focus();
      close();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu, close]);

  // Hover intent: open immediately, close after a short grace period.
  const hoverOpen = (id: MenuId) => {
    window.clearTimeout(closeTimer.current);
    setMenu(id);
  };
  const hoverClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };

  const focusItem = (dir: 1 | -1) => {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]') ?? []);
    if (items.length === 0) return;
    const idx = items.indexOf(document.activeElement as HTMLElement);
    items[(idx + dir + items.length) % items.length].focus();
  };

  const onTriggerKey = (id: MenuId) => (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMenu(id);
      requestAnimationFrame(() => requestAnimationFrame(() => focusItem(1)));
    }
  };

  const onPanelKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(e.key === 'ArrowDown' ? 1 : -1);
    }
  };

  const mobilePick = (fn: () => void) => () => {
    setDrawer(false);
    fn();
  };

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menu ? 'border-b border-white/10 bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Main" className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="group flex items-center gap-2 font-mono text-sm font-semibold text-white">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold shadow-lg shadow-violet-500/30 transition group-hover:rotate-6">
            RC
          </span>
          <span className="hidden sm:inline">
            robin<span className="text-cyan-300">.dev</span>
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
          {LINKS.map((link) => {
            const isActive = active === link.id;
            const content = (
              <>
                {hovered === link.id && (
                  <motion.span layoutId="nav-hover" className="absolute inset-0 -z-10 rounded-lg bg-white/[0.07]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                {isActive && (
                  <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-[13px] h-px bg-gradient-to-r from-violet-400 to-cyan-300" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                {link.label}
              </>
            );
            const cls = `relative isolate inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive || menu === link.menu ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`;
            return (
              <li key={link.id} onMouseEnter={() => setHovered(link.id)}>
                {link.menu ? (
                  <button
                    ref={(el) => {
                      triggerRefs.current[link.menu!] = el;
                    }}
                    type="button"
                    aria-expanded={menu === link.menu}
                    aria-haspopup="true"
                    aria-controls="nav-panel"
                    onMouseEnter={() => hoverOpen(link.menu!)}
                    onMouseLeave={hoverClose}
                    // Mouse clicks keep the hover-opened menu open; keyboard activation (detail 0) toggles it.
                    onClick={(e) => setMenu((m) => (e.detail === 0 && m === link.menu ? null : link.menu!))}
                    onKeyDown={onTriggerKey(link.menu)}
                    className={cls}
                  >
                    {content}
                    <ChevronDown className={`size-3.5 transition-transform duration-300 ${menu === link.menu ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                ) : (
                  <a href={`#${link.id}`} aria-current={isActive ? 'true' : undefined} onClick={close} className={cls}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPalette}
            aria-label="Open command palette (Ctrl+K)"
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white sm:inline-flex"
          >
            <Command className="size-3.5" aria-hidden="true" />
            <kbd className="font-mono">Ctrl K</kbd>
          </button>
          <button
            type="button"
            onClick={onContact}
            className="hidden rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 hover:brightness-110 lg:inline-flex"
          >
            Let’s talk
          </button>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            aria-expanded={drawer}
            className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>

        {/* Morphing dropdown panel shared by both menus */}
        <AnimatePresence>
          {menu && (
            <motion.div
              id="nav-panel"
              ref={panelRef}
              role="region"
              aria-label={menu === 'experience' ? 'Experience menu' : 'Projects menu'}
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              onMouseLeave={hoverClose}
              onKeyDown={onPanelKey}
              initial={{ opacity: 0, y: -8, scale: 0.97, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.97, rotateX: -12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{ transformPerspective: 900, transformOrigin: 'top center' }}
              className="absolute top-full left-1/2 hidden -translate-x-1/2 pt-2 lg:block"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60 ring-1 ring-violet-500/10 backdrop-blur-2xl"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={menu} initial={{ opacity: 0, x: menu === 'projects' ? 24 : -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: menu === 'projects' ? -24 : 24 }} transition={{ duration: 0.18 }}>
                    {menu === 'experience' ? (
                      <ExperiencePanel onPick={onOpenExperience} close={close} />
                    ) : (
                      <ProjectsPanel onFilter={onFilter} onFocusProject={onFocusProject} close={close} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Scroll progress */}
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside
              aria-label="Mobile menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-white/10 bg-zinc-950/95 p-4 backdrop-blur-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500">menu</span>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="rounded-lg p-2 text-zinc-300 hover:bg-white/10">
                  <X className="size-6" />
                </button>
              </div>

              <a href="#home" onClick={() => setDrawer(false)} className="border-b border-white/5 px-3 py-3 text-base font-medium text-zinc-200">
                Home
              </a>
              <Accordion title="Experience" open={section === 'experience'} onToggle={() => setSection((s) => (s === 'experience' ? null : 'experience'))}>
                <ul className="space-y-1">
                  {experiences.map((exp) => (
                    <li key={exp.id}>
                      <button type="button" onClick={mobilePick(() => onOpenExperience(exp.id))} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/5">
                        <CompanyLogo company={exp.company} size={36} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">{exp.company.name}</span>
                          <span className="block truncate text-xs text-zinc-400">{exp.role}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Projects" open={section === 'projects'} onToggle={() => setSection((s) => (s === 'projects' ? null : 'projects'))}>
                <div className="flex flex-wrap gap-2 px-2">
                  {(['All', ...projectFilters] as const).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={mobilePick(() => {
                        onFilter(tech);
                        scrollTo('projects');
                      })}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:border-violet-400"
                    >
                      <TechIcon tech={tech} className="size-3.5" />
                      {tech}
                      <span className="text-zinc-500">{countFor(tech)}</span>
                    </button>
                  ))}
                </div>
              </Accordion>
              {LINKS.filter((l) => !l.menu && l.id !== 'home').map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={() => setDrawer(false)} className="border-b border-white/5 px-3 py-3 text-base font-medium text-zinc-200">
                  {l.label}
                </a>
              ))}

              <div className="mt-auto space-y-2 pt-6">
                <button type="button" onClick={mobilePick(onPalette)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
                  <Command className="size-4" aria-hidden="true" /> Search everything
                </button>
                <button type="button" onClick={mobilePick(onContact)} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 font-semibold text-white">
                  Let’s talk
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
