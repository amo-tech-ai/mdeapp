---
title: MIS-M1 + Mastra forensic audit
date: 2026-05-31
verifier: task-verifier protocol
verify: cd mdeapp && npm run verify:mis-phase1 && npm run smoke:golden-queries && npm run check:mastra
prior: MIS-MASTRA-AUDIT-2026-05-30.md (corrupted — replaced by this file)
---

# MIS-M1 Forensic Audit — 2026-05-31

**Executive verdict:** MIS-M1 is **production-credible for restaurant hybrid discovery**. One human gate remains (Patricia DATA-041). Phase 1b may start after editorial sign-off.

**Score:** **70/100** full MIS vision · **86/100** Phase 1 frozen scope · **MIS-M1 gate 91%**

---

## Verified probes (2026-05-31)

| Probe | Result |
|-------|--------|
| `verify:mis-phase1` | 8/8 PASS |
| `smoke:golden-queries` | PASS Relato/Sambombi |
| `check:mastra` | OK |
| Git commit SEARCH-003 | `b7265b9` — 13 files, no UX-002/005 |
| Supabase row counts | venue_signals **30**, event 49, rental 44, profiles 8, evidence 20, search_logs 8, embedding_jobs 1 |
| RLS | All MIS tables enabled + ≥1 policy |
| HNSW indexes | 3 (restaurant, listing, event) |
| Golden SQL Provenza rooftop | Relato 0.91, Sambombi 0.85 |
| CopilotKit prod agent | `conciergeAgent` only on `/` |
| Patricia DATA-041 sign-off | **NOT signed** ☐ |

---

## What is correct ✅

1. **Data plane** — VEC-001 + DATA-039–047 migrations live; hybrid RPCs callable
2. **SEARCH-003** — `search-restaurants` + `queryText` → hybrid + signals + evidence + `search_logs`
3. **Routing** — `getCopilotKitClientProps` allows only `conciergeAgent` | `hostEventAgent`; `/api/copilotkit` uses `getLocalAgentsWithLogging`
4. **Concierge instructions** — rooftop/Provenza → `search-restaurants` with `queryText`, not grounded Places
5. **LLM role** — ranks from SQL/signals; agent explains results
6. **Phase 1 frozen** — no supervisor, semantic recall, graph, LLM-as-ranker in prod path
7. **Commit hygiene** — SEARCH-003/INT-001 isolated; UX-002/005 + INT-002 remain unstaged

---

## Blockers 🔴

| # | Blocker | Owner | Action |
|---|---------|-------|--------|
| 1 | Patricia DATA-041 editorial sign-off | Patricia | Sign `tasks/data/evidence/DATA-041-venue-signals-human-qa.md` |
| 2 | UX-001 stability | Lucía | Gate before INT-004 canned-clarify removal |

---

## Red flags 🚩

| Flag | Severity | Detail |
|------|----------|--------|
| **10 anchor venue_signals without evidence** | 🟡 | `restaurant_id IS NULL`, `venue_anchor_id` set — café/nightlife seeds; not in restaurant hybrid path today |
| **INT-001 not wired to concierge** | 🟡 | `extract-intent-slots` tool exists but not in `conciergeAgent.tools` |
| **Dual routing code** | 🟡 | `routerAgent` + 3 workflows registered; not prod `/` path — document only (MASTRA-MIS-001) |
| **Rental fast-path + canned clarify** | 🟡 | `concierge-chat-input` intercepts before agent — INT-002/004 |
| **Doc drift** | 🟡 | Prior audit file duplicated progress tracker; evidence docs said 20 venue_signals (DB now 30) |
| **MASTRA-MIS-001 missing from Linear import** | 🟡 | Doc-only; add manual issue or extend import script |
| **`query_embedding_cache` table** | ⚪ | Expected absent until VEC-004 |

---

## Schema / migration / RLS

