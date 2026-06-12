# SAN-881 · VEB-MVP-010 · OPS-PERSIST — Mastra Postgres workflow suspend durability

**Date:** 2026-06-12  
**Branch:** `ai/san-881-veb-mvp-010-persist` (PR #189)  
**Personas:** Patricia (admin resume), Sofía (storage config), Lucía (evidence)

## Verdict

**PASS (integration)** — Production has `DATABASE_URL`; `PostgresStore` boots in prod mode; suspend snapshots survive a simulated cold start and Patricia resume succeeds in integration test. **Prod redeploy soak not run** (Tier-2). **CI regression guard** added — runs when `VEB_MVP_010_INTEGRATION_ENABLED=true` + `DATABASE_URL` secret.

| Check | Result | Detail |
|-------|--------|--------|
| Vercel production `DATABASE_URL` | **PASS** | `vercel env ls production` on `amo100/mdeapp` — name present, value encrypted (not logged) |
| `PostgresStore` in prod mode | **PASS** | `instanceof PostgresStore` + `[mastra-storage] using Postgres` log in integration test |
| Suspend → cold start → resume | **PASS** | `storage-durability.integration.test.ts` — pool closed + snapshot deleted in `afterEach` |
| `metadata.mastra_workflow_run_id` on booking | **PARTIAL** | Workflow unit test mocks `attachWorkflowRunToBooking`; no Camila→Patricia E2E on `main` — see [SAN-502 backend evidence 2026-06-10](../2026-06-10/SAN-502-evt-043-admin-queue-backend-RESULTS.md) |
| Patricia resume HTTP 200 (full E2E) | **NOT IN GIT** | Referenced localhost spec was never committed; admin route covered by SAN-502 unit/route tests on `main` |
| Prod runtime log grep | **SKIP** | `vercel logs www.mdeai.co` empty (account paused); boot proven via integration test |
| CI regression guard | **ADDED** | `.github/workflows/veb-mvp-010-integration.yml` — enable with repo var + `DATABASE_URL` secret |

## Commands run

```bash
# Unit — storage selection (6/6)
npm test -- --run storage

# Workflow suspend/resume unit (9/9, in-memory LibSQL)
npm test -- --run event-venue-booking-workflow

# Cold-start durability — real Supabase Postgres (1/1, ~12–18s)
VEB_MVP_010_INTEGRATION=1 infisical run --silent --env=dev --path=/ -- \
  npm test -- --run storage-durability.integration

# Vercel production env (names only)
vercel env ls production | rg DATABASE_URL
```

## Integration test

`src/mastra/lib/storage-durability.integration.test.ts` — simulates Vercel redeploy by:

1. Starting `eventVenueBookingWorkflow` with `NODE_ENV=production` + `DATABASE_URL` → **suspended**
2. `closeMastraStorageForTests()` (closes Postgres pool + fresh singleton)
3. `createRun({ runId })` + `resume` on `suspend-for-admin-review` → **success**
4. `afterEach` deletes `mastra_workflow_snapshot` row + closes pool

Skipped in default `npm test` unless `VEB_MVP_010_INTEGRATION=1` and `DATABASE_URL` are set.

## Related evidence (on `origin/main`)

- [SAN-502 · EVT-043 admin queue backend](../2026-06-10/SAN-502-evt-043-admin-queue-backend-RESULTS.md)
- [SAN-502 · EVT-043 admin queue page](../2026-06-10/SAN-502-evt-043-admin-queue-page-RESULTS.md)
- Diagram: [`14-san-881-ops-persist.mmd`](../../../intelligence/diagrams/14-san-881-ops-persist.mmd)

## Gaps / follow-up

- **Enable CI:** GitHub repo → Settings → Variables: `VEB_MVP_010_INTEGRATION_ENABLED=true`; Secrets: `DATABASE_URL` (Supabase pooler, same as Vercel prod).
- **Prod redeploy soak:** Deploy → proposal on `https://www.mdeai.co` → Patricia approve after cold start — Tier-2.
- **Vercel merge gate:** Account blocked (Fluid CPU quota) — unrelated to this PR; clear billing before merge.
