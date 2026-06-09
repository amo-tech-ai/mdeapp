---
id: F10
title: Document legacy hard-freeze date + `docs/ARCHITECTURE.md`
status: Done
completed_at: 2026-05-20
priority: P1
phase: W2 — Day 4
effort: 2h (freeze announcement + ARCHITECTURE.md scaffold)
owner: claude
depends_on: [F06]
skill: [mde-task-lifecycle, mermaid-diagrams]
evidence: /home/sk/mdeai/tasks/notes/F10-evidence.md
verified_against:
  - /home/sk/mdeai/plan/prd/01-foundation.md §1 Executive summary (legacy frozen end of W1)
  - /home/sk/mdeai/plan/prd/08-delivery.md §51 W2 task 10
  - /home/sk/mdeai/CLAUDE.md project status table
  - /home/sk/mdeai/plan/audit/05-copilotkit-mastra-setup-checklist.md (current verified arch)
---

# F10 — Document legacy hard-freeze date + `docs/ARCHITECTURE.md`

## 1. Purpose

Per PRD §1, legacy `/home/sk/mde/` "Hard-freeze at end of W1; only P0 security fixes." F10 makes that contract explicit and authoritative. Plus writes `mdeapp/docs/ARCHITECTURE.md` — the single doc a new contributor (or a future-Claude session) reads to understand the data flow without diving into PRD chunks. Crisp, diagram-driven, ≤ 3 pages.

## 2. Goals

- **Legacy freeze announcement** at `/home/sk/mde/FREEZE.md` — explicit date, scope ("only P0 security fixes allowed"), what counts as P0, contact path
- **CLAUDE.md update** at workspace root — append "Legacy freeze: 2026-05-26" + link to FREEZE.md
- **`mdeapp/docs/ARCHITECTURE.md`** with:
  - 1-paragraph TL;DR
  - 1 Mermaid architecture diagram (verified vs current setup)
  - Data-flow table (request → response per surface)
  - 3 invariants (PRD §18 RUNTIME-008, hard rules, CLAUDE.md Gemini-only)
  - Pointers to PRD chunks for depth
  - "Where do I add X?" decision matrix (new agent, new tool, new page, new edge fn)
- `docs/ARCHITECTURE.md` < 200 lines (anti-bloat per karpathy guidelines)
- Both committed to mdeapp git history

## 3. Features (what the user gets)

- **Sofía (dev):** clear "legacy is closed" signal — no more "should I add this here or there?" friction
- **Lucía (QA):** authoritative "what's the architecture today?" reference, not stale PRD chunks
- **Future Claude session:** reads `ARCHITECTURE.md` first → has enough context in 5 min to start any F-task

## 4. Workflows

1. **Pre-flight (per `mde-task-lifecycle` skill):**
   - Confirm legacy freeze date with user (default: end of W1 = 2026-05-26 Sunday)
   - Re-read `plan/audit/05-copilotkit-mastra-setup-checklist.md` §A (Two integration patterns)
   - Re-read `plan/05-path-a-mastra-migration.md` §3 (Architecture)

2. **Write `/home/sk/mde/FREEZE.md`** with:
   - Effective date: 2026-05-26
   - Scope: "Only P0 security fixes allowed past this date"
   - What counts as P0: (a) live data exposure, (b) auth bypass, (c) payment failure, (d) Sentry P0
   - What does NOT count as P0: features, refactors, dependency bumps (security-critical excepted)
   - All non-P0 work happens at `/home/sk/mdeai/`
   - Hook reference: `.claude/hooks/guard-sensitive-paths.mjs` already blocks edits

   ⚠️ Important: this file lives at `/home/sk/mde/FREEZE.md` — **edits to legacy are blocked by `guard-sensitive-paths.mjs`** so use `MDEAI_ALLOW_LEGACY_EDIT=1` for this one file or carve out a path-specific allowance.

3. **Append to `/home/sk/mdeai/CLAUDE.md`** at the bottom (committed):
   ```md
   ## Legacy app freeze (2026-05-26)
   See [FREEZE.md](../mde/FREEZE.md). After this date, only P0 security fixes to `/home/sk/mde/`. All new work in this repo (`/home/sk/mdeai/mdeapp/`).
   ```

4. **Write `mdeapp/docs/ARCHITECTURE.md`** following `mermaid-diagrams` skill cadence:
   - Section 1: One-paragraph TL;DR
   - Section 2: System diagram (Mermaid `flowchart LR`) — Browser → Next.js → Mastra → Supabase + Gemini + Maps
   - Section 3: Data flow per surface (table: route → agent → tools → tables)
   - Section 4: Invariants (3 hard rules + PRD §18 RUNTIME-008 single setPins)
   - Section 5: Where to add X (decision matrix: new agent → `src/mastra/agents/`; new tool → `src/mastra/tools/`; new edge fn → `mdeapp/supabase/functions/`)
   - Section 6: Test contract (`npm run floor` is the gate)
   - Section 7: Pointers (`plan/prd.md`, `tasks/INDEX.md`, `CLAUDE.md`)

5. **Update `mdeapp/README.md`** to link to `docs/ARCHITECTURE.md` in the "Architecture" section.

