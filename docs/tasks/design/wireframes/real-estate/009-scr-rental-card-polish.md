---
id: SCREEN-005
linear: SAN-242
title: Rental Card Polish + CTAs
status: Done
completed_at: 2026-05-24
scope: chat-only
out_of_scope: REAL-011 /rentals catalog (WIRE-015) — separate task SAN-478
priority: P0
phase: MVP Phase 2
effort: 3-4h
depends_on:
  - F49
  - F50
  - SCREEN-004
  - F24
blocks:
  - SCREEN-007
  - SCREEN-008
  - SCREEN-011
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - shadcn
  - building-components
wireframes:
  - 009-wire-rental-search.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-005-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-005-*.spec.ts
path: /
---

# SCREEN-005 — Rental Card Polish + CTAs

## Goal
Upgrade `RentalCard` to wireframe quality: photo, price pill, Schedule + Save CTAs, pin sync preserved.

## User story
As **Camila**, I want to schedule a viewing from the rental card in chat, so I don't leave the thread.

## Screen / path
`/` — inline in CopilotChat via `search-tool-renders.tsx`

## Wireframe source
- [005-wire-rental-search.md](009-wire-rental-search.md)

## Current status
**Done (chat scope)** — `RentalCard` + CTAs + pin sync shipped; evidence [`tasks/evidence/SCREEN-005-evidence.md`](../../evidence/SCREEN-005-evidence.md). **`/rentals` browse is REAL-011 (SAN-478)**, not this task.

## Build scope

### Frontend
- `components/copilot/rental-card.tsx` — CTAs, photo slot, price formatting COP
- `components/copilot/search-tool-renders.tsx` — wire CTA handlers
- Keep `data-pin-id`, `data-testid="rental-card"`, F50 selection

### CopilotKit
- `useCopilotAction` render for `search-rentals` (existing)
- Schedule → opens SCREEN-008 modal via local state or HITL action name match

### Mastra
- `rentalAgent` + `search-rentals` tool (existing — reference F17/F46, do not duplicate)

### ADK / Google Maps
- Card click → `MapContext.panToPin` (F50)
- Numbered pins unchanged

### Supabase
- Read `apartments` via tool only

## Acceptance criteria
- [ ] ≥3 rental cards show photo/price/neighborhood
- [ ] "Schedule viewing" opens modal hook (SCREEN-008 can ship after)
- [ ] "Save" disabled or stub with tooltip until SCREEN-011
- [ ] Card #N ↔ pin #N sync via `smoke:f50-pin-sync`

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run smoke:map-pins`
- [ ] `npm run smoke:f50-pin-sync`
- [ ] Vitest: RentalCard renders CTAs

## Evidence required
- [ ] ['Screenshot: rental cards with CTAs', 'smoke:f50-pin-sync terminal output']

## Dependencies
- F49 ✅, F50 ✅, SCREEN-004, F24 (revise — UI covered here)

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
curl -s -o /dev/null -w "SCREEN-005 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
npm run smoke:f50-pin-sync
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `rental-card`, `rental-schedule-cta`, `rental-save-cta`, `[data-pin-id]` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Rental cards render after query; click card → pin highlights. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-005/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-005-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` inline CopilotChat tool render  
**Wireframes:** 02-rental-search  
**Required `data-testid`s:** `rental-card`, `rental-schedule-cta`, `rental-save-cta`, `data-pin-id`

### 1. Chrome DevTools MCP checks

- Rental query → ≥3 cards with photo/price/neighborhood
- Click Schedule → `schedule-viewing-modal` opens
- Save disabled with tooltip (until SCREEN-011)
- Card click → map pin focus

### 2. Playwright checks

- `npm run smoke:f50-pin-sync` (card ↔ pin)
- **Add:** `e2e/screens/SCREEN-005-rental-card.spec.ts` — CTA click opens modal
- Desktop + mobile card layout screenshot

### 3. Feature checks

- F50 pin sync preserved
- Schedule hooks SCREEN-008 modal
- No external OTA as primary CTA

### 4. Required evidence

- [ ] `npm run smoke:f50-pin-sync` terminal output
- [ ] Screenshot: rental cards with CTAs
- [ ] Screenshot: schedule modal open
- [ ] Playwright desktop + mobile pass

**Commands (task bundle):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:f50-pin-sync && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-005-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-005/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-005-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not rebuild search-rentals tool
- Do not add OTA external links
