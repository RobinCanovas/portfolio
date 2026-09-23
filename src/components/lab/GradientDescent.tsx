import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { useLang } from '../../i18n';

export interface Point {
  x: number;
  y: number;
}
export interface Model {
  w: number;
  b: number;
}

/** Mean squared error of y ≈ w·x + b. */
export function mse(points: Point[], { w, b }: Model): number {
  if (points.length === 0) return 0;
  return points.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / points.length;
}

/** One gradient-descent step: θ ← θ − η · ∇MSE(θ). */
export function gradientStep(points: Point[], { w, b }: Model, lr: number): Model {
  const n = points.length;
  if (n === 0) return { w, b };
  let dw = 0;
  let db = 0;
  for (const p of points) {
    const err = w * p.x + b - p.y;
    dw += (2 / n) * err * p.x;
    db += (2 / n) * err;
  }
  return { w: w - lr * dw, b: b - lr * db };
}

const seedPoints = (): Point[] =>
  Array.from({ length: 14 }, (_, i) => {
    const x = 0.06 + (i / 13) * 0.88;
    // Deterministic "noise" so the demo always starts the same way.
    const noise = Math.sin(i * 12.9898) * 0.08;
    return { x, y: 0.2 + 0.6 * x + noise };
  });

const START: Model = { w: -0.4, b: 0.85 };
const W = 640;
const H = 360;

export function GradientDescent() {
  const { t, lang } = useLang();
  const [points, setPoints] = useState<Point[]>(seedPoints);
  const [model, setModel] = useState<Model>(START);
  const [lr, setLr] = useState(0.5);
  const [running, setRunning] = useState(false);
  const [iter, setIter] = useState(0);
  const [history, setHistory] = useState<number[]>(() => [mse(seedPoints(), START)]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ points, model, lr });
  state.current = { points, model, lr };

  const advance = useCallback((steps: number) => {
    let m = state.current.model;
    for (let i = 0; i < steps; i++) m = gradientStep(state.current.points, m, state.current.lr);
    setModel(m);
    setIter((n) => n + steps);
    setHistory((h) => [...h.slice(-119), mse(state.current.points, m)]);
  }, []);

  // Training loop: a few steps per frame, until paused.
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      advance(2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, advance]);

  // Draw points, residuals and the current line.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const X = (x: number) => x * W;
    const Y = (y: number) => H - y * H;

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(X(i / 10), 0);
      ctx.lineTo(X(i / 10), H);
      ctx.moveTo(0, Y(i / 10));
      ctx.lineTo(W, Y(i / 10));
      ctx.stroke();
    }

    for (const p of points) {
      ctx.strokeStyle = 'rgba(244,114,182,0.45)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(X(p.x), Y(p.y));
      ctx.lineTo(X(p.x), Y(model.w * p.x + model.b));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#a855f7');
    grad.addColorStop(1, '#22d3ee');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(168,85,247,0.8)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(X(0), Y(model.b));
    ctx.lineTo(X(1), Y(model.w + model.b));
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (const p of points) {
      ctx.fillStyle = '#e0f2fe';
      ctx.shadowColor = 'rgba(34,211,238,0.9)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(X(p.x), Y(p.y), 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }, [points, model]);

  const addPoint = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    setPoints((pts) => [...pts, p]);
  };

  const reset = () => {
    setRunning(false);
    const pts = seedPoints();
    setPoints(pts);
    setModel(START);
    setIter(0);
    setHistory([mse(pts, START)]);
  };

  const loss = mse(points, model);
  const max = Math.max(...history, 1e-6);
  const spark = history.map((v, i) => `${(i / Math.max(history.length - 1, 1)) * 100},${30 - (v / max) * 28}`).join(' ');
  const nf = (n: number, d = 3) => n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-white">{t('gd.title')}</h3>
        <p className="mt-1 text-sm text-zinc-300">{t('gd.help')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <canvas
          ref={canvasRef}
          onPointerDown={addPoint}
          className="aspect-[16/9] w-full cursor-crosshair rounded-2xl border border-white/10 bg-black/60"
          role="img"
          aria-label={t('gd.title')}
        />
        <div className="space-y-3">
          <div className="glass rounded-xl p-4 font-mono text-sm">
            <p className="text-zinc-400">ŷ = w·x + b</p>
            <p className="mt-1 text-white">
              w = <span className="text-violet-300">{nf(model.w)}</span>
            </p>
            <p className="text-white">
              b = <span className="text-cyan-300">{nf(model.b)}</span>
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="flex justify-between text-[11px] tracking-wide text-zinc-400 uppercase">
              <span>{t('gd.loss')}</span>
              <span>
                {t('gd.iter')} {iter}
              </span>
            </p>
            <p className="mt-1 font-mono text-lg text-emerald-300">{nf(loss, 4)}</p>
            <svg viewBox="0 0 100 32" className="mt-2 h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={spark} fill="none" stroke="#34d399" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <label className="block text-xs text-zinc-300">
            <span className="flex justify-between">
              {t('gd.lr')} <span className="font-mono">η = {lr.toFixed(2)}</span>
            </span>
            <input type="range" min={0.05} max={1.2} step={0.05} value={lr} onChange={(e) => setLr(Number(e.target.value))} className="mt-1 w-full accent-violet-500" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgb(168_85_247/0.4)] hover:brightness-110"
            >
              {running ? <Pause className="size-4" /> : <Play className="size-4" />} {running ? t('gd.pause') : t('gd.train')}
            </button>
            <button type="button" onClick={() => advance(1)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">
              <StepForward className="size-4" /> {t('gd.step')}
            </button>
            <button type="button" onClick={reset} aria-label={t('gd.reset')} className="rounded-lg border border-white/15 px-3 py-2 text-zinc-200 hover:bg-white/5">
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">{t('gd.note')}</p>
    </div>
  );
}
