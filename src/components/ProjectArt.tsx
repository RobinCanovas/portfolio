import { useId, type CSSProperties, type ReactNode } from 'react';

/**
 * Hand-drawn SVG illustrations, one per project, on a 320×160 canvas.
 * They are decorative (aria-hidden) and animated with the small `art-*` CSS loops from index.css,
 * which the reduced-motion rule switches off.
 */

const V = '#a855f7';
const VL = '#c084fc';
const C = '#22d3ee';
const F = '#e879f9';
const E = '#34d399';
const A = '#fbbf24';
const LINE = 'rgb(255 255 255 / 0.22)';
const PANEL = '#12121b';

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

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
          <stop offset="0" stopColor={hue[0]} stopOpacity="0.32" />
          <stop offset="0.6" stopColor={hue[1]} stopOpacity="0.08" />
          <stop offset="1" stopColor={hue[1]} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgb(255 255 255 / 0.09)" />
        </pattern>
        <linearGradient id={`${id}-vc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={VL} />
          <stop offset="1" stopColor={C} />
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill="#0c0c14" />
      <rect width="320" height="160" fill={`url(#${id}-dots)`} />
      <rect width="320" height="160" fill={`url(#${id}-glow)`} />
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
      {['#f87171', A, E].map((c, i) => (
        <circle key={c} cx={x + 10 + i * 8} cy={y + 7} r="2.2" fill={c} opacity="0.7" />
      ))}
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */

function Mfa() {
  return (
    <Frame hue={[A, E]}>
      {() => (
        <>
          {/* Phone with a one-time code */}
          <g className="art-float">
            <rect x="46" y="24" width="64" height="112" rx="11" fill={PANEL} stroke={LINE} />
            <rect x="68" y="30" width="20" height="3" rx="1.5" fill={LINE} />
            <rect x="72" y="46" width="12" height="10" rx="2" fill="none" stroke={A} strokeWidth="1.6" />
            <path d="M74.5 46 V42.5 a3.5 3.5 0 0 1 7 0 V46" fill="none" stroke={A} strokeWidth="1.6" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i}>
                <rect x={52 + i * 9} y="70" width="7" height="11" rx="1.5" fill="rgb(255 255 255 / 0.05)" stroke="rgb(251 191 36 / 0.45)" />
                <circle cx={55.5 + i * 9} cy="75.5" r="1.6" fill={A} className="art-blink" style={delay(i * 0.18)} />
              </g>
            ))}
            <rect x="56" y="94" width="44" height="11" rx="5.5" fill="rgb(52 211 153 / 0.2)" stroke={E} />
            <path d="M73 99.5 l3 3 l6 -6" fill="none" stroke={E} strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <path d="M112 80 H156" stroke={A} strokeWidth="1.5" className="art-dash" />
          {/* Shield */}
          <g className="art-pulse">
            <path d="M190 32 L224 45 V78 C224 103 209 119 190 128 C171 119 156 103 156 78 V45 Z" fill="rgb(251 191 36 / 0.08)" stroke={A} strokeWidth="2" />
            <path d="M190 44 L213 53 V78 C213 96 203 108 190 115 C177 108 167 96 167 78 V53 Z" fill="none" stroke="rgb(251 191 36 / 0.3)" />
            <path d="M176 80 L186 90 L205 69" fill="none" stroke={E} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* E-mail going through a filter */}
          <path d="M252 74 H226" stroke={E} strokeWidth="1.5" className="art-dash" />
          <path d="M234 64 H250 L244 72 V81 L240 84 V72 Z" fill="rgb(255 255 255 / 0.06)" stroke="rgb(255 255 255 / 0.45)" strokeLinejoin="round" />
          <g className="art-float" style={delay(0.8)}>
            <rect x="258" y="60" width="44" height="30" rx="4" fill={PANEL} stroke={VL} strokeWidth="1.5" />
            <path d="M258 62 L280 78 L302 62" fill="none" stroke={VL} strokeWidth="1.5" />
          </g>
        </>
      )}
    </Frame>
  );
}

