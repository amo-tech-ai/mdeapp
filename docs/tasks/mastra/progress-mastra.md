---
title: Mastra + MIS progress tracker
updated: 2026-05-30
audit: tasks/mastra/audit/MIS-MASTRA-AUDIT-2026-05-30.md
verify: cd mdeapp && npm run verify:mis-phase1 && npm run smoke:golden-queries && npm run check:mastra
---

# Mastra × Medellín Intelligence — Progress Task Tracker

**Executive score:** **70 / 100** (full vision) · **85 / 100** (Phase 1 scope) · **Re-audit:** 2026-05-30  
**Task specs added:** SEARCH-001/002/003, AI-003/004, DATA-046 · [`MASTRA-MIS-001`](./MASTRA-MIS-001-routing-canonical.md)

Legend: 🟢 complete · 🟡 in progress · 🔴 failed / blocker · ⚪ not started

---

## Layer summary

| Layer | % | Dot | Proof |
|-------|--:|-----|-------|
| Supabase data plane (MIS Phase 1) | 95% | 🟢 | MCP: **30** venue_signals (20 restaurant + 10 anchor), 49 event, 44 rental, 8 profiles, 20 evidence |
| Mastra agents (structure) | 72% | 🟡 | 7 agents registered; `conciergeAgent` = prod path |
| Mastra tools | 72% | 🟡 | Hybrid restaurants; rentals/events keyword |
| Mastra workflows | 35% | 🟡 | 3 workflows exist; **not** primary `/` chat path |
| Working memory | 55% | 🟡 | concierge Zod WM live; no semantic recall |
| Hybrid retrieval (app) | 75% | 🟡 | SEARCH-003 live + smoke ✅; SEARCH-001/002 ⚪ |
| CopilotKit UX | 72% | 🟡 | Cards, pins, rank-explanation (restaurants) |
| INT program (001–022) | 12% | 🟡 | INT-001 on disk; INT-002 parser WIP |
| Phase 1b blockers | 0% | ⚪ | VEC-003/004, embedding cache, cafe anchors |

---

## Phase 1 FROZEN (MIS-M1 gate)

| ID | Task | % | Dot | Verify |
|----|------|--:|-----|--------|
| VEC-001 | Drop duplicate HNSW | 100% | 🟢 | verify:mis-phase1 ✅ |
| DATA-039 | restaurants.neighborhood patch | 100% | 🟢 | 43/43 active w/ neighborhood |
| DATA-040 | embedding_jobs queue | 100% | 🟢 | table readable |
| DATA-041 | venue_signals + seed | 100% | 🟢 | **30** rows (20 restaurant w/ evidence; 10 anchor Phase 1b) |
| DATA-042 | event_signals | 100% | 🟢 | 49 rows |
| DATA-043 | rental_signals | 100% | 🟢 | 44 rows |
| DATA-044 | neighborhood_profiles + Astorga | 100% | 🟢 | 8 profiles |
| DATA-045 | venue_source_evidence | 100% | 🟢 | 20 rows |
| DATA-047 | search_logs | 95% | 🟢 | hybrid writes verified |
| SEARCH-003 | hybrid restaurants + signals | 100% | 🟢 | commit `b7265b9` + smoke ✅ |
| MIS-M1 browser gate | Golden query UI | 90% | 🟢 | Relato/Sambombi + rank UI @ :3001 ✅ |
| Human QA venue_signals | Editorial sign-off | 50% | 🟡 | Sheet filled; Patricia ☐ |

**MIS-M1 overall:** **~91%** — Patricia editorial sign-off only blocker.

---

## Red flags / attention (2026-05-31)

| Item | Severity | Action |
|------|----------|--------|
| Patricia DATA-041 not signed | 🔴 | Editorial gate |
| 10 anchor venue_signals without evidence | 🟡 | Phase 1b café hybrid + AI-004 |
| INT-001 tool not wired to concierge | 🟡 | Wire or defer to INT-003 |
| Dual routing (router/workflow) | 🟡 | MASTRA-MIS-001 doc |
| Rental canned clarify fast-path | 🟡 | INT-002 commit → UX-001 → INT-004 |
| UX-002/005 on same branch unstaged | 🟡 | Separate PR |
| `query_embedding_cache` missing | ⚪ | VEC-004 |

---

## Exact next 10 tasks

| # | Task | Owner | Verify |
|---|------|-------|--------|
| 1 | Patricia DATA-041 sign-off | Patricia | QA sheet signed |
| 2 | Linear sync SEARCH-003 Done + Phase 1b issues | Sofía | import script |
| 3 | MASTRA-MIS-001 Linear doc issue | Sofía | manual create |
| 4 | Commit INT-002 rental parser | Sofía | separate slice |
| 5 | UX-001 concierge stability | Lucía | browser rental hero |
| 6 | VEC-003 embedding contract | Supabase | registry migration |
| 7 | VEC-004 worker + cache | Mastra | queue drain |
| 8 | SEARCH-001 rentals hybrid | Mastra | nomad Laureles query |
| 9 | SEARCH-002 events hybrid | Mastra | salsa weekend |
| 10 | DATA-046 golden queries v2 | Testing | 8 journeys CI |

