import { useId } from 'react';

/** Brand mark: a small glowing network (three linked nodes around a hub). Same drawing as public/favicon.svg. */
export function Logo({ className = 'size-8' }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c084fc" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id={`${id}-bg`} cx="0.3" cy="0.2" r="1">
          <stop offset="0" stopColor="#1e1633" />
          <stop offset="1" stopColor="#0a0a12" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill={`url(#${id}-bg)`} stroke={`url(#${id}-g)`} strokeWidth="1.5" />
      <g stroke={`url(#${id}-g)`} strokeWidth="1.8" strokeLinecap="round">
        <path d="M16 16 L16 8.5 M16 16 L9.5 21.5 M16 16 L22.5 21.5 M9.5 21.5 L22.5 21.5" />
      </g>
      <circle cx="16" cy="8.5" r="2.6" fill="#c084fc" />
      <circle cx="9.5" cy="21.5" r="2.6" fill="#a78bfa" />
      <circle cx="22.5" cy="21.5" r="2.6" fill="#22d3ee" />
      <circle cx="16" cy="16" r="3.2" fill="#fff" />
    </svg>
  );
}
