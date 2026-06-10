---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-text-search-new
description: "Places API (New) — Text Search request/response reference. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
--- 

Text Search (New) takes a text query and returns a list of matching
places.
<iframe src="https://maps-docs-team.web.app/samples/place-text-search/dist/" allow="fullscreen; fullscreen"></iframe>

Text Search (New) returns information about a set of
places based on a string --- for example "pizza in New York" or "shoe stores near Ottawa" or
"123 Main Street". The service responds with a list of places matching the text string and any
location bias that has been set. Text Search (New) lets you search for
places by type, filter using criteria such as business hours and rating, and restrict or bias
results to a specific location.

To use Text Search (New), you must enable "Places API (New)" on your
Google Cloud project. See [Get started](https://developers.google.com/maps/documentation/javascript/place-get-started)
for details.

### Find places by text query

Call [`searchByText`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.searchByText) to return a list of places from a text query or phone number.
Specify search parameters using a request, and then call `searchByText()`. Results are
returned as a list of `Place` objects, from which you can get
[place details](https://developers.google.com/maps/documentation/javascript/place-details). The
following snippet shows an example of a request and call to `searchByText`:

### TypeScript

```typescript
const request = {
    textQuery: query,
    fields: ['displayName', 'location', 'businessStatus'],
    includedType: '', // Restrict query to a specific type (leave blank for any).
    useStrictTypeFiltering: true,
    locationBias: map.getCenter(),
    isOpenNow: true,
    language: 'en-US',
    maxResultCount: 8,
    minRating: 1, // Specify a minimum rating.
    region: 'us',
};

const { places } = await Place.searchByText(request);
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const request = {
    textQuery: query,
    fields: ['displayName', 'location', 'businessStatus'],
    includedType: '', // Restrict query to a specific type (leave blank for any).
    useStrictTypeFiltering: true,
    locationBias: map.getCenter(),
    isOpenNow: true,
    language: 'en-US',
    maxResultCount: 8,
    minRating: 1, // Specify a minimum rating.
    region: 'us',
};

const { places } = await Place.searchByText(request);
```

- Specify a text query or phone number to search with the `textQuery` parameter.
- Use the `fields` parameter (required) to specify a comma-separated list of one or more [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields) in camel case.
- Use the `includedType` parameter to return only results of the specified type.
- Use either `locationBias` or `locationRestriction` to bias or restrict your text search results to a specific region.

[See the full
list of properties.](https://developers.google.com/maps/documentation/javascript/reference/place#SearchByTextRequest)

If the query contains a phone number, the region parameter should be set. For example, if you
use a phone number to search for a place in Japan, and the requesting domain is `jp`,
you must set the `region` parameter to 'jp'. If `region` is omitted from
the request, the API will default to the United States ('us') region.
Results are returned as a list of `Place` objects, from which you can get [place details](https://developers.google.com/maps/documentation/javascript/place-details).

### Example

The following example calls `searchByText` with the provided query text, and
then populates a map with clickable markers to show the results.

### TypeScript

```typescript
let map: google.maps.Map;
let markers: Record<string, google.maps.marker.AdvancedMarkerElement> = {};
let infoWindow: google.maps.InfoWindow;

async function init() {
    const [{ Map, InfoWindow }, { ControlPosition }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    const center = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById('map')!, {
        center,
        zoom: 11,
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });

    const textInput = document.getElementById('text-input') as HTMLInputElement;
    const textInputButton = document.getElementById(
        'text-input-button'
    ) as HTMLButtonElement;
    const card = document.getElementById('text-input-card')!;
    map.controls[ControlPosition.TOP_LEFT].push(card);

    textInputButton.addEventListener('click', () => {
        void findPlaces(textInput.value);
    });

    textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            void findPlaces(textInput.value);
        }
    });

    infoWindow = new InfoWindow();
}

async function findPlaces(query: string) {
    const [{ Place }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
    ]);

    const request = {
        textQuery: query,
        fields: ['displayName', 'location', 'businessStatus'],
        includedType: '', // Restrict query to a specific type (leave blank for any).
        useStrictTypeFiltering: true,
        locationBias: map.getCenter(),
        isOpenNow: true,
        language: 'en-US',
        maxResultCount: 8,
        minRating: 1, // Specify a minimum rating.
        region: 'us',
    };

    const { places } = await Place.searchByText(request);

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary('core');
        const bounds = new LatLngBounds();

        // First remove all existing markers.
        for (const id in markers) {
            markers[id].map = null;
        }
        markers = {};

        // Loop through and get all the results.
        places.forEach((place: google.maps.places.Place) => {
            const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });
            markers[place.id] = marker;

            marker.addListener('gmp-click', () => {
                map.panTo(place.location!);
                updateInfoWindow(place.displayName!, place.id, marker);
            });

            if (place.location != null) {
                bounds.extend(place.location);
            }
        });

        map.fitBounds(bounds);
    } else {
        console.log('No results');
    }
}

// Helper function to create an info window.
function updateInfoWindow(
    title: string | Element | null,
    content: string | Element | null,
    anchor: google.maps.marker.AdvancedMarkerElement
) {
    infoWindow.setContent(content);
    infoWindow.setHeaderContent(title);
    infoWindow.open({
        map,
        anchor,
        shouldFocus: false,
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
let map;
let markers = {};
let infoWindow;

async function init() {
    const [{ Map, InfoWindow }, { ControlPosition }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    const center = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById('map'), {
        center,
        zoom: 11,
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });

    const textInput = document.getElementById('text-input');
    const textInputButton = document.getElementById('text-input-button');
    const card = document.getElementById('text-input-card');
    map.controls[ControlPosition.TOP_LEFT].push(card);

    textInputButton.addEventListener('click', () => {
        void findPlaces(textInput.value);
    });

    textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            void findPlaces(textInput.value);
        }
    });

    infoWindow = new InfoWindow();
}

async function findPlaces(query) {
    const [{ Place }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
    ]);

    const request = {
        textQuery: query,
        fields: ['displayName', 'location', 'businessStatus'],
        includedType: '', // Restrict query to a specific type (leave blank for any).
        useStrictTypeFiltering: true,
        locationBias: map.getCenter(),
        isOpenNow: true,
        language: 'en-US',
        maxResultCount: 8,
        minRating: 1, // Specify a minimum rating.
        region: 'us',
    };

    const { places } = await Place.searchByText(request);

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary('core');
        const bounds = new LatLngBounds();

        // First remove all existing markers.
        for (const id in markers) {
            markers[id].map = null;
        }
        markers = {};

        // Loop through and get all the results.
        places.forEach((place) => {
            const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });
            markers[place.id] = marker;

            marker.addListener('gmp-click', () => {
                map.panTo(place.location);
                updateInfoWindow(place.displayName, place.id, marker);
            });

            if (place.location != null) {
                bounds.extend(place.location);
            }
        });

        map.fitBounds(bounds);
    } else {
        console.log('No results');
    }
}

// Helper function to create an info window.
function updateInfoWindow(title, content, anchor) {
    infoWindow.setContent(content);
    infoWindow.setHeaderContent(title);
    infoWindow.open({
        map,
        anchor,
        shouldFocus: false,
    });
}

void init();
```

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

#text-input-card {
    width: 25%;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin: 10px;
    padding: 5px;
    font-family: Roboto, sans-serif;
    font-size: large;
    font-weight: bold;
}

#text-input {
    width: 100%;
    padding: 10px;
    margin: 0;
    box-sizing: border-box;
}

#text-input-button {
    display: inline-block;
    margin-top: 0.5rem;
    width: auto;
    padding: 0.6rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    background-color: #2563eb;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    text-align: center;
}
```

### HTML

```html
<html>
    <head>
        <title>Text Search</title>

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
        <div id="text-input-card">
            <input
                type="text"
                id="text-input"
                placeholder="Search for a place" />
            <input type="button" id="text-input-button" value="Search" />
        </div>
        <div id="map"></div>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-text-search/jsfiddle)