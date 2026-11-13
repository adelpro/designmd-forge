---
version: alpha
name: tilawah-design-system
description: 'Tilawah (Open Tilawa) is a peer-to-peer Quran recitation player whose interface is one white page and seven values: ink, muted, line, invert, two blues for the spectrum and a danger tone, with no cards, shadows or gradients. Text is IBM Plex Sans Arabic, action is ink rather than an accent hue, and light and dark are the same palette inverted.'
colors:
  bg: '#ffffff'
  bg-dark: '#0b0b0c'
  ink: '#111111'
  ink-dark: '#f2f2f2'
  primary: '#111111'
  primary-dark: '#f2f2f2'
  muted: '#6b6b6b'
  muted-dark: '#9a9a9a'
  line: '#e8e8e8'
  line-dark: '#262626'
  invert: '#ffffff'
  invert-dark: '#0b0b0c'
  surface: '#ffffff'
  surface-dark: '#19191a'
  danger: '#b3261e'
  danger-dark: '#f87171'
  wave-front: '#1c4d78'
  wave-front-dark: '#a6c9ec'
  wave-back: '#5d97c9'
  wave-back-dark: '#3d6b96'
typography:
  title:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '2rem'
    fontWeight: 600
    lineHeight: 1.15
  page-title:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '2rem'
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: 1.4
  secondary:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.45
  meta:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.4
  micro:
    fontFamily: 'IBM Plex Sans Arabic'
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.3
spacing:
  space-1: '4px'
  space-2: '8px'
  space-3: '12px'
  space-4: '16px'
  space-5: '20px'
  space-6: '24px'
  space-8: '32px'
  space-10: '40px'
  space-12: '48px'
  space-16: '64px'
rounded:
  xs: '2px'
  sm: '6px'
  md: '8px'
  lg: '16px'
  pill: '999px'
---

## Overview

Tilawah, the app in the `open-tilawa` repository, is a peer-to-peer Quran recitation player. The browser streams audio from WebTorrent peers, falls back to the operator's HTTP web seed when no peer answers, and keeps playing from an audio element that outlives every route. It is Arabic first, with an English mode that flips the document to LTR; its public name is Tilawah and the repository is open-tilawa.

The interface is one screen. The surah being read is the title, the reciter is a line under it, the spectrum stands on the timeline, and one transport row is the instrument. There are no cards, page sections, shadows, gradients or accent hue: the action is ink, secondary text is muted, and the only colour in the product is the blue of the spectrum. Light and dark are the same values inverted by one attribute on `<html>`.

The atmosphere is a listening desk, not a media console. Blocks separate by space and a change of scale, hairlines appear only where structure needs them, and the play button is the one physical control: a flat ink circle that lifts 3% on hover and sinks to 96% on press. Everything else responds by tinting to the line colour.

## Color System

`apps/web/src/app/globals.css` declares the palette twice, under `:root` and `[data-theme='dark']`; `useTheme` writes `data-theme` on the document element. Components consume semantic variables and never branch on the theme.

| Token          | Light   | Dark    | Role                                                                       |
| -------------- | ------- | ------- | -------------------------------------------------------------------------- |
| `--bg`         | #ffffff | #0b0b0c | Page, top bar, mini-player footer                                          |
| `--ink`        | #111111 | #f2f2f2 | Primary text, every filled action, play button, selected chip, volume fill |
| `--muted`      | #6b6b6b | #9a9a9a | Secondary text, inactive icons, times, hints, placeholders                 |
| `--line`       | #e8e8e8 | #262626 | Hairlines, hover wash, scrubber track, chip borders                        |
| `--invert`     | #ffffff | #0b0b0c | Text and glyphs on an ink fill                                             |
| `--surface`    | #ffffff | #19191a | Phone sheet and docked desktop panel                                       |
| `--wave-front` | #1c4d78 | #a6c9ec | Nearest spectrum layer, scrubber fill                                      |
| `--wave-back`  | #5d97c9 | #3d6b96 | Furthest spectrum layer; the two between are mixed in code                 |
| `--danger`     | #b3261e | #f87171 | Refusals, destructive actions, errors                                      |

