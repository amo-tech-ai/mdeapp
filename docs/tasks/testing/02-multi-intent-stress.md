# 02 — Multi-intent stress (Camila / Tourist / Roberto)

**Targets:** localhost `:3001` · prod `https://www.mdeai.co/`

Run each prompt in a **clean session** (hard reload + no stale **Events** chip). Document PASS/FAIL per row.

## Preconditions

- [ ] Dev server up (`npm run dev`)
- [ ] Hard reload (`navigate_page` type=reload ignoreCache)
- [ ] No category chip pressed unless test says so
- [ ] Wait up to 120s for agent streaming

## Prompts

| ID | Persona | Prompt | Expected route | Assert |
|----|---------|--------|----------------|--------|
| M01 | Camila | Find 5 furnished rentals in Laureles under $1200/month with fast WiFi and nearby cafés. | `rental-search` / `search-rentals` | Rental cards + rental pins |
| M02 | Camila | Show the best restaurants near these rentals with ratings, walking distance, and map pins. | `nearby-intel` + Places | Restaurant markers ≠ rental |
| M03 | Tourist | Find coworking-friendly cafés near Primer Parque Laureles. | `search-grounded-places` | Café pins, field mask headers |
| M04 | Tourist | What events are happening near El Poblado tonight? | event fast-path or `search-events` | Event cards; date filter tonight |
| M05 | Camila | Compare Laureles vs Envigado for remote workers. | `conciergeAgent` prose + optional tools | No invented coordinates |
| M06 | Tourist | Show apartments near salsa venues and nightlife. | rental + event chain | Mixed pin categories merge |
| M07 | Tourist | Find quiet restaurants good for working on a laptop. | grounded places / restaurants | Cards + pins |
| M08 | Camila | Show nearby gyms, coworking spaces, and grocery stores around this apartment. | nearby-intel | Multi-category pins |
| M09 | Camila | Plan a remote-work weekend in Medellín with rental + cafés + events. | multi-step workflow | Context carries across turns |
| M10 | Patricia | Show only verified places with real map locations. | grounded + inventory | No lat/lng without tool backing |

## Advanced flows

- **Pin merge:** rental → restaurant → event without wiping prior category
- **Marker click:** opens correct card/details
- **Filters persist:** Laureles chip survives follow-up
- **Follow-up:** "cheaper" / "closer to metro" without repeating neighborhood
- **Lead capture:** Camila "contact me about this apartment" → propose only, no auto-write

## Known failure (2026-05-27)

| Bug | Repro | Root cause |
|-----|-------|------------|
| Rental prompt → "No events matched" | Events + Show all chip active, send rental prompt | Event fast-path intercepts before `conciergeAgent`; chip intent overrides message intent |
| New chat doesn't clear chips | Click New chat after event session | Chip state persists in working memory / query bar |
| `this week` → 1 event | Long prompt with "this week" | DB has 1 row in `this_week` window; not a routing bug |

## Minimal fixes (recommended)

1. **`canFastPathEventSearch`:** require explicit event keywords in message OR Events chip — if message contains `rental|apartment|café|restaurant`, skip fast path even when Events chip pressed.
2. **New chat / chip reset:** clearing thread resets `lastIntent`, event sub-chips, and map pins.
3. **Pin replace on category chip search:** `mergePinsByCategory('event', …)` should replace same category, not accumulate orphan pins from prior query.
4. **Sparse `this_week` UX:** when `< limit` results, assistant offers "Show all" automatically.

## Chrome DevTools MCP runbook

```
navigate_page → url http://localhost:3001/
take_snapshot → get textarea uid
evaluate_script → react textarea send (see 01-event-discovery-smoke.md)
wait_for → ["EVENTS", "RENTAL", "Found", "No events"]
list_console_messages types=[error,warn]
list_network_requests resourceTypes=[fetch,xhr]
take_screenshot filePath=tasks/testing/evidence/DATE/test-id.png
```

## Prod spot-check

Same prompts on `https://www.mdeai.co/` — expect identical fast-path behavior post `4e50f67`.
