---
id: F08
title: Supabase Auth + /login page
status: Done
priority: P1
phase: W2 — Day 2-3
effort: 3-4h (Supabase SSR setup + /login + middleware + session helpers)
owner: claude
depends_on: [F06, F07]
skill: [mde-supabase, copilotkit-integrations, supabase, supabase-postgres-best-practices]
verified_against:
  - /home/sk/mdeai/plan/prd/02-users-flows.md §8 (Personas — Sofía host signup)
  - /home/sk/mdeai/plan/prd/03-architecture.md §14 (Supabase architecture — 122 tables RLS-tight)
  - /home/sk/mdeai/plan/audit/04-supabase-audit.md §3a (auth: 9 users, 45 sessions live)
  - https://supabase.com/docs/guides/auth/server-side/nextjs (Supabase Next.js SSR)
---

# F08 — Supabase Auth + `/login` page

## 1. Purpose

`mdeapp` needs **authenticated routes** for Roberto (W3 `/host/event/new` HITL surface) and Camila (W5+ saved-listings, ticket purchases). Per PRD §14 the legacy Supabase project (`zkwcbyxiwklihegjhuql`) has **9 production auth users + 45 sessions**; F08 wires `mdeapp` into the same auth backend with magic-link email login. Foundation for every gated surface in W3-W10.

## 2. Goals

- `@supabase/ssr` installed (replaces deprecated `@supabase/auth-helpers-nextjs`)
- 3 Supabase client factories in `mdeapp/src/lib/supabase/`:
  - `client.ts` — browser/RSC public client (anon key)
  - `server.ts` — server-component / route-handler client (anon key + cookies)
  - `middleware.ts` — refreshes session cookies on every request
- `mdeapp/src/middleware.ts` (Next.js middleware) calls the helper above to keep sessions alive
- `/login` route at `mdeapp/src/app/login/page.tsx` with email magic-link form
- `/auth/callback/route.ts` handles the magic-link exchange
- `/auth/signout/route.ts` for signout
- `useSession()` hook OR server helper available to other components
- 9 existing legacy auth users sign in via mdeapp without re-registration

## 3. Features (what the user gets)

- **Sofía / Roberto / Camila:** types email → gets magic link → clicks → lands in mdeapp authenticated. Session persists for ≤ 7 days (Supabase default).
- **Sofía (dev):** any new route can be auth-gated via a single `await getServerSession()` call

## 4. Workflows

1. **Pre-flight (per `mde-supabase` skill):**
   - Confirm 9 users + 45 sessions still exist: Supabase MCP `execute_sql "SELECT count(*) FROM auth.users"` → expect 9
   - Confirm `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `mdeapp/.env.local` (F04 wired)
   - Verify auth setting: Supabase Dashboard → Auth → magic link enabled (per `supabase` skill — read-only check)

2. **Install + scaffold:**
   ```bash
   cd mdeapp && npm install @supabase/ssr @supabase/supabase-js
   ```

3. **Create 3 client files** under `mdeapp/src/lib/supabase/` (paste from Supabase docs template — *do not modify cookie API*; bugs are subtle):
   - `client.ts`: `createBrowserClient(url, anonKey)`
   - `server.ts`: `createServerClient(url, anonKey, { cookies: { getAll, setAll } })`
   - `middleware.ts`: refresh-cookie helper using `request.cookies` + `response.cookies`

4. **Add Next.js middleware:**
   ```ts
   // mdeapp/src/middleware.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { updateSession } from '@/lib/supabase/middleware';
   export async function middleware(req: NextRequest) {
     return await updateSession(req);
   }
   export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|api/copilotkit).*)'] };
   ```

5. **Build `/login` page** (mdeapp/src/app/login/page.tsx):
   - shadcn `<Input>` + `<Button>` + `<Card>` shell (F07 dependency)
   - Server action `signIn` calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: <SITE_URL>/auth/callback } })`
   - Shows "Check your email for the magic link" on success

6. **Build callback route** (`mdeapp/src/app/auth/callback/route.ts`):
   - Reads `?code=…` from URL
   - Calls `supabase.auth.exchangeCodeForSession(code)`
   - Redirects to `/` (or `?next=…` if present)

7. **Build signout route** (`mdeapp/src/app/auth/signout/route.ts`):
   - POST handler calls `supabase.auth.signOut()` + redirects to `/`

8. **Verify against 1 legacy user:** sign in with one of the 9 existing emails; confirm `auth.sessions` table gets a new row.

## 5. User journeys

- **Roberto:** visits `/host/event/new` (W3) → middleware redirects to `/login` → enters email → clicks magic link → lands back at `/host/event/new` authenticated
- **Camila:** visits `/rentals` (W5) → no auth required → clicks "Save listing" → middleware redirects to `/login` → after auth, saves the listing
- **Sofía (dev):** wraps any future server component with `const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();`

## 6. Agents

None directly — auth is infrastructure. W3+ HITL agent surfaces (`ApprovalPanel`) read `user_id` from session.

