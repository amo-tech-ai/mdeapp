import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { searchEvents } from '../tools/search-events';

const categoryEnum = z.enum(['music', 'food', 'culture', 'sport', 'nightlife']);

const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: categoryEnum,
  venue: z.string(),
  neighborhood: z.string(),
  startsAt: z.string(),
  pricePerTicket: z.number(),
  currency: z.literal('USD'),
  imageUrl: z.string(),
});

const queryInputSchema = z.object({
  category: categoryEnum.optional(),
  neighborhood: z.string().optional(),
  maxPricePerTicket: z.number().positive().optional(),
  limit: z.number().int().min(1).max(20).default(5),
});

const cardSchema = z.object({
  id: z.string(),
  headline: z.string(),
  subline: z.string(),
  priceLabel: z.string(),
  imageUrl: z.string(),
});

const searchStep = createStep({
  id: 'search-events',
  description: 'Calls the search-events helper with mock data.',
  inputSchema: queryInputSchema,
  outputSchema: z.object({
    results: z.array(eventSchema),
    total: z.number(),
  }),
  execute: async ({ inputData }) => {
    const out = await searchEvents({
      category: inputData.category,
      neighborhood: inputData.neighborhood,
      maxPricePerTicket: inputData.maxPricePerTicket,
      limit: inputData.limit ?? 5,
    });
    return { results: out.results, total: out.total };
  },
});

const formatStep = createStep({
  id: 'format-event-cards',
  description: 'Shapes raw events into UI-friendly cards.',
  inputSchema: z.object({
    results: z.array(eventSchema),
    total: z.number(),
  }),
  outputSchema: z.object({
    cards: z.array(cardSchema),
    total: z.number(),
  }),
  execute: async ({ inputData }) => {
    const cards = inputData.results.map((e) => ({
      id: e.id,
      headline: e.title,
      subline: `${e.venue} · ${e.neighborhood} · ${e.category}`,
      priceLabel: `$${e.pricePerTicket}`,
      imageUrl: e.imageUrl,
    }));
    return { cards, total: inputData.total };
  },
});

const eventDiscoveryWorkflow = createWorkflow({
  id: 'event-discovery-workflow',
  description: 'Event discovery: search Supabase events, format ticket cards for Studio and router.',
  inputSchema: queryInputSchema,
  outputSchema: z.object({
    cards: z.array(cardSchema),
    total: z.number(),
  }),
})
  .then(searchStep)
  .then(formatStep);

eventDiscoveryWorkflow.commit();

export { eventDiscoveryWorkflow };
