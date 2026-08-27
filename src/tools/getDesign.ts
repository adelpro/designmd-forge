import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getEntryBySlug, readDesignMdContent } from '../services/designStore.js';
import {
  CANONICAL_SECTIONS,
  getSection,
  findComponentGroup,
  type CanonicalSection,
} from '../services/sectionParser.js';
import {
  CHARACTER_LIMIT,
  SOURCE_LICENSE,
  SOURCE_BY_PLATFORM,
  type Platform,
} from '../constants.js';

const FLAVORS = ['swiftui', 'expo', 'android'] as const;
const flavorSuffix = (flavor: (typeof FLAVORS)[number]) => `-${flavor}`;

const GetDesignMdInputSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .max(100)
      .describe(
        "The exact slug of the design to fetch, as returned by designmd_list_designs or designmd_search_designs (e.g. 'stripe', 'ios-spotify', 'midnight-pro')."
      ),
    section: z
      .enum(CANONICAL_SECTIONS)
      .optional()
      .describe(
        `Optional: fetch only one section instead of the whole file. One of: ${CANONICAL_SECTIONS.join(', ')}. Omit to get the full file. Use "dos_and_donts" specifically when you only need behavioral guardrails, not token values — see designmd_get_guardrails for a purpose-built shortcut to that. Works best against the framework-neutral spec (no flavor).`
      ),
    flavor: z
      .enum(FLAVORS)
      .optional()
      .describe(
        "Optional: for an iOS design (platform 'ios'), fetch the paste-ready framework implementation instead of the neutral spec. One of: swiftui, expo, android. Only iOS designs ship these variants. Omit for the framework-neutral DESIGN.md."
      ),
    component: z
      .string()
      .min(1)
      .max(60)
      .optional()
      .describe(
        "Optional: for the framework-neutral spec (not used with 'flavor'), fetch just ONE component sub-group of the Component Stylings section (e.g. 'navigation', 'buttons', 'cards', 'inputs'). Matches the '### ' sub-headings inside that section; names vary per design, so the match is best-effort. Returns the matched group's content. Use only on the neutral spec."
      ),
  })
  .strict();

type GetDesignMdInput = z.infer<typeof GetDesignMdInputSchema>;

