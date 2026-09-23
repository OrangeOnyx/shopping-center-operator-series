import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBrand } from './check-brand.mjs';

test('flags raw hex, font faces, and shadows; allows tokens', () => {
  const v = checkBrand([
    { path: 'a.css', text: 'color: #A44E12; font-family: "Besley"; box-shadow: 0 1px 2px var(--x);' },
    { path: 'b.css', text: 'color: var(--cc-terra); font-family: var(--cc-font-display); box-shadow: none;' },
  ]);
  assert.equal(v.length, 3);
  assert.ok(v.every((s) => s.startsWith('a.css')));
});

test('ignores hex inside svg files and in comments about tokens', () => {
  const v = checkBrand([{ path: 'logo.svg', text: '<path fill="#1E1B16"/>' }]);
  assert.equal(v.length, 0);
});
