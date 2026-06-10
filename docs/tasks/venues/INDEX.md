# Venues — master task index

> **Canonical execution order:** [`tasks/INDEX-VENUE.md`](tasks/INDEX-VENUE.md) — phased dependencies, 🔥 VEN-012 blocker, **persist-before-HITL** booking order. This file keeps the full numbered table + VEB/post-mvp rows.

Planning index for **data → MVP UI → booking → hardening → E2E → tours → event booking → post-MVP**.

**Drill-down:** [`tasks/mvp/mvp-index.md`](tasks/mvp/mvp-index.md) · [`tasks/event-booking/INDEX.md`](tasks/event-booking/INDEX.md) · **Forensic audit:** [`tasks/audit/03-venues-tasks-audit.md`](tasks/audit/03-venues-tasks-audit.md) · **Verify matrix:** [`tasks/evidence/VEN-VERIFY-MATRIX.md`](tasks/evidence/VEN-VERIFY-MATRIX.md)

**Crosswalk:** [`CROSSWALK-INT.md`](CROSSWALK-INT.md) · **Café hub:** [`cafes/INDEX.md`](cafes/INDEX.md)

---

## Status legend

| Symbol | Status | Meaning |
|--------|--------|---------|
| 🟢 | **Completed** | Fully functional, tested, live on Vercel (or DB migration applied + verified) |
| 🟡 | **In Progress** | Partially working on disk / staging — not Done-gated |
| ⚪ | **Not Started** | Planned; no implementation or spec-only |
| 🟥 | **Blocked** | Missing dependency, active bug, or external failure (API, schema) |

**Grade** = forensic % correct + letter from [`03-venues-tasks-audit.md`](tasks/audit/03-venues-tasks-audit.md) (2026-06-02). **—** = not scored yet.

**Pack readiness:** Venues MVP **48%** · Event booking (VEB) **8%** · Do not trust task `status:` alone — probe disk before Done.

---

## Master implementation order (all tasks)

Single sequence: implement top → bottom. **Same VEN number in `mvp/` vs `post-mvp/` = different files** — always use the linked path.

### Phase 0 — Data foundation

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 01 | [DATA-001](../data/tasks-data/data-001-inventory.md) | Venue data inventory | **86%** | 🟡 | — | Catalog inventory; align with DATA-002 |
| 02 | [DATA-002](../data/tasks-data/data-002-catalog-contract.md) | Three-kind catalog contract | **88%** | ⚪ | DATA-001 | café · restaurant · nightclub contract |
| 03 | [DATA-009](../data/archive/data-009-schema-migrations-m1-m3.md) | Schema M1–M3 (`venue_booking_requests`, anchors) | **86%** | 🟢 | DATA-002 | Live Supabase 2026-05-29 |
| 04 | [DATA-035](../data/archive/data-035-cafe-listings-venue-anchor-seed.md) | Café `venue_anchors` seed (17) | **90%** | 🟢 | DATA-009 | [evidence](../testing/evidence/DATA-035-venue-anchors-cafe.md) · SAN-332 |
| 05 | [DATA-003](../data/archive/data-003-cafe-seed.md) | Café seed sign-off | **84%** | 🟢 | DATA-035 | Golden queries |
| 06 | [DATA-004](../data/archive/data-004-restaurant-seed.md) | Restaurant seed (44) | **85%** | 🟢 | DATA-002 | Verified catalog |
| 07 | [DATA-005](../data/archive/data-005-nightclub-seed.md) | Nightclub seed (13) | **82%** | 🟢 | DATA-002 | `venue_anchors` kind=nightclub |
| 08 | [DATA-006](../data/archive/data-006-golden-queries.md) | Golden queries JSON | **83%** | 🟢 | DATA-003–005 | `golden-queries-venues.json` |
| 09 | [DATA-007](../data/tasks-data/data-007-cache-audit.md) | Places cache audit script | **84%** | 🟢 | DATA-001+ | [evidence](../testing/evidence/DATA-007-cache-audit.md) · 2.7% hit baseline |
| 10 | [DATA-008](../data/tasks-data/data-008-places-backfill-cron.md) | Places backfill + read-through | **55%** | 🟥 | DATA-007 | Cache layer shipped; **backfill blocked** Places API 403 |

### Phase 0b — Shipped screens (Vercel)

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 11 | [ARCH-005](../archive/005-scr-cafe-listings-map-booking.md) | SCREEN-021 café listings + map | **88%** | 🟢 | DATA-035 | Live Vercel · booking form VEN-021 (update SCREEN-021 e2e) |
| 12 | [ARCH-006](../archive/006-scr-venue-detail-sheet.md) | SCREEN-007 rental/event sheet | **90%** | 🟢 | — | Live Vercel · not café/restaurant panel |

