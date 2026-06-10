---
id: AUTH-001
title: Google OAuth — login/signup UI + server action
status: Done
priority: P1
phase: Auth — Day 1
effort: 3h
owner: claude
depends_on: [F08, AUTH-002]
blocks: [AUTH-005]
skill: [mde-supabase, copilotkit-setup]
verified_against:
  - https://supabase.com/docs/guides/auth/social-login/auth-google
  - https://supabase.com/docs/guides/auth/server-side/nextjs
  - Supabase MCP search_docs 2026-05-20 (signInWithOAuth, redirectTo)
---

# AUTH-001 — Google OAuth in mdeapp

## Purpose

**Camila** and **Roberto** can sign in with Google on `/login` and `/signup`, landing back on `?next=` via the **same** PKCE callback as magic link (`/auth/callback`).

## Goals

- `signInWithOAuth({ provider: 'google', options: { redirectTo } })` server action
- “Continue with Google” on `AuthEmailForm` (login + signup modes)
- `redirectTo` = `${NEXT_PUBLIC_SITE_URL}/auth/callback?next=<safeNextPath>`
- No new callback route — reuse `src/app/auth/callback/route.ts`

## Workflows

1. **Add** `src/lib/auth/oauth.ts` or extend `src/app/auth/actions.ts`:
   ```ts
   const redirectTo = new URL("/auth/callback", origin);
   redirectTo.searchParams.set("next", next);
   await supabase.auth.signInWithOAuth({
     provider: "google",
     options: { redirectTo: redirectTo.toString() },
   });
   ```
   Per [Google login guide](https://supabase.com/docs/guides/auth/social-login/auth-google) — application code path.

2. **Update** `src/components/auth/auth-email-form.tsx`:
   - Secondary button “Continue with Google”
   - Server action calls `signInWithOAuth`; on `data.url`, use `redirect(data.url)` from `next/navigation` in the server action (required for server-side OAuth — see [Supabase troubleshooting](https://supabase.com/docs/guides/troubleshooting/oauth-sign-in-isnt-redirecting-on-the-server-side-ShGMtr))

3. **Do not** add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Supabase hosts OAuth ([Auth guide](https://supabase.com/docs/guides/auth)).

4. **Verify** `safeNextPath` still blocks open redirects.

## Integrations

| Integration | Auth |
|-------------|------|
| Supabase Auth | Anon key + OAuth |
| CopilotKit | Unchanged — session cookies picked up in `/api/copilotkit` `getUser()` |

## User journeys

- Roberto: `/host/event/new` → login → Google → returns to host wizard authenticated.
- Camila: `/trips` → login → Google → sees trip cards.

## Definition of Done

- [ ] Google button visible on `/login` and `/signup`
- [ ] Click Google → Google consent → `/auth/callback` → `next` path with session cookies
- [ ] `npm run build` exit 0
- [ ] No new secrets in `mdeapp/src/**`
- [ ] Evidence: `tasks/notes/AUTH-001-evidence.md` + localhost screenshot or curl cookie check

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | `test -f mdeapp/src/app/auth/actions.ts` | OAuth action exists |
| T2 | Manual localhost Google sign-in | `getUser()` non-null on `/trips` |
| T3 | `! grep -rn SUPABASE_SERVICE_ROLE mdeapp/src/components/auth` | OK |

## Notes

- CopilotKit Mastra example has no OAuth — this is mdeapp-specific, correct per F08 + architecture doc §20.
