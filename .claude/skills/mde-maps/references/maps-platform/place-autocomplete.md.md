---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: place-autocomplete-javascript
title: Places Library (JavaScript) — Autocomplete (legacy / migration notes)
description: "Client-side Place Autocomplete; legacy status and migration pointers. Tertiary: verify against live developers.google.com."
---

> [!NOTE]
> This product or feature is in Legacy status. For more information about the Legacy stage and how to migrate from Legacy to newer services, see [Legacy products and features](https://developers.google.com/maps/legacy).

**European Economic Area (EEA) developers**

> [!NOTE]
> If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

**Note: Server-side
libraries**

This page describes the client-side library available with
the Maps JavaScript API. If you want to work with the
Places API web service on your server, take a look at the
[Node.js Client for Google Maps Services](https://developers.google.com/maps/web-services/client-library). The page at
that link also introduces the Java Client,
Python Client and Go Client for Google Maps Services.

## Introduction

Autocomplete is a feature of the Places library in the
Maps JavaScript API. You can use autocomplete to give your
applications the type-ahead-search behavior of the Google Maps search field.
The autocomplete service can match on full words and substrings, resolving
place names, addresses, and [plus
codes](https://plus.codes). Applications can therefore send queries as the user types, to
provide on-the-fly place predictions. As defined by the Places API,
a 'place' can be an establishment, a geographic location, or a prominent
point of interest.

## Getting started

Before using the Places library in the Maps JavaScript API, first verify
that the Places API is enabled in the Google Cloud console, in the same
project you set up for the Maps JavaScript API.

To view your list of enabled APIs:

1. Go to the [Google Cloud console](https://console.cloud.google.com/project/_/apiui/apis/enabled?utm_source=Docs_EnabledAPIsView).
2. Click the **Select a project** button, then select the same project you set up for the Maps JavaScript API and click **Open**.
3. From the list of APIs on the **Dashboard** , look for **Places API**.
4. If you see the API in the list, you're all set. However, this project is in Legacy status. For more information about the Legacy stage and how to migrate from Legacy to newer services, see [Legacy products and features](https://developers.google.com/maps/legacy). An exception is available for the [Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete#add-autocomplete) and [SearchBox](https://developers.google.com/maps/documentation/javascript/place-autocomplete#places-searchbox) widgets, which are not yet available as a GA product on the Places API (New).

#### Load the library

The Places service is a self-contained library, separate from the main
Maps JavaScript API code. To use the features contained
within this library, you must first load it using the `libraries`
parameter in the Maps API bootstrap URL:

```html
<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=places&callback=initMap">
</script>
```

See the [Libraries Overview](https://developers.google.com/maps/documentation/javascript/libraries) for more information.

## Summary of classes

The API offers two types of autocomplete widgets, which you can add using
the `Autocomplete` and `SearchBox` classes respectively.
In addition, you can use the `AutocompleteService` class to retrieve
autocomplete results programmatically (see the Maps JavaScript API Reference:
[AutocompleteService class](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service)).

Below is a summary of the classes available:

- [`Autocomplete`](https://developers.google.com/maps/documentation/javascript/reference#Autocomplete) adds a text input field to your web page, and monitors that field for character entries. As the user enters text, autocomplete returns place predictions in the form of a drop-down list. When the user selects a place from the list, information about the place is returned to the autocomplete object, and can be retrieved by your application. See the details [below](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#add-autocomplete). ![An autocomplete text field, and the pick list of place
  predictions supplied as the user enters the search query.](https://developers.google.com/static/maps/documentation/javascript/images/places-autocomplete-suggest.png) Figure 1: Autocomplete text field and pick list ![A completed address form.](https://developers.google.com/static/maps/documentation/javascript/images/places-autocomplete-filled.png) Figure 2: Completed address form
- [`SearchBox`](https://developers.google.com/maps/documentation/javascript/reference#SearchBox) adds a text input field to your web page, in much the same way as `Autocomplete`. The differences are as follows:
  - The main difference lies in the results that appear in the pick list. `SearchBox` supplies an extended list of predictions, which can include places (as defined by the Places API) plus suggested search terms. For example, if the user enters 'pizza in new', the pick list may include the phrase 'pizza in New York, NY' as well as the names of various pizza outlets.
  - `SearchBox` offers fewer options than `Autocomplete` for restricting the search. In the former, you can bias the search towards a given `LatLngBounds`. In the latter, you can restrict the search to a particular country and particular place types, as well as setting the bounds. For more information, see [below](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#places-searchbox).

  ![A completed address form.](https://developers.google.com/static/maps/documentation/javascript/images/places-searchbox.png) Figure 3: A SearchBox presents search terms and place predictions. See the details [below](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#places-searchbox).
- You can create an [`AutocompleteService`](https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService) object to retrieve predictions programmatically. Call `getPlacePredictions()` to retrieve matching places, or call `getQueryPredictions()` to retrieve matching places plus suggested search terms. Note: `AutocompleteService` does not add any UI controls. Instead, the above methods return an array of prediction objects. Each prediction object contains the text of the prediction, as well as reference information and details of how the result matches the user input. See the details [below](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#place_autocomplete_service).

## Add an Autocomplete widget

> [!CAUTION]
> **Important:** Using this widget requires [enabling the
> Places API (Legacy) on your project](https://console.cloud.google.com/apis/library/places-backend.googleapis.com). The Places (New) service offers an [equivalent widget](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new) which is available in Preview.

[Video](https://www.youtube.com/watch?v=c3MjU9E9buQ)

The [`Autocomplete`](https://developers.google.com/maps/documentation/javascript/reference#Autocomplete)
widget creates a text input field on your web page, supplies predictions of places in a UI pick
list, and returns place details in response to a `getPlace()` request. Each entry in the
pick list corresponds to a single place (as defined by the Places API).

The `Autocomplete` constructor takes two arguments:

- An HTML `input` element of type `text`. This is the input field that the autocomplete service will monitor and attach its results to.
- An optional [`AutocompleteOptions`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions) argument, which can contain the following properties:
  - An array of data `fields` to be included in the `Place Details` response for the user's selected `PlaceResult`. If the property is not set or if `['ALL']` is passed in, all available fields are returned and [billed for](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing#autocomplete) (this is not recommended for production deployments). For a list of fields, see [`PlaceResult`](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult).
  - An array of `types` that specifies an explicit type or a type collection, as listed in the [supported types](https://developers.google.com/maps/documentation/javascript/supported_types#table3). If no type is specified, all types are returned.
  - `bounds` is a `google.maps.LatLngBounds` object specifying the area in which to search for places. The results are biased towards, but not restricted to, places contained within these bounds.
  - `strictBounds` is a `boolean` specifying whether the API must return only those places that are strictly within the region defined by the given `bounds`. The API does not return results outside this region even if they match the user input.

    > [!NOTE]
    > **Note:** Location restrict is only applied to entire routes, synthetic results located outside the location restrict may be returned based on a route that overlaps with the location restrict.

  - `componentRestrictions` can be used to restrict results to specific groups. You can use `componentRestrictions` to filter by up to 5 countries. Countries must be passed as as a two-character, ISO 3166-1 Alpha-2 compatible country code. Multiple countries must be passed as a list of country codes.

    **Note:** If you receive unexpected results with a country code, verify
    that you are using a code which includes the countries, dependent territories, and special
    areas of geographical interest you intend. You can find code information at
    [Wikipedia: List of ISO
    3166 country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) or the [ISO Online Browsing
    Platform](https://www.iso.org/obp/ui/#search).
  - `placeIdOnly` can be used to instruct the `Autocomplete` widget to retrieve only Place IDs. On calling `getPlace()` on the `Autocomplete` object, the `PlaceResult` made available will only have the `place id`, `types` and `name` properties set. You can use the returned place ID with calls to the Places, Geocoding, Directions or Distance Matrix services.

    > [!NOTE]
    > **Note:** The `name` property will contain the `description` from Places Autocomplete predictions. You can read more about the `description` in the [`AutocompleteService` documentation](https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service).

    > [!WARNING]
    > **Notice:** `placeIdOnly` is deprecated as of
    > January 15, 2019, and will be turned off on January 15, 2020. Use the
    > `fields` array in the
    > `
    > https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.fields
    > ` interface instead:
    > `fields: ['place_id', 'name', 'types']`.

### Constrain Autocomplete predictions

By default, Place Autocomplete presents all place types, biased for predictions near the
user's location, and fetches all available data fields for the user's selected place. Set Place
Autocomplete options to present more relevant predictions based on
your use case.

#### Set options at construction

The `Autocomplete` constructor accepts an `AutocompleteOptions`
parameter to set constraints at widget creation. The following example sets the
`bounds`, `componentRestrictions`, and `types` options to
request `establishment` type places, favoring those within the specified geographic
area and restricting predictions to only places within the United States. Setting the
`fields` option specifies what information to return about the user's selected place.


Call `setOptions()` to change an option's value for an existing widget.

### TypeScript

```typescript
const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};
const input = document.getElementById("pac-input") as HTMLInputElement;
const options = {
  bounds: defaultBounds,
  componentRestrictions: { country: "us" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
};

const autocomplete = new google.maps.places.Autocomplete(input, options);
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};
const input = document.getElementById("pac-input");
const options = {
  bounds: defaultBounds,
  componentRestrictions: { country: "us" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
};
const autocomplete = new google.maps.places.Autocomplete(input, options);
```

#### Specify data fields

Specify data fields to avoid being billed for [Places Data SKUs](https://developers.google.com/maps/documentation/places/web-service/usage-and-
billing#autocomplete) you don't need. Include the `fields` property in the
`AutocompleteOptions` that are passed to the widget constructor, as demonstrated in the previous
example, or call `setFields()` on an existing `Autocomplete` object.

```javascript
autocomplete.setFields(["place_id", "geometry", "name"]);
```

#### Define biases and search-area boundaries for
Autocomplete

You can bias the autocomplete results to favor an approximate
location or area, in the following ways:

- Set the bounds on creation of the `Autocomplete` object.
- Change the bounds on an existing `Autocomplete`.
- Set the bounds to the map's viewport.
- Restrict the search to the bounds.
- Restrict the search to a specific country.

The previous example demonstrates setting bounds at creation. The following examples demonstrate the other biasing techniques.

> [!NOTE]
> **Note:** If you don't supply any bounds or a map viewport, the API will attempt to detect the user's location from their IP address, and will bias the results to that location. Set a bounds whenever possible. Otherwise, different users may receive different predictions. Also, to generally improve predictions it is important to provide a sensible viewport such as one that you set by panning or zooming on the map, or a developer-set viewport based on device location and radius. When a radius is not available, 5 km is considered a sensible default for Place Autocomplete. Don't set a viewport with zero radius (a single point), a viewport that is only a few meters across (less than 100 m.), or a viewport that spans the globe.

##### Change the bounds of an existing Autocomplete

Call `setBounds()` to change the search area on an existing
`Autocomplete` to rectangular bounds.

### TypeScript

```typescript
const southwest = { lat: 5.6108, lng: 136.589326 };
const northeast = { lat: 61.179287, lng: 2.64325 };
const newBounds = new google.maps.LatLngBounds(southwest, northeast);

autocomplete.setBounds(newBounds);
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
const southwest = { lat: 5.6108, lng: 136.589326 };
const northeast = { lat: 61.179287, lng: 2.64325 };
const newBounds = new google.maps.LatLngBounds(southwest, northeast);

autocomplete.setBounds(newBounds);
```

##### Set the bounds to the map's viewport

Use `bindTo()` to bias the results to the map's viewport,
even while that viewport changes.

### TypeScript

```typescript
autocomplete.bindTo("bounds", map);
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
autocomplete.bindTo("bounds", map);
```

Use `unbind()` to unbind the Autocomplete predictions from the map's viewport.

### TypeScript

```typescript
autocomplete.unbind("bounds");
autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
autocomplete.unbind("bounds");
autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
```


[View example](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete)

##### Restrict the search to the current bounds

Set the `strictBounds` option to restrict the results to the current bounds, whether based on map viewport or rectangular bounds.

```javascript
autocomplete.setOptions({ strictBounds: true });
```

##### Restrict predictions to a specific country

Use the `componentRestrictions` option or call `setComponentRestrictions()` to restrict the
autocomplete search to a specific set of up to five countries.

### TypeScript

```typescript
autocomplete.setComponentRestrictions({
  country: ["us", "pr", "vi", "gu", "mp"],
});
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
autocomplete.setComponentRestrictions({
  country: ["us", "pr", "vi", "gu", "mp"],
});
```

[View example](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-multiple-countries)

#### Constrain place types

Use the `types` option or call `setTypes()` to constrain
predictions to certain place types. This constraint specifies a type or a type collection,
as listed in [Place Types](https://developers.google.com/maps/documentation/javascript/supported_types).
If no constraint is specified, all types are returned.

For the value of the `types` option or the value passed to `setTypes()`, you
can specify either:

- An array containing up to five values from [Table 1](https://developers.google.com/maps/documentation/javascript/supported_types#table1)
  or [Table 2](https://developers.google.com/maps/documentation/javascript/supported_types#table2) from
  [Place Types](https://developers.google.com/maps/documentation/javascript/supported_types). For example:

  ```javascript
  types: ['hospital', 'pharmacy', 'bakery', 'country']
  ```

  Or:

  ```javascript
  autocomplete.setTypes(['hospital', 'pharmacy', 'bakery', 'country']);
  ```
- Any one filter in [Table 3](https://developers.google.com/maps/documentation/javascript/supported_types#table3) from [Place Types](https://developers.google.com/maps/documentation/javascript/supported_types). You can only specify a single value from Table 3.

The request will be rejected if:

- You specify more than five types.
- You specify any unrecognized types.
- You mix any types from [Table 1](https://developers.google.com/maps/documentation/javascript/supported_types#table1) or [Table 2](https://developers.google.com/maps/documentation/javascript/supported_types#table2) with any filter from [Table 3](https://developers.google.com/maps/documentation/javascript/supported_types#table3).

The Places Autocomplete demo demonstrates the differences in predictions between different place types.

[Visit demo](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete)

### Getting place information

When a user selects a place from the predictions attached to the autocomplete
text field, the service fires a `place_changed` event. To get place
details:

1. Create an event handler for the `place_changed` event, and call [`addListener()`](https://developers.google.com/maps/documentation/javascript/reference/event#MVCObject.addListener) on the `Autocomplete` object to add the handler.
2. Call [`Autocomplete.getPlace()`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.getPlace) on the `Autocomplete` object, to retrieve a [`PlaceResult`](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult) object, which you can then use to get more information about the selected place.

By default, when a user selects a place, autocomplete returns all of the
available data fields for the selected place, and you will be [billed accordingly](https://developers.google.com/maps/billing/understanding-cost-of-use#places-details).
Use [`Autocomplete.setFields()`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.setFields)
to specify which place data fields to return. Read more about the
[`PlaceResult`](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult) object, including a list of place data fields that
you can request. To avoid paying for data that you don't need, be sure to use `Autocomplete.setFields()` to specify
only the place data that you will use.

> [!WARNING]
> **IMPORTANT:** It is not recommended to use autocomplete to refresh Place IDs, since each session will result in a charge. Instead, call [`getDetails()`](https://developers.google.com/maps/documentation/javascript/places#place_details_requests) and specify only the `place_id` field.

The `name` property contains the
`description` from Places Autocomplete predictions. You can read more about the
`description` in the
[Places
Autocomplete documentation](https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service).
[Video](https://www.youtube.com/watch?v=cJjUALvnpCU)

For address forms, it is useful to get the address in structured format. To
return the structured address for the selected place, call
[`Autocomplete.setFields()`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.setFields)
and specify the `address_components` field.

The following example uses autocomplete to fill the fields in an address
form.

### TypeScript

```typescript
function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address1 = "";
  let postcode = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }

      case "locality":
        (document.querySelector("#locality") as HTMLInputElement).value =
          component.long_name;
        break;

      case "administrative_area_level_1": {
        (document.querySelector("#state") as HTMLInputElement).value =
          component.short_name;
        break;
      }

      case "country":
        (document.querySelector("#country") as HTMLInputElement).value =
          component.long_name;
        break;
    }
  }

  address1Field.value = address1;
  postalField.value = postcode;

  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2Field.focus();
}
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address1 = "";
  let postcode = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        document.querySelector("#locality").value = component.long_name;
        break;
      case "administrative_area_level_1": {
        document.querySelector("#state").value = component.short_name;
        break;
      }
      case "country":
        document.querySelector("#country").value = component.long_name;
        break;
    }
  }

  address1Field.value = address1;
  postalField.value = postcode;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2Field.focus();
}

window.initAutocomplete = initAutocomplete;
```


[View example](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform)

> [!NOTE]
> The `street_number` address component may not be present in Place Details responses for place IDs in some autocomplete predictions. This typically happens when the address cannot be interpolated for a place. In these cases, the prediction's `types` array will contain "route". For autocomplete predictions with a number in the description (input query is matched), the Place Details response for the place ID contains the street number only if the `types` array for the prediction contains at least one of:
>
> - street_address
> - premise
> - establishment

### Customize placeholder text

By default, the text field created by the autocomplete service contains
standard placeholder text. To modify the text, set the
`placeholder` attribute on the `input` element:

```
<input id="searchTextField" type="text" size="50" placeholder="Anything you want!">
```

Note: The default placeholder text is localized automatically. If you
specify your own placeholder value, you must handle the localization of that
value in your application. For information on how the Google Maps
JavaScript API chooses the language to use, read the documentation on
[localization](https://developers.google.com/maps/documentation/javascript/localization).

See [Styling the Autocomplete and SearchBox widgets](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#style-autocomplete) to customize the widget appearance.

## Add a SearchBox widget

> [!CAUTION]
> **Important:** Using this widget requires [enabling the
> Places API (Legacy) on your project](https://console.cloud.google.com/apis/library/places-backend.googleapis.com). The Places (New) service offers an [equivalent widget](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new) which is available in preview.

> [!WARNING]
> By default, when a user selects a place, SearchBox returns all of the available data fields for the selected place, and you will be [billed accordingly](https://developers.google.com/maps/billing/understanding-cost-of-use#places-details). There is no way to constrain SearchBox requests to only return specific fields. To keep from requesting (and paying for) data that you don't need, use the [Autocomplete widget](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#add-autocomplete) instead.

The [`SearchBox`](https://developers.google.com/maps/documentation/javascript/reference#SearchBox) allows users to perform a text-based geographic
search, such as 'pizza in New York' or 'shoe stores near robson street'.
You can attach the `SearchBox` to a text field and, as
text is entered, the service will return predictions in the
form of a drop-down pick list.

`SearchBox` supplies an extended list of predictions, which
can include places (as defined by the Places API) plus suggested search
terms. For example, if the user enters 'pizza in new', the pick list may
include the phrase 'pizza in New York, NY' as well as the names of various
pizza outlets. When a user selects a place from the list,
information about that place is returned to the SearchBox object, and can be
retrieved by your application.

> [!NOTE]
> **Note:** When you display predictions from the Google Places search box, you must include the 'powered by Google' logo. This logo is included in the results list by default, for your convenience.

The `SearchBox` constructor takes two arguments:

- An HTML `input` element of type `text`. This is the input field that the `SearchBox` service will monitor and attach its results to.
- An `options` argument, which can contain the `bounds` property: `bounds` is a `google.maps.LatLngBounds` object specifying the area in which to search for places. The results are biased towards, but not restricted to, places contained within these bounds.

The following code uses the bounds parameter to bias the results
towards places within a particular geographic area, specified using
laitude/longitude coordinates.

```javascript
var defaultBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(-33.8902, 151.1759),
  new google.maps.LatLng(-33.8474, 151.2631));

var input = document.getElementById('searchTextField');

var searchBox = new google.maps.places.SearchBox(input, {
  bounds: defaultBounds
});
```

### Change the search area for SearchBox

To change the search area for an existing `SearchBox`, call
`setBounds()` on the `SearchBox` object and pass the
relevant `LatLngBounds` object.

[View example](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox)

### Getting place information

When the user selects an item from the predictions attached to the search
box, the service fires a `places_changed` event. You can
call `getPlaces()` on the `SearchBox` object, to
retrieve an array containing several predictions, each of which is a
`PlaceResult` object.

For more information about the `PlaceResult` object, refer to
the documentation on
[place detail results](https://developers.google.com/maps/documentation/javascript/places#place_details_results).

### TypeScript

```typescript
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener("places_changed", () => {
  const places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  const bounds = new google.maps.LatLngBounds();

  places.forEach((place) => {
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    const icon = {
      url: place.icon as string,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    // Create a marker for each place.
    markers.push(
      new google.maps.Marker({
        map,
        icon,
        title: place.name,
        position: place.geometry.location,
      })
    );

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener("places_changed", () => {
  const places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  const bounds = new google.maps.LatLngBounds();

  places.forEach((place) => {
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    const icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    // Create a marker for each place.
    markers.push(
      new google.maps.Marker({
        map,
        icon,
        title: place.name,
        position: place.geometry.location,
      }),
    );
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});
```

[View example](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox)

See [Styling the Autocomplete and SearchBox widgets](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#style-autocomplete) to customize the widget appearance.

## Programmatically retrieving Place Autocomplete Service predictions

To retrieve predictions programmatically, use the
[`AutocompleteService`](https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService) class. `AutocompleteService`
does not add any UI controls. Instead, it returns an array of prediction
objects, each containing the text of the prediction, reference information,
and details of how the result matches the user input.
This is useful if you want more control over the user interface than is
offered by the `Autocomplete` and `SearchBox`
described above.

`AutocompleteService` exposes the following methods:

- `getPlacePredictions()` returns place predictions. Note: A 'place' can be an establishment, geographic location, or prominent point of interest, as defined by the Places API.
- `getQueryPredictions()` returns an extended list of predictions, which can include places (as defined by the Places API) plus suggested search terms. For example, if the user enters 'pizza in new', the pick list may include the phrase 'pizza in New York, NY' as well as the names of various pizza outlets.

Both of the above methods return an array of
[prediction
objects](https://developers.google.com/maps/documentation/javascript/reference#AutocompletePrediction) of the following form:

- `description` is the matched prediction.
- `distance_meters` is the distance in meters of the place from the specified `AutocompletionRequest.origin`.
- `matched_substrings` contains a set of substrings in the description that match elements in the user's input. This is useful for highlighting those substrings in your application. In many cases, the query will appear as a substring of the description field.
  - `length` is the length of the substring.
  - `offset` is the character offset, measured from the beginning of the description string, at which the matched substring appears.
- `place_id` is a textual identifier that uniquely identifies a place. To retrieve information about the place, pass this identifier in the `placeId` field of a [Place Details
  request](https://developers.google.com/maps/documentation/javascript/places#place_details). Learn more about how to [reference a place
  with a place ID](https://developers.google.com/maps/documentation/javascript/places#placeid).
- `terms` is an array containing elements of the query. For a place, each element will typically make up a portion of the address.
  - `offset` is the character offset, measured from the beginning of the description string, at which the matched substring appears.
  - `value` is the matching term.

The example below executes a query prediction request for the phrase
'pizza near' and displays the result in a list.

### TypeScript

```typescript
// This example retrieves autocomplete predictions programmatically from the
// autocomplete service, and displays them as an HTML list.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initService(): void {
  const displaySuggestions = function (
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    predictions.forEach((prediction) => {
      const li = document.createElement("li");

      li.appendChild(document.createTextNode(prediction.description));
      (document.getElementById("results") as HTMLUListElement).appendChild(li);
    });
  };

  const service = new google.maps.places.AutocompleteService();

  service.getQueryPredictions({ input: "pizza near Syd" }, displaySuggestions);
}

declare global {
  interface Window {
    initService: () => void;
  }
}
window.initService = initService;
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// This example retrieves autocomplete predictions programmatically from the
// autocomplete service, and displays them as an HTML list.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initService() {
  const displaySuggestions = function (predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    predictions.forEach((prediction) => {
      const li = document.createElement("li");

      li.appendChild(document.createTextNode(prediction.description));
      document.getElementById("results").appendChild(li);
    });
  };

  const service = new google.maps.places.AutocompleteService();

  service.getQueryPredictions({ input: "pizza near Syd" }, displaySuggestions);
}

window.initService = initService;
```

> [!NOTE]
> **Note:** The JavaScript is compiled from the TypeScript snippet.

### CSS

```css

```

### HTML

```html
<html>
  <head>
    <title>Retrieving Autocomplete Predictions</title>

    <link rel="stylesheet" type="text/css" href="./style.css" />
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <p>Query suggestions for 'pizza near Syd':</p>
    <ul id="results"></ul>
    <!-- Replace Powered By Google image src with self hosted image. https://developers.google.com/maps/documentation/places/web-service/policies#other_attribution_requirements -->
    <img
      class="powered-by-google"
      src="https://storage.googleapis.com/geo-devrel-public-buckets/powered_by_google_on_white.png"
      alt="Powered by Google"
    />

    <!-- 
      The `defer` attribute causes the script to execute after the full HTML
      document has been parsed. For non-blocking uses, avoiding race conditions,
      and consistent behavior across browsers, consider loading using Promises. See
      https://developers.google.com/maps/documentation/javascript/load-maps-js-api
      for more information.
      -->
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initService&libraries=places&v=weekly"
      defer
    ></script>
  </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps/js-samples/tree/master/dist/samples/places-queryprediction/jsfiddle) [Google Cloud Shell](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/googlemaps/js-samples&cloudshell_git_branch=sample-places-queryprediction&cloudshell_tutorial=cloud_shell_instructions.md&cloudshell_workspace=.)

[View example](https://developers.google.com/maps/documentation/javascript/examples/places-queryprediction)

### Session tokens

> [!TIP]
> **Tip:** If your app is using the [Autocomplete Widget](https://developers.google.com/maps/documentation/javascript/places-autocomplete#summary-of-classes) you don't need to implement sessions, as the widget handles sessions automatically in the background.

[`AutocompleteService.getPlacePredictions()`](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteService.getPlacePredictions)
can use session tokens *(if implemented)* to group together autocomplete requests for billing
purposes. Session tokens group the query and selection phases of a user
autocomplete search into a discrete session for billing purposes. The session
begins when the user starts typing a query, and concludes when they select a
place. Each session can have multiple queries, followed by one place selection.
Once a session has concluded, the token is no longer valid. Your app must
generate a fresh token for each session. We recommend using session tokens for
all autocomplete sessions. If the `sessionToken` parameter is
omitted, or if you reuse a session token, the session is charged as if no
session token was provided (each request is billed separately).

You can use the same session token to make a single
[Place Details](https://developers.google.com/maps/documentation/javascript/places#place_details)
request on the place that results from a call to `AutocompleteService.getPlacePredictions()`.
In this case, the autocomplete request is combined with the Place Details
request, and the call is charged as a regular Place Details request. There is no charge for the
autocomplete request.

Be sure to pass a unique session token for each new session. Using the same token for more than
one Autocomplete session will invalidate those Autocomplete sessions, and all Autocomplete request
in the invalid sessions will be charged individually using [Autocomplete
Per Request SKU](https://developers.google.com/maps/billing-and-pricing/sku-details#ac-per-request-ess-sku). [Read more about session tokens](https://developers.google.com/maps/documentation/places/web-service/session-tokens).

The following example shows creating a session token, then passing it in an
`AutocompleteService` (the `displaySuggestions()`
function has been omitted for brevity):

```javascript
// Create a new session token.
var sessionToken = new google.maps.places.AutocompleteSessionToken();

// Pass the token to the autocomplete service.
var autocompleteService = new google.maps.places.AutocompleteService();
autocompleteService.getPlacePredictions({
  input: 'pizza near Syd',
  sessionToken: sessionToken
},
displaySuggestions);
```

Be sure to pass a unique session token for each new session. Using the same
token for more than one session will result in each request being billed
individually.

[Read more about session tokens](https://developers.google.com/maps/documentation/places/web-service/session-tokens).

## Styling the Autocomplete and SearchBox widgets

By default, the UI elements provided by `Autocomplete` and
`SearchBox` are styled for inclusion on a Google map. You may want
to adjust the styling to suit your own site. The following CSS classes are
available. All classes listed below apply to both the
`Autocomplete` and the `SearchBox` widgets.
![A graphical illustration of the CSS classes for the Autocomplete and
SearchBox widgets](https://developers.google.com/static/maps/documentation/javascript/images/place-autocomplete-css-diagram.png) CSS classes for Autocomplete and SearchBox widgets

| CSS class | Description |
|---|---|
| `pac-container` | The visual element containing the list of predictions returned by the Place Autocomplete service. This list appears as a drop-down list below the `Autocomplete` or `SearchBox` widget. |
| `pac-icon` | The icon displayed to the left of each item in the list of predictions. |
| `pac-item` | An item in the list of predictions supplied by the `Autocomplete` or `SearchBox` widget. |
| `pac-item:hover` | The item when the user hovers their mouse pointer over it. |
| `pac-item-selected` | The item when the user selects it using the keyboard. Note: Selected items will be a member of this class and of the `pac-item` class. |
| `pac-item-query` | A span inside a `pac-item` that is the main part of the prediction. For geographic locations, this contains a place name, like 'Sydney', or a street name and number, like '10 King Street'. For text-based searches such as 'pizza in New York', it contains the full text of the query. By default, the `pac-item-query` is colored black. If there is any additional text in the `pac-item`, it is outside `pac-item-query` and inherits its styling from `pac-item`. It is colored gray by default. The additional text is typically an address. |
| `pac-matched` | The part of the returned prediction that matches the user's input. By default, this matched text is highlighted in bold text. Note that the matched text may be anywhere within `pac-item`. It is not necessarily part of `pac-item-query`, and it could be partly within `pac-item-query` as well as partly in the remaining text in `pac-item`. |

## Place Autocomplete (Legacy) optimization

This section describes best practices to help you make the most of the
Place Autocomplete (Legacy) service.

Here are some general guidelines:

- The quickest way to develop a working user interface is to use the Maps JavaScript API [Place Autocomplete (Legacy) widget](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add-autocomplete), Places SDK for Android [Place Autocomplete (Legacy) widget](https://developers.google.com/maps/documentation/places/android-sdk/autocomplete#add_an_autocomplete_widget), or Places SDK for iOS [Place Autocomplete (Legacy) UI control](https://developers.google.com/maps/documentation/places/ios-sdk/autocomplete#adding_an_autocomplete_ui_control).
- Understand essential Place Autocomplete (Legacy) [data fields](https://developers.google.com/maps/documentation/javascript/legacy/place-data-fields) from the start.
- Location biasing and location restriction fields are optional but can have a significant impact on autocomplete performance.
- Use error handling to make sure your app degrades gracefully if the API returns an error.
- Make sure your app handles when there is no selection and offers users a way to continue.

### Cost optimization best practices

#### Basic cost optimization

[Video](https://www.youtube.com/watch?v=VOP8cvCLGac)

To optimize the cost of using the Place Autocomplete (Legacy)
service, use field masks in Place Details (Legacy) and Place Autocomplete (Legacy) widgets to return only the

Place Autocomplete (Legacy) [data fields](https://developers.google.com/maps/documentation/javascript/legacy/place-data-fields)

you need.

#### Advanced cost optimization

Consider programmatic implementation of Place Autocomplete (Legacy) in order to access

[SKU: Autocomplete - Per Request pricing](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-per-request-legacy-ess-sku)

and request [Geocoding API results](https://developers.google.com/maps/documentation/geocoding/overview#results) about the selected place instead of Place Details (Legacy). Per-request pricing paired with Geocoding API is more cost-effective than per-session (session-based) pricing if both of the following conditions are met:

- If you only need the latitude/longitude or address of the user's selected place, the Geocoding API delivers this information for less than a Place Details (Legacy) call.
- If users select an autocomplete prediction within an average of four Place Autocomplete (Legacy) predictions requests or fewer, per-request pricing may be more cost-effective than per-session pricing.

For help selecting the Place Autocomplete (Legacy) implementation that fits your needs, select the tab that corresponds to your answer to the following question.

**Does your application require any information other than the address and latitude/longitude of the selected prediction?**

### Yes, needs more details


**Use session-based Place Autocomplete (Legacy) with Place Details (Legacy).**   


Since your application requires Place Details (Legacy), such as the place name, business status,
or opening hours, your implementation of Place Autocomplete (Legacy) should use a session token
([programmatically](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#sessiontoken) or built into the
[JavaScript](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add-autocomplete),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/autocomplete#add_an_autocomplete_widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/autocomplete#adding_an_autocomplete_ui_control)
widgets) [per session](https://developers.google.com/maps/billing-and-pricing/sku-details#about-autocomplete-sessions)
plus applicable [Places Data SKUs](https://developers.google.com/maps/billing-and-pricing/sku-details#data-skus),
depending on which place data fields you request.^[1](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#fn1)^


**Widget implementation**   

Session management is automatically built into the

[JavaScript](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add-autocomplete),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/autocomplete#add_an_autocomplete_widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/autocomplete#adding_an_autocomplete_ui_control)

widgets. This includes both the Place Autocomplete (Legacy) requests and the Place Details (Legacy) request
on the selected prediction. Be sure to specify the `fields` parameter in order to
ensure you are only requesting the

Place Autocomplete (Legacy) [data fields](https://developers.google.com/maps/documentation/javascript/legacy/place-data-fields)

you need.


**Programmatic implementation**   

Use a

[session token](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#sessiontoken)

with your Place Autocomplete (Legacy) requests. When requesting Place Details (Legacy) about the selected prediction, include the following parameters:

1. The place ID from [the Place Autocomplete (Legacy) response](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#programmatic-response)
2. The session token used in the Place Autocomplete (Legacy) request
3. The `fields` parameter specifying the Place Autocomplete (Legacy) [data fields](https://developers.google.com/maps/documentation/javascript/legacy/place-data-fields) you need

### No, needs only address and location


Geocoding API could be a more cost-effective option than Place Details (Legacy) for your application, depending on the performance of your Place Autocomplete (Legacy) usage. Every application's Place Autocomplete (Legacy) efficiency varies depending on what users are entering, where the application is being used, and whether [performance optimization best practices](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#perf-best-practices) have been implemented.


In order to answer the following question, analyze how many characters a user types on average before selecting a Place Autocomplete (Legacy) prediction in your application.


**Do your users select a Place Autocomplete (Legacy) prediction in four or fewer requests, on average?**

### Yes


**Implement Place Autocomplete (Legacy) programmatically without session tokens and call Geocoding API on the selected place prediction.**   

Geocoding API delivers addresses and latitude/longitude coordinates.
Making four

[Autocomplete - Per Request](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-per-request-legacy-ess-sku)

requests plus a [Geocoding API](https://developers.google.com/maps/billing-and-pricing/sku-details#geocoding)
call about the selected place prediction is less than the per-session Place Autocomplete (Legacy)
cost per session.^[1](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#fn1)^


Consider employing [performance best practices](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#perf-best-practices) to help your users get the prediction they're looking for in even fewer characters.

### No


**Use session-based Place Autocomplete (Legacy) with Place Details (Legacy).**   

Since the average number of requests you expect to make before a user selects a
Place Autocomplete (Legacy) prediction exceeds the cost of per-session pricing, your implementation
of Place Autocomplete (Legacy) should use a session token for both the Place Autocomplete (Legacy) requests
and the associated Place Details (Legacy) request

[per session](https://developers.google.com/maps/billing-and-pricing/sku-details#about-autocomplete-sessions).

^[1](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#fn1)^


**Widget implementation**   

Session management is automatically built into the

[JavaScript](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add-autocomplete),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/autocomplete#add_an_autocomplete_widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/autocomplete#adding_an_autocomplete_ui_control)

widgets. This includes both the Place Autocomplete (Legacy) requests and the Place Details (Legacy)
request on the selected prediction. Be sure to specify the `fields` parameter
in order to ensure you are only requesting the fields you need.


**Programmatic implementation**   

Use a

[session token](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#sessiontoken)

with your Place Autocomplete (Legacy) requests.
When requesting Place Details (Legacy) about the selected prediction,
include the following parameters:

1. The place ID from [the Place Autocomplete (Legacy) response](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#programmatic-response)
2. The session token used in the Place Autocomplete (Legacy) request
3. The `fields` parameter specifying [Basic Data](https://developers.google.com/maps/billing-and-pricing/sku-details#data-skus) fields such as address and geometry


**Consider delaying Place Autocomplete (Legacy) requests**   

You can employ strategies such as delaying a Place Autocomplete (Legacy) request until the user has typed in the first three or four characters so that your application makes fewer requests. For example, making Place Autocomplete (Legacy) requests for each character *after* the user has typed the third character means that if the user types seven characters then selects a prediction for which you make one Geocoding API request, the total cost would be for 4 Place Autocomplete (Legacy) Per Request + Geocoding.^[1](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#fn1)^


If delaying requests can get your average programmatic request below four, you can follow the guidance for [performant Place Autocomplete (Legacy) with Geocoding API](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete?tab=Yes#select-location-only) implementation. Note that delaying requests can be perceived as latency by the user who might be expecting to see predictions with every new keystroke.


Consider employing [performance best practices](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#perf-best-practices) to help your users get the prediction they're looking for in fewer characters.

*** ** * ** ***

1. For costs, see [Google Maps Platform pricing lists](https://developers.google.com/maps/billing-and-pricing/pricing).

### Performance best practices

[Video](https://www.youtube.com/watch?v=bv1p4s_d8OM)

The following guidelines describe ways to optimize Place Autocomplete (Legacy) performance:

- Add country restrictions, [location biasing](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#location_biasing), and (for programmatic implementations) language preference to your Place Autocomplete (Legacy) implementation. Language preference is not needed with widgets since they pick language preferences from the user's browser or mobile device.
- If Place Autocomplete (Legacy) is accompanied by a map, you can bias location by map viewport.
- In situations when a user does not choose one of the Place Autocomplete (Legacy) predictions, generally because none of those predictions are the result-address wanted, you can reuse the original user input to attempt to get more relevant results:
  - If you expect the user to enter only address information, reuse the original user input in a call to the [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview).
  - If you expect the user to enter queries for a specific place by name or address, use a Place Details (Legacy) request. If results are only expected in a specific region, use [location biasing](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete#location_biasing).

  Other scenarios when it's best to fall back to the Geocoding API include:
  <!-- -->

  - Users inputting subpremise addresses, such as addresses for specific units or apartments within a building. For example, the Czech address "Stroupežnického 3191/17, Praha" yields a partial prediction in Place Autocomplete (Legacy).
  - Users inputting addresses with road-segment prefixes like "23-30 29th St, Queens" in New York City or "47-380 Kamehameha Hwy, Kaneohe" on the island of Kauai in Hawai'i.

### Location biasing

Bias results to a specified area by passing a `location` parameter and a `radius`
parameter. This instructs Place Autocomplete (Legacy) to *prefer* showing results
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

`strictbounds`

parameter. This instructs Place Autocomplete (Legacy) to return *only*
results within that region.

> [!NOTE]
> **Note:** Location restrictions are only applied to entire routes. Synthetic results located outside the location restriction may be returned based on a route that overlaps with the location restriction.

## Usage limits

### Quotas

For quota and pricing information, see the [Usage and Billing documentation](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing) for the Places API.