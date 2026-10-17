import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n';
import { seeded } from '../../lib/neural';

const SEEN_KEY = 'portfolio-intro';

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
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

/** Scattered points drift on their own for a moment: raw data. */
export const DRIFT_MS = 300;
/** They gather into the name while the noise fades out, like a model denoising its output. */
export const GATHER_MS = 1400;
/** The points hand over to the real title, and the page appears around it. */
export const HANDOFF_MS = 640;
/** Share of the handoff spent uncovering the title itself; the rest of the page follows more calmly. */
const UNCOVER = 0.2;
/** A skip fast-forwards whatever is left of the gathering. */
const SKIP_MS = 300;
/** Longest wait for the web font, so the points draw the title in the font it will be shown in. */
const FONT_WAIT_MS = 1200;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',');
const gauss = (rand: () => number) => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());

/** Data points start a neutral grey, and end in the colours of the title (the `text-shine` gradient). */
const NEUTRAL = [196, 198, 222];
const TITLE_STOPS: [number, number[]][] = [
  [0, [221, 214, 254]],
  [0.5, [196, 181, 253]],
  [1, [186, 230, 253]],
];

/* ------------------------------------------------------------------ */
/* Where the title is: sampled from the real layout                    */
/* ------------------------------------------------------------------ */

interface Title {
  /** Points on the letters, x and y interleaved, in viewport pixels. */
  points: Float32Array;
  /** Box around the letters. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Font size and distance between neighbouring points (px). */
  size: number;
  step: number;
}

/**
 * Draws the home title off screen, one glyph at the exact position the layout gives it (wrapping,
 * kerning and letter-spacing included), and keeps the points of a jittered grid that fall on ink.
 */
export function sampleTitle(el: HTMLElement): Title | null {
  const style = getComputedStyle(el);
  const size = parseFloat(style.fontSize);
  if (!size) return null;
  const range = document.createRange();
  if (typeof range.getBoundingClientRect !== 'function') return null;
  const glyphs: { ch: string; x: number; top: number; h: number; right: number }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? '';
    for (let i = 0; i < text.length; i++) {
      if (!text[i].trim()) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      if (r.width > 0) glyphs.push({ ch: text[i], x: r.left, top: r.top, h: r.height, right: r.right });
    }
  }
  if (!glyphs.length) return null;

  const pad = Math.ceil(size * 0.25);
  const left = Math.floor(Math.min(...glyphs.map((g) => g.x))) - pad;
  const top = Math.floor(Math.min(...glyphs.map((g) => g.top))) - pad;
  const W = Math.ceil(Math.max(...glyphs.map((g) => g.right))) + pad - left;
  const H = Math.ceil(Math.max(...glyphs.map((g) => g.top + g.h))) + pad - top;
  // Twice the resolution, so thin strokes are sampled where they really are.
  const k = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * k;
  canvas.height = H * k;
  const g = canvas.getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  g.scale(k, k);
  g.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  g.textBaseline = 'alphabetic';
  g.fillStyle = '#fff';
  const metrics = g.measureText('Hg');
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  for (const glyph of glyphs) {
    // A glyph box is the font's content area: the baseline sits one ascent below its top.
    const baseline = ascent && descent ? glyph.top + (glyph.h - ascent - descent) / 2 + ascent : glyph.top + glyph.h * 0.8;
    g.fillText(glyph.ch, glyph.x - left, baseline - top);
  }
  const { data } = g.getImageData(0, 0, canvas.width, canvas.height);

  const step = Math.min(3.4, Math.max(2.1, size / 26));
  const rand = seeded(7);
  const points: number[] = [];
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      // A little jitter, so the stipple never looks like a screen grid.
      const jx = x + (rand() - 0.5) * step * 0.55;
      const jy = y + (rand() - 0.5) * step * 0.55;
      const px = Math.round(jx * k);
      const py = Math.round(jy * k);
      if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;
      if (data[(py * canvas.width + px) * 4 + 3] > 140) points.push(left + jx, top + jy);
    }
  }
  if (!points.length) return null;
  return { points: Float32Array.from(points), x: left + pad, y: top + pad, w: W - 2 * pad, h: H - 2 * pad, size, step };
}

/* ------------------------------------------------------------------ */
/* The points                                                          */
/* ------------------------------------------------------------------ */

const FIELDS = ['sx', 'sy', 'tx', 'ty', 'nx', 'ny', 'delay', 'span', 'phase', 'freq', 'amp', 'shade'] as const;
type Cloud = Record<(typeof FIELDS)[number], Float32Array> & {
  total: number;
  /** The first `letters` points end on a letter; the others are noise that fades away. 0 until aimed. */
  letters: number;
  /** Noise level at the start of the gathering (px). */
  sigma: number;
};

