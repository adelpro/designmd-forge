import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callTool } from './helpers.js';
import { loadIndex } from '../services/designStore.js';

test('lists all seven Astryx themes by brand', async () => {
  const res = await callTool('designmd_list_themes', { brand: 'astryx' });
  assert.equal((res.themes as unknown[]).length, 7);
});

test('dark-only filters to gothic; serif display filters to chocolate', async () => {
  const dark = await callTool('designmd_list_themes', { mode: 'dark-only' });
  assert.deepEqual(
    (dark.themes as Array<{ id: string }>).map((theme) => theme.id),
    ['gothic']
  );

  const serif = await callTool('designmd_list_themes', { typeClass: 'serif' });
  assert.deepEqual(
    (serif.themes as Array<{ id: string }>).map((theme) => theme.id),
    ['chocolate']
  );
});

test('coverage separates themes from single-look brands', async () => {
  const res = await callTool('designmd_list_themes', {});
  const coverage = res.coverage as {
    parents: number;
    themes: number;
    designs_listed_as_single_look: number;
  };
  assert.equal(coverage.parents, 1);
  assert.equal(coverage.themes, 7);
  assert.equal(coverage.designs_listed_as_single_look, loadIndex().designs.length - 1);
  assert.match(String(res.note), /only astryx ships official variants/i);
});

test('an unknown brand returns nothing and says why', async () => {
  const res = await callTool('designmd_list_themes', { brand: 'stripe' });
  assert.equal((res.themes as unknown[]).length, 0);
  assert.match(String(res.note), /no themes/i);
});
