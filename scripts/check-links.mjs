import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, acc) : n.endsWith('.html') && acc.push(p); }
  return acc;
}

/** Checks every root-relative href/src in the built HTML under `dist` resolves to a file, and that no review-status content was emitted. */
export function checkLinks(dist) {
  const failures = [];
  let checked = 0;
  for (const file of walk(dist)) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const url = m[1];
      checked++;
      const candidates = url.endsWith('/') ? [join(dist, url, 'index.html')] : [join(dist, url), join(dist, url, 'index.html')];
      if (!candidates.some((c) => existsSync(c))) failures.push(`${file}: ${url}`);
    }
    if (/data-status="review"/.test(html)) failures.push(`${file}: review-status content emitted`);
  }
  return { checked, failures: [...new Set(failures)] };
}

if (process.argv[1] && process.argv[1].endsWith('check-links.mjs')) {
  const { checked, failures } = checkLinks('dist');
  if (failures.length) { console.error('Link check failed:\n' + failures.join('\n')); process.exit(1); }
  console.log(`Link check: ${checked} internal references resolve`);
}
