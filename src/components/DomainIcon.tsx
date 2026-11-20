import { BrainCircuit, Code2, Compass, Landmark, LayoutGrid } from 'lucide-react';
import type { Domain } from '../types';

const ICONS = { All: LayoutGrid, finance: Landmark, data: BrainCircuit, business: Compass, dev: Code2 } as const;

export function DomainIcon({ domain, className = 'size-4' }: { domain: Domain | 'All'; className?: string }) {
  const Icon = ICONS[domain];
  return <Icon className={`shrink-0 text-ink-3 ${className}`} strokeWidth={1.75} aria-hidden="true" />;
}
