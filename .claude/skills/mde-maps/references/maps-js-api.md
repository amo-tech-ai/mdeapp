---
title: Maps JavaScript API — mdeAI ChatMap.tsx reference
---

# Maps JavaScript API — mdeAI ChatMap.tsx reference

Official docs: https://developers.google.com/maps/documentation/javascript/overview
AdvancedMarkerElement: https://developers.google.com/maps/documentation/javascript/advanced-markers/overview

## Table of contents

- [Overview](#overview)
- [Environment variable](#environment-variable)
- [Loader pattern](#loader-pattern)
- [Map initialization](#map-initialization)
- [AdvancedMarkerElement — pin rendering](#advancedmarkerelement--pin-rendering)
- [MapContext.pins type](#mapcontextpins-type)
- [Per-category pin merge (MASTRA-047 fix)](#per-category-pin-merge-mastra-047-fix)
- [Smoke spec requirements (MASTRA-045)](#smoke-spec-requirements-mastra-045)
- ["Open in Google Maps" deep link](#open-in-google-maps-deep-link)
- [ChatMap.tsx full lifecycle](#chatmaptsx-full-lifecycle)
- [Key files in mdeai](#key-files-in-mdeai)
- [Common gotchas](#common-gotchas)
- [React-first alternative: `@vis.gl/react-google-maps`](#react-first-alternative-visglreact-google-maps)
- [Dense pins: `collisionBehavior`](#dense-pins-collisionbehavior)

---

## Overview

The Maps JS API powers `src/components/chat/ChatMap.tsx` — the interactive pin map in the chat's right panel. It is the **frontend-only** Maps product in mdeAI. All server-side Maps work (enrichment, grounding) uses different APIs and keys.

---

## Environment variable

```
VITE_GOOGLE_MAPS_API_KEY   — Browser-visible key, loaded by @googlemaps/js-api-loader
```

**GCP restrictions required on this key:**
- Application restriction: **HTTP referrers** only
  - `https://www.mdeai.co/*`
  - `http://localhost:8080/*`
- API restriction: **Maps JavaScript API only**

**Never enable Places API (New) or Places API on the frontend key.** Frontend keys are visible in browser DevTools. Place lookups must use server-side keys.

---

## Loader pattern

```typescript
// src/components/chat/ChatMap.tsx
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['marker'], // required for AdvancedMarkerElement
});

// Load once per component mount
const { Map } = await loader.importLibrary('maps');
const { AdvancedMarkerElement } = await loader.importLibrary('marker');
```

---

## Map initialization

```typescript
const mapInstance = new Map(containerRef.current!, {
  center: { lat: 6.2442, lng: -75.5812 }, // Medellín anchor
  zoom: 13,
  mapId: 'DEMO_MAP_ID', // required for AdvancedMarkerElement
  disableDefaultUI: false,
  gestureHandling: 'greedy',
});
```

**`mapId` is required** for `AdvancedMarkerElement`. Use `'DEMO_MAP_ID'` locally; set a real Map ID in GCP Console for production (Appearance → Map Styles → Create Map ID).

---

## AdvancedMarkerElement — pin rendering

Each pin from `MapContext.pins` renders as an `AdvancedMarkerElement`. The content element **must have `data-testid="map-pin"`** — the MASTRA-045 smoke spec asserts pin count via this selector.

```typescript
// Pin content element — required data-testid for smoke spec
function createPinContent(pin: MapPin): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-testid', 'map-pin');
  el.setAttribute('data-category', pin.category);
  el.className = 'map-pin-marker';
  el.innerHTML = `
    <div class="pin-icon pin-${pin.category}">
      ${CATEGORY_ICONS[pin.category] ?? '📍'}
    </div>
  `;
  return el;
}

// Add a marker for each pin
function renderPins(map: google.maps.Map, pins: MapPin[]) {
  // Clear old markers before re-rendering
  activeMarkers.forEach(m => (m.map = null));
  activeMarkers.length = 0;

  for (const pin of pins) {
    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: pin.latitude, lng: pin.longitude },
      title: pin.title,
      content: createPinContent(pin),
    });
    activeMarkers.push(marker);
  }
}
```

---

## MapContext.pins type

```typescript
// src/types/chat.ts
export type PinCategory = 'event' | 'restaurant' | 'attraction' | 'rental';

export interface MapPin {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: PinCategory;
  mapsUrl?: string;   // from DB maps_url — used for "Get Directions" deep link
}
```

---

## Per-category pin merge (MASTRA-047 fix)

The Mastra tool emits pins per tool call. A chat turn can call multiple tools (e.g. "events and restaurants this weekend"). Use per-category merge so earlier categories survive later tool calls.

```typescript
// In ChatCanvas.tsx / Concierge.tsx — tool-output-available handler
setPins(prev => [
  ...prev.filter(p => p.category !== incomingCategory),
  ...newPins,
]);
// NOT: setPins(newPins) — that replaces all pins including other categories
```

---

## Smoke spec requirements (MASTRA-045)

The Playwright smoke spec asserts:
- `page.locator('[data-testid="map-pin"]').count()` must be > 0 after a known-event query
- Pin count must match the number of cards returned

To satisfy this:
1. Every `AdvancedMarkerElement` content element must have `data-testid="map-pin"`
2. Pins must be added synchronously within the `tool-output-available` SSE event handler (not deferred)
3. The map container must be visible before pins are asserted (`data-testid="chat-map"` or similar)

---

## "Open in Google Maps" deep link

When a venue card has `mapsUrl` (populated by Places API enrichment), link directly using `place_id`-based canonical URL:

```tsx
// Use maps_url from DB — never construct from lat/lng manually
{listing.mapsUrl && (
  <a
    href={listing.mapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-emerald-700 underline"
  >
    Open in Google Maps
  </a>
)}
```

The `mapsUrl` stored in the DB is `googleMapsLinks.placeUri` from the Places API enrichment — a stable canonical URL like `https://maps.app.goo.gl/...`. This is more stable than constructing `https://www.google.com/maps/search/?api=1&query_place_id=${placeId}`.

---

## ChatMap.tsx full lifecycle

```
1. Component mounts → Loader.importLibrary('maps', 'marker')
2. new Map() with Medellín anchor center
3. Subscribe to MapContext.pins changes
4. On pins change → renderPins() → AdvancedMarkerElement per pin
5. On chat turn with tool output → setPins (per-category merge) triggers re-render
6. Component unmounts → markers cleared (marker.map = null)
```

---

## Key files in mdeai

| File | Purpose |
|------|---------|
| `src/components/chat/ChatMap.tsx` | Map component, AdvancedMarkerElement rendering |
| `src/context/MapContext.tsx` | `pins` state + `setPins` shared across chat panels |
| `src/types/chat.ts` | `MapPin`, `PinCategory` types |
| `src/hooks/useChat.ts` | `tool-output-available` SSE handler → calls `setPins` |

---

## Common gotchas

| Gotcha | Fix |
|--------|-----|
| `AdvancedMarkerElement is not defined` | Add `'marker'` to `libraries` in Loader config |
| Pins render at (0, 0) | `latitude`/`longitude` from DB might be null — enrich first (PLACES-005-010) |
| Map ID error in console | Set `mapId` in Map constructor — required for AdvancedMarkerElement |
| Old pins not clearing | Call `marker.map = null` on each old marker before creating new ones |
| `data-testid="map-pin"` missing | Smoke spec fails — add attribute to `createPinContent()` content element |
| Frontend key 403 error | Check HTTP referrer restriction includes the current origin |

---

## React-first alternative: `@vis.gl/react-google-maps`

**Deep reference pack** (components, hooks, geometry overlays, autocomplete, patterns): [`react-vis-gl/README.md`](react-vis-gl/README.md) — consolidates the former `react-google-maps` symlink skill.

The official Google codelab ([`codelab-maps-platform-101-react-js`](https://github.com/googlemaps-samples/codelab-maps-platform-101-react-js)) uses `@vis.gl/react-google-maps` instead of raw `@googlemaps/js-api-loader`. This is the **React-native** approach — components instead of imperative API.

```typescript
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

// Top-level provider — wraps the map component
const App = () => (
  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
    <Map
      defaultZoom={13}
      defaultCenter={{ lat: 6.2442, lng: -75.5812 }} // Medellín anchor
      mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
    >
      <PinMarkers pins={pins} />
    </Map>
  </APIProvider>
);

// Marker component — `ref` is needed for MarkerClusterer integration
const PinMarkers = ({ pins }: { pins: MapPin[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize clusterer once map is ready
  useEffect(() => {
    if (!map || clusterer.current) return;
    clusterer.current = new MarkerClusterer({ map });
  }, [map]);

  // Sync clusterer when markers state changes
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    setMarkers(prev => {
      if (marker) return { ...prev, [key]: marker };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <>
      {pins.map(pin => (
        <AdvancedMarker
          key={pin.id}
          position={{ lat: pin.latitude, lng: pin.longitude }}
          ref={marker => setMarkerRef(marker, pin.id)}
          clickable
        >
          <Pin
            background={CATEGORY_COLORS[pin.category]}
            glyphColor="#000"
            borderColor="#000"
          />
        </AdvancedMarker>
      ))}
    </>
  );
};
```

**When to use `@vis.gl/react-google-maps` vs raw Loader:**
- `@vis.gl/react-google-maps` — new components; fewer imperative lifecycle concerns; MarkerClusterer via `ref`
- Raw `@googlemaps/js-api-loader` — existing `ChatMap.tsx` already uses this; fine to keep if it works

---

## Dense pins: `collisionBehavior`

When many pins overlap (e.g., El Poblado has 50 restaurants), set collision behavior to prevent visual clutter. From `js-api-samples/advanced-markers-collision`:

```typescript
const marker = new AdvancedMarkerElement({
  map,
  position: { lat: pin.latitude, lng: pin.longitude },
  content: createPinContent(pin),
  collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
});
```

| Behavior | Effect |
|----------|--------|
| `REQUIRED` | Always shown even if overlapping |
| `OPTIONAL_AND_HIDES_LOWER_PRIORITY` | Hidden if overlapping a REQUIRED marker |
| `REQUIRED_AND_HIDES_OPTIONAL` | Shown + hides OPTIONAL markers beneath |

For mdeAI: use `REQUIRED` for grounded (live) results, `OPTIONAL_AND_HIDES_LOWER_PRIORITY` for cached DB results.

---

## Reference implementations

| Repo (local clone) | What it shows |
|---|---|
| `github/codelab-maps-platform-101-react-js/solution/` | Full `@vis.gl/react-google-maps` + MarkerClusterer + Circle overlay |
| `github/js-api-samples/samples/advanced-markers-collision/` | `collisionBehavior` demo |
| `github/js-api-samples/samples/advanced-markers-simple/` | Minimal AdvancedMarkerElement setup |
| `github/js-markerclusterer/` | MarkerClusterer source — renderer customization, cluster icon styling |
| `github/react-wrapper/` | Official Google React wrapper for Maps JS API |
| `github/google-maps-services-js/` | Node.js server-side Maps client (geocoding, directions, places) — for edge functions |
| `github/grounding-lite-mcp-sample-app/` | MCP tool calling, grounding, routes — backend patterns |
| `github/platform-ai/` | Maps AI Code Assist MCP server source |
