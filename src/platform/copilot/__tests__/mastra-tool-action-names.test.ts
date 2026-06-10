import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "../mastra-tool-action-names";

describe("MASTRA_COPILOT_TOOL_ACTIONS", () => {
  it("matches concierge agent tools object keys", () => {
    const concierge = readFileSync(
      join(process.cwd(), "src/mastra/agents/concierge.ts"),
      "utf8",
    );
    for (const key of Object.values(MASTRA_COPILOT_TOOL_ACTIONS)) {
      expect(concierge).toContain(`${key}`);
    }
  });

  it("is referenced by search-tool-renders", () => {
    const renders = readFileSync(
      join(process.cwd(), "src/components/copilot/search-tool-renders.tsx"),
      "utf8",
    );
    expect(renders).toContain("MASTRA_COPILOT_TOOL_ACTIONS.rentals");
    expect(renders).toContain("MASTRA_TOOL_IDS.rentals");
  });

  it("SAN-303 venue booking tool id → agent key → CopilotKit action", () => {
    const tool = readFileSync(
      join(process.cwd(), "src/mastra/tools/request-venue-booking.ts"),
      "utf8",
    );
    const concierge = readFileSync(
      join(process.cwd(), "src/mastra/agents/concierge.ts"),
      "utf8",
    );
    const bridge = readFileSync(
      join(process.cwd(), "src/components/copilot/concierge-venue-booking-bridge.tsx"),
      "utf8",
    );
    expect(tool).toContain(`id: "${MASTRA_TOOL_IDS.venueBooking}"`);
    expect(concierge).toContain(MASTRA_COPILOT_TOOL_ACTIONS.venueBooking);
    expect(bridge).toContain(MASTRA_COPILOT_TOOL_ACTIONS.venueBooking);
  });

  it("UX-T-014 search tools do not use writer.custom — cards via useCopilotAction render", () => {
    const toolFiles = [
      "src/mastra/tools/search-restaurants.ts",
      "src/mastra/tools/search-rentals.ts",
      "src/mastra/tools/search-events.ts",
      "src/mastra/tools/search-attractions.ts",
      "src/mastra/tools/search-grounded-places.ts",
    ];
    for (const file of toolFiles) {
      const text = readFileSync(join(process.cwd(), file), "utf8");
      expect(text).not.toMatch(/writer\?\.custom\s*\(/);
    }
    const renders = readFileSync(
      join(process.cwd(), "src/components/copilot/search-tool-renders.tsx"),
      "utf8",
    );
    expect(renders).not.toMatch(/writer\?\.custom\s*\(/);
    expect(renders).toContain("useDisabledToolRender");
  });
});
