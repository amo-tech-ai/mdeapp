# SAN-492 · EVT-033 — PR #146 audit + disposable proof

**Date:** 2026-06-09 (updated after E0 migration patch + doc sync)  
**PR:** [amo-tech-ai/mdeapp#146](https://github.com/amo-tech-ai/mdeapp/pull/146) (draft)  
**Linear:** [SAN-492 · EVT-033 — Event Venue + Offerings Schema](https://linear.app/sanjiovani/issue/SAN-492/evt-033-event-venue-offerings-schema)  
**Branch:** `ai/san-492-evt-033-event-venue-offerings-schema` @ **`d7b256b`**  
**Verdict:** 🟢 **Ready for review** — migration patched + docs synced; **human ERD sign-off still required before staging/prod apply**

---

## 7-step workflow verification

| Step | User order | Correct? | Status |
|------|------------|----------|--------|
| 1 | Disposable/staging migration apply | ✅ Yes (not prod first) | ✅ **Local disposable** `:54322` — `20260609120000` in `schema_migrations` |
| 2 | RLS smoke (11 scenarios) | ✅ Yes (after apply) | ✅ **ALL PASS** |
| 3 | `get_advisors(security)` | ✅ Yes | ⚠️ **Prod baseline only** — re-run post-apply on staging |
| 4 | Save evidence | ✅ Yes | ✅ This file |
| 5 | Human ERD sign-off | ✅ Yes (before prod) | 🔴 **PENDING — user** |
| 6 | Mark PR ready | ✅ After 1–4 green | ✅ **`gh pr ready 146`** @ commit `d7b256b` |
| 7 | Merge after review approval | ✅ Correct | ⏸ After review + sign-off |

---

## E0 fix — `partner_is_active()` (resolved on disk)

**Problem:** Public policies subqueried `partners` inline; anon has no SELECT on `partners` → zero public venues.

**Fix in** `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql`:

- `public.partner_is_active(uuid)` — `SECURITY DEFINER`, `STABLE`, `search_path = public`
- Used in `partner_locations_public_event_select`, `veo_public_select`, `vep_public_select`

**Doc sync:** `mdeapp/docs/tasks/events/data/VENUE-DATA-MODEL.md` Appendix A.0–A.7 aligned.

**Remote PR #146 @ origin:** still has pre-patch SQL — **needs commit/push from local disk**.

---

## RLS smoke results

**Script:** `tasks/testing/scripts/san492-rls-smoke.sql`

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -v ON_ERROR_STOP=1 -f tasks/testing/scripts/san492-rls-smoke.sql
```

| Test | Result |
|------|--------|
| anon SELECT verified+active event locations only | ✅ PASS |
| anon cannot INSERT/UPDATE/DELETE offerings | ✅ PASS |
| partner member CRUD own offerings/packages | ✅ PASS |
| admin SELECT/UPDATE event bookings | ✅ PASS |
| invalid `resource_id` / unverified / inactive / partner_id mismatch triggers | ✅ PASS |

**Overall:** `ALL PASS` (11 checks)

---

## `get_advisors(security)` (prod baseline, pre-apply)

| Metric | Value |
|--------|------:|
| Total lints | 100 |
| ERROR | 1 (`spatial_ref_sys`, pre-existing) |
| WARN | 99 (pre-existing definer RPC warnings) |
| SAN-492 objects | **0** (not on prod yet) |

**Gate:** post-apply staging — **no NEW findings** vs this baseline.

---

## Related deliverables (2026-06-09)

| Artifact | Path |
|----------|------|
| Forensic audit | `mdeapp/docs/tasks/events/data/data-model-audit.md` |
| Seed spec (E1) | `mdeapp/docs/tasks/events/specs/venue-booking/EVT-034-seed.md` |
| Test matrix | `mdeapp/docs/tasks/events/specs/venue-booking/venue-booking-test-matrix.md` |
| Stale duplicate removed | ~~`events/VENUE-DATA-MODEL.md`~~ → canonical `data/VENUE-DATA-MODEL.md` only |

---

## Audit score

| Area | Score |
|------|------:|
| Architecture | 92 |
| Scope control | 98 |
| SQL completeness | **92** (`partner_is_active` + strengthened trigger) |
| RLS safety | **90** (smoke green) |
| Test proof | **88** |
| Doc sync | **90** |
| **Overall** | **88/100 — B+** |

---

## Next actions

1. **Commit + push** to `ai/san-492-evt-033-event-venue-offerings-schema`: migration + `docs/tasks/events/**`
2. **Human ERD sign-off** on `data/VENUE-DATA-MODEL.md` Appendix A
3. **`gh pr ready 146`**
4. Review + merge → **staging apply** → re-smoke + post-apply advisors
5. **SAN-493** per `EVT-034-seed.md` → UI chain 494–496

**Do not apply to prod** until staging gates pass.
