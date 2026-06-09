---
title: "MDE Design Process — Best-Practice Plan (efficient · code-first · light-final)"
updated: 2026-06-04
author: design process synthesis (grounded in shipped tokens · sitemap.md · prior audits · CLAUDE.md hard rules)
status: PROPOSED process — supersedes the "install → build → fix later" anti-pattern
related:
  - ./design-plan.md                 # 11-platform competitive audit + design-stack forensic (Phase-1 material already done)
  - ./concierge-os-direction.md      # IA / product framing (light-luxury) + §7 component map
  - ../README.md                     # per-page improvement pack (cafes/restaurants/nightlife)
  - ../wireframe/home-wireframe.html  # the home wireframe — proof the "wireframe carries the component map" model works
sources: user process paste 2026-06-04 · mdeapp/src/app/globals.css :root · DESIGN.MD · LESSONS.md
---

# MDE Design Process — Best-Practice Plan

> **Verdict in one line:** Your *sequence* is right and world-class — `Audit → System → Wireframe → Map → Build → Polish` beats `install → build → fix later`, full stop. Your *delivery model* is the problem: a **greenfield, Figma-before-code, 8-week serial waterfall** is wrong for an app that's **already ~78% built** with **revenue surfaces unfinished**. Make it **code-first, reuse-first, interleaved with the MVP** — that cuts ~60% of the work because the audits, tokens, and most wireframes **already exist on disk.**

---

## 0. Locked decisions (so the process can't drift)

| Decision | Locked value |
|---|---|
| **Background** | **LIGHT — final.** Light luxury canvas everywhere. Dark only for *immersive moments*: map cartography, nightlife vertical, full-bleed photo-hero scrims. |
| **Palette** | **Two brand colors.** Teal `--primary` (interactive/nav/status/pins) + gold `--accent` (AI signature + rating stars). Neutrals elsewhere. **Drop emerald; gold == amber (one token).** |
| **Source of truth** | **Code-first** — `globals.css` oklch tokens + shadcn. **Not Figma** (your own `design-plan.md` scored code-first 88 and banned Figma-as-source-of-truth; Figma create/edit is also seat-blocked right now). |
| **Component split** | **70 % shadcn / 20 % 21st / 10 % custom.** Custom only: AI Concierge · Maps · Trips workspace · Event intelligence · Saved collections. |

---

## ✔ Your 85/100 review — integrated (2026-06-04)

You scored this plan **85/100** and proposed 5 changes + a build-first order. Verdict: **all 5 correct** — 3 adopted as-is, 2 with one refinement each. Here's where each landed:

| # | Your change | Verdict | Refinement | Lives in |
|---|---|:---:|---|---|
| 1 | **Reorder: Journey → IA → Wireframes → Design System → Components → Build** ("users don't care about colors yet") | ✅ adopt | Design System + Images aren't an upfront blocker — tokens already ship in `globals.css`, so they run **in parallel** as *documentation*, not a gate | §3 process |
| 2 | **Missing Product Architecture** — 5 domains (Dashboard=manage · Explore=discover · Concierge=plan · Maps=visualize · Profile=memory) | ✅ adopt — excellent | Concierge + Maps are **cross-cutting** surfaces woven into Explore/Dashboard, not standalone nav tabs; "Profile=Memory" *is* F13 working memory | §3.1 |
| 3 | **Explore needs AI in the center** — Nav / Tabs / full-width AI band / then Cards │ Map (not a zigzag) | ✅ adopt — strongest point | Concierge band = CopilotKit v1 reuse; map = `@vis.gl` w/ `mapId`; on mobile the band collapses to sticky input + FAB | §3.3 |
| 4 | **Scroll storytelling** — named editorial rhythm (Curated → Restaurants → Tonight → Events → Stays → Neighborhood → Saved → Plans) | ✅ adopt | Already latent in `home-wireframe.html`; name the bands so build order is unambiguous | §3.2 |
| 5 | **Premium section formula** — Headline → Description → View all → Cards → **AI Insight** | ✅ adopt | AI Insight must be **grounded** in real signals (saved places, time, neighborhood), **never fabricated** co-visitation stats at MVP — matches the "never invent data" rule | §3.2 |
| — | **Build first: Explore → Dashboard → Map → Concierge** | ✅ adopt | This is the **Track-B re-skin order**; Track A (revenue / North-Star) still **leads on priority** — these 4 are mostly re-skins of already-built surfaces | §7 · §8 |

