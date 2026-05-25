import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { searchRentals } from '../tools/search-rentals';
import { searchEvents } from '../tools/search-events';
import { searchRestaurants } from '../tools/search-restaurants';
import { searchAttractions } from '../tools/search-attractions';

const intentEnum = z.enum([
  'rental_search',
  'event_discovery',
  'restaurant_search',
  'attraction_search',
  'chitchat',
  'unknown',
]);

const inputSchema = z.object({
  message: z.string().min(1).describe('Raw user message'),
});

const classificationSchema = z.object({
  intent: intentEnum,
  confidence: z.number().min(0).max(1),
  filters: z
    .object({
      neighborhood: z.string().optional(),
      minBedrooms: z.number().optional(),
      maxPricePerNight: z.number().optional(),
      category: z.string().optional(),
      cuisine: z.string().optional(),
      maxPricePerTicket: z.number().optional(),
      maxPricePerPerson: z.number().optional(),
      maxPriceUsd: z.number().optional(),
      limit: z.number().int().optional(),
    })
    .default({}),
});

type Classification = z.infer<typeof classificationSchema>;

const NEIGHBORHOODS = [
  'laureles',
  'el poblado',
  'poblado',
  'envigado',
  'belén',
  'belen',
  'estadio',
  'centro',
  'san javier',
  'comuna 13',
  'guatapé',
  'guatape',
  'santa elena',
];

function pickNeighborhood(text: string): string | undefined {
  const lower = text.toLowerCase();
  const match = NEIGHBORHOODS.find((n) => lower.includes(n));
  if (!match) return undefined;
  if (match === 'poblado' || match === 'el poblado') return 'El Poblado';
  if (match === 'belen' || match === 'belén') return 'Belén';
  if (match === 'guatape' || match === 'guatapé') return 'Guatapé';
  return match.charAt(0).toUpperCase() + match.slice(1);
}

