import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useInView } from 'framer-motion';

/**
 * Hand-drawn SVG illustrations, one per project, on a 320×160 canvas. They are decorative (aria-hidden).
 *
 * Each one tells what its project does in a short sequence, the first time it scrolls into view and
 * again on hover: a code gets typed, a release goes through the pipeline, a signal crosses the
 * network… At rest it stays still. The motion is plain CSS (see "Project stories" in index.css):
 * story parts get their timing from `st()`, one-off details from `ev()`.
 */

/* Printed on paper: ink line work, with the site's few colours (vermilion, blue, green, ochre) as spot inks. */
const INK = '#1b1915';
const V = INK;
const VL = '#48443c';
const C = '#2c4f7c';
const F = '#b23c1c';
const E = '#2e6b45';
const A = '#8c6418';
const LINE = 'rgb(27 25 21 / 0.3)';
const PANEL = '#fbfaf6';
const GROUND = '#f1ede4';
const MONO = 'JetBrains Mono, monospace';
/** Ink at a given opacity. */
const ink = (a: number) => `rgb(27 25 21 / ${a})`;

/* ------------------------------------------------------------------ */
/* Story timing                                                        */
/* ------------------------------------------------------------------ */

type Kind = 'fade' | 'rise' | 'pop' | 'turn' | 'grow' | 'dim' | 'move' | 'draw' | 'led' | 'key';
type Detail = 'travel' | 'ring' | 'flash' | 'puff' | 'streak' | 'shot' | 'blink' | 'flicker' | 'hop' | 'rock' | 'nudge' | 'wave';
interface Timing {
  /** Duration of the move, and of the fade-in when it differs (s). */
  d?: number;
  do?: number;
  /** Offsets (px), rotation (deg), scale, starting opacity. */
  x?: number;
  y?: number;
  r?: number;
  s?: number;
  o0?: number;
  /** Transform origin, easing, colours, peak opacity, wavelength. */
  o?: string;
  e?: string;
  on?: string;
  off?: string;
  peak?: number;
  w?: number;
}
const UNITS: Partial<Record<keyof Timing, string>> = { d: 's', do: 's', x: 'px', y: 'px', r: 'deg', w: 'px' };

function vars(t: number, timing: Timing = {}): CSSProperties {
  const style: Record<string, string> = { '--a-t': `${t}s` };
  for (const [k, v] of Object.entries(timing)) style[`--a-${k}`] = typeof v === 'number' ? `${v}${UNITS[k as keyof Timing] ?? ''}` : v;
  return style as CSSProperties;
}
/** A part of the story: how it comes in, when (seconds after the start) and its own timing. */
const st = (kind: Kind, t: number, timing?: Timing) => ({ className: `s s-${kind}`, style: vars(t, timing) });
/** A one-off detail that plays once and leaves no trace. */
const ev = (kind: Detail, t: number, timing?: Timing) => ({ className: `ev ev-${kind}`, style: vars(t, timing) });

/** Deterministic pseudo-random sequence in [0, 1), so stories look natural but never change. */
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** A short bright segment running along a path, over a faint copy of it. */
function Wire({ d, color, t, dur = 0.5, width = 1.4, base = ink(0.2) }: { d: string; color: string; t: number; dur?: number; width?: number; base?: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={base} strokeWidth={width} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width + 0.8} strokeLinecap="round" pathLength={1} {...ev('travel', t, { d: dur })} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

interface Ctx {
  /** Unique prefix for ids inside this SVG */
  id: string;
}

function Frame({ hue, children }: { hue: [string, string]; children: (ctx: Ctx) => ReactNode }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="60%">
          <stop offset="0" stopColor={hue[0]} stopOpacity="0.12" />
          <stop offset="0.6" stopColor={hue[1]} stopOpacity="0.03" />
          <stop offset="1" stopColor={hue[1]} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill={ink(0.1)} />
        </pattern>
        <linearGradient id={`${id}-vc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={INK} />
          <stop offset="1" stopColor={VL} />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill={GROUND} />
      <rect width="320" height="160" fill={`url(#${id}-dots)`} />
      {children({ id })}
    </svg>
  );
}

/** Browser-like window chrome (three dots and a title bar). */
function Window({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={PANEL} stroke={LINE} />
      <path d={`M${x} ${y + 14} H${x + w}`} stroke={LINE} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 10 + i * 8} cy={y + 7} r="2" fill={ink(0.2)} />
      ))}
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

/** MFA: a one-time code is typed and validated, the shield checks it; an e-mail goes through the filter. */
function Mfa() {
  const typed = [0.15, 0.28, 0.43, 0.51, 0.67, 0.79];
  return (
    <Frame hue={[A, E]}>
      {() => (
        <>
          {/* Phone with a one-time code */}
          <rect x="46" y="24" width="64" height="112" rx="11" fill={PANEL} stroke={LINE} />
          <rect x="68" y="30" width="20" height="3" rx="1.5" fill={LINE} />
          <rect x="72" y="46" width="12" height="10" rx="2" fill="none" stroke={A} strokeWidth="1.6" />
          <path d="M74.5 46 V42.5 a3.5 3.5 0 0 1 7 0 V46" fill="none" stroke={A} strokeWidth="1.6" />
          {typed.map((t, i) => (
            <g key={i}>
              <rect x={52 + i * 9} y="70" width="7" height="11" rx="1.5" fill={PANEL} stroke="rgb(140 100 24 / 0.5)" />
              <circle cx={55.5 + i * 9} cy="75.5" r="1.6" fill={A} {...st('pop', t, { d: 0.35, s: 0.2 })} />
            </g>
          ))}
          <rect x="56" y="94" width="44" height="11" rx="5.5" fill="rgb(46 107 69 / 0.12)" stroke={E} />
          <path d="M73 99.5 l3 3 l6 -6" fill="none" stroke={E} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} {...st('draw', 0.95, { d: 0.3 })} />
          {/* The code reaches the shield */}
          <Wire d="M112 80 H156" color={A} t={1.02} dur={0.4} />
          {/* Shield */}
          <path d="M190 32 L224 45 V78 C224 103 209 119 190 128 C171 119 156 103 156 78 V45 Z" fill="rgb(140 100 24 / 0.07)" stroke={A} strokeWidth="2" />
          <path d="M190 44 L213 53 V78 C213 96 203 108 190 115 C177 108 167 96 167 78 V53 Z" fill="none" stroke="rgb(140 100 24 / 0.35)" />
          <path d="M176 80 L186 90 L205 69" fill="none" stroke={E} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} {...st('draw', 1.38, { d: 0.45, e: 'var(--ease)' })} />
          <circle cx="190" cy="80" r="30" fill="none" stroke={E} strokeWidth="1.2" {...ev('ring', 1.5, { d: 1, s: 1.7, peak: 0.45 })} />
          {/* An e-mail slides in and goes through the filter */}
          <Wire d="M252 74 H226" color={E} t={1.1} dur={0.45} />
          <path d="M234 64 H250 L244 72 V81 L240 84 V72 Z" fill={ink(0.05)} stroke={ink(0.5)} strokeLinejoin="round" />
          <g {...st('rise', 0.45, { x: 18, y: 0, d: 0.75, do: 0.35 })}>
            <rect x="258" y="60" width="44" height="30" rx="4" fill={PANEL} stroke={VL} strokeWidth="1.5" />
            <path d="M258 62 L280 78 L302 62" fill="none" stroke={VL} strokeWidth="1.5" />
          </g>
        </>
      )}
    </Frame>
  );
}

