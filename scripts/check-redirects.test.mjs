import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchRedirect } from './check-redirects.mjs';
import { readFileSync } from 'node:fs';
const rules = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;

test('article with id redirects to the series article', () => {
  assert.equal(matchRedirect(rules, '/article', { id: '07-reading-a-rent-roll' }), '/shopping-center/07-reading-a-rent-roll/');
  assert.equal(matchRedirect(rules, '/article.html', { id: '40-easements-that-outlive-their-contracts' }), '/shopping-center/40-easements-that-outlive-their-contracts/');
  assert.equal(matchRedirect(rules, '/article/', { id: '07-reading-a-rent-roll' }), '/shopping-center/07-reading-a-rent-roll/');
});

test('article without id, map, and index redirect to landing pages', () => {
  assert.equal(matchRedirect(rules, '/article', {}), '/shopping-center/');
  assert.equal(matchRedirect(rules, '/map.html', {}), '/shopping-center/map/');
  assert.equal(matchRedirect(rules, '/index.html', {}), '/');
  assert.equal(matchRedirect(rules, '/article/', {}), '/shopping-center/');
  assert.equal(matchRedirect(rules, '/map/', {}), '/shopping-center/map/');
});

test('unrelated paths do not match', () => {
  assert.equal(matchRedirect(rules, '/shopping-center/', {}), null);
});
