import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useLang } from '../../i18n';

const DEVICES = [
  { id: 'desktop', label: 'device.desktop', icon: Monitor, width: '100%', height: 620 },
  { id: 'tablet', label: 'device.tablet', icon: Tablet, width: '768px', height: 620 },
  { id: 'mobile', label: 'device.mobile', icon: Smartphone, width: '390px', height: 680 },
] as const;

/** Live iframe preview of a static demo, with a device-width switcher to show responsiveness. */
export function DevicePreview({ src, title, originalSrc }: { src: string; title: string; originalSrc?: string }) {
  const { t } = useLang();
  const [device, setDevice] = useState<(typeof DEVICES)[number]['id']>('desktop');
  const current = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label={t('device.size')} className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={device === d.id}
              onClick={() => setDevice(d.id)}
              className={`relative isolate inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${device === d.id ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {device === d.id && <motion.span layoutId="device-pill" className="absolute inset-0 -z-10 rounded-lg bg-white/10" />}
              <d.icon className="size-3.5" aria-hidden="true" /> {t(d.label)}
            </button>
          ))}
        </div>
        <a href={src} target="_blank" rel="noopener" className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgb(168_85_247/0.4)] hover:brightness-110">
          <ExternalLink className="size-3.5" aria-hidden="true" /> {t('device.full')}
        </a>
        {originalSrc && (
          <a href={originalSrc} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/5">
            {t('device.original')}
          </a>
        )}
      </div>

      <div className="flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,rgb(168_85_247/0.12),transparent_70%)] p-3 sm:p-6">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          style={{ width: current.width, maxWidth: '100%' }}
          className={`overflow-hidden border border-white/15 bg-black shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),0_0_60px_-20px_rgb(34_211_238/0.4)] ${device === 'desktop' ? 'rounded-xl' : 'rounded-[2rem] border-4 border-zinc-800'}`}
        >
          {device === 'desktop' && (
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-zinc-900 px-3 py-2">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-yellow-400/80" />
              <span className="size-2.5 rounded-full bg-green-500/80" />
              <span className="ml-3 truncate rounded bg-black/40 px-3 py-0.5 font-mono text-[10px] text-zinc-500">vogmerveille.demo</span>
            </div>
          )}
          <iframe title={title} src={src} loading="lazy" className="block w-full bg-black" style={{ height: current.height }} />
        </motion.div>
      </div>
    </div>
  );
}
