---
task_id: AI-003
title: Signal enrichment batch job
layer: APP
phase: intel-1b
priority: P0
status: Not Started
estimated_effort: 6h
depends_on: [DATA-041, DATA-042, DATA-043, VEC-004]
unblocks: [DATA-046]
blocks: []
skills: [mastra, gemini, mde-supabase]
related:
  - ../../intelligence/intelligence-plan.md
  - DATA-041-venue-signals.md
description: Batch enrich venue/event/rental_signals via Gemini structured output (flash-lite); Mastra scheduled job or edge worker — not inline in chat path.
---

# AI-003 — Signal enrichment batch

## At a glance

| | |
|---|---|
| **For** | Patricia (ops) · Sofia |
| **Why now** | Scale signals beyond seed 30/49/44 with provenance |
| **Rule** | Batch only — never block chat latency |

## What we're building

1. Enrichment prompt + Zod schema per signal table (restaurant, event, rental)
2. Worker reads `embedding_jobs` or dedicated queue → writes signals with `source`, `model_version`, `confidence`, `evidence`
3. `signal_generation_logs` row per batch (DATA-047 migration family)
4. Human QA sample gate before promoting batch

## Model

- **Production AI:** `gemini-3.1-flash-lite` structured output (verify via gemini MCP)
- Not inline in conciergeAgent turn

## Done gate

| Check | Evidence |
|-------|----------|
| Batch job idempotent | re-run safe |
| Provenance columns filled | MCP sample rows |
| No chat latency regression | p95 search unchanged |
| RLS | service_role write only |

## Out of scope

- Real-time per-query signal generation
- LLM-as-ranker in search path

## Verify

```bash
# After worker lands — batch dry-run + MCP row audit
```
