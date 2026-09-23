import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const DESKS = ['own', 'run', 'lease', 'finance', 'buy', 'sell'] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    series: z.string().optional(),
    part: z.string().optional(),
    eyebrow: z.string().optional(),
    deck: z.string(),
    author: z.string().default('Cypress Command'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    read_time: z.string(),
    feature_image: z.string().optional(),
    feature_caption: z.string().optional(),
    desk: z.enum(DESKS).optional(),
    lanes: z.array(z.string()).default([]),
    status: z.enum(['published', 'review']).default('published'),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/series' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    shortTitle: z.string(),
    deck: z.string(),
    kind: z.enum(['series', 'lane']),
    state: z.enum(['published', 'coming-soon']),
    order: z.number(),
    hasMap: z.boolean().default(false),
    parts: z.array(z.object({ num: z.number(), roman: z.string(), name: z.string() })).default([]),
    plannedTitles: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroCaption: z.string().optional(),
  }),
});

export const collections = { articles, series };
export type ArticleData = z.infer<typeof articles.schema>;
export type SeriesData = z.infer<typeof series.schema>;
