import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { experiences, links, profile } from '../data/profile';
import { triggerHyperMode } from './fx/effects';

type Line = { kind: 'in' | 'out'; text: string };

const COMMANDS: Record<string, () => string[]> = {
  help: () => ['Available: whoami, stack, experience, now, contact, clear', 'psst… there is a hidden one. Try the Konami code too.'],
  hyper: () => {
    triggerHyperMode();
    return ['⚡ HYPER MODE ENGAGED ⚡'];
  },
  sudo: () => ['Nice try. This incident will be reported to the scout leader. 🏕️'],
  whoami: () => [`${profile.name} — ${profile.title}`, `Based in ${profile.location}.`],
  stack: () => ['backend  → PHP · Symfony · API Platform · Java', 'frontend → React · TypeScript · HTML/CSS', 'data     → MySQL · SQL modelling', 'method   → Agile/Scrum · V-Model'],
  experience: () => experiences.map((e) => `${e.period.padEnd(24)} ${e.company.name}`),
  now: () => [`${profile.currentRole} — Symfony / PHP`, 'Status: open to opportunities ✔'],
  contact: () => [`email    ${links.email}`, `linkedin ${links.linkedin}`],
};

const BOOT: Line[] = [
  { kind: 'in', text: 'whoami' },
  ...COMMANDS.whoami().map((text) => ({ kind: 'out' as const, text })),
  { kind: 'in', text: 'now' },
  ...COMMANDS.now().map((text) => ({ kind: 'out' as const, text })),
  { kind: 'out', text: "Type 'help' to explore." },
];

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setCursor(-1);
    setInput('');
    if (cmd === 'clear') return setLines([]);
    const out = Object.hasOwn(COMMANDS, cmd) ? COMMANDS[cmd]() : [`command not found: ${cmd}. Try 'help'.`];
    setLines((l) => [...l, { kind: 'in', text: cmd }, ...out.map((text) => ({ kind: 'out' as const, text }))]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const next = Math.max(-1, Math.min(history.length - 1, cursor + (e.key === 'ArrowUp' ? 1 : -1)));
    setCursor(next);
    setInput(next === -1 ? '' : history[next]);
  };

  return (
    <div className="glow-border rounded-2xl">
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-black/85 shadow-2xl shadow-violet-900/30 backdrop-blur-xl">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgb(255_255_255/0.015)_2px_3px)]" />
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-3 rounded-full bg-red-500/80" />
        <span className="size-3 rounded-full bg-yellow-400/80" />
        <span className="size-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-xs text-zinc-500">robin@portfolio: ~</span>
      </div>
      <div
        ref={bodyRef}
        className="h-64 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-72"
        onClick={() => document.getElementById('term-input')?.focus()}
        role="log"
        aria-live="polite"
      >
        {lines.map((l, i) =>
          l.kind === 'in' ? (
            <p key={i} className="text-zinc-100">
              <span className="text-violet-400">❯</span> {l.text}
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap text-cyan-200/85 [text-shadow:0_0_8px_rgb(34_211_238/0.35)]">
              {l.text}
            </p>
          ),
        )}
        <form onSubmit={run} className="flex items-center gap-2">
          <span className="text-violet-400" aria-hidden="true">
            ❯
          </span>
          <label htmlFor="term-input" className="sr-only">
            Terminal command
          </label>
          <input
            id="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-zinc-100 caret-cyan-300 outline-none"
            placeholder="help"
          />
        </form>
      </div>
    </div>
    </div>
  );
}
