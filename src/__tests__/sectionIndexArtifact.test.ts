import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadIndex } from '../services/designStore.js';

const idx = JSON.parse(
  readFileSync(new URL('../../src/data/section-index.json', import.meta.url), 'utf-8')
) as {
  neutral_designs: number;
  excluded_flavor_files: number;
  counts: { groups: number; by_group: Record<string, number> };
  groups: Array<{ slug: string; group: string; section: string; variant: string | null }>;
};

test('index covers the neutral corpus only', () => {
  assert.equal(idx.neutral_designs, loadIndex().designs.length);
  assert.ok(idx.excluded_flavor_files > 0, 'flavour files should be counted as excluded');
  assert.ok(idx.groups.every((g) => !/-(swiftui|expo|android)$/.test(g.slug)));
});

test('footer groups exist and are counted consistently', () => {
  // 37 neutral designs declare a footer group (200 iOS app specs have none).
  // The earlier "52" was a line count across all 889 files, flavours included.
  assert.ok(idx.counts.by_group.footer >= 30, `footer count ${idx.counts.by_group.footer}`);
  assert.equal(idx.groups.filter((g) => g.group === 'footer').length, idx.counts.by_group.footer);
});

test('no design has two records for the same group+variant', () => {
  const keys = idx.groups.map((g) => `${g.slug}:${g.section}:${g.group}:${g.variant ?? '-'}`);
  assert.equal(new Set(keys).size, keys.length);
});
