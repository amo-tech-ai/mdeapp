# Platform review — post PR #136 merge

**Date:** 2026-06-08 UTC  
**Reviewer:** Cursor agent (task-verifier + Linear MCP + prod probes)  
**Prod SHA:** `1c2d2f8` (PR #136)  
**Goal:** Launch readiness 78% → 90%+

---

## Live probes (this session)

| Probe | Result |
|-------|--------|
| `GET https://www.mdeai.co/` | 200 |
| `POST /api/rentals/search` embedStatus | `"ok"`, `hybridUsed: true` |
| `POST /api/copilotkit` empty body | **401** (smoke expects 400) |
| `chat-smoke.mjs --base https://www.mdeai.co` | 12/13 PASS (CopilotKit fail) |
| Vitest SAN-545/823/549 pack | **40/40 PASS** |

---

## Task verdicts

### SAN-545 · DATA-EMBED — Grade **A** · Score **92**

| Dimension | Score | Notes |
|-----------|------:|-------|
| Spec | 24/25 | All AC met on prod |
| Tests | 25/25 | `query-embedding.test.ts` green |
| Runtime | 18/20 | Merged + CI green |
| Production | 20/20 | `embedStatus:ok` on prod curl |
| Process | 5/10 | Evidence + Linear Done |

**Linear:** Done · **Evidence:** `post-merge-SAN-545-823-MERGED.md`

### SAN-823 · UX-038 — Grade **B+** · Score **88**

| Dimension | Score | Notes |
|-----------|------:|-------|
| Spec | 22/25 | AC met except optional hero e2e |
| Tests | 23/25 | fast-path + parser green |
| Runtime | 18/20 | PR merged |
| Production | 18/20 | 8 cards · 8 pins · no clarify on `/chat` |
| Process | 7/10 | Full title + evidence |

**Risks:** `e2e/home-to-chat` hero fails on prod (`submitHomeHeroQuery`).  
**Linear:** Done · **Evidence:** `post-merge-SAN-545-823-MERGED.md`

### SAN-549 · Nightlife intent — Grade **B+** · Score **88**

| Dimension | Score | Notes |
|-----------|------:|-------|
| Spec | 22/25 | Agent passes `intent:nightlife` |
| Tests | 24/25 | grounded-places quality green |
| Runtime | 17/20 | PR #70 on main |
| Production | 18/20 | J06 browser PASS (2026-06-04); API smoke PASS today |
| Process | 7/10 | Reopened then closed with evidence |

**Risks:** Generic `popular venues tonight` routes to events (VEN-025) — out of SAN-549 scope.  
**Linear:** Done

### SAN-546 · OPS-JOURNEY — Grade **C+** · Score **72**

| Journey | Post-#136 status |
|---------|------------------|
| J05 | ✅ PASS — hybrid + embedStatus ok |
| J06 | ✅ PASS — SAN-823 prod chat |
| J07–J08 | ✅ PASS — prior prod-synthetic |
| J09 | ✅ API PASS |
| J10–J15 | ⏸ MANUAL — not run |
| J16 | ✅ PASS |
| J18 | ✅ PASS |
| J19 | ⚠️ PARTIAL — CopilotKit 401 |
| J20 | ✅ This report |

**Blockers:** J10–J15 manual matrix · J19 ties to SAN-828  
**Linear:** In Progress

### SAN-828 · UX-043 — Grade **—** · Score **35** (audit only)

| Finding | Detail |
|---------|--------|
| Observed | Empty `POST /api/copilotkit` → **401** on prod |
| Expected (smoke) | **400** per `chat-smoke.mjs:68` |
| Likely cause | Auth/middleware rejects unauthenticated runtime POST before route validation |
| Fix plan | **Option A:** Return 400 from route for empty body (if anon allowed). **Option B:** Update smoke to accept 401 + document contract. **Option C:** Send minimal valid CopilotKit payload in smoke instead of `{}`. |

**Linear:** Todo (unblocked — SAN-823 Done)

### SAN-548 · F13 thread persistence — Grade **C** · Score **68**

| Gate | Status |
|------|--------|
| Postgres storage shipped | ✅ disk |
| Prod turn-11 cold-start proof | ❌ missing |
| Playwright continuity | ❌ missing |

**Linear:** In Progress

### SAN-368 · MAP-002B ADK — Grade **F** · Score **45**

| Gate | Status |
|------|--------|
| Client + vitest on disk | ✅ |
| Cloud Run healthy | ❌ not verified |
| Vercel `ADK_GROUNDING_URL` + token | ❌ blocked |
| Prod café grounded via ADK | ❌ Places fallback may work; ADK path unproven |

**Linear:** In Progress · **MVP impact:** Medium — café cards work via existing path; ADK is enhancement + citation quality

---

## Launch readiness

| Metric | Before | After review |
|--------|-------:|-------------:|
| Tier-1 Done | 0/5 | **3/5** (545, 823, 549) |
| Launch score | 78 | **84** |
| Path to 90% | — | SAN-546 J10–J15 + SAN-828 + optional hero e2e |

## MVP blockers (remaining)

1. **SAN-828** — CopilotKit empty POST contract (chat-smoke red)
2. **SAN-546** — J10–J15 manual journeys (detail panels, pin sync, mobile)
3. **SAN-548** — Thread persistence prod proof (Camila turn-11)
4. **Hero e2e** — `submitHomeHeroQuery` on prod `/` (Camila entry)
5. **SAN-368** — ADK sidecar + Vercel env (infra, not chat-down)

## Regressions

- None observed on rental embed or fast-path post-#136
- CopilotKit 401 pre-existed; not introduced by #136
