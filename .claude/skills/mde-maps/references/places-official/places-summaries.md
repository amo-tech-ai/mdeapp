<iframe src="https://maps-docs-team.web.app/samples/ai-powered-summaries/dist/" allow="fullscreen; "></iframe>

#### See the complete example source code

Search for places to see the AI-powered summaries. Some suggested searches:

- "Hotel" for neighborhood summaries.
- "EV charging station" for EVCS amenity summaries.
- Any restaurant or business for place and review summaries.

### TypeScript

```typescript
// Define DOM elements.
const mapElement = document.querySelector('gmp-map')!;
const placeAutocomplete = document.querySelector('gmp-place-autocomplete')!;
const summaryPanel = document.getElementById('summary-panel')!;
const placeName = document.getElementById('place-name')!;
const placeAddress = document.getElementById('place-address')!;
const tabContainer = document.getElementById('tab-container')!;
const summaryContent = document.getElementById('summary-content')!;
const aiDisclosure = document.getElementById('ai-disclosure')!;
const flagContentLink = document.getElementById(
    'flag-content-link'
) as HTMLAnchorElement;

let innerMap: google.maps.Map;
let marker: google.maps.marker.AdvancedMarkerElement;

async function init(): Promise<void> {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    // Bind autocomplete bounds to map bounds.
    innerMap.addListener('bounds_changed', () => {
        placeAutocomplete.locationRestriction = innerMap.getBounds()!;
    });

    // Create the marker.
    marker = new AdvancedMarkerElement({
        map: innerMap,
    });

    // Handle selection of an autocomplete result.
    placeAutocomplete.addEventListener(
        'gmp-select',
        async ({ placePrediction }) => {
            const place = placePrediction.toPlace();

            // Fetch all summary fields.
            await place.fetchFields({
                fields: [
                    'displayName',
                    'formattedAddress',
                    'location',
                    'generativeSummary',
                    'neighborhoodSummary',
                    'reviewSummary',
                    'evChargeAmenitySummary',
                ],
            });

            // Update the map viewport and position the marker.
            if (place.viewport) {
                innerMap.fitBounds(place.viewport);
            } else {
                innerMap.setCenter(place.location!);
                innerMap.setZoom(17);
            }
            marker.position = place.location;

            // Update the panel UI.
            updateSummaryPanel(place);
        }
    );
}

function updateSummaryPanel(place: google.maps.places.Place) {
    // Reset UI
    summaryPanel.classList.remove('hidden');
    tabContainer.innerHTML = ''; // innerHTML is OK here since we're clearing known child elements.
    summaryContent.textContent = '';
    aiDisclosure.textContent = '';

    placeName.textContent = place.displayName || '';
    placeAddress.textContent = place.formattedAddress || '';

    let firstTabActivated = false;

    /**
     * Safe Helper: Accepts either a text string or a DOM Node (like a div or DocumentFragment).
     */
    const createTab = (
        label: string,
        content: string | Node,
        disclosure: string | null,
        flagUrl: string | null
    ) => {
        const btn = document.createElement('button');
        btn.className = 'tab-button';
        btn.textContent = label;

        btn.onclick = () => {
            // Do nothing if the tab is already active.
            if (btn.classList.contains('active')) {
                return;
            }

            // Manage the active class state.
            document.querySelectorAll('.tab-button').forEach((b) => {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            if (typeof content === 'string') {
                summaryContent.textContent = content;
            } else {
                summaryContent.replaceChildren(content.cloneNode(true));
            }

            // Set the disclosure text.
            aiDisclosure.textContent = disclosure || 'AI-generated content.';

            // Add the content flag URI.
            if (flagUrl) {
                flagContentLink.href = flagUrl;
                flagContentLink.textContent = 'Report an issue';
            }
        };

        tabContainer.appendChild(btn);

        // Auto-select the first available summary.
        if (!firstTabActivated) {
            btn.click();
            firstTabActivated = true;
        }
    };

    // --- 1. Generative Summary (Place) ---
    if (place.generativeSummary?.overview) {
        createTab(
            'Overview',
            place.generativeSummary.overview,
            place.generativeSummary.disclosureText,
            place.generativeSummary.flagContentURI
        );
    }

    // --- 2. Review Summary ---
    if (place.reviewSummary?.text) {
        createTab(
            'Reviews',
            place.reviewSummary.text,
            place.reviewSummary.disclosureText,
            place.reviewSummary.flagContentURI
        );
    }

    // --- 3. Neighborhood Summary ---
    if (place.neighborhoodSummary?.overview?.content) {
        createTab(
            'Neighborhood',
            place.neighborhoodSummary.overview.content,
            place.neighborhoodSummary.disclosureText,
            place.neighborhoodSummary.flagContentURI
        );
    }

    // --- 4. EV Amenity Summary (uses content blocks)) ---
    if (place.evChargeAmenitySummary) {
        const evSummary = place.evChargeAmenitySummary;
        const evContainer = document.createDocumentFragment();

        // Helper to build a safe DOM section for EV categories.
        const createSection = (title: string, text: string) => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '15px'; // Or use a CSS class

            const titleEl = document.createElement('strong');
            titleEl.textContent = title;

            const textEl = document.createElement('div');
            textEl.textContent = text;

            wrapper.appendChild(titleEl);
            wrapper.appendChild(textEl);
            return wrapper;
        };

        // Check and append each potential section
        if (evSummary.overview?.content) {
            evContainer.appendChild(
                createSection('Overview', evSummary.overview.content)
            );
        }
        if (evSummary.coffee?.content) {
            evContainer.appendChild(
                createSection('Coffee', evSummary.coffee.content)
            );
        }
        if (evSummary.restaurant?.content) {
            evContainer.appendChild(
                createSection('Food', evSummary.restaurant.content)
            );
        }
        if (evSummary.store?.content) {
            evContainer.appendChild(
                createSection('Shopping', evSummary.store.content)
            );
        }

        // Only add the tab if the container has children
        if (evContainer.hasChildNodes()) {
            createTab(
                'EV Amenities',
                evContainer, // Passing a Node instead of string
                evSummary.disclosureText,
                evSummary.flagContentURI
            );
        }
    }

    // Safely handle the empty state.
    if (!firstTabActivated) {
        const msg = document.createElement('em');
        msg.textContent =
            'No AI summaries are available for this specific location.';
        summaryContent.replaceChildren(msg);
        aiDisclosure.textContent = '';
    }
}

void init();
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// Define DOM elements.
const mapElement = document.querySelector('gmp-map');
const placeAutocomplete = document.querySelector('gmp-place-autocomplete');
const summaryPanel = document.getElementById('summary-panel');
const placeName = document.getElementById('place-name');
const placeAddress = document.getElementById('place-address');
const tabContainer = document.getElementById('tab-container');
const summaryContent = document.getElementById('summary-content');
const aiDisclosure = document.getElementById('ai-disclosure');
const flagContentLink = document.getElementById('flag-content-link');

let innerMap;
let marker;

async function init() {
    // Request needed libraries.
    const [{ AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('places'),
    ]);

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    // Bind autocomplete bounds to map bounds.
    innerMap.addListener('bounds_changed', () => {
        placeAutocomplete.locationRestriction = innerMap.getBounds();
    });

    // Create the marker.
    marker = new AdvancedMarkerElement({
        map: innerMap,
    });

    // Handle selection of an autocomplete result.
    placeAutocomplete.addEventListener(
        'gmp-select',
        async ({ placePrediction }) => {
            const place = placePrediction.toPlace();

            // Fetch all summary fields.
            await place.fetchFields({
                fields: [
                    'displayName',
                    'formattedAddress',
                    'location',
                    'generativeSummary',
                    'neighborhoodSummary',
                    'reviewSummary',
                    'evChargeAmenitySummary',
                ],
            });

            // Update the map viewport and position the marker.
            if (place.viewport) {
                innerMap.fitBounds(place.viewport);
            } else {
                innerMap.setCenter(place.location);
                innerMap.setZoom(17);
            }
            marker.position = place.location;

            // Update the panel UI.
            updateSummaryPanel(place);
        }
    );
}

function updateSummaryPanel(place) {
    // Reset UI
    summaryPanel.classList.remove('hidden');
    tabContainer.innerHTML = ''; // innerHTML is OK here since we're clearing known child elements.
    summaryContent.textContent = '';
    aiDisclosure.textContent = '';

    placeName.textContent = place.displayName || '';
    placeAddress.textContent = place.formattedAddress || '';

    let firstTabActivated = false;

    /**
     * Safe Helper: Accepts either a text string or a DOM Node (like a div or DocumentFragment).
     */
    const createTab = (label, content, disclosure, flagUrl) => {
        const btn = document.createElement('button');
        btn.className = 'tab-button';
        btn.textContent = label;

        btn.onclick = () => {
            // Do nothing if the tab is already active.
            if (btn.classList.contains('active')) {
                return;
            }

            // Manage the active class state.
            document.querySelectorAll('.tab-button').forEach((b) => {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            if (typeof content === 'string') {
                summaryContent.textContent = content;
            } else {
                summaryContent.replaceChildren(content.cloneNode(true));
            }

            // Set the disclosure text.
            aiDisclosure.textContent = disclosure || 'AI-generated content.';

            // Add the content flag URI.
            if (flagUrl) {
                flagContentLink.href = flagUrl;
                flagContentLink.textContent = 'Report an issue';
            }
        };

        tabContainer.appendChild(btn);

        // Auto-select the first available summary.
        if (!firstTabActivated) {
            btn.click();
            firstTabActivated = true;
        }
    };

    // --- 1. Generative Summary (Place) ---
    if (place.generativeSummary?.overview) {
        createTab(
            'Overview',
            place.generativeSummary.overview,
            place.generativeSummary.disclosureText,
            place.generativeSummary.flagContentURI
        );
    }

    // --- 2. Review Summary ---
    if (place.reviewSummary?.text) {
        createTab(
            'Reviews',
            place.reviewSummary.text,
            place.reviewSummary.disclosureText,
            place.reviewSummary.flagContentURI
        );
    }

    // --- 3. Neighborhood Summary ---
    if (place.neighborhoodSummary?.overview?.content) {
        createTab(
            'Neighborhood',
            place.neighborhoodSummary.overview.content,
            place.neighborhoodSummary.disclosureText,
            place.neighborhoodSummary.flagContentURI
        );
    }

    // --- 4. EV Amenity Summary (uses content blocks)) ---
    if (place.evChargeAmenitySummary) {
        const evSummary = place.evChargeAmenitySummary;
        const evContainer = document.createDocumentFragment();

        // Helper to build a safe DOM section for EV categories.
        const createSection = (title, text) => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '15px'; // Or use a CSS class

            const titleEl = document.createElement('strong');
            titleEl.textContent = title;

            const textEl = document.createElement('div');
            textEl.textContent = text;

            wrapper.appendChild(titleEl);
            wrapper.appendChild(textEl);
            return wrapper;
        };

        // Check and append each potential section
        if (evSummary.overview?.content) {
            evContainer.appendChild(
                createSection('Overview', evSummary.overview.content)
            );
        }
        if (evSummary.coffee?.content) {
            evContainer.appendChild(
                createSection('Coffee', evSummary.coffee.content)
            );
        }
        if (evSummary.restaurant?.content) {
            evContainer.appendChild(
                createSection('Food', evSummary.restaurant.content)
            );
        }
        if (evSummary.store?.content) {
            evContainer.appendChild(
                createSection('Shopping', evSummary.store.content)
            );
        }

        // Only add the tab if the container has children
        if (evContainer.hasChildNodes()) {
            createTab(
                'EV Amenities',
                evContainer, // Passing a Node instead of string
                evSummary.disclosureText,
                evSummary.flagContentURI
            );
        }
    }

    // Safely handle the empty state.
    if (!firstTabActivated) {
        const msg = document.createElement('em');
        msg.textContent =
            'No AI summaries are available for this specific location.';
        summaryContent.replaceChildren(msg);
        aiDisclosure.textContent = '';
    }
}

void init();
```

