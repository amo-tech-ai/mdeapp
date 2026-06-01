type PlaceResultCardProps = {
  title: string;
  subtitle?: string;
  priceLabel?: string;
  evidenceText?: string;
  mapsUrl?: string;
  testId: string;
  pinId?: string;
  selected?: boolean;
  onSelect?: () => void;
};

export function PlaceResultCard({
  title,
  subtitle,
  priceLabel,
  evidenceText,
  mapsUrl,
  testId,
  pinId,
  selected,
  onSelect,
}: PlaceResultCardProps) {
  const interactive = Boolean(onSelect && pinId);
  const previewPin = () => onSelect?.();

  return (
    <article
      className={`rounded-lg border bg-card p-3 text-sm shadow-sm ${
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      } ${interactive ? "cursor-pointer" : ""}`}
      data-testid={testId}
      data-pin-id={pinId}
      data-selected={selected ? "true" : "false"}
      onMouseEnter={interactive ? previewPin : undefined}
      onFocus={interactive ? previewPin : undefined}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <h3 className="font-medium">{title}</h3>
      {subtitle ? (
        <p className="text-muted-foreground">{subtitle}</p>
      ) : null}
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-primary underline-offset-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open in Google Maps
        </a>
      ) : null}
      {priceLabel ? (
        <p className="mt-1 text-xs text-muted-foreground">{priceLabel}</p>
      ) : null}
      {evidenceText ? (
        <p className="mt-1 text-xs text-muted-foreground" data-testid="venue-evidence">
          {evidenceText}
        </p>
      ) : null}
    </article>
  );
}
