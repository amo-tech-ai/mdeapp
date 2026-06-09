---
title: Mastra — active folder
updated: 2026-05-31
archived_specs: ../archive/mastra-A/README.md
---

# Mastra tasks

> **MASTRA-001–005 archived** → [`../archive/mastra-A/`](../archive/mastra-A/README.md).  
> **MIS Phase 1/1b specs** → [`MIS-TASKS-INDEX.md`](./MIS-TASKS-INDEX.md) (SEARCH + AI + routing doc).

---

## Status (2026-05-31)

| Area | State |
|------|--------|
| MASTRA-001–005 | **100% closed** — archived |
| MIS SEARCH-003 | **Done** — hybrid restaurants live |
| MASTRA-MIS-001 | **Approved** — routing doc; Linear sync |
| Phase 1b | SEARCH-001/002, AI-003/004, DATA-046 specced |

**Verify:**

```bash
cd mdeapp && npm run verify:mis-phase1 && npm run smoke:golden-queries && npm run check:mastra
node scripts/linear-import-intelligence-tasks.mjs --audit
```

---

## Files in this folder

| File | Purpose |
|------|---------|
| [`plan/1-agents-plan.md`](./plan/1-agents-plan.md) | **Mastra Agent Adoption Plan v2** — AGT-00…12 roadmap, re-prioritized for launch (epic **SAN-588**) |
| [`plan/2-mastra-surface-gap-analysis.md`](./plan/2-mastra-surface-gap-analysis.md) | **Full-surface gap analysis** — Memory · Workflows · Streaming · Workspace · RAG; adds AGT-13…16, ~25% adoption verdict |
| [`plan/index-mastra.md`](./plan/index-mastra.md) | **Implementation-order index** — all 24 AGT tasks in build order + purpose · feature · grade (the table to work from) |
| [`audit/june-5-mastra-tasks.md`](./audit/june-5-mastra-tasks.md) | **Backlog spec audit** — per-task spec %/dot, 88% aggregate, corrections (drove the 2026-06-06 fixes) |
| [`MIS-TASKS-INDEX.md`](./MIS-TASKS-INDEX.md) | **Local + Linear map** for SEARCH/AI/MIS tasks |
| [`progress-mastra.md`](./progress-mastra.md) | Live MIS × Mastra progress tracker |
| [`MASTRA-MIS-001-routing-canonical.md`](./MASTRA-MIS-001-routing-canonical.md) | Production routing: `/` = conciergeAgent only |
| [`partners/AGT-PTR-INDEX.md`](./partners/AGT-PTR-INDEX.md) | **Partners AI** — SAN-705–711 disk specs (parent SAN-685) |
| [`audit/MIS-MASTRA-AUDIT-2026-05-31.md`](./audit/MIS-MASTRA-AUDIT-2026-05-31.md) | Latest forensic audit |
| [`../archive/mastra-A/README.md`](../archive/mastra-A/README.md) | Done MASTRA specs + evidence |
| [`CROSSWALK-ck-ui-e2e-state.md`](./CROSSWALK-ck-ui-e2e-state.md) | MASTRA ↔ CK ↔ F/MAP alias map |

**Planning:** [`plan/mastra/`](../../plan/mastra/) · **Master index:** [`../INDEX.md`](../INDEX.md)

---

## Registered inventory (`mdeapp/src/mastra/`)

Quick reference — full detail in archive specs.

| Key | Role |
|-----|------|
| `conciergeAgent` | Default on `/` (F19) |
| `routerAgent` | Intent routing (F18) |
| `rentalAgent` / `eventAgent` | Search + cards |
| `evaluationAgent` | Dev only (F20) |
| `hostEventAgent` | `/host/event/new` HITL wizard |
| `partnerAgent` | **Not built** — AGT-PTR-01 / SAN-705 |

**Pattern 1:** `POST /api/copilotkit` → `getLocalAgentsWithLogging({ mastra })`
