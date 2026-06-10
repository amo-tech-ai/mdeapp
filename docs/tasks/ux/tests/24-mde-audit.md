---
title: PR stack forensic audit — #17 · #18 · #19 · #20
date: 2026-05-31
auditor: cursor (forensic + localhost + MCP)
environment: localhost:3001 + production https://www.mdeai.co/
skills: copilotkit-integrations, mastra, mde-supabase, task-verifier, testing (per index-skills.md)
mcp: Supabase MCP (row counts) · Cursor browser MCP · Chrome DevTools MCP (session blocked — profile lock)
refs:
  - https://github.com/amo-tech-ai/mdeapp/pull/17
  - https://github.com/amo-tech-ai/mdeapp/pull/18
  - https://github.com/amo-tech-ai/mdeapp/pull/19
  - https://github.com/amo-tech-ai/mdeapp/pull/20
  - tasks/ux/tests/12-PR-17-UX-AUDIT.md
  - tasks/ux/tests/21-audit.md
---

# PR stack forensic audit — #17 · #18 · #19 · #20

## Top summary — percent correct & fix order

| PR | Branch | State | % correct | | Merge | Blocker |
|----|--------|-------|----------:|:-:|-------|---------|
| **#17** UX-002/005 | `feat/ux-002-005-chat` | OPEN | **82%** | 🟡 | After P0 fixes pushed | Remote missing error bridge; unpushed local fixes exist |
| **#18** SEARCH-003/INT-001 | `feat/search-003-restaurants` → **main** | **MERGED** | **71%** | 🟡 | Shipped | Agent-path cards silent (`writer.custom`); café data unwired |
| **#19** MIS hybrid | `feat/mis-rental-event-search` | OPEN | **74%** | 🟡 | After rebase on **main** | **MERGE CONFLICT**; base branch stale |
| **#20** VEC cache | `feat/vec-embedding-cache` | OPEN **DEFERRED** | **88%** (code) / **0%** (ship) | 🟡 | **Do not merge** | DATA-042 corpus + MIS-M2 gate |
| **Stack overall** | main + open PRs | — | **68%** | 🟡 | — | Café vertical broken on prod; merge chain blocked |

**Legend:** 🟢 85–100 · 🟡 50–84 · 🔴 &lt;50

### Fix in correct order (cross-PR)

