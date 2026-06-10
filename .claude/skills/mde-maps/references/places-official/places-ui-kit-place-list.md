---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-ui-kit-place-list
description: "Maps JavaScript — Places UI Kit place list / search UI. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/place-search-ui-kit "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/place-search-ui-kit "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list "View this page for the JavaScript platform docs.")

The [PlaceSearchElement](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceSearchElement)
is an HTML element that renders the results of a place search in a list. There are two ways to
configure the `gmp-place-search` element:

- To search for places of a specific type in a given area, use [search nearby request](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list#search-nearby-request) to render search results using the [`PlaceNearbySearchRequestElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceNearbySearchRequestElement).
- To search for places in a given area based on a text query, use [search by text request](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list#search-by-text-request) to render search results using the [`PlaceTextSearchRequestElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceTextSearchRequestElement).

## Search nearby request

Select a place type from the menu to see nearby search results for that place type.
<iframe src="https://maps-docs-team.web.app/samples/ui-kit-place-search-nearby/dist/" allow="fullscreen; "></iframe>


The nearby search is primarily configured to search by place type and location, and results can be
ranked by distance or by popularity using the `rankPreference` property. See the
[`PlaceNearbySearchRequestElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceNearbySearchRequestElement) class reference documentation for more details.


This example renders the Place Search element in response to a nearby search with a user-selected
place type. It also displays a
[PlaceDetailsCompactElement](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details#PlaceDetailsCompactElement) for the selected place.
[See the complete code example](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list#complete-code-example-nearby)


To add the Place Search element to the map, add a `gmp-place-search` element with a
nested `gmp-place-nearby-search-request` element to the HTML page.

```html
<gmp-place-search selectable>
    <gmp-place-all-content></gmp-place-all-content>
    <gmp-place-nearby-search-request
        max-result-count="5"></gmp-place-nearby-search-request>
</gmp-place-search>
```


The `select` element allows the user to choose a place type from the menu. For
simplicity, only three place types are listed: restaurant, cafe, and EV charging station.

```html
<div class="controls">
    <label for="type-select">
        Select a place type:
        <select id="type-select" class="type-select">
            <option value="restaurant">Restaurant</option>
            <option value="cafe" selected>Cafe</option>
            <option value="electric_vehicle_charging_station">
                EV charging station
            </option>
        </select>
    </label>
</div>
```


When the user selects a place type from the menu, the
`gmp-place-nearby-search-request` element is updated, and the Place Search element
displays the results, as shown in the following snippets. Markers are added in the `addMarkers` helper function.

```javascript
// Add event listeners to the type select and place search elements.
    typeSelect.addEventListener('change', () => {
        searchPlaces();
    });

    placeSearch.addEventListener('gmp-select', (event) => {
        const { place } = event;
        markers.get(place.id)?.click();
    });
    placeSearch.addEventListener('gmp-load', () => {
        void addMarkers();
    });

    searchPlaces();
}
```

```javascript
// The searchPlaces function is called when the user changes the type select or when the page loads.
function searchPlaces() {
    // Close the info window and clear the markers.
    infoWindow.close();
    for (const marker of markers.values()) {
        marker.remove();
    }
    markers.clear();

    // Set the place search query and add an event listener to the place search element.
    if (typeSelect.value) {
        const center = map.center;
        placeSearchQuery.locationRestriction = {
            center,
            radius: 50000, // 50km radius
        };
        placeSearchQuery.includedTypes = [typeSelect.value];
    }
}
```

### Complete code example

### JavaScript

```javascript
// Query selectors for various elements in the HTML file.
const map = document.querySelector('gmp-map');
const placeSearch = document.querySelector('gmp-place-search');
const placeSearchQuery = document.querySelector(
    'gmp-place-nearby-search-request'
);
const placeDetails = document.querySelector('gmp-place-details-compact');
const placeRequest = document.querySelector('gmp-place-details-place-request');
const typeSelect = document.querySelector('.type-select');

// Global variables for the map, markers, and info window.
const markers = new Map();
let infoWindow;

// The init function is called when the page loads.
async function init() {
    // Import the necessary libraries from the Google Maps API.
    const [{ InfoWindow }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places'),
    ]);

    // Create a new info window and set its content to the place details element.
    placeDetails.remove(); // Hide the place details element because it is not needed until the info window opens
    infoWindow = new InfoWindow({
        content: placeDetails,
        ariaLabel: 'Place Details',
    });

    // Set the map options.
    map.innerMap.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Add event listeners to the type select and place search elements.
    typeSelect.addEventListener('change', () => {
        searchPlaces();
    });

    placeSearch.addEventListener('gmp-select', (event) => {
        const { place } = event;
        markers.get(place.id)?.click();
    });
    placeSearch.addEventListener('gmp-load', () => {
        void addMarkers();
    });

    searchPlaces();
}
// The searchPlaces function is called when the user changes the type select or when the page loads.
function searchPlaces() {
    // Close the info window and clear the markers.
    infoWindow.close();
    for (const marker of markers.values()) {
        marker.remove();
    }
    markers.clear();

    // Set the place search query and add an event listener to the place search element.
    if (typeSelect.value) {
        const center = map.center;
        placeSearchQuery.locationRestriction = {
            center,
            radius: 50000, // 50km radius
        };
        placeSearchQuery.includedTypes = [typeSelect.value];
    }
}

// The addMarkers function is called when the place search element loads.
async function addMarkers() {
    // Import the necessary libraries from the Google Maps API.
    const [{ AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('core'),
    ]);
    const bounds = new LatLngBounds();

    if (placeSearch.places.length === 0) {
        return;
    }

    for (const place of placeSearch.places) {
        if (!place.location) continue;
        const marker = new AdvancedMarkerElement({
            map: map.innerMap,
            position: place.location,
            collisionBehavior: 'REQUIRED_AND_HIDES_OPTIONAL',
        });

        markers.set(place.id, marker);
        bounds.extend(place.location);

        marker.addListener('click', () => {
            placeRequest.place = place;
            infoWindow.open(map.innerMap, marker);
        });
    }

    map.innerMap.fitBounds(bounds);
}

void init();
```

### CSS

```css
html,
body {
    height: 100%;
    margin: 0;
}

body {
    display: flex;
    flex-direction: column;
    font-family: Arial, Helvetica, sans-serif;
}

.container {
    display: flex;
    height: 100vh;
    width: 100%;
}

gmp-map {
    flex-grow: 1;
}

.ui-panel {
    width: 400px;
    margin-left: 20px;
    margin-top: 10px;
    overflow-y: auto;
    font-family: Arial, Helvetica, sans-serif;
}

.list-container {
    display: flex;
    flex-direction: column;
}

gmp-place-search {
    width: 100%;
    margin: 0;
    border: none;
    color-scheme: light;
}
```

### HTML

```html
<!doctype html>
<html>
    <head>
        <title>Place Search Nearby with Google Maps</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script type="module" src="./index.js"></script>
        <script>
            // prettier-ignore
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"
            });
        </script>
    </head>
    <body>

        <div class="container">
            <!-- map-id is required to use advanced markers. See https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over. -->
            <gmp-map center="-37.813,144.963" zoom="16" map-id="DEMO_MAP_ID">
            </gmp-map>
            <div class="ui-panel">
                <div class="controls">
                    <label for="type-select">
                        Select a place type:
                        <select id="type-select" class="type-select">
                            <option value="restaurant">Restaurant</option>
                            <option value="cafe" selected>Cafe</option>
                            <option value="electric_vehicle_charging_station">
                                EV charging station
                            </option>
                        </select>
                    </label>
                </div>
                <div class="list-container">
                    <gmp-place-search selectable>
                        <gmp-place-all-content></gmp-place-all-content>
                        <gmp-place-nearby-search-request
                            max-result-count="5"></gmp-place-nearby-search-request>
                    </gmp-place-search>
                </div>
            </div>
        </div>

        <!--
        The gmp-place-details-compact element is styled inline because it is
        conditionally rendered and moved into the info window, which is
        part of the map's shadow DOM.
    -->
        <gmp-place-details-compact
            orientation="horizontal"
            truncation-preferred
            style="
                width: 400px;
                padding: 0;
                margin: 0;
                border: none;
                background-color: transparent;
                color-scheme: light;
            ">
            <gmp-place-details-place-request></gmp-place-details-place-request>
            <gmp-place-content-config>
                <gmp-place-media></gmp-place-media>
                <gmp-place-rating></gmp-place-rating>
                <gmp-place-price></gmp-place-price>
                <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
                <gmp-place-open-now-status></gmp-place-open-now-status>
                <gmp-place-attribution
                    light-scheme-color="gray"
                    dark-scheme-color="white"></gmp-place-attribution>
            </gmp-place-content-config>
        </gmp-place-details-compact>

    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/ui-kit-place-search-nearby/jsfiddle)

