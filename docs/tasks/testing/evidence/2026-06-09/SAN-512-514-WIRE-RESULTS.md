# SAN-512 · EVT-053 + SAN-513 · EVT-054 + SAN-514 · EVT-055 — Wire review

**Date:** 2026-06-09  
**Personas:** Roberto (match + wizard) · Patricia (admin queue)  
**Verdict:** 🟢 **Wires approved on disk** — ready for implementation after upstream gates

---

## SAN-512 · EVT-053 — Wire: Venue match panel + compare

**Wire:** [`VEB-W03`](../../../venues/tasks/event-booking/wireframes/VEB-W03-wire-venue-match-compare.md)

| AC area | Status |
|---------|--------|
| Match panel in chat thread | 🟢 Score bar + fit % + CTA |
| Compare drawer (2–3 venues) | 🟢 Side-by-side capacity/packages |
| testids | 🟢 `venue-match-panel` · `venue-compare-drawer` documented |

**Gate:** SAN-497 · EVT-038 agent match-score contract before implementation.

---

## SAN-513 · EVT-054 — Wire: Host wizard venue step

**Wire:** [`VEB-W04`](../../../venues/tasks/event-booking/wireframes/VEB-W04-wire-host-venue-step.md)

| AC area | Status |
|---------|--------|
| Workflow strip extension | 🟢 Venue step after basics |
| Venue picker + Mamacita shortcut | 🟢 Documented |
| Skip / external venue path | 🟢 Documented |
| Extends 004-host-event-wizard | 🟢 Linked |

**Gate:** SAN-492 schema applied for real venue data; wire-only work complete.

---

## SAN-514 · EVT-055 — Wire: Admin event booking queue

**Wire:** [`VEB-W05`](../../../venues/tasks/event-booking/wireframes/VEB-W05-wire-admin-event-booking-queue.md)

| AC area | Status |
|---------|--------|
| `/admin/bookings` Event proposals tab | 🟢 Table + status chips |
| Detail drawer approve/reject | 🟢 Documented |
| Extends VEN-024 admin queue | 🟢 Linked |

**Gate:** SAN-502 implementation + SAN-492 RLS.

---

## Rules compliance

- No schema changes in wire specs ✅
- No Supabase migrations ✅
- No production deploy ✅

---

## Unblocks

| Downstream | Needs |
|------------|-------|
| SAN-498 · EVT-039 AI venue match panel | SAN-512 wire + SAN-497 agent |
| SAN-500 · EVT-041 Host wizard venue step | SAN-513 wire + SAN-492 |
| SAN-502 · EVT-043 Patricia admin queue | SAN-514 wire + SAN-496 flow |
