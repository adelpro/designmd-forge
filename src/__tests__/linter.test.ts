import { test } from "node:test";
import assert from "node:assert/strict";
import { lintDesignMdContent } from "../services/linter.js";

test("lintDesignMdContent returns structured findings for content with no frontmatter", async () => {
  const result = await lintDesignMdContent("just some text, no yaml at all");
  assert.ok(Array.isArray(result.findings));
  assert.ok(result.summary);
  assert.ok(result.summary.warnings >= 1, "should warn about missing YAML");
});

test("lintDesignMdContent returns zero errors for a well-formed file", async () => {
  const wellFormed = `---
name: Test
colors:
  primary: "#000000"
---

## Overview

A test design system.
`;
  const result = await lintDesignMdContent(wellFormed);
  assert.equal(result.summary.errors, 0);
});
