import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DerivedPalette } from './palette.js';

export interface PalettesCoverage {
  designs_total: number;
  designs_with_palette: number;
  skipped_prose_only: number;
}

export interface LoadedPalettes {
  coverage: PalettesCoverage;
  palettes: Record<string, DerivedPalette>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = join(__dirname, '..', 'data', 'palettes.json');

let cached: LoadedPalettes | null = null;

export function loadPalettes(): LoadedPalettes {
  if (cached) return cached;
  cached = JSON.parse(readFileSync(PALETTES_PATH, 'utf-8')) as LoadedPalettes;
  return cached;
}

/** Undefined for the 220 specs that describe colour in prose only. */
export function paletteOf(slug: string): DerivedPalette | undefined {
  return loadPalettes().palettes[slug.trim().toLowerCase()];
}
