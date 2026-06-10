---
id: SCREEN-009
linear: SAN-248
title: Booking Checkout Modal + Stripe
status: Partial
priority: P0
phase: MVP Phase 3
effort: 4-6h
depends_on:
  - SCREEN-006
  - SCREEN-014
  - EVT-01
  - F11
blocks:
  - SCREEN-015
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - copilotkit-agui
  - shadcn
wireframes:
  - 010-wire-booking-checkout.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-009-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-009-*.spec.ts
path: modal
---

# SCREEN-009 — Booking Checkout Modal + Stripe

## Goal
Tier picker → `ticket-checkout` edge → Stripe redirect. **MVP gate G1.**

## User story
As **Andrés**, I want to buy a ticket inside mdeai, so I never get sent to Expedia-style OTAs.

## Screen / path
Modal on `/` and `/events/[slug]`

## Wireframe source
- [009-wire-booking-checkout.md](010-wire-booking-checkout.md)

## Current status
**Partial (UI shipped, commerce blocked)** — modal + Stripe redirect + Playwright 3/3. **Do not mark Done** until webhook sets `event_orders.status=paid` (`npm run smoke:ticket-paid-proof`).

## Build scope

### Frontend
- **Create** `components/modals/booking-checkout-modal.tsx`
- Tier selection, quantity, buyer email
- Redirect to `stripe_session_url` from edge response

### CopilotKit
- Post-return: show confirmation card when success_url loads (poll or session id param)

### Mastra
- Thin `bookingAgent` optional — edge owns Stripe session creation

### ADK / Google Maps
- None

### Supabase
- `event_orders` pending via edge RPC
- `idempotency_keys` on retry

## Acceptance criteria
- [x] Modal never calls Stripe API from browser directly
- [x] POST ticket-checkout returns session URL
- [ ] Webhook sets `event_orders.status=paid` ← **blocks Done**
- [x] User returns to success URL with confirmation UX (`EventCheckoutNotice`)

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Stripe test mode checkout
- [ ] EVT-01 port verification
- [ ] Webhook signature test

## Evidence required
- [ ] ['Stripe test payment screenshot', 'event_orders paid row', 'Webhook log']

## Dependencies
- SCREEN-006, SCREEN-014, EVT-01, F11

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
curl -s -o /dev/null -w "SCREEN-009 → %{http_code}\n" --max-time 15 -L http://localhost:3001/events/reina-de-antioquia-2026-finals
curl -s -o /dev/null -w "checkout → %{http_code}\n" -X POST http://localhost:3001/api/tickets/checkout -H 'Content-Type: application/json' -d '{}'
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/events/reina-de-antioquia-2026-finals` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `booking-checkout-modal` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Open checkout modal from event detail — Stripe session handoff mocked. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-009/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-009-checkout.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-009-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** modal on `/` and `/events/[slug]`  
**Wireframes:** 06-booking-checkout  
**Required `data-testid`s:** `booking-checkout-modal` (required at implement)

### 1. Chrome DevTools MCP checks

- Tier picker + quantity + email
- POST ticket-checkout edge → Stripe session URL (never client-side Stripe API)
- Return URL shows confirmation
- Webhook sets `event_orders.status=paid` (test mode)

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-009-checkout.spec.ts`
- Stripe test mode checkout (EVT-01)
- Network: no direct api.stripe.com from browser except redirect

### 3. Feature checks

- **G1 gate:** EVT-01 + F11
- Idempotency keys on retry

### 4. Required evidence

- [ ] Stripe test payment screenshot
- [ ] `event_orders` paid row proof
- [ ] Webhook log snippet

**Commands (task bundle):**

```bash
cd mdeapp && npm run floor (+ EVT-01 smoke when unblocked)
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-009-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-009/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-009-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not create Checkout Session client-side
