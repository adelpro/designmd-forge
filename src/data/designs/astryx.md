---
version: alpha
name: astryx-design-system
description: Astryx is Meta's open-source design system, and it separates two things most systems mix — a component library that owns behaviour and accessibility, and a theme that owns appearance through CSS custom properties. The neutral theme described here is a muted, low-chroma system (near-white canvas, near-black accent) whose interface reads as calm because contrast comes from hairlines and text weight rather than stacked surfaces. Light and dark are one token set, expressed as light-dark() pairs, so a page switches mode without a second stylesheet. Seven themes ship as token overrides over the same components, and type is a per-theme role pairing rather than a single family.
colors:
  canvas: '#f1f1f1'
  canvas-dark: '#1b1b1b'
  surface: '#ffffff'
  surface-dark: '#262626'
  card: '#ffffff'
  card-dark: '#1b1b1b'
  ink: '#000000'
  ink-dark: '#ffffff'
  ink-secondary: '#474747'
  ink-secondary-dark: '#9e9e9e'
  accent: '#1b1b1b'
  accent-dark: '#f1f1f1'
  accent-muted: '#d4d4d4'
  accent-muted-dark: '#474747'
  primary: '#1b1b1b'
  primary-dark: '#f1f1f1'
  border: '#e5e5e5'
  border-dark: '#333333'
  border-emphasized: '#d4d4d4'
  border-emphasized-dark: '#525252'
typography:
  body:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  heading:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  display:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.3333
rounded:
  none: 0px
  inner: 4px
  element: 8px
  container: 12px
  page: 28px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
---

## Overview

Astryx grew inside Meta for eight years before being open-sourced under MIT, and its shape explains its rules: a company full of internal tools kept rebuilding the same date picker, table and form, so the system put behaviour and accessibility in components and left appearance to a theme. The component library covers buttons, cards, navigation shells, inputs, tables, overlays, badges and status dots; the theme is a set of CSS custom property overrides, and a page opts in by importing a stylesheet and passing a theme object to `Theme`.

This entry documents the **neutral theme only**. It is the muted baseline: a near-white canvas (`{colors.canvas}`), white cards that separate by a hairline rather than a shadow, near-black type, and an accent that is itself near-black — the system's idea of emphasis is weight and altitude, not hue. Dark mode is not a palette swap: every token is written as `light-dark(light, dark)` so the same CSS serves both.

It is also the case that made "theme" a separate idea from "palette": one component library ships seven themes (Butter, Chocolate, Gothic, Matcha, Neutral, Stone, Y2K), each a token override with its own type pairing. The component library is out of scope here — `npx astryx` and its MCP endpoint are the canonical reference for component APIs.

## Color System

The neutral palette is deliberately chromatic-poor. Emphasis is `{colors.ink}` at full strength; de-emphasis is `{colors.ink-secondary}`; both flip in dark mode.

- `canvas` `{colors.canvas}` / `{colors.canvas-dark}` — the page floor.
- `surface` `{colors.surface}` / `{colors.surface-dark}` — raised panels and sheets.
- `card` `{colors.card}` / `{colors.card-dark}` — card fill, flat against the surface.
- `accent` `{colors.accent}` / `{colors.accent-dark}` — the interactive fill; in neutral it is ink, which is why buttons read as ink blocks.
- `accent-muted` `{colors.accent-muted}` / `{colors.accent-muted-dark}` — hover and selected washes.
- `border` `{colors.border}` / `{colors.border-dark}` — the 1px hairline that does most of the separating.
- `border-emphasized` `{colors.border-emphasized}` / `{colors.border-emphasized-dark}` — focus and selected edges.

Status roles are derived from a hue set (red, orange, yellow, green, teal, cyan, blue, purple, pink, gray) and each exposes text, icon, border and muted-fill variants. Use the status token for the surface you are painting — `--color-text-<status>` on a page, `--color-<status>-muted` for a banner — rather than inventing a tint.

## Typography

Type is a role system, not a size list. Neutral pairs Figtree for headings and body; the other themes swap the display family (Sarina for Butter, Fraunces for Chocolate, Playwrite US Trad for Matcha, Manufacturing Consent for Gothic) while keeping the same roles.

- Body `{typography.body}` at 14px / 1.5 — the default for lists, tables and forms.
- Small `{typography.small}` at 12px / 1.5 — metadata, captions, timestamps.
- Heading `{typography.heading}` at 20px / semibold — section titles inside a panel.
- Display `{typography.display}` at 28px / 1.3333 — page titles only; there is nothing between display and heading except whitespace.

Headings pair a size step with a weight step and a leading value as a set; changing one without the other breaks the hierarchy. Weights are 400 (body), 500/600 (headings and labels) and 700 for the rare emphasis — the system does not use 800+.

## Layout & Spacing

Spacing is a 4px base scale: 2, 4, 6, 8, 12, 16, 24 (0.125rem to 1.5rem in the token names), with 24px as the largest common gap inside a panel and 32px between page regions. Density is a first-class setting (`compact` / `default` / `comfortable`) that shifts the same scale rather than introducing new values.

Content sits in a single centred column on detail pages and a full-bleed grid on list pages. The AppShell owns global chrome (TopNav, SideNav); page templates own header, content and panel slots. Do not invent a second container width.

## Radius & Shapes

Radius is semantic, not aesthetic:

- `radius-none` 0px — tables, inline code, anything that should read as data.
- `radius-inner` 4px — chips, inputs inside a group.
- `radius-element` 8px — buttons, inputs, small cards.
- `radius-container` 12px — cards, panels, popovers.
- `radius-page` 28px — page-level sheets and the mobile dock.

