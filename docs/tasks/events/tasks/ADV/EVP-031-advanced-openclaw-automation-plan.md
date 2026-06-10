---
id: EVP-031-advanced
linear: SAN-134
legacy_id: EVT-D08
title: OpenClaw automation plan (no implementation)
status: Not Started
priority: P3
phase: Phase 3
effort: 1d
depends_on: [EVP-025-mvp-copilotkit-discovery-ui]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
---

# EVP-031-advanced — OpenClaw future automation (plan only)

## Allowed later

- Daily source URL health checks
- Organizer contact discovery drafts
- Screenshot evidence for approval queue
- WhatsApp outreach **drafts** (human send)

## Forbidden

- Auto-publish events
- Auto-buy tickets
- Stripe / payment mutation
- Direct Supabase writes without approval row

## Deliverable

**Canonical plan (done):** [11-openclaw-event-discovery.md](../../plan/events/event-discovery/11-openclaw-event-discovery.md)  
**Implementation task:** [OCL-042-mvp](../../openclaw/tasks/OCL-042-mvp-clawevents-medellin-automation.md)  
**References:** [ClawEvents](https://github.com/yhyatt/ClawEvents) · [ClawHub clawevents](https://clawhub.ai/yhyatt/clawevents)

## Acceptance criteria

- [x] Plan doc exists (11-openclaw) with OC-EVD + CLAW task table
- [ ] OCL-042 not started until EVP-020 + EVP-022 land
- [ ] Security review checklist in 11-openclaw §13 applied before VPS install
- [ ] Zero OpenClaw auto-publish to `events.is_active`
