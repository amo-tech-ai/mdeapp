---
name: mastra
description: "Mastra framework: docs lookup (links.md, mastraDocs MCP, embedded docs), agents, workflows, streaming, browser, tools, memory, RAG, processors, CopilotKit guide. Verify from installed docs — never trust training-data APIs. NOT for: product intent routing (mastra-routing), Managed Agents API harness (mde-agents), non-Mastra frameworks. Load when editing src/mastra/**, Mastra tools/workflows, memory, streaming/events, browser automation, or Mastra doc URLs."
title: Mastra framework guide
impact: HIGH
impactDescription: Docs routing, agents/workflows, embedded vs remote APIs
tags: mastra, agents, workflows, tools, memory, rag, typescript
license: Apache-2.0
metadata:
  author: Mastra
  version: "2.0.0"
  repository: https://github.com/mastra-ai/skills
paths:
  - "mdeapp/src/mastra/**"
  - "my-mastra-app/**"
  - "src/mastra/**"
  - "**/*mastra*"
---

# Mastra Framework Guide

## When NOT to use

- **mdeAI product intent routing** (rentals vs events) → `src/mastra/agents/concierge.ts` + PRD; archived `mastra-routing` skill is not scanned
- **Anthropic Managed Agents** cloud harness → **`mde-agents`** (`.agents/skills/`)
- **Generic “build an agent”** with no Mastra imports → **`mde-agents`** or product docs, not framework internals here
- **CopilotKit v2** (`useComponent`, slots, headless v2) → **defer** for mdeapp; use **`copilotkit-integrations`** + [`references/copilotkit.md`](references/copilotkit.md) only for separate-server pattern

Build AI applications with Mastra. This skill teaches you how to find current documentation and build agents and workflows.

## Event discovery ingest (plans 10–11)

| Resource | Path |
|----------|------|
| Workflows | `scrapeEventsWorkflow`, `normalizeEventsWorkflow`, `dedupeEventsWorkflow`, `enrichVenueWorkflow` — [10-plan §8](../../../plan/events/event-discovery/10-event-discover-plan.md) |
| Tasks | [EVP-022-mvp](../../../tasks/events/EVP-022-mvp-event-discovery-workflow.md) · [EVP-005-core](../../../tasks/events/EVP-005-core-event-tool-and-workflow.md) (shipped) |
| Routing | [event-discovery-skill-routing.md](../../../tasks/events/docs/event-discovery-skill-routing.md) |

**Mastra orchestrates batch ingest;** `searchEventsTool` queries approved `events` only. Verify APIs via Mastra docs MCP before new workflow steps.

---

## ⚠️ Critical: Do not trust internal knowledge

Everything you know about Mastra is likely outdated or wrong. Never rely on memory. Always verify against current documentation.

Your training data contains obsolete APIs, deprecated patterns, and incorrect usage. Mastra evolves rapidly - APIs change between versions, constructor signatures shift, and patterns get refactored.

## Prerequisites

Before writing any Mastra code, check if packages are installed:

```bash
ls node_modules/@mastra/
```

- **If packages exist:** Use embedded docs first (most reliable)
- **If no packages:** Install first or use remote docs

## Available files

