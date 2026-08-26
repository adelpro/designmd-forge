/**
 * Parses a DESIGN.md file's "## Section" headings into a normalized map,
 * regardless of which of the two observed formats it uses:
 *   - Numbered Stitch-extended format: "## 1. Visual Theme & Atmosphere"
 *   - Plain format: "## Overview", "## Colors", "## Do's and Don'ts"
 */

export const CANONICAL_SECTIONS = [
  'overview',
  'colors',
  'typography',
  'layout',
  'elevation',
  'shapes',
  'components',
  'dos_and_donts',
  'responsive',
  'iteration_guide',
  'known_gaps',
  'agent_prompt_guide',
  // Mobile-specific sections (TrustOtc/awesome-mobile-design-md archetypes)
  'design_principles',
  'safe_area',
  'touch_interaction',
  'navigation',
  'motion',
  'iconography',
  'accessibility',
  'platform_adaptation',
] as const;

export type CanonicalSection = (typeof CANONICAL_SECTIONS)[number];

const HEADING_ALIASES: Record<string, CanonicalSection> = {
  overview: 'overview',
  'visual theme & atmosphere': 'overview',
  colors: 'colors',
  'color palette & roles': 'colors',
  typography: 'typography',
  'typography rules': 'typography',
  layout: 'layout',
  'layout principles': 'layout',
  elevation: 'elevation',
  'elevation & depth': 'elevation',
  'depth & elevation': 'elevation',
  shapes: 'shapes',
  components: 'components',
  'component stylings': 'components',
  "do's and don'ts": 'dos_and_donts',
  'responsive behavior': 'responsive',
  'iteration guide': 'iteration_guide',
  'known gaps': 'known_gaps',
  'agent prompt guide': 'agent_prompt_guide',
  // Mobile archetypes (TrustOtc/awesome-mobile-design-md)
  'design principles': 'design_principles',
  'color system': 'colors',
  'spacing system': 'layout',
  'layout & safe area': 'safe_area',
  'touch & interaction': 'touch_interaction',
  'navigation patterns': 'navigation',
  motion: 'motion',
  iconography: 'iconography',
  accessibility: 'accessibility',
  'platform adaptation': 'platform_adaptation',
  "do / don't": 'dos_and_donts',
  "do and don't": 'dos_and_donts',
};

interface ParsedSection {
  canonical: CanonicalSection;
  heading: string; // original heading text as it appears in the file
  content: string; // body text, excluding the heading line
}

function normalizeHeading(raw: string): CanonicalSection | null {
  // Strip a leading "N. " numbering prefix, then lowercase for lookup
  const cleaned = raw
    .replace(/^\d+\.\s*/, '')
    .trim()
    .toLowerCase();
  return HEADING_ALIASES[cleaned] ?? null;
}

/**
 * Splits a DESIGN.md file's body into canonical sections. Content before
 * the first "## " heading (e.g. YAML frontmatter, an "# Title" line, or
 * intro prose) is not included in any section.
 */
export function parseSections(content: string): ParsedSection[] {
  const lines = content.split('\n');
  const sections: ParsedSection[] = [];
  let current: { heading: string; canonical: CanonicalSection; lines: string[] } | null = null;

  for (const line of lines) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      if (current) {
        sections.push({
          canonical: current.canonical,
          heading: current.heading,
          content: current.lines.join('\n').trim(),
        });
      }
      const canonical = normalizeHeading(match[1]);
      current = canonical ? { heading: match[1], canonical, lines: [] } : null;
      continue;
    }
    // Stop capturing if we hit a top-level "# " heading after a section started
    if (/^#\s+/.test(line) && current) {
      sections.push({
        canonical: current.canonical,
        heading: current.heading,
        content: current.lines.join('\n').trim(),
      });
      current = null;
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) {
    sections.push({
      canonical: current.canonical,
      heading: current.heading,
      content: current.lines.join('\n').trim(),
    });
  }
  return sections;
}

export function getSection(content: string, section: CanonicalSection): ParsedSection | undefined {
  return parseSections(content).find((s) => s.canonical === section);
}

export interface ComponentGroup {
  heading: string; // original "### " sub-heading text
  content: string; // body of that sub-group, excluding the heading
}

/**
 * Splits a parsed section's body into its "### " component sub-groups
 * (e.g. the sub-groups inside a "Component Stylings" section: Buttons,
 * Navigation, Cards & Containers, Input Fields, Distinctive Components).
 * Names are NOT a controlled vocabulary - they vary per file - so matching is
 * best-effort (exact, then substring either direction).
 */
export function getComponentGroups(sectionBody: string): ComponentGroup[] {
  const lines = sectionBody.split('\n');
  const groups: ComponentGroup[] = [];
  let current: ComponentGroup | null = null;
  for (const line of lines) {
    const m = line.match(/^###\s+(.+?)\s*$/);
    if (m) {
      if (current) groups.push(current);
      current = { heading: m[1].trim(), content: '' };
      continue;
    }
    if (current) current.content += line + '\n';
  }
  if (current) groups.push(current);
  return groups.map((g) => ({ heading: g.heading, content: g.content.trim() }));
}

export function findComponentGroup(
  sectionBody: string,
  query: string
): { group?: ComponentGroup; available: string[] } {
  const groups = getComponentGroups(sectionBody);
  const available = groups.map((g) => g.heading);
  const q = query.trim().toLowerCase();
  const group =
    groups.find((g) => g.heading.toLowerCase() === q) ??
    groups.find((g) => g.heading.toLowerCase().includes(q)) ??
    groups.find((g) => q.includes(g.heading.toLowerCase()));
  return { group, available };
}
