import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Copy, CornerDownLeft, FileText, FolderGit2, Hash, Languages, Mail, Search } from 'lucide-react';
import { getContent, type Content } from '../data/content';
import { useContent, useLang } from '../i18n';
import { ui, type UiKey } from '../i18n/ui';
import { LinkedinIcon } from './BrandIcons';
import { CompanyLogo } from './ui';

export interface PaletteActions {
  onOpenExperience: (id: string) => void;
  onFocusProject: (id: string) => void;
  onContact: () => void;
  onToggleLang?: () => void;
}

type Group = 'Navigate' | 'Experience' | 'Projects' | 'Actions';

export interface Item {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: ReactNode;
  keywords: string;
  run: () => void;
}

const SECTIONS: [string, UiKey][] = [
  ['home', 'nav.home'],
  ['experience', 'nav.experience'],
  ['projects', 'nav.projects'],
  ['skills', 'nav.skills'],
  ['education', 'nav.education'],
  ['goals', 'nav.goals'],
  ['contact', 'section.contact.title'],
];

const englishT = (key: UiKey) => ui.en[key];

export function buildItems(
  { onOpenExperience, onFocusProject, onContact, onToggleLang }: PaletteActions,
  c: Content = getContent('en'),
  t: (key: UiKey) => string = englishT,
): Item[] {
  const go = (id: string) => () => {
    window.location.hash = id;
  };
  const open = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');
  const items: Item[] = [
    ...SECTIONS.map(([id, key]) => ({ id: `nav-${id}`, group: 'Navigate' as const, label: t(key), icon: <Hash className="size-4" />, keywords: `section ${id}`, run: go(id) })),
    ...c.experiences.map((e) => ({
      id: `exp-${e.id}`,
      group: 'Experience' as const,
      label: e.company.name,
      hint: e.role,
      icon: <CompanyLogo company={e.company} size={22} />,
      keywords: `${e.role} ${e.stack.join(' ')} ${e.contract} ${e.client?.name ?? ''} ${e.client?.parent?.name ?? ''}`,
      run: () => onOpenExperience(e.id),
    })),
    ...c.projects.map((p) => ({
      id: `proj-${p.id}`,
      group: 'Projects' as const,
      label: p.title,
      hint: p.stack.slice(0, 3).map(c.tech).join(' · '),
      icon: <FolderGit2 className="size-4" />,
      keywords: `${p.context} ${p.stack.join(' ')} ${p.description}`,
      run: () => onFocusProject(p.id),
    })),
    { id: 'act-contact', group: 'Actions', label: t('palette.message'), icon: <Mail className="size-4" />, keywords: 'contact email hire', run: onContact },
    {
      id: 'act-copy',
      group: 'Actions',
      label: t('palette.copy'),
      hint: c.links.email,
      icon: <Copy className="size-4" />,
      keywords: 'mail clipboard',
      run: () => void navigator.clipboard?.writeText(c.links.email).catch(() => undefined),
    },
    { id: 'act-cv', group: 'Actions', label: t('palette.cv'), icon: <FileText className="size-4" />, keywords: 'cv resume pdf download', run: open(c.links.cv) },
    { id: 'act-linkedin', group: 'Actions', label: t('palette.linkedin'), icon: <LinkedinIcon className="size-4" />, keywords: 'social network', run: open(c.links.linkedin) },
  ];
  if (onToggleLang) {
    items.push({ id: 'act-lang', group: 'Actions', label: t('palette.lang'), icon: <Languages className="size-4" />, keywords: 'language langue english français fr en', run: onToggleLang });
  }
  return items;
}

export function filterItems(items: Item[], query: string): Item[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return items;
  return items.filter((it) => {
    const haystack = `${it.label} ${it.hint ?? ''} ${it.keywords} ${it.group}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function CommandPalette({ open, onClose, ...actions }: PaletteActions & { open: boolean; onClose: () => void }) {
  const { t, toggle } = useLang();
  const c = useContent();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Actions are stable callbacks from App, so items only need rebuilding when opened or when the language changes.
  const items = useMemo(() => buildItems({ onToggleLang: toggle, ...actions }, c, t), [open, c, t]);
  const results = useMemo(() => filterItems(items, query), [items, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(timer);
      previous?.focus?.();
    };
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const runAt = (index: number) => {
    const item = results[index];
    if (!item) return;
    onClose();
    // Let the palette unmount (and focus return) before navigating.
    window.setTimeout(item.run, 60);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = results.length || 1;
      setCursor((cur) => (cur + (e.key === 'ArrowDown' ? 1 : -1) + n) % n);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(cursor);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/25 px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('palette.label')}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="panel lift w-full max-w-xl overflow-hidden rounded-xl"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-4">
              <Search className="size-4 text-ink-3" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[cursor] ? `palette-${results[cursor].id}` : undefined}
                placeholder={t('palette.placeholder')}
                className="h-14 flex-1 bg-transparent text-base text-ink placeholder:text-ink-4 focus:outline-none"
              />
              <kbd className="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[10px] text-ink-3">ESC</kbd>
            </div>

            <ul ref={listRef} id="palette-list" role="listbox" aria-label={t('palette.results')} className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-10 text-center text-sm text-ink-3">{t('palette.none', { q: query })}</li>}
              {results.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {header && (
                      <p className="flex items-center gap-1.5 px-3 pt-3 pb-1 font-mono text-[10px] tracking-widest text-ink-3 uppercase">
                        {header === 'Experience' && <Briefcase className="size-3" aria-hidden="true" />}
                        {t(`palette.${header}` as const)}
                      </p>
                    )}
                    <div
                      id={`palette-${item.id}`}
                      role="option"
                      aria-selected={i === cursor}
                      data-index={i}
                      onMouseMove={() => setCursor(i)}
                      onClick={() => runAt(i)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors ${i === cursor ? 'bg-ink/[0.05]' : ''}`}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center text-ink-2">{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.hint && <span className="hidden truncate text-xs text-ink-3 sm:block">{item.hint}</span>}
                      {i === cursor && <CornerDownLeft className="size-3.5 text-accent" aria-hidden="true" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
