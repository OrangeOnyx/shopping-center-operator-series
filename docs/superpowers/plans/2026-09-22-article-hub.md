# Cypress Command Article Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-series static site at articles.cypresscommand.com with a multi-collection Astro hub styled from Brand Standards 2.0, keeping every legacy URL alive and the five interactive articles working.

**Architecture:** Astro 7 in static output mode, one `articles` content collection (folder = collection slug) plus a `series` JSON manifest collection. Plain `.astro` components, no UI framework; the four interactive widgets are vanilla client scripts reading JSON data. Four Node scripts gate the build (brand, content, links, redirects). Vercel serves `dist/` with `vercel.json` redirects.

**Tech Stack:** Node 24.12, npm 11, Astro 7.3.x, `astro/loaders` glob, `@fontsource/besley|archivo|courier-prime` 5.3.x, `node:test` for scripts and pure helpers, Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-09-22-article-hub-design.md`

## Global Constraints

- Repo: this repository (`site-v2`, GitHub `OrangeOnyx/shopping-center-operator-series`, Vercel project `site-v2`, domain `articles.cypresscommand.com`). All work on branch `hub`. Never push to `main` or touch production; a Vercel preview is the deliverable of this plan.
- `design-system/tokens.css` and `components.css` are copied verbatim from the v2.0 package at `C:/Users/adam/AppData/Local/Temp/claude/C--Users-adam-Projects-article-series/3be76434-1b19-431e-86d1-29d3498fc74c/scratchpad/rebrand-v2/cypress-command-rebrand/design-system/` (re-extract from `C:/Users/adam/Projects/CYPRESS COMMANDv1/cypress-command-rebrand-v2.0-final.zip` if the scratchpad is gone). Never edit them.
- No raw hex colors, no `font-family` naming a face, no `box-shadow` other than `none` anywhere under `src/`. Only `var(--cc-*)` tokens. `scripts/check-brand.mjs` enforces this.
- Fonts: Besley 400 italic, 700, 900. Archivo 400, 500, 700, 800. Courier Prime 400, 700. Nothing else.
- Terra is the only accent. Olive tag "Published" and Mustard tag "In progress" on collection cards only. Oxblood never appears. Cypress surface appears once (PublisherBand on the hub).
- Radius 2px on cards/plates, 4px on toggle and search input. No shadows.
- Product name is **Command Platform**. "Cypress Command" names the company only. No "Orange Ocean", "Groundwork", "Atlas" on any public surface; "OTB Command" only inside article 35's history.
- Messaging: descriptor "Practical intelligence for real operations."; footer sign-off "Systems under control. Results that last."; hub headline "Operator-grade writing on the work that runs real businesses."; short boilerplate from the v2 application kit §2.
- localStorage keys must stay `cc-theme` and `cc-checklist:<id>` with item keys `<sectionIndex>:<itemIndex>` so existing readers keep progress.
- Article slugs are the existing file stems. URLs are `/<collection>/<slug>/` with trailing slash.
- Every commit message ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## File map

| Path | Responsibility |
|---|---|
| `astro.config.mjs` | static output, trailing slashes, remark plugins |
| `src/content.config.ts` | `articles` and `series` collection schemas |
| `src/content/series/*.json` | six collection manifests |
| `src/content/articles/<collection>/*.md` | article sources |
| `src/lib/articles.ts` | pure helpers: slug parsing, part parsing, sorting, url building (tested) |
| `src/lib/collections.ts` | Astro-side queries wrapping `getCollection` |
| `src/lib/remark-article.mjs` | remark plugins: strip first H1, strip footer block |
| `src/data/widgets/*.json` | checklist, ai-map, sheets, calendar data |
| `src/layouts/Base.astro` | html shell, head, theme boot, masthead, footer |
| `src/components/*.astro` | one component per file, named in tasks |
| `src/scripts/widgets/*.js` | one widget per file plus `hydrate.js` |
| `src/styles/site.css` | page rules on top of the design system |
| `src/pages/**` | routes |
| `scripts/check-*.mjs` | build gates, each with a `.test.mjs` |
| `scripts/harvest-grok-notes.mjs` | converts Grok journal to review-status notes |
| `vercel.json` | redirects and trailing slash |
| `archive/legacy-static/` | the pre-Astro site |

---

### Task 1: Archive the legacy site and scaffold Astro

**Files:**
- Move: `articles/`, `assets/`, `index.html`, `article.html`, `map.html`, `build.py`, `dev-server.js` → `archive/legacy-static/`
- Create: `package.json`, `astro.config.mjs`, `.gitignore`, `src/pages/index.astro` (placeholder), `design-system/` (copied), `README.md`

**Interfaces:**
- Produces: `npm run build` → `dist/`; `npm run dev` → http://localhost:4321

- [ ] **Step 1: Create the branch and archive the legacy files**

```bash
cd "C:/Users/adam/Projects/article series/shopping-center-series/site-v2"
git checkout -b hub
mkdir -p archive/legacy-static
git mv articles assets index.html article.html map.html build.py dev-server.js archive/legacy-static/
git rm -q package.json
git commit -q -m "Archive the legacy static site under archive/legacy-static

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 2: Copy the v2 design system verbatim**

```bash
SRC="C:/Users/adam/AppData/Local/Temp/claude/C--Users-adam-Projects-article-series/3be76434-1b19-431e-86d1-29d3498fc74c/scratchpad/rebrand-v2/cypress-command-rebrand/design-system"
mkdir -p design-system/logo
cp "$SRC/tokens.css" "$SRC/tokens.json" "$SRC/components.css" design-system/
cp "$SRC"/logo/*.svg design-system/logo/
cp "$SRC/logo/png/cc-mark-terra-1024.png" design-system/logo/
ls design-system design-system/logo
```

Expected: `components.css tokens.css tokens.json logo/` and eleven svg files plus one png.

- [ ] **Step 3: Write package.json**

```json
{
  "name": "cypress-command-articles",
  "version": "3.0.0",
  "private": true,
  "type": "module",
  "description": "Cypress Command article hub — articles.cypresscommand.com",
  "scripts": {
    "dev": "astro dev",
    "check": "node scripts/check-brand.mjs && node scripts/check-content.mjs",
    "build": "npm run check && astro build && node scripts/check-links.mjs && node scripts/check-redirects.mjs",
    "preview": "astro preview",
    "test": "node --test src/lib/*.test.ts scripts/*.test.mjs"
  },
  "dependencies": {
    "@fontsource/archivo": "^5.3.0",
    "@fontsource/besley": "^5.3.0",
    "@fontsource/courier-prime": "^5.3.0",
    "astro": "^7.3.4"
  }
}
```

- [ ] **Step 4: Write astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import { remarkStripFirstH1, remarkStripFooter } from './src/lib/remark-article.mjs';

export default defineConfig({
  site: 'https://articles.cypresscommand.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    remarkPlugins: [remarkStripFirstH1, remarkStripFooter],
  },
});
```

- [ ] **Step 5: Write the remark plugins**

`src/lib/remark-article.mjs`:

```js
/** Remove the first H1 from the body: the layout renders the title from front matter. */
export function remarkStripFirstH1() {
  return (tree) => {
    const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i !== -1) tree.children.splice(i, 1);
  };
}

/** Remove the trailing "---" + italic disclaimer paragraph: the layout renders its own. */
export function remarkStripFooter() {
  return (tree) => {
    const c = tree.children;
    const last = c[c.length - 1];
    const prev = c[c.length - 2];
    const isDisclaimer =
      last && last.type === 'paragraph' &&
      last.children[0] && last.children[0].type === 'emphasis' &&
      /^Cypress Command builds/.test(mdText(last.children[0]));
    if (isDisclaimer && prev && prev.type === 'thematicBreak') c.splice(c.length - 2, 2);
    else if (isDisclaimer) c.splice(c.length - 1, 1);
  };
}

function mdText(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(mdText).join('');
}
```

- [ ] **Step 6: Write .gitignore and a placeholder page**

`.gitignore`:

```
node_modules/
dist/
.astro/
*.log
.DS_Store
Thumbs.db
.vercel
```

`src/pages/index.astro`:

```astro
---
---
<html lang="en"><head><meta charset="utf-8"><title>Cypress Command</title></head>
<body><p>Hub scaffold.</p></body></html>
```

Create empty stubs so `npm run build` has scripts to call (they are filled in later tasks):

```bash
mkdir -p scripts src/lib
for s in check-brand check-content check-links check-redirects; do printf 'console.log("%s: stub");\n' "$s" > scripts/$s.mjs; done
```

- [ ] **Step 7: Install and build**

```bash
npm install
npm run build
ls dist
```

Expected: `dist/index.html` exists and build reports 1 page. If Astro prompts about telemetry, run `npx astro telemetry disable` and rebuild.

- [ ] **Step 8: Write README.md**

```markdown
# Cypress Command Articles

The article hub at https://articles.cypresscommand.com. Astro, static output.

- `npm run dev` — local dev server
- `npm run build` — brand + content checks, build, link + redirect checks
- `npm test` — unit tests for helpers and scripts

Content: `src/content/articles/<collection>/*.md`, manifests in `src/content/series/`.
Design system: `design-system/` is Brand Standards 2.0, copied verbatim. Do not edit.
Spec: `docs/superpowers/specs/2026-09-22-article-hub-design.md`.
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -q -m "Scaffold Astro 7 with the v2.0 design system and remark plugins

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Content collections, manifests, and article migration

**Files:**
- Create: `src/content.config.ts`, `src/content/series/{shopping-center,field-notes,operating-systems,owners-contracts,small-portfolio,governed-ai}.json`
- Copy: `archive/legacy-static/articles/*.md` → `src/content/articles/shopping-center/`
- Copy: `archive/legacy-static/assets/img/*.jpg` → `public/img/`
- Modify: 7 article front matters (feature_image path), 40 front matters (desk), articles 34 and 35 (naming), `../00-table-of-contents.md`, `../ARTICLE-BRIEF.md`

**Interfaces:**
- Produces: collections `articles` (id `<collection>/<slug>`) and `series` (id `<slug>`); schema types `ArticleData`, `SeriesData` exported from `src/content.config.ts`.

- [ ] **Step 1: Write the content config**

`src/content.config.ts`:

```ts
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
```

- [ ] **Step 2: Write the six manifests**

`src/content/series/shopping-center.json`:

```json
{
  "slug": "shopping-center",
  "title": "The Shopping Center Operator Series",
  "shortTitle": "Shopping Center",
  "deck": "Owning, acquiring, financing, leasing, operating, and selling retail shopping centers, from the operator's desk at On The Blvd in Lafayette, Louisiana.",
  "kind": "series",
  "state": "published",
  "order": 1,
  "hasMap": true,
  "parts": [
    { "num": 1, "roman": "I", "name": "Owning" },
    { "num": 2, "roman": "II", "name": "Acquiring" },
    { "num": 3, "roman": "III", "name": "Financing" },
    { "num": 4, "roman": "IV", "name": "Leasing" },
    { "num": 5, "roman": "V", "name": "Operating" },
    { "num": 6, "roman": "VI", "name": "Financial Management" },
    { "num": 7, "roman": "VII", "name": "Marketing & Tenant Success" },
    { "num": 8, "roman": "VIII", "name": "Selling" },
    { "num": 9, "roman": "IX", "name": "Field Notes from On The Blvd" },
    { "num": 10, "roman": "X", "name": "AI & Operating Systems" },
    { "num": 11, "roman": "XI", "name": "Tools & Checklists" }
  ],
  "heroImage": "/img/hero.jpg",
  "heroCaption": "A neighborhood center at golden hour. The work this series describes happens here, every week."
}
```

`src/content/series/field-notes.json`:

```json
{
  "slug": "field-notes",
  "title": "Field Notes",
  "shortTitle": "Field Notes",
  "deck": "Short, specific notes from the operator's desk. One observation, one lesson, no series required.",
  "kind": "lane",
  "state": "published",
  "order": 2
}
```

`src/content/series/operating-systems.json`:

```json
{
  "slug": "operating-systems",
  "title": "The Operating Systems Series",
  "shortTitle": "Operating Systems",
  "deck": "How real businesses map recurring work, decide where AI helps, keep people accountable, and keep a workflow useful after the pilot ends.",
  "kind": "series",
  "state": "coming-soon",
  "order": 3,
  "plannedTitles": [
    "Before You Choose an AI Tool, Map the Work",
    "Five Signs a Workflow Has an Operating Problem, Not a People Problem",
    "Where Human Review Belongs in an AI-Enabled Workflow",
    "The Missing Role in Most Automation Projects: The Process Owner",
    "How to Measure an AI Workflow Without Inventing a Dashboard",
    "When a Team Is Chasing Updates, the System Is Telling You Something",
    "The Smallest Useful AI System Is Often the Best Place to Start",
    "Why a Good Workflow Fails When the Operating Routine Is Unclear",
    "Design for the Work That Does Not Go According to Plan",
    "From Pilot to Practice: What It Takes to Keep an AI Workflow Useful"
  ]
}
```

`src/content/series/owners-contracts.json`:

```json
{
  "slug": "owners-contracts",
  "title": "The Owner's Contracts Series",
  "shortTitle": "Owner's Contracts",
  "deck": "Leases, vendor agreements, insurance policies, and service contracts: what to read, what to track, and how to organize the paper so the business can act on it. Context, not counsel.",
  "kind": "series",
  "state": "coming-soon",
  "order": 4
}
```

`src/content/series/small-portfolio.json`:

```json
{
  "slug": "small-portfolio",
  "title": "The Small Portfolio Series",
  "shortTitle": "Small Portfolio",
  "deck": "Visibility, reporting, and decision preparation for owners running a handful of properties or locations, where one spreadsheet no longer covers it.",
  "kind": "series",
  "state": "coming-soon",
  "order": 5
}
```

`src/content/series/governed-ai.json`:

```json
{
  "slug": "governed-ai",
  "title": "The Governed AI Series",
  "shortTitle": "Governed AI",
  "deck": "The practical side of governance when AI touches real decisions: what the model prepares, what the owner signs, and where the boundary is written down.",
  "kind": "series",
  "state": "coming-soon",
  "order": 6,
  "plannedTitles": [
    "AI in CRE Underwriting: What the Model Prepares and What the Owner Signs"
  ]
}
```

- [ ] **Step 3: Copy articles and images**

```bash
mkdir -p src/content/articles/shopping-center src/content/articles/field-notes public/img
cp archive/legacy-static/articles/*.md src/content/articles/shopping-center/
cp archive/legacy-static/assets/img/*.jpg public/img/
sed -i 's#^feature_image: "assets/img/#feature_image: "/img/#' src/content/articles/shopping-center/*.md
grep -h "^feature_image" src/content/articles/shopping-center/*.md
```

Expected: seven lines, each starting `feature_image: "/img/`.

- [ ] **Step 4: Assign desks to all 40 articles**

Run this script once; it inserts `desk:` after the `read_time:` line.

```bash
cat > /tmp/desks.txt <<'EOF'
01 own
02 own
03 own
04 own
05 buy
06 buy
07 buy
08 buy
09 finance
10 finance
11 finance
12 finance
13 lease
14 lease
15 lease
16 lease
17 lease
18 run
19 run
20 run
21 run
22 run
23 finance
24 finance
25 finance
26 run
27 lease
28 sell
29 sell
30 sell
31 run
32 run
33 run
34 run
35 run
36 run
37 own
38 run
39 lease
40 own
EOF
while read n d; do
  f=$(ls src/content/articles/shopping-center/$n-*.md)
  sed -i "/^read_time:/a desk: \"$d\"" "$f"
done < /tmp/desks.txt
grep -c '^desk:' src/content/articles/shopping-center/*.md | grep -v ':1$' || echo "all 40 have one desk"
```

