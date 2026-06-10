---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: maps-javascript-load
title: Maps JavaScript API — Loading the API
description: "Dynamic import, script tag, and @googlemaps/js-api-loader loading patterns. Tertiary: verify against live developers.google.com."
---

This guide shows you how to load the Maps JavaScript API. There
are three ways to do this:

- Use [dynamic library import](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import)
- Use the [direct script loading tag](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#use-legacy-tag)
- Use the [NPM js-api-loader package](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#js-api-loader)

## Use Dynamic Library Import

Dynamic library import provides the capability to load libraries at runtime.
This lets you request needed libraries at the point when you need them, rather
than all at once at load time. It also protects your page from loading the
Maps JavaScript API multiple times.

Load the Maps JavaScript API by adding the inline bootstrap
loader to your application code, as shown in the following snippet:

```javascript
<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "YOUR_API_KEY",
    v: "weekly",
    // Use the 'v' parameter to indicate the https://developers.google.com/maps/documentation/javascript/versions to use (weekly, beta, alpha, etc.).
    // Add other https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters as needed, using camel case.
  });
</script>
```

You can also add the bootstrap loader code directly to your JavaScript code.

To load libraries at runtime, use the `await` operator to call `importLibrary()`
from within an `async` function. Declaring variables for the needed classes lets
you skip using a qualified path (e.g. `google.maps.Map`), as shown in the
following code example:


```javascript
async function init() {
    // Import the needed libraries.
    await google.maps.importLibrary('maps');

    // Access the map.
    const mapElement = document.querySelector('gmp-map');
    // Access the underlying map object.
    const innerMap = mapElement.innerMap;

    console.log({ mapElement, innerMap });
}

void init();
```

<br />

Your function can also load libraries without declaring a variable
for the needed classes, which is especially useful if you added a map using the
`gmp-map` element. Without the variable you must use qualified paths, for
example `google.maps.Map`:

```javascript
let map;
let center =  { lat: -34.397, lng: 150.644 };

async function initMap() {
  await google.maps.importLibrary("maps");
  await google.maps.importLibrary("marker");

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 8,
    mapId: "DEMO_MAP_ID",
  });

  addMarker();
}

async function addMarker() {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: center,
  });
}

initMap();
```

Alternatively, you can load the libraries directly in HTML as shown here:

```javascript
<script>
google.maps.importLibrary("maps");
google.maps.importLibrary("marker");
</script>
```

Learn how to [migrate to the Dynamic Library Loading API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#migrate-to-dynamic).

### Required parameters

- `key`: Your [API key](https://developers.google.com/maps/documentation/javascript/get-api-key). The Maps JavaScript API won't load unless a valid API key is specified.

### Optional parameters

- `v`: The [version](https://developers.google.com/maps/documentation/javascript/versions) of the
  Maps JavaScript API to load.

- `libraries`: An array of additional Maps JavaScript API
  [libraries](https://developers.google.com/maps/documentation/javascript/libraries) to begin preloading.
  Specifying a fixed set of libraries is not generally recommended, but is
  available for developers who want to finely tune the caching behavior on
  their website. It is still important to call `google.maps.importLibrary()`
  for each selected library prior to use.

- `language`: The [language](https://developers.google.com/maps/documentation/javascript/localization) to
  use. This affects the names of controls, copyright notices, driving
  directions, and control labels, and the responses to service requests. See the
  [list of supported languages](https://developers.google.com/maps/faq#languagesupport).

- `region`: The [region](https://developers.google.com/maps/documentation/javascript/localization#Region)
  code to use. This alters the API's behavior based on a given country or
  territory.

- `authReferrerPolicy`: Maps JS customers can configure HTTP Referrer
  Restrictions in the Cloud Console to limit which URLs are allowed to use a
  particular API Key. By default, these restrictions can be configured to allow
  only certain paths to use an API Key. If any URL on the same domain or origin
  may use the API Key, you can set `authReferrerPolicy: "origin"` to limit the
  amount of data sent when authorizing requests from the Maps JavaScript API.
  When this parameter is specified and HTTP Referrer Restrictions are enabled on
  Cloud Console, Maps JavaScript API will only be able to load if
  there is an [HTTP Referrer
  Restriction](https://developers.google.com/maps/api-security-best-practices#restricting-api-keys) that
  matches the current website's domain without a path specified.

- `mapIds`: An array of map IDs. Causes the configuration for the specified
  map IDs to be preloaded. Specifying map IDs here is not required for map IDs
  usage, but is available for developers who want to finely tune network
  performance.

- `channel`: See [Usage tracking per channel](https://developers.google.com/maps/reporting-and-monitoring/reporting#usage-tracking-per-channel).

## Use the direct script loading tag

This section shows how to use the direct script loading tag. Because the direct
script loads libraries when the map loads, it can simplify maps created using
a `gmp-map` element by removing the need to explicitly request libraries at
runtime. Since the direct script loading tag loads all requested libraries at
once when the script is loaded, performance may be impacted for some
applications. Only include the direct script loading tag once per page load.

> [!NOTE]
> **Note:** You can call `importLibrary` once the direct script loading tag has finished loading.

### Add a script tag

To load the Maps JavaScript API inline in an HTML file, add a
`script` tag as shown below.


```html
<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&callback=initMap">
</script>
```

<br />

### Direct script loading URL Parameters

This section discusses all of the parameters you can specify in the query
string of the script loading URL when loading the
Maps JavaScript API. Certain parameters are required while others
are optional. As is standard in
URLs, all parameters are separated using the ampersand (`&`) character.

The following example URL has placeholders for all possible parameters:

    https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
    &loading=async
    &callback=FUNCTION_NAME
    &v=VERSION
    &libraries="LIBRARIES"
    &language="LANGUAGE"
    &region="REGION"
    &auth_referrer_policy="AUTH_REFERRER_POLICY"
    &map_ids="MAP_IDS"
    &channel="CHANNEL"
    &solution_channel="SOLUTION_IDENTIFIER"

The URL in the following example `script` tag loads the
Maps JavaScript API:


```html
<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&callback=initMap">
</script>
```

<br />

#### Required parameters (direct) {:.hide-from-toc}

The following parameters are required when loading the
Maps JavaScript API.

- `key`: Your [API key](https://developers.google.com/maps/documentation/javascript/get-api-key). The Maps JavaScript API won't load unless a valid API key is specified.

#### Optional parameters (direct) {:.hide-from-toc}

Use these parameters to request a specific version of the
Maps JavaScript API, load additional libraries, localize your
map or specify the HTTP referrer check policy

- `loading`: The code loading strategy that the
  Maps JavaScript API can use. Set to `async` to indicate that
  the Maps JavaScript API has not been loaded synchronously and
  that no JavaScript code is triggered by the script's `load` event. It is
  highly recommended to set this to `async` whenever possible, for improved
  performance. (Use the `callback` parameter instead to perform actions when
  the Maps JavaScript API is available.) Available starting with
  version 3.55.

- `callback`: The name of a global function to be called once the
  Maps JavaScript API loads completely.

- `v`: The [version](https://developers.google.com/maps/documentation/javascript/versions) of the
  Maps JavaScript API to use.

- `libraries`: A comma-separated list of additional
  Maps JavaScript API
  [libraries](https://developers.google.com/maps/documentation/javascript/libraries) to load.

- `language`: The [language](https://developers.google.com/maps/documentation/javascript/localization) to
  use. This affects the names of controls, copyright notices, driving
  directions, and control labels, as well as the responses to service
  requests. See the [list of supported languages](https://developers.google.com/maps/faq#languagesupport).

- `region`: The [region](https://developers.google.com/maps/documentation/javascript/localization#Region)
  code to use. This alters the API's behavior based on a given country or
  territory.

- `auth_referrer_policy`: Customers can configure HTTP Referrer Restrictions
  in the Cloud Console to limit which URLs are allowed to use a particular
  API Key. By default, these restrictions can be configured to allow only
  certain paths to use an API Key. If any URL on the same domain or origin
  may use the API Key, you can set `auth_referrer_policy=origin` to limit
  the amount of data sent when authorizing requests from the Maps JavaScript
  API. This is available starting in version 3.46. When this parameter is
  specified and HTTP Referrer Restrictions are enabled on Cloud Console,
  Maps JavaScript API will only be able to load if there is an
  [HTTP Referrer Restriction](https://developers.google.com/maps/api-security-best-practices#restricting-api-keys)
  that matches the current website's domain without a path specified.

- `map_ids`: A comma-separated list of map IDs. Causes the configuration for
  the specified map IDs to be preloaded. Specifying map IDs here is not
  required for map IDs usage, but is available for developers who want to
  finely tune network performance.

- `channel`: See [Usage tracking per
  channel](https://developers.google.com/maps/reporting-and-monitoring/reporting#usage-tracking-per-channel).

## Use the NPM js-api-loader package

> [!TIP]
> **Tip:** The [v2.0.0](https://www.npmjs.com/package/@googlemaps/js-api-loader) release is a major refactor that replaces the old `Loader` class with an API consisting of two functions, `setOptions()` and `importLibrary()`. This shift provides you with on-demand dynamic loading of individual Maps API libraries, deferring feature downloads to improve initial page performance.

The [@googlemaps/js-api-loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)
package is available, for loading using the NPM package manager. Install it
using the following command:

```javascript
npm install @googlemaps/js-api-loader
```

Import the package as shown here:


### TypeScript

```typescript
// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
```

<br />

The loader uses Promises to make libraries available. Load libraries using
the `importLibrary()` method. The following example shows using the loader
to load a map:


### TypeScript

```typescript
// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = 'AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8';

async function init(): Promise<void> {
    // Set loader options.
    setOptions({
        key: API_KEY,
    });

    // Load the Maps library.
    const { Map } = await importLibrary('maps');

    // Set map options.
    const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 3,
    };

    // Declare the map.
    new Map(document.getElementById('map')!, mapOptions);
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = 'AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8';

async function init() {
    // Set loader options.
    setOptions({
        key: API_KEY,
    });

    // Load the Maps library.
    const { Map } = await importLibrary('maps');

    // Set map options.
    const mapOptions = {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 3,
    };

    // Declare the map.
    new Map(document.getElementById('map'), mapOptions);
}

void init();
```

<br />

[See the complete example code.](https://github.com/googlemaps-samples/js-api-samples/tree/main/samples/js-api-loader-map)

## Migrate to the Dynamic Library Import API

This section covers the steps required to migrate your integration to use
the Dynamic Library Import API.

### Migration steps

First, replace the direct script loading tag with the inline bootstrap loader
tag.

#### Before


```html
<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=maps&callback=initMap">
</script>
```

<br />

#### After

```javascript
<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "YOUR_API_KEY",
    v: "weekly",
    // Use the 'v' parameter to indicate the https://developers.google.com/maps/documentation/javascript/versions to use (weekly, beta, alpha, etc.).
    // Add other https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters as needed, using camel case.
  });
</script>
```

Next, update your application code:

- Change your `initMap()` function to be asynchronous.
- Call `importLibrary()` to load and access the libraries you need.

#### Before

```javascript
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

window.initMap = initMap;
```

#### After

```javascript
let map;
// initMap is now async
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}

initMap();
```