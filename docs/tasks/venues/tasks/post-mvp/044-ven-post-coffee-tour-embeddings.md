---
id: VEN-044
title: coffee_tour_embeddings + server embed job
status: Open
priority: P2
phase: CTI-B
effort: 4h
owner: claude
depends_on: [VEN-032, VEN-042]
blocks: [VEN-046]
skill: [mde-supabase, gemini, mde-task-lifecycle, pgvector]
mcp: [user-supabase, gemini-api-docs-mcp]
---

# VEN-044 — Embeddings pipeline

## In plain English

After Phase A ships, add **semantic search** so vague queries like *“quiet farm with cupping for beginners”* match tour descriptions — using pgvector on narrative text only, never on ratings or URLs.

## User story

**As a Tourist,** I want fuzzy wording to find the right tour vibe, **so that** I do not need exact operator names — while factual scores still come from SQL + Places.

## Real-world example

*“romantic sunset coffee experience”* ranks Café Atardecer higher than a loud group tour — because embeddings match `ai_summary` text, blended with VEN-035 factual score.

## Goals

1. `coffee_tour_embeddings` table + HNSW index.
2. Server-only embed job on profile updates.
3. Ranker blend: SQL + vector (documented weights).
4. Phase B only — **not** claimed in Phase A evidence.

## Embed text example

From roadmap: combined `ai_summary` + semantic descriptors from [`06-coffee-tours.md`](../../listings/cafes/06-coffee-tours.md).

## Do NOT embed

`place_id`, bare rating numbers, URLs.

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `coffee_tour_embeddings` vector(1536) + HNSW | Create |
| Job | `mdeapp/scripts/embed-coffee-tours.mjs` or edge fn | Create |
| Ranker | `rank-coffee-tours.ts` | Add vector blend |

## Success criteria

1. Server-only `GOOGLE_GENERATIVE_AI_API_KEY` — no client embed.
2. Re-embed on `coffee_tour_profiles` update.
3. Vitest: semantic query changes order vs SQL-only.
4. Embedding model verified via `gemini-api-docs-mcp` before migration.

## MCP

`gemini-api-docs-mcp` — embedding model ID before coding.
