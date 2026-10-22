---
version: alpha
name: mushaf-native-design-system
description: A reference to open-mushaf-native, an offline Quran mushaf reader for mobile and web. It reads as paper, with warm ivory page tints, one deep green primary, a muted brass secondary, and Amiri scripture headings against Tajawal interface text. Layout is RTL-first and capped at a 640 pixel column, and every page is an image canvas that a reading theme tints rather than redraws.

colors:
  background: "#FAF8F6"
  background-dark: "#121212"
  text: "#1B1B1B"
  text-dark: "#EDEDED"
  tint: "#1E5243"
  tint-dark: "#F1F3F4"
  icon: "#6D6D6D"
  icon-dark: "#A0A0A0"
  ivory: "#F9F6EF"
  ivory-dark: "#2E2E2E"
  card: "#FFFFFF"
  card-dark: "#1E1E1E"
  primary: "#1E5243"
  primaryLight: "#62A49B"
  secondary: "#C2B280"
  secondary-dark: "#A0A07E"
  danger: "#C62828"
  danger-dark: "#EF5350"
  dangerLight: "#FFCDD2"
  dangerLight-dark: "#E57373"
  sepia: "#F4E8D1"
  directColor: "#FFD700"
  directColor-dark: "#FFA000"
  relatedColor: "#4FC3F7"
  relatedColor-dark: "#03A9F4"
  fuzzyColor: "#FF8A65"
  fuzzyColor-dark: "#FF5722"

typography:
  display:
    fontFamily: "Tajawal_700Bold"
    fontSize: "42px"
    fontWeight: 700
    lineHeight: "48px"
  title:
    fontFamily: "Tajawal_700Bold"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "32px"
  scripture:
    fontFamily: "Amiri_400Regular"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: "24px"
  body:
    fontFamily: "Tajawal_400Regular"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Tajawal_500Medium"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "25px"
  caption:
    fontFamily: "Tajawal_500Medium"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
---

## Overview

Open-Mushaf Native is an MIT-licensed Quran mushaf reader built with React Native and Expo for Android, iOS, web and macOS. It reads offline from cached page images in the Hafs and Warsh riwayas, and adds verse search, tafsir popups, page navigation, a daily wird tracker and a reading-position banner on top of that canvas. The interface is Arabic and RTL throughout; there is no second language mode.

The visual atmosphere is a paper page on a warm desk. Surfaces are off-white or ivory, the only saturated colour in chrome is a deep green, and brass appears as a quiet secondary. Screen furniture is deliberately thin: a translucent top menu that can be hidden entirely, a bottom control strip, and a single collapsible banner. Everything that is not the page steps back so the page image can hold the eye.

## Color System

Neutrals carry the reading surface. `background` is a warm off-white, `ivory` a slightly deeper paper tone used behind the page image and in empty states, `card` pure white for panels that must lift off the page, and `text` near-black. The dark theme swaps these for `background-dark` near-black, `ivory-dark`, `card-dark` and `text-dark` off-white, and the page image is dimmed by an adjustable overlay rather than recoloured. Green is the decision colour: `primary` (deep green) marks selected tabs, filled buttons, focused input borders and active icons, while `primaryLight` is the same hue lifted for progress arcs and secondary marks. Brass `secondary` is used sparingly for surah numbers on the ornamental badge, empty-state copy and outlined accents, and the `danger` plus `dangerLight` red pair is reserved for destructive actions.

Two other groups are functional rather than decorative. The three search highlight tokens (`directColor`, `relatedColor`, `fuzzyColor`) are categorical: gold for exact matches, blue for related, orange for fuzzy, each with a darker dark-theme variant that holds up on near-black. The reading themes are page tints applied behind the image, not interface palettes: `sepia` warms the surround and drops image opacity to 0.92, while the high-contrast theme is plain white behind a fully opaque image.

