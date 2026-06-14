# SAN-883 · DEV-SEC — dist-leak-scan publishable Maps key allowlist — RESULTS

**Date:** 2026-06-12
**Branch:** `ai/san-883-dev-sec-maps-key-allowlist` (worktree off `origin/main` @ #199)
**Personas:** Sofía (dev — can push again), security posture (real keys still blocked)
**Rationale:** [`docs/security/dist-leak-scan-maps-key-allowlist.md`](../../../../security/dist-leak-scan-maps-key-allowlist.md)

## Verdict

**PASS.** The publishable Maps key is recognised by committed SHA-256 (deterministic,
no env dependency), so it no longer false-blocks `git push`. Every other key class —
including the **new `AQ.A…` Gemini format that the old scanner missed entirely** —
still blocks. 15/15 unit tests green; live-proven against the real Infisical Maps key
(passes) and real Gemini key (blocks).

## Audit pass/fail matrix

| # | Check | Expected | Result |
|---|---|---|---|
| 1 | `.next/dev` skip still works (rogue key there) | allow (exit 0) | 🟢 PASS |
| 2 | `.next/static` remains scanned (rogue key) | block (exit 2) | 🟢 PASS |
| 3 | `.next/server` remains scanned (rogue key) | block (exit 2) | 🟢 PASS |
| 4 | Public Maps key passes (scanned artifact) | allow (exit 0) | 🟢 PASS |
| 5 | Maps Map ID passes (not key-shaped) | allow (exit 0) | 🟢 PASS |
| 6 | Fake / rotated Maps key fails | block (exit 2) | 🟢 PASS |
| 7 | Gemini API key (legacy `AIzaSy`) fails | block (exit 2) | 🟢 PASS |
| 8 | **Gemini API key (new `AQ.A…`) fails** | block (exit 2) | 🟢 PASS (gap closed) |
| 9 | Gemini key by name (`GOOGLE_GENERATIVE_AI_API_KEY=`) fails | block (exit 2) | 🟢 PASS |
| 10 | Supabase service-role key fails | block (exit 2) | 🟢 PASS |
| 11 | Arbitrary `GOOGLE_*` key (`AIzaSy` value) fails | block (exit 2) | 🟢 PASS |
| 12 | Empty allowlist → publishable-shaped key fails (fail closed) | block (exit 2) | 🟢 PASS |
| 13 | Allowed Maps key does NOT mask a Stripe secret in same file | block (exit 2) | 🟢 PASS |
| 14 | Non-deploy command ignored even with a leak | allow (exit 0) | 🟢 PASS |
| 15 | Clean bundle (no secrets) | allow (exit 0) | 🟢 PASS |

## Live (real-key) verification — values never printed

```text
real Maps key only      → exit 0  (allow)   sha256 25743f3f… recognised via committed allowlist
real Maps + real Gemini → exit 2  (block)   class=google-aq-key  (the AQ.A… Gemini key)
```

The real Gemini key is the new `AQ.A…` 53-char format (`matchesAIzaSyShape=false`) —
proving the pre-existing `AIzaSy`-only scanner would have **missed** it; the new
`google-aq-key` pattern now catches it.

## Commands

```bash
# Unit suite (runs in floor)
npx vitest run src/lib/__tests__/dist-leak-scan-hook.test.ts   # 15/15

# Live proof (real Infisical keys, hashes only)
infisical run --silent --env=dev --path=/ -- <write real keys into a temp .next/static>
DIST_LEAK_SCAN_ROOTS=<tmp>/.next node .claude/hooks/dist-leak-scan.mjs   # 0 then 2
```

## Scoring

| Criterion | Score |
|---|---|
| Secure implementation (value-precise, fail-closed) | 🟢 |
| No production blind spots (.next/static + server scanned; AQ.A gap closed) | 🟢 |
| Regression tests added (15, in floor) | 🟢 |
| Production artifacts still scanned | 🟢 |
| No false positives for approved Maps keys / Map IDs | 🟢 |
| Security coverage **improved** vs PR #199 (AQ.A detection + mask fix) | 🟢 |

## Files changed

- `.claude/hooks/dist-leak-scan.mjs` — hash allowlist, `google-aq-key` pattern, mask fix, test overrides
- `.claude/hooks/maps-key-allowlist.json` — committed SHA-256 allowlist (hashes only)
- `src/lib/__tests__/dist-leak-scan-hook.test.ts` — 15-case regression suite
- `docs/security/dist-leak-scan-maps-key-allowlist.md` — rationale
- `docs/tasks/testing/evidence/2026-06-12/SAN-883-DEV-SEC-dist-leak-scan-RESULTS.md` — this report
