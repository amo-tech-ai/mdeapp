/**
 * search-events — Supabase-backed event search for the Mastra runtime.
 *
 * Replaces the previous MOCK_EVENTS constant with a real query against
 * public.events. Date boundaries use Bogota local time (America/Bogota,
 * UTC-5 no DST) so "this weekend" and "tonight" resolve correctly for
 * Colombian users regardless of server region.
 */
import { createTool } from '@mastra/core/tools';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { runAuditedSearch } from '../lib/run-audited-search';
import { searchEventsIntelligent } from '../lib/intelligence-event-search';
import { writeSearchLog } from '../lib/search-logs';

// ── Schema ────────────────────────────────────────────────────────────────────

const categoryEnum = z.enum(['music', 'food', 'culture', 'sport', 'nightlife']);

const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: categoryEnum,
  venue: z.string(),
  neighborhood: z.string(),
  startsAt: z.string().describe('ISO 8601'),
  pricePerTicket: z.number(),
  currency: z.literal('USD'),
  imageUrl: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // MASTRA-048: enrichment fields (populated by scripts/enrich-places.ts)
  mapsUrl: z.string().nullable().optional().describe('Canonical Google Maps deep link (placeUri)'),
  sourceUrl: z.string().optional().describe('Canonical event or maps URL for card link'),
});

export type EventCard = z.infer<typeof eventSchema>;
export type EventCategory = z.infer<typeof categoryEnum>;

// ── DB event_type -> EventCard category mapping ───────────────────────────────

const EVENT_TYPE_MAP: Record<string, EventCategory> = {
  music: 'music', Music: 'music',
  nightlife: 'nightlife', Nightlife: 'nightlife', dance: 'nightlife', Dance: 'nightlife',
  sport: 'sport', Sport: 'sport', Sports: 'sport',
  food: 'food', Food: 'food', dining: 'food',
  culture: 'culture', Culture: 'culture', art: 'culture', Art: 'culture',
  festival: 'culture', Festival: 'culture', parade: 'culture', Parade: 'culture',
  comedy: 'nightlife', Comedy: 'nightlife',
  conference: 'culture', Conference: 'culture',
};

export function mapCategory(eventType: string | null): EventCategory {
  if (!eventType) return 'culture';
  return EVENT_TYPE_MAP[eventType] ?? 'culture';
}

// ── Neighborhood extraction from address field ────────────────────────────────
// Addresses are stored as "Neighborhood, Street, City" so the first segment
// before the comma is the neighborhood. Falls back to city name.

export function extractNeighborhood(address: string | null, city: string | null): string {
  if (address) return address.split(',')[0].trim();
  return city ?? 'Medellin';
}

// ── Bogota time window helpers ────────────────────────────────────────────────
// America/Bogota is UTC-5, no DST. We use fixed offset arithmetic rather than
// relying on TZ env which may not be set in the Mastra runtime.

export const BOGOTA_OFFSET_MS = -5 * 60 * 60 * 1000; // UTC-5

export function nowBogota(): Date {
  const utcNow = Date.now();
  return new Date(utcNow + BOGOTA_OFFSET_MS);
}

export function bogotaStartOfDay(d: Date): Date {
  const b = new Date(d.getTime());
  b.setUTCHours(0, 0, 0, 0);
  return new Date(b.getTime() - BOGOTA_OFFSET_MS); // back to UTC for DB query
}

export function bogotaEndOfDay(d: Date): Date {
  const b = new Date(d.getTime());
  b.setUTCHours(23, 59, 59, 999);
  return new Date(b.getTime() - BOGOTA_OFFSET_MS);
}

export type DateWindow = 'tonight' | 'this_weekend' | 'this_week' | 'next_week' | 'any';

