---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-ui-kit-overview
description: "Maps JavaScript — Places UI Kit overview (browser components). Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/places-ui-kit-overview "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/places-ui-kit-overview "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview "View this page for the JavaScript platform docs.") ![](https://developers.google.com/static/maps/documentation/javascript/places-ui-kit/images/places-ui-kit-intro.png)

    
The Places UI Kit component library lets you bring the familiar Google Maps user experience for
Places to your apps and web pages, using the same data that powers the Places API. It includes a
set of individual UI components that can be used independently, together, and in conjunction with
other Google Maps Platform APIs to deliver a Places-rich experience with minimal cost and code.


The Places UI Kit includes the following HTML elements for rendering Places data:

- [Place Details Elements](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details) (Place Details and Place Details Compact) render details such as opening hours, website, and reviews for a selected place.
- [Place Search Elements](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list) (Place Nearby Search and Place Text Search) render a list of places in response to either a nearby search or text search query.
- [Basic Place Autocomplete Element](https://developers.google.com/maps/documentation/javascript/places-ui-kit/basic-autocomplete) renders a text input field, supplies place predictions in a UI pick list, and returns a place ID for the selected place.

> [!TIP]
> **Tip:** The Places UI Kit offers extensive visual customization options at no extra charge. See [Places UI Kit Custom Styling](https://developers.google.com/maps/documentation/javascript/places-ui-kit/custom-styling) for more information.

## Key features and capabilities

- Incorporate Google's trusted experience starting with minimal code.
- Bring Google Maps UI for Places to your apps at a lower cost than the Places API.
- Choose the data and display options that best suit your needs.

## Billing


Places UI Kit requests are always billed at the
[Places UI Kit API rate](https://developers.google.com/maps/billing-and-pricing/sku-details#places_ui-kit-request-ess-sku), regardless of which search method they use or what data types they
return. For example, a Places UI Kit Nearby Search won't incur any additional charges for
Places API Nearby Search Pro. Similarly, a Places UI Kit Place Details request may return
photos, price, and rating for a selected place, but you will only be billed for the Places UI
Kit Place Details request.

### Next step:
[Get started with the Places UI Kit](https://developers.google.com/maps/documentation/javascript/places-ui-kit/get-started)