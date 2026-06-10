---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: legacy-marker-to-advanced-marker
title: Maps JavaScript API — Migrate legacy Marker to AdvancedMarkerElement
description: "Deprecation of google.maps.Marker and migration steps (map ID, marker library). Tertiary: verify against live developers.google.com."
---

As of February 21st, 2024 (v3.56), google.maps.Marker is deprecated. We
encourage you to transition to the new `google.maps.marker.AdvancedMarkerElement`
class. Advanced markers provide substantial improvements over the legacy
`google.maps.Marker` class.
[Learn more about this deprecation](https://developers.google.com/maps/deprecations#googlemapsmarker_in_the_deprecated_as_of_february_2023)

To update a legacy marker to be an advanced marker, take the following steps:

1. Add code to import the marker library (see steps below).
2. Change `google.maps.Marker` to `google.maps.marker.AdvancedMarkerElement`; if your import statement declares `AdvancedMarker`, you can omit the qualified path.
3. Add a map ID to your map initialization code. For example `mapId: 'DEMO_MAP_ID'` for testing purposes if you don't have a map ID already.

## Add the Advanced Marker library

The method you use for loading libraries depends on how your web page loads the
Maps JavaScript API.

- If your web page uses [dynamic library import](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import),
  add the markers library and
  import `AdvancedMarkerElement` (and optionally `PinElement`) at runtime, as
  shown here.

  ```javascript
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  ```
- If your web page uses the [legacy direct script loading tag](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#use-legacy-tag),
  add `libraries=marker` to the loading script, as shown in the following snippet.

  ```html
  <script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&v=weekly&libraries=marker"
  defer
  ></script>
  ```

> [!NOTE]
> **Note:** When the legacy script loading tag is used libraries are imported at initialization time; therefore there is no need to call `importLibrary()`.

[Learn more about loading the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api)

## Examples

The following code examples show code for adding a legacy marker, followed by
the code for the same example using advanced markers:

### Before migration

    // The location of Uluru
    const position = { lat: -25.344, lng: 131.031 };

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: position,
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      map: map,
      position: position,
      title: 'Uluru',
    });

### After migration

    // Import the needed libraries.
    // Not required if the legacy direct script loading tag is in use.
    await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
    await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

    // The location of Uluru
    const position = { lat: -25.344, lng: 131.031 };

    const map = new google.maps.Map(document.getElementById("map"),  {
      zoom: 4,
      center: position,
      mapId: "DEMO_MAP_ID", // Map ID is required for advanced markers.
    });

    // The advanced marker, positioned at Uluru
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: position,
        title: 'Uluru/Ayers Rock',
    });

## Explore advanced marker features

Advanced markers can be customized in ways that were not possible before.
Now you can adjust the size (scale) of markers, and change the colors of the
background, border, and glyph. Custom graphic images are simpler to work with,
and it is now possible to compose custom markers using HTML and CSS. Learn more
about everything you can do with advanced markers:

- [Add a marker to a map](https://developers.google.com/maps/documentation/javascript/advanced-markers/add-marker).
- [Basic marker customization](https://developers.google.com/maps/documentation/javascript/advanced-markers/basic-customization)
- [Create markers with graphics](https://developers.google.com/maps/documentation/javascript/advanced-markers/graphic-markers)
- [Create markers with HTML and CSS](https://developers.google.com/maps/documentation/javascript/advanced-markers/html-markers)
- [Control collision behavior, altitude, and visibility](https://developers.google.com/maps/documentation/javascript/advanced-markers/collision-behavior)
- [Make markers clickable and accessible](https://developers.google.com/maps/documentation/javascript/advanced-markers/accessible-markers)