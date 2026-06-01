# mdeapp e2e — focused runs only

Do **not** use bare `npm run test:e2e` (219+ tests) when verifying a single vertical.
That suite includes maps, screens, mobile sheet, and grounding — failures there do not
implicate restaurant or CopilotKit budget work.

## P0 focused jobs (run separately, `--workers=1`)

| Script | Spec | Responsibility |
|--------|------|----------------|
| `npm run test:e2e:copilot-budget` | `copilotkit-request-budget.spec.ts` | Idle + **event** fast-path POST budget; storm canary |
| `npm run test:e2e:restaurant-fast-path` | `restaurant-card-fast-path.spec.ts` | Restaurant cards via `/api/restaurants/search` |
| `npm run test:e2e:concierge-run-error` | `concierge-run-error.spec.ts` | UX-016 error bridge |

**Precondition:** `cd mdeapp && npm run dev` (UI `:3001`, Mastra `:4111`). Restart dev
between budget runs if a prior session triggered a CopilotKit POST storm.

## Query ownership

| Query | Used in | Path |
|-------|---------|------|
| `salsa events this weekend` | request-budget only | Event fast path (`/api/events/search`) |
| `suggest restaurants medellin` | restaurant-fast-path only | Restaurant fast path (`/api/restaurants/search`) |
| `quiet rooftop dinner in Provenza` | **not in e2e** | Slow agent / grounded-places — Vitest only |

## Out of scope for restaurant / budget verification

- Maps billing (`BillingNotEnabledMapError`)
- Café grounding latency / silent UI
- `e2e/maps-*`, `e2e/screens/*`, `rich-card-dedup`
- Full `playwright test` without a path filter

## Heredoc anti-pattern

Do not run `npx playwright test - <<'EOF'` — Playwright ignores inline stdin and runs the
full discovered suite.
