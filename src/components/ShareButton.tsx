import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { useLang } from '../i18n';
import { shareCurrentPage } from '../lib/share';

/** Shares the current page (native share sheet on mobile, copy link elsewhere). */
export function ShareButton({ title }: { title: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const result = await shareCurrentPage(title);
        if (result === 'copied') {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-200 transition hover:border-white/30 hover:text-white"
    >
      {copied ? <Check className="size-3.5 text-emerald-300" aria-hidden="true" /> : <Share2 className="size-3.5" aria-hidden="true" />}
      {copied ? t('share.copied') : t('share.button')}
    </button>
  );
}