function Deploy() {
  return (
    <Frame hue={[V, C]}>
      {({ id }) => (
        <>
          <path d="M50 80 H78 M138 80 H154 M182 74 H228 M182 86 H228" stroke={LINE} strokeWidth="1.5" />
          <path d="M182 74 H228 M182 86 H228" stroke={C} strokeWidth="1.2" className="art-dash" />
          {/* Git */}
          <circle cx="36" cy="80" r="15" fill={PANEL} stroke={VL} strokeWidth="1.5" />
          <path d="M31 72 V88 M31 79 C31 84 41 83 41 76" fill="none" stroke={VL} strokeWidth="1.6" />
          <circle cx="31" cy="72" r="2.3" fill={VL} />
          <circle cx="31" cy="88" r="2.3" fill={VL} />
          <circle cx="41" cy="75" r="2.3" fill={VL} />
          {/* Pipeline */}
          <rect x="78" y="62" width="60" height="36" rx="9" fill={PANEL} stroke={`url(#${id}-vc)`} strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${94 + i * 11} 73 l6 7 l-6 7`} fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="art-blink" style={delay(i * 0.25)} />
          ))}
          {/* SSH key */}
          <circle cx="168" cy="80" r="15" fill={PANEL} stroke={A} strokeWidth="1.5" />
          <circle cx="162" cy="80" r="4.2" fill="none" stroke={A} strokeWidth="1.8" />
          <path d="M166 80 H177 M173 80 V84 M176.5 80 V83" stroke={A} strokeWidth="1.8" strokeLinecap="round" />
          {/* Servers */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="232" y={48 + i * 22} width="64" height="18" rx="4" fill={PANEL} stroke={LINE} />
              <path d={`M252 ${55 + i * 22} H284 M252 ${59 + i * 22} H276`} stroke="rgb(255 255 255 / 0.15)" />
              <circle cx="241" cy={57 + i * 22} r="2.4" fill={E} className="art-blink" style={delay(0.4 + i * 0.3)} />
            </g>
          ))}
          {/* Release travelling along the pipeline */}
          <circle cx="50" cy="80" r="4" fill={C} className="art-travel" style={{ '--dx': '182px' } as CSSProperties} />
          <circle cx="50" cy="80" r="9" fill={C} opacity="0.25" className="art-travel" style={{ '--dx': '182px' } as CSSProperties} />
        </>
      )}
    </Frame>
  );
}

function StudentFiles() {
  return (
    <Frame hue={[E, V]}>
      {({ id }) => (
        <>
          {/* Schools */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M22 ${44 + i * 36} l14 -10 l14 10 v16 h-28 Z`} fill={PANEL} stroke={E} strokeWidth="1.4" strokeLinejoin="round" />
              <rect x="32" y={50 + i * 36} width="8" height="10" fill="rgb(52 211 153 / 0.35)" />
              <path d={`M52 ${50 + i * 36} C80 ${50 + i * 36} 84 80 116 80`} fill="none" stroke={E} strokeWidth="1.2" className="art-dash" style={delay(i * 0.3)} />
            </g>
          ))}
          {/* Stack of student files */}
          <g className="art-float">
            <rect x="124" y="34" width="84" height="100" rx="8" fill="#171722" stroke={LINE} transform="rotate(-7 166 84)" />
            <rect x="124" y="34" width="84" height="100" rx="8" fill="#15151f" stroke={LINE} transform="rotate(4 166 84)" />
            <rect x="124" y="30" width="84" height="104" rx="8" fill={PANEL} stroke={`url(#${id}-vc)`} strokeWidth="1.5" />
            <circle cx="142" cy="52" r="9" fill="rgb(168 85 247 / 0.25)" stroke={VL} />
            <circle cx="142" cy="49" r="3.2" fill={VL} />
            <path d="M136 57 a6 4 0 0 1 12 0" fill={VL} />
            <rect x="156" y="45" width="40" height="4" rx="2" fill="rgb(255 255 255 / 0.5)" />
            <rect x="156" y="54" width="28" height="3" rx="1.5" fill="rgb(255 255 255 / 0.22)" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="134" y={74 + i * 10} width={[62, 50, 58, 38][i]} height="3" rx="1.5" fill="rgb(255 255 255 / 0.16)" />
            ))}
            <rect x="170" y="116" width="30" height="10" rx="5" fill="rgb(52 211 153 / 0.2)" stroke={E} />
            <path d="M180 121 l2.5 2.5 l5 -5" fill="none" stroke={E} strokeWidth="1.4" strokeLinecap="round" />
            {/* Padlock: secure access */}
            <rect x="196" y="24" width="18" height="14" rx="3" fill={PANEL} stroke={A} strokeWidth="1.4" />
            <path d="M200 24 v-3.5 a5 5 0 0 1 10 0 V24" fill="none" stroke={A} strokeWidth="1.4" />
          </g>
          <path d="M210 82 H250" stroke={V} strokeWidth="1.5" className="art-dash" />
          {/* Database */}
          <g>
            <path d="M252 56 V108 C252 116 292 116 292 108 V56" fill="rgb(168 85 247 / 0.1)" stroke={VL} strokeWidth="1.5" />
            <ellipse cx="272" cy="56" rx="20" ry="7" fill="#1b1528" stroke={VL} strokeWidth="1.5" />
            <path d="M252 74 C252 82 292 82 292 74 M252 91 C252 99 292 99 292 91" fill="none" stroke="rgb(192 132 252 / 0.5)" />
            <circle cx="284" cy="84" r="2" fill={E} className="art-blink" />
          </g>
        </>
      )}
    </Frame>
  );
}

