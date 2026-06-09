---
doc_id: VENUES-MVP-ROADMAP-V1
title: Venues MVP roadmap + next 10 tasks
version: 1.0.0
date: 2026-05-27
parent: ./README.md
---

# MVP roadmap

## Phase summary

| Phase | Goal | Exit criteria |
|-------|------|---------------|
| **A** | Café discover + detail | 005 scr/wire Done; pins sync |
| **A.5** | Café shipped on disk | CafeCard, CafeDetailPanel, detail API ✅ |
| **B** | Restaurant + nightlife UI | 008 + 007 cards/panels; intents wired |
| **C** | Honest booking + WA | VEN-001→005; Patricia queue |
| **D** | Vector rerank | VEC-005 flag on |
| **E** | OpenClaw enrich | VEN-008 admin drafts |

---

## Phase A.5 — shipped (2026-05)

- `CafeResultCard`, `CafeDetailPanel`
- `/api/places/detail`, `search-grounded-places` intent:cafe
- F50 pin sync
- Booking UI stub (no DB persist)

---

## Phase B — in progress

| Task | Deliverable |
|------|-------------|
| VEN-002 | `RestaurantResultCard` + `RestaurantDetailPanel` (008) |
| VEN-003 | Nightlife intent + UI (007) |

**Parallel (non-blocking):** VEC-001 inventory.

---

## Phase C — booking

| Task | Deliverable |
|------|-------------|
| VEN-001 | `venue_booking_requests` migration + RLS |
| VEN-004 | `VenueBookingSheet` + Mastra `requestVenueBooking` |
| VEN-005 | Draft WA + `approval_requests` + `wa_outbox` |
| VEN-007 | `/admin/bookings` queue |

---

## Next 10 tasks (exact order)

| # | ID | Why now |
|---|-----|---------|
| 1 | **VEN-002** | Restaurant vertical — 008 spec; mirror café pattern |
| 2 | **VEN-003** | Nightlife intent + cards — tourist story |
| 3 | **VEN-001** | Schema before real booking persist |
| 4 | **VEN-004** | User-facing request form + tool |
| 5 | **VEN-005** | Patricia gate + outbound WA |
| 6 | **VEC-001** | Vector inventory (parallel with 4–5) |
| 7 | **VEN-006** | Restaurant seed + `google_place_id` backfill |
| 8 | **VEN-007** | Admin booking queue |
| 9 | **VEN-009** | Places backfill cron |
| 10 | **VEN-008** | OpenClaw draft → admin approve |

**Not in top 10:** VEN-010/011 (071/072 partner reservations), coffee tours (OCL-013), EVP-036 (after events milestone).

---

## Screen ↔ task mapping

| scr/wire | Tasks |
|----------|-------|
| 005 café | A.5 ✅ → VEN-004 booking |
| 006 sheet | No change — rentals/events |
| 007 nightlife | VEN-003 |
| 008 restaurant | VEN-002 |

---

## Verification gates (each task)

1. `npm run dev` clean boot
2. Relevant route/tool responds (curl or Playwright)
3. RLS proof for new tables
4. Field mask on new Places calls
5. `task-verifier` before Done flip

---

## Related

- [`../INDEX.md`](../INDEX.md)
- [`10-status-audit.md`](./10-status-audit.md)
- [`prd-venues.md`](./prd-venues.md)
