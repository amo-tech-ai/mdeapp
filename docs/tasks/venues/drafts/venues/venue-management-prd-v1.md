---
doc_id: VENUE-PRD-V1
title: Venue management — product requirements (mdeai Events)
version: 1.0.0
date: 2026-05-17
status: Draft — extends Events pillar; does not replace ticketing/contests PRDs
pillar: Events + Tickets (Pillar 2)
---

# Venue management PRD v1

## 0. Executive summary

**mdeai venue management** is **not** a standalone VenuePro competitor on day one. It is the **operational layer** that connects **where an event happens** to **how organizers sell tickets, run door ops, and (later) run contests and sponsors at that place**.

**MVP (2026 Q2–Q3):** Pick or create a venue in the host wizard, enrich with **Google Places (New)**, show venue on event detail + map, link to **Stripe ticketing** and **QR scan** — using existing `event_venues` + **EVT-039–044**.

**Core (post–Phase 1 gate):** Organizer-owned venue library, availability blocks, resources (AV/catering), staff roster, layouts — archive tasks **036–042**.

**Enterprise (later):** Multi-venue operators, B2B booking contracts, public booking portal — only when volume justifies.

**AI:** **Propose-only** — layouts, pricing hints, staffing suggestions via Mastra; **edges** persist; OpenClaw runs **approved** WA/reminders.

---

## 1. Problem & users

### 1.1 Who uses this daily?

| Persona | Job | Venue pain today |
|---------|-----|------------------|
| **Sofía (organizer)** | Runs pageants, concerts, corporate events | Re-types address every event; double-books rooms; chases AV on WhatsApp |
| **Venue manager** (Phase 2+) | Owns the physical space | Needs calendar, resources, staff — not in MVP |
| **Camila (buyer)** | Finds event + buys ticket | Needs clear location, parking, “dinner nearby” |
| **Roberto (door)** | Scans QR | Needs venue name on scanner UI, offline tolerance |
| **Sponsor rep** (Phase 3) | Brand at venue | Foot traffic narrative — Hermes + dashboard |

### 1.2 What competitors optimize for

Industry platforms (Momentus, iVvy, VenuePro, Cvent, Zoho Backstage, Artifax) optimize for:

- **Sales pipeline** — tour scheduling, proposals, contracts  
- **Resource calendar** — rooms, equipment, catering holds  
- **Banquet event orders (BEO)** — F&B + AV line items  
- **Floor plans** — drag-drop seating  
- **Financial ops** — invoicing, payment plans  

**mdeai differentiator:** Same stack as **tickets + contests + sponsors + WA growth** — venue is the **geo and ops hub** for the whole Event OS, not a siloed venue CRM.

---

## 2. Layer cake (mandatory)

```text
(7) OpenClaw     — approved reminders, finals ops, sponsor digests (NOT venue booking authority)
(6) Hermes       — utilization features, foot-traffic scoring (read-only)
(5) Mastra       — layout proposals, concierge “how do I get there?”, staffing suggestions
(4) Gemini       — structured proposals (captions, layout JSON drafts)
(3) Maps/Places  — discovery, place_id, routes, nearby POIs (EVT-039–044, PLACES-016–078)
(2) Edges        — venue CRUD validation, booking race safety (future), geocode cache
(1) Supabase     — event_venues, events.venue_id, RLS, Realtime dashboards
```

**Votes, money, check-ins:** Layer (1)–(2) only. Mastra/OpenClaw **never** double-book a room without edge `EXCLUDE` constraint.

---

## 3. Current repo state (truth)

| Asset | Status |
|-------|--------|
| `public.event_venues` | **Live** in migration `20260503011925_event_phase1.sql` |
| `events.venue_id` FK | **Live** |
| Seed venues (Medellín) | **Live** `20260513100000_seed_medellin_events_h2_2026.sql` |
| `places_cache` / `google_place_id` on events | **Partial** — maps train |
| Host wizard venue picker UI | **Not shipped** — EVT-039 |
| `/host/venues` management | **Not shipped** — archive 039 |
| Availability / bookings / layouts tables | **Not shipped** — archive 038–041 |

**Do not** implement archive **035–044** as primary queue — use **EVT-039–044** for maps-integrated picker first.

