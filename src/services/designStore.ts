import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { DesignIndex, DesignIndexEntry } from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

let cachedIndex: DesignIndex | null = null;

export function loadIndex(): DesignIndex {
  if (cachedIndex) return cachedIndex;
  const raw = readFileSync(join(DATA_DIR, "index.json"), "utf-8");
  cachedIndex = JSON.parse(raw) as DesignIndex;
  return cachedIndex;
}

export function getEntryBySlug(slug: string): DesignIndexEntry | undefined {
  const normalized = slug.trim().toLowerCase();
  return loadIndex().designs.find((d) => d.slug.toLowerCase() === normalized);
}

export function readDesignMdContent(slug: string): string {
  const path = join(DATA_DIR, "designs", `${slug}.md`);
  return readFileSync(path, "utf-8");
}

export function listCategories(): string[] {
  return loadIndex().categories;
}

/**
 * Lightweight relevance scoring across title, category, short/long
 * description. No external search dependency needed for ~85 documents.
 */
export function searchDesigns(
  query: string,
  opts: { category?: string; platform?: "web" | "mobile" | "ios"; limit?: number } = {}
): Array<DesignIndexEntry & { score: number }> {
  const { designs } = loadIndex();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const scored = designs
    .filter((d) => (opts.category ? d.category.toLowerCase() === opts.category.toLowerCase() : true))
    .filter((d) => (opts.platform ? d.platform === opts.platform : true))
    .map((d) => {
      const haystacks: Array<[string, number]> = [
        [d.title.toLowerCase(), 5],
        [d.slug.toLowerCase(), 4],
        [d.category.toLowerCase(), 2],
        [d.short_description.toLowerCase(), 3],
        [d.long_description.toLowerCase(), 1],
      ];
      let score = 0;
      for (const term of terms) {
        for (const [text, weight] of haystacks) {
          if (text.includes(term)) score += weight;
        }
      }
      return { ...d, score };
    })
    .filter((d) => terms.length === 0 || d.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, opts.limit ?? 20);
}
