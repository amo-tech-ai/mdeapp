import { describe, expect, it } from "vitest";
import { isSchemaUnavailableError } from "@/lib/venues/is-schema-unavailable-error";

describe("isSchemaUnavailableError", () => {
  it("detects missing relation and column errors", () => {
    expect(isSchemaUnavailableError({ code: "42P01", message: "relation missing" })).toBe(
      true,
    );
    expect(isSchemaUnavailableError({ code: "42703", message: "column missing" })).toBe(
      true,
    );
    expect(
      isSchemaUnavailableError({
        code: "PGRST205",
        message: "Could not find the table in the schema cache",
      }),
    ).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isSchemaUnavailableError({ code: "23505", message: "duplicate key" })).toBe(
      false,
    );
  });
});
