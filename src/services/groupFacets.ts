import type { CanonicalGroup } from './groupVocabulary.js';

export interface GroupFacets {
  position?: 'static' | 'sticky' | 'fixed';
  surface?: 'canvas' | 'ink' | 'accent' | 'muted';
  divider?: 'hairline' | 'none' | 'shadow';
  columns?: number;
  items: string[];
  states: string[];
  traits: string[];
}

const ITEM_WORDS: Record<string, string[]> = {
  legal: ['legal', 'privacy', 'terms', 'cookie', 'cookies'],
  locale: ['locale', 'language', 'language switcher', 'region'],
  social: ['social', 'instagram', 'linkedin', 'twitter', 'tiktok', 'youtube', 'discord'],
  newsletter: ['newsletter', 'subscribe', 'email signup', 'email sign-up'],
  copyright: ['copyright', 'all rights reserved', '©'],
  nav_links: ['nav links', 'navigation links', 'sitemap', 'quick links'],
  cta: ['cta', 'call to action', 'book a demo', 'get started'],
};

const STATE_WORDS: Record<string, string[]> = {
  hover: ['hover', 'hovered', 'hover state'],
  pressed: ['pressed', 'active state', 'pressed state'],
  focus: ['focus', 'focus-visible', 'focus ring'],
  disabled: ['disabled', 'inactive'],
  loading: ['loading', 'spinner', 'pending'],
  selected: ['selected', 'checked', 'current'],
};

const TRAIT_WORDS: Record<string, string[]> = {
  '3d': ['3d', 'three-dimensional'],
  bevel: ['bevel', 'bevelled', 'beveled'],
  raised: ['raised', 'elevated appearance', 'embossed edge'],
  gradient: ['gradient', 'gradients'],
  glass: ['glass', 'glassmorphism', 'frosted'],
  outline: ['outline', 'outlined', 'stroke button'],
  ghost: ['ghost', 'text-only', 'text only'],
  pill: ['pill', 'pill-shaped', 'fully rounded'],
  icon_only: ['icon-only', 'icon only', 'icon button'],
  underline: ['underline', 'underlined'],
  uppercase: ['uppercase', 'all caps', 'all-caps'],
};

const COLUMN_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function has(text: string, phrase: string): boolean {
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(phrase)}([^a-z0-9]|$)`);
  return re.test(text);
}

function matchAll(table: Record<string, string[]>, text: string): string[] {
  return Object.entries(table)
    .filter(([, words]) => words.some((word) => has(text, word)))
    .map(([name]) => name)
    .sort();
}

/**
 * Reads the facets a group's prose actually states. Never infers from the group
 * id: a footer is not "static" because it is a footer, and an unstated facet
 * stays absent rather than guessed.
 */
export function extractFacets(_group: CanonicalGroup, text: string): GroupFacets {
  const t = text.toLowerCase();
  const facets: GroupFacets = {
    items: matchAll(ITEM_WORDS, t),
    states: matchAll(STATE_WORDS, t),
    traits: matchAll(TRAIT_WORDS, t),
  };

  if (has(t, 'fixed')) facets.position = 'fixed';
  else if (has(t, 'sticky') || has(t, 'pins to')) facets.position = 'sticky';
  else if (has(t, 'static') || has(t, 'scrolls with')) facets.position = 'static';

  if (has(t, 'shadow') || has(t, 'elevated edge')) facets.divider = 'shadow';
  else if (has(t, 'hairline') || has(t, '1px') || has(t, 'one-pixel')) facets.divider = 'hairline';
  else if (has(t, 'borderless') || has(t, 'no divider')) facets.divider = 'none';

  const digitColumns = t.match(/(\d+)[- ]column/);
  if (digitColumns) {
    facets.columns = Number(digitColumns[1]);
  } else {
    const wordColumns = Object.entries(COLUMN_WORDS).find(([word]) => has(t, `${word}-column`));
    if (wordColumns) facets.columns = wordColumns[1];
  }

  if (has(t, 'accent') || has(t, 'brand color') || has(t, 'brand colour'))
    facets.surface = 'accent';
  else if (has(t, 'ink') || has(t, 'inverse surface')) facets.surface = 'ink';
  else if (has(t, 'muted') || has(t, 'subtle surface')) facets.surface = 'muted';
  else if (has(t, 'canvas') || has(t, 'page background')) facets.surface = 'canvas';

  return facets;
}
