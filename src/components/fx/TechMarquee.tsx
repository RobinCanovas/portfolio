import { skillGroups } from '../../data/profile';
import { SimpleIcon } from '../TechIcon';

const ITEMS = skillGroups.flatMap((g) => g.skills).filter((s) => s.icon);

/** Infinite band of tech logos; pauses on hover, lights up each logo under the cursor. */
export function TechMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {ITEMS.map((s) => (
        <li key={s.name} className="group flex items-center gap-3 text-sm whitespace-nowrap text-zinc-500 transition-colors hover:text-white">
          <SimpleIcon slug={s.icon} className="size-6 transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgb(255_255_255/0.5)]" />
          {s.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group/marquee relative overflow-hidden border-y border-white/[0.06] bg-white/[0.01] py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee flex w-max group-hover/marquee:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
