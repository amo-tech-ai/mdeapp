# CK-V2 · Tasks audit — 11 (post SAN-902 merge @ `fbcf8d3`)

**Date:** 2026-06-14 · **Re-verified:** after PR #214 merge + Linear hygiene pass  
**Ground truth:** `origin/main` @ **`fbcf8d3`**  
**Questions:**
1. Was the **spec** (~94/100 pre-impl) correct?
2. Did **execution** meet the updated contract?
3. What is the **correct next-step order**?

---

## Verdict — first read

**Post-merge verdict:** SAN-903 + SAN-902 shipped correctly; **SAN-895 remains In Progress** until SAN-904→905 green.

| Milestone | Status @ `fbcf8d3` |
|---|---|
| SAN-903 workspace opt-out | ✅ merged #213 |
| SAN-902 3-turn repro | ✅ merged #214 |
| SAN-895 parent | 🔴 **In Progress** — not Done |
| SAN-904 / SAN-905 | ⚫ open |
| Linear relations 898 chain | ✅ wired 2026-06-14 |

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

**DONE:** [SAN-887](https://linear.app/sanjiovani/issue/SAN-887) → [SAN-888](https://linear.app/sanjiovani/issue/SAN-888) → [SAN-889](https://linear.app/sanjiovani/issue/SAN-889) → [SAN-892](https://linear.app/sanjiovani/issue/SAN-892) → [SAN-900](https://linear.app/sanjiovani/issue/SAN-900) → [SAN-903 · P0 workspace opt-out](https://linear.app/sanjiovani/issue/SAN-903/ck-v2-007a-p0-workspace-opt-out-on-hosteventagent) → [SAN-902 · Minimal repro](https://linear.app/sanjiovani/issue/SAN-902/ck-v2-007b-minimal-repro-mastra-multi-turn-signature)

**NOW (parallel):**
- [SAN-910 · Migration CI guardrails](https://linear.app/sanjiovani/issue/SAN-910/ck-v2-012-migration-ci-guardrails-audit-dashboard-no-new-v1-gate)
- [SAN-898 · Hydration mismatch](https://linear.app/sanjiovani/issue/SAN-898/ck-v2-010-fix-v2-host-event-hydration-mismatch-caret-color-transparent) ([906](https://linear.app/sanjiovani/issue/SAN-906) → [908](https://linear.app/sanjiovani/issue/SAN-908) → [909](https://linear.app/sanjiovani/issue/SAN-909) → [907](https://linear.app/sanjiovani/issue/SAN-907))
- [SAN-896 · Refresh evidence](https://linear.app/sanjiovani/issue/SAN-896/ck-v2-008-refresh-san-888-san-889-localhost-evidence-current-mainsha) @ `fbcf8d3`

**THEN — [SAN-895](https://linear.app/sanjiovani/issue/SAN-895/ck-v2-007-fix-hosteventagent-gemini-thought-signature-console-errors) closure:**
- [SAN-904 · HITL proofs](https://linear.app/sanjiovani/issue/SAN-904/ck-v2-007c-hitl-approvereject-proofs-green) → [SAN-905 · Console clean](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)

**CHAT:** [SAN-901](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl) → [SAN-890](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-full-chat-v2-migration) → [SAN-891](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)

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
