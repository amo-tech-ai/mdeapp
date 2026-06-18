# CK-V2 post-#249 verification — CopilotKit v2 + Mastra end-to-end

**Date:** 2026-06-17  
**Main SHA:** `e0621c7c` ([#249](https://github.com/amo-tech-ai/mdeapp/pull/249) — wire `check:mastra` into floor)  
**Refs:** [SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration (frontend-only, subpath path)](https://linear.app/sanjiovani/issue/SAN-886/ck-v2-000-copilotkit-v1v2-migration-frontend-only-subpath-path) · PRs [#247](https://github.com/amo-tech-ai/mdeapp/pull/247) · [#248](https://github.com/amo-tech-ai/mdeapp/pull/248) · [#249](https://github.com/amo-tech-ai/mdeapp/pull/249)

## Verdict

**PASS** — CopilotKit v2 `/v2` subpath + Mastra runtime bridge work in real app flows on localhost. No app code changes required.

## Checks

| Check | localhost | Notes |
|-------|-----------|-------|
| `node scripts/check-mastra.mjs` | PASS | exit 0 |
| CI `npm run floor` on `main` (#249) | PASS | run `27734502069` success |
| Bare `@copilotkit/react-core` in `src/**` | PASS | grep 0 matches |
| Frontend `/v2` imports | PASS | 19 files `@copilotkit/react-core/v2` |
| `@copilotkit/runtime` (Mastra bridge) | PASS | bare import in API route |
| `GET /` | PASS | 200 |
| `GET /chat` | PASS | 200 |
| `GET /host/event/new` (unauthed) | PASS | 307 → `/login` (expected) |
| `POST /api/copilotkit` empty | PASS | 400 `Missing method field` |
| `chat-smoke.mjs` | PASS | all tiers |
| Playwright — events chip (`/chat`) | PASS | ≥1 `[data-testid="event-card"]` |
| Playwright — host wizard (authed) | PASS | shell + agent fill/HITL |
| Playwright — host analytics (authed) | PASS | shell + sales prompt |
| Mastra dev studio `:4111` | PASS | 200 |

## Commands

```bash
cd /home/sk/mdeai/mdeapp
git pull --ff-only   # → e0621c7c
npm run check:mastra
infisical run --silent --env=dev --path=/ -- npm run dev
node tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
PW_SKIP_WEBSERVER=1 npx playwright test e2e/san-896-ck-v2-evidence.spec.ts --project=chromium --workers=1
```

## Personas

| Persona | Surface | Result |
|---------|---------|--------|
| **Camila** | `/chat` — events prompt | Event cards render via v2 CopilotKit + conciergeAgent |
| **Roberto** | `/host/event/new` | Wizard shell, copilot region, agent form fill / HITL |
| **Patricia** | `/host/analytics` | Analytics shell + ops chat region |
| **Sofía** | `check:mastra` in floor | CI catches bare v1 reintroduction post-#249 |

## Non-blockers

- Local `npm run floor` may fail on **untracked** `scripts/linear-rentals-*.mjs` lint warnings — not on `main`; use CI floor.
- `search-tool-renders-v2.test.tsx` one stale string assertion — not a runtime regression.

## Prod

Not run in this pass — next: Tier-1 prod smoke at `https://www.mdeai.co/` after Vercel promotes `e0621c7c`.
