import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const raw = execSync('gh api repos/OrangeOnyx/tiger-yellow-tulip-birch/contents/src/data/articles.ts --jq .content', { encoding: 'utf8' });
let ts = Buffer.from(raw.trim(), 'base64').toString('utf8');
ts = ts
  .replace(/^import[^\n]*\n/m, '')
  .replace(/export type Article = \{[\s\S]*?\n\};\n/, '')
  .replace('export const articles: Article[] =', 'globalThis.__notes =')
  .replace(/^export /gm, '');
const end = ts.indexOf('\n];');           // the notes array closes here; typed helpers follow and are not needed
if (end === -1) throw new Error('could not find the end of the notes array');
ts = ts.slice(0, end + 3);
new Function(ts)();
const notes = globalThis.__notes;

const FLAG = /\d|\$|Johnston|Patricia|Marie Antoinette|Montagnet|Domingue|JD Bank|Belle|\bLot\b/;
const DESK_LABEL = { own: 'own', run: 'run', lease: 'lease', finance: 'finance', buy: 'buy', sell: 'sell' };
mkdirSync('src/content/articles/field-notes', { recursive: true });
mkdirSync('docs/fact-review', { recursive: true });
const rows = [];
for (const n of notes) {
  const body = n.sections.map((s) => (s.heading ? `## ${s.heading}\n\n` : '') + s.body.join('\n\n')).join('\n\n');
  const md = `---
title: "${n.title.replace(/"/g, '\\"')}"
deck: "${n.dek.replace(/"/g, '\\"')}"
author: "Cypress Command"
date: "${n.date}"
read_time: "${n.minutes} min"
desk: "${DESK_LABEL[n.desk]}"
status: "review"
source: "grok-journal"
---

# ${n.title}

${body}

---

*Cypress Command builds practical AI-enabled operating systems for owner-led businesses — including the owners and operators of commercial real estate. This article is educational. It is not legal, tax, or investment advice.*
`;
  writeFileSync(`src/content/articles/field-notes/${n.slug}.md`, md);
  const split = (p) => p.split(/(?<=[.!?][”"’']?)\s+/);
  for (const sentence of split(n.dek)) if (FLAG.test(sentence) && sentence.trim().length >= 20) rows.push([n.slug, '(deck) ' + sentence.trim()]);
  for (const s of n.sections) for (const p of s.body) for (const sentence of split(p)) if (FLAG.test(sentence) && sentence.trim().length >= 20) rows.push([n.slug, sentence.trim()]);
}
const table = `# Fact review — field notes harvested from the Grok journal

Generated 2026-09-22. One row per sentence containing a number, a dollar figure, or a named place or party, in the deck or the body. Rows that state only approved facts can be accepted as-is; the list is deliberately over-inclusive because it is the gate. Fill the Decision column with **accept**, **generalize**, or **cut**. A note moves to \`status: published\` only when every one of its rows is decided and applied.

Approved facts (from ARTICLE-BRIEF.md): 101–149 Arnould Blvd; ~63,000 SF (62,883 SF GLA); 27 units; two buildings; 4.84 acres; zoned CH; Arnould vs. "Arnold Heights Subd. Ext. No. 1"; variance 99-11797, 324 provided / 344 required; plat striping 314; bank servitude 2004-00057697, 13 spaces, expires 12/30/2034; bank parcel sold, not part of the center; church easement §3a liquor waiver survives termination, liquor line on plat. Dollar terms stay out.

| Note | Claim | Decision | Applied |
|---|---|---|---|
${rows.map(([s, c]) => `| ${s} | ${c.replace(/\|/g, '\\|')} |  |  |`).join('\n')}
`;
writeFileSync('docs/fact-review/grok-field-notes.md', table);
console.log(`${notes.length} notes written, ${rows.length} claims flagged`);