### Phase 1 — Restaurant + nightlife UI (VEN-009…013)

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 13 | [VEN-009](tasks/mvp/009-ven-restaurant-result-card.md) | Restaurant result card | **A- / 90** | 🟡 | DATA-004 | [SCREEN-023](../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md) · spec In Review |
| 14 | [VEN-010](tasks/mvp/010-ven-restaurant-detail-panel.md) | Restaurant detail panel | **A- / 92** | 🟡 | VEN-009 | Booking CTA → `VenueBookingForm` |
| 15 | [VEN-011](007a-ven-nightlife-grounding-intent.md) | Nightlife grounding intent | **D+ / 58** | 🟡 | DATA-005 | Tool normalization only; UI routing pending |
| 16 | [VEN-012](007b-ven-grounded-kind-split.md) | Grounded café vs nightlife split | **B+ / 88** | 🟡 | VEN-011 | **🔥 CRITICAL** — routing infra; code on disk, e2e pending |
| 17 | [VEN-013](07c-ven-nightlife-detail-panel.md) | Nightlife detail panel | **B+ / 87** | 🟡 | VEN-012 | SCREEN-022 on disk |

**Parallel:** [INT-001…008](../intelligence/tasks/INDEX.md) — gate **INT-008** after VEN-012.

### Phase 2 — Places cache (VEN-014)

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 18 | [VEN-014](tasks/mvp/014-ven-places-cache-field-mask.md) | Places cache + field mask | **C+ / 72** | 🟡 | DATA-007–008, VEN-010, VEN-013 | `/api/places/detail` shipped; panels not wired |

### Phase 3 — Booking spine (VEN-015…024)

**Order:** see [`tasks/INDEX-VENUE.md`](tasks/INDEX-VENUE.md) Phase 4–5 — **VEN-021 persist before VEN-019 HITL / VEN-020 chips**.

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 19 | [VEN-015](tasks/mvp/015-ven-booking-requests-schema.md) | Booking schema + RLS verify | **B+ / 85** | 🟡 | DATA-009 | MCP RLS ✅; admin policies pending |
| 20 | [VEN-016](tasks/mvp/016-ven-request-venue-booking-tool.md) | `requestVenueBooking` Mastra tool | **B+ / 88** | 🟢 | VEN-015 | Vitest 5/5 · [evidence](tasks/evidence/VEN-016-verify-2026-06-02.md) |
| 21 | [VEN-017](tasks/mvp/017-ven-booking-sheet.md) | VenueBookingSheet / shared form | **B / 80** | 🟡 | VEN-016 | Café + restaurant + nightlife sheets |
| 22 | [VEN-018](tasks/mvp/018-ven-mastra-tool-action-names.md) | Mastra ↔ CopilotKit registry | **B / 78** | 🟢 | VEN-016 | Vitest 3/3 |
| 23 | [VEN-021](tasks/mvp/021-ven-booking-sheet-persist.md) | Sheet → DB persist (web API) | **B+ / 86** | 🟡 | VEN-016, VEN-017 | **Before HITL/chips** · [evidence](tasks/evidence/VEN-021-verify-2026-06-02.md) |
| 24 | [VEN-019](tasks/mvp/019-ven-booking-copilot-action.md) | Booking HITL (`renderAndWaitForResponse`) | **D / 45** | ⚪ | VEN-021+ | After persist |
| 25 | [VEN-020](tasks/mvp/020-ven-booking-status-chips.md) | Booking status chips on detail | **F / 15** | ⚪ | VEN-021 | DB-driven pending/confirmed |
| 26 | [VEN-022](tasks/mvp/022-ven-draft-venue-whatsapp.md) | `draftVenueWhatsApp` tool | **— / 0** | ⚪ | VEN-016 | Draft only — no auto-send |
| 27 | [VEN-023](tasks/mvp/023-ven-wa-approval-outbox.md) | Patricia WA approval outbox | **— / 0** | ⚪ | VEN-022, VEN-027 | Golden rule gate |
| 28 | [VEN-024](tasks/mvp/024-ven-admin-booking-queue.md) | Admin booking queue | **— / 0** | ⚪ | VEN-015 | `/admin/bookings` |

