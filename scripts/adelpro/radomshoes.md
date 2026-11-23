---
version: alpha
name: radomshoes
description: Radom Shoes' Algerian leather-goods storefront — square-cornered Jost in only three weights, coral CTAs against white and near-black, bilingual French/Arabic product cards, and prices in dinars set in plain ink.
colors:
  canvas: '#ffffff'
  surface: '#f5f5f5'
  ink: '#1f1f1f'
  brand: '#ff6f61'
  primary: '#ff6f61'
  brand-strong: '#f2695c'
  link: '#c2544a'
  link-on-surface: '#b54f45'
  link-hover: '#a2463e'
  muted: '#767676'
  secondary: '#a6a6a6'
  border: '#e5e5e5'
  border-strong: '#d8d8d8'
  success: '#28bb74'
  info: '#3b86ff'
  warning: '#ff9736'
typography:
  display:
    fontFamily: 'Jost, sans-serif'
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.2
  heading:
    fontFamily: 'Jost, sans-serif'
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.2
  subheading:
    fontFamily: 'Jost, sans-serif'
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: 'Jost, sans-serif'
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: 'Jost, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  micro:
    fontFamily: 'Jost, sans-serif'
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.5
rounded:
  none: 0px
  subtle: 4px
  round: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 96px
---

## Overview

An Algerian men's footwear shop that behaves like a straightforward catalogue: a thin shipping bar, a white logo-and-icons header, a photographic carousel, then an almost unstyled grid of boots, derbies and sneakers. The look is retail-generic in the most deliberate sense — Bootstrap-derived proportions, no card shadows, no rounded corners and a single warm accent doing all the pointing.

That accent is coral `{colors.brand}`, used for primary buttons and link text; the darker `{colors.link}` carries links and active navigation, shifting to `{colors.link-on-surface}` inside the grey top bar. Prices are **not** coral. They are `{colors.ink}` on white, formatted as `5900 دج`, and the product name above them is uppercase French. The bilingual layer is literal: French copy is followed by Arabic in the same line or the same paragraph (`Commander maintenant اطلب الآن`, `Paiement à la livraison الدفع عند الاستلام`). An agent that produces a French-only or Arabic-only interface has missed the store.

**Provenance.** Colours, Jost weights, type sizes, radii, spacings and control heights are read from the storefront's rendered CSS and Vite-built stylesheet (`app-c07b8240.css`, theme variables `--bs-*` and the site's own `--rs-*` overrides), observed 2026-11-23 on the home page and `/product/rockland-boots-cuir-veritable-4`. Prose rules are inference from that CSS and the rendered pages, not a published brand guideline. No logos, product photography or trademarks are reproduced.

## Color System

Three colours do nearly all the work: white `{colors.canvas}`, near-black `{colors.ink}` and one coral `{colors.brand}`. Everything else is a grey step or a utility status colour.

- `canvas` `{colors.canvas}` — page floor, cards, inputs and the main navigation bar.
- `surface` `{colors.surface}` — the slim top bar only. It is the one persistent grey band on the page.
- `ink` `{colors.ink}` — all body copy, navigation labels, product names, prices and the dark footer. It is a soft black, not pure `#000000`.
- `brand` `{colors.brand}` — the primary button fill and border. A bright coral, never used as a page background.
- `brand-strong` `{colors.brand-strong}` — the heavier coral reserved for the `.text-primary-lg` emphasis class. It is not a hover state for `{colors.brand}`; do not substitute one for the other.
- `link` `{colors.link}` — links, `.text-primary`, active nav items. A muted brick red, deliberately distinct from the button coral.
- `link-on-surface` `{colors.link-on-surface}` — the same link red darkened one step inside `{colors.surface}`, where the lighter value loses contrast.
- `link-hover` `{colors.link-hover}` — hover and focus colour for links.
- `muted` `{colors.muted}` — helper copy, placeholders and secondary labels.
- `secondary` `{colors.secondary}` — social icons and tertiary marks.
- `border` `{colors.border}` — regular separators, input borders, dropdown edges.
- `border-strong` `{colors.border-strong}` — the darker rule where a hairline would disappear.
- `success` `{colors.success}`, `info` `{colors.info}`, `warning` `{colors.warning}` — stock and status utilities from the base theme.

