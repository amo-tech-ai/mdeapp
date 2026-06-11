---
title: mdeai wireframes — master index
updated: 2026-06-10
canonical_path: docs/wireframes/
fidelity: low-fi ASCII + HTML mockups (pre-build; not mdeapp/src)
locale: English only (Phase 1)
---

# Wireframes — master index

**Start here.** This folder is the **single wireframe tree** for mdeai.co — platform shell, vertical browse, host/ops, mobile, and HTML mockups.

| Doc | Purpose |
|-----|---------|
| [README.md](README.md) | Legacy D-track overview (00–06), navigation map, MVP priority |
| [AUDIT.md](AUDIT.md) | Production-readiness audit (**93/100** v2, June 2026) |
| [screens/INDEX.md](screens/INDEX.md) | Platform shell scr/wire pairings + browse route status |
| [mobile/index-mobile.md](mobile/index-mobile.md) | Mobile task index (M1–M5) |
| [_layout/three-panel.md](_layout/three-panel.md) | Core 3-panel shell (chat + map + detail) |

**Related (outside this folder):** [`../design/wireframe/`](../design/wireframe/) · HTML token mockups (cafes · restaurants · nightlife) · [`../design/`](../design/) design improvement pack.

---

## Personas → surfaces

| Persona | Primary routes | Wireframe folders |
|---------|----------------|-------------------|
| **Camila** | `/`, `/chat`, `/rentals` | [consumer/](consumer/), [rentals/](rentals/), [real-estate/](real-estate/), [trips/](trips/) |
| **Tourist** | `/chat`, `/restaurants`, `/cafes`, `/nightlife` | [restaurants/](restaurants/), [cafes/](cafes/), [nightlife/](nightlife/), [venues/](venues/) |
| **Roberto** | `/host/event/new`, `/host/events` | [hosts/](hosts/), [events/](events/), [mobile/events/](mobile/events/) |
| **Andrés** | `/events/[slug]/checkout`, `/me/tickets` | [events/](events/), [015-wire-my-tickets-qr.md](015-wire-my-tickets-qr.md) |
| **Patricia** | `/admin/*` | [admin/](admin/), [crm/](crm/) |
| **Broker / venue** | `/broker`, venue dashboards | [venue-owners/](venue-owners/), [rental-hosts/](rental-hosts/), [sponsors/](sponsors/) |

---

## Layer 1 — Platform foundations (D-track)

Cross-cutting specs. Edit these before domain screens.

| File | Covers |
|------|--------|
| [00-foundations.md](00-foundations.md) | Design system, components, map patterns, cards, global states |
| [01-marketing.md](01-marketing.md) | Homepage, AI concierge landing |
| [02-discovery.md](02-discovery.md) | Restaurant, rental, nightlife/event discovery |
| [03-chat-maps-workspace.md](03-chat-maps-workspace.md) | Conversational search, `/chat`, maps+cards, trip workspace |
| [04-detail-booking.md](04-detail-booking.md) | Restaurant/rental detail, booking workflow → [`mobile/events/04-detail-booking.md`](mobile/events/04-detail-booking.md) |
| [05-whatsapp-mobile.md](05-whatsapp-mobile.md) | WhatsApp onboarding, mobile WA UI (Phase 2) |
| [06-user-operator-dashboards.md](06-user-operator-dashboards.md) | Saved, broker/venue, admin, AI memory |

**Layout & architecture**

| File | Covers |
|------|--------|
| [_layout/three-panel.md](_layout/three-panel.md) | Desktop 3-panel shell |
| [_layout/navigation.md](_layout/navigation.md) | Nav structure + routing |
| [_arch/agents.md](_arch/agents.md) | Agent design reference |
| [_arch/workflows.md](_arch/workflows.md) | Workflow design reference |
| [_arch/copilotkit.md](_arch/copilotkit.md) | CopilotKit feature map |

---

## Layer 2 — Domain wireframes (AI marketplace pack)

Route-level specs with states, data contracts, RLS notes. Grouped by vertical.

### Auth & consumer

| File | Route | Persona |
|------|-------|---------|
| [auth/001-login.md](auth/001-login.md) | `/login` | all |
| [auth/002-signup.md](auth/002-signup.md) | `/signup` | all |
| [consumer/001-home.md](consumer/001-home.md) | `/` | Camila, Tourist |
| [consumer/002-saved-items.md](consumer/002-saved-items.md) | `/me/saved` | Camila |
| [consumer/003-user-profile.md](consumer/003-user-profile.md) | `/me/profile` | Camila |
| [consumer/004-explore-map.md](consumer/004-explore-map.md) | `/explore` | Tourist |

