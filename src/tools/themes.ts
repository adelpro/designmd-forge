import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { allThemes, loadThemes, themesFor } from '../services/themeStore.js';
import { brandOf } from '../services/brandStore.js';
import { loadIndex } from '../services/designStore.js';
import { HUE_FAMILIES, hueFamily } from '../services/palette.js';

const TYPE_CLASSES = ['serif', 'sans', 'script', 'mono', 'mixed'] as const;
const MODES = ['light+dark', 'dark-only', 'light-only'] as const;
const KINDS = ['mood', 'style', 'color'] as const;

const ListThemesInputSchema = z
  .object({
    brand: z
      .string()
      .min(1)
      .max(60)
      .optional()
      .describe(
        'Optional brand key: only systems that ship official variants have themes (today: astryx). A brand without themes returns an empty list plus a note, never a guess.'
      ),
    mode: z
      .enum(MODES)
      .optional()
      .describe(
        "Optional mode filter: 'light+dark' for dual-mode themes, 'dark-only' for Gothic-style themes."
      ),
    hue: z
      .enum(HUE_FAMILIES)
      .optional()
      .describe(
        'Optional accent hue family of the theme palette (neutral themes use an ink accent, so they read as neutral).'
      ),
    kind: z
      .enum(KINDS)
      .optional()
      .describe(
        "Optional theme kind: 'mood' (a full visual mood, e.g. Astryx), 'style' or 'color' (a variant axis)."
      ),
    typeClass: z
      .enum(TYPE_CLASSES)
      .optional()
      .describe(
        "Optional display-type class: serif, sans, script, mono or mixed. Describes the DISPLAY face, which is what carries a theme's character."
      ),
    limit: z.number().int().min(1).max(50).default(20).describe('Maximum results (default 20).'),
  })
  .strict();

type ListThemesInput = z.infer<typeof ListThemesInputSchema>;

export function registerThemeTools(server: McpServer): void {
  server.registerTool(
    'designmd_list_themes',
    {
      title: 'List Official Design-System Themes',
      description: `List themes that a design system actually SHIPS as variants — today that is Astryx's seven (butter, chocolate, gothic, matcha, neutral, stone, y2k).

This is not a corpus-wide palette search. 289 of the 290 bundled designs are single-look systems; their colours are searched with designmd_search_designs (mode, hue). A "theme" here means an official alternate presentation with its own token set and type pairing, and inventing themes for single-look brands would be fabrication.

Each row carries the mode, the display/body type pairing, the type class and the accent hue. Fetch one with designmd_get_design_md({ slug, theme }) — it returns a delta (palette + type + what changes), never a copy of the parent's components.

Args:
  - brand (string, optional): brand key; only brands with official variants return rows (astryx).
  - mode (light+dark | dark-only | light-only, optional): dual-mode vs dark-only themes.
  - hue (string, optional): accent hue family of the theme palette.
  - kind (mood | style | color, optional): what axis the variant varies on.
  - typeClass (serif | sans | script | mono | mixed, optional): the display face class.
  - limit (number, optional): 1-50, default 20.

Returns:
  {
    "themes": [{ "brand", "parent", "id", "name", "kind", "mode", "type", "typeClass", "accentHue" }],
    "coverage": { "parents": number, "themes": number, "designs_listed_as_single_look": number },
    "note": string
  }

Error Handling:
  - Never errors on an empty result: an unknown brand returns [] plus a note naming the honest reason.

Examples:
  - Use when: "what themes does Astryx ship?" -> brand="astryx"
  - Use when: "which theme is dark-only?" -> mode="dark-only"
  - Use when: "a theme with a serif display face" -> typeClass="serif"
  - Don't use when: you want brand palettes across the corpus (use designmd_search_designs with mode/hue), or you already know the design (use designmd_get_design_md).`,
      inputSchema: ListThemesInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListThemesInput) => {
      const artifact = loadThemes();
      const parents = Object.keys(artifact.parents);

      const rows = allThemes()
        .map((theme) => ({
          brand: brandOf(theme.parent)?.key ?? theme.parent,
          parent: theme.parent,
          id: theme.id,
          name: theme.name,
          kind: theme.kind,
          mode: theme.mode,
          type: theme.type,
          typeClass: theme.typeClass,
          accentHue: hueFamily(theme.palette.accent),
        }))
        .filter((row) => (params.brand ? row.brand === params.brand.trim().toLowerCase() : true))
        .filter((row) => (params.mode ? row.mode === params.mode : true))
        .filter((row) => (params.hue ? row.accentHue === params.hue : true))
        .filter((row) => (params.kind ? row.kind === params.kind : true))
        .filter((row) => (params.typeClass ? row.typeClass === params.typeClass : true))
        .slice(0, params.limit);

      const coverage = {
        parents: parents.length,
        themes: allThemes().length,
        designs_listed_as_single_look: loadIndex().designs.length - parents.length,
      };

      const note = rows.length
        ? `Only ${parents.join(', ')} ships official variants in this collection; the other ${coverage.designs_listed_as_single_look} designs are single-look systems, searched by palette with designmd_search_designs.`
        : params.brand
          ? `'${params.brand}' has no themes: only astryx ships official variants. For brand palettes use designmd_search_designs with mode/hue.`
          : `No themes matched those filters. Only astryx ships official variants (${themesFor('astryx').length} themes).`;

      const output = { themes: rows, coverage, note };

      return {
        content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
        structuredContent: output as unknown as Record<string, unknown>,
      };
    }
  );
}