## Search by text request


Enter a search term in the input field and click the **Search** button to get a list of places
that match the term.
<iframe src="https://maps-docs-team.web.app/samples/ui-kit-place-search-text/dist/" allow="fullscreen; "></iframe>


The text search is primarily configured to search using a text query and location, and results can
be refined by price level, rating, and whether they are currently open. Results can also be ranked
by distance or by popularity using the `rankPreference` property. See the
[`PlaceTextSearchRequestElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceTextSearchRequestElement) class reference documentation for more details.


This example renders the Place Search element in response to a user text input. It also displays a
[PlaceDetailsCompactElement](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details#PlaceDetailsCompactElement) for the selected place.
[See the complete code example](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list#complete-code-example-text)


To add the Place Search element to the map, add a `gmp-place-search` element
with a nested `gmp-place-search-text-search-request` element to the HTML page.

```html
<gmp-place-search selectable>
    <gmp-place-all-content></gmp-place-all-content>
    <gmp-place-text-search-request
        max-result-count="5"></gmp-place-nearby-search-request>
</gmp-place-search>
```


The `input` element allows the user to enter search text.

```html
<div class="controls">
    <input
        type="text"
        id="query-input"
        class="query-input"
        placeholder="Search for a place"
        value="cafe" />
    <button id="search-button" class="search-button">
        Search
    </button>
</div>
```


When the user clicks the **Search** button, the search function is run, the
`gmp-place-text-search-request` element is updated, and the Place Search element
displays the results as shown in the following snippets. Markers are added in the
`addMarkers` helper function.

```javascript
// Add event listeners to the query input and place search elements.
    searchButton.addEventListener('click', () => {
        searchPlaces();
    });
    queryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchPlaces();
        }
    });

    placeSearch.addEventListener('gmp-select', (event) => {
        const { place } = event;
        markers.get(place.id)?.click();
    });
    placeSearch.addEventListener('gmp-load', () => {
        void addMarkers();
    });

    searchPlaces();
}
```

```javascript
// The searchPlaces function is called when the user changes the query input or when the page loads.
function searchPlaces() {
    // Close the info window and clear the markers.
    infoWindow.close();
    for (const marker of markers.values()) {
        marker.remove();
    }
    markers.clear();

    // Set the place search query and add an event listener to the place search element.
    if (queryInput.value) {
        const center = map.center;
        if (center) {
            placeSearchQuery.locationBias = center;
        }
        // The textQuery property is required for the search element to load.
        // Any other configured properties will be ignored if textQuery is not set.
        placeSearchQuery.textQuery = queryInput.value;
    }
}
```

### Complete code example

### JavaScript

```javascript
// Query selectors for various elements in the HTML file.
const map = document.querySelector('gmp-map');
const placeSearch = document.querySelector('gmp-place-search');
const placeSearchQuery = document.querySelector(
    'gmp-place-text-search-request'
);
const placeDetails = document.querySelector('gmp-place-details-compact');
const placeRequest = document.querySelector('gmp-place-details-place-request');
const queryInput = document.querySelector('.query-input');
const searchButton = document.querySelector('.search-button');

