---
title: Mastra Linear Backlog — Forensic Task Audit
date: 2026-06-06
auditor: Cursor (senior software specialist / forensic mode)
scope: Linear view [Mastra](https://linear.app/sanjiovani/view/mastra-09ffbf4ba37e) · epic SAN-588 + 23 children (SAN-589…610)
method: Linear MCP + disk grep + Vitest + prod curl + @mastra/core@1.35.0 API probe + skill cross-check
skills_consulted:
  - .claude/skills/mastra/SKILL.md
  - tasks/mastra/plan/1-agents-plan.md (v2)
  - tasks/mastra/plan/2-mastra-surface-gap-analysis.md
  - tasks/mastra/audit/june5-mastra-audit.md (baseline)
companion: june5-mastra-audit.md (runtime architecture) · 1-agents-plan.md (roadmap)
---

# Mastra Linear Backlog — Forensic Audit (2026-06-06)

> **What this audits:** Every issue under epic **SAN-588** in the [Mastra Linear view](https://linear.app/sanjiovani/view/mastra-09ffbf4ba37e). Grades score **spec correctness + executability**, not shipped code — **0 of 23 child tasks are Done** as of this audit.
>
> **Dot legend:** 🟢 ready (≥90%) · 🟡 minor fixes (75–89%) · ⚪ defer / partial spec (50–74%) · 🔴 blocker / wrong (<50%)

---

## Executive verdict

| Metric | Value | Dot |
|---|---|---|
| **Epic roadmap spec quality** | **95%** (external review 2026-06-06) | 🟢 |
| **Overall architecture (unchanged since june5)** | **B− (6.5/10)** | 🟡 |
| **Production readiness today** | **62%** | 🔴 |
| **MVP demo readiness today** | **74%** | 🟡 |
| **Backlog implementation progress** | **0%** (0/23 Done) | 🔴 |
| **Will Phase 0 succeed if started now?** | **Yes** — APIs verified, no upgrade blockers | 🟢 |
| **Is the stack production-instrumented today?** | **No** — 0 scorers, 0 trace spans | 🔴 |

**One-line answer:** The **roadmap is validated at 95/100** — Phase 0 order, AGT-15 gating, and MVP focus are correct. The **product is still not production-instrumented** (62%). **Start SAN-589 (tracing)** — you cannot measure any other task without it.

### External review incorporated (2026-06-06)

| Change | Action |
|---|---|
| AGT-02 too late in Phase 3 | **Moved to #15** — after 601/602, before 608 (`index-mastra.md`) |
| AGT-04A text-only risk | Explicit acceptance: **Rental · Event · Restaurant · Venue** cards |
| AGT-14 snapshots vague | **Resume-from-step** — fail at step 3 → resume at step 3 |
| Missing golden dataset | **AGT-17 proposed** — 70 queries; file Linear after 590/605 |
| "~25% adoption" misleading | **25% total surface · 60–70% useful MVP surface** |

---

| Persona | Today | After Phase 0 (589/590/605/591) |
|---|---|---|
| **Camila** asks *"1BR Laureles under $80"* | Gets cards + pins; if the model invents a fake listing, **nothing catches it** | Faithfulness scorer flags invented IDs; traces show which tool was slow |
| **Tourist** asks *"quiet rooftop dinner Provenza"* | 10s spinner on heavy grounding; **no progress stream** | Same UX today; AGT-16 (609) fixes perceived wait later |
| **Roberto** publishes at `/host/event/new` | CopilotKit HITL works; **no server-side approval gate** | Traces show publish path; allowlist stops rogue agent calls |
| **Patricia** (ops) | **Blind** — only coarse `ai_runs` rows | Trace dashboard + scorer pass/fail rates |
| **Andrés** (tickets) | ~20% — no Mastra checkout | Unchanged until PAY-001 + AGT-11 (601) |

---

## Verification tests run (2026-06-06)

| # | Command / probe | Result | Notes |
|---|---|---|---|
| T1 | `npm test -- src/mastra --run` | **179/181 pass** | 2 fails in `storage.test.ts` (expects Postgres log, got LibSQL under Infisical dev) — **pre-existing env flake**, not backlog-related |
| T2 | `npm test -- src/mastra/agents src/mastra/tools src/mastra/lib/agent-memory.test.ts --run` | **85/85 pass** | Agent + tool layer healthy |
| T3 | `grep createScorer\|semanticRecall\|requireApproval\|context.writer src/mastra` | **0 hits** | Confirms adoption gaps the tasks target |
| T4 | `@mastra/core@1.35.0` API probe | `createScorer` ✅ · processors ✅ · `@mastra/evals` ❌ · `@mastra/rag` ❌ | Matches plan §5b |
| T5 | Prod `GET /api/scorers` | **404** | AGT-00A/B not shipped |
| T6 | Prod `GET /api/observability/traces` | **404** | AGT-00C not shipped |
| T7 | Prod `POST /api/copilotkit` empty body | **400** (not 5xx) | Runtime alive |
| T8 | `node tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co` | **PASS** | Concierge path works on prod |
| T9 | Prod `GET /` | **200** | Tier-1 OK |
| T10 | `logging-mastra-agent.ts:83` | `mastra.listAgents()` unconditional | AGT-00D gap confirmed |
| T11 | `host-event.ts` | `tools: {}`, no `inputProcessors` | AGT-05 gap confirmed |
| T12 | `search-venue-anchors` imports | `cafe-browse.ts`, `nightlife-browse.ts` | **Not orphaned** — june5 correction stands |
| T13 | Linear MCP `parentId: SAN-588` | **23 children** listed | Matches plan AGT-00…16 |

---

## Current baseline (disk, not plan)

| Area | State | Evidence |
|---|---|---|
| Agents registered | 7 | `src/mastra/index.ts:23-31` |
| Agents UI-invoked | 2 (`conciergeAgent`, `hostEventAgent`) | `concierge-coagent-context.tsx`, host bridge |
| Runtime exposed | **All 7** via `listAgents()` | `logging-mastra-agent.ts:83` |
| Tools | 8, Zod-wrapped, audited | june5 audit §2 |
| Workflows | 3 serial, **unused in prod chat** | no suspend/branch/retries in `workflows/` |
| Scorers | **0** | prod 404 |
| Traces | **0 spans** | prod 404 |
| Input processors | Concierge only (`TokenLimiter` + prod injection guard) | `agent-input-processors.ts` |
| Output processors | **0** | grep |
| Memory | Thread WM only, `lastMessages: 20`, no `semanticRecall` | `agent-memory.ts:5-16` |
| Host publish HITL | CopilotKit `preview_and_publish` action | `host-event-copilot-bridge.tsx:107` — **not** Mastra `requireApproval` yet |

---

## Grading system

| Dot | Spec % correct | Meaning |
|---|---|---|
| 🟢 | 90–100% | Spec matches disk + Mastra API; execute as written |
| 🟡 | 75–89% | Minor description/dependency fixes before coding |
| ⚪ | 50–74% | Correctly deferred or needs scope clarification |
| 🔴 | <50% | Wrong API, missing dependency, or will fail without redesign |

**Per-task columns:** Spec % · Will succeed? · Prod-ready when Done? · Corrections

---

## Epic

### SAN-588 — AGT-00 Mastra Agent Feature Adoption (epic)

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **86%** |
| **Will succeed?** | Yes — phased, APIs verified |
| **Prod-ready when Done?** | Epic alone = N/A; **Phase 0 children** move prod readiness ~62% → ~75% |
| **Linear status** | Backlog |

**What's right:** Problem statement (empty quality + observability), Phase 0 first, `@mastra/core` not `@mastra/evals`, dependency mermaid, explicit "do NOT" list (v2 migration, supervisor, MCP runtime).

**Corrections:**

1. **Epic body Phase 1 still lists "resource memory (AGT-02)"** — plan v2 moved **SAN-597 → Phase 3**. Update epic description to match `1-agents-plan.md` §3.
2. **Epic lists AGT-13…16 only in gap doc** — add one line: "Surface gaps AGT-13…16 filed SAN-610/608/607/609."
3. **SLA dates on Urgent children (589/590/605) show breached 2026-06-07** — either start Phase 0 or reset SLA; stale SLA erodes trust.
4. **0% implementation** — epic should be **In Progress** when SAN-589 starts, not Backlog.

**Real-world example:** Treating SAN-588 as "future nice-to-have" while Camila ships on prod = operating a **live AI search product with no quality dashboard**. The epic is the fix for Patricia's blindness, not framework exploration.

---

## Phase 0 — Production Safety

### SAN-589 — AGT-00C Telemetry & AI Tracing

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **94%** |
| **Will succeed?** | Yes — config in `index.ts`, ~0.5d |
| **Prod-ready when Done?** | **Partial** — ops visibility, not user-facing |
| **Status** | Todo · Urgent |

**Corrections:**

1. **Do first** (plan order 00C → 00A → 00B → 00D) — spec is correct; enforce in sprint board.
2. Acceptance must include **prod proof**: non-empty trace after one concierge turn (not just Studio :4111).
3. Document exporter destination (Console vs OTLP vs Vercel) — spec may be vague; pick one before coding.

**Real-world example:** Camila's *"salsa this weekend"* takes 8s. Without traces, Sofía guesses whether Maps grounding or Gemini rerank is slow. With SAN-589, Patricia sees **per-tool span duration** and fixes the right layer.

**Tests to run when Done:** localhost turn → traces API ≥1 span; prod smoke after deploy.

---

### SAN-590 — AGT-00A Hallucination / Faithfulness Scorer

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **92%** |
| **Will succeed?** | Yes — `createScorer` in core |
| **Prod-ready when Done?** | **Yes** (measurement layer) |
| **Status** | Todo · Urgent |

**Corrections:**

1. Wire **`evals.json`** cases (`.claude/skills/mastra/evals/evals.json`) into CI sample — file exists but is **unwired**.
2. Use **`createScorer` from `@mastra/core/evals`**, not `@mastra/evals` package (absent on disk).
3. Block on **SAN-592 (AGT-03)** only if judge shares Zod schema — can stub schema in 590 then dedupe in 592; dependency is soft, not hard.

**Real-world example:** Model says *"Casa Verde, $65/night, Laureles"* but search returned 0 rentals — scorer should score **fail** before Andrés clicks a dead link.

**Tests:** Vitest scorer unit + sample trace from evals.json; prod `/api/scorers` not 404.

---

### SAN-605 — AGT-00B Grounding-Coverage Scorer

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **93%** |
| **Will succeed?** | Yes — thin extension of 590 |
| **Prod-ready when Done?** | Yes (with 590) |
| **Status** | Todo · Urgent |

**Corrections:**

1. **Must share judge + schema with 590** — spec says this; enforce single PR stack or 590→605 sequential merge.
2. Do **not** build a second LLM judge pipeline (plan anti-pattern).

**Real-world example:** Tool returns 3 restaurants; reply mentions 5 names — coverage scorer catches the **2 fabricated** ones faithfulness might miss if they're plausible names.

---

### SAN-591 — AGT-00D Runtime Agent Allowlist

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **95%** |
| **Will succeed?** | Yes — ~15 min |
| **Prod-ready when Done?** | Yes (defense-in-depth) |
| **Status** | Todo · High |

**Corrections:**

1. Allowlist: `{ conciergeAgent, hostEventAgent }` (+ optional `pingAgent` for smoke only in dev).
2. Add Vitest: mocked `listAgents()` with 7 keys → route exposes ≤2.
3. Priority is **P1 not P0** — spec honest; keep in Phase 0 slot for cost.

**Real-world example:** A script POSTing to `/api/copilotkit` with `agent: routerAgent` today can bypass Camila's single-agent UX — allowlist closes that hole.

---

## Phase 1 — Core Reliability

### SAN-592 — AGT-03 Structured Output (evaluationAgent / scorer judge)

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **91%** |
| **Will succeed?** | Yes |
| **Prod-ready when Done?** | Yes — foundational |
| **Status** | Backlog · High |

**Corrections:**

1. Gemini + tools + structured output → set **`jsonPromptInjection: true`** (plan house rule #9).
2. Shared Zod schema file used by **590/605/592** — create `src/mastra/scorers/schemas/` early.

**Real-world example:** Reranker returns malformed JSON → silent bad card order. Structured output makes failure **loud in logs**.

---

### SAN-606 — AGT-04A Grounding-Assertion Output Processor

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **90%** (was 82%) |
| **Will succeed?** | Yes, with design time |
| **Prod-ready when Done?** | **Yes — highest user-facing safety win in Phase 1** |
| **Status** | Backlog · High |

**Corrections:**

1. **Blocked by 590/605/592** for test fixtures — implement after scorers define "grounded" precisely.
2. **Explicit card-kind acceptance (review 2026-06-06):** grounding validation must cover generative UI payloads for:
   - **Rental card** (`data-testid="rental-card"`)
   - **Event card** (`data-testid="event-card"`)
   - **Restaurant card** (`data-testid="restaurant-card"`)
   - **Venue / grounded card** (`data-testid="grounded-card"`)
   Text-only citation checks are insufficient — developers often skip cards.
3. Add Playwright: forced bad reply → processor blocks or replaces (dev flag).

**Real-world example:** Enforces prompt clause *"tool results are the only truth"* at runtime — Tourist can't get a fabricated *"Rooftop X in Provenza"* when Maps returned nothing.

---

### SAN-593 — AGT-05 Input-Processor Coverage

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **96%** |
| **Will succeed?** | Yes — trivial |
| **Prod-ready when Done?** | Yes |
| **Status** | Backlog · High |

**Corrections:**

1. **Verified gap:** `hostEventAgent` has no `inputProcessors`; concierge does — apply `getDefaultInputProcessors()`.
2. `UnicodeNormalizer` — confirm import path `@mastra/core/processors` (class exists in dist).

**Real-world example:** Roberto pastes event description with homoglyph spam — normalizer + injection guard protect publish wizard parity with chat.

---

### SAN-594 — AGT-06 ResponseCache + CostGuard

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **85%** |
| **Will succeed?** | Yes, tune TTL carefully |
| **Prod-ready when Done?** | Yes |
| **Status** | Backlog · High |

**Corrections:**

1. Cache key must include **intent + normalized query + neighborhood** — not raw string only (Camila refines "under $80" → "$75").
2. **Measure via SAN-589 first** — otherwise cache hit rate is invisible.
3. CostGuard thresholds need env vars documented in Infisical.

**Real-world example:** Camila re-asks *"1BR Laureles under $80"* on `/` — cache skips second full Gemini round-trip (LESSONS.md latency).

---

### SAN-595 — AGT-01 Native Tool-Approval

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **78%** |
| **Will succeed?** | Partial — publish yes; checkout blocked |
| **Prod-ready when Done?** | **Publish half only** until PAY-001 |
| **Status** | Backlog · High |

**Corrections:**

1. **`preview_and_publish` is CopilotKit `useCopilotAction`**, not a Mastra tool today — AGT-01 must either (a) migrate to Mastra tool with `requireApproval`, or (b) document dual-layer CK HITL + Mastra gate. Spec should name **`host-event-copilot-bridge.tsx`** explicitly.
2. **Demoted P0→P1 is correct** — checkout doesn't exist in Mastra yet.
3. Do **not** mark Done until server-side pause proven without UI (API test).

**Real-world example:** Roberto approves publish in UI, but a bug bypasses React — native approval keeps **`preview_and_publish`** paused server-side until `respond()`.

---

### SAN-596 — AGT-04B SystemPromptScrubber

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **94%** |
| **Will succeed?** | Yes — ~1 line config |
| **Prod-ready when Done?** | Yes (hygiene) |
| **Status** | Backlog · Medium |

**Corrections:** Ship in same PR as 598 if touching output processors. Low priority vs 606.

---

### SAN-598 — AGT-04C PII Protection

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **90%** |
| **Will succeed?** | Yes |
| **Prod-ready when Done?** | Yes (low exposure MVP) |
| **Status** | Backlog · Medium |

**Corrections:** Honest deferral OK for launch — English MVP collects little PII in chat. Don't block Phase 0 on this.

---

### SAN-597 — AGT-02 Resource-Scoped Working Memory

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **92%** (was 88%) |
| **Will succeed?** | Yes post-launch |
| **Prod-ready when Done?** | UX win — **moved earlier per review** |
| **Status** | Backlog · Medium · **Phase 2 tail** (was Phase 3 only) |

**Corrections:**

1. **Reprioritized 2026-06-06:** build **after 601/602**, **before 608/609** — unlocks AGT-13/08 sooner.
2. Requires **`resourceId` = auth user** — already threaded in copilotkit route; verify in tests.
3. Order within memory cluster: **597 → 610 → 603** (unchanged).

**Real-world example:** Camila opens new thread — still remembers budget band from last week (resource WM).

---

## Phase 2 — Business Workflows

### SAN-601 — AGT-11 Checkout Workflow

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **80%** |
| **Will succeed?** | **Blocked** until PAY-001 (SAN-178) |
| **Prod-ready when Done?** | No until Stripe path exists |
| **Status** | Backlog · Medium |

**Corrections:**

1. **Hard dependency PAY-001** — spec mentions; enforce `blockedBy` in Linear.
2. **Mandatory co-requisite SAN-607 (AGT-15)** — cannot mark Done without compensation.
3. Scope guard: wrap Stripe, don't duplicate webhook idempotency.

**Real-world example:** Andrés buys ticket — workflow validates cart → PaymentIntent → HITL → finalize with rollback if DB write fails.

---

### SAN-602 — AGT-12 Host Publish Workflow

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **81%** |
| **Will succeed?** | After EVT-002 (SAN-366) prod proof |
| **Prod-ready when Done?** | Yes with 607 |
| **Status** | Backlog · Medium |

**Corrections:**

1. Coordinate **SAN-366** host publish prod evidence first.
2. Requires **607** for retry/compensation on failed publish.
3. Today publish is **prompt + CK HITL** — workflow replaces nondeterminism, not UI.

**Real-world example:** Roberto publish fails mid-write — workflow compensates (unpublish draft) instead of half-live event.

---

### SAN-607 — AGT-15 Workflow Error Handling + Compensation

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **93%** |
| **Will succeed?** | Yes when 601/602 exist |
| **Prod-ready when Done?** | **Required** for money/publish |
| **Status** | Backlog · **High** (mandatory) |

**Corrections:**

1. Elevated priority correct — **601/602 must list 607 as blocker**.
2. grep confirms **0 retries/bail** in workflows today — greenfield.

**Real-world example:** Stripe succeeds, Supabase insert fails → compensation voids intent instead of charging Andrés with no ticket.

---

### SAN-608 — AGT-14 Suspend & Resume (host event)

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **90%** (was 84%) |
| **Will succeed?** | Yes — API exists |
| **Prod-ready when Done?** | Delight feature, not launch blocker |
| **Status** | Backlog · Medium |

**Corrections:**

1. **Per-step checkpoints:** Basic Info → Venue → Pricing → Media → Review (workflow state + snapshots).
2. **Resume-from-step (review 2026-06-06):** failure at step 3 → **resume at step 3**, not restart wizard. Strongest real-world Mastra workflow-state use case.
3. Depends on workflow refactor (602) or parallel host wizard state machine — clarify which.

**Real-world example:** Roberto completes steps 1–2, fails at Pricing — returns tomorrow and continues at Pricing, not from scratch.

---

### SAN-600 — AGT-09 Background Tasks

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **83%** |
| **Will succeed?** | Yes with Postgres storage |
| **Prod-ready when Done?** | UX improvement |
| **Status** | Backlog · Medium |

**Corrections:** Cross-link **609** (streaming). Requires prod Postgres Mastra storage (already path on Vercel).

---

### SAN-599 — AGT-07 Tool Output Shaping + activeTools

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **89%** |
| **Will succeed?** | Yes |
| **Prod-ready when Done?** | Cost/latency win |
| **Status** | Backlog · Medium |

**Corrections:** Measure token delta via traces (589) before/after. `activeTools` must not break multi-intent turns.

---

### SAN-609 — AGT-16 Progressive Tool Streaming

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **90%** |
| **Will succeed?** | Yes |
| **Prod-ready when Done?** | High UX ROI |
| **Status** | Backlog · Medium |

**Corrections:** 0 `context.writer` hits today — confirmed. Start with `searchGroundedPlacesTool`. UI must subscribe to tool stream events in CopilotKit card pipeline.

**Real-world example:** *"Searching Laureles… 12 places… ranking…"* instead of 10s blank spinner for Tourist.

---

## Phase 3 — Advanced

### SAN-603 — AGT-08 Semantic Recall (pgvector)

| Field | Value |
|---|---|
| **Dot** | 🟡 |
| **Spec % correct** | **87%** |
| **Will succeed?** | Yes post-launch |
| **Prod-ready when Done?** | Post-MVP delight |
| **Status** | Backlog · Low |

**Corrections:** Do **not** adopt `@mastra/rag`. Use Mastra memory vector store + existing Supabase pgvector. After 597.

---

### SAN-610 — AGT-13 Memory Processors

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **91%** |
| **Will succeed?** | Yes |
| **Prod-ready when Done?** | Personalization |
| **Status** | Backlog · Medium |

**Corrections:** Cheaper than observational memory — extract `{neighborhood, budget, style}` deterministically. After resource scope (597).

---

### SAN-604 — AGT-10 Interop Spike (doc only)

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **95%** |
| **Will succeed?** | Yes — doc task |
| **Prod-ready when Done?** | N/A (no runtime) |
| **Status** | Backlog · Low |

**Corrections:** None material. Map Channels → WhatsApp Phase 2 path.

---

## Proposed — AGT-17 Golden Query Evaluation Suite *(not in Linear yet)*

| Field | Value |
|---|---|
| **Dot** | 🟢 |
| **Spec % correct** | **95%** (proposed) |
| **Will succeed?** | Yes — after 590/605 |
| **Prod-ready when Done?** | Trust gate for scorers — **not launch blocker** |
| **When** | After Phase 0 scorers; file as SAN-611 |

**Dataset (70 queries):**

| Vertical | n | Example | Expected |
|---|---|---|---|
| Rental | 20 | *"2BR Laureles under 3M"* | faithfulness ≥90 · grounding ≥90 |
| Venue | 20 | *"quiet rooftop Provenza"* | same |
| Restaurant | 20 | *"bandeja paisa near Lleras"* | same |
| Event | 10 | *"salsa this weekend"* | same |

Without a golden set, scorers are hard to trust in CI. Wire to `evals.json` + trace samples.

---

## Summary scoreboard (all tasks)

| SAN | AGT | Title | Dot | Spec % | Will succeed? | Prod when Done? |
|---|---|---|---|---|---|---|
| 588 | 00 | Epic | 🟡 | 86% | Yes | Phase 0 → ~75% |
| 589 | 00C | Tracing | 🟢 | 94% | Yes | Ops partial |
| 590 | 00A | Faithfulness scorer | 🟢 | 92% | Yes | Yes |
| 605 | 00B | Grounding scorer | 🟢 | 93% | Yes | Yes |
| 591 | 00D | Allowlist | 🟢 | 95% | Yes | Yes |
| 592 | 03 | Structured output | 🟢 | 91% | Yes | Yes |
| 606 | 04A | Grounding processor | 🟢 | 90% | Yes* | **High value** |
| 593 | 05 | Input processors | 🟢 | 96% | Yes | Yes |
| 594 | 06 | Cache + CostGuard | 🟡 | 85% | Yes | Yes |
| 595 | 01 | Native approval | 🟡 | 78% | Partial | Publish only |
| 596 | 04B | Scrubber | 🟢 | 94% | Yes | Hygiene |
| 598 | 04C | PII | 🟢 | 90% | Yes | Optional launch |
| 597 | 02 | Resource memory | 🟢 | 92% | Post-launch | Delight · **moved earlier** |
| 601 | 11 | Checkout wf | 🟡 | 80% | **Blocked PAY** | No until PAY |
| 602 | 12 | Publish wf | 🟡 | 81% | After EVT-002 | With 607 |
| 607 | 15 | Error/compensation | 🟢 | 93% | With 601/602 | **Required** |
| 608 | 14 | Suspend/resume | 🟢 | 90% | Yes | Delight |
| 600 | 09 | Background tasks | 🟡 | 83% | Yes | UX |
| 599 | 07 | Tool shaping | 🟢 | 89% | Yes | Cost win |
| 609 | 16 | Tool streaming | 🟢 | 90% | Yes | UX win |
| 603 | 08 | Semantic recall | 🟡 | 87% | Post-launch | Delight |
| 610 | 13 | Memory processors | 🟢 | 91% | Yes | Personalization |
| 604 | 10 | Interop doc | 🟢 | 95% | Yes | N/A |

**Aggregate spec quality:** mean **91%** · **Roadmap grade 95/100** (external review 2026-06-06)

---

## Critical fixes (do these before / during Phase 0)

| Priority | Fix | Owner task |
|---|---|---|
| **P0** | Enable telemetry — 0 spans on live prod | SAN-589 |
| **P0** | Wire faithfulness + grounding scorers | SAN-590, SAN-605 |
| **P1** | Runtime allowlist (7 agents exposed, 2 used) | SAN-591 |
| **P1** | `hostEventAgent` input processors (asymmetric gap) | SAN-593 |
| **P1** | Update SAN-588 epic Phase 1 text (remove AGT-02) | SAN-588 |
| **P2** | Fix `storage.test.ts` env flake (LibSQL vs Postgres assertion) | Sofía / infra |
| **P2** | Wire `evals.json` into scorer CI | SAN-590 |
| **P2** | Set Linear `blockedBy`: 601/602 → 607; 601 → PAY-001 | Linear hygiene |

---

## What's missing from the backlog

| Gap | Recommendation |
|---|---|
| **Agent pruning** (remove `rentalAgent`, `eventAgent`, `routerAgent` from prod registry) | Optional follow-up issue — allowlist (591) is sufficient for Phase 1 |
| **sitemap.md / MASTRA-MIS-001 sync** | Housekeeping — not AGT scope |
| **CopilotKit v2 migration** | Correctly excluded — do not add |
| **`@mastra/rag` adoption** | Correctly excluded |
| **Playwright prod scorer gate** | Add to SAN-590 acceptance (persona-visible quality) |
| **Promote Phase 0 to `phase:launch`** | Owner decision per plan §9 |

---

## Best practices compliance (Mastra skill + house rules)

| Rule | Today | After Phase 0+1 |
|---|---|---|
| Tool results = truth (enforced, not prompt-only) | 🔴 prompt only | 🟢 590/605/606 |
| Tracing before tuning | 🔴 | 🟢 589 |
| Two agents in prod | 🟡 UI pins 2; runtime exposes 7 | 🟢 591 |
| Money/publish = workflow + compensation | 🔴 | 🟡 Phase 2 (601/602/607) |
| Resource vs thread memory | 🟡 thread only | 🟡 until 597 |
| No `@mastra/rag` | 🟢 | 🟢 |
| Gemini structured output flag | ⚪ N/A yet | 🟢 592 |
| WM schema 3-place rule | 🟢 | 🟢 |

---

## Will the roadmap succeed?

| Question | Answer |
|---|---|
| **Are specs executable?** | **Yes** — 89% avg, APIs in `@mastra/core@1.35.0`, no package upgrades required |
| **Biggest execution risk** | **Not starting Phase 0** while shipping persona features (events browse, nav) — ops debt compounds |
| **Biggest technical risk** | AGT-04A (606) generative UI grounding — needs careful design, not copy-paste |
| **Biggest schedule risk** | Phase 2 checkout (601) before PAY-001 — correctly deferred |
| **Production ready today?** | **No (62%)** — demo-ready concierge, blind ops, no hallucination gate |
| **Production ready after Phase 0?** | **~75%** — measured + traced, not yet enforced |
| **Production ready after Phase 0 + P1 spine?** | **~85%** — enforce + cost/latency guards |

---

## Recommended execution order (v3 — 2026-06-06 review)

```
589 → 590 → 605 → 591
592 → 606 → 593 → 594 → 595 → 596 → 598
607 → 601 → 602 → 597 → 608 → 609 → 600 → 599
610 → 603 → 604
Optional after 590/605: AGT-17 golden query suite
```

---

## Overall grades

| Layer | Grade | % | Dot |
|---|---|---|---|
| **Roadmap (external review)** | **A** | **95%** | 🟢 |
| **Backlog spec quality** | A | **91%** | 🟢 |
| **Architecture (runtime)** | B− | **65%** | 🟡 |
| **Production readiness (today)** | D+ | **62%** | 🔴 |
| **Phase 0 readiness to start** | A | **94%** | 🟢 |
| **Mastra adoption** | — | **25% total · 60–70% MVP useful** | 🟡 |

---

*Audit updated 2026-06-06 with external review (95/100). Re-run after first Phase 0 merge.*
