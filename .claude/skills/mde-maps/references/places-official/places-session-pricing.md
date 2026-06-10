---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-session-pricing
description: "Places API (New) — Autocomplete session pricing. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/session-pricing "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/session-pricing "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/session-pricing "View this page for the JavaScript platform docs.") [Web Service](https://developers.google.com/maps/documentation/places/web-service/session-pricing "View this page for the Web Service platform docs.") **European Economic Area (EEA) developers**

> [!NOTE]
> If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).


Google recommends that you use sessions with [Autocomplete (New)](https://developers.google.com/maps/documentation/javascript/place-autocomplete).
Sessions help simplify pricing and provide a consistent pricing model for use with Autocomplete (New).


A session starts with the first Autocomplete (New) request that includes a session token,
continues through each subsequent Autocomplete (New) request, and is then terminated by a request
to Place Details (New) or Address Validation that uses the session token.


After the session terminates, any call to Autocomplete (New), Place Details (New), or Address
Validation that uses the expired session token is billed as if there was no session token.


Incomplete sessions, meaning sessions that are not terminated by a request to Place Details (New)
or Address Validation, are billed only for the Autocomplete (New) requests using the
[SKU: Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku).

## Session billing

### Sessions terminating in a Place Details (New) Essentials request

For Autocomplete (New) sessions that terminate in a request using fields from
[SKU: Places API Place Details Essentials](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ess-sku):

- **First 12 Autocomplete (New) requests** : You are billed for each Autocomplete (New) request, up to a maximum of 12 requests, using the [SKU: Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku).
- **For Autocomplete (New) requests 13 and higher in the same session** : You are billed at the [SKU: Autocomplete Session Usage](https://developers.google.com/maps/billing-and-pricing/sku-details#autocomplete-session-new-ess-sku), meaning there is no charge for those requests.
- **Place Details (New) Essentials:** You are also billed for the terminating request at [SKU: Places API Place Details Essentials](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ess-sku).

**Note:** If you terminate the session by making a request to Place Details (New) using the [SKU: Places API Place Details Essentials (IDs Only)](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-id-only-ess-sku), then all requests to Autocomplete (New) are billed using the [SKU: Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku), as if you did not use sessions. This is because the request using the [SKU: Places API Place Details Essentials (IDs Only)](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-id-only-ess-sku) is not charged, so all Autocomplete (New) requests revert to per-request pricing.

### Sessions terminating in Address Validation or Place Details (New) (non-Essentials) requests

For Autocomplete (New) sessions that terminate in an Address Validation request or a Place
Details (New) request using fields from Place Details
[Pro](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-pro-sku),
[Enterprise](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-sku),
or [Enterprise + Atmosphere](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-plus-sku):

- **Autocomplete (New) requests:** All Autocomplete (New) requests are billed at the [SKU: Autocomplete Session Usage](https://developers.google.com/maps/billing-and-pricing/sku-details#autocomplete-session-new-ess-sku), meaning there is no charge for those requests.
- **Place Details (New) or Address Validation request:** You are also billed for the terminating request at the appropriate SKU:
  - **Place Details (New)** terminating requests are billed at [SKU: Place Details Enterprise + Atmosphere](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-plus-sku), regardless of the fields requested.
  - **Address Validation** terminating requests are billed at [SKU: Address Validation Enterprise](https://developers.google.com/maps/billing-and-pricing/sku-details#address-validation-ent-sku).

## Session pricing scenarios

The three most common session pricing scenarios are:

- [Autocomplete for location data](https://developers.google.com/maps/documentation/javascript/session-pricing#ac-location-data)
- [Autocomplete for place discovery](https://developers.google.com/maps/documentation/javascript/session-pricing#ac-place-discovery)
- [Autocomplete for checkout and delivery](https://developers.google.com/maps/documentation/javascript/session-pricing#ac-checkout-delivery)

The following sections describe the individual billing charges for each scenario.

### Autocomplete for location data


In the Autocomplete for location data scenario, you are interested in using Autocomplete (New) and
Place Details (New) to obtain location information about a place. For example, you select a
suggestion from Autocomplete (New), then use Place Details (New) to get the place's latitude and
longitude coordinates to show that place on a map.

Location information can include the following:

- Address
- Location as latitude and longitude coordinates
- Plus Code
- Types
- Viewport


This session is terminated by a single request to Place Details (New) that requests fields
defined by the
[SKU: Place Details Essentials](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ess-sku).

You are then billed as follows:

- **The first 12 Autocomplete (New) requests** are billed at the [SKU: Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku).
- **Any remaining Autocomplete (New) requests** are billed at the [SKU: Autocomplete Session Usage](https://developers.google.com/maps/billing-and-pricing/sku-details#autocomplete-session-new-ess-sku), meaning there is no charge for those requests.
- **The terminating Place Details (New) request** is charged at the [SKU: Places API Place Details Essentials](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ess-sku).

![Billing diagram for Autocomplete for location data scenario](https://developers.google.com/static/maps/documentation/places/images/ac-location-data.svg)

### Autocomplete for place discovery


In the Autocomplete for place discovery scenario, you are interested in obtaining more than just
location data about a place. For example, you might request any of the following:

- Accessibility options
- Current opening hours
- Parking options
- Reviews
- Ratings


For this scenario, your session is terminated by a single request to Place Details (New) that
requests **any fields** included in the Place Details (New)
[Pro](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-pro-sku),
[Enterprise](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-sku), or
[Enterprise + Atmosphere](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-plus-sku) SKUs.

You are then billed as follows:

- **All Autocomplete (New) requests** are billed at the [SKU: Autocomplete Session Usage](https://developers.google.com/maps/billing-and-pricing/sku-details#autocomplete-session-new-ess-sku), meaning there is no charge for those requests.
- **The terminating Place Details (New) request** is billed at [SKU: Places API Place Details Enterprise + Atmosphere](https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-plus-sku).

![Billing diagram for Autocomplete for place discovery scenario](https://developers.google.com/static/maps/documentation/places/images/ac-place-discovery.svg)

### Autocomplete for checkout and delivery


The [Address Validation API](https://developers.google.com/maps/documentation/address-validation/overview) is a
service that accepts an address. It identifies address components and validates them. It also
standardizes the address for mailing and finds the best known latitude and longitude coordinates
for it.


In the Autocomplete for checkout and delivery scenario, you terminate the session with a request
to the
[Address Validation API](https://developers.google.com/maps/documentation/address-validation/requests-validate-address)
to validate the selected address.

You are then billed as follows:

- **All Autocomplete (New) requests** are billed at the [SKU: Autocomplete Session Usage](https://developers.google.com/maps/billing-and-pricing/sku-details#autocomplete-session-new-ess-sku), meaning there is no charge for those requests.
- **An optional Place Details Essentials request** is billed at no charge, if requested before the terminating Address Validation request.
- **The terminating Address Validation request** is billed at the [SKU: Address Validation Enterprise](https://developers.google.com/maps/billing-and-pricing/sku-details#address-validation-ent-sku).

![Billing diagram for Autocomplete for checkout and delivery scenario](https://developers.google.com/static/maps/documentation/places/images/ac-checkout-delivery.svg)

## Pricing without sessions


If you don't use sessions, you are billed per request to Autocomplete (New) using the
[SKU: Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku).

## Pricing for incomplete or abandoned sessions


If a session is abandoned, meaning not terminated by a call to Place Details (New) or Address
Validation, Autocomplete (New) requests revert to the per-request pricing model and are billed
per the
[SKU: Autocomplete Requests](https://developers.google.com/maps/billing-and-pricing/sku-details#places_autocomplete-request-new-ess-sku).