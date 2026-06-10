---
title: MASTRA-001…005 task spec verification
date: 2026-05-22
verifier: task-verifier + disk probes
spec_score_avg: 78
execution_readiness_avg: 72
safe_to_execute: conditional
---

# Mastra task verification report

Forensic review of [`tasks/mastra/`](../) against disk, CopilotKit/Mastra integration docs, and [`CLAUDE.md`](../../../CLAUDE.md). **Not 100% correct** — several specs need patches before execution (listed below). **None are safe to mark Done** (all `Not Started`).

## Verdict summary

| Task | Spec | Exec ready | Safe to run? | Grade |
|------|------:|-----------:|--------------|-------|
| [MASTRA-001](../MASTRA-001-core-wiring-smoke.md) | 82 | 80 | ✅ Yes (after minor spec patch) | B |
| [MASTRA-002](../MASTRA-002-router-agent-on-chat.md) | 72 | 65 | ⚠️ After MAP-001 + spec patch | C+ |
| [MASTRA-003](../MASTRA-003-postgres-storage.md) | 75 | 68 | ⚠️ Post-MVP; package gap | C |
| [MASTRA-004](../MASTRA-004-ai-runs-audit-coverage.md) | 85 | 82 | ✅ Yes | B+ |
| [MASTRA-005](../MASTRA-005-mastra-pr-gate.md) | 88 | 88 | ✅ Yes | B+ |
| [my-mastra-app-coverage](../my-mastra-app-coverage.md) | 55 | N/A | 📋 Reference only — **stale** | D |

**Average spec quality:** ~78/100 — good intent and personas; gaps are CopilotKit wiring detail, storage surface area, and dependency slug hygiene.

---

## Integration law (verified)

| Claim | Probe | Result |
|-------|-------|--------|
| Pattern 1 in mdeapp | `mdeapp/src/app/api/copilotkit/route.ts` uses `getLocalAgentsWithLogging` | ✅ |
| CopilotKit 1.55.2 | `package.json` `@copilotkit/*": "1.55.2"` | ✅ |
| `useCoAgent` key = Mastra map key | `layout.tsx` `agent="pingAgent"` · `page.tsx` `name: "pingAgent"` · `mastra/index.ts` has `pingAgent`, `routerAgent`, … | ✅ |
| Gemini model | `FLASH_MODEL` / `gemini-3.5-flash` in agents | ✅ |
| `/chat` exists | `ls mdeapp/src/app/chat/` | ❌ **Missing** — MAP-001 prerequisite correct |

Ref: [`.claude/skills/copilotkit-integrations/references/integrations/mastra.md`](../../../.claude/skills/copilotkit-integrations/references/integrations/mastra.md)

---

## Per-task findings

### MASTRA-001 — Core wiring smoke

**Verified ✅**

- `mastra/index.ts` registers `routerAgent` + 3 workflows + 6 agents.
- `router.ts` has `tools: { classifyIntentTool }`, `workflows: { rentalSearchWorkflow, eventDiscoveryWorkflow }`.
- `npm test` / `floor` scripts exist; tool tests under `src/mastra/tools/__tests__/`.
- F09 + F13 tasks exist and F13 is Done per INDEX.

**Errors / gaps 🔴🟡**

| ID | Severity | Issue |
|----|----------|-------|
| M1-1 | 🟡 | `depends_on: [F09, F13]` — use full slugs `F09-floor-script-and-vitest.md` per task-verifier §3. |
| M1-2 | 🟡 | No `mastra-router-smoke.test.ts` yet — accurate target; **no** `classify-intent` tests in `__tests__/` today (only tool logic tests). |
| M1-3 | 🟢 | Easy summary says “progres reads 0 tools” — **stale narrative**; code has 5 tools. Task text is correct. |
| M1-4 | 🟡 | `conciergeRoutingWorkflow` registered but not in router’s `workflows` — OK for MVP; smoke should not assume concierge dispatch from router. |

**Persona:** Sofía gets CI proof before Camila’s router path hits `/chat`.

---

### MASTRA-002 — Router on `/chat`

**Verified ✅**

- MAP-001 dependency is correct (`/chat` absent on disk).
- `log-agent-run.ts` maps `routerAgent` → `agent_name: "router-agent"` — matches AC SQL/evidence.
- Runtime exposes **all** agents via `getLocalAgentsWithLogging` — CopilotKit still selects agent via **provider** `agent` prop.

**Errors / gaps 🔴**

| ID | Severity | Issue |
|----|----------|-------|
| M2-1 | 🔴 | Root `layout.tsx` sets `<CopilotKit agent="pingAgent">` for **entire app**. Changing only `useCoAgent` on `/chat` **without** a route-level `<CopilotKit agent="routerAgent">` (e.g. `app/chat/layout.tsx`) leaves `/chat` on **pingAgent**. Spec must require **nested provider** (same pattern as F36 in changelog). |
| M2-2 | 🟡 | `target_files` lists `layout.tsx` — misleading; prefer `app/chat/layout.tsx` + `app/chat/page.tsx`. |
| M2-3 | 🟡 | `routerAgent` has **no** `memory` block — `useCoAgent` initial state minimal is fine; document in AC. |
| M2-4 | 🟡 | `blocks: [MASTRA-003]` — OK if “downstream”; MASTRA-003 also needs `depends_on: MVP exit` — ordering clear in INDEX. |

**CopilotKit doc:** [Shared state / agent prop](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) — agent string must match `Mastra({ agents })` key exactly: `routerAgent`.

