---
title: Maps tasks — verification & test checklist
applies_to: tasks/maps/MAP-001 … MAP-012
companion: tasks/audit/11-maps-audit.md § Tests Required Before Marking Done
evidence_dir: tasks/notes/
updated: 2026-05-24
localhost_runbook: ../../mdeapp/docs/localhost-qa-runbook.md
latest_qa: ../notes/localhost-qa-report-2026-05-20.md
---

# Maps verification checklist (master)

Use this when flipping any **MAP-###** task from In Progress → **Done**. Each task file has a task-specific checklist below its **At a glance** section; this page lists **shared gates** and **cross-task Playwright** proof.

**Rule:** A checkbox is not done until you ran the command or test and pasted/redacted output in `tasks/notes/MAP-###-evidence.md` (or linked Playwright report).

**Operator runbooks:**

- [`LOCALHOST-QA-CHECKLIST.md`](./LOCALHOST-QA-CHECKLIST.md) — **full sweep** (Phases 1–6, copy-paste)
- [`test-prompt.md`](./test-prompt.md) / [`test-prompt-1.md`](./test-prompt-1.md) — QA prompts
- [`TROUBLESHOOTING-CHECKLIST.md`](./TROUBLESHOOTING-CHECKLIST.md) — symptoms → fixes

---

## Mindtrip 3-column vs mdeapp today (read first)

Reference: [`screenshots/01-mindtrip.png`](../../screenshots/01-mindtrip.png) · audit [`tasks/audit/10-mindtrip-three-panel-layout-audit.md`](../audit/10-mindtrip-three-panel-layout-audit.md)

| Column | Mindtrip (`01-mindtrip.png`) | mdeapp Phase 1 (shipped **F48**) | Where the “missing” column is |
|--------|------------------------------|-----------------------------------|-------------------------------|
| **Left** | App nav (Chats, Trips, Explore) | **ChatNavRail** stub + drawer (`MAP-007B`) | Threads/saved → SCREEN-002 / Phase 2 |
| **Center** | Chat + **listing cards in thread** | **CopilotChat** center column (`MAP-007B`) + cards via F49 | Chrome polish → SCREEN-001–004 |
| **Right** | Google Map + numbered pins | **`ChatMap`** (`data-testid="chat-map"`) | ✅ F48 + F49 + F50 |

```text
Mindtrip:     [ Nav ] [ Chat + cards ] [ Map ]
mdeapp today: [ Nav | CopilotChat center | Map ]  — MAP-007B ✅ (chrome stubs → SCREEN-001–004)
```

**Layout shipped:** [MAP-007B](./MAP-007B-center-copilot-layout.md) ✅ · **Do not execute** [MAP-007](./MAP-007-chat-three-panel-polish.md) (superseded). Mobile sheet + pin↔card → F50 smokes + SCREEN-018.

**DOM probes (use these, not `map-panel`):**

| Region | `data-testid` / component |
|--------|---------------------------|
| Main canvas grid | `chat-canvas` — `mdeapp/src/components/chat/chat-canvas.tsx` |
| Map | `chat-map` — `mdeapp/src/components/maps/ChatMap.tsx` |
| Rental / grounded cards | `rental-card`, `grounded-card` |
| Pins | `map-pin` |
| Grounding footer | `grounding-attribution` |
| Referer failure | `map-referer-help` |

---

## Shared gates (required for every MAP task)

| # | Check | Command / probe |
|---|--------|-----------------|
| G1 | Unit tests green | `cd /home/sk/mdeai/mdeapp && npm test` → exit 0 |
| G2 | Floor gate | `cd /home/sk/mdeai/mdeapp && npm run floor` → exit 0 |
| G3 | Dev boot | `npm run dev` → `[ui]` HTTP 200 on noted port; `[agent]` Mastra Studio up |
| G4 | Home surface | `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/` → `200` |
| G5 | CopilotKit runtime alive | `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:<port>/api/copilotkit -H "Content-Type: application/json" -d '{}'` → `400` (not `500`) |
| G6 | No v2 CopilotKit imports | `rg "useRenderTool|useFrontendTool|useComponent|CopilotKitProvider" mdeapp/src` → 0 |
| G7 | Server Maps keys not in client bundle | `rg "GOOGLE_MAPS_API_KEY|GOOGLE_PLACES_API_KEY" mdeapp/src/app mdeapp/src/components` → 0 matches in client-only paths (edge/mastra OK) |
| G8 | Evidence file | `tasks/notes/MAP-###-evidence.md` exists with date + port + redacted snippets |
| G9 | **Console boot (every task)** | `npm run verify:console:boot` → exit 0 (layout-critical errors = 0; env/billing warnings OK) |
| G10 | **Console full (when Gemini up)** | `npm run verify:console` → exit 0 after rental chat turn |

