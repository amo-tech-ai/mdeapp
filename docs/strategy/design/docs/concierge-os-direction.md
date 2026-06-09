---
title: "MDE Design Direction — Option: The Medellín AI Concierge OS"
updated: 2026-06-04
author: design synthesis (grounded in shipped oklch tokens · sitemap.md · DESIGN.MD · prior audits)
status: OPTION — proposed direction, not yet committed
scope: product-framing + information architecture layered on the light-luxury visual system
related:
  - ./design-plan.md                 # prior forensic audit (design stack + competitor UX)
  - ../README.md                     # design improvement pack (cafes/restaurants/nightlife)
  - ../wireframe/home-wireframe.html  # annotated home wireframe (visual companion)
  - ../wireframe/01-marketing.md      # ASCII home wireframe
sources: user vision paste 2026-06-04 · mdeapp/src/app/globals.css :root · CLAUDE.md hard rules
---

# MDE Design Direction — The Medellín AI Concierge OS

> **One-line verdict:** Adopt this framing. It's the strongest product lens we've had — *"the AI is the center, not the search bar."* But it is an **IA + naming + dashboard layer**, not a new visual system; it rides on the **light-luxury tokens already locked**. Two things in the paste conflict with decisions you already made today — resolve those (Decisions 1–2 below) and the rest is a build plan.

---

## 0. How this relates to what's already built

| Layer | Owner | This doc changes it? |
|---|---|---|
| **Visual system** (light bg, teal+gold, editorial type, photo cards) | `globals.css :root` + light-luxury direction (locked 2026-06-04) | **No** — keep as-is |
| **Home page** | `wireframe/home-wireframe.html` (14 sections) | Minor — reconcile to the OS section list (§4) |
| **Product framing / IA** (nav, Explore-as-flagship, dashboard-as-OS) | *this doc* | **Yes** — the new contribution |

The Concierge OS is **Option B's framing over Option A's pixels.** They are ~90% compatible. The only true forks are the **charcoal background** and the **emerald success color** (both from the paste), covered below.

---

## 1. The vision, captured

**Identity blend** (your words): `40% Mindtrip · 20% Airbnb · 15% Google Maps · 15% Notion · 10% Apple`.

**Core thesis — the AI is the center, not the search bar.** Competitors run `Search → Results → Booking`. MDE runs:

```
AI Concierge → Discover → Save → Plan → Book → Return
```

This is correct and it matches our moat: Mastra working-memory + thread persistence (cross-session memory most rivals fake) + hyper-local Medellín grounding. The whole IA should make the concierge the spine and every surface a place the concierge can drop you into or pull you out of.

---

## 2. Where the vision AGREES with what's locked (keep all of this)

| Vision says | Status | Note |
|---|---|---|
| Warm gold / luxury amber accent | ✅ already shipped | `--accent oklch(0.795 0.184 86)` — AI-signature + rating stars only |
| Large editorial headings ("Tonight In Medellín", "Curated For You") | ✅ on-direction | Playfair-style display + generous whitespace |
| Photography-first; real Medellín skyline/rooftops/interiors; **no illustrations / AI cartoons / SaaS graphics** | ✅ on-direction | Photography ranked #1 premium lever — agreed |
| Avoid bright blue, **purple gradients**, neon | ✅ matches hard rule | (21st-builder rule: never default to purple, never Sparkles/wand icons) |
| 70–80% component reuse (shadcn + 21st), custom only for map/concierge/trips/saved/cards | ✅ matches our 3-layer model | See §7 component map |
| Dashboard = personal OS, **no charts / no SaaS metrics** | ✅ strong call | Notion-OS feel, not analytics |

---

## 3. Where the vision CONFLICTS (two decisions)

### Decision 1 — Background: **Charcoal/Graphite (paste) vs. Light (your call today)** 🔴

The paste lists `Background: Charcoal / Graphite`. **Earlier today you explicitly overrode exactly this**, reviewing the dashboard mockup: *"remove dark charcoal, we want light clean."* You've now leaned dark in a pasted spec twice and corrected to light both times — the pasted vision reads AI-generated (the 95/98/99 self-scores, the boilerplate "avoid neon"), so charcoal is most likely template residue, not a reversal.

