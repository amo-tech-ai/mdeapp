---
title: mdeai localhost — troubleshooting checklist
updated: 2026-05-20
runbook: ../../mdeapp/docs/localhost-qa-runbook.md
verification: ./VERIFICATION-CHECKLIST.md
---

# Troubleshooting checklist (localhost)

## EADDRINUSE on port 3001

| Symptom | `npm run dev` → `listen EADDRINUSE :::3001` |
|---------|-----------------------------------------------|
| Cause | Dev **already running** (Cursor, another terminal, background `next dev`) |
| Fix | **Do not** start again. Use http://localhost:3001 |
| Verify | `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/` → `200` |
| Restart only if needed | Find terminal → Ctrl+C, or `lsof -i :3001` → kill **one** `next-server` parent, then **one** `npm run dev` |

---

## Blank map / RefererNotAllowedMapError

| Symptom | White map, `[data-testid="map-referer-help"]` visible |
|---------|--------------------------------------------------------|
| Cause | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` missing referrers for your port |
| Fix | GCP → Credentials → **browser** key → HTTP referrers: `http://localhost:3001/*`, `http://127.0.0.1:3001/*` |
| Verify | Reload `/`; `npm run verify:console` → 0 maps warnings |

---

## Grounding returns `gemini-maps-grounding`

| Symptom | `npm run verify:grounding` or invoke shows **gemini-maps-grounding** |
|---------|-----------------------------------------------------------------------|
| Cause | Sidecar using **browser** `GOOGLE_MAPS_API_KEY` (referrer-locked) or sidecar not restarted after env change |
| Fix | Set `GOOGLE_MAPS_SERVER_API_KEY` in `mdeapp/.env.local`; restart `bash services/adk-grounding/run-dev.sh` |
| Verify | `npm run verify:grounding` → **`source: grounding-lite`** |
| Hidden risk | Fallback **masks** MCP misconfig — treat gemini source as **failure** for MAP-002 Done |

---

## Wrong `locationBias` in curl / invoke JSON

| Symptom | Invoke returns 0 pins or validation error |
|---------|------------------------------------------|
| Cause | Body used `"lat"` / `"lng"` — sidecar expects **`latitude`** / **`longitude`** |
| Fix | `{"locationBias":{"latitude":6.2442,"longitude":-75.5812}}` |
| Verify | `jq '.metadata.source, (.pins|length)'` → `grounding-lite` and ≥1 |

---

## ADK sidecar down

| Symptom | `verify:grounding` → ADK sidecar down; Mastra grounded tool empty metadata |
|---------|-------------------------------------------------------------------------------|
| Cause | Nothing on `:8000` |
| Fix | `bash /home/sk/mdeai/services/adk-grounding/run-dev.sh` (loads server key from `mdeapp/.env.local`) |
| Verify | `curl -s http://localhost:8000/health` → `{"status":"ok"}` |

---

## No rental cards / smoke timeout

| Symptom | `smoke:map-pins` or `verify:console` timeout on `[data-testid="rental-card"]` |
|---------|-------------------------------------------------------------------------------|
| Cause | Agent didn’t call `search-rentals`; Gemini key missing; dev not on :3001 |
| Fix | `GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local`; use smoke query: *1BR apartment in Laureles under 80 dollars per night* |
| Verify | `npm run smoke:map-pins` → 5 cards, 6 pins |
| Note | *Find rentals under $1200* may not trigger tool every run — not the canonical smoke prompt |

---

## Maximum update depth exceeded

| Symptom | React error in console; page thrashes |
|---------|---------------------------------------|
| Cause | Pin sync loop in `ToolPinsSync` / `MapUiSync` (fixed 2026-05-20) |
| Fix | Ensure latest `search-tool-renders.tsx` + `map-ui-sync.tsx` |
| Verify | `npm run verify:console` → 0 critical |

---

## Duplicate pins on map

| Symptom | Same listing appears as multiple markers |
|---------|------------------------------------------|
| Cause | Re-merge pins every render without dedupe |
| Fix | Dedupe by pin id in `ToolPinsSync` |
| Verify | One pin per rental after chat turn |

---

## `npm run floor` fails on audit only

| Symptom | lint/typecheck/build/test pass; floor exit 1 |
|---------|---------------------------------------------|
| Cause | `npm audit --audit-level=high` (e.g. playwright GHSA) |
| Fix | `npm audit fix` where safe; document waiver if transitive |
| Verify | Re-run `npm run floor` |

---

## GroundingAttribution not visible (MAP-002)

| Symptom | Chat has text links but no `[data-testid="grounding-attribution"]` |
|---------|---------------------------------------------------------------------|
| Cause | Agent answered without completing `search-grounded-places` generative UI |
| Fix | Prompt: *Quiet cafés near Laureles*; wait for tool complete; check `search-tool-renders` grounded mirror |
| Verify | Browser: attribution block under grounded cards |

---

## Architecture mistakes (grep)

| Symptom | Wrong integration |
|---------|-------------------|
| `HttpAgent` in `mdeapp/src/app/api/copilotkit/route.ts` | Anti-pattern — use `getLocalAgentsWithLogging({ mastra })` |
| `NEXT_PUBLIC_GOOGLE_PLACES_*` in `.env.local` | Remove — MAP-013 |
| Server key in `NEXT_PUBLIC_*` | Never — separate browser vs server keys |

**Commands:**

```bash
rg "HttpAgent" mdeapp/src
rg "getLocalAgents" mdeapp/src/app/api/copilotkit
rg "NEXT_PUBLIC_GOOGLE_PLACES" mdeapp/.env.local mdeapp/src
```

---

## Quick health (30 seconds)

```bash
curl -s -o /dev/null -w "UI:%{http_code}\n" http://localhost:3001/
curl -s -o /dev/null -w "Mastra:%{http_code}\n" http://localhost:4111/
curl -s http://localhost:8000/health
cd /home/sk/mdeai/mdeapp && npm run verify:grounding && npm run smoke:map-pins
```