/**
 * Raw data: a few clusters of points of different shapes, like a real two-dimensional dataset, plus
 * scattered outliers. Each point drifts slowly on its own until the cloud is aimed at the title.
 */
function makeCloud(total: number, w: number, h: number): Cloud {
  const rand = seeded(2027);
  const c = { total, letters: 0, sigma: 0 } as Cloud;
  for (const f of FIELDS) c[f] = new Float32Array(total);
  const unit = Math.min(w, h);
  const clusters = Array.from({ length: 6 }, (_, k) => ({
    // Spread over the screen: one cluster per cell of a loose 3 × 2 grid.
    x: w * ((k % 3) / 3 + 0.05 + rand() * 0.23),
    y: h * (k < 3 ? 0.12 + rand() * 0.3 : 0.55 + rand() * 0.3),
    rx: unit * (0.05 + rand() * 0.09),
    ry: unit * (0.035 + rand() * 0.06),
    angle: rand() * Math.PI,
  }));
  for (let i = 0; i < total; i++) {
    if (rand() < 0.2) {
      c.sx[i] = rand() * w;
      c.sy[i] = rand() * h;
    } else {
      const k = clusters[Math.floor(rand() * clusters.length)];
      const a = gauss(rand) * k.rx;
      const b = gauss(rand) * k.ry;
      c.sx[i] = k.x + a * Math.cos(k.angle) - b * Math.sin(k.angle);
      c.sy[i] = k.y + a * Math.sin(k.angle) + b * Math.cos(k.angle);
    }
    c.tx[i] = c.sx[i];
    c.ty[i] = c.sy[i];
    c.nx[i] = gauss(rand);
    c.ny[i] = gauss(rand) * 0.8;
    // Everyone has arrived (blurry) by about 80 % of the gathering; the rest is sharpening.
    c.delay[i] = rand() * 0.26;
    c.span[i] = 0.42 + rand() * 0.14;
    c.phase[i] = rand() * Math.PI * 2;
    c.freq[i] = 0.5 + rand() * 0.9;
    c.amp[i] = 4 + rand() * 8;
    // One of three slightly different shades, for depth.
    c.shade[i] = i % 3;
  }
  return c;
}

/**
 * Gives every point its place: most of them a point of the title, paired in left-to-right order (with
 * some shuffle) so the clusters stream into the letters closest to them instead of crossing the
 * screen; the rest are noise that settles loosely around the name before vanishing.
 */
