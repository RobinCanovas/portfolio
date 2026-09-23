import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { languages, profile, skillGroups } from '../data/profile';
import { Terminal } from './Terminal';
import type { SkillLevel } from '../types';
import { SimpleIcon } from './TechIcon';
import { Section } from './ui';

const LEVELS: Record<SkillLevel, { label: string; dot: string }> = {
  daily: { label: 'Daily use', dot: 'bg-emerald-400' },
  solid: { label: 'Solid', dot: 'bg-violet-400' },
  learning: { label: 'Learning', dot: 'bg-amber-400' },
};

export function Skills() {
  const [tab, setTab] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === tab) ?? skillGroups[0];

  return (
    <Section id="skills" eyebrow="04 · Toolbox" title="Skills">
      <div role="tablist" aria-label="Skill categories" className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {skillGroups.map((g) => (
          <button
            key={g.id}
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={tab === g.id}
            aria-controls={`panel-${g.id}`}
            onClick={() => setTab(g.id)}
            className={`relative isolate shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${tab === g.id ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            {tab === g.id && <motion.span layoutId="skills-tab" className="absolute inset-0 -z-10 rounded-xl border border-white/10 bg-white/[0.07]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            {g.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={group.id}
          id={`panel-${group.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${group.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {group.skills.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="glass spotlight group flex items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
            >
              <SimpleIcon slug={s.icon} className="size-7" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">{s.name}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className={`size-1.5 rounded-full ${LEVELS[s.level].dot}`} aria-hidden="true" />
                  {LEVELS[s.level].label}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="glass spotlight rounded-2xl p-5">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Languages className="size-4 text-cyan-300" aria-hidden="true" /> Languages
            </h3>
            <ul className="mt-4 space-y-3">
              {languages.map((l) => (
                <li key={l.name} className="flex items-center gap-3 text-sm">
                  <span className="w-8 rounded-md bg-white/10 py-0.5 text-center font-mono text-[10px] text-zinc-300">{l.code}</span>
                  <span className="w-20 text-zinc-200">{l.name}</span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: l.level === 'Native' ? '100%' : l.level === 'B2' ? '72%' : '40%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgb(34_211_238/0.6)]"
                    />
                  </span>
                  <span className="w-12 text-right font-mono text-xs text-zinc-400">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="glass rounded-2xl p-5 text-sm leading-relaxed text-zinc-300">
            <span className="mb-1 block font-mono text-[10px] tracking-widest text-violet-300 uppercase">Direction</span>
            {profile.ambition}
          </p>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Prefer the terminal? Type “help”.</p>
          <Terminal />
        </div>
      </div>
    </Section>
  );
}