function Environmental() {
  return (
    <Frame hue={['#facc15', '#16a34a']}>
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
          <path d="M38 140 L42 60 H62 L66 140 Z" fill={PANEL} stroke={LINE} />
          <path d="M40.5 84 H63.5 M39.5 104 H64.5" stroke="rgb(248 113 113 / 0.6)" strokeWidth="4" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="52" cy="52" r="7" fill="rgb(255 255 255 / 0.18)" className="art-rise" style={delay(i * 1.2)} />
          ))}
          <path d="M66 110 C84 110 84 92 100 92" fill="none" stroke="#facc15" strokeWidth="1.3" className="art-dash" />
          {/* Analyser screen */}
          <rect x="100" y="30" width="164" height="100" rx="10" fill={PANEL} stroke={LINE} />
          <rect x="108" y="40" width="148" height="80" rx="5" fill="#0b0f0c" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M108 ${56 + i * 16} H256`} stroke="rgb(255 255 255 / 0.05)" />
          ))}
          <path d="M108 56 H256" stroke={A} strokeDasharray="4 4" opacity="0.8" />
          <path d="M110 108 L126 98 L142 102 L158 86 L174 92 L190 76 L206 82 L222 68 L238 74 L254 62 V120 H110 Z" fill={`url(#${id}-area)`} />
          <path d="M110 108 L126 98 L142 102 L158 86 L174 92 L190 76 L206 82 L222 68 L238 74 L254 62" fill="none" stroke={E} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="254" cy="62" r="3" fill={E} className="art-pulse" />
          <circle cx="114" cy="47" r="2" fill="#f87171" className="art-blink" />
          {/* AI sparkles */}
          <path d="M288 30 C290 40 292 42 302 44 C292 46 290 48 288 58 C286 48 284 46 274 44 C284 42 286 40 288 30 Z" fill="#facc15" className="art-pulse" />
          <path d="M296 68 C297 73 298 74 303 75 C298 76 297 77 296 82 C295 77 294 76 289 75 C294 74 295 73 296 68 Z" fill={E} className="art-pulse" style={delay(0.6)} />
        </>
      )}
    </Frame>
  );
}