/** Deployment: a commit goes through the pipeline, the SSH key turns, the servers come up one by one. */
function Deploy() {
  const servers = [57, 79, 101];
  return (
    <Frame hue={[V, C]}>
      {({ id }) => (
        <>
          <Wire d="M51 80 H78" color={VL} t={0.12} dur={0.38} width={1.5} base={LINE} />
          <Wire d="M138 80 H153" color={C} t={0.92} dur={0.28} width={1.5} base={LINE} />
          {servers.map((y, i) => (
            <Wire key={y} d={`M183 80 C206 80 208 ${y} 232 ${y}`} color={C} t={1.28 + i * 0.08} dur={0.45} width={1.2} base={LINE} />
          ))}
          {/* Git, with a new commit */}
          <circle cx="36" cy="80" r="15" fill={PANEL} stroke={VL} strokeWidth="1.5" />
          <path d="M31 72 V88 M31 79 C31 84 41 83 41 76" fill="none" stroke={VL} strokeWidth="1.6" />
          <circle cx="31" cy="72" r="2.3" fill={VL} />
          <circle cx="31" cy="88" r="2.3" fill={VL} />
          <circle cx="41" cy="75" r="2.3" fill={VL} {...st('pop', 0.02, { d: 0.35 })} />
          {/* Pipeline: its stages light up in turn */}
          <rect x="78" y="62" width="60" height="36" rx="9" fill={PANEL} stroke={`url(#${id}-vc)`} strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${94 + i * 11} 73 l6 7 l-6 7`} fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...st('dim', 0.45 + i * 0.15, { do: 0.25 })} />
          ))}
          {/* SSH key, turned in the lock */}
          <circle cx="168" cy="80" r="15" fill={PANEL} stroke={A} strokeWidth="1.5" />
          <g {...st('turn', 1.05, { r: -50, o0: 0, do: 0.2, d: 0.45, e: 'var(--ease-pop)' })}>
            <circle cx="162" cy="80" r="4.2" fill="none" stroke={A} strokeWidth="1.8" />
            <path d="M166 80 H177 M173 80 V84 M176.5 80 V83" stroke={A} strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Servers, configured one after the other */}
          {servers.map((y, i) => (
            <g key={y}>
              <rect x="232" y={y - 9} width="64" height="18" rx="4" fill={PANEL} stroke={LINE} />
              <path d={`M252 ${y - 2} H284`} stroke={ink(0.22)} {...st('grow', 1.66 + i * 0.12, { d: 0.45 })} />
              <path d={`M252 ${y + 2} H276`} stroke={ink(0.22)} {...st('grow', 1.74 + i * 0.12, { d: 0.4 })} />
              <circle cx="241" cy={y} r="2.4" {...st('led', 1.62 + i * 0.12, { on: E })} />
              <circle cx="241" cy={y} r="5" fill="none" stroke={E} {...ev('ring', 1.62 + i * 0.12, { d: 0.7, s: 2, peak: 0.5 })} />
            </g>
          ))}
        </>
      )}
    </Frame>
  );
}

/** Student files: schools send requests, a file fills in and gets validated, then it is locked and stored. */
function StudentFiles() {
  return (
    <Frame hue={[E, V]}>
      {({ id }) => (
        <>
          {/* Schools, sending their requests */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M22 ${44 + i * 36} l14 -10 l14 10 v16 h-28 Z`} fill={PANEL} stroke={E} strokeWidth="1.4" strokeLinejoin="round" />
              <rect x="32" y={50 + i * 36} width="8" height="10" fill="rgb(46 107 69 / 0.55)" {...st('dim', i * 0.12, { o0: 0.3, do: 0.3 })} />
              <Wire d={`M52 ${50 + i * 36} C80 ${50 + i * 36} 84 80 116 80`} color={E} t={0.12 + i * 0.12} dur={0.55} width={1.2} base="rgb(46 107 69 / 0.25)" />
            </g>
          ))}
          {/* Stack of student files; the top one fills in */}
          <rect x="124" y="34" width="84" height="100" rx="8" fill="#f6f3ec" stroke={LINE} transform="rotate(-7 166 84)" />
          <rect x="124" y="34" width="84" height="100" rx="8" fill="#f8f6f0" stroke={LINE} transform="rotate(4 166 84)" />
          <rect x="124" y="30" width="84" height="104" rx="8" fill={PANEL} stroke={`url(#${id}-vc)`} strokeWidth="1.5" />
          <g {...st('pop', 0.62, { d: 0.4, s: 0.6 })}>
            <circle cx="142" cy="52" r="9" fill={ink(0.06)} stroke={VL} />
            <circle cx="142" cy="49" r="3.2" fill={VL} />
            <path d="M136 57 a6 4 0 0 1 12 0" fill={VL} />
          </g>
          <rect x="156" y="45" width="40" height="4" rx="2" fill={ink(0.55)} {...st('grow', 0.72, { d: 0.4 })} />
          <rect x="156" y="54" width="28" height="3" rx="1.5" fill={ink(0.25)} {...st('grow', 0.8, { d: 0.35 })} />
          {[62, 50, 58, 38].map((w, i) => (
            <rect key={i} x="134" y={74 + i * 10} width={w} height="3" rx="1.5" fill={ink(0.18)} {...st('grow', 0.9 + i * 0.08, { d: 0.4 })} />
          ))}
          <g {...st('pop', 1.3, { d: 0.45 })}>
            <rect x="170" y="116" width="30" height="10" rx="5" fill="rgb(46 107 69 / 0.12)" stroke={E} />
            <path d="M180 121 l2.5 2.5 l5 -5" fill="none" stroke={E} strokeWidth="1.4" strokeLinecap="round" />
          </g>
          {/* Padlock: secure access, it closes */}
          <rect x="196" y="24" width="18" height="14" rx="3" fill={PANEL} stroke={A} strokeWidth="1.4" />
          <path d="M200 24 v-3.5 a5 5 0 0 1 10 0 V24" fill="none" stroke={A} strokeWidth="1.4" {...st('move', 1.48, { y: -3, d: 0.35, e: 'var(--ease-pop)' })} />
          <Wire d="M210 82 H250" color={VL} t={1.6} dur={0.4} width={1.5} base={ink(0.25)} />
          {/* Database */}
          <path d="M252 56 V108 C252 116 292 116 292 108 V56" fill={ink(0.04)} stroke={VL} strokeWidth="1.5" />
          <ellipse cx="272" cy="56" rx="20" ry="7" fill="#ebe6db" stroke={VL} strokeWidth="1.5" />
          <path d="M252 74 C252 82 292 82 292 74 M252 91 C252 99 292 99 292 91" fill="none" stroke={ink(0.3)} />
          <circle cx="284" cy="84" r="2" {...st('led', 1.95, { on: E })} />
          <circle cx="284" cy="84" r="5" fill="none" stroke={E} {...ev('ring', 1.95, { d: 0.8, s: 2.2, peak: 0.55 })} />
        </>
      )}
    </Frame>
  );
}

