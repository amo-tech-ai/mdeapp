---
id: AIE-015-mvp
title: Recommendations hub /recommendations
status: Not Started
priority: P1
phase: mvp
persona: camila
linear: —
percent: 0
blocked_by: [AIE-014]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/035-recommendations-hub.md, 028-ai-recommendations.md
evp: EVP-042-mvp-smart-recommendations-compatibility
---

# AIE-015-mvp — Recommendations hub

## Objective

Standalone `/recommendations` — events, venues, restaurants, cafés from history + saves + location. Complements 028 overlay on `/`.

## Engines

| Type | Source |
|------|--------|
| Event → event | `hybrid_search_events` + saves |
| Event → venue | Places + capacity |
| Night out | grounded places |

## Acceptance criteria

- Route in sitemap MVP
- `useAgentContext` user context
- ≥1 card per vertical in browser smoke
