import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brandKey } from '../services/brandKey.js';

test('platform and flavour affixes are stripped', () => {
  assert.equal(brandKey('ios-spotify', 'ios'), 'spotify');
  assert.equal(brandKey('spotify', 'web'), 'spotify');
  assert.equal(brandKey('midad-expo', 'mobile'), 'midad');
});

test('distinct products are never merged', () => {
  assert.equal(brandKey('bmw-m', 'web'), 'bmw-m');
  assert.equal(brandKey('dell-1996', 'web'), 'dell-1996');
  assert.equal(brandKey('astryx', 'web'), 'astryx');
  assert.notEqual(brandKey('meta', 'web'), brandKey('astryx', 'web'));
});

test('an ios prefix is only stripped for ios entries', () => {
  assert.equal(brandKey('ios-spotify', 'web'), 'ios-spotify');
});
