---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-get-started
description: "Places API (New) — getting started pointers. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/basic-place-autocomplete-ui-kit "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/basic-place-autocomplete-ui-kit "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/basic-autocomplete "View this page for the JavaScript platform docs.")

This page shows you how to get an API key, enable the Places UI Kit, and load the libraries that support it.

## Get an API key and enable the Places UI Kit

Before using the Places UI Kit, you need to:

- Create a Cloud project with a billing account.
- Enable the Places UI Kit.
- Get an API key.

To learn more, see [Set up your Google Cloud project](https://developers.google.com/maps/documentation/javascript/cloud-setup).


[Enable Places UI Kit](https://console.cloud.google.com/apis/library/placewidgets.googleapis.com?utm_source=Docs_EnableAPIs&utm_content=Docs_placewidgets&ref=https://developers.google.com/maps/documentation/javascript/places-ui-kit/get-started)

[Get an API key](https://console.cloud.google.com/project/_/google/maps-apis/credentials?utm_source=Docs_CreateAPIKey&utm_content=Docs_placewidgets&ref=https://developers.google.com/maps/documentation/javascript/places-ui-kit/get-started)

> [!TIP]
> You can also [get a Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key) and try the Places UI Kit at no cost.

## Load the required libraries

To load the libraries that support the Places UI Kit, first load the Maps JavaScript API by adding the
inline bootstrap loader to your application code, as shown in the following snippet:

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

Next, use the `await` operator to call `importLibrary()`
from within an `async` function, as follows:

```javascript
  // Import the Places Library for PlaceDetailsElement and PlaceSearchElement
  const {PlaceDetailsElement, PlaceSearchElement} = await google.maps.importLibrary('places');
  
```

[Learn more about loading the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api).

## Next steps

- [Display place details](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details)
- [Display search results](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list)