# Audit verdict: `audit-1.md` + skills

## Is `audit-1.md` correct?

**Yes — ~92% plan correctness holds.** Re-checked against disk, GitHub, and skills.

| Check | Result |
|--------|--------|
| Split A→B→close #14 | Correct |
| `8fa5f10` = 8 runtime files | Correct |
| Skip `b8d9f92` / `991db97` | Correct |
| B1 attribution in `76abde1` | Correct (`placeUri` ↔ `mapsUrl`) |
| Floor **313/313** | Correct (not 312) |
| No CI | Correct — **split does not fix this** |
| `restore-wip` “hardcoded path” | **Wrong reason** — paths are relative; exclude rationale still valid (C1) |
| Branch HEAD `8c99ded` | **Minor drift** — **remote** is `8fa5f10`; `8c99ded` only if local merge unpushed (C7) |
| E2E green | **Still false** — 5/5 chromium failed (`grounded-card` timeout) |

---

## CopilotKit skills vs PR #14

**PR A (`8fa5f10`) — ~88% compliant** with `copilotkit-integrations` / mastra.md (Phase 1 v1.55.2):

- Pattern 1 in-process, same-origin runtime, `useSingleEndpoint`, catch-all GET+POST
- Stable `useCopilotAction` disabled renders (fixes POST storm)
- Ref-stable `focus-map-pin-action`

**Do not use `copilotkit-develop` for review** — it documents **v2** APIs; mdeapp uses v1 (`useCoAgent`, `useCopilotAction` per mastra.md).

**PR #14 combined — ~55%** — mixed scope + host nested `<CopilotKit>` (out of split, still on `main`).

Full matrix: [`tasks/commit/may29/SKILLS-COMPLIANCE-AUDIT.md`](tasks/commit/may29/SKILLS-COMPLIANCE-AUDIT.md)

---

## Blockers (unchanged)

| P0 | Item |
|----|------|
| | `mergeable: CONFLICTING` |
| | No GitHub Actions floor |
| | Do not merge #14 as-is |

| P1 | Item |
|----|------|
| | PR B: Playwright café e2e red (agent/grounding/env) |
| | Preview 401 = protection, not failed build |

---

## Task doc updates (done)

| File | Change |
|------|--------|
| [`INDEX.md`](tasks/commit/may29/INDEX.md) | + skills audit link, remote HEAD note |
| [`SKILLS-COMPLIANCE-AUDIT.md`](tasks/commit/may29/SKILLS-COMPLIANCE-AUDIT.md) | **New** |
| [`PR-14-SPLIT-FORENSIC-AUDIT.md`](tasks/commit/may29/PR-14-SPLIT-FORENSIC-AUDIT.md) | B-02/03/04, restore-wip rationale |
| [`PR-A/B` tasks + runbooks](tasks/commit/may29/) | 313 tests, CI row, fresh dev boot, PR-B ordering on `search-tool-renders` |
| [`audit-1.md`](tasks/commit/may29/audit-1.md) | Remote HEAD note (C7) |

---

## Scores (forensic)

| Object | % correct |
|--------|----------:|
| Split plan (`may29/`) | **92%** |
| `audit-1.md` accuracy | **92%** |
| PR A vs skills | **88%** |
| PR B vs skills | **72%** (e2e) |
| PR #14 merge-as-is | **38%** |

---

## Best practice (strict)

```text
1. Add floor CI (with PR A)
2. Merge PR A: cherry-pick 8fa5f10 only
3. Rebase PR B on main; e2e green
4. Close #14
5. Host route-group split (copilotkit + UX-02) — not in #14
```

**No code changes** in this pass — planning/docs only. Next execution step: open PR A per [`PR-A-RUNBOOK.md`](tasks/commit/may29/PR-A-RUNBOOK.md).