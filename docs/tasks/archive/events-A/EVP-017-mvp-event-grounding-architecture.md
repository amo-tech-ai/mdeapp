---
id: EVP-017-mvp
legacy_id: F41
title: Event web discovery — architecture & phase placement
status: Done
priority: P2
phase: Planning only — post-MVP
effort: 2–3h (doc + diagram)
depends_on:
  - EVP-007-core
source_notes: ./docs/F-39-prompt-search.md
skill:
  - plan-analysis
  - mermaid-diagrams
  - gemini
deliverables:
  - tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md
  - plan/events/event-grounding-architecture.md
---

# EVP-017-mvp — Event web discovery architecture & phase placement

## Purpose

Turn [`F-39-prompt-search.md`](./docs/F-39-prompt-search.md) into an **approved architecture doc** and ordered build sequence — without implementing code.

**Core rule (non-negotiable):**

> Supabase owns truth. Web search **discovers**; human approval **writes**.

## User story

As **Sofía**, I need a phased plan so we don't bolt Google Search Grounding onto MVP and violate source-of-truth rules.

## Recommended build order (from source doc)

| Phase | Layer | Ship when |
|------:|-------|-----------|
| 1 | Supabase `search-events` + cards + pins | ✅ MVP (EVP-005-core, SCREEN-006) |
| 2 | Places venue enrichment on event rows | MAP + EVP-007-core |
| 3 | EVP-006-core clarify gate + category chips | W6 polish |
| 4 | Google Search Grounding via ADK | EVP-018-mvp EVP-023-mvp–D06 |
| 5 | Contest discovery + dedupe tables | EVP-018-mvp EVP-020-mvp–D03 |
| 6 | OpenClaw verification/outreach | EVP-018-mvp EVP-031-advanced (gated) |

## Architecture diagram (deliver in `plan/events/event-grounding-architecture.md`)

```mermaid
flowchart TD
  User[Camila: events tonight] --> CK[CopilotKit UI]
  CK --> M[Mastra conciergeAgent]
  M --> DB[Supabase search-events]
  M --> ADK[ADK sidecar Phase 4+]
  ADK --> Search[Google Search Grounding]
  ADK --> Maps[Maps Grounding Lite]
  M --> Places[Places API enrichment]
  DB --> Norm[Normalize + dedupe]
  Search --> Norm
  Places --> Norm
  Norm --> Cards[EventCard + attribution]
  Norm --> Pins[MapContext pins]
  Norm --> Queue[event_approval_queue Phase 4+]
  Queue --> Admin[Patricia approves]
  Admin --> DB
```

## Stack table (verified against CLAUDE.md)

| Layer | Role | Phase 1 |
|-------|------|---------|
| CopilotKit 1.55.2 | Chat UI, cards, HITL | ✅ |
| Mastra | Router + workflows | ✅ |
| Supabase | Source of truth | ✅ |
| Gemini 3.5 Flash | Agent model | ✅ |
| Google Search Grounding | Fresh web discovery | ❌ post-MVP |
| Maps Grounding Lite | Venue facts | partial |
| Places API New | place_id, photos | partial |
| ADK :8000 | Google tool orchestration | dev only |
| OpenClaw | Automation | ❌ never MVP |
| Stripe | Tickets only | ✅ |

## Acceptance criteria

- [ ] `plan/events/event-grounding-architecture.md` exists with diagram + phase table
- [ ] Explicit "MVP vs post-MVP" boundary documented
- [ ] Links to official docs (Gemini grounding, ADK, CopilotKit Mastra integration)
- [ ] EVP-018-mvp task pack referenced as implementation backlog
- [ ] No code changes in mdeapp/src

## Evidence

- [ ] `tasks/notes/EVP-017-mvp-evidence.md` — doc path + PRD cross-link

## Do not do

- No implementation
- No OpenClaw wiring
- No new tables without EVP-018-mvp EVP-020-mvp spec
