import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkLinks } from './check-links.mjs';

function site(pages) {
  const dist = mkdtempSync(join(tmpdir(), 'cc-links-'));
  for (const [path, html] of Object.entries(pages)) {
    const full = join(dist, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, html);
  }
  return dist;
}

test('directory, file, and fragment/query links resolve', () => {
  const dist = site({
    'index.html': '<a href="/a/">a</a><a href="/a/#top">a</a><a href="/a?x=1">a</a><img src="/img/p.svg">',
    'a/index.html': '<a href="/">home</a>',
    'img/p.svg': '<svg/>',
  });
  try {
    const r = checkLinks(dist);
    assert.deepEqual(r.failures, []);
    assert.equal(r.checked, 5);
  } finally { rmSync(dist, { recursive: true }); }
});

test('missing targets and external links', () => {
  const dist = site({ 'index.html': '<a href="/gone/">x</a><a href="https://example.com/">ext</a><a href="/also-gone">y</a>' });
  try {
    const r = checkLinks(dist);
    assert.equal(r.failures.length, 2);
    assert.ok(r.failures.some((f) => f.endsWith(': /gone/')));
    assert.ok(r.failures.some((f) => f.endsWith(': /also-gone')));
  } finally { rmSync(dist, { recursive: true }); }
});

test('review-status content fails the check', () => {
  const dist = site({ 'index.html': '<article data-status="review"></article>' });
  try {
    assert.deepEqual(checkLinks(dist).failures.map((f) => f.split(': ')[1]), ['review-status content emitted']);
  } finally { rmSync(dist, { recursive: true }); }
});
