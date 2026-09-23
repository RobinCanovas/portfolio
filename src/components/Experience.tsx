import { motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { href } from '../router';
import { Badge, CompanyLogo, LogoTile, Section } from './ui';

export function Experience() {
  const { t } = useLang();
  const c = useContent();
  const main = c.experiences.filter((e) => !e.minor);
  const minor = c.experiences.filter((e) => e.minor);

  return (
    <Section id="experience" eyebrow={t('section.experience')} title={t('section.experience.title')}>
      <ol className="relative space-y-6 border-l border-white/10 pl-6 sm:pl-10">
        {main.map((exp, i) => (
          <motion.li
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="relative"
          >
            <span
              aria-hidden="true"
              className={`absolute top-8 -left-[31px] size-3 rounded-full ring-4 ring-ink sm:-left-[47px] ${
                exp.current ? 'bg-emerald-400 shadow-[0_0_12px] shadow-emerald-400' : 'bg-violet-500 shadow-[0_0_10px] shadow-violet-500'
              }`}
            />
            <a href={href.experience(exp.id)} className="glass spotlight group block rounded-2xl p-5 transition hover:border-violet-400/40 sm:p-6">
              <div className="flex items-start gap-4">
                <CompanyLogo company={exp.company} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-semibold text-white">{exp.role}</h3>
                    {exp.current && <Badge active>{t('exp.current')}</Badge>}
                  </div>
                  <p className="text-sm text-zinc-300">
                    {exp.company.name} · {c.contract(exp.contract)} · {c.mode(exp.mode)}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">
                    {exp.period} · {exp.location}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-200">{exp.summary}</p>

                  {exp.client && (
                    <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-3 py-2">
                      <span className="font-mono text-[10px] tracking-widest text-emerald-300 uppercase">{t('exp.client')}</span>
                      <LogoTile sources={exp.client.logos} name={exp.client.name} size={34} fallback={<span className="text-sm text-white">{exp.client.name}</span>} />
                      {exp.client.parent && (
                        <LogoTile sources={exp.client.parent.logos} name={exp.client.parent.name} size={34} fallback={<span className="text-sm text-white">{exp.client.parent.name}</span>} />
                      )}
                      <span className="text-xs text-zinc-200">
                        {exp.client.name} · {exp.client.parent && c.group(exp.client.parent.name)}
                      </span>
                      {exp.confidential && <Lock className="size-3.5 text-amber-300" aria-label={t('exp.confidential')} />}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.stack.map((tech) => (
                      <Badge key={tech}>{c.tech(tech)}</Badge>
                    ))}
                  </div>
                </div>
                <span className="hidden shrink-0 items-center gap-1 text-xs text-zinc-400 transition group-hover:text-white sm:inline-flex">
                  {t('exp.discover')} <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          </motion.li>
        ))}
      </ol>

      {minor.length > 0 && (
        <div className="mt-8 pl-6 sm:pl-10">
          <p className="mb-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">{t('exp.also')}</p>
          <ul className="space-y-2">
            {minor.map((exp) => (
              <li key={exp.id} className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <CompanyLogo company={exp.company} size={28} />
                <span className="text-zinc-200">{exp.role}</span>
                <span>
                  · {exp.company.name} · {exp.duration.toLowerCase()} {exp.period.slice(-4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
