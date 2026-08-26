import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getEntryBySlug, readDesignMdContent } from "../services/designStore.js";
import { getSection } from "../services/sectionParser.js";
import { SOURCE_REPO, SOURCE_LICENSE } from "../constants.js";

const GetGuardrailsInputSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .max(100)
      .describe(
        "The exact slug of the design, as returned by designmd_list_designs or designmd_search_designs (e.g. 'stripe', 'linear.app', 'tesla')."
      ),
  })
  .strict();

type GetGuardrailsInput = z.infer<typeof GetGuardrailsInputSchema>;

export function registerGuardrailsTool(server: McpServer): void {
  server.registerTool(
    "designmd_get_guardrails",
    {
      title: "Get Design Guardrails (Do's and Don'ts)",
      description: `Fetch ONLY the "Do's and Don'ts" section for one design system — the behavioral rules, not the color/typography/spacing token values.

Why this exists: color hex codes and type scales tell an agent WHAT the values are, but not HOW to use them. In practice, agents given only tokens tend to make token-correct but decision-wrong choices — e.g. applying a brand accent color as a background tint on every info banner, or giving every card component the same shadow weight regardless of hierarchy. The Do's and Don'ts section is where a DESIGN.md file encodes exactly those usage rules and anti-patterns. Call this tool (or designmd_get_design_md with section="dos_and_donts") whenever you're about to generate UI from a design system and want to sanity-check decisions, not just token values.

Args:
  - slug (string, required): Exact slug, e.g. "stripe", "notion", "tesla".

Returns:
  JSON with schema:
  {
    "slug": string,
    "title": string,
    "source": string,
    "license": string,
    "guardrails": string   // raw markdown of the Do's and Don'ts section
  }

Error Handling:
  - Returns "Error: No design found for slug '<slug>'" if the slug doesn't exist.
  - Returns "Error: No Do's and Don'ts section found for '<slug>'" in the rare case a file doesn't include one — fall back to designmd_get_design_md for the full file.

Examples:
  - Use when: "before you build this settings screen, what should I avoid with the Stripe style?" -> slug="stripe"
  - Use when: you already fetched a design's tokens and are about to generate a component -> call this alongside, don't skip it
  - Don't use when: you need the actual color/type values (use designmd_get_design_md with section="colors" or "typography", or the full file)`,
      inputSchema: GetGuardrailsInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetGuardrailsInput) => {
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

      const fullContent = readDesignMdContent(entry.slug);
      const found = getSection(fullContent, "dos_and_donts");
      if (!found) {
        return {
          content: [
            {
              type: "text",
              text: `Error: No Do's and Don'ts section found for '${entry.slug}'. Fall back to designmd_get_design_md for the full file.`,
            },
          ],
          isError: true,
        };
      }

      const output = {
        slug: entry.slug,
        title: entry.title,
        source: SOURCE_REPO,
        license: SOURCE_LICENSE,
        guardrails: found.content,
      };

      return {
        content: [{ type: "text", text: found.content }],
        structuredContent: output,
      };
    }
  );
}