Expected: `all 40 have one desk`.

- [ ] **Step 5: Surface article 31 in the Field Notes lane**

```bash
sed -i '/^desk:/a lanes: ["field-notes"]' src/content/articles/shopping-center/31-field-notes-on-the-blvd.md
sed -n '1,12p' src/content/articles/shopping-center/31-field-notes-on-the-blvd.md
```

Expected: front matter now contains `lanes: ["field-notes"]`.

- [ ] **Step 6: Apply the Command Platform naming**

In `src/content/articles/shopping-center/34-otb-command.md` and `35-why-otb-command-is-becoming-cypress-command.md`, and in the series sources `../00-table-of-contents.md` and `../ARTICLE-BRIEF.md`:

```bash
for f in src/content/articles/shopping-center/34-otb-command.md \
         src/content/articles/shopping-center/35-why-otb-command-is-becoming-cypress-command.md \
         ../00-table-of-contents.md ../ARTICLE-BRIEF.md; do
  sed -i 's/the Cypress Command Platform/Command Platform/g; s/Cypress Command Platform/Command Platform/g' "$f"
done
grep -rn "Cypress Command Platform" src ../00-table-of-contents.md ../ARTICLE-BRIEF.md || echo "none left"
```

Then edit by hand, in article 35:

- The bullet beginning `- **The product name** is Command Platform — always the full three-word name` becomes:
  `- **The product name** is Command Platform. "Cypress Command" is reserved for the company; the software carries the functional name beneath it, the way Command Installation names the service.`
- Append to the paragraph beginning `The rename landed in two steps.` this sentence: `On the same day, Brand Standards 2.0 shortened the software's public name to Command Platform, so that "Cypress Command" names only the company.`

In `../ARTICLE-BRIEF.md`, the product-name bullet becomes:
`- The software that runs the center is **Command Platform** (never "Cypress Command Platform"; "Cypress Command" is the company). On The Blvd is its flagship deployment at otb.cypresscommand.com.`

Check: `grep -n "Command Platform" src/content/articles/shopping-center/35-*.md | head` shows the new bullet and sentence.

- [ ] **Step 7: Verify the collections load**

Replace `src/pages/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
const articles = await getCollection('articles');
const series = await getCollection('series');
---
<html lang="en"><head><meta charset="utf-8"><title>Cypress Command</title></head>
<body><p>{articles.length} articles, {series.length} collections</p>
<ul>{articles.slice(0, 3).map((a) => <li>{a.id} — {a.data.desk}</li>)}</ul></body></html>
```

```bash
npm run build && grep -o "[0-9]* articles, [0-9]* collections" dist/index.html
```

Expected: `40 articles, 6 collections`.

- [ ] **Step 8: Commit**

```bash
git add -A
git -C .. add 00-table-of-contents.md ARTICLE-BRIEF.md 2>/dev/null || true
git commit -q -m "Content collections: 40 articles with desks, six manifests, Command Platform naming

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Note: `00-table-of-contents.md` and `ARTICLE-BRIEF.md` live in the parent folder, which is not this git repo. They are edited on disk only.

---

### Task 3: Pure article helpers (tested)

**Files:**
- Create: `src/lib/articles.ts`, `src/lib/articles.test.ts`

**Interfaces:**
- Produces:
  - `splitId(id: string): { collection: string; slug: string }`
  - `numberOf(slug: string): number` (0 when the slug has no leading number)
  - `partName(part: string | undefined): string` ("Leasing" from "Part IV — Leasing")
  - `articleUrl(collection: string, slug: string): string` → `/${collection}/${slug}/`
  - `sortForCollection<T extends { slug: string; date: string }>(items: T[], kind: 'series' | 'lane'): T[]` (series by number asc, lane by date desc then slug)
  - `pad2(n: number): string`

- [ ] **Step 1: Write the failing tests**

`src/lib/articles.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitId, numberOf, partName, articleUrl, sortForCollection, pad2 } from './articles.ts';

test('splitId separates collection and slug', () => {
  assert.deepEqual(splitId('shopping-center/07-reading-a-rent-roll'), {
    collection: 'shopping-center', slug: '07-reading-a-rent-roll',
  });
});

test('numberOf reads the leading number or returns 0', () => {
  assert.equal(numberOf('07-reading-a-rent-roll'), 7);
  assert.equal(numberOf('parking-is-the-real-gla'), 0);
});

test('partName takes the text after the em dash', () => {
  assert.equal(partName('Part IV — Leasing'), 'Leasing');
  assert.equal(partName(undefined), '');
});

test('articleUrl builds a trailing-slash path', () => {
  assert.equal(articleUrl('field-notes', 'plat-versus-street'), '/field-notes/plat-versus-street/');
});

test('sortForCollection orders series by number and lanes by date desc', () => {
  const s = [{ slug: '10-a', date: '2026-01-01' }, { slug: '02-b', date: '2026-01-01' }];
  assert.deepEqual(sortForCollection(s, 'series').map((x) => x.slug), ['02-b', '10-a']);
  const l = [{ slug: 'a', date: '2026-09-01' }, { slug: 'b', date: '2026-09-22' }, { slug: 'c', date: '2026-09-22' }];
  assert.deepEqual(sortForCollection(l, 'lane').map((x) => x.slug), ['b', 'c', 'a']);
});

test('pad2 zero-pads', () => {
  assert.equal(pad2(7), '07');
  assert.equal(pad2(40), '40');
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test src/lib/articles.test.ts`
Expected: FAIL, cannot find module `./articles.ts`.

- [ ] **Step 3: Implement**

`src/lib/articles.ts`:

```ts
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
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test src/lib/articles.test.ts`
Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/articles.ts src/lib/articles.test.ts
git commit -q -m "Pure article helpers with tests

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Astro-side collection queries

**Files:**
- Create: `src/lib/collections.ts`

**Interfaces:**
- Consumes: Task 3 helpers; `astro:content`.
- Produces:
  - `type Article = { id; collection; slug; url; num; data: ArticleData; entry: CollectionEntry<'articles'> }`
  - `getSeriesList(): Promise<CollectionEntry<'series'>[]>` sorted by `order`
  - `getSeries(slug): Promise<CollectionEntry<'series'> | undefined>`
  - `getPublishedArticles(): Promise<Article[]>` (status published)
  - `getArticlesIn(collectionSlug): Promise<Article[]>` sorted per kind, including articles whose `lanes` include the slug
  - `getArticlesByDesk(desk): Promise<Article[]>`
  - `getInteractive(): Promise<Article[]>` (body contains `class="ix"`)

- [ ] **Step 1: Implement**

```ts
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
  return entries.map(toArticle);
}

export async function getArticlesIn(collectionSlug: string): Promise<Article[]> {
  const series = await getSeries(collectionSlug);
  const kind = series?.data.kind ?? 'series';
  const all = await getPublishedArticles();
  const mine = all.filter((a) => a.collection === collectionSlug || a.data.lanes.includes(collectionSlug));
  const sorted = sortForCollection(mine.map((a) => ({ ...a, date: a.data.date })), kind);
  return sorted;
}

export async function getArticlesByDesk(desk: string): Promise<Article[]> {
  const all = await getPublishedArticles();
  return all.filter((a) => a.data.desk === desk);
}

export async function getInteractive(): Promise<Article[]> {
  return (await getPublishedArticles()).filter((a) => a.interactive);
}
```

- [ ] **Step 2: Smoke it through the placeholder page**

Replace `src/pages/index.astro` body with:

```astro
---
import { getSeriesList, getArticlesIn, getInteractive } from '../lib/collections';
const series = await getSeriesList();
const sc = await getArticlesIn('shopping-center');
const fn = await getArticlesIn('field-notes');
const ix = await getInteractive();
---
<html lang="en"><head><meta charset="utf-8"><title>Cypress Command</title></head>
<body><p>{series.map((s) => s.data.slug).join(',')}</p>
<p>sc={sc.length} fn={fn.length} ix={ix.length} first={sc[0]?.slug} url={sc[0]?.url}</p></body></html>
```

Run: `npm run build && grep -o "sc=[^<]*" dist/index.html`
Expected: `sc=40 fn=1 ix=5 first=01-what-it-means-to-own-a-shopping-center url=/shopping-center/01-what-it-means-to-own-a-shopping-center/`

- [ ] **Step 3: Commit**

```bash
git add src/lib/collections.ts src/pages/index.astro
git commit -q -m "Collection queries: series list, per-collection articles, desks, interactive

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Brand check script (tested) and base styles

**Files:**
- Create: `scripts/check-brand.mjs`, `scripts/check-brand.test.mjs`, `src/styles/site.css`

**Interfaces:**
- Produces: `checkBrand(files: {path, text}[]): string[]` (violations, empty when clean); CLI exits 1 on violations. CSS classes used by later tasks: `.wrap`, `.masthead`, `.site-footer`, `.page-head`, `.eyebrow`, `.deck`, `.meta`, `.rows`, `.row`, `.cards`, `.stack`.

- [ ] **Step 1: Write the failing test**

`scripts/check-brand.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBrand } from './check-brand.mjs';

test('flags raw hex, font faces, and shadows; allows tokens', () => {
  const v = checkBrand([
    { path: 'a.css', text: 'color: #A44E12; font-family: "Besley"; box-shadow: 0 1px 2px var(--x);' },
    { path: 'b.css', text: 'color: var(--cc-terra); font-family: var(--cc-font-display); box-shadow: none;' },
  ]);
  assert.equal(v.length, 3);
  assert.ok(v.every((s) => s.startsWith('a.css')));
});

test('ignores hex inside svg files and in comments about tokens', () => {
  const v = checkBrand([{ path: 'logo.svg', text: '<path fill="#1E1B16"/>' }]);
  assert.equal(v.length, 0);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test scripts/check-brand.test.mjs`
Expected: FAIL, `checkBrand` is not exported.

- [ ] **Step 3: Implement**

`scripts/check-brand.mjs`:

```js
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FACE = /font-family\s*:\s*["']?(Besley|Archivo|Courier|Inter|Libertinus|Georgia|Fraunces|system-ui|serif|sans-serif|monospace)/g;
const SHADOW = /box-shadow\s*:\s*(?!none\b)[^;]+/g;

export function checkBrand(files) {
  const out = [];
  for (const { path, text } of files) {
    if (path.endsWith('.svg') || path.endsWith('.json')) continue;
    for (const [re, label] of [[HEX, 'raw hex color'], [FACE, 'font face named outside tokens'], [SHADOW, 'box-shadow']]) {
      for (const m of text.matchAll(re)) {
        const line = text.slice(0, m.index).split('\n').length;
        out.push(`${path}:${line} ${label}: ${m[0]}`);
      }
    }
  }
  return out;
}

export function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(astro|css|ts|js|mjs)$/.test(name) && !name.endsWith('.test.ts') && !name.endsWith('.test.mjs')) acc.push({ path: p, text: readFileSync(p, 'utf8') });
  }
  return acc;
}

if (process.argv[1] && process.argv[1].endsWith('check-brand.mjs')) {
  const violations = checkBrand(walk('src'));
  if (violations.length) { console.error('Brand check failed:\n' + violations.join('\n')); process.exit(1); }
  console.log('Brand check: clean');
}
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test scripts/check-brand.test.mjs`
Expected: 2 passing.

- [ ] **Step 5: Write the base site stylesheet**

`src/styles/site.css` (page-level rules; every color and face is a token):

```css
/* Cypress Command Articles — page rules. Tokens and components come from /design-system. */

*, *::before, *::after { box-sizing: border-box; }
img, svg { max-width: 100%; height: auto; display: block; }
button { font: inherit; color: inherit; }

.wrap { max-width: var(--cc-max-width); margin: 0 auto; padding: 0 var(--cc-space-4); }
@media (min-width: 768px) { .wrap { padding: 0 var(--cc-gutter); } }

.skip-link { position: absolute; left: -9999px; top: 0; background: var(--cc-accent); color: var(--cc-accent-fg); padding: var(--cc-space-3) var(--cc-space-4); z-index: 100; font-weight: 700; }
.skip-link:focus { left: 0; }

/* Type roles */
.display { font-family: var(--cc-font-display); font-weight: 900; font-size: var(--cc-text-display); line-height: var(--cc-lh-display); letter-spacing: var(--cc-track-display); margin: 0; }
h1, .h1 { font-family: var(--cc-font-display); font-weight: 900; font-size: var(--cc-text-h1); line-height: var(--cc-lh-h1); letter-spacing: var(--cc-track-display); margin: 0; }
h2, .h2 { font-family: var(--cc-font-display); font-weight: 700; font-size: var(--cc-text-h2); line-height: var(--cc-lh-h2); letter-spacing: -0.01em; margin: 0; }
h3, .h3 { font-family: var(--cc-font-sans); font-weight: 700; font-size: var(--cc-text-h3); line-height: var(--cc-lh-h3); margin: 0; }
h4, .h4 { font-family: var(--cc-font-sans); font-weight: 700; font-size: var(--cc-text-body); line-height: var(--cc-lh-body); margin: 0; }
.eyebrow { font-family: var(--cc-font-sans); font-weight: 700; font-size: var(--cc-text-label); line-height: var(--cc-lh-label); letter-spacing: var(--cc-track-label); text-transform: uppercase; color: var(--cc-accent); display: inline-block; }
.deck { font-family: var(--cc-font-display); font-weight: 400; font-size: 20px; line-height: 30px; color: var(--cc-fg); max-width: 40em; margin: 0; }
.meta { font-family: var(--cc-font-mono); font-size: 12px; line-height: 17px; color: var(--cc-fg-muted); }
.muted { color: var(--cc-fg-muted); }
@media (max-width: 767px) {
  .display { font-size: 40px; line-height: 44px; }
  h1, .h1 { font-size: 32px; line-height: 36px; }
  h2, .h2 { font-size: 24px; line-height: 30px; }
  .deck { font-size: 18px; line-height: 27px; }
}

/* Masthead */
.masthead { border-bottom: var(--cc-hairline) solid var(--cc-border); background: var(--cc-bg); position: sticky; top: 0; z-index: 20; }
.masthead-inner { display: flex; align-items: center; justify-content: space-between; gap: var(--cc-space-6); min-height: 64px; }
.brand { display: flex; flex-direction: column; gap: 2px; color: var(--cc-fg); text-decoration: none; }
.brand:hover { text-decoration: none; }
.brand svg { height: 28px; width: auto; }
.brand-descriptor { font-family: var(--cc-font-mono); font-size: 11px; line-height: 14px; color: var(--cc-fg-muted); letter-spacing: 0.02em; }
.masthead nav { display: flex; align-items: center; gap: var(--cc-space-6); }
.nav-link { font-family: var(--cc-font-sans); font-weight: 500; font-size: 14px; color: var(--cc-fg); text-decoration: none; }
.nav-link:hover { color: var(--cc-accent); text-decoration: none; }
.nav-link[aria-current="page"] { color: var(--cc-accent); font-weight: 700; }
@media (max-width: 767px) { .brand-descriptor, .masthead nav .nav-link { display: none; } }
.theme-toggle { width: 40px; height: 40px; display: inline-grid; place-items: center; border: var(--cc-hairline) solid var(--cc-border); border-radius: var(--cc-radius-ui); background: var(--cc-bg); cursor: pointer; }
.theme-toggle svg { width: 18px; height: 18px; }
:root[data-theme="night"] .theme-toggle .icon-moon, :root:not([data-theme="night"]) .theme-toggle .icon-sun { display: none; }

/* Page head */
.page-head { padding: var(--cc-space-12) 0 var(--cc-space-8); border-bottom: var(--cc-hairline) solid var(--cc-border); }
.page-head h1 { margin: var(--cc-space-3) 0 var(--cc-space-4); max-width: 22em; }
.crumb { display: flex; gap: var(--cc-space-2); font-family: var(--cc-font-mono); font-size: 12px; color: var(--cc-fg-muted); margin-bottom: var(--cc-space-6); }
.crumb a { color: var(--cc-fg-muted); }

/* Sections */
.section { padding: var(--cc-space-12) 0; }
.section + .section { border-top: var(--cc-hairline) solid var(--cc-border); }
.section-head { display: flex; align-items: baseline; gap: var(--cc-space-3); padding: var(--cc-space-3) 0; border-top: 2px solid var(--cc-fg); border-bottom: var(--cc-hairline) solid var(--cc-border); margin-bottom: var(--cc-space-6); }
.section-head .num { font-family: var(--cc-font-sans); font-weight: 800; font-size: 13px; }
.section-head .title { font-family: var(--cc-font-sans); font-weight: 700; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; }
.section-head .kicker { margin-left: auto; font-family: var(--cc-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--cc-fg-muted); }

/* Rows and cards */
.rows { display: flex; flex-direction: column; }
.row { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; gap: var(--cc-space-4); padding: var(--cc-space-4) 0; border-top: var(--cc-hairline) solid var(--cc-border); color: var(--cc-fg); text-decoration: none; align-items: start; }
.row:hover { text-decoration: none; background: var(--cc-wash-ink); }
.row-num { font-family: var(--cc-font-display); font-weight: 900; font-size: 22px; line-height: 26px; letter-spacing: -0.03em; }
.row-title { font-family: var(--cc-font-display); font-weight: 700; font-size: 19px; line-height: 25px; display: block; }
.row:hover .row-title { color: var(--cc-accent); }
.row-deck { display: block; font-size: 14px; line-height: 21px; color: var(--cc-fg-muted); margin-top: 4px; }
.row-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
@media (max-width: 600px) { .row { grid-template-columns: 40px minmax(0, 1fr); } .row-meta { grid-column: 2; flex-direction: row; align-items: center; } }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--cc-space-6); }
.stack { display: flex; flex-direction: column; gap: var(--cc-space-4); }
.tag-row { display: flex; flex-wrap: wrap; gap: var(--cc-space-2); }

/* Buttons (site aliases of cc-btn for markup brevity) */
.btn { display: inline-flex; align-items: center; gap: 8px; font-family: var(--cc-font-sans); font-weight: 700; font-size: 14px; line-height: 20px; padding: 10px 18px; border-radius: var(--cc-radius-ui); border: 1px solid transparent; cursor: pointer; text-decoration: none; }
.btn-primary { background: var(--cc-fg); color: var(--cc-bg); border-color: var(--cc-fg); }
.btn-secondary { background: var(--cc-bg); color: var(--cc-fg); border-color: var(--cc-fg); }
.btn-small { padding: 6px 12px; font-size: 12px; }
.btn:hover { text-decoration: none; }
.btn-primary:hover { background: var(--cc-ink-soft); border-color: var(--cc-ink-soft); }
.btn-secondary:hover { background: var(--cc-bg-elev); }

/* Search */
.search { position: relative; margin: var(--cc-space-6) 0; }
.search input { width: 100%; font-family: var(--cc-font-sans); font-size: 15px; line-height: 20px; padding: 11px 14px 11px 40px; border: var(--cc-hairline) solid var(--cc-border); border-radius: var(--cc-radius-ui); background: var(--cc-bg); color: var(--cc-fg); }
.search svg { position: absolute; left: 14px; top: 50%; width: 16px; height: 16px; transform: translateY(-50%); color: var(--cc-fg-muted); }
.search-results { border: var(--cc-hairline) solid var(--cc-border); border-top: 0; display: none; }
.search-results.open { display: block; }
.search-results a { display: block; padding: var(--cc-space-3) var(--cc-space-4); border-top: var(--cc-hairline) solid var(--cc-border); color: var(--cc-fg); text-decoration: none; }
.search-results a:hover { background: var(--cc-wash-ink); text-decoration: none; }
.search-results .sr-title { font-family: var(--cc-font-display); font-weight: 700; }
.search-results .sr-meta { font-family: var(--cc-font-mono); font-size: 11px; color: var(--cc-fg-muted); margin-top: 2px; }
.search-empty { padding: var(--cc-space-4); color: var(--cc-fg-muted); font-size: 14px; }

/* Footer */
.site-footer { border-top: var(--cc-hairline) solid var(--cc-border); padding: var(--cc-space-8) 0; margin-top: var(--cc-space-16); }
.footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--cc-space-4); font-size: 13px; color: var(--cc-fg-muted); }
.footer-signoff { font-family: var(--cc-font-display); font-style: italic; color: var(--cc-fg); }
.hidden { display: none !important; }
```

- [ ] **Step 6: Run the brand check on the stylesheet**

Run: `node scripts/check-brand.mjs`
Expected: `Brand check: clean`.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-brand.mjs scripts/check-brand.test.mjs src/styles/site.css
git commit -q -m "Brand check script with tests; base site stylesheet on v2 tokens

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Base layout, masthead, theme toggle, footer

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Masthead.astro`, `src/components/ThemeToggle.astro`, `src/components/Footer.astro`, `src/components/Seo.astro`, `public/favicon.svg`
- Modify: `src/pages/index.astro` (use the layout)

**Interfaces:**
- Produces: `<Base title description canonical? ogImage? jsonLd? bodyClass?>` with a default slot; `<Seo>` props `{ title, description, canonical, ogImage, type: 'website'|'article', jsonLd?: object[] }`.

- [ ] **Step 1: Favicon**

```bash
cp design-system/logo/favicon.svg public/favicon.svg
```

- [ ] **Step 2: Seo component**

`src/components/Seo.astro`:

```astro
---
interface Props { title: string; description: string; canonical: string; ogImage?: string; type?: 'website' | 'article'; jsonLd?: object[] }
const { title, description, canonical, ogImage = '/img/hero.jpg', type = 'website', jsonLd = [] } = Astro.props;
const site = 'https://articles.cypresscommand.com';
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={site + canonical} />
<meta property="og:site_name" content="Cypress Command" />
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={site + canonical} />
<meta property="og:image" content={site + ogImage} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={site + ogImage} />
{jsonLd.map((obj) => <script type="application/ld+json" set:html={JSON.stringify(obj)} />)}
```

- [ ] **Step 3: ThemeToggle**

`src/components/ThemeToggle.astro`:

```astro
<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Switch to night mode">
  <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5Z"/></svg>
  <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>
</button>
<script>
  const btn = document.getElementById('theme-toggle');
  function apply(t: string) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('cc-theme', t); } catch {}
    btn?.setAttribute('aria-label', t === 'night' ? 'Switch to day mode' : 'Switch to night mode');
  }
  apply(document.documentElement.getAttribute('data-theme') || 'day');
  btn?.addEventListener('click', () => {
    apply(document.documentElement.getAttribute('data-theme') === 'night' ? 'day' : 'night');
  });
