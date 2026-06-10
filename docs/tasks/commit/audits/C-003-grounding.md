---
commit_id: C-003
status: pending_commit
sha: pending
---

# C-003 — grounding + search router

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-003 |
| **Intended message** | `feat(agent): search router, web grounding, and concierge tools (C-003)` |
| **Percent complete** | **100%** on disk — **0%** committed |
| **Pass/fail (scope)** | **PASS** |
| **Production readiness** | **82/100** |
| **Standalone** | ⚠️ Needs C-002 Places client; build OK |
| **File count** | **~35** — ⚠️ exceeds 20-file limit |

## Files to include (exact — from working tree)

```
scripts/smoke-grounding-attribution.mjs
scripts/smoke-search-grounding.mjs
scripts/verify-search-grounding.mjs
scripts/verify-cloud-run-grounding.mjs
scripts/verify-grounding-enrichment.mjs
scripts/probe-concierge-web-search.mjs
e2e/maps-grounding.spec.ts
src/app/api/grounding/event-web/route.ts
src/mastra/agents/concierge.ts
src/mastra/agents/__tests__/concierge.test.ts
src/mastra/lib/adk-grounding-client.ts
src/mastra/lib/adk-grounding-client.test.ts
src/mastra/lib/adk-grounding-types.ts
src/mastra/lib/map-adk-grounding-pins.ts
src/mastra/lib/map-adk-grounding-pins.test.ts
src/mastra/lib/attach-web-grounding.ts
src/mastra/lib/__tests__/attach-web-grounding.test.ts
src/mastra/lib/search-intent-router.ts
src/mastra/lib/search-intent-router.test.ts
src/mastra/lib/grounding-location-bias.ts
src/mastra/lib/__tests__/grounding-location-bias.test.ts
src/mastra/lib/search-grounding-quota.ts
src/mastra/lib/search-grounding-quota.test.ts
src/mastra/lib/search-grounding-types.ts
src/mastra/lib/search-grounding-types.test.ts
src/mastra/tools/index.ts
src/mastra/tools/search-grounded-places.ts
src/mastra/tools/search-web-grounded-events.ts
src/mastra/tools/__tests__/search-web-grounded-events.test.ts
src/components/copilot/event-web-citation-fetch.tsx
src/components/copilot/event-web-citation-sync.tsx
src/components/copilot/web-citation-list.tsx
src/components/copilot/__tests__/web-citation-list.test.tsx
src/lib/web-citations-display.ts
```

## Files to exclude

- `src/components/chat/**` (C-004)
- `src/app/api/events/**` (C-005)
- `package.json` scripts for smoke (C-006) — can add script refs in C-006 only
- `.env.local`

## Tests required

```bash
npm run lint
npm test -- --run search-router search-intent attach-web-grounding search-events search-rentals search-grounded
SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution
```

## Verification results (2026-05-27)

| Test | Status |
|------|--------|
| Unit (router/grounding) | **PASS** |
| `smoke:grounding-attribution` | **PASS** |

## Risks

| Risk | Level | Note |
|------|-------|------|
| Gemini latency on rental path | High | unrelated to C-003 but blocks rental smokes |
| Web grounding cost | Medium | only when router allows |
| 30 files | Medium | consider C-003a router / C-003b tools |

## Blockers

- **C-002** Places client should land before or same PR stack (tool uses client).

## Rollback notes

Revert → concierge may over-call web search; SQL-only path still works.

## Dependency notes

- **Requires:** C-000, C-002 (Places)  
- **Required by:** C-004 (citation fetch UI), C-005 (concierge event prose)

## Staging command

```bash
git add scripts/smoke-grounding-attribution.mjs scripts/verify-search-grounding.mjs \
  src/mastra/agents/concierge.ts src/mastra/lib/ src/mastra/tools/ \
  src/components/copilot/event-web-citation-fetch.tsx \
  src/components/copilot/__tests__/event-web-citation-fetch.test.tsx \
  src/lib/search-grounding-attribution.ts src/lib/__tests__/search-grounding-attribution.test.ts
git commit -m "feat(agent): search router, web grounding, and concierge tools (C-003)"
```
