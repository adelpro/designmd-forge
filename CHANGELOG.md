# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.1]

Documentation-only patch. No tool, argument, response shape or data changed.

### Changed

- The docs landing page opens with a 152px masthead — wordmark, eyebrow, one-line
  promise, nav — that collapses to 64px over the first 260px of scroll, driven by
  a CSS scroll timeline in `docs/assets/main.scss`. No JavaScript, no dependency,
  and no motion at all under `prefers-reduced-motion: reduce`.
- `docs/_includes/header.html` overrides minima 2.5.1 to render that masthead
  when a page sets `hero: true`. Every other docs page keeps the theme's header
  verbatim.
- `docs/index.md` carries `hero`, `layout` and `title` in front matter and no
  longer repeats its title as a content H1, which removes the duplicate heading
  `jekyll-default-layout` was producing on the home layout.
- `docs/_config.yml` gains `masthead_eyebrow`, `masthead_tagline`, `masthead_nav`,
  and excludes `superpowers/` from the published site.

## [2.1.0]

Additive data release: three new authored specs, and the first entries extracted from a
live storefront rather than an upstream collection. No tool, argument or response shape
changed.

### Added

- `masjid-al-haram` (**Quran & Arabic Tech**) — a palette-led board: ivory ground
  (`#E8E1D6`), sand and taupe mid-tones, `#2B2B2B` ink and one brushed gold accent
  (`#B8945A`), with Arabic calligraphic display type and tracked serif capitals.
- `markastore-dz` (**E-commerce & Retail**) — Woodmart storefront: white ground, hairline
  greys, `#EA2430` brand red, green prices (`#1fa84a`), 11px uppercase nav, four-column
  product grid, 1222px container.
- `kiabi-dz` (**E-commerce & Retail**) — Shopify storefront: Figtree throughout, deep navy
  (`#040037`) on headings and 900-weight prices, 2px black outlined buttons at 0 radius.

### Changed

- Palette coverage is 83 of 304 designs (was 80 of 301); the corpus is 304 design specs and
  904 spec files.
- `scripts/verify-data.mjs` now requires the three new slugs, so a future `refresh-data`
  that drops them fails the check instead of shipping quietly.
- `paletteArtifact.test.ts` asserts a prose-only floor (>200) instead of an absolute ceiling
  on derived palettes — the old `<= 80` band failed on legitimate corpus growth while the
  regression it guarded against (regexing palettes out of prose) is still caught.

## [2.0.1]

Patch release: the documentation site moved to its own domain, and everything that
advertised the old GitHub Pages path now points at the new one. No tool or behaviour
changed.

### Changed

- Documentation links use `https://adelpro.us.kg/designmd-forge/`: the README, `docs/llms.txt`,
  the 2.0.0 notes, and `DOCS_SITE` in `src/httpServer.ts` — so the HTTP server's index JSON and
  its `/llms` redirect no longer advertise a URL that 404s.
- `package.json` `homepage` and `server.json` `websiteUrl` name the docs site.
- `docs/_config.yml` sets `url:`, so the generated canonical and Open Graph tags are absolute
  instead of relative.

### Fixed

- The docs claimed 290 designs and 890 files. The corpus is 301 designs and 901 files, and
  palette coverage is 80 designs, not 70.

## [2.0.0]

Sections searched across the collection, brands deduplicated, palettes derived, official
themes exposed, MCP prompts added — a major version because the surface moved, not because
anything was removed. No tool or parameter was deleted; the two behaviour changes are listed
below so an existing caller is not surprised.

### Added

- `designmd_search_sections` — search `### Footer` / `### Buttons` / `### Navigation` groups
  ACROSS designs, by text (synonym-expanded: hamburger → menu button / drawer / bottom bar;
  3d → bevel / raised) and by derived facets (`has`, `position`). 1,474 groups from 289
  designs; 600 flavour files are excluded from the index and the response says so.
- `designmd_list_themes` — the official variants a system ships. Astryx's seven
  (butter, chocolate, gothic, matcha, neutral, stone, y2k) with mode, display/body pairing and
  accent hue; `designmd_get_design_md` gains `theme`, which returns a delta rather than a copy
  of the parent entry.
- `designmd_search_designs` gains `brand`, `mode` and `hue` filters, and accepts an empty query
  when a filter is present. Palette filters print their own coverage.
- Four MCP prompts: `pick-a-design`, `section-inspiration`, `theme-pick`, `author-design-md`.
  Prompts are user-invoked procedures, not skills.
- Authored **Astryx (Meta)** reference spec in `Component Library`, MIT, pinned to theme
  release 0.7.15 with an `upstream` block for attribution.
- `scripts/verify-data.mjs` (8 offline checks) and `npm run verify-data`.

### Changed

- `refresh-data` now runs every source that stages fragments, including `adelpro` and `astryx`,
  then `load-data`, `build` and `verify-data`.

### Fixed

- `npm run refresh-data` silently dropped the four authored entries: it never ran
  `build-index-adelpro`, and `load-data` rebuilds `index.json` from staged fragments only, so a
  documented refresh took the index from 289 to 285 designs.
- `parseSections` drops any `## ` block whose heading is not in the alias table, which hid
  component groups under unmapped section titles; the index build now uses `splitRawSections`.
- `palettes.json` no longer treats an `on-dark` contrast pair as a dark mode, and a `link`
  colour no longer outranks the brand accent.

### Note on 1.5.0

`1.5.0` (2026-11-08, commit `c89a36c`) was published before this branch was cut and is now part
of the history this release builds on: nine upstream web designs, the `open-tilawa` authored
spec, palette-reference fixes, and the `refresh-data:adelpro` step. 2.0.0 supersedes it.

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
