---
title: CopilotKit production gaps — backlog (Phase 1)
updated: 2026-05-24
canonical: ../../plan/mastra/05-mastra-copilotkit.md
parent: ./INDEX.md
audit: ../audit/22-task-order-audit.md
forensic_note: 2026-05-24 — deps use F19 concierge on `/` (MASTRA-002 superseded); MAP-007B replaces MAP-007
---

# CK gap backlog — executable when ready

Companion to [`plan/mastra/05-mastra-copilotkit.md`](../../plan/mastra/05-mastra-copilotkit.md).

**Gate:** **MAP-001 ✅** + **F19 ✅** (`conciergeAgent` default on `/` via `layout.tsx`). **`/chat` redirects to `/`** — all CK smokes use `/` as canonical surface. **MASTRA-002 superseded** — do not block on it.

**Naming:** This file owns **CK-001…008** (production-gap validation). Product delivery stays on **F/MAP/SCREEN** tasks; this backlog owns **contracts + E2E + AG-UI proof**.

---

## Priority summary

| Tier | IDs | When |
|------|-----|------|
| 🔴 MVP hard | CK-001, CK-002, CK-004, CK-005, CK-007 | After SCREEN-001–004 chrome + F19 live on `/` (CK-004 with F37) |
| 🟡 MVP soft | CK-003, CK-006 | MAP-001 ✅ · **CK-FE-001 `focusMapPin` partial ✅** |
| ⏸ Post-MVP | CK-008 + deferred list | After MASTRA-003 ✅ + thread UI (SCREEN-002) |

---

## CK-001 — AG-UI SSE smoke (Sofía) — MVP hard

**Priority:** P0 · **Effort:** 2h · **Depends:** F19, MAP-001, SCREEN-001 (chrome)

**Goal:** Prove one **`/`** turn emits AG-UI stream (text + tool lifecycle), not only HTTP 200 on `/api/copilotkit`.

**Acceptance:**
- [ ] One rental query on **`/`** shows streaming text before final message
- [ ] Tool lifecycle visible (tool call start → output) via CK-006 Inspector or dev console
- [ ] Evidence: `tasks/notes/CK-001-evidence.md` (event snippet or screenshot)

**Docs:** [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) · pairs with **CK-007**

**Defer:** Full automated SSE parser until Playwright wired (W8+) — CK-007 adds structured checks first.

---

## CK-002 — Typed `MapUiState` contract (Camila) — MVP hard

**Priority:** P0 · **Effort:** 4h · **Depends:** MAP-001 ✅, **F50 ✅** (partial — formalize + CK-005)

**Goal:** Explicit typed shared-state contract for map + cards + agent context — **not** full collaborative multi-user state.

**MVP scope (in):**
- [x] Pin focus + card sync — **F50** + `smoke:f50-pin-sync` ✅
- [ ] Formal Zod contract doc + agent working-memory mirror per [`maps-prd.md`](../../plan/maps/maps-prd.md) §6.2
- [ ] **`RentalSearchState` slice** — `selectedRentalId`, `resultIds[]` from F46 workflow output
- [ ] Frontend → agent writes for pin focus / selected rental id (extend F50)
- [ ] Agent → frontend reads for card list + highlight id

**Out of scope (Phase 2+):** CRDT sync, optimistic merge, multi-tab replay, collaborative editing.

**Pattern sources:** `CopilotKit/examples/canvas/mastra/src/lib/canvas/state.ts`, [MAP-001](../maps/MAP-001-platform-contracts.md) contracts.

**Sync tests:** **CK-005** (Playwright) — do not mark CK-002 Done without CK-005 or explicit N/A with evidence.

---

## CK-003 — Frontend tool actions (map focus / modals) — MVP soft

**Priority:** P1 · **Effort:** 2h · **Depends:** MAP-001 ✅

**Goal:** At least one `useCopilotAction` frontend tool so the agent can drive map UX (e.g. `focusMapPin`, open rental detail).

**Acceptance:**
- [x] **`focusMapPin`** — `components/copilot/focus-map-pin-action.tsx` ✅
- [ ] Agent invokes tool from **`/`** turn in live chat (manual proof)
- [ ] Map panel responds without manual user click
- [ ] Optional: second tool for modal/sheet (SCREEN-007)

**Docs:** [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) · **MAP-007B** layout

---

## CK-004 — HITL interrupt/resume acceptance (Roberto) — MVP hard

**Priority:** P0 · **Effort:** covered by F37/F38 · **Depends:** F36

**Goal:** `renderAndWaitForResponse` publish gate with workflow suspend/resume semantics for Roberto's event publish flow.

**Acceptance:** See [`F37`](../events/EVP-011-core-approval-panel-hitl.md), [`F38`](../events/EVP-012-core-approval-commit-edge-fn.md).

**Out of scope:** General-purpose resumable workflow engine, multi-step admin approvals, cross-session replay (Phase 2+).

