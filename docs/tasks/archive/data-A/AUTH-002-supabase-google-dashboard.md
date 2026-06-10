---
id: AUTH-002
title: Supabase Dashboard — Google OAuth + redirect URLs
status: Done
priority: P1
phase: Auth — Day 0
effort: 1h
owner: claude
depends_on: [F08]
blocks: [AUTH-001, AUTH-005]
skill: [mde-supabase, supabase]
verified_against:
  - https://supabase.com/docs/guides/auth/social-login/auth-google
  - Supabase MCP search_docs 2026-05-20 (Login with Google)
---

# AUTH-002 — Supabase Dashboard: Google provider

## Purpose

Enable Google as an identity provider on the **existing** project `zkwcbyxiwklihegjhuql` so mdeapp can call `signInWithOAuth({ provider: 'google' })` without a second auth system.

## Goals

- Google provider enabled in Supabase Dashboard → Authentication → Providers
- GCP OAuth client ID + secret configured (Web application)
- Redirect URLs include local + staging + production `/auth/callback`

## Workflows

1. **GCP Console** ([Google OAuth doc](https://supabase.com/docs/guides/auth/social-login/auth-google)):
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized JavaScript origins: `http://localhost:3001`, production origin
   - Authorized redirect URI: `https://zkwcbyxiwklihegjhuql.supabase.co/auth/v1/callback`

2. **Supabase Dashboard** → Authentication → Providers → Google:
   - Paste Client ID + Client Secret
   - Enable provider

3. **Supabase Dashboard** → Authentication → URL Configuration:
   - Site URL: `https://www.mdeai.co` (or apex if that is canonical — must match live hostname)
   - Redirect URLs (allow list), each on its own line — **exact** `/auth/callback` paths:
     - `http://localhost:3001/auth/callback`
     - `http://localhost:3000/auth/callback` (optional squatter port)
     - `https://www.mdeai.co/auth/callback`
     - `https://mdeai.co/auth/callback`
     - `https://<vercel-preview>/auth/callback`
   - **Symptom:** OAuth lands on `https://www.mdeai.co/?code=…` (home, not `/auth/callback`) → allowlist or Vercel `NEXT_PUBLIC_SITE_URL` mismatch; see `tasks/notes/draft/F08-prod-auth-redirects.md`
     - `https://<production-domain>/auth/callback`

4. **Verify magic link still works** — Google is additive; do not disable Email provider.

## Personas

- **Camila / Roberto:** “Continue with Google” on `/login` will fail until this task is Done.

## Agents

None.

## Definition of Done

- [ ] Google provider shows **Enabled** in Supabase Dashboard
- [ ] Redirect URL list includes `http://localhost:3001/auth/callback`
- [ ] Operator note in `tasks/notes/AUTH-002-evidence.md` (screenshot or checklist — no secrets)

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | Dashboard Google toggle | Enabled |
| T2 | Supabase Auth settings → redirect URLs | Contains localhost:3001 callback |

## Notes

- No code in this task — blocks AUTH-001.
- Per `mde-supabase`: never commit GCP client secret to git.
- **Security:** If the OAuth client secret was exposed (chat, logs, screenshot), rotate it in [Google Cloud Console](https://console.cloud.google.com/auth/clients) and update Supabase [providers](https://supabase.com/dashboard/project/zkwcbyxiwklihegjhuql/auth/providers) immediately.
