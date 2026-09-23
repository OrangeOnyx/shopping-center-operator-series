# Cypress Command Article Hub — Design

**Date:** 2026-09-22
**Status:** Approved in conversation, section by section. Awaiting spec read-through before planning.
**Owner:** Adam Abdalla
**Repo:** this repository (`shopping-center-operator-series` on GitHub, Vercel project `site-v2`, domain `articles.cypresscommand.com`)

## 1. Summary

Turn the single-series static site at articles.cypresscommand.com into a multi-collection publication hub for Cypress Command, rebuilt on Astro in static output mode, styled entirely from Brand Standards 2.0 tokens, with every existing article URL redirected to its new home.

At launch the hub holds one finished series (The Shopping Center Operator Series, 40 articles), a Field Notes lane, and four coming-soon series. Every article can carry a "desk" tag (own, run, lease, finance, buy, sell) that filters across collections.

## 2. Goals and non-goals

**Goals**

- One hub for all Cypress Command article collections; a new series is a folder plus a manifest entry.
- Real HTML per page: crawlable, shareable, with per-page metadata.
- Brand Standards 2.0 applied strictly, enforced by a build-time check.
- The five interactive articles keep working with browser-saved progress.
- Zero broken legacy URLs.
- Same repo, same Vercel project, same domain.

**Non-goals**

- Not a company marketing site. cypresscommand.com remains the company site per the 2026-09-07 site-integration decision. The hub has no service funnel.
- The AI Playbook / AI Operating Standard does not move here. It lives at cypresscommand.com/standard/.
- No CMS, no server runtime, no database, no auth.
- No RSS or sitemap in this pass (declined; a few lines to add later).
- No Tailwind. The v2 token and component CSS is framework-neutral and is the only styling vocabulary.

## 3. Decisions taken during design

| # | Decision | Rationale |
|---|---|---|
| 1 | Hub takes over articles.cypresscommand.com; the series moves under `/shopping-center/` | Keeps domain, Vercel project, and git history. Redirects preserve every URL. |
| 2 | Rebuild on Astro (static) rather than extend the Python generator or keep client-side rendering | User's choice. Content collections map one-to-one onto series folders. |
| 3 | The Grok app-builder repo `OrangeOnyx/tiger-yellow-tulip-birch` is not adopted as code | It is a company marketing site (competes with cypresscommand.com), violates Brand Standards 2.0 (shadows, grain overlay, decorative palette bar, Oxblood as a category color, unapproved tagline, pre-fix night Oxblood), and carries auth/DB/SSR the hub does not need. |
| 4 | Harvest from the Grok repo: the 20 short field notes (gated by fact review) and the six-desk taxonomy | Strong operator voice; the desk filter outlives any single series. |
| 5 | Product name becomes **Command Platform** per v2 decision D3 | The v2 package is the ratified brand authority; "Cypress Command" names only the company. Articles 34 and 35, the TOC, and the brief are edited. Article 35 gains one sentence recording the shortening. |
| 6 | Series parts are structured by numerals and hairlines, not color | Brand rule: Terra is the only page-level accent; Oxblood never marks a category. The current site's per-part colors are removed. |
| 7 | Cypress green appears once: the publisher band at the foot of the hub | Brand rule: Cypress is a master-brand surface, never text, never an accent. |
| 8 | Fonts self-hosted via Fontsource, not Google Fonts | No external network dependency; matches the standard's print/PDF guidance. |
| 9 | Hub headline is publication-specific, not the company tagline | The hub describes the writing, not the company. See §8. |

## 4. Architecture

### 4.1 Stack

- Astro, static output (`output: 'static'`), Vercel static adapter.
- Node 24 / npm 11 (installed). Python is no longer part of the build.
- No UI framework. Interactive widgets are plain client scripts inside Astro components.
- Content in Markdown with YAML front matter, read through Astro content collections with a schema.

### 4.2 Repository layout

