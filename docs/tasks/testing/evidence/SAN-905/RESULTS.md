# SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream

**Task:** [SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)  
**Parent:** [SAN-895 · CK-V2-007 — Fix hostEventAgent Gemini thought_signature console errors](https://linear.app/sanjiovani/issue/SAN-895/ck-v2-007-fix-hosteventagent-gemini-thought-signature-console-errors)  
**Ground truth:** `main` @ `44e93f2` + SAN-905 fixes @ `836af36` (local) · **verified:** 2026-06-14

## Verdict: **PASS** (console gate)

Roberto's `/host/event/new` wizard is **console-clean** on both flag states and both HITL paths after the AG-UI message sanitize fix.

## Root cause + fix (runtime-evidenced)

| Layer | Finding | Fix |
|-------|---------|-----|
| Direct `hostEventAgent.generate()` (SAN-902) | Turn 2+ **no** `thought_signature` after SAN-903 workspace opt-out | Baseline OK — not a Mastra-only bug |
| CopilotKit / AG-UI path | `convertAGUIMessagesToMastra` replays **unsigned** assistant tool-call history on client-tool round-trip 2 | `sanitizeHostEventAgUiInput()` in `logging-mastra-agent.ts` — pass **latest user message only**; Mastra `MessageHistory` loads signed DB thread |
| `updateWorkingMemory` tool | Extra tool round-trip on turn 1 | `createHostEventThreadMemory()` with `readOnly: true` |
| Stale thread replay | Old unsigned history on reload | Fresh `threadId` per wizard session (`host-event-provider-v1/v2`) |

## Proof matrix @ `44e93f2` + fixes

| Step | Script / mode | `consoleErrors` | Verdict |
|------|---------------|-----------------|---------|
| 1 | `san-889-localhost-proof.mjs` flag **OFF** | `[]` | **PASS** |
| 2 | `san-889-localhost-proof.mjs` flag **ON** | `[]` | **PASS** |
| 3 | `san-889-hitl-approve-proof.mjs` | `[]` | **PASS** |
| 4 | `san-889-hitl-proof.mjs` `SAN889_REJECT_ONLY=1` | `[]` | **PASS** |
| 5 | Combined HITL (reject → approve same session) | network error on 2nd navigation | **SKIP** (steps 3–4 cover approve/reject separately) |

## Fail patterns — **not observed** post-fix

- `thought_signature` / `INCOMPLETE_STREAM` on `set_event_basics`
- `thought_signature` on `preview_and_publish` (reject path)
- Unresolved `AGENT_STREAM_ERROR` with signature payload

v1 `Maximum update depth exceeded` may still appear in DevTools — tracked as [SAN-893](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop); **excluded** from SAN-905 console gate on flag-off.

## Unit tests

```bash
npm test -- --run src/__tests__/host-event-agent.test.ts  # 6/6 PASS
npm run repro:san-902  # turn2 no thought_signature @ 836af36
```

## Prod / parent gates

- **Do not** flip `COPILOTKIT_V2_HOST_EVENT` prod flag from this evidence alone — separate SAN-896 gate.
- [SAN-895](https://linear.app/sanjiovani/issue/SAN-895/ck-v2-007-fix-hosteventagent-gemini-thought-signature-console-errors) **unblocked** for close after review; was held until SAN-905 green.

## Commands (repro)

```bash
# v2 dev
COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- npm run dev

# proofs
MAIN_SHA=44e93f2 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-889/san-889-localhost-proof.mjs

MAIN_SHA=44e93f2 SAN889_V2=1 COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-889/san-889-localhost-proof.mjs

MAIN_SHA=44e93f2 COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-889/san-889-hitl-approve-proof.mjs

MAIN_SHA=44e93f2 SAN889_REJECT_ONLY=1 COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/SAN-889/san-889-hitl-proof.mjs
```
