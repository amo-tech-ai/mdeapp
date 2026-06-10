---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: places-ui-kit-ai-summaries
description: "Maps JavaScript — Places UI Kit AI-powered summaries. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

Select platform: [Android](https://developers.google.com/maps/documentation/places/android-sdk/places-ui-kit-overview "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/places/ios-sdk/places-ui-kit-overview "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview "View this page for the JavaScript platform docs.")

AI-powered summaries are overviews that provide helpful insights about specific places, and
reviews associated with a place. The
[`PlaceDetailsElement`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsElement)
can display the following types of AI-powered summaries:

- **Place summary** : A brief, 100-character overview specific to a given place
  ID, aggregating many different types of data into a high-level snapshot of a place. These
  summaries appear by default in the `PlaceDetailsElement`, with a fallback
  to standard editorial content if AI-powered summaries aren't available.

- **Review summary** : A generated summary of a place based solely on user
  reviews. The review summary appears in the **Reviews** tab. Use the
  `gmp-place-review-summary` attribute to display review summaries. The review
  summary is included in `gmp-place-all-content` and `gmp-place-standard-content`.

The following screenshot shows the `PlaceDetailsElement` with place and review
summaries enabled:

```html
<gmp-map center="47.759737, -122.250632" zoom="16" map-id="DEMO_MAP_ID">
  <div class="widget-container" slot="control-inline-start-block-start">
    <gmp-place-details>
      <gmp-place-details-place-request place="ChIJC8HakaIRkFQRiOgkgdHmqkk"></gmp-place-details-place-request>
      <gmp-place-content-config>
        <gmp-place-summary></gmp-place-summary>
        <gmp-place-review-summary></gmp-place-review-summary>
        <gmp-place-reviews></gmp-place-reviews>
        <gmp-place-attribution light-scheme-color="gray" dark-scheme-color="white"></gmp-place-attribution>
      </gmp-place-content-config>
    </gmp-place-details>
  </div>
  <gmp-advanced-marker></gmp-advanced-marker>
</gmp-map>
```

Learn more:

- [`PlaceDetailsElement`](https://developers.google.com/maps/documentation/javascript/reference/next/places-widget#PlaceDetailsElement) reference.
- [AI-powered summaries in the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/ai-powered-summaries).