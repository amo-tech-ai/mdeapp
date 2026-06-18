import Link from "next/link";
import { notFound } from "next/navigation";
import { getRentalDetail } from "@/lib/rentals/get-rental-detail";
import { RentalDetailView } from "@/components/rentals/rental-detail-view";

interface Props {
  params: Promise<{ id: string }>;
}

// skipcq: JS-0067 - Next.js App Router metadata export; not browser global scope
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const detail = await getRentalDetail(id);
    if (detail) return { title: `${detail.title} · ${detail.neighborhood} · mdeai` };
  } catch {
    /* fall through to default */
  }
  return { title: "Rental · mdeai" };
}

/** SAN-1202 · RE-DES-007 — consumer rental detail page `/rentals/[id]`. */
// skipcq: JS-0067 - Next.js App Router page export; not browser global scope
export default async function RentalDetailPage({ params }: Props) {
  const { id } = await params;

  let detail;
  try {
    detail = await getRentalDetail(id);
  } catch (err) {
    console.error("[/rentals/[id]] load failed:", (err as Error).message);
    return (
      <main
        data-testid="rental-detail-error"
        className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center"
      >
        <h1 className="font-serif text-xl font-semibold">Couldn’t load this rental</h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong on our side. Please try again.
        </p>
        <Link
          href="/rentals"
          className="text-sm text-primary hover:underline"
          data-testid="rental-detail-error-back"
        >
          Back to results
        </Link>
      </main>
    );
  }

  if (!detail) notFound();

  return <RentalDetailView detail={detail} />;
}
