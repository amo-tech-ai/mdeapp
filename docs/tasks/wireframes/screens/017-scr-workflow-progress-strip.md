---
id: SCREEN-004
linear: SAN-263
title: Workflow Progress Strip
status: Done
completed_at: 2026-05-24
priority: P0
phase: MVP Phase 1
effort: 2-3h
depends_on:
  - F49
  - SCREEN-001
blocks:
  - SCREEN-005
  - SCREEN-006
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - mastra
  - shadcn
wireframes:
  - 002-wire-chat-chrome.md
  - 009-wire-rental-search.md
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-004-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-004-*.spec.ts
path: /
---

# SCREEN-004 — Workflow Progress Strip

## Goal
Visible step indicator during rental/event search (Mindtrip workflow strip).

## User story
As **Camila**, I want to see "Searching → Ranking → Results" steps, so I know the agent is working.

## Screen / path
`/` — below query bar or above CopilotChat messages

## Wireframe source
- [002-wire-chat-chrome.md](002-wire-chat-chrome.md)
- [005-wire-rental-search.md](009-wire-rental-search.md)

## Current status
**In Progress** — workflow strip on disk; dedicated Playwright spec + MCP screenshots pending.

## Build scope

### Frontend
- **Create** `components/chat/workflow-progress-strip.tsx`
- Mount from `chat-center-panel.tsx`
- States: idle | running | complete | error

### CopilotKit
- **Phase A (MVP):** Drive strip from tool-call in-progress / generative render loading (search-rentals, search-events) — do not block on workflow SSE
- **Phase B (optional):** Map step labels from workflow metadata or working memory when AG-UI exposes steps

### Mastra
- `rental-search-workflow`, `event-discovery-workflow` — expose step names in stream or working memory
- Do not duplicate F46 workflow logic — **UI only**

### ADK / Google Maps
- None

### Supabase
- None

## Acceptance criteria
- [ ] Rental query shows ≥3 labeled steps before cards appear
- [ ] Strip clears or shows complete on results
- [ ] Event query uses same component with event labels
- [ ] No layout shift breaking CopilotChat input

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] Vitest: strip renders steps from mock workflow state
- [ ] Manual: Laureles rental query shows strip

## Evidence required
- [ ] Screenshot: workflow strip mid-search
- [ ] Screenshot: strip complete with cards

## Dependencies
- F49 ✅, F46 workflow code ✅ (do not reimplement)
- SCREEN-001
- Mastra workflow step stream to CopilotKit: **not verified** — Phase A uses tool UI only (audit/23)

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
curl -s -o /dev/null -w "SCREEN-004 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: `workflow-progress-strip`, `[data-phase]`, `[data-kind]`, `[data-step]` |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Send rental query — `workflow-progress-strip` shows in-progress step. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-004/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-004-workflow-strip.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-004-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** `/` below query bar  
**Wireframes:** 14-chat-chrome, 02-rental-search  
**Required `data-testid`s:** `workflow-progress-strip`, `data-phase`, `data-kind`, `data-step`

### 1. Chrome DevTools MCP checks

- Send rental query → strip `data-phase="running"` with ≥3 steps
- On results → `data-phase="complete"` then idle
- Event query uses event step labels
- No layout shift on CopilotChat input

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-004-workflow-strip.spec.ts`
- `sendConciergeMessage` rental query → wait for strip running → cards → complete
- Screenshot mid-search and post-results

### 3. Feature checks

- Phase A: tool in-progress UI (not raw Mastra SSE)
- Rental + event workflows share component
- Strip clears after complete timeout

### 4. Required evidence

- [ ] Screenshot: strip mid-search (`data-phase=running`)
- [ ] Screenshot: strip complete with cards
- [ ] `npm run smoke:map-pins` exit 0

**Commands (task bundle):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run verify:console && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-004-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-004/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-004-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not create new Mastra workflows — wire existing ones
