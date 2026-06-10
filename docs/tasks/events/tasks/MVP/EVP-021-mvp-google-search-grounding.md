---
id: EVP-021-mvp
linear: SAN-124
legacy_id: EVT-D05
title: Google Search Grounding query templates
status: Not Started
priority: P2
phase: Post-MVP
effort: 2d
depends_on: [EVP-023-mvp-adk-search-maps-agents, EVP-007-core-event-agent-prompt-and-sources, MAP-002D, GS-001]
related:
  - ../grounding-search/tasks/INDEX.md
  - ../maps/MAP-002D-search-grounding-enable.md
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
playbook_ref:
  guide: ../grounding-search/docs/00-playbook-guide.md
  primary: ../grounding-search/docs/02-playbook.md
  sections: [IPL freshness example, web_search_queries, grounding_chunks]
---

# EVP-021-mvp — Google Search Grounding

> **Before coding:** [00-playbook-guide.md](../grounding-search/docs/00-playbook-guide.md) · Use [02-playbook.md](../grounding-search/docs/02-playbook.md) IPL fixture to validate template → grounded response shape; ship via **MAP-002D** + **GS-001–004**.

## Query templates

- "Medellín events tonight"
- "Medellín concerts this weekend"
- "Laureles events tonight"
- "El Poblado nightlife events"
- "football Medellín schedule"
- "food festival Medellín"
- "Medellín contests pageants"

## Policy

| Rule | Value |
|------|-------|
| Source allowlist | From EVP-007-core registry tiers 1–2 |
| Blocklist | User-generated spam domains |
| Freshness window | 30 days default |
| Language | EN queries Phase 2; ES Phase 3 |
| Fallback | Supabase-only + explain limitation |

## Cookbook references

| Doc | Use for EVP-021-mvp |
|-----|-----------------|
| [00-playbook-guide.md](../grounding-search/docs/00-playbook-guide.md) | Template → sidecar → citations workflow |
| [02-playbook.md](../grounding-search/docs/02-playbook.md) | Replace cookbook city names with Medellín templates above; same metadata contract |
| [MAP-002D](../maps/MAP-002D-search-grounding-enable.md) | Implementation parent |

## Acceptance criteria

- [ ] Template → grounding call mapping tested
- [ ] Citations surface in `GroundingAttribution` component
- [ ] Confidence score attached to each result