The palette is seven core values plus a derived surface and one danger tone. `--surface` equals `--bg` in light, because paper a step off white is still white; in dark it lifts to `#19191a`, because a sheet on a black page needs a visible layer. `--invert` is also the page colour by design: text on an ink fill is the paper showing through.

There is no accent colour. `primary` in the token frontmatter is an alias of `--ink`, not a second value: the primary action, selected chip and play button are all ink fills, and hover is the line colour. The only hue is the spectrum, which reads as ink that happens to be blue: `--wave-front` is a deep slate at 7.7:1 on the page, not a cyan. `--danger` is the one non-spectrum colour, at roughly 7:1, so a refusal is readable without becoming a background.

Rules:

- Take `--ink`, `--muted`, `--line`, `--surface`, `--invert`, `--danger` or a wave token. Never write a hex, a Tailwind palette colour or an opacity-mixed accent.
- No gradient, tinted panel, blurred chrome outside the sheet backdrop, or shadow except the dropdown menus' `shadow-lg`.
- Dark mode swaps values, not geometry. Nothing moves, resizes or changes radius with the theme.

## Typography

One family ships: IBM Plex Sans Arabic, self-hosted as woff2 in 400 and 600 with Arabic, Latin, Latin Extended and Cyrillic Extended subsets. The Arabic subsets are preloaded; `system-ui` is the fallback. There is no display face, monospace, italic or third weight.

| Role          | Size                            | Weight    | Use                                                  |
| ------------- | ------------------------------- | --------- | ---------------------------------------------------- |
| Now title     | `clamp(1.625rem, 2.6vw, 2rem)`  | 600       | The surah name, one per screen                       |
| Page title    | 1.625rem rising to 2rem at `lg` | 600       | Settings and static pages                            |
| Body / strong | 1rem                            | 400 / 600 | Footer names, sheet rows, fields, nav                |
| Secondary     | 0.875rem                        | 400       | Hints, group descriptions, back links, meta rows     |
| Meta          | 0.8125rem                       | 400       | Scrubber times, version, facts                       |
| Micro         | 0.75rem                         | 600       | Rate chip, field hints and errors, volume percentage |

- Numbers in a column or a clock are tabular (`font-variant-numeric: tabular-nums`, `.tnum`): scrubber times, version, byte counts, volume percentage.
- Times, versions, `−15`, `+15`, URLs and identifiers are isolated LTR (`dir="ltr"`, `bdi`), even in the Arabic page. A clock that flips with the paragraph is unreadable.
- No letter-spacing and no uppercase anywhere. Both break Arabic joining, and Latin benefits from the same restraint.
- Body leading is 1.5; the now title tightens to 1.15 and the page title to 1.2. Arabic never gets a tighter leading than that.
- `meta name="text-scale" content="scale"` plus rem sizes lets the OS text scale reach the page. Test the desk at 200%.

## Layout

The shell is a flex column, `min-h-dvh`: a sticky top bar, a routed screen, and the mini-player footer. The top bar is 56px plus `env(safe-area-inset-top)` and stays solid; it never uses glass. The page screen pads `8px 24px calc(48px + env(safe-area-inset-bottom))`, rising to `48px 40px 72px` above 1024px.

The player is a desk, not a card. `.desk` is capped at 1120px and centred, with 24px by 20px padding on a phone; `.desk-grid` is capped at 720px so the wave and scrubber do not stretch to a wide window. The gap is 40px. From 768px the desk centres its content vertically in the height the bar and footer leave; from 1024px the wave grows from 64px to 96px and the padding becomes 48px by 40px.

