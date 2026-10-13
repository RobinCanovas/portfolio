/**
 * Brand mark: a tiny perceptron drawn in ink, three inputs and one output in vermilion,
 * the same little network the opening intro computes. Same drawing as public/favicon.svg.
 */
export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="8" fill="#fbfaf6" stroke="#1b1915" strokeWidth="1.5" />
      <path d="M10 10 L22 16 M10 16 L22 16 M10 22 L22 16" stroke="#1b1915" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2" fill="#1b1915" />
      <circle cx="10" cy="16" r="2" fill="#1b1915" />
      <circle cx="10" cy="22" r="2" fill="#1b1915" />
      <circle cx="22" cy="16" r="3" fill="#b23c1c" />
    </svg>
  );
}
