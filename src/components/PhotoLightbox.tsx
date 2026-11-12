import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLang } from '../i18n';

export interface Photo {
  src: string;
  alt: string;
}

/** Full-screen photo viewer: arrows or swipe-free keys, thumbnails, Esc or backdrop click to close. */
export function PhotoLightbox({ photos, start = 0, title, onClose }: { photos: Photo[]; start?: number; title: string; onClose: () => void }) {
  const { t } = useLang();
  const [index, setIndex] = useState(start);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = photos.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [go, onClose]);

  const photo = photos[index];
  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-center justify-between text-sm text-paper/80" onClick={(e) => e.stopPropagation()}>
        <span>
          {title} · {index + 1}/{count}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t('lightbox.close')} className="rounded-full p-2 text-paper hover:bg-paper/10">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
        {count > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label={t('lightbox.prev')}
            className="absolute left-0 z-10 rounded-full bg-ink/50 p-2.5 text-paper hover:bg-ink/80 sm:-left-1"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={photo.src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex max-h-full max-w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={photo.src} alt={photo.alt} className="max-h-[68vh] max-w-full rounded-md object-contain sm:max-h-[72vh]" />
            <figcaption className="mt-3 max-w-2xl text-center text-sm text-paper/80">{photo.alt}</figcaption>
          </motion.figure>
        </AnimatePresence>
        {count > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label={t('lightbox.next')}
            className="absolute right-0 z-10 rounded-full bg-ink/50 p-2.5 text-paper hover:bg-ink/80 sm:-right-1"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}/${count}`}
              aria-current={i === index}
              className={`size-12 overflow-hidden rounded-md ring-2 transition sm:size-14 ${i === index ? 'ring-paper' : 'opacity-60 ring-transparent hover:opacity-100'}`}
            >
              <img src={p.src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>,
    document.body,
  );
}
