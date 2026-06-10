# mdeai — Screen-First Task Index

> **Use this index** when the goal is **visible product progress**. One task file per screen under [`tasks/screens/`](./screens/INDEX.md).

**Testing standard:** [`screens/SCREEN-TESTING-STANDARD.md`](./screens/SCREEN-TESTING-STANDARD.md) · Audit [`audit/25a-mde-audit.md`](./audit/25a-mde-audit.md)

**Audits:** [`audit/25-mde-audit.md`](./audit/25-mde-audit.md) (full forensic) · [`audit/25a-mde-audit.md`](./audit/25a-mde-audit.md) (visual testing) · [`audit/23-screens-task-audit.md`](./audit/23-screens-task-audit.md) · [`audit/22-task-order-audit.md`](./audit/22-task-order-audit.md)  
**Plan:** [`roadmap/22-screen-first-implementation-plan.md`](./roadmap/22-screen-first-implementation-plan.md)  
**Wireframes + progress:** [`screens/INDEX.md`](./screens/INDEX.md) (single index — scr, wire, progress)

**Architecture:**

```text
Browser → CopilotKit 1.55.2 → /api/copilotkit → Mastra → gemini-3.5-flash → ADK :8000 → Supabase
```

**Skills (load before implement):**

| Skill | Use for |
|-------|---------|
| [`mde-task-lifecycle`](../../.claude/skills/mde-task-lifecycle/SKILL.md) | Phases, evidence, Done gates |
| [`copilotkit`](../../.claude/skills/copilotkit/SKILL.md) | Router to CK sub-skills |
| [`copilotkit-develop`](../../.agents/skills/copilotkit-develop/SKILL.md) | useCopilotAction, CopilotChat |
| [`copilotkit-agui`](../../.agents/skills/copilotkit-agui/SKILL.md) | HITL, renderAndWaitForResponse |
| [`mastra`](../../.agents/skills/mastra/SKILL.md) | Agents, tools, workflows |
| [`mde-maps`](../../.agents/skills/mde-maps/SKILL.md) | MapContext, pins, mapId |
| [`shadcn`](../../.agents/skills/shadcn/SKILL.md) | Sheet, dialog, UI primitives |
| [`gemini`](../../.agents/skills/gemini/SKILL.md) | Model id verification only |
| [`web-design-guidelines`](../../.agents/skills/web-design-guidelines/SKILL.md) | Auth + a11y |
| [`chrome-devtools-cli`](../../.claude/skills/chrome-devtools-cli/SKILL.md) | MCP console, layout, screenshots |
| [`playwright-cli`](../../.claude/skills/playwright-cli/SKILL.md) | Desktop/mobile E2E per SCREEN |
| [`webapp-testing`](../../.claude/skills/webapp-testing/SKILL.md) | Localhost verification flows |

**Do not mark Done** without [`SCREEN-TESTING-STANDARD.md`](./screens/SCREEN-TESTING-STANDARD.md) §6 + per-task evidence in `tasks/notes/SCREEN-###-evidence.md` (visual screenshot + MCP console clean + Playwright desktop/mobile). Audit: [`audit/25a-mde-audit.md`](./audit/25a-mde-audit.md).

---

## Implementation order

> Verified 2026-05-24 — [`audit/23-screens-task-audit.md`](./audit/23-screens-task-audit.md). **Defer** thread hydration (002) and mobile polish (018) until chrome + cards ship. 🔴 = backend blocker for Done.

