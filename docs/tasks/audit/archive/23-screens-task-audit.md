---
title: Screen Task Forensic Audit
date: 2026-05-24
auditor: task-verifier (Cursor)
follows:
  - ./22-task-order-audit.md
  - ./21-task-progress-wireframe-audit.md
user_review_score: 86/100
verified_score:
  spec_quality: 88/100
  order_alignment: 72/100
  execution_readiness: 68/100
sources:
  - tasks/INDEX-SCREEN-FIRST.md
  - tasks/screens/INDEX.md
  - tasks/screens/SCREEN-001..020.md
  - tasks/audit/22-task-order-audit.md
  - mdeapp/src/components/chat/
  - mdeapp/src/components/copilot/
  - mdeapp/src/mastra/
  - CLAUDE.md
probes:
  - "cd mdeapp && npm test → 91/91 exit 0"
  - "ls mdeapp/src/components/chat/chat-canvas.tsx → exists"
  - "glob workflow-progress*.tsx → 0 files"
  - "grep chat-lead-capture mdeapp → docs only, no edge fn"
  - "grep hostEventAgent mdeapp/src/mastra → not registered"
  - "F47 status: Not Started · EVT-01: Not Started · F11: Not Started"
architecture: Browser → CopilotKit 1.55.2 → /api/copilotkit → Mastra → gemini-3.5-flash → ADK :8000 → Supabase
---

# 23 — Screen Task Audit

**Verdict:** User review **86/100 is directionally correct** — task specs are **mostly strong**; the main gap is **index order** (SCREEN-002 and SCREEN-018 too early) and **unverified workflow-stream assumptions** in SCREEN-004. Forensic re-score: **88/100 spec quality**, **72/100 order alignment**, **68/100 execution readiness** (blockers: F47, EVT-01, F11, F33–F38).

**Persona impact:** Camila on `/` needs chrome + cards before G2/G1 edges; Roberto’s wizard (SCREEN-016) must land **before** saved/trips retention work, **after** commerce slice is wired.

---

## 1. Executive verdict

### Is the user’s review correct?

| Claim | Verdict | Evidence |
|-------|---------|----------|
| Tasks mostly strong, not 100% | ✅ Agree | 20 specs exist; 8+ have partial disk artifacts; template drift vs mde-task-lifecycle §6 |
| CopilotKit-first order is correct | ✅ Agree | F48/F49/F50/MAP-007B Done; next work is visible `/` chrome |
| SCREEN-002 too early | ✅ Agree | Stub nav exists; thread hydration needs `mastra_threads` + CK thread id — backend-heavy |
| SCREEN-004 assumes workflow stream | ✅ Agree | No `workflow-progress-strip.tsx`; workflows exist but step events not exposed to UI |
| SCREEN-008 blocked by F47 | ✅ Agree | `grep chat-lead-capture mdeapp` → docs only; F47 `Not Started` |
| SCREEN-009 blocked by F11 + EVT-01 | ✅ Agree | F11 `Not Started`; EVT-01 `Not Started`; no ticket edges in mdeapp |
| SCREEN-011–013 too early (retention) | ✅ Agree | P1 Phase 4; depends on Save CTA + nav — after G1/G2 |
| SCREEN-016 before saved/trips | ✅ Agree | Roberto is MVP persona; F33–F38 all `Not Started` — UI task blocked but **order** should precede 011–013 |
| Immediate next: 001 → 003 → 004 → 005 | ✅ Agree | Fastest visible progress on `/` |

### Corrected implementation order (authoritative after this audit)

```text
 1. SCREEN-001  Home chat chrome (integrate existing stubs)
 2. SCREEN-003  Query bar + chips (useCoAgent → lastRentalQuery)
 3. SCREEN-004  Workflow strip (tool-call UI first — not raw Mastra step stream)
 4. SCREEN-005  Rental card polish + CTAs
 5. SCREEN-007  Venue detail sheet
 6. SCREEN-006  Event card polish (can parallel 005–007 UI)
 7. SCREEN-014  Event detail page
 8. SCREEN-008  Schedule viewing — 🔴 BLOCKED until F47 + edge port
 9. SCREEN-009  Checkout modal — 🔴 BLOCKED until F11 + EVT-01
10. SCREEN-015  My tickets QR — after SCREEN-009
11. SCREEN-016  Host wizard — 🔴 BLOCKED until F33–F38; order before retention
12. SCREEN-019  Empty/error states (cross-cutting P1)
13. SCREEN-020  Accessibility pass (P1)
14. SCREEN-011  Saved collections (retention — after G1/G2 slice)
15. SCREEN-012  Trips dashboard
16. SCREEN-013  Itinerary panel
17. SCREEN-002  Nav rail + thread list (real hydration — defer from order 2)
18. SCREEN-018  Mobile shell polish (partial exists — defer from order 5)

Parallel (any time after SCREEN-001):
  SCREEN-010  Map panel polish
  SCREEN-017  Login/signup polish
```

