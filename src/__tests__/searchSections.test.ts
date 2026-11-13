import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callTool } from './helpers.js';
import { brandOf } from '../services/brandStore.js';

test('footer + social returns real choices with snippets', async () => {
  const res = await callTool('designmd_search_sections', { group: 'footer', text: 'social icons' });
  const matches = res.matches as Array<{
    group: string;
    snippet: string;
    facets: { items: string[] };
  }>;
  assert.ok(matches.length >= 3, `expected at least 3 matches, got ${matches.length}`);
  assert.ok(matches.every((m) => m.group === 'footer'));
  assert.ok(
    matches.some((m) => /social/i.test(m.snippet) || m.facets.items.includes('social')),
    'at least one snippet or facet must show social'
  );
  const coverage = res.coverage as { neutral_designs: number };
  assert.ok(coverage.neutral_designs > 0);
});

test('3d hover buttons are found through traits and states', async () => {
  const res = await callTool('designmd_search_sections', { group: 'buttons', text: '3d hover' });
  const matches = res.matches as Array<{
    facets: { traits: string[]; states: string[] };
  }>;
  assert.ok(matches.length >= 1);
  assert.ok(
    matches.some((m) => m.facets.traits.includes('3d') || m.facets.states.includes('hover'))
  );
});

test('has: filters on derived facets, and an unsatisfiable filter says so', async () => {
  const hit = await callTool('designmd_search_sections', { group: 'footer', has: ['social'] });
  const matches = hit.matches as Array<{ facets: { items: string[] } }>;
  assert.ok(matches.length > 0);
  assert.ok(matches.every((m) => m.facets.items.includes('social')));

  const miss = await callTool('designmd_search_sections', {
    group: 'footer',
    has: ['nonexistent'],
  });
  assert.equal((miss.matches as unknown[]).length, 0);
  assert.match(miss.note as string, /0 of \d+ group records/);
});

test('group and section cannot silently mismatch', async () => {
  const res = await callTool('designmd_search_sections', {
    group: 'buttons',
    section: 'motion',
  });
  assert.equal((res.matches as unknown[]).length, 0);
  assert.match(res.note as string, /no 'buttons' group in the motion section/i);
});

test('collapsing keeps one row per design for the same group', async () => {
  const res = await callTool('designmd_search_sections', { group: 'buttons', limit: 50 });
  const matches = res.matches as Array<{ slug: string; group: string }>;
  const keys = matches.map((m) => `${m.slug}:${m.group}`);
  assert.equal(new Set(keys).size, keys.length, 'a design must not appear twice for one group');
});

test('rows carry their brand key and no brand repeats', async () => {
  const res = await callTool('designmd_search_sections', { group: 'buttons', limit: 50 });
  const matches = res.matches as Array<{ slug: string; brand: string }>;
  const brands = matches.map((m) => m.brand);
  assert.equal(new Set(brands).size, brands.length, 'one row per brand, not per collection');
  for (const match of matches) {
    assert.equal(match.brand, brandOf(match.slug)?.key, `brand mismatch for ${match.slug}`);
  }
});

test('has: reaches the derived position, so sticky regions are findable', async () => {
  // No footer in the corpus says "sticky" — navigation does (45 records).
  const res = await callTool('designmd_search_sections', { has: ['sticky'], limit: 5 });
  const matches = res.matches as Array<{ facets: { position?: string } }>;
  assert.ok(matches.length > 0, 'has:[sticky] must not be a dead end');
  assert.ok(matches.every((match) => match.facets.position === 'sticky'));
});

test('multi-word text is AND: every row mentions every term', async () => {
  const res = await callTool('designmd_search_sections', {
    group: 'footer',
    text: 'social links',
    limit: 20,
  });
  const matches = res.matches as Array<{ snippet: string; facets: { items: string[] } }>;
  assert.ok(matches.length > 0);
  assert.ok(
    matches.every(
      (match) => /social/i.test(match.snippet) || match.facets.items.includes('social')
    ),
    'a footer without social must not rank for "social links"'
  );
});
