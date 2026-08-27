#!/usr/bin/env node
/**
 * Builds the SHADCN source: the authored design system spec for shadcn/ui
 * (New York) bundled in this repo as scripts/shadcn/shadcn.md.
 *
 * Unlike the web/mobile/ios sources (which clone an upstream repo and stage a
 * fragment for load-data), this source has no upstream clone — the spec is
 * authored here — so this script writes the DESIGN.md into src/data/designs/
 * and merges the single entry directly into src/data/index.json, preserving
 * every existing design. Safe to run repeatedly (idempotent on slug).
 *
 * Usage: node scripts/build-index-shadcn.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcMd = join(root, 'scripts', 'shadcn', 'shadcn.md');
const outDesignsDir = join(root, 'src', 'data', 'designs');
const indexPath = join(root, 'src', 'data', 'index.json');

if (!existsSync(srcMd)) {
  console.error('Missing authored spec at', srcMd);
  process.exit(1);
}

mkdirSync(outDesignsDir, { recursive: true });
const content = readFileSync(srcMd, 'utf-8');
writeFileSync(join(outDesignsDir, 'shadcn.md'), content, 'utf-8');

// One-line description: pull the frontmatter `description:` line.
const fm = content.match(/^---\n([\s\S]*?)\n---/);
const descLine = fm?.[1]?.match(/^description:\s*(.+)$/m)?.[1];
const shortDescription = (descLine ?? 'shadcn/ui New York design system').trim();
const longDescription = content.replace(/^---[\s\S]*?---\n/, '').trim().split(/\n\s*\n/)[0];

const entry = {
  slug: 'shadcn',
  title: 'shadcn/ui (New York)',
  category: 'Component Library',
  platform: 'shadcn',
  short_description: shortDescription.slice(0, 160),
  long_description: longDescription.slice(0, 600),
  word_count: content.split(/\s+/).length,
};

const index = JSON.parse(readFileSync(indexPath, 'utf-8'));

// Idempotent: replace the entry if it already exists, else append.
const existingIdx = index.designs.findIndex((d) => d.slug === 'shadcn');
if (existingIdx === -1) {
  index.designs.push(entry);
  console.log('[shadcn] added new entry to index.');
} else {
  index.designs[existingIdx] = entry;
  console.log('[shadcn] refreshed existing entry in index.');
}

index.sources = { ...index.sources, shadcn: 'https://ui.shadcn.com' };
index.platforms = [...new Set(index.designs.map((d) => d.platform).filter(Boolean))].sort();
index.categories = [...new Set(index.designs.map((d) => d.category))].sort();
index.count = index.designs.length;
index.note =
  'Design tokens extracted from publicly visible CSS values of each site, per upstream LICENSE notices. No trademarked assets, logos, or copyrighted imagery are included. Web = VoltAgent/awesome-design-md · Mobile = TrustOtc/awesome-mobile-design-md · iOS = Meliwat/awesome-ios-design-md · shadcn = shadcn/ui New York (authored reference).';

writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
const byPlatform = {};
for (const d of index.designs) byPlatform[d.platform] = (byPlatform[d.platform] || 0) + 1;
console.log(
  `[shadcn] index now has ${index.count} designs (${Object.entries(byPlatform)
    .map(([p, c]) => `${p}: ${c}`)
    .join(', ')}).`
);

// Also stage a fragment so a full `npm run refresh-data` (which merges every
// .staging/<source>.json via load-data) keeps this source. Harmless standalone.
const stagingDir = join(root, '.staging');
mkdirSync(stagingDir, { recursive: true });
writeFileSync(
  join(stagingDir, 'shadcn.json'),
  JSON.stringify({ source: 'https://ui.shadcn.com', license: 'MIT', designs: [entry] }, null, 2),
  'utf-8'
);