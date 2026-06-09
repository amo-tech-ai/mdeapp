---
task_id: PR-15
title: Verify smoke-adk-grounding.mjs isn't a Phase-2 leak
phase: MEDIUM
priority: P2
status: Not Started
area: process
skill: mde-task-lifecycle
source: docs/01-33pr-notes.md
depends_on: []
linear_issue: SAN-444
related_ux: ../ux/UX-018-adk-grounding-url-vercel.md
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
description: Confirm scripts/smoke-adk-grounding.mjs is not premature Phase-2 ADK work leaking into Phase 1; quarantine or document.
---

## Summary

| Field | Value |
|-------|-------|
| Finding | `scripts/smoke-adk-grounding.mjs` spotted in the hotfix working tree |
| Concern | **ADK is Phase-2 only** (CLAUDE.md: `adk-docs-mcp` disabled, `services/adk-grounding/` is Phase-2). A Phase-1 ADK smoke script would be scope leak |
| Resolution | Determine: dead/experimental scratch (remove) · misplaced Phase-2 artifact (quarantine) · or actually Phase-1-relevant (document why) |
| Linear | **SAN-444 (UX-018, Backlog) corroborates the suspicion** — it's the Phase-2 task to *"Set `ADK_GROUNDING_URL` on Vercel"*, noting the URL currently defaults to `http://localhost:8000` → "instant fail → fallback", "No ADK service implementation in this task." So ADK is **confirmed not-yet-deployed / Phase-2**. PR-15 (the leak *audit*) is net-new; SAN-444 is the eventual *enablement*. |

## Problem

CLAUDE.md scopes all ADK (Agent Development Kit) grounding to **Phase 2** — the MCP is disabled and `services/adk-grounding/` doesn't ship in Phase 1. A stray `smoke-adk-grounding.mjs` in the Phase-1 working tree is either (a) premature Phase-2 work that shouldn't be here, (b) abandoned scratch, or (c) something mislabeled. Classify it; it must not silently become part of a Phase-1 PR.

## Change (wiring)

| Layer | Action |
|-------|--------|
| Inspect | Read `scripts/smoke-adk-grounding.mjs` — does it import/call ADK, hit `services/adk-grounding/`, or use the disabled MCP? |
| Cross-ref | Check CLAUDE.md ("`adk-docs-mcp` is disabled — Phase 2 `services/adk-grounding/` only") + git log for when/why it appeared |
| Decide | **Phase-2 artifact** → move to a Phase-2 holding area / exclude from any Phase-1 PR · **dead scratch** → remove · **Phase-1-relevant** → document the justification |

## Skill to use

- **`mde-task-lifecycle`** — phase-scope adjudication (is this Phase-1 in-scope?); records the decision the way scope calls get recorded.

## Gates / Acceptance

- [ ] The script's actual dependencies enumerated (does it touch ADK / `services/adk-grounding/` / the disabled MCP?).
- [ ] A written verdict: **Phase-2 leak** (quarantine/exclude) · **dead** (remove) · **Phase-1-OK** (documented why).
- [ ] If Phase-2: it is **excluded from every Phase-1 PR** (especially the PR-13 splits) — not committed to `main`.
- [ ] No Phase-1 CI wiring references it.

## Testing & proof

### Persona / journey

Phase-scope guard — **Sofía** ensures Phase-1 CI/agents do not hit undeployed ADK (`ADK_GROUNDING_URL` defaults localhost per SAN-444).

### Pre-ship

```bash
cd mdeapp
test -f scripts/smoke-adk-grounding.mjs && head -40 scripts/smoke-adk-grounding.mjs
rg -l "adk-grounding|ADK_GROUNDING" scripts/ .github/ src/ mdeapp/
grep -r smoke-adk-grounding package.json .github/workflows/ || echo "not wired in CI"
npm run floor   # must stay green without ADK script in CI
```

**Pass criteria:** written verdict (Phase-2 leak / dead / Phase-1-OK); script excluded from all Phase-1 PRs; not in `npm run floor` or CI workflows.

**Evidence artifact:** `tasks/testing/evidence/PR-15-adk-smoke-verdict.md` — dependency list + verdict + SAN-444 cross-ref.

## Risks / Notes

- **Authority for "ADK = Phase 2": SAN-444 (UX-018).** It documents that prod has no `ADK_GROUNDING_URL` yet (defaults to localhost, fails over to fallback). That confirms a Phase-1 ADK *smoke script* has nothing live to hit — strong signal it's a leak/scratch, not Phase-1-relevant.
- This intersects **PR-13** — if the script is in the uncommitted pile, the classification must happen before PR-13 extracts anything.
- Don't *delete* without confirming it isn't the user's in-progress Phase-2 prototype — quarantine beats discard when unsure (inspect-before-delete).
- Persona: scope discipline protects **Sofía** (dev) — Phase-1 stays lean; Phase-2 ADK lands when its services/MCP are actually enabled.
