<iframe src="https://developers.devsite.google/frame/maps/documentation/javascript/reference/advanced-markers_e699da711f98ff0dda69bb640fe680325d5dd6f849f87825c6b2abcdf380f1b5.frame" class="framebox inherit-locale redirect-iframe" allow="clipboard-write https://developers.devsite.google" allowfullscreen is-upgraded></iframe>

## [AdvancedMarkerElement](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement)
class


`google.maps.marker.AdvancedMarkerElement`
class

extends `https://developer.mozilla.org/docs/Web/API/HTMLElement`

implements `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions`

library `"marker"`

Shows a position on a map. Note that the `position` must be set for the `AdvancedMarkerElement` to display.

```html
   
<gmp-advanced-marker
  anchor-left="string"
  anchor-top="string"
  gmp-clickable
  position="lat,lng"
  title="string">
</gmp-advanced-marker>
```

```javascript
const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
```

| ### Constructor ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.constructor` | `AdvancedMarkerElement([options])` **Parameters:** - `options`: `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions optional` Creates an `AdvancedMarkerElement` with the options specified. If a map is specified, the `AdvancedMarkerElement` is added to the map upon construction. |

| ### Properties ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.anchorLeft` attr: anchor-left | **Type:** `string optional` **Default:** "-50%" A [CSS length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. **HTML attribute:** `anchor-left="string"` |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.anchorTop` attr: anchor-top | **Type:** `string optional` **Default:** "-100%" A [CSS length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. **HTML attribute:** `anchor-top="string"` |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.collisionBehavior` | **Type:** `https://developers.google.com/maps/documentation/javascript/reference/marker#CollisionBehavior optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.collisionBehavior`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.gmpClickable` attr: gmp-clickable | **Type:** `boolean optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpClickable`. **HTML attribute:** `gmp-clickable` |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.gmpDraggable` | **Type:** `boolean optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpDraggable`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.map` | **Type:** `https://developers.google.com/maps/documentation/javascript/reference/map#Map optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.map`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.position` attr: position | **Type:** `https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng|https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral|https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngAltitude|https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngAltitudeLiteral optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.position`. **HTML attribute:** - `position="lat,lng"` - `position="lat,lng,altitude"` |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.title` attr: title | **Type:** `string` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.title`. **HTML attribute:** `title="string"` |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.zIndex` | **Type:** `number optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.zIndex`. |
| `[element](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.element)` readonly | > [!WARNING] > **[Deprecated:](https://developers.google.com/maps/deprecations)** Use the AdvancedMarkerElement directly. **Type:** `https://developer.mozilla.org/docs/Web/API/HTMLElement` This field is read-only. The DOM Element backing the view. |
| `[content](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.content)` | > [!WARNING] > **[Deprecated:](https://developers.google.com/maps/deprecations)** Use [.children](https://developer.mozilla.org/docs/Web/API/Element/children) instead. **Type:** `https://developer.mozilla.org/docs/Web/API/Node optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.content`. |

| ### Methods ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.addListener` | `addListener(eventName, handler)` **Parameters:** - `eventName`: `string` Observed event. - `handler`: `https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function` Function to handle events. **Return Value:** `https://developers.google.com/maps/documentation/javascript/reference/event#MapsEventListener` Resulting event listener. Adds the given listener function to the given event name in the Maps Eventing system. |

| ### Events ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.click` | `function(event)` **Arguments:** - `event`: `https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent` This event is fired when the `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement` element is clicked. Not available with `addEventListener()` (use `gmp-click` instead). |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.drag` | `function(event)` **Arguments:** - `event`: `https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent` This event is repeatedly fired while the user drags the `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement`. Not available with `addEventListener()`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.dragend` | `function(event)` **Arguments:** - `event`: `https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent` This event is fired when the user stops dragging the `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement`. Not available with `addEventListener()`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.dragstart` | `function(event)` **Arguments:** - `event`: `https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent` This event is fired when the user starts dragging the `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement`. Not available with `addEventListener()`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.gmp-click` | `function(event)` **Arguments:** - `event`: `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerClickEvent` This event is fired when the `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement` element is clicked. Best used with `addEventListener()` (instead of `addListener()`). |

## [AdvancedMarkerElementOptions](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions)
interface


`google.maps.marker.AdvancedMarkerElementOptions`
interface

Options for constructing an `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement`.

| ### Properties ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.anchorLeft` optional | **Type:** `string optional` **Default:** "-50%" A [CSS length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.anchorTop` optional | **Type:** `string optional` **Default:** "-100%" A [CSS length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.collisionBehavior` optional | **Type:** `https://developers.google.com/maps/documentation/javascript/reference/marker#CollisionBehavior optional` An enumeration specifying how an `AdvancedMarkerElement` should behave when it collides with another `AdvancedMarkerElement` or with the basemap labels on a vector map. **Note** : `AdvancedMarkerElement` to `AdvancedMarkerElement` collision works on both raster and vector maps, however, `AdvancedMarkerElement` to base map's label collision only works on vector maps. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.content` optional | **Type:** `https://developer.mozilla.org/docs/Web/API/Node optional` **Default:** `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement` The DOM Element backing the visual of an `AdvancedMarkerElement`. **Note** : `AdvancedMarkerElement` does not clone the passed-in DOM element. Once the DOM element is passed to an `AdvancedMarkerElement`, passing the same DOM element to another `AdvancedMarkerElement` will move the DOM element and cause the previous `AdvancedMarkerElement` to look empty. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpClickable` optional | **Type:** `boolean optional` **Default:** `false` If `true`, the `AdvancedMarkerElement` will be clickable and trigger the `gmp-click` event, and will be interactive for accessibility purposes (e.g. allowing keyboard navigation via arrow keys). |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpDraggable` optional | **Type:** `boolean optional` **Default:** `false` If `true`, the `AdvancedMarkerElement` can be dragged. **Note** : `AdvancedMarkerElement` with altitude is not draggable. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.map` optional | **Type:** `https://developers.google.com/maps/documentation/javascript/reference/map#Map optional` Map on which to display the `AdvancedMarkerElement`. The map is required to display the `AdvancedMarkerElement` and can be provided by setting `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.map` if not provided at the construction. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.position` optional | **Type:** `https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng|https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral|https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngAltitude|https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngAltitudeLiteral optional` Sets the `AdvancedMarkerElement`'s position. An `AdvancedMarkerElement` may be constructed without a position, but will not be displayed until its position is provided - for example, by a user's actions or choices. An `AdvancedMarkerElement`'s position can be provided by setting `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement.position` if not provided at the construction. **Note** : `AdvancedMarkerElement` with altitude is only supported on vector maps. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.title` optional | **Type:** `string optional` Rollover text. If provided, an accessibility text (e.g. for use with screen readers) will be added to the `AdvancedMarkerElement` with the provided value. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.zIndex` optional | **Type:** `number optional` All `AdvancedMarkerElement`s are displayed on the map in order of their zIndex, with higher values displaying in front of `AdvancedMarkerElement`s with lower values. By default, `AdvancedMarkerElement`s are displayed according to their vertical position on screen, with lower `AdvancedMarkerElement`s appearing in front of `AdvancedMarkerElement`s farther up the screen. Mixing markers with an explicit `zIndex` and markers without one can lead to unexpected visual results. To ensure predictable behavior, it is recommended to either set the `zIndex` for all markers or leave it unset. Note that `zIndex` is also used to help determine relative priority between `https://developers.google.com/maps/documentation/javascript/reference/marker#CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY` Advanced Markers. A higher `zIndex` value indicates higher priority. |

## [AdvancedMarkerClickEvent](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerClickEvent)
class


`google.maps.marker.AdvancedMarkerClickEvent`
class

extends `https://developer.mozilla.org/docs/Web/API/Event`

library `"marker"`

This event is created from clicking an Advanced Marker. Access the marker's position with `event.target.position`.

```javascript
const {AdvancedMarkerClickEvent} = await google.maps.importLibrary("marker");
```

## [PinElement](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement)
class


`google.maps.marker.PinElement`
class

extends `https://developer.mozilla.org/docs/Web/API/HTMLElement`

implements `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions`

library `"marker"`

A `PinElement` represents a DOM element that consists of a shape and a glyph. The shape has the same balloon style as seen in the default `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement` or `https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Marker3DElement`. The glyph is an optional DOM element displayed in the balloon shape. A `PinElement` may have a different aspect ratio depending on its `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.scale`.  

```javascript
const {PinElement} = await google.maps.importLibrary("marker");
```

| ### Constructor ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.constructor` | `PinElement([options])` **Parameters:** - `options`: `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions optional` |

| ### Properties ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.background` | **Type:** `string optional` The background color of the pin shape. See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.background`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.borderColor` | **Type:** `string optional` The border color of the pin shape. See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.borderColor`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.glyphColor` | **Type:** `string optional` The color of the pin glyph. See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphColor`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.glyphSrc` | **Type:** `https://developer.mozilla.org/docs/Web/API/URL|string optional` The source of the glyph image to be displayed in the pin. See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphSrc`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.glyphText` | **Type:** `string optional` The text displayed in the pin. See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphText`. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.scale` | **Type:** `number optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.scale`. |
| `[element](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.element)` readonly | > [!WARNING] > **[Deprecated:](https://developers.google.com/maps/deprecations)** Use the PinElement directly. **Type:** `https://developer.mozilla.org/docs/Web/API/HTMLElement` This field is read-only. The DOM Element backing the view. |
| `[glyph](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement.glyph)` | > [!WARNING] > **[Deprecated:](https://developers.google.com/maps/deprecations)** Use `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphText` or `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphSrc` instead. **Type:** `string|https://developer.mozilla.org/docs/Web/API/Element|https://developer.mozilla.org/docs/Web/API/URL optional` See `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyph`. |

| ### Methods ||
|---|---|

## [PinElementOptions](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions)
interface


`google.maps.marker.PinElementOptions`
interface

Options for creating a `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement`.

| ### Properties ||
|---|---|
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.background` optional | **Type:** `string optional` The background color of the pin shape. Supports any CSS [color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.borderColor` optional | **Type:** `string optional` The border color of the pin shape. Supports any CSS [color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). |
| `[glyph](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyph)` optional | > [!WARNING] > **[Deprecated:](https://developers.google.com/maps/deprecations)** Use `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphText` or `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphSrc` instead. **Type:** `string|https://developer.mozilla.org/docs/Web/API/Element|https://developer.mozilla.org/docs/Web/API/URL optional` The DOM element displayed in the pin. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphColor` optional | **Type:** `string optional` The color of the glyph. Supports any CSS [color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphSrc` optional | **Type:** `https://developer.mozilla.org/docs/Web/API/URL|string optional` The source of the glyph image to be displayed in the pin. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.glyphText` optional | **Type:** `string optional` The text displayed in the pin. |
| `https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions.scale` optional | **Type:** `number optional` **Default:** `1` The scale of the pin. |