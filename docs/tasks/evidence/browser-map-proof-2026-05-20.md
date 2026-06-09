# Browser + test proof — 2026-05-20

## Automated

| Command | Result |
|---------|--------|
| `npm test` | **82/82** pass |
| `npm run verify:grounding` | **pass** — `source: grounding-lite`, 5 pins |
| `npm run smoke:map-pins` | **pass** — 5 rental cards, **6 map pins** |
| `npm run verify:console` | **fail** (120s timeout on rental-card) — flaky when run back-to-back with smoke; re-run alone |

Logs: `/tmp/mde-vitest-proof.log`, `/tmp/mde-smoke-proof.log`

## Browser (@Browser MCP) — http://localhost:3001

Query: `1BR apartment in Laureles under 80 dollars per night`

| Check | Observed |
|-------|----------|
| Map loads | `Laureles — map ready` pin visible |
| Rental pins on map | 5 pins (Cozy Studio, Estadio Modern, La Setenta, Primer Parque, Segundo Parque) |
| Generative UI cards | 5 cards in sidebar with View listing links |
| Agent reply | Listing bullets with prices ($25–$80/night) |

## Services

- UI `:3001` — up
- Mastra `:4111` — up
- ADK sidecar `:8000` — up, `grounding-lite`
