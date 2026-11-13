# DesignMD Forge

**[Docs](https://adelpro.us.kg/designmd-forge/)** · [What's new in v2](https://adelpro.us.kg/designmd-forge/whats-new-v2.html) · [Examples](https://adelpro.us.kg/designmd-forge/examples.html) · [Tool surface](https://adelpro.us.kg/designmd-forge/mcp-tool-surface.html) · [npm](https://www.npmjs.com/package/designmd-forge)

DesignMD Forge is a free MCP server for browsing and searching **DESIGN.md** files. These are plain text design system documents (colors, typography, components, layout) that AI coding agents read to generate UI matching a target visual style.

Data is a bundled, offline snapshot of five sources — 84 **web** design systems from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), 10 **mobile** archetypes from [TrustOtc/awesome-mobile-design-md](https://github.com/TrustOtc/awesome-mobile-design-md), 200 **iOS** app design systems from [Meliwat/awesome-ios-design-md](https://github.com/meliwat/awesome-ios-design-md), an original authored **shadcn/ui (New York)** reference, and six authored specs — five of the maintainer's own projects under **Quran & Arabic Tech** (`midad`, `open-mushaf-native`, `open-tarteel`, `open-tilawa`, `uslub`) and **Astryx (Meta)** under **Component Library**, MIT and pinned to its published theme release — **301 design specs in total** (1,532 component groups indexed). No paid API, no rate limits, no network calls at runtime. The upstream sources extract only publicly visible CSS / app values (colors, type scale, spacing) and the authored entries are written from each project's own token source — no logos, trademarks, or copyrighted imagery are included, so it is safe to redistribute and reuse.

## What's new in v2.0

Five capabilities, two behaviour changes, and a list of what is deliberately absent — full notes at [docs/whats-new-v2.html](https://adelpro.us.kg/designmd-forge/whats-new-v2.html).

- **Component patterns across the collection** — `designmd_search_sections` finds "footers with social links" or "3D or hover buttons" by reading the `### Footer` / `### Buttons` prose of every design, which the brand search could never do.
- **Brands, not collections** — the same product in two sets (`spotify` + `ios-spotify`) is one row, with both platforms listed.
- **Derived palettes** — `mode`, `hue` and `brand` filters computed from declared tokens, and every filtered response prints its coverage (80 of 301).
- **Official themes** — Astryx's seven with mode and type pairing; `theme` returns a delta, never a copy of the parent.
- **MCP prompts** — `pick-a-design`, `section-inspiration`, `theme-pick`, `author-design-md`.

Behaviour changes: `search_designs` accepts an empty query when a filter is set, and multi-word section text is AND with a stopword list. Worked, reproducible transcripts: [docs/examples.html](https://adelpro.us.kg/designmd-forge/examples.html).

## Tools

| Tool                           | Purpose                                                                                                                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `designmd_list_categories`     | List all categories with counts, optionally filtered by platform (e.g. "Fintech & Crypto", "Automotive", "Mobile")                                                                                  |
| `designmd_list_designs`        | List all designs, optionally filtered by category, platform (`web` / `mobile` / `ios` / `shadcn`) or provenance (`source`: `upstream` / `adelpro`) — title, slug, one-line description              |
| `designmd_search_designs`      | Free-text search over title/slug/category/description, ranked by relevance, optionally filtered by category/platform/source                                                                         |
| `designmd_search_sections`     | Search component groups (footer, buttons, navigation, cards…) **across** designs, by text and derived facets (items, states, traits, position) — "footers with social links", "3D or hover buttons" |
| `designmd_list_themes`         | List the official theme variants a system ships (Astryx's seven) with mode, type pairing and accent hue — not a corpus palette search                                                               |
| `designmd_get_design_md`       | Fetch the full DESIGN.md, one section, one `### ` sub-group of any section, or a framework flavor (swiftui/expo/android) where the entry declares one, for one design by slug                       |
| `designmd_get_guardrails`      | Fetch only the "Do's and Don'ts" section — behavioral rules, not token values                                                                                                                       |
| `designmd_lint`                | Validate a DESIGN.md's structure using the official `@google/design.md` linter                                                                                                                      |
| `designmd_diff`                | Compare two DESIGN.md files (token-level) with the official CLI and flag regressions                                                                                                                |
| `designmd_get_authoring_guide` | Fetch condensed, field-tested guidance on _writing_ a DESIGN.md's prose                                                                                                                             |
| `designmd_scaffold_template`   | Generate a fill-in-the-blank DESIGN.md skeleton, prompted around the highest-leverage sections                                                                                                      |

Three flows this server supports:

- **Reference an existing design system**: `designmd_search_designs` or `designmd_list_designs` to find a slug → `designmd_get_design_md` to pull the full file (or `designmd_get_guardrails` for just the usage rules) → paste into your project root and tell your coding agent to follow it.
- **Find a component pattern across the collection**: `designmd_search_sections` with a group (`footer`, `buttons`, `navigation`) plus words or facets — "footers with social links", "3D or hover buttons" — returns ranked excerpts with derived items/states/traits, then `designmd_get_design_md` with `component` reads the whole group. This is the query `designmd_search_designs` cannot answer: it searches titles and descriptions only.
- **Author your own**: `designmd_get_authoring_guide` → `designmd_scaffold_template` → fill in the prose (see the companion skill below) → `designmd_lint` before committing.

### Themes vs palettes

Two different things, deliberately not merged:

- `designmd_list_themes` lists **official variants a system ships**. Only Astryx ships official variants today (butter, chocolate, gothic, matcha, neutral, stone, y2k), each with a mode, a display/body type pairing and an accent. `designmd_get_design_md` with `theme` returns a **delta**, never a second copy of the parent's components.
- `designmd_search_designs` with `mode` / `hue` filters **derived palettes** of the designs that declare tokens. These are single looks, not variants, so they are never called themes.

### What is not searchable

- **Flavour files are not indexed.** 600 of the 890 markdown files are SwiftUI / Expo / Android implementations of the same iOS design; indexing them would triple every count. Fetch one with `designmd_get_design_md` + `flavor`.
- **Prose-only designs have no facets or palettes.** The 200 iOS app specs and 12 mobile archetypes describe colour in sentences; a palette regexed out of prose would look authoritative and be wrong.
- **Palette filters cover a subset.** The tool prints its own coverage (`palette filters cover 80 of 301` today); a filtered result is not a corpus-wide answer.
- **No mood taxonomy.** "Minimalist" stays free text over descriptions — there is no invented `mood` field.

### Prompts

Four prompts ship with the server. Prompts are not skills: a client surfaces them as a prompt list or slash commands, they are user-invoked procedures rather than auto-loaded context, and clients without prompt support lose nothing because the same procedures live in `skill/designmd-authoring`.

| Prompt                | Argument    | Procedure                                                                                                                      |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `pick-a-design`       | `brief`     | `designmd_search_designs` → `designmd_get_design_md` → `designmd_get_guardrails`, returns a ranked shortlist                   |
| `section-inspiration` | `component` | `designmd_search_sections` → `designmd_get_design_md(component:)`, returns 3–5 candidates plus a synthesis against your tokens |
| `theme-pick`          | `brand`     | `designmd_list_themes` → `designmd_get_design_md(theme:)`, and says "no themes" when there are none                            |
| `author-design-md`    | `project`   | authoring guide → scaffold → lint until 0 errors / 0 warnings                                                                  |

### Prompt list vs tool list

If your client only shows tools, nothing is lost — every prompt is a short procedure you can run by hand, and the bundled skill (`skill/designmd-authoring`) covers the authoring loop end to end.

### Why there's a dedicated guardrails tool, and a linter, and an authoring guide

Color hex codes and type scales tell an agent _what_ the values are, not _how_ to use them. Token-only DESIGN.md files reliably produce token-correct but decision-wrong output — an agent applying a brand accent color as a background tint on every info banner, or giving every card the same shadow regardless of hierarchy. Two things address this from different angles:

- Each bundled file's "Do's and Don'ts" section is where usage rules and anti-patterns live — `designmd_get_guardrails` (or `designmd_get_design_md` with `section: "dos_and_donts"`) pulls just that.
- `designmd_lint` wraps the format spec's own official CLI (`@google/design.md`, npm-published, MIT-adjacent to the spec itself) to catch structural issues — missing frontmatter, orphaned tokens never referenced by any component — before you commit a file. It validates structure only, not whether your prose constraints are the right ones.
- `designmd_get_authoring_guide` and `designmd_scaffold_template` exist for writing your _own_ file well in the first place, since the reference collection is only useful as structural inspiration — copying another brand's prose into your file doesn't help, because it describes a different product.

### Section-level fetching

`designmd_get_design_md` accepts an optional `section` param to avoid pulling the whole file when only one part is relevant. Web sections: `overview`, `colors`, `typography`, `layout`, `elevation`, `shapes`, `components`, `motion`, `dos_and_donts`, `responsive`, `iteration_guide`, `known_gaps`, `agent_prompt_guide`. `motion` is canonical for every platform: how a system moves is a design decision an agent has to reproduce, so a `## Motion`, `## Motion & Interaction` or `## Animation` heading all resolve to it. Mobile archetypes use their own headings, mapped to compatible canonicals where possible (`color system`→`colors`, `spacing system`→`layout`, `do / don't`→`dos_and_donts`) plus mobile-specific ones (`design_principles`, `safe_area`, `touch_interaction`, `navigation`, `iconography`, `accessibility`, `platform_adaptation`). Anti-pattern headings (`## Anti-Patterns (Banned)`, `## Banned Patterns`) resolve to `dos_and_donts`, since that is what they are. The authored `shadcn` entry uses its own headings (`color system`→`colors`, `dark mode`, `components`, `do's & don'ts`→`dos_and_donts`, `elevation & focus`, `radius & shapes`, `agent prompt guide`). Not every file has every section — omitting `section` always returns the full file as a fallback.

### Framework flavors

Every iOS design (`platform: ios`, slug like `ios-spotify`) ships four files: the framework-neutral `DESIGN.md` plus paste-ready `DESIGN-swiftui.md`, `DESIGN-expo.md`, and `DESIGN-android.md` implementations. `designmd_get_design_md` indexes the neutral spec; pass `flavor: "swiftui" | "expo" | "android"` to fetch the framework implementation instead. iOS slugs are prefixed `ios-` so they never collide with web/mobile slugs (e.g. `spotify` is web, `ios-spotify` is the iOS app).

Flavours are not iOS-only. An entry may declare its own in `index.json` — `"flavors": ["expo"]` on a `platform: mobile` entry means `designmd_get_design_md(slug, flavor: "expo")` reads `<slug>-expo.md`, which is how an Expo / React Native project ships a framework implementation without pretending to be an iOS app. Entries with no `flavors` field and a non-`ios` platform refuse flavour requests with an error listing what (nothing) is available; iOS entries keep the historical three-flavour default.

### Component sub-groups

Any section that breaks into `### ` sub-headings is fetchable one group at a time. Inside the framework-neutral "Component Stylings" section that means Buttons, Cards & Containers, Navigation, Input Fields, Distinctive Components (names vary per design); inside Motion it means Durations & Easings, Motion Roles, Reduced Motion, Banned Motion. Pass `component: "navigation"` plus, when it is not the components section, `section: "motion"` to `designmd_get_design_md` to fetch just that one group. The match is best-effort against the file's sub-headings and is not valid together with `flavor`.

Page regions belong in this same vocabulary: `### Header`, `### Navigation & Menu`, `### Footer`. A region is a component, not a section, because what an agent needs from it is a fill, a height, a border and a sticky rule. Keeping them as component groups means `component: "footer"` resolves without growing the `section` enum, and a tap target, a disclosure or an active state is specified in the same place as the control that carries it. Write "there is no footer region" rather than omitting the group when a platform genuinely has none: a stated absence stops an agent inventing one.

### Provenance

`platform` describes the runtime target; it is not authorship. Each entry may carry `source` — absent (`upstream`) for files derived from the MIT collections, `adelpro` for files authored in-repo for one of the maintainer's own projects. `designmd_get_design_md` returns both `provenance` and the attribution URL in `source`, and `designmd_list_designs` / `designmd_search_designs` accept a `source` filter, so authored entries stay distinguishable from borrowed brand systems in any listing.

## Companion skill: designmd-authoring

`skill/designmd-authoring/SKILL.md` is a Claude skill that wires these tools into an actual authoring workflow — interviewing for the prose that matters (Overview, Colors, Do's and Don'ts) rather than just generating a token dump, diagnosing why an existing file isn't changing agent output, and linting before treating a draft as done. Drop the `skill/designmd-authoring/` folder into wherever your Claude setup looks for skills (e.g. `.claude/skills/` for Claude Code) alongside this MCP server being connected.

## Setup

The distributed path is **stdio**, installed from npm — no clone, no build:

```bash
npx -y designmd-forge
```

Most clients only need a command, not a URL:

```json
{
  "mcpServers": {
    "designmd": { "command": "npx", "args": ["-y", "designmd-forge"] }
  }
}
```

To work on the server itself:

```bash
npm install
npm run build
```

That compiles TypeScript to `dist/`, regenerates the section index, brand map and palettes from the bundled corpus, and copies the data (`src/data/*.json` + `src/data/designs/*.md`) alongside it. `npm run verify-data` checks the shipped artifacts offline; `npm run refresh-data` re-clones the upstream collections (network) and re-runs both.

## Transports

Two entry points, both built from `npm run build`:

- **stdio** (`dist/index.js`, `npm start`) — for local MCP clients (Claude Desktop, Claude Code) that spawn the server as a subprocess.
- **Streamable HTTP** (`dist/httpServer.js`, `npm run start:http`) — for hosting remotely as a connector. Stateless, no auth, and served at the root path (`/`) so any client connects straight to the host URL. Env vars: `PORT` (default 3000) and `MCP_PATH` (default `/`). See `DEPLOY.md` for running this behind a Cloudflare Tunnel on your own domain.

## Use with an MCP client (e.g. Claude Desktop, Claude Code) — stdio, local

Add to your MCP client config (for Claude Desktop, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "designmd": {
      "command": "node",
      "args": ["/absolute/path/to/designmd-forge/dist/index.js"]
    }
  }
}
```

Restart the client. You should see the nine `designmd_*` tools available.

## Connect over Streamable HTTP (remote)

For a remotely hosted instance you point the client at a URL instead of launching a subprocess. DesignMD Forge speaks Streamable HTTP over TLS in stateless mode with no auth, and it serves the protocol at the root path, so you connect straight to the bare host URL:

```json
{
  "mcpServers": {
    "designmd": {
      "type": "http",
      "url": "https://designmd-forge.adelpro.us.kg"
    }
  }
}
```

This works with any client that supports remote HTTP MCP servers (Claude Desktop, Claude Code, Cursor, and others). To run your own instance, `npm run start:http` starts the server locally; `DEPLOY.md` walks through the tunneled Cloudflare setup on your own domain. A health check at `https://<host>/health` confirms the server is up.

## Refreshing the data

The upstream repos add new sites over time. Each source has its own build script and npm task:

```bash
npm run refresh-data:web       # VoltAgent/awesome-design-md  -> .staging/web.json
npm run refresh-data:mobile    # TrustOtc/awesome-mobile-design-md -> .staging/mobile.json
npm run refresh-data:ios       # Meliwat/awesome-ios-design-md -> .staging/ios.json
npm run refresh-data:shadcn    # bundled authored shadcn/ui entry -> .staging/shadcn.json
npm run load-data              # merge all staged sources -> src/data/index.json
npm run build
```

`npm run refresh-data` runs all five steps in sequence. The web/mobile/ios build scripts re-clone their upstream repo into a temp dir, write the design files to `src/data/designs/`, emit the source fragment to `.staging/`, then clean up the clone; `refresh-data:shadcn` has no upstream clone — it stages and re-merges the authored `scripts/shadcn/shadcn.md` spec. `npm run load-data` merges every staged fragment into `src/data/index.json` and clears `.staging/`. Run the individual `refresh-data:<source>` scripts to refresh only one source.

## Testing

```bash
npm test
```

Runs the suite in `src/__tests__/` via Node's built-in test runner (`node --test`) — no extra test framework dependency. Covers the section parser across both bundled file formats, the search/lookup logic, the linter service (real CLI invocation, not mocked), and full tool behavior through a real MCP client connected via `InMemoryTransport` (tool list, successful calls, and error paths). `npm test` runs `npm run build` first via a `pretest` hook.

CI (`.github/workflows/ci.yml`) runs build + test on Node 20.x and 22.x on every push and PR, plus a smoke check that the HTTP server actually boots and responds on `/health`.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT — see `LICENSE`. That covers this project's own code. The bundled reference files under `src/data/designs/` are snapshots of [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), [TrustOtc/awesome-mobile-design-md](https://github.com/TrustOtc/awesome-mobile-design-md), and [Meliwat/awesome-ios-design-md](https://github.com/meliwat/awesome-ios-design-md) (all MIT licensed, with attribution and the license note preserved in `src/data/index.json`), plus the authored `shadcn.md` reference (our own original document, also MIT).

## Notes

- **License of the tool data**: MIT, per upstream's `LICENSE`. Their README states the extracted tokens "represent publicly visible CSS values" and they "do not claim ownership of any site's visual identity."
- Categories currently bundled: AI & LLM Platforms, Developer Tools & IDEs, Backend/Database & DevOps, Productivity & SaaS, Design & Creative Tools, Fintech & Crypto, E-commerce & Retail, Media & Consumer Tech, Automotive, Retro Web, Component Library (shadcn/ui) — plus any not-yet-categorized additions upstream hasn't sorted into the README yet.
- This server does not call any external API at runtime — it's entirely local, so there's nothing to rate-limit or pay for.
