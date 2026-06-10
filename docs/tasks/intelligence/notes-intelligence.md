# MIS-M1 stabilization + Phase 1b prep — audit (2026-05-30)

**Verdict:** MIS-M1 is **stable on disk** (verify 8/8, golden smoke PASS, typecheck + check:mastra OK) but **not production-closed** until SEARCH-003 is committed, human QA signed, and stale docs synced. Phase 1b can start **controlled** after that gate.

**Score:** **68/100** full vision · **82/100** Phase 1 frozen scope (↑ from 62/78 after SEARCH-003 proof)

---

## 1. Executive verdict

One vertical (restaurants) proves the intelligence loop: hybrid RPC → signals → evidence → rank explanation → CopilotKit cards/pins. Architecture matches Mastra best practice for Phase 1: **single `conciergeAgent`**, tools for retrieval, working memory, no supervisor/A2A. Phase 1b prep is unblocked **after commit + QA** — not before.

## 2. Architecture audit (verified)

| Check | Result |
|-------|--------|
| `conciergeAgent` sole `/` path | ✅ `layout.tsx` → `conciergeAgent` only |
| Workflows not primary chat | ✅ `routerAgent` / workflows = Studio/tests only ([MASTRA-MIS-001](tasks/mastra/MASTRA-MIS-001-routing-canonical.md)) |
| SQL/hybrid primary | ✅ Restaurants; rentals/events still keyword |
| LLM explains only | ✅ Rank prose + short reply; cards from tools |
| ADK/Places fallback | ✅ Cafés/POIs via `search-grounded-places` |
| No Phase 2 creep | ✅ No unified venues, graph, semantic recall |
| No multi-agent misuse | ✅ No supervisor/A2A/ACP |

**Live tests (this session):** `verify:mis-phase1` 8/8 · `smoke:golden-queries` PASS · typecheck OK · `check:mastra` OK

## 3. What works 🟢

- Supabase: 30 venue_signals, 49 event_signals, 44 rental_signals, 8 profiles, 20 evidence, 8 search_logs
- SEARCH-003: Relato + Sambombi for golden query
- Rank explanation + evidence UI
- `search_logs` + `writeSearchLog` on hybrid path
- INT-001 schema + tests on disk
- Mastra platform (MASTRA-001–005) closed

## 4. Partially live 🟡

| Item | % | Blocker |
|------|---|---------|
| SEARCH-003 | 85% | Uncommitted (mixed branch `feat/ux-002-005`) |
| MIS-M1 gate | 82% | Commit + human QA |
| INT-001 | 12% | Not wired to fast-path |
| Rental/event hybrid | 0% | Phase 1b |
| `intelligence-plan.md` tracker | stale | Still says signals 0% |

## 5. Critical blockers 🔴

1. **SEARCH-003 not committed** — working tree only  
2. **DATA-041 human QA** — top 30 sign-off ([template](tasks/data/evidence/DATA-041-venue-signals-human-qa.md))  
3. **INT-004 blocked by UX-001** — do not remove canned clarify until prod concierge stable ([INT-004 spec](tasks/intelligence/tasks/INT-004-no-canned-clarify-bypass.md))  
4. **Linear** — SEARCH/AI/DATA-046 specs exist on disk but need import/sync

## 6. Red flags

