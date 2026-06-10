---
task_id: SEARCH-002
title: Hybrid search events — tool on main; fast-path UI via #38
layer: APP
phase: intel-1b
priority: P0
status: In Progress
estimated_effort: 2h
depends_on: [DATA-042, DATA-047, SEARCH-003]
unblocks: [DATA-046]
pr_train: separate
github_pr: 38
shipped_on_main: [32, 34]
linear_issue: SAN-387
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
stable_beta: do not merge #38 during soak
not_same_as: PR-11
skills: [mastra, mde-supabase, copilotkit, testing]
related:
  - ../../intelligence/intelligence-plan.md
  - ../tasks/PR-11-unstack-20-19.md
description: Core hybrid tool path on main (#32 + #34); remaining work is concierge fast-path UI in PR #38 — not PR-11.
---

# SEARCH-002 — Hybrid event search

> **Summary:** Andrés asks *"salsa this weekend"* and sees event cards in chat. Backend hybrid search is on `main`; remaining work is merge **PR #38** fast-path UI after **SAN-462** soak 3/3.

## Scorecard

| Task | Feature | Use case | Real-world example | Score | Grade |
|------|---------|----------|-------------------|------:|-------|
| SEARCH-002 backend | `hybrid_search_events` + event_signals | Andrés finds events in chat | *"Salsa this weekend near Provenza"* → ranked Supabase events | **85%** | **B** |
| SEARCH-002 UI (#38) | Concierge fast-path event cards | Same query shows cards without slow agent loop | Cards + map pins in chat on mdeai.co | **15%** | **F** (blocked) |
| **Overall** | End-to-end event discovery | Tourist event browse in concierge | Andrés picks a salsa night from chat | **60%** | **D** |

**Blocker:** Do not merge PR #38 until SAN-462 nightly soak **3/3** (Discovery Beta rule).


| | |
|---|---|
| **For** | Andrés · Tourist (salsa, fashion, live music) |
| **On `main` today** | `intelligence-event-search.ts` + `searchEventsIntelligent` in `search-events.ts` with try/catch fallback (#32, #34) |
| **Still open** | PR **#38** — fast-path UI wiring in concierge (not #19/#20) |
| **Rule** | Supabase events first; web grounding only when thin results |

**Real-world:** Camila asks "salsa this weekend" — the backend already calls `hybrid_search_events` on `main`. #38 makes the **chat fast-path** show those cards without waiting for the full agent loop.

## What #38 adds (out of scope for PR-04…09)

1. `use-event-search-fast-path.ts` integration in concierge shell
2. Event cards + pins from fast-path (parity with rentals/restaurants)
3. Floor + e2e on preview

## Done gate

| Check | Evidence |
|-------|----------|
| Hybrid RPC | `search_logs.hybrid_used` on prod |
| Tool fallback | PR-01 verified — catch → structured search |
| Fast-path UI | #38 merged + `test:e2e:live-audit` events row |
| Not during soak | Wait for 3× nightly synthetic green |

## Verify

```bash
cd mdeapp
git show origin/main:src/mastra/lib/intelligence-event-search.ts | head -5
npm run test -- --run src/mastra/tools
# After #38: npm run test:e2e:live-audit
```

## Out of scope

- PR-11 (#19 close) — separate process task
- VEC-004 worker (deferred intelligence track)
