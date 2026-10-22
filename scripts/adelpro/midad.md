---
version: alpha
name: midad-design-system
description: "مِداد (midad) is an Arabic-first calligraphy editor whose interface behaves like a quiet desk: warm bone paper, iron-gall ink, and a single saffron accent that marks selection and state, never decoration. Every surface separates by tone and hairlines rather than stacked borders, type hierarchy is weight plus size plus leading as a set, and interactive elements settle by spring instead of duration because a tween cannot absorb an interruption mid-flight."

colors:
  primary: "#111111"
  primary-dark: "#F2EFE7"
  primary-foreground: "#FFFFFF"
  primary-foreground-dark: "#16150F"
  paper: "#F7F6F3"
  paper-dark: "#16150F"
  paper-bright: "#FBFBFA"
  paper-bright-dark: "#1D1B14"
  surface: "#FFFFFF"
  surface-dark: "#211F18"
  surface-alt: "#F9F9F8"
  surface-alt-dark: "#26241C"
  surface-pressed: "#EFEEE9"
  surface-pressed-dark: "#2E2B22"
  ink: "#111111"
  ink-dark: "#F2EFE7"
  ink-soft: "#2F3437"
  ink-soft-dark: "#D8D4C9"
  muted: "#787774"
  muted-dark: "#9A968C"
  faint: "#A9A69F"
  faint-dark: "#6B675F"
  on-ink: "#FFFFFF"
  on-ink-dark: "#16150F"
  border: "#EAEAEA"
  border-dark: "#33312A"
  border-strong: "#D8D5CE"
  border-strong-dark: "#45423A"
  accent: "#B0894F"
  accent-dark: "#C9A05C"
  accent-text: "#956400"
  accent-text-dark: "#E0B878"
  accent-soft: "#F5EEE2"
  accent-soft-dark: "#2E2920"
  danger: "#9F2F2D"
  danger-dark: "#E8A6A3"
  danger-bg: "#FDEBEC"
  danger-bg-dark: "#2E1F1E"
  success: "#346538"
  success-dark: "#9CC694"
  success-bg: "#EDF3EC"
  success-bg-dark: "#1C2A1B"

typography:
  display:
    fontFamily: "Amiri, Amiri-Bold, serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: 0
  title:
    fontFamily: "Amiri, Amiri-Bold, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: 0
  heading:
    fontFamily: "Cairo, Cairo-Bold, Geist, Geist-Bold, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  body:
    fontFamily: "Cairo, Geist, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  small:
    fontFamily: "Cairo, Geist, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  caption:
    fontFamily: "Cairo, Geist, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0

spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  xxxl: "48px"
  huge: "64px"

rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  pill: "9999px"
---

## Overview

Midad is an Arabic-first calligraphy editor: a canvas where the writer places glyphs, ornaments, icons and images, then exports the composition. The interface is the quiet room around the artwork.

The atmosphere is a calligrapher's desk at dawn. Warm bone paper, iron-gall ink, and a single saffron accent that marks selection, active tools, focus and undo links. Density is moderate and calm, variance is low by intent, and motion is fluid because every interactive element settles by spring rather than by timeline.

## Color System

Two palettes, one system. The light palette is warm paper; the dark palette inverts paper and ink into warm charcoal, never neutral grey. Both are defined in `src/theme/tokens.ts` as `palettes.light` and `palettes.dark`, and no screen or component may hardcode a hex outside the named content-palette constants.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| paper | #F7F6F3 | #16150F | App background |
| surface | #FFFFFF | #211F18 | Cards, sheets, docks |
| ink | #111111 | #F2EFE7 | Primary text, solid CTAs |
| muted | #787774 | #9A968C | Secondary text, AA on paper |
| border | #EAEAEA | #33312A | Structural hairlines only |
| accent | #B0894F | #C9A05C | Selection rings, active tools, focus |
| danger | #9F2F2D | #E8A6A3 | Destructive, on danger-bg |
| success | #346538 | #9CC694 | Confirmation, on success-bg |

Status pairs always ship as a tint plus a text ink that clears AA on it: `danger-bg` with `danger`, `success-bg` with `success`, and the pale red, blue, green and yellow pairs for tags. Translucent chrome is a token, produced by `withAlpha(hex, alpha)` rather than a hand-mixed colour, because a floating bar over the canvas is only legible as a frosted layer.

## Typography

Arabic-first, so fonts resolve through `fontRoles[language]` and never through a raw family or the system default. UI Arabic is Cairo (weights via Cairo-Bold), UI Latin is Geist (Geist-Bold), and display and brand text is Amiri in both languages.

