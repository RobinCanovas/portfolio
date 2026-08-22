import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DIST = 120;
const MOUSE_DIST = 180;

/**
 * Constellation of drifting dots linked by faint lines; dots near the pointer light up,
 * connect to it and are gently pushed away. Pauses when off-screen or when the tab is hidden.
 */
export function ParticleField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = 0;
    let lastMove = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((w * h) / 12000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 0.6 + Math.random() * 1.4,
      }));
    };

    const draw = (now: number) => {
      // Energy saver: about 30 fps while the pointer is idle, full rate while it moves.
      const idle = now - lastMove > 1500;
      if (idle && now - last < 30) {
        raf = visible && !document.hidden && !reduced ? requestAnimationFrame(draw) : 0;
        return;
      }
      // Movement scales with the elapsed time, so the drift speed is the same at any frame rate.
      const step = last ? Math.min(3, (now - last) / 16.7) : 1;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx * step;
          d.y += d.vy * step;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }
        const mdx = d.x - mouse.x;
        const mdy = d.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < MOUSE_DIST && !reduced) {
          // Soft repulsion around the cursor.
          d.x += (mdx / md) * 0.6;
          d.y += (mdy / md) * 0.6;
        }
        const glow = md < MOUSE_DIST ? 1 - md / MOUSE_DIST : 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${Math.round(190 - 150 * glow)}, ${Math.round(160 + 70 * glow)}, 250, ${0.35 + glow * 0.65})`;
        ctx.arc(d.x, d.y, d.r + glow * 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (glow > 0) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${glow * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - dist / LINK_DIST) * 0.22})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = visible && !document.hidden && !reduced ? requestAnimationFrame(draw) : 0;
    };

    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      lastMove = performance.now();
      if (reduced) start();
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const onVisibility = () => !document.hidden && start();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    resize();
    start();
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none size-full ${className}`} />;
}
