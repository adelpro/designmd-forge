import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../server.js';

async function withConnectedClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  try {
    return await fn(client);
  } finally {
    await client.close();
    await server.close();
  }
}

test('server exposes exactly the 9 expected tools', async () => {
  await withConnectedClient(async (client) => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    assert.deepEqual(names, [
      'designmd_diff',
      'designmd_get_authoring_guide',
      'designmd_get_design_md',
      'designmd_get_guardrails',
      'designmd_lint',
      'designmd_list_categories',
      'designmd_list_designs',
      'designmd_scaffold_template',
      'designmd_search_designs',
    ]);
  });
});

test('designmd_get_design_md returns full content for a known slug', async () => {
  await withConnectedClient(async (client) => {
    const result = await client.callTool({
      name: 'designmd_get_design_md',
      arguments: { slug: 'stripe' },
    });
    assert.equal(result.isError, undefined);
    const content = (result.content as Array<{ type: string; text: string }>)[0].text;
    assert.ok(content.length > 100);
  });
});

test('designmd_get_design_md errors cleanly on an unknown slug', async () => {
  await withConnectedClient(async (client) => {
    const result = await client.callTool({
      name: 'designmd_get_design_md',
      arguments: { slug: 'not-a-real-site' },
    });
    assert.equal(result.isError, true);
  });
});

test('designmd_search_designs returns ranked results', async () => {
  await withConnectedClient(async (client) => {
    const result = await client.callTool({
      name: 'designmd_search_designs',
      arguments: { query: 'stripe' },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);
    assert.ok(parsed.total_matches >= 1);
    assert.equal(parsed.results[0].slug, 'stripe');
  });
});

test('designmd_lint requires exactly one of content/slug', async () => {
  await withConnectedClient(async (client) => {
    const neither = await client.callTool({ name: 'designmd_lint', arguments: {} });
    assert.equal(neither.isError, true);

    const both = await client.callTool({
      name: 'designmd_lint',
      arguments: { content: 'x', slug: 'stripe' },
    });
    assert.equal(both.isError, true);
  });
});

test('designmd_scaffold_template includes the requested product name', async () => {
  await withConnectedClient(async (client) => {
    const result = await client.callTool({
      name: 'designmd_scaffold_template',
      arguments: { product_name: 'Test Product XYZ' },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    assert.match(text, /Test Product XYZ/);
  });
});

test('designmd_diff reports token changes and regression between two drafts', async () => {
  await withConnectedClient(async (client) => {
    const before = `---
version: alpha
name: Test
colors:
  primary: "#0A2540"
---
## Overview
x`;
    const after = `---
version: alpha
name: Test
colors:
  primary: "#FF0000"
---
## Overview
x`;
    const result = await client.callTool({
      name: 'designmd_diff',
      arguments: {
        before: { content: before },
        after: { content: after },
      },
    });
    assert.equal(result.isError, undefined);
    const sc = result.structuredContent as {
      regression: boolean;
      tokens: { colors: { modified: string[] } };
    };
    assert.ok(typeof sc.regression === 'boolean');
    assert.deepEqual(sc.tokens.colors.modified, ['primary']);
  });
});

test('designmd_diff errors when a side has no content or slug', async () => {
  await withConnectedClient(async (client) => {
    const result = await client.callTool({
      name: 'designmd_diff',
      arguments: { before: {}, after: { content: '---\nversion: alpha\n---' } },
    });
    assert.equal(result.isError, true);
  });
});
