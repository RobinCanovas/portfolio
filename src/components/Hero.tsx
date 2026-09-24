import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { FileText, GraduationCap, Mail, MapPin } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { LinkedinIcon } from './BrandIcons';
import { CountUp, Magnetic, RotatingWords, ScrambleText } from './fx/effects';
import { useRevealed } from './fx/Intro';
import { ParticleField } from './fx/ParticleField';
import { Portrait } from './Portrait';

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const item: Variants = { hidden: { opacity: 0, y: 24, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };

export function Hero({ onContact }: { onContact: () => void }) {
  const { t, lang } = useLang();
  const { profile, links, experiences, projects } = useContent();
  // Entrance animations wait until the opening curtain lifts.
  const revealed = useRevealed();

  // Depth on scroll: background, text and portrait move at different speeds as the hero leaves.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const still = typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 180]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.85], [1, still ? 1 : 0.1]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 110]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, still ? 1 : 0.92]);

  const stats = [
    { value: experiences.filter((e) => !e.minor).length, label: t('hero.stat.experiences') },
    { value: 12, suffix: '+', label: t('hero.stat.months') },
    { value: projects.length, label: t('hero.stat.projects') },
    { value: null, text: '2027', label: t('hero.stat.graduation') },
  ];

  return (
    <section ref={sectionRef} id="home" className="relative isolate overflow-hidden">
      <motion.div aria-hidden="true" style={{ y: bgY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-aurora absolute top-[-20%] left-[10%] size-[55vmax] rounded-full bg-[conic-gradient(from_90deg,#7c3aed88,#06b6d466,#db277755,#7c3aed88)] opacity-80 blur-[110px]" />
        <ParticleField className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </motion.div>

      <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div variants={container} initial="hidden" animate={revealed ? 'show' : 'hidden'} style={{ y: textY, opacity: textOpacity }}>
          <motion.div variants={item} className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-3 py-1.5 text-xs shadow-[0_0_24px_rgb(52_211_153/0.2)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-medium text-emerald-300">{profile.status}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-200">{profile.currentRole}</span>
          </motion.div>

          <motion.h1 variants={item} className="mt-7 text-5xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-7xl">
            <span className="block text-2xl font-medium text-zinc-300 sm:text-3xl">{t('hero.hi')}</span>
            <ScrambleText key={String(revealed)} text={profile.name} className="text-shine cursor-default drop-shadow-[0_0_30px_rgb(168_85_247/0.5)]" />
          </motion.h1>

          <motion.p variants={item} className="mt-5 text-xl font-medium text-zinc-100 sm:text-2xl">
            <RotatingWords key={lang} words={t('hero.roles').split('|')} className="text-white" />
          </motion.p>
          <motion.p variants={item} className="mt-3 flex items-start gap-1.5 text-sm text-zinc-200">
            <GraduationCap className="mt-px size-4 shrink-0 text-amber-300" aria-hidden="true" /> {t('hero.student')}
          </motion.p>
          <motion.p variants={item} className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-zinc-400">
            <MapPin className="size-4" aria-hidden="true" /> {profile.location}
          </motion.p>
          <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {profile.pitch}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={onContact}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-[length:200%_auto] px-6 py-3.5 font-semibold text-white shadow-[0_0_30px_rgb(168_85_247/0.5)] transition-[background-position,box-shadow] duration-500 hover:bg-right hover:shadow-[0_0_50px_rgb(34_211_238/0.6)]"
              >
                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Mail className="size-4" aria-hidden="true" /> {t('hero.contact')}
              </button>
            </Magnetic>
            <Magnetic>
              <a href={links.cv} target="_blank" rel="noopener" className="spotlight inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3.5 font-semibold text-white transition hover:bg-white/[0.09]">
                <FileText className="size-4" aria-hidden="true" /> {t('hero.resume')}
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex rounded-xl border border-white/15 p-3.5 text-zinc-200 transition hover:border-[#0a66c2] hover:text-[#4d9fff] hover:shadow-[0_0_20px_rgb(10_102_194/0.5)]">
                <LinkedinIcon className="size-5" />
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={item} className="mt-12 max-w-lg border-t border-white/[0.08] pt-6">
            <dl key={String(revealed)} className="grid grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-bold text-white sm:text-3xl">{s.value === null ? s.text : <CountUp to={s.value} suffix={s.suffix} />}</dd>
                  <dd className="text-[11px] tracking-wide text-zinc-400 uppercase" aria-hidden="true">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-zinc-400">{t('hero.young')}</p>
          </motion.div>
        </motion.div>

        {/* Scroll parallax on its own layer, so it never fights the entrance animation below. */}
        <motion.div style={{ y: portraitY, scale: portraitScale }}>
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: -12 }}
            animate={revealed ? { opacity: 1, y: 0, rotateX: 0, rotateY: 0 } : undefined}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            {/* Float lives on a plain div: a CSS animation would override Framer's inline transform. */}
            <div className="animate-float">
              <Portrait />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <a href="#experience" aria-label={t('hero.scroll')} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 transition hover:text-white sm:flex">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">scroll</span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/20">
          <motion.span className="mt-2 size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgb(34_211_238)]" animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </span>
      </a>
    </section>
  );
}
