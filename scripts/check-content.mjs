import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DESKS = ['own', 'run', 'lease', 'finance', 'buy', 'sell'];

export function parseFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    out[kv[1]] = v;
  }
  return out;
}

export function validateFrontMatter(text, path, seriesSlugs) {
  const fm = parseFrontMatter(text);
  const v = [];
  if (!fm) return [`${path}: missing front matter`];
  for (const k of ['title', 'deck', 'date', 'read_time']) if (!fm[k]) v.push(`${path}: missing ${k}`);
  if (fm.date && !/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) v.push(`${path}: date must be YYYY-MM-DD`);
  if (fm.desk && !DESKS.includes(fm.desk)) v.push(`${path}: desk "${fm.desk}" is not one of ${DESKS.join('|')}`);
  for (const l of fm.lanes ?? []) if (!seriesSlugs.includes(l)) v.push(`${path}: lane "${l}" is not a known collection`);
  if (fm.status && !['published', 'review'].includes(fm.status)) v.push(`${path}: status must be published or review`);
  return v;
}

export function validatePart(partString, manifest) {
  if (manifest.kind !== 'series') return [];
  const parts = manifest.parts ?? [];
  const name = (partString ?? '').split('—').pop()?.trim() ?? '';
  if (!parts.some((p) => p.name === name)) return [`part "${partString ?? ''}" does not match any manifest part`];
  return [];
}

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, acc) : n.endsWith('.md') && acc.push(p); }
  return acc;
}

if (process.argv[1] && process.argv[1].endsWith('check-content.mjs')) {
  const seriesFiles = readdirSync('src/content/series').filter((f) => f.endsWith('.json'));
  const seriesSlugs = seriesFiles.map((f) => JSON.parse(readFileSync(join('src/content/series', f), 'utf8')).slug);
  const manifestByFolder = {};
  for (const f of seriesFiles) manifestByFolder[f.replace('.json', '')] = JSON.parse(readFileSync(join('src/content/series', f), 'utf8'));
  const problems = [];
  for (const f of seriesFiles) {
    const s = JSON.parse(readFileSync(join('src/content/series', f), 'utf8'));
    if (s.slug !== f.replace('.json', '')) problems.push(`${f}: slug must equal file name`);
    if (s.state === 'coming-soon' && (s.plannedTitles ?? []).some((t) => !t.trim())) problems.push(`${f}: empty planned title`);
  }
  for (const p of walk('src/content/articles')) {
    const folder = p.split(/[\\/]/).at(-2);
    if (!seriesSlugs.includes(folder)) problems.push(`${p}: folder "${folder}" has no manifest`);
    const text = readFileSync(p, 'utf8');
    problems.push(...validateFrontMatter(text, p, seriesSlugs));
    const manifest = manifestByFolder[folder];
    if (manifest) {
      const fm = parseFrontMatter(text);
      problems.push(...validatePart(fm?.part, manifest).map((msg) => `${p}: ${msg}`));
    }
  }
  if (problems.length) { console.error('Content check failed:\n' + problems.join('\n')); process.exit(1); }
  console.log('Content check: clean');
}
