import { motion } from 'framer-motion';
import { GraduationCap, Heart, Tent } from 'lucide-react';
import { education, interests, vModel, volunteering } from '../data/profile';
import { Badge, LogoTile, Section, fadeUp } from './ui';

function VModelDiagram() {
  return (
    <figure aria-label="V-Model: each design phase is verified by a matching test phase">
      <ol className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px] sm:text-xs">
        {vModel.map((row, i) => (
          <li key={row.left} className="contents">
            <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-1.5 text-violet-200" style={{ marginLeft: `${i * 10}%` }}>
              {row.left}
            </span>
            <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-1.5 text-right text-cyan-200" style={{ marginRight: `${i * 10}%` }}>
              {row.right}
            </span>
          </li>
        ))}
        <li className="col-span-2 mx-auto rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-white">Implementation</li>
      </ol>
      <figcaption className="mt-3 text-xs text-zinc-500">V-Model applied to IUT team projects.</figcaption>
    </figure>
  );
}

export function Education() {
  return (
    <Section id="education" eyebrow="05 · Background" title="Education & Volunteering">
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div {...fadeUp} className="space-y-6">
          {education.map((ed) => (
            <article key={ed.id} className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <LogoTile
                  sources={ed.logos}
                  name={ed.school}
                  size={52}
                  fallback={
                    <span className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
                      <GraduationCap className="size-6" aria-hidden="true" />
                    </span>
                  }
                />
                <div>
                  <h3 className="font-semibold text-white">{ed.degree}</h3>
                  <p className="text-sm text-zinc-400">{ed.school}</p>
                  <p className="font-mono text-xs text-zinc-500">{ed.period}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                {ed.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-violet-400" aria-hidden="true">▹</span>
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
          <article className="glass relative overflow-hidden rounded-2xl p-6">
            <div aria-hidden="true" className="absolute -top-10 -right-10 size-40 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="flex items-center gap-4">
              <LogoTile
                sources={volunteering.logos}
                name="EEDF"
                size={52}
                fallback={
                  <span className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <Tent className="size-6" aria-hidden="true" />
                  </span>
                }
              />
              <div>
                <h3 className="font-semibold text-white">Scout leader</h3>
                <p className="text-sm text-zinc-400">{volunteering.org}</p>
              </div>
            </div>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-gradient text-6xl font-extrabold">{volunteering.years}+</span>
              <span className="text-sm text-zinc-400">years of commitment</span>
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
              {volunteering.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-400" aria-hidden="true">▹</span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {['Autonomy', 'Team leadership', 'Commitment', 'Event planning'].map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </article>

          <article className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Heart className="size-4 text-fuchsia-400" aria-hidden="true" /> Beyond code
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.map((i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
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
