import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hueFamily, derivePalette } from '../services/palette.js';

test('hue families from real accents', () => {
  assert.equal(hueFamily('#ff385c'), 'red');
  assert.equal(hueFamily('#0066cc'), 'blue');
  assert.equal(hueFamily('#1DB954'), 'green');
  assert.equal(hueFamily('#0a0a0a'), 'neutral');
});

test('primary meaning ink is not an accent (midad)', () => {
  const palette = derivePalette({
    primary: '#111111',
    accent: '#B0894F',
    ink: '#111111',
    paper: '#F7F6F3',
    'paper-dark': '#16150F',
  });
  assert.equal(palette?.accent.toUpperCase(), '#B0894F');
  assert.equal(palette?.accentHue, 'orange');
  assert.equal(palette?.mode, 'both');
});

test('airbnb primary is the accent and the file is light-only', () => {
  const palette = derivePalette({ primary: '#ff385c', ink: '#222222', canvas: '#ffffff' });
  assert.equal(palette?.accentHue, 'red');
  assert.equal(palette?.mode, 'light');
});

test('a dark canvas with no -dark keys is dark, not both', () => {
  const palette = derivePalette({ primary: '#1DB954', inkMuted: '#b3b3b3', canvas: '#121212' });
  assert.equal(palette?.mode, 'dark');
});

test('an on-dark contrast pair is not a dark mode', () => {
  const palette = derivePalette({
    canvas: '#ffffff',
    ink: '#222222',
    primary: '#ff385c',
    'on-dark': '#ffffff',
  });
  assert.equal(palette?.mode, 'light');
});

test('a palette with no canvas and no ink derives nothing', () => {
  assert.equal(derivePalette({ primary: '#ff385c' }), null);
});