- Dual routing code still exists (doc'd in MASTRA-MIS-001 — not prod, but confuses agents)
- `conciergeRoutingWorkflow` lacks `queryText` — must never wire to CK
- Branch mixes UX-002/005 + MIS work — split commit required
- **MAP-005 ≠ query_embedding_cache** (Places cache vs embed dedupe — embed cache belongs in VEC-004)

## 7. Missing tasks — **now added** ✅

| File | Purpose |
|------|---------|
| [SEARCH-003-restaurant-hybrid.md](tasks/data/tasks-data/SEARCH-003-restaurant-hybrid.md) | MIS-M1 app proof |
| [SEARCH-001-rental-hybrid.md](tasks/data/tasks-data/SEARCH-001-rental-hybrid.md) | Phase 1b |
| [SEARCH-002-event-hybrid.md](tasks/data/tasks-data/SEARCH-002-event-hybrid.md) | Phase 1b |
| [AI-003-signal-enrichment.md](tasks/data/tasks-data/AI-003-signal-enrichment.md) | Batch signals |
| [AI-004-grounding-verify.md](tasks/data/tasks-data/AI-004-grounding-verify.md) | Trust gate |
| [DATA-046-golden-queries-v2.md](tasks/data/tasks-data/DATA-046-golden-queries-v2.md) | Regression table |
| [MASTRA-MIS-001-routing-canonical.md](tasks/mastra/MASTRA-MIS-001-routing-canonical.md) | Routing doc |

**No MASTRA-006+ backlog** — correct; work stays in DATA/INT/VEC.

## 8. Linear — synced ✅ (2026-05-31)

| ID | Linear | State | Local spec |
|----|--------|-------|------------|
| SEARCH-003 | [SAN-388](https://linear.app/sanjiovani/issue/SAN-388) | Done | `tasks/data/tasks-data/SEARCH-003-restaurant-hybrid.md` |
| MASTRA-MIS-001 | [SAN-426](https://linear.app/sanjiovani/issue/SAN-426) | Done | `tasks/mastra/MASTRA-MIS-001-routing-canonical.md` |
| SEARCH-001 | [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) | intel-1b | `tasks/data/tasks-data/SEARCH-001-rental-hybrid.md` |
| SEARCH-002 | [SAN-387](https://linear.app/sanjiovani/issue/SAN-387) | intel-1b | `tasks/data/tasks-data/SEARCH-002-event-hybrid.md` |
| AI-003 | [SAN-395](https://linear.app/sanjiovani/issue/SAN-395) | intel-1b | `tasks/data/tasks-data/AI-003-signal-enrichment.md` |
| AI-004 | [SAN-396](https://linear.app/sanjiovani/issue/SAN-396) | intel-1b | `tasks/data/tasks-data/AI-004-grounding-verify.md` |
| DATA-046 | [SAN-384](https://linear.app/sanjiovani/issue/SAN-384) | intel-1b | `tasks/data/tasks-data/DATA-046-golden-queries-v2.md` |

**Index:** [`tasks/mastra/MIS-TASKS-INDEX.md`](tasks/mastra/MIS-TASKS-INDEX.md) · Resync: `node scripts/linear-import-intelligence-tasks.mjs`

---

## 9–13. Journey map (retrieval / gaps)

| Journey | Current path | Missing | CK UX |
|---------|--------------|---------|-------|
| Quiet rooftop Provenza | `search-restaurants` hybrid ✅ | commit | rank UI ✅ |
| Digital nomad rental Laureles | fast-path keyword | SEARCH-001, INT-002 | rental cards OK |
| Salsa this weekend | `search-events` + web fallback | SEARCH-002, signals | event cards OK |
| Coworking café Wi-Fi | `search-grounded-places` | venue_anchors hybrid (1b) | CafeResultCard |
| Romantic rooftop cocktails | hybrid if `queryText` | same as S01 | evidence partial |
| Poblado vs Laureles | concierge prose | neighborhood_profiles UI chips | no compare card |
| Hidden local restaurants | hybrid hidden_gem | more signal rows | evidence |
| Gym + café + nightlife | sequential tools / grounded | no gym vertical | no itinerary workflow |

**Latency:** embed call on hybrid (~2.5s logged) — **defer** response caching until VEC-004 `query_embedding_cache`.

---

## 14–15. Defer vs add now

| Feature | Now | Defer |
|---------|-----|-------|
| Commit SEARCH-003 | ✅ | — |
| Human QA venue_signals | ✅ | — |
| INT-002 parser | ✅ after commit | — |
| INT-004 canned clarify | ⚠️ after UX-001 | — |
| VEC-003/004 | Phase 1b start | — |
| Response / embed cache | — | VEC-004 |
| save-to-trip tool | — | Phase 2 |
| Click analytics | — | INT-022 / Phase 2 |
| Semantic recall | — | Phase 2 |
| Workflows for chat | — | INT-008+ |
| Scheduled jobs | — | VEC-004 + AI-003 batch |

---

## 16. Exact next 10 implementation tasks

1. **Surgical commit** SEARCH-003 + INT-001 (exclude UX-002/005 unless same slice)  
2. **Patricia QA** — fill [DATA-041 human QA sheet](tasks/data/evidence/DATA-041-venue-signals-human-qa.md)  
3. **Refresh** `MIS-M1-2026-06-01.md` browser section + mark MIS-M1 mostly-live  
4. **Linear import** new SEARCH/AI/DATA-046 IDs  
5. **INT-002** — rental parser dates/city/confidence bands  
6. **Verify UX-001** status — then INT-004 (not before)  
7. **VEC-003** — embedding contract doc + registry  
8. **VEC-004** — worker + `query_embedding_cache` migration  
9. **SEARCH-001** — rental hybrid (mirror SEARCH-003)  
10. **DATA-046** — expand golden-queries-smoke to 10 rows  

---

## 17. Execution order

```text
NOW:     commit SEARCH-003 → human QA → MIS-M1 Done
CORE:    INT-002 → (UX-001 green) → INT-004 → INT-005
PHASE1b: VEC-003 → VEC-004 → SEARCH-001 → SEARCH-002 → AI-004 → AI-003 → DATA-046 → VEC-005
PARALLEL: MAP-005 Places cache (cost) — not embed cache
```

---

## 18. Defer until Phase 2

Semantic recall · observational memory · save-to-trip · click stream · supervisor/A2A · unified venues · relationship graph · itinerary workflows · fake booking · LLM-as-ranker

---

## Your question: “Is adding spec files correct?”

**Yes.** That was the real gap — plans had SEARCH/AI rows but no executable specs. Created under `tasks/data/tasks-data/` (not `tasks/mastra/`) to avoid split brain. **MASTRA-MIS-001** is the only mastra-folder addition — doc-only routing canonical.

**Next action I’d take:** split and commit SEARCH-003 slice, then Patricia QA. Want me to implement INT-002 parser bands next, or prep the commit message / file list for SEARCH-003 only?