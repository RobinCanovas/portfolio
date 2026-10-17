import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLang } from '../i18n';
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
  const [index, label] = eyebrow.split(' · ');
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.header initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="relative mb-10 sm:mb-14">
        {/* Chapter number, set large in the italic serif, like a folio in the margin */}
        <motion.span
          aria-hidden="true"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1 } } }}
          className="pointer-events-none absolute -top-12 -left-1 font-serif text-[7rem] leading-none text-ink/[0.07] italic select-none sm:-top-16 sm:text-[10rem]"
        >
          {index}
        </motion.span>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className="relative flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-accent uppercase"
        >
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {label ?? eyebrow}
        </motion.p>
        <motion.h2
          id={`${id}-title`}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
          className="relative mt-3 font-serif text-5xl leading-[1.05] tracking-[-0.01em] text-ink sm:text-6xl"
        >
          {title.split(' ').map((word, i, words) => (
            <Fragment key={i}>
              <motion.span
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                className="inline-block"
              >
                {word}
              </motion.span>
              {/* Real spaces keep the accessible name readable ("Let’s build something"). */}
              {i < words.length - 1 && ' '}
            </Fragment>
          ))}
        </motion.h2>
      </motion.header>
      {children}
    </section>
  );
}

/** Small label in the mono face; `active` sets it in ink, like a stamp. */
export function Badge({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] whitespace-nowrap ${
        active ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-transparent text-ink-2'
      }`}
    >
      {children}
    </span>
  );
}

/**
 * Logo on a white tile. Tries each source in order (local file, then official remote asset)
 * and falls back to `fallback` when every source fails to load.
 */
export function LogoTile({
  sources,
  name,
  size = 48,
  fallback,
}: {
  sources: string[];
  name: string;
  size?: number;
  fallback: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  // Wide wordmarks (e.g. BNP Paribas) get a wider tile instead of shrinking to a sliver.
  const [ratio, setRatio] = useState(1);
  if (index >= sources.length) return <>{fallback}</>;
  const width = ratio > 1.4 ? Math.round(size * Math.min(ratio * 0.75, 2.6)) : size;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 ring-1 ring-ink/10 transition-[width] duration-300"
      style={{ width, height: size }}
    >
      <img
        key={sources[index]}
        src={sources[index]}
        alt={`${name} logo`}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setIndex((i) => i + 1)}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight);
        }}
        className="size-full object-contain"
      />
    </span>
  );
}

export function CompanyLogo({ company, size = 48 }: { company: Company; size?: number }) {
  return <LogoTile sources={company.logos} name={company.name} size={size} fallback={<Monogram company={company} size={size} />} />;
}

/** Generated SVG monogram used when no logo image is reachable: initials set in ink on a paper tile. */
function Monogram({ company, size }: { company: Company; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={`${company.name} logo`} className="shrink-0">
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="8" fill="#fbfaf6" stroke="#1b1915" strokeOpacity=".18" strokeWidth="1.5" />
      <text x="24" y="30" textAnchor="middle" fontFamily="'Instrument Serif', Georgia, serif" fontSize={company.monogram.length > 2 ? 16 : 20} fill="#1b1915">
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
  const { t } = useLang();
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-0 sm:items-center sm:p-6"
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`panel lift max-h-[90dvh] w-full overflow-y-auto rounded-t-xl p-6 outline-none sm:rounded-xl sm:p-8 ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id={titleId} className="font-serif text-3xl leading-tight text-ink">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('modal.close')}
                className="rounded-full p-1.5 text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
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
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
} as const;
