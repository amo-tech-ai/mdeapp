# SAN-493 · EVT-034 — Event venue seed evidence

**Date:** 2026-06-09  
**Task:** [SAN-493 · EVT-034 — Seed Mamacita + 5 event venue partners](https://linear.app/sanjiovani/issue/SAN-493/evt-034-seed-mamacita-5-event-partners)  
**Branch:** `data/san-493-event-venue-seed`  
**Depends on:** [SAN-492 · EVT-033 — Event venue + offerings schema](https://linear.app/sanjiovani/issue/SAN-492/evt-033-event-venue-offerings-schema) applied on target env  
**Verdict:** ✅ **7/7 ALL PASS** on local disposable `:54322` · **prod NOT seeded**

---

## Scope guard

| Target | Seeded? |
|--------|---------|
| Local disposable `:54322` | ✅ Yes |
| Production `zkwcbyxiwklihegjhuql` | ❌ **No** |

Run seed **only after** SAN-492 migration on the same environment.

---

## Seed script

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -v ON_ERROR_STOP=1 \
  -f supabase/seeds/san493_event_venues.sql
```

**File:** `supabase/seeds/san493_event_venues.sql`

| # | Display name | Partner UUID suffix | Location label |
|---|--------------|---------------------|----------------|
| 1 | Mamacita | `8101` / `8201` | Mamacita Provenza |
| 2 | Rooftop Laureles | `8102` / `8202` | Rooftop Laureles |
| 3 | El Patio Envigado | `8103` / `8203` | El Patio Envigado |
| 4 | Garden El Poblado | `8104` / `8204` | Garden El Poblado |
| 5 | Terrace Manila | `8105` / `8205` | Terrace Manila |
| 6 | Studio Ciudad del Rio | `8106` / `8206` | Studio Ciudad del Rio |

All partners: `type='venue'`, `status='active'`. All locations: `accepts_event_bookings=true`, `is_verified=true`.

**Mamacita extras:** offering `birthday`, package `Rooftop Celebration`. Two additional offerings on Garden + Terrace.

---

## Verification

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
  -v ON_ERROR_STOP=1 \
  -f docs/tasks/testing/scripts/san493-seed-verify.sql
```

**Log:** [`SAN-493-seed-verify.log`](./SAN-493-seed-verify.log)

| Check | Result |
|-------|--------|
| `anon_sees_six_san493_venues` | ✅ PASS (6) |
| `anon_sees_offerings` | ✅ PASS (3) |
| `mamacita_has_package` | ✅ PASS (1) |
| `mamacita_proposal_insert_ok` | ✅ PASS |
| `draft_partner_location_invisible` | ✅ PASS |
| `draft_partner_proposal_fails` | ✅ PASS |
| `six_partners_active_venue` | ✅ PASS |

**Overall:** `ALL PASS`

Idempotent re-run of seed script: ✅ (no errors)

---

## Persona impact (when applied on staging/prod)

| Persona | Effect |
|---------|--------|
| **Camila** | Can browse 6 verified event-capable venues (anon RLS) once UI lands (SAN-494+) |
| **Roberto** | Can target Mamacita for event proposals (`bookings` insert validated) |
| **Patricia** | Seed data ready for admin queue demos — no UI in this PR |

---

## Next

- Merge seed PR → run on staging after SAN-492 remote apply
- Unblocks SAN-494–496 UI chain
- Do **not** seed prod until SAN-492 prod apply + sign-off