### Phase 4 — Release hardening (VEN-025…030)

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 29 | [VEN-025](tasks/mvp/025-ven-rls-penetration-tests.md) | RLS penetration tests | **F / 10** | ⚪ | VEN-015, VEN-016, VEN-021 | User A ≠ User B rows |
| 30 | [VEN-026](tasks/mvp/026-ven-booking-idempotency-duplicates.md) | Idempotency + duplicate UX | **C / 65** | 🟡 | VEN-015–021 | API key shipped; 409 UI pending |
| 31 | [VEN-027](tasks/mvp/027-ven-whatsapp-consent-suppression.md) | WhatsApp consent / suppression | **— / 0** | ⚪ | VEN-022 | Before VEN-023 prod |
| 32 | [VEN-028](tasks/mvp/028-ven-booking-retry-error-recovery.md) | Booking retry + error recovery | **F / 20** | ⚪ | VEN-021, VEN-026 | No fake success chip |
| 33 | [VEN-029](tasks/mvp/029-ven-tool-action-registry-ci.md) | Tool/action registry CI | **C+ / 70** | 🟡 | VEN-016, VEN-018 | Vitest exists; not in floor |
| 34 | [VEN-030](tasks/mvp/030-ven-admin-audit-log.md) | Admin audit log | **— / 0** | ⚪ | VEN-023, VEN-024 | Patricia approve/send trail |

### Phase 5 — E2E (VEN-031)

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 35 | [VEN-031](tasks/mvp/031-ven-playwright-venue-screens.md) | Playwright SCREEN-021/022/023 | **C+ / 72** | 🟡 | VEN-010, VEN-013, VEN-021+ | 021 booking fixed; 022 added; agent flake |

### Phase 6 — Coffee tours optional (VEN-032…043)

Does **not** block venue booking MVP. Start after DATA-002 if parallel.

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 36 | [VEN-032](tasks/mvp/032-ven-coffee-tour-core-schema.md) | Coffee tour core schema | **— / 0** | ⚪ | DATA-002 | No migration on disk |
| 37 | [VEN-033](tasks/mvp/033-ven-coffee-tour-types.md) | Coffee tour types | **— / 0** | ⚪ | VEN-032 | |
| 38 | [VEN-034](tasks/mvp/034-ven-seed-coffee-tours.md) | Seed coffee tours | **— / 0** | ⚪ | VEN-032 | |
| 39 | [VEN-035](tasks/mvp/035-ven-rank-coffee-tours.md) | rankCoffeeTours | **— / 0** | ⚪ | VEN-034 | |
| 40 | [VEN-036](tasks/mvp/036-ven-search-coffee-tours-tool.md) | searchCoffeeTours tool | **— / 0** | ⚪ | VEN-035 | |
| 41 | [VEN-037](tasks/mvp/037-ven-places-enrich-coffee-tours.md) | Places enrich tours | **— / 0** | ⚪ | VEN-036 | |
| 42 | [VEN-038](tasks/mvp/038-ven-coffee-tour-card-ui.md) | CoffeeTourCard UI | **— / 0** | ⚪ | VEN-036 | |
| 43 | [VEN-039](tasks/mvp/039-ven-map-pins-coffee-tours.md) | Map pins tours | **— / 0** | ⚪ | VEN-038 | |
| 44 | [VEN-040](tasks/mvp/040-ven-smoke-coffee-tours.md) | smoke:coffee-tours | **— / 0** | ⚪ | VEN-038 | |
| 45 | [VEN-041](tasks/mvp/041-ven-coffee-tour-logs-cache.md) | Tour search logs cache | **— / 0** | ⚪ | VEN-032 | |
| 46 | [VEN-042](tasks/mvp/042-ven-coffee-tour-phase-a-evidence.md) | Phase A evidence closeout | **— / 0** | ⚪ | VEN-040 | |
| 47 | [VEN-043](tasks/mvp/043-ven-tour-detail-page.md) | Tour detail page `/tours/[slug]` | **— / 0** | ⚪ | VEN-038 | |

**Post-MVP tours:** VEN-044…051 → [`tasks/post-mvp/post-mvp-index.md`](tasks/post-mvp/post-mvp-index.md)

---

## Event venue booking (VEB-001…018)

**Separate product:** Roberto / Carlos **private event** proposals — not dinner-table `venue_booking_requests` alone.

**Hub:** [`tasks/event-booking/INDEX.md`](tasks/event-booking/INDEX.md) · **Plan:** [`docs/venues-booking.md`](docs/venues-booking.md)

**Prerequisite for prod:** VEN-012 + **VEN-021 Done** + **VEN-031 green** before VEB-001; then VEN-015…024 spine + VEN-022/023 before VEB-010.

