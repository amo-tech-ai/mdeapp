---
title: Data tasks — audit summary pointer
date: 2026-05-29
full_audit: tasks-data-forensic-audit.md
spec_corrections: 02-task-spec-corrections.md
implementation_status: ../evidence/IMPLEMENTATION-STATUS.md
---

# Data tasks audit — summary

**Full report:** [`tasks-data-forensic-audit.md`](./tasks-data-forensic-audit.md)  
**Live execution log:** [`../evidence/IMPLEMENTATION-STATUS.md`](../evidence/IMPLEMENTATION-STATUS.md)

## Grade: **~78/100** (post Phase A–E, 2026-05-29)

Was **68/100** at audit open — evidence + CORE DDL shipped.

## Shipped today (live Supabase + evidence)

| Task | What |
|------|------|
| DATA-001, 012, 019, 026, 034 | Inventories → `tasks/data/evidence/` |
| DATA-002 | Three-kind contract + gap SQL |
| DATA-009 | M1 `venue_booking_requests`, M2 `venue_anchors`, M3 rental indexes |
| DATA-020 | `leads.apartment_id`, `preferred_showing_at` |
| DATA-027 | `trip_items` CHECK + `insert_trip_item_for_user` RPC |
| DATA-029 | `trip_id` on `event_orders`, `leads`, `showings` |

## Next (systematic order)

1. **DATA-035** → café `venue_anchors` seed  
2. **DATA-003 / DATA-005** — nightclub + café sign-off  
3. **DATA-004** — verify-only (restaurants 44/44)  
4. **DATA-021** — showings ↔ leads bridge  
5. **DATA-023 / DATA-030** — golden-query packs (read-only)  
6. **DATA-028** — commerce → `trip_items` sync (app + webhook)  
7. **DATA-010 / DATA-011** — search_path + edge matrix refresh  

## Still defer

`DATA-017`, `DATA-025`, `DATA-033` (route_cache), Hermes analytics tables
