import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../../i18n';

/** Floating "back to top" button whose ring fills as the page is read. */
export function BackToTop() {
  const { t } = useLang();
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 700));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label={t('top')}
          title={t('top')}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="group fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-black/70 text-zinc-200 shadow-[0_0_30px_-6px_rgb(168_85_247/0.7)] backdrop-blur transition-colors hover:text-white sm:right-8 sm:bottom-8"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="top-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a855f7" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" />
            <motion.circle cx="24" cy="24" r="22" fill="none" stroke="url(#top-ring)" strokeWidth="2" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp className="relative size-5 transition group-hover:-translate-y-0.5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const parisTime = () => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(new Date());

/** Live local time in Paris, so visitors abroad know when I’m likely to answer. */
export function LocalTime() {
  const { t } = useLang();
  const [time, setTime] = useState(parisTime);
  useEffect(() => {
    const id = window.setInterval(() => setTime(parisTime()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-2" title={t('footer.time')}>
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
      </span>
      <span className="sr-only">{t('footer.time')}:</span>
      Paris · <time className="text-zinc-300 tabular-nums">{time}</time>
    </span>
  );
}

function RevealWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const blur = useTransform(progress, range, ['blur(3px)', 'blur(0px)']);
  return <motion.span style={{ opacity, filter: blur }}>{children}</motion.span>;
}

/** Paragraph whose words light up one after another as it scrolls through the viewport. */
export function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.6'] });
  const still = typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const words = text.split(' ');

  if (still) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <RevealWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </RevealWord>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </p>
  );
}

/** A friendly note for the developers who open the console. */
export function greetDevelopers() {
  console.log(
    '%c Robin Canovas %c Hi, fellow developer! Try Ctrl K, or the Konami code (↑ ↑ ↓ ↓ ← → ← → B A).',
    'background:linear-gradient(90deg,#a855f7,#22d3ee);color:#fff;font-weight:700;padding:4px 8px;border-radius:6px',
    'color:#a1a1aa;padding-left:6px',
  );
}
