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
    <div className={`${size} shrink-0 rounded-full bg-card p-[3px] ring-1 ring-ink/15`}>
      {failed ? (
        <div className="flex size-full items-center justify-center rounded-full bg-paper-2 text-ink-3">
          <UserRound className="size-1/2" aria-hidden="true" />
        </div>
      ) : (
        <img src={profile.avatar} alt={profile.name} onError={() => setFailed(true)} className="size-full rounded-full object-cover" loading="lazy" />
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
    'w-full rounded-lg border border-ink/15 bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-4 transition-colors focus:border-ink/60 focus:outline-none';

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] tracking-wider text-ink-3 uppercase">{t('contact.name')}</span>
          <input name="name" required autoComplete="name" className={field} placeholder={t('contact.namePh')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] tracking-wider text-ink-3 uppercase">{t('contact.email')}</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder={t('contact.emailPh')} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block font-mono text-[11px] tracking-wider text-ink-3 uppercase">{t('contact.subject')}</span>
        <input name="subject" className={field} placeholder={t('contact.subjectPh')} />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-mono text-[11px] tracking-wider text-ink-3 uppercase">{t('contact.message')}</span>
        <textarea name="message" required rows={4} className={`${field} resize-y`} placeholder={t('contact.messagePh')} />
      </label>
      <button type="submit" className="btn-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-medium">
        <Send className="size-4" aria-hidden="true" /> {t('contact.send')}
      </button>
      {sent && (
        <p role="status" className="text-center text-xs text-good">
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
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="btn-line flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium">
        <LinkedinIcon className="size-5 shrink-0 text-[#0a66c2]" /> {t('contact.linkedin')}
      </a>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(links.email).then(() => setCopied(true), () => undefined)}
        className="btn-line flex items-center gap-3 rounded-full px-4 py-3 text-left text-sm"
      >
        <Copy className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
        <span className="truncate">{copied ? t('contact.copied') : links.email}</span>
      </button>
      <a href={links.cv} target="_blank" rel="noopener" className="btn-line flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium">
        <FileText className="size-5 shrink-0 text-ink-3" aria-hidden="true" /> {t('contact.cv')}
      </a>
      <button
        type="button"
        onClick={() =>
          downloadVCard(
            buildVCard({ name: profile.name, title: profile.title, email: links.email, linkedin: links.linkedin, org: 'Éditions Ellipses' }),
            'robin-canovas.vcf',
          )
        }
        className="btn-line flex items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-medium"
      >
        <Contact2 className="size-5 shrink-0 text-ink-3" aria-hidden="true" /> {t('contact.vcard')}
      </button>
    </div>
  );
}

export function Contact({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const { t } = useLang();
  const { profile } = useContent();
  return (
    <Section id="contact" eyebrow={t('section.contact')} title={t('section.contact.title')}>
      <div className="panel relative overflow-hidden rounded-xl p-6 sm:p-10">
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <Avatar />
          <div className="flex-1">
            <p className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{t('contact.lead')}</p>
            <p className="mt-2 text-ink-2">{t('contact.sub')}</p>
          </div>
          <button type="button" onClick={onOpen} className="btn-ink inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium">
            <Mail className="size-4" aria-hidden="true" /> {t('contact.cta')}
          </button>
        </div>
        <div className="relative mt-8 border-t border-ink/10 pt-6">
          <QuickLinks />
        </div>
      </div>

      <Modal open={open} onClose={onClose} title={t('contact.title')} wide>
        <div className="mb-5 flex items-center gap-4">
          <Avatar size="size-14" />
          <div>
            <p className="font-serif text-xl text-ink">{profile.name}</p>
            <p className="text-sm text-ink-2">{profile.title}</p>
          </div>
        </div>
        <ContactForm />
        <div className="mt-6 border-t border-ink/10 pt-5">
          <QuickLinks />
        </div>
      </Modal>
    </Section>
  );
}
