#!/usr/bin/env node
/**
 * Builds src/data/themes.json from the seven published Astryx theme packages.
 *
 * Source of truth is the npm tarball, not the repo: `dist/theme.css` holds the
 * literal CSS custom properties (a `light-dark(#a, #b)` pair or a single hex),
 * and `fonts.css` holds the @import that names the families. Reading the
 * package is deterministic; scraping the docsite is not.
 *
 * Font ROLES cannot be inferred from an @import order, so the display/body
 * pairing below is transcribed from packages/themes/README.md at the same pin,
 * and then verified: if a named family is not in fonts.css the script fails
 * rather than shipping a pairing that does not exist.
 *
 * Usage: node scripts/build-data-astryx.mjs   (network: npm registry)
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { luminance } from '../dist/services/palette.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src', 'data');
const tmpDir = join(root, '.astryx-tmp');

const PIN = {
  repo: 'https://github.com/meta/astryx',
  version: '0.7.15',
  license: 'MIT',
  source: 'npm dist-tags latest, @astryxdesign/theme-*',
};

/** id, label, display/body pairing and type class — transcribed from the theme README. */
const THEMES = [
  { id: 'butter', name: 'Butter', display: 'Sarina', body: 'Outfit', typeClass: 'script' },
  {
    id: 'chocolate',
    name: 'Chocolate',
    display: 'Fraunces',
    body: 'Albert Sans',
    typeClass: 'serif',
  },
  {
    id: 'gothic',
    name: 'Gothic',
    display: 'Manufacturing Consent',
    body: 'Fustat',
    typeClass: 'mixed',
  },
  {
    id: 'matcha',
    name: 'Matcha',
    display: 'Playwrite US Trad',
    body: 'DM Sans',
    typeClass: 'script',
  },
  { id: 'neutral', name: 'Neutral', display: 'Figtree', body: 'Figtree', typeClass: 'sans' },
  { id: 'stone', name: 'Stone', display: 'Montserrat', body: 'Figtree', typeClass: 'sans' },
  { id: 'y2k', name: 'Y2K', display: 'Poppins', body: 'Crimson Text', typeClass: 'mixed' },
];

const TOKENS = {
  canvas: '--color-background-body',
  surface: '--color-background-surface',
  accent: '--color-accent',
  ink: '--color-text-primary',
};

function readToken(css, token) {
  const match = css.match(new RegExp(`${token}:\\s*([^;]+);`));
  if (!match) return null;
  const value = match[1].trim();
  const pair = value.match(/^light-dark\(\s*(#[0-9a-fA-F]{3,8})\s*,\s*(#[0-9a-fA-F]{3,8})\s*\)$/);
  if (pair) return { light: pair[1], dark: pair[2], dual: true };
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return { light: value, dark: value, dual: false };
  return null;
}

function fontFamilies(fontsCss) {
  return [...fontsCss.matchAll(/family=([^&:]+)/g)].map((match) =>
    decodeURIComponent(match[1]).replace(/\+/g, ' ')
  );
}

function packAndExtract(id) {
  const dir = join(tmpDir, id);
  mkdirSync(dir, { recursive: true });
  const tarballName = `astryxdesign-theme-${id}-${PIN.version}.tgz`;
  execFileSync('npm', ['pack', `@astryxdesign/theme-${id}@${PIN.version}`, '--silent'], {
    cwd: dir,
    stdio: 'pipe',
  });
  execFileSync('tar', ['-xzf', join(dir, tarballName), '-C', dir], { stdio: 'pipe' });
  return join(dir, 'package');
}

rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

const themes = [];
for (const spec of THEMES) {
  const pkg = packAndExtract(spec.id);
  const themeCssPath = join(pkg, 'dist', 'theme.css');
  const fontsCssPath = join(pkg, 'fonts.css');
  if (!existsSync(themeCssPath))
    throw new Error(`[astryx] ${spec.id}: no dist/theme.css in the package`);

  const css = readFileSync(themeCssPath, 'utf-8');
  const palette = {};
  for (const [role, token] of Object.entries(TOKENS)) {
    const value = readToken(css, token);
    if (!value) throw new Error(`[astryx] ${spec.id}: token ${token} not found in theme.css`);
    palette[role] = value.light;
    palette[`${role}Dark`] = value.dark;
    if (role === 'canvas') palette.dual = value.dual;
  }

  const families = existsSync(fontsCssPath)
    ? fontFamilies(readFileSync(fontsCssPath, 'utf-8'))
    : [];
  for (const family of [spec.display, spec.body]) {
    if (families.length && !families.some((name) => name.toLowerCase() === family.toLowerCase())) {
      throw new Error(
        `[astryx] ${spec.id}: declared font '${family}' is not in fonts.css (${families.join(', ')})`
      );
    }
  }

  const mode = palette.dual
    ? 'light+dark'
    : luminance(palette.canvas) < 0.18
      ? 'dark-only'
      : 'light-only';

  themes.push({
    parent: 'astryx',
    id: spec.id,
    name: spec.name,
    kind: 'mood',
    mode,
    type: { display: spec.display, body: spec.body },
    typeClass: spec.typeClass,
    palette: {
      canvas: palette.canvas,
      surface: palette.surface,
      accent: palette.accent,
      ink: palette.ink,
      canvasDark: palette.canvasDark,
      surfaceDark: palette.surfaceDark,
      inkDark: palette.inkDark,
      accentDark: palette.accentDark,
    },
    derived: false,
  });

  console.log(`[astryx] ${spec.id}: ${mode}, canvas ${palette.canvas}, accent ${palette.accent}`);
}

rmSync(tmpDir, { recursive: true, force: true });

if (themes.length !== 7) {
  console.error(`[astryx] expected 7 themes, built ${themes.length}`);
  process.exit(1);
}

const artifact = {
  pin: PIN,
  parents: {
    astryx: { default_theme: 'neutral', themes },
  },
};

writeFileSync(join(dataDir, 'themes.json'), JSON.stringify(artifact, null, 2), 'utf-8');
console.log(`[astryx] wrote 7 themes pinned at ${PIN.version}.`);
