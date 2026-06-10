---
task_id: data-017
mvp_step: 17
title: Discovered events pipeline schema — web ingest + approval queue
layer: DATA
priority: P2
phase: Post-MVP
status: Not Started
estimated_effort: 8h
depends_on: ["data-012", "data-016"]
blocks_evidence_for:
  - ../../events/tasks/EVP-020-mvp-discovered-events-data-model.md
  - ../../events/tasks/EVP-022-mvp-event-discovery-workflow.md
  - ../../events/tasks/EVP-026-mvp-human-approval-save-flow.md
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../../plan/events/event-discovery/10-event-discover-plan.md
description: MVP-min discovered-events tables per EVP-020; no auto-publish to events without approval.
---

# DATA-017 — discovered events pipeline schema

## At a glance

| | |
|---|---|
| **For** | Patricia (approve) · Tourist (fresh discovery) |
| **Surface** | Admin review queue · chat discovery |
| **Layer** | DATA · Post-MVP Phase 2 |

## Scope

Implement **canonical names** from EVP-020 / plan §7 (not full 132-table scope):

| Table | Purpose |
|---|---|
| `event_sources` | Allowlisted domains (Eventbrite, RA, …) |
| `raw_events` | Normalized candidate + `external_id` + `source_id` |
| `event_source_snapshots` | Raw JSON per fetch |
| `event_scrape_jobs` | Job status per source |
| `event_runs` | Pipeline audit (alias: `event_discovery_runs`) |
| `event_dedupe_matches` | Duplicate clusters |

**Extend `events`:** `discovery_status`, `source_url`, `last_scraped_at` (if not present after inventory).

**Reuse:** `approval_requests` or dedicated `event_approval_queue` — pick one in data-012 evidence; do not duplicate both.

## Rules (events-prd / roadmap)

- DB-first for published mdeai events
- Web candidates → review queue only
- No anon INSERT to `events` from scrape pipeline (service_role + approval commit)

## Acceptance criteria

- [ ] Migrations + RLS on every new table
- [ ] Unique `(source_id, external_id)` on `raw_events`
- [ ] ERD mermaid in evidence
- [ ] EVP-020 marked unblocked for app/workflow tasks
- [ ] **Do not apply to prod** until EVP-026 HITL path exists

## Out of scope

- OpenClaw browser automation (EVP-030)
- Auto-publish without human approval
