import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintDesignMdContent } from '../services/linter.js';
import { getEntryBySlug, readDesignMdContent } from '../services/designStore.js';

test('the bundled Astryx spec is structurally clean', async () => {
  const { summary } = await lintDesignMdContent(readDesignMdContent('astryx'));
  assert.equal(summary.errors, 0, JSON.stringify(summary));
  assert.equal(summary.warnings, 0, JSON.stringify(summary));
});

test('astryx is attributed, categorised and pinned', () => {
  const entry = getEntryBySlug('astryx');
  assert.equal(entry?.platform, 'web');
  assert.equal(entry?.category, 'Component Library');
  assert.equal(entry?.source, 'adelpro');
  assert.equal(entry?.upstream?.license, 'MIT');
  assert.match(entry?.upstream?.url ?? '', /github\.com\/meta\/astryx/);
  assert.ok(entry?.upstream?.tag);
});

test('the spec declares both modes and its theme count', () => {
  const content = readDesignMdContent('astryx');
  assert.match(content, /light and dark/i);
  assert.match(content, /seven themes/i);
});
