import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getEntryBySlug, readDesignMdContent } from "../services/designStore.js";
import { lintDesignMdContent } from "../services/linter.js";

const LintInputSchema = z
  .object({
    content: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Raw DESIGN.md markdown content to lint (e.g. a file you're drafting for your own product). Provide this OR slug, not both."
      ),
    slug: z
      .string()
      .min(1)
      .max(100)
      .optional()
      .describe(
        "Slug of a bundled reference design to lint instead of arbitrary content (e.g. 'stripe'). Provide this OR content, not both."
      ),
  })
  .strict();

type LintInput = z.infer<typeof LintInputSchema>;

export function registerLintTool(server: McpServer): void {
  server.registerTool(
    "designmd_lint",
    {
      title: "Lint a DESIGN.md File",
      description: `Validate a DESIGN.md file for structural correctness using the official @google/design.md linter (the same tool the format's spec maintainers publish).

Checks include: YAML frontmatter presence and shape, orphaned tokens (colors/typography/etc. defined but never referenced by any component), and other structural issues. This validates STRUCTURE only — it cannot tell you whether your prose is specific enough or whether your Do's and Don'ts section actually covers your product's real failure modes. Pair this with designmd_get_authoring_guide for that.

Use this on a DESIGN.md you're drafting for your OWN product before committing it — not on the bundled reference files (those are just for structural inspiration), though either works as input.

Args:
  - content (string): Raw DESIGN.md markdown to lint. Use this for a file you're actively drafting.
  - slug (string): Instead of content, lint one of the bundled reference designs by slug (mainly useful for sanity-checking the linter itself, or seeing what a clean/complete file scores).
  Exactly one of content or slug must be provided.

Returns:
  JSON with schema:
  {
    "summary": { "errors": number, "warnings": number, "infos": number },
    "findings": [
      { "severity": "error"|"warning"|"info", "message": string, "path"?: string, "rule"?: string }
    ]
  }

Error Handling:
  - Returns "Error: Provide exactly one of 'content' or 'slug'" if both or neither are given.
  - Returns "Error: No design found for slug '<slug>'" if the slug doesn't exist.
  - Returns "Error: designmd lint CLI failed: ..." if the underlying CLI process fails to run (e.g. Node/npm environment issue) — this is an infrastructure error, not a lint finding.

Examples:
  - Use when: "check my draft DESIGN.md before I commit it" -> content=<the draft markdown>
  - Use when: "is the bundled Stripe file clean?" -> slug="stripe"
  - Don't use when: you want writing/prose guidance rather than structural validation (use designmd_get_authoring_guide)`,
      inputSchema: LintInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: LintInput) => {
      if ((params.content && params.slug) || (!params.content && !params.slug)) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Provide exactly one of 'content' or 'slug', not both and not neither.",
            },
          ],
          isError: true,
        };
      }

      let content: string;
      if (params.slug) {
        const entry = getEntryBySlug(params.slug);
        if (!entry) {
          return {
            content: [
              {
                type: "text",
                text: `Error: No design found for slug '${params.slug}'. Call designmd_search_designs or designmd_list_designs to find the correct slug.`,
              },
            ],
            isError: true,
          };
        }
        content = readDesignMdContent(entry.slug);
      } else {
        content = params.content as string;
      }

      try {
        const result = await lintDesignMdContent(content);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result as unknown as Record<string, unknown>,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
