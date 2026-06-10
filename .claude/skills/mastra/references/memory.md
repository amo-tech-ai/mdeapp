---
title: Mastra memory — docs + reference
description: Load when configuring Mastra Memory, working memory, threads, or storage. mdeapp Phase 1 = thread-scoped working memory only.
parent: mastra
impact: HIGH
impactDescription: Doc URLs and reference API for @mastra/memory
tags: mastra, memory, working-memory, observational-memory
---

# Mastra memory — docs & reference index

**mdeai Phase 1 concierge:** thread-scoped **working memory** (Zod in agent + `src/lib/types.ts`) only. Do **not** enable observational memory, semantic recall, or multi-user threads in production unless a task opens Phase 2.

**Lookup order:** [`mcp-docs-lookup.md`](mcp-docs-lookup.md) → **`mastraDocs`** paths below → [`links.md`](../links.md).

---

## Concepts (docs)

| Topic | URL | mdeai |
| --- | --- | --- |
| Agents (memory entry) | https://mastra.ai/docs/agents/overview | Working memory wired on `conciergeAgent` |
| Memory overview | https://mastra.ai/docs/memory/overview | Start here |
| Storage | https://mastra.ai/docs/memory/storage | LibSQL dev; Postgres prod path |
| Message history | https://mastra.ai/docs/memory/message-history | Thread turns |
| Working memory | https://mastra.ai/docs/memory/working-memory | **Phase 1 — primary** |
| Observational memory | https://mastra.ai/docs/memory/observational-memory | Phase 2 defer |
| Semantic recall | https://mastra.ai/docs/memory/semantic-recall | Phase 2 defer (use SQL hybrid in MIS) |
| Memory processors | https://mastra.ai/docs/memory/memory-processors | Optional filters |
| Multi-user threads | https://mastra.ai/docs/memory/multi-user-threads | Phase 2 defer |

---

## Reference API (`reference/memory/`)

Index via MCP: `mastraDocs` path `reference/memory/`

| API | URL | Maps to doc |
| --- | --- | --- |
| **`Memory` class** | https://mastra.ai/reference/memory/memory-class | [overview](https://mastra.ai/docs/memory/overview) |
| Observational memory config | https://mastra.ai/reference/memory/observational-memory | [observational-memory](https://mastra.ai/docs/memory/observational-memory) |
| `recall` tool (OM retrieval) | https://mastra.ai/reference/memory/recall | [observational-memory § retrieval](https://mastra.ai/docs/memory/observational-memory) |
| `createThread` | https://mastra.ai/reference/memory/createThread | [multi-user threads](https://mastra.ai/docs/memory/multi-user-threads) |
| `getThreadById` | https://mastra.ai/reference/memory/getThreadById | threads |
| `listThreads` | https://mastra.ai/reference/memory/listThreads | threads |
| `cloneThread` | https://mastra.ai/reference/memory/cloneThread | threads |
| `deleteMessages` | https://mastra.ai/reference/memory/deleteMessages | [message history](https://mastra.ai/docs/memory/message-history) |
| Clone utilities | https://mastra.ai/reference/memory/clone-utilities | threads |
| Client JS memory | https://mastra.ai/reference/client-js/memory | [Mastra Client](https://mastra.ai/docs/server/mastra-client) |

**Processors (memory-related):**

| Processor | URL |
| --- | --- |
| Working memory processor | https://mastra.ai/reference/processors/working-memory-processor |
| Semantic recall processor | https://mastra.ai/reference/processors/semantic-recall-processor |
| Message history processor | https://mastra.ai/reference/processors/message-history-processor |

**Storage (persistence layer):** https://mastra.ai/reference/storage/ · doc: [storage](https://mastra.ai/docs/memory/storage)

---

## MCP fetch examples

```json
{
  "paths": [
    "docs/memory/working-memory",
    "docs/memory/observational-memory",
    "reference/memory/memory-class",
    "reference/memory/observational-memory"
  ]
}
```

Package: `@mastra/memory` — use `readMastraDocs` with `projectPath: /home/sk/mdeai/mdeapp`.

---

## mdeai pointers

| Artifact | Path |
| --- | --- |
| Concierge working memory schema | `mdeapp/src/mastra/agents/concierge.ts` + `mdeapp/src/lib/types.ts` |
| Concierge patterns | [`mdeai-concierge.md`](mdeai-concierge.md) |
| v1 memory migration | https://mastra.ai/guides/migrations/upgrade-to-v1/memory |
