---
title: Maps Platform — API key security + HTML pages + optimization
---

# Maps Platform — Security, HTML Pages & Optimization

Official: https://developers.google.com/maps/api-security-best-practices
Optimization: https://developers.google.com/maps/optimization-guide
Coverage: https://developers.google.com/maps/coverage

---

## API key architecture — three deployment modes

### Mode 1: Personal / CLI use

API key in `.env`, used locally. Key never leaves the machine.

```
.env (GOOGLE_MAPS_API_KEY=...)
gmaps.py → calls Google APIs directly
HTML pages → zero-key embed iframes (no key in HTML)
```

**Risk:** Low — it's the user's own key on their own machine.
**Best practice:** Even personally, prefer zero-key `output=embed` iframes for HTML. Only use Maps JS API when advanced features (custom markers, polylines, clustering) are needed.

### Mode 2: Users bring their own key (BYOK)

Users configure their own Google API key. They control their own billing.

- Store key in user profile (encrypted at rest)
- Use server-side for data queries
- For shareable/exported HTML: generate static exports with **zero keys in HTML**
- Never embed a user's key in a downloadable file

### Mode 3: Platform key — you pay, users must never see it

You provide the Google API key. Architecture requires two separate keys.

```
Browser
├─ Interactive map rendering ← Frontend Key (HTTP referrer restricted)
└─ All data (weather, places, directions)
     ↑ pre-rendered from backend — NO API key in browser

Your Backend Server
├─ Backend Key (env var, IP restricted — never sent to browser)
├─ Geocoding, Directions, Places, Weather, etc.
└─ All data APIs proxied server-side
```

**Frontend key** (client-side, in the HTML):
- Enables: **Maps JavaScript API only**
- Restricted by: **HTTP referrer** → `https://app.yourdomain.com/*`
- If copied by someone: only works from your domain, useless elsewhere

**Backend key** (server-side, hidden):
- Enables: all data APIs (geocoding, directions, places, weather, etc.)
- Restricted by: **Server IP address**
- Never sent to the browser

---

## Setting up two keys in GCP Console

### Frontend key

1. **APIs & Services → Credentials → Create Credentials → API Key**
2. Edit key → Application restrictions: **HTTP referrers**
3. Add: `https://app.yourdomain.com/*`
4. API restrictions: **Restrict key** → enable **Maps JavaScript API only**
5. Save

### Backend key

1. Create another API key
2. Application restrictions: **IP addresses** → add your server IP(s)
3. API restrictions: enable all data APIs you use:
   - Geocoding, Routes, Places (New), Weather, Air Quality, Pollen
   - Solar, Elevation, Time Zone, Address Validation, Roads
   - Street View Static, Geolocation, Aerial View, Route Optimization
4. Save

```bash
# Your server environment
GOOGLE_MAPS_BACKEND_KEY=AIzaSy...xxx   # IP-restricted, server only
GOOGLE_MAPS_FRONTEND_KEY=AIzaSy...yyy  # Domain-restricted, in HTML
```

---

## HTML pages — zero-key embed iframes (default)

**Always default to zero-key embed iframes for HTML maps.** No API key in HTML, free, unlimited.

```html
<!-- Location/place map -->
<iframe src="https://maps.google.com/maps?q=El+Poblado+Medellín&z=13&output=embed"
  width="100%" height="400" style="border:0" allowfullscreen></iframe>

<!-- Directions map -->
<iframe src="https://maps.google.com/maps?saddr=Parque+Lleras&daddr=El+Centro+Medellín&output=embed"
  width="100%" height="400" style="border:0" allowfullscreen></iframe>
```

**Parameters:**
- `q` — place name or address (URL-encoded, `+` for spaces)
- `saddr` / `daddr` — origin/destination for directions
- `z` — zoom level 1–20
- `output=embed` — required
- `ll` — optional center coordinates

**WARNING:** Never use `loading="lazy"` on Google Maps embed iframes — it causes maps below the fold to appear permanently blank.

Only use `<script src="maps.googleapis.com/maps/api/js?key=...">` when you need **advanced interactive features** (custom markers, polylines, clustering) that embeds can't support.

---

## Street View — zero-key approach (hard rule)

**Never embed Street View using the JavaScript API or Embed API in HTML pages.** Both expose the key in client-side code.

Instead, use a **direct Google Maps link** — zero cost, zero key exposure, full interactive experience:

```
https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={lat},{lng}&heading={heading}&pitch=0&fov=90
```

**Parameters:**
- `viewpoint` — `lat,lng` coordinates
- `heading` — compass degrees (0=North, 90=East, 180=South, 270=West)
- `pitch` — angle (-90=down, 0=level, 90=up)
- `fov` — field of view 10–100 degrees
- `map_action=pano` — **required** — explicitly triggers panorama mode

```html
<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=6.2088,-75.5736&heading=90&pitch=0&fov=90"
   target="_blank" rel="noopener noreferrer">
  Open Street View →
</a>
```

**WARNING:** The old shorthand `@{lat},{lng},3a,75y,{heading}h,90t` is unreliable. Always use `map_action=pano`.

