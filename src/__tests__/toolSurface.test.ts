import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listTools } from './helpers.js';

test('every tool declares the house description blocks', async () => {
  for (const tool of await listTools()) {
    assert.match(tool.description ?? '', /Args:/, `${tool.name} has no Args:`);
    assert.match(tool.description ?? '', /Returns:/, `${tool.name} has no Returns:`);
  }
});

test('the three discovery tools say when NOT to use them', async () => {
  const tools = await listTools();
  for (const name of [
    'designmd_search_designs',
    'designmd_search_sections',
    'designmd_list_themes',
  ]) {
    const tool = tools.find((candidate) => candidate.name === name);
    assert.ok(tool, `${name} not registered`);
    assert.match(tool!.description ?? '', /Don't use when/, `${name} has no Don't use when`);
  }
});

test('tool payload stays inside the context budget', async () => {
  const tools = await listTools();
  const size = JSON.stringify(tools).length;
  // Measured 2026-11-13: 32,391 chars for 11 tools (get_design_md alone is
  // 7,513). The budget guards against creep; it is not a target to shave.
  assert.ok(size < 34_000, `tool listing is ${size} chars`);
});

test('every tool is annotated read-only', async () => {
  for (const tool of await listTools()) {
    assert.equal(tool.annotations?.readOnlyHint, true, `${tool.name} not readOnly`);
  }
});
