import { useLang } from '../../i18n';
import { SimpleIcon } from '../TechIcon';

/** The everyday stack, set once on a ruled line under the hero, like the keywords of an article. */
const STACK = [
  { slug: 'php', name: 'PHP' },
  { slug: 'symfony', name: 'Symfony' },
  { slug: 'react', name: 'React' },
  { slug: 'typescript', name: 'TypeScript' },
  { slug: 'openjdk', name: 'Java' },
  { slug: 'python', name: 'Python' },
  { slug: 'mysql', name: 'MySQL' },
  { slug: 'debian', name: 'Linux' },
  { slug: 'ansible', name: 'Ansible' },
  { slug: 'git', name: 'Git' },
];

export function StackLine() {
  const { t } = useLang();
  return (
    <div className="border-y border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 px-4 py-5 sm:px-6">
        <span className="font-mono text-[11px] tracking-[0.22em] text-ink-4 uppercase">{t('stack.label')}</span>
        <ul className="contents">
          {STACK.map((s) => (
            <li key={s.slug} className="group inline-flex items-center gap-2 text-sm text-ink-2">
              <SimpleIcon slug={s.slug} className="size-4" />
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
