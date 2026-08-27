---
version: alpha
name: shadcn-ui-new-york-design-system
description: An authored reference to the open-source shadcn/ui component design system (New York variant), built on Tailwind CSS and Radix UI primitives. The system is token-driven and sematic-first: every color is exposed as an HSL CSS variable pair (light/dark) wired to Tailwind utilities (bg-background, text-primary, border-input, ring), the default corner radius is a single 0.5rem scale, elevation is handled by hairline borders and CSS variable rings rather than heavy shadows, and components are composed from Radix primitives plus a small set of Lumo-compatible layout utilities. Dark mode is a first-class toggle of the variable set, not a palette override. The design system ships with a deliberate, restrained default token palette so that a brand signs in by overriding the CSS variables — not by editing component markup.

colors:
  background: hsl(0 0% 100%)
  foreground: hsl(240 10% 3.9%)
  card: hsl(0 0% 100%)
  card-foreground: hsl(240 10% 3.9%)
  popover: hsl(0 0% 100%)
  popover-foreground: hsl(240 10% 3.9%)
  primary: hsl(240 5.9% 10%)
  primary-foreground: hsl(0 0% 98%)
  secondary: hsl(240 4.8% 95.9%)
  secondary-foreground: hsl(240 5.9% 10%)
  muted: hsl(240 4.8% 95.9%)
  muted-foreground: hsl(240 3.8% 46.1%)
  accent: hsl(240 4.8% 95.9%)
  accent-foreground: hsl(240 5.9% 10%)
  destructive: hsl(0 84.2% 60.2%)
  destructive-foreground: hsl(0 0% 98%)
  border: hsl(240 5.9% 90%)
  input: hsl(240 5.9% 90%)
  ring: hsl(240 5.9% 10%)
  chart-1: hsl(12 76% 61%)
  chart-2: hsl(173 58% 39%)
  chart-3: hsl(197 37% 24%)
  chart-4: hsl(43 74% 66%)
  chart-5: hsl(27 87% 67%)

typography:
  font-sans:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  tabular-nums:
    fontFeature: tnum
---

## Overview

shadcn/ui is an open-source (MIT) design system for React + Tailwind CSS that ships components as **source code in your own project** rather than a published package. The visual language is applied through CSS variables defined once in the global stylesheet and consumed everywhere via Tailwind utility classes (`bg-background`, `text-primary`, `border-input`). The **New York** variant is the current default: tighter radius, denser controls, and a near-neutral grey-bone palette under a single HSL token set.

This entry documents the token system itself (variable names, default light/dark values, geometry, dark-mode strategy, and the semantic rules that keep a shadcn-based UI coherent). It does not enumerate every component export; it captures the *conventions* an agent must honor to produce output that looks like it was built on shadcn/ui.

## Color System

All color is expressed as **HSL channel triples** stored in CSS variables under `:root` (light) and `.dark` (dark). The `hsl(var(--token))` pattern is used inside utilities so the same token name resolves to either theme.

- **Semantic tokens** name the *role*, not the hue: `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`.
- **Foreground pairs**: each surface token has a matching `-foreground` for content drawn on it. Never put foreground color on a surface without its pair.
- **Default palette is neutral-bone**, not brand-colored. `--primary` defaults to a near-black (`240 5.9% 10%` light) so interfaces read as grey/ink — colour is introduced by overriding variables, not by reaching for raw Tailwind color utilities.
- **Chart tokens** (`--chart-1..5`) are a discrete categorical palette reserved for `Chart`/Recharts components; use them in order, not for UI chrome.
- **Dark theme** redefines the same variable names under `.dark` (mirrored lightness values). There is no separate dark palette; consumers toggle the class and every component recomposes.
- **Stateful chroma** is limited: `destructive` (red) and `chart` are the only saturated accents in the default set.

## Typography

- Font-agnostic by design: `--font-sans` (and `--font-mono`) are the only type hooks; pick Inter (documented default) or Geist and swap the variable.
- **14px base** body (`text-sm` is the workhorse size), display sizes step via utility scale (`text-2xl`/`text-3xl`+ for headers).
- **Semantic, not visual, classes dominate** — prefer `tracking-tight` on headings, `tabular-nums` for numeric columns/sums, `font-medium`/`font-semibold` for emphasis. Avoid arbitrary font-weight classes.
- Sizes are utility-driven; do not hardcode `font-size` px values in components.