function aim(c: Cloud, title: Title, w: number) {
  const rand = seeded(11);
  const available = title.points.length / 2;
  const letters = Math.min(available, Math.round(c.total * 0.8));
  // Which points become letters: a random subset, sorted by where they are (with some shuffle).
  const ids = Array.from({ length: c.total }, (_, i) => i);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const chosen = ids
    .slice(0, letters)
    .map((i) => ({ i, key: c.sx[i] + gauss(rand) * w * 0.12 }))
    .sort((a, b) => a.key - b.key)
    .map(({ i }) => i);
  const order = [...chosen, ...ids.slice(letters)];
  // Title points, left to right (evenly thinned out if there are more of them than letter points).
  const targets = Array.from({ length: letters }, (_, r) => Math.floor((r * available) / letters)).sort(
    (a, b) => title.points[2 * a] - title.points[2 * b],
  );

  // Reorder every field so letters come first.
  for (const f of FIELDS) c[f] = Float32Array.from(order, (i) => c[f][i]);
  for (let r = 0; r < c.total; r++) {
    if (r < letters) {
      c.tx[r] = title.points[2 * targets[r]];
      c.ty[r] = title.points[2 * targets[r] + 1];
    } else {
      c.tx[r] = title.x + title.w * (rand() * 1.3 - 0.15);
      c.ty[r] = title.y + title.h * (rand() * 2 - 0.5);
      c.nx[r] *= 1.8;
      c.ny[r] *= 1.8;
    }
  }
  c.letters = letters;
  c.sigma = title.size * 0.55;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const TITLE_SELECTOR = '[data-hero-name]';

/**
 * Opening sequence, played once when a visitor lands on the home page: the name, born from data.
 * Clusters of points scattered over the screen gather into "Robin Canovas" exactly where the home
 * title sits, blurry at first, then sharper and sharper as the noise fades out. The real title takes
 * over in place and the page appears around it. Click, scroll, Escape, Enter, Space or Skip fast-forward.
 */
export function Intro({ onReveal }: { onReveal: () => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const skipRequest = useRef<() => void>(() => undefined);
  const revealRef = useRef(onReveal);
  useEffect(() => {
    revealRef.current = onReveal;
  }, [onReveal]);

  const skip = useCallback(() => skipRequest.current(), []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the intro may play again, no harm */
    }
    window.scrollTo(0, 0);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d') ?? null;
    const titleEl = document.querySelector<HTMLElement>(TITLE_SELECTOR);
    // The real title waits, invisible, for the points to hand it over.
    titleEl?.style.setProperty('opacity', '0');
    const html = document.documentElement;
    const overflow = html.style.overflow;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      if (canvas && ctx) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    resize();

    // The cloud appears at once, sized on the title as it is laid out now (maybe in a fallback font);
    // it is aimed once the web font is there, so the points land on the letters the visitor will see.
    let title = ctx && titleEl ? sampleTitle(titleEl) : null;
    const cloud = title ? makeCloud(Math.round((title.points.length / 2) * 1.35), w, h) : null;

    // Virtual clock: it advances with the frames, so a hidden tab or a long frame pauses the intro instead of skipping it.
    let clock = 0;
    let last: number | null = null;
    let ready = false;
    let gatherAt: number | null = null;
    let skipAt: number | null = null;
    let skipFrom = 0;
    let handoffAt: number | null = null;
    let raf = 0;
    let doneTimer = 0;
    let fontWait = 0;

    // Everything the intro holds (frames, timers, listeners, the page scroll), released once.
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fontWait);
      window.clearTimeout(doneTimer);
      titleEl?.style.removeProperty('opacity');
      html.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onWheel);
      window.removeEventListener('resize', onResize);
    };
    const finish = () => {
      release();
      setOpen(false);
    };
    const startHandoff = () => {
      handoffAt = clock;
      // Under the veil, exactly beneath its points: it shows through as the veil opens.
      titleEl?.style.removeProperty('opacity');
      if (root.current) root.current.style.pointerEvents = 'none';
      revealRef.current();
      // Safety net if frames stop (background tab): the page is never left behind the veil.
      doneTimer = window.setTimeout(finish, HANDOFF_MS + 600);
    };
    skipRequest.current = () => {
      if (handoffAt !== null || skipAt !== null) return;
      skipAt = clock;
      skipFrom = gatherAt === null ? 0 : clamp01((clock - gatherAt) / GATHER_MS);
    };

    const settle = () => {
      if (ready) return;
      ready = true;
      const final = titleEl ? sampleTitle(titleEl) : null;
      if (final) title = final;
      if (cloud && title) aim(cloud, title, w);
      // Nothing to draw (no title on screen, no canvas): open the page straight away.
      else skipRequest.current();
    };
    // Wait for the title's web font, never longer than FONT_WAIT_MS.
    const fonts = document.fonts;
    fontWait = window.setTimeout(settle, FONT_WAIT_MS);
    if (cloud && titleEl && fonts?.load) {
      const s = getComputedStyle(titleEl);
      fonts
        .load(`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`, titleEl.textContent ?? undefined)
        .then(() => fonts.ready)
        .catch(() => undefined)
        .then(settle);
    } else {
      settle();
    }

    /** Progress of the gathering, 0 to 1. */
    const progress = () => {
      if (gatherAt === null) return 0;
      const u = clamp01((clock - gatherAt) / GATHER_MS);
      if (skipAt === null) return u;
      return Math.max(u, skipFrom + (1 - skipFrom) * easeOut(clamp01((clock - Math.max(skipAt, gatherAt)) / SKIP_MS)));
    };

    const frame = (now: number) => {
      clock += last === null ? 0 : Math.min(64, now - last);
      last = now;
      if (gatherAt === null && ready && (clock >= DRIFT_MS || skipAt !== null)) gatherAt = clock;
      const u = progress();
      if (handoffAt === null && gatherAt !== null && u >= 1) startHandoff();
      const hand = handoffAt === null ? 0 : clamp01((clock - handoffAt) / HANDOFF_MS);

      // The page appears from the title outwards, through a soft-edged hole in the veil: it uncovers the
      // title first, quickly, while its points fade, then widens more calmly to the edges.
      if (veil.current && handoffAt !== null) {
        const cx = title ? title.x + title.w / 2 : w / 2;
        const cy = title ? title.y + title.h / 2 : h / 2;
        const far = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
        const soft = far * 0.4;
        const near = title ? Math.hypot(title.w / 2, title.h / 2) + 24 : 0;
        const r = hand < UNCOVER ? -soft + easeOut(hand / UNCOVER) * (near + soft) : near + easeInOut((hand - UNCOVER) / (1 - UNCOVER)) * (far - near);
        const mask = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, #000 ${r + soft}px)`;
        veil.current.style.setProperty('-webkit-mask-image', mask);
        veil.current.style.setProperty('mask-image', mask);
      }
      if (skipRef.current) skipRef.current.style.opacity = String(clamp01((clock - 500) / 400) * (1 - clamp01(hand * 7)));

      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        if (cloud && title) draw(ctx, cloud, title, clock, u, hand);
      }
      if (hand >= 1) finish();
      else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skipRequest.current();
      }
    };
    const onWheel = () => skipRequest.current();
    // Resizing moves the title away from the points: go straight to the page.
    const onResize = () => {
      resize();
      if (handoffAt !== null) return;
      if (cloud) cloud.total = 0;
      ready = true;
      skipRequest.current();
    };
    html.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onWheel, { passive: true });
    window.addEventListener('resize', onResize);
    return release;
  }, []);

  if (!open) return null;
  return (
    <div ref={root} role="presentation" data-testid="intro" onClick={skip} className="fixed inset-0 z-[65] cursor-pointer">
      <div ref={veil} aria-hidden="true" className="absolute inset-0 bg-ink" />
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      <button
        ref={skipRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        style={{ opacity: 0 }}
        className="absolute top-5 right-5 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-widest text-zinc-400 uppercase transition-colors hover:text-white focus-visible:opacity-100 sm:top-7 sm:right-8"
      >
        {t('intro.skip')}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const TAU = Math.PI * 2;

/**
 * One frame of the cloud. Point i sits at
 *   target + (start + drift − target)·f + σ(u)·noise·(1 − f)
 * where f falls from 1 to 0 as it travels, and σ shrinks to zero: the cloud first folds into a blurry
 * band shaped like the name, then the letters sharpen.
 */
function draw(ctx: CanvasRenderingContext2D, c: Cloud, title: Title, clock: number, u: number, hand: number) {
  const seconds = clock / 1000;
  const fadeIn = easeOut(clamp01(clock / 260));
  const sigma = c.sigma * (1 - u) ** 1.6;
  const shown = easeOut(u);
  // The real title shows through the veil right away: the points step aside within a quarter second.
  const out = 1 - easeIn(clamp01((hand - 0.04) / 0.42));
  // Points grow from data dots to the size where the letters look solid.
  const rLetter = 1.1 + (title.step * 0.6 - 1.1) * smoothstep(0.45, 1, u);

  // Position of point i, written to px / py (no allocation: this runs for every point, every frame).
  let px = 0;
  let py = 0;
  const travel = (i: number) => {
    const v = clamp01((u - c.delay[i]) / c.span[i]);
    const f = 1 - easeInOutQuad(v);
    // Each noise offset slowly turns, so the cloud never looks frozen while it sharpens.
    const turn = c.phase[i] + seconds * (c.freq[i] - 0.95);
    const cos = Math.cos(turn);
    const sin = Math.sin(turn);
    const blur = sigma * (1 - f);
    const dx = Math.sin(seconds * c.freq[i] * 1.7 + c.phase[i]) * c.amp[i];
    const dy = Math.cos(seconds * c.freq[i] * 1.3 + c.phase[i] * 1.3) * c.amp[i];
    px = c.tx[i] + (c.sx[i] + dx - c.tx[i]) * f + (c.nx[i] * cos - c.ny[i] * sin) * blur;
    py = c.ty[i] + (c.sy[i] + dy - c.ty[i]) * f + (c.nx[i] * sin + c.ny[i] * cos) * blur;
  };

  // Three slightly different shades for depth, which merge as the name forms.
  const tint = smoothstep(0.3, 0.95, u);
  const gradient = ctx.createLinearGradient(title.x, 0, title.x + title.w, 0);
  for (const [offset, color] of TITLE_STOPS) gradient.addColorStop(offset, `rgb(${mix(NEUTRAL, color, tint)})`);
  const noiseColor = `rgb(${NEUTRAL.join(',')})`;
  for (let shade = 0; shade < 3; shade++) {
    const dim = 1 - shade * 0.15 * (1 - shown);
    // Noise: it follows the cloud, then fades out as the name sharpens.
    const noiseAlpha = 0.62 * fadeIn * (1 - u) ** 1.3 * dim;
    if (noiseAlpha > 0.004) {
      ctx.globalAlpha = noiseAlpha;
      ctx.fillStyle = noiseColor;
      ctx.beginPath();
      for (let i = c.letters; i < c.total; i++) {
        if (c.shade[i] !== shade) continue;
        travel(i);
        ctx.moveTo(px + 1.1, py);
        ctx.arc(px, py, 1.1, 0, TAU);
      }
      ctx.fill();
    }
    // Letters, in one gradient with the colours of the title.
    if (c.letters) {
      ctx.globalAlpha = fadeIn * out * (0.62 + 0.38 * shown) * dim;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i < c.letters; i++) {
        if (c.shade[i] !== shade) continue;
        travel(i);
        ctx.moveTo(px + rLetter, py);
        ctx.arc(px, py, rLetter, 0, TAU);
      }
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
