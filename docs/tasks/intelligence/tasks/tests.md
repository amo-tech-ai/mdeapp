Here's a tiered breakdown from fastest to most thorough:

---

## Tier 1 — Automated (I can run these now)

**INT-006 date filters — 12 unit tests:**
```bash
cd mdeapp && npx vitest run src/lib/__tests__/rental-date-filter.test.ts
```
Verifies: date parsing ("june 1 to 30" → ISO dates), year roll-over, weekend/tomorrow logic, confidence bands, memory date fallback.

**INT-022 telemetry — 6 unit tests:**
```bash
npx vitest run src/lib/__tests__/intelligence-telemetry.test.ts
```
Verifies: emits on `LOG_LEVEL=debug`, silent otherwise, no raw query text in the record, correct action/source tags.

**Full regression suite (419 tests):**
```bash
npx vitest run
```
Verifies nothing regressed across all 419 existing tests.

---

## Tier 2 — API smoke (needs `npm run dev` running)

Proves the route actually accepts dates and passes them to Supabase:

```bash
# No dates — baseline
curl -s -X POST http://localhost:3001/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"limit":3}' | jq '.results | length'

# With June date range
curl -s -X POST http://localhost:3001/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"checkIn":"2026-06-01","checkOut":"2026-06-30","stayType":"monthly","limit":5}' | jq '.results[].availability'

# Bad date format — should return 400
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"checkIn":"june 1"}'
```

What to look for: second call returns listings whose `availability` overlaps June; third returns `400`.

---

## Tier 3 — Browser smoke (manual, needs dev running)

**INT-006 chat path:**
1. Open `http://localhost:3001/chat`
2. Type: `rentals june 1 to 30 $1000 medellin`
3. Expected: fast-path fires (no clarify prompt), rental cards appear with availability info

**INT-022 telemetry log:**
1. Run `cd mdeapp && npm run dev:debug` (sets `LOG_LEVEL=debug`)
2. Type a rental query in chat
3. Check the terminal — you should see a line like:
```
[int-routing] {"intent":"rental_search","slots":{...},"confidence":0.78,"action":"search_now","source":"fast-path",...}
```

---

## What these tests don't cover

| Gap | Why |
|---|---|
| Supabase date overlap SQL correctness | No live DB in unit tests — needs a real query against `zkwcbyxiwklihegjhuql` or a Tier 2 curl with known seed data |
| `concierge.ts` Zod `genericAskPending` persisting across turns | Needs agent memory round-trip (Mastra dev server + multi-turn chat) |
| INT-003/004 clarify routing end-to-end | Blocked — `conciergeAgent` still crashes on prod |

Want me to run the Tier 1 tests now for a clean confirmation?