/** Environmental monitoring: smoke rises, the analyser records the curve, the AI flags it. */
function Environmental() {
  return (
    <Frame hue={[A, E]}>
      {({ id }) => (
        <>
          <defs>
            <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={E} stopOpacity="0.35" />
              <stop offset="1" stopColor={E} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M8 140 H312" stroke={LINE} />
          {/* Chimney and smoke */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="52" cy="52" r="7" fill={ink(0.14)} {...ev('puff', i * 0.45, { d: 1.7 })} />
          ))}
          <path d="M38 140 L42 60 H62 L66 140 Z" fill={PANEL} stroke={LINE} />
          <path d="M40.5 84 H63.5 M39.5 104 H64.5" stroke="rgb(178 60 28 / 0.6)" strokeWidth="4" />
          <Wire d="M66 110 C84 110 84 92 100 92" color={A} t={0.3} dur={0.5} width={1.3} base="rgb(140 100 24 / 0.25)" />
          {/* Analyser screen */}
          <rect x="100" y="30" width="164" height="100" rx="10" fill={PANEL} stroke={LINE} />
          <rect x="108" y="40" width="148" height="80" rx="5" fill="#f6f3ec" stroke={ink(0.12)} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M108 ${56 + i * 16} H256`} stroke={ink(0.07)} />
          ))}
          <path d="M108 56 H256" stroke={A} strokeDasharray="4 4" opacity="0.8" />
          <path d="M110 108 L126 98 L142 102 L158 86 L174 92 L190 76 L206 82 L222 68 L238 74 L254 62 V120 H110 Z" fill={`url(#${id}-area)`} {...st('fade', 1.6, { do: 0.8 })} />
          <path
            d="M110 108 L126 98 L142 102 L158 86 L174 92 L190 76 L206 82 L222 68 L238 74 L254 62"
            fill="none"
            stroke={E}
            strokeWidth="2"
            strokeLinejoin="round"
            pathLength={1}
            {...st('draw', 0.7, { d: 1.1 })}
          />
          <circle cx="254" cy="62" r="3" fill={E} {...st('pop', 1.78, { d: 0.4 })} />
          <circle cx="254" cy="62" r="6" fill="none" stroke={E} {...ev('ring', 1.82, { d: 0.9, s: 2.2, peak: 0.5 })} />
          {/* Recording light */}
          <circle cx="114" cy="47" r="2" fill={F} {...ev('blink', 0.55, { d: 1.2 })} />
          {/* AI sparkles */}
          <path d="M288 30 C290 40 292 42 302 44 C292 46 290 48 288 58 C286 48 284 46 274 44 C284 42 286 40 288 30 Z" fill={A} {...st('turn', 1.95, { r: -60, s: 0.2, o0: 0, d: 0.6, e: 'var(--ease-pop)' })} />
          <path d="M296 68 C297 73 298 74 303 75 C298 76 297 77 296 82 C295 77 294 76 289 75 C294 74 295 73 296 68 Z" fill={E} {...st('turn', 2.12, { r: 60, s: 0.2, o0: 0, d: 0.55, e: 'var(--ease-pop)' })} />
        </>
      )}
    </Frame>
  );
}

const CRAFT = 'M108 96 C118 88 188 86 212 90 L224 74 H231 L229 91 C231 94 226 97 219 97 L118 99 C110 99 105 98 108 96 Z';