| # | Priority | Fix | PR / surface | Verify |
|---|----------|-----|--------------|--------|
| 1 | **P0** | Wire `venue_anchors` (17 cafés) into café fallback / fast-path | New slice on **main** (DATA-035) | “specialty coffee Laureles” → Rituales/Pergamino cards on [mdeai.co](https://www.mdeai.co/) |
| 2 | **P0** | Emit agent tool cards without `context.writer` (AGUI `useCopilotAction` / tool render path) | **main** + #19 | “quiet rooftop Provenza dinner” → restaurant cards, not empty state |
| 3 | **P0** | Push PR **#17** local commits: `ConciergeAgentErrorBridge`, `onSend` try/catch, B-09/B-10 | **#17** | RUN_ERROR → error bubble on self-hosted runtime |
| 4 | **P1** | Rebase **#19** onto `main` (not `feat/search-003-restaurants`); resolve 4-file conflict | **#19** | `git merge main` clean · 348 tests green |
| 5 | **P1** | Merge **#17** → `main` before stacking #19 | **#17** | Vercel prod deploy |
| 6 | **P1** | Merge **#19** after #17 + P0 café fix | **#19** | golden-queries 8/8 on preview |
| 7 | **P2** | Set `ADK_GROUNDING_URL` on Vercel (Phase 2) | infra | Grounding smoke passes in prod |
| 8 | **Hold** | **#20** until DATA-042 pre-embed + MIS-M2 sign-off | **#20** | embed-worker cache hit &lt; live Gemini |

---

## Test matrix (executed 2026-05-31)

| Check | Branch | Result |
|-------|--------|--------|
| `npm test` | `origin/main` | **340/340** pass |
| `npm test` | `origin/feat/ux-002-005-chat` (PR #17 remote) | **329/329** pass |
| `npm test` | `feat/ux-002-005-chat` (local + unpushed) | **331/331** pass |
| `npm test` | `origin/feat/mis-rental-event-search` (PR #19) | **348/348** pass |
| `npm test` | `origin/feat/vec-embedding-cache` (PR #20) | **345/345** pass |
| `npm run smoke:ux005-thinking` | local #17 branch | **PASS** (`thinkingCaught: true`) |
| `npm run smoke:golden-queries` | PR #19 branch | **PASS 8/8** |
| `curl localhost:3001` | local dev | **200** |
| `POST /api/copilotkit` | local dev | **200** |
| Browser — café query | local (B-10 unpushed) | **Partial** — 5 cards but **restaurants** (Mondongos), not cafés |
| Browser — café query | [mdeai.co](https://www.mdeai.co/) (prod) | **FAIL** — “No places found” (no `venue_anchors` wiring) |
| CI GitHub Actions | PR #18 | **lint · test · build PASS** |
| CI Vercel preview | #17 #19 #20 | **deploy PASS** |
| Supabase MCP | live DB | 17 café anchors · 0 café-tagged restaurants |

---

## Real-world persona examples

| Persona | Query | Expected | Prod today | After fix #1–3 |
|---------|-------|----------|------------|----------------|
| **Tourist** | “specialty coffee in Laureles” | Pergamino / Rituales cards | Empty or wrong vertical | 17 curated café pins |
| **Tourist** | “quiet rooftop dinner Provenza” | Carmen / rooftop restaurants | “No places found” | Cards from hybrid search |
| **Tourist** | Agent timeout mid-turn | Error bubble + retry | Silent (no `publicApiKey`) | Bridge + retry |
| **Camila** | Sends rental query | “Searching Medellín…” | Works (fast-path) | Same + error path fixed |
| **Sofía** | Merges #19 without rebase | Clean CI | **CONFLICTING** | Rebase first |

---

# PR #17 — UX-002 error bubble + UX-005 thinking

**URL:** https://github.com/amo-tech-ai/mdeapp/pull/17  
**Remote HEAD:** `d620a9f` · **Local HEAD:** `a8d2e26` (3 commits **not on GitHub**)

## Scorecard

| Area | Remote % | Local % | | Notes |
|------|---------:|--------:|:-:|-------|
| UX-005 thinking indicator | 86% | 90% | 🟡 | Smoke PASS; pending store works |
| UX-002 error bubble | 62% | 88% | 🟡 | Bridge + try/catch **local only** |
| Scope / hygiene | 95% | 78% | 🟢/🟡 | Local branch mixed search fixes into UX PR |
| Tests | 72% | 80% | 🟡 | No RUN_ERROR e2e |
| **Overall** | **74%** | **82%** | 🟡 | Push local fixes or split commits |

## What's correct

- `ConciergeThinkingIndicator` + `concierge-pending-store` — browser smoke **`thinkingCaught: true`**
- `ConciergeErrorNotice` UI + retry via last user message
- `CopilotKitProvider` client wrapper for `onError`
- 16 Vitest tests (error + pending stores)

## Red flags & blockers

| # | Sev | Issue | Real-world effect |
|---|-----|-------|-------------------|
| B1 | 🔴 | **GitHub PR lacks `ConciergeAgentErrorBridge`** — uses `onError` on `<CopilotKit>` which is **gated on `publicApiKey`** in CK 1.55.2 | Tourist on prod: agent dies → **no bubble** |
| B2 | 🟡 | Remote lacks `onSend` try/catch — pending spinner can stick | Camila: network throw → infinite “Searching…” |
| B3 | 🟡 | Error copy: “timed out” for all errors | Misleading on 403/500 |
| B4 | 🟡 | No Playwright RUN_ERROR proof (task spec gap) | QA cannot regression-gate |
| B5 | 🟡 | Local-only B-09/B-10/classifier fixes **not in PR diff** | Reviewer sees stale UX-only scope |

## Local-only fixes (not on GitHub — must push)

- `src/components/copilot/concierge-agent-error-bridge.tsx` + mount in `chat-center-panel.tsx`
- `concierge-chat-input.tsx` try/catch → `reportConciergeError()`
- `73bb50c` B-09 event-memory hijack for “rooftop dinner”
- `73bb50c` B-10 café fallback curated rows (still **restaurants**, not `venue_anchors`)

## Corrections for #17

1. Push error bridge + try/catch to `origin/feat/ux-002-005-chat`
2. Split B-09/B-10 into separate PR on `main` (not UX PR)
3. Add Playwright: intercept CopilotKit SSE → inject RUN_ERROR → assert `[data-testid=concierge-error-notice]`
4. Generic error subtext: “Please try again.”
5. Merge **#17 before #19** (stack hygiene)

---

# PR #18 — SEARCH-003 hybrid restaurant + INT-001 intent slots

**URL:** https://github.com/amo-tech-ai/mdeapp/pull/18  
**Status:** **MERGED** → `main` @ `c391f75`

## Scorecard

| Area | % | | Notes |
|------|--:|:-:|-------|
| INT-001 intent slots tool | 92% | 🟢 | Registered; `lastIntent` enum extended |
| SEARCH-003 hybrid restaurants | 78% | 🟡 | RPC + embeddings; cards still fail agent path |
| Tests / CI | 95% | 🟢 | 340 tests; GitHub Actions green |
| Production café/restaurant UX | 45% | 🔴 | Data + UI emit gaps |
| **Overall** | **71%** | 🟡 | Merged but not persona-complete |

## What's correct

- `extractIntentSlotsTool` in `concierge.ts` tools map
- `lastIntent` includes `restaurant_search`, `cafe_search`
- `intelligence-restaurant-search.ts` + `query-embedding.ts` + `search-logs.ts`
- Golden hybrid path: GQ-R01 returns Mondongos + hybrid on PR #19 smoke (depends on #18)

## Red flags & blockers

| # | Sev | Issue | Example |
|---|-----|-------|---------|
| R1 | 🔴 | **`context?.writer?.custom()` no-ops** in Mastra beta — tool data never reaches UI | “rooftop dinner” → agent finds 5 rows → **empty cards** |
| R2 | 🔴 | **`venue_anchors` never queried** — 17 café seeds unused | DATA-035 shipped DB rows; app reads `restaurants` (0 cafés) |
| R3 | 🟡 | ADK grounding defaults to `localhost:8000` on Vercel | ADK always fails → weak fallback |
| R4 | 🟡 | `types.ts` / working memory drift vs agent Zod | Follow-up intent bugs |
| R5 | 🟢 | Event fast-path café hijack fixed on main (`6c53915`) | Was #18 stack blocker; now OK |

## Corrections for #18 (follow-up on main)

1. Replace `writer.custom` with CopilotKit tool render registration (pattern: `useDisabledToolRender` already used for grounded)
2. Add `searchVenueAnchors` or extend `curatedFallback` → `venue_anchors WHERE kind='cafe'`
3. Add Vitest: tool execute → assert render envelope shape (not LLM-only)
4. Sync `src/lib/types.ts` with concierge Zod

---

# PR #19 — MIS rental + event hybrid (SEARCH-001, INT-002)

**URL:** https://github.com/amo-tech-ai/mdeapp/pull/19  
**Base:** `feat/search-003-restaurants` (**stale** — #18 merged to `main`)  
**Mergeable:** **CONFLICTING**

## Scorecard

| Area | % | | Notes |
|------|--:|:-:|-------|
| SEARCH-001 rental hybrid | 82% | 🟡 | `intelligence-rental-search.ts` + queryText path |
| INT-002 event hybrid | 80% | 🟡 | salsa/vibe slots; golden pass |
| Safety restore (`3f98068`) | 90% | 🟢 | truncateQuery, hashId, try/catch restored |
| Merge hygiene | 30% | 🔴 | Wrong base; 4 conflict files |
| Tests | 92% | 🟢 | **348/348** + golden **8/8** |
| **Overall** | **74%** | 🟡 | Good code; blocked on git |

## What's correct

- `intelligence-rental-search.ts` / `intelligence-event-search.ts` with rank explanations
- `rental-query-parser.ts` INT-002 signals (date range, cityWide)
- `3f98068` restores PR #18 safety regressions (search-logs truncation, query-embedding try/catch)
- `npm run smoke:golden-queries` → **PASS 8/8** including GQ-R01 hybrid

## Red flags & blockers

| # | Sev | Issue |
|---|-----|-------|
| M1 | 🔴 | **Merge conflict** with `main` — `mergeStateStatus: DIRTY` |
| M2 | 🔴 | **Wrong base branch** — targets merged feature branch, not `main` |
| M3 | 🟡 | Inherits R1/R2 from #18 (writer.custom, café data) |
| M4 | 🟡 | VEC-004 cache smoke WARN — repeated embed not faster (cold cache) |
| M5 | 🟡 | No GitHub Actions `lint/test/build` on PR (Vercel only) |

## Corrections for #19

1. `git fetch origin && git rebase origin/main` on `feat/mis-rental-event-search`
2. Resolve conflicts in: `search-restaurants.ts`, `search-grounded-places.ts`, `concierge.ts`, `package.json` (approx.)
3. Change PR base to `main` in GitHub UI after rebase
4. Run `npm test` + `npm run smoke:golden-queries` post-rebase
5. Do **not** merge until #17 + P0 café/ card-emit fixes land (or document known prod gaps)

---

# PR #20 — VEC embedding registry [DEFERRED]

**URL:** https://github.com/amo-tech-ai/mdeapp/pull/20  
**Base:** `feat/mis-rental-event-search` · Label: **Do NOT merge until MIS-M2**

## Scorecard

| Area | % | | Notes |
|------|--:|:-:|-------|
| Code quality | 88% | 🟢 | registry + worker + verify script |
| Test floor | 92% | 🟢 | **345/345** |
| Merge readiness | 0% | 🔴 | Explicitly deferred |
| Production value today | 15% | 🔴 | No corpus pre-embed → cache miss every time |
| **Overall (ship)** | **N/A** | 🔴 | Hold |

## What's correct

- `embedding-registry.ts` — normalize + cache key contract
- `embed-worker.ts` CLI (`npm run embed:worker`)
- `verify-card-grounding.ts` QA gate
- PR description honest about DEFERRED status

## Red flags

| # | Sev | Issue |
|---|-----|-------|
| V1 | 🔴 | Blocker: **DATA-042** corpus not pre-embedded |
| V2 | 🔴 | Blocker: **MIS-M2** QA sign-off |
| V3 | 🟡 | Depends on #19 merge chain |
| V4 | 🟡 | Supabase bot: no migration in PR (expected for app-only) |

## Corrections for #20

1. **Do not merge** until DATA-042 + MIS-M2
2. After #19 merges: rebase onto `main`
3. Run embed-worker against live corpus; prove cache hit in smoke
4. Then flip DEFERRED → Ready

---

## Skills & MCP used

| Source | Used for | Result |
|--------|----------|--------|
| `index-skills.md` | Route copilotkit-integrations, mastra, mde-supabase, task-verifier | Followed |
| Supabase MCP | `venue_anchors` 17 cafés; restaurants 0 café tags | Confirmed data gap |
| Cursor browser MCP | localhost café query | 5 restaurant cards (wrong vertical) |
| Chrome DevTools MCP | — | Blocked (profile lock) |
| CopilotKit 1.55.2 source | `publicApiKey` + `handleErrors` gate | Confirmed UX-002 blocker |
| Playwright | listed specs only | No concierge e2e yet |

---

## Grading rubric (reference)

| Grade | Range | Meaning |
|-------|-------|---------|
| A | 90–100 | Merge-ready; persona-verified |
| B | 80–89 | Merge with minor fixes |
| C | 70–79 | Functional gaps; fix before prod |
| D | 50–69 | Blockers; do not merge |
| F | &lt;50 | Broken or wrong scope |

| PR | Grade | Merge? |
|----|-------|--------|
| #17 | **B-** (82%) | 🟡 After push bridge + split scope |
| #18 | **C+** (71%) | 🟢 Merged — follow-up P0 on main |
| #19 | **C** (74%) | 🔴 Rebase + conflict resolve first |
| #20 | **A-** code / **F** ship | 🔴 Hold per PR label |

---

## Verify 100% correct?

**No PR in this stack is 100% correct for Phase 1 persona acceptance.**

| Task | 100%? | Gap |
|------|-------|-----|
| UX-002 error bubble | ❌ 88% | Bridge on GitHub + e2e proof |
| UX-005 thinking | ❌ 90% | Minor copy + duplicate indicator cleanup |
| SEARCH-003 restaurants | ❌ 78% | Card emit + hybrid UX on agent path |
| INT-001 intent slots | ❌ 92% | Types sync + agent prompt mentions tool |
| SEARCH-001 rental hybrid | ❌ 82% | Prod `/rentals` route; merge blocked |
| INT-002 event hybrid | ❌ 80% | Date window quality on seed data |
| VEC embedding registry | ❌ 88% code | Deferred — no cache benefit yet |
| **Café vertical (cross-cutting)** | ❌ **35%** | `venue_anchors` unwired on prod |

---

## Best practices recommendations

1. **One concern per PR** — #17 local branch picked up B-09/B-10/search fixes; split before merge.
2. **Rebase onto `main` immediately after #18 merge** — #19 stale base caused CONFLICTING.
3. **Never mark search Done without browser proof on [mdeai.co](https://www.mdeai.co/)** — localhost can pass while prod env differs (ADK URL, data wiring).
4. **Wire DATA seeds before SEARCH PRs** — 17 café anchors exist; app must read `venue_anchors`.
5. **Agent tool UI:** prefer CopilotKit `useDisabledToolRender` over Mastra `writer.custom` until beta passes context.
6. **Keep DEFERRED label on #20** until embed corpus exists — PR description is exemplary; honor the gate.

---

## Evidence paths

| Artifact | Path |
|----------|------|
| UX-005 smoke | `tasks/testing/evidence/ux-005-thinking-smoke.png` |
| Prior PR #17 audit | `tasks/ux/tests/12-PR-17-UX-AUDIT.md` |
| Localhost vertical audit | `tasks/ux/tests/21-audit.md` |
| Golden queries (PR #19) | `mdeapp/scripts/intelligence/golden-queries-smoke.ts` |

---

**Bottom line:** The stack adds real hybrid-search and UX infrastructure, but **production café search is broken** because seeded `venue_anchors` are not wired, and **agent-path restaurant/café cards silently fail** due to `writer.custom`. Merge **#17** (with bridge pushed) → fix P0 on **main** → rebase **#19** → hold **#20**.
