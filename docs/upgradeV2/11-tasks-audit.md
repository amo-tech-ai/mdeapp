# CK-V2 · Tasks audit — 11 (SAN-903 spec + execution)

**Date:** 2026-06-13 · **Re-verified:** post-implementation (local, uncommitted)  
**Ground truth:** base `4ee1bb9` + SAN-903 diff on disk  
**Questions:**
1. Was the **spec** (~94/100 pre-impl) correct?
2. Did **execution** meet the updated contract?
3. What is the **correct next-step order**?

---

## Verdict — first read

**Spec audit: 94/100 — was correct; no spec rollback needed.**  
**Execution audit: ~88/100 — SAN-903 ready for PR (`Closes SAN-903` only); does NOT close SAN-895.**

**Hypothesis status:** **Partially confirmed** — turn 1 has zero workspace tools; turn 2 completes without `thought_signature`; turn 3 hit a generic `AGENT_STREAM_ERROR` (document in SAN-902, not a SAN-903 blocker).

| Layer | Score | Dot |
|---|---:|---|
| Spec scope / sequencing / blast radius | **98** | 🟢 |
| Spec root-cause certainty (hypothesis framing) | **94** | 🟢 |
| Execution — code change | **100** | 🟢 |
| Execution — unit + build gates | **100** | 🟢 |
| Execution — live multi-turn | **75** | 🟡 turn3 flake |
| **Overall SAN-903** | **~88** | 🟢 ship PR |

---

## Part A — Spec review (pre-implementation) ✅ still valid

| Area | Score | Notes |
|---|---:|---|
| Scope | 100 | One line on `hostEventAgent` only |
| Sequencing | 100 | 903 → 895 proofs → 901 → 890 → 891 |
| Acceptance criteria | 95 | Strengthened B2/B2a before coding |
| Blast radius | 100 | Global workspace + concierge protected |
| Root-cause certainty | 75→94 | **Primary hypothesis** wording — correct |

**Recommendation stands:** **GO** — smallest change · highest ROI · lowest risk.

**Canonical contract:** [`linear-descriptions/SAN-903.md`](./linear-descriptions/SAN-903.md)

---

## Part B — Execution verification (disk @ local diff)

### B1. Code

| Check | Expected | Disk |
|---|---|---|
| `workspace: () => undefined` | `host-event.ts` only | ✅ L11 |
| Global `workspace` in `mastra/index.ts` | unchanged | ✅ L42 |
| `conciergeAgent` | no opt-out | ✅ |

### B2. Unit tests (efficient collateral gate)

| Test | Gate | Result |
|---|---|---|
| `SAN-903 · opts out` | `getWorkspace()` undefined · no workspace tool ids | ✅ |
| `SAN-903 B2a` | `mastra.getWorkspace()` + `conciergeAgent.getWorkspace()` defined | ✅ |
| `npm test -- --run host-event-agent` | 5/5 | ✅ |
| `npm run build` | exit 0 | ✅ |

**Audit correction:** B2a should use **`getWorkspace()`**, not `listTools()` workspace name grep — `listTools()` returns 0 workspace ids for both agents in isolation. Vitest path is **more reliable** and faster than live Gemini. Spec updated in `SAN-903.md`.

### B3. Live repro (`infisical` + `npx tsx`)

| Turn | Gate | Result |
|---|---|---|
| 1 | No `mastra_workspace_*` in `toolCalls` | ✅ `[]` |
| 2 | No `thought_signature` | ✅ `turn2 ok true` |
| 3 | No `thought_signature` | 🟡 `AGENT_STREAM_ERROR` (generic, no signature payload) |

**Interpretation:** Hypothesis **strengthened** for turns 1–2 (the original failure mode). Turn 3 flake is **SAN-902** scope — document + optional retry, not a reason to revert SAN-903.

---

## Part C — What the audit got wrong / improved

| Item | Pre-impl audit | Correction |
|---|---|---|
| B2a proof method | "concierge still has workspace tools" via `listTools` | Use **`getWorkspace()`** in Vitest |
| Live repro runner | `node --input-type=module` | **`npx tsx`** (TS path aliases) |
| SAN-903 Done vs SAN-895 | Spec said don't close 895 | **Still correct** — parent needs 902–905 |
| Hypothesis → proven | N/A at spec time | **Partially confirmed** turns 1–2 only |

---

## Part D — Do not (unchanged)

- Mark **SAN-895** Done when SAN-903 merges
- Flip `COPILOTKIT_V2_HOST_EVENT` until **SAN-905** + **SAN-898**
- Disable global workspace
- Bundle unrelated worktree files into SAN-903 PR

---

## Part E — Next steps (correct implementation order)

```text
NOW — ship SAN-903 (scoped PR only):
  src/mastra/agents/host-event.ts
  src/__tests__/host-event-agent.test.ts
  docs/upgradeV2/changelog.md · todo.md · 11-tasks-audit.md · linear-descriptions/SAN-903.md
  PR: Closes SAN-903  (NOT SAN-895)

THEN — parallel band (steps 7–9 + 10 start):
  SAN-902  — commit repro script + document turn3 flake + before/after evidence
  SAN-898  — hydration caret-color (parallel)
  SAN-910  — dependency-cruiser guardrails (parallel)
  SAN-896  — evidence refresh @ new SHA (parallel)

THEN — SAN-895 closure chain:
  SAN-902 → SAN-904 → SAN-905  (parent Done only when 905 green)

CHAT (after hygiene trending green):
  SAN-901  — chat vertical slice (unblocked since SAN-900 Done; cleaner after 903 helps)
  SAN-890  — full /chat (after 901 PASS + explicit approval)
  SAN-891  — retire react-ui (last)

LATER:
  SAN-897  — preview analytics (after 896 only)
  SAN-899  — fallback if 903 hypothesis insufficient (unlikely after turn1–2 pass)
```

| Step | Issue | Ready? |
|---:|---|---|
| **PR** | SAN-903 | ✅ yes — scope 2 src files + upgradeV2 docs |
| 1 | SAN-902 | After 903 merge — repro script + turn3 note |
| 2–4 | SAN-898 · SAN-910 · SAN-896 | Parallel anytime |
| 5 | SAN-901 | Unblocked · best after 903 lands on main |
| 6 | SAN-890 | After 901 + approval |

---

## Part F — PR guidance (SAN-903)

**Commit + open?** **Yes** — if the PR includes **only** SAN-903 scope (see Part E file list). Worktree has many unrelated dirty/untracked files — **do not** stage them.

**Suggested title:** `fix(mastra): SAN-903 · opt hostEventAgent out of global workspace`

**Suggested body bullets:**
- Hypothesis test: `workspace: () => undefined` on `hostEventAgent`
- Vitest: opt-out + concierge collateral via `getWorkspace()`
- Live: turn1 no workspace tools · turn2 no `thought_signature`
- Does **not** close SAN-895 · does **not** flip flags

---

## References

- Contract: [`linear-descriptions/SAN-903.md`](./linear-descriptions/SAN-903.md)
- Tracker: [`todo.md`](./todo.md)
- Host audit §7: [`08-local-hostaudit.md`](./08-local-hostaudit.md)
- File map: [`09-file-map.md`](./09-file-map.md)
