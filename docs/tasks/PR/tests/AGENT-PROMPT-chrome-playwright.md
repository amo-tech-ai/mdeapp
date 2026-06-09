---
title: Agent prompt — implement UX test tasks (Chrome DevTools MCP + Playwright)
updated: 2026-05-31
scope: tasks/ux/tasks/tests/
---

# Agent prompt — UX test implementation

Copy into a fresh agent session. **Implement test code in `mdeapp/`** per specs in this folder.

## Mission

Implement the **test layer** for UX stack **before** UX-013/014/019 feature code. Read specs in order:

1. [INDEX.md](INDEX.md)
2. [UX-T-CK-copilotkit-mvp-tests.md](UX-T-CK-copilotkit-mvp-tests.md) — CopilotKit P0–P2
3. [UX-T-MA-mastra-mvp-tests.md](UX-T-MA-mastra-mvp-tests.md) — Mastra P0–P2
4. [UX-T-SB-supabase-mvp-tests.md](UX-T-SB-supabase-mvp-tests.md) — Supabase P0–P2
5. [UX-T-GM-maps-adk-grounding-mvp-tests.md](UX-T-GM-maps-adk-grounding-mvp-tests.md) — Maps / ADK / Grounding P0–P2
6. [UX-T-CU-card-unification-mvp-tests.md](UX-T-CU-card-unification-mvp-tests.md) — **Card unification P0–P2**
7. [UX-T-016-concierge-run-error.spec.md](UX-T-016-concierge-run-error.spec.md)
8. [UX-T-031-live-audit-verticals.spec.md](UX-T-031-live-audit-verticals.spec.md)
9. [UX-T-019-event-memory-guard.md](UX-T-019-event-memory-guard.md)
10. [UX-T-013-cafe-fallback-vitest.md](UX-T-013-cafe-fallback-vitest.md)
11. [UX-T-014-agent-card-emit-vitest.md](UX-T-014-agent-card-emit-vitest.md)
12. `.claude/skills/copilotkit-integrations/SKILL.md` — v1.55.2 only
13. `.claude/skills/mastra/SKILL.md` — agent + tool patterns
14. `.claude/skills/mde-supabase/SKILL.md` — RLS + MCP verify
15. `.claude/skills/mde-maps/SKILL.md` — Places masks, ADK sidecar, mapId

## Environment

```bash
cd mdeapp && npm run dev   # :3001 UI, :4111 Mastra
```

- Hide inspector: `hideCopilotWebInspector(page)`
- Chat send: `sendConciergeMessage` — **not** plain `fill()`
- `goto`: `domcontentloaded` — **not** `networkidle`

## Deliverables

| File | Spec |
|------|------|
| `e2e/copilotkit-mvp.spec.ts` | UX-T-CK (P0 provider, thinking, rental, POST storm) |
| `e2e/concierge-run-error.spec.ts` | UX-T-016 |
| `e2e/live-audit-verticals.spec.ts` | UX-T-031 |
| `src/lib/__tests__/event-search-fast-path.test.ts` | UX-T-019 (extend) |
| `src/lib/supabase/__tests__/migration-contracts.test.ts` | UX-T-SB |
| `src/lib/supabase/__tests__/supabase-live.test.ts` | UX-T-SB |
| `scripts/verify-supabase-data.mjs` | UX-T-SB |
| `src/mastra/workflows/__tests__/concierge-routing-workflow.test.ts` | UX-T-MA |
| `src/mastra/tools/__tests__/search-restaurants-tool-fallback.test.ts` | UX-T-MA |
| `src/mastra/tools/__tests__/search-grounded-places-fallback.test.ts` | UX-T-GM |
| `src/mastra/tools/__tests__/search-grounded-places-cafe-fallback.test.ts` | UX-T-013 / UX-T-GM |
| `scripts/smoke-places-new.mjs` | UX-T-GM |
| `src/components/copilot/__tests__/search-tool-renders-cards.test.ts` | UX-T-CU |
| `src/components/copilot/__tests__/card-interaction-a11y.test.tsx` | UX-T-CU |
| `e2e/card-unification.spec.ts` | UX-T-030 / UX-T-CU |

## Verification

```bash
cd mdeapp
npm run test:cards
npm run test:maps
npm run test:supabase
npm run smoke:places-new      # needs GOOGLE_PLACES_API_KEY
npm run smoke:adk-grounding   # needs ADK sidecar :8000
npm test -- src/mastra src/__tests__/smoke.test.ts   # UX-T-MA
npx playwright test e2e/copilotkit-mvp.spec.ts e2e/concierge-run-error.spec.ts e2e/live-audit-verticals.spec.ts --project=chromium --workers=1
npm run smoke:copilot:error   # after scripts added
node --env-file=.env.local scripts/verify-maps-env.mjs
```

Evidence → `tasks/testing/evidence/2026-05-31/`

## Chrome DevTools MCP — exploratory pass (after Playwright green)

1. `browser_navigate` → `http://localhost:3001/`
2. `browser_snapshot` — `center-chat-panel`, `chat-map`
3. CDP `Network.enable` — rental query → confirm `/api/rentals/search` before cards
4. **Same tab** — event query then dinner query (scenario 3 manual)
5. Café query with ADK mocked — screenshot
6. Console: no mdeapp `pageerror` (ignore Maps dev billing)

Write notes → `tasks/testing/evidence/2026-05-31/chrome-devtools-notes.md`

## Return format

- Files created
- Pass/fail command output
- Which UX-T-* specs are now green vs expected red (031 scenarios 3–4)
- Screenshot paths

## Do not

- Mix feature implementation (UX-013/014/019) in same commit unless TDD red→green
- Use `@copilotkit/react-core/v2`
- Reference absent scripts (`smoke:ux005-thinking`, `golden-queries-smoke.ts`)
