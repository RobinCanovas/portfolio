import { useState, type FormEvent } from 'react';
import { Copy, FileText, Mail, Send, UserRound } from 'lucide-react';
import { links, profile } from '../data/profile';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { Modal, Section } from './ui';

function Avatar({ size = 'size-24' }: { size?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${size} shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 p-[2px]`}>
      {failed ? (
        <div className="flex size-full items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
          <UserRound className="size-1/2" aria-hidden="true" />
        </div>
      ) : (
        <img src={profile.avatar} alt={profile.name} onError={() => setFailed(true)} className="size-full rounded-full object-cover" loading="lazy" />
      )}
    </div>
  );
}

/** Opens the visitor's mail client with a pre-filled message — no backend needed. Swap for Formspree/Resend if desired. */
function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const subject = encodeURIComponent(`[Portfolio] ${String(data.get('subject') || 'Hello')} — ${name}`);
    const body = encodeURIComponent(`${String(data.get('message') ?? '')}\n\n— ${name} (${String(data.get('email') ?? '')})`);
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400 focus:outline-none';

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-400">Name</span>
          <input name="name" required autoComplete="name" className={field} placeholder="Jane Doe" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-400">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="jane@company.com" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-400">Subject</span>
        <input name="subject" className={field} placeholder="Job opportunity, project…" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-400">Message</span>
        <textarea name="message" required rows={4} className={`${field} resize-y`} placeholder="Tell me about it" />
      </label>
      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:brightness-110">
        <Send className="size-4" aria-hidden="true" /> Send message
      </button>
      {sent && <p role="status" className="text-center text-xs text-emerald-300">Your mail client should open with the message ready.</p>}
    </form>
  );
}

function QuickLinks() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
        <LinkedinIcon className="size-5" /> Connect on LinkedIn
      </a>
      <a href={links.github} target="_blank" rel="noopener noreferrer" className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
        <GithubIcon className="size-5" /> GitHub
      </a>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(links.email).then(() => setCopied(true), () => undefined)}
        className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white hover:bg-white/10"
      >
        <Copy className="size-5" aria-hidden="true" />
        <span className="truncate">{copied ? 'Email copied!' : links.email}</span>
      </button>
      <a href={links.cv} target="_blank" rel="noopener" className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
        <FileText className="size-5" aria-hidden="true" /> Download resume
      </a>
    </div>
  );
}

export function Contact({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  return (
    <Section id="contact" eyebrow="05 · Contact" title="Let’s build something">
      <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div aria-hidden="true" className="absolute -bottom-24 -left-24 size-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -top-24 -right-24 size-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <Avatar />
          <div className="flex-1">
            <p className="text-xl font-semibold text-white">Looking for a Symfony / React developer?</p>
            <p className="mt-1 text-zinc-400">I’m open to opportunities — full-time roles, apprenticeships and freelance missions.</p>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            <Mail className="size-4" aria-hidden="true" /> Get in touch
          </button>
        </div>
        <div className="relative mt-8">
          <QuickLinks />
        </div>
      </div>

      <Modal open={open} onClose={onClose} title="Get in touch" wide>
        <div className="mb-5 flex items-center gap-4">
          <Avatar size="size-14" />
          <div>
            <p className="font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-zinc-400">{profile.title}</p>
          </div>
        </div>
        <ContactForm />
        <div className="mt-6 border-t border-white/10 pt-5">
          <QuickLinks />
        </div>
      </Modal>
    </Section>
  );
}
