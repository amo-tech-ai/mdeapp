import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const V2_FILES = [
  "src/components/copilot/search-tool-renders.tsx",
  "src/components/chat/concierge-coagent-context.tsx",
  "src/components/chat/concierge-copilot-bridge.tsx",
];

describe("CKV2-RE-001 — rental chat uses V2 hooks only", () => {
  for (const rel of V2_FILES) {
    it(`${rel} imports useRenderTool from react-core/v2`, () => {
      const src = readFileSync(resolve(process.cwd(), rel), "utf8");
      expect(src).toMatch(/@copilotkit\/react-core\/v2/);
      expect(src).not.toMatch(/@copilotkit\/react-ui/);
      expect(src).not.toMatch(/useCopilotAction\s*\(/);
    });
  }

  it("search-tool-renders registers rental tool render", () => {
    const src = readFileSync(
      resolve(process.cwd(), "src/components/copilot/search-tool-renders.tsx"),
      "utf8",
    );
    expect(src).toContain("useRenderTool");
    expect(src).toContain("MASTRA_COPILOT_TOOL_ACTIONS");
    expect(src).toContain("searchRentalsParams");
    expect(src).toContain("rentalToolRender");
  });
});
