# Post-merge validation — SAN-545 + SAN-823

**Date:** 2026-06-08 UTC  
**PR:** [#136](https://github.com/amo-tech-ai/mdeapp/pull/136) — MERGED  
**Prod SHA:** `1c2d2f8`  
**Merge commit:** `1c2d2f80d4028559c2a2b7f6ff561bcfd6d1a0c6`

## Unblock actions

| Step | Result |
|------|--------|
| Cubic thread 1 — `search-logs.ts` doc comment | Fixed in `598e489` |
| Cubic thread 2 — `rankExplanation` sanitize | Waived + resolved |
| CodeRabbit | `@coderabbitai review` — check pass (rate-limit summary on PR) |
| CI | floor ✓ · cubic ✓ · Vercel ✓ |
| Merge | Squash `1c2d2f8` @ 2026-06-08T20:02:54Z |

## SAN-545 · DATA-EMBED — prod curl

```bash
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"queryText":"2BR near Estadio","limit":3}'
```

| Field | Expected | Actual | PASS |
|-------|----------|--------|:----:|
| `hybridUsed` | true | true | ✓ |
| `embedStatus` | not null | `"ok"` | ✓ |
| `embedFailureReason` | null on success | null | ✓ |
| Prod SHA | `1c2d2f8` | Vercel Production `1c2d2f8` | ✓ |

## SAN-823 · UX-038 — prod browser (`/chat`)

| Prompt | Env | Tool | Expected | Actual | PASS |
|--------|-----|------|----------|--------|:----:|
| `apartments in laureles` | prod | Browser MCP | rental-card ≥1 | 8 cards | ✓ |
| same | prod | Browser MCP | map pin ≥1 | 8 pins (map sheet) | ✓ |
| same | prod | Browser MCP | no clarify loop | "Found 8 rentals" | ✓ |
| same | prod | Browser MCP | `/chat` no `?q=` | `https://www.mdeai.co/chat` | ✓ |
| same | prod | Browser MCP | hybrid path | `hybrid_semantic` in rank | ✓ |

**Note:** Playwright `home-to-chat` hero spec still fails — `submitHomeHeroQuery` evaluate path leaves Search disabled on prod home; chat-path proof via Browser MCP passes.

## Reviewers

| Reviewer | P0 | P1 | P2+ | Action |
|----------|---:|---:|----:|--------|
| cubic | 0 | 0 | 2 | fixed + waived |
| CodeRabbit | — | — | — | triggered; rate-limit notice |

## Verdict

- **SAN-545:** Production proof **PASS** — In Review / Done-eligible (user approval)
- **SAN-823:** Production proof **PASS** (chat path) — In Review / Done-eligible; hero Playwright follow-up optional
