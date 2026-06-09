---
title: Mastra Full-Surface Gap Analysis — Memory · Workflows · Streaming · Workspace · RAG
date: 2026-06-05
owner: sanjiovani
author: Claude (Principal Mastra Architect / forensic mode)
companion: ./1-agents-plan.md (agent-feature roadmap, AGT-00…12) · ../audit/june5-mastra-audit.md
verified_against: "@mastra/core@1.35.0 + @mastra/memory + @mastra/pg (installed) · live src/mastra/** read (Explore agent) · package.json exports"
linear_epic: SAN-588
scope: The five doc families the review requested — NOT the agent features already in 1-agents-plan.md
verdict: We use ~25% of Mastra's total surface. Memory is thread-only, workflows are serial-only, streaming is unused, RAG is correctly delegated to Supabase, workspace is a dev feature to ignore. 4 new tasks (AGT-13…16); the rest is Phase 2+ or avoid.
---

# Mastra Full-Surface Gap Analysis

> **Companion, not replacement.** `1-agents-plan.md` covers the **agent** features
> (scorers, processors, approval, structured output → AGT-00…12). This doc covers
> the **other five doc families** the deep review named: **Memory, Workflows,
> Streaming, Workspace, RAG.** Overlaps are cross-referenced, not duplicated.
>
> **Method:** every claim verified — installed `@mastra/core@1.35.0` exports +
> `node_modules` `.d.ts` probes + a forensic read of `src/mastra/**` (file:line).
> Nothing assumed.

---

## 0. One-line verdict

**We use ~25% of Mastra's total surface. The agent core is good; memory is thread-only, workflows are serial-only, streaming is entirely unused, RAG is correctly delegated to Supabase pgvector (don't adopt `@mastra/rag`), and the workspace family is a dev/Studio feature to ignore.** Net new work = **4 tasks (AGT-13…16)**; everything else is Phase 2+ or explicitly avoid.

---

## 1. Memory audit

### Current state (verified)
`createThreadMemory()` (`src/mastra/lib/agent-memory.ts:5-17`) → `workingMemory { enabled, scope: "thread", schema }` + `lastMessages: 20`. Applied to concierge / rental / event / host / ping agents. **No `semanticRecall`, no observational memory, no memory processors** (grep: 0 hits). Storage = Postgres prod / LibSQL dev singleton.

| Feature | Doc | Current usage | Score | Verdict |
|---|---|---|---|---|
| **Message history** (`lastMessages`) | message-history | ✅ Good — `lastMessages: 20`, correct | **80** | Keep |
| **Working memory** | working-memory | 🟡 Partial — rich schema but **thread-scoped only** | **70** | → resource scope = **AGT-02** (already filed) |
| **Storage** | storage | ✅ Good — prod/dev split, EMAXCONN-aware | **85** | Keep |
| **Semantic recall** | semantic-recall | ❌ Not used (API present) | **0** | → **AGT-08** (filed, Phase 3) |
| **Observational memory** | observational-memory | ❌ Not used (`ObservationalMemory` present) | **0** | Phase 2 — auto-summarized prefs; **no MVP issue** |
| **Memory processors** | memory-processors | ❌ Not used (`MemoryProcessor` present) | **0** | → **AGT-13 (NEW)** preference/budget/neighborhood extraction |
| **Multi-user threads** | multi-user-threads | ❌ Not used | **0** | Phase 2 (Trips group planning) — **no MVP issue** |

**Persona examples answered:**
- *"User repeatedly searches Laureles, cafés, coworking — can the system learn?"* → **Observational memory** would auto-summarize this into durable prefs. Real, but **Phase 2** (needs the resource-scoped base from AGT-02 first). Cheaper interim: **AGT-13 memory processors** extract `{neighborhood, budget, style}` deterministically on each turn — 80% of the value, a fraction of the complexity.
- *"Show me that apartment I liked last month"* → **semantic recall** (AGT-08). Yes we *can*; **Phase 3** (needs pgvector memory store).
- *Group trip / shared itinerary / event organizers* → **multi-user threads**. Genuine fit for the **Trips** module, but Phase 2 — out of the launch path.

**Memory section: current ~45/100 · future (AGT-02+08+13) ~82/100 · complexity Med · ROI High (Camila personalization).**

