import { getCollection, type CollectionEntry } from 'astro:content';
import { splitId, numberOf, articleUrl, sortForCollection } from './articles';
import type { ArticleData } from '../content.config';

export type Article = {
  id: string;
  collection: string;
  slug: string;
  url: string;
  num: number;
  interactive: boolean;
  data: ArticleData;
  entry: CollectionEntry<'articles'>;
};

function toArticle(entry: CollectionEntry<'articles'>): Article {
  const { collection, slug } = splitId(entry.id);
  return {
    id: entry.id,
    collection,
    slug,
    url: articleUrl(collection, slug),
    num: numberOf(slug),
    interactive: /class="ix"/.test(entry.body ?? ''),
    data: entry.data,
    entry,
  };
}

export async function getSeriesList() {
  const all = await getCollection('series');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getSeries(slug: string) {
  return (await getCollection('series')).find((s) => s.data.slug === slug);
}

export async function getPublishedArticles(): Promise<Article[]> {
  const entries = await getCollection('articles', ({ data }) => data.status === 'published');
  return entries.map(toArticle).sort((a, b) =>
    a.collection.localeCompare(b.collection) ||
    (a.num - b.num) ||
    b.data.date.localeCompare(a.data.date) ||
    a.slug.localeCompare(b.slug));
}

export async function getArticlesIn(collectionSlug: string): Promise<Article[]> {
  const series = await getSeries(collectionSlug);
  const kind = series?.data.kind ?? 'series';
  const all = await getPublishedArticles();
  const mine = all.filter((a) => a.collection === collectionSlug || a.data.lanes.includes(collectionSlug));
  return sortForCollection(mine.map((a) => ({ ...a, date: a.data.date })), kind).map(({ date, ...a }) => a as Article);
}

export async function getArticlesByDesk(desk: string): Promise<Article[]> {
  const all = await getPublishedArticles();
  return all.filter((a) => a.data.desk === desk);
}

export async function getInteractive(): Promise<Article[]> {
  return (await getPublishedArticles()).filter((a) => a.interactive);
}
