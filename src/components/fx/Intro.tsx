import { createContext, useCallback, useContext, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n';

const SEEN_KEY = 'portfolio-intro';
/** Greetings from the places I’ve travelled to (Spain, Romania, England) and a few neighbours. */
const GREETINGS = ['Hola', 'Bună', 'Ciao', 'Hallo', 'Olá'];
/** One greeting per gradient step (ms): the start point, six steps, then the minimum. */
const HOLD = [650, 300, 300, 300, 300, 300, 720];
const TOTAL = HOLD.reduce((a, b) => a + b, 0);
/** Duration of the landing: the landscape flattens into the page grid (ms). */
const EXIT_MS = 1100;

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

/* ------------------------------------------------------------------ */
/* The maths: a loss landscape and a real gradient descent on it      */
/* ------------------------------------------------------------------ */

/** Loss surface: a stretched valley (so the descent zig-zags) with soft ripples; global minimum 0 at the origin. */
export const loss = (x: number, y: number) => {
  const r2 = x * x + y * y;
  return Math.log(1 + 0.3 * x * x + 1.6 * y * y) + 0.14 * Math.sin(1.7 * x) * Math.cos(1.3 * y) * (1 - Math.exp(-r2 / 2.5));
};
const grad = (x: number, y: number): [number, number] => {
  const h = 1e-4;
  return [(loss(x + h, y) - loss(x - h, y)) / (2 * h), (loss(x, y + h) - loss(x, y - h)) / (2 * h)];
};
export const LEARNING_RATE = 1;
/** θ ← θ − η∇f(θ), six steps from a high start point. */
export const PATH: [number, number][] = (() => {
  const pts: [number, number][] = [[2.7, -1.5]];
  for (let i = 0; i < 6; i++) {
    const [x, y] = pts[pts.length - 1];
    const [gx, gy] = grad(x, y);
    pts.push([x - LEARNING_RATE * gx, y - LEARNING_RATE * gy]);
  }
  return pts;
})();
const LOSS0 = loss(...PATH[0]);

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Where the ball is at a given time: dropping on the start point, hopping from step to step, then settling in the minimum. */
function timeline(elapsed: number) {
  let acc = 0;
  let i = 0;
  while (i < HOLD.length - 1 && elapsed > acc + HOLD[i]) acc += HOLD[i++];
  const s = clamp01((elapsed - acc) / HOLD[i]);
  let x: number;
  let y: number;
  let lift = 0;
  let resting = false;
  if (i === 0) {
    [x, y] = PATH[0];
    lift = (1 - easeOut(clamp01(s / 0.6))) * 1.6;
    resting = s > 0.6;
  } else {
    const [ax, ay] = PATH[i - 1];
    const [bx, by] = PATH[i];
    const k = easeInOut(clamp01(s / 0.45));
    x = ax + (bx - ax) * k;
    y = ay + (by - ay) * k;
    lift = Math.sin(Math.PI * k) * 0.35;
    resting = s > 0.45;
    if (i === HOLD.length - 1 && s > 0.5) {
      // Last word: the remaining iterations, shown as a slide into the exact minimum.
      const m = easeInOut(clamp01((s - 0.5) / 0.4));
      x = bx * (1 - m);
      y = by * (1 - m);
      resting = m >= 1;
    }
  }
  const converged = i === HOLD.length - 1 && s >= 0.9;
  // Steps already reached: the current one counts once the hop (or the initial drop) is over.
  const landed = s > (i === 0 ? 0.6 : 0.45) ? i : i - 1;
  return { word: i, x, y, lift, resting, converged, landed, loss: converged ? 0 : Math.max(0, loss(x, y)) };
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

interface Clock {
  start: number;
  exitStart: number | null;
}

const EXTENT = 3.2;
const LINES = 25;
const SAMPLES = 48;
const HEIGHT = 0.55;
const DIST = 9;
const FIREFLIES = 220;
const TRAIL = 6;

/**
 * Night scene: a wireframe loss landscape under a starry sky, seen by a slow cinematic camera.
 * Hundreds of fireflies each run their own gradient descent and stream down into the valley like
 * luminous water; the main ball follows the step-by-step descent, leaving a trail and showing −∇f
 * while it rests. At convergence a flash and a ripple cross the surface, then the landscape flattens
 * and the camera rises to a top-down view: the surface becomes a plain grid, like the page background.
 */
function Landscape({ clock }: { clock: MutableRefObject<Clock> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Deterministic randomness, so the scene is the same on every visit.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const stars = Array.from({ length: 140 }, () => ({ x: rand(), y: rand() * 0.55, r: 0.4 + rand() * 1.1, phase: rand() * 6.28 }));
    // Fireflies start on the slopes, far from the minimum, each with its own learning rate.
    type Fly = { x: number; y: number; eta: number; bornAt: number; arrivedAt: number | null; trail: [number, number][] };
    const place = (fly: Fly, bornAt: number) => {
      const a = rand() * Math.PI * 2;
      const r = 1.6 + rand() * 1.5;
      fly.x = Math.cos(a) * r;
      fly.y = Math.sin(a) * r;
      fly.eta = 0.012 + rand() * 0.016;
      fly.bornAt = bornAt;
      fly.arrivedAt = null;
      fly.trail = [[fly.x, fly.y]];
      return fly;
    };
    const flies = Array.from({ length: FIREFLIES }, () => place({} as Fly, 200 + rand() * 900));

    // Ball position when the exit started (the dive to the minimum starts from there).
    let exitFrom: [number, number] | null = null;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.7);
      last = now;
      const { start, exitStart } = clock.current;
      const elapsed = now - start;
      const play = clamp01(elapsed / TOTAL);
      const exitT = exitStart === null ? 0 : clamp01((now - exitStart) / EXIT_MS);
      const tl = timeline(Math.min(elapsed, TOTAL));

      const flatten = easeInOut(clamp01((exitT - 0.15) / 0.65));
      const H = HEIGHT * (1 - flatten);
      // Cinematic camera: a slow orbit and dolly in, then it rises to a top-down view on exit.
      const yaw = 2.2 + 0.32 * easeInOut(play) + 0.2 * flatten;
      const elev = (0.52 + 0.18 * easeInOut(play)) * (1 - flatten) + (Math.PI / 2) * flatten;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosE = Math.cos(elev);
      const sinE = Math.sin(elev);
      const S = 0.12 * Math.min(w, h * 1.6) * (0.94 + 0.1 * easeInOut(play) + 0.22 * flatten);
      const cx = w / 2;
      const cy = h * 0.6;

      // Convergence ripple: a wave running across the surface, fading fast.
      const rt = exitStart === null ? -1 : (now - exitStart) / 1000;
      const ripple = (r: number) => (rt < 0 ? 0 : 0.32 * Math.sin(6 * r - 13 * rt) * Math.exp(-0.5 * r) * Math.exp(-2.6 * rt) * (r < rt * 2.2 ? 1 : 0));
      const surface = (x: number, y: number) => loss(x, y) * H + ripple(Math.hypot(x, y));

      const project = (x: number, y: number, z: number): [number, number, number] => {
        const xr = x * cosY - y * sinY;
        const yr = x * sinY + y * cosY;
        const c = -yr * cosE + z * sinE;
        const p = S * (DIST / (DIST - c));
        return [cx + xr * p, cy - (yr * sinE + z * cosE) * p, c];
      };
      const fog = (c: number) => clamp01(0.3 + (0.7 * (c + 2.6)) / 5.2);

      // Night sky.
      ctx.fillStyle = '#07070d';
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.45 + 0.55 * Math.sin(now / 600 + s.phase);
        ctx.fillStyle = `rgba(226,232,255,${0.55 * tw * (1 - flatten)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Glow of the horizon behind the landscape, and of the valley floor.
      const hx = cx;
      const hy = cy - S * 2.3;
      const horizon = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(w, h) * 0.55);
      horizon.addColorStop(0, `rgba(192,38,211,${0.28 * (1 - flatten)})`);
      horizon.addColorStop(0.4, `rgba(124,58,237,${0.12 * (1 - flatten)})`);
      horizon.addColorStop(1, 'rgba(7,7,13,0)');
      ctx.fillStyle = horizon;
      ctx.fillRect(0, 0, w, h);
      const [mx, my] = project(0, 0, 0);
      const valley = ctx.createRadialGradient(mx, my, 0, mx, my, S * 2.6);
      valley.addColorStop(0, 'rgba(34,211,238,0.2)');
      valley.addColorStop(0.5, 'rgba(168,85,247,0.07)');
      valley.addColorStop(1, 'rgba(7,7,13,0)');
      ctx.fillStyle = valley;
      ctx.fillRect(0, 0, w, h);

      // Wireframe: coloured by height (cyan valley, violet ridges), fading into the fog far away
      // and toward a circular edge.
      ctx.lineWidth = 1;
      const step = (2 * EXTENT) / (LINES - 1);
      const sub = (2 * EXTENT) / SAMPLES;
      for (let dir = 0; dir < 2; dir++) {
        for (let l = 0; l < LINES; l++) {
          const fixed = -EXTENT + l * step;
          let prev: [number, number, number] | null = null;
          for (let k = 0; k <= SAMPLES; k++) {
            const t = -EXTENT + k * sub;
            const x = dir === 0 ? t : fixed;
            const y = dir === 0 ? fixed : t;
            const r = Math.hypot(x, y);
            const fade = clamp01((EXTENT - r) / 1.1);
            if (fade <= 0) {
              prev = null;
              continue;
            }
            const f = loss(x, y);
            const pt = project(x, y, f * H + ripple(r));
            if (prev) {
              const hn = clamp01(f / 2.2);
              const red = Math.round(34 + (168 - 34) * hn);
              const green = Math.round(211 + (85 - 211) * hn);
              const blue = Math.round(238 + (247 - 238) * hn);
              ctx.strokeStyle = `rgba(${red},${green},${blue},${(0.3 + 0.5 * (1 - hn)) * fade * fog(pt[2]) * (1 - 0.6 * flatten)})`;
              ctx.beginPath();
              ctx.moveTo(prev[0], prev[1]);
              ctx.lineTo(pt[0], pt[1]);
              ctx.stroke();
            }
            prev = pt;
          }
        }
      }

      // Fireflies: stochastic gradient descent, streaming down into the valley.
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (const fly of flies) {
        if (elapsed < fly.bornAt) continue;
        const [gx, gy] = grad(fly.x, fly.y);
        // Gradient step plus a little noise: a stochastic descent, like SGD.
        fly.x -= fly.eta * gx * dt * 2 + (rand() - 0.5) * 0.012 * dt;
        fly.y -= fly.eta * gy * dt * 2 + (rand() - 0.5) * 0.012 * dt;
        fly.trail.push([fly.x, fly.y]);
        if (fly.trail.length > TRAIL) fly.trail.shift();
        const f = loss(fly.x, fly.y);
        // Arrived in the valley: fade out, then start again high on the slopes (until the landing).
        if (f < 0.05 && fly.arrivedAt === null) fly.arrivedAt = elapsed;
        const gone = fly.arrivedAt === null ? 0 : clamp01((elapsed - fly.arrivedAt) / 600);
        if (gone >= 1 && exitStart === null) {
          place(fly, elapsed + rand() * 300);
          continue;
        }
        const low = clamp01(1 - f / 1.2);
        const born = clamp01((elapsed - fly.bornAt) / 400);
        const a = born * (1 - gone * 0.8) * (1 - flatten) * (0.35 + 0.55 * low);
        const col = low > 0.85 ? '220,250,255' : low > 0.5 ? '103,232,249' : '232,121,249';
        ctx.strokeStyle = `rgba(${col},${a})`;
        ctx.lineWidth = 1.4 + low;
        ctx.beginPath();
        fly.trail.forEach(([tx, ty], i) => {
          const [px, py] = project(tx, ty, surface(tx, ty) + 0.03);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
      ctx.restore();

      // Ball: on the timeline while playing, then a quick slide into the minimum during the exit.
      let bx = tl.x;
      let by = tl.y;
      let lift = tl.lift;
      if (exitStart !== null) {
        exitFrom ??= [bx, by];
        const m = easeOut(clamp01(exitT / 0.3));
        bx = exitFrom[0] * (1 - m);
        by = exitFrom[1] * (1 - m);
        lift *= 1 - m;
      }
      const ballSurface = (x: number, y: number) => surface(x, y) + 0.04;
      const alpha = clamp01(elapsed / 250);

      // Trail through the landed steps.
      ctx.save();
      ctx.shadowColor = 'rgba(232,121,249,0.9)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = `rgba(240,171,252,${0.9 * alpha * (1 - flatten)})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= Math.max(0, tl.landed); i++) {
        const [px, py] = project(PATH[i][0], PATH[i][1], ballSurface(PATH[i][0], PATH[i][1]));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const [ballX, ballY] = project(bx, by, ballSurface(bx, by) + lift);
      ctx.lineTo(ballX, ballY);
      ctx.stroke();
      ctx.restore();
      for (let i = 0; i <= Math.max(0, tl.landed); i++) {
        const [px, py] = project(PATH[i][0], PATH[i][1], ballSurface(PATH[i][0], PATH[i][1]));
        ctx.fillStyle = `rgba(240,171,252,${0.9 * alpha * (1 - flatten)})`;
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // −∇f while the ball rests: where the next step will go.
      if (tl.resting && !tl.converged && exitStart === null) {
        const [gx, gy] = grad(bx, by);
        const n = Math.hypot(gx, gy) || 1;
        const tx = bx - (gx / n) * 0.7;
        const ty = by - (gy / n) * 0.7;
        const [ax, ay] = project(tx, ty, ballSurface(tx, ty));
        const ang = Math.atan2(ay - ballY, ax - ballX);
        ctx.strokeStyle = 'rgba(103,232,249,0.95)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ballX, ballY);
        ctx.lineTo(ax, ay);
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 8 * Math.cos(ang - 0.45), ay - 8 * Math.sin(ang - 0.45));
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 8 * Math.cos(ang + 0.45), ay - 8 * Math.sin(ang + 0.45));
        ctx.stroke();
      }

      // The ball itself.
      const halo = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 26);
      halo.addColorStop(0, `rgba(255,255,255,${alpha})`);
      halo.addColorStop(0.22, `rgba(240,171,252,${0.85 * alpha})`);
      halo.addColorStop(1, 'rgba(232,121,249,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 26, 0, Math.PI * 2);
      ctx.fill();

      // Convergence: a flash of light, then rings spreading from the minimum.
      if (exitStart !== null) {
        const flash = Math.exp(-5 * exitT) * (1 - flatten * 0.5);
        const burst = ctx.createRadialGradient(mx, my, 0, mx, my, S * 3.2);
        burst.addColorStop(0, `rgba(255,255,255,${0.75 * flash})`);
        burst.addColorStop(0.2, `rgba(103,232,249,${0.35 * flash})`);
        burst.addColorStop(1, 'rgba(7,7,13,0)');
        ctx.fillStyle = burst;
        ctx.fillRect(0, 0, w, h);
        for (let k = 0; k < 3; k++) {
          const ring = easeOut(clamp01(exitT * 1.3 - k * 0.12));
          if (ring <= 0) continue;
          ctx.strokeStyle = `rgba(${k === 1 ? '232,121,249' : '103,232,249'},${0.7 * (1 - ring)})`;
          ctx.lineWidth = 2 - k * 0.4;
          ctx.beginPath();
          ctx.arc(mx, my, 10 + ring * Math.max(w, h) * (0.5 + k * 0.08), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [clock]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}

const BLOOM_SIZE = 96;

/**
 * The brand mark blooming at the minimum once the descent has converged, then flying to the logo
 * of the navigation bar and landing exactly on it: the real logo takes over when the intro unmounts.
 */
function Bloom() {
  const [flight] = useState(() => {
    const r = document.querySelector('[data-brand-logo]')?.getBoundingClientRect();
    if (!r || r.width === 0) return null;
    return {
      x: r.left + r.width / 2 - window.innerWidth / 2,
      y: r.top + r.height / 2 - window.innerHeight * 0.6,
      scale: r.width / BLOOM_SIZE,
    };
  });
  const duration = EXIT_MS / 1000;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-[60%] left-1/2 -mt-12 -ml-12 size-24"
      initial={{ scale: 0, opacity: 0, rotate: -30, x: 0, y: 0 }}
      animate={
        flight
          ? { scale: [0, 1.15, 1, 1, flight.scale], opacity: [0, 1, 1, 1, 1], rotate: [-30, 0, 0, 0, 0], x: [0, 0, 0, 0, flight.x], y: [0, 0, 0, 0, flight.y] }
          : { scale: [0, 1.15, 1, 1.6], opacity: [0, 1, 1, 0], rotate: [-30, 0, 0, 0] }
      }
      transition={{ duration, times: flight ? [0, 0.2, 0.32, 0.45, 1] : [0, 0.2, 0.45, 1], ease: 'easeInOut' }}
    >
      <BrandMark />
    </motion.div>
  );
}

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-full drop-shadow-[0_0_30px_rgb(168_85_247/0.9)]">

      <defs>
        <linearGradient id="intro-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c084fc" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#0a0a12" stroke="url(#intro-g)" strokeWidth="1.5" />
      <path d="M16 16 L16 8.5 M16 16 L9.5 21.5 M16 16 L22.5 21.5 M9.5 21.5 L22.5 21.5" fill="none" stroke="url(#intro-g)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="8.5" r="2.6" fill="#c084fc" />
      <circle cx="9.5" cy="21.5" r="2.6" fill="#a78bfa" />
      <circle cx="22.5" cy="21.5" r="2.6" fill="#22d3ee" />
      <circle cx="16" cy="16" r="3.2" fill="#fff" />
    </svg>
  );
}

/**
 * Opening sequence, played once when a visitor lands on the home page: "Convergence".
 * A ball descends a loss landscape by real gradient descent; each step brings a greeting from a
 * country I’ve travelled to, and the counter shows the loss falling to zero. At the minimum the
 * brand mark blooms and the landscape flattens into the page grid. Click, Escape, Enter or Skip land early.
 */
export function Intro({ onReveal }: { onReveal: () => void }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [state, setState] = useState(() => timeline(0));
  const done = useRef(false);
  const clock = useRef<Clock>({ start: performance.now(), exitStart: null });
  const words = lang === 'fr' ? ['Hello', ...GREETINGS, 'Bonjour'] : ['Bonjour', ...GREETINGS, 'Hello'];

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    clock.current.exitStart = performance.now();
    setLeaving(true);
    onReveal();
    window.setTimeout(() => setOpen(false), EXIT_MS);
  }, [onReveal]);

  // One clock drives the words, the loss readout and the landscape.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the intro may play again, no harm */
    }
    clock.current.start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      if (done.current) return;
      const elapsed = now - clock.current.start;
      setState(timeline(Math.min(elapsed, TOTAL)));
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
  const shownLoss = leaving ? 0 : state.loss;
  const stepNo = Math.min(6, Math.max(0, state.landed));
  return (
    <div role="presentation" data-testid="intro" onClick={finish} className="fixed inset-0 z-[65] cursor-pointer text-white">
      <motion.div
        animate={{ opacity: leaving ? 0 : 1 }}
        // Fade out over the second half of the landing, once the landscape has flattened.
        transition={{ duration: (EXIT_MS * 0.5) / 1000, delay: leaving ? (EXIT_MS * 0.45) / 1000 : 0, ease: 'easeInOut' }}
        className="absolute inset-0 bg-ink"
      >
        <Landscape clock={clock} />

        {/* Greeting: one per step of the descent. */}
        <motion.div
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? -20 : 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute inset-x-0 top-[13%] flex justify-center px-6"
        >
          <p className="flex items-center gap-4 text-5xl font-semibold tracking-tight sm:text-7xl" aria-live="off">
            <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-fuchsia-300 shadow-[0_0_18px_4px_rgb(232_121_249/0.7)] sm:size-4" />
            <motion.span
              key={state.word}
              initial={{ y: -14, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: state.word === 0 ? 0.5 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`pb-2 drop-shadow-[0_0_24px_rgb(0_0_0/0.9)] ${state.word === words.length - 1 ? 'text-shine' : ''}`}
            >
              {words[state.word]}
            </motion.span>
          </p>
        </motion.div>

        {/* Readouts */}
        <motion.div animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.3 }} className="pointer-events-none">
          <div className="absolute top-5 left-5 font-mono text-[11px] leading-relaxed text-zinc-400 sm:top-8 sm:left-10">
            <p className="tracking-[0.25em] text-fuchsia-300 uppercase">∇ {t('intro.method')}</p>
            <p className="mt-1 text-zinc-200">θ ← θ − η·∇f(θ)</p>
            <p>η = {LEARNING_RATE.toFixed(1)}</p>
          </div>
          <div className="absolute bottom-7 left-5 font-mono text-xs text-zinc-400 sm:bottom-10 sm:left-10">
            <p className={state.converged ? 'text-emerald-300' : ''}>
              {state.converged ? `✓ ${t('intro.converged')}` : `${t('intro.step')} ${stepNo}/6`}
            </p>
            <p className="mt-1 tracking-[0.25em] uppercase">Robin Canovas · Portfolio</p>
          </div>
          <div className="absolute right-5 bottom-7 text-right sm:right-10 sm:bottom-10" aria-hidden="true">
            <p className="font-mono text-[11px] tracking-[0.25em] text-zinc-400 uppercase">{t('intro.loss')}</p>
            <p className="font-mono text-4xl font-bold text-white tabular-nums sm:text-6xl">{shownLoss.toFixed(3)}</p>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/10">
            <div
              className="h-full origin-left bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400 shadow-[0_0_12px_rgb(34_211_238)]"
              style={{ transform: `scaleX(${1 - shownLoss / LOSS0})` }}
            />
          </div>
        </motion.div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="absolute top-5 right-5 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 font-mono text-[11px] tracking-widest text-zinc-300 uppercase transition hover:border-white/40 hover:text-white sm:top-8 sm:right-10"
        >
          {t('intro.skip')}
        </button>
      </motion.div>

      {/* The mark blooms at the minimum, then lands on the navigation logo (outside the fading layer). */}
      {leaving && <Bloom />}
    </div>
  );
}
