---
name: Cypress Command Articles
description: Operator-grade publication hub on Brand Standards 2.3; paper, four category inks, line-drawn plates.
colors:
  paper: "#F4EFE2"
  paper-deep: "#EAE2CD"
  ink: "#1E1B16"
  ink-soft: "#5C554A"
  rule: "#C9BFA8"
  cypress: "#1E4D3A"
  terra: "#A44E12"
  olive: "#49573C"
  mustard: "#8F6D0C"
  muscadine: "#5A3B5C"
  terra-light: "#C7681D"
  mustard-light: "#D9A419"
  olive-light: "#5A6B4A"
  on-brand-accent: "#D2802F"
typography:
  display:
    fontFamily: "Besley, Fraunces, Georgia, Times New Roman, serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: "60px"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Besley, Fraunces, Georgia, Times New Roman, serif"
    fontSize: "40px"
    fontWeight: 900
    lineHeight: "44px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Besley, Fraunces, Georgia, Times New Roman, serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "32px"
    letterSpacing: "-0.01em"
  subhead:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "26px"
  deck:
    fontFamily: "Besley, Fraunces, Georgia, Times New Roman, serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "30px"
  body-doc:
    fontFamily: "Besley, Fraunces, Georgia, Times New Roman, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "26px"
  body:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  block-numeral:
    fontFamily: "Besley, Fraunces, Georgia, Times New Roman, serif"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: "32px"
    letterSpacing: "-0.03em"
  block-name:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: "23px"
  label:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: "14px"
    letterSpacing: "0.06em"
  meta:
    fontFamily: "Courier Prime, JetBrains Mono, Courier New, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "17px"
rounded:
  doc: "2px"
  ui: "4px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.terra}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.ui}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ui}"
    padding: "10px 18px"
  button-secondary-hover:
    backgroundColor: "{colors.paper-deep}"
  tag-published:
    textColor: "{colors.olive}"
    typography: "{typography.label}"
    rounded: "{rounded.ui}"
    padding: "4px 8px"
  tag-in-progress:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.ui}"
    padding: "4px 8px"
  tag-neutral:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.ui}"
    padding: "4px 8px"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.ui}"
    padding: "16px"
  ink-block-tile:
    textColor: "{colors.paper}"
    typography: "{typography.block-name}"
    rounded: "{rounded.doc}"
    padding: "12px 16px 16px"
  input-search:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ui}"
    padding: "11px 14px 11px 40px"
  plate:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.doc}"
    padding: "12px"
---

# Design System: Cypress Command Articles

**Canonical token source:** `design-system/` (Brand Standards 2.3, ratified 2026-09-25: `tokens.css`, `tokens.json`, `components.css`, `tailwind.preset.js`, `logo/`). It is copied verbatim and never edited. The frontmatter above mirrors the day values of the tokens this site actually uses; when they disagree, `design-system/tokens.css` wins. Site rules live in `src/styles/site.css` and reference `var(--cc-*)` tokens only.

## Overview

**Creative North Star: "The Inked Plate"**

The hub reads like an operator's bound reference: warm paper, one near-black ink, hairline rules, and numbered plates whose line drawings ink in once as the page opens. Color is a filing system, not decoration. Four category inks mark the parts of a series, Ink marks the operating layer, and Olive and Mustard double as published and in-progress states. Everything else stays on paper.

Two densities share one system. Article pages are documents (`body.cc-doc`): flat, long-measure Besley prose, a contents rail, no shadows, no lift. The hub, collection landings, desks and map are the index: they may carry the Cypress surface, solid ink blocks, the brand shadow and hover lift. The home hero holds the site's single authored motion sequence, a survey traverse of the flagship center's recorded plat.

**Key Characteristics:**
- Paper ground, Ink text, Terra for links, focus, primary action and the default plate ink.
- Category inks rotate Terra, Olive, Mustard, Muscadine across parts; Ink is the operating layer.
- Solid ink blocks carry large type only, in the page-ground color.
- Hairline borders and 2px/4px corners; heavy 2px Ink rules open sections.
- Fourteen hand-authored line drawings plus one traced survey plate, colored by role classes.
- Motion is brief and token-timed; reduced motion removes all of it.

## Colors