---

## 4. Scope by phase

### 4.1 MVP — “Venue on the event” (EVT-039–044)

**Goal:** Every published event has a trustworthy **place** (name, address, lat/lng, `place_id`, map pin).

| Feature | Acceptance criteria |
|---------|---------------------|
| Venue picker in wizard | Organizer selects saved venue or creates inline; `events.venue_id` set |
| Places Autocomplete (New) | Server-side PLACES-018; session token; field mask |
| Persist `placeUri` | EVT-042; no hand-built Google URLs |
| Event detail map | Advanced Markers + Map ID (EVT-043) |
| Nearby cards | Restaurants/attractions for attendees (EVT-044) |
| RLS | Organizer owns venues; public read only for published events’ venues |

**Out of MVP:** Room-level booking, BEO, invoicing, public venue marketplace.

### 4.2 Core production — “Venue library + ops” (archive 036–042)

| Feature | Source task | Value |
|---------|-------------|-------|
| Resource inventory (AV, catering, furniture) | 036 | Stop spreadsheet chaos |
| Venue staff roster | 037 | Door + AV contacts per venue |
| Availability windows + iCal | 038 | Block double-booking |
| `/host/venues` UI (4 tabs) | 039 | Daily ops home for repeat organizers |
| Floor plans / zones | 040 | Galas, pageants |
| Race-safe bookings `EXCLUDE gist` | 041 | **Deterministic** conflict prevention |
| Utilization analytics | 042 | Revenue per venue-hour |

### 4.3 Enterprise

- Multi-org venue chains  
- Public “book this venue” portal  
- E-sign contracts + payment schedules (reuse sponsor contract patterns)  
- PMS integrations (hotels) — partner API only  

### 4.4 Explicitly deferred (per index-events)

- Online booking portal for anonymous clients  
- Full venue-side CRM  
- AI demand forecasting (&lt;6 months data)  
- Separate AI resource allocator (folded into archive 043 optimizer)

---

## 5. Functional domains (industry breakdown)

| Domain | MVP | Core | Enterprise | mdeai owner |
|--------|-----|------|------------|-------------|
| Venue booking | Link event→venue | Internal holds | Public booking | Edge + SQL |
| Room/resource scheduling | — | 036, 038, 041 | Multi-site | Postgres |
| Event venue operations | Wizard picker | 039 dashboard | — | React + Realtime |
| Venue CRM | — | Organizer notes | — | `event_venues.notes` |
| Attendee logistics | Event address + map | — | — | EVT-044 nearby |
| Catering coordination | — | Resources type=catering | BEO export | Phase 3 |
| AV/equipment | — | Resources | — | 036 |
| Floor plans | — | 040 | — | Storage + JSON |
| Staffing | Event staff links (tickets) | Venue staff 037 | — | Separate from Roberto scan |
| Contracts/invoicing | — | — | Sponsor patterns | Phase 3 |
| Sponsor integrations | Event page placement | Foot traffic Hermes | ROI dashboard | sponsor.* |
| Analytics | Event sales | 042 utilization | — | SQL + dashboard |
| Mobile ops | Staff PWA scan | Host mobile venues | — | EVT-036–037 |
| Comms | — | WA reminders | — | OpenClaw |
| Multi-venue | — | Org filter | Chain admin | RLS by org |
| Realtime dashboards | Host event KPIs | Venue tab KPIs | — | Supabase Realtime |

---

## 6. Integration with Events + Tickets

```text
event_venues ──< events.venue_id
events ──< event_tickets ──< event_orders ──< event_attendees ──< event_check_ins
```

- **Ticket buyer** sees venue on `/events/:slug` + map panel.  
- **QR validate** does not need room ID for MVP — venue-level is enough.  
- **Contest finals** link `vote.contests.event_id` → same venue row for backstage ops ([`prdv2-contest.md`](../contests/prdv2-contest.md) §2.10).

---

## 7. AI policy (venue-specific)

| Use case | Mastra | Edge | OpenClaw |
|----------|--------|------|----------|
| Suggest layout zones | Proposal JSON | Apply → 040 | — |
| Suggest date given inquiry | Proposal | 041 booking RPC | — |
| “Where to park?” | Concierge + maps tools | Read-only | — |
| Pricing hint weekend premium | Proposal | Organizer sets price | — |
| No-show risk narrative | Hermes feature | 070 attendance | Reminder send |
| Daily utilization summary | Analytics agent | — | Email/WA digest |

