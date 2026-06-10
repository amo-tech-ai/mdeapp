---
task_id: data-035
mvp_step: 03b
title: Café listings → venue_anchors seed (metadata + Places verify)
layer: DATA
priority: P0
status: Done
verified: 2026-06-02
linear: SAN-332
evidence: ../../testing/evidence/DATA-035-venue-anchors-cafe.md
estimated_effort: 2 days
depends_on: ["data-002", "data-009"]
unblocks: ["data-003", "data-006", "data-007", "data-008"]
skills: [mde-task-lifecycle, mde-supabase, mde-maps, mde-firecrawl]
mutation: seed
description: ETL Medellín café listing packs into venue_anchors — verified place_id, curated vibe/social in metadata; hours/phone/photos from Places only.
listings_source: ../../venues/tasks/listings/
---

# DATA-035 — Café listings → venue_anchors seed

## At a glance

| | |
|---|---|
| **For** | Sarah (café seeker) + Patricia (curated catalog) |
| **Surface** | `/chat` café cards + `CafeDetailPanel` |
| **Layer** | DATA |
| **Content** | [`tasks/venues/tasks/listings/`](../../venues/tasks/listings/) |

## What we're building

Turn **listing research** (vibe copy, Instagram, websites, “why special”) into **durable Supabase rows** on `public.venue_anchors` (`kind=cafe`), with every `google_place_id` verified via Places API New — not LLM-invented coordinates or hours.

Phase A chat stays **ADK grounding-first** (SCREEN-021 shipped). This task makes repeatability, golden evals, and richer detail panels possible without hallucinated cafés.

## Source files (listings packs)

| File | Use |
|------|-----|
| [`03-cafe-laureles.md`](../../venues/tasks/listings/03-cafe-laureles.md) | Primary Laureles profiles |
| [`04-pablado-cafes.md`](../../venues/tasks/listings/04-pablado-cafes.md) | Poblado profiles |
| [`03a-laureles.md`](../../venues/tasks/listings/03a-laureles.md) / [`04a-poblado.md`](../../venues/tasks/listings/04a-poblado.md) | Supplemental |
| [`01-cafes.md`](../../venues/tasks/listings/01-cafes.md) / [`02-cafes.md`](../../venues/tasks/listings/02-cafes.md) | Top-10 drafts (verify before prod) |
| [`prompt-cafes.md`](../../venues/tasks/listings/prompt-cafes.md) | Field checklist for manual QA |

**Not in scope:** `05*` / `06*` tour listings → **VEN-034** seed (coffee tours table).

## Field contract (`venue_anchors` + `metadata`)

**Table:** `public.venue_anchors` per [`data-009` M2](../supabase-plan.md) (apply before insert).

| Column / key | Source | Rule |
|--------------|--------|------|
| `kind` | constant | `'cafe'` |
| `name` | listings | Normalize; match Places `displayName` |
| `google_place_id` | **Places Text Search / ID** | Required; log verify response |
| `neighborhood` | listings | Laureles, El Poblado, Envigado, … |
| `latitude`, `longitude` | **Places only** | Never copy lat/lng from prose |
| `tags[]` | listings | `third-wave`, `wifi-friendly`, `coworking-friendly`, … |
| `is_active` | editorial | `true` unless closed |
| `source` | constant | `'curated'` |
| `metadata` | listings + provenance | JSON below |
| `metadata.hours`, `metadata.phone` | **omit at seed** | Filled by **DATA-008** → `place_details_cache` |
| `metadata.photos` | **Places photo refs** | Prefer Places; curated URL only if stable + noted in `metadata.image_source` |

### `metadata` JSON schema (v1)