### CSS

```css
/* Reuse existing map height */
gmp-map {
    height: 100%;
}

html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}

/* Existing Autocomplete Card Style */
.place-autocomplete-card {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin: 10px;
    padding: 2px;
    font-family: Roboto, sans-serif;
    font-size: 1rem;
}

gmp-place-autocomplete {
    width: 330px;
}

/* New: Summary Panel Styles */
.summary-card {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin: 10px;
    padding: 0; /* Padding handled by children */
    font-family: Roboto, sans-serif;
    width: 350px;
    max-height: 80vh; /* Prevent overflow on small screens */
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.hidden {
    display: none;
}

#place-header {
    padding: 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
}

#place-header h2 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
}

#place-address {
    margin: 0;
    color: #555;
    font-size: 0.9rem;
}

/* Tab Navigation */
.tab-container {
    display: flex;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
}

.tab-button {
    flex: 1;
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-weight: 500;
    color: #555;
    border-bottom: 3px solid transparent;
}

.tab-button:hover {
    background-color: #f1f1f1;
}

.tab-button.active {
    font-weight: bold;
    border-bottom: 3px solid #000000;
}

.tab-button.active:hover {
    background-color: #ffffff;
    cursor: default;
}

/* Content Area */
.content-area {
    padding: 15px;
    line-height: 1.5;
    font-size: 0.95rem;
    color: #333;
}

.disclosure-footer {
    font-size: 0.75rem;
    color: #666;
    padding: 10px 15px;
    border-top: 1px solid #eee;
    font-style: italic;
}

.flag-content-link {
    font-size: 0.75rem;
    color: #666;
    padding: 10px 15px;
    border-top: 1px solid #eee;
}
```