function pickPrice(text: string): number | undefined {
  const m =
    text.match(/\$\s*(\d{1,5})/) ||
    text.match(/(\d{1,5})\s*(?:usd|dollars?)/i) ||
    text.match(/(?:under|below|less than|max|up to|budget(?: of)?)\s*\$?\s*(\d{1,5})/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

function pickBedrooms(text: string): number | undefined {
  const m = text.match(/(\d+)\s*(?:br|bedroom|bedrooms)/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

function classifyDeterministic(message: string): Classification {
  const lower = message.toLowerCase();
  const filters: Classification['filters'] = {};
  const neighborhood = pickNeighborhood(message);
  if (neighborhood) filters.neighborhood = neighborhood;

  const rentalSignals = /(rental|apartment|apt\b|stay|airbnb|sleep|month|long.?term|bedroom|\d+\s*br\b|\bbr\b|studio|host|wifi|find me a (?:place|home|spot)|where can i (?:stay|sleep))/i;
  const eventSignals = /(event|concert|salsa|club|nightlife|ticket|f[uú]tbol|game|festival|show|tonight|this weekend)/i;
  const restaurantSignals = /(restaurant|dinner|lunch|brunch|food|coffee|caf[eé]|eat|breakfast|cuisine)/i;
  const attractionSignals = /(tour|attraction|museum|viewpoint|park|day.?trip|hike|comuna 13|guatap[eé]|things to do|sightseeing)/i;
  const chitchatSignals = /^\s*(hi|hello|hey|hola|gracias|thanks|thx|how are you)\b/i;

  if (rentalSignals.test(lower)) {
    const minBedrooms = pickBedrooms(message);
    if (typeof minBedrooms === 'number') filters.minBedrooms = minBedrooms;
    const price = pickPrice(message);
    if (typeof price === 'number') {
      const looksMonthly = /(month|monthly|long.?term)/i.test(lower);
      filters.maxPricePerNight = looksMonthly ? Math.max(20, Math.round(price / 30)) : price;
    }
    return { intent: 'rental_search', confidence: 0.85, filters };
  }

  if (eventSignals.test(lower)) {
    if (/(salsa|club|nightlife|reggaeton|rumba)/i.test(lower)) filters.category = 'nightlife';
    else if (/(concert|music|dj|festival)/i.test(lower)) filters.category = 'music';
    else if (/(f[uú]tbol|game|match|sport)/i.test(lower)) filters.category = 'sport';
    else if (/(food|tasting|feria)/i.test(lower)) filters.category = 'food';
    else if (/(museum|tour|culture|theatre)/i.test(lower)) filters.category = 'culture';
    const price = pickPrice(message);
    if (typeof price === 'number') filters.maxPricePerTicket = price;
    return { intent: 'event_discovery', confidence: 0.8, filters };
  }

  if (restaurantSignals.test(lower)) {
    if (/(coffee|caf[eé])/i.test(lower)) filters.cuisine = 'cafe';
    else if (/(vegetarian|vegan|plant)/i.test(lower)) filters.cuisine = 'vegetarian';
    else if (/(seafood|fish)/i.test(lower)) filters.cuisine = 'seafood';
    else if (/(steak)/i.test(lower)) filters.cuisine = 'steakhouse';
    else if (/(paisa|colombian|local)/i.test(lower)) filters.cuisine = 'colombian';
    const price = pickPrice(message);
    if (typeof price === 'number') filters.maxPricePerPerson = price;
    return { intent: 'restaurant_search', confidence: 0.78, filters };
  }

  if (attractionSignals.test(lower)) {
    if (/(museum)/i.test(lower)) filters.category = 'museum';
    else if (/(viewpoint|sunset|cerro)/i.test(lower)) filters.category = 'viewpoint';
    else if (/(park|jard[ií]n)/i.test(lower)) filters.category = 'park';
    else if (/(day.?trip|guatap[eé])/i.test(lower)) filters.category = 'day-trip';
    else if (/(tour|comuna 13|graffiti)/i.test(lower)) filters.category = 'tour';
    else if (/(walk|neighborhood)/i.test(lower)) filters.category = 'neighborhood-walk';
    const price = pickPrice(message);
    if (typeof price === 'number') filters.maxPriceUsd = price;
    return { intent: 'attraction_search', confidence: 0.75, filters };
  }

  if (chitchatSignals.test(lower) || message.trim().length < 4) {
    return { intent: 'chitchat', confidence: 0.95, filters: {} };
  }

  return { intent: 'unknown', confidence: 0.4, filters: {} };
}

const cardSchema = z.object({
  id: z.string(),
  headline: z.string(),
  subline: z.string(),
  priceLabel: z.string(),
  imageUrl: z.string().optional(),
  sourceUrl: z.string().optional(),
  // MASTRA-047: lat/lng required so ChatMap can render pins
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

const dispatchOutputSchema = z.object({
  intent: intentEnum,
  confidence: z.number(),
  source: z.enum(['mock', 'supabase', 'fallback']),
  cards: z.array(cardSchema),
  total: z.number(),
  followups: z.array(z.string()),
  message: z.string().optional(),
});

const classifyStep = createStep({
  id: 'classify-intent',
  description: 'Deterministic intent classifier — keyword + regex, no LLM cost.',
  inputSchema,
  outputSchema: z.object({
    message: z.string(),
    classification: classificationSchema,
  }),
  execute: async ({ inputData }) => {
    const classification = classifyDeterministic(inputData.message);
    return { message: inputData.message, classification };
  },
});

const dispatchStep = createStep({
  id: 'dispatch-intent',
  description:
    'Routes the classified intent to the right mock search and shapes a uniform card list.',
  inputSchema: z.object({
    message: z.string(),
    classification: classificationSchema,
  }),
  outputSchema: dispatchOutputSchema,
  execute: async ({ inputData }) => {
    const { intent, confidence, filters } = inputData.classification;
    const limit = filters.limit ?? 5;

    if (intent === 'rental_search') {
      const out = await searchRentals({
        neighborhood: filters.neighborhood,
        minBedrooms: filters.minBedrooms,
        maxPricePerNight: filters.maxPricePerNight,
        limit,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cards = out.results.map((r: any) => ({
        id: r.id,
        headline: r.title,
        subline: `${r.neighborhood} \u00b7 ${r.bedrooms === 0 ? 'studio' : `${r.bedrooms}BR`} \u00b7 host ${r.host_name}`,
        priceLabel: `$${r.nightly_price}/night`,
        imageUrl: r.image,
        sourceUrl: r.source_url,
        latitude: r.latitude ?? null,
        longitude: r.longitude ?? null,
      }));
      return {
        intent,
        confidence,
        source: out.source,
        cards,
        total: out.total,
        followups: ['Show cheaper', 'Show 2BR only', 'Schedule viewing for #1', 'Compare 1 and 3'],
      };
    }

    if (intent === 'event_discovery') {
      const out = await searchEvents({
        category: filters.category as
          | 'music'
          | 'food'
          | 'culture'
          | 'sport'
          | 'nightlife'
          | undefined,
        neighborhood: filters.neighborhood,
        maxPricePerTicket: filters.maxPricePerTicket,
        limit,
      });
      const cards = out.results.map((e) => ({
        id: e.id,
        headline: e.title,
        subline: `${e.venue} \u00b7 ${e.neighborhood} \u00b7 ${e.startsAt}`,
        priceLabel: `$${e.pricePerTicket}/ticket`,
        imageUrl: e.imageUrl,
        latitude: e.latitude ?? null,
        longitude: e.longitude ?? null,
      }));
      return {
        intent,
        confidence,
        source: out.source,
        cards,
        total: out.total,
        followups: ['Buy ticket for #1', 'Show cheaper', 'Show this weekend', 'More music events'],
      };
    }

    if (intent === 'restaurant_search') {
      const out = await searchRestaurants({
        cuisine: filters.cuisine as
          | 'colombian'
          | 'paisa'
          | 'seafood'
          | 'steakhouse'
          | 'vegetarian'
          | 'cafe'
          | 'international'
          | 'street-food'
          | undefined,
        neighborhood: filters.neighborhood,
        maxPricePerPerson: filters.maxPricePerPerson,
        limit,
      });
      const cards = out.results.map((r) => ({
        id: r.id,
        headline: r.name,
        subline: `${r.cuisine} \u00b7 ${r.neighborhood} \u00b7 \u2605 ${r.rating.toFixed(1)}`,
        priceLabel: `${r.priceTier} (~$${r.avgPricePerPerson}/person)`,
        imageUrl: r.imageUrl,
        sourceUrl: r.sourceUrl,
        latitude: r.latitude ?? null,
        longitude: r.longitude ?? null,
      }));
      return {
        intent,
        confidence,
        source: out.source,
        cards,
        total: out.total,
        followups: ['Cheaper options', 'Vegetarian only', 'Near El Poblado', 'Reserve #1'],
      };
    }

    if (intent === 'attraction_search') {
      const out = await searchAttractions({
        category: filters.category as
          | 'park'
          | 'museum'
          | 'viewpoint'
          | 'tour'
          | 'landmark'
          | 'neighborhood-walk'
          | 'day-trip'
          | undefined,
        neighborhood: filters.neighborhood,
        maxPriceUsd: filters.maxPriceUsd,
        limit,
      });
      const cards = out.results.map((a) => ({
        id: a.id,
        headline: a.name,
        subline: `${a.category} \u00b7 ${a.neighborhood} \u00b7 ${a.durationMinutes} min \u00b7 \u2605 ${a.rating.toFixed(1)}`,
        priceLabel: a.priceUsd === 0 ? 'Free' : `$${a.priceUsd}`,
        imageUrl: a.imageUrl,
        sourceUrl: a.sourceUrl,
        latitude: a.latitude ?? null,
        longitude: a.longitude ?? null,
      }));
      return {
        intent,
        confidence,
        source: out.source,
        cards,
        total: out.total,
        followups: ['Free only', 'Half-day options', 'Day-trips outside Medell\u00edn', 'Best for evening'],
      };
    }

    if (intent === 'chitchat') {
      return {
        intent,
        confidence,
        source: 'mock' as const,
        cards: [],
        total: 0,
        followups: ['Find a rental in Laureles', 'What\u2019s on tonight', 'Recommend a restaurant', 'Plan a day trip'],
        message: '\u00a1Hola! I\u2019m the mdeAI Medell\u00edn concierge. Ask me about rentals, events, restaurants, or things to do.',
      };
    }

    return {
      intent: 'unknown' as const,
      confidence,
      source: 'mock' as const,
      cards: [],
      total: 0,
      followups: ['Find a rental', 'Find an event', 'Recommend a restaurant', 'Plan a day trip'],
      message:
        'I\u2019m not sure what you\u2019re looking for yet \u2014 are you after a rental, an event, food, or something to see?',
    };
  },
});

const conciergeRoutingWorkflow = createWorkflow({
  id: 'concierge-routing-workflow',
  description:
    'Deterministic concierge routing: classify intent, dispatch rental/event/restaurant/attraction search.',
  inputSchema,
  outputSchema: dispatchOutputSchema,
})
  .then(classifyStep)
  .then(dispatchStep);

conciergeRoutingWorkflow.commit();

export { conciergeRoutingWorkflow };
