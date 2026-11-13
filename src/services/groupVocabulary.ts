/**
 * Canonical vocabulary for the "### " component sub-groups inside a DESIGN.md
 * section, plus the resolver that maps a file's own heading (names vary per
 * design) onto that vocabulary.
 *
 * Motion section groups share this enum: a record always carries the section it
 * came from, so `durations_easings` inside `motion` and `buttons` inside
 * `components` never collide.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CANONICAL_GROUPS = [
  'header',
  'navigation',
  'footer',
  'buttons',
  'cards',
  'inputs',
  'modals',
  'tables',
  'tabs',
  'badges',
  'avatars',
  'icons',
  'lists',
  'empty_states',
  'durations_easings',
  'motion_roles',
  'reduced_motion',
  'banned_motion',
  'other',
] as const;

export type CanonicalGroup = (typeof CANONICAL_GROUPS)[number];

export interface ResolvedHeading {
  group: CanonicalGroup;
  /** A qualifier the file wrote (sticky, signature, 3d), joined with "+" when several. */
  variant: string | null;
  /** The alias that produced the match, or null when the heading is unknown. */
  matchedAlias: string | null;
}

interface AliasFile {
  groups: Record<string, string[]>;
  variants?: Record<string, Record<string, string[]>>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALIAS_PATH = join(__dirname, '..', 'data', 'section-aliases.json');

let cachedAliases: AliasFile | null = null;

function loadAliases(): AliasFile {
  if (!cachedAliases) {
    cachedAliases = JSON.parse(readFileSync(ALIAS_PATH, 'utf-8')) as AliasFile;
  }
  return cachedAliases;
}

/** Reset the module cache (tests that rewrite the alias file use this). */
export function resetAliasCache(): void {
  cachedAliases = null;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Whole-word containment, so "nav" never matches "navigator". */
function containsWord(haystack: string, needle: string): boolean {
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(needle)}([^a-z0-9]|$)`);
  return re.test(haystack);
}

interface NormalizedHeading {
  base: string;
  qualifiers: string[];
}

function normalizeHeading(rawHeading: string): NormalizedHeading {
  const cleaned = rawHeading
    .replace(/^\d+\.\s*/, '')
    .trim()
    .toLowerCase();
  const qualifiers: string[] = [];
  const base = cleaned
    .replace(/\(([^)]*)\)/g, (_match, inner: string) => {
      qualifiers.push(inner.trim());
      return ' ';
    })
    .replace(/\s+/g, ' ')
    .trim();
  return { base, qualifiers };
}

export function resolveGroupHeading(rawHeading: string): ResolvedHeading {
  const { base, qualifiers } = normalizeHeading(rawHeading);
  const aliases = loadAliases();

  // A heading can name two things ("Navigation & Menu", "CTA / Footer"). Test
  // the whole string plus each side of the separator, and take the longest
  // alias that matches — that is what keeps "Navigation & Menu" out of two
  // groups at once.
  const fragments = [base, ...base.split(/\s*[/&,+]\s*/)]
    .map((fragment) => fragment.trim())
    .filter(Boolean);

  let best: { alias: string; group: CanonicalGroup } | null = null;
  for (const [group, list] of Object.entries(aliases.groups)) {
    for (const alias of list) {
      if (!fragments.some((fragment) => containsWord(fragment, alias))) continue;
      if (!best || alias.length > best.alias.length) {
        best = { alias, group: group as CanonicalGroup };
      }
    }
  }

  if (!best) return { group: 'other', variant: null, matchedAlias: null };

  const variantWords = aliases.variants?.[best.group] ?? {};
  const haystacks = [base, ...qualifiers];
  const variants = Object.entries(variantWords)
    .filter(([, words]) => words.some((word) => haystacks.some((h) => containsWord(h, word))))
    .map(([name]) => name);

  return {
    group: best.group,
    variant: variants.length ? variants.join('+') : null,
    matchedAlias: best.alias,
  };
}
