import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Lock, PlayCircle } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import type { Tech } from '../types';
import { ProjectArt } from './ProjectArt';
import { TechIcon } from './TechIcon';
import { Badge, CompanyLogo, Section } from './ui';

interface Props {
  filter: Tech | 'All';
  onFilter: (tech: Tech | 'All') => void;
}

export function Projects({ filter, onFilter }: Props) {
  const { t, lang } = useLang();
  const c = useContent();
  const visible = useMemo(() => (filter === 'All' ? c.projects : c.projects.filter((p) => p.stack.includes(filter))), [filter, c.projects]);
  const allLabel = lang === 'fr' ? 'Tous' : 'All';
  // Hovering (or focusing) a card tells its illustration's story again.
  const [replays, setReplays] = useState<Record<string, number>>({});
  const replay = (id: string) => setReplays((r) => ({ ...r, [id]: (r[id] ?? 0) + 1 }));

  return (
    <Section id="projects" eyebrow={t('section.projects')} title={t('section.projects.title')}>
      <div role="toolbar" aria-label={t('proj.filter')} className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {(['All', ...c.projectFilters] as const).map((tech) => {
          const count = tech === 'All' ? c.projects.length : c.projects.filter((p) => p.stack.includes(tech)).length;
          const on = filter === tech;
          return (
            <button
              key={tech}
              type="button"
              aria-pressed={on}
              onClick={() => onFilter(tech)}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 font-mono text-xs transition ${
                on ? 'border-violet-400 bg-violet-500/25 text-white shadow-[0_0_16px_rgb(168_85_247/0.2)]' : 'border-white/15 text-zinc-300 hover:border-white/30 hover:text-white'
              }`}
            >
              <TechIcon tech={tech} className="size-3.5" />
              {tech === 'All' ? allLabel : c.tech(tech)} <span className="text-zinc-500">{count}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => {
            const exp = p.experienceId ? c.findExperience(p.experienceId) : undefined;
            return (
              <motion.li
                key={p.id}
                id={`project-${p.id}`}
                layout
                // Cards come up as they scroll into view, a beat apart across a row.
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] } }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                transition={{ layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
                className="flex min-w-0"
              >
                <a
                  href={href.project(p.id)}
                  onPointerEnter={() => replay(p.id)}
                  onFocus={() => replay(p.id)}
                  className="glass spotlight group relative flex w-full flex-col overflow-hidden rounded-2xl p-5 transition duration-500 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-900/30"
                >
                  <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-violet-500/25 opacity-0 blur-3xl transition duration-700 group-hover:opacity-100" />
                  <div className="-mx-5 -mt-5 mb-4 aspect-[2.3/1] overflow-hidden border-b border-white/10">
                    <ProjectArt id={p.id} replay={replays[p.id]} className="size-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      {exp && <CompanyLogo company={exp.company} size={26} />}
                      <span className="truncate font-mono text-[11px] text-cyan-300">{p.context}</span>
                    </span>
                    {p.confidential ? (
                      <Lock className="size-4 shrink-0 text-amber-300" aria-label={t('exp.confidential')} />
                    ) : (
                      p.featured && <Badge active>{t('proj.featured')}</Badge>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{p.description}</p>

                  <ul className="mt-4 space-y-1 text-xs text-zinc-300">
                    {p.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="text-violet-400" aria-hidden="true">
                          ▹
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map((tech) => (
                      <Badge key={tech} active={tech === filter}>
                        {c.tech(tech)}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-5 text-xs">
                    {p.demo ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-300">
                        <PlayCircle className="size-4" aria-hidden="true" /> {t('proj.demo')}
                      </span>
                    ) : (
                      <span className="text-zinc-400">{p.year}</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-zinc-300 transition group-hover:text-white">
                      {t('proj.case')} <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </Section>
  );
}
