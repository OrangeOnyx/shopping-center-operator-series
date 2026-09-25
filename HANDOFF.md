# HANDOFF — Cypress Command article hub

**As of:** 2026-09-23 · `main` @ fc0552a · production = https://articles.cypresscommand.com
**Repo:** `C:\Users\adam\Projects\article series\shopping-center-series\site-v2` · GitHub `OrangeOnyx/shopping-center-operator-series` · Vercel project `site-v2` (team `adams-projects`), Git integration on: every push to `main` promotes to production; every other branch gets a preview.

## What is live

A multi-collection Astro 7 static hub, styled from Brand Standards 2.3 (2.2 at launch), replacing the old single-series site on 2026-09-23.

| Collection | State | Contents |
|---|---|---|
| The Shopping Center Operator Series | published | 40 articles, 11 parts, map page, 5 interactive articles |
| Field Notes | published | 20 harvested notes (fact-reviewed 2026-09-23) plus article 31 surfaced from the series |
| The Operating Systems Series | coming soon | 10 planned titles from the content master |
| The Owner's Contracts Series | coming soon | deck only |
| The Small Portfolio Series | coming soon | deck only |
| The Governed AI Series | coming soon | 1 planned title |

Routes: `/`, `/<collection>/`, `/<collection>/<slug>/`, `/shopping-center/map/`, `/desk/<own|run|lease|finance|buy|sell>/`, `/about/`, `/search-index.json`. Every legacy URL (`/article?id=…`, `/article.html?id=…`, `/article`, `/map`, `/map.html`, `/index.html`) redirects; production responses are recorded in `docs/verification/2026-09-23/production-redirects.md`.

## How the repo works

- `npm run build` runs four gates that must stay green: brand (no raw hex, font faces, or non-token shadows under `src/`), content (front matter, desks, lanes, part names vs manifest), links (every internal href resolves in `dist/`), redirects (127 legacy URL cases against `vercel.json`). `npm test` runs the unit tests (25).
- `design-system/` is the verbatim Brand Standards 2.3 package (`C:\Users\adam\Projects\CYPRESS COMMANDv1\cypress-command-rebrand-v2.3-final.zip`, ratified 2026-09-25). Never edit it; site rules live in `src/styles/site.css` and reference tokens only. Logos used inline come from `src/assets/logo/` (metadata-stripped copies).
- **Adding a series:** create `src/content/series/<slug>.json` (see `shopping-center.json`; each part carries an `ink` of terra/olive/mustard/ink) and a folder `src/content/articles/<slug>/`. Articles follow `../ARTICLE-BRIEF.md` (front matter: title, series, part, eyebrow, deck, author, date, read_time, optional feature_image/feature_caption, desk, lanes, status). `status: "review"` keeps a file out of the build.
- **Article conventions the build relies on:** the body's first H1 and the trailing italic disclaimer are stripped at render; a heading starting "The view from …" becomes a field-note plate and `## The practical next step` becomes the olive next-step panel (`src/lib/remark-article.mjs`).
- **Interactive widgets:** `<div class="ix" data-ix="checklist|ai-map|sheet-explorer|calendar" data-id="…">` in Markdown; data in `src/data/widgets/*.json`; scripts in `src/scripts/widgets/`; browser storage keys `cc-theme`, `cc-checklist:<id>`, `cc-collapsed-parts`.
- **Previews:** SSO-protected. Verify with the Vercel MCP `get_access_to_vercel_url` share link in the built-in browser; curl gets a 302 to SSO. The production custom domain has no SSO.
- **Screenshots:** use Playwright with the installed Chrome (`npx playwright@1.56.1 screenshot --browser=chromium --channel=chrome --viewport-size=390,1200 --full-page --wait-for-timeout=900 …`). Headless Chrome's own `--screenshot` clamps width to ~500px on Windows. Append `?theme=night` to force night for one load.

## Decisions that shape the content

- Product name is **Command Platform**; "Cypress Command" names the company only. Article 34/35 titles and the brief were updated. "OTB Command" appears only as history in 34 and 35.
- Colors carry meaning (Brand Standards 2.3): category inks rotate Terra · Olive · Mustard · Muscadine (Parts I/V, II/VI, III/VII, IV/VIII); Ink is the operating layer (Parts IX–XI); Olive and Mustard also mark published / in-progress states; Oxblood never appears. Solid ink blocks carry large type only. Motion: drawings ink in once on load, Carry page transitions, and the hero survey traverse (the site's one authored sequence, about 1.9 s). Legends name the inks on the map and series landing.
- Article pages stay flat (`cc-doc`); elevation and hover lift are for the hub and landings only.
- Fact review of the harvested notes: 28 sentences accepted, 22 generalized, 0 cut; the decisions and rewrites are in `docs/fact-review/grok-field-notes.md`. The rule that produced them: no tenant names, no easement dollar terms, no site dimensions or cut counts outside the brief's approved list.

## Documents

- Spec: `docs/superpowers/specs/2026-09-22-article-hub-design.md`
- Plans: `docs/superpowers/plans/2026-09-22-article-hub.md`, `docs/superpowers/plans/2026-09-23-color-pass.md`
- Verification: `docs/verification/2026-09-22/`, `docs/verification/2026-09-23/` (README + 44 screenshots each)
- Shared article brief and TOC: `../ARTICLE-BRIEF.md`, `../00-table-of-contents.md` (outside this repo, edited on disk)

## Open items

1. Write the coming-soon series. The Operating Systems Series has its ten titles in its manifest; the brief governs voice and format. A finished article is a Markdown file in the series folder; flip the manifest `state` to `published` when the first batch lands.
2. Small deferred items from review, none blocking: `engines` field in package.json; a `.gitattributes` for line endings; escape interpolated titles in `Search.astro`; the search heading regex is not fence-aware; `check-links` has no unit test; the map hard-codes lifecycle parts ≤ 8; the design system's own "In progress" tag is 11px Mustard, below the standard's stated floor.
3. GitHub repo rename (currently `shopping-center-operator-series`) if wanted; Vercel follows renames.
