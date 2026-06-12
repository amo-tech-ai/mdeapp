# dist-leak-scan — publishable Maps key allowlist (security rationale)

**Task:** SAN-883 · DEV-SEC — dist-leak-scan publishable Maps key allowlist
**Supersedes the workaround in:** PR #199 (`fix(hooks): dist-leak-scan — skip .next/dev`)
**Hook:** `.claude/hooks/dist-leak-scan.mjs` · **Allowlist:** `.claude/hooks/maps-key-allowlist.json`

## The problem in one line

A browser-safe Google **Maps** key and a private **Gemini** key look identical (`AIzaSy…`), so the leak scanner can only tell them apart **by value** — and the value it needs was no longer reachable at hook runtime, so it false-blocked every `git push`.

## Why shape can't decide it

All Google API keys share the `AIzaSy[A-Za-z0-9_-]{30,40}` shape. The Maps key
(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) is **meant** to ship in the client bundle — it's
gated by HTTP-referrer restrictions in Google Cloud Console. A Gemini key
(`GOOGLE_GENERATIVE_AI_API_KEY`) must **never** ship. Same shape, opposite policy.
The only safe discriminator is the **exact key value**.

## Why the old approach false-positived

The pre-existing allowlist matched the Maps key value sourced from `.env.local` /
`*.env.local.bak` / the process env. After the 2026-06-04 Infisical migration:

- `.env.local` is intentionally empty (or holds a *different* dev key).
- The Claude Code PreToolUse hook does **not** run under `infisical run`, so the
  injected `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is absent from `process.env`.
- `next dev` inlines the **Infisical** value, which matched none of the above.

→ allowlist empty/mismatched → the legitimate Maps key read as an unknown Google
key → block. PR #199 sidestepped this by skipping the whole `.next/dev` subtree.

## The fix: a committed SHA-256 allowlist

`maps-key-allowlist.json` holds the **SHA-256 hashes** of known publishable Maps key
values. The hook allows an `AIzaSy…` match **iff** its value matches a known value
(env/backup, kept for back-compat) **or** its SHA-256 is in the committed list.

Why hashes, not the raw key:

- **Deterministic everywhere** — CI, fresh clones, and hooks that don't run under
  Infisical all get the same answer. No env dependency.
- **No key-shaped string in the repo** — committing the raw publishable key (even
  though it's already public in the browser bundle) would trip GitHub
  push-protection and alarm human reviewers. A hash is inert.
- **Cryptographically precise** — only the exact publishable key(s) pass. A rotated,
  fake, or different-project Google key hashes differently → blocked.

## Two coverage improvements over PR #199 (not just parity)

1. **New `AQ.A…` Google/Gemini key format is now detected.** The live Gemini key is
   the newer 53-char `AQ.A…` format, which the `AIzaSy` pattern **did not match at
   all** — a real Gemini key inlined as a bare value would have slipped through
   before this change. Added pattern `google-aq-key` (`/AQ\.A[A-Za-z0-9_-]{30,}/`);
   the literal `.` at index 2 keeps it from matching base64/hex bundle blobs.
2. **An allowed Maps key can no longer mask another secret in the same file.** The
   old loop `break`s on the first pattern (Google is first); an allowed Maps key
   short-circuited the file before Stripe/service-role/etc. were checked. Now an
   allowed Google key `continue`s so every other class is still evaluated.

## What stays blocked (unchanged policy)

`AIzaSy…` not in the allowlist · `AQ.A…` (always private) · Stripe live/test/webhook ·
GitHub PAT · `SUPABASE_SERVICE_ROLE…=…` · Anthropic key (literal + by-name) ·
`GOOGLE_GENERATIVE_AI_API_KEY=…` (by name).

## Fail-closed posture

If the allowlist file is missing or malformed, **no** Google key is allowed — the
scanner blocks rather than waving keys through. `.next/dev` is still skipped (local
dev build, never deploys); `.next/static` and `.next/server` (the artifacts Vercel
actually ships) are always scanned, where the deterministic allowlist makes the
legit Maps key pass without the old false positive.

## Rotation runbook

When the publishable Maps key rotates, append the new value's hash:

```bash
printf '%s' "$NEW_PUBLISHABLE_MAPS_KEY" | sha256sum   # add the hex to publishableMapsKeySha256[]
```

Old hashes may be kept (they only ever allow already-public keys) or pruned.

## Testability hooks (test-only env overrides)

- `DIST_LEAK_SCAN_ROOTS` — colon-separated dirs to scan instead of the real `.next`.
- `DIST_LEAK_SCAN_ALLOWLIST_FILE` — path to an allowlist JSON for fixtures.

Regression suite: `src/lib/__tests__/dist-leak-scan-hook.test.ts` (runs in `floor`).