- **Recommendation: keep the LIGHT luxury canvas as the default surface.** Reserve charcoal/graphite for *immersive moments only*, where dark is idiomatic and premium:
  - the **map** (dark cartography is standard and gorgeous — `@vis.gl` dark `mapId`),
  - the **nightlife** vertical (night mood),
  - **full-bleed photo heroes** where text sits on the photo itself (dark scrim over the image, never a dark page).
- This honors the "Apple/luxury" instinct behind charcoal without making the OS dark. **Open — confirm before any re-skin.** (Going fully dark = re-skinning every surface already built light.)

### Decision 2 — Success color: **Emerald (paste) vs. two-color discipline** 🟡

The paste adds `Success: Emerald`. Our locked palette is **two brand colors**: teal `--primary` (every interactive/nav/status-confirmed/map-pin element) + gold `--accent` (AI signature + stars). You asked for Wanderlog restraint — *"reduce the number of colors."* A third hue (emerald) reopens the door you closed.

- **Recommendation: drop emerald.** Teal already reads as confirmed/success. If you want a *distinct* booking-confirmed green, scope it to **one desaturated tone used only on a paid-ticket / publish-success state** (Andrés' receipt, Roberto's "published") — nowhere else. Status pills, chips, badges stay **neutral**.

---

## 4. Information architecture

### 4.1 Navigation — split primary vs. secondary

Your 7 top-level items are right to **avoid Restaurants/Cafes/Nightlife/Rentals as nav** (those are discovery categories inside Explore — correct). But 7 primary is heavy and "Tickets" is a sub-view of "my stuff."

| Tier | Items | Rationale |
|---|---|---|
| **Primary nav (5)** | Home · **Explore** · Trips · Saved · Events | Explore is the flagship; Events stays top-level because it owns a distinct host→buyer flow (Roberto/Andrés) |
| **Avatar menu** | Profile · **Tickets** · Settings · Sign out | Tickets = "my committed things," lives under the person, not the global bar |

`component:` shadcn `navigation-menu` (top) + `sheet` (mobile drawer) + `command` (⌘K, §5).

### 4.2 Home — reconcile the 10 sections to the built wireframe

Your 10 sections map almost 1:1 onto `home-wireframe.html` (14 bands). Two gaps to fix and one to add:

