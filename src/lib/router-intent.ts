/**
 * [SAN-494 · Canonical router intent schema + deterministic classifier](https://linear.app/sanjiovani/issue/SAN-494/evt-035-restaurant-card-event-venue-cta)
 * Classify user goal first, then route to fast-path or conciergeAgent.
 */
import { z } from "zod";
import { looksLikeEventVenueBookingQuery } from "@/lib/event-venue-booking-intent";
import {
  DAY_TRIP_RE,
  hasEventFastPathSignals,
  looksLikeNonEventSearch,
  scoreEventQuery,
} from "@/lib/event-query-classifier";
import {
  looksLikeNonRentalSearch,
  looksLikeRentalSearch,
} from "@/lib/rental-query-parser";
import {
  looksLikeCafeSearch,
  looksLikeNightlifeGroundingSearch,
  looksLikeRestaurantSearch,
} from "@/lib/restaurant-query-classifier";

/** Canonical router intents — keep in sync with classify-intent tool + working memory. */
export const routerIntentSchema = z.enum([
  "rental_search",
  "event_discovery",
  "venue_booking",
  "restaurant_discovery",
  "day_trip_planning",
  "general_concierge",
  "chitchat",
  "unknown",
]);

export type RouterIntent = z.infer<typeof routerIntentSchema>;

export type RouterRoutingTarget =
  | "rental"
  | "event_venue_booking"
  | "event"
  | "grounded"
  | "restaurant"
  | "agent";

export type RouterAction = "search_now" | "clarify" | "agent";

export type RouterIntentClassification = {
  intent: RouterIntent;
  confidence: number;
  reason: string;
  action: RouterAction;
  routingTarget: RouterRoutingTarget;
};

export const ROUTER_CONFIDENCE_FAST_PATH = 0.85;
export const ROUTER_CONFIDENCE_CLARIFY_MIN = 0.5;

export function routerConfidenceToAction(confidence: number): RouterAction {
  if (confidence >= ROUTER_CONFIDENCE_FAST_PATH) return "search_now";
  if (confidence >= ROUTER_CONFIDENCE_CLARIFY_MIN) return "clarify";
  return "agent";
}

/** Intent → workflow / handler / tools (routing table for audits + agent prompts). */
export const ROUTER_ROUTING_TABLE: Record<
  RouterIntent,
  {
    workflow: string;
    fastPathHandler?: RouterRoutingTarget;
    primaryTools: string[];
    clarifyWhenLowConfidence: boolean;
  }
> = {
  rental_search: {
    workflow: "rental-fast-path",
    fastPathHandler: "rental",
    primaryTools: ["search-rentals"],
    clarifyWhenLowConfidence: true,
  },
  event_discovery: {
    workflow: "event-fast-path",
    fastPathHandler: "event",
    primaryTools: ["search-events"],
    clarifyWhenLowConfidence: true,
  },
  venue_booking: {
    workflow: "venue-booking-fast-path",
    fastPathHandler: "event_venue_booking",
    primaryTools: ["search-restaurants"],
    clarifyWhenLowConfidence: false,
  },
  restaurant_discovery: {
    workflow: "restaurant-fast-path",
    fastPathHandler: "restaurant",
    primaryTools: ["search-restaurants", "search-grounded-places"],
    clarifyWhenLowConfidence: true,
  },
  day_trip_planning: {
    workflow: "concierge-agent",
    primaryTools: ["search-attractions", "search-grounded-places"],
    clarifyWhenLowConfidence: false,
  },
  general_concierge: {
    workflow: "concierge-agent",
    primaryTools: ["search-rentals", "search-events", "search-restaurants", "search-attractions"],
    clarifyWhenLowConfidence: false,
  },
  chitchat: {
    workflow: "concierge-agent",
    primaryTools: [],
    clarifyWhenLowConfidence: false,
  },
  unknown: {
    workflow: "concierge-agent",
    primaryTools: [],
    clarifyWhenLowConfidence: true,
  },
};

export const ROUTER_HANDLER_ORDER: RouterRoutingTarget[] = [
  "rental",
  "event_venue_booking",
  "event",
  "grounded",
  "restaurant",
];

const CHITCHAT_RE = /^\s*(hi|hello|hey|hola|thanks|thank you|thx|how are you)\b/i;

