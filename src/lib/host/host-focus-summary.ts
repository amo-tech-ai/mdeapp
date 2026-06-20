/**
 * SAN-1209 · HOST-OS-001 — Host focus model + summary builder (pure).
 *
 * No React / CopilotKit imports so the focus-summary logic is unit-testable
 * without a DOM (and without pulling in the v2 package's CSS side-effect). The
 * provider in `host-context-provider.tsx` re-exports these and feeds the summary
 * to `hostOpsAgent`.
 */

export type HostFocusRef = {
  id: string;
  name: string;
};

export type HostDateRange = {
  from: string;
  to: string;
};

/** JSON-safe value, mirroring CopilotKit's (unexported) `JsonSerializable`. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type HostFocusInput = {
  currentOrganization: HostFocusRef | null;
  currentEvent: HostFocusRef | null;
  currentVenue: HostFocusRef | null;
  currentFilters: Record<string, string>;
  currentDateRange: HostDateRange | null;
};

/**
 * Compact, JSON-serializable summary handed to `hostOpsAgent`. Only includes
 * fields that are actually in focus, so the agent never sees empty noise.
 */
// skipcq: JS-0067, JS-R1005 - ES module export; sequential focus-field guards kept inline
export function buildHostFocusSummary(
  value: HostFocusInput,
): Record<string, JsonValue> {
  const summary: Record<string, JsonValue> = {};
  if (value.currentOrganization) {
    summary.organization = value.currentOrganization;
  }
  if (value.currentEvent) summary.event = value.currentEvent;
  if (value.currentVenue) summary.venue = value.currentVenue;
  if (Object.keys(value.currentFilters).length > 0) {
    summary.filters = value.currentFilters;
  }
  if (value.currentDateRange) summary.dateRange = value.currentDateRange;
  return summary;
}
