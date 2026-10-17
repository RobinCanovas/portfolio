import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Tent } from 'lucide-react';
import { href } from '../router';
import { useContent, useLang } from '../i18n';
import { Badge, LogoTile, Section, fadeUp } from './ui';

function VModelDiagram() {
  const { t } = useLang();
  const { vModel } = useContent();
  return (
    <figure aria-label={t('edu.vmodel')}>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px] sm:text-xs">
        {vModel.map((row, i) => (
          <li key={row.left} className="contents">
            <span className="rounded border border-ink/20 bg-card px-2 py-1.5 text-ink-2" style={{ marginLeft: `${i * 10}%` }}>
              {row.left}
            </span>
            <span className="rounded border border-ink/20 bg-card px-2 py-1.5 text-right text-ink-2" style={{ marginRight: `${i * 10}%` }}>
              {row.right}
            </span>
          </li>
        ))}
        <li className="col-span-2 mx-auto rounded bg-ink px-3 py-1.5 text-paper">{t('edu.implementation')}</li>
      </ol>
      <figcaption className="mt-3 font-serif text-sm text-ink-3 italic">{t('edu.vmodel.caption')}</figcaption>
    </figure>
  );
}

export function Education() {
  const { t } = useLang();
  const { education, volunteering, interests } = useContent();

  return (
    <Section id="education" eyebrow={t('section.education')} title={t('section.education.title')}>
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div {...fadeUp} className="space-y-6">
          {education.map((ed) => (
            <a key={ed.id} href={href.education(ed.id)} className="panel group block rounded-xl p-6 transition-colors duration-300 hover:border-ink/35 sm:p-7">
              <div className="flex items-start gap-4">
                <LogoTile
                  sources={ed.logos}
                  name={ed.school}
                  size={56}
                  fallback={
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-paper-2 text-ink-3">
                      <GraduationCap className="size-6" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  }
                />
                <div>
                  <h3 className="font-serif text-2xl leading-tight text-ink transition-colors duration-200 group-hover:text-accent">{ed.degree}</h3>
                  <p className="mt-1 text-sm text-ink-2">{ed.school}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-3">{ed.period}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-1.5 text-sm leading-relaxed text-ink-2">
                {ed.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-ink-4" aria-hidden="true">
                      –
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              {ed.id === 'iut' && (
                <div className="mt-6 border-t border-ink/10 pt-5">
                  <VModelDiagram />
                </div>
              )}
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-ink-2 transition-colors group-hover:text-ink">
                {t('exp.discover')} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          ))}
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
          <a href={href.education('eedf')} className="panel group relative block overflow-hidden rounded-xl p-6 transition-colors duration-300 hover:border-ink/35 sm:p-7">
            <div className="flex items-center gap-4">
              <LogoTile
                sources={volunteering.logos}
                name="EEDF"
                size={56}
                fallback={
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-good/10 text-good">
                    <Tent className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                }
              />
              <div>
                <h3 className="font-serif text-2xl leading-tight text-ink transition-colors duration-200 group-hover:text-accent">{t('edu.scout')}</h3>
                <p className="mt-1 text-sm text-ink-2">{volunteering.org}</p>
                <p className="mt-0.5 font-mono text-xs text-ink-3">{volunteering.since}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5 text-sm leading-relaxed text-ink-2">
              {volunteering.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-ink-4" aria-hidden="true">
                    –
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-serif text-lg leading-snug text-ink-2 italic">{t('edu.scoutNote')}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t('edu.values')
                .split('|')
                .map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-ink-2 transition-colors group-hover:text-ink">
              {t('exp.discover')} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </a>

          <article className="border-t border-ink/10 pt-6">
            <h3 className="font-mono text-[11px] tracking-[0.22em] text-ink-3 uppercase">{t('edu.beyond')}</h3>
            <p className="mt-4 font-serif text-2xl leading-relaxed text-ink">
              {interests.map((i, n) => (
                <span key={i}>
                  {i}
                  {n < interests.length - 1 && (
                    <span className="mx-2.5 text-accent" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </p>
          </article>
        </motion.div>
      </div>
    </Section>
  );
}
