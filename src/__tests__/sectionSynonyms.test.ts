import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expandTerms } from '../services/sectionSynonyms.js';

test('hamburger expands to the words the corpus actually uses', () => {
  const [group] = expandTerms(['hamburger']);
  for (const term of ['menu button', 'icon-only nav', 'drawer', 'sheet', 'bottom bar']) {
    assert.ok(group.includes(term), `missing expansion '${term}'`);
  }
});

test('3d and hover expand to appearance and state vocabulary', () => {
  const [threeD] = expandTerms(['3d']);
  assert.ok(threeD.some((term) => ['bevel', 'raised', 'embossed', 'depth'].includes(term)));
  assert.ok(expandTerms(['hover'])[0].includes('hover state'));
});

test('unknown terms expand to themselves only', () => {
  assert.deepEqual(expandTerms(['zebra']), [['zebra']]);
});
