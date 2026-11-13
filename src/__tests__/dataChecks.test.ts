import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corpusProblems, MINIMUM_BY_SOURCE } from '../services/dataChecks.js';
import { loadIndex } from '../services/designStore.js';

test('the shipped index passes the corpus checks', () => {
  assert.deepEqual(corpusProblems(loadIndex()), []);
});

test('a truncated refresh is caught', () => {
  const full = loadIndex();
  const truncated = {
    ...full,
    designs: full.designs.filter((design) => design.source === 'adelpro'),
  };
  truncated.count = truncated.designs.length;

  const problems = corpusProblems(truncated);
  assert.ok(problems.length > 0, 'a five-design corpus must fail');
  assert.ok(
    problems.some((problem) => problem.check.startsWith('source web')),
    `expected a web-source problem, got ${JSON.stringify(problems)}`
  );
  assert.ok(Object.keys(MINIMUM_BY_SOURCE).length >= 5);
});
