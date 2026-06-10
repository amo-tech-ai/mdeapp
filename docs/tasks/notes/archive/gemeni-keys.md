# Google Cloud keys — mdeai (`dev-inscriber-445714-k0`)

**Project:** [dev-inscriber-445714-k0](https://console.cloud.google.com/home/dashboard?project=dev-inscriber-445714-k0)

**Rule:** 2 physical keys minimum (browser + server). Gemini can be key #3 or same GCP project with separate key.

---

## Step 0 — Billing (fixes `Lightning dunning deny`)

1. [Billing → link project](https://console.cloud.google.com/billing/linkedaccount?project=dev-inscriber-445714-k0)
2. Without billing, **Gemini returns 403** — nothing in mdeapp code fixes that.

---

## Step 1 — Enable these APIs / products

Open [API Library](https://console.cloud.google.com/apis/library?project=dev-inscriber-445714-k0) and enable:

| Enable | Why | mdeai uses it for |
|--------|-----|-------------------|
| **[Generative Language API](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com?project=dev-inscriber-445714-k0)** | Gemini chat + tools | Mastra `conciergeAgent`, ADK dev fallback |
| **[Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=dev-inscriber-445714-k0)** | Map tiles + Advanced Markers in browser | Camila’s map on `/` |
| **[Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com?project=dev-inscriber-445714-k0)** | Server place search | MAP-004+ `searchText`, rental/grounded cards |
| **[Maps Grounding Lite](https://console.cloud.google.com/marketplace/product/google/mapstools.googleapis.com?project=dev-inscriber-445714-k0)** | MCP at `mapstools.googleapis.com/mcp` | Tourist “quiet cafés near Laureles” grounding |

Optional (not required for MVP):

- Geocoding API — only used by `npm run verify:maps-env` probe on browser key

---

## Step 2 — Create Map ID (not a key)

1. [Map Management](https://console.cloud.google.com/google/maps-apis/studio/maps?project=dev-inscriber-445714-k0) → **Create map** (Vector)
2. Copy **Map ID** → `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`

---

## Step 3 — Create API keys

[Credentials → Create credentials → API key](https://console.cloud.google.com/apis/credentials?project=dev-inscriber-445714-k0)

### Key 1 — Browser Maps (public, goes in Next.js bundle)

| | |
|---|---|
| **Name** | `mdeai-browser-maps` |
| **Env var** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **API restriction** | Maps JavaScript API only |
| **Application restriction** | HTTP referrers |

**Referrers to add:**

```
http://localhost:3001/*
http://localhost:3000/*
http://127.0.0.1:3001/*
http://127.0.0.1:3000/*
https://*.vercel.app/*
https://mdeai.co/*
https://www.mdeai.co/*
```

Never use this key from server/ADK — referrer block will 403.

---

### Key 2 — Server Maps + Places + Grounding (secret, never `NEXT_PUBLIC_*`)

| | |
|---|---|
| **Name** | `mdeai-server-maps` |
| **Env vars** (same key value OK) | `GOOGLE_MAPS_API_KEY`, `GOOGLE_MAPS_SERVER_API_KEY`, `GOOGLE_PLACES_API_KEY` |
| **API restriction** | Places API (New) + Maps Grounding Lite (+ Geocoding if you want verify probe) |
| **Application restriction** | **None** for localhost dev; IP restriction optional on prod VPS |

Used by:

- ADK sidecar `:8000` → `mapstools.googleapis.com/mcp`
- Mastra/server Places calls with `X-Goog-FieldMask`

---

### Key 3 — Gemini (secret, server-only)

| | |
|---|---|
| **Name** | `mdeai-gemini` |
| **Env vars** (same value) | `GOOGLE_GENERATIVE_AI_API_KEY`, `GOOGLE_API_KEY` |
| **API restriction** | Generative Language API only |
| **Application restriction** | None (local + Vercel serverless) |

Model in code: `gemini-3.5-flash` via `@ai-sdk/google`.

**Do not use** `GEMINI_API_KEY` in new mdeapp code — legacy edge fn name only.

---

## Step 4 — Paste into env files

**`mdeapp/.env.local`** (and repo root `.env.local` copy):

```bash
# Browser — Key 1 + Map ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=abc123...

# Server — Key 2 (one key can fill all three)
GOOGLE_MAPS_API_KEY=AIza...
GOOGLE_MAPS_SERVER_API_KEY=AIza...   # optional override for sidecar
GOOGLE_PLACES_API_KEY=AIza...

# Gemini — Key 3
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
GOOGLE_API_KEY=AIza...               # Mastra Studio alias — same as above

ADK_GROUNDING_URL=http://localhost:8000
```

**Never set:** `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` (MAP-013 — server key must not leak to browser).

---

## Step 5 — Verify

```bash
cd /home/sk/mdeai/mdeapp
npm run verify:maps-env          # keys present + Places probe
curl -s http://localhost:8000/health   # ADK up
npm run verify:grounding         # source: grounding-lite
npm run verify:console:boot      # layout console clean
npm run verify:console           # full chat turn (needs Gemini billing)
npm run smoke:map-pins           # rental cards + pins
```

---

## Quick mental model

```
Browser (Camila's screen)
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  →  Maps JS + pins on map
  NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID   →  AdvancedMarker styling

Server (Mastra + ADK :8000)
  GOOGLE_GENERATIVE_AI_API_KEY     →  Gemini replies + tool routing
  GOOGLE_MAPS_API_KEY              →  Grounding Lite MCP (café search)
  GOOGLE_PLACES_API_KEY            →  Places API New (listings)
```

**Two keys, one Map ID** is the minimum. **Three keys** if you want tighter API restrictions per surface.
