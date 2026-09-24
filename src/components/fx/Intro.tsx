import { createContext, useCallback, useContext, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n';
import { createNetwork, forward, seeded } from '../../lib/neural';

const SEEN_KEY = 'portfolio-intro';
/** Greetings from the places I’ve travelled to (Spain, Romania, England) and a few neighbours. */
const GREETINGS = ['Hola', 'Bună', 'Ciao', 'Hallo'];

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
/* The maths: a real network and a real forward pass                   */
/* ------------------------------------------------------------------ */

/** Five inputs, three hidden layers, one output: the same kind of network as the neural network project. */
export const LAYERS = [5, 8, 8, 5, 1];
/** What the network reads. */
export const INPUT = [0.9, 0.35, 0.8, 0.15, 0.7];
/** Weights drawn from N(0, 1) with a fixed seed, chosen so the output lights up. */
const NET = createNetwork(LAYERS, seeded(305));
/** Forward propagation, aˡ = σ(Wˡ·aˡ⁻¹ + bˡ): the activations of every layer, input first. */
export const ACTIVATIONS = forward(NET, INPUT);
const OUTPUT = ACTIVATIONS[LAYERS.length - 1][0];

/** When each layer fires (ms): the signal reaches the inputs, then crosses one layer per step. */
const STEP = 620;
const FIRE = LAYERS.map((_, l) => 900 + l * STEP);
const TOTAL = FIRE[FIRE.length - 1] + 650;
/** Duration of the landing: the network gathers into the brand mark, which flies to the navigation bar (ms). */
const EXIT_MS = 1300;
/** How many layers have fired: 0 before the signal reaches the inputs, 5 once the output has fired. */
const stageAt = (elapsed: number) => FIRE.filter((f) => elapsed >= f).length;

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** Rounded min and max: they bend over about one unit instead of stopping dead. */
const smoothMin = (a: number, b: number) => (a + b - Math.hypot(a - b, 0.8)) / 2;
const smoothMax = (a: number, b: number) => (a + b + Math.hypot(a - b, 0.8)) / 2;
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',');

/** Violet at the input, cyan at the output. */
const VIOLET = [192, 132, 252];
const CYAN = [34, 211, 238];
const COLORS = LAYERS.map((_, l) => mix(VIOLET, CYAN, l / (LAYERS.length - 1)));
/** Connections by weight sign, like the diagram of the live demo. */
const POSITIVE = '103,232,249';
const NEGATIVE = '232,121,249';

interface Edge {
  l: number;
  k: number;
  j: number;
  positive: boolean;
  /** |w|·a of the source, relative to the strongest connection of the layer: how much signal it carries. */
  s: number;
  t0: number;
  t1: number;
}
/** Only the connections that carry enough signal show a pulse. */
const CARRIES = 0.22;

const EDGES: Edge[] = (() => {
  const rand = seeded(11);
  const edges: Edge[] = [];
  NET.forEach(({ W }, l) => {
    const a = ACTIVATIONS[l];
    const max = Math.max(...W.flatMap((row) => row.map((w, k) => Math.abs(w) * a[k])));
    W.forEach((row, j) =>
      row.forEach((w, k) => {
        // Pulses leave one source after the other and all reach the next layer just before it fires.
        edges.push({ l, k, j, positive: w > 0, s: (Math.abs(w) * a[k]) / max, t0: FIRE[l] + 50 + k * 22, t1: FIRE[l + 1] - 20 - rand() * 60 });
      }),
    );
  });
  return edges;
})();

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

interface Clock {
  start: number;
  exitStart: number | null;
  /** Screen position of the output neuron, where the brand mark blooms. */
  out: [number, number];
}

const STARS = 70;
const MOTES = 45;
/** Half the length of the network (world units): one layer every 1.2. */
const XH = 2.4;
const layerX = (l: number) => -XH + (l * 2 * XH) / (LAYERS.length - 1);
/** Points closer to the camera than this fade out, so nothing pops when the camera passes them. */
const NEAR = 0.45;

/**
 * Night scene: a network floating in the dark, filmed by a camera that travels along with the signal,
 * just behind it. The signal enters the inputs, then crosses the network layer by layer: pulses run
 * along the connections that carry it (cyan for positive weights, pink for negative ones) and each
 * neuron lights up as bright as its activation. Once the output fires the camera pulls back; on exit
 * every neuron flows into the output, where the brand mark takes over.
 */