/** Aeroboat: the ground-effect craft glides in over the water and settles; the sun rises. */
function Ekranoplan() {
  const glide = st('rise', 0.05, { x: -180, y: 0, d: 1.55, do: 0.3 });
  return (
    <Frame hue={[C, V]}>
      {({ id }) => (
        <>
          <defs>
            <clipPath id={`${id}-screen`}>
              <rect x="41" y="33" width="238" height="108" rx="8" />
            </clipPath>
            <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4ead9" />
              <stop offset="1" stopColor="#dde4ea" />
            </linearGradient>
          </defs>
          <Window x={40} y={18} w={240} h={124}>
            <rect x="80" y="21" width="120" height="8" rx="4" fill={ink(0.06)} />
          </Window>
          <g clipPath={`url(#${id}-screen)`}>
            <rect x="41" y="33" width="238" height="108" fill={`url(#${id}-sky)`} />
            <g {...st('rise', 0, { y: 10, d: 1.6, do: 0.8 })}>
              <circle cx="236" cy="58" r="12" fill={F} opacity="0.85" />
              <circle cx="236" cy="58" r="22" fill={F} opacity="0.1" />
            </g>
            {/* Water: it moves by one wavelength, so it ends as it began */}
            <g {...ev('wave', 0, { d: 2.4, w: 60 })}>
              <path d="M0 112 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V160 H0 Z" fill="rgb(44 79 124 / 0.16)" />
            </g>
            <g {...ev('wave', 0, { d: 2.4, w: 80 })}>
              <path d="M0 120 q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V160 H0 Z" fill="rgb(44 79 124 / 0.3)" />
            </g>
            {/* Speed lines, only while it glides */}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${66 + i * 14} ${88 + i * 6} H${96 + i * 14}`} stroke={ink(0.45)} strokeWidth="1.2" strokeLinecap="round" {...ev('streak', 0.3 + i * 0.14, { d: 0.9 })} />
            ))}
            {/* Ground-effect craft skimming the water */}
            <g {...glide}>
              <g {...ev('nudge', 1.5, { d: 0.7, y: 1.5 })}>
                <path d={CRAFT} fill={INK} />
                <path d="M146 96 L172 108 H184 L168 96 Z" fill={VL} />
                <path d="M214 76 H240 L238 79 H216 Z" fill={VL} />
                <path d="M122 92 H176" stroke={PANEL} strokeWidth="1.5" strokeDasharray="3 3" />
              </g>
            </g>
            {/* Reflection: the flip lives on the outer group, the glide on the inner one. */}
            <g opacity="0.12" transform="translate(0 214) scale(1 -1)">
              <g {...glide}>
                <path d={CRAFT} fill={INK} />
              </g>
            </g>
          </g>
        </>
      )}
    </Frame>
  );
}

/** Gradient descent: data points arrive, the regression line settles on them, the error rolls to its minimum. */
function Gradient() {
  const steps: [number, number][] = [
    [189.4, 59.8],
    [206.5, 81.3],
    [220.2, 91.3],
    [229.3, 94.5],
  ];
  const points: [number, number][] = [
    [36, 116],
    [48, 104],
    [58, 110],
    [70, 92],
    [82, 96],
    [94, 80],
    [106, 84],
    [118, 66],
    [130, 70],
    [142, 56],
  ];
  return (
    <Frame hue={[F, V]}>
      {() => (
        <>
          {/* Regression: points, then a line that swings into place */}
          <path d="M26 130 H152 M26 130 V30" stroke={LINE} />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={C} opacity="0.9" {...st('pop', 0.04 + jitter(i) * 0.45, { d: 0.35 })} />
          ))}
          <path d="M30 122 L150 50" stroke={F} strokeWidth="2.5" strokeLinecap="round" {...st('turn', 0.6, { r: -26, o0: 0, do: 0.3, d: 1.3, e: 'cubic-bezier(0.3, 1.5, 0.5, 1)' })} />
          {/* Error bowl and descent, step by step */}
          <path d="M176 130 H304" stroke={LINE} />
          <path d="M178 40 Q235 150 292 40" fill="none" stroke={VL} strokeWidth="2" />
          <path d={`M${steps.map(([x, y]) => `${x} ${y}`).join(' L')} L235 95`} fill="none" stroke={F} strokeWidth="1.3" strokeDasharray="3 3" {...st('fade', 0.75, { do: 1 })} />
          {steps.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4.5 - i * 0.6} fill={F} {...st('pop', 0.75 + i * 0.24, { d: 0.3 })} />
          ))}
          <circle cx="235" cy="95" r="10" fill={F} opacity="0.18" {...st('pop', 1.72, { d: 0.5 })} />
          <circle cx="235" cy="95" r="4.5" fill={F} stroke={PANEL} strokeWidth="1.5" {...st('pop', 1.72, { d: 0.45 })} />
          <circle cx="235" cy="95" r="8" fill="none" stroke={F} {...ev('ring', 1.78, { d: 0.9, s: 2.3, peak: 0.5 })} />
          <text x="248" y="118" fill={ink(0.6)} fontFamily={MONO} fontSize="9" {...st('fade', 0.3, { do: 0.6 })}>
            θ ← θ − η∇E
          </text>
        </>
      )}
    </Frame>
  );
}

/** IPv4 subnet calculator: a scan reads the 32 bits and splits network from host; the results follow. */
function Subnet() {
  const bits = '11000000101010000000000100000000';
  const cellX = (i: number) => 31 + Math.floor(i / 8) * 66.5 + (i % 8) * 7.5;
  // The scan below moves 262 px in 1.3 s from 0.15 s: each bit settles as the scan reaches it.
  const passes = (i: number) => 0.15 + ((cellX(i) + 3.25 - 32) / 262) * 1.3;
  return (
    <Frame hue={[C, V]}>
      {({ id }) => (
        <>
          <defs>
            <linearGradient id={`${id}-scan`} x1="0" x2="1">
              <stop offset="0" stopColor={C} stopOpacity="0" />
              <stop offset="0.5" stopColor={C} stopOpacity="0.28" />
              <stop offset="1" stopColor={C} stopOpacity="0" />
            </linearGradient>
          </defs>
          <text x="160" y="40" textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="15" fontWeight="700">
            192.168.1.0<tspan fill={C}>/24</tspan>
          </text>
          {bits.split('').map((b, i) => {
            const net = i < 24;
            return (
              <g key={i}>
                <rect
                  x={cellX(i)}
                  y="58"
                  width="6.5"
                  height="20"
                  rx="1.5"
                  stroke={net ? C : VL}
                  strokeOpacity="0.7"
                  {...st('led', passes(i), { on: net ? 'rgb(44 79 124 / 0.16)' : ink(0.07), off: PANEL, d: 0.3 })}
                />
                <text x={cellX(i) + 3.25} y="71.5" textAnchor="middle" fill={net ? C : VL} fontFamily={MONO} fontSize="7" {...st('dim', passes(i), { o0: 0.3, do: 0.3 })}>
                  {b}
                </text>
              </g>
            );
          })}
          <rect x="25" y="54" width="14" height="28" fill={`url(#${id}-scan)`} {...ev('shot', 0.15, { x: 262, d: 1.3, e: 'linear' })} />
          {/* Brackets */}
          <path d="M31 88 V94 H225 V88" fill="none" stroke={C} strokeWidth="1.3" pathLength={1} {...st('draw', 1.35, { d: 0.5 })} />
          <path d="M231 88 V94 H289 V88" fill="none" stroke={VL} strokeWidth="1.3" pathLength={1} {...st('draw', 1.5, { d: 0.35 })} />
          <text x="128" y="110" textAnchor="middle" fill={C} fontFamily={MONO} fontSize="10" {...st('rise', 1.62, { y: 4 })}>
            255.255.255.0
          </text>
          <text x="260" y="110" textAnchor="middle" fill={VL} fontFamily={MONO} fontSize="10" {...st('rise', 1.74, { y: 4 })}>
            .1 → .254
          </text>
          <text x="160" y="136" textAnchor="middle" fill={ink(0.5)} fontFamily={MONO} fontSize="9" {...st('rise', 1.9, { y: 4 })}>
            broadcast 192.168.1.255
          </text>
        </>
      )}
    </Frame>
  );
}

/** Relational database: the tables are laid out, their relations drawn, a query joins them and returns a car. */
function Schema() {
  const tables = [
    { name: 'brand', x: 18, y: 18 },
    { name: 'model', x: 18, y: 96 },
    { name: 'vehicle', x: 128, y: 57, main: true },
    { name: 'sale', x: 238, y: 18 },
    { name: 'customer', x: 238, y: 96 },
  ];
  // The rows a query hits, in the order it reaches them.
  const hits: Record<string, [number, number]> = { model: [1, 1.12], vehicle: [1, 1.42], sale: [0, 1.7] };
  const relations = ['M50 64 V96', 'M82 118 H105 V90 H128', 'M192 79 H214 V40 H238', 'M270 96 V64'];
  return (
    <Frame hue={[C, E]}>
      {({ id }) => (
        <>
          {/* Relations */}
          {relations.map((d, i) => (
            <path key={d} d={d} fill="none" stroke="rgb(44 79 124 / 0.5)" strokeWidth="1.5" pathLength={1} {...st('draw', 0.5 + i * 0.1, { d: 0.45 })} />
          ))}
          <path d={relations[1]} fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" pathLength={1} {...ev('travel', 1.2, { d: 0.4 })} />
          <path d={relations[2]} fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" pathLength={1} {...ev('travel', 1.5, { d: 0.4 })} />
          {/* Crow's feet on the "many" side */}
          <path d="M45 96 L50 90 L55 96 M122 85 L128 90 L122 95 M232 35 L238 40 L232 45 M265 64 L270 70 L275 64" fill="none" stroke={C} strokeWidth="1.2" {...st('fade', 0.95)} />
          {tables.map((t, i) => (
            <g key={t.name} {...st('rise', i * 0.07, { y: 8, d: 0.6 })}>
              <rect x={t.x} y={t.y} width="64" height="46" rx="6" fill={PANEL} stroke={t.main ? `url(#${id}-vc)` : LINE} strokeWidth={t.main ? 1.6 : 1} />
              <path d={`M${t.x} ${t.y + 14} H${t.x + 64}`} stroke={LINE} />
              <text x={t.x + 7} y={t.y + 10} fill={t.main ? INK : ink(0.75)} fontFamily={MONO} fontSize="7.5" fontWeight="700">
                {t.name}
              </text>
              <circle cx={t.x + 9} cy={t.y + 21} r="2" fill={A} />
              {hits[t.name] && (
                <rect x={t.x + 3} y={t.y + 16.5 + hits[t.name][0] * 8} width="58" height="8" rx="2" fill={C} {...ev('flash', hits[t.name][1], { d: 1.1, peak: 0.35 })} />
              )}
              {[0, 1, 2].map((r) => (
                <rect key={r} x={t.x + 14} y={t.y + 19 + r * 8} width={[34, 42, 26][r]} height="3" rx="1.5" fill={ink(0.15)} />
              ))}
            </g>
          ))}
          {/* The result: a car drives in and settles on its suspension */}
          <g transform="translate(140 118)" opacity="0.9">
            <g {...st('rise', 1.75, { x: -46, y: 0, d: 0.9, do: 0.3 })}>
              <g {...ev('nudge', 2.5, { d: 0.45, y: 1.2 })}>
                <path d="M0 14 L4 6 C6 3 10 1 16 1 H26 C31 1 34 3 37 6 L42 8 C45 9 46 11 46 14 V17 H0 Z" fill="none" stroke={E} strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="11" cy="17" r="4" fill={PANEL} stroke={E} strokeWidth="1.5" />
                <circle cx="36" cy="17" r="4" fill={PANEL} stroke={E} strokeWidth="1.5" />
              </g>
            </g>
          </g>
        </>
      )}
    </Frame>
  );
}

/** Time cruises: night falls, the portal opens, the clock spins back and the ship sails towards it. */
function TimeCruise() {
  const stars: [number, number][] = [
    [22, 22], [58, 40], [94, 16], [130, 34], [30, 66], [150, 60], [270, 20], [300, 50], [286, 120], [118, 128], [20, 120], [304, 90],
  ];
  return (
    <Frame hue={[A, V]}>
      {({ id }) => (
        <>
          {stars.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill={A} {...st('fade', jitter(i + 3) * 0.9, { do: 0.7 })} />
          ))}
          {/* Time portal, opening in a swirl */}
          <ellipse cx="206" cy="80" rx="50" ry="60" fill={`url(#${id}-glow)`} {...st('fade', 0.25, { do: 1.2 })} />
          <ellipse cx="206" cy="80" rx="48" ry="58" fill="none" stroke={A} strokeWidth="1.5" strokeDasharray="30 10 4 10" {...st('turn', 0.2, { r: -120, s: 0.5, o0: 0, d: 1.5, do: 0.6 })} />
          <ellipse cx="206" cy="80" rx="36" ry="44" fill="none" stroke={VL} strokeWidth="1.5" strokeDasharray="18 8" {...st('turn', 0.3, { r: 150, s: 0.5, o0: 0, d: 1.5, do: 0.6 })} />
          <ellipse cx="206" cy="80" rx="24" ry="29" fill={ink(0.04)} stroke={F} strokeDasharray="6 5" {...st('turn', 0.4, { r: -180, s: 0.5, o0: 0, d: 1.5, do: 0.6 })} />
          {/* Clock: the hands spin back through time */}
          <circle cx="206" cy="80" r="13" fill={PANEL} stroke={INK} strokeWidth="1.5" {...st('pop', 0.45, { d: 0.45 })} />
          <path d="M206 80 V71" stroke={INK} strokeWidth="1.8" strokeLinecap="round" {...st('turn', 0.5, { r: 720, o: '50% 100%', o0: 0, d: 1.7, do: 0.3, e: 'var(--ease-io)' })} />
          <path d="M206 80 H212" stroke={INK} strokeWidth="1.8" strokeLinecap="round" {...st('turn', 0.5, { r: 60, o: '0% 50%', o0: 0, d: 1.7, do: 0.3, e: 'var(--ease-io)' })} />
          {/* Cruise ship sailing towards it, rocking on the swell */}
          <g {...st('rise', 0.1, { x: -40, y: 0, d: 1.7, do: 0.5 })}>
            <g {...ev('rock', 0.2, { d: 2.4, o: '50% 100%' })}>
              <path d="M40 112 H150 L138 128 H54 Z" fill={INK} />
              <path d="M40 112 H150 L147 116 H43 Z" fill={A} />
              <rect x="62" y="100" width="66" height="12" rx="2" fill={VL} />
              <rect x="74" y="90" width="42" height="10" rx="2" fill="#77705f" />
              <rect x="104" y="80" width="9" height="10" rx="1" fill={F} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle key={i} cx={69 + i * 10} cy="106" r="1.6" fill={PANEL} />
              ))}
            </g>
          </g>
          <path d="M20 132 H46 M10 138 H40 M150 132 H168" stroke="rgb(44 79 124 / 0.4)" strokeWidth="1.3" strokeLinecap="round" {...st('fade', 0.7, { do: 0.8 })} />
        </>
      )}
    </Frame>
  );
}

