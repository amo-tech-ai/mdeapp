# SAN-869 · VEB-MVP-004 — Bookings Idempotency Migration — RESULTS

**Date:** 2026-06-11  
**Task:** [SAN-869 · VEB-MVP-004 — Bookings idempotency migration](https://linear.app/sanjiovani/issue/SAN-869)  
**PR:** [#176 — SAN-869 · VEB-MVP-004 — Bookings idempotency migration](https://github.com/amo-tech-ai/mdeapp/pull/176) (**merged**)  
**Stack:** dev Supabase · `localhost:3001`

## Verdict

**PASS** — migration is official in repo, column + index live on dev, duplicate submit returns **409**, single row enforced.

| Check | Result | Evidence |
|-------|--------|----------|
| Migration in `supabase/migrations/` | PASS | `20260611160000_veb_mvp_004_bookings_idempotency.sql` |
| `bookings.idempotency_key` column on dev | PASS | manual apply + migration `IF NOT EXISTS` |
| Partial unique index `idx_bookings_idempotency_user` | PASS | dev DB |
| `insertEventProposal` writes column + metadata | PASS | `src/lib/events/event-venue-booking-core.ts` |
| `database.types.ts` includes column | PASS | `bookings.Row.idempotency_key` |
| Vitest `event-venue-booking-core` | PASS | 16/16 (incl. malformed `idempotencyKey`) |
| Vitest `events/proposal` route | PASS | 7/7 |
| First submit | PASS | **200** |
| Second identical submit | PASS | **409** |
| Row count for idempotency key | PASS | **1** |
| Existing non-event bookings unaffected | PASS | nullable column; partial index scope |

## Dev duplicate-submit proof

Script: `scripts/san-869-duplicate-proposal-proof.mjs`

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- node scripts/san-869-duplicate-proposal-proof.mjs
```

**2026-06-11 run:**

| Attempt | HTTP | Body |
|---------|------|------|
| First | 200 | `success: true`, `bookingId: 21126f62-a6b6-47f9-b6a1-234fc1b85446` |
| Second | 409 | `You already submitted this event proposal.` |

- **idempotency_key:** `ep-6f142d911f73097d1e69f52358c4c54f`
- **row count:** 1

Full JSON: [`SAN-869-bookings-idempotency-duplicate-proof.json`](./SAN-869-bookings-idempotency-duplicate-proof.json)

## Tests run

```bash
npm test -- --run event-venue-booking-core events/proposal   # 22/22 pass
npm run lint && npm run typecheck                             # pass
```

`npm run floor` — **not run in worktree** (Turbopack worktree root issue); lint + typecheck + targeted vitest green on this branch.

## Migration rollback (dev/staging only)

```sql
drop index if exists public.idx_bookings_idempotency_user;
alter table public.bookings drop column if exists idempotency_key;
```

## Staging / production

| Env | Status |
|-----|--------|
| Dev | ✅ column + index applied; duplicate proof captured |
| Staging | ⬜ apply migration via Supabase deploy; re-run duplicate script |
| Production | ⬜ apply migration before prod Camila proposal validation |

## Related merged work

- [SAN-496 · EVT-037 — Request Proposal Modal](https://linear.app/sanjiovani/issue/SAN-496) — insert path
- [SAN-501 · EVT-042 — eventVenueBookingWorkflow](https://linear.app/sanjiovani/issue/SAN-501) — Patricia suspend
- [SAN-502 · EVT-043 — Patricia admin event-requests queue](https://linear.app/sanjiovani/issue/SAN-502) — approve path
- E2E proof: `docs/tasks/testing/evidence/2026-06-11/SAN-502-camila-patricia-E2E/`

## Next gate

Production validation (Camila submit + Patricia approve on `mdeai.co`) — **after** staging migration apply.

**Do not start** [SAN-497 · EVT-038 — eventVenueAgent + search/rank tools](https://linear.app/sanjiovani/issue/SAN-497) or [SAN-498 · EVT-039 — Venue match score panel](https://linear.app/sanjiovani/issue/SAN-498) until prod validation is planned.
