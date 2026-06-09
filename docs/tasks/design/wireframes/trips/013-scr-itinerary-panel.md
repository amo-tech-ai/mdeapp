---
id: SCREEN-013
linear: SAN-251
title: Itinerary Panel
status: Partial
priority: P1
phase: MVP Phase 4
effort: 5-6h
depends_on:
  - SCREEN-012
skill:
  - mde-task-lifecycle
  - mastra
  - mde-maps
  - shadcn
wireframes:
  - 013-wire-itinerary-planner.md
  - 012-wire-trip-workspace.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-013-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-013-*.spec.ts
path: /trips/[id]
---

# SCREEN-013 — Itinerary Panel

## Goal
Trip workspace with day-grouped itinerary + map pins for scheduled items.

## User story
As **Camila**, I want viewing + event on a timeline, so I see conflicts before Saturday.

## Screen / path
`/trips/[id]` — Itinerary tab

## Wireframe source
- [010-wire-itinerary-planner.md](013-wire-itinerary-planner.md)
- [012-wire-trip-workspace.md](012-wire-trip-workspace.md)

## Current status
**Partial (workspace stub)** — `app/trips/[id]/page.tsx` exists; itinerary panel not day-grouped. Playwright covers tabs shell only.

## Build scope

### Frontend
- **Create** `app/trips/[id]/page.tsx` with tabs (Ideas · Itinerary · Bookings stub)
- **Create** `components/trips/itinerary-panel.tsx`

### CopilotKit
- Optional chat entry "add to trip" from `/`

### Mastra
- `conciergeAgent` trip tools + logical conflict module (no new `timelineAgent` for MVP)
- Uses `trip_items`, `conflict_resolutions` ✅

### ADK / Google Maps
- MAP-011 routes deferred — static pins only MVP

### Supabase
- `trip_items` — group by `start_at`; no `trip_days` migration for MVP

## Acceptance criteria
- [ ] Items group by day
- [ ] Overlap shows conflict UI
- [ ] Map shows pins for scheduled items
- [ ] No `timeline_events` table — use `trip_items` only

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Unit: day grouping
- [ ] Playwright: trip workspace tabs

## Evidence required
- [ ] ['Screenshot: itinerary tab', 'Screenshot: conflict state']

## Dependencies
- SCREEN-012

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
curl -s -o /dev/null -w "SCREEN-013 → %{http_code}\n" --max-time 15 -L http://localhost:3001/trips
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/trips/[id]` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `itinerary-panel` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Itinerary panel with day groups visible. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-013/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-013-itinerary.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-013-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/trips/[id]`  
**Wireframes:** 05-itinerary-planner, 18-trip-workspace  
**Required `data-testid`s:** `itinerary-panel`, day groups (required at implement)

### 1. Chrome DevTools MCP checks

- Timeline/day groups render
- Back navigation to trips list

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-013-itinerary.spec.ts`

### 3. Feature checks

- Mastra timeline tools reference only for MVP shell

### 4. Required evidence

- [ ] Screenshot: itinerary timeline
- [ ] Playwright `/trips/[id]` pass

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-013-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-013/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-013-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not invent `timeline_events` schema
