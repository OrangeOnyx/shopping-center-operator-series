export function splitId(id: string): { collection: string; slug: string } {
  const i = id.indexOf('/');
  return { collection: id.slice(0, i), slug: id.slice(i + 1) };
}

export function numberOf(slug: string): number {
  const m = /^(\d+)-/.exec(slug);
  return m ? Number(m[1]) : 0;
}

export function partName(part: string | undefined): string {
  if (!part) return '';
  return part.split('—').pop()!.trim();
}

export function articleUrl(collection: string, slug: string): string {
  return `/${collection}/${slug}/`;
}

export function sortForCollection<T extends { slug: string; date: string }>(items: T[], kind: 'series' | 'lane'): T[] {
  const copy = [...items];
  if (kind === 'series') return copy.sort((a, b) => numberOf(a.slug) - numberOf(b.slug) || a.slug.localeCompare(b.slug));
  return copy.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function inkClass(ink: string | undefined): string {
  return 'ink-' + (ink && ['terra', 'olive', 'mustard', 'ink'].includes(ink) ? ink : 'ink');
}
