import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, GitBranch, KeyRound, Laptop, Play, Rocket, Server, Workflow } from 'lucide-react';
import { useLang } from '../../i18n';
import type { UiKey } from '../../i18n/ui';

type NodeId = 'dev' | 'repo' | 'ci' | 'bastion' | 'app' | 'db';

const NODES: Record<NodeId, { x: number; y: number; label: UiKey; icon: typeof Laptop }> = {
  dev: { x: 70, y: 130, label: 'dep.dev', icon: Laptop },
  repo: { x: 210, y: 130, label: 'dep.repo', icon: GitBranch },
  ci: { x: 350, y: 130, label: 'dep.ci', icon: Workflow },
  bastion: { x: 500, y: 130, label: 'dep.bastion', icon: KeyRound },
  app: { x: 660, y: 70, label: 'dep.app', icon: Server },
  db: { x: 660, y: 200, label: 'dep.db', icon: Database },
};

const EDGES: [NodeId, NodeId, 'plain' | 'ssh'][] = [
  ['dev', 'repo', 'plain'],
  ['repo', 'ci', 'plain'],
  ['ci', 'bastion', 'ssh'],
  ['bastion', 'app', 'ssh'],
  ['app', 'db', 'plain'],
];

interface Step {
  from: NodeId;
  to: NodeId;
  log: string;
}

const STEPS: Step[] = [
  { from: 'dev', to: 'repo', log: '$ git push origin main' },
  { from: 'repo', to: 'ci', log: 'bitbucket: pipeline #128 started (branch main)' },
  { from: 'ci', to: 'bastion', log: '$ ansible-playbook deploy.yml -i inventories/production' },
  { from: 'bastion', to: 'app', log: 'ssh -J bastion app-01 · key authentication OK' },
  { from: 'app', to: 'app', log: 'yarn install --frozen-lockfile · npm run build' },
  { from: 'app', to: 'db', log: 'bin/console doctrine:migrations:migrate --no-interaction' },
  { from: 'db', to: 'app', log: 'release symlink switched · cache warmed' },
];

type Status = 'idle' | 'running' | 'done' | 'failed';

export function DeployPipeline() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>('idle');
  const [step, setStep] = useState(-1);
  const [logs, setLogs] = useState<{ text: string; tone: 'info' | 'ok' | 'err' }[]>([]);
  const [fail, setFail] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatus('running');
    setLogs([]);
    const failAt = fail ? 5 : -1;
    const steps = failAt >= 0 ? STEPS.slice(0, failAt + 1) : STEPS;
    steps.forEach((s, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          setLogs((l) => [...l, { text: s.log, tone: 'info' }]);
        }, i * 900),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        if (failAt >= 0) {
          setLogs((l) => [
            ...l,
            { text: '✗ migration failed: column "status" already exists', tone: 'err' },
            { text: '↺ rollback: previous release restored, site still online', tone: 'ok' },
          ]);
          setStatus('failed');
        } else {
          setLogs((l) => [...l, { text: '✔ deployed in 2 m 14 s · 0 downtime', tone: 'ok' }]);
          setStatus('done');
        }
        setStep(-1);
      }, steps.length * 900 + 300),
    );
  };

  const current = step >= 0 ? STEPS[step] : null;
  const activeNodes = new Set<NodeId>(current ? [current.from, current.to] : []);
  const packet = current ? NODES[current.to] : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{t('dep.title')}</h3>
          <p className="mt-1 text-sm text-zinc-300">{t('dep.help')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} className="size-4 accent-rose-500" disabled={status === 'running'} />
            {t('dep.fail')}
          </label>
          <button
            type="button"
            onClick={run}
            disabled={status === 'running'}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgb(168_85_247/0.45)] transition hover:brightness-110 disabled:opacity-60"
          >
            {status === 'running' ? <Rocket className="size-4 animate-pulse" /> : <Play className="size-4" />}
            {status === 'running' ? t('dep.running') : t('dep.run')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-2">
        <svg viewBox="0 0 740 260" className="min-w-[560px]" role="img" aria-label={t('dep.title')}>
          <defs>
            <linearGradient id="edge" x1="0" x2="1">
              <stop offset="0" stopColor="#a855f7" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* SSH tunnel zone */}
          <rect x="420" y="20" width="310" height="225" rx="18" fill="rgb(34 211 238 / 0.04)" stroke="rgb(34 211 238 / 0.25)" strokeDasharray="6 6" />
          <text x="712" y="40" textAnchor="end" className="fill-cyan-300 font-mono" fontSize="11">
            production · SSH
          </text>

          {EDGES.map(([a, b, kind]) => {
            const A = NODES[a];
            const B = NODES[b];
            const on = current && ((current.from === a && current.to === b) || (current.from === b && current.to === a));
            return (
              <line
                key={`${a}-${b}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={on ? 'url(#edge)' : 'rgb(255 255 255 / 0.15)'}
                strokeWidth={on ? 3 : 1.5}
                strokeDasharray={kind === 'ssh' ? '5 5' : undefined}
                filter={on ? 'url(#glow)' : undefined}
              />
            );
          })}

          {(Object.keys(NODES) as NodeId[]).map((id) => {
            const n = NODES[id];
            const on = activeNodes.has(id);
            const Icon = n.icon;
            const failed = status === 'failed' && id === 'db';
            return (
              <g key={id} transform={`translate(${n.x} ${n.y})`}>
                <circle
                  r="28"
                  fill="#0b0b10"
                  stroke={failed ? '#f43f5e' : on ? '#22d3ee' : 'rgb(255 255 255 / 0.25)'}
                  strokeWidth={on || failed ? 2.5 : 1.5}
                  filter={on ? 'url(#glow)' : undefined}
                />
                <foreignObject x="-12" y="-12" width="24" height="24">
                  <Icon className={`size-6 ${failed ? 'text-rose-400' : on ? 'text-cyan-200' : 'text-zinc-300'}`} />
                </foreignObject>
                <text y="48" textAnchor="middle" fontSize="12" className="fill-zinc-300">
                  {t(n.label)}
                </text>
              </g>
            );
          })}

          {packet && (
            <motion.circle
              r="7"
              fill="#f0abfc"
              filter="url(#glow)"
              initial={{ cx: NODES.dev.x, cy: NODES.dev.y }}
              animate={{ cx: packet.x, cy: packet.y }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            />
          )}
        </svg>
      </div>

      <div role="log" aria-live="polite" className="h-40 overflow-y-auto rounded-2xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed">
        {logs.length === 0 && <p className="text-zinc-500">$ _</p>}
        {logs.map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className={l.tone === 'err' ? 'text-rose-300' : l.tone === 'ok' ? 'text-emerald-300' : 'text-cyan-100'}
          >
            {l.text}
          </motion.p>
        ))}
      </div>
      <p className="text-xs text-zinc-400">{t('dep.note')}</p>
    </div>
  );
}
