# PTR-RENTALS-P0 — Backend gate evidence (SAN-1104–1108)

**Date:** 2026-06-16  
**Class:** C  
**Verdict:** Backend gate implemented — broker UI (SAN-1094) may proceed with mocks + real data wiring.

## Ownership model (SAN-1104 · PTR-RENTALS-001)

```text
auth.users.id
  → landlord_profiles.user_id
  → landlord_profiles.id
  → apartments.landlord_id
```

Helper: `acting_landlord_ids()` (existing) + `broker_owns_apartment(uuid)` (new).

## Migrations

| File | Task |
|------|------|
| `supabase/migrations/20260616150000_ptr_rentals_broker_rls.sql` | SAN-1105 — broker RLS |
| `supabase/migrations/20260616151000_ptr_rentals_publish_fsm.sql` | SAN-1106 — workflow FSM + RPCs |
| `supabase/migrations/20260616152000_ptr_rentals_onboarding.sql` | SAN-1107 — onboarding RPC |

## Policies changed (SAN-1105)

| Table | Change |
|-------|--------|
| `apartments` | Dropped `authenticated_can_view_all_apartments`; added broker SELECT/INSERT/UPDATE |
| `leads` | Added `leads_select_broker_listing`, `leads_update_broker_listing` |
| `showings` | Replaced host-only path with `landlord_id IN acting_landlord_ids()` |

Public browse: `anyone_can_view_active_apartments` unchanged (anon + auth catalog).

## Publish FSM (SAN-1106)

Column: `listing_workflow_status` — `draft | ready_for_review | published | paused | rejected`

Audit: `published_at`, `published_by`, `paused_at`, `rejection_reason`, `ready_for_review_at`

RPCs: `request_listing_publish`, `publish_listing`, `pause_listing`, `transition_listing_workflow`

## Onboarding (SAN-1107)

RPC: `create_broker_onboarding_draft(display_name, listing_title?, neighborhood?)`  
Creates `landlord_profiles` if missing + first draft apartment (`listing_workflow_status = draft`).

## TypeScript (SAN-1108)

`src/lib/rentals/` — `broker-surface-state.ts`, `listing-workflow.ts`, `data-pending.ts`, `index.ts`

## Tests run

```bash
npm test -- --run src/lib/rentals
npm test -- --run admin-leads
```

RLS smoke (local `:54322`, migrations applied):

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 \
  -f docs/tasks/testing/scripts/ptr-rentals-p0-rls-smoke.sql
```

**Result:** 8/8 passed (2026-06-16 local run).

## Two-user matrix (smoke script)

| Check | Expected |
|-------|----------|
| Broker A reads own draft apartment | pass |
| Broker A cannot read Broker B lead | pass |
| Broker A reads own lead/showing | pass |
| Broker A cannot read Broker B showing | pass |
| Publish FSM writes `published_at` / `published_by` | pass |
| Broker B cannot publish Broker A apartment | pass |
| Anon cannot update apartments | pass |

## Known gaps

- `rental_applications` still uses legacy `host_id` path (out of PTR-P0 scope).
- `database.types.ts` not regenerated — run typegen after migration apply on dev/prod.

## SAN-1094 · D-12 — Broker Listings + map

**Unblocked for shell + data wiring** — backend ownership, RLS, publish FSM, and state contracts exist. UI may use mocks until migrations land on dev/prod.
