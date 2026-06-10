# SAN-692 — Partner Hub (`/partners`)

**Date:** 2026-06-08  
**Branch:** `ai/san-692-partner-hub`  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/126 (replaces closed #125)  
**Commit:** `5a831b4` (C-017)  
**Status:** **MERGED** 2026-06-08

## Scope

Public marketing entry for supply funnel — 8 partner type cards linking to typed landings/signup.

| Card | href |
|------|------|
| Event hosts | `/partners/signup?type=host` |
| Venues | `/venues` |
| Rental brokers | `/partners/rentals` |
| Sponsors | `/sponsors` |
| Business AI | `/business/ai` |
| Restaurants | `/partners/restaurants` |
| Cafés | `/partners/cafes` |
| Nightlife | `/partners/nightlife` |

## Verification

| Check | Result |
|-------|--------|
| Vitest hub suite | **7/7 PASS** |
| Vitest signup (regression) | **13/13 PASS** (20 total with hub) |
| `GET /partners` | **200** |
| Browser a11y snapshot | 8 program cards + hero CTAs |
| Base UI console errors | **None** on `/partners` |

## Files

- `src/app/partners/page.tsx`
- `src/components/partners/partner-hub.tsx`
- `src/lib/partners/partner-hub-config.ts`
- `src/__tests__/partners/partner-hub.test.tsx`