A warm paper-and-ink palette where every non-neutral hue carries a meaning (definitions: `design-system/tokens.css`).

### Primary
- **Terra** (`--cc-terra`, alias `--cc-accent`, `--cc-focus`): links, primary buttons, focus ring, reading-progress bar, contents-rail marker, list markers, blockquote and disclaimer rules, plate labels, hover color for titles. Also category ink for Parts I and V. Its wash (`--cc-wash-terra`) grounds the "Find an article" band and is the default plate-drawing ground.

### Secondary (category inks)
- **Olive** (`--cc-olive`, alias `--cc-success`): Parts II and VI; the Field Notes lane (article heads, rows); published state tag; checked checklist boxes and widget progress fill; the "practical next step" plate.
- **Mustard** (`--cc-mustard`, alias `--cc-warning`): Parts III and VII; in-progress state (tag dot and border); the "Series in progress" hero tile.
- **Muscadine** (`--cc-muscadine`): Parts IV and VIII. Category ink only: no state, no risk, no emphasis (tokens.css comment).

### Tertiary
- **Cypress** (`--cc-cypress`, alias `--cc-surface-brand`): master-brand surface only. Used twice: the home hero panel and the publisher band. Text on it is `--cc-on-brand` (pinned to day Paper, so it stays light at night) with **Cypress Glow** (`--cc-on-brand-accent`) for accents. The light variants (terra-, mustard-, olive-light) appear only inside the hero drawing on Cypress.

### Neutral
- **Paper** (`--cc-bg`): page ground; also the text color on solid ink blocks.
- **Paper Deep** (`--cc-bg-elev`): footer, blockquotes, disclaimer, code, widget section heads, active sheet tab, illustration fills.
- **Ink** (`--cc-fg`): text, 2px section and table rules, secondary-button border, and the operating-layer category ink (Parts IX–XI).
- **Ink Soft** (`--cc-fg-muted`): decks on rows and cards, meta, breadcrumbs, labels, hairline strokes in drawings.
- **Rule** (`--cc-border`): every 1px hairline.
- Washes (`--cc-wash-*`, 6–16% alpha) tint part heads, tile feet, row hover (`--cc-wash-ink`) and drawing grounds.

### Named Rules
**The Four Inks Rule.** Parts of a series rotate Terra, Olive, Mustard, Muscadine in that order (I/V, II/VI, III/VII, IV/VIII). The ink is applied through a scope class (`.ink-terra|olive|mustard|muscadine|ink`) that sets `--part-ink` and `--part-wash`; components read those variables, never a hue directly. Collection cards rotate the same four by series `order`; desk tiles wear the ink of the part they map to.

**The Operating Layer Rule.** Parts that feed every stage rather than sit in the lifecycle (Field Notes, AI & Operating Systems, Tools & Checklists) take Ink, not a category hue. The map splits "asset lifecycle" from "operating layer" on exactly this test.

**The Two-Meaning Rule.** Olive and Mustard also mean published and in-progress. Keep the state tags beside, never replacing, the part ink.

**The No Oxblood Rule.** Oxblood (`--cc-oxblood`, critical/refusal) never appears on this site: no critical tags, no oxblood ink; `inkClass('oxblood')` falls back to Ink (tested in `src/lib/articles.test.ts`).

**The Mustard Floor Rule.** Mustard text only at 14px 700 or larger. The design system's own 11px warning tag breaks this, so the site overrides it: Ink text, Mustard dot and Mustard border (`.cc-tag-warning` in `site.css`).

## Typography

**Display Font:** Besley (fallback Fraunces, Georgia, serif), weights 400, 400 italic, 700, 900
**Body/UI Font:** Archivo (fallback Inter, system-ui), weights 400, 500, 700, 800
**Mono Font:** Courier Prime (fallback JetBrains Mono, Courier New), weights 400, 700

All three are self-hosted via Fontsource imports in `src/layouts/Base.astro`; there is no font network request. Families are referenced only through `--cc-font-display|sans|mono`.

**Character:** A heavy Clarendon-style serif for anything a reader should remember, a plain grotesque for anything they operate, and a typewriter mono for filing data.