The boundary that matters: **coral is an action colour, brick red is a link colour.** A price in either is wrong. Sale pricing on this store is not signalled by recolouring the number; use the existing tag and strikethrough patterns instead of inventing a red price.

## Typography

Jost only. The build ships exactly three weights — 400 Book, 500 Medium and 600 Semi — and no bold file. Consequently `strong` and `.fw-bold` resolve to **500**, and `.fw-bolder` resolves to **600**. An agent asking for 700 will get a synthesised face that reads heavier than the store.

- `display` `{typography.display}` — carousel headings, 44px/600 desktop, dropping to 36px under 768px. Tight 1.2 leading, no letter-spacing.
- `heading` `{typography.heading}` — section heads such as "Tous les Produits", 36px/500, 1.2 leading.
- `subheading` `{typography.subheading}` — product titles and detail-page headings, 32px/500.
- `label` `{typography.label}` — uppercase micro labels ("LIVRAISON", "PROMOTION"), 13px/500 with 0.02em tracking. This is where the small-caps feel comes from; there is no separate display face.
- `body` `{typography.body}` — 16px/400 at 1.5, the base for descriptions and navigation.
- `micro` `{typography.micro}` — 11px/500 utility copy and the smallest tags.

Heading margins are 12px below and zero above; body paragraphs carry a 24px bottom margin. The rhythm is Bootstrap-derived rather than bespoke, so do not compress it into a dense editorial scale.

## Layout & Spacing

A centred 1140px container with 16px side gutters and a 32px grid gutter. Everything is wide and ordinary; the breathing room comes from section padding, not from decorative frames.

- `xs` `{spacing.xs}` — icon-to-label gaps and the top bar's vertical padding.
- `sm` `{spacing.sm}` — flex gaps between adjacent icon buttons.
- `md` `{spacing.md}` — container gutters and the step between compact controls.
- `lg` `{spacing.lg}` — card bodies, modal headers and the navbar's vertical padding.
- `xl` `{spacing.xl}` — offcanvas headers and the larger vertical rhythm.
- `2xl` `{spacing.2xl}` — the gap between trust-strip items and medium section breaks.
- `3xl` `{spacing.3xl}` — the `.py-12` section band around the product grid.

Buttons are 54px tall with 14px/28px padding; the small variant is 50px tall with 13px/24px padding. Form controls use 14px/24px padding and a 1px border. The cart and account drawers are 470px wide on the right. Size chips are at least 48px wide with 8px padding and a 1px `{colors.border}`-adjacent border.

## Radius & Shapes

Almost nothing is rounded. Buttons, inputs, selects, carousel controls, cards and offcanvas panels all resolve to `none` `{rounded.none}`. The `subtle` `{rounded.subtle}` value exists only on the generic `.rounded` utility and should not be applied to primary controls. `round` `{rounded.round}` is a 9999px pill radius applied to the small square radio input to make it a circle, and nothing else. A designer tempted to add 8px card corners has left this store.

## Elevation

Flat by default. Cards declare a transparent border and no shadow. The only depth in the system belongs to overlays: the cart/account drawer, modals and dropdowns carry a faint `0 2px 4px rgba(18,18,18,0.075)` shadow, and the modal backdrop is black at roughly 0.3 opacity. Do not put a shadow on a product card or a button — on this page a shadow reads as a different storefront.

## Components

### Header

Two rows. The upper `{colors.surface}` bar carries "Livraison disponible 58 wilayas", order tracking, shipping and contact links plus Facebook, Instagram and WhatsApp icons, all in `{typography.label}` or smaller. The lower white row holds a 150×50 logo at left and four icon-only controls at right — search, account, wishlist, cart — with no text labels. On phones the logo shrinks to `min(150px, 38vw)` and the four icons stay on one line. There is no horizontal category menu in the main header; categories live under the search drawer.

### Hero

A full-width photographic carousel of three slides, each with a 44px/600 heading and a "Voir la boutique" text link. Slide controls are 42px square white buttons that vanish below 992px. The hero is the only place where a large heading sits on imagery; everywhere else type sits on flat white.

