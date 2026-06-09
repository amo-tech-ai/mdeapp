# MAP-### — evidence (copy → `MAP-###-evidence.md`)

**Task:** MAP-### — _title_  
**Date:** YYYY-MM-DD  
**Verifier:** _name / agent session_

## Shared gates (G1–G8)

| Gate | Result | Notes |
|------|--------|-------|
| G1 `npm test` | exit _ | _ |
| G2 `npm run floor` | exit _ | _ |
| G3 `npm run dev` | OK / fail | UI port: _ ; agent: _ |
| G4 `curl /` | HTTP _ | `http://localhost:_/` |
| G5 `curl POST /api/copilotkit` | HTTP _ | expect 400 not 500 |
| G6 v2 import grep | 0 matches | _ |
| G7 server keys in client | 0 matches | _ |
| G8 This file | yes | _ |

## Task-specific checks

_Paste checklist from MAP-###.md § Verification — tick each with command output or screenshot path._

- [ ] _example: Vitest `platform/contracts/__tests__/map-pin.test.ts` exit 0_

## Cross-task (if applicable)

- [ ] X1–X5 — only after F49; link Playwright report or `mdeapp/e2e/maps-concierge-pins.spec.ts` run

## Screenshots / logs

- _paths or redacted snippets_

## MCP probes (if task requires)

- _redacted request/response summary_
