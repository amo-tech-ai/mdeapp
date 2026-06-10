---
id: SCREEN-010
title: Map Exploration Right Panel
status: Not Started
priority: P1
phase: mvp
persona: camila
project: camila-discovery
milestone: P1
imp: "088"
linear: SAN-111
percent: 0
blocked_by: []
blocks: []
effort: 2-3h
depends_on:
  - MAP-001
  - MAP-008
  - F49
depends_on_optional_for:
  - SCREEN-021
skill:
  - mde-task-lifecycle
  - mde-maps
  - copilotkit-develop
  - copilotkit-agui
  - google-agents-cli-adk-code
  - testing
  - webapp-testing
verified_against: audit/37-screen-coffee.md
wireframes:
  - 011-wire-map-exploration.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-010-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-010-*.spec.ts
path: / (right panel)
---

# SCREEN-010 — Map Exploration Right Panel

## Goal
Polish right map column: layer toggles, empty state, pin legend, attribution placement per wireframe 08.

## User story
As a **Tourist**, I want map layers and clear empty states, so I understand what's on the map during chat.

## Screen / path
`/` — right column `chat-map-panel.tsx` / `ChatMap.tsx`

## Wireframe source
- [011-wire-map-exploration.md](011-wire-map-exploration.md)

## Current status
**partial** — ChatMap + pins work; no layer controls / empty copy.

## Build scope

### Frontend
- `components/chat/chat-map-panel.tsx` — header, layer chips
- `components/maps/map-layer-controls.tsx` **new** (MAP-007 scope)
- Empty state when zero pins

### CopilotKit
- Read pin count from MapContext for empty state

### Mastra
- None

### ADK / Google Maps
- `AdvancedMarker` + `mapId` (MAP-008 ✅)
- `GroundingAttribution` visible when ADK pins (MAP-002 ✅)
- MAP-004 Places deferred

### Supabase
- None

## Acceptance criteria
- [ ] Map shows empty state before first search
- [ ] Rental/event pins render with mapId
- [ ] Grounding attribution visible on ADK results
- [ ] Layer toggle UI present (can stub categories)

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run smoke:map-pins`
- [ ] `npm run smoke:grounding-attribution`
- [ ] `npm run verify:grounding`
- [ ] `npm run test:e2e:grounding`

## Evidence required
- [ ] ['Screenshot: map with pins + attribution', 'Screenshot: empty state']

## Dependencies
- MAP-001 ✅, MAP-008 ✅, F49 ✅, SCREEN-018

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
curl -s -o /dev/null -w "SCREEN-010 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
npm run verify:grounding
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `map-panel`, `chat-map`, `grounding-attribution` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Map column visible; grounded search shows `grounding-attribution`. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-010/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-010-map-panel.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-010-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` right column  
**Wireframes:** 08-map-exploration  
**Required `data-testid`s:** `map-panel`, `chat-map`, `grounding-attribution`, map layer controls (TBD)

### 1. Chrome DevTools MCP checks

- Empty state before first search
- Pins render with mapId
- Grounding attribution on ADK results
- Layer toggle UI present (stub OK)

### 2. Playwright checks

- `npm run test:e2e:grounding`
- `npm run smoke:grounding-attribution`
- **Add:** `e2e/screens/SCREEN-010-map-panel.spec.ts`

### 3. Feature checks

- MAP-008 mapId on Map parent
- MAP-002 attribution component

### 4. Required evidence

- [ ] Screenshot: map empty state
- [ ] Screenshot: pins + grounding attribution
- [ ] `npm run verify:grounding` exit 0

**Commands (task bundle):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:grounding-attribution && npm run verify:grounding && npm run test:e2e:grounding && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-010-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-010/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-010-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not implement MAP-009 clustering in this task
