import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GroupFacets } from './groupFacets.js';

export interface SectionGroupRecord {
  slug: string;
  brand: string;
  title: string;
  platform: string;
  source: string;
  section: string;
  section_heading: string;
  group: string;
  variant: string | null;
  heading: string;
  matched_alias: string | null;
  text: string;
  facets: GroupFacets;
  derived: true;
}

export interface SectionIndexCoverage {
  neutral_designs: number;
  designs_with_groups: number;
  excluded_flavor_files: number;
  groups: number;
  by_group: Record<string, number>;
}

interface SectionIndexArtifact {
  neutral_designs: number;
  designs_with_groups: number;
  excluded_flavor_files: number;
  counts: { groups: number; by_group: Record<string, number>; by_section: Record<string, number> };
  groups: SectionGroupRecord[];
}

export interface LoadedSectionIndex {
  records: SectionGroupRecord[];
  coverage: SectionIndexCoverage;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

let cached: LoadedSectionIndex | null = null;

/** Loaded lazily: the artifact is ~2 MB and stdio startup should not pay for it. */
export function loadSectionIndex(): LoadedSectionIndex {
  if (cached) return cached;
  const artifact = JSON.parse(
    readFileSync(join(DATA_DIR, 'section-index.json'), 'utf-8')
  ) as SectionIndexArtifact;
  cached = {
    records: artifact.groups,
    coverage: {
      neutral_designs: artifact.neutral_designs,
      designs_with_groups: artifact.designs_with_groups,
      excluded_flavor_files: artifact.excluded_flavor_files,
      groups: artifact.counts.groups,
      by_group: artifact.counts.by_group,
    },
  };
  return cached;
}
