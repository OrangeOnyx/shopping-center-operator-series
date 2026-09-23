# Color Pass (Brand Standards 2.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the article hub up to Brand Standards rev. 2.2 ("color in concert, err toward more"; elevation; motion) so every surface carries meaningful color from the palette.

**Architecture:** Swap `design-system/` to the v2.2 files verbatim; loosen the brand check to allow token shadows; give series parts inks; add wash surfaces, a Cypress hero panel, card lift, a footer stripe, and article plates via a remark plugin. Article pages keep `cc-doc` (flat).

**Tech Stack:** Astro 7, the v2.2 tokens/components CSS, node:test. Branch `hub`, base 13d8225.

**Spec:** Approved in chat 2026-09-23 (the eight-item pass) on top of `docs/superpowers/specs/2026-09-22-article-hub-design.md`. Where this plan and the older spec disagree, this plan wins; it records the v2.2 rules.

## Global Constraints

- v2.2 source: `C:/Users/adam/AppData/Local/Temp/claude/C--Users-adam-Projects-article-series/3be76434-1b19-431e-86d1-29d3498fc74c/scratchpad/rebrand-v22/cypress-command-rebrand/design-system/` (re-extract `C:/Users/adam/Projects/CYPRESS COMMANDv1/cypress-command-rebrand-v2.2-final.zip` if missing). Copied verbatim; never edited.
- Under `src/`: no raw hex, no named font faces; `box-shadow` only as `var(--cc-shadow-1|2|3|brand)` or `none`.
- Inks and meanings: Terra = structural accent (eyebrows, links, active nav, primary CTA) and lifecycle stage ink; Olive = published / complete / "go"; Mustard = in progress / attention; Ink = operating layer / neutral category; Oxblood never appears. Washes are `var(--cc-wash-terra|olive|mustard|ink)`.
- Part inks rotate across the eight lifecycle parts: I terra, II olive, III mustard, IV ink, V terra, VI olive, VII mustard, VIII ink; parts IX–XI (operating layer) are ink. Every colored element is labeled (legend, tag text, or heading).
- Elevation only outside `.cc-doc` pages (article pages stay flat). Never shadow text, the mark, tags, or buttons at rest. One brand shadow per page (the hub hero).
- Motion: `cc-reveal` on load for hero and plates, `cc-rule-draw` on plate top rules, `cc-card-interactive` lift on cards; nothing on the mark; reduced motion honored by the tokens.
- Radius: 2px documents, 4px UI. Hairlines stay on elevated objects.
- All gates (`npm run build`) and `npm test` stay green. Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Never push `main`.

---

### Task 1: Design system v2.2 and brand-check update

**Files:** replace `design-system/tokens.css`, `components.css`, `tokens.json`, `tailwind.preset.js`; modify `scripts/check-brand.mjs`, `scripts/check-brand.test.mjs`.

- [ ] Copy the four files from the v2.2 source over `design-system/` (logos are identical; leave them). Verify with `cmp` against the source and `grep -c "cc-shadow-brand" design-system/tokens.css` ≥ 1.
- [ ] Change the SHADOW regex to allow token shadows: `const SHADOW = /box-shadow\s*:\s*(?!\s*(?:none\b|var\(--cc-shadow-))[^;]+/g;`
- [ ] Extend the first test: add `{ path: 'e.css', text: 'box-shadow: var(--cc-shadow-2); box-shadow:var(--cc-shadow-brand);' }` (must not flag) and keep the total assertion at 4. Run `node --test scripts/check-brand.test.mjs` → 2 passing.
- [ ] `npm run build` green. Commit: `Design system v2.2: elevation and motion tokens; brand check allows token shadows`.

### Task 2: Part inks and the legend

**Files:** modify `src/content.config.ts` (parts get `ink`), `src/content/series/shopping-center.json`, `src/lib/articles.ts` (+test), `src/components/PartIndex.astro`, `src/components/ArticleHead.astro`, `src/pages/[collection]/map.astro`, `src/pages/[collection]/[slug].astro`, `src/styles/site.css`; create `src/components/InkLegend.astro`.

