import { motion } from 'framer-motion';
import { ArrowDown, FileText, Mail, MapPin } from 'lucide-react';
import { links, profile } from '../data/profile';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { Terminal } from './Terminal';

export function Hero({ onContact }: { onContact: () => void }) {
  return (
    <section id="home" className="relative mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-4 pt-24 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="glass inline-flex flex-wrap items-center gap-2 rounded-full px-3 py-1.5 text-xs">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-medium text-emerald-300">{profile.status}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-300">{profile.currentRole}</span>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Hi, I’m <span className="text-gradient">{profile.name}</span>
        </h1>
        <p className="mt-3 text-xl font-medium text-zinc-200 sm:text-2xl">{profile.title}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="size-4" aria-hidden="true" /> {profile.location}
        </p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">{profile.pitch}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onContact}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
          >
            <Mail className="size-4" aria-hidden="true" /> Contact me
          </button>
          <a href={links.cv} target="_blank" rel="noopener" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition hover:bg-white/10">
            <FileText className="size-4" aria-hidden="true" /> Resume
          </a>
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="glass rounded-xl p-3 text-zinc-300 transition hover:bg-white/10 hover:text-white">
            <GithubIcon className="size-5" />
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="glass rounded-xl p-3 text-zinc-300 transition hover:bg-white/10 hover:text-[#0a66c2]">
            <LinkedinIcon className="size-5" />
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
        <Terminal />
      </motion.div>

      <a href="#experience" aria-label="Scroll to experience" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-zinc-500 hover:text-white sm:block">
        <ArrowDown className="size-5" />
      </a>
    </section>
  );
}
