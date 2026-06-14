# CopilotKit v2 Upgrade — AI-Native Correctness Audit (03 · native-AI lens)

**Date:** 2026-06-12 (pass 3 — Linear Contracts patched, collision logged SAN-888→SAN-761)
**Auditor:** AI-native architecture reviewer (host-ops / concierge / AIE program)
**Question:** Are the v2-upgrade tasks (SAN-886–892) correct **for the AI-native system** — do they preserve the golden rules the AIE program is built on (deterministic numbers, HITL-before-writes, shared-state dashboards)?
**Companion audits (do not duplicate):** [`02-upgrade-tasks-linear.md`](./02-upgrade-tasks-linear.md) (program structure, 91%) · [`03-copilotkitv2-upgrade-audit.md`](./03-copilotkitv2-upgrade-audit.md) (hook mappings vs installed package, 98%)
**This audit adds:** the intersection with the **AI-Native Events OS** — three **acceptance contracts** that must survive the hook swap (Contract 1 is explicit in AIE docs; Contracts 2–3 are inferred from shipped v1 behavior), and the **cross-program collision risk** the other two miss.
**Skills:** `copilotkit-upgrade` · `task-verifier` (anti-fake-done) · cross-ref [`docs/events/tasks/AI-native-system/`](../events/tasks/AI-native-system/)

---

## Verdict

