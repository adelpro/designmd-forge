import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PLATFORMS } from '../constants.js';

/**
 * MCP prompts are user-invoked procedures, not skills: a client surfaces them as
 * a prompt list or slash commands, and clients without prompt support lose
 * nothing because the same procedures live in skill/designmd-authoring.
 *
 * Every body therefore names the exact tool calls in order, states the honest
 * limit of those calls, and fixes the deliverable shape — so it still works when
 * pasted into a client that ignores prompts/list.
 */
export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    'pick-a-design',
    {
      title: 'Pick a design system for this brief',
      description:
        'Runs search → full spec → guardrails and returns a ranked shortlist with what to borrow, not a single answer.',
      argsSchema: {
        brief: z
          .string()
          .min(1)
          .max(500)
          .describe('What you are building, in one or two sentences.'),
        platform: z.enum(PLATFORMS).optional().describe('Restrict to web, mobile, ios or shadcn.'),
        mode: z.enum(['light', 'dark', 'both']).optional().describe('Preferred palette mode.'),
      },
    },
    ({ brief, platform, mode }) => ({
      description: 'Shortlist of designs that fit the brief, with caveats',
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              `Brief: ${brief}`,
              platform
                ? `Platform: ${platform}`
                : 'Platform: not specified — do not filter, mention the mix instead.',
              mode ? `Preferred mode: ${mode}` : 'Mode: not specified — do not filter.',
              '',
              'Do this in order:',
              '1. designmd_search_designs with the brief words plus any filters. If the palette filter is used, repeat the coverage number the tool returns.',
              '2. For the top two or three results, designmd_get_design_md (full file, not one section).',
              '3. designmd_get_guardrails for each of those same designs.',
              '',
              "Limits to respect: colour and type tokens are not a design on their own, and this collection holds brand analyses rather than components — do not promise a component library. Never paste another brand's prose into the deliverable.",
              '',
              'Deliverable: a ranked shortlist of 2–3 designs. For each: what it actually does, the two or three rules worth copying, and one thing that would not transfer to the brief. End with a single recommendation and the reason.',
            ].join('\n'),
          },
        },
      ],
    })
  );

  server.registerPrompt(
    'section-inspiration',
    {
      title: 'Find component patterns across designs',
      description:
        'Searches component groups (footer, buttons, navigation, cards) across every design and returns candidates with their real excerpts.',
      argsSchema: {
        component: z
          .string()
          .min(1)
          .max(30)
          .describe(
            'Canonical group: footer, buttons, cards, navigation, header, inputs, modals, tables, tabs, badges.'
          ),
        qualities: z
          .string()
          .max(120)
          .optional()
          .describe('What it must have, e.g. "social links, sticky" or "3d, hover".'),
        platform: z.enum(PLATFORMS).optional().describe('Restrict to one collection.'),
      },
    },
    ({ component, qualities, platform }) => ({
      description: `Cross-design ${component} candidates`,
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              `Component: ${component}`,
              qualities
                ? `Qualities required: ${qualities}`
                : 'Qualities: none given — search by group only, and say so.',
              platform ? `Platform: ${platform}` : 'Platform: not specified.',
              '',
              'Do this in order:',
              `1. designmd_search_sections with group="${component}"${qualities ? ` and text="${qualities}"` : ''}${platform ? ` and platform="${platform}"` : ''}. If a quality is a facet (social, sticky, hover, 3d), also try it through "has" or "position".`,
              '2. For the two most relevant hits, designmd_get_design_md with component="' +
                component +
                '" to read the whole group.',
              '',
              'Limits to respect: the facets on each result are derived from prose, so an unstated facet is absent, not false. Say that once in the answer. These are brand analyses, not reusable components.',
              '',
              'Deliverable: 3–5 candidates. Each with its snippet, which design it comes from, and the one idea worth borrowing. Then one short synthesis written against my own tokens — not a copy of any single design.',
            ].join('\n'),
          },
        },
      ],
    })
  );

  server.registerPrompt(
    'theme-pick',
    {
      title: 'Pick a theme (or admit there are none)',
      description:
        'Lists official theme variants, then returns one as a delta. Refuses to invent themes for single-look brands.',
      argsSchema: {
        brand: z.string().max(60).optional().describe('Brand key, e.g. astryx.'),
        mood: z
          .string()
          .max(80)
          .optional()
          .describe('A mood or type preference, e.g. "warm serif" or "dark".'),
        typeClass: z.enum(['serif', 'sans', 'script', 'mono', 'mixed']).optional(),
      },
    },
    ({ brand, mood, typeClass }) => ({
      description: 'Theme options, with the honest coverage statement',
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              `Brand: ${brand ?? 'any'}`,
              `Mood: ${mood ?? 'not specified'}`,
              `Display type class: ${typeClass ?? 'not specified'}`,
              '',
              'Do this in order:',
              `1. designmd_list_themes${brand ? ` with brand="${brand}"` : ''}${typeClass ? ` and typeClass="${typeClass}"` : ''}.`,
              '2. If rows come back, designmd_get_design_md with theme="<id>" for the best one — it returns a delta (palette + type), not the parent prose.',
              '',
              'Limits to respect: only Astryx ships official variants. If the list is empty, say "no themes" and route to designmd_search_designs with mode/hue for derived brand palettes — do not invent a theme, and do not call a derived palette a theme.',
              '',
              'Deliverable: the theme (or the honest absence of one), its palette and type pairing, and one sentence on what would change if I applied it to my own system.',
            ].join('\n'),
          },
        },
      ],
    })
  );

  server.registerPrompt(
    'author-design-md',
    {
      title: 'Author a DESIGN.md for my own product',
      description:
        'Runs the authoring guide, scaffolds a skeleton, and lints until zero errors and zero warnings.',
      argsSchema: {
        project: z.string().min(1).max(400).describe('What the product is and who uses it.'),
      },
    },
    ({ project }) => ({
      description: 'A drafted DESIGN.md, linted',
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              `Project: ${project}`,
              '',
              'Do this in order:',
              '1. designmd_get_authoring_guide — follow its structure.',
              '2. designmd_scaffold_template — start from the skeleton, do not invent headings.',
              '3. Fill it from MY product decisions, not from a reference brand. Use designmd_search_sections only for component questions, never for prose.',
              '4. designmd_lint on the draft. Iterate until errors and warnings are both zero (infos are fine).',
              '',
              "Limits to respect: lint validates structure, not whether the prose is right. A file that lints clean can still be decision-wrong. Do not copy another brand's do's and don'ts.",
              '',
              'Deliverable: the full DESIGN.md, the lint summary (errors / warnings / infos), and the three rules you would expect an agent to violate first.',
            ].join('\n'),
          },
        },
      ],
    })
  );
}
