---
title: Mastra Studio Forensic Architecture Audit
date: 2026-06-05
auditor: Claude (Principal AI Architect / forensic mode)
scope: mdeapp/src/mastra · /api/copilotkit · live Mastra Studio :4111
method: live API inspection (localhost:4111/api/*) + source read + skill cross-check
skills_consulted:
  - .claude/skills/mastra/SKILL.md
  - .claude/skills/copilotkitV1
  - .claude/skills/copilotkit-integrations/references/integrations/mastra.md
verdict: Conditional pass — strong concierge core; empty quality/observability layer; non-prod agents exposed on runtime
---

# Mastra Forensic Architecture Audit — 2026-06-05

> **Method:** Every claim checked against the **running** Mastra
> (`curl localhost:4111/api/*`) **and** source (`mdeapp/src/mastra/**`), then
> cross-checked against the `mastra`, `copilotkitV1`, and `copilotkit-integrations`
> skills. Where runtime, source, and a planning doc disagreed, **runtime wins**.
> Nothing assumed.
>
> **Skill verification result:** The `copilotkit-integrations/.../mastra.md` skill
> confirms mdeapp is **Pattern 1 (in-process)**, `getLocalAgentsWithLogging` wraps
> `MastraAgent.getLocalAgents`, the `agent=` prop selects the agent, and
> `LoggingMastraAgent` is the correct `ai_runs` hook point. The architecture
> **matches the documented pattern** — findings below are about *completeness and
> hygiene*, not pattern violations.

---

## Executive summary

| Metric | Value |
|---|---|
| **Overall architecture grade** | **B−** |
| **Production readiness** | **62%** |
| **MVP readiness** | **74%** |
| **Biggest risk** | No automated quality gate (0 scorers) + no AI tracing (0 spans) on a live AI-search product |
| **Single best fix** | Wire one hallucination/grounding scorer + enable Mastra telemetry exporter |

**One-line verdict:** The **concierge core is genuinely good** — strong prompt, real tool coverage, correct memory scoping, per-turn audit logging, and it faithfully implements the documented CopilotKit Pattern-1 integration. But the **quality + observability layers are effectively empty** (0 scorers, 0 trace spans, no telemetry exporter), and the **runtime exposes 5 non-production agents** that the frozen `MASTRA-MIS-001` decision says should not be reachable. It will *demo* well; it is **not production-instrumented**.

### Will it succeed?
**Yes for the MVP launch, conditionally.** Camila's rental journey and the Tourist venue journey run through a well-built `conciergeAgent` over the correct integration pattern. The failure points are **operational** (no tracing, no eval gate) not architectural — they bite *after* launch.

---

## Scorecard

| Area | Score | Grade | Risk | Evidence |
|---|---|---|---|---|
| **Agents** | 6.5/10 | C+ | 🟡 Med | 7 registered, 5 non-prod reachable on runtime |
| **Tools** | 8/10 | B+ | 🟢 Low | 8 tools, audited wrapper, fallback chains, Zod I/O |
| **Workflows** | 6/10 | C | 🟡 Med | 3 exist; 0 used by prod chat; `conciergeRoutingWorkflow` registered against its own rule |
| **MCP** | N/A | — | 🟢 Low | 0 servers — correct for Phase 1 |
| **Scorers** | 1/10 | F | 🔴 High | `/api/scorers` 404; `evals.json` unwired; "eval" is an *agent* |
| **Context / memory** | 7/10 | B− | 🟡 Med | Thread WM strong; no resource/semantic recall |
| **Observability** | 3/10 | D | 🔴 High | 0 trace spans, no telemetry exporter; only custom `ai_runs` |
| **Processors** | 6/10 | C | 🟡 Med | TokenLimiter + prod-only injection guard; **0 output processors** |
| **Maps integration** | 8/10 | B+ | 🟢 Low | Grounded-places + locationBias + retry + quota |
| **CopilotKit integration** | 8.5/10 | B+ | 🟢 Low | Pattern-1 per skill, auth gate, `ai_runs` hook, single `useCoAgent` mount |
| **Mastra integration** | 7/10 | B− | 🟡 Med | Clean core; beta `@ts-expect-error` memory drift carried |
| **Supabase integration** | 8/10 | B+ | 🟢 Low | Postgres prod / LibSQL dev singleton, EMAXCONN-aware |
| **Overall architecture** | 6.5/10 | **B−** | 🟡 Med | Good core, bloated registration, empty quality layer |

---

## 1. Agents

### Current state (live `/api/agents`)

| Agent (map key) | Model | Tools | Workflows | Memory | Invoked by UI? |
|---|---|---|---|---|---|
| `conciergeAgent` | gemini-3.5-flash | **7** (all search) | — | thread WM (rich) | ✅ provider pins it |
| `hostEventAgent` | gemini-3.5-flash | 0 (CK gen-UI) | — | thread WM (EventDraft) | ✅ host bridge |
| `routerAgent` | gemini-3.5-flash | classifyIntent | rental + event WF | — | ❌ reachable, uninvoked |
| `rentalAgent` | gemini-3.5-flash | searchRentals | — | — | ❌ reachable, uninvoked |
| `eventAgent` | gemini-3.5-flash | searchEvents | — | — | ❌ reachable, uninvoked |
| `evaluationAgent` | gemini-3.5-flash | 0 | — | — | ❌ rerank helper |
| `pingAgent` | gemini-3.5-flash | 0 | — | thread WM (MdeState) | ❌ smoke only |

**Verified UI bindings:** `copilot-kit-provider.tsx:14` → `getCopilotKitClientProps("conciergeAgent")`; `concierge-coagent-context.tsx:21` → `useCoAgent({ name: "conciergeAgent" })` (single mount, comment notes it avoids POST-storm); host bridge → `useCoAgent<EventDraftState>`. So **only 2 agents are ever invoked by the app.**

### Problems

1. **🟡 (latent) All 7 agents are exposed on the CopilotKit runtime.** `getLocalAgentsWithLogging` iterates `mastra.listAgents()` unconditionally (`copilotkit/logging-mastra-agent.ts:88`). The UI only pins `conciergeAgent`/`hostEventAgent`, so this is **not an active bug** — but any client holding the runtime URL could invoke `routerAgent` (mounting which `MASTRA-MIS-001` lists as an explicit **anti-pattern**). Defense-in-depth: allowlist the exposed agents. **Downgraded from P0 → P1** because the `agent=` prop pins selection.
2. **🟡 `rentalAgent` / `eventAgent` are strict subsets of `conciergeAgent`** — each wraps one tool the concierge already owns, no prod caller. Redundant; prompt-drift surface.
3. **🟡 Three routing mechanisms, one prod winner.** `routerAgent` (LLM classify→workflow), the in-app fast-path (`use-rental-search-fast-path`), and the concierge's own `extractIntentSlotsTool`. Only the latter two are on the prod path; `routerAgent` is Studio/test-only per the frozen doc.
4. **🟢 Concierge prompt is the strongest artifact** — neighborhood + budget intelligence, empty-state recovery, follow-up preservation, explicit "tool results are the only truth" anti-hallucination clause, max-5-cards. Production-grade.

### Answers
- **Too many agents?** Yes — 7 registered, 2 invoked. Trim to `concierge` + `hostEvent` (+ `ping` for smoke).
- **Redundant?** `rentalAgent`, `eventAgent`, `pingAgent` (smoke).
- **Become workflows?** No — workflows already duplicate them (§3). Prune instead.
- **Overlapping responsibilities?** Yes — routing in 3 places.
- **Router correctly designed?** As a Studio demo, yes; it should not be reachable in prod (and the UI doesn't call it).
- **Concierge overloaded?** Borderline but coherent — keep for Phase 1, don't split.
- **Venue → workflow?** No. It's correctly a *tool* (`searchGroundedPlacesTool`) with a fallback chain.

**Scores:** Architecture **6/10** · Maintainability **6/10** · Scalability **7/10** · Production readiness **6/10**

---

## 2. Tools

### Inventory (live `/api/tools` — 8 tools)

| Tool | Validation | Error handling | Notes |
|---|---|---|---|
| `searchRentalsTool` | Zod in/out | ✅ audited wrapper | Hybrid Supabase + date passthrough |
| `searchEventsTool` | Zod | ✅ | + web-grounded fallback |
| `searchRestaurantsTool` | Zod | ✅ | Sit-down only (intent-separated) |
| `searchAttractionsTool` | Zod | ✅ | Tours/viewpoints/day-trips |
| `searchGroundedPlacesTool` | Zod | ✅ retry + quota | Maps grounding, locationBias, cafe/nightlife fallback |
| `searchWebGroundedEventsTool` | Zod | ✅ | Time-sensitive verify, after DB |
| `classifyIntentTool` | Zod enum | ✅ | Router only |
| `extractIntentSlotsTool` | Zod | ✅ | Concierge self-routing |

### Findings
- **🟢 Best-engineered layer.** Zod in/out on every tool; most route through `audit-wrapper.ts` + `run-audited-search.ts` (logs to `search_logs`/`ai_runs`); grounded path has `places-retry.ts` + `grounding-quota.ts`.
- **🟡 `search-venue-anchors.ts` is in source but NOT in the live registry** (8 live tools, this isn't one). Confirm caller; delete if orphaned.
- **🟡 No per-tool timeout/circuit-breaker.** Route `maxDuration=60` is the only ceiling — one slow Places call eats the whole turn.
- **Overlap (managed):** `searchRestaurants` vs `searchGroundedPlaces` (sit-down vs bar/club). Prompt disambiguates well; known footgun.

### Recommendations
- Resolve `search-venue-anchors.ts` (wire or delete).
- Add a ~12s tool-budget wrapper in `audit-wrapper.ts`.
- Keep the rest as-is.

**Scores:** Tool design **8/10** · Reliability **8/10** · Reusability **7/10**

---

## 3. Workflows

### Current state (live `/api/workflows`)

| Workflow | Registered | Prod chat use | Verdict |
|---|---|---|---|
| `rentalSearchWorkflow` | ✅ | ❌ (routerAgent only) | Demo/rerank only |
| `eventDiscoveryWorkflow` | ✅ | ❌ (routerAgent only) | Demo only |
| `conciergeRoutingWorkflow` | ✅ | ❌ **"do not wire to CK"** (MIS-001) | Registered against its own rule |
| `concierge-agent-input-processor` | (appears in view) | — | A **processor** surfacing in the workflows list — cosmetic Studio artifact |

### Problems
- **🟡 Workflows duplicate agent logic** — rental/event workflows do what concierge does via tools, deterministically, for the router demo. Second source of truth.
- **🟡 `conciergeRoutingWorkflow` registered despite MIS-001 "do not wire"** — low-risk (not auto-mounted) but loaded ammunition.

### Missing workflows
| Missing | Why | Persona |
|---|---|---|
| **Ticket checkout** | Money path = deterministic + idempotent + HITL → textbook workflow | Andrés (W9) |
| **Host publish** | Deterministic validate→preview→publish with retry beats agent prompt | Roberto (W3–4) |
| **Search-with-recovery** | Formalize DB→web→maps fallback as one observable workflow | Camila/Tourist |

**Recommended map:**
```
checkoutWorkflow      (NEW, P1) → validate cart → Stripe intent → HITL confirm → finalize (idempotent)
hostPublishWorkflow   (NEW, P2) → validate draft → preview (HITL) → publish → emit ai_run
searchWithRecovery    (REFACTOR) → DB → [empty?] web-ground → [empty?] maps → rank
rentalSearchWorkflow  (KEEP, Studio demo, do not mount)
eventDiscoveryWorkflow(KEEP, Studio demo, do not mount)
conciergeRoutingWf    (DELETE or quarantine)
```

**Score:** Workflow design **6/10**.

---

## 4. MCP servers

**Current: 0 MCP servers in Mastra** (`/api/mcp` → 404; none in `index.ts`). **Correct for Phase 1** — external integrations are wired app-side (Supabase client, Google Places client); `.mcp.json` covers *dev tooling*. Adding MCP inside the agent runtime now is premature.

| MCP | MVP? | Benefit | Complexity | ROI | Verdict |
|---|---|---|---|---|---|
| Supabase | ❌ | Agent self-serve schema | Med (service-role risk) | Low | **Skip** — typed clients exist |
| Google Maps | ❌ | Grounding via MCP | Med | Low | **Skip** — `google-places-client.ts` better |
| Stripe | 🔶 P2 | Refund/lookup ops | Med | Med | **Phase 2** admin only |
| GitHub / Linear | ❌ | Dev automation | Low | Low | **Skip** (dev-side) |
| Gmail / Calendar | 🔶 P2 | Host comms, viewings | Med | Med | **Phase 2** scheduling |
| Apify | ❌ | Scrape events | High | Low | **Skip** — web-grounding covers it |

**Add none to the runtime for MVP.** Revisit Gmail/Calendar + Stripe in Phase 2.

---

## 5. Scorers

**Current: 0 scorers.** `/api/scorers` → **404**. `evaluation.ts` is an **Agent**, not a scorer. `.claude/skills/mastra/evals/evals.json` exists but is **not wired** to the runtime.

**🔴 The single biggest production-quality gap.** You ship AI search with **no automated quality measurement** — nothing catches hallucinated listings, bad rankings, or grounding drift before users see them. Your concierge prompt *declares* "tool results are the only truth"; **nothing measures or enforces it.**

| Scorer | Measures | Priority | Persona |
|---|---|---|---|
| **Hallucination / grounding** | Reply invents a listing/event/price not in tool output? | **P0** | All |
| **Answer faithfulness** | Reply consistent with retrieved rows | **P1** | All |
| **Rental relevance** | Match neighborhood/bedrooms/budget filters | **P1** | Camila |
| **Search quality** | Empty-result rate, fallback-trigger rate | **P1** | Camila/Tourist |
| **Event recommendation fit** | Vibe/date match | **P2** | Andrés |
| **Venue ranking** | Sensible order of grounded places | **P2** | Tourist |

**Recommendation:** Wire the **hallucination/grounding scorer (P0)**. Convert `evals.json` into runtime scorers; repurpose `evaluationAgent` as a scorer judge model.

**Score:** Scorer coverage **1/10 (F)**.

---

## 6. Request context & memory

### Current state (verified)
- **Storage:** Postgres (prod, `DATABASE_URL`) / in-memory LibSQL (dev), singleton across HMR, EMAXCONN-aware (`max:3`) — `lib/storage.ts`. 🟢
- **Memory:** Thread-scoped working memory via `createThreadMemory`; concierge schema is rich (lastIntent, lastRentalQuery, lastRentalResults, selectedListingId, lastEventQuery/Results, mapUi viewport/pins), `lastMessages:20`. 🟢
- **Request context:** `MASTRA_RESOURCE_ID_KEY` from authed `user.id`; `setAuditUserId` threads userId into tool audit. 🟢

### Gaps (the `mastra` skill lists 4 memory types — you use 1.5)
| Gap | Impact | Fix |
|---|---|---|
| **No resource-scoped memory** | Camila's prefs forgotten across sessions | `scope:"resource"` for durable prefs |
| **No semantic recall** | Can't retrieve "that apartment I liked last week" | Embedding recall (Phase 2) |
| **No observational memory** | No auto-summarized long context | Phase 2 |
| **Trip/saved data ephemeral** | Lives in WM, not a `trips`/saved table | Persist to Supabase |

**Ideal:**
```
Ephemeral (thread WM):  lastIntent, lastQuery, lastResults, mapUi, selectedId
Durable (resource mem): budget band, preferred neighborhoods, language
Persisted (Supabase):   saved listings, trips, tickets, host drafts
Semantic (Phase 2):     recall over past liked listings/events
```

**Score:** Context/memory **7/10**.

---

## 7. Observability

**Current: 0 trace spans** (`/api/observability/traces` → `{total:0, spans:[]}`). **No telemetry/AI-tracing exporter** in `index.ts` (no `telemetry`/`observability`/exporter key). The **only** signal is the custom `ai_runs` Postgres row per turn from `LoggingMastraAgent` (status, duration, thread/run id) — which the skill confirms is the correct Pattern-1 hook, but it's coarse.

### Blind spots
| Blind spot | Severity |
|---|---|
| No span-level traces (tool latency, tokens, step timing) | 🔴 |
| No error-rate / p95-latency dashboard | 🔴 |
| No per-tool cost (Gemini + Places) attribution | 🟡 |
| No alerting (failed-run spike, grounding-quota exhaustion) | 🟡 |
| `ai_runs` has data but nothing surfaces it | 🟡 |

### Recommended production observability
1. **Enable Mastra AI tracing** (`telemetry`/`observability` in `Mastra({})`) + OTel exporter → Studio observability becomes non-empty; tool spans captured.
2. **Langfuse or OTel exporter** for prod (Gemini token + Places cost per turn).
3. **One admin dashboard** off `ai_runs` (Patricia, W8): runs/day, error rate, p95, by agent.
4. **Alerts:** error-rate > 5%/5min · grounding-quota near cap · p95 > 10s.

**Score:** Observability **3/10 (D)** — custom `ai_runs` is the only thing keeping it off an F. This directly contradicts your own latency lessons (two-Gemini-round-trip, POST-storm): **you cannot tune what you cannot trace.**

---

## 8. Processors

### Current state
- **Input:** `TokenLimiter(8192)` always; `PromptInjectionDetector` **prod-only** (skipped in dev to avoid an extra LLM round-trip). Applied **only to `conciergeAgent`**.
- **Output:** **None anywhere.** 🟡

### Recommendations
| Add | Where | Why |
|---|---|---|
| **Output: grounding assertion** | concierge | Reject replies citing IDs absent from tool output — *enforces* the prompt rule |
| **Output: structured/PII guard** | concierge | Validate before user sees it |
| **Input processors on `hostEventAgent`** | host wizard | Same coverage as concierge |
| **Light moderation** | concierge | Phase 2 |

The prod-only injection-guard tradeoff is **reasonable** (latency vs dev DX). The real gap is **zero output processors** — pair an output grounding-assertion with the §5 hallucination scorer to make "tool results are the only truth" programmatic, not aspirational.

**Score:** Processors **6/10**.

---

## 9. Workspaces

**Current: single workspace** (`ws-mq1k5lhc-lzocpz`, `workspaces.ts`) — the **Mastra Studio dev workspace** (Studio IDE file access), **not** an application tenant boundary.

- **Multi-tenant readiness:** enforced at **Supabase RLS + `resourceId`**, not Mastra workspaces — **correct design**. Mastra workspace ≠ tenant.
- **Isolation:** per-user via `resourceId` + thread scope. 🟢 Adequate for MVP.
- **No action for Phase 1.** Don't conflate Studio workspaces with tenancy.

---

## 10. MVP alignment

| Journey | Path | State | Gap |
|---|---|---|---|
| **Camila (rental + chat)** | `conciergeAgent` + search-rentals + fast-path | 🟢 ~85% | No durable prefs; no eval gate |
| **Tourist (venue/restaurant)** | `conciergeAgent` + grounded-places/restaurants | 🟢 ~80% | No grounding quality scorer |
| **Roberto (host publish)** | `hostEventAgent` + CK HITL | 🟡 ~65% | No publish *workflow*; agent has 0 server tools |
| **Andrés (ticket buy)** | — | 🔴 ~20% | **No checkout workflow in Mastra** — money path unbuilt here |

**Scope creep:** 5 non-prod agents reachable · 3 workflows where prod uses 0 · possibly-orphaned `search-venue-anchors.ts`.
**Not overengineered:** memory, storage, tool audit, fallback chains are all justified.

---

## Critical findings

### P0 (fix before/at launch)
1. **No quality scorer** (§5) — wire the hallucination/grounding scorer.
2. **No AI tracing** (§7) — enable Mastra telemetry/OTel; you're blind on tool latency/cost/errors.

### P1 (fix in launch cycle)
3. **Non-prod agents reachable on the runtime** (§1) — allowlist `getLocalAgentsWithLogging` to `conciergeAgent`, `hostEventAgent` (+`pingAgent` for smoke). Aligns runtime with frozen `MASTRA-MIS-001`.
4. **No output processor enforcing the anti-hallucination rule** (§8).
5. **No checkout workflow** for Andrés (§3, §10).
6. **Resolve `search-venue-anchors.ts`** — wire or delete (§2).
7. **Quarantine `conciergeRoutingWorkflow`** — registered against its own "do not wire" rule (§3).

### P2 (post-launch)
8. Delete `rentalAgent`/`eventAgent` (subsets of concierge) (§1).
9. Resource-scoped + semantic memory (§6).
10. Admin observability dashboard off `ai_runs` (§7).
11. Per-tool timeout/circuit-breaker (§2).

---

## Final verdict (brutally honest)

1. **Will it succeed?** **Yes for the MVP demo, with caveats.** The concierge core is well-built and implements the documented integration pattern correctly. It is **not** production-*operable* — no eval gate, no tracing, no alerting.

2. **Biggest failure points?** (a) **Silent hallucination** — prompt forbids it, nothing enforces it. (b) **Blind operations** — 0 trace spans; first incident leaves you with only `ai_runs` rows. (c) **Andrés' checkout** is not built in Mastra.

3. **Fix immediately?** Hallucination scorer · AI tracing exporter. (Then: agent allowlist — all <1 day each.)

4. **Postpone?** All MCP servers, semantic memory, multi-tenant workspaces, output moderation. None are MVP blockers.

5. **Delete?** `rentalAgent`, `eventAgent`. Quarantine/delete `conciergeRoutingWorkflow`. Resolve `search-venue-anchors.ts`. Stop registering 5 non-prod agents on the runtime.

6. **Add?** Hallucination scorer (P0) · AI tracing exporter (P0) · output grounding-assertion processor (P1) · `checkoutWorkflow` (P1) · resource-scoped memory (P2).

7. **What would a top-1% Mastra architect do differently?**
   - **Two agents in prod, period** — Studio demos behind a dev-only flag, never reachable on the CK runtime.
   - **Treat "tool results are the only truth" as a contract** — enforced by an output processor + a scorer in CI, not a hope.
   - **Tracing on from day 1** — you cannot tune the latency lessons you already learned (two-round-trip, POST-storm) without spans.
   - **Money path = workflow** — checkout is the textbook deterministic+idempotent+HITL case, and it's the one workflow you don't have.
   - **One router, not three** — pick fast-path *or* concierge self-routing; delete `routerAgent` from prod thinking.

---

### Appendix — evidence log

| Claim | Source |
|---|---|
| 7 agents, all fields | `GET localhost:4111/api/agents` |
| 8 tools | `GET /api/tools` |
| 3 workflows + 1 processor in view | `GET /api/workflows` |
| 0 scorers | `GET /api/scorers` → 404 |
| 0 MCP | `GET /api/mcp` → 404 |
| 0 trace spans | `GET /api/observability/traces` → `{total:0}` |
| All agents exposed to runtime | `copilotkit/logging-mastra-agent.ts:88` `mastra.listAgents()` |
| UI pins concierge only | `copilot-kit-provider.tsx:14`, `concierge-coagent-context.tsx:21` |
| UI pins hostEvent | `host-event-copilot-bridge.tsx:30` |
| Prod = concierge only (frozen) | `tasks/mastra/MASTRA-MIS-001-routing-canonical.md` |
| Storage prod/dev split | `src/mastra/lib/storage.ts` |
| Thread memory schema | `src/mastra/agents/concierge.ts` |
| Input processors | `src/mastra/lib/agent-input-processors.ts` |
| No telemetry config | `src/mastra/index.ts` (full file) |
| Pattern-1 integration verified | `.claude/skills/copilotkit-integrations/references/integrations/mastra.md` |
| 4 memory types (1.5 used) | `.claude/skills/mastra/SKILL.md:196` |
