import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

test('README opens with what is new, before the tool reference', () => {
  const content = readme();
  const whatsNew = content.indexOf("## What's new in v2.0");
  const tools = content.indexOf('## Tools');
  assert.ok(whatsNew > -1, 'README needs a top "What\'s new in v2.0" section');
  assert.ok(whatsNew < tools, "the what's-new section must come before the tool table");
  assert.match(content.slice(whatsNew, tools), /whats-new-v2\.html/);
});

test('the v2 notes say what is new, what changed and what is absent', () => {
  const notes = readFileSync(new URL('../../docs/whats-new-v2.md', import.meta.url), 'utf-8');
  assert.match(notes, /designmd_search_sections/);
  assert.match(notes, /designmd_list_themes/);
  assert.match(notes, /examples\.md/);
  assert.match(notes, /deliberately absent/i);
  assert.match(notes, /2\.0\.0/);
});

test('every tool and prompt is in llms.txt', async () => {
  const llms = readFileSync(new URL('../../docs/llms.txt', import.meta.url), 'utf-8');
  for (const name of await listToolNames())
    assert.ok(llms.includes(name), `llms.txt missing ${name}`);
  for (const prompt of await listPrompts()) {
    assert.ok(llms.includes(prompt.name), `llms.txt missing ${prompt.name}`);
  }
});

test('the docs site index only links to pages that exist', () => {
  const index = readFileSync(new URL('../../docs/index.md', import.meta.url), 'utf-8');
  for (const [, target] of index.matchAll(/\]\((?:\.\/)?([a-z0-9-]+\.md)\)/gi)) {
    assert.ok(
      existsSync(new URL(`../../docs/${target}`, import.meta.url)),
      `docs/index.md links to missing ${target}`
    );
  }
});

test('examples reference only real tools', async () => {
  const examples = readFileSync(new URL('../../docs/examples.md', import.meta.url), 'utf-8');
  const names = new Set(await listToolNames());
  const referenced = [...examples.matchAll(/designmd_[a-z_]+/g)].map((match) => match[0]);
  assert.ok(referenced.length >= 8, 'examples should show several tools');
  for (const name of referenced)
    assert.ok(names.has(name), `example references unknown tool ${name}`);
});

test('server.json matches the package identity', () => {
  const server = JSON.parse(
    readFileSync(new URL('../../server.json', import.meta.url), 'utf-8')
  ) as {
    name: string;
    version: string;
    description: string;
    packages: Array<{ registryType: string; identifier: string; transport: { type: string } }>;
    remotes: Array<{ type: string; url: string }>;
  };
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')) as {
    name: string;
    version: string;
    mcpName: string;
    files: string[];
  };
  assert.equal(server.name, pkg.mcpName, 'server.json name must equal package.json mcpName');
  assert.equal(server.name, 'io.github.adelpro/designmd-forge');
  assert.equal(server.version, pkg.version);
  assert.ok(server.description.length <= 100, 'the registry caps description at 100 chars');
  assert.equal(server.packages[0].registryType, 'npm');
  assert.equal(server.packages[0].identifier, pkg.name);
  assert.equal(server.packages[0].transport.type, 'stdio');
  assert.equal(server.remotes[0].type, 'streamable-http');
  assert.deepEqual(pkg.files, ['dist', 'docs'], 'the tarball must carry the docs');
});
