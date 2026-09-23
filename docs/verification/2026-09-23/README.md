# Verification record — 2026-09-23 (Task 5, Brand Standards 2.2 color pass)

Built from branch `hub` after Tasks 1–4 of the 2026-09-23 color pass (commits `2250db2..636688a`, 55 pages). Before building, `.astro`, `node_modules/.astro`, and `dist` were cleared so the remark-plugin output (Task 4's field-note/next-step plate wrapping) was fresh rather than served from Astro's content-layer cache — the same cache-staleness issue Task 4's fix round 1 diagnosed. Screenshots were captured against `npx astro preview --port 4321 --host 127.0.0.1` serving that clean `npm run build` output, verified byte-for-byte identical to `dist/index.html` before capture began. Night theme is forced per-page via the `?theme=night` query override in `src/layouts/Base.astro` (does not persist; used only for deterministic capture).

Both widths were captured with Playwright (`npx playwright@1.56.1 screenshot --browser=chromium --channel=chrome --viewport-size=<w>,<h> --full-page ...`) — `1280,900` for desktop, `390,1200` for phone — per the brief. Headless Chrome's own `--screenshot` flag was not used this round: as documented in the 2026-09-22 record, it clamps window width to ~500px on Windows regardless of the requested `--window-size`, corrupting narrow captures. Playwright honors the requested viewport at both widths.

## Screenshots

Naming: `<page>-<theme>-<width>.png`. 11 pages × 2 themes (day, night) × 2 widths (1280px desktop, 390px mobile) = 44 files.

| Page slug | Route |
|---|---|
| `hub` | `/` |
| `series` | `/shopping-center/` |
| `map` | `/shopping-center/map/` |
| `article-07` | `/shopping-center/07-reading-a-rent-roll/` |
| `article-36` | `/shopping-center/36-complete-property-management-checklist/` |
| `article-34` | `/shopping-center/34-otb-command/` |
| `article-38` | `/shopping-center/38-annual-operating-calendar/` |
| `field-notes` | `/field-notes/` |
| `desk-lease` | `/desk/lease/` |
| `operating-systems` | `/operating-systems/` |
| `about` | `/about/` |

Files (all 44 present; verified with a Node script reading each PNG's IHDR width at byte offset 16 — every `-1280.png` reports width 1280 and every `-390.png` reports width 390; none under 10 KB):

```
about-day-1280.png            about-day-390.png            about-night-1280.png          about-night-390.png
article-07-day-1280.png       article-07-day-390.png       article-07-night-1280.png     article-07-night-390.png
article-34-day-1280.png       article-34-day-390.png       article-34-night-1280.png     article-34-night-390.png
article-36-day-1280.png       article-36-day-390.png       article-36-night-1280.png     article-36-night-390.png
article-38-day-1280.png       article-38-day-390.png       article-38-night-1280.png     article-38-night-390.png
desk-lease-day-1280.png       desk-lease-day-390.png       desk-lease-night-1280.png     desk-lease-night-390.png
field-notes-day-1280.png      field-notes-day-390.png      field-notes-night-1280.png    field-notes-night-390.png
hub-day-1280.png              hub-day-390.png              hub-night-1280.png            hub-night-390.png
map-day-1280.png              map-day-390.png              map-night-1280.png            map-night-390.png
operating-systems-day-1280.png operating-systems-day-390.png operating-systems-night-1280.png operating-systems-night-390.png
series-day-1280.png           series-day-390.png           series-night-1280.png         series-night-390.png
```

## Checks

| Check | Result | Notes |
|---|---|---|
| Build gates | **PASS** | `npm run build` (after `rm -rf .astro node_modules/.astro dist`) → brand check: clean; content check: clean; 55 pages built in 2.08s; link check: 924 internal references resolve; redirect check: 127 legacy URLs resolve. All four gates print clean, matching the 2026-09-22 baseline exactly (no regressions from the color pass). |
| Test suite | **PASS — 22/22** | `npm test` → `node --test src/lib/*.test.ts src/lib/*.test.mjs scripts/*.test.mjs`: 22 passing, 0 failing, 0 skipped (includes the `inkClass` tests from Task 2 and the `remarkPlates` tests from Task 4). |
| Legacy-term scan | **PASS — clean** | `grep -rli -E "orange ocean\|groundwork\|atlas\|cypress command platform\|libertinus\|inter-variable" dist --include=*.html \| grep -v "35-why-otb-command"` → `clean` (article 35's OTB Command history mention correctly excluded). |
| Phone-width captures: Playwright viewport 390, full page | **PASS — 22/22** | `ls docs/verification/2026-09-23/*-390.png \| wc -l` = 22; PNG-width check (`readUInt32BE(16)` on each file) prints 390 for all 22 files. |
| Checklist persistence (article 36) | Verified by controller | Not capturable headlessly — a fresh Playwright page load per screenshot doesn't carry forward `localStorage` state set by a prior click. Controller verified item persistence across reload in a real browser. |
| Search hits | Verified by controller | Not exercised headlessly in this pass. |
| Theme persistence | Verified by controller | The `?theme=night` query override is a one-load forcing mechanism for deterministic capture, not itself proof of cross-navigation persistence; the controller confirmed `localStorage` `cc-theme` persistence in a real browser. |
| Phone-width overflow (390px, no horizontal scroll) | Verified by controller | Controller confirmed no horizontal scroll at 390px on the pages checked in a real browser, including the hero panel, card washes, and calendar widget introduced by this color pass. |

## What changed in Brand Standards 2.2

This pass brought color into the design system in concert, rather than as one-off accents. **Part inks** now run through the series: each of the 11 parts in the Shopping Center Operator Series carries a Terra/Olive/Mustard/Ink assignment (`src/content/series/shopping-center.json`), read via a shared `inkClass()` helper into the series map's flow stages and part sections, the series landing's part index, and every article's spine and plate rule — with a labeled `<InkLegend>` (Terra · Olive · Mustard · Ink swatches) placed under the map hero and above the series landing's part index so a reader can decode the color without guessing. **State washes** now distinguish collection cards on the hub: a published collection's card-head band reads olive, a coming-soon collection's reads mustard, keyed directly off each collection's `state` field rather than hand-picked per card. The hub's "Find an article" section sits in a **Terra band**. Article pages gained two new plate types from the remark pipeline: a **field-note plate** (`FIELD NOTE · ARNOULD BLVD`, ink wash) wraps each article's "The view from …" section (both H2 and H3 variants, after a fix round extended the match), and a **next-step plate** (`NEXT STEPS`, olive wash) wraps "The practical next step" — both auto-generated by a new `remarkPlates()` mdast transformer rather than hand-authored per article. The annual operating calendar (article 38) now inks its month buttons by quarter (Olive Q1 · Mustard Q2 · Terra Q3 · Ink Q4), with a caption spelling out the key and the detail panel's focus color following the selected month's quarter ink.

**Elevation** is deliberately singular: the hub's hero panel is the one `cc-surface-brand cc-elev-brand` treatment on the site, carrying the brand shadow token (`--cc-shadow-brand`); article pages stay flat under `cc-doc`, with no competing elevated surfaces to dilute the hero's weight. Collection and article cards pick up `cc-card-interactive` for a hover lift (`--cc-lift` transform plus `--cc-shadow-2`) rather than a shadow at rest.

**Motion** is token-driven and restrained: `cc-reveal` (a staggered rise-in, up to `data-delay="4"`) marks the hero panel and article plates; `cc-rule-draw` animates the plate's top rule in from the left; card lift is the `cc-card-interactive` hover/active transition described above. All three respect `prefers-reduced-motion: reduce` — the design system's media query zeroes animation and transition durations site-wide when it's set, verified in `design-system/components.css`.

The **footer stripe** — a four-swatch `cc-stripe` (Olive · Mustard · Terra · Ink) — now sits immediately above `site-footer` on every page, echoing the part-ink and quarter-ink palette used throughout the color pass as the site's closing mark.

Brand-check tokens: `scripts/check-brand.mjs`'s shadow rule was updated in Task 1 to allow `box-shadow: var(--cc-shadow-*)` (previously any non-`none` shadow value was flagged), so the new elevation tokens pass the check while raw shadow values are still caught.
