---
id: F49
title: CopilotKit generative UI — search tools → cards → map pins
status: Done
priority: P0
phase: MVP — O3 pin proof
effort: 4-6h
owner: claude
depends_on: [F48, MAP-001, F24]
blocks: [F50, F46, MAP-002]
skill: [copilotkit-develop, copilotkit-integrations, mde-maps]
copilotkit_agent_key: conciergeAgent
integration_pattern: in-process
copilotkit_version: "1.55.2"
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
  - https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only
  - https://docs.copilotkit.ai/generative-ui/your-components/display-only
  - https://docs.copilotkit.ai/reference/v1/hooks/useCopilotAction
index_ref: CopilotKit/examples/showcases/generative-ui/
companion_tasks: [F48, F50, MAP-001]
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/
  - /home/sk/mdeai/CopilotKit/examples/showcases/generative-ui/
  - /home/sk/mdeai/github/copilotkit/ag-ui-adk-grounding-app/src/app/page.tsx
  - /home/sk/mdeai/mdeapp/src/mastra/tools/search-rentals.ts
  - /home/sk/mdeai/mdeapp/src/mastra/agents/concierge.ts
prd_ref: ../../plan/ADK/maps-adk-prd.md · ../../plan/prd/04-maps-grounding.md · MAP-001 pipeline
---

# F49 — CopilotKit generative UI — search tools → cards → pins

> **Pipeline (locked):** Mastra `createTool({ id })` executes server-side → CopilotKit streams tool call → **`useCopilotAction({ name, available: "disabled", render })`** (v1.55.2) paints cards → child component pushes **`MapPin[]`** into **`MapContext.mergePinsByCategory`**. Agents never call `setPins` directly.

### Phase 1 API (verified against official docs + `integrations/mastra` example)

