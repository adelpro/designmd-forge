import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadIndex } from '../services/designStore.js';

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')) as {
  scripts: Record<string, string>;
};

test('refresh-data runs every source that stages fragments, then verifies', () => {
  const script = String(pkg.scripts['refresh-data']);
  for (const step of [
    'refresh-data:web',
    'refresh-data:mobile',
    'refresh-data:ios',
    'refresh-data:shadcn',
    'refresh-data:adelpro',
    'refresh-data:astryx',
    'load-data',
    'verify-data',
  ]) {
    assert.ok(script.includes(step), `refresh-data missing ${step}`);
  }
  assert.ok(pkg.scripts['refresh-data:adelpro'], 'adelpro has no refresh script');
  assert.ok(pkg.scripts['refresh-data:astryx'], 'astryx has no refresh script');
});

test('authored entries survive in the shipped index', () => {
  const index = loadIndex();
  for (const slug of ['midad', 'mushaf-native', 'open-tarteel', 'uslub', 'astryx']) {
    assert.ok(
      index.designs.some((design) => design.slug === slug),
      `${slug} missing from index`
    );
  }
  assert.equal(index.count, index.designs.length);
});

test('every declared source has at least one design', () => {
  const index = loadIndex();
  for (const key of Object.keys(index.sources ?? {})) {
    assert.ok(
      index.designs.some((design) => (design.source ?? design.platform) === key),
      `source '${key}' has no designs`
    );
  }
});

test('the astryx entry keeps its upstream attribution', () => {
  const astryx = loadIndex().designs.find((design) => design.slug === 'astryx');
  assert.equal(astryx?.category, 'Component Library');
  assert.equal(astryx?.upstream?.license, 'MIT');
  const themes = JSON.parse(
    readFileSync(new URL('../../src/data/themes.json', import.meta.url), 'utf-8')
  );
  assert.equal(themes.parents.astryx.themes.length, 7);
});

test('build copies data before generating artifacts (CI runs on an empty dist)', () => {
  const steps = String(pkg.scripts.build)
    .split('&&')
    .map((step) => step.trim());
  const firstCopy = steps.indexOf('node scripts/copy-data.mjs');
  const sectionIndex = steps.indexOf('node scripts/build-section-index.mjs');
  const lastCopy = steps.lastIndexOf('node scripts/copy-data.mjs');

  assert.ok(firstCopy > -1, 'build must copy data');
  assert.ok(
    sectionIndex > firstCopy,
    'copy-data must run before the section index reads dist/data'
  );
  assert.ok(lastCopy > sectionIndex, 'a final copy must publish regenerated artifacts to dist');
});
