---
id: SCREEN-003
linear: SAN-234
title: Chat Query Bar + Filter Chips
status: Done
completed_at: 2026-05-24
priority: P0
phase: MVP Phase 1
effort: 2-3h
depends_on:
  - SCREEN-001
  - F50
blocks:
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - copilotkit-agui
  - shadcn
wireframes:
  - 002-wire-chat-chrome.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-003-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-003-*.spec.ts
path: /
---

# SCREEN-003 — Chat Query Bar + Filter Chips

## Goal
Replace "filters coming soon" with clickable neighborhood/intent chips that update concierge working memory.

## User story
As **Camila**, I want to tap "Laureles" and "2BR" chips, so follow-up searches stay in context without retyping.

## Screen / path
`/` — sticky top of center column (`chat-query-bar.tsx`)

## Wireframe source
- [002-wire-chat-chrome.md](002-wire-chat-chrome.md)

## Current status
**In Progress** — chips on disk; visual/Playwright gate incomplete per SCREEN-TESTING-STANDARD.md.

## Build scope

### Frontend
- `components/chat/chat-query-bar.tsx` — chip row + active states
- Optional `components/chat/follow-up-chips.tsx` for post-result chips (minimal)

### CopilotKit
- `useCoAgent<ConciergeState>({ name: "conciergeAgent" })` — write filter fields to working memory
- Chips: neighborhood, price band, intent (rental | events | food)

### Mastra
- Extend `conciergeWorkingMemorySchema` in `concierge.ts` + `src/lib/types.ts` (keep in sync)

### ADK / Google Maps
- Optional: chip "Near map" uses `mapUi.viewport` from F50 — no new ADK calls

### Supabase
- None (memory in Mastra thread scope)

## Acceptance criteria
- [ ] ≥3 chips render on `/`
- [ ] Clicking chip toggles active state and updates agent state
- [ ] Next rental query respects selected neighborhood in tool filters
- [ ] Sticky bar does not overlap CopilotChat input

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Unit: chip toggle updates useCoAgent mock state
- [ ] `npm run smoke:map-pins` after Laureles chip + query

## Evidence required
- [ ] Screenshot: chips active state
- [ ] Browser: follow-up query scoped to Laureles
- [ ] Vitest: working memory schema sync

## Dependencies
- SCREEN-001, F50 ✅

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
curl -s -o /dev/null -w "SCREEN-003 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `chat-query-bar`, `filter-chip-laureles`, `filter-chip-poblado`, `filter-chip-2br`, `filter-chip-under-80`, `filter-chip-events` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Click a filter chip — chip active state updates. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-003/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-003-query-bar.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-003-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` sticky `chat-query-bar`  
**Wireframes:** 14-chat-chrome  
**Required `data-testid`s:** `chat-query-bar`, `filter-chip-laureles`, `filter-chip-poblado`, `filter-chip-2br`, `filter-chip-under-80`, `filter-chip-events`

### 1. Chrome DevTools MCP checks

- Click `filter-chip-laureles` → `data-active="true"`
- Toggle off → inactive
- Sticky bar does not overlap CopilotKit input (snapshot scroll)
- Follow-up rental query respects neighborhood (manual or Playwright)

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-003-query-bar.spec.ts`
- Click chips; assert `aria-pressed` / `data-active`
- Send rental query after chip; assert cards mention Laureles when applicable
- Mobile: chips wrap, no overflow

### 3. Feature checks

- ≥3 chips render
- `useCoAgent({ name: "conciergeAgent" })` updates `lastRentalQuery`
- Schema sync: `concierge.ts` ↔ `lib/types.ts`

### 4. Required evidence

- [ ] Screenshot: active filter chips
- [ ] Vitest `chat-filter-chips.test.ts` pass
- [ ] Playwright chip toggle pass

**Commands (task bundle):**

```bash
cd mdeapp && npm test && npm run verify:console && npm run smoke:map-pins && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-003-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-003/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-003-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not build full `/rentals` filter form
- Do not add i18n / Spanish strings (Phase 2+)