| Order | ID | Task | Grade | Status | Depends on | Notes |
|------:|----|------|-------|--------|------------|-------|
| 48 | [VEB-001](tasks/event-booking/VEB-001-core-event-venue-offerings-schema.md) | Event offerings schema | **F / 0** | 🟥 | DATA-009, VEN-015 | **No table on disk** — blocks all VEB UI |
| 49 | [VEB-002](tasks/event-booking/VEB-002-core-event-venue-seed-partners.md) | Seed Mamacita + partners | **F / 10** | 🟥 | VEB-001 | |
| 50 | [VEB-003](tasks/event-booking/VEB-003-mvp-restaurant-event-venue-cta.md) | Event Venue CTA on card | **F / 0** | 🟥 | VEN-009, VEN-010, VEB-002 | |
| 51 | [VEB-004](tasks/event-booking/VEB-004-mvp-event-offerings-panel.md) | Event offerings panel | **F / 0** | 🟥 | VEB-003 | |
| 52 | [VEB-005](tasks/event-booking/VEB-005-mvp-request-proposal-modal.md) | Request proposal modal | **F / 0** | 🟥 | VEB-004, VEN-017 | Reuse VEN-021 form patterns |
| 53 | [VEB-006](tasks/event-booking/VEB-006-mvp-eventVenueAgent-tools.md) | eventVenueAgent + tools | **F / 0** | 🟥 | VEB-001, VEN-011 | |
| 54 | [VEB-007](tasks/event-booking/VEB-007-mvp-venue-match-panel.md) | AI venue match panel | **F / 0** | 🟥 | VEB-006 | |
| 55 | [VEB-008](tasks/event-booking/VEB-008-mvp-compare-venues-ui.md) | Compare venues UI | **F / 0** | 🟥 | VEB-007 | |
| 56 | [VEB-009](tasks/event-booking/VEB-009-mvp-host-wizard-venue-step.md) | Host wizard venue step | **D / 40** | 🟡 | VEB-006, EVP-010 | Generic `set_venue` only |
| 57 | [VEB-010](tasks/event-booking/VEB-010-mvp-event-booking-workflow.md) | eventVenueBookingWorkflow | **F / 0** | 🟥 | VEB-005, VEN-016, VEN-022 | |
| 58 | [VEB-011](tasks/event-booking/VEB-011-mvp-admin-event-booking-queue.md) | Admin event queue | **F / 0** | 🟥 | VEB-010, VEN-024 | |
| 59 | [VEB-012](tasks/event-booking/VEB-012-mvp-trip-itinerary-booking.md) | Trip itinerary integration | **F / 0** | 🟥 | VEB-010 | |

### VEB advanced (Phase 2+)

| Order | ID | Task | Grade | Status | Depends on |
|------:|----|------|-------|--------|------------|
| 60 | [VEB-013](tasks/event-booking/VEB-013-advanced-availability-calendar.md) | Availability calendar | **—** | ⚪ | VEB-011 |
| 61 | [VEB-014](tasks/event-booking/VEB-014-advanced-auto-followup-drafts.md) | Auto follow-up WA drafts | **—** | ⚪ | VEB-011, VEN-023 |
| 62 | [VEB-015](tasks/event-booking/VEB-015-advanced-venue-crm-patricia.md) | Venue CRM | **—** | ⚪ | VEB-011 |
| 63 | [VEB-016](tasks/event-booking/VEB-016-advanced-dynamic-package-pricing.md) | Dynamic package pricing | **—** | ⚪ | VEB-004, VEB-013 |
| 64 | [VEB-017](tasks/event-booking/VEB-017-advanced-sponsor-venue-match.md) | Sponsor ↔ venue match | **—** | ⚪ | EVP-029, VEB-007 |
| 65 | [VEB-018](tasks/event-booking/VEB-018-advanced-openclaw-venue-enrichment.md) | OpenClaw enrichment (plan) | **—** | ⚪ | VEB-002 |

---

## Post-MVP agent polish (`tasks/post-mvp/` — same VEN IDs, different paths)

**Prerequisite:** MVP through **VEN-031**. Do not confuse with `mvp/025` (RLS) vs `post-mvp/025` (concierge instructions).