| Order | Task | Screen | Path | Priority | Depends on | Verify | Status |
|------:|------|--------|------|----------|------------|--------|--------|
| 1 | [001-scr](./screens/001-scr-home-chat-chrome.md) | Home chat chrome | `/` | P0 | F48, MAP-007B | `smoke:map-pins` + [testing](./screens/SCREEN-TESTING-STANDARD.md) | **Done** |
| 2 | [003-scr](./screens/003-scr-chat-query-bar.md) | Query chips | `/` | P0 | SCREEN-001, F50 | chip state + Playwright | **Done** |
| 3 | [004-scr](./screens/004-scr-workflow-progress-strip.md) | Workflow strip | `/` | P0 | F49, SCREEN-001 | tool UI + Playwright | **Done** |
| 4 | [005-scr](009-scr-rental-card-polish.md) | Rental cards | `/` | P0 | F49, F50, SCREEN-004 | `smoke:f50-pin-sync` | **Done** |
| 5 | [007-scr](./screens/007-scr-venue-detail-sheet.md) | Venue sheet | overlay | P0 | SCREEN-005 | sheet+map | **Done** |
| 6 | [006-scr](./screens/006-scr-event-card-polish.md) | Event cards | `/` | P0 | F15, SCREEN-004 | event pins | **Done** |
| 7 | [014-scr](003-scr-event-detail-page.md) | Event detail | `/events/[slug]` | P0 | SCREEN-006 | HTTP 200 | **Done** |
| 8 | [008-scr](017-scr-schedule-viewing-modal.md) | Schedule viewing | modal | P0 | F47, F12, SCREEN-005 | **G2** leads | **Done** |
| 9 | [009-scr](010-scr-booking-checkout-modal.md) | Checkout | modal | P0 | F11, EVT-01, SCREEN-014 | **G1** Stripe | **Done** |
| 10 | [015-scr](./events/wireframes/015-scr-my-tickets-qr.md) | My tickets | `/me/tickets` | P0 | SCREEN-009 | QR | **Done** |
| 11 | [016-scr](004-scr-host-event-wizard.md) | Host wizard | `/host/event/new` | P0 | F33–F38 | HITL publish | **Done** |
| 12 | [019-scr](./screens/019-scr-loading-error-empty-states.md) | Empty/error | all | P1 | SCREEN-001 | `verify:console` | **Done** |
| 13 | [020-scr](./screens/020-scr-accessibility-pass.md) | a11y | all | P1 | SCREEN-019 | keyboard | **Done** |
| 14 | [011-scr](014-scr-saved-collections-page.md) | Saved | `/saved` | P1 | SCREEN-005 | RLS | **Done** |
| 15 | [012-scr](./screens/012-scr-trips-dashboard.md) | Trips | `/trips` | P1 | SCREEN-011 | list UI | Done |
| 16 | [013-scr](013-scr-itinerary-panel.md) | Itinerary | `/trips/[id]` | P1 | SCREEN-012 | timeline | Done |
| 17 | [002-scr](./screens/002-scr-chat-nav-rail.md) | Chat nav + threads | `/` | P0 | SCREEN-001 | threads UI | **Deferred** |
| 18 | [018-scr](./screens/018-scr-mobile-responsive-shell.md) | Mobile shell | `/` | P0 | SCREEN-001, F48 | `test:e2e:mobile` | **Deferred** (partial) |

### Cafe + map polish (after P0 commerce — audit 37)

> **Partial shipped:** ADK grounding + ☕ map pins. **026-scr (SCREEN-021) Phase A.5** — ranked cards + right-column detail panel.

| Order | Task | Phase | Depends | Status |
|------:|------|-------|---------|--------|
| 19 | [026-scr](../venues/005-scr-cafe-listings-map-booking.md) + [026-wire](../venues/005-wire-cafe-listings-map-booking.md) | **A / A.5** cards + detail panel | SCREEN-001, 003, 007, MAP-001 | ✅ A.5 Done |
| — | [010-scr](011-scr-map-exploration-panel.md) | map panel (optional) | MAP-001, MAP-008 | ⚪ |
| — | [026-scr](../venues/005-scr-cafe-listings-map-booking.md) | **B** semantic rerank | Phase A + VEC-004, VEC-005 | ⚪ |
| — | [CAF-008](../venues/tasks/CAF-008-data-venue-booking-requests-schema.md) | booking schema (all kinds) | CAF-004 | ⚪ |
| — | [026-scr](../venues/005-scr-cafe-listings-map-booking.md) | **C** booking writes | Phase A/B + CAF-008 | ⚪ |

**Parallel:** [010-scr](011-scr-map-exploration-panel.md) · [017-scr](./screens/017-scr-login-signup-polish.md)

---

## Phase 1 exit (orders 1–4 + smokes)

```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:f50-pin-sync && npm run verify:console && npm run test:e2e:screens && npm run floor
```

---

## Foundation done — reference only

| ID | Verify |
|----|--------|
| F48, F49, F50 | smokes above |
| MAP-001, MAP-002, MAP-007B, MAP-008 | maps INDEX |
| F18, F19 | `npm test` |
| F14, F15, F17, F46 | ✅ Done — [`notes/F14-evidence.md`](./notes/F14-evidence.md) etc.; UI polish via SCREEN-* |

---

## Frozen (no SCREEN tasks)

`/explore` · `/contests` · `/nightlife` · `/creator` · `/notifications` · full `/bookings` inbox

---

## Cross-links

| Doc | Path |
|-----|------|
| All screen specs | [`screens/INDEX.md`](./screens/INDEX.md) |
| Master index | [`INDEX.md`](./INDEX.md) |
| Progress | [`progres.md`](./progres.md) |
