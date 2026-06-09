---
id: SCREEN-001
linear: SAN-232
title: Home Chat Chrome (integration)
status: Done
completed_at: 2026-05-24
priority: P0
phase: MVP Phase 1 — visual shell
effort: 2-3h
depends_on:
  - F48
  - MAP-007B
blocks:
  - SCREEN-002
  - SCREEN-003
  - SCREEN-004
  - SCREEN-018
skill:
  - mde-task-lifecycle
  - copilotkit
  - copilotkit-develop
  - copilotkit-agui
  - shadcn
  - ui-ux-pro-max
wireframes:
  - 001-wire-home-chat.md
  - 002-wire-chat-chrome.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-001-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-001-*.spec.ts
path: /
---

# SCREEN-001 — Home Chat Chrome (integration)

## Goal
Integrate nav rail, query bar, and workflow strip into the live `/` ChatCanvas so Camila sees a cohesive Mindtrip-style workspace — not disconnected stubs.

## User story
As **Camila**, I want the home chat to feel like one product shell (nav · chat · map), so I trust the AI workspace before I search for rentals.

## Screen / path
`/`

## Wireframe source
- [001-wire-home-chat.md](001-wire-home-chat.md)
- [002-wire-chat-chrome.md](002-wire-chat-chrome.md)

## Current status
**In Progress** — implementation partial on disk; **visual + Playwright gate not complete** per SCREEN-TESTING-STANDARD.md. Prior evidence: [`notes/SCREEN-001-005-evidence.md`](../notes/SCREEN-001-005-evidence.md) (unit/smoke only).

## Build scope

### Frontend
- Wire `ChatCanvas` to mount SCREEN-002/003/004 components in correct grid regions
- Ensure `chat-center-panel.tsx` scroll + sticky query bar layout
- Desktop: `240–280px | flex-1 | 360–420px` grid (already in `chat-canvas.tsx`)

### CopilotKit
- Confirm `layout.tsx` / page uses `agent="conciergeAgent"` on `/`
- No second chat route; `/chat` redirects to `/` if present

### Mastra
- No new agent — uses existing `conciergeAgent`

### ADK / Google Maps
- None — layout only

### Supabase
- None for this integration task

## Acceptance criteria
- [ ] Nav rail visible desktop (`lg+`) in left column
- [ ] Query bar sticky above CopilotChat center column
- [ ] Workflow strip slot renders (empty OK until SCREEN-004)
- [ ] Map column unchanged (F49 pins still work)
- [ ] `npm run dev` boot clean on `:3001`

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run smoke:map-pins`
- [ ] `npm run test:e2e:desktop`

## Evidence required
- [ ] Screenshot: full 3-panel `/` desktop
- [ ] Terminal: smoke:map-pins exit 0
- [ ] Browser: no console errors on load

## Dependencies
- F48 ✅ (Done — verify with smoke)
- MAP-007B ✅ (Done)
- Blocks: SCREEN-002, SCREEN-003, SCREEN-004, SCREEN-018

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
curl -s -o /dev/null -w "SCREEN-001 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
curl -s -o /dev/null -w "copilotkit → %{http_code}\n" -X POST http://localhost:3001/api/copilotkit -H 'Content-Type: application/json' -d '{}'
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `chat-canvas`, `nav-rail`, `center-chat-panel`, `copilot-chat-region`, `map-panel`, `chat-query-bar`, `workflow-progress-strip` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Load home — confirm 3-panel chrome (nav · chat · map). |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-001/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-001-home-chrome.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-001-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/`  
**Wireframes:** 01-home-chat, 14-chat-chrome  
**Required `data-testid`s:** `chat-canvas`, `nav-rail`, `center-chat-panel`, `copilot-chat-region`, `map-panel`, `chat-query-bar`, `workflow-progress-strip`

### 1. Chrome DevTools MCP checks

- Open `http://localhost:3001/`
- Snapshot: 3 columns visible at 1280px (nav · chat · map)
- Console: 0 critical errors on load
- Network: `/api/copilotkit` reachable (POST may 400 on empty body — not 5xx on chat turn)
- Layout: no horizontal scroll; grid ~240|flex|360px
- Map: `[data-testid="chat-map"]` visible desktop
- Screenshot: `tmp/screenshots/SCREEN-001/desktop-1280.png`, `mobile-390.png`

### 2. Playwright checks

- `npm run test:e2e:desktop` — nav + center + map regions
- `npm run test:e2e:mobile` — drawer + map sheet not blocking input
- **Add:** `e2e/screens/SCREEN-001-home-chrome.spec.ts` — full-page screenshot
- Selectors: `[data-testid="chat-canvas"]`, `[data-testid="nav-rail"]`, `[data-testid="map-panel"]`

### 3. Feature checks

- Layout matches wireframe 01/14 (Mindtrip 3-panel)
- CopilotChat center column renders (`conciergeAgent`)
- Map column unchanged; pins still work after rental query
- Query bar + workflow strip slots present (no stub-only copy)

### 4. Required evidence

- [ ] `mdeapp/tmp/screenshots/SCREEN-001/desktop-1280.png`
- [ ] `mdeapp/tmp/screenshots/SCREEN-001/mobile-390.png`
- [ ] `npm run verify:console` exit 0 output
- [ ] `npm run smoke:map-pins` exit 0 output
- [ ] Playwright desktop + mobile pass

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run smoke:map-pins && npm run test:e2e:desktop && npm run test:e2e:mobile && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-001-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-001/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-001-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not build `/explore`, `/trips`, host wizard
- Do not reintroduce CopilotSidebar-only layout or legacy edge chat
- Do not duplicate F48 grid work
