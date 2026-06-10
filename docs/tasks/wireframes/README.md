---
title: mdeai Wireframe Set — index, navigation map, priority
date: 2026-05-31
produced_with: .agents/skills/mde-wireframe (Route C — ASCII spec)
fidelity: low-fi / structural (pre-build; not production mdeapp/src)
locale: English only (Phase 1)
companions:
  - plan/competitors/12-mdeai-blueprint.md (product/design blueprint)
  - plan/competitors/13-guidegeek.md (GuideGeek teardown)
  - plan/screens/01-screens-plan.md · 02-chat-booking.md (existing screen plans)
---

# mdeai Wireframe Set

Low-fidelity, structural wireframes for **mdeai.co** — the AI-powered Medellín concierge & intelligence platform (rentals · restaurants · nightlife · events · local discovery), web-`/chat`-first now, WhatsApp-native in Phase 2.

These are **pre-build specs** (ASCII + component inventory + states), not production code. They align to `CLAUDE.md` hard rules, the personas (Camila, Roberto, Tourist, Andrés, Patricia, broker/venue), and the CTA strategy (**Schedule viewing / Buy tickets**, never external-OTA-primary).

## Files

| File | Covers (of the 20 requested screens) |
|---|---|
| [00-foundations.md](00-foundations.md) | Design system (dark/light, type, grid, motion), reusable components, conversational components, map patterns, **#18 recommendation cards**, **#19 search/filter layouts**, global states |
| [01-marketing.md](01-marketing.md) | **#1 Homepage**, **#2 AI concierge landing** |
| [02-discovery.md](02-discovery.md) | **#3 Restaurant discovery**, **#4 Rental discovery**, **#5 Nightlife/events** |
| [03-chat-maps-workspace.md](03-chat-maps-workspace.md) | **#7 Conversational search**, **#14 Concierge chat**, **#8 Maps+cards**, **#9 Trip workspace** |
| [04-detail-booking.md](04-detail-booking.md) | **#11 Restaurant detail**, **#12 Rental detail**, **#10 Booking workflow** |
| [05-whatsapp-mobile.md](05-whatsapp-mobile.md) | **#6 WhatsApp onboarding**, **#17 Mobile-first WhatsApp UI**, WA interaction patterns |
| [06-user-operator-dashboards.md](06-user-operator-dashboards.md) | **#13 Saved/dashboard**, **#20 AI memory/personalization**, **#15 Broker/venue dashboard**, **#16 Admin ops** |

## Navigation map

```text
PUBLIC / CONSUMER
  /                     Home (hero + concierge input + verticals + trust)
  /chat                 3-panel concierge (THE product) ── conversational search
   ├─ maps + cards (right panel / mobile bottom sheet)
   └─ trip workspace (saved → /trip/:id)
  /rentals              Rental discovery (list + map) → /rentals/:id
  /restaurants          Restaurant discovery → /restaurants/:id
  /nightlife            Nightlife + events discovery → /events/:id
  /saved                Saved places / collections / dashboard
  /me/tickets/:id       Ticket wallet (QR)
  /about · /partners · /login · /legal/*
  WhatsApp (QR/number)  Phase 2 transport onto same brain

HOST / SUPPLY
  /host/event/new       Roberto AI publish wizard (HITL)
  /host/events          Host dashboard (sales, payouts)
  /broker               Broker/venue dashboard (leads, listings, reservations)

OPS
  /admin                Patricia: leads · approvals · listings · observability
```

## Page hierarchy (depth)

```text
L0  /  (front door)
L1  /chat  ── /rentals  ── /restaurants  ── /nightlife  ── /saved
L2  detail: /rentals/:id  /restaurants/:id  /events/:id
L2  workspace: /trip/:id          L2  wallet: /me/tickets/:id
L1  supply: /host/event/new  /host/events  /broker
L1  ops: /admin/*
```

## Implementation priority (maps to docs/roadmap.md)

| # | Wireframe | Phase | Roadmap tie |
|---|---|---|---|
| 1 | `/chat` 3-panel + conversational search + maps+cards + rec cards | **MVP** | MAP-001→007, UX-010 |
| 2 | Rental discovery + rental detail + Schedule-viewing lead | **MVP** | F17/F41, RE-001 |
| 3 | Event detail → Stripe checkout → ticket wallet | **MVP** | EVT (O1) |
| 4 | Host event wizard (Roberto, HITL) | **MVP** | F33–F38 (O2) |
| 5 | Restaurant discovery + detail; nightlife/events | **MVP→**near | F19/F26 |
| 6 | Homepage + concierge landing | **MVP** (marketing shell) | UX-011 (proposed) |
| 7 | Saved/dashboard + trip workspace | Post-MVP | `trips` |
| 8 | AI memory/personalization screens | Post-MVP | profile |
| 9 | Broker/venue + admin dashboards | Post-MVP | F32 + new |
| 10 | WhatsApp onboarding + mobile WA UI | Post-MVP/Adv | Phase 2 transport |

## MVP vs Advanced (screen scope)

- **MVP screens:** Home, `/chat` (search+maps+cards+rec cards), rental discovery+detail, event detail+checkout+wallet, restaurant discovery+detail, nightlife list, host wizard. Light Saved hooks.
- **Post-MVP:** full Saved/collections dashboard, trip workspace, neighborhood pages, broker/venue dashboard, admin ops, AI memory/personalization UI.
- **Advanced:** WhatsApp prod onboarding + native WA renderer, voice intake, white-label theming.

## Competitor patterns — copy / avoid (one-screen summary)

| Source | Copy | Avoid |
|---|---|---|
| **GuideGeek** | zero-friction conversational onboarding; persona/white-label; acquire-through-partners; ≤3 picks per WA bubble | mapless replies; unverified prices; redirect-out booking; thread-only memory |
| **Airbnb** | card anatomy (photo carousel, ★count, **total price**, save heart); **price pins**; pill filters + map re-query; trust stack | filter walls; nightly-only price hiding totals |
| **Mindtrip** | persistent map + workspace as the product; saved collections; community filters; cold-start ramps | heavy upfront generation w/o streaming |
| **Google Maps** | mobile **bottom sheet** (peek/half/full); place sheet (photos/hours/popular times); list↔pin highlight | over-dense pins without clustering |
| **WhatsApp** | interactive buttons/lists, location pins, voice notes, template alerts | pasting web HTML; long walls of text |
| **ChatGPT** | streaming reveal; regenerate/edit; suggested follow-ups; clean message rhythm | infinite blank prompt with no ramps |

Full rationale: [plan/competitors/12-mdeai-blueprint.md](../../../plan/competitors/12-mdeai-blueprint.md) §3–4, [13-guidegeek.md](../../../plan/competitors/13-guidegeek.md) Part B.

## Confidence

- Layout/structure: **high** (grounded in existing 3-panel plan + competitor teardowns).
- Exact component names/data shapes: **medium** — mark TBD; reconcile with `plan/screens/` + `mdeapp/src/components/chat/chat-canvas.tsx` at build.
- Open questions: (1) left-rail vs top-nav on desktop `/chat`; (2) bottom-sheet vs split on tablet; (3) Saved as page vs right-panel tab for MVP.
