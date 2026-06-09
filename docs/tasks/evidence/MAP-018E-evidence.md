# MAP-018E — places_details_cache evidence

**Date:** 2026-05-20  
**Status:** Done

## What shipped

1. **Migration** `supabase/migrations/20260520120000_place_details_cache_map018e.sql`
   - Composite PK `(place_id, field_mask_version)`
   - `photo_name_primary`, 7-day TTL default
   - Applied on project `zkwcbyxiwklihegjhuql` via Supabase MCP

2. **Sidecar read-through / write-through** — `services/adk-grounding/places_details_supabase.py` wired in `places_enrich.py`
   - L1: in-memory 300s
   - L2: Supabase `place_details_cache`
   - Bypass: `PLACES_DETAILS_CACHE_BYPASS=true`
   - Log: `places_cache_hit=true source=supabase|memory`

3. **Deploy script** — Supabase secrets on Cloud Run (`deploy-cloud-run.sh`)

4. **Audit hardening (same session)**
   - Photo `authorAttributions` → `photoAuthorAttributions` on cards
   - `/api/places/photo` rate limit 120 req/min/IP

## Verification

```bash
cd mdeapp && npm test                                    # 211/211
cd services/adk-grounding && .venv/bin/python -m pytest test_places_enrich.py -q  # 8/8
npm run verify:grounding && npm run verify:grounding-enrichment  # OK
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts --project=chromium  # 1/1
```

**Note:** Cloud Run redeploy with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` secrets required for prod Supabase cache hits; code + migration ready.

## Rollback

- `PLACES_DETAILS_CACHE_BYPASS=true` on sidecar
- Table harmless if unused
