# F36 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0
E2E_BYPASS_AUTH=1 curl -L :3001/host/event/new             → HTTP 200
npx playwright test e2e/screens/SCREEN-016-host-wizard.spec.ts --project=chromium → 2/2
```

## Deliverables

- `mdeapp/src/app/host/event/layout.tsx` — nested `CopilotKit` with `agent="hostEventAgent"`
- `mdeapp/src/app/host/event/new/page.tsx` — server page → `HostEventShell`
- `mdeapp/src/components/host/host-event-shell.tsx` — wizard layout
- `mdeapp/src/components/host/host-event-copilot-bridge.tsx` — `useCoAgent<EventDraftState>` + 4 frontend actions
- `mdeapp/src/components/host/host-event-form.tsx` — manual fields + testids
- `mdeapp/src/components/host/host-event-preview-card.tsx`, `host-event-workflow-strip.tsx`

## Frontend actions (generative UI mirror)

- `set_event_basics`, `set_venue`, `set_pricing`, `preview_and_publish` (HITL via `renderAndWaitForResponse`)

## E2E auth

- `E2E_BYPASS_AUTH=1` in middleware skips `/host/*` redirect for Playwright only (not production).

## Persona impact

Roberto sees form + preview + CopilotChat on one page; manual edits sync preview; agent actions merge into shared draft.

## Follow-ups

- Signed-in Roberto NL → auto-fill via live agent turn (manual Studio / browser test).
