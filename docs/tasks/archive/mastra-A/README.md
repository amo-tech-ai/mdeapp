---
title: Mastra — archived (Done / Superseded)
updated: 2026-05-26
active_folder: ../../mastra/INDEX.md
---

# Mastra task archive

**5 MASTRA specs** archived **2026-05-26**. All executable Mastra platform tasks in Phase 1 are closed.

**Active folder:** [`../../mastra/`](../../mastra/INDEX.md) — crosswalk + coverage notes only (no open MASTRA-### specs).

---

## Completion verdict (verified 2026-05-26)

| ID | Status | Working? | Evidence |
|----|--------|:--------:|----------|
| **MASTRA-001** | Done | **Yes** — `npm test` 296/296 | [`tasks/evidence/MASTRA-001-evidence.md`](../../evidence/MASTRA-001-evidence.md) |
| **MASTRA-002** | Superseded | N/A — F19 `conciergeAgent` on `/` | Do not execute |
| **MASTRA-003** | Done | **Yes** — `PostgresStore` when `DATABASE_URL` | [`tasks/evidence/mastra-003-prod-storage-evidence.md`](../../evidence/mastra-003-prod-storage-evidence.md) |
| **MASTRA-004** | Done | **Yes** — `withAudit` via `run-audited-search.ts` | [`tasks/evidence/MASTRA-004-evidence.md`](../../evidence/MASTRA-004-evidence.md) |
| **MASTRA-005** | Done | **Yes** — `npm run check:mastra` exit 0 | [`tasks/evidence/MASTRA-005-evidence.md`](../../evidence/MASTRA-005-evidence.md) |

**`tasks/mastra/` folder:** **100% of MASTRA-### specs complete** (4 Done + 1 Superseded).

Future Mastra work ships as **F-series**, **MAP**, **SCREEN**, or **agent/** tasks — not new MASTRA-006+ unless a new platform gap is filed.

---

## Archived files

| ID | File |
|----|------|
| MASTRA-001 | [MASTRA-001-core-wiring-smoke.md](./MASTRA-001-core-wiring-smoke.md) |
| MASTRA-002 | [MASTRA-002-router-agent-on-chat.md](./MASTRA-002-router-agent-on-chat.md) — **Superseded** by F19 |
| MASTRA-003 | [MASTRA-003-postgres-storage.md](./MASTRA-003-postgres-storage.md) |
| MASTRA-004 | [MASTRA-004-ai-runs-audit-coverage.md](./MASTRA-004-ai-runs-audit-coverage.md) |
| MASTRA-005 | [MASTRA-005-mastra-pr-gate.md](./MASTRA-005-mastra-pr-gate.md) |

Planning canon (read-only): [`plan/mastra/`](../../../plan/mastra/)
