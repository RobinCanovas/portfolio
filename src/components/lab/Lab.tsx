import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Database, Loader2, Network, Rocket, Sigma } from 'lucide-react';
import { useLang } from '../../i18n';
import type { UiKey } from '../../i18n/ui';
import { Section } from '../ui';
import { DeployPipeline } from './DeployPipeline';
import { GradientDescent } from './GradientDescent';
import { SubnetCalculator } from './SubnetCalculator';

const SqlPlayground = lazy(() => import('../demos/SqlPlayground').then((m) => ({ default: m.SqlPlayground })));

const TABS: { id: string; label: UiKey; icon: typeof Network }[] = [
  { id: 'network', label: 'lab.tab.network', icon: Network },
  { id: 'deploy', label: 'lab.tab.deploy', icon: Rocket },
  { id: 'db', label: 'lab.tab.db', icon: Database },
  { id: 'maths', label: 'lab.tab.maths', icon: Sigma },
];

export function Lab() {
  const { t } = useLang();
  const [tab, setTab] = useState('network');

  return (
    <Section id="lab" eyebrow={t('section.lab')} title={t('section.lab.title')}>
      <p className="-mt-4 mb-8 max-w-3xl text-lg text-zinc-200">{t('lab.intro')}</p>

      <div role="tablist" aria-label={t('section.lab.title')} className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            id={`lab-tab-${tb.id}`}
            aria-selected={tab === tb.id}
            aria-controls={`lab-panel-${tb.id}`}
            onClick={() => setTab(tb.id)}
            className={`relative isolate inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${tab === tb.id ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            {tab === tb.id && (
              <motion.span
                layoutId="lab-tab"
                className="absolute inset-0 -z-10 rounded-xl border border-violet-400/40 bg-gradient-to-r from-violet-500/25 to-cyan-500/15 shadow-[0_0_24px_rgb(168_85_247/0.35)]"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <tb.icon className="size-4" aria-hidden="true" />
            {t(tb.label)}
          </button>
        ))}
      </div>

      <div className="glass spotlight rounded-3xl p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            id={`lab-panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`lab-tab-${tab}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'network' && <SubnetCalculator />}
            {tab === 'deploy' && <DeployPipeline />}
            {tab === 'maths' && <GradientDescent />}
            {tab === 'db' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{t('lab.db.title')}</h3>
                  <p className="mt-1 text-sm text-zinc-300">{t('lab.db.text')}</p>
                </div>
                <Suspense
                  fallback={
                    <p className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="size-4 animate-spin" /> {t('page.loading')}
                    </p>
                  }
                >
                  <SqlPlayground />
                </Suspense>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
