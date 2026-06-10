---
title: Trips implementation tasks
date: 2026-05-26
canonical_prd: ../trips-plan.md
audit: ../docs/01-audit.md
forensic_audit: ../docs/02-audit-tasks.md
---

# Trips tasks — INDEX

**Build order:** TRIP-001 -> TRIP-012 plus hardening TRIP-013 -> TRIP-019. **Data:** [`../../data/tasks-data/`](../../data/tasks-data/) data-026–034.

| Order | ID | Title | Phase | Priority | Status |
|------:|----|-------|-------|----------|--------|
| 1 | [TRIP-001](TRIP-001-trips-supabase-audit-evidence.md) | Supabase audit + evidence | CORE | P0 | Not Started |
| 2 | [TRIP-002](TRIP-002-trips-dashboard-polish.md) | `/trips` dashboard polish | CORE | P0 | Not Started |
| 3 | [TRIP-003](TRIP-003-create-trip-modal.md) | Create trip modal | CORE | P0 | Not Started |
| 4 | [TRIP-004](TRIP-004-trip-workspace-shell.md) | Trip workspace shell | CORE | P0 | Not Started |
| 5 | [TRIP-005](TRIP-005-itinerary-tab-hardening.md) | Itinerary tab hardening | CORE | P1 | Not Started |
| 6 | [TRIP-006](TRIP-006-saved-collections-page.md) | `/saved` collections | MVP | P1 | Not Started |
| 7 | [TRIP-007](TRIP-007-add-to-trip-from-cards.md) | Add-to-trip from cards | MVP | P1 | Not Started |
| 8 | [TRIP-008](TRIP-008-trip-map-google-pins.md) | Google Map pins tab | MVP | P1 | Not Started |
| 9 | [TRIP-009](TRIP-009-conflict-persist-hitl.md) | Conflict persist + HITL | MVP | P1 | Not Started |
| 10 | [TRIP-010](TRIP-010-booking-trip-item-sync.md) | Booking → trip_items sync | MVP | P0 | Not Started |
| 11 | [TRIP-011](TRIP-011-playwright-suite.md) | Playwright suite | SHIP | P1 | Not Started |
| 12 | [TRIP-012](TRIP-012-production-smoke-floor.md) | Production smoke + floor | SHIP | P1 | Not Started |
| 13 | [TRIP-013](TRIP-013-booking-reconciliation-worker.md) | Booking reconciliation repair worker | HARDENING | P0 | Not Started |
| 14 | [TRIP-014](TRIP-014-rls-penetration-verification.md) | Trips RLS penetration verification | HARDENING | P0 | Not Started |
| 15 | [TRIP-015](TRIP-015-places-cache-hydration.md) | Places cache + itinerary hydration | HARDENING | P1 | Not Started |
| 16 | [TRIP-016](TRIP-016-mobile-workspace-hardening.md) | Mobile workspace UX hardening | HARDENING | P1 | Not Started |
| 17 | [TRIP-017](TRIP-017-observability-sync-logs.md) | Trips observability + sync logs | HARDENING | P1 | Not Started |
| 18 | [TRIP-018](TRIP-018-trip-lifecycle-states.md) | Trip lifecycle states + archival rules | HARDENING | P1 | Not Started |
| 19 | [TRIP-019](TRIP-019-retry-optimistic-ui-recovery.md) | Retry + optimistic UI recovery | HARDENING | P1 | Not Started |

## Screens

| Screen | Task |
|--------|------|
| SCREEN-012 `/trips` | TRIP-002, TRIP-003 |
| SCREEN-013 `/trips/[id]` | TRIP-004, TRIP-005, TRIP-008, TRIP-009 |
| SCREEN-011 `/saved` | TRIP-006 |
| SCREEN-008/009 checkout | TRIP-010 |
| Operational hardening | TRIP-013, TRIP-014, TRIP-015, TRIP-016, TRIP-017, TRIP-018, TRIP-019 |

## Dependency graph

```text
TRIP-001 → TRIP-002 → TRIP-003 → TRIP-004 → TRIP-005
TRIP-005 → TRIP-008, TRIP-009 (parallel)
TRIP-005 → TRIP-006 → TRIP-007 → TRIP-010 → TRIP-013
TRIP-007 → TRIP-019
TRIP-001 + TRIP-003 + TRIP-007 + TRIP-009 → TRIP-014
TRIP-008 + MAP-005 + data-007 + data-030 → TRIP-015
TRIP-004 + TRIP-008 + TRIP-009 → TRIP-016
TRIP-010 + TRIP-013 + TRIP-009 → TRIP-017
TRIP-001 + TRIP-003 + TRIP-004 → TRIP-018
TRIP-002..010 + TRIP-014 + TRIP-019 → TRIP-011
TRIP-011 + TRIP-013 + TRIP-015 + TRIP-016 + TRIP-017 + TRIP-018 → TRIP-012
data-026 (parallel TRIP-001) → data-027 → data-029 → data-028 (blocks TRIP-010)
data-026 → data-030 (golden queries)
data-021 + data-029 → data-028 showings path
MAP-008 blocks TRIP-008 · EVP-001 blocks TRIP-010 ticket path · data-021 viewing path
```

## Forensic corrections from 2026-05-28

- TRIP-008 was not missing; it existed but lacked clustering, lazy loading, mobile behavior, cache/proxy, and pin-source priority details.
- Booking reconciliation is now TRIP-013. MVP still avoids a durable queue table unless evidence proves the lightweight repair worker is insufficient.
- Lifecycle hardening is TRIP-018. The live `trips.status` constraint is `planning | active | completed | cancelled`; `draft`/`archived` are not live values.
- Agent scope stays restrained: no `timelineAgent`, `memoryAgent`, or `recommendationAgent` for MVP.