</script>
```

- [ ] **Step 4: Masthead**

`src/components/Masthead.astro` (the lockup is inlined so it uses the page's Archivo and `currentColor`):

```astro
---
import Lockup from '../../design-system/logo/cc-lockup-h-current.svg';
import ThemeToggle from './ThemeToggle.astro';
const path = Astro.url.pathname;
const links = [
  { href: '/', label: 'Collections', match: (p: string) => p === '/' },
  { href: '/field-notes/', label: 'Field Notes', match: (p: string) => p.startsWith('/field-notes/') },
  { href: '/desk/own/', label: 'Desks', match: (p: string) => p.startsWith('/desk/') },
  { href: '/about/', label: 'About', match: (p: string) => p.startsWith('/about/') },
];
---
<header class="masthead">
  <div class="wrap masthead-inner">
    <a class="brand" href="/" aria-label="Cypress Command — Articles">
      <Lockup aria-hidden="true" />
      <span class="brand-descriptor">Practical intelligence for real operations.</span>
    </a>
    <nav aria-label="Primary">
      {links.map((l) => <a class="nav-link" href={l.href} aria-current={l.match(path) ? 'page' : undefined}>{l.label}</a>)}
      <ThemeToggle />
    </nav>
  </div>
</header>
```

- [ ] **Step 5: Footer**

`src/components/Footer.astro`:

```astro
<footer class="site-footer">
  <div class="wrap footer-inner">
    <span>© {new Date().getFullYear()} Cypress Command. All rights reserved.</span>
    <span class="footer-signoff">Systems under control. Results that last.</span>
    <span><a href="/about/">About the publisher</a></span>
  </div>
</footer>
```

- [ ] **Step 6: Base layout**

`src/layouts/Base.astro`:

```astro
---
import '@fontsource/besley/400-italic.css';
import '@fontsource/besley/700.css';
import '@fontsource/besley/900.css';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/800.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '../../design-system/tokens.css';
import '../../design-system/components.css';
import '../styles/site.css';
import Seo from '../components/Seo.astro';
import Masthead from '../components/Masthead.astro';
import Footer from '../components/Footer.astro';

