# What's new in DesignMD Forge v2.0

Version 2.0.0 · 2026-11-13. No tool was removed; the surface moved, so the major version says so. Three things happened: the server learned two questions it could not answer, it gained a data layer underneath, and two behaviours changed in ways a previous caller would notice.

## New capabilities

**Sections across the whole collection.** `designmd_search_sections` searches `### Footer`, `### Buttons`, `### Navigation` and the rest _across_ designs. Before, `designmd_search_designs` searched titles and descriptions only, so "footers with social links" had no answer. Query words are expanded through a synonym map (hamburger → menu button, drawer, bottom bar; 3d → bevel, raised), and each result carries facets derived from the prose: items, states, traits, position, divider, columns. 1,474 groups from 289 designs; 600 flavour files are excluded and every response says so.

**Brands instead of collections.** One product can exist twice — `spotify` (web) and `ios-spotify` (iOS). Results now carry a `brand` key and collapse to one row per brand per group, listing the platforms it came from. 289 designs become 275 brands; `bmw` and `bmw-m` stay separate because they are different products.

**Derived palettes.** `designmd_search_designs` gained `mode`, `hue` and `brand` filters, computed from each design's declared `colors:`. `mode: "dark"` means dark-compatible, never a light-only system. The two traps are handled: `primary` is a button fill in one file and body ink in another (a luminance floor decides), and an `on-dark` contrast pair is not a dark mode.

**Official themes.** `designmd_list_themes` lists the variants a system actually ships — Astryx's seven, pinned to 0.7.15, each with mode, display/body pairing and accent. `designmd_get_design_md` with `theme` returns a **delta**: palette plus type, never a copy of the parent's components or guardrails.

**MCP prompts.** Four user-invoked procedures: `pick-a-design`, `section-inspiration`, `theme-pick`, `author-design-md`. Prompts are not skills — they are templates a client surfaces as slash commands, and clients without prompt support lose nothing because the same procedures live in `skill/designmd-authoring`.

## Changed behaviour

- `designmd_search_designs` accepts an **empty query when a filter is present** ("show me dark red systems" has no words for the description search). With no query and no filter it still refuses.
- Multi-word `text` in `designmd_search_sections` is **AND**, with a stopword list so "social links" is a search for _social_, not for _links_. `"3d hover"` returns 2 genuinely 3D-and-hover buttons, not 47 loose ones.
- Palette-filtered responses print their own coverage: **69 of 290**, of which 221 are prose-only.

## Deliberately absent

- **Flavour files are not indexed.** 600 duplicates of the iOS designs would triple every count.
- **221 designs have no palette.** Their colour lives in sentences; a regexed palette would look authoritative and be wrong.
- **No mood taxonomy.** "Minimalist" stays free text over descriptions — no invented `mood` field.
- **Only Astryx ships themes.** A derived palette is not a theme, and the tool says so when a brand has none.
- **No MCP resources.** They would duplicate `get_design_md`, and `resources/subscribe` needs session state this stateless server does not keep.

## See it run

[Worked examples](examples.md) has reproducible transcripts: a footer search, a 3D button search, a palette filter, a theme listing and a theme delta. Every block states its numbers and keeps them.
