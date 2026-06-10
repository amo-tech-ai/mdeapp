# F33 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0 (124 tests)
npm test -- src/__tests__/event-draft.test.ts              → pass
```

## Deliverables

- `mdeapp/src/lib/types/event-draft.ts` — `EventDraftStateSchema`, helpers (`mergeEventDraft`, `activeHostWizardStep`, `isDraftReadyForPublish`)
- Re-export from `mdeapp/src/lib/types.ts` (file wins over `types/` folder — no `types/index.ts`)

## Tests

- `mdeapp/src/__tests__/event-draft.test.ts` — schema defaults, merge, publish readiness, wizard step

## Persona impact

Roberto's wizard shares one draft shape across `useCoAgent`, `hostEventAgent` working memory, and F38 approval payload.

## Follow-ups

- Move canonical path to `platform/contracts/event-draft.ts` when MAP-001 contracts folder lands (optional refactor).