---

## Cross-task proof (pin pipeline — after F48 + F49)

Run once when **F49** ships; reference from MAP-001 / MAP-007 / MAP-006 evidence.

| # | Check | Notes |
|---|--------|--------|
| X1 | Desktop layout | 1280×720: `[data-testid="chat-canvas"]` + `[data-testid="chat-map"]` + CopilotSidebar open. **Not** Mindtrip center-chat — cards live in sidebar until MAP-007 |
| X2 | Pin proof | `npm run smoke:map-pins` OR prompt *"1BR apartment in Laureles under 80 dollars per night"* → ≥1 `rental-card`, ≥2 `map-pin` (smoke expects 5 cards, 6 pins) |
| X3 | Pin↔card | Click card → pin selected; click pin → card scroll/highlight (**F50** — manual until Playwright) |
| X4 | Mobile sheet | 390×844: map sheet opens; chat input not covered (**MAP-007** — not built) |
| X5 | Console clean | `npm run verify:console:boot` every task; `npm run verify:console` when Gemini billing OK |

**Automated today (no Playwright spec yet):**

```bash
cd /home/sk/mdeai/mdeapp
npm run verify:console:boot   # every MAP task — layout console, no AI
npm run smoke:map-pins
npm run verify:console        # full turn — requires Gemini billing
npm run verify:grounding   # MAP-002: must print source: grounding-lite
```

Suggested spec path (when Playwright wired): `mdeapp/e2e/maps-concierge-pins.spec.ts`

---

## Per-task checklists