- **Caps:** desk 1120, reading column 720, mini-player 520, settings 520 (700 above 1024), phone sheet 520, docked panel 360.
- **Gutters:** 16px in the bar and footer, 20 to 24px in the desk, 32 to 40px on a desktop, 16px inside sheets and fields.
- **Radii:** 2px focus corners, 6px title and nav hover, 8px fields and popovers, 16px on the top corners of a phone sheet, full pill for every button, chip and avatar. Nothing else.
- **Elevation:** flat. The only shadows are `shadow-lg` on the two dropdown menus; the only blur is the 4px sheet backdrop. Depth comes from space, scale and a hairline.
- **Safe areas:** the bar grows by the top inset, the footer by the bottom inset, and the fullscreen exit clears a notch on either side with `max(1rem, env(safe-area-inset-left), env(safe-area-inset-right))`.
- **Docked panel:** above 1024px an open sheet is a 360px aside from `top-14` down, and the desk shifts its inline start by 384px.
- **Theatre:** fullscreen removes the bar and footer, keeps the desk, and centres with `justify-content: safe center` so a short landscape screen can scroll to the title. The exit button floats at the viewport's inline end.

## Components

### Top bar

56px, sticky at `z-20`, bottom hairline, 16px gutter. The 24px mark is drained to grey; the version sits outside the link's accessible name at 13px muted tabular, because an `aria-label` that omits visible text fails WCAG 2.5.3. Desktop navigation is 14px muted icon-plus-word links that turn ink on hover over a line wash. `More` opens a 160px `role="menu"` with 14px rows and the one `shadow-lg`. On a phone the sandwich becomes an X in place and opens the nav sheet; the version is decoration.

### Listening desk

Head: the surah title (26 to 32px, 600, 1.15) is a button with a 14px caret that rotates when open; the reciter is 16px muted with its own caret and a 36px minimum height; facts (juz, riwaya, duration) are 13px muted. Note and hint: centred 13px muted with an underlined 36px action, on the instrument's axis. Nothing else: no hero, artwork, card or badge. If a fact does not help choose, play or locate the recitation, it is not on this screen.

### Transport

Five controls 8px apart: previous, −15, play/pause, +15, next. Ghosts are 44 by 44 muted pills, hover line plus ink, `disabled:opacity-40` with the wash removed. Play is 72 by 72, ink fill, invert 24px filled glyph, 1.03 on hover and 0.96 on press over 150ms; it never changes colour. Skip glyphs are directions and flip with the document through `.icon-dir`. `−15` and `+15` are 14px semibold tabular numerals isolated LTR, not icons. Every control has an `aria-label` in the active language.

### Scrubber

Two 13px tabular muted clocks around a 3px rail; fill and thumb use `--wave-front`. The visible thumb is 10px and appears on hover, focus-within and active; the transparent input is 44px tall, so a thumb never hits a hairline. No buffered layer, because a torrent's buffered number moves for reasons the listener cannot act on. The value text reads `position of duration`.

### Spectrum

64px tall on a phone, 96px on a desktop, 20 to 24px above the scrubber. Three models: bars (28 hairlines, 3px gaps), peaks (a held cap), waves (four filled silhouettes, each held at its own attack and release, tinted from `--wave-front` to `--wave-back` with alpha 0.72 to 0.30). The ribbon is sampled at 56 points and fills 72% of the block. Frequency is x, with index zero at the right edge. The analyser is read at 30Hz, the device pixel ratio is capped at 2, and gamma 0.65 lifts quiet passages; silence is zero height, never a stub. Paused, the canvas is empty but keeps its height. Theme tokens are read once per theme through a `MutationObserver`, not twice per frame.

### Mini-player footer

