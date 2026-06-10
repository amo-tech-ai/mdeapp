---
title: MIS Mastra task index (local + Linear)
updated: 2026-05-31
linear_sync: node scripts/linear-import-intelligence-tasks.mjs
linear_log: ../linear/intelligence-import-log.json
---

# MIS × Mastra — task spec locations

**Rule:** Executable app specs live under `tasks/data/tasks-data/`. Routing/doc specs live under `tasks/mastra/`. Linear sync via `scripts/linear-import-intelligence-tasks.mjs`.

## Phase 1 (MIS-M1) — Done / gate

| ID | Local spec | Layer | Status | Linear |
|----|------------|-------|--------|--------|
| SEARCH-003 | [`../data/tasks-data/SEARCH-003-restaurant-hybrid.md`](../data/tasks-data/SEARCH-003-restaurant-hybrid.md) | APP | Done | SAN-388 |
| MASTRA-MIS-001 | [`MASTRA-MIS-001-routing-canonical.md`](./MASTRA-MIS-001-routing-canonical.md) | DOC | Approved | SAN-426 Done |

## Phase 1b (after Patricia DATA-041 QA)

| ID | Local spec | Layer | Status | Linear |
|----|------------|-------|--------|--------|
| SEARCH-001 | [`../data/tasks-data/SEARCH-001-rental-hybrid.md`](../data/tasks-data/SEARCH-001-rental-hybrid.md) | APP | Not Started | SAN-386 |
| SEARCH-002 | [`../data/tasks-data/SEARCH-002-event-hybrid.md`](../data/tasks-data/SEARCH-002-event-hybrid.md) | APP | Not Started | SAN-387 |
| AI-003 | [`../data/tasks-data/AI-003-signal-enrichment.md`](../data/tasks-data/AI-003-signal-enrichment.md) | BATCH | Not Started | SAN-395 |
| AI-004 | [`../data/tasks-data/AI-004-grounding-verify.md`](../data/tasks-data/AI-004-grounding-verify.md) | BATCH | Not Started | SAN-396 |
| DATA-046 | [`../data/tasks-data/DATA-046-golden-queries-v2.md`](../data/tasks-data/DATA-046-golden-queries-v2.md) | TEST | Not Started | SAN-384 |

## Also indexed in

- [`../data/tasks-data/INDEX-data.md`](../data/tasks-data/INDEX-data.md) — DATA + SEARCH + AI rows
- [`progress-mastra.md`](./progress-mastra.md) — live tracker
- [`../linear/intelligence-queue.json`](../linear/intelligence-queue.json) — execution order

## Verify

```bash
# Local specs exist
ls tasks/data/tasks-data/SEARCH-*.md tasks/data/tasks-data/AI-00*.md tasks/data/tasks-data/DATA-046*.md
ls tasks/mastra/MASTRA-MIS-001-routing-canonical.md

# Linear sync
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-import-intelligence-tasks.mjs --audit
node scripts/linear-import-intelligence-tasks.mjs
grep -E 'SEARCH-00|AI-00|DATA-046|MASTRA-MIS' tasks/linear/intelligence-import-log.json
```
