---
id: SCREEN-020
linear: SAN-268
title: Accessibility Pass (MVP surfaces)
status: Done
priority: P1
phase: Cross-cutting
effort: 3-4h
depends_on:
  - SCREEN-019
skill:
  - mde-task-lifecycle
  - web-design-guidelines
  - ui-ux-pro-max
  - copilotkit-develop
wireframes: []
cross_cutting: true
testing_standard: SCREEN-TESTING-STANDARD.md
evidence_file: ../notes/SCREEN-020-evidence.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-020-*.spec.ts
path: all MVP surfaces
---

# SCREEN-020 — Accessibility Pass (MVP surfaces)

## Goal
WCAG-oriented pass on Phase 1–3 surfaces: focus order, aria labels, keyboard nav, contrast.

## User story
As **Camila** using keyboard, I want to select rental cards and open the map, so I'm not mouse-dependent.

## Screen / path
All MVP: `/`, modals, `/events/[slug]`, `/login`

## Wireframe source
- [INDEX.md](INDEX.md)

## Current status
**missing** — partial aria on nav/map exists.

## Build scope

### Frontend
- Audit: nav rail, rental cards, map FAB, modals, CopilotChat region
- Fix: focus traps in dialogs, `aria-live` on new messages, pin keyboard focus (F50)

### CopilotKit
- Ensure generative cards are in tab order / button roles where clickable

### Mastra
- None

### ADK / Google Maps
- Marker accessibility labels (title from pin data)

### Supabase
- None

## Acceptance criteria
- [ ] Tab through nav → chat → cards without trap (except modals)
- [ ] Modals: focus trap + Esc close
- [ ] Map FAB has `aria-label`
- [ ] Color contrast on primary CTAs passes spot check
- [ ] Optional: `@axe-core/playwright` on `/` — document violations fixed or waived

> **Done requires:** all acceptance criteria below **plus** [Done gate](#done-gate-all-required) and [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6.

## Tests
- [ ] `cd mdeapp && npm test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run verify:console`
- [ ] `npm run floor`
- [ ] `npm run test:e2e:desktop`
- [ ] Manual keyboard walkthrough
- [ ] axe scan optional

## Evidence required
- [ ] ['axe report or checklist markdown', 'Screen recording keyboard flow optional']

## Dependencies
- SCREEN-019

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
curl -s -o /dev/null -w "SCREEN-020 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Cursor Browser MCP proof

| Step | Action | Pass |
|------|--------|------|
| 1 | `browser_navigate` → `http://localhost:3001/ (+ key MVP routes)` | 200, primary regions render |
| 2 | `browser_snapshot` | Testids visible: focus order + aria labels on chrome |
| 3 | `browser_console_messages` | 0 critical errors |
| 4 | Workflow | Keyboard tab order; focus visible; no axe critical violations. |
| 5 | `browser_take_screenshot` | `mdeapp/tmp/screenshots/SCREEN-020/` |

### Step 3 — Playwright proof

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-020-a11y.spec.ts --project=chromium
```

Expected: all tests pass (desktop + mobile in spec).

### Step 4 — Record evidence

Update `tasks/notes/SCREEN-020-evidence.md` with: dev restart time, curl HTTP code, Browser console OK, Playwright pass count, `npm run floor` exit 0.

---

## Visual + MCP Testing

> Standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) · Skills: `chrome-devtools-cli`, `playwright-cli`, `webapp-testing`

**Route / surface:** all shipped routes  
**Wireframes:** all applicable  
**Required `data-testid`s:** focus order, aria labels on chrome

### 1. Chrome DevTools MCP checks

- Keyboard: Tab through nav → chat → map controls
- Skip link works
- axe or manual audit: no critical a11y on `/`
- Screen reader labels on icon buttons

### 2. Playwright checks

- **Add:** `e2e/screens/SCREEN-020-a11y.spec.ts`
- Keyboard navigation smoke

### 3. Feature checks

- WCAG 2.1 AA target for Phase 1 chrome
- Depends SCREEN-019

### 4. Required evidence

- [ ] axe or manual a11y checklist
- [ ] Keyboard navigation flow notes

**Commands (task bundle):**

```bash
cd mdeapp && npm run verify:console && npm run test:e2e:desktop && npm run floor
```


## Done gate (all required)

> Full standard: [`SCREEN-TESTING-STANDARD.md`](SCREEN-TESTING-STANDARD.md) §6. **Do not mark Done** until every box is checked and `tasks/notes/SCREEN-020-evidence.md` exists.

- [ ] Dev server restarted clean (`npm run dev` → `:3001` Ready)
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright task spec pass (desktop + mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools MCP: console clean on task route (+ workflow turn if chat)
- [ ] Playwright: desktop **and** mobile pass (task spec or extended layout spec)
- [ ] Workflow verified (user action → expected UI → backend proof if applicable)
- [ ] No broken network calls on happy path
- [ ] Screenshots under `mdeapp/tmp/screenshots/SCREEN-020/`
- [ ] Evidence file committed at `tasks/notes/SCREEN-020-evidence.md`
- [ ] INDEX rows match frontmatter `status: Done`


## Do not do
- Do not block MVP on full WCAG audit — fix P0 a11y only
