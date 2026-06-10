# SCREEN-016 evidence — 2026-05-24

## Fix (2026-05-24)

- **Root cause:** `useCoAgent({ initialState })` → `setState` is **noop** until agent connects; Playwright `fill()` updated DOM only, preview read stale React state.
- **Fix:** External state — `useState` + `useCoAgent({ state: draft, setState })` per CopilotKit docs / canvas/mastra example.

## Commands

```text
npm run floor                                              → exit 0 (124 tests)
E2E_BYPASS_AUTH=1 npm run dev:ui                           → boot clean
curl -L :3001/host/event/new                               → HTTP 200
curl -X POST :3001/api/approval-commit -d '{}'             → HTTP 400
npx playwright test e2e/screens/SCREEN-016-host-wizard.spec.ts --project=chromium → 2/2 (2026-05-24 after external-state fix)
```

## UI

- `/host/event/new` — host shell: nav rail, workflow strip, form, live preview, CopilotChat
- `hostEventAgent` via nested `CopilotKit` in `host/event/layout.tsx`
- HITL publish panel via `preview_and_publish` action

## Key files

- `mdeapp/src/app/host/event/new/page.tsx`
- `mdeapp/src/app/host/event/layout.tsx`
- `mdeapp/src/components/host/host-event-shell.tsx`
- `mdeapp/src/components/host/host-event-copilot-bridge.tsx`
- `mdeapp/src/components/host/event-publish-approval-panel.tsx`
- `mdeapp/e2e/screens/SCREEN-016-host-wizard.spec.ts`

## Playwright

- Desktop: wizard shell, form fill → preview updates, console clean
- Mobile: form visible
- Screenshots: `mdeapp/tmp/screenshots/SCREEN-016/desktop-wizard-shell.png`, `mobile-wizard-shell.png`

## Acceptance

| Criterion | Status |
|-----------|--------|
| Wizard UI + testids | ✅ |
| `useCoAgent<EventDraftState>` + frontend actions | ✅ |
| HITL ApprovalPanel wired | ✅ |
| F38 edge deployed + API proxy | ✅ |
| NL → agent tool fill (live Gemini) | ⚠️ manual |
| Approve → live `/events/:slug` | ⚠️ manual signed-in |
| Tickets purchasable post-publish | ⚠️ after manual publish |

## Persona impact

Roberto lands on `/host/event/new`, describes an event in chat or edits the form, reviews preview, and approves publish — hero Phase 1 path unblocked for QA.

## Backend tasks

- F33–F38 evidence: `tasks/notes/F33-evidence.md` … `F38-evidence.md`

## Follow-ups

- Signed-in E2E: login fixture → full publish → curl `/events/{slug}` 200
- Mastra Studio trace for one NL describe turn
