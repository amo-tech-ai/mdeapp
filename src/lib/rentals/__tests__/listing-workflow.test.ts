import { describe, expect, it } from "vitest";
import {
  assertListingWorkflowTransition,
  canTransitionListingWorkflow,
  isListingWorkflowStatus,
} from "../listing-workflow";

describe("listing workflow FSM", () => {
  it("accepts draft → ready_for_review", () => {
    expect(canTransitionListingWorkflow("draft", "ready_for_review")).toBe(true);
    expect(() => assertListingWorkflowTransition("draft", "ready_for_review")).not.toThrow();
  });

  it("accepts ready_for_review → published", () => {
    expect(canTransitionListingWorkflow("ready_for_review", "published")).toBe(true);
  });

  it("rejects draft → published (skip review)", () => {
    expect(canTransitionListingWorkflow("draft", "published")).toBe(false);
    expect(() => assertListingWorkflowTransition("draft", "published")).toThrow(
      /invalid listing workflow transition/,
    );
  });

  it("rejects published → draft", () => {
    expect(canTransitionListingWorkflow("published", "draft")).toBe(false);
  });

  it("guards unknown status strings", () => {
    expect(isListingWorkflowStatus("draft")).toBe(true);
    expect(isListingWorkflowStatus("publish_status")).toBe(false);
  });
});
