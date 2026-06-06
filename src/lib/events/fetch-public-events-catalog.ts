import { headers } from "next/headers";
import type { PublishedEventListItem } from "@/lib/events/list-published-events";

export type PublicEventsCatalogResponse = {
  results: PublishedEventListItem[];
  total: number;
  limit: number;
  offset: number;
  error?: string;
};

export type FetchPublicEventsCatalogQuery = {
  category?: string;
  neighborhood?: string;
  dateWindow?: string;
  price?: string;
  limit?: number;
  offset?: number;
};

async function catalogBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3001";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

/** SAN-518 — server fetch of GET /api/events/public (same contract as browse UI). */
export async function fetchPublicEventsCatalog(
  query: FetchPublicEventsCatalogQuery,
): Promise<{ results: PublishedEventListItem[]; total: number; error: string | null }> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.neighborhood) params.set("neighborhood", query.neighborhood);
  if (query.dateWindow) params.set("dateWindow", query.dateWindow);
  if (query.price) params.set("price", query.price);
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.offset != null) params.set("offset", String(query.offset));

  const base = await catalogBaseUrl();
  const url = `${base}/api/events/public${params.size ? `?${params}` : ""}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const body = (await res.json()) as PublicEventsCatalogResponse;
    if (!res.ok) {
      return {
        results: [],
        total: 0,
        error: body.error ?? "Could not load events. Try again in a moment.",
      };
    }
    return { results: body.results ?? [], total: body.total ?? 0, error: null };
  } catch {
    return {
      results: [],
      total: 0,
      error: "Could not load events. Try again in a moment.",
    };
  }
}
