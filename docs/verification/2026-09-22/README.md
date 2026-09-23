# Verification record — 2026-09-22 (Task 14)

Built from branch `hub` after 13 feature tasks (55 pages). Screenshots captured headlessly against `npx astro preview --port 4321 --host 127.0.0.1` serving a fresh `npm run build` output. Night theme is forced per-page via the `?theme=night` query override added to `src/layouts/Base.astro` for this task (does not persist; used only to capture the night screenshots deterministically).

The 1280px desktop set was captured with headless Chrome (`--headless=new --window-size=1280,2400 --screenshot=...`). The 390px phone set was recaptured with Playwright (`npx playwright@1.56.1 screenshot --browser=chromium --channel=chrome --viewport-size=390,1200 --full-page ...`) after fix-round 1: headless Chrome on Windows enforces a minimum window width of roughly 500px, so the original `--window-size=390,...` Chrome captures actually laid the page out at ~500px and the resulting PNG was cropped down to 390px wide — the hub capture was missing its masthead nav entirely and article-36's headline was cut mid-word. Playwright honors the requested viewport, so the 390 set now reflects the page's real rendering at 390px.

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

Files (all present, all > 10 KB, verified with `ls | wc -l` = 44 and `find -size -10k` = empty):

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

Note on article 36 (`/shopping-center/36-complete-property-management-checklist/`): the brief calls for ticking 3 checklist items and reloading before capture. That interaction cannot be done headlessly (headless Chrome is a fresh, non-persistent page load each invocation, and localStorage state set by a click can't be carried into a separate `--screenshot` invocation). This was **not** attempted headlessly — the checklist-persistence behavior was verified by the controller in a real browser instead (see checks table below). The article-36 screenshots here show the page in its default (unchecked) state.

## Checks

| Check | Result | Notes |
|---|---|---|
| Build gates | **PASS** | `npm run build` → brand check: clean; content check: clean; 55 pages built in 1.15s; link check: 924 internal references resolve; redirect check: 127 legacy URLs resolve (updated in fix round 2 — `vercel.json` gained trailing-slash-form rules for `/article/` and `/map/` since Vercel's `trailingSlash: true` normalizes bare `/article` and `/map` to their slashed form with a 308 before evaluating `redirects`). |
| Legacy-term scan | **PASS — clean** | `grep -rli -E "orange ocean\|groundwork\|atlas\|cypress command platform\|libertinus\|inter-variable" dist --include=*.html \| grep -v "35-why-otb-command"` → `clean` (article 35 correctly excluded as its OTB Command history mention is legitimate). |
| Checklist persistence (article 36) | Verified by controller in browser | 3 of 39 items persisted after reload. Not captured headlessly — see note above. |
| Search hits | Verified by controller | Not exercised headlessly in this pass. |
| Theme persistence | Verified by controller | The `?theme=night` query override added for this task's screenshots is a one-load forcing mechanism and does not itself demonstrate cross-navigation persistence; the controller confirmed persistence (via `localStorage` `cc-theme`) in a real browser. |
| Phone-width overflow (390px, no horizontal scroll) | Verified by controller | Not measured directly in this pass; controller confirmed no horizontal scroll at 390px in a real browser on the pages checked. |
| Phone-width captures: Playwright viewport 390, full page | **PASS — 22/22** | `ls docs/verification/2026-09-22/*-390.png \| wc -l` = 22; PNG-width check (`readUInt32BE(16)` on each file) prints 390 for all 22 files, including `article-07-day-390.png` and `article-07-night-390.png` (recaptured in fix round 2, see below). |

## Code change accompanying this record

`src/layouts/Base.astro` — added a one-load theme override to the inline boot script so a page can be forced into `day` or `night` via `?theme=night` / `?theme=day` for deterministic screenshot capture, without persisting to `localStorage`:

```js
var q = new URLSearchParams(location.search).get('theme');
if (q === 'night' || q === 'day') t = q;
```

Production and the default (no query param) behavior are unaffected.

## Fix round 2 (2026-09-22) — redirect trailing-slash gap and article-07 table overflow

`vercel.json`: added trailing-slash-form redirect rules for `/article/` (both the `id`-query and plain forms) and `/map/`, because Vercel's `trailingSlash: true` normalizes bare `/article` and `/map` to their slashed form with a 308 *before* evaluating `redirects`, so the un-slashed sources never matched on the live preview. `scripts/check-redirects.mjs` and `scripts/check-redirects.test.mjs` updated to cover the new forms; the CLI case count is now 40 × 3 + 7 = 127.

`src/styles/site.css`: `.prose table` gained `display: block; overflow-x: auto;` so a wide table scrolls within its own box instead of forcing the page wider. That alone was not sufficient — the article-07 table still forced the page to 580px because `.article-layout`'s mobile media query (`@media (max-width: 1023px) { .article-layout { grid-template-columns: 1fr; ... } }`) used a bare `1fr` track, and a CSS grid item's default `min-width: auto` equals its min-content size, so the `article` grid item (holding the table) wouldn't shrink below the table's min-content width and overflowed its track. The desktop rule already guards against exactly this (`grid-template-columns: minmax(0, 1fr) 260px`); the mobile override just needed the same `minmax(0, ...)` guard, so it now reads `grid-template-columns: minmax(0, 1fr);`. Verified with a headless-Chrome probe (via Playwright) that `document.documentElement.scrollWidth` is 390 at a 390px viewport post-fix (580 pre-fix), and the table itself now reports `scrollWidth: 580` / `clientWidth: 390` (i.e., it scrolls internally, as intended) rather than the whole page growing.