56px plus the bottom inset, capped at 520px, top hairline, 16px gutter. On a phone it keeps two rows: the surah (16px semibold, book glyph, 36px) and the reciter (14px muted, mic glyph, 36px), both truncated and both named by their visible label with the action as a visually hidden suffix. On a desktop the names disappear and the utilities centre at 560px. At the end: volume 44 by 44 (tap opens the gauge, a 500ms hold mutes with a 10ms vibration), fullscreen 44 by 44, a 12px semibold rate pill only off 1x, and a 44 by 44 stream glyph inside a 2px progress ring (ink at 22% for the track, torrent progress for the arc, state and percentage in the name). It is a glyph, never a caption.

### Volume gauge

A popover 8px above the button: 12px by 8px padding, 1px line border, 8px radius, a 12px muted percentage and a 24 by 96px rail with a 4px track, bottom-anchored ink fill and 12px ink thumb on a transparent vertical range. The range is `direction: ltr` before it is rotated; an inherited RTL range would put 100 at the bottom and read upside down. Zero is mute everywhere, so the icon switches and the accessible value says "muted", not "0%".

### Sheets

One component, two presentations. On a phone it is a native `<dialog>` in the top layer: full width up to 520px, bottom-anchored, 16px top corners, a 4px handle at 20% ink, 90dvh when full and row-hugging when auto. The panel is moved by a spring, never a keyframe, because an animation the finger cannot grab is the thing being replaced: drag is 1:1 down and rubber-banded up, dismissal is above 800px/s or past 40% of the height plus projected travel, and an upward flick never dismisses. On a desktop it is a non-modal 360px aside under the bar with its own pin and close, because a sheet on a 1440px screen does not need a phone gesture and docking keeps the stage visible.

Backdrop: 32% black with `blur(4px) saturate(1.05)`, 50% in dark, 60% with no blur under `prefers-reduced-transparency: reduce`; opacity over 160ms. Anatomy: 52px header with a 16px semibold title and 44px icon controls, an optional 44px search toolbar pinned outside the scroll, then rows of at least 64px with 16px padding, 12px gap, 16px text and a 12px muted meta line. Filter chips are 44px pills; the active one is an ink fill with invert text. Escape and a backdrop click close; the phone gets the platform focus trap and body-scroll lock, the desktop adds a window Escape listener. A pinned panel stays open while rows are picked; an unpinned one closes.

### Inputs and chips

Fields are 44px minimum, 8px radius, a line border on transparent ground, 16px text (so iOS does not zoom) and a 14px semibold label. Hints and errors are 12px; an error is `--danger` with `role="alert"`, and `aria-describedby` / `aria-invalid` are wired by the field wrapper. Placeholders are muted and never mistaken for a value. Focus is a 2px ink outline at 2px offset, globally. Settings chips are 32px pills, a deliberate density choice that conflicts with the 44px rule; see Known Gaps.

### Buttons and links

Primary is an ink fill with invert text, one per region; secondary is transparent with a line border; quiet is muted turning ink on hover, with inline verbs underlined at 4px. Settings is its own route: a 520px column (700 above 1024) of hairline-separated groups with a 20px muted icon, a 16px semibold title, a 14px muted hint and 32px chips. Static pages reuse the page screen and a 14px muted back link with a 44px hit area. `.press` shrinks to 0.96 over 100ms and tints over 120ms, opt-in so a selected ink chip never flashes to the line colour. Icons come from `components/icons.tsx` (Phosphor, 16/20/24, `regular` and `fill`), are `aria-hidden` and out of the pointer path, and directional icons flip through one class; the owning control carries the label.

## Motion & Interaction

### Durations & Easings

- **Press:** transform 100ms ease-out; background and colour 120ms ease-out.
- **Play button:** transform 150ms `cubic-bezier(0.2, 0, 0.2, 1)`; background 120ms ease.
- **Hover and caret:** 120ms for colour, opacity and the 180-degree caret rotation.
- **Sheet backdrop:** opacity 160ms ease.
- **Theme:** a 180ms root cross-fade through the View Transitions API. One attribute changes and the page changes clothes instead of flashing.
- **Spinner:** 900ms linear, one turn. **Waiting glyph:** three wifi arcs at 1.5s ease-in-out, the second delayed 0.5s.

