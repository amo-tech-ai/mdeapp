import Link from "next/link";
import { PartnerSignupWizard } from "@/components/partners/partner-signup-wizard";
import { PartnerSignupNav } from "@/components/partners/partner-signup-nav";
import { PartnerSignupTypePicker } from "@/components/partners/partner-signup-type-picker";
import { getServerUser } from "@/lib/auth/session";
import {
  buildPartnerSignupPickerPath,
  buildPartnerSignupTypedPath,
  parsePartnerSignupSearchParams,
  PARTNER_CATEGORY_LABELS,
  PARTNER_TYPE_LABELS,
} from "@/lib/partners/parse-partner-signup-params";

export const metadata = {
  title: "Partner signup · mdeai",
  description:
    "Join mdeai as an event host, venue, rental broker, or partner. Typed onboarding for Medellín businesses.",
};

type PartnerSignupPageProps = {
  searchParams: Promise<{
    type?: string | string[];
    draft?: string | string[];
    category?: string | string[];
  }>;
};

export default async function PartnerSignupPage({
  searchParams,
}: PartnerSignupPageProps) {
  const params = await searchParams;
  const { type, draftId, typeParam, category } =
    parsePartnerSignupSearchParams(params);

  if (!type) {
    return (
      <PartnerSignupTypePicker
        draftId={draftId}
        invalidTypeParam={typeParam}
      />
    );
  }

  const { user } = await getServerUser();
  // Preserve category through the login round-trip and prefill the wizard.
  const typedSignupPath = buildPartnerSignupTypedPath(
    type,
    draftId,
    category ?? undefined,
  );
  const initialCategory = category ? PARTNER_CATEGORY_LABELS[category] : undefined;
  const pickerPath = buildPartnerSignupPickerPath(draftId);
  const loginHref = `/login?next=${encodeURIComponent(typedSignupPath)}`;
  const typeLabel = PARTNER_TYPE_LABELS[type];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PartnerSignupNav
        contextLabel={`${typeLabel} signup`}
        showBackToPicker
        pickerHref={pickerPath}
        signInHref={loginHref}
      />
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <PartnerSignupWizard
          partnerType={type}
          draftId={draftId}
          initialCategory={initialCategory}
          isAuthenticated={Boolean(user)}
          loginNextPath={typedSignupPath}
        />
      </main>
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Need a different program?{" "}
        <Link
          href={pickerPath}
          className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Choose another partner type
        </Link>
      </footer>
    </div>
  );
}