---

## Shareable export mode — no keys in downloadable HTML

When users want to download or share HTML pages:

| Element | In-app (interactive) | Shareable export |
|---------|---------------------|-----------------|
| Maps | Maps JS API (frontend key) | Embed iframe (free, no key) |
| Street View | Direct Google Maps link (no key) | Direct Google Maps link (no key) |
| Route lines | `DirectionsRenderer` (frontend key) | Static map image with path overlay |
| Data (weather, places) | Pre-rendered from backend | Same pre-rendered HTML — no API calls |

```bash
# Generate free embed URLs for shareable exports
python3 ~/.claude/skills/mde-maps/scripts/gmaps.py embed-url --mode place --query "El Poblado Medellín"
python3 ~/.claude/skills/mde-maps/scripts/gmaps.py embed-url --mode directions --origin "Aeropuerto Medellín" --destination "El Poblado"
```

---

## Rate limiting and abuse prevention (platform mode)

When serving multiple users with your key:
- **Per-user rate limits** — cap API calls per user per hour/day
- **Authentication** — only authenticated users can trigger API calls
- **Usage tracking** — log which user triggered which call
- **Quota alerts** — GCP billing alerts for unexpected spikes
- **Budget caps** — maximum daily spend in GCP Console

---

## Performance optimization

From https://developers.google.com/maps/optimization-guide:

### Reduce API calls
- Send requests **only on user interaction** — never proactively
- **Cache results** where permitted (geocoded addresses, place details)
- Use **exponential backoff** on quota errors (double wait time each retry)

### Map rendering performance
- Use **raster markers** (PNG/JPG) not SVG — lower rendering overhead
- Enable **marker optimization** for large marker sets (renders as one static element)
- Use **Marker Clusterer library** for 100+ markers
- Keep intensive operations (large queries, DOM manipulation) out of `Draw()` callbacks
- Avoid overlay redraws during map pan/zoom

### Billing optimization
- Request only the **field mask** fields you display (Places API)
- Use **Place Details** (cheaper) instead of Text Search when you already have `place_id`
- Use **session tokens** for autocomplete + place details (groups into one billing event)
- `googleMapsLinks` is currently **free** — include in every Places mask
- Geocoding fallback (location field only) uses Basic Data SKU — cheapest option

### Set budget alerts
```
GCP Console → Billing → Budgets & Alerts
```
Set alerts at 50%, 75%, 90% of monthly budget. Set a hard cap to stop serving at limit.

---

## Coverage

Coverage varies by API and region: https://developers.google.com/maps/coverage

| Coverage type | Notes |
|--------------|-------|
| Maps imagery | Global — satellite and street-level vary by region |
| Street View | Major cities comprehensive; rural areas sparse |
| Places data | Best coverage in US, EU, India, Australia; Latin America good in major cities |
| `generativeSummary` | **English only; US and India only** as of 2026-05 |
| Real-time traffic | Limited to regions with Google traffic data |
| Transit data | Depends on local transit agency agreements |

**For mdeAI (Medellín):** Maps imagery and Places data are good in Medellín metro. `generativeSummary` is NOT available for Medellín — store null gracefully when enriching.

---

## Error types and responses

| Error | Meaning | Fix |
|-------|---------|-----|
| `403 Forbidden` / `REQUEST_DENIED` | API not enabled or key restricted | Enable API in GCP Console; check key restrictions |
| `400 Bad Request` | Invalid parameters | Check API docs for required fields |
| `429 Rate Limited` | Quota exceeded | Exponential backoff; check daily limits |
| `ZERO_RESULTS` | No results found | Broaden query or expand radius |
| `RefererNotAllowedMapError` | HTTP referrer restriction mismatch | Add current origin to key's referrer list |
| Key not found | `GOOGLE_MAPS_API_KEY` not set | Check `.env` or environment variables |

When a command fails with `403` or `REQUEST_DENIED`: **stop and tell the user**. Do not silently fall back to web search. Offer to navigate to GCP Console to enable the API.

**GCP API library URL pattern:**
```
https://console.cloud.google.com/apis/library/{api-endpoint}
```

| API | Endpoint |
|-----|---------|
| Places (New) | `places-backend.googleapis.com` |
| Geocoding | `geocoding-backend.googleapis.com` |
| Routes | `routes-backend.googleapis.com` |
| Maps JavaScript | `maps-backend.googleapis.com` |
| Weather | `weather.googleapis.com` |
| Air Quality | `airquality.googleapis.com` |

---

## Pricing summary (as of 2026-05)

- **Maps Embed API**: Always free
- **Maps JavaScript API**: $7 per 1,000 loads
- **Street View (JS API)**: $7 per 1,000 panoramas — **use direct links instead**
- **Places API (New)**: $17–40 per 1,000 requests (depends on field SKU)
- **Geocoding**: $5 per 1,000 requests
- **Routes API**: $5–15 per 1,000 requests
- **Directions API**: $10 per 1,000 requests
- **$200/month free credit** on Google Maps Platform

Check https://developers.google.com/maps/billing-and-pricing/pricing for current rates — prices change.
