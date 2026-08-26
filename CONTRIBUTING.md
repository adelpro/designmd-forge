# Contributing

This is a small, single-maintainer project. Issues and PRs are welcome, but
keep in mind:

## Setup

```bash
npm install
npm run build
npm test
```

## Before opening a PR

- `npm run build` should succeed with no TypeScript errors.
- `npm test` should pass (runs the suite in `src/__tests__/` via Node's
  built-in test runner — no extra test framework dependency).
- If you touch `src/services/designStore.ts` or `src/services/sectionParser.ts`,
  add or update a test in `src/__tests__/` covering the change.
- If you change a tool's behavior or arguments, update that tool's
  `description` field in the same PR — it's the primary documentation an
  agent sees, and stale descriptions are worse than no documentation.

## Refreshing the bundled data

The reference designs under `src/data/designs/` are a snapshot of
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
(MIT licensed), not something to hand-edit. To pull a fresh snapshot:

```bash
npm run refresh-data
npm run build
```

Don't hand-edit files under `src/data/designs/` directly — `refresh-data`
regenerates that whole directory from a fresh clone and will silently
overwrite local changes.

## Scope

This project intentionally stays small: browse/search a bundled reference
collection, fetch full files or sections, extract usage guardrails, lint
structure, and help draft a new file. PRs that grow the scope significantly
(e.g. a different data source, a UI, auth) are worth opening an issue to
discuss first.
