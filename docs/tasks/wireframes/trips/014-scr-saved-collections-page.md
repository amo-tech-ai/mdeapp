---
id: SCREEN-011
linear: SAN-253
title: Saved Collections Page
status: Done
priority: P1
phase: MVP Phase 4
effort: 4-5h
depends_on:
  - SCREEN-005
  - SCREEN-002
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - shadcn
  - mastra
wireframes:
  - 014-wire-saved-collections.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-011-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-011-*.spec.ts
path: /saved
---

# SCREEN-011 — Saved Collections Page

## Goal
`/saved` page listing hearts/collections with map filter hook.

## User story
As **Camila**, I want my saved apartments in one place, so I compare shortlists across chat sessions.

## Screen / path
`/saved`

## Wireframe source
- [014-wire-saved-collections.md](014-wire-saved-collections.md)

## Current status
**missing** — tables exist; no route.

## Build scope

### Frontend
- **Create** `app/saved/page.tsx`
- Reuse/adapt `components/cards/SavedItemsCard.tsx`
- Collection grid + empty state

### CopilotKit
- Optional link from nav rail (SCREEN-002)

### Mastra
- `save_place` tool (new Phase 4) — reference WORKFLOW-004, don't block page shell

### ADK / Google Maps
- Optional mini-map with collection pins

### Supabase
- `saved_places`, `collections` — RLS user owns rows ✅
- Verify policies before ship

## Acceptance criteria
- [ ] `/saved` renders authenticated user's saves
- [ ] Empty state when no saves
- [ ] User A cannot see User B saves (RLS)
- [ ] Nav link from SCREEN-002 enabled

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run verify:supabase`
- [ ] Playwright: /saved authenticated

## Evidence required
- [ ] ['Screenshot: /saved with items', 'RLS test note']

## Dependencies
- SCREEN-005 (Save CTA), SCREEN-002

## Runtime proof (dev restart + Browser)

> Canonical procedure: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §7. **Do not mark Done** without dev restart + Browser MCP proof + Playwright pass + evidence file.

**Auth note:** Auth-gated — restart with `E2E_BYPASS_AUTH=1 npm run dev:ui` for Browser/Playwright, or sign in as test user.

### Step 1 — Restart dev server

```bash
lsof -ti :3001 | xargs -r kill -9
rm -rf mdeapp/.next    # if Turbopack SST corruption
cd mdeapp && npm run dev
```

Wait for `[ui] ✓ Ready` on `:3001`. Probe route:

```bash
curl -s -o /dev/null -w "SCREEN-011 → %{http_code}\n" --max-time 15 -L http://localhost:3001/saved
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/saved` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `saved-page` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Saved collections grid or empty state renders. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-011/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-011-saved.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-011-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/saved`  
**Wireframes:** 07-saved-collections  
**Required `data-testid`s:** `saved-page`, collection grid (required at implement)

### 1. Chrome DevTools MCP checks

- Authenticated user sees own saves
- Empty state when none
- User A cannot see User B (RLS)
- Nav link from SCREEN-002 enabled when Done

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-011-saved.spec.ts` (auth fixture)
- `/saved` HTTP 200 authenticated

### 3. Feature checks

- `saved_places`, `collections` RLS
- Save CTA from SCREEN-005 enabled when Done

### 4. Required evidence

- [ ] Screenshot: `/saved` with items
- [ ] Screenshot: empty saved state
- [ ] RLS isolation test note

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:supabase && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-011-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-011/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-011-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- No destructive migrations