**Persona:** Camila on `/chat` must not still hit echo bot.

---

### MASTRA-003 — PostgresStore

**Verified ✅**

- `mastra/index.ts` uses `LibSQLStore({ url: ":memory:" })` — problem statement accurate.
- `agent-memory.ts` uses **separate** `file:mastra-agent-memory.db` — also must migrate.
- `pingAgent` in `agents/index.ts` uses `LibSQLStore file::memory:` — third store to unify.
- Supabase `mastra_messages` table exists (audit).

**Errors / gaps 🔴🟡**

| ID | Severity | Issue |
|----|----------|-------|
| M3-1 | 🔴 | `PostgresStore` import is from **`@mastra/pg`** per [`plan/mastra/examples/features/08-storage.md`](../../../plan/mastra/examples/features/08-storage.md) — **not** in `mdeapp/package.json` today. AC must add `npm install @mastra/pg` (or verified export path) + `floor` after install. |
| M3-2 | 🔴 | `target_files` incomplete — add `mdeapp/src/mastra/agents/index.ts` (ping memory), `package.json`. |
| M3-3 | 🟡 | **F20** says “defer PostgresStore to W9 follow-on” while MASTRA-003 owns storage — add line in both: **MASTRA-003 = storage; F20 = scorers/spans only**. |
| M3-4 | 🟡 | `depends_on: [MASTRA-002]` only — should also list **MVP exit** per INDEX (or drop duplicate in INDEX). |
| M3-5 | 🟡 | Mastra MCP search returned no PostgresStore snippet — use [`08-storage.md`](../../../plan/mastra/examples/features/08-storage.md) + legacy drafts; probe `@mastra/pg` at install time. |

**Persona:** Camila’s thread survives redeploy.

---

### MASTRA-004 — ai_runs + audit

**Verified ✅**

- F13 Done; `LoggingMastraAgent` exists.
- **`userId: null` hardcoded** in `logging-mastra-agent.ts:53` — task purpose is accurate.
- `withAudit` exists; search tools do **not** import it yet.

**Errors / gaps 🟡**

| ID | Severity | Issue |
|----|----------|-------|
| M4-1 | 🟡 | `target_files` should list `mdeapp/src/mastra/copilotkit/logging-mastra-agent.ts` as **primary** (not only `route.ts`). |
| M4-2 | 🟡 | AC should probe `agent_type` enum via SQL before new labels (task-verifier §2c). `router-agent` → `concierge` already in `AGENT_MAP_KEY_TO_LOGGING`. |
| M4-3 | 🟢 | `evaluationAgent` not in logging map — OK; not user-facing. |

**Persona:** Patricia ties support tickets to Camila’s account.

---

### MASTRA-005 — PR gate

**Verified ✅**

- F09 Done; `floor` exists.
- `check:mastra` does not exist — task is to create/document it.
- Playbook [14-mastra-system-check](../../../plan/mastra/github/14-mastra-system-check.md) exists.

**Errors / gaps 🟡**

| ID | Severity | Issue |
|----|----------|-------|
| M5-1 | 🟡 | After MASTRA-003, gate should fail on `:memory:` — task mentions this; good. |
| M5-2 | 🟢 | `depends_on: [F09]` only — could run in parallel with MASTRA-001. |

**Persona:** Sofía avoids silent agent name mismatch.

---

### my-mastra-app-coverage.md

| ID | Severity | Issue |
|----|----------|-------|
| MC-1 | 🔴 | Says “mdeapp → 1 agent (pingAgent)” — **stale**. Studio lists **6** registered agents; only **UI** uses `pingAgent`. |
| MC-2 | 🟡 | Router row says “F18” — MVP path is **MASTRA-001/002**; F18 partially superseded. |

---

## Recommended spec patches (before execution)

1. **MASTRA-002** — Add AC: `app/chat/layout.tsx` with `<CopilotKit agent="routerAgent">`; keep root layout on `pingAgent`.
2. **MASTRA-003** — Add `@mastra/pg` install + migrate `agent-memory.ts` + `pingAgent` memory; clarify vs F20.
3. **MASTRA-004** — Add `logging-mastra-agent.ts` to targets; enum probe in AC.
4. **MASTRA-001** — Full `depends_on` slugs; note concierge workflow out of router scope.
5. **my-mastra-app-coverage.md** — Update agent count / MASTRA crosswalk.

---

## Execution order (verified)

```text
MAP-001 → MASTRA-001 → MASTRA-002
              ↘ MASTRA-004 (parallel after MASTRA-001)
MASTRA-005 anytime after F09
MASTRA-003 after MVP exit + MASTRA-002
```

---

## Go / no-go

| Question | Answer |
|----------|--------|
| Are tasks 100% correct? | **No** — ~6 patch items; MASTRA-002 has one **blocker** (CopilotKit provider). |
| Safe to start MASTRA-001? | **Yes** |
| Safe to start MASTRA-002? | **No** until MAP-001 + M2-1 patch |
| Flip any to Done without evidence? | **No** — anti-fake-done gate 9 applies |

---

## References

- [task-verifier SKILL](../../../.claude/skills/task-verifier/SKILL.md)
- [mastra integration ref](../../../.claude/skills/copilotkit-integrations/references/integrations/mastra.md)
- [plan/mastra/summary.md](../../../plan/mastra/summary.md)
- [Supabase audit](../../../plan/mastra/audit/00-supabase-mastra-audit.md)
