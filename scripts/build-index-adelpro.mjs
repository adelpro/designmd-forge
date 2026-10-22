#!/usr/bin/env node
/**
 * Builds the ADELPRO source: DESIGN.md specs authored in-repo for the
 * maintainer's own projects (open-mushaf-native, open-tarteel, midad, uslub).
 *
 * Unlike the web/mobile/ios sources (which clone an upstream repo and stage a
 * fragment for load-data), this source has no upstream clone — each spec is
 * authored here under scripts/adelpro/<slug>.md — so this script writes the
 * design files into src/data/designs/ and merges each entry into
 * src/data/index.json, preserving every existing design.
 *
 * Entries carry `source: 'adelpro'`, which is provenance, not platform: the
 * specs span `mobile` (Expo / React Native) and `web` (Next.js, Vite), so the
 * platform stays honest about the runtime target and the source filter keeps
 * authored entries distinguishable from borrowed brand systems.
 *
 * It also stages .staging/adelpro.json with a `key` of `adelpro` so a full
 * `npm run refresh-data` (which merges every staged fragment via load-data)
 * keeps this source and its attribution URL, instead of keying it to whichever
 * platform its first design happens to use.
 *
 * Usage: node scripts/build-index-adelpro.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const specsDir = join(root, 'scripts', 'adelpro');
const outDesignsDir = join(root, 'src', 'data', 'designs');
const indexPath = join(root, 'src', 'data', 'index.json');

const CATEGORY = 'Quran & Arabic Tech';
const SOURCE_KEY = 'adelpro';
const SOURCE_URL = 'https://github.com/adelpro';
const SOURCE_LABEL = 'adelpro = Quran & Arabic Tech (authored in-repo, MIT)';

/** The authored set. `flavors` is only set when the flavour file is shipped. */
const ENTRIES = [
  {
    slug: 'midad',
    title: 'midad (مِداد)',
    platform: 'mobile',
    flavors: [],
  },
  {
    slug: 'mushaf-native',
    title: 'Open Mushaf Native',
    platform: 'mobile',
    flavors: [],
  },
  {
    slug: 'open-tarteel',
    title: 'Open Tarteel',
    platform: 'web',
    flavors: [],
  },
  {
    slug: 'uslub',
    title: 'Uslub',
    platform: 'web',
    flavors: [],
  },
];

if (!existsSync(specsDir)) {
  console.error('Missing authored specs directory at', specsDir);
  process.exit(1);
}

mkdirSync(outDesignsDir, { recursive: true });

const index = JSON.parse(readFileSync(indexPath, 'utf-8'));
index.designs ??= [];

const merged = [];
const missing = [];

for (const meta of ENTRIES) {
  const specPath = join(specsDir, `${meta.slug}.md`);
  if (!existsSync(specPath)) {
    missing.push(meta.slug);
    continue;
  }
  const content = readFileSync(specPath, 'utf-8');

  // A spec without frontmatter lints as "No YAML content found" and derives no
  // description, so fail loudly rather than shipping an entry with no blurb.
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  const descLine = fm?.[1]?.match(/^description:\s*(.+)$/m)?.[1];
  if (!descLine) {
    console.error(`[adelpro] ${meta.slug}: missing frontmatter description, skipping.`);
    missing.push(meta.slug);
    continue;
  }
  const shortDescription = descLine.replace(/^["']|["']$/g, '').trim();
  const longDescription = content
    .replace(/^---[\s\S]*?---\n/, '')
    .trim()
    .split(/\n\s*\n/)
    .find((block) => !block.startsWith('#'))
    ?.trim();

  writeFileSync(join(outDesignsDir, `${meta.slug}.md`), content, 'utf-8');

  const entry = {
    slug: meta.slug,
    title: meta.title,
    category: CATEGORY,
    platform: meta.platform,
    source: SOURCE_KEY,
    short_description: shortDescription.slice(0, 160),
    long_description: (longDescription ?? shortDescription).slice(0, 600),
    word_count: content.split(/\s+/).length,
  };
  if (meta.flavors?.length) entry.flavors = meta.flavors;

  const existingIdx = index.designs.findIndex((d) => d.slug === meta.slug);
  if (existingIdx === -1) {
    index.designs.push(entry);
    console.log(`[adelpro] ${meta.slug}: added.`);
  } else {
    index.designs[existingIdx] = entry;
    console.log(`[adelpro] ${meta.slug}: refreshed.`);
  }
  merged.push(entry);
}

if (merged.length === 0) {
  console.error('[adelpro] No specs found, nothing written.');
  process.exit(1);
}

index.sources = { ...index.sources, [SOURCE_KEY]: SOURCE_URL };
index.platforms = [...new Set(index.designs.map((d) => d.platform).filter(Boolean))].sort();
index.categories = [...new Set(index.designs.map((d) => d.category))].sort();
index.count = index.designs.length;

// Keep the note honest: rebuild it from the sources actually present, so the
// authored set is attributed whether it is written here or by load-data.
const NOTE_LABELS = {
  web: 'Web = VoltAgent/awesome-design-md',
  mobile: 'Mobile = TrustOtc/awesome-mobile-design-md',
  ios: 'iOS = Meliwat/awesome-ios-design-md',
  shadcn: 'shadcn = shadcn/ui New York (authored reference)',
  adelpro: SOURCE_LABEL,
};
const presentKeys = Object.keys(index.sources ?? {});
index.note = `Design tokens extracted from publicly visible CSS values of each site, or authored in-repo from the project's own token source, per each source's LICENSE. No trademarked assets, logos, or copyrighted imagery are included. ${presentKeys
  .map((k) => NOTE_LABELS[k] ?? k)
  .join(' · ')}.`;

writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');

const stagingDir = join(root, '.staging');
mkdirSync(stagingDir, { recursive: true });
writeFileSync(
  join(stagingDir, `${SOURCE_KEY}.json`),
  JSON.stringify(
    { key: SOURCE_KEY, label: SOURCE_LABEL, source: SOURCE_URL, license: 'MIT', designs: merged },
    null,
    2
  ),
  'utf-8'
);

const byPlatform = {};
for (const d of index.designs) byPlatform[d.platform] = (byPlatform[d.platform] || 0) + 1;
console.log(
  `[adelpro] index now has ${index.count} designs (${Object.entries(byPlatform)
    .map(([p, c]) => `${p}: ${c}`)
    .join(', ')}).`
);
if (missing.length) {
  console.warn(`[adelpro] missing specs (not shipped yet): ${missing.join(', ')}`);
}
