---
title: Maps tasks — INDEX
updated: 2026-05-27
canonical_prd: ../../plan/ADK/maps-adk-prd.md
maps_features_prd: ../../plan/maps/maps-prd.md
maps_audit: ./docs/maps-audit-2.md
numbering: ./NUMBERING.md
parent_index: ../INDEX.md
audit: ../audit/22-task-order-audit.md
---

# Maps — `tasks/maps/`

> **Done MVP platform specs** → [`../archive/maps-A/`](../archive/maps-A/README.md) (23 files).  
> **Active specs** stay in this folder root.  
> CopilotKit layout/cards: **F48 / F49 / F50 / F50b** in [`../archive/copilot-A/`](../archive/copilot-A/README.md).

| Doc | Purpose |
|-----|---------|
| [`../archive/maps-A/README.md`](../archive/maps-A/README.md) | **Done** MAP platform block |
| [`NUMBERING.md`](./NUMBERING.md) | ID rules, archive vs active paths |
| [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) | G1–G8 + Playwright X1–X5 |
| [`notes-2.md`](./notes-2.md) | Status + next order |

Evidence: `tasks/notes/MAP-###-evidence.md`

---

## Completion snapshot (2026-05-27)

| Tier | Complete? |
|------|:---------:|
| **MVP platform (archived)** | **Yes** — [`../archive/maps-A/`](../archive/maps-A/README.md) |
| **MAP-001–012 literal spine** | **No** — 005, 006, 010, 011, 012 open |
| **P0 prod hardening** | **MAP-002B**, **MAP-008B** (new) |
| **Next P1** | **MAP-005** → 006 → 012A → 012 → 010 → **011A** → 011 → 023 |
| **Data (maps)** | **data-034** geo inventory · **data-033** route_cache · **data-007** after MAP-005 |
| **Doc** | [MAP-DOC-001](./MAP-DOC-001-refresh-maps-prd-repo-truth.md) ✅ |
| **Post-MVP UX** | [MAP-034](./MAP-034-advanced-marker-ux-polish.md) |

---

## P0 production hardening (parallel — do first)

| ID | Spec | Status | Depends on |
|----|------|--------|------------|
| **MAP-002B** | [prod ADK Cloud Run](./MAP-002B-prod-adk-deploy.md) | Not started | MAP-002 ✅ |
| **MAP-008B** | [Vercel Map ID verify](./MAP-008B-vercel-map-id-verify.md) | Not started | MAP-008 ✅ |

---

## Active implementation order

| Step | ID | Spec | Status | Depends on |
|-----:|----|------|--------|------------|
| 1 | **MAP-005** | [places-proxy + cache](./MAP-005-places-proxy-cache.md) | Not started | MAP-004 ✅ |
| 2 | **MAP-006** | [nearby search](./MAP-006-nearby-search.md) | Not started | MAP-005, F46 ✅ |
| 3 | **MAP-012A** | [CO spike](./MAP-012A-colombia-aggregate-insights-spike.md) | Not started | MAP-004 ✅ |
| 4 | **MAP-012** | [neighborhood intel](./MAP-012-neighborhood-intelligence.md) | Not started | MAP-006, MAP-012A |
| 5 | **MAP-010** | [venue autocomplete](./MAP-010-place-autocomplete-venue.md) | Not started | MAP-005, F34 |
| 6 | **data-033** | [route_cache](../../data/tasks-data/data-033-route-cache-schema.md) | Not started | [data-034 archive](../../data/archive/data-034-maps-geo-inventory.md) |
| 7 | **MAP-011A** | [compute_routes sidecar](./MAP-011A-adk-compute-routes.md) | Not started | MAP-002B ✅, MAP-002 ✅, data-033 |
| 8 | **MAP-011** | [routes](./MAP-011-route-previews.md) | Not started | MAP-011A, MAP-004 ✅, data-033 |
| 9 | **MAP-023** | [Static Maps OG](./MAP-023-static-maps-event-previews.md) | Not started | MAP-004 ✅ |
| — | **MAP-002A** | [ADK package](./MAP-002A-ADK-agent-package.md) | Not started | MAP-002 ✅ |
| — | **MAP-034** | [marker UX polish](./MAP-034-advanced-marker-ux-polish.md) | Not started | MAP-008/009/030 ✅ |
| — | **MAP-DOC-001** | [refresh maps-prd](./MAP-DOC-001-refresh-maps-prd-repo-truth.md) | Done | — |

**Post-MVP chain:** MAP-002B + MAP-008B → MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011A → MAP-011 → MAP-023.

---

## Shipped platform (archived)

Full table: [`../archive/maps-A/README.md`](../archive/maps-A/README.md). Includes MAP-001–004, 007B, 008, 009, 013–019, 018B–F, 030, 031, 002D/E + F48/F49/F50/F50b in `archive/core/`.

---

## Active spec files (root)

| ID | File | Notes |
|----|------|-------|
| MAP-002B | [MAP-002B-prod-adk-deploy.md](./MAP-002B-prod-adk-deploy.md) | P0 prod ADK |
| MAP-008B | [MAP-008B-vercel-map-id-verify.md](./MAP-008B-vercel-map-id-verify.md) | P0 Map ID |
| MAP-005 | [MAP-005-places-proxy-cache.md](./MAP-005-places-proxy-cache.md) | |
| MAP-006 | [MAP-006-nearby-search.md](./MAP-006-nearby-search.md) | |
| MAP-010 | [MAP-010-place-autocomplete-venue.md](./MAP-010-place-autocomplete-venue.md) | |
| MAP-011A | [MAP-011A-adk-compute-routes.md](./MAP-011A-adk-compute-routes.md) | Sidecar routes |
| MAP-011 | [MAP-011-route-previews.md](./MAP-011-route-previews.md) | |
| MAP-012 | [MAP-012-neighborhood-intelligence.md](./MAP-012-neighborhood-intelligence.md) |
| MAP-012A | [MAP-012A-colombia-aggregate-insights-spike.md](./MAP-012A-colombia-aggregate-insights-spike.md) |
| MAP-023 | [MAP-023-static-maps-event-previews.md](./MAP-023-static-maps-event-previews.md) |
| MAP-002A | [MAP-002A-ADK-agent-package.md](./MAP-002A-ADK-agent-package.md) |
| MAP-034 | [MAP-034-advanced-marker-ux-polish.md](./MAP-034-advanced-marker-ux-polish.md) |
| MAP-DOC-001 | [MAP-DOC-001-refresh-maps-prd-repo-truth.md](./MAP-DOC-001-refresh-maps-prd-repo-truth.md) |

---

## Related

| ID | Folder |
|----|--------|
| F48, F49, F50, F50b | [`../archive/copilot-A/`](../archive/copilot-A/README.md) ✅ |
| F33–F38 | [`../events/`](../events/INDEX.md) |
| F41, F46, F47 | [`../real-estate/`](../real-estate/INDEX.md) |
