 

#### See the complete example source code

This example retrieves place details including the first place review, and displays
the information in an info window.

### TypeScript

```typescript
let innerMap: google.maps.Map;
let infoWindow: google.maps.InfoWindow;
const mapElement = document.querySelector('gmp-map')!;

async function init() {
    // Import the needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement }, { Place }] =
        await Promise.all([
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('marker'),
            google.maps.importLibrary('places'),
        ]);

    innerMap = mapElement.innerMap;

    // Create a new Place instance.
    const place = new Place({
        id: 'ChIJpyiwa4Zw44kRBQSGWKv4wgA', // Faneuil Hall Marketplace, Boston, MA
    });

    // Call fetchFields, passing 'reviews' and other needed fields.
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'reviews'],
    });

    // Create an HTML container.
    const content = document.createElement('div');
    const title = document.createElement('div');
    const rating = document.createElement('div');
    const address = document.createElement('div');
    const review = document.createElement('div');
    const authorLink = document.createElement('a');

    // If there are any reviews display the first one.
    if (place.reviews && place.reviews.length > 0) {
        // Get info for the first review.
        const reviewRating = place.reviews[0].rating;
        const reviewText = place.reviews[0].text;
        const authorName = place.reviews[0].authorAttribution!.displayName;
        const authorUri = place.reviews[0].authorAttribution!.uri;

        // Safely populate the HTML.
        title.textContent = place.displayName || '';
        address.textContent = place.formattedAddress || '';
        rating.textContent = `Rating: ${reviewRating} stars`;
        review.textContent = reviewText || '';
        authorLink.textContent = authorName;
        authorLink.href = authorUri || '';
        authorLink.target = '_blank';

        content.appendChild(title);
        content.appendChild(address);
        content.appendChild(rating);
        content.appendChild(review);
        content.appendChild(authorLink);
    } else {
        content.textContent = `No reviews were found for ${place.displayName}.`;
    }

    // Create an infoWindow to display the review.
    infoWindow = new InfoWindow({
        content,
        ariaLabel: place.displayName,
    });

    // Add a marker.
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    innerMap.setCenter(place.location!);

    // Show the info window.
    infoWindow.open({
        anchor: marker,
        map: innerMap,
    });
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
let innerMap;
let infoWindow;
const mapElement = document.querySelector('gmp-map');

async function init() {
    // Import the needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement }, { Place }] =
        await Promise.all([
            google.maps.importLibrary('maps'),
            google.maps.importLibrary('marker'),
            google.maps.importLibrary('places'),
        ]);

    innerMap = mapElement.innerMap;

    // Create a new Place instance.
    const place = new Place({
        id: 'ChIJpyiwa4Zw44kRBQSGWKv4wgA', // Faneuil Hall Marketplace, Boston, MA
    });

    // Call fetchFields, passing 'reviews' and other needed fields.
    await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'reviews'],
    });

    // Create an HTML container.
    const content = document.createElement('div');
    const title = document.createElement('div');
    const rating = document.createElement('div');
    const address = document.createElement('div');
    const review = document.createElement('div');
    const authorLink = document.createElement('a');

    // If there are any reviews display the first one.
    if (place.reviews && place.reviews.length > 0) {
        // Get info for the first review.
        const reviewRating = place.reviews[0].rating;
        const reviewText = place.reviews[0].text;
        const authorName = place.reviews[0].authorAttribution.displayName;
        const authorUri = place.reviews[0].authorAttribution.uri;

        // Safely populate the HTML.
        title.textContent = place.displayName || '';
        address.textContent = place.formattedAddress || '';
        rating.textContent = `Rating: ${reviewRating} stars`;
        review.textContent = reviewText || '';
        authorLink.textContent = authorName;
        authorLink.href = authorUri || '';
        authorLink.target = '_blank';

        content.appendChild(title);
        content.appendChild(address);
        content.appendChild(rating);
        content.appendChild(review);
        content.appendChild(authorLink);
    } else {
        content.textContent = `No reviews were found for ${place.displayName}.`;
    }

    // Create an infoWindow to display the review.
    infoWindow = new InfoWindow({
        content,
        ariaLabel: place.displayName,
    });

    // Add a marker.
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.location,
        title: place.displayName,
    });

    innerMap.setCenter(place.location);

    // Show the info window.
    infoWindow.open({
        anchor: marker,
        map: innerMap,
    });
}

void init();
```

