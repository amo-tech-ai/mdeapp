---
id: VEB-MVP-010
linear: SAN-881
linear_url: https://linear.app/sanjiovani/issue/SAN-881/veb-mvp-010-ops-persist-verify-mastra-postgres-workflow-suspend
title: Verify Mastra Postgres storage for workflow suspend durability
status: Done (integration; prod redeploy soak = Tier-2)
priority: P0
phase: launch
class: S
personas: Patricia, Sofía, Lucía
depends_on: [SAN-501, SAN-502]
blocks: []
related: [SAN-501, SAN-502]
skills: [mastra, mde-vercel, task-verifier, testing]
diagram: docs/intelligence/diagrams/14-san-881-ops-persist.mmd
---

# VEB-MVP-010 · OPS-PERSIST — Verify Mastra Postgres workflow suspend durability

**Plan step:** 0.0 (before SAN-494-A2 ship claims on Patricia path)

## Problem

[SAN-501 · EVT-042 — eventVenueBookingWorkflow](https://linear.app/sanjiovani/issue/SAN-501) is **live on `origin/main`**. Mastra suspend snapshots use `getMastraStorage()` → **Postgres when `DATABASE_URL` is set**; otherwise in-memory LibSQL on serverless. Patricia's approve/resume may fail after Vercel redeploy if prod lacks Postgres storage.

## Acceptance criteria

- [x] Vercel **production** has `DATABASE_URL` set (name only in evidence — never log value)
- [x] Boot log shows `[mastra-storage] using Postgres` (not LibSQL `:memory:`) — `PostgresStore` instance assert in integration test
- [x] Workflow **suspend** → simulated cold start → **resume** succeeds — `storage-durability.integration.test.ts` (CI when `VEB_MVP_010_INTEGRATION_ENABLED=true` + `DATABASE_URL` secret)
- [~] Supabase booking row retains `runId` after redeploy — **partial:** `attachWorkflowRunToBooking` covered in `event-venue-booking-workflow.test.ts`; full Camila→Patricia E2E not committed on `main` (see [SAN-502 backend evidence](../../../tasks/testing/evidence/2026-06-10/SAN-502-evt-043-admin-queue-backend-RESULTS.md))
- [ ] Prod redeploy soak (deploy → proposal → Patricia approve after cold start) — **Tier-2 follow-up**
- [x] Evidence: [`docs/tasks/testing/evidence/2026-06-12/SAN-881-VEB-MVP-010-persist-RESULTS.md`](../../../tasks/testing/evidence/2026-06-12/SAN-881-VEB-MVP-010-persist-RESULTS.md)

## Tests

| Layer | Command / check |
|-------|-----------------|
| Config | `vercel env ls production` — `DATABASE_URL` present |
| Unit | `npm test -- --run storage` — `shouldUsePostgresStorage()` |
| Integration | `VEB_MVP_010_INTEGRATION=1 infisical run -- … npm test -- --run storage-durability.integration` |
| CI | `.github/workflows/veb-mvp-010-integration.yml` when repo var `VEB_MVP_010_INTEGRATION_ENABLED=true` |
| Supabase | Snapshot row cleaned in test `afterEach`; booking `runId` via workflow unit tests |
| Mastra | Suspend snapshot readable after cold start |

## Verify

```bash
cd mdeapp && npm test -- --run storage
VEB_MVP_010_INTEGRATION=1 infisical run --silent --env=dev --path=/ -- \
  npm test -- --run storage-durability.integration
# CI: set repository variable VEB_MVP_010_INTEGRATION_ENABLED=true + secret DATABASE_URL
```

## References

- `src/mastra/lib/storage.ts`
- [`13-patricia-workflow-hitl.mmd`](../../../intelligence/diagrams/13-patricia-workflow-hitl.mmd)
- [`14-san-881-ops-persist.mmd`](../../../intelligence/diagrams/14-san-881-ops-persist.mmd)
- [SAN-502 · EVT-043 backend evidence (on main)](../../../tasks/testing/evidence/2026-06-10/SAN-502-evt-043-admin-queue-backend-RESULTS.md)