**Never:** AI confirms booking without edge; AI changes `event_venues` without user Apply.

---

## 8. Success metrics

| Phase | Metric | Target |
|-------|--------|--------|
| MVP | Events with `venue_id` + lat/lng | ≥ 95% published events |
| MVP | Places Autocomplete P95 | &lt; 500ms server |
| Core | Double-booking incidents | 0 per 1000 holds |
| Core | Organizer repeat venue reuse | ≥ 40% 2nd event |
| AI | Layout proposal accept rate | ≥ 25% |
| Ops | WA reminder delivery | ≥ 95% (OpenClaw soak) |

---

## 9. Risks & failure points

| Risk | Mitigation |
|------|------------|
| Building full VenuePro before tickets ship | **Gate:** G1–G5 before core venue OS |
| Colombia `generativeSummary` empty | Offline Gemini `ai_summary` in places_cache |
| Map ID missing in prod | EVT-068 / MASTRA-068 blockers |
| AI double-book | `EXCLUDE gist` + edge-only writes |
| Scope creep 035–044 vs EVT | README routing table |
| WA spam at venue reminders | OpenClaw approval + templates |

---

## 10. Implementation phases (summary)

See [**venue-roadmap.md**](./venue-roadmap.md). Order:

1. **EVT-039–044** (maps venue spine)  
2. Archive **036–038** (resources, staff, availability)  
3. Archive **039–042** (UI + layouts + bookings + analytics)  
4. Archive **043–044** AI edges (propose-only)  
5. Mastra venue agents ([**venue-agents-architecture.md**](./venue-agents-architecture.md))  
6. OpenClaw venue ops ([**venue-automation-strategy.md**](./venue-automation-strategy.md))  

---

## 11. Related deliverables

| File | Content |
|------|---------|
| [venue-feature-matrix.md](./venue-feature-matrix.md) | Full feature grid |
| [venue-workflows.md](./venue-workflows.md) | Operational workflows |
| [venue-use-cases.md](./venue-use-cases.md) | Vertical scenarios |
| [venue-maps-integration.md](./venue-maps-integration.md) | Google Maps architecture |
| [venue-agents-architecture.md](./venue-agents-architecture.md) | Mastra design |
| [venue-ai-opportunities.md](./venue-ai-opportunities.md) | AI catalog |
| [venue-automation-strategy.md](./venue-automation-strategy.md) | OpenClaw + WA |

---

## 12. Sources (industry research)

- [VenuePro](https://www.venuepro.co/venue-management-software) — booking, layouts, BEO  
- [iVvy](https://www.ivvy.com/) — venue + event unified calendar  
- [Momentus — venue software guide](https://gomomentus.com/blog/what-is-venue-and-event-management-software)  
- [Momentus — AI era](https://gomomentus.com/blog/navigating-venue-and-event-management-in-the-ai-era)  
- [Cvent — 29 AI uses for venues](https://www.cvent.com/en/blog/hospitality/29-ways-use-ai-venue-and-event-management)  
- [Zoho Backstage — venue management](https://www.zoho.com/backstage/event-venue-management.html)  
- [Artifax — event/venue features](https://artifax.com/features/event-management/)  
- [Eventtia — AI transforming venues](https://www.eventtia.com/10-ways-ai-is-transforming-how-venues-manage-events/)  
- [Rookoo — AI venue operations](https://rookoo.ai/en/blog/how-venues-can-leverage-ai-to-transform-event-operations)  
- [Tagvenue — venue mistakes](https://www.tagvenue.com/blog/venue-management-mistakes-to-avoid/)  
- [12 must-have components — EBE](https://www.eventbookingengines.com/blog/view.php?slug=12-must-have-components-venue-management-software)  

Platform docs: [`CLAUDE.md`](../../../CLAUDE.md), [`prd.md`](../../../prd.md) §2.2, [`events-prd-v2-mastra-maps-automation.md`](../events-prd-v2-mastra-maps-automation.md).