- [ ] Schema: `parts` items gain `ink: z.enum(['terra','olive','mustard','ink']).default('ink')`. Manifest: add `"ink"` per part: I terra, II olive, III mustard, IV ink, V terra, VI olive, VII mustard, VIII ink, IX ink, X ink, XI ink.
- [ ] `src/lib/articles.ts`: add `export function inkClass(ink: string | undefined): string { return 'ink-' + (ink && ['terra','olive','mustard','ink'].includes(ink) ? ink : 'ink'); }` with a test (`inkClass('olive') === 'ink-olive'`, `inkClass(undefined) === 'ink-ink'`, `inkClass('oxblood') === 'ink-ink'`).
- [ ] CSS (append under a `/* Inks */` marker): `.ink-terra { --part-ink: var(--cc-terra); --part-wash: var(--cc-wash-terra); } .ink-olive { --part-ink: var(--cc-olive); --part-wash: var(--cc-wash-olive); } .ink-mustard { --part-ink: var(--cc-mustard); --part-wash: var(--cc-wash-mustard); } .ink-ink { --part-ink: var(--cc-fg); --part-wash: var(--cc-wash-ink); }` and `.spine { border-left: 3px solid var(--part-ink, var(--cc-accent)); padding-left: var(--cc-space-4); }`. Section heads and flow stages read `var(--part-ink)`: `.section-head.inked { border-top-color: var(--part-ink); } .section-head.inked .num { color: var(--part-ink); } .flow-stage { border-top-color: var(--part-ink, var(--cc-accent)); background: var(--part-wash, transparent); } .part-head { background: var(--part-wash); }`.
- [ ] `InkLegend.astro`: a `tag-row` of four `cc-tag`-styled spans, each with a 10px square swatch (`background: var(--part-ink)` via the ink class) and its label: "Terra — stages I, V", "Olive — stages II, VI", "Mustard — stages III, VII", "Ink — stages IV, VIII and the operating layer". Props: none. Place it under the map hero and above the series landing's part index.
- [ ] PartIndex: each `.part-section` gets `class={`section part-section ${inkClass(g.part.ink)}`}` and its head gets `section-head part-head inked`. Map: each `.flow-stage` and part block gets `inkClass(g.part.ink)`; add `<InkLegend />` after the map deck. Landing: add `<InkLegend />` above `<PartIndex>`.
- [ ] ArticleHead: accept a new prop `ink?: string`; wrap the title block (eyebrow, h1, deck, meta) in `<div class={`spine ${inkClass(ink)}`}>`; the Plate's top rule reads the part ink: add `style="--cc-plate-ink: var(--part-ink)"` on the plate wrapper and change `.plate { border-top-color: var(--cc-plate-ink, var(--cc-accent)); }`. The article route passes `ink={series.data.parts.find((p) => p.name === partName(d.part))?.ink}`.
- [ ] Build; check `grep -o 'class="[^"]*ink-olive[^"]*"' dist/shopping-center/07-reading-a-rent-roll/index.html | head -1` shows the spine (part II Acquiring = olive) and `dist/shopping-center/map/index.html` has 11 `flow-stage` elements with ink classes and one legend. Brand check clean. Commit: `Part inks across map, landing, and article heads with a labeled legend`.

### Task 3: Hub hero panel, card washes and lift, section bands, Terra CTAs, footer stripe

**Files:** modify `src/pages/index.astro`, `src/components/CollectionCard.astro`, `src/components/ArticleCard.astro`, `src/components/Footer.astro`, `src/components/Search.astro` (no change needed), `src/styles/site.css`.

- [ ] Hub hero: replace the `page-head hub-head` header with a section `<section class="hero-band"><div class="wrap"><div class="hero-panel cc-surface-brand cc-elev-brand cc-reveal">…</div></div></section>`; inside: `cc-eyebrow` "Cypress Command · Articles", `h1.display`, `p.deck`, actions with `btn btn-accent` primary ("Browse the collections") and `btn btn-outline-paper` secondary. CSS: `.hero-band { padding: var(--cc-space-8) 0 0; } .hero-panel { padding: var(--cc-space-12) var(--cc-space-8); border-radius: var(--cc-radius-ui); border: var(--cc-hairline) solid var(--cc-border); } .hero-panel .display, .hero-panel .deck { color: var(--cc-on-brand); } .hero-panel .deck { opacity: .92; } .btn-accent { background: var(--cc-accent); color: var(--cc-accent-fg); border-color: var(--cc-accent); } .btn-outline-paper { background: transparent; color: var(--cc-on-brand); border-color: var(--cc-on-brand); }`. On narrow screens padding drops to `var(--cc-space-6) var(--cc-space-4)`.
- [ ] Primary CTAs elsewhere (series landing "Browse the series", publisher band button stays paper-outline): `.btn-primary` becomes Terra: `background: var(--cc-accent); color: var(--cc-accent-fg); border-color: var(--cc-accent)`; hover `filter: brightness(1.08)`.
- [ ] CollectionCard: add `cc-card-interactive` and a head band: wrap the tag-row in `<div class={`card-head ${s.state === 'published' ? 'wash-olive' : 'wash-mustard'}`}>`. CSS: `.card-head { margin: calc(-1 * var(--cc-space-4)) calc(-1 * var(--cc-space-4)) var(--cc-space-3); padding: var(--cc-space-3) var(--cc-space-4); border-bottom: var(--cc-hairline) solid var(--cc-border); } .wash-olive { background: var(--cc-wash-olive); } .wash-mustard { background: var(--cc-wash-mustard); } .wash-terra { background: var(--cc-wash-terra); } .wash-ink { background: var(--cc-wash-ink); }`. ArticleCard gets `cc-card-interactive` too.
- [ ] Section band: the hub's "Find an article" section gets class `section band wash-terra` and full-bleed background (`.band { background: var(--part-wash, var(--cc-wash-terra)); border-top: var(--cc-hairline) solid var(--cc-border); border-bottom: var(--cc-hairline) solid var(--cc-border); }`); the desk chips line reads "Or browse by desk (a desk is a category, not a status):".
- [ ] Footer stripe: in `Footer.astro` add `<div class="cc-stripe" aria-hidden="true"><span></span><span></span><span></span><span></span></div>` before `<footer>`; the footer background becomes Paper Deep (`.site-footer { background: var(--cc-bg-elev); border-top: 0; }`).
- [ ] Build; `node scripts/check-brand.mjs` clean; `grep -c 'cc-elev-brand' dist/index.html` = 1; `grep -o 'wash-olive\|wash-mustard' dist/index.html | sort | uniq -c` shows 2 olive and 4 mustard; `grep -c 'cc-stripe' dist/index.html` = 1. Commit: `Hub: Cypress hero panel with brand elevation, state-washed collection cards with lift, Terra band, footer stripe`.

