# F34 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0 (124 tests)
npm test -- src/__tests__/host-event-agent.test.ts         → pass
npm test -- src/__tests__/smoke.test.ts                    → 7 agents incl. hostEventAgent
```

## Deliverables

- `mdeapp/src/mastra/agents/host-event.ts` — `hostEventAgent` (`gemini-3.5-flash`, thread working memory)
- `mdeapp/src/mastra/agents/host-event-prompt.ts` — Roberto persona + tool names
- Registered in `mdeapp/src/mastra/index.ts` as `hostEventAgent`

## Fix (Mastra bundle)

- Import `EventDraftStateSchema` via relative path `../../lib/types/event-draft` (not `@/lib/types`) — Mastra dev bundle cannot resolve `@/lib`.

## Tests

- `mdeapp/src/__tests__/host-event-agent.test.ts` — id, instructions, Mastra registration

## Persona impact

CopilotKit subtree at `/host/event/*` uses `agent="hostEventAgent"` — Roberto's chat drives `EventDraftState`.

## Follow-ups

- Studio NL → tool smoke with live Gemini key (manual).
- Agent-side tools (`set_event_*`) deferred to frontend `useCopilotAction` mirror (F36 pattern).
