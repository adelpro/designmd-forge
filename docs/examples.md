# Worked examples

Every block below is a real run against the shipped data (v2.0.0, 2026-11-13), trimmed with `…`. Numbers are not edited. Each example says what it shows and what it does not.

---

## 1. Footers with social links

The query `designmd_search_designs` cannot answer — it searches titles and descriptions, not component prose.

```json
designmd_search_sections({ "group": "footer", "text": "social icons", "limit": 3 })
```

```
5 of 37 group records match; showing 3. Facets are derived from prose — an
unstated facet is absent, not false. 600 flavour files were not indexed.

- mastercard [footer] score=6
  facets.items: ["copyright","legal","locale","social"]
  facets.traits: ["pill","uppercase"]
  facets.divider: "hairline"  ·  facets.columns: 4
- airbnb [footer] score=6
  facets.items: ["copyright","legal","locale","social"]
- nvidia [footer] score=6
  facets.items: ["legal","locale","social"]  ·  facets.columns: 6
```

**Shows:** the facet extraction is doing the work — "social" is read out of the prose, and mastercard's hairline divider and four-column layout come from the same sentence you would have skimmed.
**Does not show:** a component you can paste. These are brand analyses; you read three footers, then write your own.

---

## 2. 3D or hover buttons

```json
designmd_search_sections({ "group": "buttons", "text": "3d hover", "limit": 3 })
```

```
2 of 289 group records match; showing 2.
- ios-duolingo   score=6   "The 3D Primary Button (The Green Slab) … a chunky button with a visible 'le…"
- ios-perplexity  score=6  "… #6E6E6E when disabled - Pressed: scale 0.94 … Haptic: .impactOccurred(.med"
```

**Shows:** multi-word text is AND. `"3d hover"` is two requirements, so 2 rows, not the 47 that mention either word.
**Does not show:** an OR search. "3D **or** hover" is two calls — the prompt says so.

---

## 3. Dark systems with a red accent

```json
designmd_search_designs({ "query": "", "mode": "dark", "hue": "red" })
```

```
note: Palette filters cover 69 of 290 designs; 221 are prose-only and cannot
      match a palette filter.

results: replicate (mode dark, accentHue red)
```

**Shows:** how narrow the honest answer is. One system in the corpus is dark _and_ red-accented, and the tool says why the rest could not be considered.
**Does not show:** a corpus-wide answer. 221 designs have no tokens to filter on.

---

## 4. What themes does Astryx ship?

```json
designmd_list_themes({ "brand": "astryx", "typeClass": "serif" })
```

```
themes: [ { id: "chocolate", mode: "light+dark", typeClass: "serif",
             type: { display: "Fraunces", body: "Albert Sans" } } ]

note: Only astryx ships official variants in this collection; the other 289
      designs are single-look systems, searched by palette with
      designmd_search_designs.
```

**Shows:** "theme" means an official variant with its own token set and type pairing — and `typeClass` describes the **display** face, which is why Y2K (Poppins display, Crimson Text body) is `mixed`, not `serif`.
**Does not show:** themes for the other 289 designs. They do not exist, and the note says so instead of inventing them.

---

## 5. Reading a theme as a delta

```json
designmd_get_design_md({ "slug": "astryx", "theme": "butter" })
```

```
# Butter theme — Astryx (Meta)

Pinned to Astryx 0.7.15 (MIT). Mode: light+dark. Type: Sarina for display,
Outfit for body (script).

| role    | light     | dark      |
| ------- | --------- | --------- |
| canvas  | `#fdfbe4` | `#261a13` |
| surface | `#ffffff` | `#2e2117` |
| accent  | `#225bff` | `#fdee8c` |
| ink     | `#1d1c11` | `#f3f2e2` |

This is a delta … components, elevation, motion and guardrails are the parent
entry's and are not repeated here.
```

**Shows:** every value is a real `light-dark()` pair read from the published package, and a delta stays small enough to paste into a theme file.
**Does not show:** the component library. `npx astryx` and its MCP endpoint are canonical for component APIs.

---

## 6. Guardrails without the whole file

`designmd_get_guardrails({ "slug": "stripe" })` is `designmd_get_design_md({ "slug": "stripe", "section": "dos_and_donts" })` with less surrounding payload — roughly a third of the tokens. Use it when you need the rules and already know the palette.

**Shows:** the shortcut exists because agents skip the Do's and Don'ts when the file is long.
**Does not show:** whether those rules fit your product. They are Stripe's rules.

---

## Reproducing these

```bash
npx -y designmd-forge        # stdio, the distributed path
```

or point a client at the hosted connector. The counts above come from the bundled snapshot; a `npm run refresh-data` can move them, which is exactly why every response prints its own coverage instead of trusting a number in a doc.