**Bookmark index:** [`links.md`](links.md) — official `mastra.ai` doc URLs + local reference map (start here for “where is the doc for X?”). Includes **web search** tutorial URL, **[upstream GitHub issues](https://github.com/mastra-ai/mastra/issues)**, and **skill maintenance** ([`.agents/skills/skill-creator/SKILL.md`](../../../.agents/skills/skill-creator/SKILL.md)).

**Reference index:** [`references/README.md`](references/README.md) — every `references/*.md` file has YAML frontmatter (`title`, `description`, `parent: mastra`). Load **one** ref per task.

**Topic routing:** [`references/topic-routing.md`](references/topic-routing.md) — maps tasks (agents, workflows, MCP, deployment, …) to the right `links.md` section and optional local `references/*.md` files.

## Mastra docs MCP

**Cursor:** `user-mastra` server — see [`references/mcp-docs-lookup.md`](references/mcp-docs-lookup.md).

| Tool | Use when |
| --- | --- |
| **`mastraDocs`** | You know the doc path (`docs/...`, `guides/...`, `reference/...`) |
| **`readMastraDocs`** | Browse embedded topics in installed `@mastra/*` packages |
| **`searchMastraDocs`** | Keyword grep in embedded docs — **requires `projectPath: /home/sk/mdeai/mdeapp`** |
| **`listMastraPackages`** | See which packages ship embedded docs |

**Codex / stdio** (optional):

```bash
codex mcp add mastra-docs -- npx -y @mastra/mcp-docs-server@latest
codex mcp list
```

Use `mastra-docs` when embedded package docs are missing or sparse and you need official, current Mastra documentation. For application code that connects an agent to external MCP tools, follow the official MCP overview: [`https://mastra.ai/docs/mcp/overview#using-mcpclient-with-an-agent`](https://mastra.ai/docs/mcp/overview#using-mcpclient-with-an-agent).

Key pattern:

```ts
import { MCPClient } from '@mastra/mcp'
import { Agent } from '@mastra/core/agent'

export const docsMcpClient = new MCPClient({
  id: 'docs-mcp-client',
  servers: {
    mastraDocs: {
      command: 'npx',
      args: ['-y', '@mastra/mcp-docs-server@latest'],
    },
  },
})

export const docsAgent = new Agent({
  id: 'docs-agent',
  name: 'Docs Agent',
  instructions: 'Use the Mastra docs MCP server for current Mastra documentation.',
  model: 'openai/gpt-5.4',
  tools: await docsMcpClient.listTools(),
})
```

### References

| User Question                       | First Check                                                      | How To                                         |
| ----------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| "Where is the doc for topic X?"     | [`links.md`](links.md) and [`references/topic-routing.md`](references/topic-routing.md) | URL tables + intent → section + local refs     |
| "Create/install Mastra project"     | [`references/create-mastra.md`](references/create-mastra.md)     | Setup guide with CLI and manual steps          |
| "How do I use Agent/Workflow/Tool?" | [`references/embedded-docs.md`](references/embedded-docs.md)     | Look up in `node_modules/@mastra/*/dist/docs/` |
| **Memory (docs + reference API)** | [`references/memory.md`](references/memory.md) | Working memory, OM, threads, storage |
| **Workflows (docs + reference API)** | [`references/workflows.md`](references/workflows.md) | Suspend/resume, snapshots, Roberto HITL |
| **Streaming (docs + reference API)** | [`references/streaming.md`](references/streaming.md) | AG-UI bridge, tool-call events, `context.writer` |
| **Browser (docs + reference API)** | [`references/browser.md`](references/browser.md) | AgentBrowser, BrowserViewer, Stagehand — Phase 2 / EVP |
| **Examples v0 + guides (Supatabs)** | [`references/examples-v0.md`](references/examples-v0.md) | WM schema, calling agents, WhatsApp, Inngest |
| "How do I use MCPClient or MCPServer?" | [`links.md`](links.md#mcp-workspaces) and [`references/mcp-docs-lookup.md`](references/mcp-docs-lookup.md) | Official MCP docs + Cursor **`mastraDocs`** / **`readMastraDocs`** |
| "How do I use X?" (no packages)     | [`references/remote-docs.md`](references/remote-docs.md)         | Fetch from `https://mastra.ai/llms.txt`        |
| "I'm getting an error..."           | [`references/common-errors.md`](references/common-errors.md)     | Common errors and solutions                    |
| "Upgrade from v0.x to v1.x"         | [`references/migration-guide.md`](references/migration-guide.md) | Version upgrade workflows                      |
| **mdeAI concierge agent / SSE transport / ai_runs / deploy** | [`references/mdeai-concierge.md`](references/mdeai-concierge.md) | Production patterns for `my-mastra-app/` |
| **mdeapp CopilotKit + Mastra (Pattern 1 in-process)** | [`../copilotkit-integrations/references/integrations/mastra.md`](../copilotkit-integrations/references/integrations/mastra.md) | `getLocalAgents`, `/api/copilotkit` — **not** `registerCopilotKit` :4111 |
| **CopilotKit v2 UI (display/headless/slots)** | [`references/display-only.md`](references/display-only.md) etc. | **Defer** — mdeapp = CK **1.55.2 v1** only |
| **Mastra + CopilotKit separate server** | [`references/copilotkit.md`](references/copilotkit.md) | Not mdeapp default |
| **Tools / MCP overview** | [`references/tools.md`](references/tools.md), [`references/mcp.md`](references/mcp.md) | Verify via embedded-docs |
| **CopilotKit + Mastra audit** | [`../../../plan/audit/05-copilotkit-mastra-setup-checklist.md`](../../../plan/audit/05-copilotkit-mastra-setup-checklist.md) | Verified 2026-05-20 |

### Scripts

- `scripts/provider-registry.mjs`: Look up current providers and models available in the model router. Always run this before using a model to verify provider keys and model names.

## Priority order for writing code

⚠️ Never write code without checking current docs first.

1. **Embedded docs first** (if packages installed)

   Look up current docs in `node_modules` for a package. Example of looking up "Agent" docs in `@mastra/core`:

   ```bash
   grep -r "Agent" node_modules/@mastra/core/dist/docs/references
   ```

   - **Why:** Matches your EXACT installed version
   - **Most reliable source of truth**
   - **More information:** [`references/embedded-docs.md`](references/embedded-docs.md)

2. **Source code second** (if packages installed)

   If you can't find what you need in the embedded docs, look directly at the source code. This is more time consuming but can provide insights into implementation details.

   ```bash
   # Check what's available
   cat node_modules/@mastra/core/dist/docs/assets/SOURCE_MAP.json | grep '"Agent"'

   # Read the actual type definition
   cat node_modules/@mastra/core/dist/[path-from-source-map]
   ```

   - **Why:** Ultimate source of truth if docs are missing or unclear
   - **Use when:** Embedded docs don't cover your question
   - **More information:** [`references/embedded-docs.md`](references/embedded-docs.md)

3. **Remote docs third** (if packages not installed)

   You can fetch the latest docs from the Mastra website:

   ```bash
   https://mastra.ai/llms.txt
   ```

   - **Why:** Latest published docs (may be ahead of installed version)
   - **Use when:** Packages not installed or exploring new features
   - **More information:** [`references/remote-docs.md`](references/remote-docs.md)

## Core concepts

### Agents vs workflows

**Agent**: Autonomous, makes decisions, uses tools
Use for: Open-ended tasks (support, research, analysis)

**Workflow**: Structured sequence of steps — see [`references/workflows.md`](references/workflows.md) for suspend/resume (Roberto HITL W3+)

### Key components

- **Tools**: Extend agent capabilities (APIs, databases, external services)
- **Memory**: Message history, working memory, observational memory, semantic recall — see [`references/memory.md`](references/memory.md)
- **RAG**: Query external knowledge (vector stores, graph relationships)
- **Storage**: Persist data (Postgres, LibSQL, MongoDB)

### Mastra Studio

Studio provides an interactive UI for building, testing, and managing agents, workflows, and tools. It helps with debugging and improving your applications iteratively.

Inside a Mastra project, run:

```bash
npm run dev
```

Then open `http://localhost:4111` in your browser to access Mastra Studio.

## Critical requirements

### TypeScript config

Mastra requires **ES2022 modules**. CommonJS will fail.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler"
  }
}
```

### Model format

Always use `"provider/model-name"` when defining models using Mastra's model router.

Use the provider registry script to look up available providers and models:

```bash
# List all available providers
node scripts/provider-registry.mjs --list

# List all models for a specific provider (sorted newest first)
node scripts/provider-registry.mjs --provider openai
node scripts/provider-registry.mjs --provider anthropic
```

When the user asks to use a model or provider, **always run the script first** to verify the provider key and model name are valid. Do not guess model names from memory as they change frequently.

Example model strings:

- `"openai/gpt-5.4"`
- `"anthropic/claude-sonnet-4-5"`
- `"google/gemini-2.5-pro"`

## When you see errors

**Type errors often mean your knowledge is outdated.**

**Common signs of outdated knowledge:**

- `Property X does not exist on type Y`
- `Cannot find module`
- `Type mismatch` errors
- Constructor parameter errors

**What to do:**

1. Check [`references/common-errors.md`](references/common-errors.md)
2. Verify current API in embedded docs
3. Don't assume the error is a user mistake - it might be your outdated knowledge

## Development workflow

**Always verify before writing code:**

1. **Check packages installed**

   ```bash
   ls node_modules/@mastra/
   ```

2. **Look up current API**
   - If installed → Use embedded docs [`references/embedded-docs.md`](references/embedded-docs.md)
   - If not → Use remote docs [`references/remote-docs.md`](references/remote-docs.md)

3. **Write code based on current docs**

4. **Test in Studio**
   ```bash
   npm run dev  # http://localhost:4111
   ```

## Resources

- **Reference index** (frontmatter on every file): [`references/README.md`](references/README.md)
- **Doc URLs + sections**: [`links.md`](links.md)
- **Topic routing** (intent → `links.md` + local refs): [`references/topic-routing.md`](references/topic-routing.md)
- **Setup**: [`references/create-mastra.md`](references/create-mastra.md)
- **Embedded docs lookup**: [`references/embedded-docs.md`](references/embedded-docs.md) - Start here if packages are installed
- **Remote docs lookup**: [`references/remote-docs.md`](references/remote-docs.md)
- **Common errors**: [`references/common-errors.md`](references/common-errors.md)
- **Migrations**: [`references/migration-guide.md`](references/migration-guide.md)
