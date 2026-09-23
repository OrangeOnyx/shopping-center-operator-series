import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FACE = /font-family\s*:\s*["']?(Besley|Archivo|Courier|Inter|Libertinus|Georgia|Fraunces|system-ui|serif|sans-serif|monospace)/g;
const SHADOW = /box-shadow\s*:\s*(?!\s*(?:none\b|var\(--cc-shadow-))[^;]+/g;

export function checkBrand(files) {
  const out = [];
  for (const { path, text } of files) {
    if (path.endsWith('.svg') || path.endsWith('.json')) continue;
    for (const [re, label] of [[HEX, 'raw hex color'], [FACE, 'font face named outside tokens'], [SHADOW, 'box-shadow']]) {
      for (const m of text.matchAll(re)) {
        const line = text.slice(0, m.index).split('\n').length;
        out.push(`${path}:${line} ${label}: ${m[0]}`);
      }
    }
  }
  return out;
}

export function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(astro|css|ts|js|mjs)$/.test(name) && !/\.test\.(ts|mjs|js)$/.test(name)) acc.push({ path: p, text: readFileSync(p, 'utf8') });
  }
  return acc;
}

if (process.argv[1] && process.argv[1].endsWith('check-brand.mjs')) {
  const violations = checkBrand(walk('src'));
  if (violations.length) { console.error('Brand check failed:\n' + violations.join('\n')); process.exit(1); }
  console.log('Brand check: clean');
}
