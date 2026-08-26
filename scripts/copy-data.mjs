#!/usr/bin/env node
import { cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'src', 'data');
const dest = join(__dirname, '..', 'dist', 'data');

if (!existsSync(src)) {
  console.error(`No data directory at ${src}. Run "npm run refresh-data" first.`);
  process.exit(1);
}

cpSync(src, dest, { recursive: true });
console.log(`Copied data from ${src} to ${dest}`);
