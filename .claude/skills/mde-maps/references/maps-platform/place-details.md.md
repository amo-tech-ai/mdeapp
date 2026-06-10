---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: place-object-javascript
title: Places Library (JavaScript) — Place object / details
description: "Constructing Place from ID or resource name; Place Details in JS. Tertiary: verify against live developers.google.com."
---

## Place object

The `Place` object, which contains information about a place, is dynamically returned
by Text Search, Nearby Search, and Place Autocomplete. You can also create a `Place`
object from a place ID or resource name (the resource name is the place ID prefixed with
`places/`). The following snippet shows creating a `Place` object using a
place ID:

```javascript
// Use a place ID to create a new Place instance.
const place = new Place({
    id: 'ChIJyYB_SZVU2YARR-I1Jjf08F0', // San Diego Zoo
});
```

You can also create a `Place` object from a place resource name:

```javascript
// Use a place resource name to create a new Place instance.
const place = new Place({
  resourceName: 'places/ChIJyYB_SZVU2YARR-I1JRF08F0', // San Diego Zoo
});
```

For more information, see [PlaceOptions](https://developers.google.com/maps/documentation/javascript/reference/place#PlaceOptions).

## Fetch fields

If you have an existing `Place` object, or a place ID or resource name, use the
`Place.fetchFields()` method to get details about that place. Provide a comma-separated
list of [place data fields](https://developers.google.com/maps/documentation/javascript/place-class-data-fields) to
return; specify field names in camel case. Use the returned `Place` object to get data
for the requested fields.


The following example uses a place ID to create a new `Place`, calls `Place.fetchFields()`
requesting the `displayName` and `formattedAddress` fields, and adds a
marker to the map.
<iframe src="https://maps-docs-team.web.app/samples/place-class/dist/" allow="fullscreen; fullscreen"></iframe>

### TypeScript

```typescript
async function getPlaceDetails() {
    const [{ Place }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
    ]);

    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJyYB_SZVU2YARR-I1Jjf08F0', // San Diego Zoo
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'location',
            'googleMapsURI',
        ],
    });

    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    // Assemble the info window content.
    const content = document.createElement('div');
    const address = document.createElement('div');
    const placeId = document.createElement('div');
    address.textContent = place.formattedAddress || '';
    placeId.textContent = place.id;
    content.append(placeId, address);

    if (place.googleMapsURI) {
        const link = document.createElement('a');
        link.href = place.googleMapsURI;
        link.target = '_blank';
        link.textContent = 'View Details on Google Maps';
        content.appendChild(link);
    }

    // Display an info window.
    infoWindow.setHeaderContent(place.displayName);
    infoWindow.setContent(content);
    infoWindow.open({
        anchor: marker,
    });
}
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function getPlaceDetails() {
    const [{ Place }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('places'),
        google.maps.importLibrary('marker'),
    ]);

    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJyYB_SZVU2YARR-I1Jjf08F0', // San Diego Zoo
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'location',
            'googleMapsURI',
        ],
    });

    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    // Assemble the info window content.
    const content = document.createElement('div');
    const address = document.createElement('div');
    const placeId = document.createElement('div');
    address.textContent = place.formattedAddress || '';
    placeId.textContent = place.id;
    content.append(placeId, address);

    if (place.googleMapsURI) {
        const link = document.createElement('a');
        link.href = place.googleMapsURI;
        link.target = '_blank';
        link.textContent = 'View Details on Google Maps';
        content.appendChild(link);
    }

    // Display an info window.
    infoWindow.setHeaderContent(place.displayName);
    infoWindow.setContent(content);
    infoWindow.open({
        anchor: marker,
    });
}
```
Note that `Map` and `Place` have been declared prior to this function:

```javascript
const { Map } = await google.maps.importLibrary("maps");
const { Place } = await google.maps.importLibrary("places");
```
[See the complete example](https://developers.google.com/maps/documentation/javascript/examples/place-class)