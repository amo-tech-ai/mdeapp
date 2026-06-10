---
title: Mastra AGT Roadmap — Implementation-Order Index
date: 2026-06-06
owner: sanjiovani
epic: SAN-588
view: https://linear.app/sanjiovani/view/mastra-09ffbf4ba37e
sources: 1-agents-plan.md (agents) · 2-mastra-surface-gap-analysis.md (full surface) · ../audit/june-5-mastra-tasks.md (backlog spec audit) · ../audit/june5-mastra-audit.md (runtime)
verified_against: "@mastra/core@1.35.0 (installed) + live src/mastra/** + Linear MCP"
grade_basis: spec correctness + executability; external review 95/100 (2026-06-06)
---

# Mastra AGT Roadmap — Index (implementation order)

> **25 Linear issues** under epic **SAN-588** (AGT-17 now filed **SAN-611**). Order below =
> build sequence from milestone + priority + `blockedBy` + **2026-06-06 external review**.
> **Roadmap grade: 95/100** — Phase 0 order, AGT-15 gating, and MVP focus validated.

**Adoption (don't conflate):** **~25% of total Mastra surface** · **~60–70% of useful MVP Mastra
surface** (agents + tools high; workflows/streaming low; workspace/RAG intentionally ignored).

**Legend:** 🟢 ready (≥90) · 🟡 minor fixes (75–89) · ⚪ defer/partial (50–74) · 🔴 wrong (<50)

**One-line sequence (v3 — 2026-06-06 review):**
`589→590→605→591` → `592→606→593→594→595→596→598` → `607+601→602` → **`597`** → `608→609→600→599` → `610→603→604` · optional **`AGT-17`** after 590/605

---

## Phase 0 — Production Safety · *Todo · moves grade B−→B+*

| # | SAN | AGT | Title | Purpose (why) | Mastra feature / API | Grade |
|---|---|---|---|---|---|---|
| 1 | 589 | 00C | Telemetry & AI tracing | Turn on the lights — you can't tune what you can't trace; everything else measures through it | `telemetry`/`observability` exporter in `Mastra({})` | 🟢 94 |
| 2 | 590 | 00A | Hallucination / faithfulness scorer | Catch invented listings/prices/venues before the user sees them | `createScorer` (`@mastra/core`) | 🟢 92 |
| 3 | 605 | 00B | Grounding-coverage scorer | Catch unsupported claims faithfulness misses; thin extension of 590 | `createScorer` (shared judge+schema) | 🟢 93 |
| 4 | 591 | 00D | Runtime agent allowlist | Stop exposing 7 agents when UI uses 2; 15-min defense-in-depth | filter `mastra.listAgents()` | 🟢 95 |

## Phase 1 — Core Reliability · *enforce + protect + cut cost/latency*

| # | SAN | AGT | Title | Purpose (why) | Mastra feature / API | Grade |
|---|---|---|---|---|---|---|
| 5 | 592 | 03 | Structured output (scorer judge) | Validated `.object` for reranker + scorer judge; shared Zod schema | `structuredOutput` + `jsonPromptInjection` | 🟢 91 |
| 6 | 606 | 04A | Grounding-assertion output processor | **Enforce** "tool results are the only truth" at runtime — **all card kinds**, not prose-only | custom `BaseProcessor.processOutputResult` | 🟡 82→90 |
| 7 | 593 | 05 | Input-processor coverage | `hostEventAgent` has no input guard — close the asymmetric gap | `getDefaultInputProcessors` + `UnicodeNormalizer` | 🟢 96 |
| 8 | 594 | 06 | ResponseCache + CostGuard | Skip repeat LLM round-trips; cap runaway spend (cache key = intent+query+neighborhood) | `ResponseCache` + `CostGuardProcessor` | 🟡 85→90 |
| 9 | 595 | 01 | Native tool-approval | Server-side pause for publish/checkout — `preview_and_publish` is a CK action today, migrate/gate it | `requireApproval` + `suspendSchema` | 🟡 78→86 |
| 10 | 596 | 04B | SystemPromptScrubber | Don't leak the concierge prompt; ~1-line config | `SystemPromptScrubber` output processor | 🟢 94 |
| 11 | 598 | 04C | PII protection | Redact emails/phones in replies; low MVP exposure, deferrable | `PIIDetector` (redact) | 🟢 90 |

## Phase 2 — Business Workflows · *after PAY-001 (SAN-178) / EVT-002 (SAN-366)*

| # | SAN | AGT | Title | Purpose (why) | Mastra feature / API | Grade |
|---|---|---|---|---|---|---|
| 12 | 607 | 15 | Workflow error handling + compensation | **MANDATORY** — Stripe succeeds / DB fails needs rollback before "Done" | `retries` + `bail` + compensation | 🟢 93 · **A+** |
| 13 | 601 | 11 | Checkout workflow | Deterministic + idempotent + HITL money path (wraps PAY-001, ships with 607) | workflow + `requireApproval` | 🟡 80 |
| 14 | 602 | 12 | Host publish workflow | Replace prompt-driven publish with deterministic validate→preview→publish (ships with 607) | workflow + HITL | 🟡 81 |
| 15 | 597 | 02 | Resource-scoped memory | **Moved earlier (review 2026-06-06)** — durable prefs unlock 610/603; Camila stops re-stating Laureles/budget every thread | `workingMemory { scope:'resource' }` | 🟡 88→92 |
| 16 | 608 | 14 | Suspend & resume (host event) | Roberto leaves, resumes **at failed step** (not restart) — per-step snapshots | `suspend`/`resumeSchema`/`snapshot` + workflow state | 🟡 84→90 |
| 17 | 609 | 16 | Progressive tool streaming | Kill the 10s spinner — stream "searching Laureles… ranking…" | `context.writer` / `ToolStream` | 🟢 90 · **high ROI** |
| 18 | 600 | 09 | Background tasks | Fast first paint; slow grounding continues in background | `backgroundTasks` + `streamUntilIdle` | 🟡 83 |
| 19 | 599 | 07 | Tool output shaping + activeTools | Trim model-facing payload (tokens) + scope tools per intent | `toModelOutput` + `activeTools` | 🟢 89 |

## Phase 3 — Advanced · *post-launch · memory tail + interop*

| # | SAN | AGT | Title | Purpose (why) | Mastra feature / API | Grade |
|---|---|---|---|---|---|---|
| 20 | 610 | 13 | Memory processors | Extract `{neighborhood,budget,style}` deterministically — needs 597 base | `MemoryProcessor` | 🟢 91 |
| 21 | 603 | 08 | Semantic recall | "that apartment I liked last week" — Mastra vector store (NOT `@mastra/rag`) | `semanticRecall { scope:'resource' }` + pgvector | 🟡 87 |
| 22 | 604 | 10 | Interop spike (doc) | Scope Channels→WhatsApp + A2A/ACP for Phase 2; no runtime code | `@mastra/core/{channels,a2a}` (doc only) | 🟢 95 |

## Phase 1 tail — filed 2026-06-06

| # | SAN | AGT | Title | Purpose (why) | Mastra feature / API | Grade |
|---|---|---|---|---|---|---|
| 11b | **611** | **17** | Golden query evaluation suite | Trust the scorers — 20 rental + 20 venue + 20 restaurant + 10 event; assert faithfulness/grounding ≥90 in CI; builds on DATA-006 (SAN-336) | scorer harness + `evals.json` | 🟢 90 · `blockedBy` 590/605 |

---

## Epic

| SAN | Title | Purpose | Grade | Status |
|---|---|---|---|---|
| 588 | AGT-00 — Mastra Agent Feature Adoption | Close empty quality + observability layers | 🟡 86→92 | Backlog → In Progress when 589 starts |

---

## External review summary (2026-06-06) — **95/100**

| Area | Score |
|---|---|
| Technical accuracy | 96% |
| Official Mastra alignment | 95% |
| Priority ordering | 92% → **94%** after AGT-02 move |
| MVP focus | 98% |
| Production readiness focus | 98% |
| Overengineering risk | Low |

**Validated:** Phase 0 order (589→590→605→591) · AGT-15 before 601/602 · AGT-16 streaming ROI · ignore workspace/RAG/MCP chase.

**Applied from review:**
1. **AGT-02 (597)** moved to **#15** — end of Phase 2 / head of memory cluster (was last in Phase 3).
2. **AGT-04A (606)** — explicit acceptance: Rental · Event · Restaurant · Venue (grounded) cards must pass grounding validation, not text-only.
3. **AGT-14 (608)** — explicit **resume-from-step** (failure at step 3 → resume at step 3, not restart).
4. **AGT-17 proposed** — golden query eval suite (70 queries); file Linear issue when Phase 0 scorers land.
5. **Adoption wording** — 25% total surface ≠ 60–70% useful MVP surface.

---

## Cross-phase dependencies (hard `blockedBy` in Linear)

| Task | Blocked by | Why |
|---|---|---|
| 605 (00B) | 590 (00A) | shares judge + schema |
| 606 (04A) | 590, 605, 592 | needs scorer "grounded" definition + schema |
| 601 (11) | **SAN-178 (PAY-001)** | checkout needs the Stripe path first |
| 601 / 602 | 607 (15) co-req | not "Done" without compensation |
| 610 (13) | 597 (02) | extraction writes to resource memory |
| 603 (08) | 597 (02) | semantic recall builds on resource scope |

## Corrections applied from the backlog audit (2026-06-06)
1. **Epic** — moved AGT-02 out of Phase-1 text → Phase 3; added AGT-13…16. ✅
2. **AGT-01 (595)** — `preview_and_publish` is a CK `useCopilotAction`, not a Mastra tool → migrate/dual-layer; named `host-event-copilot-bridge.tsx`. ✅
3. **AGT-04A (606)** — must validate generative-UI **card payloads** for **Rental · Event · Restaurant · Venue** cards, not just prose citations. ✅
4. **AGT-06 (594)** — cache key = intent+normalized-query+neighborhood, not raw string. ✅
5. **AGT-11 (601)** — hard `blockedBy: SAN-178`. ✅
6. **AGT-02 (597)** — moved earlier per external review: after 602, before 608. ✅
7. **AGT-14 (608)** — acceptance includes resume-from-step via workflow snapshots. ✅
8. **AGT-17** — golden query suite proposed (disk); Linear TBD after 590/605. ✅
9. **Deferred (not task-blocking):** `storage.test.ts` env flake; `evals.json` CI wiring folded into 590 + AGT-17.

## CopilotKit-v1 bridge constraints (verified 2026-06-06 · `copilotkitV1` skill + `@ag-ui/mastra@0.2.1-beta.2` dist probe)

The pinned bridge emits only `RUN_STARTED · STATE_SNAPSHOT · TEXT_MESSAGE · TOOL_CALL(_ARGS/_END/_RESULT)`. `approval` = **0 hits**; no custom `context.writer`/`STATE_DELTA` event. This changes two specs:

| Task | Constraint | v1-correct approach |
|---|---|---|
| **AGT-01 (595)** | Mastra `requireApproval` **cannot drive the v1 UI** — bridge forwards no approval event | **Dual-layer:** UI pause stays CK `renderAndWaitForResponse`; `requireApproval` is a **server-side** gate via `/api/approval-commit`. Native-approval-UI = **v2/Phase 2**. |
| **AGT-16 (609)** | Raw `context.writer` chunks **don't reach v1** — no custom stream event | Emit progress to **working-memory state** → `STATE_SNAPSHOT` → `useCoAgent`/`useCoAgentStateRender`. True `context.writer` UX may **slip to v2**. |
| **AGT-00D (591)** | ✅ correct — allowlist filters the `MastraAgent.getLocalAgents` map passed to `CopilotRuntime({ agents })` | no change |
| **AGT-04A (606)** | ✅ feasible — output processor runs **server-side on tool results** before `TOOL_CALL_RESULT` is emitted | no change |
| **AGT-00C (589)** | ✅ no regression — telemetry is Mastra-instance-level; `LoggingMastraAgent` wrap (which `MastraAgent.run()` calls without `onFinish`) is preserved | no change |

**House rule added:** on CK v1, agent→UI signals must ride `TEXT_MESSAGE` / `TOOL_CALL*` / `STATE_SNAPSHOT` — anything needing approval-events or custom tool-stream events is gated on the **v2 migration**.

## Open owner decision
Promote Phase-0 (589/590/605) to `phase:launch` + Cycle 1? Currently `phase:mvp`/Urgent to avoid polluting the 12-issue launch view. See `1-agents-plan.md` §9.
