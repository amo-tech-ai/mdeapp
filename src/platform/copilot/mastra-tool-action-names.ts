/**
 * CopilotKit useCopilotAction `name` must match Mastra `tools: { searchRentalsTool }` keys,
 * not createTool `id` (e.g. search-rentals). See CopilotKit mastra example: weatherTool vs get-weather.
 */
export const MASTRA_COPILOT_TOOL_ACTIONS = {
  rentals: "searchRentalsTool",
  events: "searchEventsTool",
  restaurants: "searchRestaurantsTool",
  attractions: "searchAttractionsTool",
  grounded: "searchGroundedPlacesTool",
  webEvents: "searchWebGroundedEventsTool",
  venueBooking: "requestVenueBooking",
} as const;

/** Legacy createTool ids — register duplicate renders if AG-UI streams these names. */
export const MASTRA_TOOL_IDS = {
  rentals: "search-rentals",
  events: "search-events",
  restaurants: "search-restaurants",
  attractions: "search-attractions",
  grounded: "search-grounded-places",
  webEvents: "search-web-grounded-events",
  venueBooking: "request-venue-booking",
} as const;
