# SAN-492 · EVT-033 — Pre-implementation audit

**Date:** 2026-06-08  
**Linear:** [SAN-492](https://linear.app/sanjiovani/issue/SAN-492/evt-033-event-venue-offerings-schema)  
**Spec:** [`tasks/venues/tasks/event-booking/VEB-001-core-event-venue-offerings-schema.md`](../../../venues/tasks/event-booking/VEB-001-core-event-venue-offerings-schema.md)  
**Gate:** Phase A closed · **audit only — no migration code**

---

## Skills loaded

`task-verifier` · `mde-supabase` · `testing` · `mde-task-lifecycle` · `mde-worktree-pr-flow`

---

## Schema verification (Supabase MCP)

| Table | Exists | RLS | Policies | Notes |
|-------|:------:|:---:|:--------:|-------|
| `event_venues` | ✅ | ✅ | 2 (`venues_public_select`, `venues_owner_all`) | **Roberto ticketed-event venues** — used by SAN-135 |
| `restaurants` | ✅ | ✅ | 6 | Tourist dining spine |
| `venue_booking_requests` | ✅ | ✅ | 3 | Table/café bookings — **no `booking_kind` column yet** |
| `venue_anchors` | ✅ | — | — | Maps/Places anchors |
| **`venues`** | ❌ | — | — | **Proposed in VEB-001 — not created** |
| **`venue_event_offerings`** | ❌ | — | — | **Target of SAN-492** |
| **`venue_event_packages`** | ❌ | — | — | **Target of SAN-492** |

### `venue_booking_requests` columns (live)

`id`, `user_id`, `venue_kind`, `place_id`, `restaurant_id`, `venue_anchor_id`, `party_size`, `requested_at`, contact fields, `status`, `source`, `idempotency_key`, `metadata`, timestamps.

**Gap vs VEB-001:** no `event_type`, `budget`, `booking_kind=event_proposal` — needs **extend** migration, not new table only.

---

## Naming conflicts / risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **`event_venues` vs `venues`** | 🔴 | VEB-001 ERD uses `venues`; disk has `event_venues` for ticketed events. **Pick one master** in migration PR: extend `restaurants` + offerings FK, or new `venues` with clear comment split from `event_venues`. |
| **`venue_event_offerings` name** | 🟡 | Spec name OK; ensure no clash with `event_venues` in agent tools/docs. |
| **Dual booking spines** | 🟡 | `venue_booking_requests` serves café/table; event proposals must not break existing RLS/tests. |
| **Migration ordering** | 🟡 | Apply after `9971bb8` (SAN-135 backfill migration `20260608120000_*` already on remote). |

---

## Readiness score

| Area | Score | Notes |
|------|------:|-------|
| Spec clarity (VEB-001) | 88 | ERD + RLS rules documented |
| Existing data | 72 | `restaurants` + `venue_booking_requests` exist; offerings tables missing |
| Security (RLS template) | 85 | Patterns exist on adjacent tables |
| Naming / conflict resolution | 58 | **`event_venues` vs `venues` decision required before DDL** |
| Test readiness | 80 | RLS smoke + Supabase MCP verify in spec |
| Rollback clarity | 75 | New tables only — rollback = DROP in reverse order |

| Metric | Value |
|--------|------:|
| **Readiness /100** | **78** |
| **Success rate (est.)** | **76%** without naming decision · **88%** after decision doc in PR |

---

## Verdict

| Question | Answer |
|----------|--------|
| **GO / HOLD** | **HOLD for implementation** · **GO for planning PR** after naming decision |
| **Blocker** | Resolve `event_venues` vs new `venues` master in VEB-001 §Tables |
| **Safe to write migration?** | **No** until decision + ledger row C-### |

---

## Migration plan (draft — do not apply)

1. **Decision doc** in PR: `restaurants`-centric vs new `venues` table (recommend: **`venues` view/table linked to `restaurants.id`** to avoid duplicating Mamacita rows).
2. `CREATE TABLE venue_event_offerings (...)` + RLS public read verified venues.
3. `CREATE TABLE venue_event_packages (...)` + RLS.
4. `ALTER TABLE venue_booking_requests ADD booking_kind, event_type, budget` (nullable; default preserves café rows).
5. Seed Mamacita-shaped row (SAN-493 depends on this).

**Rollback:** single migration file with `DOWN` section or companion rollback SQL dropping new tables + columns.

---

## Test plan (post-migration)

```bash
cd mdeapp && npm test -- --run supabase   # RLS smoke
# Supabase MCP: venue_event_offerings + venue_event_packages rls_enabled + policy_count >= 1
# Anon SELECT offerings for verified venue; anon cannot read other users' booking requests
```

---

## Rollback plan

1. Revert app code (none in SAN-492 — data only).
2. Run rollback migration: drop FKs → drop `venue_event_packages` → drop `venue_event_offerings` → revert `venue_booking_requests` columns.
3. Re-verify `venue_booking_requests` café insert path (Vitest + manual).

---

## Expected order (unchanged)

SAN-135 ✅ → Gate Audit ✅ → **SAN-492 audit** → SAN-492 impl → 493 → 510 → 511 → 494 → 495 → 496
