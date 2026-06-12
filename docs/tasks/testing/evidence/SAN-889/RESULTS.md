# SAN-889 · CK-V2-003 — Host event v2 localhost proof

**Task:** [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)  
**Flag:** `COPILOTKIT_V2_HOST_EVENT=1` (default off)  
**Branch:** `ai/san-889-ck-v2-003-migrate-hostevent-hosteventagent-to-v2`

## Scripts

| Script | Purpose |
|--------|---------|
| [`san-889-localhost-proof.mjs`](./san-889-localhost-proof.mjs) | Flag on/off wizard smoke |
| [`san-889-hitl-proof.mjs`](./san-889-hitl-proof.mjs) | v2 HITL reject path + panel |
| [`san-889-hitl-approve-proof.mjs`](./san-889-hitl-approve-proof.mjs) | v2 HITL approve + published link |

**Server:** `COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- npm run dev`

## Pass/fail matrix

| Gate | Flag off | Flag on | HITL reject | HITL approve |
|------|----------|---------|-------------|--------------|
| Wizard HTTP 200 | PASS | PASS | PASS | PASS |
| Form + manual edit | PASS | PASS | PASS | PASS |
| Agent form-fill | PASS | PASS | — | — |
| `host-event-approval-panel` | — | — | **PASS** | **PASS** |
| Reject → no Published link | — | — | **PASS** | — |
| Approve → Published link | — | — | — | **PASS** |
| No `pending_approval` race | — | — | PASS | **PASS** |
| Critical console errors | PASS | PASS | hydration noise only | **PASS** |

**Combined HITL verdict:** **PASS** · [`SAN-889-hitl-combined-results.json`](./SAN-889-hitl-combined-results.json)

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

- SCREEN-016 Playwright first failed without Infisical (middleware env) — **not SAN-889**; re-run **2/2 PASS**.
- First HITL run hit Gemini **429** (rate limit) — retry succeeded.
- Approve proof commit SHA: `072d8e5` (pre-evidence commit; evidence commit follows).
