import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getEntryBySlug, readDesignMdContent } from "../services/designStore.js";
import { diffDesignMdContent, type DiffResult } from "../services/linter.js";

const SideSchema = z
  .object({
    content: z
      .string()
      .min(1)
      .optional()
      .describe("Raw DESIGN.md markdown for this side (e.g. a draft you're writing)."),
    slug: z
      .string()
      .min(1)
      .max(100)
      .optional()
      .describe("Slug of a bundled reference design for this side (e.g. 'stripe')."),
  })
  .strict()
  .refine((s) => (s.content ? 1 : 0) + (s.slug ? 1 : 0) === 1, {
    message: "Provide exactly one of 'content' or 'slug' per side",
  });

const DiffInputSchema = z
  .object({
    before: SideSchema.describe("The baseline DESIGN.md side (before)."),
    after: SideSchema.describe("The changed DESIGN.md side (after)."),
  })
  .strict();

type Side = z.infer<typeof SideSchema>;
type DiffInput = z.infer<typeof DiffInputSchema>;

async function resolveSide(side: Side): Promise<string> {
  if (side.content) return side.content;
  const entry = getEntryBySlug(side.slug!);
  if (!entry) throw new Error(`No design found for slug '${side.slug}'`);
  return readDesignMdContent(entry.slug);
}

function countTokenChanges(result: DiffResult): number {
  let count = 0;
  for (const set of Object.values(result.tokens ?? {})) {
    count += set.added.length + set.removed.length + set.modified.length;
  }
  return count;
}

export function registerDiffTool(server: McpServer): void {
  server.registerTool(
    "designmd_diff",
    {
      title: "Diff Two DESIGN.md Files",
      description: `Compare two DESIGN.md documents with the official @google/design.md CLI's diff command.\n\nIt diffs declared design tokens (colors, typography, rounded, spacing, components) and reports a "regression" flag — whether the after file introduced a token regression compared to before. Use it to spot changes between a draft and the version you're building on, or to check that an edit didn't silently lose a token.\n\nEach side (before and after) is given EITHER as raw "content" markdown (a file you're drafting) OR a bundled "slug" (e.g. 'stripe'). Mixing is fine: compare a bundled reference against your own draft.\n\nThis validates TOKEN regressions only — it does not judge prose quality (see designmd_get_authoring_guide for that).\n\nArgs:\n  - before: { content | slug }  (exactly one) — the baseline side\n  - after:  { content | slug }  (exactly one) — the changed side\n\nReturns:\n  JSON with schema:\n  {\n    "tokens": { "<group>": { "added": [], "removed": [], "modified": [] } },  // per token group\n    "findings": { "before": {errors,warnings,infos}, "after": {...}, "delta": {errors,warnings} },\n    "regression": boolean\n  }\n  A human-readable one-line summary is prepended to the output text.\n\nExamples:\n  - Use when: "did my edit to the draft change any color tokens?" -> before={content: draft-before}, after={content: draft-after}\n  - Use when: "how does my draft compare to Stripe's tokens?" -> before={slug: "stripe"}, after={content: my-draft}\n  - Don't use when: you only want structure/validation of one file (use designmd_lint)`,
      inputSchema: DiffInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: DiffInput) => {
      let before: string;
      let after: string;
      try {
        before = await resolveSide(params.before);
        after = await resolveSide(params.after);
      } catch (err) {
        return {
          content: [
            { type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` },
          ],
          isError: true,
        };
      }

      let result: DiffResult;
      try {
        result = await diffDesignMdContent(before, after);
      } catch (err) {
        return {
          content: [
            { type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` },
          ],
          isError: true,
        };
      }

      const changes = countTokenChanges(result);
      const summaryLine = `diff: ${changes} token change(s); ${result.findings.delta.errors} new error(s), ${result.findings.delta.warnings} new warning(s); regression: ${result.regression}`;
      return {
        content: [{ type: "text", text: `${summaryLine}\n${JSON.stringify(result, null, 2)}` }],
        structuredContent: result as unknown as Record<string, unknown>,
      };
    }
  );
}