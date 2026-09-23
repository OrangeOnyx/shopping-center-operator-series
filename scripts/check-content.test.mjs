import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFrontMatter, validatePart } from './check-content.mjs';

const good = `---\ntitle: "T"\ndeck: "D"\ndate: "2026-09-22"\nread_time: "5 min"\ndesk: "own"\nlanes: ["field-notes"]\n---\n# T\n`;

test('accepts a valid front matter', () => {
  assert.deepEqual(validateFrontMatter(good, 'x.md', ['field-notes']), []);
});

test('rejects missing fields, bad desk, unknown lane', () => {
  const bad = `---\ntitle: "T"\ndate: "2026-9-2"\ndesk: "other"\nlanes: ["nope"]\n---\n`;
  const v = validateFrontMatter(bad, 'x.md', ['field-notes']);
  assert.ok(v.some((s) => s.includes('deck')));
  assert.ok(v.some((s) => s.includes('read_time')));
  assert.ok(v.some((s) => s.includes('date')));
  assert.ok(v.some((s) => s.includes('desk')));
  assert.ok(v.some((s) => s.includes('lane')));
});

const seriesManifest = { kind: 'series', parts: [{ num: 1, roman: 'I', name: 'Owning' }, { num: 2, roman: 'II', name: 'Acquiring' }] };
const laneManifest = { kind: 'lane' };

test('validatePart accepts a part matching the manifest', () => {
  assert.deepEqual(validatePart('Part I — Owning', seriesManifest), []);
});

test('validatePart rejects a part not in the manifest', () => {
  const v = validatePart('Part IX — Nonexistent', seriesManifest);
  assert.equal(v.length, 1);
  assert.ok(v[0].includes('does not match'));
});

test('validatePart exempts lane manifests', () => {
  assert.deepEqual(validatePart('anything', laneManifest), []);
});
