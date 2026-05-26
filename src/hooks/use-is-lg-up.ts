"use client";

import { useSyncExternalStore } from "react";

const LG_QUERY = "(min-width: 1024px)";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(LG_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(LG_QUERY).matches;
}

/** SSR / first paint: mobile-first so we never mount two ChatMaps during hydrate. */
function getServerSnapshot() {
  return false;
}

/** Tailwind `lg` breakpoint — desktop map column vs mobile sheet. */
export function useIsLgUp() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
