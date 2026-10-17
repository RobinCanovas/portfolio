import { motion } from 'framer-motion';
import { CheckCircle2, Code2, Cpu, Database, FileText, GitBranch, Globe, KeyRound, LayoutDashboard, Mail, Rocket, Search, Server, ShieldCheck, UserRound } from 'lucide-react';
import type { BuildStep } from '../types';

const ICONS: Record<BuildStep['icon'], typeof Code2> = {
  user: UserRound,
  shield: ShieldCheck,
  server: Server,
  database: Database,
  code: Code2,
  check: CheckCircle2,
  layout: LayoutDashboard,
  cpu: Cpu,
  mail: Mail,
  search: Search,
  file: FileText,
  globe: Globe,
  git: GitBranch,
  key: KeyRound,
  rocket: Rocket,
};

/**
 * "How it's built" flow: numbered steps on a hairline that draws itself from the first step to the last.
 * Horizontal on large screens, vertical on mobile.
 */
export function BuildDiagram({ steps }: { steps: BuildStep[] }) {
  const ease = [0.65, 0, 0.35, 1] as const;
  const draw = { duration: 0.35 + steps.length * 0.18, ease };
  return (
    <div className="relative">
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={draw}
        className="pointer-events-none absolute top-7 right-[10%] left-[10%] hidden h-px origin-left bg-ink/25 lg:block"
      />
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={draw}
        className="pointer-events-none absolute top-7 bottom-7 left-7 w-px origin-top bg-ink/25 lg:hidden"
      />
      <ol className="grid gap-7 lg:auto-cols-fr lg:grid-flow-col lg:gap-5">
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon];
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.15 + i * 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center"
            >
              <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-card">
                <Icon className="size-5 text-ink-2" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div className="pt-1 lg:pt-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ink-4">{String(i + 1).padStart(2, '0')}</p>
                <h4 className="mt-0.5 font-serif text-xl leading-tight text-ink">{step.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
