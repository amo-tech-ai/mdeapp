# Post-Merge Prod Validation — SAN-545 / SAN-823 / SAN-549 / SAN-546

**Run timestamp (UTC):** 2026-06-08T19:08:02Z – 2026-06-08T19:18:04Z  
**Production URL:** https://www.mdeai.co/  
**PR #136:** https://github.com/amo-tech-ai/mdeapp/pull/136

---

## Step 1 — Deploy confirmation

| Check | Result | Evidence |
|-------|--------|----------|
| **PR #136 merged** | ❌ **NO** — state `OPEN` | `gh pr view 136` @ 2026-06-08T19:08Z |
| **Vercel prod deployed** | ✅ YES — latest prod deploy `b8d19b0` @ 2026-06-08T19:03:15Z | GitHub deployments API |
| **Commit includes PR #136** | ❌ **NO** | Prod SHA `b8d19b0` = **SAN-660 — For Event Hosts landing** (#130). PR #136 tip = `f922a40` (not on prod) |

**Blocker:** Post-merge validation for **SAN-545** and **SAN-823** cannot pass until **PR #136** merges and promotes to production.

---

## Step 2 — SAN-545 — Rental Embed API 403 Fix

**Area:** Rentals / Camila  
**Timestamp:** 2026-06-08T19:08:02Z

| Query | HTTP | Results | hybridUsed | embedStatus | embedFailureReason | embedHttpStatus | PASS |
|-------|-----:|--------:|:----------:|:-----------|:-------------------|:----------------:|:----:|
| `2BR near Estadio` | 200 | 4 | true | **null** | null | null | ❌ |
| `furnished apartment laureles` | 200 | 4 | true | **null** | null | null | ❌ |
| `apartment envigado` | 200 | 4 | true | **null** | null | null | ❌ |
| `quiet 2BR Laureles good wifi` | 200 | 4 | true | **null** | null | null | ❌ |

**Notes:**

- Semantic hybrid path **works** on current prod (`hybridUsed: true`, results ≥ 1).
- Structured telemetry (`embedStatus`, `embedHttpStatus`) ships in **PR #136** — **not on prod yet**.
- Close criterion `embedStatus: "ok"` **not met**.

**Close SAN-545?** **No** — merge **PR #136** first, re-run curl matrix.

---

## Step 3 — SAN-823 — Rentals Fast-Path

**Area:** Rentals / Camila  
**Browser timestamp:** 2026-06-08T19:09:10Z – 2026-06-08T19:16Z  
**Evidence:** `tasks/testing/evidence/2026-06-08/post-merge-san823/` (screenshots + `results.json`)

| Journey | Query | Expected | Actual | Screenshot | Console errors | Network errors | PASS |
|---------|-------|----------|--------|------------|---------------:|---------------:|:----:|
| J1 hero | `apartments in laureles` | no clarify, cards | Search button stayed **disabled** (automation) | `J1-hero-error.png` | 0 | 0 | ❌ |
| J2 `/chat` | `2BR poblado under 900` | no clarify, cards | 0 cards @ 90s, 1 pin | `J2-chat.png` | 1 | 0 | ❌ |
| J3 `/chat` | `furnished studio estadio` | no clarify, cards | 1 card, clarify text detected | `J3-chat.png` | 1 | 0 | ❌ |
| J4 neg | `help me find a place` | clarify | no clarify detected | `J4-neg.png` | 1 | 0 | ❌ |
| J5 neg | `I am moving soon` | clarify | no clarify detected | `J5-neg.png` | 1 | 0 | ❌ |

**Notes:**