function Ekranoplan() {
  return (
    <Frame hue={['#38bdf8', '#6366f1']}>
      {({ id }) => (
        <>
          <defs>
            <clipPath id={`${id}-screen`}>
              <rect x="41" y="33" width="238" height="108" rx="8" />
            </clipPath>
            <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1e1b4b" />
              <stop offset="1" stopColor="#0c4a6e" />
            </linearGradient>
          </defs>
          <Window x={40} y={18} w={240} h={124}>
            <rect x="80" y="21" width="120" height="8" rx="4" fill="rgb(255 255 255 / 0.07)" />
          </Window>
          <g clipPath={`url(#${id}-screen)`}>
            <rect x="41" y="33" width="238" height="108" fill={`url(#${id}-sky)`} />
            <circle cx="236" cy="58" r="12" fill="#fde68a" opacity="0.85" />
            <circle cx="236" cy="58" r="22" fill="#fde68a" opacity="0.12" />
            {/* Scrolling waves */}
            <g className="art-wave">
              <path d="M0 112 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V160 H0 Z" fill="rgb(56 189 248 / 0.25)" />
            </g>
            <g className="art-wave" style={{ '--w': '80px', animationDuration: '9s' } as CSSProperties}>
              <path d="M0 120 q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V160 H0 Z" fill="rgb(14 165 233 / 0.4)" />
            </g>
            {/* Speed lines */}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${60 + i * 14} ${88 + i * 6} H${90 + i * 14}`} stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.2" strokeLinecap="round" className="art-blink" style={delay(i * 0.3)} />
            ))}
            {/* Ground-effect craft skimming the water */}
            <g className="art-float">
              <path d="M108 96 C118 88 188 86 212 90 L224 74 H231 L229 91 C231 94 226 97 219 97 L118 99 C110 99 105 98 108 96 Z" fill="#e0f2fe" />
              <path d="M146 96 L172 108 H184 L168 96 Z" fill="#bae6fd" />
              <path d="M214 76 H240 L238 79 H216 Z" fill="#bae6fd" />
              <path d="M122 92 H176" stroke="#0369a1" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>
            {/* Reflection: the flip lives on the outer group, the CSS bob on the inner one. */}
            <g opacity="0.18" transform="translate(0 214) scale(1 -1)">
              <g className="art-float">
                <path d="M108 96 C118 88 188 86 212 90 L224 74 H231 L229 91 C231 94 226 97 219 97 L118 99 C110 99 105 98 108 96 Z" fill="#e0f2fe" />
              </g>
            </g>
          </g>
        </>
      )}
    </Frame>
  );
}

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
          {/* Regression: points and a line settling into place */}
          <path d="M26 130 H152 M26 130 V30" stroke={LINE} />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={C} opacity="0.9" />
          ))}
          <path d="M30 122 L150 50" stroke={F} strokeWidth="2.5" strokeLinecap="round" className="art-fit" />
          {/* Error bowl and descent */}
          <path d="M176 130 H304" stroke={LINE} />
          <path d="M178 40 Q235 150 292 40" fill="none" stroke={VL} strokeWidth="2" />
          <path d={`M${steps.map(([x, y]) => `${x} ${y}`).join(' L')} L235 95`} fill="none" stroke={F} strokeWidth="1.3" strokeDasharray="3 3" />
          {steps.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4.5 - i * 0.6} fill={F} className="art-blink" style={delay(i * 0.35)} />
          ))}
          <circle cx="235" cy="95" r="10" fill={F} opacity="0.25" className="art-pulse" />
          <circle cx="235" cy="95" r="5" fill="#fff" />
          <text x="248" y="118" fill="rgb(255 255 255 / 0.55)" fontFamily="JetBrains Mono, monospace" fontSize="9">
            θ ← θ − η∇E
          </text>
        </>
      )}
    </Frame>
  );
}

function Subnet() {
  const bits = '11000000101010000000000100000000';
  const cellX = (i: number) => 31 + Math.floor(i / 8) * 66.5 + (i % 8) * 7.5;
  return (
    <Frame hue={[C, V]}>
      {({ id }) => (
        <>
          <defs>
            <linearGradient id={`${id}-scan`} x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text x="160" y="40" textAnchor="middle" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="700">
            192.168.1.0<tspan fill={C}>/24</tspan>
          </text>
          {bits.split('').map((b, i) => {
            const net = i < 24;
            return (
              <g key={i}>
                <rect x={cellX(i)} y="58" width="6.5" height="20" rx="1.5" fill={net ? 'rgb(34 211 238 / 0.22)' : 'rgb(168 85 247 / 0.18)'} stroke={net ? C : VL} strokeOpacity="0.7" />
                <text x={cellX(i) + 3.25} y="71.5" textAnchor="middle" fill={net ? '#cffafe' : '#e9d5ff'} fontFamily="JetBrains Mono, monospace" fontSize="7">
                  {b}
                </text>
              </g>
            );
          })}
          <rect x="31" y="54" width="12" height="28" fill={`url(#${id}-scan)`} className="art-travel" style={{ '--dx': '246px', animationDuration: '3.6s' } as CSSProperties} />
          {/* Brackets */}
          <path d="M31 88 V94 H225 V88" fill="none" stroke={C} strokeWidth="1.3" />
          <path d="M231 88 V94 H289 V88" fill="none" stroke={VL} strokeWidth="1.3" />
          <text x="128" y="110" textAnchor="middle" fill={C} fontFamily="JetBrains Mono, monospace" fontSize="10">
            255.255.255.0
          </text>
          <text x="260" y="110" textAnchor="middle" fill={VL} fontFamily="JetBrains Mono, monospace" fontSize="10">
            .1 → .254
          </text>
          <text x="160" y="136" textAnchor="middle" fill="rgb(255 255 255 / 0.4)" fontFamily="JetBrains Mono, monospace" fontSize="9">
            broadcast 192.168.1.255
          </text>
        </>
      )}
    </Frame>
  );
}

function Schema() {
  const tables = [
    { name: 'brand', x: 18, y: 18 },
    { name: 'model', x: 18, y: 96 },
    { name: 'vehicle', x: 128, y: 57, main: true },
    { name: 'sale', x: 238, y: 18 },
    { name: 'customer', x: 238, y: 96 },
  ];
  return (
    <Frame hue={[C, E]}>
      {({ id }) => (
        <>
          {/* Relations, with data flowing along them */}
          <path d="M50 64 V96 M82 118 H105 V90 H128 M192 79 H214 V40 H238 M270 96 V64" fill="none" stroke={LINE} strokeWidth="1.5" />
          <path d="M50 64 V96 M82 118 H105 V90 H128 M192 79 H214 V40 H238 M270 96 V64" fill="none" stroke={C} strokeWidth="1.2" className="art-dash" />
          {/* Crow's feet on the "many" side */}
          <path d="M45 96 L50 90 L55 96 M122 85 L128 90 L122 95 M232 35 L238 40 L232 45 M265 64 L270 70 L275 64" fill="none" stroke={C} strokeWidth="1.2" />
          {tables.map((t) => (
            <g key={t.name} className={t.main ? 'art-float' : undefined}>
              <rect x={t.x} y={t.y} width="64" height="46" rx="6" fill={PANEL} stroke={t.main ? `url(#${id}-vc)` : LINE} strokeWidth={t.main ? 1.6 : 1} />
              <path d={`M${t.x} ${t.y + 14} H${t.x + 64}`} stroke={LINE} />
              <text x={t.x + 7} y={t.y + 10} fill={t.main ? '#fff' : 'rgb(255 255 255 / 0.8)'} fontFamily="JetBrains Mono, monospace" fontSize="7.5" fontWeight="700">
                {t.name}
              </text>
              <circle cx={t.x + 9} cy={t.y + 21} r="2" fill={A} />
              {[0, 1, 2].map((r) => (
                <rect key={r} x={t.x + 14} y={t.y + 19 + r * 8} width={[34, 42, 26][r]} height="3" rx="1.5" fill="rgb(255 255 255 / 0.2)" />
              ))}
            </g>
          ))}
          {/* Car */}
          <g transform="translate(140 118)" opacity="0.9">
            <path d="M0 14 L4 6 C6 3 10 1 16 1 H26 C31 1 34 3 37 6 L42 8 C45 9 46 11 46 14 V17 H0 Z" fill="none" stroke={E} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="11" cy="17" r="4" fill={PANEL} stroke={E} strokeWidth="1.5" />
            <circle cx="36" cy="17" r="4" fill={PANEL} stroke={E} strokeWidth="1.5" />
          </g>
        </>
      )}
    </Frame>
  );
}

function TimeCruise() {
  const stars: [number, number][] = [
    [22, 22], [58, 40], [94, 16], [130, 34], [30, 66], [150, 60], [270, 20], [300, 50], [286, 120], [118, 128], [20, 120], [304, 90],
  ];
  return (
    <Frame hue={[A, V]}>
      {({ id }) => (
        <>
          {stars.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#fde68a" className="art-blink" style={delay((i * 0.37) % 2)} />
          ))}
          {/* Time portal */}
          <ellipse cx="206" cy="80" rx="50" ry="60" fill={`url(#${id}-glow)`} />
          <ellipse cx="206" cy="80" rx="48" ry="58" fill="none" stroke={A} strokeWidth="1.5" strokeDasharray="30 10 4 10" className="art-spin" />
          <ellipse cx="206" cy="80" rx="36" ry="44" fill="none" stroke={VL} strokeWidth="1.5" strokeDasharray="18 8" className="art-spin" style={{ animationDirection: 'reverse', animationDuration: '9s' }} />
          <ellipse cx="206" cy="80" rx="24" ry="29" fill="rgb(168 85 247 / 0.12)" stroke={F} strokeDasharray="6 5" className="art-spin" style={{ animationDuration: '6s' }} />
          {/* Clock */}
          <circle cx="206" cy="80" r="13" fill={PANEL} stroke="#fde68a" strokeWidth="1.5" />
          <path d="M206 80 V71" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" className="art-hand" style={{ transformOrigin: '206px 80px', animationDuration: '2s' }} />
          <path d="M206 80 H212" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" className="art-hand" style={{ transformOrigin: '206px 80px', animationDuration: '24s' }} />
          {/* Cruise ship heading into it */}
          <g className="art-float">
            <path d="M40 112 H150 L138 128 H54 Z" fill="#fef3c7" />
            <path d="M40 112 H150 L147 116 H43 Z" fill={A} />
            <rect x="62" y="100" width="66" height="12" rx="2" fill="#fde68a" />
            <rect x="74" y="90" width="42" height="10" rx="2" fill="#fef3c7" />
            <rect x="104" y="80" width="9" height="10" rx="1" fill={V} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={69 + i * 10} cy="106" r="1.6" fill={V} />
            ))}
          </g>
          <path d="M20 132 H46 M10 138 H40 M150 132 H168" stroke="rgb(253 230 138 / 0.4)" strokeWidth="1.3" strokeLinecap="round" className="art-blink" />
        </>
      )}
    </Frame>
  );
}

