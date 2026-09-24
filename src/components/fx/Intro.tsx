import { createContext, useCallback, useContext, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { useLang } from '../../i18n';

const SEEN_KEY = 'portfolio-intro';
const EASE = [0.76, 0, 0.24, 1] as const;
/** Greetings from the places I’ve travelled to (Spain, Romania, England) and a few neighbours. */
const GREETINGS = ['Hola', 'Bună', 'Ciao', 'Hallo', 'Olá'];
/** How long each greeting stays on screen (ms): a slow start, a quick run, then the visitor’s own language. */
const HOLD = [560, 170, 170, 170, 170, 170, 760];
const TOTAL = HOLD.reduce((a, b) => a + b, 0);
/** Duration of the dive through the portal at the end (ms). */
const EXIT_MS = 1000;

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

/** Ship speed over the intro (t from 0 to 1): cruise, jump to light speed, then slow down on arrival. */
function warpSpeed(t: number) {
  if (t < 0.12) return 0.7;
  if (t < 0.62) {
    const k = (t - 0.12) / 0.5;
    return 0.7 + 10.3 * k * k;
  }
  const k = Math.min(1, (t - 0.62) / 0.38);
  return 11 - 9.6 * (1 - (1 - k) ** 3);
}

const STAR_COLORS = ['196,181,253', '240,171,252', '103,232,249', '255,255,255', '255,255,255'];
const Z_MAX = 3.5;

/**
 * Stars flying toward the camera. Slow, they are points; fast, they stretch into light-speed streaks
 * around a glowing vanishing point, with a slight roll of the camera. `speed` is read every frame.
 */
function Starfield({ speed }: { speed: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let focal = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      focal = Math.max(w, h) * 0.5;
    };
    resize();

    type Star = { x: number; y: number; z: number; c: string };
    const spawn = (s: Star, anywhere = false) => {
      s.x = (Math.random() - 0.5) * 2.2;
      s.y = (Math.random() - 0.5) * 2.2;
      s.z = anywhere ? 0.1 + Math.random() * (Z_MAX - 0.1) : Z_MAX;
      s.c = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
      return s;
    };
    const stars = Array.from({ length: w < 640 ? 260 : 620 }, () => spawn({} as Star, true));

    let raf = 0;
    let last = performance.now();
    let roll = 0;
    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const s = speed.current;
      const v = s * 0.0006 * dt;
      roll += s * 0.000035 * dt;
      const cos = Math.cos(roll);
      const sin = Math.sin(roll);
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, w, h);

      // The vanishing point glows brighter as the ship speeds up.
      const glow = Math.min(1, s / 11);
      if (glow > 0.04) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, focal * (0.3 + glow * 0.6));
        g.addColorStop(0, `rgba(168,85,247,${0.38 * glow})`);
        g.addColorStop(0.45, `rgba(34,211,238,${0.1 * glow})`);
        g.addColorStop(1, 'rgba(10,10,16,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.lineCap = 'round';
      const trail = Math.max(v * 7, 0.004);
      for (const star of stars) {
        star.z -= v;
        if (star.z <= 0.05) {
          spawn(star);
          continue;
        }
        const x = star.x * cos - star.y * sin;
        const y = star.x * sin + star.y * cos;
        const sx = cx + (x / star.z) * focal;
        const sy = cy + (y / star.z) * focal;
        if (sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80) {
          spawn(star);
          continue;
        }
        const tz = Math.min(Z_MAX, star.z + trail);
        const near = 1 - star.z / Z_MAX;
        ctx.strokeStyle = `rgba(${star.c},${Math.min(1, near * near * 1.4)})`;
        ctx.lineWidth = 0.5 + near * 2.4;
        ctx.beginPath();
        ctx.moveTo(cx + (x / tz) * focal, cy + (y / tz) * focal);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [speed]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}

/** The brand mark arriving from deep space: frame and links draw themselves, then the nodes light up. */
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
    <motion.div
      initial={{ opacity: 0, scale: 0.15, rotateX: 70, rotateZ: -40 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0, rotateZ: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 800 }}
    >
      <svg viewBox="0 0 32 32" className="size-16 drop-shadow-[0_0_24px_rgb(168_85_247/0.8)] sm:size-20" aria-hidden="true">
        <defs>
          <linearGradient id="intro-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c084fc" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#0a0a12" opacity="0.85" />
        <motion.path d="M10 1 H22 A9 9 0 0 1 31 10 V22 A9 9 0 0 1 22 31 H10 A9 9 0 0 1 1 22 V10 A9 9 0 0 1 10 1 Z" fill="none" stroke="url(#intro-g)" strokeWidth="1.2" {...draw(0.1)} />
        <motion.path d="M16 16 L16 8.5 M16 16 L9.5 21.5 M16 16 L22.5 21.5 M9.5 21.5 L22.5 21.5" fill="none" stroke="url(#intro-g)" strokeWidth="1.6" strokeLinecap="round" {...draw(0.45)} />
        <motion.circle cx="16" cy="8.5" r="2.6" fill="#c084fc" {...node(0.8)} />
        <motion.circle cx="9.5" cy="21.5" r="2.6" fill="#a78bfa" {...node(0.9)} />
        <motion.circle cx="22.5" cy="21.5" r="2.6" fill="#22d3ee" {...node(1)} />
        <motion.circle cx="16" cy="16" r="3.2" fill="#fff" {...node(1.1)} />
      </svg>
    </motion.div>
  );
}