---

## Phase 1b (after MIS-M1)

| ID | Task | % | Dot | Blocked by |
|----|------|--:|-----|------------|
| VEC-003 | Embedding model registry | 0% | ⚪ | MIS-M1 commit |
| VEC-004 | Embedding worker | 0% | ⚪ | VEC-003 |
| SEARCH-001 | Rentals hybrid + rental_signals | 0% | ⚪ | VEC-004, DATA-043 |
| SEARCH-002 | Events hybrid + event_signals | 0% | ⚪ | VEC-004, DATA-042 |
| AI-004 | Grounding verification pipeline | 0% | ⚪ | DATA-045 |
| AI-003 | Signal enrichment batch | 0% | ⚪ | VEC-004 |
| DATA-046 | Golden queries v2 | 0% | ⚪ | SEARCH-003 stable |
| VEC-005 | Semantic eval harness | 0% | ⚪ | DATA-046 |
| MAP-005 | Places proxy cache (not embed cache) | 0% | ⚪ | [`tasks/maps/MAP-005`](../maps/MAP-005-places-proxy-cache.md) |
| query_embedding_cache | Embed dedupe table | 0% | ⚪ | VEC-004 worker scope |
| venue_anchors cafe/nightlife retrieval | Anchor search tools | 0% | ⚪ | DATA-041 patterns |

---

## Mastra runtime inventory (`mdeapp/src/mastra/`)

| Component | Role | Prod? | Dot |
|-----------|------|-------|-----|
| `conciergeAgent` | Default `/` chat — tools + WM | Yes | 🟢 |
| `routerAgent` | classify + dispatch workflows | No (unused on `/`) | 🟡 |
| `rentalAgent` / `eventAgent` | Specialist prose (partial) | Rare | 🟡 |
| `hostEventAgent` | Roberto HITL wizard | `/host/event/new` | 🟢 |
| `pingAgent` | Wiring smoke | Dev only | 🟢 |
| `evaluationAgent` | Dev eval | Dev only | 🟢 |
| `rentalSearchWorkflow` | Search → format → rerank | Via router only | 🟡 |
| `eventDiscoveryWorkflow` | Event search pipeline | Via router only | 🟡 |
| `conciergeRoutingWorkflow` | Deterministic classify/dispatch | Not wired to CK | 🟡 |
| `LoggingMastraAgent` | ai_runs per turn | Yes | 🟢 |
| `createThreadMemory` | WM helper | concierge | 🟢 |
| `extract-intent-slots` | INT-001 tool | Not wired | 🟡 |

---

## INT program (22 specs)

| Phase | IDs | % | Dot |
|-------|-----|--:|-----|
| CORE | INT-001…005 | 12% | 🟡 INT-001 schema+tests; 002–005 ⚪ |
| MVP | INT-006…010, 021, 022 | 0% | ⚪ |
| POST-MVP | INT-011…015 | 0% | ⚪ |
| ADVANCED | INT-016…020 | 0% | ⚪ |

---

## Mastra features — use now vs defer

| Feature | Now | Defer |
|---------|-----|-------|
| Agent + tools (createTool) | ✅ All vertical search | — |
| Working memory (Zod, thread) | ✅ conciergeAgent | cross-user prefs |
| Structured output (Zod tools) | ✅ classify-intent, extract-intent-slots | wire to fast-path |
| Input processors | ✅ getDefaultInputProcessors | — |
| Tool streaming / AG-UI | ✅ CopilotKit Pattern 1 | — |
| Workflows (multi-step) | ⚠️ host event only for HITL | itinerary orchestration |
| Semantic recall | — | Phase 2 + VEC user memory |
| Observational memory | — | INT-020 |
| Response caching | — | MAP-005 + embed cache |
| Background tasks | — | VEC-004 worker, AI-003 |
| Agent approval / suspend | ✅ hostEventAgent HITL | not for search |
| Supervisor / A2A / ACP | — | **Do not add** |
| Scheduled workflows | — | signal refresh cron |

---

## Verification commands (2026-05-31)

```bash
cd mdeapp
npm run verify:mis-phase1      # 8/8 ✅
npm run smoke:golden-queries   # Relato/Sambombi ✅
npm run test -- intent-slots intelligence-restaurant search-restaurants  # 18/18 ✅
npm run typecheck              # ✅
npm run check:mastra           # agent registration
```