### HTML

```html
<html>
    <head>
        <title>AI Place Summaries</title>
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
        <gmp-map center="37.80, -122.425" zoom="14" map-id="DEMO_MAP_ID">
            <!-- Search Input Card -->
            <div
                class="place-autocomplete-card"
                slot="control-inline-start-block-start">
                <gmp-place-autocomplete
                    placeholder="Find places with AI summaries"></gmp-place-autocomplete>
            </div>

            <!-- Summary text panel (initially hidden) -->
            <div
                id="summary-panel"
                class="summary-card hidden"
                slot="control-inline-end-block-start">
                <div id="place-header">
                    <h2 id="place-name"></h2>
                    <p id="place-address"></p>
                </div>

                <!-- Tabs for toggling summary types -->
                <div class="tab-container" id="tab-container"></div>

                <!-- Content display area -->
                <div id="summary-content" class="content-area"></div>

                <!-- Legal/AI Disclosure -->
                <div id="ai-disclosure" class="disclosure-footer"></div>

                <!-- Flag content link -->
                <a id="flag-content-link" class="flag-content-link"></a>
            </div>
        </gmp-map>
    </body>
</html>
```

### Try Sample

[JSFiddle.net](https://jsfiddle.net/gh/get/library/pure/googlemaps-samples/js-api-samples/tree/main/dist/samples/ai-powered-summaries/jsfiddle)

AI-powered summaries are overviews of a place or area that provide helpful insights about
specific places, the area around a place, and reviews associated with a place. There are three
different kinds of AI-powered summaries:

- **Place summary**: A brief, 100-character overview specific to a given place
  ID, aggregating many different types of data into a high-level snapshot of a place.

- **Review summary**: A generated summary of a place based solely on user
  reviews.

- **Area summary**: A generated summary for the area surrounding a place,
  providing additional context including nearby points of interest. Area summaries can be
  one of two types:

  - **Neighborhood summary** : A high-level overview of nearby points of
    interest for places with types `premise`, `street_address`, and
    all types in the **Housing** and **Lodging** categories.

  - **Electric vehicle charging station amenity summary** : A high-level
    overview of nearby points of interest for places with type
    `electric_vehicle_charging_station`.

## Retrieve AI-powered summaries

To retrieve and display AI-powered summaries, follow these steps:

1. [Load the
   `Places` library](https://developers.google.com/maps/documentation/javascript/place-get-started#load-places-library).

   ```javascript
   const { Place } = await google.maps.importLibrary("places");
   ```
2. Obtain a `Place` instance. The following snippet shows creating a
   `Place` instance from a place ID:

   ```javascript
   const place = new Place("ChIJaYaXFTqq3oARNy537Kb_W_c");
   ```
3. In your call to `place.fetchFields()`, specify the fields for the kinds
   of summaries you want to use. In the following snippet all summary fields are requested:

   ```javascript
   await place.fetchFields({
     fields: [
       'generativeSummary',
       'neighborhoodSummary',
       'reviewSummary',
       'evChargeAmenitySummary'
       // Include other fields as needed.
     ]
   });
             
   ```
4. Retrieve the summary data by accessing the `generativeSummary`,
   `neighborhoodSummary`, `reviewSummary`, and
   `evChargeAmenitySummary` properties, respectively. The following snippet
   shows retrieving the overview from a `generativeSummary`.

   ```javascript
   const summaryText = place.generativeSummary.overview;
           
   ```

Because not all places have AI-powered summaries, be sure to check for the presence of the
needed data before displaying it to users. The following snippet uses an if statement to check
for a `generativeSummary`:

```javascript
if (place.generativeSummary) {
  overviewText = place.generativeSummary.overview;
} else {
  overviewText = 'No summary is available.';
}
    
```

Alternatively, use a nullish operator to concisely check for the presence of a summary:

```javascript
const overviewText = place.generativeSummary.overview ?? 'No summary is available.';
    
```

## Display the required attributions

All AI-powered summaries displayed in your app must be accompanied by the appropriate
attribution in accordance with Google's policies and standards. For more information, see
[Policies and
attributions for Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/policies#ai-powered-summaries).

## Place summaries

Place summaries are brief, 100-character overviews specific to a given place ID,
to provide a high-level snapshot of a place. Place summaries may highlight popular foods,
services, or goods available for purchase at a location:

- *"Forum Shops eatery serving large portions of traditional Italian fare in a
  casual space."*

- *"Stylish salon offering haircuts and coloring, plus blowouts."*

- *"Large store with many vendors offering a variety of vintage decor,
  furniture, and clothing."*

Place summaries are available for place types shown in [Supported types](https://developers.google.com/maps/documentation/javascript/place-types)
for the categories **Culture** , **Entertainment and Recreation** ,
**Food and Drink** , **Shopping** , **Services** , and
**Sports**.

Place summaries are supported for points of interest in the following languages
and regions:

| Language | Region |
|---|---|
| English | India United States |

> [!NOTE]
> Note: Place summaries are not guaranteed for all places.

### Request a place summary

To request a generative place summary, include the `generativeSummary`
field when calling `fetchFields()`:

```javascript
await place.fetchFields({
    fields: [
        'generativeSummary',
        // Include other fields as needed.
    ],
});
    
```

Use the [`generativeSummary`](https://developers.google.com/documentation/javascript/reference/place#Place.generativeSummary)
property to retrieve place summaries. The following snippet retrieves the overview and
disclosure text from a `generativeSummary`:

```javascript
if (place.generativeSummary) {
    console.log("Place Overview:", place.generativeSummary.overview);
    console.log("Disclosure:", place.generativeSummary.disclosureText);
}
    
```

## Review summaries

Review summaries are generated summaries based solely on user reviews. By synthesizing key
elements of user reviews, such as place attributes and reviewer sentiment, review summaries
provide high-level insights and help users make informed decisions.

For example, a review summary of the Ferry Building in San Francisco includes information
ranging from food and shopping to views and atmosphere:

*"Visitors say this historical landmark offers a diverse selection of shops, restaurants,
and a farmers market, with many praising the views of the bay and the city. They also highlight
the vibrant atmosphere, convenient ferry access to other destinations, and the opportunity to
enjoy local businesses."*

Review summaries are supported for points of interest in the following languages
and regions:

| Language | Region |
|---|---|
| English | Argentina, Bolivia, Brazil, Chile, Colombia, Costa Rica, Dominican Republic, Ecuador, Guatemala, India, Japan, Mexico, Paraguay, Peru, United Kingdom, United States, Uruguay, Venezuela |
| Japanese | Japan |
| Portuguese | Brazil |
| Spanish | Argentina, Bolivia, Chile, Colombia, Costa Rica, Dominican Republic, Ecuador, Guatemala, Mexico, Paraguay, Peru, United States, Uruguay, Venezuela |

> [!NOTE]
> Note: Review summaries are not guaranteed for all places.

### Request a review summary

To request a review summary, include the `reviewSummary`
field when calling `fetchFields()`:

```javascript
await place.fetchFields({
    fields: [
        'reviewSummary',
        // Include other fields as needed.
    ],
});
  
```

Use the
[`reviewSummary`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.reviewSummary)
property to retrieve review summaries. To retrieve review summaries, access the `reviewSummary.text`
property. The following snippet retrieves the text from a `reviewSummary`.

```javascript
if (place.reviewSummary) {
    console.log("Place Review Summary:", place.reviewSummary.text);
}
  
```

## Area summaries

Area summaries are generated for the area surrounding a place. Area summaries
provide additional context for a location, including points of interest nearby, so that users
can make a more informed decision about where to go and what to do once they get there.
For example, when visiting a new city, you can view a generated neighborhood summary for a
hotel to learn more about the surrounding area:

- *"This vibrant area in San Francisco, blending North Beach and Chinatown, sits northwest
  of the Financial District and features literary landmarks, unique cultural attractions, and
  diverse dining. Notable spots include the iconic City Lights Bookstore, the fascinating
  Cable Car Museum, and the bustling streets of Chinatown."*

If you are considering charging an electric vehicle, you can view a generated summary for an
electric vehicle charging station to learn more about the surrounding area:

- *"This area offers a range of dining options within a 9-minute walk, including
  Starbucks, Sushi Jin, and Safeway."*

Along with a description of the area, the response also contains a list of `Place`
instances for the places referenced in the description; call `fetchFields()` on these
`Place` instances to request further details for each place.

There are two types of AI-powered area summaries:

- **Neighborhood summary** : A high-level overview of nearby points of
  interest for places with types `premise`, `street_address`, and
  all types in the **Housing** and **Lodging** categories.

- **Electric vehicle charging station amenity summary** : A high-level
  overview of nearby points of interest for places with type
  `electric_vehicle_charging_station`.

Area summaries are supported for points of interest in the following languages and regions:

| Language | Region |
|---|---|
| English | United States |

> [!NOTE]
> Note: Area summaries are not guaranteed for all places.

### Request a neighborhood summary

You can request neighborhood summaries for places with types `premise`,
`street_address`, and all types in the **Housing** and
**Lodging** categories. To request a neighborhood summary, include the
`neighborhoodSummary` field when calling `fetchFields()`:

```javascript
await place.fetchFields({
    fields: [
        'neighborhoodSummary',
        // Include other fields as needed.
    ],
});
  
```

Use the [`neighborhoodSummary`](https://developers.google.com/maps/documentation/javascript/reference/place#Place.neighborhoodSummary)
property to retrieve neighborhood summaries. To retrieve neighborhood summaries, access the
`neighborhoodSummary.content` property to get the text.

The following snippet retrieves the content of a `neighborhoodSummary`:

```javascript
if (place.neighborhoodSummary) {
    console.log("Place Neighborhood Summary:", place.neighborhoodSummary.overview.content);
}
  
```

### Request an electric vehicle charging station amenity summary

You can request electric vehicle charging station amenity summaries for places with type
`electric_vehicle_charging_station`. The EVCS amenity summary offers four types of
summaries: `overview`, `coffee`, `restaurant`, and
`store`; because of this the data structure is an array of objects, each containing
a summary. To request an electric vehicle charging station amenity summary, include the
`evChargeAmenitySummary` field when calling `fetchFields()`:

```javascript
await place.fetchFields({
    fields: [
        'evChargeAmenitySummary',
        // Include other fields as needed.
    ],
});
  
```

Use the [evChargeAmenitySummary](https://developers.google.com/maps/documentation/javascript/reference/place#EvChargeAmenitySummary)
property to retrieve electric vehicle charging station amenity summaries. To retrieve text from
the summaries, access the `content` property of the `evChargeAmenitySummary.overview`,
`evChargeAmenitySummary.coffee`, `evChargeAmenitySummary.restaurant`, and
`evChargeAmenitySummary.store` properties.

The following snippet retrieves the content of a `evChargeAmenitySummary`:

```javascript
// overview, coffee, restaurant, store.
if (place.evChargeAmenitySummary) {
    console.log("Place EVCS Amenity Summary:", place.evChargeAmenitySummary.overview.content);
    console.log("Coffee:", place.evChargeAmenitySummary.coffee.content);
    console.log("Restaurants:", place.evChargeAmenitySummary.restaurant.content);
    console.log("Stores:", place.evChargeAmenitySummary.store.content);
}
  
```