import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Calculator, MessagesSquare, ShieldCheck } from 'lucide-react';
import { PullQuote } from './fx/Extras';
import { targetSchools } from '../data/profile';
import { useLang } from '../i18n';
import { Section } from './ui';

/** School logo that falls back through its sources, then to the school name. */
function SchoolLogo({ sources, name }: { sources: string[]; name: string }) {
  const [i, setI] = useState(0);
  if (i >= sources.length) return <span className="font-serif text-lg text-ink">{name}</span>;
  return (
    <img
      src={sources[i]}
      alt={`${name} logo`}
      onError={() => setI((n) => n + 1)}
      referrerPolicy="no-referrer"
      className="max-h-full max-w-full object-contain mix-blend-multiply"
    />
  );
}

const STEPS = [
  { n: 1, state: 'now' },
  { n: 2, state: 'next' },
  { n: 3, state: 'next' },
  { n: 4, state: 'goal' },
] as const;

const PILLARS = [
  { n: 1, icon: Briefcase },
  { n: 2, icon: ShieldCheck },
  { n: 3, icon: MessagesSquare },
  { n: 4, icon: Calculator },
] as const;

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
});

const label = 'font-mono text-[11px] tracking-[0.22em] text-ink-3 uppercase';

export function Goals({ onContact }: { onContact?: () => void }) {
  const { t } = useLang();

  return (
    <Section id="goals" eyebrow={t('section.goals')} title={t('section.goals.title')}>
      <PullQuote key={t('goals.intro')} text={t('goals.intro')} className="-mt-2 mb-20 max-w-4xl font-serif text-3xl leading-[1.2] text-ink sm:text-[2.6rem]" />

      <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Roadmap, read like a table of contents: one ruled line per step, the goal set in vermilion. */}
        <div>
          <h3 className={label}>{t('goals.roadmap')}</h3>
          <ol className="mt-5 border-b border-ink/10">
            {STEPS.map((s, i) => {
              const goal = s.state === 'goal';
              const now = s.state === 'now';
              return (
                <motion.li key={s.n} {...rise(i * 0.08)} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-ink/10 py-6 sm:grid-cols-[3.5rem_1fr]">
                  <span aria-hidden="true" className={`font-serif text-4xl leading-none italic sm:text-5xl ${goal ? 'text-accent' : 'text-ink/25'}`}>
                    {s.n}
                  </span>
                  <div>
                    <span className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase ${goal ? 'text-accent' : now ? 'text-good' : 'text-ink-3'}`}>
                      {now && <span className="size-1.5 rounded-full bg-good" aria-hidden="true" />}
                      {t(`goals.s${s.n}.tag` as const)}
                    </span>
                    <h4 className="mt-1.5 font-serif text-2xl leading-tight text-ink sm:text-[1.7rem]">{t(`goals.s${s.n}.title` as const)}</h4>
                    <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-2">{t(`goals.s${s.n}.text` as const)}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Transferable strengths */}
        <div>
          <h3 className={label}>{t('goals.pillars')}</h3>
          <ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {PILLARS.map((p, i) => (
              <motion.li key={p.n} {...rise(0.1 + i * 0.07)} className="border-t border-ink/10 py-6">
                <p.icon className="size-5 text-ink-3" strokeWidth={1.5} aria-hidden="true" />
                <h4 className="mt-3 font-serif text-xl leading-tight text-ink">{t(`goals.p${p.n}.title` as const)}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{t(`goals.p${p.n}.text` as const)}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Work ethic */}
      <motion.blockquote {...rise()} className="mt-16 max-w-3xl border-l-2 border-accent pl-6 font-serif text-2xl leading-snug text-ink-2 italic sm:pl-8 sm:text-3xl">
        {t('goals.drive')}
      </motion.blockquote>

      {/* Target schools */}
      <div className="mt-20">
        <h3 className={label}>{t('goals.schools')}</h3>
        <p className="mt-2 text-sm text-ink-2">{t('goals.schoolsNote')}</p>
        <ul className="mt-6 grid grid-cols-2 border-t border-l border-ink/10 sm:grid-cols-3 lg:grid-cols-6">
          {targetSchools.map((s, i) => (
            <motion.li key={s.id} {...rise(i * 0.05)} className="flex flex-col items-center gap-3 border-r border-b border-ink/10 bg-card/60 px-4 py-5 text-center">
              <span className="flex h-16 w-full items-center justify-center">
                <SchoolLogo sources={s.logos} name={s.name} />
              </span>
              <span className="text-xs text-ink-2">{s.name}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {onContact && (
        <motion.div {...rise()} className="mt-20 flex flex-col items-start gap-6 border-y border-ink py-9 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{t('goals.cta.title')}</p>
            <p className="mt-2 max-w-xl text-ink-2">{t('goals.cta.text')}</p>
          </div>
          <button type="button" onClick={onContact} className="btn-ink group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-medium">
            {t('goals.cta.button')} <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </Section>
  );
}
