# Core layout audit index

| Audit | Path | Status |
|-------|------|--------|
| Mindtrip 3-panel vs legacy mde | [10-mindtrip-three-panel-layout-audit.md](./10-mindtrip-three-panel-layout-audit.md) | ✅ 2026-05-22 |
| Maps Code Assist + github/maps | [11-maps-audit.md](./11-maps-audit.md) | ✅ 2026-05-22 |
| CopilotKit + Mastra local/prod | [../plan/audit/09-copilotkit-mastra-local-audit.md](../../plan/audit/09-copilotkit-mastra-local-audit.md) | ✅ |
| MAP / Mastra plan | [../plan/audit/08-copilotkit-mastra-plan.md](../../plan/audit/08-copilotkit-mastra-plan.md) | draft |

## CopilotKit + Mastra map tasks (core)

| Order | ID | Title |
|------:|-----|-------|
| 1 | [MAP-001](../maps/MAP-001-platform-map-pipeline.md) | Contracts + MapContext + vis.gl |
| 2 | [F48](../core/F48-copilotkit-map-canvas-layout.md) | 3-panel canvas on `/` |
| 3 | [F49](../core/F49-copilotkit-generative-search-ui.md) | `useCopilotAction` → pins |
| 4 | [F50](../core/F50-copilotkit-map-ui-state.md) | MapUiState + focusPin |
| 5 | [MAP-007](../maps/MAP-007-chat-three-panel-polish.md) | Responsive polish |

**Next product gate:** **MAP-001 + F48 + F49** — ≥3 rental pins on `/` after Laureles query. Do **not** port legacy `useChat`.

## Docs verification (2026-05-22)

Verified against [docs.copilotkit.ai](https://docs.copilotkit.ai/mastra) (Firecrawl scrape) + `CopilotKit/examples/integrations/mastra/` + `node_modules/@copilotkit/react-core` 1.55.2.

| Finding | Impact on tasks |
|---------|-----------------|
| Docs default to **v2** (`useRenderTool`, `useAgent`, `useComponent`) | F48–F50 updated with **v1.55.2 mapping table** — implement v1, not latest doc snippets |
| `CopilotSidebar` = chat **sidebar** + `{children}` = app | F48 layout diagram corrected (not Mindtrip center-chat) |
| Tool render name must match Mastra tool `id` | F49 confirmed (`search-rentals` not `searchRentalsTool`) |
| `available: "disabled"` = agent executes, UI renders only | F49 confirmed |
| Frontend tools = `useCopilotAction` + `handler` in v1 | F50 confirmed (`focusMapPin`) |
| Shared state = `useCoAgent` + working memory Zod in v1 | F50 fixed (`useCoAgentState` removed) |
| Slots / headless UI = v2 customization path | Out of scope Phase 1; MAP-007 uses CSS + layout only |
| In-process runtime required for shared state | Already Pattern 1 in mdeapp ✅ |