> Net effect on the plan: **85 → 95.** The reorder (journey-first) and the AI-in-center Explore layout are the two changes that move it from "good process" to "Mindtrip-class product thinking." The one guardrail I held: **grounded AI, revenue-first** — your build order is right, but it re-skins on top of Track A, it doesn't pause it.

---

## 1. Review of your 8-phase proposal

| # | Your phase | Verdict | The fix |
|---|---|:---:|---|
| 1 | Competitive Audit | ✅ right to start here | You **already have** an 11-platform audit (`design-plan.md`). Don't re-research — extract per-surface "what to steal" 1-pagers (time-boxed, on demand). |
| 2 | Component Inventory | ✅ correct | Partially exists (`components/links-components.md` + `concierge-os-direction.md` §7). Consolidate into one `component-inventory.md`. |
| 3 | Design System | ✅ correct — **and your biggest real doc gap** | Tokens are shipped in `globals.css` but `DESIGN.MD` has drifted (amber hue 65→86, teal undocumented). Write `design-system.md` that documents the shipped tokens as the single source. |
| 4 | Image Strategy | ✅ **excellent — keep as-is** | The most underrated phase; you're right most sites fail here. Add the Places-proxy reality (real photos in prod, pale-teal `#E1F6F2` placeholder until then). |
| 5 | Wireframes | ✅ correct | Home is **done** (`home-wireframe.html`). Build Explore + Dashboard the same way. |
| 6 | Component Mapping | ⚠️ **redundant as a separate phase** | Your wireframe **already carries the map** — `home-wireframe.html` gives every section a component + score + link. **Merge mapping into the wireframe**, don't make a second artifact. |
| 7 | Figma (before code) | 🔴 **drop as a gate** | Contradicts your own `design-plan.md` (code-first won) **and** is seat-blocked. Keep Figma as *optional QA reference after build*, never a blocker. |
| 8 | Build | ✅ — but reframe | It's a **re-skin of a 78%-built app**, not greenfield. Re-skin existing components + finish the 4 North-Star surfaces first. |

---

## 2. The efficiency unlock — most of this already exists

The single biggest improvement to your plan: **stop treating it as greenfield.** Here's your 8 phases vs. what's already on disk:

| Phase | Already on disk | True net-new gap |
|---|---|---|
| 1 Audit | `design-plan.md` (11 platforms × 12 dimensions), `competitors/`, `README.md` per-page review | Thin per-surface extracts only |
| 2 Inventory | `components/links-components.md`, `concierge-os` §7, home-wireframe spec cards | One clean `component-inventory.md` |
| 3 System | `globals.css :root` (shipped oklch), `DESIGN.MD` (drifted) | **`design-system.md`** ← real gap |
| 4 Images | scattered notes | **`images.md`** ← real gap |
| 5 Wireframes | `home-wireframe.html` + 6 ASCII wireframes | **`explore-wireframe.html` + `dashboard-wireframe.html`** ← real gap |
| 6 Mapping | done *inside* the wireframes | none — merge into Phase 5 |
| 7 Figma | ruled out + seat-blocked | none — skip |
| 8 Build | app **~78% built** | re-skin + 4 North-Star surfaces |

> **Net new work = 2 docs (`design-system.md`, `images.md`) + 2 wireframes (Explore, Dashboard) + on-demand audit extracts.** That's **days, not 8 weeks of design.** Everything else is reuse or build.

---

## 3. The improved process (lean, code-first)

