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
(MIT licensed) plus the other upstream collections, not something to hand-edit.
To pull a fresh snapshot:

```bash
yarn refresh-data
yarn build
```

Authored sources are the exception: `shadcn` and the `adelpro` set
(`midad`, `mushaf-native`, `open-tarteel`, `uslub`) have no upstream clone.
Their specs live in `scripts/shadcn/` and `scripts/adelpro/`, and
`scripts/build-index-<name>.mjs` writes the design file and merges the index
entry. A full `refresh-data` keeps them because each script also stages a
fragment in `.staging/` with its own `key` and `label`; without that key the
loader would attribute the source to whichever platform its first design uses.

Don't hand-edit files under `src/data/designs/` directly — `refresh-data`
regenerates that whole directory from a fresh clone and will silently
overwrite local changes.

## Scope

This project intentionally stays small: browse/search a bundled reference
collection, fetch full files or sections, extract usage guardrails, lint
structure, and help draft a new file. PRs that grow the scope significantly
(e.g. a different data source, a UI, auth) are worth opening an issue to
discuss first.
