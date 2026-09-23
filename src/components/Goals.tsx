import { motion } from 'framer-motion';
import { Briefcase, Building2, Calculator, GraduationCap, Landmark, MessagesSquare, ShieldCheck, Trophy } from 'lucide-react';
import { useLang } from '../i18n';
import { Section } from './ui';

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
    </Section>
  );
}
