# SAN-493 · EVT-034 — Staging seed evidence

**Date:** 2026-06-09  
**Merge:** [PR #150](https://github.com/amo-tech-ai/mdeapp/pull/150) → `5a3ea07`  
**Tasks:** [SAN-492 · EVT-033](https://linear.app/sanjiovani/issue/SAN-492/evt-033-event-venue-offerings-schema) schema + [SAN-493 · EVT-034](https://linear.app/sanjiovani/issue/SAN-493/evt-034-seed-mamacita-5-event-partners) seed  
**Verdict:** ✅ **7/7 ALL PASS** on staging disposable · **prod untouched**

---

## Scope guard (critical)

| Environment | SAN-492 applied? | SAN-493 seeded? |
|-------------|------------------|-----------------|
| **Staging disposable** `127.0.0.1:54322` | ✅ `20260609120000` | ✅ 6 venue partners |
| **Production** `zkwcbyxiwklihegjhuql` | ❌ migration `0` | ❌ `san493_partners=0` (MCP 2026-06-09) |

**Why not `supabase db push --linked`:** CLI linked project **is prod** (`zkwcbyxiwklihegjhuql`). Remote Supabase branches are all `MIGRATIONS_FAILED`; no separate healthy staging ref exists. Staging proof ran on **local disposable** `:54322` using `--local` — same gate sequence, prod not touched.

---

## Task 3 — Staging sequence (executed)

```bash
# 1. SAN-492 schema (local staging surrogate)
supabase db push --local --yes
# → migration 20260609120000 present

# 2. SAN-493 seed
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -v ON_ERROR_STOP=1 -f supabase/seeds/san493_event_venues.sql

# 3. Verify
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -v ON_ERROR_STOP=1 -f docs/tasks/testing/scripts/san493-seed-verify.sql
```

**Verify log:** [`SAN-493-staging-verify.log`](./SAN-493-staging-verify.log)

| Check | Result |
|-------|--------|
| `anon_sees_six_san493_venues` | ✅ PASS (6) |
| `anon_sees_offerings` | ✅ PASS (3) |
| `mamacita_has_package` | ✅ PASS (1) |
| `mamacita_proposal_insert_ok` | ✅ PASS |
| `draft_partner_location_invisible` | ✅ PASS |
| `draft_partner_proposal_fails` | ✅ PASS |
| `six_partners_active_venue` | ✅ PASS (6) |

**Overall:** `7/7 ALL PASS`

---

## Cross-reference: SAN-492 staging evidence

Prior apply-review proof: [`SAN-492-staging-RESULTS.md`](./SAN-492-staging-RESULTS.md) (12/12 RLS smoke on same disposable DB).

---

## Persona readiness (staging disposable)

| Persona | State |
|---------|--------|
| **Camila** | 6 anon-visible event venues (incl. Mamacita) — UI still blocked until SAN-494 |
| **Roberto** | Mamacita proposal insert succeeds against seed data |
| **Patricia** | Seed rows exist for admin queue demos — no UI in this slice |

---

## Do not do yet

- ❌ `supabase db push --linked` (would hit **prod**)
- ❌ Seed prod
- ❌ Start **SAN-494 · EVT-035** until user OK on this evidence
- ❌ Prod SAN-492 apply without ERD sign-off

---

## Next

1. User OK on staging evidence → flip **SAN-493** toward Done (seed script merged; staging proof captured)
2. Open `ui/san-494-event-venue-cta` for Mamacita CTA UI
3. When remote staging branch healthy: re-run this sequence with `--db-url <staging>` and append evidence row
