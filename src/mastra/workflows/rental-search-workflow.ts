import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { searchRentals } from '../tools/search-rentals';

const rentalSchema = z.object({
  id: z.string(),
  title: z.string(),
  neighborhood: z.string(),
  nightly_price: z.number(),
  currency: z.literal('USD'),
  bedrooms: z.number(),
  wifi: z.boolean(),
  amenities: z.array(z.string()),
  image: z.string(),
  source_url: z.string(),
  schedule_viewing_url: z.string(),
  host_name: z.string(),
  availability: z.string(),
  tags: z.array(z.string()),
});

const queryInputSchema = z.object({
  neighborhood: z.string().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxPricePerNight: z.number().positive().optional(),
  preference: z
    .enum(['remote_work', 'family', 'budget', 'nightlife', 'walkable', 'monthly', 'first_timer'])
    .optional()
    .describe('Optional reranker hint extracted from the user message'),
  limit: z.number().int().min(1).max(20).default(8),
});

const cardSchema = z.object({
  id: z.string(),
  headline: z.string(),
  subline: z.string(),
  priceLabel: z.string(),
  imageUrl: z.string(),
  sourceUrl: z.string(),
  scheduleViewingUrl: z.string(),
  hostName: z.string(),
  availability: z.string(),
  tags: z.array(z.string()),
  amenities: z.array(z.string()),
  wifi: z.boolean(),
  bestForLabel: z.string().optional(),
  rank: z.number().int().min(1).optional(),
});

const searchStep = createStep({
  id: 'search-rentals',
  description: 'Calls searchRentalsTool with official execute({ context }) pattern.',
  inputSchema: queryInputSchema,
  outputSchema: z.object({
    results: z.array(rentalSchema),
    total: z.number(),
    preference: queryInputSchema.shape.preference,
  }),
  execute: async ({ inputData }) => {
    const out = await searchRentals({
      neighborhood: inputData.neighborhood,
      minBedrooms: inputData.minBedrooms,
      maxPricePerNight: inputData.maxPricePerNight,
      limit: inputData.limit ?? 8,
    });
    const results = out.results.map((r) => ({
      ...r,
      currency: 'USD' as const,
      wifi: r.wifi ?? false,
      amenities: r.amenities ?? [],
      image: r.image ?? '',
      tags: r.tags ?? [],
    }));
    return { results, total: results.length, preference: inputData.preference };
  },
});

const formatStep = createStep({
  id: 'format-rental-cards',
  description: 'Shapes raw rentals into UI-friendly cards with viewing URLs.',
  inputSchema: z.object({
    results: z.array(rentalSchema),
    total: z.number(),
    preference: queryInputSchema.shape.preference,
  }),
  outputSchema: z.object({
    cards: z.array(cardSchema),
    total: z.number(),
    preference: queryInputSchema.shape.preference,
  }),
  execute: async ({ inputData }) => {
    const cards = inputData.results.map((r) => ({
      id: r.id,
      headline: r.title,
      subline: `${r.neighborhood} · ${r.bedrooms === 0 ? 'studio' : `${r.bedrooms}BR`} · host ${r.host_name}`,
      priceLabel: `$${r.nightly_price}/night`,
      imageUrl: r.image,
      sourceUrl: r.source_url,
      scheduleViewingUrl: r.schedule_viewing_url,
      hostName: r.host_name,
      availability: r.availability,
      tags: r.tags,
      amenities: r.amenities,
      wifi: r.wifi,
    }));
    return { cards, total: inputData.total, preference: inputData.preference };
  },
});

type RentalCard = z.infer<typeof cardSchema>;
type Preference = z.infer<typeof queryInputSchema.shape.preference>;

const PREFERENCE_LABEL: Record<NonNullable<Preference>, string> = {
  remote_work: 'Best for remote work',
  family: 'Best for families',
  budget: 'Best budget option',
  nightlife: 'Best nightlife access',
  walkable: 'Best walkable',
  monthly: 'Best monthly stay',
  first_timer: 'Best for first-timers',
};

