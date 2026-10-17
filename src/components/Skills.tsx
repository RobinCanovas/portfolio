import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent, useLang } from '../i18n';
import type { SkillLevel } from '../types';
import { SimpleIcon } from './TechIcon';
import { Section } from './ui';

const DOTS: Record<SkillLevel, string> = { daily: 'bg-good', solid: 'bg-ink-3', learning: 'bg-ochre' };
const LEVEL_TEXT: Record<SkillLevel, string> = { daily: 'text-good', solid: 'text-ink-3', learning: 'text-ochre' };

export function Skills() {
  const { t } = useLang();
  const { skillGroups, languages, profile } = useContent();
  const [tab, setTab] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === tab) ?? skillGroups[0];

  return (
    <Section id="skills" eyebrow={t('section.skills')} title={t('section.skills.title')}>
      <div role="tablist" aria-label={t('skills.categories')} className="-mx-4 mb-8 flex gap-6 overflow-x-auto border-b border-ink/10 px-4 sm:mx-0 sm:px-0">
        {skillGroups.map((g) => (
          <button
            key={g.id}
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={tab === g.id}
            aria-controls={`panel-${g.id}`}
            onClick={() => setTab(g.id)}
            className={`relative shrink-0 pt-1 pb-3 text-sm font-medium transition-colors duration-200 ${tab === g.id ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}
          >
            {g.title}
            {tab === g.id && <motion.span layoutId="skills-tab" className="absolute inset-x-0 -bottom-px h-px bg-ink" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={group.id + group.title}
          id={`panel-${group.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${group.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-2 border-t border-l border-ink/10 sm:grid-cols-3 lg:grid-cols-4"
        >
          {group.skills.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-start gap-3 border-r border-b border-ink/10 bg-card/50 p-4 transition-colors duration-200 hover:bg-card"
            >
              <SimpleIcon slug={s.icon} className="mt-0.5 size-5" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{s.name}</span>
                <span className={`mt-1 flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${LEVEL_TEXT[s.level]}`}>
                  <span className={`size-1.5 rounded-full ${DOTS[s.level]}`} aria-hidden="true" />
                  {t(`skills.${s.level}` as const)}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="font-mono text-[11px] tracking-[0.22em] text-ink-3 uppercase">{t('skills.languages')}</h3>
          <ul className="mt-4 border-b border-ink/10">
            {languages.map((l) => (
              <li key={l.code} className="flex items-center gap-4 border-t border-ink/10 py-3 text-sm">
                <span className="w-7 font-mono text-[11px] text-ink-3">{l.code}</span>
                <span className="w-24 font-serif text-lg text-ink">{l.name}</span>
                <span className="relative h-px flex-1 bg-ink/15">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: l.code === 'FR' ? 1 : l.level === 'B2' ? 0.72 : 0.55 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 -top-px h-[3px] origin-left bg-ink"
                  />
                </span>
                <span className="w-14 text-right font-mono text-xs text-ink-2">{l.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-l-2 border-accent pl-6 lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">{t('skills.direction')}</p>
          <p className="mt-3 font-serif text-xl leading-snug text-ink sm:text-[1.45rem]">{profile.ambition}</p>
        </div>
      </div>
    </Section>
  );
}
