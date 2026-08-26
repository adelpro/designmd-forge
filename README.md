# designmd-forge

A free, local MCP server for browsing and searching **DESIGN.md** files — plain-text design-system documents (colors, typography, components, layout) that AI coding agents read to generate UI matching a target visual style.

Data is a bundled, offline snapshot of three MIT-licensed sources — 74 **web** design systems from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), 10 **mobile** archetypes from [TrustOtc/awesome-mobile-design-md](https://github.com/TrustOtc/awesome-mobile-design-md), and 200 **iOS** app design systems from [Meliwat/awesome-ios-design-md](https://github.com/meliwat/awesome-ios-design-md) (284 design specs). No paid API, no rate limits, no network calls at runtime. The sources extract only publicly visible CSS / app values (colors, type scale, spacing) or are original DESIGN.md documents — no logos, trademarks, or copyrighted imagery, so it's safe to redistribute and reuse.

## Tools

| Tool | Purpose |
|---|---|
| `designmd_list_categories` | List all categories with counts, optionally filtered by platform (e.g. "Fintech & Crypto", "Automotive", "Mobile") |
| `designmd_list_designs` | List all designs, optionally filtered by category and/or platform (`web` / `mobile` / `ios`) — title, slug, one-line description |
| `designmd_search_designs` | Free-text search over title/slug/category/description, ranked by relevance, optionally filtered by category/platform |
| `designmd_get_design_md` | Fetch the full DESIGN.md, one section, one component sub-group, or an iOS framework flavor (swiftui/expo/android) for one design by slug |
| `designmd_get_guardrails` | Fetch only the "Do's and Don'ts" section — behavioral rules, not token values |
| `designmd_lint` | Validate a DESIGN.md's structure using the official `@google/design.md` linter |
| `designmd_diff` | Compare two DESIGN.md files (token-level) with the official CLI and flag regressions |
| `designmd_get_authoring_guide` | Fetch condensed, field-tested guidance on *writing* a DESIGN.md's prose |
| `designmd_scaffold_template` | Generate a fill-in-the-blank DESIGN.md skeleton, prompted around the highest-leverage sections |

Two flows this server supports:

- **Reference an existing design system**: `designmd_search_designs` or `designmd_list_designs` to find a slug → `designmd_get_design_md` to pull the full file (or `designmd_get_guardrails` for just the usage rules) → paste into your project root and tell your coding agent to follow it.
- **Author your own**: `designmd_get_authoring_guide` → `designmd_scaffold_template` → fill in the prose (see the companion skill below) → `designmd_lint` before committing.

### Why there's a dedicated guardrails tool, and a linter, and an authoring guide

Color hex codes and type scales tell an agent *what* the values are, not *how* to use them. Token-only DESIGN.md files reliably produce token-correct but decision-wrong output — an agent applying a brand accent color as a background tint on every info banner, or giving every card the same shadow regardless of hierarchy. Two things address this from different angles:

- Each bundled file's "Do's and Don'ts" section is where usage rules and anti-patterns live — `designmd_get_guardrails` (or `designmd_get_design_md` with `section: "dos_and_donts"`) pulls just that.
- `designmd_lint` wraps the format spec's own official CLI (`@google/design.md`, npm-published, MIT-adjacent to the spec itself) to catch structural issues — missing frontmatter, orphaned tokens never referenced by any component — before you commit a file. It validates structure only, not whether your prose constraints are the right ones.
- `designmd_get_authoring_guide` and `designmd_scaffold_template` exist for writing your *own* file well in the first place, since the reference collection is only useful as structural inspiration — copying another brand's prose into your file doesn't help, because it describes a different product.

### Section-level fetching

`designmd_get_design_md` accepts an optional `section` param to avoid pulling the whole file when only one part is relevant. Web sections: `overview`, `colors`, `typography`, `layout`, `elevation`, `shapes`, `components`, `dos_and_donts`, `responsive`, `iteration_guide`, `known_gaps`, `agent_prompt_guide`. Mobile archetypes use their own headings, mapped to compatible canonicals where possible (`color system`→`colors`, `spacing system`→`layout`, `do / don't`→`dos_and_donts`) plus mobile-specific ones (`design_principles`, `safe_area`, `touch_interaction`, `navigation`, `motion`, `iconography`, `accessibility`, `platform_adaptation`). Not every file has every section — omitting `section` always returns the full file as a fallback.

### iOS framework flavors

Every iOS design (`platform: ios`, slug like `ios-spotify`) ships four files: the framework-neutral `DESIGN.md` plus paste-ready `DESIGN-swiftui.md`, `DESIGN-expo.md`, and `DESIGN-android.md` implementations. `designmd_get_design_md` indexes the neutral spec; pass `flavor: "swiftui" | "expo" | "android"` to fetch the framework implementation instead. iOS slugs are prefixed `ios-` so they never collide with web/mobile slugs (e.g. `spotify` is web, `ios-spotify` is the iOS app).

### Component sub-groups

The framework-neutral "Component Stylings" section breaks into `### ` sub-groups (Buttons, Cards & Containers, Navigation, Input Fields, Distinctive Components — names vary per design). Pass `component: "navigation"` etc. to `designmd_get_design_md` to fetch just that one sub-group instead of the whole section. The match is best-effort against the file's sub-headings and is only valid on the neutral spec (not combined with `flavor`).

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
- **Streamable HTTP** (`dist/httpServer.js`, `npm run start:http`) — for remote hosting as a connector, stateless mode, no auth. Env vars: `PORT` (default 3000), `MCP_PATH` (default `/mcp`). See `DEPLOY.md` for hosting this behind a Cloudflare Tunnel on a custom domain, matching the pattern used for `mcp.quran.us.kg`.

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

## Refreshing the data

The upstream repos add new sites over time. Each source has its own build script and npm task:

```bash
npm run refresh-data:web     # VoltAgent/awesome-design-md  -> .staging/web.json
npm run refresh-data:mobile  # TrustOtc/awesome-mobile-design-md -> .staging/mobile.json
npm run refresh-data:ios     # Meliwat/awesome-ios-design-md -> .staging/ios.json
npm run load-data            # merge all staged sources -> src/data/index.json
npm run build
```

`npm run refresh-data` runs all four steps in sequence. Each build script re-clones its upstream repo into a temp dir, writes the design files to `src/data/designs/`, emits the source fragment to `.staging/`, then cleans up the clone; `npm run load-data` merges every staged fragment into `src/data/index.json` and clears `.staging/`. Run the individual `refresh-data:<source>` scripts to refresh only one source.

## Testing

```bash
npm test
```

Runs the suite in `src/__tests__/` via Node's built-in test runner (`node --test`) — no extra test framework dependency. Covers the section parser across both bundled file formats, the search/lookup logic, the linter service (real CLI invocation, not mocked), and full tool behavior through a real MCP client connected via `InMemoryTransport` (tool list, successful calls, and error paths). `npm test` runs `npm run build` first via a `pretest` hook.

CI (`.github/workflows/ci.yml`) runs build + test on Node 18/20/22 on every push and PR, plus a smoke check that the HTTP server actually boots and responds on `/health`.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT — see `LICENSE`. That covers this project's own code. The bundled reference files under `src/data/designs/` are a snapshot of [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), also MIT licensed, with attribution and the license note preserved in `src/data/index.json`.

## Notes

- **License of the tool data**: MIT, per upstream's `LICENSE`. Their README states the extracted tokens "represent publicly visible CSS values" and they "do not claim ownership of any site's visual identity."
- Categories currently bundled: AI & LLM Platforms, Developer Tools & IDEs, Backend/Database & DevOps, Productivity & SaaS, Design & Creative Tools, Fintech & Crypto, E-commerce & Retail, Media & Consumer Tech, Automotive, Retro Web (plus any not-yet-categorized additions upstream hasn't sorted into the README yet).
- This server does not call any external API at runtime — it's entirely local, so there's nothing to rate-limit or pay for.