Nothing else has a duration token. The system has two curves, ease-out for interaction and the play button's gentler cubic-bezier, and one spring.

### Motion Roles

- **Did the press land?** Every tappable surface shrinks to 0.96; the play button lifts to 1.03 on hover first. That is the entire feedback vocabulary.
- **Did a layer arrive or leave?** Phone sheets rise from 15% of their height (capped at 72px) and leave by spring, carrying the release velocity. The backdrop fades in step with the panel so the scrim never detaches.
- **Is the recitation alive?** The spectrum moves with the audio, the waiting glyph answers in turn while no peer is found, and the theme cross-fades when the listener asks. Nothing loops otherwise.

The sheet spring is critically damped (`damping: 1`, `response: 0.3s`, dt clamped to 1/30) so it settles without bounce; a drag past the top is rubber-banded with a 0.55 constant. A hard stop reads as frozen, and a springy overshoot reads as playful, which this product is not.

### Reduced Motion

`prefers-reduced-motion: reduce` is handled globally in `globals.css`: every animation and transition is cut to 0.001ms and iteration count to 1, and the play and press transforms are removed. The wifi arcs freeze on their visible frame, so the icon still reports the state; the spinner becomes still and the button says it is busy in words. The sheet jumps to its target, and the theme hook skips view transitions with the CSS duration as a second belt. Reduced motion never removes information, only movement.

### Banned Motion

- No scroll-triggered reveals, parallax, sticky scroll effects or page entrances.
- No bounce, elastic or underdamped spring anywhere. The sheet is the only spring and it is critically damped.
- No animated width or height. The spectrum changes pixels, not layout; the sheet moves by transform.
- No looping decoration beyond the waiting glyph and the spinner, no motion on the scrubber beyond the thumb, no animated clock.
- No cross-fade for a theme that arrives from the account or network at load; that would be a flash with extra steps.

## Responsive

Mobile first, with three meaningful widths.

- **Phone (default):** one column, 16px gutters, 20px desk, sandwich in the bar, two names in the footer, native dialog sheets. The volume gauge is the only footer popover.
- **Desktop (1024px):** desktop nav replaces the sandwich, sheets dock at 360px and push the desk by 384px, the footer drops its names and centres utilities at 560px, static pages widen to 700px, and the wave grows to 96px. Hover states exist only here, gated behind a fine pointer for keyboard hints.

The player is the only screen with theatre mode: it removes the bar and footer, centres with `safe center`, and floats the exit control. A short landscape screen scrolls rather than clipping the title.

## Accessibility

- Every target a thumb hits is at least 44 by 44: transport ghosts, footer utilities, sheet rows, menu rows, fields and player chips. The exceptions are the 28px desktop `More` trigger and the 32px settings chips.
- Visible text is in the accessible name (WCAG 2.5.3). A row that reads "الفاتحة" is named "الفاتحة — قائمة السور", never "قائمة السور"; the action is a visually hidden suffix, not a replacement label. The version sits outside the wordmark's name for the same reason.
- Icon-only controls carry an `aria-label` in the active language; decorative glyphs are `aria-hidden` and out of the pointer path.
- Focus is a 2px ink outline at 2px offset globally, with a 2px radius; the volume range keeps a pill-shaped ring.
- Contrast: ink on bg is 18.9:1, muted on bg is 5.3:1 and clears AA for body text, `--wave-front` is 7.7:1 and safe for the scrubber and spectrum, and `--danger` is about 7:1.
- `lang` and `dir` follow the locale hook; Arabic is RTL and English LTR. Layout uses logical properties (`ms`, `me`, `start`, `end`, `padding-inline`) so one CSS mirrors, with two documented physical exceptions: the scrubber fill anchors to `right`, and the volume range is forced LTR before rotation.
- Reduced motion is global; reduced transparency turns the sheet backdrop into a solid 60% scrim.
- The phone sheet is a native dialog, so focus trapping, Escape and the top layer are the platform's; the desktop panel restores focus and closes on Escape itself.

