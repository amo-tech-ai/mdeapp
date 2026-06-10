 

Nearby Search (New) takes one or more place types, and returns a list
of matching places. In the following example, you can choose a place type and see the results
on a map. Click the markers to see more details about the places.
<iframe src="https://maps-docs-team.web.app/samples/place-nearby-search/dist/" allow="fullscreen; fullscreen"></iframe>

Nearby Search (New) returns information about a set of places based
on the place types that you specify --- for example `restaurant` or `book_store`
or `bowling_alley`. The service responds with a list of places matching the specified
place types within the radius of the specified `locationRestriction`.

To use Nearby Search (New), you must enable "Places API (New)" on your
Google Cloud project. See [Get started](https://developers.google.com/maps/documentation/javascript/place-get-started)
for details.

### Find nearby places

Call [`searchNearby()`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.searchNearby)
to return a list of places based on the specified place types, location, and radius. Specify
search parameters using a request, and then call `searchNearby()`. Results are returned
as a list of `Place` objects, from which you can get
[place details](https://developers.google.com/maps/documentation/javascript/place-details).
The following snippet shows an example of a request and a call to `searchNearby()`:

### TypeScript

```typescript
// Get bounds and radius to constrain search.
center = mapElement.center!;
const ne = innerMap.getBounds()!.getNorthEast();
const sw = innerMap.getBounds()!.getSouthWest();
const diameter = spherical.computeDistanceBetween(ne, sw);
const radius = Math.min(diameter / 2, 50000); // Radius cannot be more than 50000.

const request = {
    // required parameters
    fields: [
        'displayName',
        'location',
        'formattedAddress',
        'googleMapsURI',
    ],
    locationRestriction: {
        center,
        radius,
    },
    // optional parameters
    includedPrimaryTypes: [typeSelect.value],
    maxResultCount: 5,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
};

const { places } = await Place.searchNearby(request);
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// Get bounds and radius to constrain search.
center = mapElement.center;
const ne = innerMap.getBounds().getNorthEast();
const sw = innerMap.getBounds().getSouthWest();
const diameter = spherical.computeDistanceBetween(ne, sw);
const radius = Math.min(diameter / 2, 50000); // Radius cannot be more than 50000.

const request = {
    // required parameters
    fields: [
        'displayName',
        'location',
        'formattedAddress',
        'googleMapsURI',
    ],
    locationRestriction: {
        center,
        radius,
    },
    // optional parameters
    includedPrimaryTypes: [typeSelect.value],
    maxResultCount: 5,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
};

const { places } = await Place.searchNearby(request);
```

- Use the `fields` parameter (required) to specify a comma-separated list of one or more [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields).
- Use the `locationRestriction` parameter (required) to specify a radius of up to 50,000 meters.
- Use the `includedPrimaryTypes` parameter to specify one or more [place types](https://developers.google.com/maps/documentation/javascript/place-types) to search for.
- Use the `rankPreference` parameter to specify a `SearchNearbyRankPreference` of either `POPULARITY` or `DISTANCE`.
- [See the full
  list of parameters.](https://developers.google.com/maps/documentation/javascript/reference/place#SearchNearbyRequest)

### Example

The following example uses `searchNearby()` to query for places of the selected type
within the map bounds, and populates a map with markers to show the results.

### TypeScript

```typescript
const mapElement = document.querySelector('gmp-map')!;
let innerMap: google.maps.Map;
let center: google.maps.LatLngLiteral | google.maps.LatLng;
let typeSelect: HTMLSelectElement;
let infoWindow: google.maps.InfoWindow;

async function init() {
    const [{ InfoWindow }, { event }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    typeSelect = document.querySelector('.type-select')!;

    typeSelect.addEventListener('change', () => {
        void nearbySearch();
    });

    infoWindow = new InfoWindow();

    // Kick off an initial search once map has loaded.
    event.addListenerOnce(innerMap, 'idle', () => {
        void nearbySearch();
    });
}

async function nearbySearch() {
    const [
        { Place, SearchNearbyRankPreference },
        { AdvancedMarkerElement },
        { spherical },
    ] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('geometry'),
    ]);
    // Get bounds and radius to constrain search.
    center = mapElement.center!;
    const ne = innerMap.getBounds()!.getNorthEast();
    const sw = innerMap.getBounds()!.getSouthWest();
    const diameter = spherical.computeDistanceBetween(ne, sw);
    const radius = Math.min(diameter / 2, 50000); // Radius cannot be more than 50000.

    const request = {
        // required parameters
        fields: [
            'displayName',
            'location',
            'formattedAddress',
            'googleMapsURI',
        ],
        locationRestriction: {
            center,
            radius,
        },
        // optional parameters
        includedPrimaryTypes: [typeSelect.value],
        maxResultCount: 5,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
    };

    const { places } = await Place.searchNearby(request);

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary('core');
        const bounds = new LatLngBounds();

        // First remove all existing markers.
        for (const marker of mapElement.querySelectorAll('gmp-advanced-marker'))
            marker.remove();

        // Loop through and get all the results.
        places.forEach((place) => {
            if (!place.location) return;
            bounds.extend(place.location);

            const marker = new AdvancedMarkerElement({
                map: innerMap,
                position: place.location,
                title: place.displayName,
            });

            // Build the content of the InfoWindow safely using DOM elements.
            const content = document.createElement('div');
            const address = document.createElement('div');
            address.textContent = place.formattedAddress || '';
            const placeId = document.createElement('div');
            placeId.textContent = place.id;
            content.append(address, placeId);

            if (place.googleMapsURI) {
                const link = document.createElement('a');
                link.href = place.googleMapsURI;
                link.target = '_blank';
                link.textContent = 'View Details on Google Maps';
                content.appendChild(link);
            }

            marker.addListener('gmp-click', () => {
                innerMap.panTo(place.location!);
                updateInfoWindow(place.displayName!, content, marker);
            });
        });

        innerMap.fitBounds(bounds, 100);
    } else {
        console.log('No results');
    }
}

function updateInfoWindow(
    title: string | Element | null,
    content: string | Element | null,
    anchor: google.maps.marker.AdvancedMarkerElement
) {
    infoWindow.setContent(content);
    infoWindow.setHeaderContent(title);
    infoWindow.open({
        anchor,
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const mapElement = document.querySelector('gmp-map');
let innerMap;
let center;
let typeSelect;
let infoWindow;

async function init() {
    const [{ InfoWindow }, { event }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('core'),
    ]);

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    typeSelect = document.querySelector('.type-select');

    typeSelect.addEventListener('change', () => {
        void nearbySearch();
    });

    infoWindow = new InfoWindow();

    // Kick off an initial search once map has loaded.
    event.addListenerOnce(innerMap, 'idle', () => {
        void nearbySearch();
    });
}

async function nearbySearch() {
    const [
        { Place, SearchNearbyRankPreference },
        { AdvancedMarkerElement },
        { spherical },
    ] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('geometry'),
    ]);
    // Get bounds and radius to constrain search.
    center = mapElement.center;
    const ne = innerMap.getBounds().getNorthEast();
    const sw = innerMap.getBounds().getSouthWest();
    const diameter = spherical.computeDistanceBetween(ne, sw);
    const radius = Math.min(diameter / 2, 50000); // Radius cannot be more than 50000.

    const request = {
        // required parameters
        fields: [
            'displayName',
            'location',
            'formattedAddress',
            'googleMapsURI',
        ],
        locationRestriction: {
            center,
            radius,
        },
        // optional parameters
        includedPrimaryTypes: [typeSelect.value],
        maxResultCount: 5,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
    };

    const { places } = await Place.searchNearby(request);

    if (places.length) {
        const { LatLngBounds } = await google.maps.importLibrary('core');
        const bounds = new LatLngBounds();

        // First remove all existing markers.
        for (const marker of mapElement.querySelectorAll('gmp-advanced-marker'))
            marker.remove();

        // Loop through and get all the results.
        places.forEach((place) => {
            if (!place.location) return;
            bounds.extend(place.location);

            const marker = new AdvancedMarkerElement({
                map: innerMap,
                position: place.location,
                title: place.displayName,
            });

            // Build the content of the InfoWindow safely using DOM elements.
            const content = document.createElement('div');
            const address = document.createElement('div');
            address.textContent = place.formattedAddress || '';
            const placeId = document.createElement('div');
            placeId.textContent = place.id;
            content.append(address, placeId);

            if (place.googleMapsURI) {
                const link = document.createElement('a');
                link.href = place.googleMapsURI;
                link.target = '_blank';
                link.textContent = 'View Details on Google Maps';
                content.appendChild(link);
            }

            marker.addListener('gmp-click', () => {
                innerMap.panTo(place.location);
                updateInfoWindow(place.displayName, content, marker);
            });
        });

        innerMap.fitBounds(bounds, 100);
    } else {
        console.log('No results');
    }
}

function updateInfoWindow(title, content, anchor) {
    infoWindow.setContent(content);
    infoWindow.setHeaderContent(title);
    infoWindow.open({
        anchor,
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
gmp-map {
    height: 100%;
}

#map-container {
    display: flex;
    flex-direction: row;
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

.type-select {
    width: 400px;
    height: 32px;
    border: 1px solid #000;
    border-radius: 10px;
    flex-grow: 1;
    padding: 0 10px;
    margin-left: 10px;
    margin-top: 10px;
}
```

### HTML

```html
<html>
    <head>
        <title>Nearby Search</title>

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
        <gmp-map center="45.438646,12.327573" zoom="14" map-id="DEMO_MAP_ID"
            ><!-- Map id is required for Advanced Markers. -->
            <gmp-advanced-marker></gmp-advanced-marker>
            <div id="controls" slot="control-inline-start-block-start">
                <select name="types" class="type-select">
                    <option value="cafe" selected>Cafe</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="museum">Museum</option>
                    <option value="monument">Monument</option>
                    <option value="park">Park</option>
                </select>
            </div>
        </gmp-map>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-nearby-search/jsfiddle)