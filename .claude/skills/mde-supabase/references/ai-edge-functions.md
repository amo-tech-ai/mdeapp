---
parent: mde-supabase
title: AI Edge Functions Inventory
description: Production Gemini edge functions (ai-router, ai-chat, ai-search, rentals, …), models, and auth secrets. Load when wiring or auditing AI HTTP handlers.
load_when: edge function AI, GEMINI_API_KEY, ai_runs logging, Gemini model names
verified_at: 2026-05-17
---

<!-- Keep in sync with references/edge-functions-inventory.md and supabase/functions/ -->

# AI integration — production edge functions

All AI runs on **Google Gemini** via the OpenAI-compatible endpoint
`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
(or native `generateContent` / `embedContent` where noted in code).

There is **no Anthropic / Claude API in production** — Claude is only used in dev tooling (Claude Code).

## Shipped in this repo (8 Gemini handlers)

| Edge function | Model | Purpose |
|---|---|---|
| `ai-router` | `gemini-3.1-flash-lite-preview` | Intent classification |
| `ai-chat` | `gemini-3-flash-preview` | Conversational AI + tool-calling |
| `ai-search` | `gemini-embedding-001`, `gemini-2.0-flash-lite` | Semantic search (pgvector) + light rerank |
| `ai-trip-planner` | `gemini-3.1-pro-preview` | Multi-day itinerary generation |
| `ai-optimize-route` | `gemini-3-flash-preview` | Route optimization |
| `rentals` | `gemini-3.1-pro-preview` | Rental intake conversation |
| `ai-embed` | `gemini-embedding-001` | Listing/event/restaurant embeddings |
| `sponsor-roi-explain` | `gemini-3-flash-preview` | Sponsor ROI narrative (`sponsor` schema) |

**Non-LLM in repo:** `ai-suggest-collections` uses heuristics only (no `GEMINI_API_KEY`).

## Phase 3 (not in repo yet)

| Planned name | Model (target) | Purpose |
|---|---|---|
| `ai-creative-gen` | `gemini-3.1-pro-preview` | Ad copy / image prompts |
| `ai-audience-match` | `gemini-3.1-pro-preview` | Brand ↔ contest fit scoring |

Do not reference these as deployed until `supabase/functions/<name>/` exists.

**Auth:** `GEMINI_API_KEY` secret in Supabase dashboard (synced from Infisical — see [`mde-infisical/references/env-vars-mdeai.md`](../../mde-infisical/references/env-vars-mdeai.md)).

**Full matrix** (tickets, webhooks, `verify_jwt`): [edge-functions-inventory.md](edge-functions-inventory.md).

Operational rules: [`.claude/rules/edge-function-patterns.md`](../../../rules/edge-function-patterns.md) — CORS, JWT, Zod input validation, rate limits (10 AI / 30 search per min per user), 30 s Gemini timeout, log every run to `ai_runs`.
