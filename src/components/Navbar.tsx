import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, ChevronDown, Command, GraduationCap, Landmark, Menu, Tent, Trophy, X } from 'lucide-react';
import { targetSchools } from '../data/profile';
import type { Content } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';
import { useContent, useLang } from '../i18n';
import type { UiKey } from '../i18n/ui';
import { href, navigate } from '../router';
import type { Tech } from '../types';
import { Logo } from './Logo';
import { TechIcon } from './TechIcon';
import { CompanyLogo, LogoTile } from './ui';

type MenuId = 'experience' | 'projects' | 'goals';

const LINKS: { id: string; label: UiKey; menu?: MenuId }[] = [
  { id: 'experience', label: 'nav.experience', menu: 'experience' },
  { id: 'projects', label: 'nav.projects', menu: 'projects' },
  { id: 'skills', label: 'nav.skills' },
  { id: 'education', label: 'nav.education' },
  { id: 'goals', label: 'nav.goals', menu: 'goals' },
];
const SECTION_IDS = ['home', ...LINKS.map((l) => l.id), 'contact'];

export interface NavActions {
  onFilter: (tech: Tech | 'All') => void;
  onOpenExperience: (id: string) => void;
  onFocusProject: (id: string) => void;
  onContact: () => void;
  onPalette: () => void;
  /** False on detail pages: no home section is highlighted there. */
  onHome?: boolean;
}

const countFor = (c: Content, tech: Tech | 'All') => (tech === 'All' ? c.projects.length : c.projects.filter((p) => p.stack.includes(tech)).length);

/** FR / EN switch — English is the default language. */
function LangToggle({ className = '' }: { className?: string }) {
  const { lang, toggle, t } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('lang.switch')}
      title={t('lang.switch')}
      className={`relative isolate inline-flex items-center rounded-full border border-ink/15 p-0.5 font-mono text-[11px] font-medium ${className}`}
    >
      {(['en', 'fr'] as const).map((l) => (
        <span key={l} className={`relative rounded-full px-2 py-1 uppercase transition-colors duration-200 ${lang === l ? 'text-paper' : 'text-ink-3 hover:text-ink'}`}>
          {lang === l && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />}
          {l}
        </span>
      ))}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Mega-menu panels                                                    */
/* ------------------------------------------------------------------ */

