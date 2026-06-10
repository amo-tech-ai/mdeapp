---
id: EVP-025-mvp
linear: SAN-128
legacy_id: EVT-D07
title: CopilotKit discovery UI (cards, attribution, approval)
status: Not Started
priority: P2
phase: Post-MVP
effort: 3d
depends_on: [EVP-022-mvp-event-discovery-workflow, SCREEN-006]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
plans:
  - ../../plan/events/event-discovery/10-event-discover-plan.md §4 §6
skill:
  - copilotkit
  - copilotkit-integrations
  - copilotkit-develop
---

# EVP-025-mvp — CopilotKit frontend

> **Partial today:** `search-events` cards + map pins + C-004 web citations (PR #4). This task completes **discovered** event cards + approval UX — not re-scrape in chat.

## Components

| Component | Purpose |
|-----------|---------|
| `EventDiscoveryCard` | Web-sourced event (extends EventCard) |
| `ContestDiscoveryCard` | Pageant/contest variant |
| `SourceConfidenceBadge` | Low confidence warning |
| `SaveEventApprovalPanel` | HITL save to Supabase |
| `GroundingAttribution` | Already exists — extend |

## UX

- Cards in center chat; pins in map column / mobile sheet
- Source links visible; external link icon + rel=noopener
- "Save to mdeai" → approval panel (not instant write)
- Follow-up chips: Tonight, This Weekend, Near Me

## Acceptance criteria

- [ ] Playwright: discovery card + attribution visible
- [ ] Mobile map sheet shows discovery pins
- [ ] No XSS from source URLs (sanitize)
