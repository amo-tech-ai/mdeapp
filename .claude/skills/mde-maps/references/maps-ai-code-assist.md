---
title: Google Maps AI Code Assist — MCP server + Gemini CLI
---

# Google Maps AI Code Assist

Official docs hub: https://developers.google.com/maps/ai/code-assist  

Authoritative pages used by this repo:

- **Gemini CLI registration:** https://developers.google.com/maps/ai/code-assist/gemini-cli  
- **HTTP MCP reference (`tools/list`, tools table):** https://developers.google.com/maps/ai/code-assist/reference/mcp  
- **`retrieve-instructions` (schema):** https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-instructions  
- **`retrieve-google-maps-platform-docs` (schema):** https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-google-maps-platform-docs  

MCP endpoint (hosted): `https://mapscodeassist.googleapis.com/mcp`
Status: **Pre-GA / experimental** — no usage charges as of 2026-05.

> **Not to be confused with Maps Grounding Lite** (`https://mapstools.googleapis.com/mcp`), which provides live `search_places` / `lookup_weather` / `compute_routes` tools backed by real Maps data and requires an API key. This file covers the *documentation RAG* server only.

---

## What it is

An MCP (Model Context Protocol) server that grounds LLM responses in **official, up-to-date Google Maps Platform docs**. When you ask Maps coding questions, the server retrieves current doc snippets, code samples, and API references rather than relying on potentially-outdated LLM training data.

Sources searched:
- Maps Platform official documentation
- Code samples + architecture guides
- Client library source (GitHub)
- Trust center + Terms of Service

---

## Setup — Gemini CLI

Documented by Google: [Configure Maps Code Assist with Gemini CLI](https://developers.google.com/maps/ai/code-assist/gemini-cli).

```bash
gemini mcp add -s user -t http maps-code-assist-mcp https://mapscodeassist.googleapis.com/mcp
```

Verify registration:

```
/mcp list
```

You should see **`maps-code-assist-mcp`** (or your chosen name) **Ready** with tools **`retrieve-google-maps-platform-docs`** and **`retrieve-instructions`** — matching the [MCP reference overview](https://developers.google.com/maps/ai/code-assist/reference/mcp).

**HTTP validation (any client):** use `tools/list` JSON-RPC as shown in Google’s MCP reference page against `https://mapscodeassist.googleapis.com/mcp`.

---

## Setup — Cursor (this workspace)

The repo root **`/.mcp.json`** registers **`google-maps-code-assist`** as HTTP MCP with the **same URL** as Gemini CLI’s `-t http` flow, plus a **`documentation`** link to the official MCP reference:

```json
"google-maps-code-assist": {
  "type": "http",
  "url": "https://mapscodeassist.googleapis.com/mcp"
}
```

Quick reference: **`.cursor/MCP-GOOGLE-MAPS.md`** · Cursor rule: **`.cursor/rules/mdeai-google-maps.mdc`**.

**Do not** use npm `@googlemaps/code-assist-mcp` (deprecated 2026-07-01 per `github/maps/platform-ai/README.md`).

---

## Setup — Claude Code

Add to `~/.claude/settings.json` under `mcpServers`:

```json
{
  "mcpServers": {
    "google-maps-code-assist": {
      "type": "http",
      "url": "https://mapscodeassist.googleapis.com/mcp",
      "documentation": "https://developers.google.com/maps/ai/code-assist/reference/mcp"
    }
  }
}
```

---

## Two tools

### `retrieve-instructions` — call first

Official reference: [retrieve-instructions](https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-instructions).

Must be called **before any Maps-related query** to prime the system. Tells the LLM how to use the docs system correctly.

```json
Input:  { "name": "instructions" }
Output: { "name": string, "systemInstructions": [string] }
```

Read-only, idempotent.

### `retrieve-google-maps-platform-docs` — the main RAG tool

Official reference: [retrieve-google-maps-platform-docs](https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-google-maps-platform-docs).

Retrieves relevant doc snippets for a natural language query.

```json
{
  "llmQuery": "How do I use field masks with Places API New?",
  "filter": "Places API",      // optional — scope to specific API
  "source": "mdeai-app"        // optional — analytics tag, max 64 ASCII chars
}
```

Output — list of `Context` objects:
```json
[
  {
    "text": "...doc snippet...",
    "score": 0.92,
    "documentationUri": "https://developers.google.com/maps/...",
    "apiState": "ga"  // "ga" | "preview" | "alpha" | "beta" | "deprecated"
  }
]
```

`apiState` is important: **never implement `deprecated` or `alpha` features** in production without checking for a current alternative.

---

## Usage patterns for mdeAI development

### Before writing a Places API enrichment script

```
retrieve-instructions
retrieve-google-maps-platform-docs("Places API New text search field masks", filter: "Places API")
```

### Before implementing Gemini Maps grounding

```
retrieve-instructions
retrieve-google-maps-platform-docs("Gemini Maps grounding sequential calls structured output", filter: "Maps Grounding")
```

### Before touching Routes API edge function

```
retrieve-instructions
retrieve-google-maps-platform-docs("Routes API waypoints transit mode", filter: "Routes API")
```

### Check if a feature is still GA

Always check the `apiState` field on returned docs. If a feature you're using returns `deprecated`, find the replacement before shipping.

---

## Build with AI — https://developers.google.com/maps/ai/build-with-ai

Google's AI-assisted Maps development guide covers:
- Using AI tools (Gemini, Claude, Copilot) to generate Maps code
- The MCP server pattern above
- How to verify AI-generated Maps code against current docs
- Prompt templates for common Maps tasks

Key principle from the guide: **always ground AI Maps suggestions in the docs**. Maps APIs change frequently; ungrounded AI code often targets deprecated endpoints or uses wrong field names.

---

## Terms of Service compliance when using MCP

The LLM processing MCP responses must comply with Google Maps Platform ToS:
- **No caching of place data** beyond session (unless explicitly permitted per API)
- **No model training** on returned Maps data
- **Attribution required** where specified (e.g. "Google Maps" text for grounded results)

For mdeAI specifically: `generativeSummary` text stored in the DB is explicitly permitted to cache, as it's returned by the Places API with cache semantics. Grounding citations must be attributed on display (see `maps-grounding.md`).

---

## Local clone

The source repo is cloned at **`/home/sk/mdeai/github/maps/platform-ai/`** (not a separate `github/platform-ai` root). It includes:
- `packages/code-assist/` — MCP server source, schema definitions
- `GEMINI.md` — instructions for using the Gemini CLI extension  
- `gemini-extension.json` — extension manifest for `gemini extensions install`

Useful to browse when `retrieve-google-maps-platform-docs` returns a result and you want to see how the server itself processes the query, or when checking what doc sources are indexed.

---

## When to use this vs internal docs

| Question | Use |
|----------|-----|
| "What's the current field name for X?" | MCP → `retrieve-google-maps-platform-docs` |
| "How do I implement X in mdeAI?" | `mde-maps` skill (this skill) |
| "What's the current pricing for Y?" | Check live pricing page — MCP docs may be cached |
| "Is this API still GA?" | MCP → check `apiState` on returned context |
| "How does the sequential grounding pattern work?" | `references/maps-grounding.md` |
