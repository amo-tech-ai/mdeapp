---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: marker-clustering-js
title: Maps JavaScript API — Marker clustering
description: "@googlemaps/markerclusterer with AdvancedMarkerElement patterns. Tertiary: verify against live developers.google.com."
---

 
## Overview

This tutorial shows you how to use marker clusters to display a large number of markers on a map.
You can use the
[@googlemaps/markerclusterer](https://github.com/googlemaps/js-markerclusterer)
library in combination with the Maps JavaScript API to combine
markers of close proximity into clusters, and simplify the display of markers
on the map.

To see how marker clustering works, view the map below.


<iframe src="https://geo-devrel-javascript-samples.web.app/samples/marker-clustering/app/dist/" allow="fullscreen; "></iframe>


The number on a cluster indicates how many markers it contains. Notice that as you zoom into any
of the cluster locations, the number on the cluster decreases, and you begin to see the individual
markers on the map. Zooming out of the map consolidates the markers into clusters again.

The sample below shows the entire code you need to create this map.

### TypeScript

```typescript
import { MarkerClusterer } from "@googlemaps/markerclusterer";

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 3,
      center: { lat: -28.024, lng: 140.887 },
      mapId: 'DEMO_MAP_ID',
    }
  );

  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Add some markers to the map.
  const markers = locations.map((position, i) => {
    const label = labels[i % labels.length];
    const pinGlyph = new google.maps.marker.PinElement({
      glyph: label,
      glyphColor: "white",
    })
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener("click", () => {
      infoWindow.setContent(position.lat + ", " + position.lng);
      infoWindow.open(map, marker);
    });
    return marker;
  });

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({ markers, map });
}

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
];

initMap();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
import { MarkerClusterer } from "@googlemaps/markerclusterer";

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center: { lat: -28.024, lng: 140.887 },
    mapId: "DEMO_MAP_ID",
  });
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Add some markers to the map.
  const markers = locations.map((position, i) => {
    const label = labels[i % labels.length];
    const pinGlyph = new google.maps.marker.PinElement({
      glyph: label,
      glyphColor: "white",
    });
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener("click", () => {
      infoWindow.setContent(position.lat + ", " + position.lng);
      infoWindow.open(map, marker);
    });
    return marker;
  });

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({ markers, map });
}

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
];

initMap();
```

> [!NOTE]
> **Note:** The JavaScript is compiled from the TypeScript snippet.

### CSS

```css
/* 
 * Always set the map height explicitly to define the size of the div element
 * that contains the map. 
 */
#map {
  height: 100%;
}

/* 
 * Optional: Makes the sample page fill the window. 
 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
```

### HTML

```html
<html>
  <head>
    <title>Marker Clustering</title>

    <link rel="stylesheet" type="text/css" href="./style.css" />
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <div id="map"></div>

    <!-- prettier-ignore -->
    <script>(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", v: "weekly"});</script>
  </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps/js-samples/tree/master/dist/samples/marker-clustering/jsfiddle) [Google Cloud Shell](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/googlemaps/js-samples&cloudshell_git_branch=sample-marker-clustering&cloudshell_tutorial=cloud_shell_instructions.md&cloudshell_workspace=.)

As a simple illustration, this tutorial adds a set of markers to the map using the
`locations` array. You can use other sources to get markers for your map.
For more information, read the guide to
[creating markers](https://developers.google.com/maps/documentation/javascript/markers).

## Add a marker clusterer

Follow the steps below to add a marker clusterer:

1. Add the marker clustering library to your page or application. The library is available on NPM at [@googlemaps/markerclusterer](https://www.npmjs.com/package/@googlemaps/markerclusterer) and in the [repository on GitHub](https://github.com/googlemaps/js-markerclusterer).

   ### NPM

   Install the latest version of the [@googlemaps/markerclusterer](https://www.npmjs.com/package/@googlemaps/markerclusterer) library using NPM.

   ```javascript
   npm install @googlemaps/markerclusterer
   ```

   ### CDN

   The script below loads the latest 1.x.x version of the library from the [unpkg.com CDN](https://unpkg.com/).

   ```html
   <script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
   ```
2. Add a marker clusterer in your app.   

   The code below adds a marker clusterer to the map.

   ### NPM

   ```javascript
   import { MarkerClusterer } from "@googlemaps/markerclusterer";

   const markerCluster = new MarkerClusterer({ markers, map });
   ```

   ### CDN

   When accessed with the CDN, the library is available under the `markerClusterer` global.

   ```javascript
   const markerCluster = new markerClusterer.MarkerClusterer({ markers, map });
   ```

   This sample passes the `markers` array to the `MarkerClusterer`.
3. Customize the marker clusterer.
   - [Customize the cluster icon](https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html#renderer) through the renderer interface.
   - [Modify the algorithm](https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html#algorithm) for generating clusters.

## Learn more

You can view more complex examples of marker clustering in the
[repository on GitHub](https://github.com/googlemaps/js-markerclusterer) and read the
[reference documentation](https://googlemaps.github.io/js-markerclusterer/) for the library.