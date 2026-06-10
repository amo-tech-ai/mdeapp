---
title: Mastra streaming — docs + reference
description: Load when debugging SSE, tool-call streaming, or AG-UI event bridges from Mastra agents.
parent: mastra
impact: HIGH
impactDescription: Doc URLs and reference API for agent/workflow/tool streaming
tags: mastra, streaming, sse, events, tool-streaming
---

# Mastra streaming — docs & reference index

**mdeai Phase 1:** Camila's `/chat` streams via **CopilotKit + AG-UI** (`getLocalAgents` in-process). Mastra `Agent.stream()` events (`text-delta`, `tool-call`, `tool-result`) bridge through the runtime — read [events](https://mastra.ai/docs/streaming/events) + [tool streaming](https://mastra.ai/docs/streaming/tool-streaming) when debugging generative UI or tool progress. **Background task streaming** is Phase 2 unless a task enables `backgroundTaskManager`.

**Lookup order:** [`mcp-docs-lookup.md`](mcp-docs-lookup.md) → **`mastraDocs`** paths below → [`links.md`](../links.md).

---

## Concepts (docs — Supatabs)

| Topic | URL | mdeai |
| --- | --- | --- |
| Overview | https://mastra.ai/docs/streaming/overview | `.stream()` vs `.streamLegacy()`; agent vs workflow streams |
| Events | https://mastra.ai/docs/streaming/events | `start`, `text-delta`, `tool-call`, `tool-result`, workflow lifecycle |
| Tool streaming | https://mastra.ai/docs/streaming/tool-streaming | `context.writer`, transient chunks, tool lifecycle hooks |
| Workflow streaming | https://mastra.ai/docs/streaming/workflow-streaming | Step `writer`, `resumeStream`, pipe agent → step |
| Background task streaming | https://mastra.ai/docs/streaming/background-task-streaming | `backgroundTaskManager.stream()` — needs config flag |

**Related:** [CopilotKit + Mastra guide](https://mastra.ai/guides/build-your-ui/copilotkit) · [background tasks](https://mastra.ai/docs/agents/background-tasks) · [workflows index](workflows.md)

---

## Reference API (`reference/streaming/`)

Index via MCP: `mastraDocs` path `reference/streaming/`

| API | URL | Maps to doc |
| --- | --- | --- |
| **Chunk types** | https://mastra.ai/reference/streaming/ChunkType | [events](https://mastra.ai/docs/streaming/events) · [background tasks](https://mastra.ai/docs/streaming/background-task-streaming) |

### Agents (`reference/streaming/agents/`)

| Method | URL | Doc |
| --- | --- | --- |
| **`Agent.stream()`** | https://mastra.ai/reference/streaming/agents/stream | [overview](https://mastra.ai/docs/streaming/overview) |
| **`MastraModelOutput`** | https://mastra.ai/reference/streaming/agents/MastraModelOutput | output shape · `textStream`, `usage`, `finishReason` |
| **`streamLegacy()`** | https://mastra.ai/reference/streaming/agents/streamLegacy | AI SDK v4 / V1 models |
| **`streamUntilIdle()`** | https://mastra.ai/reference/streaming/agents/streamUntilIdle | [background task streaming](https://mastra.ai/docs/streaming/background-task-streaming) |

Also on agent class index: [`.stream()` in agents API](https://mastra.ai/reference/agents/agent) · [generate vs stream](https://mastra.ai/reference/agents/generate)

### Workflows (`reference/streaming/workflows/`)

| Method | URL | Doc |
| --- | --- | --- |
| **`Run.stream()`** | https://mastra.ai/reference/streaming/workflows/stream | [overview](https://mastra.ai/docs/streaming/overview) · [workflow streaming](https://mastra.ai/docs/streaming/workflow-streaming) |
| **`Run.resumeStream()`** | https://mastra.ai/reference/streaming/workflows/resumeStream | suspended workflow + [snapshots](https://mastra.ai/docs/workflows/snapshots) |
| **`Run.observeStream()`** | https://mastra.ai/reference/streaming/workflows/observeStream | attach to in-flight run |
| **`Run.timeTravelStream()`** | https://mastra.ai/reference/streaming/workflows/timeTravelStream | [time travel](https://mastra.ai/docs/workflows/time-travel) |

---

## Event cheat sheet (agents)

From [streaming/events](https://mastra.ai/docs/streaming/events):

| Event | When |
| --- | --- |
| `start` | Run begins |
| `text-delta` | LLM token chunk |
| `tool-call` | Tool name + args chosen |
| `tool-result` | Tool return value |
| `step-start` / `step-finish` | Step boundaries |
| `finish` | Run complete + usage |

**Network / supervisor** (Phase 2 defer): `routing-agent-*`, `agent-execution-*`, `workflow-execution-*` — see events doc.

---

## MCP fetch examples

```json
{
  "paths": [
    "docs/streaming/overview",
    "docs/streaming/events",
    "docs/streaming/tool-streaming",
    "reference/streaming/agents/stream",
    "reference/streaming/agents/MastraModelOutput",
    "reference/streaming/workflows/stream",
    "reference/streaming/ChunkType"
  ]
}
```

Package: `@mastra/core` — use `readMastraDocs` with `projectPath: /home/sk/mdeai/mdeapp`.

---

## mdeai pointers

| Artifact | Path |
| --- | --- |
| CopilotKit runtime (AG-UI bridge) | `mdeapp/src/app/api/copilotkit/route.ts` |
| CopilotKit integration skill | `copilotkit-integrations` → `references/integrations/mastra.md` |
| Tool definitions (writer hooks) | `mdeapp/src/mastra/tools/**` |
| AI SDK v5 bridge | `toAISdkV5Stream()` from `@mastra/ai-sdk` — see [overview](https://mastra.ai/docs/streaming/overview) |
