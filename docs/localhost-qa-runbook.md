# Localhost QA runbook — mdeai

Quick verification after Maps env or grounding changes. **Persona:** Sofía (QA) + Camila (rentals/chat).

## Prerequisites

- Repo: `/home/sk/mdeai/mdeapp`
- `.env.local` has **two** Google keys:
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — browser (HTTP referrer: `http://localhost:3001/*`)
  - `GOOGLE_MAPS_SERVER_API_KEY` — sidecar only (IP or unrestricted, **not** referrer)
- `GOOGLE_PLACES_API_KEY` — same as server key for Places API New
- [Maps Grounding Lite](https://console.cloud.google.com/marketplace/product/google/mapstools.googleapis.com) enabled on GCP project

## 0. Always start here (common mistake)

**App lives at `/home/sk/mdeai/mdeapp`** — not `~/mdeapp` and not `~`.

```bash
cd /home/sk/mdeai/mdeapp
pwd   # must print /home/sk/mdeai/mdeapp
npm run   # must list smoke:map-pins, floor, test:e2e:screens
```

From `~`, `cd mdeapp` fails and `npm run smoke:*` / Playwright will error.

## 1. Start services (max 2 processes)

**Do not** run `npm run dev` if port 3001 already returns 200.

```bash
curl -s -o /dev/null -w "UI: %{http_code}\n" http://localhost:3001/
```

| If | Then |
|----|------|
| UI ≠ 200 | `cd /home/sk/mdeai/mdeapp && npm run dev` |
| UI = 200 | Skip — dev already running |

```bash
curl -s http://localhost:8000/health
```

| If | Then |
|----|------|
| not `{"status":"ok"}` | `bash /home/sk/mdeai/services/adk-grounding/run-dev.sh` |

Mastra Studio (optional): http://localhost:4111 — should return 200 when agent dev is up.

## 2. Automated gate (copy-paste)

```bash
cd /home/sk/mdeai/mdeapp

npm test
npm run lint
npm run typecheck
npm run verify:maps-env
npm run verify:grounding    # must show: source: grounding-lite
npm run verify:rental-pins
npm run verify:supabase
npm run smoke:map-pins      # expect: 5 cards, 6 pins
npm run verify:console:boot # every task — layout console, no AI turn
npm run verify:console      # when Gemini billing OK — rental turn + 0 critical errors
```

Production gate (optional):

```bash
npm run build
npm run floor               # may fail on npm audit — track separately
```

## 3. Browser manual checks

Open http://localhost:3001

| # | Prompt | Expect |
|---|--------|--------|
| 1 | `1BR apartment in Laureles under 80 dollars per night` | Map + **≥5** rental cards + **≥6** pins |
| 2 | `Quiet cafés near Laureles` | Grounded reply; map pins; attribution or “View on Google Maps” |
| 3 | `Quiet cafés near Parque Lleras` | Same; pins near El Poblado |

**Must not see:** `RefererNotAllowedMapError`, `Maximum update depth exceeded`, blank map with referer help banner.

## 4. Sidecar-only grounding probe

```bash
curl -s -X POST http://localhost:8000/v1/grounding/invoke \
  -H 'Content-Type: application/json' \
  -d '{"tool":"search_grounded_places","query":"Quiet cafés near Laureles","pageSize":3}' \
  | python3 -c "import sys,json;d=json.load(sys.stdin);m=d['metadata'];print(m.get('source'),len(d.get('pins',[])))"
```

Expected: `grounding-lite 3` (or more pins).

## 5. MAP-002 “Done” checklist (do not skip)

- [ ] `npm run verify:grounding` → **grounding-lite** (not gemini-maps-grounding)
- [ ] Chat grounded query shows `[data-testid="grounding-attribution"]` or documented UI equivalent
- [ ] `npm run verify:console:boot` → exit 0 (every task)
- [ ] `npm run verify:console` → 0 critical (when Gemini billing OK)
- [ ] Evidence in `tasks/notes/MAP-002-evidence.md`
- [ ] `npm run floor` green OR audit waiver recorded

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| EADDRINUSE :3001 | Dev already running — use existing server |
| `gemini-maps-grounding` | Restart sidecar after adding `GOOGLE_MAPS_SERVER_API_KEY` |
| Blank map | GCP referrers on **browser** key only |
| 403 on Places/MCP | Server key must not use HTTP referrer restriction |
| verify:console timeout | Run alone after smoke; don’t parallelize Playwright |

## 7. Report template

Save results to `tasks/notes/localhost-qa-report-YYYY-MM-DD.md` with:

- Readiness score /100
- ✅ / 🟡 / 🔴 sections
- Command exit codes (no secret values)
- MAP-002 Done verdict

Reference report: `tasks/notes/localhost-qa-report-2026-05-20.md`
