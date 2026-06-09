# Venues MVP — implementation order (VEN-009 … VEN-043)

> **One ID scheme:** all tasks are **VEN-NNN**. Filename `NNN-ven-*` = step **NNN**.  
> Migration from CTI: [`../VEN-MIGRATION-2026-05-28.md`](../VEN-MIGRATION-2026-05-28.md)  
> Data layer: [`../../../data/tasks-data/`](../../../data/tasks-data/) steps **01–09**

**Parent:** [`../../INDEX.md`](../../INDEX.md) · **Canonical order:** [`../INDEX-VENUE.md`](../INDEX-VENUE.md)

**Verification:** [`VEN-VERIFY-STANDARD.md`](VEN-VERIFY-STANDARD.md) · [`../evidence/VEN-VERIFY-MATRIX.md`](../evidence/VEN-VERIFY-MATRIX.md) (grades, MCP, Chrome DevTools, Playwright per task)

---

## Shipped (archived)

| What | Archive |
|------|---------|
| ✅ Café UI (SCREEN-021) | [`../../archive/005-scr-cafe-listings-map-booking.md`](../../archive/005-scr-cafe-listings-map-booking.md) · [CAF-A5](../../archive/CAF-A5-cafe-discovery-ui.md) |
| ✅ Venue sheet (SCREEN-007) | [`../../archive/006-scr-venue-detail-sheet.md`](../../archive/006-scr-venue-detail-sheet.md) |

---

## Phase 1 — Data (01–09)

| Step | Task | What |
|------|------|------|
| 01 | [DATA-001](../../../data/tasks-data/data-001-inventory.md) | Inventory |
| 02 | [DATA-002](../../../data/tasks-data/data-002-catalog-contract.md) | Catalog contract |
| 02b | [DATA-009](../../../data/archive/data-009-schema-migrations-m1-m3.md) | Booking + `venue_anchors` schema (M1–M2) ✅ |
| 03b | [DATA-035](../../../data/archive/data-035-cafe-listings-venue-anchor-seed.md) | **Café listings seed** ✅ 17 rows · [evidence](../../../testing/evidence/DATA-035-venue-anchors-cafe.md) |
| 03 | [DATA-003](../../../data/archive/data-003-cafe-seed.md) | Café seed sign-off ✅ golden queries |
| 04–05 | [DATA-004](../../../data/archive/data-004-restaurant-seed.md) … [DATA-005](../../../data/archive/data-005-nightclub-seed.md) | Restaurant / nightclub seeds ✅ |
| 06 | [DATA-006](../../../data/archive/data-006-golden-queries.md) | Golden queries ✅ |
| 07–08 | [DATA-007](../../../data/tasks-data/data-007-cache-audit.md) … [DATA-008](../../../data/tasks-data/data-008-places-backfill-cron.md) | Places cache |

---

## Phase 2 — Restaurant + nightlife UI (09–13)

| Step | Task | What | Status (disk 2026-06-02) |
|------|------|------|--------------------------|
| **09** | [009-ven-restaurant-result-card](009-ven-restaurant-result-card.md) | Restaurant cards | 🟡 In Review |
| **10** | [010-ven-restaurant-detail-panel](010-ven-restaurant-detail-panel.md) | Restaurant detail | 🟡 In Review |
| **11** | [007a-ven-nightlife-grounding-intent](007a-ven-nightlife-grounding-intent.md) | Nightlife intent | 🟡 In Progress (tool only) |
| **12** | [007b-ven-grounded-kind-split](007b-ven-grounded-kind-split.md) | Café vs nightclub routing | 🔴 In Progress (bug) |
| **13** | [07c-ven-nightlife-detail-panel](07c-ven-nightlife-detail-panel.md) | Nightlife detail | 🔴 Not started |

**Intelligence (parallel):** [INT-001…005](../../../intelligence/tasks/INDEX.md) · gate **INT-008** after step **12**

---

## Phase 3 — Places hardening (14)

| Step | Task | What |
|------|------|------|
| **14** | [014-ven-places-cache-field-mask](014-ven-places-cache-field-mask.md) | Cache + field-mask gate |

---

## Phase 4 — Booking (15–24)

