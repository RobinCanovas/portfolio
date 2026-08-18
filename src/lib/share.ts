/** Share the current page with the native share sheet, or copy its link. Returns what happened. */
export async function shareCurrentPage(title: string): Promise<'shared' | 'copied' | 'failed'> {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return 'shared';
    }
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}

/** Builds a vCard 3.0 so recruiters can save the contact in one click. */
export function buildVCard(p: { name: string; title: string; email: string; linkedin: string; org?: string }): string {
  const [first, ...rest] = p.name.split(' ');
  const esc = (v: string) => v.replace(/([,;\\])/g, '\\$1');
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(rest.join(' '))};${esc(first)};;;`,
    `FN:${esc(p.name)}`,
    `TITLE:${esc(p.title)}`,
    p.org ? `ORG:${esc(p.org)}` : '',
    `EMAIL;TYPE=INTERNET:${p.email}`,
    `URL:${p.linkedin}`,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadVCard(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/vcard' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