export function dateWindow(window: DateWindow | undefined): { gte?: string; lte?: string } {
  if (!window || window === 'any') return {};

  const now = nowBogota();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ... 6=Sat (in Bogota time)

  if (window === 'tonight') {
    // Use current moment as lower bound so past events tonight don't appear.
    return {
      gte: new Date(Date.now()).toISOString(),
      lte: bogotaEndOfDay(now).toISOString(),
    };
  }

  if (window === 'this_weekend') {
    // daysSinceFriday: 0=Fri, 1=Sat, 2=Sun, 3=Mon … 6=Thu
    const daysSinceFriday = (dayOfWeek - 5 + 7) % 7;
    let friday: Date;
    if (daysSinceFriday <= 2) {
      // We are in Fri/Sat/Sun — anchor to the most recent Friday
      friday = new Date(now.getTime() - daysSinceFriday * 86400000);
    } else {
      // Mon-Thu — jump to the upcoming Friday
      friday = new Date(now.getTime() + (7 - daysSinceFriday) * 86400000);
    }
    const sunday = new Date(friday.getTime() + 2 * 86400000);
    return {
      gte: bogotaStartOfDay(friday).toISOString(),
      lte: bogotaEndOfDay(sunday).toISOString(),
    };
  }

  if (window === 'this_week') {
    const monday = new Date(now.getTime() - ((dayOfWeek + 6) % 7) * 86400000);
    const sunday = new Date(monday.getTime() + 6 * 86400000);
    return {
      gte: bogotaStartOfDay(monday).toISOString(),
      lte: bogotaEndOfDay(sunday).toISOString(),
    };
  }

  if (window === 'next_week') {
    const monday = new Date(now.getTime() - ((dayOfWeek + 6) % 7) * 86400000);
    const nextMonday = new Date(monday.getTime() + 7 * 86400000);
    const nextSunday = new Date(nextMonday.getTime() + 6 * 86400000);
    return {
      gte: bogotaStartOfDay(nextMonday).toISOString(),
      lte: bogotaEndOfDay(nextSunday).toISOString(),
    };
  }

  return {};
}

// ── Supabase client (lazy, singleton) ────────────────────────────────────────

let _client: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

// ── DB row -> EventCard mapper ────────────────────────────────────────────────

interface EventRow {
  id: string;
  name: string;
  event_type: string | null;
  address: string | null;
  city: string | null;
  event_start_time: string;
  ticket_price_min: number | null;
  currency: string | null;
  primary_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  // MASTRA-048 enrichment
  maps_url: string | null;
}

function rowToCard(row: EventRow): EventCard {
  return {
    id: row.id,
    title: row.name,
    category: mapCategory(row.event_type),
    venue: row.address ?? 'Medellin',
    neighborhood: extractNeighborhood(row.address, row.city),
    startsAt: row.event_start_time,
    pricePerTicket: row.ticket_price_min ?? 0,
    currency: 'USD',
    imageUrl: row.primary_image_url ?? '',
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    mapsUrl: row.maps_url ?? null,
    sourceUrl: row.maps_url ?? `https://mdeai.co/events/${row.id}`,
  };
}

// ── Query ─────────────────────────────────────────────────────────────────────

export type EventQuery = {
  category?: EventCategory;
  neighborhood?: string;
  maxPricePerTicket?: number;
  dateWindow?: DateWindow;
  limit?: number;
  queryText?: string;
};

export type EventSearchResult = {
  results: EventCard[];
  total: number;
  source: 'supabase' | 'fallback';
  hybridUsed?: boolean;
  rankExplanation?: import('../lib/search-logs').RankExplanationEntry[];
};

