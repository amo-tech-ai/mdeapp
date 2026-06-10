---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: search_places
description: "Offline Google Maps Platform doc export (search_places). Tertiary: verify against live developers.google.com and curated references/*.md."
---

## Tool: `search_places`

Call this tool when the user's request is to find places, businesses, addresses, locations, points of interest, or any other Google Maps related search.

**Input Requirements (CRITICAL):**

1. **`text_query` (string - MANDATORY):** The primary search query. This must clearly define what the user is looking for.

   - **Examples:** `'restaurants in New York'`, `'coffee shops near Golden Gate Park'`, `'SF MoMA'`, `'1600 Amphitheatre Pkwy, Mountain View, CA, USA'`, `'pets friendly parks in Manhattan, New York'`, `'date night restaurants in Chicago'`, `'accessible public libraries in Los Angeles'`.

   <!-- -->

   - **For specific place details:** Include the requested attribute (e.g., `'Google Store Mountain View opening hours'`, `'SF MoMa phone number'`, `'Shoreline Park Mountain View address'`).
2. **`location_bias` (object - OPTIONAL):** Use this to prioritize results near a specific geographic area.

   - **Format:** `{"location_bias": {"circle": {"center": {"latitude": [value], "longitude": [value]}, "radius_meters": [value (optional)]}}}`

   <!-- -->

   - **Usage:**
     - **To bias to a 5km radius:** `{"location_bias": {"circle": {"center": {"latitude": 34.052235, "longitude": -118.243683}, "radius_meters": 5000}}}`
     - **To bias strongly to the center point:** `{"location_bias": {"circle": {"center": {"latitude": 34.052235, "longitude": -118.243683}}}}` (omitting `radius_meters`).
3. **`language_code` (string - OPTIONAL):** The language to show the search results summary in.

   - **Format:** A two-letter language code (ISO 639-1), optionally followed by an underscore and a two-letter country code (ISO 3166-1 alpha-2), e.g., `en`, `ja`, `en_US`, `zh_CN`, `es_MX`. If the language code is not provided, the results will be in English.
4. **`region_code` (string - OPTIONAL):** The Unicode CLDR region code of the user. This parameter is used to display the place details, like region-specific place name, if available. The parameter canaffect results based on applicable law.

   - **Format:** A two-letter country code (ISO 3166-1 alpha-2), e.g., `US`, `CA`.

**Instructions for Tool Call:**

- Location Information (CRITICAL): The search must contain sufficient location information. If the location is ambiguous (e.g., just "pizza places"), *you must* specify it in the `text_query` (e.g., "pizza places in New York") or use the `location_bias` parameter. Include city, state/province, and region/country name if needed for disambiguation.

- Always provide the most specific and contextually rich `text_query` possible.

- Only use `location_bias` if coordinates are explicitly provided or if inferring a location from a user's known context is appropriate *and* necessary for better results.

- The grounded output must be attributed to the source using the information from the `attribution` field when available.


The following sample demonstrate how to use `curl` to invoke the `search_places` MCP tool.

| Curl Request |
|---|
| ```bash curl --location 'https://mapstools.googleapis.com/mcp' \ --header 'content-type: application/json' \ --header 'accept: application/json, text/event-stream' \ --data '{ "method": "tools/call", "params": { "name": "search_places", "arguments": { // provide these details according to the tool's MCP specification } }, "jsonrpc": "2.0", "id": 1 }' ``` |

## Input Schema

Request message for SearchText.

### SearchTextRequest

| JSON representation |
|---|
| ``` { "textQuery": string, "languageCode": string, "regionCode": string, "pageSize": integer, "pageToken": string, // Union field `_location_bias` can be only one of the following: "locationBias": { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.LocationBias`) } // End of list of possible types for union field `_location_bias`. } ``` |

