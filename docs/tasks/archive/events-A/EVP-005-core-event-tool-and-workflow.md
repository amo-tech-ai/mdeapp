---
id: EVP-005-core
legacy_id: F15
title: Port search-events tool + event-discovery-workflow from my-mastra-app
status: Done
completed: 2026-05-24
evidence: ../notes/EVP-005-core-evidence.md
shipped_note: Tool + workflow on disk — UI polish remains EVP-013-core/SCREEN-006
priority: P0
phase: W3 — Roberto unlock critical path
effort: 1h tool + 1h workflow
owner: claude
depends_on: [EVP-004-core-event-agent-port]
skill: [mastra, mde-supabase, mde-maps, copilotkit-integrations]
integration_pattern: in-process
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
  - https://docs.copilotkit.ai/mastra/ag-ui
  - https://docs.copilotkit.ai/mastra/generative-ui/state-rendering
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/tools/search-events.ts (310 lines — substantial)
  - /home/sk/mde/my-mastra-app/src/mastra/workflows/event-discovery-workflow.ts (89 lines)
target_files:
  - /home/sk/mdeai/mdeapp/src/mastra/tools/search-events.ts
  - /home/sk/mdeai/mdeapp/src/mastra/workflows/event-discovery-workflow.ts
  - /home/sk/mdeai/mdeapp/src/mastra/agents/event-agent.ts (re-add tool ref from EVP-004-core)
---

# EVP-005-core — Port `search-events` tool + `event-discovery-workflow`

## 3. Features (persona value)

**Roberto** sees real event cards in chat; **Camila** can discover events on `/chat` (W6). **Sofía** traces tool latency via `ai_runs.duration_ms`.

## 1. Purpose

The tool that actually queries `public.events` and the workflow that orchestrates search + format. Heavy file with **Bogota-local-time helpers** (this_weekend, tonight, this_week, next_week), category mapping from DB `event_type` to mdeai categories, neighborhood extraction from address strings, and AG-UI `context.writer.custom` event cards. This is the spine of W3-W4 Roberto + W6 Camila chat.

## 2. Goals

- `searchEventsTool` exports from `mdeapp/src/mastra/tools/search-events.ts`
- Calls Supabase live (events table, 49 rows)
- Returns 5 cards (default limit) for "music tonight" queries
- Bogota TZ helpers (`nowBogota`, `dateWindow`) work — `this_weekend` resolves to Fri-Sun Bogota time
- AG-UI `context.writer.custom({ type: 'data-mdeai-actions', data: { kind: 'event_results', cards } })` fires
- `eventDiscoveryWorkflow` wraps the tool with a `format-event-cards` step
- `eventAgent` rewired to use `searchEventsTool` (re-add tool ref from EVP-004-core)

## 3. Source files — port + adapt

| Source | Adaptation |
|---|---|
| `tools/search-events.ts` | (a) Supabase schema MCP. (b) AG-UI `context.writer.custom` per [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) + [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui). (c) Mirror generative UI with `useCopilotAction({ render, available: "disabled" })` on Roberto/Camila surfaces (v1). (d) Bogota TZ helpers verbatim. |
| `workflows/event-discovery-workflow.ts` | Verify `createStep`, `createWorkflow`, `.then().commit()` API still works in beta. |

## 4. Workflow

