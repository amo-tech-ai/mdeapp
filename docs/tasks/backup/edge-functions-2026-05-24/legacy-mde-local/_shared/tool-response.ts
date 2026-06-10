/**
 * The unified envelope every chat tool returns.
 *
 * Client (useChat + ChatMessageList + ChatMap) renders generically by reading
 * `type` + `listings` + `agent_label` — adding a new vertical (restaurants,
 * events, attractions) means registering a new tool that returns this shape,
 * plus one new card component keyed on `type`. No changes to the chat
 * pipeline, map, or SSE handling are required.
 *
 * See: tasks/CHAT-CENTRAL-PLAN.md §3 — Architecture.
 */

export type VerticalType = "rentals" | "restaurants" | "events" | "attractions";

/** Structured actions the client dispatches (button clicks, navigation, etc). */
export interface ChatAction {
  type: "OPEN_RENTALS_RESULTS" | "ADD_TO_TRIP" | string;
  payload: Record<string, unknown>;
}

/** Rejection rows for the "Not a Good Fit" transparency table. */
export interface ConsideredButRejected {
  listing_summary: string;
  reason: string;
}

/**
 * Fixed response shape from every tool. `listings` is intentionally `unknown[]`
 * because each vertical has its own row shape — cards switch on `type` and
 * downcast as needed.
 */
export interface ToolResponse {
  /** Which vertical produced this response. Drives card + pin rendering. */
  type: VerticalType;
  /** One-sentence AI-facing summary. Gemini paraphrases; client may display verbatim. */
  message: string;
  /** Total matching rows in the DB (for "showing 5 of N"). */
  total_count: number;
  /** How many rows the tool actively considered (for "12 of 72 considered"). */
  considered?: number;
  /** The result rows — shape varies per vertical. */
  listings: Record<string, unknown>[];
  /** Filter params used for the search (echoed back for the URL handoff). */
  filters_applied: Record<string, unknown>;
  /** Rows seen but rejected, with plain-language reason. Powers the trust moat. */
  considered_but_rejected?: ConsideredButRejected[];
  /** Actions for the client (e.g. open full results page, add to trip). */
  actions?: ChatAction[];
  /** Human-readable agent persona for the reasoning trace header. */
  agent_label?: string;
}

/**
 * Type guard — useful both on the edge function (collecting actions from
 * arbitrary tool return values) and on the client (narrowing stream payloads).
 */
export function isToolResponse(v: unknown): v is ToolResponse {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.type === "string" &&
    typeof r.message === "string" &&
    typeof r.total_count === "number" &&
    Array.isArray(r.listings)
  );
}
