---
id: F48
title: CopilotKit 3-panel map canvas on / (Mindtrip shell)
status: Done
priority: P0
phase: MVP — O3/O4 geo-chat surface
effort: 4-6h
owner: claude
depends_on: [MAP-001, F19]
blocks: [F49, F50, MAP-002, F46, F41]
skill: [copilotkit-integrations, copilotkit-develop, mde-maps, mde-task-lifecycle]
copilotkit_agent_key: conciergeAgent
integration_pattern: in-process
copilotkit_version: "1.55.2"
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/quickstart
  - https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
  - https://docs.copilotkit.ai/reference/v1/components/chat/CopilotSidebar
  - https://docs.copilotkit.ai/custom-look-and-feel/slots
  - https://docs.copilotkit.ai/custom-look-and-feel/headless-ui
index_ref: ../../tasks/audit/10-mindtrip-three-panel-layout-audit.md
companion_tasks: [MAP-001, F49, F50]
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/
  - /home/sk/mdeai/CopilotKit/examples/canvas/mastra/
  - /home/sk/mde/src/components/chat/ChatCanvas.tsx
  - /home/sk/mdeai/mdeapp/src/app/layout.tsx
  - /home/sk/mdeai/mdeapp/src/app/page.tsx
prd_ref: ../../plan/prd/04-maps-grounding.md · ../../docs/CHAT-CENTRAL-PLAN.md
---

# F48 — CopilotKit 3-panel map canvas on `/`

> **CopilotKit-first (Phase 1 = v1.55.2):** Chat lives in **`CopilotSidebar`** (side panel). **`children`** = main app canvas (map + optional nav). Do **not** port legacy `useChat`, `ChatMessageList`, or edge chat.  
> **Surface:** **`/`** is the canonical concierge entry (`layout.tsx` → `agent="conciergeAgent"`). **`/chat`** stays a redirect to `/` — do not build a second chat route.

## 0. Pre-flight (mandatory)

1. Read [`.claude/skills/copilotkit-integrations/references/integrations/mastra.md`](../../.agents/skills/copilotkit-integrations/references/integrations/mastra.md) — **Phase 1 v1 API table** (docs site defaults to v2; mdeapp stays on 1.55.2).
2. Confirm **single runtime** — only `src/app/api/copilotkit/route.ts`; `MastraAgent.getLocalAgents({ mastra })` + `ExperimentalEmptyAdapter`; no LangGraph, no second orchestrator.
3. Confirm agent name chain (grep all three must match `conciergeAgent`):

| Layer | File | Must match |
|-------|------|------------|
| Provider | `src/app/layout.tsx` | `<CopilotKit agent="conciergeAgent" runtimeUrl="/api/copilotkit">` from `@copilotkit/react-core` |
| Mastra registry | `src/mastra/index.ts` | `agents: { conciergeAgent, ... }` **registry key** |
| Agent export | `src/mastra/agents/concierge.ts` | `export const conciergeAgent` |

**Important:** CopilotKit `agent` prop = Mastra registry **key**, not Mastra Agent `id` string inside the agent file.

4. **MAP-001 Done or in progress** with `MapContext`, `ChatMap`/`MdeMap`, `@vis.gl/react-google-maps` installed.
5. Maps MCP or mde-maps skill — `mapId` on every `<Map>`.

### Phase 1 vs latest docs (do not mix)

