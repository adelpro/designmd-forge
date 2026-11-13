import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listPrompts, getPrompt } from './helpers.js';

test('the server exposes exactly four prompts', async () => {
  const prompts = await listPrompts();
  assert.deepEqual(prompts.map((prompt) => prompt.name).sort(), [
    'author-design-md',
    'pick-a-design',
    'section-inspiration',
    'theme-pick',
  ]);
  for (const prompt of prompts) {
    assert.ok(
      prompt.description && prompt.description.length > 20,
      `${prompt.name} has no description`
    );
  }
});

test('section-inspiration names the tools, the limit and the deliverable', async () => {
  const result = await getPrompt('section-inspiration', {
    component: 'footer',
    qualities: 'social links, sticky',
  });
  assert.match(result.text, /designmd_search_sections/);
  assert.match(result.text, /footer/);
  assert.match(result.text, /social links, sticky/);
  assert.match(result.text, /derived/);
  assert.match(result.text, /3–5|3-5/);
});

test('pick-a-design forces the guardrails read', async () => {
  const result = await getPrompt('pick-a-design', { brief: 'a calm reading app for Arabic text' });
  assert.match(result.text, /designmd_search_designs/);
  assert.match(result.text, /designmd_get_guardrails/);
  assert.match(result.text, /calm reading app/);
});

test('theme-pick refuses to invent themes', async () => {
  const result = await getPrompt('theme-pick', { brand: 'astryx' });
  assert.match(result.text, /designmd_list_themes/);
  assert.match(result.text, /single-look|no themes/i);
});

test('a missing required argument is rejected', async () => {
  await assert.rejects(getPrompt('section-inspiration', {}));
});
