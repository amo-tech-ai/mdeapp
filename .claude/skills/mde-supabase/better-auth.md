---
parent: mde-supabase
name: better-auth-best-practices
description: "Use when working on auth, identity, or RLS in mdeai.co. Triggers: 'account_type', 'user_metadata', 'app_metadata', 'JWT claim', 'RLS policy', 'sign-in', 'OAuth', 'signed token', 'magic link', 'session'. Built on better-auth-best-practices (skills.sh) + the Supabase-specific gotchas we hit in D2/D5."
metadata:
  source: https://skills.sh/ (better-auth-best-practices)
  installed: 2026-04-29
  version: "0.1.0"
  origin: external + mdeai.co Supabase-Auth adaptations
---

# Auth best practices — mdeai.co (Supabase Auth)

Auth bugs are the most expensive class of bug we ship. D2 + D5 each shipped one. This skill captures the patterns that prevent the next one.

## When to invoke

- Adding/changing any auth flow (signup, signin, OAuth, magic link)
- Writing or modifying any RLS policy
- Reading user metadata for ANY decision (UI routing, server logic)
- Designing signed tokens (verification email links, doc-review tokens)
- Touching `auth.users`, `auth.identities`, or related tables

## Rule 1 — Never use `user_metadata` for authorization

Supabase's `raw_user_meta_data` is **user-editable** via the JS client (`supabase.auth.updateUser({ data: ... })`). It appears in JWT claims as `user_metadata`. **Do NOT use it for any authorization decision.**

### Today's V1 violation (acceptable smell, must fix in D6)

`pages/host/Onboarding.tsx` and `pages/host/ListingNew.tsx` route on `user.user_metadata.account_type === 'landlord'`. A renter who edits their own metadata could see the wizard.

**Why it's not a security HOLE today:** the actual data gate is RLS on `landlord_profiles` — `user_id = auth.uid()`. A "renter" who promotes themselves to landlord can create their own landlord_profiles row, but that's allowed by design (they ARE that user; they just changed their UI track).

**Fix for D6:** move `account_type` to `raw_app_meta_data` via a server-only trigger:

```sql
CREATE OR REPLACE FUNCTION public.set_account_type_on_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.raw_user_meta_data ? 'account_type' THEN
    NEW.raw_app_meta_data = NEW.raw_app_meta_data || jsonb_build_object(
      'account_type', NEW.raw_user_meta_data->>'account_type'
    );
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER set_account_type_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.set_account_type_on_signup();
```

Then RLS / route guards read `auth.jwt() -> 'app_metadata' ->> 'account_type'` (immutable from client).

## Rule 2 — Hand-crafted auth.users rows need the GoTrue-required defaults

D5 case study: we created `qa-landlord@mdeai.co` via direct INSERT and got "Database error querying schema" on signin. Root cause: GoTrue's signin path queries `confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new` and treats NULL as a malformed row. The `signUp` REST endpoint sets these to `''` (empty string). Manual INSERTs must do the same:

```sql
INSERT INTO auth.users (
  ..., confirmation_token, recovery_token, email_change, email_change_token_new, ...
) VALUES (
  ..., '', '', '', '', ...
);
```

Plus `auth.identities` row required:
```sql
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, ...
  -- DO NOT include email column (generated from identity_data->>'email')
) VALUES (...);
```

See migration `20260501000000_landlord_v1_qa_user_seed.sql` for the canonical pattern.

## Rule 3 — UPDATE policy needs a SELECT policy too

Postgres RLS quirk: an UPDATE first SELECTs the row. Without a matching SELECT policy, UPDATE silently returns 0 rows. No error, just no change.

Every `*_update_*` policy needs a paired `*_select_*` policy. Audit pattern:

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname='public' AND tablename LIKE 'landlord_%'
ORDER BY tablename, cmd;
```

For each table, every command that mutates rows (UPDATE / DELETE) should have a corresponding SELECT.

## Rule 4 — `(SELECT auth.uid())` not `auth.uid()` in RLS

Per `supabase-postgres-best-practices` rule `security-rls-performance`: wrap auth.uid() in a subquery so Postgres caches the value once per query, not once per row.

❌ `USING (user_id = auth.uid())` — slow scan
✅ `USING (user_id = (SELECT auth.uid()))` — cached

All V1 D1 policies follow this pattern. Maintain it.

## Rule 5 — Signed tokens with expiry + single-use for email-link actions

D6 verification flow uses signed JWTs in approve/reject email links. Best practice:

- Sign with `SUPABASE_JWT_SECRET` (don't roll your own)
- Include `exp` claim — 24h max for verification links
- Include `jti` (JWT ID) and store consumed jtis in a small table — single-use
- Include the specific action verb (`approve` vs `reject`) so a leaked approve link can't reject

```ts
const token = await create(
  { alg: "HS256", typ: "JWT" },
  { sub: verification_request_id, action: "approve", exp: now + 86400, jti: crypto.randomUUID() },
  jwtSecret,
);
```

## Rule 6 — Deleting a user does NOT invalidate their JWTs

A token issued with 1-hour expiry will work for that hour even after `auth.users` row is deleted. For sensitive actions:

- Keep JWT expiry short (default 60min is fine for V1)
- For "high-stakes" actions (booking confirmation, payment), validate session_id against `auth.sessions` server-side
- Or `supabase.auth.signOut({ scope: 'global' })` to revoke all sessions

## Rule 7 — Service role key stays server-side

The service-role key bypasses RLS — it has full read/write on every table. Its only safe home is edge functions, where it's loaded from Supabase dashboard secrets and never reaches the client.

Project conventions (`.env`):
- `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) — safe in browser. Vite ships any `VITE_*` env var to the bundle.
- `SUPABASE_SERVICE_ROLE_KEY` — edge functions only, no `VITE_*` prefix. Vite strips the var; even if a developer accidentally references it from `src/`, it'll be `undefined` at runtime — but the literal would still appear in source if someone hardcoded it.

If `service_role` shows up anywhere under `src/`, the PR isn't safe to merge — anyone with view-source on the deployed site gets full DB control.

## Companion skills

- `supabase` — RLS policy patterns + general Supabase
- `supabase-auth` (.agents/skills) — deeper auth-only reference
- `supabase-postgres-best-practices` — RLS performance rules
- `systematic-debugging` — for the D5-style "Database error querying schema" cycle