```json
{
  "schema_version": 1,
  "why_special": "string",
  "ai_vibe_summary": "string",
  "best_for": ["remote work", "specialty coffee"],
  "coffee_profile": {
    "style": "third-wave",
    "roaster": "string|null",
    "brewing_methods": ["v60", "espresso"],
    "signature_drinks": ["string"]
  },
  "atmosphere": {
    "laptop_friendly": true,
    "wifi_note": "verified|unknown",
    "noise_level": "low|medium|high|unknown",
    "outdoor_seating": true
  },
  "contact": {
    "website": "https://…",
    "instagram": "@handle",
    "instagram_url": "https://instagram.com/…",
    "email": "info@…|null",
    "whatsapp_e164": "+57…|null"
  },
  "images": {
    "hero_place_photo_name": "places/ChIJ…/photos/…",
    "curated_urls": [],
    "image_source": "places|curated|mixed"
  },
  "semantic_descriptors": ["calm minimalist specialty café"],
  "personas": ["remote_worker", "coffee_enthusiast"],
  "confidence_score": 98,
  "listing_sources": ["03-cafe-laureles.md"],
  "verified_at": "2026-05-28T00:00:00Z",
  "places_verify": { "place_id": "ChIJ…", "mask": "id,displayName,location" }
}
```

**WhatsApp:** store **venue business** number only when public on website/IG/Google listing; never invent. User booking WhatsApp flow remains **VEN-022+** (Patricia approves message to **user**).

## Pipeline

```text
listings/*.md  →  parse/normalize (script)  →  cafes-medellin.seed.json
       →  Places verify (each row, field mask)  →  SQL or supabase seed
       →  DATA-008 backfill  →  place_details_cache (hours, phone, photos)
```

### Artifacts (commit paths)

| Artifact | Path |
|----------|------|
| Parsed seed (review) | [`supabase/seeds/venues/cafes-medellin.seed.json`](../../../supabase/seeds/venues/cafes-medellin.seed.json) |
| Apply migration / seed SQL | [`supabase/migrations/`](../../../supabase/migrations/) (e.g. `20260529150000_data035_venue_anchors_cafes.sql`) |
| Places verify log | `tasks/testing/evidence/DATA-035-places-verify.log` |
| Row count evidence | `tasks/testing/evidence/DATA-035-venue-anchors-cafe.md` |

## Goals

1. **≥15** active café rows in `venue_anchors` from listings packs (Laureles + Poblado + Envigado).
2. **100%** rows have verified `google_place_id` (Places API; `X-Goog-FieldMask` on every call).
3. **100%** rows have `metadata.ai_vibe_summary`, `metadata.why_special`, `metadata.contact.website` or `instagram` when claimed in listings (or `confidence_score` &lt; 70 + `contact` omitted).
4. **Zero** invented hours, WiFi Mbps, or prices in seed JSON.
5. `tags[]` + `semantic_descriptors` populated for **DATA-006** golden queries.
6. Link each golden-query café name → `venue_anchors.id` in evidence for **data-003** / **data-006**.

## Acceptance criteria

- [ ] `data-009` M2 applied; `\d venue_anchors` shows expected columns
- [ ] `SELECT count(*) FROM venue_anchors WHERE kind='cafe' AND is_active` ≥ 15
- [ ] Seed JSON + apply script committed; no ChatGPT ephemeral image URLs in prod without `image_source: curated` flag
- [ ] Places verify log: one line per anchor (place_id, status, neighborhood match)
- [ ] **DATA-003** checklist signed off (eval mapping)
- [ ] Spot-check 3 cafés on localhost: card shows name; detail panel pulls phone/hours from cache after **DATA-008** dry-run
- [ ] `npm run floor` exit 0 on touched `mdeapp` scripts only

## Out of scope (other tasks)

| Work | Task |
|------|------|
| Live chat clarify | **INT-008** |
| IG crawl at scale | **OCL-015** (post-MVP) |
| pgvector café embeddings | **VEC-005** |
| Coffee farm tours | **VEN-034** … **VEN-043** |

## Real-world example

**Sarah:** “quiet café in Laureles for remote work tomorrow” — golden query in **DATA-006** resolves to **Rituales** `venue_anchors` row; detail panel shows curated vibe line from `metadata.ai_vibe_summary` and phone/hours from Places cache, not from a one-off LLM turn.

## Verify

```bash
# After seed apply (Supabase MCP or psql)
SELECT id, name, neighborhood, google_place_id,
       metadata->>'ai_vibe_summary' AS vibe,
       metadata->'contact'->>'instagram' AS ig
FROM venue_anchors
WHERE kind = 'cafe' AND is_active
ORDER BY neighborhood, name;

# Places verify script (from mdeapp when added)
cd mdeapp && npm run seed:verify-cafe-anchors -- --dry-run
```