### Task 4: Article surfaces and widget inks

**Files:** modify `src/lib/remark-article.mjs`, `astro.config.mjs`, `src/styles/site.css`, `src/scripts/widgets/ai-map.js`, `src/scripts/widgets/calendar.js`, `src/components/Plate.astro`.

- [ ] Remark plugin `remarkPlates`: walk top-level nodes; when an H3 heading text starts with "The view from" (case-insensitive), wrap it and the following siblings up to the next heading (depth ≤ 3) in an `html` node pair: open `<aside class="plate-note wash-ink"><span class="plate-label">FIELD NOTE · ARNOULD BLVD</span>` and close `</aside>`. When an H2 heading text equals "The practical next step", wrap it and its following siblings until the next H2 (or end) in `<aside class="plate-note wash-olive next-step"><span class="plate-label">NEXT STEPS</span>` … `</aside>`. Register it after the two existing plugins in `astro.config.mjs`. Add a node:test in `src/lib/remark-article.test.mjs` using a hand-built mdast (heading + two paragraphs + heading) asserting the html nodes are inserted at the right indexes.
- [ ] CSS: `.plate-note { margin: var(--cc-space-8) 0; padding: var(--cc-space-4) var(--cc-space-6); border: var(--cc-hairline) solid var(--cc-border); border-top: var(--cc-plate-rule) solid var(--cc-fg); border-radius: var(--cc-radius-doc); } .plate-note.wash-olive { border-top-color: var(--cc-olive); } .plate-note .plate-label { color: inherit; } .plate-note.wash-olive .plate-label { color: var(--cc-olive); } .plate-note h2, .plate-note h3 { margin-top: var(--cc-space-2); border-top: 0; padding-top: 0; } .prose blockquote { background: var(--cc-bg-elev); padding: var(--cc-space-4) var(--cc-space-6); border-radius: var(--cc-radius-doc); }`.
- [ ] Plate: add `cc-reveal` to the figure and `cc-rule-draw` via a pseudo-element is not possible on a border; instead give the plate top rule as an inner `<span class="plate-rule cc-rule-draw" aria-hidden="true"></span>` (`.plate-rule { display:block; height: var(--cc-plate-rule); background: var(--cc-plate-ink, var(--cc-accent)); margin: calc(-1 * var(--cc-space-3)) calc(-1 * var(--cc-space-3)) var(--cc-space-3); }`) and set `.plate { border-top: var(--cc-hairline) solid var(--cc-border); }`.
- [ ] Widgets: ai-map "helps" column tag → `cc-tag-success`, "humans" → `cc-tag-ink` (both labeled by their text). Calendar months get a quarter ink: months 0–2 `ink-olive`, 3–5 `ink-mustard`, 6–8 `ink-terra`, 9–11 `ink-ink`; `.cal-month.active { border-top-color: var(--part-ink); background: var(--part-wash); }` and the detail focus line colored `var(--part-ink)`; add a one-line legend under the calendar head: "Quarters: Olive Q1 · Mustard Q2 · Terra Q3 · Ink Q4".
- [ ] Build; `grep -c 'plate-note wash-olive' dist/shopping-center/07-reading-a-rent-roll/index.html` = 1 and `grep -c 'FIELD NOTE · ARNOULD BLVD' dist/shopping-center/07-reading-a-rent-roll/index.html` ≥ 1 (article 07 has a "view from Arnould Blvd" section; if a given article lacks it, that count is 0 for that article only); brand check clean; `npm test` green. Commit: `Article plates for field notes and next steps, Paper Deep quotes, quarter inks on the calendar, AI-map state tags`.

### Task 5: Verification and preview

- [ ] `npm run build`, `npm test`. Recapture the 44 screenshots with Playwright (both widths; `--viewport-size=1280,900` for desktop and `390,1200` for phone, `--full-page`, `?theme=night` for night) into `docs/verification/2026-09-23/`; write its README with the same checks table and a "What changed in 2.2" paragraph. Legacy-term scan clean. Commit `Verification for the 2.2 color pass`; push `hub`.
- [ ] Controller: verify the preview in the browser (hero panel, card washes, map inks, an article's plates, night mode, phone width overflow 0).