---

## 2. Workflow audit

### Current state (verified)
3 workflows (`src/mastra/index.ts:32-35`): `rentalSearchWorkflow`, `eventDiscoveryWorkflow`, `conciergeRoutingWorkflow`. **All are serial `.then()` pipelines** — **no** `.suspend()`, `.branch()`, `.parallel()`, `.dowhile()`, snapshots, `retries`, or compensation (grep: 0 hits). None are on the prod chat path (router/Studio only; june5 audit §3).

| Feature | Doc | Current | Score | Verdict |
|---|---|---|---|---|
| **Workflow state** | workflow-state | 🟡 Minimal — serial step I/O only | **40** | Improves with AGT-11/12 |
| **Control flow** (branch/parallel) | control-flow | 🟡 Serial only | **35** | Use in checkout/publish (AGT-11/12) |
| **Snapshots** | snapshots | ❌ Not used (`snapshot` present) | **0** | Backs suspend/resume → AGT-14 |
| **Suspend & resume** | suspend-and-resume | ❌ Not used (`suspend`/`resumeSchema` present) | **0** | → **AGT-14 (NEW)** host event leave-and-resume |
| **Human-in-the-loop** | human-in-the-loop | 🟡 CopilotKit HITL only (works) | **60** | Native server gate = **AGT-01** (filed) |
| **Time travel** | time-travel | ❌ Not used | **N/A** | 🚫 **AVOID** — overengineering for MVP |
| **Error handling** | error-handling | ❌ None — no retries/compensation (`retries`/`bail` present) | **20** | → **AGT-15 (NEW)** for checkout/publish |
| **Scheduled workflows** | scheduled-workflows | ❌ Not used (`cron`/`scheduler` present) | **0** | Phase 2 — **fold into existing event-discovery (EVP) track**, no new AGT issue |

**HITL — which is correct?** Both, layered. CopilotKit `renderAndWaitForResponse` is the **UI** half (already works for Roberto). **AGT-01** native `requireApproval` is the **server-side** half (enforces the pause for the money path). They're complementary, not competing — the audit's recommendation stands.

**Suspend/resume** — *"Host starts event creation, leaves, returns tomorrow, continues"*: **yes, implement** → AGT-14. This is the canonical Mastra suspend/resume case and a real Roberto delight. **Snapshots** are the persistence mechanism underneath — no separate task.

**Error handling** — current quality is **poor for state-mutating paths**. Checkout (AGT-11) and publish (AGT-12) need `retries` + compensation (rollback Stripe intent / un-publish on failure). → **AGT-15**, blocks the Phase-2 workflows from being "done."

**Time travel** — 🚫 avoid. Debug-time replay; zero MVP user value.

**Workflow section: current ~30/100 · future (AGT-11/12/14/15) ~72/100 · complexity Med-High · ROI High (money + publish reliability).**

---

## 3. Streaming audit

### Current state (verified)
**Zero custom streaming.** No `context.writer`, `ToolStream`, `.streamVNext`, or `streamUntilIdle` anywhere in `src/mastra/**`. Tools return **final results only**. The only stream is CopilotKit's standard AG-UI top-level event stream via `getLocalAgentsWithLogging` (`logging-mastra-agent.ts:44-68`).

| Feature | Doc | Current | Score | Verdict |
|---|---|---|---|---|
| **Event streaming** (top-level) | overview/events | ✅ Good — AG-UI handles it | **70** | Keep |
| **Tool streaming** (`context.writer`/`ToolStream`) | tool-streaming | ❌ Not used (`ToolStream` present) | **15** | → **AGT-16 (NEW)** progressive search updates |
| **Workflow streaming** | workflow-streaming | ❌ Not used (`MastraWorkflowStream` present) | **0** | Comes with AGT-11/12 step events |
| **Background-task streaming** | background-task-streaming | ❌ Not used | **0** | → **AGT-09** (filed) |

**The 10-second-wait problem:** a grounded venue search can block the whole turn. With **`context.writer`** the tool can emit `"searching Laureles… found 12… ranking…"` progressively — the user sees motion instead of a spinner. Real perceived-latency win for Camila + Tourist. → **AGT-16**, P2 (UX, cheap, high ROI), best measured after AGT-00C tracing.

