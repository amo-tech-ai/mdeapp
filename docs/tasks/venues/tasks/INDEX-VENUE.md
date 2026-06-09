# Venues — canonical implementation order

**Supersedes** the flat table in [`../INDEX.md`](../INDEX.md) for **execution priority and dependencies**. Use this file when deciding what to build next.

**Drill-down:** [`mvp/mvp-index.md`](mvp/mvp-index.md) · [`event-booking/INDEX.md`](event-booking/INDEX.md) · **Audit:** [`audit/03-venues-tasks-audit.md`](audit/03-venues-tasks-audit.md) · **Verify:** [`evidence/VEN-VERIFY-MATRIX.md`](evidence/VEN-VERIFY-MATRIX.md)

**Linear:** Each row links repo task ID → SAN issue ([prefix catalog](../../linear/prefix-catalog.json)). Base URL: `https://linear.app/sanjiovani/issue/SAN-###`.

**Principle:** Do not mix **table booking** (`venue_booking_requests`), **nightlife routing**, and **private event proposals** (VEB) in one sprint. Data → UI shell → routing fix → cache → **persist** → approval UX → hardening → E2E → VEB.

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| 🟢 | Done / live |
| 🟡 | Partial on disk |
| ⚪ | Not started |
| 🟥 | Blocked (dep, API, schema) |
| 🔥 | **Critical blocker** — wrong product behavior until fixed |

**Grade** from forensic audit 2026-06-02. Probe disk before marking Done.

---

## Progress snapshot (2026-06-03)

