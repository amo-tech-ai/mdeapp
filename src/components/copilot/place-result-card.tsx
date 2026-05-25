type PlaceResultCardProps = {
  title: string;
  subtitle?: string;
  priceLabel?: string;
  testId: string;
};

export function PlaceResultCard({
  title,
  subtitle,
  priceLabel,
  testId,
}: PlaceResultCardProps) {
  return (
    <article
      className="rounded-lg border border-border bg-card p-3 text-sm shadow-sm"
      data-testid={testId}
    >
      <h3 className="font-medium">{title}</h3>
      {subtitle ? (
        <p className="text-muted-foreground">{subtitle}</p>
      ) : null}
      {priceLabel ? (
        <p className="mt-1 text-xs text-muted-foreground">{priceLabel}</p>
      ) : null}
    </article>
  );
}
