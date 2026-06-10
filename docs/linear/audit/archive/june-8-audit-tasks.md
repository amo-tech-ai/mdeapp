# CORE + MVP Forensic Audit — Skill-Verified · 2026-06-08

**Auditor:** Senior Software Specialist · Forensic Auditor  
**Skills verified:** `copilotkitV1` · `gemini` · `mastra` · `mde-maps` · `mde-supabase` · `shadcn` · `stripe-best-practices` · `task-verifier`  
**Sources:** `linear/markdown/{core,mvp,ADV,CHAT}.md` · `mdeapp/src/**` · `sitemap.md` · `launch-readiness.md` · `tasks/evidence/F13-evidence.md`

**Legend:** 🟢 Complete · 🟡 In Progress / partial · ⚪ Not started (grey) · 🔴 Failed / dup / blocker

**% Correct formula (per task):**

| Weight | Dimension |
|--------|-----------|
| 40% | Spec accuracy (title, tier, deps, priority) |
| 40% | Status vs disk + `task-verifier` gates 1–9 |
| 20% | Stack skill alignment (CK 1.55 v1, Gemini-only, mapId, field masks, Stripe Sessions, RLS) |

**Score** = round(% Correct) · **Grade:** A+≥95 · A≥90 · B≥80 · C≥70 · D≥60 · F<60

---

## Executive Verdict (skill-adjusted)

| Metric | % Correct | Score | Grade | Red flag |
|--------|----------:|------:|-------|----------|
| **CORE tracker** | 62% | 61 | D | Payments absent; SAN-548 under-scored |
| **MVP tracker** | 41% | 38 | F | 11 dups; 8+ stale Done-on-disk as Todo |
| **ADV tracker** | 78% | 72 | C | Trips duplicated in MVP |
| **CHAT sprint** | 68% | 58 | F | 9/10 open; chain correct |
| **Disk vs Linear sync** | 55% | 52 | F | launch-readiness lags SAN-478 |
| **Launch readiness** | 68% | 65 | D | Andrés G1 unproven |
| **Skill compliance (code)** | 88% | 88 | B | Stack rules mostly followed |
| **Skill compliance (tasks)** | 52% | 48 | F | Trackers don't reflect disk |

**Overall project: 59/100 (D)** · **Launch: 65/100 (D)** · **Codebase stack: 88/100 (B)**

---

## 0. Skill Forensic Compliance

### copilotkitV1 (1.55.2)

| Check | Disk | Task gap |
|-------|------|----------|
| v1 imports only (`react-core`, not `react`) | 🟢 Pass | — |
| `conciergeAgent` name match provider ↔ Mastra | 🟢 Pass | — |
| `useCoAgent` + `useCopilotAction` pattern | 🟢 Pass | SAN-833 deferred ✓ |
| HITL `renderAndWaitForResponse` host wizard | 🟢 Pass | — |
| Stable props (POST storm guard) | 🟢 Tests exist | SAN-828 prod 401 🔴 |
| Tool name registry `mastra-tool-action-names` | 🟡 Partial | SAN-301 open but registry on disk |

### gemini

| Check | Disk | Task gap |
|-------|------|----------|
| Production = `gemini-3.5-flash` only | 🟢 `models.ts` | — |
| No `@anthropic-ai/*` in src | 🟢 Pass | — |
| Clarify routing (no canned bypass) | 🔴 Partial | SAN-407/485/823 |

### mastra

| Check | Disk | Task gap |
|-------|------|----------|
| Postgres storage on Vercel (`DATABASE_URL`) | 🟢 `storage.ts` | SAN-548 should be 🟡 |
| Thread working memory Zod schema | 🟢 concierge | — |
| `conciergeRoutingWorkflow` on `/chat` | 🔴 Not wired | AGT backlog OK |
| Service-role carve-out (`mastra/lib`) | 🟢 Pass | — |
| ai_runs telemetry | 🟢 F13 Done | — |

### mde-maps

