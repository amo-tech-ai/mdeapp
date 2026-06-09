# SCREEN-001–005 evidence — 2026-05-24 (superseded)

> **Superseded** by per-task evidence (visual gate complete 2026-05-24):
> - [`SCREEN-001-evidence.md`](SCREEN-001-evidence.md)
> - [`SCREEN-003-evidence.md`](SCREEN-003-evidence.md)
> - [`SCREEN-004-evidence.md`](SCREEN-004-evidence.md)
> - [`SCREEN-005-evidence.md`](SCREEN-005-evidence.md)

## Historical (unit/smoke only)

```bash
cd mdeapp && npm test          # 97/97 exit 0
npm run lint && npm run typecheck && npm run build  # exit 0
npm run smoke:map-pins         # exit 0 — 5 rental cards, 6 pins
npm run smoke:f50-pin-sync     # exit 0
npm run verify:console         # exit 0 — 0 critical errors
npm run floor                  # exit 0
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/  # 200
```

## Artifacts

| File | Task |
|------|------|
| `src/components/chat/chat-center-panel.tsx` | 001 — strip slot |
| `src/components/chat/workflow-progress-strip.tsx` | 004 |
| `src/components/chat/chat-workflow-context.tsx` | 004 |
| `src/components/chat/chat-query-bar.tsx` | 003 |
| `src/platform/copilot/chat-filter-chips.ts` | 003 |
| `src/components/copilot/rental-card.tsx` | 005 |
| `src/components/modals/schedule-viewing-modal.tsx` | 008 shell (F47 blocked) |

## CopilotKit pattern

- `useCoAgent<ConciergeWorkingMemory>({ name: "conciergeAgent" })` per CopilotKit shared-state docs (MCP search-docs 2026-05-24)
- Workflow strip Phase A: generative tool `status` via `useCopilotAction` render hooks

## Not Done

- SCREEN-008 submit (requires F47 `chat-lead-capture` edge)
- SCREEN-002 thread hydration (deferred per audit/23)
