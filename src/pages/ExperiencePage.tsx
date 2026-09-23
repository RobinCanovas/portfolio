import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, CalendarDays, CheckCircle2, Clock, Laptop, Lock, MapPin } from 'lucide-react';
import { experiences, findProject } from '../data/profile';
import { href } from '../router';
import type { Client, Experience, KeyFact } from '../types';
import { Magnetic } from '../components/fx/effects';
import { Badge, CompanyLogo, LogoTile } from '../components/ui';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function Facts({ facts }: { facts: KeyFact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {facts.map((f, i) => (
        <motion.div key={f.label} {...fade(i * 0.06)} className="glass spotlight rounded-2xl p-4">
          <dt className="sr-only">{f.label}</dt>
          <dd className="text-gradient text-xl font-bold sm:text-2xl">{f.value}</dd>
          <dd className="mt-1 text-xs text-zinc-400">{f.label}</dd>
        </motion.div>
      ))}
    </dl>
  );
}

function ClientBlock({ client, notice }: { client: Client; notice?: string }) {
  return (
    <motion.section {...fade()} aria-labelledby="client-title" className="glass spotlight relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div aria-hidden="true" className="absolute -top-20 -right-20 size-72 rounded-full bg-emerald-500/15 blur-3xl" />
      <p className="font-mono text-xs tracking-[0.25em] text-emerald-300 uppercase">End client</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <LogoTile sources={client.logos} name={client.name} size={72} fallback={<span className="text-2xl font-bold text-white">{client.name}</span>} />
        {client.parent && (
          <>
            <span className="text-zinc-600" aria-hidden="true">
              ×
            </span>
            <LogoTile sources={client.parent.logos} name={client.parent.name} size={72} fallback={<span className="font-bold text-white">{client.parent.name}</span>} />
          </>
        )}
        <div className="min-w-0">
          <h2 id="client-title" className="text-2xl font-bold text-white">
            {client.name}
          </h2>
          {client.parent && <p className="text-sm text-emerald-200/80">{client.parent.name} group</p>}
        </div>
      </div>
      <p className="mt-5 max-w-3xl leading-relaxed text-zinc-300">{client.about}</p>
      <div className="mt-6">
        <Facts facts={client.facts} />
      </div>
      {notice && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-300/25 bg-amber-400/[0.06] p-4 text-sm text-amber-100/90">
          <Lock className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden="true" />
          <p>{notice}</p>
        </div>
      )}
    </motion.section>
  );
}

