import { describe, expect, it, vi, beforeEach } from "vitest";
import { heroRentalIntent, parseRentalIntentFromText } from "@/lib/rental-intent-schema";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn(() => "mock-model"),
}));

import { generateObject } from "ai";
import {
  parseRentalIntentWithGemini,
  rentalIntentSlotsKey,
} from "@/lib/rental-intent-gemini";

const mockedGenerateObject = vi.mocked(generateObject);

describe("GEM-RE-002 · parseRentalIntentWithGemini", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hero prompt matches regex slots when Gemini returns same shape", async () => {
    const regexIntent = heroRentalIntent();
    mockedGenerateObject.mockResolvedValueOnce({
      object: regexIntent,
    } as never);

    const geminiIntent = await parseRentalIntentWithGemini(
      "1BR in Laureles under $80/night",
    );
    expect(geminiIntent).not.toBeNull();
    if (!geminiIntent) throw new Error("expected a Gemini intent");
    expect(rentalIntentSlotsKey(geminiIntent)).toBe(
      rentalIntentSlotsKey(regexIntent),
    );
  });

  it("does not force search_now on impossible query", async () => {
    mockedGenerateObject.mockResolvedValueOnce({
      object: {
        confidence: 0.2,
        action: "skip",
      },
    } as never);

    const intent = await parseRentalIntentWithGemini("castle with private airport");
    expect(intent?.action).not.toBe("search_now");
  });

  it("regex and gemini keys align for provenza nightly query", async () => {
    const regex = parseRentalIntentFromText("2BR provenza under $120/night", {});
    if (!regex) throw new Error("expected a regex intent");
    mockedGenerateObject.mockResolvedValueOnce({
      object: regex,
    } as never);
    const gemini = await parseRentalIntentWithGemini("2BR provenza under $120/night");
    if (!gemini) throw new Error("expected a Gemini intent");
    expect(rentalIntentSlotsKey(gemini)).toBe(rentalIntentSlotsKey(regex));
  });
});
