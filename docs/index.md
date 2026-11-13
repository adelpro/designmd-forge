# DesignMD Forge docs

A free, offline MCP server for **DESIGN.md** design-system specs — colours, typography, components, motion — plus the tools to search them across 290 designs, derive palettes, list official themes, and lint your own file.

```json
{ "mcpServers": { "designmd": { "command": "npx", "args": ["-y", "designmd-forge"] } } }
```

## Start here

- **[What's new in v2.0](whats-new-v2.md)** — the five new capabilities, the two behaviour changes, and what is deliberately absent.
- **[Worked examples](examples.md)** — real transcripts, trimmed with `…`, captured against the shipped data.
- **[MCP tool surface](mcp-tool-surface.md)** — which tool answers which question, and the four boundaries that matter.

## The 11 tools, one line each

| Tool                           | Question it answers                                              |
| ------------------------------ | ---------------------------------------------------------------- |
| `designmd_search_designs`      | which brands look like this brief?                               |
| `designmd_search_sections`     | who specs a footer, button or nav like this?                     |
| `designmd_list_themes`         | which official theme variants exist?                             |
| `designmd_get_design_md`       | give me the file, a section, a group, a flavour or a theme delta |
| `designmd_get_guardrails`      | what must I not do?                                              |
| `designmd_list_designs`        | what exists?                                                     |
| `designmd_list_categories`     | which categories are valid?                                      |
| `designmd_lint`                | is my draft structurally valid?                                  |
| `designmd_diff`                | what changed between two specs?                                  |
| `designmd_get_authoring_guide` | how do I write one well?                                         |
| `designmd_scaffold_template`   | give me a skeleton                                               |

Four **prompts** ship alongside: `pick-a-design`, `section-inspiration`, `theme-pick`, `author-design-md`. Prompts are user-invoked procedures, not skills — clients without prompt support lose nothing.

## Honest limits

- 600 of the 890 markdown files are SwiftUI/Expo/Android flavours of the same iOS design and are **not indexed**.
- 221 of 290 designs describe colour in prose only: no facets, no palette.
- Palette filters cover 69 of 290 designs and say so in every response.
- Only Astryx ships official themes; a derived brand palette is never called a theme.

Source: [github.com/adelpro/designmd-forge](https://github.com/adelpro/designmd-forge) · MIT
