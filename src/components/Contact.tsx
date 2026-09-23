import { useState, type FormEvent } from 'react';
import { Contact2, Copy, FileText, Mail, Send, UserRound } from 'lucide-react';
import { buildVCard, downloadVCard } from '../lib/share';
import { useContent, useLang } from '../i18n';
import { LinkedinIcon } from './BrandIcons';
import { Modal, Section } from './ui';

function Avatar({ size = 'size-24' }: { size?: string }) {
  const { profile } = useContent();
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${size} shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 p-[2px] shadow-[0_0_30px_rgb(168_85_247/0.4)]`}>
      {failed ? (
        <div className="flex size-full items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
          <UserRound className="size-1/2" aria-hidden="true" />
        </div>
      ) : (
        <img src={profile.avatar} alt={profile.name} onError={() => setFailed(true)} className="size-full rounded-full object-cover object-top" loading="lazy" />
      )}
    </div>
  );
}

/** Opens the visitor's mail client with a pre-filled message — no backend needed. */
function ContactForm() {
  const { t } = useLang();
  const { links } = useContent();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const subject = encodeURIComponent(`[Portfolio] ${String(data.get('subject') || 'Hello')} | ${name}`);
    const body = encodeURIComponent(`${String(data.get('message') ?? '')}\n\n${name} (${String(data.get('email') ?? '')})`);
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field =
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20';

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-300">{t('contact.name')}</span>
          <input name="name" required autoComplete="name" className={field} placeholder={t('contact.namePh')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-300">{t('contact.email')}</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder={t('contact.emailPh')} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-300">{t('contact.subject')}</span>
        <input name="subject" className={field} placeholder={t('contact.subjectPh')} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-300">{t('contact.message')}</span>
        <textarea name="message" required rows={4} className={`${field} resize-y`} placeholder={t('contact.messagePh')} />
      </label>
      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-[0_0_24px_rgb(168_85_247/0.4)] transition hover:brightness-110">
        <Send className="size-4" aria-hidden="true" /> {t('contact.send')}
      </button>
      {sent && (
        <p role="status" className="text-center text-xs text-emerald-300">
          {t('contact.sent')}
        </p>
      )}
    </form>
  );
}

function QuickLinks() {
  const { t } = useLang();
  const { links, profile } = useContent();
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgb(10_102_194/0.4)] transition hover:brightness-110">
        <LinkedinIcon className="size-5" /> {t('contact.linkedin')}
      </a>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(links.email).then(() => setCopied(true), () => undefined)}
        className="glass spotlight flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white hover:bg-white/10"
      >
        <Copy className="size-5 shrink-0" aria-hidden="true" />
        <span className="truncate">{copied ? t('contact.copied') : links.email}</span>
      </button>
      <a href={links.cv} target="_blank" rel="noopener" className="glass spotlight flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
        <FileText className="size-5" aria-hidden="true" /> {t('contact.cv')}
      </a>
      <button
        type="button"
        onClick={() =>
          downloadVCard(
            buildVCard({ name: profile.name, title: profile.title, email: links.email, linkedin: links.linkedin, org: 'Éditions Ellipses' }),
            'robin-canovas.vcf',
          )
        }
        className="glass spotlight flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
      >
        <Contact2 className="size-5" aria-hidden="true" /> {t('contact.vcard')}
      </button>
    </div>
  );
}

export function Contact({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const { t } = useLang();
  const { profile } = useContent();
  return (
    <Section id="contact" eyebrow={t('section.contact')} title={t('section.contact.title')}>
      <div className="glass spotlight relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div aria-hidden="true" className="absolute -bottom-24 -left-24 size-72 rounded-full bg-violet-600/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -top-24 -right-24 size-72 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <Avatar />
          <div className="flex-1">
            <p className="text-xl font-semibold text-white">{t('contact.lead')}</p>
            <p className="mt-1 text-zinc-300">{t('contact.sub')}</p>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-900 shadow-[0_0_30px_rgb(255_255_255/0.25)] transition hover:bg-zinc-200"
          >
            <Mail className="size-4" aria-hidden="true" /> {t('contact.cta')}
          </button>
        </div>
        <div className="relative mt-8">
          <QuickLinks />
        </div>
      </div>

      <Modal open={open} onClose={onClose} title={t('contact.title')} wide>
        <div className="mb-5 flex items-center gap-4">
          <Avatar size="size-14" />
          <div>
            <p className="font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-zinc-300">{profile.title}</p>
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
