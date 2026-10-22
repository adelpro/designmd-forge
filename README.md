# DesignMD Forge

DesignMD Forge is a free MCP server for browsing and searching **DESIGN.md** files. These are plain text design system documents (colors, typography, components, layout) that AI coding agents read to generate UI matching a target visual style.

Data is a bundled, offline snapshot of five sources — 76 **web** design systems from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), 12 **mobile** archetypes from [TrustOtc/awesome-mobile-design-md](https://github.com/TrustOtc/awesome-mobile-design-md), 200 **iOS** app design systems from [Meliwat/awesome-ios-design-md](https://github.com/meliwat/awesome-ios-design-md), an original authored **shadcn/ui (New York)** design-system reference, and four authored specs for the maintainer's own projects under the **Quran & Arabic Tech** category (`midad`, `open-mushaf-native`, `open-tarteel`, `uslub`) — 289 design specs in total. No paid API, no rate limits, no network calls at runtime. The upstream sources extract only publicly visible CSS / app values (colors, type scale, spacing) and the authored entries are written from each project's own token source — no logos, trademarks, or copyrighted imagery are included, so it is safe to redistribute and reuse.

## Tools

| Tool                           | Purpose                                                                                                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `designmd_list_categories`     | List all categories with counts, optionally filtered by platform (e.g. "Fintech & Crypto", "Automotive", "Mobile")                                                                     |
| `designmd_list_designs`        | List all designs, optionally filtered by category, platform (`web` / `mobile` / `ios` / `shadcn`) or provenance (`source`: `upstream` / `adelpro`) — title, slug, one-line description |
| `designmd_search_designs`      | Free-text search over title/slug/category/description, ranked by relevance, optionally filtered by category/platform/source                                                            |
| `designmd_get_design_md`       | Fetch the full DESIGN.md, one section, one `### ` sub-group of any section, or a framework flavor (swiftui/expo/android) where the entry declares one, for one design by slug          |
| `designmd_get_guardrails`      | Fetch only the "Do's and Don'ts" section — behavioral rules, not token values                                                                                                          |
| `designmd_lint`                | Validate a DESIGN.md's structure using the official `@google/design.md` linter                                                                                                         |
| `designmd_diff`                | Compare two DESIGN.md files (token-level) with the official CLI and flag regressions                                                                                                   |
| `designmd_get_authoring_guide` | Fetch condensed, field-tested guidance on _writing_ a DESIGN.md's prose                                                                                                                |
| `designmd_scaffold_template`   | Generate a fill-in-the-blank DESIGN.md skeleton, prompted around the highest-leverage sections                                                                                         |

Two flows this server supports:

- **Reference an existing design system**: `designmd_search_designs` or `designmd_list_designs` to find a slug → `designmd_get_design_md` to pull the full file (or `designmd_get_guardrails` for just the usage rules) → paste into your project root and tell your coding agent to follow it.
- **Author your own**: `designmd_get_authoring_guide` → `designmd_scaffold_template` → fill in the prose (see the companion skill below) → `designmd_lint` before committing.

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

```bash
npm install
npm run build
```

This compiles TypeScript to `dist/` and copies the bundled data (`src/data/index.json` + `src/data/designs/*.md`) alongside it.

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
