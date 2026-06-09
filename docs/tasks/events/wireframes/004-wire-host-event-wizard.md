---
type: wireframe
id: WIRE-022
number: "004"
title: Host Event Wizard
persona: Roberto
path: /host/event/new
priority: P0
build_status: Done
feature_group: "004"
paired_scr: 004-scr-host-event-wizard.md
related_wires:
  - 003-wire-event-detail-page.md
related_specs:
  - 003-events-README.md
screens:
  - 004-scr-host-event-wizard.md
screen_ids:
  - SCREEN-016
skill:
  - mde-wireframe
---
# Wireframe: Host Event Wizard

> **Events group 003.1 (host):** [003-events-README.md](003-events-README.md) · Build spec: [003.1-scr-host-event-wizard.md](004-scr-host-event-wizard.md) (SCREEN-016) · Buyer view after publish: [003-wire-event-detail-page.md](003-wire-event-detail-page.md)

**Source:** mdeai PRD W3–W4 · legacy roadmap (not built in old mde)  
**Persona:** Roberto · **Path:** `/host/event/new` · **Auth:** required · **P0**

> Primary Phase 1 revenue path alongside Camila rentals.

## CopilotKit example paths

| Example | Bound spec |
|---------|------------|
| `CopilotKit/examples/v1/form-filling/` | [EVP-010-core](../../archive/events-A/EVP-010-core-host-event-wizard.md) |
| `CopilotKit/examples/canvas/mastra-pm/` | [EVP-008-core](../../archive/events-A/EVP-008-core-event-draft-state-types.md), [EVP-009-core](../../archive/events-A/EVP-009-core-host-event-agent.md) |
| `CopilotKit/examples/showcases/banking/` | [EVP-011-core](../../archive/events-A/EVP-011-core-approval-panel-hitl.md) |
| `CopilotKit/examples/integrations/mastra/` | [F01](../../archive/core/F01-bootstrap-mdeapp.md) runtime canon |

## Layout — center chat + preview (not 3-panel map)

```text
┌────────────┬──────────────────────────────────────────────────────┐
│ Host nav   │ Create event — Roberto                               │
│ · Events   │ ┌─ Workflow strip ─────────────────────────────────┐ │
│ · New*     │ │ Basics ✓ → Venue ✓ → Tickets ● → Preview ○       │ │
│ · Analytics│ └──────────────────────────────────────────────────┘ │
│            │ CopilotChat — hostEventAgent                         │
│            │ ROBERTO: "Startup mixer March 15, 200 cap, Provenza"│
│            │ ASSIST: Set basics tool → form fields update live    │
│            │ ┌─ Live preview card ──────────────────────────────┐ │
│            │ │ Startup Mixer · Mar 15 · Provenza · 200 cap      │ │
│            │ │ [Edit] [Add tier] [Preview & publish]            │ │
│            │ └────────────────────────────────────────────────┘ │
│            │ [Ask anything…]                                      │
└────────────┴──────────────────────────────────────────────────────┘
```

## HITL publish step (renderAndWaitForResponse)

```text
┌─ Ready to publish? ───────────────────────────────────── [×] ─┐
│ Preview: hero, date, venue pin, ticket tiers                │
│ ☐ I confirm pricing and capacity are correct                │
│ [Publish event]  [Save draft]  [Cancel]                     │
└─────────────────────────────────────────────────────────────┘
```

## Tools (Mastra)

| Tool | UI mirror |
|------|-----------|
| `set_event_basics` | Title, description, category |
| `set_venue` | Places search + map pin |
| `add_ticket_tier` | Tier name, price, qty |
| `preview_and_publish` | HITL card above |

## Post-publish

→ `/host/events` list · event live at `/events/:slug` ([003-wire-event-detail-page](003-wire-event-detail-page.md)) · Stripe products wired

## Mobile

Single column; preview card below chat; map pin in preview only

## Data

`events`, `event_tickets`, `event_venues`, `approval_*` if moderation enabled
