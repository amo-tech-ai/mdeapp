---
title: "MDE Image Strategy — photography, placeholders, proxy (D-03)"
updated: 2026-06-05
author: design synthesis (design-process.md §5 + Places-proxy reality + CLAUDE.md hard rules)
status: SOURCE OF TRUTH for imagery — photography is the #1 premium lever, gated on the Places proxy
linear: SAN-569 (epic SAN-566 · project UX · labels track:ux + scr)
related:
  - ./design-system.md                  # tokens — the placeholder gradient is derived from these (D-02)
  - ./ia-journey.md                      # where images live (cards, heroes, bands) (D-01)
  - ../wireframe/explore-wireframe.html  # every IMG block uses the placeholder spec here (D-05)
sources: design-process.md §5 · concierge-os-direction.md #10 · CLAUDE.md (FieldMask hard rule) · globals.css :root
---

# MDE Image Strategy

> **One-line verdict:** Photography is the **#1 premium lever** — it's what separates "luxury concierge" from "SaaS directory." But it's **gated on the Google Places photo proxy**: real photos in production, **one pale-teal placeholder** (`#E1F6F2`) until they land, and **never a broken-image box.** Most sites fail here by shipping generic stock or flat illustrations — we don't.

---

## 0. Locked decisions

| Decision | Locked value |
|---|---|
| **Style** | **Real Medellín photography** — skylines, rooftops, interiors, street life. Editorial / cinematic, per vertical (§1). |
| **Banned** | Generic stock · flat illustrations · cartoon/AI graphics · SaaS hero blobs · purple gradients · Sparkles/wand icons. |
| **Production source** | Google Places photos via the `/api/places/photo` proxy — **`X-Goog-FieldMask` on every Places call** (hard rule, cost lever). |
| **Placeholder** | **One** pale-teal `#E1F6F2` gradient — not per-category tints. Never a broken-image box. |
| **Loading** | `next/image` `placeholder="blur"` (blur-up) to kill layout shift. |

---

## 1. Per-vertical photography style

Each vertical has a **mood**, so the imagery does narrative work — not interchangeable stock. Target refs are *vibe anchors*, not assets to copy.

| Vertical | Style | Mood / what to shoot | Target ref |
|---|---|---|---|
| **Restaurants** (Eat) | Editorial | plated dishes, warm interiors, golden-hour terraces | Airbnb Luxe |
| **Cafés** (Eat) | Lifestyle | latte art, laptop-friendly corners, plants, daylight | Aman |
| **Events** | Immersive | crowds, stage light, full-bleed energy | Soho House |
| **Nightlife** | Premium — **dark mood OK here** | neon-on-dark, rooftop city lights (the one place dark imagery is idiomatic) | — |
| **Rentals / Stays** | Architectural | wide interiors, balconies, El Poblado/​Laureles skyline views | — |
| **Neighborhoods** | Cinematic | streets, comuna hillsides, aerial Medellín, "vibe of the barrio" | — |

> **Why per-vertical:** a café shot in "event immersive" style reads wrong; a rental in "café lifestyle" loses the architecture. The mood is part of the grounding — real place, right feeling.

---

## 2. The production reality — Places photo proxy

Photography scores **100 only if real photos land.** They come from Google Places, fetched through our proxy (never hot-linked, never a raw key in the client):

```
<VenueCard> / hero  ──▶  /api/places/photo?ref=<photo_name>&maxW=…
                          │  proxy attaches the API key server-side
                          │  Places call carries X-Goog-FieldMask  (hard rule — cost lever)
                          ▼
                       Google Places Photo  ──▶  next/image (blur-up)
```

**Hard rules that apply here:**
- **`X-Goog-FieldMask` on every Places call** — request only `photos`/the fields you render, never `*`. (Cost + the maps hook.)
- **No API key in `mdeapp/src/**`** — the proxy/edge function holds it; the client only sees `/api/places/photo`.
- Cache aggressively (photos are stable per place); respect Google's attribution requirements where shown.

---

## 3. The placeholder — one pale-teal gradient

Until a real photo loads (or when a place has none), show **the single pale-teal placeholder** — calm, on-brand, never a grey box or a broken `<img>`.

```css
/* the one placeholder — derived from the teal brand token, NOT a new colour */
background: linear-gradient(150deg,
  oklch(0.970 0.015 180),   /* ≈ pale teal #E1F6F2 */
  oklch(0.926 0.030 184));
```

- **One placeholder, not per-category tints** — category is shown by **glyph + label**, not by colour (matches the 2-colour discipline in `design-system.md`).
- The wireframes render this as the `.img` block with a small `"IMG"` tag — that *is* the production placeholder, not a wireframe-only stand-in.
- **Never** a broken-image icon, a spinner-in-a-box, or `gray-200`. Empty state of a photo = this gradient.

---

## 4. Loading + performance

| Concern | Rule |
|---|---|
| Layout shift | `next/image` with explicit `width`/`height` (or `fill` + aspect-box); **`placeholder="blur"`** blur-up |
| Above-the-fold hero | `priority` on the one hero image; everything else lazy |
| Card rows | lazy-load; skeleton row while the batch resolves (not a spinner) |
| Responsive | `sizes` set per breakpoint so mobile doesn't pull desktop-width photos |
| Format | let `next/image` negotiate AVIF/WebP; don't ship raw JPEGs |
| Motion | any Ken-Burns / parallax on heroes → guard with `prefers-reduced-motion` |

---

## 5. Where images appear (and how)

| Surface | Image role | Aspect | Notes |
|---|---|---|---|
| **VenueCard** | the hero of the card | ~4:3 / 16:10 | blur-up; ♡ overlay top-right; kind pill bottom-left over a subtle scrim |
| **Explore results** | card rows (§premium formula) | 4:3 | pale-teal placeholder until proxy resolves |
| **Hero (Home)** | full-bleed or framed | 16:9 | dark scrim **over the photo** is allowed (immersive moment) — not a dark page |
| **Neighborhood band** | cinematic editorial | 3:2 wide | one editorial moment; `prefers-reduced-motion` on any scroll effect |
| **Events** | immersive full-bleed | 16:9 | energy; date/venue meta in neutral over scrim |
| **Map pins** | *no photo* | — | pins are teal glyphs; the photo lives in the card the pin links to |

---

## 6. Quality gate for imagery

A surface isn't "done" on images until:

- [ ] Real Places photo **or** the pale-teal placeholder renders — **never** a broken box
- [ ] `X-Goog-FieldMask` present on the Places call (maps hook)
- [ ] No API key reachable from client code
- [ ] `next/image` blur-up wired (no layout shift)
- [ ] Per-vertical mood honoured (no café-shot-as-event)
- [ ] Banned imagery absent (no stock/illustration/AI-cartoon/purple)
- [ ] `prefers-reduced-motion` guards any image motion

---

## 7. What this doc locks (handoff)

| Locked | Value |
|---|---|
| Style | real Medellín photography, per-vertical mood (§1) |
| Source | Places photo proxy, FieldMask-gated, key server-side (§2) |
| Placeholder | one pale-teal `#E1F6F2` gradient, glyph+label for category (§3) |
| Loading | `next/image` blur-up, skeletons, responsive `sizes` (§4) |
| Banned | stock · illustration · AI-cartoon · purple · Sparkles (§0) |

→ Pairs with **[`design-system.md`](./design-system.md)** (the placeholder gradient is a derivation of the teal token) and is consumed by every `<VenueCard>` and hero in the wireframes.
