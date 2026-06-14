# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-14 (post SAN-902 merge) · **Ground truth:** `origin/main` @ **`fbcf8d3`**  
**Last verified:** 2026-06-14 — SAN-903 @ `7674986` · SAN-902 merged [#214](https://github.com/amo-tech-ai/mdeapp/pull/214) @ `fbcf8d3` · [`12-tasks-audit.md`](./12-tasks-audit.md)  
**Verdict:** Shipped CK-V2 **working** · **not clean enough to flip flags yet**  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) (label **`V2UP`**) — **17 parent + 8 sub issues**  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump until SAN-891)  
**Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)

---

## Current verdict

| Area | Verdict |
|---|---|
| **SAN-886 · CK-V2-000 — Epic** | 🟡 ~52% — route migrations partial · hygiene open |
| **SAN-888 · CK-V2-002 — Host Analytics** | ✅ **100%** console-clean |
| **SAN-889 · CK-V2-003 — Host Event v2** | 🟡 **~85%** — functional + HITL PASS · console **not clean** |
| **SAN-900 · CK-V2-011 — File map** | ✅ **100%** — [`09-file-map.md`](./09-file-map.md) @ `4ee1bb9` |
| **SAN-890 · CK-V2-004 — /chat v2** | ⚫ Not started — await SAN-901 + approval |
| **SAN-891 · CK-V2-005 — Retire react-ui** | ⚫ Spec 98% · exec 0% · blocked SAN-890 |
| **SAN-903 · CK-V2-007a — Workspace opt-out** | ✅ **Merged** [#213](https://github.com/amo-tech-ai/mdeapp/pull/213) @ `7674986` · hypothesis partial |
| **SAN-902 · CK-V2-007b — Minimal repro** | ✅ **Merged** [#214](https://github.com/amo-tech-ai/mdeapp/pull/214) @ `fbcf8d3` |
| **Hygiene (895–898)** | 🔴 **blocks flag flip** — SAN-895 **In Progress** · 904→905 open |
| **Prod risk** | ✅ None — all v2 flags OFF |

---

## Migration dashboard (@ `fbcf8d3`)

| Metric | Value |
|---|---|
| v1 hook files | **23** |
| v2 hook files | **6** |
| react-ui files | **8** |
| Hook file v2 share | **21%** |
| Weighted program | **~52%** |

```bash
npm run audit:copilotkit-v2          # source of truth for counts
npm run graphify:update              # supporting architecture graph
npm run graphify:query -- "…"        # agent/tool path discovery
```

---

## Implementation order (canonical — copy into every PR)

| # | Issue | SPEC | Linear | Exec % | Phase |
|---:|---|---|---|---:|---|
| — | **SAN-886** | CK-V2-000 | In Progress | 52 | Epic |
| 1 | **SAN-887** | CK-V2-001 | Done | 100 | ✅ Gate spike |
| 2 | **SAN-888** | CK-V2-002 | Done | 100 | ✅ Analytics v2 |
| 3 | **SAN-889** | CK-V2-003 | Done | 85 | ✅ Event v2 · console PARTIAL |
| 4 | **SAN-892** | CK-V2-006 | Done | 100 | ✅ build-on-v2 tags |
| 5 | **SAN-900** | CK-V2-011 | **Done** | 100 | ✅ File map — blocks 901/890 only |
| **6** | **[SAN-903](https://linear.app/sanjiovani/issue/SAN-903)** | CK-V2-007a | **Done** | 100 | ✅ Merged #213 @ `7674986` |
| **6b** | **[SAN-902](https://linear.app/sanjiovani/issue/SAN-902)** | CK-V2-007b | **Done** | 100 | ✅ Merged #214 @ `fbcf8d3` |
| **7** | **[SAN-898](https://linear.app/sanjiovani/issue/SAN-898)** | CK-V2-010 | **Todo** | 0 | **NOW** hydration (908←906 · 909←908 · 907←908+909) |
| **8** | **[SAN-910](https://linear.app/sanjiovani/issue/SAN-910)** | CK-V2-012 | **In Progress** | 75 | **NOW** dep-cruiser gate on branch |
| **9** | **[SAN-896](https://linear.app/sanjiovani/issue/SAN-896)** | CK-V2-008 | **Todo** | 25 | **NOW** evidence refresh @ `fbcf8d3` |
| 10 | **[SAN-895](https://linear.app/sanjiovani/issue/SAN-895)** | CK-V2-007 | **In Progress** | 40 | After **6b** — proofs 904→905 · **903+902 alone do not close parent** |
| 11 | [SAN-902 · Minimal repro: Mastra multi-turn signature](https://linear.app/sanjiovani/issue/SAN-902/ck-v2-007b-minimal-repro-mastra-multi-turn-signature) | **Done** | 100 | Subtask of 10 — merged #214 |
| 12 | [SAN-904 · HITL approve/reject proofs green](https://linear.app/sanjiovani/issue/SAN-904/ck-v2-007c-hitl-approvereject-proofs-green) | Backlog | 0 | Subtask of 10 — **open** |
| 13 | [SAN-905 · Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream) | Backlog | 0 | Subtask of 10 — **open** |
| 14 | **[SAN-901](https://linear.app/sanjiovani/issue/SAN-901)** | CK-V2-004A | Backlog | 0 | After **5** ✅ · chat spike |
| 15 | **[SAN-890](https://linear.app/sanjiovani/issue/SAN-890)** | CK-V2-004 | Backlog | 0 | After **14** PASS + approval |
| 16 | **[SAN-891](https://linear.app/sanjiovani/issue/SAN-891)** | CK-V2-005 | Backlog | 0 | After **15** — retire react-ui last |
| 17 | **[SAN-897](https://linear.app/sanjiovani/issue/SAN-897)** | CK-V2-009 | Backlog | 0 | After **9** only |
| 18 | **[SAN-899](https://linear.app/sanjiovani/issue/SAN-899)** | CK-AI-002 | Backlog | 0 | Fallback if **6** fails |
| — | SAN-893 → SAN-894 | CK-V1-001/002 | Backlog | 15/0 | Deprioritized |

**Subtasks (898):** SAN-906–909 Backlog — run under **7**.

**Flags:** `COPILOTKIT_V2_ANALYTICS` · `COPILOTKIT_V2_HOST_EVENT` · `COPILOTKIT_V2_CHAT` — all **OFF** on prod.

---

## SAN-903 · proof @ `7674986` (merged)

| Step | Gate | Status |
|---|---|---|
| Merge | [PR #213](https://github.com/amo-tech-ai/mdeapp/pull/213) squash → `7674986` | ✅ |
| Code | `workspace: () => undefined` in `host-event.ts` | ✅ |
| Unit | `host-event-agent` 5/5 · B2a `getWorkspace()` | ✅ |
| Live turn1 | No `mastra_workspace_*` | ✅ |
| Live turn2 | No thrown `thought_signature` | ✅ |
| Live turn3 (pre-merge) | Generic stream error | 🟡 → documented in SAN-902 |
| Parent | [SAN-895](https://linear.app/sanjiovani/issue/SAN-895) | ⛔ open until 902→904→905 |

Audit: [`12-tasks-audit.md`](./12-tasks-audit.md) §PR #213 · [`11-tasks-audit.md`](./11-tasks-audit.md)

---

## SAN-900 · proof @ `7674986` (completed)

| Step | Command / artifact | Status |
|---|---|---|
| Audit dashboard | `npm run audit:copilotkit-v2` | ✅ v1 **23** · v2 **6** · react-ui **8** · **~52%** |
| Graph rebuild | `npm run graphify:update` | ✅ 73014 nodes |
| Concierge path | `graphify:query -- "conciergeAgent requestVenueBookingTool"` | ✅ 85 nodes — in [`09-file-map.md`](./09-file-map.md) §E |
| Host event path | `graphify:query -- "hostEventAgent preview_and_publish"` | ✅ 40 nodes — §D |
| Host ops path | `graphify:query -- "hostOpsAgent get_sales_insights"` | ✅ 44 nodes — §C |
| Living map | `docs/upgradeV2/09-file-map.md` | ✅ §A–K |
| Linear | [SAN-900](https://linear.app/sanjiovani/issue/SAN-900) | ✅ **Done** |
| Unblocks | SAN-901 | ✅ yes · SAN-890 | ⛔ still needs 901 + approval |

---

## 🔴 Program blockers

| ID | Issue | Severity | Status |
|---|---|---|---|
| **B0** | **[SAN-904 · CK-V2-007c](https://linear.app/sanjiovani/issue/SAN-904)** — HITL proofs | 🔴 High | **Backlog** · open |
| **B0** | **[SAN-905 · CK-V2-007d](https://linear.app/sanjiovani/issue/SAN-905)** — console gate | 🔴 High | **Backlog** · open |
| **B0** | **[SAN-895 · CK-V2-007](https://linear.app/sanjiovani/issue/SAN-895)** — console hygiene parent | 🔴 High | **In Progress** · needs 904→905 |
| **B0a** | **[SAN-898 · CK-V2-010](https://linear.app/sanjiovani/issue/SAN-898)** — hydration | 🔴 High | **Todo** · step **7** |
| **B0b** | **[SAN-896 · CK-V2-008](https://linear.app/sanjiovani/issue/SAN-896)** — evidence @ `7674986` | 🟡 Medium | **Todo** · step **9** |
| **B0c** | **[SAN-899 · CK-AI-002](https://linear.app/sanjiovani/issue/SAN-899)** — only if 903 fails | 🟡 Medium | Backlog · step **18** |
| **B0d** | SAN-893 → SAN-894 — v1 max-depth | 🟡 Medium | Deprioritized |
| **B1** | **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890)** | 🟡 Sequencing | step **15** |
| **B2** | **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891)** | 🟡 Sequencing | step **16** |

---

## Dependency chain

```text
Done: 887 → 888 → 889 → 892 → 900 → 903

NOW (parallel):
  902 (PR #214 merge) ║ 898 ║ 910 ║ 896

Then:
  895 + subtasks 902→904→905
  901 (chat spike) → 890 (/chat) → 891 (retire react-ui)

Later:
  897 (after 896 only)
  899 (only if 903 P0 fails)
  893 → 894 (deprioritized)
```

---

## Parent — SAN-886 · CK-V2-000

| Child | Order | Dot | Shipped % | Linear |
|---|---:|---|---:|---|
| SAN-887 · CK-V2-001 | 1 | 🟢 | 100 | Done |
| SAN-888 · CK-V2-002 | 2 | 🟢 | 100 | Done |
| SAN-889 · CK-V2-003 | 3 | 🟡 | 85 | Done · console PARTIAL |
| SAN-892 · CK-V2-006 | 4 | 🟢 | 100 | Done |
| SAN-900 · CK-V2-011 | 5 | 🟢 | 100 | **Done** |
| SAN-903 · CK-V2-007a | 6 | 🟡 | 100 | **PR** |
| SAN-898 · CK-V2-010 | 7 | ⚫ | 0 | **Todo** |
| SAN-910 · CK-V2-012 | 8 | 🟡 | 35 | **Todo** |
| SAN-896 · CK-V2-008 | 9 | 🟡 | 25 | **Todo** |
| SAN-895 · CK-V2-007 | 10 | ⚫ | 0 | **Todo** |
| SAN-901 · CK-V2-004A | 14 | 🟡 | 0 | Backlog · unblocked |
| SAN-890 · CK-V2-004 | 15 | ⚫ | 0 | Backlog |
| SAN-891 · CK-V2-005 | 16 | ⚫ | 0 | Backlog |
| SAN-897 · CK-V2-009 | 17 | ⚫ | 0 | Backlog |
| SAN-899 · CK-AI-002 | 18 | ⚫ | 0 | Backlog |

**Standalone:** SAN-893 · SAN-894 (deprioritized)

| **Epic complete** | 🟡 | **~52%** | weighted dashboard |

> **Persona impact on prod:** None — all v2 flags OFF.

---

## Task tracker (implementation order)

| # | Task | Dot | Spec % | Exec % | Proof | Next |
|---:|---|---|---:|---:|---|---|
| 5 | **SAN-900 · CK-V2-011** | 🟢 | 100 | 100 | [`09-file-map.md`](./09-file-map.md) | — |
| 6 | **SAN-903 · CK-V2-007a** | 🟡 | 100 | 100 | [`11-tasks-audit.md`](./11-tasks-audit.md) | PR open → SAN-902 |
| 7 | **SAN-898 · CK-V2-010** | ⚫ | 100 | 0 | [desc](./linear-descriptions/SAN-898.md) | Parallel |
| 8 | **SAN-910 · CK-V2-012** | 🟡 | 100 | 35 | audit ✅ · dep-cruiser ❌ | Parallel |
| 9 | **SAN-896 · CK-V2-008** | 🟡 | 100 | 25 | stale `mainSha` | Parallel |
| 10 | **SAN-895 · CK-V2-007** | ⚫ | 100 | 0 | [desc](./linear-descriptions/SAN-895.md) | After 903 · not Done until 902–905 |
| 14 | **SAN-901 · CK-V2-004A** | 🟡 | 100 | 0 | [desc](./linear-descriptions/SAN-901.md) | Unblocked · start spike |
| 15 | **SAN-890 · CK-V2-004** | ⚫ | 96 | 0 | [desc](./linear-descriptions/SAN-890.md) | After 901 + approval |
| 3 | **SAN-889 · CK-V2-003** | 🟡 | 98 | 85 | HITL PASS · console FAIL | 903 + 898 |

---

## Next actions (matches implementation order above)

**NOW — steps 7–9 (parallel) + SAN-903 PR merge:**
1. ~~**SAN-903**~~ — **PR open** (`Closes SAN-903` only).
2. **[SAN-898 · CK-V2-010](https://linear.app/sanjiovani/issue/SAN-898)** — hydration fix.
3. **[SAN-910 · CK-V2-012](https://linear.app/sanjiovani/issue/SAN-910)** — dep-cruiser no-new-v1 gate.
4. **[SAN-896 · CK-V2-008](https://linear.app/sanjiovani/issue/SAN-896)** — re-run proofs after merge.

**Then — steps 10–13:**
5. **[SAN-895 · CK-V2-007](https://linear.app/sanjiovani/issue/SAN-895)** — proofs SAN-902 → 904 → 905 after 903.

**Chat chain — steps 14–16:**
6. **[SAN-901 · CK-V2-004A](https://linear.app/sanjiovani/issue/SAN-901)** — vertical slice spike (**unblocked** since step 5 Done).
7. **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890)** — full `/chat` (after 901 PASS + approval).
8. **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891)** — retire react-ui (last).

**Later:**
9. **[SAN-897 · CK-V2-009](https://linear.app/sanjiovani/issue/SAN-897)** — preview analytics (after 896 only).
10. **[SAN-899 · CK-AI-002](https://linear.app/sanjiovani/issue/SAN-899)** — fallback if 903 insufficient.
11. SAN-893 → SAN-894 — deprioritized.

**Done:** SAN-900 · SAN-903 PR submitted.

**Do not:** close SAN-895 on SAN-903 merge · prod flag flip · stage unrelated files.

---

## References

- **Tasks audit:** [`11-tasks-audit.md`](./11-tasks-audit.md) · **File map:** [`09-file-map.md`](./09-file-map.md)
- **Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)
- Audits: [`05-890audit.md`](./05-890audit.md) · [`08-local-hostaudit.md`](./08-local-hostaudit.md)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
