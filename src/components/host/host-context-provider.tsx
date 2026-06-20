"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAgentContext } from "@copilotkit/react-core/v2";
import {
  buildHostFocusSummary,
  type HostDateRange,
  type HostFocusRef,
} from "@/lib/host/host-focus-summary";

export { buildHostFocusSummary } from "@/lib/host/host-focus-summary";
export type {
  HostDateRange,
  HostFocusRef,
} from "@/lib/host/host-focus-summary";

/**
 * SAN-1209 · HOST-OS-001 — Global Host Context.
 *
 * Roberto opens Event A, then walks to Analytics → Dashboard. Without shared
 * context the copilot forgets which event he means and he has to re-explain.
 * This provider holds the *persistent* host focus (organization / event / venue
 * / filters / date range) above the routed pages, and publishes a compact
 * summary to `hostOpsAgent` via `useAgentContext` so the AI always knows "we are
 * discussing Event A" — no re-explaining across host screens.
 *
 * This is the context half of the Host OS shell (the chat half is the single
 * persistent CopilotChat in HostOsShell). Both live above {children} in the host
 * layout, so they survive dashboard ↔ events ↔ analytics navigation.
 */

export type HostContextValue = {
  currentOrganization: HostFocusRef | null;
  currentEvent: HostFocusRef | null;
  currentVenue: HostFocusRef | null;
  currentFilters: Record<string, string>;
  currentDateRange: HostDateRange | null;
  setOrganization: (org: HostFocusRef | null) => void;
  setEvent: (event: HostFocusRef | null) => void;
  setVenue: (venue: HostFocusRef | null) => void;
  setFilters: (filters: Record<string, string>) => void;
  setDateRange: (range: HostDateRange | null) => void;
  clearFocus: () => void;
};

const EMPTY_FILTERS: Record<string, string> = {};

const HostContext = createContext<HostContextValue | null>(null);

export function HostContextProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setOrganization] = useState<HostFocusRef | null>(null);
  const [currentEvent, setEvent] = useState<HostFocusRef | null>(null);
  const [currentVenue, setVenue] = useState<HostFocusRef | null>(null);
  const [currentFilters, setFilters] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [currentDateRange, setDateRange] = useState<HostDateRange | null>(null);

  const clearFocus = useCallback(() => {
    setOrganization(null);
    setEvent(null);
    setVenue(null);
    setFilters(EMPTY_FILTERS);
    setDateRange(null);
  }, []);

  const focusSummary = useMemo(
    () =>
      buildHostFocusSummary({
        currentOrganization,
        currentEvent,
        currentVenue,
        currentFilters,
        currentDateRange,
      }),
    [currentOrganization, currentEvent, currentVenue, currentFilters, currentDateRange],
  );

  // Publish the host focus to hostOpsAgent (the surrounding provider's agent).
  // The agent reads this every turn, so the conversation carries the focus
  // across host screens without Roberto repeating himself.
  useAgentContext({
    description:
      "The host's current workspace focus (organization, event, venue, filters, date range). Treat this as the subject of the conversation unless the host says otherwise.",
    value: focusSummary,
  });

  const value = useMemo<HostContextValue>(
    () => ({
      currentOrganization,
      currentEvent,
      currentVenue,
      currentFilters,
      currentDateRange,
      setOrganization,
      setEvent,
      setVenue,
      setFilters,
      setDateRange,
      clearFocus,
    }),
    [currentOrganization, currentEvent, currentVenue, currentFilters, currentDateRange, clearFocus],
  );

  return <HostContext.Provider value={value}>{children}</HostContext.Provider>;
}

/** Read the host focus. Throws if used outside HostContextProvider. */
export function useHostContext(): HostContextValue {
  const ctx = useContext(HostContext);
  if (!ctx) {
    throw new Error("useHostContext must be used within a HostContextProvider");
  }
  return ctx;
}
