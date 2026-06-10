---
doc_type: curated_reference
parent_skill: mde-maps
topic: places-api-new-web-service
title: Places API (New) — official doc map + mdeAI rules
description: >-
  Navigation layer for Google Places API (New) Web Service. Read this first for URLs,
  which surface to use, field-mask rules, and Colombia constraints; then open
  places-api-new.md for Node (@googlemaps/places) examples.
---

# Places API (New) — Web Service reference hub

## How to use this file (progressive disclosure)

1. **Pick a surface** from the index table below → open the **live** Google doc.
2. **Apply mdeAI rules** in §3 before writing code.
3. **Copy patterns** from [`places-api-new.md`](places-api-new.md) (`@googlemaps/places`, `X-Goog-FieldMask`).
4. **Product / tasks / audit:** repo `tasks/maps/maps-prd-v2.md`, `tasks/maps/places-api-new-audit.md`, PLACES-002–081.

**Offline full-text mirrors (grep / air-gap):** [`places-official/README.md`](places-official/README.md) — vendor exports for Text Search, Details, Photos, Autocomplete, data fields, UI Kit, Contextual View. **Still tertiary** to live docs.

**Older offline folder:** [`google-offline/README.md`](google-offline/README.md) — MCP, Map ID, security, etc. (no dedicated Places Web Service pages there).

---

## 1. Official documentation index (Places API New)

Base path: `https://developers.google.com/maps/documentation/places/web-service/`

| Surface | Live doc | HTTP (v1) | Typical mdeAI use |
|---------|----------|-----------|-------------------|
| Overview | [op-overview](https://developers.google.com/maps/documentation/places/web-service/op-overview) | — | Enable **Places API (New)** only (not legacy Places) |
| Text Search | [text-search](https://developers.google.com/maps/documentation/places/web-service/text-search) | `POST /v1/places:searchText` | PLACES-005-010 enrichment by name + area |
| Nearby Search | [nearby-search](https://developers.google.com/maps/documentation/places/web-service/nearby-search) | `POST /v1/places:searchNearby` | PLACES-016 “nearby” pins |
| Place Details | [place-details](https://developers.google.com/maps/documentation/places/web-service/place-details) | `GET /v1/places/{place_id}` | PLACES-011 refresh when `place_id` known |
| Place Photos | [place-photos](https://developers.google.com/maps/documentation/places/web-service/place-photos) | Media resource | PLACES-012 thumbnails (server fetch only) |
| Place Autocomplete | [place-autocomplete](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete) | `POST /v1/places:autocomplete` | PLACES-018 host / venue capture |
| Data fields (field masks) | [data-fields](https://developers.google.com/maps/documentation/places/web-service/data-fields) | `X-Goog-FieldMask` | **PLACES-002** — billing + payload control |
| Usage and billing | [usage-and-billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing) | — | SKU tiers, quotas |
| Place types (filters) | [place-types](https://developers.google.com/maps/documentation/places/web-service/place-types) | `includedTypes`, etc. | Nearby + MCP alignment |
| Maps Links | [maps-links](https://developers.google.com/maps/documentation/places/web-service/maps-links) | `googleMapsLinks` on Place | Store **`placeUri`** — do not hand-build Maps URLs (PLACES-004) |

**Related (not under `.../places/web-service/`):**

| Surface | Live doc | mdeAI use |
|---------|----------|-----------|
| Geocoding API | [Geocoding overview](https://developers.google.com/maps/documentation/geocoding/overview) | PLACES-017 address → lat/lng (often cheaper than Text Search for coords-only) |

---

## 2. REST base URL (Places API New)

```
https://places.googleapis.com/v1/
```

Use **`X-Goog-FieldMask`** on every request that supports it. Omitting or over-broad masks wastes money and violates production rules in `tasks/maps/maps-prd-v2.md`.

---

## 3. mdeAI rules (always apply)

| Rule | Detail |
|------|--------|
| **Keys** | `GOOGLE_PLACES_API_KEY` — **server only**, IP-restricted (see [`security-and-optimization.md`](security-and-optimization.md), MASTRA-071, PLACES-022). Never ship in `VITE_*`. |
| **Maps URLs** | Prefer **`googleMapsLinks.placeUri`** from the API; do not construct `maps.google.com` query URLs for production cards. |
| **Colombia** | Treat **`generativeSummary`** / **Area summaries** as **unreliable or empty** for Medellín; use offline Gemini + Supabase `ai_summary` per PRD v2 — see [`places-api-new.md`](places-api-new.md) notes. |
| **Photos** | Search/Details return **photo references**; fetching bytes is **Place Photos (New)** — see live Place Photos doc. Never expose the API key in browser image URLs. |
| **Field masks** | Text Search / Nearby Search → field paths prefixed with **`places.`** on list responses. Place Details (`getPlace`) → mask uses **top-level** field names (no `places.` prefix) per official Data fields doc — confirm against live doc when coding. |
| **RLS** | Cached Places payloads in Supabase: service-role writes; documented TTL (PLACES-003). |

---

## 4. Task crosswalk (MASTRA)

| Task | Surfaces |
|------|----------|
| PLACES-002 | Data fields + usage/billing — audit all masks |
| PLACES-005-010, 067 | Text Search + Maps Links |
| PLACES-003 | Caching strategy (all surfaces that write cache) |
| PLACES-016 | Nearby Search |
| PLACES-011 | Place Details |
| PLACES-012 | Place Photos |
| PLACES-018 | Place Autocomplete |
| PLACES-017 | Geocoding API |
| PLACES-022–081 | Security/quota + fixtures |

---

## 5. Changelog

| Date | Change |
|------|--------|
| 2026-05-13 | Initial hub — converts scattered Places “doc places” into one skill `references/` entry per skill-creator progressive disclosure. |
