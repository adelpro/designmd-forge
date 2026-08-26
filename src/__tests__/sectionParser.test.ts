import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSections, getSection } from "../services/sectionParser.js";

const numberedFormat = `---
name: Test
---

## 1. Visual Theme & Atmosphere

This is the overview text.
It spans two lines.

## 2. Color Palette & Roles

Primary is reserved for buttons.

## 7. Do's and Don'ts

Never use gradients.
`;

const plainFormat = `---
name: Test
---

## Overview

Plain overview text.

## Colors

Plain colors text.

## Do's and Don'ts

Plain dos and donts text.
`;

test("parseSections extracts sections from numbered format", () => {
  const sections = parseSections(numberedFormat);
  const overview = sections.find((s) => s.canonical === "overview");
  assert.ok(overview, "overview section should be found");
  assert.match(overview!.content, /This is the overview text/);
});

test("parseSections extracts sections from plain format", () => {
  const sections = parseSections(plainFormat);
  const colors = sections.find((s) => s.canonical === "colors");
  assert.ok(colors, "colors section should be found");
  assert.match(colors!.content, /Plain colors text/);
});

test("getSection returns dos_and_donts for both formats", () => {
  const numbered = getSection(numberedFormat, "dos_and_donts");
  const plain = getSection(plainFormat, "dos_and_donts");
  assert.ok(numbered);
  assert.ok(plain);
  assert.match(numbered!.content, /Never use gradients/);
  assert.match(plain!.content, /Plain dos and donts text/);
});

test("getSection returns undefined for a section not present", () => {
  const result = getSection(plainFormat, "shapes");
  assert.equal(result, undefined);
});