interface Props { title: string; description: string; canonical?: string; ogImage?: string; type?: 'website' | 'article'; jsonLd?: object[]; bodyClass?: string }
const { title, description, canonical = Astro.url.pathname, ogImage, type, jsonLd, bodyClass = '' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en" data-theme="day">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script is:inline>
    (function () {
      try {
        var t = localStorage.getItem('cc-theme');
        if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <Seo title={title} description={description} canonical={canonical} ogImage={ogImage} type={type} jsonLd={jsonLd} />
</head>
<body class={bodyClass}>
  <a class="skip-link" href="#main">Skip to content</a>
  <Masthead />
  <main id="main"><slot /></main>
  <Footer />
</body>
</html>
```

- [ ] **Step 7: Use it on the placeholder hub**

`src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import { getSeriesList } from '../lib/collections';
const series = await getSeriesList();
---
<Base title="Cypress Command — Articles" description="Operator-grade writing on the work that runs real businesses.">
  <div class="wrap"><h1>Hub scaffold</h1><p>{series.length} collections</p></div>
</Base>
```

- [ ] **Step 8: Build, then view in the browser**

Run: `npm run build && npm run preview` (port 4321). Open http://localhost:4321/ in the built-in browser. Check: lockup renders in Archivo with the wordmark visible, descriptor below it, four nav links, toggle flips day/night and persists on reload. Run `node scripts/check-brand.mjs` → clean.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -q -m "Base layout: self-hosted fonts, tokens, masthead with inline lockup, theme toggle, footer, SEO head

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Article page

**Files:**
- Create: `src/pages/[collection]/[slug].astro`, `src/components/ArticleHead.astro`, `src/components/ContentsRail.astro`, `src/components/Pager.astro`, `src/components/Plate.astro`, `src/components/DeskChip.astro`, `src/components/PublisherNote.astro`
- Modify: `src/styles/site.css` (append article rules)

**Interfaces:**
- Consumes: `getArticlesIn`, `getSeries`, `Article` from Task 4; `render` from `astro:content`.
- Produces: routes `/<collection>/<slug>/` for every published article; `<Plate src alt label caption>`; `<DeskChip desk>`.

- [ ] **Step 1: Components**

`src/components/DeskChip.astro`:

```astro
---
const LABELS: Record<string, string> = { own: 'Own', run: 'Run', lease: 'Lease', finance: 'Finance', buy: 'Buy', sell: 'Sell' };
interface Props { desk?: string }
const { desk } = Astro.props;
---
{desk && <a class="cc-tag cc-tag-neutral" href={`/desk/${desk}/`}>{LABELS[desk]}</a>}
```

`src/components/Plate.astro`:

```astro
---
interface Props { src: string; alt: string; label: string; caption?: string }
const { src, alt, label, caption } = Astro.props;
---
<figure class="plate">
  <span class="plate-label">{label}</span>
  <img src={src} alt={alt} loading="lazy" />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

`src/components/ArticleHead.astro`:

```astro
---
import DeskChip from './DeskChip.astro';
import Plate from './Plate.astro';
import { partName, pad2 } from '../lib/articles';
import type { Article } from '../lib/collections';
interface Props { article: Article; collectionTitle: string; collectionUrl: string; total: number }
const { article, collectionTitle, collectionUrl, total } = Astro.props;
const d = article.data;
const eyebrow = d.eyebrow || (article.collection === 'field-notes' ? 'FIELD NOTE' : '');
---
<header class="page-head">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href={collectionUrl}>{collectionTitle}</a>
      {d.part && <><span aria-hidden="true">·</span><span>{d.part}</span></>}
    </nav>
    {eyebrow && <span class="eyebrow">{eyebrow}</span>}
    <h1>{d.title}</h1>
    <p class="deck">{d.deck}</p>
    <div class="article-meta">
      <span class="meta">By {d.author}</span>
      <span class="meta">{d.date}</span>
      <span class="meta">{d.read_time} read</span>
      {article.num > 0 && <span class="meta">Article {pad2(article.num)} of {total}</span>}
      <DeskChip desk={d.desk} />
    </div>
    {d.feature_image && <Plate src={d.feature_image} alt={d.title} label={`PLATE ${pad2(article.num)} · ${partName(d.part) || 'FIELD NOTE'}`} caption={d.feature_caption} />}
  </div>
</header>
```

`src/components/ContentsRail.astro`:

```astro
---
interface Props { headings: { depth: number; slug: string; text: string }[] }
const h2s = Astro.props.headings.filter((h) => h.depth === 2);
---
{h2s.length > 1 && (
  <aside class="rail" aria-label="Contents">
    <div class="rail-inner">
      <span class="cc-label">Contents</span>
      <div id="rail-list">{h2s.map((h) => <a href={`#${h.slug}`} data-target={h.slug}>{h.text}</a>)}</div>
    </div>
  </aside>
)}
<script>
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#rail-list a'));
  if (links.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.dataset.target === en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    links.forEach((a) => { const el = document.getElementById(a.dataset.target!); if (el) obs.observe(el); });
  }
</script>
```

`src/components/Pager.astro`:

```astro
---
import { pad2 } from '../lib/articles';
import type { Article } from '../lib/collections';
interface Props { prev?: Article; next?: Article }
const { prev, next } = Astro.props;
const label = (a: Article, w: string) => a.num > 0 ? `${w} — ${pad2(a.num)}` : w;
---
<nav class="pager" aria-label="Previous and next">
  {prev ? <a href={prev.url}><span class="pager-label">{label(prev, 'Previous')}</span><span class="pager-title">{prev.data.title}</span></a> : <span></span>}
  {next ? <a href={next.url}><span class="pager-label">{label(next, 'Next')}</span><span class="pager-title">{next.data.title}</span></a> : <span></span>}
</nav>
```

`src/components/PublisherNote.astro`:

```astro
---
import Mark from '../../design-system/logo/cc-mark.svg';
---
<div class="article-disclaimer">
  <strong>Cypress Command</strong> builds practical AI-enabled operating systems for owner-led businesses,
  including the owners and operators of commercial real estate. This article is educational. It is not
  legal, tax, or investment advice.
</div>
<div class="author-block">
  <Mark aria-hidden="true" />
  <div>
    <div class="h4">About the publisher</div>
    <p>Cypress Command is a Lafayette, Louisiana company that installs AI into how individuals and organizations actually operate. Its open AI Operating Standard defines what to build, and Command Installation builds it with you. On The Boulevard, a working shopping center, is the proof.</p>
  </div>
</div>
```

- [ ] **Step 2: The route**

`src/pages/[collection]/[slug].astro`:

```astro
---
import { render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import ArticleHead from '../../components/ArticleHead.astro';
import ContentsRail from '../../components/ContentsRail.astro';
import Pager from '../../components/Pager.astro';
import PublisherNote from '../../components/PublisherNote.astro';
import { getSeriesList, getArticlesIn } from '../../lib/collections';
import { partName } from '../../lib/articles';

export async function getStaticPaths() {
  const series = await getSeriesList();
  const paths = [];
  for (const s of series) {
    const list = await getArticlesIn(s.data.slug);
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (a.collection !== s.data.slug) continue; // lane-surfaced articles keep their home URL
      paths.push({ params: { collection: a.collection, slug: a.slug }, props: { article: a, series: s, prev: list[i - 1], next: list[i + 1], total: list.length } });
    }
  }
  return paths;
}

const { article, series, prev, next, total } = Astro.props;
const { Content, headings } = await render(article.entry);
const d = article.data;
const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'Article', headline: d.title, description: d.deck, datePublished: d.date,
    author: { '@type': 'Organization', name: 'Cypress Command' }, publisher: { '@type': 'Organization', name: 'Cypress Command' },
    mainEntityOfPage: 'https://articles.cypresscommand.com' + article.url, image: d.feature_image ? 'https://articles.cypresscommand.com' + d.feature_image : undefined },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Cypress Command Articles', item: 'https://articles.cypresscommand.com/' },
    { '@type': 'ListItem', position: 2, name: series.data.title, item: `https://articles.cypresscommand.com/${series.data.slug}/` },
    { '@type': 'ListItem', position: 3, name: d.title, item: 'https://articles.cypresscommand.com' + article.url } ] },
];
const related = (await getArticlesIn(series.data.slug)).filter((a) => a.slug !== article.slug && d.part && a.data.part === d.part).slice(0, 3);
---
<Base title={`${d.title} — ${series.data.title}`} description={d.deck} ogImage={d.feature_image} type="article" jsonLd={jsonLd} bodyClass="cc-doc">
  <div class="progress-track" aria-hidden="true"><div class="progress-bar" id="progress-bar"></div></div>
  <ArticleHead article={article} collectionTitle={series.data.title} collectionUrl={`/${series.data.slug}/`} total={total} />
  <div class="wrap article-layout">
    <article>
      <div class="prose" id="prose"><Content /></div>
      <PublisherNote />
    </article>
    <ContentsRail headings={headings} />
  </div>
  <div class="wrap"><Pager prev={prev} next={next} /></div>
  {related.length > 0 && (
    <section class="section"><div class="wrap">
      <div class="section-head"><span class="num">More</span><span class="title">In {partName(d.part)}</span></div>
      <div class="rows">{related.map((a) => <a class="row" href={a.url}><span class="row-num">{String(a.num).padStart(2, '0')}</span><span><span class="row-title">{a.data.title}</span><span class="row-deck">{a.data.deck}</span></span><span class="row-meta"><span class="meta">{a.data.read_time}</span></span></a>)}</div>
    </div></section>
  )}
  <script>
    const bar = document.getElementById('progress-bar');
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  </script>
</Base>
```

- [ ] **Step 3: Append article CSS to site.css**

```css
/* Article */
.progress-track { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 30; background: transparent; }
.progress-bar { height: 100%; width: 0; background: var(--cc-accent); }
.article-meta { display: flex; gap: var(--cc-space-6); flex-wrap: wrap; align-items: center; margin-top: var(--cc-space-6); padding-top: var(--cc-space-4); border-top: var(--cc-hairline) solid var(--cc-border); }
.plate { margin: var(--cc-space-8) 0 0; border: var(--cc-hairline) solid var(--cc-border); border-top: var(--cc-plate-rule) solid var(--cc-accent); border-radius: var(--cc-radius-doc); background: var(--cc-bg); padding: var(--cc-space-3); }
.plate-label { display: block; font-family: var(--cc-font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cc-accent); margin-bottom: var(--cc-space-3); }
.plate img { width: 100%; aspect-ratio: 21 / 9; object-fit: cover; }
.plate figcaption { margin-top: var(--cc-space-3); font-family: var(--cc-font-display); font-weight: 900; font-size: 13px; }
.article-layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: var(--cc-space-16); padding: var(--cc-space-12) 0 var(--cc-space-16); }
@media (max-width: 1023px) { .article-layout { grid-template-columns: 1fr; } .rail { display: none; } }
.prose { max-width: var(--cc-measure); font-family: var(--cc-font-display); font-size: var(--cc-text-body-doc); line-height: var(--cc-lh-body-doc); }
.prose > h2 { margin: var(--cc-space-12) 0 var(--cc-space-4); padding-top: var(--cc-space-6); border-top: 2px solid var(--cc-fg); }
.prose > :first-child { margin-top: 0; }
.prose > h2:first-child { border-top: 0; padding-top: 0; }
.prose h3 { margin: var(--cc-space-8) 0 var(--cc-space-3); }
.prose p { margin: 0 0 var(--cc-space-4); }
.prose ul, .prose ol { margin: 0 0 var(--cc-space-4) var(--cc-space-6); padding: 0; }
.prose li { margin-bottom: var(--cc-space-2); }
.prose li::marker { color: var(--cc-accent); }
.prose strong { font-weight: 700; }
.prose a { text-decoration: underline; text-underline-offset: 3px; }
.prose blockquote { font-style: italic; font-size: 22px; line-height: 30px; border-left: 3px solid var(--cc-accent); padding: 4px 0 4px var(--cc-space-4); margin: var(--cc-space-8) 0; }
.prose code { font-family: var(--cc-font-mono); font-size: 0.9em; background: var(--cc-bg-elev); padding: 1px 5px; }
.prose table { width: 100%; border-collapse: collapse; margin: var(--cc-space-6) 0; font-family: var(--cc-font-sans); font-size: 14px; line-height: 21px; }
.prose th { text-align: left; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--cc-fg-muted); border-bottom: 2px solid var(--cc-fg); padding: 8px 10px 8px 0; }
.prose td { border-bottom: var(--cc-hairline) solid var(--cc-border); padding: 10px 10px 10px 0; vertical-align: top; }
.prose td:first-child { font-weight: 500; }
.prose hr { border: 0; border-top: var(--cc-hairline) solid var(--cc-border); margin: var(--cc-space-8) 0; }
.rail-inner { position: sticky; top: 88px; border-left: var(--cc-hairline) solid var(--cc-border); padding-left: var(--cc-space-4); }
.rail a { display: block; font-family: var(--cc-font-sans); font-size: 13px; line-height: 18px; color: var(--cc-fg-muted); padding: 6px 0; border-bottom: var(--cc-hairline) solid var(--cc-border); text-decoration: none; }
.rail a:hover, .rail a.active { color: var(--cc-accent); }
.rail a.active { font-weight: 700; }
.pager { display: grid; grid-template-columns: 1fr 1fr; border-top: 2px solid var(--cc-fg); }
.pager a { text-decoration: none; padding: var(--cc-space-6) var(--cc-space-4); min-height: 44px; color: var(--cc-fg); }
.pager a + a { border-left: var(--cc-hairline) solid var(--cc-border); text-align: right; }
.pager-label { display: block; font-family: var(--cc-font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cc-fg-muted); margin-bottom: var(--cc-space-2); }
.pager-title { font-family: var(--cc-font-display); font-weight: 700; font-size: 18px; line-height: 24px; }
.pager a:hover .pager-title { color: var(--cc-accent); }
@media (max-width: 700px) { .pager { grid-template-columns: 1fr; } .pager a + a { border-left: 0; border-top: var(--cc-hairline) solid var(--cc-border); text-align: left; } }
.article-disclaimer { margin-top: var(--cc-space-12); padding: var(--cc-space-6); background: var(--cc-bg-elev); border-left: 3px solid var(--cc-accent); font-family: var(--cc-font-sans); font-size: 13px; line-height: 21px; color: var(--cc-fg-muted); }
.author-block { margin-top: var(--cc-space-6); display: flex; gap: var(--cc-space-4); align-items: flex-start; border: var(--cc-hairline) solid var(--cc-border); border-radius: var(--cc-radius-doc); padding: var(--cc-space-4); font-family: var(--cc-font-sans); }
.author-block svg { width: 48px; height: 48px; flex: none; color: var(--cc-accent); }
.author-block p { font-size: 13px; line-height: 21px; color: var(--cc-fg-muted); margin: 4px 0 0; }
```

- [ ] **Step 4: Build and inspect**

Run: `npm run build && ls dist/shopping-center | wc -l`
Expected: 40 directories (plus nothing else yet).

Run: `grep -c "<h1" dist/shopping-center/07-reading-a-rent-roll/index.html`
Expected: `1` (the body H1 was stripped).

Run: `grep -c "Cypress Command builds" dist/shopping-center/07-reading-a-rent-roll/index.html`
Expected: `1` (the in-file footer was stripped; only the template disclaimer remains).

Preview http://localhost:4321/shopping-center/07-reading-a-rent-roll/ in the browser: rail highlights on scroll, pager links to 06 and 08, related rows show other Acquiring articles, night mode reads correctly.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -q -m "Article page: head, prose, contents rail, pager, related, JSON-LD

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Interactive widgets

**Files:**
- Create: `src/data/widgets/checklists.json`, `ai-map.json`, `sheets.json`, `calendar.json`, `scripts/extract-widget-data.mjs`, `src/scripts/widgets/checklist.js`, `ai-map.js`, `sheets.js`, `calendar.js`, `src/components/Widgets.astro`
- Modify: `src/pages/[collection]/[slug].astro` (include `<Widgets />` when `article.interactive`), `src/styles/site.css` (append widget rules)

**Interfaces:**
- Consumes: `.ix[data-ix]` placeholders already in the Markdown.
- Produces: `hydrate(root: Element)` mounting each placeholder; storage keys unchanged.

- [ ] **Step 1: Extract the data from the legacy script**

`scripts/extract-widget-data.mjs`:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const src = readFileSync('archive/legacy-static/assets/js/app.js', 'utf8');
function block(name) {
  const start = src.indexOf(`const ${name} = `);
  const open = src.indexOf(src[src.indexOf('=', start) + 2] === '[' ? '[' : '{', start);
  let depth = 0, i = open;
  for (; i < src.length; i++) {
    if (src[i] === '[' || src[i] === '{') depth++;
    if (src[i] === ']' || src[i] === '}') depth--;
    if (depth === 0) break;
  }
  return new Function('return ' + src.slice(open, i + 1))();
}
mkdirSync('src/data/widgets', { recursive: true });
const checklists = block('CHECKLISTS');
for (const k of Object.keys(checklists)) delete checklists[k].accentCycle;
const aiMap = block('AI_MAP');
delete aiMap.helps.dot; delete aiMap.humans.dot;
writeFileSync('src/data/widgets/checklists.json', JSON.stringify(checklists, null, 2));
writeFileSync('src/data/widgets/ai-map.json', JSON.stringify(aiMap, null, 2));
writeFileSync('src/data/widgets/sheets.json', JSON.stringify(block('SHEETS'), null, 2));
writeFileSync('src/data/widgets/calendar.json', JSON.stringify(block('CALENDAR'), null, 2));
for (const k of Object.keys(checklists)) console.log(k, 'items:', checklists[k].sections.reduce((n, s) => n + s.items.length, 0));
console.log('extracted', Object.keys(checklists).join(','), block('SHEETS').length, 'sheets', block('CALENDAR').length, 'months');
```

Run: `node scripts/extract-widget-data.mjs`
Expected: two `items:` lines (pm-master and doc-safe, each between 25 and 45), then `extracted pm-master,doc-safe 18 sheets 12 months`. Write the pm-master total down; Step 6 uses it. The `accentCycle` and `dot` colors are dropped: sections are separated by hairlines, not color.

- [ ] **Step 2: Checklist widget**

`src/scripts/widgets/checklist.js`:

```js
export function renderChecklist(el, cfg, checklistId) {
  const storageKey = 'cc-checklist:' + checklistId;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }
  const total = cfg.sections.reduce((n, s) => n + s.items.length, 0);
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `
    <div class="ix-head">
      <span class="ix-title"><b>Interactive</b> — ${cfg.title}</span>
      <span class="ix-actions">
        <button class="btn btn-secondary btn-small" data-act="copy" type="button">Copy summary</button>
        <button class="btn btn-secondary btn-small" data-act="reset" type="button">Reset</button>
      </span>
    </div>
    <div class="ix-progress"><div class="ix-bar"><span></span></div>
      <div class="ix-progress-meta"><span class="ix-status-label">Not started</span><span class="ix-count"></span></div></div>
    <div class="ix-sections"></div>
    <div class="ix-foot"><span class="ix-score"></span><span>${cfg.storageNote || ''}</span></div>`;
  const sectionsEl = frame.querySelector('.ix-sections');
  cfg.sections.forEach((sec, si) => {
    const secEl = document.createElement('div');
    secEl.className = 'ix-section' + (si === 0 ? ' open' : '');
    const doneCount = sec.items.filter((_, ii) => saved[si + ':' + ii]).length;
    secEl.innerHTML = `
      <div class="ix-section-head" role="button" tabindex="0" aria-expanded="${si === 0}">
        <span class="ix-sec-title">${sec.title}</span>
        <span class="ix-sec-count" data-sec-count>${doneCount}/${sec.items.length}</span>
        <span class="ix-caret" aria-hidden="true"></span>
      </div>
      <div class="ix-section-body"></div>`;
    const body = secEl.querySelector('.ix-section-body');
    sec.items.forEach((item, ii) => {
      const key = si + ':' + ii;
      const row = document.createElement('label');
      row.className = 'ix-item' + (saved[key] ? ' done' : '');
      row.innerHTML = `<input type="checkbox" ${saved[key] ? 'checked' : ''} aria-label="${item.t.replace(/"/g, '&quot;')}">
        <span><span class="ix-item-text">${item.t}</span>${item.n ? `<div class="ix-item-note">${item.n}</div>` : ''}</span>`;
      const cb = row.querySelector('input');
      cb.addEventListener('change', () => {
        saved[key] = cb.checked;
        row.classList.toggle('done', cb.checked);
        localStorage.setItem(storageKey, JSON.stringify(saved));
        update();
      });
      body.appendChild(row);
    });
    const head = secEl.querySelector('.ix-section-head');
    const toggle = () => { secEl.classList.toggle('open'); head.setAttribute('aria-expanded', secEl.classList.contains('open')); };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    sectionsEl.appendChild(secEl);
  });
  const bar = frame.querySelector('.ix-bar > span');
  const countEl = frame.querySelector('.ix-count');
  const statusEl = frame.querySelector('.ix-status-label');
  const scoreEl = frame.querySelector('.ix-score');
  function update() {
    let done = 0;
    cfg.sections.forEach((sec, si) => {
      let secDone = 0;
      sec.items.forEach((_, ii) => { if (saved[si + ':' + ii]) { secDone++; done++; } });
      sectionsEl.children[si].querySelector('[data-sec-count]').textContent = secDone + '/' + sec.items.length;
    });
    const pct = Math.round((done / total) * 100);
    bar.style.width = pct + '%';
    countEl.textContent = done + ' of ' + total + ' complete';
    statusEl.textContent = pct === 100 ? 'Complete' : pct >= 75 ? 'In progress — strong' : pct >= 40 ? 'In progress' : pct > 0 ? 'In progress — early' : 'Not started';
    scoreEl.innerHTML = `Score: <b>${pct}%</b>`;
  }
  frame.querySelector('[data-act="reset"]').addEventListener('click', () => {
    if (!confirm('Reset all checklist progress for this article?')) return;
    saved = {};
    localStorage.removeItem(storageKey);
    frame.querySelectorAll('.ix-item input').forEach((cb) => { cb.checked = false; });
    frame.querySelectorAll('.ix-item').forEach((r) => r.classList.remove('done'));
    update();
  });
  frame.querySelector('[data-act="copy"]').addEventListener('click', () => {
    const lines = [cfg.title + ' — ' + new Date().toISOString().slice(0, 10)];
    cfg.sections.forEach((sec, si) => { lines.push('', sec.title); sec.items.forEach((item, ii) => lines.push((saved[si + ':' + ii] ? '[x] ' : '[ ] ') + item.t)); });
    const btn = frame.querySelector('[data-act="copy"]');
    navigator.clipboard.writeText(lines.join('\n')).then(() => { btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy summary'; }, 1600); });
  });
  update();
  el.appendChild(frame);
}
```

