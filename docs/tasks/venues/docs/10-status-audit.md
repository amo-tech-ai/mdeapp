---
doc_id: VENUES-STATUS-V1
title: Venues completed vs missing audit
version: 1.0.0
date: 2026-05-27
parent: ./README.md
---

# Status audit

## Completed ✅

### Platform / maps (shared)

| Item | Evidence |
|------|----------|
| ChatMap + pins | MAP-001, MAP-002, F50 |
| Places detail API + cache | MAP-004, `/api/places/detail` |
| Grounding tool | MAP-010, `search-grounded-places` |
| Field masks | MAP-005 |

### Venues Phase A.5

| Item | Path / note |
|------|-------------|
| Café scr/wire specs | `005-scr-*`, `005-wire-*` |
| `CafeResultCard` | mdeapp shipped |
| `CafeDetailPanel` | tabs, siblings, ask prompts |
| intent:cafe | Mastra tool |
| Pin sync | F50 card ↔ map |
| Booking stub | UI only — no DB |

### Data

| Item | Count |
|------|-------|
| `restaurants` | ~44 rows |
| `restaurant_embeddings` | ~43 rows |

### Planning

| Item | Path |
|------|------|
| PRD | `docs/prd-venues.md` |
| Planning hub | `docs/README.md` |
| Architecture + flows | `docs/01–10` |
| Progress tracker | `INDEX.md` |
| Working notes | `notes-venues.md` |

---

## Missing ❌

### UI (Phase B)

| Item | Task |
|------|------|
| `RestaurantResultCard` / panel | VEN-002 / 008 |
| Nightlife cards / panel | VEN-003 / 007 |
| `VenueBookingSheet` persist | VEN-004 |

### Backend (Phase C)

| Item | Task |
|------|------|
| `venue_booking_requests` | VEN-001 |
| Mastra `requestVenueBooking` | VEN-004 |
| WA draft + approval + outbox | VEN-005 |
| Admin booking queue | VEN-007 |

### Data / ops

| Item | Task |
|------|------|
| Restaurant seed expansion | VEN-006 |
| Places backfill cron | VEN-009 |
| OpenClaw → admin | VEN-008 |

### Vector

| Item | Task |
|------|------|
| Eval + rerank flag | VEC-001→005 |

---

## Spec hygiene

| File | Status | Action |
|------|--------|--------|
| `CAFE-001-booking-requests-schema.md` | Superseded | Point to VEN-001 |
| `drafts/071`, `072` | Frozen Phase 3 | Keep in drafts |
| `drafts/venues/` | Event B2B dup | Link from notes only |
| `007-wire-nightlife-explorer.md` | Stub | Ignore; use listings wire |
| `openclaw-restaurant-1.md` | Research | Reference in 06 |

---

## scr/wire pairing

Last verify: **23 scr, 25 wire, all pairs match** (`scripts/verify-scr-wire-pairing.mjs`).

Venues root: 005, 006, 007, 008 scr/wire pairs present.

---

## Done gate checklist (per task)

- [ ] Spec status field updated in `INDEX.md`
- [ ] Localhost proof (`npm run dev` + surface curl)
- [ ] RLS for new tables
- [ ] Places field mask if new API
- [ ] Playwright if scr/wire §7 applies
- [ ] `task-verifier` evidence block

---

## Related

- [`07-roadmap-mvp.md`](./07-roadmap-mvp.md) — next 10 tasks
- [`../INDEX.md`](../INDEX.md)
