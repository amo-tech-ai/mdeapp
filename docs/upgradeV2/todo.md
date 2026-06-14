# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-14 ([SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219)) · **Mode:** `post-cutover · prod deploy + smoke`  
**Ground truth:** `main` @ **`4c6ef62e`** (squash merge #219 · 2026-06-14T12:56:45Z) · prior `078a677c` ([SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) #218)  
**Active:** Post-merge — prod deploy · Tier-1 smoke · optional [SAN-896 · CK-V2-008 — Refresh SAN-888 + SAN-889 localhost evidence @ current mainSha (7b596283+)](https://linear.app/sanjiovani/issue/SAN-896/ck-v2-008-refresh-san-888-san-889-localhost-evidence-current-mainsha) / [SAN-898 · CK-V2-010 — Fix v2 host-event hydration mismatch (caret-color transparent)](https://linear.app/sanjiovani/issue/SAN-898/ck-v2-010-fix-v2-host-event-hydration-mismatch-caret-color-transparent) / [SAN-906 · CK-V2-010a — Inventory hydration warnings (host-event v2)](https://linear.app/sanjiovani/issue/SAN-906/ck-v2-010a-inventory-hydration-warnings-host-event-v2)  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) (label **`V2UP`**) — **18 parent + 8 sub issues**  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump in 891)  
**Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)

---

## Chat-only sprint (2026-06-14)

```text
✅ SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream (#216)
→ ✅ SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL) (#217)
→ ✅ SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk (#218)
→ ✅ SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags (#219)
```

| Step | Issue | Priority | Status | Exec % |
|---:|---|---|---|---:|
| 1 | **[SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)** | P0 | ✅ Merged [#216](https://github.com/amo-tech-ai/mdeapp/pull/216) | 100 |
| 2 | **[SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL)](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)** | P0 | ✅ Merged [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) @ `a57516de` | **100** |
| 3 | **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | P1 | ✅ **Done** · merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` | **100** |
| 4 | **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | P2 | ✅ **Done** · merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) @ `4c6ef62e` | **100** |

**Parked (optional post-891):** [SAN-906 · CK-V2-010a — Inventory hydration warnings (host-event v2)](https://linear.app/sanjiovani/issue/SAN-906/ck-v2-010a-inventory-hydration-warnings-host-event-v2) / [SAN-898 · CK-V2-010 — Fix v2 host-event hydration mismatch (caret-color transparent)](https://linear.app/sanjiovani/issue/SAN-898/ck-v2-010-fix-v2-host-event-hydration-mismatch-caret-color-transparent) / [SAN-896 · CK-V2-008 — Refresh SAN-888 + SAN-889 localhost evidence @ current mainSha (7b596283+)](https://linear.app/sanjiovani/issue/SAN-896/ck-v2-008-refresh-san-888-san-889-localhost-evidence-current-mainsha) · [SAN-911 · CK-V2-013 — Extract CopilotKit v2 migration factory before full /chat migration](https://linear.app/sanjiovani/issue/SAN-911/ck-v2-013-extract-copilotkit-v2-migration-factory-before-full-chat) · [SAN-897 · CK-V2-009 — Preview-only flag flip: COPILOTKIT_V2_ANALYTICS=1 (SAN-888)](https://linear.app/sanjiovani/issue/SAN-897/ck-v2-009-preview-only-flag-flip-copilotkit-v2-analytics1-san-888) · [SAN-899 · CK-AI-002 — Mastra thread memory thought_signature round-trip (Gemini 3.5 multi-turn)](https://linear.app/sanjiovani/issue/SAN-899/ck-ai-002-mastra-thread-memory-thought-signature-round-trip-gemini-35-multi-turn) · [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) / [SAN-894 · CK-V1-002 — Fix v1 host event wizard Maximum update depth loop (stabilize EventDraft state ref)](https://linear.app/sanjiovani/issue/SAN-894/ck-v1-002-fix-v1-host-event-wizard-maximum-update-depth-loop-stabilize-eventdraft-state-ref)

**Keep passive:** [SAN-900 · CK-V2-011 — Migration dependency map + audit-copilotkit-v2-map script](https://linear.app/sanjiovani/issue/SAN-900/ck-v2-011-migration-dependency-map-audit-copilotkit-v2-map-script) ✅ · [SAN-910 · CK-V2-012 — Migration CI guardrails (audit dashboard + no-new-v1 gate)](https://linear.app/sanjiovani/issue/SAN-910/ck-v2-012-migration-ci-guardrails-audit-dashboard-no-new-v1-gate) guardrails on PRs

---

## Current verdict

| Area | Verdict |
|---|---|
| **[SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration (frontend-only, subpath path)](https://linear.app/sanjiovani/issue/SAN-886/ck-v2-000-copilotkit-v1v2-migration-frontend-only-subpath-path)** | ✅ **100% exec** — frontend cutover merged @ `4c6ef62e` · prod deploy pending |
| **[SAN-888 · CK-V2-002 — host-analytics-prototype (v2 /host/analytics flag)](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag)** | ✅ **100%** — canonical v2 on `main` |
| **[SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)** | ✅ **100%** — canonical v2 on `main` |
| **[SAN-895 · CK-V2-007 — Fix hostEventAgent Gemini thought_signature console errors (mastra_workspace_list_files)](https://linear.app/sanjiovani/issue/SAN-895/ck-v2-007-fix-hosteventagent-gemini-thought-signature-console-errors-mastra-workspace-list-files)** | ✅ **Done** ([SAN-903 · CK-V2-007a — P0 workspace opt-out on hostEventAgent](https://linear.app/sanjiovani/issue/SAN-903/ck-v2-007a-p0-workspace-opt-out-on-hosteventagent)→[SAN-902 · CK-V2-007b — Minimal repro: Mastra multi-turn signature](https://linear.app/sanjiovani/issue/SAN-902/ck-v2-007b-minimal-repro-mastra-multi-turn-signature)→[SAN-904 · CK-V2-007c — HITL approve/reject proofs green](https://linear.app/sanjiovani/issue/SAN-904/ck-v2-007c-hitl-approvereject-proofs-green)→[SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)) |
| **[SAN-900 · CK-V2-011 — Migration dependency map + audit-copilotkit-v2-map script](https://linear.app/sanjiovani/issue/SAN-900/ck-v2-011-migration-dependency-map-audit-copilotkit-v2-map-script)** | 🟡 **~90%** — refresh after #219 merge ([`09-file-map.md`](./09-file-map.md)) |
| **[SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL)](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)** | ✅ **100%** — merged [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) |
| **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | ✅ **100%** — merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` |
| **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | ✅ **100%** — merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) @ `4c6ef62e` · Linear **Done** |
| **[SAN-911 · CK-V2-013 — Extract CopilotKit v2 migration factory before full /chat migration](https://linear.app/sanjiovani/issue/SAN-911/ck-v2-013-extract-copilotkit-v2-migration-factory-before-full-chat)** | 🅿️ Parked — optional post-891 |
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
| — | **[SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration (frontend-only, subpath path)](https://linear.app/sanjiovani/issue/SAN-886/ck-v2-000-copilotkit-v1v2-migration-frontend-only-subpath-path)** | CK-V2-000 | **Done** | **100** | Epic |
| 1 | **[SAN-887 · CK-V2-001 — v2 hook-signature verification spike (gate before any v2 code)](https://linear.app/sanjiovani/issue/SAN-887/ck-v2-001-v2-hook-signature-verification-spike-gate-before-any-v2-code)** | CK-V2-001 | Done | 100 | ✅ Gate spike |
| 2 | **[SAN-888 · CK-V2-002 — host-analytics-prototype (v2 /host/analytics flag)](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag)** | CK-V2-002 | Done | 100 | ✅ Analytics v2 |
| 3 | **[SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)** | CK-V2-003 | Done | 100 | ✅ Event v2 |
| 4 | **[SAN-892 · CK-V2-006 — Tag all unbuilt CK-*/CONCIERGE-* issues "build on v2"](https://linear.app/sanjiovani/issue/SAN-892/ck-v2-006-tag-all-unbuilt-ck-concierge-issues-build-on-v2)** | CK-V2-006 | Done | 100 | ✅ build-on-v2 tags |
| 5 | **[SAN-900 · CK-V2-011 — Migration dependency map + audit-copilotkit-v2-map script](https://linear.app/sanjiovani/issue/SAN-900/ck-v2-011-migration-dependency-map-audit-copilotkit-v2-map-script)** | CK-V2-011 | **Done** | 100 | ✅ File map (refresh post-891) |
| 6–13 | [SAN-903 · CK-V2-007a — P0 workspace opt-out on hostEventAgent](https://linear.app/sanjiovani/issue/SAN-903/ck-v2-007a-p0-workspace-opt-out-on-hosteventagent)/[SAN-902 · CK-V2-007b — Minimal repro: Mastra multi-turn signature](https://linear.app/sanjiovani/issue/SAN-902/ck-v2-007b-minimal-repro-mastra-multi-turn-signature)/[SAN-895 · CK-V2-007 — Fix hostEventAgent Gemini thought_signature console errors (mastra_workspace_list_files)](https://linear.app/sanjiovani/issue/SAN-895/ck-v2-007-fix-hosteventagent-gemini-thought-signature-console-errors-mastra-workspace-list-files)/[SAN-904 · CK-V2-007c — HITL approve/reject proofs green](https://linear.app/sanjiovani/issue/SAN-904/ck-v2-007c-hitl-approvereject-proofs-green)/[SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream) | CK-V2-007* | **Done** | 100 | ✅ Hygiene chain |
| 14 | **[SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL)](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)** | CK-V2-004A | **Done** | **100** | ✅ Merged #217 |
| 15 | **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | CK-V2-004 | **Done** | **100** | ✅ Merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) |
| 16 | **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | CK-V2-005 | **Done** | **100** | ✅ Merged [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) |
| 8 | **[SAN-910 · CK-V2-012 — Migration CI guardrails (audit dashboard + no-new-v1 gate)](https://linear.app/sanjiovani/issue/SAN-910/ck-v2-012-migration-ci-guardrails-audit-dashboard-no-new-v1-gate)** | CK-V2-012 | **Done** | 100 | CI guardrails |

**Flags:** removed from code on `main` — v2 is the only path (no `COPILOTKIT_V2_*` modules).

---

## Program blockers (2026-06-14 sync)

| ID | Issue | Severity | Status |
|---|---|---|---|
| **B1** | ~~[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) merge [#219](https://github.com/amo-tech-ai/mdeapp/pull/219)~~ | — | ✅ **Cleared** @ `4c6ef62e` |
| **B2** | Prod deploy + Tier-1 smoke | 🟡 High | After Vercel promotes `main` |
| — | ~~[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) merge~~ | — | ✅ **Cleared** — [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` |
| — | ~~[SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL)](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl) spike~~ | — | ✅ **Cleared** — [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) |
| — | ~~[SAN-895 · CK-V2-007 — Fix hostEventAgent Gemini thought_signature console errors (mastra_workspace_list_files)](https://linear.app/sanjiovani/issue/SAN-895/ck-v2-007-fix-hosteventagent-gemini-thought-signature-console-errors-mastra-workspace-list-files)/[SAN-904 · CK-V2-007c — HITL approve/reject proofs green](https://linear.app/sanjiovani/issue/SAN-904/ck-v2-007c-hitl-approvereject-proofs-green)/[SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)~~ | — | ✅ **Cleared** — [#216](https://github.com/amo-tech-ai/mdeapp/pull/216) |

---

## Dependency chain

```text
Done: SAN-887 · CK-V2-001 → SAN-888 · CK-V2-002 → SAN-889 · CK-V2-003 → SAN-892 · CK-V2-006 → SAN-900 · CK-V2-011 → SAN-903 · CK-V2-007a → SAN-902 · CK-V2-007b → SAN-895 · CK-V2-007 → SAN-904 · CK-V2-007c → SAN-905 · CK-V2-007d (#216) → SAN-901 · CK-V2-004A (#217) → SAN-890 · CK-V2-004 (#218) → SAN-891 · CK-V2-005 (#219 @ 4c6ef62e)

NOW:
  Prod deploy + Tier-1 smoke (/chat · /host/event/new · /host/analytics)
  Refresh 09-file-map.md · optional [SAN-896 · CK-V2-008 — Refresh SAN-888 + SAN-889 localhost evidence @ current mainSha]

Parked (not epic blockers):
  SAN-896 · CK-V2-008 evidence · SAN-898 · CK-V2-010 / SAN-906 · CK-V2-010a hydration · SAN-911 · CK-V2-013 factory · SAN-897 · CK-V2-009 (obsolete) · SAN-899 · CK-AI-002 · SAN-893 · CK-V1-001 / SAN-894 · CK-V1-002
```

---

## Parent — [SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration (frontend-only, subpath path)](https://linear.app/sanjiovani/issue/SAN-886/ck-v2-000-copilotkit-v1v2-migration-frontend-only-subpath-path)

| Child | Order | Dot | Shipped % | Linear |
|---|---:|---|---:|---|
| [SAN-887 · CK-V2-001 — v2 hook-signature verification spike (gate before any v2 code)](https://linear.app/sanjiovani/issue/SAN-887/ck-v2-001-v2-hook-signature-verification-spike-gate-before-any-v2-code) | 1 | 🟢 | 100 | Done |
| [SAN-888 · CK-V2-002 — host-analytics-prototype (v2 /host/analytics flag)](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag) | 2 | 🟢 | 100 | Done |
| [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | 3 | 🟢 | 100 | Done |
| [SAN-892 · CK-V2-006 — Tag all unbuilt CK-*/CONCIERGE-* issues "build on v2"](https://linear.app/sanjiovani/issue/SAN-892/ck-v2-006-tag-all-unbuilt-ck-concierge-issues-build-on-v2) | 4 | 🟢 | 100 | Done |
| [SAN-900 · CK-V2-011 — Migration dependency map + audit-copilotkit-v2-map script](https://linear.app/sanjiovani/issue/SAN-900/ck-v2-011-migration-dependency-map-audit-copilotkit-v2-map-script) | 5 | 🟢 | 100 | Done |
| [SAN-903 · CK-V2-007a — P0 workspace opt-out on hostEventAgent](https://linear.app/sanjiovani/issue/SAN-903/ck-v2-007a-p0-workspace-opt-out-on-hosteventagent)–[SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream) · CK-V2-007* | 6–12 | 🟢 | 100 | Done |
| [SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL)](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl) | 14 | 🟢 | **100** | **Done** · [#217](https://github.com/amo-tech-ai/mdeapp/pull/217) |
| [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) | 15 | 🟢 | **100** | **Done** · [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) |
| [SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) | 16 | 🟢 | **100** | **Done** · [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) |
| [SAN-911 · CK-V2-013 — Extract CopilotKit v2 migration factory before full /chat migration](https://linear.app/sanjiovani/issue/SAN-911/ck-v2-013-extract-copilotkit-v2-migration-factory-before-full-chat) | — | 🅿️ | 0 | Parked |

| **Epic complete (exec @ main)** | 🟢 | **100%** | v2-only frontend merged |
| **Epic complete (prod v2 visible)** | 🟡 | **~0%** | awaiting deploy of `4c6ef62e` |

> **Persona impact:** Camila `/chat`, Roberto `/host/event/new`, Patricia `/host/analytics` run v2 on `main` after prod deploy — no flag fork.

---

## Next actions

1. **Prod deploy** — confirm Vercel promotes `main` @ `4c6ef62e`
2. **Tier-1 prod smoke** — `/chat` · `/host/event/new` · `/host/analytics`
3. **Refresh [`09-file-map.md`](./09-file-map.md)** · optional [SAN-896 · CK-V2-008 — Refresh SAN-888 + SAN-889 localhost evidence @ current mainSha (7b596283+)](https://linear.app/sanjiovani/issue/SAN-896/ck-v2-008-refresh-san-888-san-889-localhost-evidence-current-mainsha) evidence refresh
4. **Optional:** [SAN-898 · CK-V2-010 — Fix v2 host-event hydration mismatch (caret-color transparent)](https://linear.app/sanjiovani/issue/SAN-898/ck-v2-010-fix-v2-host-event-hydration-mismatch-caret-color-transparent) / [SAN-906 · CK-V2-010a — Inventory hydration warnings (host-event v2)](https://linear.app/sanjiovani/issue/SAN-906/ck-v2-010a-inventory-hydration-warnings-host-event-v2) hydration chain · [SAN-897 · CK-V2-009 — Preview-only flag flip: COPILOTKIT_V2_ANALYTICS=1 (SAN-888)](https://linear.app/sanjiovani/issue/SAN-897/ck-v2-009-preview-only-flag-flip-copilotkit-v2-analytics1-san-888) canceled (flags removed)

---

## References

- **Changelog:** [`changelog.md`](./changelog.md)
- **Tasks audit:** [`11-tasks-audit.md`](./11-tasks-audit.md) · **File map:** [`09-file-map.md`](./09-file-map.md)
- **Linear contracts:** [`linear-descriptions/`](./linear-descriptions/)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
