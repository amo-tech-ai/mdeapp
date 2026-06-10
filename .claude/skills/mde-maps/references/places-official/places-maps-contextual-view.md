---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: maps-contextual-view
description: "Maps JavaScript — Contextual View (pre-GA); see MASTRA-070. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
---

> [!WARNING]
> This product or feature is Experimental (pre-GA). Pre-GA products and features might have limited support, and changes to pre-GA products and features might not be compatible with other pre-GA versions. Pre-GA Offerings are covered by the [Google
> Maps Platform Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms). For more information, see the [launch stage descriptions](https://developers.google.com/maps/launch-stages).

The Contextual View component, part of the Google Maps AI Kit,
is a visual container used to support or supplement other Google Maps content. The
Contextual View component lets you integrate Grounding with Google Maps into
your applications to create a conversational LLM-powered chat experience. The
Contextual View component is rendered using the context token,
`googleMapsWidgetContextToken`, which is returned in the
Contextual View response and can be used to render visual content.

The Contextual View component serves different functions depending on your
scenario:

- It displays subjective user-generated content (UGC) in the scenario where Google Maps prompting is used for answer generation.
- It helps to enrich results with map visualizations and data when Vertex AI generates just a text response.

## How the Contextual View component works

The Contextual View component displays a response from Grounding with Google Maps
in Vertex AI, in the form of a `googleMapsWidgetContextToken`. Use
this token to render the component and display the response.
[Learn more](https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/grounding-with-google-maps).
The event flow is as follows:

1. Call the Vertex AI API with a query grounded with Google Maps.
2. Vertex AI returns a `googleMapsWidgetContextToken`.
3. Render the Contextual View component using the token.
4. The Contextual View component displays the response from Vertex AI.

The following example shows how a context token looks when returned from the Vertex AI API.

```javascript
"googleMapsWidgetContextToken": "widgetcontent/AcBXPQdpWQWbap9H-OH8sEKmOXxmEKAYvff0tvthhneMQC3VrqWCjpnPBl4-Id98FGiA_S_t8aeAeJj0T6JkWFX56Bil8oBSR0W8JH3C_RSYLbTjxKdpxc9yNn6JcZTtolIRZon9xi6WpNGuSyjcIxWu2S0hwpasNOpUlWrG1RxVCB4WD1fsz_pwR236mG36lMxevXTQ_JnfdYNuQwQ4Lc3vn...<snip>...
Ts5VJE_b3IC5eE_6wez0nh61r7foTUZpP7BXMwxR-7Wyfcj6x1v6mIWsFGr1o0p_HSAMNqWPg-aFVnkPLhAkOR6MaNZOfezTva-gxHlu7z_haFvYxcUE1qfNVQ",
```

## Render the Contextual View component

To render and use the Contextual View component, use the alpha version of
the Maps JavaScript API on the page that displays the component. For more
information, see [Load the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api).
You must also use the API key that was enabled to load the Google Maps JavaScript API.
Verify that the `places` library has been loaded.

The following section describes how to render the Contextual View component.
Create the component by using custom HTML or programmatically in JavaScript.

## Use custom HTML elements

The following section describes how to render the Contextual View component
using custom HTML elements. Create the component by adding the `gmp-place-contextual`
element to the page.

1. Add the `gmp-place-contextual` element to the page:

   ```html
   <gmp-place-contextual id="cv_component"></gmp-place-contextual>
   ```
2.
   In any response that is grounded with Google Maps, there's a corresponding
   `googleMapsWidgetContextToken` that can be used to render the component.
   The following function shows how to update the context token:

   ```javascript
   let cv_component = document.querySelector('#cv_component');
   cv_component.contextToken = contextToken;
   ```
3. Optional: Specify the list layout. Valid values include the following:
   - Compact layout: `<gmp-place-contextual-list-config layout="compact">`
   - Vertical layout: `<gmp-place-contextual-list-config layout="vertical">`

   The following example shows how to change the list layout to compact:

   ```html
   <gmp-place-contextual id="cv_component">
     <gmp-place-contextual-list-config layout="compact">
     </gmp-place-contextual-list-config>
   </gmp-place-contextual>
   ```

## Use JavaScript

The following section describes how to render the Contextual View component
by programmatically creating a `PlaceContextualElement` and appending it to the DOM.

1. Create a contextual component.

   ```javascript
   let cv_component = document.querySelector('#cv_component');

   async function createComponent(contextToken) {
     await google.maps.importLibrary('places');
     const placeContextualElement = new
         google.maps.places.PlaceContextualElement({ contextToken }); // contextToken can be empty at initialization.
     cv_component.appendChild(placeContextualElement);
   }
   ```
2. In any response that's grounded with Google Maps, there's a corresponding `googleMapsWidgetContextToken` that's used to render the contextual widget. The following function shows how to update the context token:

   ```javascript
   cv_component.contextToken = contextToken;
   ```
3. Optional: Specify the list layout. Valid values include the following:
   - Compact layout: `google.maps.places.PlaceContextualListLayout.COMPACT`
   - Vertical layout: `google.maps.places.PlaceContextualListLayout.VERTICAL`
4. The following example shows how to change the list layout to compact:

```javascript
const config = new google.maps.places.PlaceContextualListConfigElement({
  layout: google.maps.places.PlaceContextualListLayout.COMPACT
});
cv_component.appendChild(config);
```

## Prohibited territories

Google Maps restricts certain content and activities to maintain a safe and reliable platform. For
a list of prohibited territories, see
[Google Maps
Platform Prohibited Territories](https://cloud.google.com/maps-platform/terms/maps-prohibited-territories).