import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface BrandVariant {
  slug: string;
  platform: string;
}

export interface BrandRecord {
  key: string;
  title: string;
  variants: BrandVariant[];
}

export interface LoadedBrands {
  brands: Record<string, BrandRecord>;
  coverage: { brands: number; designs: number };
  bySlug: Map<string, BrandRecord>;
}

interface BrandsArtifact {
  coverage: { brands: number; designs: number };
  brands: Record<string, BrandRecord>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRANDS_PATH = join(__dirname, '..', 'data', 'brands.json');

let cached: LoadedBrands | null = null;

export function loadBrands(): LoadedBrands {
  if (cached) return cached;
  const artifact = JSON.parse(readFileSync(BRANDS_PATH, 'utf-8')) as BrandsArtifact;
  const bySlug = new Map<string, BrandRecord>();
  for (const brand of Object.values(artifact.brands)) {
    for (const variant of brand.variants) bySlug.set(variant.slug, brand);
  }
  cached = { brands: artifact.brands, coverage: artifact.coverage, bySlug };
  return cached;
}

/** The brand a design slug belongs to, with every sibling design it owns. */
export function brandOf(slug: string): BrandRecord | undefined {
  return loadBrands().bySlug.get(slug.trim().toLowerCase());
}
