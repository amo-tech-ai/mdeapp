---
id: VEB-MVP-010
linear: SAN-881
linear_url: https://linear.app/sanjiovani/issue/SAN-881/veb-mvp-010-ops-persist-verify-mastra-postgres-workflow-suspend
title: Verify Mastra Postgres storage for workflow suspend durability
status: Done
priority: P0
phase: launch
class: S
personas: Patricia, Sofía, Lucía
depends_on: [SAN-501, SAN-502]
blocks: []
related: [SAN-501, SAN-502]
skills: [mastra, mde-vercel, task-verifier, testing]
source: docs/intelligence/AGENT/05-agent-plan.md Phase 0.0
diagram: docs/intelligence/diagrams/13-patricia-workflow-hitl.mmd
---

# VEB-MVP-010 · OPS-PERSIST — Verify Mastra Postgres workflow suspend durability

**Plan step:** 0.0 (before SAN-494-A2 ship claims on Patricia path)

## Problem

[SAN-501 · EVT-042 — eventVenueBookingWorkflow](https://linear.app/sanjiovani/issue/SAN-501) is **live on `origin/main`**. Mastra suspend snapshots use `getMastraStorage()` → **Postgres when `DATABASE_URL` is set**; otherwise in-memory LibSQL on serverless. Patricia's approve/resume may fail after Vercel redeploy if prod lacks Postgres storage.

## Acceptance criteria

- [x] Vercel **production** (and preview used for soak) has `DATABASE_URL` set (name only in evidence — never log value)
- [x] Boot log shows `[mastra-storage] using Postgres` (not LibSQL `:memory:`)
- [x] Camila proposal → workflow **suspend** → redeploy/preview restart → Patricia **resume** succeeds (integration cold-start + SAN-502 E2E)
- [x] Supabase booking row retains `runId` linkage after redeploy (SAN-502 booking metadata proof)
- [x] Evidence: [`docs/tasks/testing/evidence/2026-06-12/SAN-881-VEB-MVP-010-persist-RESULTS.md`](../../../tasks/testing/evidence/2026-06-12/SAN-881-VEB-MVP-010-persist-RESULTS.md)

## Tests

| Layer | Command / check |
|-------|-----------------|
| Config | `vercel env ls production` — `DATABASE_URL` present |
| Unit | `npm test -- --run storage` — `shouldUsePostgresStorage()` |
| E2E | Playwright or manual: proposal → admin queue → suspend → redeploy → approve |
| Integration | `VEB_MVP_010_INTEGRATION=1 infisical run -- … npm test -- --run storage-durability.integration` |
| Supabase | Booking row has workflow `runId`; status transitions after resume |
| Mastra | Suspend snapshot readable after cold start |

## Verify

```bash
cd mdeapp && npm test -- --run storage
# prod/preview: grep mastra-storage in runtime logs
# E2E: e2e/san-501-* or Patricia admin flow evidence
```

## References

- `src/mastra/lib/storage.ts`
- [`05-agent-plan.md`](../../../intelligence/AGENT/05-agent-plan.md) §0.0
- [`13-patricia-workflow-hitl.mmd`](../../../intelligence/diagrams/13-patricia-workflow-hitl.mmd)
