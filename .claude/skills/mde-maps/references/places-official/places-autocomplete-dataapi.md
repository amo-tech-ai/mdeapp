 
The Place Autocomplete Data API lets you fetch place predictions
programmatically, to create customized autocomplete experiences with a finer degree of control
than is possible with the autocomplete widget. In this guide you will learn how to use the
Place Autocomplete Data API to make autocomplete requests based on user
queries.

The following example shows a simplified type-ahead integration. Enter your search query,
such as "pizza" or "poke", then click to select the result you want.
<iframe src="https://maps-docs-team.web.app/samples/place-autocomplete-data-session/dist/" allow="fullscreen; fullscreen"></iframe>

## Autocomplete requests

An autocomplete request takes a query input string and returns a list of place predictions. To
make an autocomplete request, call [`fetchAutocompleteSuggestions()`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteSuggestion.fetchAutocompleteSuggestions)
and pass a request with the needed properties. The [`input`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest.input)
property contains the string to search; in a typical application this value would be updated as
the user types a query. The request should include a [`sessionToken`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest.sessionToken),
which is used for billing purposes.

The following snippet shows creating a request body and adding a session token, then calling
`fetchAutocompleteSuggestions()` to get a list of
[`PlacePrediction`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#PlacePrediction)s.

```javascript
// Add an initial request body.
const request = {
    input: 'Tadi',
    locationRestriction: {
        west: -122.44,
        north: 37.8,
        east: -122.39,
        south: 37.78,
    },
    origin: { lat: 37.7893, lng: -122.4039 },
    includedPrimaryTypes: ['restaurant'],
    language: 'en-US',
    region: 'us',
};

// Create a session token.
const token = new AutocompleteSessionToken();
// Add the token to the request.
request.sessionToken = token;
```

### Constrain Autocomplete predictions

By default, Place Autocomplete presents all place types, biased for predictions near the user's
location, and fetches all available data fields for the user's selected place. Set Place
Autocomplete options to present more relevant predictions, by restricting or biasing results.

Restricting results causes the Autocomplete widget to ignore any results that are outside of the
restriction area. A common practice is to restrict results to the map bounds. Biasing results
makes the Autocomplete widget show results within the specified area, but some matches may be
outside of that area.

Use the `origin` property to specify the origin point from which to calculate
geodesic distance to the destination. If this value is omitted, distance is not returned.

Use the [`includedPrimaryTypes`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest.includedPrimaryTypes)
property to specify up to five [place types](https://developers.google.com/maps/documentation/javascript/place-types).
If no types are specified, places of all types will be returned.
[See the API reference](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data)

## Get place details

To return a [`Place`](https://developers.google.com/maps/documentation/javascript/reference/place)
object from a place prediction result, first call [`toPlace()`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#PlacePrediction.toPlace),
then call [`fetchFields()`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.fetchFields)
on the resulting `Place` object (the session ID from the place prediction is automatically included). Calling `fetchFields()` ends the
autocomplete session.

```javascript
const place = suggestions[0].placePrediction.toPlace(); // Get first predicted place.
await place.fetchFields({
    fields: ['displayName', 'formattedAddress'],
});

const placeInfo = document.getElementById('prediction');
placeInfo.textContent = `First predicted place: ${place.displayName}: ${place.formattedAddress}`;
```

## Session tokens

Session tokens group the query and selection phases of a user autocomplete search into a
discrete session for billing purposes. The session begins when the user starts typing.
The session is concluded when the user selects a place and a call to Place Details is made.

To create a new session token and add it to a request, create an instance of
[`AutocompleteSessionToken`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteSessionToken.constructor),
then set the [`sessionToken`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest.sessionToken)
property of the request to use the tokens as shown in the following snippet:

```javascript
// Create a session token.
const token = new AutocompleteSessionToken();
// Add the token to the request.
request.sessionToken = token;
```

A session is concluded when [`fetchFields()`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.fetchFields)
is called. After creating the `Place` instance, you don't need to pass the session
token to `fetchFields()` as this is handled automatically.

```javascript
await place.fetchFields({
    fields: ['displayName', 'formattedAddress'],
});
```

Make a session token for the next session by creating a new instance of `AutocompleteSessionToken`.

#### Session token recommendations:

- Use session tokens for all Place Autocomplete calls.
- Generate a fresh token for each session.
- Pass a unique session token for each new session. Using the same token for more than one session will result in each request being billed individually.

You can optionally omit the autocomplete session token from a request. If the session token is
omitted, each request is billed separately, triggering the
[Autocomplete - Per Request](https://developers.google.com/maps/documentation/javascript/usage-and-billing#ac-per-request)
SKU. If you reuse a session token, the session is considered invalid and the requests are charged
as if no session token was provided.

## Example

As the user types a query, an autocomplete request is called every few
keystrokes (not per-character), and a list of possible results is returned.
When the user makes a selection from the result list, the selection counts as
a request, and all of the requests made during the search are bundled and
counted as a single request. If the user selects a place, the search query is
available at no charge, and only the Place data request is charged. If the user does not make a
selection within a few minutes of the beginning of the session, only the
search query is charged.

From the perspective of an app, the flow of events goes like this:

1. A user begins typing a query to search for "Paris, France".
2. Upon detecting user input, the app creates a new session token, "Token A".
3. As the user types, the API makes an autocomplete request every few characters, displaying a new list of potential results for each:  
   "P"   
   "Par"   
   "Paris,"   
   "Paris, Fr"   
4. When the user makes a selection:
   - All requests resulting from the query are grouped and added to the session represented by "Token A", as a single request.
   - The user's selection is counted as a Place Detail request, and added to the session represented by "Token A".
5. The session is concluded, and the app discards "Token A".

[Learn about how sessions are billed](https://developers.google.com/maps/documentation/javascript/session-pricing)

## Complete example code

This section contains complete examples showing how to use the Place Autocomplete Data API .

### Place autocomplete predictions

The following example demonstrates calling
[`fetchAutocompleteSuggestions()`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data?db=gems#AutocompleteSuggestion.fetchAutocompleteSuggestions)
for the input "Tadi", then calling [`toPlace()`](https://developers.google.com/maps/documentation/javascript/reference/next/autocomplete-data#PlacePrediction.toPlace)
on the first prediction result, followed by a call to `fetchFields()` to get place details.
<iframe src="https://maps-docs-team.web.app/samples/place-autocomplete-data-simple/dist/" allow="fullscreen; fullscreen"></iframe>

### TypeScript

```typescript
async function init() {
    const { AutocompleteSessionToken, AutocompleteSuggestion } =
        await google.maps.importLibrary('places');

    // Add an initial request body.
    const request: google.maps.places.AutocompleteRequest = {
        input: 'Tadi',
        locationRestriction: {
            west: -122.44,
            north: 37.8,
            east: -122.39,
            south: 37.78,
        },
        origin: { lat: 37.7893, lng: -122.4039 },
        includedPrimaryTypes: ['restaurant'],
        language: 'en-US',
        region: 'us',
    };

    // Create a session token.
    const token = new AutocompleteSessionToken();
    // Add the token to the request.
    request.sessionToken = token;
    // Fetch autocomplete suggestions.
    const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    const title = document.getElementById('title')!;
    title.appendChild(
        document.createTextNode(
            'Query predictions for "' + request.input + '":'
        )
    );

    const resultsElement = document.getElementById('results')!;

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        // Create a new list element.
        const listItem = document.createElement('li');

        listItem.appendChild(
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            document.createTextNode(placePrediction!.text.toString())
        );
        resultsElement.appendChild(listItem);
    }

    const place = suggestions[0].placePrediction!.toPlace(); // Get first predicted place.
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress'],
    });

    const placeInfo = document.getElementById('prediction')!;
    placeInfo.textContent = `First predicted place: ${place.displayName}: ${place.formattedAddress}`;
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function init() {
    const { AutocompleteSessionToken, AutocompleteSuggestion } =
        await google.maps.importLibrary('places');

    // Add an initial request body.
    const request = {
        input: 'Tadi',
        locationRestriction: {
            west: -122.44,
            north: 37.8,
            east: -122.39,
            south: 37.78,
        },
        origin: { lat: 37.7893, lng: -122.4039 },
        includedPrimaryTypes: ['restaurant'],
        language: 'en-US',
        region: 'us',
    };

    // Create a session token.
    const token = new AutocompleteSessionToken();
    // Add the token to the request.
    request.sessionToken = token;
    // Fetch autocomplete suggestions.
    const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    const title = document.getElementById('title');
    title.appendChild(
        document.createTextNode(
            'Query predictions for "' + request.input + '":'
        )
    );

    const resultsElement = document.getElementById('results');

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        // Create a new list element.
        const listItem = document.createElement('li');

        listItem.appendChild(
            document.createTextNode(placePrediction.text.toString())
        );
        resultsElement.appendChild(listItem);
    }

    const place = suggestions[0].placePrediction.toPlace(); // Get first predicted place.
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress'],
    });

    const placeInfo = document.getElementById('prediction');
    placeInfo.textContent = `First predicted place: ${place.displayName}: ${place.formattedAddress}`;
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
```

### HTML

```html
<html>
    <head>
        <title>Place Autocomplete Data API Predictions</title>

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
        <div id="title"></div>
        <ul id="results"></ul>
        <p><span id="prediction"></span></p>
        <img
            class="powered-by-google"
            src="./powered_by_google_on_white.png"
            alt="Powered by Google" />
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-autocomplete-data-simple/jsfiddle)

### Place autocomplete type-ahead with sessions

This example demonstrates the following concepts:

- Calling [`fetchAutocompleteSuggestions()`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteSuggestion.fetchAutocompleteSuggestions) based on user queries and showing a list of predicted places in response.
- Using session tokens to group a user query with the final Place Details request.
- Retrieving place details for the selected place and displaying a marker.
- Using control slotting to nest UI elements in the `gmp-map` element.

<iframe src="https://maps-docs-team.web.app/samples/place-autocomplete-data-session/dist/" allow="fullscreen; fullscreen"></iframe>

### TypeScript

```typescript
const mapElement = document.querySelector('gmp-map')!;
let innerMap: google.maps.Map;
let marker: google.maps.marker.AdvancedMarkerElement;
const titleElement = document.querySelector<HTMLElement>('.title')!;
const resultsContainerElement = document.querySelector('.results')!;
const inputElement = document.querySelector('input')!;
const tokenStatusElement = document.querySelector('.token-status')!;
let newestRequestId = 0;
let tokenCount = 0;

// Create an initial request body.
const request: google.maps.places.AutocompleteRequest = {
    input: '',
    includedPrimaryTypes: [
        'restaurant',
        'cafe',
        'museum',
        'park',
        'botanical_garden',
    ],
};

async function init() {
    await google.maps.importLibrary('maps');
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    // Update request center and bounds when the map bounds change.
    innerMap.addListener('bounds_changed', () => {
        request.locationRestriction = innerMap.getBounds();
        request.origin = innerMap.getCenter();
    });

    inputElement.addEventListener('input', makeAutocompleteRequest);
}

async function makeAutocompleteRequest(inputEvent: Event) {
    // To avoid race conditions, store the request ID and compare after the request.
    const requestId = ++newestRequestId;

    const { AutocompleteSuggestion } =
        await google.maps.importLibrary('places');

    if (!(inputEvent.target as HTMLInputElement)?.value) {
        titleElement.textContent = '';
        resultsContainerElement.replaceChildren();
        return;
    }

    // Add the latest char sequence to the request.
    request.input = (inputEvent.target as HTMLInputElement).value;

    // Fetch autocomplete suggestions and show them in a list.
    const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    // If the request has been superseded by a newer request, do not render the output.
    if (requestId !== newestRequestId) return;

    titleElement.innerText = `Place predictions for "${request.input}"`;

    // Clear the list first.
    resultsContainerElement.replaceChildren();

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        if (!placePrediction) {
            continue;
        }

        // Create a link for the place, add an event handler to fetch the place.
        // We are using a button element to take advantage of its a11y capabilities.
        const placeButton = document.createElement('button');
        placeButton.addEventListener('click', () => {
            void onPlaceSelected(placePrediction.toPlace());
        });
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        placeButton.textContent = placePrediction.text.toString();
        placeButton.classList.add('place-button');

        // Create a new list item element.
        const li = document.createElement('li');
        li.appendChild(placeButton);
        resultsContainerElement.appendChild(li);
    }
}

// Event handler for clicking on a suggested place.
async function onPlaceSelected(place: google.maps.places.Place) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
    });

    resultsContainerElement.textContent = `${place.displayName}: ${place.formattedAddress}`;
    titleElement.textContent = 'Selected Place:';
    inputElement.value = '';

    await refreshToken();

    // Remove the previous marker, if it exists.
    if (marker) {
        marker.remove();
    }

    // Create a new marker.
    marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    // Center the map on the selected place.
    if (place.location) {
        innerMap.setCenter(place.location);
        innerMap.setZoom(15);
    }
}

// Helper function to refresh the session token.
async function refreshToken() {
    const { AutocompleteSessionToken } =
        await google.maps.importLibrary('places');

    // Increment the token counter.
    tokenCount++;

    // Create a new session token and add it to the request.
    request.sessionToken = new AutocompleteSessionToken();
    tokenStatusElement.textContent = `Session token count: ${tokenCount}`;
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const mapElement = document.querySelector('gmp-map');
let innerMap;
let marker;
const titleElement = document.querySelector('.title');
const resultsContainerElement = document.querySelector('.results');
const inputElement = document.querySelector('input');
const tokenStatusElement = document.querySelector('.token-status');
let newestRequestId = 0;
let tokenCount = 0;

// Create an initial request body.
const request = {
    input: '',
    includedPrimaryTypes: [
        'restaurant',
        'cafe',
        'museum',
        'park',
        'botanical_garden',
    ],
};

async function init() {
    await google.maps.importLibrary('maps');
    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
    });

    // Update request center and bounds when the map bounds change.
    innerMap.addListener('bounds_changed', () => {
        request.locationRestriction = innerMap.getBounds();
        request.origin = innerMap.getCenter();
    });

    inputElement.addEventListener('input', makeAutocompleteRequest);
}

async function makeAutocompleteRequest(inputEvent) {
    // To avoid race conditions, store the request ID and compare after the request.
    const requestId = ++newestRequestId;

    const { AutocompleteSuggestion } =
        await google.maps.importLibrary('places');

    if (!inputEvent.target?.value) {
        titleElement.textContent = '';
        resultsContainerElement.replaceChildren();
        return;
    }

    // Add the latest char sequence to the request.
    request.input = inputEvent.target.value;

    // Fetch autocomplete suggestions and show them in a list.
    const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    // If the request has been superseded by a newer request, do not render the output.
    if (requestId !== newestRequestId) return;

    titleElement.innerText = `Place predictions for "${request.input}"`;

    // Clear the list first.
    resultsContainerElement.replaceChildren();

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        if (!placePrediction) {
            continue;
        }

        // Create a link for the place, add an event handler to fetch the place.
        // We are using a button element to take advantage of its a11y capabilities.
        const placeButton = document.createElement('button');
        placeButton.addEventListener('click', () => {
            void onPlaceSelected(placePrediction.toPlace());
        });

        placeButton.textContent = placePrediction.text.toString();
        placeButton.classList.add('place-button');

        // Create a new list item element.
        const li = document.createElement('li');
        li.appendChild(placeButton);
        resultsContainerElement.appendChild(li);
    }
}

// Event handler for clicking on a suggested place.
async function onPlaceSelected(place) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
    });

    resultsContainerElement.textContent = `${place.displayName}: ${place.formattedAddress}`;
    titleElement.textContent = 'Selected Place:';
    inputElement.value = '';

    await refreshToken();

    // Remove the previous marker, if it exists.
    if (marker) {
        marker.remove();
    }

    // Create a new marker.
    marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    // Center the map on the selected place.
    if (place.location) {
        innerMap.setCenter(place.location);
        innerMap.setZoom(15);
    }
}