export function ExperiencePage({ exp }: { exp: Experience }) {
  const { company } = exp;
  const index = experiences.findIndex((e) => e.id === exp.id);
  const prev = experiences[(index - 1 + experiences.length) % experiences.length];
  const next = experiences[(index + 1) % experiences.length];
  const related = (exp.projectIds ?? []).map(findProject).filter((p) => p !== undefined);

  const meta = [
    { icon: Briefcase, text: exp.contract },
    { icon: CalendarDays, text: exp.period },
    { icon: Clock, text: exp.duration },
    { icon: MapPin, text: exp.location },
    { icon: Laptop, text: exp.mode },
  ];

  return (
    <article className="relative">
      {/* Hero */}
      <header className="relative isolate overflow-hidden pt-28 pb-16">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div
            className="animate-aurora absolute top-[-30%] left-1/2 size-[60vmax] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
            style={{ background: `conic-gradient(from 90deg, ${company.gradient[0]}, ${company.gradient[1]}, transparent, ${company.gradient[0]})` }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <a href={href.section('experience')} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft className="size-4" aria-hidden="true" /> All experience
          </a>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <p className="font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase">{company.sector}</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{company.name}</h1>
              <p className="mt-4 text-xl text-zinc-200 sm:text-2xl">
                {exp.role}
                {exp.current && (
                  <span className="ml-3 inline-flex translate-y-[-3px] items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 align-middle text-xs text-emerald-300">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" /> Current
                  </span>
                )}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {meta.map((m) => (
                  <li key={m.text} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">
                    <m.icon className="size-3.5 text-zinc-500" aria-hidden="true" /> {m.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 }}
              className="relative justify-self-start lg:justify-self-end"
            >
              <div aria-hidden="true" className="absolute inset-0 scale-150 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${company.gradient[0]}55, transparent 70%)` }} />
              <div className="animate-float relative">
                <CompanyLogo company={company} size={140} />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-24 sm:px-6">
        {/* About the company */}
        <motion.section {...fade()} aria-labelledby="about-title" className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="glass spotlight rounded-3xl p-6 sm:p-8">
            <p className="font-mono text-xs tracking-[0.25em] text-violet-300 uppercase">The company</p>
            <h2 id="about-title" className="mt-2 text-2xl font-bold text-white">
              About {company.name}
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-300">{company.about}</p>
          </div>
          {company.visual ? (
            <div className="glass spotlight flex items-center justify-center overflow-hidden rounded-3xl p-6">
              <LogoTile sources={company.visual.src} name={company.visual.alt} size={220} fallback={<CompanyLogo company={company} size={120} />} />
            </div>
          ) : (
            <div className="glass spotlight flex flex-col justify-center gap-3 rounded-3xl p-6 sm:p-8">
              <p className="font-mono text-xs tracking-[0.25em] text-violet-300 uppercase">In short</p>
              <p className="text-lg text-white">{exp.summary}</p>
            </div>
          )}
        </motion.section>

        <Facts facts={company.facts} />

        {exp.client && <ClientBlock client={exp.client} notice={exp.confidential} />}

        {/* Missions */}
        <section aria-labelledby="missions-title">
          <motion.h2 {...fade()} id="missions-title" className="text-3xl font-bold text-white">
            My role
          </motion.h2>
          {company.visual && <p className="mt-3 max-w-3xl text-zinc-400">{exp.summary}</p>}
          <div className={`mt-6 grid gap-5 ${exp.missions.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {exp.missions.map((group, gi) => (
              <motion.div key={group.title} {...fade(gi * 0.1)} className="glass spotlight rounded-3xl p-6">
                <h3 className="font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className="flex gap-3 text-sm leading-relaxed text-zinc-300"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stack & skills */}
        {(exp.stack.length > 0 || exp.skills.length > 0) && (
          <motion.section {...fade()} aria-label="Skills used" className="flex flex-wrap gap-2">
            {exp.stack.map((t) => (
              <Badge key={t} active>
                {t}
              </Badge>
            ))}
            {exp.skills
              .filter((s) => !exp.stack.includes(s as never))
              .map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
          </motion.section>
        )}

        {/* Related projects */}
        {related.length > 0 && (
          <section aria-labelledby="related-title">
            <h2 id="related-title" className="text-2xl font-bold text-white">
              Project
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <a key={p.id} href={href.project(p.id)} className="glass spotlight group flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5">
                  <span>
                    <span className="block font-mono text-[11px] text-cyan-300/80">{p.context}</span>
                    <span className="mt-1 block font-semibold text-white">{p.title}</span>
                    <span className="mt-1 block text-sm text-zinc-400">{p.description}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Website CTA — the company site comes last, after the story */}
        {company.url && (
          <motion.div {...fade()} className="glass spotlight relative overflow-hidden rounded-3xl p-8 text-center">
            <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 120%, ${company.gradient[0]}, transparent 60%)` }} />
            <p className="relative text-zinc-300">Want to know more about {company.name}?</p>
            <Magnetic className="relative mt-4">
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-zinc-900 shadow-[0_0_40px_rgb(255_255_255/0.25)] transition hover:bg-zinc-200"
              >
                Visit the website <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Magnetic>
          </motion.div>
        )}

        {/* Prev / next */}
        <nav aria-label="Other experiences" className="grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
          <a href={href.experience(prev.id)} className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-white/[0.04]">
            <ArrowLeft className="size-4 text-zinc-500 transition group-hover:-translate-x-1 group-hover:text-white" aria-hidden="true" />
            <CompanyLogo company={prev.company} size={40} />
            <span>
              <span className="block text-xs text-zinc-500">Previous</span>
              <span className="font-medium text-white">{prev.company.name}</span>
            </span>
          </a>
          <a href={href.experience(next.id)} className="group flex items-center justify-end gap-3 rounded-2xl p-3 text-right transition hover:bg-white/[0.04]">
            <span>
              <span className="block text-xs text-zinc-500">Next</span>
              <span className="font-medium text-white">{next.company.name}</span>
            </span>
            <CompanyLogo company={next.company} size={40} />
            <ArrowRight className="size-4 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </article>
  );
}
