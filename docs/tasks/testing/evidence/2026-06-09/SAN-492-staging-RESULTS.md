# SAN-492 · EVT-033 — Staging apply evidence (local disposable)

**Date:** 2026-06-09  
**Task:** [SAN-492 · EVT-033 — Event venue + offerings schema](https://linear.app/sanjiovani/issue/SAN-492)  
**Merge commit:** `7c6632d` (PR #146)  
**Verdict:** ✅ **Ready for Apply Review** — staging gates pass · **prod NOT touched**

---

## Scope guard

| Target | Applied? | Proof |
|--------|----------|-------|
| **Local disposable staging** (`127.0.0.1:54322`) | ✅ Yes | migration `20260609120000` in `schema_migrations` |
| **Production** (`zkwcbyxiwklihegjhuql`) | ❌ **No** | MCP `execute_sql`: `migration_applied = 0` · `venue_event_offerings` absent |

> **Note:** Linked Supabase CLI project is prod (`zkwcbyxiwklihegjhuql`). Apply used **`supabase db push --local --yes`** only — **not** `--linked`. Do not run `supabase db push --linked` until explicit prod sign-off.

---

## Task 1 — Staging migration apply

```bash
git checkout main && git reset --hard origin/main   # @ 7c6632d
supabase db push --local --yes
```

| Check | Result |
|-------|--------|
| Migration file | `supabase/migrations/20260609120000_san492_event_venue_offerings.sql` |
| Applied version | `20260609120000` ✅ |
| CLI output | `Remote database is up to date` (already applied on disposable from prior session; re-confirmed) |

---

## Task 2 — 12-check RLS smoke

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -v ON_ERROR_STOP=1 \
  -f docs/tasks/testing/scripts/san492-rls-smoke.sql
```

**Log:** [`SAN-492-staging-smoke.log`](./SAN-492-staging-smoke.log)

| # | Test | Result |
|---|------|--------|
| 1 | `anon_select_verified_active_only` | ✅ PASS |
| 2 | `anon_cannot_insert_offering` | ✅ PASS |
| 3 | `anon_cannot_update_offering` | ✅ PASS |
| 4 | `anon_cannot_delete_offering` | ✅ PASS |
| 5 | `partner_member_crud_offerings_packages` | ✅ PASS |
| 6 | `admin_select_event_bookings` | ✅ PASS |
| 7 | `admin_update_event_bookings` | ✅ PASS |
| 8 | `invalid_resource_id_fails` | ✅ PASS |
| 9 | `unverified_location_fails` | ✅ PASS |
| 10 | `inactive_partner_fails` | ✅ PASS |
| 11 | `partner_id_mismatch_fails` | ✅ PASS |
| 12 | **`partner_id_update_mismatch_fails` (E12)** | ✅ PASS |

**Overall:** `12/12 ALL PASS` (updated from prior 11-check audit)

---

## Task 3 — Security advisors

### Prod baseline (unchanged — migration not on prod)

MCP `get_advisors(security)` on `zkwcbyxiwklihegjhuql` (2026-06-09):

| Metric | Count |
|--------|------:|
| Total | **100** |
| ERROR | **1** (`spatial_ref_sys` — pre-existing PostGIS) |
| WARN | **99** (pre-existing definer RPC warnings) |
| **NEW SAN-492 findings** | **0** (tables/functions not on prod yet) |

Gate interpretation: **no NEW findings vs 2026-06-09 baseline** on prod (expected — prod unapplied).

### Post-apply staging spot-check (local `:54322`)

| Object | Check | Result |
|--------|-------|--------|
| `venue_event_offerings` | RLS enabled | ✅ |
| `venue_event_packages` | RLS enabled | ✅ |
| Offerings policies | `veo_public_select`, `veo_member_write`, `veo_service_write` | ✅ 3 |
| Packages policies | `vep_public_select`, `vep_member_write`, `vep_service_write` | ✅ 3 |
| `partner_locations` | `partner_locations_public_event_select` | ✅ |
| `bookings` | `bookings_admin_select`, `bookings_admin_update` | ✅ 2 |
| `partner_is_active()` | exists (SECURITY DEFINER) | ✅ |
| `bookings_event_resource_guard` | fires on `resource_id, booking_type, partner_id` | ✅ |

---

## Task 5 — Closeout review

| Gate | Status |
|------|--------|
| Event venue tables created (`venue_event_offerings`, `venue_event_packages`) | ✅ |
| `partner_locations` extended (`accepts_event_bookings`, `is_verified`, capacities) | ✅ |
| RLS active on all touched tables | ✅ |
| Trigger active with `partner_id` column | ✅ |
| Policies active (public + member + admin + service) | ✅ |
| E12 verified | ✅ |
| No new prod advisor findings (prod unapplied) | ✅ |
| Prod apply | ❌ **Not run — by design** |

**Status:** **SAN-492 = Ready for Apply Review**

Human ERD sign-off still required before **remote prod** apply. Staging disposable proof is complete.

---

## Next (blocked until user OK)

1. ~~Staging disposable apply + smoke + evidence~~ ✅  
2. **Do not start SAN-493** until remote staging branch apply (if used) or explicit go-ahead  
3. After prod-path sign-off: remote apply → re-smoke → post-apply `get_advisors(security)` on applied environment  
4. Then branch **SAN-493 · EVT-034 — Event venue seed** (Mamacita + 5 venue partners)
