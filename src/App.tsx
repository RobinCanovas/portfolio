import { useCallback, useEffect, useState } from 'react';
import { CommandPalette } from './components/CommandPalette';
import { Contact } from './components/Contact';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { CursorFx } from './components/fx/CursorFx';
import { HYPER_EVENT, triggerHyperMode, useKonami } from './components/fx/effects';
import { TechMarquee } from './components/fx/TechMarquee';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from './data/profile';
import type { Tech } from './types';

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute top-1/3 -right-60 h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.07] blur-[140px]" />
      <div className="absolute bottom-0 -left-60 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/[0.07] blur-[140px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="grain absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}

function HyperToast() {
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
          ⚡ Hyper mode unlocked — you found the easter egg!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  useKonami(triggerHyperMode);
  const [filter, setFilter] = useState<Tech | 'All'>('All');
  const [experienceId, setExperienceId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openExperience = useCallback((id: string) => setExperienceId(id), []);

  const focusProject = useCallback((id: string) => {
    setFilter('All');
    setHighlightId(id);
    // Wait for the grid to re-render with every project before scrolling.
    window.setTimeout(() => document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }, []);

  useEffect(() => {
    if (!highlightId) return;
    const t = window.setTimeout(() => setHighlightId(null), 2400);
    return () => window.clearTimeout(t);
  }, [highlightId]);

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
      <a href="#main" className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-zinc-900 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Backdrop />
      <CursorFx />
      <HyperToast />
      <Navbar onFilter={setFilter} onOpenExperience={openExperience} onFocusProject={focusProject} onContact={openContact} onPalette={openPalette} />
      <main id="main">
        <Hero onContact={openContact} />
        <TechMarquee />
        <Experience selectedId={experienceId} onSelect={setExperienceId} />
        <Projects filter={filter} onFilter={setFilter} highlightId={highlightId} />
        <Skills />
        <Education />
        <Contact open={contactOpen} onOpen={openContact} onClose={closeContact} />
      </main>
      <CommandPalette open={paletteOpen} onClose={closePalette} onOpenExperience={openExperience} onFocusProject={focusProject} onContact={openContact} />
      <footer className="border-t border-white/10 py-8 text-center font-mono text-xs text-zinc-500">
        © {new Date().getFullYear()} {profile.name} · Built with React, TypeScript, Tailwind & Framer Motion ·{' '}
        <button type="button" onClick={openPalette} className="underline decoration-dotted underline-offset-4 hover:text-zinc-300">
          Ctrl K
        </button>
      </footer>
    </>
  );
}
