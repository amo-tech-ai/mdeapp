import { describe, it, expect } from "vitest";
import {
  activeWorkflowStepIndex,
  toolNameToWorkflowKind,
  WORKFLOW_STEP_LABELS,
} from "@/platform/copilot/workflow-steps";

describe("workflow-steps", () => {
  it("maps Mastra tool action names to workflow kinds", () => {
    expect(toolNameToWorkflowKind("searchRentalsTool")).toBe("rental");
    expect(toolNameToWorkflowKind("search-events")).toBe("event");
    expect(toolNameToWorkflowKind("unknown")).toBeNull();
  });

  it("rental workflow has three labeled steps", () => {
    expect(WORKFLOW_STEP_LABELS.rental).toHaveLength(3);
  });

  it("advances running step index over elapsed time", () => {
    expect(activeWorkflowStepIndex("running", 3, 0)).toBe(0);
    expect(activeWorkflowStepIndex("running", 3, 900)).toBe(1);
    expect(activeWorkflowStepIndex("complete", 3, 0)).toBe(2);
    expect(activeWorkflowStepIndex("idle", 3, 5000)).toBe(-1);
  });
});
