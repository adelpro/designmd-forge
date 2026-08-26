#!/usr/bin/env node
/**
 * Builds an offline index fragment for the MOBILE source:
 * TrustOtc/awesome-mobile-design-md (mobile design archetypes, flat files).
 *
 * Writes each DESIGN.md into src/data/designs/ and emits the mobile entry list
 * to a staging file (.staging/mobile.json). Run scripts/load-data.mjs
 * afterwards to merge this source with the web one into src/data/index.json.
 *
 * Usage: node scripts/build-index-mobile.mjs <path-to-cloned-mobile-repo>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoPath = process.argv[2];
if (!repoPath || !existsSync(repoPath)) {
  console.error(
    'Usage: node scripts/build-index-mobile.mjs <path-to-cloned-awesome-mobile-design-md-repo>'
  );
  process.exit(1);
}

const outDataDir = join(__dirname, '..', 'src', 'data');
const outDesignsDir = join(outDataDir, 'designs');
const stagingDir = join(__dirname, '..', '.staging');
mkdirSync(outDesignsDir, { recursive: true });
mkdirSync(stagingDir, { recursive: true });

function extractPlainMarkdownDescription(content) {
  const section = content.match(/##\s+[^\n]*\n+([\s\S]+?)(\n##|\n#|$)/);
  const body = section ? section[1] : content.replace(/^#.+\n/, '');
  const firstPara = body.split(/\n\s*\n/).find((p) => p.trim().length > 0) || '';
  return firstPara.replace(/\n/g, ' ').trim();
}

function titleCaseFromFilename(filename) {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const designMdDir = join(repoPath, 'design-md');
if (!existsSync(designMdDir)) {
  console.error(`[mobile] No design-md/ directory found at ${designMdDir}`);
  process.exit(1);
}

const files = readdirSync(designMdDir).filter(
  (f) => extname(f).toLowerCase() === '.md' && f !== 'README.md'
);
const index = [];
for (const file of files) {
  const slug = basename(file, extname(file));
  const content = readFileSync(join(designMdDir, file), 'utf-8');
  const headingMatch = content.match(/^#\s+(.+?)\s*$/m);
  const title = headingMatch ? headingMatch[1].trim() : titleCaseFromFilename(slug);
  const longDescription = extractPlainMarkdownDescription(content);

  writeFileSync(join(outDesignsDir, `${slug}.md`), content, 'utf-8');
  index.push({
    slug,
    title,
    category: 'Mobile',
    platform: 'mobile',
    short_description: (longDescription || title).slice(0, 160),
    long_description: longDescription ? longDescription.slice(0, 600) : title,
    word_count: content.split(/\s+/).length,
  });
}

writeFileSync(
  join(stagingDir, 'mobile.json'),
  JSON.stringify(
    {
      source: 'https://github.com/TrustOtc/awesome-mobile-design-md',
      license: 'MIT',
      designs: index,
    },
    null,
    2
  ),
  'utf-8'
);
console.log(`[mobile] ${index.length} mobile archetypes staged. Next: run "npm run load-data".`);
