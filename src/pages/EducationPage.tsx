import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, GraduationCap, Tent } from 'lucide-react';
import { educationPages, findEducationPage, pick } from '../data/educationPages';
import { useLang } from '../i18n';
import { href } from '../router';
import { ShareButton } from '../components/ShareButton';
import { LogoTile } from '../components/ui';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function Img({ src, alt, className, position, lazy = false }: { src: string[]; alt: string; className: string; position?: string; lazy?: boolean }) {
  const [i, setI] = useState(0);
  if (i >= src.length) return null;
  return (
    <img
      src={src[i]}
      alt={alt}
      onError={() => setI((n) => n + 1)}
      referrerPolicy="no-referrer"
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      style={position ? { objectPosition: position } : undefined}
      className={className}
    />
  );
}

const creditLink = 'underline decoration-dotted underline-offset-2 hover:text-ink';

function Photo({ src, alt, credit, source, position }: { src: string[]; alt: string; credit: string; source?: string; position?: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-md ring-1 ring-ink/10">
        <Img src={src} alt={alt} position={position} className="aspect-[4/3] w-full object-cover" />
      </div>
      <figcaption className="mt-2 text-right text-[11px] text-ink-3">
        ©{' '}
        {source ? (
          <a href={source} target="_blank" rel="noopener noreferrer" className={creditLink}>
            {credit}
          </a>
        ) : (
          credit
        )}
      </figcaption>
    </figure>
  );
}

export function EducationPage({ id }: { id: string }) {
  const { t, lang } = useLang();
  const page = findEducationPage(id);
  if (!page) return null;
  const p = (l: Parameters<typeof pick>[0]) => pick(l, lang);
  const index = educationPages.findIndex((e) => e.id === id);
  const next = educationPages[(index + 1) % educationPages.length];
  const Fallback = page.id === 'eedf' ? Tent : GraduationCap;

  return (
    <article>
      <header className="pt-28 pb-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <a href={href.section('education')} className="group inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink">
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" /> {t('nav.education')}
            </a>
            <ShareButton title={`${page.name} · Robin Canovas`} />
          </div>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-4">
                <LogoTile
                  sources={page.logos}
                  name={page.name}
                  size={64}
                  fallback={
                    <span className="flex size-16 items-center justify-center rounded-lg bg-paper-2 text-ink-3">
                      <Fallback className="size-7" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  }
                />
                <p className="font-mono text-[11px] tracking-[0.25em] text-ink-3 uppercase">{p(page.kicker)}</p>
              </div>
              <h1 className="mt-6 font-serif text-5xl leading-[1] tracking-[-0.01em] text-ink sm:text-7xl">{page.name}</h1>
              <p className="mt-4 font-serif text-2xl text-ink-2 italic sm:text-3xl">{p(page.title)}</p>
              <p className="mt-3 font-mono text-xs text-ink-3">{p(page.period)}</p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{p(page.about)}</p>
            </motion.div>
            {page.photo ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
                <Photo src={page.photo.src} alt={p(page.photo.alt)} credit={page.photo.credit} source={page.photo.source} position={page.photo.position} />
                {page.gallery && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {page.gallery.map((g, gi) => (
                      <div key={gi} className="overflow-hidden rounded-md ring-1 ring-ink/10">
                        <Img src={g.src} alt={p(g.alt)} position={g.position} lazy className="aspect-[16/10] w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {page.galleryCredit && (
                  <p className="mt-2 text-right text-[11px] text-ink-3">
                    ©{' '}
                    <a href={page.galleryCredit.source} target="_blank" rel="noopener noreferrer" className={creditLink}>
                      {page.galleryCredit.label}
                    </a>
                  </p>
                )}
                {page.gallery?.some((g) => g.credit) && (
                  <p className="mt-2 text-right text-[11px] leading-relaxed text-ink-3">
                    ©{' '}
                    {page.gallery
                      .filter((g) => g.credit)
                      .map((g, gi) => (
                        <span key={gi}>
                          {gi > 0 && ' · '}
                          <a href={g.credit!.source} target="_blank" rel="noopener noreferrer" className={creditLink}>
                            {g.credit!.label}
                          </a>
                        </span>
                      ))}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="justify-self-center"
              >
                <LogoTile sources={page.logos} name={page.name} size={170} fallback={null} />
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-24 sm:px-6">
        <motion.dl {...fade()} className="grid grid-cols-2 border-y border-ink/10 sm:grid-cols-4">
          {page.facts.map((f, i) => (
            <div key={i} className={`px-4 py-5 sm:px-5 ${i % 2 === 1 ? 'border-l border-ink/10' : ''} ${i > 1 ? 'border-t border-ink/10 sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l sm:border-ink/10' : ''}`}>
              <dt className="sr-only">{p(f.label)}</dt>
              <dd className="font-serif text-3xl leading-none text-ink sm:text-4xl">{p(f.value)}</dd>
              <dd className="mt-2 text-xs leading-snug text-ink-3">{p(f.label)}</dd>
            </div>
          ))}
        </motion.dl>

        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
          {page.sections.map((s, i) => (
            <motion.section key={i} {...fade(i * 0.06)} className={`border-t border-ink pt-5 ${i === 0 ? 'lg:col-span-2' : ''}`}>
              <h2 className="font-serif text-3xl leading-tight text-ink">{p(s.title)}</h2>
              {s.text && <p className={`mt-3 leading-relaxed text-ink-2 ${i === 0 ? 'max-w-3xl text-lg' : ''}`}>{p(s.text)}</p>}
              {s.items && (
                <ul className="mt-3 divide-y divide-ink/10">
                  {s.items.map((it, j) => (
                    <li key={j} className="flex gap-3 py-2.5 text-[15px] leading-relaxed text-ink-2">
                      <Check className="mt-1 size-4 shrink-0 text-good" aria-hidden="true" />
                      {p(it)}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-4 border-t border-ink pt-8">
          <a href={page.url} target="_blank" rel="noopener noreferrer" className="btn-ink inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium">
            {p(page.urlLabel)} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <a href={href.education(next.id)} className="group inline-flex items-center gap-3 text-right">
            <span>
              <span className="block font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">{t('page.next')}</span>
              <span className="font-serif text-xl text-ink transition-colors group-hover:text-accent">{next.name}</span>
            </span>
            <ArrowRight className="size-4 text-ink-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </article>
  );
}
