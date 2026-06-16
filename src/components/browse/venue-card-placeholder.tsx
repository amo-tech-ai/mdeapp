import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one brand placeholder (D-03 image strategy): a single pale-teal gradient
 * shown when a listing has no photo. Category is conveyed by glyph + label,
 * never by colour — never a grey box or a broken `<img>`.
 */
const TEAL_GRADIENT =
  "linear-gradient(150deg, oklch(0.970 0.015 180), oklch(0.926 0.030 184))";

export type VenueCardPlaceholderProps = {
  /** Visible category label (e.g. "Café", "Nightlife"). */
  label: string;
  /** Lucide glyph element sized by the caller's icon defaults. */
  icon: ReactNode;
  /** Match the host card's media frame. */
  mediaLayout?: "inline" | "cover";
  /** Preserve each card's existing placeholder test id. */
  testId?: string;
};

export function VenueCardPlaceholder({
  label,
  icon,
  mediaLayout = "cover",
  testId,
}: VenueCardPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-primary/70",
        mediaLayout === "cover"
          ? "aspect-[16/10] w-full"
          : "aspect-[16/10] w-24 shrink-0 self-start",
      )}
      style={{ background: TEAL_GRADIENT }}
      data-testid={testId}
      aria-hidden
    >
      <span className="text-primary/60">{icon}</span>
      <span className="text-[11px] font-medium">{label}</span>
    </div>
  );
}
