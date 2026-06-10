---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-ui-kit-layers
description: "Maps JavaScript — Places UI Kit layers. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/android-sdk/utility/multilayer "View this page for the Android platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/layers "View this page for the JavaScript platform docs.")

Layers are objects on the map that consist of one or more separate items,
but are manipulated as a single unit. Layers generally reflect collections of
objects that you add on top of the map to designate a common association. The
Maps JavaScript API manages the presentation of objects within layers
by rendering their constituent items into one object (typically a tile overlay) and
displaying them as the map's viewport changes. Layers may also alter the presentation
layer of the map itself, slightly altering the base tiles in a fashion
consistent with the layer. Note that most layers, by design, may not be
accessed using their individual objects, but may only be manipulated as a
unit.

## Layers Overview

The Maps JavaScript API has several types of layers:

- The [**Google Maps Data
  layer**](https://developers.google.com/maps/documentation/javascript/datalayer) provides a container for arbitrary geospatial data. You can use the Data layer to store your custom data, or to display GeoJSON data on a Google map.
- The [**KML layer**](https://developers.google.com/maps/documentation/javascript/kmllayer) renders KML and GeoRSS elements into a Maps JavaScript API tile overlay.
- The [**Traffic layer**](https://developers.google.com/maps/documentation/javascript/trafficlayer#traffic_layer) displays traffic conditions on the map.
- The [**Transit layer**](https://developers.google.com/maps/documentation/javascript/trafficlayer#transit_layer) displays the public transport network of your city on the map.
- The [**Bicycling layer**](https://developers.google.com/maps/documentation/javascript/trafficlayer#bicycling_layer) object renders a layer of bike paths and/or bicycle-specific overlays into a common layer. This layer is returned by default within the **DirectionsRenderer** when requesting directions of travel mode **BICYCLING**.

## Add a layer

To add a layer to a map, you only need to call `setMap()`,
passing it the map object on which to display the layer. Similarly, to hide a
layer, call `setMap()`, passing `null`.

The below snippet centers the map on London, UK, and adds the [Transit
layer](https://developers.google.com/maps/documentation/javascript/trafficlayer#transit_layer).

```javascript
var mapOptions = {
  zoom: 13,
  center: new google.maps.LatLng(51.5,-0.11)
}

var map = new google.maps.Map(document.getElementById("map"), mapOptions);

var transitLayer = new google.maps.TransitLayer();
transitLayer.setMap(map);
```