#!/usr/bin/env node
/**
 * Loads per-source index fragments produced by any build-index-*.mjs script
 * (stored in .staging/) and merges them into the single offline
 * src/data/index.json consumed by the server.
 *
 * Any source that staged a .json fragment is included automatically — add a
 * new upstream collection by writing a build-index-<name>.mjs that stages
 * { source, license, designs[] } to .staging/<name>.json, then run load-data.
 * Design files are written to src/data/designs/ by the per-source scripts;
 * this only assembles index metadata. Safe to run repeatedly.
 *
 * Usage: node scripts/load-data.mjs
 */
import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDataDir = join(__dirname, '..', 'src', 'data');
const stagingDir = join(__dirname, '..', '.staging');

if (!existsSync(stagingDir)) {
  console.error(
    'No .staging/ directory found. Run "npm run refresh-data" (or an individual refresh-data:<source>) first.'
  );
  process.exit(1);
}

const staged = readdirSync(stagingDir)
  .filter((f) => f.endsWith('.json'))
  .sort();
if (staged.length === 0) {
  console.error(
    'No staged data found in .staging/. Run "npm run refresh-data" (or refresh-data:<source>) first.'
  );
  process.exit(1);
}

const fragments = [];
const sources = {};
for (const file of staged) {
  const frag = JSON.parse(readFileSync(join(stagingDir, file), 'utf-8'));
  fragments.push(frag);
  const platform = frag.designs?.[0]?.platform;
  if (frag.source && platform) sources[platform] = frag.source;
}

const designs = fragments.flatMap((f) => f.designs);
designs.sort((a, b) => a.slug.localeCompare(b.slug));

// Primary source attribution: prefer the web source if present, else the first.
const primarySource = sources.web ?? fragments[0]?.source ?? null;

const indexJson = {
  source: primarySource,
  license: fragments[0]?.license ?? 'MIT',
  sources,
  note: 'Design tokens extracted from publicly visible CSS values of each site, per upstream LICENSE notices. No trademarked assets, logos, or copyrighted imagery are included. Web = VoltAgent/awesome-design-md · Mobile = TrustOtc/awesome-mobile-design-md · iOS = Meliwat/awesome-ios-design-md.',
  generated_at: new Date().toISOString(),
  count: designs.length,
  platforms: [...new Set(designs.map((e) => e.platform))].filter(Boolean).sort(),
  categories: [...new Set(designs.map((e) => e.category))].sort(),
  designs,
};

writeFileSync(join(outDataDir, 'index.json'), JSON.stringify(indexJson, null, 2), 'utf-8');

// Clean up staged fragments now that they are merged.
rmSync(stagingDir, { recursive: true, force: true });

const counts = {};
for (const d of designs) counts[d.platform] = (counts[d.platform] || 0) + 1;
console.log(
  `Loaded ${designs.length} designs into src/data/index.json (${Object.entries(counts)
    .map(([p, c]) => `${p}: ${c}`)
    .join(', ')}). Staging cleared.`
);
