# SAN-510 · EVT-051 + SAN-511 · EVT-052 — Wire review

**Date:** 2026-06-09  
**Personas:** Tourist (restaurant card CTA) · Roberto (proposal request)  
**Verdict:** 🟢 **Wires approved on disk** — ready for SAN-494 / SAN-496 implementation after schema+seed

---

## SAN-510 · EVT-051 — Event offerings panel + Event Venue CTA

**Wire:** [`VEB-W01`](../../../venues/tasks/event-booking/wireframes/VEB-W01-wire-event-offerings-panel.md)

| AC area | Status |
|---------|--------|
| Restaurant card CTA + badge | 🟢 ASCII + rules (`accepts_event_bookings`) |
| Right-column offerings panel | 🟢 Sections: types, capacity, packages, amenities |
| Mobile sheet behavior | 🟢 Documented |
| testids | 🟢 `event-venue-cta` · `event-offerings-panel` · `request-proposal-btn` · `venue-package-card` |

**Join path (SAN-494):** `restaurants.google_place_id = partner_locations.google_place_id` — no `event_offerings` column.

---

## SAN-511 · EVT-052 — Request proposal modal

**Wire:** [`VEB-W02`](../../../venues/tasks/event-booking/wireframes/VEB-W02-wire-request-proposal-modal.md)

| State | UI |
|-------|-----|
| Default form | 🟢 venue locked, event type, date/time, guests, budget, notes, WhatsApp |
| Validation error | 🟢 inline |
| Submitting | 🟢 spinner |
| Success | 🟢 WhatsApp confirmation copy (not instant booking) |
| Forbidden copy | 🟢 no “Booking confirmed” |

**testids:** `proposal-modal` · `proposal-event-type` · `proposal-submit` · `proposal-success`

**HITL:** CopilotKit `renderAndWaitForResponse` mirror documented.

---

## Rules compliance

- No schema changes in wire specs ✅
- No Supabase migrations ✅
- No production deploy ✅

---

## Unblocks

| Downstream | Needs |
|------------|-------|
| SAN-495 · EVT-036 offerings detail panel | SAN-510 wire + SAN-492/493 data |
| SAN-496 · EVT-037 proposal modal HITL | SAN-511 wire + SAN-494 CTA surface |
