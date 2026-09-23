import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Lock, PlayCircle } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import type { Tech } from '../types';
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
                on ? 'border-violet-400 bg-violet-500/25 text-white shadow-[0_0_16px_rgb(168_85_247/0.4)]' : 'border-white/15 text-zinc-300 hover:border-white/30 hover:text-white'
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
          {visible.map((p) => {
            const exp = p.experienceId ? c.findExperience(p.experienceId) : undefined;
            return (
              <motion.li
                key={p.id}
                id={`project-${p.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex"
              >
                <a
                  href={href.project(p.id)}
                  className="glass spotlight group relative flex w-full flex-col overflow-hidden rounded-2xl p-5 transition duration-500 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-900/30"
                >
                  <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-violet-500/25 opacity-0 blur-3xl transition group-hover:opacity-100" />
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
