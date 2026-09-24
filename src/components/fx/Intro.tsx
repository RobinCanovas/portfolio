import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../../i18n';

const SEEN_KEY = 'portfolio-intro';
const EASE = [0.76, 0, 0.24, 1] as const;
/** Greetings from the places I’ve travelled to (Spain, Romania, England) and a few neighbours. */
const GREETINGS = ['Hola', 'Bună', 'Ciao', 'Hallo', 'Olá'];
/** How long each greeting stays on screen (ms): a slow start, a quick run, then the visitor’s own language. */
const HOLD = [480, 150, 150, 150, 150, 150, 650];
const TOTAL = HOLD.reduce((a, b) => a + b, 0);

/** True while the home page may play its entrance animations (false while the intro covers it). */
export const IntroContext = createContext(true);
export const useRevealed = () => useContext(IntroContext);

/** The intro plays once per visit, on the home page only, and never with reduced motion. */
export function shouldPlayIntro(): boolean {
  const hash = window.location.hash;
  if (hash && hash !== '#' && hash !== '#home') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !window.sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

/** The brand mark drawing itself: frame, links, then the nodes lighting up. */
function DrawnLogo() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { delay, duration: 0.9, ease: EASE }, opacity: { delay, duration: 0.01 } },
  });
  const node = (delay: number) => ({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay, type: 'spring' as const, stiffness: 320, damping: 14 },
    style: { transformBox: 'fill-box' as const, transformOrigin: 'center' },
  });
  return (
    <svg viewBox="0 0 32 32" className="size-16 drop-shadow-[0_0_24px_rgb(168_85_247/0.7)] sm:size-20" aria-hidden="true">
      <defs>
        <linearGradient id="intro-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c084fc" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <motion.path d="M10 1 H22 A9 9 0 0 1 31 10 V22 A9 9 0 0 1 22 31 H10 A9 9 0 0 1 1 22 V10 A9 9 0 0 1 10 1 Z" fill="none" stroke="url(#intro-g)" strokeWidth="1.2" {...draw(0)} />
      <motion.path d="M16 16 L16 8.5 M16 16 L9.5 21.5 M16 16 L22.5 21.5 M9.5 21.5 L22.5 21.5" fill="none" stroke="url(#intro-g)" strokeWidth="1.6" strokeLinecap="round" {...draw(0.35)} />
      <motion.circle cx="16" cy="8.5" r="2.6" fill="#c084fc" {...node(0.7)} />
      <motion.circle cx="9.5" cy="21.5" r="2.6" fill="#a78bfa" {...node(0.8)} />
      <motion.circle cx="22.5" cy="21.5" r="2.6" fill="#22d3ee" {...node(0.9)} />
      <motion.circle cx="16" cy="16" r="3.2" fill="#fff" {...node(1)} />
    </svg>
  );
}

/**
 * Opening sequence, played once when a visitor lands on the home page:
 * the logo draws itself, greetings cycle through a few languages and land on the visitor’s own,
 * a counter runs to 100, then the curtain lifts with a curved, glowing edge.
 * Click, Escape, Enter or the Skip button end it early.
 */
export function Intro({ onReveal }: { onReveal: () => void }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(true);
  const [word, setWord] = useState(0);
  const [pct, setPct] = useState(0);
  const done = useRef(false);
  const words = lang === 'fr' ? ['Hello', ...GREETINGS, 'Bonjour'] : ['Bonjour', ...GREETINGS, 'Hello'];

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setOpen(false);
    onReveal();
  }, [onReveal]);

  // One clock drives both the greeting and the counter.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the intro may play again, no harm */
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      let acc = 0;
      let i = 0;
      while (i < HOLD.length - 1 && elapsed > acc + HOLD[i]) acc += HOLD[i++];
      setWord(i);
      setPct(Math.min(100, Math.round(100 * (1 - Math.pow(1 - Math.min(1, elapsed / TOTAL), 3)))));
      if (elapsed >= TOTAL) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finish]);

  // Keyboard skip, and no page scroll behind the curtain.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, finish]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          role="presentation"
          data-testid="intro"
          onClick={finish}
          exit={{ y: '-100%', transition: { duration: 1, ease: EASE, delay: 0.05 } }}
          className="fixed inset-0 z-[65] flex cursor-pointer flex-col bg-ink text-white"
        >
          {/* Soft light behind the greeting */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-aurora absolute top-1/2 left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg,#7c3aed55,#06b6d444,#db277733,#7c3aed55)] blur-[100px]" />
            <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
          </div>

          <motion.div exit={{ y: -80, opacity: 0, transition: { duration: 0.6, ease: EASE } }} className="relative flex flex-1 flex-col items-center justify-center gap-7 px-6">
            <DrawnLogo />
            <p className="flex h-16 items-center gap-4 text-5xl font-semibold tracking-tight sm:h-20 sm:text-7xl" aria-live="off">
              <motion.span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_4px_rgb(34_211_238/0.7)] sm:size-4"
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <motion.span
                key={word}
                initial={{ y: '45%', opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: word === 0 ? 0.5 : word === words.length - 1 ? 0.35 : 0.12, ease: 'easeOut' }}
                className={`pb-2 ${word === words.length - 1 ? 'text-shine' : ''}`}
              >
                {words[word]}
              </motion.span>
            </p>
          </motion.div>

          <div className="relative flex items-end justify-between gap-4 px-5 pb-6 font-mono text-xs text-zinc-400 sm:px-10 sm:pb-9">
            <span className="tracking-[0.25em] uppercase">Robin Canovas · Portfolio</span>
            <span className="text-4xl font-bold text-white tabular-nums sm:text-6xl" aria-hidden="true">
              {String(pct).padStart(3, '0')}
              <span className="text-lg text-zinc-500 sm:text-2xl">%</span>
            </span>
          </div>
          <div aria-hidden="true" className="relative h-px w-full bg-white/10">
            <div className="h-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 shadow-[0_0_12px_rgb(34_211_238)]" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
            className="absolute top-5 right-5 rounded-full border border-white/15 px-4 py-1.5 font-mono text-[11px] tracking-widest text-zinc-300 uppercase transition hover:border-white/40 hover:text-white sm:top-8 sm:right-10"
          >
            {t('intro.skip')}
          </button>

          {/* Curved, glowing lower edge of the curtain: it flattens as the curtain lifts. */}
          <svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none" className="pointer-events-none absolute top-full left-0 h-[18vh] w-full overflow-visible">
            <defs>
              <linearGradient id="intro-edge" x1="0" x2="1">
                <stop offset="0" stopColor="#a855f7" />
                <stop offset="0.5" stopColor="#e879f9" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <motion.path
              fill="#0a0a10"
              initial={{ d: 'M0 0 H100 Q50 20 0 0 Z' }}
              exit={{ d: 'M0 0 H100 Q50 0 0 0 Z', transition: { duration: 1, ease: EASE, delay: 0.05 } }}
            />
            <motion.path
              fill="none"
              stroke="url(#intro-edge)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-[0_0_10px_rgb(217_70_239/0.9)]"
              initial={{ d: 'M0 0 Q50 20 100 0' }}
              exit={{ d: 'M0 0 Q50 0 100 0', transition: { duration: 1, ease: EASE, delay: 0.05 } }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
