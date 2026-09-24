import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, ChevronDown, Command, GraduationCap, Landmark, Menu, Sparkles, Tent, Trophy, X } from 'lucide-react';
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
      className={`relative isolate inline-flex items-center rounded-lg border border-white/15 bg-white/[0.05] p-0.5 font-mono text-[11px] font-semibold ${className}`}
    >
      {(['en', 'fr'] as const).map((l) => (
        <span key={l} className={`relative px-2 py-1 uppercase transition-colors ${lang === l ? 'text-white' : 'text-zinc-500'}`}>
          {lang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-violet-500/80 to-cyan-500/80 shadow-[0_0_14px_rgb(168_85_247/0.5)]"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
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
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{t('nav.career')}</p>
        <ul>
          {experiences.filter((e) => !e.minor).map((exp, i) => (
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
        <p className="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{t('nav.background')}</p>
        <button
          type="button"
          data-menu-item
          onClick={() => {
            close();
            navigate(href.education('iut'));
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
            navigate(href.education('eedf'));
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
            <span className="block text-sm font-semibold text-white">{t('nav.scout')}</span>
            <span className="block text-xs text-zinc-400">{t('nav.scoutSub')}</span>
          </span>
        </button>
        <a
          href="#experience"
          data-menu-item
          onClick={close}
          className="mt-auto inline-flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
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
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{t('nav.filter')}</p>
        <ul className="grid grid-cols-2 gap-0.5">
          {(['All', ...c.projectFilters] as const).map((tech, i) => (
            <motion.li key={tech} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <button
                type="button"
                data-menu-item
                onClick={() => {
                  close();
                  onFilter(tech);
                }}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                <TechIcon tech={tech} />
                <span className="flex-1 truncate">{tech === 'All' ? t('nav.allProjects') : c.tech(tech)}</span>
                <span className="font-mono text-[10px] text-zinc-500">{countFor(c, tech)}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10 p-2">
        <p className="flex items-center gap-1.5 px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          <Sparkles className="size-3" aria-hidden="true" /> {t('nav.featured')}
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

const ROADMAP = [
  { n: 1, icon: Briefcase, tone: 'text-emerald-300 border-emerald-400/50 bg-emerald-400/15' },
  { n: 2, icon: Building2, tone: 'text-violet-200 border-violet-400/40 bg-violet-400/10' },
  { n: 3, icon: Landmark, tone: 'text-violet-200 border-violet-400/40 bg-violet-400/10' },
  { n: 4, icon: Trophy, tone: 'text-amber-200 border-amber-300/60 bg-amber-400/15 shadow-[0_0_16px_rgb(251_191_36/0.5)]' },
] as const;

function SchoolTile({ sources, name }: { sources: string[]; name: string }) {
  const [i, setI] = useState(0);
  return (
    <span className="flex h-12 items-center justify-center rounded-lg bg-white p-2">
      {i < sources.length ? (
        <img src={sources[i]} alt={name} onError={() => setI((n) => n + 1)} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="text-[10px] font-semibold text-zinc-800">{name}</span>
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
        <p className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">{t('nav.roadmap')}</p>
        <ol className="relative">
          <span aria-hidden="true" className="absolute top-6 bottom-6 left-[27px] w-px bg-gradient-to-b from-emerald-400/60 via-violet-400/40 to-amber-300/70" />
          {ROADMAP.map((r, i) => (
            <motion.li key={r.n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <button type="button" data-menu-item onClick={go} className="group relative flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/[0.06]">
                <span className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border ${r.tone}`}>
                  <r.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">{t(`goals.s${r.n}.tag` as const)}</span>
                  <span className={`block truncate text-sm font-semibold ${r.n === 4 ? 'text-shine' : 'text-white'}`}>{t(`goals.s${r.n}.title` as const)}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-amber-400/10 via-transparent to-violet-500/10 p-2">
        <p className="px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">{t('nav.schools')}</p>
        <div className="grid grid-cols-3 gap-2 px-1">
          {targetSchools.map((sc, i) => (
            <motion.button
              key={sc.id}
              type="button"
              data-menu-item
              onClick={go}
              title={sc.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="rounded-lg transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_rgb(251_191_36/0.7)]"
            >
              <SchoolTile sources={sc.logos} name={sc.name} />
            </motion.button>
          ))}
        </div>
        <button type="button" data-menu-item onClick={go} className="mt-auto inline-flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10">
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

export function Navbar({ onFilter, onOpenExperience, onFocusProject, onContact, onPalette, onHome = true }: NavActions) {
  const { t } = useLang();
  const c = useContent();
  const sectionInView = useActiveSection(SECTION_IDS);
  const active = onHome ? sectionInView : null;
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
        <a href="#home" aria-label={t('nav.home')} className="group flex items-center gap-2.5 text-white">
          {/* data-brand-logo: where the opening intro lands the mark. */}
          <span data-brand-logo className="inline-flex">
            <Logo className="size-9 drop-shadow-[0_0_12px_rgb(168_85_247/0.55)] transition duration-500 group-hover:rotate-[20deg] group-hover:drop-shadow-[0_0_18px_rgb(34_211_238/0.7)]" />
          </span>
          <span className="hidden text-[15px] font-semibold tracking-wide sm:inline">{t('brand')}</span>
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
                {t(link.label)}
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
          <LangToggle />
          <button
            type="button"
            onClick={onPalette}
            aria-label={t('nav.palette')}
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
            {t('nav.talk')}
          </button>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label={t('nav.openMenu')}
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
              aria-label={menu === 'experience' ? t('nav.experienceMenu') : menu === 'projects' ? t('nav.projectsMenu') : t('nav.goalsMenu')}
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
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#08080c] shadow-[0_30px_90px_-20px_rgb(168_85_247/0.45),0_0_0_1px_rgb(168_85_247/0.08)]"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={menu} initial={{ opacity: 0, x: menu === 'projects' ? 24 : -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: menu === 'projects' ? -24 : 24 }} transition={{ duration: 0.18 }}>
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
                <span className="font-mono text-xs text-zinc-500">{t('nav.menu')}</span>
                <button type="button" onClick={() => setDrawer(false)} aria-label={t('nav.closeMenu')} className="rounded-lg p-2 text-zinc-300 hover:bg-white/10">
                  <X className="size-6" />
                </button>
              </div>

              <a href="#home" onClick={() => setDrawer(false)} className="border-b border-white/5 px-3 py-3 text-base font-medium text-zinc-200">
                {t('nav.home')}
              </a>
              <Accordion title={t('nav.experience')} open={section === 'experience'} onToggle={() => setSection((s) => (s === 'experience' ? null : 'experience'))}>
                <ul className="space-y-1">
                  {c.experiences.filter((e) => !e.minor).map((exp) => (
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
              <Accordion title={t('nav.projects')} open={section === 'projects'} onToggle={() => setSection((s) => (s === 'projects' ? null : 'projects'))}>
                <div className="flex flex-wrap gap-2 px-2">
                  {(['All', ...c.projectFilters] as const).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={mobilePick(() => {
                        onFilter(tech);
                      })}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:border-violet-400"
                    >
                      <TechIcon tech={tech} className="size-3.5" />
                      {tech === 'All' ? t('nav.allProjects') : c.tech(tech)}
                      <span className="text-zinc-500">{countFor(c, tech)}</span>
                    </button>
                  ))}
                </div>
              </Accordion>
              <Accordion title={t('nav.goals')} open={section === 'goals'} onToggle={() => setSection((s) => (s === 'goals' ? null : 'goals'))}>
                <ol className="space-y-1 px-2">
                  {ROADMAP.map((r) => (
                    <li key={r.n}>
                      <a href="#goals" onClick={() => setDrawer(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5">
                        <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${r.tone}`}>
                          <r.icon className="size-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-zinc-200">{t(`goals.s${r.n}.title` as const)}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </Accordion>
              {LINKS.filter((l) => !l.menu && l.id !== 'home').map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={() => setDrawer(false)} className="border-b border-white/5 px-3 py-3 text-base font-medium text-zinc-200">
                  {t(l.label)}
                </a>
              ))}

              <div className="mt-auto space-y-2 pt-6">
                <button type="button" onClick={mobilePick(onPalette)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
                  <Command className="size-4" aria-hidden="true" /> {t('nav.search')}
                </button>
                <button type="button" onClick={mobilePick(onContact)} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 font-semibold text-white">
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
