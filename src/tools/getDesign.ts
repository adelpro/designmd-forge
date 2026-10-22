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
  FLAVORS,
  availableFlavors,
  sourceUrlFor,
  type Flavor,
  type Platform,
} from '../constants.js';

const flavorSuffix = (flavor: Flavor) => `-${flavor}`;

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
        'Optional: fetch a paste-ready framework implementation instead of the neutral spec. One of: swiftui, expo, android. Available when the entry declares that flavour — every iOS design ships all three, and authored entries (e.g. Expo / React Native projects) declare their own in the index. Omit for the framework-neutral DESIGN.md.'
      ),
    component: z
      .string()
      .min(1)
      .max(60)
      .optional()
      .describe(
        "Optional: fetch just ONE '### ' sub-group instead of a whole section — e.g. 'navigation', 'buttons', 'cards', 'inputs'. Searches inside the section named by 'section' (default 'components', the Component Stylings section), so component groups also work in the 'motion' section ('durations & easings', 'reduced motion'). Names vary per design, so the match is best-effort. Not valid together with 'flavor'."
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
  - section (string, optional): One of ${CANONICAL_SECTIONS.join(', ')}. Fetch just this section instead of the whole file — useful to avoid flooding context with irrelevant tokens when only one aspect (e.g. "components", "motion" or "dos_and_donts") is needed. Omit for the full file.
  - flavor (swiftui|expo|android, optional): Fetch the framework implementation variant instead of the neutral spec, when the entry declares that flavour. Every iOS design ships all three; authored entries declare their own (an Expo / React Native project may ship only "expo"). Omit for the neutral file.
  - component (string, optional): Fetch just ONE "### " sub-group of the requested section (default section: "components") — e.g. "navigation", "buttons", "cards" inside Component Stylings, or "reduced motion" / "durations & easings" inside Motion. Best-effort match against the file's "### " sub-headings. Not valid with flavor.

Returns:
  The raw Markdown content (full file, requested section, component group, or flavor variant) as text, plus a structuredContent object:
  {
    "slug": string,
    "title": string,
    "category": string,
    "platform": "web" | "mobile" | "ios" | "shadcn",
    "flavor": string | null,   // null when the neutral spec was returned
    "component": string | null, // the requested component sub-group, or null
    "source": string,           // attribution URL: upstream collection or author
    "provenance": string,       // "upstream" for derived entries, or the authoring source (e.g. "adelpro")
    "flavors": string[] | null, // framework implementations this entry ships
    "license": string,
    "section": string | null,  // the effective section, or null if full file
    "content": string   // markdown, may be truncated if extremely long (truncation is noted)
  }

Error Handling:
  - Returns "Error: No design found for slug '<slug>'" with suggestions if the slug doesn't exist — call designmd_search_designs first to find the correct slug.
  - Returns "Error: Section '<section>' not found in '<slug>'" if that file doesn't have that section (not all files include every canonical section).
  - Returns an error listing the available flavours if a flavour is requested that this entry does not ship, or if the flavour variant file is missing.

Examples:
  - Use when: "get me the Stripe design system" -> slug="stripe"
  - Use when: "just the color palette for Notion" -> slug="notion", section="colors"
  - Use when: "how does this system animate things?" -> slug="<slug>", section="motion"
  - Use when: "only the reduced-motion rules" -> slug="<slug>", section="motion", component="reduced motion"
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

      const flavors = availableFlavors(entry);
      if (params.flavor && !flavors.includes(params.flavor)) {
        return {
          content: [
            {
              type: 'text',
              text: flavors.length
                ? `Error: Design '${params.slug}' (platform ${entry.platform}) has no '${params.flavor}' flavor variant. Available flavours: ${flavors.join(', ')}. Omit flavor to fetch the neutral spec.`
                : `Error: Design '${params.slug}' (platform ${entry.platform}) ships no framework flavour variants. Omit flavor to fetch the neutral spec.`,
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

      // 'component' selects a '### ' sub-group inside whichever section is
      // being fetched. Default target stays 'components' so the original
      // component-only call keeps working unchanged.
      const groupSection: CanonicalSection = (params.section ?? 'components') as CanonicalSection;

      if (params.component) {
        const targetSec = getSection(fullContent, groupSection);
        if (!targetSec) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Design '${params.slug}' has no '${groupSection}' section to search within.`,
              },
            ],
            isError: true,
          };
        }
        const { group, available } = findComponentGroup(targetSec.content, params.component);
        if (!group) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: No sub-group matching '${params.component}' found in the '${groupSection}' section of '${params.slug}'. Available groups: ${available.length ? available.join(', ') : 'none'}.`,
              },
            ],
            isError: true,
          };
        }
        section = groupSection;
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
        source: sourceUrlFor(entry),
        provenance: entry.source ?? 'upstream',
        flavors: availableFlavors(entry).length ? availableFlavors(entry) : null,
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
