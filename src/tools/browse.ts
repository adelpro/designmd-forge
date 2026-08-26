import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadIndex, listCategories, searchDesigns } from "../services/designStore.js";
import { SOURCE_REPO, SOURCE_LICENSE, SOURCE_BY_PLATFORM, PLATFORMS } from "../constants.js";

const ListDesignsInputSchema = z
  .object({
    category: z
      .string()
      .optional()
      .describe(
        "Optional exact category name to filter by (see designmd_list_categories for valid values, e.g. 'Fintech & Crypto' or 'Mobile')."
      ),
    platform: z
      .enum(PLATFORMS)
      .optional()
      .describe("Optional platform to filter by: 'web' (VoltAgent desktop design systems) or 'mobile' (TrustOtc mobile archetypes). Omit for both."),
  })
  .strict();

type ListDesignsInput = z.infer<typeof ListDesignsInputSchema>;

const SearchDesignsInputSchema = z
  .object({
    query: z
      .string()
      .min(1, "Query must not be empty")
      .max(200, "Query must not exceed 200 characters")
      .describe(
        "Free-text search terms matched against each design's title, slug, category, and description (e.g. 'dark fintech dashboard', 'warm minimal serif', 'automotive luxury black', 'mobile dark pro tool')."
      ),
    category: z
      .string()
      .optional()
      .describe("Optional exact category name to restrict the search to."),
    platform: z
      .enum(PLATFORMS)
      .optional()
      .describe("Optional platform to restrict the search to: 'web' or 'mobile'. Omit for both."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of results to return (default 10, max 50)."),
  })
  .strict();

type SearchDesignsInput = z.infer<typeof SearchDesignsInputSchema>;

const ListCategoriesInputSchema = z
  .object({
    platform: z
      .enum(PLATFORMS)
      .optional()
      .describe("Optional platform to restrict the category listing to: 'web' or 'mobile'. Omit for both."),
  })
  .strict();

type ListCategoriesInput = z.infer<typeof ListCategoriesInputSchema>;

export function registerBrowseTools(server: McpServer): void {
  server.registerTool(
    "designmd_list_categories",
    {
      title: "List DESIGN.md Categories",
      description: `List every category present in the local DESIGN.md collection, with a count of designs in each.

This is a read-only tool. Call it first if you don't know what categories exist (e.g. "Fintech & Crypto", "Automotive", "AI & LLM Platforms", "Mobile") before filtering designmd_list_designs or designmd_search_designs by category. The "Mobile" category holds the TrustOtc mobile archetypes.

Args:
  - platform (web|mobile, optional): restrict the listing to one platform's categories. Omit for all.

Returns:
  JSON with schema:
  {
    "source": string,          // primary (web) upstream repo URL
    "license": string,         // "MIT"
    "sources": { "web": string, "mobile": string, "ios": string },  // upstream repo per platform
    "categories": [
      { "name": string, "count": number }
    ]
  }`,
      inputSchema: ListCategoriesInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListCategoriesInput) => {
      const index = loadIndex();
      const designs = params.platform
        ? index.designs.filter((d) => d.platform === params.platform)
        : index.designs;
      const categories = listCategories()
        .map((name) => ({
          name,
          count: designs.filter((d) => d.category === name).length,
        }))
        .filter((c) => c.count > 0);
      const output = {
        source: SOURCE_REPO,
        license: SOURCE_LICENSE,
        sources: SOURCE_BY_PLATFORM,
        categories,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "designmd_list_designs",
    {
      title: "List All DESIGN.md Files",
      description: `List every design system available in the local DESIGN.md collection, optionally filtered by category.

Each entry includes a title, slug, category, and a one-line description — enough to browse and pick candidates before calling designmd_get_design_md for the full file. Does NOT return full DESIGN.md content (use designmd_get_design_md for that).

Data comes from a local snapshot of VoltAgent/awesome-design-md (MIT licensed). These are reverse-engineered design tokens (colors, type, spacing, components) extracted from publicly visible CSS — no logos, trademarks, or copyrighted imagery are included.

Args:
  - category (string, optional): Exact category name to filter by. Omit to list all.

Returns:
  JSON with schema:
  {
    "source": string,
    "license": string,
    "total": number,
    "designs": [
      { "slug": string, "title": string, "category": string, "short_description": string }
    ]
  }

Examples:
  - Use when: "what design systems do you have for crypto/fintech sites?" -> category="Fintech & Crypto"
  - Use when: "show me everything available" -> no category
  - Don't use when: you already know the exact slug and just want the file (use designmd_get_design_md instead)`,
      inputSchema: ListDesignsInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListDesignsInput) => {
      const index = loadIndex();
      const filtered = index.designs.filter((d) => {
        if (params.platform && d.platform !== params.platform) return false;
        if (params.category && d.category.toLowerCase() !== params.category!.toLowerCase()) return false;
        return true;
      });

      if (params.category && filtered.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No designs found for category "${params.category}". Call designmd_list_categories to see valid category names.`,
            },
          ],
        };
      }

      const output = {
        source: SOURCE_REPO,
        license: SOURCE_LICENSE,
        total: filtered.length,
        designs: filtered.map((d) => ({
          slug: d.slug,
          title: d.title,
          category: d.category,
          platform: d.platform ?? "web",
          short_description: d.short_description,
        })),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "designmd_search_designs",
    {
      title: "Search DESIGN.md Files",
      description: `Search the local DESIGN.md collection by free-text query against title, slug, category, and description text.

Use this when you have a vibe/keyword in mind ("dark cinematic AI product", "warm editorial serif brand", "minimal black and white luxury automotive") rather than an exact site name. Results are ranked by relevance score (title and slug matches weigh highest). Does NOT return full DESIGN.md content — call designmd_get_design_md with the returned slug for that.

Args:
  - query (string, required): Free-text search terms, 1-200 characters.
  - category (string, optional): Restrict results to one exact category.
  - limit (number, optional): Max results, 1-50 (default 10).

Returns:
  JSON with schema:
  {
    "query": string,
    "total_matches": number,
    "results": [
      { "slug": string, "title": string, "category": string, "short_description": string, "score": number }
    ]
  }
  Returns an empty "results" array (not an error) if nothing matches.

Examples:
  - Use when: "find me something dark and terminal-y for a dev tool" -> query="dark terminal developer"
  - Use when: "any luxury car brands with black and gold?" -> query="luxury black gold automotive"
  - Don't use when: you already know the exact site slug (use designmd_get_design_md directly)`,
      inputSchema: SearchDesignsInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: SearchDesignsInput) => {
      const results = searchDesigns(params.query, {
        category: params.category,
        platform: params.platform,
        limit: params.limit,
      });

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No designs matched query "${params.query}"${
                params.category ? ` in category "${params.category}"` : ""
              }. Try broader or different terms, or call designmd_list_designs to browse everything.`,
            },
          ],
        };
      }

      const output = {
        query: params.query,
        total_matches: results.length,
        results: results.map((r) => ({
          slug: r.slug,
          title: r.title,
          category: r.category,
          platform: r.platform ?? "web",
          short_description: r.short_description,
          score: r.score,
        })),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );
}
