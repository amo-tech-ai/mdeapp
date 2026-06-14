# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-14 ([SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219)) · **Mode:** `post-cutover · prod deploy + smoke`  
**Ground truth:** `main` @ **`4c6ef62e`** (squash merge #219 · 2026-06-14T12:56:45Z) · prior `078a677c` (SAN-890 #218)  
**Active:** Post-merge — prod deploy · Tier-1 smoke · optional 896/898/906  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) (label **`V2UP`**) — **18 parent + 8 sub issues**  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump in 891)  
**Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)

---

## Chat-only sprint (2026-06-14)

```text
✅ SAN-905 (#216) → ✅ SAN-901 (#217) → ✅ SAN-890 (#218) → ✅ SAN-891 (#219)
```

| Step | Issue | Priority | Status | Exec % |
|---:|---|---|---|---:|
| 1 | **[SAN-905 · CK-V2-007d](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)** | P0 | ✅ Merged [#216](https://github.com/amo-tech-ai/mdeapp/pull/216) | 100 |
| 2 | **[SAN-901 · CK-V2-004A](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)** | P0 | ✅ Merged [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) @ `a57516de` | **100** |
| 3 | **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | P1 | ✅ **Done** · merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` | **100** |
| 4 | **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | P2 | ✅ **Done** · merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) @ `4c6ef62e` | **100** |

**Parked (optional post-891):** SAN-906/898/896 · SAN-911 factory · SAN-897 · SAN-899 · SAN-893/894

**Keep passive:** SAN-900 ✅ · SAN-910 guardrails on PRs

---

## Current verdict

| Area | Verdict |
|---|---|
| **SAN-886 · CK-V2-000 — Epic** | ✅ **100% exec** — frontend cutover merged @ `4c6ef62e` · prod deploy pending |
| **SAN-888 · CK-V2-002 — Host Analytics** | ✅ **100%** — canonical v2 on `main` |
| **SAN-889 · CK-V2-003 — Host Event v2** | ✅ **100%** — canonical v2 on `main` |
| **SAN-895 · CK-V2-007 — Hygiene parent** | ✅ **Done** (903→902→904→905) |
| **SAN-900 · CK-V2-011 — File map** | 🟡 **~90%** — refresh after #219 merge ([`09-file-map.md`](./09-file-map.md)) |
| **SAN-901 · CK-V2-004A — Chat spike** | ✅ **100%** — merged #217 |
| **SAN-890 · CK-V2-004 — /chat v2** | ✅ **100%** — merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` |
| **SAN-891 · CK-V2-005 — Retire react-ui** | ✅ **100%** — merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) @ `4c6ef62e` · Linear **Done** |
| **SAN-911 · CK-V2-013 — Migration factory** | 🅿️ Parked — optional post-891 |
| **Prod risk** | 🟡 Code on `main` is v2-only — **mdeai.co** still pre-deploy until Vercel promotes `4c6ef62e` |

---

## Migration dashboard (@ `4c6ef62e` + `npm run audit:copilotkit-v2`)

| Metric | Value @ `main` (`4c6ef62e`) |
|---|---|
| v1 hook files | **0** |
| v2 hook files | **16** |
| react-ui package imports | **0** |
| Hook file v2 share | **100%** |
| `COPILOTKIT_V2_*` in `src/` | **0** (removed) |
| Route migration (code) | analytics **100%** · event **100%** · chat **100%** |
| **Weighted program (exec)** | **100%** — frontend cutover merged |
| **Prod / user-visible v2** | **0%** until deploy promotes `4c6ef62e` |

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
| PR | [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) merged @ `4c6ef62e` | ✅ |

**Evidence:** [`docs/tasks/testing/evidence/SAN-891/SAN-891-RESULTS.md`](../tasks/testing/evidence/SAN-891/SAN-891-RESULTS.md)

---

## Implementation order (canonical — copy into every PR)