| Check | Disk | Task gap |
|-------|------|----------|
| `mapId` on `<Map>` | 🟢 `google-maps-map-id.ts` | SAN-369 Done ✓ |
| `X-Goog-FieldMask` Places calls | 🟢 `google-places-client.ts` | — |
| vis.gl AdvancedMarker | 🟢 Pass | SAN-323 stale markers open |
| ADK grounding prod | 🟡 Partial | SAN-368 WIP |

### mde-supabase

| Check | Disk | Task gap |
|-------|------|----------|
| RLS on venue_booking tables | 🟢 SAN-298 | SAN-313 pen test open |
| No service-role in client src | 🟢 Pass | — |
| `hybrid_search_listings` RPC wired | 🟢 tool calls RPC | SAN-386 WIP label |
| Embed API 403 | 🔴 Bug | SAN-545 |

### shadcn

| Check | Disk | Task gap |
|-------|------|----------|
| Semantic tokens (no `gray-*`) | 🟢 No matches | — |
| Booking sheets RHF + Field | 🟢 venue-booking | — |

### stripe-best-practices

| Check | Disk | Task gap |
|-------|------|----------|
| Checkout Sessions (not PI-only) | 🟢 `/api/tickets/checkout` | — |
| Webhook signature + idempotency | 🟢 edge fn on disk | SAN-116 Done; not in core.md |
| **G1 prod paid proof** | 🔴 Missing | SAN-178/115 |
| Connect / marketplace | ⚪ Correctly ADV | SAN-651 deferred ✓ |

### task-verifier

| Violation | Tasks |
|-----------|-------|
| Todo while Done on disk | SAN-292, 300, 299–302 chain |
| Done without prod evidence | SAN-478 needs launch-readiness sync |
| Dup issues active | SAN-100, 463, 464, 558, 564, 437, 469+470 |
| Gate 9 localhost N/A claimed | Several 🟢 without dated evidence path |

---

## 1. Red Flags · Failure Points · Blockers

| Severity | ID / Area | Failure mode | Skill |
|----------|-----------|--------------|-------|
| 🔴 P0 | SAN-178 | Andrés cannot pay on prod — revenue | stripe |
| 🔴 P0 | SAN-115 | EVP-001 ledger absent from trackers | task-verifier |
| 🔴 P0 | SAN-546 | J05–J20 journey matrix not started | testing |
| 🔴 P0 | Payments section | 2 tracked tasks vs 8+ on disk | stripe |
| 🔴 P0 | SAN-545 | Rental embed 403 breaks hybrid | supabase |
| 🟡 P1 | SAN-548 | Postgres shipped; turn-11 prod proof missing | mastra |
| 🟡 P1 | SAN-823–831 | CHAT sprint 9/10 open | copilotkit |
| 🟡 P1 | SAN-407/485 | Canned clarify bypass live | gemini |
| 🟡 P1 | SAN-828 | CK empty POST 401 vs smoke 400 | copilotkit |
| 🟡 P1 | Trips SAN-273–290 | 8 Urgent MVP — scope creep | TPM |
| 🟡 P1 | SAN-299–312 | Re-spec venue booking already shipped | task-verifier |
| 🟡 P1 | launch-readiness.md | Still lists SAN-478 blocker | hygiene |
| 🔴 Hygiene | 11 duplicates | Wrong P0 ordering | linear |
| 🔴 Hygiene | SAN-469+470 | Identical dup | import |
| 🟡 ADV | Trips in MVP + ADV | 54 tasks double-counted | scope |

---

## 2. Critical Fixes (ordered)

| # | Fix | Owner | Verify |
|---|-----|-------|--------|
| 1 | Add SAN-115, SAN-116, PAY-001–006 to `core.md` | TPM | generate.py regen |
| 2 | Prod Andrés G1: checkout → webhook → `/me/tickets` | Eng | evidence ledger |
| 3 | Implement SAN-546 J05–J20 Playwright matrix | QA | `tasks/testing/09-prod-live-journey-matrix.md` |
| 4 | SAN-548: turn-11 cold-start script + prod screenshot | Eng | F13 + new evidence |
| 5 | Cancel 11 Linear dups; merge 469/470 | TPM | Linear |
| 6 | Flip SAN-292, 300, 304-chain to Done (disk audit) | Eng | task-verifier 9 gates |
| 7 | Move SAN-273–290 to ADV; remove from MVP blockers | TPM | mvp.md regen |
| 8 | SAN-545 embed 403 root-cause + fix | Eng | hybrid RPC 200 |
| 9 | Ship SAN-823→828 CHAT chain | Eng | rental fast-path E2E |
| 10 | Sync `launch-readiness.md` (SAN-478 ✅) | Docs | file update |

