import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadIndex,
  getEntryBySlug,
  searchDesigns,
  listCategories,
} from '../services/designStore.js';

test('loadIndex returns the bundled 74-design index', () => {
  const index = loadIndex();
  assert.ok(index.count >= 70, `expected at least 70 designs, got ${index.count}`);
  assert.ok(index.designs.length === index.count);
  assert.equal(index.license, 'MIT');
});

test('listCategories returns a non-empty, deduplicated list', () => {
  const categories = listCategories();
  assert.ok(categories.length > 0);
  assert.equal(new Set(categories).size, categories.length, 'categories should be unique');
});

test('getEntryBySlug finds a known slug case-insensitively', () => {
  const exact = getEntryBySlug('stripe');
  assert.ok(exact, 'stripe should exist');
  const upper = getEntryBySlug('STRIPE');
  assert.ok(upper, 'slug lookup should be case-insensitive');
  assert.equal(exact!.slug, upper!.slug);
});

test('getEntryBySlug returns undefined for an unknown slug', () => {
  assert.equal(getEntryBySlug('definitely-not-a-real-site'), undefined);
});

test('searchDesigns ranks title matches above description-only matches', () => {
  const results = searchDesigns('stripe');
  assert.ok(results.length > 0);
  assert.equal(results[0].slug, 'stripe', 'exact title match should rank first');
});

test('searchDesigns respects the category filter', () => {
  const categories = listCategories();
  const someCategory = categories[0];
  const results = searchDesigns('', { category: someCategory, limit: 50 });
  for (const r of results) {
    assert.equal(r.category, someCategory);
  }
});

test('searchDesigns returns empty array for a nonsense query', () => {
  const results = searchDesigns('zzzzznonexistentqueryxyz123');
  assert.equal(results.length, 0);
});
