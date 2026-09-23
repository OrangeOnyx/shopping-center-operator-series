import type { APIRoute } from 'astro';
import { getPublishedArticles, getSeriesList } from '../lib/collections';

export const GET: APIRoute = async () => {
  const series = await getSeriesList();
  const titles = Object.fromEntries(series.map((s) => [s.data.slug, s.data.title]));
  const items = (await getPublishedArticles()).map((a) => ({
    url: a.url,
    title: a.data.title,
    deck: a.data.deck,
    collection: a.collection,
    collectionTitle: titles[a.collection] ?? a.collection,
    desk: a.data.desk ?? '',
    headings: Array.from((a.entry.body ?? '').matchAll(/^##\s+(.+)$/gm)).map((m) => m[1].trim()),
  }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};