function Dorm() {
  const lit = [1, 4, 6, 8, 11, 13, 15, 18];
  return (
    <Frame hue={[C, V]}>
      {() => (
        <>
          {/* Student list */}
          <rect x="22" y="36" width="100" height="92" rx="8" fill={PANEL} stroke={LINE} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              {i === 1 && <rect x="28" y={46 + i * 20} width="88" height="16" rx="4" fill="rgb(34 211 238 / 0.14)" stroke="rgb(34 211 238 / 0.5)" />}
              <circle cx="38" cy={54 + i * 20} r="4.5" fill={i === 1 ? C : 'rgb(255 255 255 / 0.25)'} />
              <rect x="48" y={51 + i * 20} width={[48, 56, 40, 52][i]} height="3" rx="1.5" fill="rgb(255 255 255 / 0.3)" />
              <rect x="48" y={57 + i * 20} width="26" height="2.5" rx="1.25" fill="rgb(255 255 255 / 0.14)" />
            </g>
          ))}
          <path d="M116 74 C140 74 150 60 190 60" fill="none" stroke={C} strokeWidth="1.5" className="art-dash" />
          {/* Residence */}
          <path d="M150 34 L220 16 L290 34" fill="none" stroke={LINE} strokeWidth="1.5" />
          <rect x="152" y="34" width="136" height="110" rx="3" fill={PANEL} stroke={LINE} />
          {Array.from({ length: 20 }, (_, i) => {
            const on = lit.includes(i);
            const x = 162 + (i % 5) * 25;
            const y = 44 + Math.floor(i / 5) * 24;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="16"
                height="14"
                rx="2"
                fill={on ? (i % 3 ? C : A) : 'rgb(255 255 255 / 0.04)'}
                fillOpacity={on ? 0.75 : 1}
                stroke="rgb(255 255 255 / 0.12)"
                className={on ? 'art-blink' : undefined}
                style={on ? { ...delay((i * 0.29) % 2.2), animationDuration: '3.2s' } : undefined}
              />
            );
          })}
          <rect x="187" y="128" width="12" height="16" fill="rgb(255 255 255 / 0.1)" />
        </>
      )}
    </Frame>
  );
}

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
          {/* Shelves */}
          {[72, 132].map((y, s) => (
            <g key={y}>
              {books(y, s * 3).map((b, i) => (
                <g key={i} transform={i === 6 && s === 0 ? `rotate(-14 ${b.x + 11} ${y})` : undefined}>
                  <rect x={b.x} y={b.y} width="11" height={b.h} rx="1.5" fill={b.c} fillOpacity="0.35" stroke={b.c} strokeOpacity="0.8" />
                  <path d={`M${b.x + 2.5} ${b.y + 6} H${b.x + 8.5}`} stroke={b.c} />
                </g>
              ))}
              <rect x="18" y={y} width="130" height="4" rx="2" fill="rgb(255 255 255 / 0.25)" />
            </g>
          ))}
          {/* UML use cases */}
          <rect x="204" y="18" width="104" height="124" rx="8" fill="none" stroke={LINE} strokeDasharray="5 4" />
          <g className="art-float">
            <circle cx="178" cy="62" r="7" fill="none" stroke="#fff" strokeWidth="1.6" />
            <path d="M178 69 V92 M166 77 H190 M178 92 L168 108 M178 92 L188 108" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </g>
          {[40, 80, 120].map((cy, i) => (
            <g key={cy}>
              <path d={`M190 80 L222 ${cy}`} stroke="rgb(255 255 255 / 0.35)" />
              <ellipse cx="256" cy={cy} rx="36" ry="13" fill="rgb(251 191 36 / 0.08)" stroke={[A, F, VL][i]} strokeWidth="1.5" className="art-pulse" style={delay(i * 0.5)} />
              <rect x="236" y={cy - 1.5} width={[40, 32, 36][i]} height="3" rx="1.5" fill="rgb(255 255 255 / 0.4)" />
            </g>
          ))}
        </>
      )}
    </Frame>
  );
}

