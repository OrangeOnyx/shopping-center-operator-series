# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: owner-operators of small and mid-size retail centers**, current and prospective, reading to get better at the actual work: leasing, operating, financing, buying, and selling a multi-tenant asset. They are experienced and already know basic real estate vocabulary. They read to learn something they can use this month, not to be sold to.

**Also primary: owners of owner-led businesses generally.** Shopping centers are the proof domain, not the limit. The upcoming series (Operating Systems, Owner's Contracts, Small Portfolio, Governed AI) cover recurring work, contracts, multi-location visibility, and AI governance for any owner-led business.

Brokers are a secondary audience named in the article brief. No other audience is confirmed.

## Product Purpose

articles.cypresscommand.com is Cypress Command's publication hub: a library of operator-grade articles, organized into series and lanes and filterable by desk. It exists to show real operating depth. Success means readers come to see Cypress Command as the operator-grade authority on running real businesses with practical systems, and remember it when they need that help. **The hub has no direct funnel.** cypresscommand.com is the company site. The hub describes the writing, not the company.

## Positioning

The writing comes from a working operator's desk: On The Blvd Shopping Center, 101–149 Arnould Blvd, Lafayette, Louisiana, a legacy ~63,000 SF, 27-unit center run under the "Operator Landlord" approach. The operator also practiced commercial real estate and transactional law for over eight years (as context, not counsel). Public-record specifics, such as the 324/344 parking variance and easements that outlive their contracts, ground the teaching in a real asset that neighboring publications cannot truthfully claim.

## Operating Context

- Readers arrive on individual article URLs (shared, searched, linked) as often as through the hub index. Every article page must stand on its own.
- Articles are long-form: 1,300–1,800 words, 4–7 H2 sections, checklists, illustrative calculations, and a closing "The practical next step". Field notes run 400–900 words.
- Five interactive articles (checklists, AI map, sheet explorer, calendar) save each reader's progress in their browser.
- Publishing is Markdown plus YAML front matter in `src/content/articles/<collection>/`, with manifests in `src/content/series/`. Adding a series means adding a folder and a manifest entry.
- `status: review` keeps an article out of the public build until it clears fact review (`docs/fact-review/`).

## Capabilities and Constraints

- **Stack:** Astro, static output, Vercel project `site-v2`, domain articles.cypresscommand.com. No CMS, no server runtime, no database, no auth, no UI framework. Widgets are plain client scripts.
- **Collections:** The Shopping Center Operator Series (40 articles in 11 parts, published, with a series map). The Operating Systems Series (10 articles in 3 parts, published). The Field Notes lane (20 notes, published). Three coming-soon series: Owner's Contracts, Small Portfolio, Governed AI.
- **Taxonomy:** six desks (own, run, lease, finance, buy, sell). `lanes` surfaces an article in a lane without moving it.
- **Build gates:** `npm run build` runs a brand check, a content check, the build, then link and redirect checks. Every legacy URL must keep redirecting.
- **Fonts** are self-hosted (Fontsource), with no external font network dependency.
- **Declined for now:** RSS and sitemap (a small later addition). No service funnel on the hub.
- **Terminology:** "Cypress Command" is the company. "Command Platform" is the software, never "Cypress Command Platform". On The Blvd is its flagship deployment. Street spelling is **Arnould** Blvd. The recorded subdivision "Arnold Heights" is a distinct legal name and not a typo.

## Brand Commitments

- **Brand Standards 2.3** in `design-system/` is binding. It is copied verbatim and never edited, and `scripts/check-brand.mjs` enforces it.
- Tagline: *Practical intelligence for real operations.* It is the company line. The hub headline is publication-specific.
- **Voice:** lead with the business problem, in short declarative sentences and concrete nouns. Respect the reader's experience and never call an operation broken or chaotic. State tradeoffs. AI summarizes, organizes, routes, drafts, and prepares, and never replaces accountable people.
- **Prohibited phrases:** revolutionize, transform everything, unlock, seamless, cutting-edge, best-in-class, guaranteed ROI, future-proof, 10x, disruptive, effortless, set it and forget it, game-changer, synergy.
- **Claim boundaries:** no guaranteed outcomes, no superiority claims, no legal/tax/investment advice, and no unverified market statistics stated as fact. The standard footer disclaimer appears on every article.

## Evidence on Hand

- 40 published series articles in `src/content/articles/shopping-center/` and 20 fact-reviewed field notes in `src/content/articles/field-notes/`.
- The approved property facts and public-record facts listed in `../ARTICLE-BRIEF.md` (cleared 2026-09-22).
- Brand assets and logo in `design-system/logo/`.
- **Absent, and must not be fabricated:** tenant names, occupancy, rents, financials, purchase price, dates, renovation details, testimonials, reader counts, press, and client logos. Hypotheticals must be labeled as illustrative.

## Product Principles

1. **The writing is the product.** The hub is built for long reading and reference. It is not a marketing surface and has no funnel.
2. **Operator truth over polish.** Every claim traces to approved facts or is labeled illustrative. Credibility is the whole asset.
3. **Built to grow past one series.** Structure has to hold for series and lanes still to come, and for owner-led businesses beyond retail real estate.
4. **Every page stands alone.** Readers land deep, so each article carries its own context, series position, and next step.
5. **Brand discipline is enforced, not aspirational.** Brand Standards 2.3 and the voice rules are build gates.
