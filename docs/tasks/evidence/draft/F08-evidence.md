# F08 evidence — Supabase Auth + login (2026-05-21)

## Automated (floor)

| Check | Result |
|-------|--------|
| `@supabase/ssr` + `@supabase/supabase-js` installed | ✅ |
| `src/lib/supabase/{client,server,middleware}.ts` | ✅ |
| `src/middleware.ts` | ✅ |
| `/login`, `/signup`, `/auth/callback`, `/auth/signout` | ✅ |
| `/host/event/new` protected placeholder | ✅ |
| No `SUPABASE_SERVICE_ROLE_KEY` in `src/**` | ✅ |
| `npm run floor` | ✅ exit 0 (5 Vitest tests) |

## Supabase MCP

| Query | Result |
|-------|--------|
| `auth.users` count | 9 |
| `auth.sessions` count | 34 (at audit time) |

## Browser (Chrome DevTools MCP)

See session report in changelog 2026-05-21 F08 entry.

## Operator checklist (before magic-link E2E)

1. Supabase Dashboard → Authentication → URL Configuration:
   - Site URL: `http://localhost:3001`
   - Redirect URLs: `http://localhost:3001/auth/callback`
2. Optional: `NEXT_PUBLIC_SITE_URL=http://localhost:3001` in `mdeapp/.env.local`
3. Email provider enabled (magic link / OTP)

## Deferred (per F08 spec)

- OAuth (Google) — Phase 2
- Password login UI — legacy uses password; mdeapp W2 is magic-link only
- `useUser()` in CopilotKit context — W3