function intentToRoutingTarget(intent: RouterIntent): RouterRoutingTarget {
  const row = ROUTER_ROUTING_TABLE[intent];
  return row.fastPathHandler ?? "agent";
}

export function classifyRouterIntent(text: string): RouterIntentClassification {
  const normalized = text.trim();
  if (!normalized) {
    return {
      intent: "unknown",
      confidence: 0,
      reason: "empty message",
      action: "agent",
      routingTarget: "agent",
    };
  }

  if (CHITCHAT_RE.test(normalized)) {
    return {
      intent: "chitchat",
      confidence: 0.95,
      reason: "greeting or thanks",
      action: "agent",
      routingTarget: "agent",
    };
  }

  if (looksLikeRentalSearch(normalized) && !looksLikeNonRentalSearch(normalized)) {
    const confidence = 0.88;
    return {
      intent: "rental_search",
      confidence,
      reason: "apartment or rental search",
      action: routerConfidenceToAction(confidence),
      routingTarget: "rental",
    };
  }

  if (looksLikeEventVenueBookingQuery(normalized)) {
    const confidence = 0.92;
    return {
      intent: "venue_booking",
      confidence,
      reason: "private event venue hire — not ticketed events",
      action: "search_now",
      routingTarget: "event_venue_booking",
    };
  }

  if (DAY_TRIP_RE.test(normalized) && !/\bevents?\b/i.test(normalized)) {
    const confidence = DAY_TRIP_RE.test(normalized) && /\bweekend\b/i.test(normalized) ? 0.72 : 0.62;
    return {
      intent: "day_trip_planning",
      confidence,
      reason: "activities, tours, or weekend planning",
      action: routerConfidenceToAction(confidence),
      routingTarget: "agent",
    };
  }

  const eventSignals = scoreEventQuery(normalized);
  if (
    !looksLikeNonEventSearch(normalized) &&
    (hasEventFastPathSignals(normalized, eventSignals) ||
      /\bevents?\b/i.test(normalized) ||
      /\bwhat'?s on\b/i.test(normalized))
  ) {
    const confidence =
      eventSignals.hasCategory && eventSignals.hasDateWindow ? 0.9 : 0.75;
    return {
      intent: "event_discovery",
      confidence,
      reason: "ticketed event catalogue search",
      action: routerConfidenceToAction(confidence),
      routingTarget: "event",
    };
  }

  if (looksLikeCafeSearch(normalized) || looksLikeNightlifeGroundingSearch(normalized)) {
    const confidence = 0.85;
    return {
      intent: "restaurant_discovery",
      confidence,
      reason: "café, bar, or map POI food/nightlife search",
      action: "search_now",
      routingTarget: looksLikeCafeSearch(normalized) || looksLikeNightlifeGroundingSearch(normalized)
        ? "grounded"
        : "restaurant",
    };
  }

  if (looksLikeRestaurantSearch(normalized)) {
    const confidence = 0.8;
    return {
      intent: "restaurant_discovery",
      confidence,
      reason: "sit-down restaurant meal search",
      action: routerConfidenceToAction(confidence),
      routingTarget: "restaurant",
    };
  }

  if (normalized.length < 4) {
    return {
      intent: "unknown",
      confidence: 0.2,
      reason: "message too short",
      action: "clarify",
      routingTarget: "agent",
    };
  }

  return {
    intent: "general_concierge",
    confidence: 0.35,
    reason: "open-ended concierge request",
    action: "agent",
    routingTarget: "agent",
  };
}

/** Primary handler first — venue_booking never falls through to event before its handler runs. */
export function routerHandlerOrderFor(text: string): RouterRoutingTarget[] {
  const primary = classifyRouterIntent(text).routingTarget;
  if (primary === "agent") return [];
  return [primary, ...ROUTER_HANDLER_ORDER.filter((t) => t !== primary)];
}

export function routerIntentForTarget(target: RouterRoutingTarget): RouterIntent {
  switch (target) {
    case "rental":
      return "rental_search";
    case "event_venue_booking":
      return "venue_booking";
    case "event":
      return "event_discovery";
    case "grounded":
    case "restaurant":
      return "restaurant_discovery";
    default:
      return "general_concierge";
  }
}

export { intentToRoutingTarget };