// Global variables for the map, markers, and info window.
const markers = new Map();
let infoWindow;

// The init function is called when the page loads.
async function init() {
    // Import the necessary libraries from the Google Maps API.
    const [{ InfoWindow }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places'),
    ]);

    // Create a new info window and set its content to the place details element.
    placeDetails.remove(); // Hide the place details element because it is not needed until the info window opens
    infoWindow = new InfoWindow({
        content: placeDetails,
        ariaLabel: 'Place Details',
    });

    // Set the map options.
    map.innerMap.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Add event listeners to the query input and place search elements.
    searchButton.addEventListener('click', () => {
        searchPlaces();
    });
    queryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchPlaces();
        }
    });

    placeSearch.addEventListener('gmp-select', (event) => {
        const { place } = event;
        markers.get(place.id)?.click();
    });
    placeSearch.addEventListener('gmp-load', () => {
        void addMarkers();
    });

    searchPlaces();
}
// The searchPlaces function is called when the user changes the query input or when the page loads.
function searchPlaces() {
    // Close the info window and clear the markers.
    infoWindow.close();
    for (const marker of markers.values()) {
        marker.remove();
    }
    markers.clear();

    // Set the place search query and add an event listener to the place search element.
    if (queryInput.value) {
        const center = map.center;
        if (center) {
            placeSearchQuery.locationBias = center;
        }
        // The textQuery property is required for the search element to load.
        // Any other configured properties will be ignored if textQuery is not set.
        placeSearchQuery.textQuery = queryInput.value;
    }
}

