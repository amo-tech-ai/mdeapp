import Link from "next/link";

/** SAN-1202 · RE-DES-007 — not-found / unpublished rental. */
export default function RentalNotFound() {
  return (
    <main
      data-testid="rental-detail-not-found"
      className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center"
    >
      <h1 className="font-serif text-xl font-semibold">Rental not found</h1>
      <p className="text-sm text-muted-foreground">
        This listing may have been unpublished or no longer exists.
      </p>
      <Link
        href="/rentals"
        className="text-sm text-primary hover:underline"
        data-testid="rental-not-found-back"
      >
        Browse rentals
      </Link>
    </main>
  );
}
