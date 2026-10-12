import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowDown, FileText, GraduationCap, Mail, MapPin } from 'lucide-react';
import { useContent, useLang } from '../i18n';
import { LinkedinIcon } from './BrandIcons';
import { CountUp, RotatingWords } from './fx/effects';
import { useRevealed } from './fx/Intro';
import { Portrait } from './Portrait';

const ease = [0.16, 1, 0.3, 1] as const;
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };
/** The greeting sits just above the name: it settles down onto it rather than sliding up through it. */
const above: Variants = { hidden: { opacity: 0, y: -8 }, show: item.show };
/** After the intro the name is already in place (the intro hands it over): it has no entrance of its own. */
const inPlace: Variants = { hidden: { opacity: 1 }, show: { opacity: 1 } };

export function Hero({ onContact }: { onContact: () => void }) {
  const { t, lang } = useLang();
  const { profile, links, experiences, projects } = useContent();
  // Entrance animations wait until the opening intro hands over.
  const revealed = useRevealed();
  const [afterIntro] = useState(() => !revealed);

  const stats = [
    { value: experiences.filter((e) => !e.minor).length, label: t('hero.stat.experiences') },
    { value: 12, suffix: '+', label: t('hero.stat.months') },
    { value: projects.length, label: t('hero.stat.projects') },
    { value: null, text: '2027', label: t('hero.stat.graduation') },
  ];

  return (
    <section id="home" className="relative">
      <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-14 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-[1.25fr_1fr]">
        <motion.div variants={container} initial="hidden" animate={revealed ? 'show' : 'hidden'}>
          <motion.p variants={item} className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">
            <span className="inline-flex items-center gap-2 text-good">
              <span className="size-1.5 rounded-full bg-good" aria-hidden="true" />
              {profile.status}
            </span>
            <span className="text-ink-4" aria-hidden="true">
              /
            </span>
            <span>{profile.currentRole}</span>
          </motion.p>

          <h1 className="mt-8 font-serif text-[clamp(3.6rem,10vw,7.4rem)] leading-[0.92] tracking-[-0.02em] text-ink">
            <motion.span variants={above} className="mb-2 block font-serif text-2xl tracking-normal text-ink-3 italic sm:text-3xl">
              {t('hero.hi')}
            </motion.span>
            <motion.span variants={afterIntro ? inPlace : item} className="inline-block">
              {/* data-hero-name: the opening intro writes the name at these exact coordinates. */}
              <span data-hero-name className="inline-block">
                {profile.name}
              </span>
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-6 text-xl text-ink sm:text-2xl">
            <RotatingWords key={lang} words={t('hero.roles').split('|')} className="text-ink" />
          </motion.p>

          <motion.div variants={item} className="mt-5 space-y-1.5 text-sm text-ink-2">
            <p className="flex items-start gap-2">
              <GraduationCap className="mt-px size-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" /> {t('hero.student')}
            </p>
            <p className="flex items-center gap-2 text-ink-3">
              <MapPin className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" /> {profile.location}
            </p>
          </motion.div>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-[17px]">
            {profile.pitch}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onContact} className="btn-ink inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium">
              <Mail className="size-4" aria-hidden="true" /> {t('hero.contact')}
            </button>
            <a href={links.cv} target="_blank" rel="noopener" className="btn-line inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium">
              <FileText className="size-4" aria-hidden="true" /> {t('hero.resume')}
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn-line flex rounded-full p-3 hover:text-[#0a66c2]">
              <LinkedinIcon className="size-5" />
            </a>
          </motion.div>

          <motion.dl variants={item} key={String(revealed)} className="mt-14 grid max-w-xl grid-cols-2 border-t border-ink/15 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`pt-4 pb-1 ${i > 0 ? 'sm:border-l sm:border-ink/10 sm:pl-5' : ''} ${i % 2 === 1 ? 'border-l border-ink/10 pl-5 sm:pl-5' : ''}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-4xl leading-none text-ink sm:text-[2.6rem]">{s.value === null ? s.text : <CountUp to={s.value} suffix={s.suffix} />}</dd>
                <dd className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase" aria-hidden="true">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={revealed ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, delay: 0.25, ease }}>
          <Portrait />
        </motion.div>
      </div>

      <a
        href="#experience"
        aria-label={t('hero.scroll')}
        data-scroll-cue
        className="group absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ink-3 uppercase transition-colors hover:text-ink sm:flex"
      >
        <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
        {t('hero.readOn')}
      </a>
    </section>
  );
}