1. **Pre-flight (Supabase MCP):**
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_schema='public' AND table_name='events'
   ORDER BY ordinal_position;
   ```
   Verify columns: `id, name, event_type, address, city, event_start_time, ticket_price_min, currency, primary_image_url, latitude, longitude, maps_url, is_active, status`. If any drift, update the `rowToCard` mapper.

2. **Pre-flight (Mastra MCP):**
   - `searchMastraDocs("createTool inputSchema outputSchema execute context writer")` — confirm `context.writer.custom` is the AG-UI stream call signature in beta
   - `searchMastraDocs("createWorkflow createStep then commit builder")` — confirm builder API

3. **Copy files:**
   - `cp /home/sk/mde/my-mastra-app/src/mastra/tools/search-events.ts → mdeapp/src/mastra/tools/`
   - `cp /home/sk/mde/my-mastra-app/src/mastra/workflows/event-discovery-workflow.ts → mdeapp/src/mastra/workflows/`
   - Wrap exported tool with `withAudit(searchEventsTool, { risk: 'low' })` from F13.

4. **Re-wire `eventAgent` (EVP-004-core):** restore `import { searchEventsTool }` + `tools: { searchEventsTool }`; ensure tool execute path does not block on `recordMastraRun`.

5. **Register workflow in `mdeapp/src/mastra/index.ts`:**
   ```ts
   import { eventDiscoveryWorkflow } from './workflows/event-discovery-workflow';
   export const mastra = new Mastra({
     workflows: { eventDiscoveryWorkflow },
     agents: { pingAgent, eventAgent },
     // ...
   });
   ```

## 5. API drift adjustments

| Risk | Check | Mitigation |
|---|---|---|
| `context.writer.custom({ type, data })` shape changed | AG-UI MCP `search-ag-ui-docs("writer custom event stream")` | If shape changed, adapt event payload; if dropped, return cards in standard tool output only |
| `createTool({ inputSchema, outputSchema, execute })` signature changed | Mastra MCP | Adjust accordingly; in worst case drop outputSchema |
| `createWorkflow().then().commit()` builder changed | Mastra MCP | If builder changed, refactor steps |
| `event_type` column renamed in events table | Supabase MCP | Update `rowToCard` mapper field name |
| `is_active` or `status='published'` filters mismatch live data | Live SQL: `SELECT count(*) FROM events WHERE is_active=true AND status='published';` | If 0 rows, drop filters or update seed data |

## 6. Tests

**Vitest unit (`search-events.test.ts`):**
```ts
import { describe, it, expect } from 'vitest';
import { searchEvents, dateWindow, extractNeighborhood, mapCategory } from './search-events';

describe('search-events helpers', () => {
  it('extractNeighborhood handles "X, Y, Z"', () => {
    expect(extractNeighborhood('El Poblado, Calle 10, Medellin', 'Medellin')).toBe('El Poblado');
  });
  it('mapCategory dance → nightlife', () => {
    expect(mapCategory('dance')).toBe('nightlife');
  });
  it('dateWindow this_weekend returns gte+lte', () => {
    const r = dateWindow('this_weekend');
    expect(r.gte).toBeTruthy();
    expect(r.lte).toBeTruthy();
  });
});
```

**Integration test (`event-discovery-workflow.test.ts`):**
```ts
// Calls workflow with mock input → expects { cards: [...], total: N }
```

**Runtime smoke:**
- Send via chat: "music events tonight in Laureles under $30"
- Verify: 5 event cards returned (or fewer if seed data sparse)
- Verify: `withAudit()` console pre/post lines; `ai_runs` row with `metadata.tool = search-events` (F13) — there is no `agent_tool_calls` table in Phase 1 schema

## 7. Acceptance criteria

- [ ] `tools/search-events.ts` exists; exports `searchEventsTool, searchEvents, dateWindow, extractNeighborhood, mapCategory`
- [ ] `workflows/event-discovery-workflow.ts` exists; exports `eventDiscoveryWorkflow`
- [ ] `mastra/index.ts` registers the workflow
- [ ] `event-agent.ts` re-imports `searchEventsTool` + adds it to `tools: { searchEventsTool }`
- [ ] Build green; lint green; tsc green
- [ ] 3+ new Vitest tests pass
- [ ] Smoke chat "music tonight" → ≥1 card returned (or empty-state recovery if Supabase has no matching rows)
- [ ] AG-UI event stream fires (verify via chrome-devtools MCP network log)
- [ ] `ai_runs` row written (per F13)

## 8. Rollback

`git revert HEAD` removes 2 files + revert eventAgent re-wiring. Note: leaving an orphan import would break build, so the revert is single-commit clean.

## 9. Definition of Done

All 9 ACs pass. Commit: `feat(mastra): port search-events tool + event-discovery-workflow + wire eventAgent (EVP-005-core)`.