export async function searchEvents(
  query: EventQuery,
): Promise<EventSearchResult> {
  const limit = query.limit ?? 5;

  if (query.queryText?.trim()) {
    const started = Date.now();
    const intel = await searchEventsIntelligent(query);
    const latencyMs = Date.now() - started;
    await writeSearchLog({
      queryText: query.queryText,
      slots: intel.slots,
      toolName: 'search-events',
      resultsCount: intel.results.length,
      latencyMs,
      hybridUsed: intel.hybridUsed,
      groundingUsed: false,
      rankExplanation: intel.rankExplanation,
    });
    return {
      results: intel.results.slice(0, limit),
      total: intel.total,
      source: intel.source,
      hybridUsed: intel.hybridUsed,
      rankExplanation: intel.rankExplanation,
    };
  }

  const client = getSupabaseClient();

  if (!client) {
    console.warn('[search-events] Supabase client unavailable — returning empty');
    return { results: [], total: 0, source: 'fallback' };
  }

  let q = client
    .from('events')
    .select('id, name, event_type, address, city, event_start_time, ticket_price_min, currency, primary_image_url, latitude, longitude, maps_url')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('event_start_time', { ascending: true })
    .limit(limit);

  if (query.category) {
    // Match DB event_type values that map to the requested category
    const dbTypes = Object.entries(EVENT_TYPE_MAP)
      .filter(([, cat]) => cat === query.category)
      .map(([type]) => type);
    q = q.in('event_type', dbTypes);
  }

  if (query.neighborhood) {
    q = q.ilike('address', `%${query.neighborhood}%`);
  }

  if (typeof query.maxPricePerTicket === 'number') {
    q = q.lte('ticket_price_min', query.maxPricePerTicket);
  }

  const window = dateWindow(query.dateWindow);
  if (window.gte) q = q.gte('event_start_time', window.gte);
  if (window.lte) q = q.lte('event_start_time', window.lte);

  const { data, error } = await q;

  if (error) {
    console.error('[search-events] Supabase error:', error.message);
    return { results: [], total: 0, source: 'fallback' };
  }

  const results = (data as EventRow[]).map(rowToCard);
  return { results, total: results.length, source: 'supabase' };
}

// ── Tool definition ───────────────────────────────────────────────────────────

export const searchEventsTool = createTool({
  id: 'search-events',
  description:
    'Search real Medellin events from the mdeai database by category, neighborhood, price, and date window. Uses Bogota local time for date boundaries.',
  inputSchema: z.object({
    category: categoryEnum.optional(),
    neighborhood: z.string().optional().describe('Medellin neighborhood, e.g. El Poblado, Laureles'),
    maxPricePerTicket: z.number().positive().optional().describe('Max ticket price in USD'),
    dateWindow: z
      .enum(['tonight', 'this_weekend', 'this_week', 'next_week', 'any'])
      .optional()
      .default('any'),
    limit: z.number().int().min(1).max(20).default(5),
    queryText: z
      .string()
      .optional()
      .describe('Natural-language event search e.g. salsa this weekend in Medellín'),
  }),
  outputSchema: z.object({
    results: z.array(
      eventSchema.extend({
        rankScore: z.number().optional(),
        evidenceText: z.string().nullable().optional(),
      }),
    ),
    total: z.number(),
    source: z.enum(['supabase', 'fallback']),
    hybridUsed: z.boolean().optional(),
    rankExplanation: z
      .array(
        z.object({
          factor: z.string(),
          score: z.number(),
          note: z.string(),
        }),
      )
      .optional(),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (inputData: EventQuery & { dateWindow?: DateWindow }, context?: any) => {
    const {
      category,
      neighborhood,
      maxPricePerTicket,
      dateWindow: dw,
      limit = 5,
      queryText,
    } = inputData;
    const { results, total, source, hybridUsed, rankExplanation } = await runAuditedSearch(
      'search-events',
      searchEvents,
      {
        category,
        neighborhood,
        maxPricePerTicket,
        dateWindow: dw,
        limit,
        queryText,
      },
      context,
    );

    await context?.writer?.custom({
      type: 'data-mdeai-actions',
      data: {
        kind: 'event_results',
        cards: results.map((e) => ({
          id: e.id,
          title: e.title,
          category: e.category,
          venue: e.venue,
          neighborhood: e.neighborhood,
          startsAt: e.startsAt,
          pricePerTicket: e.pricePerTicket,
          currency: e.currency,
          imageUrl: e.imageUrl,
          sourceUrl: e.sourceUrl ?? e.mapsUrl ?? `https://mdeai.co/events/${e.id}`,
          latitude: e.latitude ?? null,
          longitude: e.longitude ?? null,
          mapsUrl: e.mapsUrl ?? null,
        })),
        source,
        hybridUsed: hybridUsed ?? false,
        rankExplanation: rankExplanation ?? [],
      },
    });

    return { results, total, source, hybridUsed, rankExplanation };
  },
});
