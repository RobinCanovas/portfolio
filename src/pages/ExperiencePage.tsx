import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Lock } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import type { Client, KeyFact } from '../types';
import { ShareButton } from '../components/ShareButton';
import { Badge, CompanyLogo, LogoTile } from '../components/ui';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const label = 'font-mono text-[11px] tracking-[0.25em] uppercase';

/** Key figures in a ruled row, like the data box of a magazine profile. */
function Facts({ facts }: { facts: KeyFact[] }) {
  if (facts.length === 0) return null;
  return (
    <motion.dl {...fade()} className="grid grid-cols-2 border-y border-ink/10 sm:grid-cols-4">
      {facts.map((f, i) => (
        <div key={f.label} className={`px-4 py-5 sm:px-5 ${i % 2 === 1 ? 'border-l border-ink/10' : ''} ${i > 1 ? 'border-t border-ink/10 sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l sm:border-ink/10' : ''}`}>
          <dt className="sr-only">{f.label}</dt>
          <dd className="font-serif text-3xl leading-none text-ink sm:text-4xl">{f.value}</dd>
          <dd className="mt-2 text-xs leading-snug text-ink-3">{f.label}</dd>
        </div>
      ))}
    </motion.dl>
  );
}

function ClientBlock({ client, notice }: { client: Client; notice?: string }) {
  const { t } = useLang();
  const c = useContent();
  return (
    <motion.section {...fade()} aria-labelledby="client-title" className="panel rounded-xl p-6 sm:p-9">
      <p className={`${label} text-good`}>{t('page.endClient')}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <LogoTile sources={client.logos} name={client.name} size={64} fallback={<span className="font-serif text-2xl text-ink">{client.name}</span>} />
        {client.parents?.map((p) => (
          <span key={p.name} className="contents">
            <span className="font-serif text-xl text-ink-4" aria-hidden="true">
              ×
            </span>
            <LogoTile sources={p.logos} name={p.name} size={64} fallback={<span className="font-serif text-xl text-ink">{p.name}</span>} />
          </span>
        ))}
        <div className="min-w-0">
          <h2 id="client-title" className="font-serif text-3xl leading-tight text-ink">
            {client.name}
          </h2>
          {client.parents && <p className="text-sm text-good">{c.group(client.parents.map((p) => p.name))}</p>}
        </div>
      </div>
      <p className="mt-5 max-w-3xl leading-relaxed text-ink-2">{client.about}</p>
      {client.facts.length > 0 && (
        <div className="mt-7">
          <Facts facts={client.facts} />
        </div>
      )}
      {notice && (
        <div className="mt-7 flex gap-3 rounded-r-lg border-l-2 border-ochre bg-ochre/[0.07] p-4 text-sm leading-relaxed text-ink-2">
          <Lock className="mt-0.5 size-4 shrink-0 text-ochre" aria-hidden="true" />
          <p>{notice}</p>
        </div>
      )}
    </motion.section>
  );
}

