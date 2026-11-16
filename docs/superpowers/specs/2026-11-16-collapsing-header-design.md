# Collapsing masthead for the docs landing page — design

2026-11-16 · small change · status: awaiting approval

## Intent

Give the docs site a real masthead on the landing page: the brand, one line of
what the project is, and the nav on a 152px tinted plate that collapses to 64px
as the reader scrolls. Every other page keeps the plain minima bar.

The point is not decoration. Today the landing page opens with a duplicated
heading (`DesignMD Forge docs` twice — once from minima's `home` layout
`.page-heading`, once from the content H1) and no statement of what the tool is.
The masthead replaces that opening with the one sentence a visitor needs and
reclaims the vertical space as soon as they start reading.

## Why the landing page only

The collapse spans 260px of scroll (`--range`). On a doc page the reader is
reading prose, so the masthead would be gone before they have oriented
themselves; on the landing page the first screen is a statement and the page
runs three screens after it, so the motion has room to mean something.

## Goals

- One masthead on `docs/index.md`: wordmark, eyebrow, tagline, nav.
- Collapses 152px → 64px over 260px of scroll, driven by a scroll timeline.
- Every other docs page keeps minima's existing header unchanged.
- Zero JavaScript. No dependencies. No change to the MCP server or its data.
- Degrades to a static 152px masthead where scroll timelines or the motion are
  not available.

## Non-goals

- Restyling the rest of the docs (body type, tables, code blocks stay minima).
- Touching the README, npm package, or the 11 MCP tools.
- Dark mode. minima has none; inventing one here would be a second project.
- A JS fallback. Without scroll-timeline support the plate simply stays tall.

## Constraints found in the repo

- GitHub Pages builds `docs/` with `actions/jekyll-build-pages@v1` →
  github-pages gem → **minima 2.5.1** (confirmed from the gem's theme table and
  from the deployed markup: `assets/main.css`, `.site-header`, `.freeze`).
- minima 2.5.1 overrides are `_includes/header.html` and `assets/main.scss`
  (the latter must keep front matter and `@import "minima";`).
- The docs pages carry **no front matter** today; GitHub Pages supplies
  `jekyll-optional-front-matter` + `jekyll-default-layout` + `_titles-from-headings`.
  index gets `layout: home` and a `.page-heading` that duplicates the content H1.
- Scroll-driven animation support: Chrome 115+, Safari 26+, Firefox 159 (MDN BCD).
  No support means no animation, not a broken header.

## Approaches considered

**A. Collapsing masthead on the landing page only. Chosen.**
Limited blast radius, the motion has somewhere to happen, and one front-matter
flag decides which pages get it.

**B. Collapsing masthead on every page.**
Uniform, but adds 260px of animation to `examples.md` and `mcp-tool-surface.md`
where nothing is gained, and makes every page's first screen a masthead.

**C. Masthead without motion.**
Cheapest, keeps the visual gain, loses the flourish. Rejected because the motion
is what was asked for and the landing page is the one place it pays.

## Decisions

1. **Animate the plate's `height`; everything else is compositor-only.**
   `height` is the single layout property in the animation. No transform
   shortens a box and leaves the content below flush against it, so this is the
   accordion-shaped exception, on one element, over 260px of scroll.
2. **The wordmark scales, it does not change `font-size`.** `scale(0.647)` takes
   34px to 22px with no text reflow. Text that changes size mid-scroll shimmers.
3. **The background is constant.** The plate is `#f5f7f9` at rest and at rest
   only. Animating a third property alongside height and scale reads busy.
4. **Staggered ranges, not one range for three properties.** Eyebrow 20→105px,
   tagline 60→190px, plate and wordmark 0→260px. Each hand-off sits where that
   element would otherwise be clipped by the shrinking plate, so nothing is cut
   mid-word.
5. **`overflow-anchor: none` on the plate.** Chrome's scroll anchoring treats a
   size-changing element above the scroll position as an anchor and nudges
   `scrollTop` to compensate, which reads as rubber-banding under the finger.
6. **Linear mapping.** A scroll timeline is already bound to the reader's input;
   easing it would decouple the motion from the scroll.
7. **Reduced motion drops the timeline entirely** and leaves the plate at 152px.
   Not a gentler collapse — no collapse.
8. **The masthead carries the only H1 on the landing page.** The content H1
   (`# DesignMD Forge docs`) is removed from `index.md`, `title:` moves to front
   matter so `jekyll-seo-tag` and `_titles-from-headings` stay correct, and
   minima's duplicated `.page-heading` is hidden on the home layout.
9. **Headings get `scroll-margin-top: 84px`** so anchor jumps from the nav do not
   land under the collapsed plate.

## Files

| File                                                            | Change                                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/_includes/header.html`                                    | New override: masthead when `page.hero`, minima 2.5.1's original markup verbatim otherwise.                                                             |
| `docs/assets/main.scss`                                         | New override: front matter, `@import "minima";`, then masthead CSS, `scroll-margin-top`, `.home .page-heading { display: none }`, reduced-motion block. |
| `docs/index.md`                                                 | Front matter `hero: true` and `title:`, drop the `# DesignMD Forge docs` H1.                                                                            |
| `docs/_config.yml`                                              | Add `superpowers/` to `exclude` so this design note is not published on the site.                                                                       |
| `docs/superpowers/specs/2026-11-16-collapsing-header-design.md` | This file.                                                                                                                                              |

## Verification

- Build `docs/` with the same image CI uses
  (`ghcr.io/actions/jekyll-build-pages`) and confirm the SCSS compiles and the
  masthead renders on `/` only.
- In the browser: scroll in one wheel notch at a time and confirm the collapse
  spans several notches; scroll back and confirm it expands without snapping.
- Check the three other pages are byte-for-byte the same header as before.
- Check `prefers-reduced-motion: reduce` leaves the plate at 152px.
- Check an in-page anchor (`/designmd-forge/index.html#tools`) does not land
  under the plate.

## Left to the builder

- The eyebrow copy and tagline wording (current: "MCP server · 304 design specs
  · 11 tools" and the one-line promise).
- Whether the nav shows four links or a subset on the masthead at narrow widths.
- Exact plate tint, if `#f5f7f9` fights minima's `#fdfdfd` in context.
