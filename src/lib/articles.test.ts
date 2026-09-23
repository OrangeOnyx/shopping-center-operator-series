import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitId, numberOf, partName, articleUrl, sortForCollection, pad2 } from './articles.ts';

test('splitId separates collection and slug', () => {
  assert.deepEqual(splitId('shopping-center/07-reading-a-rent-roll'), {
    collection: 'shopping-center', slug: '07-reading-a-rent-roll',
  });
});

test('numberOf reads the leading number or returns 0', () => {
  assert.equal(numberOf('07-reading-a-rent-roll'), 7);
  assert.equal(numberOf('parking-is-the-real-gla'), 0);
});

test('partName takes the text after the em dash', () => {
  assert.equal(partName('Part IV — Leasing'), 'Leasing');
  assert.equal(partName(undefined), '');
});

test('articleUrl builds a trailing-slash path', () => {
  assert.equal(articleUrl('field-notes', 'plat-versus-street'), '/field-notes/plat-versus-street/');
});

test('sortForCollection orders series by number and lanes by date desc', () => {
  const s = [{ slug: '10-a', date: '2026-01-01' }, { slug: '02-b', date: '2026-01-01' }];
  assert.deepEqual(sortForCollection(s, 'series').map((x) => x.slug), ['02-b', '10-a']);
  const l = [{ slug: 'a', date: '2026-09-01' }, { slug: 'b', date: '2026-09-22' }, { slug: 'c', date: '2026-09-22' }];
  assert.deepEqual(sortForCollection(l, 'lane').map((x) => x.slug), ['b', 'c', 'a']);
});

test('pad2 zero-pads', () => {
  assert.equal(pad2(7), '07');
  assert.equal(pad2(40), '40');
});
