import { motion, type Variants } from 'framer-motion';
import { FileText, Mail, MapPin } from 'lucide-react';
import { experiences, links, profile, projects, skillGroups, volunteering } from '../data/profile';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { CountUp, Magnetic, RotatingWords, ScrambleText } from './fx/effects';
import { ParticleField } from './fx/ParticleField';
import { Terminal } from './Terminal';

const ROLES = ['Symfony developer', 'React engineer', 'API security builder', 'Database modeller', 'Scout leader'];

const STATS = [
  { value: experiences.length, suffix: '', label: 'companies' },
  { value: projects.length, suffix: '', label: 'projects' },
  { value: skillGroups.reduce((n, g) => n + g.skills.length, 0), suffix: '+', label: 'skills' },
  { value: volunteering.years, suffix: '+', label: 'years leading' },
];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const item: Variants = { hidden: { opacity: 0, y: 24, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };

export function Hero({ onContact }: { onContact: () => void }) {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* Aurora + particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-aurora absolute top-[-20%] left-[10%] size-[55vmax] rounded-full bg-[conic-gradient(from_90deg,#7c3aed55,#06b6d433,#db277733,#7c3aed55)] opacity-60 blur-[110px]" />
        <ParticleField className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs shadow-[0_0_24px_rgb(52_211_153/0.15)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-medium text-emerald-300">{profile.status}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">{profile.currentRole}</span>
          </motion.div>

          <motion.h1 variants={item} className="mt-7 text-5xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-7xl">
            <span className="block text-2xl font-medium text-zinc-400 sm:text-3xl">Hi, I’m</span>
            <ScrambleText text={profile.name} className="text-shine cursor-default drop-shadow-[0_0_30px_rgb(168_85_247/0.45)]" />
          </motion.h1>

          <motion.p variants={item} className="mt-5 text-xl font-medium text-zinc-200 sm:text-2xl">
            <RotatingWords words={ROLES} className="text-white" />
          </motion.p>
          <motion.p variants={item} className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-500">
            <MapPin className="size-4" aria-hidden="true" /> {profile.location}
          </motion.p>
          <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {profile.pitch}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={onContact}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-[length:200%_auto] px-6 py-3.5 font-semibold text-white shadow-[0_0_30px_rgb(168_85_247/0.45)] transition-[background-position,box-shadow] duration-500 hover:bg-right hover:shadow-[0_0_50px_rgb(34_211_238/0.55)]"
              >
                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Mail className="size-4" aria-hidden="true" /> Contact me
              </button>
            </Magnetic>
            <Magnetic>
              <a href={links.cv} target="_blank" rel="noopener" className="spotlight inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:bg-white/[0.06]">
                <FileText className="size-4" aria-hidden="true" /> Resume
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex rounded-xl border border-white/10 p-3.5 text-zinc-300 transition hover:border-white/30 hover:text-white hover:shadow-[0_0_20px_rgb(255_255_255/0.15)]">
                <GithubIcon className="size-5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex rounded-xl border border-white/10 p-3.5 text-zinc-300 transition hover:border-[#0a66c2] hover:text-[#4d9fff] hover:shadow-[0_0_20px_rgb(10_102_194/0.5)]">
                <LinkedinIcon className="size-5" />
              </a>
            </Magnetic>
          </motion.div>

          <motion.dl variants={item} className="mt-12 grid max-w-lg grid-cols-4 gap-4 border-t border-white/[0.06] pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold text-white sm:text-3xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dd className="text-[11px] tracking-wide text-zinc-500 uppercase" aria-hidden="true">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: -12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          {/* Float lives on a plain div: a CSS animation would override Framer's inline transform. */}
          <div className="animate-float">
            <Terminal />
          </div>
        </motion.div>
      </div>

      <a href="#experience" aria-label="Scroll to experience" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 transition hover:text-white sm:flex">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">scroll</span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/20">
          <motion.span className="mt-2 size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgb(34_211_238)]" animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </span>
      </a>
    </section>
  );
}
