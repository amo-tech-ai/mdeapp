---
title: Screen Visual + Workflow Testing Audit
date: 2026-05-24
auditor: task-verifier + screen testing standard
scope: SCREEN-001–020 task specs + SCREEN-TESTING-STANDARD.md
action: audit and doc update only — no Playwright spec implementation in this pass
follows:
  - ./23-screens-task-audit.md
  - ./22-task-order-audit.md
---

# 25a — Screen visual + MCP testing audit

## Executive verdict

| Item | Status |
|------|--------|
| SCREEN tasks had unit/smoke commands only | 🟡 Fixed — Visual + MCP Testing section added to all 20 specs |
| `SCREEN-TESTING-STANDARD.md` | ✅ Created |
| Per-task Playwright specs (`e2e/screens/SCREEN-###-*.spec.ts`) | 🔴 **Not created** — planned in standard §9 |
| Chrome DevTools MCP proof per task | 🔴 **Not run** — procedures documented only |
| SCREEN-001–005 marked Done prematurely | 🟡 **Reverted to In Progress** — code on disk; visual/workflow gate incomplete |

**Rule:** `status: Done` requires §6 of [`SCREEN-TESTING-STANDARD.md`](../screens/SCREEN-TESTING-STANDARD.md) + `tasks/notes/SCREEN-###-evidence.md` with screenshots + Playwright pass.

---

## Gap analysis (before this audit)

| Gap | Severity | Fix |
|-----|----------|-----|
| No shared visual testing standard | 🔴 | `SCREEN-TESTING-STANDARD.md` |
| Tests sections used literal `\n` bullets | 🟡 | Normalized in each spec |
| Done without per-task screenshots | 🔴 | 001–005 → In Progress |
| No `data-testid` on schedule modal only | 🟢 | `schedule-viewing-modal` exists |
| Venue sheet, event card, host wizard testids | 🔴 | Specs require testids at implement time |
| Mobile-only checks deferred to SCREEN-018 | 🟡 | Each task still requires mobile pass in Done gate |

---

## Existing test assets (verified on disk)

| Asset | Covers |
|-------|--------|
| `npm run verify:console` | `/` load + rental turn, console |
| `npm run smoke:map-pins` | CopilotChat + rental cards + pins |
| `npm run smoke:f50-pin-sync` | Card ↔ pin (SCREEN-005) |
| `e2e/maps-layout-desktop.spec.ts` | 3-panel layout (SCREEN-001 partial) |
| `e2e/maps-layout-mobile.spec.ts` | Mobile map sheet (SCREEN-018 partial) |
| `e2e/maps-grounding.spec.ts` | ADK attribution (SCREEN-010 partial) |

---

## Per-task testing readiness

| Task | Code on disk | Visual spec added | Playwright spec | Ready for Done? |
|------|--------------|-------------------|-----------------|-----------------|
| SCREEN-001 | partial | ✅ | extends desktop layout | **No** — need dedicated spec + screenshots |
| SCREEN-002 | stub | ✅ | not created | No |
| SCREEN-003 | partial | ✅ | not created | No |
| SCREEN-004 | partial | ✅ | not created | No |
| SCREEN-005 | partial | ✅ | pin sync only | No |
| SCREEN-006–020 | missing/partial | ✅ | not created | No |

---

## Required next actions (implementation track)

1. Add `mdeapp/e2e/screens/` directory with SCREEN-001 spec first (extend helpers).
2. Run Chrome DevTools MCP session per SCREEN-001 evidence template.
3. Capture `tmp/screenshots/SCREEN-001/{desktop,mobile}.png`.
4. Flip SCREEN-001 → Done only after evidence file complete.
5. Repeat in INDEX-SCREEN-FIRST order.

---

## Cross-links

| Doc | Path |
|-----|------|
| Testing standard | [`screens/SCREEN-TESTING-STANDARD.md`](../screens/SCREEN-TESTING-STANDARD.md) |
| Screen order | [`INDEX-SCREEN-FIRST.md`](05-INDEX-SCREEN-FIRST.md) |
| Screen specs | [`screens/INDEX.md`](../screens/INDEX.md) |

*Persona: **Lucía** (QA) owns Playwright + MCP proof before **Camila** sees any SCREEN task marked Done.*