function RaspberryPi() {
  const lines = ['$ sudo apt update', '$ apt install python3', '$ apt install mariadb-server', '✓ ready'];
  return (
    <Frame hue={[E, F]}>
      {() => (
        <>
          {/* Board */}
          <rect x="18" y="36" width="126" height="90" rx="7" fill="rgb(22 101 52 / 0.35)" stroke="rgb(52 211 153 / 0.6)" strokeWidth="1.4" />
          {Array.from({ length: 13 }, (_, i) => (
            <g key={i}>
              <rect x={28 + i * 7.5} y="41" width="4" height="4" fill={A} opacity="0.85" />
              <rect x={28 + i * 7.5} y="48" width="4" height="4" fill={A} opacity="0.85" />
            </g>
          ))}
          <rect x="44" y="68" width="34" height="34" rx="3" fill="#0f0f16" stroke="rgb(255 255 255 / 0.3)" />
          <rect x="52" y="76" width="18" height="18" rx="2" fill="rgb(255 255 255 / 0.08)" />
          <path d="M78 76 H100 V70 M78 85 H112 M78 94 H100 V104 H120" fill="none" stroke="rgb(52 211 153 / 0.6)" strokeWidth="1.2" />
          <rect x="130" y="62" width="22" height="18" rx="2" fill="#27272a" stroke={LINE} />
          <rect x="130" y="88" width="22" height="18" rx="2" fill="#27272a" stroke={LINE} />
          <circle cx="30" cy="116" r="2.4" fill="#f87171" className="art-blink" />
          <circle cx="38" cy="116" r="2.4" fill={E} className="art-blink" style={delay(0.7)} />
          <path d="M152 97 C164 97 164 80 172 80" fill="none" stroke={E} strokeWidth="1.3" className="art-dash" />
          {/* Terminal */}
          <Window x={172} y={28} w={136} h={106}>
            {lines.map((l, i) => (
              <text key={l} x="180" y={58 + i * 15} fill={i === lines.length - 1 ? E : 'rgb(255 255 255 / 0.8)'} fontFamily="JetBrains Mono, monospace" fontSize="7.4">
                {l}
              </text>
            ))}
            <rect x="180" y="113" width="5" height="9" fill={E} className="art-blink" style={{ animationDuration: '1s' }} />
          </Window>
        </>
      )}
    </Frame>
  );
}

