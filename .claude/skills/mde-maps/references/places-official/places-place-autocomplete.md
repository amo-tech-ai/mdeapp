---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: place-autocomplete-new
description: "Places API (New) — Place Autocomplete (sessions, pricing cross-links). Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/place-autocomplete-overview "View this page for the JavaScript platform docs.") [Web Service](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete "View this page for the Web Service platform docs.") **European Economic Area (EEA) developers**

> [!NOTE]
> If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

## Introduction

Autocomplete (New) is a web service that returns place
predictions and query predictions in response to an HTTP request. In the request, specify a text
search string and geographic bounds that controls the search area.

Autocomplete (New) can match on full words and
substrings of the input, resolving place names, addresses, and
[plus codes](https://plus.codes). Applications can therefore send
queries as the user types, to provide on-the-fly place and query predictions.

The response from Autocomplete (New) can contain two types
of predictions:

- **Place predictions**: Places, such as businesses, addresses and points of interest, based on the specified input text string and search area. Place predictions are returned by default.
- **Query predictions** : Query strings matching the input text string and search area. Query predictions are not returned by default. Use the `includeQueryPredictions` request parameter to add query predictions to the response.

For example, you call Autocomplete (New) using as input a string
that contains a partial user input, "Sicilian piz", with the search area
limited to San Francisco, CA. The response then contains a list of
**place predictions** that match the search string and search
area, such as the restaurant named "Sicilian Pizza Kitchen", along with
details about the place.

The returned **place predictions** are designed to be presented to the user to aid
them in selecting the intended place. You can make a
[Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details)
request to get more information about any of the returned place predictions.

The response can also contain a list of **query predictions** that match the
search string and search area, such as "Sicilian Pizza \& Pasta". Each query prediction in the
response includes the `text` field containing a recommended text search string. Use that
string as an input to
[Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)
to perform a more detailed search.

The APIs Explorer lets you make live requests so that you can get familiar with
the API and the API options:
[Try it!](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#try_it)

## Autocomplete (New) requests

An Autocomplete (New) request is an HTTP POST request to a URL in
the form:

```
https://places.googleapis.com/v1/places:autocomplete
```

Pass all parameters in the JSON request body or in headers as part of the POST request.
For example:

```curl
curl -X POST -d '{
  "input": "pizza",
  "locationBias": {
    "circle": {
      "center": {
        "latitude": 37.7937,
        "longitude": -122.3965
      },
      "radius": 500.0
    }
  }
}' \
-H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
https://places.googleapis.com/v1/places:autocomplete
```

### Supported parameters

| **Parameter** | **Description** |
|---|---|
| [`input`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#input)\* | Text string to search on (full words, substrings, place names, addresses, plus codes). |
| [`FieldMask`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#fieldmask) (HTTP Header) | Comma-separated list specifying which fields to return in the response. |
| [`includedPrimaryTypes`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#includedPrimaryTypes) | Restricts results to places matching one of up to five specified primary types. |
| [`includePureServiceAreaBusinesses`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#include-pure-service-area-businesses) | If true, includes businesses without a physical location (service area businesses). Defaults to false. |
| [`includeQueryPredictions`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#include-query-predictions) | If true, includes both place and query predictions in the response. Defaults to false. |
| [`includedRegionCodes`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#included-region-codes) | Array of up to 15 two-character country codes to restrict results to. |
| [`inputOffset`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#offset) | Zero-based Unicode char offset of cursor position within input string, influencing predictions. Defaults to input length. |
| [`languageCode`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#language) | Preferred language (IETF BCP-47 code) for results. Defaults to Accept-Language header or 'en'. |
| [`locationBias`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#location-bias-restriction) | Specifies an area (circle or rectangle) to bias search results towards, allowing results outside the area. Cannot be used with locationRestriction. |
| [`locationRestriction`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#location-bias-restriction) | Specifies an area (circle or rectangle) to restrict search results within. Results outside this area are excluded. Cannot be used with locationBias. |
| [`origin`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#origin) | Origin point (lat, long) used to calculate straight-line distance (distanceMeters) to predicted destinations. |
| [`regionCode`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#region) | Region code used to format the response and bias suggestions (e.g., 'uk', 'fr'). |
| [`sessionToken`](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#session-tokens) | User-generated string to group Autocomplete calls into a session for billing purposes. |

\* Denotes required field.

## About the response

Autocomplete (New) returns a JSON object as a response.
In the response:

- The `suggestions` array contains all of the predicted places and queries in order based on their perceived relevance. Each place is represented by a `placePrediction` field and each query is represented by a `queryPrediction` field.
- A `placePrediction` field contains detailed information about a single place prediction, including the place ID, and text description.
- A `queryPrediction` field contains detailed information about a single query prediction.

**Note:** Autocomplete (New) returns five total predictions, either as `placePredictions`, `queryPredictions`, or a combination, depending on the request. If the request does not set `includeQueryPredictions`, the response includes up to five `placePredictions`. If the request sets `includeQueryPredictions`, the response includes up to five predictions in a combination of `placePredictions` and `queryPredictions`.

The complete JSON object is in the form:

```
{
  "suggestions": [
    {
      "placePrediction": {
        "place": "places/ChIJ5YQQf1GHhYARPKG7WLIaOko",
        "placeId": "ChIJ5YQQf1GHhYARPKG7WLIaOko",
        "text": {
          "text": "Amoeba Music, Haight Street, San Francisco, CA, USA",
          "matches": [
            {
              "endOffset": 6
            }]
        },
      ...
    },
    {
      "queryPrediction": {
        "text": {
          "text": "Amoeba Music",
          "matches": [
            {
              "endOffset": 6
            }]
        },
        ...
    }
  ...]
}
```

## Required parameters

-

  ### input

  The text string on which to search. Specify full words and substrings,
  place names, addresses, and [plus codes](https://plus.codes).
  The Autocomplete (New) service
  returns candidate matches based on this string and orders results based on
  their perceived relevance.

## Optional parameters

-

  ### FieldMask

  Specify the list of fields to return in the response by creating a
  [response field mask](https://developers.google.com/maps/documentation/places/web-service/choose-fields).
  Pass the response field mask to the method by using the HTTP header
  `X-Goog-FieldMask`.

  Specify a comma-separated list of suggestion fields to return. For example,
  to retrieve the `suggestions.placePrediction.text.text` and
  `suggestions.queryPrediction.text.text` of the suggestion.

  ```javascript
    X-Goog-FieldMask: suggestions.placePrediction.text.text,suggestions.queryPrediction.text.text
  ```

  > [!NOTE]
  > **Note:**Spaces are not allowed anywhere in the field list.

  Use `*` to retrieve all fields.

  ```javascript
    X-Goog-FieldMask: *
  ```
-

  ### includeFutureOpeningBusinesses

  If `true`, returns businesses
  that are expected to open in the future. Defaults to `false`.
-

  ### includedPrimaryTypes

  A place can only have a **single primary type** from types listed in
  [Table A](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a) or
  [Table B](https://developers.google.com/maps/documentation/places/web-service/place-types#table-b). For example,
  the primary type might be `"mexican_restaurant"` or `"steak_house"`.

  By default, the API returns all places based on the `input` parameter, regardless
  of the primary type value associated with the place. Restrict results to be of a certain
  primary type or primary types by passing the `includedPrimaryTypes` parameter.

  Use this parameter to specify up to five type values from
  [Table A](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a) or
  [Table B](https://developers.google.com/maps/documentation/places/web-service/place-types#table-b). A place must
  match one of the specified primary type values to be included in the response.

  This parameter may also include, instead, one of `(regions)` or
  `(cities)`. The `(regions)` type collection filters for areas or
  divisions, such as neighborhoods and postal codes. The `(cities)` type collection
  filters for places that Google identifies as a city.

  The request is rejected with an `INVALID_REQUEST` error if:
  - More than five types are specified.
  - Any type is specified in addition to `(cities)` or `(regions)`.
  - Any unrecognized types are specified.

  **Note:** The `includedPrimaryTypes` parameter only works on the primary type of the place, not all types associated with the place. Although every place has a primary type, not every primary type is supported by Places API (New). Supported types include those listed in [Table A](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a) or [Table B](https://developers.google.com/maps/documentation/places/web-service/place-types#table-b).
-

  ### includePureServiceAreaBusinesses

  If set to `true`, the response includes businesses that visit
  or deliver to customers directly, but don't have a physical business
  location. If set to `false`, the API returns only businesses with
  a physical business location.
-

  ### includeQueryPredictions

  If `true`, the response includes both place and query predictions. The default
  value is `false`, meaning the response only includes place predictions.
-

  ### includedRegionCodes

  Only include results from the list of specified regions, specified as an array of up to 15
  [ccTLD ("top-level domain")](https://en.wikipedia.org/wiki/Country_code_top-level_domain#Latin_Character_ccTLDs)
  two-character values. If omitted, no restrictions are applied to the response. For example,
  to limit the regions to Germany and France:

  ```javascript
      "includedRegionCodes": ["de", "fr"]
  ```

  If you specify both `locationRestriction` and `includedRegionCodes`,
  the results are located in the area of intersection of the two settings.

  > [!NOTE]
  > Note: If you receive unexpected results with a country code, verify that you are using a code which includes the countries, dependent territories, and special areas of geographical interest you intend. You can find code information at [Wikipedia: List of ISO
  > 3166 country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) or the [ISO Online
  > Browsing Platform](https://www.iso.org/obp/ui/#search).

-

  ### inputOffset

  The zero-based Unicode character offset indicating the cursor position in `input`.
  The cursor position can influence what predictions are returned. If empty, it defaults to the
  length of `input`.

  > [!NOTE]
  > **Note:** In the initial Restricted Preview release, this property was called `predictionTermOffset`.

-

  ### languageCode

  The preferred language in which to return results. The results might be in mixed languages
  if the language used in `input` is different from the value specified by
  `languageCode`, or if the returned place does not have a translation from the
  local language to `languageCode`.
  - You must use [IETF
    BCP-47 language codes](https://en.wikipedia.org/wiki/IETF_language_tag) to specify the preferred language.
  - If `languageCode` is not supplied, the API uses the value specified in the `Accept-Language` header. If neither is specified, the default is `en`. If you specify an invalid language code, the API returns an `INVALID_ARGUMENT` error.
  - The preferred language has a small influence on the set of results that the API chooses to return, and the order in which they are returned. This also affects the API's ability to correct spelling errors.
  - The API attempts to provide a street address that is readable for both the user and local population, while at the same time reflecting the user input. Place predictions are formatted differently depending on the user input in each request.
    - Matching terms in the `input` parameter are chosen first, using names aligned with the language preference indicated by the `languageCode` parameter when available, while otherwise using names that best match the user input.
    - Street addresses are formatted in the local language, in a script readable by the user when possible, only after matching terms have been picked to match the terms in the `input` parameter.
    - All other addresses are returned in the preferred language, after matching terms have been chosen to match the terms in the `input` parameter. If a name is not available in the preferred language, the API uses the closest match.
-

  ### locationBias or locationRestriction

  You can specify `locationBias` or `locationRestriction`,
  but not both, to define the search area. Think of `locationRestriction` as specifying
  the region which the results must be within, and `locationBias` as
  specifying the region that the results must be near but can be outside of
  the area.

  > [!NOTE]
  > **Note:** If you omit both `locationBias` and `locationRestriction`, Autocomplete (New) uses IP biasing by default. With IP biasing, Autocomplete (New) uses the IP address of the device to bias the results.

  -

    #### locationBias

    Specifies an area to search. This location serves as a bias which means
    results around the specified location can be returned, including results
    outside the specified area.
  -

    #### locationRestriction

    Specifies an area to search. Results outside the specified area are not
    returned.

  Specify the `locationBias` or `locationRestriction` region as a
  **rectangular Viewport** or as a **circle**.
  - A circle is defined by center point and radius in meters. The radius must be between
    0.0 and 50000.0, inclusive. The default value is 0.0. For `locationRestriction`,
    you must set the radius to a value greater than 0.0. Otherwise, the request returns
    no results.

    For example:

    ```javascript
    "locationBias": {
      "circle": {
        "center": {
          "latitude": 37.7937,
          "longitude": -122.3965
        },
        "radius": 500.0
      }
    }
    ```
  - A rectangle is a latitude-longitude viewport, represented as two
    diagonally opposite `low` and high points. A viewport is considered a
    closed region, meaning it includes its boundary. The latitude bounds
    must range between -90 to 90 degrees inclusive, and the longitude bounds
    must range between -180 to 180 degrees inclusive:

    - If `low` = `high`, the viewport consists of that single point.
    - If `low.longitude` \> `high.longitude`, the longitude range is inverted (the viewport crosses the 180 degree longitude line).
    - If `low.longitude` = -180 degrees and `high.longitude` = 180 degrees, the viewport includes all longitudes.
    - If `low.longitude` = 180 degrees and `high.longitude` = -180 degrees, the longitude range is empty.

    Both `low` and `high` must be populated, and the represented box
    cannot be empty. An empty viewport results in an error.

    For example, this viewport fully encloses New York City:

    ```javascript
    "locationBias": {
      "rectangle": {
        "low": {
          "latitude": 40.477398,
          "longitude": -74.259087
        },
        "high": {
          "latitude": 40.91618,
          "longitude": -73.70018
        }
      }
    }
    ```
-

  ### origin

  The origin point from which to calculate straight-line distance to the
  destination (returned as `distanceMeters`). If this value is
  omitted, straight-line distance will not be returned. Must be specified as
  latitude and longitude coordinates:

  ```javascript
  "origin": {
      "latitude": 40.477398,
      "longitude": -74.259087
  }
  ```
-

  ### regionCode

  The region code used to format the response, specified as a
  [ccTLD ("top-level domain")](https://en.wikipedia.org/wiki/Country_code_top-level_domain#Latin_Character_ccTLDs)
  two-character value. Most ccTLD codes are identical to ISO 3166-1 codes,
  with some notable exceptions. For example, the United Kingdom's ccTLD is
  "uk" (.co.uk) while its ISO 3166-1 code is "gb" (technically for the
  entity of "The United Kingdom of Great Britain and Northern Ireland").

  Suggestions are also biased based on region codes. Google recommends setting the
  `regionCode` according to the user's regional preference.

  If you specify an invalid region code, the API returns an `INVALID_ARGUMENT`
  error. The parameter can affect results based on applicable law.
-

  ### sessionToken

  Session tokens are user-generated strings that track Autocomplete (New) calls as
  "sessions." Autocomplete (New) uses session tokens to
  group the query and selection phases of a user autocomplete search into a discrete session for
  billing purposes. For more information, see
  [Session tokens](https://developers.google.com/maps/documentation/places/web-service/place-session-tokens).

## Choose parameters to bias results

Autocomplete (New) parameters can influence search results differently. The following table provides recommendations for parameter usage based on the intended outcome.

| Parameter | Usage recommendation |
|---|---|
| `https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#region` | Set according to user's regional preference. |
| `https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#included-region-codes` | Set to limit results to the list of specified regions. |
| `https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#location-bias-restriction` | Use when results are preferred **in or around a region**. If applicable, define the region as the viewport of the map the user is looking at. |
| `https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#location-bias-restriction` | Use **only** when results outside of a region **shouldn't** be returned. |
| `https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#origin` | Use when a **straight-line distance** to each prediction is intended. > [!NOTE] > **Note:** The distance won't be available for every prediction. See [Distance missing from > response](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#distance-missing-from-response). |

## Autocomplete (New) examples

### Restrict search to an area using locationRestriction

> [!NOTE]
> **Note:** Autocomplete (New) uses IP biasing by default to control the search area. With IP biasing, Autocomplete (New) uses the IP address of the device to bias the results. You can optionally use `locationRestriction` or `locationBias`, but not both, to specify an area to search.

`locationRestriction` specifies the area to search. Results outside the specified area
are not returned. In the following example, you use `locationRestriction` to limit the
request to a **circle** 5000 meters in radius centered on San Francisco:

```curl
curl -X POST -d '{
  "input": "Art museum",
  "locationRestriction": {
    "circle": {
      "center": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "radius": 5000.0
    }
  }
}' \
-H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
https://places.googleapis.com/v1/places:autocomplete
```

All results from within the specified areas are contained in the `suggestions`
array:

```
  {
    "suggestions": [
      {
        "placePrediction": {
          "place": "places/ChIJkQQVTZqAhYARHxPt2iJkm1Q",
          "placeId": "ChIJkQQVTZqAhYARHxPt2iJkm1Q",
          "text": {
            "text": "Asian Art Museum, Larkin Street, San Francisco, CA, USA",
            "matches": [
              {
                "startOffset": 6,
                "endOffset": 16
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "Asian Art Museum",
              "matches": [
                {
                  "startOffset": 6,
                  "endOffset": 16
                }
              ]
            },
            "secondaryText": {
              "text": "Larkin Street, San Francisco, CA, USA"
            }
          },
          "types": [
            "establishment",
            "museum",
            "point_of_interest"
          ]
        }
      },
      {
        "placePrediction": {
          "place": "places/ChIJI7NivpmAhYARSuRPlbbn_2w",
          "placeId": "ChIJI7NivpmAhYARSuRPlbbn_2w",
          "text": {
            "text": "de Young Museum, Hagiwara Tea Garden Drive, San Francisco, CA, USA",
            "matches": [
              {
                "endOffset": 15
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "de Young Museum",
              "matches": [
                {
                  "endOffset": 15
                }
              ]
            },
            "secondaryText": {
              "text": "Hagiwara Tea Garden Drive, San Francisco, CA, USA"
            }
          },
          "types": [
            "establishment",
            "point_of_interest",
            "tourist_attraction",
            "museum"
          ]
        }
      },
      /.../
    ]
  }
```

You can also use `locationRestriction` to restrict searches to a **rectangular
Viewport**. The following example limits the request to downtown San Francisco:

```curl
  curl -X POST -d '{
    "input": "Art museum",
    "locationRestriction": {
      "rectangle": {
        "low": {
          "latitude": 37.7751,
          "longitude": -122.4219
        },
        "high": {
          "latitude": 37.7955,
          "longitude": -122.3937
        }
      }
    }
  }' \
  -H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
  https://places.googleapis.com/v1/places:autocomplete
```

Results are contained in the `suggestions` array:

```
  {
    "suggestions": [
      {
        "placePrediction": {
          "place": "places/ChIJkQQVTZqAhYARHxPt2iJkm1Q",
          "placeId": "ChIJkQQVTZqAhYARHxPt2iJkm1Q",
          "text": {
            "text": "Asian Art Museum, Larkin Street, San Francisco, CA, USA",
            "matches": [
              {
                "startOffset": 6,
                "endOffset": 16
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "Asian Art Museum",
              "matches": [
                {
                  "startOffset": 6,
                  "endOffset": 16
                }
              ]
            },
            "secondaryText": {
              "text": "Larkin Street, San Francisco, CA, USA"
            }
          },
          "types": [
            "point_of_interest",
            "museum",
            "establishment"
          ]
        }
      },
      {
        "placePrediction": {
          "place": "places/ChIJyQNK-4SAhYARO2DZaJleWRc",
          "placeId": "ChIJyQNK-4SAhYARO2DZaJleWRc",
          "text": {
            "text": "International Art Museum of America, Market Street, San Francisco, CA, USA",
            "matches": [
              {
                "startOffset": 14,
                "endOffset": 24
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "International Art Museum of America",
              "matches": [
                {
                  "startOffset": 14,
                  "endOffset": 24
                }
              ]
            },
            "secondaryText": {
              "text": "Market Street, San Francisco, CA, USA"
            }
          },
          "types": [
            "museum",
            "point_of_interest",
            "tourist_attraction",
            "art_gallery",
            "establishment"
          ]
        }
      }
    ]
  }
```

### Bias search to an area using locationBias

With `locationBias`, the location serves as a bias which means results around the
specified location can be returned, including results outside the specified area. In the following
example, you bias the request to downtown San Francisco:

```curl
curl -X POST -d '{
  "input": "Amoeba",
  "locationBias": {
    "circle": {
      "center": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "radius": 5000.0
    }
  }
}' \
-H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
https://places.googleapis.com/v1/places:autocomplete
```

The results now contain many more items, including results outside of the 5000 meter radius:

```
{
  "suggestions": [
    {
      "placePrediction": {
        "place": "places/ChIJ5YQQf1GHhYARPKG7WLIaOko",
        "placeId": "ChIJ5YQQf1GHhYARPKG7WLIaOko",
        "text": {
          "text": "Amoeba Music, Haight Street, San Francisco, CA, USA",
          "matches": [
            {
              "endOffset": 6
            }
          ]
        },
        "structuredFormat": {
          "mainText": {
            "text": "Amoeba Music",
            "matches": [
              {
                "endOffset": 6
              }
            ]
          },
          "secondaryText": {
            "text": "Haight Street, San Francisco, CA, USA"
          }
        },
        "types": [
          "electronics_store",
          "point_of_interest",
          "store",
          "establishment",
          "home_goods_store"
        ]
      }
    },
    {
      "placePrediction": {
        "place": "places/ChIJr7uwwy58hYARBY-e7-QVwqw",
        "placeId": "ChIJr7uwwy58hYARBY-e7-QVwqw",
        "text": {
          "text": "Amoeba Music, Telegraph Avenue, Berkeley, CA, USA",
          "matches": [
            {
              "endOffset": 6
            }
          ]
        },
        "structuredFormat": {
          "mainText": {
            "text": "Amoeba Music",
            "matches": [
              {
                "endOffset": 6
              }
            ]
          },
          "secondaryText": {
            "text": "Telegraph Avenue, Berkeley, CA, USA"
          }
        },
        "types": [
          "electronics_store",
          "point_of_interest",
          "establishment",
          "home_goods_store",
          "store"
        ]
      }
    },
    ...
  ]
}
```

You can also use `locationBias` to bias searches to a **rectangular
Viewport**. The following example limits the request to downtown San Francisco:

```curl
  curl -X POST -d '{
    "input": "Amoeba",
    "locationBias": {
      "rectangle": {
        "low": {
          "latitude": 37.7751,
          "longitude": -122.4219
        },
        "high": {
          "latitude": 37.7955,
          "longitude": -122.3937
        }
      }
    }
  }' \
  -H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
  https://places.googleapis.com/v1/places:autocomplete
```

Although search results within the rectangular viewport appear in the response, some results are
outside of the defined boundaries, due to biasing. Results are also contained within the
`suggestions` array:

```
  {
    "suggestions": [
      {
        "placePrediction": {
          "place": "places/ChIJ5YQQf1GHhYARPKG7WLIaOko",
          "placeId": "ChIJ5YQQf1GHhYARPKG7WLIaOko",
          "text": {
            "text": "Amoeba Music, Haight Street, San Francisco, CA, USA",
            "matches": [
              {
                "endOffset": 6
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "Amoeba Music",
              "matches": [
                {
                  "endOffset": 6
                }
              ]
            },
            "secondaryText": {
              "text": "Haight Street, San Francisco, CA, USA"
            }
          },
          "types": [
            "point_of_interest",
            "store",
            "establishment"
          ]
        }
      },
      {
        "placePrediction": {
          "place": "places/ChIJr7uwwy58hYARBY-e7-QVwqw",
          "placeId": "ChIJr7uwwy58hYARBY-e7-QVwqw",
          "text": {
            "text": "Amoeba Music, Telegraph Avenue, Berkeley, CA, USA",
            "matches": [
              {
                "endOffset": 6
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "Amoeba Music",
              "matches": [
                {
                  "endOffset": 6
                }
              ]
            },
            "secondaryText": {
              "text": "Telegraph Avenue, Berkeley, CA, USA"
            }
          },
          "types": [
            "point_of_interest",
            "store",
            "establishment"
          ]
        }
      },
      {
        "placePrediction": {
          "place": "places/ChIJRdmfADq_woARYaVhnfQSUTI",
          "placeId": "ChIJRdmfADq_woARYaVhnfQSUTI",
          "text": {
            "text": "Amoeba Music, Hollywood Boulevard, Los Angeles, CA, USA",
            "matches": [
              {
                "endOffset": 6
              }
            ]
          },
          "structuredFormat": {
            "mainText": {
              "text": "Amoeba Music",
              "matches": [
                {
                  "endOffset": 6
                }
              ]
            },
            "secondaryText": {
              "text": "Hollywood Boulevard, Los Angeles, CA, USA"
            }
          },
          "types": [
            "point_of_interest",
            "store",
            "establishment"
          ]
        }
      },
    /.../
    ]
  }
```

### Use includedPrimaryTypes

Use the `includedPrimaryTypes` parameter to specify up to five type values from
[Table A](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a),
[Table B](https://developers.google.com/maps/documentation/places/web-service/place-types#table-b),
or only `(regions)`, or only `(cities)`. A place must match one of the
specified primary type values to be included in the response.

In the following example, you specify an `input` string of
"Soccer" and use the `includedPrimaryTypes` parameter to restrict results to
establishments of type `"sporting_goods_store"`:

```curl
curl -X POST -d '{
  "input": "Soccer",
  "includedPrimaryTypes": ["sporting_goods_store"],
  "locationBias": {
    "circle": {
      "center": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "radius": 500.0
    }
  }
}' \
-H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
https://places.googleapis.com/v1/places:autocomplete
```

If you omit the `includedPrimaryTypes` parameter, then the results can include
establishments of a type that you do not want, such as `"athletic_field"`.

### Request query predictions

Query predictions are not returned by default. Use the `includeQueryPredictions`
request parameter to add query predictions to the response. For example:

```curl
curl -X POST -d '{
  "input": "Amoeba",
  "includeQueryPredictions": true,
  "locationBias": {
    "circle": {
      "center": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "radius": 5000.0
    }
  }
}' \
-H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
https://places.googleapis.com/v1/places:autocomplete
```

The `suggestions` array now contains both place predictions and query predictions
as shown above in [About the response](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#about_response). Each query prediction
includes the `text` field containing a recommended text search string. You can make a
[Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)
request to get more information about any of the returned query predictions.

> [!NOTE]
> **Note:** Query predictions are not returned when the `includedRegionCodes` parameter is set.

### Use origin

In this example, include `origin` in the request as latitude and longitude
coordinates. When you include `origin`, Autocomplete (New) includes the
`distanceMeters` field in the response which contains the straight-line distance from the
`origin` to the destination. This example sets the origin to the center of San
Francisco:

```curl
curl -X POST -d '{
  "input": "Amoeba",
  "origin": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "locationRestriction": {
    "circle": {
      "center": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "radius": 5000.0
    }
  }
}' \
-H 'Content-Type: application/json' -H "X-Goog-Api-Key: API_KEY" \
https://places.googleapis.com/v1/places:autocomplete
```

The response now includes `distanceMeters`:

```
{
  "suggestions": [
    {
      "placePrediction": {
        "place": "places/ChIJ5YQQf1GHhYARPKG7WLIaOko",
        "placeId": "ChIJ5YQQf1GHhYARPKG7WLIaOko",
        "text": {
          "text": "Amoeba Music, Haight Street, San Francisco, CA, USA",
          "matches": [
            {
              "endOffset": 6
            }
          ]
        },
        "structuredFormat": {
          "mainText": {
            "text": "Amoeba Music",
            "matches": [
              {
                "endOffset": 6
              }
            ]
          },
          "secondaryText": {
            "text": "Haight Street, San Francisco, CA, USA"
          }
        },
        "types": [
          "home_goods_store",
          "establishment",
          "point_of_interest",
          "store",
          "electronics_store"
        ],
        "distanceMeters": 3012
      }
    }
  ]
}
```

### Find businesses opening in the future

The following example shows a Autocomplete (New) request for businesses opening in the
future in New Meadows, Idaho:

```curl
curl -X POST \
-H "Content-Type: application/json" \
-H "X-Goog-Api-Key: API_KEY" \
-d '{
  "input": "Roberts Greenhouse and Tree Farm",
  "includeFutureOpeningBusinesses": true,
  "locationBias": {
    "circle": {
      "center": {"latitude": 44.9755100, "longitude": -116.2842180},
      "radius": 20
    }
  }
}' \
"https://places.googleapis.com/v1/places:autocomplete"
```

The response includes details about the place, but does not include the opening date.

```
{
  "suggestions": [
    {
      "placePrediction": {
        "place": "places/ChIJp1-VoKWJplQRMz8g-7Wa3Do",
        "placeId": "ChIJp1-VoKWJplQRMz8g-7Wa3Do",
        "text": {
          "text": "Roberts Greenhouse and Tree Farm, McLain Street, New Meadows, ID, USA",
          "matches": [
            {
              "endOffset": 32
            }
          ]
        },
        "structuredFormat": {
          "mainText": {
            "text": "Roberts Greenhouse and Tree Farm",
            "matches": [
              {
                "endOffset": 32
              }
            ]
          },
          "secondaryText": {
            "text": "McLain Street, New Meadows, ID, USA"
          }
        },
        "types": [
          "garden_center",
          "establishment",
          "service",
          "store",
          "point_of_interest"
        ]
      }
    }
  ]
}
```

## Distance missing from response

In certain cases, `distanceMeters` is missing from the response
body, even when `origin` is included in the request. This may happen in the following
scenarios:

- `distanceMeters` is not included for `route` predictions.
- `distanceMeters` is not included when its value is `0`, which is the case for predictions that are less than 1 meter away from the provided `origin` location.

Client libraries attempting to read the `distanceMeters`
field out of a parsed object will return a field with value `0`.
To avoid misleading users, **don't** display a zero distance
to users.

## Autocomplete (New) optimization

This section describes best practices to help you make the most of the
Autocomplete (New) service.

Here are some general guidelines:

- The quickest way to develop a working user interface is to use the Maps JavaScript API [Autocomplete (New) widget](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new), Places SDK for Android [Autocomplete (New) widget](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete#autocomplete-widget), or Places SDK for iOS [Autocomplete (New) widget](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete#autocomplete-widget).
- Understand essential Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/places/web-service/data-fields) from the start.
- Location biasing and location restriction fields are optional but can have a significant impact on autocomplete performance.
- Use error handling to make sure your app degrades gracefully if the API returns an error.
- Make sure your app handles when there is no selection and offers users a way to continue.

### Cost optimization best practices

#### Basic cost optimization

[Video](https://www.youtube.com/watch?v=VOP8cvCLGac)

To optimize the cost of using the Autocomplete (New)
service, use field masks in Place Details (New) and Autocomplete (New) widgets to return only the

Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/places/web-service/data-fields)

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
[per session](https://developers.google.com/maps/documentation/places/web-service/session-pricing) plus applicable Places SKUs,
depending on which place data fields you request.^[1](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#fn1)^


**Widget implementation**   

Session management is automatically built into the

[JavaScript](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new),
[Android](https://developers.google.com/maps/documentation/places/android-sdk/place-autocomplete#autocomplete-widget),
or [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/place-autocomplete#autocomplete-widget)

widgets. This includes both the Autocomplete (New) requests and the Place Details (New) request
on the selected prediction. Be sure to specify the `fields` parameter in order to
ensure you are only requesting the

Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/places/web-service/data-fields)

you need.


**Programmatic implementation**   

Use a

[session token](https://developers.google.com/maps/documentation/places/web-service/session-pricing)

with your Autocomplete (New) requests. When requesting Place Details (New) about the selected prediction, include the following parameters:

1. The place ID from [the Autocomplete (New) response](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#programmatic-response)
2. The session token used in the Autocomplete (New) request
3. The `fields` parameter specifying the Autocomplete (New) [data fields](https://developers.google.com/maps/documentation/places/web-service/data-fields) you need

### No, needs only address and location


Geocoding API could be a more cost-effective option than Place Details (New) for your application, depending on the performance of your Autocomplete (New) usage. Every application's Autocomplete (New) efficiency varies depending on what users are entering, where the application is being used, and whether [performance optimization best practices](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#perf-best-practices) have been implemented.


In order to answer the following question, analyze how many characters a user types on average before selecting a Autocomplete (New) prediction in your application.


**Do your users select a Autocomplete (New) prediction in four or fewer requests, on average?**

### Yes


**Implement Autocomplete (New) programmatically without session tokens and call Geocoding API on the selected place prediction.**   

Geocoding API delivers addresses and latitude/longitude coordinates.
Making four

[Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku)

requests plus a [Geocoding API](https://developers.google.com/maps/billing-and-pricing/sku-details#geocoding)
call about the selected place prediction is less than the per-session Autocomplete (New)
cost per session.^[1](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#fn1)^


Consider employing [performance best practices](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#perf-best-practices) to help your users get the prediction they're looking for in even fewer characters.

### No


**Use session-based Autocomplete (New) with Place Details (New).**   

Since the average number of requests you expect to make before a user selects a
Autocomplete (New) prediction exceeds the cost of per-session pricing, your implementation
of Autocomplete (New) should use a session token for both the Autocomplete (New) requests
and the associated Place Details (New) request

[per session](https://developers.google.com/maps/documentation/places/web-service/session-pricing).

^[1](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#fn1)^


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

[session token](https://developers.google.com/maps/documentation/places/web-service/session-pricing)

with your Autocomplete (New) requests.
When requesting Place Details (New) about the selected prediction,
include the following parameters:

1. The place ID from [the Autocomplete (New) response](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#programmatic-response)
2. The session token used in the Autocomplete (New) request
3. The `fields` parameter specifying fields such as address and geometry


**Consider delaying Autocomplete (New) requests**   

You can employ strategies such as delaying a Autocomplete (New) request until the user has typed in the first three or four characters so that your application makes fewer requests. For example, making Autocomplete (New) requests for each character *after* the user has typed the third character means that if the user types seven characters then selects a prediction for which you make one Geocoding API request, the total cost would be for 4 Autocomplete (New) Per Request + Geocoding.^[1](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#fn1)^


If delaying requests can get your average programmatic request below four, you can follow the guidance for [performant Autocomplete (New) with Geocoding API](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete?tab=Yes#select-location-only) implementation. Note that delaying requests can be perceived as latency by the user who might be expecting to see predictions with every new keystroke.


Consider employing [performance best practices](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#perf-best-practices) to help your users get the prediction they're looking for in fewer characters.

*** ** * ** ***

1. For costs, see [Google Maps Platform pricing lists](https://developers.google.com/maps/billing-and-pricing/pricing).

### Performance best practices

[Video](https://www.youtube.com/watch?v=bv1p4s_d8OM)

The following guidelines describe ways to optimize Autocomplete (New) performance:

- Add country restrictions, [location biasing](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#location_biasing), and (for programmatic implementations) language preference to your Autocomplete (New) implementation. Language preference is not needed with widgets since they pick language preferences from the user's browser or mobile device.
- If Autocomplete (New) is accompanied by a map, you can bias location by map viewport.
- In situations when a user does not choose one of the Autocomplete (New) predictions, generally because none of those predictions are the result-address wanted, you can reuse the original user input to attempt to get more relevant results:
  - If you expect the user to enter only address information, reuse the original user input in a call to the [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview).
  - If you expect the user to enter queries for a specific place by name or address, use a Place Details (New) request. If results are only expected in a specific region, use [location biasing](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete#location_biasing).

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

## Try it!

The APIs Explorer lets you make sample requests so
that you can get familiar with the API and the API options.

1. Select the API icon api
   on the right side of the page.

2. Optionally edit the request parameters.

3. Select the **Execute** button. In the dialog, choose the account
   that you want to use to make the request.

4. In the APIs Explorer panel, select the fullscreen icon
   fullscreen to expand the APIs Explorer window.