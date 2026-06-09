---
title: Events Platform — Data Model Index
updated: 2026-06-09
project: zkwcbyxiwklihegjhuql
readiness: 85
---

# Events Platform — Data Model Index

Live-Supabase-verified data model docs for the Events Platform (SAN-492 / EVT-033).

| Doc | Scope | Canonical location |
|-----|-------|--------------------|
| **Complete data model** | All 15 event/commerce/partner tables — cols, FKs, RLS, enums, row counts, ERD, commerce + host + partner models, SAN-492 create/avoid, migration order, risks, test plan, §13.5 data-quality | [`./ALL-EVENTS-DATA-MODEL.md`](./ALL-EVENTS-DATA-MODEL.md) |
| **Venue booking schema decision** | SAN-492 `partner_locations` reuse model — decision matrix, RLS plan, exact SQL (Appendix A), constraint deltas, status mapping, readiness | [`./data/VENUE-DATA-MODEL.md`](./data/VENUE-DATA-MODEL.md) |
| **Working notes** | Corrected audit summary, ownership options, join paths | [`./notes-data-model.md`](./notes-data-model.md) |
| **Forensic schema audit (prior)** | task-verifier audit that drove the model (B1/B2/B3) | [`../audit/04-data-model-audit.md`](../audit/04-data-model-audit.md) |
| **Live forensic audit (current)** | 90/100 A- · prod probes · ownership classification · blockers | [`../audit/05-all-events-data-model-live-audit.md`](../audit/05-all-events-data-model-live-audit.md) |

## SAN-492 verdict (2026-06-09)

- **Readiness 88/100** · 🟢 **GO for migration branch** · 🔴 **NO-GO for prod apply** until human ERD sign-off.
- **Migration (AUTHORED — NOT APPLIED):** `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql`
- **Create:** `venue_event_offerings`, `venue_event_packages` (FK → `partner_locations`) + extend `partner_locations` (`accepts_event_bookings`, `is_verified`, `capacity_seated/standing`) + public-SELECT RLS.
- **Reuse:** `bookings` (`booking_type='event'`, `partner_status`) for proposals.
- **Do NOT create:** `partner_venues`, `venues`, `event_venue_bookings`.
- **Keep unchanged:** `event_venues` (ticketed-event rooms), `venue_booking_requests` (café/table only).

## Data-quality (Linear SAN-858)

- 31/49 published events: `organizer_id` NULL (all 31 also `created_by` NULL — no naive backfill)
- 18/49 have `details.host_display`
- 0 venue partners / 0 `partner_locations`
- `restaurants` has no `event_offerings` — SAN-494 joins via `google_place_id`

All tables/columns/RLS/FKs/enums/row-counts probed live via Supabase MCP.
