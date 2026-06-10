---
id: AUTH-006
linear: SAN-TBD
title: Mobile Auth Stability — OAuth, Deep Links, Session Recovery
status: Not Started
priority: P1
phase: MVP Phase 1 Polish
effort: 4h
milestone: M4
depends_on:
  - SCREEN-018
  - AUTH-005
skill:
  - mde-task-lifecycle
  - mobile-responsiveness
  - responsive-design
  - tailwind-responsive-ui
  - mde-supabase
playwright_spec: ../../../mdeapp/e2e/screens/AUTH-006-mobile-auth.spec.ts
path: /login
---

# AUTH-006 — Mobile Auth Stability — OAuth, Deep Links, Session Recovery

## Goal
Google OAuth redirect works on iOS Safari; magic link deeplinks back to app correctly; session cookie survives app backgrounding; login form usable at 390px; no auth loop on mobile.

## User story
As **Camila** on iPhone, I sign in with Google and land back on the page I was viewing — the `?next=` redirect param is preserved through the OAuth flow.

## Screen / path
`/login`, `/signup` — `<390px` viewport

## Current status
**Not Started** — depends on SCREEN-018 (safe areas). AUTH-005 (Playwright auth e2e) is a prerequisite for test infrastructure.

## Build scope

### Frontend
- `src/app/login/page.tsx` / `src/app/signup/page.tsx`
  - Login card: `max-w-sm w-full mx-auto p-4` — full-width at 390px
  - Email input: `type="email"`, `autocomplete="email"`, `inputmode="email"`, `font-size: 1rem`
  - Password input: `type="password"`, `autocomplete="current-password"`, `font-size: 1rem`
  - Password show/hide toggle button: `min-h-[44px] min-w-[44px]`, `aria-label="Show password"`
  - Submit button: `w-full h-12 min-h-[44px]`
  - Google OAuth button: `w-full h-12` with Google logo icon
  - Error banner: `role="alert"` above form, full-width, visible at 390px
  - `data-testid="login-form"`, `data-testid="google-oauth-button"`, `data-testid="password-toggle"`

### Auth flow
- `src/lib/supabase/client.ts` — Supabase browser client (anon key only)
  - `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback?next=' + encodeURIComponent(next) } })`
  - `?next=` param: read from `useSearchParams()` before redirect; encode into `redirectTo`
- `src/app/auth/callback/route.ts` (server route)
  - Parse `code` + `next` from URL
  - `supabase.auth.exchangeCodeForSession(code)` — PKCE flow (required for iOS ITP)
  - Redirect to `next` after session established
  - `data-testid` not applicable (server route)
- `src/hooks/use-auth-state.ts` (verify or create)
  - `supabase.auth.onAuthStateChange` handler: on `SIGNED_IN` → redirect to stored `?next=`
  - `SIGNED_OUT` → clear local state
- Magic link: `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: ... } })`
  - Verify deeplink opens in in-app browser (not external Safari) on iOS
  - `window.location.hash` parsing for token in callback route

### Session resilience
- iOS ITP mitigation: use PKCE (`flowType: 'pkce'` in Supabase client config)
- App background recovery: `supabase.auth.getSession()` on `visibilitychange` event → refresh token if < 60s remaining
- Session storage fallback not needed with PKCE — server-side session via cookie

### Supabase
- RLS: all auth routes use anon key (no service-role in login/signup pages)
- Session cookie: `SameSite=Lax`, `HttpOnly`, correct domain

## Acceptance criteria
- [ ] Google OAuth preserves `?next=` param through redirect — lands on correct page after sign-in
- [ ] Magic link email opens in-app on iOS (not external Safari tab)
- [ ] Session survives app background/foreground cycle (tested via `visibilitychange`)
- [ ] Login form usable at 390px — no overflow, all fields and button fully visible
- [ ] Password show/hide toggle ≥ 44px tap target (`data-testid="password-toggle"`)
- [ ] Error messages visible on mobile (`role="alert"` + full-width banner)
- [ ] Logout works on mobile and clears session
- [ ] Session cookie set with correct domain (no auth loop on next page load)
- [ ] No auth loop after successful login — user is not redirected back to `/login`
- [ ] 0 console errors on login form render + OAuth redirect

