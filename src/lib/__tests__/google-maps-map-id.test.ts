import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEMO_MAP_ID,
  getGoogleMapsMapId,
  hasConfiguredMapId,
  isProductionLikeEnv,
} from "../google-maps-map-id";

describe("google-maps-map-id", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("exports DEMO_MAP_ID constant", () => {
    expect(DEMO_MAP_ID).toBe("DEMO_MAP_ID");
  });

  it("returns env map id when set", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "e50ffcd09fd436de96a02ad2");
    vi.stubEnv("NODE_ENV", "development");
    expect(getGoogleMapsMapId()).toBe("e50ffcd09fd436de96a02ad2");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("trims whitespace from env", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "  real-id  ");
    expect(getGoogleMapsMapId()).toBe("real-id");
  });

  it("returns DEMO_MAP_ID in development when unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "");
    expect(getGoogleMapsMapId()).toBe(DEMO_MAP_ID);
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns undefined in production when unset (never DEMO_MAP_ID)", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(getGoogleMapsMapId()).toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });

  it("returns undefined on Vercel preview when unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(getGoogleMapsMapId()).toBeUndefined();
  });

  it("isProductionLikeEnv for production and preview", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isProductionLikeEnv()).toBe(true);
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isProductionLikeEnv()).toBe(true);
  });

  it("hasConfiguredMapId is true when real id set", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "prod-map");
    expect(hasConfiguredMapId()).toBe(true);
  });

  it("hasConfiguredMapId is false for DEMO fallback", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "");
    expect(hasConfiguredMapId()).toBe(false);
  });
});
