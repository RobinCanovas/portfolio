import { ProjectArt } from './ProjectArt';

/**
 * Projects with an interactive demo are shown by a real capture of that demo (public/captures,
 * taken from the demos themselves); the others keep their drawn story.
 */
const capture = (id: string) => ({ src: `./captures/${id}.webp`, width: 1600, height: 744 });

export const CAPTURES: Record<string, { src: string; width: number; height: number }> = Object.fromEntries(
  ['gradient-descent', 'neural-network', 'subnet-calculator', 'acelys-deploy', 'ac-motors', 'cwad'].map((id) => [id, capture(id)]),
);

export const hasCapture = (id: string) => id in CAPTURES;

export function ProjectVisual({ id, replay, autoplay = false, className = '' }: { id: string; replay?: number; autoplay?: boolean; className?: string }) {
  const shot = CAPTURES[id];
  if (!shot) return <ProjectArt id={id} replay={replay} autoplay={autoplay} className={className} />;
  // A capture is laid on the table like a print: inset on the paper ground, bleeding off the bottom edge.
  return (
    <div className={`relative overflow-hidden bg-[#f1ede4] ${className}`}>
      <img
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt=""
        loading="lazy"
        decoding="async"
        className="lift absolute inset-x-[6%] top-[8%] w-[88%] rounded-t-md border border-b-0 border-ink/10 bg-card object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
        style={{ height: 'calc(92% + 1px)' }}
      />
    </div>
  );
}