- **Migrations:** aligned with verify script (VEC-001, DATA-039–047)
- **RLS:** venue/event/rental_signals, search_logs, embedding_jobs, venue_source_evidence — all `rls_enabled=true`
- **search_logs writes:** service_role via `writeSearchLog` — correct server-only pattern
- **Evidence gap:** 20/30 venue_signals have `venue_source_evidence`; 10 anchor rows need evidence before café hybrid (Phase 1b)

---

## Mastra best-practice alignment (installed packages + mdeai patterns)

| Area | mdeai today | Mastra guidance | Verdict |
|------|-------------|-----------------|---------|
| Agents | Single prod concierge + tools | One agent per user-facing surface; tools for retrieval | ✅ |
| Tools | `createTool` + Zod schemas | Typed I/O; server-side execution | ✅ |
| Working memory | Zod schema, thread-scoped | Schema-driven WM; update rules in instructions | ✅ |
| Structured output | Zod on tools + WM | Prefer tool schemas over prose parsing | ✅ |
| Workflows | 3 registered; host HITL only prod | Workflows for multi-step; not primary chat | ✅ defer search workflows |
| HITL | `hostEventAgent` renderAndWait | Suspend/resume for approval flows | ✅ |
| Streaming | CopilotKit AG-UI Pattern 1 | Stream tool events to UI | ✅ |
| Background tasks | `embedding_jobs` queue only | Worker for embed drain (VEC-004) | ⚪ planned |
| Response caching | None | Defer embed cache + MAP-005 Places | ⚪ Phase 1b |
| Semantic recall | Not enabled | Phase 2 only | ✅ frozen |

---

## Routing audit

| Path | Prod? | Notes |
|------|-------|-------|
| `/` → `conciergeAgent` | Yes | CopilotKit provider + coAgent hooks |
| `routerAgent` | No | Mastra Studio / tests |
| `rentalSearchWorkflow` | No | Not wired to CopilotKit |
| `/api/rentals/search` fast-path | Yes | Keyword SQL; bypasses hybrid until SEARCH-001 |
| `/api/events/search` fast-path | Yes | Keyword; bypasses hybrid until SEARCH-002 |

---

## Latency / grounding / retrieval

- **Latency:** ~2.5s golden smoke (embed + RPC + log) — acceptable for Phase 1
- **Grounding:** ADK only for cafés/POIs and web events fallback — correct
- **Retrieval quality:** Restaurant hybrid strong for Provenza rooftop; rentals/events still keyword-only

---

## Linear sync status

Import script includes SEARCH-001/002/003, AI-003/004, DATA-046 in registry. SEARCH-003 in `SHIPPED` set → Done on import. **MASTRA-MIS-001** not in registry — create doc issue manually.

---

## Exact next 10 tasks

1. Patricia signs DATA-041 (20 restaurant signals + note 10 anchor rows deferred)
2. Run `node scripts/linear-import-intelligence-tasks.mjs` — mark SEARCH-003 Done; create Phase 1b issues
3. Create Linear doc issue MASTRA-MIS-001 routing canonical
4. Commit INT-002 rental parser (separate slice)
5. UX-001 verify concierge stability
6. VEC-003 embedding contract + registry
7. VEC-004 worker + `query_embedding_cache`
8. SEARCH-001 rentals hybrid
9. SEARCH-002 events hybrid
10. DATA-046 golden queries v2

---

## Recommended commit order

1. ~~SEARCH-003 + INT-001~~ ✅ `b7265b9`
2. INT-002 rental parser (no UX)
3. UX-002/005 chat error/thinking (separate PR)
4. VEC-003 migration + registry
5. VEC-004 worker
6. SEARCH-001
7. SEARCH-002

---

## Testing checklist (before MIS-M1 Done flip)

- [x] `verify:mis-phase1` 8/8
- [x] `smoke:golden-queries`
- [x] Unit: intent-slots, intelligence-restaurant, search-restaurants
- [x] `typecheck` + `check:mastra`
- [x] Browser: quiet rooftop Provenza → Relato/Sambombi + rank UI
- [ ] Patricia DATA-041 sign-off
- [ ] Linear SEARCH-003 → Done