---

## 3. Completeness — Missing Work

| Category | Status | Missing |
|----------|--------|---------|
| Payments tasks in Linear | 🔴 | 6+ CORE rows (webhook proof, G1 E2E, idempotency test) |
| Partner CRM | 🔴 | Inbox, dashboard, lead stages (2 tasks → need 10) |
| Discovery epic | 🟡 | SEARCH-001 finish; unified logs (SAN-627) |
| Thread persistence evidence | 🟡 | Prod turn-11 script |
| Admin Patricia | 🟡 | SAN-311, SAN-516 |
| Wireframes | ⚪ | Payment failure, partner dashboard |
| PRDs | ⚪ | Partner CRM chunk |
| Automations | ⚪ | OK in ADV |

---

## 4. CORE — Per-Task Audit (21)

| Dot | Task | % Correct | Score | Grade | Red flag / note |
|-----|------|----------:|------:|-------|-----------------|
| 🟢 | SAN-339 search_path hardening | 100 | 100 | A+ | supabase ✓ |
| 🟢 | SAN-367 prod auth checklist | 100 | 100 | A+ | — |
| ⚪ | SAN-531 SECURITY DEFINER RPCs | 72 | 72 | C | Valid backlog |
| 🟢 | SAN-340 edge freeze matrix | 100 | 100 | A+ | — |
| 🟢 | SAN-404 turn-1 routing schema | 100 | 100 | A+ | gemini routing ✓ |
| 🟢 | SAN-462 beta soak gate | 100 | 100 | A+ | task-verifier ✓ |
| 🟢 | SAN-459 migration lint CI | 100 | 100 | A+ | — |
| 🟢 | SAN-369 Map ID prod | 100 | 100 | A+ | mde-maps ✓ |
| 🟡 | SAN-368 ADK grounding prod | 68 | 68 | D | SAN-463 dup 🔴 |
| ⚪ | SAN-406 neighborhood clarify | 82 | 82 | B | Overlaps CHAT; spec OK |
| ⚪ | SAN-460 SHA-pin Actions | 78 | 78 | C | CI hardening |
| 🟢 | SAN-405 rental budget parse | 100 | 100 | A+ | — |
| 🟢 | SAN-408 hero query regression | 100 | 100 | A+ | — |
| ⚪ | SAN-407 canned clarify bypass | 88 | 88 | B | **Launch** · disk partial |
| 🟡 | SAN-548 thread persistence | **62** | 62 | D | **F13 Done; evidence 0%** |
| ⚪ | SAN-95 evaluationAgent port | 75 | 75 | C | Post-launch OK |
| ⚪ | SAN-96 auto-review calibration | 70 | 70 | C | Dev tooling |
| 🟡 | SAN-458 floor branch protection | 82 | 82 | B | WIP |
| ⚪ | SAN-546 journey J05–J20 | 92 | 92 | A | **Spec A+; impl 0%** |
| 🔴 | SAN-100 prod smoke matrix | 0 | 0 | F | Dup SAN-462 |
| ⚪ | SAN-178 live ticket prod | 85 | 85 | B | **Checkout on disk; proof 0%** |

**CORE avg % correct: 81% · weighted score: 61** (status Todo drags score) · **3 tracker errors**

---

## 5. MVP — Per-Task Audit (158)

