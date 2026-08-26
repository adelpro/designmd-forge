#!/usr/bin/env node
/**
 * Builds an offline index fragment for the WEB source:
 * VoltAgent/awesome-design-md (web design systems, one folder per site).
 *
 * Writes each DESIGN.md into src/data/designs/ and emits the web entry list to
 * a staging file (.staging/web.json). Run scripts/load-data.mjs afterwards to
 * merge this source with the mobile one into src/data/index.json.
 *
 * Usage: node scripts/build-index-web.mjs <path-to-cloned-awesome-design-md-repo>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoPath = process.argv[2];
if (!repoPath || !existsSync(repoPath)) {
  console.error("Usage: node scripts/build-index-web.mjs <path-to-cloned-awesome-design-md-repo>");
  process.exit(1);
}

const outDataDir = join(__dirname, "..", "src", "data");
const outDesignsDir = join(outDataDir, "designs");
const stagingDir = join(__dirname, "..", ".staging");
mkdirSync(outDesignsDir, { recursive: true });
mkdirSync(stagingDir, { recursive: true });

function extractFrontmatterDescription(content) {
  if (!content.startsWith("---")) return null;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return null;
  const fm = content.slice(3, end);
  const blockMatch = fm.match(/description:\s*\|\s*\n([\s\S]*?)(\n\w[\w-]*:|$)/);
  if (blockMatch) {
    return blockMatch[1].split("\n").map((l) => l.replace(/^\s{2}/, "")).join(" ").trim();
  }
  const inlineMatch = fm.match(/description:\s*"?(.+?)"?\s*$/m);
  if (inlineMatch) return inlineMatch[1].trim();
  return null;
}

function extractPlainMarkdownDescription(content) {
  const section = content.match(/##\s+[^\n]*\n+([\s\S]+?)(\n##|\n#|$)/);
  const body = section ? section[1] : content.replace(/^#.+\n/, "");
  const firstPara = body.split(/\n\s*\n/).find((p) => p.trim().length > 0) || "";
  return firstPara.replace(/\n/g, " ").trim();
}

const designMdDir = join(repoPath, "design-md");
const readme = readFileSync(join(repoPath, "README.md"), "utf-8");

const lines = readme.split("\n");
let currentCategory = "Uncategorized";
const readmeEntries = [];
const categoryHeadingRe = /^### (.+)$/;
const itemRe = /^- \[\*\*(.+?)\*\*\]\(https:\/\/getdesign\.md\/([a-z0-9.-]+)\/design-md\) - (.+)$/;

for (const line of lines) {
  const catMatch = line.match(categoryHeadingRe);
  if (catMatch) {
    if (/^(What is|Request a|AI Design|Collection|What's Inside|How to Use|Contributing|License)/.test(catMatch[1])) {
      if (catMatch[1] !== "Collection") continue;
    }
    currentCategory = catMatch[1].replace(/\s*·.*$/, "").trim();
    continue;
  }
  const itemMatch = line.match(itemRe);
  if (itemMatch) {
    const [, title, slug, description] = itemMatch;
    readmeEntries.push({ title, slug, category: currentCategory, short_description: description.trim() });
  }
}
console.log(`[web] Parsed ${readmeEntries.length} entries from README across categories.`);

const index = [];
let missing = 0;
for (const entry of readmeEntries) {
  const designPath = join(designMdDir, entry.slug, "DESIGN.md");
  if (!existsSync(designPath)) {
    console.warn(`[web] Missing local DESIGN.md for slug "${entry.slug}", skipping.`);
    missing++;
    continue;
  }
  const content = readFileSync(designPath, "utf-8");
  const longDescription = extractFrontmatterDescription(content) || extractPlainMarkdownDescription(content);
  writeFileSync(join(outDesignsDir, `${entry.slug}.md`), content, "utf-8");
  index.push({
    slug: entry.slug,
    title: entry.title,
    category: entry.category,
    platform: "web",
    short_description: entry.short_description,
    long_description: longDescription ? longDescription.slice(0, 600) : entry.short_description,
    word_count: content.split(/\s+/).length,
  });
}

// Pick up any folders present on disk but not yet listed in the README.
const knownSlugs = new Set(readmeEntries.map((e) => e.slug));
for (const folder of readdirSync(designMdDir, { withFileTypes: true })) {
  if (!folder.isDirectory() || knownSlugs.has(folder.name)) continue;
  const designPath = join(designMdDir, folder.name, "DESIGN.md");
  if (!existsSync(designPath)) continue;
  const content = readFileSync(designPath, "utf-8");
  const longDescription = extractFrontmatterDescription(content) || extractPlainMarkdownDescription(content);
  writeFileSync(join(outDesignsDir, `${folder.name}.md`), content, "utf-8");
  index.push({
    slug: folder.name,
    title: folder.name.replace(/[-.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "Uncategorized (not yet in upstream README)",
    platform: "web",
    short_description: (longDescription || "").slice(0, 160),
    long_description: longDescription ? longDescription.slice(0, 600) : "",
    word_count: content.split(/\s+/).length,
  });
  console.log(`[web] Added orphan folder "${folder.name}" not listed in README.`);
}

writeFileSync(
  join(stagingDir, "web.json"),
  JSON.stringify({ source: "https://github.com/VoltAgent/awesome-design-md", license: "MIT", designs: index }, null, 2),
  "utf-8"
);
console.log(`[web] ${index.length} web designs staged (${missing} missing). Next: run "npm run load-data".`);