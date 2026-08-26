---
name: designmd-authoring
description: Draft, refine, or review a DESIGN.md file for the user's own product — a plain-text design-system document that gives AI coding agents context on visual style so generated UI matches the product instead of defaulting to generic Tailwind output. Trigger when the user asks to create a DESIGN.md, wants their AI-generated UI to look more "on-brand" or less generic, asks why an existing DESIGN.md isn't changing agent output, or wants an existing DESIGN.md reviewed or linted. Requires the designmd MCP server's tools (designmd_get_authoring_guide, designmd_scaffold_template, designmd_search_designs, designmd_get_design_md, designmd_get_guardrails, designmd_lint) — check they're available before starting.
---

# DESIGN.md Authoring

## Why this skill exists

A DESIGN.md with a complete, correct YAML token block (colors, type scale,
spacing) is necessary but not sufficient. Coding agents given only tokens
reliably produce output where every value is technically correct but the
decisions around those values are generic — a brand color used as a
decorative background tint, every card given the same shadow regardless of
whether the product uses shadows at all. The fix is prose: sentences that
state what a token means and where it's allowed to appear, not just its
value. This skill's job is to get that prose written well, not just get a
file that has all the sections present.

## Workflow

### 1. Load the authoring guide first

Call `designmd_get_authoring_guide`. Do this before drafting or reviewing
anything — it has the specific principles (which sections carry the most
weight, why negative constraints outperform positive ones, how concise the
file should stay) that the rest of this workflow assumes.

### 2. Establish which mode this is

- **New file, no existing DESIGN.md**: go to step 3.
- **Existing DESIGN.md that isn't changing agent output**: go to step 5
  (diagnose) before rewriting anything.
- **Existing DESIGN.md, general review/refresh**: go to step 4, starting
  from their current file's prose instead of a blank scaffold.

### 3. Get a scaffold, then interview for the prose

Call `designmd_scaffold_template` with the product's name. The scaffold's
YAML block is a stub — the user fills in their real token values (from
Figma exports, existing CSS, or a design system they already have); don't
invent hex codes on their behalf.

The scaffold's prose comments are prompts, not filler. Interview the user
to fill them in for real, one question at a time rather than all at once:

- **Overview**: "How would you describe this product's visual personality
  to someone who's never seen it — specifically, what does it deliberately
  avoid?" Push back on vague answers ("clean and modern" isn't usable —
  ask what "clean" rules out).
- **Colors**: for each meaningful token, ask what it's *for* and where it
  should *never* appear. "Reserved for interactive elements, never on
  backgrounds" is the shape of a useful answer.
- **Do's and Don'ts**: ask about concrete past failures — "has an
  AI-generated screen from this project gotten something visually wrong
  before? What did it do?" and "does anyone on the team (design, QA) have
  standing rules about contrast, spacing, or visual weight?" Each answer
  becomes one specific, negative constraint sentence, not a paragraph.

If the user has no existing product yet to reference for edge cases, ask
about empty states, error states, and long/overflowing text specifically —
these are where generic agent output fails most visibly and predictably.

### 4. Look at reference examples for structure, never for prose

If the user wants inspiration for tone or structure, use
`designmd_search_designs` or `designmd_list_designs` to find 1-2 relevant
reference files, then `designmd_get_design_md` (optionally with
`section: "overview"` or `section: "dos_and_donts"`) to see how a
well-formed section reads. Use these to calibrate specificity and length —
never copy their sentences into the user's file. Their prose describes a
different product; it won't be true of this one, and reusing another
brand's constraints verbatim defeats the purpose of writing this file at
all.

### 5. Diagnosing an existing file that isn't working

Before rewriting, check for the token-only trap specifically: does the
file have a complete YAML block but thin or generic prose in Overview,
Colors, and Do's and Don'ts? If so, that's very likely the cause — say so
plainly, and focus the interview in step 3 on those three sections rather
than restructuring the whole file. If the user can point to a specific
generated screen that came out wrong, work backward from that concrete
failure to the one constraint sentence that would have prevented it —
that's a more reliable way to grow the file than brainstorming rules in
the abstract.

### 6. Keep it tight

After drafting, look for sentences that don't rule anything out or that
restate the YAML in prose form, and cut them. A DESIGN.md competes for
context-window space with the actual component being generated — length
that doesn't change a decision is a cost with no benefit.

### 7. Lint before treating it as done

Call `designmd_lint` with the drafted content. This only validates
structure (frontmatter shape, orphaned tokens) — it cannot judge whether
the prose constraints are the right ones, so don't treat a clean lint pass
as confirmation the file is finished. Fix any errors; use warnings as
prompts to double check (an orphaned color token is often a sign a
Colors-section sentence is missing, not just unused CSS).

### 8. Wire it into the agent's existing config

Remind the user to add one line to their CLAUDE.md, AGENTS.md, or
equivalent pointing the agent at the DESIGN.md for UI generation — the two
files are complementary (one covers how to write code, the other covers
what the product should look like), not overlapping.

## What this skill should NOT do

- Don't auto-generate the prose sections from tokens or from a general
  description without the interview in step 3 — that reproduces exactly
  the token-only failure mode this file exists to fix.
- Don't treat a clean `designmd_lint` result as "the file is good" — it's
  a structural check only.
- Don't copy prose from `designmd_get_design_md` reference files into the
  user's own file. Structure and calibration only, never their sentences.
- Don't promise deterministic results. Even a well-written DESIGN.md is
  followed reliably but not universally by a coding agent — say this
  plainly if the user expects a "solved" problem, and recommend they still
  review generated screens.