/** Student housing: a student is picked, assigned a room, and the residence lights up for the evening. */
function Dorm() {
  const lit = [1, 4, 6, 8, 11, 13, 15, 18];
  const assigned = 8;
  return (
    <Frame hue={[C, V]}>
      {() => (
        <>
          {/* Student list */}
          <rect x="22" y="36" width="100" height="92" rx="8" fill={PANEL} stroke={LINE} />
          <rect x="28" y="66" width="88" height="16" rx="4" fill="rgb(44 79 124 / 0.1)" stroke="rgb(44 79 124 / 0.5)" {...st('grow', 0.42, { d: 0.45 })} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} {...st('rise', i * 0.07, { y: 4, d: 0.5 })}>
              <circle cx="38" cy={54 + i * 20} r="4.5" {...(i === 1 ? st('led', 0.5, { on: C, off: ink(0.22) }) : { fill: ink(0.22) })} />
              <rect x="48" y={51 + i * 20} width={[48, 56, 40, 52][i]} height="3" rx="1.5" fill={ink(0.3)} />
              <rect x="48" y={57 + i * 20} width="26" height="2.5" rx="1.25" fill={ink(0.14)} />
            </g>
          ))}
          <Wire d="M116 74 C140 74 150 60 190 60" color={C} t={0.68} dur={0.55} width={1.5} base="rgb(44 79 124 / 0.25)" />
          {/* Residence, whose windows light up as the evening comes */}
          <path d="M150 34 L220 16 L290 34" fill="none" stroke={LINE} strokeWidth="1.5" />
          <rect x="152" y="34" width="136" height="110" rx="3" fill={PANEL} stroke={LINE} />
          {Array.from({ length: 20 }, (_, i) => {
            const x = 162 + (i % 5) * 25;
            const y = 44 + Math.floor(i / 5) * 24;
            const on = lit.includes(i);
            const t = i === assigned ? 1.25 : 1.4 + jitter(i) * 0.8;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width="16"
                  height="14"
                  rx="2"
                  stroke={ink(0.2)}
                  {...(on ? st('led', t, { on: i % 3 ? 'rgb(140 100 24 / 0.55)' : 'rgb(178 60 28 / 0.45)', off: ink(0.05), d: 0.3 }) : { fill: ink(0.05) })}
                />
                {i === assigned && <rect x={x - 3} y={y - 3} width="22" height="20" rx="4" fill="none" stroke={C} {...ev('ring', 1.28, { d: 0.9, s: 1.5, peak: 0.6 })} />}
              </g>
            );
          })}
          <rect x="187" y="128" width="12" height="16" fill={ink(0.14)} />
        </>
      )}
    </Frame>
  );
}

