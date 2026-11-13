import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYNONYM_PATH = join(__dirname, '..', 'data', 'section-synonyms.json');

let cache: Record<string, string[]> | null = null;

/**
 * Query-time only: the map is read once and never baked into the index, so
 * recall can be tuned without a rebuild (unlike section-aliases.json, whose
 * edits invalidate every classified heading).
 */
function loadSynonyms(): Record<string, string[]> {
  if (!cache) {
    cache = JSON.parse(readFileSync(SYNONYM_PATH, 'utf-8')) as Record<string, string[]>;
  }
  return cache;
}

export function resetSynonymCache(): void {
  cache = null;
}

/**
 * One array per input term: the term itself first, then its expansions.
 * Unknown terms expand to themselves only — never to a guess.
 */
export function expandTerms(terms: string[]): string[][] {
  const synonyms = loadSynonyms();
  return terms.map((term) => {
    const key = term.trim().toLowerCase();
    const expansions = synonyms[key] ?? [];
    return [...new Set([key, ...expansions])];
  });
}
