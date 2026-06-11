import { describe, expect, it } from "vitest";
import { classifyRouterIntent } from "../router-intent";
import { extractIntentSlotsHeuristic } from "../intent-slots";

const PARITY_QUERIES = [
  "1BR in Laureles under $80/night",
  "salsa events this weekend near Provenza",
  "quiet specialty coffee in Laureles",
  "dinner for 4 people date night restaurant El Poblado",
  "I need a venue for a birthday party for 30 people",
  "plan my weekend",
  "hi",
  "Find me a 2BR apartment",
  "Best restaurants in Laureles",
  "what can I do tonight",
] as const;

describe("SAN-868 · classifier parity — lib vs intent-slots", () => {
  it.each(PARITY_QUERIES)("«%s» intent matches classifyRouterIntent", (query) => {
    const router = classifyRouterIntent(query);
    const slots = extractIntentSlotsHeuristic(query);
    expect(slots.intent).toBe(router.intent);
    expect(slots.confidence).toBe(router.confidence);
    expect(slots.action).toBe(router.action);
  });
});