/** Bookshop specification: books fill the shelves, then the use cases are drawn one by one around the actor. */
function Bookshop() {
  const books = (y: number, seed: number) =>
    Array.from({ length: 9 }, (_, i) => {
      const h = 30 + ((i * 7 + seed) % 5) * 4;
      return { x: 24 + i * 13 + (i > 5 ? 3 : 0), h, y: y - h, c: [V, C, F, A, E, VL][(i + seed) % 6] };
    });
  return (
    <Frame hue={[A, F]}>
      {() => (
        <>
          {/* Shelves; one book leans over once the others are in */}
          {[72, 132].map((y, s) => (
            <g key={y}>
              {books(y, s * 3).map((b, i) => {
                const book = (
                  <g {...st('rise', s * 0.2 + i * 0.035, { y: 7, d: 0.5 })}>
                    <rect x={b.x} y={b.y} width="11" height={b.h} rx="1.5" fill={b.c} fillOpacity="0.35" stroke={b.c} strokeOpacity="0.8" />
                    <path d={`M${b.x + 2.5} ${b.y + 6} H${b.x + 8.5}`} stroke={b.c} />
                  </g>
                );
                return i === 6 && s === 0 ? (
                  <g key={i} transform={`rotate(-14 ${b.x + 11} ${y})`}>
                    <g {...st('turn', 0.55, { r: 14, o: '100% 100%', d: 0.7, e: 'var(--ease-pop)' })}>{book}</g>
                  </g>
                ) : (
                  <g key={i}>{book}</g>
                );
              })}
              <rect x="18" y={y} width="130" height="4" rx="2" fill={ink(0.35)} />
            </g>
          ))}
          {/* UML use cases */}
          <rect x="204" y="18" width="104" height="124" rx="8" fill="none" stroke={LINE} strokeDasharray="5 4" {...st('fade', 0.45, { do: 0.6 })} />
          <g {...st('rise', 0.6, { y: 6 })}>
            <circle cx="178" cy="62" r="7" fill="none" stroke={INK} strokeWidth="1.6" />
            <path d="M178 69 V92 M166 77 H190 M178 92 L168 108 M178 92 L188 108" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
          </g>
          {[40, 80, 120].map((cy, i) => (
            <g key={cy}>
              <path d={`M190 80 L222 ${cy}`} stroke={ink(0.4)} pathLength={1} {...st('draw', 0.85 + i * 0.18, { d: 0.3 })} />
              <ellipse cx="256" cy={cy} rx="36" ry="13" fill={PANEL} stroke={[A, F, VL][i]} strokeWidth="1.5" {...st('pop', 1.0 + i * 0.18, { d: 0.5, s: 0.6 })} />
              <rect x="236" y={cy - 1.5} width={[40, 32, 36][i]} height="3" rx="1.5" fill={ink(0.3)} {...st('grow', 1.12 + i * 0.18, { d: 0.4 })} />
            </g>
          ))}
        </>
      )}
    </Frame>
  );
}