// Helper function to refresh the session token.
async function refreshToken() {
    const { AutocompleteSessionToken } =
        await google.maps.importLibrary('places');

    // Increment the token counter.
    tokenCount++;

    // Create a new session token and add it to the request.
    request.sessionToken = new AutocompleteSessionToken();
    tokenStatusElement.textContent = `Session token count: ${tokenCount}`;
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

.place-button {
    height: 3rem;
    width: 100%;
    background-color: transparent;
    text-align: left;
    border: none;
    cursor: pointer;
}

.place-button:focus-visible {
    outline: 2px solid #0056b3;
    border-radius: 2px;
}

.input {
    width: 300px;
    font-size: small;
    margin-bottom: 1rem;
}

/* Styles for the floating panel */
.controls {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    font-family: sans-serif;
    font-size: small;
    margin: 12px;
    padding: 1rem;
}

.title {
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.results {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.results li:not(:last-child) {
    border-bottom: 1px solid #ddd;
}

.results li:hover {
    background-color: #eee;
}
```

### HTML

```html
<html>
    <head>
        <title>Place Autocomplete Data API Session</title>

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
        <gmp-map center="37.7893, -122.4039" zoom="12" map-id="DEMO_MAP_ID">
            <div class="controls" slot="control-inline-start-block-start">
                <input
                    type="text"
                    class="input"
                    placeholder="Search for a place..."
                    autocomplete="off" /><!-- Turn off the input's own autocomplete (not supported by all browsers).-->
                <div class="token-status"></div>
                <div class="title"></div>
                <ol class="results"></ol>
            </div>
        </gmp-map>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-autocomplete-data-session/jsfiddle)

## Autocomplete (New) optimization

This section describes best practices to help you make the most of the
Autocomplete (New) service.

Here are some general guidelines:

- The quickest way to develop a working user interface is to use the Maps JavaScript API [Autocomplete (New) widget](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new), Places SDK for Android [Autocomplete (New) widget](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete#autocomplete-widget), or Places SDK for iOS [Autocomplete (New) widget](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete#autocomplete-widget).
- Understand essential Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields) from the start.
- Location biasing and location restriction fields are optional but can have a significant impact on autocomplete performance.
- Use error handling to make sure your app degrades gracefully if the API returns an error.
- Make sure your app handles when there is no selection and offers users a way to continue.

### Cost optimization best practices

#### Basic cost optimization

[Video](https://www.youtube.com/watch?v=VOP8cvCLGac)

To optimize the cost of using the Autocomplete (New)
service, use field masks in Place Details (New) and Autocomplete (New) widgets to return only the

Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields)

you need.

#### Advanced cost optimization

Consider programmatic implementation of Autocomplete (New) in order to access

[SKU: Autocomplete Request pricing](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku)

and request [Geocoding API results](https://developers.google.com/maps/documentation/geocoding/overview#results) about the selected place instead of Place Details (New). Per-request pricing paired with Geocoding API is more cost-effective than per-session (session-based) pricing if both of the following conditions are met:

- If you only need the latitude/longitude or address of the user's selected place, the Geocoding API delivers this information for less than a Place Details (New) call.
- If users select an autocomplete prediction within an average of four Autocomplete (New) predictions requests or fewer, per-request pricing may be more cost-effective than per-session pricing.

For help selecting the Autocomplete (New) implementation that fits your needs, select the tab that corresponds to your answer to the following question.

**Does your application require any information other than the address and latitude/longitude of the selected prediction?**

### Yes, needs more details


**Use session-based Autocomplete (New) with Place Details (New).**   


Since your application requires Place Details (New), such as the place name, business status,
or opening hours, your implementation of Autocomplete (New) should use a session token
(programmatically or built into the
[JavaScript](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete#autocomplete-widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete#autocomplete-widget)
widgets)
[per session](https://developers.google.com/maps/documentation/javascript/session-pricing) plus applicable Places SKUs,
depending on which place data fields you request.^[1](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#fn1)^


**Widget implementation**   

Session management is automatically built into the

[JavaScript](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete#autocomplete-widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete#autocomplete-widget)

widgets. This includes both the Autocomplete (New) requests and the Place Details (New) request
on the selected prediction. Be sure to specify the `fields` parameter in order to
ensure you are only requesting the

Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields)

you need.


**Programmatic implementation**   

Use a

[session token](https://developers.google.com/maps/documentation/javascript/session-pricing)

with your Autocomplete (New) requests. When requesting Place Details (New) about the selected prediction, include the following parameters:

1. The place ID from [the Autocomplete (New) response](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#programmatic-response)
2. The session token used in the Autocomplete (New) request
3. The `fields` parameter specifying the Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields) you need

### No, needs only address and location


Geocoding API could be a more cost-effective option than Place Details (New) for your application, depending on the performance of your Autocomplete (New) usage. Every application's Autocomplete (New) efficiency varies depending on what users are entering, where the application is being used, and whether [performance optimization best practices](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#perf-best-practices) have been implemented.


In order to answer the following question, analyze how many characters a user types on average before selecting a Autocomplete (New) prediction in your application.


**Do your users select a Autocomplete (New) prediction in four or fewer requests, on average?**

### Yes


**Implement Autocomplete (New) programmatically without session tokens and call Geocoding API on the selected place prediction.**   

Geocoding API delivers addresses and latitude/longitude coordinates.
Making four

[Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku)

requests plus a [Geocoding API](https://developers.google.com/maps/billing-and-pricing/sku-details#geocoding)
call about the selected place prediction is less than the per-session Autocomplete (New)
cost per session.^[1](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#fn1)^


Consider employing [performance best practices](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#perf-best-practices) to help your users get the prediction they're looking for in even fewer characters.

### No


**Use session-based Autocomplete (New) with Place Details (New).**   

Since the average number of requests you expect to make before a user selects a
Autocomplete (New) prediction exceeds the cost of per-session pricing, your implementation
of Autocomplete (New) should use a session token for both the Autocomplete (New) requests
and the associated Place Details (New) request

[per session](https://developers.google.com/maps/documentation/javascript/session-pricing).

^[1](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#fn1)^


**Widget implementation**   

Session management is automatically built into the

[JavaScript](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete#autocomplete-widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete#autocomplete-widget)

widgets. This includes both the Autocomplete (New) requests and the Place Details (New)
request on the selected prediction. Be sure to specify the `fields` parameter
in order to ensure you are only requesting the fields you need.


**Programmatic implementation**   

Use a

[session token](https://developers.google.com/maps/documentation/javascript/session-pricing)

with your Autocomplete (New) requests.
When requesting Place Details (New) about the selected prediction,
include the following parameters:

1. The place ID from [the Autocomplete (New) response](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#programmatic-response)
2. The session token used in the Autocomplete (New) request
3. The `fields` parameter specifying fields such as address and geometry


**Consider delaying Autocomplete (New) requests**   

You can employ strategies such as delaying a Autocomplete (New) request until the user has typed in the first three or four characters so that your application makes fewer requests. For example, making Autocomplete (New) requests for each character *after* the user has typed the third character means that if the user types seven characters then selects a prediction for which you make one Geocoding API request, the total cost would be for 4 Autocomplete (New) Per Request + Geocoding.^[1](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#fn1)^


If delaying requests can get your average programmatic request below four, you can follow the guidance for [performant Autocomplete (New) with Geocoding API](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data?tab=Yes#select-location-only) implementation. Note that delaying requests can be perceived as latency by the user who might be expecting to see predictions with every new keystroke.


Consider employing [performance best practices](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#perf-best-practices) to help your users get the prediction they're looking for in fewer characters.

*** ** * ** ***

1. For costs, see [Google Maps Platform pricing lists](https://developers.google.com/maps/billing-and-pricing/pricing).

### Performance best practices

[Video](https://www.youtube.com/watch?v=bv1p4s_d8OM)

The following guidelines describe ways to optimize Autocomplete (New) performance:

- Add country restrictions, [location biasing](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#location_biasing), and (for programmatic implementations) language preference to your Autocomplete (New) implementation. Language preference is not needed with widgets since they pick language preferences from the user's browser or mobile device.
- If Autocomplete (New) is accompanied by a map, you can bias location by map viewport.
- In situations when a user does not choose one of the Autocomplete (New) predictions, generally because none of those predictions are the result-address wanted, you can reuse the original user input to attempt to get more relevant results:
  - If you expect the user to enter only address information, reuse the original user input in a call to the [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview).
  - If you expect the user to enter queries for a specific place by name or address, use a Place Details (New) request. If results are only expected in a specific region, use [location biasing](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#location_biasing).

  Other scenarios when it's best to fall back to the Geocoding API include:
  <!-- -->

  - Users inputting subpremise addresses, such as addresses for specific units or apartments within a building. For example, the Czech address "Stroupežnického 3191/17, Praha" yields a partial prediction in Autocomplete (New).
  - Users inputting addresses with road-segment prefixes like "23-30 29th St, Queens" in New York City or "47-380 Kamehameha Hwy, Kaneohe" on the island of Kauai in Hawai'i.

### Location biasing

Bias results to a specified area by passing a `location` parameter and a `radius`
parameter. This instructs Autocomplete (New) to *prefer* showing results
within the defined area. Results outside of the defined area may still be
displayed. You can use the `includedRegionCodes` parameter to filter results
to show only those places within a specified country.

> [!WARNING]
> **Warning:** If `radius` is not provided, the `location` parameter is ignored.

> [!TIP]
> Establishment results generally don't rank highly enough to show in results when the search area is large. If you want establishments to appear in mixed establishment/geocode results, you can specify a smaller radius. Alternatively, use `types=establishment` to restrict results to establishments only.

### Location restricting

Restrict results to a specified area by passing a `locationRestriction` parameter.

You may also restrict results to the region defined by `location`
and a `radius` parameter, by adding the

`locationRestriction`

parameter. This instructs Autocomplete (New) to return *only*
results within that region.

> [!NOTE]
> **Note:** Location restrictions are only applied to entire routes. Synthetic results located outside the location restriction may be returned based on a route that overlaps with the location restriction.