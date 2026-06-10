---
id: SCREEN-006
title: Event Card In-Thread Polish
status: Done
priority: P0
phase: MVP Phase 3
effort: 3-4h
feature_group: "003"
depends_on:
  - F49
  - F15
  - F25
  - SCREEN-004
blocks:
  - SCREEN-014
  - SCREEN-009
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - shadcn
  - building-components
wireframes:
  - 003-wire-event-discovery.md
primary_wire: 003-wire-event-discovery.md
related_specs:
  - 003-scr-event-detail-page.md
  - 003-events-README.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../evidence/SCREEN-006-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-006-*.spec.ts
path: /
---

# SCREEN-006 — Event Card In-Thread Polish

> **Events group 003:** [003-events-README.md](003-events-README.md) · Wire: [003-wire-event-discovery.md](003-wire-event-discovery.md) · Next: [003-scr-event-detail-page.md](003-scr-event-detail-page.md) (SCREEN-014)

## Goal
Inline `EventCard` in chat with date, venue, price, Buy tickets CTA + map pin.

## User story
As **Andrés**, I want to see salsa events as cards with prices in chat, so I can buy without hunting URLs.

## Screen / path
`/` — `search-tool-renders.tsx` event branch

## Wireframe source
- [003-wire-event-discovery.md](003-wire-event-discovery.md)

## Current status
**Done** — `EventCard` in `components/copilot/event-card.tsx`; `search-tool-renders.tsx` generative render; event map pins; e2e `SCREEN-006`. Evidence: [`../evidence/SCREEN-006-evidence.md`](../evidence/SCREEN-006-evidence.md).

## Build scope

### Frontend
- **Shipped** `components/copilot/event-card.tsx` (inline card + testids)
- **Shipped** `search-tool-renders.tsx` for `search-events` tool
- Pin category `event` + numbered markers; Details → SCREEN-007 venue sheet

### CopilotKit
- Mirror `search-events` tool with generative render (F49 pattern)

### Mastra
- `eventAgent`, `search-events`, `event-discovery-workflow` (existing — F15 code shipped)

### ADK / Google Maps
- Venue lat/lng from `events` / `event_venues` — pin sync like rentals

### Supabase
- `events`, `event_tickets`, `event_venues` — read via tool

## Acceptance criteria
- [x] "salsa Friday" query returns ≥1 EventCard
- [x] Buy tickets CTA routes to `/events/[id]` or in-chat checkout path
- [x] Event pins on map with attribution if grounded
- [x] Pin/card sync works

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [x] `cd mdeapp && npm test`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run verify:console`
- [x] `npm run floor`
- [x] `npm run smoke:map-pins` (event query)
- [x] Vitest: event card render from tool JSON

## Evidence required
- [x] Screenshot: event cards + map pins; npm test event tool tests pass

## Dependencies
- F49 ✅, F15 ✅ (code), F25 (component spec — implement here)

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
curl -s -o /dev/null -w "SCREEN-006 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `event-card` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Event cards render in chat; event pins on map. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-006/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-006-event-card.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/evidence/SCREEN-006-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` event tool render  
**Wireframes:** [003-wire-event-discovery.md](003-wire-event-discovery.md)  
**Required `data-testid`s:** `event-card` (required at implement), map pins category event

### 1. Chrome DevTools MCP checks

- Query "salsa Friday" → ≥1 event card
- Buy tickets CTA visible
- Event pins on map; card ↔ pin sync
- Tool output matches F15 JSON shape

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-006-event-card.spec.ts`
- Event query + card visibility + pin count > 0
- Screenshot event cards + map

### 3. Feature checks

- Generative render for `search-events`
- CTA routes to SCREEN-009 or `/events/[slug]`

### 4. Required evidence

- [x] Screenshot: event cards + map pins
- [x] Vitest event card render tests pass
- [x] Playwright event query workflow pass

**Commands (task bundle):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. Evidence at `tasks/evidence/SCREEN-006-evidence.md`.

- [x] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [x] Browser MCP: navigate + snapshot + console clean + screenshot
- [x] Playwright task spec pass (desktop + mobile)
- [x] `npm run floor` exit 0
- [x] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [x] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [x] Workflow verified (user action → expected UI → backend proof if applicable)
- [x] No broken network calls on happy path
- [x] Screenshots under `mdeapp/tmp/screenshots/SCREEN-006/`
- [x] Evidence file at `tasks/evidence/SCREEN-006-evidence.md`
- [x] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not rebuild eventAgent
