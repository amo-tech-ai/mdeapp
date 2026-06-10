---
title: Mastra examples v0 — Supatabs index
description: Load for runnable Mastra v0 examples and Supatabs-style tables.
parent: mastra
impact: HIGH
impactDescription: Runnable example URLs from mastra.ai/examples/v0 (not in mastraDocs MCP)
tags: mastra, examples, whatsapp, working-memory, supervisor
---

# Mastra examples v0 — Supatabs index

**Fetch note:** `examples/v0/*` paths are **not** in the `mastraDocs` MCP tree. Use HTTP (browser), Firecrawl, or `curl -L` on the URLs below — **`.md` suffix returns 404**.

**Lookup order:** this file → [`links.md`](../links.md) → live page → related `docs/` via MCP.

---

## Guides (Supatabs)

| Guide | URL | mdeai |
| --- | --- | --- |
| **WhatsApp chat bot** | https://mastra.ai/guides/guide/whatsapp-chat-bot | Phase 2 Colombia channel; pairs with example below. **Gemini-only in mdeapp** — guide uses OpenAI; swap model + env pattern only |

---

## Examples v0 — agents

| Example | URL | mdeai |
| --- | --- | --- |
| **Calling agents** | https://mastra.ai/examples/v0/agents/calling-agents | Agent invokes another agent from tool/step |
| **Supervisor agent** | https://mastra.ai/examples/v0/agents/supervisor-agent | **Phase 2 defer** — do not wire in Phase 1 concierge |
| **AI SDK v5 integration** | https://mastra.ai/examples/v0/agents/ai-sdk-v5-integration | `toAISdkV5Stream` / UI bridge patterns — compare CopilotKit Pattern 1 |
| **WhatsApp chat bot** | https://mastra.ai/examples/v0/agents/whatsapp-chat-bot | Runnable counterpart to [WhatsApp guide](https://mastra.ai/guides/guide/whatsapp-chat-bot) |

---

## Examples v0 — workflows

| Example | URL | mdeai |
| --- | --- | --- |
| **Inngest workflow** | https://mastra.ai/examples/v0/workflows/inngest-workflow | Durable/scheduled runner pattern — EVP-022 event ingest reference |

---

## Examples v0 — memory

| Example | URL | mdeai |
| --- | --- | --- |
| **Working memory template** | https://mastra.ai/examples/v0/memory/working-memory-template | Template-driven WM — compare `conciergeAgent` working memory |
| **Working memory schema** | https://mastra.ai/examples/v0/memory/working-memory-schema | Zod WM schema — **mirror three places:** agent Zod, `src/lib/types.ts`, (W4) packages |

**Docs cross-ref:** [`memory.md`](memory.md) · [working memory doc](https://mastra.ai/docs/memory/working-memory)

---

## Browser (Supatabs cross-ref)

| Doc | URL |
| --- | --- |
| BrowserViewer | https://mastra.ai/docs/browser/browser-viewer |

Full index: [`browser.md`](browser.md)

---

## MCP / doc equivalents (when examples 404)

| Example topic | MCP `mastraDocs` fallback |
| --- | --- |
| Calling agents | `docs/workflows/agents-and-tools` · `reference/agents/generate` |
| Supervisor | `docs/agents/supervisor-agents` *(Phase 2)* |
| AI SDK v5 | `docs/streaming/overview` · [`streaming.md`](streaming.md) |
| Working memory | `docs/memory/working-memory` · `reference/memory/memory-class` |
| Inngest / durable | `docs/workflows/scheduled-workflows` · [`workflows.md`](workflows.md) |
| WhatsApp | `guides/guide/whatsapp-chat-bot` *(MCP path works)* |

---

## mdeai pointers

| Artifact | Path |
| --- | --- |
| Working memory today | `mdeapp/src/mastra/agents/` · `mdeapp/src/lib/types.ts` |
| CopilotKit bridge (not AI SDK UI) | `copilotkit-integrations` skill |
| WhatsApp / channels | Deferred Phase 2 — PRD W7+ |
