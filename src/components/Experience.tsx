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
      <ol className="border-b border-ink/10">
        {main.map((exp, i) => (
          <motion.li
            key={exp.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-ink/10"
          >
            <a href={href.experience(exp.id)} className="group grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[9.5rem_1fr_auto]">
              {/* Date column, set like the margin notes of a CV */}
              <div className="font-mono text-xs leading-relaxed text-ink-3">
                <p className="text-ink-2">{exp.period}</p>
                <p>{exp.location}</p>
                {exp.current && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-good">
                    <span className="size-1.5 rounded-full bg-good" aria-hidden="true" />
                    {t('exp.current')}
                  </p>
                )}
              </div>

              <div className="flex min-w-0 items-start gap-4">
                <CompanyLogo company={exp.company} size={48} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-2xl leading-tight text-ink transition-colors duration-200 group-hover:text-accent sm:text-[1.75rem]">{exp.role}</h3>
                  <p className="mt-1 text-sm text-ink-2">
                    {exp.company.name} · {c.contract(exp.contract)} · {c.mode(exp.mode)}
                  </p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">{exp.summary}</p>

                  {exp.client && (
                    <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-lg border border-ink/10 bg-card px-3 py-2">
                      <span className="font-mono text-[10px] tracking-widest text-good uppercase">{t('exp.client')}</span>
                      <LogoTile sources={exp.client.logos} name={exp.client.name} size={30} fallback={<span className="text-sm text-ink">{exp.client.name}</span>} />
                      {exp.client.parent && (
                        <LogoTile sources={exp.client.parent.logos} name={exp.client.parent.name} size={30} fallback={<span className="text-sm text-ink">{exp.client.parent.name}</span>} />
                      )}
                      <span className="text-xs text-ink-2">
                        {exp.client.name} · {exp.client.parent && c.group(exp.client.parent.name)}
                      </span>
                      {exp.confidential && <Lock className="size-3.5 text-ochre" aria-label={t('exp.confidential')} />}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.stack.map((tech) => (
                      <Badge key={tech}>{c.tech(tech)}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <span className="hidden shrink-0 items-center gap-1 self-start text-xs text-ink-3 transition-colors group-hover:text-ink sm:inline-flex">
                {t('exp.discover')} <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </a>
          </motion.li>
        ))}
      </ol>

      {minor.length > 0 && (
        <div className="mt-8 sm:pl-[calc(9.5rem+2rem)]">
          <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-3 uppercase">{t('exp.also')}</p>
          <ul className="space-y-2">
            {minor.map((exp) => (
              <li key={exp.id} className="flex flex-wrap items-center gap-3 text-sm text-ink-3">
                <CompanyLogo company={exp.company} size={28} />
                <span className="font-serif text-lg text-ink">{exp.role}</span>
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