**Docs:** [interrupt-flow](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) · `CopilotKit/examples/showcases/banking/` · [EVP-011-core](../archive/events-A/EVP-011-core-approval-panel-hitl.md).

---

## CK-005 — Playwright pin↔card sync E2E (Lucía) — MVP hard

**Priority:** P0 · **Effort:** 4–6h · **Depends:** CK-002, F46 ✅, MAP-001 ✅

**Goal:** E2E proof that UI, map, and agent context stay aligned — closes [#3426](https://github.com/CopilotKit/CopilotKit/issues/3426) class bugs.

**Acceptance:**
- [x] Script smoke: `npm run smoke:f50-pin-sync` ✅ (pre-Playwright)
- [ ] Playwright: chat → rental cards appear
- [ ] Card click → map pin highlights
- [ ] Pin click → card focus
- [ ] Follow-up prompt stays on same rental context (thread id until CK-008)
- [ ] Evidence file or spec under `mdeapp/e2e/` when Playwright wired

**Note:** Separated from CK-002 intentionally — contract first, E2E second.

---

## CK-006 — Inspector integration (Sofía dev) — MVP soft

**Priority:** P1 · **Effort:** 1h · **Depends:** none (dev only)

**Goal:** CopilotKit [Inspector](https://docs.copilotkit.ai/mastra/inspector) enabled in local dev on **`/`** for AG-UI debugging.

**Acceptance:**
- [ ] Inspector reachable in dev (env flag or dev-only import documented in `mdeapp/docs/ARCHITECTURE.md`)
- [ ] Sofía can inspect one **`/`** turn during F19 / SCREEN-001 debug
- [ ] Not required in production build or Vercel preview DoD

**Pairs with:** CK-001, CK-007

---

## CK-007 — AG-UI streaming lifecycle validator (Sofía) — MVP hard

**Priority:** P0 · **Effort:** 3–4h · **Depends:** CK-001, F19

**Goal:** Validate AG-UI event phase ordering for at least one tool-using turn — prevents silent stream failures in production.

**Acceptance:**
- [ ] Document expected sequence: stream start → text/tool events → tool output → completion
- [ ] Dev script or Vitest integration test asserts minimum event count / ordering for mocked or recorded fixture
- [ ] Failure mode documented when stream ends early (user sees error, not frozen UI)
- [ ] Evidence in `tasks/notes/CK-007-evidence.md`

**Docs:** [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) · [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering)

**Out of scope:** Full AG-UI replay server, multi-tab sync.

---

## CK-008 — Thread hydration — POST-MVP

**Priority:** P1 post-MVP · **Effort:** 3h · **Depends:** MASTRA-003 ✅, SCREEN-002

**Goal:** Reload **`/`** restores pins, cards, and thread from Postgres.

**Docs:** [threads](https://docs.copilotkit.ai/mastra/threads)

---

## Phase 2+ (no task file yet)

Document only in `05-mastra-copilotkit.md` — **not** Phase 1 DoD:

- Durable threads beyond CopilotKit default thread id
- Replayable sessions / AG-UI full replay (alias **CK-AGUI-003**)
- MCP generative UI
- Advanced programmatic control
- Collaborative multi-user state
- Realtime multi-tab thread sync
- Advanced workflow persistence beyond Roberto HITL
- Optimistic state reconciliation / CRDT complexity
- Disconnect/reconnect recovery (alias **CK-AGUI-004**, **E2E-006**)

---

## Alias crosswalk (audit IDs → canonical)

Full mapping: [`tasks/mastra/CROSSWALK-ck-ui-e2e-state.md`](../mastra/CROSSWALK-ck-ui-e2e-state.md)

| Alias family | Canonical owners |
|--------------|------------------|
| CK-AGUI-001…005 | CK-001, CK-007, Phase 2+ |
| PM-STATE-001…005 | EVP-008/009/010/011 (`canvas/mastra-pm`, `form-filling`) |
| CK-FE-001…005 | CK-003, F36, F46, EVT-01 |
| STATE-001…006 | CK-002, F33, F46, CK-008 |
| E2E-001…006 | CK-001…005, CK-008, Phase 2+ |

**Do not create duplicate task files for alias IDs.**

---

## CK-003 expanded — frontend tools (CK-FE aliases)

| Sub-item | Tool example | Depends | Status |
|----------|--------------|---------|--------|
| CK-FE-001 | `focusMapPin` | MAP-001 | ✅ shipped |
| CK-FE-002 | open venue detail sheet | SCREEN-007 | Not started |
| CK-FE-003 | navigate filter / chip | SCREEN-003, F46 ✅ | Partial |
| CK-FE-004 | host wizard step jump | F36 | Not started |
| CK-FE-005 | checkout deep-link | EVT-01 | Not started |

Phase 1 MVP minimum: **CK-FE-001** satisfies CK-003 **partial** — mark CK-003 Done after live agent invocation proof.