### Hierarchy
- **Display** (Besley 900, 56/60, -0.02em; 40/44 under 768px): home hero headline only.
- **Headline** (Besley 900, 40/44; 32/36 mobile): every page H1, including article titles.
- **Title** (Besley 700, 28/32; 24/30 mobile): H2 in prose, publisher band.
- **Subhead** (Archivo 700, 20/26): H3.
- **Deck** (Besley 400, 20/30; 18/27 mobile, max 40em): standfirst under every H1.
- **Body-doc** (Besley 400, 17/26, 70ch measure): article prose. Blockquotes Besley italic 22/30.
- **Body** (Archivo 400, 16/24): hub and UI text; row and card decks Archivo 14/21 in Ink Soft.
- **Row / card / pager titles** (Besley 700, 18–20px); **numerals** (Besley 900, -0.03em; 22px rows, 30px blocks, 40px hero tiles, 64px sheet explorer).
- **Label** (Archivo 700, 11px, uppercase, tracked): tags, table heads, section-head titles at 13px.
- **Meta** (Courier Prime 12/17, sometimes 10–11px uppercase tracked): bylines, dates, read time, breadcrumbs, plate labels, pager labels, counts.

### Named Rules
**The Serif Remembers Rule.** Titles, numerals, decks and article prose are Besley; controls, labels and UI copy are Archivo; data about an item (date, time, count, plate number) is Courier Prime.

## Layout

- **Container:** `.wrap`, max 1200px (`--cc-max-width`), 16px side padding, 24px (`--cc-gutter`) from 768px.
- **Rhythm:** tokens `--cc-space-1…16` (4–64px). Sections pad 48px top and bottom; adjacent sections divide with a hairline. Page heads pad 48px/32px.
- **Section head:** 2px Ink top rule, hairline bottom, number + uppercase title + right-aligned mono count. When inked, the rule and number take the part ink; in the part index the number becomes a solid ink chip.
- **Rows:** 48px numeral column, title/deck, right-aligned meta; collapse to 40px + stacked meta under 600px.
- **Cards and tiles:** `repeat(auto-fill, minmax(280px, 1fr))` for cards, 160px for part tiles, 170px for desk tiles, 12–24px gaps.
- **Article:** prose column + 260px sticky contents rail, 64px gap; rail hidden under 1024px. Plates are 21:9; pager is a two-up grid that stacks under 700px.
- **Hub hero:** Cypress panel, two columns (text | survey drawing, 1.05fr/1fr), stacking under 900px; three hero tiles span the full width, one column under 600px.
- **Breakpoints in use:** 600, 700, 768 (767 max), 800, 900, 1024 (1023 max).

## Elevation & Depth

Hybrid, split by surface. Depth on paper comes from hairlines, washes and Paper Deep, not shadows. Shadows exist only as tokens (`--cc-shadow-1|2|brand`) and only on the index surfaces. `body.cc-doc` redefines every shadow token to `none`, so article pages are flat even if a component asks for elevation. The build gate rejects any `box-shadow` that is not `none` or a `--cc-shadow-*` token.

### Shadow Vocabulary
- **Raised** (`--cc-shadow-2`): hover on part and desk tiles and on interactive cards, with a -2px lift (`--cc-lift`).
- **Rest** (`--cc-shadow-1`): the `:active` press state of the same tiles.
- **Brand** (`--cc-shadow-brand`): the home hero panel lifting off paper; one per page.

### Named Rules
**The Flat Document Rule.** Article pages (`cc-doc`) never lift, cast or float. Elevation and hover lift belong to the hub and landings.

## Shapes

Two radii only: 2px (`--cc-radius-doc`) for document things (plates, notes, blocks in docs, checkboxes, part bands, numeral chips, part tiles) and 4px (`--cc-radius-ui`) for UI things (buttons, tags, inputs, cards, hero panel, hero tiles, theme toggle). Borders are 1px Rule hairlines; emphasis borders are 2px Ink (section heads, tables, widget frames) or 3px plate rules (`--cc-plate-rule`) in the part ink across the top of plates, flow stages and card heads. Left rules (3px) mark spines, blockquotes and the disclaimer. No pills, no circles except tag dots.

## Components

