# PERF-001b — Distributed CopilotKit rate limit — RESULTS

**Task:** PERF-001b · Class **C** · P0 flood protection for `/api/copilotkit`

## Incident summary (verified via Vercel CLI, 2026-06-15)

| Signal | Value |
|--------|-------|
| Date (UTC) | 2026-06-12 · 19:55–20:08 (~13 min) |
| Route | `/api/copilotkit/[[...path]]` |
| Client IP | `186.81.102.183` (Colombia · 1,361 / 1,363 requests) |
| Peak 5m bucket (20:05 UTC) | 1,355 invocations · 1,292,332 ms active CPU |
| `ai_runs` in window | 1 row — mostly handshake/sync POSTs, not full agent turns |
| Root cause | Single-IP flood bypassed **in-process** VERCEL-CPU-001 buckets across Fluid Compute instances |

## Limits chosen

| Bucket | Key pattern | Max | Window |
|--------|-------------|-----|--------|
| Hard IP ceiling | `copilotkit:ip-hard:{ip}` | **300** | 5 min |
| Anonymous IP | `copilotkit:anon:{ip}` | **30** | 5 min |
| Authenticated user | `copilotkit:user:{userId}` | **120** | 5 min |

**Store:** Supabase Postgres `public.check_rate_limit` RPC (existing durable limiter — no new migration).

**Fallback:** If RPC unavailable → fail **open** for normal traffic; per-instance emergency brake at **80 req/min/IP** → fail **closed**.

**Gate order on route:**

1. `assertCopilotKitAuthorized`
2. Distributed IP hard ceiling (before `getUser`)
3. Supabase `getUser`
4. Distributed anon/user bucket (before Mastra runtime)
5. CopilotKit / Mastra handler

## Files changed

| File | Change |
|------|--------|
| `src/lib/distributed-rate-limit.ts` | RPC wrapper + IP redaction |
| `src/lib/copilotkit-distributed-rate-limit.ts` | CopilotKit buckets, 429 body/headers, emergency fallback |
| `src/app/api/copilotkit/[[...path]]/route.ts` | Wire distributed gates; remove in-process copilotkit checks |
| `src/lib/api-ip-rate-limit.ts` | Comment — legacy copilotkit buckets kept for unit tests only |

## Required env vars

| Variable | Required | Notes |
|----------|----------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes (prod)** | F13 carve-out — server route only; powers `check_rate_limit` RPC |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Service client URL |
| `COPILOTKIT_API_KEY` | Optional | Existing auth gate unchanged |

No Upstash / Vercel KV added — Supabase durable limiter already on prod.

## Test output

```bash
npm test -- --run \
  src/lib/__tests__/copilotkit-distributed-rate-limit.test.ts \
  src/lib/__tests__/distributed-rate-limit.test.ts \
  src/__tests__/api/copilotkit-rate-limit-route.test.ts
```

**Result:** 12/12 passed (2026-06-15)

Coverage:

- 31st anonymous request → 429 + `retryAfter` + rate-limit headers
- Authenticated under/over user limit
- IP hard ceiling before auth
- Blocked request does not call Mastra runtime
- Under-limit empty POST still returns handler 400
- RPC error → fail open; local emergency flood → 429

## Simulated flood (would-have-blocked)

With limits above, the Jun 12 incident would hit:

| Request # | Gate | Outcome |
|-----------|------|---------|
| 31 | `copilotkit:anon:{ip}` | **429** (anonymous bucket) |
| 301 | `copilotkit:ip-hard:{ip}` | **429** (hard ceiling) |

Actual flood reached **1,355** in one 5m bucket — in-process limiter never shared state across instances.

## Rollback steps

1. Revert route to in-process `checkCopilotKitIpGate` + `checkCopilotKitRateLimit` from `api-ip-rate-limit.ts`.
2. Remove imports of `copilotkit-distributed-rate-limit` (optional — modules are inert if unused).
3. Redeploy prod — no schema rollback needed (`rate_limit_hits` table is harmless).

## Next (ordered)

1. **PERF-001** — single `conciergeAgent` subscription (reduce normal POST fan-out)
2. **PERF-003** — POST budget test + Observability alert
3. **PERF-002** — cap long agent turns
