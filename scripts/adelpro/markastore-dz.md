---
version: alpha
name: markastore-dz
description: A dense Algerian shoe-and-accessories storefront on Woodmart — white ground, hairline greys, one red brand accent, green prices, 11px uppercase navigation and a four-column product grid.
colors:
  canvas: '#ffffff'
  surface: '#f6f6f6'
  surface-alt: '#f4f4f4'
  ink: '#0a0a0a'
  heading: '#242424'
  text: '#767676'
  text-strong: '#333333'
  accent: '#ea2430'
  primary: '#ea2430'
  accent-hover: '#ea0e1c'
  price: '#1fa84a'
  border: '#e7e7e7'
  ink-soft: '#6b6b6b'
typography:
  page-title:
    fontFamily: '"Libre Franklin", Arial, Helvetica, sans-serif'
    fontSize: 30px
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: -0.3px
  section-heading:
    fontFamily: '"Libre Franklin", Arial, Helvetica, sans-serif'
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
  nav:
    fontFamily: '"Libre Franklin", Arial, Helvetica, sans-serif'
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
  product-title:
    fontFamily: '"Libre Franklin", Arial, Helvetica, sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  price:
    fontFamily: '"Libre Franklin", Arial, Helvetica, sans-serif'
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.4
rounded:
  none: 0px
  control: 5px
  surface: 6px
  pill: 999px
spacing:
  xs: 5px
  sm: 10px
  md: 15px
  lg: 20px
  xl: 25px
  2xl: 30px
---

## Overview

A working storefront, not a brand exercise. The page is white, the type is small, and almost every division is a 1px grey hairline rather than a shadow or a background block. The personality comes from three deliberate choices and nothing else: a saturated red band across the very top, prices printed in green, and a product grid dense enough to show sixteen shoes without scrolling. Everything else is a neutral that gets out of the way of product photography.

Density is the governing idea. Body text is 12px, navigation is 11px uppercase, product titles are 12px — this is a catalogue built for scanning a lot of near-identical items, and the empty space is measured in 10–30px steps, not in sections. The reference is a wholesale price list rendered well, not a fashion editorial. If a layout decision makes the page calmer but fits fewer products above the fold, it is the wrong decision here.

**Provenance.** Colour, type sizes, radii and layout measurements are read from the live storefront's rendered CSS (Woodmart 8.6.2 theme plus a custom `sm-` layer, observed 2026-11-15). Prose rules are inference from that CSS and the rendered page, not a published brand guideline. No logos or product imagery are reproduced.

## Color System

A neutral scaffold with two functional accents. Red means "this site" or "act"; green means "price". Neither is decoration.

- `canvas` `{colors.canvas}` — the page floor. Product photography sits directly on it, with no tinted card behind.
- `surface` `{colors.surface}` — soft chips, filter pills, hover fills, empty-state blocks.
- `surface-alt` `{colors.surface-alt}` — the announcement bar and the slightly cooler grey used for utility rows.
- `ink` `{colors.ink}` — logo text and the darkest headings, including the black page-title band behind white text.
- `heading` `{colors.heading}` — h1/h2 outside the title band.
- `text-strong` `{colors.text-strong}` — product titles (`#333`), link text and sidebar filter labels.
- `text` `{colors.text}` — the default body colour. It is a light grey on purpose: descriptions are secondary to price and photo.
- `ink-soft` `{colors.ink-soft}` — metadata, counts, inactive tabs, breadcrumb separators.
- `accent` `{colors.accent}` — the brand red. Announcement bar, cart badge, primary buttons, the collection eyebrow, focus and hover on links. This is the only saturated hue on the page.
- `accent-hover` `{colors.accent-hover}` — the pressed/darker red. Do not use both reds in one block.
- `price` `{colors.price}` — money only. Never used for stock status, never for warnings.
- `border` `{colors.border}` — the 1px hairline doing almost all the separating: header underline, sidebar rules, card edges, chip outlines.

Two boundaries matter more than the rest. **Green is reserved for prices** — the moment it labels a badge or a "success" message it stops reading as money and the grid turns noisy. **Red never becomes a large background** beyond the 40px announcement bar and the black title band; at full-page scale the palette goes from retail to alarm.

## Typography

Two families with a clean split: Libre Franklin for anything that is a label or a title, Roboto for running text.

- Page title `{typography.page-title}` — Libre Franklin 30px / 900 with `-0.3px` tracking. Tight and heavy; this is the only place the 900 weight appears.
- Section heading `{typography.section-heading}` — 16px / 500 uppercase, used for sidebar titles ("GENRE", "MARQUE", "POINTURE") and block headings.
- Navigation `{typography.nav}` — 11px / 700 uppercase. Tracking is normal; the caps do the work.
- Body `{typography.body}` — Roboto 12px / 1.6 at `{colors.text}`. Small on purpose.
- Product title `{typography.product-title}` — 12px / 400 in `{colors.text-strong}`, clamped to two lines. It is deliberately not bold: bold titles compete with bold prices.
- Price `{typography.price}` — 11px / 700 in `{colors.price}`, with the currency suffix ("DA") set at the same size and weight.

Never set body copy in Libre Franklin or titles in Roboto; the pairing is the only typographic signal in the page. Do not go below 11px, and do not add letter-spacing to Arabic or Latin titles beyond the `1.2px` already used in the black title band.

## Layout & Spacing