### Buttons
- **Shape:** gently squared (4px).
- **Primary:** Terra fill, Paper text, Archivo 700 14/20, 10px 18px. Hover brightens 8%. (Site `.btn-primary` equals the design system's `cc-btn-accent`; the design system's Ink `cc-btn-primary` is not used.)
- **Secondary:** Paper fill, Ink text, 1px Ink border; hover Paper Deep. On Cypress it turns transparent with on-brand text and border.
- **Small:** 6px 12px, 12px text.

### Chips (tags)
- **Style:** design-system `cc-tag`: Archivo 700 11px uppercase, 1px border in text color, 6px dot, wash ground.
- **States:** Published = Olive (`cc-tag-success`); In progress = Ink text, Mustard dot and border (site override); Interactive = Terra; desks = neutral Ink Soft. Ink-legend tags replace the dot with a 10px square swatch of the part ink.

### Cards / Containers
- **Corner Style:** 4px. **Background:** Paper, hairline border, 16px padding.
- **Collection card:** solid ink head (numeral + "Series"/"Lane"), then the collection drawing on the part wash, state tag, Besley title, deck, mono count. Interactive (lift + Raised shadow).
- **Article card:** 3px Terra top rule, mono index label, Besley title, deck, mono read time.
- **Plate:** 2px corners, hairline border, 3px top rule in the plate ink, mono uppercase label ("PLATE 04 · LEASING"), 21:9 image or drawing on the part wash, Besley 900 13px caption ending "Illustrative drawing."
- **Plate note:** field-note and next-step panels in prose; 3px Ink top rule, Olive for the next step.

### Solid ink blocks
Part tiles, desk tiles, collection-card heads, hero tiles, the article part band, part-index chips and related-row numerals fill with `--part-ink` and set text in `--cc-bg`. Type on a block is 19px 700 or larger (numerals 22–40px 900). Because text is the page-ground color, blocks read light-on-dark by day and dark-on-light by night. Small labels (counts, desk blurbs) sit on the wash foot below the block, never on the block.

### Inputs / Fields
- **Search:** Archivo 15/20, hairline border, 4px, 16px Ink Soft search glyph inset left. Results drop in a hairline list; hover `--cc-wash-ink`. Focus uses the global 2px Terra outline, offset 2px.
- **Checklist checkbox:** 20px, 2px Ink border, 2px corner; checked fills Olive with a Paper tick.

### Navigation
- **Masthead:** sticky, Paper, hairline bottom, 64px min height. Lockup (28px) with a mono tagline; Archivo 500 14px links, Terra and 700 when current; 40px square theme toggle (moon/sun inline SVG). Under 768px only the lockup and toggle remain.
- **Breadcrumb:** mono 12px Ink Soft with "·" separators.
- **Contents rail:** hairline left edge, Archivo 13px links, one 2px Terra marker sliding to the active heading.
- **Pager:** 2px Ink top rule, mono label, Besley 700 title.
- **Footer:** the design system's four-color stripe (Olive, Mustard, Terra, Ink) above a Paper Deep footer with a Besley italic sign-off.

### Line illustrations (signature)
`src/lib/illustrations.ts` holds 14 hand-authored drawings in one 840×300 frame (owning, acquiring, financing, leasing, operating, financial, marketing, selling, fieldnotes, systems, checklists, contracts, portfolio, governed) plus `survey`, traced from the recorded plat (`src/lib/survey-geometry.ts`, viewBox 40 50 1360 660). Each is picked by part name, else by collection. No colors live in the SVG; role classes map to tokens in `site.css`:
- `k` Ink stroke (`heavy` ×3.5), `t` Ink Soft hairline (×0.6), `a` plate-ink accent (×1.4), `dash` dashed.
- `o` / `m` / `tr` Olive / Mustard / Terra strokes; `wo|wm|wt|wi` 24% washes; `fo|fm|ft` solids; `f` Paper Deep fill, `w` plate wash, `af` plate-ink solid.
- Meaning inside a drawing: Olive = done or healthy, Mustard = needs attention, Terra = structure, plate ink = the part's subject. Oxblood never.
- Stroke width is `--sw` (2 in plates, 3 in cards, 2.6 on Cypress, 4–4.5 for the survey). On Cypress, every role remaps to on-brand, Cypress Glow and the light variants.
- Drawings are illustrative: kinds of things, never facts about a specific property (survey labels carry only public-record facts).

