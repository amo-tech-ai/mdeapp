---
id: SCREEN-015
title: My Tickets + QR
status: Partial
priority: P0
phase: MVP Phase 3
effort: 3-4h
depends_on:
  - SCREEN-009
  - EVT-01
skill:
  - mde-task-lifecycle
  - shadcn
wireframes:
  - 015-wire-my-tickets-qr.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../../evidence/SCREEN-015-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-015-*.spec.ts
path: /me/tickets
---

# SCREEN-015 — My Tickets + QR

## Goal
Door-ready ticket list + QR per order after paid checkout.

## User story
As **Andrés**, I want a QR on my phone at the venue, so entry doesn't require email PDF hunting.

## Screen / path
`/me/tickets`, `/me/tickets/[id]`

## Wireframe source
- [015-wire-my-tickets-qr.md](015-wire-my-tickets-qr.md)

## Current status
**missing**

## Build scope

### Frontend
- **Create** `app/me/tickets/page.tsx`, `app/me/tickets/[id]/page.tsx`
- QR render from order payload (webhook-written)

### CopilotKit
- Link from confirmation card in thread

### Mastra
- None

### ADK / Google Maps
- None

### Supabase
- `event_orders` — user read own; optional token access for gate staff later

## Acceptance criteria
- [ ] Paid order shows QR
- [ ] Unpaid/pending shows clear state
- [ ] Works mobile viewport

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Playwright: ticket page after test checkout

## Evidence required
- [ ] ['Screenshot: QR on /me/tickets/[id]', 'event_orders.status=paid row']

## Dependencies
- SCREEN-009, EVT-01

## Runtime proof (dev restart + Browser)

> Canonical procedure: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §7. **Do not mark Done** without dev restart + Browser MCP proof + Playwright pass + evidence file.

### Step 1 — Restart dev server

```bash
lsof -ti :3001 | xargs -r kill -9
rm -rf mdeapp/.next    # if Turbopack SST corruption
cd mdeapp && npm run dev
```

Wait for `[ui] ✓ Ready` on `:3001`. Probe route:

```bash
curl -s -o /dev/null -w "SCREEN-015 → %{http_code}\n" --max-time 15 -L http://localhost:3001/me/tickets
curl -s -o /dev/null -w "wallet → %{http_code}\n" http://localhost:3001/api/tickets/wallet
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/me/tickets` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `my-tickets-empty`, `my-tickets-qr`, `my-tickets-detail` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Empty wallet list; QR detail at `/me/tickets/[id]?token=` (mocked in e2e). |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-015/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-015-tickets.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-015-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/me/tickets`  
**Wireframes:** 20-my-tickets-qr  
**Required `data-testid`s:** `my-tickets-qr` (required at implement)

### 1. Chrome DevTools MCP checks

- QR renders for paid order
- Auth required
- Empty state when no tickets

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-015-tickets.spec.ts` (post SCREEN-009)

### 3. Feature checks

- Depends G1 checkout complete

### 4. Required evidence

- [ ] Screenshot: QR ticket render
- [ ] Order id reference in evidence

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-015-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-015/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-015-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not build scanner app (Patricia admin later)
