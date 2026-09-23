import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remarkPlates } from './remark-article.mjs';

function heading(depth, value) {
  return { type: 'heading', depth, children: [{ type: 'text', value }] };
}

function paragraph(value = 'text') {
  return { type: 'paragraph', children: [{ type: 'text', value }] };
}

test('remarkPlates wraps the view-from H3 in a field-note aside and the practical-next-step H2 in a next-step aside', () => {
  const tree = {
    type: 'root',
    children: [
      heading(2, 'Intro'),
      paragraph(),
      heading(3, 'The view from Arnould Blvd'),
      paragraph(),
      paragraph(),
      heading(2, 'The practical next step'),
      paragraph(),
      { type: 'list', children: [] },
    ],
  };

  remarkPlates()(tree);
  const c = tree.children;

  assert.equal(c.length, 12);

  assert.equal(c[0].type, 'heading');
  assert.equal(c[1].type, 'paragraph');

  // The field-note open precedes the h3.
  assert.equal(c[2].type, 'html');
  assert.equal(c[2].value, '<aside class="plate-note wash-ink"><span class="plate-label">FIELD NOTE · ARNOULD BLVD</span>');
  assert.equal(c[3].type, 'heading');
  assert.equal(c[3].depth, 3);

  assert.equal(c[4].type, 'paragraph');
  assert.equal(c[5].type, 'paragraph');

  // The field-note close follows the second paragraph.
  assert.equal(c[6].type, 'html');
  assert.equal(c[6].value, '</aside>');

  // The olive next-step open precedes the last h2.
  assert.equal(c[7].type, 'html');
  assert.equal(c[7].value, '<aside class="plate-note wash-olive next-step"><span class="plate-label">NEXT STEPS</span>');
  assert.equal(c[8].type, 'heading');
  assert.equal(c[8].depth, 2);

  assert.equal(c[9].type, 'paragraph');
  assert.equal(c[10].type, 'list');

  // The next-step close is the final node.
  assert.equal(c[11].type, 'html');
  assert.equal(c[11].value, '</aside>');
});

test('remarkPlates is case-insensitive on "the view from" and leaves unrelated headings untouched', () => {
  const tree = {
    type: 'root',
    children: [heading(3, 'the VIEW FROM somewhere else'), paragraph(), heading(2, 'Another section')],
  };
  remarkPlates()(tree);
  const c = tree.children;
  assert.equal(c.length, 5);
  assert.equal(c[0].type, 'html');
  assert.equal(c[3].type, 'html');
  assert.equal(c[3].value, '</aside>');
  assert.equal(c[4].type, 'heading');
});