| Token | Light | Role |
| --- | --- | --- |
| `background` | `#FAF8F6` | App surface and card interior |
| `ivory` | `#F9F6EF` | Page surround, loading and error backdrops |
| `card` | `#FFFFFF` | Top menu, banner, floating panels |
| `text` | `#1B1B1B` | Primary copy |
| `primary` | `#1E5243` | Selection, filled actions, focus |
| `secondary` | `#C2B280` | Ornamental badge digits, outlined accents |
| `danger` | `#C62828` | Destructive actions |
| `sepia` | `#F4E8D1` | Paper reading theme backdrop |

## Typography

Arabic first, and only Arabic. Tajawal covers all interface text: `Tajawal_400Regular` for body, `Tajawal_500Medium` for labels, buttons, captions and tab names, `Tajawal_700Bold` for titles, page numbers and large metrics. Amiri is reserved for text that should read as scripture or as a book heading: surah names on cards, the tafsir panel title, and surah and ayah selector labels. Amiri is never used for controls or for body copy.

Sizes step 10, 12, 14, 16, 18, 20, 22, 32 and 42, with 16 as the workhorse. Line heights are tight in Arabic terms: body is 16 over 24, the 32 pixel title sits on a 32 pixel line, and the 22 pixel Amiri surah name on 24 or 26 depending on the card. Small chrome text drops to 10 and 8 pixels and is read at a glance, not parsed. Numerals are Western digits throughout, interpolated directly into Arabic sentences (`آياتها: 7`), as page numbers, and in the chart axis; there is no Arabic-Indic formatting and no tabular figure setting, so column alignment in the chart is done with fixed bar widths instead.

## Layout

The layout is a single centred column with a hard `maxWidth: 640` on the page canvas, the reading banner, buttons, surah cards and the chart container. Breakpoints are 370 (compact), 640 (mobile) and 1024 (tablet); page-number pagination shows 1, 3 or 5 neighbours depending on which side of 640 and 1024 the window falls, and the top menu swaps to a compact type scale below 370.

Spacing is a de facto scale of 2, 4, 6, 8, 10, 12, 15, 16 and 20. The top menu uses 6 pixel gaps and 8 pixel bottom padding, cards and chart panels use 16 pixel padding with 12 to 16 pixel margins, list rows carry `LIST_HORIZONTAL_SPACE` of 10, and the banner stacks its two rows with a 15 pixel gap.

The page geometry is the image ratio: `aspectRatio: 0.7` in landscape and a full-width image in portrait, both inside the 640 column and clipped by `overflow: hidden` so a swipe cannot spill. Safe area insets are read from `react-native-safe-area-context`; the top inset is dropped when the screen was reached by temporary navigation, and the banner adds `insets.top` to its own height. The banner is 50 pixels collapsed and 130 expanded; the chart reserves 36 pixels of left padding for the y axis and 42 at the top for its tooltip.

## Components

### Buttons

`ThemedButton` is the only button primitive. It renders a 50 pixel tall, 8 pixel radius block at 90 percent width capped at 640, with 12 by 20 padding, a 1 pixel border, elevation 5 and a soft 0 5 5 shadow. Nine variants exist: `primary`, `secondary`, `outlined-primary`, `outlined-secondary`, `danger`, `danger-secondary`, `outlined-danger`, `outlined-danger-secondary` and `default`. Filled variants paint both fill and border with the same token and set the label to white; outlined variants keep a transparent fill and colour the border and label with the token. Press feedback is opacity 0.8 through `activeOpacity` plus a redundant pressed-state opacity, with no scale and no colour shift. Labels are `Tajawal_500Medium` at 18.

### Header

The top bar is `SurahAyaNavigator`, which shows the current surah name at the reading position and opens the surah and ayah pickers as modals, each with its own `modalHeader`, so there is no system header's title to duplicate (`headerShown: false` is set in the tab layout). The surah name is drawn in the Amiri display face at 22/24, which is the clearest signal in the app that the reader is inside a surah rather than a list. Do not stack a second bar under it: reading tools live in `components/TopMenu/`, which takes the reading context rather than the route.

### Cards & Containers

