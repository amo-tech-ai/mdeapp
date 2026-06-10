---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-choose-fields
description: "Places API (New) — choosing which fields to return. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

**European Economic Area (EEA) developers**

> [!NOTE]
> If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

## Introduction

When you call the
[Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details),
[Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search),
or [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)
methods, you must specify which fields you want returned in the response. There
is no default list of returned fields. If you omit this list, the methods return
an error.

A full list of supported data fields and their corresponding SKUs can be found
in [Place Data Fields
(New)](https://developers.google.com/maps/documentation/places/web-service/data-fields). For information on
fields specific to each API, see the following:

- Place Details (New) [FieldMask](https://developers.google.com/maps/documentation/places/web-service/place-details#fieldmask) parameters
- Nearby Search (New) [FieldMask](https://developers.google.com/maps/documentation/places/web-service/nearby-search#fieldmask) parameters
- Text Search (New) [FieldMask](https://developers.google.com/maps/documentation/places/web-service/text-search#fieldmask) parameters

You specify the field list by creating a **response field mask** . You then pass
the response field mask to either method by using the parameter `$fields` or
`fields`, or by using the HTTP or gRPC header `X-Goog-FieldMask`.

Field masking is a good design practice to ensure that you don't request
unnecessary data, which helps to avoid unnecessary processing time and billing
charges.

## Define a response field mask

The response field mask is a comma-separated list of paths, where each path
specifies a unique field in the response body. The path starts from the
top-level response message and uses a dot-separated path to the specified field.

Construct a field path as follows:

```
topLevelField[.secondLevelField][.thirdLevelField][...]
```

> [!NOTE]
> **Note:** Don't use spaces anywhere in the list of field paths.

You can request all fields by using a field mask of `*`.

> [!CAUTION]
> **Caution:** While this wildcard field mask is okay to use in development, don't use the wildcard (\*) response field mask in production. The cost may be higher than expected as more advanced features are requested through this field mask, and it increases response latency. Make sure you are requesting only the fields you need to minimize your costs and request response time.

For more information about how to construct field masks, see the
[field_mask.proto](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/field_mask.proto).

### Determine what field masks to use

Here's how you can determine which field masks you want to use:

1. Request all fields using a field mask of `*`.
2. Look at the hierarchy of the fields in the response, and determine what fields you want.
3. Build your field mask using the field hierarchy.

### Define a response field mask for Nearby Search (New) and Text Search (New)

Nearby Search (New) and Text Search (New) return an array of Place
objects in the `places` field of the response. For these APIs, `places` is the
top-level field of the response.

For example, to see the complete response object from a Text Search (New):

```
curl -X POST -d '{
  "textQuery" : "Spicy Vegetarian Food in Sydney, Australia"
}' \
-H 'Content-Type: application/json' -H 'X-Goog-Api-Key: API_KEY' \
-H 'X-Goog-FieldMask: *' \
'https://places.googleapis.com/v1/places:searchText'
```

The complete response object from a Text Search (New)
call is in the form:

```json
{
  "places": [
    {
      "name": "places/ChIJs5ydyTiuEmsR0fRSlU0C7k0",
      "id": "ChIJs5ydyTiuEmsR0fRSlU0C7k0",
      "types": [
        "vegetarian_restaurant",
        "vegan_restaurant",
        "meal_takeaway",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment"
      ],
      "nationalPhoneNumber": "0433 479 794",
      "internationalPhoneNumber": "+61 433 479 794",
      "formattedAddress": "29 King St, Sydney NSW 2000, Australia",
      "displayName": {
        "text": "Spiced @ Barangaroo",
        "languageCode": "en"
      },      ...
    },
  ...
  ]
}
```

Therefore, you specify a field mask for these APIs in the form:

```
places[.secondLevelField][.thirdLevelField][...]
```

If you want to return only the `formattedAddress` and `displayName` fields, set
your field mask to:

```
places.formattedAddress,places.displayName
```

Specifying `displayName` includes both the `text` and `language` fields of
`displayName`. If you only want the `text` field, set the field mask as:

```
places.formattedAddress,places.displayName.text
```

### Define a response field mask for Place Details (New)

Place Details (New) returns a single Place object in the form:

```json
{
  "name": "places/ChIJkR8FdQNB0VQRm64T_lv1g1g",
  "id": "ChIJkR8FdQNB0VQRm64T_lv1g1g",
  "types": [
    "locality",
    "political"
  ],
  "formattedAddress": "Trinidad, CA 95570, USA",
  "displayName": {
    "text": "Trinidad",
    "languageCode": "en"
  }
  ...
}
```

Therefore, you specify a field mask for this API by specifying the fields of the
Place object that you want to return:

```
curl -X GET -H 'Content-Type: application/json' \
-H "X-Goog-Api-Key: API_KEY" \
-H "X-Goog-FieldMask: formattedAddress,displayName" \
https://places.googleapis.com/v1/places/ChIJj61dQgK6j4AR4GeTYWZsKWw
```

### gRPC call

For gRPC, set a variable containing the response field mask. You can then pass
that variable to the request.

```json
const (
  fieldMask = "places.formattedAddress,places.displayName"
)
```

## Field path considerations

Include only the fields that you require in the response. Returning just the
fields that you need:

- **Decreases processing times**, so your results are returned with a lower latency.
- **Ensures stable latency performance** if the API adds more response fields in the future, and those new fields require extra computation time. If you select all fields, or if you select all fields at the top level, you might experience performance degradation when all new fields are automatically included in your response.
- **Results in a smaller response size**, which translates into higher network throughput.
- **Ensures that you don't request unnecessary data**, which helps to avoid unnecessary processing time and billed charges.

> [!NOTE]
> **Note:** When a response message is parsed, and a field in the response message contains its default value, the field may be omitted from the response even if you specified it in the response field mask. For more information, see the [Language Guide (proto3)](https://developers.google.com/protocol-buffers/docs/proto3#default).