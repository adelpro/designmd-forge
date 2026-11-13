import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractFacets } from '../services/groupFacets.js';

test('footer facets: columns, items, divider, position', () => {
  const f = extractFacets(
    'footer',
    'A four-column strip: legal links, a locale switcher, social icons, and a hairline divider on a sticky bottom bar.'
  );
  assert.equal(f.columns, 4);
  assert.equal(f.position, 'sticky');
  assert.equal(f.divider, 'hairline');
  assert.deepEqual(f.items.sort(), ['legal', 'locale', 'social']);
});

test('button facets: behaviour words are states, appearance words are traits', () => {
  const f = extractFacets(
    'buttons',
    'Primary button lifts 2px on hover with a 3D bevel shadow; disabled state drops to 40% opacity.'
  );
  assert.deepEqual(f.states.sort(), ['disabled', 'hover']);
  assert.deepEqual(f.traits.sort(), ['3d', 'bevel']);
});

test('no facet words yields empty arrays, never guesses', () => {
  const f = extractFacets('footer', 'The footer holds the wordmark.');
  assert.deepEqual(f.items, []);
  assert.deepEqual(f.states, []);
  assert.deepEqual(f.traits, []);
  assert.equal(f.position, undefined);
  assert.equal(f.columns, undefined);
});
