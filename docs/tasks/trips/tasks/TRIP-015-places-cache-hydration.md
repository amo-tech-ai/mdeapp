---
task_id: TRIP-015
title: Places cache + itinerary hydration
layer: APP + MAPS + DATA
priority: P1
phase: hardening
status: Not Started
estimated_effort: 4h
persona: Camila, Patricia
depends_on: [TRIP-008, MAP-005, data-007, data-030]
unblocks: [TRIP-012]
skills: [mde-maps, mde-supabase, testing]
description: Ensure trip maps and saved cards use cached Places/details data and stable snapshots instead of repeated live Google calls.
---

# TRIP-015 — Places cache + hydration

## Goal

Camila can reopen a trip map without billing Google again for the same place details, and Patricia has cache evidence if Places spend spikes.

## Build scope

- Use `trip_items` snapshot fields first for itinerary/map rendering.
- Hydrate missing display details from `place_details_cache` / `places_search_cache` through MAP-005 proxy only.
- Add app-level memoization or React Query/SWR cache for trip workspace reads.
- Batch saved collection hydration; avoid one request per card.
- Record cache hit/miss evidence for trip map and saved collection routes.

## Acceptance criteria

- [ ] No browser-side Places API New calls from Trips surfaces.
- [ ] Reopening `/trips/[id]` map with cached items produces cache hits, not new Google requests.
- [ ] Missing cache row degrades to snapshot title/address, not a broken card.
- [ ] Field masks are present for every Places API New call behind the proxy.
- [ ] Evidence file: `tasks/trips/evidence/TRIP-015-cache-hydration.md`.

## Tests

- Unit/component test for snapshot-first rendering.
- Integration smoke for cache-hit path.
- Network/browser proof: no `places.googleapis.com` call from client.

## Do not do

- Do not build a new trip-specific Places cache table.