- [ ] **Step 3: AI map, sheets, calendar widgets**

`src/scripts/widgets/ai-map.js`:

```js
export function renderAiMap(el, data) {
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `<div class="ix-head"><span class="ix-title"><b>Interactive</b> — the practical map</span><span class="cc-caption">Select a card to see the working detail</span></div><div class="ai-map-grid"></div>`;
  const grid = frame.querySelector('.ai-map-grid');
  [['helps', data.helps], ['humans', data.humans]].forEach(([key, col]) => {
    const colEl = document.createElement('div');
    colEl.className = 'ai-map-col ai-map-' + key;
    colEl.innerHTML = `<div class="ai-map-col-head"><span class="cc-tag ${key === 'helps' ? 'cc-tag-success' : 'cc-tag-ink'}">${col.label}</span></div>`;
    col.cards.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'ai-card'; card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0'); card.setAttribute('aria-expanded', 'false');
      card.innerHTML = `<div class="ai-card-title"><span>${c.t}</span><span class="ai-plus" aria-hidden="true">+</span></div><div class="ai-card-detail">${c.d}</div>`;
      const toggle = () => { card.classList.toggle('open'); card.setAttribute('aria-expanded', card.classList.contains('open')); };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      colEl.appendChild(card);
    });
    grid.appendChild(colEl);
  });
  el.appendChild(frame);
}
```

`src/scripts/widgets/sheets.js`:

```js
export function renderSheetExplorer(el, sheets) {
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `<div class="ix-head"><span class="ix-title"><b>Interactive</b> — walk the sheets</span><span class="cc-caption">A drawing-set index, the way the program is organized</span></div><div class="sheet-strip" role="tablist"></div><div class="sheet-detail" role="tabpanel"></div>`;
  const strip = frame.querySelector('.sheet-strip');
  const detail = frame.querySelector('.sheet-detail');
  function select(i) {
    strip.querySelectorAll('.sheet-tab').forEach((t, ti) => { t.classList.toggle('active', ti === i); t.setAttribute('aria-selected', ti === i); });
    const s = sheets[i];
    detail.innerHTML = `<div class="sheet-big">${s.id}</div><div><div class="sheet-name">${s.name}</div><p>${s.d}</p><div class="sheet-question">${s.q}</div></div>`;
  }
  sheets.forEach((s, i) => {
    const tab = document.createElement('button');
    tab.className = 'sheet-tab'; tab.type = 'button'; tab.setAttribute('role', 'tab');
    tab.innerHTML = `<span class="sheet-id">${s.id}</span><span class="sheet-short">${s.short}</span>`;
    tab.addEventListener('click', () => select(i));
    strip.appendChild(tab);
  });
  select(0);
  el.appendChild(frame);
}
```

`src/scripts/widgets/calendar.js`:

```js
export function renderCalendar(el, months) {
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `<div class="ix-head"><span class="ix-title"><b>Interactive</b> — walk the operating year</span><span class="cc-caption">Twelve blocks, three forces: finance, weather, retail</span></div><div class="cal-grid" role="tablist"></div><div class="cal-detail" role="tabpanel"></div>`;
  const grid = frame.querySelector('.cal-grid');
  const detail = frame.querySelector('.cal-detail');
  function select(i) {
    grid.querySelectorAll('.cal-month').forEach((t, ti) => { t.classList.toggle('active', ti === i); t.setAttribute('aria-selected', ti === i); });
    const m = months[i];
    detail.innerHTML = `<div class="cal-detail-title">${m.m} — ${m.title}</div><div class="cal-detail-focus">${m.focus}</div><ul>${m.items.map((it) => `<li>${it}</li>`).join('')}</ul>`;
  }
  months.forEach((m, i) => {
    const tab = document.createElement('button');
    tab.className = 'cal-month'; tab.type = 'button'; tab.setAttribute('role', 'tab');
    tab.innerHTML = `<span class="cal-mname">${m.m}</span><span class="cal-mtitle">${m.title}</span>`;
    tab.addEventListener('click', () => select(i));
    grid.appendChild(tab);
  });
  select(new Date().getMonth());
  el.appendChild(frame);
}
```

- [ ] **Step 4: The Widgets component and hydration**

`src/components/Widgets.astro`:

```astro
<script>
  import checklists from '../data/widgets/checklists.json';
  import aiMap from '../data/widgets/ai-map.json';
  import sheets from '../data/widgets/sheets.json';
  import calendar from '../data/widgets/calendar.json';
  import { renderChecklist } from '../scripts/widgets/checklist.js';
  import { renderAiMap } from '../scripts/widgets/ai-map.js';
  import { renderSheetExplorer } from '../scripts/widgets/sheets.js';
  import { renderCalendar } from '../scripts/widgets/calendar.js';

  document.querySelectorAll<HTMLElement>('.ix[data-ix]').forEach((el) => {
    const type = el.dataset.ix;
    if (type === 'checklist') { const id = el.dataset.id!; renderChecklist(el, (checklists as any)[id], id); }
    else if (type === 'ai-map') renderAiMap(el, aiMap);
    else if (type === 'sheet-explorer') renderSheetExplorer(el, sheets);
    else if (type === 'calendar') renderCalendar(el, calendar);
  });
</script>
```

In `src/pages/[collection]/[slug].astro`, add `import Widgets from '../../components/Widgets.astro';` and place `{article.interactive && <Widgets />}` right after `<PublisherNote />`.

- [ ] **Step 5: Widget CSS (append to site.css)**

```css
/* Interactive widgets */
.ix { margin: var(--cc-space-8) 0; font-family: var(--cc-font-sans); font-size: var(--cc-text-body); line-height: var(--cc-lh-body); }
.ix-frame { border: 2px solid var(--cc-fg); border-radius: var(--cc-radius-doc); background: var(--cc-bg); }
.ix-head { display: flex; align-items: center; justify-content: space-between; gap: var(--cc-space-4); padding: var(--cc-space-4); border-bottom: var(--cc-hairline) solid var(--cc-border); flex-wrap: wrap; }
.ix-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.ix-title b { color: var(--cc-accent); }
.ix-actions { display: flex; gap: var(--cc-space-2); }
.ix-progress { padding: var(--cc-space-4) var(--cc-space-4) 0; }
.ix-bar { height: 8px; background: var(--cc-bg-elev); border: var(--cc-hairline) solid var(--cc-border); position: relative; }
.ix-bar > span { position: absolute; inset: 0; width: 0; background: var(--cc-success); transition: width 150ms ease; }
.ix-progress-meta { display: flex; justify-content: space-between; margin-top: var(--cc-space-2); font-family: var(--cc-font-mono); font-size: 12px; color: var(--cc-fg-muted); font-variant-numeric: tabular-nums; }
.ix-sections { padding: var(--cc-space-4); display: flex; flex-direction: column; gap: var(--cc-space-3); }
.ix-section { border: var(--cc-hairline) solid var(--cc-border); }
.ix-section-head { display: flex; align-items: center; gap: var(--cc-space-3); padding: var(--cc-space-3) var(--cc-space-4); background: var(--cc-bg-elev); cursor: pointer; user-select: none; min-height: 44px; }
.ix-sec-title { font-weight: 700; font-size: 14px; line-height: 20px; flex: 1; }
.ix-sec-count { font-family: var(--cc-font-mono); font-size: 11px; color: var(--cc-fg-muted); font-variant-numeric: tabular-nums; }
.ix-caret { width: 10px; height: 10px; border-right: 2px solid var(--cc-fg); border-bottom: 2px solid var(--cc-fg); transform: rotate(45deg); transition: transform 150ms ease; }
.ix-section.open .ix-caret { transform: rotate(-135deg); }
.ix-section-body { display: none; }
.ix-section.open .ix-section-body { display: block; }
.ix-item { display: flex; gap: var(--cc-space-3); align-items: flex-start; padding: var(--cc-space-3) var(--cc-space-4); border-top: var(--cc-hairline) solid var(--cc-border); cursor: pointer; min-height: 44px; }
.ix-item:hover { background: var(--cc-wash-ink); }
.ix-item input[type="checkbox"] { appearance: none; width: 20px; height: 20px; flex: none; margin: 1px 0 0; border: 2px solid var(--cc-fg); border-radius: var(--cc-radius-doc); background: transparent; cursor: pointer; display: grid; place-content: center; }
.ix-item input[type="checkbox"]:checked { background: var(--cc-success); border-color: var(--cc-success); }
.ix-item input[type="checkbox"]:checked::before { content: ""; width: 10px; height: 6px; border-left: 2px solid var(--cc-bg); border-bottom: 2px solid var(--cc-bg); transform: rotate(-45deg) translate(1px, -1px); }
.ix-item-text { font-size: 14px; line-height: 21px; }
.ix-item-note { font-size: 12px; line-height: 17px; color: var(--cc-fg-muted); }
.ix-item.done .ix-item-text { text-decoration: line-through; color: var(--cc-fg-muted); }
.ix-foot { border-top: var(--cc-hairline) solid var(--cc-border); padding: var(--cc-space-3) var(--cc-space-4); font-size: 12px; color: var(--cc-fg-muted); display: flex; justify-content: space-between; gap: var(--cc-space-4); flex-wrap: wrap; }
.ix-score b { color: var(--cc-accent); }
.ai-map-grid { display: grid; grid-template-columns: 1fr 1fr; }
.ai-map-col { padding: var(--cc-space-4); }
.ai-map-col + .ai-map-col { border-left: var(--cc-hairline) solid var(--cc-border); }
@media (max-width: 800px) { .ai-map-grid { grid-template-columns: 1fr; } .ai-map-col + .ai-map-col { border-left: 0; border-top: var(--cc-hairline) solid var(--cc-border); } }
.ai-map-col-head { margin-bottom: var(--cc-space-4); }
.ai-card { border: var(--cc-hairline) solid var(--cc-border); padding: var(--cc-space-3) var(--cc-space-4); margin-bottom: var(--cc-space-3); cursor: pointer; }
.ai-card:hover { border-color: var(--cc-accent); }
.ai-card-title { font-weight: 700; font-size: 14px; line-height: 20px; display: flex; justify-content: space-between; gap: var(--cc-space-3); }
.ai-plus { font-weight: 400; color: var(--cc-fg-muted); }
.ai-card-detail { font-size: 13px; line-height: 20px; color: var(--cc-fg-muted); margin-top: var(--cc-space-2); display: none; }
.ai-card.open .ai-card-detail { display: block; }
.ai-card.open .ai-plus { display: inline-block; transform: rotate(45deg); }
.sheet-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); border-bottom: var(--cc-hairline) solid var(--cc-border); }
.sheet-tab { appearance: none; border: 0; background: transparent; cursor: pointer; text-align: left; padding: var(--cc-space-3); border-right: var(--cc-hairline) solid var(--cc-border); border-top: 3px solid transparent; min-height: 44px; }
.sheet-id { font-family: var(--cc-font-display); font-weight: 900; font-size: 17px; line-height: 1; display: block; }
.sheet-short { font-size: 10px; line-height: 13px; color: var(--cc-fg-muted); display: block; margin-top: 2px; letter-spacing: 0.04em; text-transform: uppercase; }
.sheet-tab:hover .sheet-id { color: var(--cc-accent); }
.sheet-tab.active { border-top-color: var(--cc-accent); background: var(--cc-bg-elev); }
.sheet-detail { padding: var(--cc-space-6) var(--cc-space-4); display: grid; grid-template-columns: 200px 1fr; gap: var(--cc-space-6); }
@media (max-width: 700px) { .sheet-detail { grid-template-columns: 1fr; } }
.sheet-big { font-family: var(--cc-font-display); font-weight: 900; font-size: 64px; line-height: 1; color: var(--cc-accent); }
.sheet-name { font-weight: 700; font-size: 17px; line-height: 24px; margin-bottom: var(--cc-space-2); }
.sheet-detail p { font-size: 14px; line-height: 22px; color: var(--cc-fg-muted); max-width: 46em; margin: 0; }
.sheet-question { margin-top: var(--cc-space-3); font-size: 12px; color: var(--cc-accent); font-weight: 700; }
.cal-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: var(--cc-hairline) solid var(--cc-border); }
@media (max-width: 900px) { .cal-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .cal-grid { grid-template-columns: repeat(2, 1fr); } }
.cal-month { appearance: none; background: transparent; border: 0; cursor: pointer; text-align: left; padding: var(--cc-space-3) var(--cc-space-4); border-right: var(--cc-hairline) solid var(--cc-border); border-top: 3px solid transparent; min-height: 58px; }
.cal-mname { font-family: var(--cc-font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cc-fg-muted); display: block; }
.cal-mtitle { font-size: 13px; font-weight: 700; line-height: 18px; display: block; margin-top: 2px; }
.cal-month:hover .cal-mtitle { color: var(--cc-accent); }
.cal-month.active { background: var(--cc-bg-elev); border-top-color: var(--cc-accent); }
.cal-detail { padding: var(--cc-space-6) var(--cc-space-4); }
.cal-detail-title { font-family: var(--cc-font-display); font-weight: 700; font-size: 22px; line-height: 28px; margin-bottom: var(--cc-space-1); }
.cal-detail-focus { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cc-accent); margin-bottom: var(--cc-space-4); }
.cal-detail ul { list-style: none; margin: 0; padding: 0; }
.cal-detail li { font-size: 14px; line-height: 22px; padding: var(--cc-space-2) 0 var(--cc-space-2) var(--cc-space-4); border-top: var(--cc-hairline) solid var(--cc-border); position: relative; }
.cal-detail li::before { content: "—"; position: absolute; left: 0; color: var(--cc-accent); }
```

- [ ] **Step 6: Build and verify each widget in the browser**

Run: `npm run build && npm run preview`. Visit, in order, `/shopping-center/36-complete-property-management-checklist/`, `/37-owner-document-safe-checklist/`, `/32-ai-in-shopping-center-operations/`, `/34-otb-command/`, `/38-annual-operating-calendar/`. For 36: tick three items, reload, confirm they stay ticked and the count reads `3 of <pm-master total from Step 1> complete`; open devtools console and run `localStorage.getItem('cc-checklist:pm-master')` → a JSON object with keys like `"0:0"`. Reset clears it. Check night mode on 34 (sheet tabs) and 38 (calendar).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -q -m "Interactive widgets as plain scripts with extracted JSON data; storage keys preserved

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Search index endpoint and search component

**Files:**
- Create: `src/pages/search-index.json.ts`, `src/components/Search.astro`

**Interfaces:**
- Produces: `GET /search-index.json` → `Array<{ url, title, deck, collection, collectionTitle, desk, headings: string[] }>`; `<Search scope?: string placeholder?: string>`.

- [ ] **Step 1: Endpoint**

`src/pages/search-index.json.ts`:

```ts
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
```

- [ ] **Step 2: Component**

`src/components/Search.astro`:

