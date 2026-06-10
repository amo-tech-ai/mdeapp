Select platform: [Android](https://developers.google.com/maps/documentation/android-sdk/advanced-markers/add-marker "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/ios-sdk/advanced-markers/add-marker "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/advanced-markers/add-marker "View this page for the JavaScript platform docs.")

<br />


<iframe src="https://maps-docs-team.web.app/samples/advanced-markers-simple/dist/" allow="fullscreen; fullscreen"></iframe>

Use markers to display single locations on a map. This page shows how to add a
marker to a map programmatically, and by using custom HTML elements.

- [Add a marker using custom HTML elements](https://developers.google.com/maps/documentation/javascript/advanced-markers/add-marker#web-components)
- [Add a marker programmatically](https://developers.google.com/maps/documentation/javascript/advanced-markers/add-marker#javascript)

## Load the advanced marker library

In order to add an advanced marker to a map, your map code must load the
`marker` library, which provides the `AdvancedMarkerElement` and `PinElement`
classes. This applies whether your app loads markers programmatically
or by using HTML. To do this, your app must first
[load the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api).

The method you use for loading libraries depends on how your web page loads the
Maps JavaScript API.

- If your web page uses dynamic script loading, add the markers library and
  import `AdvancedMarkerElement` (and optionally `PinElement`) at runtime, as
  shown here.

  ```javascript
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  ```
- If your web page uses the direct script loading tag, add `libraries=marker` to
  the loading script, as shown in the following snippet. Doing this will cause
  both `AdvancedMarkerElement` and `PinElement` to be imported.

  ```html
  <script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&v=weekly&libraries=marker"
  defer
  ></script>
  ```

## Set a map ID

A map ID is required to use Advanced Markers (the `DEMO_MAP_ID` can be used).
Set a map ID in map options, as shown here:

```javascript
const map = new Map(document.getElementById('map') as HTMLElement, {
    center: { lat: 37.4239163, lng: -122.0947209 },
    zoom: 14,
    mapId: 'DEMO_MAP_ID',
});
```

If you're using web components, you can set the map ID directly on the `gmp-map`
element:

```html
<gmp-map center="37.4239163,-122.0947209" zoom="14" map-id="DEMO_MAP_ID"></gmp-map>
```

[Learn more](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over) about map IDs.

## Add a marker using custom HTML elements

> [!NOTE]
> **Note:** Some frameworks like React will automatically add and remove DOM nodes during rendering, and may be incompatible with adding and removing markers' corresponding DOM nodes independently (e.g. when using Maps JavaScript API constructors and properties). In such frameworks if you intend to use other marker-managing code or libraries, you may need to add and remove markers solely using JavaScript syntax (e.g. `new AdvancedMarker({map})`).

To add an advanced marker by using custom HTML elements, add a
`gmp-advanced-marker` child element to the `gmp-map` element. The following
snippet shows adding markers to a web page:


```html
<gmp-map
    center="41.027748173921374, -92.41852445367961"
    zoom="13"
    map-id="DEMO_MAP_ID">
    <gmp-advanced-marker
        position="41.027748173921374, -92.41852445367961"
        title="Ottumwa, IA"></gmp-advanced-marker>
</gmp-map>
```

<br />

#### See the complete example source code

This example shows creating a map with markers using HTML.

### TypeScript

```typescript
// This example adds a map with markers, using web components.
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// This example adds a map with markers, using web components.
```

### CSS

```css
/* Note: This CSS file is intentionally blank. */
```

### HTML

```html
<html>
    <head>
        <title>Add a Map with Markers using HTML</title>
        <style>
            gmp-map {
                height: 100%;
            }
            html,
            body {
                height: 100%;
                margin: 0;
                padding: 0;
            }
        </style>
        <script type="module" src="./index.js"></script>
        <script
            async
            src="https://maps.googleapis.com/maps/api/js?loading=async&key=AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8&libraries=maps,marker"></script>
    </head>
    <body>
        <gmp-map
            center="41.027748173921374, -92.41852445367961"
            zoom="13"
            map-id="DEMO_MAP_ID">
            <gmp-advanced-marker
                position="41.027748173921374, -92.41852445367961"
                title="Ottumwa, IA"></gmp-advanced-marker>
        </gmp-map>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/web-components-markers/jsfiddle)

## Add a marker programmatically

To add an advanced marker to a map programmatically, create a new
`AdvancedMarkerElement` and append it to the map as shown in this example:


### TypeScript

```typescript
const mapElement = document.querySelector('gmp-map')!;

async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const mapElement = document.querySelector('gmp-map');

async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}
```

<br />

Appending elements is only possible when using web components. If the `div`
element is used to load the map, use the `map` property to associate the marker
with the map instance as shown here:

```html
myMap = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
});

const marker = new AdvancedMarkerElement({
    map: myMap,
    position: { lat: -34.397, lng: 150.644 },
});
```

## Remove a marker

To remove a marker from the map, set either `marker.map` or `marker.position` to
`null`.

```html
// Set the map to null.
marker.map = null;

// Set the position to null.
marker.position = null;
```

#### See the complete example source code

This example shows how to add a marker to a map.

### TypeScript

```typescript
const mapElement = document.querySelector('gmp-map')!;

async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}
void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const mapElement = document.querySelector('gmp-map');

async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const marker = new AdvancedMarkerElement({
        position: { lat: 37.4239163, lng: -122.0947209 },
    });
    mapElement.append(marker);
}
void init();
```

### CSS

```css
/* 
 * Always set the map height explicitly to define the size of the div element
 * that contains the map. 
 */
gmp-map {
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
        <title>Default Advanced Marker</title>

        <link rel="stylesheet" type="text/css" href="./style.css" />
        <script type="module" src="./index.js"></script>
        <script>
            // prettier-ignore
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"
            });
        </script>
    </head>
    <body>
        <gmp-map
            center="37.4239163,-122.0947209"
            zoom="14"
            map-id="4504f8b37365c3d0"></gmp-map>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/advanced-markers-simple/jsfiddle)

## Next steps

- [Basic marker customization](https://developers.google.com/maps/documentation/javascript/advanced-markers/basic-customization)