## Do's & Don'ts

Do:

- Build every surface from the nine semantic tokens; take the theme from `data-theme` and let the palette recompose.
- Let ink be the action. Fill the primary control with `--ink` and set its label in `--invert`; use `--line` for hover.
- Keep one screen for the player: title, reciter, facts, spectrum, scrubber, transport, note. If a block does not help choose, play or locate the recitation, leave it out.
- Hold 44px targets, 2px focus at 2px offset, logical inline properties, and test at 200% text scale.
- Let the phone sheet follow the finger and dismiss by velocity or distance; let reduced motion skip the spring.

Don't:

- Don't introduce an accent hue. There is no brand blue beyond the spectrum, and no colour on a button.
- Don't add cards, gradients, glass, coloured washes or drop shadows. The only shadows are the two dropdown menus; the only blur is the sheet backdrop.
- Don't put wave tokens on text or chrome; they belong to the spectrum and the scrubber fill.
- Don't use `--danger` as a background or for anything reversible.
- Don't use a Tailwind palette colour (`blue-600`, `gray-200`) or a raw hex in a component. The token layer is the palette.
- Don't animate width, height, top or left, and don't add a keyframe where a press or a spring is the honest answer.
- Don't loop decoration, animate a page entrance, or cross-fade a theme the network applied.
- Don't hardcode an arrow (`←`, `→`) or a glyph (`✓`, `▾`) as an icon; direction is a named icon that flips.
- Don't tighten Arabic leading below 1.4, add letter-spacing, or uppercase Arabic or Latin.
- Don't replace a visible label with an `aria-label`; the action rides along as a suffix.
- Don't disable a submit button to block validation, and don't use a toast where an inline line can say what happened.

## Known Gaps

- Spacing, radii and typography are not tokenised in code; the Tailwind config maps colours and the sans family only, so this file is the only written scale.
- Shadows are not tokens. The menus and telemetry prompt use `shadow-lg` even though the brief rules shadows out.
- The settings chips are 32px and the desktop `More` trigger is 28px, below the 44px rule. Settings is the weaker surface for thumbs.
- The scrubber fill and thumb anchor to physical `right`: correct in Arabic, backwards in English LTR. They should become a logical inset.
- The in-repo `DESIGN.md` predates the one-screen rewrite and describes a parchment palette the shipped CSS does not use. `globals.css` is the source of truth.

## Agent Prompt Guide

Treat this file as the source of truth for anything you generate for Tilawah. Start from `globals.css`, not a screenshot: pick `--bg`, `--ink`, `--muted`, `--line`, `--surface` and the wave tokens by role, write the light and dark values as one pair, and let `data-theme` swap them. There is no accent colour: the primary action is an ink fill with `--invert` text, hover is `--line`, and colour appears only in the spectrum and a refusal.

Compose the player as one desk: the surah as a 26 to 32px semibold title, the reciter under it, facts at 13px, a 64 or 96px spectrum, a 3px scrubber, a five-control transport with a 72px ink play button, then one centred note. No cards, no shadows, no second column. Use IBM Plex Sans Arabic at 400 and 600, tabular numerals for time, and `dir="ltr"` for clocks and skip amounts. Icons come from the existing module at 16, 20 or 24; nothing is drawn ad hoc.

Movement is a press (0.96 over 100ms, 1.03 on the play button's hover), a critically damped spring for phone sheets, and a 180ms theme cross-fade only when the listener asks. Honour reduced motion by removing transforms and skipping the spring, never by hiding the state. Hold 44px targets, 2px focus at 2px offset, logical inline properties, and visible labels that name their control.
