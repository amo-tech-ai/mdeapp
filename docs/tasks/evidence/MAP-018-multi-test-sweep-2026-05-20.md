# MAP-018 multi-test sweep — 2026-05-20

**Cloud Run:** `mdeai-adk-grounding-00009-bwv` (Supabase cache secrets wired)

## Results

| Suite | Result |
|-------|--------|
| Vitest | 211/211 |
| Python `test_places_enrich.py` | 8/8 |
| `verify:maps-env` | OK |
| `verify:supabase` | OK |
| `verify:grounding` | OK — grounding-lite, 5 pins |
| `verify:grounding-enrichment` | OK — 5/5 enriched (post-deploy) |
| `verify:console:boot` | OK — 0 critical |
| `verify:console` | OK — rental turn, 0 critical |
| `smoke:grounding-attribution` | OK — 5 cards, 5 pins |
| `smoke:map-pins` | OK — 5 cards, 5 pins |
| `smoke:f50-pin-sync` | OK |
| Playwright maps (4 specs) | 11/11 |
| ESLint + typecheck | OK (after img eslint-disable) |

## Cloud Run deploy (P1 next step)

- Created GCP secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Granted `secretAccessor` to compute SA
- Deployed revision **00009-bwv** with `PLACES_DETAILS_SUPABASE_CACHE=true`
- Health: `https://mdeai-adk-grounding-600700470346.us-east1.run.app/health` → `{"status":"ok"}`

## Supabase cache proof (018E)

```sql
SELECT count(*) FROM place_details_cache
WHERE field_mask_version = 'details-v2-mvp-2026-05-20' AND expires_at > now();
-- → 5 rows (2026-05-26 01:54 UTC)
```

## Commands (replay)

See `tasks/maps/maps-checklist.md`
