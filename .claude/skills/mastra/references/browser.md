---
title: Mastra browser — docs + reference
description: Load for AgentBrowser, BrowserViewer, or Stagehand automation. Phase 2+ for mdeapp product.
parent: mastra
impact: HIGH
impactDescription: Doc URLs and reference API for AgentBrowser, BrowserViewer, Stagehand
tags: mastra, browser, playwright, cdp, workspace
---

# Mastra browser — docs & reference index

**mdeai Phase 1:** production concierge does **not** assign a Mastra `browser` to `conciergeAgent`. Web extraction for events uses **Firecrawl** (`mde-firecrawl` skill) and Places API — not `@mastra/agent-browser`. Bookmark this index for **EVP event-ingest** experiments, Studio screencast demos, or Phase 2 workspace agents. **Do not** add browser packages to `mdeapp/` unless a task explicitly scopes it (Vercel serverless + screencast WS constraints).

**Lookup order:** [`mcp-docs-lookup.md`](mcp-docs-lookup.md) → **`mastraDocs`** paths below → [`links.md`](../links.md).

---

## Concepts (docs — Supatabs)

| Topic | URL | When to use |
| --- | --- | --- |
| **Overview** | https://mastra.ai/docs/browser/overview | Choose provider; assign `browser` to `Agent`; screencast + CDP |
| **AgentBrowser** | https://mastra.ai/docs/browser/agent-browser | Playwright + accessibility refs (`@e1`); general automation |
| **BrowserViewer** | https://mastra.ai/docs/browser/browser-viewer | CLI tools (`browser-use`, `agent-browser`) via **workspace** + CDP inject |
| Stagehand *(related)* | https://mastra.ai/docs/browser/stagehand | Browserbase + natural-language selectors |

**Workflow progress in browser runs:** step `writer` + [workflow streaming](https://mastra.ai/docs/streaming/workflow-streaming) — see [`streaming.md`](streaming.md).

---

## Provider pick

| Provider | Package | Best for | Agent wiring |
| --- | --- | --- | --- |
| **AgentBrowser** | `@mastra/agent-browser` | Playwright, a11y refs, screenshots | `Agent({ browser })` |
| **Stagehand** | `@mastra/stagehand` | NL actions, Browserbase cloud | `Agent({ browser })` |
| **BrowserViewer** | `@mastra/browser-viewer` | Shell CLIs in workspace | `Workspace({ browser: new BrowserViewer({ cli }) })` |

### AgentBrowser quick pattern

```typescript
import { AgentBrowser } from '@mastra/agent-browser'

export const browser = new AgentBrowser({
  headless: true,
  // cdpUrl: process.env.BROWSER_CDP_URL, // remote CDP — no local Chromium
})
```

Agent flow: `browser_snapshot` → interact via refs → re-snapshot. Missing Chromium: `npx playwright install chromium`.

### BrowserViewer quick pattern

Requires [workspace](https://mastra.ai/docs/workspace/overview) + installed CLI + [workspace skill](https://mastra.ai/docs/workspace/skills):

```typescript
import { BrowserViewer } from '@mastra/browser-viewer'

const workspace = new Workspace({
  sandbox: new LocalSandbox({ workingDirectory: './workspace' }),
  browser: new BrowserViewer({ cli: 'browser-use', headless: false }),
})
```

Supported CLIs: `agent-browser` (`--cdp`), `browser-use` (`--cdp-url`), `browse-cli` (`--ws`).

---

## Reference API (`reference/browser/`)

Index via MCP: `mastraDocs` path `reference/browser/`

| API | URL | Maps to doc |
| --- | --- | --- |
| **MastraBrowser** (base) | https://mastra.ai/reference/browser/mastra-browser | [overview](https://mastra.ai/docs/browser/overview) |
| **AgentBrowser** | https://mastra.ai/reference/browser/agent-browser | [agent-browser](https://mastra.ai/docs/browser/agent-browser) |
| **BrowserViewer** | https://mastra.ai/reference/browser/browser-viewer | [browser-viewer](https://mastra.ai/docs/browser/browser-viewer) |
| **StagehandBrowser** | https://mastra.ai/reference/browser/stagehand-browser | [stagehand](https://mastra.ai/docs/browser/stagehand) |

---

## Screencast (Studio)

Live browser feed in Mastra Studio requires `ws` + `@hono/node-ws` — **not** compatible with Cloudflare Workers / typical Vercel edge. If packages absent, screencast disables silently; other browser tools still work.

```typescript
const browser = new AgentBrowser({
  screencast: { enabled: true, format: 'jpeg', quality: 80, maxWidth: 1280, maxHeight: 720 },
})
```

---

## MCP fetch examples

```json
{
  "paths": [
    "docs/browser/overview",
    "docs/browser/agent-browser",
    "docs/browser/browser-viewer",
    "reference/browser/agent-browser",
    "reference/browser/browser-viewer",
    "reference/browser/mastra-browser"
  ]
}
```

---

## mdeai pointers

| Need | Use instead (Phase 1) |
| --- | --- |
| Scrape listing pages | `mde-firecrawl` / Firecrawl tool guide |
| E2E UI verification | `playwright-cli` skill · `tasks/testing/` |
| Places / maps enrichment | `mde-maps` |
| Event ingest DAG | [`workflows.md`](workflows.md) · EVP-022 (batch, not live browser) |

| Artifact | Path |
| --- | --- |
| Mastra agents (no browser today) | `mdeapp/src/mastra/agents/` |
| Workspace docs | [`workspace.md`](workspace.md) |
