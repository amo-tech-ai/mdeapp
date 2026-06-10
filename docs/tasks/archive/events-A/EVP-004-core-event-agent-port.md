---
id: EVP-004-core
legacy_id: F14
title: Port eventAgent (mdeai events specialist) from my-mastra-app
status: Done
completed: 2026-05-24
evidence: ../notes/EVP-004-core-evidence.md
shipped_note: Code in mdeapp/src/mastra/agents/event-agent.ts — do not re-port from legacy
priority: P0
phase: W3 — Roberto unlock critical path
effort: 1h port + 30 min adapt
owner: claude
depends_on: [F13-ai-runs-observability, F13b-workspace-and-skills]
skill: [mastra, copilotkit-integrations, gemini]
copilotkit_agent_key: eventAgent
integration_pattern: in-process
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/quickstart
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/agents/event-agent.ts (100 lines)
target_files:
  - /home/sk/mdeai/mdeapp/src/mastra/agents/event-agent.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/models.ts (REWRITE — not literal port)
  - /home/sk/mdeai/mdeapp/src/mastra/index.ts (add eventAgent to agents map)
verified_against:
  - CLAUDE.md Gemini model registry (gemini-3.5-flash current)
  - plan/05-path-a §8 risk matrix (Agent / Memory drift)
---

# EVP-004-core — Port `eventAgent` (Roberto's W3 hero agent)

## 1. Purpose

The legacy `event-agent.ts` is **a fully-formed Medellín events specialist** — it knows venue intelligence (Estadio, Laureles, Poblado, Centro, San Javier), category mapping (music/nightlife/sport/food/culture), follow-up shortcuts ("any cheaper", "what time"), and the search-now policy (1-2 filters = search immediately, no clarification ping-pong). Roberto's W3 task (per PRD §51 task 13-14) needs exactly this. Porting saves ~3 hours of agent-instruction authoring + saves us from re-discovering the prompt patterns.

## 2. Goals

- `mdeapp/src/mastra/agents/event-agent.ts` exports `eventAgent: Agent`
- Model is `google("gemini-3.5-flash")` (NOT `REASONING_MODEL` constant from legacy — that aliased to a non-Gemini model)
- Working memory schema `eventWorkingMemorySchema` preserved (lastQuery + lastResults + selectedEventId)
- `scope: "thread"` preserved (matches PRD §13 invariant)
- `lastMessages: 20` preserved if beta still supports
- mastra/index.ts wires `eventAgent` into the agents map alongside `pingAgent`
- Frontend `<CopilotKit agent="eventAgent">` works on a **test route** (e.g. `/host/event/new` stub or `?agent=eventAgent` dev page) — key must be `eventAgent`, not `event-agent`
- F13 `LoggingMastraAgent` logs `agent_name: event-agent`, `agent_type: event_curator` (extend agentId map in `logging-mastra-agent.ts`)
- Agent loads with 0 tools initially (EVP-005-core adds searchEventsTool)

## 3. Features (persona value)

**Roberto** gets a Medellín events specialist on `/host/event/new` (W3) — neighborhood shortcuts, category mapping, “search now” policy without clarification ping-pong.

## 5. User journeys

- Roberto: “music tonight Laureles under $20” → Event Agent reply (cards after EVP-005-core).

## 6. Agents

- `eventAgent` — `id: "event-agent"`, map key `eventAgent`.

## 7. Integrations

- Gemini `gemini-3.5-flash` only; F13 `logAgentRunForTurn`; CopilotKit runtime unchanged.

## 3. Source file — port + adapt

| Section | Legacy | Adaptation |
|---|---|---|
| Imports | `Agent from '@mastra/core/agent'`, `Memory from '@mastra/memory'`, `z from 'zod'`, `searchEventsTool from '../tools/search-events'`, `REASONING_MODEL from '../lib/models'` | Drop `searchEventsTool` import for now (EVP-005-core adds it). Replace `REASONING_MODEL` with direct `google("gemini-3.5-flash")` |
| Working memory schema | `eventWorkingMemorySchema` | Keep verbatim |
| Agent constructor | `new Agent({ id, name, instructions, model, tools, memory })` | Keep `id`, `name`. Tools = `{}` for EVP-004-core (EVP-005-core wires searchEventsTool). Memory keep `scope: "thread"` and `lastMessages: 20` |
| Instructions | (87 lines of mdeai-specific event knowledge) | **Keep verbatim** — this is the highest-value asset of the port |

## 4. Workflow

