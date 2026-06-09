---
title: Mastra Phase 0 — Forensic Audit & Progress Tracker
date: 2026-06-06
auditor: Cursor (senior software specialist / forensic mode)
scope: SAN-589 · SAN-590 · SAN-605 · PR #95 · PR #96 · PR #97 · epic SAN-588
method: disk grep · Vitest · prod curl · Supabase SQL · Linear MCP · GitHub PR metadata
skills: `.agents/skills/mastra/SKILL.md` (canonical) · `.claude/skills/mastra` (symlink restored)
companion: [june-5-mastra-tasks.md](./june-5-mastra-tasks.md) · [SAN-589 evidence](../evidence/SAN-589-agt-00c-2026-06-06.md)
main_head: `0ae842d` (PR #97 hotfix on top of PR #95 `f3e7713`)
---

# Mastra Phase 0 — Forensic Audit (2026-06-06)

> **One-line verdict:** **SAN-589 code is on `main` and tests are green, but Patricia still has no proven prod agent-path traces** — flip Done only after one live turn writes `ai_runs.metadata.tool_spans`. **SAN-590 (PR #96) is merge-ready engineering with floor green; prod `/api/scorers` stays 404 until merge.** **SAN-605 has zero disk artifacts — Linear “In Progress” is ahead of reality.**

**Dot legend:** 🟢 complete / ready · 🟡 in progress / minor gap · 🔴 failed / blocker · ⚪ not started

---

## Executive scoreboard

| Metric | Jun-5 baseline | **Jun-6 now** | Dot |
|---|---:|---:|---|
| Phase 0 implementation | 0% | **~42%** (1 of 4 shipped; 1 in PR) | 🟡 |
| Production readiness (instrumented) | 62% | **68%** | 🟡 |
| MVP demo readiness (Camila chat) | 74% | **74%** | 🟡 |
| Hallucination measurement | 0 scorers | **0 on prod** (PR #96 pending) | 🔴 |
| Ops tracing (agent path) | 0 proven spans | **0 proven prod spans** | 🔴 |
| Mastra Vitest (`src/mastra`) | 179/181 | **237/237 PASS** | 🟢 |
| Will Phase 0 succeed? | Yes | **Yes** — no API blockers | 🟢 |

### Persona impact today vs after Phase 0

| Persona | Real-world example today | After 589+590+605+591 |
|---|---|---|
| **Camila** — *"1BR Laureles under $80"* | Gets rental cards; if model invents *"Casa Falsa $65/night"*, **nothing catches it**. Fast-path may skip agent → **no `ai_runs` row**. | Faithfulness flags invented listing; telemetry shows `search-rentals` took 2.1s |
| **Tourist** — *"quiet rooftop dinner Provenza"* | Restaurant fast-path returns cards; **no scorer, no span proof on prod** | Coverage scorer catches extra venue names not in tool JSON |
| **Patricia** (ops) | Sees coarse `ai_runs` history; **cannot trust `agt-00c-v1` rows** (only 2 synthetic test inserts) | Every agent turn: tool spans + faithfulness rate in CI |
| **Roberto** (host) | Publish HITL works; **7 agents exposed on runtime** | Allowlist + traces on publish path |
| **Sofía** (dev) | `mastra` skill symlink was **missing from scan root** | Restored → `.claude/skills/mastra` → `.agents/skills/mastra` |

---

## Progress tracker — Phase 0 (implementation order)

| # | Linear | AGT | Dot | **% complete** | Grade | Linear status | Disk / PR state |
|---:|---|---|---|---:|---|---|---|
| 1 | [SAN-589](https://linear.app/sanjiovani/issue/SAN-589) | 00C Telemetry | 🟡 | **82%** | B+ | In Progress | **MERGED** PR #95 + hotfix PR #97 on `main` |
| 2 | [SAN-590](https://linear.app/sanjiovani/issue/SAN-590) | 00A Faithfulness | 🟡 | **75%** | B | In Progress | **OPEN** [PR #96](https://github.com/amo-tech-ai/mdeapp/pull/96) |
| 3 | [SAN-605](https://linear.app/sanjiovani/issue/SAN-605) | 00B Grounding coverage | ⚪ | **0%** | — | In Progress ⚠️ | **No branch / no files** |
| 4 | [SAN-591](https://linear.app/sanjiovani/issue/SAN-591) | 00D Allowlist | ⚪ | **0%** | — | Todo | Not started |

**Correct implementation order (unchanged):** `589 → 590 → 605 → 591` then Phase 1 spine (`592 → 606 → 593 → …`). Full backlog order: [june-5 § Recommended execution order](./june-5-mastra-tasks.md#recommended-execution-order-v3--2026-06-06-review).

---

## Verification tests run (2026-06-06, this audit)

| # | Command / probe | Result | Notes |
|---|---|---|---|
| T1 | `npm test -- --run src/mastra` on `main` @ `0ae842d` | **237/237 PASS** | Was 179/181 on Jun-5; storage flake not reproduced |
| T2 | SAN-589 suites (telemetry + ai-runs) | **27/27 PASS** | 6 files |
| T3 | PR #96 branch `faithfulness.test.ts` | **8/8 PASS** | Checked out branch, ran, restored `main` |
| T4 | Prod `GET /` | **200** | Tier-1 OK |
| T5 | Prod `chat-smoke.mjs --base https://www.mdeai.co` | **PASS** | Events/rentals API shape OK |
| T6 | Prod `GET /api/scorers` | **404** | Expected until PR #96 merges |
| T7 | Prod `GET /api/observability/traces` | **404** | **By design** — Pattern-1 uses `ai_runs`, not `@mastra/observability` |
| T8 | Supabase: `ai_runs` with `telemetry_version=agt-00c-v1` | **2 rows** | Both `duration_ms=1234`, `search-attractions` — **manual test inserts, not prod browser turns** |
| T9 | Supabase: agent-path rows after PR #97 deploy (`10:12 UTC+`) | **0 rows** | Post-hotfix prod proof **not yet captured** |
| T10 | PR #95 floor CI | **SUCCESS** | Merge `f3e7713` |
| T11 | PR #96 floor CI | **SUCCESS** | Open, mergeable |
| T12 | PR #97 merged | **SUCCESS** | `0ae842d` — insert deadline 500ms → 2500ms |
| T13 | `grep createScorer src/mastra` on `main` | **0 hits** | Scorers only on PR #96 branch |
| T14 | Mastra skill symlink | **RESTORED** | `.claude/skills/mastra` → `.agents/skills/mastra` |

---

## Per-task forensic reports

### SAN-589 — AGT-00C Mastra Telemetry & AI Tracing

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **94%** (unchanged) |
| **Implementation % complete** | **82%** |
| **Done-gate % complete** | **72%** |
| **Grade** | **B+** |
| **Will succeed?** | **Yes** — already merged |
| **Production-ready?** | **Partial** — code live; **prod proof missing** |

**What shipped (PR #95 + #97):**

- Pattern-1 telemetry: `LoggingMastraAgent` → `runAuditedSearch` / `runAuditedTool` → `recordToolSpan` → `buildTurnTelemetryMetadata(agt-00c-v1)` → `recordMastraRun` → `ai_runs`
- Key files: `mastra-telemetry.ts`, `tool-audit-context.ts`, `run-audited-search.ts`, `logging-mastra-agent.ts`, `ai-runs.ts`
- Hotfix PR #97: insert race **500ms → 2500ms** (prod inserts observed ~533–1376ms; writes were silently skipped)

**Real-world example:** Camila asks *"Find scenic parks near Laureles — use your search tools"* → agent calls `search-grounded-places` → Patricia should see `tool_spans: [{ tool: "search-grounded-places", duration_ms: … }]`. **We have not verified this row on prod after `0ae842d`.**

**Red flags / failure points:**

| Severity | Issue | Impact |
|---|---|---|
| 🔴 **P0** | No prod agent-path `ai_runs` proof after hotfix deploy | SAN-589 cannot flip **Done** |
| 🟡 **P1** | Fast-path traps (`café`, `events`, `restaurant` keywords) bypass agent → **no telemetry** for common Camila prompts | Ops blind on majority of `/` traffic |
| 🟡 **P1** | `input_tokens` / `output_tokens` always **0** until AG-UI stream feeds `RequestContext` | Cost/latency dashboards incomplete |
| 🟡 **P2** | Spec mentioned `/api/observability/traces` — **not built** (acceptable: re-scoped to `ai_runs`) | Update Linear acceptance criteria |
| 🟡 **P2** | PR #95 squash message **"Part of SAN-589"** — no `Closes SAN-589` | Linear won't auto-close |

**Corrections before Done:**

1. Run **one prod agent-path prompt** (avoid fast-path keywords): e.g. *"Find scenic parks and viewpoints near Laureles — use your search tools"*
2. SQL proof: `metadata->>'telemetry_version' = 'agt-00c-v1'` AND `jsonb_array_length(metadata->'tool_spans') >= 1` AND `duration_ms != 1234`
3. Append row id + screenshot to `tasks/mastra/evidence/SAN-589-agt-00c-2026-06-06.md`
4. Linear comment + flip **Done**
5. Document fast-path vs agent-path in evidence (Patricia needs both — see SAN-627 AGT-18)

**Tests:** 🟢 27/27 unit · 🟢 floor on merge · 🔴 prod agent-path

---

### SAN-590 — AGT-00A Hallucination / Faithfulness Scorer

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **92%** |
| **Implementation % complete** | **75%** (branch) / **0%** (prod) |
| **Grade** | **B** |
| **Will succeed?** | **Yes** |
| **Production-ready when merged?** | **Partial** — measurement layer only, not runtime enforcement |

**What PR #96 adds (+713 / −2, 10 files):**

| File | Role |
|---|---|
| `src/mastra/scorers/faithfulness-core.ts` | Deterministic claim extract + support check (LLM-free) |
| `src/mastra/scorers/faithfulness.ts` | `createScorer` wrapper + optional Gemini judge (demotes false positives) |
| `src/mastra/scorers/verdict-schema.ts` | Shared Zod schema (reuse for SAN-605) |
| `src/mastra/scorers/index.ts` | Registry → `Mastra({ scorers })` |
| `src/app/api/scorers/route.ts` | `GET /api/scorers` lists registered scorers |
| `scripts/intelligence/faithfulness-smoke.ts` | Golden fixtures FAITH-01…05 |
| `scripts/intelligence/golden-queries-smoke.ts` | Wires faithfulness rate into golden smoke |

**Real-world example:** Tool returns *Casa Verde* + *Mirador Laureles*; model replies *"Try Hotel Skyline Penthouse $9.9M/month"* → scorer **fail** (FAITH-02 fixture). Today on prod: **404 `/api/scorers`** — zero measurement.

**Red flags / failure points:**

| Severity | Issue | Impact |
|---|---|---|
| 🟡 **P1** | Scorer **not invoked on live CopilotKit turns** — registry + offline smoke only | Camila still unprotected at runtime until AGT-606 |
| 🟡 **P1** | `.claude/skills/mastra/evals/evals.json` **not wired** — fixtures live inline in smoke scripts | Drift risk vs documented eval pack |
| 🟡 **P2** | SAN-592 (structured output) parallel schema work — PR uses `generateObject` directly | Dedupe when 592 lands |
| 🟢 | Uses `@mastra/core/evals` `createScorer` ✅ | Correct API (not missing `@mastra/evals` package) |
| 🟢 | Judge disabled without API key / `faithfulnessJudge=false` | CI stays deterministic + free |

**Corrections before Done:**

1. **Merge PR #96** after SAN-589 prod proof (or stack if policy allows)
2. Prod: `GET /api/scorers` → `{ count: 1, scorers: [{ id: "faithfulness", … }] }`
3. Run `npm run smoke:faithfulness` + golden-queries smoke in CI evidence
4. Wire `evals.json` or document single source of truth for fixtures
5. Linear: add note that **runtime enforcement = SAN-606**, not 590

**Tests:** 🟢 8/8 faithfulness unit · 🟢 PR floor · 🔴 prod endpoint

---

### SAN-605 — AGT-00B Grounding-Coverage Scorer

| Field | Value |
|---|---|
| **Dot** | ⚪ |
| **Spec % correct** | **93%** |
| **Implementation % complete** | **0%** |
| **Grade** | **—** (not started) |
| **Will succeed?** | **Yes** — thin extension of 590 judge + `verdict-schema.ts` |
| **Production-ready?** | **No** |

**Real-world example:** Tool returns 3 restaurants; reply mentions 5 names — **coverage scorer** flags the 2 extras that faithfulness might miss if names sound plausible.

**Red flags:**

| Severity | Issue |
|---|---|
| 🔴 | Linear status **In Progress** but **no branch, no PR, no files** — status drift |
| 🟡 | Must **share judge + schema with 590** — do not duplicate LLM pipeline |
| 🟡 | User scope: **do not start until 590 merged** |

**Corrections:**

1. Reset Linear to **Todo** until PR #96 merges
2. Branch `ai/san-605-agt-00b-grounding-coverage-scorer` off `main` post-590
3. Add `groundingCoverageScorer` beside `faithfulnessScorer` in `scorers/index.ts`
4. Extend smoke fixtures: FAITH-* + COV-* pairs

---

## Pull request reviews

### PR #95 — SAN-589 telemetry (`f3e7713`) — MERGED 🟢

| Criterion | Score | Notes |
|---|---:|---|
| Scope discipline | 95% | Telemetry only; no INT-021 / ranking changes |
| Test coverage | 92% | 23→27 tests after hotfix branch |
| Architecture | 94% | Correct Pattern-1; avoids `@mastra/observability` gap |
| Prod proof | **0%** | Merge ≠ Done |
| **Overall PR grade** | **A−** | Ship was right; Done gate incomplete |

**Critical fix discovered post-merge:** PR #97 (insert timeout) — **required for prod writes**.

---

### PR #97 — ai_runs hotfix (`0ae842d`) — MERGED 🟢

| Criterion | Score | Notes |
|---|---:|---|
| Root-cause fix | 98% | 500ms race vs ~1.3s Supabase insert |
| Risk | Low | Best-effort writer; still non-blocking |
| **Overall** | **A** | Must verify prod row after deploy |

---

### PR #96 — SAN-590 faithfulness — OPEN 🟡

| Criterion | Score | Notes |
|---|---:|---|
| API correctness | 96% | `createScorer` + `listScorers` + route |
| Test coverage | 88% | 8 unit tests; smoke scripts; no e2e turn scoring |
| Shared schema | 90% | `verdict-schema.ts` ready for 605 |
| CI | 100% | Floor green, Vercel preview green |
| Prod | 0% | Not on `main` |
| **Overall PR grade** | **B+** | Merge-ready; clarify runtime vs measurement scope |

**Merge blockers (soft):** SAN-589 prod proof (process, not code conflict).

---

## Full Mastra backlog — implementation order

| Order | SAN | AGT | Phase | Dot (Jun-6) | % | Next action |
|---:|---|---|---|---|---:|---|
| 1 | 589 | 00C | 0 | 🟡 | 82% | Prod agent-path proof → Done |
| 2 | 590 | 00A | 0 | 🟡 | 75% | Merge PR #96 |
| 3 | 605 | 00B | 0 | ⚪ | 0% | Start after 590 merge |
| 4 | 591 | 00D | 0 | ⚪ | 0% | Allowlist 2 agents |
| 5 | 592 | 03 | 1 | ⚪ | 0% | Shared scorer judge schema |
| 6 | 606 | 04A | 1 | ⚪ | 0% | Runtime grounding enforcement |
| 7 | 593 | 05 | 1 | ⚪ | 0% | hostEventAgent processors |
| 8 | 594 | 06 | 1 | ⚪ | 0% | Cache + CostGuard |
| 9 | 595 | 01 | 1 | ⚪ | 0% | Native approval (publish) |
| 10 | 596 | 04B | 1 | ⚪ | 0% | Prompt scrubber |
| 11 | 598 | 04C | 1 | ⚪ | 0% | PII (optional launch) |
| 12 | 607 | 15 | 2 | ⚪ | 0% | Compensation (blocks 601/602 Done) |
| 13 | 601 | 11 | 2 | ⚪ | 0% | Checkout wf (blocked PAY-001) |
| 14 | 602 | 12 | 2 | ⚪ | 0% | Publish wf |
| 15 | 597 | 02 | 2 | ⚪ | 0% | Resource memory |
| 16 | 608 | 14 | 2 | ⚪ | 0% | Suspend/resume host wizard |
| 17 | 609 | 16 | 2 | ⚪ | 0% | context.writer streaming |
| 18 | 600 | 09 | 2 | ⚪ | 0% | Background tasks |
| 19 | 599 | 07 | 2 | ⚪ | 0% | toModelOutput |
| 20 | 610 | 13 | 3 | ⚪ | 0% | Memory processors |
| 21 | 603 | 08 | 3 | ⚪ | 0% | Semantic recall |
| 22 | 604 | 10 | 3 | ⚪ | 0% | WhatsApp/A2A spike doc |
| 23 | 611 | 17 | 1 | ⚪ | 0% | Golden query suite (after 590/605) |
| 24 | 627 | 18 | 1 | ⚪ | 0% | Unified search latency (fast-path + agent) |

Epic: [SAN-588](https://linear.app/sanjiovani/issue/SAN-588). Detail specs: [june-5-mastra-tasks.md](./june-5-mastra-tasks.md).

---

## Critical fixes (priority order)

| Pri | Fix | Owner | Dot |
|---|---|---|---|
| **P0** | Prod agent-path `ai_runs` row with real `tool_spans` after `0ae842d` | SAN-589 | 🔴 |
| **P0** | Merge PR #96 → prod `/api/scorers` 200 | SAN-590 | 🟡 |
| **P1** | Reset SAN-605 Linear to Todo until code exists | SAN-605 | 🔴 |
| **P1** | Flip SAN-588 epic → **In Progress** | SAN-588 | 🟡 |
| **P1** | Runtime allowlist (7 agents exposed, 2 used) | SAN-591 | ⚪ |
| **P2** | Wire `evals.json` or consolidate fixture source | SAN-590/611 | 🟡 |
| **P2** | Token usage from AG-UI stream into telemetry | SAN-589 follow-up | 🟡 |
| **P2** | Document fast-path vs agent-path for ops (AGT-18) | SAN-627 | ⚪ |

---

## Is the `mastra` skill correct?

**Yes.** Use **`.agents/skills/mastra/SKILL.md`** (canonical, 37 files). Runtime scan root: **`.claude/skills/mastra`** — symlink was **missing** during this audit and is **restored**.

| Skill | When to load |
|---|---|
| **`mastra`** ✅ | Any `mdeapp/src/mastra/**` edit — agents, tools, scorers, workflows, telemetry |
| `mastra-smoke-test` | Post-change smoke only |
| `copilotkit` + `copilotkitV1` | CopilotKit wiring (`/api/copilotkit`, `useCoAgent`) |
| ~~`mastra-routing`~~ | **Archived** — do not load for Phase 1 |

---

## Best practices compliance

| Rule | Jun-5 | **Jun-6** | Dot |
|---|---|---|---|
| Tracing before tuning | 🔴 | 🟡 code on main; prod unproven | 🟡 |
| Tool results = truth (measured) | 🔴 | 🔴 scorers not on prod | 🔴 |
| Tool results = truth (enforced) | 🔴 | 🔴 AGT-606 not started | 🔴 |
| Two agents in prod UI | 🟡 | 🟡 | 🟡 |
| Runtime exposes 7 agents | 🔴 | 🔴 | 🔴 |
| Gemini-only AI | 🟢 | 🟢 | 🟢 |
| No `@mastra/observability` without package | 🟢 | 🟢 Pattern-1 | 🟢 |
| CopilotKit 1.55.2 v1 only | 🟢 | 🟢 | 🟢 |
| Done = localhost + prod proof | 🔴 | 🔴 SAN-589 | 🔴 |

---

## Will the tasks succeed? Production ready?

| Question | Answer |
|---|---|
| **Will SAN-589 succeed?** | **Yes** — merged; only Done gate remains |
| **Will SAN-590 succeed?** | **Yes** — PR #96 is sound; merge after 589 proof |
| **Will SAN-605 succeed?** | **Yes** — if it reuses 590 schema/judge (≤1d) |
| **Production ready today?** | **No — 68%** · demo chat works; ops/quality layer unproven on prod |
| **Production ready after Phase 0?** | **~75%** — measured + traced; enforcement still Phase 1 (606) |
| **Biggest remaining risk** | Declaring Done without prod SQL proof · fast-path hiding telemetry |

---

## Immediate next steps (systematic plan)

```
1. Prod agent-path prompt on mdeai.co (post 0ae842d)
   → verify: ai_runs row tv=agt-00c-v1, spans≥1, duration_ms≠1234

2. Update tasks/mastra/evidence/SAN-589-agt-00c-2026-06-06.md + Linear SAN-589 → Done

3. Merge PR #96 (SAN-590)
   → verify: prod GET /api/scorers → 200, count≥1
   → verify: npm run smoke:faithfulness PASS

4. Fresh worktree: ai/san-605-agt-00b-grounding-coverage-scorer (after 590)
   → verify: shared verdict-schema, COV fixtures, floor green

5. SAN-591 allowlist (~15 min)
   → verify: Vitest exposes ≤2 agents on CopilotKit runtime
```

---

## Summary grades

| Artifact | Grade | % correct |
|---|---|---:|
| SAN-589 implementation | B+ | 82% |
| SAN-589 Done gate | C+ | 72% |
| PR #95 | A− | 91% |
| PR #97 hotfix | A | 98% |
| SAN-590 / PR #96 | B+ | 75% |
| SAN-605 | — | 0% |
| Phase 0 overall | C+ | 42% |
| Roadmap / specs (SAN-588) | A | 95% |
| **Mastra skill routing** | A | 100% |

---

*Audit completed 2026-06-06 · Re-run after SAN-589 prod proof + PR #96 merge.*
