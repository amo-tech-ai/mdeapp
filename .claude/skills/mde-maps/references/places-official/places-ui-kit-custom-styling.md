---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-ui-kit-custom-styling
description: "Maps JavaScript — Places UI Kit custom styling. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/places-ui-kit-custom-styling "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/places-ui-kit-custom-styling "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/custom-styling "View this page for the JavaScript platform docs.")


The Places UI Kit supports a variety of settings and custom CSS properties to configure the display
elements. Use this
[CSS properties](https://developers.google.com/maps/documentation/javascript/places-ui-kit/custom-styling#css-properties) reference table to see how these
properties can be applied to the UI Kit.


Use the [Customization tool](https://developers.google.com/maps/documentation/javascript/places-ui-kit/customization-tool) to visualize how different sets of properties will affect the appearance of a Places Details element and access the code in HTML/CSS, Kotlin/XML, and Swift.
![CSS properties mapped to the Places UI Kit elements](https://developers.google.com/static/maps/documentation/javascript/places-ui-kit/images/details-custom-css.jpg)


The Places UI Kit offers a design system approach to visual customization roughly based on
[Material Design](https://m3.material.io/) (with some Google Maps-specific
modifications). See Material Design's reference for
[Color](https://m3.material.io/styles/color/overview) and
[Typography](https://m3.material.io/styles/typography/overview).
By default, the style adheres to the Google Maps visual design language.

> [!IMPORTANT]
> **Important:** When making visual modifications, you must adhere to the [Attribution requirements](https://developers.google.com/maps/documentation/javascript/places-ui-kit/attrib-req).

## CSS properties

| Property | Details Compact Element | Details Element | Usage |
|---|---|---|---|
| **Color (system)** ||||
| [`--gmp-mat-color-surface`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-surface) | ✔ | ✔ | Container and dialog background |
| [`--gmp-mat-color-on-surface`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-on-surface) | ✔ | ✔ | Headings, dialog content |
| [`--gmp-mat-color-on-surface-variant`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-on-surface-variant) | ✔ | ✔ | Place information |
| [`--gmp-mat-color-primary`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-primary) | ✔ | ✔ | Links, loading indicator, overview icons |
| [`--gmp-mat-color-disabled-surface`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-disabled-surface) |   | ✔ | Unfilled star rating |
| [`--gmp-mat-color-positive`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-positive) | ✔ | ✔ | Place "Open" now label |
| [`--gmp-mat-color-positive-container`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-positive-container) |   | ✔ | Available EV charger badge |
| [`--gmp-mat-color-on-positive-container`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-on-positive-container) |   | ✔ | Available EV charger badge content |
| [`--gmp-mat-color-negative`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-negative) | ✔ | ✔ | Place "Closed" now label |
| [`--gmp-mat-color-info`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-info) | ✔ | ✔ | Accessible entrance icon |
| [`--gmp-mat-color-secondary-container`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-secondary-container) | ✔ | ✔ | Button background |
| [`--gmp-mat-color-on-secondary-container`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-on-secondary-container) | ✔ | ✔ | Button text and icon |
| [`--gmp-mat-color-neutral-container`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-neutral-container) | ✔ | ✔ | Review date badge, loading placeholder shapes |
| [`--gmp-mat-color-on-neutral-container`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-on-neutral-container) | ✔ | ✔ | Review date, loading error |
| [`--gmp-mat-color-outline-decorative`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-color-outline-decorative) | ✔ | ✔ | Container border |
| **Typography (system)** ||||
| [`--gmp-mat-font-family`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-family) | ✔ | ✔ | Base font-family for all typography |
| [`--gmp-mat-font-display-small`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-display-small) |   | ✔ | Place name |
| [`--gmp-mat-font-headline-medium`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-headline-medium) | ✔ | ✔ | Dialog headings |
| [`--gmp-mat-font-title-small`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-title-small) | ✔ |   | Place name |
| [`--gmp-mat-font-body-medium`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-body-medium) |   | ✔ | Place information, dialog content |
| [`--gmp-mat-font-body-small`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-body-small) | ✔ |   | Place information |
| [`--gmp-mat-font-label-large`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-label-large) | ✔ | ✔ | Button content |
| [`--gmp-mat-font-label-medium`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.--gmp-mat-font-label-medium) |   | ✔ | Badge content |
| **Container (component)** ||||
| [`border`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.border) (on :host) | ✔ | ✔ | Container |
| [`border-radius`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement.border-radius) (on :host) | ✔ | ✔ | Container |

### Default color scheme


By default, Places UI Kit components automatically adapt to the user's preferred color scheme,
detecting whether the user has their browser or system set to light or dark mode. The
component's appearance will automatically adjust to match the user's preference.
![Places UI Kit elements in light and dark modes](https://developers.google.com/static/maps/documentation/javascript/places-ui-kit/images/ui-kit-light-dark-modes.png)


When applying your own custom styles, ensure you test your changes in both light and dark
modes to prevent visual inconsistencies. If your application uses a single, fixed theme, the
automatic theme switching can lead to a poor user experience. For example, a dark-themed
component might appear in your light-themed app. To prevent this, you can force the component
to always render in a specific theme by setting `color-scheme` in CSS.

### Google Maps brand attribution

| Property | Details Compact Element | Details Element | Usage |
|---|---|---|---|
| (black \| white \| gray) | ✔ | ✔ | Google Maps brand attribution, Google Maps disclosure button |


[Google Maps' terms of service](https://cloud.google.com/maps-platform/terms)
require you to use one of three brand colors for the Google Maps attribution.
This attribution must be visible and accessible when customization changes have been made.
See the [Attribution
requirements](https://developers.google.com/maps/documentation/javascript/places-ui-kit/attrib-req) for more information.


We offer a choice of three brand colors that can be independently set for light and dark themes:

- Light theme: [`PlaceAttributionElement.lightSchemeColor`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceAttributionElement.lightSchemeColor) with attributes for white, gray, and black.
- Dark theme: [`PlaceAttributionElement.darkSchemeColor`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceAttributionElement.darkSchemeColor) with attributes for white, gray, and black.

```html
<gmp-place-content-config>
  <gmp-place-attribution
      light-scheme-color="black"
      dark-scheme-color="white"
  ></gmp-place-attribution>
</gmp-place-content-config>
```