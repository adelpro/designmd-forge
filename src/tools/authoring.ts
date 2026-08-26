import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadAuthoringGuide(): string {
  return readFileSync(join(__dirname, "..", "data", "authoring-guide.md"), "utf-8");
}

const ScaffoldInputSchema = z
  .object({
    product_name: z
      .string()
      .min(1)
      .max(100)
      .default("Your Product")
      .describe("Name to use in the scaffold's placeholder comments (default: 'Your Product')."),
  })
  .strict();

type ScaffoldInput = z.infer<typeof ScaffoldInputSchema>;

function buildScaffold(productName: string): string {
  return `---
name: ${productName}
colors:
  primary: "#000000" # TODO: your primary color's actual hex
  # TODO: add the rest of your token block (typography, spacing, rounding, components)
---

## Overview

<!--
Write 2-4 concrete sentences on this product's visual personality — concrete
enough to rule things out, not just describe a vibe. Weak: "clean and modern".
Stronger: "information-dense, no gradients, no decorative illustration,
professional tone closer to a financial terminal than a consumer app."
This is the section an agent falls back on for anything your tokens don't
explicitly cover, so vague prose here costs you everywhere.
-->

## Colors

<!--
For EACH color token, state its role and its boundary, not just its value.
Weak: "primary: #0D7377" (that's already in the YAML above).
Stronger: "Primary teal is reserved for interactive elements — buttons,
links, active states. It never appears on backgrounds, dividers, or
decorative elements." Add one sentence per token that has a role beyond
"just a color". This section tends to be worth more per sentence than any
other — expect it to grow the most as you catch misapplications.
-->

## Do's and Don'ts

<!--
Negative, specific constraints tend to be followed more reliably than
positive general ones. Build this list from OBSERVED failures, not
speculation — every time a generated screen gets a decision wrong (not a
token wrong), add the specific "never do X, do Y instead" line that would
have prevented it. Also seed it with known team pain points:
  - What has an AI-generated screen from this project gotten wrong before?
  - What accessibility/contrast rules does QA care about?
  - What visual patterns does this product deliberately avoid that a
    generic Tailwind-style agent would reach for by default (shadows on
    cards? gradients? rounded corners everywhere)?
-->

<!-- Optional secondary sections below — fill in if relevant, skip if not. -->

## Typography

## Layout

## Elevation

## Components

## Responsive Behavior

## Agent Prompt Guide
`;
}

export function registerAuthoringTools(server: McpServer): void {
  server.registerTool(
    "designmd_get_authoring_guide",
    {
      title: "Get DESIGN.md Authoring Guide",
      description: `Fetch a condensed, field-tested guide on WRITING a DESIGN.md file's prose sections — not fetching an existing one.

Covers: why token-only DESIGN.md files under-perform, which sections tend to carry most of the improvement (Overview, Colors, Do's and Don'ts), concrete prose-writing principles (specificity, negative constraints, edge-case coverage, conciseness), a recommended draft-then-refine process, and known format limitations. This is reference material for a human or agent about to draft or improve a DESIGN.md for their OWN product — it does not fetch any of the bundled example designs (use designmd_get_design_md for that).

Args: none.

Returns: the guide as markdown text.

Examples:
  - Use when: "help me write a DESIGN.md for my app" -> call this first, then designmd_scaffold_template
  - Use when: "why isn't my DESIGN.md changing the agent's output?" -> likely a token-only-file problem this guide addresses directly
  - Don't use when: you want an existing site's design system (use designmd_search_designs / designmd_get_design_md)`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const guide = loadAuthoringGuide();
      return { content: [{ type: "text", text: guide }] };
    }
  );

  server.registerTool(
    "designmd_scaffold_template",
    {
      title: "Scaffold a New DESIGN.md Template",
      description: `Generate a fill-in-the-blank DESIGN.md skeleton for a NEW file, structured around the three sections that tend to matter most (Overview, Colors, Do's and Don'ts) with inline prompts guiding what to write in each — rather than a bare empty section list.

This is a starting scaffold, not a finished file: the YAML token block is a stub you fill in with your own real values, and the prose comments are prompts, not filler — replace them with your product's actual answers. Pair with designmd_get_authoring_guide for the reasoning behind why the scaffold is shaped this way, and designmd_lint once drafted.

Args:
  - product_name (string, optional): Used in the scaffold's YAML name field and comments. Defaults to "Your Product".

Returns: the scaffold as markdown text, ready to save as DESIGN.md and edit.

Examples:
  - Use when: "give me a DESIGN.md starting point for [product]" -> product_name="[product]"
  - Don't use when: you want an existing site's file to use as inspiration (use designmd_get_design_md instead, then don't copy its prose verbatim — write your own)`,
      inputSchema: ScaffoldInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ScaffoldInput) => {
      const scaffold = buildScaffold(params.product_name);
      return { content: [{ type: "text", text: scaffold }] };
    }
  );
}
