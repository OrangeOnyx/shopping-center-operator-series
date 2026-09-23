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
  for (const s of slugs) { cases.push(['/article', { id: s }]); cases.push(['/article.html', { id: s }]); cases.push(['/article/', { id: s }]); }
  cases.push(['/article', {}], ['/article.html', {}], ['/article/', {}], ['/map', {}], ['/map.html', {}], ['/map/', {}], ['/index.html', {}]);
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