## Radius & Shapes

- Single default radius token: `--radius: 0.5rem` (8px). All corners derive from it.
- Scale it with fraction utilities where needed (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`) — the base is `rounded-md`.
- **Full-pill radius is reserved** for selected controls (input pills, tags, `rounded-full` buttons) — not for cards or panels.
- No custom shadow-palette default: elevation reads as hairline `border` + a subtle `ring` on focus, not drop shadows.

## Elevation & Focus

- **Focus is a ring, not a color change**: `focus-visible:ring ring-ring`. The `--ring` token (default near-ink) must be visible against both themes.
- Borders use `--border`/`--input`, never a raw grey. Layer separation comes from `border` + `bg-card`/`bg-muted`, not from shadow depth.
- Selection states use `accent`/`muted` fills with the paired `-foreground`.

## Dark Mode

- Toggle a `.dark` class on the root for dark, or drive `prefers-color-scheme` — the variables switch wholesale.
- **Rule: no hard-coded `dark:` color overrides.** Because the token set already has dark values, components are written once and recomposed by the theme class. A `dark:bg-*` override is a smell — it bypasses the token contract.

## Components

Components are **Radix primitives + shadcn styling** and follow these structural conventions:

- **Button variants** (not ad-hoc colours): `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`. Choose a variant over a raw background class.
- **Card** is `CardHeader`/`CardTitle`/`CardDescription`/`CardContent` (optionally `CardFooter`) — never dump content into a bare `div` with card-like classes.
- **Overlays** (Dialog, Sheet, Drawer, Popover, DropdownMenu, AlertDialog) always compose their `Trigger`/`Content`/`Title` group and carry a `Title` for accessibility.
- **Selection** via `SelectGroup`/`SelectItem`, `ToggleGroup`, `RadioGroup`, `Checkbox`, `Switch` — grouped variants, not bespoke markup.
- **Data display**: `Table`, `Badge`, `Avatar` (with `AvatarFallback`), `Skeleton` for loading (no custom `animate-pulse` divs).
- **Feedback**: `sonner` toasts, `Alert` for callouts, `Progress`, `Spinner` for in-button loading.
- **Icons** are passed as components (`lucide-react` default) and positioned with `data-icon` slots, not size utilities inside the component.
- **Charts** wrap Recharts via `Chart` with the `--chart-*` palette.

## Do's & Don'ts

**Do:**
- Use the semantic utilities (`bg-background`, `text-muted-foreground`, `border-input`, `text-destructive`) everywhere — never raw Tailwind color names.
- Pick a component variant/primitive before writing custom markup; the library already covers the pattern.
- Keep spacing with layout utilities (`flex gap-*`), `size-*` for equal-dimension boxes, and `truncate` for ellipsis.
- Let the `dark` class + tokens handle dark mode; write components once.
- Put an accessible `Title` on every Dialog/Sheet/Drawer.

**Don't:**
- Don't override component colors/typography via `className` to fight the design system.
- Don't add `space-x-*`/`space-y-*` stacks — use flex with `gap-*`.
- Don't write manual `dark:` color overrides — that breaks the token contract.
- Don't sprinkle raw `z-index` on overlays — Dialog/Sheet/etc. manage their own stacking.
- Don't reach for arbitrary shadows/font-sizes that aren't in the scale.

## Known Gaps

This entry captures the default New York token set and conventions. Variant-specific presets (e.g. CSS-variable themes that override `--primary` to brand a site) are intentionally out of scope — a brand hooks in by overriding the variables, which this reference documents. Component APIs evolve with the registry; treat this as the token/geometry contract, not a version-locked API listing.

## Agent Prompt Guide

When generating UI styled after shadcn/ui: write the global stylesheet with the HSL variable set (light + `.dark`), then author every component with semantic utilities and Radix-based composition. Pick button variants instead of raw colors, place focus rings on `--ring`, prefer `border` + `bg-card` separation over shadows, and never hard-code a hue anywhere in component code. Apply dark mode by toggling the root class, never by `dark:` overrides.