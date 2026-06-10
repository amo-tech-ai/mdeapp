---
title: Mastra skill — reference index
description: Load to pick which references/*.md to open for a Mastra task. Every reference file has YAML frontmatter with its own load_when description.
parent: mastra
impact: HIGH
impactDescription: Progressive disclosure for 30+ reference modules
tags: mastra, index, references
---

# Mastra references index

Read **one** reference file per task (plus [`topic-routing.md`](topic-routing.md) when unsure).

| File | Load when |
| --- | --- |
| [`topic-routing.md`](topic-routing.md) | Any Mastra doc lookup — maps intent → `links.md` + local ref |
| [`embedded-docs.md`](embedded-docs.md) | Packages installed; need version-accurate API from `node_modules/@mastra` |
| [`mcp-docs-lookup.md`](mcp-docs-lookup.md) | Using Cursor `user-mastra` MCP (`mastraDocs`, `searchMastraDocs`) |
| [`remote-docs.md`](remote-docs.md) | No local packages; fetch from mastra.ai |
| [`create-mastra.md`](create-mastra.md) | New Mastra project / CLI setup |
| [`workflows.md`](workflows.md) | DAG workflows, suspend/resume, HITL (Roberto) |
| [`memory.md`](memory.md) | Memory, working memory, threads, recall |
| [`streaming.md`](streaming.md) | SSE, tool-call events, AG-UI bridge |
| [`browser.md`](browser.md) | AgentBrowser / Stagehand (Phase 2+) |
| [`tools.md`](tools.md) | `createTool`, tool schemas, agent tools |
| [`mcp.md`](mcp.md) | MCPClient / MCPServer overview (vendor paste — verify) |
| [`mcp-apps.md`](mcp-apps.md) | MCP Apps / Studio iframe UIs |
| [`agents-supervisor.md`](agents-supervisor.md) | Supervisor + subagents (Phase 2 defer for mdeapp) |
| [`multi-agent.md`](multi-agent.md) | Multi-agent concepts and patterns |
| [`mdeai-concierge.md`](mdeai-concierge.md) | `my-mastra-app` concierge / legacy transport |
| [`../copilotkit-integrations/references/integrations/mastra.md`](../copilotkit-integrations/references/integrations/mastra.md) | **mdeapp** CopilotKit 1.55.2 Pattern 1 (`getLocalAgents`) |
| [`copilotkit.md`](copilotkit.md) | Mastra **separate-server** + CopilotKit (not mdeapp default) |
| [`display-only.md`](display-only.md) | CopilotKit **v2** display-only — **defer** Phase 1 mdeapp |
| [`headless-ui.md`](headless-ui.md) | CopilotKit **v2** headless — **defer** Phase 1 mdeapp |
| [`slots.md`](slots.md) | CopilotKit **v2** slots — **defer** Phase 1 mdeapp |
| [`examples-v0.md`](examples-v0.md) | Runnable v0 examples, Supatabs tables |
| [`common-errors.md`](common-errors.md) | Type errors / API mismatch debugging |
| [`migration-guide.md`](migration-guide.md) | Mastra v0 → v1 upgrades |
| [`model-providers.md`](model-providers.md) | Model router / provider strings |
| [`gemini.md`](gemini.md) | Google models in Mastra (**mdeapp = gemini skill**) |
| [`openai.md`](openai.md) | OpenAI models in Mastra |
| [`ai-sdk.md`](ai-sdk.md) | Vercel AI SDK + Mastra |
| [`react.md`](react.md) | React / Next starters |
| [`supabase-auth.md`](supabase-auth.md) | Supabase auth on Mastra server |
| [`workspace.md`](workspace.md) | Mastra workspace / BrowserViewer |
| [`workspace-skills.md`](workspace-skills.md) | Workspace `SKILL.md` trees |
| [`rag-mastra.md`](rag-mastra.md) | RAG overview (Phase 2 defer) |
| [`rag-pgvector.md`](rag-pgvector.md) | PgVector embedding storage |

**mdeapp rule:** Production agents use **Gemini only** + **CopilotKit 1.55.2 v1** — not OpenAI examples in vendor docs unless explicitly prototyping.
