# SCREEN-017 Evidence — Login / Signup Polish

**Date:** 2026-06-02  
**Status:** Done

## Changes made
- `src/components/auth/auth-email-form.tsx`: Added mdeai sparkle logo (`<Sparkles>` + "mdeai" in primary color) above card title; added `data-testid` on card, title, email input, magic-link button, Google button, error alert

## Dev server
- Server: `next dev --webpack -p 3001` (PID 344892)
- `curl http://localhost:3001/login` → 200 ✅
- `curl http://localhost:3001/signup` → 200 ✅

## Browser MCP verification
- `/login`: sparkle icon + "mdeai" brand, "Sign in" title, email input, "Email magic link" button, "Continue with Google" button, footer links — all rendered ✅  
- `/signup`: same brand treatment, "Create account" title — rendered ✅  
- Console: 0 errors (only pre-existing Lit dev-mode warn + font preload warn) ✅

## Screenshots
- `mdeapp/tmp/screenshots/SCREEN-017/login.png`
- `mdeapp/tmp/screenshots/SCREEN-017/signup.png`

## Acceptance criteria
- [x] Login/signup match brand tokens (sparkle + primary colour)
- [x] `next` redirect works after auth (param forwarded in hidden inputs)
- [x] English only UI copy
