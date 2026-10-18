import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Loader2, Lock, PlayCircle } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import { BuildDiagram } from '../components/BuildDiagram';
import { DevicePreview } from '../components/demos/DevicePreview';
import { DeployPipeline } from '../components/lab/DeployPipeline';
import { GradientDescent } from '../components/lab/GradientDescent';
import { SubnetCalculator } from '../components/lab/SubnetCalculator';
import { NeuralNetwork } from '../components/lab/NeuralNetwork';
import { CodeBlock } from '../components/CodeBlock';
import { hasCapture, ProjectVisual } from '../components/ProjectVisual';
import { ShareButton } from '../components/ShareButton';
import { TechIcon } from '../components/TechIcon';
import { CompanyLogo, LogoTile } from '../components/ui';

const SqlPlayground = lazy(() => import('../components/demos/SqlPlayground').then((m) => ({ default: m.SqlPlayground })));

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function SectionTitle({ kicker, title, id }: { kicker: string; title: string; id: string }) {
  return (
    <motion.div {...fade()} className="mb-7">
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
        <span className="h-px w-6 bg-accent" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-[2.6rem]">
        {title}
      </h2>
    </motion.div>
  );
}

export function ProjectPage({ id }: { id: string }) {
  const { t } = useLang();
  const c = useContent();
  const [replay, setReplay] = useState(0);
  const project = c.findProject(id);
  if (!project) return null;
  const { projects } = c;
  const exp = project.experienceId ? c.findExperience(project.experienceId) : undefined;
  const index = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <a href={href.section('projects')} className="group inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink">
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" /> {t('page.allProjects')}
            </a>
            <ShareButton title={`${project.title} · Robin Canovas`} />
          </div>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex flex-wrap items-center gap-3">
                {exp && <CompanyLogo company={exp.company} size={40} />}
                {exp?.client && <LogoTile sources={exp.client.logos} name={exp.client.name} size={40} fallback={null} />}
                {exp?.client?.parents?.map((p) => <LogoTile key={p.name} sources={p.logos} name={p.name} size={40} fallback={null} />)}
                <p className="font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">
                  {project.context} · {project.year}
                </p>
              </div>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.01em] text-ink sm:text-6xl">{project.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2">{project.description}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className="group inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 font-mono text-xs text-ink-2">
                    <TechIcon tech={tech} className="size-3.5" /> {c.tech(tech)}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-xl lg:max-w-none"
            >
              {/* A drawn story plays on arrival, and again on hover. */}
              <div onPointerEnter={() => setReplay((n) => n + 1)} className="overflow-hidden rounded-xl bg-card ring-1 ring-ink/10">
                <ProjectVisual id={project.id} autoplay replay={replay} className="aspect-[2/1] w-full" />
              </div>
              <figcaption className="mt-2.5 text-sm text-ink-3">
                <span className="font-mono text-[10px] tracking-[0.18em] text-ink-2 uppercase">{t('page.plate', { n: String(index + 1).padStart(2, '0') })}</span>
                <span className="font-serif italic"> — {hasCapture(project.id) ? t('page.plateDemo') : t('page.plateStory')}</span>
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-20 px-4 pb-24 sm:px-6">
        {project.confidential && (
          <motion.aside {...fade()} className="flex gap-4 rounded-r-lg border-l-2 border-ochre bg-ochre/[0.07] p-6 sm:p-7">
            <Lock className="mt-1 size-5 shrink-0 text-ochre" aria-hidden="true" />
            <div>
              <h2 className="font-serif text-2xl leading-tight text-ink">{t('page.whyHidden')}</h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-ink-2">{project.confidential}</p>
              {exp && (
                <a href={href.experience(exp.id)} className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ochre transition-colors hover:text-ink">
                  {t('page.readMission')} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </motion.aside>
        )}

        {/* Problem / outcome */}
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-14" aria-label={t('page.context')}>
          <motion.div {...fade()} className="border-t border-ink pt-5">
            <h2 className="font-mono text-[11px] tracking-[0.25em] text-ink-3 uppercase">{t('page.challenge')}</h2>
            <p className="mt-4 font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">{project.problem}</p>
          </motion.div>
          <motion.div {...fade(0.1)} className="border-t border-ink pt-5">
            <h2 className="font-mono text-[11px] tracking-[0.25em] text-ink-3 uppercase">{t('page.result')}</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {project.outcome.map((o) => (
                <li key={o} className="flex gap-3 py-2.5 text-ink-2">
                  <Check className="mt-1 size-4 shrink-0 text-good" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* How it's built */}
        <section aria-labelledby="build-title">
          <SectionTitle kicker={t('page.underHood')} title={t('page.howBuilt')} id="build-title" />
          <div className="panel rounded-xl p-6 sm:p-10">
            <BuildDiagram steps={project.build} />
          </div>
        </section>

        {/* The maths, formula by formula */}
        {project.maths && (
          <section aria-labelledby="maths-title">
            <SectionTitle kicker={t('page.mathsKicker')} title={t('page.maths')} id="maths-title" />
            <ol className="grid gap-4 md:grid-cols-2">
              {project.maths.map((m, i) => (
                <motion.li key={m.title} {...fade(i * 0.05)} className="panel rounded-xl p-5 sm:p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl leading-none text-ink-4 italic" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3 className="font-serif text-xl text-ink">{m.title}</h3>
                  </div>
                  <p className="mt-3 overflow-x-auto rounded-lg border border-ink/10 bg-paper px-4 py-3 font-mono text-[13px] whitespace-pre text-ink">{m.formula}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{m.text}</p>
                </motion.li>
              ))}
            </ol>
          </section>
        )}

        {/* Demos */}
        {project.demo === 'sql' && (
          <section aria-labelledby="demo-title">
            <SectionTitle kicker={t('page.tryIt')} title={t('page.sql')} id="demo-title" />
            <Suspense
              fallback={
                <p className="flex items-center gap-2 text-ink-3">
                  <Loader2 className="size-4 animate-spin" /> {t('page.loading')}
                </p>
              }
            >
              <SqlPlayground />
            </Suspense>
          </section>
        )}
        {(project.demo === 'deploy' || project.demo === 'gradient' || project.demo === 'subnet' || project.demo === 'neural') && (
          <section aria-labelledby="demo-title">
            <SectionTitle kicker={t('page.tryIt')} title={t('page.liveDemo')} id="demo-title" />
            <div className="panel rounded-xl p-5 sm:p-8">
              {project.demo === 'deploy' && <DeployPipeline />}
              {project.demo === 'gradient' && <GradientDescent />}
              {project.demo === 'subnet' && <SubnetCalculator />}
              {project.demo === 'neural' && <NeuralNetwork />}
            </div>
          </section>
        )}

        {project.snippet && (
          <section aria-labelledby="code-title">
            <SectionTitle kicker={t('page.codeKicker')} title={t('page.code')} id="code-title" />
            <motion.div {...fade()}>
              <CodeBlock snippet={project.snippet} />
            </motion.div>
          </section>
        )}

        {project.course && (
          <section aria-labelledby="course-title">
            <SectionTitle kicker={t('page.courseKicker')} title={t('page.course')} id="course-title" />
            <motion.div {...fade()} className="panel rounded-xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl text-ink">{project.course.name}</p>
                  <p className="mt-1 text-sm text-ink-3">{project.course.author}</p>
                </div>
                <a href={project.course.url} target="_blank" rel="noopener noreferrer" className="btn-line inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                  <PlayCircle className="size-4 text-accent" aria-hidden="true" /> {t('page.courseWatch')} <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              <ol className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
                {project.course.steps.map((s, i) => (
                  <li key={s} className="flex gap-4 py-2.5 text-ink-2">
                    <span className="w-6 shrink-0 font-mono text-xs leading-6 text-ink-4">{String(i + 1).padStart(2, '0')}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </motion.div>
          </section>
        )}
        {project.demo === 'cwad' && project.demoUrl && (
          <section aria-labelledby="demo-title">
            <SectionTitle kicker={t('page.tryIt')} title={t('page.liveDemo')} id="demo-title" />
            <DevicePreview src={project.demoUrl} title={`${project.title} demo`} />
          </section>
        )}

        {/* Links */}
        {(project.demoUrl || exp) && (
          <motion.div {...fade()} className="flex flex-wrap gap-3">
            {project.demoUrl && project.demo !== 'cwad' && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ink inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium"
              >
                {project.demo === 'sql' ? t('page.proposal') : t('page.liveSite')} <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
            {exp && (
              <a href={href.experience(exp.id)} className="btn-line inline-flex items-center gap-3 rounded-full py-2 pr-5 pl-2 text-sm">
                <CompanyLogo company={exp.company} size={28} /> {t('page.aboutMission', { name: exp.company.name })}
              </a>
            )}
          </motion.div>
        )}

        <nav aria-label={t('page.otherProjects')} className="grid border-t border-ink sm:grid-cols-2">
          <a href={href.project(prev.id)} className="group py-6 pr-6">
            <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">
              <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" /> {t('page.previous')}
            </span>
            <span className="mt-2 block font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">{prev.title}</span>
          </a>
          <a href={href.project(next.id)} className="group border-t border-ink/10 py-6 text-right sm:border-t-0 sm:border-l sm:pl-6">
            <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">
              {t('page.next')} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="mt-2 block font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">{next.title}</span>
          </a>
        </nav>
      </div>
    </article>
  );
}
