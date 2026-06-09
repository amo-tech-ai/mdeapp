---
title: Localhost QA — full sweep checklist (run in order)
updated: 2026-05-20
log_example: /tmp/mde-qa-sweep-0219.log
troubleshooting: ./TROUBLESHOOTING-CHECKLIST.md
report: ../notes/localhost-full-qa-2026-05-20.md
---

# Localhost QA checklist — mdeai

Run from a machine with `/home/sk/mdeai` checked out. **Do not** start duplicate processes.

---

## Phase 1 — Service health

```bash
curl -s -o /dev/null -w "UI: %{http_code}\n" http://localhost:3001/
curl -s -o /dev/null -w "Mastra: %{http_code}\n" http://localhost:4111/
curl -s http://localhost:8000/health || echo "sidecar down"
```

| Result | Action |
|--------|--------|
| UI **200** | **Skip** `npm run dev` (EADDRINUSE = already running) |
| UI not 200 | `cd /home/sk/mdeai/mdeapp && npm run dev` (one terminal, leave open) |
| Sidecar `{"status":"ok"}` | **Skip** `run-dev.sh` (8000 EADDRINUSE = already running) |
| Sidecar down | `bash /home/sk/mdeai/services/adk-grounding/run-dev.sh` |

- [ ] UI 200
- [ ] Mastra 200
- [ ] Sidecar ok

---

## Phase 2 — Core tests

```bash
cd /home/sk/mdeai/mdeapp
npm test
npm run lint
npm run typecheck
npm run build
npm run verify:maps-env
npm run verify:grounding      # MUST: source: grounding-lite
npm run verify:rental-pins
npm run smoke:map-pins        # ~15s — 5 cards, 6 pins
npm run verify:console        # ~15s — 0 critical
npm run verify:supabase
npm run floor                 # optional — may fail on npm audit only
```

| Script | Pass criteria |
|--------|----------------|
| `verify:grounding` | `source: grounding-lite`, ≥1 pin |
| `smoke:map-pins` | ≥1 rental-card, ≥2 map-pin (expect 5+6) |
| `verify:console` | 0 critical errors |

- [ ] npm test 82/82
- [ ] lint / typecheck / build
- [ ] verify:maps-env
- [ ] verify:grounding → **grounding-lite**
- [ ] smoke:map-pins
- [ ] verify:console
- [ ] verify:supabase

---

## Phase 3 — MCP / grounding (sidecar)

**Correct invoke body** (`latitude` / `longitude`, not `lat` / `lng`):

```bash
curl -s -X POST http://localhost:8000/v1/grounding/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_grounded_places","query":"quiet cafés near Laureles","locationBias":{"latitude":6.2442,"longitude":-75.5812},"pageSize":3}' \
  | jq '.metadata.source, (.pins | length)'
```

| Must see | Must NOT see (MAP-002 prod) |
|----------|------------------------------|
| `grounding-lite` | `gemini-maps-grounding` (means MCP/key failure masked) |

Repeat for:

- [ ] quiet cafés near Laureles
- [ ] Quiet cafés near Parque Lleras
- [ ] Best cowork cafés in Medellín

---

## Phase 4 — Browser (manual or Playwright)

Open http://localhost:3001

**Rental smoke prompt (canonical):**

`1BR apartment in Laureles under 80 dollars per night`

**Grounding prompts:**

1. Quiet cafés near Laureles
2. Quiet cafés near Parque Lleras
3. Best cowork cafés in Medellín

| Check | Pass |
|-------|------|
| Map visible (`chat-map`) | [ ] |
| No referer error banner | [ ] |
| No “Maximum update depth” | [ ] |
| Rental cards in chat | [ ] |
| Map pins (≥2) | [ ] |
| `grounding-attribution` on grounded turn | [ ] |
| Console clean (or `verify:console` pass) | [ ] |

---

## Phase 5 — Architecture grep

```bash
cd /home/sk/mdeai
rg "HttpAgent" mdeapp/src services/adk-grounding || true   # expect 0 in product
rg "getLocalAgents" mdeapp/src/app/api/copilotkit           # expect match
rg "NEXT_PUBLIC_GOOGLE_PLACES" mdeapp/.env.local mdeapp/src # expect 0 in env
rg "gemini-maps-grounding" services/adk-grounding/main.py   # fallback only
rg "mapstools.googleapis.com/mcp" services/adk-grounding
```

- [ ] No `HttpAgent` in mdeapp route
- [ ] `getLocalAgentsWithLogging` in copilotkit route
- [ ] No `NEXT_PUBLIC_GOOGLE_PLACES` in `.env.local`
- [ ] `GOOGLE_MAPS_SERVER_API_KEY` set (server only)
- [ ] MCP URL in `grounding_mcp.py`

---

## Phase 6 — MAP-002 Done gate (strict)

**Do not mark Done unless ALL:**

- [ ] `verify:grounding` → **grounding-lite**
- [ ] Sidecar invoke returns pins + attribution (Phase 3)
- [ ] Grounded chat shows pins + **GroundingAttribution** UI
- [ ] `verify:console` → 0 critical
- [ ] No silent Gemini fallback on café queries (this sweep)
- [ ] `tasks/notes/MAP-002-evidence.md` updated
- [ ] `npm run floor` green OR audit waiver documented

---

## Env (two keys)

| Variable | Where |
|----------|--------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser map only |
| `GOOGLE_MAPS_SERVER_API_KEY` | Sidecar MCP only |
| `GOOGLE_PLACES_API_KEY` | Server Places API |

---

## Latest sweep (2026-05-20)

| Item | Result |
|------|--------|
| Services | UI/Mastra/sidecar 200 |
| Phase 2 | All verify scripts **pass**; floor **fail** (audit) |
| Phase 3 | All queries **grounding-lite** |
| smoke | 5 cards, 6 pins |
| console | 0 critical |
| Readiness | **84/100** — see `../notes/localhost-full-qa-2026-05-20.md` |
