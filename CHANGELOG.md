# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2026-11-08

### Added

- Authored `open-tilawa` (Tilawah) spec under `Quran & Arabic Tech` (web).
  It documents the shipped one-screen player system from
  `apps/web/src/app/globals.css`: nine semantic tokens, IBM Plex Sans Arabic,
  the spectrum, transport and scrubber anatomy, the sprung phone sheet and the
  hold-to-mute volume gauge.
- Ten new upstream web specs from the refreshed VoltAgent snapshot: `1win`,
  `aljazeera`, `dji`, `jobright`, `mercury`, `mydealz`, `nerdwallet`, `oracle`,
  `oura` and `sap`. Design data is now 300 specs: 84 upstream web, 10 upstream
  mobile, 200 iOS, 1 shadcn and 5 authored Quran & Arabic Tech entries.

### Changed

- Refreshed the bundled upstream snapshot. The web collection grew from 74 to
  84 entries; mobile stayed at 10 and iOS at 200.
- Added `refresh-data:adelpro` and wired it into `npm run refresh-data`, so the
  authored Quran & Arabic Tech specs survive a full refresh and reach
  `load-data` through `.staging/adelpro.json` with their own source key.
- README counts now describe upstream and authored sources separately
  (84 + 10 + 200 + 1 + 5 = 300) instead of reporting platform totals.
- Documented the search boundary in the README, the authoring skill and the
  `designmd_search_designs` / `designmd_get_design_md` tool descriptions:
  search covers metadata only, while `section` and `component` retrieval is
  per design, with a shortlist-then-fetch workflow for regions such as footers
  and menus.

## [1.4.0]

Design data grew from 285 to 289 specs, and the format handling got stricter
about what counts as a section, a component and a flavour.

### Added

- Four authored specs for the maintainer's own projects, under a new
  `Quran & Arabic Tech` category: `midad` and `open-mushaf-native` (mobile),
  `open-tarteel` and `uslub` (web). Each was written from the project's own
  token source, lints with zero errors and zero warnings, and carries a
  `## Motion & Interaction` section with `### Durations & Easings`,
  `### Motion Roles`, `### Reduced Motion` and `### Banned Motion` sub-groups.
- `scripts/build-index-adelpro.mjs`, modelled on the shadcn source: it copies
  the authored specs into `src/data/designs/`, merges each entry idempotently
  by slug, recomputes `platforms` / `categories` / `count`, and stages
  `.staging/adelpro.json` with its own `key` so a full `refresh-data` keeps the
  source's attribution instead of keying it to one platform.
- `source` on index entries, separating authorship from `platform`, plus
  `provenance` and `flavors` in `designmd_get_design_md` output and a `source`
  filter on `designmd_list_designs` and `designmd_search_designs`.
- Per-entry `flavors`: any entry can ship a framework implementation
  (`<slug>-expo.md` and friends), not only `platform: ios`.

### Changed

- `motion` is a canonical section for every platform, not a mobile-only extra.
- `component:` searches the section named by `section:` (default `components`),
  so motion sub-groups are fetchable the same way component groups are.
- `designmd_list_categories` lists the attribution URLs the index actually
  records, so authored sources appear alongside the upstream collections.
- `scripts/load-data.mjs` assembles the provenance note from per-source labels
  instead of hardcoding four of them.
- `designmd_get_guardrails` reports `platform`, `provenance` and the author's
  attribution URL.
- The Dockerfile builds with Yarn through corepack, matching the repo's
  `yarn.lock`; the previous `npm ci` stages could not build at all.

### Fixed

- `## Motion & Interaction` and `## Animation` headings now resolve to `motion`.
  Previously they mapped to nothing and the section was dropped silently, which
  cost any file authored with the fuller heading its entire motion spec.
- `## Anti-Patterns (Banned)` and `## Banned Patterns` now resolve to
  `dos_and_donts`, so guardrails survive files that name the section after the
  anti-patterns.
- A plain `## Responsive` heading now resolves to `responsive`; only
  `## Responsive Behavior` matched before, so the canonical name was dropped.
- `designmd_lint` findings on an unknown frontmatter token map
  (`token-like-ignored`) are now documented rather than discovered: motion
  durations belong in the section body, not the frontmatter.

## [1.3.0] and earlier

Untracked in this file. The collection started as 285 specs across `web`,
`mobile`, `ios` and `shadcn`, with section-level fetching, framework flavours
for iOS, component sub-groups, guardrails, lint, diff, authoring guide and
scaffold tools.