/** Raspberry Pi: power on, the activity light flickers while the setup commands are typed, then ready. */
function RaspberryPi() {
  const lines = ['$ sudo apt update', '$ apt install python3', '$ apt install mariadb-server'];
  const starts = [0.72, 1.24, 1.84];
  const done = 2.5;
  return (
    <Frame hue={[E, F]}>
      {() => (
        <>
          {/* Board */}
          <rect x="18" y="36" width="126" height="90" rx="7" fill="rgb(46 107 69 / 0.12)" stroke="rgb(46 107 69 / 0.6)" strokeWidth="1.4" />
          {Array.from({ length: 13 }, (_, i) => (
            <g key={i}>
              <rect x={28 + i * 7.5} y="41" width="4" height="4" fill={A} opacity="0.85" />
              <rect x={28 + i * 7.5} y="48" width="4" height="4" fill={A} opacity="0.85" />
            </g>
          ))}
          <rect x="44" y="68" width="34" height="34" rx="3" fill={INK} />
          <rect x="52" y="76" width="18" height="18" rx="2" fill="rgb(251 250 246 / 0.14)" />
          <path d="M78 76 H100 V70 M78 85 H112 M78 94 H100 V104 H120" fill="none" stroke="rgb(46 107 69 / 0.6)" strokeWidth="1.2" pathLength={1} {...st('draw', 0.15, { d: 0.6 })} />
          <rect x="130" y="62" width="22" height="18" rx="2" fill="#d9d2c3" stroke={LINE} />
          <rect x="130" y="88" width="22" height="18" rx="2" fill="#d9d2c3" stroke={LINE} />
          <circle cx="30" cy="116" r="2.4" {...st('led', 0.05, { on: F })} />
          <g {...ev('flicker', 0.75, { d: done - 0.75 })}>
            <circle cx="38" cy="116" r="2.4" {...st('led', 0.3, { on: E })} />
          </g>
          <Wire d="M152 97 C164 97 164 80 172 80" color={E} t={0.45} dur={0.4} width={1.3} base="rgb(46 107 69 / 0.25)" />
          {/* Terminal: the commands get typed, then the machine is ready */}
          <Window x={172} y={28} w={136} h={106}>
            {lines.map((l, i) => (
              <text key={l} x="180" y={58 + i * 15} fill={ink(0.8)} fontFamily={MONO} fontSize="7.4">
                {l.split('').map((ch, k) => (
                  <tspan key={k} {...st('key', starts[i] + k * 0.022 + (jitter(i * 40 + k) - 0.5) * 0.012)}>
                    {ch}
                  </tspan>
                ))}
              </text>
            ))}
            <text x="180" y="103" fill={E} fontFamily={MONO} fontSize="7.4" {...st('fade', done, { do: 0.3 })}>
              ✓ ready
            </text>
            {/* The cursor blinks twice, then stays */}
            <g {...ev('blink', done + 0.3, { d: 1.6 })}>
              <rect x="180" y="113" width="5" height="9" fill={E} {...st('fade', done + 0.1, { do: 0.01 })} />
            </g>
          </Window>
        </>
      )}
    </Frame>
  );
}

const PLAYER = ['00111000', '00111000', '00010000', '01111100', '00010000', '00101000', '01000100', '00000000'];
const BOT = ['01111110', '10000001', '10100101', '10000001', '10111101', '10000001', '01111110', '00100100'];

/** Pixel sprite that materialises pixel by pixel, from `t` on. */
function Sprite({ rows, x, y, color, t }: { rows: string[]; x: number; y: number; color: string; t: number }) {
  return (
    <g>
      {rows.flatMap((row, r) =>
        row.split('').map((b, c) => (b === '1' ? <rect key={`${r}-${c}`} x={x + c * 4} y={y + r * 4} width="4" height="4" fill={color} {...st('fade', t + jitter(r * 8 + c + x) * 0.35, { do: 0.08 })} /> : null)),
      )}
    </g>
  );
}

/** Game with an AI opponent: both players spawn, the AI weighs its options, the player shoots and the AI dodges. */
function Game() {
  const nodes: [number, number, boolean][] = [
    [238, 50, true],
    [226, 64, true],
    [250, 64, false],
    [220, 76, false],
    [232, 76, true],
  ];
  return (
    <Frame hue={[V, E]}>
      {() => (
        <>
          <Window x={28} y={16} w={264} h={128}>
            <text x="160" y="46" textAnchor="middle" fill={ink(0.7)} fontFamily={MONO} fontSize="11" fontWeight="700">
              3 : 2
            </text>
            <path d="M36 126 H284" stroke={LINE} strokeDasharray="4 4" />
          </Window>
          <Sprite rows={PLAYER} x={62} y={92} color={C} t={0} />
          {/* Airborne from about 1.25 s to 1.65 s: the shot below passes under it around 1.5 s. */}
          <g {...ev('hop', 1.2, { d: 0.6, y: -16 })}>
            <Sprite rows={BOT} x={222} y={84} color={F} t={0.1} />
          </g>
          {/* The AI "thinking": a small decision tree lights the branch it picks */}
          <path d="M238 50 L226 64 M226 64 L232 76 M238 50 L250 64 M226 64 L220 76" stroke="rgb(178 60 28 / 0.45)" pathLength={1} {...st('draw', 0.5, { d: 0.45 })} />
          {nodes.map(([x, y, chosen], i) => (
            <circle key={i} cx={x} cy={y} r="3" {...st('led', [0.6, 0.78, 0.86, 0.94, 0.96][i], { on: chosen ? F : 'rgb(178 60 28 / 0.3)', off: 'rgb(178 60 28 / 0.12)' })} />
          ))}
          {/* Shot towards the AI, which jumps over it */}
          <circle cx="98" cy="104" r="3" fill={INK} {...ev('shot', 1.0, { x: 170, d: 0.6, e: 'cubic-bezier(0.3, 0, 0.7, 1)' })} />
        </>
      )}
    </Frame>
  );
}

