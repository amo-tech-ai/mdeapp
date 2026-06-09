---
id: F18
title: Port routerAgent + classify-intent tool from my-mastra-app
status: Done
priority: P0
phase: W6 — chat multi-intent
effort: 1h port + verify Agent({ workflows }) constructor
owner: claude
depends_on: [MAP-001]
skill: [mastra, copilotkit-integrations]
copilotkit_agent_key: routerAgent
integration_pattern: in-process
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/programmatic-control
  - https://docs.copilotkit.ai/mastra/agent-app-context
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/agents/router.ts (48 lines)
  - /home/sk/mde/my-mastra-app/src/mastra/tools/classify-intent.ts
  - /home/sk/mde/my-mastra-app/src/mastra/types/intents.ts
target_files:
  - /home/sk/mdeai/mdeapp/src/mastra/agents/router.ts
  - /home/sk/mdeai/mdeapp/src/mastra/tools/classify-intent.ts
  - /home/sk/mdeai/mdeapp/src/mastra/types/intents.ts
---

# F18 — Port `routerAgent` + `classify-intent` tool

## 1. Purpose

`routerAgent` is the intent classifier + dispatcher: receives any user message, calls `classify-intent` tool (returns `{ intent, confidence, reason }`), and dispatches to either `rentalSearchWorkflow` or `eventDiscoveryWorkflow` based on intent + confidence ≥ 0.6. Per PRD §13. Foundation for W6 chat multi-intent flow.

**🔴 Hard prerequisite — confirmed beta API drift:** Legacy uses `new Agent({ ..., workflows: { rentalSearchWorkflow, eventDiscoveryWorkflow } })`. **Beta does NOT support the `workflows` constructor option** (verified 2026-05-20 against installed `node_modules/@mastra/core/dist/agent/agent.d.ts` — the `Agent` constructor `AgentConfig` shape has no `workflows` field; only a `listWorkflows()` method exists at runtime). The fallback wiring described in §5 is **mandatory**, not optional — F18 must ship with the tool-wrapper approach. Do not attempt the verbatim port.

## 2. Goals

- **Required prereq before any copy:** Verify beta `Agent` constructor lacks `workflows` (via Mastra MCP `searchMastraDocs` / `getMastraExportDetails` + a `grep workflows node_modules/@mastra/core/dist/agent/agent.d.ts` confirming the field is not in the constructor config). Record outcome in `tasks/notes/F18-evidence.md` before any source file is copied.
- `routerAgent` registered + classifies a query into one of: rental_search, event_discovery, chitchat, unknown
- `classify-intent` tool callable; LLM-based JSON output
- `routerAgent` dispatches via the **tool-wrapper fallback** (§5) — direct workflow injection is unsupported on beta and must not be attempted
- Follow-up intent preservation works (per legacy `routerAgent.instructions` follow-up rules)
- 0 multi-workflow calls per turn

## 3. Source files — port + verify

| Source | Adaptation |
|---|---|
| `agents/router.ts` | **Required refactor — see §5.** Beta lacks `Agent({ workflows })`; drop the field and pass dispatcher tools via `tools: {...}` instead. |
| `tools/classify-intent.ts` | Verbatim port |
| `types/intents.ts` | Verbatim port |

## 4. Workflow

1. **CRITICAL pre-flight — hard prerequisite (Mastra MCP + on-disk node_modules):**
   - `mcp__mastra__getMastraExportDetails({ package: "@mastra/core/agent", export: "Agent" })` — record output in `tasks/notes/F18-evidence.md`
   - `grep -n "workflows" mdeapp/node_modules/@mastra/core/dist/agent/agent.d.ts` — confirm `workflows` appears only as a method (`listWorkflows`, `getWorkflows`), NOT as a constructor `AgentConfig` field
   - **As of 2026-05-20 this prereq is failing — i.e. the constructor does NOT accept `workflows`.** Skip directly to the fallback refactor; do not attempt the verbatim port.
   - The fallback refactor is the **only** supported path on beta:
     - Expose each workflow as a `createTool` wrapper:
       ```ts
       const dispatchRentalSearchTool = createTool({
         id: 'dispatch-rental-search',
         description: 'Dispatch to rental search workflow',
         inputSchema: z.object({ neighborhood: z.string().optional(), ... }),
         execute: async ({ inputData }) => {
           const run = await mastra.getWorkflow('rentalSearchWorkflow').createRun();
           return await run.start({ inputData });
         },
       });
       ```
     - Pass via `tools: { classifyIntentTool, dispatchRentalSearchTool, dispatchEventDiscoveryTool }`
     - Update router instructions to reflect new tool names

2. **Copy 3 files:**
   - router.ts, classify-intent.ts, types/intents.ts

3. **Register `routerAgent` in mastra/index.ts**

4. **Frontend rewire (W6):** add a `/chat` page that mounts `<CopilotKit agent="routerAgent">` — or keep `<CopilotKit agent="conciergeAgent">` (F19) as the canonical entry; router becomes an internal helper.

## 5. API drift fallback (required on beta — not optional)

Beta confirmed to lack `Agent({ workflows })` (see §4 step 1). All F18 work must use this wiring:

```mermaid
flowchart LR
    User[User message] --> RouterAgent[routerAgent]
    RouterAgent -- "call" --> Classify[classifyIntentTool]
    Classify -- "{intent, confidence}" --> RouterAgent
    RouterAgent -- "intent=rental_search" --> DispatchRental[dispatchRentalSearchTool<br/>(NEW wrapper)]
    RouterAgent -- "intent=event_discovery" --> DispatchEvent[dispatchEventDiscoveryTool<br/>(NEW wrapper)]
    DispatchRental --> RentalWF[rentalSearchWorkflow]
    DispatchEvent --> EventWF[eventDiscoveryWorkflow]
```

## 6. Tests

**Vitest unit:**
- `classifyIntentTool` returns `{ intent: 'rental_search', confidence: ≥0.6 }` for "show apartments in Laureles"
- `classifyIntentTool` returns `{ intent: 'event_discovery', ... }` for "salsa tonight"
- `routerAgent.id === 'router-agent'`

**Integration smoke:**
- Send: `"1BR Laureles"` → router classifies as rental_search + dispatches workflow → cards returned
- Send: `"salsa tonight"` → router classifies as event_discovery → cards returned
- Send: `"hi"` → router classifies as chitchat → short polite reply, no workflow call

## 7. Acceptance criteria

- [ ] **Prereq evidence** at `tasks/notes/F18-evidence.md` showing `Agent({ workflows })` is absent on beta (grep + MCP outputs both captured)
- [ ] 3 files at target paths
- [ ] Build/lint/tsc green
- [ ] 3+ new Vitest tests
- [ ] Router correctly dispatches to rental vs event vs chitchat
- [ ] Never dispatches to BOTH workflows in one turn
- [ ] Follow-up intent inheritance works (test: "rentals" → "show cheaper" stays rental_search)
- [ ] Router is wired via the §5 tool-wrapper fallback (no `workflows` field on the Agent constructor — verified by `grep -L 'workflows:' mdeapp/src/mastra/agents/router.ts`)

## 8. Rollback

`git revert HEAD` removes 3 files + index.ts update. Other agents still work independently.

## 9. Definition of Done

All ACs pass. Commit: `feat(mastra): port routerAgent + classify-intent (F18)` with note about fallback if it applies.
