# SAN-665 — POST /api/partners/activate post-merge smoke

**Date:** 2026-06-08  
**Commits on main:**
- `a0cdf33` — fix(partners): address cubic SAN-665 activate review (#113)
- (prior) activate API from #111 lineage on branch history

**PRs:**
- https://github.com/amo-tech-ai/mdeapp/pull/111 — initial activate API
- https://github.com/amo-tech-ai/mdeapp/pull/113 — cubic hotfix (merged 2026-06-08)

## PR #113 merge gate

| Check | Result |
|-------|--------|
| floor | ✅ |
| cubic | ✅ |
| CodeRabbit | ✅ |
| Vercel | ✅ |
| unresolved cubic threads | 0 |

## Cubic fixes verified on main

| Issue | Fix |
|-------|-----|
| P1 draft validation after writes | `validatePartnerDraft()` before partner/member writes |
| P1 unique race `(profile_id, type)` | `23505` → re-fetch existing partner |
| P2 draft type mismatch | `draft_type_mismatch` → HTTP 400 |
| P2 raw DB error leak | `CLIENT_ERROR_MESSAGES` — generic client text, server log only |
| P2 proto pollution | `Object.create(null)` + block `__proto__`/`constructor`/`prototype` |
| P2 TOCTOU draft link | update constrained by `id`, `profile_id`, `type` |
| P3 empty settings shape | empty path returns null-prototype object |

## Post-merge checks (main `a0cdf33`)

```bash
cd mdeapp && npm test -- --run src/__tests__/api/partners-activate.test.ts
# 15/15 PASS
```

| Check | Result |
|-------|--------|
| partners-activate.test.ts | **15/15 PASS** |
| npm run build (local) | ❌ unrelated `@langchain/core` missing on copilotkit route — **CI floor passed on PR #113** |

## Localhost integration smoke (2026-06-07, pre-hotfix)

| Check | Result |
|-------|--------|
| unauthenticated → 401 | PASS |
| authenticated host → 201 | PASS |
| duplicate host → 200 | PASS |
| `partners.status` = `draft` | PASS |
| `partner_members` owner | PASS |
| `draftId` + `submitted_at` | PASS |

## Production

Re-run after Vercel promotes `a0cdf33`:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://www.mdeai.co/api/partners/activate \
  -H "Content-Type: application/json" -d '{"type":"host"}'
# expect 401
```

## SAN-665 status

| Slice | Status |
|-------|--------|
| **Activate API** (`POST /api/partners/activate`) | ✅ Shipped + cubic-hardened on main — **In Review** (await user Done approval) |
| Signup wizard UI | ⏳ Not started — next integration slice |
| SAN-690 dashboard shell | ⏳ Blocked until user approves |

## Next (pick one)

1. **SAN-665 signup wizard integration** — wire activate API into `/partners/signup` (UI first if Roberto flow is priority)
2. **SAN-690 dashboard shell** — post-activation landing at `/dashboard` (if shell before wizard steps)

Do **not** start SAN-690 until explicitly approved.