Surah and chapter cards are full-width rows, 80 pixels tall, with a 5 pixel radius, a 1 pixel hairline border, a 1 pixel outer padding and elevation 3. Inside, a 50 pixel ornamental badge holds the surah number and the name sits in Amiri at 22. Reading-chart panels are 90 percent width with a 12 pixel radius and 16 pixel padding. The top menu is a bottom-only rounded bar: square top corners, 16 pixel bottom radius, a hairline border on three sides and a soft 0 3 5 shadow at 10 percent. Elevation is shallow everywhere; nothing floats more than a few pixels off the page.

### Navigation & Menu

`components/TopMenu/` holds the reading-context controls (theme, riwaya, font size and the rest of the reading preferences), so the bar and the menu never show the same control twice. Page movement is `PageNavigator`, a dedicated control rather than a menu entry, and `ReadingPositionBanner` anchors the current position whenever it is not obvious from the page itself. The tabs own the primary destinations, so the menu is scoped to the reader's current context and never becomes a second navigation tree.

There is no footer region: the tab bar owns the bottom edge, and the reading surfaces (mushaf page, juz view, search results) each decide their own bottom padding so the last line of a page is never covered. Anything that would otherwise be a footer action is either a banner above the page or a control in the top menu, because a reader holding a page wants nothing between the page and the bottom edge.

### Input Fields

`ThemedTextInput` has three shapes: `default` as an underline field, `outlined` at 4 pixel radius, and `rounded` as a 50 pixel pill, all with 10 pixel padding and 16 pixel Tajawal body text. Border colour rests at `secondary` and switches to `primary` on focus, and the border width grows from 1 to 2 pixels, which is the only focus affordance; there is no glow and no background change. The search bar wraps one of these in an 8 pixel radius container with 8 pixel horizontal padding, a search icon or spinner on the leading side, and an options toggle that colours itself green while open. Web inputs suppress the browser outline.

### Distinctive Components

The mushaf page canvas is the product. A single page image fills the 640 column at ratio 0.7, sits inside a `SafeAreaView`, and takes its backdrop from the active reading theme: `sepia` tints the surround and drops image opacity to 0.92, high contrast keeps pure white, and dark mode lays an adjustable dark overlay behind the image with opacity driven by the contrast slider. The pager is the only navigation chrome on that canvas, and the reading-position banner appears only when the reader has navigated away from their saved page: a 50 pixel collapsed row that expands to 130 with a filled save button and an outlined return button. The wird tracker adds a bar chart with 28 pixel bars, 20 pixel gaps, 6 pixel bar radius and a tooltip that flips above or below the bar. As an outdoor reading aid, the passenger motion overlay draws 6 pixel dots along both screen edges and shifts them up to 24 pixels with device motion.

## Motion & Interaction

### Durations & Easings

Durations are mostly not tokenised; the values that exist are local. Page swipes settle with a spring of damping 20 and stiffness 90, and the motion-cue overlay uses damping 18, stiffness 120 and mass 0.8. Skeleton loaders pulse opacity between 0.4 and 0.8 over 800 milliseconds each way and repeat indefinitely. The splash screen fades out over 1000 milliseconds. Notification and hizb banners auto-dismiss after 3000 milliseconds. There is no duration scale, no easing token set and no shared timing hook.

### Motion Roles

Three roles only. Page turning is a horizontal translate clamped to 20 pixels, with opacity easing from 1 to a floor of 0.85 and shadow opacity rising to 0.5 as the page is dragged, so the page reads as a sheet being lifted rather than swiped away. Feedback is instant and non-spatial: opacity 0.8 on press, a selection haptic when a new surah begins, and an optional page-flip sound. Ambient motion is confined to the passenger cue overlay and the skeleton pulse, both decorative and both removable.

### Reduced Motion

There is no reduced-motion branch in the code: nothing reads `AccessibilityInfo.isReduceMotionEnabled` or a reduced-motion hook. Any implementation must therefore add its own check and, when motion is reduced, keep page changes as instant re-renders, disable the passenger dot overlay, and hold skeletons at a static opacity. The one existing behavioural guard is that the motion overlay is `pointerEvents="none"`, so it never intercepts a tap.

### Banned Motion