### CSS

```css
/* 
 * Always set the map height explicitly to define the size of the div element
 * that contains the map. 
 */
gmp-map {
    height: 100%;
}

/* 
 * Optional: Makes the sample page fill the window. 
 */
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}
```

### HTML

```html
<html>
    <head>
        <title>Place Reviews</title>

        <link rel="stylesheet" type="text/css" href="./style.css" />
        <script type="module" src="./index.js"></script>
        <script>
            // prettier-ignore
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"
            });
        </script>
    </head>
    <body>
        <gmp-map
            center="42.349134, -71.083184"
            zoom="14"
            map-id="4504f8b37365c3d0">
        </gmp-map>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-reviews/jsfiddle)

## Get reviews for a place

To get review data for a place, include the `reviews` field in your `fetchFields()`
request parameters. The resulting Place instance contains an array of `Review` objects,
from which you may access the needed review information.

The following example shows making a Place Details request for reviews.

```javascript
// Create a new Place instance.
const place = new Place({
    id: 'ChIJpyiwa4Zw44kRBQSGWKv4wgA', // Faneuil Hall Marketplace, Boston, MA
});

// Call fetchFields, passing 'reviews' and other needed fields.
await place.fetchFields({
    fields: ['displayName', 'formattedAddress', 'location', 'reviews'],
});

// Create an HTML container.
const content = document.createElement('div');
const title = document.createElement('div');
const rating = document.createElement('div');
const address = document.createElement('div');
const review = document.createElement('div');
const authorLink = document.createElement('a');

// If there are any reviews display the first one.
if (place.reviews && place.reviews.length > 0) {
    // Get info for the first review.
    const reviewRating = place.reviews[0].rating;
    const reviewText = place.reviews[0].text;
    const authorName = place.reviews[0].authorAttribution.displayName;
    const authorUri = place.reviews[0].authorAttribution.uri;

    // Safely populate the HTML.
    title.textContent = place.displayName || '';
    address.textContent = place.formattedAddress || '';
    rating.textContent = `Rating: ${reviewRating} stars`;
    review.textContent = reviewText || '';
    authorLink.textContent = authorName;
    authorLink.href = authorUri || '';
    authorLink.target = '_blank';

    content.appendChild(title);
    content.appendChild(address);
    content.appendChild(rating);
    content.appendChild(review);
    content.appendChild(authorLink);
} else {
    content.textContent = `No reviews were found for ${place.displayName}.`;
}

// Create an infoWindow to display the review.
infoWindow = new InfoWindow({
    content,
    ariaLabel: place.displayName,
});
```

The [`Review`](https://developers.google.com/maps/documentation/javascript/reference/place#Review)
instance contains the following:

- An `AuthorAttribution`
- The `rating` given by the user.
- The `publishTime` (Date), and `relativePublishTimeDescription` (review time relative to the current time for example "a month ago").
- The review `text`.
- The `textLanguageCode` indicating the language in which the review is written.

To get the overall rating for the place, use the `Place.rating` property (you must
request the `rating` field in your `fetchFields()` request parameters).

### Author attributions

When you display a review, you must also display the author attributions for the review. Use the
[`AuthorAttribution`](https://developers.google.com/maps/documentation/javascript/reference/place#AuthorAttribution)
class to return attributions. An attribution includes the author's name
(`displayName`), a URI for their Google Maps profile (`uri`), and a URI
for the author's photo (`photoURI`). The following snippet shows returning the
`displayName`, `uri`, and `photoURI` for an attribution.

```javascript
  let authorName = place.reviews[0].authorAttribution!.displayName;
  let authorUri = place.reviews[0].authorAttribution!.uri;
  let authorPhoto = place.reviews[0].authorAttribution!.photoURI;
```