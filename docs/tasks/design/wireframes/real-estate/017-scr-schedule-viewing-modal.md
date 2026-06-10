---
id: SCREEN-008
linear: SAN-262
title: Schedule Viewing Modal (HITL Lead)
status: Done
priority: P0
phase: MVP Phase 2
effort: 3-4h
depends_on:
  - SCREEN-005
  - SCREEN-007
  - F47
  - F12
blocks:
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - copilotkit-agui
  - mastra
  - shadcn
wireframes:
  - 010-wire-booking-checkout.md
  - 009-wire-rental-search.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-008-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-008-*.spec.ts
path: modal
---

# SCREEN-008 — Schedule Viewing Modal (HITL Lead)

## Goal
HITL modal → `chat-lead-capture` edge → confirmation card in thread. **MVP gate G2.**

## User story
As **Camila**, I want to pick a viewing time and submit my contact info, so the landlord gets a lead without WhatsApp.

## Screen / path
Modal on `/` (and from venue sheet)

## Wireframe source
- [009-wire-booking-checkout.md](010-wire-booking-checkout.md)
- [005-wire-rental-search.md](009-wire-rental-search.md)

## Current status
**missing**

## Build scope

### Frontend
- **Create** `components/modals/schedule-viewing-modal.tsx` (`ui/dialog.tsx`)
- Fields: name, email, phone, preferred datetime, listing id
- Success/error states

### CopilotKit
- `renderAndWaitForResponse` pattern OR modal triggered from card with agent acknowledgment message
- Optional `useCopilotAction` mirror for `capture_lead` when tool lands

### Mastra
- **New tool** `capture_lead` (thin) → POST edge — implement in F47, wire UI here
- `rentalAgent` invokes on confirm

### ADK / Google Maps
- None

### Supabase
- `leads` — insert **via edge only** (F12, F47)
- No browser direct INSERT

## Acceptance criteria
- [ ] Modal validates required fields
- [ ] Submit creates row in `leads` (local/staging)
- [ ] Confirmation card appears in CopilotChat
- [ ] No OTA / external redirect
- [ ] Idempotent retry safe

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Edge fn smoke POST chat-lead-capture
- [ ] Vitest: modal form validation
- [ ] G2: prod lead row (when deployed)

## Evidence required
- [ ] ['Screenshot: modal + confirmation card', 'Supabase: leads row id', 'curl edge 200']

## Dependencies
- SCREEN-005, SCREEN-007, F47, F12 ✅

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
curl -s -o /dev/null -w "SCREEN-008 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
curl -s -o /dev/null -w "leads → %{http_code}\n" -X POST http://localhost:3001/api/leads/schedule-viewing -H 'Content-Type: application/json' -d '{}'
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `schedule-viewing-modal`, `rental-schedule-cta` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Click `rental-schedule-cta` → `schedule-viewing-modal` opens; submit mocked. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-008/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-008-schedule-viewing.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-008-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** modal on `/`  
**Wireframes:** 06-booking-checkout, 02-rental-search  
**Required `data-testid`s:** `schedule-viewing-modal`, `rental-schedule-cta`

### 1. Chrome DevTools MCP checks

- Open from card CTA; form fields visible
- Validation on empty submit
- Submit POST `chat-lead-capture` edge (after F47) → 200
- Confirmation in CopilotChat thread
- No browser service role

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-008-schedule-viewing.spec.ts`
- Fill form → submit → confirmation (mock or staging edge)
- Network: edge URL 200, no 5xx

### 3. Feature checks

- **G2 gate:** `leads` row via edge only
- Idempotent retry safe
- HITL optional via `renderAndWaitForResponse`

### 4. Required evidence

- [ ] Screenshot: modal + confirmation card in thread
- [ ] Supabase: `leads` row id (staging/prod)
- [ ] curl / edge POST chat-lead-capture 200

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor (+ F47 edge smoke when unblocked)
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-008-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-008/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-008-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not use service role in browser
- Do not port legacy ai-chat lead flow