No page curl, fold or 3D flip. No scale or rotation of the mushaf page image, ever, because it degrades the legibility of the scripture. No automatic page advance, carousel or timed transition. No parallax or scroll-linked transform on the page, the verse text or the highlight rectangles. No spring on text colour or opacity. No entrance animation on the top menu beyond an opacity change.

## Accessibility

Font scaling is not blocked: no `allowFontScaling={false}` and no `maxFontSizeMultiplier` appears anywhere, so the system multiplier passes through to every `Text`. That is the right default, but it means fixed heights (the 50 pixel button, the 80 pixel card, the 50 and 130 pixel banner) will clip at large settings and must be treated as minimums rather than fixed boxes when touched.

Contrast is strongest in the high-contrast reading theme and weakest under `sepia`, where near-black `text` sits on a warm `#F4E8D1` tint; `icon` at `#6D6D6D` is the weakest chrome token and should not carry essential labels. RTL is enforced rather than detected: `I18nManager.forceRTL(true)` on native with an app reload, and `dir="rtl"` plus `lang="ar"` on the document for web, so layout must be written with logical start and end, not left and right. Interactive elements carry `accessibilityRole`, and the banner and search options expose Arabic `accessibilityLabel`, `accessibilityHint` and `accessibilityState`; the passenger overlay opts out with `importantForAccessibility="no-hide-descendants"`.

## Do's & Don'ts

**Do:**

- Read every colour from `Colors` through `useColors`; never type a hex into a component.
- Keep the 640 pixel column: page, banner, buttons, cards and chart all share it.
- Use Tajawal for interface text and Amiri only for surah names, tafsir titles and scripture-shaped headings.
- Keep page changes as a clamped horizontal translate with the 0.85 opacity floor.
- Write layout with `row-reverse`, `textAlign: 'right'` and logical start and end, since RTL is forced.
- Reach for a `ThemedButton` variant instead of styling a `TouchableOpacity` by hand.

**Don't:**

- Don't add a page curl, fold, 3D flip, scale or rotation to the mushaf page; that motion is banned.
- Don't add parallax, auto-advance or scroll-linked transforms on the page or the verse text.
- Don't spring text colour or opacity, and don't invent a duration token the code does not use.
- Don't hard-code the ad hoc grey borders on cards, the search bar and the options icon; they sit outside the token set.
- Don't put Amiri on buttons, captions or any control label.
- Don't set `allowFontScaling={false}` to protect a fixed height; let the text grow.

## Known Gaps

Several things an implementer will look for are simply not in the code. There is no motion token set: durations, springs and skeleton timings are literals in the components that use them, and the splash fade is the only named duration. There is no spacing scale constant either; the 2 to 20 values are repeated per component, and only `LIST_HORIZONTAL_SPACE` is exported. Border colours for cards, the search bar and the options icon are literal greys in component styles, outside `Colors.ts` and untokenised. The link colour in `ThemedText` is a leftover from the Expo template and belongs to no role.

`Amiri_700Bold` is loaded at startup but no style uses it, so bold Amiri is available yet unused. The `default` button variant resolves to raw `blue`, which no token covers. There is no `border`, `disabled` or `tabIconDefault` entry in the palette above; those are read from `Colors` but were left out of the token map, and `tabIconDefault` is the only tab-inactive colour. Dark-mode contrast is a runtime overlay strength (an adjustable opacity plus an `rgba(26, 26, 26, ...)` backdrop) rather than a token, so effective reading contrast cannot be read from the palette. Reduced motion is unimplemented. Font metrics differ per platform (Android font padding, iOS line-height rounding), and the landscape page relies on `ScrollView` because the image is taller than the viewport, which no token describes.

## Agent Prompt Guide

When generating UI in this system, start from `useColors` and pick the semantic token that matches the role, then wrap the screen in the 640 pixel column and lay it out right to left. Use Tajawal for every control and Amiri only for surah names and scripture headings. Compose with `ThemedButton` variants, the 5 pixel radius cards and the 8 to 12 pixel panel radii, keep elevation shallow, and treat the mushaf page as an image that themes tint but never transform. If a value is not in this file, copy the nearest existing component rather than inventing a scale, and add motion only as the clamped horizontal page translate with the 0.85 opacity floor.
