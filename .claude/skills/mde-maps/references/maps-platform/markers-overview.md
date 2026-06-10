Select platform: [Android](https://developers.google.com/maps/documentation/android-sdk/advanced-markers/overview "View this page for the Android platform docs.") [iOS](https://developers.google.com/maps/documentation/ios-sdk/advanced-markers/overview "View this page for the iOS platform docs.") [JavaScript](https://developers.google.com/maps/documentation/javascript/advanced-markers/overview "View this page for the JavaScript platform docs.")

<br />

Use markers to display single locations on a map. This guide shows you how to
use advanced markers. With
advanced markers you can create and customize highly
performant markers, and make accessible markers that respond to DOM click events
and keyboard input. For even deeper customization,
advanced markers supports the use of custom HTML and CSS,
including the ability to create completely custom markers. For 3D applications
you can control the altitude at which a marker appears.
Advanced markers are supported on both raster and vector maps (though some features are not available on raster maps).
A map ID is required to use Advanced Markers (the `DEMO_MAP_ID` can be used).

> [!TIP]
> **Tip:** If your map uses [legacy markers](https://developers.google.com/maps/documentation/javascript/markers), consider [migrating to advanced markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration).

[Get started with advanced markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/start)

### Customize color, scale, and icon image

Customize the default marker's background, glyph, and border
color, and adjust marker size.

![A screenshot showing some customized markers.](https://developers.google.com/static/maps/documentation/javascript/advanced-markers/images/scale_and_color.png)

Replace the default marker icon with a custom SVG or PNG image.

![A screenshot showing custom SVG markers.](https://developers.google.com/static/maps/documentation/javascript/advanced-markers/images/image_markers.png)

### Create custom HTML markers

Use custom HTML and CSS to create visually distinctive
interactive markers, and create animations.

![A screenshot showing a custom HTML marker.](https://developers.google.com/static/maps/documentation/javascript/advanced-markers/images/html_marker.png)

### Make markers respond to click and keyboard events

Make a marker respond to clicks and keyboard events by adding a
`click` event listener.

```javascript
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.4239163, lng: -122.0947209},
    zoom: 17,
    mapId: 'DEMO_MAP_ID',
  });

  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: {lat: 37.4239163, lng: -122.0947209},
  });

  marker.addListener('click', ({domEvent, latLng}) => {
    const {target} = domEvent;
    // Handle the click event.
    // ...
  });
}
```

### Set marker altitude and collision behavior

Set the altitude for a marker to make it appear correctly with
3D map elements, and specify how a marker should behave when it collides with
another marker or map label. Marker altitude is only supported on vector maps.

![A screenshot showing an altitude-adjusted marker.](https://developers.google.com/static/maps/documentation/javascript/advanced-markers/images/marker_altitude.png)

## Next step

- [Get started with advanced markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/start)