### Events & tickets (Andrés · Roberto)

| File | Route |
|------|-------|
| [events/001-event-discovery.md](events/001-event-discovery.md) | `/events` |
| [events/002-event-details.md](events/002-event-details.md) | `/events/[slug]` |
| [events/003-event-checkout.md](events/003-event-checkout.md) | `/events/[slug]/checkout` |
| [events/004-ticket-wallet.md](events/004-ticket-wallet.md) | `/me/tickets` |
| [015-wire-my-tickets-qr.md](015-wire-my-tickets-qr.md) | QR wallet detail |

### Host ops (Roberto)

| File | Route |
|------|-------|
| [hosts/001-host-dashboard.md](hosts/001-host-dashboard.md) | `/host/events` |
| [hosts/002-create-event.md](hosts/002-create-event.md) | `/host/event/new` |
| [hosts/003-ticket-management.md](hosts/003-ticket-management.md) | host ticket tiers |
| [hosts/004-attendee-management.md](hosts/004-attendee-management.md) | attendee comms (HITL) |

### Rentals (Camila)

| File | Route |
|------|-------|
| [rentals/001-rental-search.md](rentals/001-rental-search.md) | `/rentals` |
| [rentals/002-rental-details.md](rentals/002-rental-details.md) | `/rentals/:id` |
| [rentals/003-inquiry-viewing.md](rentals/003-inquiry-viewing.md) | schedule viewing lead |
| [real-estate/009-wire-rental-search.md](real-estate/009-wire-rental-search.md) | rental search (scr pair) |
| [real-estate/009-scr-rentals-browse-page.md](real-estate/009-scr-rentals-browse-page.md) | browse page scr |
| [real-estate/017-scr-schedule-viewing-modal.md](real-estate/017-scr-schedule-viewing-modal.md) | viewing modal |

### Venues · restaurants · cafés · nightlife (Tourist)

| File | Route |
|------|-------|
| [restaurants/001-restaurant-search.md](restaurants/001-restaurant-search.md) | `/restaurants` |
| [restaurants.md](restaurants.md) | restaurants hub notes |
| [cafes/001-cafe-search.md](cafes/001-cafe-search.md) | `/cafes` |
| [cafes/cafes.md](cafes/cafes.md) | cafés hub notes |
| [nightlife/001-nightclub-discovery.md](nightlife/001-nightclub-discovery.md) | `/nightlife` |
| [nightlife/nightlife.md](nightlife/nightlife.md) | nightlife hub notes |
| [venues/001-venue-search.md](venues/001-venue-search.md) | venue search |
| [venues/002-venue-details.md](venues/002-venue-details.md) | venue detail |

### Trips · bookings · saved

| File | Route |
|------|-------|
| [trips/010-wire-booking-checkout.md](trips/010-wire-booking-checkout.md) | booking checkout |
| [trips/012-wire-trip-workspace.md](trips/012-wire-trip-workspace.md) | `/trip/:id` |
| [trips/014-wire-saved-collections.md](trips/014-wire-saved-collections.md) | saved collections |
| [trips/016-wire-explore-unified.md](trips/016-wire-explore-unified.md) | unified explore |

→ Full trips list: [trips/](trips/) (010–023 scr/wire pairs)

### Supply-side dashboards

| File | Role |
|------|------|
| [venue-owners/001-venue-dashboard.md](venue-owners/001-venue-dashboard.md) | venue operator |
| [rental-hosts/001-rental-dashboard.md](rental-hosts/001-rental-dashboard.md) | rental broker |
| [sponsors/001-sponsor-dashboard.md](sponsors/001-sponsor-dashboard.md) | sponsor |
| [crm/001-leads-pipeline.md](crm/001-leads-pipeline.md) | leads CRM |
| [admin/001-ops-dashboard.md](admin/001-ops-dashboard.md) | Patricia ops |
| [admin/002-analytics-dashboard.md](admin/002-analytics-dashboard.md) | analytics |

---

## Layer 3 — Platform shell (scr ↔ wire)

Implementation pairings for `/chat` chrome, auth polish, a11y. **Detail:** [screens/INDEX.md](screens/INDEX.md).

| Group | scr | wire |
|-------|-----|------|
| Home + chat chrome | [screens/001-scr-home-chat-chrome.md](screens/001-scr-home-chat-chrome.md) | [screens/001-wire-home-chat.md](screens/001-wire-home-chat.md) |
| Chat nav + query bar | [screens/002-scr-chat-nav-rail.md](screens/002-scr-chat-nav-rail.md) | [screens/002-wire-chat-chrome.md](screens/002-wire-chat-chrome.md) |
| Auth | [screens/017-scr-login-signup-polish.md](screens/017-scr-login-signup-polish.md) | [screens/024-wire-auth-login-signup.md](screens/024-wire-auth-login-signup.md) |
| States + a11y | [screens/019-scr-loading-error-empty-states.md](screens/019-scr-loading-error-empty-states.md) | [screens/020-scr-accessibility-pass.md](screens/020-scr-accessibility-pass.md) |

