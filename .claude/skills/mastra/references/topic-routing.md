---
title: Task → doc routing
description: Load first when unsure which Mastra doc or reference file to open.
parent: mastra
impact: HIGH
impactDescription: Jump from question to links.md and local refs
tags: mastra, routing, docs
---

# Mastra topic routing

Use this file to jump from a **task or question** to the right **official URL table** in [`links.md`](../links.md) and, where useful, a **local reference** in `references/`.

**Rules:**

1. **Canonical URL list** — [`links.md`](../links.md) (synced to [mastra.ai/llms.txt](https://mastra.ai/llms.txt)); regenerate that index when nav 404s.
2. **Version-accurate APIs** — with packages installed, prefer [`embedded-docs.md`](embedded-docs.md) and `node_modules/@mastra/*/dist/docs/`.
3. **Agent-friendly fetch** — append **`.md`** to `https://mastra.ai/docs/...` pages when pulling markdown for context.

---

## Quick map: intent → `links.md` section → local ref

| Intent | Open in `links.md` | Local reference (optional) |
| --- | --- | --- |
| New project / CLI / structure | [Getting started](../links.md#getting-started) | [`create-mastra.md`](create-mastra.md) |
| Studio UI, deploy Studio, Studio auth | [Studio](../links.md#studio) | — |
| Editor (stored agents, prompts, tools) | [Editor](../links.md#editor-stored-agents-prompts-tools) | — |
| Agent behavior, tools, output, supervisor, HITL-ish | [Agents](../links.md#agents) | [`embedded-docs.md`](embedded-docs.md) → Agent |
| **CopilotKit + Mastra (official guide)** | [Guides — build your UI](../links.md#guides-build-your-ui) · [mdeai stack table](../links.md#mdeai-stack-not-in-supatabs-paste--load-first-for-this-repo) | [`../copilotkit-integrations/references/integrations/mastra.md`](../../copilotkit-integrations/references/integrations/mastra.md) for mdeapp Pattern 1 |
| A2A / ACP / supervisor (Phase 2 defer for mdeai) | [Agents](../links.md#agents) · [Supatabs Agents](../links.md#agents-1) | Document only — do not wire in Phase 1 concierge |
| DAG steps, suspend/resume, errors, HITL | [Workflows](../links.md#workflows) · [Reference — workflows](../links.md#reference--workflows) | [`references/workflows.md`](workflows.md) · [`embedded-docs.md`](embedded-docs.md) → Workflow |
| Message history, storage, recall | [Memory](../links.md#memory) · [Reference — memory](../links.md#reference--memory) | [`references/memory.md`](memory.md) · [`embedded-docs.md`](embedded-docs.md) → Memory |
| Define tools (`createTool`, etc.) | [Tools](../links.md#tools-docs-section) | [`embedded-docs.md`](embedded-docs.md) → Tools |
| Chunking, vectors, retrieval | [RAG](../links.md#rag) | — |
| HTTP server, client, routes, request context | [Server & client](../links.md#server-client) | [`supabase-auth.md`](supabase-auth.md) for Supabase auth |
| MCP, MCPClient, MCP apps, workspace skills | [MCP & workspaces](../links.md#mcp-workspaces) | [`workspace.md`](workspace.md), [`workspace-skills.md`](workspace-skills.md) |
| Mastra docs MCP (`mastraDocs`, embedded search) | [`references/mcp-docs-lookup.md`](mcp-docs-lookup.md) | Always `projectPath` → `mdeapp` |
| SSE / streams, tool-call events, AG-UI | [Streaming](../links.md#streaming) · [Reference — streaming](../links.md#reference--streaming) | [`references/streaming.md`](streaming.md) |
| Logs, traces, evals, datasets, CI | [Observability & evals](../links.md#observability-evals) | — |
| Production / cloud | [Deployment](../links.md#deployment) | [`remote-docs.md`](remote-docs.md) |
| Model strings, providers, embeddings | [Models](../links.md#models) | [`model-providers.md`](model-providers.md), [`openai.md`](openai.md), [`gemini.md`](gemini.md); run [`../scripts/provider-registry.mjs`](../scripts/provider-registry.mjs) |
| Vite, Next, Express starter | [Guides — app stacks](../links.md#guides-app-stacks) | [`react.md`](react.md) for React-oriented stacks |
| Runnable v0 examples, WhatsApp guide | [Examples v0](../links.md#examples-v0-supatabs--live-runnable) · [Guides — tutorials](../links.md#guides--tutorials-hands-on) | [`references/examples-v0.md`](examples-v0.md) |
| Multi-agent patterns | [Guides — concepts](../links.md#guides-concepts) | supervisor example = Phase 2 defer |
| Vercel AI SDK + Mastra | [Guides — agent frameworks](../links.md#guides-agent-frameworks) | [`ai-sdk.md`](ai-sdk.md) |
| Host on Vercel | [Guides — deployment (hosting)](../links.md#guides-deployment-hosting) | — |
| Web search tool, RAG tutor, WhatsApp, supervisor tutorial | [Guides — tutorials](../links.md#guides-tutorials-hands-on) | — |
| Browser automation, AgentBrowser, workspace CLI | [Browser automation](../links.md#browser-automation) · [Reference — browser](../links.md#reference--browser) | [`references/browser.md`](browser.md) · [`workspace.md`](workspace.md) for BrowserViewer |
| Mastra Cloud / managed platform | [Mastra platform](../links.md#mastra-platform-managed) | — |
| Build with AI / skills / community templates | [Build with AI & community](../links.md#build-with-ai-community) | [Templates hub](https://mastra.ai/templates) · tables in [`links.md`](../links.md) |

**Note:** `#anchors` follow GitHub-style slugs for headings in [`links.md`](../links.md). If your viewer does not scroll, open `links.md` and search the heading text.

---

## Upstream & ecosystem

| Intent | Open in `links.md` |
| --- | --- |
| Core repo, workshops, examples index | [GitHub — curated top repos](../links.md#github-curated-top-repos) |
| Regressions / open bugs | [Upstream issues](../links.md#upstream-issues-core-framework) |
| Web search **tool** (agent tutorial) | [Web search](../links.md#web-search-official-guide) |
| Apify + Mastra | Row in [GitHub — curated top repos](../links.md#github-curated-top-repos) + Apify docs link there |
| Official skills / templates | [Build with AI & community](../links.md#build-with-ai-community), [Templates](https://mastra.ai/templates) |

---

## Reference API drill-down

| Intent | Open in `links.md` |
| --- | --- |
| Agent methods (`getLLM`, `listTools`, …) | [Reference — agents API](../links.md#reference-agents-api-methods) |
| Config, client-js, workflow methods | [Reference — other high-traffic](../links.md#reference-other-high-traffic-api-areas) |
| Full tree | [mastra.ai/reference](https://mastra.ai/reference) · [llms.txt](https://mastra.ai/llms.txt) |

---

## mdeai repo pointers

| Artifact | Location |
| --- | --- |
| Runtime app | `my-mastra-app/` (from repo root) |
| Mastra PRD / tasks | `tasks/prompts/mastra/` |

(See [`links.md` § mdeai repository](../links.md#mdeai-repository).)

---

## When links 404

Re-fetch [https://mastra.ai/llms.txt](https://mastra.ai/llms.txt) and update [`links.md`](../links.md). For breaking upgrades, see [`migration-guide.md`](migration-guide.md) and [`common-errors.md`](common-errors.md).
