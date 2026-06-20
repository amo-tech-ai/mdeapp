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

  it("marks /host/dashboard active on the dashboard route", () => {
    expect(isHostNavActive("/host/dashboard", "/host/dashboard")).toBe(true);
  });

  it("does not mark /host/dashboard active on the rentals dashboard", () => {
    expect(isHostNavActive("/host/rentals/dashboard", "/host/dashboard")).toBe(false);
  });

  it("marks rentals home only on exact /host/rentals", () => {
    expect(isHostNavActive("/host/rentals", "/host/rentals")).toBe(true);
    expect(isHostNavActive("/host/rentals/listings", "/host/rentals")).toBe(false);
  });

  it("marks rentals listings on nested listing paths", () => {
    expect(isHostNavActive("/host/rentals/listings", "/host/rentals/listings")).toBe(
      true,
    );
    expect(
      isHostNavActive("/host/rentals/listings/abc", "/host/rentals/listings"),
    ).toBe(true);
  });

  it("marks onboarding active on onboarding route", () => {
    expect(
      isHostNavActive("/host/rentals/onboarding", "/host/rentals/onboarding"),
    ).toBe(true);
  });
});
