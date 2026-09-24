import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ';
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Text that decodes from random glyphs, and scrambles again on hover. */
export function ScrambleText({ text, className = '' }: { text: string; className?: string }) {
  const [out, setOut] = useState(text);
  const frame = useRef(0);

  const run = () => {
    if (reducedMotion()) return;
    cancelAnimationFrame(frame.current);
    let tick = 0;
    const total = text.length * 3 + 12;
    const step = () => {
      tick++;
      setOut(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            return tick > i * 3 + 10 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      if (tick < total) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    run();
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={`inline-grid ${className}`} onMouseEnter={run} aria-label={text}>
      {/* The real text reserves the space so scrambled glyphs never reflow the layout. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap">
        {out}
      </span>
    </span>
  );
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const TiltContext = createContext<{ rx: MotionValue<number>; ry: MotionValue<number> } | null>(null);

/**
 * Tilts its content in 3D toward the mouse (mouse only, never with reduced motion).
 * Children can add depth with <TiltLayer>, which drifts a little further than the card.
 */
export function Tilt({ children, className = '', max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 220, damping: 22 });
  const ry = useSpring(0, { stiffness: 220, damping: 22 });

  return (
    <TiltContext.Provider value={{ rx, ry }}>
      <motion.div
        ref={ref}
        className={className}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || reducedMotion() || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {children}
      </motion.div>
    </TiltContext.Provider>
  );
}

/** Layer inside a <Tilt> that moves with the tilt, `depth` pixels per degree, for a parallax effect. */
export function TiltLayer({ children, depth = 1.5, className = '' }: { children: ReactNode; depth?: number; className?: string }) {
  const ctx = useContext(TiltContext);
  const zero = useMotionValue(0);
  const x = useTransform(ctx?.ry ?? zero, (v) => v * depth);
  const y = useTransform(ctx?.rx ?? zero, (v) => -v * depth);
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

/** Animated number that counts up the first time it scrolls into view. */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion()) return setValue(to);
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

/** Words cycling in place with a vertical slide. */
export function RotatingWords({ words, interval = 2600, className = '' }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      {/* Invisible longest word reserves the width so the layout doesn't jump. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      {words.map((w, idx) => (
        <motion.span
          key={w}
          className="col-start-1 row-start-1"
          initial={false}
          animate={{ y: idx === i ? '0%' : idx === (i - 1 + words.length) % words.length ? '-110%' : '110%', opacity: idx === i ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          aria-hidden={idx !== i}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Elements running infinite CSS animations (see index.css). */
const LOOPING = '[data-art], .glow-border, .animate-aurora, .animate-marquee, .animate-float, .animate-rail, .animate-rail-y, .text-shine, .animate-ping';

/**
 * Energy saver: marks looping animations with `data-offscreen` while they are off screen,
 * and index.css pauses them. One observer for the whole page; new elements (route changes,
 * filtered cards) are picked up by a MutationObserver.
 */
export function usePauseOffscreen() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute('data-offscreen', !e.isIntersecting);
      },
      { rootMargin: '120px' },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(LOOPING).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver((records) => {
      // Stop observing removed elements so they can be garbage-collected.
      for (const r of records) {
        r.removedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          for (const el of [n, ...n.querySelectorAll(LOOPING)]) {
            if (seen.delete(el)) io.unobserve(el);
          }
        });
      }
      scan();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/** Registers the Konami code (↑↑↓↓←→←→BA) and calls `onUnlock`. */
export function useKonami(onUnlock: () => void) {
  useEffect(() => {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      pos = e.key.toLowerCase() === code[pos].toLowerCase() ? pos + 1 : e.key === code[0] ? 1 : 0;
      if (pos === code.length) {
        pos = 0;
        onUnlock();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onUnlock]);
}

export const HYPER_EVENT = 'portfolio:hyper';

/** Toggles the rainbow "hyper mode" easter egg for a few seconds. */
export function triggerHyperMode() {
  const root = document.documentElement;
  root.classList.add('hyper');
  window.dispatchEvent(new CustomEvent(HYPER_EVENT));
  window.setTimeout(() => root.classList.remove('hyper'), 6000);
}
