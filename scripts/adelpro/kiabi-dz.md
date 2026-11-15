---
version: alpha
name: kiabi-dz
description: Kiabi Algérie's Shopify storefront — white ground, deep navy type, Figtree throughout, heavy black-outlined buttons and oversized 900-weight prices in a wide, airy family-fashion grid.
colors:
  canvas: '#ffffff'
  surface: '#f7f7f8'
  surface-alt: '#f2f2f5'
  surface-muted: '#f3f3f5'
  ink: '#000000'
  brand: '#040037'
  primary: '#040037'
  brand-hover: '#36335f'
  muted: '#b3b2c2'
  border: '#e6e6eb'
  border-soft: '#f0f0f0'
typography:
  price:
    fontFamily: 'Figtree, sans-serif'
    fontSize: 20px
    fontWeight: 900
    lineHeight: 1.2
  heading:
    fontFamily: 'Figtree, sans-serif'
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
  subheading:
    fontFamily: 'Figtree, sans-serif'
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.4
  label:
    fontFamily: 'Figtree, sans-serif'
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: 'Figtree, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  subtle: 8px
  soft: 10px
  panel: 16px
  sheet: 20px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
---

## Overview

A family fashion retailer's storefront where the product photography is the interface and the chrome is almost invisible: white page, black body text, and one deep navy (`#040037`) that carries every heading and every price. Type is Figtree at a comfortable 16px base, and the only elements that assert themselves are price figures at 20px/900 and buttons drawn as heavy black outlines rather than filled blocks.

The personality is commercial and unpretentious. Copy is warm and family-first ("Toujours plus pour les familles"), not luxury; there is no serif, no gold, no editorial whitespace. Layout runs wide (up to `160rem`) with large gaps between cards, so a grid of eight outfits reads as a wall of product rather than a list of records. Scale comes from image size and price weight, not from decoration.

**Provenance.** Colours, type sizes, button geometry, radii and header measurements are read from the live storefront's rendered CSS (Shopify theme `kiabify`, observed 2026-11-15). Inter is also loaded by the theme but was not observed on any rendered element; Figtree covers the page. Prose rules are inference from that CSS and the rendered page, not a published brand guideline. No logos or product imagery are reproduced.

## Color System

Almost monochrome. Two colours do the work and both are dark: navy for identity and commerce, black for text and outlines.

- `canvas` `{colors.canvas}` — the page floor. Product imagery sits directly on white with no card fill.
- `surface` `{colors.surface}` — the lightest tint for panels, drawers and empty states.
- `surface-alt` `{colors.surface-alt}` / `surface-muted` `{colors.surface-muted}` — the two near-identical greys used for chips, table rows, badges and image placeholders. They are interchangeable neutrals; do not invent a third.
- `ink` `{colors.ink}` — body text, links and the 2px button outlines. Pure black is deliberate here.
- `brand` `{colors.brand}` — Kiabi's deep navy. Every heading, every price, the wishlist and account accents. It is a *type* colour first and a fill colour second.
- `brand-hover` `{colors.brand-hover}` — the lifted navy for hover and pressed states on navy elements.
- `muted` `{colors.muted}` — struck-through original prices, disabled labels and inactive tabs.
- `border` `{colors.border}` / `border-soft` `{colors.border-soft}` — 1px separators. The soft variant is for dividers inside panels where a full-contrast rule would be noisy.

The boundary that matters: **navy is used on white, rarely as a white-on-navy fill.** When a navy block is needed, it is a full-bleed band or a small badge, never a large card with text inside it — a navy panel upscaled across a section reads as a different retailer. Red is not in the palette: sale pricing is signalled by the struck-through `{colors.muted}` original beside a navy current price, not by a colour change.

## Typography

One family, Figtree, carrying every role; the hierarchy is built from weight and size only.

- Price `{typography.price}` — 20px / 900 in `{colors.brand}`. The heaviest thing on the page, by design: the price is the headline of a card.
- Heading `{typography.heading}` — 18px / 700 navy for section and modal titles.
- Subheading `{typography.subheading}` — 15px / 700 navy for card titles and panel headers.
- Label `{typography.label}` — 12px / 600 for badges, size chips, "So Easy" service tags and metadata.
- Body `{typography.body}` — 16px / 400 black at 1.5. Links are the same size, underlined in black.

No uppercase, no letter-spacing and no display face anywhere: the theme sets `text-transform: none` and normal tracking throughout, and that flatness is what keeps the storefront feeling friendly rather than promotional. Never introduce a second family for headings, and never use the 900 weight below 18px — at body sizes it stops being emphasis and becomes noise.

## Layout & Spacing

Page width is `160rem` (1600px) with full-bleed bands inside it; the header is fixed and 127px tall, transparent over the hero image and white once stuck. Product grids are wide-margin: eight items on a desktop row, four on tablet, two on mobile, with 16–24px gutters and no card frames — the gutter is the only separation.

