---
doc_type: places_official_mirror
parent_skill: mde-maps
topic: place-photos-new
description: "Places API (New) — Place Photos media reference. Tertiary: verify billing, field names, and schemas against live developers.google.com and curated references/places-api-web-service.md."
--- 

Place photos lets you add high quality photographic content to your web pages. Access
millions of photos stored in the Places database, and get resizable images using Find Place,
Nearby Search, Text Search, Autocomplete, and Place Details.
<iframe src="https://maps-docs-team.web.app/samples/place-photos/dist/" allow="fullscreen; "></iframe>

#### See the complete example source code

This rudimentary photo carousel displays photos for the specified place, including the
required author attributions (shown in the upper left corner of the selected photo).

### TypeScript

```typescript
async function init() {
    const { Place } = await google.maps.importLibrary('places');

    // Use a place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: ['displayName', 'photos', 'editorialSummary'],
    });

    // Get the various HTML elements.
    const heading = document.getElementById('heading')!;
    const summary = document.getElementById('summary')!;
    const gallery = document.getElementById('gallery')!;
    const expandedImageDiv = document.getElementById('expanded-image')!;

    // Show the display name and summary for the place.
    heading.textContent = place.displayName!;
    summary.textContent = place.editorialSummary!;

    // Add photos to the gallery.
    place.photos?.forEach((photo) => {
        const altText = 'Photo of ' + place.displayName;
        const img = document.createElement('img');
        const imgButton = document.createElement('button');
        const expandedImage = document.createElement('img');
        img.src = photo?.getURI({ maxHeight: 380 });
        img.alt = altText;
        imgButton.addEventListener('click', (event) => {
            centerSelectedThumbnail(imgButton);
            event.preventDefault();
            expandedImage.src = img.src;
            expandedImage.alt = altText;
            expandedImageDiv.innerHTML = '';
            expandedImageDiv.appendChild(expandedImage);
            const attributionLabel = createAttribution(
                photo.authorAttributions[0]
            );
            expandedImageDiv.appendChild(attributionLabel);
        });

        imgButton.addEventListener('focus', () => {
            centerSelectedThumbnail(imgButton);
        });

        imgButton.appendChild(img);
        gallery.appendChild(imgButton);
    });

    // Display the first photo.
    if (place.photos && place.photos.length > 0) {
        const photo = place.photos[0];
        const img = document.createElement('img');
        img.alt = 'Photo of ' + place.displayName;
        img.src = photo.getURI();
        expandedImageDiv.appendChild(img);

        if (photo.authorAttributions && photo.authorAttributions.length > 0) {
            expandedImageDiv.appendChild(
                createAttribution(photo.authorAttributions[0])
            );
        }
    }

    // Helper function to create attribution DIV.
    function createAttribution(
        attribution: google.maps.places.AuthorAttribution
    ) {
        const attributionLabel = document.createElement('a');
        attributionLabel.classList.add('attribution-label');
        attributionLabel.textContent = attribution.displayName;
        attributionLabel.href = attribution.uri!;
        attributionLabel.target = '_blank';
        attributionLabel.rel = 'noopener noreferrer';
        return attributionLabel;
    }

    // Helper function to center the selected thumbnail in the gallery.
    function centerSelectedThumbnail(element: HTMLElement) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
async function init() {
    const { Place } = await google.maps.importLibrary('places');

    // Use a place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
    });

    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({
        fields: ['displayName', 'photos', 'editorialSummary'],
    });

    // Get the various HTML elements.
    const heading = document.getElementById('heading');
    const summary = document.getElementById('summary');
    const gallery = document.getElementById('gallery');
    const expandedImageDiv = document.getElementById('expanded-image');

    // Show the display name and summary for the place.
    heading.textContent = place.displayName;
    summary.textContent = place.editorialSummary;

    // Add photos to the gallery.
    place.photos?.forEach((photo) => {
        const altText = 'Photo of ' + place.displayName;
        const img = document.createElement('img');
        const imgButton = document.createElement('button');
        const expandedImage = document.createElement('img');
        img.src = photo?.getURI({ maxHeight: 380 });
        img.alt = altText;
        imgButton.addEventListener('click', (event) => {
            centerSelectedThumbnail(imgButton);
            event.preventDefault();
            expandedImage.src = img.src;
            expandedImage.alt = altText;
            expandedImageDiv.innerHTML = '';
            expandedImageDiv.appendChild(expandedImage);
            const attributionLabel = createAttribution(
                photo.authorAttributions[0]
            );
            expandedImageDiv.appendChild(attributionLabel);
        });

        imgButton.addEventListener('focus', () => {
            centerSelectedThumbnail(imgButton);
        });

        imgButton.appendChild(img);
        gallery.appendChild(imgButton);
    });

    // Display the first photo.
    if (place.photos && place.photos.length > 0) {
        const photo = place.photos[0];
        const img = document.createElement('img');
        img.alt = 'Photo of ' + place.displayName;
        img.src = photo.getURI();
        expandedImageDiv.appendChild(img);

        if (photo.authorAttributions && photo.authorAttributions.length > 0) {
            expandedImageDiv.appendChild(
                createAttribution(photo.authorAttributions[0])
            );
        }
    }

    // Helper function to create attribution DIV.
    function createAttribution(attribution) {
        const attributionLabel = document.createElement('a');
        attributionLabel.classList.add('attribution-label');
        attributionLabel.textContent = attribution.displayName;
        attributionLabel.href = attribution.uri;
        attributionLabel.target = '_blank';
        attributionLabel.rel = 'noopener noreferrer';
        return attributionLabel;
    }

    // Helper function to center the selected thumbnail in the gallery.
    function centerSelectedThumbnail(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }
}

void init();
```

