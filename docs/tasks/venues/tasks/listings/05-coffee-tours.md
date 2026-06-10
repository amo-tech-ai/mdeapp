Below is a production-oriented **starter intelligence layer** for Medellín coffee tours, grounded in the source material I was able to verify and clearly marking what still needs Google Maps/Places validation before going live. I’ve focused on the highest-signal tours in your source pack: Urban Coffee Tour in Barrio La Sierra, La Casa Grande Coffee Hacienda, and Expedition Colombia’s Medellín coffee farm experience, plus the directory-level GetYourGuide and Instagram signals. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)

## Dataset scope

I can confidently populate **tour identity, positioning, vibe, and several booking signals** from the verified web sources below, but I cannot fully verify Google Maps place IDs, exact coordinates, ratings, review counts, hours, or phone numbers from this run. For production, those fields should remain `null` or `unverified` until cross-checked against Google Maps/Places and the business’s own site or direct contact channel. [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/)

## Listings

| Tour | Area | Core identity | Verified signals | Confidence |
|---|---|---|---|---|
| Urban Coffee Tour | Barrio La Sierra, Medellín | Urban/community coffee experience in a hillside neighborhood with a local-family angle | GetYourGuide page says “Urban Coffe Tour in Barrio La Sierra,” mentions a local family, and indicates morning/afternoon availability; Instagram lists WhatsApp and email contact.  [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/) | Medium |
| La Casa Grande Coffee Hacienda | Medellín outskirts | Historic coffee hacienda experience on a preserved 19th-century estate | Official site says 30 minutes from Medellín, shade-grown coffee fields, birdwatching, history/nature focus, WhatsApp contact; Medellín.Travel confirms 1853 hacienda heritage; Daytours4u shows bilingual guide, hotel transfer, lunch, tasting, and 6-hour duration.  [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com) | High |
| Medellín coffee farm half-day experience | Medellín outskirts | Hands-on farm tour with harvesting, tasting, and horseback riding add-on | Expedition Colombia says it is 45 minutes from the city, interactive and hands-on, with daily departure, hotel/office meet point, and pricing listed in COP.  [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/) | Medium |
| GetYourGuide Medellín coffee tours page | Medellín | Meta-discovery / booking marketplace | Useful as aggregation and demand signal, but not a single operator; likely affiliate-heavy rather than operator-authentic.  [getyourguide](https://www.getyourguide.com/medellin-l1215/coffee-tours-tc263/) | Low |

## Core identity data

### Urban Coffee Tour
- Tour name: Urban Coffee Tour / Medellín Coffee Tour. [instagram](https://www.instagram.com/urbancoffeetour/)
- Business category: Coffee tour, urban walking experience, artisanal coffee experience. [urbancoffeetour](https://urbancoffeetour.com)
- Neighborhood / area: Barrio La Sierra, Medellín. [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/)
- Official website: [urbancoffeetour.com](https://urbancoffeetour.com). [urbancoffeetour](https://urbancoffeetour.com)
- Instagram: [@urbancoffeetour](https://www.instagram.com/urbancoffeetour/). [instagram](https://www.instagram.com/urbancoffeetour/)
- Contact: `urbancoffeetour@gmail.com`, WhatsApp `+57 304 596 6599`. [instagram](https://www.instagram.com/urbancoffeetour/)
- Languages: Not fully verified, but “medellin coffee tour” positioning and bilingual marketplace listing suggest at least English/Spanish is likely; mark as unverified until confirmed. [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/)
- Pickup available: Unverified.
- Approx duration: Unverified from source snippet.
- Approx pricing: Not verified from the pages I could inspect.
- Rating / review count / Maps URL / place_id / exact address / coordinates: unverified in this run. [urbancoffeetour](https://urbancoffeetour.com)

### La Casa Grande Coffee Hacienda
- Tour name: La Casa Grande Coffee Hacienda. [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com)
- Business category: Historic coffee hacienda, agrotourism, nature/heritage experience. [medellin](https://www.medellin.travel/hacienda-la-casa-grande-y-el-coffe-tour/)
- Area: Medellín outskirts / near Medellín. [daytours4u](https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/)
- Official website: [lacasagrandecoffeehacienda.com](https://www.lacasagrandecoffeehacienda.com/). [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com)
- Contact: site says they will contact by WhatsApp, but the actual number was not verified here. [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com)
- Languages: English is explicitly mentioned on the official site and bilingual guide is included on Daytours4u. [daytours4u](https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/)
- Pickup available: Yes, hotel transfer included on Daytours4u. [daytours4u](https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/)
- Approx duration: About 6 hours. [daytours4u](https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/)
- Approx pricing: Not verified in the sources I used.
- Rating / review count / Maps URL / place_id / exact address / coordinates: unverified in this run. [medellin](https://www.medellin.travel/hacienda-la-casa-grande-y-el-coffe-tour/)

### Expedition Colombia farm tour
- Tour name: Coffee Tour Medellín / Colombian Cultural Half Day Experience. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Business category: Coffee farm day tour, cultural experience. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Area: Medellín outskirts, about 45 minutes from the city. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Meet point: Hotel Masaya Medellin office at Calle 8 #43a-89. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Duration: Half day. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Pricing: COP 279,000 each; COP 338,000 with horseback riding. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Features: Hands-on learning, grow/harvest/taste, daily group departure. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Pickup available: Not explicit; meet point is specified. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- Rating / review count / Maps URL / place_id / coordinates / phone / Instagram: unverified in this run. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)

## Vibe profiles

| Tour | Atmosphere | Authenticity | Educational depth | Social impact | Best-fit vibe |
|---|---|---:|---:|---:|---|
| Urban Coffee Tour | Local-focused, scenic hillside, community-driven | High | Medium | Medium to high | Authentic hillside coffee experience with neighborhood culture.  [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/) |
| La Casa Grande Coffee Hacienda | Rustic, heritage, scenic, nature-oriented | High | High | Medium | Historic finca with strong coffee heritage and relaxation appeal.  [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com) |
| Expedition Colombia | Adventure-oriented, hands-on, tourist-friendly | Medium | High | Low to medium | Practical coffee-farm learning with easy bookability.  [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/) |

## AI semantic descriptors

Use these for pgvector and vibe search:

- authentic hillside coffee farm experience. [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/)
- urban coffee tour in Barrio La Sierra. [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/)
- local family-run coffee experience in Medellín. [getyourguide](https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/)
- historic 19th-century coffee hacienda near Medellín. [medellin](https://www.medellin.travel/hacienda-la-casa-grande-y-el-coffe-tour/)
- shade-grown coffee fields and birdwatching. [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com)
- hands-on coffee harvesting and tasting tour. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)
- bilingual coffee farm day trip from Medellín. [daytours4u](https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/)
- scenic outskirts coffee experience with hotel transfer. [daytours4u](https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/)
- artisanal coffee certificate experience in Medellín. [instagram](https://www.instagram.com/urbancoffeetour/)

## User intent match

| Tour | First-time | Enthusiast | Luxury | Backpacker | Nomad | Local culture | Family | Photographer | Foodie | Educational | Romantic | Social impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Urban Coffee Tour | High | Medium | Low | High | High | High | Medium | High | Medium | Medium | Medium | High |
| La Casa Grande Coffee Hacienda | High | High | Medium | Medium | Medium | Medium | High | High | High | High | High | Medium |
| Expedition Colombia | High | High | Low | High | Medium | Medium | Medium | Medium | Medium | High | Low | Low |

## Ranking rationale

**La Casa Grande Coffee Hacienda** ranks highest for general recommendation because it has the strongest trust stack: official site, heritage details, third-party tourism guide confirmation, bilingual guide inclusion, transfer, lunch, tasting, and a clear duration. [medellin](https://www.medellin.travel/hacienda-la-casa-grande-y-el-coffe-tour/)
**Urban Coffee Tour** is the best fit for a more urban, local, hillside, social-identity-forward coffee experience, but some operational fields still need Maps verification before it can be treated as fully production-grade. [urbancoffeetour](https://urbancoffeetour.com)
**Expedition Colombia** is attractive for price and hands-on structure, but it reads more like a bookable tourism product than a deeply rooted community coffee project. [expeditioncolombia](https://expeditioncolombia.com/coffee-tour-medellin/)

## Trust and authenticity

- Highest trust signals: official site ownership, third-party tourism guide corroboration, explicit heritage story, and detailed inclusions. [lacasagrandecoffeehacienda](https://www.lacasagrandecoffeehacienda.com)
- Authenticity risk: directory/marketplace pages can overstate uniqueness or repeat SEO phrasing, so they should be treated as discovery leads rather than final truth. [getyourguide](https://www.getyourguide.com/medellin-l1215/coffee-tours-tc263/)
- Most likely to be locally grounded: Urban Coffee Tour, because the Instagram contact details and “local family” framing point to a smaller operator rather than a generic reseller. [instagram](https://www.instagram.com/urbancoffeetour/)
- Most likely affiliate-driven: GetYourGuide’s listing page, because it is a marketplace index rather than a single operator landing page. [getyourguide](https://www.getyourguide.com/medellin-l1215/coffee-tours-tc263/)

## Structured metadata

```json
[
  {
    "name": "Urban Coffee Tour",
    "category": "coffee tour",
    "area": "Barrio La Sierra, Medellín",
    "identity_confidence": "medium",
    "website": "https://urbancoffeetour.com",
    "instagram": "https://www.instagram.com/urbancoffeetour/",
    "contact": {
      "email": "urbancoffeetour@gmail.com",
      "whatsapp": "+57 304 596 6599"
    },
    "verified_fields": [
      "tour name",
      "instagram",
      "email",
      "whatsapp",
      "Barrio La Sierra positioning"
    ],
    "unverified_fields": [
      "address",
      "coordinates",
      "maps_url",
      "place_id",
      "rating",
      "review_count",
      "price",
      "duration",
      "languages"
    ],
    "vibe": [
      "local-focused",
      "scenic hillside",
      "community-driven",
      "authentic"
    ],
    "intent_tags": [
      "first-time coffee tour",
      "local culture explorer",
      "photographer/content creator",
      "social impact traveler",
      "backpacker"
    ],
    "embedding_text": "Authentic community-focused coffee tour in Barrio La Sierra, Medellín with local-family framing, scenic hillside vibe, urban walking experience, artisanal coffee storytelling, and a strong local-culture identity.",
    "source_urls": [
      "https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/",
      "https://www.instagram.com/urbancoffeetour/",
      "https://urbancoffeetour.com"
    ]
  },
  {
    "name": "La Casa Grande Coffee Hacienda",
    "category": "coffee hacienda tour",
    "area": "Medellín outskirts",
    "identity_confidence": "high",
    "website": "https://www.lacasagrandecoffeehacienda.com/",
    "contact": {
      "whatsapp": "unverified"
    },
    "verified_fields": [
      "historic 19th-century coffee estate",
      "shade-grown coffee fields",
      "birdwatching",
      "WhatsApp contact mention",
      "English language mention",
      "hotel transfer",
      "lunch",
      "coffee tasting",
      "approx. 6 hours"
    ],
    "unverified_fields": [
      "address",
      "coordinates",
      "maps_url",
      "place_id",
      "rating",
      "review_count",
      "price"
    ],
    "vibe": [
      "rustic",
      "heritage",
      "scenic",
      "nature-oriented",
      "family-friendly"
    ],
    "intent_tags": [
      "first-time coffee tour",
      "coffee enthusiast",
      "family",
      "photographer/content creator",
      "foodie",
      "educational experience",
      "romantic/date activity"
    ],
    "embedding_text": "Historic coffee hacienda near Medellín with shade-grown coffee fields, birdwatching, heritage architecture, bilingual guide options, hotel transfer, lunch, tasting, and a strong authentic finca experience.",
    "source_urls": [
      "https://www.lacasagrandecoffeehacienda.com/",
      "https://www.medellin.travel/hacienda-la-casa-grande-y-el-coffe-tour/",
      "https://www.daytours4u.com/es/tour-completo-la-casa-grande-coffee-hacienda.html/"
    ]
  },
  {
    "name": "Coffee Tour Medellín",
    "category": "coffee farm tour",
    "area": "Medellín outskirts",
    "identity_confidence": "medium",
    "website": null,
    "contact": null,
    "verified_fields": [
      "half-day experience",
      "45 minutes from Medellín",
      "hands-on grow/harvest/taste",
      "daily group departure",
      "pricing in COP",
      "horseback riding add-on"
    ],
    "unverified_fields": [
      "exact farm name",
      "address",
      "coordinates",
      "maps_url",
      "place_id",
      "rating",
      "review_count",
      "languages",
      "pickup"
    ],
    "vibe": [
      "adventure-oriented",
      "touristy",
      "educational",
      "scenic"
    ],
    "intent_tags": [
      "first-time coffee tour",
      "coffee enthusiast",
      "backpacker",
      "educational experience",
      "family"
    ],
    "embedding_text": "Hands-on coffee farm day trip near Medellín with harvesting, tasting, educational farm learning, daily departures, and optional horseback riding for an adventure-oriented visitor.",
    "source_urls": [
      "https://expeditioncolombia.com/coffee-tour-medellin/"
    ]
  }
]
```

## Fields still needed

To make this truly Maps-ready, the next enrichment pass should add: exact Google Maps URLs, place IDs, coordinates, ratings, review counts, live hours, and route times from El Poblado, Laureles, and Envigado. Those are the fields I would treat as **source-of-truth only from Google Maps/Places** before publishing.  

I can turn this into a clean CSV/JSON schema next, with normalized columns for `tour_type`, `authenticity_score`, `trust_score`, `vibe_tags`, `intent_tags`, `source_quality`, and `verified_fields`.