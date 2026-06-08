import { describe, it, expect } from "vitest";
import { hostInitials, parseEventHostDisplay } from "../parse-host-display";

describe("parseEventHostDisplay", () => {
  it("returns host when host_display is present", () => {
    expect(
      parseEventHostDisplay({
        host_display: {
          name: "Ana Martinez",
          avatar_url: "https://example.com/a.png",
        },
      }),
    ).toEqual({
      name: "Ana Martinez",
      avatarUrl: "https://example.com/a.png",
    });
  });

  it("returns null when host_display name is missing", () => {
    expect(parseEventHostDisplay({ host_display: { avatar_url: "x" } })).toBeNull();
    expect(parseEventHostDisplay({})).toBeNull();
    expect(parseEventHostDisplay(null)).toBeNull();
  });

  it("normalizes empty avatar to null", () => {
    expect(
      parseEventHostDisplay({
        host_display: { name: "Host", avatar_url: "  " },
      }),
    ).toEqual({ name: "Host", avatarUrl: null });
  });
});

describe("hostInitials", () => {
  it("uses up to two initials", () => {
    expect(hostInitials("Ana Martinez")).toBe("AM");
    expect(hostInitials("Roberto")).toBe("R");
  });
});