```astro
---
interface Props { scope?: string; placeholder?: string }
const { scope = '', placeholder = 'Search the articles' } = Astro.props;
---
<div class="search" data-scope={scope}>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
  <input type="search" placeholder={placeholder} aria-label={placeholder} autocomplete="off" />
  <div class="search-results" role="listbox"></div>
</div>
<script>
  type Item = { url: string; title: string; deck: string; collection: string; collectionTitle: string; desk: string; headings: string[] };
  let index: Item[] | null = null;
  async function load() { if (!index) index = await (await fetch('/search-index.json')).json(); return index!; }
  document.querySelectorAll<HTMLElement>('.search').forEach((box) => {
    const input = box.querySelector('input')!;
    const out = box.querySelector('.search-results')!;
    const scope = box.dataset.scope || '';
    input.addEventListener('focus', () => { load(); });
    input.addEventListener('input', async () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { out.classList.remove('open'); out.innerHTML = ''; return; }
      const all = await load();
      const hits = all.filter((i) => (!scope || i.collection === scope) &&
        [i.title, i.deck, i.desk, ...i.headings].join(' ').toLowerCase().includes(q)).slice(0, 12);
      out.innerHTML = hits.length
        ? hits.map((i) => `<a href="${i.url}"><span class="sr-title">${i.title}</span><div class="sr-meta">${i.collectionTitle}${i.desk ? ' · ' + i.desk : ''}</div></a>`).join('')
        : '<div class="search-empty">No articles match that search. Try a broader term.</div>';
      out.classList.add('open');
    });
    document.addEventListener('click', (e) => { if (!box.contains(e.target as Node)) out.classList.remove('open'); });
  });
</script>
```

- [ ] **Step 3: Verify the endpoint**

Run: `npm run build && node -e "const j=require('./dist/search-index.json');const a=j.find(i=>i.url.includes('07-reading'));console.log(j.length, a.url, a.headings.length>3, a.desk)"`
Expected: `40 /shopping-center/07-reading-a-rent-roll/ true buy` (40 entries: article 31 is one entry even though it is surfaced in two collections).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -q -m "Search index endpoint and client-side search component

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Collection landing pages (series, lane, coming soon) and the map

**Files:**
- Create: `src/pages/[collection]/index.astro`, `src/pages/[collection]/map.astro`, `src/components/ArticleRow.astro`, `src/components/ArticleCard.astro`, `src/components/PartIndex.astro`, `src/components/StateTag.astro`
- Modify: `src/styles/site.css` (append)

**Interfaces:**
- Consumes: Task 4 queries, Task 9 `<Search scope>`.
- Produces: `/shopping-center/`, `/field-notes/`, `/operating-systems/`, `/owners-contracts/`, `/small-portfolio/`, `/governed-ai/`, `/shopping-center/map/`; `<ArticleRow article>`, `<ArticleCard article>`, `<StateTag state>`.

- [ ] **Step 1: Small components**

`src/components/StateTag.astro`:

```astro
---
interface Props { state: 'published' | 'coming-soon' }
const { state } = Astro.props;
---
{state === 'published' ? <span class="cc-tag cc-tag-success">Published</span> : <span class="cc-tag cc-tag-warning">In progress</span>}
```

`src/components/ArticleRow.astro`:

```astro
---
import DeskChip from './DeskChip.astro';
import { pad2 } from '../lib/articles';
import type { Article } from '../lib/collections';
interface Props { article: Article; showCollection?: string }
const { article: a, showCollection } = Astro.props;
---
<a class="row" href={a.url}>
  <span class="row-num">{a.num > 0 ? pad2(a.num) : '—'}</span>
  <span>
    <span class="row-title">{a.data.title}</span>
    <span class="row-deck">{a.data.deck}</span>
    {showCollection && <span class="meta">{showCollection}</span>}
  </span>
  <span class="row-meta">
    {a.interactive && <span class="cc-tag cc-tag-accent">Interactive</span>}
    <span class="meta">{a.data.read_time}</span>
    <DeskChip desk={a.data.desk} />
  </span>
</a>
```

`src/components/ArticleCard.astro`:

```astro
---
import { pad2 } from '../lib/articles';
import type { Article } from '../lib/collections';
interface Props { article: Article; kicker?: string }
const { article: a, kicker } = Astro.props;
---
<a class="cc-card cc-card-accent card" href={a.url}>
  {a.data.feature_image && <img src={a.data.feature_image} alt="" loading="lazy" />}
  <span class="card-kicker">{kicker ?? (a.num > 0 ? `Article ${pad2(a.num)}` : a.data.date)}</span>
  <span class="card-title">{a.data.title}</span>
  <span class="card-deck">{a.data.deck}</span>
  <span class="meta">{a.data.read_time}{a.interactive ? ' · Interactive' : ''}</span>
</a>
```

`src/components/PartIndex.astro` (series grouped by part, collapsible, state remembered under `cc-collapsed-parts`):

```astro
---
import ArticleRow from './ArticleRow.astro';
import type { Article } from '../lib/collections';
interface Props { parts: { num: number; roman: string; name: string }[]; articles: Article[] }
const { parts, articles } = Astro.props;
const groups = parts.map((p) => ({ part: p, items: articles.filter((a) => (a.data.part ?? '').split('—').pop()!.trim() === p.name) })).filter((g) => g.items.length);
---
<div id="part-index">
  {groups.map((g) => (
    <section class="section part-section" data-part={g.part.name} id={`part-${g.part.num}`}>
      <div class="wrap">
        <div class="section-head part-head" role="button" tabindex="0" aria-expanded="true">
          <span class="num">Part {g.part.roman}</span>
          <span class="title">{g.part.name}</span>
          <span class="kicker">{g.items.length} article{g.items.length > 1 ? 's' : ''}</span>
          <span class="ix-caret" aria-hidden="true"></span>
        </div>
        <div class="rows part-rows">{g.items.map((a) => <ArticleRow article={a} />)}</div>
      </div>
    </section>
  ))}
</div>
<script>
  const KEY = 'cc-collapsed-parts';
  let collapsed = new Set<string>();
  try { collapsed = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {}
  document.querySelectorAll<HTMLElement>('.part-section').forEach((sec) => {
    const head = sec.querySelector<HTMLElement>('.part-head')!;
    const set = (open: boolean) => { sec.classList.toggle('collapsed', !open); head.setAttribute('aria-expanded', String(open)); };
    set(!collapsed.has(sec.dataset.part!));
    const toggle = () => {
      const open = sec.classList.contains('collapsed');
      set(open);
      if (open) collapsed.delete(sec.dataset.part!); else collapsed.add(sec.dataset.part!);
      try { localStorage.setItem(KEY, JSON.stringify([...collapsed])); } catch {}
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
</script>
```

- [ ] **Step 2: The landing route**

`src/pages/[collection]/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import Search from '../../components/Search.astro';
import PartIndex from '../../components/PartIndex.astro';
import ArticleRow from '../../components/ArticleRow.astro';
import ArticleCard from '../../components/ArticleCard.astro';
import StateTag from '../../components/StateTag.astro';
import Plate from '../../components/Plate.astro';
import { getSeriesList, getArticlesIn } from '../../lib/collections';

export async function getStaticPaths() {
  const series = await getSeriesList();
  return Promise.all(series.map(async (s) => ({ params: { collection: s.data.slug }, props: { series: s, articles: await getArticlesIn(s.data.slug) } })));
}
const { series, articles } = Astro.props;
const s = series.data;
const interactive = articles.filter((a) => a.interactive).slice(-3).reverse();
const jsonLd = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Cypress Command Articles', item: 'https://articles.cypresscommand.com/' },
  { '@type': 'ListItem', position: 2, name: s.title, item: `https://articles.cypresscommand.com/${s.slug}/` } ] }];
---
<Base title={`${s.title} — Cypress Command`} description={s.deck} ogImage={s.heroImage} jsonLd={jsonLd}>
  <header class="page-head">
    <div class="wrap">
      <nav class="crumb" aria-label="Breadcrumb"><a href="/">Collections</a><span aria-hidden="true">·</span><span>{s.shortTitle}</span></nav>
      <div class="tag-row"><span class="eyebrow">{s.kind === 'lane' ? 'Lane' : 'Series'}</span><StateTag state={s.state} /></div>
      <h1>{s.title}</h1>
      <p class="deck">{s.deck}</p>
      {s.state === 'published' && (
        <div class="hero-actions">
          <a class="btn btn-primary" href="#index">Browse the {s.kind === 'lane' ? 'notes' : 'series'}</a>
          {s.hasMap && <a class="btn btn-secondary" href={`/${s.slug}/map/`}>See the map</a>}
        </div>
      )}
      {s.heroImage && <Plate src={s.heroImage} alt="" label={`PLATE 01 · ${s.shortTitle.toUpperCase()}`} caption={s.heroCaption} />}
    </div>
  </header>

  {s.state === 'coming-soon' && (
    <section class="section"><div class="wrap">
      <div class="section-head"><span class="num">Planned</span><span class="title">What this series will cover</span><span class="kicker">In progress</span></div>
      {s.plannedTitles.length ? <ol class="planned">{s.plannedTitles.map((t) => <li>{t}</li>)}</ol> : <p class="muted">Titles are being drafted. The deck above is the promise.</p>}
      <p class="muted">Meanwhile, the <a href="/shopping-center/">Shopping Center Operator Series</a> and the <a href="/field-notes/">Field Notes</a> are complete and free to read.</p>
    </div></section>
  )}

  {s.state === 'published' && interactive.length > 0 && (
    <section class="section"><div class="wrap">
      <div class="section-head"><span class="num">Tools</span><span class="title">Interactive articles</span><span class="kicker">Progress saves in your browser</span></div>
      <div class="cards">{interactive.map((a) => <ArticleCard article={a} />)}</div>
    </div></section>
  )}

  {s.state === 'published' && (
    <div class="wrap" id="index"><Search scope={s.slug} placeholder={`Search ${s.shortTitle}`} /></div>
  )}

  {s.state === 'published' && s.kind === 'series' && <PartIndex parts={s.parts} articles={articles} />}
  {s.state === 'published' && s.kind === 'lane' && (
    <section class="section"><div class="wrap"><div class="rows">{articles.map((a) => <ArticleRow article={a} showCollection={a.collection !== s.slug ? 'From the Shopping Center Operator Series' : undefined} />)}</div></div></section>
  )}
</Base>
```

- [ ] **Step 3: The map route**

`src/pages/[collection]/map.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import ArticleRow from '../../components/ArticleRow.astro';
import { getSeriesList, getArticlesIn } from '../../lib/collections';
import { partName } from '../../lib/articles';

export async function getStaticPaths() {
  const series = (await getSeriesList()).filter((s) => s.data.hasMap);
  return Promise.all(series.map(async (s) => ({ params: { collection: s.data.slug }, props: { series: s, articles: await getArticlesIn(s.data.slug) } })));
}
const { series, articles } = Astro.props;
const s = series.data;
const groups = s.parts.map((p) => ({ part: p, items: articles.filter((a) => partName(a.data.part) === p.name) })).filter((g) => g.items.length);
const lifecycle = groups.filter((g) => g.part.num <= 8);
const layer = groups.filter((g) => g.part.num > 8);
---
<Base title={`The map — ${s.title}`} description={`Every article in ${s.title}, in its place: the asset lifecycle and the operating layer.`}>
  <header class="page-head"><div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Collections</a><span aria-hidden="true">·</span><a href={`/${s.slug}/`}>{s.shortTitle}</a><span aria-hidden="true">·</span><span>Map</span></nav>
    <span class="eyebrow">The map of the series</span>
    <h1>Every article, in its place.</h1>
    <p class="deck">The series is organized as an operating system for the asset itself: a lifecycle the property moves through, and an operating layer of field notes, systems, and checklists that feeds every stage.</p>
  </div></header>
  <section class="section"><div class="wrap">
    <div class="section-head"><span class="num">A</span><span class="title">The asset lifecycle</span><span class="kicker">The work a property moves through</span></div>
    <div class="flow">{lifecycle.map((g) => <a class="flow-stage" href={`#map-${g.part.num}`}><span class="flow-roman">{g.part.roman}</span><span class="flow-name">{g.part.name}</span><span class="meta">{g.items.length} article{g.items.length > 1 ? 's' : ''}</span></a>)}</div>
    <div class="section-head"><span class="num">B</span><span class="title">The operating layer</span><span class="kicker">What keeps every stage visible</span></div>
    <div class="flow">{layer.map((g) => <a class="flow-stage" href={`#map-${g.part.num}`}><span class="flow-roman">{g.part.roman}</span><span class="flow-name">{g.part.name}</span><span class="meta">{g.items.length} article{g.items.length > 1 ? 's' : ''}</span></a>)}</div>
    <p class="muted flow-return"><b>Continuous improvement.</b> Field notes, operating systems, and checklists feed the next decision at every stage, so the lifecycle runs on evidence, not memory.</p>
  </div></section>
  {groups.map((g) => (
    <section class="section" id={`map-${g.part.num}`}><div class="wrap">
      <div class="section-head"><span class="num">Part {g.part.roman}</span><span class="title">{g.part.name}</span><span class="kicker">{g.items.length} article{g.items.length > 1 ? 's' : ''}</span></div>
      <div class="rows">{g.items.map((a) => <ArticleRow article={a} />)}</div>
    </div></section>
  ))}
</Base>
```

- [ ] **Step 4: CSS (append to site.css)**

```css
/* Collection landing, map, cards */
.hero-actions { display: flex; gap: var(--cc-space-3); flex-wrap: wrap; margin-top: var(--cc-space-6); }
.planned { font-family: var(--cc-font-display); font-size: 19px; line-height: 27px; padding-left: 1.4em; margin: 0 0 var(--cc-space-6); }
.planned li { padding: var(--cc-space-2) 0; border-bottom: var(--cc-hairline) solid var(--cc-border); }
.planned li::marker { font-weight: 900; color: var(--cc-accent); }
.part-section.collapsed .part-rows { display: none; }
.part-head { cursor: pointer; user-select: none; }
.part-head .ix-caret { margin-left: var(--cc-space-3); }
.part-section.collapsed .part-head .ix-caret { transform: rotate(-45deg); }
.card { display: flex; flex-direction: column; gap: var(--cc-space-2); color: var(--cc-fg); text-decoration: none; padding: 0; overflow: hidden; }
.card:hover { text-decoration: none; }
.card img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-bottom: var(--cc-hairline) solid var(--cc-border); }
.card > span { padding: 0 var(--cc-space-4); }
.card > span:last-child { padding-bottom: var(--cc-space-4); }
.card-kicker { font-family: var(--cc-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--cc-fg-muted); padding-top: var(--cc-space-4); }
.card-title { font-family: var(--cc-font-display); font-weight: 700; font-size: 20px; line-height: 26px; }
.card:hover .card-title { color: var(--cc-accent); }
.card-deck { font-size: 14px; line-height: 21px; color: var(--cc-fg-muted); }
.flow { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(140px, 1fr); gap: var(--cc-space-3); overflow-x: auto; padding: var(--cc-space-4) 0 var(--cc-space-8); }
.flow-stage { border: var(--cc-hairline) solid var(--cc-border); border-top: var(--cc-plate-rule) solid var(--cc-accent); border-radius: var(--cc-radius-doc); padding: var(--cc-space-3) var(--cc-space-4); color: var(--cc-fg); text-decoration: none; display: flex; flex-direction: column; gap: 4px; }
.flow-stage:hover { background: var(--cc-wash-ink); text-decoration: none; }
.flow-roman { font-family: var(--cc-font-display); font-weight: 900; font-size: 20px; }
.flow-name { font-family: var(--cc-font-sans); font-weight: 700; font-size: 13px; }
.flow-return { max-width: 60em; }
```

- [ ] **Step 5: Build and inspect**

Run: `npm run build && ls dist/shopping-center/map dist/field-notes dist/governed-ai`
Expected: each lists `index.html`.

Preview `/shopping-center/` (parts collapse and remember; search scoped; three interactive cards), `/field-notes/` (one row, article 31, labeled as from the series), `/operating-systems/` (ten planned titles, Mustard "In progress" tag), `/shopping-center/map/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -q -m "Collection landing pages for series, lanes, and coming-soon; series map

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Hub, desk pages, about page

