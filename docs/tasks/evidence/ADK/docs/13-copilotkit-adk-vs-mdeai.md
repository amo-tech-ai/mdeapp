---
doc_id: CK-ADK-COMPARE
title: CopilotKit Google ADK docs vs mdeai setup
version: 1.0
date: 2026-05-25
status: Active
related:
  - ./12-cloud-run-production-plan.md
  - ./sidecar-api-contract.md
  - ../../../CopilotKit/examples/integrations/adk
  - ../../../CopilotKit/examples/integrations/mastra
official:
  - https://docs.copilotkit.ai/google-adk
  - https://docs.copilotkit.ai/google-adk/concepts/architecture
  - https://docs.copilotkit.ai/google-adk/quickstart
---

# CopilotKit + ADK docs vs mdeai — are we using it correctly?

## Short answer

**Yes — for mdeai’s locked architecture.** You are **not** following the [CopilotKit Google ADK quickstart](https://docs.copilotkit.ai/google-adk/quickstart) wiring (runtime → `HttpAgent` → Python `ag_ui_adk`), and **you should not** for Phase 1. That path is what [`CopilotKit/examples/integrations/adk`](../../../CopilotKit/examples/integrations/adk) demonstrates. mdeai matches [`integrations/mastra`](../../../CopilotKit/examples/integrations/mastra) for the runtime and uses ADK only as a **Maps grounding sidecar** over a custom HTTP contract.

---

## Two valid CopilotKit + Google patterns

| | **CopilotKit ADK integration** (docs + `integrations/adk`) | **mdeai (current)** |
|---|--------------------------------------------------------------|---------------------|
| **Runtime agent** | `HttpAgent` → `AGENT_URL` (Python :8000) | `MastraAgent.getLocalAgents` (in-process Mastra) |
| **Python service** | `ag_ui_adk.ADKAgent` + `add_adk_fastapi_endpoint` | `services/adk-grounding` FastAPI — **no** `ag_ui_adk` |
| **Protocol to agent** | Full **AG-UI** session (chat, tools, state stream) | Mastra AG-UI bridge; ADK gets **one** JSON `POST /v1/grounding/invoke` |
| **Chat brain** | `google.adk` `LlmAgent` | Mastra `conciergeAgent` / `hostEventAgent` (Gemini via `@ai-sdk/google`) |
| **Frontend hook** | `useCoAgent({ name: "my_agent" })` | `useCoAgent({ name: "conciergeAgent" })` — same **hook family**, different agent name |
| **Shared state** | ADK `ToolContext.state` ↔ `useCoAgent` | Mastra working memory / Zod state ↔ `useCoAgent` |
| **Generative UI** | `useRenderToolCall`, `useFrontendTool` | `useCopilotAction` + `available: "disabled"` mirrors Mastra tools |

---

## What the CopilotKit ADK docs describe (and what applies)

From [Architecture](https://docs.copilotkit.ai/google-adk/concepts/architecture): **Frontend → Runtime → Agent over AG-UI**. mdeai implements all three layers; the **agent** layer is **Mastra**, not ADK.

| Doc area | Applies to mdeai? | How |
|----------|-------------------|-----|
| [Architecture](https://docs.copilotkit.ai/google-adk/concepts/architecture) | ✅ | Same 3-layer shape; agent = Mastra |
| [AG-UI protocols](https://docs.copilotkit.ai/google-adk/agentic-protocols) | ✅ | `@ag-ui/mastra` in `route.ts` |
| [Generative UI](https://docs.copilotkit.ai/google-adk/concepts/generative-ui-overview) | ✅ | Tool-call rendering + HITL on host event |
| [Shared state read/write](https://docs.copilotkit.ai/google-adk/shared-state/in-app-agent-read) | ✅ | `useCoAgent` + Mastra memory schema (not ADK `ToolContext`) |
| [Workflow execution](https://docs.copilotkit.ai/google-adk/shared-state/workflow-execution) | ⚠️ Partial | Filter state in Mastra/Zod, not ADK agent state |
| [Predictive state](https://docs.copilotkit.ai/google-adk/shared-state/predictive-state-updates) | ⚠️ Phase 2 | Could add Mastra streaming metadata; not ADK `step_progress` |
| [Quickstart](https://docs.copilotkit.ai/google-adk/quickstart) | ❌ Runtime wiring | Use only if migrating to HttpAgent → ADK |

**Docs API note:** New CopilotKit ADK pages show `useAgent` from `@copilotkit/react-core/v2`. mdeapp is pinned to **CopilotKit 1.55.2** and uses **`useCoAgent`** — correct for v1; not a misconfiguration.

---

## Side-by-side: `integrations/adk` vs `mdeapp`

### Runtime (`route.ts`)

**ADK example** — agent is remote ADK over AG-UI:

```typescript
agents: {
  my_agent: new HttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8000/",
  }),
},
```

**mdeapp** — agent is local Mastra:

```typescript
agents: getLocalAgentsWithLogging({ mastra, resourceId, userId, requestContext }),
```

### Python

| | ADK example `agent/main.py` | mdeai `services/adk-grounding/main.py` |
|---|------------------------------|----------------------------------------|
| Package | `ag_ui_adk`, `google.adk` | FastAPI + httpx MCP only |
| Endpoint | `add_adk_fastapi_endpoint(app, adk_agent, path="/")` | `POST /v1/grounding/invoke` |
| Purpose | Full conversational agent | Maps grounding tool backend |

### Frontend agent name

| Surface | `useCoAgent` name | Must match runtime key |
|---------|-------------------|-------------------------|
| ADK example | `my_agent` | `my_agent` in `CopilotRuntime` |
| mdeapp `/` | `conciergeAgent` | Mastra `agents.conciergeAgent` |
| mdeapp `/host/event` | `hostEventAgent` | Mastra `agents.hostEventAgent` |

Name alignment is **correct** in mdeapp (same rule as docs, different names).

---

## Cloud Run + CopilotKit ADK docs

- [ADK deploy Cloud Run](https://adk.dev/deploy/cloud-run/) + our [`12-cloud-run-production-plan.md`](./12-cloud-run-production-plan.md) target **`services/adk-grounding`** only.
- That **does not** change `route.ts` to `HttpAgent`.
- Vercel still sets `ADK_GROUNDING_URL`; CopilotKit still hits `/api/copilotkit` → Mastra.

---

## When you *would* adopt CopilotKit ADK integration

Consider the [integrations/adk](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/adk) pattern only if product explicitly wants:

- ADK `LlmAgent` as the **primary** chat orchestrator (replacing Mastra for a surface), or
- ADK graph workflows / sub-agents as the user-facing brain, or
- CopilotKit Cloud routing directly to a Python ADK AG-UI server.

**Cost:** Two orchestrators, Supabase writes move to ADK tools or duplicate bridges, breaks current MAP-002 / PRD lock.

**Recommendation:** Keep Mastra + sidecar; optionally add `ag_ui_adk` **inside** Cloud Run later only if you merge invoke + chat (Phase 3+), not for MAP-002 MVP.

---

## Checklist — “using CopilotKit correctly” for mdeai

| Check | Status |
|-------|--------|
| Runtime in Next.js App Router | ✅ `api/copilotkit/route.ts` |
| Agent name matches `useCoAgent` | ✅ `conciergeAgent`, `hostEventAgent` |
| No `NEXT_PUBLIC` ADK URL | ✅ server-only `ADK_GROUNDING_URL` |
| Generative UI mirrors Mastra tools | ✅ `useCopilotAction` disabled + render |
| ADK not wired as HttpAgent in CK | ✅ intentional |
| CopilotKit ADK quickstart pattern | ❌ not used — **by design** |

---

## Verdict

| Question | Answer |
|----------|--------|
| Are we misusing CopilotKit? | **No** |
| Should we copy `integrations/adk` `route.ts`? | **No** for Phase 1 |
| Do CopilotKit ADK docs still help? | **Yes** — architecture, generative UI, shared-state *concepts*; implement on Mastra |
| Is ADK “unused”? | **No** — used as grounding sidecar; not as CK runtime agent |
