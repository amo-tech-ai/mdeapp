---
title: my-mastra-app → mdeapp port coverage matrix
updated: 2026-05-22
legacy_root: /home/sk/mde/my-mastra-app/src/mastra
mdeapp_root: /home/sk/mdeai/mdeapp/src/mastra
plan: ../../plan/05-path-a-mastra-migration.md
tasks_index: ./INDEX.md
---

# my-mastra-app coverage matrix

> **Reference doc only** — not an executable task. Updated against disk 2026-05-22.

## Easy summary

| | |
|---|---|
| **In one line** | Checklist: legacy `my-mastra-app` vs **`mdeapp/src/mastra`** today. |
| **Who cares** | **Sofía** · anyone asking “why is `/` still ping?” |

**Reality:** `mdeapp` registers **6 agents + 3 workflows + 5 tools** in code. **UI** uses **`pingAgent` on `/` only**. **`/chat`** does not exist until **MAP-001**; **`routerAgent`** on `/chat` is **MASTRA-002**.

**MVP path:** MAP-001 → MASTRA-001 → MASTRA-002 → F46 rental cards — not full Path A port.

---

```text
/home/sk/mde/my-mastra-app/  → 7 agents, 4 workflows (legacy, frozen)
/home/sk/mdeai/mdeapp/       → 6 agents, 3 workflows, 5 tools in index.ts
                               UI: pingAgent on / only; /chat missing
```

---

## Agents

| Legacy file | Agent id | In mdeapp `index.ts`? | Wired to UI? | mdeai task |
|-------------|----------|----------------------|--------------|------------|
| `agents/ping.ts` | ping | ✅ `pingAgent` | ✅ `/` | F02 Done |
| `agents/router.ts` | router | ✅ `routerAgent` | ❌ | **MASTRA-002** |
| `agents/rental-agent.ts` | rental | ✅ `rentalAgent` | ❌ | via workflow F46 |
| `agents/event-agent.ts` | event | ✅ `eventAgent` | ❌ | F14 defer |
| `agents/concierge.ts` | concierge | ✅ `conciergeAgent` | ❌ | F19 defer |
| `agents/evaluation.ts` | evaluation | ✅ `evaluationAgent` | ❌ | F20 scorers |
| `agents/weather-agent.ts` | weather | ❌ skip | — | — |
| — | **hostEventAgent** | ❌ | ❌ | **F34** |

---

## Tools

| Legacy file | In mdeapp? | Task | Notes |
|-------------|------------|------|-------|
| `tools/audit-wrapper.ts` | ✅ | F13 Done | MASTRA-004 wraps search tools |
| `tools/risk-levels.ts` | ✅ | F13 Done | |
| `tools/classify-intent.ts` | ✅ | MASTRA-001 | Vitest pending |
| `tools/search-events.ts` | ✅ | F15 defer | logic test exists |
| `tools/search-rentals.ts` | ✅ | MASTRA-001 / F46 | logic test **missing** |
| `tools/search-restaurants.ts` | ✅ | F19 | logic test exists |
| `tools/search-attractions.ts` | ✅ | F19 | logic test exists |
| `tools/weather-tool.ts` | ❌ skip | — | |
| `search-grounded-places.ts` | ❌ | **MAP-002** | build fresh |

`mdeapp/src/mastra/tools/index.ts` — re-export stub; tools registered on agents directly.

---

## Workflows

| Legacy file | In mdeapp? | On `routerAgent`? | Task |
|-------------|------------|-------------------|------|
| `rental-search-workflow.ts` | ✅ | ✅ | MASTRA-001 smoke |
| `event-discovery-workflow.ts` | ✅ | ✅ | MASTRA-001 smoke |
| `concierge-routing-workflow.ts` | ✅ | ❌ | F19 |
| `weather-workflow.ts` | ❌ skip | — | — |

---

## Lib / infra

| Legacy | mdeapp | Task | Status |
|--------|--------|------|--------|
| `lib/ai-runs.ts` | ✅ `log-agent-run.ts` | F13 | Done |
| `lib/models.ts` | ✅ `lib/models.ts` | — | `gemini-3.5-flash` |
| Postgres storage | ❌ | **MASTRA-003** | `:memory:` + file DB |
| `logging-mastra-agent.ts` | ✅ | F13 | `userId: null` → MASTRA-004 |

---

## Next ports that matter for MVP

| Order | Task | Outcome |
|------:|------|---------|
| 1 | MAP-001 | `/chat` + map + pingAgent test pins |
| 2 | MASTRA-001 | Vitest router/workflow |
| 3 | MASTRA-002 | `routerAgent` on `/chat` |
| 4 | F46 | Rental cards + pins on map |
| 5 | MASTRA-003 | PostgresStore (post MVP exit) |

Full order: [`INDEX.md`](./INDEX.md).
