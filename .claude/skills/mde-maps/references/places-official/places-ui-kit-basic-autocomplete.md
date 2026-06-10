---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-ui-kit-basic-autocomplete
description: "Maps JavaScript — Places UI Kit basic autocomplete element. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/basic-place-autocomplete-ui-kit "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/basic-place-autocomplete-ui-kit "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/basic-autocomplete "View this page for the JavaScript platform docs.") <iframe src="https://maps-docs-team.web.app/samples/place-autocomplete-basic-map/dist/" allow="fullscreen; fullscreen"></iframe>

The
[`BasicPlaceAutocompleteElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#BasicPlaceAutocompleteElement) creates a text input field, supplies place
predictions in a UI pick list, and returns a place ID for the selected place.


The Basic Place Autocomplete element is simpler to implement than the
[`PlaceAutocompleteElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceAutocompleteElement), and it differs in the following ways:

- The Basic Place Autocomplete element returns a [Place object](https://developers.google.com/maps/documentation/javascript/place) containing only the [place
  ID](https://developers.google.com/maps/documentation/places/web-service/place-id), rather than a [`PlacePrediction`](https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#PlacePrediction) object. You can use the returned place ID directly with a [Places UI Kit Details](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details) element to get additional place details, whereas a `PlacePrediction` object would first require conversion to a place ID.
- The Basic Place Autocomplete element does not require you to enable the Places API in Google Cloud Console.
- The Basic Place Autocomplete element clears the input field when a user selects a place prediction.

### Prerequisites

To use the Basic Place Autocomplete element, you must enable the Places UI Kit on your Google
Cloud project. See [Get started](https://developers.google.com/maps/documentation/javascript/places-ui-kit/get-started) for details.

> [!TIP]
> **Note:** The Basic Place Autocomplete element is billed using the [SKU: Places UI Kit - Autocomplete per Session](https://developers.google.com/maps/billing-and-pricing/sku-details#places_ui-kit-auto-ess-sku), **not** the standard [Autocomplete request](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku) or [Autocomplete session](https://developers.google.com/maps/billing-and-pricing/sku-details#autocomplete-session-new-ess-sku) SKUs.

## Add a Basic Place Autocomplete element

This section shows you how to add a Basic Autocomplete element to a web page or map.

### Add a Basic Autocomplete element to a web page

To add the BasicAutocomplete element to a web page, create a new
`google.maps.places.BasicPlaceAutocompleteElement`, and append it to
the page as shown in the following example:

```javascript
// Request needed libraries.
const {BasicPlaceAutocompleteElement} = await google.maps.importLibrary('places');
// Create the input HTML element and append it.
const placeAutocomplete = new BasicPlaceAutocompleteElement();
document.body.appendChild(placeAutocomplete);
```

### Add a Basic Autocomplete element to a map

To add a Basic Autocomplete element to a map, append a
`BasicPlaceAutocompleteElement` to a `gmp-map` element and set its position
using the `slot` attribute,
as shown in the following example:

```html
<gmp-map
    zoom="12"
    center="37.4220656,-122.0840897"
    map-id="DEMO_MAP_ID">
    <gmp-basic-place-autocomplete
        slot="control-inline-start-block-start"></gmp-basic-place-autocomplete>
</gmp-map>
```

> [!NOTE]
> **Note:** The [map ID](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over) attribute allows map styling and configuration settings to be stored in Google Cloud, and is required for this example. The ID `DEMO_MAP_ID` can be used for testing and does not need to be enabled in Cloud.

### Constrain Autocomplete predictions

By default, Basic Place Autocomplete presents all place types, biased for predictions near the
user's location. Set
[`BasicPlaceAutocompleteElementOptions`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#BasicPlaceAutocompleteElementOptions) to present more relevant predictions
by restricting or biasing results.

Restricting results causes the Basic Autocomplete element to ignore any results that are outside the
restriction area. A common practice is to restrict results to the map bounds. Biasing results
makes the BasicAutocomplete element show results within the specified area, but some matches may be
outside of that area.

If you don't supply any bounds or a map viewport, the API will attempt to detect the user's
location from their IP address, and will bias the results to that location. Set bounds whenever
possible. Otherwise, different users may receive different predictions. Also, to generally improve
predictions it is important to provide a sensible viewport, such as one that you set by panning or
zooming on the map, or a developer-set viewport based on device location and radius. When a radius
is not available, 5km is considered a sensible default for the Basic Place Autocomplete element.
Don't set a viewport with zero radius (a single point), a viewport that is only a few meters
across (less than 100m.), or a viewport that spans the globe.

#### Restrict place search by country

To restrict place search to one or more specific countries, use the
`includedRegionCodes`
property to specify the country code(s) as shown in the following snippet:

```javascript
const pac = new google.maps.places.BasicPlaceAutocompleteElement({
  includedRegionCodes: ['us', 'au'],
});
```

#### Restrict place search to map bounds

To restrict place search to a map's bounds, use the `locationRestrictions`
property to add the bounds, as shown in the following snippet:

```javascript
const pac = new google.maps.places.BasicPlaceAutocompleteElement({
  locationRestriction: map.getBounds(),
});
```

When restricting to map bounds, be sure to add a listener to update the bounds when they
change:

```javascript
map.addListener('bounds_changed', () => {
  autocomplete.locationRestriction = map.getBounds();
});
```

To remove the `locationRestriction`, set it to `null`.

#### Bias place search results

Bias place search results to a circle area by using the `locationBias` property, and
passing a radius, as shown here:

```javascript
const autocomplete = new google.maps.places.BasicPlaceAutocompleteElement({
  locationBias: {radius: 100, center: {lat: 50.064192, lng: -130.605469}},
});
```

To remove the `locationBias`, set it to `null`.

#### Restrict place search results to certain types

Restrict place search results to certain types of places by using the
`includedPrimaryTypes` property, and specifying one or more types, as shown here:

```javascript
const autocomplete = new google.maps.places.BasicPlaceAutocompleteElement({
  includedPrimaryTypes: ['establishment'],
});
```

For a complete list of supported types, see
[Place type tables A and B](https://developers.google.com/maps/documentation/places/web-service/place-types).

## Configure the Place Request element

Add a listener to update the Place Request element when the user selects a prediction:

```javascript
// Event listener for when a place is selected from the autocomplete list.
placeAutocompleteElement.addEventListener('gmp-select', (event) => {
    // Reset marker and InfoWindow, and prepare the details element.
    placeDetailsParent.appendChild(placeDetailsElement);
    placeDetailsElement.style.display = 'block';
    advancedMarkerElement.position = null;
    infoWindow.close();

    // Request details for the selected place.
    const placeDetailsRequest = placeDetailsElement.querySelector(
        'gmp-place-details-place-request'
    );
    placeDetailsRequest.place = event.place.id;
});
```

This example shows you how to add a Basic Autocomplete element to a Google map.
<iframe src="https://maps-docs-team.web.app/samples/place-autocomplete-basic-map/dist/" allow="fullscreen; fullscreen"></iframe>

### JavaScript

```javascript
const placeAutocompleteElement = document.querySelector(
    'gmp-basic-place-autocomplete'
);
const placeDetailsElement = document.querySelector('gmp-place-details-compact');
const placeDetailsParent = placeDetailsElement.parentElement;
const gmpMapElement = document.querySelector('gmp-map');

async function init() {
    // Asynchronously load required libraries from the Google Maps JS API.
    const [{ AdvancedMarkerElement }, { InfoWindow, Circle }, { Size }] =
        await Promise.all([
            google.maps.importLibrary('marker'),
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('core'),
            google.maps.importLibrary('places'),
        ]);

    // Get the initial center directly from the gmp-map element's property.
    const center = gmpMapElement.center;

    // Set the initial location bias for the autocomplete element.
    placeAutocompleteElement.locationBias = center;

    // Update the map object with specified options.
    const map = gmpMapElement.innerMap;
    map.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Create an advanced marker to show the location of a selected place.
    const advancedMarkerElement = new AdvancedMarkerElement({
        map,
        collisionBehavior: 'REQUIRED_AND_HIDES_OPTIONAL',
    });

    // Create an InfoWindow to hold the place details component.
    const infoWindow = new InfoWindow({
        minWidth: 360,
        disableAutoPan: true,
        headerDisabled: true,
        pixelOffset: new Size(0, -10),
    });

    // Event listener for when a place is selected from the autocomplete list.
    placeAutocompleteElement.addEventListener('gmp-select', (event) => {
        // Reset marker and InfoWindow, and prepare the details element.
        placeDetailsParent.appendChild(placeDetailsElement);
        placeDetailsElement.style.display = 'block';
        advancedMarkerElement.position = null;
        infoWindow.close();

        // Request details for the selected place.
        const placeDetailsRequest = placeDetailsElement.querySelector(
            'gmp-place-details-place-request'
        );
        placeDetailsRequest.place = event.place.id;
    });

    // Event listener for when the place details have finished loading.
    placeDetailsElement.addEventListener('gmp-load', () => {
        const location = placeDetailsElement.place?.location;
        if (!location) {
            advancedMarkerElement.position = null;
            return;
        }

        // Position the marker and open the InfoWindow at the place's location.
        advancedMarkerElement.position = location;
        infoWindow.setContent(placeDetailsElement);
        infoWindow.open({
            map,
            anchor: advancedMarkerElement,
        });
        map.setCenter(location);
    });

    // Event listener to close the InfoWindow when the map is clicked.
    map.addListener('click', () => {
        infoWindow.close();
        advancedMarkerElement.position = null;
    });

    // Event listener for when the map finishes moving (panning or zooming).
    map.addListener('idle', () => {
        const newCenter = map.getCenter();

        // Update the autocomplete's location bias to a 10km radius around the new map center.
        placeAutocompleteElement.locationBias = new Circle({
            center: newCenter,
            radius: 10000, // 10km in meters.
        });
    });
}

void init();
```

### CSS

```css
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}

gmp-map {
    height: 100%;
}

gmp-basic-place-autocomplete {
    position: absolute;
    height: 30px;
    width: 500px;
    top: 10px;
    left: 10px;
    box-shadow: 4px 4px 5px 0px rgba(0, 0, 0, 0.2);
    color-scheme: light;
    border-radius: 10px;
}
```

### HTML

```html
<html>
    <head>
        <title>Basic Place Autocomplete map</title>

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
            zoom="12"
            center="37.4220656,-122.0840897"
            map-id="DEMO_MAP_ID">
            <gmp-basic-place-autocomplete
                slot="control-inline-start-block-start"></gmp-basic-place-autocomplete>
        </gmp-map>
        <!-- Use inline styles to configure the Place Details Compact element because
     it will be placed within the info window, and info window content is inside 
     the shadow DOM when using <gmp-map> -->
        <gmp-place-details-compact
            orientation="horizontal"
            style="
                width: 400px;
                display: none;
                border: none;
                padding: 0;
                margin: 0;
                background-color: transparent;
                color-scheme: light;
            ">
            <gmp-place-details-place-request></gmp-place-details-place-request>
            <gmp-place-standard-content></gmp-place-standard-content>
        </gmp-place-details-compact>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-autocomplete-basic-map/jsfiddle)