| # | Issue | SPEC | Linear | Exec % | Phase |
|---:|---|---|---|---:|---|
| — | **SAN-886** | CK-V2-000 | **Done** | **100** | Epic |
| 1 | **SAN-887** | CK-V2-001 | Done | 100 | ✅ Gate spike |
| 2 | **SAN-888** | CK-V2-002 | Done | 100 | ✅ Analytics v2 |
| 3 | **SAN-889** | CK-V2-003 | Done | 95 | ✅ Event v2 |
| 4 | **SAN-892** | CK-V2-006 | Done | 100 | ✅ build-on-v2 tags |
| 5 | **SAN-900** | CK-V2-011 | **Done** | 100 | ✅ File map (refresh post-891) |
| 6–13 | SAN-903/902/895/904/905 | CK-V2-007* | **Done** | 100 | ✅ Hygiene chain |
| 14 | **[SAN-901](https://linear.app/sanjiovani/issue/SAN-901)** | CK-V2-004A | **Done** | **100** | ✅ Merged #217 |
| 15 | **[SAN-890](https://linear.app/sanjiovani/issue/SAN-890)** | CK-V2-004 | **Done** | **100** | ✅ Merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) |
| 16 | **[SAN-891](https://linear.app/sanjiovani/issue/SAN-891)** | CK-V2-005 | **Done** | **100** | ✅ Merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) |
| 8 | **[SAN-910](https://linear.app/sanjiovani/issue/SAN-910)** | CK-V2-012 | **Done** | 100 | CI guardrails |

**Flags:** removed from code on `main` — v2 is the only path (no `COPILOTKIT_V2_*` modules).

---

## Program blockers (2026-06-14 sync)

| ID | Issue | Severity | Status |
|---|---|---|---|
| **B1** | ~~[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891) merge #219~~ | — | ✅ **Cleared** @ `4c6ef62e` |
| **B2** | Prod deploy + Tier-1 smoke | 🟡 High | After Vercel promotes `main` |
| — | ~~SAN-890 merge~~ | — | ✅ **Cleared** — #218 @ `078a677c` |
| — | ~~SAN-901 spike~~ | — | ✅ **Cleared** — #217 |
| — | ~~SAN-895/904/905~~ | — | ✅ **Cleared** — #216 |

---

## Dependency chain

```text
Done: 887 → 888 → 889 → 892 → 900 → 903 → 902 → 895 → 904 → 905 (#216) → 901 (#217) → 890 (#218) → 891 (#219 @ 4c6ef62e)

NOW:
  Prod deploy + Tier-1 smoke (/chat · /host/event/new · /host/analytics)
  Refresh 09-file-map.md · optional evidence refresh (896)

Parked (not epic blockers):
  896 evidence · 898/906 hydration · 911 factory · 897 (obsolete) · 899 · 893/894
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
| SAN-891 · CK-V2-005 | 16 | 🟢 | **100** | **Done** · #219 |
| SAN-911 · CK-V2-013 | — | 🅿️ | 0 | Parked |

| **Epic complete (exec @ main)** | 🟢 | **100%** | v2-only frontend merged |
| **Epic complete (prod v2 visible)** | 🟡 | **~0%** | awaiting deploy of `4c6ef62e` |

> **Persona impact:** Camila `/chat`, Roberto `/host/event/new`, Patricia `/host/analytics` run v2 on `main` after prod deploy — no flag fork.

---

## Next actions

1. **Prod deploy** — confirm Vercel promotes `main` @ `4c6ef62e`
2. **Tier-1 prod smoke** — `/chat` · `/host/event/new` · `/host/analytics`
3. **Refresh [`09-file-map.md`](./09-file-map.md)** · optional SAN-896 evidence refresh
4. **Optional:** hydration chain 898/906 · cancel SAN-897 (flags removed)

---

## References

- **Changelog:** [`changelog.md`](./changelog.md)
- **Tasks audit:** [`11-tasks-audit.md`](./11-tasks-audit.md) · **File map:** [`09-file-map.md`](./09-file-map.md)
- **Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
