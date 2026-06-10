---
title: "MDE Information Architecture + User Journey (D-01)"
updated: 2026-06-05
author: design synthesis (grounded in concierge-os-direction.md · design-process.md · sitemap.md · CLAUDE.md hard rules)
status: FOUNDATION doc — the architecture locked before colors (review #1: "users don't care about colors yet")
linear: SAN-567 (epic SAN-566 · project UX · labels track:ux + scr)
related:
  - ./concierge-os-direction.md       # product framing — the AI is the center
  - ./design-process.md               # the lean process — §3.1 domains, §3.2 scroll order, §3.3 Explore layout
  - ../wireframe/explore-wireframe.html # the flagship wireframe this doc specs (D-05)
  - ../../../sitemap.md               # the 53-route status table — the build reality
  - ../../../DESIGN.MD                # visual tokens (light-luxury, locked)
sources: concierge-os-direction.md · design-process.md · sitemap.md (verified 2026-06-05) · globals.css :root
---

# MDE Information Architecture + User Journey

> **One-line verdict:** The app is **five domains around one AI spine**, not a pile of pages. The concierge is the center; every surface is a place it can drop you into or pull you out of. Architecture is the expensive thing to get right — this doc locks it **before** we touch a single colour. **The Explore flagship is a re-skin of the existing vertical routes, NOT a new `/explore` page.**

---

## 0. Locked architecture decisions

| Decision | Locked value | Source |
|---|---|---|
| **The spine** | The AI concierge, not a search bar. Journey = `Concierge → Discover → Save → Plan → Book → Return`. | concierge-os §1 |
| **Domains** | **Five:** Dashboard (manage) · Explore (discover, flagship) · Concierge (plan, cross-cutting) · Maps (visualize, cross-cutting) · Profile (memory = F13). | process §3.1 |
| **Nav** | **5 primary** (Home · Explore · Trips · Saved · Events) + **avatar menu** (Profile · Tickets · Settings · Sign out). | concierge-os §4.1 |
| **Explore = a system, not a route** | Re-skin the **existing** verticals (`/restaurants`, `/cafes`, `/nightlife`, `/rentals`) into one shared browse system. **Do NOT build a greenfield `/explore`.** | sitemap.md (no `/explore` route exists) |
| **Tabs** | Explore consolidates **9 → 6** (For You · Eat · Do · Nightlife · Events · Stay). Dashboard consolidates **9 → 5** zones. | concierge-os §4.3–4.4 |
| **Scroll order** | Named editorial rhythm (8 bands), not a random stack. | process §3.2 |

---

## 1. The user journey — the AI is the spine

Competitors run a funnel: `Search → Results → Booking`. MDE runs a **loop** with the concierge at the center:

```
        ┌──────────────────────────────────────────────┐
        │                                              ▼
   ✦ AI CONCIERGE ──▶ Discover ──▶ Save ──▶ Plan ──▶ Book ──▶ Return
        ▲                                                        │
        └────────────────────────────────────────────────────────┘
```

| Step | What the user does | Surface | Persona moment |
|---|---|---|---|
| **Concierge** | Asks in plain language ("rooftop bars in Provenza tonight") | AI band on Home + Explore · `/chat` · FAB everywhere | Camila opens the app and the AI offers to plan — not a blank search box |
| **Discover** | Browses grounded results + map | Explore (re-skinned verticals) + living map | Tourist sees real Medellín places **on the map**, not a list of links |
| **Save** | Hearts a place into a collection | `<VenueCard>` ♡ → `/saved` | Camila builds a Provenza shortlist across sessions |
| **Plan** | Assembles saved things into a day/trip | `/trips` workspace | Camila turns 6 saved spots into a Saturday |
| **Book** | Buys a ticket / commits | Stripe checkout · `/me/tickets` | Andrés pays for an event; Roberto's the host who published it |
| **Return** | Comes back; the AI remembers | F13 working memory feeds the concierge | Turn 11 still knows turns 1–10 — the moat rivals fake |

> **Why the loop matters:** the moat is **Mastra working-memory + thread persistence + hyper-local Medellín grounding**. The IA exists to make the concierge the spine, so memory compounds every lap of the loop. A funnel forgets you at "Booking"; the loop brings you back smarter.

---

## 2. The five product domains

The app is not "pages" — it's five domains, each with one job. Concierge and Maps are **cross-cutting** (woven into the others), which is exactly what keeps the AI "in the center" instead of bolted on as a 6th menu tab.

| Domain | Job | Contains | Lives at (existing routes) | Persona |
|---|---|---|---|---|
| **Dashboard** | Manage your life | trips · tickets · saved · upcoming plans | `/me` · `/trips` · `/saved` · `/me/tickets` | Camila · Andrés |
| **Explore** *(flagship)* | Discover | verticals + AI + map, one shared browse system | `/restaurants` · `/cafes` · `/nightlife` · `/rentals` | Camila · Tourist |
| **Concierge** *(cross-cutting)* | Plan | the AI itself — chat, suggestions, HITL approval | `/chat` (alias → `/`) + embedded FAB **everywhere** | all |
| **Maps** *(cross-cutting)* | Visualize | the spatial layer — pins synced to cards, hover ↔ pin | embedded in Explore + `/chat` | Camila · Tourist |
| **Profile** | Memory | who you are, prefs, history → feeds the AI | `/me` + **F13 working memory** | all |

> **"Profile = Memory" is literally F13 working memory** — the AI remembering Camila across turns and sessions. Naming it a *domain* (not a settings page) is the point: it's the thing that makes the concierge feel personal. **Concierge + Maps are surfaces, not tabs** — they appear inside Explore and Dashboard, never as standalone nav items.

---

## 3. Navigation map

### 3.1 Primary nav — 5 items

| Tier | Items | Rationale |
|---|---|---|
| **Primary (5)** | Home · **Explore** · Trips · Saved · Events | Explore is the flagship; Events stays top-level because it owns a distinct **host → buyer** flow (Roberto → Andrés) |
| **Avatar menu** | Profile · **Tickets** · Settings · Sign out | Tickets = "my committed things" — lives under the person, not the global bar |
| **⌘K** | Command palette | The OS signature interaction — launch the concierge / jump anywhere (Notion/Linear tell) |

**Deliberately NOT in nav:** Restaurants · Cafés · Nightlife · Rentals. Those are **discovery categories inside Explore** (the 6 tabs), not top-level destinations. Putting them in the bar would shatter "the AI is the center" into a manual-filter menu.

`component:` shadcn `navigation-menu` (top) + `sheet` (mobile drawer) + `command` (⌘K).

### 3.2 The route-reskin lock — **no new `/explore`**

Verified against `sitemap.md` (2026-06-05): **there is no `/explore` route, and we are not creating one.** "Explore" is the **shared browse *system*** (AI band + 6 tabs + `<VenueCard>` + living map) applied by re-skinning the verticals that already exist:

| Tab | Re-skins existing route(s) | Sitemap status today |
|---|---|---|
| **For You** | personalized feed across all verticals (Home's discovery rows) | composed |
| **Eat** | `/restaurants` (+ `/cafes`) | `/restaurants` ✅ LIVE · `/cafes` ⚠️ SHELL |
| **Do** | things-to-do / attractions | composed from grounded places |
| **Nightlife** | `/nightlife` | ✅ LIVE |
| **Events** | events browse (top-level too) | — |
| **Stay** | `/rentals` | 🔵 MVP P0 (redirects to `/chat` today) |

> **Why this is the right call:** the app is **~78% built**, not greenfield. A new `/explore` route would orphan the work already shipped on `/restaurants` and `/nightlife` and duplicate the card/map system. Re-skin > rebuild. (This also reconciles the one stale note in `design-process.md §3.1`, which optimistically listed `/explore (new)` — the build reality is re-skin.) *Locations* becomes a **map/neighborhood filter**, not a tab; *Guides* becomes secondary content in the For-You feed.

---

## 4. Section patterns — scroll storytelling

Every long surface (Home, Explore, Dashboard) is a **named editorial rhythm**, not a random stack. Canonical order (latent in `home-wireframe.html`, made explicit here so build order is unambiguous):

```
① Curated For You  →  ② Restaurants  →  ③ Tonight in Medellín  →  ④ Events This Weekend
   →  ⑤ Luxury Stays  →  ⑥ Neighborhood Intelligence  →  ⑦ Saved Collections  →  ⑧ Upcoming Plans
```

**Premium section formula** — every discovery band is built the same way (the definition of "a section"):

```
┌─ Headline            "Restaurants in Provenza"        (editorial display type)
├─ Description         one line of context / why-now
├─ View all →         right-aligned, teal --primary
├─ Cards              the shared <VenueCard> row (image · name · ★ rating · 2-line clamp · Why line)
└─ ✦ AI Insight       one GROUNDED sentence, gold ✦ signature
```

> **The AI Insight must be GROUNDED, never fabricated.** Derive it only from real signals the app has (saved places, current time, neighborhood, vertical). Degrade gracefully — **no signal → hide the line**, never hallucinate.
> - ✅ **Grounded:** *"Because you saved 3 spots in Provenza, these are a 5-min walk."*
> - 🔴 **Fabricated:** *"Most users who save Provenza nightlife also visit these restaurants."* — there is no co-visitation dataset at MVP; this invents data.

---

## 5. Explore — the flagship layout (AI in the center)

The flagship is **not** "cards with a search box." The concierge is a full-width band *above* the split, so the first thing Camila sees is the AI offering to plan — then results + map below. Full spec + component map: **[`explore-wireframe.html`](../wireframe/explore-wireframe.html)** (D-05).

```
┌──────────────────────────────────────────────────────┐
│ Top nav  (nav-menu + sheet + ⌘K command)              │
├──────────────────────────────────────────────────────┤
│ Vertical tabs  For You · Eat · Do · Nightlife ·       │  ← shadcn `tabs` (P0 install)
│   Events · Stay                                       │
├──────────────────────────────────────────────────────┤
│ ✦  AI CONCIERGE BAND   (full-width)                   │  ← CopilotKit v1 reuse; gold ✦ signature
│    "Ask me to plan your evening in Provenza…"         │     THE CENTER — not a search bar
├──────────────────────────────────────────────────────┤
│ Filter / sort bar  Price · Neighborhood · Open now    │  ← secondary; Locations lives here
├───────────────────────────────┬──────────────────────┤
│ RESULTS  (cards, scroll)      │  MAP  (sticky)        │  ← <VenueCard> list │ @vis.gl, mapId
│   §4 premium sections         │  hover ↔ pin sync     │     pins drop as results stream
└───────────────────────────────┴──────────────────────┘
Mobile:  AI band → sticky input + concierge FAB;  map → toggle button (not side-by-side).
```

### 5.1 Explore tabs — 9 → 6

| Old 9 tabs | New 6 | Why |
|---|---|---|
| For You · Restaurants · Things To Do · Events · Nightlife · Stays · Rentals · Locations · Guides | **For You · Eat · Do · Nightlife · Events · Stay** | Eat = restaurants + cafés · Do = things-to-do · Stay = rentals + stays · **Locations → a map filter** · **Guides → secondary** in the For-You feed |

Let the concierge do the narrowing the extra tabs would. Fewer tabs, more AI, no mobile overflow.

---

## 6. Dashboard — the OS, not analytics. 9 → 5 zones

The Dashboard is a personal **operating system** (Notion-OS feel) — **no charts, no SaaS metrics**. Three of the original nine are the same concept under different names (Tickets / Reservations / Bookings = "things I committed to"):

| Old 9 | New 5 zones | Folds in |
|---|---|---|
| Upcoming Plans · Saved Collections · Trips · Events · Tickets · Reservations · Bookings · Recommendations · Activity | **Upcoming · Trips · Saved · For You · Activity** | Upcoming = Plans + Reservations + Bookings + Tickets + your Events · Trips = itinerary workspace · Saved = Collections · For You = Recommendations · Activity = history |

Maps onto existing routes `/me`, `/trips`, `/saved`, `/me/tickets`. **First-run matters most:** a new user with no trips/saved sees the concierge fill the void, never a blank panel. Full spec: D-06 `dashboard-wireframe.html` (next).

---

## 7. The MVP guardrail (read before sequencing)

This IA is **consumer-side** (Camila/Tourist), but the Phase-1 hero per CLAUDE.md is **Roberto** publishing an event (revenue) + Camila's rentals + chat. `design-plan.md` Part 8 flags four unfinished North-Star surfaces: `/rentals` cards (broken since 05-27) · `/rentals/[id]` (missing) · checkout→finalize (unproven) · `/restaurants` (prod 404 until deploy).

> **Guardrail:** this architecture is the right *destination*, but it ships **incrementally on top of finished surfaces** — it does **not** pause revenue work for a re-skin. **Design is not the bottleneck — completion is.** Track A (revenue) leads; this IA + the re-skin ride alongside (the two-track model, process §7).

---

## 8. What this doc locks (handoff)

| Locked | Value | Consumed by |
|---|---|---|
| Spine | AI concierge loop (Concierge → Discover → Save → Plan → Book → Return) | every surface |
| Domains | 5 (Dashboard · Explore · Concierge · Maps · Profile) | wireframes |
| Nav | 5 primary + avatar menu + ⌘K | top-nav build |
| Route model | **re-skin verticals, no new `/explore`** | Explore re-skin |
| Tabs | Explore 6 · Dashboard 5 zones | `explore-wireframe.html` · `dashboard-wireframe.html` |
| Scroll order | 8 named bands + premium formula (grounded AI Insight) | every discovery surface |

→ **Next in the chain:** the flagship wireframe (`explore-wireframe.html`, done), `design-system.md` (tokens), `images.md` (photography), then `dashboard-wireframe.html`.