function nightlyPriceFromLabel(label: string): number {
  const m = label.match(/\$(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}

function scoreCard(card: RentalCard, preference: Preference): number {
  const price = nightlyPriceFromLabel(card.priceLabel);
  const tagSet = new Set(card.tags.map((t) => t.toLowerCase()));
  const amenitySet = new Set(card.amenities.map((a) => a.toLowerCase()));
  const neighborhood = card.subline.toLowerCase();

  const has = (set: Set<string>, needle: string) =>
    Array.from(set).some((item) => item.includes(needle));

  switch (preference) {
    case 'remote_work':
      return (
        (card.wifi ? 50 : 0) +
        (has(amenitySet, 'desk') || has(amenitySet, 'workspace') ? 30 : 0) +
        (has(tagSet, 'remote') || has(tagSet, 'work') ? 20 : 0) -
        price * 0.05
      );
    case 'family':
      return (
        (has(tagSet, 'family') || has(tagSet, 'kid') ? 30 : 0) +
        (has(amenitySet, 'kitchen') ? 15 : 0) +
        (has(amenitySet, 'washer') ? 15 : 0) -
        price * 0.05
      );
    case 'budget':
      return 1000 - price;
    case 'nightlife':
      return (
        (neighborhood.includes('poblado') ? 40 : 0) +
        (neighborhood.includes('la 70') || neighborhood.includes('laureles') ? 25 : 0) +
        (has(tagSet, 'nightlife') ? 20 : 0)
      );
    case 'walkable':
      return (
        (neighborhood.includes('laureles') ? 35 : 0) +
        (neighborhood.includes('estadio') ? 25 : 0) +
        (has(tagSet, 'walkable') ? 25 : 0)
      );
    case 'monthly':
      return (has(tagSet, 'monthly') || has(tagSet, 'long-term') ? 40 : 0) + (1000 - price);
    case 'first_timer':
      return (neighborhood.includes('poblado') ? 30 : 0) + (card.wifi ? 10 : 0) - price * 0.02;
    default:
      return -price * 0.1;
  }
}

const FALLBACK_PRIORITY = [
  'Best budget option',
  'Best for remote work',
  'Best walkable',
  'Best nightlife access',
  'Best for families',
  'Best monthly stay',
  'Best for first-timers',
  'Best local feel',
  'Best value',
] as const;

function candidateLabels(card: RentalCard): string[] {
  const price = nightlyPriceFromLabel(card.priceLabel);
  const tagSet = new Set(card.tags.map((t) => t.toLowerCase()));
  const amenitySet = new Set(card.amenities.map((a) => a.toLowerCase()));
  const sub = card.subline.toLowerCase();
  const out: string[] = [];

  if (price < 50) out.push('Best budget option');
  if (
    card.wifi &&
    (Array.from(amenitySet).some((a) => a.includes('desk') || a.includes('workspace')) ||
      Array.from(tagSet).some((t) => t.includes('remote') || t.includes('work')))
  ) {
    out.push('Best for remote work');
  }
  if (sub.includes('laureles') || sub.includes('estadio')) out.push('Best walkable');
  if (sub.includes('poblado')) out.push('Best nightlife access');
  if (card.subline.match(/\d+BR/) && Number(card.subline.match(/(\d+)BR/)?.[1] ?? 0) >= 2) {
    if (Array.from(amenitySet).some((a) => a.includes('kitchen') || a.includes('washer'))) {
      out.push('Best for families');
    }
  }
  if (Array.from(tagSet).some((t) => t.includes('monthly') || t.includes('long'))) {
    out.push('Best monthly stay');
  }
  if (sub.includes('envigado') || sub.includes('belén') || sub.includes('belen')) {
    out.push('Best local feel');
  }
  out.push('Best value');
  return out;
}

function pickLabel(card: RentalCard, preference: Preference, used: Set<string>): string {
  if (preference) {
    const pref = PREFERENCE_LABEL[preference];
    if (!used.has(pref)) return pref;
  }
  const candidates = candidateLabels(card);
  for (const c of candidates) {
    if (!used.has(c)) return c;
  }
  for (const c of FALLBACK_PRIORITY) {
    if (!used.has(c)) return c;
  }
  return 'Best value';
}

const rerankStep = createStep({
  id: 'rerank-rentals',
  description:
    'Ranks rental cards by user preference and assigns a single "Best for" label per card. Caps output at 5 cards.',
  inputSchema: z.object({
    cards: z.array(cardSchema),
    total: z.number(),
    preference: queryInputSchema.shape.preference,
  }),
  outputSchema: z.object({
    cards: z.array(cardSchema),
    total: z.number(),
  }),
  execute: async ({ inputData }) => {
    const preference = inputData.preference;
    const scored = inputData.cards
      .map((c) => ({ card: c, score: scoreCard(c, preference) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const usedLabels = new Set<string>();
    const ranked: RentalCard[] = scored.map(({ card }, i) => {
      const label = pickLabel(card, preference, usedLabels);
      usedLabels.add(label);
      return { ...card, bestForLabel: label, rank: i + 1 };
    });

    return { cards: ranked, total: inputData.total };
  },
});

const rentalSearchWorkflow = createWorkflow({
  id: 'rental-search-workflow',
  description:
    'Camila rental search: query apartments, format cards, rerank with Best-for labels.',
  inputSchema: queryInputSchema,
  outputSchema: z.object({
    cards: z.array(cardSchema),
    total: z.number(),
  }),
})
  .then(searchStep)
  .then(formatStep)
  .then(rerankStep);

rentalSearchWorkflow.commit();

export { rentalSearchWorkflow };