## 7. Integrations

| Integration | Purpose | Auth method |
|---|---|---|
| Supabase Auth | OTP / magic link to email | `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public) |
| Supabase SSR (cookies) | Refresh session per request | Server-only — `auth.sessions` row maintained |
| Resend / SMTP (existing legacy SendGrid config) | Magic-link email delivery | Supabase dashboard handles |
| RLS policies on user-scoped tables (events, rentals, leads) | `auth.uid()` checks | Already in place per legacy migrations |

## 8. Summary

Wire `mdeapp` to the legacy Supabase Auth backend via `@supabase/ssr`. 9 existing users can sign in via magic link from `/login`. Foundation for every gated route in W3+. We'll know it worked when (a) `auth.sessions` table gets a new row after a legacy user signs in via mdeapp, and (b) protected routes redirect unauthenticated users to `/login`.

## 9. Definition of Done

- [x] `@supabase/ssr` + `@supabase/supabase-js` installed
- [x] `mdeapp/src/lib/supabase/{client,server,middleware}.ts` all exist
- [x] `mdeapp/src/middleware.ts` exists with auth matcher
- [x] `mdeapp/src/app/login/page.tsx` renders magic-link form
- [x] `mdeapp/src/app/auth/callback/route.ts` handles `?code=` exchange
- [x] `mdeapp/src/app/auth/signout/route.ts` POST handler
- [ ] Sign in with one legacy email → `auth.sessions` row +1 (requires operator: click magic link in inbox)
- [ ] Sign out → `auth.sessions` row removed (requires authenticated session first)
- [x] No `SUPABASE_SERVICE_ROLE_KEY` referenced anywhere in `mdeapp/src/**` (hook check)
- [x] Existing `/` chat continues working (Mastra calls don't require auth in W2)

## 10. Tests

### Acceptance tests (automated)

| # | Test | Command | Expected |
|---|---|---|---|
| T1 | @supabase/ssr installed | `node -p "require('mdeapp/package.json').dependencies['@supabase/ssr']"` | `^X.Y.Z` |
| T2 | 3 client files | `ls mdeapp/src/lib/supabase/{client,server,middleware}.ts` | all 3 exist |
| T3 | middleware.ts exists | `test -f mdeapp/src/middleware.ts` | OK |
| T4 | /login route exists | `test -f mdeapp/src/app/login/page.tsx` | OK |
| T5 | callback route exists | `test -f mdeapp/src/app/auth/callback/route.ts` | OK |
| T6 | signout route exists | `test -f mdeapp/src/app/auth/signout/route.ts` | OK |
| T7 | No service-role leak | `! grep -rn 'SUPABASE_SERVICE_ROLE_KEY' mdeapp/src/` | OK |
| T8 | Build green | `npm run build` | exit 0 |
| T9 | Auth users count unchanged after smoke | Supabase MCP `execute_sql "SELECT count(*) FROM auth.users"` | 9 (or current count) |

### Manual / chrome-devtools MCP tests

| # | Test | How | Expected |
|---|---|---|---|
| Tm1 | /login page loads | Navigate `localhost:<port>/login` | Magic-link form visible |
| Tm2 | Submit form | Type email + click button | "Check your email" message |
| Tm3 | Click magic link (in real email) | redirects to `/auth/callback?code=...` → `/` | Logged in |
| Tm4 | Session persists | Reload `/` | Still logged in (cookies present) |
| Tm5 | Sign out | POST `/auth/signout` | Redirects to `/`; subsequent `/` shows unauthenticated state |
| Tm6 | Protected route redirect | Visit `/host/event/new` (W3 placeholder) unauth | Redirects to `/login?next=/host/event/new` |

### Database verification

| # | Test | SQL | Expected |
|---|---|---|---|
| Td1 | New session created on magic-link click | `SELECT count(*) FROM auth.sessions WHERE updated_at > now() - interval '5 minutes'` | ≥ 1 |
| Td2 | RLS still allows anon read on `events.is_active=true` | `SELECT count(*) FROM public.events WHERE is_active=true LIMIT 1` (via anon key) | ≥ 1 |

## Notes / verification

- **Supabase SSR vs auth-helpers:** The `@supabase/ssr` package replaces `@supabase/auth-helpers-nextjs` (deprecated). Always use `@supabase/ssr` for new Next.js apps. Per `mde-supabase` skill.
- **Cookie API caveats:** `getAll() / setAll()` must be implemented exactly per Supabase docs — wrong implementation causes silent session loss. Don't refactor the cookie helpers.
- **Service-role boundary:** auth flows use only anon key. Service-role goes only to edge functions (legacy: `chat-lead-capture`, `ticket-checkout`, etc.) — `no-service-role-in-src.mjs` hook enforces.
- **Defer to Phase 2:** OAuth providers (Google, Apple), MFA, role-based access control beyond `auth.users.role`, profile editing UI
- **Defer to W3:** `useUser()` React hook + auth state in `<CopilotKit>` context (so agents know who they're talking to)
