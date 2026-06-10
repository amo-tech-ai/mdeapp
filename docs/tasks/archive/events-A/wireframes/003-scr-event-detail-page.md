---
id: SCREEN-014
title: Event Detail Page
status: Done
priority: P0
phase: MVP Phase 3
effort: 4-5h
feature_group: "003"
depends_on:
  - SCREEN-006
  - F15
blocks:
  - SCREEN-009
skill:
  - mde-task-lifecycle
  - shadcn
  - copilotkit-develop
wireframes:
  - 003-wire-event-detail-page.md
primary_wire: 003-wire-event-detail-page.md
related_specs:
  - 003-scr-event-card-polish.md
  - 003-events-README.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../evidence/SCREEN-014-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-014-*.spec.ts
path: /events/[slug]
---

# SCREEN-014 — Event Detail Page

> **Events group 003:** [003-events-README.md](003-events-README.md) · Wire: [003-wire-event-detail-page.md](003-wire-event-detail-page.md) · Upstream: [003-scr-event-card-polish.md](003-scr-event-card-polish.md) (SCREEN-006)

## Goal
Shareable public event page with tiers + Buy CTA → checkout modal.

## User story
As **Andrés**, I want a link I can share, so friends buy tickets from the same event page.

## Screen / path
`/events/[slug]`

## Wireframe source
- [003-wire-event-detail-page.md](003-wire-event-detail-page.md)

## Current status
**Done** — `/events/[slug]` live; slug + UUID lookup; checkout modal shell (SCREEN-009 preview).

## Build scope

### Frontend
- **Shipped** `app/events/[slug]/page.tsx`, `event-detail-view.tsx`, `event-ticket-tiers.tsx`
- Hero, date, venue, tier list; checkout notice shell (SCREEN-009)

### CopilotKit
- None required on static page

### Mastra
- None — server fetch event by slug

### ADK / Google Maps
- Optional venue map embed with mapId

### Supabase
- `events`, `event_tickets`, `event_venues` — public read published events

## Acceptance criteria
- [x] Published event slug returns 200
- [x] Draft event 404 for anon
- [x] Buy opens checkout modal
- [x] Mobile responsive

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [x] `cd mdeapp && npm test`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [ ] `npm run verify:console` (chat sweep — N/A for static route; SCREEN-014 spec asserts console clean)
- [x] `npm run floor`
- [x] Playwright: /events/[known-slug]
- [x] npm test

## Evidence required
- [x] ['Screenshot: event detail desktop + mobile', 'curl :3001/events/... 200']

## Dependencies
- SCREEN-006, F15 ✅

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
curl -s -o /dev/null -w "SCREEN-014 → %{http_code}\n" --max-time 15 -L http://localhost:3001/events/reina-de-antioquia-2026-finals
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/events/reina-de-antioquia-2026-finals` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `event-detail-page` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Event detail page — title, venue, ticket CTA visible. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-014/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-014-event-detail.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/evidence/SCREEN-014-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/events/[slug]`  
**Wireframes:** [003-wire-event-detail-page.md](003-wire-event-detail-page.md)  
**Required `data-testid`s:** `event-detail-page` (required at implement)

### 1. Chrome DevTools MCP checks

- HTTP 200 for live event slug
- Buy tickets CTA opens SCREEN-009
- Console clean

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-014-event-detail.spec.ts`
- curl + Playwright route test

### 3. Feature checks

- Reads `events`, `event_tickets` via RLS/server

### 4. Required evidence

- [x] Screenshot: event detail desktop + mobile
- [x] HTTP 200 proof for live slug

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-014-evidence.md` exists.

- [x] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [x] Browser MCP: navigate + snapshot + console clean + screenshot
- [x] Playwright task spec pass (desktop + mobile)
- [x] `npm run floor` exit 0
- [x] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [x] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [x] Workflow verified (user action → expected UI → backend proof if applicable)
- [x] No broken network calls on happy path
- [x] Screenshots under `mdeapp/tmp/screenshots/SCREEN-014/`
- [x] Evidence file at `tasks/evidence/SCREEN-014-evidence.md`
- [x] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not scrape external ticket vendors
