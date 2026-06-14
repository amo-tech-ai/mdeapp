# SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui

**Baseline SHA:** `078a677c` (main after [SAN-890 · CK-V2-004 — Migrate /chat](https://linear.app/sanjiovani/issue/SAN-890) PR #218)  
**Rollback tag:** `pre-san-891-cutover` @ `078a677c`  
**Branch:** `ai/san-891-ck-v2-005-retire-copilotkitreact-ui`  
**Prod flags:** unchanged — no `COPILOTKIT_V2_*` flip

## grep-zero gates

| Gate | Result |
|---|---|
| `rg '@copilotkit/react-ui' src/` | **0** |
| `rg '@copilotkit/react-core' src/ \| rg -v '/v2'` | **0** |
| `rg 'COPILOTKIT_V2_' src/` | **0** |
| v1 hooks in `src/` (excl comments/tests) | **0** |

## Static proof

| Check | Result |
|---|---|
| `npm run audit:copilotkit-v2` | **PASS** |
| `node scripts/audit-copilotkit-v2-no-new-v1.mjs` | **PASS** |
| `npm run build` | **PASS** |
| `npm test -- --run cafe-detail-panel copilotkit` | **10/10 PASS** |
| `npm run floor` | **OOM** (local lint scans worktrees) — CI floor is source of truth |

## Browser proof (localhost :3001)

**Script:** `san-891-localhost-proof.mjs`  
**Run:** `infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-891/san-891-localhost-proof.mjs`  
**Verdict:** **PASS** @ `2026-06-14T11:23:14Z`

| Route | HTTP | Shell / UI | Agent / cards | Screenshot |
|---|---|---|---|---|
| `/chat` | 200 | `geo-chat-shell` · `chat-canvas` · `center-chat-panel` | `event-card` ≥1 (events prompt after rental retry) | `SAN-891-chat-localhost.png` |
| `/host/event/new` | 200 | `host-event-wizard` · `host-event-form` · v2 chat region | wizard + form render | `SAN-891-host-event-new-localhost.png` |
| `/host/analytics` | 200 | `host-analytics` · v2 ops chat region | shell renders (sales ack soft — agent idle) | `SAN-891-host-analytics-localhost.png` |

**Console errors:** 0 (after dev restart; prior run hit transient CopilotKit 429 under load)

**Artifacts:** `SAN-891-localhost-results.json`

## Scope delivered

- Removed `@copilotkit/react-ui` from `package.json` / lockfile
- Global CSS → `@copilotkit/react-core/v2/styles.css`
- Promoted v2 chat + host files to canonical names; deleted v1 twins
- Removed `COPILOTKIT_V2_*` flag modules, branches, and tests
- Added `useConciergeChat` + `useAgent` coagent bridge
- Restored `ChatQueryBar` + filter instructions on canonical center panel