| Latest docs (v2) | mdeapp Phase 1 (1.55.2) | Task |
|------------------|-------------------------|------|
| [Slots](https://docs.copilotkit.ai/custom-look-and-feel/slots) on `CopilotChat` v2 | `CopilotSidebar` + `@copilotkit/react-ui/styles.css` + CSS vars | F48 styling only |
| [Headless UI](https://docs.copilotkit.ai/custom-look-and-feel/headless-ui) `useCopilotChatHeadless_c` | **Out of scope** — Phase 2 after CK v2 migration | — |
| `CopilotKitProvider` from `@copilotkit/react` | `CopilotKit` from `@copilotkit/react-core` | already wired |

**Layout note:** Mindtrip puts chat in the **center** column. CopilotKit **`CopilotSidebar`** puts chat in a **side** panel and `{children}` in the main area. Phase 1 accepts this — map + nav live in `children`; chat stays in sidebar. True center-column chat requires headless UI (Phase 2).

## 1. Purpose

**Camila** and **Tourist** get a Mindtrip-*inspired* desktop shell on `/`: persistent map in the main canvas + CopilotKit chat in the sidebar. This task is the **CopilotKit-specific layout** half of MAP-001 — MAP-001 owns contracts/pins/vis.gl; F48 owns how CopilotKit + map share the page.

## 2. Goals

### Layout (`CopilotSidebar` + main canvas — official v1 pattern)

Per [CopilotSidebar v1](https://docs.copilotkit.ai/reference/v1/components/chat/CopilotSidebar): **`children`** = your app; sidebar = chat.

```text
┌──────────────────────────────────────────────────────────────┐
│ CopilotSidebar (chat panel — left or right edge)             │
├─────────────┬────────────────────────────────────────────────┤
│ App nav     │ ChatMap + results (children of CopilotSidebar) │
│ (optional   │ MapContext pins                                │
│  defer)     │ 420px min-width map column on lg+            │
└─────────────┴────────────────────────────────────────────────┘
```

- Refactor `src/app/page.tsx`:
  - Keep `<CopilotSidebar defaultOpen clickOutsideToClose={false}>` wrapping main canvas.
  - Inside `children`: grid with map **right** (`420px` on `lg+`), optional left nav stub (`280px`).
  - Mount `ChatMap` from MAP-001 inside `MapProvider` / `APIProvider`.
  - Remove placeholder copy `"Pin map lands in MAP-001"`.
- **`useCopilotAction` / `useCoAgent` hooks** must live in a **client child component** inside `CopilotSidebar` (see `YourMainContent` pattern in `CopilotKit/examples/integrations/mastra/src/app/page.tsx`) — F49 mounts renders there.
- `src/app/chat/page.tsx` — redirect to `/` only.
- **Do not** add a second `<CopilotKit>` on `page.tsx` — provider stays in `layout.tsx`.
- **Do not** use v2 `CopilotChat` slots or headless hooks in this task.

### CopilotKit sidebar behavior

- `defaultOpen`, `clickOutsideToClose={false}` (preserve prod behavior).
- Main content area must not collapse map to zero width on desktop.
- Phase 1 English labels only.

### Map integration (from MAP-001)

- Wrap page subtree with `MapProvider` (or export from `platform/maps/`).
- `ChatMap` reads `pins` from `useMapContext()` — ≥1 test pin from mock until F49 wires live tools.

## 3. Pattern sources

| Need | Source | Do NOT copy |
|------|--------|-------------|
| Runtime + agent | `CopilotKit/examples/integrations/mastra/` | v2 imports |
| Multi-region layout | `examples/canvas/mastra/` | OSM map from `v1/travel` |
| Grid proportions | `/home/sk/mde/.../ChatCanvas.tsx` | `useChat`, edge fn chat |
| Sidebar API | `@copilotkit/react-ui` `CopilotSidebar` | Legacy `FloatingChatWidget` |

## 4. Workflow

1. **Verify** MAP-001 artifacts exist: `platform/contracts/`, `platform/maps/map-context.tsx`, `platform/maps/chat-map.tsx`.
2. Create `src/components/chat/chat-canvas.tsx` (client) — grid shell; accepts `mapPanel` + `children` slots.
3. Refactor `page.tsx`: header + `<ChatCanvas mapPanel={<ChatMap />}>` inside `CopilotSidebar` children.
4. Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in `mdeapp/.env.local`.
5. localhost: `npm run dev` → `GET /` 200 → DOM has three regions at 1280px; map panel shows `<Map mapId=...>`.
6. Prod sanity: relative `runtimeUrl="/api/copilotkit"` — no hardcoded port.
7. Write `tasks/notes/F48-evidence.md`.

## 5. Wiring plan

| Action | Path |
|--------|------|
| Create | `mdeapp/src/components/chat/chat-canvas.tsx` |
| Modify | `mdeapp/src/app/page.tsx` |
| Verify | `mdeapp/src/app/layout.tsx` (no duplicate CopilotKit) |
| Verify | `mdeapp/src/app/chat/page.tsx` (redirect only) |
| Use | `mdeapp/src/platform/maps/*` from MAP-001 |

## 6. Out of scope

- `useCopilotAction` card renders (**F49**)
- `useCoAgentState` MapUiState (**F50**)
- Left nav history / thread list (MAP-007)
- Mobile bottom sheet (MAP-007)
- Grounding Lite (**MAP-002**)
- New Mastra tools or agent changes

## 7. Acceptance criteria

1. `GET http://localhost:3001/` → **200** (gate 9).
2. At 1280px viewport: sidebar chat + main canvas with map region (nav stub optional).
3. Map panel renders inside `<Map mapId={getGoogleMapsMapId()}>` with ≥1 `<AdvancedMarker>` (mock pin OK).
4. CopilotKit chat sends message → concierge responds (existing F19 smoke still passes).
5. No `useCoAgent({ name: ... })` name mismatch in console — hook `name` must equal `conciergeAgent`.
6. No legacy chat imports (`useChat`, `ChatMessageList`, edge `/functions/v1/chat`).
7. No v2-only imports: `rg "@copilotkit/react-core/v2|useRenderTool|useFrontendTool|useComponent|CopilotKitProvider" mdeapp/src` → **0**.
8. CopilotKit **1.55.2** pinned — no v1/v2 mix.
9. `npm run floor` exit 0.
10. Evidence: `tasks/notes/F48-evidence.md` with screenshot + curl output.

## 8. Personas

- **Camila:** opens `/`, sees map beside chat before asking for Laureles rentals.
- **Tourist:** map column ready for restaurant pins (F49).
- **Sofía:** one CopilotKit provider, one agent key, one map writer (`MapContext`).

## 9. Tests

- Manual: dev server + browser 1280px layout
- Optional Vitest: layout helper exports if extracted
- Playwright: defer to F39 / MAP-007

## 10. Definition of Done

All §7 + gate 9 localhost proof. Commit: `feat(chat): CopilotKit 3-panel map canvas on / (F48)`.
