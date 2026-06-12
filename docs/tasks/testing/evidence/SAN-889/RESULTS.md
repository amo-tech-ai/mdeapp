# SAN-889 · CK-V2-003 — Host event v2 localhost proof

**Task:** [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)  
**Flag:** `COPILOTKIT_V2_HOST_EVENT=1` (default off)  
**Script:** [`san-889-localhost-proof.mjs`](./san-889-localhost-proof.mjs)

## How to run

Restart dev with matching flag, then:

```bash
# Flag off (v1 path)
infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-889/san-889-localhost-proof.mjs

# Flag on (v2 path) — server must also have COPILOTKIT_V2_HOST_EVENT=1
COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-889/san-889-localhost-proof.mjs
```

## Gates

| Gate | Flag off | Flag on |
|------|----------|---------|
| `/host/event/new` HTTP 200 | required | required |
| `host-event-wizard` + form visible | required | required |
| Manual title edit | required | required |
| Agent neighborhood fill OR HITL panel | soft | soft |
| Zero critical console errors | required | required |

## Results

| Mode | Verdict | JSON | Screenshot |
|------|---------|------|------------|
| v1 flag-off | **PASS** | [`SAN-889-v2-flag-off-results.json`](./SAN-889-v2-flag-off-results.json) | [`SAN-889-v2-flag-off-localhost.png`](./SAN-889-v2-flag-off-localhost.png) |
| v2 flag-on | **PASS** | [`SAN-889-v2-flag-on-results.json`](./SAN-889-v2-flag-on-results.json) | [`SAN-889-v2-flag-on-localhost.png`](./SAN-889-v2-flag-on-localhost.png) |

**Proof run:** 2026-06-12 · branch `e834c90` · `:3001` · Roberto prompt filled neighborhood via agent on both modes · zero critical console errors · HITL panel not triggered in this run (draft incomplete for `preview_and_publish`).
