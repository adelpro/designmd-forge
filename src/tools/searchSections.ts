import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CANONICAL_GROUPS } from '../services/groupVocabulary.js';
import { CANONICAL_SECTIONS } from '../services/sectionParser.js';
import { loadSectionIndex, type SectionGroupRecord } from '../services/sectionIndexStore.js';
import { expandTerms } from '../services/sectionSynonyms.js';
import { PLATFORMS } from '../constants.js';

const SNIPPET_RADIUS = 120;

const SearchSectionsInputSchema = z
  .object({
    group: z
      .enum(CANONICAL_GROUPS)
      .optional()
      .describe(
        "Optional component group to search within: 'footer', 'buttons', 'cards', 'navigation', 'header', 'inputs', 'modals', 'tables', 'tabs', 'badges', 'avatars', 'icons', 'lists', 'empty_states', or the motion groups. Omit to search every group."
      ),
    section: z
      .enum(CANONICAL_SECTIONS)
      .optional()
      .describe(
        "Optional canonical section to restrict to. Component groups live in 'components' (the default when you pass a group) and motion groups in 'motion'. Passing a group that cannot exist in that section returns zero matches plus a note."
      ),
    text: z
      .string()
      .min(1)
      .max(200)
      .optional()
      .describe(
        "Free-text terms matched inside the group's prose, expanded through a synonym map (e.g. 'hamburger' also searches 'menu button', 'drawer', 'bottom bar'; '3d' also searches 'bevel', 'raised'). Omit to list every group of the requested type."
      ),
    has: z
      .array(z.string().min(1).max(40))
      .max(5)
      .optional()
      .describe(
        "Optional facet filter: every entry must appear in the group's derived items, states or traits (e.g. ['social'], ['sticky'], ['hover'])."
      ),
    position: z
      .enum(['static', 'sticky', 'fixed'])
      .optional()
      .describe('Optional derived position of the region (footers and headers only).'),
    platform: z
      .enum(PLATFORMS)
      .optional()
      .describe('Optional source platform filter: web, mobile, ios or shadcn.'),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe('Maximum results (default 10, max 50).'),
  })
  .strict();

type SearchSectionsInput = z.infer<typeof SearchSectionsInputSchema>;

interface SectionMatch {
  slug: string;
  brand: string;
  title: string;
  platform: string;
  group: string;
  variant: string | null;
  section: string;
  score: number;
  snippet: string;
  facets: SectionGroupRecord['facets'];
  platforms: string[];
}

function normalizeFacetValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_');
}

function snippetFor(text: string, terms: string[], heading: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  const lower = flat.toLowerCase();
  const haystacks = [...terms, heading.toLowerCase()];
  let index = -1;
  for (const term of haystacks) {
    const found = lower.indexOf(term);
    if (found !== -1 && (index === -1 || found < index)) index = found;
  }
  if (index === -1) return flat.slice(0, SNIPPET_RADIUS * 2);
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(flat.length, index + SNIPPET_RADIUS);
  return `${start > 0 ? '…' : ''}${flat.slice(start, end)}${end < flat.length ? '…' : ''}`;
}

/**
 * Collapses rows that describe the same thing into one, keeping the highest
 * score and listing the platforms they came from. The key function is the only
 * thing that changes when rows switch from per-slug to per-brand collapsing.
 */
function collapse(rows: SectionMatch[], keyFor: (row: SectionMatch) => string): SectionMatch[] {
  const byKey = new Map<string, SectionMatch>();
  for (const row of rows) {
    const key = keyFor(row);
    const previous = byKey.get(key);
    if (!previous) {
      byKey.set(key, row);
      continue;
    }
    const platforms = [...new Set([...previous.platforms, ...row.platforms])].sort();
    byKey.set(key, {
      ...(row.score > previous.score ? row : previous),
      platforms,
    });
  }
  return [...byKey.values()];
}

