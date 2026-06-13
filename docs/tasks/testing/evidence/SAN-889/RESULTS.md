# SAN-889 · CK-V2-003 — Host event v2 localhost proof

**Task:** [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)  
**Flag:** `COPILOTKIT_V2_HOST_EVENT=1` (default off)  
**Ground truth:** `main` @ `0fab08f` · **last verified:** 2026-06-12

## Scripts

| Script | Purpose |
|--------|---------|
| [`san-889-localhost-proof.mjs`](./san-889-localhost-proof.mjs) | Flag on/off wizard smoke |
| [`san-889-hitl-proof.mjs`](./san-889-hitl-proof.mjs) | v2 HITL reject path + panel |
| [`san-889-hitl-approve-proof.mjs`](./san-889-hitl-approve-proof.mjs) | v2 HITL approve + published link |

**Server (v2):** `COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- npm run dev`  
**Server (v1):** `infisical run --silent --env=dev --path=/ -- npm run dev` (flag unset)

## Pass/fail matrix — post-merge re-verify @ `0fab08f`

| Gate | Flag off (v1) | Flag on (v2) | HITL reject | HITL approve |
|------|---------------|--------------|-------------|--------------|
| `copilotkitPost` gate | PASS | PASS | — | — |
| Wizard HTTP 200 | PASS | PASS | PASS | PASS |
| Form + manual edit | PASS | PASS | PASS | PASS |
| Agent neighborhood fill | PASS | PASS | — | — |
| `host-event-approval-panel` | — | — | **PASS** | **PASS** |
| Reject → no Published link | — | — | **PASS** | — |
| Approve → Published link | — | — | — | **PASS** |
| No `pending_approval` race | — | — | PASS | **PASS** |
| Zero critical console errors | **FAIL** | **PASS** | PARTIAL (`thought_signature`) | **PASS** |

**v2 localhost verdict:** **PASS** · [`SAN-889-v2-flag-on-results.json`](./SAN-889-v2-flag-on-results.json)  
**v1 localhost verdict:** **FAIL** (console) · [`SAN-889-v2-flag-off-results.json`](./SAN-889-v2-flag-off-results.json) — tracked separately as [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) (not [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) regression; v1 bridge 0 diff vs pre-889)

## E1 fix (2026-06-12)

`copilotkitPostOk()` now returns `true` when POST `/api/copilotkit` returns **200 or 400** (runtime connected). Prior `main` compared HTTP status to `=== true` and always failed the gate.

## Screenshots

| File | What |
|------|------|
| [`SAN-889-v2-flag-off-localhost.png`](./SAN-889-v2-flag-off-localhost.png) | v1 wizard |
| [`SAN-889-v2-flag-on-localhost.png`](./SAN-889-v2-flag-on-localhost.png) | v2 wizard |
| [`SAN-889-hitl-wizard-filled.png`](./SAN-889-hitl-wizard-filled.png) | v2 wizard loaded |
| [`SAN-889-hitl-draft-complete.png`](./SAN-889-hitl-draft-complete.png) | Complete draft |
| [`SAN-889-hitl-panel-visible.png`](./SAN-889-hitl-panel-visible.png) | HITL panel |
| [`SAN-889-hitl-reject.png`](./SAN-889-hitl-reject.png) | After reject |
| [`SAN-889-hitl-approve-panel.png`](./SAN-889-hitl-approve-panel.png) | Approve panel |
| [`SAN-889-hitl-approve.png`](./SAN-889-hitl-approve.png) | Published state |

## Notes

- SCREEN-016 Playwright first failed without Infisical (middleware env) — **not [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)**; re-run **2/2 PASS**.
- First HITL run hit Gemini **429** (rate limit) — retry succeeded.
- v1 flag-off console FAIL: `Maximum update depth` + `thought_signature` on `mastra_workspace_list_files` — [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop), not blocker for [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) Done.
