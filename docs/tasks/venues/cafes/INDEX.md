---
title: Cafés — task + wireframe hub
status: Active
updated: 2026-05-27
parent: ../INDEX.md
screen: SCREEN-021
feature_group: "005"
---

# Cafés — tasks + wireframes

**Canonical scr/wire** live in [`../tasks/mvp/wireframes/`](../tasks/mvp/wireframes/) (groups **005–008**). This folder is the café-vertical nav hub.

**Verify pairing:** `node scripts/verify-scr-wire-pairing.mjs` (includes `tasks/venues/tasks/mvp/wireframes/`)

---

## Screen + wireframe (SCREEN-021)

| Doc | Path | Status |
|-----|------|--------|
| **scr** (build spec) | [005-scr-cafe-listings-map-booking.md](../archive/005-scr-cafe-listings-map-booking.md) | ✅ **Archived** — live on Vercel |
| **wire** (ASCII + Mindtrip) | [005-wire-cafe-listings-map-booking.md](../archive/005-wire-cafe-listings-map-booking.md) | ✅ **Archived** |
| Places hub | [005-008-places-README.md](../tasks/mvp/wireframes/005-008-places-README.md) | groups 005–008 |

**Also mirrored at:**

- [`tasks/screens/SCREEN-021-cafe-listings-map-booking.md`](../../screens/SCREEN-021-cafe-listings-map-booking.md)
- [`tasks/wireframes/26-cafe-listings-map-booking.md`](../../wireframes/26-cafe-listings-map-booking.md)

---

## Café tasks (implementation)

| ID | Title | Status | Spec |
|----|-------|--------|------|
| **CAF-005** (alias **CAF-A5**) | Discovery UI (SCREEN-021) | **Archived** (shipped) | [CAF-A5-cafe-discovery-ui.md](../archive/CAF-A5-cafe-discovery-ui.md) |
| **DATA-003** | Curated café anchor seed | Not Started | [data-003-cafe-seed](../../../data/tasks-data/data-003-cafe-seed.md) |
| **DATA-006** | Golden eval queries (incl. café) | Not Started | [data-006-golden-queries](../../../data/tasks-data/data-006-golden-queries.md) |
| **DATA-007** | `place_details_cache` audit | Not Started | [data-007-cache-audit](../../../data/tasks-data/data-007-cache-audit.md) |
| **VEN-012** | Café vs nightlife kind split | Not Started | [007b-ven-grounded-kind-split](007b-ven-grounded-kind-split.md) |
| **VEN-031+** | Booking schema → tools → WA | Not Started | [mvp-index](../tasks/mvp/mvp-index.md) steps 14–22 |
| **INT-008** | Café chat intelligence (Gemini clarify) | Not Started | [INT-008](../../intelligence/tasks/INT-008-cafe-intelligence-wrapper.md) — after INT-001 + VEN-012 |
| **VEN-032…051** | Coffee **tours** (not café search) | Separate | [mvp-index](../tasks/mvp/mvp-index.md#phase-7--coffee-tours-32-43-optional) |
| ~~**CAFE-001**~~ | Cafe-only schema | Archived | → **DATA-009** + **VEN-015** · [`../archive/CAFE-001-booking-requests-schema.md`](../archive/CAFE-001-booking-requests-schema.md) |

**Naming:** Prefer **DATA-00N** for data tasks, **VEN-00N** for venue build, **INT-00N** for shared chat intelligence. `CAF-*` = café-hub aliases only.

**CopilotKit / UI wiring:** [13-copilotkit](../docs/13-copilotkit-venues-routing.md) · booking sheet/HITL → [VEN-017](../tasks/mvp/016-ven-booking-sheet.md), [VEN-019](../tasks/mvp/018-ven-booking-copilot-action.md)

---

## Eval listing prompts (seeds / OpenClaw)

[`../tasks/listings/`](../tasks/listings/) — neighborhood café packs (Laureles, Poblado, tours). **Content drafts**, not executable tasks; feeds **DATA-003** seed + **DATA-006** golden queries.

---

## MVP order (café slice)

1. ✅ **CAF-005 / SCREEN-021** — shipped (`CafeResultCard`, `CafeDetailPanel`, map toggle, booking stub)
2. **INT-001 → INT-005** (CORE) — shared slots + rental fix first ([intelligence program](../../intelligence/tasks/INDEX.md))
3. **VEN-012** — café vs nightlife routing (blocks correct agent tool)
4. **INT-008** — café Gemini clarify (`quiet café in Laureles for remote work tomorrow`)
5. **DATA-035** — listings → `venue_anchors` (IG, web, vibe, images policy)
6. **DATA-003** — sign-off + golden-query map (after DATA-035)
7. **DATA-007/008** — Places cache (hours, phone, photos for seeded cafés)
8. **VEN-015…024** — booking chain ([mvp-index](../tasks/mvp/mvp-index.md))
9. **VEN-032…043** — optional; coffee **tours** ([mvp-index](../tasks/mvp/mvp-index.md#phase-7--coffee-tours-32-43-optional))
10. **Phase B** — VEC-004/005 catalog rerank (optional; not user memory INT-016)

*Design pages before data:* wireframe is complete; build Phase C booking UI with stub while CAF-008 lags.

---

## Related

- [`../notes-venues.md`](../notes-venues.md)
- [`../../notes/cafe-notes.md`](04-cafe-notes.md)
- [`../../audit/37-screen-coffee.md`](../../audit/37-screen-coffee.md)
- [`../../evidence/SCREEN-021-evidence.md`](../../evidence/SCREEN-021-evidence.md)
