---
commit_id: C-002
status: pending_commit
sha: pending
---

# C-002 — Places client + photo proxy

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-002 |
| **Intended message** | `feat(places): Places client, photo proxy, and grounded cards (C-002)` |
| **Percent complete** | **100%** on disk — **0%** committed |
| **Pass/fail (scope)** | **PASS** |
| **Production readiness** | **85/100** |
| **Standalone** | ⚠️ Cards need C-004 tool render to show in chat |
| **File count** | **17** — OK |

## Files to include (exact)

```
src/app/api/places/photo/route.ts
src/app/api/places/photo/route.test.ts
src/components/copilot/__tests__/grounded-place-card.test.tsx
src/components/copilot/__tests__/place-result-card.test.tsx
src/components/copilot/grounded-place-card.tsx
src/components/copilot/place-result-card.tsx
src/lib/__tests__/parse-grounded-tool-result.test.ts
src/lib/__tests__/places-photo-rate-limit.test.ts
src/lib/normalize-tool-envelope.ts
src/lib/parse-grounded-tool-result.ts
src/lib/places-display.ts
src/lib/places-photo-proxy.ts
src/lib/places-photo-rate-limit.ts
src/mastra/lib/__tests__/places-retry.test.ts
src/mastra/lib/google-places-client.test.ts
src/mastra/lib/google-places-client.ts
src/mastra/lib/places-retry.ts
```

## Files to exclude

- `search-tool-renders.tsx` (C-004)
- `search-grounded-places.ts` tool wiring changes — include in **C-003** (`src/mastra/tools/search-grounded-places.ts`, `index.ts`)
- Secrets in `.env.example` (C-006 only)

## Tests required

```bash
npm run lint
npm test -- --run places google-places parse-grounded places-photo-rate-limit grounded-place place-result
```

## Verification results (2026-05-27)

| Test | Status |
|------|--------|
| Unit (places) | **PASS** (263 full suite) |
| Photo route | Covered by unit tests |

## Risks

| Risk | Level | Note |
|------|-------|------|
| Places API quota | Medium | Field masks + rate limit in `places-photo-rate-limit` |
| Photo proxy abuse | Low | rate limit on `/api/places/photo` |
| Rollback | Low | Disable rich cards; fall back to text |

## Blockers

None if C-000 done. Soft dependency on C-001 for map pin meta display.

## Rollback notes

Remove photo route → images 404 in cards; no data loss.

## Dependency notes

- **Requires:** C-000 (lint)  
- **Required by:** C-003 (`search-grounded-places`), C-004 (`search-tool-renders`)

## Staging command

```bash
git add src/app/api/places/ src/components/copilot/grounded-place-card.tsx \
  src/components/copilot/place-result-card.tsx src/components/copilot/__tests__/grounded-place-card.test.tsx \
  src/components/copilot/__tests__/place-result-card.test.tsx \
  src/lib/normalize-tool-envelope.ts src/lib/parse-grounded-tool-result.ts \
  src/lib/places-display.ts src/lib/places-photo-proxy.ts src/lib/places-photo-rate-limit.ts \
  src/lib/__tests__/parse-grounded-tool-result.test.ts src/lib/__tests__/places-photo-rate-limit.test.ts \
  src/mastra/lib/google-places-client.ts src/mastra/lib/google-places-client.test.ts \
  src/mastra/lib/places-retry.ts src/mastra/lib/__tests__/places-retry.test.ts
git commit -m "feat(places): Places client, photo proxy, and grounded cards (C-002)"
```