**Streaming section: current ~30/100 · future (AGT-16+09) ~70/100 · complexity Low-Med · ROI High (perceived latency).**

---

## 4. Workspace audit

### Current state (verified)
`workspace` is imported into `Mastra({})` (`index.ts`) — but this is the **Mastra Studio dev workspace** (`ws-…`, june5 audit §9), the IDE's file-access sandbox, **not** an application tenant or a product feature.

| Feature | Doc | Useful for mdeai? | Verdict |
|---|---|---|---|
| **Filesystem** | workspace/filesystem | ❌ Dev/agent-coding feature | 🚫 **Ignore** |
| **Search** | workspace/search | ❌ Dev codebase search | 🚫 **Ignore** |
| **Skills** | workspace/skills | ❌ Agent-coding skills (≠ our `.claude/skills`) | 🚫 **Ignore** |
| **LSP** | workspace/lsp | ❌ Language-server for code agents | 🚫 **Ignore** |

**These are production features — for *coding agents*, not for a rentals/events concierge.** Multi-tenant isolation for mdeai is correctly enforced at **Supabase RLS + `resourceId`**, not Mastra workspaces. **Adopt none. No tasks.** (Do not conflate the Studio dev workspace with tenancy.)

**Workspace section: N/A · ROI ~0 for product · 🚫 Ignore entirely.**

---

## 5. RAG audit (`/docs/rag/overview`)

### Current state (verified)
**`@mastra/rag` is NOT installed.** `@mastra/pg` IS present. Search is **Supabase pgvector RPC + Gemini query embeddings** (`intelligence-*.ts`, `query-embedding.ts`) — i.e., we already do retrieval-augmented ranking, just **through Supabase, not Mastra's RAG package**.

| Feature | Current | Verdict |
|---|---|---|
| Document RAG (`@mastra/rag`, `createVectorQueryTool`) | ❌ Not used | 🚫 **Avoid** — would duplicate working Supabase pgvector + the **VEC-001→007** Linear track |
| pgvector ranking | ✅ Good (Supabase-native) | Keep |
| Memory-side semantic recall | ❌ Not used | → **AGT-08** (filed) — this is the *one* place a Mastra vector store earns its keep |

**Do NOT adopt `@mastra/rag`.** It solves a problem (chunk/embed/retrieve documents) we don't have — we retrieve **structured rows** (listings, events, venues), which SQL + pgvector does better and is already shipped. The only Mastra vector use worth doing is **semantic *memory* recall (AGT-08)**, and that's Phase 3.

**RAG section: current ~70/100 (via Supabase) · future unchanged · 🚫 don't adopt `@mastra/rag`.**

---

## 6. Gap-analysis master table

| Feature | Doc family | Current usage | Score | ROI | Priority | Disposition |
|---|---|---|---|---|---|---|
| Message history | Memory | Good | 80 | — | Ignore | Keep |
| Working memory (thread) | Memory | Partial | 70 | High | P1 | AGT-02 (resource scope) |
| Semantic recall | Memory | Not used | 0 | Med | P2 | AGT-08 |
| Observational memory | Memory | Not used | 0 | Med | P2 | Phase 2, no issue |
| **Memory processors** | Memory | Not used | 0 | High | **P2** | **AGT-13 NEW** |
| Multi-user threads | Memory | Not used | 0 | Med | P2 | Phase 2 (Trips), no issue |
| Workflow state/control-flow | Workflows | Partial | 38 | Med | P2 | via AGT-11/12 |
| Snapshots | Workflows | Not used | 0 | Med | P2 | under AGT-14 |
| **Suspend & resume** | Workflows | Not used | 0 | High | **P2** | **AGT-14 NEW** |
| HITL | Workflows | Partial (CK) | 60 | High | P1 | AGT-01 |
| Time travel | Workflows | Not used | N/A | Low | Ignore | 🚫 avoid |
| **Error handling / compensation** | Workflows | Not used | 20 | High | **P1** | **AGT-15 NEW** |
| Scheduled workflows | Workflows | Not used | 0 | Med | P2 | EVP track, no AGT issue |
| Top-level event stream | Streaming | Good | 70 | — | Ignore | Keep |
| **Tool streaming** | Streaming | Not used | 15 | High | **P2** | **AGT-16 NEW** |
| Workflow streaming | Streaming | Not used | 0 | Med | P2 | with AGT-11/12 |
| Background-task streaming | Streaming | Not used | 0 | Med | P2 | AGT-09 |
| Workspace (fs/search/skills/lsp) | Workspace | Not used | N/A | ~0 | Ignore | 🚫 dev feature |
| `@mastra/rag` | RAG | Not used | 0 | Low | Ignore | 🚫 use Supabase pgvector |
| Telemetry / tracing | (agent) | Not used | 30 | High | P0 | AGT-00C |
| Scorers | (agent) | Not used | 10 | High | P0 | AGT-00A/B |