Content is capped at `1222px` and centred, with a persistent left filter rail on desktop (roughly 3 of 12 columns) and a four-column product grid in the remaining space. The grid is a real four-up at desktop, three-up at tablet, two-up on mobile; it never becomes a single column while the image is still legible.

Vertical rhythm is a 5px ladder — 5, 10, 15, 20, 25, 30 — and the largest common gap is 30px. Sections are separated by a hairline plus 25–30px, not by a large void. The header is 90px tall on desktop (69px when the custom sticky `sm-header` is active), the announcement bar is 40px, and the black page-title band sits directly below the header without a gap.

Filters are a vertically stacked list of checkboxes with right-aligned counts; on mobile the same list becomes a slide-in drawer. Sort/view controls live on one row above the grid, left-aligned after the item count.

## Radius & Shapes

Near-square. `0px` for cards, images, the page-title band and inputs; `5px` (`control`) for buttons and selects; `6px` (`surface`) for soft callouts; `999px` (`pill`) for the horizontal filter chips only. The chips are the single rounded element on the page, which is what makes them read as filters.

No large radii, no glassmorphism, no rounded product cards. Product images are square-cropped with no border and no radius.

## Elevation

Flat. Separation is a `1px {colors.border}` hairline first, a `{colors.surface}` fill second, and a shadow almost never. Cards have no shadow at rest and no hover lift; the only motion on hover is the add-to-cart row appearing over the image. Dropdowns and the mobile drawer get one soft shadow (`0 4px 18px rgba(10, 10, 10, 0.08)`); nothing else does.

## Components

- **Announcement bar** — 40px tall, `{colors.accent}` background, white 13px text, centred. One message at a time.
- **Header** — white, 1px `{colors.border}` underline, sticky. Logo centred, search left, utility icons (account, cart with a red count badge) right. Nav row below in 11px uppercase, with the active item in `{colors.accent}`.
- **Page title band** — full-width `{colors.ink}` behind white text: a red uppercase eyebrow ("COLLECTION") above a 30px/900 title, with a one-line description in `{colors.text}` underneath.
- **Filter chips** — pill, `{colors.surface}` fill, 1px `{colors.border}`, 13px/600, 8px 14px padding. Active chip inverts to `{colors.ink}` with white text. Horizontally scrollable on mobile with the scrollbar hidden.
- **Filter rail** — uppercase 16px/500 group titles, checkbox rows at 13px with the option count pushed right in `{colors.ink-soft}`, groups separated by 1px rules.
- **Product card** — image, then title (2 lines max), then a category/meta line, then the price in green. No border, no radius, no shadow, no card padding. On hover the image swaps to a second shot and an add-to-cart row slides up from the bottom edge.
- **Buttons** — primary is `{colors.accent}` fill with white 700 uppercase label, `5px` radius, `5px 20px` padding; hover deepens to `{colors.accent-hover}`. Secondary is a transparent fill with a 1px `{colors.border}` outline and `{colors.text-strong}` label.
- **Inputs** — 0px radius, 1px `{colors.border}`, 12px text; focus switches the border to `{colors.accent}`. Labels are uppercase 12px above the field.
- **Pagination** — numbered squares, current page filled with `{colors.ink}`.
- **Footer** — white with a 1px top rule, four link columns in 12px, group titles uppercase.

## Motion & Interaction

Fast and functional. 250ms `ease` on hover, colour and opacity only. The only allowed transforms are the add-to-cart row sliding up 100% and the drawer sliding in from the left; nothing scales, bounces or loops. Image swap on hover is instant, not cross-faded. `prefers-reduced-motion` removes the slide and keeps the row visible.

## Do's and Don'ts

- **Do** keep 12px as the body size and let density carry the page.
- **Do** print prices, and only prices, in `{colors.price}`.
- **Do** separate with the `{colors.border}` hairline before reaching for a background or shadow.
- **Do** keep one red moment per block: the announcement bar, the CTA, or the active nav item.
- **Do** leave product images unrounded, unbordered and shadowless on `{colors.canvas}`.
- **Don't** add shadows or lifts to product cards on hover — the hover state is a second image plus the add-to-cart row.
- **Don't** use red for prices, sale badges in combination with the green price, or any inline status text.
- **Don't** set body copy in Libre Franklin or use 900 weight below the page title.
- **Don't** turn the filter chips square or the buttons pill-shaped; the shape split is what distinguishes the two.
- **Don't** introduce a second accent hue — there is no blue, no purple and no orange anywhere in the system.

## Known Gaps

There is no dark mode: the palette is light-only, and the only dark surface is the page-title band. The custom `sm-` layer and the Woodmart base style disagree in places (two reds within one hue, body 12px Roboto against 12px Libre Franklin titles), and this file records the rendered result rather than resolving that conflict. Checkout, account and email templates were not inspected. Arabic/RTL rendering exists on the site but the mirrored spacing was not measured. Icon set and product photography are out of scope.

## Agent Prompt Guide

When generating a storefront page in this style:

1. Ground on `{colors.canvas}`, body text `{colors.text}`, titles `{colors.text-strong}`, hairlines `{colors.border}`.
2. Body 12px Roboto, titles and labels Libre Franklin, nav 11px uppercase.
3. Grid: filter rail left, four product cards across, 10–30px gaps.
4. Product card: square image, 12px title, green 11px bold price, no box.
5. Red `{colors.accent}` only on the announcement bar, primary buttons, active nav and cart badge.
6. Buttons 5px radius, chips pill, everything else square.
7. Focus and hover move colour, never geometry, except the add-to-cart slide.
