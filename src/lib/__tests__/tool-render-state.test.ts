import { describe, expect, it } from "vitest";
import {
  getToolRenderErrorMessage,
  isToolRenderEmpty,
  isToolRenderError,
} from "@/lib/tool-render-state";

describe("tool-render-state", () => {
  it("detects error status and envelope", () => {
    expect(isToolRenderError(null, "failed")).toBe(true);
    expect(isToolRenderError({ error: "Quota exceeded" }, "complete")).toBe(true);
    expect(isToolRenderError({ results: [] }, "complete")).toBe(false);
  });

  it("reads error message safely", () => {
    expect(getToolRenderErrorMessage({ error: "Maps quota exceeded" })).toBe(
      "Maps quota exceeded",
    );
    expect(getToolRenderErrorMessage({ error: { message: "Network error" } })).toBe(
      "Network error",
    );
  });

  it("detects empty results", () => {
    expect(isToolRenderEmpty({ results: [] })).toBe(true);
    expect(isToolRenderEmpty({ results: [{ id: "1" }] })).toBe(false);
  });
});