**The v2 tasks are correct and well-sequenced — SAN-887 · CK-V2-001 is Done (PR #207 · `408d2d8`); SAN-888 · CK-V2-002 is In Progress on `ai/san-888-ck-v2-002-host-analytics-prototype` — collision decision is now logged (SAN-888 first, then SAN-761 on v2 bridge); patch Linear ACs + evidence before heavy coding.**

The migration is mechanically sound (the other two audits prove the hooks exist and map correctly). Through the AI-native lens it is *also* well-judged: starting the prototype on `/host/analytics` is the right call because that one surface is where **both** golden-rule patterns converge — deterministic KPI rendering **and** shared-state dashboard — so proving it there de-risks everything downstream.

| Metric | Score | Dot |
|---|---|---|
| Hook mappings preserve AI-native contracts | 95% | 🟢 |
| Golden rule #1 (deterministic numbers) protected in plan | 92% | 🟢 |
| Golden rule #2 (HITL before writes) protected in plan | 95% | 🟢 |
| Golden rule #3 (shared-state dashboard) — runtime proof in SAN-888 | 85% | 🟡 |
| **Cross-program collision risk managed** | **85%** | 🟢 |
| **Overall AI-native correctness** | **88%** | 🟢 |

**Persona impact:** Roberto's prod `/host/analytics` (SAN-729 · AIE-008 — Host Analytics Page, shipped + COP fix #205) stays on v1 until `COPILOTKIT_V2_ANALYTICS=1` is proven. Camila's `/chat` and Roberto's event wizard stay on v1 until later tasks. No persona sees a change until a flag flips — correct.

---

## Migration surface — verified on `origin/main` (2026-06-12)

> Re-grepped on `origin/main` directly (not the working branch, which predates the merged AIE analytics work and undercounts). Confirms and slightly refines the `03-copilotkitv2` audit's table.

| v1 pattern | Files on main | v2 target | AI-native contract it carries |
|---|---|---|---|
| `@copilotkit/react-core` (v1 root import) | **20** | `@copilotkit/react-core/v2` | — |
| `@copilotkit/react-ui` | **9** | `/v2` (SAN-891) | — |
| `useCoAgent({name,state,setState})` | **3 mounts** — `host-ops-copilot-bridge`, `host-event-copilot-bridge`, `concierge-coagent-context` | `useAgent({agentId})` + `agent.state`/`setState` | **Golden rule #3** — shared-state dashboards (`HostDashboardState`, `EventDraftState`) |
| `available:"disabled"` + render | **2** — `host-ops-copilot-bridge`, `search-tool-renders` | `useRenderTool` | **Golden rule #1** — deterministic numbers (KPI lift; LLM never recomputes) |
| `renderAndWaitForResponse` | **2** — `host-event-copilot-bridge`, `concierge-venue-booking-bridge` | `useHumanInTheLoop` | **Golden rule #2** — HITL before publish / venue booking |
| `useCopilotReadable` | **1** — `host-event-copilot-bridge` | `useAgentContext` | low risk |

(`useCoAgent` also appears in `host-event-form.tsx`, `lib/types/host-dashboard.ts`, `mastra/agents/host-ops.ts` — type/state imports, not hook mounts.)

**Why `/host/analytics` is the right prototype:** `host-ops-copilot-bridge.tsx` is the **only** file carrying golden rules #1 **and** #3 at once. Prove the migration there and you've de-risked the hardest combination before touching the wizard or chat.

---

## The three contracts that MUST survive the hook swap

The AIE program ([`summary.md`](../events/tasks/AI-native-system/summary.md)) states one explicit golden rule: *the LLM explains; tools/workflows calculate.* This audit names **three acceptance contracts** for the v2 hook swap — **Contract 1** matches that rule directly; **Contracts 2–3** are inferred from shipped v1 behavior (HITL publish/venue booking; `HostDashboardState` shared-state dashboard). Task ACs must assert these — not just "it compiles."

### Contract 1 — Deterministic numbers (`available:"disabled"` → `useRenderTool`)

**The rule:** numbers come from the tool/workflow `result`; Gemini narrates, never calculates. This is exactly the bug class fixed in PR #205 (COP narrative) and reinforced across SAN-759 · AIE-007 — salesInsightWorkflow.

**The risk:** if the KPI lift is migrated to `useFrontendTool` (which takes a **client handler**) instead of `useRenderTool` (render-only, no handler), the door reopens for client-side recomputation. SAN-886/888 map it correctly to `useRenderTool` — **keep it that way.**

**AC SAN-888 must assert:** KPI card values equal the `hostOpsAgent` tool `result` JSON (Zod-lifted), byte-for-byte; the LLM message restates, never reproduces, the numbers. Flag-off must be pixel-identical to prod v1.

### Contract 2 — HITL before writes (`renderAndWaitForResponse` → `useHumanInTheLoop`)

**The rule:** nothing publishes or books without a human click. Guards Roberto's `preview_and_publish` and Camila's `createEventProposal` / venue booking.

**The risk:** the `respond(decision)` unblock semantics must survive. If the v2 hook resolves differently, the approval panel could auto-resolve or hang. SAN-889 (host event) and SAN-890 (chat venue booking) own these two files.

**AC must assert:** the approval panel still blocks the agent until the human chooses; reject/edit/approve still route correctly; no silent auto-publish.

### Contract 3 — Shared-state dashboard (`useCoAgent` → `useAgent` + `agent.state`)

**The rule (and the riskiest swap):** `HostDashboardState` is the **full render-ready** `useCoAgent` shared state — the dashboard re-renders as the agent answers, with numbers lifted from tool results, never re-typed by the LLM. v1 uses **external `useState` + `setState` callback**; v2 moves state **inside** the hook (`agent.state` / `agent.setState`, optional `initialState`). This is a pattern migration, not a rename.

**The risk:** the analytics dashboard's "cards update as the agent answers" behaviour depends on the external-state wiring. v2's internal state may change update timing or dedup. **This is the one contract that genuinely needs the spike to prove**, not just document.

**SAN-888 · CK-V2-002 must prove (runtime):** `hostOpsAgent` + `HostDashboardState` round-trips through `useAgent` — KPI lift updates cards with no LLM re-typing and no double-render (the bug class #198 fixed on v1). **SAN-887 delivered grep-only export proof; runtime proof is explicitly deferred here.**

---

## 🔴 The finding the other audits miss — cross-program collision on `/host/analytics`

**Two active programs are scheduled to edit the same surface at the same time:**

| Program | Next tasks touching `/host/analytics` | State |
|---|---|---|
| **AIE (Event OS)** | SAN-761 · AIE-009 — Generative KPI cards · SAN-763 · AIE-010 — Event analytics funnel · SAN-884 · AIE-008B — Host Events OS Hub | Backlog, **next up**, build on **v1** |
| **CK-V2 migration** | SAN-888 · CK-V2-002 — v2 prototype on `/host/analytics` | **In Progress** (branch `ai/san-888-ck-v2-002-host-analytics-prototype`; SAN-887 ✅ Done via PR #207 · `408d2d8`) |

If SAN-761 · AIE-009 adds new KPI cards on v1 **while** SAN-888 rebuilds the analytics bridge on v2, you get merge conflicts, double-work, and two divergent versions of `host-ops-copilot-bridge`. Neither the `02-` nor the `03-copilotkitv2` audit flags this — they audit the migration in isolation.

**Logged decision (2026-06-12 — must stay on both SAN-888 and SAN-761):**

**Finish SAN-888 first** as the migration foundation for `/host/analytics`, **then** build SAN-761 · AIE-009 — Generative KPI cards on analytics on top of the v2 bridge (`host-ops-copilot-bridge-v2.tsx`). Reason: avoid building KPI cards on v1 and migrating them twice.

**Do not** start parallel v1 edits to `host-ops-copilot-bridge.tsx` while SAN-888 is active. Decision must be logged on **both** issues before coding either surface deeply.

---

## Per-task correctness (AI-native lens)

| Task | Mechanically correct? | AI-native verdict | Note |
|---|---|---|---|
| **SAN-886 · CK-V2-000 — v1→v2 migration epic** | ✅ (98%, audit 03-ckv2) | 🟢 Correct | Hook table matches installed package; backend-unchanged is right |
| **SAN-887 · CK-V2-001 — hook-signature spike** | ✅ | ✅ **Done** (PR #207 · squash `408d2d8`) | Grep/export proof complete; HostDashboardState runtime proof → SAN-888 AC |
| **SAN-888 · CK-V2-002 — analytics v2 prototype** | ✅ | 🟢 **In Progress** | Branch `ai/san-888-ck-v2-002-host-analytics-prototype`; collision decision logged; Linear ACs patched |
| **SAN-889 · CK-V2-003 — host event v2** | ✅ | 🟡 Correct | HITL diagram present; **missing** explicit Contract 2 assert bullets in AC |
| **SAN-890 · CK-V2-004 — chat v2 (last)** | ✅ | 🟢 Correct | `Headless_c` fix on Linear; venue HITL + slot ACs present |
| **SAN-891 · CK-V2-005 — retire react-ui** | ✅ | 🟢 Correct | Subpath only; no package bump |
| **SAN-892 · CK-V2-006 — tag build-on-v2** | ✅ | 🟡 Partial | AIE trio tagged (761/763/884); ≥12 CK-/CONCIERGE-* batch continues |

---

## Linear corrections checklist — have they been applied?

Verified against live Linear descriptions (2026-06-12, post–PR #207). Companion checklist: [`02-upgrade-tasks-linear.md` § Program correction checklist](./02-upgrade-tasks-linear.md).

### Summary

| Bucket | Applied | Pending | Verdict |
|---|---|---|---|
| **CK-V2 program corrections** (hook tables, HITL, Headless_c, mermaid, spike) | **14 / 16** | 2 | 🟡 Mostly done |
| **AI-native corrections** (Contracts 1–3 ACs, collision decision) | **7 / 7** | 0 | 🟢 Patched on Linear (pass 3) |
| **Overall** | **21 / 23** | **2** | 🟡 Infisical doc + SAN-892 AIE tagging batch remain |

### CK-V2 program corrections (from `02-` + `03-copilotkitv2` audits)

| # | Correction | Linear target(s) | On Linear? | Evidence |
|---|---|---|---|---|
| 1 | `useCopilotAction` + handler → `useFrontendTool` | SAN-886, 889 | ✅ | Hook table on SAN-886 |
| 2 | `available:"disabled"` + render → **`useRenderTool`** | SAN-886, 888 | ✅ | SAN-888 bridge table + “Do not use `useFrontendTool`” |
| 3 | `renderAndWaitForResponse` → **`useHumanInTheLoop`** | SAN-886, 889, 890 | ✅ | SAN-889 sequence diagram; SAN-890 venue HITL |
| 4 | `useCoAgent` → `useAgent({ agentId })` + `agent.state`/`setState` | SAN-886, 889, 890 | ✅ | Not prop-for-prop called out on epic |
| 5 | **No** `useCopilotChatHeadless_c` on `/v2` | SAN-890 | ✅ | Correction block 2026-06-12 on SAN-890 |
| 6 | Chat = `useAgent` + stock `CopilotChat` + slots | SAN-890 | ✅ | Slot table + ACs on SAN-890 |
| 7 | Backend unchanged; subpath only @ 1.55.2 | SAN-886 | ✅ | Strategy section |
| 8 | Plain-language “In plain terms” intros | SAN-886–890 | ✅ | Present on route tasks |
| 9 | Official Migrate-to-V2 Steps 1–4 on epic | SAN-886 | ✅ | Step table |
| 10 | Per-route Steps 1–3 on 888/889/890 | SAN-888–890 | ✅ | Migration steps sections |
| 11 | Mermaid diagrams per issue | SAN-886–892 | ✅ | All seven issues |
| 12 | Spike deliverable + grep export proof | SAN-887 | ✅ | **Done** — PR #207 merged; description updated |
| 13 | `build-on-v2` label created | SAN-892 | ✅ | Label exists (per `02-` audit) |
| 14 | Tag ≥12 CK-/CONCIERGE-* backlog issues | SAN-892 | 🟡 | **6+ tagged** — SAN-740, 709, 833, 761, 763, 884; continue CK-/CONCIERGE-* batch |
| 15 | Infisical/Vercel doc for `COPILOTKIT_V2_ANALYTICS` | SAN-888 | ⬜ | Not in Linear description yet |
| 16 | SAN-886 `useCopilotChat` row — remove “headless” ambiguity | SAN-886 | 🟡 | Row still says “headless / stock `CopilotChat`”; SAN-890 is authoritative |

### AI-native corrections (this audit — **mostly still open on Linear**)

| # | Correction | Linear target(s) | On Linear? | Notes |
|---|---|---|---|---|
| A1 | **Contract 1 AC:** KPI values = tool `result` JSON (Zod-lifted), byte-for-byte; LLM narrates only | SAN-888 | ✅ | `useRenderTool` only; no `useFrontendTool` for render-only cards |
| A2 | **Contract 1 AC:** Flag **off** = pixel-identical to prod v1 | SAN-888 | ✅ | `COPILOTKIT_V2_ANALYTICS=0/off` AC on SAN-888 |
| A3 | **Contract 2 AC:** HITL blocks until human chooses; no silent auto-publish | SAN-889, 890 | ✅ | Explicit assert bullets on SAN-889 (pass 3) |
| A4 | **Contract 3 AC:** `HostDashboardState` round-trip via `useAgent`; no double-render | SAN-888 | ✅ | Runtime proof + evidence folder AC on SAN-888 |
| A5 | **Collision decision** logged (SAN-888 first → SAN-761 on v2 bridge) | SAN-888 + SAN-761 | ✅ | Logged 2026-06-12 on both issues |
| A6 | SAN-888 blocked-by text → “SAN-887 Done” (not only “spike doc committed”) | SAN-888 | ✅ | PR #207 · `408d2d8` |
| A7 | Tag unbuilt **AIE** backlog (`SAN-761`, `763`, `884`…) with `build-on-v2` or sequencing note | SAN-892 + AIE issues | 🟡 | Labels applied pass 3; batch may need SAN-763 confirm |

### Per-issue rollup

| Issue | Program corrections | AI-native corrections | Ready to implement? |
|---|---|---|---|
| **SAN-886 · CK-V2-000** | ✅ Complete | N/A (epic) | 🟢 |
| **SAN-887 · CK-V2-001** | ✅ **Done** | Contract 3 → deferred to 888 (documented on issue) | ✅ Closed |
| **SAN-888 · CK-V2-002** | 🟡 Infisical doc pending | ✅ Contracts + collision logged | 🟢 **GO — implement in worktree** |
| **SAN-889 · CK-V2-003** | ✅ Complete | ✅ Contract 2 assert ACs | 🟢 (after 888) |
| **SAN-890 · CK-V2-004** | ✅ Complete | ✅ Contract 2 for venue booking | 🟢 (after 889) |
| **SAN-891 · CK-V2-005** | ✅ Complete | N/A | 🟢 (after 890) |
| **SAN-892 · CK-V2-006** | 🟡 ≥12 batch incomplete | ✅ AIE 761/763/884 tagged | 🟡 Continue CK-/CONCIERGE-* batch |
| **SAN-761 · AIE-009** (collision) | N/A | ✅ Sequence-after SAN-888 logged | 🟡 Hold until SAN-888 merges |

---

## Is it correct? — direct answer

**Yes — ~90% on the AI-native lens after pass 3.** SAN-887 grep/export proof is complete (PR #207 · `408d2d8`); HostDashboardState runtime proof is explicitly SAN-888 acceptance criteria. Collision decision is logged: **SAN-888 first, then SAN-761 on v2 bridge.** Remaining hygiene: Infisical doc for `COPILOTKIT_V2_ANALYTICS` and finish SAN-892 `build-on-v2` batch.

## Next steps

1. **Implement SAN-888** on `ai/san-888-ck-v2-002-host-analytics-prototype` in `.worktrees/wt-san-888-ck-v2-002`; evidence `docs/tasks/testing/evidence/SAN-888/`.
2. **Document Infisical/Vercel** flag for `COPILOTKIT_V2_ANALYTICS` on SAN-888.
3. **Continue SAN-892** — finish `build-on-v2` tagging batch (≥12 issues); SAN-761/763/884 tagged pass 3.
4. **Hold SAN-761** until SAN-888 merges — build generative KPI cards on v2 bridge, not v1 `host-ops-copilot-bridge.tsx`.
5. **Do not bump past `@copilotkit/*@1.55.2`** until SAN-891 · CK-V2-005 — Retire react-ui.

## Go / no-go

| Decision | Verdict |
|---|---|
| v2 program direction (AI-native correctness) | 🟢 **GO** |
| SAN-887 · CK-V2-001 spike | ✅ **Done** (PR #207 · squash merge `408d2d8`; grep/export proof complete) |
| Start SAN-888 implementation code | 🟢 **GO** (collision decision logged on SAN-888 + SAN-761) |
| Parallelize SAN-888 with SAN-761 · AIE-009 unmanaged | 🔴 **NO-GO** — SAN-761 sequences after SAN-888; no parallel v1 bridge edits |
| Full cutover SAN-891 this cycle | 🔴 **NO-GO** — after 889 + 890 |

---

## References

- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) · SAN-886–892 (`V2UP` · project *AI & Intelligence*) · SAN-887 **Done** · SAN-888 **In Progress**
- Companion: [`02-upgrade-tasks-linear.md`](./02-upgrade-tasks-linear.md) · [`03-copilotkitv2-upgrade-audit.md`](./03-copilotkitv2-upgrade-audit.md) · [`official-docs.md`](./official-docs.md)
- AI-native program: [`docs/events/tasks/AI-native-system/summary.md`](../events/tasks/AI-native-system/summary.md) · [`plan.md`](../events/tasks/AI-native-system/plan.md) · [`audit/07-doc-review-2026-06-12.md`](../events/tasks/AI-native-system/audit/07-doc-review-2026-06-12.md)
- Installed ground truth: `node_modules/@copilotkit/react-core/dist/v2/index.d.cts` (all planned hooks present; subpath + styles resolve)
- Migration surface: `git grep` on `origin/main` (20 react-core · 9 react-ui · 3 co-agent mounts · 2 HITL · 2 disabled-render)

---

*AI-native pass 3 — 2026-06-12: SAN-887 Done (PR #207 · `408d2d8`) · SAN-888 In Progress · collision logged (888→761) · Linear Contracts 1–3 patched · 21/23 corrections on Linear.*
