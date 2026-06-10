---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: mapid-over
description: "Offline Google Maps Platform doc export (mapid-over). Tertiary: verify against live developers.google.com and curated references/*.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/android-sdk/map-ids/mapid-over "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/ios-sdk/map-ids/mapid-over "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over "View this page for the JavaScript platform docs.") [Web Service](https://developers.google.com/maps/documentation/maps-static/map-ids/mapid-over "View this page for the Web Service platform docs.")

<br />

> [!IMPORTANT]
> **Paid feature:**
> Features accessed by adding a [map ID](https://developers.google.com/maps/documentation/get-map-id) triggers a map
> load charged against the Dynamic Maps SKU for Android and iOS. See
> [Google Maps Billing](https://developers.google.com/maps/billing-and-pricing/sku-details#dynamic-maps-ess-sku) for more information.

A map ID is a unique identifier that represents Google Map styling and configuration settings that are stored in Google Cloud. You use map IDs to enable features or manage or style maps on your websites and in your applications. You can create map IDs for each platform you need--JavaScript, Android, iOS, or Static maps--in your Google Cloud console project on the **Map Management** page.

For how to create map IDs, see [How to create map IDs](https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id).

## What you can do with map IDs

Use map IDs to enable features and styling. Here are some examples of how to
use map IDs. For a full list, see [Features that use map IDs](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over#features-available):

- **Cloud-based maps styling** : Associate a map ID with a map style to
  style, customize, and manage your maps using the Google Cloud console.
  Available on all platforms:
  [Android](https://developers.google.com/maps/documentation/android-sdk/cloud-customization),
  [iOS](https://developers.google.com/maps/documentation/ios-sdk/cloud-customization),
  [JavaScript](https://developers.google.com/maps/documentation/javascript/cloud-customization),
  and [Maps Static API](https://developers.google.com/maps/documentation/maps-static/cloud-customization).

- **Vector maps** : Use a map ID to use a map composed of vector-based tiles
  that are drawn at load time on the client side using WebGL.
  Available on [JavaScript](https://developers.google.com/maps/documentation/javascript/vector-map).

- **Advanced markers** : Use a map ID to enable Advanced markers. Available on
  [Android](https://developers.google.com/maps/documentation/android-sdk/advanced-markers/overview),
  [iOS](https://developers.google.com/maps/documentation/ios-sdk/advanced-markers/overview), and
  [JavaScript](https://developers.google.com/maps/documentation/javascript/advanced-markers/overview).

### Example for cloud-based maps styling

To use cloud-based maps styling to style maps on your website and Android apps,
follow these steps:

1. Create map IDs for each platform you are using. For example, create a
   JavaScript and an Android map ID. For details, see
   [Create map IDs](https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id).

2. Configure a map style on the Google Cloud console. For details, see
   [cloud-based maps styling](https://developers.google.com/maps/documentation/javascript/cloud-customization/map-styles-leg).

3. Associate both of your map IDs with the map style in the Google Cloud console.
   For details, see [Associate map IDs with your style](https://developers.google.com/maps/documentation/javascript/cloud-customization/map-styles-leg#associate-style-with-map-id).

4. Reference the map ID in your website JavaScript and your Android app code.
   For details, see [Add a map ID to your app](https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id#add-a-map-id-to-your-app).

The map style associated with your map IDs is then displayed on your website and
in your Android app. You can make updates to your map style in the
Cloud console, and changes appear in both places automatically,
without the need for any app updates by your customers.

### Features that use map IDs

The following table shows the Google Maps Platform features and APIs that use
map IDs:

| Feature or API | Uses map IDs to accomplish these goals |
|---|---|
| [Advanced markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/overview) | Enable advanced markers. You don't need to create a map ID, and can instead use the demo map ID `DEMO_MAP_ID`. |
| [Data-driven styling for boundaries](https://developers.google.com/maps/documentation/android-sdk/dds-boundaries/overview) | Associate the map ID with a set of boundaries and styling to style the map according to the boundaries. |
| [Data-driven styling for datasets](https://developers.google.com/maps/documentation/android-sdk/dds-datasets/overview) | Associate the map ID with a set of data and styling to style the map according to the dataset. |
| [Flutter](https://developers.google.com/maps/documentation/cross-platform/navigation) | Style the Google maps used in your Flutter apps. |
| [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/cloud-customization) | Style the map to be displayed on a web page. |
| [Maps SDK for Android](https://developers.google.com/maps/documentation/android-sdk/cloud-customization) | Style the map to be displayed in an Android application.^1^ |
| [Maps SDK for iOS](https://developers.google.com/maps/documentation/ios-sdk/cloud-customization) | Style the map to be displayed in an iOS application.^1^ |
| [Maps Static API](https://developers.google.com/maps/documentation/maps-static/cloud-customization) | Specify and style the map to be rendered as a static image. |
| [Mobility solutions](https://developers.google.com/maps/documentation/mobility/journey-sharing/on-demand/javascript/style) | Use the Maps JavaScript API and SDKs for Android and iOS to style maps in Mobility solutions.^1^ |
| [Navigation SDK for Android](https://developers.google.com/maps/documentation/navigation/android-sdk) | Style the map to be displayed in an Android application.^1^ |
| [Navigation SDK for iOS](https://developers.google.com/maps/documentation/navigation/ios-sdk) | Style the map to be displayed in an iOS application.^1^ |
| [WebGL (Vector maps)](https://developers.google.com/maps/documentation/javascript/webgl) | Enable WebGL features using a JavaScript vector map ID. |

^1^ Using a map ID on Maps SDK for Android, Maps SDK for iOS, Navigation SDK for Android, or Navigation SDK for iOS triggers a map load that is charged against the [Dynamic Maps SKU](https://developers.google.com/maps/billing-and-pricing/sku-details#dynamic-maps-ess-sku).

## Next steps

[Create a map ID](https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id)