---
doc_id: VENUES-ADVANCED-V1
title: Venues advanced roadmap (Phase 2+)
version: 1.0.0
date: 2026-05-27
parent: ./README.md
---

# Advanced roadmap

## Phase 2 — quality + cross-sell

| Item | Description | Depends |
|------|-------------|---------|
| **VEC-002→005** | Semantic rerank cafés/restaurants | VEC-001 |
| **EVP-036** | Roberto "nearby bars after event" | events milestone |
| **VEN-009** | Places backfill cron | MAP-004 |
| **OCL-013–014** | Coffee tours + hours propose | OpenClaw staging |
| **ADK sidecar** | `services/adk-grounding/` production | MAP-010 patterns |

---

## Phase 3 — partner reservations (071/072)

**Frozen drafts:**

- [`../drafts/071-restaurant-reservations-schema.md`](../drafts/071-restaurant-reservations-schema.md)
- [`../drafts/072-restaurant-booking-edge-fn.md`](../drafts/072-restaurant-booking-edge-fn.md)

OpenTable-style: owner calendar, table inventory, instant confirm, Stripe deposit.

| If revived | Map to |
|------------|--------|
| Schema | VEN-010 |
| Edge confirm API | VEN-011 |
| Unify ledger | Optional link `venue_booking_requests` → `public.bookings` |

**Do not start** until Phase C WA request loop proves demand and Patricia ops scale.

---

## Phase 3 — WhatsApp automation

| Feature | Constraint |
|---------|------------|
| Template library | Twilio approved templates (mde-whatsapp) |
| Inbound venue replies | Webhook → status `needs_user` |
| OpenClaw OCL-015 | Draft only — Patricia still approves v1 sends |

---

## Coffee tours vertical

- Listing packs: [`../cafes/listings/`](../cafes/listings/)
- Agent: CTI roadmap (separate from concierge default)
- Booking: may reuse `venue_booking_requests` with `venue_kind=cafe` + tour metadata

---

## Event venue B2B (separate product line)

**Not** `tasks/venues/` place discovery:

- Strategy: [`../drafts/venues/`](../drafts/venues/) (duplicate of `plan/events/venues/`)
- Tables: `event_venues`, host wizard
- Sheet: **006 VenueDetailSheet**

Keep docs cross-linked in [`../notes-venues.md`](../notes-venues.md) § Events ↔ Venues.

---

## i18n (Phase 2 W7+)

PRD defers Spanish-first UI. Venue copy, WA drafts, and admin queue should design **English Phase 1** with i18n-ready string keys — no Lingui until W7+.

---

## Related

- [`07-roadmap-mvp.md`](./07-roadmap-mvp.md)
- [`09-risks-blockers.md`](./09-risks-blockers.md)