- Core faces (Cairo, Geist, Amiri) load before the first pixel. The twenty-nine Arabic calligraphic faces and ten Latin faces load lazily behind the brand loader, so nothing on the first screen waits for a calligraphic face.
- The type scale runs display 40 to micro 11. Hierarchy is weight plus size plus leading as a set, never size alone.
- Letter-spacing is Latin-only. Negative or positive tracking, and `textTransform: uppercase`, break Arabic cursive joining, and `AppText` strips both for Arabic strings.
- Body leading is relaxed (1.5); headings tighten to about 1.1.

## Layout

Mobile-first, designed at roughly 390pt width. `breakpoint.wide` (600) switches to tablet and desktop, where the column keeps a phone-proportioned measure and centres rather than stretching: `layout.maxContent` 480, `layout.maxControl` 320, `layout.maxToolbar` 560.

- Spacing scale in dp: 2, 4, 8, 12, 16, 24, 32, 48, 64. Screen padding is 24, section gaps are 16 to 24, list gaps are 12.
- Radii: 4, 6, 8, 12, and a 9999 pill.
- Elevation is a four-step ramp in `shadows`: `card` and `panel` at offset 2 and blur 8, `float` and `sheet` at offset 4 and blur 16, with the sheet casting upward. Only those four surfaces lift off the page; everything else separates by tone and hairline.
- Floating docks and bars float over content and content scrolls beneath. The editor is the documented exception: its contextual action rail is a reserved fixed-height row in the column flow, because chrome floating over the canvas would sit between the finger and the selection handles, and a rail that mounted and unmounted would resize the canvas and re-run fit-to-view mid-edit.
- Touch targets are at least 44 by 44 everywhere. One primary action per screen: creation is a 56pt ink FAB, never a header button crowd. Safe areas are respected on all edges and lists pad beyond the tab bar.

## Components

All brand primitives live in `src/components/ui/`. The custom kit owns every brand surface, and `@expo/ui` is allowed only as a platform-behaviour engine.

### Buttons

Flat and tactile. Primary is an Iron Ink fill with an `on-ink` label, secondary is a `surface-alt` fill with a hairline border, and danger is the oxblood `danger` fill. Heights are 44 and 52 with radius 8. Press feedback is scale 0.97 starting on touch-down, settling back by spring. Labels always render in the language-correct bold UI font, and a loading state replaces the label with a spinner rather than widening the button.

### Header

Screens draw their own header, because the native one is disabled (`headerShown: false`): a screen header carries the title and a count, and creation is the 56pt ink FAB rather than a header action, which keeps one primary action per screen. A collapsible header is allowed where content is long: the gallery's `GalleryHeader` is driven by a scroll offset shared with the list, so the header shrinks as the canvas scrolls instead of pinning a second toolbar. The editor deliberately has no floating header at all; its contextual rail sits in the column flow (see Layout).

### Cards & Containers

The default card is `elevated`: no border, `surface` fill, and the tinted soft shadow at radius 10. An `outline` variant keeps the hairline for structural grouping only. Corner radius is 12. Never stack borders everywhere: tone separates surfaces, and a line is drawn only when structure demands it.

### Navigation & Menu

Navigation is shallow by design, which is why the rail carries actions rather than a navigator. The one menu in the app appears inside the editor: selection actions are ranked, only as many render as fit, and the remainder sit in a labelled `⋯` sheet, where each row also carries a pin that promotes it to the head of the row. `⋯` is the only control learn mode leaves live, because it reveals controls instead of acting on the design. Sheets themselves are platform-owned, so drag-to-dismiss, back-press, Escape, focus trapping and body-scroll lock come from the OS.

### Footer

There is no footer region. The bottom of the screen belongs to the tab bar and to sheets: a sheet anchors to the bottom edge and therefore casts upward, which is why `shadows.sheet` alone carries a negative `offsetY` of -4 while `card`, `panel` and `float` cast down. Lists pad beyond the tab bar so the last row is never trapped under it, and a snackbar floats above content rather than sitting in a footer slot.

### Input Fields

`surface-alt` fill, hairline border, radius 8, 44pt minimum height. Fields align right-to-left for Arabic and flip through the same font-role resolution as text. Placeholders use `faint`, which is the disabled and tertiary tone, so a placeholder can never be mistaken for a value.

### Distinctive Components

- **Canvas card.** The editor's canvas is a bordered box (`layout.canvasBorder` 1) that the app measures and draws into. On-canvas chrome positions against that drawing box, which is why the border width is a shared token rather than a per-file constant.
- **Segmented control.** Pill track in `surface-alt` with a spring-slid thumb, labels resolved through `AppText`.
- **Sheets.** A platform-owned sheet on every OS (SwiftUI sheet on iOS, Compose `ModalBottomSheet` on Android, a drawer on web) so the platform owns dismissal, focus trapping, body-scroll lock and reduced motion. The app owns the content: pill handle, title and close row, radius 12 top corners, dimmed scrim. The sheet caps at `min(720px, 92vw)` on web and at 82 percent of the window everywhere, so a long list scrolls inside instead of pushing the sheet off-screen.
- **Placed assets.** An image or imported icon is an object like a shape: it carries a transform, z-order, opacity and group membership, and renders through the same three-site contract as the canvas. An image keeps its own aspect rather than being letterboxed, and an icon draws from stored paths in the object's colour so it takes the ink and exports without blur.
- **Empty states.** A composed moment, never a bare no-data line: calligraphic glyph, title, guidance, one CTA.

