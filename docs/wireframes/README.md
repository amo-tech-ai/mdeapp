# AI-Native Marketplace — Wireframe Documentation
> Platform: Events · Rentals · Venues · Restaurants · Cafes · Nightlife · Sponsors · CRM  
> Stack: Next.js · CopilotKit · Mastra · Supabase · Stripe · Google Maps · Gemini  
> Updated: June 2026

---

## Vision

This is not Eventbrite + Airbnb glued together.  
This is **ChatGPT + Google Maps + Eventbrite + Airbnb + OpenTable** with AI workflows, agents, and automation.

```
Traditional flow:  User → Search → Filter → Browse → Form → Confirm → Done
AI-native flow:   User → Say intent → Agent plans → HITL approve → Done
```

---

## Directory Structure

```
wireframes/
├── README.md                         ← this file
├── AUDIT.md                          ← production readiness audit (v2: 93/100)
├── _layout/
│   ├── three-panel.md                ← core desktop layout
│   └── navigation.md                 ← nav structure + routing
├── _arch/
│   ├── agents.md                     ← agent design reference
│   ├── workflows.md                  ← workflow design reference
│   └── copilotkit.md                 ← CopilotKit feature map
├── auth/
│   ├── 001-login.md                  ← NEW v2
│   └── 002-signup.md                 ← NEW v2
├── consumer/
│   ├── 001-home.md
│   ├── 002-saved-items.md            ← NEW v2
│   ├── 003-user-profile.md           ← NEW v2
│   └── 004-explore-map.md            ← NEW v2
├── events/
│   ├── 001-event-discovery.md
│   ├── 002-event-details.md
│   ├── 003-event-checkout.md
│   └── 004-ticket-wallet.md
├── rentals/
│   ├── 001-rental-search.md
│   ├── 002-rental-details.md
│   └── 003-inquiry-viewing.md
├── venues/
│   ├── 001-venue-search.md
│   └── 002-venue-details.md
├── restaurants/
│   ├── 001-restaurant-search.md
│   └── 002-reservation.md
├── cafes/
│   └── 001-cafe-search.md
├── nightlife/
│   ├── 001-nightclub-discovery.md
│   └── 002-vip-booking.md
├── hosts/
│   ├── 001-host-dashboard.md
│   ├── 002-create-event.md
│   ├── 003-ticket-management.md
│   └── 004-attendee-management.md
├── rental-hosts/
│   ├── 001-rental-dashboard.md
│   └── 002-lead-management.md
├── venue-owners/
│   └── 001-venue-dashboard.md
├── sponsors/
│   ├── 001-sponsor-dashboard.md
│   └── 002-opportunity-discovery.md
├── crm/
│   └── 001-leads-pipeline.md
└── admin/
    ├── 001-ops-dashboard.md
    └── 002-analytics-dashboard.md
```

---

## Screen Inventory

| # | Screen | Path | User Type | Phase | Priority | v2 |
|---:|---|---|---|---|---|---|
| 1 | Login | `/login` | All | Core | P0 | ✅ NEW |
| 2 | Signup | `/signup` | All | Core | P0 | ✅ NEW |
| 3 | Home / AI Concierge | `/` | Consumer | Core | P0 | ✅ Updated |
| 4 | Saved Items | `/me/saved` | Consumer | Core | P1 | ✅ NEW |
| 5 | User Profile | `/me/profile` | Consumer | Core | P1 | ✅ NEW |
| 6 | Explore Map | `/explore` | Consumer | Core | P1 | ✅ NEW |
| 7 | Event Discovery | `/events` | Consumer | Core | P0 | — |
| 8 | Event Details | `/events/[slug]` | Consumer | Core | P0 | — |
| 9 | Event Checkout | `/events/[slug]/checkout` | Consumer | Core | P0 | — |
| 10 | Ticket Wallet | `/me/tickets` | Consumer | Core | P1 | — |
| 11 | Rental Search | `/rentals` | Consumer | Core | P0 | ✅ Updated |
| 12 | Rental Details | `/rentals/[id]` | Consumer | Core | P0 | — |
| 13 | Rental Inquiry | `/rentals/[id]/inquire` | Consumer | Core | P1 | — |
| 14 | Venue Search | `/venues` | Consumer | Core | P1 | — |
| 15 | Venue Details | `/venues/[id]` | Consumer | Core | P1 | — |
| 16 | Restaurant Search | `/restaurants` | Consumer | MVP | P1 | — |
| 17 | Cafe Search | `/cafes` | Consumer | MVP | P2 | — |
| 18 | Nightclub Discovery | `/nightlife` | Consumer | MVP | P2 | — |
| 19 | Host Dashboard | `/host` | Event Host | Core | P0 | ✅ Updated |
| 20 | Create Event | `/host/event/new` | Event Host | Core | P0 | — |
| 21 | Ticket Management | `/host/events/[id]/tickets` | Event Host | Core | P0 | ✅ Updated |
| 22 | Attendee Management | `/host/events/[id]/attendees` | Event Host | Core | P1 | ✅ Updated |
| 23 | Rental Dashboard | `/host/rentals` | Rental Host | Core | P1 | — |
| 24 | Venue Dashboard | `/host/venues` | Venue Owner | MVP | P1 | — |
| 25 | Sponsor Dashboard | `/sponsor` | Sponsor | MVP | P1 | — |
| 26 | CRM Leads Pipeline | `/admin/crm` | Admin/Host | MVP | P1 | ✅ Updated |
| 27 | Admin Ops Dashboard | `/admin` | Admin | MVP | P1 | — |
| 28 | Analytics Dashboard | `/admin/analytics` | Admin | MVP | P2 | — |

---

## Core Layout

All dashboard and discovery screens use the **three-panel layout**.  
See [`_layout/three-panel.md`](./_layout/three-panel.md) for the complete spec.

```
┌──────────────┬──────────────────────────────┬──────────────────┐
│  LEFT 280px  │      CENTER flex             │   RIGHT 360px    │
│  Navigation  │   AI Chat + Generative UI    │  Map + Details   │
│  Saved       │   Cards + Workflow progress  │  Forms + HITL    │
│  Memory      │   HITL Approval panels       │  Analytics       │
└──────────────┴──────────────────────────────┴──────────────────┘
```

---

## Phase Summary

| Phase | Screens | Agents | Workflows | Key Metric |
|---|---|---|---|---|
| **Core** (W1–4) | 1–10 | 5 | 3 | Roberto creates event in < 3 min |
| **MVP** (W5–10) | 11–22 | 8 | 6 | Camila books rental from chat |
| **Advanced** (W11–16) | 23–27+ | 12 | 10 | 30% of bookings from AI recommendations |

---

## AI Interaction Patterns

| Pattern | CopilotKit Hook | Example |
|---|---|---|
| Generative result cards | `useCopilotAction(render)` | Venue cards appear in chat |
| Live map pins | `useCoAgent` state update | Pins update as agent searches |
| HITL approval | `renderAndWaitForResponse` | "Publish event?" confirm card |
| Page-aware agent | `useCopilotReadable` | Agent knows current listing |
| Pre-filled forms | Working memory → form | Event form auto-populated |

---

*Cross-reference: [`../copilotkit-mastra/ai-native-marketplace-plan.md`](../copilotkit-mastra/ai-native-marketplace-plan.md)*
