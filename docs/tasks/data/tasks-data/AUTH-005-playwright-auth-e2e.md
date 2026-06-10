---
id: AUTH-005
title: Playwright — magic link + Google auth smoke
status: Ready
priority: P2
phase: core
persona: sanjiovani
project: sofia-platform
milestone: P2
imp: "090"
linear: null
percent: 0
blocked_by: []
blocks: []
effort: 4h
owner: sanjiovani
depends_on: [AUTH-001, AUTH-003]
skill: [mde-supabase, playwright-cli, webapp-testing]
verified_against:
  - https://supabase.com/docs/guides/auth/social-login/auth-google
  - SCREEN-013 OTP inject pattern (admin generateLink + verifyOtp)
---

# AUTH-005 — Playwright auth E2E

## Purpose

**Lucía** can prove login works in CI without manual inbox — same pattern as SCREEN-013 for `qa-landlord@mdeai.co`.

## Goals

- `mdeapp/e2e/auth-magic-link.spec.ts` — OTP inject → `/trips` shows data
- `mdeapp/e2e/auth-google.spec.ts` — **manual/staging only** (`E2E_GOOGLE=1`); never run real Google OAuth in CI (flaky + secret handling risk)
- Load `.env.local` in specs (inline loader from SCREEN-013)
- Document `E2E_BYPASS_AUTH=1` vs full auth tests

## Workflows

1. Reuse admin `generateLink` + `verifyOtp` for magic link path.
2. Google: manual-only or stub with service account — do not commit Google passwords.
3. Assert middleware: logged-out `/trips` → `/login` when bypass off.

## Definition of Done

- [ ] Magic link E2E passes in `npm run test:e2e`
- [ ] Evidence in `tasks/notes/AUTH-005-evidence.md`
- [ ] No secrets in spec files

## Tests

| # | Spec | Expected |
|---|------|----------|
| T1 | auth-magic-link | trips dashboard visible |
| T2 | auth-middleware | redirect when bypass off |
