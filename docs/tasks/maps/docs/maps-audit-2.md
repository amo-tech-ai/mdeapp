# Maps Forensic Audit Verdict

**Score: 84/100** (architecture + localhost MVP) · **58/100** prod cost-safe until MAP-005 + MAP-002B

> **Verified 2026-05-27** against disk + [`maps-audit-plan.md`](./maps-audit-plan.md). Suggestions below are **correct**. Tasks filed: data-033/034, MAP-034, MAP-DOC-001 ✅, **MAP-002B**, **MAP-008B**, **MAP-011A**.

The plan is mostly correct. The biggest issue is not architecture — it is **production hardening**.

Your audit correctly says the map platform is close for MVP, but still blocked by:

```text
MAP-005 places-proxy + cache wiring
Prod ADK deployment
field-mask enforcement
Map ID verification
attribution coverage
docs drift
```

# Verified Google Maps Best Practices

| Area             | Correct best practice                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Advanced Markers | Require a valid **Map ID**. Without it, advanced markers cannot load. ([Google for Developers][1])                         |
| Places API New   | Place Details, Nearby Search, and Text Search require field masks to avoid errors/cost bloat. ([Google for Developers][2]) |
| Place Details    | If no field mask is passed, the API returns an error. ([Google for Developers][3])                                         |
| API keys         | Google recommends application restrictions + API restrictions for every key. ([Google for Developers][4])                  |
| Security         | Restricting Maps API keys limits unauthorized usage if exposed. ([Google Maps Platform][5])                                |

# What Is Correct

| Area                                      | Verdict                |
| ----------------------------------------- | ---------------------- |
| Maps as spatial proof, not business truth | ✅ Correct              |
| Supabase owns inventory/commerce          | ✅ Correct              |
| Mastra orchestrates                       | ✅ Correct              |
| CopilotKit renders cards/map UI           | ✅ Correct              |
| Gemini must not invent geo facts          | ✅ Correct              |
| ADK/Grounding as bounded sidecar          | ✅ Correct              |
| Advanced Markers + Map ID                 | ✅ Correct              |
| Server-side Places client                 | ✅ Correct              |
| Field mask registry                       | ✅ Correct              |
| Category pin system                       | ✅ Correct              |
| `mergePinsByCategory`                     | ✅ Correct              |
| No browser Places key                     | ✅ Critical and correct |

# Critical Blockers

| Priority | Blocker                                | Why it matters                              | Fix                                                |
| -------- | -------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| P0       | No production-safe `places-proxy`      | Repeat queries bill Google directly         | Build MAP-005                                      |
| P0       | Cache tables exist but not fully wired | Supabase setup is incomplete operationally  | Wire `places_search_cache` + `place_details_cache` |
| P0       | ADK defaults to localhost              | Vercel production will fail                 | [MAP-002B](../MAP-002B-prod-adk-deploy.md) |
| P0       | Map ID must be verified in Vercel      | Advanced Markers fail without it            | [MAP-008B](../MAP-008B-vercel-map-id-verify.md) |
| P1       | Nearby Search not productized          | “Show nearby” cannot work fully             | MAP-006                                            |
| P1       | Route cache missing                    | Commute features will be expensive/repeated | **data-033** before MAP-011                        |
| P1       | Docs are stale                         | Cursor may redo shipped work                | **MAP-DOC-001 ✅** |

# Task crosswalk (audit → spec)

| Audit suggestion | Task | Status |
|------------------|------|--------|
| MAP-005 places-proxy | [MAP-005](../MAP-005-places-proxy-cache.md) | Not started |
| Prod ADK deploy | [MAP-002B](../MAP-002B-prod-adk-deploy.md) | Not started |
| Vercel Map ID verify | [MAP-008B](../MAP-008B-vercel-map-id-verify.md) | Not started |
| route_cache | [data-033](../../data/tasks-data/data-033-route-cache-schema.md) | Not started |
| Geo inventory | [data-034](../../data/tasks-data/data-034-maps-geo-inventory.md) | Not started |
| Advanced marker UX | [MAP-034](../MAP-034-advanced-marker-ux-polish.md) | P2 |
| compute_routes stub | [MAP-011A](../MAP-011A-adk-compute-routes.md) | Not started |
| Docs refresh | [MAP-DOC-001](../MAP-DOC-001-refresh-maps-prd-repo-truth.md) | Done |
| Cache audit after proxy | [data-007](../../data/tasks-data/data-007-cache-audit.md) | After MAP-005 |

