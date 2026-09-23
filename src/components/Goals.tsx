import { motion } from 'framer-motion';
import { Briefcase, Building2, Calculator, GraduationCap, Landmark, MessagesSquare, ShieldCheck, Trophy } from 'lucide-react';
import { useState } from 'react';
import { targetSchools } from '../data/profile';
import { useLang } from '../i18n';
import { Section } from './ui';

/** School logo that falls back through its sources, then to the school name. */
function SchoolLogo({ sources, name }: { sources: string[]; name: string }) {
  const [i, setI] = useState(0);
  if (i >= sources.length) return <span className="text-sm font-semibold text-zinc-800">{name}</span>;
  return <img src={sources[i]} alt={`${name} logo`} onError={() => setI((n) => n + 1)} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />;
}

const STEPS = [
  { n: 1, icon: Briefcase, state: 'now' },
  { n: 2, icon: Building2, state: 'next' },
  { n: 3, icon: Landmark, state: 'next' },
  { n: 4, icon: Trophy, state: 'goal' },
] as const;

const PILLARS = [
  { n: 1, icon: Briefcase, color: 'text-emerald-300' },
  { n: 2, icon: ShieldCheck, color: 'text-violet-300' },
  { n: 3, icon: MessagesSquare, color: 'text-cyan-300' },
  { n: 4, icon: Calculator, color: 'text-fuchsia-300' },
] as const;

export function Goals() {
  const { t } = useLang();

  return (
    <Section id="goals" eyebrow={t('section.goals')} title={t('section.goals.title')}>
      <p className="-mt-4 mb-12 max-w-3xl text-lg leading-relaxed text-zinc-200">{t('goals.intro')}</p>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        {/* Roadmap */}
        <div>
          <h3 className="mb-6 flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase">
            <GraduationCap className="size-4" aria-hidden="true" /> {t('goals.roadmap')}
          </h3>
          <ol className="relative space-y-5 pl-10">
            {/* Luminous rail with a pulse climbing toward the goal */}
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-[15px] w-px overflow-hidden bg-gradient-to-b from-emerald-400/60 via-violet-400/40 to-amber-300/70">
              <span className="animate-rail-y absolute inset-x-0 h-1/4 bg-gradient-to-b from-transparent via-white to-transparent" />
            </span>
            {STEPS.map((s, i) => {
              const goal = s.state === 'goal';
              const now = s.state === 'now';
              return (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-4 -left-10 flex size-8 items-center justify-center rounded-full border ${
                      goal
                        ? 'border-amber-300/70 bg-amber-400/20 text-amber-200 shadow-[0_0_24px_rgb(251_191_36/0.6)]'
                        : now
                          ? 'border-emerald-300/70 bg-emerald-400/20 text-emerald-200 shadow-[0_0_20px_rgb(52_211_153/0.5)]'
                          : 'border-violet-300/50 bg-[#0b0b10] text-violet-200'
                    }`}
                  >
                    <s.icon className="size-4" />
                  </span>
                  <div
                    className={`glass spotlight rounded-2xl p-5 ${
                      goal ? 'border-amber-300/30 bg-gradient-to-br from-amber-400/[0.08] via-transparent to-violet-500/[0.08] shadow-[0_20px_60px_-25px_rgb(251_191_36/0.5)]' : ''
                    }`}
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase ${
                        goal ? 'bg-amber-300/15 text-amber-200' : now ? 'bg-emerald-400/15 text-emerald-300' : 'bg-violet-400/15 text-violet-200'
                      }`}
                    >
                      {t(`goals.s${s.n}.tag` as const)}
                    </span>
                    <h4 className={`mt-2 text-lg font-semibold ${goal ? 'text-shine' : 'text-white'}`}>{t(`goals.s${s.n}.title` as const)}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-300">{t(`goals.s${s.n}.text` as const)}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Transferable strengths */}
        <div>
          <h3 className="mb-6 font-mono text-xs tracking-[0.25em] text-violet-300 uppercase">{t('goals.pillars')}</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {PILLARS.map((p, i) => (
              <motion.li
                key={p.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="glass spotlight group rounded-2xl p-5 transition hover:-translate-y-0.5"
              >
                <p.icon className={`size-6 ${p.color} transition group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_currentColor]`} aria-hidden="true" />
                <h4 className="mt-3 font-semibold text-white">{t(`goals.p${p.n}.title` as const)}</h4>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{t(`goals.p${p.n}.text` as const)}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Work ethic */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="relative mt-12 overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/[0.07] to-cyan-500/10 p-6 text-lg leading-relaxed text-white shadow-[0_20px_70px_-30px_rgb(168_85_247/0.7)] sm:p-8 sm:text-xl"
      >
        <span aria-hidden="true" className="text-shine absolute -top-4 left-4 font-serif text-8xl leading-none opacity-40">
          “
        </span>
        <p className="relative">{t('goals.drive')}</p>
      </motion.blockquote>

      {/* Target schools */}
      <div className="mt-12">
        <h3 className="font-mono text-xs tracking-[0.25em] text-amber-200 uppercase">{t('goals.schools')}</h3>
        <p className="mt-2 text-sm text-zinc-300">{t('goals.schoolsNote')}</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {targetSchools.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center transition hover:-translate-y-1 hover:border-amber-300/40 hover:shadow-[0_16px_40px_-20px_rgb(251_191_36/0.6)]"
            >
              <span className="flex h-20 w-full items-center justify-center rounded-xl bg-white p-3 shadow-inner">
                <SchoolLogo sources={s.logos} name={s.name} />
              </span>
              <span className="text-xs font-medium text-zinc-200">{s.name}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
