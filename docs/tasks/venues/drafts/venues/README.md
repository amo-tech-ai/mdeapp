# Venue management — documentation hub

**Last updated:** 2026-05-17

Venue capabilities sit on the **Events + Tickets** pillar — not a separate product. This folder is the **strategy + architecture** layer; execution queues are split intentionally.

## Start here

| Doc | Audience | Purpose |
|-----|----------|---------|
| [**venue-management-prd-v1.md**](./venue-management-prd-v1.md) | PM, eng | Product requirements, layer cake, MVP scope |
| [**venue-feature-matrix.md**](./venue-feature-matrix.md) | PM | MVP vs core vs enterprise vs AI |
| [**venue-roadmap.md**](./venue-roadmap.md) | Eng | Phased delivery tied to EVT + archive tasks |
| [**venue-workflows.md**](./venue-workflows.md) | Ops, eng | Day-to-day operational workflows |
| [**venue-agents-architecture.md**](./venue-agents-architecture.md) | AI eng | Mastra agents, tools, memory, gates |
| [**venue-maps-integration.md**](./venue-maps-integration.md) | Maps eng | Places API (New), Grounding, EVT-039–044 |
| [**venue-ai-opportunities.md**](./venue-ai-opportunities.md) | AI, ops | AI use cases (propose-only) |
| [**venue-automation-strategy.md**](./venue-automation-strategy.md) | Ops | OpenClaw, WhatsApp, reminders |
| [**venue-use-cases.md**](./venue-use-cases.md) | All | Vertical scenarios (pageant, concert, …) |

## Execution queues (do not merge)

| Work | Canonical path | IDs |
|------|----------------|-----|
| **Venue picker + maps (ship now)** | [`../V2-tasks/advanced/`](../V2-tasks/advanced/) | **EVT-039–044** |
| **Full venue OS (later)** | [`../../archive/035-venue-picker-in-wizard.md`](../../archive/035-venue-picker-in-wizard.md) … `044` | Archive **035–044** |
| **Tickets / scan at venue** | [`../V2-tasks/`](../V2-tasks/) + [`../events-progress.md`](../events-progress.md) | EVT core/mvp |

**Schema today:** `public.event_venues` + `events.venue_id` ([`20260503011925_event_phase1.sql`](../../../supabase/migrations/20260503011925_event_phase1.sql)).

## Related platform docs

- [`../docs/events-prd.md`](../docs/events-prd.md) — Events pillar journeys
- [`../events-prd-v2-mastra-maps-automation.md`](../events-prd-v2-mastra-maps-automation.md) — Layer cake
- [`../../mastra/maps-prd-v2.md`](../../mastra/maps-prd-v2.md) — Places (New)
- [`../contests/openclaw-contests.md`](../contests/openclaw-contests.md) — OpenClaw execution
- [`../../../prd.md`](../../../prd.md) — Master PRD

## Industry research (2026-05-17)

Synthesized from VenuePro, iVvy, Momentus, Cvent, Zoho Backstage, Artifax, Eventtia, Rookoo, Tagvenue, and venue-ops guides — see PRD §16 Sources.
