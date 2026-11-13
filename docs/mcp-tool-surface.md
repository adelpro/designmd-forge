# MCP tool surface

Four questions decide which tool an agent should call: *what am I looking for* (a
brand, a component pattern, a theme, a file), *how much do I already know*, and
*which axis am I filtering on*. This page pins those boundaries so a wrong pick is
a documented mistake, not an ambiguity.

Counts at v1.6.0: **11 tools**, **4 prompts**, **0 resources**. The tool listing is
32,391 characters — every client holds that in context, so descriptions are
written for selection quality, not for prose.

## Tools

| Tool | Answers | Result unit | Use when | Do not use when |
|---|---|---|---|---|
| `designmd_search_designs` | "which brands look like X?" | one row per design | you are choosing a system; filtering by category, platform, source, brand, mode or hue | you know the design (use `get_design_md`), or you want a component pattern (`search_sections`) |
| `designmd_search_sections` | "who specs a footer/button/nav like this?" | one row per brand per group | you want component inspiration across systems, optionally with facet filters (`has`, `position`) | you know the design, or you are choosing a whole brand |
| `designmd_list_themes` | "which official variants exist?" | one row per theme | the system ships variants (Astryx) and you want to compare moods, modes or type pairings | you want brand palettes across the corpus — that is `search_designs` with `mode`/`hue` |
| `designmd_get_design_md` | "give me the file (or one part)" | markdown | you have a slug and want the spec, a section, a `###` group, a framework flavour, or one theme delta | you do not have a slug yet |
| `designmd_list_designs` | "what exists?" | one row per design | browsing or checking valid filter values | you already know what you want |
| `designmd_get_guardrails` | "what must I not do?" | do's/don'ts section | behaviour rules only, at a third of the output of a full fetch | you also need tokens |
| `designmd_list_categories` | "what categories are valid?" | names + counts | feeding `category` on another tool | you want designs, not category names |
| `designmd_lint` | "is my draft structurally valid?" | findings | before committing your own DESIGN.md | you want writing guidance (`get_authoring_guide`) |
| `designmd_diff` | "what changed between two specs?" | token-level diff | comparing two drafts or two versions | you want a similarity score |
| `designmd_get_authoring_guide` | "how do I write one well?" | prose guide | starting an authored spec | you have a draft to validate (`lint`) |
| `designmd_scaffold_template` | "give me a skeleton" | markdown skeleton | starting from scratch | you want an existing system to imitate |

## Boundaries worth remembering

- **Brand vs pattern.** `search_designs` returns designs; `search_sections` returns
  groups. A brand query never returns groups and a group query never returns a brand.
- **Guardrails vs file.** `get_guardrails` is `get_design_md(section: "dos_and_donts")`
  with less surrounding payload. Same content; keep both, prefer the shortcut.
- **Themes vs palettes.** `list_themes` covers *official variants* (Astryx's seven).
  `search_designs(mode|hue)` covers *derived palettes* of frontmatter designs — 70 of
  290 today. They are different axes; using one for the other silently narrows the
  result set.
- **Listing vs searching.** `list_*` tools take filters but no free text; `search_*`
  tools take text and score it. `list_designs` with no filter is the "show me
  everything" path.

## Prompts

Prompts are user-invoked procedures, not skills: a client surfaces them as a prompt
list or slash commands, and clients without prompt support lose nothing because the
same procedures are written in `skill/designmd-authoring`.

| Prompt | Argument | Forces |
|---|---|---|
| `pick-a-design` | `brief` | search_designs → get_design_md → get_guardrails |
| `section-inspiration` | `component` | search_sections → get_design_md(component) |
| `theme-pick` | `brand`? | list_themes → get_design_md(theme) |
| `author-design-md` | `project` | authoring guide → scaffold → lint to 0/0 |

## Resources

None, deliberately. Resources are URI-addressed context a client attaches; here they
would duplicate `get_design_md` for 290 designs and 890 files, `resources/subscribe`
needs session state this stateless server does not keep, and client support is the
weakest of the three primitives. If that changes, expose two templates
(`designmd://designs/{slug}`, `designmd://themes/{parent}/{id}`), never 290 entries.
