# Writing a DESIGN.md That Actually Changes Output

This is a condensed set of principles for writing the prose half of a
DESIGN.md file — not the YAML token block, the markdown body underneath it.
It's synthesized from practitioner reports of running a DESIGN.md against a
real coding agent daily for a month and tracking which changes actually
moved generated output, plus the official format spec's own guidance.

## The core finding: tokens describe values, prose describes decisions

A DESIGN.md with a complete, accurate YAML token block (hex colors, a type
scale, spacing units) is not sufficient on its own. A coding agent given
only tokens tends to produce output where every individual value is
correct but the decisions around those values are generic: a brand accent
color gets used as a decorative background tint instead of being reserved
for interactive elements; every card gets the same soft shadow regardless
of whether the product's actual visual language uses shadows at all.

The fix isn't more tokens. It's prose that states what each token means
and where it's allowed to appear — not just what its value is.

## Three sections tend to carry most of the weight

Not all sections of a DESIGN.md contribute equally. In practice, three
sections tend to account for the large majority of the improvement in
generated output:

- **Overview** — sets the product's overall visual personality. Without
  it, an agent falls back on generic training-data defaults for anything
  the tokens don't explicitly cover. A vague overview ("clean and modern")
  performs about as poorly as no overview at all — it has to be concrete
  enough to rule things out (e.g. "information-dense, no gradients, no
  decorative illustration, closer to a financial terminal than a consumer
  app" rather than "clean and modern").
- **Colors** — the YAML gives hex values; the prose here is what assigns
  each color a *role* and a *boundary* ("reserved for interactive
  elements, never for decorative use or backgrounds"). This is usually
  where the most direct, traceable cause-and-effect between a prose
  addition and a corrected output shows up.
- **Do's and Don'ts** — this is where negative constraints live, and
  negative constraints ("never use gradients on interactive elements",
  "no box shadows on cards, use a 1px neutral border instead") tend to be
  followed more reliably than positively-framed preferences. This section
  grows best empirically — added to after watching an agent actually get
  something wrong, not written speculatively up front.

Typography, Layout, Elevation, Components, and Agent Instructions still
matter, but tend to be secondary to the three above.

## Principles for writing the prose

- **Be specific, not descriptive.** "Minimal aesthetic" gives an agent
  almost nothing to act on. "Flat design, no gradients, consistent 1px
  borders in neutral-200, no decorative elements" does.
- **Explain intent, not just instructions.** A sentence like "this
  product prioritizes information density over whitespace" generalizes to
  situations the file never explicitly covers (tighter tables, denser
  forms) in a way that a fixed instruction can't.
- **Cover edge cases explicitly.** Empty states, error messages, long
  text in constrained spaces, multi-line labels — these are exactly where
  agents guess worst, because nothing in a token list addresses them.
  A single sentence on what an empty state should contain (a message, an
  optional subtle illustration, a primary recovery action) tends to fix
  the pattern for every future generation.
- **State what should never happen.** Negative, specific constraints
  ("never appears on backgrounds") outperform positive, general ones
  ("used for interactive elements") for getting an agent to actually
  follow the rule consistently.
- **Keep it concise.** This is a working configuration file competing for
  space in a finite context window, not a brand book. Effective files
  tend to land in the range of a couple hundred lines of prose. If a
  sentence hasn't earned its place by changing an actual output, cut it.

## Process that tends to work

1. Auto-generate a first pass (from Figma exports, existing CSS, or an
   agent) purely for the YAML token extraction and section scaffolding.
   Treat the auto-generated prose as a placeholder, not a draft — it
   reliably has the tokens right and the reasoning missing.
2. Rewrite the prose yourself, pulling in whoever actually holds the
   relevant context: a designer for color/typography boundaries, a PM for
   overall product personality, QA for accessibility and contrast
   constraints. None of that shows up in an auto-extracted token dump.
3. Generate real UI with the file in place, watch where the agent gets a
   decision wrong (not a token wrong), and add the specific constraint
   that would have prevented it. The Do's and Don'ts section especially
   should grow from observed failures, not speculation.
4. Run the structural linter (`designmd_lint` in this MCP server, or
   `npx @google/design.md lint DESIGN.md` directly) before committing —
   it catches frontmatter issues and orphaned tokens, though it can't
   evaluate whether your prose constraints are the right ones.
5. Bridge it into your existing agent config (CLAUDE.md / AGENTS.md) with
   one line telling the agent to follow the DESIGN.md for UI generation —
   DESIGN.md and CLAUDE.md/AGENTS.md are complementary, not overlapping;
   one covers how to write code, the other covers what the product should
   look like.

## Known limitations, so expectations stay calibrated

- An agent following a DESIGN.md's prose constraints is not deterministic
  — expect it to be followed well but not universally, especially on
  complex, multi-component screens. Review generated output; don't skip
  that step because a DESIGN.md exists.
- The format (as of mid-2026) has real gaps around responsive breakpoints
  and dark-mode tokens — there's no clean standardized way to express
  either yet.
- Using a DESIGN.md instead of a purpose-built, codebase-aware MCP tool
  is not free: in at least one reported production comparison it used
  meaningfully more LLM processing per task and had more run-to-run
  variance than a dedicated tool integration. For a small team without
  that infrastructure already built, a markdown file is still usually the
  highest-leverage option available; for an organization with an existing
  component-library-aware tool, that trade-off is worth weighing.