export function registerSearchSectionsTool(server: McpServer): void {
  server.registerTool(
    'designmd_search_sections',
    {
      title: 'Search Component Groups Across Designs',
      description: `Find component groups ("### Footer", "### Buttons", "### Navigation") ACROSS the whole collection instead of one design at a time — the query designmd_search_designs cannot answer, because it only searches titles and descriptions.

Use it for inspiration questions: "a footer with social links", "3d or hover buttons", "navigation with a drawer". Results are ranked prose excerpts (a snippet plus the derived facets), not components: the collection stores brand analyses, so you read three footers and then write your own against your tokens.

Each result carries \`facets\` derived from the group's prose (position, divider, columns, items, states, traits). Derived means exactly that: an unstated facet is absent, not false, so treat a missing 'sticky' as unknown rather than as 'static'.

Args:
  - group (string, optional): canonical group — footer, buttons, cards, navigation, header, inputs, modals, tables, tabs, badges, avatars, icons, lists, empty_states, or the motion groups.
  - section (string, optional): restrict to a canonical section; groups live in 'components', motion groups in 'motion'. A mismatch returns zero matches and says so.
  - text (string, optional): words matched inside the group body, expanded through a synonym map (hamburger → menu button/drawer/bottom bar; 3d → bevel/raised). Omit to list every group of that type.
  - has (string[], optional): every entry must appear in the derived items/states/traits — ['social'], ['sticky'], ['hover'].
  - position (static|sticky|fixed, optional): derived position filter.
  - platform (web|mobile|ios|shadcn, optional): source platform filter.
  - limit (number, optional): 1-50, default 10.

Returns:
  {
    "matches": [{ "slug", "title", "platform", "group", "variant", "section", "score", "snippet", "facets", "platforms" }],
    "coverage": { "neutral_designs", "designs_with_groups", "excluded_flavor_files", "groups", "by_group" },
    "note": string   // "N of M designs match; showing K", or why nothing matched
  }

Error Handling:
  - Never errors on an empty result: returns an empty array plus a note naming how many designs could have matched.
  - Framework flavour files are not indexed; excluded_flavor_files states how many were left out.

Examples:
  - Use when: "show me footers with social links" -> group="footer", text="social icons"
  - Use when: "3D or hover buttons" -> group="buttons", text="3d hover"
  - Use when: "sticky footers only" -> group="footer", position="sticky"
  - Don't use when: you already know the design and want its actual section (use designmd_get_design_md with component), or you are choosing a brand rather than a component (use designmd_search_designs).`,
      inputSchema: SearchSectionsInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: SearchSectionsInput) => {
      const { records, coverage } = loadSectionIndex();
      const hasFilters = (params.has ?? []).map(normalizeFacetValue);
      const termGroups = params.text ? expandTerms(params.text.split(/\s+/).filter(Boolean)) : [];

      const scored: SectionMatch[] = [];
      for (const record of records) {
        if (params.group && record.group !== params.group) continue;
        if (params.platform && record.platform !== params.platform) continue;
        if (params.section && record.section !== params.section) continue;
        if (params.position && record.facets.position !== params.position) continue;

        if (hasFilters.length) {
          const stated = [
            ...record.facets.items,
            ...record.facets.states,
            ...record.facets.traits,
          ].map(normalizeFacetValue);
          if (!hasFilters.every((filter) => stated.includes(filter))) continue;
        }

        let score = 0;
        if (termGroups.length) {
          const body = record.text.toLowerCase();
          const heading = record.heading.toLowerCase();
          for (const expansions of termGroups) {
            if (expansions.some((term) => body.includes(term))) score += 3;
            else if (expansions.some((term) => heading.includes(term))) score += 1;
          }
          if (score === 0) continue;
        }

        const terms = termGroups.flat();
        scored.push({
          slug: record.slug,
          brand: record.brand,
          title: record.title,
          platform: record.platform,
          group: record.group,
          variant: record.variant,
          section: record.section,
          score,
          snippet: snippetFor(record.text, terms, record.heading),
          facets: record.facets,
          platforms: [record.platform],
        });
      }

      const collapsed = collapse(
        scored,
        // One row per brand per group: spotify (web) and ios-spotify (iOS) are
        // the same product, and a file with "### Buttons" plus "### Primary
        // Buttons" is one choice for the reader.
        (row) => `${row.brand}|${row.group}`
      ).sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

      const matches = collapsed.slice(0, params.limit);

      let note: string;
      if (
        params.group &&
        params.section &&
        collapsed.length === 0 &&
        !params.text &&
        !hasFilters.length
      ) {
        note = `No '${params.group}' group in the ${params.section} section: component groups live in 'components' and motion groups in 'motion'.`;
      } else {
        const denominator = params.group
          ? (coverage.by_group[params.group] ?? 0)
          : coverage.neutral_designs;
        note =
          `${collapsed.length} of ${denominator} designs match; showing ${matches.length}. ` +
          `Facets are derived from prose — an unstated facet is absent, not false. ` +
          `${coverage.excluded_flavor_files} flavour files were not indexed.`;
      }

      return {
        content: [{ type: 'text', text: JSON.stringify({ matches, note }, null, 2) }],
        structuredContent: {
          matches,
          coverage,
          note,
        } as unknown as Record<string, unknown>,
      };
    }
  );
}
