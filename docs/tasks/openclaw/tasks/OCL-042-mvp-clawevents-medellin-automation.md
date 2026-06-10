---
id: OCL-042-mvp
title: ClawEvents + OpenClaw — Medellín event ingest worker
status: Not Started
priority: P2
phase: Post-MVP — after EVP-020..026
effort: 3–5d
depends_on:
  - EVP-020-mvp-discovered-events-data-model
  - EVP-022-mvp-event-discovery-workflow
parent_plan: ../../../plan/events/event-discovery/11-openclaw-event-discovery.md
master_plan: ../../../plan/events/event-discovery/10-event-discover-plan.md
skill:
  - open-claw
  - mde-hostinger
  - mde-supabase
  - mastra
  - mde-firecrawl
rule: Worker writes raw_events only; never sets is_active; allowlist ClawHub skills
---

# OCL-042-mvp — ClawEvents + OpenClaw Medellín automation

> Implements [11-openclaw-event-discovery.md](../../../plan/events/event-discovery/11-openclaw-event-discovery.md) and plan §17 OC-EVD / CLAW tasks. **Not** Camila’s chat runtime.

## Goal

Patricia gets **06:00 Bogotá** ingest, failure alerts, and manual “run scraper now” — without OpenClaw touching Stripe or live `events.is_active`.

## References

| Resource | URL / path |
|----------|------------|
| ClawEvents | https://github.com/yhyatt/ClawEvents |
| ClawHub skill | https://clawhub.ai/yhyatt/clawevents |
| Apify plugin | https://github.com/apify/apify-openclaw-plugin |
| Execution map | [event-discovery-skill-routing.md](../../events/docs/event-discovery-skill-routing.md) |
| EVP-031 | [EVP-031-advanced-openclaw-automation-plan.md](../../events/EVP-031-advanced-openclaw-automation-plan.md) |

## Subtasks

| ID | Task | Priority |
|----|------|----------|
| OC-EVD-01 | Sandbox OpenClaw gateway on Hostinger VPS | P0 |
| OC-EVD-02 | Install Apify OpenClaw plugin (optional) | P1 |
| OC-EVD-03 | Allowlist skills — pin `clawevents` only | P0 |
| OC-EVD-04 | `POST /api/internal/ingest/raw_events` + scoped JWT | P0 |
| OC-EVD-05 | Daily ingest cron → Mastra `eventDiscoveryWorkflow` | P0 |
| OC-EVD-06 | Failure alert → Patricia (WhatsApp/Telegram) | P1 |
| OC-EVD-07 | Manual “run scraper now” operator command | P1 |
| OC-EVD-08 | Source freshness report | P1 |
| OC-EVD-09 | Ticket URL verifier (browser skill) | P1 |
| OC-EVD-10 | Audit log every worker action | P0 |
| CLAW-01 | Fork ClawEvents — `medellin` in `city_registry` | P2 |
| CLAW-02 | `MedellinTravelFetcher` + Tuboleta fetcher | P2 |
| CLAW-03 | `clawevents search --format json` → ingest API | P2 |

## Acceptance criteria

- [ ] ClawHub `clawevents` SKILL.md audited; version pinned in allowlist
- [ ] Ingest API accepts JSON batch; rows land in `raw_events` with `source_id`
- [ ] OpenClaw cannot call Stripe or set `is_active=true`
- [ ] 3 consecutive daily runs logged in `event_scrape_jobs` with ≥1 source success
- [ ] Patricia receives failure notification when RA.co job fails
- [ ] `npm run floor` green on any mdeapp route touched by OC-EVD-04

## Verification

```bash
# After fork:
python3 -m clawevents search --city medellin --days 7 --format json --limit 10
# Ingest smoke (scoped token):
curl -X POST http://localhost:3001/api/internal/ingest/raw_events -H "Authorization: Bearer $MDE_INGEST_TOKEN" ...
```
