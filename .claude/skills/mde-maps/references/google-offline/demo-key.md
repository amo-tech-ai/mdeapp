---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: demo-key
description: "Offline Google Maps Platform doc export (demo-key). Tertiary: verify against live developers.google.com and curated references/*.md."
---

The Maps Demo Key is a no-cost feature that lets you start prototyping
with Google Maps Platform without entering billing
information. Validate and see your
ideas in action before committing to a paid account.
This page explains how the Maps Demo Key works, quotas, what features you can use, and
how to get and use your key.
[<button type="button" class="button button-primary gc-analytics-event" data-category="GMP Demo Key" data-action="getDemoKey" data-label="intro"> Get a Demo Key </button>](https://console.cloud.google.com/google/maps-hosted/tos?ref=https://developers.google.com/maps/) **Note:** The Maps Demo Key is technically an API key that supports a limited
set of features. It is intended for testing and prototyping purposes only,
and is not designed for production use. It is also subject to the
[Maps Demo Project Terms of Service](https://cloud.google.com/terms/maps-platform/demo-project-terms).

## Which features can I use with the Maps Demo Key?


The Maps Demo Key supports a limited set of features from the Maps JavaScript API, the Weather API,
and Maps Grounding Lite.

To use any API or feature not listed below, you
need to either [add a billing account to your Maps Demo Key](https://console.cloud.google.com/google/maps-apis/discover;setup=gmpDemo?project=%3Cdemo_project_id%3E&ref=https://developers.google.com/maps/) or
[create a new API key and enable billing](https://console.cloud.google.com/google/maps-apis/onboard;setup=gmpDemo?project=%3Cdemo_project_id%3E&ref=https://developers.google.com/maps/).
For more information, see

[Get Started with Google Maps Platform](https://developers.google.com/maps/get-started).

### Supported Maps JavaScript API features

### ✔ Supported features

- Map Rendering Load 2D/3D maps with satellite and terrain views.
- Markers \& Events Add markers, info windows, and handle user clicks.
- Map Styling Apply custom themes and JSON styles to your map.
- Places UI Kit Prebuilt components for place search and details.
- Drawing Tools Draw shapes and polylines to visualize data.

### ✘ Unsupported features

- Places API (New) Programmatic search methods like searchByText.
- Routes \& Navigation Directions service and Distance Matrix API.
- Address Validation High-accuracy address correction services.


In addition to the features listed above, you can also use the Maps Demo Key with
the Weather API and Maps Grounding Lite.

### Maps Demo Key quotas

The Maps Demo Key is subject to the usage limits, which are subject to change. If you reach
the daily limit, your usage is paused until the following day with no risk of
charges.

## How to use the Maps Demo Key

|---|---|---|
| [<button>1. Get your Maps Demo Key</button>](https://developers.google.com/maps/demo-key#get-demo-key) |   | [<button>2. Use your Maps Demo Key</button>](https://developers.google.com/maps/demo-key#use-demo-key) |

### Step 1: Get
your Maps Demo Key

To generate your key, make sure you're signed in with your Google Account and click the
**Get a Demo Key** button.
After accepting the Maps Demo Key terms, your key will be displayed and will be ready to use right
away.

You'll also receive an email with instructions for how to
retrieve your key from the Google Cloud console.
[<button type="button" class="button button-primary gc-analytics-event" data-category="GMP Demo Key" data-action="getDemoKey" data-label="Step 1"> Get a Demo Key </button>](https://console.cloud.google.com/google/maps-hosted/tos?ref=https://developers.google.com/maps/)

### Step 2: Use your Maps Demo Key with Google Maps Platform

The Maps Demo Key is technically an API key that supports a limited set of features. You
can use your Maps Demo Key in place of a standard API key in any of the
[supported Maps JavaScript API features or the Weather API](https://developers.google.com/maps/demo-key#supported-features).
The following example demonstrates using the Maps Demo Key with a basic map.
Replace `YOUR_DEMO_KEY` with the key you just retrieved.

```
<html>
<head>
  <title>Add a Map using HTML</title>
  <link rel="stylesheet" href="./style.css" />
  <script type="module" src="./index.js"></script>
</head>
<body>
  <gmp-map
    center="38.7946,-106.5348"
    zoom="4"
    map-id="DEMO_MAP_ID"
    style="height: 400px"
  >
  </gmp-map>
  <!--
    The `defer` attribute causes the script to execute after the full HTML
    document has been parsed. -->
  <script
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_DEMO_KEY&libraries=maps"
    defer
  ></script>
</body>
</html>
```

## Next steps

- **Explore:** Check out the documentation and try more of the features supported by the Maps Demo Key: [Maps Grounding Lite](https://developers.google.com/maps/ai/grounding-lite), [Add a Google Map to a Web Page](https://developers.google.com/maps/documentation/javascript/add-google-map), [3D Maps](https://developers.google.com/maps/documentation/javascript/3d/overview), [Markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/overview), [Events](https://developers.google.com/maps/documentation/javascript/events), [Places UI Kit for JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview), [Drawing on the Map](https://developers.google.com/maps/documentation/javascript/overlays), and the [Weather API](https://developers.google.com/maps/documentation/weather/overview).
- **Retrieve:** You can retrieve your existing key through the Google Cloud Console.
- **Upgrade:** When you are ready for to move your code to a production environment, you can either [add a billing account to your Maps Demo Key](https://console.cloud.google.com/google/maps-apis/discover;setup=gmpDemo?project=%3Cdemo_project_id%3E&ref=https://developers.google.com/maps/) or [create a new API key and enable billing](https://console.cloud.google.com/google/maps-apis/onboard;setup=gmpDemo?project=%3Cdemo_project_id%3E&ref=https://developers.google.com/maps/). For more information, see [Get Started with Google Maps Platform](https://developers.google.com/maps/get-started) .