Sections breathe more than a catalogue would: 32–48px between blocks, hero bands at full viewport width. Alignment is left, headline blocks are centred only inside promotional bands. Filters and sorting are progressive-disclosure controls above the grid rather than a permanent sidebar, which is the main structural difference from a dense multi-brand shop.

## Radius & Shapes

Mostly square, with one soft idiom for containers: `0px` for the default button, badges and price blocks; `8px` (`subtle`) for inputs, chips and small cards; `10px` (`soft`) for search fields and dropdowns; `16px` (`panel`) and `20px` (`sheet`) for drawers and modals. Never round a product image frame, and never mix a 20px sheet radius with square inner controls.

## Elevation

Flat. Cards have no border and no shadow; depth is created by the gutter and by the image's own contrast against white. Overlays (drawer, mini-cart, size guide, cookies) get one soft neutral shadow, roughly `0 8px 24px rgba(0, 0, 0, 0.12)`, and a `{colors.border-soft}` hairline. Hover on a card changes the image or reveals a quick-add control; it never lifts the card.

## Components

- **Header** — fixed, 127px, transparent over the hero and white when stuck; black outline icons, cart count as a small navy badge. Search is a wide `{colors.surface}` field with 10px radius.
- **Buttons** — the signature component: transparent fill, `2px solid {colors.ink}`, `0px` radius, 700 weight at 14.4px, `10.8px 18px` padding, with an inverse (black fill, white text) for the primary action. Hover inverts. No gradients, no shadows, no colour fill.
- **Price block** — `{typography.price}` in `{colors.brand}` for the current price, with the original price beside it in `{colors.muted}` struck through. Never recolour the current price for a sale.
- **Product card** — image, then a 15px/700 navy title, then label-size service tags ("So Easy", "Coton bio"), then the price block, then quick-add on hover. No border, no radius, no shadow.
- **Badges and size chips** — 12px/600 on `{colors.surface-alt}`, 8px radius, `4px 8px` padding; out-of-stock sizes are `{colors.muted}` text on white with a 1px `{colors.border}` rule.
- **Drawers and modals** — white sheet, 16–20px radius, `{colors.border-soft}` divider under the title, stacked 16px blocks inside.
- **Forms** — 8px radius, 1px `{colors.border}`, 16px text, label above in 12px/600 navy; focus rings navy, never a colour change on the field.
- **Footer** — white with a `{colors.border-soft}` top rule, 16px body links in black, column titles 12px/600 navy.

## Motion & Interaction

Short and mechanical: 200ms ease on colour, border and opacity, plus a drawer slide. Quick-add fades in over the image; the sticky header transitions from transparent to white in 200ms. Nothing scales, nothing bounces, no carousel autoplay in the product grid. `prefers-reduced-motion` removes the header transition and the quick-add fade.

## Do's and Don'ts

- **Do** keep one family, Figtree, and build hierarchy from weight and size.
- **Do** print current prices in `{colors.brand}` at 900 weight and strike the original in `{colors.muted}`.
- **Do** draw primary buttons as 2px black outlines on transparent, inverting on hover.
- **Do** leave product cards frameless on white and separate them with gutters only.
- **Don't** add a second accent hue; there is no red, green or pink anywhere in the storefront chrome.
- **Don't** letter-space or uppercase text — the theme renders sentence case with normal tracking throughout.
- **Don't** use 900 weight below 18px, and don't set body copy above 16px.
- **Don't** put a shadow or a lift on a product card, or a border around its image.
- **Don't** fill large panels with `{colors.brand}`; navy is type and small badges first.
- **Don't** mix the 16px/20px sheet radii with square inner controls.

## Known Gaps

There is no dark mode. The theme loads Inter alongside Figtree but no rendered element used it, so this file records Figtree only. Cookie banner, checkout, account area and transactional emails were not inspected, and the `kiabi.com` parent site (which returns 403 to non-browser clients) may diverge from the Algerian storefront. Arabic/RTL mirroring exists in a separate stylesheet (`kiabify-rtl-min.css`) and was not measured. Icon set and photography are out of scope.

## Agent Prompt Guide

When generating a storefront page in this style:

1. White ground, black body text, `{colors.brand}` for headings and prices.
2. One family, Figtree; 16px body, 18px headings, 15px card titles, 20px/900 prices.
3. Buttons: transparent fill with a 2px black border and 0 radius, inverting on hover.
4. Cards: image, title, service tags, price block; no border, no shadow, no radius.
5. Gutter-based grid, 8 items wide at desktop, generous 16–24px gutters.
6. Greys `{colors.surface}` / `{colors.surface-alt}` / `{colors.border}` carry all secondary surfaces and rules.
7. Motion: 200ms colour and opacity transitions only.
