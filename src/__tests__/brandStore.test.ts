import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brandOf, loadBrands } from '../services/brandStore.js';

test('spotify web and ios collapse into one brand with two variants', () => {
  const brand = brandOf('ios-spotify');
  assert.equal(brand?.key, 'spotify');
  assert.deepEqual(brand?.variants.map((variant) => variant.platform).sort(), ['ios', 'web']);
});

test('single-variant brands still resolve', () => {
  assert.deepEqual(
    brandOf('stripe')?.variants.map((variant) => variant.slug),
    ['stripe']
  );
});

test('titles prefer the web variant', () => {
  assert.equal(brandOf('ios-spotify')?.title, brandOf('spotify')?.title);
});

test('brand count is smaller than the design count', () => {
  const { coverage } = loadBrands();
  assert.ok(coverage.brands > 0);
  assert.ok(coverage.brands < coverage.designs, 'some brands must own more than one design');
});
