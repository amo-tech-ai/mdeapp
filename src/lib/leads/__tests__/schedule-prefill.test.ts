import { describe, expect, it } from "vitest";
import {
  buildSchedulePrefill,
  type SchedulePrefillProfile,
  type SchedulePrefillUser,
} from "@/lib/leads/schedule-prefill";

describe("buildSchedulePrefill (schedule-viewing modal prefill)", () => {
  it("1. signed-in user prefills name, email, and phone", () => {
    const user: SchedulePrefillUser = {
      email: "camila@example.com",
      phone: "+57 300 111 2222",
      user_metadata: null,
    };
    const profile: SchedulePrefillProfile = {
      full_name: "Camila Restrepo",
      email: "camila@example.com",
    };
    expect(buildSchedulePrefill(user, profile)).toEqual({
      name: "Camila Restrepo",
      email: "camila@example.com",
      phone: "+57 300 111 2222",
    });
  });

  it("2. missing phone stays empty (no guessing)", () => {
    const user: SchedulePrefillUser = {
      email: "camila@example.com",
      phone: null,
      user_metadata: { full_name: "Camila Restrepo", phone: null },
    };
    const profile: SchedulePrefillProfile = {
      full_name: "Camila Restrepo",
      email: "camila@example.com",
    };
    const prefill = buildSchedulePrefill(user, profile);
    expect(prefill.phone).toBe("");
    expect(prefill.name).toBe("Camila Restrepo");
    expect(prefill.email).toBe("camila@example.com");
  });

  it("3. signed-out user (null) yields all blank fields", () => {
    expect(buildSchedulePrefill(null, null)).toEqual({
      name: "",
      email: "",
      phone: "",
    });
  });

  it("4. prefill returns plain editable defaults (no locking, just seed values)", () => {
    // The helper only computes string defaults the component seeds into editable
    // state — it never returns flags that would lock a field. A user can always
    // overwrite these before submit.
    const prefill = buildSchedulePrefill(
      { email: "a@b.co", phone: "123", user_metadata: { name: "A B" } },
      null,
    );
    expect(prefill).toEqual({ name: "A B", email: "a@b.co", phone: "123" });
    expect(Object.keys(prefill)).toEqual(["name", "email", "phone"]);
  });

  it("name precedence: profile.full_name wins over auth metadata", () => {
    const prefill = buildSchedulePrefill(
      { email: "x@y.co", user_metadata: { full_name: "Meta Name", name: "Alt" } },
      { full_name: "Profile Name", email: "x@y.co" },
    );
    expect(prefill.name).toBe("Profile Name");
  });

  it("falls back to auth metadata name when profile has none", () => {
    const prefill = buildSchedulePrefill(
      { email: "x@y.co", user_metadata: { name: "Meta Only" } },
      { full_name: null, email: "x@y.co" },
    );
    expect(prefill.name).toBe("Meta Only");
  });

  it("phone falls back to user_metadata.phone when top-level phone is absent", () => {
    const prefill = buildSchedulePrefill(
      { email: "x@y.co", user_metadata: { phone: "+57 301 000 0000" } },
      null,
    );
    expect(prefill.phone).toBe("+57 301 000 0000");
  });

  it("trims whitespace-only values to empty", () => {
    const prefill = buildSchedulePrefill(
      { email: "  ", phone: "   ", user_metadata: { full_name: "   " } },
      { full_name: "  ", email: "  " },
    );
    expect(prefill).toEqual({ name: "", email: "", phone: "" });
  });
});