1. **Pre-flight checks:**
   - `mcp__mastra__getMastraExports({ package: "@mastra/core" })` — confirm `Agent` class still exposed
   - `mcp__mastra__getMastraExportDetails({ package: "@mastra/memory", export: "Memory" })` — confirm `options.workingMemory.scope` accepts `'thread'`, `options.lastMessages` is still a field
   - `mcp__mastra__searchMastraDocs("Agent constructor id name instructions model tools memory")` — confirm constructor shape

2. **Create `mdeapp/src/mastra/lib/models.ts`** (new, Gemini-only):
   ```ts
   import { google } from "@ai-sdk/google";
   export const REASONING_MODEL = google("gemini-3.5-flash");
   export const PLANNING_MODEL = google("gemini-3.5-flash");
   export const CONCIERGE_MODEL = google("gemini-3.5-flash");
   ```
   (Phase 2: differentiate models per role if Gemini Pro / Flash Lite become useful.)

3. **Copy + adapt `event-agent.ts`:**
   - `cp /home/sk/mde/my-mastra-app/src/mastra/agents/event-agent.ts /home/sk/mdeai/mdeapp/src/mastra/agents/event-agent.ts`
   - Change line 4: `import { searchEventsTool } from '../tools/search-events'` → **delete** (re-added in EVP-005-core)
   - Change line 89: `tools: { searchEventsTool }` → `tools: {}`
   - Keep `REASONING_MODEL` import (resolves to gemini via new `lib/models.ts`)

4. **Update `mdeapp/src/mastra/index.ts`:**
   - Import `eventAgent` from `./agents/event-agent`
   - Add to `agents: { pingAgent, eventAgent }`

5. **Verify mdeapp build + Mastra MCP `searchMastraDocs("scope thread workingMemory")`** to confirm field still valid.

## 5. API drift adjustments

| Risk | Check | Mitigation |
|---|---|---|
| `id` field on Agent renamed/removed | `mcp__mastra__getMastraExportDetails Agent` | If renamed to `name` only, drop `id` and use `name: "Event Agent"`; update agents map key accordingly |
| `Memory.workingMemory.scope` no longer accepts `'thread'` | `mcp__mastra__searchMastraDocs` | If scope renamed, use new name; if dropped, accept default and add Phase 2 TODO |
| `lastMessages: 20` field renamed | same | Drop if removed; accept default |
| `Agent` constructor doesn't accept empty `tools: {}` | Try; if errors, omit the `tools` key entirely (agent still works without tools) | — |

## 6. Tests

**Vitest unit (`event-agent.test.ts`):**
```ts
import { describe, it, expect } from 'vitest';
import { eventAgent } from './event-agent';

describe('eventAgent', () => {
  it('has id "event-agent"', () => { expect(eventAgent.id).toBe('event-agent'); });
  it('has name "Event Agent"', () => { expect(eventAgent.name).toBe('Event Agent'); });
  it('instructions contain mdeAI Medellín events specialist', () => {
    expect(eventAgent.instructions).toContain('mdeAI Medell');
  });
  it('uses gemini-3.5-flash', () => {
    // Model has modelId or .name property
    expect(JSON.stringify(eventAgent.model)).toMatch(/gemini-3\.5-flash/);
  });
});
```

**Runtime smoke (via chrome-devtools MCP):**
- Open `http://localhost:<port>/?agent=eventAgent` (or a test surface)
- Send: `"music tonight Laureles under $20"`
- Expect: response contains either real cards (if EVP-005-core done) OR a description of the search that would be done (since EVP-004-core tools is empty)
- No error in /api/copilotkit POST (HTTP 200)

## 7. Acceptance criteria

- [ ] `mdeapp/src/mastra/agents/event-agent.ts` exists
- [ ] `mdeapp/src/mastra/lib/models.ts` exists with 3 Gemini exports
- [ ] `mdeapp/src/mastra/index.ts` registers `eventAgent`
- [ ] `eventAgent.id === "event-agent"`
- [ ] `eventAgent.model` is Gemini 3.5 Flash
- [ ] Working memory has `scope: "thread"` + Zod schema
- [ ] Build passes; lint passes; tsc passes
- [ ] 1 new Vitest test green
- [ ] Smoke chat returns 200 with an "Event Agent" reply mentioning Medellín

## 8. Rollback

`git revert HEAD` removes both the new file and the mastra/index.ts add. pingAgent remains the only agent — F05 baseline still works.

## 9. Definition of Done

All 9 acceptance criteria pass. Commit: `feat(mastra): port eventAgent from legacy my-mastra-app + Gemini-only models.ts (EVP-004-core)`. Evidence at `tasks/notes/EVP-004-core-evidence.md`.
