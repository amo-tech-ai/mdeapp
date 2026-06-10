# SAN-723 — Partner signup landing + signed-in activate smoke

**Date:** 2026-06-08  
**Branch:** `ai/san-723-partner-signup-landing`  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/124  
**Commit:** `19c2329` merged to `main` (C-016 + review fix `55376d8`)
**Status:** **MERGED** 2026-06-08

## UI slice

| Check | Result |
|-------|--------|
| Vitest type-picker + wizard | **13/13 PASS** |
| `GET /partners/signup` | **200** |
| `GET /partners/signup?type=host` | **200** |
| Chrome console Base UI errors | **None** on landing (after `nativeButton={false}` on nav buttons) |

## Signed-in activate smoke

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- node scripts/partner-signup-activate-smoke.mjs
```

| Step | Result |
|------|--------|
| Session (`qa-landlord@mdeai.co`) | PASS |
| `POST /api/partners/activate` | **201** |
| `partners.status` = `draft`, `type` = `host` | PASS |
| `partner_members.role` = `owner` | PASS |
| Sample partnerId | `cb24e0d8-0097-4d2f-8e9c-2544cf04e77d` |

## Files (PR #124 only)

- `src/app/partners/signup/page.tsx`
- `src/components/partners/partner-signup-type-picker.tsx`
- `src/components/partners/partner-signup-nav.tsx`
- `src/components/partners/partner-signup-wizard.tsx` (polish)
- `src/lib/partners/partner-type-picker-config.ts`
- `src/components/ui/accordion.tsx`
- `src/components/partners/__tests__/partner-signup-type-picker.test.tsx`
