---
id: SCREEN-019
linear: SAN-265
title: Loading / Error / Empty States
status: Done
priority: P1
phase: Cross-cutting
effort: 3-4h
depends_on:
  - SCREEN-001
  - SCREEN-005
  - SCREEN-006
blocks:
  - SCREEN-020
skill:
  - mde-task-lifecycle
  - shadcn
  - ui-ux-pro-max
wireframes: []
cross_cutting: true
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-019-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-019-*.spec.ts
path: all MVP surfaces
---

# SCREEN-019 — Loading / Error / Empty States

## Goal
Consistent skeletons, empty copy, and error recovery across chat, map, modals, and pages.

## User story
As **Camila**, I want clear feedback when search returns zero results, so I know to widen filters.

## Screen / path
`/`, modals, `/saved`, `/trips`, map panel

## Wireframe source
Cross-cutting — applies to all MVP surfaces. Layout reference: [INDEX.md](INDEX.md) (no single wire).

## Current status
**missing**

## Build scope

### Frontend
- Chat: message skeleton, tool-error chip with retry
- Map: empty state component in `chat-map-panel.tsx`
- Modals: inline errors on submit failure
- Nav: empty thread list copy

### CopilotKit
- Surface agent/tool errors as user-readable chips (no raw stack traces)

### Mastra
- Tool returns `{ error, code }` pattern — already spec'd

### ADK / Google Maps
- Quota exceeded → empty results + reason in metadata (MAP-002)

### Supabase
- None

## Acceptance criteria
- [ ] Zero rental results → empty card + suggestion chips
- [ ] Map empty before search → illustrated empty state
- [ ] Failed lead submit → toast + modal stays open
- [ ] No uncaught red console errors on happy path (`verify:console`)

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run verify:console`
- [ ] Vitest: empty state components

## Evidence required
- [ ] ['Screenshot: each empty state', 'verify:console output 0 critical']

## Dependencies
- SCREEN-001, SCREEN-005, SCREEN-006

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
curl -s -o /dev/null -w "SCREEN-019 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/ (+ `/me/tickets`, `/events/…` as applicable)` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: empty/error testids per surface (add at implement) |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Force empty/error states per surface — screenshot each. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-019/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-019-empty-error.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-019-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** cross-cutting `/`, cards, map  
**Wireframes:** all applicable  
**Required `data-testid`s:** empty/error testids per surface (required at implement)

### 1. Chrome DevTools MCP checks

- Empty map before search
- Empty saved/trips when applicable
- Tool error state does not white-screen
- `verify:console` on each major route

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-019-empty-error.spec.ts`
- Force empty states where possible

### 3. Feature checks

- Consistent empty copy English-only
- Error boundaries logged not thrown to user

### 4. Required evidence

- [ ] Screenshots: empty map, empty list, error state
- [ ] `npm run verify:console` on major routes

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-019-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-019/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-019-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not add Sentry (F30 deferred) in this task