export function ExperiencePage({ id }: { id: string }) {
  const { t } = useLang();
  const c = useContent();
  const exp = c.findExperience(id);
  if (!exp) return null;
  const { experiences } = c;
  const { company } = exp;
  const index = experiences.findIndex((e) => e.id === exp.id);
  const prev = experiences[(index - 1 + experiences.length) % experiences.length];
  const next = experiences[(index + 1) % experiences.length];
  const related = (exp.projectIds ?? []).map(c.findProject).filter((p) => p !== undefined);

  const meta = [c.contract(exp.contract), exp.period, exp.duration, exp.location, c.mode(exp.mode)];

  return (
    <article>
      <header className="pt-28 pb-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <a href={href.section('experience')} className="group inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink">
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" /> {t('page.allExperience')}
            </a>
            <ShareButton title={`${company.name} · Robin Canovas`} />
          </div>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <p className={`${label} text-ink-3`}>{company.sector}</p>
              <h1 className="mt-3 font-serif text-5xl leading-[1] tracking-[-0.01em] text-ink sm:text-7xl">{company.name}</h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-serif text-2xl text-ink-2 italic sm:text-3xl">
                {exp.role}
                {exp.current && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-good uppercase not-italic">
                    <span className="size-1.5 rounded-full bg-good" aria-hidden="true" /> {t('exp.current')}
                  </span>
                )}
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-ink-3">
                {meta.map((m, i) => (
                  <li key={m} className="inline-flex items-center gap-2">
                    {i > 0 && (
                      <span className="text-ink-4" aria-hidden="true">
                        /
                      </span>
                    )}
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="justify-self-start lg:justify-self-end"
            >
              <CompanyLogo company={company} size={120} />
            </motion.div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-24 sm:px-6">
        {/* About the company */}
        <motion.section {...fade()} aria-labelledby="about-title" className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div className="border-t border-ink pt-5">
            <p className={`${label} text-ink-3`}>{t('page.company')}</p>
            <h2 id="about-title" className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              {t('page.about', { name: company.name })}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">{company.about}</p>
          </div>
          {company.visual ? (
            <div className="flex items-center justify-center rounded-xl bg-card p-6 ring-1 ring-ink/10">
              <LogoTile sources={company.visual.src} name={company.visual.alt} size={200} fallback={<CompanyLogo company={company} size={120} />} />
            </div>
          ) : (
            <div className="self-start border-l-2 border-accent pl-6">
              <p className={`${label} text-accent`}>{t('page.inShort')}</p>
              <p className="mt-3 font-serif text-2xl leading-snug text-ink">{exp.summary}</p>
            </div>
          )}
        </motion.section>

        <Facts facts={company.facts} />

        {exp.client && <ClientBlock client={exp.client} notice={exp.confidential} />}

        {/* Missions */}
        <section aria-labelledby="missions-title">
          <motion.h2 {...fade()} id="missions-title" className="font-serif text-4xl leading-tight text-ink sm:text-[2.6rem]">
            {t('page.myRole')}
          </motion.h2>
          {company.visual && <p className="mt-3 max-w-3xl text-ink-2">{exp.summary}</p>}
          <div className={`mt-8 grid gap-10 ${exp.missions.length > 1 ? 'lg:grid-cols-2 lg:gap-14' : ''}`}>
            {exp.missions.map((group, gi) => (
              <motion.div key={group.title} {...fade(gi * 0.08)} className="border-t border-ink pt-5">
                <h3 className="font-serif text-2xl text-ink">{group.title}</h3>
                <ul className="mt-3 divide-y divide-ink/10">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 py-3 text-[15px] leading-relaxed text-ink-2">
                      <Check className="mt-1 size-4 shrink-0 text-good" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stack & skills */}
        {(exp.stack.length > 0 || exp.skills.length > 0) && (
          <motion.section {...fade()} aria-label={t('page.skillsUsed')} className="flex flex-wrap gap-2">
            {exp.stack.map((tech) => (
              <Badge key={tech} active>
                {c.tech(tech)}
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
            <h2 id="related-title" className={`${label} text-ink-3`}>
              {t('page.project')}
            </h2>
            <ul className="mt-4 border-b border-ink/10">
              {related.map((p) => (
                <li key={p.id} className="border-t border-ink/10">
                  <a href={href.project(p.id)} className="group flex items-center justify-between gap-6 py-5">
                    <span>
                      <span className="block font-mono text-[11px] text-ink-3">{p.context}</span>
                      <span className="mt-1 block font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">{p.title}</span>
                      <span className="mt-1 block max-w-3xl text-sm text-ink-2">{p.description}</span>
                    </span>
                    <ArrowRight className="size-5 shrink-0 text-ink-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Website, after the story */}
        {company.url && (
          <motion.div {...fade()} className="flex flex-col items-start gap-5 border-y border-ink py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-2xl text-ink sm:text-3xl">{t('page.more', { name: company.name })}</p>
            <a href={company.url} target="_blank" rel="noopener noreferrer" className="btn-ink inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 font-medium">
              {t('page.visit')} <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </motion.div>
        )}

        {/* Prev / next */}
        <nav aria-label={t('page.otherExperiences')} className="grid border-t border-ink sm:grid-cols-2">
          <a href={href.experience(prev.id)} className="group flex items-center gap-4 py-6 pr-6">
            <ArrowLeft className="size-4 shrink-0 text-ink-3 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-ink" aria-hidden="true" />
            <CompanyLogo company={prev.company} size={40} />
            <span>
              <span className="block font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">{t('page.previous')}</span>
              <span className="font-serif text-xl text-ink transition-colors group-hover:text-accent">{prev.company.name}</span>
            </span>
          </a>
          <a href={href.experience(next.id)} className="group flex items-center justify-end gap-4 border-t border-ink/10 py-6 text-right sm:border-t-0 sm:border-l sm:pl-6">
            <span>
              <span className="block font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">{t('page.next')}</span>
              <span className="font-serif text-xl text-ink transition-colors group-hover:text-accent">{next.company.name}</span>
            </span>
            <CompanyLogo company={next.company} size={40} />
            <ArrowRight className="size-4 shrink-0 text-ink-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </article>
  );
}