const PLAYER = ['00111000', '00111000', '00010000', '01111100', '00010000', '00101000', '01000100', '00000000'];
const BOT = ['01111110', '10000001', '10100101', '10000001', '10111101', '10000001', '01111110', '00100100'];

function Sprite({ rows, x, y, color }: { rows: string[]; x: number; y: number; color: string }) {
  return (
    <g>
      {rows.flatMap((row, r) => row.split('').map((b, c) => (b === '1' ? <rect key={`${r}-${c}`} x={x + c * 4} y={y + r * 4} width="4" height="4" fill={color} /> : null)))}
    </g>
  );
}

function Game() {
  return (
    <Frame hue={[V, E]}>
      {() => (
        <>
          <Window x={28} y={16} w={264} h={128}>
            <text x="160" y="46" textAnchor="middle" fill="rgb(255 255 255 / 0.7)" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">
              3 : 2
            </text>
            <path d="M36 126 H284" stroke={LINE} strokeDasharray="4 4" />
          </Window>
          <Sprite rows={PLAYER} x={62} y={92} color={C} />
          <g className="art-float">
            <Sprite rows={BOT} x={222} y={84} color={F} />
          </g>
          {/* Shot travelling toward the AI */}
          <circle cx="98" cy="104" r="3" fill="#fff" className="art-travel" style={{ '--dx': '114px', animationDuration: '2.2s' } as CSSProperties} />
          {/* The AI "thinking": a small decision tree lighting up */}
          <path d="M238 50 L226 64 M238 50 L250 64 M226 64 L220 76 M226 64 L232 76" stroke="rgb(232 121 249 / 0.5)" />
          {[
            [238, 50],
            [226, 64],
            [250, 64],
            [220, 76],
            [232, 76],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={i === 1 || i === 4 ? F : 'rgb(232 121 249 / 0.35)'} className="art-blink" style={delay(i * 0.2)} />
          ))}
        </>
      )}
    </Frame>
  );
}

