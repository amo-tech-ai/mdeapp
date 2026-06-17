import { describe, expect, it } from "vitest";
import { mapPublishTransitionFromRpc } from "../publish-transition-mapper";

describe("publish transition (drawer publish flow)", () => {
  it("maps RPC row for UI state update after publish", () => {
    const transition = mapPublishTransitionFromRpc({
      id: "apt-42",
      listing_workflow_status: "published",
      published_at: "2026-06-16T12:00:00Z",
      published_by: "user-1",
    });

    expect(transition).toEqual({
      apartmentId: "apt-42",
      listingWorkflowStatus: "published",
      publishedAt: "2026-06-16T12:00:00Z",
      publishedBy: "user-1",
    });
  });
});