### Motion
All durations and easings come from tokens (`--cc-dur-fast 120ms`, `base 200ms`, `slow 320ms`, `reveal 560ms`; `--cc-ease-standard|emphasized|exit`).
- **Ink-in:** every stroke gets `pathLength="1"` and draws via `stroke-dashoffset` over 560ms, staggered by group step `--s` (120ms lead, 80ms per step); fills, dashes and text fade in 240ms after their step. Only drawings rendered with `animate` (plates and the hero survey) and only if on screen at parse time get `.is-drawing`; card drawings never animate. It runs once per load.
- **Plate entrance:** `cc-reveal` rise (8px, 560ms) with the plate rule drawn by `cc-rule-draw`.
- **Survey traverse (the one authored sequence, hero only):** street, then the boundary walked corner to corner in 1000ms linear with a monument set at each turn (`illo-set`, 200ms), then buildings, stalls, liquor line and the 324/344 count; 300ms steps, 640ms strokes, about 1.9s total, under `--cc-dur-sequence-max` (2000ms). It is the approved exception to the 560ms ceiling.
- **Carry:** cross-document view transitions. Old page fades out (200ms, exit ease), new page rises 8px (320ms, emphasized). The masthead holds still; the clicked row or card title morphs into the article H1 (`article-title`) and back.
- **State:** part sections and checklist sections open by `grid-template-rows` (320ms); caret rotates (200ms); checks draw by clip-path (200ms); progress bars scale; the rail marker slides (200ms); tiles lift (120ms).
- **Reduced motion:** tokens zero every duration, rise and lift; the draw script skips `.is-drawing`; drawing and check animations are forced off; view transitions are disabled; design-system reveals and all transitions are removed.

### Night theme
`[data-theme="night"]` on `<html>` swaps the token values (dark Paper, light Ink, brighter inks and washes, black-based shadows; see `tokens.css`). An inline head script sets it before paint: `localStorage['cc-theme']`, else `prefers-color-scheme`, overridden for one load by `?theme=night|day` (not persisted). The masthead toggle flips and persists `cc-theme`. Text on Cypress stays Paper at night.

### Build gate
`npm run build` runs `scripts/check-brand.mjs` over `src/` (`.astro/.css/.ts/.js/.mjs`, SVG and JSON exempt): it fails on any raw hex color, any `font-family` naming a face directly (Besley, Archivo, Courier, Inter, Georgia, generic families…), and any `box-shadow` other than `none` or `var(--cc-shadow-1|2|3|brand)`. Content, link and redirect gates follow.

## Do's and Don'ts

### Do:
- **Do** reference `var(--cc-*)` tokens for every color, font, shadow, radius and duration; add new rules to `site.css`, never to `design-system/`.
- **Do** color by scope: wrap a part in `.ink-<name>` and read `--part-ink` / `--part-wash`.
- **Do** keep type on solid ink blocks at 19px 700 or larger, set in `--cc-bg`.
- **Do** give every new drawing role classes and `--s` step groups, and pass `animate` only where it opens a plate or the hero.
- **Do** keep article pages under `cc-doc`: flat, 2px corners, Besley 17/26 at 70ch.
- **Adding a series:** add `src/content/series/<slug>.json` and `src/content/articles/<slug>/`. Each manifest part carries an `ink`; lifecycle parts rotate `terra`, `olive`, `mustard`, `muscadine` in order, and operating-layer parts (notes, systems, tools) use `ink`. Any other value falls back to Ink. The collection card's ink follows the series `order` through the same rotation, and a new collection drawing is registered in `COLLECTION_KEYS`.

### Don't:
- **Don't** use Oxblood or the critical tag anywhere on the hub.
- **Don't** set Mustard text below 14px 700; use Ink text with a Mustard dot or border.
- **Don't** put small labels on a solid ink block; they go on the wash foot.
- **Don't** add shadows or hover lift to article pages, or any shadow outside the `--cc-shadow-*` tokens.
- **Don't** add a second authored sequence, exceed 560ms for a single reveal elsewhere, or animate a drawing more than once per load.
- **Don't** hard-code a hex, a font name or a hue inside an illustration.
