import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Code2, Copy, ExternalLink, Layers } from 'lucide-react';
import { projectFilters, projects } from '../data/profile';
import type { Project, Tech } from '../types';
import { TechIcon } from './TechIcon';
import { Badge, Modal, Section } from './ui';

interface Props {
  filter: Tech | 'All';
  onFilter: (tech: Tech | 'All') => void;
  /** Project briefly highlighted after being picked from the menu or the command palette */
  highlightId?: string | null;
}

export function Projects({ filter, onFilter, highlightId = null }: Props) {
  const [snippetOf, setSnippetOf] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);

  const visible = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.stack.includes(filter))), [filter]);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <Section id="projects" eyebrow="03 · Work" title="Projects">
      <div role="toolbar" aria-label="Filter projects by technology" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {(['All', ...projectFilters] as const).map((tech) => {
          const count = tech === 'All' ? projects.length : projects.filter((p) => p.stack.includes(tech)).length;
          const on = filter === tech;
          return (
            <button
              key={tech}
              type="button"
              aria-pressed={on}
              onClick={() => onFilter(tech)}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 font-mono text-xs transition ${
                on ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <TechIcon tech={tech} className="size-3.5" />
              {tech} <span className="text-zinc-500">{count}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.li
              key={p.id}
              id={`project-${p.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`glass spotlight group relative flex scroll-mt-24 flex-col overflow-hidden rounded-2xl p-5 transition duration-500 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-900/30 ${
                highlightId === p.id ? 'border-violet-400/70 shadow-2xl ring-2 shadow-violet-600/40 ring-violet-400/60' : ''
              }`}
            >
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-violet-500/20 opacity-0 blur-3xl transition group-hover:opacity-100" />
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-cyan-300/80">{p.context}</p>
                {p.featured && <Badge active>Featured</Badge>}
              </div>
              <h3 className="mt-1.5 text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.description}</p>

              <h4 className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Layers className="size-3.5" aria-hidden="true" /> Architecture highlights
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="text-violet-400" aria-hidden="true">▹</span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <Badge key={t} active={t === filter}>
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {p.snippet && (
                  <button
                    type="button"
                    onClick={() => setSnippetOf(p)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                  >
                    <Code2 className="size-3.5" aria-hidden="true" /> View code
                  </button>
                )}
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" /> Live demo
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10">
                    Source
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Modal open={snippetOf !== null} onClose={() => setSnippetOf(null)} title={snippetOf?.title ?? ''} wide>
        {snippetOf?.snippet && (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="truncate font-mono text-xs text-zinc-400">{snippetOf.snippet.filename}</span>
              <button
                type="button"
                onClick={() => copy(snippetOf.snippet!.code)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-white/10"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-zinc-200">
              <code className={`language-${snippetOf.snippet.language}`}>{snippetOf.snippet.code}</code>
            </pre>
          </div>
        )}
        <p className="mt-3 text-xs text-zinc-500">Simplified excerpt — client code is not published.</p>
      </Modal>
    </Section>
  );
}
