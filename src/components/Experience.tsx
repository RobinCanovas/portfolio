import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, CheckCircle2, MapPin } from 'lucide-react';
import { experiences } from '../data/profile';
import { Badge, CompanyLogo, Modal, Section } from './ui';

export function Experience({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string | null) => void }) {
  const selected = experiences.find((e) => e.id === selectedId) ?? null;

  return (
    <Section id="experience" eyebrow="02 · Career" title="Experience">
      <ol className="relative space-y-6 border-l border-white/10 pl-6 sm:pl-10">
        {experiences.map((exp, i) => (
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
              className={`absolute top-6 -left-[31px] size-3 rounded-full ring-4 ring-ink sm:-left-[47px] ${
                exp.current ? 'bg-emerald-400 shadow-[0_0_12px] shadow-emerald-400' : 'bg-violet-500'
              }`}
            />
            <button
              type="button"
              onClick={() => onSelect(exp.id)}
              className="glass group w-full rounded-2xl p-5 text-left transition hover:border-violet-400/40 hover:bg-white/[0.07] sm:p-6"
            >
              <div className="flex items-start gap-4">
                <CompanyLogo company={exp.company} size={52} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-semibold text-white">{exp.role}</h3>
                    {exp.current && <Badge active>Current</Badge>}
                  </div>
                  <p className="text-sm text-zinc-400">
                    {exp.company.name} · {exp.contract}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-500">{exp.period}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">{exp.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.stack.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
              </div>
            </button>
          </motion.li>
        ))}
      </ol>

      <Modal open={selected !== null} onClose={() => onSelect(null)} title={selected?.role ?? ''} wide>
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <CompanyLogo company={selected.company} size={56} />
              <div className="text-sm">
                <p className="font-semibold text-white">{selected.company.name}</p>
                <p className="text-xs text-zinc-500">{selected.company.sector}</p>
                <p className="flex items-center gap-1.5 text-zinc-400">
                  <Briefcase className="size-3.5" aria-hidden="true" /> {selected.contract} · {selected.period}
                </p>
                <p className="flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="size-3.5" aria-hidden="true" /> {selected.location}
                </p>
              </div>
            </div>
            <p className="mt-5 text-zinc-300">{selected.summary}</p>
            <h4 className="mt-6 font-mono text-xs tracking-widest text-cyan-300 uppercase">Key achievements</h4>
            <ul className="mt-3 space-y-3">
              {selected.achievements.map((a) => (
                <li key={a} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {selected.stack.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            {selected.company.url && (
              <a
                href={selected.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                Visit website <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </Modal>
    </Section>
  );
}