/** Neural network: the forward pass, layer after layer; the strongest weights carry the signal. */
function Neural() {
  const layers = [
    { x: 44, n: 3 },
    { x: 116, n: 5 },
    { x: 188, n: 5 },
    { x: 256, n: 1 },
  ];
  const ys = (n: number) => Array.from({ length: n }, (_, j) => (n === 1 ? 78 : 28 + (j * 100) / (n - 1)));
  const fire = (c: number) => 0.1 + c * 0.42;
  return (
    <Frame hue={[F, C]}>
      {() => (
        <>
          {layers.slice(1).map((layer, c) =>
            ys(layer.n).map((y2, j) =>
              ys(layers[c].n).map((y1, k) => {
                // Deterministic "weights": sign gives the colour, size the thickness.
                const w = Math.sin((c + 1) * 12.9 + j * 7.3 + k * 3.1);
                const d = `M${layers[c].x} ${y1} L${layer.x} ${y2}`;
                return (
                  <g key={`${c}-${j}-${k}`}>
                    <path d={d} stroke={w > 0 ? C : F} strokeOpacity={0.15 + 0.45 * Math.abs(w)} strokeWidth={0.6 + 1.3 * Math.abs(w)} {...st('dim', fire(c) + 0.1 + jitter(c * 50 + j * 7 + k) * 0.1, { o0: 0.3, do: 0.35 })} />
                    {Math.abs(w) > 0.8 && <path d={d} stroke={w > 0 ? C : F} strokeWidth="1.6" strokeLinecap="round" pathLength={1} {...ev('travel', fire(c) + 0.06, { d: 0.38 })} />}
                  </g>
                );
              }),
            ),
          )}
          {layers.map((layer, c) =>
            ys(layer.n).map((y, j) => {
              const out = c === layers.length - 1;
              return (
                <g key={`n-${c}-${j}`}>
                  <circle cx={layer.x} cy={y} r={out ? 9 : 6} fill={PANEL} stroke={out ? F : INK} strokeWidth="1.4" />
                  <circle cx={layer.x} cy={y} r={out ? 5 : 3} fill={out ? F : INK} {...st('pop', fire(c) + j * 0.03, { d: 0.35, s: 0.2 })} />
                </g>
              );
            }),
          )}
          <circle cx="256" cy="78" r="9" fill="none" stroke={F} {...ev('ring', fire(3) + 0.05, { d: 0.9, s: 2.4, peak: 0.6 })} />
          <text x="272" y="82" fill={ink(0.7)} fontFamily={MONO} fontSize="11" {...st('fade', fire(3) + 0.2)}>
            ŷ
          </text>
          {/* The sigmoid, in a corner */}
          <path d="M268 146 H312 M290 150 V116" stroke={LINE} />
          <path d="M270 142 C 284 142, 286 120, 300 120 S 308 119, 312 119" fill="none" stroke={F} strokeWidth="1.8" pathLength={1} {...st('draw', fire(3) + 0.25, { d: 0.6 })} />
          <text x="272" y="126" fill={F} fontFamily={MONO} fontSize="9" {...st('fade', fire(3) + 0.35)}>
            σ
          </text>
        </>
      )}
    </Frame>
  );
}

function Generic() {
  const nodes: [number, number][] = [
    [80, 80],
    [160, 40],
    [240, 80],
    [160, 120],
  ];
  return (
    <Frame hue={[V, C]}>
      {({ id }) => (
        <>
          <path d="M80 80 L160 40 L240 80 L160 120 Z" fill="none" stroke={`url(#${id}-vc)`} strokeWidth="1.5" pathLength={1} {...st('draw', 0.1, { d: 0.9 })} />
          {nodes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill={[VL, C, F, E][i]} {...st('pop', 0.2 + i * 0.22, { d: 0.4 })} />
          ))}
          <circle cx="160" cy="80" r="10" fill={F} {...st('pop', 1.1, { d: 0.45 })} />
        </>
      )}
    </Frame>
  );
}

const ART: Record<string, () => ReactNode> = {
  'domofinance-mfa': Mfa,
  'acelys-deploy': Deploy,
  'edu-accommodation': StudentFiles,
  'solstice-dahs': Environmental,
  'aeroboat-site': Ekranoplan,
  'gradient-descent': Gradient,
  'neural-network': Neural,
  'subnet-calculator': Subnet,
  'ac-motors': Schema,
  cwad: TimeCruise,
  'paris-sud-app': Dorm,
  librairie: Bookshop,
  debian: RaspberryPi,
  'python-game': Game,
};

export const hasProjectArt = (id: string) => id in ART;

/** A replay is ignored while the story is still being told (ms). */
const REPLAY_AFTER = 1600;
/** The quick fade between two tellings (ms). */
const REWIND = 220;
const AUTOPLAY_DELAY = 350;

/**
 * Illustration of a project, filling its container. The story plays the first time 40 % of it is on
 * screen (or right away with `autoplay`), and again whenever `replay` changes.
 */
export function ProjectArt({ id, className = '', replay = 0, autoplay = false }: { id: string; className?: string; replay?: number; autoplay?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const [built, setBuilt] = useState(false);
  const told = useRef(0);
  const rewind = useRef(0);
  const Art = ART[id] ?? Generic;

  useEffect(() => {
    if (told.current) return;
    const tell = () => {
      told.current = performance.now();
      setBuilt(true);
    };
    if (seen || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return tell();
    // On a project page, let the illustration fade in before its story starts.
    if (!autoplay) return;
    const timer = window.setTimeout(tell, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [seen, autoplay]);

  useEffect(() => {
    if (!replay || !told.current || performance.now() - told.current < REPLAY_AFTER) return;
    told.current = performance.now();
    setBuilt(false);
    rewind.current = window.setTimeout(() => setBuilt(true), REWIND);
  }, [replay]);
  useEffect(() => () => window.clearTimeout(rewind.current), []);

  return (
    <div ref={ref} className={className} data-art={id} data-built={built ? '' : undefined}>
      <Art />
    </div>
  );
}
