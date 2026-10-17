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

    // Graph paper: faint ink grid, residuals in vermilion, the fitted line and points in ink.
    ctx.strokeStyle = 'rgba(27,25,21,0.07)';
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
      ctx.strokeStyle = 'rgba(178,60,28,0.55)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(X(p.x), Y(p.y));
      ctx.lineTo(X(p.x), Y(model.w * p.x + model.b));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = '#1b1915';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X(0), Y(model.b));
    ctx.lineTo(X(1), Y(model.w + model.b));
    ctx.stroke();

    for (const p of points) {
      ctx.fillStyle = '#1b1915';
      ctx.strokeStyle = '#fbfaf6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(X(p.x), Y(p.y), 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
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
        <h3 className="font-serif text-2xl text-ink">{t('gd.title')}</h3>
        <p className="mt-1 text-sm text-ink-2">{t('gd.help')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <canvas
          ref={canvasRef}
          onPointerDown={addPoint}
          className="aspect-[16/9] w-full cursor-crosshair rounded-lg border border-ink/10 bg-card"
          role="img"
          aria-label={t('gd.title')}
        />
        <div className="space-y-3">
          <div className="rounded-lg border border-ink/10 bg-paper p-4 font-mono text-sm">
            <p className="text-ink-3">ŷ = w·x + b</p>
            <p className="mt-1 text-ink">
              w = <span className="text-accent">{nf(model.w)}</span>
            </p>
            <p className="text-ink">
              b = <span className="text-accent">{nf(model.b)}</span>
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-paper p-4">
            <p className="flex justify-between font-mono text-[10px] tracking-wider text-ink-3 uppercase">
              <span>{t('gd.loss')}</span>
              <span>
                {t('gd.iter')} {iter}
              </span>
            </p>
            <p className="mt-1 font-mono text-lg text-good">{nf(loss, 4)}</p>
            <svg viewBox="0 0 100 32" className="mt-2 h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={spark} fill="none" stroke="#2e6b45" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <label className="block text-xs text-ink-2">
            <span className="flex justify-between">
              {t('gd.lr')} <span className="font-mono">η = {lr.toFixed(2)}</span>
            </span>
            <input type="range" min={0.05} max={1.2} step={0.05} value={lr} onChange={(e) => setLr(Number(e.target.value))} className="mt-1 w-full accent-[#b23c1c]" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="btn-ink inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium"
            >
              {running ? <Pause className="size-4" /> : <Play className="size-4" />} {running ? t('gd.pause') : t('gd.train')}
            </button>
            <button type="button" onClick={() => advance(1)} className="btn-line inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm">
              <StepForward className="size-4" /> {t('gd.step')}
            </button>
            <button type="button" onClick={reset} aria-label={t('gd.reset')} className="btn-line rounded-full px-3 py-2">
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-ink-3">{t('gd.note')}</p>
    </div>
  );
}
