# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-14 (SAN-890 slice 2 proofs PASS · uncommitted) · **Mode:** `890 PR → 891`  
**Ground truth:** branch `ai/san-890-ck-v2-004-migrate-chat-conciergeagent-to-v2` @ **`697a8759`** + slice 2 working tree · `main` @ **`a57516de`**  
**Active:** [SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) — **~95%** · commit + PR next  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) (label **`V2UP`**) — **18 parent + 8 sub issues**  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump until SAN-891)  
**Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)

---

## Chat-only sprint (2026-06-14)

```text
✅ SAN-905 (#216) → ✅ SAN-901 (#217) → 🟢 SAN-890 slice 2 (~95%, PR pending) → ⚫ SAN-891 cleanup
```

| Step | Issue | Priority | Status | Exec % |
|---:|---|---|---|---:|
| 1 | **[SAN-905 · CK-V2-007d](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)** | P0 | ✅ Merged [#216](https://github.com/amo-tech-ai/mdeapp/pull/216) | 100 |
| 2 | **[SAN-901 · CK-V2-004A](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)** | P0 | ✅ Merged [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) @ `a57516de` | **100** |
| 3 | **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | P1 | 🟢 **~95%** — proofs PASS · commit + PR | **95** |
| 4 | **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | P2 | ⚫ Blocked SAN-890 PR | 0 |

**Parked (optional post-891):** SAN-906/898/896 · SAN-911 factory · SAN-897 · SAN-899 · SAN-893/894

**Keep passive:** SAN-900 ✅ · SAN-910 guardrails on PRs

---

## Current verdict

| Area | Verdict |
|---|---|
| **SAN-886 · CK-V2-000 — Epic** | 🟡 **~75%** — chat path proofs PASS · SAN-890 PR pending |
| **SAN-888 · CK-V2-002 — Host Analytics** | ✅ **100%** console-clean |
| **SAN-889 · CK-V2-003 — Host Event v2** | ✅ **~95%** — HITL PASS · console clean post #216 |
| **SAN-895 · CK-V2-007 — Hygiene parent** | ✅ **Done** (903→902→904→905) |
| **SAN-900 · CK-V2-011 — File map** | ✅ **100%** — [`09-file-map.md`](./09-file-map.md) |
| **SAN-901 · CK-V2-004A — Chat spike** | ✅ **100%** — merged #217 |
| **SAN-890 · CK-V2-004 — /chat v2** | 🟢 **~95%** — 12 tool renders · map pin · HITL PASS · PR next |
| **SAN-911 · CK-V2-013 — Migration factory** | 🅿️ Parked — optional post-891 |
| **SAN-891 · CK-V2-005 — Retire react-ui** | ⚫ Spec 98% · exec 0% · blocked SAN-890 |
| **Prod risk** | ✅ None — all v2 flags OFF |

---

## Migration dashboard (@ `697a8759`)

| Metric | Value |
|---|---|
| v1 hook files | **23** |
| v2 hook files | **12** (+6 vs `a57516de`) |
| react-ui files | **8** |
| Hook file v2 share | **~34%** (was 30%) |
| Route migration | analytics **100%** · event **95%** · chat **~95%** |
| **Weighted program (exec)** | **~75%** (was ~68%) |

```bash
npm run audit:copilotkit-v2          # source of truth for counts
npm run graphify:update              # supporting architecture graph
npm run graphify:query -- "…"        # agent/tool path discovery
```

---

## SAN-890 · slice 2 proof (working tree @ `697a8759` base)

| Step | Gate | Status |
|---|---|---|
| GeoChatShellV2 scaffold | `827dd684` | ✅ |
| Coagent + session providers | `697a8759` | ✅ |
| Tool renders (12) | `search-tool-renders-v2.tsx` | ✅ |
| Map pin | `focus-map-pin-action-v2.tsx` in `MapsShell` | ✅ |
| HITL proof | café booking → `venue-booking-hitl-card` | ✅ PASS |
| Flag on | rental + HITL · `consoleErrors: []` | ✅ PASS |
| Flag off | v1 shell · no regression · `consoleErrors: []` | ✅ PASS |
| PR | single SAN-890 PR | ⬜ after commit |

**Evidence:** [`docs/tasks/testing/evidence/SAN-890/RESULTS.md`](../tasks/testing/evidence/SAN-890/RESULTS.md)

---

## Implementation order (canonical — copy into every PR)

| # | Issue | SPEC | Linear | Exec % | Phase |
|---:|---|---|---|---:|---|
| — | **SAN-886** | CK-V2-000 | In Progress | **68** | Epic |
| 1 | **SAN-887** | CK-V2-001 | Done | 100 | ✅ Gate spike |
| 2 | **SAN-888** | CK-V2-002 | Done | 100 | ✅ Analytics v2 |
| 3 | **SAN-889** | CK-V2-003 | Done | 95 | ✅ Event v2 |
| 4 | **SAN-892** | CK-V2-006 | Done | 100 | ✅ build-on-v2 tags |
| 5 | **SAN-900** | CK-V2-011 | **Done** | 100 | ✅ File map |
| 6–13 | SAN-903/902/895/904/905 | CK-V2-007* | **Done** | 100 | ✅ Hygiene chain |
| 14 | **[SAN-901](https://linear.app/sanjiovani/issue/SAN-901)** | CK-V2-004A | **Done** | **100** | ✅ Merged #217 |
| 15 | **[SAN-890](https://linear.app/sanjiovani/issue/SAN-890)** | CK-V2-004 | **In Progress** | **40** | **ACTIVE** |
| 16 | **[SAN-891](https://linear.app/sanjiovani/issue/SAN-891)** | CK-V2-005 | Backlog | 0 | After **15** PR |
| 8 | **[SAN-910](https://linear.app/sanjiovani/issue/SAN-910)** | CK-V2-012 | **Done** | 100 | CI guardrails |

**Flags:** `COPILOTKIT_V2_ANALYTICS` · `COPILOTKIT_V2_HOST_EVENT` · `COPILOTKIT_V2_CHAT` — all **OFF** on prod.

---

## Program blockers (2026-06-14 sync)

| ID | Issue | Severity | Status |
|---|---|---|---|
| **B1** | **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890)** — bridge + tools + HITL | 🔴 High | **In Progress ~40%** |
| **B2** | **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891)** | 🟡 Sequencing | After 890 PR |
| — | ~~SAN-901 spike~~ | — | ✅ **Cleared** — #217 |
| — | ~~SAN-895/904/905~~ | — | ✅ **Cleared** — #216 |

---

## Dependency chain

```text
Done: 887 → 888 → 889 → 892 → 900 → 903 → 902 → 895 → 904 → 905 (#216) → 901 (#217)

NOW:
  890 (/chat) — In Progress ~40% (slice 1 scaffold on branch)

Then:
  891 (retire react-ui)

Parked:
  896 evidence · 898/906 hydration · 911 factory · 897 · 899 · 893/894
```

---

## Parent — SAN-886 · CK-V2-000

| Child | Order | Dot | Shipped % | Linear |
|---|---:|---|---:|---|
| SAN-887 · CK-V2-001 | 1 | 🟢 | 100 | Done |
| SAN-888 · CK-V2-002 | 2 | 🟢 | 100 | Done |
| SAN-889 · CK-V2-003 | 3 | 🟢 | 95 | Done |
| SAN-892 · CK-V2-006 | 4 | 🟢 | 100 | Done |
| SAN-900 · CK-V2-011 | 5 | 🟢 | 100 | Done |
| SAN-903–905 · CK-V2-007* | 6–12 | 🟢 | 100 | Done |
| SAN-901 · CK-V2-004A | 14 | 🟢 | **100** | **Done** · #217 |
| SAN-890 · CK-V2-004 | 15 | 🟡 | **40** | **In Progress** |
| SAN-891 · CK-V2-005 | 16 | ⚫ | 0 | After 890 |
| SAN-911 · CK-V2-013 | — | 🅿️ | 0 | Parked |

| **Epic complete** | 🟡 | **~68%** | weighted dashboard |

> **Persona impact on prod:** None — all v2 flags OFF.

---

## Next actions

1. **Finish [SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890)** — bridge expansion → map pin → HITL proof → one PR
2. **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891)** — cleanup last

---

## References

- **Changelog:** [`changelog.md`](./changelog.md)
- **Tasks audit:** [`11-tasks-audit.md`](./11-tasks-audit.md) · **File map:** [`09-file-map.md`](./09-file-map.md)
- **Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
