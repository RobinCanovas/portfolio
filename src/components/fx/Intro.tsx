import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLang } from '../../i18n';

/** True while the home page may play its entrance animations (false while the intro covers it). */
export const IntroContext = createContext(true);
export const useRevealed = () => useContext(IntroContext);

/**
 * The intro plays each time the site is opened on the home page (not when navigating inside it, nor
 * when landing on a detail page). It is only fades and lines drawing themselves, so it also plays with
 * reduced motion; it can always be skipped.
 */
export function shouldPlayIntro(): boolean {
  const hash = window.location.hash;
  if (hash && hash !== '#' && hash !== '#home') return false;
  // Opt-out flag, set by the tests and screenshot scripts only.
  try {
    return !window.sessionStorage.getItem('portfolio-no-intro');
  } catch {
    return true;
  }
}

/* ------------------------------------------------------------------ */
/* Timeline (ms from the start of the drawing)                         */
/* ------------------------------------------------------------------ */

/** The figure draws itself: facets, hidden layer, output, then the name is written. */
export const BUILD_MS = 3300;
/** The figure fades and the name glides into the home title. */
export const HANDOFF_MS = 720;
/** Never wait longer than this for the title's web font. */
const FONT_WAIT_MS = 600;

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const INK = '#1b1915';
const ACCENT = '#b23c1c';
const BLUE = '#2c4f7c';
const CARD = '#fbfaf6';

/** Deterministic weight in [-1, 1] for the edge i → j. */
const weight = (i: number, j: number) => {
  const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

interface Layout {
  w: number;
  h: number;
  mobile: boolean;
  inputs: { x: number; y: number }[];
  hidden: { x: number; y: number }[];
  out: { x: number; y: number };
  caption: { x: number; y: number };
  /** Where the name is written, and the scale it is written at (relative to the home title). */
  name: { x: number; y: number; scale: number; font: number };
}

const TITLE_SELECTOR = '[data-hero-name]';

function measure(title: HTMLElement | null, count: number): Layout | null {
  if (!title) return null;
  const r = title.getBoundingClientRect();
  const font = parseFloat(getComputedStyle(title).fontSize) || 96;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!r.width || !w || !h) return null;
  const mobile = w < 768;
  const pad = mobile ? 20 : 32;
  const content = Math.min(w - 2 * pad, 1080);
  const left = (w - content) / 2;
  const hiddenCount = 5;

  if (mobile) {
    const scale = Math.min(1, (content * 0.92) / r.width);
    const netH = Math.min(h * 0.4, 300);
    const top = Math.max(96, h * 0.2);
    const x0 = left + 122;
    const x2 = left + content - 10;
    const outY = top + netH / 2;
    return {
      w,
      h,
      mobile,
      inputs: Array.from({ length: count }, (_, i) => ({ x: x0, y: top + (i * netH) / (count - 1) })),
      hidden: Array.from({ length: hiddenCount }, (_, i) => ({ x: (x0 + x2) / 2, y: outY + (i - (hiddenCount - 1) / 2) * (netH / 5.2) })),
      out: { x: x2, y: outY },
      caption: { x: left, y: top - 52 },
      name: { x: (w - r.width * scale) / 2, y: top + netH + 44, scale, font },
    };
  }

  const nameW = Math.min(r.width, content * 0.44);
  const scale = nameW / r.width;
  const netH = Math.min(h * 0.54, 420);
  const top = (h - netH) / 2 + 16;
  const x0 = left + 178;
  const x2 = left + content - nameW - 44;
  const outY = top + netH / 2;
  return {
    w,
    h,
    mobile,
    inputs: Array.from({ length: count }, (_, i) => ({ x: x0, y: top + (i * netH) / (count - 1) })),
    hidden: Array.from({ length: hiddenCount }, (_, i) => ({ x: (x0 + x2) / 2, y: outY + (i - (hiddenCount - 1) / 2) * (netH / 5) })),
    out: { x: x2, y: outY },
    caption: { x: left, y: top - 64 },
    name: { x: x2 + 30, y: outY - (r.height * scale) / 2, scale, font },
  };
}

type Stage = 'wait' | 'build' | 'handoff';

/**
 * Opening sequence, played once when a visitor lands on the home page: "Fig. 1 — what I'm made of".
 * A small neural network draws itself on the paper. Its inputs are the things that make me (maths,
 * code, AI, strategy, scouting, volleyball, piano, travel), a signal runs through the hidden layer,
 * and the output writes my name. The figure then fades and the name glides into the home title.
 * Click, scroll, Escape, Enter, Space or Skip fast-forward.
 */