| Task | Primary test artifacts | Evidence file |
|------|------------------------|---------------|
| [MAP-001](./MAP-001-platform-map-pipeline.md#8-verification-checklist-100-done-gate) | `src/platform/**/__tests__/*`, mock pin on `/` | `MAP-001-evidence.md` |
| [MAP-002](./MAP-002-grounding-attribution.md#verification-checklist) | `adk-grounding-client.test.ts`, migration RLS | `MAP-002-evidence.md` |
| [F49](../core/F49-copilotkit-generative-search-ui.md) | `search-tool-renders.tsx`, Playwright X2 | `F49-evidence.md` |
| [MAP-004](./MAP-004-places-grounding-clients.md#7-verification-checklist-100-done-gate) | `google-places-client.test.ts`, field-mask hook | `MAP-004-evidence.md` |
| [MAP-005](./MAP-005-places-proxy-cache.md#6-verification-checklist-100-done-gate) | Deno/edge tests, cache hit test, RLS SQL | `MAP-005-evidence.md` |
| [MAP-006](./MAP-006-nearby-search.md#6-verification-checklist-100-done-gate) | tool test + Playwright CTA | `MAP-006-evidence.md` |
| [MAP-007](./MAP-007-chat-three-panel-polish.md#6-verification-checklist-100-done-gate) | Playwright desktop + mobile | `MAP-007-evidence.md` |
| [MAP-008](./MAP-008-advanced-markers-map-id.md#6-verification-checklist-100-done-gate) | `google-maps-map-id.test.ts`, preview deploy | `MAP-008-evidence.md` |
| [MAP-009](./MAP-009-marker-clustering.md#5-verification-checklist-100-done-gate) | clusterer mock + screenshot 20+ pins | `MAP-009-evidence.md` |
| [MAP-010](./MAP-010-place-autocomplete-venue.md#6-verification-checklist-100-done-gate) | autocomplete mock + host wizard E2E | `MAP-010-evidence.md` |
| [MAP-011](./MAP-011-route-previews.md#6-verification-checklist-100-done-gate) | route normalizer Vitest | `MAP-011-evidence.md` |
| [MAP-012](./MAP-012-neighborhood-intelligence.md#6-verification-checklist-100-done-gate) | scores migration + card Vitest | `MAP-012-evidence.md` |

---

## Companion core tasks (not MAP-### but block Done)

| Task | Blocks | Verify via |
|------|--------|------------|
| [F48](../core/F48-copilotkit-map-canvas-layout.md) | MAP-007 polish | `/` three-region shell, `conciergeAgent` |
| [F49](../core/F49-copilotkit-generative-search-ui.md) | Pin proof | Cross-task X1–X5 above |
| [F50](../core/F50-copilotkit-map-ui-state.md) | MAP-007 sync | `useCoAgent` + `focusMapPin` manual script |
| MASTRA-003 | Runtime | Vercel `POST /api/copilotkit` non-500; PostgresStore in logs |

---

## Quick “is this task 100%?”

```
Done = (all task-specific checkboxes in MAP-###.md)
     AND (G1–G8 shared gates)
     AND (evidence file with repro commands)
     AND (task-verifier / 11-maps-audit satisfied for that ID)
```

Do **not** mark Done on spec-only work or “should pass” without command output.

---

## Test matrix (per MAP task)

| MAP | Primary automated checks |
|-----|--------------------------|
| MAP-001 | `src/platform/**` Vitest — schemas, merge-pins, map env |
| MAP-002 | `adk-grounding-client.test.ts`; migration RLS; attribution snapshot |
| MAP-004 | `google-places-client.test.ts`; field-mask header regression |
| MAP-005 | Edge/cache integration; cache hit; `supabase db lint` + security advisors |
| MAP-006 | `search-nearby` / rental-nearby tool schema; `place_id` required |
| MAP-007 | Playwright X1 + X4 (desktop + mobile sheet) |
| MAP-008 | `google-maps-map-id.test.ts` |
| MAP-009 | Clusterer unit + 20+ pin screenshot |
| MAP-010 | Autocomplete mock + host wizard path |
| MAP-011 | Route normalizer Vitest |
| MAP-012 | Scores migration RLS; card Vitest; no live Places on read path |

**Floor commands:**

```bash
cd /home/sk/mdeai/mdeapp
npm run floor
npx vitest run src/platform/maps src/mastra/lib/google-places-client.test.ts src/mastra/tools
```

Playwright X1–X5: run when `@playwright/test` is wired (W3+); until then use `smoke:map-pins` + `verify:console` + Browser MCP / [`localhost-qa-runbook.md`](../../mdeapp/docs/localhost-qa-runbook.md).

---

## Audit-2 test matrix (maps-audit-2.md)

Use when closing **MAP-005**, **MAP-002B**, **MAP-008B**, **MAP-034**:

| Test | Owner task | Command / probe |
|------|------------|-----------------|
| Repeated Place Details → cache hit | MAP-005 | Integration test + edge log flag |
| Browser never calls Places API | MAP-005 | `e2e/maps-grounding.spec.ts` |
| Every Places request has `X-Goog-FieldMask` | MAP-004/005 | `google-places-client.test.ts` + hook |
| Advanced Markers without Map ID | MAP-008/008B | `google-maps-map-id.test.ts` + Vercel preview |
| Grounded card renders attribution | MAP-002 | `smoke:grounding-attribution` |
| Card click → pin highlight | F50 / MAP-034 | Playwright manual → `maps-007b-evidence` |
| Pin click → card scroll | F50 / MAP-034 | Playwright manual |
| Mobile 390px map usability | MAP-034 | `e2e/maps-layout-mobile.spec.ts` |
| Anon cannot read/write service cache | MAP-005 | RLS SQL negative |
| Prod ADK remote smoke | MAP-002B | `verify:grounding` with Cloud Run URL |
| Vercel Map ID env | MAP-008B | `verify-maps-env.mjs` on preview |

**2026-05-20 localhost QA:** 82/82 tests, smoke 5+6 pins, grounding-lite, console clean — see [`localhost-qa-report-2026-05-20.md`](../notes/localhost-qa-report-2026-05-20.md). `npm run floor` may still fail on `npm audit` (transitive deps).