### 🔐 Foundation (14) — avg 74%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-298 venue_booking RLS | 100 | 100 | A+ | |
| 🟢 | SAN-379 venue_signals | 100 | 100 | A+ | |
| 🟢 | SAN-367 auth checklist | 100 | 100 | A+ | dup in CORE |
| 🟢 | SAN-585 events browse scr | 100 | 100 | A+ | |
| 🟢 | SAN-586 published-events API | 100 | 100 | A+ | |
| 🟡 | SAN-338 Places backfill cron | 78 | 78 | C | WIP |
| ⚪ | SAN-313 venue booking RLS pen | 28 | 28 | F | Blocked SAN-311 |
| ⚪ | SAN-467 rentals schema audit | 38 | 38 | F | Needed |
| ⚪ | SAN-547 JWT→Mastra context | 42 | 42 | F | Should be CORE |
| ⚪ | SAN-277 itinerary tab | 18 | 18 | F | Trips→ADV |
| ⚪ | SAN-482 Playwright RLS | 30 | 30 | F | |
| ⚪ | SAN-492 event venue schema | 35 | 35 | F | |
| ⚪ | SAN-545 rental embed 403 | 48 | 48 | F | **Known bug** |
| ⚪ | SAN-527 mobile auth OAuth | 22 | 22 | F | Blocked |

### 🗺️ Maps & Search (53) — avg 52%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-294 nightlife intent | 100 | 100 | A+ | |
| 🟢 | SAN-295 café/nightlife split | 100 | 100 | A+ | |
| 🟢 | SAN-296 NightlifeDetailPanel | 100 | 100 | A+ | |
| 🟢 | SAN-297 Places cache masks | 100 | 100 | A+ | mde-maps ✓ |
| 🟢 | SAN-520 VEN-014b retry | 100 | 100 | A+ | |
| 🟢 | SAN-605 grounding scorer | 100 | 100 | A+ | |
| 🟢 | SAN-304 VenueBookingSheet | 100 | 100 | A+ | |
| 🟢 | SAN-307 booking status chips | 100 | 100 | A+ | |
| 🟢 | SAN-369 Map ID prod | 100 | 100 | A+ | dup CORE |
| 🟢 | SAN-491 nightlife listings | 100 | 100 | A+ | |
| 🟢 | SAN-518 events browse | 100 | 100 | A+ | |
| 🟡 | SAN-386 hybrid rentals | 72 | 72 | C | RPC wired; tracker WIP |
| 🟡 | SAN-387 hybrid events | 72 | 72 | C | Same |
| 🟡 | SAN-111 map exploration | 70 | 70 | C | Blocked |
| 🟡 | SAN-368 ADK prod | 68 | 68 | D | |
| 🟡 | SAN-549 nightlife intent wire | 65 | 65 | D | |
| ⚪ | SAN-273 trips audit | 15 | 15 | F | **→ADV** |
| ⚪ | SAN-274 trips dashboard | 12 | 12 | F | **→ADV** |
| ⚪ | SAN-275 create trip modal | 12 | 12 | F | **→ADV** |
| 🟢 | SAN-292 RestaurantResultCard | **95** | 95 | A | **Stale Todo — disk Done** |
| ⚪ | SAN-293 RestaurantDetailPanel | 55 | 55 | F | Partial on disk |
| ⚪ | SAN-299 requestVenueBooking tool | 45 | 45 | F | Partial — audit vs 304 |
| 🟢 | SAN-300 VenueBookingSheet | **95** | 95 | A | **Stale Todo — dup 304** |
| ⚪ | SAN-301 tool-action registry CI | 50 | 50 | F | Registry exists |
| ⚪ | SAN-303 registry CI test | 40 | 40 | F | |
| ⚪ | SAN-305 booking idempotency | 45 | 45 | F | |
| ⚪ | SAN-306 booking retry UI | 40 | 40 | F | |
| ⚪ | SAN-308 draftVenueWhatsApp | 35 | 35 | F | ADV |
| ⚪ | SAN-309 WA consent | 35 | 35 | F | ADV |
| ⚪ | SAN-312 admin audit log | 30 | 30 | F | |
| ⚪ | SAN-469 rental indexes | 40 | 40 | F | **Dup 470** |
| ⚪ | SAN-470 rental indexes | 0 | 0 | F | **Cancel** |
| ⚪ | SAN-104 host venue autocomplete | 55 | 55 | F | Roberto |
| ⚪ | SAN-278 saved collections | 20 | 20 | F | Trips dep |
| ⚪ | SAN-280 trip map pins | 15 | 15 | F | **→ADV** |
| ⚪ | SAN-281 conflict HITL | 15 | 15 | F | **→ADV** |
| ⚪ | SAN-310 WA approval outbox | 30 | 30 | F | |
| ⚪ | SAN-323 stale marker DOM | 60 | 60 | D | Ready |
| ⚪ | SAN-443 orphan GroundedPlaceCard | 55 | 55 | F | |
| ⚪ | SAN-472 rental pin sync | 50 | 50 | F | |
| ⚪ | SAN-486 rental date filters | 45 | 45 | F | |
| ⚪ | SAN-497 eventVenueAgent | 35 | 35 | F | Polish→ADV |
| ⚪ | SAN-824 event pin coverage | 70 | 70 | C | CHAT P2 |
| ⚪ | SAN-825 restaurant placeholders | 55 | 55 | F | CHAT P3 |
| ⚪ | SAN-826 café Place ID audit | 58 | 58 | F | CHAT P3 |
| ⚪ | SAN-524 mobile map | 25 | 25 | F | Blocked |
| ⚪ | SAN-311 admin bookings queue | 38 | 38 | F | Patricia |
| ⚪ | SAN-606 grounding assertion | 45 | 45 | F | AGT Phase 1 |
| ⚪ | SAN-627 search logs | 40 | 40 | F | Discovery ROI |
| ⚪ | SAN-519 cafés browse | 75 | 75 | C | Live per sitemap |
| 🔴 | SAN-463 ADK sidecar | 0 | 0 | F | Dup 368 |
| 🔴 | SAN-464 Map ID verify | 0 | 0 | F | Dup 369 |
| 🔴 | SAN-558 cafés live | 0 | 0 | F | Dup 519 |