```
site-v2/
  astro.config.mjs
  package.json
  vercel.json                  redirects (see §6.2)
  design-system/               copied verbatim from the v2.0 package:
                               tokens.css, components.css, tokens.json, logo/
  src/
    content/
      config.ts                collection schemas
      series/                  one JSON per collection (manifest, §5.2)
      articles/
        shopping-center/       the 40 existing .md files, unchanged except 34 and 35
        field-notes/           the 20 harvested notes (article 31 stays in shopping-center)
    layouts/
      Base.astro               head, masthead, footer, theme boot
      Hub.astro
      Series.astro
      Article.astro
    components/
      Masthead.astro, ThemeToggle.astro, CollectionCard.astro,
      ArticleCard.astro, ArticleRow.astro, Pager.astro, ContentsRail.astro,
      Search.astro, DeskChips.astro, Plate.astro, PublisherBand.astro,
      widgets/Checklist.astro, AiMap.astro, SheetExplorer.astro, Calendar.astro
    pages/
      index.astro
      about.astro
      desk/[desk].astro
      [series]/index.astro
      [series]/map.astro
      [series]/[slug].astro
    styles/site.css             page rules; references tokens only
    lib/                        manifest loader, search index builder, checks
  public/
    fonts/                      Fontsource woff2 (Besley, Archivo, Courier Prime)
    img/                        existing hero and feature photographs
    favicon.svg, og-default.png
  scripts/
    check-brand.mjs             §9.1
    check-content.mjs           §9.1
    check-links.mjs             §9.1
    check-redirects.mjs         §9.1
  docs/
    superpowers/specs/          this file
    fact-review/                §7.3
    verification/               screenshots and check output per release
  archive/legacy-static/        the pre-Astro site, removed one release after launch
```

The current `articles/`, `assets/`, `index.html`, `article.html`, `map.html`, `build.py`, `dev-server.js` move to `archive/legacy-static/` in the first commit of the rebuild and are deleted one release after the redirects are confirmed in production.

## 5. Content model

### 5.1 Collections at launch

| Slug | Title | Kind | State | Contents |
|---|---|---|---|---|
| `shopping-center` | The Shopping Center Operator Series | series | published | 40 articles, 11 parts, has map |
| `field-notes` | Field Notes | lane | published | article 31 (surfaced from the series via `lanes`, not moved) plus harvested notes that pass review |
| `operating-systems` | The Operating Systems Series | series | coming-soon | ten planned titles from the content master §7.7 |
| `owners-contracts` | The Owner's Contracts Series | series | coming-soon | deck only |
| `small-portfolio` | The Small Portfolio Series | series | coming-soon | deck only |
| `governed-ai` | The Governed AI Series | series | coming-soon | deck; first planned title "AI in CRE Underwriting: What the Model Prepares and What the Owner Signs" |

Article 31 stays at its shopping-center URL (it is in the series TOC) and is *also* surfaced in the Field Notes lane by a `lanes: [field-notes]` key. It is not duplicated as a file.

Planned titles for `operating-systems` (from the content master, verbatim):

1. Before You Choose an AI Tool, Map the Work
2. Five Signs a Workflow Has an Operating Problem, Not a People Problem
3. Where Human Review Belongs in an AI-Enabled Workflow
4. The Missing Role in Most Automation Projects: The Process Owner
5. How to Measure an AI Workflow Without Inventing a Dashboard
6. When a Team Is Chasing Updates, the System Is Telling You Something
7. The Smallest Useful AI System Is Often the Best Place to Start
8. Why a Good Workflow Fails When the Operating Routine Is Unclear
9. Design for the Work That Does Not Go According to Plan
10. From Pilot to Practice: What It Takes to Keep an AI Workflow Useful

### 5.2 Series manifest (`src/content/series/<slug>.json`)

```json
{
  "slug": "shopping-center",
  "title": "The Shopping Center Operator Series",
  "shortTitle": "Shopping Center",
  "deck": "Owning, acquiring, financing, leasing, operating, and selling retail shopping centers, from the operator's desk at On The Blvd.",
  "kind": "series",
  "state": "published",
  "order": 1,
  "hasMap": true,
  "parts": [
    { "num": 1, "roman": "I", "name": "Owning" },
    { "num": 2, "roman": "II", "name": "Acquiring" }
  ],
  "plannedTitles": [],
  "heroImage": "/img/hero.jpg",
  "heroCaption": "A neighborhood center at golden hour."
}
```

`kind` is `series` or `lane`. `state` is `published` or `coming-soon`. `parts` is empty for lanes. `plannedTitles` is shown only for `coming-soon`. No accent field exists: every collection uses Terra.

### 5.3 Article front matter

The brief's schema is unchanged. Two optional keys are added:

```yaml
desk: lease              # one of own | run | lease | finance | buy | sell
lanes: [field-notes]     # surface this article in a lane without moving it
```

`series` is derived from the folder. `status: review` marks a file the build must not emit. Field Notes files may omit `part` and `eyebrow`; the eyebrow renders as "FIELD NOTE".

### 5.4 Desks

| Desk | Label | Meaning |
|---|---|---|
| own | Own | Title, plat, parking, entities, constraints |
| run | Run | Dates, rent roll, vacancy, maintenance |
| lease | Lease | Rent, exclusives, anchors, variance |
| finance | Finance | Underwriting, debt, recoveries |
| buy | Buy | Diligence, access, names that do not match |
| sell | Sell | What a buyer audits |

Desks carry no color. A desk chip is a `cc-tag-neutral`. The `/desk/<desk>/` page lists matching articles across all collections, newest first within each collection.

