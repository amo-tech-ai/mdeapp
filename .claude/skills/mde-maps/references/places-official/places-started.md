 
This page shows you how to get an API key, enable the required APIs, and load the Places Library,
so that you can work with the Place class.

## Get an API key and enable the required APIs

Before using the Place class, you need to:

- Create a Cloud project with a billing account.
- Get an API key.
- Enable the following APIs:  
  - Maps JavaScript API
  - Places API
  - Places API (New) (required to use Text Search (New) and Place Autocomplete)

To learn more, see [Set up your Google Cloud project](https://developers.google.com/maps/documentation/javascript/cloud-setup).
[Get an API key](https://developers.google.com/maps/documentation/javascript/get-api-key)


[Enable Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com)

## Load the Places Library

To load the Places Library, first load the Maps JavaScript API, by adding the
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
from within an `async` function, as shown here:

```javascript
  const {Place} = await google.maps.importLibrary("places");
  
```

Your function can also load libraries without declaring a variable
for the needed classes:

```javascript
  async function initMap() {
    google.maps.importLibrary("places");
    ...
  }

  initMap();
  
```

Alternatively, you can load the libraries directly in HTML as shown here:

```javascript
  <script>
  google.maps.importLibrary("places");
  </script>
  
```


For more information about loading libraries, see
[Load the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api).

## Next steps

- [Search for places](https://developers.google.com/maps/documentation/javascript/place-search)
- [Get place details](https://developers.google.com/maps/documentation/javascript/place-details)
- [Use Place Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new)