**Files:**
- Create: `src/components/CollectionCard.astro`, `src/components/DeskChips.astro`, `src/components/PublisherBand.astro`, `src/pages/desk/[desk].astro`, `src/pages/about.astro`
- Modify: `src/pages/index.astro` (the real hub), `src/styles/site.css` (append)

- [ ] **Step 1: Components**

`src/components/CollectionCard.astro`:

```astro
---
import StateTag from './StateTag.astro';
import type { CollectionEntry } from 'astro:content';
interface Props { series: CollectionEntry<'series'>; count: number }
const { series, count } = Astro.props;
const s = series.data;
---
<a class="cc-card cc-card-accent collection-card" href={`/${s.slug}/`}>
  <div class="tag-row"><span class="eyebrow">{s.kind === 'lane' ? 'Lane' : 'Series'}</span><StateTag state={s.state} /></div>
  <span class="card-title">{s.title}</span>
  <span class="card-deck">{s.deck}</span>
  <span class="meta">
    {s.state === 'published'
      ? `${count} ${s.kind === 'lane' ? (count === 1 ? 'note' : 'notes') : (count === 1 ? 'article' : 'articles')}`
      : s.plannedTitles.length ? `${s.plannedTitles.length} titles planned` : 'Coming soon'}
  </span>
</a>
```

`src/components/DeskChips.astro`:

```astro
---
const DESKS = [['own', 'Own'], ['run', 'Run'], ['lease', 'Lease'], ['finance', 'Finance'], ['buy', 'Buy'], ['sell', 'Sell']];
interface Props { active?: string }
const { active } = Astro.props;
---
<div class="tag-row desk-chips" aria-label="Desks">
  {DESKS.map(([id, label]) => <a class={`cc-tag ${active === id ? 'cc-tag-accent' : 'cc-tag-neutral'}`} href={`/desk/${id}/`} aria-current={active === id ? 'page' : undefined}>{label}</a>)}
</div>
```

`src/components/PublisherBand.astro`:

```astro
---
import Mark from '../../design-system/logo/cc-mark.svg';
---
<section class="cc-surface-brand publisher-band">
  <div class="wrap publisher-inner">
    <Mark aria-hidden="true" />
    <div>
      <span class="cc-eyebrow">Published by</span>
      <h2 class="h2">Cypress Command</h2>
      <p>Cypress Command is a Lafayette, Louisiana company that installs AI into how individuals and organizations actually operate. Its open AI Operating Standard defines what to build, and Command Installation builds it with you. On The Boulevard, a working shopping center, is the proof.</p>
      <p class="publisher-signoff">Systems under control. Results that last.</p>
      <a class="btn btn-secondary" href="/about/">About the publisher</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: The hub**

`src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import CollectionCard from '../components/CollectionCard.astro';
import DeskChips from '../components/DeskChips.astro';
import Search from '../components/Search.astro';
import ArticleRow from '../components/ArticleRow.astro';
import ArticleCard from '../components/ArticleCard.astro';
import PublisherBand from '../components/PublisherBand.astro';
import { getSeriesList, getArticlesIn, getInteractive } from '../lib/collections';

const series = await getSeriesList();
const counts = Object.fromEntries(await Promise.all(series.map(async (s) => [s.data.slug, (await getArticlesIn(s.data.slug)).length])));
const notes = (await getArticlesIn('field-notes')).slice(0, 4);
const interactive = (await getInteractive()).slice(-3).reverse();
const published = series.filter((s) => s.data.state === 'published').length;
---
<Base title="Cypress Command — Articles" description="Operator-grade writing on the work that runs real businesses. The Shopping Center Operator Series, Field Notes, and more series in progress.">
  <header class="page-head hub-head"><div class="wrap">
    <span class="eyebrow">Cypress Command · Articles</span>
    <h1 class="display">Operator-grade writing on the work that runs real businesses.</h1>
    <p class="deck">A finished forty-article series on owning and running a shopping center, a lane of field notes from the operator's desk, and four series in progress.</p>
    <div class="hero-actions"><a class="btn btn-primary" href="#collections">Browse the collections</a><a class="btn btn-secondary" href="/shopping-center/">Start with the series</a></div>
  </div></header>

  <section class="section" id="collections"><div class="wrap">
    <div class="section-head"><span class="num">01</span><span class="title">Collections</span><span class="kicker">{published} published · {series.length - published} in progress</span></div>
    <div class="cards">{series.map((s) => <CollectionCard series={s} count={counts[s.data.slug]} />)}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="section-head"><span class="num">02</span><span class="title">Find an article</span><span class="kicker">Across every collection</span></div>
    <Search placeholder="Search every collection — try “CAM reconciliation”, “parking”, “checklist”" />
    <p class="muted">Or browse by desk:</p>
    <DeskChips />
  </div></section>

  {interactive.length > 0 && (
    <section class="section"><div class="wrap">
      <div class="section-head"><span class="num">03</span><span class="title">Interactive articles</span><span class="kicker">Progress saves in your browser</span></div>
      <div class="cards">{interactive.map((a) => <ArticleCard article={a} />)}</div>
    </div></section>
  )}

  <section class="section"><div class="wrap">
    <div class="section-head"><span class="num">04</span><span class="title">Latest field notes</span><span class="kicker"><a href="/field-notes/">All notes</a></span></div>
    <div class="rows">{notes.map((a) => <ArticleRow article={a} />)}</div>
  </div></section>

  <PublisherBand />
</Base>
```

- [ ] **Step 3: Desk pages**

`src/pages/desk/[desk].astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import DeskChips from '../../components/DeskChips.astro';
import ArticleRow from '../../components/ArticleRow.astro';
import { getArticlesByDesk, getSeriesList } from '../../lib/collections';

const DESKS: Record<string, { label: string; blurb: string }> = {
  own: { label: 'Own', blurb: 'Title, plat, parking, entities, constraints.' },
  run: { label: 'Run', blurb: 'Dates, rent roll, vacancy, maintenance.' },
  lease: { label: 'Lease', blurb: 'Rent, exclusives, anchors, variance.' },
  finance: { label: 'Finance', blurb: 'Underwriting, debt, recoveries.' },
  buy: { label: 'Buy', blurb: 'Diligence, access, names that do not match.' },
  sell: { label: 'Sell', blurb: 'What a buyer audits.' },
};
export async function getStaticPaths() {
  return Object.keys(DESKS).map((desk) => ({ params: { desk } }));
}
const { desk } = Astro.params;
const meta = DESKS[desk!];
const series = await getSeriesList();
const titles = Object.fromEntries(series.map((s) => [s.data.slug, s.data.title]));
const articles = await getArticlesByDesk(desk!);
const groups = series.map((s) => ({ s, items: articles.filter((a) => a.collection === s.data.slug) })).filter((g) => g.items.length);
---
<Base title={`${meta.label} desk — Cypress Command Articles`} description={`Every article filed under the ${meta.label} desk: ${meta.blurb}`}>
  <header class="page-head"><div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Collections</a><span aria-hidden="true">·</span><span>Desks</span></nav>
    <span class="eyebrow">Desk</span>
    <h1>{meta.label}</h1>
    <p class="deck">{meta.blurb}</p>
    <div style="margin-top: var(--cc-space-6)"><DeskChips active={desk} /></div>
  </div></header>
  {groups.map((g) => (
    <section class="section"><div class="wrap">
      <div class="section-head"><span class="title">{titles[g.s.data.slug]}</span><span class="kicker">{g.items.length} article{g.items.length > 1 ? 's' : ''}</span></div>
      <div class="rows">{g.items.map((a) => <ArticleRow article={a} />)}</div>
    </div></section>
  ))}
</Base>
```

- [ ] **Step 4: About page**

`src/pages/about.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import PublisherBand from '../components/PublisherBand.astro';
---
<Base title="About the publisher — Cypress Command Articles" description="Who publishes these articles, how they are written, and what they are not.">
  <header class="page-head"><div class="wrap">
    <span class="eyebrow">About</span>
    <h1>The publisher</h1>
    <p class="deck">Cypress Command builds AI into how real businesses actually operate. These articles are its field library.</p>
  </div></header>
  <section class="section"><div class="wrap prose about-prose">
    <h2>How the articles are written</h2>
    <p>Every article starts with the operating problem and the work being improved. Facts about On The Boulevard are limited to what is on the public record; everything else is labeled illustrative. The operator's legal background is context, not counsel.</p>
    <h2>What they are not</h2>
    <p>Not legal, tax, or investment advice. Not a sales brochure. Not a promise of outcomes. Terms vary by market, and every article says so where it matters.</p>
    <h2>Desks</h2>
    <p>Articles are filed under six desks: Own, Run, Lease, Finance, Buy, and Sell. A desk view shows every article on that subject across all collections.</p>
    <h2>Contact</h2>
    <p>The company site is <a href="https://cypresscommand.com">cypresscommand.com</a>. Property operations at On The Boulevard run on Command Platform.</p>
  </div></section>
  <PublisherBand />
</Base>
```

- [ ] **Step 5: CSS (append)**

```css
/* Hub, desks, about, publisher band */
.hub-head { padding-top: var(--cc-space-16); }
.hub-head h1 { max-width: 16em; }
.collection-card { display: flex; flex-direction: column; gap: var(--cc-space-3); color: var(--cc-fg); text-decoration: none; }
.collection-card:hover { text-decoration: none; }
.collection-card:hover .card-title { color: var(--cc-accent); }
.desk-chips { margin-top: var(--cc-space-3); }
.publisher-band { margin-top: var(--cc-space-16); padding: var(--cc-space-16) 0; }
.publisher-inner { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: var(--cc-space-8); align-items: start; }
.publisher-inner svg { width: 64px; height: 64px; color: var(--cc-on-brand); }
.publisher-inner h2 { color: var(--cc-on-brand); margin: var(--cc-space-2) 0 var(--cc-space-4); }
.publisher-inner p { max-width: 42em; margin: 0 0 var(--cc-space-4); font-size: 16px; line-height: 25px; }
.publisher-signoff { font-family: var(--cc-font-display); font-style: italic; font-size: 19px; }
.publisher-band .btn-secondary { background: transparent; color: var(--cc-on-brand); border-color: var(--cc-on-brand); }
@media (max-width: 600px) { .publisher-inner { grid-template-columns: 1fr; } }
.about-prose { padding-top: 0; }
.site-footer { margin-top: 0; }
```

Note `.site-footer { margin-top: 0 }` overrides the earlier rule now that pages end in a band or a section.

- [ ] **Step 6: Build and inspect**

Run: `npm run build && node scripts/check-brand.mjs && ls dist/desk dist/about`
Expected: brand clean; `buy finance lease own run sell` and `index.html`.

Preview `/`: six collection cards (one Published tag on shopping-center and field-notes, Mustard In progress on the four), search returns hits from both collections, desk chips route to `/desk/lease/`, Cypress band at the bottom with Paper text and the mark in Paper. Night mode: the band uses the night Cypress value. Check the masthead "Collections" link is marked current only on `/`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -q -m "Hub page with collection cards, global search, desks, latest notes, publisher band; desk and about pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Content check, link check, redirects and redirect check

**Files:**
- Create: `vercel.json`, `scripts/check-content.mjs`, `scripts/check-content.test.mjs`, `scripts/check-links.mjs`, `scripts/check-redirects.mjs`, `scripts/check-redirects.test.mjs`
- Replace the stubs from Task 1.

**Interfaces:**
- Produces: `matchRedirect(rules, path, query): string | null` exported from `check-redirects.mjs`; `validateFrontMatter(text, path, seriesSlugs): string[]` exported from `check-content.mjs`.

- [ ] **Step 1: vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "trailingSlash": true,
  "redirects": [
    { "source": "/article.html", "has": [{ "type": "query", "key": "id", "value": "(?<slug>[^&]+)" }], "destination": "/shopping-center/:slug/", "permanent": true },
    { "source": "/article", "has": [{ "type": "query", "key": "id", "value": "(?<slug>[^&]+)" }], "destination": "/shopping-center/:slug/", "permanent": true },
    { "source": "/article.html", "destination": "/shopping-center/", "permanent": true },
    { "source": "/article", "destination": "/shopping-center/", "permanent": true },
    { "source": "/map.html", "destination": "/shopping-center/map/", "permanent": true },
    { "source": "/map", "destination": "/shopping-center/map/", "permanent": true },
    { "source": "/index.html", "destination": "/", "permanent": true }
  ]
}
```

- [ ] **Step 2: Redirect check, test first**

`scripts/check-redirects.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchRedirect } from './check-redirects.mjs';
import { readFileSync } from 'node:fs';
const rules = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;

test('article with id redirects to the series article', () => {
  assert.equal(matchRedirect(rules, '/article', { id: '07-reading-a-rent-roll' }), '/shopping-center/07-reading-a-rent-roll/');
  assert.equal(matchRedirect(rules, '/article.html', { id: '40-easements-that-outlive-their-contracts' }), '/shopping-center/40-easements-that-outlive-their-contracts/');
});

test('article without id, map, and index redirect to landing pages', () => {
  assert.equal(matchRedirect(rules, '/article', {}), '/shopping-center/');
  assert.equal(matchRedirect(rules, '/map.html', {}), '/shopping-center/map/');
  assert.equal(matchRedirect(rules, '/index.html', {}), '/');
});

test('unrelated paths do not match', () => {
  assert.equal(matchRedirect(rules, '/shopping-center/', {}), null);
});
```

Run: `node --test scripts/check-redirects.test.mjs` → FAIL (no export).

- [ ] **Step 3: Implement the redirect matcher and CLI**

`scripts/check-redirects.mjs`:

```js
import { readFileSync, readdirSync, existsSync } from 'node:fs';

/** Simulates Vercel's redirect matching for literal sources with optional `has` query rules. */
export function matchRedirect(rules, path, query) {
  for (const r of rules) {
    if (r.source !== path) continue;
    let dest = r.destination;
    let ok = true;
    for (const h of r.has ?? []) {
      if (h.type !== 'query') { ok = false; break; }
      const v = query[h.key];
      if (v === undefined) { ok = false; break; }
      const m = new RegExp('^' + h.value + '$').exec(v);
      if (!m) { ok = false; break; }
      for (const [k, val] of Object.entries(m.groups ?? {})) dest = dest.replace(':' + k, val);
    }
    if (ok) return dest;
  }
  return null;
}

if (process.argv[1] && process.argv[1].endsWith('check-redirects.mjs')) {
  const rules = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;
  const slugs = readdirSync('dist/shopping-center').filter((d) => /^\d\d-/.test(d));
  const cases = [];
  for (const s of slugs) { cases.push(['/article', { id: s }]); cases.push(['/article.html', { id: s }]); }
  cases.push(['/article', {}], ['/article.html', {}], ['/map', {}], ['/map.html', {}], ['/index.html', {}]);
  const failures = [];
  for (const [path, query] of cases) {
    const dest = matchRedirect(rules, path, query);
    if (!dest) { failures.push(`${path}?${new URLSearchParams(query)} → no rule`); continue; }
    const file = 'dist' + dest + 'index.html';
    if (!existsSync(file)) failures.push(`${path}?${new URLSearchParams(query)} → ${dest} (missing ${file})`);
  }
  if (slugs.length !== 40) failures.push(`expected 40 series slugs in dist, found ${slugs.length}`);
  if (failures.length) { console.error('Redirect check failed:\n' + failures.join('\n')); process.exit(1); }
  console.log(`Redirect check: ${cases.length} legacy URLs resolve`);
}
```

