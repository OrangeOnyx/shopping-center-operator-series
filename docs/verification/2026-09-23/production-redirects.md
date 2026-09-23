# Production check — articles.cypresscommand.com (2026-09-23, commit 5f3073d)

Spec §9.3 step 3. Recorded with curl immediately after the production deployment
(dpl_9ydBWgvf4Mu7UN1QS53En3AfXBeD) went READY. Query strings survive the hops.

| Request | First response | Final destination (following redirects) |
|---|---|---|
| `/` | 200 | — |
| `/shopping-center/` | 200 | — |
| `/shopping-center/07-reading-a-rent-roll/` | 200 | — |
| `/search-index.json` | 200 | — |
| `/article?id=07-reading-a-rent-roll` | 308 → `/article/?id=…` | 200 `/shopping-center/07-reading-a-rent-roll/?id=…` |
| `/article.html?id=07-reading-a-rent-roll` | 308 → `/shopping-center/07-reading-a-rent-roll/?id=…` | 200 |
| `/article` | 308 → `/article/` | 200 `/shopping-center/` |
| `/map` | 308 → `/map/` | 200 `/shopping-center/map/` |
| `/map.html` | 308 → `/shopping-center/map/` | 200 |
| `/index.html` | 308 → `/` | 200 |

Bare `/article` and `/map` take two hops because Vercel's trailing-slash normalization runs
before the redirect rules; the `/article/` and `/map/` rules added on 2026-09-22 catch the second hop.
