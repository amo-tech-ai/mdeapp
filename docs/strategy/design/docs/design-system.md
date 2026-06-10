---
title: "MDE Design System — the shipped tokens, documented (D-02)"
updated: 2026-06-05
author: design synthesis — transcription of mdeapp/src/app/globals.css :root (verbatim, 2026-06-05)
status: SOURCE OF TRUTH for tokens — supersedes DESIGN.MD where they drift (this doc wins; see §7)
linear: SAN-568 (epic SAN-566 · project UX · labels track:ux + scr)
related:
  - ../../../mdeapp/src/app/globals.css   # THE source — every value here is transcribed from :root
  - ../../../DESIGN.MD                     # older token doc — drifted (amber hue, teal undocumented); reconcile to this
  - ./ia-journey.md                        # architecture (D-01)
  - ./images.md                            # photography + placeholders (D-03)
  - ../wireframe/explore-wireframe.html    # uses these exact tokens (D-05)
sources: globals.css :root (verbatim) · concierge-os-direction.md · design-process.md §4
---

# MDE Design System

> **One-line verdict:** The tokens already ship in `globals.css :root` — this is a **documentation job, not a design job.** Light is **final**. Two brand colours: **teal** (interactive) + **gold** (AI + stars). Everything else is neutral. Where `DESIGN.MD` disagrees, **this doc wins** — it's transcribed verbatim from the file the app actually renders.

---

## 0. Locked decisions

| Decision | Locked value |
|---|---|
| **Background** | **LIGHT — final.** Light-luxury canvas everywhere. Dark only for *immersive moments*: map cartography, nightlife vertical, full-bleed photo-hero scrims. |
| **Palette** | **Two brand colours.** Teal `--primary` (interactive / nav / status / pins) + gold `--accent` (AI signature ✦ + rating stars). Neutrals elsewhere. **Drop emerald. Gold == amber (one token).** |
| **Source of truth** | **`globals.css :root`** — code-first, not Figma. This doc transcribes it; do not invent values. |
| **Brand anchors** | (from the `:root` comment) slate `#0f172a` · teal `#0f766e` · gold `#eab308` — the "Paisa brand" hex anchors the oklch tokens approximate. |

---

## 1. Colour tokens — light `:root` (verbatim from `globals.css`)

These are the **exact** shipped values. Use the **token name** (`bg-primary`, `text-muted-foreground`), never a raw oklch or a `gray-*` literal.

| Token | Value (oklch) | Role | Brand-colour? |
|---|---|---|---|
| `--background` | `oklch(0.985 0.002 247)` | page canvas (near-white, faint cool) | neutral |
| `--foreground` | `oklch(0.208 0.042 265)` | primary text (slate, ≈`#0f172a`) | neutral |
| `--card` | `oklch(1 0 0)` | card / surface (pure white) | neutral |
| `--card-foreground` | `oklch(0.208 0.042 265)` | text on cards | neutral |
| `--popover` | `oklch(1 0 0)` | popover / dropdown surface | neutral |
| `--popover-foreground` | `oklch(0.208 0.042 265)` | text on popovers | neutral |
| **`--primary`** | **`oklch(0.508 0.118 175)`** | **TEAL** — interactive, nav, focus, map pins, links | ✅ **brand** |
| `--primary-foreground` | `oklch(0.985 0.002 247)` | text on teal (near-white) | neutral |
| `--secondary` | `oklch(0.968 0.007 247)` | subtle fill | neutral |
| `--secondary-foreground` | `oklch(0.208 0.042 265)` | text on secondary | neutral |
| `--muted` | `oklch(0.968 0.007 247)` | muted surface (section alt-bg) | neutral |
| `--muted-foreground` | `oklch(0.554 0.046 257)` | secondary / caption text | neutral |
| **`--accent`** | **`oklch(0.795 0.184 86)`** | **GOLD** — AI ✦ signature + rating stars ONLY | ✅ **brand** |
| `--accent-foreground` | `oklch(0.208 0.042 265)` | text on gold (slate) | neutral |
| `--destructive` | `oklch(0.577 0.245 27.325)` | error / destructive (red) | system |
| `--border` | `oklch(0.929 0.013 255)` | hairline borders | neutral |
| `--input` | `oklch(0.929 0.013 255)` | input border | neutral |
| `--ring` | `oklch(0.508 0.118 175)` | focus ring (= teal `--primary`) | ✅ brand |
| `--chart-1` | `oklch(0.795 0.184 86)` | chart accent (= gold) | — |
| `--chart-2…5` | `oklch(0.556 0 0)` → `oklch(0.269 0 0)` | neutral greys | — |

