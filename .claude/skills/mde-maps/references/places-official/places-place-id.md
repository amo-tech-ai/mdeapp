---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: place-id
description: "Places API (New) — place IDs. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---
 
## Introduction

Place IDs uniquely identify a place in the Google Places database and on Google Maps. Place IDs
are accepted in requests to the following Maps APIs:

- Retrieving an address for a Place ID in the Geocoding API and Geocoding Service, Maps JavaScript API.
- Specifying origin, destination and intermediate waypoints in the Routes API and Directions API (Legacy) and Directions Service, Maps JavaScript API (Legacy).
- Specifying origins and destinations in the Routes API and Distance Matrix API (Legacy) and Distance Matrix Service, Maps JavaScript API (Legacy).
- Retrieving Place Details in Places API (New), Places SDK for Android (New), Places SDK for iOS (New), and Places Library.
- Using Place ID parameters in Maps Embed API.
- Retrieving search queries in Maps URLs.
- Displaying speed limits in Roads API.
- Finding and styling boundary polygons in data-driven styling for boundaries.

## Find the ID of a particular place

Are you looking for the place ID of a specific place? Use the place ID
finder below to search for a place and get its ID:
<iframe src="https://geo-devrel-javascript-samples.web.app/samples/places-placeid-finder/app/dist/" allow="fullscreen; "></iframe>

Alternatively, you can
[view
the place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) with its code in the Maps JavaScript API
documentation.

## Overview

A place ID is a textual identifier that uniquely identifies a place. The
length of the identifier may vary (there is no maximum length for place IDs).
Examples:

- `
  ChIJgUbEo8cfqokR5lP9_Wh_DaM
  `
- `
  GhIJQWDl0CIeQUARxks3icF8U8A
  `
- `
  EicxMyBNYXJrZXQgU3QsIFdpbG1pbmd0b24sIE5DIDI4NDAxLCBVU0EiGhIYChQKEgnRTo6ixx-qiRHo_bbmkCm7ZRAN
  `
- `
  EicxMyBNYXJrZXQgU3QsIFdpbG1pbmd0b24sIE5DIDI4NDAxLCBVU0E
  `
- `
  IhoSGAoUChIJ0U6OoscfqokR6P225pApu2UQDQ
  `

Place IDs are available for most locations, including businesses, landmarks,
parks, and intersections. It is possible for the same place or location to
have multiple different place IDs. Place IDs may change over time.

