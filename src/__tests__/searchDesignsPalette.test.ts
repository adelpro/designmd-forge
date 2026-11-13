import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callTool } from './helpers.js';

test('palette filters explain their coverage in the response', async () => {
  const res = await callTool('designmd_search_designs', { query: '', mode: 'dark' });
  const results = res.results as Array<{ palette: { mode: string } | null }>;
  assert.ok(results.length > 0);
  assert.ok(
    results.every((row) => row.palette && ['dark', 'both'].includes(row.palette.mode)),
    'a light-only design must not survive mode=dark'
  );
  assert.match(String(res.note), /\d+ of \d+ designs/);
});

test('brand and hue filters reach the tool surface', async () => {
  const brand = await callTool('designmd_search_designs', { query: '', brand: 'spotify' });
  assert.deepEqual((brand.results as Array<{ slug: string }>).map((row) => row.slug).sort(), [
    'ios-spotify',
    'spotify',
  ]);

  const hue = await callTool('designmd_search_designs', { query: '', hue: 'red' });
  assert.ok((hue.results as Array<{ slug: string }>).some((row) => row.slug === 'airbnb'));
});
