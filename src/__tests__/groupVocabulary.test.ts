import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveGroupHeading } from '../services/groupVocabulary.js';

test('exact heading resolves to its group', () => {
  const r = resolveGroupHeading('Footer');
  assert.equal(r.group, 'footer');
  assert.equal(r.variant, null);
});

test('parenthetical collapses into a variant, never the group id', () => {
  const r = resolveGroupHeading('Sticky Booking Footer (Stay Detail bottom)');
  assert.equal(r.group, 'footer');
  assert.equal(r.variant, 'sticky');
});

test('CTA / Footer resolves once, to footer', () => {
  const r = resolveGroupHeading('CTA / Footer');
  assert.equal(r.group, 'footer');
  assert.equal(r.variant, 'cta');
});

test('Navigation & Menu does not leak into two groups', () => {
  const r = resolveGroupHeading('Navigation & Menu');
  assert.equal(r.group, 'navigation');
});

test('unknown headings land in other with the heading kept', () => {
  const r = resolveGroupHeading('Raise-Hand Bar');
  assert.equal(r.group, 'other');
  assert.equal(r.matchedAlias, null);
});

test('no alias belongs to two groups', () => {
  const raw = JSON.parse(
    readFileSync(new URL('../data/section-aliases.json', import.meta.url), 'utf-8')
  ) as { groups: Record<string, string[]> };
  const seen = new Map<string, string>();
  for (const [group, list] of Object.entries(raw.groups)) {
    for (const alias of list) {
      assert.equal(
        seen.get(alias),
        undefined,
        `alias '${alias}' appears in both ${seen.get(alias)} and ${group}`
      );
      seen.set(alias, group);
    }
  }
});
