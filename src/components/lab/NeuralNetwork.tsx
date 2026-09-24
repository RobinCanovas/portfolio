import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useLang } from '../../i18n';
import { createNetwork, makeBlobs, makeCircles, predict, seeded, trainStep, type Dataset, type Network } from '../../lib/neural';

type DataKind = 'circles' | 'blobs';
type ModelKind = 'neuron' | 'twoLayers' | 'deep';

const DIMS: Record<ModelKind, number[]> = { neuron: [2, 1], twoLayers: [2, 8, 1], deep: [2, 8, 8, 1] };
const MAX_ITER = 3000;
const STEPS_PER_FRAME = 4;
const SIZE = 480;
const RANGE = 1.6;
const GRID = 64;

const makeData = (kind: DataKind) => (kind === 'circles' ? makeCircles : makeBlobs)(160, seeded(7));

/** Canvas colours: class 0 violet, class 1 cyan. */
const C0 = [168, 85, 247];
const C1 = [34, 211, 238];

/**
 * A real neural network (sigmoid layers, log loss, back-propagation) training live in the browser:
 * the background shows the network's prediction at every point of the plane.
 */
export function NeuralNetwork() {
  const { t } = useLang();
  const [data, setData] = useState<DataKind>('circles');
  const [model, setModel] = useState<ModelKind>('twoLayers');
  const [lr, setLr] = useState(1);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({ iter: 0, loss: 0, accuracy: 0 });
  const [history, setHistory] = useState<number[]>([]);
  const [, setVersion] = useState(0);

  const dataset = useRef<Dataset>(makeData('circles'));
  const net = useRef<Network>(createNetwork(DIMS.twoLayers, seeded(7)));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lrRef = useRef(lr);
  lrRef.current = lr;
  const iterRef = useRef(0);
  const seedRef = useRef(7);

  const reset = useCallback((d: DataKind, m: ModelKind) => {
    seedRef.current += 1;
    dataset.current = makeData(d);
    net.current = createNetwork(DIMS[m], seeded(seedRef.current));
    iterRef.current = 0;
    setStats({ iter: 0, loss: 0, accuracy: 0 });
    setHistory([]);
    setRunning(false);
    setVersion((v) => v + 1);
  }, []);

  // Training loop: a few gradient steps per frame, until paused, converged or out of iterations.
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      let last = { loss: 0, accuracy: 0 };
      for (let i = 0; i < STEPS_PER_FRAME; i++) last = trainStep(net.current, dataset.current, lrRef.current);
      iterRef.current += STEPS_PER_FRAME;
      setStats({ iter: iterRef.current, ...last });
      setHistory((h) => [...h.slice(-179), last.loss]);
      if (iterRef.current >= MAX_ITER || last.loss < 0.01) {
        setRunning(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Prediction map and points.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const off = document.createElement('canvas');
    off.width = GRID;
    off.height = GRID;
    const octx = off.getContext('2d');
    if (!octx) return;
    const img = octx.createImageData(GRID, GRID);
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const x = -RANGE + ((i + 0.5) / GRID) * 2 * RANGE;
        const y = RANGE - ((j + 0.5) / GRID) * 2 * RANGE;
        const p = predict(net.current, [x, y]);
        const o = (j * GRID + i) * 4;
        img.data[o] = C0[0] + (C1[0] - C0[0]) * p;
        img.data[o + 1] = C0[1] + (C1[1] - C0[1]) * p;
        img.data[o + 2] = C0[2] + (C1[2] - C0[2]) * p;
        img.data[o + 3] = 40 + 110 * Math.abs(p - 0.5) * 2;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#0b0b10';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, SIZE, SIZE);
    // Axes.
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(SIZE / 2, 0);
    ctx.lineTo(SIZE / 2, SIZE);
    ctx.moveTo(0, SIZE / 2);
    ctx.lineTo(SIZE, SIZE / 2);
    ctx.stroke();
    // Points.
    const { X, y } = dataset.current;
    X.forEach(([px, py], k) => {
      const sx = ((px + RANGE) / (2 * RANGE)) * SIZE;
      const sy = ((RANGE - py) / (2 * RANGE)) * SIZE;
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = y[k] ? '#67e8f9' : '#e879f9';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#0b0b10';
      ctx.stroke();
    });
  });

  const stuck = model === 'neuron' && data === 'circles' && stats.iter >= 300 && stats.accuracy < 0.75;
  const maxLoss = Math.max(0.8, ...history);

  const pill = (on: boolean) =>
    `rounded-lg border px-3 py-1.5 font-mono text-xs transition ${on ? 'border-violet-400 bg-violet-500/25 text-white' : 'border-white/15 text-zinc-300 hover:border-white/30 hover:text-white'}`;

  return (
    <div>
      <h3 className="text-xl font-semibold text-white">{t('nn.title')}</h3>
      <p className="mt-1 text-sm text-zinc-400">{t('nn.help')}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="group" aria-label={t('nn.data')} className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">{t('nn.data')}</span>
          {(['circles', 'blobs'] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={data === d}
              onClick={() => {
                setData(d);
                reset(d, model);
              }}
              className={pill(data === d)}
            >
              {t(d === 'circles' ? 'nn.circles' : 'nn.blobs')}
            </button>
          ))}
        </div>
        <div role="group" aria-label={t('nn.model')} className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">{t('nn.model')}</span>
          {(['neuron', 'twoLayers', 'deep'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={model === m}
              onClick={() => {
                setModel(m);
                reset(data, m);
              }}
              className={pill(model === m)}
            >
              {t(m === 'neuron' ? 'nn.neuron' : m === 'twoLayers' ? 'nn.twoLayers' : 'nn.deep')}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label={t('nn.canvas')}
          className="aspect-square w-full rounded-2xl border border-white/10"
        />

        <div className="flex flex-col gap-4">
          <NetworkDiagram net={net.current} dims={DIMS[model]} />

          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: t('gd.iter'), value: String(stats.iter) },
              { label: t('nn.loss'), value: stats.iter ? stats.loss.toFixed(3) : '·' },
              { label: t('nn.accuracy'), value: stats.iter ? `${Math.round(stats.accuracy * 100)} %` : '·' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                <dt className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{s.label}</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-white tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          <svg viewBox="0 0 180 60" className="h-16 w-full rounded-xl border border-white/10 bg-white/[0.02]" aria-hidden="true" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="url(#nn-loss)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              points={history.map((l, i) => `${(i / 179) * 180},${56 - (l / maxLoss) * 52}`).join(' ')}
            />
            <defs>
              <linearGradient id="nn-loss" x1="0" x2="1">
                <stop offset="0" stopColor="#e879f9" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>

          <label className="block">
            <span className="flex justify-between font-mono text-xs text-zinc-400">
              {t('nn.lr')} <span className="text-white">{lr.toFixed(1)}</span>
            </span>
            <input type="range" min={0.1} max={4} step={0.1} value={lr} onChange={(e) => setLr(Number(e.target.value))} className="mt-1 w-full accent-violet-500" />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => (stats.iter >= MAX_ITER ? (reset(data, model), setRunning(true)) : setRunning((r) => !r))}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgb(168_85_247/0.4)] transition hover:brightness-110"
            >
              {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />} {running ? t('gd.pause') : t('gd.train')}
            </button>
            <button type="button" onClick={() => reset(data, model)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5">
              <RotateCcw className="size-4" aria-hidden="true" /> {t('gd.reset')}
            </button>
          </div>

          {stuck && (
            <p role="status" className="rounded-xl border border-amber-300/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              {t('nn.stuck')}
            </p>
          )}
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-zinc-400">{t('nn.note')}</p>
    </div>
  );
}

/** Live architecture: edge colour = weight sign (cyan positive, pink negative), thickness = size. */
function NetworkDiagram({ net, dims }: { net: Network; dims: number[] }) {
  const W = 300;
  const H = 150;
  const x = (c: number) => 24 + (c * (W - 48)) / (dims.length - 1);
  const y = (c: number, j: number) => (dims[c] === 1 ? H / 2 : 14 + (j * (H - 28)) / (dims[c] - 1));
  const labels = ['x₁', 'x₂'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-white/[0.02]" aria-hidden="true">
      {net.map((layer, c) => {
        const max = Math.max(1e-6, ...layer.W.flat().map(Math.abs));
        return layer.W.map((row, j) =>
          row.map((w, k) => (
            <line
              key={`${c}-${j}-${k}`}
              x1={x(c)}
              y1={y(c, k)}
              x2={x(c + 1)}
              y2={y(c + 1, j)}
              stroke={w >= 0 ? '#22d3ee' : '#e879f9'}
              strokeOpacity={0.15 + 0.75 * (Math.abs(w) / max)}
              strokeWidth={0.4 + 2 * (Math.abs(w) / max)}
            />
          )),
        );
      })}
      {dims.map((n, c) =>
        Array.from({ length: n }, (_, j) => (
          <g key={`n-${c}-${j}`}>
            <circle cx={x(c)} cy={y(c, j)} r={c === 0 || c === dims.length - 1 ? 7 : 5} fill="#0b0b10" stroke={c === dims.length - 1 ? '#fbbf24' : '#c084fc'} strokeWidth="1.5" />
            {c === 0 && (
              <text x={x(c) - 12} y={y(c, j) + 3} textAnchor="end" fontSize="9" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
                {labels[j]}
              </text>
            )}
          </g>
        )),
      )}
      <text x={x(dims.length - 1) + 12} y={H / 2 + 3} fontSize="9" fill="#a1a1aa" fontFamily="JetBrains Mono, monospace">
        ŷ
      </text>
    </svg>
  );
}
