import type { MapPinCategory } from "@/platform/contracts";

/** DOM `data-result-kind` + registrar alignment (see UX-010 strategy §3). */
export type ResultKind =
  | "rental"
  | "cafe"
  | "event"
  | "restaurant"
  | "attraction"
  | "grounded"
  | "place";

/** Map-sync props shared by rich list cards (shell extraction: UX-023). */
export type CardInteractionProps = {
  pinId: string;
  /** When omitted, list parents should pass `defaultTestId(resultKind)`. */
  resultKind?: ResultKind;
  selected?: boolean;
  /** Highlight pin — hover/focus/click preview */
  onSelect?: () => void;
  /** Open detail panel/sheet */
  onOpenDetails?: () => void;
  testId?: string;
};

export type BaseResultCardProps = CardInteractionProps & {
  title: string;
  rank?: number;
  className?: string;
};

/** Map list parent implements (DomainResults — UX-022+). */
export type MapSyncedListProps = {
  category: MapPinCategory;
  rows: unknown[];
  result: unknown;
};

export type DetailPanelOpener = (payload: {
  pinId: string;
  placeId?: string;
  title: string;
}) => void;

export const DEFAULT_TEST_IDS: Record<ResultKind, string> = {
  rental: "rental-card",
  cafe: "grounded-card",
  event: "event-card",
  restaurant: "restaurant-card",
  attraction: "attraction-card",
  grounded: "grounded-card",
  place: "place-result-card",
};

export function defaultTestId(kind: ResultKind): string {
  return DEFAULT_TEST_IDS[kind];
}