### CSS

```css
/* 
 * Optional: Makes the sample page fill the window. 
 */
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}

#container {
    display: flex;
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;
    max-width: 950px;
    height: 100%;
    max-height: 400px;
    box-sizing: border-box;
}

.place-overview {
    width: 400px;
    height: 380px;
    overflow-x: auto;
    position: relative;
    margin-right: 20px;
}

#info {
    font-family: sans-serif;
    position: sticky;
    position: -webkit-sticky;
    left: 0;
    padding-bottom: 10px;
}

#heading {
    width: 500px;
    font-size: x-large;
    margin-bottom: 20px;
}

#summary {
    width: 100%;
}

#gallery {
    display: flex;
    padding-top: 10px;
}

#gallery img {
    width: 200px;
    height: 200px;
    margin: 10px;
    border-radius: 10px;
    cursor: pointer;
    object-fit: cover; /* fill the area without distorting the image */
}

#expanded-image {
    display: flex;
    height: 370px;
    overflow: hidden;
    background-color: #000;
    border-radius: 10px;
    margin: 0 auto;
}

.attribution-label {
    background-color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    font-family: sans-serif;
    margin: 2px;
    position: absolute;
}

button {
    display: flex;
    outline: none;
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
}

button:focus {
    border: 2px solid blue;
    border-radius: 10px;
}
```

### HTML

```html
<html lang="en">
    <head>
        <title>Place Photos</title>

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
        <div id="container">
            <div class="place-overview">
                <div id="info">
                    <h1 id="heading"></h1>
                    <div id="summary"></div>
                </div>
                <div id="gallery"></div>
            </div>
            <div id="expanded-image"></div>
        </div>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/place-photos/jsfiddle)

## Get photos

To get photos for a place, include the
[`photos`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.photos)
field in your [`fetchFields()`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.fetchFields)
request parameters. The resulting Place instance contains an array of
up to 10 [`Photo`](https://developers.google.com/maps/documentation/javascript/reference/place#Photo)
objects, from which you may access images and their required attribution information.
Call [`getURI()`](https://developers.google.com/maps/documentation/javascript/reference/place#Photo.getURI)
to return the source photo URI, using
[`PhotoOptions`](https://developers.google.com/maps/documentation/javascript/reference/places-service#PhotoOptions)
to set the maximum height and/or width of the returned image. If you specify a value for both
`maxHeight` and a `maxWidth`, the photo service will resize the image to the
smaller of the two sizes, while maintaining the original aspect ratio. If no dimension is
specified, the full-size image will be returned.

> [!CAUTION]
> **Caution:** Don't cache photo URIs or photos. Ensure you always get photo data from a fresh Place object. For more information, see the caching restrictions in Section 3.2.3(b)(No Caching) of the [Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms/).

The [`Photo`](https://developers.google.com/maps/documentation/javascript/reference/place#Photo) class
exposes the following properties:

- `authorAttributions`: An array of `AuthorAttribution` objects containing the required attribution text and URLs.
- `flagContentURI`: A link where the user can flag a problem with the photo.
- `googleMapsURI`: A link to show the photo on Google Maps.
- `heightPx`: The height of the photo in pixels.
- `widthPx`: The width of the photo in pixels.

The following example shows making a Place Details request for photos, calling `getURI()`
on a photo instance to return the source URI for the image, then adding the first photo result to
an `img` element (attributions are omitted for brevity):

```javascript
const { Place } = await google.maps.importLibrary('places');

// Use a place ID to create a new Place instance.
const place = new Place({
    id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
});

// Call fetchFields, passing the desired data fields.
await place.fetchFields({ fields: ['photos'] });

// Add the first photo to an img element.
const photoImg = document.getElementById('image-container');
photoImg.src = place.photos[0].getURI({maxHeight: 400});
```

### Author attributions

When you display a photo, you must also display the author attributions for the photo. Use the
[`AuthorAttribution`](https://developers.google.com/maps/documentation/javascript/reference/place#AuthorAttribution)
class to return attributions. An attribution includes the author's
name (`displayName`), a URI for their Google Maps profile (`uri`), and a URI
for the author's photo (`photoURI`). The following snippet shows returning the
`displayName`, `uri`, and `photoURI` for a place photo.

```javascript
  let name = place.photos[0].authorAttributions[0].displayName;
  let url = place.photos[0].authorAttributions[0].uri;
  let authorPhoto = place.photos[0].authorAttributions[0].photoURI;
```