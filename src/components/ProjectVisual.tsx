import { ProjectArt } from './ProjectArt';

/**
 * Projects with an interactive demo are shown by a real capture of that demo (public/captures,
 * regenerated from the demos themselves); the others keep their drawn story.
 */
export const CAPTURES: Record<string, { src: string; width: number; height: number }> = {};

export const hasCapture = (id: string) => id in CAPTURES;

export function ProjectVisual({ id, replay, autoplay = false, className = '' }: { id: string; replay?: number; autoplay?: boolean; className?: string }) {
  const capture = CAPTURES[id];
  if (!capture) return <ProjectArt id={id} replay={replay} autoplay={autoplay} className={className} />;
  return (
    <img
      src={capture.src}
      width={capture.width}
      height={capture.height}
      alt=""
      loading="lazy"
      decoding="async"
      className={`block bg-card object-cover object-top ${className}`}
    />
  );
}
