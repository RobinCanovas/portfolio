import { useState } from 'react';
import { ShieldCheck, UserRound } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { LogoTile } from './ui';

/**
 * Portrait printed like a photograph in a magazine: a plain frame, a caption underneath,
 * and two labels pinned to its edges. Nothing moves.
 */
export function Portrait() {
  const { t } = useLang();
  const { profile, experiences, lang } = useContent();
  const bankClient = experiences.find((e) => e.client?.parent)?.client;
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

        {bankClient?.parent && (
          <div className="panel lift absolute top-8 -left-5 flex items-center gap-2.5 rounded-lg p-2 pr-3.5 sm:-left-12">
            <LogoTile sources={bankClient.parent.logos} name={bankClient.parent.name} size={34} fallback={<ShieldCheck className="size-6 text-good" />} />
            <span className="text-left leading-tight">
              <span className="block font-mono text-[10px] tracking-wider text-good uppercase">{t('portrait.client')}</span>
              <span className="block text-xs font-semibold text-ink">{t('portrait.clientLine')}</span>
              <span className="block text-[10px] text-ink-3">Domofinance · MFA · Ansible</span>
            </span>
          </div>
        )}
        <div className="panel lift absolute -right-4 bottom-10 flex items-center gap-2 rounded-lg px-3 py-2 sm:-right-9">
          <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
          <span className="text-xs font-medium text-ink">{lang === 'fr' ? 'MFA · Sécurité · Qualité' : 'MFA · Security · QA'}</span>
        </div>
      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-2.5">
        <span className="font-serif text-base text-ink-2 italic">{profile.title}</span>
        <span className="shrink-0 font-mono text-[10px] tracking-wider text-ink-4 uppercase">Paris</span>
      </figcaption>
    </figure>
  );
}
