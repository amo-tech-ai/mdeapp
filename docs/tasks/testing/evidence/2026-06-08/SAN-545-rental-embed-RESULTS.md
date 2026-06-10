# SAN-545 — Rental embed API / hybrid search

**Date:** 2026-06-08

## Root cause (code)

Embed failures were **silent**: `embedQueryText()` returned `null` on 403/missing key with only `console.warn`, and `hybridUsed=false` with no structured telemetry.

## Fix shipped (local, pending deploy)

| Change | File |
|--------|------|
| `embedQueryTextDetailed()` with `reason` + HTTP status | `src/mastra/lib/query-embedding.ts` |
| `embedStatus`, `embedFailureReason`, `embedHttpStatus` on intelligent search | `src/mastra/lib/intelligence-rental-search.ts` |
| API exposes embed telemetry | `src/app/api/rentals/search/route.ts` |
| Search logs stash embed status in `slots` | `src/mastra/lib/search-logs.ts` |
| Vitest 403 case | `src/mastra/lib/__tests__/query-embedding.test.ts` |

## Production check (pre-deploy telemetry)

```bash
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"queryText":"2BR near Estadio","minBedrooms":2,"limit":4}'
```

| Check | Result |
|-------|--------|
| HTTP 200 | ✅ |
| `hybridUsed` | ✅ `true` |
| Rental cards | ✅ ≥1 |
| `embedStatus` in JSON | ⏸ after deploy |

## Tests

```bash
cd mdeapp && npm test -- --run src/mastra/lib/__tests__/query-embedding.test.ts
```

All green.
