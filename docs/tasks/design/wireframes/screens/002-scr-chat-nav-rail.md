---
id: SCREEN-002
linear: SAN-488
title: Chat Nav Rail + Thread List
status: Done
completed_at: 2026-06-02
priority: P0
phase: MVP Phase 1
effort: 3-4h
depends_on:
  - SCREEN-001
  - F48
blocks:
  - SCREEN-011
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - shadcn
  - building-components
wireframes:
  - 002-wire-chat-chrome.md
primary_wire: 002-wire-chat-chrome.md
paired_wire_note: "NOT 005-wire-rental-search — that wire is for SCREEN-005 rental cards"
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../../evidence/SCREEN-002-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-002-*.spec.ts
path: /
---

# SCREEN-002 — Chat Nav Rail + Thread List

## Goal
Replace stub nav with thread history, new chat, and nav links (saved/trips disabled until Phase 4).

## User story
As **Camila**, I want to resume yesterday's rental search from the left rail, so I don't restart from zero.

## Screen / path
`/` — left column; mobile via `chat-nav-drawer.tsx`

## Wireframe source
- [002-wire-chat-chrome.md](002-wire-chat-chrome.md)

## Current status
**Done (2026-06-02)** — `chat-nav-rail.tsx` + `/api/threads` + `ThreadNavProvider`; Playwright 5/5. Evidence: [`tasks/evidence/SCREEN-002-evidence.md`](../../evidence/SCREEN-002-evidence.md).

## Build scope

### Frontend
- Extend `components/chat/chat-nav-rail.tsx`
- Extend `components/chat/chat-nav-drawer.tsx` for mobile
- Thread list UI with active state + `data-testid="nav-thread-item"`

### CopilotKit
- Sync CopilotKit thread id with list selection
- New chat → new thread id

### Mastra
- Read `mastra_threads` via server action or route handler (user-scoped, RLS)
- Do **not** use service role in client bundle

### ADK / Google Maps
- None

### Supabase
- `mastra_threads`, `mastra_messages` — read only
- RLS: user sees own threads only

## Acceptance criteria
- [x] Desktop nav shows ≥1 thread after second chat session (authenticated)
- [x] Click thread switches CopilotChat context (`threadId` prop)
- [x] "New chat" clears thread / starts fresh
- [x] Saved link live → `/saved`; Trips link disabled with tooltip (trips hub ships separately)
- [x] Mobile drawer opens/closes without blocking map FAB (SCREEN-018)

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Playwright: `[data-testid=nav-rail]` visible at 1280px
- [ ] Playwright: thread switch changes message area

## Evidence required
- [ ] Screenshot: nav with 2+ threads
- [ ] Browser: thread click restores prior turn
- [ ] SQL or API: mastra_threads row for user

## Dependencies
- SCREEN-001, F48 ✅
- Thread storage spike required before Done — not F13 (ai_runs observability)

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
curl -s -o /dev/null -w "SCREEN-002 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `nav-rail`, `nav-drawer-trigger`, `nav-drawer-content`, `nav-thread-item` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Desktop: `nav-rail` visible. Mobile: `nav-drawer-trigger` opens drawer. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-002/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-002-nav-rail.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-002-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` left column + `nav-drawer` mobile  
**Wireframes:** 14-chat-chrome  
**Required `data-testid`s:** `nav-rail`, `nav-drawer-trigger`, `nav-drawer-content`, `nav-thread-item` (required at implement)

### 1. Chrome DevTools MCP checks

- Desktop: thread list ≥1 after second chat session
- Click thread: CopilotChat context switches (message area changes)
- New chat: fresh thread id
- Mobile drawer opens/closes without blocking map FAB
- Console + network clean on thread switch

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-002-nav-rail.spec.ts`
- Desktop: `[data-testid="nav-rail"]` + `[data-testid="nav-thread-item"]` click
- Mobile: `[data-testid="nav-drawer-trigger"]` → drawer content
- Screenshot: thread list with 2+ items

### 3. Feature checks

- Thread hydration from `mastra_threads` (RLS user-scoped)
- Saved link live; Trips disabled until user has trips (SCREEN-012)
- No service role in client bundle

### 4. Required evidence

- [ ] Screenshot: 2+ threads desktop
- [ ] Screenshot: mobile nav drawer
- [ ] SQL/API: `mastra_threads` row for test user
- [ ] Playwright spec pass desktop + mobile

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run test:e2e:desktop && npm run test:e2e:mobile && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

- [x] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [x] Playwright `e2e/screens/SCREEN-002-nav-rail.spec.ts` pass
- [x] `npm run floor` exit 0 (at ship time)
- [x] Evidence at [`tasks/evidence/SCREEN-002-evidence.md`](../../evidence/SCREEN-002-evidence.md)
- [x] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not implement full `/saved` or `/trips` pages here
- Do not port legacy ChatLeftNav verbatim — adapt patterns only
