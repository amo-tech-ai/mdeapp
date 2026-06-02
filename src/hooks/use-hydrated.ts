"use client";

import { useSyncExternalStore } from "react";

/** True only after client hydration — gates browser-only UI without setState-in-effect. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