Shapes are `rounded` or square; there is no pill variant in the base system, and no mixed radii inside one component. A 4px input inside a 12px card is correct; a 12px button inside a 12px card is not.

## Elevation

Elevation is four levels, each a shadow pair for light and dark:

- low — 1px and 8px blur, for a card that sits on the canvas.
- medium — 2px and 12px blur, for popovers and sticky headers.
- high — 8px and 24px blur, for modals and command palettes.
- inset — a 2px inset ring for hover (`shadow-inset-hover`) and selection (`shadow-inset-selected`).

Most separation in this system is a `{colors.border}` hairline, not a shadow. A card with a hairline and no shadow is the norm; adding a shadow to every card is the most common way output stops looking like Astryx.

## Components

- **Buttons** — one ink block per view. Variants are primary (accent fill, on-accent text), secondary (surface fill, hairline border), ghost (no fill, ink text) and destructive. Sizes are `sm` / `md` / `lg`; icon-only buttons must carry an `aria-label`.
- **Cards** — surface fill, `{colors.border}` hairline, 12px radius, 16–24px padding. A card never nests inside another card; use a section divider instead.
- **Navigation** — `AppShell` with `TopNav` (global), `SideNav` (section) and a command-palette trigger. Active items use `{colors.accent-muted}`, never a coloured bar.
- **Inputs** — 8px radius, hairline border, `{colors.border-emphasized}` on focus with a 2px inset ring. Labels sit above the field; helper text below in `{colors.ink-secondary}`. Errors switch the border to the error status token and add an icon, never colour alone.
- **Tables** — header row in small type at `{colors.ink-secondary}`, rows separated by hairlines, no zebra striping. Sorting and selection are part of the table component, not something to re-implement.
- **Overlays** — Dialog, Popover, Sheet and Drawer all take a title; a dialog without a title is an accessibility defect. Sheets slide with the medium duration and dismiss on scrim tap.
- **Status** — `Badge` and `StatusDot` use the status roles; a badge is `-muted` fill with matching text, never a saturated fill with white text.
- **Icons** — one set, 16px inside controls, 20px standalone, inheriting `currentColor`.

## Motion & Interaction

### Durations & Easings

Motion is a small scale, not a per-component decision:

- fast — 175ms (bounded 130–230ms) for hover, focus and state flips.
- medium — 410ms (bounded 310–550ms) for sheets, drawers and expanding panels.
- standard easing — `cubic-bezier(0.24, 1, 0.4, 1)` for entrances and moves.
- exit easing — `cubic-bezier(0.3, 0, 0.6, 0.6)` for dismissals.

### Motion Roles

Entrances are `ease-entrance` from slightly below with a fade; exits are faster than entrances and use `ease-exit`. Layout shifts animate transform and opacity only. A press state is a 1–2px scale or offset, settled by the fast duration.

### Reduced Motion

`prefers-reduced-motion` removes transforms and keeps opacity changes, capped at the fast duration. Nothing in the system requires motion to be understood.

### Banned Motion

No bounce, no spring overshoot, no looping decorative animation, no parallax, and no animating `width`, `height`, `top` or `left`. A spinner is the only indefinite animation allowed.

## Do's and Don'ts

- **Do** customise at the token level — colour, type, radius, motion — through a theme object. A designer can own the entire look without touching component source.
- **Do** keep one accent block per view. The accent is ink in neutral; using it as a background tint on every banner is the classic failure.
- **Do** separate with hairlines first and shadows second.
- **Do** use the status tokens for status, including their muted fills.
- **Do** reuse the table, dialog and date-picker components instead of rebuilding them; that breadth is why the system exists.
- **Don't** fork or wrap a component to change its appearance — that is what the theme layer is for.
- **Don't** reach for `swizzle` (ejecting a component's source) until theme tokens, component overrides and `className` have all failed; after swizzle you own the maintenance.
- **Don't** introduce tokens the theme does not define; an undefined custom property fails silently to a browser default.
- **Don't** mix light values into dark mode by hand — every token is already a `light-dark()` pair.
- **Don't** set an accent colour on text without checking contrast; accent on accent-muted is the usual casualty.

## Known Gaps

The component library is out of scope: this file describes the neutral theme's tokens, component conventions and motion, not the 150+ component APIs. Treat `npx astryx component <Name>` or the Astryx MCP endpoint as canonical for props, variants and behaviour.

Theme deltas are not reproduced here. The seven themes override these tokens (and the display family); a theme's palette is imported separately rather than written into this file. Component-part overrides and custom variants are also a theme feature, not a token, and are likewise not enumerated.

Accessibility behaviour (focus management, roving tabindex, live regions) lives in the components and is not restated per component here.

## Agent Prompt Guide

When generating an interface in this system:

1. Start from tokens: `canvas`, `surface`, `card`, `ink`, `ink-secondary`, `border`, `accent`. Never write a hex value that is not one of these.
2. Choose one accent block per view; everything else is surface, ink or hairline.
3. Use 8px radius for controls, 12px for containers, 0 for data.
4. Reach for elevation only for overlays; a static card gets a hairline.
5. Type: 14px body, 12px metadata, 20px section heading, 28px page title, weights 400/500/600.
6. Motion: 175ms for state changes, 410ms for sheets, standard easing in, exit easing out, nothing under reduced motion.
7. Dark mode comes free through the token pairs — do not write separate dark values, and do not set a background on `<body>` by hand.
8. If a component seems to need a style the theme cannot express, check `className` and component overrides before considering swizzle.
