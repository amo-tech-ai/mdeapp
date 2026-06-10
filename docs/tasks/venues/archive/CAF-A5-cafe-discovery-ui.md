---
task_id: CAF-A5
title: Café discovery UI (Phase A + A.5)
layer: UI
status: Archived
archived: 2026-06-02
was_status: Done
shipped: true
production: https://www.mdeai.co/chat
priority: P0
completed: 2026-05-27
screen: SCREEN-021
feature_group: "005"
skills: [copilotkit-develop, mde-maps, mastra, shadcn]
wireframes:
  - 005-wire-cafe-listings-map-booking.md
screens:
  - 005-scr-cafe-listings-map-booking.md
evidence: ../../../tasks/evidence/SCREEN-021-evidence.md
playwright: ../../../../mdeapp/e2e/screens/SCREEN-021-cafe-listings.spec.ts
description: Shipped ranked café cards, right-column CafeDetailPanel, map pin sync, booking stub.
---

# CAF-A5 — Café discovery UI (shipped)

## Delivered

| Surface | Component / path |
|---------|------------------|
| Cards | `CafeResultCard` + `search-tool-renders.tsx` |
| Detail | `CafeDetailPanel` — tabs, ask prompts, sibling rail |
| Enrichment | `/api/places/detail` + field mask |
| Map | F50 pin sync; right column map ↔ detail toggle |
| Booking | `CafeBookingSheet` stub (no DB) |
| Agent | `conciergeAgent` + `search-grounded-places` `intent:cafe` |

## Wireframe + scr

- [005-wire-cafe-listings-map-booking.md](005-wire-cafe-listings-map-booking.md)
- [005-scr-cafe-listings-map-booking.md](005-scr-cafe-listings-map-booking.md)

## Open (not CAF-A5)

| Phase | Task |
|-------|------|
| B | VEC-004/005 vector rerank |
| C | CAF-008 schema + CKV-006 booking persist |

## Done gate

- [x] Playwright `SCREEN-021-cafe-listings.spec.ts`
- [x] Evidence [`SCREEN-021-evidence.md`](../../../evidence/SCREEN-021-evidence.md)
- [x] `npm run floor` exit 0
