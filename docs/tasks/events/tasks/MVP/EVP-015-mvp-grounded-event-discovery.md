---
id: EVP-015-mvp
linear: SAN-119
legacy_id: EVT-MVP-02
title: Grounded event discovery
status: Not Started
priority: P1
persona: Camila, Tourist, Patricia
depends_on:
  - EVP-001-core
  - EVP-005-core
  - EVP-013-core
  - GS-001
  - GS-003
related:
  - /home/sk/mdeai/tasks/grounding-search/tasks/INDEX.md
  - /home/sk/mdeai/tasks/events/EVP-021-mvp-google-search-grounding.md
---

# EVP-015-mvp — Grounded event discovery

## Objective

Make event discovery DB-first and freshness-aware. Published mdeai events come from Supabase. Web grounding is used only when the user asks for current/fresh events or when the event is not in the catalog.

## Workflow

```mermaid
flowchart TD
  A["User asks for events"] --> B["Search Supabase events"]
  B --> C{"Enough trusted results?"}
  C -- "Yes" --> D["Render EventCards + map pins"]
  C -- "No / freshness requested" --> E["Run Search grounding with allowlist"]
  E --> F["Parse citations + quota log"]
  F --> G["Render cited discovered results"]
  G --> H{"Save candidate?"}
  H -- "Human approves" --> I["Write review/approved event record"]
  H -- "No" --> J["No DB mutation"]
```

## Files/modules

- `src/mastra/tools/search-events.ts`
- `src/mastra/tools/search-web-grounded-events.ts`
- `src/app/api/grounding/event-web/route.ts`
- `src/components/copilot/event-card.tsx`
- `src/components/copilot/event-web-citation-*`
- `src/mastra/lib/search-grounding-*`

## Acceptance criteria

- Known events are returned from Supabase without web search.
- Fresh queries can call grounding and display citations.
- Grounding quota is logged.
- Web-discovered events are labeled as discovered/unverified until approved.
- No web result automatically becomes a published event.
- Tests cover DB-only, grounded, no-result, and quota-blocked cases.
