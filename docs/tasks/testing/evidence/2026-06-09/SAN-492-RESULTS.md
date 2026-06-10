# SAN-492 · EVT-033 — Event venue + offerings schema (PR review)

**Date:** 2026-06-09  
**Linear:** [SAN-492](https://linear.app/sanjiovani/issue/SAN-492/evt-033-event-venue-offerings-schema)  
**Verdict:** 🟡 **Draft PR [#146](https://github.com/amo-tech-ai/mdeapp/pull/146)** — trigger hardened; RLS smoke + ERD sign-off still required · see [`SAN-492-PR146-AUDIT.md`](./SAN-492-PR146-AUDIT.md)

---

## Disk state

| Item | Status |
|------|--------|
| Migration file | `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql` |
| Branch | `ai/san-492-evt-033-event-venue-offerings-schema` |
| Commit | `02a7531` feat(db): SAN-492 event venue + offerings schema (AUTHORED, not applied) |
| Prod `list_migrations` | **Absent** — latest `20260608202427_san135_backfill_event_host_display` |
| SoT | [`tasks/events/data/VENUE-DATA-MODEL.md`](../../../events/data/VENUE-DATA-MODEL.md) · audit [`05`](../../../events/audit/05-all-events-data-model-live-audit.md) |

---

## SQL audit (static)

| Check | Result |
|-------|--------|
| EXTEND `partner_locations` (4 cols + CHECKs) | 🟢 |
| CREATE `venue_event_offerings` + `offering_key` UNIQUE | 🟢 |
| CREATE `venue_event_packages` | 🟢 |
| RLS enabled + public SELECT gated on active partner | 🟢 |
| `bookings_admin_select/update` (`is_admin()`) | 🟢 |
| `bookings_event_resource_guard` trigger | 🟢 → 🟡 patched (verified+active+partner_id) |
| No `partner_venues` / `event_venue_bookings` fork | 🟢 |
| Transaction wrapped (`begin`/`commit`) | 🟢 |
| Rollback doc | 🟢 VENUE-DATA-MODEL §A.6 |

---

## RLS smoke (pre-apply — design review)

Policies mirror live `ptr008–014` partner stack patterns:

- Public read only when `accepts_event_bookings AND is_verified AND partners.status='active'`
- Member write via `partner_ids_for_user()` + admin override
- Service-role write paths for seed (SAN-493)

**Post-apply smoke required:** anon SELECT on seeded Mamacita row; partner member INSERT offerings; admin SELECT on `bookings` queue.

---

## Readiness

| Metric | Value |
|--------|------:|
| Pre-impl (2026-06-08) | 78 |
| Post model revision + audit 05 | **88** |
| Target after PR + human sign-off | **90** |

---

## Next actions

1. Open PR from `ai/san-492-evt-033-event-venue-offerings-schema` → `main`
2. Human ERD sign-off on [`ALL-EVENTS-DATA-MODEL.md`](../../../events/data/ALL-EVENTS-DATA-MODEL.md) §9–10
3. `get_advisors(security)` **after** apply on staging branch — not on prod today (tables absent)
4. **Do not** `apply_migration` to prod until sign-off

**Unblocks after merge+apply:** SAN-493 · EVT-034 seed
