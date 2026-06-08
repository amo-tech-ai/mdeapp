import Link from "next/link";
import { PartnerSignupWizard } from "@/components/partners/partner-signup-wizard";
import { PartnerSignupNav } from "@/components/partners/partner-signup-nav";
import { PartnerSignupTypePicker } from "@/components/partners/partner-signup-type-picker";
import { getServerUser } from "@/lib/auth/session";
import {
  parsePartnerSignupSearchParams,
  PARTNER_TYPE_LABELS,
} from "@/lib/partners/parse-partner-signup-params";

export const metadata = {
  title: "Partner signup · mdeai",
  description:
    "Join mdeai as an event host, venue, rental broker, or partner. Typed onboarding for Medellín businesses.",
};

type PartnerSignupPageProps = {
  searchParams: Promise<{ type?: string | string[]; draft?: string | string[] }>;
};

function buildSignupPath(type: string, draft?: string) {
  const params = new URLSearchParams({ type });
  if (draft) params.set("draft", draft);
  return `/partners/signup?${params.toString()}`;
}

export default async function PartnerSignupPage({
  searchParams,
}: PartnerSignupPageProps) {
  const params = await searchParams;
  const { type, draftId, typeParam } = parsePartnerSignupSearchParams(params);

  if (!type) {
    return (
      <PartnerSignupTypePicker
        draftId={draftId}
        invalidTypeParam={typeParam}
      />
    );
  }

  const { user } = await getServerUser();
  const loginNextPath = buildSignupPath(type, draftId);
  const typeLabel = PARTNER_TYPE_LABELS[type];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PartnerSignupNav
        contextLabel={`${typeLabel} signup`}
        showBackToPicker
      />
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <PartnerSignupWizard
          partnerType={type}
          draftId={draftId}
          isAuthenticated={Boolean(user)}
          loginNextPath={loginNextPath}
        />
      </main>
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Need a different program?{" "}
        <Link
          href="/partners/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Choose another partner type
        </Link>
      </footer>
    </div>
  );
}