### Product Card

Square product image with a front/back swap on hover, a small category link in `{colors.link}`, an uppercase product name and a `{colors.ink}` price in dinars. No border, no card fill, no shadow. Cards sit in a generous grid with the front image doing all the visual work. Badges are absolutely positioned 20px from the top-left of the image.

### Product Detail

Eight-image thumbnail gallery at 200px, category breadcrumb, uppercase title, price followed by "(En stock)", colour swatches as 200px images, then size chips 39–44. The purchase block stacks a dark button, the bilingual "Livraison offerte dès 2 paires" notice and a coral "Ajouter au panier" button. Below it sit three inline assurances — cash on delivery, 58-wilaya shipping, exchanges — each French followed by Arabic. Specs and delivery tables come last in tabs.

### Buttons

Square corners, 54px height, 1px border, 14px/28px padding, 16px/500 type. Three fills matter: `{colors.brand}` for the primary add-to-cart, `{colors.ink}` for dark actions, and white with a `{colors.border}`-adjacent outline for secondary actions. Hover darkens text to `{colors.link-hover}`; there is no lift, scale or shadow on hover.

### Form Fields

Square inputs with a 1px `{colors.border}` border, 14px/24px padding and no focus glow beyond a border-color change. Search and filter drawers use the same fields. Checkboxes are square; radio dots are the only circular controls in the system.

### Footer

A full-width `{colors.ink}` band with the white logo, the same three social icons, a Support column (contact, tracking, delivery & returns) and a Compagnie column. Phone and email sit beneath, then a 2024 copyright line crediting the site's designer. The footer is the only large dark surface on the page.

## Motion & Interaction

Everything is quick. Links, buttons, form controls and carousel arrows transition colour and border over 0.1s ease-in-out. Drawers slide in over 0.3s ease-in-out and modals travel 50px up over 0.3s ease-out; their backdrops fade over the same span. The product image swap is an opacity crossfade, not a slide. There is no declared reduced-motion block in the shipped CSS — add one when implementing rather than copying the omission.

## Do's and Don'ts

- Do pair French copy with its Arabic line wherever the store does, especially in commerce actions and assurances.
- Do keep prices in `{colors.ink}` and in dinars with the `دج` suffix.
- Do use Jost at 400, 500 or 600 only. 500 is the bold.
- Do keep primary controls square and flat.
- Do reserve `{colors.brand}` for the add-to-cart fill and `{colors.link}` for links.
- Don't round buttons, cards or inputs; 4px is a utility, not a system.
- Don't add shadows to catalogue cards or buttons.
- Don't turn coral into a page background or a price colour.
- Don't use a 700 weight or synthesise one.
- Don't produce a French-only or Arabic-only interface.

## Known Gaps

- The site loads a Feather icon font alongside Jost; icon glyphs are not part of the design token set and are not reproduced here.
- Product titles are uppercased in the rendered HTML in some places and in CSS in others; the spec assumes uppercase display copy.
- Discount and sale presentation was not visible on the observed pages, so no sale badge token is declared.
- No `prefers-reduced-motion` rule ships today; the motion section above records what exists, not what should.
- Rail colours for stock, info and warning were read from theme variables rather than from a rendered status element on the observed pages.

## Agent Prompt Guide

Use this to build a faithful Radom Shoes screen: a centred 1140px white catalogue on Bootstrap-derived 16/32px gutters, a grey shipping strip above a white icon-only header, a photographic carousel with 44px/600 Jost headings, and a borderless product grid whose prices are plain `{colors.ink}` dinar figures. Jost ships at 400/500/600 — treat 500 as bold and 600 as the display weight. Keep every control square and shadowless; coral `{colors.brand}` fills only the add-to-cart button, while `{colors.link}` colours links and active navigation. Pair French copy with Arabic on commerce actions, assurances and delivery information. Reserve the dark `{colors.ink}` band for the footer, and give overlays the only shadow in the system. If you find yourself adding rounded cards, a red price or a 700 weight, stop — that is a different store.