### 🤖 AI & Intelligence (33) — avg 38%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-589 telemetry | 100 | 100 | A+ | |
| 🟢 | SAN-590 faithfulness scorer | 100 | 100 | A+ | |
| 🟢 | SAN-591 agent allowlist | 100 | 100 | A+ | MASTRA-MIS-001 ✓ |
| 🟡 | SAN-521 CK mobile best practices | 68 | 68 | D | |
| ⚪ | SAN-302 requestVenueBooking CK | 45 | 45 | F | Partial disk |
| ⚪ | SAN-406 neighborhood clarify | 82 | 82 | B | dup CORE |
| ⚪ | SAN-407 clarify bypass | 88 | 88 | B | launch |
| ⚪ | SAN-484 rental parser | 52 | 52 | F | parser on disk |
| ⚪ | SAN-485 Gemini clarify | 85 | 85 | B | |
| 🟡 | SAN-548 thread persistence | 62 | 62 | D | dup CORE |
| ⚪ | SAN-501 eventVenueBooking WF | 30 | 30 | F | ADV |
| ⚪ | SAN-822 concierge sprint epic | 70 | 70 | C | CHAT.md ✓ |
| ⚪ | SAN-823 rental fast-path | 75 | 75 | C | CHAT P1 |
| ⚪ | SAN-828 CK 401 audit | 72 | 72 | C | CHAT P2 |
| ⚪ | SAN-522 mobile composer | 20 | 20 | F | 5 deps |
| ⚪ | SAN-588 Mastra adoption epic | 25 | 25 | F | Too broad |
| ⚪ | SAN-592–596, 598, 611 AGT pack | 35 | 35 | F | Phase 1 tail |
| ⚪ | SAN-766–775 AIE host pack | 20 | 20 | F | **→ADV** |
| ⚪ | SAN-832–834 multi-agent | 30 | 30 | F | Defer v2 |
| 🔴 | SAN-564 create_checkout | 0 | 0 | F | Dup 551 |

### 📅 Events (26) — avg 32%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-118 host events list | 100 | 100 | A+ | |
| 🟡 | SAN-135 Luma detail layout | 80 | 80 | B | |
| ⚪ | SAN-510–514 event polish wire | 30 | 30 | F | **→ADV** |
| ⚪ | SAN-279 add-to-trip | 15 | 15 | F | **→ADV** |
| ⚪ | SAN-438 hover pin highlight | 50 | 50 | F | |
| ⚪ | SAN-493–503 venue match chain | 25 | 25 | F | Polish |
| ⚪ | SAN-731 detail skeleton | 45 | 45 | F | |
| ⚪ | SAN-769–779 AIE dashboards | 18 | 18 | F | **→ADV** |