function Network({ clock }: { clock: MutableRefObject<Clock> }) {
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

    // Deterministic scene: the same stars and depths on every visit.
    const rand = seeded(3);
    const stars = Array.from({ length: STARS }, () => ({ x: rand(), y: rand(), r: 0.3 + rand() * 0.9, phase: rand() * 6.28 }));
    const depth = LAYERS.map((n) => Array.from({ length: n }, () => ({ z: (rand() - 0.5) * 0.6, phase: rand() * 6.28 })));
    // Dust floating around the network: it drifts past the camera and makes the travel felt.
    const motes = Array.from({ length: MOTES }, () => ({ x: -XH - 2 + rand() * (2 * XH + 4), y: (rand() - 0.5) * 4.4, z: (rand() - 0.5) * 4, r: 0.5 + rand() }));
    const last = LAYERS.length - 1;

    let raf = 0;
    const frame = (now: number) => {
      const { start, exitStart } = clock.current;
      const elapsed = now - start;
      // The camera stops when the landing starts, so the mark blooms where the output is.
      const ct = exitStart === null ? elapsed : exitStart - start;
      const exitT = exitStart === null ? 0 : clamp01((now - exitStart) / EXIT_MS);
      const gather = easeIn(clamp01(exitT / 0.42));
      const fadeOut = 1 - exitT;

      // Tracking camera: close behind the signal, looking ahead along the network. It moves in while
      // the signal reaches the inputs, travels with it, then pulls back once the output has fired.
      // Where it looks, in layers: just ahead of the signal, easing in before the inputs and out at the output.
      const follow = smoothMin(smoothMax((ct - FIRE[0]) / STEP + 0.2, -0.6), last);
      const arrive = easeInOut(clamp01(ct / FIRE[0]));
      const settle = easeInOut(clamp01((ct - FIRE[last]) / (TOTAL - FIRE[last])));
      const D = 4.6 - 1.6 * arrive + 1.4 * settle;
      const yaw = 0.34 + 0.22 * arrive - 0.1 * settle + 0.03 * Math.sin((start + ct) / 1400);
      const pitch = 0.16 + 0.02 * Math.sin((start + ct) / 1700);
      const tx = layerX(follow) - 0.9 * settle;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const S = Math.min(0.36 * w, 0.3 * h);
      const GAP = 0.34 * Math.min(1.3, Math.max(1, h / w / 1.2));
      const size = Math.min(1.3, Math.max(0.75, S / 230));
      const cx = w / 2;
      const cy = h * 0.55;
      /** Screen x, screen y, perspective scale, and visibility (0 when too close to the camera). */
      const project = (x: number, y: number, z: number): [number, number, number, number] => {
        const x1 = x - tx;
        const xr = x1 * cosY - z * sinY;
        const zr = x1 * sinY + z * cosY;
        const yr = y * cosP + zr * sinP;
        const d = D - y * sinP + zr * cosP;
        const p = D / Math.max(d, 0.05);
        return [cx + xr * S * p, cy - yr * S * p, Math.min(p, 3.5), clamp01((d - NEAR) / 0.8)];
      };

      // Where every neuron is on screen this frame (flowing into the output during the landing).
      const pts = LAYERS.map((n, l) =>
        depth[l].map(({ z, phase }, i) => project(layerX(l), ((n - 1) / 2 - i) * GAP + 0.035 * Math.sin(now / 1100 + phase), z)),
      );
      const [ox, oy] = pts[last][0];
      if (exitStart === null) clock.current.out = [Math.min(w - 48, Math.max(48, ox)), Math.min(h - 48, Math.max(80, oy))];
      for (const layer of pts) for (const pt of layer) {
        pt[0] += (ox - pt[0]) * gather;
        pt[1] += (oy - pt[1]) * gather;
      }

      const appear = (l: number) => easeOut(clamp01((elapsed - 100 - l * 110) / 550));
      const fired = (l: number, a: number) => {
        const lit = a * easeOut(clamp01((elapsed - FIRE[l]) / 260));
        // Skipped early: the whole network lights up as it gathers.
        return exitStart === null ? lit : Math.max(lit, a * easeOut(clamp01(exitT / 0.18)));
      };

      // Night sky.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#07070d';
      ctx.fillRect(0, 0, w, h);
      // Far away, the stars barely move with the camera.
      const drift = follow * 14;
      for (const s of stars) {
        ctx.fillStyle = `rgba(226,232,255,${0.4 * (0.5 + 0.5 * Math.sin(now / 900 + s.phase)) * fadeOut})`;
        ctx.beginPath();
        ctx.arc((((s.x * w - drift * (0.4 + s.r)) % w) + w) % w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // A soft light travelling with the signal, violet at the inputs and cyan at the output.
      const wave = Math.min(last, Math.max(-0.6, (elapsed - FIRE[0]) / STEP));
      const [nx, ny] = project(layerX(wave), 0, 0);
      const nebula = ctx.createRadialGradient(nx, ny, 0, nx, ny, Math.max(w, h) * 0.42);
      const nc = mix(VIOLET, CYAN, clamp01(wave / last));
      nebula.addColorStop(0, `rgba(${nc},${0.15 * appear(0) * fadeOut})`);
      nebula.addColorStop(1, `rgba(${nc},0)`);
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      // Dust, close to the camera: it slides past faster than the network.
      for (const m of motes) {
        const [mx, my, mp, near] = project(m.x, m.y, m.z);
        if (near <= 0) continue;
        ctx.fillStyle = `rgba(216,200,255,${0.22 * near * appear(0) * fadeOut})`;
        ctx.beginPath();
        ctx.arc(mx, my, m.r * mp * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connections: faint at rest, glowing once the signal has gone through them.
      ctx.lineCap = 'round';
      for (const e of EDGES) {
        const [ax, ay, ap, an] = pts[e.l][e.k];
        const [bx, by, bp, bn] = pts[e.l + 1][e.j];
        const near = Math.min(an, bn);
        if (near <= 0) continue;
        const p = clamp01((elapsed - e.t0) / (e.t1 - e.t0));
        const lit = e.s > CARRIES ? p : 0;
        const a = (0.07 * Math.min(appear(e.l), appear(e.l + 1)) + 0.26 * e.s * lit) * (1 - gather) * near;
        ctx.strokeStyle = lit > 0 ? `rgba(${e.positive ? POSITIVE : NEGATIVE},${a})` : `rgba(167,139,250,${a})`;
        ctx.lineWidth = (0.7 + 0.8 * e.s * lit) * Math.min(2.5, (ap + bp) / 2);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Pulses: the signal on its way, a bright head with a fading tail.
      ctx.globalCompositeOperation = 'lighter';
      type Pt = [number, number, number, number];
      const pulse = ([ax, ay, ap, an]: Pt, [bx, by, bp, bn]: Pt, p: number, s: number, col: string) => {
        const near = Math.min(an, bn);
        if (near <= 0) return;
        const hx = ax + (bx - ax) * p;
        const hy = ay + (by - ay) * p;
        const tp = Math.max(0, p - 0.25);
        const tx = ax + (bx - ax) * tp;
        const ty = ay + (by - ay) * tp;
        const alpha = (0.4 + 0.6 * s) * (1 - gather) * near;
        // Closer to the camera, bigger.
        const k = Math.min(2.5, ap + (bp - ap) * p);
        const tail = ctx.createLinearGradient(tx, ty, hx, hy);
        tail.addColorStop(0, `rgba(${col},0)`);
        tail.addColorStop(1, `rgba(${col},${0.9 * alpha})`);
        ctx.strokeStyle = tail;
        ctx.lineWidth = (1 + 1.6 * s) * k;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();
        ctx.fillStyle = `rgba(${col},${0.18 * alpha})`;
        ctx.beginPath();
        ctx.arc(hx, hy, (4 + 3 * s) * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.95 * alpha})`;
        ctx.beginPath();
        ctx.arc(hx, hy, (1.2 + 1.3 * s) * k, 0, Math.PI * 2);
        ctx.fill();
      };
      // The input signal comes in from behind the camera, on the left.
      depth[0].forEach(({ z }, k) => {
        const t0 = 150 + k * 80;
        const p = easeInOut(clamp01((elapsed - t0) / (FIRE[0] - 30 - t0)));
        if (p <= 0 || p >= 1) return;
        pulse(project(layerX(0) - 1.6, ((LAYERS[0] - 1) / 2 - k) * GAP * 1.3, z), pts[0][k], p, INPUT[k], '216,180,254');
      });
      for (const e of EDGES) {
        if (e.s <= CARRIES) continue;
        const p = easeInOut(clamp01((elapsed - e.t0) / (e.t1 - e.t0)));
        if (p <= 0 || p >= 1) continue;
        pulse(pts[e.l][e.k], pts[e.l + 1][e.j], p, e.s, e.positive ? POSITIVE : NEGATIVE);
      }

      // Neurons: dark at rest, lit as bright as their activation when the signal arrives.
      pts.forEach((layer, l) =>
        layer.forEach(([x, y, persp, near], i) => {
          const isOut = l === last;
          const a = ACTIVATIONS[l][i];
          const col = isOut ? '165,243,252' : COLORS[l];
          const R = (isOut ? 7.5 : l === 0 ? 4 : 4.6) * size * persp;
          const vis = appear(l) * near * (isOut ? 1 - clamp01((exitT - 0.3) / 0.1) : 1 - gather * 0.9);
          if (vis <= 0) return;
          const fb = fired(l, a);
          if (fb > 0.01) {
            ctx.globalCompositeOperation = 'lighter';
            const glow = ctx.createRadialGradient(x, y, 0, x, y, R * (isOut ? 4 + 6 * fb : 2.5 + 4 * fb));
            glow.addColorStop(0, `rgba(${col},${0.55 * fb * vis})`);
            glow.addColorStop(1, `rgba(${col},0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, R * (isOut ? 10 : 6.5), 0, Math.PI * 2);
            ctx.fill();
            // One ring when the neuron fires.
            const q = (elapsed - FIRE[l]) / 700;
            if (q > 0 && q < 1) {
              ctx.strokeStyle = `rgba(${col},${0.5 * (1 - q) * (0.25 + 0.75 * a) * vis})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.arc(x, y, R + 22 * size * easeOut(q), 0, Math.PI * 2);
              ctx.stroke();
            }
          }
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(12,10,24,${vis})`;
          ctx.strokeStyle = `rgba(${col},${(0.3 + 0.6 * fb) * vis})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(x, y, R, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (fb > 0.01) {
            ctx.fillStyle = isOut ? `rgba(255,255,255,${fb * vis})` : `rgba(${mix(col.split(',').map(Number), [255, 255, 255], 0.5 * fb)},${fb * vis})`;
            ctx.beginPath();
            ctx.arc(x, y, R * 0.62, 0, Math.PI * 2);
            ctx.fill();
          }
        }),
      );

      // The value of the output once it has fired.
      const labels = 1 - clamp01(exitT / 0.2);
      ctx.textAlign = 'center';
      const shown = clamp01((elapsed - FIRE[last]) / 400);
      if (shown > 0) {
        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = `rgba(255,255,255,${shown * labels})`;
        ctx.fillText(`ŷ = ${OUTPUT.toFixed(3)}`, ox, oy - 26 * size - 8 * shown);
      }

      // The network has gathered into the output: a burst of light and one ring.
      if (exitStart !== null) {
        ctx.globalCompositeOperation = 'lighter';
        const burst = Math.exp(-(((exitT - 0.42) / 0.1) ** 2));
        const flash = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.min(w, h) * 0.35);
        flash.addColorStop(0, `rgba(165,243,252,${0.45 * burst})`);
        flash.addColorStop(1, 'rgba(165,243,252,0)');
        ctx.fillStyle = flash;
        ctx.fillRect(0, 0, w, h);
        const q = clamp01((exitT - 0.4) / 0.5);
        if (q > 0 && q < 1) {
          ctx.strokeStyle = `rgba(103,232,249,${0.45 * (1 - q) ** 1.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(ox, oy, 12 + easeOut(q) * Math.max(w, h) * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
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
 * The brand mark (itself a tiny network) blooming where the output neuron was, then flying to the
 * logo of the navigation bar and landing exactly on it: the real logo takes over when the intro unmounts.
 */
function Bloom({ from }: { from: [number, number] }) {
  const [flight] = useState(() => {
    const r = document.querySelector('[data-brand-logo]')?.getBoundingClientRect();
    if (!r || r.width === 0) return null;
    return { x: r.left + r.width / 2 - from[0], y: r.top + r.height / 2 - from[1], scale: r.width / BLOOM_SIZE };
  });
  return (
    <motion.div
      aria-hidden="true"
      style={{ left: from[0], top: from[1] }}
      className="pointer-events-none fixed -mt-12 -ml-12 size-24"
      initial={{ scale: 0, opacity: 0, rotate: -30, x: 0, y: 0 }}
      animate={
        flight
          ? { scale: [0, 0, 1.12, 1, 1, flight.scale], opacity: [0, 0, 1, 1, 1, 1], rotate: [-30, -30, 0, 0, 0, 0], x: [0, 0, 0, 0, 0, flight.x], y: [0, 0, 0, 0, 0, flight.y] }
          : { scale: [0, 0, 1.12, 1, 1.6], opacity: [0, 0, 1, 1, 0], rotate: [-30, -30, 0, 0, 0] }
      }
      transition={{ duration: EXIT_MS / 1000, times: flight ? [0, 0.22, 0.36, 0.44, 0.52, 1] : [0, 0.22, 0.36, 0.52, 1], ease: 'easeInOut' }}
    >
      <BrandMark />
    </motion.div>
  );
}

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-full drop-shadow-[0_0_30px_rgb(34_211_238/0.8)]">
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
 * Opening sequence, played once when a visitor lands on the home page: "Signal".
 * A signal crosses a small neural network, layer by layer, computed by a real forward pass; each
 * layer it reaches brings a greeting from a country I’ve travelled to. The output fires, the network
 * gathers into the brand mark and the mark flies to its place in the navigation bar, opening the site.
 * Click, Escape, Enter or Skip land early.
 */
export function Intro({ onReveal }: { onReveal: () => void }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(true);
  const [landing, setLanding] = useState<[number, number] | null>(null);
  const [stage, setStage] = useState(0);
  const done = useRef(false);
  const bar = useRef<HTMLDivElement>(null);
  const clock = useRef<Clock>({ start: performance.now(), exitStart: null, out: [window.innerWidth / 2, window.innerHeight / 2] });
  const words = lang === 'fr' ? ['Hello', ...GREETINGS, 'Bonjour'] : ['Bonjour', ...GREETINGS, 'Hello'];
  const leaving = landing !== null;

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    clock.current.exitStart = performance.now();
    if (bar.current) bar.current.style.transform = 'scaleX(1)';
    setLanding(clock.current.out);
    onReveal();
    window.setTimeout(() => setOpen(false), EXIT_MS);
  }, [onReveal]);

  // One clock drives the greetings, the readouts and the network.
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
      setStage(stageAt(elapsed));
      if (bar.current) bar.current.style.transform = `scaleX(${clamp01(elapsed / TOTAL)})`;
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
  const received = stage >= LAYERS.length || leaving;
  return (
    <div role="presentation" data-testid="intro" onClick={finish} className="fixed inset-0 z-[65] cursor-pointer text-white">
      <motion.div
        animate={{ opacity: leaving ? 0 : 1 }}
        // Fade out over the second half of the landing, once the network has gathered into the mark.
        transition={{ duration: (EXIT_MS * 0.45) / 1000, delay: leaving ? (EXIT_MS * 0.5) / 1000 : 0, ease: 'easeInOut' }}
        className="absolute inset-0 bg-ink"
      >
        <Network clock={clock} />

        {/* Greeting: one per layer reached by the signal. */}
        <motion.div
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? -20 : 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute inset-x-0 top-[13%] flex justify-center px-6"
        >
          <p className="flex items-center gap-4 text-5xl font-semibold tracking-tight sm:text-7xl" aria-live="off">
            <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_4px_rgb(34_211_238/0.7)] sm:size-4" />
            <motion.span
              key={stage}
              initial={{ y: -14, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: stage === 0 ? 0.6 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`pb-2 drop-shadow-[0_0_24px_rgb(0_0_0/0.9)] ${stage === words.length - 1 ? 'text-shine' : ''}`}
            >
              {words[stage]}
            </motion.span>
          </p>
        </motion.div>

        {/* Readouts */}
        <motion.div animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.3 }} className="pointer-events-none">
          <div className="absolute top-5 left-5 font-mono text-[11px] leading-relaxed text-zinc-400 sm:top-8 sm:left-10">
            <p className="tracking-[0.25em] text-cyan-300 uppercase">→ {t('intro.method')}</p>
            <p className="mt-1 text-zinc-200">a[l] = σ(W[l]·a[l−1] + b[l])</p>
            <p>σ(z) = 1 / (1 + e⁻ᶻ)</p>
          </div>
          <div className="absolute bottom-7 left-5 font-mono text-xs text-zinc-400 sm:bottom-10 sm:left-10">
            <p className={received ? 'text-emerald-300' : ''}>
              {received ? `✓ ${t('intro.received')}` : `${t('intro.layer')} ${Math.max(0, stage - 1)}/${LAYERS.length - 1}`}
            </p>
            <p className="mt-1 tracking-[0.25em] uppercase">Robin Canovas · Portfolio</p>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/10">
            <div
              ref={bar}
              className="h-full origin-left bg-gradient-to-r from-violet-400 to-cyan-400 shadow-[0_0_12px_rgb(34_211_238)]"
              style={{ transform: 'scaleX(0)' }}
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

      {/* The mark blooms where the output neuron was, then lands on the navigation logo (outside the fading layer). */}
      {landing && <Bloom from={landing} />}
    </div>
  );
}