You can use the same place ID across the Places API and a
number of Google Maps Platform APIs. For example, you can use the same place ID to
reference a place in the
[Places API](https://developers.google.com/maps/documentation/places), the
[Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/places),
the [Geocoding API](https://developers.google.com/maps/documentation/geocoding),
the [Maps Embed API](https://developers.google.com/maps/documentation/embed)
and the [Roads API](https://developers.google.com/maps/documentation/roads/speed-limits).

## Retrieve place details using the place ID

A common way of using place IDs is to search for a place
(using the [Places API](https://developers.google.com/maps/documentation/places/web-service)
or the [Places
library](https://developers.google.com/maps/documentation/javascript/places#place_searches) in the Maps JavaScript API, for example) then use the
returned place ID to retrieve place details. You can store the place ID and
use it to retrieve the same place details later. Read about
[saving place IDs](https://developers.google.com/maps/documentation/javascript/place-id#save-id) below.

### Example using the Places Library in the Maps JavaScript API

To use a place ID in your JavaScript app, you must first find the ID,
which is available in the `PlaceResult` returned by a
[Place
Search](https://developers.google.com/maps/documentation/javascript/places#place_search_responses), or by `getPlace()` in the
[Place Autocomplete (Legacy)](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get_place_information)
service. Then you can use the place ID to look up
[place
details](https://developers.google.com/maps/documentation/javascript/places#place_details_requests).

```javascript
var map;

function initialize() {
  // Create a map centered in Pyrmont, Sydney (Australia).
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8666, lng: 151.1958},
    zoom: 15
  });

  // Search for Google's office in Australia.
  var request = {
    location: map.getCenter(),
    radius: '500',
    query: 'Google Sydney'
  };

  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

// Checks that the PlacesServiceStatus is OK, and adds a marker
// using the place ID and location from the PlacesService.
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: results[0].place_id,
        location: results[0].geometry.location
      }
    });
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
```

## Save place IDs for later use

Place IDs are **exempt from** the caching restrictions stated in
[Section 3.2.3(b)](https://cloud.google.com/maps-platform/terms#3.-license.)
of the Google Maps Platform Terms of Service. You can therefore store place ID values for later
use.

### Refresh stored place IDs

Because Place IDs may change due to updates on the Google Maps database, Google recommends
refreshing place IDs if they are more than 12 months old. You can refresh Place IDs **at no
charge** by making a


[Place Details request](https://developers.google.com/maps/documentation/javascript/places#place_details_requests),
specifying only the `place_id`


field in the `fields` parameter.

This call triggers the


[Places Details - ID Refresh](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-id-refresh-ess-sku)


SKU.

## Error codes when using place IDs

### `INVALID_REQUEST`

The `INVALID_REQUEST` status code indicates that the specified
place ID is not valid. `INVALID_REQUEST` may be returned when the
place ID has been truncated or otherwise modified, and is no longer correct.

### `NOT_FOUND`

The `NOT_FOUND` status code indicates that the specified place ID
is obsolete. A place ID may become obsolete if a business closes or moves to
a new location. Place IDs may also change due to updates on the Google
Maps database. In such cases, a place may receive a new place ID, and the old
ID returns a `NOT_FOUND` response.

> [!NOTE]
> **Note:** Place IDs that are obsolete may continue to be returned in Place Autocomplete (Legacy), Query Autocomplete (Legacy), or Autocomplete (New) responses for a few days after the place ID has been removed from the Google Maps database.

To refresh results in the event of an obsolete place ID, store the original request that
returned each place ID and re-issue the request as needed. Note that the **re-issued request is
billed at the appropriate SKU.**

Some types of place IDs may sometimes cause a
`NOT_FOUND` response, or the API may return a different place ID in
the response. These place ID types include:

- Street addresses that don't exist in Google Maps as precise addresses, but are inferred from a range of addresses.
- Segments of a long route, where the request also specifies a city or locality.
- Intersections.
- Places with an address component of type `subpremise`.

These IDs often take the form of a long string (there is no maximum length
for Place IDs). For example:

```
EpID4LC14LC_4LCo4LCv4LGN4LCo4LCX4LCw4LGNIC0g4LC44LGI4LCm4LGN4LCs4LC-4LCm4LGNIOCwsOCxi-CwoeCxjeCwoeCxgSAmIOCwteCwv-CwqOCwr-CxjSDgsKjgsJfgsLDgsY0g4LCu4LGG4LCv4LC_4LCo4LGNIOCwsOCxi-CwoeCxjeCwoeCxgSwg4LC14LC_4LCo4LCv4LGNIOCwqOCwl-CwsOCxjSDgsJXgsL7gsLLgsKjgsYAsIOCwsuCwleCxjeCwt-CxjeCwruCwv-CwqOCwl-CwsOCxjSDgsJXgsL7gsLLgsKjgsYAsIOCwuOCwsOCxguCwsOCxjSDgsKjgsJfgsLDgsY0g4LC14LGG4LC44LGN4LCf4LGNLCDgsLjgsK_gsYDgsKbgsL7gsKzgsL7gsKbgsY0sIOCwueCxiOCwpuCwsOCwvuCwrOCwvuCwpuCxjSwg4LCk4LGG4LCy4LCC4LCX4LC-4LCjIDUwMDA1OSwg4LCt4LC-4LCw4LCk4LCm4LGH4LC24LCCImYiZAoUChIJ31l5uGWYyzsR9zY2qk9lDiASFAoSCd9ZebhlmMs7Efc2NqpPZQ4gGhQKEglDz61OZpjLOxHgDJCFY-o1qBoUChIJi37TW2-YyzsRr_uv50r7tdEiCg1MwFcKFS_dyy4
```