# Red Flags

| Severity | Red flag                                                             |
| -------- | -------------------------------------------------------------------- |
| 🔴       | Any `GOOGLE_PLACES_API_KEY` or server key exposed as `NEXT_PUBLIC_*` |
| 🔴       | Places calls from browser instead of server/edge                     |
| 🔴       | Advanced Markers rendered without Map ID                             |
| 🔴       | Gemini-generated lat/lng/place_id accepted without tool validation   |
| 🟠       | Grounded cards without Google attribution                            |
| 🟠       | Cache tables service-role only but no edge proxy using them          |
| 🟠       | ADK becoming a second orchestrator instead of a bounded maps sidecar |
| 🟡       | Too many map agents before MVP                                       |
| 🟡       | Duplicate map loaders if ECL is added too early                      |
| 🟡       | Mobile map sheet not fully polished                                  |

# Supabase Maps Setup

**Mostly correct but incomplete.**

| Supabase Area                 | Status                                      |
| ----------------------------- | ------------------------------------------- |
| `place_details_cache`         | Exists, partial use                         |
| `places_search_cache`         | Exists, not fully used                      |
| `grounding_quota_log`         | Good                                        |
| apartments lat/lng            | Good                                        |
| restaurants `google_place_id` | Needs coverage audit                        |
| events venue coordinates      | Needs proof                                 |
| route cache                   | Missing                                     |
| RLS                           | Good if cache tables stay service-role only |
| Edge proxy                    | Missing/critical                            |

# Critical Fix Order

```text
1. Build MAP-005 places-proxy edge function
2. Wire Places calls through Supabase cache
3. Verify field masks on every Places call
4. Deploy ADK sidecar for production
5. Add ADK_INTERNAL_TOKEN validation
6. Verify Vercel Map ID env
7. Add cache hit/miss tests
8. Add attribution tests for every grounded card
9. Add route_cache before commute features
10. Refresh stale maps PRD docs
```

# Best Improvements

## Add these tests

```text
- repeated Place Details call returns cache hit
- browser never calls Places API directly
- every Places request has X-Goog-FieldMask
- Advanced Markers fail gracefully without Map ID
- grounded card always renders attribution
- card click highlights map pin
- pin click scrolls/highlights card
- mobile 390px map usability
- anon cannot read service-only cache tables
```

## Add this data task

```text
data-034 Maps geo inventory:  ✅ tasks/data/tasks-data/data-034-maps-geo-inventory.md
data-033 route_cache:         ✅ tasks/data/tasks-data/data-033-route-cache-schema.md
```

Include cache coverage by entity type in data-034 + data-007 (after MAP-005).

## Add this map task

```text
MAP-034 Advanced Marker UX:  ✅ tasks/maps/MAP-034-advanced-marker-ux-polish.md
MAP-002B Prod ADK deploy:    ✅ tasks/maps/MAP-002B-prod-adk-deploy.md
MAP-008B Vercel Map ID:      ✅ tasks/maps/MAP-008B-vercel-map-id-verify.md
MAP-011A compute_routes:     ✅ tasks/maps/MAP-011A-adk-compute-routes.md
```

# Final Recommendation

The architecture is correct.

Do **not** rebuild maps.
Do **not** add another map library.
Do **not** turn ADK into the main orchestrator.

Focus on:

```text
MAP-002B + MAP-008B (P0 prod hardening, parallel)
MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010 → MAP-011A → MAP-011
data-034 (geo inventory) · data-033 (before MAP-011)
```

After MAP-005 and production ADK deployment, readiness should move from about **84/100 to 90/100**.

[1]: https://developers.google.com/maps/documentation/javascript/advanced-markers/start?utm_source=chatgpt.com "Get started | Maps JavaScript API"
[2]: https://developers.google.com/maps/documentation/places/web-service/choose-fields?utm_source=chatgpt.com "Choose fields to return | Places API"
[3]: https://developers.google.com/maps/documentation/places/web-service/place-details?utm_source=chatgpt.com "Place Details (New) | Places API"
[4]: https://developers.google.com/maps/api-security-best-practices?utm_source=chatgpt.com "Google Maps Platform security guidance"
[5]: https://mapsplatform.google.com/resources/blog/google-maps-platform-best-practices-restricting-api-keys/?utm_source=chatgpt.com "Google Maps Platform best practices: Restricting API keys"
