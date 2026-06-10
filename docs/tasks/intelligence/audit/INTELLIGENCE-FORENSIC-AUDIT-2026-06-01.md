---
title: Intelligence workstream — forensic audit & live status tracker
date: 2026-06-01
auditor: claude (senior software specialist / forensic auditor)
project: zkwcbyxiwklihegjhuql (Supabase live) + mdeapp (github.com/amo-tech-ai/mdeapp)
method: live DATA forensic audit (2026-06-01) + git archaeology on main (7a5c91e) + src/ code probes + cross-ref of plan docs
docs_under_audit: tasks/data/plan/data-intelligence-plan.md (V1) · tasks/intelligence/intelligence-plan.md · tasks/intelligence/tasks/INDEX.md · 00-program-report.md · AUDIT-2026-05-31.md · tasks/venues/data/venue-dataplan.md
constraints: read-only — no live mutation, no migration, no merge; reconcile claims vs live truth only
companions: ../../data/audit/DATA-FORENSIC-AUDIT-2026-06-01.md · ../../ux/audit/UX-FORENSIC-AUDIT-2026-06-01.md
---

# INTELLIGENCE forensic audit — live 2026-06-01

**Process:** 1·Examine → 2·Verify (live Supabase + git on real SHAs) → 3·Validate (exact counts, files in main's tree) → 4·Measure (% per layer/task) → 5·Identify (stale docs / red flags / fixes).

**Status legend:** 🟢 Live / shipped to main · 🟡 In progress / partial · 🟥 Blocked / failing · ⚪ Not started.

---

## 0. Executive verdict

> **The intelligence program is ~60–65% through Phase 1 — but its own tracking docs report it as ~0% started.** This is the headline: both the data plan's "Live inventory" table (signals = ❌) and the INT task index (all 22 = "Not Started") are **stale planning snapshots** that badly *understate* a system that is, in fact, deployed and serving search.
>
> **Three layers, three different truths:**
> - **Layer A — data-intelligence satellites: 🟢 LIVE.** `venue_signals` 30 · `event_signals` 49 · `rental_signals` 44, embeddings ~95%, 6 hybrid/semantic RPCs, `embedding_jobs` queue, one HNSW per table. The "moat" the plan is built around is **deployed** (verified live 2026-06-01).
> - **Layer B — agent INT program (INT-001…022): 🟡 CORE + most MVP shipped on `main`.** Intent slots, rental parser, clarify routing, fast-path memory, café/event/restaurant wrappers, and a real regression suite are all in main's tree with tests. Only POST-MVP/ADVANCED (user_preferences, pgvector memory, cross-domain personalization) is genuinely ⚪.
> - **Layer C — app wiring (SEARCH-001/002/003): 🟡 one of three.** Restaurants wired + live; rentals + events RPCs **live but not wired**.
>
> **The biggest risk here is documentation, not code:** anyone reading `tasks/intelligence/tasks/INDEX.md` would conclude the agent program hasn't begun, when CORE is effectively done on `main`.

| Dimension | Live verdict | Evidence |
|---|---|---|
| Data satellites (signals/embeddings/jobs/RPCs) | 🟢 **Live** | §1a, [DATA audit](../../data/audit/DATA-FORENSIC-AUDIT-2026-06-01.md) |
| INT CORE (001–005) | 🟢 **Shipped to main** — slots, parser, clarify, no-canned-bypass, tests | §1b, §6 |
| INT MVP (006–010, 021) | 🟡 **Mostly shipped** — fast-paths + wrappers + working memory live | §1b |
| INT POST-MVP + ADVANCED (011–020) | ⚪ **Not started** (correctly deferred — needs auth + user tables + VEC) | §1b |
| App wiring SEARCH | 🟡 **1/3** — restaurants wired; rentals/events RPCs live, unwired | §1c |
| Evidence / grounding for events + rentals | 🟥 **Empty** — `event_grounding` 0, `rental_grounding` 0; 3 evidence tables absent | §3-R2 |
| `data-intelligence-plan.md` inventory accuracy | **Stale** — signals shown ❌ (are live), counts off | §4-C1/C2/C3 |
| `tasks/intelligence/tasks/INDEX.md` accuracy | **Stale** — 22/22 "Not Started" contradicts main | §4-C4 |
| Plan-quality (MIS audit 2026-05-31) | 72% → ~88% post-fix — **doc hygiene**, not broken code | §3-R4 |

**Headline number: the program is ~60–65% through Phase 1; the trackers say 0%. The code is ahead of the paperwork by an entire phase.**

---

## 1. Live tracker (three layers)

### 1a. Layer A — Data-intelligence satellites (the moat)

Exact `count(*)` verified live 2026-06-01 (see [DATA audit](../../data/audit/DATA-FORENSIC-AUDIT-2026-06-01.md) §2).

| Object | Status | % | ✅ Confirmed (live) | ⚠️ Gap | 💡 Next |
|---|---|---|---|---|---|
| `venue_signals` (DATA-041) | 🟢 | 100% | **30** rows | Human QA top-30 off-DB | Close DATA-041 QA |
| `event_signals` (DATA-042) | 🟢 | 100% | **49** rows | — | None |
| `rental_signals` (DATA-043) | 🟢 | 100% | **44** rows | — | None |
| `neighborhood_profiles` (DATA-044) | 🟢 | 62% | **8** of 13 hoods | 5 unprofiled | Low priority |
| Embeddings + HNSW (VEC-001) | 🟢 | ~95% | apt 44/44 · rest 43/44 · evt 43/49; **1 HNSW/table** | 7 stragglers | Re-embed 7 |
| `embedding_jobs` queue (DATA-040) | 🟢 | 100% (infra) | Table + 3 enqueue triggers live | Queue **idle (1 row)** — loop unproven | Prove trigger→queue→worker |
| Search RPCs | 🟢 | 100% | `hybrid_search_*` + `semantic_search_*` ×3, `search_path=''` | — | None |
| Evidence / grounding (DATA-045) | 🟡 | ~45% | `venue_source_evidence` **20** | `event_grounding` **0**, `rental_grounding` **0**; 3 tables absent | AI-004 seed (R2) |

### 1b. Layer B — Agent INT program (INT-001…022)

Status = **verified in main's tree (`7a5c91e`)**, not the INDEX's "Not Started". File counts exclude `__tests__`.

| ID | Title | Phase | Status | % | ✅ Confirmed on main | 💡 Note |
|---|---|---|---|---|---|---|
| INT-001 | Shared intent + slot schema | CORE | 🟢 | 100% | `extract-intent-slots.ts` + `intent-slots.test.ts` + `search-intent-router.test.ts` | Shipped |
| INT-002 | Rental parser monthly/date/city | CORE | 🟢 | 100% | rental fast-path (3 files) + `rental-search-fast-path.test.ts`; "$500 a night" = UX-003 | Shipped |
| INT-003 | Gemini smart clarify routing | CORE | 🟢 | ~90% | `shouldInstantEventClarify` / clarify logic (2 files) | Shipped |
| INT-004 | No canned clarify bypass | CORE | 🟢 | ~90% | clarify-bypass logic present | Shipped |
| INT-005 | Intelligence regression tests | CORE | 🟢 | 100% | 6+ suites: intent-slots, event/rental/restaurant fast-path, concierge, intelligence-restaurant-search, search-intent-router | Real coverage |
| INT-006 | Rental availability date filters | MVP | 🟡 | ~80% | rental fast-path handles date/nightly/monthly | Confirm `available_from/to` filter |
| INT-007 | Event intelligence wrapper | MVP | 🟢 | 100% | event fast-path (2 files); MIS audit: "already shipped" | Shipped |
| INT-008 | Café intelligence wrapper | MVP | 🟢 | ~90% | `adk-grounding-client.ts` + grounding tests; `search-grounded-places` | Café via ADK grounding |
| INT-009 | CopilotKit readable UI state | MVP | 🟡 | ~70% | `useCoAgent` + `concierge-coagent-context` wired | Confirm `useCopilotReadable` surface |
| INT-010 | Working-memory schema update | MVP | 🟢 | 100% | `ConciergeWorkingMemory` in **12** src files + `lastIntent` on main | Shipped |
| INT-021 | Restaurant & venue wrapper | MVP | 🟢 | 100% | restaurant fast-path (2 files) + `intelligence-restaurant-search.test.ts` | Shipped (= SEARCH-003) |
| INT-022 | Routing & confidence telemetry | MVP | ⚪ | 0–20% | confidence bands exist in router | Telemetry/instrumentation not built |
| INT-011 | `user_preferences` schema + RLS | POST-MVP | ⚪ | 0% | — | Needs auth; table absent live |
| INT-012 | `user_interactions` schema | POST-MVP | ⚪ | 0% | — | Same |
| INT-013 | Retrieve prefs before search | POST-MVP | ⚪ | 0% | — | Depends 011/012 |
| INT-014 | Ranking boost from memory | POST-MVP | ⚪ | 0% | — | Depends 013 |
| INT-015 | Memory evidence tests | POST-MVP | ⚪ | 0% | — | Depends 013/014 |
| INT-016 | pgvector semantic memory | ADV | ⚪ | 0% | — | Needs VEC + 011 |
| INT-017 | Gemini embeddings for memory | ADV | ⚪ | 0% | — | Needs 016 |
| INT-018 | Cross-domain personalization | ADV | ⚪ | 0% | — | Needs 016 + signals |
| INT-019 | Memory settings UI | ADV | ⚪ | 0% | — | Needs 011/016 |
| INT-020 | Observational memory learning | ADV | ⚪ | 0% | — | Needs 012/016 |

**Layer B rollup:** CORE **5/5 shipped** · MVP **~5.5/6 shipped** (009 partial, 022 not built) · POST-MVP+ADVANCED **0/10** (correctly deferred — all gated on auth + user-data tables + VEC pgvector memory).

### 1c. Layer C — App wiring (SEARCH)

| Task | Status | % | ✅ Confirmed | 💡 Next |
|---|---|---|---|---|
| SEARCH-003 restaurants | 🟢 | 100% | `hybrid_search_restaurants` is the **only** RPC called from `src/mastra/**` on main | Patricia QA |
| SEARCH-001 rentals | ⚪ | 0% (app) | `hybrid_search_listings` RPC **live**, not called from app | Wire to existing RPC (cheap) |
| SEARCH-002 events | ⚪ | 0% (app) | `hybrid_search_events` RPC **live**, not called from app | Wire to existing RPC (cheap) |

---

## 2. Live inventory (what is actually deployed/merged)

| Layer | Live state (2026-06-01) |
|---|---|
| **Signals** | venue 30 · event 49 · rental 44 · neighborhood_profiles 8/13 |
| **Embeddings** | listing 44 (100%) · restaurant 43 (98%) · event 43 (88%); 1 HNSW each |
| **Queue** | `embedding_jobs` 1 (idle) + 3 enqueue triggers |
| **RPCs** | `hybrid_search_{events,listings,restaurants}` + `semantic_search_{…}` — 6/6 live |
| **Evidence** | venue 20 · event_grounding 0 · rental_grounding 0; 3 tables absent |
| **INT on main** | slots, rental/event/restaurant fast-paths, clarify routing, working memory (12 files), 6+ test suites |
| **SEARCH wired** | restaurants only (1 of 3 RPCs called from app) |
| **Catalogs** | apartments 44 · events 49 · restaurants 44 · venue_anchors 30 · neighborhoods **13** |

---

## 3. Red flags / blockers / fixes

**R1 — Tracking docs understate the program by a full phase (🟡 high — the real problem).** `tasks/intelligence/tasks/INDEX.md` marks **all 22 INT tasks "Not Started"**; `00-program-report.md` says "Total INT 20 · Not Started"; `data-intelligence-plan.md`'s Live inventory shows **signals = ❌** for all three domains. All three contradict live state (CORE shipped, signals live). *Risk:* planning decisions made against a 0%-started picture; duplicate work; mis-prioritized PRs. *Fix:* refresh the INDEX status column + the plan's inventory table (see §4).

**R2 — Evidence/grounding is venue-only (🟥 blocker for grounded events/rentals).** `event_grounding` + `rental_grounding` exist but are **empty**; `venue_grounding`, `event_source_evidence`, `rental_source_evidence` **don't exist**. So when the concierge answers Roberto's event or Camila's rental queries, there are **no provenance rows** — only venue/restaurant claims can cite a source. *Fix:* pick one canonical evidence shape, seed via AI-004 (DATA-045 fix). Not MVP-blocking for search ranking; blocking for "show the source" honesty.

**R3 — Embed loop unproven end-to-end (🟡 medium).** 130 catalog rows are embedded but `embedding_jobs` holds **1 idle row** → backfill was done out-of-band, the trigger→queue→worker loop was never watched. *Risk:* a new listing/event may never auto-embed. *Fix:* one INSERT → confirm a job enqueues and drains.

**R4 — Plan-quality debt from MIS audit 2026-05-31 (🟡 low, partly fixed).** That audit (72%→~88%) flagged **doc hygiene**, not code: ID collisions (`MAP-013/014` reuse archived Done IDs → rename `MAP-035/036`), fictional refs (`EVT-021`, `TRIP-INT-001`, `VEN-020`-as-nightlife), and the two plans disagreeing on `DATA-040`'s meaning. The disagreement is **resolved in reality** — `DATA-040 = embedding_jobs` is what's live. Remaining: registry-only DATA-041…046 still lack standalone spec files; ID renames not all propagated. *Fix:* propagate v1.1 ID map; spawn the missing spec files.

**R5 — INT-022 telemetry + INT-009 readable-state are the MVP tail (🟡 low).** Confidence bands (0.85/0.50) exist in the router but have **no instrumentation** (INT-022); CK `useCoAgent` is wired but the `useCopilotReadable` surface (INT-009) needs confirmation. *Fix:* small, after SEARCH wiring.

**R6 — POST-MVP memory layer correctly gated (🟢 informational).** INT-011…020 (user_preferences, user_interactions, pgvector semantic memory, cross-domain personalization) are ⚪ and **should be** — they need auth, user-data tables, and VEC pgvector work that isn't Phase-1. No action.

---

## 4. Forensic corrections — docs vs live

| # | Doc claim | Live reality (2026-06-01) | Verdict |
|---|---|---|---|
| C1 | `data-intelligence-plan.md` Live inventory: Signals = **❌** (rentals/events/restaurants) | `venue_signals` 30 · `event_signals` 49 · `rental_signals` 44 — **all live** | **Stale → 🟢 live** |
| C2 | `data-intelligence-plan.md`: neighborhoods **12** | **13** live | **Off-by-one** |
| C3 | `data-intelligence-plan.md`: restaurants **43** | **44** rows (43 = *embedding* count) | **Conflated count → corrected** |
| C4 | `tasks/intelligence/tasks/INDEX.md`: all 22 INT = **"Not Started"** | CORE 5/5 + most MVP **shipped on main** with tests | **Stale → 🟢/🟡 majority shipped** |
| C5 | `00-program-report.md`: "Total INT 20 · Not Started · Planning complete" | Execution underway; CORE done | **Stale (planning-era snapshot)** |
| C6 | `AUDIT-2026-05-31.md` probes: neighborhoods **12**, restaurants 44/embed 43 | restaurants 44/embed 43 ✔; neighborhoods now **13** | **Mostly correct; 1 newer drift** |
| C7 | `AUDIT-2026-05-31.md`: `DATA-040` meaning disputed across plans | Live = `embedding_jobs` (MIS order won) | **Resolved in reality** |
| C8 | MIS plan refs `MAP-013/014`, `EVT-021`, `TRIP-INT-001` | Collide with archived Done / don't exist → `MAP-035/036`, `EVP-036`, `DATA-028` | **Doc fix pending** |

---

## 5. Next steps — focus on core MVP

**Do now (cheap, high-leverage):**
1. **Refresh the trackers (R1):** flip `INDEX.md` INT status column to reality (CORE 🟢, MVP mostly 🟢); update `data-intelligence-plan.md` Live inventory (signals live, neighborhoods 13, restaurants 44). Stops the program from looking 0%-started.
2. **Wire SEARCH-001 (rentals) + SEARCH-002 (events)** to the **already-live** RPCs — app glue, the DB half is done.

**Do next (correctness / honesty):**
3. **Seed event + rental grounding (R2):** decide canonical evidence shape, run AI-004 — so the concierge can cite sources for Roberto's events and Camila's rentals, not just venues.
4. **Prove the embed loop (R3):** one INSERT → job → worker drains.

**Do later (MVP tail + deferred):**
5. **INT-009 readable-state confirm + INT-022 telemetry (R5).**
6. **Propagate MIS v1.1 ID map + spawn DATA-041…046 spec files (R4/C8).**
7. **POST-MVP memory (INT-011…020)** stays deferred until auth + user tables land.

---

## 6. Verification appendix (commands run 2026-06-01, read-only)

| Check | Command | Result |
|---|---|---|
| INT-001 slots on main | `git show 7a5c91e:src/mastra/tools/extract-intent-slots.ts` | exists |
| INT working memory | `git grep -l ConciergeWorkingMemory 7a5c91e -- src/` | 12 src files |
| INT-005 tests | `git ls-tree -r 7a5c91e e2e/ + src/**/__tests__` | intent-slots, event/rental/restaurant fast-path, concierge, search-intent-router suites |
| SEARCH wiring | `git grep -oh "hybrid_search_*" 7a5c91e -- src/mastra/` | **only** `hybrid_search_restaurants` |
| Signals live | DATA audit MCP `count(*)` 2026-06-01 | venue 30 · event 49 · rental 44 |
| Grounding live | DATA audit MCP | event_grounding 0 · rental_grounding 0 |
| Neighborhoods | DATA audit MCP | 13 |

**Scope of this pass:** code/tree + live-DB reconciliation. Did **not** boot the dev server or run the INT test suites this session — "shipped on main" = merged code + tests present, not a fresh green run. A runtime/test-run confirmation is the gate before flipping any INT task to a hard "Done".

---

## 7. Linear sync log

**Executed 2026-06-01** against the **intelligence** view (`project:MDEAPP label:track:intelligence`, INT-001…022 ↔ SAN-404…425). All status changes verified against `main` (mdeapp `7a5c91e`) before writing; one evidence comment posted per touched issue. No INT task flipped to Done (Done-gate: needs a captured runtime/test-run).

**Correction — Linear was *less* stale than the markdown INDEX.** The `tasks/intelligence/tasks/INDEX.md` table marks all INT "Not Started," but the Linear view had already advanced several: **INT-001 (SAN-404) + INT-002 (SAN-405) → In Review**, **SEARCH-001/002/003 (SAN-386/387/388) → In Review**, **DATA-042/043/044/047 + MASTRA-MIS-001 → Done**, **VEC-003/004 + AI-004 + DATA-041/045 → In Progress/Review**. Those were left as-is (already accurate; SEARCH-001/002 wiring is committed off-`main` at `ee175e1`, so In Review is defensible).

**9 issues corrected from Backlog** (all were demonstrably on `main`):

| Issue | INT | → State | Evidence / caveat posted |
|---|---|---|---|
| SAN-406 | INT-003 neighborhood clarify | **In Review** | rental-clarify-copy/query-parser/fast-path + concierge.ts; ⛓️ deploy-gate caveat (routes to conciergeAgent, prod `RUN_ERROR`, gated by UX-001/002) |
| SAN-407 | INT-004 remove canned bypass | **In Review** | rental-query-parser `shouldInstantRentalClarify`; ⛓️ same deploy-gate caveat |
| SAN-408 | INT-005 regression suite | **In Review** | 6 Vitest suites; prod Playwright spec not on `main` |
| SAN-409 | INT-006 rental date filters | **In Progress** | budget parsing ✅; ⚠️ date-overlap SQL filter **not on `main`** |
| SAN-410 | INT-007 event fast-path | **In Review** | use-event-search-fast-path + `shouldInstantEventClarify` |
| SAN-411 | INT-008 café wrapper | **In Review** | `cafe_search` + grounded-places cafe-fallback test + grounding plumbing |
| SAN-412 | INT-009 readable map state | **In Progress** | map-ui-sync ✅; ⚠️ `useCopilotReadable` map mirror only in host-event bridge, not concierge path |
| SAN-413 | INT-010 working-memory sync | **In Review** | schema wired; ⚠️ **verified-open bug** — `genericAskPending` missing from Zod `lastRentalQuery` (drift acceptance unmet) |
| SAN-424 | INT-021 restaurant+venue | **In Progress** | restaurant ✅ (+`hybrid_search_restaurants`); ⚠️ `venue_search` half **not on `main`** (initially set In Review, corrected down after verifying) |

**Left at Backlog (accurate):** INT-011…020 (SAN-414…423, POST-MVP + ADVANCED), INT-022 (SAN-425), DATA-046, SEARCH-004…007, AI-001…020.

**Net:** 7 → In Review, 2 → In Progress, 11 comments (9 new + 1 update on INT-003 + the INT-021 down-correction). Four open issues surfaced rather than hidden: INT-006 date filter, INT-009 readable mirror, INT-010 Zod drift, INT-021 venue half — plus the cross-cutting conciergeAgent prod-health gate on INT-003/004.

---

*Companion to [DATA-FORENSIC-AUDIT-2026-06-01.md](../../data/audit/DATA-FORENSIC-AUDIT-2026-06-01.md) and [UX-FORENSIC-AUDIT-2026-06-01.md](../../ux/audit/UX-FORENSIC-AUDIT-2026-06-01.md). Same method, same legend. No code/DB/migration/merge mutation. The only shared-state writes were the Linear status sync recorded in §7 (9 issue states + evidence comments), each verified against `main 7a5c91e` first.*