| # | Vision section | Wireframe band | Action |
|---|---|---|---|
| 1 | Hero + AI Search | 02 Hero + concierge input | ✅ keep (CopilotKit input reuse) |
| 2 | Concierge Suggestions | 05 Concierge suggestions | ✅ keep |
| 3 | Discovery Categories | 04 Verticals strip | ✅ keep |
| 4 | Trending Experiences | 06/07 Trending + discovery rows | ✅ keep |
| 5 | Events This Week | 06 Trending events | ✅ keep |
| 6 | **Featured Collections** | — (missing) | **Add** a "Collections" row inside Discovery (Mindtrip/Wanderlog boards) |
| 7 | Neighborhood Intelligence | 08 Neighborhood intel | ✅ keep |
| 8 | Interactive Map | 03 Live map teaser | ✅ keep — but **elevate** (see improvement #4) |
| 9 | Testimonials | 11 Testimonials | ✅ keep |
| 10 | CTA | 12 How-it-works + CTA | ✅ keep |
| — | *(vision omits)* | **09 Trust band** | **Keep it** — every converting competitor has a trust strip (design-plan Part 2); we currently have none |
| — | *(vision omits)* | **10 Host band** | **Keep it** — Roberto's entry to `/host/event/new` is MVP **revenue**; don't drop it from home |

### 4.3 Explore — the flagship. Consolidate 9 tabs → ~6

Your layout (`Sidebar · Tabs · always-on AI Concierge · Cards · Map`) already matches our built `explore.html` 3-column mockup and is the right call — **AI permanently visible** is the differentiator. But 9 tabs overflow on mobile and fight "the AI is the center" (too many manual filters). Also note: your tab list omits **Cafés** (we ship `/cafes`) and **Stays ≈ Rentals** overlap.

| Your 9 tabs | Proposed ~6 | Why |
|---|---|---|
| For You · Restaurants · Things To Do · Events · Nightlife · Stays · Rentals · Locations · Guides | **For You · Eat · Do · Nightlife · Events · Stay** (+ *Guides* secondary) | Eat = restaurants+cafés · Do = things-to-do · Stay = rentals+stays · **Locations → a map filter**, not a tab · Guides → secondary/footer of the For-You feed |

Let the concierge do the narrowing the tabs would otherwise do. `component:` shadcn `tabs` + `sidebar`; cards = our `<VenueCard>`; map = `@vis.gl` ChatMap (reuse, `mapId` required).

### 4.4 Dashboard — OS, not analytics. Consolidate 9 → 5 zones

Your instinct (no charts, no SaaS metrics — "Upcoming Plans" not "Statistics") is exactly right. But three of the nine are the same concept under different names (**Tickets / Reservations / Bookings** = "things I've committed to"), and Events/Trips overlap Upcoming.

| Your 9 | Proposed 5 zones | Folds in |
|---|---|---|
| Upcoming Plans · Saved Collections · Trips · Events · Tickets · Reservations · Bookings · Recommendations · Activity | **Upcoming · Trips · Saved · For You · Activity** | Upcoming = Plans + Reservations + Bookings + Tickets + your Events · Trips = itinerary workspace · Saved = Collections · For You = Recommendations · Activity = history |

Notion-OS = fewer, richer surfaces. Maps onto existing routes `/trips`, `/saved`, `/me/tickets`.

---

## 5. Improvements (ranked)

| # | Improvement | Why it matters (persona) | Effort | Impact |
|---|---|---|:---:|:---:|
| 1 | **Protect the MVP path — don't let the OS redesign defer Roberto** (see §6) | Phase-1 hero is Roberto's host publish + Camila's rentals; 4 North-Star surfaces are unfinished | — | 🔴 critical |
| 2 | **Resolve charcoal → light** (Decision 1) | Going dark re-skins everything already built light | Low | High |
| 3 | **Drop emerald, hold 2 colors** (Decision 2) | Keeps the Wanderlog restraint you asked for | Low | Med |
| 4 | **Elevate the map to co-primary with the concierge** | Living chat↔map↔card sync is the #1 Mindtrip moat (design-plan Part 6); your list buries it at section 8 | Med | High |
| 5 | **Add a ⌘K command palette** as the OS signature interaction | This is the "operating system" tell (Notion/Linear); ⌘K → launch concierge / jump anywhere | Med | High |
| 6 | **Consolidate Explore tabs 9→6 and Dashboard 9→5** (§4.3–4.4) | Fewer surfaces, more concierge; fixes mobile tab overflow | Low | Med |
| 7 | **First-run / empty states on every OS surface** | An OS lives on first-run: a new user with no trips/saved → the concierge fills the void, never a blank panel | Med | Med |
| 8 | **Responsive "always-on" concierge** | "Permanently visible" can't be a fixed column on mobile — collapse to a bottom-sheet / FAB | Med | Med |
| 9 | **Re-add Trust strip + Host band to Home** (§4.2) | Trust = conversion; Host band = revenue (Roberto) | Low | Med |
| 10 | **Photography is gated on the Places proxy** | Photography=100 only if real photos land; until then the pale-teal `#E1F6F2` placeholder holds — never a broken-image box | Low | Med |

---

## 6. The MVP guardrail (read before sequencing)

The vision is **consumer-side** (Camila/Tourist) and its build order defers **Verticals + Host to Phase 4.** But:

- **CLAUDE.md Phase-1 hero = Roberto** creating an event at `/host/event/new` (revenue-bearing), plus Camila's rentals + chat.
- **`design-plan.md` Part 8 flags four unfinished North-Star surfaces:** `/rentals` cards broken since 05-27 · `/rentals/[id]` missing · checkout→finalize unproven · `/restaurants` undeployed (prod 404).

> **Guardrail:** the Concierge OS is the right *destination*, but it must not detour us from the four broken North-Star surfaces or the host publish flow. **Design is not the bottleneck — completion is.** Ship the OS *framing* incrementally on top of finished surfaces; don't pause revenue work for a re-skin.

---

## 7. Component strategy + links

3 layers: **shadcn primitives → 21st premium sections → custom.** Tokens already match, so zero theme migration. (Links are shadcn-canonical or ones you sent.)

| OS surface | Layer | Component | Link | Score |
|---|---|---|---|---:|
| App shell / sidebar | shadcn | `sidebar` | https://ui.shadcn.com/docs/components/sidebar | 90 |
| **⌘K command palette** | shadcn | `command` (CommandDialog) | https://ui.shadcn.com/docs/components/command | 92 |
| Top nav + mobile drawer | shadcn | `navigation-menu` + `sheet` | https://ui.shadcn.com/docs/components/navigation-menu | 88 |
| Explore tabs | shadcn | `tabs` | https://ui.shadcn.com/docs/components/tabs | 86 |
| Hero | 21st | `animated-hero-section-1` | https://21st.dev/community/components/Codehagen/hero-badge/default | 88 |
| AI concierge (chat) | **custom** | CopilotKit v1 reuse (visual ref: `bolt-style-chat`) | https://21st.dev/community/components/Abuhuraira/bolt-style-chat/default | reuse |
| Card carousels / rows | shadcn + 21st | `carousel` · `gallery4` | https://ui.shadcn.com/docs/components/carousel · https://21st.dev/community/components/shadcnblockscom/gallery4/default | 86 |
| Dashboard cards | 21st + shadcn | `card-21` · `card` | https://21st.dev/community/components/ravikatiyar/card-21/default | 84 |
| CTA band | 21st | `call-to-action-cta` | https://21st.dev/community/components/kavikatiyar/call-to-action-cta/default | 84 |
| Auth | 21st | `sign-in` (you liked this) | https://21st.dev/community/components/muditgoel1512/sign-in/default | 85 |
| Footer | 21st | `large-name-footer` | https://21st.dev/community/components/arihantcodes/large-name-footer/default | 84 |
| Toasts | shadcn | `sonner` | https://ui.shadcn.com/docs/components/sonner | 80 |
| **Map · Trips · Saved · VenueCard · Concierge** | **custom** | `@vis.gl/react-google-maps` (mapId) + our components | — | build |

**P0 install set (missing primitives):** `npx shadcn@latest add tabs command avatar carousel sonner sidebar`.

---

## 8. Scorecard — your scores vs. MDE-fit reality

| Surface | Your score | MDE-fit | Reality check |
|---|---:|---:|---|
| Home | 95 | **88** | Strong; re-add Trust + Host bands, elevate map |
| **Explore (flagship)** | 99 | **95** | Right call to make it primary; cut 9 tabs → 6 |
| Dashboard | 98 | **92** | "OS not analytics" is excellent; merge 9 → 5 zones |
| Visual system | — | **locked** | Light-luxury already shipped; resolve charcoal (Dec 1) |

**Premium-lever ranking (yours) — agreed:** Photography 100 · Typography 98 · Spacing 97 · Hierarchy 96 · Consistent cards 95 · AI explanations 95 · Micro-interactions 92 · Animations 85. (Photography is gated on the Places photo proxy — improvement #10.)

---

## 9. Revised build order (protects the MVP)

```
Track A — REVENUE (do not pause): fix /rentals cards → /rentals/[id] → checkout finalize → deploy /restaurants → /host/events
Track B — OS FRAMING (layer on as A completes):
  Phase 1  Home polish      hero + concierge input + categories + trending + trust + host + CTA
  Phase 2  Explore flagship always-on concierge + 6 tabs + cards + living map sync + ⌘K
  Phase 3  Dashboard OS     Upcoming · Trips · Saved · For You · Activity (no charts)
  Phase 4  Vertical depth   Eat · Nightlife · Stay detail pages + collections
```

The two tracks interleave; Track A is North-Star, Track B is the experience wrapper. Never let B block A.

---

## 10. Open decisions (need your call)

1. **Background — light (recommended) vs. charcoal?** Gates whether anything gets re-skinned. *(Decision 1)*
2. **Success color — drop emerald (recommended) vs. keep a single booking-confirmed green?** *(Decision 2)*
3. **Events — top-level nav (recommended) vs. inside Explore?** (It owns a distinct host/buyer flow.)
4. **Approve the consolidations?** Explore 9→6 tabs, Dashboard 9→5 zones.

> Once 1–2 are answered I can: (a) fold this into `home-wireframe.html` + a new `explore-wireframe.html` + `dashboard-wireframe.html`, and (b) run the P0 shadcn install and compose the real shell (sidebar + ⌘K + nav).
