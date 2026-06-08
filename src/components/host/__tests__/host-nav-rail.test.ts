import { describe, expect, it } from "vitest";
import { isHostNavActive } from "@/components/host/host-nav-rail";

describe("isHostNavActive", () => {
  it("marks /host/events active on list route", () => {
    expect(isHostNavActive("/host/events", "/host/events")).toBe(true);
  });

  it("marks /host/events active on nested host events paths", () => {
    expect(isHostNavActive("/host/events/drafts", "/host/events")).toBe(true);
  });

  it("does not mark /host/events active on wizard route", () => {
    expect(isHostNavActive("/host/event/new", "/host/events")).toBe(false);
  });

  it("marks /host/event/new active on wizard route", () => {
    expect(isHostNavActive("/host/event/new", "/host/event/new")).toBe(true);
  });
});