export function registerGetDesignTool(server: McpServer): void {
  server.registerTool(
    'designmd_get_design_md',
    {
      title: 'Get Full DESIGN.md File',
      description: `Fetch DESIGN.md content for one design system by slug — either the full file, or (with the optional "section" param) just one section.

The returned file follows the Stitch DESIGN.md format: visual theme, color palette with hex values, typography hierarchy, component styling (buttons, cards, inputs, nav), layout/spacing principles, depth/elevation, do's and don'ts, responsive behavior, and an agent prompt guide. Content is sourced from local snapshots of VoltAgent/awesome-design-md (web), TrustOtc/awesome-mobile-design-md (mobile archetypes), and Meliwat/awesome-ios-design-md (iOS app systems; MIT licensed) — reverse-engineered design specs only, no logos or copyrighted imagery.

IMPORTANT for whoever consumes this output (agent or human): color hex codes and type scales are NOT enough to reproduce a brand's visual decisions. Token-only usage — e.g. applying a brand color as a background tint, or giving every card the same shadow — commonly produces output that has the right values but wrong decisions. Always read and follow the "Do's and Don'ts" section (or call designmd_get_guardrails) alongside any tokens, not just the color/typography sections in isolation.

Args:
  - slug (string, required): Exact slug, e.g. "stripe", "ios-spotify", "midnight-pro". Get valid slugs from designmd_list_designs or designmd_search_designs first if unsure.
  - section (string, optional): One of ${CANONICAL_SECTIONS.join(', ')}. Fetch just this section instead of the whole file — useful to avoid flooding context with irrelevant tokens when only one aspect (e.g. "components" or "dos_and_donts") is needed. Omit for the full file.
  - flavor (swiftui|expo|android, optional): For iOS designs only, fetch the framework implementation variant instead of the neutral spec. Omit for the neutral file.
  - component (string, optional): On the framework-neutral spec only (not with flavor), fetch just ONE component sub-group of the Component Stylings section (e.g. "navigation", "buttons", "cards"). Best-effort match against the file's "### " sub-headings.

Returns:
  The raw Markdown content (full file, requested section, component group, or flavor variant) as text, plus a structuredContent object:
  {
    "slug": string,
    "title": string,
    "category": string,
    "platform": "web" | "mobile" | "ios" | "shadcn",
    "flavor": string | null,   // null when the neutral spec was returned
    "component": string | null, // the requested component sub-group, or null
    "source": string,
    "license": string,
    "section": string | null,  // the effective section, or null if full file
    "content": string   // markdown, may be truncated if extremely long (truncation is noted)
  }

Error Handling:
  - Returns "Error: No design found for slug '<slug>'" with suggestions if the slug doesn't exist — call designmd_search_designs first to find the correct slug.
  - Returns "Error: Section '<section>' not found in '<slug>'" if that file doesn't have that section (not all files include every canonical section).
  - Returns an error if a flavor is requested for a non-iOS design, or if the flavor variant is missing.

Examples:
  - Use when: "get me the Stripe design system" -> slug="stripe"
  - Use when: "just the color palette for Notion" -> slug="notion", section="colors"
  - Use when: "give me the SwiftUI implementation of Spotify's iOS app" -> slug="ios-spotify", flavor="swiftui"
  - Use when: user picked a result from designmd_search_designs -> pass that result's slug
  - Don't use when: you don't know which site you want yet (use designmd_search_designs or designmd_list_designs first)`,
      inputSchema: GetDesignMdInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetDesignMdInput) => {
      const entry = getEntryBySlug(params.slug);
      if (!entry) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: No design found for slug '${params.slug}'. Call designmd_search_designs or designmd_list_designs to find the correct slug.`,
            },
          ],
          isError: true,
        };
      }

      if (params.flavor && entry.platform !== 'ios') {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Design '${params.slug}' (platform ${entry.platform}) has no '${params.flavor}' flavor variant — only iOS designs ship framework implementations. Omit flavor to fetch the neutral spec.`,
            },
          ],
          isError: true,
        };
      }

      const variantSlug = params.flavor
        ? `${entry.slug}${flavorSuffix(params.flavor)}`
        : entry.slug;
      let fullContent: string;
      try {
        fullContent = readDesignMdContent(variantSlug);
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: `Error: No '${params.flavor}' flavor variant available for '${params.slug}'. Try the neutral spec (omit flavor), or check the slugs via designmd_list_designs.`,
            },
          ],
          isError: true,
        };
      }

      let content: string;
      let section = params.section ?? null;

      if (params.component && params.flavor) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Cannot combine 'component' (a refinement of the framework-neutral spec) with 'flavor' (a framework implementation). Fetch one or the other.`,
            },
          ],
          isError: true,
        };
      }

      if (params.component && params.section && params.section !== 'components') {
        return {
          content: [
            {
              type: 'text',
              text: `Error: 'component' is a sub-group of the Component Stylings section, so it can't be combined with section '${params.section}'. Omit section (or use section=components).`,
            },
          ],
          isError: true,
        };
      }

      if (params.component) {
        const compSec = getSection(fullContent, 'components');
        if (!compSec) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Design '${params.slug}' has no Component Stylings section to search within.`,
              },
            ],
            isError: true,
          };
        }
        const { group, available } = findComponentGroup(compSec.content, params.component);
        if (!group) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: No component group matching '${params.component}' found in '${params.slug}'. Available groups: ${available.length ? available.join(', ') : 'none'}.`,
              },
            ],
            isError: true,
          };
        }
        section = 'components';
        content = group.content;
      } else if (params.section) {
        const found = getSection(fullContent, params.section as CanonicalSection);
        if (!found) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Section '${params.section}' not found in '${params.slug}'. Not every file includes every canonical section. Try designmd_get_design_md without a section to see what's available, or call designmd_get_guardrails for the do's/don'ts specifically.`,
              },
            ],
            isError: true,
          };
        }
        content = found.content;
      } else {
        content = fullContent;
      }

      let truncated = false;
      if (content.length > CHARACTER_LIMIT) {
        content = content.slice(0, CHARACTER_LIMIT);
        truncated = true;
      }

      const platform = (entry.platform ?? 'web') as Platform;
      const output = {
        slug: entry.slug,
        title: entry.title,
        category: entry.category,
        platform,
        flavor: params.flavor ?? null,
        component: params.component ?? null,
        source: SOURCE_BY_PLATFORM[platform],
        license: SOURCE_LICENSE,
        section,
        content,
        ...(truncated
          ? { truncated: true, note: `Content truncated at ${CHARACTER_LIMIT} characters.` }
          : {}),
      };

      return {
        content: [{ type: 'text', text: content }],
        structuredContent: output,
      };
    }
  );
}
