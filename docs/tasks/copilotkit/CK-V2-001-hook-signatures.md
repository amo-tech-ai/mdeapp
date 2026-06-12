# CK-V2-001 — v2 hook-signature verification (spike deliverable)

**Task:** SAN-887 · CK-V2-001 — v2 hook-signature verification spike (gate before any v2 code)  
**Date:** 2026-06-12  
**Sources:** CopilotKit MCP (`search-docs`, `search-code`) · `@copilotkit/react-core@1.55.2` types · [audit](../../upgradeV2/02-upgrade-tasks-linear.md)

---

## Verdict

**GO for SAN-888** — with the hook mappings below. Backend unchanged.

---

## Confirmed mappings (mdeai subpath on 1.55.2)

| v1 pattern | v2 hook | Notes |
|---|---|---|
| Import `@copilotkit/react-core` | `@copilotkit/react-core/v2` | Keep `<CopilotKit>` name |
| Import `@copilotkit/react-ui` | `@copilotkit/react-core/v2` | |
| `@copilotkit/react-ui/styles.css` | `@copilotkit/react-core/v2/styles.css` | Per-route during transition |
| `useCopilotReadable` / `useCopilotAdditionalInstructions` | `useAgentContext` | Straight rename |
| `useCopilotAction` + **handler** | `useFrontendTool` | Zod `parameters` in v2 |
| `useCopilotAction` + `available:"disabled"` + **render** | **`useRenderTool`** | Backend Mastra tool only |
| `renderAndWaitForResponse` | **`useHumanInTheLoop`** | Not unchanged |
| `useCoAgent({ name, state, setState })` | `useAgent({ agentId })` + `agent.state` / `agent.setState` | **Not** same call shape |

---

## Analytics route (`hostOpsAgent`) — recommended v2 shape

```tsx
import { useAgent, useRenderTool } from "@copilotkit/react-core/v2";

useRenderTool({ name: "getSalesInsightsTool", render: insightRender }, [insightRender]);
useRenderTool({ name: "listHostEventsTool", render: eventsRender }, [eventsRender]);

const { agent } = useAgent({ agentId: "hostOpsAgent" });
```

---

## Open questions (resolve in spike PR if needed)

- [ ] `<CopilotKit>` v2 accepts mdeai Pattern-1 props from `copilotkit-client-props.ts`
- [ ] `useRenderTool` `result` is JSON string — confirm Zod lift matches v1
- [ ] Analytics can ship with local state + `useRenderTool` only

---

## References

- [Which Hook for Which Job](https://docs.copilotkit.ai/concepts/which-hook)
- [Mastra shared state (v2)](https://docs.copilotkit.ai/integrations/mastra/shared-state/in-app-agent-write)

---

## @ag-ui/client (official Migrate-to-V2 Step 4)

**Probe:** `grep @ag-ui/client src/**` on 2026-06-12

| Finding | Action |
|---|---|
| Only `src/mastra/copilotkit/logging-mastra-agent.ts` imports `@ag-ui/client` (types: `BaseEvent`, `RunAgentInput`) | **Not a frontend migration step** — backend logging bridge |
| `package.json` pins `@ag-ui/client@0.0.52` | Optional coordinated bump with Mastra/CopilotKit — **not blocking SAN-888** |
| Frontend v2 | Types re-exported from `@copilotkit/react-core/v2` — no separate install required for React migration |

**Spike decision:** Document only; defer `@ag-ui/client` version bump to a separate infra issue unless Mastra release notes require it.

---

## Chat route (`conciergeAgent`) — corrected path (SAN-890)

**Do not use `useCopilotChatHeadless_c` on the v2 subpath.** It is exported from v1 `@copilotkit/react-core` only — not from `@copilotkit/react-core/v2@1.55.2`. Mixing v1 headless + v2 imports violates the no v1/v2 mix rule.

| v1 | v2 (pinned 1.55.2) |
|---|---|
| `useCoAgent({ name: "conciergeAgent" })` | `useAgent({ agentId: "conciergeAgent" })` + `agent.state` / `setState` |
| `CopilotChat` + `AssistantMessage` from `react-ui` | `CopilotChat` from `/v2` + `assistantMessage` slot |
| `useCopilotChat` / headless internals | Stock `CopilotChat` + slots; optional `useCopilotChatConfiguration` |
| Disabled search renders | `useRenderTool` |
| Venue booking `renderAndWaitForResponse` | `useHumanInTheLoop` |
