---
id: EVT-033
linear: SAN-492
status: Spec-only · migration authored on disk
persona: Sofía, Patricia
updated: 2026-06-09
canonical: ../../data/VENUE-DATA-MODEL.md
seed_next: ./EVT-034-seed.md
legacy: ../../../venues/tasks/event-booking/VEB-001-core-event-venue-offerings-schema.md
---

# EVT-033 — Event venue + offerings schema

**Linear:** [SAN-492](https://linear.app/sanjiovani/issue/SAN-492/evt-033-event-venue-offerings-schema)

**Source of truth (approve before migration):**

→ [`../../data/VENUE-DATA-MODEL.md`](../../data/VENUE-DATA-MODEL.md) — ERD, migration order, rollback, RLS, Appendix A SQL

**Migration file:** `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql` (includes `partner_is_active()`)

Legacy spec (partially superseded — do not follow `venues` / `event_venue_bookings` verbatim):

→ [`VEB-001-core-event-venue-offerings-schema.md`](../../../venues/tasks/event-booking/VEB-001-core-event-venue-offerings-schema.md)

Related: [`EVT-034-seed.md`](./EVT-034-seed.md) · VEN-001–007 · [`../pages/missing/PAGE-M05-admin-bookings.md`](../pages/missing/PAGE-M05-admin-bookings.md)

## Execution gate

1. Human ERD sign-off on [`VENUE-DATA-MODEL.md`](../../data/VENUE-DATA-MODEL.md) Appendix A
2. PR #146 ready → merge → staging apply → RLS smoke + post-apply advisors
3. Seed [`EVT-034-seed.md`](./EVT-034-seed.md) (493) → UI (494–496)
4. Wires (510/511) may proceed **in parallel** — no schema dependency

## Verification

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -f docs/tasks/testing/scripts/san492-rls-smoke.sql   # expect ALL PASS (12 checks)
cd mdeapp && npm run test -- supabase
```