### 🏠 Rentals (10) — avg 68%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-242 rental card polish | 100 | 100 | A+ | |
| 🟢 | SAN-478 /rentals browse | **98** | 98 | A+ | **page.tsx on disk** |
| 🟡 | SAN-471 rental cards chat | 70 | 70 | C | |
| 🟡 | SAN-473 schedule viewing | 72 | 72 | C | modal live |
| ⚪ | SAN-474 lead capture G2 | 45 | 45 | F | |
| ⚪ | SAN-468 inventory quality | 40 | 40 | F | |
| ⚪ | SAN-475 landlord inbox | 35 | 35 | F | |
| ⚪ | SAN-476 showing bridge | 35 | 35 | F | |
| ⚪ | SAN-477 saved+trips | 20 | 20 | F | **→ADV** |
| ⚪ | SAN-483 prod smoke | 50 | 50 | F | |

### 🏢 Venues (3) — avg 90%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-314 Playwright 021/022/023 | 100 | 100 | A+ | |
| 🟢 | SAN-490 restaurant listings | 100 | 100 | A+ | |
| ⚪ | SAN-827 nightlife synthetic #5 | 65 | 65 | D | CHAT |

### 🛒 Payments (1) — avg 35%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| ⚪ | SAN-526 mobile checkout UX | 35 | 35 | F | **Under-scoped; checkout modal exists** |

*Missing from tracker: SAN-115, SAN-116, SAN-178 (in CORE only), webhook tests*

### 🤝 Partner CRM (2) — avg 55%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-723 partner signup | 100 | 100 | A+ | |
| ⚪ | SAN-282 booking→trip_items | 10 | 10 | F | **→ADV** |

### 🧭 UX / Concierge (11) — avg 48%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-489 mobile 3-panel | 100 | 100 | A+ | |
| 🟡 | SAN-112 login/signup polish | 82 | 82 | B | |
| 🟡 | SAN-584 explore sidebar nav | 68 | 68 | D | |
| ⚪ | SAN-276 trip workspace | 12 | 12 | F | **→ADV** |
| ⚪ | SAN-290 trips Playwright | 15 | 15 | F | **→ADV** |
| ⚪ | SAN-829–831 CHAT ship chain | 70 | 70 | C | See CHAT.md |
| ⚪ | SAN-523–525 mobile UX | 25 | 25 | F | |
| 🔴 | SAN-437 ResultCardShell | 0 | 0 | F | Dup 574 |

### 🧪 Testing (5) — avg 58%

| Dot | Task | % | Score | Grd | Note |
|-----|------|--:|------:|-----|------|
| 🟢 | SAN-462 soak gate | 100 | 100 | A+ | dup CORE |
| 🟡 | SAN-458 floor protection | 82 | 82 | B | |
| ⚪ | SAN-546 J05–J20 | 92 | 92 | A | **Impl 0%** |
| ⚪ | SAN-291 trips smoke | 15 | 15 | F | **→ADV** |
| ⚪ | SAN-460 SHA-pin | 78 | 78 | C | dup CORE |

**MVP totals:** 158 tasks · avg **% correct: 48%** · avg **score: 38** · 🟢 27 · 🟡 13 · ⚪ 113 · 🔴 5

---

## 6. CHAT Sprint Cross-Audit (10)

| Dot | Task | % | Score | Grd | Skill |
|-----|------|--:|------:|-----|-------|
| 🟢 | SAN-733 /chat handoff | 100 | 100 | A+ | copilotkit ✓ |
| ⚪ | SAN-823 rental fast-path | 75 | 75 | C | mastra |
| ⚪ | SAN-828 CK audit | 72 | 72 | C | copilotkit |
| ⚪ | SAN-824 event pins | 70 | 70 | C | mde-maps |
| ⚪ | SAN-827 nightlife synthetic | 65 | 65 | D | testing |
| ⚪ | SAN-825 restaurant photos | 55 | 55 | F | mde-maps |
| ⚪ | SAN-826 café Place IDs | 58 | 58 | F | supabase |
| ⚪ | SAN-829 validation gate | 70 | 70 | C | task-verifier |
| ⚪ | SAN-830 docs | 50 | 50 | F | |
| ⚪ | SAN-831 ship PR | 0 | 0 | F | blocked |

