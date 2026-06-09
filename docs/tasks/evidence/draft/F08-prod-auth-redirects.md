# Supabase Auth redirect URLs (operator checklist)

Project: `zkwcbyxiwklihegjhuql`  
Dashboard: https://supabase.com/dashboard/project/zkwcbyxiwklihegjhuql/auth/url-configuration

## Site URL (pick primary prod entry point)

- `https://mdeapp.vercel.app` (Vercel alias)
- or `https://www.mdeai.co` if that is the canonical marketing domain

## Redirect URLs (add all — must match `redirectTo` exactly)

```
http://localhost:3001/auth/callback
https://mdeapp.vercel.app/auth/callback
https://www.mdeai.co/auth/callback
https://mdeai.co/auth/callback
```

**Symptom:** OAuth lands on `https://www.mdeai.co/?code=…` (home, not `/auth/callback`) → allowlist or `NEXT_PUBLIC_SITE_URL` does not match the hostname Supabase used. mdeapp middleware relays `?code=` → `/auth/callback` as a safety net; still fix dashboard + Vercel env.

## Vercel `NEXT_PUBLIC_SITE_URL`

Must match the hostname users sign in on (e.g. `https://www.mdeai.co` if marketing URL is www). Wrong value → `signInWithOAuth` sends `https://mdeai.co/auth/callback` while Site URL is www → Supabase drops `code` on `/`.

## `otp_expired` troubleshooting

- Request a **fresh** magic link (old links expire).
- Link must match an allowlisted redirect URL exactly.
- `NEXT_PUBLIC_SITE_URL` on Vercel must match the domain in the email link origin.