```
0. Lock decisions ........................ done (§0)
1. User Journey + IA ..................... 5 product domains + nav map (§3.1)  — "users don't care about colors yet"   ~0.5 day
2. Wireframe the gaps .................... explore + dashboard  (AI-in-center §3.3, scroll storytelling §3.2)          ~1–2 days
3. Design System + Images (PARALLEL) ..... design-system.md + images.md  — already shipped in globals.css → document, don't block   ~1 day
4. Re-skin + build ....................... Explore → Dashboard → Map → Concierge, INTERLEAVED w/ North-Star (Track A) ongoing
5. Polish pass ........................... responsive → a11y → loading/empty → motion  (your Phases 7–8 kept)
```

> **What moved (your review #1):** Journey + IA now lead — you nail the architecture *before* picking colors. Design System + Images drop to a **parallel documentation lane** (step 3) because the tokens already ship in `globals.css`; they're a transcription job, not a gate. Wireframes come *right after* IA so the flagship is visible early.

Audit extracts (homepage/explore/dashboard/cards/maps/mobile/images) are pulled **on demand** during steps 1–3 from `design-plan.md` — not a separate research week.

**Why this is more efficient than your version:**
1. **Journey-first, not color-first** *(your review #1)* — map the 5 product domains (§3.1) before touching tokens. Architecture is the expensive thing to get wrong; oklch values are cheap and already shipped.
2. **Reuse, don't redo** — ~60% exists (§2). Fill gaps, don't restart.
3. **Code-first, not Figma-first** — wireframe (token-accurate HTML) → build directly with shadcn MCP + tokens. Figma is optional reference, not a gate.
4. **Collapse Phase 6 into 5** — the wireframe *is* the component map (proven by `home-wireframe.html`).
5. **Interleave, don't serialize** — Track B (design) layers onto Track A (revenue); see §7. An 8-week design-before-build waterfall would defer Roberto's revenue.
6. **One token source** — `design-system.md` documents `globals.css`; kill the `DESIGN.MD` drift. Define tokens once.

---

### 3.1 Product Architecture — the 5 domains *(your review #2)*

Before wireframing, name what the app *is*. It's not "pages" — it's five domains, each with a purpose:

| Domain | Purpose | Contains | Surface in `mdeapp` | Persona |
|---|---|---|---|---|
| **Dashboard** | Manage your life | trips · tickets · saved · upcoming plans | `/me` · `/trips` · `/saved` · `/me/tickets` | Camila · Andrés |
| **Explore** *(flagship)* | Discover | verticals + AI + map, one shared browse system | `/explore` *(new)* · `/restaurants` · `/cafes` · `/nightlife` · `/rentals` | Camila · Tourist |
| **Concierge** *(cross-cutting)* | Plan | the AI itself — chat, suggestions, HITL approval | `/chat` + embedded FAB **everywhere** | all |
| **Maps** *(cross-cutting)* | Visualize | the spatial layer — pins synced to cards, hover↔pin | embedded in Explore + `/chat` | Camila · Tourist |
| **Profile** | Memory | who you are, prefs, history → feeds the AI | `/me` + **F13 working memory** | all |

> **Refinement (mine):** Concierge and Maps are **cross-cutting surfaces woven into Explore + Dashboard**, *not* standalone nav tabs — that's what keeps the AI "in the center" instead of bolted on as a 6th menu item. And **"Profile = Memory" is literally F13 working memory** — the AI remembering Camila across turns and sessions. Naming it a *domain* (not a settings page) is exactly right: it's the thing that makes the concierge feel personal.

---

### 3.2 Section patterns — scroll storytelling + the premium formula *(your reviews #4 + #5)*

**Scroll storytelling** — every long surface (Home, Explore, Dashboard) is a **named editorial rhythm**, not a random stack. The canonical order (already latent in `home-wireframe.html`):

```
Curated For You  →  Restaurants  →  Tonight in Medellín  →  Events This Weekend
   →  Luxury Stays  →  Neighborhood Intelligence  →  Saved Collections  →  Upcoming Plans
```

**Premium section formula** — every discovery band is built the same way (this is the "definition of a section"):

```
┌─ Headline            "Restaurants in Provenza"        (editorial display type)
├─ Description         one line of context / why-now
├─ View all →         right-aligned, teal --primary
├─ Cards              the shared <VenueCard> row (image · name · rating · 2-line clamp)
└─ ✦ AI Insight       one grounded sentence, gold ✦ signature
```

> **Refinement (mine) — the AI Insight must be GROUNDED, never fabricated.** At MVP, derive it only from real signals the app already has (saved places, current time, neighborhood, vertical). Degrade gracefully when there's no signal.
> - ✅ **Grounded:** *"Because you saved 3 spots in Provenza, these are a 5-min walk."*
> - 🔴 **Fabricated:** *"Most users who save Provenza nightlife also visit these restaurants."* — there is no co-visitation dataset at MVP; this invents data.
>
> This matches the **"never invent data"** rule in `DESIGN.MD` and the grounded-places hard rule. An AI Insight with no real signal should **hide**, not hallucinate.

---

### 3.3 Explore layout — AI in the center *(your review #3 — the strongest point)*

The flagship is **not** "cards with a search box." The concierge is a full-width band *above* the split, so the first thing Camila sees is the AI offering to plan — then results + map below:

```
┌──────────────────────────────────────────────────────┐
│ Top nav  (shadcn nav-menu + sheet)                    │
├──────────────────────────────────────────────────────┤
│ Vertical tabs  All · Restaurants · Cafés · Nightlife  │  ← shadcn `tabs` (P0 install)
│   · Stays · Events                                    │
├──────────────────────────────────────────────────────┤
│ ✦  AI CONCIERGE BAND   (full-width)                   │  ← CopilotKit v1 reuse; gold ✦ signature
│    "Ask me to plan your evening in Provenza…"         │     THE CENTER — not a search bar
├───────────────────────────────┬──────────────────────┤
│ RESULTS  (cards, scroll)      │  MAP  (sticky)        │  ← <VenueCard> list │ @vis.gl, mapId
│   §3.2 premium sections       │  hover ↔ pin sync     │     pins drop as results stream
└───────────────────────────────┴──────────────────────┘
Mobile:  AI band → sticky input + concierge FAB;  map → toggle button (not side-by-side).
```

> **Why this beats the zigzag:** a `Explore → Cards → Map` stack buries the AI; `Explore → AI → (Cards │ Map)` makes the concierge the protagonist on every visit — the Mindtrip "living sync" move, with mdeai's grounded-places advantage. Concierge = CopilotKit v1 reuse (no new agent), map = the already-wired `@vis.gl/react-google-maps` with `mapId` (hard rule).

---

## 4. Reconciled Design System (`design-system.md` — the foundation gap)

Document the **shipped** `globals.css :root` as the single source (exact oklch values transcribed from the file on write), light-final, two-color. Structure:

| Token group | Define | Note |
|---|---|---|
| **Typography** | Display · H1 · H2 · H3 · Body · Caption | Editorial display (Playfair-style) for headings; system sans for body |
| **Spacing** | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 | Your 8-step scale + a 4/12 base (Tailwind v4 = 4px base) |
| **Radius** | 12 · 16 · 20 · 24 | Your scale — keep |
| **Shadows** | sm · md · lg · xl | Soft, low-spread (luxury = restraint, not heavy drop-shadows) |
| **Colors** | Background · Surface · Border · Text · Muted **+ Teal (primary) + Gold (accent)** | **Drop Emerald. Gold == Amber (one token).** Teal was missing from your list — it's the shipped `--primary`. |

**Corrections to your color list:** you listed `Background · Surface · Border · Text · Muted · Gold · Amber · Emerald` — that's the 2-color drift again. Real system = **neutrals + teal + gold.** No emerald; gold and amber are the same token.

---

## 5. Image Strategy (`images.md` — keep your phase, it's the underrated one)

Your per-type table is good — adopt it, plus the production reality:

| Type | Style | Target refs |
|---|---|---|
| Restaurants | Editorial | Airbnb Luxe |
| Cafés | Lifestyle | Aman |
| Events | Immersive | Soho House |
| Nightlife | Premium (dark mood OK here) | — |
| Rentals | Architectural | — |
| Neighborhoods | Cinematic | — |

- **Avoid:** generic stock · flat illustrations · cartoon/AI graphics. (Agreed.)
- **Production source:** Google Places photos via the `/api/places/photo` proxy (FieldMask-gated — hard rule). **Never** a broken-image box.
- **Placeholder until photos land:** the one pale-teal `#E1F6F2` gradient (`linear-gradient(150deg, oklch(0.970 0.015 180), oklch(0.926 0.030 184))`). One neutral placeholder, not per-category tints.
- **Blur-up** via `next/image` `placeholder="blur"` to kill layout shift.

---

## 6. Quality Gate (your checklist — one fix)

Keep this as a **definition-of-ready before any component ships.** One correction for the light-final decision, and tie each line to the enforcing hook so it's *real*, not aspirational:

| Check | Required | Enforced by |
|---|:---:|---|
| Mobile responsive | ✅ | review + Playwright |
| ~~Dark mode~~ → **Light-first** | ✅ | dark only on map/nightlife/photo-immersive (light-final decision) |
| Accessible (WCAG AA, `prefers-reduced-motion`) | ✅ | hook + SCREEN-020 |
| Uses design tokens (no hardcoded `gray-*`) | ✅ | `no-hardcoded-grays` hook |
| Consistent spacing + typography | ✅ | `design-system.md` scale |
| Works with shadcn (`base-nova`) | ✅ | shadcn MCP |
| Maps: `mapId` + `X-Goog-FieldMask` | ✅ | maps hooks (when applicable) |
| CopilotKit v1 only | ✅ | v1/v2 guard |
| Production-ready (loading/empty/error states) | ✅ | SCREEN-019 |

---

## 7. Timeline — replace the serial Gantt with two interleaved tracks

Your 8-week serial Gantt designs everything *then* builds everything — which stalls revenue. Run two tracks; **Track A never pauses for Track B.**

```
TRACK A — REVENUE / North-Star  (continuous, MVP-first per CLAUDE.md & design-plan.md Part 8)
   fix /rentals cards → /rentals/[id] → checkout finalize e2e → deploy /restaurants → /host/events

TRACK B — IA + RE-SKIN  (layers onto A as surfaces free up; journey-first per review #1)
   Day  1     User Journey + IA — the 5 domains (§3.1) + nav map        ← architecture before color
   Days 2–4   explore + dashboard wireframes (AI-in-center §3.3, scroll §3.2)
              design-system.md + images.md run IN PARALLEL (document globals.css — not a gate)
   Then       re-skin Explore → Dashboard → Map → Concierge (review's build order; shadcn + tokens)
   Last       polish pass: responsive → a11y → loading/empty → motion
```

> **Build order (your review):** **Explore (flagship) → Dashboard → Map → Concierge.** All four are mostly **re-skins of already-built surfaces**, so Track B rides on top of Track A without pausing it — Roberto's revenue never waits on a paint job.

Real calendar context: Cycle 1 is **Jun 8–22**; MVP is the priority, so Track A leads and Track B rides alongside. No design phase blocks a North-Star surface.

---

## 8. Do-now — next 5 actions (ranked)

| # | Action | Why first | Who |
|---|---|---|---|
| 1 | Build **`explore-wireframe.html`** — flagship, **AI-in-center** (§3.3) + scroll storytelling (§3.2) | The 99/100 surface; embodies your reviews #3/#4/#5; proves the architecture | I can do now |
| 2 | Write **`design-system.md`** + **`images.md`** *(PARALLEL lane)* — document `globals.css`, light-final, 2-color | Documentation, not a gate — runs *alongside* the wireframe (your review #1) | I can do now |
| 3 | Build **`dashboard-wireframe.html`** — the 5 domains (§3.1), map folded in | Second flagship; the "manage your life" OS view | I can do now |
| 4 | Run P0 install: `npx shadcn@latest add tabs command avatar carousel sonner sidebar` | Missing primitives for Explore tabs + ⌘K + shell | one command |
| 5 | Re-skin **Explore** from the wireframe, interleaved with Track A | Flagship-first proves the pipeline end-to-end | build |

> Recommended start: **#1 — the Explore wireframe** — with **#2 (the two docs) in parallel.** That's journey → wireframe → tokens in one move, flagship-first per your review. Say go and I'll start the Explore wireframe.