**Sprint % correct: 68%** · Launch 8.3→9.0 needs 823–831

---

## 7. ADV Cross-Check (300 issues)

| Finding | % Correct | Note |
|---------|----------:|------|
| Tier placement (post-MVP) | 85% | Correctly deferred v2/Connect |
| Trips module duplication | 40% | 8 Urgent still in MVP |
| Platform inventory tasks Done | 90% | WIRE/data tasks accurate |
| Contest pollution | 60% | 20+ contest tasks — OK deferred |
| Partner AI SAN-800+ | 80% | Correctly Phase 2 |

**ADV avg: 72%** — tracker quality better than MVP; Trips overlap is main error

---

## 8. Production Readiness (persona)

| Persona | % Ready | Dot | Blocker |
|---------|--------:|-----|---------|
| Camila concierge | 82% | 🟡 | SAN-823 clarify |
| Tourist venues | 78% | 🟡 | SAN-827 nightlife |
| Roberto host | 90% | 🟢 | G3 evidence only |
| Andrés tickets | 45% | 🔴 | SAN-178/115 |
| Patricia admin | 30% | 🔴 | CRM/bookings |

---

## 9. Final Assessment

| Area | % Correct | Score | Grade |
|------|----------:|------:|-------|
| Core Foundation | 81% | 61 | D |
| Maps & Search | 58% | 52 | F |
| AI & Intelligence | 45% | 42 | F |
| Events | 38% | 35 | F |
| Rentals | 72% | 68 | D |
| Venues | 90% | 85 | B |
| Partners | 55% | 35 | F |
| Trips (in MVP) | 14% | 12 | F |
| UX / Concierge | 52% | 48 | F |
| Testing | 62% | 58 | F |
| Payments | 35% | 28 | F |
| Launch Readiness | 68% | 65 | D |
| **Codebase (skills)** | **88%** | **88** | **B** |

---

## 10. Improvements (top 15)

1. Regenerate trackers from disk+Linear with staleness rules in `generate.py`
2. Payments section: 8 CORE tasks from `stripe-best-practices` checklist
3. Partner CRM milestone M2–M4 (10 tasks)
4. Single P0 doc: `tasks/linear/02-views-sort.md` sync with audit
5. Auto-close tasks when disk + tests + evidence pass (task-verifier script)
6. SAN-386/387 → In Review (hybrid RPC already called)
7. Discovery epic parent: SEARCH under Maps project
8. Nightly prod-synthetic + evidence commit
9. Turn-11 memory Playwright spec for SAN-548
10. Payment prod synthetic (TEST-021)
11. Defer all AIE-016–026 to ADV in Linear labels
12. Cancel dup batch script for Linear MCP
13. `launch-readiness.md` auto-sync from mvp.md Done rows
14. Require acceptance criteria on all Urgent (gate from task-verifier)
15. Cap In Progress at 3 per `mdeai-linear.mdc`

---

## 11. Action Plan · Cycle 1

| Priority | Work | Exit |
|----------|------|------|
| P0 | SAN-178 + SAN-115 G1 | Andrés paid prod evidence |
| P0 | SAN-546 | J05–J20 PASS |
| P0 | Linear dup cleanup | 11 canceled |
| P1 | SAN-823→831 | Launch 9.0 |
| P1 | SAN-545 403 fix | Hybrid 200 |
| P1 | SAN-548 evidence | Turn-11 prod |
| P2 | Move Trips to ADV | MVP blocker list clean |
| Hygiene | core.md +payments | Regenerate markdown |

---

*Skill-verified 2026-06-08 · 179 tasks scored · Code 88% · Trackers 48% · Re-run after Linear cleanup*
