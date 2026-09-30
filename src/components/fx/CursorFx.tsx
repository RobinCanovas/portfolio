import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [role="option"], [role="tab"], label';

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const hasFinePointer = () => window.matchMedia?.('(pointer: fine)').matches ?? false;

/**
 * Global pointer effects:
 * - writes --mx/--my on the hovered `.spotlight` element (luminous card borders),
 * - a glowing custom cursor with a lagging ring that swells over interactive elements (mouse only),
 * - a soft light that follows the pointer across the page.
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

  return (
    <>
      {/* Ambient light following the pointer */}
      <motion.div
        aria-hidden="true"
        style={{ x: lightX, y: lightY }}
        className="pointer-events-none fixed top-0 left-0 z-0 -mt-[300px] -ml-[300px] hidden size-[600px] rounded-full bg-[radial-gradient(circle,rgb(168_85_247/0.10),rgb(34_211_238/0.05)_40%,transparent_70%)] pointer-fine:block"
      />
      {/* Custom cursor (mouse only) */}
      <div className="pointer-events-none fixed inset-0 z-[80] hidden [html.has-cursor_&]:block" aria-hidden="true">
        <motion.div
          ref={ringRef}
          style={{ x: ringX, y: ringY, scale: ringScale }}
          className="absolute top-0 left-0 -mt-4 -ml-4 size-8 rounded-full border border-violet-300/70 opacity-0 shadow-[0_0_20px_rgb(168_85_247/0.3)] mix-blend-screen transition-opacity"
        />
        <motion.div style={{ x, y }} className="absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-cyan-200 shadow-[0_0_12px_4px_rgb(34_211_238/0.4)]" />
      </div>
    </>
  );
}
