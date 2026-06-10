---
title: Events data model — working notes
updated: 2026-06-09
audit: tasks/events/audit/05-all-events-data-model-live-audit.md
linear_data_quality: SAN-858
---

# Events data model — working notes

> **Canonical SoT:** [`ALL-EVENTS-DATA-MODEL.md`](./ALL-EVENTS-DATA-MODEL.md) · **Live audit:** [`../audit/05-all-events-data-model-live-audit.md`](../audit/05-all-events-data-model-live-audit.md)

## Verdict (corrected 2026-06-09)

| Metric | Value |
|--------|------:|
| Audit accuracy | **90/100 — A-** |
| Model readiness | **88/100** |
| Prod SAN-492 apply | **NO-GO** (human sign-off) |
| Blind `organizer_id` backfill | **REJECTED** |

## Live facts (project `zkwcbyxiwklihegjhuql`)

| Fact | Value |
|------|-------|
| Published events, `organizer_id` NULL | **31 / 49** |
| Of 31 NULL organizer, `created_by` NOT NULL | **0** → `UPDATE … organizer_id = created_by` fixes **0 rows** |
| Published with `details.host_display` | **18 / 49** |
| `partners.type='venue'` / active venue partners | **0** |
| `partner_locations` rows | **0** |
| `restaurants.event_offerings` column | **does not exist** |
| SAN-492 tables on prod | **absent** |
| Authored migration (not applied) | `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql` |

## Ownership gap — correct framing

**Not** "Organizer Backfill." Use **DATA-QUALITY · Events Ownership Classification** ([**SAN-858**](https://linear.app/sanjiovani/issue/SAN-858)).

31 rows are likely **discovery/imported catalogue events**, not host-wizard rows missing a column.

| Option | When |
|--------|------|
| A — keep NULL | Discovery catalogue default |
| B — system/admin owner | Platform-owned events only |
| C — proven-owner backfill | Manual row audit with evidence |

## SAN-494 join (not `event_offerings`)

```sql
restaurants.google_place_id = partner_locations.google_place_id
  AND partner_locations.accepts_event_bookings
  AND partner_locations.is_verified
```

## Corrected next steps

1. **SAN-178** — PAY-001 live ticket (Core P0)
2. **SAN-492** — migration PR review only (no live apply)
3. Patch docs — **done** in audit 05 + ALL-EVENTS §13.5
4. **SAN-510/511** — wires in parallel
5. **SAN-858** — ownership classification (research, no blind SQL)
6. **SAN-493** — after 492 apply: **create** venue partners from scratch

## Doc patches applied

- Readiness → **88** (ALL-EVENTS, INDEX)
- `offering_key` on `venue_event_offerings`
- Migration file pointer (AUTHORED NOT APPLIED)
- §13.5 data-quality gaps
- ERD `partners.type` column label fix
- VEN-001 → `google_place_id` join
