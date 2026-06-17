import { describe, expect, it } from "vitest";
import {
  publishActionLabel,
  publishRequiresAck,
  resolvePublishRpc,
} from "../resolve-publish-rpc";

describe("resolvePublishRpc", () => {
  it("maps draft to request_listing_publish", () => {
    expect(resolvePublishRpc("draft")).toBe("request_listing_publish");
  });

  it("maps ready_for_review and paused to publish_listing", () => {
    expect(resolvePublishRpc("ready_for_review")).toBe("publish_listing");
    expect(resolvePublishRpc("paused")).toBe("publish_listing");
  });

  it("maps published to pause_listing", () => {
    expect(resolvePublishRpc("published")).toBe("pause_listing");
  });

  it("returns null for rejected", () => {
    expect(resolvePublishRpc("rejected")).toBeNull();
  });
});

describe("publishRequiresAck", () => {
  it("requires ack for review and paused resume", () => {
    expect(publishRequiresAck("ready_for_review")).toBe(true);
    expect(publishRequiresAck("paused")).toBe(true);
    expect(publishRequiresAck("draft")).toBe(false);
    expect(publishRequiresAck("published")).toBe(false);
  });
});

describe("publishActionLabel", () => {
  it("returns human labels per status", () => {
    expect(publishActionLabel("draft")).toBe("Submit for review");
    expect(publishActionLabel("ready_for_review")).toBe("Approve & publish");
    expect(publishActionLabel("published")).toBe("Pause listing");
  });
});
