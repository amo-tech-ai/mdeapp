---
name: claude-preview-browser-testing
description: "Use when verifying any UI change in mdeai.co against a real browser + live Supabase. Triggers: any *.tsx component change, any new page/route, any auth-gated flow, any 'does this work end-to-end' question. Built on Claude Preview MCP + the qa-landlord auth pattern from D5. Source: skills.sh playwright-best-practices (adapted)."
metadata:
  source: https://skills.sh/ (playwright-best-practices)
  installed: 2026-04-29
  version: "0.1.0"
  origin: external concept + mdeai.co Preview MCP adaptations
---

# Browser proof — mdeai.co (Claude Preview MCP)

Vitest only proves the unit. Real users hit edge cases JSDOM can't simulate: live RLS, real Supabase auth, real network round-trips, real route transitions, real console errors. **Every UI change in V1 must include a browser proof captured via Claude Preview MCP** (per plan §13).

## When to invoke

- Any new `.tsx` component or page
- Any new route in `App.tsx`
- Any new edge-function call from the client
- Any change to `useAuth` / signup flow / RLS policy
- Any time a unit test passes but you still don't trust the change

## The 5-step browser proof

### 1. Start the dev server

```js
// Pre-conditions: no other server on :8080
preview_start({ name: "mde-dev" })
// Returns serverId — keep it; every other call uses it
```

The launch config lives at `.claude/launch.json` and runs `npm run dev` (port 8080).

### 2. Navigate + verify auth gate

For an anon-blocked route:
```js
preview_eval({ serverId, expression:
  "window.location.href = window.location.origin + '/host/listings/new'; 'navigating'"
})
// then immediately:
preview_eval({ serverId, expression:
  "JSON.stringify({ path: window.location.pathname, search: window.location.search })"
})
// expect: pathname='/login', search includes 'returnTo=...'
```

If the path is unexpected, snapshot first to see what rendered:
```js
preview_snapshot({ serverId })  // returns a11y tree
```

### 3. Sign in as the QA landlord

Permanent test user: `qa-landlord@mdeai.co` / `Qa-Landlord-V1-2026` (seeded by migration `20260501000000_landlord_v1_qa_user_seed.sql`). Use this — DO NOT `signUp()` fresh users in browser tests, you'll burn the project's per-hour email-signup rate limit (4/hr default — blocked us in D4).

```js
preview_eval({ serverId, expression: `(async () => {
  const { supabase } = await import('/src/integrations/supabase/client.ts');
  await supabase.auth.signOut();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'qa-landlord@mdeai.co',
    password: 'Qa-Landlord-V1-2026'
  });
  if (error) return { error: error.message };
  window.location.href = '/host/listings/new';
  return { ok: true, accountType: data.user?.user_metadata?.account_type };
})()`})
```

#### Auth gotcha (D5 case study)

If signin fails with **"Database error querying schema"**, the user row is missing GoTrue's expected empty-string defaults. Fix:

```sql
UPDATE auth.users
SET confirmation_token = '', recovery_token = '',
    email_change = '', email_change_token_new = ''
WHERE email = 'qa-landlord@mdeai.co' AND confirmation_token IS NULL;
```

(Non-NULL is what GoTrue queries against.)

### 4. Drive the UI + assert state

```js
// Click a known testid
preview_click({ serverId, selector: '[data-testid="step1-submit"]' })

// Read DOM state to confirm
preview_eval({ serverId, expression:
  "JSON.stringify({ h1: document.querySelector('h1')?.textContent, hasStep2: !!document.querySelector('[data-testid=step2-form]') })"
})
```

For form fills, use the React-aware setter so the form library picks up the change:

```js
preview_eval({ serverId, expression: `(() => {
  const set = (el, v) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  set(document.querySelector('input[autocomplete=tel]'), '+573001234567');
  return 'ok';
})()`})
```

### 5. Capture proof + verify DB write

For visual proof:
```js
preview_screenshot({ serverId })
```

For DB-write proof, query Supabase directly via MCP `execute_sql` after the UI action:

```sql
SELECT id, display_name, whatsapp_e164, verification_status, created_at
FROM public.landlord_profiles
WHERE display_name = 'D3 Test Landlord';
```

A clean test: the row exists with expected values + the storage bucket has the uploaded file at the right path.

## Cleanup

Always remove test data after verification:

```sql
-- Storage objects (use Storage API, NOT raw DELETE — protected)
SELECT supabase.storage.from('listing-photos').remove([...]);
-- Then DB rows:
DELETE FROM public.verification_requests WHERE landlord_id = '<id>';
DELETE FROM public.apartments WHERE landlord_id = '<id>' AND source = 'manual';
DELETE FROM public.landlord_profiles WHERE id = '<id>';
-- Don't DELETE the QA user itself — it's permanent seed.
```

## Console hygiene

After every flow:
```js
preview_console_logs({ serverId, level: 'error', lines: 20 })
```

Every browser proof should end with **zero console errors**. React Router future-flag warnings are OK (project-wide). React error-boundary captures during the flow are not.

## Stop the server when done

```js
preview_stop({ serverId })
```

(Or leave it running across multiple proofs in a session; it auto-reuses by name.)

## Companion skills

- `systematic-debugging` — when the proof fails, run that loop first
- `vitest-component-testing` — what unit tests cover; this skill picks up where they stop
- `mdeai-project-gates` — final gate before commit (lint + test + build + check:bundle + browser proof attached)
- `verification-before-completion` (skills.sh) — same intent, different layer
