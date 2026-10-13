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
        <div role="radiogroup" aria-label={t('device.size')} className="flex rounded-full border border-ink/15 p-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={device === d.id}
              onClick={() => setDevice(d.id)}
              className={`relative isolate inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${device === d.id ? 'text-paper' : 'text-ink-3 hover:text-ink'}`}
            >
              {device === d.id && <motion.span layoutId="device-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />}
              <d.icon className="size-3.5" aria-hidden="true" /> {t(d.label)}
            </button>
          ))}
        </div>
        <a href={src} target="_blank" rel="noopener" className="btn-ink ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium">
          <ExternalLink className="size-3.5" aria-hidden="true" /> {t('device.full')}
        </a>
        {originalSrc && (
          <a href={originalSrc} target="_blank" rel="noopener" className="btn-line inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs">
            {t('device.original')}
          </a>
        )}
      </div>

      <div className="flex justify-center overflow-hidden rounded-xl border border-ink/10 bg-paper-2/60 p-3 sm:p-6">
        <motion.div
          layout
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: current.width, maxWidth: '100%' }}
          className={`overflow-hidden bg-black ${device === 'desktop' ? 'rounded-lg ring-1 ring-ink/15' : 'rounded-[1.8rem] border-[6px] border-ink'}`}
        >
          {device === 'desktop' && (
            <div className="flex items-center gap-1.5 border-b border-ink/10 bg-card px-3 py-2">
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="ml-3 truncate rounded-full bg-paper px-3 py-0.5 font-mono text-[10px] text-ink-3">vogmerveille.demo</span>
            </div>
          )}
          <iframe title={title} src={src} loading="lazy" className="block w-full bg-black" style={{ height: current.height }} />
        </motion.div>
      </div>
    </div>
  );
}
