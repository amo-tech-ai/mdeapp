import { describe, expect, it } from "vitest";
import { mapPublishTransitionFromRpc } from "../publish-transition-mapper";

describe("mapPublishTransitionFromRpc", () => {
  it("maps snake_case apartments RPC row to PublishTransitionResult", () => {
    expect(
      mapPublishTransitionFromRpc({
        id: "aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa",
        listing_workflow_status: "published",
        published_at: "2026-06-17T00:00:00.000Z",
        published_by: "aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa",
      }),
    ).toEqual({
      apartmentId: "aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa",
      listingWorkflowStatus: "published",
      publishedAt: "2026-06-17T00:00:00.000Z",
      publishedBy: "aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa",
    });
  });

  it("rejects unknown workflow status", () => {
    expect(() =>
      mapPublishTransitionFromRpc({
        id: "x",
        listing_workflow_status: "bogus",
        published_at: null,
        published_by: null,
      }),
    ).toThrow(/invalid listing_workflow_status/);
  });
});
