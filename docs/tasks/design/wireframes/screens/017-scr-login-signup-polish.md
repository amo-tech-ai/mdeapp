---
id: SCREEN-017
title: Login / Signup Polish
status: In Review
completed_at: 2026-06-02
priority: P1
phase: mvp
persona: sanjiovani
project: sofia-platform
milestone: P1
imp: "087"
linear: SAN-112
percent: 100
blocked_by: []
blocks: []
effort: 2h
depends_on:
  - F08
skill:
  - mde-task-lifecycle
  - shadcn
  - web-design-guidelines
  - ui-ux-pro-max
wireframes:
  - 024-wire-auth-login-signup.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-017-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-017-*.spec.ts
path: /login, /signup
---

# SCREEN-017 — Login / Signup Polish

## Goal
Align auth pages with wireframe 24 + Paisa tokens (F07); clear return URLs for checkout/leads.

## User story
As **Andrés**, I want a fast login before checkout, so I return to the ticket modal after auth.

## Screen / path
`/login`, `/signup`

## Wireframe source
- [024-wire-auth-login-signup.md](024-wire-auth-login-signup.md)

## Current status
**partial** — F08 functional pages exist.

## Build scope

### Frontend
- Polish `app/login/page.tsx`, `app/signup/page.tsx`, `auth-email-form.tsx`
- Redirect param support (`?next=/events/...`)

### CopilotKit
- None

### Mastra
- None

### ADK / Google Maps
- None

### Supabase
- `auth.users` via Supabase Auth ✅

## Acceptance criteria
- [ ] Login/signup match brand tokens
- [ ] `next` redirect works after auth
- [ ] English only UI copy

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Manual auth flow
- [ ] Playwright login spec if exists

## Evidence required
- [ ] ['Screenshot: login + signup', 'Browser: redirect after login']

## Dependencies
- F08 ✅

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
curl -s -o /dev/null -w "SCREEN-017 → %{http_code}\n" --max-time 15 -L http://localhost:3001/login
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/login` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: auth form fields + submit buttons (add at implement) |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Login form renders; `next=` redirect param preserved. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-017/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-017-auth.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-017-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/login`, `/signup`  
**Wireframes:** 24-auth-login-signup  
**Required `data-testid`s:** auth form fields, submit buttons (required at implement)

### 1. Chrome DevTools MCP checks

- Login/signup forms render
- Error states on bad credentials
- Redirect after success
- a11y: labels on inputs

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-017-auth.spec.ts`

### 3. Feature checks

- F08 auth; English only

### 4. Required evidence

- [ ] Screenshot: login + signup
- [ ] Console clean on auth routes

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-017-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-017/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-017-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- No OAuth providers unless already configured