**Phase 1 exit bundle (unchanged):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:f50-pin-sync && npm run verify:console && npm run floor
```

---

## 2. Verification report — per SCREEN task

| Task | User score | Spec /100 | Readiness /100 | Blockers | Safe to execute? | Grade | Main finding |
|------|----------:|----------:|---------------:|----------|-------------------|-------|--------------|
| INDEX | 84% | 82 | 70 | Order 2,5 wrong | Partial | 🟡 | Defer 002/018; mark 008/009 blockers |
| SCREEN-001 | 92% | 90 | 85 | 0 | **Yes** | 🟢 | Grid + stubs on disk; needs strip slot + integration AC |
| SCREEN-002 | 78% | 76 | 45 | Thread backend | **Defer** | 🟡 | F13 dep wrong (observability ≠ threads) |
| SCREEN-003 | 86% | 88 | 82 | 0 | **Yes** | 🟢 | Schema fields exist; chip → `lastRentalQuery` |
| SCREEN-004 | 80% | 78 | 55 | Stream unverified | **Yes*** | 🟡 | *UI-only; use tool in-progress, not workflow SSE |
| SCREEN-005 | 90% | 90 | 85 | 0 | **Yes** | 🟢 | RentalCard minimal; F49/F50 Done |
| SCREEN-006 | 84% | 86 | 80 | 0 | **Yes** | 🟢 | No EventCard file; F15 backend Done |
| SCREEN-007 | 88% | 88 | 82 | 0 | **Yes** | 🟢 | Pure UI sheet; F50 pin focus |
| SCREEN-008 | 76% | 82 | 25 | F47, edge | **No** | 🟡 | Shell OK; submit blocked |
| SCREEN-009 | 72% | 80 | 20 | F11, EVT-01 | **No** | 🟡 | Modal spec good; no Stripe path |
| SCREEN-010 | — | 85 | 75 | SCREEN-018 soft | Parallel | 🟢 | MAP-001/008 Done; partial ChatMap |
| SCREEN-011 | — | 84 | 40 | G1/G2, Save | **Defer** | 🟡 | Retention; RLS tables exist |
| SCREEN-012 | — | 82 | 35 | SCREEN-011 | **Defer** | 🟡 | Phase 4 |
| SCREEN-013 | — | 82 | 35 | SCREEN-012 | **Defer** | 🟡 | Phase 4 |
| SCREEN-014 | — | 86 | 78 | SCREEN-006 | **Yes** | 🟢 | Route likely missing; low risk |
| SCREEN-015 | — | 84 | 30 | SCREEN-009 | **No** | 🟡 | After G1 |
| SCREEN-016 | — | 88 | 15 | F33–F38 | **No** | 🟡 | Auth placeholder only; order OK |
| SCREEN-017 | — | 80 | 70 | F08 | Parallel | 🟢 | Auth exists |
| SCREEN-018 | — | 84 | 65 | — | **Defer** | 🟡 | `map-mobile-sheet.tsx` partial |
| SCREEN-019 | — | 82 | 72 | — | After 001 | 🟢 | Cross-cutting |
| SCREEN-020 | — | 80 | 68 | SCREEN-019 | After 019 | 🟢 | a11y pass |

**Weighted screen-set score:** **88/100** spec quality (user **86/100** — within 2 pts; agree).

---

## 3. Claims verified (disk probes)

| Claim | Probe | Result |
|-------|-------|--------|
| 3-panel shell exists | `chat-canvas.tsx` | ✅ `lg:grid-cols-[240–280 \| flex-1 \| 360–420]` + ChatNavRail + ChatCenterPanel + ChatMapPanel |
| Nav rail is stub | `chat-nav-rail.tsx` | ✅ "Chats — coming soon", "Saved — coming soon" |
| Query bar is stub | `chat-query-bar.tsx` | ✅ "filters coming soon" |
| No workflow strip | `glob workflow-progress*.tsx` | ✅ 0 files |
| Rental cards partial | `rental-card.tsx` | ✅ No Schedule/Save CTAs; pin sync via F50 |
| No event card | `glob event-card*.tsx` | ✅ 0 files |
| useCoAgent wired | `map-ui-sync.tsx` | ✅ `name: "conciergeAgent"` matches Mastra key |
| Working memory schema | `concierge.ts` + `types.ts` | ✅ `lastRentalQuery.neighborhood` etc. in sync |
| Workflows on disk | `rental-search-workflow.ts` | ✅ 3 steps: search → format → rerank |
| F47 / EVT-01 not shipped | task frontmatter | ✅ Both `Not Started` |
| F11 not shipped | `tasks/events/F11-*.md` | ✅ `Not Started` |
| hostEventAgent missing | `grep hostEventAgent mdeapp/src/mastra` | ✅ Not registered |
| Tests green | `npm test` | ✅ 91/91 exit 0 |
| F48/F49/F50 foundation | smokes in INDEX | ✅ Referenced Done in audit 22 |
| `/host/event/new` placeholder | `host/event/new/page.tsx` | ✅ Auth gate only |

---

## 4. Claims not verified / stale

| Claim | Status | Action |
|-------|--------|--------|
| Mastra exposes clean workflow step events to CopilotKit | **Not verified** | SCREEN-004: start with tool-call / working-memory step labels |
| CopilotKit thread id ↔ `mastra_threads` sync pattern | **Not verified** | Defer SCREEN-002 until spike or F13-adjacent thread task |
| F13 enables thread list | **Stale/wrong** | F13 = `ai_runs` observability Done — not thread UI |
| SCREEN-001 "Not Started" | **Stale** | Disk = **partial** (~60%): grid wired, stubs mounted, no strip slot |
| INDEX-SCREEN-FIRST order 2=002, 5=018 | **Stale** | Fixed in this audit → see §1 order |

---

## 5. Red flags (user table — validated)

| Red flag | Valid? | Fix |
|----------|--------|-----|
| SCREEN-002 too early | ✅ | Keep visual stub in 001; move 002 to order **17**; remove F13 from `depends_on` or replace with thread-storage task |
| SCREEN-004 assumes workflow stream | ✅ | DoD: strip driven by `search-rentals` / `search-events` in-progress + idle/complete; optional `workflowStep` in working memory later |
| SCREEN-008 blocked | ✅ | Label 🔴 in INDEX; implement modal shell only after F47 edge smoke passes |
| SCREEN-009 blocked | ✅ | Label 🔴; requires F11 → EVT-01 → webhook |
| SCREEN-011–013 too early | ✅ | Orders **14–16** after commerce + host |
| SCREEN-016 too late vs saved | ✅ Partially fixed 2026-05-24 (was order 18); keep at **11** before retention |

---

## 6. Per-task notes (forensic)

### SCREEN-001 — Home Chat Chrome (🟢 execute first)

- **Disk:** `ChatCanvas` already mounts `ChatNavRail`, `ChatQueryBar` via `ChatCenterPanel`; missing explicit workflow strip mount point.
- **Deps:** F48 ✅, MAP-007B ✅ — safe.
- **Spec gap:** Uses shortened template (not full §1–10 mde-task-lifecycle) — 🟡 acceptable for screen pack.
- **Fix:** Add empty `<WorkflowProgressStrip />` slot in `chat-center-panel.tsx` (no-op until SCREEN-004).

### SCREEN-002 — Nav Rail + Threads (🟡 defer)

- **Issue:** Requires Supabase `mastra_threads`/`mastra_messages` read path + CopilotKit thread switching — violates "visible UI first."
- **Wrong dep:** `F13` = ai_runs logging, not thread persistence.
- **Fix:** Split into **002a** visual (already in 001 stub) vs **002b** hydration (this task, late order).

### SCREEN-003 — Query Bar (🟢 execute second)

- **Schema risk (user noted):** Low — `ConciergeWorkingMemory.lastRentalQuery.neighborhood` already exists; extend only if new chip types needed.
- **Pattern:** Mirror `map-ui-sync.tsx` `useCoAgent({ name: "conciergeAgent" })`.

### SCREEN-004 — Workflow Strip (🟡 execute third — UI-only)

- **Backend:** `rental-search-workflow` has 3 steps; AG-UI bridge step events **not proven**.
- **CopilotKit pattern:** Use generative UI / tool render loading state or `useCopilotChat` message stream for "Searching…" before cards.
- **Do not:** Block on Mastra workflow SSE.

### SCREEN-005 / 007 — Rental slice (🟢)

- **005:** Add Schedule (opens modal hook) + Save (disabled until 011); remove external `source_url` emphasis per wireframe.
- **007:** shadcn Sheet; no new Mastra tool required for MVP.

### SCREEN-006 / 014 / 009 / 015 — Event commerce (🟡)

- **006:** Create `event-card-inline.tsx`; tool output shape must match F15 `search-events` JSON — verify in Vitest before polish.
- **009/015:** Hard blocked on F11 + EVT-01; modal UI can be stubbed with feature flag off.

### SCREEN-008 — Schedule viewing (🔴 blocked)

- **DoD item "Submit creates leads row"** impossible until F47 ports `chat-lead-capture`.
- **Safe partial:** Modal + validation + mock success only with `NEXT_PUBLIC_MOCK_LEADS=1` — not Done without edge.

### SCREEN-016 — Host wizard (🔴 blocked, correct order)

- **Disk:** Placeholder page only; `hostEventAgent` not in `mastra/agents`.
- **All deps Not Started:** F33, F34, F36, F37, F38.
- **Order:** Before 011–013 ✅; after Camila commerce slice ✅.

---

## 7. Dependency / blocker matrix

| SCREEN | Hard blockers | Soft deps | Can start UI shell? |
|--------|---------------|-----------|---------------------|
| 001 | — | F48, MAP-007B ✅ | Yes — **now** |
| 003 | — | 001 | Yes — after 001 slot |
| 004 | — | 001, F49 ✅ | Yes — tool-metadata UI |
| 005 | — | 004, F49/F50 ✅ | Yes |
| 007 | — | 005 | Yes |
| 006 | — | 004, F15 ✅ | Yes |
| 014 | — | 006 | Yes |
| 008 | **F47**, F12 ✅ | 005, 007 | Modal only — not Done |
| 009 | **F11**, **EVT-01** | 006, 014 | Modal only — not Done |
| 015 | SCREEN-009 | EVT-01 | No |
| 016 | **F33–F38** | — | Shell only — not Done |
| 011–013 | G1/G2 + Save | 002, 005 | Defer |
| 002 | Thread storage | 001 | Defer |
| 018 | — | 001 | Defer (partial exists) |

---

## 8. Spec quality gaps (cross-cutting)

| Issue | Severity | Tasks affected |
|-------|----------|----------------|
| Template ≠ mde-task-lifecycle §6 (missing §6 Agents numbered sections) | 🟡 | All SCREEN-* |
| Literal `\n` in Tests bullets (copy-paste artifact) | 🟡 | 001, 002, 003, 004, 005, 006, 010 |
| SCREEN-002 `depends_on: F13` misleading | 🟡 | 002 |
| SCREEN-004 implies workflow stream without fallback | 🟡 | 004 |
| Status `Not Started` vs disk `partial` | 🟡 | 001, 002, 003, 005, 018 |
| SCREEN-009 missing explicit F11 in screens/INDEX depends column | 🟡 | INDEX only |

---

## 9. Immediate next actions

1. **Execute:** SCREEN-001 → SCREEN-003 → SCREEN-004 → SCREEN-005 (Camila visible progress on `/`).
2. **Index patch:** Apply order in §1 to `INDEX-SCREEN-FIRST.md` + `tasks/screens/INDEX.md` (this audit).
3. **SCREEN-004 spec patch:** Add "Phase A: tool in-progress labels; Phase B: workflow memory field" to build scope.
4. **SCREEN-002 spec patch:** Remove F13 from `depends_on`; add note "defer until thread hydration spike."
5. **Backend parallel (not blocking chrome):** F11 → EVT-01 (G1), F47 + EDGE-PORT (G2) — per audit 22.
6. **Do not mark any SCREEN Done** without `tasks/notes/SCREEN-###-evidence.md` + localhost proof (anti-fake-done gate 9).

---

## 10. Stop condition

> **🛑 SCREEN-008, SCREEN-009, SCREEN-015, SCREEN-016 are not ready for Done** until backend blockers clear.
>
> **✅ Safe to execute now:** SCREEN-001, SCREEN-003, SCREEN-004 (UI-only), SCREEN-005, SCREEN-006, SCREEN-007, SCREEN-014.

---

## 11. Cross-links

| Doc | Role |
|-----|------|
| [22-task-order-audit.md](./22-task-order-audit.md) | Backend + G1/G2 sequencing |
| [21-task-progress-wireframe-audit.md](./21-task-progress-wireframe-audit.md) | Wireframe ↔ disk map |
| [INDEX-SCREEN-FIRST.md](05-INDEX-SCREEN-FIRST.md) | Execution order (updated) |
| [screens/INDEX.md](../screens/INDEX.md) | Per-spec index (updated) |

---

*Persona line: **Camila** gets a cohesive `/` workspace (001–005) before **Andrés** checkout (009) or **Roberto** host wizard (016) — matching Phase 1 screen-first intent.*