---

## 7. New Linear issues (filter-passed only)

Per the review's Section-6 filter (improve production/reliability/grounding/memory/UX/revenue; **no** experimental/overengineering/enterprise/nice-to-have). Four pass:

| ID | Title | SAN | Phase | Priority | Effort |
|---|---|---|---|---|---|
| **AGT-15** | Workflow error handling + compensation (checkout/publish) | **SAN-607** | 2 | **P1** | 1.5d |
| **AGT-14** | Suspend & resume for host event creation | **SAN-608** | 2 | P2 | 1.5d |
| **AGT-16** | Progressive tool streaming (`context.writer`) | **SAN-609** | 2 | P2 | 1d |
| **AGT-13** | Memory processors — preference/budget/neighborhood extraction | **SAN-610** | 3 | P2 | 1d |

**Roadmap now spans AGT-00…16 (24 issues) under epic SAN-588.** Total added effort this doc: ~5d.

**Explicitly NOT filed** (and why): observational memory (Phase 2, needs AGT-02 base) · multi-user threads (Phase 2 Trips) · scheduled workflows (duplicate of EVP event-discovery track) · time-travel (overengineering) · workspace fs/lsp/skills/search (dev features) · `@mastra/rag` (duplicates Supabase pgvector + VEC track).

### Existing AGT tasks to modify
- **AGT-11 / AGT-12** — add **AGT-15** (error handling/compensation) as a hard dependency; a money/publish workflow without rollback is not "done."
- **AGT-08** — note observational-memory + multi-user-threads as its Phase-3 neighbours (same vector store).
- **AGT-09** — reframe as the *background-task-streaming* implementation (it already is; cross-link the streaming doc).