export function Intro({ onReveal }: { onReveal: () => void }) {
  const { t } = useLang();
  const facets = t('intro.facets').split('|');
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState<Stage>('wait');
  const [layout, setLayout] = useState<Layout | null>(null);
  const [glide, setGlide] = useState<string | null>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const skipRequest = useRef<() => void>(() => undefined);
  const revealRef = useRef(onReveal);
  useEffect(() => {
    revealRef.current = onReveal;
  }, [onReveal]);
  const skip = useCallback(() => skipRequest.current(), []);
  const count = facets.length;

  useEffect(() => {
    window.scrollTo(0, 0);
    const title = document.querySelector<HTMLElement>(TITLE_SELECTOR);
    // The real title waits, invisible, for the written name to land on it.
    title?.style.setProperty('opacity', '0');
    const html = document.documentElement;
    const overflow = html.style.overflow;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    let stageNow: Stage = 'wait';
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      timers.forEach((id) => window.clearTimeout(id));
      title?.style.removeProperty('opacity');
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

    const handoff = () => {
      if (stageNow === 'handoff') return;
      stageNow = 'handoff';
      setStage('handoff');
      revealRef.current();
      // FLIP: the written name travels onto the real title, which then takes over in place.
      const from = nameRef.current?.getBoundingClientRect();
      const to = title?.getBoundingClientRect();
      if (from && to && from.width) {
        const k = to.width / from.width;
        setGlide(`translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${k})`);
        later(finish, HANDOFF_MS + 60);
      } else {
        later(finish, 380);
      }
    };
    skipRequest.current = handoff;

    const start = () => {
      // Released already (React dev mode mounts effects twice): the font promise must not restart it.
      if (released || stageNow !== 'wait') return;
      const l = measure(title, count);
      // Nothing to draw (no title on screen): open the page straight away.
      if (!l) {
        stageNow = 'build';
        later(handoff, 200);
        return;
      }
      setLayout(l);
      stageNow = 'build';
      // One frame with everything at rest, then the transitions run.
      later(() => setStage('build'), 40);
      later(handoff, BUILD_MS);
    };
    const fonts = document.fonts;
    if (title && fonts?.ready) {
      later(start, FONT_WAIT_MS);
      fonts.ready.then(start, start);
    } else {
      start();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skipRequest.current();
      }
    };
    const onWheel = () => skipRequest.current();
    const onResize = () => skipRequest.current();
    html.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onWheel, { passive: true });
    window.addEventListener('resize', onResize);
    return release;
  }, [count]);

  if (!open) return null;
  const built = stage !== 'wait';
  const gone = stage === 'handoff';

  /** A transition that waits for its turn in the drawing (immediate once skipped). */
  const at = (delay: number, duration = 500, props = 'opacity'): CSSProperties => ({
    transition: props
      .split(',')
      .map((p) => `${p.trim()} ${gone ? Math.min(duration, 380) : duration}ms ${EASE} ${gone ? 0 : delay}ms`)
      .join(', '),
  });

  const L = layout;
  return (
    <div role="presentation" data-testid="intro" onClick={skip} className="fixed inset-0 z-[65] cursor-pointer" style={{ pointerEvents: gone ? 'none' : undefined }}>
      {/* The intro sits on the same paper as the page: when it fades, nothing changes but the figure. */}
      <div aria-hidden="true" className="absolute inset-0 bg-paper" style={{ opacity: gone ? 0 : 1, transition: `opacity 560ms ${EASE} 120ms` }} />

      {L && (
        <div aria-hidden="true" className="absolute inset-0" style={{ opacity: gone ? 0 : 1, transition: `opacity 380ms ${EASE}` }}>
          <p
            className="absolute flex items-baseline gap-3 whitespace-nowrap"
            style={{ left: L.caption.x, top: L.caption.y, opacity: built ? 1 : 0, ...at(0, 700) }}
          >
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink-3 uppercase">{t('intro.fig')}</span>
            <span className="font-serif text-xl text-ink-2 italic sm:text-2xl">{t('intro.caption')}</span>
          </p>

          <svg className="absolute inset-0" width={L.w} height={L.h} viewBox={`0 0 ${L.w} ${L.h}`}>
            {/* Input → hidden: every facet feeds every unit. */}
            {L.inputs.map((a, i) =>
              L.hidden.map((b, j) => {
                const wt = weight(i, j);
                const strong = Math.abs(wt) > 0.62;
                return (
                  <line
                    key={`a${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    pathLength={1}
                    strokeDasharray="1 1"
                    stroke={strong ? (wt > 0 ? ACCENT : BLUE) : INK}
                    strokeOpacity={strong ? 0.55 : 0.12 + Math.abs(wt) * 0.12}
                    strokeWidth={strong ? 1.3 : 1}
                    style={{ strokeDashoffset: built ? 0 : 1, ...at(520 + i * 70 + j * 30, 700, 'stroke-dashoffset') }}
                  />
                );
              }),
            )}
            {/* Hidden → output. */}
            {L.hidden.map((b, j) => (
              <line
                key={`b${j}`}
                x1={b.x}
                y1={b.y}
                x2={L.out.x}
                y2={L.out.y}
                pathLength={1}
                strokeDasharray="1 1"
                stroke={j % 2 ? INK : ACCENT}
                strokeOpacity={j % 2 ? 0.3 : 0.6}
                strokeWidth={1.3}
                style={{ strokeDashoffset: built ? 0 : 1, ...at(1500 + j * 50, 600, 'stroke-dashoffset') }}
              />
            ))}
            {/* Output → the name. */}
            {!L.mobile && (
              <line
                x1={L.out.x + 9}
                y1={L.out.y}
                x2={L.name.x - 10}
                y2={L.out.y}
                pathLength={1}
                strokeDasharray="1 1"
                stroke={ACCENT}
                strokeWidth={1.3}
                style={{ strokeDashoffset: built ? 0 : 1, ...at(2050, 300, 'stroke-dashoffset') }}
              />
            )}

            {/* The signal: one pulse per facet, crossing to the hidden unit it weighs most on. */}
            {built &&
              !gone &&
              L.inputs.map((a, i) => {
                const j = L.hidden.reduce((best, _, k) => (Math.abs(weight(i, k)) > Math.abs(weight(i, best)) ? k : best), 0);
                const b = L.hidden[j];
                return (
                  <circle
                    key={`p${i}`}
                    r={2.6}
                    fill={ACCENT}
                    className="intro-pulse"
                    style={
                      {
                        '--x0': `${a.x}px`,
                        '--y0': `${a.y}px`,
                        '--x1': `${b.x}px`,
                        '--y1': `${b.y}px`,
                        animationDelay: `${1150 + i * 60}ms`,
                      } as CSSProperties
                    }
                  />
                );
              })}
            {built &&
              !gone &&
              L.hidden.map((b, j) => (
                <circle
                  key={`q${j}`}
                  r={2.6}
                  fill={ACCENT}
                  className="intro-pulse"
                  style={
                    {
                      '--x0': `${b.x}px`,
                      '--y0': `${b.y}px`,
                      '--x1': `${L.out.x}px`,
                      '--y1': `${L.out.y}px`,
                      animationDelay: `${1780 + j * 40}ms`,
                    } as CSSProperties
                  }
                />
              ))}

            {/* Nodes. */}
            {L.inputs.map((a, i) => (
              <g key={`n${i}`} style={{ opacity: built ? 1 : 0, ...at(i * 70, 500) }}>
                <circle cx={a.x} cy={a.y} r={4.5} fill={CARD} stroke={INK} strokeWidth={1.2} />
                <circle cx={a.x} cy={a.y} r={2.4} fill={INK} style={{ opacity: built ? 1 : 0, ...at(1150 + i * 60, 250) }} />
                <text
                  x={a.x - 16}
                  y={a.y}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="font-serif italic"
                  fontSize={L.mobile ? 15 : 19}
                  fill="#48443c"
                >
                  {facets[i]}
                </text>
              </g>
            ))}
            {L.hidden.map((b, j) => (
              <g key={`h${j}`} style={{ opacity: built ? 1 : 0, ...at(900 + j * 60, 450) }}>
                <circle cx={b.x} cy={b.y} r={5.5} fill={CARD} stroke={INK} strokeWidth={1.2} />
                <circle cx={b.x} cy={b.y} r={3} fill={INK} style={{ opacity: built ? 1 : 0, ...at(1500 + j * 50, 250) }} />
              </g>
            ))}
            <g style={{ opacity: built ? 1 : 0, ...at(1500, 450) }}>
              <circle cx={L.out.x} cy={L.out.y} r={8} fill={CARD} stroke={INK} strokeWidth={1.3} />
              <circle cx={L.out.x} cy={L.out.y} r={4.5} fill={ACCENT} style={{ opacity: built ? 1 : 0, ...at(2000, 250) }} />
            </g>
          </svg>
        </div>
      )}

      {L && (
        <span
          ref={nameRef}
          aria-hidden="true"
          className="absolute inline-block font-serif whitespace-nowrap text-ink"
          style={{
            left: L.name.x,
            top: L.name.y,
            fontSize: L.name.font * L.name.scale,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            transformOrigin: '0 0',
            transform: glide ?? 'none',
            clipPath: built ? 'inset(-10% -2% -20% 0)' : 'inset(-10% 100% -20% 0)',
            transition: glide
              ? `transform ${HANDOFF_MS}ms ${EASE}, clip-path 200ms linear`
              : `clip-path 900ms cubic-bezier(0.45, 0, 0.25, 1) ${gone ? 0 : 2150}ms`,
          }}
        >
          {document.querySelector(TITLE_SELECTOR)?.textContent}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        style={{ opacity: built && !gone ? 1 : 0, transition: `opacity 400ms ${EASE} ${gone ? 0 : 500}ms` }}
        className="absolute top-5 right-5 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-widest text-ink-3 uppercase hover:text-ink focus-visible:opacity-100 sm:top-7 sm:right-8"
      >
        {t('intro.skip')}
      </button>
    </div>
  );
}
