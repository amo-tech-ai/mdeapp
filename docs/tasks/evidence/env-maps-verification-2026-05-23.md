# mdeapp/.env.local — maps credential verification (2026-05-23)

## Commands

```bash
cd /home/sk/mdeai/mdeapp
npm run verify:maps      # new script
npm run verify:supabase
npm test                 # 74 passed
```

## Variable checklist

| Variable | Required for | Status |
|----------|--------------|--------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | vis.gl / ChatMap | ✅ present; referrer-restricted (correct for browser) |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | AdvancedMarker | ✅ present (`e50ffcd…`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Mastra Gemini | ✅ present |
| `GOOGLE_MAPS_API_KEY` | MAP-002 Grounding Lite MCP | ✅ synced from repo root; **MCP tools/list OK** |
| `GOOGLE_PLACES_API_KEY` | MAP-004/005 server Places | ✅ synced; ⚠️ **referrer-blocked from server** — fix in GCP |
| `DATABASE_URL` | search-rentals | ✅ |
| Supabase publishable + service role | tools + F13 | ✅ `verify:supabase` PASS |

## Fixes applied

- Appended `GOOGLE_PLACES_API_KEY` + `GOOGLE_MAPS_API_KEY` from `/home/sk/mdeai/.env.local` (F04 mapping).
- Added `npm run verify:maps` → `scripts/verify-maps-env.mjs`.

## Action required (Patricia / Sofía)

1. **Places server key:** In Google Cloud Console, create or edit a key for **server** use:
   - Enable **Places API (New)**
   - Restrict by **IP** (Vercel + local) or use unrestricted server key — **not** HTTP referrers
   - Keep existing `NEXT_PUBLIC_*` key referrer-restricted for browser only
2. **Do not** put `GOOGLE_PLACES_API_KEY` in `NEXT_PUBLIC_*`.

## Task grades (env + implementation)

| Task | Grade | Notes |
|------|------:|-------|
| MAP-001 / MAIC-001 | 94 | Env OK for browser map |
| F48 / MAIC-002 | 92 | — |
| F49 / MAIC-009 | 85 | Manual chat pin proof still needed |
| MAP-002 | blocked 70 | MCP key works; implement next |