| Fields ||
|---|---|
| `textQuery` | `string` Required. The text query. |
| `languageCode` | `string` Optional. The language to request that the summary is returned in. If the language code is unspecified or unrecognized, the summary with a preference for English will be returned. For example, "en" for English. Current list of supported languages: <https://developers.google.com/maps/faq#languagesupport>. |
| `regionCode` | `string` Optional. The Unicode country/region code (CLDR) of the location where the request is coming from. This parameter is used to display the place details, like region-specific place name, if available. The parameter can affect results based on applicable law. For example, "US" for United States. For more information, see <https://www.unicode.org/cldr/charts/latest/supplemental/territory_language_information.html>. Note that 3-digit region codes are not currently supported. |
| `pageSize` | `integer` Optional. The maximum number of places to return. The service may return fewer than this value. |
| `pageToken` | `string` Optional. A page token, received from a previous `SearchText` call. Provide this to retrieve the subsequent page. |
| Union field `_location_bias`. `_location_bias` can be only one of the following: ||
| `locationBias` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.LocationBias`)`` An optional region to bias the search results to. If an explicit location is in `text_query`, it will be used to bias the search results instead of this field. |

### LocationBias

| JSON representation |
|---|
| ``` { "circle": { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.Circle`) } } ``` |

| Fields ||
|---|---|
| `circle` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.Circle`)`` Optional. A circle defined by center point and radius. The `radius_meters` is optional. If not set, the results will be biased towards the center point. |

### Circle

| JSON representation |
|---|
| ``` { "center": { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.LatLng`) }, // Union field `_radius_meters` can be only one of the following: "radiusMeters": number // End of list of possible types for union field `_radius_meters`. } ``` |

| Fields ||
|---|---|
| `center` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.LatLng`)`` Required. The center point of the circle. |
| Union field `_radius_meters`. `_radius_meters` can be only one of the following: ||
| `radiusMeters` | `number` The radius of the circle in meters. The radius must be within 50,000 meters. |

### LatLng

| JSON representation |
|---|
| ``` { "latitude": number, "longitude": number } ``` |

| Fields ||
|---|---|
| `latitude` | `number` The latitude in degrees. It must be in the range \[-90.0, +90.0\]. |
| `longitude` | `number` The longitude in degrees. It must be in the range \[-180.0, +180.0\]. |

## Output Schema

Response message for SearchText.

### SearchTextResponse

| JSON representation |
|---|
| ``` { "places": [ { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Output.Schema.PlaceView`) } ], "summary": string, "nextPageToken": string } ``` |

| Fields ||
|---|---|
| `places[]` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Output.Schema.PlaceView`)`` Output only. The list of places that are mentioned in the summary. |
| `summary` | `string` Output only. A natural language summary of the search results. The summary may contain zero-based citations like "\[0\]", "\[1\]", "\[2\]" etc. These citations map to the corresponding places in the `places` field. |
| `nextPageToken` | `string` Optional. A token that can be sent as `page_token` to retrieve the next page. |

### PlaceView

| JSON representation |
|---|
| ``` { "place": string, "id": string, "googleMapsLinks": { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Output.Schema.GoogleMapsLinks`) }, "attribution": { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Output.Schema.Attribution`) }, // Union field `_location` can be only one of the following: "location": { object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.LatLng`) } // End of list of possible types for union field `_location`. } ``` |

| Fields ||
|---|---|
| `place` | `string` The resource name of the underlying place, in the format of "places/{id}". |
| `id` | `string` The place ID of the underlying place. |
| `googleMapsLinks` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Output.Schema.GoogleMapsLinks`)`` Links to trigger different Google Maps actions. |
| `attribution` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Output.Schema.Attribution`)`` Required attribution to show with the place. |
| Union field `_location`. `_location` can be only one of the following: ||
| `location` | ``object (`https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places#Input.Schema.LatLng`)`` The position of this place. |

### LatLng

| JSON representation |
|---|
| ``` { "latitude": number, "longitude": number } ``` |

| Fields ||
|---|---|
| `latitude` | `number` The latitude in degrees. It must be in the range \[-90.0, +90.0\]. |
| `longitude` | `number` The longitude in degrees. It must be in the range \[-180.0, +180.0\]. |

### GoogleMapsLinks

| JSON representation |
|---|
| ``` { "directionsUrl": string, "placeUrl": string, "writeAReviewUrl": string, "reviewsUrl": string, "photosUrl": string } ``` |

| Fields ||
|---|---|
| `directionsUrl` | `string` A link to show the directions to the place. The link only populates the destination location and uses the default travel mode `DRIVE`. |
| `placeUrl` | `string` A link to show this place. |
| `writeAReviewUrl` | `string` A link to write a review for this place on Google Maps. |
| `reviewsUrl` | `string` A link to show reviews of this place on Google Maps. |
| `photosUrl` | `string` A link to show photos of this place on Google Maps. |

### Attribution

| JSON representation |
|---|
| ``` { "title": string, "url": string } ``` |

| Fields ||
|---|---|
| `title` | `string` The title to display for the attribution. |
| `url` | `string` The URL to link to for the attribution. |

### Tool Annotations

Destructive Hint: ❌ \| Idempotent Hint: ❌ \| Read Only Hint: ✅ \| Open World Hint: ❌