/**
 * Opening sequence, played once when a visitor lands on the home page: a jump to light speed.
 * Stars stream past, the logo arrives from deep space, greetings fly out of the distance and land on
 * the visitor’s own language while a counter runs to 100. Then the ship dives through a glowing portal
 * that opens from the centre onto the site. Click, Escape, Enter or the Skip button start the dive early.
 */
export function Intro({ onReveal }: { onReveal: () => void }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [word, setWord] = useState(0);
  const [pct, setPct] = useState(0);
  const done = useRef(false);
  const speed = useRef(warpSpeed(0));
  const words = lang === 'fr' ? ['Hello', ...GREETINGS, 'Bonjour'] : ['Bonjour', ...GREETINGS, 'Hello'];

  // Portal: a hole grows from the centre of the screen (radius in vmax), with a glowing ring on its edge.
  const hole = useMotionValue(0);
  // Soft edge that only exists once the hole opens (no see-through dot before the dive).
  const edge = useTransform(hole, (r) => r + Math.min(7, r * 2));
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${hole}vmax, #000 ${edge}vmax)`;
  const ringScale = useTransform(hole, (r) => r / 50);
  const ringOpacity = useTransform(hole, [0, 4, 110, 150], [0, 1, 0.6, 0]);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    onReveal();
    // Final burst of speed while diving through the portal.
    animate(speed.current, 26, { duration: 0.6, ease: 'easeIn', onUpdate: (v) => (speed.current = v) });
    animate(hole, 150, { duration: EXIT_MS / 1000, ease: [0.7, 0, 0.84, 0] });
    window.setTimeout(() => setOpen(false), EXIT_MS);
  }, [onReveal, hole]);

  // One clock drives the greeting, the counter and the ship speed.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the intro may play again, no harm */
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      if (done.current) return;
      const elapsed = now - start;
      let acc = 0;
      let i = 0;
      while (i < HOLD.length - 1 && elapsed > acc + HOLD[i]) acc += HOLD[i++];
      setWord(i);
      const p = Math.min(1, elapsed / TOTAL);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      speed.current = warpSpeed(p);
      if (elapsed >= TOTAL) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finish]);

  // Keyboard skip, and no page scroll behind the intro.
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

  if (!open) return null;
  return (
    <div role="presentation" data-testid="intro" onClick={finish} className="fixed inset-0 z-[65] cursor-pointer text-white">
      <motion.div className="absolute inset-0 flex flex-col bg-ink" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <Starfield speed={speed} />

        {/* Logo and greeting: they fly past the camera when the ship dives. */}
        <motion.div
          animate={leaving ? { scale: 3.2, opacity: 0, filter: 'blur(10px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: [0.55, 0, 1, 0.45] }}
          className="relative flex flex-1 flex-col items-center justify-center gap-7 px-6"
        >
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
              initial={{ scale: 0.35, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: word === 0 ? 0.55 : word === words.length - 1 ? 0.4 : 0.14, ease: [0.16, 1, 0.3, 1] }}
              className={`pb-2 drop-shadow-[0_0_24px_rgb(0_0_0/0.8)] ${word === words.length - 1 ? 'text-shine' : ''}`}
            >
              {words[word]}
            </motion.span>
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-end justify-between gap-4 px-5 pb-6 font-mono text-xs text-zinc-400 sm:px-10 sm:pb-9"
        >
          <span className="tracking-[0.25em] uppercase">Robin Canovas · Portfolio</span>
          <span className="text-4xl font-bold text-white tabular-nums sm:text-6xl" aria-hidden="true">
            {String(pct).padStart(3, '0')}
            <span className="text-lg text-zinc-500 sm:text-2xl">%</span>
          </span>
        </motion.div>
        <div aria-hidden="true" className="relative h-px w-full bg-white/10">
          <div className="h-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 shadow-[0_0_12px_rgb(34_211_238)]" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="absolute top-5 right-5 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 font-mono text-[11px] tracking-widest text-zinc-300 uppercase backdrop-blur transition hover:border-white/40 hover:text-white sm:top-8 sm:right-10"
        >
          {t('intro.skip')}
        </button>
      </motion.div>

      {/* Glowing edge of the portal. */}
      <motion.div
        aria-hidden="true"
        style={{ scale: ringScale, opacity: ringOpacity }}
        className="pointer-events-none absolute top-1/2 left-1/2 -mt-[50vmax] -ml-[50vmax] size-[100vmax] rounded-full border-2 border-cyan-200/80 shadow-[0_0_60px_10px_rgb(168_85_247/0.55),inset_0_0_60px_10px_rgb(34_211_238/0.45)]"
      />
    </div>
  );
}
