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
      description: `List themes a system actually SHIPS as variants — today Astryx's seven (butter, chocolate, gothic, matcha, neutral, stone, y2k).

Not a corpus-wide palette search: the other designs are single-look systems, searched with designmd_search_designs (mode, hue). Fetch one with designmd_get_design_md({ slug, theme }) to get a delta, not a copy of the parent.

Args:
  - brand (optional): only brands with official variants return rows (astryx).
  - mode (optional): light+dark | dark-only | light-only.
  - hue (optional): accent hue family of the theme palette.
  - kind (optional): mood | style | color.
  - typeClass (optional): serif | sans | script | mono | mixed — the display face.
  - limit (optional): 1-50, default 20.

Returns:
  { themes: [{ brand, parent, id, name, kind, mode, type, typeClass, accentHue }], coverage: { parents, themes, designs_listed_as_single_look }, note }

Error Handling:
  - Never errors on an empty result; an unknown brand returns [] plus the honest reason.

Examples:
  - "what themes does Astryx ship?" -> brand="astryx"
  - "which theme is dark-only?" -> mode="dark-only"
  - Don't use when: you want brand palettes across the corpus (designmd_search_designs), or you know the design already (designmd_get_design_md).`,
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
