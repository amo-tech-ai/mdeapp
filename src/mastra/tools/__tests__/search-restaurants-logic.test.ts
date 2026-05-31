import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapCuisineFromTypes, priceLevelToTier, estimateAvgPriceFromLevel, restaurantSchema, searchRestaurants } from '../search-restaurants.js';

vi.mock('../../lib/intelligence-restaurant-search', () => ({
  searchRestaurantsIntelligent: vi.fn().mockResolvedValue({ results: [], hybridUsed: false }),
}));
vi.mock('../../lib/search-logs', () => ({
  writeSearchLog: vi.fn().mockResolvedValue(null),
}));

describe('mapCuisineFromTypes', () => {
  it('maps Colombian / traditional to colombian', () => {
    expect(mapCuisineFromTypes(['Colombian', 'Traditional'])).toBe('colombian');
  });

  it('maps vegan / vegetarian to vegetarian', () => {
    expect(mapCuisineFromTypes(['Vegan', 'Healthy'])).toBe('vegetarian');
  });

  it('maps Japanese / Peruvian toward seafood', () => {
    expect(mapCuisineFromTypes(['Japanese', 'Peruvian'])).toBe('seafood');
  });

  it('returns international for empty or unknown', () => {
    expect(mapCuisineFromTypes(null)).toBe('international');
    expect(mapCuisineFromTypes([])).toBe('international');
    expect(mapCuisineFromTypes(['Quantum'])).toBe('international');
  });
});

describe('priceLevelToTier', () => {
  it('maps 1–4 to dollar tiers', () => {
    expect(priceLevelToTier(1)).toBe('$');
    expect(priceLevelToTier(2)).toBe('$$');
    expect(priceLevelToTier(3)).toBe('$$$');
    expect(priceLevelToTier(4)).toBe('$$$$');
  });

  it('clamps out-of-range levels', () => {
    expect(priceLevelToTier(0)).toBe('$');
    expect(priceLevelToTier(99)).toBe('$$$$');
  });
});

describe('estimateAvgPriceFromLevel', () => {
  it('returns monotonic anchors', () => {
    expect(estimateAvgPriceFromLevel(1)).toBeLessThan(estimateAvgPriceFromLevel(4));
  });
});

describe('searchRestaurants — intelligent search fallback', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('falls back to curated list when intelligent search returns empty results', async () => {
    const result = await searchRestaurants({ queryText: 'rooftop dinner Provenza', limit: 5 });
    expect(result.source).toBe('fallback');
    expect(result.results.length).toBeGreaterThan(0);
  });
});

describe('neighborhood sanitization', () => {
  it('strips PostgREST special chars from neighborhood before filter', async () => {
    // Supabase client unavailable in test → falls to fallback, but sanitization
    // must not throw. We verify the returned source is fallback (not an error throw).
    const result = await searchRestaurants({
      neighborhood: "Laureles,),*weird'input",
      limit: 5,
    });
    // Either supabase or fallback — must not throw
    expect(['supabase', 'fallback']).toContain(result.source);
  });
});

// MASTRA-048 enrichment field schema tests
// These prove that mapsUrl and aiSummary are declared in the schema
// and pass through correctly — values when enriched, null when not yet enriched.
const baseRestaurant = {
  id: 'test-001',
  name: 'Test Restaurant',
  cuisine: 'colombian' as const,
  neighborhood: 'El Poblado',
  priceTier: '$$$' as const,
  avgPricePerPerson: 30,
  currency: 'USD' as const,
  rating: 4.5,
  vibe: ['cozy'],
  imageUrl: 'https://example.com/img.jpg',
  sourceUrl: 'https://mdeai.co/restaurants/test-001',
};

describe('restaurantSchema — MASTRA-048 enrichment fields', () => {
  it('accepts mapsUrl and aiSummary when enriched', () => {
    const result = restaurantSchema.parse({
      ...baseRestaurant,
      placeId: 'ChIJ_abc123',
      mapsUrl: 'https://maps.google.com/?cid=12345',
      aiSummary: 'A top Colombian spot in El Poblado. Great bandeja paisa.',
    });
    expect(result.mapsUrl).toBe('https://maps.google.com/?cid=12345');
    expect(result.aiSummary).toBe('A top Colombian spot in El Poblado. Great bandeja paisa.');
    expect(result.placeId).toBe('ChIJ_abc123');
  });

  it('accepts null mapsUrl and aiSummary when not yet enriched', () => {
    const result = restaurantSchema.parse({
      ...baseRestaurant,
      mapsUrl: null,
      aiSummary: null,
    });
    expect(result.mapsUrl).toBeNull();
    expect(result.aiSummary).toBeNull();
  });

  it('accepts missing mapsUrl and aiSummary (unenriched row — undefined)', () => {
    const result = restaurantSchema.parse(baseRestaurant);
    expect(result.mapsUrl).toBeUndefined();
    expect(result.aiSummary).toBeUndefined();
  });
});
