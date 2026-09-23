import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Company } from '../types';

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-10 sm:mb-14"
      >
        <p className="font-mono text-xs tracking-widest text-cyan-300 uppercase">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
      </motion.header>
      {children}
    </section>
  );
}

export function Badge({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
        active ? 'border-violet-400/60 bg-violet-500/20 text-violet-200' : 'border-white/10 bg-white/5 text-zinc-300'
      }`}
    >
      {children}
    </span>
  );
}

/** Generated SVG logo tile — swap for a real <img> when official logos are available. */
export function CompanyLogo({ company, size = 48 }: { company: Company; size?: number }) {
  const gid = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={`${company.name} logo`} className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={company.gradient[0]} />
          <stop offset="1" stopColor={company.gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${gid})`} />
      <rect x="1" y="1" width="46" height="46" rx="11" fill="none" stroke="white" strokeOpacity=".25" />
      <text
        x="24"
        y="29.5"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize={company.monogram.length > 2 ? 13 : 16}
        fill="white"
      >
        {company.monogram}
      </text>
    </svg>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Keep the latest onClose without re-running the focus/scroll-lock effect on every parent render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={`glass max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-zinc-950/90 p-6 shadow-2xl shadow-violet-900/30 outline-none sm:rounded-2xl ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
} as const;