| Step | Task | What |
|------|------|------|
| **15** | [015-ven-booking-requests-schema](015-ven-booking-requests-schema.md) | App + RLS verify (SQL in DATA-009) |
| **16** | [016-ven-request-venue-booking-tool](016-ven-request-venue-booking-tool.md) | Mastra save tool | 🟢 Done |
| **17** | [017-ven-booking-sheet](017-ven-booking-sheet.md) | Booking sheet | 🟡 In Review |
| **18** | [018-ven-mastra-tool-action-names](018-ven-mastra-tool-action-names.md) | Tool registry | 🟢 Done |
| **19** | [019-ven-booking-copilot-action](019-ven-booking-copilot-action.md) | HITL action | 🔴 Not started |
| **20** | [020-ven-booking-status-chips](020-ven-booking-status-chips.md) | Status chips | 🔴 Not started |
| **21** | [021-ven-booking-sheet-persist](021-ven-booking-sheet-persist.md) | Persist sheet | 🟡 In Review |
| **22** | [022-ven-draft-venue-whatsapp](022-ven-draft-venue-whatsapp.md) | Draft WA |
| **23** | [023-ven-wa-approval-outbox](023-ven-wa-approval-outbox.md) | Patricia approve/send |
| **24** | [024-ven-admin-booking-queue](024-ven-admin-booking-queue.md) | Admin queue |

---

## Phase 5 — Release hardening (25–30)

| Step | Task | What |
|------|------|------|
| **25** | [025-ven-rls-penetration-tests](025-ven-rls-penetration-tests.md) | RLS proof |
| **26** | [026-ven-booking-idempotency-duplicates](026-ven-booking-idempotency-duplicates.md) | Idempotency |
| **27** | [027-ven-whatsapp-consent-suppression](027-ven-whatsapp-consent-suppression.md) | WA consent |
| **28** | [028-ven-booking-retry-error-recovery](028-ven-booking-retry-error-recovery.md) | Retry UX |
| **29** | [029-ven-tool-action-registry-ci](029-ven-tool-action-registry-ci.md) | Registry CI |
| **30** | [030-ven-admin-audit-log](030-ven-admin-audit-log.md) | Admin audit |

---

## Phase 6 — E2E (31)

| Step | Task | What |
|------|------|------|
| **31** | [031-ven-playwright-venue-screens](031-ven-playwright-venue-screens.md) | Playwright 021/022/023 |

---

## Phase 7 — Coffee tours (32–43, optional)

*Farm tour product — not café Places search. Can start after DATA-002 in parallel with 09–13.*

| Step | Task | Was |
|------|------|-----|
| **32** | [032-ven-coffee-tour-core-schema](032-ven-coffee-tour-core-schema.md) | CTI-001A |
| **33** | [033-ven-coffee-tour-types](033-ven-coffee-tour-types.md) | CTI-002 |
| **34** | [034-ven-seed-coffee-tours](034-ven-seed-coffee-tours.md) | CTI-003 |
| **35** | [035-ven-rank-coffee-tours](035-ven-rank-coffee-tours.md) | CTI-006 |
| **36** | [036-ven-search-coffee-tours-tool](036-ven-search-coffee-tours-tool.md) | CTI-004 |
| **37** | [037-ven-places-enrich-coffee-tours](037-ven-places-enrich-coffee-tours.md) | CTI-005 |
| **38** | [038-ven-coffee-tour-card-ui](038-ven-coffee-tour-card-ui.md) | CTI-007 |
| **39** | [039-ven-map-pins-coffee-tours](039-ven-map-pins-coffee-tours.md) | CTI-008 |
| **40** | [040-ven-smoke-coffee-tours](040-ven-smoke-coffee-tours.md) | CTI-009 |
| **41** | [041-ven-coffee-tour-logs-cache](041-ven-coffee-tour-logs-cache.md) | CTI-001B |
| **42** | [042-ven-coffee-tour-phase-a-evidence](042-ven-coffee-tour-phase-a-evidence.md) | CTI-010 |
| **43** | [043-ven-tour-detail-page](043-ven-tour-detail-page.md) | CTI-017 |

**Post-MVP tours:** VEN-044…051 in [`../post-mvp/`](../post-mvp/post-mvp-index.md)

```text
DATA 01–09 → VEN 09–13 UI → VEN 14 cache → VEN 15–24 booking → VEN 25–30 harden → VEN 31 E2E
→ VEN 32–43 tours (optional)
```

*Updated: 2026-06-02 — disk status column + audit [`../audit/03-venues-tasks-audit.md`](../audit/03-venues-tasks-audit.md)*

**Spec hygiene:** Task `status:` must match disk — probe before Done; see audit § Spec hygiene.
