## Verdict on `25-mde-audit.md`

**Directionally correct (~88–90%).** The architecture, blockers (G1/G2/G3), smoke evidence, and “don’t call MVP ready” call are all accurate. Treat it as the **full-project forensic audit**; keep **`25a-mde-audit.md`** as the narrower visual/MCP testing audit — they complement each other, not duplicate.

---

## What’s right (trust these)

| Area | Audit claim | Disk check |
|------|-------------|------------|
| Runtime | CopilotKit → Mastra → Gemini, no `HttpAgent` | ✅ |
| Smokes | map-pins, f50-pin-sync, grounding, console, floor | ✅ (still pass) |
| SCREEN-001–005 | Code exists, **not Done** (no per-screen Playwright/screenshots) | ✅ specs `In Progress`; no `e2e/screens/` |
| G2 | Schedule modal shell, submit blocked until F47 | ✅ |
| G1/G3 | No checkout, tickets route, host wizard/HITL | ✅ |
| `hostEventAgent` | Missing | ✅ |
| P0 priority | Finish shell proof → F47/008 → events/tickets → F33–F38 | ✅ sensible |
| Overlap | F24 vs SCREEN-005, MASTRA-001 drift, MAP-007 superseded | ✅ real issues |

---

## Stale / inconsistent in the audit itself

1. **Test count** — says 97; disk is **100/100** (added processor tests).
2. **Line 262** — says “this file supersedes old `25`” but *this file is* `25-mde-audit.md`. Should read: **`25` = full forensic, `25a` = screen testing only**.
3. **SCREEN-008** — progress table says **Blocked**; correctness table says **Not Started**. Should be **Blocked** everywhere.
4. **F12** — progress table **In Progress 80%** vs correctness table **“Done partial”**. Should be **In Progress** until modal submit works.
5. **P0 order vs `23-screens-task-audit.md`** — `25` jumps to F47+008 before SCREEN-006/007/014; `23` says 001→003→004→005→**007→006→014** then 008. Both are defensible:
   - **Screen-first** (`23`, `INDEX-SCREEN-FIRST`): polish venue/event cards before G2.
   - **MVP-gate-first** (`25`): G2 lead before event commerce.
   Pick one as authoritative in `tasks/INDEX.md` — right now they disagree.
6. **Chat latency work** (dev skip `PromptInjectionDetector`, shorter post-tool prose) — not in audit; optional footnote only, doesn’t change readiness scores.

---

## Task changes you **should** make (metadata only, no rewrites)

| Task | Current | Should be | Why |
|------|---------|-----------|-----|
| **MASTRA-001** | `Not Started` | **`In Progress`** | 100 tests + smokes exist; missing evidence file only |
| **F24** | `Not Started` | **`Superseded by SCREEN-005`** or close | `RentalCard` shipped under SCREEN-005 |
| **MAP-007** | present | **Closed → MAP-007B** | Audit correctly flags duplicate |
| **SCREEN-003, 004** | `In Progress` in specs | Same in **`tasks/INDEX.md`** Phase 1 table | INDEX still lists them **Not Started** (lines 71–72) |
| **SCREEN-018** | audit: In Progress | **`Deferred (partial)`** | Matches `INDEX-SCREEN-FIRST` — mobile e2e exists, not P0 |
| **F12** | mixed | **`In Progress`** until F47 wires submit | Edge exists; UI path unproven |

**Do not change** SCREEN spec bodies, P0 scope, or mark anything **Done** until `SCREEN-TESTING-STANDARD.md` §6 + `tasks/notes/SCREEN-###-evidence.md`.

---

## Task changes you **should not** make

- Don’t reorder SCREEN specs to match `25`’s G2-first track without updating `INDEX-SCREEN-FIRST.md` and `23-screens-task-audit.md` together.
- Don’t mark F19/F49/F50 **not Done** — audit correctly keeps foundation Done while SCREEN tasks stay In Progress.
- Don’t start MAP-004, trips/saved, ADK package work — audit defer list is correct.

---

## Recommended next actions (from audit, still valid)

1. **SCREEN-001** — `e2e/screens/SCREEN-001-*.spec.ts` + MCP screenshots → first Done.
2. **Sync indexes** — fix `tasks/INDEX.md` Phase 1 table (003/004 → In Progress; align order with `INDEX-SCREEN-FIRST`).
3. **F47 + SCREEN-008** — unblocks G2 (biggest MVP gap after visual gate).
4. **Close metadata drift** — MASTRA-001, F24, MAP-007 in one small doc PR.

Want me to apply those index + task frontmatter fixes in a single pass?