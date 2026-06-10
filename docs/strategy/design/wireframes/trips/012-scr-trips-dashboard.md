---
id: SCREEN-012
linear: SAN-255
title: Trips Dashboard
status: Partial
priority: P1
phase: MVP Phase 4
effort: 4-5h
depends_on:
  - SCREEN-011
blocks:
  - SCREEN-013
skill:
  - mde-task-lifecycle
  - shadcn
  - copilotkit-develop
wireframes:
  - 012-wire-trips-dashboard.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-012-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-012-*.spec.ts
path: /trips
---

# SCREEN-012 — Trips Dashboard

## Goal
`/trips` list of user trips with status and entry to workspace.

## User story
As **Camila**, I want a trips hub for my Medellín move weekend, so I see all plans in one place.

## Screen / path
`/trips`

## Wireframe source
- [012-wire-trips-dashboard.md](012-wire-trips-dashboard.md)

## Current status
**Partial (dashboard shell shipped)** — `app/trips/page.tsx` + grid + empty/sign-in states; Playwright 3/3. **Remaining:** create trip from chat, richer card metadata, link from nav (Trips enabled when user has trips).

## Build scope

### Frontend
- **Create** `app/trips/page.tsx`
- Trip cards: title, dates, item count

### CopilotKit
- None for list page

### Mastra
- Optional read via server action

### ADK / Google Maps
- None

### Supabase
- `trips` ✅ — RLS user owns

## Acceptance criteria
- [x] `/trips` lists user's trips (when signed in)
- [x] Click navigates to `/trips/[id]`
- [x] Empty state + CTA to start from chat

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Playwright: /trips route 200

## Evidence required
- [ ] ['Screenshot: trips dashboard', 'Browser: navigation to trip detail']

## Dependencies
- SCREEN-011

## Runtime proof (dev restart + Browser)

> Canonical procedure: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §7. **Do not mark Done** without dev restart + Browser MCP proof + Playwright pass + evidence file.

**Auth note:** Auth-gated — `E2E_BYPASS_AUTH=1 npm run dev:ui` or signed-in session.

### Step 1 — Restart dev server

```bash
lsof -ti :3001 | xargs -r kill -9
rm -rf mdeapp/.next    # if Turbopack SST corruption
cd mdeapp && npm run dev
```

Wait for `[ui] ✓ Ready` on `:3001`. Probe route:

```bash
curl -s -o /dev/null -w "SCREEN-012 → %{http_code}\n" --max-time 15 -L http://localhost:3001/trips
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/trips` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `trips-dashboard` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Trips dashboard list or empty state; link to itinerary detail. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-012/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-012-trips.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-012-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/trips`  
**Wireframes:** 17-trips-dashboard  
**Required `data-testid`s:** `trips-dashboard` (required at implement)

### 1. Chrome DevTools MCP checks

- List UI renders authenticated
- Empty state
- Link to itinerary detail

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-012-trips.spec.ts`
- Route 200 + screenshot

### 3. Feature checks

- Depends SCREEN-011; Phase 4 retention

### 4. Required evidence

- [ ] Screenshot: trips dashboard
- [ ] Playwright `/trips` route pass

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-012-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-012/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-012-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not require `trip_days` table for MVP list
