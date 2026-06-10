# F13 — ai_runs observability evidence

**Date:** 2026-05-21  
**Status:** **Done** (localhost + production)  
**GitHub main:** `d7667ac` (`344e667` F13 bundle + service client)

## Commits

| SHA | Message |
|-----|---------|
| `344e667` | feat: CopilotKit Mastra ai_runs observability |
| `d7667ac` | fix(supabase): centralize service-role client + verify script |

## Automated gates

| Command | Result |
|---|---|
| `npm test` | **11/11** pass |
| `npm run floor` | exit **0** |
| `npm run verify:supabase` | **PASS** |

## Localhost (gate 9)

| Check | Result |
|---|---|
| Chat + `POST /api/copilotkit` | **200** |
| `ai_runs` row | `ping-agent`, `gemini-3.5-flash`, `general_concierge` |

## Production (gate 9.5 — Patricia / Sofía)

| Check | Result |
|---|---|
| Deploy | Vercel **Ready** (`amo100/mdeapp`) after user redeploy + Supabase env |
| `https://mdeapp.vercel.app` chat | ✅ replies; `POST /api/copilotkit` **200** |
| `ai_runs` after prod chat | ✅ `ping-agent`, `model_name: gemini-3.5-flash`, `metadata.integration: copilotkit-pattern-1`, `duration_ms` ~2232–2346, `2026-05-21 06:29:30–32 UTC` |

## Vercel env (Production + Preview)

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — present (required for F13 writes)
- Client: `NEXT_PUBLIC_SUPABASE_*`, `GOOGLE_GENERATIVE_AI_API_KEY`, `LOG_LEVEL`, `NEXT_PUBLIC_SITE_URL`

## Known non-issues

- `model_name: env-probe` rows — from `npm run verify:supabase`, not chat
- `user_id: null` — expected until auth wired into `logAgentRunForTurn`
- Vercel **Development** env may still lack server Supabase vars — use local `.env.local` for `vercel dev`
