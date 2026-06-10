---
doc_type: maps_platform_mirror
parent_skill: mde-maps
topic: maps-javascript-events
title: Maps JavaScript API — Events (UI and errors)
description: "Listening for map and Places UI events and error events. Tertiary: verify against live developers.google.com."
---

This page describes the user interface events and error events that you can listen for and handle
programmatically.

## User Interface Events

JavaScript within the browser is *event driven* , meaning that
JavaScript responds to interactions by generating events, and expects
a program to *listen* to interesting events. There are two types of
events:

- User events (such as "click" mouse events) are propagated from the DOM to the Maps JavaScript API. These events are separate and distinct from standard DOM events.
- MVC state change notifications reflect changes in Maps JavaScript API objects and are named using a `property_changed` convention.

Each Maps JavaScript API object exports a number of named events.
Programs interested in certain events will register JavaScript **event listeners**
for those events and execute code when those events are received by
calling `addListener()` to register event handlers on the object.

The following sample shows you which events are triggered by the `google.maps.Map`
as you interact with the map.
<iframe src="https://maps-docs-team.web.app/samples/map-events/dist/" allow="fullscreen; "></iframe>

For a complete list of events, consult the
[Maps JavaScript API Reference](https://developers.google.com/maps/documentation/javascript/reference).
Events are listed in a separate section for each object which contains events.

### UI Events

Some objects within the Maps JavaScript API are designed to respond
to user events such as mouse or keyboard events. For example, these are some of the user
events that a `google.maps.marker.AdvancedMarkerElement` object can listen to:

- `'click'`
- `'drag'`
- `'dragend'`
- `'dragstart'`
- `'gmp-click'`

For the full list, see the
[AdvancedMarkerElement](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers)
class. These events may look like standard DOM events, but they are actually part
of the Maps JavaScript API. Because different browsers
implement different DOM event models, the Maps JavaScript API
provides these mechanisms to listen for and respond to DOM events without needing to
handle the various cross-browser peculiarities. These events also typically pass arguments
within the event noting some UI state (such as the mouse position).

### MVC State Changes

MVC objects typically contain state. Whenever an object's property changes,
the Maps JavaScript API will fire an event that the property has changed.
For example, the API will fire a `zoom_changed` event on a map when the map's zoom
level changes. You can intercept these state changes by calling
`addListener()` to register event handlers on the object as well.

User events and MVC state changes may look similar, but you should treat them differently in your
code. MVC events, for example, don't pass arguments within their event. Inspect the property that
changed on an MVC state change by calling the appropriate `getProperty`
method on that object.

## Handle Events

To register for event notifications, use the `addListener()`
event handler. That method takes an event to listen for, and a
function to call when the specified event occurs.

### Example: Map and Marker Events

The following code mixes user events with state change events. This example attaches an event
handler to a marker that zooms the map when clicked. It also attaches an event handler to the map
for changes to the `center` property and pans the map back to the marker after 3
seconds on receipt of the `center_changed` event.

### TypeScript

```typescript
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }, { LatLng }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('core'),
        google.maps.importLibrary('maps'),
    ]);

    // Retrieve the map element.
    const mapElement = document.querySelector('gmp-map')!;

    // Get the inner map from the map element.
    const innerMap = mapElement.innerMap;

    const originalPosition = new LatLng(mapElement.center!);

    const marker = new AdvancedMarkerElement({
        position: originalPosition,
        map: innerMap,
        title: 'Click to zoom',
        gmpClickable: true,
    });

    innerMap.addListener('center_changed', () => {
        // 3 seconds after the center of the map has changed,
        // pan back to the marker.
        window.setTimeout(() => {
            innerMap.panTo(originalPosition);
        }, 3000);
    });

    // Zoom in when the marker is clicked.
    marker.addEventListener('gmp-click', () => {
        innerMap.setZoom(8);
        innerMap.setCenter(originalPosition);
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }, { LatLng }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('core'),
        google.maps.importLibrary('maps'),
    ]);

    // Retrieve the map element.
    const mapElement = document.querySelector('gmp-map');

    // Get the inner map from the map element.
    const innerMap = mapElement.innerMap;

    const originalPosition = new LatLng(mapElement.center);

    const marker = new AdvancedMarkerElement({
        position: originalPosition,
        map: innerMap,
        title: 'Click to zoom',
        gmpClickable: true,
    });

    innerMap.addListener('center_changed', () => {
        // 3 seconds after the center of the map has changed,
        // pan back to the marker.
        window.setTimeout(() => {
            innerMap.panTo(originalPosition);
        }, 3000);
    });

    // Zoom in when the marker is clicked.
    marker.addEventListener('gmp-click', () => {
        innerMap.setZoom(8);
        innerMap.setCenter(originalPosition);
    });
}

void init();
```
[View example](https://developers.google.com/maps/documentation/javascript/examples/event-simple)

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/event-simple/jsfiddle)

**Tip** : If you're trying to detect a change in
the viewport, be sure to use the specific `bounds_changed` event
rather than constituent `zoom_changed` and
`center_changed` events. Because the Maps JavaScript API
fires these latter events independently, `getBounds()` may not report useful results
until after the viewport has authoritatively changed. If you want to
`getBounds()` after such an event, be sure to listen to the
`bounds_changed` event instead.

### Example: Shape Editing and Dragging Events

When a shape is edited or dragged, an event is fired upon completion of the
action. For a list of the events and some code snippets, see
[Shapes](https://developers.google.com/maps/documentation/javascript/shapes#editable_events).

[View
example (rectangle-event.html)](https://developers.google.com/maps/documentation/javascript/examples/rectangle-event)

## Access Arguments in UI Events

UI events within the Maps JavaScript API typically pass an event argument,
which can be accessed by the event listener, noting the UI state when the
event occurred. For example, a UI `'click'` event typically passes
a `MouseEvent` containing a `latLng` property denoting
the clicked location on the map. Note that this behavior is unique to UI
events; MVC state changes don't pass arguments in their events.

You can access the event's arguments within an event listener the same way
you would access an object's properties. The following example adds an event
listener for the map, and creates a marker when the user clicks on the map at
the clicked location.

### TypeScript

```typescript
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    innerMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;
        new AdvancedMarkerElement({
            position: event.latLng,
            map: innerMap,
        });
        innerMap.panTo(event.latLng);
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    innerMap.addListener('click', (event) => {
        if (!event.latLng) return;
        new AdvancedMarkerElement({
            position: event.latLng,
            map: innerMap,
        });
        innerMap.panTo(event.latLng);
    });
}

void init();
```
[View example](https://developers.google.com/maps/documentation/javascript/examples/event-arguments)

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/event-arguments/jsfiddle)

## Use Closures in Event Listeners

When executing an event listener, it is often advantageous to have both
private and persistent data attached to an object. JavaScript does not
support "private" instance data, but it does support
[closures](http://www.jibbering.com/faq/faq_notes/closures.html) which allows inner functions to access outer
variables. Closures are useful within event listeners to access variables not
normally attached to the objects on which events occur.

The following example uses a function closure in the event listener to
assign a secret message to a set of markers. Clicking on each marker will
reveal a portion of the secret message, which is not contained within the
marker itself.

### TypeScript

```typescript
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const bounds: google.maps.LatLngBoundsLiteral = {
        north: -25.363882,
        south: -31.203405,
        east: 131.044922,
        west: 125.244141,
    };

    // Display the area between the location southWest and northEast.
    innerMap.fitBounds(bounds);

    // Add 5 markers to map at random locations.
    // For each of these markers, give them a title with their index, and when
    // they are clicked they should open an infoWindow with text from a secret
    // message.
    const secretMessages = ['This', 'is', 'the', 'secret', 'message'];
    const lngSpan = bounds.east - bounds.west;
    const latSpan = bounds.north - bounds.south;

    for (const secretMessage of secretMessages) {
        const marker = new AdvancedMarkerElement({
            position: {
                lat: bounds.south + latSpan * Math.random(),
                lng: bounds.west + lngSpan * Math.random(),
            },
            map: innerMap,
        });

        void attachSecretMessage(marker, secretMessage);
    }
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
async function attachSecretMessage(
    marker: google.maps.marker.AdvancedMarkerElement,
    secretMessage: string
) {
    const { InfoWindow } = await google.maps.importLibrary('maps');

    const infoWindow = new InfoWindow({
        content: secretMessage,
    });

    marker.addListener('gmp-click', () => {
        infoWindow.open(marker.map, marker);
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('maps'),
    ]);

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    const bounds = {
        north: -25.363882,
        south: -31.203405,
        east: 131.044922,
        west: 125.244141,
    };

    // Display the area between the location southWest and northEast.
    innerMap.fitBounds(bounds);

    // Add 5 markers to map at random locations.
    // For each of these markers, give them a title with their index, and when
    // they are clicked they should open an infoWindow with text from a secret
    // message.
    const secretMessages = ['This', 'is', 'the', 'secret', 'message'];
    const lngSpan = bounds.east - bounds.west;
    const latSpan = bounds.north - bounds.south;

    for (const secretMessage of secretMessages) {
        const marker = new AdvancedMarkerElement({
            position: {
                lat: bounds.south + latSpan * Math.random(),
                lng: bounds.west + lngSpan * Math.random(),
            },
            map: innerMap,
        });

        void attachSecretMessage(marker, secretMessage);
    }
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
async function attachSecretMessage(marker, secretMessage) {
    const { InfoWindow } = await google.maps.importLibrary('maps');

    const infoWindow = new InfoWindow({
        content: secretMessage,
    });

    marker.addListener('gmp-click', () => {
        infoWindow.open(marker.map, marker);
    });
}

void init();
```
[View example](https://developers.google.com/maps/documentation/javascript/examples/event-closure)

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/event-closure/jsfiddle)

## Get and Set Properties within Event Handlers

None of the MVC state change events in the Maps JavaScript API event system pass
arguments when the event is triggered. (User events do
pass arguments which can be inspected.) If you need to inspect a property
on an MVC state change, you should explicitly call the appropriate
`getProperty()` method on that object. This
inspection will always retrieve the *current state* of the MVC
object, which may not be the state when the event was first fired.

**Note** : Explicitly setting a property within
an event handler which responds to a state change of *that particular
property* may produce unpredictable and/or unwanted behavior. Setting
such a property will trigger a new event, for example, and if you always
set a property within this event handler, you may end up creating an
infinite loop.

The example below shows how to set up an event handler to respond to
zoom events by bringing up an info window displaying that level.

### TypeScript

```typescript
async function init() {
    // Request needed libraries.
    const { InfoWindow } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const infoWindow = new InfoWindow({
        content: 'Change the zoom level',
        position: mapElement.center,
    });

    infoWindow.open(innerMap);

    innerMap.addListener('zoom_changed', () => {
        infoWindow.setContent('Zoom: ' + innerMap.getZoom()!);
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function init() {
    // Request needed libraries.
    const { InfoWindow } = await google.maps.importLibrary('maps');

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    const infoWindow = new InfoWindow({
        content: 'Change the zoom level',
        position: mapElement.center,
    });

    infoWindow.open(innerMap);

    innerMap.addListener('zoom_changed', () => {
        infoWindow.setContent('Zoom: ' + innerMap.getZoom());
    });
}

void init();
```
[View example](https://developers.google.com/maps/documentation/javascript/examples/event-properties)

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/event-properties/jsfiddle)

## Remove Event Listeners

To remove a specific event listener, it must have been assigned to a
variable. You can then call `removeListener()`,
passing the variable name to which the listener was assigned.

```javascript
var listener1 = marker.addListener('click', aFunction);

google.maps.event.removeListener(listener1);
```

To remove all listeners from a particular instance, call
`clearInstanceListeners()`, passing the instance name.

```javascript
var listener1 = marker.addListener('click', aFunction);
var listener2 = marker.addListener('mouseover', bFunction);

// Remove listener1 and listener2 from marker instance.
google.maps.event.clearInstanceListeners(marker);
```

To remove all listeners for a specific event type for a specific instance,
call `clearListeners()`, passing the instance name and the event
name.

```javascript
marker.addListener('click', aFunction);
marker.addListener('click', bFunction);
marker.addListener('click', cFunction);

// Remove all click listeners from marker instance.
google.maps.event.clearListeners(marker, 'click');
```

For more information, refer to the reference documentation for the
[google.maps.event namespace](https://developers.google.com/maps/documentation/javascript/reference?csw=1#event).

## Listen for authentication errors


If you want to programmatically detect an authentication failure (for example
to automatically send a beacon) you can prepare a callback function.
If the following global function is defined it will be called when the
authentication fails.

`function gm_authFailure() { /* Code */ };`

In TypeScript, it might be necessary to add the function to the global scope as shown below:

```typescript
// Define the callback function.
window.gm_authFailure = () => {
  console.error("Google Maps failed to authenticate.");
  /* Code */
};

// Add gm_authFailure to the global scope.
declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
export {};
```