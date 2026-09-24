import type { ReactNode } from 'react';
import type { CodeSnippet } from '../types';

/** Comments, strings, keywords, numbers and called functions, in that order of priority. */
const TOKENS =
  /(#.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(def|return|for|in|import|as|from|if|else|elif|while|lambda|True|False|None|and|or|not)\b|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/gm;
const COLORS = ['text-zinc-500 italic', 'text-emerald-300', 'text-fuchsia-300', 'text-amber-300', 'text-cyan-300'];

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKENS)) {
    const i = m.index ?? 0;
    if (i > last) out.push(line.slice(last, i));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={i} className={COLORS[group]}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** Read-only code listing with a file tab, line numbers and light syntax colouring (Python). */
export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const lines = snippet.code.split('\n');
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b12] shadow-[0_20px_60px_-30px_rgb(168_85_247/0.6)]">
      <figcaption className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs text-zinc-400">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="ml-2 text-zinc-300">{snippet.filename}</span>
        <span className="ml-auto uppercase">{snippet.language}</span>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed sm:p-5">
        <code>
          {lines.map((line, n) => (
            <div key={n} className="flex">
              <span aria-hidden="true" className="mr-4 w-6 shrink-0 text-right text-zinc-600 select-none">
                {n + 1}
              </span>
              <span className="whitespace-pre text-zinc-200">{highlight(line)}</span>
            </div>
          ))}
        </code>
      </pre>
    </figure>
  );
}