| Order | ID | Task | Grade | Status | Depends on | Path |
|------:|----|------|-------|--------|------------|------|
| 66 | [VEN-025](tasks/post-mvp/025-ven-mastra-concierge-instructions.md) | Concierge venue routing instructions | **84%** | ⚪ | VEN-011 | post-mvp |
| 67 | [VEN-026](tasks/post-mvp/026-ven-mastra-normalize-tool-output.md) | normalizeVenueToolOutput | **86%** | ⚪ | VEN-011 | post-mvp |
| 68 | [VEN-027](tasks/post-mvp/027-ven-copilot-unified-detail-types.md) | Unified VenuePlaceDetail types | **83%** | ⚪ | VEN-010, VEN-013 | post-mvp |
| 69 | [VEN-028](tasks/post-mvp/028-ven-mastra-working-memory-slots.md) | Working memory venue slots | **80%** | ⚪ | VEN-016 | post-mvp |
| 70 | [VEN-029](tasks/post-mvp/029-ven-copilot-filter-chips-nightlife.md) | Filter chips + nightlife | **78%** | ⚪ | post-mvp/025 | post-mvp |
| 71 | [VEN-030](tasks/post-mvp/030-ven-mastra-booking-workflow.md) | venueBookingWorkflow | **82%** | ⚪ | VEN-016, VEN-022 | post-mvp |
| 72 | [VEN-031](tasks/post-mvp/031-ven-vitest-copilot-card-renders.md) | Vitest card renders | **86%** | ⚪ | VEN-009, VEN-012 | post-mvp |
| 73 | [VEN-032](tasks/post-mvp/032-ven-vitest-mastra-venue-tools.md) | Vitest Mastra venue tools | **88%** | ⚪ | VEN-011, VEN-016 | post-mvp |
| 74 | [VEN-033](tasks/post-mvp/033-ven-data-restaurant-reservations-schema.md) | Restaurant reservations schema | **72%** | ⚪ | external | post-mvp |
| 75 | [VEN-034](tasks/post-mvp/034-ven-supabase-restaurant-booking-edge-fn.md) | Restaurant booking edge fn | **70%** | ⚪ | post-mvp/033 | post-mvp |

---

## Café intelligence (three tracks)

| Track | What | Tasks | Status |
|-------|------|-------|--------|
| **A. Café Places** | Grounded café on `/chat` | ARCH-005, VEN-012, DATA-035 | UI 🟢 · split 🟡 (VEN-012 In Review) |
| **B. Coffee tours** | Farm tour product | VEN-032…043, post-mvp 044…051 | ⚪ optional |
| **C. Chat intelligence** | INT slots + clarify | [INT-001…008](../intelligence/tasks/INDEX.md) | After VEN-012 |

---

## Intelligence overlap

See [**CROSSWALK-INT.md**](CROSSWALK-INT.md). **VEN-012 → INT-008** sequential gate.

---

## Duplicate ID warning

| ID | `mvp/` meaning | `post-mvp/` meaning |
|----|----------------|---------------------|
| VEN-025 | RLS penetration | Concierge instructions |
| VEN-026 | Booking idempotency | normalizeToolOutput |
| VEN-027 | WA consent | Unified detail types |
| VEN-028 | Retry UX | Working memory |
| VEN-029 | Registry CI | Filter chips |
| VEN-030 | Admin audit log | Booking workflow |
| VEN-031 | Playwright screens | Vitest card renders |

Always link by **full path**, not number alone.

---

## Release stop condition

Venues MVP is **not** production-safe until:

1. 🔥 **VEN-012** Done-gated (nightlife routing — code shipped, e2e pending)
2. 🟥 **DATA-008** backfill unblocked (Places billing)
3. 🟡 **VEN-021** Done with signed-in e2e (**before** VEN-019/020)
4. ⚪ **VEN-025**, **VEN-027**, **VEN-028**, **VEN-029**, **VEN-030** evidence attached
5. 🟡 **VEN-031** — SCREEN-021/022/023 green
6. **VEB** — do not start until 1 + 3 + 5

---

## Audit & history

| Doc | Purpose |
|-----|---------|
| [`tasks/audit/03-venues-tasks-audit.md`](tasks/audit/03-venues-tasks-audit.md) | Forensic grades + corrections (2026-06-02) |
| [`tasks/audit/01-venues-audit.md`](tasks/audit/01-venues-audit.md) | Structural audit (2026-05-28) |
| [`tasks/audit/02-implementation-order-plan.md`](tasks/audit/02-implementation-order-plan.md) | Original order plan |
| [`tasks/VEN-MIGRATION-2026-05-28.md`](tasks/VEN-MIGRATION-2026-05-28.md) | CTI → VEN renumbering |

*Updated: 2026-06-02 — master order, status legend, grades from disk audit*
