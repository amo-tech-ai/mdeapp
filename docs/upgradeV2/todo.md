# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-14 (SAN-890 merged · SAN-891 [PR #219](https://github.com/amo-tech-ai/mdeapp/pull/219) In Review) · **Mode:** `891 merge → optional post-cutover`  
**Ground truth:** branch `ai/san-891-ck-v2-005-retire-copilotkitreact-ui` @ **`871d751e`** · `main` @ **`078a677c`** (after [SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890) [#218](https://github.com/amo-tech-ai/mdeapp/pull/218))  
**Active:** [SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) — **~98% exec** · [PR #219](https://github.com/amo-tech-ai/mdeapp/pull/219) open  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) (label **`V2UP`**) — **18 parent + 8 sub issues**  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump in 891)  
**Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)

---

## Chat-only sprint (2026-06-14)

```text
✅ SAN-905 (#216) → ✅ SAN-901 (#217) → ✅ SAN-890 (#218) → 🟡 SAN-891 (#219 In Review)
```

| Step | Issue | Priority | Status | Exec % |
|---:|---|---|---|---:|
| 1 | **[SAN-905 · CK-V2-007d](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)** | P0 | ✅ Merged [#216](https://github.com/amo-tech-ai/mdeapp/pull/216) | 100 |
| 2 | **[SAN-901 · CK-V2-004A](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)** | P0 | ✅ Merged [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) @ `a57516de` | **100** |
| 3 | **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | P1 | ✅ **Done** · merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` | **100** |
| 4 | **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | P2 | 🟡 **In Review** [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) · grep-zero · browser proof PASS | **98** |

**Parked (optional post-891):** SAN-906/898/896 · SAN-911 factory · SAN-897 · SAN-899 · SAN-893/894

**Keep passive:** SAN-900 ✅ · SAN-910 guardrails on PRs

---

## Current verdict

| Area | Verdict |
|---|---|
| **SAN-886 · CK-V2-000 — Epic** | 🟡 **~95% exec** on 891 branch — v2-only frontend coded · **891 PR #219** · prod deploy still pending merge |
| **SAN-888 · CK-V2-002 — Host Analytics** | ✅ **100%** — canonical v2 after 891 |
| **SAN-889 · CK-V2-003 — Host Event v2** | ✅ **~95%** — canonical v2 after 891 |
| **SAN-895 · CK-V2-007 — Hygiene parent** | ✅ **Done** (903→902→904→905) |
| **SAN-900 · CK-V2-011 — File map** | 🟡 **~90%** — refresh after #219 merge ([`09-file-map.md`](./09-file-map.md)) |
| **SAN-901 · CK-V2-004A — Chat spike** | ✅ **100%** — merged #217 |
| **SAN-890 · CK-V2-004 — /chat v2** | ✅ **100%** — merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` |
| **SAN-891 · CK-V2-005 — Retire react-ui** | 🟡 **~98%** — [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) In Review · static + browser proof PASS |
| **SAN-911 · CK-V2-013 — Migration factory** | 🅿️ Parked — optional post-891 |
| **Prod risk** | ✅ None until merge — `main` still flag-gated v1 fallback for chat; **891 branch** removes flags + `react-ui` |

---

## Migration dashboard (@ `871d751e` + `npm run audit:copilotkit-v2`)

| Metric | Value @ 891 branch | Value @ `main` (`078a677c`) |
|---|---|---|
| v1 hook files | **0** | **~24** |
| v2 hook files | **16** | **~12** |
| react-ui files | **0** | **8** |
| Hook file v2 share | **100%** | **~33%** |
| `COPILOTKIT_V2_*` in `src/` | **0** (removed) | flag modules + route branches |
| Route migration (code) | analytics **100%** · event **95%** · chat **100%** | all three behind per-route flags |
| **Weighted program (exec)** | **~95%** — frontend cutover done on branch | **~78%** |
| **Prod / user-visible v2** | **0%** until #219 merges + deploys | **0%** — flags OFF @ mdeai.co |

```bash
npm run audit:copilotkit-v2          # source of truth for counts
npm run graphify:update              # supporting architecture graph
npm run graphify:query -- "…"        # agent/tool path discovery
```

---

## SAN-891 · cutover proof (@ `871d751e`)

| Step | Gate | Status |
|---|---|---|
| Baseline | `078a677c` + tag `pre-san-891-cutover` | ✅ |
| Drop `@copilotkit/react-ui` | package.json / lockfile | ✅ |
| Promote v2 → canonical names | chat + host clusters | ✅ |
| Delete v1 twins + flag modules | 6 pairs + 3 `COPILOTKIT_V2_*` | ✅ |
| grep-zero | react-ui · v1 imports · flags | ✅ |
| `npm run audit:copilotkit-v2` | PASS | ✅ |
| `npm run build` | PASS | ✅ |
| Focused vitest | cafe-detail-panel · copilotkit **10/10** | ✅ |
| Browser localhost | `/chat` · `/host/event/new` · `/host/analytics` | ✅ PASS @ `2026-06-14T11:23:14Z` |
| `npm run floor` | local OOM (worktree lint scan) | 🟡 CI is source of truth |
| PR | [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) In Review | 🟡 |

**Evidence:** [`docs/tasks/testing/evidence/SAN-891/SAN-891-RESULTS.md`](../tasks/testing/evidence/SAN-891/SAN-891-RESULTS.md)

---

## Implementation order (canonical — copy into every PR)

| # | Issue | SPEC | Linear | Exec % | Phase |
|---:|---|---|---|---:|---|
| — | **SAN-886** | CK-V2-000 | In Progress | **95** | Epic |
| 1 | **SAN-887** | CK-V2-001 | Done | 100 | ✅ Gate spike |
| 2 | **SAN-888** | CK-V2-002 | Done | 100 | ✅ Analytics v2 |
| 3 | **SAN-889** | CK-V2-003 | Done | 95 | ✅ Event v2 |
| 4 | **SAN-892** | CK-V2-006 | Done | 100 | ✅ build-on-v2 tags |
| 5 | **SAN-900** | CK-V2-011 | **Done** | 100 | ✅ File map (refresh post-891) |
| 6–13 | SAN-903/902/895/904/905 | CK-V2-007* | **Done** | 100 | ✅ Hygiene chain |
| 14 | **[SAN-901](https://linear.app/sanjiovani/issue/SAN-901)** | CK-V2-004A | **Done** | **100** | ✅ Merged #217 |
| 15 | **[SAN-890](https://linear.app/sanjiovani/issue/SAN-890)** | CK-V2-004 | **Done** | **100** | ✅ Merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) |
| 16 | **[SAN-891](https://linear.app/sanjiovani/issue/SAN-891)** | CK-V2-005 | **In Review** | **98** | **ACTIVE** · [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) |
| 8 | **[SAN-910](https://linear.app/sanjiovani/issue/SAN-910)** | CK-V2-012 | **Done** | 100 | CI guardrails |

**Flags @ `main`:** `COPILOTKIT_V2_ANALYTICS` · `COPILOTKIT_V2_HOST_EVENT` · `COPILOTKIT_V2_CHAT` — all **OFF** on prod.  
**891 branch:** flags **removed from code** — v2 is the only path after merge.

---

## Program blockers (2026-06-14 sync)

| ID | Issue | Severity | Status |
|---|---|---|---|
| **B1** | **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891)** — merge [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) | 🟡 High | **In Review ~98%** · CI floor |
| **B2** | Post-merge deploy + prod smoke | 🟡 Sequencing | After #219 · no env flag flip needed (code is v2-only) |
| — | ~~SAN-890 merge~~ | — | ✅ **Cleared** — #218 @ `078a677c` |
| — | ~~SAN-901 spike~~ | — | ✅ **Cleared** — #217 |
| — | ~~SAN-895/904/905~~ | — | ✅ **Cleared** — #216 |

---

## Dependency chain

```text
Done: 887 → 888 → 889 → 892 → 900 → 903 → 902 → 895 → 904 → 905 (#216) → 901 (#217) → 890 (#218)

NOW:
  891 (retire react-ui · drop flags · promote canonical) — In Review · PR #219 @ 871d751e

Then:
  Merge #219 → refresh 09-file-map · optional prod smoke
  Optional: 896 evidence · 898 hydration · 897 (obsolete if flags gone) · preview deploy

Parked:
  896 evidence · 898/906 hydration · 911 factory · 899 · 893/894
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
| SAN-890 · CK-V2-004 | 15 | 🟢 | **100** | **Done** · #218 |
| SAN-891 · CK-V2-005 | 16 | 🟡 | **98** | **In Review** · #219 |
| SAN-911 · CK-V2-013 | — | 🅿️ | 0 | Parked |

| **Epic complete (exec @ 891 branch)** | 🟡 | **~95%** | v2-only frontend · awaiting #219 merge |
| **Epic complete (prod v2 visible)** | ⚫ | **~0%** | mdeai.co still on pre-891 `main` deploy |

> **Persona impact on prod today:** None — Camila/Roberto/Patricia still on last prod deploy (`main` @ `078a677c`, flags OFF). After #219 merge + deploy, all three surfaces run v2 with no flag fork.

---

## Next actions

1. **Merge [SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891)** [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) after CI floor green
2. **Refresh [`09-file-map.md`](./09-file-map.md)** + mark SAN-891 Done in [v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
3. **Optional post-891:** prod smoke (Tier 1) · hydration (898) · evidence refresh (896) · close SAN-886 epic

---

## References

- **Changelog:** [`changelog.md`](./changelog.md)
- **Tasks audit:** [`11-tasks-audit.md`](./11-tasks-audit.md) · **File map:** [`09-file-map.md`](./09-file-map.md)
- **Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
