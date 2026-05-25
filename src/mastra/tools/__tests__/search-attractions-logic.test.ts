import { describe, it, expect } from 'vitest';
import {
  normalizeCategory,
  parseDurationMinutes,
  deriveBestTime,
  deriveNeighborhood,
  attractionSchema,
} from '../search-attractions.js';

describe('search-attractions helpers', () => {
  describe('normalizeCategory', () => {
    it('passes through known enum values', () => {
      expect(normalizeCategory('museum')).toBe('museum');
      expect(normalizeCategory('park')).toBe('park');
    });
    it('maps aliases', () => {
      expect(normalizeCategory('City Park')).toBe('park');
      expect(normalizeCategory('art gallery')).toBe('museum');
    });
    it('defaults for empty/unknown', () => {
      expect(normalizeCategory(null)).toBe('landmark');
      expect(normalizeCategory('')).toBe('landmark');
      expect(normalizeCategory('something-random')).toBe('landmark');
    });
  });

  describe('parseDurationMinutes', () => {
    it('parses minutes and hours', () => {
      expect(parseDurationMinutes('45 min')).toBe(45);
      expect(parseDurationMinutes('2 hours')).toBe(120);
    });
    it('defaults on empty', () => {
      expect(parseDurationMinutes(null)).toBe(60);
    });
  });

  describe('deriveBestTime', () => {
    it('reads from best_for and tags', () => {
      expect(deriveBestTime(['morning walks'], [])).toBe('morning');
      expect(deriveBestTime([], ['evening show'])).toBe('evening');
    });
    it('defaults to any', () => {
      expect(deriveBestTime([], [])).toBe('any');
    });
  });

  describe('deriveNeighborhood', () => {
    it('prefers subcategory then address then city', () => {
      expect(
        deriveNeighborhood({ subcategory: 'Poblado', address: 'Calle 10', city: 'Medellín' }),
      ).toBe('Poblado');
      expect(deriveNeighborhood({ subcategory: '', address: 'La 70', city: 'Medellín' })).toBe('La 70');
      expect(deriveNeighborhood({ subcategory: '', address: '', city: 'Medellín' })).toBe('Medellín');
    });
    it('falls back to Medellín', () => {
      expect(deriveNeighborhood({ subcategory: '', address: '', city: '' })).toBe('Medellín');
    });
  });
});

// MASTRA-048 enrichment field schema tests
// Proves mapsUrl and aiSummary are wired in the schema with correct nullability.
const baseAttraction = {
  id: 'att-001',
  name: 'Parque Arví',
  category: 'park' as const,
  neighborhood: 'Santa Elena',
  priceUsd: 0,
  durationMinutes: 120,
  rating: 4.7,
  bestTimeOfDay: 'morning' as const,
  tags: ['nature', 'hiking'],
  imageUrl: 'https://example.com/arvi.jpg',
  sourceUrl: 'https://mdeai.co/attractions/att-001',
};

describe('attractionSchema — MASTRA-048 enrichment fields', () => {
  it('accepts mapsUrl and aiSummary when enriched', () => {
    const result = attractionSchema.parse({
      ...baseAttraction,
      placeId: 'ChIJ_parque_arvi',
      mapsUrl: 'https://maps.google.com/?cid=99999',
      aiSummary: 'Parque Arví is a vast ecological reserve near Medellín. Ideal for hiking and cable car rides.',
    });
    expect(result.mapsUrl).toBe('https://maps.google.com/?cid=99999');
    expect(result.aiSummary).toContain('ecological reserve');
    expect(result.placeId).toBe('ChIJ_parque_arvi');
  });

  it('accepts null mapsUrl and aiSummary when not yet enriched', () => {
    const result = attractionSchema.parse({
      ...baseAttraction,
      mapsUrl: null,
      aiSummary: null,
    });
    expect(result.mapsUrl).toBeNull();
    expect(result.aiSummary).toBeNull();
  });

  it('accepts missing mapsUrl and aiSummary (unenriched row — undefined)', () => {
    const result = attractionSchema.parse(baseAttraction);
    expect(result.mapsUrl).toBeUndefined();
    expect(result.aiSummary).toBeUndefined();
  });
});
