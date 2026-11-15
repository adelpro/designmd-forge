---
version: alpha
name: masjid-al-haram
description: A warm, low-chroma palette board — ivory ground, sand and taupe mid-tones, softened black ink, one brushed gold accent, calligraphic Arabic display type.
colors:
  sacred-ivory: '#E8E1D6'
  mecca-stone: '#C7B6A1'
  haram-sand: '#A89377'
  madinah-taupe: '#7F6B54'
  haram-black: '#2B2B2B'
  bronze-touch: '#5A4631'
  golden-accent: '#B8945A'
  olive-grey: '#6F7569'
  canvas: '#E8E1D6'
  ink: '#2B2B2B'
  accent: '#B8945A'
  primary: '#5A4631'
typography:
  display-ar:
    fontFamily: 'Amiri, "Noto Naskh Arabic", serif'
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.4
  display:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: 0.18em
  heading:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  eyebrow:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.22em
rounded:
  none: 0px
  inner: 2px
  element: 4px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 64px
  3xl: 96px
---

## Overview

This is a palette-led identity: eight measured colours, one mood, and almost no interface furniture. Everything in it is warm and slightly dusty — ivory limestone, sand, taupe, bronze, a gold that reads as brushed metal rather than jewellery, and a black softened to `#2B2B2B` so it never glares against the ivory. There is no blue, no pure white and no pure black anywhere in the set, and that absence is the system: contrast comes from depth of tone, not from reaching for the extremes.

The composition it implies is symmetrical and ceremonial. The source board places a calligraphic Arabic lockup dead centre over an architectural photograph, then a wide-tracked serif line, then a thin rule with a centred ornament. Interfaces built from it should feel like signage in a courtyard — centred, quiet, generously spaced — rather than like a dashboard. Density is the failure mode: this palette loses its calm the moment it is asked to hold three columns of small text.

**Provenance.** The eight colour values are measured from the source palette board. The type pairings, scale steps, spacing and component rules below are authored to complete the system — the board fixes colour and typographic *treatment* (calligraphic Arabic display, tracked serif capitals, hairline rules), not a measurement of any live product. Treat colour as exact and the rest as a defensible default to adjust.

## Color System

Eight values, used as a tonal ramp rather than as interchangeable brand colours.

- `sacred-ivory` `{colors.sacred-ivory}` — the canvas. Page floor, poster ground, and the only colour a full-bleed hero may sit on. It is the alias target for `canvas`.
- `mecca-stone` `{colors.mecca-stone}` — the first step up from the floor: section bands, table headers, inactive tabs, the fill behind a quote.
- `haram-sand` `{colors.haram-sand}` — mid-tone. Hairlines at 1px, input borders, dividers, disabled labels. Never a text colour on ivory; its contrast is too low.
- `madinah-taupe` `{colors.madinah-taupe}` — secondary ink. Metadata, captions, timestamps, helper text. This is the darkest tone that still reads as "muted".
- `haram-black` `{colors.haram-black}` — the ink. All body and heading text, and the alias target for `ink`.
- `bronze-touch` `{colors.bronze-touch}` — the deep metal. Pressed and selected states, the fill of a primary button once hovered, and any place the gold needs a shadow rather than a highlight.
- `golden-accent` `{colors.golden-accent}` — the accent, and the only true accent in the set. Reserved for hairline ornament, the eyebrow rule, focus rings, active nav indication and small iconography. It is a hairline colour, not a fill colour.
- `olive-grey` `{colors.olive-grey}` — the one cool-leaning tone, and the release valve. Use it for neutral status, quotation attribution sets and anywhere two adjacent warm panels need separating without adding a border.

Two boundaries carry the whole system. **Gold never becomes a background behind running text** — it sits at roughly 2.6:1 against ivory, so gold-on-ivory text is a contrast failure by construction; invert it to `{colors.haram-black}` text on a gold rule or a gold outline. **Ivory and black are never replaced by `#FFF` and `#000`** — the two extremes are what make a warm palette look cheap, and both are one keystroke away in every framework's default theme.

## Typography

Two families, one job each: a calligraphic Arabic display face and a high-contrast serif for Latin capitals, with a neutral sans for anything that has to be read at length.

- Arabic display `{typography.display-ar}` — Amiri, set large and centred with normal tracking. Arabic is never letter-spaced; tracking a connected script breaks the joins.
- Latin display `{typography.display}` — Cormorant Garamond in uppercase with `0.18em` tracking. This is the "MASJID AL-HARAM" treatment: the tracking is the ornament, so do not add a second decoration around it.
- Heading `{typography.heading}` — Cormorant Garamond, sentence case, no tracking. Section titles only.
- Eyebrow `{typography.eyebrow}` — the same serif at 12px with `0.22em` tracking and uppercase, always followed by a rule or a dot separator. The source uses it as a subtitle line ("A place of peace · A journey of faith").
- Body `{typography.body}` — Inter at 16px / 1.7. Generous leading is part of the mood; 1.4 body text reads cramped against this palette.

Do not set Arabic and Latin in the same family. If a bilingual surface needs one voice, the Arabic leads and the Latin translation follows in the sans at a smaller size — never the reverse.

## Layout & Spacing

Base unit is 4px; the useful scale is 8, 12, 16, 24, 32 with two large steps at 64 and 96 for the gaps that make the composition breathe.

Content sits in a single centred column, max 1200px, with equal side margins. Symmetry is the organising idea: centred lockups, centred rules, mirrored card pairs, and no asymmetric two-column hero. Section rhythm is 96px between major bands and 64px on mobile — closer than that and the palette's calm collapses into an ordinary product page.