Every one of the 40 series articles gets a desk assigned during implementation, recorded in front matter. Assignment is by article subject, one desk each.

### 5.5 Field Notes harvested from the Grok repo

Twenty notes from `src/data/articles.ts` in `OrangeOnyx/tiger-yellow-tulip-birch` are converted to Markdown with `status: review`. Slugs: anatomy-of-an-open-air-center, walk-a-center-like-an-operator, parking-is-the-real-gla, buying-the-diligence-stack, plat-versus-street, who-owns-the-center, underwriting-an-open-air-center, total-rent-not-base-rent, exclusive-use-the-silent-cap, anchors-write-the-rules, three-kinds-of-empty, leasing-against-a-parking-variance, critical-dates-calendar, what-a-buyer-audits, how-small-center-lenders-think, curb-cuts-and-reciprocal-access, liquor-lines-and-neighbor-waivers, maintenance-as-an-operating-system, rent-roll-as-control-document, assets-operations-risk.

They are rewritten into the brief's voice where needed and stripped of the Grok repo's unapproved facts (see §7.3). A note becomes `status: published` only after Adam accepts its row in the fact-review table.

## 6. Routes, redirects, metadata

### 6.1 Routes

| Route | Page |
|---|---|
| `/` | Hub: masthead, headline, six collection cards, desk chips, cross-collection search, latest field notes, publisher band |
| `/about/` | Publisher panel (expanded from the current about section) |
| `/desk/<desk>/` | Desk view across collections |
| `/<series>/` | Series landing, or coming-soon landing when `state` is `coming-soon` |
| `/<series>/map/` | Series map, only when `hasMap` is true |
| `/<series>/<slug>/` | Article. Slug is the existing file stem, e.g. `/shopping-center/07-reading-a-rent-roll/` |
| `/field-notes/` | Lane index |
| `/field-notes/<slug>/` | Note |

Trailing slashes on; Vercel `cleanUrls` off (Astro emits directory indexes).

### 6.2 Redirects (permanent), in `vercel.json`

| From | To |
|---|---|
| `/article?id=<slug>` and `/article.html?id=<slug>` | `/shopping-center/<slug>/` |
| `/article` and `/article.html` with no id | `/shopping-center/` |
| `/map`, `/map.html` | `/shopping-center/map/` |
| `/index.html` | `/` |

The query-key match uses Vercel's `has` condition with a named capture. The redirect check (§9.1) asserts every one of the 40 slugs plus the four static paths.

### 6.3 Metadata

Every page: `<title>`, description from the deck, canonical URL, Open Graph and Twitter card with a default image. Article pages add `Article` JSON-LD (headline, datePublished, author "Cypress Command", publisher). Series and article pages add `BreadcrumbList`. `lang="en"`, theme-color per theme.

## 7. Content and messaging updates

### 7.1 Naming (decision 5)

- `articles/34-otb-command.md`: title and H1 become "Command Platform: The Property Management Program Built for One Real Shopping Center"; body mentions become "Command Platform".
- `articles/35-why-otb-command-is-becoming-cypress-command.md`: title and H1 become "Why OTB Command Became Command Platform"; the "always the full three-word name" rule is replaced with "Command Platform, with 'Cypress Command' reserved for the company"; one sentence is added recording that the name was shortened on 2026-09-22 under Brand Standards 2.0.
- `00-table-of-contents.md` rows 34 and 35 updated.
- `ARTICLE-BRIEF.md` product-name rule updated.
- File names and slugs do not change.

### 7.2 Shell messaging (from the v2 application kit)

