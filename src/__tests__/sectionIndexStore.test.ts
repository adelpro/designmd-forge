import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSectionIndex } from '../services/sectionIndexStore.js';
import { loadIndex } from '../services/designStore.js';

test('store caches the artifact and reports coverage', () => {
  const first = loadSectionIndex();
  const second = loadSectionIndex();
  assert.equal(first, second, 'second call should return the cached object');
  assert.equal(first.coverage.neutral_designs, loadIndex().designs.length);
  assert.ok(first.records.length > 500, `records ${first.records.length}`);
  assert.ok(first.coverage.by_group.footer > 0);
});
