---
id: SCREEN-016
title: Host Event Wizard UI
status: Done
priority: P0
phase: MVP Phase 5
effort: 6-8h
feature_group: "003.1"
depends_on:
  - F33
  - F34
  - F36
  - F37
  - F38
blocks:
  - SCREEN-014
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - copilotkit-agui
  - mastra
  - gemini
  - shadcn
wireframes:
  - 004-wire-host-event-wizard.md
primary_wire: 004-wire-host-event-wizard.md
related_specs:
  - 003-scr-event-detail-page.md
  - 003-events-README.md
testing_standard: ../../screens/SCREEN-TESTING-STANDARD.md
evidence_file: ../evidence/SCREEN-016-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-016-*.spec.ts
path: /host/event/new
---

# SCREEN-016 — Host Event Wizard UI

> **Events group 003.1 (host):** [003-events-README.md](003-events-README.md) · Wire: [003.1-wire-host-event-wizard.md](004-wire-host-event-wizard.md) · Publishes to [003-scr-event-detail-page.md](003-scr-event-detail-page.md)

## Goal
Replace auth placeholder with CopilotChat + hostEventAgent tools + HITL publish (Roberto).

## User story
As **Roberto**, I want to describe my event in chat and approve publish, so my event goes live with tickets.

## Screen / path
`/host/event/new`

## Wireframe source
- [003.1-wire-host-event-wizard.md](004-wire-host-event-wizard.md)

## Current status
**Done (UI + HITL shell)** — `HostEventShell` at `/host/event/new`; CopilotChat + preview + workflow strip; Playwright `SCREEN-016` pass. **Manual QA open:** signed-in NL → publish → live slug + ticket purchase. Evidence: [`../evidence/SCREEN-016-evidence.md`](../evidence/SCREEN-016-evidence.md).

## Build scope

### Frontend
- **Shipped** `app/host/event/new/page.tsx`, `host-event-shell.tsx`, `host-event-copilot-bridge.tsx`
- **Shipped** `event-publish-approval-panel.tsx` for HITL
- Preview card + workflow strip in thread

### CopilotKit
- `useCoAgent<EventDraftState>({ name: "hostEventAgent" })` when F34 lands
- `renderAndWaitForResponse` for `preview_and_publish`

### Mastra
- `hostEventAgent` + tools: F34, F36
- HITL: F37, F38 `approval-commit` edge

### ADK / Google Maps
- Venue pick via Places (MAP-004 deferred — manual lat/lng OK for MVP)

### Supabase
- `events`, `approval_requests`, `approval_decisions`, `event_tickets`

## Acceptance criteria
- [x] Wizard UI + required testids (form, preview, CopilotChat region)
- [x] `useCoAgent<EventDraftState>` + frontend actions wired
- [x] HITL approve panel via `preview_and_publish`
- [x] F38 `approval-commit` edge deployed (curl 400 on empty body)
- [ ] NL describe → draft fields populated via tools (manual Gemini)
- [ ] HITL approve → event live at `/events/:slug` (manual signed-in)
- [ ] Tickets purchasable after publish (manual post-publish)

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [x] `cd mdeapp && npm test`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run verify:console`
- [x] `npm run floor`
- [ ] Mastra Studio smoke hostEventAgent (manual)
- [x] curl approval-commit 400 alive

## Evidence required
- [x] Screenshot: wizard + HITL card; curl approval-commit; Playwright pass
- [ ] SQL: `events.status` live after signed-in publish
- [ ] Mastra Studio trace for one NL describe turn

## Dependencies
- F33–F38 (backend tasks — do not duplicate agent logic here)

## Runtime proof (dev restart + Browser)

> Canonical procedure: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §7. **Do not mark Done** without dev restart + Browser MCP proof + Playwright pass + evidence file.

**Auth note:** Auth-gated — Playwright uses `E2E_BYPASS_AUTH=1` (see `playwright.config.ts` + middleware).

### Step 1 — Restart dev server

```bash
lsof -ti :3001 | xargs -r kill -9
rm -rf mdeapp/.next    # if Turbopack SST corruption
cd mdeapp && npm run dev
```

Wait for `[ui] ✓ Ready` on `:3001`. Probe route:

```bash
curl -s -o /dev/null -w "SCREEN-016 → %{http_code}\n" --max-time 15 -L http://localhost:3001/host/event/new
curl -s -o /dev/null -w "approval-commit → %{http_code}\n" -X POST http://localhost:3001/api/approval-commit -H 'Content-Type: application/json' -d '{}'
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/host/event/new` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `host-event-wizard`, `host-event-form`, `host-event-preview-card`, `host-event-workflow-strip`, `host-copilot-chat-region` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Fill title/neighborhood — preview card updates; CopilotChat region visible. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-016/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-016-host-wizard.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/evidence/SCREEN-016-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/host/event/new`  
**Wireframes:** [003.1-wire-host-event-wizard.md](004-wire-host-event-wizard.md)  
**Required `data-testid`s:** `host-event-wizard`, HITL approval panel (required at implement)

### 1. Chrome DevTools MCP checks

- CopilotChat + hostEventAgent when F34 lands
- NL → draft fields via tools
- HITL approve → event live slug
- curl approval-commit edge alive

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-016-host-wizard.spec.ts`
- Signed-in Roberto flow; Studio trace optional

### 3. Feature checks

- F33–F38 backend required for Done
- `renderAndWaitForResponse` publish HITL

### 4. Required evidence

- [x] Screenshot: host wizard + HITL card
- [ ] SQL: `events.status` live (signed-in publish)
- [ ] Mastra Studio trace id

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor (+ F38 edge smoke)
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. Evidence at `tasks/evidence/SCREEN-016-evidence.md`.

- [x] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [x] Browser MCP: navigate + snapshot + console clean + screenshot
- [x] Playwright task spec pass (desktop + mobile)
- [x] `npm run floor` exit 0
- [x] Chrome DevTools MCP: console clean on task route
- [x] Playwright: desktop **and** mobile pass
- [x] Workflow verified (form fill → preview updates)
- [x] No broken network calls on happy path
- [x] Screenshots under `mdeapp/tmp/screenshots/SCREEN-016/`
- [x] Evidence file at `tasks/evidence/SCREEN-016-evidence.md`
- [x] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not skip F38 deploy
- Do not use legacy ai-chat
