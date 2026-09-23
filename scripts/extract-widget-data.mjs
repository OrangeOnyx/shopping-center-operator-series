import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const src = readFileSync('archive/legacy-static/assets/js/app.js', 'utf8');
function block(name) {
  const start = src.indexOf(`const ${name} = `);
  const open = src.indexOf(src[src.indexOf('=', start) + 2] === '[' ? '[' : '{', start);
  let depth = 0, i = open;
  for (; i < src.length; i++) {
    if (src[i] === '[' || src[i] === '{') depth++;
    if (src[i] === ']' || src[i] === '}') depth--;
    if (depth === 0) break;
  }
  return new Function('return ' + src.slice(open, i + 1))();
}
mkdirSync('src/data/widgets', { recursive: true });
const checklists = block('CHECKLISTS');
for (const k of Object.keys(checklists)) delete checklists[k].accentCycle;
const aiMap = block('AI_MAP');
delete aiMap.helps.dot; delete aiMap.humans.dot;
writeFileSync('src/data/widgets/checklists.json', JSON.stringify(checklists, null, 2));
writeFileSync('src/data/widgets/ai-map.json', JSON.stringify(aiMap, null, 2));
writeFileSync('src/data/widgets/sheets.json', JSON.stringify(block('SHEETS'), null, 2));
writeFileSync('src/data/widgets/calendar.json', JSON.stringify(block('CALENDAR'), null, 2));
for (const k of Object.keys(checklists)) console.log(k, 'items:', checklists[k].sections.reduce((n, s) => n + s.items.length, 0));
console.log('extracted', Object.keys(checklists).join(','), block('SHEETS').length, 'sheets', block('CALENDAR').length, 'months');
