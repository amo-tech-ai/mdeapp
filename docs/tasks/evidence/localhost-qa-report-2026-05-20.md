---
id: localhost-qa-2026-05-20
title: Localhost E2E QA — post server Maps key fix
date: 2026-05-20
auditor: QA / task-verifier
scope: mdeapp localhost :3001 / :4111 / :8000
log: /tmp/mde-qa-report.log
---

# Localhost QA report — mdeai

## Readiness score: **82 / 100**

| Area | Score | Notes |
|------|------:|-------|
| Services up | 10/10 | UI 200, Mastra 200, sidecar ok |
| Automated floor (ex-audit) | 9/10 | test/lint/typecheck/build all exit 0 |
| Grounding Lite MCP | 9/10 | `verify:grounding` → **grounding-lite** |
| Rental map smoke | 10/10 | 5 cards, 6 pins, 0 console critical |
| Browser MAP-002 UI | 6/10 | Attribution flaky by prompt; agent routing |
| MAP-002 task Done | 0/10 | Checklist + floor audit not complete |

---

## Services (no duplicate `npm run dev`)

| Service | URL | Result |
|---------|-----|--------|
| Next.js UI | http://localhost:3001 | **HTTP 200** (already running) |
| Mastra Studio | http://localhost:4111 | **HTTP 200** |
| ADK sidecar | http://localhost:8000/health | **`{"status":"ok"}`** |

---

## ✅ Passed

| Command | Exit | Key output |
|---------|------|------------|
| `npm test` | 0 | 19 files, **82/82** tests |
| `npm run lint` | 0 | 0 warnings |
| `npm run typecheck` | 0 | clean |
| `npm run build` | 0 | 10 routes compiled |
| `npm run verify:maps-env` | 0 | Places probe **HTTP 200**; browser key referrer OK |
| `npm run verify:grounding` | 0 | **`source: grounding-lite`**, 5 pins |
| `npm run verify:rental-pins` | 0 | Supabase pin-ready row OK |
| `npm run verify:supabase` | 0 | anon + service + DATABASE_URL |
| `npm run smoke:map-pins` | 0 | **5** rental cards, **6** map pins |
| `npm run verify:console` | 0 | **0** critical errors, **0** maps warnings |

### Sidecar invoke (direct POST `/v1/grounding/invoke`)

| Prompt | `metadata.source` | Pins | Attribution rows |
|--------|-------------------|-----:|-----------------:|
| Quiet cafés near Laureles | **grounding-lite** | 5 | 5 |
| Quiet cafés near Parque Lleras | **grounding-lite** | 5 | 5 |
| Find rentals in Laureles under 1200 | gemini-maps-grounding | 3 | 3 |

> **Note:** Rental inventory on `/` uses Mastra **`search-rentals`** (Supabase), not the sidecar. The sidecar query above is a **places** API test; Gemini fallback on a rental-shaped query is expected MCP behavior, not Camila’s rental path.

### Browser (@Browser MCP)

| Check | Result |
|-------|--------|
| Page loads | ✅ |
| Map renders (`chat-map`, Laureles pin) | ✅ |
| RefererNotAllowedMapError | ✅ not seen |
| Maximum update depth | ✅ not seen |
| Rental smoke query (script) | ✅ 5 cards + 6 pins |
| Café query “Quiet cafés near Laureles” | ✅ agent reply + “View on Google Maps” links |
| Critical console (verify:console) | ✅ 0 |

---

## 🟡 Warnings

| Item | Impact |
|------|--------|
| `GEMINI_API_KEY` ≠ `GOOGLE_GENERATIVE_AI_API_KEY` | verify:maps-env warning only |
| `npm run floor` | **exit 1** — `npm audit` 11 vulns (transitive `@ag-ui/langgraph`) |
| Next.js turbopack root lockfile warning | build warning, not runtime |
| Sequential 3-prompt Playwright (`/tmp/qa-grounding-ui.mjs`) | Only Parque Lleras showed `[data-testid=grounding-attribution]`; agent/tool routing inconsistent across prompts |
| CopilotKit upgrade banner in UI | Cosmetic (1.55.2 → 1.57.4) |

---

## 🔴 Blockers (MAP-002 → Done)

| Gate | Status |
|------|--------|
| `verify:grounding` → **grounding-lite** | ✅ |
| Grounded pins in UI same turn as attribution | 🟡 partial — café chat works; `[data-testid=grounding-attribution]` not proven for all 3 prompts |
| `npm run floor` exit 0 | 🔴 audit failures |
| MAP-002 evidence checklist all boxes | 🔴 not updated |
| Quota / RLS / no client MCP keys | 🔴 not run this pass |

**Verdict:** **Localhost MVP is green** for Camila rentals + maps + server key. **Do not flip MAP-002 to Done** until UI attribution is consistently proven and floor/audit gates close.

---

## Env (masked)

| Variable | Role | In `.env.local` |
|----------|------|-----------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser map | ✅ browser key |
| `GOOGLE_MAPS_SERVER_API_KEY` | MCP sidecar | ✅ server key |
| `GOOGLE_PLACES_API_KEY` | Places API New | ✅ server key (same as server maps) |
| `ADK_GROUNDING_URL` | Mastra → sidecar | `http://localhost:8000` |

---

## Re-run commands

```bash
cd /home/sk/mdeai/mdeapp

curl -s -o /dev/null -w "UI: %{http_code}\n" http://localhost:3001/
curl -s -o /dev/null -w "Mastra: %{http_code}\n" http://localhost:4111/
curl -s http://localhost:8000/health

npm test
npm run verify:grounding
npm run smoke:map-pins
npm run verify:console
```

Sidecar only if `:8000` down:

```bash
bash /home/sk/mdeai/services/adk-grounding/run-dev.sh
```

---

## MAP-002 Done criteria (this run)

| Criterion | Met? |
|-----------|------|
| `source: grounding-lite` on verify script | ✅ |
| ≥3 grounded pins (sidecar) | ✅ |
| GroundingAttribution visible in browser | 🟡 |
| Console clean | ✅ |
| `npm run floor` | 🔴 |
