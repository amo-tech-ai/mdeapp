---
id: SCREEN-018
linear: SAN-489
title: Mobile Responsive 3-Panel Shell
status: Done
priority: P0
phase: MVP Phase 1
effort: 3-4h
depends_on:
  - F48
  - MAP-007B
  - SCREEN-001
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - mde-maps
  - shadcn
wireframes:
  - 002-wire-chat-chrome.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-018-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-018-*.spec.ts
path: /
---

# SCREEN-018 — Mobile Responsive 3-Panel Shell

## Goal
Mobile: nav drawer + chat primary + map FAB/sheet without click interception bugs.

## User story
As **Camila** on mobile, I want to open the map from a FAB, so I see pins without losing chat.

## Screen / path
`/` — `<390px` viewport

## Wireframe source
- [002-wire-chat-chrome.md](002-wire-chat-chrome.md)

## Current status
**partial** — `map-mobile-sheet.tsx` exists; needs polish (Mindtrip audit: force click / z-index).

## Build scope

### Frontend
- `components/chat/map-mobile-sheet.tsx` — FAB, sheet, focus trap
- `chat-nav-drawer.tsx` — hamburger in header (GeoChatShell)
- Test z-index above CopilotKit overlays

### CopilotKit
- Ensure chat input not blocked when sheet closed

### Mastra
- None

### ADK / Google Maps
- Map resizes correctly in sheet (`MapResizeSignal`)

### Supabase
- None

## Acceptance criteria
- [ ] 390px: chat usable, map opens via FAB
- [ ] Pin tap works inside sheet (no overlay intercept)
- [ ] Nav drawer accessible

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run test:e2e:mobile`
- [ ] Manual iPhone viewport

## Evidence required
- [ ] ['Screenshot: mobile chat + map sheet', 'Playwright mobile spec pass']

## Dependencies
- F48 ✅, MAP-007B ✅, SCREEN-001

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
curl -s -o /dev/null -w "SCREEN-018 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
npm run test:e2e:mobile
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `map-mobile-controls`, `map-sheet-trigger`, `map-sheet-content`, `nav-drawer-trigger` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Resize to 390×844 — mobile map sheet + nav drawer; no input overlap. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-018/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-018-mobile-shell.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-018-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` <390px  
**Wireframes:** 14-chat-chrome  
**Required `data-testid`s:** `map-mobile-controls`, `map-sheet-trigger`, `map-sheet-content`, `nav-drawer-trigger`

### 1. Chrome DevTools MCP checks

- Nav drawer + chat primary + map FAB/sheet
- CopilotKit input not covered by sheet
- z-index: no click interception on send button
- Resize 390×844 snapshot

### 2. Playwright checks

- `npm run test:e2e:mobile`
- **Add:** `e2e/screens/SCREEN-018-mobile-shell.spec.ts`
- Open map sheet → chat input still clickable

### 3. Feature checks

- Partial: `map-mobile-sheet.tsx` on disk — polish pass required

### 4. Required evidence

- [ ] Screenshot: mobile chat + map sheet open
- [ ] `npm run test:e2e:mobile` pass

**Commands (task bundle):**

```bash
cd mdeapp && npm run test:e2e:mobile && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-018-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-018/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-018-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not build separate mobile app route
