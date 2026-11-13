export const HUE_FAMILIES = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
  'neutral',
] as const;

export type HueFamily = (typeof HUE_FAMILIES)[number];

export type Mode = 'light' | 'dark' | 'both';

export interface DerivedPalette {
  mode: Mode;
  canvas: string;
  ink: string;
  accent: string;
  accentHue: HueFamily;
  temperature: 'warm' | 'neutral' | 'cool';
  declared_colors: number;
  derived: true;
}

const NEUTRAL_SATURATION = 0.12;
/** Below this relative luminance a `primary` is ink/black, not a brand accent. */
const ACCENT_LUMINANCE_FLOOR = 0.15;
const DARK_CANVAS_LUMINANCE = 0.18;

const CANVAS_KEYS = [
  'canvas',
  'background',
  'background-body',
  'bg',
  'paper',
  'base',
  'page-background',
];
const INK_KEYS = ['ink', 'text', 'body', 'fg', 'foreground', 'body-text'];
const ACCENT_KEYS = ['accent', 'brand', 'primary-action', 'cta'];

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseHex(hex: string): Rgb | null {
  const value = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-f]{3,8}$/i.test(value)) return null;
  const expanded =
    value.length === 3 || value.length === 4
      ? value
          .slice(0, 3)
          .split('')
          .map((char) => char + char)
          .join('')
      : value.slice(0, 6);
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function toHsl(hex: string): Hsl {
  const rgb = parseHex(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) return { h: 0, s: 0, l };

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h *= 60;
  if (h < 0) h += 360;
  return { h, s, l };
}

export function hueFamily(hex: string): HueFamily {
  const { h, s } = toHsl(hex);
  if (s < NEUTRAL_SATURATION) return 'neutral';
  if (h >= 340 || h <= 15) return 'red';
  if (h <= 45) return 'orange';
  if (h <= 70) return 'yellow';
  if (h <= 165) return 'green';
  if (h <= 195) return 'teal';
  if (h <= 250) return 'blue';
  if (h <= 290) return 'purple';
  return 'pink';
}

function findColor(colors: Record<string, string>, preferred: string[]): string | undefined {
  const entries = Object.entries(colors);
  for (const name of preferred) {
    const exact = entries.find(([key]) => key.toLowerCase() === name);
    if (exact) return exact[1];
  }
  for (const name of preferred) {
    const partial = entries.find(([key]) => key.toLowerCase().includes(name));
    if (partial) return partial[1];
  }
  return undefined;
}

/**
 * Reads a frontmatter `colors:` map into the three facts the palette filter
 * needs. Role names are not a controlled vocabulary across the corpus, so the
 * two traps are explicit: `primary` is a button fill in one file and body ink
 * in another (accept it as an accent only above a luminance floor), and a file
 * with any `-dark` key documents both modes rather than one.
 */
export function derivePalette(colors: Record<string, string>): DerivedPalette | null {
  const canvas = findColor(colors, CANVAS_KEYS);
  const ink = findColor(colors, INK_KEYS);
  if (!canvas && !ink) return null;

  const keys = Object.keys(colors).map((key) => key.toLowerCase());
  // "on-dark" is a contrast pair for dark imagery (white text on a photo), not
  // a dark mode. Only a real dark surface token (paper-dark, ink-dark,
  // background-dark) means the file documents both modes.
  const declaresDark = keys.some((key) => key.replace(/on-dark|on_dark/g, '').includes('dark'));
  const mode: Mode = declaresDark
    ? 'both'
    : canvas && luminance(canvas) < DARK_CANVAS_LUMINANCE
      ? 'dark'
      : 'light';

  const explicitAccent = findColor(colors, ACCENT_KEYS);
  const primary = findColor(colors, ['primary']);
  const accent =
    explicitAccent ??
    (primary && luminance(primary) >= ACCENT_LUMINANCE_FLOOR ? primary : undefined);

  const accentColor = accent ?? ink ?? canvas ?? '#000000';
  const canvasHsl = canvas ? toHsl(canvas) : null;
  const temperature: DerivedPalette['temperature'] =
    !canvasHsl || canvasHsl.s < NEUTRAL_SATURATION
      ? 'neutral'
      : canvasHsl.h >= 16 && canvasHsl.h <= 70
        ? 'warm'
        : canvasHsl.h >= 166 && canvasHsl.h <= 250
          ? 'cool'
          : 'neutral';

  return {
    mode,
    canvas: canvas ?? '',
    ink: ink ?? '',
    accent: accentColor,
    accentHue: hueFamily(accentColor),
    temperature,
    declared_colors: Object.keys(colors).length,
    derived: true,
  };
}
