import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { listToolNames, listPrompts } from './helpers.js';
import { loadIndex } from '../services/designStore.js';

const readme = (): string => readFileSync(new URL('../../README.md', import.meta.url), 'utf-8');

test('README documents every registered tool and prompt', async () => {
  const content = readme();
  for (const name of await listToolNames()) {
    assert.ok(content.includes(name), `README missing tool ${name}`);
  }
  for (const prompt of await listPrompts()) {
    assert.ok(content.includes(prompt.name), `README missing prompt ${prompt.name}`);
  }
});

test('documented counts match the shipped artifacts', () => {
  const content = readme();
  const total = loadIndex().designs.length;
  const palettes = JSON.parse(
    readFileSync(new URL('../../src/data/palettes.json', import.meta.url), 'utf-8')
  );
  assert.match(content, new RegExp(`${total} design specs`), `README should say ${total}`);
  assert.match(
    content,
    new RegExp(`palette filters cover ${palettes.coverage.designs_with_palette} of ${total}`)
  );
});

test('README states the honest limits', () => {
  const content = readme();
  assert.match(content, /flavour files are not indexed/i);
  assert.match(content, /prose-only/i);
  assert.match(content, /prompts are not skills/i);
  assert.match(content, /only astryx ships/i);
});

test('the bundled skill routes to the new tools', () => {
  const skill = readFileSync(
    new URL('../../skill/designmd-authoring/SKILL.md', import.meta.url),
    'utf-8'
  );
  assert.match(skill, /designmd_search_sections/);
  assert.match(skill, /designmd_list_themes/);
});
