---
version: alpha
name: uslub-design-system
description: "Uslub is a writing-voice web client built from paper and hairlines rather than chrome. A white canvas sits inside a parchment shell, one measured blue carries every action, and a four-layer shadow supplies the depth a border cannot. Type is self-hosted Satoshi at a 17px base, with IBM Plex Arabic and a looser, untracked scale for Arabic and IBM Plex Mono for keys and code."
colors:
  canvas: "#ffffff"
  canvas-dark: "#000000"
  canvas-parchment: "#f5f5f7"
  canvas-parchment-dark: "#1c1c1e"
  canvas-cream: "#ffefc4"
  surface-pearl: "#fafafc"
  surface-pearl-dark: "#272729"
  ink: "#1d1d1f"
  ink-on-dark: "#f5f5f7"
  ink-secondary: "#6e6e73"
  ink-secondary-dark: "#cccccc"
  primary: "#086288"
  primary-on-dark: "#97d7ff"
  primary-hover: "#065273"
  primary-hover-dark: "#b8e2ff"
  focus: "#086288"
  focus-dark: "#97d7ff"
  support: "#4d8dba"
  tint-selected: "rgba(151, 215, 255, 0.24)"
  hairline: "#e0e0e0"
  hairline-dark: "#3a3a3c"
  divider-soft: "rgba(0, 0, 0, 0.04)"
  error: "#d70015"
  error-dark: "#ff7b72"
  success: "#0f7b3f"
  success-dark: "#30d158"
  warning-surface: "#ffefc4"
  error-tint: "rgba(215, 0, 21, 0.08)"
  error-tint-dark: "rgba(255, 123, 114, 0.14)"
  success-tint: "rgba(15, 123, 63, 0.1)"
  success-tint-dark: "rgba(48, 209, 88, 0.14)"
  scrim: "rgba(0, 0, 0, 0.32)"