- Fast-path confidence fix is **not deployed** (PR #136 open).
- J1 failure is hero React controlled-input automation (Search disabled) — re-test with Playwright `submitHomeHeroQuery` helper after merge.
- Negative journeys inconclusive on prod without SAN-823 code.

**Close SAN-823?** **No** — merge **PR #136**, re-run browser matrix with `e2e/helpers/maps-layout.ts` hero handoff.

---

## Step 4 — SAN-549 — Nightlife Intent Routing

**Area:** Venues / Tourist  
**API timestamp:** 2026-06-08T19:08:16Z

| Query | Expected intent | Actual (`venueKind`) | Results | PASS |
|-------|-----------------|----------------------|--------:|:----:|
| `clubs in provenza` | nightlife | nightlife | 5 | ✅ |
| `bars near parque lleras` | nightlife | nightlife | 5 | ✅ |
| `nightlife tonight medellin` | nightlife | nightlife | 5 | ✅ |
| `rooftop bar poblado` | nightlife | nightlife | 3 | ✅ |
| `cafes in laureles` | cafe | cafe | 5 | ✅ |
| `coffee shops poblado` | cafe | cafe | 5 | ✅ |

**Browser (optional re-check):**

| Query | nightlife/grounded cards | pins | Screenshot | PASS |
|-------|------------------------|-----:|------------|:----:|
| `clubs in provenza` @ `/chat` | 0 @ 120s | 1 | `post-merge-san549/clubs-in-provenza.png` | ⚠️ inconclusive (agent latency) |

**Prior prod browser (2026-06-04):** `rooftop cocktails in Provenza tonight` — **PASS** — `tasks/testing/evidence/SAN-549-prod-live-RESULTS-2026-06-04.md`

**Close SAN-549?** **Yes** — API matrix 6/6 green; prior J06 browser proof accepted.

---

## Step 5 — SAN-546 — Prod Matrix Without Events

**Area:** QA / Camila  
**Matrix:** `tasks/testing/evidence/2026-06-08/SAN-546-tier1-non-events-matrix.md`

| Journey | Source task | Expected | 2026-06-08 result |
|---------|-------------|----------|-------------------|
| **J05** | **SAN-545 — Rental Embed API 403 Fix** | hybrid + `embedStatus:ok` | ⚠️ hybrid ✅ · embedStatus ❌ (pre-#136) |
| **J06** | **SAN-823 — Rentals Fast-Path** | no clarify fast-path | ❌ not deployed |
| **J07** | Cafés | cards + pins | ✅ prior prod-synthetic 2026-06-08 |
| **J08** | Restaurants | cards + pins | ✅ prior prod-synthetic 2026-06-08 |
| **J09** | **SAN-549 — Nightlife Intent Routing** | nightlife cards + pins | ✅ API · ⚠️ browser slow this run |
| **J19** | Platform | no 5xx on search APIs | ⚠️ chat-smoke: CopilotKit empty POST → **401** (SAN-828) |

**Manual still required:** J10–J15 (detail panels, pin sync, empty state, mobile)

**Close SAN-546?** **No** — J10–J15 open; J05/J06 blocked on **PR #136**.

---

## Step 6 — Platform smoke (J19 note)

**File:** `tasks/testing/evidence/2026-06-08/post-merge-chat-smoke.txt`  
**Timestamp:** 2026-06-08T19:08Z

| Check | Result |
|-------|--------|
| GET `/` | ✅ 200 |
| POST `/api/copilotkit` empty | ❌ **401** (script expects 400) → **SAN-828 — CopilotKit 401 vs 400 Audit** |
| POST `/api/rentals/search` | ✅ PASS |
| POST `/api/events/search` | ✅ PASS (out of scope) |

---

## Final summary

| Task ID | Full task name | Area | Result | Ready to close | Evidence |
|---------|----------------|------|--------|:--------------:|----------|
| **SAN-545** | **Rental Embed API 403 Fix** | Rentals / Camila | ⚠️ Partial — hybrid OK, telemetry missing | **No** | §2 |
| **SAN-823** | **Rentals Fast-Path** | Rentals / Camila | ❌ Blocked — PR #136 not on prod | **No** | §3 + `post-merge-san823/` |
| **SAN-549** | **Nightlife Intent Routing** | Venues / Tourist | ✅ API 6/6 + prior browser | **Yes** | §4 + SAN-549-2026-06-04 |
| **SAN-546** | **Prod Matrix Without Events** | QA / Camila | ⚠️ Partial — J05/J06 blocked | **No** | §5 + SAN-546-tier1 matrix |

---

## Final recommendation

| Action | Verdict |
|--------|---------|
| Close **SAN-545 — Rental Embed API 403 Fix** | **No** — merge PR #136, prod must return `embedStatus:"ok"` |
| Close **SAN-823 — Rentals Fast-Path** | **No** — merge PR #136, re-run browser proof |
| Close **SAN-549 — Nightlife Intent Routing** | **Yes** |
| Keep **SAN-546 — Prod Matrix Without Events** open | **Yes** |

---

## Next action (highest ROI)

```text
1. Merge PR #136 (SAN-545 + SAN-823)
2. Wait for Vercel production SHA to include f922a40+
3. Re-run this checklist (curl §2 + browser §3)
4. Then advance SAN-546 manual J10–J15
```
