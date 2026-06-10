=== BASELINE 2026-05-27T20:23:55-05:00 ===
## Dev
GET / -> 200

## chat-smoke
PASS  GET / — 200 98ms
PASS  POST /api/copilotkit (empty) — 400 11ms
PASS  POST /api/rentals/search — 5 results 2674ms source=supabase
WARN  POST /api/rentals/search — 2674ms (>2500ms)
PASS  Rental card shape — Cozy Studio Apartment in Laureles
PASS  Rental geo (lat/lng or explicit absence) — 6.245678,-75.589012
PASS  Rental unique IDs — 5 rows
PASS  POST /api/events/search any×10 — 10 results 1840ms
PASS  POST /api/events/search this_week (info) — 1 results 186ms — sparse OK
PASS  Event card shape — Sébastien Léger
PASS  Event geo/source backing — https://maps.google.com/?cid=17204636597442363179&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA
PASS  Event unique IDs — 10 rows
PASS  GET /api/places/detail invalid placeId — 400
PASS  GET /api/places/detail missing placeId — 400

All checks passed (1 slow warning(s))

## typecheck
> mdeapp@0.1.0 typecheck
> tsc --noEmit


## unit tests

 Test Files  76 passed (76)
      Tests  305 passed (305)
   Start at  20:24:06
   Duration  2.02s (transform 6.01s, setup 0ms, import 12.65s, tests 1.07s, environment 7ms)

