# Trips — screen + wireframe specs

**PRD + roadmap:** [`trips-plan.md`](./trips-plan.md)  
**Audit (MCP-verified):** [`docs/01-audit.md`](./docs/01-audit.md)  
**Implementation tasks:** [`tasks/INDEX.md`](./tasks/INDEX.md) (TRIP-001–019)  
**Audit prompt:** [`docs/prompt-trips.md`](./docs/prompt-trips.md)  
**Forensic task audit:** [`docs/02-audit-tasks.md`](./docs/02-audit-tasks.md)  
**Verify:** `node scripts/verify-scr-wire-pairing.mjs`  
**Testing:** [`../screens/SCREEN-TESTING-STANDARD.md`](../screens/SCREEN-TESTING-STANDARD.md)

Camila's trips hub, itinerary workspace, saved collections, and booking checkout modals.

---

## Specs

| Group | scr | wire | Legacy SCREEN | Path |
|-------|-----|------|---------------|------|
| **010** Booking | [010-scr-booking-checkout-modal](010-scr-booking-checkout-modal.md) | [010-wire-booking-checkout](010-wire-booking-checkout.md) | SCREEN-009 | modal |
| **010** Schedule | — (see [`../screens/017-scr-schedule-viewing-modal.md`](../screens/017-scr-schedule-viewing-modal.md)) | shares `010-wire-booking-checkout` | SCREEN-008 | modal |
| **011** Itinerary | [013-scr-itinerary-panel](013-scr-itinerary-panel.md) | [013-wire-itinerary-planner](013-wire-itinerary-planner.md) | SCREEN-013 | right tab |
| **012** Trips | [012-scr-trips-dashboard](012-scr-trips-dashboard.md) | [012-wire-trips-dashboard](012-wire-trips-dashboard.md) | SCREEN-012 | `/trips` |
| **012** Workspace | — | [012-wire-trip-workspace](012-wire-trip-workspace.md) | SCREEN-013 | `/trips/:id` |
| **014** Saved | [014-scr-saved-collections-page](014-scr-saved-collections-page.md) | [014-wire-saved-collections](014-wire-saved-collections.md) | SCREEN-011 | `/saved` |

**Deferred wire (no scr):** [010-wire-bookings-inbox](010-wire-bookings-inbox.md)

---

## Related

| Domain | Link |
|--------|------|
| **PRD + roadmap** | [`trips-plan.md`](trips-plan.md) |
| Data audit (trips §4) | [`../data/audit-supabase.md`](../data/audit-supabase.md) |
| **Data tasks** | [`../data/tasks-data/INDEX-data.md`](../data/tasks-data/INDEX-data.md) § Trips (data-026–032) |
| Events checkout (Andrés) | [010-scr-booking-checkout-modal](010-scr-booking-checkout-modal.md) |
| Map pins on trip | [`../maps/wireframes/`](../maps/wireframes/INDEX.md) |
| Rental schedule lead | [`../screens/017-scr-schedule-viewing-modal.md`](../screens/017-scr-schedule-viewing-modal.md) |

*Last updated: 2026-05-28*
