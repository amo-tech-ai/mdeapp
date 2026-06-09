---
title: Mastra task audit — top summary (verified)
date: 2026-05-22
verifier: task-verifier + disk + CopilotKit/Mastra skills
overall_plan_score: 88
execution_success: high-if-order-followed
disk_verified: true
---

# Mastra task audit — top summary

Verified against disk, [`task-verifier`](../../.claude/skills/task-verifier/SKILL.md), [CopilotKit×Mastra ref](../../.claude/skills/copilotkit-integrations/references/integrations/mastra.md), and live probes (`/chat` absent, `@mastra/pg` not installed, `userId: null` in logging wrapper).

## Scorecard

| Task | Spec | Will succeed? | Main blocker / risk |
|------|-----:|---------------|---------------------|
| **MASTRA-001** | 88% 🟢 | Yes | Mock-safe Vitest only; add `search-rentals` test |
| **MASTRA-002** | 82% 🟢 | Yes (after MAP-001) | `/chat` does not exist yet |
| **MASTRA-003** | 74% impl / **81% strategic** 🟡 | Later (post-MVP) | `@mastra/pg` + threads; prod cutover gate |
| **MASTRA-004** | 80% 🟢 | Yes | Auth session in `route.ts` |
| **MASTRA-005** | 86% 🟢 | Yes | Avoid false positives; phased `MASTRA_REQUIRE_PG` |

**Overall plan:** **88% correct 🟢** (spec quality post v2 patches)  
**Execution readiness:** **~52%** (platform — MAP-001 + `/chat` missing)  
**Success probability:** **High** if order below is followed.

---

## Critical findings

### 🔴 Biggest blocker

**MAP-001 before MASTRA-002.** Disk: no `mdeapp/src/app/chat/`. Cannot wire `routerAgent` to a surface that does not exist.

### 🟡 Main risk

**Do not rush MASTRA-003.** PostgresStore is post-MVP / pre-prod-cutover only. Router + `/chat` must work first.

### 🟢 Rule that makes this succeed

**Do not build memory/storage before chat shell + router are proven.**

---

## Correct execution order

| Order | Task | Notes |
|------:|------|-------|
| 1 | **MAP-001** | `/chat` shell + map; ships with `pingAgent` |
| 2 | **MASTRA-001** | Can start **in parallel** with MAP-001 (no `/chat` needed) |
| 3 | **MASTRA-002** | Swap `/chat` to nested `routerAgent` |
| 4 | **MASTRA-004** | After MASTRA-001; logged-in proof after MASTRA-002 |
| 5 | **MASTRA-005** | Can run **early** (parallel with MASTRA-001 after F09) |
| 6 | **MASTRA-003** | After [`mvp.md`](../../mvp.md) exit + MASTRA-002 |

---

## Per-task verdict (one line)

| Task | Verdict |
|------|---------|
| MASTRA-001 | ✅ Correct — deterministic CI; no Gemini/prod Supabase |
| MASTRA-002 | ✅ Correct — blocked by MAP-001; grep checks in spec |
| MASTRA-003 | 🟡 Correct plan — highest impl risk; pre-flight `@mastra/pg` probe |
| MASTRA-004 | ✅ Strong — anonymous + logged-in dual path |
| MASTRA-005 | ✅ Add early — `check:mastra` + `MASTRA_REQUIRE_PG=1` after 003 |

---

## Disk truth (2026-05-22)

| Probe | Result |
|-------|--------|
| `/chat` route | ❌ missing |
| `mastra-router-smoke.test.ts` | ❌ not written |
| `search-rentals-logic.test.ts` | ❌ not written |
| `@mastra/pg` | ❌ not in node_modules |
| Pattern 1 runtime | ✅ `getLocalAgentsWithLogging` |
| Agents in Mastra | ✅ 6 registered; UI = `pingAgent` on `/` |
| CopilotKit pin | ✅ 1.55.2 |

---

## CK gap backlog (corrected 2026-05-22)

Forensic pass **85/100** — architecture and sequencing correct; gaps are **executable specs + E2E**, not wrong stack.

| Priority | IDs | Notes |
|----------|-----|-------|
| MVP hard | CK-001, CK-002, CK-004, CK-005, CK-007 | After MAP-001 + MASTRA-002 |
| MVP soft | CK-003, CK-006 | MAP-001 / dev |
| Post-MVP | CK-008 | After MASTRA-003 |

**Not MVP:** collaborative multi-user state, CRDT sync, thread replay, multi-tab sync — see [`plan/mastra/05-mastra-copilotkit.md`](../../../plan/mastra/05-mastra-copilotkit.md) § MVP shared state vs Phase 2+.

---

## References

- Task specs: [`../`](..)
- Verification v2: [`02-mastra-tasks-verification-v2.md`](./02-mastra-tasks-verification-v2.md)
- [CopilotKit Mastra quickstart](https://docs.copilotkit.ai/mastra/quickstart)
- [Mastra storage](https://mastra.ai/docs/memory/storage)
- [CopilotKit #3426](https://github.com/CopilotKit/CopilotKit/issues/3426) (context/state — MASTRA-002 manual smoke)
