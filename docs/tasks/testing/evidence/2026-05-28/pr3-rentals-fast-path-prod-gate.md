# PR3 C-010/C-011 — Production gate evidence (2026-05-28)

## Ship summary

| Item | Value |
|------|--------|
| PR | https://github.com/amo-tech-ai/mdeapp/pull/10 |
| Merge commit | `7b3d58e` on `main` |
| Branch commit | `4d0c03a` |
| Production URL | https://www.mdeai.co/ |
| Vercel production deploy | Ready ~2m after merge (`mdeapp-4j78hx9ti`) |

## PR checks (pre-merge)

| Check | Result |
|-------|--------|
| Vercel | pass |
| CodeRabbit | pass (review skipped) |
| Supabase Preview | skipped |

## Local gates (pre-commit)

- `npm run typecheck` — pass
- `npm run build` — pass
- Rental unit tests (3 files, 14 tests) — pass
- SCREEN-005 Playwright (localhost) — 3/3 pass
- `GET http://localhost:3001/` — 200
- `POST /api/rentals/search` (local) — 200 JSON, 5 results

## Known lint note (not blocking merge)

- `npm run lint` fails on pre-existing `_kind` unused warning in `event-local-chat-context.tsx` (not introduced by PR3).

## Production API gate

```bash
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80}'
```

**Result (2026-05-28 ~14:16 UTC):** HTTP **200**, JSON `results` array length **5**, first title **Cozy Studio Apartment in Laureles**.

Note: First probe ~30s after merge returned **404** (stale deploy); second probe after production Vercel Ready returned **200**.

## Production browser gate

```bash
PW_SKIP_WEBSERVER=1 SMOKE_BASE_URL=https://www.mdeai.co \
  npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium
```

**Result:** **3/3 passed** (~20s)

- Desktop: rental cards + schedule CTA + modal
- Desktop: card click selects map pin; `results-column` count 0 (dedup)
- Mobile: rental cards in center chat

Query used: `1BR apartment in Laureles under 80 dollars per night` (SCREEN-005 helper).

## Scope confirmation

PR3 included only rental fast-path (21 files). No café UI, no event fast-path providers/panels in merge.

## Linear

Production gate passed → SAN-242 / SAN-243 eligible for **Done** (updated via Linear MCP same session).
