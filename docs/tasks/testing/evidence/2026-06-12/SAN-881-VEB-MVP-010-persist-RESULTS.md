# SAN-881 · VEB-MVP-010 · OPS-PERSIST — Mastra Postgres workflow suspend durability

**Date:** 2026-06-12  
**Baseline:** `origin/main` @ `01b0931` (worktree `.worktrees/san-881`)  
**Personas:** Patricia (admin resume), Sofía (storage config), Lucía (evidence)

## Verdict

**PASS** — Production has `DATABASE_URL`; Postgres storage boots in prod mode; suspend snapshots survive a simulated cold start and Patricia resume succeeds. Full prod redeploy soak not re-run in this session (covered by integration test + SAN-502 localhost E2E).

| Check | Result | Detail |
|-------|--------|--------|
| Vercel production `DATABASE_URL` | **PASS** | `vercel env ls production` on `amo100/mdeapp` — name present, value encrypted (not logged) |
| Boot log `[mastra-storage] using Postgres` | **PASS** | Unit test `storage.test.ts` + integration test with `NODE_ENV=production` |
| Suspend → cold start → resume | **PASS** | `storage-durability.integration.test.ts` — reset singleton, reload run by `runId`, approve → `success` (~18s) |
| `metadata.mastra_workflow_run_id` on booking | **PASS** | [SAN-502 evidence 2026-06-11](../2026-06-11/SAN-502-camila-patricia-E2E/) — pending row + run id before Patricia approve |
| Patricia resume HTTP 200 | **PASS** | SAN-502 API-fast E2E — `POST /api/admin/event-bookings` approve |
| Prod runtime log grep | **SKIP** | `vercel logs www.mdeai.co --since 1h` returned no lines; boot line proven via prod-mode integration test |

## Commands run

```bash
# Unit — storage selection (6/6)
cd mdeapp/.worktrees/san-881 && npm test -- --run storage

# Workflow suspend/resume unit (9/9, in-memory LibSQL)
npm test -- --run event-venue-booking-workflow

# Cold-start durability — real Supabase Postgres (1/1, ~18s)
VEB_MVP_010_INTEGRATION=1 infisical run --silent --env=dev --path=/ -- \
  npm test -- --run storage-durability.integration

# Vercel production env (names only)
vercel link --yes --project mdeapp   # amo100/mdeapp
vercel env ls production | rg DATABASE_URL
```

## Integration test (new)

`src/mastra/lib/storage-durability.integration.test.ts` — simulates Vercel redeploy by:

1. Starting `eventVenueBookingWorkflow` with `NODE_ENV=production` + `DATABASE_URL` → **suspended**
2. `resetMastraStorageForTests()` (fresh process singleton)
3. `createRun({ runId })` + `resume` on `suspend-for-admin-review` → **success**

Skipped unless `VEB_MVP_010_INTEGRATION=1` and `DATABASE_URL` are set.

## Related evidence

- [SAN-502 Camila → Patricia API-fast E2E](../2026-06-11/san-502-camila-patricia-api-fast.spec.ts) — proposal → suspend → Patricia approve on localhost
- Diagram: [`14-san-881-ops-persist.mmd`](../../../intelligence/diagrams/14-san-881-ops-persist.mmd)

## Gaps / follow-up

- **Prod redeploy soak:** Trigger a production deployment, submit a proposal on `https://www.mdeai.co`, then Patricia approve after cold start — optional Tier-2 if Patricia reports resume failures in prod.
