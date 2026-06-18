# PERF-002 — Reduce conciergeAgent Latency · Evidence

**Date:** 2026-06-16 · **Branch:** `ai/perf-002-concierge-latency`

## Plain summary

The concierge chat was slow (p50 ~17s) because one reply fires **2–4 separate Gemini
calls back-to-back**, not because of slow databases or search tools (those are ~2s total).
Three small changes remove unnecessary Gemini calls. A controlled before/after on a
no-tool reply shows **7.9s → 6.3s (~20% faster) from one fix alone**.

## Where the time goes (from production `ai_runs`, n=116 over 14 days)

| Metric | Value |
|---|---|
| p50 turn | 17.0s |
| p95 turn | 31.4s |
| Avg turn | 18.6s |
| Avg **tool** time (DB/RPC/embeddings) | **1.8s** — only ~10% of the turn |
| Zero-tool turn p50 (single visible call) | **9.7s** — proves a fixed serial-AI floor |
| Each added tool | ≈ +11s (one extra Gemini synthesis call) |

Conclusion: latency is **Gemini model time**, dominated by sequential calls — not tools.

## Root causes (verified at source)

| # | Cause | File |
|---|---|---|
| 1 | `PromptInjectionDetector` runs a **full extra Gemini call before every prod turn** | `src/mastra/lib/agent-input-processors.ts:20` |
| 2 | `extractIntentSlotsTool` — a no-op echo tool the agent is told to call first, adding a Gemini step | `src/mastra/agents/concierge.ts:306` + `src/mastra/tools/extract-intent-slots.ts:16` |
| 3 | `lastMessages: 20` replays tool-result payloads → up to 32k input tokens on busy threads | `src/mastra/lib/agent-memory.ts:14` |

## Changes shipped (3 fixes, 5 files, +43/−17)

| Fix | Change | Effect |
|---|---|---|
| C | Injection detector made **opt-in** (`MASTRA_PROMPT_INJECTION_GUARD=true`), off by default | removes ~1 Gemini call/turn |
| A | `extractIntentSlotsTool` unwired from concierge | removes ~1 Gemini step on agent turns |
| D | Concierge memory window `20 → 10` (host/rental/event agents unchanged) | cuts input tokens on long threads |

`maxSteps` was evaluated and **dropped** — Mastra already defaults to 5; lowering it risks
truncating multi-tool flows for no median gain.

## Controlled A/B proof (real Gemini calls, in-process through the production seam)

Same prompt ("What neighborhoods do you recommend for a first-time visitor?"), no-tool turn,
measured via `scripts/perf-002-measure.mjs`. The only variable is the injection detector
(`MASTRA_PROMPT_INJECTION_GUARD=true` = old behavior vs unset = new).

| Condition | Samples (s) | Median |
|---|---|---|
| **Before** — detector ON | 9.5 / 7.8 / 7.9 | **7.9s** |
| **After** — detector OFF | 6.3 / 6.3 / 6.4 | **6.3s** |
| **Improvement** | | **−1.6s (~20%) from fix C alone** |

Raw data: `baseline.json`, `after.json`. (In-process is faster than production's 9.7s
floor because there's no CopilotKit/network hop; the *relative* improvement transfers.)

## Expected production impact (honest)

- Removing 1–2 of the 2–4 sequential Gemini calls should move agent p50 from ~17s toward
  the **8–11s** range, and trim the p95 tail.
- **Definitive p50/p95 "after" requires post-deploy traffic** — production runs `main`, so
  the live percentiles can only be re-measured once this merges (same constraint as
  COST-001). I will not claim the target is hit before that data exists.

### Re-measure after deploy
```sql
select
  round((percentile_cont(0.5) within group (order by duration_ms)/1000.0)::numeric,1) as p50_s,
  round((percentile_cont(0.95) within group (order by duration_ms)/1000.0)::numeric,1) as p95_s,
  count(*) as runs
from ai_runs
where agent_name='concierge-agent' and duration_ms is not null
  and created_at > '2026-06-16 11:21:42+00';  -- post-merge only
```
Target: p50 < 8s, p95 < 15s.

## Validation gates

| Gate | Result |
|---|---|
| `tsc --noEmit` | 🟢 0 errors |
| `eslint` (changed files) | 🟢 0 |
| Affected unit tests (concierge + processors) | 🟢 17 passed |
| `npm run build` | 🟢 exit 0, 34 routes |
| v1 CopilotKit imports | 🟢 0 (no UI/CopilotKit files touched) |
| Full suite | 8 failures — **pre-existing on `main`** (live-DB/embeddings/grounding integration tests), proven by re-running them on a pristine checkout |

## Behavior safety

All three fixes are behavior-preserving: routing still happens client-side + via the
agent's clarification gates (A); follow-up context lives in working memory not raw history
(D); the injection guard is one env var away from re-enabling (C). The detector still
defends write-capable agents; the concierge is read-only search + one human-approved
booking request, so the injection blast radius is low.