**Browse screens (vertical):** [SCREEN-021-cafe-listings-map-booking.md](screens/SCREEN-021-cafe-listings-map-booking.md) · [SCREEN-022-nightlife-listings-map.md](screens/SCREEN-022-nightlife-listings-map.md)

**Verify pairings:** `node scripts/verify-scr-wire-pairing.mjs` (repo root)

---

## Layer 4 — Mobile

| Doc | Purpose |
|-----|---------|
| [mobile/index-mobile.md](mobile/index-mobile.md) | M1–M5 task index |
| [mobile/mobile-plan.md](mobile/mobile-plan.md) | Mobile strategy |
| [mobile/map-011-mobile-map-system.md](mobile/map-011-mobile-map-system.md) | Map + bottom sheet |
| [mobile/mob-chat-001-mobile-chat-composer.md](mobile/mob-chat-001-mobile-chat-composer.md) | Chat composer |
| [mobile/events/004-wire-host-event-wizard.md](mobile/events/004-wire-host-event-wizard.md) | Host wizard (mobile) |

→ Full mobile tree: [mobile/](mobile/)

---

## Layer 5 — HTML mockups

Interactive lo-fi HTML in [HTML/](HTML/) — use for visual review before coding.

| File | Surface |
|------|---------|
| [HTML/home-wireframe.html](HTML/home-wireframe.html) | Home |
| [HTML/map-workspace-wireframe.html](HTML/map-workspace-wireframe.html) | Chat + map workspace |
| [HTML/rentals-browse-wireframe.html](HTML/rentals-browse-wireframe.html) | Rentals browse |
| [HTML/rental-detail-wireframe.html](HTML/rental-detail-wireframe.html) | Rental detail |
| [HTML/host-wireframe.html](HTML/host-wireframe.html) | Host dashboard |
| [HTML/cafes.html](HTML/cafes.html) | Cafés browse |
| [HTML/readiness-wireframes.md](HTML/readiness-wireframes.md) | Readiness notes |

→ All HTML: [HTML/](HTML/) (17 files)

---

## Audits & UX hardening

| File | Scope |
|------|-------|
| [AUDIT.md](AUDIT.md) | Full wireframe production audit (93/100) |
| [audit/01-screens-audit.md](audit/01-screens-audit.md) | Screen audit |
| [audit/02-maps-audit.md](audit/02-maps-audit.md) | Maps audit |
| [audit/04-mobile-audit.md](audit/04-mobile-audit.md) | Mobile audit |
| [ux/README.md](ux/README.md) | UX task hub |
| [ux/UX-024-hover-pin-parity.md](ux/UX-024-hover-pin-parity.md) | Map pin hover parity |

---

## Navigation map (condensed)

```text
CONSUMER          /  /chat  /rentals  /restaurants  /cafes  /nightlife  /events
                  /me/saved  /me/profile  /me/tickets  /explore
HOST              /host/event/new  /host/events
SUPPLY            /broker  venue-owner dashboards
OPS               /admin  CRM leads pipeline
```

**Depth:** L0 `/` → L1 vertical browse → L2 detail/checkout → L2 wallet/trip workspace.

---

## MVP build order

| Priority | Wireframes | Phase |
|----------|------------|-------|
| 1 | `/chat` 3-panel + maps + cards | MVP |
| 2 | Rentals discovery + detail + viewing lead | MVP |
| 3 | Event detail → checkout → ticket wallet | MVP |
| 4 | Host event wizard (HITL) | MVP |
| 5 | Restaurants · cafés · nightlife browse | MVP+ |
| 6 | Saved · trips · broker/admin dashboards | Post-MVP |
| 7 | WhatsApp-native UI | Phase 2 |

Full rationale: [README.md](README.md) § Implementation priority · [AUDIT.md](AUDIT.md) § Critical blockers.

---

## File count (2026-06-10)

| Bucket | ~files |
|--------|-------:|
| Root D-track (00–06) | 8 |
| Domain packs (auth, consumer, events, …) | 35 |
| Platform shell (`screens/`) | 20 |
| Mobile | 18 |
| Trips / real-estate | 18 |
| HTML mockups | 17 |
| Audits + UX | 10 |
| **Total** | **~110** markdown + HTML |