- Descriptor under the lockup: "Practical intelligence for real operations."
- Footer sign-off: "Systems under control. Results that last."
- About panel and author block: the kit's short boilerplate ("Cypress Command is a Lafayette, Louisiana company that installs AI into how individuals and organizations actually operate…").
- Educational disclaimer: unchanged.
- No "Orange Ocean", "Groundwork", "Atlas", or "OTB Command" (outside article 35's history) on any public surface.

### 7.3 Fact review for harvested notes

`docs/fact-review/grok-field-notes.md`: one row per specific claim outside the brief's approved-facts list, with note slug, the claim, and a decision column for Adam (accept / generalize / cut). Known candidates already found: surveyor name and plat dates; a building setback dimension against a right-of-way width; a median opening width; cross-street curb cuts on Johnston, Patricia, and Marie Antoinette; a landscape-area percentage; an "unlabeled row" stall-count reconciliation. Until a row is accepted, the note is rewritten without the claim or held at `status: review`.

### 7.4 Brief update

`ARTICLE-BRIEF.md` gains: the `desk` and `lanes` keys; a Field Notes format (400–900 words, no part, eyebrow FIELD NOTE, same footer); the naming rule above; and a line that the brief now governs every collection on the hub, not one series.

## 8. Design system

### 8.1 Source of truth

`design-system/tokens.css` and `components.css` are copied from the v2.0 package unchanged and imported before any site CSS. `src/styles/site.css` references tokens only. `scripts/check-brand.mjs` fails the build on any raw hex color, any `font-family` naming a face, or any `box-shadow` other than `none` found under `src/`.

### 8.2 Type

- Besley 400 italic, 700, 900. Archivo 400, 500, 700, 800. Courier Prime 400, 700. Self-hosted woff2, `font-display: swap`.
- Headlines Besley 900, tracking −0.02em. Article body Besley 400 at 17/26, measure 70ch. UI and cards Archivo. Courier Prime for plate labels, dates, read times.

### 8.3 Color

- Terra is the only accent: eyebrows, links, active nav, primary button.
- Olive tag "Published" on collection cards; Mustard tag "In progress" on coming-soon cards. No other use of the signals on the hub. Oxblood does not appear.
- Cypress surface once: `PublisherBand` at the foot of the hub, Paper text, Terra night value for its eyebrow.
- No shadows. Radius 2px on cards and plates, 4px on the toggle and search input.
- Day default; night via `data-theme="night"`; first visit follows `prefers-color-scheme`; toggle persists in `localStorage`; a small inline boot script sets the attribute before paint.

### 8.4 Hub headline

Default: **"Operator-grade writing on the work that runs real businesses."**
Alternates for Adam to swap in if preferred:
- "Written from the operator's desk, for the people who own the work."
- "Field-tested writing for owners who run the work themselves."

Eyebrow above the headline: "Cypress Command · Articles". Deck: one sentence naming the finished series, the field notes, and that more series are in progress.

### 8.5 Components

| Component | Spec |
|---|---|
| Masthead | Lockup left (`cc-lockup-h-current.svg`, currentColor), descriptor beneath on wide screens, nav right (Collections, Field Notes, Desks, About), theme toggle. Hairline below. |
| CollectionCard | `cc-card` with 3px Terra top rule, state tag, title Besley 700, deck, count or planned-title list, link. |
| ArticleRow | Numeral Besley 900, title, deck, meta line in Courier Prime (date · read time · desk chip). |
| ArticleCard | Feature-image plate variant for interactive articles and latest notes. |
| Plate | Hairline frame, 3px top rule, Courier Prime `PLATE NN` label, Besley `Fig. NN` caption. Used for hero and feature images. |
| ContentsRail | Sticky H2 list on article pages, active item Terra, hidden under 1024px. |
| Pager | Previous / next within the same collection. |
| Search | Client-side over a build-time JSON index (title, deck, headings, collection, desk). Scoped to the collection on series pages, global on the hub. |
| DeskChips | Six neutral tags linking to desk pages. |
| PublisherBand | Cypress surface, mark in Paper, short boilerplate, sign-off line. |
| Widgets | Checklist, AiMap, SheetExplorer, Calendar as plain scripts; progress in `localStorage` under the same keys the live site uses so existing readers keep their progress. |

## 9. Verification and rollout

### 9.1 Build-time checks (each fails `npm run build`)

- `check-brand.mjs`: §8.1.
- `check-content.mjs`: required front matter present; `desk`, `series`, `lanes` values exist; no `status: review` file emitted; every manifest `plannedTitles` entry non-empty for coming-soon.
- `check-links.mjs`: every internal `href` in the built output resolves to a built file.
- `check-redirects.mjs`: serves the built output with the `vercel.json` rules applied and asserts each legacy URL (40 slugs × 2 forms, plus `/map`, `/map.html`, `/index.html`, `/article`) responds 301/308 to the expected path.

### 9.2 Browser checks before deploy

Day and night at 1280px and 390px: hub, a series landing, the map, a text article, each of the five interactive articles (save progress, reload, reset), the field-notes index, a desk page, search, and theme persistence across navigation. Screenshots saved under `docs/verification/<date>/`.

### 9.3 Rollout

1. All work on a branch; Vercel builds a preview URL.
2. Adam reviews the preview. Production is not touched until Adam says so.
3. Merge to main; Vercel promotes. Verify the live domain, including legacy URL redirects, with actual HTTP responses recorded in `docs/verification/`.
4. Delete `archive/legacy-static/` one release later.

## 10. Open items (not blocking implementation)

- Adam may rename "The Governed AI Series" and adjust its deck.
- Fact-review decisions for the 20 harvested notes (§7.3) gate their publication, not the launch.
- RSS and sitemap, if wanted later.
- GitHub repo rename from `shopping-center-operator-series` to something hub-scoped; Vercel follows renames. Adam's call, after launch.
