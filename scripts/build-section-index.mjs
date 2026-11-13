#!/usr/bin/env node
/**
 * Builds src/data/section-index.json: one record per "### " component group of
 * every neutral DESIGN.md, with the group resolved to the canonical vocabulary
 * and its prose-derived facets.
 *
 * Imports the compiled services from dist/ so the resolver and the facet rules
 * are the same code the MCP tools call — a build script that re-implements them
 * drifts the moment either side changes.
 *
 * Neutral specs only: the 600 flavour files (swiftui / expo / android) are not
 * index entries, and indexing them would inflate every count.
 *
 * Usage: node scripts/build-section-index.mjs   (after tsc)
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDesigns, readSpec, countDesignFiles } from './build/lib-corpus.mjs';
import { parseSections, splitRawSections, canonicalSectionFor, getComponentGroups } from '../dist/services/sectionParser.js';
import { resolveGroupHeading } from '../dist/services/groupVocabulary.js';
import { extractFacets } from '../dist/services/groupFacets.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src', 'data');
const outPath = join(dataDir, 'section-index.json');

const designs = loadDesigns(dataDir);
const byKey = new Map();
let designsWithGroups = 0;

for (const design of designs) {
  const content = readSpec(dataDir, design.slug);
  if (!content) {
    console.warn(`[section-index] missing spec file for '${design.slug}', skipped.`);
    continue;
  }

  let found = 0;
  for (const block of splitRawSections(content)) {
    const canonical = canonicalSectionFor(block.heading);
    // Only component and motion blocks carry the "### " group vocabulary.
    // Everything else (colors, typography, layout) uses "### " for sub-topics
    // like "hierarchy" or "semantics", which are not component groups.
    if (canonical && canonical !== 'components' && canonical !== 'motion') continue;
    const section = canonical ?? 'components';

    for (const group of getComponentGroups(block.content)) {
      const text = group.content.trim();
      if (!text) continue;

      const resolved = resolveGroupHeading(group.heading);
      const record = {
        slug: design.slug,
        title: design.title,
        platform: design.platform ?? 'web',
        source: design.source ?? 'upstream',
        section,
        section_heading: block.heading,
        group: resolved.group,
        variant: resolved.variant,
        heading: group.heading,
        matched_alias: resolved.matchedAlias,
        text,
        facets: extractFacets(resolved.group, `${group.heading}\n${text}`),
        derived: true,
      };

      const key = `${record.slug}:${record.section}:${record.group}:${record.variant ?? '-'}`;
      const previous = byKey.get(key);
      if (!previous || record.text.length > previous.text.length) byKey.set(key, record);
      found += 1;
    }
  }
  if (found > 0) designsWithGroups += 1;
}

const groups = [...byKey.values()].sort((a, b) =>
  `${a.slug}:${a.section}:${a.group}`.localeCompare(`${b.slug}:${b.section}:${b.group}`)
);

const byGroup = {};
const bySection = {};
for (const record of groups) {
  byGroup[record.group] = (byGroup[record.group] ?? 0) + 1;
  bySection[record.section] = (bySection[record.section] ?? 0) + 1;
}

const artifact = {
  generated_at: new Date().toISOString(),
  neutral_designs: designs.length,
  designs_with_groups: designsWithGroups,
  excluded_flavor_files: countDesignFiles(dataDir) - designs.length,
  counts: { groups: groups.length, by_group: byGroup, by_section: bySection },
  groups,
};

writeFileSync(outPath, JSON.stringify(artifact, null, 2), 'utf-8');

console.log(
  `[section-index] ${groups.length} groups from ${designsWithGroups}/${designs.length} designs ` +
    `(${artifact.excluded_flavor_files} flavour files excluded).`
);
console.log(
  `[section-index] by group: ${Object.entries(byGroup)
    .sort((a, b) => b[1] - a[1])
    .map(([group, count]) => `${group}=${count}`)
    .join(', ')}`
);

if (!byGroup.footer || !byGroup.buttons) {
  console.error('[section-index] footer or buttons resolved to zero groups — the alias table regressed.');
  process.exit(1);
}
