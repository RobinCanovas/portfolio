import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, GraduationCap, Tent } from 'lucide-react';
import { educationPages, findEducationPage, pick } from '../data/educationPages';
import { useLang } from '../i18n';
import { href } from '../router';
import { Magnetic } from '../components/fx/effects';
import { ShareButton } from '../components/ShareButton';
import { LogoTile } from '../components/ui';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
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

const creditLink = 'underline decoration-dotted underline-offset-2 hover:text-white';

function Photo({ src, alt, credit, source, position }: { src: string[]; alt: string; credit: string; source?: string; position?: string }) {
  return (
    <figure className="glow-border overflow-hidden rounded-3xl">
      <Img src={src} alt={alt} position={position} className="aspect-[4/3] w-full object-cover" />
      <figcaption className="bg-black/80 px-4 py-2 text-right text-[11px] text-zinc-400">
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
      <header className="relative isolate overflow-hidden pt-28 pb-14">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="animate-aurora absolute top-[-30%] left-[15%] size-[55vmax] rounded-full bg-[conic-gradient(from_90deg,#7c3aed77,#06b6d455,#10b98144,#7c3aed77)] opacity-60 blur-[120px]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <a href={href.section('education')} className="inline-flex items-center gap-1.5 text-sm text-zinc-300 transition hover:text-white">
              <ArrowLeft className="size-4" aria-hidden="true" /> {t('nav.education')}
            </a>
            <ShareButton title={`${page.name} · Robin Canovas`} />
          </div>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-4">
                <LogoTile
                  sources={page.logos}
                  name={page.name}
                  size={72}
                  fallback={
                    <span className="flex size-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-[0_0_30px_rgb(168_85_247/0.5)]">
                      <Fallback className="size-8" aria-hidden="true" />
                    </span>
                  }
                />
                <p className="font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase">{p(page.kicker)}</p>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{page.name}</h1>
              <p className="mt-4 text-xl text-zinc-100 sm:text-2xl">{p(page.title)}</p>
              <p className="mt-2 font-mono text-sm text-zinc-400">{p(page.period)}</p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-200">{p(page.about)}</p>
            </motion.div>
            {page.photo ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
                <Photo src={page.photo.src} alt={p(page.photo.alt)} credit={page.photo.credit} source={page.photo.source} position={page.photo.position} />
                {page.gallery && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {page.gallery.map((g, gi) => (
                      <div key={gi} className="overflow-hidden rounded-2xl border border-white/10">
                        <Img src={g.src} alt={p(g.alt)} position={g.position} lazy className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-105" />
                      </div>
                    ))}
                  </div>
                )}
                {page.galleryCredit && (
                  <p className="mt-2 text-right text-[11px] text-zinc-500">
                    ©{' '}
                    <a href={page.galleryCredit.source} target="_blank" rel="noopener noreferrer" className={creditLink}>
                      {page.galleryCredit.label}
                    </a>
                  </p>
                )}
                {page.gallery?.some((g) => g.credit) && (
                  <p className="mt-2 text-right text-[11px] leading-relaxed text-zinc-500">
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 }}
                className="animate-float justify-self-center"
              >
                <LogoTile sources={page.logos} name={page.name} size={170} fallback={null} />
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-24 sm:px-6">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {page.facts.map((f, i) => (
            <motion.div key={i} {...fade(i * 0.06)} className="glass spotlight rounded-2xl p-4">
              <dt className="sr-only">{p(f.label)}</dt>
              <dd className="text-gradient text-2xl font-bold sm:text-3xl">{p(f.value)}</dd>
              <dd className="mt-1 text-xs text-zinc-300">{p(f.label)}</dd>
            </motion.div>
          ))}
        </dl>

        <div className="grid gap-5 lg:grid-cols-2">
          {page.sections.map((s, i) => (
            <motion.section key={i} {...fade(i * 0.08)} className={`glass spotlight rounded-3xl p-6 sm:p-8 ${i === 0 ? 'lg:col-span-2' : ''}`}>
              <h2 className="text-xl font-semibold text-white">{p(s.title)}</h2>
              {s.text && <p className="mt-3 leading-relaxed text-zinc-200">{p(s.text)}</p>}
              {s.items && (
                <ul className="mt-4 space-y-2.5">
                  {s.items.map((it, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-zinc-200">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      {p(it)}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Magnetic>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-900 shadow-[0_0_30px_rgb(255_255_255/0.25)] transition hover:bg-zinc-200"
            >
              {p(page.urlLabel)} <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Magnetic>
          <a href={href.education(next.id)} className="group inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
            {t('page.next')} · {next.name} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </article>
  );
}