Run: `node --test scripts/check-redirects.test.mjs` → 3 passing.

- [ ] **Step 4: Content check, test first**

`scripts/check-content.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFrontMatter } from './check-content.mjs';

const good = `---\ntitle: "T"\ndeck: "D"\ndate: "2026-09-22"\nread_time: "5 min"\ndesk: "own"\nlanes: ["field-notes"]\n---\n# T\n`;

test('accepts a valid front matter', () => {
  assert.deepEqual(validateFrontMatter(good, 'x.md', ['field-notes']), []);
});

test('rejects missing fields, bad desk, unknown lane', () => {
  const bad = `---\ntitle: "T"\ndate: "2026-9-2"\ndesk: "other"\nlanes: ["nope"]\n---\n`;
  const v = validateFrontMatter(bad, 'x.md', ['field-notes']);
  assert.ok(v.some((s) => s.includes('deck')));
  assert.ok(v.some((s) => s.includes('read_time')));
  assert.ok(v.some((s) => s.includes('date')));
  assert.ok(v.some((s) => s.includes('desk')));
  assert.ok(v.some((s) => s.includes('lane')));
});
```

Run: `node --test scripts/check-content.test.mjs` → FAIL.

- [ ] **Step 5: Implement the content check**

`scripts/check-content.mjs` (no YAML dependency: the front matter is flat `key: value` lines):

```js
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DESKS = ['own', 'run', 'lease', 'finance', 'buy', 'sell'];

export function parseFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    out[kv[1]] = v;
  }
  return out;
}

export function validateFrontMatter(text, path, seriesSlugs) {
  const fm = parseFrontMatter(text);
  const v = [];
  if (!fm) return [`${path}: missing front matter`];
  for (const k of ['title', 'deck', 'date', 'read_time']) if (!fm[k]) v.push(`${path}: missing ${k}`);
  if (fm.date && !/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) v.push(`${path}: date must be YYYY-MM-DD`);
  if (fm.desk && !DESKS.includes(fm.desk)) v.push(`${path}: desk "${fm.desk}" is not one of ${DESKS.join('|')}`);
  for (const l of fm.lanes ?? []) if (!seriesSlugs.includes(l)) v.push(`${path}: lane "${l}" is not a known collection`);
  if (fm.status && !['published', 'review'].includes(fm.status)) v.push(`${path}: status must be published or review`);
  return v;
}

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, acc) : n.endsWith('.md') && acc.push(p); }
  return acc;
}

if (process.argv[1] && process.argv[1].endsWith('check-content.mjs')) {
  const seriesFiles = readdirSync('src/content/series').filter((f) => f.endsWith('.json'));
  const seriesSlugs = seriesFiles.map((f) => JSON.parse(readFileSync(join('src/content/series', f), 'utf8')).slug);
  const problems = [];
  for (const f of seriesFiles) {
    const s = JSON.parse(readFileSync(join('src/content/series', f), 'utf8'));
    if (s.slug !== f.replace('.json', '')) problems.push(`${f}: slug must equal file name`);
    if (s.state === 'coming-soon' && (s.plannedTitles ?? []).some((t) => !t.trim())) problems.push(`${f}: empty planned title`);
  }
  for (const p of walk('src/content/articles')) {
    const folder = p.split(/[\\/]/).at(-2);
    if (!seriesSlugs.includes(folder)) problems.push(`${p}: folder "${folder}" has no manifest`);
    problems.push(...validateFrontMatter(readFileSync(p, 'utf8'), p, seriesSlugs));
  }
  if (problems.length) { console.error('Content check failed:\n' + problems.join('\n')); process.exit(1); }
  console.log('Content check: clean');
}
```

Run: `node --test scripts/check-content.test.mjs` → 2 passing. Run: `node scripts/check-content.mjs` → `Content check: clean`.

- [ ] **Step 6: Link check**

`scripts/check-links.mjs`:

```js
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, acc) : n.endsWith('.html') && acc.push(p); }
  return acc;
}
const failures = [];
let checked = 0;
for (const file of walk('dist')) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const url = m[1];
    checked++;
    const candidates = url.endsWith('/') ? [join('dist', url, 'index.html')] : [join('dist', url), join('dist', url, 'index.html')];
    if (!candidates.some((c) => existsSync(c))) failures.push(`${file}: ${url}`);
  }
  if (/data-status="review"/.test(html)) failures.push(`${file}: review-status content emitted`);
}
if (failures.length) { console.error('Link check failed:\n' + [...new Set(failures)].join('\n')); process.exit(1); }
console.log(`Link check: ${checked} internal references resolve`);
```

The review guard works because the article page stamps the status on the body: in `src/pages/[collection]/[slug].astro`, change the `<Base ...>` call to add `bodyClass="cc-doc"` (already present) and add a `data-status` attribute by extending `Base.astro`: add `dataStatus?: string` to its Props and render `<body class={bodyClass} data-status={dataStatus}>`; pass `dataStatus={d.status}` from the article page. Published articles render `data-status="published"`; a review article can only appear if `getPublishedArticles` regresses, which this check catches.

- [ ] **Step 7: Full build with all gates**

Run: `npm run build`
Expected, in order: `Brand check: clean`, `Content check: clean`, Astro build summary, `Link check: N internal references resolve`, `Redirect check: 85 legacy URLs resolve`.

Run: `npm test` → all passing.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -q -m "Build gates: content, links, redirects; vercel.json redirects for every legacy URL

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Harvest the Grok field notes with a fact-review table

**Files:**
- Create: `scripts/harvest-grok-notes.mjs`, `src/content/articles/field-notes/*.md` (20 files, `status: review`), `docs/fact-review/grok-field-notes.md`

**Interfaces:**
- Consumes: `OrangeOnyx/tiger-yellow-tulip-birch` `src/data/articles.ts` via `gh api`.
- Produces: review-gated notes; a table Adam edits.

- [ ] **Step 1: Harvest script**

`scripts/harvest-grok-notes.mjs`:

```js
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const raw = execSync('gh api repos/OrangeOnyx/tiger-yellow-tulip-birch/contents/src/data/articles.ts --jq .content', { encoding: 'utf8' });
let ts = Buffer.from(raw.trim(), 'base64').toString('utf8');
ts = ts
  .replace(/^import[^\n]*\n/m, '')
  .replace(/export type Article = \{[\s\S]*?\n\};\n/, '')
  .replace('export const articles: Article[] =', 'globalThis.__notes =')
  .replace(/^export /gm, '');           // helper functions after the array must not be ES exports inside Function
new Function(ts)();
const notes = globalThis.__notes;

const FLAG = /(Montagnet|Domingue|1994|2019|18\.73|40-foot|55-foot|Johnston|Patricia|Marie Antoinette|\b\d+ ?percent\b|\bpercent\b|square feet of GLA|\$\d|\b(19|20)\d\d\b(?!-))/i;
const DESK_LABEL = { own: 'own', run: 'run', lease: 'lease', finance: 'finance', buy: 'buy', sell: 'sell' };
mkdirSync('src/content/articles/field-notes', { recursive: true });
mkdirSync('docs/fact-review', { recursive: true });
const rows = [];
for (const n of notes) {
  const body = n.sections.map((s) => (s.heading ? `## ${s.heading}\n\n` : '') + s.body.join('\n\n')).join('\n\n');
  const md = `---
title: "${n.title.replace(/"/g, '\\"')}"
deck: "${n.dek.replace(/"/g, '\\"')}"
author: "Cypress Command"
date: "${n.date}"
read_time: "${n.minutes} min"
desk: "${DESK_LABEL[n.desk]}"
status: "review"
source: "grok-journal"
---

# ${n.title}

${body}

---

*Cypress Command builds practical AI-enabled operating systems for owner-led businesses — including the owners and operators of commercial real estate. This article is educational. It is not legal, tax, or investment advice.*
`;
  writeFileSync(`src/content/articles/field-notes/${n.slug}.md`, md);
  for (const s of n.sections) for (const p of s.body) for (const sentence of p.split(/(?<=[.!?])\s+/)) if (FLAG.test(sentence)) rows.push([n.slug, sentence.trim()]);
}
const table = `# Fact review — field notes harvested from the Grok journal

Generated ${new Date().toISOString().slice(0, 10)}. One row per sentence containing a specific claim outside the brief's approved-facts list. Fill the Decision column with **accept**, **generalize**, or **cut**. A note moves to \`status: published\` only when every one of its rows is decided and applied.

Approved facts (from ARTICLE-BRIEF.md): 101–149 Arnould Blvd; ~63,000 SF (62,883 SF GLA); 27 units; two buildings; 4.84 acres; zoned CH; Arnould vs. "Arnold Heights Subd. Ext. No. 1"; variance 99-11797, 324 provided / 344 required; plat striping 314; bank servitude 2004-00057697, 13 spaces, expires 12/30/2034; bank parcel sold, not part of the center; church easement §3a liquor waiver survives termination, liquor line on plat. Dollar terms stay out.

| Note | Claim | Decision | Applied |
|---|---|---|---|
${rows.map(([s, c]) => `| ${s} | ${c.replace(/\|/g, '\\|')} |  |  |`).join('\n')}
`;
writeFileSync('docs/fact-review/grok-field-notes.md', table);
console.log(`${notes.length} notes written, ${rows.length} claims flagged`);
```

Run: `node scripts/harvest-grok-notes.mjs`
Expected: `20 notes written, N claims flagged` with N between 15 and 60.

- [ ] **Step 2: Add `source` to the schema and verify the gate**

In `src/content.config.ts` articles schema add `source: z.string().optional(),`.

Run: `npm run build && ls dist/field-notes`
Expected: only `index.html` (no note directories, because every note is `status: review`). `check-content` clean; `check-links` clean.

- [ ] **Step 3: Read every note once and fix voice violations that need no facts**

For each of the 20 files, replace prohibited phrases from the brief if present (`revolutionize, transform everything, unlock, seamless, cutting-edge, best-in-class, guaranteed ROI, future-proof, 10x, disruptive, effortless, set it and forget it, game-changer, synergy`):

```bash
grep -n -i -E "revolutioniz|transform everything|unlock|seamless|cutting-edge|best-in-class|guaranteed ROI|future-proof|10x|disruptive|effortless|set it and forget it|game-changer|synergy" src/content/articles/field-notes/*.md || echo "no prohibited phrases"
```

Fix any hits by hand with a plain verb. Do not touch flagged facts; those wait for the table.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -q -m "Harvest 20 Grok field notes as review-status content with a fact-review table

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Brief update, verification, preview deploy

**Files:**
- Modify: `../ARTICLE-BRIEF.md` (on disk; outside this repo)
- Create: `docs/verification/2026-09-22/README.md` and screenshots

- [ ] **Step 1: Update the brief**

Append to `../ARTICLE-BRIEF.md` after the "Article format" section:

```markdown
## Hub keys (added 2026-09-22)

Two optional front-matter keys apply to every collection on articles.cypresscommand.com:

```yaml
desk: lease              # one of own | run | lease | finance | buy | sell
lanes: [field-notes]     # also surface this article in a lane, without moving it
```

`status: review` keeps a file out of the public build until it clears fact review.

## Field Notes format

A field note is 400–900 words, no `part`, eyebrow rendered as FIELD NOTE, same footer block, same approved-facts rule. One observation, one lesson, one next step. Files live in `articles/field-notes/` on the hub.

This brief governs every collection published on the hub, not only the Shopping Center Operator Series.
```

Also replace the sentence in the brief's naming bullet if Task 2 missed it (see Task 2 Step 6).

- [ ] **Step 2: Browser verification, both themes, two widths**

Run `npm run build && npm run preview`. Using the built-in browser at 1280px and then the mobile preset, day then night (toggle), capture screenshots into `docs/verification/2026-09-22/` named `<page>-<theme>-<width>.png` for: `/`, `/shopping-center/`, `/shopping-center/map/`, `/shopping-center/07-reading-a-rent-roll/`, `/shopping-center/36-complete-property-management-checklist/` (after ticking 3 items and reloading), `/shopping-center/34-otb-command/`, `/shopping-center/38-annual-operating-calendar/`, `/field-notes/`, `/desk/lease/`, `/operating-systems/`, `/about/`. Confirm no horizontal scroll at 390px and the theme persists across navigation.

Write `docs/verification/2026-09-22/README.md` listing each screenshot and the three checks (widgets persist, search hits, theme persists) with pass/fail.

- [ ] **Step 3: Legacy-term scan on the built output**

```bash
grep -rli -E "orange ocean|groundwork|atlas|cypress command platform|libertinus|inter-variable" dist --include=*.html | grep -v "35-why-otb-command" || echo "clean"
```

Expected: `clean`. (Article 35 legitimately mentions OTB Command in its history.)

- [ ] **Step 4: Push the branch and get the preview URL**

```bash
git push -u origin hub
```

Vercel builds the branch automatically because the project is linked to the GitHub repo. Confirm the build command on the Vercel project is `npm run build` and output directory `dist` (framework preset Astro sets these). Fetch the preview deployment URL with the Vercel `list_deployments` tool filtered to project `prj_E5LPbXRa1xRz68IFJ9qWeCquZ2WH`, or from the GitHub PR checks.

- [ ] **Step 5: Verify the preview and the redirects live**

```bash
P=<preview-url>
for u in "/" "/shopping-center/" "/shopping-center/07-reading-a-rent-roll/" "/article?id=07-reading-a-rent-roll" "/map" "/index.html" "/search-index.json"; do
  printf "%-45s " "$u"; curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$P$u"
done
```

Expected: 200 for the first three and the JSON; 308 with the new destination for the three legacy URLs.

- [ ] **Step 6: Commit verification and report**

```bash
git add -A
git commit -q -m "Verification screenshots and checks for the hub preview

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

Report to Adam: the preview URL, the redirect responses, the fact-review table path, and that production is untouched pending his word.

---

## Self-review against the spec

- §4 architecture: Tasks 1, 6. §5.1 collections and planned titles: Task 2. §5.2 manifest: Task 2 (no accent field, per decision 6). §5.3 front matter keys: Tasks 2, 12. §5.4 desks and desk pages: Tasks 2, 11. §5.5 harvested notes: Task 13. §6.1 routes: Tasks 7, 10, 11. §6.2 redirects: Task 12. §6.3 metadata and JSON-LD: Tasks 6, 7, 10. §7.1 naming: Task 2. §7.2 shell messaging: Tasks 6, 7, 11. §7.3 fact review: Task 13. §7.4 brief: Task 14. §8.1 tokens and brand check: Tasks 1, 5. §8.2 fonts: Task 6. §8.3 color rules: Tasks 5, 8, 10, 11 (Olive/Mustard only on StateTag; Oxblood nowhere; Cypress only in PublisherBand). §8.4 headline: Task 11. §8.5 components: Tasks 6–11. §9.1 gates: Tasks 5, 12. §9.2 browser checks: Task 14. §9.3 rollout: Task 14 stops at the preview; merge and production are Adam's call.
- Deviation from spec noted: fonts arrive through Fontsource imports bundled by Astro rather than a hand-populated `public/fonts/`. Same outcome (self-hosted, no Google Fonts request).
- Type consistency: `Article` fields (`id, collection, slug, url, num, interactive, data, entry`) are used identically in Tasks 7, 9, 10, 11. `getArticlesIn`, `getSeriesList`, `getSeries`, `getPublishedArticles`, `getArticlesByDesk`, `getInteractive` are the only query names. `pad2`, `partName`, `numberOf`, `splitId`, `articleUrl`, `sortForCollection` match Task 3.
