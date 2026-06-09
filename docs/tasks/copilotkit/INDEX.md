---
title: CopilotKit gap backlog
parent_index: ../INDEX.md
archived_product_specs: ../archive/copilot-A/README.md
gap_backlog: ./BACKLOG-ck-gaps.md
---

# CopilotKit — active folder

> **Done product specs** → [`../archive/copilot-A/`](../archive/copilot-A/README.md) (F48, F49, F50, F50b).  
> **This folder** = gap backlog (CK-001–008) only. Example paths live in bound task `verified_against` fields — not separate stub files.

---

## Completion snapshot (2026-05-26)

| Tier | Complete? |
|------|:---------:|
| F48–F50b map shell + cards + state | **Yes** — archived |
| Runtime (`CopilotKit` + Mastra bridge) | **Yes** — F01–F03, F19 in [`archive/core`](../archive/core/README.md) |
| CK-FE-001 `focusMapPin` | **Yes** — code shipped; CK-003 backlog item **partial** |
| CK-001–008 gap backlog | **No** — see [`BACKLOG-ck-gaps.md`](./BACKLOG-ck-gaps.md) |

**Smoke note:** `npm run smoke:f50-pin-sync` failed 2026-05-26 (UI text timeout). Code exists; smoke script needs refresh before CK-005 Done.

---

## Example routing (inline in bound specs)

| Example path | Bound specs |
|--------------|-------------|
| `CopilotKit/examples/integrations/mastra/` | [F01](../archive/core/F01-bootstrap-mdeapp.md), F02, F03, EVP-009 |
| `CopilotKit/examples/canvas/mastra/` | [F50](../archive/copilot-A/F50-copilotkit-map-ui-state.md), MAP-001, MAP-007B |
| `CopilotKit/examples/canvas/mastra-pm/` | [EVP-008](../archive/events-A/EVP-008-core-event-draft-state-types.md), [EVP-009](../archive/events-A/EVP-009-core-host-event-agent.md) |
| `CopilotKit/examples/v1/form-filling/` | [EVP-010](../archive/events-A/EVP-010-core-host-event-wizard.md) |
| `CopilotKit/examples/showcases/generative-ui/` | [F49](../archive/copilot-A/F49-copilotkit-generative-search-ui.md), F46 |
| `CopilotKit/examples/showcases/banking/` | [EVP-011](../archive/events-A/EVP-011-core-approval-panel-hitl.md) |
| `CopilotKit/examples/v1/chat-with-your-data/` | [F46](../real-estate/F46-rental-search-workflow.md), [F41](../real-estate/F41-rentals-page-map.md) |
| `CopilotKit/examples/v1/travel/` | Layout reference only — [MAP-007B](../archive/maps-A/MAP-007-chat-three-panel-polish.md); ⚠️ LangGraph + OSM, not vis.gl |

**Defer / avoid:** `showcases/multi-agent-canvas` (Phase 2+), `showcases/a2a-travel` (wrong stack).

---

## Gap backlog (open)

[`BACKLOG-ck-gaps.md`](./BACKLOG-ck-gaps.md) — CK-001…008 (validation + E2E + contracts).

| ID | Status |
|----|--------|
| CK-001 AG-UI SSE smoke | Open |
| CK-002 MapUiState contract | Partial (F50 ✅, formal Zod + CK-005 open) |
| CK-003 Frontend tools | Partial (`focusMapPin` ✅, live agent proof open) |
| CK-004 HITL interrupt/resume | Open (EVP-011/012) |
| CK-005 Playwright pin↔card | Partial (script smoke ✅, Playwright open) |
| CK-006 Inspector | Open |
| CK-007 Streaming lifecycle | Open |
| CK-008 Thread hydration | Post-MVP |

| Crosswalk | [`../mastra/CROSSWALK-ck-ui-e2e-state.md`](../mastra/CROSSWALK-ck-ui-e2e-state.md) |