function ExperiencePanel({ onPick, close }: { onPick: NavActions['onOpenExperience']; close: () => void }) {
  const { t } = useLang();
  const { education, experiences, volunteering } = useContent();
  const iut = education[0];
  return (
    <div className="grid w-[min(92vw,720px)] grid-cols-[1.4fr_1fr] gap-2 p-2">
      <div>
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('nav.career')}</p>
        <ul>
          {experiences.filter((e) => !e.minor).map((exp, i) => (
            <motion.li key={exp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03, duration: 0.2 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onPick(exp.id);
                }}
                className="group flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04]"
              >
                <CompanyLogo company={exp.company} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink">{exp.company.name}</span>
                    {exp.current && <span className="size-1.5 shrink-0 rounded-full bg-good" />}
                  </span>
                  <span className="block truncate text-xs text-ink-3">
                    {exp.role} · <span className="font-mono">{exp.period}</span>
                  </span>
                </span>
                <ArrowRight className="size-4 -translate-x-1 text-accent opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-paper p-2">
        <p className="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('nav.background')}</p>
        <button
          type="button"
          data-menu-item
          onClick={() => {
            close();
            navigate(href.education('iut'));
          }}
          className="group flex items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-ink/[0.04]"
        >
          <LogoTile sources={iut.logos} name={iut.school} size={40} fallback={<GraduationCap className="size-10 p-2 text-accent" />} />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">{iut.degree}</span>
            <span className="block text-xs text-ink-3">IUT d’Orsay · {iut.period}</span>
          </span>
        </button>
        <button
          type="button"
          data-menu-item
          onClick={() => {
            close();
            navigate(href.education('eedf'));
          }}
          className="group flex items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-ink/[0.04]"
        >
          <LogoTile
            sources={volunteering.logos}
            name="EEDF"
            size={40}
            fallback={
              <span className="flex size-10 items-center justify-center rounded-lg bg-good/10">
                <Tent className="size-5 text-good" />
              </span>
            }
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">{t('nav.scout')}</span>
            <span className="block text-xs text-ink-3">{t('nav.scoutSub')}</span>
          </span>
        </button>
        <a
          href="#experience"
          data-menu-item
          onClick={close}
          className="group mt-auto inline-flex items-center justify-between rounded-lg border-t border-ink/10 px-3 py-2.5 text-xs font-medium text-ink transition-colors hover:text-accent"
        >
          {t('nav.timeline')} <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ProjectsPanel({ onFilter, onFocusProject, close }: { onFilter: NavActions['onFilter']; onFocusProject: NavActions['onFocusProject']; close: () => void }) {
  const { t } = useLang();
  const c = useContent();
  const featured = c.projects.filter((p) => p.featured);
  return (
    <div className="grid w-[min(92vw,680px)] grid-cols-[1fr_1.1fr] gap-2 p-2">
      <div>
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('nav.filter')}</p>
        <ul className="grid grid-cols-2 gap-0.5">
          {(['All', ...c.projectFilters] as const).map((tech, i) => (
            <motion.li key={tech} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015, duration: 0.2 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onFilter(tech);
                }}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-2 transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <TechIcon tech={tech} />
                <span className="flex-1 truncate">{tech === 'All' ? t('nav.allProjects') : c.tech(tech)}</span>
                <span className="font-mono text-[10px] text-ink-3">{countFor(c, tech)}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg bg-paper p-2">
        <p className="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('nav.featured')}</p>
        <ul className="space-y-1">
          {featured.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 + i * 0.03, duration: 0.2 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onFocusProject(p.id);
                }}
                className="group w-full rounded-lg p-2.5 text-left transition-colors hover:bg-ink/[0.04]"
              >
                <span className="block truncate font-mono text-[10px] text-ink-3">{p.context}</span>
                <span className="mt-0.5 block font-serif text-lg leading-snug text-ink transition-colors group-hover:text-accent">{p.title}</span>
                <span className="mt-1 line-clamp-2 block text-xs text-ink-3">{p.description}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const ROADMAP = [
  { n: 1, icon: Briefcase, tone: 'text-good border-good/40' },
  { n: 2, icon: Building2, tone: 'text-ink-2 border-ink/20' },
  { n: 3, icon: Landmark, tone: 'text-ink-2 border-ink/20' },
  { n: 4, icon: Trophy, tone: 'text-accent border-accent/40' },
] as const;

function SchoolTile({ sources, name }: { sources: string[]; name: string }) {
  const [i, setI] = useState(0);
  return (
    <span className="flex h-12 items-center justify-center rounded-lg bg-white p-2 ring-1 ring-ink/10">
      {i < sources.length ? (
        <img src={sources[i]} alt={name} onError={() => setI((n) => n + 1)} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="text-[10px] font-semibold text-ink">{name}</span>
      )}
    </span>
  );
}

function GoalsPanel({ close }: { close: () => void }) {
  const { t } = useLang();
  const go = () => {
    close();
    navigate(href.section('goals'));
  };
  return (
    <div className="grid w-[min(92vw,700px)] grid-cols-[1.1fr_1fr] gap-2 p-2">
      <div>
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('nav.roadmap')}</p>
        <ol className="relative">
          <span aria-hidden="true" className="absolute top-6 bottom-6 left-[27px] w-px bg-ink/15" />
          {ROADMAP.map((r, i) => (
            <motion.li key={r.n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04, duration: 0.2 }}>
              <button type="button" data-menu-item onClick={go} className="group relative flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-ink/[0.04]">
                <span className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card ${r.tone}`}>
                  <r.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t(`goals.s${r.n}.tag` as const)}</span>
                  <span className="block truncate text-sm font-semibold text-ink">{t(`goals.s${r.n}.title` as const)}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-paper p-2">
        <p className="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('nav.schools')}</p>
        <div className="grid grid-cols-3 gap-2 px-1">
          {targetSchools.map((sc, i) => (
            <motion.button
              key={sc.id}
              type="button"
              data-menu-item
              onClick={go}
              title={sc.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 + i * 0.03, duration: 0.2 }}
              className="rounded-lg transition-opacity hover:opacity-80"
            >
              <SchoolTile sources={sc.logos} name={sc.name} />
            </motion.button>
          ))}
        </div>
        <button type="button" data-menu-item onClick={go} className="mt-auto inline-flex items-center justify-between rounded-lg border-t border-ink/10 px-3 py-2.5 text-xs font-medium text-ink transition-colors hover:text-accent">
          {t('nav.seeGoals')} <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile accordion                                                    */
/* ------------------------------------------------------------------ */

function Accordion({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="border-b border-ink/10">
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center justify-between px-3 py-3 font-serif text-2xl text-ink">
        {title}
        <ChevronDown className={`size-5 text-ink-3 transition-transform duration-300 ${open ? 'rotate-180 text-ink' : ''}`} aria-hidden="true" />
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

export function Navbar({ onFilter, onOpenExperience, onFocusProject, onContact, onPalette, onHome = true }: NavActions) {
  const { t } = useLang();
  const c = useContent();
  const sectionInView = useActiveSection(SECTION_IDS);
  const active = onHome ? sectionInView : null;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuId | null>(null);
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
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || menu ? 'border-ink/10 bg-paper/95' : 'border-transparent'
      }`}
    >
      <nav aria-label="Main" className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" aria-label={t('nav.home')} className="group flex items-center gap-2.5 text-ink">
          <Logo className="size-8" />
          <span className="hidden font-serif text-xl sm:inline">{t('brand')}</span>
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const isActive = active === link.id;
            const content = (
              <>
                {isActive && (
                  <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-[13px] h-px bg-accent" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />
                )}
                {t(link.label)}
              </>
            );
            const cls = `relative isolate inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive || menu === link.menu ? 'text-ink' : 'text-ink-3 hover:text-ink'
            }`;
            return (
              <li key={link.id}>
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
          <LangToggle />
          <button
            type="button"
            onClick={onPalette}
            aria-label={t('nav.palette')}
            className="btn-line hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs text-ink-3 hover:text-ink sm:inline-flex"
          >
            <Command className="size-3.5" aria-hidden="true" />
            <kbd className="font-mono">Ctrl K</kbd>
          </button>
          <button
            type="button"
            onClick={onContact}
            className="btn-ink hidden rounded-full px-4 py-2 text-sm font-medium lg:inline-flex"
          >
            {t('nav.talk')}
          </button>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={drawer}
            className="rounded-full p-2 text-ink-2 transition-colors hover:bg-ink/[0.06] lg:hidden"
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
              aria-label={menu === 'experience' ? t('nav.experienceMenu') : menu === 'projects' ? t('nav.projectsMenu') : t('nav.goalsMenu')}
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              onMouseLeave={hoverClose}
              onKeyDown={onPanelKey}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-1/2 hidden -translate-x-1/2 pt-2 lg:block"
            >
              <motion.div layout transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="panel lift relative overflow-hidden rounded-xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={menu} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    {menu === 'experience' && <ExperiencePanel onPick={onOpenExperience} close={close} />}
                    {menu === 'projects' && <ProjectsPanel onFilter={onFilter} onFocusProject={onFocusProject} close={close} />}
                    {menu === 'goals' && <GoalsPanel close={close} />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Scroll progress */}
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-px origin-left bg-ink" />

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink/25 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside
              aria-label="Mobile menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-ink/10 bg-paper p-4 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ink-3 uppercase">{t('nav.menu')}</span>
                <button type="button" onClick={() => setDrawer(false)} aria-label={t('nav.closeMenu')} className="rounded-full p-2 text-ink-2 transition-colors hover:bg-ink/[0.06]">
                  <X className="size-6" />
                </button>
              </div>

              <a href="#home" onClick={() => setDrawer(false)} className="border-b border-ink/10 px-3 py-3 font-serif text-2xl text-ink">
                {t('nav.home')}
              </a>
              <Accordion title={t('nav.experience')} open={section === 'experience'} onToggle={() => setSection((s) => (s === 'experience' ? null : 'experience'))}>
                <ul className="space-y-1">
                  {c.experiences.filter((e) => !e.minor).map((exp) => (
                    <li key={exp.id}>
                      <button type="button" onClick={mobilePick(() => onOpenExperience(exp.id))} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-ink/[0.04]">
                        <CompanyLogo company={exp.company} size={36} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">{exp.company.name}</span>
                          <span className="block truncate text-xs text-ink-3">{exp.role}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title={t('nav.projects')} open={section === 'projects'} onToggle={() => setSection((s) => (s === 'projects' ? null : 'projects'))}>
                <div className="flex flex-wrap gap-2 px-2">
                  {(['All', ...c.projectFilters] as const).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={mobilePick(() => {
                        onFilter(tech);
                      })}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 font-mono text-xs text-ink-2 hover:border-ink/40"
                    >
                      <TechIcon tech={tech} className="size-3.5" />
                      {tech === 'All' ? t('nav.allProjects') : c.tech(tech)}
                      <span className="text-ink-3">{countFor(c, tech)}</span>
                    </button>
                  ))}
                </div>
              </Accordion>
              <Accordion title={t('nav.goals')} open={section === 'goals'} onToggle={() => setSection((s) => (s === 'goals' ? null : 'goals'))}>
                <ol className="space-y-1 px-2">
                  {ROADMAP.map((r) => (
                    <li key={r.n}>
                      <a href="#goals" onClick={() => setDrawer(false)} className="flex items-center gap-3 rounded-lg p-2 hover:bg-ink/[0.04]">
                        <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border bg-card ${r.tone}`}>
                          <r.icon className="size-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-ink">{t(`goals.s${r.n}.title` as const)}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </Accordion>
              {LINKS.filter((l) => !l.menu && l.id !== 'home').map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={() => setDrawer(false)} className="border-b border-ink/10 px-3 py-3 font-serif text-2xl text-ink">
                  {t(l.label)}
                </a>
              ))}

              <div className="mt-auto space-y-2 pt-6">
                <button type="button" onClick={mobilePick(onPalette)} className="btn-line flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-ink-2">
                  <Command className="size-4" aria-hidden="true" /> {t('nav.search')}
                </button>
                <button type="button" onClick={mobilePick(onContact)} className="btn-ink w-full rounded-full px-4 py-3 font-medium">
                  {t('nav.talk')}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
