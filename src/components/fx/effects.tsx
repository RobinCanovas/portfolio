import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden={idx !== i}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Elements running infinite CSS animations (see index.css). */
const LOOPING = '[data-art]';

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
