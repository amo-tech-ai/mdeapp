---
title: Google Maps Platform — all APIs CLI reference
---

# Google Maps Platform — all APIs CLI reference

CLI tool: `.claude/skills/mde-maps/scripts/gmaps.py` (repo path; `google-maps-api` is a **redirect stub** — behavior rules: [`gmaps-cli-behavior.md`](gmaps-cli-behavior.md)).
No external Python dependencies — uses stdlib only (`urllib`, `json`, `ssl`).

Key setup: `GOOGLE_MAPS_API_KEY` in `.env` (project dir, home dir, or env var). See [`security-and-optimization.md`](security-and-optimization.md) for multi-key architecture.

## Table of contents

- [Quick intent → command mapping](#quick-intent--command-mapping)
- [Geocoding](#geocoding) — forward + reverse
- [Routes & Directions](#routes--directions)
- [Places](#places) — text search · nearby · details · autocomplete · photos
- [Air Quality](#air-quality) — current · historical · forecast
- [Pollen](#pollen)
- [Solar](#solar)
- [Weather](#weather)
- (later sections — Roads, Time Zone, Elevation, etc. — search by command in the file)

---

## Quick intent → command mapping

| User wants | Command |
|-----------|---------|
| Address → coordinates | `geocode` |
| Coordinates → address | `reverse-geocode` |
| Directions A → B | `directions` |
| Distance/time matrix | `distance-matrix` |
| Find places by query | `places-search` |
| Find places near coords | `places-nearby` |
| Full details for a place | `place-details` |
| Type-ahead suggestions | `autocomplete` |
| Air quality at location | `air-quality` |
| Pollen forecast | `pollen` |
| Weather (current/forecast) | `weather` |
| Building solar potential | `solar` |
| Elevation | `elevation` |
| Timezone | `timezone` |
| Validate/correct address | `validate-address` |
| Snap GPS trace to roads | `snap-roads` |
| Street View image | `streetview` |
| Static map image | `static-map` |
| Optimize delivery routes | `route-optimize` |
| Count places in area | `places-aggregate` |
| Embeddable map URL | `embed-url` |

---

## Geocoding

```bash
# Forward geocode — address to coords
python3 gmaps.py geocode "Parque Lleras, El Poblado, Medellín"
python3 gmaps.py geocode "Carrera 43A, Medellín" --language es --region co

# Reverse geocode — coords to address
python3 gmaps.py reverse-geocode 6.2088 -75.5736
python3 gmaps.py reverse-geocode 6.2442 -75.5812 --language es
```

---

## Routes & Directions

```bash
# Directions between two locations
python3 gmaps.py directions "El Poblado, Medellín" "Aeropuerto Internacional José María Córdova"
python3 gmaps.py directions "Laureles" "Centro Comercial El Tesoro" --mode transit
python3 gmaps.py directions "Estadio" "Parque Arví" --alternatives --avoid-tolls
python3 gmaps.py directions "A" "D" --waypoints "B" "C"

# Distance matrix — multiple origins/destinations
python3 gmaps.py distance-matrix \
  --origins "El Poblado" "Laureles" \
  --destinations "Aeropuerto" "Terminal Sur"
```

**Modes:** `driving` (default), `walking`, `bicycling`, `transit`
**Avoid:** `tolls`, `highways`, `ferries`

---

## Places

```bash
# Text search — find places by query
python3 gmaps.py places-search "best arepas in Medellín"
python3 gmaps.py places-search "hostel" --location "6.2088,-75.5736" --radius 2000
python3 gmaps.py places-search "rooftop bar" --min-rating 4.0 --open-now
python3 gmaps.py places-search "co-working space" --type "establishment"

# Nearby search — find places near coordinates
python3 gmaps.py places-nearby 6.2088 -75.5736 --type restaurant --radius 800
python3 gmaps.py places-nearby 6.2442 -75.5812 --type cafe --max-results 5

# Place details — full info for a place
python3 gmaps.py place-details ChIJN1t_tDeuEmsRUsoyG83frY4

# Autocomplete — type-ahead suggestions
python3 gmaps.py autocomplete "parque" --location "6.2442,-75.5812"
python3 gmaps.py autocomplete "metro" --types "transit_station"

# Place photo URL
python3 gmaps.py place-photo "places/PLACE_ID/photos/PHOTO_REF" --max-width 800
```

---

## Air Quality

```bash
# Current AQI conditions
python3 gmaps.py air-quality 6.2088 -75.5736
python3 gmaps.py air-quality 6.2088 -75.5736 --health --pollutants

# Historical data (up to 30 days back)
python3 gmaps.py air-quality-history 6.2088 -75.5736 --hours 48

# Forecast (up to 96 hours)
python3 gmaps.py air-quality-forecast 6.2088 -75.5736
```

Returns: AQI index, pollutant breakdown, health recommendations.

---

## Pollen

```bash
# Pollen forecast (up to 5 days, grass/weed/tree)
python3 gmaps.py pollen 6.2088 -75.5736
python3 gmaps.py pollen 6.2088 -75.5736 --days 5
```

Returns: Universal Pollen Index (UPI) for 3 plant types and 15 species.

---

## Solar

```bash
# Building solar potential — roof area, sunlight, panel layout, energy/cost estimates
python3 gmaps.py solar 6.2088 -75.5736
python3 gmaps.py solar 6.2088 -75.5736 --quality HIGH

# Solar data layers (DSM, flux, shade rasters)
python3 gmaps.py solar-layers 6.2088 -75.5736 --radius 100
```

Note: US-focused accuracy; results may be less precise for Medellín.

---

## Weather

```bash
# Current conditions
python3 gmaps.py weather 6.2088 -75.5736
python3 gmaps.py weather 6.2088 -75.5736 --mode current

# Hourly forecast (up to 240 hours)
python3 gmaps.py weather 6.2088 -75.5736 --mode hourly --hours 48

# Daily forecast (up to 10 days)
python3 gmaps.py weather 6.2088 -75.5736 --mode daily --days 7

# Recent history (up to 24 hours)
python3 gmaps.py weather 6.2088 -75.5736 --mode history --hours 12
```

Note: Weather API may require billing enabled on the GCP project.

---

## Elevation

```bash
# Single point
python3 gmaps.py elevation 6.2088 -75.5736

# Multiple points (pipe-separated)
python3 gmaps.py elevation --locations "6.2088,-75.5736|6.2442,-75.5812"

# Elevation profile along a path
python3 gmaps.py elevation --path "6.2088,-75.5736|6.3000,-75.6000" --samples 20
```

---

## Timezone

```bash
python3 gmaps.py timezone 6.2088 -75.5736
python3 gmaps.py timezone 6.2088 -75.5736 --language es
```

Returns: `America/Bogota`, UTC offset, DST offset.

---

## Address Validation

```bash
python3 gmaps.py validate-address "Carrera 43A 19-17, El Poblado, Medellín"
python3 gmaps.py validate-address "123 Calle 10" --region CO
```

Returns: deliverability verdict, corrected/normalized address, component-level confirmation.
Note: USPS CASS data only available for US addresses.

---

## Roads

```bash
# Snap GPS trace to nearest roads
python3 gmaps.py snap-roads "6.2088,-75.5736|6.2090,-75.5740|6.2092,-75.5745"
python3 gmaps.py snap-roads "6.2088,-75.5736|6.2092,-75.5745" --interpolate

# Find nearest roads to coordinates
python3 gmaps.py nearest-roads "6.2088,-75.5736|6.2090,-75.5740"
```

Note: Speed limits require an Asset Tracking license.

---

## Street View

**CLI use (downloads image, costs ~$7/1,000):**
```bash
python3 gmaps.py streetview --lat 6.2088 --lng -75.5736 --heading 90
python3 gmaps.py streetview --location "El Poblado, Medellín" --size 800x600
python3 gmaps.py streetview --pano CAoSLEFGMVFpcE... --output medellin_sv.jpg
```

**For HTML pages — use a direct Google Maps link instead (free, no key in HTML):**
```
https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={lat},{lng}&heading={heading}&pitch=0&fov=90
```

See [`security-and-optimization.md`](security-and-optimization.md#street-view--zero-key-approach) for full Street View link pattern.

---

## Static Maps

```bash
python3 gmaps.py static-map --lat 6.2088 --lng -75.5736 --zoom 14
python3 gmaps.py static-map --center "El Poblado Medellín" --maptype satellite --zoom 13
python3 gmaps.py static-map --center "Laureles" --markers "color:red|6.2088,-75.5736" --size 800x600
```

---

## Geolocation

```bash
# Location estimate from IP/WiFi
python3 gmaps.py geolocation
python3 gmaps.py geolocation --wifi "00:11:22:33:44:55,-65" "66:77:88:99:AA:BB,-72"
```

---

## Aerial View (US only)

```bash
python3 gmaps.py aerial-view check --address "1600 Amphitheatre Pkwy, Mountain View"
python3 gmaps.py aerial-view render --address "1600 Amphitheatre Pkwy, Mountain View"
python3 gmaps.py aerial-view get --video-id VIDEO_ID
```

Note: US addresses only.

---

## Route Optimization (VRP)

Solve vehicle routing problems (VRP):

```bash
python3 gmaps.py route-optimize problem.json --project my-gcp-project
```

Input JSON format: `{"model": {"shipments": [...], "vehicles": [...]}}` per Google Route Optimization API spec. Requires GCP project ID.

---

## Places Aggregate (Insights)

Count or list places matching filters in an area:

```bash
# Count coffee shops within 5km of El Poblado
python3 gmaps.py places-aggregate --location "6.2088,-75.5736" --radius 5000 --type cafe

# List 4+ rated restaurants with insights
python3 gmaps.py places-aggregate --location "6.2442,-75.5812" --type restaurant --min-rating 4.0 --insight INSIGHT_PLACES
```

---

## Maps Embed URL (free, unlimited)

Generate embeddable map URLs — no API key needed:

```bash
python3 gmaps.py embed-url --mode place --query "Parque Explora Medellín"
python3 gmaps.py embed-url --mode directions --origin "El Poblado" --destination "Centro"
python3 gmaps.py embed-url --mode streetview --lat 6.2088 --lng -75.5736
```

---

## API enablement in GCP Console

Enable at: `https://console.cloud.google.com/apis/library/{endpoint}`

| API | Endpoint to enable |
|-----|-------------------|
| Places (New) | `places-backend.googleapis.com` |
| Geocoding | `geocoding-backend.googleapis.com` |
| Routes / Directions | `routes-backend.googleapis.com` |
| Weather | `weather.googleapis.com` |
| Air Quality | `airquality.googleapis.com` |
| Pollen | `pollen.googleapis.com` |
| Solar | `solar.googleapis.com` |
| Elevation | `elevation-backend.googleapis.com` |
| Time Zone | `timezone-backend.googleapis.com` |
| Address Validation | `addressvalidation.googleapis.com` |
| Roads | `roads.googleapis.com` |
| Street View Static | `street-view-image-backend.googleapis.com` |
| Maps JavaScript | `maps-backend.googleapis.com` |
| Geolocation | `geolocation.googleapis.com` |
| Route Optimization | `routeoptimization.googleapis.com` |

---

## Notes

- All output is JSON (except image downloads which save to file)
- No external Python dependencies — stdlib only
- `.env` is searched in: CWD, home dir, skill dir
- Aerial View is US addresses only
- Route Optimization requires a GCP project ID
- Weather may require billing enabled on the project