### Reviewer feedback incorporated (2026-06-05, external 92/100 review)
1. **AGT-15 elevated to MANDATORY** — High priority (above AGT-11/12's Medium); AGT-11/12 are not "Done" without it. Kept in **Phase 2** (you can't harden a workflow that doesn't exist yet — "move *closer to* 11/12" = Phase 2, top).
2. **Memory cluster → Phase 3, ordered AGT-02 → AGT-13 → AGT-08.** AGT-02 moved out of Phase 1 (durable memory is not a launch blocker). AGT-13 (cheap deterministic slot extraction) intentionally ahead of AGT-08 (semantic recall, "cool but not MVP").
3. **Workflow checkpoints folded into AGT-14** — per-step snapshot (Basic Info → Venue → Pricing → Media → Review); failure at step N resumes at step N. Added to AGT-14 acceptance criteria.
4. **`@mastra/rag` avoidance + Workspace-ignore + suspend/resume + streaming** — all confirmed correct by the review; no change.

---

## 8. Mastra best practices for mdeai (house rules)

Distilled from the docs + our own LESSONS.md, so future Mastra work doesn't re-learn them:

1. **Tool results are the only truth** — enforce with an output processor (AGT-04A) + scorer (AGT-00A/B), never just the prompt.
2. **Tracing before tuning** (AGT-00C) — never optimize latency/cost without spans.
3. **Two agents in prod, period** — allowlist the runtime (AGT-00D); Studio demos stay dev-only.
4. **Money/publish = workflow, not prompt** — deterministic + idempotent + HITL + compensation (AGT-11/12/15).
5. **Resource-scope durable prefs, thread-scope volatile state** (AGT-02) — never mix.
6. **Retrieve structured rows via Supabase pgvector; reserve Mastra vector store for *memory* recall only** — don't adopt `@mastra/rag`.
7. **Workspace = Studio dev sandbox, not tenancy** — tenancy is Supabase RLS + `resourceId`.
8. **Stream progress for any tool >2s** (AGT-16) — `context.writer`, not a spinner.
9. **Gemini + structured output** needs `jsonPromptInjection: true` (tools+SO incompatibility).
10. **Every working-memory schema change touches 3 places** — Zod in agent, TS in `lib/types.ts`, and `packages/types` (W4).

---

## 9. Final architecture verdict (brutally honest)

1. **Are we using Mastra correctly?** **For what we use, yes.** The agent core, memory scoping, request-context threading (`MASTRA_RESOURCE_ID_KEY` from authed `user.id`), and Pattern-1 CopilotKit integration are all textbook. The problem is **breadth**, not correctness: workflows, streaming, and advanced memory are barely touched.
2. **What % of Mastra are we actually using?** **~25% of total surface** · **~60–70% of useful MVP surface** (agents + tools high; memory medium; workflows/streaming low; workspace/RAG intentionally ignored).
3. **Biggest missed opportunities:** (a) **progressive tool streaming** — cheapest UX win we're ignoring; (b) **workflow error handling/compensation** on the money path; (c) **suspend/resume** for host creation; (d) **memory processors** for cheap personalization.
4. **Implement immediately:** nothing here jumps Phase 0. The launch-movers remain **AGT-00C tracing + AGT-00A/B scorers**. Of *this* doc's items, **AGT-15** (error handling) is the only P1, and it rides with the Phase-2 workflows.
5. **Never implement:** `@mastra/rag`, workspace fs/lsp/skills/search, time-travel, Mastra multi-tenant workspaces.
6. **What a top-1% Mastra architect does next:** ship Phase 0 (scorers+tracing), then make checkout a *workflow with compensation* (AGT-11+15), then add `context.writer` streaming so the product *feels* fast — in that order. They would **not** chase observational memory, RAG, or workspace before the money path is deterministic and observable.
7. **Add to the AGT roadmap:** AGT-13, AGT-14, AGT-15, AGT-16 (this doc).
8. **Modify:** AGT-11/12 (depend on AGT-15); AGT-08 (Phase-3 memory cluster); AGT-09 (= background-task streaming).

### Scores
| Metric | Score | Note |
|---|---|---|
| **Overall architecture** | **B−** | Strong core, narrow surface use |
| **MVP readiness** | **74%** | Unchanged — launch blockers are Phase-0 scorers/tracing, not these |
| **Production readiness** | **62%** | Unchanged — this doc adds reliability/UX *opportunities*, not blockers |
| **Mastra adoption (total surface)** | **~25%** | **~60–70% useful MVP surface** · Memory 30% · Workflows 15% · Streaming 5% · Workspace 0% · RAG delegated |

---

### Appendix — evidence (verified 2026-06-05)

| Claim | Probe |
|---|---|
| 3 serial workflows, no suspend/branch/retries | Explore read of `src/mastra/workflows/*` + `index.ts:32-35` |
| No streaming in tools | grep 0 hits `context.writer`/`streamVNext`/`ToolStream` in `src/mastra/**` |
| `ToolStream`/`MastraWorkflowStream`/`context.writer` exist | `@mastra/core/dist/stream` + `.d.ts` grep |
| `suspend`/`snapshot`/`retries`/`bail` exist | `@mastra/core/dist/workflows/*.d.ts` |
| `ObservationalMemory`/`MemoryProcessor` exist | `@mastra/core` + `@mastra/memory` `.d.ts` |
| `@mastra/rag` absent, `@mastra/pg` present | `ls node_modules/@mastra/{rag,pg}` |
| `./workspace` subpath = dev feature | `package.json` exports + `dist/workspace/{filesystem,glob,lsp}` |
| `cron`/`scheduler` exist, unused | core `.d.ts` grep + 0 hits in `src/mastra` |
| Thread-only memory, no semanticRecall | `agent-memory.ts:5-17` + grep |
| Request context threaded correctly | `api/copilotkit/route.ts:51-58` (`MASTRA_RESOURCE_ID_KEY`, `setAuditUserId`) |
| No telemetry in `index.ts` | `index.ts:22-42` — no telemetry key |