/** Neural network: weights coloured by sign, neurons lighting up layer after layer (forward propagation). */
function Neural() {
  const layers = [
    { x: 44, n: 3 },
    { x: 116, n: 5 },
    { x: 188, n: 5 },
    { x: 256, n: 1 },
  ];
  const ys = (n: number) => Array.from({ length: n }, (_, j) => (n === 1 ? 78 : 28 + (j * 100) / (n - 1)));
  return (
    <Frame hue={[F, C]}>
      {() => (
        <>
          {layers.slice(1).map((layer, c) =>
            ys(layer.n).map((y2, j) =>
              ys(layers[c].n).map((y1, k) => {
                // Deterministic "weights": sign gives the colour, size the thickness.
                const w = Math.sin((c + 1) * 12.9 + j * 7.3 + k * 3.1);
                return (
                  <line
                    key={`${c}-${j}-${k}`}
                    x1={layers[c].x}
                    y1={y1}
                    x2={layer.x}
                    y2={y2}
                    stroke={w > 0 ? C : F}
                    strokeOpacity={0.15 + 0.45 * Math.abs(w)}
                    strokeWidth={0.6 + 1.3 * Math.abs(w)}
                    className={Math.abs(w) > 0.85 ? 'art-dash' : undefined}
                  />
                );
              }),
            ),
          )}
          {layers.map((layer, c) =>
            ys(layer.n).map((y, j) => (
              <circle
                key={`n-${c}-${j}`}
                cx={layer.x}
                cy={y}
                r={c === layers.length - 1 ? 9 : 6}
                fill={PANEL}
                stroke={c === layers.length - 1 ? A : VL}
                strokeWidth="1.6"
                className="art-blink"
                style={delay(c * 0.35 + j * 0.06)}
              />
            )),
          )}
          <text x="272" y="82" fill="rgb(255 255 255 / 0.7)" fontFamily="JetBrains Mono, monospace" fontSize="11">
            ŷ
          </text>
          {/* The sigmoid, in a corner */}
          <path d="M268 146 H312 M290 150 V116" stroke={LINE} />
          <path d="M270 142 C 284 142, 286 120, 300 120 S 308 119, 312 119" fill="none" stroke={F} strokeWidth="1.8" />
          <text x="272" y="126" fill={F} fontFamily="JetBrains Mono, monospace" fontSize="9">
            σ
          </text>
        </>
      )}
    </Frame>
  );
}

function Generic() {
  return (
    <Frame hue={[V, C]}>
      {({ id }) => (
        <>
          <path d="M80 80 L160 40 L240 80 L160 120 Z" fill="none" stroke={`url(#${id}-vc)`} strokeWidth="1.5" className="art-dash" />
          {[
            [80, 80],
            [160, 40],
            [240, 80],
            [160, 120],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill={[VL, C, F, E][i]} className="art-pulse" style={delay(i * 0.3)} />
          ))}
          <circle cx="160" cy="80" r="10" fill="#fff" />
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

/** Illustration of a project, filling its container. */
export function ProjectArt({ id, className = '' }: { id: string; className?: string }) {
  const Art = ART[id] ?? Generic;
  return (
    <div className={className} data-art={id}>
      <Art />
    </div>
  );
}
