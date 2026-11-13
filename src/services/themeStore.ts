import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ThemeVariant {
  parent: string;
  id: string;
  name: string;
  kind: 'mood' | 'style' | 'color';
  mode: 'light+dark' | 'dark-only' | 'light-only';
  type: { display: string; body: string };
  typeClass: 'serif' | 'sans' | 'script' | 'mono' | 'mixed';
  palette: {
    canvas: string;
    surface: string;
    accent: string;
    ink: string;
    canvasDark: string;
    accentDark: string;
  };
  derived: false;
}

export interface ThemesArtifact {
  pin: { repo: string; version: string; license: string; source: string };
  parents: Record<string, { default_theme: string; themes: ThemeVariant[] }>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_PATH = join(__dirname, '..', 'data', 'themes.json');

let cached: ThemesArtifact | null = null;

export function loadThemes(): ThemesArtifact {
  if (cached) return cached;
  cached = JSON.parse(readFileSync(THEMES_PATH, 'utf-8')) as ThemesArtifact;
  return cached;
}

/** Only systems that ship official variants appear here — today, Astryx alone. */
export function themesFor(parent: string): ThemeVariant[] {
  return loadThemes().parents[parent]?.themes ?? [];
}

export function findTheme(parent: string, id: string): ThemeVariant | undefined {
  const normalized = id.trim().toLowerCase();
  return themesFor(parent).find((theme) => theme.id === normalized);
}

export function allThemes(): ThemeVariant[] {
  return Object.values(loadThemes().parents).flatMap((parent) => parent.themes);
}
