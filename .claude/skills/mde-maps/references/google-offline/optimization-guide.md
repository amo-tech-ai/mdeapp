---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: optimization-guide
description: "Offline Google Maps Platform doc export (optimization-guide). Tertiary: verify against live developers.google.com and curated references/*.md."
---

This guide describes several strategies to optimize your Google Maps APIs
usage in terms of security, performance, and consumption.

## Security

### Reviewing security best practices

API keys are project-centric credentials that deserve the same precautions
as user IDs and passwords. Review the
[API Security Best Practices](https://developers.google.com/maps/api-security-best-practices) to secure your keys from
unintended use which could lead to undue quota usage and unexpected charges
to your account.

### Using API keys to access Maps APIs

API keys are the preferred authentication method for accessing
Google Maps APIs. While using the client IDs is still
supported, API keys support finer-grained security controls and can be tuned to
work with specific web addresses, IP addresses, and mobile SDKs (Android and
iOS). For information on creating and securing an API key, go to the "Using an
API Key" page for each API or SDK. (For example, for the
Maps JavaScript API, visit its page on [Using an API
Key](https://developers.google.com/maps/documentation/javascript/get-api-key).)

## Performance

### Using exponential backoff to handle errors

[Video](https://www.youtube.com/watch?v=eXNqP9k-oj8)

If your apps experience errors from excessive attempts to call an API
within a short period of time, such as quota errors, consider using
[exponential backoff](http://en.wikipedia.org/wiki/Exponential_backoff) to let the requests process.
Exponential backoff is most useful for errors in the 500s.

Specifically, adjust the pace of your queries. In your code, add
a waiting period of **`S`** seconds between queries. If the query still results
in a quota error, double the waiting period and then send another query. Continue
adjusting the waiting period until the query returns without an error.

### Sending user-interaction requests on demand

Requests to APIs that include user interaction should be sent only on demand.
This means waiting for the end user to perform an action (such as `on-click`)
to initiate the API request, then using the results to load a map, set a
destination, or display appropriate information. Using an on-demand approach
avoids unnecessary requests to the APIs, reducing API consumption.

### Avoiding displaying overlay content when a map is moving

Avoid using `Draw()` to display custom overlay content on a map at the same
time that a user might be moving the map. Since the map is redrawn every time
a user moves the map, placing overlay content on the map at the same time can
introduce lag or visual stuttering. Only add or remove overlay content from a
map once the user stops panning or zooming.

### Avoiding intensive operations in `Draw` methods

As a general rule, it is good practice to avoid performance-intensive
non-drawing operations in a `Draw()` method. For example, avoid
the following in your `Draw()` method code:

- Queries that return a large amount of content.
- Many changes to the data being displayed.
- Manipulating many Document Object Model (DOM) elements.

These operations can slow performance and introduce lag or visual stuttering
when the map renders.

### Using raster images for markers

Use raster images, such as images in .PNG or .JPG format, when adding
markers to identify a location on a map. Avoid using Scalable Vector
Graphics (SVG) images, since rendering SVG images can introduce lag when
the map is redrawn.

### Optimizing markers

Optimization enhances performance by rendering many markers as a single static
element. This is useful in cases where a large number of markers is required.
By default, the Maps JavaScript API will decide whether a marker
will be optimized. When there is a large number of markers, the
Maps JavaScript API will attempt to render markers with
optimization. Not all Markers can be optimized; in some situations, the
Maps JavaScript API may need to render Markers without
optimization. Disable optimized rendering for animated GIFs or PNGs, or when
each marker must be rendered as a separate DOM element.

### Creating clusters to manage marker display

To help manage the display of markers to identify locations on a map,
create a marker cluster using the
[Marker Clusterer](https://github.com/googlemaps/js-marker-clusterer) library.
The Marker Clusterer library includes options for:

- Grid size, to specify the number of markers to group together in a cluster.
- Maximum zoom, to specify the maximum zoom level in which to display the cluster.
- Image paths, for the graphics images to use as marker icons.

## Consumption

For information on managing your Google Maps Platform costs, including
creating budgets, modifying quotas, and setting alerts, see
[Manage costs](https://developers.google.com/maps/billing-and-pricing/manage-costs).