| Area | Linear | Status | Evidence |
|------|--------|--------|----------|
| Kind split VEN-012…015 | [SAN-295](https://linear.app/sanjiovani/issue/SAN-295) … [SAN-298](https://linear.app/sanjiovani/issue/SAN-298) | 🟢 Done | PR #48/#50 · [VEN-012 verify](evidence/VEN-012-verify-2026-06-02.md) |
| Booking persist VEN-021 | [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) | 🟢 Done | PR #53 · [VEN-021 verify](evidence/VEN-021-verify-2026-06-02.md) |
| Status chips VEN-020 | [SAN-307](https://linear.app/sanjiovani/issue/SAN-307) | 🟢 Done | PR #55 · [VEN-020 verify](evidence/VEN-020-verify-2026-06-02.md) |
| `/restaurants` browse | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | 🟢 Done | PR #57 @ `41cfe99` · [SCREEN-023 evidence](../../notes/SCREEN-023-restaurants-browse-evidence.md) |
| Map pins prod | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) / MAP-008B | 🟢 Done | [MAP-008B evidence](../../notes/MAP-008B-evidence.md) |
| ADK grounding prod | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) / MAP-002B | 🟥 **Blocked** | [MAP-002B evidence](../../notes/MAP-002B-evidence.md) — **do not close** |
| Playwright release gate | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) / VEN-031 | 🟡 | PR [#60](https://github.com/amo-tech-ai/mdeapp/pull/60) merged — signed-in booking e2e + SAN-368 still open |
| Browser Maps JS key | — | 🟥 | Prod “development purposes only” modal — separate GCP referrer/billing fix |

---

## Phase map (top level)

```text
PHASE 0  Data foundation
PHASE 1  UI foundation (café + venue sheet shell)
PHASE 2  Restaurant + nightlife (VEN-012 = 🔥 routing)
PHASE 3  Places cache optimization
PHASE 4  Booking persistence core
PHASE 5  Booking approval + HITL + status UI
PHASE 6  Production hardening
PHASE 7  E2E verification
PHASE 8  Event venue booking (VEB) — separate product layer
PHASE 9  Post-MVP intelligence + automation (deferred)
```

---

## Cross-cutting — maps + browse (Discovery Beta)

Not numbered in venue phases; gates chat cards and browse surfaces.

| ID | Linear | Task | Status | Notes |
|----|--------|------|--------|-------|
| MAP-008B | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Map ID + AdvancedMarker on prod | 🟢 | Prerequisite for MAP-002B |
| MAP-002B | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | ADK Grounding Lite on Cloud Run | 🟥 | Cloud Run `/health` 503 · Grounding Lite permission · prod may use `venue_anchors` fallback |
| SCREEN-021 | [SAN-114](https://linear.app/sanjiovani/issue/SAN-114) | Café listings + map (chat) | 🟢 | ARCH-005 |
| SCREEN-023 | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | `/restaurants` browse | 🟢 | Merged PR #57 |
| SCREEN-022 | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | `/nightlife` full browse | 🟢 | PR #67 @ `ae9a1e6` · [SCREEN-022 evidence](evidence/SCREEN-022-evidence.md) |
| — | — | `/cafes` full browse | 🟡 | Placeholder shell on prod; full browse backlog |

---

## PHASE 0 — Data foundation

Everything downstream depends on clean venue types, schema, seeds, and Places cache.

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 01 | [DATA-001](../../data/tasks-data/data-001-inventory.md) | [SAN-325](https://linear.app/sanjiovani/issue/SAN-325) | Venue data inventory | 🟡 | — | Align with DATA-002 |
| 02 | [DATA-002](../../data/tasks-data/data-002-catalog-contract.md) | [SAN-330](https://linear.app/sanjiovani/issue/SAN-330) | Three-kind catalog contract | ⚪ | DATA-001 | café · restaurant · nightclub |
| 03 | [DATA-009](../../data/archive/data-009-schema-migrations-m1-m3.md) | [SAN-331](https://linear.app/sanjiovani/issue/SAN-331) | Schema M1–M3 | 🟢 | DATA-002 | `venue_booking_requests`, anchors |
| 04 | [DATA-035](../../data/archive/data-035-cafe-listings-venue-anchor-seed.md) | [SAN-332](https://linear.app/sanjiovani/issue/SAN-332) | Café anchors (17) | 🟢 | DATA-009 | |
| 05 | [DATA-003](../../data/archive/data-003-cafe-seed.md) | [SAN-334](https://linear.app/sanjiovani/issue/SAN-334) | Café seed sign-off | 🟢 | DATA-035 | |
| 06 | [DATA-004](../../data/archive/data-004-restaurant-seed.md) | [SAN-333](https://linear.app/sanjiovani/issue/SAN-333) | Restaurant seed (44) | 🟢 | DATA-002 | |
| 07 | [DATA-005](../../data/archive/data-005-nightclub-seed.md) | [SAN-335](https://linear.app/sanjiovani/issue/SAN-335) | Nightclub seed (13) | 🟢 | DATA-002 | `kind=nightclub` |
| 08 | [DATA-006](../../data/archive/data-006-golden-queries.md) | [SAN-336](https://linear.app/sanjiovani/issue/SAN-336) | Golden queries JSON | 🟢 | DATA-003–005 | |
| 09 | [DATA-007](../../data/tasks-data/data-007-cache-audit.md) | [SAN-337](https://linear.app/sanjiovani/issue/SAN-337) | Places cache audit | 🟢 | DATA-001+ | 2.7% hit baseline |
| 10 | [DATA-008](../../data/tasks-data/data-008-places-backfill-cron.md) | [SAN-338](https://linear.app/sanjiovani/issue/SAN-338) | Places backfill | 🟥 | DATA-007 | API 403 — cache layer OK |

**Without Phase 0:** nightlife routing, cards, pins, and booking `venue_kind` mapping all drift.

---

## PHASE 1 — UI foundation

Map shell, card pattern, detail architecture — before nightlife-specific panels and booking polish.

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 11 | [ARCH-005](../archive/005-scr-cafe-listings-map-booking.md) | [SAN-114](https://linear.app/sanjiovani/issue/SAN-114) | SCREEN-021 café listings + map | 🟢 | DATA-035 | Live Vercel |
| 12 | [ARCH-006](../archive/006-scr-venue-detail-sheet.md) | [SAN-245](https://linear.app/sanjiovani/issue/SAN-245) | SCREEN-007 rental/event sheet | 🟢 | — | Not café/restaurant panel |

---

## PHASE 2 — Restaurant + nightlife

**Dependency logic matters more than numeric IDs here.**

| Order | ID | Linear | Task | Status | Depends on | Priority | Notes |
|------:|----|--------|------|--------|------------|----------|-------|
| 13 | [VEN-009](mvp/009-ven-restaurant-result-card.md) | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) | Restaurant result card | 🟡 | DATA-004 | P0 | Card shell — browse page shipped; chat card polish remains |
| 14 | [VEN-010](mvp/010-ven-restaurant-detail-panel.md) | [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) | Restaurant detail panel | 🟡 | VEN-009 | P0 | Slide panel + booking CTA pattern |
| 15 | [VEN-011](007a-ven-nightlife-grounding-intent.md) | [SAN-294](https://linear.app/sanjiovani/issue/SAN-294) | Nightlife grounding intent | 🟡 | DATA-005 | P0 | Tool query normalization |
| 16 | [VEN-012](007b-ven-grounded-kind-split.md) | [SAN-295](https://linear.app/sanjiovani/issue/SAN-295) | Grounded café vs nightlife split | 🟢 | VEN-011 | **P0** | PR #48 — Linear Done 2026-06-03 |
| 17 | [VEN-013](07c-ven-nightlife-detail-panel.md) | [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) | Nightlife detail panel | 🟢 | VEN-012 | P0 | Linear Done 2026-06-03 |

### VEN-012 — routing (was 🔥)

Kind split is **Done** on `main`. Remaining risk: prod chat still hits **curated fallback** until [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) (MAP-002B) unblocks real ADK.

**Parallel gate:** [INT-001…008](../../intelligence/tasks/INDEX.md) — **INT-008 after VEN-012 Done** ✅.

---

## PHASE 3 — Places cache

After cards/panels exist; optimizes cost/latency — **not** before UI.

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 18 | [VEN-014](mvp/014-ven-places-cache-field-mask.md) | [SAN-297](https://linear.app/sanjiovani/issue/SAN-297) | Places cache + field mask | 🟢 | DATA-007–008, VEN-010, VEN-013 | `/api/places/detail`; [014b guard SAN-520](evidence/VEN-014-verify-2026-06-02.md) |

---

## PHASE 4 — Booking persistence core

**Persist before approval UX.** Avoid fake pending states without DB writes.

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 19 | [VEN-015](mvp/015-ven-booking-requests-schema.md) | [SAN-298](https://linear.app/sanjiovani/issue/SAN-298) | Booking schema + RLS | 🟢 | DATA-009 | Foundation for all booking |
| 20 | [VEN-016](mvp/016-ven-request-venue-booking-tool.md) | [SAN-299](https://linear.app/sanjiovani/issue/SAN-299) | `requestVenueBooking` tool | 🟢 | VEN-015 | AI → booking bridge |
| 21 | [VEN-017](mvp/017-ven-booking-sheet.md) | [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) | Shared booking sheet / form (**RHF + Zod + Field**) | 🟡 | VEN-016 | café · restaurant · nightlife |
| 22 | [VEN-018](mvp/018-ven-mastra-tool-action-names.md) | [SAN-301](https://linear.app/sanjiovani/issue/SAN-301) | Mastra ↔ CopilotKit registry | 🟢 | VEN-016 | |
| 23 | [VEN-021](mvp/021-ven-booking-sheet-persist.md) | [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) | Sheet → DB persist | 🟢 | VEN-016, VEN-017 | PR #53 · **`POST /api/venue-booking/request`** |

**Anti-pattern (old order):** VEN-019 HITL / VEN-020 status chips **before** VEN-021 → fake-ready trap. **Fixed** — 021 merged before 020.

---

## PHASE 5 — Booking approval + visual states

Only after Phase 4 persist is proven (signed-in insert).

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 24 | [VEN-019](mvp/019-ven-booking-copilot-action.md) | [SAN-302](https://linear.app/sanjiovani/issue/SAN-302) | Booking HITL (`renderAndWaitForResponse`) | ⚪ | VEN-016, VEN-017, VEN-018, **VEN-021** | CopilotKit mirror of tool |
| 25 | [VEN-020](mvp/020-ven-booking-status-chips.md) | [SAN-307](https://linear.app/sanjiovani/issue/SAN-307) | Booking status chips | 🟢 | **VEN-021** | PR #55 · DB-driven pending on detail panels |
| 26 | [VEN-022](mvp/022-ven-draft-venue-whatsapp.md) | [SAN-308](https://linear.app/sanjiovani/issue/SAN-308) | `draftVenueWhatsApp` | ⚪ | VEN-016 | Draft only |
| 27 | [VEN-023](mvp/023-ven-wa-approval-outbox.md) | [SAN-310](https://linear.app/sanjiovani/issue/SAN-310) | Patricia WA outbox | ⚪ | VEN-022, VEN-027 | |
| 28 | [VEN-024](mvp/024-ven-admin-booking-queue.md) | [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | Admin booking queue | ⚪ | VEN-015 | `/admin/bookings` |

---

## PHASE 6 — Production hardening

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 29 | [VEN-025](mvp/025-ven-rls-penetration-tests.md) | [SAN-313](https://linear.app/sanjiovani/issue/SAN-313) | RLS penetration tests | ⚪ | VEN-015, VEN-016, VEN-021 | |
| 30 | [VEN-026](mvp/026-ven-booking-idempotency-duplicates.md) | [SAN-305](https://linear.app/sanjiovani/issue/SAN-305) | Idempotency + duplicate UX | 🟡 | VEN-015–021 | |
| 31 | [VEN-027](mvp/027-ven-whatsapp-consent-suppression.md) | [SAN-309](https://linear.app/sanjiovani/issue/SAN-309) | WhatsApp consent | ⚪ | VEN-022 | Before VEN-023 prod |
| 32 | [VEN-028](mvp/028-ven-booking-retry-error-recovery.md) | [SAN-306](https://linear.app/sanjiovani/issue/SAN-306) | Retry + recovery | ⚪ | VEN-021, VEN-026 | No fake success chip |
| 33 | [VEN-029](mvp/029-ven-tool-action-registry-ci.md) | [SAN-303](https://linear.app/sanjiovani/issue/SAN-303) | Registry CI | 🟡 | VEN-016, VEN-018 | |
| 34 | [VEN-030](mvp/030-ven-admin-audit-log.md) | [SAN-312](https://linear.app/sanjiovani/issue/SAN-312) | Admin audit log | ⚪ | VEN-023, VEN-024 | |

Sequence: **security → duplicates → consent → recovery → CI → admin visibility**.

---

## PHASE 7 — E2E verification

After hardening — tests assert real persistence and recovery.

| Order | ID | Linear | Task | Status | Depends on | Notes |
|------:|----|--------|------|--------|------------|-------|
| 35 | [VEN-031](mvp/031-ven-playwright-venue-screens.md) | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) | Playwright SCREEN-021/022/023 | 🟡 | VEN-010, VEN-013, **VEN-021+** | Agent flake; needs signed-in booking proof |
| 35b | [VEN-031b](mvp/031b-ven-screen-021-ask-prompt-e2e.md) | — | SCREEN-021 ask-prompt e2e | ✅ | VEN-031 | Fast path vs CopilotKit DOM — [evidence](evidence/VEN-031b-verify-2026-06-02.md) |

**Do not treat VEN-031 as “early QA”.** It is the **release gate** after booking spine + routing fix.

---

## PHASE 8 — Event venue booking (VEB)

**Separate product layer** — Roberto/Carlos **private event** proposals, not dinner `venue_booking_requests` alone.

**Hub:** [`event-booking/INDEX.md`](event-booking/INDEX.md) · [`../docs/venues-booking.md`](../docs/venues-booking.md)

### Hard gate — do not start VEB MVP until:

```text
VEN-021 Done (persist + signed-in e2e)          ✅
VEN-031 green (SCREEN-021/022/023)              🟡
VEN-012 Done (nightlife routing)                ✅
SAN-368 Done (real ADK, not venue_anchors)      🟥
```

Otherwise you duplicate unfinished booking forms, queues, and moderation.

| Order | ID | Linear | Task | Status | Depends on |
|------:|----|--------|------|--------|------------|
| 48 | [VEB-001](event-booking/VEB-001-core-event-venue-offerings-schema.md) | — | Event offerings schema | 🟥 | DATA-009, VEN-015 |
| 49–59 | VEB-002…012 | — | Event booking MVP chain | 🟥 | See event-booking INDEX |

**Create Linear issues for VEB-001…018 before Roberto event-booking work.**

---

## PHASE 9 — Optional / deferred

| Block | When | Tasks |
|-------|------|-------|
| Coffee tours | After venue MVP | VEN-032…043, post-mvp 044…051 |
| Post-MVP agent polish | After VEN-031 | `post-mvp/` VEN-025…034 (different paths — see duplicate ID table) |
| Intelligence reranking | After VEN-012 Done | INT-001…008 |
| WhatsApp automation prod | After VEN-027 + VEN-023 | VEN-022/023 |

---

## Duplicate VEN ID warning

| ID | `mvp/` | `post-mvp/` |
|----|--------|-------------|
| VEN-025 | RLS penetration | Concierge instructions |
| VEN-026 | Idempotency | normalizeToolOutput |
| VEN-027 | WA consent | Unified detail types |
| VEN-028 | Retry UX | Working memory |
| VEN-029 | Registry CI | Filter chips |
| VEN-030 | Admin audit | Booking workflow |
| VEN-031 | Playwright screens | Vitest card renders |

Always use **full path** in commits and PRs.

---

## Release stop condition (venues MVP)

Production-safe when **all** are true:

1. **VEN-012** Done — nightlife ≠ café routing ✅
2. **SAN-368** Done — prod chat uses real ADK (`metadata.source=grounding-lite`), not `venue_anchors` fallback 🟥
3. **DATA-008** backfill unblocked OR documented N/A with cache-only path 🟥
4. **VEN-021** Done — signed-in booking insert proof ✅
5. **VEN-019/020** only if 021 is Done — 020 ✅ · 019 ⚪
6. **VEN-025, 027, 028, 029, 030** evidence attached
7. **VEN-031** — SCREEN-021/022/023 green on CI or documented flake budget

**VEB:** not required for venues MVP stop — separate launch criteria in VEB INDEX.

---

## Operator — what to commit

**Planning repo** (`/home/sk/mdeai`):

```bash
git add tasks/notes/MAP-002B-evidence.md tasks/venues/tasks/INDEX-VENUE.md
git commit -m "docs(maps): record MAP-002B blocker evidence + venue index Linear links"
```

**mdeapp repo** (`/home/sk/mdeai/mdeapp`):

```bash
git add scripts/verify-task.mjs
git commit -m "chore(maps): register MAP-002B verify task"
```

---

## Operator — do not mark Done

**Do not close [SAN-368](https://linear.app/sanjiovani/issue/SAN-368)** until all are true:

- Cloud Run `/health` = **200**
- Grounding Lite permission fixed on server key
- `metadata.source=grounding-lite`
- Non-empty Google **attribution** on cards
- No curated fallback (`fallback: "curated"`)
- `npm run verify:cloud-run-grounding` passes
- `npm run verify:task MAP-002B` passes
- Prod chat proof is **real ADK**, not `venue_anchors`

Evidence: [`tasks/notes/MAP-002B-evidence.md`](../../notes/MAP-002B-evidence.md)

---

## Operator — next action (SAN-368)

Requires interactive `gcloud` login (agent cannot redeploy non-interactively):

```bash
gcloud auth login
gcloud config set project dev-inscriber-445714-k0

cd /home/sk/mdeai/services/adk-grounding
export PROJECT_ID=dev-inscriber-445714-k0
export REGION=us-east1
./scripts/deploy-cloud-run.sh

cd /home/sk/mdeai/mdeapp
npm run verify:cloud-run-grounding
npm run verify:grounding
npm run verify:task MAP-002B
```

Then prod chat café query — confirm cards are **not** `venue_anchors` fallback before flipping SAN-368 → Done.

---

## Audit verdict (user review 2026-06-02)

| Area | Verdict |
|------|---------|
| Data sequencing | ✅ Correct |
| UI foundation sequencing | ✅ Correct |
| Nightlife sequencing | ✅ Correct — VEN-012 Done; ADK fallback remains 🟥 |
| Booking sequencing | ✅ **Fixed** — persist (021) before HITL (019) and chips (020) |
| Hardening sequencing | ✅ Strong |
| VEB separation | ✅ Correct — gate on 021 + 031 + SAN-368 |
| Automation timing | ✅ Correctly deferred |

Overall: **architecture order ~90%**; this index applies the **execution priority** refinements.

*Updated: 2026-06-03 — Linear links, Discovery Beta progress, SAN-368 blocker ops*