> **Discipline (the 2-colour rule):** **teal** = anything interactive or spatial (buttons, links, active tabs, focus rings, **map pins**, "open now"); **gold** = the AI ✦ band/insights + ★ rating stars, *nothing else*. Category is shown by **glyph + label, not colour** — pins and chips stay uniform teal/neutral. **No emerald, no third hue.** `--chart-*` greys exist but the Dashboard is an OS, **not analytics** — avoid charts.

### 1.1 Convenience tints used in wireframes (derived, not in `:root`)

The annotated wireframes add a few **soft tints** for low-fi blocks. These are derivations of the brand tokens (document them so they don't read as new colours):

| Wireframe var | Value | Derived from |
|---|---|---|
| `--primary-soft` | `oklch(0.95 0.03 178)` | teal @ low chroma — active-tab / icon-tile fill |
| `--accent-soft` | `oklch(0.96 0.05 90)` | gold @ low chroma — AI band background |
| `--map` | `oklch(0.62 0.10 235)` | cartography blue — water/parks pins only |

---

## 2. Dark mode — exists, but scoped

`globals.css` ships a full `.dark` block **and** a `@media (prefers-color-scheme: dark)` override. Per the **light-final** decision, dark is **not** the default product surface — it's reserved for immersive moments. Notable dark values (for those moments only): `--background: oklch(0.208 0.042 265)`, `--primary: oklch(0.696 0.17 175)` (brighter teal), `--accent: oklch(0.795 0.184 86)` (gold unchanged). **Do not flip the app to dark** — that would re-skin every surface already built light.

| Use dark for | Not for |
|---|---|
| Map cartography (`@vis.gl` dark `mapId`) | the page background |
| Nightlife vertical (night mood) | dashboards / forms / browse |
| Full-bleed photo-hero scrims (dark over the photo) | "because Apple is dark" |

---

## 3. Typography

**Shipped reality:** body + headings render in **Geist Sans** (`--font-sans → --font-geist-sans`, wired in `layout.tsx`); mono is Geist Mono. There is **no editorial display face wired yet.**

| Role | Shipped | Design intent (not yet wired) |
|---|---|---|
| Display / H1–H2 | Geist Sans, tight tracking | **Editorial serif** (Playfair-style) for "Tonight In Medellín" headlines — the luxury lever |
| H3 / UI | Geist Sans 600 | keep |
| Body | Geist Sans 400, `line-height 1.5` | keep |
| Caption / meta | Geist Sans, `--muted-foreground` | keep |
| Mono / code | Geist Mono (`--font-geist-mono`) | keep |

> **Honest gap:** the wireframes mark headings `.serif` (Playfair) as the **editorial direction**; the app ships all-Geist. Wiring the display serif is a small, high-impact polish task — flagged here, not silently assumed. Until then, headings are Geist Sans with tight tracking + generous size.

**Scale (recommended, Tailwind-native):** Display `text-4xl/5xl` · H1 `text-3xl` · H2 `text-2xl` · H3 `text-lg` · Body `text-sm/base` · Caption `text-xs`. Tracking: headings `-0.02em`; body default.

---

## 4. Spacing, radius, shadows

### 4.1 Spacing — Tailwind v4 (4px base)

8-step rhythm for layout: **4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96** (`gap-1 … gap-24`). Section rhythm: `py-16 md:py-20 lg:py-24`, alternating `bg-background` / `bg-muted/40`. Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

### 4.2 Radius — shipped scale

Base shipped: **`--radius: 0.625rem`** (10px). The `@theme` block derives the rest:

| Token | Formula | ≈ px |
|---|---|---|
| `--radius-sm` | `--radius * 0.6` | 6px |
| `--radius-md` | `--radius * 0.8` | 8px |
| `--radius-lg` | `--radius` | 10px |
| `--radius-xl` | `--radius * 1.4` | 14px |
| `--radius-2xl` | `--radius * 1.8` | 18px |
| `--radius-3xl` | `--radius * 2.2` | 22px |
| `--radius-4xl` | `--radius * 2.6` | 26px |

Cards use `rounded-xl`/`rounded-2xl`; pills/chips `rounded-full`. (The wireframes use a flat `14px` ≈ `--radius-xl` for their card mocks.)

### 4.3 Shadows — soft, low-spread (luxury = restraint)

No heavy drop-shadows. Reference token used in wireframes:
`0 1px 2px oklch(0.4 0.03 257 / 0.05), 0 8px 24px oklch(0.4 0.03 257 / 0.06)`.

| Level | Use |
|---|---|
| `sm` | resting cards, inputs |
| `md` | hover lift (`-translate-y-0.5`) |
| `lg` | popovers, command palette, sheets |
| `xl` | modal / dialog only |

---

## 5. Motion + accessibility

`globals.css` ships **two** `@media (prefers-reduced-motion: reduce)` guards — honour them. Every animated surface (hero, marquee, scroll-storytelling, map fly-to) must degrade to no-motion. WCAG AA contrast (teal-on-white and slate-on-white both pass). Focus = teal `--ring`. This is enforced by the `no-hardcoded-grays` hook and the a11y review — **not aspirational.**

---

## 6. Component split

**70 % shadcn / 20 % 21st.dev / 10 % custom.** Zero theme migration — 21st blocks + shadcn `base-nova` already consume these tokens.

| Layer | Share | What |
|---|---|---|
| **shadcn (`base-nova`)** | 70 % | nav-menu · sheet · tabs · command · dropdown · card · button · badge · avatar · sonner · sidebar |
| **21st.dev** | 20 % | hero · gallery4 (card rows) · cta · footer · sign-in — *restyle to tokens, strip purple/Sparkles* |
| **custom** | 10 % | **AI Concierge · Maps · Trips · Saved · VenueCard** only |

**P0 install (missing primitives):** `npx shadcn@latest add tabs command avatar carousel sonner sidebar`.

---

## 7. DESIGN.MD reconciliation (kill the drift)

`DESIGN.MD` predates the shipped `:root` and has drifted. **This doc is authoritative**; correct `DESIGN.MD` to match:

| Drift in DESIGN.MD | Correct (shipped) value |
|---|---|
| Amber hue listed as `65` | `--accent` hue is **`86`** (`oklch(0.795 0.184 86)`) |
| Teal `--primary` undocumented | **teal is the primary** — `oklch(0.508 0.118 175)` |
| Emerald "success" colour | **dropped** — teal reads as confirmed; no third hue |
| "gold" vs "amber" as two tokens | **one token** — gold == amber == `--accent` |

> If a future task edits colours, edit **`globals.css :root` first**, then update this table — never the other way round. One token source, defined once.

---

## 8. What this doc locks (handoff)

| Locked | Value |
|---|---|
| Colours | the verbatim `:root` table (§1) — teal + gold + neutrals, no emerald |
| Mode | light-final; dark scoped to immersive moments (§2) |
| Type | Geist Sans shipped; editorial serif = flagged intent (§3) |
| Radius | `--radius 0.625rem` + the `@theme` multipliers (§4.2) |
| Motion | both `prefers-reduced-motion` guards honoured (§5) |
| Split | 70/20/10; P0 install set (§6) |

→ Pairs with **[`images.md`](./images.md)** (photography + placeholders) and feeds every wireframe + re-skin.
