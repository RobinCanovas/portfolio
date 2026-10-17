import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Lock, PlayCircle } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import type { Tech } from '../types';
import { ProjectVisual } from './ProjectVisual';
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
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200 ${
                on ? 'border-ink bg-ink text-paper' : 'border-ink/15 text-ink-2 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {tech !== 'All' && <TechIcon tech={tech} className={`size-3.5 ${on ? 'opacity-80 brightness-[3]' : ''}`} />}
              {tech === 'All' ? allLabel : c.tech(tech)} <span className={on ? 'text-paper/60' : 'text-ink-4'}>{count}</span>
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
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
                className="flex min-w-0"
              >
                <a
                  href={href.project(p.id)}
                  onPointerEnter={() => replay(p.id)}
                  onFocus={() => replay(p.id)}
                  className="panel group relative flex w-full flex-col overflow-hidden rounded-xl p-5 transition-colors duration-300 hover:border-ink/35"
                >
                  <div className="-mx-5 -mt-5 mb-4 aspect-[2.3/1] overflow-hidden border-b border-ink/10">
                    <ProjectVisual id={p.id} replay={replays[p.id]} className="size-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      {exp && <CompanyLogo company={exp.company} size={24} />}
                      <span className="truncate font-mono text-[11px] text-ink-3">{p.context}</span>
                    </span>
                    {p.confidential ? (
                      <Lock className="size-4 shrink-0 text-ochre" aria-label={t('exp.confidential')} />
                    ) : (
                      p.featured && <Badge active>{t('proj.featured')}</Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-[1.15] text-ink transition-colors duration-200 group-hover:text-accent">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.description}</p>

                  {p.outcome[0] && (
                    <p className="mt-4 border-l-2 border-accent/70 pl-3 text-[13px] leading-snug text-ink">
                      <span className="mb-0.5 block font-mono text-[10px] tracking-[0.16em] text-accent uppercase">{t('page.result')}</span>
                      {p.outcome[0]}
                    </p>
                  )}

                  <div className="mt-4 mb-5 flex flex-wrap gap-1.5">
                    {p.stack.map((tech) => (
                      <Badge key={tech} active={tech === filter}>
                        {c.tech(tech)}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-4 text-xs">
                    {p.demo ? (
                      <span className="inline-flex items-center gap-1.5 text-good">
                        <PlayCircle className="size-4" strokeWidth={1.75} aria-hidden="true" /> {t('proj.demo')}
                      </span>
                    ) : (
                      <span className="font-mono text-ink-3">{p.year}</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-ink-2 transition-colors group-hover:text-ink">
                      {t('proj.case')} <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
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
