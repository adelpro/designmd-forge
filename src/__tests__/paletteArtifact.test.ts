import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadIndex } from '../services/designStore.js';

const artifact = JSON.parse(
  readFileSync(new URL('../../src/data/palettes.json', import.meta.url), 'utf-8')
) as {
  coverage: { designs_total: number; designs_with_palette: number; skipped_prose_only: number };
  palettes: Record<string, { derived: boolean; mode: string; accentHue: string }>;
};

test('coverage is honest about what was skipped', () => {
  const total = loadIndex().designs.length;
  assert.equal(artifact.coverage.designs_total, total);
  assert.equal(
    artifact.coverage.designs_with_palette + artifact.coverage.skipped_prose_only,
    total
  );
  // A ceiling relative to the corpus, not an absolute count: the guard is that
  // prose-only specs (over 200 of them) are never regexed out of sentences.
  assert.ok(
    artifact.coverage.designs_with_palette >= 60,
    `designs_with_palette ${artifact.coverage.designs_with_palette}`
  );
  assert.ok(
    artifact.coverage.skipped_prose_only > 200,
    `skipped_prose_only ${artifact.coverage.skipped_prose_only} — prose-only entries must stay out`
  );
  assert.equal(artifact.palettes['ios-spotify'], undefined, 'prose-only entries never appear');
});

test('every palette row is derived and carries the three facts', () => {
  for (const [slug, palette] of Object.entries(artifact.palettes)) {
    assert.equal(palette.derived, true, `${slug} not marked derived`);
    assert.ok(['light', 'dark', 'both'].includes(palette.mode), `${slug} mode ${palette.mode}`);
    assert.ok(palette.accentHue.length > 0, `${slug} has no accent hue`);
  }
});

test('airbnb is a light red-accent system', () => {
  const airbnb = artifact.palettes.airbnb;
  assert.equal(airbnb.mode, 'light');
  assert.equal(airbnb.accentHue, 'red');
});
