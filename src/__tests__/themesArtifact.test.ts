import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const themes = JSON.parse(
  readFileSync(new URL('../../src/data/themes.json', import.meta.url), 'utf-8')
) as {
  pin: { version: string; repo: string; license: string };
  parents: Record<
    string,
    {
      default_theme: string;
      themes: Array<{
        id: string;
        name: string;
        kind: string;
        mode: string;
        type: { display: string; body: string };
        typeClass: string;
        palette: { canvas: string; surface: string; accent: string; ink: string };
        derived: boolean;
      }>;
    }
  >;
};

test('seven Astryx themes, each with a type pairing and a palette', () => {
  const astryx = themes.parents.astryx;
  assert.equal(astryx.themes.length, 7);
  assert.deepEqual(astryx.themes.map((theme) => theme.id).sort(), [
    'butter',
    'chocolate',
    'gothic',
    'matcha',
    'neutral',
    'stone',
    'y2k',
  ]);
  for (const theme of astryx.themes) {
    assert.ok(theme.type.display && theme.type.body, `${theme.id} missing a type pairing`);
    assert.match(theme.palette.canvas, /^#[0-9a-f]{6}$/i, `${theme.id} canvas`);
    assert.match(theme.palette.accent, /^#[0-9a-f]{6}$/i, `${theme.id} accent`);
  }
});

test('gothic is the only dark-only theme and carries no derived flag', () => {
  const astryx = themes.parents.astryx;
  const gothic = astryx.themes.find((theme) => theme.id === 'gothic');
  assert.equal(gothic?.mode, 'dark-only');
  assert.deepEqual(
    astryx.themes.filter((theme) => theme.mode === 'dark-only').map((theme) => theme.id),
    ['gothic']
  );
  assert.ok(astryx.themes.every((theme) => theme.derived === false));
});

test('the pin is recorded, not implied', () => {
  assert.equal(themes.pin.version, '0.7.15');
  assert.match(themes.pin.repo, /github\.com\/meta\/astryx/);
  assert.equal(themes.pin.license, 'MIT');
  assert.equal(themes.parents.astryx.default_theme, 'neutral');
});
