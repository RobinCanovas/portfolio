import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Loader2, Lock, Sparkles, Target } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import { BuildDiagram } from '../components/BuildDiagram';
import { DevicePreview } from '../components/demos/DevicePreview';
import { DeployPipeline } from '../components/lab/DeployPipeline';
import { GradientDescent } from '../components/lab/GradientDescent';
import { SubnetCalculator } from '../components/lab/SubnetCalculator';
import { ProjectArt } from '../components/ProjectArt';
import { ShareButton } from '../components/ShareButton';
import { TechIcon } from '../components/TechIcon';
import { CompanyLogo, LogoTile } from '../components/ui';

const SqlPlayground = lazy(() => import('../components/demos/SqlPlayground').then((m) => ({ default: m.SqlPlayground })));

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function SectionTitle({ kicker, title, id }: { kicker: string; title: string; id: string }) {
  return (
    <motion.div {...fade()} className="mb-6">
      <p className="font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase">{kicker}</p>
      <h2 id={id} className="mt-2 text-3xl font-bold text-white">
        {title}
      </h2>
    </motion.div>
  );
}

export function ProjectPage({ id }: { id: string }) {
  const { t } = useLang();
  const c = useContent();
  const project = c.findProject(id);
  if (!project) return null;
  const { projects } = c;
  const exp = project.experienceId ? c.findExperience(project.experienceId) : undefined;
  const index = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="relative isolate overflow-hidden pt-28 pb-14">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="animate-aurora absolute top-[-30%] left-[20%] size-[55vmax] rounded-full bg-[conic-gradient(from_90deg,#7c3aed66,#06b6d444,#db277733,#7c3aed66)] opacity-50 blur-[120px]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <a href={href.section('projects')} className="inline-flex items-center gap-1.5 text-sm text-zinc-300 transition hover:text-white">
              <ArrowLeft className="size-4" aria-hidden="true" /> {t('page.allProjects')}
            </a>
            <ShareButton title={`${project.title} · Robin Canovas`} />
          </div>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex flex-wrap items-center gap-3">
                {exp && <CompanyLogo company={exp.company} size={44} />}
                {exp?.client && <LogoTile sources={exp.client.logos} name={exp.client.name} size={44} fallback={null} />}
                {exp?.client?.parent && <LogoTile sources={exp.client.parent.logos} name={exp.client.parent.name} size={44} fallback={null} />}
                <p className="font-mono text-xs tracking-[0.2em] text-cyan-300 uppercase">
                  {project.context} · {project.year}
                </p>
              </div>
              <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{project.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300">{project.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-zinc-300">
                    <TechIcon tech={tech} className="size-3.5" /> {c.tech(tech)}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotateY: -14 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1200 }}
              className="glow-border relative mx-auto w-full max-w-xl rounded-3xl lg:max-w-none"
            >
              <ProjectArt id={project.id} className="aspect-[2/1] overflow-hidden rounded-3xl" />
            </motion.div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-24 sm:px-6">
        {project.confidential && (
          <motion.aside {...fade()} className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-amber-400/[0.05] p-6 sm:p-8">
            <div aria-hidden="true" className="absolute -top-16 -right-16 size-56 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="relative flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 shadow-[0_0_30px_rgb(251_191_36/0.3)]">
                <Lock className="size-6 text-amber-300" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-amber-100">{t('page.whyHidden')}</h2>
                <p className="mt-2 leading-relaxed text-amber-100/80">{project.confidential}</p>
                {exp && (
                  <a href={href.experience(exp.id)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-200 hover:text-white">
                    {t('page.readMission')} <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </motion.aside>
        )}

        {/* Problem / outcome */}
        <section className="grid gap-5 lg:grid-cols-2" aria-label={t('page.context')}>
          <motion.div {...fade()} className="glass spotlight rounded-3xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-violet-300 uppercase">
              <Target className="size-4" aria-hidden="true" /> {t('page.challenge')}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-200">{project.problem}</p>
          </motion.div>
          <motion.div {...fade(0.1)} className="glass spotlight rounded-3xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-emerald-300 uppercase">
              <Sparkles className="size-4" aria-hidden="true" /> {t('page.result')}
            </h2>
            <ul className="mt-4 space-y-3">
              {project.outcome.map((o) => (
                <li key={o} className="flex gap-3 text-zinc-200">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* How it's built */}
        <section aria-labelledby="build-title">
          <SectionTitle kicker={t('page.underHood')} title={t('page.howBuilt')} id="build-title" />
          <div className="glass rounded-3xl p-6 sm:p-10">
            <BuildDiagram steps={project.build} />
          </div>
        </section>

        {/* Demos */}
        {project.demo === 'sql' && (
          <section aria-labelledby="demo-title">
            <SectionTitle kicker={t('page.tryIt')} title={t('page.sql')} id="demo-title" />
            <Suspense
              fallback={
                <p className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="size-4 animate-spin" /> {t('page.loading')}
                </p>
              }
            >
              <SqlPlayground />
            </Suspense>
          </section>
        )}
        {(project.demo === 'deploy' || project.demo === 'gradient' || project.demo === 'subnet') && (
          <section aria-labelledby="demo-title">
            <SectionTitle kicker={t('page.tryIt')} title={t('page.liveDemo')} id="demo-title" />
            <div className="glass spotlight rounded-3xl p-5 sm:p-8">
              {project.demo === 'deploy' && <DeployPipeline />}
              {project.demo === 'gradient' && <GradientDescent />}
              {project.demo === 'subnet' && <SubnetCalculator />}
            </div>
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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-[0_0_30px_rgb(168_85_247/0.4)] transition hover:brightness-110"
              >
                {project.demo === 'sql' ? t('page.proposal') : t('page.liveSite')} <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
            {exp && (
              <a href={href.experience(exp.id)} className="glass inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.06]">
                <CompanyLogo company={exp.company} size={28} /> {t('page.aboutMission', { name: exp.company.name })}
              </a>
            )}
          </motion.div>
        )}

        <nav aria-label={t('page.otherProjects')} className="grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
          <a href={href.project(prev.id)} className="group rounded-2xl p-3 transition hover:bg-white/[0.04]">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <ArrowLeft className="size-3.5 transition group-hover:-translate-x-1" aria-hidden="true" /> {t('page.previous')}
            </span>
            <span className="mt-1 block font-medium text-white">{prev.title}</span>
          </a>
          <a href={href.project(next.id)} className="group rounded-2xl p-3 text-right transition hover:bg-white/[0.04]">
            <span className="flex items-center justify-end gap-1.5 text-xs text-zinc-500">
              {t('page.next')} <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="mt-1 block font-medium text-white">{next.title}</span>
          </a>
        </nav>
      </div>
    </article>
  );
}