6. **Commit both files** with a single commit: `docs: legacy freeze announcement + mdeapp architecture overview (F10)`.

## 5. User journeys

- **Sofía:** before committing a refactor, reads `ARCHITECTURE.md` "Where do I add X?" matrix → routes to correct directory
- **Lucía:** after F10, has a single source of truth for what's deployed vs what's planned
- **Future Claude:** session-start hook prints `tasks/INDEX.md`; if confused on architecture, reads `mdeapp/docs/ARCHITECTURE.md`

## 6. Agents

None — pure documentation.

## 7. Integrations

| Integration | Purpose |
|---|---|
| Mermaid (in markdown) | Architecture diagram |
| PRD chunks (`plan/prd/00..10`) | Source for depth (linked, not duplicated) |

## 8. Summary

Document the legacy hard-freeze + write a 200-line `ARCHITECTURE.md` for mdeapp. It helps new contributors (and future-Claude sessions) understand the system in 5 minutes. We'll know it worked when (a) `FREEZE.md` exists at `/home/sk/mde/`, (b) `mdeapp/docs/ARCHITECTURE.md` exists with 1 Mermaid diagram + 1 invariants table + 1 decision matrix, (c) `mdeapp/README.md` links to it.

## 9. Definition of Done

- [ ] `/home/sk/mde/FREEZE.md` exists with effective date `2026-05-26` + P0 scope definition
- [ ] `/home/sk/mdeai/CLAUDE.md` appended with freeze reference
- [ ] `/home/sk/mdeai/mdeapp/docs/ARCHITECTURE.md` exists with 7 sections, < 200 lines
- [ ] At least 1 Mermaid diagram in `ARCHITECTURE.md`
- [ ] `mdeapp/README.md` links to `docs/ARCHITECTURE.md`
- [ ] Commit lands (single commit, both files)
- [ ] No `MDEAI_ALLOW_LEGACY_EDIT` env var remains active in shell history

## 10. Tests

### Acceptance tests (automated)

| # | Test | Command | Expected |
|---|---|---|---|
| T1 | FREEZE.md exists | `test -f /home/sk/mde/FREEZE.md && echo OK` | `OK` |
| T2 | FREEZE.md has effective date | `grep -q '2026-05-26' /home/sk/mde/FREEZE.md && echo OK` | `OK` |
| T3 | FREEZE.md defines P0 scope | `grep -qi 'P0\|security' /home/sk/mde/FREEZE.md && echo OK` | `OK` |
| T4 | CLAUDE.md updated | `grep -q 'Legacy app freeze' /home/sk/mdeai/CLAUDE.md && echo OK` | `OK` |
| T5 | ARCHITECTURE.md exists | `test -f /home/sk/mdeai/mdeapp/docs/ARCHITECTURE.md && echo OK` | `OK` |
| T6 | ARCHITECTURE.md < 200 lines | `wc -l < /home/sk/mdeai/mdeapp/docs/ARCHITECTURE.md` | `< 200` |
| T7 | ARCHITECTURE.md has Mermaid | `grep -q '\`\`\`mermaid' /home/sk/mdeai/mdeapp/docs/ARCHITECTURE.md && echo OK` | `OK` |
| T8 | README links to ARCHITECTURE | `grep -q 'ARCHITECTURE' /home/sk/mdeai/mdeapp/README.md && echo OK` | `OK` |

### Manual review

| # | Test | How |
|---|---|---|
| Tm1 | Architecture diagram renders | Open `mdeapp/docs/ARCHITECTURE.md` in any Markdown viewer with Mermaid support (or `mcp__b357a9fa__validate_and_render_mermaid_diagram`) |
| Tm2 | "Where do I add X?" matrix is comprehensive | Read through it; verify it covers: new agent, new tool, new workflow, new page, new edge fn, new test, new env var |
| Tm3 | Pointers in §7 link to existing paths | Click through; verify no 404s |

### Evidence to capture in `tasks/notes/F10-evidence.md`

- FREEZE.md content (full quote)
- ARCHITECTURE.md word count / line count
- Diff of CLAUDE.md (appended section)
- Diff of README.md (linked section)
- Screenshot of Mermaid rendered (via Mermaid validator or GitHub preview)

## Notes / verification

- **Per `mde-task-lifecycle` skill:** Phase 4 (test) ships ≥ 1 verifiable artifact. T1-T8 are that artifact.
- **Per `mermaid-diagrams` skill:** Architecture diagrams use `flowchart LR` for system overview, `sequenceDiagram` for request lifecycles.
- **Per CLAUDE.md "Hard rules":** legacy is read-only reference after this freeze — but FREEZE.md itself is a one-time addition during W1 (the freeze edit). Use `MDEAI_ALLOW_LEGACY_EDIT=1` bypass once + document the exception in evidence.
- **PRD link strategy:** `ARCHITECTURE.md` should LINK to `plan/prd/03-architecture.md` for full depth, not duplicate. The PRD is authoritative; `ARCHITECTURE.md` is the 5-min onboarding.
- **Defer:** ADR-style architecture decision records (Phase 2). For now, the audit docs (`plan/audit/01..05`) serve as ADRs.
