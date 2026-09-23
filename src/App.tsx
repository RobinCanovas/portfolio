import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ExperiencePage } from './pages/ExperiencePage';
import { ProjectPage } from './pages/ProjectPage';
import { href, navigate, useRoute } from './router';
import { CommandPalette } from './components/CommandPalette';
import { Contact } from './components/Contact';
import { Education } from './components/Education';
import { Goals } from './components/Goals';
import { LangProvider, useLang } from './i18n';
import { Experience } from './components/Experience';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { CursorFx } from './components/fx/CursorFx';
import { HYPER_EVENT, triggerHyperMode, useKonami } from './components/fx/effects';
import { TechMarquee } from './components/fx/TechMarquee';
import { AnimatePresence, motion } from 'framer-motion';
import { findExperience, findProject, profile } from './data/profile';
import type { Tech } from './types';

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute top-1/3 -right-60 h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.12] blur-[140px]" />
      <div className="absolute bottom-0 -left-60 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/[0.12] blur-[140px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="grain absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}

function HyperToast() {
  const { t } = useLang();
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t = 0;
    const show = () => {
      setOn(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setOn(false), 6000);
    };
    window.addEventListener(HYPER_EVENT, show);
    return () => {
      window.removeEventListener(HYPER_EVENT, show);
      window.clearTimeout(t);
    };
  }, []);
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-fuchsia-400/40 bg-black/80 px-5 py-2.5 font-mono text-sm text-fuchsia-200 shadow-[0_0_40px_rgb(217_70_239/0.5)] backdrop-blur"
        >
          {t('hyper.toast')}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Portfolio />
    </LangProvider>
  );
}

function Portfolio() {
  const { t } = useLang();
  useKonami(triggerHyperMode);
  const route = useRoute();
  const [filter, setFilter] = useState<Tech | 'All'>('All');
  const [contactOpen, setContactOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const previousRoute = useRef(route.name);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openExperience = useCallback((id: string) => navigate(href.experience(id)), []);
  const openProject = useCallback((id: string) => navigate(href.project(id)), []);
  const filterProjects = useCallback((tech: Tech | 'All') => {
    setFilter(tech);
    navigate(href.section('projects'));
  }, []);

  // Scroll management between the home page and detail pages.
  useLayoutEffect(() => {
    const fromPage = previousRoute.current !== 'home';
    previousRoute.current = route.name;
    if (route.name !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    if (route.anchor) {
      const el = document.getElementById(route.anchor);
      el?.scrollIntoView({ behavior: fromPage ? ('instant' as ScrollBehavior) : 'smooth', block: 'start' });
    } else if (fromPage) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [route]);

  const page = (() => {
    if (route.name === 'experience') {
      if (findExperience(route.id)) return <ExperiencePage key={route.id} id={route.id} />;
    }
    if (route.name === 'project') {
      if (findProject(route.id)) return <ProjectPage key={route.id} id={route.id} />;
    }
    return null;
  })();

  // Ctrl/Cmd + K toggles the command palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => document.getElementById('main')?.focus()}
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-zinc-900 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('skip')}
      </button>
      <Backdrop />
      <CursorFx />
      <HyperToast />
      <Navbar key={route.name} onHome={route.name === 'home'} onFilter={filterProjects} onOpenExperience={openExperience} onFocusProject={openProject} onContact={openContact} onPalette={openPalette} />
      <main id="main" tabIndex={-1} className="outline-none">
        {page ?? (
          <>
            <Hero onContact={openContact} />
            <TechMarquee />
            <Experience />
            <Projects filter={filter} onFilter={setFilter} />
            <Skills />
            <Education />
            <Goals />
          </>
        )}
        <Contact open={contactOpen} onOpen={openContact} onClose={closeContact} />
      </main>
      <CommandPalette open={paletteOpen} onClose={closePalette} onOpenExperience={openExperience} onFocusProject={openProject} onContact={openContact} />
      <footer className="border-t border-white/10 py-8 text-center font-mono text-xs text-zinc-500">
        © {new Date().getFullYear()} {profile.name} · {t('footer.built')} ·{' '}
        <button type="button" onClick={openPalette} className="underline decoration-dotted underline-offset-4 hover:text-zinc-300">
          Ctrl K
        </button>
      </footer>
    </>
  );
}
