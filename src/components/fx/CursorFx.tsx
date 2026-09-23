import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [role="option"], [role="tab"], label';

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const hasFinePointer = () => window.matchMedia?.('(pointer: fine)').matches ?? false;

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

/**
 * Global pointer effects:
 * - writes --mx/--my on the hovered `.spotlight` element (luminous card borders),
 * - a glowing custom cursor with a lagging ring that swells over interactive elements (mouse only),
 * - a soft light that follows the pointer across the page,
 * - sparks bursting on every click / tap.
 */
export function CursorFx() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });
  const lightX = useSpring(x, { stiffness: 60, damping: 20 });
  const lightY = useSpring(y, { stiffness: 60, damping: 20 });
  const ringScale = useSpring(1, { stiffness: 400, damping: 25 });
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pointer tracking + spotlight variables.
  useEffect(() => {
    const fine = hasFinePointer() && !prefersReducedMotion();
    if (fine) document.documentElement.classList.add('has-cursor');

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const spot = target?.closest<HTMLElement>('.spotlight');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      ringScale.set(target?.closest(INTERACTIVE) ? 1.9 : 1);
      ringRef.current?.style.setProperty('opacity', '1');
    };
    const onLeave = () => ringRef.current?.style.setProperty('opacity', '0');
    const onDown = () => ringScale.set(0.7);
    const onUp = () => ringScale.set(1);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y, ringScale]);

  // Click sparks on a full-screen canvas, animated only while sparks are alive.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || prefersReducedMotion()) return;

    const sparks: Spark[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy = s.vy * 0.94 + 0.08;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${s.life})`;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 60%, 1)`;
        ctx.shadowBlur = 12;
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = sparks.length ? requestAnimationFrame(tick) : 0;
    };

    const burst = (e: PointerEvent) => {
      const baseHue = 260 + Math.random() * 30;
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
        const speed = 2 + Math.random() * 4;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: i % 3 === 0 ? 190 : baseHue,
          size: 1.5 + Math.random() * 2.5,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', burst);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', burst);
    };
  }, []);

  return (
    <>
      {/* Ambient light following the pointer */}
      <motion.div
        aria-hidden="true"
        style={{ x: lightX, y: lightY }}
        className="pointer-events-none fixed top-0 left-0 z-0 -mt-[300px] -ml-[300px] hidden size-[600px] rounded-full bg-[radial-gradient(circle,rgb(168_85_247/0.10),rgb(34_211_238/0.05)_40%,transparent_70%)] pointer-fine:block"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />
      {/* Custom cursor (mouse only) */}
      <div className="pointer-events-none fixed inset-0 z-[80] hidden [html.has-cursor_&]:block" aria-hidden="true">
        <motion.div
          ref={ringRef}
          style={{ x: ringX, y: ringY, scale: ringScale }}
          className="absolute top-0 left-0 -mt-4 -ml-4 size-8 rounded-full border border-violet-300/70 opacity-0 shadow-[0_0_20px_rgb(168_85_247/0.6)] mix-blend-screen transition-opacity"
        />
        <motion.div style={{ x, y }} className="absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-cyan-200 shadow-[0_0_12px_4px_rgb(34_211_238/0.8)]" />
      </div>
    </>
  );
}
