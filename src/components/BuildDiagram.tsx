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
 * "How it's built" flow: numbered steps linked by a glowing rail with a pulse travelling along it.
 * Horizontal on large screens, vertical on mobile.
 */
export function BuildDiagram({ steps }: { steps: BuildStep[] }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute top-7 right-[10%] left-[10%] hidden h-px overflow-hidden bg-white/10 lg:block">
        <span className="animate-rail absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute top-6 bottom-6 left-7 w-px overflow-hidden bg-white/10 lg:hidden">
        <span className="animate-rail-y absolute inset-x-0 h-1/4 bg-gradient-to-b from-transparent via-cyan-300 to-transparent" />
      </div>
      <ol className="grid gap-6 lg:auto-cols-fr lg:grid-flow-col lg:gap-4">
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon];
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center"
            >
              <span className="group relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0b0b10] shadow-[0_0_30px_-6px_rgb(168_85_247/0.6)] transition hover:border-cyan-300/60 hover:shadow-[0_0_36px_-4px_rgb(34_211_238/0.7)]">
                <Icon className="size-6 text-violet-200 transition group-hover:scale-110 group-hover:text-cyan-200" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 font-mono text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <div className="pt-1 lg:pt-0">
                <h4 className="font-semibold text-white">{step.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
