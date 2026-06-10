---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: maps-js-promises
title: Maps JavaScript API — Promises (async/await)
description: "Which Maps JavaScript API services return Promises vs callbacks; Places legacy exceptions. Tertiary: verify against live developers.google.com."
---

Asynchronous methods throughout Google Maps JavaScript API return
[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## Support

| API | Methods return Promises |
|---|---|
| [Directions](https://developers.google.com/maps/documentation/javascript/directions) | Yes |
| [Distance Matrix](https://developers.google.com/maps/documentation/javascript/reference/distance-matrix "Reference documentation for Distance Matrix service") | Yes |
| [Elevation](https://developers.google.com/maps/documentation/javascript/reference/elevation "Reference documentation for Elevation service") | Yes |
| [Geocoder](https://developers.google.com/maps/documentation/javascript/reference/geocoder "Reference documentation for Geocoder service") | Yes |
| [Maximum Zoom Imagery](https://developers.google.com/maps/documentation/javascript/reference/max-zoom "Reference documentation for MaxZoom service") | Yes |
| Places | No |
| [Places AutocompleteService](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteService "Reference documentation for Places Autocomplete service") | Partial^[1](https://developers.google.com/maps/documentation/javascript/promises#fn1)^ |
| [Streetview](https://developers.google.com/maps/documentation/javascript/reference/street-view "Reference documentation for StreetView service") | Yes |

> [!NOTE]
> **Note:** Starting in 2020, new APIs only support Promises.

## Usage

[Video](https://www.youtube.com/watch?v=_cLiUJol8ak)

See this
[guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_Promises)
on using Promises or the examples below for making asynchronous method calls
with Google Maps JavaScript API.

### Async and await

The
[await operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
is used to wait for a Promise. It can only be used inside an async function.

    const app = async () => {
      const elevationService = google.maps.ElevationService();
      const locations = [{lat: 27.986065, lng:86.922623}];

      const response = await elevationService.getElevationForLocation({locations});
      console.log(response.results);
    };

    app();

### Then, catch, and finally

The
[Promise object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Instance_methods)
has `then`, `catch`, and `finally` methods that take callback functions.

    const elevationService = google.maps.ElevationService();
    const locations = [{lat: 27.986065, lng:86.922623}];

    const promise = elevationService.getElevationForLocation({locations});

    promise
        .then((response) => {
          console.log(response.results);
        })
        .catch((error) => {
          console.log(error);
        });
        .finally(() => {
          console.log('done');
        });

## Async callback pattern

The
[callback pattern](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing#Async_callbacks)
is still valid and supported.

    const elevationService = google.maps.ElevationService();
    const locations = [{lat: 27.986065, lng:86.922623}];

    const callback = (results, status) => {
      if (status === 'OK') {
        console.log(results);
      } else {
        // handle this case
      }
    };

    elevationService.getElevationForLocation({locations}, callback);

> [!NOTE]
> **Note:** Starting in 2020, new APIs only support Promises.

*** ** * ** ***

1. Currently Promises are only supported in `getPlacePredictions()`. [↩](https://developers.google.com/maps/documentation/javascript/promises#fnref1)