| Official docs show (v2 default) | mdeapp implements (1.55.2) |
|--------------------------------|----------------------------|
| `useRenderTool` ([tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering)) | `useCopilotAction` + `available: "disabled"` + `render` |
| `useComponent` ([display-only](https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only)) | Same — only when agent owns the tool; name = Mastra tool `id` |
| Interactive / HITL ([interactive](https://docs.copilotkit.ai/generative-ui/your-components/interactive)) | `renderAndWaitForResponse` — Roberto path (F37), **not** search cards |

**Rule from docs:** *"In order to render a tool call in the UI, the name of the action must match the name of the tool."* — for Mastra, match `createTool({ id: "search-rentals" })` exactly.

## 0. Pre-flight

1. Read [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) + local example `CopilotKit/examples/integrations/mastra/src/app/page.tsx` (`weatherTool` mirror).
2. Grep Mastra tool **`id`** values (must match `useCopilotAction` **`name`** exactly — not the TS export name):

| Mastra registry key (`tools: { … }`) | `useCopilotAction({ name })` **primary** | `createTool({ id })` (register duplicate if AG-UI streams id) |
|--------------------------------------|------------------------------------------|-------------------------------------------------------------|
| `searchRentalsTool` | `searchRentalsTool` | `search-rentals` |
| `searchEventsTool` | `searchEventsTool` | `search-events` |
| `searchRestaurantsTool` | `searchRestaurantsTool` | `search-restaurants` |
| `searchAttractionsTool` | `searchAttractionsTool` | `search-attractions` |
| `searchGroundedPlacesTool` (MAP-002) | same + `GroundingAttribution` | `search-grounded-places` |

Source of truth on disk: `mdeapp/src/platform/copilot/mastra-tool-action-names.ts` + `search-tool-renders.tsx`.

3. F48 layout Done — map panel visible on `/`; client wrapper component exists for hooks.
4. MAP-001 Done — `MapPinSchema`, `normalizeToolOutput`, `mergePinsByCategory`, `MapContext`.
5. Hooks run inside a **client component** that is a descendant of `<CopilotKit>` (layout) and inside `<CopilotSidebar>` children tree.

## 1. Purpose

When **Camila** asks *"1BR in Laureles under $80/night"*, concierge calls `search-rentals` and she sees **RentalCard** rows in-thread **and** pins on the map. Same pattern for events, restaurants, attractions — the MVP **O3 pin proof**.

## 2. Goals

### Frontend mirrors

- `src/components/copilot/search-tool-renders.tsx` — client component; mount from F48 canvas wrapper.
- Four `useCopilotAction` hooks (v1.55.2):
  - `available: "disabled"` — Mastra agent executes; UI **only renders** ([display-only / tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering)).
  - `name` = Mastra tool `id` (kebab-case).
  - `render: ({ args, status, result })` — show skeleton when `status !== "complete"`; parse **`result`** (tool output) when complete. Do **not** call React hooks inside `render` — extract a child component for pin merge side effects.
  - Optional second arg: dependency array per upstream example (`[themeColor]` pattern).
- Pin merge: dedicated `SearchResultPins` child calls `mergePinsByCategory` in `useEffect` when `result` changes.

### Cards (ex-MAIC-009 inventory)

| Component | Path (target) | On disk today | Tool |
|-----------|---------------|---------------|------|
| `RentalCard` | `components/copilot/rental-card.tsx` | ✅ | `searchRentalsTool` |
| `PlaceResultCard` | `components/copilot/place-result-card.tsx` | ✅ | events / restaurants / attractions |
| `EventCard` | `components/copilot/cards/EventCard.tsx` | optional split | `searchEventsTool` |
| `VenueCard` | `components/copilot/cards/VenueCard.tsx` | defer | Roberto / MAP-010 |
| `NeighborhoodCard` | `components/copilot/cards/NeighborhoodCard.tsx` | defer | MAP-012 |
| `GroundingAttribution` | `components/maps/GroundingAttribution.tsx` | **MAP-002** 002C | grounded tool |
| `MapPinAction` | `components/copilot/MapPinAction.tsx` | defer | **F50** `focusMapPin` |

- Rentals → `RentalCard` (**F24** polish optional; must show title + price + link).
- Events / restaurants / attractions → `PlaceResultCard` or dedicated cards until F25/F26.
- `MapPinAction` / card→pin highlight → **F50** (not required for F49 Done).

### Pin contract

- Every pin from tool output passes `MapPinSchema.safeParse`.
- Coords from tool/DB only — reject LLM-invented lat/lng without tool provenance (MAP-001 rule).
- Multi-turn: second `search-restaurants` call does **not** wipe rental pins (merge by category).

## 3. Pattern sources

Canonical v1 mirror — from `CopilotKit/examples/integrations/mastra/src/app/page.tsx`:

```tsx
"use client";
import { useCopilotAction } from "@copilotkit/react-core";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";

function RentalSearchRender({ result }: { result: unknown }) {
  const { mergePinsByCategory } = useMapContext();
  const normalized = normalizeToolOutput("rental", result);

  useEffect(() => {
    mergePinsByCategory("rental", normalized.pins);
  }, [normalized.pins, mergePinsByCategory]);

  return normalized.results.map((r) => <RentalCard key={r.id} {...r} />);
}

function SearchToolRenders() {
  useCopilotAction(
    {
      name: "search-rentals", // MUST match createTool id
      available: "disabled",
      render: ({ status, result }) => {
        if (status !== "complete" || !result) {
          return <RentalCardsSkeleton />;
        }
        return <RentalSearchRender result={result} />;
      },
    },
    [],
  );
  // repeat for search-events, search-restaurants, search-attractions
  return null;
}
```

Also: `CopilotKit/examples/showcases/generative-ui` README (`status` + `result` parsing).

## 4. Workflow

1. Implement `normalizeToolOutput` adapters for each tool's return shape (if not fully in MAP-001).
2. Create `SearchToolRenders` client component; mount in `page.tsx` or `chat-canvas.tsx` (inside `MapProvider`).
3. Wire rental tool first → localhost pin proof → events → restaurants → attractions.
4. Vitest: normalizer fixtures per tool JSON sample.
5. Manual: *"list top rentals in Laureles"* → ≥3 cards + ≥3 markers.
6. `tasks/notes/F49-evidence.md`.

## 5. Wiring plan

| Action | Path |
|--------|------|
| Create | `mdeapp/src/components/copilot/search-tool-renders.tsx` |
| Modify | `mdeapp/src/app/page.tsx` or `chat-canvas.tsx` (mount renders) |
| Use | `mdeapp/src/platform/maps/normalize-tool-output.ts` |
| Use | `mdeapp/src/platform/contracts/map-pin.ts` |
| Optional | `mdeapp/src/components/rentals/rental-card.tsx` (F24) |

## 6. Failure points & security (ex-MAIC-009)

| Risk | Mitigation |
|------|------------|
| `useCopilotAction` `name` ≠ Mastra registry key | Use `MASTRA_COPILOT_TOOL_ACTIONS` — #1 CopilotKit debug issue |
| Forgot `available: "disabled"` | Double tool execution |
| Hooks inside `render` callback | Extract child component (`ToolPinsSync` pattern) |
| Raw HTML from tool output | React text only — no `dangerouslySetInnerHTML` |
| `search-tool-renders` outside `MapContextProvider` | Wrap in `geo-chat-shell` / F48 canvas |

## 7. Out of scope

- v2 `useRenderTool` / `useComponent` (Phase 2 CK upgrade)
- Grounding Lite cards (**MAP-002** 002C only)
- `useCoAgent` / MapUiState (**F50**)
- Frontend tool `focusMapPin` (**F50** — uses `handler`, not `available: "disabled"`)
- HITL / `renderAndWaitForResponse` ([interactive](https://docs.copilotkit.ai/generative-ui/your-components/interactive) — F37 Roberto path)

## 8. Acceptance criteria

1. Each of 4 search tools has `useCopilotAction` with `name` = Mastra **registry key** (`searchRentalsTool`, …) and `available: "disabled"`.
2. Rental query on `/` → ≥3 `AdvancedMarker` on map + ≥3 cards in chat thread.
3. Follow-up restaurant query → rental pins remain; restaurant pins added (category merge).
4. `rg "setPins" mdeapp/src/mastra` → 0 (agents do not write pin state).
5. `rg "useRenderTool|useComponent|useFrontendTool|/v2" mdeapp/src/components/copilot` → 0.
6. Invalid pin coords rejected in tests (Vitest normalizer).
7. `npm run floor` exit 0.
8. Gate 9: localhost `/` + concierge message → pins visible.
9. Evidence: `tasks/notes/F49-evidence.md`.

## 9. Personas

- **Camila:** sees Laureles listings as cards + map pins in one turn.
- **Tourist:** restaurant suggestions pin on map without wiping prior search.
- **Lucía:** pin count matches card count for rental smoke query.

## 10. Tests

- Vitest: `normalizeToolOutput` per tool fixture
- Manual: 4 tool smoke queries (one per category)
- Playwright (**required** for Done): ≥3 cards + ≥3 `[data-testid="map-pin"]` after Laureles query; card click highlights pin

## 11. Definition of Done

All §7 + F48 layout + MAP-001 contracts. Commit: `feat(copilotkit): generative search cards + map pins (F49)`.
