import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearConciergePendingSend,
  getConciergePendingSendVersion,
  isConciergePendingSend,
  setConciergePendingSend,
  subscribeConciergePendingSend,
} from "@/lib/concierge-pending-store";

describe("concierge-pending-store (UX-005)", () => {
  afterEach(() => {
    clearConciergePendingSend();
  });

  it("starts idle", () => {
    expect(getConciergePendingSendVersion()).toBe(0);
    expect(isConciergePendingSend()).toBe(false);
  });

  it("notifies subscribers when send starts", () => {
    const listener = vi.fn();
    subscribeConciergePendingSend(listener);
    setConciergePendingSend(true);
    expect(getConciergePendingSendVersion()).toBeGreaterThan(0);
    expect(isConciergePendingSend()).toBe(true);
    expect(listener).toHaveBeenCalled();
  });

  it("clears back to idle", () => {
    setConciergePendingSend(true);
    clearConciergePendingSend();
    expect(getConciergePendingSendVersion()).toBe(0);
    expect(isConciergePendingSend()).toBe(false);
  });
});
