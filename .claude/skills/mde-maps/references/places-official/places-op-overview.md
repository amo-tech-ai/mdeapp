---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-api-new-op-overview
description: "Places API (New) — overview of Text Search, Nearby, Details, Photos, Autocomplete. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

**European Economic Area (EEA) developers**

> [!NOTE]
> If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

## Introduction

The Places API (New) includes the following APIs:

- [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview#place_details_api)
- [Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview#place_photo_api)
- [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview#text_search_and_nearby_search)
- [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview#text_search_and_nearby_search)
- [Autocomplete (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview#place_autocomplete)

This document contains an overview of these new APIs.

## Place Details (New)

A [place ID](https://developers.google.com/maps/documentation/places/web-service/place-id) uniquely identifies a place in the Google Places database and on
Google Maps. With a place ID, you can request details about a particular
establishment or point of interest by initiating a
[Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details) request. A Place Details (New) request
returns comprehensive information about the indicated place such as its complete
address, phone number, user rating, and reviews.

> [!NOTE]
> **Note:** You can get the same details about a place from Place Details (New) that you can also get from Text Search (New) or Nearby Search (New). However, if you already have the place ID of a location, calling Place Details (New) is less expensive than calling one of the search APIs.

There are many ways to obtain a place ID. You can use:

- [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [Routes API](https://developers.google.com/maps/documentation/routes)
- [Address Validation API](https://developers.google.com/maps/documentation/address-validation)
- [Autocomplete (New)](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete)

## Place Photos (New)

[Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/place-photos) lets you add high quality photographic content to
your application by giving you access to the millions of photos stored in the
Google Places database. Using the Place Photos (New) API, you can access
the photos and resize the image to the optimal size for your application.

All requests to the Place Photos (New) API must include a photo resource
name, which uniquely identifies the photo to return. You can obtain the photo
resource name by using:

- [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search)

To include the photo resource name in the response from a
Place Details (New), Text Search (New), or Nearby Search (New)
request, make sure that you include the `photos` field in the field mask of the
request.

## Text Search (New) and Nearby Search (New)

The Places API includes two search APIs:

- [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)

  Lets you specify a text string on which to search for a place. For example:
  "Spicy Vegetarian Food in Sydney, Australia" or "Fine seafood dining near
  Palo Alto, CA".

  You can refine the search by specifying details such as price levels,
  current opening status, ratings, or specific place types. You can also
  specify to bias the results to a specific location, or restrict the search
  to a specific location.
- [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search)

  Lets you specify a region to search along with a list of place types.
  Specify the region as a circle defined by the latitude and longitude
  coordinates of the center point and radius in meters.

  Specify one or more place types that define the characteristics of the
  place. For example, specify "`pizza_restaurant`" and "`shopping_mall`" to
  search for a pizza restaurant located in a shopping mall in the specified
  region.

The main difference between the two searches is that Text Search (New)
lets you specify an arbitrary search string while Nearby Search (New)
requires a specific area in which to search.

## Autocomplete (New) and session tokens

[Autocomplete (New)](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete) is a web service that returns place predictions
and query predictions in response to an HTTP request. In the request, specify a
text search string and geographic bounds that controls the search area.

Session tokens are user-generated strings that track Autocomplete (New)
calls as sessions. Autocomplete (New) uses session tokens to group the
query and selection phases of a user autocomplete search into a discrete session
for billing purposes.

## New fields, attributes, and accessibility options

The Places API (New) includes new fields, attributes, and accessibility
options to provide users with more information about a place. These aspects are
described in the following sections.

### Fields

The Places API (New) includes several new fields:

| Field | Description |
|---|---|
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#openinghours` | Describes particular times for certain operations. Secondary opening hours are different from a business's main hours. For example, a restaurant can specify drive through hours or delivery hours as its secondary hours. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#paymentoptions` | Payment options the place accepts. A place can accept more than one payment option. If payment option data is not available, the payment option field will be unset. Options include the following: - Credit card - Debit card - Cash only - NFC payment |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#parkingoptions` | Parking options provided by the place. Options include the following: - Free parking lots - Paid parking lots - Free street parking - Valet parking - Free garage parking - Paid garage parking |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#subdestination` | Unique places that are related to a particular place. For example, airport terminals are considered sub-destinations of an airport. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#fueloptions` | The most recent information about fuel options available at a gas station. This information is updated regularly. Options include the following: - Diesel - Regular unleaded - Midgrade - Premium - SP91 - SP91 E10 - SP92 - SP95 E10 - SP98 - SP99 - SP100 - LPG - E80 - E85 - Methane - Biodiesel - Truck diesel |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#evchargeoptions` | Number of electric vehicle (EV) chargers at this station. While some EV chargers have multiple connectors, each charger can only charge one vehicle at a time; as a result, this field reflects the number of available EV chargers at a given time. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | A short, human-readable address for a place. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | The primary type of the given result. For example, a place may be classified as a `cafe` or an `airport`. A place can only have a single primary type. For the complete list of possible values, see [Supported types](https://developers.google.com/maps/documentation/places/web-service/place-types). |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | The display name of the primary type, localized to the request language if applicable. For the complete list of possible values, see [Supported types](https://developers.google.com/maps/documentation/places/web-service/place-types). |

### Attributes

The Places API (New) includes several new attributes:

| Attribute | Description |
|---|---|
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place provides outdoor seating. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place provides live music. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place has a children's menu. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place serves cocktails. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place serves dessert. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place serves coffee. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place is good for children. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place allows dogs. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place has a restroom. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place accommodates groups. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place` | Place is suitable for watching sports. |

### Accessibility options

The Places API (New) includes the following accessibility option fields:

| Field | Description |
|---|---|
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#accessibilityoptions` | Place offers wheelchair-accessible parking. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#accessibilityoptions` | Place has a wheelchair-accessible entrance. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#accessibilityoptions` | Place has a wheelchair-accessible restroom. |
| `https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#accessibilityoptions` | Place has wheelchair-accessible seating. |

## AI-powered summaries

Places API (New) AI-powered summaries use Gemini model capabilities to
return summaries about places and areas that can help users decide where to go.

AI-powered summaries synthesize data from a variety of inputs to help users make
more informed decisions about a place. For example, if you are considering
trying a new restaurant, an AI-powered summary can surface common menu
highlights, give you an idea of the vibe, or pull together themes from user
reviews. If you are visiting a new city, an AI-powered summary can provide an
overview of nearby attractions and amenities.

> [!NOTE]
> **Note:** All AI-powered summaries displayed in your app must be accompanied by the appropriate attribution in accordance with Google's policies and standards. For more information, see [Policies for Places
> API](https://developers.google.com/maps/documentation/places/web-service/policies).

### AI-powered features added to the Places API (New)

AI-powered summaries are supported by
[Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details),
[Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search),
and
[Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search).
The following AI-powered summaries are available in Places API (New)
responses:

- [Place summaries](https://developers.google.com/maps/documentation/places/web-service/place-summaries), which are short overview summaries related to a specific place.
- [Review summaries](https://developers.google.com/maps/documentation/places/web-service/review-summaries), which are digestible summaries of what reviewers have said about a place.
- [Area summaries](https://developers.google.com/maps/documentation/places/web-service/area-summaries), which provide overviews of nearby and popular places in the surrounding area. These include neighborhood summaries and EV charging station summaries.

Google frequently regenerates these summaries to ensure that they are fresh
based on the latest available information. When you make a
Places API (New) request, you will display the freshest data in your app.
[Try the AI-powered summaries demo](https://mapsplatform.google.com/gemini-placesapi-demo/)

## Migrate to the New Places APIs

If you are an existing Places API (New) customer and want to migrate your app to
use the new APIs, see the following migration documentation:

- [Migrate to Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/migrate-details)
- [Migrate to Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/migrate-nearby)
- [Migrate to Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/migrate-text)
- [Migrate to Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/migrate-photo)
- [Migrate to Autocomplete (New)](https://developers.google.com/maps/documentation/places/web-service/migrate-autocomplete)