## Motion & Interaction

Engine is reanimated springs only. Presets live in `springs` in `src/theme/tokens.ts`, expressed as a damping ratio converted to the coefficient `withSpring` expects, because handing Reanimated a ratio produces a spring roughly thirty times underdamped that rings for seconds.

### Durations & Easings

Durations exist for non-interactive reveals only: `fast` 150ms, `base` 250ms, `slow` 400ms, with `ease` as easeOutQuint (0.16, 1, 0.3, 1) and a stagger step of 80ms. Interactive elements never use these; they use springs.

### Motion Roles

- **Press and toggle:** the `ui` preset, critically damped (ratio 1.0), so there is no visible bounce.
- **Sheets and large surfaces:** `sheet` at ratio 0.85 on entry, paired with `exit` at ratio 1.0 and higher stiffness so a dismissal snaps out instead of settling.
- **Flicks and throws:** `momentum` at ratio 0.8, which keeps some momentum after release.
- **Latch:** `elastic` at ratio 0.6, for the one gesture that should visibly overshoot and settle back. Latch only: a return to rest must not overshoot past the origin.

### Reduced Motion

The platform owns reduced motion for sheets and drawers, so dismissal and presentation respect the OS setting without app code. For in-app motion, reduce to colour and opacity changes and drop transforms: no scale, no spring travel.

### Banned Motion

- Linear easing or duration-based tweens on interactive elements. Springs only.
- Input lockout during a transition; a control stays live while it animates.
- Overshoot on a return to rest, which would reveal the opposite action.
- Motion that hides state rather than showing it: no spinner in place of a determinate progress, no toast where an inline indicator belongs.

## Accessibility

Touch targets are at least 44 by 44 with auto hit-slop on icon buttons. Icon-only controls require a `label` prop, and the compiler-facing API refuses to render them without one. Secondary text tones are chosen to clear AA on their own background, and the pale status pairs carry a matching text ink. Arabic strings never receive letter-spacing or uppercase transforms, which is an accessibility requirement as much as a typographic one, since both destroy the joins that make the word readable. System font scaling is respected, and layout caps keep the column readable at large sizes instead of stretching.

## Do's & Don'ts

Do:

- Resolve every font through font roles, and render text only through `AppText`.
- Use the accent (`accent`) for selection and state only.
- Separate surfaces by tone and hairlines; lift only `card`, `panel`, `float` and `sheet`.
- Keep one primary action per screen and put creation in the FAB.
- Enforce 44pt minimum targets and label every icon-only control.
- Offer undo for destructive actions, and make the refusal explicit when something cannot be represented. Motion: springs only, no linear easing and no duration tween on interactive elements.

Don't:

- Do not hardcode a hex outside the documented content-palette constants.
- Do not put letter-spacing or uppercase on an Arabic string, in either direction.
- Do not use pure black, neutral-grey chrome, neon glows or gradient decoration.
- Do not add a border to everything, or a border without structural purpose.
- Do not confirm destructive actions with a dialog when an undo snackbar works.
- Do not lock input during a transition, leave a tool in a dead-end state, or approximate an input that cannot be stored honestly.

## Known Gaps

- Motion tokens are numbers in `tokens.ts`, not a documented ramp: any screen that needs a duration outside `fast`, `base` and `slow` currently hardcodes it.
- The gradient and ornament palettes in `content-palette.ts` are content colours written into project files, so they deliberately sit outside the UI palette.
- The web build adapts rather than leads. Layout behaviour above `breakpoint.wide` is derived from the caps, and a genuinely desktop-first composition has not been designed.
- The 29 calligraphic faces load lazily, so a first render into a not-yet-loaded face shows a fallback until the brand loader resolves.

## Agent Prompt Guide

Apply this file as the single source of truth for any screen or component you generate for midad. Start from the tokens, not from a screenshot: pick colours by role from the Color System, resolve type through the scale and font roles, and take spacing and radii from Layout. Compose brand surfaces only from the primitives in the Components section and never mix in a third-party component library for a brand surface. Movement comes from the Motion section's presets: springs for interaction, durations for reveals, and honour reduced motion. Before you finish, check the output against Do's & Don'ts, and if a rule cannot be satisfied with the given tokens, say so rather than inventing a value.
