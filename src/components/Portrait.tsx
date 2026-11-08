import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { useContent, useLang } from '../i18n';

/**
 * Portrait printed like a photograph in a magazine: a plain frame and a caption underneath. Nothing moves.
 */
export function Portrait() {
  const { t } = useLang();
  const { profile } = useContent();
  const [failed, setFailed] = useState(false);

  return (
    <figure className="relative mx-auto w-full max-w-[360px]">
      <div className="relative">
        <div className="overflow-hidden rounded-md bg-paper-2 ring-1 ring-ink/10">
          {failed ? (
            <div className="flex aspect-[4/5] items-center justify-center text-ink-4">
              <UserRound className="size-24" strokeWidth={1} aria-hidden="true" />
            </div>
          ) : (
            <img
              src={profile.portrait}
              alt={t('portrait.alt', { name: profile.name })}
              onError={() => setFailed(true)}
              width={1200}
              height={1500}
              className="aspect-[4/5] w-full object-cover saturate-[0.95]"
              fetchPriority="high"
            />
          )}
        </div>

      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-2.5">
        <span className="font-serif text-base text-ink-2 italic">{profile.title}</span>
        <span className="shrink-0 text-xs text-ink-4">Paris</span>
      </figcaption>
    </figure>
  );
}
