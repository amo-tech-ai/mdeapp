# SAN-1104–1108 · PTR-RENTALS-P0 — Backend gate evidence

**Date:** 2026-06-17  
**Class:** C  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/234  
**Verdict:** Backend gate complete — merge PR then `supabase db push` on prod before broker UI uses real data.

## Tasks covered

| Task | Deliverable |
|------|-------------|
| [SAN-1104 · PTR-RENTALS-001 — landlord_id ownership model](https://linear.app/sanjiovani/issue/SAN-1104) | `auth → landlord_profiles → apartments.landlord_id`; `broker_owns_apartment()` |
| [SAN-1105 · PTR-RENTALS-002 — Broker RLS + two-user test](https://linear.app/sanjiovani/issue/SAN-1105) | Dropped `authenticated_can_view_all_apartments`; broker + admin policies |
| [SAN-1106 · PTR-RENTALS-003 — Publish state machine + audit columns](https://linear.app/sanjiovani/issue/SAN-1106) | `listing_workflow_status` FSM; SECURITY DEFINER wrapper RPCs |
| [SAN-1107 · PTR-RENTALS-004 — Onboarding backend writes](https://linear.app/sanjiovani/issue/SAN-1107) | `create_broker_onboarding_draft()` — profile upsert + idempotent draft |
| [SAN-1108 · PTR-RENTALS-005 — Broker empty/loading/error contract](https://linear.app/sanjiovani/issue/SAN-1108) | `src/lib/rentals/` + `mapPublishTransitionFromRpc()` |

## Migrations

| File | Notes |
|------|-------|
| `20260616150000_ptr_rentals_broker_rls.sql` | Broker RLS; `leads_*` includes `is_admin()` bypass |
| `20260616151000_ptr_rentals_publish_fsm.sql` | FSM columns + wrappers; `transition_listing_workflow` not client-callable |
| `20260616152000_ptr_rentals_onboarding.sql` | Atomic profile upsert; reuses existing draft apartment |

## PR #234 review disposition (CodeAnt / CodeRabbit)

| Comment | Valid? | Status |
|---------|--------|--------|
| Legacy `leads_*` policies bypass broker scope | Partial — OR is real; no cross-broker leak without agent/partner role | **Won't drop** — breaks prospect CRM + partner queue; documented in migration |
| `transition_listing_workflow` granted to `authenticated` | Yes | **Fixed** — revoked; SECURITY DEFINER wrappers only (`cefd40c9`) |
| Onboarding creates duplicate drafts | Yes | **Fixed** — reuse existing `draft` row (`67269283`) |
| `PublishTransitionResult` vs RPC snake_case | Yes | **Fixed** — `mapPublishTransitionFromRpc()` |
| `publish_listing` draft→published in one call | Yes | **Fixed** — FSM rejects `draft → published` |
| `formatPublishAuditValue` empty strings | Yes | **Fixed** — delegates to `formatBrokerMetric` |
| Onboarding profile race | Yes | **Fixed** — `ON CONFLICT (user_id) DO NOTHING` |
| Leads missing `is_admin()` bypass | Yes | **Fixed** — `d480fe99` |
| CodeRabbit docstring coverage 0% | Stale | JSDoc on exported helpers; bot threshold false positive |

## Review fixes (PR #234)

- `formatPublishAuditValue` → blank strings show `Data pending.`
- `publish_listing` cannot skip review (`draft → published` rejected)
- `mapPublishTransitionFromRpc` maps snake_case RPC row → `PublishTransitionResult`
- Onboarding: `ON CONFLICT (user_id)` + return existing draft on retry
- Publish wrappers: `SECURITY DEFINER`; generic FSM RPC revoked from `authenticated`

## Tests run

```bash
npm test -- --run src/lib/rentals   # 9/9
npm run typecheck                   # pass
npm run lint                        # pass
```

RLS smoke (`docs/tasks/testing/scripts/ptr-rentals-p0-rls-smoke.sql`):

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 \
  -f docs/tasks/testing/scripts/ptr-rentals-p0-rls-smoke.sql
```

**Result:** 9/9 passed (2026-06-17 local `:54322`).

| Check | Result |
|-------|--------|
| Broker A reads own draft / lead / showing | pass |
| Broker A cannot read Broker B lead / showing | pass |
| `publish_listing_rejects_draft` | pass |
| `publish_fsm_audit` (request → publish, audit cols) | pass |
| Broker B cannot publish Broker A apartment | pass |
| Anon cannot update apartments | pass |

## Known gaps (post-merge)

- Prod migrations not applied until PR #234 merges + `supabase db push`
- `database.types.ts` — regenerate after migrate
- `rental_applications` still uses `host_id` (out of PTR-P0)

## [SAN-1094 · D-12 — Broker Listings + map](https://linear.app/sanjiovani/issue/SAN-1094)

**Unblocked for UI shell + data wiring** after prod migrate. Use `mapPublishTransitionFromRpc()` for publish RPC responses.
