import { motion } from 'framer-motion';
import { GraduationCap, Heart, Tent } from 'lucide-react';
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
            <span className="rounded-md border border-violet-400/35 bg-violet-500/15 px-2 py-1.5 text-violet-100" style={{ marginLeft: `${i * 10}%` }}>
              {row.left}
            </span>
            <span className="rounded-md border border-cyan-400/35 bg-cyan-500/15 px-2 py-1.5 text-right text-cyan-100" style={{ marginRight: `${i * 10}%` }}>
              {row.right}
            </span>
          </li>
        ))}
        <li className="col-span-2 mx-auto rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-white">{t('edu.implementation')}</li>
      </ol>
      <figcaption className="mt-3 text-xs text-zinc-400">{t('edu.vmodel.caption')}</figcaption>
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
            <article key={ed.id} className="glass spotlight rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <LogoTile
                  sources={ed.logos}
                  name={ed.school}
                  size={56}
                  fallback={
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
                      <GraduationCap className="size-6" aria-hidden="true" />
                    </span>
                  }
                />
                <div>
                  <h3 className="font-semibold text-white">{ed.degree}</h3>
                  <p className="text-sm text-zinc-300">{ed.school}</p>
                  <p className="font-mono text-xs text-zinc-400">{ed.period}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-200">
                {ed.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-violet-400" aria-hidden="true">
                      ▹
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              {ed.id === 'iut' && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <VModelDiagram />
                </div>
              )}
            </article>
          ))}
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
          <article className="glass spotlight relative overflow-hidden rounded-2xl p-6">
            <div aria-hidden="true" className="absolute -top-10 -right-10 size-40 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="flex items-center gap-4">
              <LogoTile
                sources={volunteering.logos}
                name="EEDF"
                size={56}
                fallback={
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <Tent className="size-6" aria-hidden="true" />
                  </span>
                }
              />
              <div>
                <h3 className="font-semibold text-white">{t('edu.scout')}</h3>
                <p className="text-sm text-zinc-300">{volunteering.org}</p>
                <p className="font-mono text-xs text-zinc-400">{volunteering.since}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5 text-sm text-zinc-200">
              {volunteering.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-400" aria-hidden="true">
                    ▹
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-zinc-400 italic">{t('edu.scoutNote')}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t('edu.values')
                .split('|')
                .map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
            </div>
          </article>

          <article className="glass spotlight rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Heart className="size-4 text-fuchsia-400" aria-hidden="true" /> {t('edu.beyond')}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.map((i) => (
                <span key={i} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-sm text-zinc-200">
                  {i}
                </span>
              ))}
            </div>
          </article>
        </motion.div>
      </div>
    </Section>
  );
}
