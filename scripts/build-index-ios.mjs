#!/usr/bin/env node
/**
 * Builds an offline index fragment for the iOS / native-app source:
 * meliwat/awesome-ios-design-md (200 app design systems, one folder per app
 * under a category folder, each with 4 framework flavors).
 *
 * Indexes the framework-neutral DESIGN.md per app as the entry (platform
 * "ios", slug prefixed "ios-" to avoid collisions with web/mobile slugs,
 * category from the parent folder), and copies all four flavor files
 * (neutral, swiftui, expo, android) into src/data/designs/ so the
 * designmd_get_design_md "flavor" param can fetch implementations on demand.
 *
 * Emits the ios entry list to .staging/ios.json. Run scripts/load-data.mjs
 * afterwards to merge into src/data/index.json.
 *
 * Usage: node scripts/build-index-ios.mjs <path-to-cloned-awesome-ios-design-md-repo>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoPath = process.argv[2];
if (!repoPath || !existsSync(repoPath)) {
  console.error("Usage: node scripts/build-index-ios.mjs <path-to-cloned-awesome-ios-design-md-repo>");
  process.exit(1);
}

const outDataDir = join(__dirname, "..", "src", "data");
const outDesignsDir = join(outDataDir, "designs");
const stagingDir = join(__dirname, "..", ".staging");
mkdirSync(outDesignsDir, { recursive: true });
mkdirSync(stagingDir, { recursive: true });

const FLAVOR_FILES = {
  "": "", // neutral -> <slug>.md
  swiftui: "-swiftui",
  expo: "-expo",
  android: "-android",
};

function extractPlainMarkdownDescription(content) {
  const section = content.match(/##\s+[^\n]*\n+([\s\S]+?)(\n##|\n#|$)/);
  const body = section ? section[1] : content.replace(/^#.+\n/, "");
  const firstPara = body.split(/\n\s*\n/).find((p) => p.trim().length > 0) || "";
  return firstPara.replace(/\n/g, " ").trim();
}

function titleCase(name) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

const rootDir = join(repoPath, "design-md");
if (!existsSync(rootDir)) {
  console.error(`[ios] No design-md/ directory found at ${rootDir}`);
  process.exit(1);
}

const index = [];
const categoryFolders = readdirSync(rootDir, { withFileTypes: true }).filter((d) => d.isDirectory());
for (const cat of categoryFolders) {
  const catDir = join(rootDir, cat.name);
  const appFolders = readdirSync(catDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const app of appFolders) {
    const appDir = join(catDir, app.name);
    const neutralPath = join(appDir, "DESIGN.md");
    if (!existsSync(neutralPath)) {
      console.warn(`[ios] Missing DESIGN.md in ${appDir}, skipping.`);
      continue;
    }

    const neutral = readFileSync(neutralPath, "utf-8");
    const slug = `ios-${app.name}`;
    const headingMatch = neutral.match(/^#\s+(.+?)\s*$/m);
    const title = headingMatch ? headingMatch[1].trim() : titleCase(app.name);
    const longDescription = extractPlainMarkdownDescription(neutral);

    // Copy all four flavor files so flavor=... can be served offline.
    for (const [flavor, suffix] of Object.entries(FLAVOR_FILES)) {
      const srcName = suffix === "" ? "DESIGN.md" : `DESIGN${suffix}.md`;
      const srcPath = join(appDir, srcName);
      if (!existsSync(srcPath)) continue;
      const content = readFileSync(srcPath, "utf-8");
      writeFileSync(join(outDesignsDir, `${slug}${suffix === "" ? "" : suffix}.md`), content, "utf-8");
    }

    index.push({
      slug,
      title,
      category: titleCase(cat.name),
      platform: "ios",
      short_description: (longDescription || title).slice(0, 160),
      long_description: longDescription ? longDescription.slice(0, 600) : title,
      word_count: neutral.split(/\s+/).length,
    });
  }
}

writeFileSync(
  join(stagingDir, "ios.json"),
  JSON.stringify({ source: "https://github.com/meliwat/awesome-ios-design-md", license: "MIT", designs: index }, null, 2),
  "utf-8"
);
console.log(`[ios] ${index.length} iOS app designs staged (all framework flavors copied). Next: run "npm run load-data".`);