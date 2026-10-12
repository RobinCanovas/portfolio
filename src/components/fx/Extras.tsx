import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../../i18n';

/** Small "back to top" button; its hairline ring fills in as the page is read. */
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-full bg-card text-ink-2 transition-colors hover:text-ink sm:right-8 sm:bottom-8"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="23" fill="none" stroke="var(--color-rule)" strokeWidth="1.5" />
            <motion.circle cx="24" cy="24" r="23" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp className="relative size-4 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
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
      <span className="size-1.5 rounded-full bg-good" aria-hidden="true" />
      <span className="sr-only">{t('footer.time')}:</span>
      Paris · <time className="text-ink-2 tabular-nums">{time}</time>
    </span>
  );
}

/** A sentence set apart like a pull quote in a printed article. */
export function PullQuote({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative pl-8 sm:pl-10 ${className}`}
    >
      <span aria-hidden="true" className="absolute top-0 left-0 font-serif text-[1.6em] leading-none text-accent">
        “
      </span>
      {text}
    </motion.p>
  );
}

/** A friendly note for the developers who open the console. */
export function greetDevelopers() {
  console.log(
    '%c Robin Canovas %c Hi, fellow developer! Try Ctrl K, or the Konami code (↑ ↑ ↓ ↓ ← → ← → B A).',
    'background:#1b1915;color:#f4f1ea;font-weight:600;padding:4px 8px;border-radius:4px',
    'color:#77705f;padding-left:6px',
  );
}
