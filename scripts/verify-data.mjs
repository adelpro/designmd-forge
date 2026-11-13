#!/usr/bin/env node
/**
 * Offline checks over the shipped artifacts. Runs after `npm run build` (and at
 * the end of `npm run refresh-data`) so a data refresh cannot quietly drop a
 * source, a design file or a theme.
 *
 * Reads committed/generated files only — no network, no rebuild.
 *
 * Usage: node scripts/verify-data.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src', 'data');

const failures = [];
let checks = 0;

function check(name, fn) {
  checks += 1;
  try {
    const detail = fn();
    console.log(`ok   ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

const index = JSON.parse(readFileSync(join(dataDir, 'index.json'), 'utf-8'));

check('index count matches design list', () => {
  if (index.count !== index.designs.length) {
    throw new Error(`count ${index.count} != designs ${index.designs.length}`);
  }
  return `${index.count} designs`;
});

check('every design has a spec file', () => {
  const missing = index.designs.filter(
    (design) => !existsSync(join(dataDir, 'designs', `${design.slug}.md`))
  );
  if (missing.length) throw new Error(`missing files: ${missing.map((d) => d.slug).join(', ')}`);
});

check('every declared source has a design', () => {
  const keys = Object.keys(index.sources ?? {});
  const empty = keys.filter(
    (key) => !index.designs.some((design) => (design.source ?? design.platform) === key)
  );
  if (empty.length) throw new Error(`sources with no designs: ${empty.join(', ')}`);
  return keys.join(', ');
});

check('authored entries are present', () => {
  const required = ['midad', 'mushaf-native', 'open-tarteel', 'uslub', 'astryx'];
  const missing = required.filter((slug) => !index.designs.some((d) => d.slug === slug));
  if (missing.length) throw new Error(`missing: ${missing.join(', ')}`);
  return required.join(', ');
});

check('themes artifact covers seven variants', () => {
  const themes = JSON.parse(readFileSync(join(dataDir, 'themes.json'), 'utf-8'));
  const count = themes.parents?.astryx?.themes?.length ?? 0;
  if (count !== 7) throw new Error(`expected 7 astryx themes, found ${count}`);
  return `pinned ${themes.pin.version}`;
});

check('palette coverage adds up', () => {
  const palettes = JSON.parse(readFileSync(join(dataDir, 'palettes.json'), 'utf-8'));
  const { designs_total, designs_with_palette, skipped_prose_only } = palettes.coverage;
  if (designs_total !== index.designs.length) {
    throw new Error(`palettes cover ${designs_total} designs, index has ${index.designs.length}`);
  }
  if (designs_with_palette + skipped_prose_only !== designs_total) {
    throw new Error(`${designs_with_palette} + ${skipped_prose_only} != ${designs_total}`);
  }
  return `${designs_with_palette}/${designs_total} declared`;
});

check('section index excludes flavour files', () => {
  const sections = JSON.parse(readFileSync(join(dataDir, 'section-index.json'), 'utf-8'));
  const flavoured = sections.groups.filter((group) => /-(swiftui|expo|android)$/.test(group.slug));
  if (flavoured.length) throw new Error(`${flavoured.length} flavour slugs indexed`);
  return `${sections.counts.groups} groups`;
});

check('no stray flavour-only design files are counted as designs', () => {
  const files = readdirSync(join(dataDir, 'designs')).filter((file) => file.endsWith('.md'));
  const neutral = new Set(index.designs.map((design) => `${design.slug}.md`));
  const extras = files.filter((file) => !neutral.has(file));
  return `${extras.length} flavour files on disk, ${files.length - extras.length} neutral`;
});

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}

console.log(`\nverify-data: ${checks} checks passed.`);
