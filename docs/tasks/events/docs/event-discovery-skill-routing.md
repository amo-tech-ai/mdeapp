---
title: Event discovery — plan ↔ task ↔ skill routing
updated: 2026-05-27
plans:
  - ../../../plan/events/event-discovery/10-event-discover-plan.md
  - ../../../plan/events/event-discovery/11-openclaw-event-discovery.md
parent_pack: ../EVP-018-mvp-event-web-discovery-task-pack.md
personas: Camila (read) · Patricia (approve + ops) · Sofía (ship)
---

# Event discovery — execution map

> **Truth:** Supabase `events` (approved rows) · **Orchestration:** Mastra workflows · **UI:** CopilotKit · **Geo:** Places API (batch) + Maps JS pins · **Ops:** OpenClaw + ClawEvents (P2) · **Gemini:** summaries only

## When to load which skill

| Work | Skill(s) | MCP (verify before code) |
|------|----------|---------------------------|
| Schema, RLS, cron, ingest API | `mde-supabase`, `pgvector` (later) | Supabase MCP |
| `scrapeEventsWorkflow`, dedupe, tools | `mastra`, `mde-firecrawl` | Mastra docs MCP |
| Event cards, citations, fast path | `copilotkit`, `copilotkit-integrations` | CopilotKit MCP |
| Venue `place_id`, field masks, pins | `mde-maps` | Maps Code Assist MCP |
| `ai_summary`, no invent | `gemini` | `gemini-api-docs-mcp` |
| ADK sidecar, web freshness | `google-agents-cli-adk-code`, `mde-maps` § grounding | ADK :8000 smoke |
| VPS cron, ClawEvents, WhatsApp ops | `open-claw`, `mde-hostinger` | — |
| Task spec / Done gates | `mde-task-lifecycle`, `task-verifier` | — |
| Flip task status | `mde-task-lifecycle` Phase 5 only | localhost proof required |

## Plan → EVP task map (do not duplicate specs)

| Plan ID (10 / 11) | EVP task | Tier |
|-------------------|----------|------|
| EVD-01 Schema | [EVP-020-mvp](EVP-020-mvp-discovered-events-data-model.md) | mvp |
| EVD-02 Seed sources | EVP-020 (seed) + [EVP-007-core](../EVP-007-core-event-agent-prompt-and-sources.md) | mvp / core |
| EVD-03 Eventbrite / RA / medellin.travel | [EVP-022-mvp](EVP-022-mvp-event-discovery-workflow.md) + `mde-firecrawl` | mvp |
| EVD-04–05 Normalize + dedupe | EVP-022 | mvp |
| EVD-06 Places enrich | [EVP-024-mvp](EVP-024-mvp-places-enrichment.md) + [EVP-016-mvp](EVP-016-mvp-event-maps-venue-integration.md) | mvp |
| EVD-07 Approval UI | [EVP-026-mvp](EVP-026-mvp-human-approval-save-flow.md) | mvp |
| EVD-08 Daily cron | EVP-022 + Supabase `pg_cron` | mvp |
| EVD-09 Wire search | [EVP-005-core](../EVP-005-core-event-tool-and-workflow.md) (exists) + [EVP-015-mvp](EVP-015-mvp-grounded-event-discovery.md) | core / mvp |
| EVD-10 Tests | [EVP-027-mvp](EVP-027-mvp-discovery-test-plan.md) | mvp |
| EVD-11 AI summary | EVP-022 step + `gemini` | mvp |
| EVD-12 Metrics | EVP-020 (`event_scrape_jobs` / `event_runs`) | mvp |
| EVD-A3 OpenClaw worker | [EVP-031-advanced](EVP-031-advanced-openclaw-automation-plan.md) + [OCL-042](../../openclaw/tasks/OCL-042-mvp-clawevents-medellin-automation.md) | advanced |
| OC-EVD-01..10 | OCL-042 | openclaw/mvp |
| CLAW-01..06 | OCL-042 + fork [ClawEvents](https://github.com/yhyatt/ClawEvents) | openclaw/mvp |

## Build order (authoritative)

```text
1. EVP-013-core green (event cards E2E) — blocker
2. EVP-020 → EVP-022 → EVP-024 → EVP-026
3. EVP-025 + EVP-015 (UI + citations; partial shipped PR #4)
4. EVP-027 → EVP-028
5. OCL-042 / EVP-031 (OpenClaw — not Camila MVP gate)
6. pgvector (EVP pack advanced / EVD-A1) after SQL search boring
```

## Hard rules (all skills)

1. No invented events — `source_url` required on discovered rows  
2. No OpenClaw `is_active=true` — Patricia approval only  
3. No service-role in `mdeapp/src/**` — ingest via Edge + scoped JWT  
4. Every Places call: `X-Goog-FieldMask` (`mde-maps`)  
5. Gemini summarizes approved rows — not scrape inventory  
6. CopilotKit **1.55.2** only until Phase 2 v2 migration  

## Core vs mvp vs advanced (tasks folders)

| Folder | Discovery work |
|--------|----------------|
| `tasks/events/` EVP **core** 005–007, 013 | search-events, clarify, sources (prompt-only scrape URLs) |
| `tasks/events/` EVP **mvp** 015–028 | ingest pack (EVP-018 children) |
| `tasks/openclaw/` OCL-042 | automation worker |
| `tasks/maps/` MAP-* | Places enrich, pins (EVP-016, EVP-024) |
| `tasks/grounding-search/` | ADK + web grounding (EVP-021, 023) |
| `tasks/mastra/` | workflow patterns |
