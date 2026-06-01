/**
 * INT-022 — Per-decision routing telemetry.
 * Emits one structured log line per routing choice (search_now / clarify / agent).
 * No DB writes. No raw user text. Gated behind LOG_LEVEL=debug.
 */

export type RoutingDecision = {
  intent:
    | "rental_search"
    | "event_discovery"
    | "restaurant_search"
    | "cafe_search"
    | "venue_search"
    | "unknown";
  /** Derived slots only — never raw query text. */
  slots: Record<string, string | number | boolean>;
  confidence: number;
  action: "search_now" | "clarify" | "agent" | "canned_fallback";
  source: "fast-path" | "clarify-branch" | "agent-route";
  resultCount?: number;
  /** CopilotKit messageId — used to deduplicate double-logs. */
  turnId?: string;
  ts: string;
};

export function logRoutingDecision(record: RoutingDecision): void {
  if (
    process.env.LOG_LEVEL !== "debug" &&
    process.env.NEXT_PUBLIC_LOG_LEVEL !== "debug"
  ) {
    return;
  }
  console.info("[int-routing]", JSON.stringify(record));
}
