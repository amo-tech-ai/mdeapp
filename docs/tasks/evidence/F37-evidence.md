# F37 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0
npm test -- src/__tests__/approval-panel.test.tsx          → pass
```

## Deliverables

- `mdeapp/src/components/host/event-publish-approval-panel.tsx` — publish HITL card, POSTs to `/api/approval-commit`
- `mdeapp/src/components/approvals/ApprovalPanel.tsx` — generic 3-button panel
- `mdeapp/src/lib/events/draft-to-event-card.ts` — draft → preview props
- Wired in `host-event-copilot-bridge.tsx` via `preview_and_publish` + `renderAndWaitForResponse`

## Tests

- `mdeapp/src/__tests__/approval-panel.test.tsx` — static render of approve/edit/reject testids

## Persona impact

Roberto must explicitly approve before F38 persists `events` row — no silent publish.

## Follow-ups

- Full HITL → live slug proof requires signed-in session + approval-commit 200 (manual).
