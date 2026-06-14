# SAN-902 · CK-V2-007b — 3-turn hostEventAgent repro

**Parent:** [SAN-895 · CK-V2-007](https://linear.app/sanjiovani/issue/SAN-895)  
**Prerequisite:** [SAN-903 · CK-V2-007a](https://linear.app/sanjiovani/issue/SAN-903) merged (`workspace: () => undefined` on `hostEventAgent`)

## Run

```bash
infisical run --silent --env=dev --path=/ -- npm run repro:san-902
```

## Expected (post SAN-903)

| Turn | Gate | Pass when |
|---:|---|---|
| 1 | No `mastra_workspace_*` in `toolCalls` | `toolNames` empty or frontend-only |
| 2 | No `thought_signature` error | `ok: true` |
| 3 | Document behavior | JSON records outcome (flake → note for SAN-905) |

## Latest run @ `7674986` (2026-06-13)

| Turn | Result | Notes |
|---:|---|---|
| 1 | ✅ PASS | `toolNames: []` — no `mastra_workspace_*` |
| 2 | ✅ PASS | No thrown `thought_signature` |
| 3 | ✅ PASS (2/2 runs) | `textLength` ~188–190; **flake not reproduced** this session |

**stderr:** Mastra may log `AGENT_STREAM_ERROR` with `finishReason: error` on turns 1–2 while `generate()` still resolves — track under SAN-905 console gate; not a `thought_signature` payload.

**Artifacts:** `SAN-902-3turn-repro-7674986-2026-06-13T23-53-35-675Z.json` · `…-59-275Z.json`

- Script: `docs/tasks/testing/evidence/SAN-902/san-902-host-event-3turn-repro.ts`
- Evidence: `SAN-902-3turn-repro-<sha>-<stamp>.json` in this folder

## Interpretation

- **Turn 1–2 green** → SAN-903 hypothesis holds for the original failure mode.
- **Turn 3 `AGENT_STREAM_ERROR`** → intermittent; track under SAN-905 console gate, not a SAN-903 revert trigger.
- **Any `thought_signature`** → SAN-895 chain blocked; investigate before SAN-904 HITL proofs.
