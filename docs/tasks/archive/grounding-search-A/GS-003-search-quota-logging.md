---
id: GS-003
title: Search grounding — quota + logging
status: Done
priority: P0
phase: Phase 2 — with MAP-002D
effort: 2h
owner: claude
depends_on: [MAP-002]
blocks: [MAP-002D]
parent_track: grounding-search
skill: [mde-supabase, mastra]
maps_to_external: CORE-GEMINI-001 (04-grounding.md)
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  sections: [web_search_queries count per prompt]
---

# GS-003 — Search quota + logging

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · Note in [02-playbook.md](../docs/02-playbook.md) one IPL prompt triggers **multiple** `web_search_queries` — log `len(web_search_queries)` per invoke for Patricia billing.

## At a glance

**Patricia** needs a **separate quota bucket** from Grounding Lite MCP. Gemini 3+ bills **per search query** inside one invoke ([pricing](https://ai.google.dev/gemini-api/docs/google-search)).

## Policy

| Rule | Implementation |
|------|----------------|
| Increment on successful SearchAgent invoke | Before or after ADK HTTP — match MAP-002 `grounding-quota.ts` pattern |
| Log `webSearchQueries.length` | ADK structured log + Mastra `recordMastraRun` |
| Flag off | No increment; `search_disabled` |
| Daily cap | Env `SEARCH_GROUNDING_DAILY_CAP` (Patricia sets in Vercel + Cloud Run) |

## Deliverables

| Item | Change |
|------|--------|
| Extend `grounding_quota_log` **or** migration `search_grounding_quota_log` | RLS + service write |
| `mdeapp/src/mastra/lib/search-grounding-quota.ts` | `incrementAndCheckSearchGroundingQuota()` |
| `services/adk-grounding/README.md` | Log fields: `tool`, `webSearchQueries`, `citation_count`, `source` |
| Runbook note in **MAP-002E** or GS evidence | Console vs Supabase row reconciliation |

## Env (server only)

| Var | Where |
|-----|-------|
| `ENABLE_SEARCH_GROUNDING` | Cloud Run + Mastra |
| `SEARCH_GROUNDING_DAILY_CAP` | Mastra / edge policy |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Cloud Run (existing) |

## Acceptance criteria

1. Quota blocks invoke when cap exceeded (fail-closed empty + reason).
2. Successful invoke with 3 `webSearchQueries` → one quota row + log count 3.
3. Patricia evidence: redacted SQL count vs Gemini console (±1 day).

## Cookbook references

| Playbook | Use for GS-003 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | Lines printing `Search Query: [...]` — expect 2–3 queries per grounded turn |
| [03-grounding-summary.md](../docs/03-grounding-summary.md) | §14 billing — Gemini 3 per-query pricing |
| [Google Search grounding — Pricing](https://ai.google.dev/gemini-api/docs/google-search) | Official billing rules |

## Definition of Done

Evidence: `tasks/notes/GS-003-evidence.md`.
