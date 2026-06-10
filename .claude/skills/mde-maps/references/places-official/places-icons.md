 
Place icons indicate the various types of places (for example coffee shops, libraries, and
museums). You can request icons and their background colors using the
[Place Class](https://developers.google.com/maps/documentation/javascript/place).

## Fields

Use the following fields to work with place icons:

| **Field** | **Place Class** | **Places Service** |
|---|---|---|
| Icon | --- | `https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult.` |
| Icon background color | `https://developers.google.com/maps/documentation/javascript/reference/place#Place.iconBackgroundColor` | `https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult.icon_background_color` |
| Icon mask URI | `https://developers.google.com/maps/documentation/javascript/reference/place#Place.svgIconMaskURI` | `https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult.icon_mask_base_uri` |

- `icon` returns the URL for a colored 71px x 71px PNG icon (Places Service only).
- `iconBackgroundColor` and `icon_background_color` return the default HEX color code for the place icon's category.
- `icon_mask_base_uri` (Places Service) returns the base URL for a non-colored icon, minus the file type extension (append `.svg` or `.png`).
- `svgIconMaskURI` (Place Class) returns the base URL for a non-colored SVG icon.

## Apply place icon and color to a marker

With Place Details, you can request a place icon and background color which you can apply
to markers. The following example shows code to create a marker using place data by passing
`place.iconBackgroundColor` to the `PinElement.background` option, and
`place.svgIconMaskURI` to `PinElement.glyph`. Use `place.location`
to place the marker in the correct location. This example also displays the `place.displayName`
in the marker title.

### TypeScript

```typescript
// A marker customized using a place icon and color, name, and geometry.
const place = new Place({
    id: 'ChIJN5Nz71W3j4ARhx5bwpTQEGg',
});

// Call fetchFields, passing the desired data fields.
await place.fetchFields({ fields: ['location', 'displayName', 'svgIconMaskURI', 'iconBackgroundColor'] });

const pinElement = new PinElement({
    background: place.iconBackgroundColor,
    glyph: new URL(String(place.svgIconMaskURI)),
});

const placeIconMarkerView = new AdvancedMarkerElement({
    map,
    position: place.location,
    content: pinElement.element,
    title: place.displayName,
});
```

> [!NOTE]
> **Note:** Read the [guide](https://developers.google.com/maps/documentation/javascript/using-typescript) on using TypeScript and Google Maps.

### JavaScript

```javascript
// A marker customized using a place icon and color, name, and geometry.
const place = new Place({
  id: "ChIJN5Nz71W3j4ARhx5bwpTQEGg",
});

// Call fetchFields, passing the desired data fields.
await place.fetchFields({
  fields: [
    "location",
    "displayName",
    "svgIconMaskURI",
    "iconBackgroundColor",
  ],
});

const pinElement = new PinElement({
  background: place.iconBackgroundColor,
  glyph: new URL(String(place.svgIconMaskURI)),
});
const placeIconMarkerView = new AdvancedMarkerElement({
  map,
  position: place.location,
  content: pinElement.element,
  title: place.displayName,
});
```
[See the example](https://developers.google.com/maps/documentation/javascript/examples/advanced-markers-graphics)

## Place icon and background color requests

The following tables show all of the available place icons by category. By
default these display with a black glyph. The icon background color
is dictated by the place's category.

| **Place category: Food and drink** (icon background color #FF9E67) ||||
|---|---|---|---|
| ![Bar](https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet.svg) Bar, Night club | ![Cafe](https://maps.gstatic.com/mapfiles/place_api/icons/v2/cafe_pinlet.svg) Cafe | ![Restaurant](https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet.svg) Restaurant, Bakery |
| ![Bookstore](https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet.svg) Books, Clothing, Electronics, Jewelry, Shoes, Shopping center/Mall | ![Convenience store](https://maps.gstatic.com/mapfiles/place_api/icons/v2/convenience_pinlet.png) Convenience store | ![Grocery](https://maps.gstatic.com/mapfiles/place_api/icons/v2/shoppingcart_pinlet.svg) Grocery, Supermarket | ![Pharmacy](https://maps.gstatic.com/mapfiles/place_api/icons/v2/pharmacy_pinlet.svg) Pharmacy |
| ![ATM](https://maps.gstatic.com/mapfiles/place_api/icons/v2/atm_pinlet.svg) ATM | ![Bank](https://maps.gstatic.com/mapfiles/place_api/icons/v2/bank-intl_pinlet.svg) Bank | ![Gas](https://maps.gstatic.com/mapfiles/place_api/icons/v2/gas_pinlet.svg) Gas | ![Lodging](https://maps.gstatic.com/mapfiles/place_api/icons/v2/hotel_pinlet.svg) Lodging |
| ![Post office](https://maps.gstatic.com/mapfiles/place_api/icons/v2/postoffice_pinlet.svg) Post office |
| ![Aquarium, Tourist](https://maps.gstatic.com/mapfiles/place_api/icons/v2/dolphin_pinlet.svg) Aquarium, Tourist | ![Golf](https://maps.gstatic.com/mapfiles/place_api/icons/v2/golf_pinlet.svg) Golf | ![Historic](https://maps.gstatic.com/mapfiles/place_api/icons/v2/historic_pinlet.svg) Historic | ![Movie](https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet.svg) Movie |
| ![Museum](https://maps.gstatic.com/mapfiles/place_api/icons/v2/museum_pinlet.svg) Museum | ![Theater](https://maps.gstatic.com/mapfiles/place_api/icons/v2/theater_pinlet.svg) Theater |
| ![Airport](https://maps.gstatic.com/mapfiles/place_api/icons/v2/airport_pinlet.svg) Airport | ![Bus](https://maps.gstatic.com/mapfiles/place_api/icons/v2/bus_share_taxi_pinlet.svg) Bus, rideshare, taxi | ![Train/Rail](https://maps.gstatic.com/mapfiles/place_api/icons/v2/train_rail_1_pinlet.svg) Train/Rail |
| ![Cemetery](https://maps.gstatic.com/mapfiles/place_api/icons/v2/cemetery_pinlet.svg) Cemetery | ![Civic building](https://maps.gstatic.com/mapfiles/place_api/icons/v2/civic-bldg_pinlet.svg) Civic building | ![Library](https://maps.gstatic.com/mapfiles/place_api/icons/v2/library_pinlet.svg) Library | ![Monument](https://maps.gstatic.com/mapfiles/place_api/icons/v2/monument_pinlet.svg) Monument |
| ![Parking](https://maps.gstatic.com/mapfiles/place_api/icons/v2/parking_pinlet.svg) Parking | ![School (primary, secondary, university)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet.svg) School (primary, secondary, university) | ![Worship (Christian)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/worship_christian_pinlet.svg) Worship (Christian) |
| ![Worship (Hindu)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/worship_hindu_pinlet.svg) Worship (Hindu) | ![Worship (Islam)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/worship_islam_pinlet.svg) Worship (Islam) | ![Worship (Jain)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/worship_jain_pinlet.svg) Worship (Jain) | ![Worship (Jewish)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/worship_jewish_pinlet.svg) Worship (Jewish) |
| ![Worship (Sikh)](https://maps.gstatic.com/mapfiles/place_api/icons/v2/worship_sikh_pinlet.svg) Worship (Sikh) | ![Generic business](https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet.svg) Generic business |
| ![Boating](https://maps.gstatic.com/mapfiles/place_api/icons/v2/boating_pinlet.svg) Boating | ![Camping](https://maps.gstatic.com/mapfiles/place_api/icons/v2/camping_pinlet.svg) Camping | ![Park](https://maps.gstatic.com/mapfiles/place_api/icons/v2/tree_pinlet.svg) Park | ![Stadium](https://maps.gstatic.com/mapfiles/place_api/icons/v2/stadium_pinlet.svg) Stadium |
| ![Zoo](https://maps.gstatic.com/mapfiles/place_api/icons/v2/paw_pinlet.svg) Zoo |
| ![Hospital](https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet.svg) Hospital | ![Police](https://maps.gstatic.com/mapfiles/place_api/icons/v2/police_pinlet.svg) Police |