// The addMarkers function is called when the place search element loads.
async function addMarkers() {
    // Import the necessary libraries from the Google Maps API.
    const [{ AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('core'),
    ]);
    const bounds = new LatLngBounds();

    if (placeSearch.places.length === 0) {
        return;
    }

    for (const place of placeSearch.places) {
        if (!place.location) {
            continue;
        }

        const marker = new AdvancedMarkerElement({
            map: map.innerMap,
            position: place.location,
            collisionBehavior: 'REQUIRED_AND_HIDES_OPTIONAL',
        });

        markers.set(place.id, marker);
        bounds.extend(place.location);

        marker.addListener('click', () => {
            placeRequest.place = place;
            infoWindow.open(map.innerMap, marker);
        });
    }

    map.innerMap.fitBounds(bounds);
}

void init();
```

### CSS

```css
html,
body {
    height: 100%;
    margin: 0;
}

body {
    display: flex;
    flex-direction: column;
    font-family: Arial, Helvetica, sans-serif;
}

.container {
    display: flex;
    height: 100vh;
    width: 100%;
}

gmp-map {
    flex-grow: 1;
}

.ui-panel {
    width: 400px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    overflow-y: auto;
    font-family: Arial, Helvetica, sans-serif;
}

.list-container {
    display: flex;
    flex-direction: column;
}

gmp-place-search {
    width: 100%;
    margin: 0;
    border: none;
    color-scheme: light;
}

.query-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.search-button {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    background-color: #1a73e8;
    color: white;
    border: none;
    cursor: pointer;
}

.search-button:hover,
.search-button:focus-visible {
    background-color: #1765cc;
}
```

### HTML

```html
<!doctype html>
<html>
    <head>
        <title>Place Text Search with Google Maps</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script type="module" src="./index.js"></script>
        <script>
            // prettier-ignore
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"
            });
        </script>
    </head>
    <body>

        <div class="container">
            <div class="ui-panel">
                <div class="controls">
                    <input
                        type="text"
                        id="query-input"
                        class="query-input"
                        placeholder="Search for a place"
                        value="cafe" />
                    <button class="search-button">Search</button>
                </div>
                <div class="list-container">
                    <gmp-place-search selectable>
                        <gmp-place-all-content></gmp-place-all-content>
                        <gmp-place-text-search-request
                            max-result-count="5"></gmp-place-text-search-request>
                    </gmp-place-search>
                </div>
            </div>
            <!-- map-id is required to use advanced markers. See https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over. -->
            <gmp-map center="-37.813,144.963" zoom="16" map-id="DEMO_MAP_ID">
            </gmp-map>
        </div>

        <!--
        The gmp-place-details-compact element is styled inline because it is
        conditionally rendered and moved into the info window, which is
        part of the map's shadow DOM.
        -->
        <gmp-place-details-compact
            orientation="horizontal"
            truncation-preferred
            style="
                width: 400px;
                padding: 0;
                margin: 0;
                border: none;
                background-color: transparent;
                color-scheme: light;
            ">
            <gmp-place-details-place-request></gmp-place-details-place-request>
            <gmp-place-content-config>
                <gmp-place-media></gmp-place-media>
                <gmp-place-rating></gmp-place-rating>
                <gmp-place-price></gmp-place-price>
                <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
                <gmp-place-open-now-status></gmp-place-open-now-status>
                <gmp-place-attribution
                    light-scheme-color="gray"
                    dark-scheme-color="white"></gmp-place-attribution>
            </gmp-place-content-config>
        </gmp-place-details-compact>

    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/ui-kit-place-search-text/jsfiddle)