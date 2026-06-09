---
id: F50
title: CopilotKit shared map state — MapUiState + focusPin frontend tool
status: Done
priority: P1
phase: MVP — O4 polish enabler
effort: 2-3h
owner: claude
depends_on: [F49, MAP-001]
blocks: [MAP-007]
skill: [copilotkit-integrations, copilotkit-develop, mde-maps]
copilotkit_agent_key: conciergeAgent
integration_pattern: in-process
copilotkit_version: "1.55.2"
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
  - https://docs.copilotkit.ai/mastra/frontend-tools
  - https://docs.copilotkit.ai/reference/v1/hooks/useCopilotAction
index_ref: CopilotKit/examples/canvas/mastra/src/lib/canvas/state.ts
companion_tasks: [F48, F49]
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/canvas/mastra/src/lib/canvas/state.ts
  - /home/sk/mdeai/mdeapp/src/lib/types.ts
prd_ref: ../../plan/prd/07-contracts-schemas.md · ../../docs/CHAT-CENTRAL-PLAN.md CK-002
---

# F50 — CopilotKit shared map state — MapUiState + focusPin

> **CK-002 rule:** **`MapContext`** remains the **sole writer** of pins on the client. **`useCoAgent`** working memory holds a **summary mirror** (`MapUiState`) for agent awareness — ids/counts/viewport only, never full `MapPin[]`.

### Phase 1 API (verified against official docs)

| Official docs show (v2 default) | mdeapp implements (1.55.2) |
|--------------------------------|----------------------------|
| `useAgent` ([in-app-agent-read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read)) | `useCoAgent<T>({ name: "conciergeAgent" })` → `{ state, setState }` |
| `useFrontendTool` ([frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools)) | `useCopilotAction({ name, handler, parameters })` — see `setThemeColor` in `integrations/mastra` example |
| `useCoAgentState` (legacy doc mention) | **Do not use** — not exported in 1.55.2; use `useCoAgent` |

## 0. Pre-flight

1. Read [in-app-agent-read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) + [in-app-agent-write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) + [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools).
2. **Requires in-process Pattern 1** — `MastraAgent.getLocalAgents({ mastra })` in `/api/copilotkit`. Shared state does **not** work with remote Mastra-only `:4111` runtime.
3. F49 Done — pins flow tool → render → MapContext.
4. Working memory lives in `concierge.ts` `Memory({ options: { workingMemory: { schema }}})` — sync type in `src/lib/types.ts`.

## 1. Purpose

**Camila** says *"focus the second one"* or *"show me that pin on the map"* — concierge reads `MapUiState` (selected pin, viewport, active categories) and can call a **frontend tool** to pan/highlight without duplicating pin arrays in agent memory.

## 2. Goals

### MapUiState contract

- `mdeapp/src/platform/contracts/map-ui-state.ts`:

```ts
export const MapUiStateSchema = z.object({
  selectedPinId: z.string().nullable(),
  activeCategories: z.array(z.enum(["rental", "event", "restaurant", "attraction"])),
  viewport: z.object({ lat: z.number(), lng: z.number(), zoom: z.number() }).optional(),
  pinCountByCategory: z.record(z.string(), z.number()).optional(),
});
```

- Extend concierge **working memory** Zod schema with optional `mapUi` slice (ids/counts/viewport — **no pin arrays**).
- Client reads agent state: `const { state } = useCoAgent<ConciergeState>({ name: "conciergeAgent" })`.
- Client writes summary to agent: `setState({ ...state, mapUi: { selectedPinId, pinCountByCategory, ... } })` when MapContext changes ([in-app-agent-write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write)) — debounce ~300ms.
- Do **not** duplicate full pins in working memory.

### Frontend tool — focusMapPin (v1 pattern)

Per [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) + mastra example `setThemeColor`:

```tsx
useCopilotAction({
  name: "focusMapPin",
  description: "Pan the map to a pin and highlight it by pinId",
  parameters: [{ name: "pinId", type: "string", required: true }],
  handler: async ({ pinId }) => {
    mapContext.setSelectedPinId(pinId);
    mapContext.panToPin(pinId); // MapContext helper or useMap()
    return `Focused pin ${pinId}`;
  },
});
```

- **No** `available: "disabled"` — this is a client-side frontend tool (agent invokes via AG-UI automatically).
- **No** matching Mastra `createTool` required for Phase 1 — frontend-only is sufficient per docs.
- **Do not** use v2 `useFrontendTool` until Phase 2 CK migration.

### Pin ↔ card highlight

- `selectedPinId` in MapContext drives card `data-pin-id` highlight + map marker style (MAP-007 may polish visuals).

## 3. Pattern sources

| Need | Source |
|------|--------|
| Zod co-agent state | `examples/canvas/mastra/src/lib/canvas/state.ts` |
| Frontend actions | CopilotKit guides/frontend-actions |
| Pin selection | legacy `MapContext.selectedPinId` |

## 4. Workflow

1. Add `MapUiStateSchema` + export type.
2. Add `mapUi` slice to concierge working memory schema (optional fields) + `src/lib/types.ts` sync.
3. Create `useMapUiSync()` hook — MapContext → co-agent state push.
4. Implement `focusMapPin` frontend action.
5. Manual: select card → `selectedPinId` updates; ask agent *"focus the cheapest listing"* → map pans.
6. Vitest: schema parse fixtures.
7. `tasks/notes/F50-evidence.md`.

## 5. Wiring plan

| Action | Path |
|--------|------|
| Create | `mdeapp/src/platform/contracts/map-ui-state.ts` |
| Create | `mdeapp/src/components/copilot/map-ui-sync.tsx` |
| Create | `mdeapp/src/components/copilot/focus-map-pin-action.tsx` |
| Modify | `mdeapp/src/mastra/agents/concierge.ts` (working memory schema) |
| Modify | `mdeapp/src/lib/types.ts` |
| Modify | `mdeapp/src/app/page.tsx` (mount sync + action) |

## 6. Out of scope

- Full MAP-007 responsive polish
- Clustering / InfoWindow chrome (MAP-008/009)
- Roberto EventDraftState (F33)

## 7. Acceptance criteria

1. `MapUiStateSchema.safeParse` passes fixtures.
2. `useCoAgent({ name: "conciergeAgent" }).state.mapUi` reflects `selectedPinId` after card click (via debounced `setState`).
3. `focusMapPin` handler pans map + sets selection without clearing other categories' pins.
4. Agent working memory schema does **not** store full `MapPin[]` arrays (`rg "pins: z.array" mdeapp/src/mastra/agents/concierge.ts` → 0 for map pins).
5. Three-place schema sync: concierge agent Zod, `lib/types.ts`, `platform/contracts/map-ui-state.ts`.
6. No v2-only hooks: `rg "useAgent|useFrontendTool|useCoAgentState" mdeapp/src` → 0.
7. `npm run floor` exit 0.
8. Evidence: `tasks/notes/F50-evidence.md`.

## 8. Personas

- **Camila:** *"show the third apartment on the map"* works via focus action.
- **Tourist:** selected restaurant pin highlights matching card.

## 9. Tests

- Vitest: `MapUiStateSchema`
- Manual: card click ↔ map selection ↔ co-agent state

## 10. Definition of Done

All §7. Commit: `feat(copilotkit): MapUiState sync + focusMapPin (F50)`.