typography:
  display-xl: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 64px, fontWeight: 600, lineHeight: 1.05, letterSpacing: -0.035em }
  display-section: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 36px, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.02em }
  display-lg: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 34px, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.374px }
  display-feature: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 22px, fontWeight: 600, lineHeight: 1.25 }
  body: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 17px, fontWeight: 400, lineHeight: 1.47 }
  body-strong: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 17px, fontWeight: 600, lineHeight: 1.24 }
  caption-strong: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 14px, fontWeight: 600, lineHeight: 1.29 }
  fine-print: { fontFamily: "Satoshi, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 13px, fontWeight: 400, lineHeight: 1.45 }
  code: { fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13px, fontWeight: 400, lineHeight: 1.4 }

spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-6: "24px"
  space-8: "32px"
  space-12: "48px"
  space-16: "64px"

rounded:
  sm: "8px"
  lg: "18px"
  pill: "999px"
---

## Overview

Uslub is a web client for keeping a writer's voice consistent wherever they write. This entry covers the browser app: the public landing page, the signed-in shell with its sidebar and account block, the auth screens, and the two handoff surfaces where a key or a bootstrap prompt is revealed.

The atmosphere is paper, not chrome. A white canvas sits on a parchment shell, separation comes from 1px hairlines and a four-layer shadow, and exactly one blue carries every action. Type is Satoshi on a 17px base with negative tracking on the display sizes, form controls are 44px tall with a visible 2px focus ring, and the press gesture shrinks a control to 97% in 100ms.

## Color System

Surfaces are `--canvas` (pure white, the paper a panel or field sits on), `--canvas-parchment` (#f5f5f7, the page shell and the hover wash), `--surface-pearl` (#fafafc, secondary buttons and code fills) and `--canvas-cream` (#ffefc4, the only warm surface, reserved for the key reveal, notices and the warning wash). Text is `--ink` (#1d1d1f, noted in the source at 14.7:1 on cream) and `--ink-secondary` (#6e6e73, 5.07:1, AA); `--ink-on-dark` is the ink value the theme switch installs.

Interaction is a single accent. `--primary` (#086288, 6.75:1 on white, and the same ratio for white text on it), `--primary-hover` (#065273, 8.53:1) and `--focus`, which is the same value as primary and is drawn as a 2px ring at a 2px offset. `--support` (#4d8dba, 3.60:1) is for graphics and 18px semibold only, never body text on a light surface. `--tint-selected` is the accent at 24% and marks a chosen row, the active nav link and the pressed reveal button.

Lines are `--hairline` (#e0e0e0) wherever content is separated and `--divider-soft` (4% black) for an inset ring. Status is `--error` (#d70015), `--success` (#0f7b3f) and their tints, with `--warning-surface` equal to cream. A tint is always a wash behind a word, never the word itself.

| Token | Value | Role |
|---|---|---|
| `--canvas` | #ffffff | panels, fields, modals, the landing bar |
| `--canvas-parchment` | #f5f5f7 | page shell, hover wash, footer |
| `--surface-pearl` | #fafafc | secondary button fill, code background |
| `--canvas-cream` | #ffefc4 | key reveal, notice, warning wash |
| `--ink` | #1d1d1f | primary text on every light surface |
| `--ink-secondary` | #6e6e73 | captions, hints, inactive nav, meta |
| `--primary` | #086288 | fills, links, active nav, focus ring |
| `--primary-hover` | #065273 | hover state of a primary fill |
| `--support` | #4d8dba | graphics and large semibold only |
| `--hairline` | #e0e0e0 | every divider and control border |

Theme switching reuses the same variable names and swaps values. Dark values are declared twice, once inside `@media (prefers-color-scheme: dark)` scoped to `:root:not([data-theme='light'])` and once under `[data-theme='dark']`, so the system preference applies until a user chooses explicitly; `[data-theme='light']` is an otherwise empty block whose only job is to defeat the media query. Canvas goes to #000000, parchment to #1c1c1e, pearl to #272729, ink to `--ink-on-dark`, and primary becomes sky (`--primary-on-dark` #97d7ff, 9.57:1 on #272729) with hover at #b8e2ff. Cream, `--tint-selected`, `--divider-soft` and `--scrim` keep their light values in both themes, and in this file the dark entries carry the `-dark` suffix while `ink-on-dark` and `primary-on-dark` keep the names the stylesheet itself uses.

## Typography

Satoshi is self-hosted from `/fonts` at 400, 500, 600 and 700, all woff2 with `font-display: swap`; the 600 and 700 faces both point at `satoshi-700.woff2`. `index.html` preloads satoshi-400, satoshi-700, ibm-plex-arabic-400 and ibm-plex-arabic-700. Body text is 17px at 1.47, and `--font-sans` falls back through system-ui and Segoe UI.

The scale is `--display-xl` 64/1.05, `--display-section` 36/1.15, `--display-lg` 34/1.15, `--display-md` 28/1.2, `--display-feature` 22/1.25, `--display-sm` 21/1.19, `--body` 17/1.47, `--body-strong` 17/1.24, `--caption` 14/1.43, `--caption-strong` 14/1.29, `--fine-print` 13/1.45 and `--code` 13/1.4 in IBM Plex Mono. The display face appears on the hero (`--display-xl`), section headings (`--display-section`), page titles (`--display-lg`), card titles (`--display-feature`) and panel titles (`--display-sm`); everything else is body, caption or fine print. Tracking is negative where the size is large (-0.035em on xl, -0.02em on section, -0.374px on lg, -0.28px on md), positive on `--display-sm` (0.231px), and region labels use uppercase `--caption-strong` at 0.04em.

Arabic is a separate stack, not a font swap. `html[lang='ar']` rebinds `--font-sans` to `--font-arabic` (IBM Plex Arabic, then Noto Sans Arabic, Tahoma, system-ui), drops every display size a notch (xl 44px, section 28px, lg 32px, feature 19px, md 26px, sm 20px), raises leading (xl 1.3, body 1.75, caption 1.65) and sets `letter-spacing: 0` on the display classes and the brand, because Arabic joins cursively and Latin tracking hints at breaks inside a word. Monospace stays Latin and untracked, since keys, ids and code are not translated.

## Layout

Spacing is an eight-step scale: `--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-6` 24px, `--space-8` 32px, `--space-12` 48px, `--space-16` 64px. Rhythm helpers are `.stack` (24px gap, 12px when tight), `.cluster` (12px, wrapping), `.spread` (baseline, space between) and `.grow`.

Containers are fixed widths rather than a fluid grid: the app shell is `220px 1fr` with a 1000px content maximum and 48px 48px 64px padding, the landing page is 1000px centred with 64px vertical padding, `.page` and `.legal` are 720px, the auth card is 440px, the modal is 560px wide and at most 85vh tall, and the footer grid is 1080px in `2fr 1fr 1fr 1fr`. Prose is capped at `--measure` (68ch) while tables and rows keep the full column.

## Components

### Buttons

`.btn` is a pill (`--radius-pill`) set in `--caption-strong` with 12px 26px padding and a 40px minimum height, which becomes 48px and 14px 30px under `@media (pointer: coarse)`. `.btn--primary` fills `--primary` and labels itself with `--canvas`; hover moves the fill to `--primary-hover` rather than tinting it. `.btn--secondary` keeps a `--surface-pearl` fill and a 1px inset ring from `--divider-soft` so it can never be read as the primary, and `.btn--tertiary` has no fill at all, only an underline on hover and `--space-2` of inline padding. `.btn--destructive` writes in `--error` and hovers onto `--error-tint`, `.btn--sm` drops to 30px for dense rows, and disabled controls sit at 0.45 opacity with a not-allowed cursor. Press is the shared gesture, `scale(0.97)` on the 100ms press transition, with a 2px `--primary` focus ring at a 2px offset.

### Header

On a phone the header is `.shell__bar`, one brand and one disclosure, and it does not exist on the desktop: `.shell__bar` and `.shell__menu` are `display: none` and only the media query below 720px reveals them. Desktop navigation is the persistent `.shell__aside` instead, a 220px column with `padding: var(--space-6) var(--space-3)`, `border-inline-end: 1px solid var(--hairline)` and an inset hairline shadow, filled with `--canvas` in light mode and `--canvas-parchment` under `[data-theme='dark']`. The bar and the panel both stay in the DOM at every size and CSS alone decides visibility, so resizing never remounts the navigation or drops focus inside it. The brand row is `--body-strong` with `-0.374px` tracking and `0 var(--space-3)` padding, and its dot is `.shell__brand-dot`.

### Cards & Containers

`.panel` is a white surface at `--radius-lg` (18px) with `--space-6` padding and `--shadow-premium`, and it has two fills: `--parchment` and `--cream`. `.modal` uses the same radius and padding with an inset 1px `--hairline` ring instead of an outer shadow, a 560px width and an 85vh scroll cap, while `.auth__card` is a 440px white card with `--space-8` padding. `.key-reveal` is the cream container for a single secret, and `.notice` is a `--radius-sm` callout that turns `--error-tint` or `--success-tint` for bad and ok states. `.landing__feature` is the one card with a hairline border (12px radius), and it lifts by 2px on hover onto a literal `0 12px 24px -16px rgba(0, 0, 0, 0.14)`.

### Navigation & Menu

The navigation column is `.nav` with `gap: 2px` and `margin-top: var(--space-6)`. A row is `.nav__link`: `8px 12px` padding, `--radius-sm`, `--caption-strong`, `--ink-secondary`, and a 150ms `ease-out` transition on background, colour, shadow and transform. Hover washes the row with `--canvas-parchment`, raises `--shadow-premium` and moves it 2px along the inline axis, which `[dir='rtl'] .nav__link:hover` flips to -2px; the active row is `--primary` on `--tint-selected` with `--shadow-inner`. Below the column sits the account block, `--radius-md` on parchment with the premium shadow, and inside it a two-option locale switch with no menu at all, because a menu for two options is a click for nothing. The disclosure that opens the panel on a phone lives in `.shell__bar`, and because the panel is never unmounted, opening it costs a class change rather than a render.

### Footer

The footer is a four-column grid, 1080px in `2fr 1fr 1fr 1fr`, so the brand column carries four times the weight of each link column. Its links are ordinary `.nav__link`-tier text at `--caption-strong` and reuse the 150ms `ease-out` interaction rather than inventing a footer-specific timing. It sits below the `.shell__main` content column, which is capped at 1000px with `--space-12` side padding, so the footer reads wider than the content on purpose. `--canvas-parchment` is the shared wash behind the shell, the hover state and the footer.

### Input Fields

`.field` is a column with an 8px gap holding `.field__label` (`--caption-strong`), the control, a `.field__hint` (`--fine-print`, `--ink-secondary`) and `.field__error` (`--fine-print`, `--error`, prefixed with the word "Error: " by a `::before`). `.field__input`, `.field__textarea` and `.field__select` share a `--canvas` fill, a 1px `--hairline` border, `--radius-sm`, 10px 12px padding and a 44px minimum height, with the select at 40px and the textarea in `--code` at a 220px minimum and vertical resize. Focus takes a 2px `--focus` outline at a 2px offset and darkens the border to `--primary`. A leading `.field__icon` sits at `inset-inline-start: 12px` and the input reserves 38px, and `.field__reveal` is a 34px hit area inside the field at the inline end.

### Distinctive Components

The press is the product's signature: every `.pressable`, `button`, `.nav__link`, `.row`, `.link` and `.locale-switch__option` transitions transform on the 100ms press curve, and `:active` scales to 0.97, a value taken from Apple's own example after 0.95 over 160ms read as a wobble. `.key-reveal` shows an API key once on cream with the value in `--code` on white, `word-break: break-all` and no dismiss control. `.prompt-block` is the bootstrap prompt: IBM Plex Mono at 13px, `pre-wrap`, a 22rem scroll cap and `--ink-secondary`. `.skeleton` renders list shapes at the height the real rows will take so content does not shift when it arrives, pulsing opacity only. `.row` is the three-line selectable record (label, id, meta) at 68px with `--tint-selected` for `aria-selected`, `.or-rule` draws a hairline through the word "or" so it does not read as a third option, and `.strength` renders a four-segment password meter. Everything mirrors: the stylesheet uses logical properties (`inset-inline-start`, `border-inline-end`, `padding-inline`) so a `dir` change needs no second rule.

## Motion & Interaction

### Durations & Easings

Three durations are tokenised: `--motion-press: 100ms ease-out`, `--motion-ui: 160ms ease-out` and `--motion-enter: 180ms cubic-bezier(0.2, 0.8, 0.2, 1)`, with `--motion` as an alias of `--motion-ui`. Component code also hard-codes 150ms `ease-out` on nav links, landing links, footer links and the locale and theme triggers, 200ms on the landing bar shadow and the drawer, 240ms `cubic-bezier(0.2, 0.7, 0.2, 1)` on the feature icon, 0.64s and 0.9s on the hero rise and settle, 1.6s on the skeleton pulse and 900ms linear on the spinner. Only the enter curve is a token; the rest are literals.

### Motion Roles

Press is the input path and must feel immediate: transform on 100ms, `scale(0.97)`. Hover is feedback and takes a frame or two: colour, background, border and shadow on 150ms to 200ms, at most a 2px inline shift or a 1px lift. Enter is the longest gesture at 180ms; the scrim cross-fades and the modal scales from 0.98 to 1 from the origin of whatever had focus, and exit runs the same path in reverse so it reads as one object. Page-load choreography runs once, the five hero blocks rising 18px with a 40ms to 320ms stagger and the shot settling over 0.9s; feature cards and step rows reveal on a `view()` scroll timeline with no loop. Progress (spinner 900ms linear) and waiting (skeleton 1.6s) are the only repeating animations.

### Reduced Motion

`prefers-reduced-motion: reduce` is treated as a gentler equivalent, not a dead interface: `transition-property` is narrowed to opacity, background-color, color and border-color, animation duration drops to 1ms with one iteration, and the modal and scrim still cross-fade over 180ms with `transform: none`. The skeleton stops at full opacity, the hero animation is cut to 1ms with no delay, feature cards lose their scroll timeline, and the later depth block removes button and nav transforms entirely.

### Banned Motion

No `transition: all`, no spring physics, no parallax, no loop that runs forever (spinner and skeleton excepted), and no hover longer than 200ms. No scale above 1.06 on hover and none at all on text or rows. No motion that hides state or delays a state change it is meant to announce, and nothing that survives a reduced-motion preference as a transform.

## Responsive

Breakpoints are 1024, 920 and 760, plus `@media (pointer: coarse)`. At 1024 the landing bar becomes a `1fr auto 1fr` grid with a 44px circular menu button and a full-bleed `100dvh` drawer, hiding the centre links and the sign-in pill. At 920 the feature grid collapses to one column and the footer goes to two columns with the brand block spanning both. At 760 the app shell drops to a single column with `auto minmax(0, 1fr)` rows, the aside becomes a sticky top bar at 44px menu targets, main padding tightens to 24px 16px, the hero stacks to `copy` then `shot` with a 40px hero size, and the landing padding drops to `--space-12`. Coarse pointers raise buttons to 48px and the locale options to 44px square, and the modal keeps its 85vh cap rather than a fixed height.

## Do's & Don'ts

**Do:**

- Take every colour from a token; the accent is `--primary` and there is exactly one.
- Put content on `--canvas`, page shell on `--canvas-parchment`, and reach for `--canvas-cream` only for the key reveal, notices and the warning wash.
- Separate surfaces with `--hairline` or `--shadow-premium`, in that order of preference.
- Use `--radius-sm` (8px), `--radius-lg` (18px) or `--radius-pill`, and nothing between them on product screens.
- Keep press at `scale(0.97)` over `--motion-press` and hover at 160ms or less.
- Write direction-agnostic CSS with `inset-inline-start`, `border-inline-end` and `padding-inline`.
- Pair an Arabic heading size with `letter-spacing: 0` and the taller Arabic leading.
- Cap prose at `--measure` (68ch) and let tables keep the full column.

**Don't:**

- Don't introduce a second accent, a gradient, or a coloured surface beyond cream, the tints and the two status washes.
- Don't put `--support` on body text; it is 3.60:1 and belongs on graphics or 18px semibold.
- Don't use `transition: all`, a hover longer than 200ms, spring physics, parallax, or any loop beyond the spinner and skeleton.
- Don't animate a transform when `prefers-reduced-motion: reduce` is set; the section above is the complete list of what stays.
- Don't invent radii outside 8px, 18px and the pill, or shadows outside the token set.
- Don't centre-align long Arabic or Latin prose, and don't apply Latin negative tracking to Arabic.
- Don't hard-code `#fff` or `#000` where `--canvas` and `--ink` exist; the theme switch is what makes them differ.

## Known Gaps

The frontmatter carries only colours and type, so spacing, radii and shadows live in this prose rather than as tokens an exporter can lift, and the linter reports the spacing and rounded maps as missing. Motion is not tokenised beyond the three durations, and a dozen component timings are literals. Several values are not in the token file at all: the amber `#b26a00` in the level-2 password strength state, the 12px and 16px radii in landing and menu surfaces, the 6px radii on the locale and theme triggers, and the shadow literals on `.landing__shot`, `.landing__nav--scrolled` and `.landing__feature`. `--radius-md` is referenced by `.shell__account` but never defined in tokens.css, and `--accent`, `--canvas-deep`, `--ink-tertiary` and `--hairline` appear only as inline fallbacks. Press is declared twice: tokens.css scales buttons to 0.97, then the later depth block re-declares `button:active` with `translateY(1px)` and `--shadow-press`, and the later rule wins for buttons in the app. `--canvas-cream` has no dark value, so cream surfaces stay warm in dark mode by design rather than by a dark token.

## Agent Prompt Guide

Build with the light values as the default and switch the same variable names for dark; never write a component-level dark override. Reach for the eight spacing steps and the three radii, put depth on `--shadow-premium` rather than on new shadows, and keep a single blue for every interactive state. Set body at 17px/1.47 and step up through the real display sizes, resetting tracking and raising leading whenever the document language is Arabic. Give buttons the pill radius and the 40px to 48px height, fields 44px with a 2px focus ring at 2px offset, and every press `scale(0.97)` in 100ms, removing transforms under reduced motion.