## Tests
```bash
cd mdeapp && npm test -- --run
npm run lint
npm run typecheck
npm run build
npm run verify:console
npm run floor
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/AUTH-006-mobile-auth.spec.ts --project=webkit
```

## Evidence required
- [ ] Screenshot: login form at 390px — full-width card, all fields visible
- [ ] Playwright webkit mobile spec pass (OAuth flow mocked or real)
- [ ] `npm run floor` exit 0

## Dependencies
- SCREEN-018 ✅ (safe areas in layout)
- AUTH-005 (Playwright auth e2e infrastructure)

## Runtime proof (dev restart + Browser)

### Step 1 — Restart dev server
```bash
lsof -ti :3001 | xargs -r kill -9
cd mdeapp && npm run dev
```
Probe:
```bash
curl -s -o /dev/null -w "AUTH-006 login → %{http_code}\n" --max-time 15 -L http://localhost:3001/login
```

### Step 2 — Browser MCP proof
| Step | Action | Pass |
|------|--------|------|
| 1 | Navigate `/login` at 390×844 | Form renders full-width |
| 2 | Inspect email input | `font-size: 16px`, `type=email` |
| 3 | Tap password toggle | Password visibility toggles |
| 4 | Measure Google OAuth button | ≥ 44px height |
| 5 | Console check | 0 errors |

---

## Auth flow diagram

```mermaid
flowchart TD
    A[User visits protected route] --> B{Session valid?}
    B -->|Yes| C[Render page]
    B -->|No| D[Redirect to /login?next=protected-url]
    D --> E{Auth method}
    E -->|Google OAuth| F[supabase.signInWithOAuth\nredirectTo includes ?next=]
    E -->|Magic link| G[supabase.signInWithOtp\nopen in-app browser]
    F --> H[Google consent screen]
    H --> I[/auth/callback?code=...&next=...]
    G --> I
    I --> J[exchangeCodeForSession PKCE]
    J --> K[Session cookie set]
    K --> L[Redirect to ?next= value]
    L --> C
```

## Common failure points
1. **iOS Safari ITP blocks third-party cookies** — Supabase auth requires first-party cookie handling; use PKCE `flowType: 'pkce'` in `createBrowserClient` options; cookie-based sessions work; localStorage-based sessions do not survive ITP.
2. **Chrome Android Custom Tabs cookie isolation** — when Google OAuth opens in a Custom Tab, it shares cookies with Chrome but NOT with PWA standalone mode; test PWA install + OAuth specifically.
3. **App backgrounding > 30 min** — Supabase access tokens expire after 1 hour; the `visibilitychange` handler must call `getSession()` on foreground and refresh if needed to prevent silent expiry.
4. **`?next=` param URL-encoding** — if `next` contains `/events/[slug]?ticket=true`, it must be double-encoded in the `redirectTo`; test with a `?next=` that contains its own query params.
5. **Auth loop from stale cookie** — if the session cookie domain doesn't match the app domain (e.g., `localhost` vs `127.0.0.1`), the browser sends no cookie, auth middleware redirects every request to `/login`; verify `NEXT_PUBLIC_SUPABASE_URL` and cookie domain match.

## Done gate (all required)
- [ ] Dev server restarted clean
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright webkit mobile spec pass
- [ ] `npm run floor` exit 0
- [ ] No service-role key in login/signup page components
- [ ] Screenshots under `mdeapp/tmp/screenshots/AUTH-006/`

## Do not do
- Do not store session tokens in `localStorage` — use Supabase PKCE cookie flow
- Do not skip `?next=` param encoding — test with URLs containing their own query strings
