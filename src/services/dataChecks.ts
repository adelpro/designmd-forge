import type { DesignIndex } from '../types.js';

/**
 * Pure corpus checks shared by `scripts/verify-data.mjs` and the test suite.
 *
 * These exist because the verifier's job is to catch a *truncated* index — a
 * `refresh-data` that ran half the sources and then merged. A check that only
 * compares `count` with `designs.length` cannot: load-data sets both.
 */

/** Minimum designs each upstream source must contribute for a full corpus. */
export const MINIMUM_BY_SOURCE: Record<string, number> = {
  web: 70,
  ios: 190,
  mobile: 10,
  shadcn: 1,
  adelpro: 5,
};

export interface CorpusProblem {
  check: string;
  detail: string;
}

export function corpusProblems(index: DesignIndex): CorpusProblem[] {
  const problems: CorpusProblem[] = [];

  if (index.count !== index.designs.length) {
    problems.push({
      check: 'index count',
      detail: `count ${index.count} != designs ${index.designs.length}`,
    });
  }

  for (const [source, minimum] of Object.entries(MINIMUM_BY_SOURCE)) {
    const designs = index.designs.filter((design) => (design.source ?? design.platform) === source);
    if (designs.length < minimum) {
      problems.push({
        check: `source ${source}`,
        detail: `${designs.length} designs, expected at least ${minimum} (a truncated refresh?)`,
      });
    }
  }

  const declared = Object.keys(index.sources ?? {});
  const empty = declared.filter(
    (key) => !index.designs.some((design) => (design.source ?? design.platform) === key)
  );
  if (empty.length) {
    problems.push({ check: 'declared sources', detail: `no designs: ${empty.join(', ')}` });
  }

  return problems;
}