Ornament is on the grid, not scattered. A divider is a 1px `{colors.haram-sand}` rule with a small gold motif centred on it, spanning at most 60% of the column. One per section.

## Radius & Shapes

Corners are close to square because the reference is stone and metalwork: `0px` for images, bands and panels; `2px` (`inner`) for inputs and chips; `4px` (`element`) for buttons and small cards. No pills, no 12px+ radii, no circular avatars framed in gold. An arch shape is a deliberate illustration element, not a container radius — do not fake it with `border-radius: 50% 50% 0 0`.

## Elevation

Flat by default. Separation is tonal (`{colors.mecca-stone}` band on `{colors.sacred-ivory}` ground) or a 1px `{colors.haram-sand}` hairline, in that order. Shadows are allowed only on overlays that float above the page — menus, dialogs, drawers — as one soft warm shadow: `0 6px 24px rgba(43, 43, 43, 0.08)`. A card gets a hairline, never a shadow, and nothing gets a glow.

## Components

- **Hero lockup** — Arabic display centred, then the tracked Latin line, then the eyebrow with dot separators, then the ornament rule. All four are centred and stacked with 16–24px between elements. The lockup is never left-aligned or split across columns.
- **Buttons** — primary is a `{colors.bronze-touch}` fill with `{colors.sacred-ivory}` text, moving to `{colors.haram-black}` on hover; secondary is a 1px `{colors.haram-sand}` outline with `{colors.haram-black}` text that fills `{colors.mecca-stone}` on hover. Square-ish (4px), 12px/24px padding, uppercase eyebrow-style label at 12px with 0.12em tracking on secondary only.
- **Cards** — `{colors.sacred-ivory}` or white-free `{colors.mecca-stone}` fill, 1px `{colors.haram-sand}` border, 4px radius, 24px padding. Image on top, no overlay gradient, no hover lift.
- **Rules and dividers** — 1px `{colors.haram-sand}` at full width inside a section, or a 60% centred rule with the gold motif for a section break. Never a 2px+ border.
- **Inputs** — 2px radius, 1px `{colors.haram-sand}` border, `{colors.haram-black}` text, placeholder in `{colors.madinah-taupe}`. Focus replaces the border with `{colors.golden-accent}` and adds a 1px offset ring in the same tone; labels sit above in the eyebrow style.
- **Navigation** — centred or symmetric, uppercase tracked labels in `{colors.haram-black}`, active state indicated by a 1px gold underline, not by a filled pill.
- **Status** — success and warning borrow `{colors.olive-grey}` and `{colors.haram-sand}` with text in `{colors.haram-black}`; there is no green/red pair in this palette, so status is carried by icon and label as well as tone.
- **Quote / attribution** — `{colors.mecca-stone}` fill, `{colors.madinah-taupe}` body, gold hairline on the left edge only.

## Motion & Interaction

Slow and few. Fades and small vertical drifts only, 240ms for state changes, 600ms for a hero reveal, with `cubic-bezier(0.22, 0.61, 0.36, 1)` in both directions. Hover changes tone, not position; there is no card lift, no scale-up and no bounce. Gold does not animate — a shimmering or pulsing accent reads as a sale banner, which is the opposite of this identity. `prefers-reduced-motion` removes the drift and keeps a 120ms fade.

## Do's and Don'ts

- **Do** treat the eight colours as a tonal ramp and pick depth by role, not by preference.
- **Do** keep one accent moment per view — an ornament rule, a focus ring, an active underline.
- **Do** centre hero compositions and keep side margins equal.
- **Do** let the ivory ground show through; empty space is the palette's main material.
- **Don't** set gold text on ivory, or any gold text below 18px.
- **Don't** use `#FFFFFF` or `#000000` anywhere; substitute `{colors.sacred-ivory}` and `{colors.haram-black}`.
- **Don't** add gradients, glossy gold, bevels or metallic sheen — the gold is brushed, matte and thin.
- **Don't** put a shadow on a card, or a glow on anything.
- **Don't** introduce a second accent hue (a red CTA, a blue link) — links are `{colors.haram-black}` with a gold underline.
- **Don't** letter-space Arabic, or set Arabic in the Latin serif.
- **Don't** exceed two type sizes plus the eyebrow in a single block.

## Known Gaps

The board is a colour and typographic-direction artifact, not a product design. Colour values are exact; type families, size steps, spacing, radius and the component rules are authored to make the palette usable and should be adjusted against a real brief. Dark mode is not defined — the palette has no dark counterpart, and inverting these values produces a muddy brown interface rather than a deliberate one; treat dark mode as new work, not a token flip. Arabic shaping, numeral style (Western vs Arabic-Indic) and bilingual line-height behaviour are not covered here.

## Agent Prompt Guide

When generating an interface in this palette:

1. Ground on `{colors.sacred-ivory}`, ink on `{colors.haram-black}`, and never write `#FFF` or `#000`.
2. Use `{colors.mecca-stone}` for bands and fills, `{colors.haram-sand}` for 1px hairlines, `{colors.madinah-taupe}` for muted text.
3. Spend `{colors.golden-accent}` once per view, as a hairline, rule, underline or focus ring — not as a fill behind text.
4. Reserve `{colors.bronze-touch}` for pressed states and primary button fills.
5. Type: Amiri for Arabic display, Cormorant Garamond for Latin display/heading, `0.18em` tracking on the uppercase lockup, Inter 16px/1.7 for body, tracked 12px serif for the eyebrow.
6. Layout: centred column, symmetric margins, 96px between sections, one ornament divider per section.
7. Corners 0–4px, no pills; flat cards with a hairline, shadows only on overlays.
8. Motion: 240ms fades and slight drifts, no lift, no bounce, no animated gold.
