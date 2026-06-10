---
title: Real estate implementation tasks
date: 2026-05-26
canonical_prd: ../real-estate-prd.md
canonical_roadmap: ../real-estate-roadmap.md
archived_done: ../../archive/real-estate-A/README.md
---

# Real estate tasks — INDEX

**Build order:** RE-001 → RE-020. **Intelligence gap (2026-05-28):** RE-017 → RE-018 before MVP exit polish. **Archived Done:** F17, F46, F47. **Data:** data-019–025.

| Order | ID | Title | Phase | Priority | Status |
|------:|----|-------|-------|----------|--------|
| **17** | **[RE-017](RE-017-rental-parser-intelligence.md)** | **Parser dates/city/confidence** | **CORE** | **P0** | **Not Started** |
| **18** | **[RE-018](RE-018-gemini-rental-clarify-routing.md)** | **Gemini clarify routing** | **CORE** | **P0** | **Not Started** |
| **19** | **[RE-019](RE-019-rental-availability-search.md)** | **Availability date filters** | **MVP** | **P1** | **Not Started** |
| **20** | **[RE-020](RE-020-rental-preference-memory.md)** | **pgvector preferences** | **POST-MVP** | **P2** | **Not Started** |
| 1 | [RE-001](RE-001-supabase-schema-audit.md) | Supabase schema audit | CORE | P0 | Not Started |
| 2 | [RE-002](RE-002-apartment-inventory-quality.md) | Inventory quality | CORE | P1 | Not Started |
| 3 | [RE-003](RE-003-rental-search-indexes.md) | Search indexes | CORE | P0 | Not Started |
| 4 | [RE-004](RE-004-rental-cards-chat.md) | Rental cards (SCREEN-005) | CORE | P0 | In Progress |
| 5 | [RE-005](RE-005-map-pin-sync.md) | Map pin sync | CORE | P1 | Not Started |
| 6 | [RE-006](RE-006-schedule-viewing-modal.md) | Schedule viewing (SCREEN-008) | CORE | P0 | In Progress |
| 7 | [RE-007](RE-007-lead-capture-edge-proof.md) | Lead edge proof (G2) | CORE | P0 | Not Started |
| 8 | [RE-008](RE-008-landlord-inbox-mvp.md) | Landlord inbox | MVP | P1 | Not Started |
| 9 | [RE-009](RE-009-showing-bridge.md) | Showing bridge | MVP | P1 | Not Started |
| 10 | [RE-010](RE-010-saved-trips-integration.md) | Saved + trips | MVP | P1 | Not Started |
| 11 | [RE-011](RE-011-rental-browse-page.md) | `/rentals` browse | POST-MVP | P2 | Not Started |
| 12 | [RE-012](RE-012-rental-detail-page.md) | `/rentals/[id]` | POST-MVP | P2 | Not Started |
| 13 | [RE-013](RE-013-application-wizard.md) | Application wizard | POST-MVP | P2 | Not Started |
| 14 | [RE-014](RE-014-booking-payment-prep.md) | Booking/Stripe prep | POST-MVP | P2 | Not Started |
| 15 | [RE-015](RE-015-playwright-rls-tests.md) | Playwright + RLS | SHIP | P1 | Not Started |
| 16 | [RE-016](RE-016-production-smoke.md) | Production smoke | SHIP | P1 | Not Started |

## Screens

| Screen | Task |
|--------|------|
| SCREEN-005 `/` cards | RE-004, RE-005, **RE-017, RE-018** |
| SCREEN-008 viewing modal | RE-006, RE-007 |
| SCREEN-011 `/saved` | RE-010 + TRIP-006 |
| F41 `/rentals` | RE-011 (POST-MVP) |

## Data dependencies

[data-019](../../data/archive/data-019-rentals-data-inventory.md) · [data-020](../../data/archive/data-020-leads-rental-fk-columns.md) · [data-021](../../data/archive/data-021-showings-lead-bridge.md) · [data-009 M3](../../data/archive/data-009-schema-migrations-m1-m3.md)
