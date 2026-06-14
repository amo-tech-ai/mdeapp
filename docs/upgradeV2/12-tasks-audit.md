# CK-V2 · Tasks audit — 12 (forensic board + hygiene pass)

**Date:** 2026-06-14 · **Verifier:** disk + GitHub + Linear MCP  
**Ground truth:** `origin/main` @ **`fbcf8d3`** (SAN-902 #214 on SAN-903 `7674986`)

---

## Hygiene pass verdict

**The audit was correct — actions taken 2026-06-14:**

| Step | Action | Result |
|---|---|---|
| SAN-895 reopen | Set **In Progress** + comment on DoD chain | ✅ |
| PR #214 merge | Floor green · `Closes SAN-902` only | ✅ merged → `fbcf8d3` |
| Linear relations | 908←906 · 909←908 · 907←908+909 · 898←907 | ✅ |
| Docs SHA | todo · 10 · 11 bumped to `fbcf8d3` | ✅ this pass |
| SAN-910 guardrails | dep-cruiser + no-new-v1 on branch | ✅ implemented |

**Score: 96/100 🟢** — board now honest; SAN-910 landing removes last tooling gap.

---

## PR #214 · SAN-902 post-merge

| Check | Verified |
|---|---|
| PR state | ✅ Merged → `fbcf8d3` |
| Floor CI | ✅ Success (pre-merge) |
| `Closes SAN-902` only | ✅ |
| SAN-895 parent | ✅ Still **In Progress** (correct) |
| Prod flags | ✅ No flip |
| Deliverables | ✅ `san-902-host-event-3turn-repro.ts` · `RESULTS.md` · `repro:san-902` |

---

## Board audit (full program @ `fbcf8d3`)

| Gate | Result |
|---|---|
| `npx vitest run host-event` | ✅ **18/18** |
| `npx vitest run copilotkit-v2` | ✅ **6/6** |
| `npm run build` | ✅ exit 0 |
| `npm run audit:copilotkit-v2` | ✅ v1 **23** · v2 **6** · react-ui **8** · **~52%** |
| `npm run audit:copilotkit-v2:depcruise` | ✅ (SAN-910 branch) |
| Prod v2 flags | ✅ all OFF |

---

## Scorecard — every task (updated)

| # | Task | Linear | % | Dot | Notes |
|---:|---|---|---:|---|---|
| 6 | **SAN-903 · CK-V2-007a** | Done | 100 | 🟢 | #213 @ `7674986` |
| 11 | **SAN-902 · CK-V2-007b** | **Done** | 100 | 🟢 | #214 @ `fbcf8d3` |
| 12 | **SAN-904 · CK-V2-007c** | Backlog | 0 | ⚫ | **open** |
| 13 | **SAN-905 · CK-V2-007d** | Backlog | 0 | ⚫ | **open** |
| 10 | **SAN-895 · CK-V2-007 parent** | **In Progress** | 40 | 🟡 | **not Done** — needs 904→905 |
| 8 | **SAN-910 · CK-V2-012** | In Progress (branch) | 75 | 🟡 | dep-cruiser + allowlist landed |
| 7 | **SAN-898 · CK-V2-010** | Todo | 0 | ⚫ | relations wired |

---

## Correct execution order (unchanged)

```text
DONE:        887 → 888 → 889 → 892 → 900 → 903 → 902

NOW (parallel):
  SAN-910  — ship dep-cruiser PR
  SAN-898  — 906 → 908 → 909 → 907
  SAN-896  — evidence @ fbcf8d3

HOST HYGIENE (gates host flag):
  SAN-904 → SAN-905 → then close SAN-895

CHAT (last):
  SAN-901 → SAN-890 (approval) → SAN-891
```

---

## Blockers (remaining)

| ID | Blocker | Severity | Status |
|---|---|---|---|
| **A** | SAN-904/905 HITL + console proofs | 🔴 High | Open |
| **B** | SAN-898 hydration | 🔴 High | Open |
| **C** | SAN-910 PR not merged yet | 🟡 Medium | Branch ready |

**No production blockers.** Flags OFF.

---

## What NOT to do

- ❌ Close SAN-895 until SAN-904 + SAN-905 green
- ❌ Flip `COPILOTKIT_V2_HOST_EVENT` until SAN-905 + SAN-898
- ❌ Start SAN-890
- ❌ Bundle unrelated worktree files into CK-V2 PRs

---

## Final recommendation

1. **Open PR for SAN-910** (`Closes SAN-910`) — guardrails only, no runtime.
2. **Run SAN-904/905** browser proofs with clean dev restarts (flag on/off).
3. **Parallel SAN-898** hydration chain.
4. Close **SAN-895** only when 904→905 + floor green.

---

## References

- Tracker: [`todo.md`](./todo.md) · Plan: [`10-plan-audit.md`](./10-plan-audit.md) · Prior: [`11-tasks-audit.md`](./11-tasks-audit.md)
- Linear: [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
