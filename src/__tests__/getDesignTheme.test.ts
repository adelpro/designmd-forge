import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callTool } from './helpers.js';

test('a theme returns a delta, not the parent prose', async () => {
  const res = await callTool('designmd_get_design_md', { slug: 'astryx', theme: 'butter' });
  const content = String(res.content);
  assert.match(content, /Sarina/);
  assert.match(content, /#225bff/i);
  assert.doesNotMatch(content, /## Do's and Don'ts/);
  assert.doesNotMatch(content, /## Components/);
  assert.equal(res.theme, 'butter');
});

test('unknown theme lists what exists', async () => {
  const res = await callTool('designmd_get_design_md', { slug: 'astryx', theme: 'nope' });
  assert.equal(res.isError, true);
  assert.match(String(res.text), /butter, chocolate, gothic, matcha, neutral, stone, y2k/);
});

test('theme is refused together with flavor or a section', async () => {
  const withFlavor = await callTool('designmd_get_design_md', {
    slug: 'astryx',
    theme: 'butter',
    flavor: 'expo',
  });
  assert.equal(withFlavor.isError, true);

  const withSection = await callTool('designmd_get_design_md', {
    slug: 'astryx',
    theme: 'butter',
    section: 'colors',
  });
  assert.equal(withSection.isError, true);
  assert.match(String(withSection.text), /theme/i);
});

test('a design with no themes refuses a theme request', async () => {
  const res = await callTool('designmd_get_design_md', { slug: 'stripe', theme: 'butter' });
  assert.equal(res.isError, true);
  assert.match(String(res.text), /no themes/i);
});
