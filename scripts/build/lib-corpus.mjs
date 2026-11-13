import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Index entries are the neutral specs: flavour files never appear here. */
export function loadDesigns(dataDir) {
  const index = JSON.parse(readFileSync(join(dataDir, 'index.json'), 'utf-8'));
  return index.designs ?? [];
}

export function readSpec(dataDir, slug) {
  const path = join(dataDir, 'designs', `${slug}.md`);
  return existsSync(path) ? readFileSync(path, 'utf-8') : null;
}

export function countDesignFiles(dataDir) {
  return readdirSync(join(dataDir, 'designs')).filter((file) => file.endsWith('.md')).length;
}
