#!/usr/bin/env node
/**
 * Builds src/data/palettes.json: the mode / accent hue / temperature of every
 * design that declares a frontmatter `colors:` block.
 *
 * 220 of the 289 specs (the iOS app set and the mobile archetypes) describe
 * colour in prose with no tokens at all. They are counted as skipped and never
 * appear as derived palettes — a palette regexed out of sentences would look
 * authoritative and be wrong.
 *
 * Usage: node scripts/build-palettes.mjs   (after tsc)
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDesigns, readSpec } from './build/lib-corpus.mjs';
import { derivePalette } from '../dist/services/palette.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src', 'data');
const outPath = join(dataDir, 'palettes.json');

/** Reads the `colors:` block of a YAML frontmatter. Two-space nested keys only. */
function parseColors(markdown) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) return null;

  const lines = frontmatter[1].split('\n');
  const start = lines.findIndex((line) => /^colors:\s*$/.test(line));
  if (start === -1) return null;

  const colors = {};
  for (const line of lines.slice(start + 1)) {
    if (!/^\s+\S/.test(line)) break;
    const match = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.+?)\s*$/);
    if (!match) continue;
    colors[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return Object.keys(colors).length ? colors : null;
}

const designs = loadDesigns(dataDir);
const palettes = {};
let skipped = 0;

for (const design of designs) {
  const markdown = readSpec(dataDir, design.slug);
  if (!markdown) continue;

  const colors = parseColors(markdown);
  const palette = colors ? derivePalette(colors) : null;
  if (!palette) {
    skipped += 1;
    continue;
  }
  palettes[design.slug] = palette;
}

const artifact = {
  coverage: {
    designs_total: designs.length,
    designs_with_palette: Object.keys(palettes).length,
    skipped_prose_only: skipped,
  },
  palettes,
};

writeFileSync(outPath, JSON.stringify(artifact, null, 2), 'utf-8');

const modes = {};
for (const palette of Object.values(palettes)) modes[palette.mode] = (modes[palette.mode] ?? 0) + 1;
const hues = {};
for (const palette of Object.values(palettes))
  hues[palette.accentHue] = (hues[palette.accentHue] ?? 0) + 1;

console.log(
  `[palettes] ${artifact.coverage.designs_with_palette} of ${designs.length} designs carry a declared palette ` +
    `(${skipped} prose-only, skipped).`
);
console.log(`[palettes] modes: ${JSON.stringify(modes)}`);
console.log(`[palettes] accents: ${JSON.stringify(hues)}`);

if (artifact.coverage.designs_with_palette === 0) {
  console.error('[palettes] no palettes derived — the frontmatter parser regressed.');
  process.exit(1);
}
