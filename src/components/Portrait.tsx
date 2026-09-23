import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, UserRound } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { LogoTile } from './ui';

/** Professional portrait with a 3D tilt that follows the pointer, a moving glare and floating badges. */
export function Portrait() {
  const { t } = useLang();
  const { profile, experiences, lang } = useContent();
  const bankClient = experiences.find((e) => e.client?.parent)?.client;
  const [failed, setFailed] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgb(255 255 255 / 0.2), transparent 45%)`);

  return (
    <div className="relative mx-auto w-full max-w-[380px] [perspective:1000px]">
      <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgb(168_85_247/0.45),rgb(34_211_238/0.16)_45%,transparent_70%)] blur-2xl" />

      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glow-border relative rounded-[2rem]"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-zinc-800">
          {failed ? (
            <div className="flex aspect-[4/5] items-center justify-center text-zinc-500">
              <UserRound className="size-24" aria-hidden="true" />
            </div>
          ) : (
            <img
              src={profile.avatar}
              alt={t('portrait.alt', { name: profile.name })}
              onError={() => setFailed(true)}
              width={800}
              height={800}
              className="aspect-[4/5] w-full scale-[1.12] object-cover object-[50%_18%] [image-rendering:high-quality]"
              fetchPriority="high"
            />
          )}
          <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 mix-blend-overlay" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 pt-16" style={{ transform: 'translateZ(40px)' }}>
            <p className="text-lg font-bold text-white">{profile.name}</p>
            <p className="text-sm text-zinc-200">{profile.title}</p>
          </div>
        </div>

        {bankClient?.parent && (
          <div style={{ transform: 'translateZ(60px)' }} className="absolute top-6 -left-6 sm:-left-12">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/80 p-2 pr-3.5 shadow-[0_10px_40px_-10px_rgb(16_185_129/0.7)] backdrop-blur-xl"
            >
              <LogoTile sources={bankClient.parent.logos} name={bankClient.parent.name} size={36} fallback={<ShieldCheck className="size-6 text-emerald-300" />} />
              <span className="text-left leading-tight">
                <span className="block text-[10px] tracking-wider text-emerald-300 uppercase">{t('portrait.client')}</span>
                <span className="block text-xs font-semibold text-white">{t('portrait.clientLine')}</span>
                <span className="block text-[10px] text-zinc-400">Domofinance · MFA · Ansible</span>
              </span>
            </motion.div>
          </div>
        )}
        <div style={{ transform: 'translateZ(50px)' }} className="absolute -right-4 bottom-24 sm:-right-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/80 px-3.5 py-2.5 shadow-[0_10px_40px_-10px_rgb(168_85_247/0.8)] backdrop-blur-xl"
          >
            <ShieldCheck className="size-4 text-violet-300" aria-hidden="true" />
            <span className="text-xs font-semibold text-white">{lang === 'fr' ? 'MFA · Sécurité · Qualité' : 'MFA · Security · QA'}</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
